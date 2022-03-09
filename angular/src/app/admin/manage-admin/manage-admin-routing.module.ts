import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { BpUserMappingComponent } from './bp-user-mapping/bp-user-mapping.component';
import { RoleComponent } from './role/role.component';
import { TypeComponent } from './type/type.component';
import { LevelsComponent } from './levels/levels.component';
import { SendRsaComponent } from './send-rsa/send-rsa.component';
// import { ApproveGSTComponent } from './approve-gst/approve-gst.component';
// import { ApproveInvoiceComponent } from './approve-invoice/approve-invoice.component';
// import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
// import { MispsComponent } from './misps/misps.component';
// import { UsersComponent } from '../manage-motor/users/users.component';
// import { DpComponent } from './dp/dp.component';
// import { PrivilegeComponent } from './privilege/privilege.component';
// import { DetailPrivilegeComponent } from './detail-privilege/detail-privilege.component';
// import { MenuPrivilegeComponent } from './menu-privilege/menu-privilege.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },

    { path : 'user', component : UserComponent },
    { path : 'bp-user', component : BpUserMappingComponent },
    { path : 'role', component : RoleComponent },
    { path : 'type', component : TypeComponent },
    { path : 'send-rsa', component : SendRsaComponent },
    // { path : 'levels', component : LevelsComponent },
    { path : 'levels/:id/:back_url', component : LevelsComponent },
    // { path : 'menu-permission', component : MenuPermissionsComponent },
    // { path : 'approve-gst', component : ApproveGSTComponent },
    // { path : 'approve-invoice', component : ApproveInvoiceComponent },
    // { path : 'approve-payment', component : ApprovePaymentComponent },
    // { path : 'menu', component : MenuComponent },
    // { path : 'misp', component : MispsComponent },
    // { path : 'user', component : UsersComponent },
    // { path : 'dp/:mispId', component : DpComponent },
    // { path : 'privilege/:id/:table', component : PrivilegeComponent },
    // { path : 'detail-privilege/:id/:table/:product_type_id', component : DetailPrivilegeComponent },
    // { path : 'menu-privilege/:id/:table', component : MenuPrivilegeComponent },

];




@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageAdminRoutingModule { }
