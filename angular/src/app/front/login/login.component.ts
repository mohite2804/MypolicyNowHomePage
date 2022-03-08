import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;
  loaderActive: boolean = false;
  invalidLoginMessage: any;
  outputResult : any;
  captchaRequired: boolean = false;
  captchaCount: any = 0;


  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      //sessionStorage.clear();
      if(sessionStorage.getItem('userId')){
          this.router.navigate(['/home']);
      }
      //alert('inn');
      this.submitForm = this.formBuilder.group({
          user_name : ['',Validators.required],
          password : ['',Validators.required],
          captcha_google : [''],

      });

    }



    submitFormDetails(){
      this.submitted = true;
      if(this.submitForm.invalid){
        return;
      }

      this.loaderActive = true;
      let uploadData = new FormData();
      uploadData.append('user_name',this.submitForm.value.user_name);
      uploadData.append('password',this.submitForm.value.password);
      uploadData.append('login_type',"web");
      //uploadData.append('captcha',this.submitForm.value.captcha);
      uploadData.append('captcha_count',this.captchaCount);


      this.commonService.submitLogin(uploadData)
      .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){
          sessionStorage.setItem('user_full_name', outputResult.login_details.first_name);
          sessionStorage.setItem('user_token', outputResult.user_token);
          sessionStorage.setItem('user_email', outputResult.email);
          sessionStorage.setItem('user_mobile', outputResult.mobile_no);
          sessionStorage.setItem('user_type_id', outputResult.login_details.user_type_id);
          sessionStorage.setItem('user_id', outputResult.login_details.user_master_id);
          sessionStorage.setItem('pos_master_id', outputResult.login_details.pos_master_id);
          sessionStorage.setItem('isUserLoggedin', outputResult.status);
          sessionStorage.setItem('theme_css', outputResult.login_details.theme_css);
          sessionStorage.setItem('theme_logo', outputResult.login_details.theme_logo);
          sessionStorage.setItem('business_partner_id', outputResult.login_details.business_partner_id);
          sessionStorage.setItem('business_partner_code', outputResult.login_details.partner_code);
          if(outputResult.login_details.user_type_id == 5){
            sessionStorage.setItem('razor_customer_id', outputResult.login_details.razor_customer_id_for_misp_login);
          }else{
            sessionStorage.setItem('razor_customer_id', outputResult.login_details.razor_customer_id);
          }


          sessionStorage.setItem('pro_image', outputResult.login_details.profile_image);
          sessionStorage.setItem('public_path', outputResult.public_path);

          this.captchaCount = 0;
          //alert(outputResult.redirect);
          this.router.navigate([outputResult.redirect]);
        }else{
          this.captchaCount = outputResult.captcha_count;
          this.invalidLoginMessage = outputResult.message
          if(this.captchaCount > 3){
            this.captchaRequired = true;
            this.submitForm.get("captcha_google").setValidators([Validators.required]);
            this.submitForm.get("captcha_google").updateValueAndValidity();
          }
        }

      });

      //
    }


    showCaptcha(){
      this.captchaRequired = true;
      this.submitForm.get('captcha').setValidators(Validators.required);

    }
    resetForm(){
      this.submitForm.patchValue({
        'user_name' : '',
        'password' : '',
        'captcha' : ''
      });

    }

}
