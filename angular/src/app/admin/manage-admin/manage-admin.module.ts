import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageAdminComponent } from './manage-admin.component';
import { ManageAdminRoutingModule } from './manage-admin-routing.module';
import { NgpSortModule } from "ngp-sort-pipe";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareModule } from '../share/share.module';

import { DataTablesModule } from 'angular-datatables';
//import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TreeviewModule } from 'ngx-treeview';
import { UserComponent } from './user/user.component';
import { BpUserMappingComponent } from './bp-user-mapping/bp-user-mapping.component';
import { RoleComponent } from './role/role.component';
import { TypeComponent } from './type/type.component';
import { LevelsComponent } from './levels/levels.component';
import { LoaderadminComponent } from './loaderadmin/loaderadmin.component';
import { SendRsaComponent } from './send-rsa/send-rsa.component';
import { LoaderComponent } from './loader/loader.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ManageAdminComponent,
    UserComponent,
    BpUserMappingComponent,
    RoleComponent,
    TypeComponent,
    LevelsComponent,
    LoaderadminComponent,
    SendRsaComponent,
    LoaderComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageAdminRoutingModule,
    ShareModule,
    DataTablesModule,
    NgpSortModule,
    NgSelectModule,
    NgbModule,
    TreeviewModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ManageAdminModule { }
