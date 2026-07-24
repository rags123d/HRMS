import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddCourseService {

  constructor(
    private _http: HttpClient
  ) { }
  

  getCourse(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getCourse`)
  }

  addCourse(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addCourse`, param)
  }

  deleteCourse(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}deleteCourse`, param)
  }

  editCourse(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}editCourse`, param)
  }

}
