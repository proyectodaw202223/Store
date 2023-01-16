import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductItemService } from 'src/app/services/productItem.service';

@Component({
  selector: 'app-detproductos',
  templateUrl: './detproductos.component.html',
  styleUrls: ['./detproductos.component.css', '../../admin.component.css']
})
export class DetproductosComponent implements OnInit {

  public product = new Product('', '', 0.00, '', '');
  private isEditing = false;

  constructor(
    private productService: ProductService,
    private productItemService: ProductItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      this.router.navigate(['/admin']);
      
    this.activatedRoute.params.subscribe((params) => {
      this.isEditing = (params['id']) ? true : false;

      if (this.isEditing) {
        this.getProduct(params['id']);
      }
    });
  }

  getProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result as Product;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onNewProductButtonClick(event: Event): void {
    this.router.navigate(['detproductos']);
  }

  onDeleteProductButtonClick(event: Event): void {
    if (!window.confirm("Se eliminará el producto " + this.product.id + ", " + this.product.name + " ¿Desea continuar?"))
      return;

    if (this.product.id !== undefined)
      this.deleteProduct(this.product.id);
    
    this.router.navigate(['detproductos']);
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe({
      next: (result) => {
        console.log("Product " + productId + " successfully deleted.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onSaveProductButtonClick(event: Event): void {
    if (this.isEditing) {
      if (this.validateUpdateProduct())
        this.updateProduct();
    } else {
      if (this.validateCreateProduct())
        this.createProduct();
    }
  }

  validateCreateProduct(): boolean {
    if (!this.product.name) {
      window.alert("El campo nombre es obligatorio.");
      return false;
    }

    if (!this.product.price) {
      window.alert("El campo precio es obligatorio.");
      return false;
    }

    if (!this.product.category) {
      window.alert("El campo categoría es obligatorio.");
      return false;
    }

    if (!this.product.description) {
      window.alert("El campo descripción es obligatorio.");
      return false;
    }

    return true;
  }

  createProduct(): void {
    this.productService.createProduct(this.product).subscribe({
      next: (result) => {
        this.product = result as Product;
        this.isEditing = true;
        window.alert("Producto creado correctamente.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  validateUpdateProduct(): boolean {
    if (!this.product.id || !this.product.updated_at) {
      window.alert("Se produjo un error inesperado.");
      return false;
    }

    return this.validateCreateProduct();
  }

  updateProduct(): void {
    this.productService.updateProduct(this.product).subscribe({
      next: (result) => {
        this.product = result as Product;
        window.alert("Producto actualizado correctamente.");
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onNewItemButtonClick(event: Event): void {
    this.router.navigate(['detitem/product/', this.product.id]);
  }

  onDeleteItemButtonClick(event: Event): void {
    if (!window.confirm("Se eliminarán los items seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-item-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var itemId = checkboxCollection.item(i)?.value;

      if (itemId === undefined)
        continue;

      this.deleteItem(parseInt(itemId));
    }
  }

  deleteItem(id: number): void {
    this.productItemService.deleteItem(id).subscribe({
      next: (result) => {
        this.product.productItems = this.product.productItems?.filter((item) => item.id != id);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onSelectAllItemsCheckboxChange(event: Event): void {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-item-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }
}
