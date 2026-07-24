import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { environment } from 'src/environments/environment';
import { AddEmployeeService } from '../../shared/http/add-employee.service';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {

  public userDetails: any = '';

  public DocUrl = environment.baseUrl2
  public candidateId = this.route.snapshot.params.id

  public feedbackSource: any;
  feedbackColumn: string[] = ['Feedback Type', 'Feedback/ Remarks', 'Uploaded Photo', 'Submitted On', 'Submitted By']

  public bankForm: FormGroup;
  public employeeData: any;
  public genderData: any;
  public bloodGroupData: any;
  public maritalStatusData: any;
  public religionData: any;

  public languageArr: string[] = [];
  public designationArr: string[] = [];
  public courseArr: string[] = [];
  public occupationArr: string[] = [];
  public relationshipArr: string[] = [];


  public UANPFForm: FormGroup;
  public ApprovalForm: FormGroup;
  grossSalary: number;

  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  getMonth: any;
  getYear: any;
  AttendanceData: any;
  showSalary: any;

  modalRef: BsModalRef;
  employeeDataList: any;
  accountNumber: any;
  UniversalAccount: any;
  ESI: any;

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private addEmployeeService: AddEmployeeService,
    private date: DatePipe,
    private modalService: BsModalService,
    private commonService: CommonserviceService
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('userDetails') != null)
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    this.feedbackSource = new MatTableDataSource([])

    this.getEmployee()
    this.getAllEmployee()

    this.bankForm = new FormGroup({
      "BankName": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      "Branch": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      "AccountNumber": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      "IFSC": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')])
    })

    this.UANPFForm = new FormGroup({
      'UniversalAccount': new FormControl(null, [Validators.pattern('^[0-9]{12}$')]),
      'PFAccount': new FormControl(null, [Validators.pattern('^[A-Z]{2}[A-Z]{3}[0-9]{7}[0-9A-Z]{3}[0-9]{7}$')]),
      'SchemeCertificate': new FormControl(null, [Validators.pattern('^[A-Z]{2}[/]{1}[A-Z]{3}[/]{1}[0-9]{5}$')]),
      'PPONumber': new FormControl(null, [Validators.pattern('^[0-9]{12}$')]),
      'NonContributoryPeriod': new FormControl(null, [Validators.pattern('')]),
      // 'ESI': new FormControl(null, [Validators.pattern('^[0-9]{2}[-]{1}[0-9]{2}[-]{1}[0-9]{6}[-]{1}[0-9]{3}[-]{1}[0-9]{4}$')]),
      'ESI': new FormControl("", [Validators.pattern('^[0-9]{10}$')]),
    })

    this.ApprovalForm = new FormGroup({
      'SalarySet': new FormControl(this.grossSalary, [Validators.required, Validators.pattern('^[0-9]*$')]),
      "Remarks": new FormControl(null)
    })
  }

  FetchResult() {
    this.showLoaderService.start()
    var param = {
      id: this.candidateId,
      Month: this.getMonth,
      Year: this.getYear
    }
    this.addEmployeeService.getAttendanceByDate(param)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.showSalary = this.employeeData?.Salary
            this.AttendanceData = res['data']
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  getAllEmployee() {
    this.showLoaderService.start()
    this.addEmployeeService.getEmployee()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.employeeDataList = res['data']

            console.log(res['data']);
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  onSubmit() {
    if (this.bankForm.get('AccountNumber').value != '' || this.bankForm.get('AccountNumber').value != undefined) {
      if (this.employeeData.AccountNumber == this.bankForm.get('AccountNumber').value) {
        this.accountNumber = this.bankForm.get('AccountNumber').value
      }
      else if (this.employeeData.AccountNumber != this.bankForm.get('AccountNumber').value) {
        const ACNumber = this.employeeDataList.find(e => e.AccountNumber == this.bankForm.get('AccountNumber').value);
        if (ACNumber) {
          this.toastr.error("A/C Number already exists!");
          return;
        } else {
          this.accountNumber = this.bankForm.get('AccountNumber').value
        }
      }
    }
    var params = {
      "id": this.candidateId,
      "BankName": this.bankForm.get('BankName').value,
      "Branch": this.bankForm.get('Branch').value,
      "AccountNumber": this.accountNumber,
      "IFSC": this.bankForm.get('IFSC').value
    }
    this.showLoaderService.start()
    this.addEmployeeService.addBankDetails(params)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  async getEmployee() {
    this.showLoaderService.start()
    await this.addEmployeeService.getEmployeeById({ id: this.candidateId })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.employeeData = res['data']

            this.grossSalary = this.employeeData.GrossSalary;

            this.feedbackSource = new MatTableDataSource(this.employeeData.Feedback)

            this.bankForm.controls.BankName.setValue(this.employeeData?.BankName)
            this.bankForm.get('Branch').setValue(this.employeeData?.Branch)
            this.bankForm.get('AccountNumber').setValue(this.employeeData?.AccountNumber)
            this.bankForm.get('IFSC').setValue(this.employeeData?.IFSC)

            this.UANPFForm.get('PFAccount').setValue(this.employeeData?.PFAccount)
            this.UANPFForm.get('PPONumber').setValue(this.employeeData?.PPONumber)
            this.UANPFForm.get('SchemeCertificate').setValue(this.employeeData?.SchemeCertificate)
            this.UANPFForm.get('UniversalAccount').setValue(this.employeeData?.UniversalAccount)
            this.UANPFForm.get('ESI').setValue(this.employeeData?.ESI)
            this.UANPFForm.get('NonContributoryPeriod').setValue(this.employeeData?.NonContributoryPeriod)

          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  onSubmitESIPF() {
    if (this.UANPFForm.get('UniversalAccount').value != '' || this.UANPFForm.get('UniversalAccount').value != undefined) {
      if (this.employeeData.UniversalAccount == this.UANPFForm.get('UniversalAccount').value) {
        this.UniversalAccount = this.UANPFForm.get('UniversalAccount').value
      }
      else if (this.employeeData.UniversalAccount != this.UANPFForm.get('UniversalAccount').value) {
        const UAN = this.employeeDataList.find(e => e.UniversalAccount == this.UANPFForm.get('UniversalAccount').value);
        if (UAN) {
          this.toastr.error("Universal Account Number already exists!");
          return;
        } else {
          this.UniversalAccount = this.UANPFForm.get('UniversalAccount').value
        }
      }
    }
    if (this.UANPFForm.get('ESI').value != '' || this.UANPFForm.get('ESI').value != undefined) {
      if (this.employeeData.ESI == this.UANPFForm.get('ESI').value) {
        this.ESI = this.UANPFForm.get('ESI').value
      }
      else if (this.employeeData.ESI != this.UANPFForm.get('ESI').value) {
        const ESI = this.employeeDataList.find(e => e.ESI == this.UANPFForm.get('ESI').value);
        if (ESI) {
          this.toastr.error("Universal Account Number already exists!");
          return;
        } else {
          this.ESI = this.UANPFForm.get('ESI').value
        }
      }
    }
    var params = {
      "id": this.candidateId,
      "PFAccount": this.UANPFForm.get('PFAccount').value,
      "PPONumber": this.UANPFForm.get('PPONumber').value,
      "SchemeCertificate": this.UANPFForm.get('SchemeCertificate').value,
      "UniversalAccount": this.UniversalAccount,
      "ESI": this.ESI,
      "NonContributoryPeriod": this.UANPFForm.get('NonContributoryPeriod').value
    }
    this.showLoaderService.start()
    this.addEmployeeService.addESIPFDetails(params)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  openApprovalModal(template: TemplateRef<any>) {

    this.ApprovalForm.patchValue({
      "SalarySet": this.grossSalary
    })

    this.modalRef = this.modalService.show(template, {
      // class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  GMApprovalStatus(isApproved) {
    let URL = `/GMApproval`;
    var params = {
      "id": this.candidateId,
      "ApprovedByGM": isApproved,
      "GrossSalary": this.ApprovalForm.get('SalarySet').value,
      "RemarksByGM": this.ApprovalForm.get('Remarks').value,
    }
    this.showLoaderService.start()
    this.commonService.onCommonPost(params, URL)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }


  MDApprovalStatus(isApproved) {
    let URL = `/MDApproval`;
    var params = {
      "id": this.candidateId,
      "GrossSalary": this.ApprovalForm.get('SalarySet').value,
      "ApprovedByMD": isApproved,
      "RemarksByMD": this.ApprovalForm.get('Remarks').value,
    }
    this.showLoaderService.start()
    this.commonService.onCommonPost(params, URL)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

}
