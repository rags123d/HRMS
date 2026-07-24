import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddClientService } from 'src/app/shared/http/add-client.service';
import { AddWorkorderService } from 'src/app/shared/http/add-workorder.service';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-client-overview',
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.scss']
})
export class ClientOverviewComponent implements OnInit {
  
  @ViewChild('pagination') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public ListSkip = 0;
  public ListLimit = 10;
  public ListTotal = 0;

  url = this.route.snapshot.params.id;
  DocUrl = environment.baseUrl2

  clientData: any;
  workOrderData: any;
  DashboardDetail: any;

  workOrderColumn: string[] = ['Sl No', 'Action', 'ID', 'Work Order Name', 'Start Date', 'Renewal Date', 'Total Jobs', 'Job Request Pending', 'Hired',];
  workOrderDataSource = new MatTableDataSource()

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private addClientService: AddClientService,
    private addWorkOrderService: AddWorkorderService
  ) { }

  ngOnInit(): void {
    this.workOrderDataSource.paginator = this.paginator;

    this.getClient();
    this.getWorkOrder(this.ListSkip, this.ListLimit);
    this.getDashboardDetails();
  }

  SearchFilter(str: string) {
    var filterArr = this.workOrderData.filter((obj: any) => {
      return obj.name.toLowerCase().includes(str.toLowerCase()) || obj.WorkOrderId.toString().includes(str)
    });

    this.workOrderDataSource = new MatTableDataSource(filterArr)
  }

  getServerData(event?: PageEvent) {
    this.ListSkip = this.paginator.pageIndex * this.paginator.pageSize;
    this.ListLimit = this.paginator.pageSize;
    this.getWorkOrder(event.pageIndex * event.pageSize, event.pageSize);
  }

  getClient() {
    this.showLoaderService.start()
    this.addClientService.getClientById({ id: this.url })
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            sessionStorage.setItem('client', res['data']._id)
            this.clientData = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getWorkOrder(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "id" : this.url,
      "skip": skip,
      "limit": limit
    }
    this.addWorkOrderService.getWorkOrderByClient(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            // this.workOrderData = res['data']
            // this.workOrderDataSource = new MatTableDataSource(this.workOrderData)
            
            this.workOrderData = res['data'].result
            this.ListTotal = res['data'].total;
            
            this.workOrderDataSource = new MatTableDataSource(this.workOrderData);
            this.workOrderDataSource.sort = this.sort;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  deleteWorkOrder(id: string) {
    this.addWorkOrderService.deleteWorkOrder({ 'id': id })
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

  getDashboardDetails() {
    this.showLoaderService.start()
    var params = {
      "id": this.url
    }
    this.addClientService.getClientDashboardById(params)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.DashboardDetail = res['data']
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

}
