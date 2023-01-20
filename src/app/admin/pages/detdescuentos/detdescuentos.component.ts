import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItem } from 'src/app/models/productItem.model';
import { SeasonalSale } from 'src/app/models/seasonalSale.model';
import { SeasonalSaleLine } from 'src/app/models/seasonalSaleLine.model';
import { ProductItemService } from 'src/app/services/productItem.service';
import { SeasonalSaleService } from 'src/app/services/seasonalSale.service';

@Component({
  selector: 'app-detdescuentos',
  templateUrl: './detdescuentos.component.html',
  styleUrls: ['./detdescuentos.component.css', '../../admin.component.css']
})
export class DetdescuentosComponent implements OnInit {

  public seasonalSale = new SeasonalSale('', '', '', '', false, '');
  public productItemsWithoutDiscountMap = new Map<number, ProductItem>();
  public defaultDiscountPct = 15;
  public disableEdit = false;
  public canBeCanceled = false;

  private isEditing = false;
  private lastValidFromDateTime = "";
  private lastValidToDateTime = "";
  private lastDefaultDiscountPct = this.defaultDiscountPct;

  constructor(
    private seasonalSaleService: SeasonalSaleService,
    private productItemService: ProductItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      window.location.replace('/admin');
      
    this.activatedRoute.params.subscribe((params) => {
      this.isEditing = (params['id']) ? true : false;

      this.disableEdit = false;
      this.canBeCanceled = false;

      if (this.isEditing) {
        this.getSeasonalSale(params['id']);
      } else {
        this.getProductItems();
      }
    });
  }

