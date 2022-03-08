import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontGuard } from '../share/front.guard';

import { MyAccountComponent } from '../my-account/my-account.component';
import { DashboardComponent } from '../my-account/dashboard/dashboard.component';

import { GreetingsComponent } from '../my-account/greetings/greetings.component';
import { CreativeComponent } from '../my-account/creative/creative.component';
import { GenerateCreativeComponent } from '../my-account/generate-creative/generate-creative.component';
import { QuoteComponent } from '../my-account/quote/quote.component';
import { PayInSlipComponent } from '../my-account/pay-in-slip/pay-in-slip.component';
import { CancellationComponent } from '../my-account/cancellation/cancellation.component';
import { PolicycancellationComponent } from '../my-account/policy-cancellation/policy-cancellation.component';
import { EndorsementComponent } from '../my-account/endorsement/endorsement.component';
import { NilendorsementComponent } from '../my-account/nil-endorsement/nil-endorsement.component';
import { NonNilendorsementComponent } from '../my-account/non-nil-endorsement/non-nil-endorsement.component';
import { SoldPolicyComponent } from '../my-account/sold-policy/sold-policy.component';
import { DBReportComponent } from '../my-account/db-report/db-report.component';
import { InvoiceComponent } from '../my-account/invoice/invoice.component';
import { PendingPoliciesComponent } from './my-account/pending-policies/pending-policies.component';

import { GstComponent } from '../my-account/gst/gst.component';
import { BreakInCaseComponent } from '../my-account/break-in-case/break-in-case.component';
import { SavedProposalComponent } from '../my-account/saved-proposal/saved-proposal.component';
import { BreakInInspectionComponent } from '../my-account/break-in-inspection/break-in-inspection.component';
import { WalletTransactionsComponent} from '../my-account/wallettransactions/wallettransactions.component';
import { PolicyTransactionsComponent} from '../my-account/policytransactions/policytransactions.component';
import { OnlineTransactionsComponent} from '../my-account/onlinetransactions/onlinetransactions.component';
import { CancellationReportComponent} from '../my-account/cancellationreport/cancellationreport.component';
import { UserPrivilegeComponent } from '../my-account/user-privilege/user-privilege.component';
import { NotificationListComponent } from '../my-account/notification-list/notification-list.component';
import { RenewpolicyComponent } from '../my-account/renew-policy/renew-policy.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { QueryManagementComponent } from '../my-account/query-management/query-management.component';
import { ProfileComponent } from '../my-account/profile/profile.component';
import { WalletSettingComponent } from '../my-account/wallet-setting/wallet-setting.component';


import { MyProfileComponent } from '../my-account/my-profile/my-profile.component';
import { PolicyTransferEndorsementComponent } from '../my-account/policy-transfer-endorsement/policy-transfer-endorsement.component';



import { RenewLayoutComponent } from '../renew-layout/renew-layout.component';
import { SelectCommercialTypeComponent } from '../select-commercial-type/select-commercial-type.component';
import { PolicyrenewalComponent } from '../my-account/policy-renewal/policy-renewal.component';
import { CarInsuranceQuoteComponent } from '../car-insurance-quote/car-insurance-quote.component';
import { CarInsuranceQuotationComponent } from '../car-insurance-quotation/car-insurance-quotation.component';
import { RazorpayStatementComponent} from '../my-account/razorpay-statement/razorpay-statement.component';




const routes: Routes = [

  {
    path:  '',
    component:  MyAccountComponent,
    canActivate: [FrontGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {  path:  'dashboard', component:  DashboardComponent },


      {  path:  'greetings', component:  GreetingsComponent },
      {  path:  'creative/:id', component:  CreativeComponent },
      {  path:  'generate-creative/:id', component:  GenerateCreativeComponent },
      {  path:  'sold-policies', component:  SoldPolicyComponent },
      {  path:  'db-report', component:  DBReportComponent },
      {  path:  'policy-renewal/:type', component:  RenewpolicyComponent },
      {  path:  'invoice', component:  InvoiceComponent },
       
       
     
      {  path:  'gst', component:  GstComponent },
      {  path:  'quotes', component:  QuoteComponent },
      {  path:  'wallettransactions', component:  WalletTransactionsComponent},
      {  path:  'policytransactions', component:  PolicyTransactionsComponent},
      {  path:  'onlinetransactions', component:  OnlineTransactionsComponent},
      {  path:  'pay-in-slip', component:  PayInSlipComponent },
      {  path:  'cancellation', component:  CancellationComponent },
      {  path:  'policycancellation', component:  PolicycancellationComponent },
      {  path:  'endorsement', component:  EndorsementComponent },
      {  path:  'nil-endorsement', component:  NilendorsementComponent },
      {  path:  'non-nil-endorsement', component:  NonNilendorsementComponent },
      {  path:  'break-in-case', component:  BreakInCaseComponent },
      {  path:  'proposal', component:  SavedProposalComponent },
      {  path:  'change-password', component:  ChangePasswordComponent },
      {  path:  'query-management', component:  QueryManagementComponent },
      {  path:  'profile', component:  ProfileComponent },
      {  path:  'wallet_setting', component:  WalletSettingComponent },
      {  path:  'my-profile', component:  MyProfileComponent },

      {  path : 'user-privilege/:id/:table', component : UserPrivilegeComponent },
      {  path:  'notification-list', component:  NotificationListComponent },
      {  path:  'break-in-inspection', component:  BreakInInspectionComponent },
      {  path:  'cancellationreport', component:  CancellationReportComponent },
      {  path:  'policy-transfer-endorsement', component:  PolicyTransferEndorsementComponent },
      {  path:  'razorpay-statement', component:  RazorpayStatementComponent},


    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
