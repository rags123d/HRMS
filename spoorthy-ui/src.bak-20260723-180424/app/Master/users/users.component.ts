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
import { AddUserService } from 'src/app/shared/http/add-user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  allUser: any = [];
  SelectedUser: any;
  createUserForm: FormGroup;

  formSubmitted: boolean = false;
  formEdit: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  fileName: string;
  modalRef: BsModalRef;

  isShowPass = false;
  allUserRole: any = [];
  filteredUserRole: any = [];
  allGender: any = [];
  filteredGender: any = [];

  constructor(
    private browserStorageService: BrowserstorageService,
    private modalService: BsModalService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private showLoaderService: NgxUiLoaderService,
    private addUserService: AddUserService
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
    this.createUserForm = new FormGroup({
      UserName: new FormControl("", [Validators.required]),
      Password: new FormControl("", [Validators.required, Validators.pattern("^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$")]),
      FirstName: new FormControl("", [Validators.required]),
      LastName: new FormControl(""),
      Gender: new FormControl("", [Validators.required]),
      RoleName: new FormControl("", [Validators.required]),
      Mobile: new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]),
      Email: new FormControl('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      Age: new FormControl("", [Validators.required, Validators.pattern("[0-9]{2}")]),
      PresentAddress: new FormControl("", [Validators.required]),
      PermanentAddress: new FormControl(""),
    });

    this.onGetAllUser();
    this.onGetAllUserRole();
    this.onGetAllGender();
  }

  onGetAllUser() {
    this.showLoaderService.start()
    this.addUserService.getUser()
      .subscribe(
        (res) => {
          //  $('#UserTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#UserTable').DataTable().destroy();
            this.allUser = res['data'];
            this.allUser.forEach((ele: any) => {
              if (ele["userName"])
                ele["userName"] = (atob(ele["userName"]));
            })
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#UserTable.dataTable').wrap(
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

  openAddUserModal(template: TemplateRef<any>) {
    this.formEdit = false;
    this.formSubmitted = false;
    this.createUserForm.reset();

    this.createUserForm.patchValue({
      CreatedBy: this.browserStorageService.loggedInUser,
      ModifiedBy: this.browserStorageService.loggedInUser,
    });
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onAddUser() {
    let formvalue = this.createUserForm.value;
    var params = {
      // "id": this.SelectedUser,
      "userName": formvalue.UserName,
      "firstName": formvalue.FirstName,
      "lastName": formvalue.LastName,
      "gender": formvalue.Gender,
      "role": formvalue.RoleName,
      "mobile": formvalue.Mobile,
      "email": formvalue.Email ? formvalue.Email : '',
      "age": formvalue.Age,
      "presentAddress": formvalue.PresentAddress,
      "permanentAddress": formvalue.PermanentAddress
    }
    if( this.formEdit == true ){
      params['id'] = this.SelectedUser
    }
    else {
      params["password"] = formvalue.Password
    }
    this.showLoaderService.start();
    (this.formEdit != true ? this.addUserService.addUser(params) : this.addUserService.editUser(params))
      .subscribe(
        (res) => {
          this.ngxService.stop();

          if (res['success']) {
            this.modalRef.hide();
            this.toastr.success('Request completed successfully!');
            this.createUserForm.reset();
            this.onGetAllUser();
            this.formEdit = false;
            this.formSubmitted = false;
          } else {
            this.toastr.error(res['message']);
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      )
  }


  onEditUser(template: TemplateRef<any>, dataObject) {
    this.formEdit = true;
    this.formSubmitted = false;
    this.createUserForm.reset();
    this.SelectedUser = dataObject["_id"] ? dataObject["_id"] : -1;

    this.createUserForm.patchValue({
      UserName: dataObject['userName'],
      Password: 'Admin@123',
      FirstName: dataObject['firstName'],
      LastName: dataObject['lastName'],
      Gender: dataObject['gender']._id,
      RoleName: dataObject['role']._id,
      Mobile: dataObject['mobile'],
      Email: dataObject['email'],
      Age: dataObject['age'],
      PresentAddress: dataObject['presentAddress'],
      PermanentAddress: dataObject['permanentAddress']
    });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteAlert(template: TemplateRef<any>, selectedId) {
    this.SelectedUser = selectedId ? selectedId : -1;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  onDeleteUser() {
    this.ngxService.start();
    this.addUserService.deleteUser({ 'id': this.SelectedUser })
      .subscribe(
        (res) => {
          this.ngxService.stop();
          this.modalRef.hide();
          if (res['success']) {
            this.toastr.success(
              'User - ' + this.SelectedUser + ' deleted successfully.'
            );
            this.SelectedUser = undefined;
          } else {
            this.toastr.error(
              'unable to delete User - ' + this.SelectedUser
            );
          }
          this.onGetAllUser();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(
            'Error while deleteing User - ' + this.SelectedUser
          );
        }
      );
  }

  onGetAllUserRole() {
    this.showLoaderService.start()
    this.addUserService.getUserRole()
      .subscribe(res => {
        // this.filteredUserRole = this.allUserRole  = res;
        if (res['success']) {
          this.filteredUserRole = this.allUserRole = res["data"];
        } else {
          this.toastr.error("Error getting data.");
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop(); });
  }

  onGetAllGender() {
    this.showLoaderService.start()
    this.addUserService.getGender()
      .subscribe(res => {
        // this.filteredUserRole = this.allUserRole  = res;
        if (res['success']) {
          this.filteredGender = this.allGender = res["data"];
        } else {
          this.toastr.error("Error getting data.");
        }
        this.ngxService.stop();
      },
        (error) => { this.ngxService.stop(); });
  }

  onSearchUserRole(event) {
    if (event.target.value) {
      const val = event.target.value.toLowerCase();
      this.filteredUserRole = this.allUserRole.filter(function (d) {
        return d.Name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else
      if (this.filteredUserRole != this.allUserRole) {
        this.filteredUserRole = this.allUserRole;
      }
  }

}
