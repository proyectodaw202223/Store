import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { Order } from 'src/app/models/order.model';
import { OrderLine } from 'src/app/models/orderLine.model';
import { OrderStatus } from 'src/app/models/orderStatus.model';
import { Product } from 'src/app/models/product.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
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

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private productService: ProductService,
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
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  getNewProducts(): void {
    this.productService.getNewProducts(5).subscribe({
      next: (result) => {
        this.newProducts = result as Array<Product>;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.error(error);
      }
    });
  }

  onLineQuantityChange(event: Event): void {
    var lineQuantityInput = event.target as HTMLInputElement;
    var lineIdInput = lineQuantityInput.parentElement?.parentElement?.lastChild as HTMLInputElement;

    if (this.customer.orders === undefined)
      return;

    var orderLine = this.customer.orders[0].lines?.filter(
      (line) => line.id == parseInt(lineIdInput.value))[0] as OrderLine;
    
    if (parseInt(lineQuantityInput.value) <= 0) {
      orderLine.quantity = 1;
      return;
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
}
