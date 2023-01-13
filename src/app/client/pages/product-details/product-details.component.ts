import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductItemImage } from 'src/app/models/productItemImage.model';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductItem } from 'src/app/models/productItem.model';

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

  public productOneSize: boolean = false;
  public productColorOptions: number = 0;
  public selectedColorSizes: string[] = [];
  public selectedColor: string = '';
  public selectedSize: string = '';

  public selectedItem: ProductItem = <ProductItem>{};

  constructor(
    private _productService: ProductService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {


    // Populate product, productColorSize and productUniqueImages
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._productService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result;
        console.log(this.product);
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
          this.productColorOptions = Object.keys(this.productColorSize).length; 
          if (this.productColorOptions === 1){
            this.selectedColor = Object.keys(this.productColorSize)[0];
            this.selectedColorSizes = this.productColorSize[this.selectedColor];
            if (this.selectedColorSizes.length === 1) {
              this.productOneSize = true;
              this.selectedSize = this.selectedColorSizes[0];
            };
          }
        }
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
      this.transX = 450 * this.currentSlide;
    } else {
      if (this.currentSlide == 0){
        this.currentSlide = -(this.productUniqueImages.length - 1);
      } else {
        this.currentSlide += 1;
      }
      this.transX = 450 * this.currentSlide
    }
  }

  colorSelected(selectedColor:string): void{
    this.selectedColorSizes = this.productColorSize[selectedColor];
    this.selectedColor = selectedColor;
    this.selectedSize = this.selectedColorSizes[0];
  }

  sizeSelected(selectedSize:string): void{
    this.selectedSize = selectedSize;
  }

  selectItem():ProductItem | null{
    if( this.selectedColor !== '' && this.selectedSize !== ''){
      let selectedItem = this.product.productItems?.filter(
        (item) => item.color === this.selectedColor && item.size === this.selectedSize
      )
      if (selectedItem !== undefined){
        this.selectedItem =   selectedItem[0];
      }
      return this.selectedItem;
    } else {
      console.log(`No selected item. SelColor:${this.selectedColor} SelSize:${this.selectedSize}`);
      return null;
    }
  }

  addToCart():void{
    if (this.selectItem()){
      sessionStorage.getItem("customerName")
        ? console.log('item selected client loged in')
        : alert("Please log in to add product to the cart")
    } else {
      console.log('nothing selected')
    }
  }


}
