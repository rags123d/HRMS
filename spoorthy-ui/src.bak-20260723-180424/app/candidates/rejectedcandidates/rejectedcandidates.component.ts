import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEmployeeService } from 'src/app/shared/http/add-employee.service';

@Component({
  selector: 'app-rejectedcandidates',
  templateUrl: './rejectedcandidates.component.html',
  styleUrls: ['./rejectedcandidates.component.scss']
})
export class RejectedcandidatesComponent implements OnInit {

  employeeColumn: string[] = ['Sl No', 'Action', 'ID', 'Candidate Name', 'Client - Work Order Info', 'Rejection Remarks', 'Last Updated On',];
  public employeeDataSource = new MatTableDataSource([])

  public employeeData: any;
  public DashboardDetail: any;

  constructor(
    private addEmployeeService: AddEmployeeService,
    private showLoaderService: NgxUiLoaderService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getRejectedEmployee()
    this.getDashboardDetails()
  }

  SearchFilter(str: string) {
    var filterArr = this.employeeData.filter((obj: any) => {
      return obj.FullName.toLowerCase().includes(str.toLowerCase()) || obj.WorkOrder.client.name.toLowerCase().includes(str.toLowerCase())
    });
    this.employeeDataSource = new MatTableDataSource(filterArr)
  }

  getDashboardDetails(){
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

  getRejectedEmployee(){
    this.showLoaderService.start()
    this.addEmployeeService.getRejectedEmployee()
      .subscribe(
        res => {
          if(res['success'] == true){
            this.showLoaderService.stop()
            this.employeeData = res['data']

            console.log(res['data']);
            
            this.employeeDataSource = new MatTableDataSource(res['data'])
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

}
