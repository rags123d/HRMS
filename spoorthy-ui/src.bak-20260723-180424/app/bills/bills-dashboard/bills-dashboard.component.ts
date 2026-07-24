import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddClientService } from 'src/app/shared/http/add-client.service';
import { BillService } from 'src/app/shared/http/bill.service';
import * as moment from 'moment';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { DatePipe } from '@angular/common';

// >> export excel/pdf imports
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
declare var require: any;
var jsPDF = require('jspdf');
require('jspdf-autotable');
// export excel/pdf imports <<

export class BillMonth {
  BillId: string;
  Month: string;
  Year: number;
  AmountReceived: string;
  BillStatus: string;
  CGST: string;
  DueDate: string;
  GeneratedOn: string;
  GrossAmount: string;
  IGST: string;
  LastPaidOn: string;
  SGST: string;
  TDS: string;
  TDSCGST: string;
  TDSSGST: string;
  TotalAmount: string;
  WorkOrder: WorkOrder;

  constructor(Month, Year, WorkOrderId, WorkOrderName, ClientName) {
    this.Month = Month;
    this.Year = Year;
    this.WorkOrder = new WorkOrder(WorkOrderId, WorkOrderName, ClientName);
  }
}

export class WorkOrder {
  _id: string;
  name: string;
  client: Client;

  constructor(id, name, clientName) {
    this._id = id;
    this.name = name;
    this.client = new Client(clientName);
  }
}

export class Client {
  name: string;

  constructor(name) {
    this.name = name;
  }
}

@Component({
  selector: 'app-bills-dashboard',
  templateUrl: './bills-dashboard.component.html',
  styleUrls: ['./bills-dashboard.component.scss']
})

export class BillsDashboardComponent implements OnInit {

  billForm: FormGroup;
  allClient: any;
  bills: any;

  todaysDate = new Date()
  endMonth: any;


  BillDetails: any;
  salaryStat: any;
  fileName: string;
  attndData: any;



