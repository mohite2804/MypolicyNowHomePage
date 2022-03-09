import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LevelsComponent } from './levels/levels.component';
import { ManageLevelsComponent } from './manage-levels/manage-levels.component';

const routes: Routes = [
	{ path : 'levels', component : LevelsComponent },
	{ path : 'manage-level', component : ManageLevelsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchyRoutingModule { }
