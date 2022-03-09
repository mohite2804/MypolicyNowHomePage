import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;
  loaderActive: boolean = false;
  result : any;

  loginUserId  : any;
  token  : any;

  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    window.location.reload();
    this.loginUserId = sessionStorage.getItem("user_id");
    this.token = sessionStorage.getItem("user_token");

    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.getDashboardData();
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
              this.router.navigate(['/logout']);
          });
        }



      });
  }



  getDashboardData(){
    let uploadData = new FormData();
    uploadData.append('user_id',sessionStorage.getItem('user_id'));
    this.commonService.getDashboardData(uploadData)
      .subscribe(response => {
        var result  : any = response;

    });

  }

}
