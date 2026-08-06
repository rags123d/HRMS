import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { requiredFileType } from '../../helper-functions/requiredFileType';
import { AddWorkorderService } from "../../shared/http/add-workorder.service";
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AddClientService } from 'src/app/shared/http/add-client.service';

@Component({
  selector: 'app-add-workorder',
  templateUrl: './add-workorder.component.html',
  styleUrls: ['./add-workorder.component.scss']
})
export class AddWorkorderComponent implements OnInit {

  workOrderForm: FormGroup;
  jobRoleForm: FormGroup;

  Client: any[];
  Designation: any[];

  workOrderDocument: any;
  agreementDocument: any;
  bankGuaranteeDocument: any;

  jobRoleTest = []

  DocUrl = environment.baseUrl2

  formCounter: number = 0

  clientId = this.route.snapshot.params['id']
  url = this.route.snapshot.params['workorderid']
  mainid = this.route.snapshot.params['mainid']
  workordertype = this.route.snapshot.params['type']

  jobRoleSource: any;
  jobRoleSourceColumn: string[] = ['Job/Role', 'Unit/Branch', 'Job Location', 'Salary', 'No. of Jobs', 'Action'];

  workOrderData: any;

  public ListSkip = 0;
  public ListLimit = 10;
  public ListTotal = 0;

  workOrderDocumenturl: any = undefined;
  agreementDocumenturl: any = undefined;
  bankGuaranteeDocumenturl: any = undefined;

  formSubmitted: boolean = false;
  formEdit: boolean = false;
  selectedJobRole: any;

