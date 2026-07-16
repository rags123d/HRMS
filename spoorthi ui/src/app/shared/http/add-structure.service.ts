import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddStructureService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getStructure(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getStructure`)
  }

  addStructure(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addStructure`, param)
  }

  deleteStructure(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deleteStructure`, param)
  }

  editStructure(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/editStructure`, param)
  }


}
