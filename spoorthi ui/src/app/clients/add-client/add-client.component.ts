import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { requiredFileType } from 'src/app/helper-functions/requiredFileType';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddClientService } from "../../shared/http/add-client.service";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  public clientForm: FormGroup;
  public Designation: any[];
  public DocUrl = environment.baseUrl2
  public url = this.route.snapshot.params.id

  
  public agreementDocument: any;
  public GSTDocument: any;
  public PANDocument: any;
  public TANDocument: any;
  public licenseDocument: any;
  public companyLogo: any;

  // public agreementDocumentChecker = false;
  public licenseDocumentChecker = false;
  public GSTDocumentChecker = false;
  public PANDocumentChecker = false;
  public companyLogoChecker = false;

  licenseDocumenturl: any = undefined;
  GSTDocumenturl: any = undefined;
  PANDocumenturl: any = undefined;
  companyLogourl: any = undefined;
  TANDocumenturl: any = undefined;


  constructor(
    private showLoaderService: NgxUiLoaderService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private addClientService: AddClientService
  ) { }

  @HostListener('change', ['$event.target']) emitFiles(event: FileList) {
    if (event != null) {
      var Elem = event as any
      if (Elem.files != null) {
        const file = Elem.files[0]
        // if (Elem.id == 'agreementDocument') {
        //   var element = document.getElementById("agreementDocumentName") as any;
        //   element.innerHTML = file.name
        //   this.clientForm.controls.agreementDocument.setValue(file)
        // } else 
        if (Elem.id == 'licenseDocument' && file) {
          var element = document.getElementById("licenseDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.licenseDocumenturl = objUrl;
          this.clientForm.controls.licenseDocument.setValue(file)
        } 
        else if (Elem.id == 'GSTDocument' && file) {
          var element = document.getElementById("GSTDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.GSTDocumenturl = objUrl;
          this.clientForm.controls.GSTDocument.setValue(file)
        } 
        else if (Elem.id == 'PANDocument' && file) {
          var element = document.getElementById("PANDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.PANDocumenturl = objUrl;
          this.clientForm.controls.PANDocument.setValue(file)
        } 
        else if (Elem.id == 'companyLogo' && file) {
          var element = document.getElementById("companyLogoName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.companyLogourl = objUrl;
          this.clientForm.controls.companyLogo.setValue(file)
        } 
        else if (Elem.id == 'TANDocument' && file) {
          var element = document.getElementById("TANDocumentName") as any;
          element.innerHTML = file.name
          let objUrl = URL.createObjectURL(file);
          this.TANDocumenturl = objUrl;
          this.clientForm.controls.TANDocument.setValue(file)
        }
      }
    }
  }

  ngOnInit() {
    this.getDesignation()

    this.clientForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z- ]*$'), Validators.maxLength(100)]),
      'officePhoneNo': new FormControl(null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{11}$"), Validators.maxLength(11)]),
      'cantactNo': new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(10), Validators.maxLength(10)]),
      'email': new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),

      'address': new FormControl(null, [Validators.required, Validators.maxLength(250)]),
      "GSTIN": new FormControl(null, [Validators.minLength(15), Validators.maxLength(15), Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9A-Z]{1}$')]),
      "PAN": new FormControl(null, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[A-Z0-9]*$')]),
      "TAN": new FormControl(null, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[A-Z]{4}[0-9]{5}[A-Z]{1}$')]),

      "contactPerson": new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')]),
      "designation": new FormControl('', [Validators.required]),

      "pinCode": new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      "contactEmail": new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),

      "companyLogo": new FormControl(null, [requiredFileType(['png', 'jpg', 'jpeg'])]),
      // "agreementDocument": new FormControl(null, [Validators.required, requiredFileType(['pdf'])]),
      "licenseDocument": new FormControl(null, [requiredFileType(['pdf'])]),
      "GSTDocument": new FormControl(null, [requiredFileType(['pdf'])]),
      "PANDocument": new FormControl(null, [requiredFileType(['pdf'])]),
      "TANDocument": new FormControl(null, [requiredFileType(['pdf'])]),
    });

    if (this.url !== undefined) {
      this.getClient(this.url)
    }
  }

  getDesignation() {
    this.showLoaderService.start()
    this.addClientService.getDesignation()
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

  getClient(url: string) {
    this.showLoaderService.start()
    this.addClientService.getClient()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            const data = res['data'].filter((data: any) => {
              return data._id === url
            })

            this.clientForm.controls.name.setValue(data[0].name)
            this.clientForm.controls.address.setValue(data[0].address)
            this.clientForm.controls.officePhoneNo.setValue(data[0].officePhoneNo)
            this.clientForm.controls.contactPerson.setValue(data[0].contactPerson)
            this.clientForm.controls.designation.setValue(data[0].designation?._id)
            this.clientForm.controls.cantactNo.setValue(data[0].cantactNo)
            this.clientForm.controls.email.setValue(data[0].email)
            this.clientForm.controls.GSTIN.setValue(data[0].GSTIN)
            this.clientForm.controls.PAN.setValue(data[0].PAN)
            this.clientForm.controls.TAN.setValue(data[0].TAN)

            this.clientForm.controls.pinCode.setValue(data[0].pinCode)
            this.clientForm.controls.contactEmail.setValue(data[0].contactEmail)

            // var agreementDocumentsp = data[0].agreementDocument.split('-');
            // this.getBlobFromUrl(this.DocUrl + data[0].agreementDocument, agreementDocumentsp[agreementDocumentsp.length - 1], "agreementDocument");

            if (data[0].licenseDocument) {
              var licenseDocumentsp = data[0].licenseDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data[0].licenseDocument, licenseDocumentsp[licenseDocumentsp.length - 1], "licenseDocument");
            }

            if (data[0].GSTDocument) {
              var GSTDocumentsp = data[0].GSTDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data[0].GSTDocument, GSTDocumentsp[GSTDocumentsp.length - 1], "GSTDocument");
            }

            if (data[0].PANDocument) {
              var PANDocumentsp = data[0].PANDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data[0].PANDocument, PANDocumentsp[PANDocumentsp.length - 1], "PANDocument");
            }

            if (data[0].companyLogo) {
              var companyLogosp = data[0].companyLogo.split('-');
              this.getBlobFromUrl(this.DocUrl + data[0].companyLogo, companyLogosp[companyLogosp.length - 1], "companyLogo");
            }

            if (data[0].TANDocument) {
              var TANDocumentsp = data[0].TANDocument.split('-');
              this.getBlobFromUrl(this.DocUrl + data[0].TANDocument, TANDocumentsp[TANDocumentsp.length - 1], "TANDocument");
            }
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
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
          // if (doc == 'agreementDocument') {
          //   this.clientForm.controls.agreementDocument.setValue(finalfile)
          //   var element = document.getElementById("agreementDocumentName") as any;
          //   element.innerHTML = filename;
          // }
          // if (doc == 'licenseDocument') {
          //   this.clientForm.controls.licenseDocument.setValue(finalfile)
          //   var element = document.getElementById("licenseDocumentName") as any;
          //   if (element != null)
          //     element.innerHTML = filename;
          //   this.licenseDocumenturl = myImageUrl;
          // }
          if (doc == 'licenseDocument') {
            this.clientForm.controls.licenseDocument.setValue(finalfile)
            var element = document.getElementById("licenseDocumentName") as any;
            element.innerHTML = filename;
            this.licenseDocumenturl = myImageUrl;
          }
          if (doc == 'GSTDocument') {
            this.clientForm.controls.GSTDocument.setValue(finalfile)
            var element = document.getElementById("GSTDocumentName") as any;
            element.innerHTML = filename;
            this.GSTDocumenturl = myImageUrl;
          }
          if (doc == 'PANDocument') {
            this.clientForm.controls.PANDocument.setValue(finalfile)
            var element = document.getElementById("PANDocumentName") as any;
            element.innerHTML = filename;
            this.PANDocumenturl = myImageUrl;
          }
          if (doc == 'companyLogo') {
            this.clientForm.controls.companyLogo.setValue(finalfile)
            var element = document.getElementById("companyLogoName") as any;
            element.innerHTML = filename;
            this.companyLogourl = myImageUrl;
          }
          if (doc == 'TANDocument') {
            this.clientForm.controls.TANDocument.setValue(finalfile)
            var element = document.getElementById("TANDocumentName") as any;
            element.innerHTML = filename;
            this.TANDocumenturl = myImageUrl;
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


  onSubmit() {
    const formData = new FormData();

    if (this.url && this.url != -1)
      formData.append('id', this.url)

    formData.append('name', this.clientForm.controls.name.value)
    formData.append('address', this.clientForm.controls.address.value)
    if (this.clientForm.controls.officePhoneNo.value)
      formData.append('officePhoneNo', this.clientForm.controls.officePhoneNo.value)
    formData.append('contactPerson', this.clientForm.controls.contactPerson.value)
    formData.append('designation', this.clientForm.controls.designation.value)
    formData.append('cantactNo', this.clientForm.controls.cantactNo.value)
    formData.append('email', this.clientForm.controls.email.value)
    formData.append('GSTIN', this.clientForm.controls.GSTIN.value)
    formData.append('PAN', this.clientForm.controls.PAN.value)
    formData.append('TAN', this.clientForm.controls.TAN.value)
    formData.append('pinCode', this.clientForm.controls.pinCode.value)
    formData.append('contactEmail', this.clientForm.controls.contactEmail.value)

    // formData.append('agreementDocument', this.clientForm.controls.agreementDocument.value)
    if (this.clientForm.controls.licenseDocument.value)
      formData.append('licenseDocument', this.clientForm.controls.licenseDocument.value)

    if (this.clientForm.controls.GSTDocument.value)
      formData.append('GSTDocument', this.clientForm.controls.GSTDocument.value)

    if (this.clientForm.controls.TANDocument.value)
      formData.append('TANDocument', this.clientForm.controls.TANDocument.value)

    if (this.clientForm.controls.PANDocument.value)
      formData.append('PANDocument', this.clientForm.controls.PANDocument.value)

    if (this.clientForm.controls.companyLogo.value)
      formData.append('companyLogo', this.clientForm.controls.companyLogo.value)

    this.showLoaderService.start()
    this.addClientService.addClient(formData)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.toastr.success(res['message'])
            this.router.navigate(['/allclient/overview'])
          }
        },
        error => {
          this.showLoaderService.stop()
          this.toastr.error(error.error.message)
          console.error(error)
        }
      )
  }

  onClearForm() {
    this.clientForm.reset();
  }
}
