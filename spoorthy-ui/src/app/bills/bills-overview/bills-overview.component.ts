import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { AddWorkorderService } from 'src/app/shared/http/add-workorder.service';
import { BillService } from 'src/app/shared/http/bill.service';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';

// >> export excel/pdf imports
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
declare var require: any;
var jsPDF = require('jspdf');
require('jspdf-autotable');
// export excel/pdf imports <<

@Component({
  selector: 'app-bills-overview',
  templateUrl: './bills-overview.component.html',
  styleUrls: ['./bills-overview.component.scss']
})
export class BillsOverviewComponent implements OnInit {

  workorderUrl = this.route.snapshot.params['workorderid']

  urlNav: string = 'Recent Bills'
  proceedToBillFlag: boolean = false
  isSaved: boolean = false
  workorderId = this.route.snapshot.params.workorderid
  billId = this.route.snapshot.params.billid;
  clientId: any;

  workOrderData: any;
  employeeData: any;
  billData: any;

  BillMonth: any;

  tableForm: FormGroup;
  SelectDays: number;

  TotalAmount: any = 0
  TotalGrossAmount: any = '0'
  totalDeduction: number = 0;

  singleWorkOrder: any;
  NoOfManDays: any = '0';

  Variation: number;
  TotalBillAmount: number = 0;
  billAbstractData: any;
  BillAbstractArr: any = [];
  WORoleDetail: any[];

  excelfile: any;
  arrayBuffer: any;

  year: number;
  month: number;
  totalDaysinSelectedMonth: number;
  td1: number;
  td2: number;
  td3: number;
  td4: number;
  td5: number;

