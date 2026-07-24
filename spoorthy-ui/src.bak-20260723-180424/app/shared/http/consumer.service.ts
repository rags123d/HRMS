import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {

  constructor(private httpClient: HttpClient) { }

  getConsumerList(filter) {
    return this.httpClient.post(environment.baseUrl + 'consumer/all',filter);
  }

}
