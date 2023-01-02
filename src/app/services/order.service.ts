import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl + 'order';

  constructor(public _http: HttpClient) {}

  getOrderById(id: number): Observable<any> {
    return this._http.get(this.apiUrl + `/${id}`);
  }

  getAllOrders(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  getOrdersByStatus(status: string): Observable<any> {
    return this._http.get(this.apiUrl + `/status/${status}`);
  }

  createOrder(order: Order): Observable<any> {
    return this._http.post(this.apiUrl, order);
  }

  updateOrder(order: Order): Observable<any> {
    return this._http.put(this.apiUrl + `/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
