import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { BrowserstorageService } from 'src/app/shared/non-http/browserstorage.service';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AddCourseService } from 'src/app/shared/http/add-course.service';
import { AddRelationshipService } from 'src/app/shared/http/add-relationship.service';
import { AddDesignationService } from 'src/app/shared/http/add-designation.service';
import { AddReligionService } from 'src/app/shared/http/add-religion.service';


@Component({
  selector: 'app-bulk-candidates',
  templateUrl: './bulk-candidates.component.html',
  styleUrls: ['./bulk-candidates.component.scss']
})
export class BulkCandidatesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  modalRef: BsModalRef;

  // candidatesList: any = [];
  candidatesList: CandidateDetails[];
  excelfile: any;
  arrayBuffer: any;
  allCourse: any;
  filteredCourse: any;
  allRelationship: any;
  filteredRelationship: any;
  allDesignation: any;
  filteredDesignation: any;
  allReligion: any;
  filteredReligion: any;



  constructor(
    private ngxService: NgxUiLoaderService,
    private modalService: BsModalService,
    private browserStorageService: BrowserstorageService,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private addCourseService: AddCourseService,
    private addRelationshipService: AddRelationshipService,
    private addDesignationService: AddDesignationService,
    private addReligionService: AddReligionService,
    private showLoaderService: NgxUiLoaderService,
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
    
    this.onGetAllCourse();
    this.onGetAllRelationship();
    this.onGetAllDesignation();
    this.onGetAllReligion();
  }
  
  onGetAllCourse() {
    this.ngxService.start();
    this.addCourseService.getCourse()
      .subscribe(res => {
        if (res['success'] == true) {
          this.allCourse = res["data"];
          this.filteredCourse = this.allCourse;
        } else {
          this.toastr.error("Error getting data.");
          this.ngxService.stop();
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop() });
  }

  onGetAllRelationship() {
    this.ngxService.start();
    this.addRelationshipService.getRelationship()
      .subscribe(res => {
        if (res['success'] == true) {
          this.allRelationship = res["data"];
          this.filteredRelationship = this.allRelationship;
        } else {
          this.toastr.error("Error getting data.");
          this.ngxService.stop();
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop() });
  }

  onGetAllDesignation() {
    this.ngxService.start();
    this.addDesignationService.getDesignation()
      .subscribe(res => {
        if (res['success'] == true) {
          this.allDesignation = res["data"];
          this.filteredDesignation = this.allDesignation;
        } else {
          this.toastr.error("Error getting data.");
          this.ngxService.stop();
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop() });
  }

  onGetAllReligion() {
    this.ngxService.start();
    this.addReligionService.getReligion()
      .subscribe(res => {
        if (res['success'] == true) {
          this.allReligion = res['data'];
          this.filteredReligion = this.allReligion;
        } else {
          this.toastr.error("Error getting data.");
          this.ngxService.stop();
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop() });
  }

  onSubmitBulkCandidateDetails() {
    let url = `/addBulkEmployee`;
    this.showLoaderService.start()
    // this.addEmployeeService.addBulkEmployee()
    this.commonService.onCommonPost(this.candidatesList, url)
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            $('#candidateTable').DataTable().destroy();
          } else {
            this.toastr.error(res['ErrorMessage']);
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      )
  }

  onAlertBulkCandidates(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm', backdrop: 'static', keyboard: false });
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
      let arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(arraylist);


      $('#candidateTable').DataTable().destroy();
      // this.filelist = [];    
      // console.log(this.filelist)    
      this.candidatesList = arraylist.map((item) => ({
        Id: 0,
        EmpFullName: item.emp_FullName ? item.emp_FullName : '',
        EmpDateOfBirth: (item.emp_DateOfBirth ? this.datePipe.transform(new Date((item.emp_DateOfBirth - 25569) * 86400000), 'yyyy-MM-dd') : ''),
        EmpAge: item.emp_Age ? item.emp_Age : '',
        EmpPlaceOfBirth: item.emp_PlaceOfBirth ? item.emp_PlaceOfBirth : '',
        EmpMotherTongue: item.emp_MotherTongue ? item.emp_MotherTongue : '',
        EmpGender: item.emp_Gender ? item.emp_Gender : '',
        EmpMaritalStatus: item.emp_MaritalStatus ? item.emp_MaritalStatus : '',
        EmpReligion: item.emp_Religion ? item.emp_Religion : '',
        EmpBloodGroup: item.emp_BloodGroup ? item.emp_BloodGroup : '',
        EmpAadharNo: item.emp_AadharNo ? item.emp_AadharNo : '',
        EmpPAN: item.emp_PAN ? item.emp_PAN : '',
        EmpPresentAddress: item.emp_PresentAddress ? item.emp_PresentAddress : '',
        EmpPresentAddressPincode: item.emp_PresentAddressPincode ? item.emp_PresentAddressPincode : '',
        EmpPresentAddressPhone: item.emp_PresentAddressPhone ? item.emp_PresentAddressPhone : '',
        EmpPermanentAddress: item.emp_PermanentAddress ? item.emp_PermanentAddress : '',
        EmpPermanentAddressPincode: item.emp_PermanentAddressPincode ? item.emp_PermanentAddressPincode : '',
        EmpPermanentAddressPhone: item.emp_PermanentAddressPhone ? item.emp_PermanentAddressPhone : '',
        EmpIdentification1: item.emp_Identification1 ? item.emp_Identification1 : '',
        EmpIdentification2: item.emp_Identification2 ? item.emp_Identification2 : '',
        EmpMark1: item.emp_Mark1 ? item.emp_Mark1 : '',
        EmpMark2: item.emp_Mark2 ? item.emp_Mark2 : '',

        LngLanguage: item.emp_Language ? item.emp_Language : '',
        LngSpeak: item.emp_Speak ? item.emp_Speak : 'false',
        LngWrite: item.emp_Write ? item.emp_Write : 'false',
        LngRead: item.emp_Read ? item.emp_Read : 'false',

        FamRelationship: item.fam_Relationship ? item.fam_Relationship : '',
        FamName: item.fam_Name ? item.fam_Name : '',
        FamDateOfBirth: (item.fam_DateOfBirth ? this.datePipe.transform(new Date((item.fam_DateOfBirth - 25569) * 86400000), 'dd-MM-yyyy') : ''),
        FamContactNo: item.fam_ContactNo ? item.fam_ContactNo : '',
        FamAadharNo: item.fam_AadharNo ? item.fam_AadharNo : '',

        EduCourse: item.edu_Course ? item.edu_Course : '',
        EduSchoolCollegeName: item.edu_SchoolCollegeName ? item.edu_SchoolCollegeName : '',
        EduFrom: item.edu_From ? item.edu_From : '',
        EduTo: item.edu_To ? item.edu_To : '',
        EduMarks: item.edu_Marks ? item.edu_Marks : '',

        ExpType: item.exp_Type ? item.exp_Type : '',

        ExpDesignation: item.exp_Designation ? item.exp_Designation : '',
        ExpCompanyName: item.exp_CompanyName ? item.exp_CompanyName : '',
        ExpFrom: (item.exp_From ? this.datePipe.transform(new Date((item.exp_From - 25569) * 86400000), 'dd-MM-yyyy') : ''),
        ExpTo: (item.exp_To ? this.datePipe.transform(new Date((item.exp_To - 25569) * 86400000), 'dd-MM-yyyy') : ''),
        ExpExperienceYear: item.exp_ExperienceYear ? item.exp_ExperienceYear : '',
        ExpSalaryDrawn: item.exp_SalaryDrawn ? item.exp_SalaryDrawn : '',
        ExpReasonForLeaving: item.exp_ReasonForLeaving ? item.exp_ReasonForLeaving : '',
        ExpSupervisorName: item.exp_SupervisorName ? item.exp_SupervisorName : '',
        ExpSupervisorMobile: item.exp_SupervisorMobile ? item.exp_SupervisorMobile : '',
        ExpSupervisorEmail: item.exp_SupervisorEmail ? item.exp_SupervisorEmail : '',

        UANUniversalAccount: item.uan_UniversalAccount ? item.uan_UniversalAccount : '',
        UANPFAccount: item.uan_PFAccount ? item.uan_PFAccount : '',
        UANSchemeCertificate: item.uan_SchemeCertificate ? item.uan_SchemeCertificate : '',
        UANPPONumber: item.uan_PPONumber ? item.uan_PPONumber : '',
        UANNonContributoryPeriod: item.uan_NonContributoryPeriod ? item.uan_NonContributoryPeriod : '',
        UANESI: item.uan_ESI ? item.uan_ESI : '',

        RefName: item.ref_Name ? item.ref_Name : '',
        RefOccupation: item.ref_Occupation ? item.ref_Occupation : '',
        RefAddress: item.ref_Address ? item.ref_Address : '',
        RefContactNo: item.ref_ContactNo ? item.ref_ContactNo : '',
        RefAadharNo: item.ref_AadharNo ? item.ref_AadharNo : '',


        CreatedBy: this.browserStorageService.loggedInUser,
        ModifiedBy: this.browserStorageService.loggedInUser,

      }));
      setTimeout(() => {
        $('#candidateTable').DataTable({
          paging: false,
          scrollX: false,
          info: false,
          processing: true,
          "order": [],                       // sorting 2nd column
          "columnDefs": [
            { "orderable": false, "targets": "_all" } // Applies the option to all columns
          ]
        });


        $('table#candidateTable.dataTable').wrap("<div class='scrolledTable'></div>");
        this.ngxService.stop();
      }, 150);
    }
  }

}



export class CandidateDetails {
  Id: number;
  EmpFullName: string;
  EmpDateOfBirth: Date;
  EmpAge: number;
  EmpPlaceOfBirth: String;
  EmpMotherTongue: String;
  EmpGender: String;
  EmpMaritalStatus: String;
  EmpReligion: String;
  EmpBloodGroup: String;
  EmpAadharNo: String;
  EmpPAN: String;
  EmpPresentAddress: String;
  EmpPresentAddressPincode: String;
  EmpPresentAddressPhone: String;
  EmpPermanentAddress: String;
  EmpPermanentAddressPincode: String;
  EmpPermanentAddressPhone: String;
  EmpIdentification1: String;
  EmpIdentification2: String;
  EmpMark1: String;
  EmpMark2: String;

  EmpLanguage: String;
  EmpSpeak: Boolean;
  EmpWrite: Boolean;
  EmpRead: Boolean;

  FamRelationship: String;
  FamName: String;
  FamDateOfBirth: String;
  FamContactNo: String;
  FamAadharNo: String;

  EduCourse: String;
  EduSchoolCollegeName: String;
  EduFrom: String;
  EduTo: String;
  EduMarks: String;

  ExpType: String;

  ExpDesignation: String;
  ExpCompanyName: String;
  ExpFrom: Date;
  ExpTo: Date;
  ExpExperienceYear: String;
  ExpSalaryDrawn: String;
  ExpReasonForLeaving: String;
  ExpSupervisorName: String;
  ExpSupervisorMobile: String;
  ExpSupervisorEmail: String;

  UANUniversalAccount: String;
  UANPFAccount: String;
  UANSchemeCertificate: String;
  UANPPONumber: String;
  UANNonContributoryPeriod: String;
  UANESI: String;

  RefName: String;
  RefOccupation: String;
  RefAddress: String;
  RefContactNo: String;
  RefAadharNo: String;

  CreatedBy: String;
  ModifiedBy: String;

}
