import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CountdownModule } from 'ngx-countdown';
import { ChartsModule } from 'ng2-charts';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { TreeviewModule } from 'ngx-treeview';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../environments/environment';

import { CustomDateParserFormatter } from './share/custom-date-parser-formatter';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { ShareModule } from './share/share.module';
import { FrontComponent } from './front.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutPageComponent } from './aboutus-page/aboutus-page.component';



@NgModule({
  declarations: [
    FrontComponent,
    LandingPageComponent,
    AboutPageComponent

  ],
  imports: [
    CommonModule,

    FrontRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule

  ],

  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.CaptchaSiteKey,
    } as RecaptchaSettings,

  },
  {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
 ]

})
export class FrontModule { }
