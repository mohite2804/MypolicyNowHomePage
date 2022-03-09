import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';

import { NgSelectModule } from '@ng-select/ng-select';

import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { environment } from '../../environments/environment';

import { ShareModule } from './share/share.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { ProfileComponent } from './profile/profile.component';
import { ThemeSettingComponent } from './theme-setting/theme-setting.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';

import { LoaderComponent } from './loader/loader.component';

//import { ManageAdminComponent } from './manage-admin/manage-admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    LoaderComponent,
    RegisterComponent,
    //DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ForgotPasswordComponent,
    TermsAndConditionComponent,
    ProfileComponent,
    ThemeSettingComponent,
    LoginLayoutComponent,
    AuthLayoutComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    LogoutComponent,

  //  ManageAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule ,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgSelectModule
  ],

  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.CaptchaSiteKey,
    } as RecaptchaSettings,
  }]
})
export class AdminModule { }
