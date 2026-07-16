import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddClientService {

  constructor(
    private _http: HttpClient
  ) { }

  getDesignation(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getDesignation`)
  }

  addClient(param: FormData): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addEditClient`, param)
  }

  getClient(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}/getClient`)
  }

  getPostClient(param): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}/getPostClient`, param)
  }

  getClientById(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}/getClientById`, param)
  }

  deleteClient(param: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}/deleteClient`, param)
  }

  getMainDashboard(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}/getMainDashboard`)
  }

  getAllClientDashboard(): Observable<any>{
    return this._http.get<any>(`${environment.baseUrl}/getAllClientDashboard`)
  }

  getClientDashboardById(obj: Object): Observable<any>{
    return this._http.post<any>(`${environment.baseUrl}/getClientDashboardById`, obj)
  }
  
}
