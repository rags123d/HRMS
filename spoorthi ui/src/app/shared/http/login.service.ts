import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient
  ) { }

  onLogin(credentialObj) {
    return this.httpClient.post(`${environment.baseUrl}/login`, credentialObj);
  }

  RefreshToken(param) {
    return this.httpClient.post(`${environment.baseUrl}/refreshTokenWeb`, param);
  }

  ForgotPassword(param) {
    return this.httpClient.post(`${environment.baseUrl}/forgotPassword`, param);
  }

  SendSMS(param) {
    return this.httpClient.post(`${environment.baseUrl}/sendSMS`, param);
  }
}
