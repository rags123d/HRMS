import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDashboardService {

  constructor(
    private httpClient: HttpClient
  ) { }

  onGetOrderDashboardData(orderID: any) {
    return this.httpClient.get(environment.baseUrl + 'sand/booking/bookingid/' + orderID);
  }

  onGetCountOfAttemptsReAllocations(recievedId: any, recievedUserType: any) {
    return this.httpClient.get(environment.baseUrl + 'Order/GetAttemptCountToBan?id=' + recievedId + '&userType=' + recievedUserType);
  }

  onCancelOrder(internalBookingId: any, comment: any) {
    return this.httpClient.get(environment.baseUrl + 'Order/CancelOrder?internalBookingId=' + internalBookingId + '&comments=' + comment);
  }

  onUnAllocateVehicle(internalBookingId: any) {
    return this.httpClient.get(environment.baseUrl + 'Order/UnAllocateVehicle?internalBookingId=' + internalBookingId);
  }

  onCancelPermitHolder(cancelObj: any) {
    return this.httpClient.post(environment.baseUrl + 'Order/UnAllocatePermitHolder', cancelObj);
  }

  onGetAllStorageLocations(InternalBookingId: any) {
    return this.httpClient.get(environment.baseUrl + 'Order/GetAllStorageLocations?internalBookingId=' + InternalBookingId);
  }

  onSendReceipt(InternalBookingId: any) {
    return this.httpClient.get(environment.baseUrl + 'admin/SendInvoice?internalBookingId=' + InternalBookingId);
  }

  onCheckDownloadTypeExistorNot(InternalBookingId: any) {
    return this.httpClient.get(environment.baseUrl + 'order/IsFromDSMC?InternalBookingId=' + InternalBookingId);
  }

  onGetAllOrders(fiter:any) {
    return this.httpClient.post(environment.baseUrl + 'sand/booking/all', fiter);
  }

  ResendOtp(param){
    return this.httpClient.post(environment.baseUrl + 'sand/booking/otp/resendotp', param);
  }

}
