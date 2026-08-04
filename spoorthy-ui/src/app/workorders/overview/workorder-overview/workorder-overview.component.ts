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
  workOrderSummaryColumn: string[] = ['Sl No', 'JOB/ROLE', 'UNIT/BRANCH', 'JOB LOCATION', 'TOTAL', 'HIRED', 'WAITING FOR APPROVAL', 'VACANCIES'];

  billSource = new MatTableDataSource();
  billColumn: string[] = ['Sl No', 'Action', 'Invoice No.', 'Bill Month & Year', 'Gross Amount', 'Amount Received', 'Status Of Payment', 'Bill Generated On', 'Due Date On', 'Last Paid On',];

workOrderColumn: string[] = ['Sl No', 'Action', 'ID', 'Work Order Name', 'Work order Date', 'Start Date', 'Renewal Date', 'Total Jobs', 'Job Request Pending', 'Hired',];
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
  datecount: any;
  woRenewalDate: any;

  invoiceDetails: any;
  salaryStat: any;
  attndData: any;
  Gender: any;
  genderName: any;
  BillDetailsData: any;
  NoOfBillsData: any;

  constructor(
    private addWorkOrderService: AddWorkorderService,
    private addClientService: AddClientService,
    private billService: BillService,
    private showLoaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private commonService: CommonserviceService,
    private addEmployeeService: AddEmployeeService
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
      this.getBill1()
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

  getBill1() {
    this.showLoaderService.start()
    var param = {
      "id": this.workorderUrl,
    }
    this.billService.getBillByWorkOrderAllData(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.BillDetailsData = res['data']
            this.NoOfBillsData = this.BillDetailsData.length;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  billGenerate(id) {
    if (!this.billMonthControl.valid) {
      this.toastr.error("Please select Bill Month."); return;
    }
    let billMonthVal = this.billMonthControl.value.split(" ");
    if (billMonthVal.length == 2) {
      let bMonth = billMonthVal[0].trim();
      let bYear = billMonthVal[1].trim();
      let monthNumber = new Date(`${bMonth} 1, ${bYear}`).getMonth() + 1;
      let selectedYear = (+(bYear));

      const WOValidFrom = new Date(this.singleWorkOrder.StartDate);
      const frommonthNumber = WOValidFrom.getMonth() + 1;
      const frommonthName = WOValidFrom.toLocaleString('default', { month: 'long' });
      const fromyear = WOValidFrom.getFullYear();

      const WOValidTo = new Date(this.singleWorkOrder.RenewalDate);
      const tomonthNumber = WOValidTo.getMonth() + 1;
      const tomonthName = WOValidTo.toLocaleString('default', { month: 'long' });
      const toyear = WOValidTo.getFullYear();

      // if ((fromyear >= selectedYear && !(fromyear <= toyear)) && (frommonthNumber >= monthNumber)) {
      //   if (((toyear >= fromyear) && !(toyear <= selectedYear)) && (tomonthNumber >= monthNumber)) {
      //     this.toastr.error("Please select Bill Month and year as per within a WorkOrder Validity.");
      //     return;
      //   }
      // }

      if ((selectedYear <= fromyear) && (monthNumber < frommonthNumber)) {
        this.toastr.error("Please select Bill Month and year as per within a WorkOrder Validity.");
        return;
      }
      if ((selectedYear >= toyear) && (monthNumber > tomonthNumber)) {
        this.toastr.error("Please select Bill Month and year as per within a WorkOrder Validity.");
        return;
      }

      if ((this.BillDetailsData && this.BillDetailsData.length > 0)) {
        let filteredBill = this.BillDetailsData.filter(bill => bill.BillId &&
          bill.Month.toLowerCase().trim() == bMonth.toLowerCase() &&
          bill.Year.toString().trim() == bYear);
        if (filteredBill && filteredBill.length > 0) {
          this.toastr.error(this.billMonthControl.value + "- Bill already exist."); return;
        }
      }

      // if ((this.BillDetails && this.BillDetails.length > 0)) {
      //   let filteredBill = this.BillDetails.filter(bill => bill.BillId &&
      //     bill.Month.toLowerCase().trim() == bMonth.toLowerCase() &&
      //     bill.Year.toString().trim() == bYear);
      //   if (filteredBill && filteredBill.length > 0) {
      //     this.toastr.error(this.billMonthControl.value + "- Bill already exist."); return;
      //   }
      // }

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
            // //For testing purpose remove this
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
    this.datecount = 0;
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
            if (this.singleWorkOrder && this.singleWorkOrder.RenewalDate) {
              const msInDay = 24 * 60 * 60 * 1000;
              let tdDate = this.todaysDate;
              let rnDate = new Date(this.datePipe.transform(this.singleWorkOrder.RenewalDate, "dd-MMM-yyyy"));
              rnDate.setHours(23, 59, 59, 99);
              this.woRenewalDate = rnDate;
              if (tdDate < rnDate) {
                this.datecount = Math.round(Math.abs(tdDate.getTime() - rnDate.getTime()) / msInDay);
              }
            }
            this.workOrderSummarySource = new MatTableDataSource(this.singleWorkOrder && this.singleWorkOrder.workOrderRoles);

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

  export(type, id) {
    this.showLoaderService.start();

    var param = {
      "id": this.workorderUrl
    }
    this.billService.getSalaryStatement(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.BillDetails = res['data'].filter(x => x._id == id);
            this.salaryStat = this.BillDetails[0].Employees;

            const title = "Salary Statement for " + this.BillDetails[0].Month + "-" + this.BillDetails[0].Year;
            this.fileName = "Salary Statement for " + this.BillDetails[0].Month + "-" + this.BillDetails[0].Year;
            // const header = [
            //   "Sl.No", "Emp ID", "Emp Name", "Parent Name", "Designation", "Department", "Division", "Sub-Division", "Work Location",
            //   "Gender", "DOB", "DOJ", "ESIC IP No", "UAN No", "Bank A/C No", "IFSC", "Bank Name", "Bank Branch", "Present Days", "OT Days",
            //   "FW Basic+VDA", "FW HRA", "FW Conveyence", "FW Medical Allowance", "FW Special Allowance", "FW Bonus", "FW Leave-with-Wages",
            //   "FW Washing Allowance", "FW National Festival Holidays", "Total Fixed Wages",
            //   "EW Basic+VDA", "EW HRA", "EW Conveyence", "EW Medical Allowance", "EW Special Allowance", "EW Bonus", "EW Leave-with-Wages",
            //   "EW Washing Allowance", "EW National Festival Holidays", "OT Wages", "Total Earned Wages",
            //   "Deduct ESI", "Deduct PF", "Deduct PT", "Deduct TDS", "Deduct Advance", "Deduct Uniform", "Deduct Fines/Damges", "Other Deduction",
            //   "Total Deductions", "Net Salary Payable (Round Off)"
            // ];
            const header = [
              "Sl.No", "Emp ID", "Emp Name", "Parent Name", "Designation", "Department",
              // "Division", "Sub-Division", 
              "Work Location",
              "Gender", "DOB", "DOJ", "ESIC IP No", "UAN No", "Bank A/C No", "IFSC", "Bank Name", "Bank Branch", "Present Days", "OT Days",
              "Fixed Wages", '', '', '', '', '', '', '', '', "Total Fixed Wages",
              "Earned Wages", '', '', '', '', '', '', '', '', '', "Total Earned Wages",
              "Deductions", '', '', '', '', '', '', '', "Total Deductions",
              "Net Salary Payable"
            ];
            const subheader = [
              '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
              // '', '',
              "Basic+VDA", "HRA", "Conveyence", "Medical Allowance", "Special Allowance", "Bonus", "Leave-with-Wages", "Washing Allowance",
              "National Festival Holidays", '',
              "Basic+VDA", "HRA", "Conveyence", "Medical Allowance", "Special Allowance", "Bonus", "Leave-with-Wages", "Washing Allowance",
              "National Festival Holidays", "OT Wages", '',
              "ESI", "PF", "PT", "TDS", "Advance", "Uniform", "Fines/Damges", "Other Deduction", '', ''
            ];
            let data = [];
            let grandTotals = [];

            this.salaryStat.forEach((element, key) => {

              // this.attndData = this.salaryStat.forEach(eleEmp => {
              //   eleEmp.Employee.Attendance.forEach(
              //     x => x.Month == this.BillDetails[0].Month && x.Year == this.BillDetails[0].Year)
              // });

              this.attndData = element.Employee.Attendance.filter(
                x => x.Month == this.BillDetails[0].Month && x.Year == this.BillDetails[0].Year)

              let newArray = [];
              newArray.push(
                key + 1,
                element['Employee'].UniqueEmpId ? element['Employee'].UniqueEmpId : '-',
                element['Employee'].FullName ? element['Employee'].FullName : '-',
                element['Employee'].ParentName ? element['Employee'].ParentName : '-',
                (element['Employee'].WorkOrderRole && element['Employee'].WorkOrderRole.role) ? element['Employee'].WorkOrderRole.role.name : '-',
                element['Employee'].WorkOrderRole ? element['Employee'].WorkOrderRole.branchName : '-',
                // element['Employee'].Division ? element['Employee'].Division : 'NA',
                // element['Employee'].SubDivision ? element['Employee'].SubDivision : 'NA',
                element['Employee'].WorkOrderRole ? element['Employee'].WorkOrderRole.siteAddress : '-',
                element['Employee'].Gender ? element['Employee'].Gender.name : '-',
                element['Employee'].DateOfBirth ? this.datePipe.transform(element['Employee'].DateOfBirth, "dd-MM-yyyy") : '-',
                element['Employee'].DateOfJoining ? this.datePipe.transform(element['Employee'].DateOfJoining, "dd-MM-yyyy") : '-',
                element['Employee'].ESI ? element['Employee'].ESI : '-',
                element['Employee'].UniversalAccount ? element['Employee'].UniversalAccount : '-',
                element['Employee'].AccountNumber ? element['Employee'].AccountNumber : '-',
                element['Employee'].IFSC ? element['Employee'].IFSC : '-',
                element['Employee'].BankName ? element['Employee'].BankName : '-',
                element['Employee'].Branch ? element['Employee'].Branch : '-',
                this.attndData[0].NoOfDaysWorked ? this.attndData[0].NoOfDaysWorked : '0',
                this.attndData[0].NoOfOTDays ? this.attndData[0].NoOfOTDays : '0',
                element['Employee'].BasicVDA ? Math.round(element['Employee'].BasicVDA) : '0',
                element['Employee'].HRA ? Math.round(element['Employee'].HRA) : '0',
                element['Employee'].Conveyance ? Math.round(element['Employee'].Conveyance) : '0',
                element['Employee'].MedicalAllowance ? Math.round(element['Employee'].MedicalAllowance) : '0',
                element['Employee'].SpecialAllowance ? Math.round(element['Employee'].SpecialAllowance) : '0',
                element['Employee'].Bonus ? Math.round(element['Employee'].Bonus) : '0',
                element['Employee'].LeaveWithWages ? Math.round(element['Employee'].LeaveWithWages) : '0',
                element['Employee'].WashingAllowance ? Math.round(element['Employee'].WashingAllowance) : '0',
                element['Employee'].NationalFestivalHolidays ? Math.round(element['Employee'].NationalFestivalHolidays) : '0',
                this.attndData[0].TotalFixedWages ? Math.round(this.attndData[0].TotalFixedWages) : '-',
                this.attndData[0].EWBasiVDA ? Math.round(this.attndData[0].EWBasiVDA) : '0',
                this.attndData[0].EWHRA ? Math.round(this.attndData[0].EWHRA) : '0',
                this.attndData[0].EWConveyance ? Math.round(this.attndData[0].EWConveyance) : '0',
                this.attndData[0].EWMedicalAllowance ? Math.round(this.attndData[0].EWMedicalAllowance) : '0',
                this.attndData[0].EWSpecialAllowance ? Math.round(this.attndData[0].EWSpecialAllowance) : '0',
                this.attndData[0].EWBonus ? Math.round(this.attndData[0].EWBonus) : '0',
                this.attndData[0].EWLeaveWages ? Math.round(this.attndData[0].EWLeaveWages) : '0',
                this.attndData[0].EWWashingAllowance ? Math.round(this.attndData[0].EWWashingAllowance) : '0',
                this.attndData[0].EWNationalFestivalHolidays ? Math.round(this.attndData[0].EWNationalFestivalHolidays) : '0',
                this.attndData[0].OTWages ? Math.round(this.attndData[0].OTWages) : '0',
                this.attndData[0].TotalEarnedWages ? Math.round(this.attndData[0].TotalEarnedWages) : '0',
                this.attndData[0].EWESI ? Math.round(this.attndData[0].EWESI) : '0',
                this.attndData[0].EWPFbasedBAsicVDA ? Math.round(this.attndData[0].EWPFbasedBAsicVDA) : '0',
                this.attndData[0].EWPT ? Math.round(this.attndData[0].EWPT) : '0',
                this.attndData[0].TDSAmount ? Math.round(this.attndData[0].TDSAmount) : '0',
                this.attndData[0].AdvanceAmount ? Math.round(this.attndData[0].AdvanceAmount) : '0',
                this.attndData[0].UniformFee ? Math.round(this.attndData[0].UniformFee) : '0',
                this.attndData[0].FineAmount ? Math.round(this.attndData[0].FineAmount) : '0',
                this.attndData[0].OtherDeductionAmount ? Math.round(this.attndData[0].OtherDeductionAmount) : '0',
                this.attndData[0].Deduction ? Math.round(this.attndData[0].Deduction) : '0',
                this.attndData[0].TotalNetPayable ? Math.round(this.attndData[0].TotalNetPayable) : '-',
              )
              data[key] = newArray;
            });

            let TotalEmp = 0; // Step 1
            TotalEmp = data.length;
            let GTPresentDays = 0;
            let GTOTDays = 0;
            let GTFBasicVDA = 0; let GTERNBasicVDA = 0;
            let GTFHRA = 0; let GTERNHRA = 0;
            let GTFConveyance = 0; let GTERNConveyance = 0;
            let GTFMA = 0; let GTERNMA = 0;
            let GTFSA = 0; let GTERNSA = 0;
            let GTFBonus = 0; let GTERNBonus = 0;
            let GTFLWW = 0; let GTERNLWW = 0;
            let GTFWA = 0; let GTERNWA = 0;
            let GTFNFS = 0; let GTERNNFS = 0;
            let GTOTWages = 0;
            let GTTotalFW = 0; let GTTotalEW = 0;
            let NetPayable = 0;

            let ESI = 0; let PF = 0; let PT = 0; let TDS = 0; let Advance = 0; let Uniform = 0; let FineDamage = 0; let OtherDeduction = 0; let TotalDeduction = 0;

            for (let i = 0; i < data.length; i++) {
              // Step 2: Add up values in column B for each row
              GTPresentDays += (+(data[i].slice(1)[15])) ? (+(data[i].slice(1)[15])) : 0;
              GTOTDays += (+(data[i].slice(1)[16])) ? (+(data[i].slice(1)[16])) : 0;

              GTFBasicVDA += (+(data[i].slice(1)[17])) ? (+(data[i].slice(1)[17])) : 0;
              GTFHRA += (+(data[i].slice(1)[18])) ? (+(data[i].slice(1)[18])) : 0;
              GTFConveyance += (+(data[i].slice(1)[19])) ? (+(data[i].slice(1)[19])) : 0;
              GTFMA += (+(data[i].slice(1)[20])) ? (+(data[i].slice(1)[20])) : 0;
              GTFSA += (+(data[i].slice(1)[21])) ? (+(data[i].slice(1)[21])) : 0;
              GTFBonus += (+(data[i].slice(1)[22])) ? (+(data[i].slice(1)[22])) : 0;
              GTFLWW += (+(data[i].slice(1)[23])) ? (+(data[i].slice(1)[23])) : 0;
              GTFWA += (+(data[i].slice(1)[24])) ? (+(data[i].slice(1)[24])) : 0;
              GTFNFS += (+(data[i].slice(1)[25])) ? (+(data[i].slice(1)[25])) : 0;

              GTTotalFW += (+(data[i].slice(1)[26])) ? (+(data[i].slice(1)[26])) : 0;

              GTERNBasicVDA += (+(data[i].slice(1)[27])) ? (+(data[i].slice(1)[27])) : 0;
              GTERNHRA += (+(data[i].slice(1)[28])) ? (+(data[i].slice(1)[28])) : 0;
              GTERNConveyance += (+(data[i].slice(1)[29])) ? (+(data[i].slice(1)[29])) : 0;
              GTERNMA += (+(data[i].slice(1)[30])) ? (+(data[i].slice(1)[30])) : 0;
              GTERNSA += (+(data[i].slice(1)[31])) ? (+(data[i].slice(1)[31])) : 0;
              GTERNBonus += (+(data[i].slice(1)[32])) ? (+(data[i].slice(1)[32])) : 0;
              GTERNLWW += (+(data[i].slice(1)[33])) ? (+(data[i].slice(1)[33])) : 0;
              GTERNWA += (+(data[i].slice(1)[34])) ? (+(data[i].slice(1)[34])) : 0;
              GTERNNFS += (+(data[i].slice(1)[35])) ? (+(data[i].slice(1)[35])) : 0;
              GTOTWages += (+(data[i].slice(1)[36])) ? (+(data[i].slice(1)[36])) : 0;

              GTTotalEW += (+(data[i].slice(1)[37])) ? (+(data[i].slice(1)[37])) : 0;

              ESI += (+(data[i].slice(1)[38])) ? (+(data[i].slice(1)[38])) : 0;
              PF += (+(data[i].slice(1)[39])) ? (+(data[i].slice(1)[39])) : 0;
              PT += (+(data[i].slice(1)[40])) ? (+(data[i].slice(1)[40])) : 0;
              TDS += (+(data[i].slice(1)[41])) ? (+(data[i].slice(1)[41])) : 0;
              Advance += (+(data[i].slice(1)[42])) ? (+(data[i].slice(1)[42])) : 0;
              Uniform += (+(data[i].slice(1)[43])) ? (+(data[i].slice(1)[43])) : 0;
              FineDamage += (+(data[i].slice(1)[44])) ? (+(data[i].slice(1)[44])) : 0;
              OtherDeduction += (+(data[i].slice(1)[45])) ? (+(data[i].slice(1)[45])) : 0;
              TotalDeduction += (+(data[i].slice(1)[46])) ? (+(data[i].slice(1)[46])) : 0;

              NetPayable += (+(data[i].slice(1)[47])) ? (+(data[i].slice(1)[47])) : 0;
            }

            // Step 3: Display the grand total at the end of the list in column B
            grandTotals.push({
              TotalCount: TotalEmp, PresentDays: GTPresentDays, OTDays: GTOTDays,
              FWBasicVDA: GTFBasicVDA, FWHRA: GTFHRA, FWConveyance: GTFConveyance, FWMA: GTFMA, FWSA: GTFSA, FWBonus: GTFBonus, FWLWW: GTFLWW, FWWA: GTFWA,
              FWNFS: GTFNFS, TotalFW: GTTotalFW,
              EWBasicVDA: GTERNBasicVDA, EWHRA: GTERNHRA, EWConveyance: GTERNConveyance, EWMA: GTERNMA, EWSA: GTERNSA, EWBonus: GTERNBonus, EWLWW: GTERNLWW,
              EWWA: GTERNWA, EWNFS: GTERNNFS, OTWages: GTOTWages, TotalEW: GTTotalEW,
              ESI: ESI, PF: PF, PT: PT, TDS: TDS, Advance: Advance, Uniform: Uniform, FineDamage: FineDamage, OtherDeduction: OtherDeduction,
              TotalDeduction: TotalDeduction, NetPayable: NetPayable
            });

            if (type == 'Excel') {
              this.expoerExcel(title, header, subheader, data, grandTotals);
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

  expoerExcel(title, header, subheader, data, grandTotals) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Salary Statement');
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
    worksheet.mergeCells('A1:AW2');
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

    // headerRow.worksheet.mergeCells('U4:AC4'); headerRow.worksheet.mergeCells('AE4:AN4'); headerRow.worksheet.mergeCells('AP4:AW4'); 
    headerRow.worksheet.mergeCells('S4:AA4'); headerRow.worksheet.mergeCells('AC4:AL4'); headerRow.worksheet.mergeCells('AN4:AU4');

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
    let subheaderRow = worksheet.addRow(subheader);
    subheaderRow.font = { bold: true };
    subheaderRow.eachCell((cell, number) => {
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


    worksheet.addRow([]);
    let totalRow = worksheet.addRow(
      [grandTotals[0].TotalCount, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      grandTotals[0].PresentDays, grandTotals[0].OTDays,
      grandTotals[0].FWBasicVDA, grandTotals[0].FWHRA, grandTotals[0].FWConveyance, grandTotals[0].FWMA, grandTotals[0].FWSA, grandTotals[0].FWBonus,
      grandTotals[0].FWLWW, grandTotals[0].FWWA, grandTotals[0].FWNFS, grandTotals[0].TotalFW,
      grandTotals[0].EWBasicVDA, grandTotals[0].EWHRA, grandTotals[0].EWConveyance, grandTotals[0].EWMA, grandTotals[0].EWSA, grandTotals[0].EWBonus,
      grandTotals[0].EWLWW, grandTotals[0].EWWA, grandTotals[0].EWNFS, grandTotals[0].OTWages, grandTotals[0].TotalEW,
      grandTotals[0].ESI, grandTotals[0].PF, grandTotals[0].PT, grandTotals[0].TDS, grandTotals[0].Advance, grandTotals[0].Uniform, grandTotals[0].FineDamage,
      grandTotals[0].OtherDeduction, grandTotals[0].TotalDeduction, grandTotals[0].NetPayable]);
    totalRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D2DCE2' },
        bgColor: { argb: 'FFFFFF00' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

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
