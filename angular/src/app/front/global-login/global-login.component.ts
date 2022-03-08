import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-global-login',
  templateUrl: './global-login.component.html',
  styleUrls: ['./global-login.component.css']
})
export class GlobalLoginComponent implements OnInit {



  loaderActive: boolean = false;
  invalidLoginMessage: any;
  outputResult: any;
  captchaRequired: boolean = false;
  captchaCount: any = 0;
  submitFormDetails:any=0;
  accesskey_key: any = 0;
  timestamp: any = 0;
  dealer_code_encode: any =0;
  mybizznow_name: any = 0;
  mybizznow_url:any=0;
  extraparameter:any;
  submitForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,private commonService: CommonService, public router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //sessionStorage.clear();
    this.accesskey_key = this.activatedRoute.snapshot.paramMap.get('accesskey_key');
    this.timestamp = this.activatedRoute.snapshot.paramMap.get('timestamp');
    this.dealer_code_encode = this.activatedRoute.snapshot.paramMap.get('dealer_code_encode');
    this.mybizznow_name = this.activatedRoute.snapshot.paramMap.get('mybizznow_name');
    this.mybizznow_url = this.activatedRoute.snapshot.paramMap.get('mybizznow_url');
    this.extraparameter = this.activatedRoute.snapshot.paramMap.get('extraparameters');



    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('timestamp', this.timestamp);
    uploadData.append('dealer_code_encode', this.dealer_code_encode);
    uploadData.append('accesskey_key', this.accesskey_key);
    uploadData.append('login_type', "biz");
    uploadData.append('mybizznow_name', this.mybizznow_name);
    uploadData.append('mybizznow_url', this.mybizznow_url);
    if (this.extraparameter){
      uploadData.append('extraparameter', this.extraparameter);
    }


    this.commonService.submitLogin(uploadData)
      .subscribe(response => {
        var outputResult: any = response;
        this.loaderActive = false;
        if (outputResult.status) {
         // console.log(outputResult);
          sessionStorage.setItem('user_full_name', outputResult.login_details.full_name);
          sessionStorage.setItem('user_token', outputResult.user_token);
          sessionStorage.setItem('user_email', outputResult.email);
          sessionStorage.setItem('user_mobile', outputResult.mobile_no);
          sessionStorage.setItem('user_type_id', outputResult.login_details.user_type_id);
          sessionStorage.setItem('user_id', outputResult.login_details.user_master_id);
          sessionStorage.setItem('isUserLoggedin', outputResult.status);
          sessionStorage.setItem('theme_css', outputResult.login_details.theme_css);
          sessionStorage.setItem('theme_logo', outputResult.login_details.theme_logo);
          sessionStorage.setItem('business_partner_id', outputResult.login_details.business_partner_id);
          sessionStorage.setItem('business_partner_code', outputResult.login_details.partner_code);
          if (outputResult.login_details.user_type_id == 5) {
            sessionStorage.setItem('razor_customer_id', outputResult.login_details.razor_customer_id_for_misp_login);
          } else {
            sessionStorage.setItem('razor_customer_id', outputResult.login_details.razor_customer_id);
          }
          sessionStorage.setItem('pro_image', outputResult.login_details.profile_image);
          sessionStorage.setItem('public_path', outputResult.public_path);

          this.captchaCount = 0;
          //alert(outputResult.redirect);
          this.router.navigate([outputResult.redirect]);
        } else {

          this.invalidLoginMessage = outputResult.message
          Swal.fire({
            title: this.invalidLoginMessage,
            confirmButtonText: `OK`,

          }).then((result) => {
            window.location.href = outputResult.redirect;

          })




        }

      });




  }







}
