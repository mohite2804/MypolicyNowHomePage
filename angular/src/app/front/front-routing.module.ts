import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontGuard } from './share/front.guard';

import { FrontComponent } from './front.component';
import { LoginComponent } from './login/login.component';
import { GlobalLoginComponent } from './global-login/global-login.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { QuoteFormComponent } from './quote-form/quote-form.component';
import { QuotationComponent } from './quotation/quotation.component';

import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { QuickQuoteComponent } from './quick-quote/quick-quote.component';
import { ShareQuoteComponent } from './share-quote/share-quote.component';
import { ShareProposalComponent } from './share-proposal/share-proposal.component';
import { ProposalComponent } from './proposal/proposal.component';
import { PosReportComponent } from '../admin/manage-motor/pos-report/pos-report.component';

import { MyAccountComponent } from './my-account/my-account.component';
import { DashboardComponent } from './my-account/dashboard/dashboard.component';
import { QuoteHealthComponent } from './my-account/quote-health/quote-health.component';
import { ReportsComponent } from './my-account/reports/reports.component';
import { GreetingsComponent } from './my-account/greetings/greetings.component';
import { CreativeComponent } from './my-account/creative/creative.component';
import { GenerateCreativeComponent } from './my-account/generate-creative/generate-creative.component';
import { QuoteComponent } from './my-account/quote/quote.component';
import { PayInSlipComponent } from './my-account/pay-in-slip/pay-in-slip.component';
import { CancellationComponent } from './my-account/cancellation/cancellation.component';
import { PolicycancellationComponent } from './my-account/policy-cancellation/policy-cancellation.component';
import { EndorsementComponent } from './my-account/endorsement/endorsement.component';
import { NilendorsementComponent } from './my-account/nil-endorsement/nil-endorsement.component';
import { NonNilendorsementComponent } from './my-account/non-nil-endorsement/non-nil-endorsement.component';
import { SoldPolicyComponent } from './my-account/sold-policy/sold-policy.component';
import { DealerChequeComponent } from './my-account/dealer-cheque/dealer-cheque.component';
import { DBReportComponent } from './my-account/db-report/db-report.component';
import { UploadPolicyRenewalComponent } from './my-account/upload-policy-renewal/upload-policy-renewal.component';
import { InvoiceComponent } from './my-account/invoice/invoice.component';



import { PolicyrenewalComponent } from './my-account/policy-renewal/policy-renewal.component';
import { GstComponent } from './my-account/gst/gst.component';
import { BreakInCaseComponent } from './my-account/break-in-case/break-in-case.component';
import { SavedProposalComponent } from './my-account/saved-proposal/saved-proposal.component';
import { SavedProposalHealthComponent } from './my-account/saved-proposal-health/saved-proposal-health.component';
import { SoldPolicyHealthComponent } from './my-account/sold-policy-health/sold-policy-health.component';
import { CancellationHealthComponent } from './my-account/cancellation-health/cancellation-health.component';
import { ShareLayoutComponent } from './share-layout/share-layout.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

import { RenewpolicyComponent } from './my-account/renew-policy/renew-policy.component';

import { RenewLayoutComponent } from './renew-layout/renew-layout.component';
import { RenewPolicyLinkComponent } from './renew-policy-link/renew-policy-link.component';


import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { QueryManagementComponent } from './my-account/query-management/query-management.component';

import { ProfileComponent } from './my-account/profile/profile.component';
import { WalletSettingComponent } from './my-account/wallet-setting/wallet-setting.component';
import { WithdrawAmountComponent } from './my-account/withdraw-amount/withdraw-amount.component';
import { MyProfileComponent } from './my-account/my-profile/my-profile.component';


import { ContactComponent } from './contact/contact.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PricingComponent } from './pricing/pricing.component';
import { UserPrivilegeComponent } from './my-account/user-privilege/user-privilege.component';
import { NotificationListComponent } from './my-account/notification-list/notification-list.component';

