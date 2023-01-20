import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductItem } from 'src/app/models/productItem.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductItemService } from 'src/app/services/productItem.service';
import { ProductItemImageService } from 'src/app/services/productItemImage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detitem',
  templateUrl: './detitem.component.html',
  styleUrls: ['./detitem.component.css', '../../admin.component.css']
})
export class DetitemComponent implements OnInit {

  public item = new ProductItem(0, '', 0, '');
  public apiStorage: string = environment.apiStorage;
  private isEditing = false;

  constructor(
    private productService: ProductService,
    private productItemService: ProductItemService,
    private productItemImageService: ProductItemImageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      window.location.replace('/admin');
      
    this.activatedRoute.params.subscribe((params) => {
      this.isEditing = (params['itemId']) ? true : false;

      if (this.isEditing) {
        this.getItem(params['itemId']);
      } else {
        this.getNewItem(params['productId']);
      }
    });
  }

  getItem(itemId: number): void {
    this.productItemService.getItemById(itemId).subscribe({
      next: (result) => {
        this.item = result as ProductItem;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  getNewItem(productId: number = this.item.productId): void {
    this.productService.getProductById(productId).subscribe({
      next: (result) => {
        this.item.product = result as Product;
        this.item.productId = productId;
        this.item.id = undefined;
        this.item.color = '';
        this.item.size = '';
        this.item.stock = 0;
        this.item.images = [];
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onNewItemButtonClick(event: Event): void {
    if (this.isEditing) {
      this.router.navigate(['detitem/product/', this.item.productId]);
    } else {
      this.getNewItem();
    }
  }

  onDeleteItemButtonClick(event: Event): void {
    if (!window.confirm("Se eliminará el item " + ((this.item.id === undefined) ? 0 : this.item.id) + " ¿Desea continuar?"))
      return;

    if (this.item.id === undefined) {
      if (this.isEditing)
        this.router.navigate(['detitem/product/', this.item.productId]);
      else
        this.getNewItem();
    } else {
      this.deleteItem(this.item.id);
    }
  }

  deleteItem(itemId: number): void {
    this.productItemService.deleteItem(itemId).subscribe({
      next: (result) => {
        if (this.isEditing)
          this.router.navigate(['detitem/product/', this.item.productId]);
        else
          this.getNewItem();
        console.log("Product item " + itemId + " successfully deleted.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onSaveItemButtonClick(event: Event): void {
    if (this.isEditing) {
      if (this.validateUpdateItem())
        this.updateItem();
    } else {
      if (this.validateCreateItem())
        this.createItem();
    }
  }

  validateCreateItem(): boolean {
    if (!this.item.productId) {
      window.alert("El item debe estar asociado a un producto.");
      return false;
    }

    if (!this.item.color) {
      window.alert("El campo color es obligatorio.");
      return false;
    }

    if (!new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").test(this.item.color)) {
      window.alert("El color debe especificarse en formato hexadecimal (#505050, #B2B2B2...)");
      return false;
    }

    if (!this.item.size) {
      window.alert("El campo talla es obligatorio.");
      return false;
    }

    if (this.item.stock < 0) {
      window.alert("El stock no puede ser negativo.");
      return false;
    }

    if (this.item.stock % 1 != 0) {
      window.alert("El stock debe ser un número entero.");
      return false;
    }

    return true;
  }

  createItem(): void {
    this.productItemService.createItem(this.item).subscribe({
      next: (result) => {
        this.item = result as ProductItem;
        window.alert("Item creado correctamente.");
        this.router.navigate(['detitem/item/', this.item.id]);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  validateUpdateItem(): boolean {
    if (!this.item.id || !this.item.updated_at) {
      window.alert("Se produjo un error inesperado.");
      return false;
    }

    return this.validateCreateItem();
  }

  updateItem(): void {
    this.productItemService.updateItem(this.item).subscribe({
      next: (result) => {
        this.item = result as ProductItem;
        window.alert("Item actualizado correctamente.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onDeleteItemImageButtonClick(event: Event): void {
    if (!window.confirm("La imagen se eliminará permanentemente ¿Desea continuar?"))
      return;

    var button = event.target as HTMLButtonElement;
    this.deleteItemImage(parseInt(button.value));
  }

  deleteItemImage(imageId: number): void {
    this.productItemImageService.deleteItemImage(imageId).subscribe({
      next: (result) => {
        this.item.images = this.item.images?.filter((image) => image.id != imageId);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onItemImageUploadChange(event: Event): void {
    var input = event.target as HTMLInputElement;

    if (input.files == null || !this.validateInputFiles(input.files)) {
      return;
    }

    for (let i = 0; i < input.files.length; i++) {
      let file = input.files.item(i);

      if (file == null)
        continue;
      
      this.uploadImage(file);
    }
  }

  validateInputFiles(files: FileList): boolean {
    var typeRegExp = new RegExp("image/*");

    if (!this.isEditing) {
      window.alert("El items no está creado todavía guarda los cambios para poder añadir imágenes.");
      return false;
    }

    for (let i = 0; i < files.length; i++) {
      let file = files.item(i);

      if (file == null)
        continue;

      if (!typeRegExp.test(file.type)) {
        window.alert("Solo se permiten archivos de tipo imagen.");
        return false;
      }
    }

    return true;
  }

  uploadImage(image: File): void {
    var formData = new FormData();

    if (this.item.id === undefined)
      return;

    formData.append('image', image);
    formData.append('itemId', this.item.id.toString());

    this.productItemImageService.createItemImage(formData).subscribe({
      next: (result) => {
        if (this.item.id !== undefined)
          this.getItem(this.item.id);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }
}
