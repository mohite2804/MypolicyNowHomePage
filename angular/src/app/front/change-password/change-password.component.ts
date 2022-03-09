import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  minPassLen = environment.minPasswordLength;
  maxPassLen = environment.maxPasswordLength;
  submitForm: FormGroup;
  submitted : boolean =  false;  
  result : any;
  loaderActive: boolean = false;
  responseMsgError : any;
  responseMsg : any;
  msgClass: any;
  display : any;

  loginUserId  : any;
  token  : any;

  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      OldPassword : ['',Validators.required],
      password : ['',[Validators.required,Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[A-Za-z0-9\d#?!@$%^&*-_]).{8,12}$')]],
      confirmPassword : ['',Validators.required]
      
    });
    this.loginUserId = sessionStorage.getItem("user_id");
    this.token = sessionStorage.getItem("user_token");

    this.validateUserLoginStatus(this.loginUserId,this.token);
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

   submitFormDetails(){
      this.submitted = true;
      if(this.submitForm.invalid){
        return;
      }
      
      var OldPassword = this.submitForm.value.OldPassword;
      var password = this.submitForm.value.password;
      var confirmPassword = this.submitForm.value.confirmPassword;

      if(password!=confirmPassword){
        this.responseMsg = "New password & confirm password does not match."; 
        return
      }
      else{
        this.responseMsg = "";
      }

      this.loaderActive = true;
      let uploadData = new FormData();  

      uploadData.append('OldPassword',OldPassword);
      uploadData.append('password',password);
      uploadData.append('confirmPassword',confirmPassword);
      uploadData.append('userid',this.loginUserId);

      this.commonService.submitChangePassword(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          this.resetForm()
          //Swal.fire(this.result.message, '', "success");
          this.msgClass = "alert-success";
          this.responseMsgError = this.result.message;
          Swal.fire(this.responseMsgError);
          this.router.navigate(['/logout']);
        }else{
          this.msgClass = "alert-danger";
          this.responseMsgError = this.result.message; 
          
        }

        
        
      });

      //
    }

    resetForm(){
      this.submitted = false;
      this.submitForm.patchValue({
        'OldPassword' : '',
        'password' : '' ,
        'confirmPassword' : ''   
      });

    }

}
