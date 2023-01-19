import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeasonalSale } from 'src/app/models/seasonalSale.model';
import { SeasonalSaleService } from 'src/app/services/seasonalSale.service';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.css', '../../admin.component.css']
})
export class DescuentosComponent implements OnInit {

  public seasonalSalesMap = new Map<number, SeasonalSale>();

  constructor(
    private seasonalSaleService: SeasonalSaleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      window.location.replace('/admin');

    this.getSeasonalSales();
  }

  getSeasonalSales(): void {
    this.seasonalSaleService.getAllSeasonalSales().subscribe({
      next: (result: Array<SeasonalSale>) => {
        this.seasonalSalesMap = new Map(
          result.map((sale) => [(sale.id === undefined) ? 0 : sale.id, sale])
        );
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onSelectAllSalesCheckboxChange(event: Event): void {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-sale-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }

  onNewSaleButtonClick(event: Event): void {
    this.router.navigate(['detdescuentos']);
  }

  onDeleteSaleButtonClick(event: Event): void {
    if (!window.confirm("Se eliminarán las ofertas seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-sale-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var saleId = checkboxCollection.item(i)?.value;

      if (saleId === undefined)
        continue;

      this.deleteSale(parseInt(saleId));
    }
  }

  deleteSale(saleId: number): void {
    this.seasonalSaleService.deleteSeasonalSale(saleId).subscribe({
      next: (result) => {
        this.seasonalSalesMap.delete(saleId);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onCancelSaleButtonClick(event: Event): void {
    if (!window.confirm("Se cancelarán las ofertas seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-sale-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var saleId = checkboxCollection.item(i)?.value;

      if (saleId === undefined)
        continue;

      this.cancelSale(parseInt(saleId));
    }
  }

  cancelSale(saleId: number): void {
    var seasonalSale = this.seasonalSalesMap.get(saleId);

    if (seasonalSale === undefined || seasonalSale.isCanceled)
      return;
    
    seasonalSale.isCanceled = true;
    seasonalSale.canceledAtDateTime = this.formatDate(new Date());

    this.seasonalSaleService.updateSeasonalSale(seasonalSale).subscribe({
      next: (result) => {
        var updatedSeasonalSale = result as SeasonalSale;
        if (updatedSeasonalSale.id !== undefined)
          this.seasonalSalesMap.set(updatedSeasonalSale.id, updatedSeasonalSale);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
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
}
