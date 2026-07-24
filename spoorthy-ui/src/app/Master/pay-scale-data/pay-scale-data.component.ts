import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { PayscalfixationService } from 'src/app/shared/http/payscalfixation.service';

@Component({
  selector: 'app-pay-scale-data',
  templateUrl: './pay-scale-data.component.html',
  styleUrls: ['./pay-scale-data.component.scss']
})
export class PayScaleDataComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  allFixationData: any;
  
  constructor( 
    private showLoaderService: NgxUiLoaderService,
    private payscaleFixationService: PayscalfixationService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService
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
    this.onGetAllPayscale();
  }

  onGetAllPayscale() {
    this.showLoaderService.start()
    this.payscaleFixationService.getPayscaleFixation()
      .subscribe(
        (res) => {
          //  $('#PayscaleTable').DataTable().destroy();
          if (res['success'] == true) {
            $('#PayscaleTable').DataTable().destroy();
            this.allFixationData = res['data'];
            this.dtTrigger.next();
  
            setTimeout(() => {
              $('table#PayscaleTable.dataTable').wrap(
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


  deleteFixation(id: string) {
    this.payscaleFixationService.deletePayscaleFixation({ 'id': id })
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.toastr.success(res['message'], '', {
              timeOut: 5000,
            });
            window.location.reload();
          }
        },
        error => {
          console.error(error);
        }
      )
  }
  
}