import { BreakInInspectionComponent } from './my-account/break-in-inspection/break-in-inspection.component';
import { WalletTransactionsComponent} from './my-account/wallettransactions/wallettransactions.component';
import { PolicyTransactionsComponent} from './my-account/policytransactions/policytransactions.component';
import { OnlineTransactionsComponent} from './my-account/onlinetransactions/onlinetransactions.component';
import { CancellationReportComponent} from './my-account/cancellationreport/cancellationreport.component';
import { RazorpayStatementComponent} from './my-account/razorpay-statement/razorpay-statement.component';

import { BikeInsuranceQuotationComponent } from './bike-insurance-quotation/bike-insurance-quotation.component';
import { BikeInsuranceQuoteComponent } from './bike-insurance-quote/bike-insurance-quote.component';
import { CarInsuranceQuoteComponent } from './car-insurance-quote/car-insurance-quote.component';
import { CarInsuranceQuotationComponent } from './car-insurance-quotation/car-insurance-quotation.component';
import { CommercialInsuranceQuoteComponent } from './commercial-insurance-quote/commercial-insurance-quote.component';
import { CommercialInsuranceQuotationComponent } from './commercial-insurance-quotation/commercial-insurance-quotation.component';

import { CustomerDetailMotorComponent } from './customer-detail-motor/customer-detail-motor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutPageComponent } from './aboutus-page/aboutus-page.component';

import { CommercialThreewheelerPccvPublicComponent } from './commercial-threewheeler-pccv-public/commercial-threewheeler-pccv-public.component';
import { CommercialThreewheelerGccvPublicComponent } from './commercial-threewheeler-gccv-public/commercial-threewheeler-gccv-public.component';
import { CommercialMiscdPublicComponent } from './commercial-miscd-public/commercial-miscd-public.component';
import { OrientalPaymentResponseComponent } from './oriental-payment-response/oriental-payment-response.component';

import { BreakInReportComponent } from '../admin/manage-motor/break-in-report/break-in-report.component';
import { PolicyTransferEndorsementComponent } from './my-account/policy-transfer-endorsement/policy-transfer-endorsement.component';
import { PublicPolicyEndorsementComponent } from './my-account/public-policy-endorsement/public-policy-endorsement.component';
import { SelectCommercialTypeComponent } from './select-commercial-type/select-commercial-type.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

import { DashboardReportComponent } from './reports/dashboard-report/dashboard-report.component';
import { LandignPageOldComponent } from './landign-page-old/landign-page-old.component';


import { ShareProposalHealthComponent } from './health/share-proposal-health/share-proposal-health.component';
import { ThankYouHealthComponent } from './health/thank-you-health/thank-you-health.component';

import { PendingInvoiceComponent } from './my-account/pending-invoice/pending-invoice.component';
import { TotalComissionComponent } from './my-account/total-comission/total-comission.component';
import { PaymentDetailsComponent } from './my-account/payment-details/payment-details.component';


