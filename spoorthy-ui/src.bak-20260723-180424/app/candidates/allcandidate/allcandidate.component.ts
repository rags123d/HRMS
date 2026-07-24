import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allcandidate',
  templateUrl: './allcandidate.component.html',
  styleUrls: ['./allcandidate.component.scss']
})
export class AllcandidateComponent implements OnInit {

  @ViewChild('pagination') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public FilterVal = '';
  public searchText;
  public ListSkip = 0;
  public ListLimit = 10;
  public ListTotal = 0;
  public Status = "";

  employeeColumn: string[] = ['Sl No', 'Action', 'ID', 'Candidate Name', 'Client - Work Order Info', 'Status', 'Last Updated On',];
  public employeeDataSource = new MatTableDataSource([])

  public employeeData: any;
  public clientData: any;
  public DashboardDetail: any;
  fromDate: any;
  toDate: any;

  constructor(
    private addEmployeeService: AddEmployeeService,
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.employeeDataSource.paginator = this.paginator;

    this.getEmployee(this.ListSkip, this.ListLimit);
    this.getClient();
    this.getDashboardDetails();
    this.InitCall();
  }

  SearchFilter(str: string) {
    var filterArr = this.employeeData.filter((obj: any) => {
      return obj.FullName.toLowerCase().includes(str.toLowerCase()) || obj.PresentAddressPhone.includes(str) ||
        obj.WorkOrder.client.name.toLowerCase().includes(str.toLowerCase())
    });
    this.employeeDataSource = new MatTableDataSource(filterArr)
  }

  InitCall() {
    this.ListSkip = 0;
    this.searchText = (this.searchText && this.searchText.length > 0) ? this.searchText : undefined;
    if (this.fromDate == undefined || this.toDate == undefined) {
      this.getEmployee(this.ListSkip, this.ListLimit);
    }
    else if (this.fromDate != '' || this.toDate != '')  {
      this.getEmployeeFilter(this.ListSkip, this.ListLimit);
    }
  }

  getServerData(event?: PageEvent) {
    this.ListSkip = this.paginator.pageIndex * this.paginator.pageSize;
    this.ListLimit = this.paginator.pageSize;
    this.getEmployee(event.pageIndex * event.pageSize, event.pageSize);
  }


  FilterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeeDataSource.filter = filterValue.trim().toLowerCase();
  }

  getDashboardDetails() {
    this.showLoaderService.start()
    this.addEmployeeService.getCandidateDashboard()
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

  getEmployee(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.addEmployeeService.getPostEmployee(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.employeeData = res['data'].result
            this.ListTotal = res['data'].total;

            console.log(res['data']);

            this.employeeDataSource = new MatTableDataSource(this.employeeData);
            this.employeeDataSource.sort = this.sort;

            // this.employeeDataSource = new MatTableDataSource(res['data'])
            // this.employeeDataSource.paginator = this.paginator;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getEmployeeFilter(skip, limit) {
    this.showLoaderService.start()
    var param = {
      "fromDate": this.datepipe.transform(this.fromDate, 'yyyy-MM-dd'),
      "toDate": this.datepipe.transform(this.toDate, 'yyyy-MM-dd'),
      "filter": (this.Status != "" && this.Status != undefined) ? this.Status : this.FilterVal,
      "searchText": this.searchText,
      "skip": skip,
      "limit": limit
    }
    this.addEmployeeService.getPostEmployeeFilter(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()
            this.employeeData = res['data'].result
            this.ListTotal = res['data'].total;

            console.log(res['data']);

            this.employeeDataSource = new MatTableDataSource(this.employeeData);
            this.employeeDataSource.sort = this.sort;

            // this.employeeDataSource = new MatTableDataSource(res['data'])
            // this.employeeDataSource.paginator = this.paginator;
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  deleteEmployee(id: string) {
    this.addEmployeeService.deleteEmployee({ 'id': id })
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

  getClient() {
    this.showLoaderService.start()
    this.addEmployeeService.getClient()
      .subscribe(
        res => {
          this.showLoaderService.stop()
          if (res['success'] == true) {
            // res['data'].forEach((obj: any) => {
            //   return this.employeeData?.forEach(element => {
            //     if(obj?._id == element?.WorkOrder?.client)
            //       element.WorkOrder.client = obj?.name
            //   });
            // })

            console.log(this.employeeData)

            // this.employeeData?.References.forEach((obj: any) => {
            //   res['data'].forEach((element: any) => {
            //     if (obj.Occupation == element._id)
            //       this.occupationArr.push(element.name)
            //   });
            // });
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  onGetAllJobReloDetails() {
    this.router.navigate(['/jobDetails/overview']);
  }

}
