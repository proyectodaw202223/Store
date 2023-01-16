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
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

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
    private _orderService: OrderService,
    private _customerService: CustomerService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Populate product, selectedItem productColorSize and productUniqueImages
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._productService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result;
        if (this.product.productItems !== undefined){
          this.selectedItem = this.product.productItems[0];
          this.selectedColor = this.selectedItem.color;
          this.selectedSize = this.selectedItem.size;
          console.log("selected item")
          console.log(this.selectedItem)
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
          this.selectedColorSizes = this.productColorSize[this.selectedColor]
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
      let selectedItemArray = this.product.productItems?.filter(
        (item) => item.color === this.selectedColor && item.size === this.selectedSize
      )
      if (selectedItemArray !== undefined){
        this.selectedItem = selectedItemArray[0];
      }
      return this.selectedItem;
    } else {
      console.log(`No selected item. SelColor:${this.selectedColor} SelSize:${this.selectedSize}`);
      return null;
    }
  }

  isUserLoggedIn(): boolean{
    return (sessionStorage.getItem("customerName") !== null);
  }

  // NUEVOS METODOS

  getItemPriceWithDiscount(productItem: ProductItem): number{
    if (this.selectedItem !== undefined){
      let discount = 0;
      if(this.selectedItem.sale !== undefined && this.selectedItem.sale !== null && this.selectedItem.sale.lines !== undefined){
        discount = this.selectedItem.sale.lines[0].discountPercentage / 100;
        console.log(`descuento es ${discount}`)
      } 
      return this.product.price * (1 - discount);
    } else return this.product.price;
  }

  createNewOrder(){
    /* if (this.selectedItem !== undefined){
      let discount = 0;
      let newLine: OrderLine = <OrderLine>{};
      if(this.selectedItem.sale !== undefined && this.selectedItem.sale !== null && this.selectedItem.sale.lines !== undefined){
        discount = this.selectedItem.sale.lines[0].discountPercentage / 100;
        console.log(`descuento es ${discount}`)
      } 
    let priceWithDiscount = this.product.price * (1 - discount); */
    let newLine: OrderLine = <OrderLine>{};
    let priceWithDiscount = this.getItemPriceWithDiscount(this.selectedItem);
    if (this.selectedItem.id !== undefined){
      newLine = new OrderLine(0,this.selectedItem.id, 1, priceWithDiscount, priceWithDiscount)
      console.log(newLine)
    }
    let newOrder = new Order (Number(sessionStorage.getItem("customerId")), priceWithDiscount, '', 'Creado', '', [newLine])
    this._orderService.createOrder(newOrder).subscribe({
      next: (result) => {
        console.log("order creado");
        console.log(result)
        alert("Producto añadido al carrito")
      },
      error: (error) => {
        console.log('error al crear')
        console.log(error)
        alert("Ha ocurrido un error inesperado")
      }
    })
  }

  addOrderLine(order:Order){
    /* if (this.selectedItem !== undefined){
      let discount = 0;
      let newLine: OrderLine;
      if(this.selectedItem.sale !== undefined && this.selectedItem.sale !== null && this.selectedItem.sale.lines !== undefined){
        discount = this.selectedItem.sale.lines[0].discountPercentage / 100;
        console.log(`descuento es ${discount}`)
      } else {
        console.log("el descuento es cero")
      } */
    let newLine: OrderLine = <OrderLine>{};
    let priceWithDiscount = this.getItemPriceWithDiscount(this.selectedItem);
    if (this.selectedItem.id !== undefined){
      newLine = new OrderLine(0,this.selectedItem.id, 1, priceWithDiscount, priceWithDiscount)
      console.log(newLine)
      if (order.lines !== undefined){
        order.lines.push(newLine);
        order.amount = Number(order.amount) + priceWithDiscount;
        console.log('order.lines no es undefined')
        console.log(order.amount)
        console.log(order)
      } else {
        console.log('order.lines es undefined')
        return
      }
      this._orderService.updateOrder(order).subscribe({
        next: (result) => {
          console.log("order para updatear ADD LINE")
          console.log(order);
          console.log("order updateado ADD LINE");
          console.log(result)
          alert("Producto añadido al carrito")
        },
        error: (error) => {
          console.log("order para updatear ADD LINE")
          console.log(order);
          console.log('error al updatear')
          console.log(error)
          alert("Ha ocurrido un error inesperado")
        }
      })
    }
  }

  updateOrderLine(order:Order, line:OrderLine){
    let newQuantity = line.quantity + 1;
    let newAmount = line.priceWithDiscount * newQuantity;
    order.amount = order.amount - line.amount + newAmount;
    line.amount = newAmount;
    line.quantity = newQuantity;
    this._orderService.updateOrder(order).subscribe({
      next: (result) => {
        console.log("order para updatear")
        console.log(order);
        console.log("order updateado");
        console.log(result)
        alert("Producto añadido al carrito")
      },
      error: (error) => {
        console.log('error al updatear')
        console.log(error)
        alert("Ha ocurrido un error inesperado")
      }
    })
  }

  updateExistingOrder(order: Order){
    console.log("order a updatear")
    console.log(order);
    if (this.selectedItem !== undefined){
      if (order.lines !== undefined){
        for (let line of order.lines){
          // Ya hay una linea con ese itemId
          if(this.selectedItem.id === line.itemId){
            console.log("el metodo update line")
            this.updateOrderLine(order, line);
            break;
          // No hay linea con ese itemId
          } else {
            console.log("el metodo add line")
            this.addOrderLine(order);
            break;
          }
        }
      }

    }

  }

  addToCart():void{
    console.log("PRODUCTO")
    console.log(this.product),
    console.log("SELECTED ITEM")
    console.log(this.selectedItem)
    if (this.selectItem()){
      if (this.isUserLoggedIn()){
        let customerId = Number(sessionStorage.getItem("customerId"))
        this._customerService.getCustomerAndCreatedOrderByCustomerId(customerId).subscribe({
          next: (result) => {
            console.log("result desde addtocart:")
            console.log(result)
            if(result.orders.length>0){
              console.log("entro a updatear")
              let orderToUpdate = result.orders[0];
              this.updateExistingOrder(orderToUpdate)
            } else {
              console.log("entro a crear")
              this.createNewOrder();
            } 
          },
          error: (error) => {
            console.log(error)
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
