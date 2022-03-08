import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutPageComponent } from './aboutus-page/aboutus-page.component';




const routes: Routes = [

  {  path:  '', component:  LandingPageComponent },
  {  path:  'new-landing-page', component:  LandingPageComponent },
  {  path:  'aboutus-page', component:  AboutPageComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class FrontRoutingModule { }
