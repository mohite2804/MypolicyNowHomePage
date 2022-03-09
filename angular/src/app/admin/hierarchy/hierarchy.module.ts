import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { LevelsComponent } from './levels/levels.component';

import { ManageLevelsComponent } from './manage-levels/manage-levels.component';
import { HierarchyRoutingModule } from './hierarchy-routing.module';


@NgModule({
  declarations: [
  	LevelsComponent,
  	ManageLevelsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HierarchyRoutingModule
  ]
})
export class HierarchyModule { }
