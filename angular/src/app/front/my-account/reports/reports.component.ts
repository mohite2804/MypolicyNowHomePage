import { Component, OnInit,Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router,Params} from  '@angular/router';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BrowserModule } from '@angular/platform-browser'

import { FormBuilder, FormGroup,FormArray,FormControl, Validators } from  '@angular/forms';
import { environment } from '../../../../environments/environment';

//npm install --save @ng-select/ng-select

@Component({ selector: 'app-reports', templateUrl: './reports.component.html',
styleUrls: ['./reports.component.css'] }) 
export class ReportsComponent implements OnInit {


  result : any;
  results : any;
  loaderActive: boolean = false;
  loginUserId  : any;
  token:any;
  currentTimeInMilliseconds:any;
  dtOptions: DataTables.Settings = {};
  base_url = environment.baseUrl;
  business_data:any;
  ic_data:any;
  busin_name:any;
  

 


  
  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
  }

    ngOnInit(): void {


      this.loginUserId = sessionStorage.getItem("user_id");
      this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.currentTimeInMilliseconds=new Date().toLocaleString();
      this.getIndex();
      
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
   
    let sendData = new FormData();
    this.loaderActive = true;
    this.ic_data = [
        { "id": 0, "name": "Available" },
        { "id": 1, "name": "Ready" },
        { "id": 2, "name": "Started" }
    ];
    /* this.commonService.getDashboardReports(sendData)
    .subscribe(response => {
      this.results = response;
      this.loaderActive = false;
      
      //  console.log(this.results);

       this.business_data= this.results.dash_data;
       this.ic_data= this.results.insurance_data;
        console.log(this.ic_data);
         

    }); */
   
  }



}

