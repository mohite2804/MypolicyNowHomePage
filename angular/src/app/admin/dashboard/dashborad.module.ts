import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
   declarations: [
   DashboardComponent
   ],
   imports: [
      
      ChartsModule,
      FormsModule,
      ReactiveFormsModule
   ],
   
})
export class DashboardModule { }