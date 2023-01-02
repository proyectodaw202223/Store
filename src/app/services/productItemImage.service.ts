import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductItemImageService {

  private apiUrl = environment.apiUrl + 'itemImage';

  constructor(public _http: HttpClient) {}

  getAllItemImages(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  createItemImage(formData: FormData): Observable<any> {
    return this._http.post(this.apiUrl, formData);
  }

  deleteItemImage(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
