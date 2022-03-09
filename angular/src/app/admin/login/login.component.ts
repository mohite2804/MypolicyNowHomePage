import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { CommonService } from '../services/common.service';
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

  constructor(private commonService : CommonService, private router: Router , private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
        email : ['',Validators.required],
        password : ['',Validators.required],
        captcha_google : ['']
    });
  }

  submitLoginFormData(){
    this.submitted = true;
    if(this.submitForm.invalid){
      return;
    }
    this.loaderActive = true;
    const uploadData = new FormData();
    uploadData.append('email',this.submitForm.value.email);
    uploadData.append('password',this.submitForm.value.password);
    uploadData.append('captcha_count',this.captchaCount);
    this.commonService.submitLoginFormData(uploadData)
    .subscribe( response => {
       this.loaderActive = false;
      var result : any  = response;
      console.log(result);
      if(result.status){
        console.log('admin login data:-');
        console.log(result.result[0]);
        if(result.is_isuzu_arr){
          if(result.is_isuzu_arr.partner_code=='ISUZU'){
            sessionStorage.setItem('is_isuzu', '1');
          }else{
            sessionStorage.setItem('is_isuzu', '0');
          }
          sessionStorage.setItem('partner_code', result.is_isuzu_arr.partner_code);
        }
        if(result.logo_data){
          sessionStorage.setItem('logo_img', result.logo_data);
        }
        sessionStorage.setItem('admin_user_hib_token', result.admin_user_token);
        sessionStorage.setItem('isAdminLoggedin', 'true');
        sessionStorage.setItem('adminUserId', result.result[0].id);
        sessionStorage.setItem('adminUserTypeId', result.result[0].admin_user_type_id);
        sessionStorage.setItem('adminUserRoleId', result.result[0].role_id);
        sessionStorage.setItem('icId', result.result[0].ic_id);
        sessionStorage.setItem('adminMenuIds', result.result[0].admin_menu_ids);
        sessionStorage.setItem('email', result.result[0].email);
        sessionStorage.setItem('admin_first_name', result.result[0].first_name);
        sessionStorage.setItem('admin_last_name', result.result[0].last_name);
        sessionStorage.setItem('adminUserName', result.result[0].username);
        sessionStorage.setItem('adminSideMenuBar', JSON.stringify(result.sidebar));
        sessionStorage.setItem('adminPermissions', JSON.stringify(result.permission));
        sessionStorage.setItem('role_code', result.rolo_data.code);
        sessionStorage.setItem('access_permission', result.rolo_data.access_permission);

        console.log('login admin dashboard........');

        this.router.navigateByUrl('/admin/dashboard');



      }else{
        this.captchaCount = result.captcha_count;
        this.invalidLoginMessage = result.message
        if(this.captchaCount > 3){
          this.captchaRequired = true;
          this.submitForm.get("captcha_google").setValidators([Validators.required]);
          this.submitForm.get("captcha_google").updateValueAndValidity();
        }
      }

    });


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
