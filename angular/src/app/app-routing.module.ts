import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';


const routes: Routes = [

  { path: '', loadChildren: () => import('./front/front.module').then(m => m.FrontModule)},

  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  {  path:  'page-not-found', component:  PageNotFoundComponent },
  {  path:  'access-denied', component:  AccessDeniedComponent },
  {  path:  '**', redirectTo:  'page-not-found' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
