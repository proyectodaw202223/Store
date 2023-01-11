import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

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

    this._productService.getNewProducts(5).subscribe({
      next: (result) => {
        this.newProducts = result;
        return result;
      },
      error: (error) => {
        console.log(<any>error);
        return error;
      }
    })

    this._productService.getProductsForSale(5).subscribe({
      next: (result) => {
        this.productsForSale = result;
        return result;
      },
      error: (error) => {
        console.log(<any>error);
        return error;
      }
    })
  }
}
