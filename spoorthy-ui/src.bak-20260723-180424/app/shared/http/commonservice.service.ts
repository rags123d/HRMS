import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  onCommonGet(url){
    return this.httpClient.get( environment.baseUrl + url );
  }

  
  onCommonPost(data, url){
    return this.httpClient.post( environment.baseUrl + url, data );
  }

  RefreshToken(param) {
    return this.httpClient.post(`${environment.baseUrl}account/token`, param);
  }
  
  Date(){
    return this.datePipe.transform(new Date(),"dd-MM-yyyy");
  }

}
