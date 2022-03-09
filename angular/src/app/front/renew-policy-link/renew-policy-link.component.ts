import { Component, OnInit,Renderer2,ViewChild  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomvalidationService } from '../services/customvalidation.service';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute} from  '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-renew-policy',
  templateUrl: './renew-policy-link.component.html',
  styleUrls: ['./renew-policy-link.component.css']
})
export class RenewPolicyLinkComponent implements OnInit {
  base_url = environment.baseUrl;
  mainJsPath = environment.mainJsPath;

  formchSearchDetails: FormGroup;
  submiteedSearchDetails: boolean = false;

  quoteData : any ;
  result_salutation : any;
  quote_hit_data: any;
  loaderActive: boolean = false;
  renew_share_link : any;
  ic_ids : any;

  div_show_do_you_have_previous_policy : boolean = false;
  div_show_for_previous_policy_extra_data : boolean = true;
  div_show_owner_details : boolean = false;

  maxDateForBirthdate : any;
  minDateForBirthdate : any;

  date_picker_owner_dob: NgbDateStruct;

  gst_state_code_check_for_individual : any ;

  validation_for_reg_1 :any = "^[a-zA-Z]{1,3}$";
  validation_for_reg_2 :any = "^[0-9]{4,4}$";


  validation_for_number_only :any = "^[0-9]*$";
  validation_for_engine_no :any = "^([a-zA-Z0-9_-]){5,22}$";
  validation_for_chassis_no :any = "^([a-zA-Z0-9_-]){17}$";
  validation_for_policy_no :any = "^([a-zA-Z0-9\/])+$";
  validation_for_electriacal :any = "^[0-9]{3,6}$";
  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_pincode :any =  "^[0-9]{6}$";
  validation_for_name_with_space :any = "^[a-zA-Z_ ]*$";
  validation_for_character :any = "^[a-zA-Z\'\-]+$";

  //validation_for_email :any = "^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  validation_for_address :any = "^[a-zA-Z0-9_ ]*$";

  validation_for_aadhar_card :any = "^[0-9]{12}$";
  validation_for_appointee_age :any = "^[1-9]{1}[0-9]{1}$";
  validation_for_age :any = "^[0-9]{1,2}$";

  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_company_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";

  validation_for_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  validation_for_company_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  ncb : boolean = false;
  engine_no : any;
  made_claim :any;

  constructor(private activatedRoute : ActivatedRoute,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private customvalidationService: CustomvalidationService) {

    //this.loaderActive = true;
    this.loadScripts();
      const current = new Date();


    this.maxDateForBirthdate = {
      year: current.getFullYear() - 18,
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.minDateForBirthdate = {
      year: current.getFullYear() - 99,
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {

    sessionStorage.removeItem('unique_ref_no');
    sessionStorage.removeItem('is_imported');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('product_type_id');



    this.renew_share_link =  this.activatedRoute.snapshot.paramMap.get('renew_share_link');
    this.ic_ids =  this.activatedRoute.snapshot.paramMap.get('ic_ids');
    this.engine_no =  this.activatedRoute.snapshot.paramMap.get('engine_no');


    this.formchSearchDetails = this.formBuilder.group({
      change_owner_ship : ['false'],
      made_claim : ['false']
    });
    this.getIndex();
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('renew_share_link',this.renew_share_link);
    sendData.append('ic_ids',this.ic_ids);
    sendData.append('engine_no',this.engine_no);
    this.commonService.getRenewPolicyDataList(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any = response;
      this.quoteData = output_result.result;
      this.result_salutation = output_result.salutation;
      this.quote_hit_data = output_result.quote_hit_data;
      this.formchSearchDetails.patchValue(
        {made_claim : output_result.result.is_prev_claimed });
      //this.made_claim = this.formchSearchDetails.value.made_claim;

    });



  }

  loadScripts() {
    //const externalScriptArray = ['/assets/front/js/main.js'];
    const externalScriptArray = [this.mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }



   maidClaim(event,from_data){
     console.log(event);
    if(event == 'true' || event == true){
      this.ncb = true;
    }else{
      this.ncb = false;
    }
  }

  changeOwnerShip(event){
    if(event == 'true'){
      this.div_show_owner_details = true;
      this.div_show_for_previous_policy_extra_data = false;
    }else{
      this.div_show_owner_details = false;
      this.div_show_for_previous_policy_extra_data = true;
    }

  }





  strToBool(s){
    let regexpboolean: RegExp = /^\s*(true|1|on)\s*$/i;
      return regexpboolean.test(s);
  }

  submitConfirmDetails(){
    this.submiteedSearchDetails = true;
    if(this.formchSearchDetails.value.change_owner_ship == 'true'){
        if(this.formchSearchDetails.invalid){
          return;
        }
    }

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('change_owner_ship',this.formchSearchDetails.value.change_owner_ship);
    uploadData.append('made_claim',this.formchSearchDetails.value.made_claim);
    uploadData.append('renew_share_link',this.renew_share_link);
    uploadData.append('ic_ids',this.ic_ids);
    uploadData.append('engine_no',this.engine_no);

    this.commonService.renewPolicyGenerateQuote(uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;

        if(outputResult.status){
          sessionStorage.setItem('unique_ref_no', outputResult.unique_ref_no);
          sessionStorage.setItem('is_imported', outputResult.is_imported);
          sessionStorage.setItem('user_id', outputResult.user_id);
          sessionStorage.setItem('product_type_id', outputResult.product_type_id);
          sessionStorage.setItem('reg_no', outputResult.reg_no);
        }

        console.log(outputResult.link);
        this.router.navigate([outputResult.link]);
       //this.router.navigate(['/share/commercial-misc-d-quote/TUgwNUZLOTE3Mw==/NiwyMg==']);

        // if(outputResult.product_type_id==1){
        //   this.router.navigate(['/share/car-insurance-quote/'+outputResult.reg_no+'/'+this.ic_ids]);
        // }else{
        //   this.router.navigate(['/share/bike-insurance-quote/'+outputResult.reg_no+'/'+this.ic_ids]);
        // }

        // console.log(outputResult);
        // if(outputResult.status){
        //   sessionStorage.setItem('unique_ref_no', outputResult.unique_ref_no);
        //   sessionStorage.setItem('active_ic_for_quote', outputResult.active_ic_for_quote);
        //   this.router.navigate(['/share/quotation']);
        // }
    });


  }

  submitFormSearchDetails(){

    this.submiteedSearchDetails = true;
    if(this.formchSearchDetails.value.change_owner_ship == 'true'){
        if(this.formchSearchDetails.invalid){
          return;
        }
    }

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('change_owner_ship',this.formchSearchDetails.value.change_owner_ship);
    uploadData.append('made_claim',this.formchSearchDetails.value.made_claim);
    uploadData.append('renew_share_link',this.renew_share_link);
    uploadData.append('ic_ids',this.ic_ids);
    this.commonService.renewPolicyGenerateQuote(uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        console.log(outputResult);
        if(outputResult.status){
          sessionStorage.setItem('unique_ref_no', outputResult.unique_ref_no);
          sessionStorage.setItem('user_id', outputResult.user_id);

          sessionStorage.setItem('active_ic_for_quote', outputResult.active_ic_for_quote);
          this.router.navigate(['/share/quotation']);
        }
    });


  }




}
