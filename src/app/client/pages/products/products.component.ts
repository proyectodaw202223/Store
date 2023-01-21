import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { ProductItem } from 'src/app/models/productItem.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public apiStorage: string = environment.apiStorage;

  public allProducts:Product[] = [];
  public filteredProducts:Product[] = [];

  public bisuteria_filter:boolean = false;
  public colgantes_filter:boolean = false;
  public pendientes_filter:boolean = false;
  public pulseras_filter:boolean = false;
  public lana_filter:boolean = false;
  public gorros_filter:boolean = false;
  public patucos_filter:boolean = false;
  

  constructor(
    private _productService:ProductService
  ) { }

  ngOnInit(): void {

    this._productService.getAllProducts().subscribe({
      next: (result) => {
        this.allProducts = result;
        this.filteredProducts = this.allProducts;
        this.filterProducts();
        return result;
      },
      error: (error) => {
        console.error(<any>error);
        return error;
      }
    })
  }

  onNgModelChange(e:boolean){
    if(e){
      this.filterProducts();
    } else {
      this.filterProducts();
    }
  }

  filterProducts(){
    this.filteredProducts = [];

    if (this.bisuteria_filter){
      let filtrado = this.allProducts.filter(producto => producto.category === 'Bisutería');
      for (let producto of filtrado){this.filteredProducts.push(producto);}
    } else {
        if (this.colgantes_filter){
          let filtrado = this.allProducts.filter(producto => producto.subcategory === 'Colgantes');
          for (let producto of filtrado){this.filteredProducts.push(producto);}
        }
        if (this.pendientes_filter){
          let filtrado = this.allProducts.filter(producto => producto.subcategory === 'Pendientes');
          for (let producto of filtrado){this.filteredProducts.push(producto);}
        }
        if (this.pulseras_filter){
          let filtrado = this.allProducts.filter(producto => producto.subcategory === 'Pulseras');
          for (let producto of filtrado){this.filteredProducts.push(producto);}
        }
    }

    if (this.lana_filter){
      let filtrado = this.allProducts.filter(producto => producto.category === 'Lana');
      for (let producto of filtrado){this.filteredProducts.push(producto);}
    } else {
        if (this.gorros_filter){
          let filtrado = this.allProducts.filter(producto => producto.subcategory === 'Gorros');
          for (let producto of filtrado){this.filteredProducts.push(producto);}
        }
        if (this.patucos_filter){
          let filtrado = this.allProducts.filter(producto => producto.subcategory === 'Patucos');
          for (let producto of filtrado){this.filteredProducts.push(producto);}
        }
    }

    if (!this.bisuteria_filter &&
        !this.colgantes_filter &&
        !this.pendientes_filter &&
        !this.pulseras_filter &&
        !this.lana_filter &&
        !this.gorros_filter &&
        !this.patucos_filter
      ){
        this.filteredProducts = this.allProducts;
      }
    
    this.filteredProducts = this.filteredProducts.filter((product) => product.productItems!.length > 0);

    return this.filteredProducts;
  }

  getItemPriceWithDiscount(product: Product): number{
    let biggerDiscount = 0;
    for (let item of product.productItems!){
      if(item.sale !== undefined && item.sale !== null && item.sale.lines !== undefined){
        let discount = item.sale.lines[0].discountPercentage / 100;
        if (discount > biggerDiscount) biggerDiscount = discount
      }
    }
    return product.price * (1 - biggerDiscount);
  }

}
