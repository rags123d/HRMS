import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/shared/http/bill.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  public paymentSource = new MatTableDataSource([])
  public paymentColumn = ['Date', 'Amount', 'Payment Mode', 'Reference No.', 'Remarks', 'Verified By']

  paymentForm: FormGroup
  paymentTest: Array<Object> = []

  billData: any;
  PaymentMode: any[] = []
  billID = this.route.snapshot.params.id
  public admin: any;

  constructor(
    private billService: BillService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private showLoaderService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.admin = JSON.parse(sessionStorage.getItem('userDetails'))

    this.getBillById()
    this.getPaymentMode();

    this.paymentForm = new FormGroup({
      "PaymentMode": new FormControl('', [Validators.required]),
      "UTR": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.maxLength(100)]),
      "AmountReceived": new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})$')]),
      "PaymentReceivedOn": new FormControl(null, [Validators.required]),
      "Remarks": new FormControl(null, [Validators.required])
    })
  }

  addPaymentData() {
    this.savePayment()
    this.ModelClose('InvoiceModel')
  }

  async getBillById() {
    var param = {
      "id": this.billID
    }
    this.showLoaderService.start()
    await this.billService.getBillById(param)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.billData = res['data']
            if (this.billData.Payments.length != 0)
              this.paymentSource = new MatTableDataSource(this.billData.Payments)
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  getPaymentMode() {
    this.showLoaderService.start()
    this.billService.getPaymentMode()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.PaymentMode = res['data']
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  savePayment() {
    var param = {
      "BillId": this.billID,
      'PaymentMode': this.paymentForm.controls.PaymentMode.value,
      'UTR': this.paymentForm.controls.UTR.value,
      'AmountReceived': this.paymentForm.controls.AmountReceived.value,
      'PaymentReceivedOn': this.paymentForm.controls.PaymentReceivedOn.value,
      'Remarks': this.paymentForm.controls.Remarks.value,
      'VerifiedBy': this.admin.user
    }
    this.showLoaderService.start()
    this.billService.addPaymentToBill(param)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'])
            this.getBillById()
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
          this.toastr.error(err.error.message)
        }
      )
  }

  ModelOpen(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";
    this.paymentForm.reset()
    this.getPaymentMode()
  }

  ModelClose(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "none";
  }

}
