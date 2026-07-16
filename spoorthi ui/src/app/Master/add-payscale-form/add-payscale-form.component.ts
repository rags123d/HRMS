import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { AddStructureService } from 'src/app/shared/http/add-Structure.service';
import { PayscalfixationService } from 'src/app/shared/http/payscalfixation.service';

@Component({
  selector: 'app-add-payscale-form',
  templateUrl: './add-payscale-form.component.html',
  styleUrls: ['./add-payscale-form.component.scss']
})
export class AddPayscaleFormComponent implements OnInit {

  public url = this.route.snapshot.params.id

  formSubmitted: boolean = false;
  formEdit: boolean = false;

  modalRef: BsModalRef;

  allPayScale: any = [];
  payScaleForm: FormGroup;

  public Workorder: any[];
  public WorkOrderRole: any[];
  public WODATA: any[];
  selectedValue: string[] = [];
  selectedDeductionValue: string[] = [];
  salaryData: any;
  Result: number = 0;
  NetGrossSal: number = 0;
  clientInfo: any;
  WOLocation: any;
  WOSalary: any;
  selectedESIBased = "";

  constructor(
    private modalService: BsModalService,
    private showLoaderService: NgxUiLoaderService,
    private addEmployeeService: AddEmployeeService,
    private addStructureService: AddStructureService,
    private payscaleFixationService: PayscalfixationService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.payScaleForm = new FormGroup({
      'WorkOrder': new FormControl('', [Validators.required]),
      'WorkOrderRole': new FormControl('', [Validators.required]),

      'GrossSalary': new FormControl(null, [Validators.required, Validators.pattern('^[0-9.]*$')]),
      'NetSalary': new FormControl(null, [Validators.required, Validators.pattern('^[0-9.]*$')]),
      'DeductedSalary': new FormControl(null, [Validators.pattern('^[0-9.]*$')]),

      'benefitType': new FormControl(null),
      'BasicVDA': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'Gratuity': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'MedicalAllowance': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'RelieverCharges': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'Bonus': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'HRA': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'NationalFestivalHolidays': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'Conveyance': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'LeaveWithWages': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'WashingAllowance': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'SpecialAllowance': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),

      'deductionType': new FormControl(null),
      'PFAmount': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'ESIAmount': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
      'ProfessionalTax': new FormControl('0', [Validators.pattern('^[0-9.]*$')]),
    })
    this.getWorkorder();
    this.getAllStructure();

    if (this.url !== undefined) {
      this.getpayscaleFixation(this.url)
    }
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

  filterWorkOrderRole(id: any) {
    this.payScaleForm.controls.WorkOrderRole.setValue('')
    this.Workorder.find((obj: any) => {
      if (obj._id == id)
        return this.WorkOrderRole = obj.workOrderRoles;
    })

    this.Workorder.find((obj: any) => {
      if (obj._id == id)
        return this.clientInfo = obj;
    })
  }

  filterWorkLocation(id: any) {
    let Workorder = this.payScaleForm.get('WorkOrder')?.value;

    this.Workorder.find((obj: any) => {
      if (obj._id == Workorder)
        return this.WODATA = obj.workOrderRoles.filter((item: any) => item._id == id);
    })

    this.WOLocation = this.WODATA[0]?.siteAddress ? this.WODATA[0]?.siteAddress : '';
    this.WOSalary = this.WODATA[0]?.salary ? this.WODATA[0]?.salary : '';

  }

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