  constructor(
    private addWorkOrderService: AddWorkorderService,
    private addClientService: AddClientService,
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  @HostListener('change', ['$event.target']) emitFiles(event: FileList) {
    if (event != null) {
      var Elem = event as any

      if (Elem.files != null) {
        const file = Elem.files[0]
        if (Elem.id == 'workOrderDocument' && file) {
          var element = document.getElementById("workOrderDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.workOrderDocumenturl = objUrl;
          this.workOrderForm.controls.workOrderDocument.setValue(file)
        }
        else if (Elem.id == 'agreementDocument' && file) {
          var element = document.getElementById("agreementDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.agreementDocumenturl = objUrl;
          this.workOrderForm.controls.agreementDocument.setValue(file)
        }
        else
          if (Elem.id == 'bankGuaranteeDocument' && file) {
            var element = document.getElementById("bankGuaranteeDocumentName") as any;
            element.innerHTML = file.name
            let objUrl = URL.createObjectURL(file);
            this.bankGuaranteeDocumenturl = objUrl;
            this.workOrderForm.controls.bankGuaranteeDocument.setValue(file)
          }
      }
    }
  }

  ngOnInit(): void {
    this.jobRoleSource = new MatTableDataSource([])
    this.clientId = sessionStorage.getItem('client')

    this.getClient()
    this.getDesignation()

    this.workOrderForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      'noOfRequirements': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'workOrderDocument': new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      "agreementDocument": new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      "bankGuaranteeDocument": new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      'client': new FormControl('', [Validators.required]),
      'StartDate': new FormControl(null, [Validators.required]),
      'RenewalDate': new FormControl(null, [Validators.required]),
      'depositAmount': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'eprocReference': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'spoorthyReference': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'workOrderNumber': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'bankGuaranteeNumber': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'workOrderDate': new FormControl(null, [Validators.required]),
      'eprocDate': new FormControl(null, [Validators.required]),
      'bankGuaranteeDate': new FormControl(null, [Validators.required]),
    })

    this.jobRoleForm = new FormGroup({
      'role': new FormControl('', [Validators.required]),
      'noOfManpower': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      'branchName': new FormControl(null),
      'siteAddress': new FormControl(null),
      'salary': new FormControl(null, [Validators.required, Validators.pattern('^[0-9.]*$')])
    })

    this.workOrderForm.controls.client.disable()

    if (this.url != undefined) {
      this.getWorkOrder(this.url)
    }
  }

  onSubmit() {
    const formData = new FormData()

    if (this.url) {
      formData.append("id", this.url);
    }
    if (this.workordertype == "subWO" && (this.mainid && this.mainid != undefined)) {
      formData.append("workOrderType", "SUB_WORKORDER");
      formData.append("mainWorkOrderId", this.mainid);
    }
    else {
      formData.append("workOrderType", "MAIN_WORKORDER");
    }

    formData.append('name', this.workOrderForm.get('name').value)
    formData.append('noOfRequirements', this.workOrderForm.get('noOfRequirements').value)
    formData.append('workOrderDocument', this.workOrderForm.get('workOrderDocument').value)
    formData.append('agreementDocument', this.workOrderForm.get('agreementDocument').value)
    formData.append('bankGuaranteeDocument', this.workOrderForm.get('bankGuaranteeDocument').value)
    formData.append('client', this.workOrderForm.get('client').value)
    formData.append('StartDate', this.workOrderForm.get('StartDate').value)
    formData.append('RenewalDate', this.workOrderForm.get('RenewalDate').value)
    formData.append('depositAmount', this.workOrderForm.get('depositAmount').value)
    formData.append('eprocReference', this.workOrderForm.get('eprocReference').value)
    formData.append('spoorthyReference', this.workOrderForm.get('spoorthyReference').value)
    formData.append('workOrderNumber', this.workOrderForm.get('workOrderNumber').value)
    formData.append('bankGuaranteeNumber', this.workOrderForm.get('bankGuaranteeNumber').value)
    formData.append('eprocDate', this.workOrderForm.get('eprocDate').value)
    formData.append('bankGuaranteeDate', this.workOrderForm.get('bankGuaranteeDate').value)
    formData.append('workOrderDate', this.workOrderForm.get('workOrderDate').value)

    this.jobRoleTest.forEach((obj: any) => {
      if (obj.isEdit == true) {
        delete obj.isEdit
        delete obj._id
      }
    })

    formData.append('workOrderRoles', JSON.stringify(this.jobRoleTest))

    this.showLoaderService.start()
    this.addWorkOrderService.addWorkOrder(formData)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.toastr.success(res['message'])
            this.router.navigate([`/client/overview/${this.clientId}`])
            sessionStorage.removeItem('client')
          }
        },
        error => {
          this.showLoaderService.stop()
          this.toastr.error(error.error.message)
          console.error(error)
        }
      )
  }

  getWorkOrder(url: string) {
    this.showLoaderService.start()
    this.addWorkOrderService.getWorkOrder()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            const data = res['data'].filter((data: any) => {
              return data._id === url
            })

            this.workOrderForm.controls.name.setValue(data[0].name)
            this.workOrderForm.controls.noOfRequirements.setValue(data[0].noOfRequirements)
            this.workOrderForm.controls.client.setValue(data[0].client._id)

            // Populate Work Order Date
            var workOrderDate = data[0].workOrderDate ? data[0].workOrderDate.split('T')[0] : ""
            this.workOrderForm.controls.workOrderDate.setValue(workOrderDate)

            var startDate = data[0].StartDate ? data[0].StartDate.split('T')[0] : ""
            this.workOrderForm.controls.StartDate.setValue(startDate)

            var renewalDate = data[0].RenewalDate ? data[0].RenewalDate.split('T')[0] : ""
            this.workOrderForm.controls.RenewalDate.setValue(renewalDate)

            this.workOrderForm.controls.depositAmount.setValue(data[0].depositAmount)
            this.workOrderForm.controls.eprocReference.setValue(data[0].eprocReference)
            this.workOrderForm.controls.spoorthyReference.setValue(data[0].spoorthyReference)
            this.workOrderForm.controls.workOrderNumber.setValue(data[0].workOrderNumber)
            this.workOrderForm.controls.bankGuaranteeNumber.setValue(data[0].bankGuaranteeNumber)

            var eprocDate = data[0].eprocDate ? data[0].eprocDate.split('T')[0] : ""
            this.workOrderForm.controls.eprocDate.setValue(eprocDate)

            var bankGuaranteeDate = data[0].bankGuaranteeDate ? data[0].bankGuaranteeDate.split('T')[0] : ""
            this.workOrderForm.controls.bankGuaranteeDate.setValue(bankGuaranteeDate)

            var workOrderDocumentsp = data[0].workOrderDocument.split('-');
            this.getBlobFromUrl(this.DocUrl + data[0].workOrderDocument, workOrderDocumentsp[workOrderDocumentsp.length - 1], "workOrderDocument");

            var agreementDocumentsp = data[0].agreementDocument.split('-');
            this.getBlobFromUrl(this.DocUrl + data[0].agreementDocument, agreementDocumentsp[agreementDocumentsp.length - 1], "agreementDocument");

            var bankGuaranteeDocumentsp = data[0].bankGuaranteeDocument.split('-');
            this.getBlobFromUrl(this.DocUrl + data[0].bankGuaranteeDocument, bankGuaranteeDocumentsp[bankGuaranteeDocumentsp.length - 1], "bankGuaranteeDocument");

            this.jobRoleTest = data[0].workOrderRoles
            this.jobRoleSource = new MatTableDataSource(this.displayJobRoleTable(data[0].workOrderRoles))
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
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
          if (doc == 'workOrderDocument') {
            this.workOrderForm.controls.workOrderDocument.setValue(finalfile)
            var element = document.getElementById("workOrderDocumentName") as any;
            element.innerHTML = filename;
            this.workOrderDocumenturl = myImageUrl;
          }
          if (doc == 'agreementDocument') {
            this.workOrderForm.controls.agreementDocument.setValue(finalfile)
            var element = document.getElementById("agreementDocumentName") as any;
            element.innerHTML = filename;
            this.agreementDocumenturl = myImageUrl;
          }
          if (doc == 'bankGuaranteeDocument') {
            this.workOrderForm.controls.bankGuaranteeDocument.setValue(finalfile)
            var element = document.getElementById("bankGuaranteeDocumentName") as any;
            element.innerHTML = filename;
            this.bankGuaranteeDocumenturl = myImageUrl;
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

  addJobRole() {
    if (this.formEdit && this.selectedJobRole && this.selectedJobRole != undefined) {
      this.jobRoleTest.forEach(ele => {
        if (ele["_id"] == this.selectedJobRole) {
          ele['_id'] = this.selectedJobRole;
          ele['role'] = this.jobRoleForm.controls.role.value;
          ele['noOfManpower'] = this.jobRoleForm.controls.noOfManpower.value;
          ele['branchName'] = this.jobRoleForm.controls.branchName.value;
          ele['siteAddress'] = this.jobRoleForm.controls.siteAddress.value;
          ele['salary'] = +this.jobRoleForm.controls.salary.value;
          ele['isEdit'] = false;
        }
      });
    } else {
      this.formCounter++
      this.jobRoleTest.push({
        '_id': this.formCounter,
        'role': this.jobRoleForm.controls.role.value,
        'noOfManpower': this.jobRoleForm.controls.noOfManpower.value,
        'branchName': this.jobRoleForm.controls.branchName.value,
        'siteAddress': this.jobRoleForm.controls.siteAddress.value,
        'salary': +this.jobRoleForm.controls.salary.value,
        'isEdit': true
      })
    }

    this.ModelClose('JobRoleModel')
    this.jobRoleSource = new MatTableDataSource(this.displayJobRoleTable(this.jobRoleTest));
  }

  deleteEducationalData(id: number) {
    this.jobRoleTest = this.jobRoleTest.filter(function (obj: any) {
      return obj._id != id;
    });

    this.jobRoleSource = new MatTableDataSource(this.displayJobRoleTable(this.jobRoleTest));
  }

  displayJobRoleTable(data: any) {
    var displayTable: any = data.map(a => ({ ...a }));

    displayTable.forEach((element: any) => {
      var designation = this.Designation.find((obj: any) => {
        if (obj._id == element.role)
          return obj._id == element.role
        else
          return obj._id == element.role._id
      })
      if (designation != undefined)
        element.role = designation.name
    });
    return displayTable
  }

  getClient() {
    this.showLoaderService.start()
    this.addClientService.getClient()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.Client = res['data']
            this.workOrderForm.controls.client.setValue(this.clientId)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error);
        }
      )
  }

  getDesignation() {
    this.showLoaderService.start()
    this.addWorkOrderService.getDesignation()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.Designation = res['data']
          }

        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  onClearForm() {
    this.workOrderForm.reset();
  }

  ModelOpen(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "block";
    this.getDesignation()
    this.jobRoleForm.reset()
  }

  ModelClose(target: string) {
    (<HTMLInputElement>document.getElementById(target)).style.display = "none";
  }

  onEditJobRoleModel(template: string, dataObject) {
    (<HTMLInputElement>document.getElementById(template)).style.display = "block";
    this.formEdit = true;
    this.formSubmitted = false;
    this.jobRoleForm.reset();
    this.selectedJobRole = dataObject["_id"] ? dataObject["_id"] : -1;

    var roleid = this.Designation.find((obj: any) => {
      if (obj.name == dataObject.role)
        return obj._id
    })

    this.jobRoleForm.patchValue({
      _id: dataObject['_id'],
      role: roleid._id,
      noOfManpower: dataObject['noOfManpower'],
      branchName: dataObject['branchName'],
      siteAddress: dataObject['siteAddress'],
      salary: dataObject['salary'],
    });

  }

}