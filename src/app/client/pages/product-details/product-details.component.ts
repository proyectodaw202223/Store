import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductItemImage } from 'src/app/models/productItemImage.model';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css',
  '../../client.component.css'
]
})
export class ProductDetailsComponent implements OnInit {

  public newProducts: Product[] = [];
  public product: Product = <Product>{}; 
  public apiStorage: string = environment.apiStorage;
  public productColorSize : {[key:string]: string[]} = {};
  public productUniqueImages: ProductItemImage[] = [];

  constructor(
    private _productService: ProductService,
    private _route: ActivatedRoute
  ) { }

  //Slider functionality
  public currentSlide: number = 0;
  public transX: number = 0;

  public changeSlide(direction : string): void {
    if (direction === 'right'){
      if (this.currentSlide == -this.productUniqueImages.length + 1){
        this.currentSlide = 0;
      } else {
        this.currentSlide -= 1;
      }
      this.transX = 300 * this.currentSlide;
    } else {
      if (this.currentSlide == 0){
        this.currentSlide = -2;
      } else {
        this.currentSlide += 1;
      }
      this.transX = 300 * this.currentSlide
    }
    console.log(`${direction} cur slide ${this.currentSlide}`);
  }

  ngOnInit(): void {

    // Populate product, productColorSize and productUniqueImages
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._productService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result;
        if (this.product.productItems !== undefined){
          for (let item of this.product.productItems){
            if (!(item.color in this.productColorSize)){
              this.productColorSize[item.color] = [item.size];
              if ( item.images !== undefined){
                for (let image of item.images){
                  this.productUniqueImages.push(image);
                }
              }
            } else {
              this.productColorSize[item.color].push(item.size);
            }
            
          }
        }
        console.log(this.productUniqueImages);
        console.log(this.productColorSize);
        return result;
      },
      error: (error) => {
        console.log(<any>error);
        return error;
      }
    })
    // Populate newProducts
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

  }

}
