import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';

@Component({
  selector: 'app-jobrole-details',
  templateUrl: './jobrole-details.component.html',
  styleUrls: ['./jobrole-details.component.scss']
})
export class JobroleDetailsComponent implements OnInit {

  allJobRoleData: any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private showLoaderService: NgxUiLoaderService,
    private addEmployeeService: AddEmployeeService,
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

    this.onGetAllJobRoleDashboard();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onGetAllJobRoleDashboard() {
    this.showLoaderService.start()
    this.addEmployeeService.getAllJobRoleDashboard()
      .subscribe(
        (res) => {
          //  $('#jobRoleWiseInfoTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#jobRoleWiseInfoTable').DataTable().destroy();
            this.allJobRoleData = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#jobRoleWiseInfoTable.dataTable').wrap(
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

}
