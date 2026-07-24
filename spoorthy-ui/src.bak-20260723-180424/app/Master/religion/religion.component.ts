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
import { AddReligionService } from 'src/app/shared/http/add-religion.service';

@Component({
  selector: 'app-religion',
  templateUrl: './religion.component.html',
  styleUrls: ['./religion.component.scss']
})
export class ReligionComponent implements OnInit {

  allReligion: any = [];
  SelectedReligion: any;
  createReligionForm: FormGroup;

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
    private addReligionService: AddReligionService
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
    this.createReligionForm = new FormGroup({
      Religion: new FormControl(''),
    });

    this.onGetAllReligion();
  }
  
  onGetAllReligion() {
    this.showLoaderService.start()
    this.addReligionService.getReligion()
      .subscribe(
        (res) => {
          //  $('#ReligionTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#ReligionTable').DataTable().destroy();
            this.allReligion = res['data'];
            this.dtTrigger.next();
  
            setTimeout(() => {
              $('table#ReligionTable.dataTable').wrap(
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

  openAddReligionModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createReligionForm.reset();

    this.createReligionForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddReligion() {
    var params = {
      "id": this.SelectedReligion,
      "name": this.createReligionForm.get('Religion').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addReligionService.addReligion(params) : this.addReligionService.editReligion(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();
  
          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createReligionForm.reset();
            this.onGetAllReligion();
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

  onEditReligion(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createReligionForm.reset();
    this.SelectedReligion = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createReligionForm.patchValue({
      Religion: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedReligion = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteReligion() {
    this.ngxService.start();
    this.addReligionService.deleteReligion({'id': this.SelectedReligion})
    .subscribe(
      (res) => {
        this.ngxService.stop();
        this.modalRef.hide();
        if (res['success']) {
          this.toastr.success(
            'Religion - ' + this.SelectedReligion + ' deleted successfully.'
          );
          this.SelectedReligion = undefined;
        } else {
          this.toastr.error(
            'unable to delete Religion - ' + this.SelectedReligion
          );
        }
        this.onGetAllReligion();
      },
      (error) => {
        this.ngxService.stop();
        this.toastr.error(
          'Error while deleteing Religion - ' + this.SelectedReligion
        );
      }
    );
  }

}
