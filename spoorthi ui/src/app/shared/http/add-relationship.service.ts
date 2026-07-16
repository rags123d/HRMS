import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddRelationshipService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getRelationship(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getRelationship`)
  }

  addRelationship(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addRelationship`, param)
  }

  deleteRelationship(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deleteRelationship`, param)
  }

  editRelationship(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/editRelationship`, param)
  }

}
