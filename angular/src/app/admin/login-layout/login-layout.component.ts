import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {



  loaderActive: boolean = false;
  login_result : any;
  url_value : any;
  theme_css : any;
  constructor(private commonService: CommonService,private router: Router) { }
  @ViewChild('set_login_theme') set_login_theme:ElementRef;


  ngOnInit(){
    this.getIndex();
  }


  ngAfterViewInit() {
    this.getIndex();
  }

  getIndex(){
    this.loaderActive = true;
    let uploadData = new FormData();

    uploadData.append('url_href',window.location.href);
    uploadData.append('url_hostname',window.location.hostname);
    uploadData.append('url_pathname',window.location.pathname);
    uploadData.append('url_protocol',window.location.protocol);

    this.commonService.getCssLogoByUrl(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
      this.loaderActive = false;
      if(outputResult.status){
        this.login_result = outputResult.result;
        this.theme_css = this.login_result.theme_css;
        this.set_login_theme.nativeElement.href = this.theme_css;
        sessionStorage.setItem('theme_css', this.theme_css);
        //sessionStorage.setItem('theme_logo', outputResult.login_details.theme_logo);

      }

    });
  }

}
