import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterprotectionguardService } from './shared/non-http/routerprotectionguard.service';
import { ProfileComponent } from './profile/profile.component';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { AddWorkorderComponent } from "./workorders/add-workorder/add-workorder.component";
import { AddEmployeeComponent } from "./candidates/add-employee/add-employee.component";
import { AllClientOverviewComponent } from './clients/allclient-overview/allclient-overview.component';
import { EmployeeOverviewComponent } from './candidates/employee-overview/employee-overview.component'
import { ClientOverviewComponent } from "./clients/client-overview/client-overview.component";
import { AllcandidateComponent } from "./candidates/allcandidate/allcandidate.component";
import { AllemployeesComponent } from "./candidates/allemployees/allemployees.component";
import { RejectedcandidatesComponent } from "./candidates/rejectedcandidates/rejectedcandidates.component";
import { WorkorderOverviewComponent } from './workorders/overview/workorder-overview/workorder-overview.component'
import { BillsOverviewComponent } from './bills/bills-overview/bills-overview.component'
import { InvoiceComponent } from './bills/invoice/invoice.component'
import { SearchOverviewComponent } from './workorders/overview/search-overview/search-overview.component';
import { BillsDashboardComponent } from './bills/bills-dashboard/bills-dashboard.component';
import { AddYearComponent } from './Master/add-year/add-year.component';
import { DesignationComponent } from './Master/designation/designation.component';
import { ReligionComponent } from './Master/religion/religion.component';
import { RelationshipComponent } from './Master/relationship/relationship.component';
import { CourseComponent } from './Master/course/course.component';
import { LanguagesComponent } from './Master/languages/languages.component';
import { UsersComponent } from './Master/users/users.component';
import { BillFormatComponent } from './Master/bill-format/bill-format.component';
import { JobroleDetailsComponent } from './candidates/jobrole-details/jobrole-details.component';
import { BulkCandidatesComponent } from './Master/bulk-candidates/bulk-candidates.component';
import { SalaryStructureComponent } from './Master/salary-structure/salary-structure.component';
import { PaySlipComponent } from './Master/pay-slip/pay-slip.component';
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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [RouterprotectionguardService],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'My Profile' } },
  { path: 'thankyou', component: ThankyouPageComponent, data: { breadcrumb: 'ThankYou' } },
  { path: 'unauthorised', component: UnauthorisedComponent, data: { breadcrumb: 'UnAuthorised' } },

  { path: 'client/add', component: AddClientComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'client/edit/:id', component: AddClientComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'client/overview/:id', component: ClientOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'allclient/overview', component: AllClientOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'workorder/add', component: AddWorkorderComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'workorder/edit/:workorderid', component: AddWorkorderComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'workorder/add/:type/:mainid', component: AddWorkorderComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'openlinkForm', component: OpenlinkFormComponent },

  { path: 'allcandidate/overview/employee/add', component: AddEmployeeComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'allcandidate/overview/employee/edit/:id', component: AddEmployeeComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'allcandidate/overview/employee/view/:id', component: EmployeeOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'allcandidate/overview', component: AllcandidateComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'allemployees/overview', component: AllemployeesComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'rejectedcandidates/overview', component: RejectedcandidatesComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'jobDetails/overview', component: JobroleDetailsComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'workorder/overview/:workorderid', component: WorkorderOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'workorder', component: SearchOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'bill/:workorderid', component: BillsOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'bill/:workorderid/:billid', component: BillsOverviewComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },
  { path: 'bills', component: BillsDashboardComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'invoice/:id', component: InvoiceComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Stock' } },

  { path: 'Reports/client-wise-report', component: ClientwiseReportComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Client-Report' } },
  { path: 'Reports/workorder-wise-report', component: WorkorderwiseReportComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Workorder-Report' } },
  { path: 'Reports/unitbranch-wise-report', component: UnitBranchwiseReportComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'UnitBranch-Report' } },
  { path: 'Reports/designation-wise-report', component: DesignationhwiseReportComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Designation-Report' } },
  { path: 'Reports/employee-report/:type/:id', component: EmployeeReportComponent, canActivate: [RouterprotectionguardService], data: { breadcrumb: 'Employee-Report' } },


  /** Master Components */
  { path: `master/year`, component: AddYearComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/designation`, component: DesignationComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/religion`, component: ReligionComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/relationship`, component: RelationshipComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/course`, component: CourseComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/language`, component: LanguagesComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/users`, component: UsersComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/bulk-add-cadidates`, component: BulkCandidatesComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/structureFields`, component: SalaryStructureComponent, canActivate: [RouterprotectionguardService] },
  { path: 'master/FomatBill', component: BillFormatComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/pay-slip`, component: PaySlipComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/emp-Logs`, component: EmployeeLogsComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/payscale-data`, component: PayScaleDataComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/payscale-data/Add`, component: AddPayscaleFormComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/payscale-data/Edit/:id`, component: AddPayscaleFormComponent, canActivate: [RouterprotectionguardService] },
  { path: `master/bulk-approval`, component: BulkApprovalComponent, canActivate: [RouterprotectionguardService] },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