  billMonth = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private addClientService: AddClientService,
    private billService: BillService,
    private showLoaderService: NgxUiLoaderService,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonserviceService,
  ) { }

  ngOnInit(): void {
    this.todaysDate.setHours(0, 0, 0, 0);
    this.endMonth = new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth() + 1, 0);

    var presentMonth = moment(new Date()).format('MMMM')

    this.getClient()
    this.getBillByMonthandClient('All', presentMonth)

    this.billForm = new FormGroup({
      'billMonth': new FormControl('', [Validators.required]),
      'clientName': new FormControl('', [Validators.required])
    })
  }

  goto(row) {
    this.router.navigateByUrl(`/bill/${row.WorkOrder._id}/${row._id}`, { state: { row } })
  }

  goto1(row) {
    this.router.navigateByUrl(`/bill/${row.WorkOrder._id}`, { state: { row } })
  }

  ViewBills() {
    this.getBillByMonthandClient(this.billForm.get('clientName').value, this.billForm.get('billMonth').value)
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

  getBillByMonthandClient(id, Month) {
    this.showLoaderService.start()
    var data = {
      id: id,
      Month: Month,
    }
    this.billService.getBillByMonthandClient(data)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.bills = res['data']

            if (this.bills.length > 0) {
              this.bills.forEach(element => {
                var NoOfBills = element.billItems.length

                if (NoOfBills > 0) {
                  var lastBillMonth = moment(element.billItems[NoOfBills - 1].createdAt).month() + 1
                  var presentMonth = moment(new Date()).month() + 1
                }

                if (element.billItems.length == 0) {
                  const billPush = new BillMonth(
                    this.billMonth[this.todaysDate.getMonth()],
                    this.todaysDate.getFullYear(),
                    element.billItems[0].WorkOrder._id,
                    element.billItems[0].WorkOrder.name,
                    element.billItems[0].WorkOrder.client.name)
                  element.billItems.push(billPush)
                } else if (this.todaysDate.getTime() === this.endMonth.getTime() && lastBillMonth < presentMonth) {
                  const billPush = new BillMonth(
                    this.billMonth[this.todaysDate.getMonth()],
                    this.todaysDate.getFullYear(),
                    element.billItems[0].WorkOrder._id,
                    element.billItems[0].WorkOrder.name,
                    element.billItems[0].WorkOrder.client.name)
                  element.billItems.push(billPush)
                } else if (lastBillMonth < presentMonth) {
                  const billPush = new BillMonth(
                    this.billMonth[this.todaysDate.getMonth() - 1],
                    this.todaysDate.getFullYear(),
                    element.billItems[0].WorkOrder._id,
                    element.billItems[0].WorkOrder.name,
                    element.billItems[0].WorkOrder.client.name)
                  element.billItems.push(billPush)
                }
              });
            }
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  export(type, id) {
    this.showLoaderService.start();

    // this.BillDetails = this.bills.forEach(item => item.billItems.filter(x => x._id == id));
    this.BillDetails = this.bills.map(item => item.billItems.filter(x => x._id == id)).flat();


    // this.BillDetails = res['data'].filter(x => x._id == id);
    this.salaryStat = this.BillDetails[0].Employees;

    const title = "Salary Statement for " + this.BillDetails[0].Month + "-" + this.BillDetails[0].Year;
    this.fileName = "Salary Statement for " + this.BillDetails[0].Month + "-" + this.BillDetails[0].Year;

    const subtitle1 = ['Principle Employer', ' ', this.BillDetails[0].WorkOrder.client.name ? this.BillDetails[0].WorkOrder.client.name : '-'];
    const subtitle2 = ['WorkOrder Name', ' ', this.BillDetails[0].WorkOrder.name ? this.BillDetails[0].WorkOrder.name : '-'];

    const header = [
      "Sl.No", "Emp ID", "Emp Name", "Parent Name", "Designation", "Department", "Division", "Sub-Division", "Work Location",
      "Gender", "DOB", "DOJ", "ESIC IP No", "UAN No", "Bank A/C No", "IFSC", "Bank Name", "Bank Branch", "Present Days", "OT Days",
      "Fixed Wages", '', '', '', '', '', '', '', '', "Total Fixed Wages",
      "Earned Wages", '', '', '', '', '', '', '', '', '', "Total Earned Wages",
      "Deductions", '', '', '', '', '', '', '', "Total Deductions",
      "Net Salary Payable"
    ];
    const subheader = [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      "Basic+VDA", "HRA", "Conveyence", "Medical Allowance", "Special Allowance", "Bonus", "Leave-with-Wages", "Washing Allowance",
      "National Festival Holidays", '',
      "Basic+VDA", "HRA", "Conveyence", "Medical Allowance", "Special Allowance", "Bonus", "Leave-with-Wages", "Washing Allowance",
      "National Festival Holidays", "OT Wages", '',
      "ESI", "PF", "PT", "TDS", "Advance", "Uniform", "Fines/Damges", "Other Deduction", '', ''
    ];
    let data = [];

    this.salaryStat.forEach((element, key) => {
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
        element['Employee'].Division ? element['Employee'].Division : 'NA',
        element['Employee'].SubDivision ? element['Employee'].SubDivision : 'NA',
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
        element['Employee'].BasicVDA ? element['Employee'].BasicVDA : '0',
        element['Employee'].HRA ? element['Employee'].HRA : '0',
        element['Employee'].Conveyance ? element['Employee'].Conveyance : '0',
        element['Employee'].MedicalAllowance ? element['Employee'].MedicalAllowance : '0',
        element['Employee'].SpecialAllowance ? element['Employee'].SpecialAllowance : '0',
        element['Employee'].Bonus ? element['Employee'].Bonus : '0',
        element['Employee'].LeaveWithWages ? element['Employee'].LeaveWithWages : '0',
        element['Employee'].WashingAllowance ? element['Employee'].WashingAllowance : '0',
        element['Employee'].NationalFestivalHolidays ? element['Employee'].NationalFestivalHolidays : '0',
        this.attndData[0].TotalFixedWages ? this.attndData[0].TotalFixedWages : '-',
        this.attndData[0].EWBasiVDA ? this.attndData[0].EWBasiVDA : '0',
        this.attndData[0].EWHRA ? this.attndData[0].EWHRA : '0',
        this.attndData[0].EWConveyance ? this.attndData[0].EWConveyance : '0',
        this.attndData[0].EWMedicalAllowance ? this.attndData[0].EWMedicalAllowance : '0',
        this.attndData[0].EWSpecialAllowance ? this.attndData[0].EWSpecialAllowance : '0',
        this.attndData[0].EWBonus ? this.attndData[0].EWBonus : '0',
        this.attndData[0].EWLeaveWages ? this.attndData[0].EWLeaveWages : '0',
        this.attndData[0].EWWashingAllowance ? this.attndData[0].EWWashingAllowance : '0',
        this.attndData[0].EWNationalFestivalHolidays ? this.attndData[0].EWNationalFestivalHolidays : '0',
        this.attndData[0].OTWages ? this.attndData[0].OTWages : '0',
        this.attndData[0].TotalEarnedWages ? this.attndData[0].TotalEarnedWages : '0',
        this.attndData[0].EWESI ? this.attndData[0].EWESI : '0',
        this.attndData[0].EWPFbasedBAsicVDA ? this.attndData[0].EWPFbasedBAsicVDA : '0',
        element['Employee'].ProfessionalTax ? element['Employee'].ProfessionalTax : '0',
        this.attndData[0].TDSAmount ? this.attndData[0].TDSAmount : '0',
        this.attndData[0].AdvanceAmount ? this.attndData[0].AdvanceAmount : '0',
        this.attndData[0].UniformFee ? this.attndData[0].UniformFee : '0',
        this.attndData[0].FineAmount ? this.attndData[0].FineAmount : '0',
        this.attndData[0].OtherDeductionAmount ? this.attndData[0].OtherDeductionAmount : '0',
        this.attndData[0].Deduction ? this.attndData[0].Deduction : '0',
        this.attndData[0].TotalNetPayable ? this.attndData[0].TotalNetPayable : '-',
      )
      data[key] = newArray;
    });
    this.showLoaderService.stop()

    if (type == 'Excel') {
      this.expoerExcel(title, subtitle1, subtitle2, header, subheader, data);
    }
    this.showLoaderService.stop()
  }

  expoerExcel(title, subtitle1, subtitle2, header, subheader, data) {
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
    worksheet.mergeCells('A1:AY2');
    worksheet.addRow([]);


    let subtitle1Row = worksheet.addRow(subtitle1);
    subtitle1Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A4:B4');

    let subtitle2Row = worksheet.addRow(subtitle2);
    subtitle2Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A5:B5');
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

    headerRow.worksheet.mergeCells('U4:AC4'); headerRow.worksheet.mergeCells('AE4:AN4'); headerRow.worksheet.mergeCells('AP4:AW4');

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

