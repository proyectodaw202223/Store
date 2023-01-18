import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';
import { OrderLine } from 'src/app/models/orderLine.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  public order = new Order(1, 1, '', '', '');
  private isEditing = false;
  public customer : Customer = <Customer>{};
  public apiStorage: string = environment.apiStorage;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
      this.activatedRoute.params.subscribe((params) => {
      this.isEditing = (params['id']) ? true : false;

      if (this.isEditing) {
        this.getOrder(params['id']);
      }
    });

    if (sessionStorage.getItem('customerId') != null) {
      this.getCustomer(Number(sessionStorage.getItem('customerId')));
    } else {
      this.router.navigate(['']);
    }
  }

  getOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (result) => {
        this.order = result as Order;
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  getCustomer(id: number): void {
    this.customerService.getCustomerOrdersByCustomerId(id).subscribe({
        next: (result: Customer) => {
          this.customer = result as Customer;
          console.log(this.customer);
        },
        error: (error) => {
          window.alert(error.error.error);
          console.log(error);
        }
    });
  }

  onBackButton(event: Event): void {
    this.router.navigate(['account']);
  }

}
