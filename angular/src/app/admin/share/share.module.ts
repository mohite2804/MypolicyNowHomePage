import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { Router } from  '@angular/router';


@NgModule({
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule

  ]
})
export class ShareModule { }
