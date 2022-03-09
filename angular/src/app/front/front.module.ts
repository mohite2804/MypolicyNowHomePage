import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CountdownModule } from 'ngx-countdown';
import { ChartsModule } from 'ng2-charts';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { TreeviewModule } from 'ngx-treeview';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../environments/environment';

import { CustomDateParserFormatter } from './share/custom-date-parser-formatter';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
// for isuzu routing start
import { QuoteFormComponent } from './quote-form/quote-form.component';
import { QuotationComponent } from './quotation/quotation.component';
// for isuzu routing end
import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { ShareModule } from './share/share.module';
import { FrontComponent } from './front.component';
import { LoginComponent } from './login/login.component';
import { GlobalLoginComponent } from './global-login/global-login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { HeadComponent } from './head/head.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { LoaderComponent } from './loader/loader.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { QuickQuoteComponent } from './quick-quote/quick-quote.component';
import { ShareQuoteComponent } from './share-quote/share-quote.component';
import { ProposalComponent } from './proposal/proposal.component';

import { MyAccountComponent } from './my-account/my-account.component';
import { DashboardComponent } from './my-account/dashboard/dashboard.component';
import { QuoteComponent } from './my-account/quote/quote.component';
import { WalletTransactionsComponent } from './my-account/wallettransactions/wallettransactions.component';
import { PolicyTransactionsComponent } from './my-account/policytransactions/policytransactions.component';
import { OnlineTransactionsComponent } from './my-account/onlinetransactions/onlinetransactions.component';
import { RazorpayStatementComponent } from './my-account/razorpay-statement/razorpay-statement.component';

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
import { GstComponent } from './my-account/gst/gst.component';
import { BreakInCaseComponent } from './my-account/break-in-case/break-in-case.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SavedProposalComponent } from './my-account/saved-proposal/saved-proposal.component';
import { ShareProposalComponent } from './share-proposal/share-proposal.component';
import { ShareLayoutComponent } from './share-layout/share-layout.component';
import { ProposalMiddleContentComponent } from './proposal-middle-content/proposal-middle-content.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { MonthDatePickerComponent } from './my-account/month-date-picker/month-date-picker.component';
import { PolicyrenewalComponent } from './my-account/policy-renewal/policy-renewal.component';
import { RenewpolicyComponent } from './my-account/renew-policy/renew-policy.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { QueryManagementComponent } from './my-account/query-management/query-management.component';


import { RenewLayoutComponent } from './renew-layout/renew-layout.component';
import { RenewPolicyLinkComponent } from './renew-policy-link/renew-policy-link.component';
import { ProfileComponent } from './my-account/profile/profile.component';
import { WalletSettingComponent } from './my-account/wallet-setting/wallet-setting.component';
import { WithdrawAmountComponent } from './my-account/withdraw-amount/withdraw-amount.component';
import { ContactComponent } from './contact/contact.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PricingComponent } from './pricing/pricing.component';
import { MyProfileComponent } from './my-account/my-profile/my-profile.component';
import { UserPrivilegeComponent } from './my-account/user-privilege/user-privilege.component';
import { NotificationListComponent } from './my-account/notification-list/notification-list.component';

import { BreakInInspectionComponent } from './my-account/break-in-inspection/break-in-inspection.component';
import { CancellationReportComponent } from './my-account/cancellationreport/cancellationreport.component';

import { BikeInsuranceQuotationComponent } from './bike-insurance-quotation/bike-insurance-quotation.component';
import { BikeInsuranceQuoteComponent } from './bike-insurance-quote/bike-insurance-quote.component';
import { CustomerDetailMotorComponent } from './customer-detail-motor/customer-detail-motor.component';
import { CarInsuranceQuoteComponent } from './car-insurance-quote/car-insurance-quote.component';
import { CarInsuranceQuotationComponent } from './car-insurance-quotation/car-insurance-quotation.component';
import { CommercialInsuranceQuoteComponent } from './commercial-insurance-quote/commercial-insurance-quote.component';
import { CommercialInsuranceQuotationComponent } from './commercial-insurance-quotation/commercial-insurance-quotation.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutPageComponent } from './aboutus-page/aboutus-page.component';

import { CommercialThreewheelerPccvPublicComponent } from './commercial-threewheeler-pccv-public/commercial-threewheeler-pccv-public.component';
import { CommercialThreewheelerGccvPublicComponent } from './commercial-threewheeler-gccv-public/commercial-threewheeler-gccv-public.component';
import { CommercialMiscdPublicComponent } from './commercial-miscd-public/commercial-miscd-public.component';
import { TickersComponent } from './my-account/tickers/tickers.component';
import { PolicyTransferEndorsementComponent } from './my-account/policy-transfer-endorsement/policy-transfer-endorsement.component';
import { PublicPolicyEndorsementComponent } from './my-account/public-policy-endorsement/public-policy-endorsement.component';
import { BreakinhtmlDirective } from './directive/breakinhtml.directive';
import { BreakinhtmlComponent } from './breakinhtml/breakinhtml.component';
import { SelectCommercialTypeComponent } from './select-commercial-type/select-commercial-type.component';
import { OrientalPaymentResponseComponent } from './oriental-payment-response/oriental-payment-response.component';
import { GreetingsComponent } from './my-account/greetings/greetings.component';
import { CreativeComponent } from './my-account/creative/creative.component';
import { GenerateCreativeComponent } from './my-account/generate-creative/generate-creative.component';
import { LightboxModule } from 'ngx-lightbox';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

