import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router,Params} from  '@angular/router';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';

import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { environment } from '../../../environments/environment';

//npm install --save @ng-select/ng-select

@Component({ selector: 'app-reports', templateUrl: './reports.component.html',
styleUrls: ['./reports.component.css'] }) export class ReportsComponent
implements OnInit {

	result : any;
  results : any;
	loaderActive: boolean = false;
	loginUserId  : any;
  token:any;
  currentTimeInMilliseconds:any;
  dtOptions: DataTables.Settings = {};
  base_url = environment.baseUrl;
  business_data:any;
  busin_name:any;
  buisness_partner_name:any;
	is_isuzu  : any;
  dp_name:any;
  misp_name:any;
 


  
  	constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { 
      this.is_isuzu = sessionStorage.getItem("is_isuzu");
    }

  	ngOnInit(): void {


  		this.loginUserId = sessionStorage.getItem("adminUserId");
    	this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.currentTimeInMilliseconds=new Date().toLocaleString();
      this.getIndex();

      this.dp_name='POS';
      this.misp_name='Business Partner';
      if(this.is_isuzu==1){
        this.dp_name='DP';
        this.misp_name='MISP';
      }

      
     //  this.applyDateFilter();

  	}

	validateUserLoginStatus(loginUserId,token){
		this.loaderActive = true;
		let uploadData = new FormData();

		uploadData.append('loginUserId',this.loginUserId);
		uploadData.append('token',token);

		this.commonService.validateUserLoginStatus(uploadData)
		.subscribe(response => {
			this.result = response;
			this.loaderActive = false;
			if(this.result.status){
				//valid status i.e. not login from another location
			}else{
				Swal.fire({
					title: 'error',
					html: 'It seems that you have login from another location. You are logged out from this session?',
					timer: 3500
				}).then((result) => {
					this.router.navigate(['/login']);
				});
			}
		});
	}


  getIndex(){
    console.log('test pro..............');
    let sendData = new FormData();
    console.log(this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('skip_product','1');
    // this.loaderActive = true;
    this.commonService.getDashboardReports(sendData)
    .subscribe(response => {
      this.results = response;
      this.loaderActive = false;
      if(this.results.status == 'Success')
      {
        this.business_data = this.results.dash_data;
      }
      this.loaderActive = false;
      //alert(this.results.dash_data);
        // if(this.results.status == 'Success')
        //  {
        //   this.business_data=[];
        //   var business_partner=[];
        //   for(var i in this.results.business_partner) 
        //     {
        //      // alert(this.results.business_partner[i]);
        //       this.business_data.push({title : this.results.business_partner[i]});

        //     }
        //   this.business_data=JSON.stringify(this.business_data);
        //   alert(this.business_data);
        // }

    });
   //alert(this.base_url+'myaccount/get_dashboard_reports');
  }



}

