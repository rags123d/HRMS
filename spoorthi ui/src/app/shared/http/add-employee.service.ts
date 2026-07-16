import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddEmployeeService {

  constructor(
    private _http: HttpClient
  ) { }

  getGender(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getGender`)
  }

  getMaritalStatus(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getMaritalStatus`)
  }

  getReligion(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getReligion`)
  }

  getBloodGroup(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getBloodGroup`)
  }

  getCourse(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getCourse`)
  }

  getOccupation(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getOccupation`)
  }

  getDesignation(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getDesignation`)
  }

  getYear(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getYear`)
  }

  getWorkorder(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getWorkOrder`)
  }

  getLanguage(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getLanguage`)
  }

  getRelationship(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getRelationship`)
  }

  getClient(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getClient`)
  }

  addEditEmployee(param: FormData): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addEditEmployee`, param)
  }

  addEmployee(param: FormData): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addEmployee`, param)
  }

  getEmployee(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getEmployee`)
  }

  getPostEmployee(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getPostEmployee`, param)
  }

  getPostEmployeeFilter(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getPostEmployeeFilter`, param)
  }

  getEmployeeById(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmployeeById`, param)
  }

  getEmployeeByWorkOrder(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getEmployeeByWorkOrder`, param)
  }

  getHiredEmployee(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getHiredEmployee`)
  }

  getRejectedEmployee(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getRejectedEmployee`)
  }

  getAttendanceByDate(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getAttendanceByDate`, param)
  }

  deleteEmployee(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deleteEmployee`, param)
  }

  addBankDetails(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addBankDetails`, param)
  }

  getCandidateDashboard(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getCandidateDashboard`)
  }

  getAllJobRoleDashboard(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getAllJobRoleDashboard`)
  }

  addBulkEmployee(param: FormData): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addBulkEmployee`, param)
  }

  getHiredEmpbyClients(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/getAllCientwiseHiredEmp`, param)
  }

  addESIPFDetails(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addESIPFDetails`, param)
  }

  


  getEmployeeLogs(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getEmployeeLogs`)
  }

  getSMSLink(mobileNo): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/GetSMSLink/${mobileNo}`)
  }
}
