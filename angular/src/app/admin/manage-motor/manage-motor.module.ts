import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { TreeviewModule } from 'ngx-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgpSortModule } from "ngp-sort-pipe";
import { ManagemotorLoaderComponent } from './managemotor-loader/managemotor-loader.component';
import { ManageMotorRoutingModule } from './manage-motor-routing.module';
import { ManageMotorComponent } from './manage-motor.component';
import { SoldPolicyComponent } from './sold-policy/sold-policy.component';
import { MakesComponent } from './makes/makes.component';
import { GreetingsComponent } from './greetings/greetings.component';
import { ModelsComponent } from './models/models.component';
import { VariantsComponent } from './variants/variants.component';
import { FuelsComponent } from './fuels/fuels.component';
import { CitiesComponent } from './cities/cities.component';
import { StatesComponent } from './states/states.component';
import { BanksComponent } from './banks/banks.component';
import { RtosComponent } from './rtos/rtos.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { PincodesComponent } from './pincodes/pincodes.component';
import { IdvsComponent } from './idvs/idvs.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { MispsComponent } from './misps/misps.component';
import { MenuComponent } from './menu/menu.component';
import { IcsComponent } from './ics/ics.component';
import { BusinesspartnersComponent } from './businesspartners/businesspartners.component';
import { ManagePoliciesComponent } from './manage-policies/manage-policies.component';
import { PosReportComponent } from './pos-report/pos-report.component';
import { SoldPoliciesComponent } from './sold-policies/sold-policies.component';
import { DealerChequeComponent } from './dealer-cheque/dealer-cheque.component';
import { SearchPolicyComponent } from './search-policy/search-policy.component';
import { SearchProposalComponent } from './search-proposal/search-proposal.component';
import { FuturePolicyTaggingComponent } from './future-policy-tagging/future-policy-tagging.component';
import { InvoiceComponent } from './invoice/invoice.component';


//import { GetICICIBreakinComponent } from './icici-breaking/icici-breaking.component';

import { CancelledPoliciesComponent } from './cancelled-policies/cancelled-policies.component';
import { CancelledPoliciesPaymentComponent } from './cancelled-policies-payment/cancelled-policies-payment.component';
import { RejectedPoliciesComponent } from './rejected-policies/rejected-policies.component';
import { PendingCancelPoliciesComponent } from './pending-cancel-policies/pending-cancel-policies.component';

import { EndorseProcessComponent } from './endorse-process/endorse-process.component';
import { EndorsementComponent } from './endorsement/endorsement.component';
import { QueryManagementComponent } from './query-management/query-management.component';
import { QueryManagementProcessComponent } from './query-management-process/query-management-process.component';
import { LoaderComponent } from './loader/loader.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { QueryTypesComponent } from './query-types/query-types.component';
import { QuerySubTypesComponent } from './query-subtypes/query-subtypes.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DpsComponent } from './dps/dps.component';
import { UploadSixtyFourVbComponent } from './upload-sixty-four-vb/upload-sixty-four-vb.component';
import { FeedFileComponent } from './feedfile/feedfile.component';
import { ListingSixtyFourVbComponent } from './listing-sixty-four-vb/listing-sixty-four-vb.component';
import { NotificationsComponent } from './notifications/notifications.component';


import { BreakInCaseComponent } from './break-in-case/break-in-case.component';
import { BreakInInspectionComponent } from './break-in-inspection/break-in-inspection.component';
import { BreakInReportComponent } from './break-in-report/break-in-report.component';
import { IcPrivilegeComponent } from './ic-privilege/ic-privilege.component';
import { IcPrivilegeChangeComponent } from './ic-privilege-change/ic-privilege-change.component';
import { addBranchComponent } from './addbranch/addbranch.component';
import { OdDiscountComponent } from './od-discount/od-discount.component';
import { OdSpecialDiscountComponent } from './od-special-discount/od-special-discount.component';

import { ApproveInvoiceComponent } from './approve-invoice/approve-invoice.component';
import { ApproveGSTComponent } from './approve-gst/approve-gst.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LightboxModule } from 'ngx-lightbox';


import { IcComponent } from './ic/ic.component';
import { TickerInfoComponent } from './ticker-info/ticker-info.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { IsuzuFeedfileComponent } from './isuzu-feedfile/isuzu-feedfile.component';
import { IciciBreakinComponent } from './icici-breakin/icici-breakin.component';
import { IrdaReportComponent } from './irda-report/irda-report.component';
import { ClaimsGrievancesComponent } from './claims-grievances/claims-grievances.component';
import { OfflinePolicyComponent } from './offline-policy/offline-policy.component';
import { IciciapproveBreakinCaseComponent } from './iciciapprove-breakin-case/iciciapprove-breakin-case.component';
//import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [
    IcComponent,
    TickerInfoComponent,
    NotificationListComponent,
    ManageMotorComponent,
    SoldPolicyComponent,
    MakesComponent,
    GreetingsComponent,
    ModelsComponent,
    LoaderComponent,
    VariantsComponent,
    FuelsComponent,
    CitiesComponent,
    StatesComponent,
    BanksComponent,
    RtosComponent,
    UsersComponent,
    ProductsComponent,
    PincodesComponent,
    IdvsComponent,
    VehiclesComponent,
    MispsComponent,
    MenuComponent,
    IcsComponent,
    BusinesspartnersComponent,
    ManagePoliciesComponent,
    PosReportComponent,
    IcsComponent,
    SoldPoliciesComponent,
    DealerChequeComponent,
    SearchPolicyComponent,
    SearchProposalComponent,
    FuturePolicyTaggingComponent,

    CancelledPoliciesComponent,
    CancelledPoliciesPaymentComponent,
    RejectedPoliciesComponent,
    PendingCancelPoliciesComponent,
    ManagemotorLoaderComponent,

    EndorseProcessComponent,
    EndorsementComponent,
    QueryManagementComponent,
    QueryManagementProcessComponent,
    QueryTypesComponent,
    QuerySubTypesComponent,
    DepartmentsComponent,
    DpsComponent,
    UploadSixtyFourVbComponent,
    FeedFileComponent,
    ListingSixtyFourVbComponent,
    NotificationsComponent,
    BreakInCaseComponent,
    BreakInInspectionComponent,
    BreakInReportComponent,
    IcPrivilegeComponent,
    addBranchComponent,
    IcPrivilegeChangeComponent,
    OdDiscountComponent,
    OdSpecialDiscountComponent,
    InvoiceComponent,
    ApproveInvoiceComponent,
    ApproveGSTComponent,
    ApprovePaymentComponent,
    IsuzuFeedfileComponent,
    IciciBreakinComponent,
	IrdaReportComponent,
	ClaimsGrievancesComponent,
	OfflinePolicyComponent,
	IciciapproveBreakinCaseComponent
  ],
  imports: [
    CommonModule,
    ManageMotorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    NgpSortModule,
    NgSelectModule,
    NgbModule,
    LightboxModule,
    TreeviewModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ManageMotorModule { }
