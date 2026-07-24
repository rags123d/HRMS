import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddClientService } from 'src/app/shared/http/add-client.service';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';

// >> export excel/pdf imports
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
declare var require: any;
var jsPDF = require('jspdf');
require('jspdf-autotable');
// export excel/pdf imports <<

@Component({
  selector: 'app-allemployees',
  templateUrl: './allemployees.component.html',
  styleUrls: ['./allemployees.component.scss']
})
export class AllemployeesComponent implements OnInit {

  employeeColumn: string[] = ['Action', 'ID', 'Employee Name', 'Client - Work Order Info', 'Joining Date',];
  public employeeDataSource = new MatTableDataSource([])

  clientwiseHiredEmpColumn: string[] = ['Sl No', 'Action', 'ID', 'Employee Name', 'Client - Work Order Info', 'Joining Date', ];
  public clientwiseHiredEmpDataSource = new MatTableDataSource([])
  

  @ViewChild('pagination') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public employeeData: any;
  public DashboardDetail: any;
  
  public ClientwiseEmpHiredForm: FormGroup;
  filteredClient: any;
  allClient: any;
  filteredEmpData: any;

  public searchText;
  public ListSkip = 0;
  public ListLimit = 10;
  public ListTotal = 0;
  
  fileName: string;

  constructor(
    private addEmployeeService: AddEmployeeService,
    private addClientService: AddClientService,
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private commonService: CommonserviceService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.clientwiseHiredEmpDataSource.paginator = this.paginator;

    this.ClientwiseEmpHiredForm = new FormGroup({
      ClientData: new FormControl(""),
    });

    this.getHiredEmployee()
    this.getDashboardDetails()
    this.onGetAllClients()
    this.onFilterUpdate();
  }

  SearchFilter(str: string) {
    var filterArr = this.employeeData.filter((obj: any) => {
      return obj.FullName.toLowerCase().includes(str.toLowerCase()) || obj.WorkOrder.client.name.toLowerCase().includes(str.toLowerCase())
    });
    this.employeeDataSource = new MatTableDataSource(filterArr)
  }

