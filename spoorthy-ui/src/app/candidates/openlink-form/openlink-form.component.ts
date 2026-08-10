import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { requiredFileType } from 'src/app/helper-functions/requiredFileType';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';

@Component({
  selector: 'app-openlink-form',
  templateUrl: './openlink-form.component.html',
  styleUrls: ['./openlink-form.component.scss']
})
export class OpenlinkFormComponent implements OnInit {

  public activeId: string;
  public activeNo: string;

  public employeeForm: FormGroup;
  public familyForm: FormGroup;
  public educationalQualificationForm: FormGroup;
  public workExperienceForm: FormGroup;
  public languagesKnownForm: FormGroup;
  public referencesForm: FormGroup;

  public Gender: any[];
  public MaritalStatus: any[];
  public Religion: any[];
  public BloodGroup: any[];
  public Course: any[];
  public Occupation: any[];
  public Designation: any[];
  public Language: any[];
  public Relationship: any[];
  public languageArr: any[];

  public formCounter: number = 0

  public CandidatePhoto: any;
  public AadharDocument: any;
  public ResumeDocument: any;
  public PANDocument: any;
  public QualificationDocument: any;

  currentlyChecked = "EXPERIENCED";
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

  public languageList = [];
  public todaydate = new Date();

  AadharDocumenturl: any = undefined;
  CandidatePhotourl: any = undefined;
  ResumeDocumenturl: any = undefined;
  PANDocumenturl: any = undefined;
  IDProofDocumenturl: any = undefined;
  PassbookDocumenturl: any = undefined;
  QualificationDocumenturl: any = undefined;

  employeeDataList: any;
  URLphoneNo: any;
  getSMSLinkData: any;

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private addEmployeeService: AddEmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private commonService: CommonserviceService
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
      }
    }
  }

  ngOnInit(): void {

    const path = this.route.snapshot.routeConfig.path;

    if (path.startsWith('openlinkForm')) {

      this.route.queryParams.subscribe(params => {
        this.URLphoneNo = params.phoneNo;
        console.log(this.URLphoneNo); // prints the value of 'phoneNo' parameter
        this.onGetSMSLink(this.URLphoneNo);
      });

      // this.router.navigate(['openlinkForm']);

      // this.activatedRoute.paramMap
      this.route.queryParamMap
        .subscribe(params => {
          this.activeId = params.get('Name');
          this.activeNo = params.get('PhoneNo');
          console.log(this.activeId);
          // tslint:disable-next-line: no-string-literal
        });
    }

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
    this.getLanguage()
    this.getRelationship()
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
      'Designation': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
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
    })

    this.referencesForm = new FormGroup({
      'Name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'Occupation': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(100)]),
      'Address': new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      'ContactNo': new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(10)]),
      'AadharNo': new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(12)])
    })
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
      Language: [''],
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
        Language: [''],
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

    var formobj = this.employeeForm.value;

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

    formData.append('WorkExperienceType', this.currentlyChecked)

    if (formobj.UniversalAccount) {
      const UAN = this.employeeDataList.find(e => e.UniversalAccount == formobj.UniversalAccount);
      if (UAN) {
        this.toastr.error("UAN already exists!");
        return;
      } else {
        formData.append('UniversalAccount', formobj.UniversalAccount)
      }
    }

    if (formobj.PFAccount)
      formData.append('PFAccount', formobj.PFAccount)
    if (formobj.SchemeCertificate)
      formData.append('SchemeCertificate', formobj.SchemeCertificate)
    if (formobj.PPONumber)
      formData.append('PPONumber', formobj.PPONumber)
    if (formobj.NonContributoryPeriod)
      formData.append('NonContributoryPeriod', formobj.NonContributoryPeriod)

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

    formData.append('FamilyDetail', JSON.stringify(sendFamily))
    formData.append('EducationalQualification', JSON.stringify(sendEducation))
    formData.append('WorkExperience', JSON.stringify(sendWork))
    formData.append('References', JSON.stringify(sendReference))

    this.showLoaderService.start();
    this.addEmployeeService.addEmployee(formData)
      .subscribe(
        res => {
          this.showLoaderService.stop();
          if (res["success"]) {
            this.toastr.success(res['message'])
            this.router.navigate(['/thankyou'])
          }
        },
        error => {
          this.showLoaderService.stop();
          this.toastr.error(error.error.message);
        }
      )
  }



  populateLanguage(val, i) {
    this.GetLanguages.push(this.fb.group({
      Language: [val.Language._id],
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

  displayExperienceTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));
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
    return displayTable
  }


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
  ModelOpen(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";

    this.getCourse()
    this.getDesignation()
    this.getOccupation()
    this.getRelationship()

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

  selectAddress() {
    this.selectedAddress = !this.selectedAddress;

    if (this.selectedAddress == true) {
      this.employeeForm.controls.PermanentAddress.setValue(this.employeeForm.value.PresentAddress)
      this.employeeForm.controls.PermanentAddressPincode.setValue(this.employeeForm.value.PresentAddressPincode)
      this.employeeForm.controls.PermanentAddressPhone.setValue(this.URLphoneNo)
    }
    else {
      this.employeeForm.controls.PermanentAddress.setValue('')
      this.employeeForm.controls.PermanentAddressPincode.setValue('')
      this.employeeForm.controls.PermanentAddressPhone.setValue('')
    }
  }

  onGetSMSLink(mobileNo) {
    this.showLoaderService.start()
    this.addEmployeeService.getSMSLink(mobileNo)
      .subscribe((res: any) => {
        this.showLoaderService.stop();
        if (res['success'] == true) {
          this.employeeForm.controls.PresentAddressPhone.setValue(this.URLphoneNo);
          this.employeeForm.controls.PermanentAddressPhone.setValue(this.URLphoneNo);
          this.employeeForm.controls.PresentAddressPhone.disable();
          return;
        }
        else {
          this.router.navigate(['unauthorised']);
          this.showLoaderService.stop();
        }
      },
        error => {
          this.router.navigate(['unauthorised']);
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }


}
