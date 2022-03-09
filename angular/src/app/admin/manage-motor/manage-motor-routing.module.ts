import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { BusinesspartnersComponent } from './businesspartners/businesspartners.component';
import { PincodesComponent } from './pincodes/pincodes.component';
import { IdvsComponent } from './idvs/idvs.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { MispsComponent } from './misps/misps.component';
import { IcsComponent } from './ics/ics.component';
import { MenuComponent } from './menu/menu.component';
import { ManagePoliciesComponent } from './manage-policies/manage-policies.component';
import { PosReportComponent } from './pos-report/pos-report.component';
import { SoldPoliciesComponent } from './sold-policies/sold-policies.component';
import { DealerChequeComponent } from './dealer-cheque/dealer-cheque.component';
import { SearchPolicyComponent } from './search-policy/search-policy.component';
import { SearchProposalComponent } from './search-proposal/search-proposal.component';
import { FuturePolicyTaggingComponent } from './future-policy-tagging/future-policy-tagging.component';
//import { GetICICIBreakinComponent } from './icici-breaking/icici-breaking.component';
import { CancelledPoliciesComponent } from './cancelled-policies/cancelled-policies.component';
import { CancelledPoliciesPaymentComponent } from './cancelled-policies-payment/cancelled-policies-payment.component';
import { RejectedPoliciesComponent } from './rejected-policies/rejected-policies.component';
import { PendingCancelPoliciesComponent } from './pending-cancel-policies/pending-cancel-policies.component';


import { EndorsementComponent } from './endorsement/endorsement.component';
import { EndorseProcessComponent } from './endorse-process/endorse-process.component';
import { QueryManagementComponent } from './query-management/query-management.component';
import { QueryManagementProcessComponent } from './query-management-process/query-management-process.component';
import { QueryTypesComponent } from './query-types/query-types.component';
import { QuerySubTypesComponent } from './query-subtypes/query-subtypes.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DpsComponent } from './dps/dps.component';
import { UploadSixtyFourVbComponent } from './upload-sixty-four-vb/upload-sixty-four-vb.component';
import { FeedFileComponent } from './feedfile/feedfile.component';
import { IsuzuFeedfileComponent } from './isuzu-feedfile/isuzu-feedfile.component';
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

import { InvoiceComponent } from './invoice/invoice.component';

import { ApproveGSTComponent } from './approve-gst/approve-gst.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';

import { IcComponent } from './ic/ic.component';
import { TickerInfoComponent } from './ticker-info/ticker-info.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { IciciBreakinComponent } from './icici-breakin/icici-breakin.component';
import { ClaimsGrievancesComponent } from './claims-grievances/claims-grievances.component';
import { OfflinePolicyComponent } from './offline-policy/offline-policy.component';
import { IrdaReportComponent } from './irda-report/irda-report.component';
import { IciciapproveBreakinCaseComponent } from './iciciapprove-breakin-case/iciciapprove-breakin-case.component';
//import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {   path: '',
      component: ManageMotorComponent,
      children : [
        { path : 'sold-policy' , component : SoldPolicyComponent },
        { path : 'makes' , component : MakesComponent },
        { path : 'greetings' , component : GreetingsComponent },
        { path : 'models' , component : ModelsComponent },
        { path : 'variants' , component : VariantsComponent },
        { path : 'fuels' , component : FuelsComponent },
        { path : 'cities' , component : CitiesComponent },
        { path : 'states' , component : StatesComponent },
        { path : 'banks' , component : BanksComponent },
        { path : 'rtos' , component : RtosComponent },
        { path : 'users' , component : UsersComponent },
        { path : 'products' , component : ProductsComponent },
        { path : 'business-partner' , component : BusinesspartnersComponent },
        { path : 'pincodes' , component : PincodesComponent },
        { path : 'idvs' , component : IdvsComponent },
        { path : 'vehicles' , component : VehiclesComponent },
        { path : 'misps' , component : MispsComponent },
        { path : 'ics' , component : IcsComponent },
        {  path:  'invoice', component:  InvoiceComponent },

        { path : 'menu' , component : MenuComponent },
        { path : 'manage-policies', component : ManagePoliciesComponent },
        { path : 'pos-report', component : PosReportComponent },
        { path : 'misps', component : MispsComponent },
        { path : 'sold-policies', component : SoldPoliciesComponent },
        { path : 'dealer-cheque', component : DealerChequeComponent },
        { path : 'search-policies', component : SearchPolicyComponent },
        { path : 'search-proposal', component : SearchProposalComponent },
        { path : 'future-policy-tagging', component : FuturePolicyTaggingComponent },
        { path : 'get-icici-breakin', component : IciciBreakinComponent},
		{ path : 'get-claims-grievances', component : ClaimsGrievancesComponent},
		{ path : 'get-offline-policy', component : OfflinePolicyComponent},
		{ path : 'get-irda-report', component : IrdaReportComponent},
		{ path : 'get-icici-approve-breakin', component : IciciapproveBreakinCaseComponent },
        { path : 'cancelled-policies', component : CancelledPoliciesComponent },
        { path : 'cancelled-policies-payment', component : CancelledPoliciesPaymentComponent },
        { path : 'rejected-policies', component : RejectedPoliciesComponent },
        { path : 'pending-cancel-policies', component : PendingCancelPoliciesComponent },
        { path : 'endorse-process', component : EndorseProcessComponent },
        { path :  'endorsement', component:  EndorsementComponent },
        { path :  'query-management', component:  QueryManagementComponent },
        { path :  'query-management-process', component:  QueryManagementProcessComponent },
        { path :  'query-types', component:  QueryTypesComponent },
        { path :  'query-subtypes', component:  QuerySubTypesComponent },
        { path :  'departments', component:  DepartmentsComponent },
        { path :  'dps', component:  DpsComponent },
        { path : 'feedfile', component : FeedFileComponent },
        { path : 'isuzu-feedfile', component : IsuzuFeedfileComponent },


        {  path:  'upload-sixty-four-vb', component:  UploadSixtyFourVbComponent },

        {  path:  'listing-sixty-four-vb', component:  ListingSixtyFourVbComponent },
        {  path:  'notifications', component:  NotificationsComponent },

        {  path:  'break-in-case', component:  BreakInCaseComponent },
        {  path:  'break-in-inspection', component:  BreakInInspectionComponent },
        {  path:  'break-in-report', component:  BreakInReportComponent },
        {  path:  'ic-privilege/:ic_id', component:  IcPrivilegeComponent },
        {  path:  'addbranch/:ic_id', component:  addBranchComponent },
        {  path:  'ic-privilege/change/:ic_id/:product_type_id', component:  IcPrivilegeChangeComponent },

        {  path : 'od-discount' , component : OdDiscountComponent },
        {  path : 'od-special-discount' , component : OdSpecialDiscountComponent },


        { path : 'approve-invoice', component : ApproveInvoiceComponent },
        { path : 'approve-gst', component : ApproveGSTComponent },
        { path : 'approve-payment', component : ApprovePaymentComponent },

        {  path : 'payment-gateway' , component : IcComponent },
        {  path : 'ticker-info' , component : TickerInfoComponent },
        { path : 'notification-list' , component : NotificationListComponent },

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMotorRoutingModule { }
