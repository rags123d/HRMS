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
import { AddCourseService } from 'src/app/shared/http/add-course.service';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  allCourse: any = [];
  SelectedCourse: any;
  createCourseForm: FormGroup;

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
    private addCourseService: AddCourseService
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
    this.createCourseForm = new FormGroup({
      Course: new FormControl(''),
    });

    this.onGetAllCourse();
  }
  
  onGetAllCourse() {
    this.showLoaderService.start()
    this.addCourseService.getCourse()
      .subscribe(
        (res) => {
          //  $('#CourseTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#CourseTable').DataTable().destroy();
            this.allCourse = res['data'];
            this.dtTrigger.next();
  
            setTimeout(() => {
              $('table#CourseTable.dataTable').wrap(
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

  openAddCourseModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createCourseForm.reset();

    this.createCourseForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddCourse() {
    var params = {
      "id": this.SelectedCourse,
      "name": this.createCourseForm.get('Course').value
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addCourseService.addCourse(params) : this.addCourseService.editCourse(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();
  
          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createCourseForm.reset();
            this.onGetAllCourse();
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

  
  onEditCourse(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createCourseForm.reset();
    this.SelectedCourse = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createCourseForm.patchValue({
      Course: dataObject['name']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedCourse = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteCourse() {
    this.ngxService.start();
    this.addCourseService.deleteCourse({'id': this.SelectedCourse})
    .subscribe(
      (res) => {
        this.ngxService.stop();
        this.modalRef.hide();
        if (res['success']) {
          this.toastr.success(
            'Course - ' + this.SelectedCourse + ' deleted successfully.'
          );
          this.SelectedCourse = undefined;
        } else {
          this.toastr.error(
            'unable to delete Course - ' + this.SelectedCourse
          );
        }
        this.onGetAllCourse();
      },
      (error) => {
        this.ngxService.stop();
        this.toastr.error(
          'Error while deleteing Course - ' + this.SelectedCourse
        );
      }
    );
  }

}