const routes: Routes = [

  {  path:  '', component:  LandignPageOldComponent },
  {  path:  'new-landing-page', component:  LandingPageComponent },
   {  path:  'aboutus-page', component:  AboutPageComponent },
  {  path: 'oriental-payment-response/:transaction_no', component: OrientalPaymentResponseComponent },
  {  path: 'breaking-inspection-report/:id/:share_link', component: BreakInReportComponent },
  {  path: 'public-policy-transfer-endorsement/:policy_no/:policy_end_id', component:  PublicPolicyEndorsementComponent },

  {
    path: 'share',
    component: ShareLayoutComponent,
    children : [

      {  path:  "quote/:quote_share_link", component:  ShareQuoteComponent },
      { path:    "proposal/:proposal_share_link", component: ShareProposalComponent },
      {  path:  "health-proposal/:proposal_share_link", component: ShareProposalHealthComponent },

      {  path:  "policy/:renew_share_link/:ic_ids/:engine_no", component:  RenewPolicyLinkComponent },


      {  path:  'confirm-details', component:  ConfirmDetailsComponent },
      {  path:  'customer-detail-motor', component:  CustomerDetailMotorComponent },

      {  path:  'proposal', component:  ProposalComponent },

      {  path:  'thank-you', component:  ThankYouComponent },
      {  path:  "thank-you-health", component:ThankYouHealthComponent},
      {  path:  'bike-insurance-quote/:reg_no/:selected_ic', component:  BikeInsuranceQuoteComponent },
      {  path:  'car-insurance-quote/:reg_no/:selected_ic', component:  BikeInsuranceQuoteComponent },

      {  path:  'commercial-truck-gccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-misc-d-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-bus-pccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-taxi-pccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },


      {  path:  'commercial-threewheeler-gccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-pccv-rickshaw-6-7-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-pccv-rickshaw-3-6-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-ecart-gccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-ecart-pccv-quote/:reg_no/:selected_ic', component:  CommercialInsuranceQuoteComponent },












      {  path:  'bike-insurance-quotation/:unique_ref_no', component:  BikeInsuranceQuotationComponent },
      {  path:  'car-insurance-quotation/:unique_ref_no', component:  BikeInsuranceQuotationComponent },
      {  path:  'commercial-truck-gccv-quotation/:unique_ref_no', component:  CommercialInsuranceQuotationComponent },
      {  path:  'commercial-threewheeler-quotation/:unique_ref_no', component:  CommercialInsuranceQuotationComponent },
      {  path:  'commercial-misc-d-quotation/:unique_ref_no', component:  CommercialInsuranceQuotationComponent },
      {  path:  'commercial-bus-pccv-quotation/:unique_ref_no', component:  CommercialInsuranceQuotationComponent },
      {  path:  'commercial-taxi-pccv-quotation/:unique_ref_no', component:  CommercialInsuranceQuotationComponent },



    ]
  },


  {
    path: '',
    component: LoginLayoutComponent,
    children : [

     // {  path:  '', component:  LoginComponent },
      {  path:  'login', component:  LoginComponent },
      { path: 'global-login/:accesskey_key/:timestamp/:dealer_code_encode/:mybizznow_name/:mybizznow_url', component: GlobalLoginComponent },
      { path: 'global-login/:accesskey_key/:timestamp/:dealer_code_encode/:mybizznow_name/:mybizznow_url/:extraparameters', component: GlobalLoginComponent },

      {  path: 'forgot-password', component:  ForgotPasswordComponent },



    ]
  },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [FrontGuard],
    children : [
      {  path:  'quote-form', component:  ComingSoonComponent },
      {  path:  'quotation', component:  ComingSoonComponent },
      // for isuzu
      {  path:  'car-quote-form', component:  QuoteFormComponent },
      {  path:  'car-quotation', component:  QuotationComponent },

      {  path:  'commercial-quote-form', component:  QuoteFormComponent },
      {  path:  'commercial-quotation', component:  QuotationComponent },
      // for isuzu
      {  path:  'bike-insurance-quote', component:  BikeInsuranceQuoteComponent },
      {  path:  'bike-insurance-quotation', component:  BikeInsuranceQuotationComponent },

      {  path:  'car-insurance-quote', component:  BikeInsuranceQuoteComponent },
      {  path:  'car-insurance-quotation', component:  BikeInsuranceQuotationComponent },

      {  path:  'commercial-truck-gccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-truck-gccv-quotation', component:  CommercialInsuranceQuotationComponent },


      {  path:  'commercial-threewheeler-gccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-pccv-rickshaw-6-7-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-pccv-rickshaw-3-6-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-ecart-gccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-ecart-pccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-threewheeler-quote', component:  CommercialInsuranceQuoteComponent },

      {  path:  'commercial-threewheeler-quotation', component:  CommercialInsuranceQuotationComponent },

      {  path:  'commercial-misc-d-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-misc-d-quotation', component:  CommercialInsuranceQuotationComponent },

      {  path:  'commercial-bus-pccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-bus-pccv-quotation', component:  CommercialInsuranceQuotationComponent },

      {  path:  'commercial-taxi-pccv-quote', component:  CommercialInsuranceQuoteComponent },
      {  path:  'commercial-taxi-pccv-quotation', component:  CommercialInsuranceQuotationComponent },

      {  path:  'commercial-pccv-quote', component:  CommercialThreewheelerPccvPublicComponent },
      {  path:  'commercial-gccv-quote', component:  CommercialThreewheelerGccvPublicComponent },
      {  path:  'commercial-miscd-quote', component:  CommercialMiscdPublicComponent },

      {  path:  'customer-detail-motor', component:  CustomerDetailMotorComponent },

      {  path:  'logout', component:  LogoutComponent },
      {  path:  'home', component:  HomeComponent },


      {  path:  'customer-details', component:  CustomerDetailsComponent },
      {  path:  'confirm-details', component:  ConfirmDetailsComponent },
      {  path:  'quick-quote', component:  QuickQuoteComponent },
      {  path:  'proposal', component:  ProposalComponent },
      {  path:  'thank-you', component:  ThankYouComponent },
      {  path:  'disclaimer', component:  DisclaimerComponent },
      {  path:  'privacy-policy', component:  PrivacyPolicyComponent },

      { path: 'health-insurance-quote', loadChildren: () => import('./health/health.module').then(m => m.HealthModule) },


    ]
  },

  {
    path:  'reports',
    component:  MyAccountComponent,
    canActivate: [FrontGuard],
    children: [
      {  path:  'dashboard-report', component:  DashboardReportComponent }
    ]

  },

  {
    path:  'my-account',
    component:  MyAccountComponent,
    canActivate: [FrontGuard],
    children: [
      {  path:  'dashboard', component:  DashboardComponent },
      {  path:  'reports', component:  ReportsComponent },
      {  path:  'greetings', component:  GreetingsComponent },
      {  path:  'creative/:id', component:  CreativeComponent },
      {  path:  'generate-creative/:id', component:  GenerateCreativeComponent },
      {  path:  'sold-policies', component:  SoldPolicyComponent },
      {  path:  'dealer-cheque', component:  DealerChequeComponent },
      {  path:  'db-report', component:  DBReportComponent },
      {  path:  'upload-policy-renewal', component:  UploadPolicyRenewalComponent },
      //{  path:  'policy-renewal/:type', component:  RenewpolicyComponent },
      {  path:  'policy-renewal', component:  RenewpolicyComponent },
      // {  path:  'policy-renewal', component:  RenewpolicyComponent },
      {  path:  'invoice', component:  InvoiceComponent },
      {  path:  'pending-policies', component:  PendingInvoiceComponent },
      {  path:  'total-comission', component:  TotalComissionComponent },
      {  path:  'payment-details', component:  PaymentDetailsComponent },

      {  path:  'gst', component:  GstComponent },
      {  path:  'quotes', component:  QuoteComponent },
      {  path:  'quote-health', component:  QuoteHealthComponent},
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
      {  path:  'health-proposal', component:  SavedProposalHealthComponent},
      {  path:  'change-password', component:  ChangePasswordComponent },
      {  path:  'query-management', component:  QueryManagementComponent },
      {  path:  'profile', component:  ProfileComponent },
      {  path:  'wallet_setting', component:  WalletSettingComponent },

      {  path:  'withdraw-amount', component:  WithdrawAmountComponent },


      {  path:  'sold-policies-health', component:  SoldPolicyHealthComponent},
      {  path:  'cancellation-health', component:  CancellationHealthComponent},


      {  path:  'my-profile', component:  MyProfileComponent },
      {  path:  'policy-report', component:  PosReportComponent },
      {  path : 'user-privilege/:id/:table', component : UserPrivilegeComponent },
      {  path:  'notification-list', component:  NotificationListComponent },
      {  path:  'break-in-inspection', component:  BreakInInspectionComponent },
      {  path:  'cancellationreport', component:  CancellationReportComponent },
      {  path:  'policy-transfer-endorsement', component:  PolicyTransferEndorsementComponent },
      {  path:  'razorpay-statement', component:  RazorpayStatementComponent},
    ]
  },

  { path: "contact-us", component: ContactComponent },
  { path: "pricing", component: PricingComponent },
  { path: "terms-and-conditions", component: TermsAndConditionsComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class FrontRoutingModule { }
