import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css', '../../admin.component.css']
})
export class ProductosComponent implements OnInit {

  public productsMap = new Map<number, Product>();
  public filteredProductsMap = new Map<number, Product>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!('userRole' in sessionStorage))
      window.location.replace('/admin');
      
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe({
        next: (result: Array<Product>) => {
          this.productsMap = new Map(
            result.map((product) => [(product.id === undefined) ? 0 : product.id, product]
          ));

          this.filteredProductsMap = new Map(this.productsMap);
        },
        error: (error) => {
          window.alert(error.error.error);
          console.error(error);
        }
    });
  }

  onSelectAllProductsCheckboxChange(event: Event) {
    var selectAllCheckbox = event.target as HTMLInputElement;
    var checkboxCollection = document.getElementsByClassName('select-product-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    
    for (let i = 0; i < checkboxCollection.length; i++) {
      let checkbox = checkboxCollection.item(i);

      if (checkbox != null) {
        checkbox.checked = selectAllCheckbox.checked;
      }
    }
  }

  onFilterChange(event: Event): void {
    var categoryFilter = document.querySelector("#category-filter") as HTMLSelectElement;
    var subcategoryFilter = document.querySelector("#subcategory-filter") as HTMLSelectElement;
    var category = categoryFilter.selectedOptions[0].value;
    var subcategory = subcategoryFilter.selectedOptions[0].value;

    this.filteredProductsMap.clear();

    this.productsMap.forEach((product) => {
      if (((product.category == category) || !category) &&
          ((product.subcategory == subcategory) || !subcategory)) {
        this.filteredProductsMap.set((product.id === undefined) ? 0 : product.id, product);
      }
    });
  }

  onNewProductButtonClick(event: Event): void {
    this.router.navigate(['detproductos']);
  }

  onDeleteProductButtonClick(event: Event): void {
    if (!window.confirm("Se eliminarán los productos seleccionados ¿Desea continuar?"))
      return;

    var checkboxCollection = document.getElementsByClassName('select-product-checkbox') as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < checkboxCollection.length; i++) {
      if (!checkboxCollection.item(i)?.checked)
        continue;

      var productId = checkboxCollection.item(i)?.value;

      if (productId === undefined)
        continue;

      this.deleteProduct(parseInt(productId));
    }
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe({
      next: (result) => {
        this.productsMap.delete(productId);
        this.filteredProductsMap.delete(productId);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }
}
