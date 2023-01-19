import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  public customer : Customer = <Customer>{};
  public apiStorage: string = environment.apiStorage;
  public onEdit: boolean = false;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    if (sessionStorage.getItem('customerId') != null) {
      this.getCustomer(Number(sessionStorage.getItem('customerId')));
    } else {
      this.router.navigate(['']);
    }
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

  updateCustomer(): void {
    console.log(this.customer);
    this.customerService.updateCustomer(this.customer).subscribe({
      next: (result) => {
        this.customer = result as Customer;
        alert("Cliente actualizado correctamente");
        this.ngOnInit();
      },
      error: (error) => {
        window.alert(error.error.error);
        console.log(error);
      }
    });
  }

  onEditClick(){
    document.getElementById("address-content")!.classList.remove('disabled');
    this.onEdit = true;
  }

  onSaveClick(){
    document.getElementById("address-content")!.classList.add('disabled');
    this.onEdit = false;
    this.updateCustomer();
  }
  
}
