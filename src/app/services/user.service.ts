import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + 'user';

  constructor(public _http: HttpClient) {}

  getUserById(id: number): Observable<any> {
    return this._http.get(this.apiUrl + `/${id}`);
  }

  getUserByEmailAndPassword(email: string, password: string): Observable<any> {
    return this._http.get(this.apiUrl + `/${email}/${password}`);
  }

  createUser(user: User): Observable<any> {
    return this._http.post(this.apiUrl, user);
  }

  updateUser(user: User): Observable<any> {
    return this._http.put(this.apiUrl + `/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this._http.delete(this.apiUrl + `/${id}`);
  }
}
