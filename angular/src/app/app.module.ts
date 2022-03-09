import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF, Location } from '@angular/common';

import { HttpClientModule ,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FrontInterceptor } from './front/share/front.interceptor';
import { AdminInterceptor } from './admin/share/admin.interceptor';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { BnNgIdleService } from 'bn-ng-idle';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ReportsComponent } from './admin/reports/reports.component';

import { CommonModule } from "@angular/common";



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AccessDeniedComponent,
    DashboardComponent,
    ReportsComponent
  

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,

    SimpleNotificationsModule.forRoot()


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: FrontInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true},
    { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' },
    BnNgIdleService,DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
