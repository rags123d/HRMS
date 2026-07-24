import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserstorageService } from 'src/app/shared/non-http/browserstorage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import * as element from 'lodash';
import { DatePipe } from '@angular/common';
import { AddLanguagesService } from 'src/app/shared/http/add-languages.service';


@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  allLanguage: any = [];
  SelectedLanguage: any;
  createLanguageForm: FormGroup;

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
    private addLanguageService: AddLanguagesService
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
    this.createLanguageForm = new FormGroup({
      Language: new FormControl(''),
    });

    this.onGetAllLanguage();
  }

  onGetAllLanguage() {
    this.showLoaderService.start()
    this.addLanguageService.getLanguage()
      .subscribe(
        (res) => {
          //  $('#LanguageTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#LanguageTable').DataTable().destroy();
            this.allLanguage = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#LanguageTable.dataTable').wrap(
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

  openAddLanguageModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createLanguageForm.reset();

    this.createLanguageForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddLanguage() {
    var params = {
      "id": this.SelectedLanguage,
      "name": this.createLanguageForm.get('Language').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addLanguageService.addLanguage(params) : this.addLanguageService.editLanguage(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createLanguageForm.reset();
            this.onGetAllLanguage();
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

  onEditLanguage(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createLanguageForm.reset();
    this.SelectedLanguage = dataObject["_id"] ? dataObject["_id"] : -1;
 
    this.createLanguageForm.patchValue({
      Language: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedLanguage = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteLanguage() {
    this.ngxService.start();
    this.addLanguageService.deleteLanguage({ 'id': this.SelectedLanguage })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          this.modalRef.hide();
          if (res['success']) {
            this.toastr.success(
              'Language - ' + this.SelectedLanguage + ' deleted successfully.'
            );
            this.SelectedLanguage = undefined;
          } else {
            this.toastr.error(
              'unable to delete Language - ' + this.SelectedLanguage
            );
          }
          this.onGetAllLanguage();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(
            'Error while deleteing Language - ' + this.SelectedLanguage
          );
        }
      );
  }

}
