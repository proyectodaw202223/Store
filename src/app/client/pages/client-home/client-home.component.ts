import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { ProductItem } from 'src/app/models/productItem.model';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: [
    './client-home.component.css',
    '../../client.component.css'
  ]
})
export class ClientHomeComponent implements OnInit {

  public newProducts: Product[] = [];
  public productsForSale: Product[] = [];
  public apiStorage: string = environment.apiStorage;

  constructor(
    private _productService : ProductService
  ) { }

  ngOnInit(): void { 

    this._productService.getNewProducts(0).subscribe({
      next: (result) => {
        this.newProducts = result;
        this.newProducts = this.newProducts.filter((product) => product.productItems!.length > 0);
        this.newProducts = this.newProducts.slice(0, 5);
        return result;
      },
      error: (error) => {
        console.error(<any>error);
        return error;
      }
    })

    this._productService.getProductsForSale(5).subscribe({
      next: (result) => {
        this.productsForSale = result;
        return result;
      },
      error: (error) => {
        console.error(<any>error);
        return error;
      }
    })
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
