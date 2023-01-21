import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { Order } from 'src/app/models/order.model';
import { OrderLine } from 'src/app/models/orderLine.model';
import { OrderStatus } from 'src/app/models/orderStatus.model';
import { Product } from 'src/app/models/product.model';
import { ProductItem } from 'src/app/models/productItem.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductItemService } from 'src/app/services/productItem.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../../client.component.css']
})
export class CartComponent implements OnInit {

  public customer = <Customer>{};
  public newProducts: Array<Product> = [];
  public apiStorage: string = environment.apiStorage;
  public onStock:boolean = true;

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private productService: ProductService,
    private productItemService: ProductItemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('customerId') == null){
      this.router.navigate(['/']);
    } else {
      this.getCustomer(Number(sessionStorage.getItem('customerId')));
      this.getNewProducts();
    }
  }

  getCustomer(customerId: number): void {
    this.customerService.getCustomerAndCreatedOrderByCustomerId(customerId).subscribe({
      next: (result) => {
        this.customer = result as Customer;
        this.customer!.orders![0]!.lines!.forEach(line => {
          if (!this.checkStock(line)){
            this.onStock = false;
            return;
          }   
        })
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  getNewProducts(): void {
    this.productService.getNewProducts(0).subscribe({
      next: (result) => {
        this.newProducts = result as Array<Product>;
        this.newProducts = this.newProducts.filter((product) => product.productItems!.length > 0);
        this.newProducts = this.newProducts.slice(0, 5);
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  checkStock(line: OrderLine): boolean{
    if (line.quantity > line.productItem!.stock) return false;
    return true
  }

  onLineQuantityChange(event: Event, line: OrderLine): void {

    var lineQuantityInput = event.target as HTMLInputElement;
    var lineIdInput = lineQuantityInput.parentElement?.parentElement?.lastChild as HTMLInputElement;

    if (this.customer.orders === undefined)
      return;

    var orderLine = this.customer.orders[0].lines?.filter(
      (line) => line.id == parseInt(lineIdInput.value))[0] as OrderLine;
    
    if (parseInt(lineQuantityInput.value) <= 0 || lineQuantityInput.value === '') {
      orderLine.quantity = 1;
    }

    if (!this.checkStock(line)){
      this.onStock = false;
    } else {
      this.onStock = true;
    }

    this.customer.orders[0].amount -= orderLine.amount;
    orderLine.amount = orderLine.priceWithDiscount * orderLine.quantity;
    this.customer.orders[0].amount += orderLine.amount;

    this.updateOrder();
  }

  onDeleteLineButtonClick(event: Event): void {
    if (!window.confirm("Se eliminará la línea del pedido seleccionada ¿Desea continuar?"))
      return;

    var deleteLineButton = event.target as HTMLInputElement;
    var lineIdInput = deleteLineButton.parentElement?.parentElement?.lastChild as HTMLInputElement;

    if (this.customer.orders === undefined)
      return;

    var orderLine = this.customer.orders[0].lines?.filter(
      (line) => line.id == parseInt(lineIdInput.value))[0] as OrderLine;

    this.customer.orders[0].amount -= orderLine.amount;

    this.customer.orders[0].lines = this.customer.orders[0].lines?.filter(
      (line) => line.id != parseInt(lineIdInput.value));

    if (this.customer.orders[0].lines !== undefined && this.customer.orders[0].lines.length >= 1)
      this.updateOrder();
    else
      this.deleteOrder();
  }

  updateOrder(): void {
    if (this.customer.orders === undefined)
      return;

    this.orderService.updateOrder(this.customer.orders[0]).subscribe({
      next: (result) => {
        if (this.customer.orders === undefined)
          return;

        this.customer.orders[0] = result as Order;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  deleteOrder() {
    if (this.customer.orders === undefined || this.customer.orders[0].id === undefined)
      return;

    this.orderService.deleteOrder(this.customer.orders[0].id).subscribe({
      next: (result) => {
        this.customer.orders = [];
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onModifyCustomerDataButtonClick(event: Event): void {
    this.router.navigate(['account']);
  }

  onPayButtonClick(event: Event): void {
    if (this.customer.orders === undefined)
      return;
    
    if (
      this.customer.lastName === null ||
      this.customer.streetAddress === null ||
      this.customer.zipCode === null ||
      this.customer.province === null ||
      this.customer.city === null ||
      this.customer.country === null 
      ){
        window.alert("Hay datos de cliente necesarios a modificar.");
        window.location.replace('/account');
      }

    this.customer.orders[0].paymentDateTime = this.formatDate(new Date());
    this.customer.orders[0].status = OrderStatus.PAID;

    this.updateStock(this.customer.orders[0])

    this.orderService.updateOrder(this.customer.orders[0]).subscribe({
      next: (result) => {
        window.alert("Transacción completada exitosamente.");
        window.location.replace('/orderdetails/' + this.customer.orders![0].id);
        this.customer.orders = [];
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  updateStock(order:Order){
    for (let line of order.lines!){
      let quantity = line.quantity;
      let item = line.productItem;
      item!.stock -= quantity;
      this.productItemService.updateItem(item!).subscribe({
        next: (result) => {
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
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
