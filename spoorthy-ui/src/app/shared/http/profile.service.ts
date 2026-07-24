import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }

  UpdateProfile(profileObj) {
    return this.httpClient.post(`${environment.baseUrl}admin/profile`, profileObj);
  }

  ChangePassword(profileObj) {
    return this.httpClient.post(`${environment.baseUrl}admin/changepassword`, profileObj);
  }

}
