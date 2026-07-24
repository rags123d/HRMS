import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddYearService {

  constructor(
    private _http: HttpClient
  ) { }


  getYear(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getYear`)
  }

  addYear(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addYear`, param)
  }

  deleteYear(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}deleteYear`, param)
  }

}
