import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public newUser:boolean = false;
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public passwordConfirm: string = '';

  constructor( 
    private _customerService: CustomerService,
    public loginDialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
  }

  login(email: string, password: string, name?: string){

    if (this.newUser){
      let customer = new Customer(this.name, this.email, this.password);
      let confirmedPassword = <HTMLInputElement>document.getElementById("passwordConfirm");
      if (this.password !== this.passwordConfirm){
        confirmedPassword.setCustomValidity('parece que las contraseñas no coinciden');
        return;
      }
      this._customerService.createCustomer(customer).subscribe({
        next: (result) => {
          console.log("sign in correcto");
          sessionStorage.setItem('customerName', result.firstName)
          this.loginDialogRef.close(result);
          return result;
        },
        error: (error) => {
          console.log(<any>error);
          return error;
        }
      })
    } else {
      this._customerService.getCustormerByEmailAndPassword(this.email, this.password).subscribe({
        next: (result) => {
          console.log("login correcto");
          sessionStorage.setItem('customerName', result.firstName)
          this.loginDialogRef.close(result); 
        },
        error: (error) => {
          console.log(<any>error);
        }
      })
    }
    
  }
}
