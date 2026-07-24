import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { ReportsService } from 'src/app/shared/http/reports.service';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { DatePipe } from '@angular/common';

// >> export excel/pdf imports
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { ActivatedRoute } from '@angular/router';
declare var require: any;
var jsPDF = require('jspdf');
require('jspdf-autotable');
// export excel/pdf imports <<

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss']
})
export class EmployeeReportComponent implements OnInit {

  URL = this.route.snapshot.params.id;
  ReportType = this.route.snapshot.params['type']

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  employeeData: any = [];
  modalRef: BsModalRef;
  fileName: string;
  selectedMonthYear: any;

  public fieldSelection = {
    EmpId: true, EmpName: true, MonthYear: true, DOE: true, DOJ: true, Attnd: true, BACNO: true, BIFSC: true, BName: true,
    BBranch: true, Department: true, ClientWO: true, Location: true, Designation: true, Gender: true, Parent: true,
    Spouse: true, DOB: true, ReasonForExit: true, PreAddress: true, PermAddress: true, Aadhar: true, PAN: true, UAN: true,
    EPF: true, ESI: true, EMail: true, ConatctNo: true, BirthPlace: true, GrossSal: true,
  }
  SelectedMonth: string;
  SelectedYear: string;

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private reportService: ReportsService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonserviceService,
    private datapipe: DatePipe,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      scrollX: false,
      processing: true,
      "order": [],                       // sorting 2nd column
      "columnDefs": [
        { "orderable": false, "targets": "_all" } // Applies the option to all columns
      ]
    };
  }

  ngOnInit(): void {
    this.dtTrigger.next();
    this.SelectedMonth = sessionStorage.getItem('SelectedMonth');
    this.SelectedYear = sessionStorage.getItem('SelectedYear');
    this.selectedMonthYear = `${this.SelectedMonth} ${this.SelectedYear}`;
    if (this.SelectedMonth && this.SelectedYear)
      this.onGetEmployee();
  }


  onGetEmployee() {
    this.showLoaderService.start()
    if (this.ReportType == "unitbranch-wise") {
      let params = {
        "WORoleID": this.URL,
        "SelectedMonth": this.SelectedMonth,
        "SelectedYear": this.SelectedYear,
      }
      this.reportService.getEmpReportByUnitBranch(params)
        .subscribe(
          (res) => {
            //  $('#EmployeeTable').DataTable().destroy();
            if (res['success'] == true) {
              $('#EmployeeTable').DataTable().destroy();
              this.employeeData = res['data'];
              this.dtTrigger.next();

              setTimeout(() => {
                $('table#EmployeeTable.dataTable').wrap(
                  "<div class='scrolledTable'></div>"
                );
                this.ngxService.stop();
              }, 150);
            }
            else if (res['success'] == false) {
              this.toastr.error(res["messege"]);
              this.ngxService.stop();
            }
            else {
              this.toastr.error('Error getting data.');
              this.ngxService.stop();
            }
          },
          (error) => {
            this.ngxService.stop();
          }
        );
    }
    else if (this.ReportType == "designation-wise") {
      let params = {
        "DesignationID": this.URL,
        "SelectedMonth": this.SelectedMonth,
        "SelectedYear": this.SelectedYear,
      }
      this.reportService.getEmpReportByDesignation(params)
        .subscribe(
          (res) => {
            //  $('#EmployeeTable').DataTable().destroy();
            if (res['success'] == true) {
              $('#EmployeeTable').DataTable().destroy();
              this.employeeData = res['data'];
              this.dtTrigger.next();

              setTimeout(() => {
                $('table#EmployeeTable.dataTable').wrap(
                  "<div class='scrolledTable'></div>"
                );
                this.ngxService.stop();
              }, 150);
            }
            else if (res['success'] == false) {
              this.toastr.error(res["messege"]);
              this.ngxService.stop();
            }
            else {
              this.toastr.error('Error getting data.');
              this.ngxService.stop();
            }
          },
          (error) => {
            this.ngxService.stop();
          }
        );
    }
    else if (this.ReportType == "workorder-wise") {
      let params = {
        "WOID": this.URL,
        "SelectedMonth": this.SelectedMonth,
        "SelectedYear": this.SelectedYear,
      }
      this.reportService.getEmpReportByWorkOrder(params)
        .subscribe(
          (res) => {
            //  $('#EmployeeTable').DataTable().destroy();
            if (res['success'] == true) {
              $('#EmployeeTable').DataTable().destroy();
              this.employeeData = res['data'];
              this.dtTrigger.next();

              setTimeout(() => {
                $('table#EmployeeTable.dataTable').wrap(
                  "<div class='scrolledTable'></div>"
                );
                this.ngxService.stop();
              }, 150);
            }
            else if (res['success'] == false) {
              this.toastr.error(res["messege"]);
              this.ngxService.stop();
            }
            else {
              this.toastr.error('Error getting data.');
              this.ngxService.stop();
            }
          },
          (error) => {
            this.ngxService.stop();
          }
        );
    }
    else if (this.ReportType == "client-wise") {
      let params = {
        "ClientID": this.URL,
        "SelectedMonth": this.SelectedMonth,
        "SelectedYear": this.SelectedYear,
      }
      this.reportService.getEmpReportByClient(params)
        .subscribe(
          (res) => {
            //  $('#EmployeeTable').DataTable().destroy();
            if (res['success'] == true) {
              $('#EmployeeTable').DataTable().destroy();
              this.employeeData = res['data'];
              this.dtTrigger.next();

              setTimeout(() => {
                $('table#EmployeeTable.dataTable').wrap(
                  "<div class='scrolledTable'></div>"
                );
                this.ngxService.stop();
              }, 150);
            }
            else if (res['success'] == false) {
              this.toastr.error(res["messege"]);
              this.ngxService.stop();
            }
            else {
              this.toastr.error('Error getting data.');
              this.ngxService.stop();
            }
          },
          (error) => {
            this.ngxService.stop();
          }
        );
    }
  }

  onFilterUpdate() {
    this.SelectedMonth = this.datapipe.transform(this.selectedMonthYear, 'MMMM');
    this.SelectedYear = this.datapipe.transform(this.selectedMonthYear, 'yyyy');

    sessionStorage.setItem('SelectedMonth', this.SelectedMonth);
    sessionStorage.setItem('SelectedYear', this.SelectedYear);
    this.onGetEmployee();
  }

  openPopupModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, {
      class: 'modal-xl',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onChecked(type) {
    this.fieldSelection[type] = !this.fieldSelection[type];
    console.log(this.fieldSelection[type]);
  }

  monthSelected(event, dp) {
    dp.close();
    let date = new Date(event.toISOString());
    let monthValue = this.datePipe.transform(date, "MMMM yyyy");
    this.selectedMonthYear = monthValue;
  }

  export(type) {
    const title = 'Employee Filtered Report';
    this.fileName = "Employee Filtered Report";
    const header = ["#",];
    //   , '', '', '', '', '', '',
    //   '', '', '', '', '', '', '', '',
    //   '', '', '', '', '', '', '', '', '', '', '', ''

    // ];

    if (this.fieldSelection.EmpId) {
      header.push('Employee ID');
    }
    if (this.fieldSelection.EmpName) {
      header.push('Employee Name');
    }
    if (this.fieldSelection.MonthYear) {
      header.push('Month/Year');
    }
    if (this.fieldSelection.DOE) {
      header.push('Date of Exit');
    }
    if (this.fieldSelection.DOJ) {
      header.push('Date of Joining');
    }
    if (this.fieldSelection.Attnd) {
      header.push('Attendance');
    }
    if (this.fieldSelection.BACNO) {
      header.push('Bank A/C No');
    }
    if (this.fieldSelection.BIFSC) {
      header.push('Bank IFSC Code');
    }
    if (this.fieldSelection.BName) {
      header.push('Bank Name');
    }
    if (this.fieldSelection.BBranch) {
      header.push('Branch');
    }
    if (this.fieldSelection.Department) {
      header.push('Department/Unit Name');
    }
    if (this.fieldSelection.ClientWO) {
      header.push('Client-Work Order');
    }
    if (this.fieldSelection.Location) {
      header.push('Location');
    }
    if (this.fieldSelection.Designation) {
      header.push('Designation');
    }
    if (this.fieldSelection.Gender) {
      header.push('Gender');
    }
    if (this.fieldSelection.Parent) {
      header.push('Parent Name');
    }
    if (this.fieldSelection.Spouse) {
      header.push('Spouse Name');
    }
    if (this.fieldSelection.DOB) {
      header.push('Date Of Birth');
    }
    if (this.fieldSelection.ReasonForExit) {
      header.push('Reason for Leaving');
    }
    if (this.fieldSelection.PreAddress) {
      header.push('Present Address');
    }
    if (this.fieldSelection.PermAddress) {
      header.push('Permanent Address');
    }
    if (this.fieldSelection.Aadhar) {
      header.push('Aadhar No');
    }
    if (this.fieldSelection.PAN) {
      header.push('PAN No');
    }
    if (this.fieldSelection.UAN) {
      header.push('UAN No');
    }
    if (this.fieldSelection.EPF) {
      header.push('EPF No');
    }
    if (this.fieldSelection.ESI) {
      header.push('ESI No');
    }
    if (this.fieldSelection.EMail) {
      header.push('EMail ID');
    }
    if (this.fieldSelection.ConatctNo) {
      header.push('Mobile No');
    }
    if (this.fieldSelection.BirthPlace) {
      header.push('Place of Birth');
    }
    if (this.fieldSelection.GrossSal) {
      header.push('Gross Salary (Fixed Wages)');
    }

    let data = [];
    this.employeeData.forEach((element, key) => {
      let newArray = [key + 1,];
      if (this.fieldSelection.EmpId) {
        newArray.push(element['UniqueEmpId'] ? element['UniqueEmpId'] : '-');
      }
      if (this.fieldSelection.EmpName) {
        newArray.push(element['FullName'] ? element['FullName'] : '-');
      }
      if (this.fieldSelection.MonthYear) {
        newArray.push(`${element['Month'] ? element['Month'] : '-'} ${element['Year'] ? element['Year'] : '-'}`);
      }
      if (this.fieldSelection.DOE) {
        newArray.push(element['DateOfExit'] ? this.datapipe.transform(element['DateOfExit'], 'dd-MMM-yyyy') : '-');
      }
      if (this.fieldSelection.DOJ) {
        newArray.push(element['DateOfJoining'] ? this.datapipe.transform(element['DateOfJoining'], 'dd-MMM-yyyy') : '-');
      }
      if (this.fieldSelection.Attnd) {
        newArray.push(`${element['NoOfDaysWorked'] ? element['NoOfDaysWorked'] : '0'} OnDuty, ${element['NoOfLeaves'] ? element['NoOfLeaves'] : '0'} OnLeave, ${element['NoOfOTDays'] ? element['NoOfOTDays'] : '0'} OT `);
      }
      if (this.fieldSelection.BACNO) {
        newArray.push(element['AccountNumber'] ? element['AccountNumber'] : '-');
      }
      if (this.fieldSelection.BIFSC) {
        newArray.push(element['IFSC'] ? element['IFSC'] : '-');
      }
      if (this.fieldSelection.BName) {
        newArray.push(element['BankName'] ? element['BankName'] : '-');
      }
      if (this.fieldSelection.BBranch) {
        newArray.push(element['Branch'] ? element['Branch'] : '-');
      }
      if (this.fieldSelection.Department) {
        newArray.push(element['WorkOrderRole'].branchName ? element['WorkOrderRole'].branchName : '-');
      }
      if (this.fieldSelection.ClientWO) {
        newArray.push(`${element['WorkOrder'].client && element['WorkOrder'].client.name ? element['WorkOrder'].client.name : '-'}, ${element['WorkOrder'].name ? element['WorkOrder'].name : '-'}`);
      }
      if (this.fieldSelection.Location) {
        newArray.push(element['WorkOrderRole'].siteAddress ? element['WorkOrderRole'].siteAddress : '-');
      }
      if (this.fieldSelection.Designation) {
        newArray.push(element['WorkOrderRole'].role && element['WorkOrderRole'].role.name ? element['WorkOrderRole'].role.name : '-');
      }
      if (this.fieldSelection.Gender) {
        newArray.push(element['Gender'].name ? element['Gender'].name : '-');
      }
      if (this.fieldSelection.Parent) {
        newArray.push(element['ParentName'] ? element['ParentName'] : '-');
      }
      if (this.fieldSelection.Spouse) {
        newArray.push(element['SpouseName'] ? element['SpouseName'] : '-');
      }
      if (this.fieldSelection.DOB) {
        newArray.push(element['DateOfBirth'] ? this.datapipe.transform(element['DateOfBirth'], 'dd-MMM-yyyy') : '-');
      }
      if (this.fieldSelection.ReasonForExit) {
        newArray.push(element['ReasonForExit'] ? element['ReasonForExit'] : '-');
      }
      if (this.fieldSelection.PreAddress) {
        newArray.push(`${element['PresentAddress'] ? element['PresentAddress'] : '-'}, ${element['PresentAddressPincode'] ? element['PresentAddressPincode'] : '-'}, ${element['PresentAddressPhone'] ? element['PresentAddressPhone'] : '-'}`);
      }
      if (this.fieldSelection.PermAddress) {
        newArray.push(`${element['PermanentAddress'] ? element['PermanentAddress'] : '-'}, ${element['PermanentAddressPincode'] ? element['PermanentAddressPincode'] : '-'}, ${element['PermanentAddressPhone'] ? element['PermanentAddressPhone'] : '-'}`);
      }
      if (this.fieldSelection.Aadhar) {
        newArray.push(element['AadharNo'] ? element['AadharNo'] : '-');
      }
      if (this.fieldSelection.PAN) {
        newArray.push(element['PAN'] ? element['PAN'] : '-');
      }
      if (this.fieldSelection.UAN) {
        newArray.push(element['UniversalAccount'] ? element['UniversalAccount'] : '-');
      }
      if (this.fieldSelection.EPF) {
        newArray.push(element['PFAccount'] ? element['PFAccount'] : '-');
      }
      if (this.fieldSelection.ESI) {
        newArray.push(element['ESI'] ? element['ESI'] : '-');
      }
      if (this.fieldSelection.EMail) {
        newArray.push(element['EMail'] ? element['EMail'] : '-');
      }
      if (this.fieldSelection.ConatctNo) {
        newArray.push(`${element['PresentAddressPhone'] ? element['PresentAddressPhone'] : '-'}, ${element['PermanentAddressPhone'] ? element['PermanentAddressPhone'] : '-'}`);
      }
      if (this.fieldSelection.BirthPlace) {
        newArray.push(element['PlaceOfBirth'] ? element['PlaceOfBirth'] : '-');
      }
      if (this.fieldSelection.GrossSal) {
        newArray.push(element['GrossSalary'] ? element['GrossSalary'] : '-');
      }
      data[key] = newArray;
    });

    if (type == 'Excel') {
      this.expoerExcel(title, header, data);
    }

    if (type == 'PDF') {
      this.exportPDF(title, header, data);
    }
  }

  expoerExcel(title, header, data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Employee Filtered Report');
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
    worksheet.mergeCells('A1:AE2');
    worksheet.addRow([]);

    worksheet.columns = [
      { width: 5 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
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

  exportPDF(title, header, data) {

    const doc = new jsPDF('l', 'pt', 'tabloid');
    doc.setFontType("underline");
    doc.text(512, 60, title)

    // Optional - set properties on the document
    doc.setProperties({
      title: `Employee Filtered Report`,
      alignment: `center`
    });

    doc.autoTable({
      tableWidth: 'auto',
      head: [header],
      margin: { top: 80 },
      headStyles: { europe: { halign: 'center' } },
      body: data,
      columnStyles: {
        0: { cellWidth: 60 }, 1: { cellWidth: 90 }, 2: { cellWidth: 90 }, 3: { cellWidth: 90 }, 4: { cellWidth: 90 }, 5: { cellWidth: 90 },
        6: { cellWidth: 90 }, 7: { cellWidth: 90 }, 8: { cellWidth: 90 }, 9: { cellWidth: 90 }, 10: { cellWidth: 90 }, 11: { cellWidth: 90 },
        12: { cellWidth: 90 }, 13: { cellWidth: 90 }, 14: { cellWidth: 90 }, 15: { cellWidth: 90 }, 16: { cellWidth: 90 }, 17: { cellWidth: 90 },
        18: { cellWidth: 90 }, 19: { cellWidth: 90 }, 20: { cellWidth: 90 }, 21: { cellWidth: 90 }, 22: { cellWidth: 90 }, 23: { cellWidth: 90 },
        24: { cellWidth: 90 }, 25: { cellWidth: 90 }, 26: { cellWidth: 90 }, 27: { cellWidth: 90 }, 28: { cellWidth: 90 }, 29: { cellWidth: 90 },
        30: { cellWidth: 90 }, 31: { cellWidth: 90 }, 32: { cellWidth: 90 }, 33: { cellWidth: 90 }, 34: { cellWidth: 90 }, 35: { cellWidth: 90 },
      },
      bodyStyles: { fontSize: 11, lineWidth: 1, cellPadding: 5 } // Font Size for Rows
    });
    doc.save(`${this.commonService.Date()}_${this.fileName}.pdf`);
  }


}
