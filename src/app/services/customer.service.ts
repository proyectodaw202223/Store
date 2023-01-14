import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.apiUrl + 'customer';

  constructor(public _http: HttpClient) {}

  getCustormerById(id: number): Observable<any>{
    return this._http.get(this.apiUrl + `/${id}`);
  }

  getCustormerByEmailAndPassword(customer: Customer): Observable<any>{
    return this._http.get(this.apiUrl + '/credentials', customer);
  }

  getCustormerOrdersByCustomerId(id: number): Observable<any>{
    return this._http.get(this.apiUrl + `/${id}/orders`);
  }

  getCustomerAndPaidOrdersByCustomerId(id: number): Observable<any>{
    return this._http.get(this.apiUrl + `/${id}/paid-orders`);
  }

  getCustomerAndCreatedOrderByCustomerId(id: number): Observable<any>{
    return this._http.get(this.apiUrl + `/${id}/created-order`);
  }

  createCustomer(customer: Customer): Observable<any>{
    return this._http.post(this.apiUrl, customer);
  }

}
