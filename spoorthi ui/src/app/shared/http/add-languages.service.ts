import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddLanguagesService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getLanguage(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}/getLanguage`)
  }

  addLanguage(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/addLanguage`, param)
  }

  deleteLanguage(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/deleteLanguage`, param)
  }

  editLanguage(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}/editLanguage`, param)
  }

}
