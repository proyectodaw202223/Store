import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl + 'product';

  constructor(public _http: HttpClient) {}

  getProductById(id: number): Observable<any> {
    return this._http.get(this.apiUrl + `/${id}`);
  }

  getAllProducts(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  getNewProducts(limit: number): Observable<any> {
    return this._http.get(this.apiUrl + `/new/${limit}`);
  }

  getProductsForSale(limit: number): Observable<any> {
    return this._http.get(this.apiUrl + `/sale/${limit}`);
  }

  createProduct(product: Product): Observable<any> {
    return this._http.post(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this._http.put(this.apiUrl + `/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
