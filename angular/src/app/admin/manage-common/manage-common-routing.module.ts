import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MenuPermissionsComponent } from './menu-permissions/menu-permissions.component';
import { ApproveGSTComponent } from './approve-gst/approve-gst.component';
import { ApproveInvoiceComponent } from './approve-invoice/approve-invoice.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
import { BusinessPartnerComponent } from './businesspartner/businesspartner.component';
import { UsersComponent } from '../manage-motor/users/users.component';
import { PosComponent } from './pos/pos.component';
import { PrivilegeComponent } from './privilege/privilege.component';
import { DetailPrivilegeComponent } from './detail-privilege/detail-privilege.component';
import { MenuPrivilegeComponent } from './menu-privilege/menu-privilege.component';
import { WalletStatementComponent } from './wallet-statement/wallet-statement.component';
import { MpnRewardComponent } from './mpn-reward/mpn-reward.component';
import { ComissionUploadComponent } from './comission-upload/comission-upload.component';
import { SubPosUserComponent } from './subpos-user/subpos-user.component';
import { PolicyStatementComponent } from './policy-statement/policy-statement.component';
import { PosListComponent } from './pos-list/pos-list.component';
import { SubPosListComponent } from './sub-pos-list/sub-pos-list.component';
import { MpnComissionSummaryComponent } from './mpn-comission-summary/mpn-comission-summary.component';
import { ActiveDealersComponent } from './active-dealers/active-dealers.component';
import { PosApproveAccountComponent } from './pos-approve-account/pos-approve-account.component';
import { RazorpayStatementComponent } from './razorpay-statement/razorpay-statement.component';
const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
	
	{ path : 'razorpay-statement', component : RazorpayStatementComponent },
    { path : 'pos-approve-account', component : PosApproveAccountComponent },
    { path : 'menu-permission', component : MenuPermissionsComponent },
    { path : 'approve-gst', component : ApproveGSTComponent },
    { path : 'approve-invoice', component : ApproveInvoiceComponent },
    { path : 'approve-payment', component : ApprovePaymentComponent },
    { path : 'menu', component : MenuComponent },
    { path : 'business-partner', component : BusinessPartnerComponent },
    { path : 'pos', component : PosListComponent },
    { path : 'sub-pos', component : SubPosListComponent },
    { path : 'wallet-statement', component : WalletStatementComponent },
    { path : 'policy-statement', component : PolicyStatementComponent },
	{ path : 'mpn-reward', component : MpnRewardComponent },
    { path : 'comission-upload', component : ComissionUploadComponent },
    { path : 'mpn-comission-summary', component : MpnComissionSummaryComponent },
    { path : 'active-dealers', component : ActiveDealersComponent },


    { path : 'user', component : UsersComponent },
    // { path : 'dp/:mispId', component : DpComponent },
    //{ path : 'pos/:mispId/:table', component : PosComponent },
    { path : 'pos/:mispId/:table', component : PosListComponent },
    //{ path : 'subpos-user/:dpId/:table', component : SubPosUserComponent },
    { path : 'subpos-user/:dpId/:table', component : SubPosListComponent },
    { path : 'privilege/:id/:table', component : PrivilegeComponent },
    // { path : 'detail-privilege/:id/:table/:product_type_id', component : DetailPrivilegeComponent },
    { path : 'detail-privilege/:id/:table', component : DetailPrivilegeComponent },
    { path : 'menu-privilege/:id/:table/:where_column/:back_url', component : MenuPrivilegeComponent },

];




@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCommonRoutingModule { }
