import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddWorkorderService {

  constructor(
    private _http: HttpClient
  ) { }

  getWorkOrder(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}getWorkOrder`)
  }

  getWorkOrderById(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}getWorkOrderById`, param)
  }

  getWorkOrderByClient(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}getWorkOrderByClient`, param)
  }

  getSubWorkOrderByClient(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}getSubWorkOrderByClient`, param)
  }

  getDesignation(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}getDesignation`)
  }

  getWorkOrderDashboardById(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}getWorkOrderDashboardById`, param)
  }

  getWorkOrderNotHired(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}getWorkOrderNotHired`)
  }

  getPostWorkOrderNotHired(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getPostWorkOrderNotHired`, param)
  }

  addWorkOrder(param: FormData): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}addEditWorkOrder`, param)
  }

  deleteWorkOrder(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}deleteWorkOrder`, param)
  }
}
