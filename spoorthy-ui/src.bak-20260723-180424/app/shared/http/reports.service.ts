import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private _http: HttpClient
  ) { }


  getWorkOrderRoles(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getAllWorkOrderRoles`)
  }

  getAllDesignationwise(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getAllDesignationwise`)
  }

  getAllWorkOrder(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getAllWorkOrder`)
  }

  getAllClient(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getAllClient`)
  }
  
  getEmpReportByUnitBranch(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmpReportByUnitBranch`, param)
  }
  
  getEmpReportByDesignation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmpReportByDesignation`, param)
  }
  
  getEmpReportByWorkOrder(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmpReportByWorkOrder`, param)
  }
  
  getEmpReportByClient(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmpReportByClient`, param)
  }

}
