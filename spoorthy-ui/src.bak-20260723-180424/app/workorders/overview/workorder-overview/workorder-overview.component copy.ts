import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddClientService } from 'src/app/shared/http/add-client.service';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { AddWorkorderService } from 'src/app/shared/http/add-workorder.service';
import { BillService } from 'src/app/shared/http/bill.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// >> export excel/pdf imports
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
declare var require: any;
var jsPDF = require('jspdf');
require('jspdf-autotable');
// export excel/pdf imports <<

@Component({
  selector: 'app-workorder-overview',
  templateUrl: './workorder-overview.component.html',
  styleUrls: ['./workorder-overview.component.scss'],
})
export class WorkorderOverviewComponent implements OnInit {

  @ViewChild('pagination') WOStatpaginator: MatPaginator;
  @ViewChild('pagination') WODatapaginator: MatPaginator;
  @ViewChild('pagination') BillSourcepaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public searchText;
  public ListSkip = 0;
  public ListLimit = 10;
  public WOStatTotal = 0;
  public WODataTotal = 0;

  fileName: string;

  billMonthControl = new FormControl("");

  workorderUrl = this.route.snapshot.params['workorderid']

  allWorkOrder: any;
  singleWorkOrder: any;

  singleClient: any;
  allClient: any;

  urlNav = 'Employees'

  workOrderSummarySource = new MatTableDataSource();
  workOrderSummaryColumn: string[] = ['JOB/ROLE', 'UNIT/BRANCH', 'JOB LOCATION', 'TOTAL', 'HIRED', 'WAITING FOR APPROVAL', 'VACANCIES'];

  billSource = new MatTableDataSource();
  billColumn: string[] = ['Action', 'Invoice No.', 'Bill Month & Year', 'Gross Amount', 'Amount Received', 'Status Of Payment', 'Bill Generated On', 'Due Date On', 'Last Paid On',];

  workOrderColumn: string[] = ['Action', 'ID', 'Work Order Name', 'Start Date', 'Renewal Date', 'Total Jobs', 'Job Request Pending', 'Hired',];
  workOrderDataSource = new MatTableDataSource()
  workOrderData: any;

  public DocUrl = environment.docUrl;

  showEmployeeFlag: boolean = true
  showApprovalFlag: boolean = false

  clientWorkOrderForm: FormGroup;
  showWorkOrder: any;
  DashboardDetail: any;
  BillDetails: any;

  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  BillMonth = {
    'Month': '',
    'Year': 0
  }

  todaysDate = new Date()
  endMonth: any;

  showModalData: any;
  NoOfBills: any;
  invoiceDetails: any;

  constructor(
    private addWorkOrderService: AddWorkorderService,
    private addClientService: AddClientService,
    private billService: BillService,
    private showLoaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private commonService: CommonserviceService
  ) { }