  getDashboardDetails(){
    this.showLoaderService.start()
    this.addEmployeeService.getCandidateDashboard()
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

  getHiredEmployee(){
    this.showLoaderService.start()
    this.addEmployeeService.getHiredEmployee()
      .subscribe(
        res => {
          if(res['success'] == true){
            this.showLoaderService.stop()
            this.employeeData = res['data']

            console.log(res['data']);
            
            this.employeeDataSource = new MatTableDataSource(res['data'])
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  deleteEmployee(id: string){
    this.addEmployeeService.deleteEmployee({'id': id})
      .subscribe(
        res => {
          if(res['success'] == true){
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        error => {
          console.error(error);
        }
      )
  }
  
  onGetAllClients(){
    this.showLoaderService.start()
    this.addClientService.getClient()
      .subscribe(
        res => {
          if(res['success'] == true){
            this.showLoaderService.stop()
            this.filteredClient = this.allClient = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }  

  onSearchClient(event) {
    if (event.target.value) {
      const val = event.target.value.toLowerCase();
      this.filteredClient = this.allClient.filter(function (d) {
        return d.WardNo.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else
      if (this.filteredClient != this.allClient) {
        this.filteredClient = this.allClient;
      }
  }

  onGetFilteredclientwiseHiredEmp(skip, limit){
    this.showLoaderService.start()
    var param = {
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.addEmployeeService.getHiredEmpbyClients(param)
      .subscribe(
        res => {
          if(res['success'] == true){
            this.showLoaderService.stop()
            this.filteredEmpData = res['data'].result
            this.ListTotal = res['data'].total;

            console.log(res['data']);
            
            // this.clientwiseHiredEmpDataSource = new MatTableDataSource(res['data'])

            this.clientwiseHiredEmpDataSource = new MatTableDataSource(this.filteredEmpData);
            this.clientwiseHiredEmpDataSource.sort = this.sort;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }
  
  onFilterUpdate() {
    this.ListSkip = 0;
    this.searchText = (this.searchText && this.searchText.length > 0) ? this.searchText : undefined;
    this.onGetFilteredclientwiseHiredEmp(this.ListSkip, this.ListLimit);
  }

  getServerData(event?: PageEvent) {
    this.ListSkip = this.paginator.pageIndex * this.paginator.pageSize;
    this.ListLimit = this.paginator.pageSize;
    this.onGetFilteredclientwiseHiredEmp(event.pageIndex * event.pageSize, event.pageSize);
  }

  export(type) {
    const title = 'Hired Employees List';
    this.fileName = "Hired Employees List";
    const header = ["#", 'Client Id', 'Client Name', 'WorkOrderRole (Name)', 'WorkOrderRole (salary)', 'WorkOrderRole (Branch)', 'WorkOrderRole (noOfManpower)', 
                    'WorkOrderRole (hired)', 'WorkOrderRole (siteAddress)', 'Employee Id', 'Employee Name', 'Permanent Address', 'Permanent Address Phone', 
                    'Permanent Address Pincode', 'Aadhar No', 'PAN', 'Bank Name', 'Account Number', 'IFSC', 'Date Of Joining', 'GrossSalary', 
                    'NetSalary', 'DeductedSalary', 'BasicVDA', 'Bonus', 'Conveyance', 'ESI BasedOn', 'ESIAmount', 'Fine Amount', 'Gratuity', 'HRA', 
                    'Leave With Wages', 'Medical Allowance', 'National Festival Holidays', 'OT BasedOn', 'OTCalculation', 'Other Deduction', 'PF Amount', 
                    'Professional Tax', 'Reliever Charges', 'Special Allowance', 'TDS Amount', 'Uniform Fee', 'Washing Allowance',  ];
    let data = []; 
    this.filteredEmpData.forEach((element, key) => {
      let newArray = [];
      newArray.push(
        key + 1,
        (element['WorkOrder'].client && element['WorkOrder'].client.ClientId) ? element['WorkOrder'].client.ClientId : '-',
        (element['WorkOrder'].client && element['WorkOrder'].client.name) ? element['WorkOrder'].client.name : '-',
        (element['WorkOrderRole'].role && element['WorkOrderRole'].role.name) ? element['WorkOrderRole'].role.name : '-',
        element['WorkOrderRole'].salary ? element['WorkOrderRole'].salary : '-',
        element['WorkOrderRole'].branchName ? element['WorkOrderRole'].branchName : '-',
        element['WorkOrderRole'].noOfManpower ? element['WorkOrderRole'].noOfManpower : '-',
        element['WorkOrderRole'].hired ? element['WorkOrderRole'].hired : '-',
        element['WorkOrderRole'].siteAddress ? element['WorkOrderRole'].siteAddress : '-',
        element['UniqueEmpId'] ? element['UniqueEmpId'] : '-',
        element['FullName'] ? element['FullName'] : '-',
        element['PermanentAddress'] ? element['PermanentAddress'] : '-',
        element['PermanentAddressPhone'] ? element['PermanentAddressPhone'] : '-',
        element['PermanentAddressPincode'] ? element['PermanentAddressPincode'] : '-',
        element['AadharNo'] ? element['AadharNo'] : '-',
        element['PAN'] ? element['PAN'] : '-',
        element['BankName'] ? element['BankName'] : '-',
        element['AccountNumber'] ? element['AccountNumber'] : '-',
        element['IFSC'] ? element['IFSC'] : '-',
        element['DateOfJoining'] ? element['DateOfJoining'] : '-',
        element['GrossSalary'] ? element['GrossSalary'] : '-',
        element['NetSalary'] ? element['NetSalary'] : '-',
        element['DeductedSalary'] ? element['DeductedSalary'] : '-',
        element['BasicVDA'] ? element['BasicVDA'] : '-',
        element['Bonus'] ? element['Bonus'] : '-',
        element['Conveyance'] ? element['Conveyance'] : '-',
        element['ESIBasedOn'] ? element['ESIBasedOn'] : '-',
        element['ESIAmount'] ? element['ESIAmount'] : '-',
        element['FineAmount'] ? element['FineAmount'] : '-',
        element['Gratuity'] ? element['Gratuity'] : '-',
        element['HRA'] ? element['HRA'] : '-',
        element['LeaveWithWages'] ? element['LeaveWithWages'] : '-',
        element['MedicalAllowance'] ? element['MedicalAllowance'] : '-',
        element['NationalFestivalHolidays'] ? element['NationalFestivalHolidays'] : '-',
        element['OTBasedOn'] ? element['OTBasedOn'] : '-',
        element['OTCalculation'] ? element['OTCalculation'] : '-',
        element['OtherDeduction'] ? element['OtherDeduction'] : '-',
        element['PFAmount'] ? element['PFAmount'] : '-',
        element['ProfessionalTax'] ? element['ProfessionalTax'] : '-',
        element['RelieverCharges'] ? element['RelieverCharges'] : '-',
        element['SpecialAllowance'] ? element['SpecialAllowance'] : '-',
        element['TDSAmount'] ? element['TDSAmount'] : '-',
        element['UniformFee'] ? element['UniformFee'] : '-',
        element['WashingAllowance'] ? element['WashingAllowance'] : '-',
        )
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
    let worksheet = workbook.addWorksheet('Hired Employees List');
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
    worksheet.mergeCells('A1:AR2');
    worksheet.addRow([]);

    worksheet.columns = [
      { width: 5 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
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

    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
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
      title: `Hired Employees List`,
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
        36: { cellWidth: 90 }, 37: { cellWidth: 90 }, 38: { cellWidth: 90 }, 39: { cellWidth: 90 }, 40: { cellWidth: 90 }, 41: { cellWidth: 90 },
        42: { cellWidth: 90 }, 43: { cellWidth: 90 }, 44: { cellWidth: 90 }, 45: { cellWidth: 90 }, 46: { cellWidth: 90 }, 47: { cellWidth: 90 },
      },
      bodyStyles: { fontSize: 11, lineWidth: 1, cellPadding: 5 } // Font Size for Rows
    });
    doc.save(`${this.commonService.Date()}_${this.fileName}.pdf`);
  }  

}
