import { NgModule } from '@angular/core';

import { ReportsComponent } from './reports.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


import { CommonModule } from '@angular/common';


@NgModule({
   declarations: [
   ReportsComponent
   ],
   imports: [	
      
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      DataTablesModule,
      
   ],
   
})
export class ReportsModule { }