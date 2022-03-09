import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './share/admin.guard';

import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
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


const routes: Routes = [
  { 
    path: '', 
    component: LoginLayoutComponent,
    children : [
      {  path:  '', component:  LoginComponent },
      {  path:  'login', component:  LoginComponent } ,
      {  path:  'register', component:  RegisterComponent },
      {  path:  'forgot-password', component:  ForgotPasswordComponent },
      {  path:  'reset-password', component:  ResetPasswordComponent }, 
      {  path:  'terms', component:  TermsAndConditionComponent },

    ]
  },

  { 
    path: '', 
    component: AuthLayoutComponent,
    canActivate: [AdminGuard],
    children : [
      {  path:  '', component:  DashboardComponent },
      {  path:  'dashboard', component:  DashboardComponent },  
      {  path:  'reports', component:  ReportsComponent }, 
       
      {  path:  'profile', component:  ProfileComponent },
      {  path:  'theme-setting', component:  ThemeSettingComponent },
      {  path:  'change-password', component:  ChangePasswordComponent }, 
      {  path:  'logout', component:  LogoutComponent }, 

      

      
      { path: 'manage-motor', loadChildren: () => import('./manage-motor/manage-motor.module').then(m => m.ManageMotorModule) },

       { path: 'manage-common', loadChildren: () => import('./manage-common/manage-common.module').then(m => m.ManageCommonModule) },
       
       { path: 'manage-admin', loadChildren: () => import('./manage-admin/manage-admin.module').then(m => m.ManageAdminModule) }, 
      
      { path: 'hierarchy', loadChildren: () => import('./hierarchy/hierarchy.module').then(m => m.HierarchyModule) },

    ]
  }

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
