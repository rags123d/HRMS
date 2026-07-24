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
import { AddStructureService } from 'src/app/shared/http/add-structure.service';

@Component({
  selector: 'app-salary-structure',
  templateUrl: './salary-structure.component.html',
  styleUrls: ['./salary-structure.component.scss']
})
export class SalaryStructureComponent implements OnInit {

  allStructure: any = [];
  SelectedStructure: any;
  createStructureForm: FormGroup;

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
    private addStructureService: AddStructureService
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
    this.createStructureForm = new FormGroup({
      Structure: new FormControl(''),
    });

    this.onGetAllStructure();
  }

  onGetAllStructure() {
    this.showLoaderService.start()
    this.addStructureService.getStructure()
      .subscribe(
        (res) => {
          //  $('#StructureTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#StructureTable').DataTable().destroy();
            this.allStructure = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#StructureTable.dataTable').wrap(
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

  openAddStructureModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createStructureForm.reset();

    this.createStructureForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddStructure() {
    var params = {
      "id": this.SelectedStructure,
      "name": this.createStructureForm.get('Structure').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addStructureService.addStructure(params) : this.addStructureService.editStructure(params))
    // this.addStructureService.addStructure(params)
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createStructureForm.reset();
            this.onGetAllStructure();
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

  onEditStructure(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createStructureForm.reset();
    this.SelectedStructure = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createStructureForm.patchValue({
      Structure: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedStructure = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteStructure() {
    this.ngxService.start();
    this.addStructureService.deleteStructure({ 'id': this.SelectedStructure })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          this.modalRef.hide();
          if (res['success']) {
            this.toastr.success(
              'Structure - ' + this.SelectedStructure + ' deleted successfully.'
            );
            this.SelectedStructure = undefined;
          } else {
            this.toastr.error(
              'unable to delete Structure - ' + this.SelectedStructure
            );
          }
          this.onGetAllStructure();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(
            'Error while deleteing Structure - ' + this.SelectedStructure
          );
        }
      );
  }

}
