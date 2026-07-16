import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserstorageService } from 'src/app/shared/non-http/browserstorage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import * as element from 'lodash';
import { DatePipe } from '@angular/common';
import { AddDesignationService } from 'src/app/shared/http/add-Designation.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

  @ViewChild('excelInput') excelInput: any;

  allDesignation: any = [];
  SelectedDesignation: any;
  createDesignationForm: FormGroup;

  formSubmitted: boolean = false;
  formEdit: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  fileName: string;
  modalRef: BsModalRef;

  constructor(
    private browserStorageService: BrowserstorageService,
    private modalService: BsModalService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private showLoaderService: NgxUiLoaderService,
    private addDesignationService: AddDesignationService
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
    this.createDesignationForm = new FormGroup({
      Designation: new FormControl(''),
    });

    this.onGetAllDesignation();
  }

  onGetAllDesignation() {
    this.showLoaderService.start()
    this.addDesignationService.getDesignation()
      .subscribe(
        (res) => {
          //  $('#DesignationTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#DesignationTable').DataTable().destroy();
            this.allDesignation = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#DesignationTable.dataTable').wrap(
                "<div class='scrolledTable'></div>"
              );
              this.ngxService.stop();
            }, 150);
          } else {
            this.toastr.error('Error getting data.');
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }

  openAddDesignationModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createDesignationForm.reset();

    this.createDesignationForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddDesignation() {
    var params = {
      "id": this.SelectedDesignation,
      "name": this.createDesignationForm.get('Designation').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addDesignationService.addDesignation(params) : this.addDesignationService.editDesignation(params))
      // this.addDesignationService.addDesignation(params)
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createDesignationForm.reset();
            this.onGetAllDesignation();
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

  onEditDesignation(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createDesignationForm.reset();
    this.SelectedDesignation = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createDesignationForm.patchValue({
      Designation: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedDesignation = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteDesignation() {
    this.ngxService.start();
    this.addDesignationService.deleteDesignation({ 'id': this.SelectedDesignation })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          this.modalRef.hide();
          if (res['success']) {
            this.toastr.success(
              'Designation - ' + this.SelectedDesignation + ' deleted successfully.'
            );
            this.SelectedDesignation = undefined;
          } else {
            this.toastr.error(
              'unable to delete Designation - ' + this.SelectedDesignation
            );
          }
          this.onGetAllDesignation();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(
            'Error while deleteing Designation - ' + this.SelectedDesignation
          );
        }
      );
  }

  onUploadExcel() {
    this.excelInput.nativeElement.value = null;
    this.excelInput.nativeElement.click();
  }

  onExcelSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.toastr.error('Only .xlsx Excel files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.showLoaderService.start();

    this.addDesignationService.bulkUploadDesignation(formData)
      .subscribe(
        (res: any) => {
          this.showLoaderService.stop();

          if (res.success) {
            this.toastr.success(res.message || 'Bulk upload completed');
            this.onGetAllDesignation();
          } else {
            this.toastr.error(res.message || 'Bulk upload failed');
          }
        },
        () => {
          this.showLoaderService.stop();
          this.toastr.error('Error while uploading Excel');
        }
      );
  }


}
