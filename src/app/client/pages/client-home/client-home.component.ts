import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {

  public newProducts: Product[] = [];

  constructor(
    private _productService : ProductService
  ) { }

  ngOnInit(): void { 
    this._productService.getNewProducts(5).subscribe({
      next: (result) => {
        this.newProducts = result;
        console.log(this.newProducts);
        return result;
      },
      error: (error) => {
        console.log(<any>error);
        return error;
      }
    })
  }
}
