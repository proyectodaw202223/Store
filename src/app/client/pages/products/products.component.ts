import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public allProducts:Product[] = [];
  public apiStorage: string = environment.apiStorage;

  constructor(
    private _productService:ProductService
  ) { }

  ngOnInit(): void {

    this._productService.getAllProducts().subscribe({
      next: (result) => {
        this.allProducts = result;
        return result;
      },
      error: (error) => {
        console.log(<any>error);
        return error;
      }
    })
  }

}
