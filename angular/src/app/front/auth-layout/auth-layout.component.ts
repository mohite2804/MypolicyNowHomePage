import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit  {

  constructor() { }
  topBarColor : any = 'navbar-secondary';

  ngOnInit(): void {
  
  }

  receiveTopBarColor($event){
    this.topBarColor = $event;

  }




}