import { DashboardReportComponent } from './reports/dashboard-report/dashboard-report.component';
import { LandignPageOldComponent } from './landign-page-old/landign-page-old.component';


import { QuoteHealthComponent } from './my-account/quote-health/quote-health.component';
import { SavedProposalHealthComponent } from './my-account/saved-proposal-health/saved-proposal-health.component';
import { SoldPolicyHealthComponent } from './my-account/sold-policy-health/sold-policy-health.component';
import { CancellationHealthComponent } from './my-account/cancellation-health/cancellation-health.component';

import { PendingInvoiceComponent } from './my-account/pending-invoice/pending-invoice.component';

import { TotalComissionComponent } from './my-account/total-comission/total-comission.component';
import { PaymentDetailsComponent } from './my-account/payment-details/payment-details.component';



@NgModule({
  declarations: [
    FrontComponent,
    LoginComponent,
    GlobalLoginComponent,
    HeaderComponent,
    FooterComponent,
    LoginLayoutComponent,
    AuthLayoutComponent,
    LogoutComponent,
    HeadComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    HomeComponent,
    QuoteFormComponent,
    QuotationComponent,
    BikeInsuranceQuotationComponent,
    LoaderComponent,
    CustomerDetailsComponent,
    ConfirmDetailsComponent,
    QuickQuoteComponent,
    ShareQuoteComponent,
    ProposalComponent,
    MyAccountComponent,
    DashboardComponent,
    QuoteHealthComponent,
    QuoteComponent,
    WalletTransactionsComponent,
    PolicyTransactionsComponent,
    OnlineTransactionsComponent,
    RazorpayStatementComponent,
    PayInSlipComponent,
    CancellationComponent,
    PolicycancellationComponent,
    EndorsementComponent,
    NilendorsementComponent,
    NonNilendorsementComponent,
    SoldPolicyComponent,
    DealerChequeComponent,
    DBReportComponent,
    UploadPolicyRenewalComponent,
    InvoiceComponent,
    GstComponent,
    BreakInCaseComponent,
    SidebarComponent,
    SavedProposalComponent,
    ShareProposalComponent,
    ShareLayoutComponent,
    ProposalMiddleContentComponent,
    ThankYouComponent,
    MonthDatePickerComponent,
    PolicyrenewalComponent,
    RenewpolicyComponent,
    DisclaimerComponent,
    PrivacyPolicyComponent,
    RenewLayoutComponent,
    RenewPolicyLinkComponent,
    QueryManagementComponent,
    RenewLayoutComponent,
    ProfileComponent,
    WalletSettingComponent,
    WithdrawAmountComponent,
    ContactComponent,
    TermsAndConditionsComponent,
    PricingComponent,
    MyProfileComponent,
    UserPrivilegeComponent,
    NotificationListComponent,
    BreakInInspectionComponent,
    CancellationReportComponent,
    BikeInsuranceQuoteComponent,
    CustomerDetailMotorComponent,
    CarInsuranceQuoteComponent,
    CarInsuranceQuotationComponent,
    CommercialInsuranceQuoteComponent,
    CommercialInsuranceQuotationComponent,
    LandingPageComponent,
    AboutPageComponent,
    CommercialThreewheelerPccvPublicComponent,
    CommercialThreewheelerGccvPublicComponent,
    CommercialMiscdPublicComponent,
    TickersComponent,
    PolicyTransferEndorsementComponent,
    PublicPolicyEndorsementComponent,
    BreakinhtmlDirective,
    BreakinhtmlComponent,
    SelectCommercialTypeComponent,
    OrientalPaymentResponseComponent,
    GreetingsComponent,
    CreativeComponent,
    GenerateCreativeComponent,
    ComingSoonComponent,
    DashboardReportComponent,
    LandignPageOldComponent,

    SavedProposalHealthComponent,
    SoldPolicyHealthComponent,
    CancellationHealthComponent,

    PendingInvoiceComponent,
    TotalComissionComponent,
    PaymentDetailsComponent


  ],
  imports: [
    CommonModule,

    FrontRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule ,
    RecaptchaModule,
    RecaptchaFormsModule,
    DataTablesModule,
    NgSelectModule,
    CountdownModule,
    LightboxModule,
    ChartsModule,
    TreeviewModule.forRoot()
  ],

  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.CaptchaSiteKey,
    } as RecaptchaSettings,

  },
  {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
 ]

})
export class FrontModule { }
