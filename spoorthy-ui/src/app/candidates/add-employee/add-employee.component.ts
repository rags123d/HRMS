import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from "../../shared/http/add-employee.service";
import { requiredFileType } from "../../helper-functions/requiredFileType";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Expansion } from '@angular/compiler';
import { AddStructureService } from 'src/app/shared/http/add-structure.service';
import { DatePipe } from '@angular/common';
import { PayscalfixationService } from 'src/app/shared/http/payscalfixation.service';
// enum CheckBoxType { FRESHER, EXPERIENCE, NONE };

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  public userDetails: any = '';

  public employeeForm: FormGroup;
  public familyForm: FormGroup;
  public educationalQualificationForm: FormGroup;
  public workExperienceForm: FormGroup;
  public languagesKnownForm: FormGroup;
  public referencesForm: FormGroup;
  public noOfChildrenForm: FormGroup;

  public Gender: any[];
  public MaritalStatus: any[];
  public Religion: any[];
  public BloodGroup: any[];
  public Course: any[];
  public Occupation: any[];
  public Designation: any[];
  public Workorder: any[];
  public WorkOrderRole: any[];
  // public WorkOrderUnitBranch: any[];
  public Language: any[];
  public Relationship: any[];
  public Year: any[];

  public languageArr: any[];
  public childrenArr: any[];

  public data: any;

  public formCounter: number = 0

  public CandidatePhoto: any;
  public AadharDocument: any;
  public ResumeDocument: any;
  public PANDocument: any;
  public QualificationDocument: any;

  currentlyChecked = "EXPERIENCED";
  selectedESIBased = "";
  selectedAddress: boolean;

  familyColumn: string[] = ['Relationship', 'Name', 'Date Of Birth', 'Aadhar No.', 'Contact No.', 'Action']
  educationalColumn: string[] = ['Course', 'School/ College Name', 'From', 'To', 'Marks in %/grade/rank', 'Action'];
  workExperienceColumn: string[] = ['Designation', 'Company Name', 'From', 'To', 'Salary Drawn', 'Reason for Leaving', 'Supervisor Name',
    'Supervisor Mobile', 'Supervisor Email', 'Action']
  referencesColumn: string[] = ['Name', 'Occupation', 'Address', 'Contact No.', 'Aadhar No.', 'Action']

  public familySource: any;
  public educationalSource: any;
  public workExperienceSource: any;
  public referencesSource: any;

  public familyTest: Array<Object> = []
  public eduTest: Array<Object> = []
  public workTest: Array<Object> = []
  public referenceTest: Array<Object> = []

  public DocUrl = environment.baseUrl2
  public employeeData: any;

  public url = this.route.snapshot.params.id


  public languageList = [];
  public todaydate = new Date();

  AadharDocumenturl: any = undefined;
  CandidatePhotourl: any = undefined;
  ResumeDocumenturl: any = undefined;
  PANDocumenturl: any = undefined;
  AssessmentDocumenturl: any = undefined;
  IDProofDocumenturl: any = undefined;
  PassbookDocumenturl: any = undefined;
  QualificationDocumenturl: any = undefined;
  WorkExperienceLetterurl: any = undefined;

  salaryData: any;
  selectedValue: string[] = [];
  selectedDeductionValue: string[] = [];
  TotalNetSal: number = 0;
  Result: number = 0;
  NetGrossSal: number = 0;
  PF: number = 0;
  ESI: number = 0;
  WODesignation: any[];
  empData: any;
  fixationData: any[];
  fixationInfo: any[];
  public WODATA: any[];
  WOLocation: any;
  transformed: any[];
  fixationValues: any;
  employeeDataList: any;
  WOSalary: any;

  // AadharDocumenturl: string;

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private addEmployeeService: AddEmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private addStructureService: AddStructureService,
    private datePipe: DatePipe,
    private payscaleFixationService: PayscalfixationService,
  ) { }

  @HostListener('change', ['$event.target']) emitFiles(event: FileList) {
    if (event != null) {
      var Elem = event as any

      if (Elem.files != null) {
        const file = Elem.files[0]
        if (Elem.id == 'CandidatePhoto' && file) {
          var element = document.getElementById("CandidatePhotoName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.CandidatePhotourl = objUrl;
          this.employeeForm.controls.CandidatePhoto.setValue(file)
        }
        else if (Elem.id == 'AadharDocument' && file) {
          var element = document.getElementById("AadharDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.AadharDocumenturl = objUrl;
          this.employeeForm.controls.AadharDocument.setValue(file)
        }
        else if (Elem.id == 'ResumeDocument') {
          var element = document.getElementById("ResumeDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.ResumeDocumenturl = objUrl;
          this.employeeForm.controls.ResumeDocument.setValue(file)
        }
        else if (Elem.id == 'PANDocument') {
          var element = document.getElementById("PANDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.PANDocumenturl = objUrl;
          this.employeeForm.controls.PANDocument.setValue(file)
        }
        else if (Elem.id == 'AssessmentDocument') {
          var element = document.getElementById("AssessmentDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.AssessmentDocumenturl = objUrl;
          this.employeeForm.controls.AssessmentDocument.setValue(file)
        }
        else if (Elem.id == 'IDProofDocument') {
          var element = document.getElementById("IDProofDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.IDProofDocumenturl = objUrl;
          this.employeeForm.controls.IDProofDocument.setValue(file)
        }
        else if (Elem.id == 'PassbookDocument') {
          var element = document.getElementById("PassbookDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.PassbookDocumenturl = objUrl;
          this.employeeForm.controls.PassbookDocument.setValue(file)
        }
        else if (Elem.id == 'QualificationDocument') {
          var element = document.getElementById("QualificationDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.QualificationDocumenturl = objUrl;
          this.employeeForm.controls.QualificationDocument.setValue(file)
        }
        else if (Elem.id == 'WorkExperienceLetter') {
          var element = document.getElementById("WorkExperienceLetterName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.WorkExperienceLetterurl = objUrl;
          this.workExperienceForm.controls.WorkExperienceLetter.setValue(file)
        }
      }
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('userDetails') != null)
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    this.familySource = new MatTableDataSource([]);
    this.educationalSource = new MatTableDataSource([]);
    this.workExperienceSource = new MatTableDataSource([]);
    this.referencesSource = new MatTableDataSource([]);

    this.getGender()
    this.getMaritalStatus()
    this.getReligion()
    this.getBloodGroup()
    this.getCourse()
    this.getDesignation()
    this.getOccupation()
    this.getWorkorder()
    this.getLanguage()
    this.getRelationship()
    this.getYear()
    this.getAllStructure()
    this.getpayscaleFixation()
    this.getAllEmployee()


    this.employeeForm = new FormGroup({
      'FullName': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'Age': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]),
      'DateOfBirth': new FormControl(null, [Validators.required]),
      'PlaceOfBirth': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z]*$'), Validators.maxLength(100)]),
      'MotherTongue': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z]*$'), Validators.maxLength(100)]),
      'Gender': new FormControl('', [Validators.required]),
      'MaritalStatus': new FormControl('', [Validators.required]),
      'Religion': new FormControl('', [Validators.required]),
      'BloodGroup': new FormControl(''),
      'AadharNo': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(12)]),
      'PAN': new FormControl(null, [Validators.pattern('^[A-Z0-9]*$'), Validators.maxLength(10)]),
      'ParentName': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'EmailId': new FormControl(null, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      'SpouseName': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),

      'PresentAddress': new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      'PresentAddressPincode': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]),
      'PresentAddressPhone': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]),
      'PermanentAddress': new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      'PermanentAddressPincode': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]),
      'PermanentAddressPhone': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]),

      'Identification1': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'Identification2': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'Mark1': new FormControl(null),
      'Mark2': new FormControl(null),

      'CandidatePhoto': new FormControl(null, [Validators.required, requiredFileType(['jpg', 'png', 'jpeg'])]),
      'AadharDocument': new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      'ResumeDocument': new FormControl(null, [requiredFileType(['pdf'])]),
      'PANDocument': new FormControl(null, [requiredFileType(['pdf'])]),
      'IDProofDocument': new FormControl(null, [requiredFileType(['pdf'])]),
      'PassbookDocument': new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      'QualificationDocument': new FormControl(null, [requiredFileType(['pdf'])]),

      'WorkOrder': new FormControl('', [Validators.required]),
      'GrossSalary': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'NetSalary': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'DeductedSalary': new FormControl(null),
      'AssessmentDocument': new FormControl(null, [requiredFileType(['pdf'])]),
      'WorkOrderRole': new FormControl('', [Validators.required]),
      // 'WorkOrderUnitBranch': new FormControl('', [Validators.required]),
      'DateOfJoining': new FormControl(null),
      'DateOfExit': new FormControl(null),
      'ReasonForExit': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'FetchFixation': new FormControl('', [Validators.required]),

      'BasicVDA': new FormControl(null),
      'benefitType': new FormControl(null),
      'Gratuity': new FormControl(null),
      'MedicalAllowance': new FormControl(null),
      'RelieverCharges': new FormControl(null),
      'Bonus': new FormControl(null),
      'HRA': new FormControl(null),
      'NationalFestivalHolidays': new FormControl(null),
      'Conveyance': new FormControl(null),
      'LeaveWithWages': new FormControl(null),
      'WashingAllowance': new FormControl(null),
      'SpecialAllowance': new FormControl(null),

      'deductionType': new FormControl(null),
      'PFAmount': new FormControl(null),
      'ESIAmount': new FormControl(null),
      'ProfessionalTax': new FormControl(null),

      'Language': new FormControl(null),
      'Speak': new FormControl(false),
      'Write': new FormControl(false),
      'Read': new FormControl(false),

      'Langauges': this.fb.array([this.fb.group({
        Language: [''],
        Speak: [false],
        Write: [false],
        Read: [false]
      })]),

      'UniversalAccount': new FormControl("", [Validators.pattern('^[0-9]{12}$')]),
      'PFAccount': new FormControl("", [Validators.pattern('^[A-Z]{2}[A-Z]{3}[0-9]{7}[0-9A-Z]{3}[0-9]{7}$')]),
      'SchemeCertificate': new FormControl("", [Validators.pattern('^[A-Z]{2}[/]{1}[A-Z]{3}[/]{1}[0-9]{5}$')]),
      'PPONumber': new FormControl("", [Validators.pattern('^[0-9]{12}$')]),
      'NonContributoryPeriod': new FormControl("", [Validators.pattern('')]),
      // 'ESI': new FormControl("", [Validators.pattern('^[0-9]{2}[-]{1}[0-9]{2}[-]{1}[0-9]{6}[-]{1}[0-9]{3}[-]{1}[0-9]{4}$')]),
      'ESI': new FormControl("", [Validators.pattern('^[0-9]{10}$')]),

      "BankName": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      "Branch": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      "AccountNumber": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      "IFSC": new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')])

    })

    if (this.userDetails.role == 'Field Officer') {
      this.employeeForm.controls.WorkOrder.clearValidators();
      this.employeeForm.controls.GrossSalary.clearValidators();
      this.employeeForm.controls.NetSalary.clearValidators();
      this.employeeForm.controls.DateOfJoining.clearValidators();
      this.employeeForm.controls.ReasonForExit.clearValidators();
      this.employeeForm.controls.WorkOrderRole.clearValidators();
      this.employeeForm.controls.FetchFixation.clearValidators();
      // this.employeeForm.controls.WorkOrderUnitBranch.clearValidators();
      this.employeeForm.controls.DateOfExit.clearValidators();

      this.employeeForm.controls.UniversalAccount.clearValidators();
      this.employeeForm.controls.PFAccount.clearValidators();
      this.employeeForm.controls.SchemeCertificate.clearValidators();
      this.employeeForm.controls.PPONumber.clearValidators();
      this.employeeForm.controls.NonContributoryPeriod.clearValidators();
      this.employeeForm.controls.ESI.clearValidators();

      this.employeeForm.controls.benefitType.clearValidators();
      this.employeeForm.controls.BasicVDA.clearValidators();
      this.employeeForm.controls.Gratuity.clearValidators();
      this.employeeForm.controls.MedicalAllowance.clearValidators();
      this.employeeForm.controls.RelieverCharges.clearValidators();
      this.employeeForm.controls.Bonus.clearValidators();
      this.employeeForm.controls.HRA.clearValidators();
      this.employeeForm.controls.NationalFestivalHolidays.clearValidators();
      this.employeeForm.controls.Conveyance.clearValidators();
      this.employeeForm.controls.LeaveWithWages.clearValidators();
      this.employeeForm.controls.WashingAllowance.clearValidators();
      this.employeeForm.controls.SpecialAllowance.clearValidators();

      this.employeeForm.controls.deductionType.clearValidators();
      this.employeeForm.controls.PFAmount.clearValidators();
      this.employeeForm.controls.ESIAmount.clearValidators();
      this.employeeForm.controls.ProfessionalTax.clearValidators();

    }

    this.familyForm = new FormGroup({
      'Relationship': new FormControl('', [Validators.required]),
      'Name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'DateOfBirth': new FormControl(null),
      'ContactNo': new FormControl(null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(10)]),
      'AadharNo': new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(12)])
    })

    this.educationalQualificationForm = new FormGroup({
      'Course': new FormControl('', [Validators.required]),
      'SchoolCollegeName': new FormControl(null, [Validators.pattern('^[a-zA-Z ]*$')]),
      'From': new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),
      'To': new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),

      'Marks': new FormControl(null, [Validators.pattern('((^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$))|(^[A-D]+[+-]?|[F]{1})')])
    })

    this.workExperienceForm = new FormGroup({
     'Designation': new FormControl(null, [Validators.required]),
      'CompanyName': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'From': new FormControl(null, [Validators.required]),
      // 'From': new FormControl('', [Validators.required]),
      // 'To': new FormControl('', [Validators.required]),
      'To': new FormControl(null, [Validators.required]),
      'ExperienceYear': new FormControl(null),
      'SalaryDrawn': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'ReasonForLeaving': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      'SupervisorName': new FormControl(null, [Validators.pattern('^[a-zA-Z ]*$')]),
      'SupervisorMobile': new FormControl(null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(10)]),
      'SupervisorEmail': new FormControl(null, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      'WorkExperienceLetter': new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
    })

    this.referencesForm = new FormGroup({
      'Name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'Occupation': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'Address': new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      'ContactNo': new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(10)]),
      'AadharNo': new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(12)])
    })

    if (this.url && this.url != -1) {
      this.getEmployee()
    }

  }
  setNetAmount() {
    let grossAmount = +(this.employeeForm.value.GrossSalary ? this.employeeForm.value.GrossSalary : 0);
    let ddcAmount = +(this.employeeForm.value.DeductedSalary ? this.employeeForm.value.DeductedSalary : 0);

    let NetTotal = grossAmount - ddcAmount;
    let resNetTotal = Math.round(NetTotal);
    this.employeeForm.controls['NetSalary'].patchValue(resNetTotal.toFixed(2));
  }

  findGrossTotal() {
    var arr: any = document.getElementsByName('sal-gross-input');
    var tot = 0;
    for (var i = 0; i < arr.length; i++) {
      debugger
      if (parseInt(arr[i].value))
        tot += +(arr[i].value);
    }
    let retot = Math.round(tot);
    this.employeeForm.controls['GrossSalary'].patchValue(retot.toFixed(2));
    this.setNetAmount();
  }

  findDeductionTotal() {
    var arr: any = document.getElementsByName('sal-deduct-input');
    var tot = 0;
    for (var i = 0; i < arr.length; i++) {
      debugger
      if (parseInt(arr[i].value))
        tot += +(arr[i].value);
    }
    let retot = Math.round(tot);
    this.employeeForm.controls['DeductedSalary'].patchValue(retot.toFixed(2));
    this.setNetAmount();
  }

  calculateAmount() {
    if (this.selectedDeductionValue.indexOf('PF Amount') !== -1) {
      this.selectedDeductionValue.push('PF Amount');
    }
    if (this.selectedDeductionValue.indexOf('ESI Amount') !== -1) {
      this.selectedDeductionValue.push('ESI Amount');
    }
    if (this.selectedDeductionValue.indexOf('Professional Tax') !== -1) {
      this.selectedDeductionValue.push('Professional Tax');
    }
    let basicVDA = this.employeeForm.controls['BasicVDA'].value;
    this.Result = ((+basicVDA) > 0 ? (+basicVDA) : 0);

    let netGrossSal = this.employeeForm.controls['GrossSalary'].value;
    this.NetGrossSal = ((+netGrossSal) > 0 ? (+netGrossSal) : 0);

    let PF = this.Result * 0.12;
    let resPF = Math.round(PF);
    this.employeeForm.controls['PFAmount'].patchValue(resPF.toFixed(2));

    var basicVDAsal = 0;

    if (this.selectedESIBased === 'BASICVDA') {
      let ESI = this.Result * 0.0075;
      let resESI = Math.round(ESI);
      if (basicVDA <= 21000) {
        this.employeeForm.controls['ESIAmount'].patchValue(resESI.toFixed(2));
      }
      else {
        this.employeeForm.controls['ESIAmount'].patchValue(basicVDAsal.toFixed(2));
      }
    }
    else if (this.selectedESIBased === 'NETSAL') {
      let ESI = this.NetGrossSal * 0.0075;
      let resESI = Math.round(ESI);
      if (basicVDA <= 21000) {
        this.employeeForm.controls['ESIAmount'].patchValue(resESI.toFixed(2));
      }
      else {
        this.employeeForm.controls['ESIAmount'].patchValue(basicVDAsal.toFixed(2));
      }
    }

    var PTFixSal = 200.00;
    var PTFixSal1 = 0.00;

    let PT = this.Result >= 25000;
    if (PT) {
      this.employeeForm.controls['ProfessionalTax'].patchValue(PTFixSal.toFixed(2));
    }
    else {
      this.employeeForm.controls['ProfessionalTax'].patchValue(PTFixSal1.toFixed(2));
    }
    this.findDeductionTotal();
  }

  changeOf(event) {
    if (event.source.selected) {
      console.log('selectedValue', this.selectedValue)
      console.log('selectedDeductionValue', this.selectedDeductionValue)
    }
  }

  get GetLanguages() {
    return this.employeeForm.get('Langauges') as FormArray;
  }

  BindLanguage() {
    this.languageArr = [];
    Object.keys(this.GetLanguages.controls).forEach(field => {
      const control = this.GetLanguages.controls[field];
      if (control.value.Language != '') {
        var _path = {
          "Language": control.value.Language,
          "Speak": control.value.Speak,
          "Read": control.value.Read,
          "Write": control.value.Write,
        }
        this.languageArr.push(_path);
      }
    });
  }

  addLanguage() {
    var languageData = this.GetLanguages.controls[this.GetLanguages.controls.length - 1] as any;
    if (languageData) {
      this.languageList.push(languageData.controls.Language.value);
    }

    this.GetLanguages.push(this.fb.group({
      Language: ['', [Validators.required]],
      Speak: [false],
      Write: [false],
      Read: [false]
    }));

    var _self = this
    this.Language = this.Language.map(function (x) {
      if (_self.languageList.includes(x._id)) {
        x.display = false;
      } else {
        x.display = true;
      }
      return x;
    })

    var disableClass = $('.rowAppend').find('select')
    disableClass.prop('disabled', true)

    this.BindLanguage()
  }

  deleteLanguage(languageID: string) {
    if (languageID) {
      this.languageList = this.languageList.filter(x => {
        return x != languageID
      })
    }

    Object.keys(this.GetLanguages.controls).forEach(field => {
      const control = this.GetLanguages.controls[field];
      if (control != undefined && control.value.Language == languageID) {
        this.GetLanguages.removeAt(Number(field))
      }
    })

    var _self = this;
    this.Language = this.Language.map(function (x) {
      if (_self.languageList.includes(x._id)) {
        x.display = false;
      } else {
        x.display = true;
      }
      return x;
    })

    if (this.GetLanguages.controls.length == 0) {
      this.GetLanguages.push(this.fb.group({
        Language: ['', [Validators.required]],
        Speak: [false],
        Write: [false],
        Read: [false]
      }));
    }

    this.BindLanguage()
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
    const formData = new FormData();
    if (this.url && this.url != -1)
      formData.append("id", this.url);

    var formobj = this.employeeForm.value;

    if (formobj.DateOfExit != '' && formobj.ReasonForExit == '') {
      this.toastr.error("Reason For Exit Is Required!")
      return;
    }

    if (this.empData && this.empData.Status == 'Hired' && formobj.WorkOrder != this.empData.WorkOrder && formobj.DateOfJoining == this.empData.DateOfJoining) {
      this.toastr.error("Please Update the Joining Date!")
      return;
    }

    if (this.employeeForm.value.GrossSalary > this.WOSalary) {
      this.toastr.error("Gross Salary shouldn't be greater than WorkOrder Salary!")
      return;
    }

    formData.append('FullName', formobj.FullName)
    formData.append('ParentName', formobj.ParentName)
    formData.append('SpouseName', formobj.SpouseName)
    formData.append('EmailId', formobj.EmailId)
    formData.append('DateOfBirth', formobj.DateOfBirth)
    formData.append('Age', formobj.Age)
    formData.append('PlaceOfBirth', formobj.PlaceOfBirth)
    formData.append('MotherTongue', formobj.MotherTongue)
    formData.append('Gender', formobj.Gender)
    formData.append('MaritalStatus', formobj.MaritalStatus)
    formData.append('Religion', formobj.Religion)

    if (formobj.BloodGroup)
      formData.append('BloodGroup', formobj.BloodGroup)

    if (this.url && this.url != -1 && this.empData.UniqueEmpId != '') {
      if (formobj.AadharNo) {
        if (this.empData.AadharNo == formobj.AadharNo) {
          formData.append('AadharNo', formobj.AadharNo)
        }
        else if (this.empData.AadharNo != formobj.AadharNo) {
          const aadhaars = this.employeeDataList.find(e => e.AadharNo == formobj.AadharNo);
          if (aadhaars) {
            this.toastr.error("Aadhaar already exists!");
            return;
          } else {
            formData.append('AadharNo', formobj.AadharNo)
          }
        }
      }

      if (formobj.PAN) {
        if (this.empData.PAN == formobj.PAN) {
          formData.append('PAN', formobj.PAN)
        }
        else if (this.empData.PAN != formobj.PAN) {
          const PAN = this.employeeDataList.find(e => e.PAN == formobj.PAN);
          if (PAN) {
            this.toastr.error("PAN already exists!");
            return;
          } else {
            formData.append('PAN', formobj.PAN)
          }
        }
      }
    }
    else if (this.employeeDataList.UniqueEmpId == '') {
      const aadhaars = this.employeeDataList.find(e => e.AadharNo == formobj.AadharNo);
      if (aadhaars) {
        this.toastr.error("Aadhaar already exists!");
        return;
      } else {
        formData.append('AadharNo', formobj.AadharNo)
      }

      if (formobj.PAN) {
        const PAN = this.employeeDataList.find(e => e.PAN == formobj.PAN);
        if (PAN) {
          this.toastr.error("PAN already exists!");
          return;
        } else {
          formData.append('PAN', formobj.PAN)
        }
      }
    }
    else {
      const aadhaars = this.employeeDataList.find(e => e.AadharNo == formobj.AadharNo);
      if (aadhaars) {
        this.toastr.error("Aadhaar already exists!");
        return;
      } else {
        formData.append('AadharNo', formobj.AadharNo)
      }

      if (formobj.PAN) {
        const PAN = this.employeeDataList.find(e => e.PAN == formobj.PAN);
        if (PAN) {
          this.toastr.error("PAN already exists!");
          return;
        } else {
          formData.append('PAN', formobj.PAN)
        }
      }
    }

    formData.append('PresentAddress', formobj.PresentAddress)
    formData.append('PresentAddressPincode', formobj.PresentAddressPincode)
    formData.append('PresentAddressPhone', formobj.PresentAddressPhone)
    formData.append('PermanentAddress', formobj.PermanentAddress)
    formData.append('PermanentAddressPincode', formobj.PermanentAddressPincode)
    formData.append('PermanentAddressPhone', formobj.PermanentAddressPhone)

    formData.append('Identification1', formobj.Identification1)
    formData.append('Identification2', formobj.Identification2)
    formData.append('Mark1', formobj.Mark1)
    formData.append('Mark2', formobj.Mark2)

    formData.append('CandidatePhoto', formobj.CandidatePhoto)
    formData.append('AadharDocument', formobj.AadharDocument)

    if (formobj.ResumeDocument)
      formData.append('ResumeDocument', formobj.ResumeDocument)
    if (formobj.PANDocument)
      formData.append('PANDocument', formobj.PANDocument)
    if (formobj.QualificationDocument)
      formData.append('QualificationDocument', formobj.QualificationDocument)
    if (formobj.IDProofDocument)
      formData.append('IDProofDocument', formobj.IDProofDocument)
    formData.append('PassbookDocument', formobj.PassbookDocument)
    if (formobj.WorkOrder)
      formData.append('WorkOrder', formobj.WorkOrder)

    formData.append('WorkExperienceType', this.currentlyChecked)

    if (formobj.WorkOrderRole)
      formData.append('WorkOrderRole', formobj.WorkOrderRole)
    // if (formobj.WorkOrderUnitBranch)
    //   formData.append('WorkOrderUnitBranch', formobj.WorkOrderUnitBranch)
    if (formobj.DateOfJoining)
      formData.append('DateOfJoining', this.datePipe.transform(formobj.DateOfJoining, 'dd-MMM-yyyy 09:00:00'))
    if (formobj.DateOfExit)
      formData.append('DateOfExit', this.datePipe.transform(formobj.DateOfExit, 'dd-MMM-yyyy 18:00:00'))
    if (formobj.ReasonForExit)
      formData.append('ReasonForExit', formobj.ReasonForExit)
    if (formobj.FetchFixation)
      formData.append('FetchFixation', formobj.FetchFixation)

    formData.append('GrossSalary', ((formobj.GrossSalary > 0) ? formobj.GrossSalary : 0))

    formData.append('NetSalary', ((formobj.NetSalary > 0) ? formobj.NetSalary : 0))

    if (formobj.DeductedSalary)
      formData.append('DeductedSalary', formobj.DeductedSalary)
    if (formobj.AssessmentDocument)
      formData.append('AssessmentDocument', formobj.AssessmentDocument)

    if (formobj.benefitType)
      // formData.append('benefitType', formobj.benefitType)
      formData.append('benefitType', JSON.stringify(this.selectedValue))
    if (formobj.BasicVDA)
      formData.append('BasicVDA', formobj.BasicVDA)
    if (formobj.Gratuity)
      formData.append('Gratuity', formobj.Gratuity)
    if (formobj.MedicalAllowance)
      formData.append('MedicalAllowance', formobj.MedicalAllowance)
    if (formobj.RelieverCharges)
      formData.append('RelieverCharges', formobj.RelieverCharges)
    if (formobj.Bonus)
      formData.append('Bonus', formobj.Bonus)
    if (formobj.HRA)
      formData.append('HRA', formobj.HRA)
    if (formobj.NationalFestivalHolidays)
      formData.append('NationalFestivalHolidays', formobj.NationalFestivalHolidays)
    if (formobj.Conveyance)
      formData.append('Conveyance', formobj.Conveyance)
    if (formobj.LeaveWithWages)
      formData.append('LeaveWithWages', formobj.LeaveWithWages)
    if (formobj.WashingAllowance)
      formData.append('WashingAllowance', formobj.WashingAllowance)
    if (formobj.SpecialAllowance)
      formData.append('SpecialAllowance', formobj.SpecialAllowance)

    if (formobj.deductionType)
      // formData.append('deductionType', formobj.deductionType)
      formData.append('deductionType', JSON.stringify(this.selectedDeductionValue))
    if (formobj.PFAmount)
      formData.append('PFAmount', formobj.PFAmount)
    if (formobj.ESIAmount)
      formData.append('ESIAmount', formobj.ESIAmount)
    if (formobj.ProfessionalTax)
      formData.append('ProfessionalTax', formobj.ProfessionalTax)
    if (this.selectedESIBased)
      formData.append('ESIBasedOn', this.selectedESIBased)

    if (formobj.PFAccount)
      formData.append('PFAccount', formobj.PFAccount)
    if (formobj.SchemeCertificate)
      formData.append('SchemeCertificate', formobj.SchemeCertificate)
    if (formobj.PPONumber)
      formData.append('PPONumber', formobj.PPONumber)
    if (formobj.NonContributoryPeriod)
      formData.append('NonContributoryPeriod', formobj.NonContributoryPeriod)

    if (this.url && this.url != -1 && this.empData.UniqueEmpId != '') {
      if (formobj.UniversalAccount) {
        if (this.empData.UniversalAccount == formobj.UniversalAccount) {
          formData.append('UniversalAccount', formobj.UniversalAccount)
        }
        else if (this.empData.UniversalAccount != formobj.UniversalAccount) {
          const UAN = this.employeeDataList.find(e => e.UniversalAccount == formobj.UniversalAccount);
          if (UAN) {
            this.toastr.error("UAN already exists!");
            return;
          } else {
            formData.append('UniversalAccount', formobj.UniversalAccount)
          }
        }
      }

      if (formobj.ESI) {
        if (this.empData.ESI == formobj.ESI) {
          formData.append('ESI', formobj.ESI)
        }
        else if (this.empData.ESI != formobj.ESI) {
          const ESI = this.employeeDataList.find(e => e.ESI == formobj.ESI);
          if (ESI) {
            this.toastr.error("ESI already exists!");
            return;
          } else {
            formData.append('ESI', formobj.ESI)
          }
        }
      }

      if (formobj.AccountNumber) {
        if (this.empData.AccountNumber == formobj.AccountNumber) {
          formData.append('AccountNumber', formobj.AccountNumber)
        }
        else if (this.empData.AccountNumber != formobj.AccountNumber) {
          const ACCNO = this.employeeDataList.find(e => e.AccountNumber == formobj.AccountNumber);
          if (ACCNO) {
            this.toastr.error("Account Number already exists!");
            return;
          } else {
            formData.append('AccountNumber', formobj.AccountNumber)
          }
        }
      }
    }
    else if (this.employeeDataList.UniqueEmpId == '') {
      if (formobj.UniversalAccount) {
        const UAN = this.employeeDataList.find(e => e.UniversalAccount == formobj.UniversalAccount);
        if (UAN) {
          this.toastr.error("UAN already exists!");
          return;
        } else {
          formData.append('UniversalAccount', formobj.UniversalAccount)
        }
      }

      if (formobj.ESI) {
        const ESI = this.employeeDataList.find(e => e.ESI == formobj.ESI);
        if (ESI) {
          this.toastr.error("ESI already exists!");
          return;
        } else {
          formData.append('ESI', formobj.ESI)
        }
      }

      if (formobj.AccountNumber) {
        const ACCNO = this.employeeDataList.find(e => e.AccountNumber == formobj.AccountNumber);
        if (ACCNO) {
          this.toastr.error("Account Number already exists!");
          return;
        } else {
          formData.append('AccountNumber', formobj.AccountNumber)
        }
      }
    }
    else {
      if (formobj.UniversalAccount) {
        const UAN = this.employeeDataList.find(e => e.UniversalAccount == formobj.UniversalAccount);
        if (UAN) {
          this.toastr.error("UAN already exists!");
          return;
        } else {
          formData.append('UniversalAccount', formobj.UniversalAccount)
        }
      }

      if (formobj.ESI) {
        const ESI = this.employeeDataList.find(e => e.ESI == formobj.ESI);
        if (ESI) {
          this.toastr.error("ESI already exists!");
          return;
        } else {
          formData.append('ESI', formobj.ESI)
        }
      }

      if (formobj.AccountNumber) {
        const ACCNO = this.employeeDataList.find(e => e.AccountNumber == formobj.AccountNumber);
        if (ACCNO) {
          this.toastr.error("Account Number already exists!");
          return;
        } else {
          formData.append('AccountNumber', formobj.AccountNumber)
        }
      }
    }


    if (formobj.BankName)
      formData.append('BankName', formobj.BankName)
    if (formobj.Branch)
      formData.append('Branch', formobj.Branch)
    if (formobj.IFSC)
      formData.append('IFSC', formobj.IFSC)

    if (this.languageArr != undefined && this.languageArr.length != 0)
      formData.append('LanguagesKnown', JSON.stringify(this.languageArr))

    var sendFamily = this.familyTest.map(obj => ({ ...obj }));
    var sendEducation = this.eduTest.map(obj => ({ ...obj }));
    var sendWork = this.workTest.map(obj => ({ ...obj }));
    var sendReference = this.referenceTest.map(obj => ({ ...obj }));

    sendFamily.forEach((obj: any) => {
      if (obj.isEdit == true) {
        delete obj.isEdit
        delete obj._id
      }
    })

    sendEducation.forEach((obj: any) => {
      if (obj.isEdit == true) {
        delete obj.isEdit
        delete obj._id
      }
    })

    sendWork.forEach((obj: any) => {
      if (obj.isEdit == true) {
        delete obj.isEdit
        delete obj._id
      }
    })

    sendReference.forEach((obj: any) => {
      if (obj.isEdit == true) {
        delete obj.isEdit
        delete obj._id
      }
    })

    // Extract WorkExperienceLetter files and append to formData
    sendWork.forEach((obj: any, index: number) => {
      if (obj.WorkExperienceLetter && obj.WorkExperienceLetter instanceof File) {
        formData.append(`WorkExperienceLetter_${index}`, obj.WorkExperienceLetter)
        delete obj.WorkExperienceLetter
      }
    })

    formData.append('FamilyDetail', JSON.stringify(sendFamily))
    formData.append('EducationalQualification', JSON.stringify(sendEducation))
    formData.append('WorkExperience', JSON.stringify(sendWork))
    formData.append('References', JSON.stringify(sendReference))

    this.showLoaderService.start();
    this.addEmployeeService.addEditEmployee(formData)
      .subscribe(
        res => {
          this.showLoaderService.stop();
          if (res["success"] && this.userDetails.role == 'Field Officer') {
            this.toastr.success(res['message'])
            this.router.navigate(['/thankyou'])
          }
          else if (res["success"]) {
            this.toastr.success(res['message'])
            this.router.navigate(['/allcandidate/overview'])
          }
        },
        error => {
          this.showLoaderService.stop();
          this.toastr.error(error.error.message);
        }
      )
  }

  getEmployee() {
    this.showLoaderService.start()
    this.addEmployeeService.getEmployeeById({ id: this.url })
      .subscribe(
        res => {
          if (res['success'] == true) {
            const data = res['data']

            this.empData = res['data']

            this.employeeForm.controls.FullName.setValue(data.FullName)
            this.employeeForm.controls.ParentName.setValue(data.ParentName)
            this.employeeForm.controls.SpouseName.setValue(data.SpouseName)
            this.employeeForm.controls.EmailId.setValue(data.EmailId)

            var dob = data.DateOfBirth ? data.DateOfBirth.split('T')[0] : ""
            this.employeeForm.controls.DateOfBirth.setValue(dob)

            this.employeeForm.controls.Age.setValue(data.Age)
            this.employeeForm.controls.AadharNo.setValue(data.AadharNo)
            this.employeeForm.controls.PAN.setValue(data.PAN)
            this.employeeForm.controls.PlaceOfBirth.setValue(data.PlaceOfBirth)
            this.employeeForm.controls.MotherTongue.setValue(data.MotherTongue)
            this.employeeForm.controls.Gender.setValue(data.Gender._id)
            this.employeeForm.controls.MaritalStatus.setValue(data.MaritalStatus._id)
            this.employeeForm.controls.Religion.setValue(data.Religion._id)
            if (data.BloodGroup)
              this.employeeForm.controls.BloodGroup.setValue(data.BloodGroup._id)

            this.employeeForm.controls.PresentAddress.setValue(data.PresentAddress)
            this.employeeForm.controls.PresentAddressPincode.setValue(data.PresentAddressPincode)
            this.employeeForm.controls.PresentAddressPhone.setValue(data.PresentAddressPhone)
            this.employeeForm.controls.PermanentAddress.setValue(data.PermanentAddress)
            this.employeeForm.controls.PermanentAddressPincode.setValue(data.PermanentAddressPincode)
            this.employeeForm.controls.PermanentAddressPhone.setValue(data.PermanentAddressPhone)

            this.employeeForm.controls.Identification1.setValue(data.Identification1)
            this.employeeForm.controls.Identification2.setValue(data.Identification2)
            this.employeeForm.controls.Mark1.setValue(data.Mark1)
            this.employeeForm.controls.Mark2.setValue(data.Mark2)

            this.employeeForm.controls.AadharNo.setValue(data.AadharNo)
            this.employeeForm.controls.PAN.setValue(data.PAN)


            this.currentlyChecked = data.WorkExperienceType ? data.WorkExperienceType : 'EXPERIENCED';

            if (data.WorkOrder) {
              this.employeeForm.controls.WorkOrder.setValue(data.WorkOrder._id);
            }
            if (data.WorkOrderRole) {
              this.employeeForm.controls.WorkOrderRole.setValue(data.WorkOrderRole._id);
            }
            // if (data.WorkOrderUnitBranch) {
            //   this.employeeForm.controls.WorkOrderUnitBranch.setValue(data.WorkOrderUnitBranch);
            // }

            var DOJ = data.DateOfJoining ? data.DateOfJoining.split('T')[0] : ""
            this.employeeForm.controls.DateOfJoining.setValue(DOJ)

            var DOE = data.DateOfExit ? data.DateOfExit.split('T')[0] : ""
            this.employeeForm.controls.DateOfExit.setValue(DOE)

            if (data.ReasonForExit) {
              this.employeeForm.controls.ReasonForExit.setValue(data.ReasonForExit);
            }
            if (data.FetchFixation) {
              this.employeeForm.controls.FetchFixation.setValue(data.FetchFixation);
            }
            if (data.GrossSalary) {
              this.employeeForm.controls.GrossSalary.setValue(data.GrossSalary)
            }
            if (data.NetSalary) {
              this.employeeForm.controls.NetSalary.setValue(data.NetSalary)
            }
            if (data.DeductedSalary) {
              this.employeeForm.controls.DeductedSalary.setValue(data.DeductedSalary)
            }


            if (data.benefitType) {
              // this.employeeForm.controls.benefitType.setValue(data.benefitType);
              this.selectedValue = JSON.parse(data.benefitType)
            }
            if (data.BasicVDA) {
              this.employeeForm.controls.BasicVDA.setValue(data.BasicVDA);
            }
            if (data.Gratuity) {
              this.employeeForm.controls.Gratuity.setValue(data.Gratuity);
            }
            if (data.MedicalAllowance) {
              this.employeeForm.controls.MedicalAllowance.setValue(data.MedicalAllowance);
            }
            if (data.RelieverCharges) {
              this.employeeForm.controls.RelieverCharges.setValue(data.RelieverCharges);
            }
            if (data.Bonus) {
              this.employeeForm.controls.Bonus.setValue(data.Bonus);
            }
            if (data.HRA) {
              this.employeeForm.controls.HRA.setValue(data.HRA);
            }
            if (data.NationalFestivalHolidays) {
              this.employeeForm.controls.NationalFestivalHolidays.setValue(data.NationalFestivalHolidays);
            }
            if (data.Conveyance) {
              this.employeeForm.controls.Conveyance.setValue(data.Conveyance);
            }
            if (data.LeaveWithWages) {
              this.employeeForm.controls.LeaveWithWages.setValue(data.LeaveWithWages);
            }
            if (data.WashingAllowance) {
              this.employeeForm.controls.WashingAllowance.setValue(data.WashingAllowance);
            }
            if (data.SpecialAllowance) {
              this.employeeForm.controls.SpecialAllowance.setValue(data.SpecialAllowance);
            }

            if (data.deductionType) {
              // this.employeeForm.controls.deductionType.setValue(data.deductionType);
              this.selectedDeductionValue = JSON.parse(data.deductionType)
            }
            if (data.PFAmount) {
              this.employeeForm.controls.PFAmount.setValue(data.PFAmount);
            }
            if (data.ESIAmount) {
              this.employeeForm.controls.ESIAmount.setValue(data.ESIAmount);
            }
            if (data.ProfessionalTax) {
              this.employeeForm.controls.ProfessionalTax.setValue(data.ProfessionalTax);
            }
            if (data.WorkExperienceType) {
              this.currentlyChecked = (data.WorkExperienceType);
            }
            if (data.ESIBasedOn) {
              this.selectedESIBased = (data.ESIBasedOn);
            }
            if (data.AddrSameasCurr) {
              this.selectedAddress = (data.AddrSameasCurr);
            }

            this.employeeForm.controls.UniversalAccount.setValue(data.UniversalAccount)
            this.employeeForm.controls.PFAccount.setValue(data.PFAccount)
            this.employeeForm.controls.SchemeCertificate.setValue(data.SchemeCertificate)
            this.employeeForm.controls.PPONumber.setValue(data.PPONumber)
            this.employeeForm.controls.NonContributoryPeriod.setValue(data.NonContributoryPeriod)
            this.employeeForm.controls.ESI.setValue(data.ESI)

            this.employeeForm.controls.BankName.setValue(data.BankName)
            this.employeeForm.controls.Branch.setValue(data.Branch)
            this.employeeForm.controls.AccountNumber.setValue(data.AccountNumber)
            this.employeeForm.controls.IFSC.setValue(data.IFSC)

            if (data.CandidatePhoto) {
              var CandidatePhotosp = data.CandidatePhoto.split('-');
              this.getBlobFromUrl(this.DocUrl + data.CandidatePhoto, CandidatePhotosp[CandidatePhotosp.length - 1], "CandidatePhoto");
            }
            if (data.AadharDocument) {
              var AadharDocumentsp = data.AadharDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.AadharDocument, AadharDocumentsp[AadharDocumentsp.length - 1], "AadharDocument");
            }
            if (data.ResumeDocument) {
              var ResumeDocumentsp = data.ResumeDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.ResumeDocument, ResumeDocumentsp[ResumeDocumentsp.length - 1], "ResumeDocument");
            }

            if (data.PANDocument) {
              var PANDocumentsp = data.PANDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.PANDocument, PANDocumentsp[PANDocumentsp.length - 1], "PANDocument");
            }

            if (data.QualificationDocument) {
              var QualificationDocumentsp = data.QualificationDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.QualificationDocument, QualificationDocumentsp[QualificationDocumentsp.length - 1], "QualificationDocument");
            }

            if (data.IDProofDocument) {
              var IDProofDocumentsp = data.IDProofDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.IDProofDocument, IDProofDocumentsp[IDProofDocumentsp.length - 1], "IDProofDocument");
            }

            if (data.PassbookDocument) {
              var PassbookDocumentsp = data.PassbookDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.PassbookDocument, PassbookDocumentsp[PassbookDocumentsp.length - 1], "PassbookDocument");
            }

            if (this.employeeForm.controls.AssessmentDocument.value) {
              var AssessmentDocumentsp = data.AssessmentDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data.AssessmentDocument, AssessmentDocumentsp[AssessmentDocumentsp.length - 1], "AssessmentDocument");
            }

            this.familyTest = data.FamilyDetail
            this.familySource = new MatTableDataSource(this.displayFamilyTable(data.FamilyDetail))

            this.eduTest = data.EducationalQualification
            this.educationalSource = new MatTableDataSource(this.displayEducationalTable(data.EducationalQualification))

            this.workTest = data.WorkExperience
            this.workExperienceSource = new MatTableDataSource(this.displayExperienceTable(data.WorkExperience))

            this.referenceTest = data.References
            this.referencesSource = new MatTableDataSource(this.displayReferenceTable(data.References))

            if (data.LanguagesKnown != null) {
              for (let index = 0; index < data.LanguagesKnown.length; index++) {
                const element = data.LanguagesKnown[index];
                this.populateLanguage(element, index)
              }
            }

            this.BindLanguage()
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  populateLanguage(val, i) {
    this.GetLanguages.push(this.fb.group({
      Language: [val.Language._id, [Validators.required]],
      Speak: [val.Speak],
      Write: [val.Read],
      Read: [val.Write]
    }));
    if (i == 0)
      this.GetLanguages.removeAt(0);
  }

  getBlobFromUrl(myImageUrl: any, filename: any, doc: any) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('GET', myImageUrl, true);
      request.responseType = 'blob';
      request.onload = () => {
        let reader = new FileReader();
        reader.onload = () => {
          var finalfile = this.dataURLtoFile(reader.result, filename);
          if (doc == 'CandidatePhoto') {
            this.employeeForm.controls.CandidatePhoto.setValue(finalfile)
            var element = document.getElementById("CandidatePhotoName") as any;
            element.innerHTML = filename;
            this.CandidatePhotourl = myImageUrl;
          }
          if (doc == 'AadharDocument') {
            this.employeeForm.controls.AadharDocument.setValue(finalfile)
            var element = document.getElementById("AadharDocumentName") as any;
            element.innerHTML = filename;
            this.AadharDocumenturl = myImageUrl;
          }
          if (doc == 'ResumeDocument') {
            this.employeeForm.controls.ResumeDocument.setValue(finalfile)
            var element = document.getElementById("ResumeDocumentName") as any;
            element.innerHTML = filename;
            this.ResumeDocumenturl = myImageUrl;
          }
          if (doc == 'PANDocument') {
            this.employeeForm.controls.PANDocument.setValue(finalfile)
            var element = document.getElementById("PANDocumentName") as any;
            element.innerHTML = filename;
            this.PANDocumenturl = myImageUrl;
          }
          if (doc == 'AssessmentDocument') {
            this.employeeForm.controls.AssessmentDocument.setValue(finalfile)
            var element = document.getElementById("AssessmentDocumentName") as any;
            element.innerHTML = filename;
            this.AssessmentDocumenturl = myImageUrl;
          }
          if (doc == 'IDProofDocument') {
            this.employeeForm.controls.IDProofDocument.setValue(finalfile)
            var element = document.getElementById("IDProofDocumentName") as any;
            element.innerHTML = filename;
            this.IDProofDocumenturl = myImageUrl;
          }
          if (doc == 'PassbookDocument') {
            this.employeeForm.controls.PassbookDocument.setValue(finalfile)
            var element = document.getElementById("PassbookDocumentName") as any;
            element.innerHTML = filename;
            this.PassbookDocumenturl = myImageUrl;
          }
          if (doc == 'QualificationDocument') {
            this.employeeForm.controls.QualificationDocument.setValue(finalfile)
            var element = document.getElementById("QualificationDocumentName") as any;
            element.innerHTML = filename;
            this.QualificationDocumenturl = myImageUrl;
          }
          resolve(reader.result);
        };
        reader.readAsDataURL(request.response);
      };
      request.send();
    })
  }

  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  onClearForm() {
    this.employeeForm.reset();
  }

  addFamilyData() {
    this.formCounter++
    this.familyTest.push({
      '_id': this.formCounter,
      'Relationship': this.familyForm.controls.Relationship.value,
      'Name': this.familyForm.controls.Name.value,
      'DateOfBirth': this.familyForm.controls.DateOfBirth.value,
      'ContactNo': this.familyForm.controls.ContactNo.value,
      'AadharNo': this.familyForm.controls.AadharNo.value,
      'isEdit': true
    })

    this.ModelClose('FamilyModel')
    this.familySource = new MatTableDataSource(this.displayFamilyTable(this.familyTest));
  }

  deleteFamilyData(id: number) {
    this.familyTest = this.familyTest.filter(function (obj: any) {
      return obj._id != id;
    });

    this.familySource = new MatTableDataSource(this.displayFamilyTable(this.familyTest));
  }

  // displayFamilyTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));

  //   displayTable.forEach((element: any) => {
  //     var relationship = element.Relationship;
  //     // if (relationship != undefined)
  //     element.Relationship = relationship && (relationship != undefined) ? relationship.name : "";
  //   });
  //   return displayTable
  // }  

  displayFamilyTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));

    displayTable.forEach((element: any) => {
      let valFind = false;
      var relationship = this.Relationship.find((obj: any) => {
        if (obj._id == element.Relationship) {
          valFind = (obj._id == element.Relationship);
        }
        return valFind;
      })
      if (!valFind) {
        relationship = element.Relationship;
      }
      element.Relationship = relationship && (relationship != undefined) ? relationship.name : ""
    });
    return displayTable
  }

  addEducationalData() {
    this.formCounter++
    this.eduTest.push({
      '_id': this.formCounter,
      'Course': this.educationalQualificationForm.controls.Course.value,
      'SchoolCollegeName': this.educationalQualificationForm.controls.SchoolCollegeName.value,
      'From': this.educationalQualificationForm.controls.From.value,
      'To': this.educationalQualificationForm.controls.To.value,
      'Marks': this.educationalQualificationForm.controls.Marks.value,
      'isEdit': true
    })

    this.ModelClose('EducationModel')
    this.educationalSource = new MatTableDataSource(this.displayEducationalTable(this.eduTest));
  }

  deleteEducationalData(id: number) {
    this.eduTest = this.eduTest.filter(function (obj: any) {
      return obj._id != id;
    });

    this.educationalSource = new MatTableDataSource(this.displayEducationalTable(this.eduTest));
  }

  // displayEducationalTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));

  //   displayTable.forEach((element: any) => {
  //     var course = element.Course;

  //     element.Course = course && (course != undefined) ? course.name : "";
  //   });
  //   return displayTable
  // }  

  displayEducationalTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));

    displayTable.forEach((element: any) => {
      let valFind = false;
      var course = this.Course.find((obj: any) => {
        if (obj._id == element.Course) {
          valFind = (obj._id == element.Course);
        }
        return valFind;
      })
      if (!valFind) {
        course = element.Course;
      }
      element.Course = course && (course != undefined) ? course.name : ""
    });
    return displayTable
  }

  addExperienceData() {
    this.formCounter++
    this.workTest.push({
      '_id': this.formCounter,
      'Designation': this.workExperienceForm.controls.Designation.value,
      'CompanyName': this.workExperienceForm.controls.CompanyName.value,
      'From': this.workExperienceForm.controls.From.value,
      'To': this.workExperienceForm.controls.To.value,
      'ExperienceYear': this.workExperienceForm.controls.ExperienceYear.value,
      'SalaryDrawn': this.workExperienceForm.controls.SalaryDrawn.value,
      'ReasonForLeaving': this.workExperienceForm.controls.ReasonForLeaving.value,
      'SupervisorName': this.workExperienceForm.controls.SupervisorName.value,
      'SupervisorMobile': this.workExperienceForm.controls.SupervisorMobile.value,
      'SupervisorEmail': this.workExperienceForm.controls.SupervisorEmail.value,
      'WorkExperienceLetter': this.workExperienceForm.controls.WorkExperienceLetter.value,
      'isEdit': true
    })
    this.ModelClose('ExperienceModel')
    this.workExperienceSource = new MatTableDataSource(this.displayExperienceTable(this.workTest));
  }

  deleteExperienceData(id: number) {
    this.workTest = this.workTest.filter(function (obj: any) {
      return obj._id != id;
    });

    this.workExperienceSource = new MatTableDataSource(this.displayExperienceTable(this.workTest));
  }

  // displayExperienceTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));

  //   displayTable.forEach((element: any) => {
  //     var designation = this.Designation.find((obj: any) => {
  //       if (obj._id == element.Designation)
  //         return obj._id == element.Designation
  //     })
  //     if (designation != undefined)
  //       element.Designation = designation.name
  //   });
  //   return displayTable
  // }

  // displayExperienceTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));
  //   displayTable.forEach((element: any) => {
  //     var designation = element.Designation;
  //     element.Designation = designation && (designation != undefined) ? designation.name : ""
  //   });
  //   return displayTable
  // }

  // displayExperienceTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));

  //   displayTable.forEach((element: any) => {
  //     let valFind = false;
  //     var designation = this.Designation.find((obj: any) => {
  //       if (obj._id == element.Designation) {
  //         valFind = (obj._id == element.Designation);
  //       }
  //       return valFind;
  //     })
  //     if (!valFind) {
  //       designation = element.Designation;
  //     } else {
  //       element.Designation = designation && (designation != undefined) ? designation.name : ""
  //     }
  //   });
  //   return displayTable
  // }

  displayExperienceTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));

    // displayTable.forEach((element: any) => {
    //   let valFind = false;
    //   var designation = this.Designation.find((obj: any) => {
    //     if (obj._id == element.Designation) {
    //       valFind = (obj._id == element.Designation);
    //     }
    //     return valFind;
    //   })
    //   if (!valFind) {
    //     designation = element.Designation;
    //   }
    //   element.Designation = designation && (designation != undefined) ? designation.name : ""
    // });
    return displayTable
  }

  addReferenceData() {
    this.formCounter++
    this.referenceTest.push({
      '_id': this.formCounter,
      'Name': this.referencesForm.controls.Name.value,
      'Occupation': this.referencesForm.controls.Occupation.value,
      'Address': this.referencesForm.controls.Address.value,
      'ContactNo': this.referencesForm.controls.ContactNo.value,
      // 'AadharNo': "NA",//this.referencesForm.controls.AadharNo.value,
      'AadharNo': this.referencesForm.controls.AadharNo.value,
      'isEdit': true
    })
    this.ModelClose('ReferenceModel')
    this.referencesSource = new MatTableDataSource(this.displayReferenceTable(this.referenceTest));
  }

  deleteReferenceData(id: number) {
    this.referenceTest = this.referenceTest.filter(function (obj: any) {
      return obj._id != id;
    });
    this.referencesSource = new MatTableDataSource(this.displayReferenceTable(this.referenceTest));
  }

  displayReferenceTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));

    // displayTable.forEach((element: any) => {
    //   var occupation = this.Occupation.find((obj: any) => {
    //     if (obj._id == element.Occupation)
    //       return obj._id == element.Occupation
    //   })
    //   if (occupation != undefined)
    //     element.Occupation = occupation.name
    // });
    return displayTable
  }

  // displayReferenceTable(data: any) {
  //   var displayTable: any = data.map(a => ({ ...a }));

  //   displayTable.forEach((element: any) => {
  //     let valFind = false;
  //     var occupation = this.Occupation.find((obj: any) => {
  //       if (obj._id == element.Occupation) {
  //         valFind = (obj._id == element.Occupation);
  //       }
  //       return valFind;
  //     })
  //     if (valFind && occupation != undefined) {
  //       element.Occupation = occupation.name
  //     } else {
  //       element.Occupation = occupation && (occupation != undefined) ? occupation.name : ""
  //     }
  //   });
  //   return displayTable
  // }

  getGender() {
    this.addEmployeeService.getGender()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Gender = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getMaritalStatus() {
    this.addEmployeeService.getMaritalStatus()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.MaritalStatus = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getReligion() {
    this.addEmployeeService.getReligion()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Religion = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getBloodGroup() {
    this.addEmployeeService.getBloodGroup()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.BloodGroup = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getWorkorder() {
    this.showLoaderService.start()
    this.addEmployeeService.getWorkorder()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            var data = res['data'].sort((a, b) => a.client.name - b.client.name)
            this.Workorder = data;
            console.log(data);
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getCourse() {
    this.addEmployeeService.getCourse()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Course = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getDesignation() {
    this.addEmployeeService.getDesignation()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Designation = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getLanguage() {
    this.addEmployeeService.getLanguage()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Language = res['data'].map((obj: any) => ({ ...obj, display: true }))
          }
        },
        error => {
          console.error(error)
        }
      )
  }

  getOccupation() {
    this.addEmployeeService.getOccupation()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Occupation = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getRelationship() {
    this.addEmployeeService.getRelationship()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Relationship = res['data']
          }

        },
        error => {
          console.error(error)
        }
      )
  }

  getYear() {
    this.addEmployeeService.getYear()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.Year = res['data']
          }
        },
        error => {
          console.error(error)
        }
      )
  }

  filterWorkOrderRole(id: any) {
    this.employeeForm.controls.WorkOrderRole.setValue('')
    this.Workorder.find((obj: any) => {
      if (obj._id == id)
        return this.WorkOrderRole = obj.workOrderRoles;
    })
  }

  // filterWorkOrderRole(id: any) {
  //   this.employeeForm.controls.WorkOrderRole.setValue('')
  //   this.Workorder.find((obj: any) => {
  //     if (obj._id == id) {
  //       this.WODesignation = [];
  //       this.WorkOrderRole = obj.workOrderRoles
  //       let roles = obj.workOrderRoles.map((item) => ({ _id: item.role._id, name: item.role.name }));
  //       roles.forEach(ele => {
  //         var chk = this.WODesignation.map(item => item._id).indexOf(ele._id);
  //         if (chk <= -1) {
  //           this.WODesignation.push(ele);
  //         }
  //       });
  //     }
  //     // return this.WorkOrderRole = obj.workOrderRoles.map(item => item.role);
  //     return this.WODesignation
  //   })
  // }

  // filterWorkOrderUnitBranch(id: any) {
  //   this.employeeForm.controls.WorkOrderUnitBranch.setValue('');
  //   this.WorkOrderUnitBranch = [];
  //   if (id != '') {
  //     this.WorkOrderRole.forEach((ele) => {
  //       if (ele.role._id == id) {
  //         this.WorkOrderUnitBranch.push(ele)
  //       }
  //     })
  //   }
  // }

  ModelOpen(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";

    this.getCourse()
    this.getDesignation()
    this.getOccupation()
    this.getRelationship()
    this.getYear()

    this.familyForm.reset()
    this.educationalQualificationForm.reset()
    this.workExperienceForm.reset()
    this.referencesForm.reset()
  }

  ModelClose(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "none";
  }

  orgValueChange(event) {
    if (event.target.value) {
      let dob = new Date(event.target.value);
      let today = new Date();

      if (today > dob) {
        let age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth()) {
          age = age - 1;
        }
        this.employeeForm.controls['Age'].patchValue(age)
      }
    }
  }

  orgValueExp(event) {
    if (event.target.value) {
      let expTo = new Date(this.workExperienceForm.controls['To'].value);
      let expFrom = new Date(this.workExperienceForm.controls['From'].value);
      if (expTo && expFrom && expTo > expFrom) {
        let totalExp = this.dateAgo(expFrom, expTo);

        this.workExperienceForm.controls['ExperienceYear'].patchValue(totalExp)
      }
    }
  }

  dateAgo(expFrom, expTo) {
    var diffDate: any = new Date(expTo - expFrom);
    return ((diffDate.toISOString().slice(0, 4) - 1970) + "Y " +
      diffDate.getMonth() + "M ");
  }

  selectCheckBox(targetType: string) {
    this.currentlyChecked = targetType;
  }

  selectESIBasedOn(targetType: string, event) {
    if (event.target.checked == true) {
      this.selectedESIBased = targetType;
    }
    else if (event.target.checked == false) {
      this.selectedESIBased = '';
    }
  }

  // selectAddress(targetType: string) {
  //   this.selectedAddress = targetType;
  // }

  getAllStructure() {
    this.addStructureService.getStructure()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.salaryData = res['data']
          }
        },
        error => {
          console.error(error)
        }
      )
  }

  selectAddress() {
    this.selectedAddress = !this.selectedAddress;

    if (this.selectedAddress == true) {
      this.employeeForm.controls.PermanentAddress.setValue(this.employeeForm.value.PresentAddress)
      this.employeeForm.controls.PermanentAddressPincode.setValue(this.employeeForm.value.PresentAddressPincode)
      this.employeeForm.controls.PermanentAddressPhone.setValue(this.employeeForm.value.PresentAddressPhone)
    }
    else {
      this.employeeForm.controls.PermanentAddress.setValue('')
      this.employeeForm.controls.PermanentAddressPincode.setValue('')
      this.employeeForm.controls.PermanentAddressPhone.setValue('')
    }
  }

  resetDateOfExit() {
    this.employeeForm.controls['DateOfExit'].patchValue('null');
  }

  getpayscaleFixation() {
    this.showLoaderService.start()

    this.payscaleFixationService.getPayscaleFixation()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.fixationData = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }


  filterFixation(id: any) {

    let Workorder = this.employeeForm.get('WorkOrder')?.value;

    this.Workorder.find((obj: any) => {
      if (obj._id == Workorder)
        return this.WODATA = obj.workOrderRoles.filter((item: any) => item._id == id);
    })

    this.WOLocation = this.WODATA[0]?.siteAddress ? this.WODATA[0]?.siteAddress : '';
    this.WOSalary = this.WODATA[0]?.salary ? this.WODATA[0]?.salary : '';

    this.transformed = [];

    this.fixationData.filter((obj: any) => {
      if (obj.WorkOrderRole._id == id && obj.WorkOrder._id == Workorder) {
        this.fixationInfo = obj;
        this.transformed.push(this.fixationInfo);
      }
    })
  }

  filterFixationData(id: any) {
    let Workorder = this.employeeForm.get('WorkOrder')?.value;
    let WorkorderRole = this.employeeForm.get('WorkOrderRole')?.value;

    this.fixationData.find((obj: any) => {
      if (obj.WorkOrderRole._id == WorkorderRole && obj.WorkOrder._id == Workorder && obj._id == id) {
        this.fixationValues = obj;
      }
    })
    this.employeeForm.controls['GrossSalary'].setValue(this.fixationValues.GrossSalary);
    this.employeeForm.controls['DeductedSalary'].setValue(this.fixationValues.DeductedSalary);
    this.employeeForm.controls['NetSalary'].setValue(this.fixationValues.NetSalary);
    this.employeeForm.controls['BasicVDA'].setValue(this.fixationValues.BasicVDA);
    this.employeeForm.controls['Gratuity'].setValue(this.fixationValues.Gratuity);
    this.employeeForm.controls['MedicalAllowance'].setValue(this.fixationValues.MedicalAllowance);
    this.employeeForm.controls['RelieverCharges'].setValue(this.fixationValues.RelieverCharges);
    this.employeeForm.controls['Bonus'].setValue(this.fixationValues.Bonus);
    this.employeeForm.controls['HRA'].setValue(this.fixationValues.HRA);
    this.employeeForm.controls['NationalFestivalHolidays'].setValue(this.fixationValues.NationalFestivalHolidays);
    this.employeeForm.controls['Conveyance'].setValue(this.fixationValues.Conveyance);
    this.employeeForm.controls['LeaveWithWages'].setValue(this.fixationValues.LeaveWithWages);
    this.employeeForm.controls['WashingAllowance'].setValue(this.fixationValues.WashingAllowance);
    this.employeeForm.controls['SpecialAllowance'].setValue(this.fixationValues.SpecialAllowance);
    this.employeeForm.controls['PFAmount'].setValue(this.fixationValues.PFAmount);
    this.employeeForm.controls['ESIAmount'].setValue(this.fixationValues.ESIAmount);
    this.employeeForm.controls['ProfessionalTax'].setValue(this.fixationValues.ProfessionalTax);
    this.selectedESIBased = this.fixationValues.ESIBasedOn;
    this.selectedValue = JSON.parse(this.fixationValues.benefitType);
    this.selectedDeductionValue = JSON.parse(this.fixationValues.deductionType)
  }


  CheckMaritalStatus(Type) {
    if (Type.toLowerCase() != '60dd5a4eb54a040524e8f795') {
      this.employeeForm.get('SpouseName').patchValue(null)
    }
  }

}
