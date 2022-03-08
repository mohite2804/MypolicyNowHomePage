import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  minPassLen = environment.minPasswordLength;
  maxPassLen = environment.maxPasswordLength;

  submitted : boolean =  false;  
  result : any;
  loaderActive: boolean = false;
  submitForm: FormGroup;
  responseMsg : any;
  msgClass: any;
  display : any;

  submitFormOtp: FormGroup;
  responseMsgOtp : any;
  msgClassOtp: any;
  displayOtp : any;

  submitFormOtpValidate: FormGroup;
  responseMsgOtpValidate : any;
  msgClassOtpValidate: any;
  displayOtpValidate : any;

  responseMsgConfirmPassword: any;
  displayConfirmPassword : any;

  displayOtpValidateSuccess : any;

  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }
  ngOnInit(): void {

    //email send form
    this.submitForm = this.formBuilder.group({
      email : ['',Validators.required]      
    });

    //otp send form
    this.displayOtp = 'none';
    this.submitFormOtp = this.formBuilder.group({
      otp : ['',Validators.required]
    });

    //change password
    this.displayOtpValidate = 'none';
    this.submitFormOtpValidate = this.formBuilder.group({
      password : ['',[Validators.required,Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,12}$')]],
      confirmPassword : ['',Validators.required]
      
    });

    //login button
    this.displayOtpValidateSuccess = 'none';
  }

    submitFormDetails(){
      this.submitted = true;
      if(this.submitForm.invalid){
        return;
      }
      this.loaderActive = true;
      let uploadData = new FormData();  
      uploadData.append('email',this.submitForm.value.email);  
      uploadData.append('type','submit-request');  

      this.commonService.submitForgotPassword(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          this.submitted = false;
          Swal.fire(this.result.message, '', "success");
          this.display = 'none';      //hide email send form
          this.displayOtp = 'block';  //show otp form
        }else{
          this.msgClass = "alert-danger";
          this.responseMsg = this.result.message; 
        }
        
      });

      //
    }

    resetForm(){
      this.submitFormOtpValidate.patchValue({       
        'password' : '',
        'confirmPassword' : ''
      });

    }

    submitFormDetailsOtp(){
      this.submitted = true;
      if(this.submitFormOtp.invalid){
        return;
      }
      this.loaderActive = true;
      let uploadData = new FormData();  
      uploadData.append('email',this.submitForm.value.email);    
      uploadData.append('otp',this.submitFormOtp.value.otp);
      uploadData.append('type','submit-otp'); 

      this.commonService.submitForgotPassword(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          this.submitted = false;
          Swal.fire(this.result.message, '', "success");
          this.display = 'none';      //hide email send form
          this.displayOtp = 'none';   //hide otp form
          this.displayOtpValidate = 'block';   //show change password form
        }else{
          this.msgClassOtp = "alert-danger";
          this.responseMsgOtp = this.result.message; 
        }
        
      });
    }

    submitFormDetailsOtpValidate(){
      this.submitted = true;
      if(this.submitFormOtpValidate.invalid){
        return;
      }

      var password = this.submitFormOtpValidate.value.password;
      var confirmPassword = this.submitFormOtpValidate.value.confirmPassword;

      if(password!=confirmPassword){
        this.responseMsgConfirmPassword = "New password & confirm password does not match."; 
        return
      }
      else{
        this.responseMsgConfirmPassword = "";
      }

      this.loaderActive = true;
      let uploadData = new FormData();  
      uploadData.append('email',this.submitForm.value.email);    
      uploadData.append('password',password);
      uploadData.append('confirmPassword',confirmPassword);
      uploadData.append('type','submit-password'); 

      this.commonService.submitForgotPassword(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          this.resetForm()
          Swal.fire(this.result.message, '', "success");
          this.display = 'none';      //hide email send form
          this.displayOtp = 'none';   //hide otp form
          this.displayOtpValidate = 'none';   //hide change password form
          this.displayOtpValidateSuccess = 'block';  //show login button
        }else{
          this.msgClassOtpValidate = "alert-danger";
          this.responseMsgOtpValidate = this.result.message; 
        }
        
      });
    }

    resendOtp(){
      this.loaderActive = true;
      let uploadData = new FormData();  
      uploadData.append('email',this.submitForm.value.email);    
      uploadData.append('type','submit-request');  

      this.commonService.submitForgotPassword(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          this.submitted = false;
          Swal.fire(this.result.message, '', "success");
          this.display = 'none';      //hide email send form
          this.displayOtp = 'block';  //show otp form
        }else{
          this.displayOtp = 'block';
          this.msgClassOtp = "alert-danger";
          this.responseMsgOtp = this.result.message; 
        }
        
      });
    }
}
