import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PayslipService {

  constructor(
    private _http: HttpClient
  ) { }

  getPaySlipWithFilter(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getPaySlipWithFilter`, param)
  }

  // getPaySlipById(param: Object): Observable<any> {
  //   return this._http.post<any>(`${environment.baseUrl}getPaySlipById`, param)
  // }

}
