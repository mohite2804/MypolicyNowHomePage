import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { timers } from 'jquery';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  dynamic_css : any;
  @ViewChild('set_theme') set_theme:ElementRef;

  constructor() {

  }

  ngOnInit(): void {
    this.dynamic_css  = sessionStorage.getItem('theme_css');
  }

  ngAfterViewInit() {
    if(this.dynamic_css){
      this.set_theme.nativeElement.href = this.dynamic_css;
    }
  }


}
