import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddWorkorderService } from 'src/app/shared/http/add-workorder.service';
import { environment } from 'src/environments/environment';
import { AddClientService } from '../../shared/http/add-client.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-client-overview',
  templateUrl: './allclient-overview.component.html',
  styleUrls: ['./allclient-overview.component.scss']
})
export class AllClientOverviewComponent implements OnInit {

  @ViewChild('pagination') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public searchText;
  public ListSkip = 0;
  public ListLimit = 10;
  public ListTotal = 0;

  clientLength: any;
  allClient: any;
  allWorkOrder: any;
  DashboardDetail: any;

  workOrderArr: any[] = [];
  employeeRequirementArr: any[] = [];
  hiredArr: any[] = [];

  clientColumn: string[] = ['Sl No', 'Action', 'ID', 'Client Name', 'Contact Info', 'Work Orders', 'Employee Requirement', 'Hired', 'Vacancies',];
  clientDataSource = new MatTableDataSource()

  constructor(
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    private addClientService: AddClientService,
    private addWorkOrderService: AddWorkorderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clientDataSource.paginator = this.paginator;

    this.getClient(this.ListSkip, this.ListLimit)
    this.getWorkOrkder();
    this.getDashboardDetails();
    this.InitCall();
  }

  SearchFilter(str: string) {
    var filterArr = this.allClient.filter((obj: any) => {
      return obj.name.toLowerCase().includes(str.toLowerCase())
    });
    this.clientDataSource = new MatTableDataSource(filterArr)
  }

  InitCall() {
    this.ListSkip = 0;
    this.searchText = (this.searchText && this.searchText.length > 0) ? this.searchText : undefined;
    this.getClient(this.ListSkip, this.ListLimit);
  }

  getServerData(event?: PageEvent) {
    this.ListSkip = this.paginator.pageIndex * this.paginator.pageSize;
    this.ListLimit = this.paginator.pageSize;
    this.getClient(event.pageIndex * event.pageSize, event.pageSize);
  }

  FilterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientDataSource.filter = filterValue.trim().toLowerCase();
  }

  getClient(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.addClientService.getPostClient(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.ListTotal = res['data'].total
            this.allClient = res['data'].result;

            this.clientDataSource = new MatTableDataSource(this.allClient);
            this.clientDataSource.sort = this.sort;

            // this.clientLength = res['data'].length
            // this.allClient = res['data']

            console.log(res['data'])
            // this.clientDataSource = new MatTableDataSource(this.allClient)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  deleteClient(id: string) {
    this.addClientService.deleteClient({ 'id': id })
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

  getWorkOrkder() {
    this.showLoaderService.start()
    this.addWorkOrderService.getWorkOrder()
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            // this.allWorkOrder = res['data'].filter((obj: any) => {
            //   return obj.client._id == this.singleClient._id
            // })

            // console.log(this.workOrderData)
            // this.workOrderDataSource = new MatTableDataSource(this.workOrderData)
            
            this.allClient.forEach((client: any, i) => {
              var counter = 0;
              var counter2 = 0;
              var counter3 = 0;
              res['data'].forEach((workorder: any) => {
                if(client._id == workorder.client._id){
                  counter = counter + 1
                  counter2 = counter2 + workorder.noOfRequirements
                  counter3 = workorder.noOfRequirements - workorder.hired
                }
              });
              this.workOrderArr.push(counter)
              this.employeeRequirementArr.push(counter2)
              this.hiredArr.push(counter3)
            });
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getDashboardDetails(){
    this.showLoaderService.start()
    this.addClientService.getAllClientDashboard()
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
