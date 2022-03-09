import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BrowserModule } from '@angular/platform-browser'




@NgModule({
   declarations: [
   ReportsComponent
   ],
   imports: [
      
      FormsModule,
      ReactiveFormsModule,
      DataTablesModule,
      BrowserModule
      
   ],
   
})
export class ReportsModule { }