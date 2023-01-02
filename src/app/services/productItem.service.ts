import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductItem } from '../models/productItem.model';

@Injectable({
  providedIn: 'root'
})
export class ProductItemService {

  private apiUrl = environment.apiUrl + 'item';

  constructor(public _http: HttpClient) {}

  getItemById(id: number): Observable<any> {
    return this._http.get(this.apiUrl + `/${id}`);
  }

  createItem(item: ProductItem): Observable<any> {
    return this._http.post(this.apiUrl, item);
  }

  updateItem(item: ProductItem): Observable<any> {
    return this._http.put(this.apiUrl + `/${item.id}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
