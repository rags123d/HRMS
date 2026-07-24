import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ReportsService } from 'src/app/shared/http/reports.service';

@Component({
  selector: 'app-unit-branchwise-report',
  templateUrl: './unit-branchwise-report.component.html',
  styleUrls: ['./unit-branchwise-report.component.scss']
})
export class UnitBranchwiseReportComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  allWORoles: any = [];
  
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
    this.onGetAllWorkOrderRokes();
  }

  
  onGetAllWorkOrderRokes() {
    this.showLoaderService.start()
    this.reportService.getWorkOrderRoles()
      .subscribe(
        (res) => {
          //  $('#unitBranchTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#unitBranchTable').DataTable().destroy();
            this.allWORoles = res['data'];            
            this.dtTrigger.next();
  
            setTimeout(() => {
              $('table#unitBranchTable.dataTable').wrap(
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
