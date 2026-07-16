import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { AddClientService } from 'src/app/shared/http/add-client.service';
import { ReportsService } from 'src/app/shared/http/reports.service';
import 'datatables.net';

@Component({
  selector: 'app-clientwise-report',
  templateUrl: './clientwise-report.component.html',
  styleUrls: ['./clientwise-report.component.scss']
})
export class ClientwiseReportComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  allClient: any = [];

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
    this.onGetAllClientwise();
  }


  onGetAllClientwise() {
    this.showLoaderService.start()
    this.reportService.getAllClient()
      .subscribe(
        (res) => {
          //  $('#ClientwiseTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#ClientwiseTable').DataTable().destroy();
            this.allClient = res['data'];
            this.dtTrigger.next();

            setTimeout(() => {
              $('table#ClientwiseTable.dataTable').wrap(
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
