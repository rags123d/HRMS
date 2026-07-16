import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { AddReligionService } from 'src/app/shared/http/add-religion.service';
import { CommonserviceService } from 'src/app/shared/http/commonservice.service';
declare var $: any;

@Component({
  selector: 'app-bulk-approval',
  templateUrl: './bulk-approval.component.html',
  styleUrls: ['./bulk-approval.component.scss']
})
export class BulkApprovalComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();

  GMapprovalList: any;
  MDapprovalList: any;
  public selectedPageIndex = 0;
  public userName: any;
  public userDetails: any = '';

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private addReligionService: AddReligionService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private commonService: CommonserviceService
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
    this.userName = JSON.parse(sessionStorage.getItem('userDetails'))

    if (sessionStorage.getItem('userDetails') != null)
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    this.dtTrigger1.next();
    this.dtTrigger2.next();
    this.onGetGMApprovalList();
  }

  onTabChanged(event: any) {
    // this.selectedPageIndex = event.index;
    if (event.index === 0) {
      this.onGetGMApprovalList();
    } else if (event.index === 1) {
      this.onGetMDApprovalList();
    }
  }

  onGetGMApprovalList() {
    this.showLoaderService.start()
    this.addReligionService.getGMApprovalList()
      .subscribe(
        (res) => {
          //  $('#GMApprovalTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#GMApprovalTable').DataTable().destroy();
            this.GMapprovalList = res['data'];
            this.dtTrigger1.next();

            setTimeout(() => {
              $('table#GMApprovalTable.dataTable').wrap(
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

  onGetMDApprovalList() {
    this.showLoaderService.start()
    this.addReligionService.getMDApprovalList()
      .subscribe(
        (res) => {
          //  $('#MDApprovalTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#MDApprovalTable').DataTable().destroy();
            this.MDapprovalList = res['data'];
            this.dtTrigger2.next();

            setTimeout(() => {
              $('table#MDApprovalTable.dataTable').wrap(
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

  GMApproval(isApproved, itemId: string) {
    let URL = `/GMApprovalList`;
    var params = {
      "id": itemId,
      "ApprovedByGM": isApproved,
    }
    this.showLoaderService.start()
    this.commonService.onCommonPost(params, URL)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            this.onGetGMApprovalList();
          }
          else {
            this.toastr.error(res['message']);
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

  MDApproval(isApproved, itemId: string) {
    let URL = `/MDApprovalList`;
    var params = {
      "id": itemId,
      "ApprovedByMD": isApproved,
    }
    this.showLoaderService.start()
    this.commonService.onCommonPost(params, URL)
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            this.onGetMDApprovalList();
          }
          else {
            this.toastr.error(res['message']);
          }
        },
        err => {
          this.showLoaderService.stop()
          console.error(err)
        }
      )
  }

}
