import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getUser(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getUser`)
  }

  addUser(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addUser`, param)
  }

  deleteUser(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}deleteUser`, param)
  }

  editUser(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}editUser`, param)
  }

  getUserRole(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getRole`)
  }

  getGender(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getGender`)
  }

}