  overallDaysCount: number = 0;
  fileName: string;
  overallOTDaysCount: number = 0;
  totalDaysCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private showLoaderService: NgxUiLoaderService,
    private workOrderService: AddWorkorderService,
    private employeeService: AddEmployeeService,
    private billService: BillService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private addWorkOrderService: AddWorkorderService,
    private commonService: CommonserviceService,
  ) {
    this.BillMonth = this.router.getCurrentNavigation().extras.state.row
  }

  attendenceMonthSource = new MatTableDataSource()
  attendenceMonthColumn = ['Sl No', 'OTEmp', 'OTBasedOn', 'EmployeeID', 'EmployeeName', 'Designation', 'Salary', 'NoOfDaysWorked', 'NoOfLeaves', 'OTDays',
    'TDS', 'Advance', 'Uniform', 'FinesDamages', 'OtherDeduction', 'SalaryAfterDeductions']

  attendenceDaySource = new MatTableDataSource()
  attendenceDayColumn = ['Employee ID', 'Employee Name', 'Designation', 'Salary', 'No. Of Days Worked', 'No. Of Leaves', 'Salary After Deduction for Leave(s) Taken']

  billAbstractSource = new MatTableDataSource()
  billAbstractColumn = ['SerialNo', 'Particulars', 'Quantity', 'Hired', 'NoOfManDays', 'Variation', 'TotalNoOfManDays', 'Wagespermonth', 'AmountinRs']

  ngOnInit(): void {
    this.year = +(this.BillMonth.Year);
    this.month = +(this.getMonthNumber(this.BillMonth.Month));

    this.totalDaysinSelectedMonth = this.getTotalDaysInMonth(this.year, this.month);

    this.td1 = +(+(this.totalDaysinSelectedMonth) - 1);
    this.td2 = +(+(this.totalDaysinSelectedMonth) - 2);
    this.td3 = +(+(this.totalDaysinSelectedMonth) - 3);
    this.td4 = +(+(this.totalDaysinSelectedMonth) - 4);
    this.td5 = +(+(this.totalDaysinSelectedMonth) - 5);

    this.SelectDays = this.totalDaysinSelectedMonth;

    this.getWorkorder();

    this.tableForm = new FormGroup({
      "NoOfDaysWorked": new FormControl('0'),
      "NoOfLeaves": new FormControl('0'),
      "TDSAmount": new FormControl('0'),
      "AdvanceAmount": new FormControl('0'),
      "UniformFee": new FormControl('0'),
      "FineAmount": new FormControl('0'),
      "OtherDeductionAmount": new FormControl('0'),
      "NoOfOTDays": new FormControl('0'),
      "OTWages": new FormControl('0'),
      "DueDate": new FormControl(null, [Validators.required]),

      "CGST": new FormControl('0'),
      "valueCGST": new FormControl({ value: '0.00', disabled: true }),

      "SGST": new FormControl('0'),
      "valueSGST": new FormControl({ value: '0.00', disabled: true }),

      "IGST": new FormControl('0'),
      "valueIGST": new FormControl({ value: '0.00', disabled: true }),

      "TDS": new FormControl('0'),
      "valueTDS": new FormControl({ value: '0.00', disabled: true }),

      "TDSCGST": new FormControl('0'),
      "valueTDSCGST": new FormControl({ value: '0.00', disabled: true }),

      "TDSSGST": new FormControl('0'),
      "valueTDSSGST": new FormControl({ value: '0.00', disabled: true })
    })
  }


  getTotalDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  getMonthNumber(month: string): number {
    const date = new Date(Date.parse(`1 ${month}`));
    return date.getMonth() + 1;
  }

  SearchFilter(str: string) {
    var filterArr = this.employeeData.filter((obj: any) => {
      return obj?.FullName.toLowerCase().includes(str.toLowerCase()) || obj?.UniqueEmpId.toLowerCase().toString().includes(str.toLowerCase())
    });
    this.attendenceMonthSource = new MatTableDataSource(filterArr)
  }

  UpdateDaysWorkedData(row, value) {
    this.employeeData.map((obj: any) => {
      if (obj._id == row._id) {
        if (value <= this.SelectDays && value >= 0) {
          obj.NoOfDaysWorked = value
          var Leaves = Math.abs(this.SelectDays - value)
          obj.NoOfLeaves = Leaves
          var singleDaySalary = (obj.WorkOrderRole.salary / this.SelectDays)
          var Total = (singleDaySalary * obj.NoOfDaysWorked)
          obj.SalaryAfterDeduction = Math.round(Total)

          this.overallDaysCount = this.attendenceMonthSource.data
            .map((row: any) => row.NoOfDaysWorked)
            .reduce((acc: number, curr: number) => acc + curr, 0);

          this.totalDaysCount = this.overallDaysCount;

        } else {
          this.toastr.error("Invalid Input")
          obj.NoOfDaysWorked = 0
          obj.NoOfLeaves = 0
          obj.SalaryAfterDeduction = 0
        }
      }
    })

    this.TotalAmount = 0
    this.employeeData.forEach((obj: any) => {
      this.TotalAmount = this.TotalAmount + obj.SalaryAfterDeduction
    });

    this.attendenceMonthSource = new MatTableDataSource(this.employeeData)

  }

  UpdateLeavesData(row, value) {
    this.employeeData.map((obj: any) => {
      if (obj._id == row._id) {
        if (value <= this.SelectDays && value >= 0) {
          obj.NoOfDaysWorked = Math.abs(this.SelectDays - value)
          var Leaves = value
          obj.NoOfLeaves = Leaves
          var singleDaySalary = (obj.WorkOrderRole.salary / this.SelectDays)
          var Total = (singleDaySalary * obj.NoOfDaysWorked)
          obj.SalaryAfterDeduction = Math.round(Total)
        } else {
          this.toastr.error("Invalid Input")
          obj.NoOfDaysWorked = 0
          obj.NoOfLeaves = 0
          obj.SalaryAfterDeduction = 0
        }
      }
    })

    this.TotalAmount = 0
    this.employeeData.forEach((obj: any) => {
      this.TotalAmount = this.TotalAmount + obj.SalaryAfterDeduction
    });

    this.attendenceMonthSource = new MatTableDataSource(this.employeeData)
  }

  UpdateOTData(event, row) {
    let NoOfOTDays = event.target.value;
    row.NoOfOTDays = NoOfOTDays;
    row.OTWages = row.OTWages ? row.OTWages : 0;
    row.SalaryAfterDeduction = (+row.SalaryAfterDeduction) - (+row.OTWages)

    this.overallOTDaysCount = this.attendenceMonthSource.data
      .map((row: any) => (+(row.NoOfOTDays)))
      .reduce((acc: number, curr: number) => acc + curr, 0);

    this.totalDaysCount = (+(this.overallDaysCount)) + (+(this.overallOTDaysCount));

    var BasicVDA = row.BasicVDA;
    var NetSal = row.GrossSalary;
    var daysinMonth = this.SelectDays;
    row.OTWages = 0;

    if (row.IsOTEmp == true) {
      if (row.OTBasedOn == "BasicVDA") {
        var singleDaySalary = (BasicVDA / daysinMonth);
        var OTWorkedSal = singleDaySalary * (+(NoOfOTDays));
        let resOTWorkedSal = Math.round(OTWorkedSal);
        row.OTWages = resOTWorkedSal.toFixed(2);
        var totEarned = (row.SalaryAfterDeduction + (+(row.OTWages)));
        row.SalaryAfterDeduction = totEarned;
      }
      else if (row.OTBasedOn == "NetSal") {
        var singleDaySalary = (NetSal / daysinMonth);
        var OTWorkedSal = singleDaySalary * (+(NoOfOTDays));
        let resOTWorkedSal = Math.round(OTWorkedSal);
        row.OTWages = resOTWorkedSal.toFixed(2);
        var totEarned = (row.SalaryAfterDeduction + (+(row.OTWages)));
        row.SalaryAfterDeduction = totEarned;
      }
      else {
        row.SalaryAfterDeduction = 0
        row.NoOfOTDays = 0
      }
    }
    // this.employeeData.map((obj: any) => {
    //   if (obj._id == row._id) {
    //   }
    // })
    this.TotalAmount = 0
    this.employeeData.forEach((obj: any) => {
      if (obj._id == row._id) {
        obj.NoOfOTDays = row.NoOfOTDays ? row.NoOfOTDays : 0;
        obj.OTWages = row.OTWages ? row.OTWages : 0;
        obj.SalaryAfterDeduction = row.SalaryAfterDeduction ? row.SalaryAfterDeduction : 0;
        obj.IsOTEmp = row.IsOTEmp ? row.IsOTEmp : false;
        obj.OTBasedOn = row.OTBasedOn ? row.OTBasedOn : obj.OTBasedOn;
      }
      this.TotalAmount = this.TotalAmount + obj.SalaryAfterDeduction
    });
  }

  UpdateTax() {
    var ValueCGST = this.TotalBillAmount * (this.tableForm.controls.CGST.value / 100);
    let resValueCGST = Math.round(ValueCGST);
    this.tableForm.controls.valueCGST.setValue(resValueCGST.toFixed(2))

    var ValueSGST = this.TotalBillAmount * (this.tableForm.controls.SGST.value / 100);
    let resValueSGST = Math.round(ValueSGST);
    this.tableForm.controls.valueSGST.setValue(resValueSGST.toFixed(2))

    // var ValueIGST = this.TotalAmount * (this.tableForm.controls.IGST.value / 100)
    // this.tableForm.controls.valueIGST.setValue(ValueIGST.toFixed(2))

    // var ValueTDS = this.TotalAmount * (this.tableForm.controls.TDS.value / 100)
    // this.tableForm.controls.valueTDS.setValue(ValueTDS.toFixed(2))

    // var ValueTDSCGST = this.TotalAmount * (this.tableForm.controls.TDSCGST.value / 100)
    // this.tableForm.controls.valueTDSCGST.setValue(ValueTDSCGST.toFixed(2))

    // var ValueTDSSGST = this.TotalAmount * (this.tableForm.controls.TDSSGST.value / 100)
    // this.tableForm.controls.valueTDSSGST.setValue(ValueTDSSGST.toFixed(2))
  }

  getWorkorder() {
    this.showLoaderService.start()
    this.workOrderService.getWorkOrder()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            var data = res['data'].filter((obj: any) => {
              return obj._id == this.workorderId
            })

            this.workOrderData = data[0]
            this.clientId = this.workOrderData.client._id
          }

          this.getEmployee();
        },
        err => {
          console.error(err)
          this.showLoaderService.stop()
        }
      )
  }

  async getEmployee() {
    this.showLoaderService.start()
    await this.employeeService.getEmployeeByWorkOrder({ id: this.workorderId })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          this.employeeData = res['data']
          this.employeeData.forEach((obj: any) => {
            obj["IsOTEmp"] == false;
          })
          this.attendenceMonthSource = new MatTableDataSource(this.employeeData);

          this.getDetailWorkOrder();

        },
        err => {
          console.error(err)
          this.showLoaderService.stop()
        }
      )
  }

  getBill() {
    this.showLoaderService.start()
    this.billService.getBillById({ id: this.billId })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.billData = res['data']
            var MonthYear = {
              'Month': this.billData.Month,
              'Year': this.billData.Year
            }
            this.BillMonth = MonthYear

            this.TotalAmount = 0
            this.employeeData.forEach((obj: any) => {
              this.billData.Employees.filter((element: any, i) => {
                if (obj._id == element.Employee._id) {
                  obj.NoOfDaysWorked = element.NoOfDaysWorked
                  obj.NoOfLeaves = element.NoOfLeaves
                  obj.TDSAmount = element.TDSAmount
                  obj.AdvanceAmount = element.AdvanceAmount
                  obj.UniformFee = element.UniformFee
                  obj.FineAmount = element.FineAmount
                  obj.OtherDeductionAmount = element.OtherDeductionAmount
                  obj.SalaryAfterDeduction = element.SalaryAfterDeduction
                  this.TotalAmount = this.TotalAmount + obj.SalaryAfterDeduction
                  obj.IsOTEmp = element.IsOTEmp
                  obj.OTBasedOn = element.OTBasedOn
                  obj.NoOfOTDays = element.NoOfOTDays ? element.NoOfOTDays : 0
                  obj.OTWages = element.OTWages ? element.OTWages : 0

                  this.overallDaysCount = this.attendenceMonthSource.data
                    .map((obj: any) => obj.NoOfDaysWorked)
                    .reduce((acc: number, curr: number) => acc + curr, 0);

                  this.overallOTDaysCount = this.attendenceMonthSource.data
                    .map((obj: any) => (+(obj.NoOfOTDays)))
                    .reduce((acc: number, curr: number) => acc + curr, 0);

                  this.totalDaysCount = (+(this.overallDaysCount)) + (+(this.overallOTDaysCount))
                }
              });
            });
            this.isSaved = true
            this.attendenceMonthSource = new MatTableDataSource(this.employeeData);

            // if (this.singleWorkOrder.workOrderRoles && this.singleWorkOrder.workOrderRoles.length > 0) {
            //   this.singleWorkOrder.workOrderRoles.forEach(oo => {
            //     let woEpl = this.employeeData.filter(ee =>
            //       (ee["WorkOrderRole"] && ee["WorkOrderRole"].role && ee["WorkOrderRole"].role._id == oo["role"]._id) ||
            //       (ee["Employee"] && ee["Employee"].WorkOrderRole && ee["Employee"].WorkOrderRole.role && ee["Employee"].WorkOrderRole.role._id == oo["role"]._id)
            //     );

            //     oo["hiredEmpworkedDays"] = (woEpl && woEpl.length > 0) ? woEpl.reduce((sum, curr) => sum + (+(curr.NoOfDaysWorked ? curr.NoOfDaysWorked : 0)) + (+(curr.NoOfOTDays ? curr.NoOfOTDays : 0)), 0) : 0;

            //     oo["TotalNoOfManDays"] = (woEpl && woEpl.length > 0) ? woEpl.reduce((sum, curr) => sum + (+(curr.NoOfDaysWorked ? curr.NoOfDaysWorked : 0)) + (+(curr.NoOfOTDays ? curr.NoOfOTDays : 0)), 0) : 0;

            //     var daysinMonth = this.SelectDays;
            //     var totManDays = oo.TotalNoOfManDays;
            //     var WagesMonth = oo.salary;
            //     var singleDaySalary = (WagesMonth / daysinMonth);
            //     var totalAmount = singleDaySalary * totManDays;

            //     oo["BillAmount"] = totalAmount > 0 ? (+(totalAmount.toFixed(2))) : 0;
            //   });
            // }

            if (this.singleWorkOrder.workOrderRoles && this.singleWorkOrder.workOrderRoles.length > 0) {
              this.singleWorkOrder.workOrderRoles.forEach(oo => {
                let woEpl = this.employeeData.filter(ee =>
                  (ee["WorkOrderRole"] && ee["WorkOrderRole"]._id == oo._id) ||
                  (ee["Employee"] && ee["Employee"].WorkOrderRole && ee["Employee"].WorkOrderRole._id == oo._id)
                );

                oo["hiredEmpworkedDays"] = (woEpl && woEpl.length > 0) ? woEpl.reduce((sum, curr) => sum + (+(curr.NoOfDaysWorked ? curr.NoOfDaysWorked : 0)) + (+(curr.NoOfOTDays ? curr.NoOfOTDays : 0)), 0) : 0;

                oo["TotalNoOfManDays"] = (woEpl && woEpl.length > 0) ? woEpl.reduce((sum, curr) => sum + (+(curr.NoOfDaysWorked ? curr.NoOfDaysWorked : 0)) + (+(curr.NoOfOTDays ? curr.NoOfOTDays : 0)), 0) : 0;

                var daysinMonth = this.SelectDays;
                var totManDays = oo.TotalNoOfManDays;
                var WagesMonth = oo.salary;
                var singleDaySalary = (WagesMonth / daysinMonth);
                var totalAmount = singleDaySalary * totManDays;
                let restotalAmount = Math.round(totalAmount);

                oo["BillAmount"] = restotalAmount > 0 ? (+(restotalAmount.toFixed(2))) : 0;
              });
            }


            this.BillAbstractArr = (this.singleWorkOrder && this.singleWorkOrder.workOrderRoles && this.singleWorkOrder.workOrderRoles.length > 0) ?
              this.singleWorkOrder.workOrderRoles.map((element: any) => ({
                "WOBranch": element.branchName,
                "WorkOrderRole": element._id,
                "WorkOrderRoleName": element.role.name,
                "WorkOrderRoleNameId": element.role._id,
                "WorkOrderRoleHired": element.hired ? element.hired : 0,
                "RequiredManpower": element.noOfManpower,
                "hiredEmpworkedDays": element.hiredEmpworkedDays,
                "Variation": element.Variation ? element.Variation : 0,
                "TotalNoOfManDays": element.TotalNoOfManDays,
                "WOWages": element.salary,
                "BillAmount": element.BillAmount,
              })) : [];

            // this.WORoleDetail = [];
            // let roles = this.singleWorkOrder.workOrderRoles.map((element: any) => ({
            //   "WORoleId": element.role._id,
            //   "WoORole": element.role.name,
            // }));
            // roles.forEach(ele => {
            //   var chk = this.WORoleDetail.map(item => item.WORoleId).indexOf(ele.WORoleId);
            //   if (chk <= -1) {
            //     this.WORoleDetail.push(ele);
            //   }
            // })
            // return this.WORoleDetail;

            if ((this.billData.billAbstract && this.billData.billAbstract.length > 0)) {
              this.BillAbstractArr = this.billData.billAbstract;
            }

            this.TotalBillAmount = 0;

            if (this.BillAbstractArr && this.BillAbstractArr.length > 0) {
              this.BillAbstractArr.forEach(item => {
                this.TotalBillAmount = this.TotalBillAmount + (+(item.BillAmount));
                let resTotalBillAmount = Math.round(this.TotalBillAmount);
                var bill = resTotalBillAmount.toFixed(2);
                this.TotalBillAmount = (+(bill))
              });
            }

            this.billAbstractSource = new MatTableDataSource(this.BillAbstractArr);
          }
        },
        err => {
          console.error(err)
          this.showLoaderService.stop()
        }
      )
  }

  // SaveChanges() {
  //   var EmployeeArr = []
  //   var params = {}
  //   this.employeeData.forEach((element: any) => {
  //     // element["SalaryAfterDeduction"] = this.onCalcFinalAmt(element);
  //     var obj = {
  //       "Employee": element._id,
  //       "NoOfDaysWorked": element.NoOfDaysWorked,
  //       "NoOfLeaves": element.NoOfLeaves,
  //       "TDSAmount": element.TDSAmount,
  //       "AdvanceAmount": element.AdvanceAmount,
  //       "UniformFee": element.UniformFee,
  //       "FineAmount": element.FineAmount,
  //       "OtherDeductionAmount": element.OtherDeductionAmount,
  //       "SalaryAfterDeduction": element.SalaryAfterDeduction
  //     }
  //     EmployeeArr.push(obj)
  //   });

  //   if (this.billId) {
  //     params = {
  //       id: this.billData._id,
  //       WorkOrder: this.workorderId,
  //       Client: this.clientId,
  //       Employees: EmployeeArr,
  //       Month: this.BillMonth.Month,
  //       Year: this.BillMonth.Year
  //     }
  //   } else {
  //     params = {
  //       WorkOrder: this.workorderId,
  //       Client: this.clientId,
  //       Employees: EmployeeArr,
  //       Month: this.BillMonth.Month,
  //       Year: this.BillMonth.Year
  //     }
  //   }

  //   this.showLoaderService.start()
  //   this.billService.saveBill(params)
  //     .subscribe(
  //       res => {
  //         this.showLoaderService.stop()
  //         if (res['success'] == true) {
  //           this.toastr.success(res['message'])
  //           // this.billId = res['data']._id
  //           this.getBill()
  //         } else {
  //           this.toastr.success(res['message'])
  //         }
  //       },
  //       err => {
  //         this.showLoaderService.stop()
  //         console.error(err)
  //       }
  //     )
  // }

  SaveChanges() {
    var EmployeeArr = []
    var params = {}
    this.employeeData.forEach((element: any) => {
      // element["SalaryAfterDeduction"] = this.onCalcFinalAmt(element);
      var obj = {
        "Employee": element._id,
        "NoOfDaysWorked": element.NoOfDaysWorked,
        "NoOfLeaves": element.NoOfLeaves,
        "TDSAmount": element.TDSAmount,
        "AdvanceAmount": element.AdvanceAmount,
        "UniformFee": element.UniformFee,
        "FineAmount": element.FineAmount,
        "OtherDeductionAmount": element.OtherDeductionAmount,
        "SalaryAfterDeduction": element.SalaryAfterDeduction,
        "IsOTEmp": element.IsOTEmp,
        "OTBasedOn": element.OTBasedOn,
        "NoOfOTDays": element.NoOfOTDays,
        "OTWages": element.OTWages,
      }
      EmployeeArr.push(obj)
    });

    if (this.billId) {
      params = {
        id: this.billData._id,
        WorkOrder: this.workorderId,
        Client: this.clientId,
        Employees: EmployeeArr,
        Month: this.BillMonth.Month,
        Year: this.BillMonth.Year
      }
    } else {
      params = {
        WorkOrder: this.workorderId,
        Client: this.clientId,
        Employees: EmployeeArr,
        Month: this.BillMonth.Month,
        Year: this.BillMonth.Year
      }
    }

    this.showLoaderService.start()
    this.billService.saveBill(params)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'])
            if (res['data']._id && res['data']._id.length > 0) {
              this.billId = res['data']._id
            }
            this.getBill()
          } else {
            this.toastr.success(res['message'])
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  GenerateBill() {
    var params = {
      "id": this.billData._id,
      "DueDate": this.tableForm.controls.DueDate.value,
      "GrossAmount": this.TotalGrossAmount,
      "TotalAmount": this.TotalAmount,
      "TotalBillAmount": this.TotalBillAmount,
      "CGST": this.tableForm.get('CGST').value,
      "SGST": this.tableForm.get('SGST').value,
      "IGST": this.tableForm.get('IGST').value,
      "TDS": this.tableForm.get('TDS').value,
      "TDSCGST": this.tableForm.get('TDSCGST').value,
      "TDSSGST": this.tableForm.get('TDSSGST').value,
      "CGSTAmount": this.tableForm.controls.valueCGST.value,
      "SGSTAmount": this.tableForm.controls.valueSGST.value
    }
    this.showLoaderService.start()
    this.billService.generateBill(params)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'])
            sessionStorage.removeItem('date')
            this.router.navigate(['invoice/' + this.billData._id])
          } else {
            this.toastr.success(res['message'])
          }
        },
        err => {
          this.toastr.error('Please fill Due Date')
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  OpenModal(target) {
    $('#' + target.toString()).slideToggle('fast') as JQuery
    // (document.getElementById(target) as HTMLInputElement).style.display = 'block'
  }

  CloseModal(target) {
    $('#' + target.toString()).slideToggle('fast') as JQuery
    // (document.getElementById(target) as HTMLInputElement).style.display = 'none'
  }

  ProceedToBill() {
    if (this.isSaved == true) {
      this.proceedToBillFlag = true;
      this.TotalGrossAmount = (this.TotalBillAmount + (Number(this.tableForm.controls.valueCGST.value) +
        Number(this.tableForm.controls.valueSGST.value)
        // Number(this.tableForm.controls.valueIGST.value) +
        // Number(this.tableForm.controls.valueTDS.value) +
        // Number(this.tableForm.controls.valueTDSCGST.value) +
        // Number(this.tableForm.controls.valueTDSSGST.value)
      ));
      var totalGross = Math.round((+(this.TotalGrossAmount)));
      this.TotalGrossAmount = totalGross.toFixed(2);
      (document.getElementById('TaxModal') as HTMLInputElement).style.display = 'none'
    } else {
      this.toastr.error('Please save the changes before proceeding')
    }
  }

  Back() {
    this.proceedToBillFlag = false;
    (document.getElementById('TaxModal') as HTMLInputElement).style.display = 'block'
  }

  onCalcFinalAmt(row) {
    return (row.NoOfDaysWorked > 0) ? (+(row.WorkOrderRole.salary || row.Employee?.WorkOrderRole.salary)) -
      ((+(row.TDSAmount ? row.TDSAmount : 0)) +
        (+(row.AdvanceAmount ? row.AdvanceAmount : 0)) +
        (+(row.UniformFee ? row.UniformFee : 0)) +
        (+(row.FineAmount ? row.FineAmount : 0)) +
        (+(row.OtherDeductionAmount ? row.OtherDeductionAmount : 0))) : 0;
  }

  getDetailWorkOrder() {
    this.showLoaderService.start()
    this.addWorkOrderService.getWorkOrderById({ id: this.workorderUrl })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.singleWorkOrder = res['data']

          }

          if (this.billId) {
            this.getBill();
          }
          else {
            this.BillAbstractArr = (this.singleWorkOrder && this.singleWorkOrder.workOrderRoles && this.singleWorkOrder.workOrderRoles.length > 0) ?
              this.singleWorkOrder.workOrderRoles.map((element: any) => ({
                "WOBranch": element.branchName,
                "WorkOrderRole": element._id,
                "WorkOrderRoleName": element.role.name,
                "WorkOrderRoleNameId": element.role._id,
                "WorkOrderRoleHired": element.hired,
                "RequiredManpower": element.noOfManpower,
                "hiredEmpworkedDays": element.hiredEmpworkedDays,
                "Variation": element.Variation ? element.Variation : 0,
                "TotalNoOfManDays": element.TotalNoOfManDays,
                "WOWages": element.salary,
                "BillAmount": element.BillAmount,
              })) : [];

            this.TotalBillAmount = 0;

            if (this.BillAbstractArr && this.BillAbstractArr.length > 0) {
              this.BillAbstractArr.forEach(item => {
                this.TotalBillAmount = this.TotalBillAmount + (+(item.BillAmount));
              });
            }

            this.billAbstractSource = new MatTableDataSource(this.BillAbstractArr);
          }

        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  selectionChange(row) {
    row['IsOTEmp'] = !row['IsOTEmp'];
    if (!row['IsOTEmp']) {
      row['OTBasedOn'] = ''
      row['NoOfOTDays'] = ''
      row['OTWages'] = ''
    }
  }

  // UpdateVariationData(row) {
  //   this.Variation = 0;

  //   var Variation = row.Variation;
  //   var NoOfManDays = row.hiredEmpworkedDays;

  //   row["TotalNoOfManDays"] = (+(NoOfManDays)) + (+(Variation));

  //   var daysinMonth = this.SelectDays;
  //   var totManDays = row.TotalNoOfManDays;
  //   var WagesMonth = row.salary;
  //   var singleDaySalary = (WagesMonth / daysinMonth);
  //   var totalAmount = singleDaySalary * totManDays;
  //   this.tot = totalAmount.toFixed(2);
  //   this.totalAmount = Math.round(this.tot);

  //   row["BillAmount"] = this.totalAmount;
  // }

  UpdateVariationData(event, row) {
    let Variation = event.target.value;

    if (Variation && isNaN(Variation)) {
      this.toastr.error("Please enter a valid number");
    } else if (Variation > 0) {
      this.toastr.success("Valid Number");
      // do something with positive number
    } else if (Variation < 0) {
      this.toastr.success("Valid Number");
      // do something with negative number
    } else {
      this.toastr.error("Please enter either a negative or positive number");
    }


    row.Variation = Variation;
    var NoOfManDays = row.hiredEmpworkedDays;

    console.log(Variation)

    row["TotalNoOfManDays"] = (+(NoOfManDays)) + (+(Variation));

    var daysinMonth = this.SelectDays;
    var totManDays = row.TotalNoOfManDays;
    var WagesMonth = row.WOWages;
    var singleDaySalary = (WagesMonth / daysinMonth);
    var totalAmount = singleDaySalary * totManDays;
    let restotalAmount = Math.round(totalAmount);

    row["BillAmount"] = restotalAmount > 0 ? (+(restotalAmount.toFixed(2))) : 0;

    this.TotalBillAmount = 0;

    if (this.BillAbstractArr && this.BillAbstractArr.length > 0) {
      this.BillAbstractArr.forEach(item => {
        this.TotalBillAmount = this.TotalBillAmount + (+(item.BillAmount));
      });
    }

    this.billAbstractSource = new MatTableDataSource(this.BillAbstractArr);

  }

  SaveBillAbstract() {
    var params = {}

    if (this.billId) {
      params = {
        id: this.billData._id,
        billAbstract: this.BillAbstractArr,
      }
    } else {
      this.toastr.error("Please save above datas first")
      return;
    }

    this.showLoaderService.start()
    this.billService.saveBillAbstract(params)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'])
            if (res['data']._id && res['data']._id.length > 0) {
              this.billId = res['data']._id
            }
            this.getBill()
          } else {
            this.toastr.success(res['message'])
          }
        },
        err => {
          this.showLoaderService.stop()
        }
      )
  }

  addfile(event) {
    this.excelfile = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.excelfile);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, { type: "binary" });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];

      const employer = worksheet['C1'].h
      const workOrder = worksheet['C2'].h
      const month = worksheet['C3'].h
      const year = worksheet['C4'].v

      if (employer.toLowerCase() != this.singleWorkOrder.client.name.toLowerCase()) {
        this.toastr.error('The name of the client is incorrect. Please select a file with the correct name.');
        return;
      }
      else if (workOrder.toLowerCase() != this.singleWorkOrder.name.toLowerCase()) {
        this.toastr.error('The name of the workorder is incorrect. Please select a file with the correct name.');
        return;
      }
      else if (month.toLowerCase() != this.BillMonth.Month.toLowerCase()) {
        this.toastr.error('Uploaded file Month does not match with the bill generation Month. Please select a file with the correct Month.');
        return;
      }
      else if (year != this.year) {
        this.toastr.error('Uploaded file Year does not match with the bill generation Year. Please select a file with the correct Year.');
        return;
      }


      let arraylist: any = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 6 });
      console.log(arraylist);

      const matchedData = [];
      for (let i = 1; i < arraylist.length; i++) { // start from index 1 to skip header row
        const excelId = arraylist[i][1]; // assuming employee ID is in column B (0-based index)
        const browserEmployee = this.employeeData.find(employee => employee.UniqueEmpId === excelId);

        const NoOfDaysWorked = arraylist[i].slice(1)[3];
        const NoOfLeaves = arraylist[i].slice(1)[4];
        const TDSAmount = arraylist[i].slice(1)[5];
        const AdvanceAmount = arraylist[i].slice(1)[6];
        const UniformFee = arraylist[i].slice(1)[7];
        const FineAmount = arraylist[i].slice(1)[8];
        const OtherDeductionAmount = arraylist[i].slice(1)[9];

        const totalDays = this.SelectDays
        var singleDaySalary = (browserEmployee.WorkOrderRole.salary / this.SelectDays)
        var Total = (singleDaySalary * NoOfDaysWorked)
        var SalaryAfterDeduction = Math.round(Total)


        if (browserEmployee) {

          browserEmployee.NoOfDaysWorked = NoOfDaysWorked
          browserEmployee.NoOfLeaves = NoOfLeaves
          browserEmployee.TDSAmount = TDSAmount
          browserEmployee.AdvanceAmount = AdvanceAmount
          browserEmployee.UniformFee = UniformFee
          browserEmployee.FineAmount = FineAmount
          browserEmployee.OtherDeductionAmount = OtherDeductionAmount
          browserEmployee.SalaryAfterDeduction = SalaryAfterDeduction

          this.overallDaysCount += arraylist[i].slice(1)[3];
          this.TotalAmount += SalaryAfterDeduction;

        }
      }

      console.log(matchedData);
    };
  }



  export(type) {
    // const title = 'Employees List';
    this.fileName = "Employees List";

    const subtitle1 = ['Principle Employer', ' ', this.singleWorkOrder.client.name ? this.singleWorkOrder.client.name : '-'];
    const subtitle2 = ['WorkOrder Name', ' ', this.singleWorkOrder.name ? this.singleWorkOrder.name : '-'];
    const subtitle3 = ['Attendance Month', ' ', this.BillMonth.Month ? this.BillMonth.Month : '-'];
    const subtitle4 = ['Attendance Year', ' ', this.BillMonth.Year ? this.BillMonth.Year : '-'];

    const header = ["#", 'Employee ID', 'Employee Name', 'Designation', 'Total Pay Days', 'LOP', 'Tax Deduction', 'Advance',
      'Uniform', 'Fines/Damage', 'Other Deduction'];
    let data = [];
    this.employeeData.forEach((element, key) => {
      let newArray = [];
      newArray.push(
        key + 1,
        element['UniqueEmpId'] ? element['UniqueEmpId'] : '-',
        element['FullName'] ? element['FullName'] : '-',
        element['WorkOrderRole'].role ? element['WorkOrderRole'].role.name : '-',
      )
      data[key] = newArray;
    });

    if (type == 'Excel') {
      // this.expoerExcel(title, subtitle1, subtitle2, subtitle3, subtitle4, header, data);
      this.expoerExcel(subtitle1, subtitle2, subtitle3, subtitle4, header, data);
    }
  }

  expoerExcel(subtitle1, subtitle2, subtitle3, subtitle4, header, data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Employees List');
    // let titleRow = worksheet.addRow([title]);
    // titleRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'D2DCE2' },
    //   bgColor: { argb: 'FFFFFF00' }
    // };
    // Set font, size and style in title row.
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultRowWidth = 500;
    // titleRow.font = { name: 'Calibri', family: 4, size: 14, underline: 'double', bold: true };
    // Blank Row
    // worksheet.addRow([]);
    // worksheet.mergeCells('A1:AR2');
    // worksheet.addRow([]);

    let subtitle1Row = worksheet.addRow(subtitle1);
    subtitle1Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A1:B1');

    let subtitle2Row = worksheet.addRow(subtitle2);
    subtitle2Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A2:B2');

    let subtitle3Row = worksheet.addRow(subtitle3);
    subtitle3Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A3:B3');

    let subtitle4Row = worksheet.addRow(subtitle4);
    subtitle4Row.font = { bold: false };
    // Blank Row
    worksheet.mergeCells('A4:B4');
    // Blank Row
    worksheet.mergeCells('A5:B5');
    worksheet.addRow([]);

    worksheet.columns = [
      { width: 5 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
      { width: 20 }, { width: 20 }
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

    worksheet.getRow().alignment = { horizontal: 'left', vertical: 'left' };
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
