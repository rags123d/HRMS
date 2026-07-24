import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { PayslipService } from 'src/app/shared/http/payslip.service';

require('node_modules/vanillajs-datepicker/js/Datepicker.js');
declare var Datepicker: any;

@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.scss']
})
export class PaySlipComponent implements OnInit {

  showPrint = true;
  empDataFetch = false;
  paySlipData: any;
  public activeId: string;

  EmpID: any;
  selectedMonth: any;

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private payslipService: PayslipService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonserviceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.activeId = params['Id'];
        console.log(this.activeId);
        this.ongetPaySlipWithFilter(this.activeId);
      });

  }

  chosenMonthHandler(ctrlValue: any, FromPickerMonthly: any) {
    FromPickerMonthly.close();
    let Year = ctrlValue.getFullYear();
    let startDate = new Date("01-" + this.datePipe.transform(ctrlValue, "MMM-yyyy"));
    this.selectedMonth = startDate;
  }


  SavePDF() {
    this.showPrint = false;
    setTimeout(() => {
      window.print();
      this.showPrint = true;
    }, 500);
  }

  fetchData() {
    this.ongetPaySlipWithFilter(this.EmpID);
  }

  ongetPaySlipWithFilter(Id) {
    var param = {
      "EmpID": this.EmpID,
      "SelectedMonth": this.datePipe.transform(this.selectedMonth, "MMMM"),
      "SelectedYear": this.datePipe.transform(this.selectedMonth, "yyyy")
    }
    this.showLoaderService.start()
    this.payslipService.getPaySlipWithFilter(param)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.paySlipData = res['data'];
            if (this.paySlipData && this.paySlipData != undefined) {
              this.empDataFetch = true;
            }
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  // onGetAllPaySlip(Id) {
  //   // this.showLoaderService.start()
  //   // this.payslipService.getPaySlip(param)  
  //   let URL = `api/EmployeeProfile?EmpId=${Id}`;
  //   this.showLoaderService.start();
  //   this.commonService.onCommonGet(URL)
  //     .subscribe(
  //       (res) => {
  //         if (res['Success'] == true) {
  //           this.paySlipData = res['Data'];
  //         }
  //       },
  //       err => {
  //         this.showLoaderService.stop()
  //         console.error(err)
  //       }
  //     )
  // }

}