  ngOnInit(): void {
    this.workOrderSummarySource.paginator = this.WOStatpaginator;
    this.workOrderDataSource.paginator = this.WODatapaginator;
    this.billSource.paginator = this.BillSourcepaginator;

    sessionStorage.removeItem('date')
    this.route.params.subscribe(par => {
      this.workorderUrl = par['workorderid'];

      this.todaysDate.setHours(0, 0, 0, 0);
      this.BillMonth.Month = this.Months[this.todaysDate.getMonth()]
      this.BillMonth.Year = this.todaysDate.getFullYear()
      this.endMonth = new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth() + 1, 0);

      this.getDashboardDetails(this.workorderUrl);
      // this.getBill()
      this.getDetailWorkOrder();
      this.InitCall();
      this.InitBillSourceCall();


      this.clientWorkOrderForm = new FormGroup({
        'clientName': new FormControl('', [Validators.required]),
        'workorderName': new FormControl('', [Validators.required])
      })
    });
  }

  // getWOStatData(event?: PageEvent) {
  //   this.ListSkip = this.WOStatpaginator.pageIndex * this.WOStatpaginator.pageSize;
  //   this.ListLimit = this.WOStatpaginator.pageSize;
  //   this.getDetailWorkOrder(event.pageIndex * event.pageSize, event.pageSize);
  // }

  InitCall() {
    this.ListSkip = 0;
    this.searchText = (this.searchText && this.searchText.length > 0) ? this.searchText : undefined;
    this.getSubWorkOrder(this.ListSkip, this.ListLimit);
  }

  getWOSourceData(event?: PageEvent) {
    this.ListSkip = this.WODatapaginator.pageIndex * this.WODatapaginator.pageSize;
    this.ListLimit = this.WODatapaginator.pageSize;
    this.getSubWorkOrder(event.pageIndex * event.pageSize, event.pageSize);
  }

  InitBillSourceCall() {
    this.ListSkip = 0;
    this.searchText = (this.searchText && this.searchText.length > 0) ? this.searchText : undefined;
    this.getBill(this.ListSkip, this.ListLimit);
  }

  getbillSourceData(event?: PageEvent) {
    this.ListSkip = this.BillSourcepaginator.pageIndex * this.BillSourcepaginator.pageSize;
    this.ListLimit = this.BillSourcepaginator.pageSize;
    this.getBill(event.pageIndex * event.pageSize, event.pageSize);
  }

  SearchFilterWO(str: string) {
    var filterArr = this.workOrderData.filter((obj: any) => {
      return obj.name.toLowerCase().includes(str.toLowerCase()) || obj.WorkOrderId.toString().includes(str)
    });

    this.workOrderDataSource = new MatTableDataSource(filterArr)
  }

  getSubWorkOrder(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "id": this.workorderUrl,
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.addWorkOrderService.getSubWorkOrderByClient(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            // this.workOrderData = res['data']
            // this.workOrderDataSource = new MatTableDataSource(this.workOrderData)

            this.workOrderData = res['data'].result
            this.WODataTotal = res['data'].total;

            this.workOrderDataSource = new MatTableDataSource(this.workOrderData);
            this.workOrderDataSource.sort = this.sort;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  // goto(id, row) {
  //   this.router.navigateByUrl(`/bill/${id}/${row._id}`, { state: { row } })
  // }

  goto(row) {
    this.router.navigateByUrl(`/bill/${row.WorkOrder}/${row._id}`, { state: { row } })
  }

  goto1(id, row) {
    this.router.navigateByUrl(`/bill/${id}`, { state: { row } })
  }

  billGenerate(id) {
    if (!this.billMonthControl.valid) {
      this.toastr.error("Please select Bill Month."); return;
    }
    let billMonthVal = this.billMonthControl.value.split(" ");
    if (billMonthVal.length == 2) {
      let bMonth = billMonthVal[0].trim();
      let bYear = billMonthVal[1].trim();
      if ((this.BillDetails && this.BillDetails.length > 0)) {
        let filteredBill = this.BillDetails.filter(bill => bill.BillId &&
          bill.Month.toLowerCase().trim() == bMonth.toLowerCase() &&
          bill.Year.toString().trim() == bYear);
        if (filteredBill && filteredBill.length > 0) {
          this.toastr.error(this.billMonthControl.value + "- Bill already exist."); return;
        }
      }
      var row = {
        'Month': bMonth,
        'Year': bYear
      }
      this.router.navigateByUrl(`/bill/${id}`, { state: { row } })
    } else {
      this.toastr.error("Please select valid Bill Month."); return;
    }
  }

  SearchFilter(str) {
    var filterArr = this.BillDetails.filter((obj: any) => {
      return String(obj.BillId).includes(str)
    });
    this.billSource = new MatTableDataSource(filterArr)
  }

  getBill(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "id": this.workorderUrl,
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.billService.getBillByWorkOrder(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            // this.BillDetails = res['data']
            // this.NoOfBills = this.BillDetails.length

            this.BillDetails = res['data'].result
            this.NoOfBills = res['data'].total;

            this.billSource = new MatTableDataSource(this.BillDetails);
            this.billSource.sort = this.sort;

            if (this.NoOfBills > 0) {
              var lastBillMonth = moment(this.BillDetails[this.NoOfBills - 1]?.createdAt).month() + 1
              var presentMonth = moment(new Date()).month() + 1
            }

            if (this.BillDetails.length == 0) {
              this.BillDetails.push(this.BillMonth)
            }
            // // //For testing purpose remove this
            else if (this.todaysDate.getTime() === this.endMonth.getTime() && lastBillMonth < presentMonth) {
              this.BillDetails.push(this.BillMonth)
            } else if (lastBillMonth < presentMonth) {
              this.BillMonth.Month = this.Months[this.todaysDate.getMonth() - 1]
              this.BillMonth.Year = this.todaysDate.getFullYear()
              this.BillDetails.push(this.BillMonth)
            }

            console.log("BillDetails ", this.BillDetails)
            // this.billSource = new MatTableDataSource(this.BillDetails);
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  getWorkOrder() {
    this.showLoaderService.start()
    this.addWorkOrderService.getWorkOrder()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.allWorkOrder = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  getDashboardDetails(id) {
    var params = {
      "workOrderId": id
    }
    this.showLoaderService.start()
    this.addWorkOrderService.getWorkOrderDashboardById(params)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.DashboardDetail = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  filterWorkOrderRole(id: any) {
    this.showWorkOrder = this.allWorkOrder.filter((obj: any) => {
      return obj.client._id == id
    })
  }

  getDetailWorkOrder() {
    this.showLoaderService.start()
    // var param = {
    //   "id" : this.workorderUrl,
    //   "skip": skip,
    //   "limit": limit
    // }
    this.addWorkOrderService.getWorkOrderById({ id: this.workorderUrl })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.singleWorkOrder = res['data']
            this.workOrderSummarySource = new MatTableDataSource(this.singleWorkOrder.workOrderRoles);

            // this.singleWorkOrder = res['data'].result
            // this.WOStatTotal = res['data'].total;

            // this.workOrderSummarySource = new MatTableDataSource(this.singleWorkOrder.workOrderRoles);
            // this.workOrderSummarySource.sort = this.sort;


            if (this.singleWorkOrder && this.singleWorkOrder.workOrderType != "SUB_WORKORDER") {
              this.getSubWorkOrder(this.ListSkip, this.ListLimit);
            }
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  getClient() {
    this.showLoaderService.start()
    this.addClientService.getClient()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.allClient = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  ModelOpen(target: string, data: any) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";
    this.showModalData = data
  }
  OpenMonthSelectModel(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";
  }

  ModelClose(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "none";
  }

  monthSelected(event, dp) {
    dp.close();
    // input.value = event.toISOString().split('-').join('/').substr(0, 7);

    let date = new Date(event.toISOString());
    let monthValue = this.datePipe.transform(date, "MMMM yyyy");
    this.billMonthControl.patchValue(monthValue);
  }

  onGetBillInvoice(id) {
    var params = {
      "id": id
    }
    this.showLoaderService.start()
    this.billService.getBillInvoice(params)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.invoiceDetails = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  downloadInvoice(id, row) {
    this.onGetBillInvoice(row._id);
    //    this.router.navigateByUrl(`/bill/${id}`, { state: { row } })
  }


  export(type) {
    this.showLoaderService.start()
    var param = {
      "id": this.workorderUrl,
      "searchText": this.searchText,
      "skip": this.ListSkip,
      "limit": this.NoOfBills
    }
    this.billService.getBillByWorkOrder(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.BillDetails = res['data'].result

            const title = 'User';
            this.fileName = "User";
            const header = [
              "Sl.No", "Emp ID", "Emp Name", "Parent Name", "Designation", "Department", "Division", "Sub-Division", "Work Location",
              "Gender", "DOB", "DOJ", "ESIC IP No", "UAN No", "Bank A/C No", "IFSC", "Bank Name", "Bank Branch", "Present Days", "OT Days",
              "FW Basic+VDA", "FW HRA", "FW Conveyence", "FW Medical Allowance", "FW Special Allowance", "FW Bonus", "FW Leave-with-Wages",
              "FW Washing Allowance", "FW National Festival Holidays", "Total Fixed Wages",
              "EW Basic+VDA", "EW HRA", "EW Conveyence", "EW Medical Allowance", "EW Special Allowance", "EW Bonus", "EW Leave-with-Wages",
              "EW Washing Allowance", "EW National Festival Holidays", "OT Wages", "Total Earned Wages",
              "Deduct ESI", "Deduct PF", "Deduct PT", "Deduct TDS", "Deduct Advance", "Deduct Uniform", "Deduct Fines/Damges", "Other Deduction",
              "Total Deductions", "Net Salary Payable (Round Off)"
            ];
            const subheader = [
            ];
            let data = [];
            this.BillDetails.forEach((element, key) => {
              let newArray = [];
              newArray.push(
                key + 1,
                element['Name'] ? element['Name'] : '-',
                element['UserId'] ? element['UserId'] : '-',
                element['Password'] ? element['Password'] : '-',
                element['Designation'] ? element['Designation'] : '-',
                element['RoleName'] ? element['RoleName'] : '-',
                element['Age'] ? element['Age'] : '-',
                element['EmailId'] ? element['EmailId'] : '-',
                element['MobileNo'] ? element['MobileNo'] : '-',
                element['LandlineNo'] ? element['LandlineNo'] : '-',
                element['PermanentAddress'] ? element['PermanentAddress'] : '-',
                element['PresentAddress'] ? element['PresentAddress'] : '-',

              )
              data[key] = newArray;
            });

            if (type == 'Excel') {
              this.expoerExcel(title, header, data);
            }
            this.showLoaderService.stop();
          } else {
            this.toastr.error(res['message']);
          }
        },
        error => {
          console.log(error);
          this.showLoaderService.stop();
          this.toastr.error(error.errr.message);
        }
      );
  }

  expoerExcel(title, header, data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('User');
    let titleRow = worksheet.addRow([title]);
    titleRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D2DCE2' },
      bgColor: { argb: 'FFFFFF00' }
    };
    // Set font, size and style in title row.
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultRowWidth = 500;
    titleRow.font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };
    // Blank Row
    worksheet.addRow([]);
    worksheet.mergeCells('A1:AY2');
    worksheet.addRow([]);

    worksheet.columns = [
      { width: 5 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
      { width: 30 }, { width: 30 }
    ];

    let headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D2DCE2' },
        bgColor: { argb: 'FFFFFF00' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.addRows(data);
    worksheet.addRows([]);
    worksheet.addRows([]);

    worksheet.getRow(1).alignment = { horizontal: 'left', vertical: 'middle' };
    worksheet.eachRow((row, number) => {
      row.eachCell((cell, number) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
      });
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${this.commonService.Date()}_${this.fileName}.xlsx`);

    });
  }


}
