import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { AddClientService } from '../shared/http/add-client.service';
import { AddWorkorderService } from '../shared/http/add-workorder.service';
import { BillService } from '../shared/http/bill.service';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  [x: string]: any;

  @ViewChild('pagination') paginator: MatPaginator;
  @ViewChild('pagination') paymentDatapaginator: MatPaginator;
  @ViewChild('pagination') billDatapaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isButtonDisabled = false;
  isModalOpen = false;

  public ListSkip = 0;
  public ListLimit = 10;
  public ClientListTotal = 0;
  public BillListTotal = 0;
  public PaymentListTotal = 0;
  modalRef: BsModalRef;

  billColumn: string[] = ['Sl No', 'Client Name', 'Work Order ID', 'Employees', 'Month & Year'];
  public billDataSource = new MatTableDataSource()

  paymentColumn: string[] = ['Sl No', 'Client Name', 'Work Order ID', 'Bill Amount', 'Generated On'];
  public paymentDataSource = new MatTableDataSource()

  notHiredColumn: string[] = ['Sl No', 'Action', 'Client Name', 'Work Order ID', 'Contract Validity', 'Requirements', 'Hired', 'Vacancies',];
  public notHiredDataSource = new MatTableDataSource()

  BillNotGenerated: any;
  BillNotPaid: any;
  WorkOrder: any;
  DashboardDetail: any;

  DocUrl = environment.baseUrl2

  constructor(
    public activatedRoute: ActivatedRoute,
    private showLoaderService: NgxUiLoaderService,
    private billService: BillService,
    private addWorkOrderService: AddWorkorderService,
    private addClientService: AddClientService,
    private modalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.notHiredDataSource.paginator = this.paginator;
    this.paymentDataSource.paginator = this.paymentDatapaginator;
    this.billDataSource.paginator = this.billDatapaginator;

    this.getBillNotGenerated(this.ListSkip, this.ListLimit);
    this.getBillNotPaid(this.ListSkip, this.ListLimit);
    this.getWorkOrderNotHired(this.ListSkip, this.ListLimit);
    this.getDashboardDetails();

  }

  getClientData(event?: PageEvent) {
    this.ListSkip = this.paginator.pageIndex * this.paginator.pageSize;
    this.ListLimit = this.paginator.pageSize;
    this.getWorkOrderNotHired(event.pageIndex * event.pageSize, event.pageSize);
  }

  getBillData(event?: PageEvent) {
    this.ListSkip = this.billDatapaginator.pageIndex * this.billDatapaginator.pageSize;
    this.ListLimit = this.billDatapaginator.pageSize;
    this.getBillNotGenerated(event.pageIndex * event.pageSize, event.pageSize);
  }

  getPaymentData(event?: PageEvent) {
    this.ListSkip = this.paymentDatapaginator.pageIndex * this.paymentDatapaginator.pageSize;
    this.ListLimit = this.paymentDatapaginator.pageSize;
    this.getBillNotPaid(event.pageIndex * event.pageSize, event.pageSize);
  }

  getBillNotGenerated(skip, limit) {
    var param = {
      "skip": skip,
      "limit": limit
    }
    this.showLoaderService.start()
    this.billService.getPostBillNotGenerated(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.BillNotGenerated = res['data'].result
            this.BillListTotal = res['data'].total;

            this.billDataSource = new MatTableDataSource(this.BillNotGenerated);
            this.billDataSource.sort = this.sort;

            // this.BillNotGenerated = res['data']
            // this.billDataSource = new MatTableDataSource(this.BillNotGenerated)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getBillNotPaid(skip, limit) {
    var param = {
      "skip": skip,
      "limit": limit
    }
    this.showLoaderService.start()
    this.billService.getPostBillNotPaid(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.BillNotPaid = res['data'].result
            this.PaymentListTotal = res['data'].total;

            this.paymentDataSource = new MatTableDataSource(this.BillNotPaid);
            this.paymentDataSource.sort = this.sort;

            // this.BillNotPaid = res['data']
            // this.paymentDataSource = new MatTableDataSource(this.BillNotPaid)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getWorkOrderNotHired(skip, limit) {
    var param = {
      "skip": skip,
      "limit": limit
    }
    this.showLoaderService.start()
    this.addWorkOrderService.getPostWorkOrderNotHired(param)
      .subscribe(
        res => {
          if (res['success'] == true) {
            this.showLoaderService.stop()

            this.WorkOrder = res['data'].result.sort((a, b) => a.client.name.localeCompare(b.client.name))
            this.ClientListTotal = res['data'].total;

            this.notHiredDataSource = new MatTableDataSource(this.WorkOrder);
            this.notHiredDataSource.sort = this.sort;

            // this.WorkOrder = res['data'].sort((a, b) => a.client.name.localeCompare(b.client.name))
            // this.notHiredDataSource = new MatTableDataSource(this.WorkOrder)
          }
        },
        error => {
          this.showLoaderService.stop()
          console.error(error)
        }
      )
  }

  getDashboardDetails() {
    this.showLoaderService.start()
    this.addClientService.getMainDashboard()
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

  OpenlinkModel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.isButtonDisabled = true;
    this.isModalOpen = true;

    this.modalRef.onHidden.subscribe(() => {
      this.isButtonDisabled = false;
      this.isModalOpen = false;
    });
  }

  openLink() {
    const queryParams = { Name: this.Name, Phone: this.PhoneNo };
    const url = this.router.createUrlTree(['/openlinkForm'], { queryParams }).toString();
    window.open(url, '_blank');
  }
}
