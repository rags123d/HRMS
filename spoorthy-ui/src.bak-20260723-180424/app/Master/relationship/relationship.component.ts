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
import { AddRelationshipService } from 'src/app/shared/http/add-relationship.service';


@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})
export class RelationshipComponent implements OnInit {

  allRelationship: any = [];
  SelectedRelationship: any;
  createRelationshipForm: FormGroup;

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
    private addRelationshipService: AddRelationshipService
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
    this.createRelationshipForm = new FormGroup({
      Relationship: new FormControl(''),
    });

    this.onGetAllRelationship();
  }

  onGetAllRelationship() {
    this.showLoaderService.start()
    this.addRelationshipService.getRelationship()
      .subscribe(
        (res) => {
          //  $('#RelationshipTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#RelationshipTable').DataTable().destroy();
            this.allRelationship = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#RelationshipTable.dataTable').wrap(
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

  openAddRelationshipModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createRelationshipForm.reset();

    this.createRelationshipForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddRelationship() {
    var params = {
      "id": this.SelectedRelationship,
      "name": this.createRelationshipForm.get('Relationship').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addRelationshipService.addRelationship(params) : this.addRelationshipService.editRelationship(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createRelationshipForm.reset();
            this.onGetAllRelationship();
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


  onEditRelationship(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createRelationshipForm.reset();
    this.SelectedRelationship = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createRelationshipForm.patchValue({
      Relationship: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  
  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedRelationship = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }
  onDeleteRelationship() {
    this.ngxService.start();
    this.addRelationshipService.deleteRelationship({ 'id': this.SelectedRelationship })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          this.modalRef.hide();
          if (res['success']) {
            this.toastr.success(
              'Relationship - ' + this.SelectedRelationship + ' deleted successfully.'
            );
            this.SelectedRelationship = undefined;
          } else {
            this.toastr.error(
              'unable to delete Relationship - ' + this.SelectedRelationship
            );
          }
          this.onGetAllRelationship();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(
            'Error while deleteing Relationship - ' + this.SelectedRelationship
          );
        }
      );
  }


}
