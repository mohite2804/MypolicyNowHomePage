import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../environments/environment';

import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	sessionTimeoutInSeconds = environment.sessionTimeoutInSeconds;

	isUserLoggedin : any;
	isAdminLoggedin : any;

	constructor(@Inject(DOCUMENT) private document: Document,private bnIdle: BnNgIdleService, private router: Router) {

      // if('localhost' == document.location.hostname){
      //   sessionStorage.setItem('business_partner_code', "ISUZU");
      //   this.loadStyle('isuzu.css');
      // }


	    this.bnIdle.startWatching(this.sessionTimeoutInSeconds).subscribe((res) => {

	      	if(res) {
	      		this.isUserLoggedin = sessionStorage.getItem("isUserLoggedin"); //dp login
	      		this.isAdminLoggedin = sessionStorage.getItem("isAdminLoggedin"); //admin login
	      		if((this.isUserLoggedin!='' && this.isUserLoggedin!=null && this.isUserLoggedin!=undefined) || (this.isAdminLoggedin!='' && this.isAdminLoggedin!=null && this.isAdminLoggedin!=undefined)){
	      			console.log("session expired");
		          	Swal.fire({
		                title: 'Session Timeout',
		                html: 'It seems that you have been idle. You are logged out from this session?',
		                confirmButtonText: 'Login Again',
                    	timer: 20000
		            }).then((result) => {
		            	if(this.isUserLoggedin!='' && this.isUserLoggedin!=null && this.isUserLoggedin!=undefined){
		                	this.router.navigate(['/logout']);
		                }
		                else
		                if(this.isAdminLoggedin!='' && this.isAdminLoggedin!=null && this.isAdminLoggedin!=undefined){
		                	this.router.navigate(['/admin/logout']);
		                }
		            });
	      		}
	      	}
	    })
	  }



    loadStyle(styleName: string) {
      const head = this.document.getElementsByTagName('head')[0];

      let themeLink = this.document.getElementById(
        'client-theme'
      ) as HTMLLinkElement;
      if (themeLink) {
        themeLink.href = styleName;
      } else {
        const style = this.document.createElement('link');
        style.id = 'client-theme';
        style.rel = 'stylesheet';
        style.href = `${styleName}`;

        head.appendChild(style);
      }
    }




}











