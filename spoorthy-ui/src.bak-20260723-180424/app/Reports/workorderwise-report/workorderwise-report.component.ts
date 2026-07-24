import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ReportsService } from 'src/app/shared/http/reports.service';

@Component({
  selector: 'app-workorderwise-report',
  templateUrl: './workorderwise-report.component.html',
  styleUrls: ['./workorderwise-report.component.scss']
})
export class WorkorderwiseReportComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  allWorkOrder: any = [];

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private reportService: ReportsService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
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
    this.onGetAllWorkOrderwise();
  }


  onGetAllWorkOrderwise() {
    this.showLoaderService.start()
    this.reportService.getAllWorkOrder()
      .subscribe(
        (res) => {
          //  $('#WorkorderwiseTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#WorkorderwiseTable').DataTable().destroy();
            this.allWorkOrder = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#WorkorderwiseTable.dataTable').wrap(
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
