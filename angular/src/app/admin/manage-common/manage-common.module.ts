import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCommonComponent } from './manage-common.component';
import { ManageCommonRoutingModule } from './manage-common-routing.module';

import { ShareModule } from '../share/share.module';

import { DataTablesModule } from 'angular-datatables';
//import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TreeviewModule } from 'ngx-treeview';
import { MenuComponent } from './menu/menu.component';
import { MenuPermissionsComponent } from './menu-permissions/menu-permissions.component';
import { ApproveGSTComponent } from './approve-gst/approve-gst.component';
import { ApproveInvoiceComponent } from './approve-invoice/approve-invoice.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
import { BusinessPartnerComponent } from './businesspartner/businesspartner.component';
import { PosComponent } from './pos/pos.component';
import { PrivilegeComponent } from './privilege/privilege.component';
import { DetailPrivilegeComponent } from './detail-privilege/detail-privilege.component';
import { MenuPrivilegeComponent } from './menu-privilege/menu-privilege.component';
import { LoaderComponent } from './loader/loader.component';
import { NgSelectModule } from '@ng-select/ng-select';
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

@NgModule({
  declarations: [
    ManageCommonComponent,
    MenuComponent,
    MenuPermissionsComponent,
    ApproveGSTComponent,
    ApproveInvoiceComponent,
	ApprovePaymentComponent,
    BusinessPartnerComponent,
    PosComponent,
    PrivilegeComponent,
    DetailPrivilegeComponent,
    MenuPrivilegeComponent,
    LoaderComponent,
    WalletStatementComponent,
	MpnRewardComponent,
	ComissionUploadComponent,
	SubPosUserComponent,
	PolicyStatementComponent,
	PosListComponent,
	SubPosListComponent,
	MpnComissionSummaryComponent,
 ActiveDealersComponent,
 RazorpayStatementComponent,
 PosApproveAccountComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageCommonRoutingModule,
    ShareModule,
    DataTablesModule,
    //SelectDropDownModule,
    NgSelectModule,
    TreeviewModule.forRoot()
  ]
})
export class ManageCommonModule { }
