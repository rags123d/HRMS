import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { BreadcrumbsModule } from 'ng6-breadcrumbs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { AgmCoreModule } from '@agm/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthenticationInterceptor } from './shared/http/auth.interceptor';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomPaginationComponent } from './pagination/custom-pagination/custom-pagination.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GrdFilterPipe } from './grd-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfileComponent } from './profile/profile.component';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AddWorkorderComponent } from './workorders/add-workorder/add-workorder.component';
import { AddEmployeeComponent } from './candidates/add-employee/add-employee.component';
import { AllClientOverviewComponent } from './clients/allclient-overview/allclient-overview.component';
import { EmployeeOverviewComponent } from './candidates/employee-overview/employee-overview.component';
import { ClientOverviewComponent } from './clients/client-overview/client-overview.component';

import { AllcandidateComponent } from './candidates/allcandidate/allcandidate.component';
import { AllemployeesComponent } from './candidates/allemployees/allemployees.component';
import { RejectedcandidatesComponent } from './candidates/rejectedcandidates/rejectedcandidates.component';
import { WorkorderOverviewComponent } from './workorders/overview/workorder-overview/workorder-overview.component';
import { BillsOverviewComponent } from './bills/bills-overview/bills-overview.component';
import { SearchOverviewComponent } from './workorders/overview/search-overview/search-overview.component';
import { BillsDashboardComponent } from './bills/bills-dashboard/bills-dashboard.component';
import { AddYearComponent } from './Master/add-year/add-year.component';
import { DesignationComponent } from './Master/designation/designation.component';
import { ReligionComponent } from './Master/religion/religion.component';
import { RelationshipComponent } from './Master/relationship/relationship.component';
import { CourseComponent } from './Master/course/course.component';
import { LanguagesComponent } from './Master/languages/languages.component';
import { UsersComponent } from './Master/users/users.component';
import { SafePipe } from './shared/pipes/safe.pipe';
import { BillFormatComponent } from './Master/bill-format/bill-format.component';
import { JobroleDetailsComponent } from './candidates/jobrole-details/jobrole-details.component';
import { BulkCandidatesComponent } from './Master/bulk-candidates/bulk-candidates.component';
import { SalaryStructureComponent } from './Master/salary-structure/salary-structure.component';
import { PaySlipComponent } from './Master/pay-slip/pay-slip.component';
import { InvoiceComponent } from './bills/invoice/invoice.component';
import { EmployeeLogsComponent } from './Master/employee-logs/employee-logs.component';
import { PayScaleDataComponent } from './Master/pay-scale-data/pay-scale-data.component';
import { AddPayscaleFormComponent } from './Master/add-payscale-form/add-payscale-form.component';
import { ClientwiseReportComponent } from './Reports/clientwise-report/clientwise-report.component';
import { WorkorderwiseReportComponent } from './Reports/workorderwise-report/workorderwise-report.component';
import { UnitBranchwiseReportComponent } from './Reports/unit-branchwise-report/unit-branchwise-report.component';
import { DesignationhwiseReportComponent } from './Reports/designationhwise-report/designationhwise-report.component';
import { EmployeeReportComponent } from './Reports/employee-report/employee-report.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { OpenlinkFormComponent } from './candidates/openlink-form/openlink-form.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { BulkApprovalComponent } from './Master/bulk-approval/bulk-approval.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    CustomPaginationComponent,
    GrdFilterPipe,
    ProfileComponent,
    AddClientComponent,
    FileUploadComponent,
    AddWorkorderComponent,
    AddEmployeeComponent,
    AllClientOverviewComponent,
    EmployeeOverviewComponent,
    ClientOverviewComponent,
    AllcandidateComponent,
    AllemployeesComponent,
    RejectedcandidatesComponent,
    WorkorderOverviewComponent,
    BillsOverviewComponent,
    InvoiceComponent,
    SearchOverviewComponent,
    BillsDashboardComponent,
    AddYearComponent,
    DesignationComponent,
    ReligionComponent,
    RelationshipComponent,
    CourseComponent,
    LanguagesComponent,
    UsersComponent,
    SafePipe,
    BillFormatComponent,
    JobroleDetailsComponent,
    BulkCandidatesComponent,
    SalaryStructureComponent,
    PaySlipComponent,
    EmployeeLogsComponent,
    PayScaleDataComponent,
    AddPayscaleFormComponent,
    ClientwiseReportComponent,
    WorkorderwiseReportComponent,
    UnitBranchwiseReportComponent,
    DesignationhwiseReportComponent,
    EmployeeReportComponent,
    ThankyouPageComponent,
    OpenlinkFormComponent,
    UnauthorisedComponent,
    BulkApprovalComponent,
  ],

  imports: [
    BrowserModule,
    MatTabsModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // ChartsModule,
    DataTablesModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    ModalModule.forRoot(),
    // BreadcrumbsModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAU0JLby_xN_Vv3YEo1Y0A8OP4aQadd3pc'
    }),
    NgxUiLoaderModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
