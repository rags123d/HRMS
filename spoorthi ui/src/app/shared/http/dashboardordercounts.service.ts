import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardordercountsService {

  public dashboardIndividualListingData: any;
  public selectedTypeFromDashboard = '';

  constructor(
    private httpClient: HttpClient
  ) { }

  onGetOrderCounts() {
    return this.httpClient.get(environment.baseUrl + 'admin/dashboard');
  }

  onGetDashboardData() {
    return this.httpClient.get(environment.baseUrl + 'AdminDashboard/GetData');
  }

  onGetIndividualItemList(type: string) {
    return this.httpClient.get(environment.baseUrl + 'Dashboard/GetOrderList?type=' + type);
  }

  onGetOrderList(dataTablesParameters: any, type: string) {
    return this.httpClient.post(environment.baseUrl + 'Dashboard/GetOrderList?type=' + type, dataTablesParameters);
  }

  GetPastDayRecords(days){
    return this.httpClient.get(environment.baseUrl + 'admin/dashboard/pastdays/'+days);
  }

  GetPastMonthRecords(months){
    return this.httpClient.get(environment.baseUrl + 'admin/dashboard/pastmonths/'+months);
  }

  GetOrders(param){
    return this.httpClient.post(environment.baseUrl + 'sand/booking/all',param);
  }
}
