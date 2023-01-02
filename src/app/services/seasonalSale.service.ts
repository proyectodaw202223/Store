import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SeasonalSale } from '../models/seasonalSale.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonalSaleService {

  private apiUrl = environment.apiUrl + 'sale';

  constructor(public _http: HttpClient) {}

  getSeasonalSaleById(id: number): Observable<any> {
    return this._http.get(this.apiUrl + `/${id}`);
  }

  getAllSeasonalSales(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  createSeasonalSale(seasonalSale: SeasonalSale): Observable<any> {
    return this._http.post(this.apiUrl, seasonalSale);
  }

  updateSeasonalSale(seasonalSale: SeasonalSale): Observable<any> {
    return this._http.put(this.apiUrl + `/${seasonalSale.id}`, seasonalSale);
  }

  deleteSeasonalSale(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
