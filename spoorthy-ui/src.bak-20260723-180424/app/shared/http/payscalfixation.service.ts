import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayscalfixationService {

  constructor(
    private _http: HttpClient
  ) { }

  getPayscaleFixation(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getPayscaleFixation`)
  }

  addPayscaleFixation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addPayscaleFixation`, param)
  }

  deletePayscaleFixation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deletePayscaleFixation`, param)
  }

  editPayscaleFixation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/editPayscaleFixation`, param)
  }

}