  getSeasonalSale(id: number): void {
    this.seasonalSaleService.getSeasonalSaleById(id).subscribe({
      next: (result) => {
        this.seasonalSale = result as SeasonalSale;
        this.getDisableEdit();
        this.getProductItems();
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  getDisableEdit(): void {
    var currentDateTime = new Date();
    var validFromDateTime = new Date(this.seasonalSale.validFromDateTime);
    var validToDateTime = new Date(this.seasonalSale.validToDateTime);
    var isSaleStarted = (validFromDateTime <= currentDateTime);
    var isSaleFinished = (validToDateTime <= currentDateTime);

    this.disableEdit = (this.seasonalSale.isCanceled || isSaleStarted) ? true : false;
    this.canBeCanceled = !isSaleFinished && !this.seasonalSale.isCanceled;

    console.log(isSaleFinished);
    console.log(this.seasonalSale.isCanceled);
    console.log(this.canBeCanceled);
  }

  getProductItems(): void {
    this.productItemService.getAllItems().subscribe({
      next: (result: Array<ProductItem>) => {
        this.productItemsWithoutDiscountMap = new Map(
          result.map((item) => [(item.id === undefined) ? 0 : item.id, item])
        );

        if (this.isEditing) {
          this.filterProductItemsMap();
        }
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  filterProductItemsMap(): void {
    if (this.seasonalSale.lines === undefined)
      return;

    for (let line of this.seasonalSale.lines) {
      if (line.productItem === undefined || line.productItem.id === undefined)
        continue;

      this.productItemsWithoutDiscountMap.delete(line.productItem.id);
    }
  }

  onSelectAllSaleLinesCheckboxChange(event: Event): void {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-sale-lines-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }

  onSelectAllItemsWithoutDiscountCheckboxChange(event: Event): void {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-item-without-discount-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }

  onNewSaleButtonClick(event: Event): void {
    this.router.navigate(['detdescuentos']);
    window.location.reload();
  }

  onDeleteSaleButtonClick(event: Event): void {
    if (!window.confirm("Se eliminará la rebaja " + this.seasonalSale.id + ", " + this.seasonalSale.slogan + " ¿Desea continuar?"))
      return;
    
    if (this.seasonalSale.id !== undefined)
      this.deleteSale(this.seasonalSale.id);

    if (this.isEditing)
      this.router.navigate(['detdescuentos']);
    else
      window.location.reload();
  }

  deleteSale(saleId: number): void {
    this.seasonalSaleService.deleteSeasonalSale(saleId).subscribe({
      next: (result) => {
        console.log("Sale " + saleId + " successfully deleted.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onSaveSaleButtonClick(event: Event): void {
    if (this.isEditing) {
      if (this.validateUpdateSale())
        this.updateSale();
    } else {
      if (this.validateCreateSale())
        this.createSale();
    }
  }

  validateCreateSale(): boolean {
    if (!this.seasonalSale.slogan) {
      window.alert("El campo slogan es obligatorio.");
      return false;
    }

    if (!this.seasonalSale.validFromDateTime) {
      window.alert("El campo Válido desde es obligatorio.");
      return false;
    }

    if (!this.seasonalSale.validToDateTime) {
      window.alert("El campo Válido hasta es obligatorio.");
      return false;
    }

    if (this.seasonalSale.lines !== undefined) {
      for (let line of this.seasonalSale.lines) {
        if (line.discountPercentage <= 0 || line.discountPercentage > 100) {
          window.alert("El porcentaje de descuento debe ser mayor que 0 y menor que 100.");
          return false;
        }
      }
    }

    return true;
  }

  createSale(): void {
    this.seasonalSaleService.createSeasonalSale(this.seasonalSale).subscribe({
      next: (result) => {
        this.seasonalSale = result as SeasonalSale;
        window.alert("Rebaja creada correctamente.");
        this.router.navigate(['detdescuentos/' + this.seasonalSale.id]);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  validateUpdateSale(): boolean {
    if (!this.seasonalSale.id || !this.seasonalSale.updated_at) {
      window.alert("Se produjo un error inesperado.");
      return false;
    }

    return this.validateCreateSale();
  }

  updateSale(): void {
    this.seasonalSaleService.updateSeasonalSale(this.seasonalSale).subscribe({
      next: (result) => {
        this.seasonalSale = result as SeasonalSale;
        this.getDisableEdit();
        window.alert("Rebaja actualizada correctamente.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onCancelSaleButtonClick(event: Event): void {
    if (this.seasonalSale.id === undefined) {
      window.alert("La rebaja no se ha creado todavía por lo que no es posible cancelarla.");
      return;
    }
    this.seasonalSale.isCanceled = true;
    this.seasonalSale.canceledAtDateTime = this.formatDate(new Date());
    this.updateSale();
  }

  formatDate(date: Date): string {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  onDeleteSaleLineButtonClick(event: Event): void {
    if (!window.confirm("Se eliminarán los descuentos de los items seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-sale-lines-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var productItemId = checkboxCollection.item(i)?.value;

      if (productItemId === undefined)
        continue;

      this.deleteSaleLine(parseInt(productItemId));
    }
  }

  deleteSaleLine(productItemId: number): void {
    var saleLine = this.seasonalSale.lines?.filter((line) => line.productItem?.id == productItemId)[0];

    if (saleLine === undefined)
      return;

    var index = this.seasonalSale.lines?.indexOf(saleLine);

    if (index === undefined)
      return;

    this.seasonalSale.lines?.splice(index, 1);

    if (saleLine.productItem === undefined || saleLine.productItem.id === undefined) 
      return;

    this.productItemsWithoutDiscountMap.set(saleLine.productItem.id, saleLine.productItem);
  }

  onAddDiscountButtonClick(event: Event): void {
    if (this.seasonalSale.id === undefined) {
      window.alert("Guarda los cambios realizados a la rebaja antes de añadir descuentos.");
      return;
    }

    if (!window.confirm("Se añadirá un descuentos de los items seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-item-without-discount-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var productItemId = checkboxCollection.item(i)?.value;

      if (productItemId === undefined)
        continue;

      this.createSaleLine(parseInt(productItemId));
    }
  }

  createSaleLine(productItemId: number): void {
    this.productItemService.getItemById(productItemId).subscribe({
      next: (result) => {
        if (this.seasonalSale.id === undefined)
          return;

        this.seasonalSale.lines?.push(new SeasonalSaleLine(
          this.seasonalSale.id,
          productItemId,
          this.defaultDiscountPct,
          result as ProductItem
        ));

        this.productItemsWithoutDiscountMap.delete(productItemId);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onValidFromFocus(event: Event): void {
    this.lastValidFromDateTime = this.seasonalSale.validFromDateTime;
  }

  onValidFromFocusout(event: Event): void {
    var validFromDateTime = new Date(this.seasonalSale.validFromDateTime);
    var validToDateTime = new Date(this.seasonalSale.validToDateTime);
    var currentDateTime = new Date();

    if (validFromDateTime >= validToDateTime) {
      this.seasonalSale.validFromDateTime = this.lastValidFromDateTime;
      window.alert("La fecha 'Válido desde' no puede ser posterior a la fecha 'Válido hasta'.");
    }

    if (validFromDateTime <= currentDateTime) {
      this.seasonalSale.validFromDateTime = this.lastValidFromDateTime;
      window.alert("La fecha 'Válido desde' no puede ser anterior a la fecha actual.");
    }
  }

  onValidToFocus(event: Event): void {
    this.lastValidToDateTime = this.seasonalSale.validToDateTime;
  }

  onValidToFocusout(event: Event): void {
    var validFromDateTime = new Date(this.seasonalSale.validFromDateTime);
    var validToDateTime = new Date(this.seasonalSale.validToDateTime);
    var currentDateTime = new Date();

    if (validToDateTime <= validFromDateTime || validToDateTime <= currentDateTime) {
      this.seasonalSale.validToDateTime = this.lastValidToDateTime;
      window.alert("La fecha 'Válido hasta' no puede ser anterior a la fecha 'Válido desde' o la fecha actual.");
    }
  }

  onDefaultDiscountFocus(event: Event): void {
    this.lastDefaultDiscountPct = this.defaultDiscountPct;
  }

  onDefaultDiscountFocusout(event: Event): void {
    if (this.defaultDiscountPct > 100 || this.defaultDiscountPct <= 0) {
      this.defaultDiscountPct = this.lastDefaultDiscountPct;
      window.alert("El porcentaje de descuento por defecto debe ser mayor que 0 y menor o igual a 100.");
    }
  }
}
