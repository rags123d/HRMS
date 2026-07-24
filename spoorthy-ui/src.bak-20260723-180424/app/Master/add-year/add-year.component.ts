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
import { AddYearService } from 'src/app/shared/http/add-year.service';

@Component({
  selector: 'app-add-year',
  templateUrl: './add-year.component.html',
  styleUrls: ['./add-year.component.scss']
})
export class AddYearComponent implements OnInit {

  allYears: any = [];
  SelectedYear: any;
  createYearForm: FormGroup;

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
    private addYearService: AddYearService
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
    this.createYearForm = new FormGroup({
      Year: new FormControl(null),
    });

    this.onGetAllYears();
  }
  
  onGetAllYears() {
    this.showLoaderService.start()
    this.addYearService.getYear()
      .subscribe(
        (res) => {
          //  $('#YearsTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#YearsTable').DataTable().destroy();
            this.allYears = res['data'];
            this.dtTrigger.next();
  
            setTimeout(() => {
              $('table#YearsTable.dataTable').wrap(
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

  openAddYearsModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createYearForm.reset();

    this.createYearForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddYears() {
    var params = {
      "Year": this.createYearForm.get('Year').value
    }
    this.showLoaderService.start()
    this.addYearService.addYear(params)
      .subscribe(
        (res) => {
          this.ngxService.stop();
  
          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createYearForm.reset();
            this.onGetAllYears();
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

  
  onEditYears(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createYearForm.reset();

    this.createYearForm.setValue(
      element.pick(dataObject, [
        'Year',
      ])
    );

    this.createYearForm.patchValue({
      CreatedAt: this.datePipe.transform(dataObject['CreatedAt'], 'yyyy-MM-dd'),
      ModifiedAt: this.datePipe.transform(
        dataObject['ModifiedAt'],
        'yyyy-MM-dd'
      ),
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }


  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedYear = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteYear() {
    this.ngxService.start();
    this.addYearService.deleteYear({'id': this.SelectedYear})
    .subscribe(
      (res) => {
        this.ngxService.stop();
        this.modalRef.hide();
        if (res['success']) {
          this.toastr.success(
            'Year - ' + this.SelectedYear + ' deleted successfully.'
          );
          this.SelectedYear = undefined;
        } else {
          this.toastr.error(
            'unable to delete Year - ' + this.SelectedYear
          );
        }
        this.onGetAllYears();
      },
      (error) => {
        this.ngxService.stop();
        this.toastr.error(
          'Error while deleteing Year - ' + this.SelectedYear
        );
      }
    );
  }

}
