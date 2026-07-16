import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddReligionService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getReligion(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getReligion`)
  }

  addReligion(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addReligion`, param)
  }

  deleteReligion(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deleteReligion`, param)
  }

  editReligion(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/editReligion`, param)
  }
  

  getGMApprovalList(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getGMApprovalList`)
  }

  getMDApprovalList(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getMDApprovalList`)
  }

}
