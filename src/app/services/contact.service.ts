import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {

  private api = 'https://Mailto@proyectodaw202223@gmail.com'

  constructor(private _http: HttpClient) { }

  postMessage( message : string) : Observable<any> {
    return this._http.post("https://mailthis.to/aromo@birt.eus", message);
    }
}
