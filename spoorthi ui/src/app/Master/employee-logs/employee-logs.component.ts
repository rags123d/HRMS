import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';

@Component({
  selector: 'app-employee-logs',
  templateUrl: './employee-logs.component.html',
  styleUrls: ['./employee-logs.component.scss']
})
export class EmployeeLogsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  empLogs: any;

  constructor(
    private commonService: CommonserviceService,
    private ngxService: NgxUiLoaderService,
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    private getLogs: AddEmployeeService
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
    this.onGetAllLogs();
  }

  onGetAllLogs() {
    this.showLoaderService.start()
    this.getLogs.getEmployeeLogs()
      .subscribe(
        (res) => {
          //  $('#YearsTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#YearsTable').DataTable().destroy();
            this.empLogs = res['data'];
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

}