  setNetAmount() {
    let grossAmount = +(this.payScaleForm.value.GrossSalary ? this.payScaleForm.value.GrossSalary : 0);
    let ddcAmount = +(this.payScaleForm.value.DeductedSalary ? this.payScaleForm.value.DeductedSalary : 0);

    let NetTotal = grossAmount - ddcAmount;
    let resNetTotal = Math.round(NetTotal);
    this.payScaleForm.controls['NetSalary'].patchValue(resNetTotal.toFixed(2));
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
    this.payScaleForm.controls['GrossSalary'].patchValue(retot.toFixed(2));
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
    this.payScaleForm.controls['DeductedSalary'].patchValue(retot.toFixed(2));
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
    let basicVDA = this.payScaleForm.controls['BasicVDA'].value;
    this.Result = ((+basicVDA) > 0 ? (+basicVDA) : 0);

    let netGrossSal = this.payScaleForm.controls['GrossSalary'].value;
    this.NetGrossSal = ((+netGrossSal) > 0 ? (+netGrossSal) : 0);

    let PF = this.Result * 0.12;
    let resPF = Math.round(PF);
    this.payScaleForm.controls['PFAmount'].patchValue(resPF.toFixed(2));

    var basicVDAsal = 0;

    if (this.selectedESIBased === 'BASICVDA') {
      let ESI = this.Result * 0.0075;
      let resESI = Math.round(ESI);
      if (basicVDA <= 21000) {
        this.payScaleForm.controls['ESIAmount'].patchValue(resESI.toFixed(2));
      }
      else {
        this.payScaleForm.controls['ESIAmount'].patchValue(basicVDAsal.toFixed(2));
      }
    }
    else if (this.selectedESIBased === 'NETSAL') {
      let ESI = this.NetGrossSal * 0.0075;
      let resESI = Math.round(ESI);
      if (basicVDA <= 21000) {
        this.payScaleForm.controls['ESIAmount'].patchValue(resESI.toFixed(2));
      }
      else {
        this.payScaleForm.controls['ESIAmount'].patchValue(basicVDAsal.toFixed(2));
      }
    }

    var PTFixSal = 200.00;
    var PTFixSal1 = 0.00;

    let PT = this.Result >= 15000;
    if (PT) {
      this.payScaleForm.controls['ProfessionalTax'].patchValue(PTFixSal.toFixed(2));
    }
    else {
      this.payScaleForm.controls['ProfessionalTax'].patchValue(PTFixSal1.toFixed(2));
    }
    this.findDeductionTotal();
  }

  changeOf(event) {
    if (event.source.selected) {
      console.log('selectedValue', this.selectedValue)
      console.log('selectedDeductionValue', this.selectedDeductionValue)
    }
  }

  selectESIBasedOn(targetType: string, event) {
    if (event.target.checked == true) {
      this.selectedESIBased = targetType;
    }
    else if (event.target.checked == false) {
      this.selectedESIBased = '';
    }
  }

