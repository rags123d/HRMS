import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddDesignationService {

  constructor(
    private _http: HttpClient
  ) { }


  getDesignation(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getDesignation`)
  }

  addDesignation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addDesignation`, param)
  }

  deleteDesignation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}deleteDesignation`, param)
  }

  editDesignation(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}editDesignation`, param)
  }

  bulkUploadDesignation(formData: FormData) { 
    return this._http.post(`${environment.baseUrl}designation/bulkUpload`, formData); 
  }


}
