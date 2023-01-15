import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductItemImage } from 'src/app/models/productItemImage.model';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductItem } from 'src/app/models/productItem.model';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';
import { OrderLine } from 'src/app/models/orderLine.model';
import { SeasonalSale } from 'src/app/models/seasonalSale.model';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { Console } from 'console';

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
  public customer: Customer = <Customer>{}; 
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
    private _orderService: OrderService,
    private _customerService: CustomerService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    let customerId = Number(sessionStorage.getItem("customerId"));
    this._customerService.getCustomerById(customerId).subscribe({
      next: (result) => {
        this.customer = result;
        console.log('CUSTOMER')
        console.log(result)
      },
      error: (error) => {
        console.log(error);
      }
    })

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

  isUserLoggedIn(): boolean{
    return (sessionStorage.getItem("customerName") !== undefined);
  }

  getCreatedOrder( customerId: number, orders: Order[]): Order | null{
    for (let order of orders){
      if(order.customerId === customerId){
        return order;
      }
    }
    return null;
  }

  isActiveSale(seasonalSale: SeasonalSale): boolean{
    let saleStart = new Date(seasonalSale.validFromDateTime).getTime();
    let saleEnd = new Date(seasonalSale.validToDateTime).getTime();
    let today = new Date().getTime();

    return seasonalSale.isCanceled 
      ? false
      : (saleStart <= today && today <= saleEnd)? true : false;
  }

  getActiveDiscount(productItem: ProductItem): number{
    if (productItem.sale !== undefined){
      if (this.isActiveSale(productItem.sale)){
        if (productItem.sale.lines !== undefined){
          for (let line of productItem.sale.lines){
            if (line.itemId === productItem.id){
              return line.discountPercentage/100;
            }
          }
          return 0;
        } else {
          return 0;
        } 
      } else {
        return 0;
      }    
    } else {
      return 0;
    }
  }

  calculatePriceWithDiscount(productItem: ProductItem): number{
    return this.product.price * (1+this.getActiveDiscount(productItem))
  }

  addItemToOrder( order: Order, selectedItem: ProductItem){
    if(order.lines !== undefined){
      for (let line of order.lines){
        if(line.itemId === selectedItem.id){
          line.amount++;
          return;
        }
      }
      if (order.id !== undefined && selectedItem.id !== undefined){
        let newLine = new OrderLine(
          order.id,
          selectedItem.id,
          1,
          this.calculatePriceWithDiscount(selectedItem),
          this.calculatePriceWithDiscount(selectedItem)
        )
        order.lines.push(newLine);
        order.amount += this.calculatePriceWithDiscount(selectedItem);
        this._orderService.updateOrder(order);
      }
    }  
  }

  createOrder(customer: Customer): Order | any{
    if (customer.id !== undefined){
      let order: Order = new Order(customer.id, 0, '', 'Creado')
      this._orderService.createOrder(order).subscribe({
        next: (result) => {
          return result;
        },
        error: (error) => {
          return error;
        }
      })
    } else {
      return null
    }
  }

  addToCart():void{
    if (this.selectItem()){
      if (this.isUserLoggedIn()){
        this._orderService.getOrdersByStatus('Creado').subscribe({
          next: (result) => {
            let customerId = Number(sessionStorage.getItem("customerId"));
            let createdOrder = this.getCreatedOrder(customerId, result);
            if (createdOrder){
              console.log(createdOrder);
              this.addItemToOrder(createdOrder, this.selectedItem);
            } else {
              let newOrder = this.createOrder(this.customer)
              this.addItemToOrder(newOrder, this.selectedItem)
              console.log(newOrder);
            }
          },
          error: (error) => {
            console.log(<any>error);
            return error;
          }
        })
      } else {
        alert("Please log in to add product to the cart")
      }
    } else {
      console.log('nothing selected')
    }
  }


}