  onAddPayScale() {
    var params = {
      // "id": this.SelectedCourse,
      "WorkOrder": this.payScaleForm.get('WorkOrder').value,
      "WorkOrderRole": this.payScaleForm.get('WorkOrderRole').value,
      "benefitType": JSON.stringify(this.selectedValue),
      "BasicVDA": this.payScaleForm.get('BasicVDA').value,
      "Gratuity": this.payScaleForm.get('Gratuity').value,
      "MedicalAllowance": this.payScaleForm.get('MedicalAllowance').value,
      "RelieverCharges": this.payScaleForm.get('RelieverCharges').value,
      "Bonus": this.payScaleForm.get('Bonus').value,
      "HRA": this.payScaleForm.get('HRA').value,
      "NationalFestivalHolidays": this.payScaleForm.get('NationalFestivalHolidays').value,
      "Conveyance": this.payScaleForm.get('Conveyance').value,
      "LeaveWithWages": this.payScaleForm.get('LeaveWithWages').value,
      "WashingAllowance": this.payScaleForm.get('WashingAllowance').value,
      "SpecialAllowance": this.payScaleForm.get('SpecialAllowance').value,
      "deductionType": JSON.stringify(this.selectedDeductionValue),
      "PFAmount": this.payScaleForm.get('PFAmount').value,
      "ESIAmount": this.payScaleForm.get('ESIAmount').value,
      "ProfessionalTax": this.payScaleForm.get('ProfessionalTax').value,
      "GrossSalary": this.payScaleForm.get('GrossSalary').value,
      "NetSalary": this.payScaleForm.get('NetSalary').value,
      "DeductedSalary": this.payScaleForm.get('DeductedSalary').value,
      "ESIBasedOn": this.selectedESIBased
    }

    this.showLoaderService.start();
    (this.formEdit != true ? this.payscaleFixationService.addPayscaleFixation(params) : this.payscaleFixationService.editPayscaleFixation(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (this.payScaleForm.value.GrossSalary > this.WOSalary) {
            this.toastr.error("Gross Salary shouldn't be greater than WorkOrder Salary!")
            return;
          }

          if (res['success']) {
            this.toastr.success('Request completed successfully!');
            this.router.navigate(['/master/payscale-data']);
            this.payScaleForm.reset();
            this.formEdit = false;
            this.formSubmitted = false;
          } else {
            this.toastr.error(res['ErrorMessage']);
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      )
  }


  getpayscaleFixation(url: string) {
    this.showLoaderService.start()
    this.payscaleFixationService.getPayscaleFixation()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            const data = res['data'].filter((data: any) => {
              return data._id === url
            })

            this.payScaleForm.controls.WorkOrder.setValue(data[0].WorkOrder?._id)
            this.payScaleForm.controls.WorkOrderRole.setValue(data[0].WorkOrderRole?._id)
            // this.payScaleForm.controls.benefitType.setValue(data[0].benefitType)
            this.selectedValue = JSON.parse(data[0].benefitType)
            this.payScaleForm.controls.BasicVDA.setValue(data[0].BasicVDA)
            this.payScaleForm.controls.Gratuity.setValue(data[0].Gratuity)
            this.payScaleForm.controls.MedicalAllowance.setValue(data[0].MedicalAllowance)
            this.payScaleForm.controls.RelieverCharges.setValue(data[0].RelieverCharges)
            this.payScaleForm.controls.Bonus.setValue(data[0].Bonus)
            this.payScaleForm.controls.HRA.setValue(data[0].HRA)
            this.payScaleForm.controls.NationalFestivalHolidays.setValue(data[0].NationalFestivalHolidays)
            this.payScaleForm.controls.Conveyance.setValue(data[0].Conveyance)
            this.payScaleForm.controls.LeaveWithWages.setValue(data[0].LeaveWithWages)
            this.payScaleForm.controls.WashingAllowance.setValue(data[0].WashingAllowance)
            this.payScaleForm.controls.SpecialAllowance.setValue(data[0].SpecialAllowance)
            // this.payScaleForm.controls.deductionType.setValue(data[0].deductionType)
            this.selectedDeductionValue = JSON.parse(data[0].deductionType)
            this.payScaleForm.controls.PFAmount.setValue(data[0].PFAmount)
            this.payScaleForm.controls.ESIAmount.setValue(data[0].ESIAmount)
            this.payScaleForm.controls.ProfessionalTax.setValue(data[0].ProfessionalTax)
            this.payScaleForm.controls.GrossSalary.setValue(data[0].GrossSalary)
            this.payScaleForm.controls.NetSalary.setValue(data[0].NetSalary)
            this.payScaleForm.controls.DeductedSalary.setValue(data[0].DeductedSalary)
            this.payScaleForm.controls.ESIBasedOn.setValue(data[0].ESIBasedOn)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  // onEditCourse(template: TemplateRef<any>, dataObject) {
  //   this.formEdit = true;
  //   this.formSubmitted = false;
  //   this.payScaleForm.reset();
  //   this.SelectedCourse = dataObject["_id"] ? dataObject["_id"] : -1;

  //   this.payScaleForm.patchValue({
  //     Course: dataObject['name']
  //   });

  //   this.modalRef = this.modalService.show(template, {
  //     class: 'modal-lg',
  //     backdrop: 'static',
  //     keyboard: false,
  //   });
  // }

}
