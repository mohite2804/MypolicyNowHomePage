import { Component, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit  {

  admin_name :any;
  dynamicLogoUrl:any;
  dynamic_css : any;


  constructor() { }
  topBarColor : any = 'navbar-secondary';

  ngOnInit(): void {
    this.admin_name = sessionStorage.getItem('admin_first_name')+" "+sessionStorage.getItem('admin_last_name');
    console.log('app-auth-layout');
    this.dynamicLogoUrl = sessionStorage.getItem('logo_img');
    this.dynamic_css  = sessionStorage.getItem('theme_css');
  }



  receiveTopBarColor($event){
    this.topBarColor = $event;


  }




}
