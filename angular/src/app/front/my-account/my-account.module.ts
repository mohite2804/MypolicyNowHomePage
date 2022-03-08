import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { CountdownModule } from 'ngx-countdown';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { TreeviewModule } from 'ngx-treeview';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../environments/environment';
import { ShareModule } from '../../../app/front/share/share.module';

import { MyAccountRoutingModule } from './my-account-routing.module';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from '../share/custom-date-parser-formatter';

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
import { QueryManagementComponent } from '../my-account/query-management/query-management.component';
import { ProfileComponent } from '../my-account/profile/profile.component';
import { WalletSettingComponent } from '../my-account/wallet-setting/wallet-setting.component';

import { MyProfileComponent } from '../my-account/my-profile/my-profile.component';
import { PolicyTransferEndorsementComponent } from '../my-account/policy-transfer-endorsement/policy-transfer-endorsement.component';
import { TickersComponent } from '../my-account/tickers/tickers.component';
import { PolicyrenewalComponent } from '../my-account/policy-renewal/policy-renewal.component';

import { RenewLayoutComponent } from '../renew-layout/renew-layout.component';
import { SelectCommercialTypeComponent } from '../select-commercial-type/select-commercial-type.component';

import { CarInsuranceQuoteComponent } from '../car-insurance-quote/car-insurance-quote.component';
import { CarInsuranceQuotationComponent } from '../car-insurance-quotation/car-insurance-quotation.component';

import { RazorpayStatementComponent } from '../my-account/razorpay-statement/razorpay-statement.component';

import { TotalComissionComponent } from './total-comission/total-comission.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';





@NgModule({
  declarations: [
    MyAccountComponent,
    DashboardComponent,
    GreetingsComponent,
    CreativeComponent,
    GenerateCreativeComponent,
    QuoteComponent,
    PayInSlipComponent,
    CancellationComponent,
    PolicycancellationComponent,
    EndorsementComponent,
    NilendorsementComponent,
    NonNilendorsementComponent,
    SoldPolicyComponent,
    DBReportComponent,
    InvoiceComponent,
    
    GstComponent,
    BreakInCaseComponent,
    SavedProposalComponent,
    BreakInInspectionComponent,
    WalletTransactionsComponent,
    PolicyTransactionsComponent,
    OnlineTransactionsComponent,
    CancellationReportComponent,
    UserPrivilegeComponent,
    NotificationListComponent,
    RenewpolicyComponent,
    QueryManagementComponent,
    ProfileComponent,
    WalletSettingComponent,
    MyProfileComponent,
    PolicyTransferEndorsementComponent,
    TickersComponent,
    PolicyrenewalComponent,
    RazorpayStatementComponent,
    
    TotalComissionComponent,
    PaymentDetailsComponent
   






  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    CommonModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    DataTablesModule,
    NgSelectModule,
    CountdownModule,

    ChartsModule,
    TreeviewModule.forRoot()
  ],
  providers: [
  {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
 ]
})
export class MyAccountModule { }
