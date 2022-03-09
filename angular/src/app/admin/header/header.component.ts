import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  dynamicLogoUrl:any;
  dynamic_css : any;
  @ViewChild('set_theme') set_theme:ElementRef;
  constructor() { }

  ngOnInit(): void {
    this.dynamicLogoUrl = sessionStorage.getItem('logo_img');
    this.dynamic_css  = sessionStorage.getItem('theme_css');
  }

  ngAfterViewInit() {
    if(this.dynamic_css){
      this.set_theme.nativeElement.href = this.dynamic_css;
    }
  }

}
