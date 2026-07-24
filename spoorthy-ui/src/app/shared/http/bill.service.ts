import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(
    private _http: HttpClient
  ) { }

  getBill(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getBill`)
  }

  getBillByWorkOrderAllData(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getBillByWorkOrderAllData`, param)
  }

  getBillByWorkOrder(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getBillByWorkOrder`, param)
  }

  getSalaryStatement(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getSalaryStatement`, param)
  }

  getBillByMonthandClient(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getBillByMonthandClient`, param)
  }

  getBillNotGenerated(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getBillNotGenerated`)
  }

  getPostBillNotGenerated(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getPostBillNotGenerated`, param)
  }
  
  getBillNotPaid(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getBillNotPaid`)
  }
  
  getPostBillNotPaid(param): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getPostBillNotPaid`, param)
  }

  saveBill(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}saveEditBill`, param)
  }

  saveBillAbstract(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}saveEditBillAbstract`, param)
  }

  generateBill(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}generateBill`, param)
  }

  getBillById(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getBillById`, param)
  }

  getPaymentMode(): Observable<any> {
    return this._http.get<any>(`${environment.baseUrl}getPaymentMode`)
  }

  addPaymentToBill(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}addPaymentToBill`, param)
  }

  getBillInvoice(param: Object): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}getBillInvoice`, param)
  }

}
