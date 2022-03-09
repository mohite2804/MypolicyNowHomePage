import { Component, OnInit,Renderer2,ViewChild  } from '@angular/core';
import { environment } from '../../../environments/environment';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomvalidationService } from '../services/customvalidation.service';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute } from  '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common'; 


@Component({
  selector: 'app-customer-detail-motor',
  templateUrl: './customer-detail-motor.component.html',
  styleUrls: ['./customer-detail-motor.component.css']
})
export class CustomerDetailMotorComponent implements OnInit {

  quote_no : any ;
  selected_ic_id : any ;
  product_type_id : any ;
  is_breakin : any ;
  bike_breakin_days: any ;
  nominee_relation : any;
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;
  loaderActive: boolean = false;
  is_dealer_url_with_login : boolean = true;
  formQuoteDetails: FormGroup;
  submittedQuoteDetails: boolean = false;
  gst_state_code_check_for_individual : any ;
  gst_state_code_check_for_corporate : any ;
  previousPolicy_sub_type_id : any;
  quick_quote_checked : boolean = false;
  search_message  : any ;
  div_show_for_appointee : boolean = false;
  div_show_company_details : boolean = false;
  div_show_owner_details : boolean = false;
  div_show_nominee_details : boolean = false;
  div_previous_policy_details_section : boolean = true;
  div_show_for_previous_policy_expiry_date_od : boolean = true;
  div_previous_policy_TP : boolean = true;
  div_show_hypothecation_section : boolean = false;
  result_banks : any;
  result_city : any;
  result_proposer_types : any;
  result_relations : any;
  result_relationsForNominee : any;
  result_relationsForAppoint : any;
  result_vehicle_color : any;
  result_salutation : any;
  result_agreement_types : any;
  result_selected_quote_data : any;
  relations_id_data : any;
  loginUserId : any;
  loginUserType : any;
  result_ic_master : any;
  div_show_for_previous_policy_expiry_date : boolean = false;
  date_picker_owner_dob: NgbDateStruct;
  date_picker_nominee_dob: NgbDateStruct;
  date_picker_appointee_dob: NgbDateStruct;
  validation_for_policy_no :any = "^([a-zA-Z0-9-/\/])+$";
  validation_for_number_only :any = "^[0-9]*$";
  validation_for_engine_no :any = "^(?!0{22})([a-zA-Z0-9]){5,22}$";
  validation_for_reg_1 :any = "^[a-zA-Z0-9]{1,3}$";
  validation_for_reg_2 :any = "^[0-9]{4,4}$";
  validation_for_chassis_no :any = "^(?!0{17})([a-zA-Z0-9]){17}$";
  validation_for_pincode :any =  "^[0-9]{6}$";
  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_character :any = "^[a-zA-Z]+$";
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  validation_for_address :any = "^[a-zA-Z0-9][a-zA-Z0-9 \,\-\/]*$";
  validation_for_aadhar_card :any = "^[2-9]{1}[0-9]{11}$";
  validation_for_appointee_age :any = "^[1-9]{1}[0-9]{1}$";
  validation_for_age :any = "^[0-9]{1,2}$";
  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_company_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_gst_no :any         = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  validation_for_company_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  setNullDate : any;
  minCurrentDate : any;
  maxDateForBirthdate : any;
  minDateForBirthdate : any;
  unique_ref_no : any;
  selectedHypothecation_agrement : any;
  selectedHypothecation_bank : any;
  selectedHypothecation_city : any;
  selected_vehicle_color: any;
  url_read_only : boolean = false;
  url_engine_no : any;
  url_selected_ic : any;
  policy_sub_type_id : any;
  result_appointeebyid : any;
  result_rto : any;
  selectedRto : any;
  company_pan_no_required: boolean = false;
  user_pan_no_required: boolean = false;
  reg_no_required: boolean = false;


  upload_pdf_url:any;
  upload_pdf_label:any;
  upload_pdf_url_label:''
  is_set_from_api_for_upload_pdf_url : boolean = false;
  public_path : any;

  upload_pdf_od_upload_real_time:any;
  upload_pdf_tp_upload_real_time:any;

  upload_pre_policy_pdf : boolean = false;
  upload_tp_pdf_url:any;
  upload_tp_pdf_label:any;
  upload_tp_pdf_url_label:''
  is_set_from_api_for_upload_tp_pdf_url : boolean = false;

  prev_policy_sub_type_id : any;
  selected_product_type_details : any;
  token  : any;
  url_unique_ref_no: any;
  business_partner :any;
  maxDateForBirth :any;
  maxDateForBirthdateElec:any;
  is_elec:any;

  constructor( private activatedRoute : ActivatedRoute, private renderer: Renderer2, private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    this.loaderActive = true;
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
    this.maxDateForBirth = {
      year: current.getFullYear() - 9,
      month: current.getMonth() + 11,
      day: current.getDate()
    };
    this.maxDateForBirthdateElec = {
      year: current.getFullYear() - 14,
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  changeSelectBox(form_control_name,selected_value){
    if(selected_value){
      switch (form_control_name) {
        case 'hypothecation_agrement':
          this.formQuoteDetails.patchValue({hypothecation_agrement : selected_value });
          break;
        case 'hypothecation_bank':
          this.formQuoteDetails.patchValue({hypothecation_bank : selected_value });
          break;
        case 'hypothecation_city_id':
          this.formQuoteDetails.patchValue({hypothecation_city_id : selected_value });
          break;
        case 'vehicle_color':
          this.formQuoteDetails.patchValue({vehicle_color : selected_value });
          break;
        // case 'rto':
        //   this.formQuoteDetails.patchValue({rto : selected_value });
        //   break;
      }
    }
  }

  changeSalutation(val){
    let gender='female';
    if(val==1){
      gender='male';
    }
    this.formQuoteDetails.patchValue({
      owner_gender : gender,
    });
  }

  changeMaritalStatus(val){
  let MaritalStatus='Single';
  if(val==2){
    MaritalStatus='Married';
  }

  this.formQuoteDetails.patchValue({
    owner_marital_status : MaritalStatus,
  });
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {
      case 'hypothecation_agrement':
        this.formQuoteDetails.patchValue({hypothecation_agrement : '' });
        this.selectedHypothecation_agrement = null;
        break;

      case 'hypothecation_bank':
        this.formQuoteDetails.patchValue({hypothecation_bank : '' });
        this.selectedHypothecation_bank = null;
        break;

      case 'hypothecation_city_id':
          this.formQuoteDetails.patchValue({hypothecation_city_id : '' });
          this.selectedHypothecation_city = null;
          break;

      case 'vehicle_color':
        this.formQuoteDetails.patchValue({vehicle_color : '' });
        this.selected_vehicle_color = null;
        break;

        case 'rto':
          this.formQuoteDetails.patchValue({rto : '' });
          this.selectedRto = null;
          break;

    }
  }

  strToBool(s){
    let regexpboolean: RegExp = /^\s*(true|1|on)\s*$/i;
      return regexpboolean.test(s);
  }

  calculateDaysBetweenDay(date_1,date_2){
      var date1 : any = new Date(date_1);
      var date2 : any = new Date(date_2);
      var diffTime : any = Math.abs(date2 - date1);
      var diffDays : any = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
  }

  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    if(field == 'owner_dob'){
      this.formQuoteDetails.patchValue({ owner_dob : selected_date });
    }
    if(field == 'nominee_dob'){
      this.formQuoteDetails.patchValue({ nominee_dob : selected_date });
      const current_date = new Date();
        var nominee_dob : any = this.formQuoteDetails.value.nominee_dob;
        const convertAge = new Date(nominee_dob);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        var showAge :any = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
        
        this.nomineeAge(showAge,'server',1);
    }
    if(field == 'appointee_dob'){
      this.formQuoteDetails.patchValue({ appointee_dob : selected_date });
    }
  }

  selectDateForAngular(field,selected_date){

      var selected_date :any = new Date(selected_date);
      var current :any = new Date();
      var year : any =  selected_date.getFullYear();
      var month : any =  selected_date.getMonth() + 1;
      var day : any =  selected_date.getDate();
      var set_date :any= { year: year, month: month, day: day };
      day  = (day < 10 ? '0' : '') + day;
      month = (month < 10 ? '0' : '') + month;
      year =  year;
      var selected_date_for_form : any = year +'-'+ month +'-'+ day;
      if(field == 'owner_dob'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_owner_dob = set_date;
          this.formQuoteDetails.patchValue({ owner_dob : selected_date_for_form });
        }
      }
      if(field == 'nominee_dob'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_nominee_dob =set_date;
          this.formQuoteDetails.patchValue({ nominee_dob : selected_date_for_form });
        }
      }
      if(field == 'appointee_dob'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_appointee_dob =set_date;
          this.formQuoteDetails.patchValue({ appointee_dob : selected_date_for_form });
        }
      }
      
  }

  ngOnInit(): void {
    sessionStorage.removeItem('policy_no');
    sessionStorage.removeItem('transaction_no');
    sessionStorage.removeItem('proposal_no');
    sessionStorage.removeItem('active_ic_for_quote');



    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.selected_ic_id = sessionStorage.getItem('selected_ic_id');
    this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
    this.token = sessionStorage.getItem("user_token");
    this.business_partner = sessionStorage.getItem('business_partner_code');

    if(this.router.url == '/share/customer-detail-motor'){
      this.is_dealer_url_with_login = false;
    }else{
      this.validateUserLoginStatus(this.loginUserId,this.token);
    }

    if(this.loginUserType == 5){
      Swal.fire({
        title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })

    }else{
        this.loaderActive = true;
        this.validationFormQuoteDetails();
        this.url_engine_no  =  this.activatedRoute.snapshot.paramMap.get('engine_no');
        this.url_selected_ic  =  this.activatedRoute.snapshot.paramMap.get('selected_ic');
        this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
        this.quote_no  = sessionStorage.getItem('quote_no');
        this.getIndex();
    }
  }


  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        var result_abc : any = response;
       // this.loaderActive = false;
        if(result_abc.status){
          //valid status i.e. not login from another location
        }else{
          Swal.fire({position: 'center',icon: 'error',title: "Please try again.", showConfirmButton: false, timer: 3000 });
        }



      });
  }

  changeOwnerPincode(event){
    var is_vallid :any = this.formQuoteDetails.controls.owner_pincode.status;
    if(event.target.value.length == 6 && is_vallid != "INVALID"){
      this.formQuoteDetails.patchValue({ owner_city : '', owner_state : ''});
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('pin_code',event.target.value);
      this.commonService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.gst_state_code_check_for_individual = result.state_city.gst_state_code;
          this.formQuoteDetails.patchValue({
            owner_pincode_id : result.state_city.pincode_id,
            owner_city_id : result.state_city.city_id,
            owner_state_id : result.state_city.state_id,
            owner_city : result.state_city.cityname,
            owner_state   : result.state_city.statename
          });
        }else{
          Swal.fire(result.message, '', 'error');
          this.formQuoteDetails.patchValue({
            owner_pincode_id : "",
            owner_city_id : "",
            owner_state_id : "",
            owner_city : "",
            owner_state   : ""
          });
        }
      });
    }
  }

  changeCompanyPincode(event){
    var is_vallid :any = this.formQuoteDetails.controls.company_owner_pincode.status;
    if(event.target.value.length == 6 && is_vallid != "INVALID"){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('pin_code',event.target.value);
      this.commonService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.gst_state_code_check_for_corporate = result.state_city.gst_state_code;
          this.formQuoteDetails.patchValue({
            company_owner_pincode_id : result.state_city.pincode_id,
            company_owner_city_id : result.state_city.city_id,
            company_owner_state_id : result.state_city.state_id,
            company_owner_city : result.state_city.cityname,
            company_owner_state   : result.state_city.statename
          });

        }else{
          Swal.fire(result.message, '', 'error');
          this.formQuoteDetails.patchValue({
            company_owner_pincode_id : "",
            company_owner_city_id : "",
            company_owner_state_id : "",
            company_owner_city : "",
            company_owner_state   : ""
          });
        }
      });
    }
  }

 getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('quote_no',this.quote_no);
    sendData.append('unique_ref_no',this.unique_ref_no);
    sendData.append('is_customer_detail_page','1');
    sendData.append('selected_ic_id',this.selected_ic_id);
    this.commonService.getConfirmDetails(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any = response;

      this.selected_product_type_details=output_result.selected_product_type_details;

      this.relations_id_data=output_result.relations_id_data;
      this.result_selected_quote_data = output_result.quote_data;
      if(this.result_selected_quote_data.vehicle_fuel =='ELECTRIC')
      {
        this.is_elec = true;
      }else
      {
        this.is_elec =false;
      }
      this.product_type_id = output_result.quote_data.product_type_id;
      this.is_breakin = output_result.quote_data.is_breakin;
      this.bike_breakin_days = output_result.quote_data.bike_breakin_days;
      this.result_banks = output_result.bank_master;
      this.result_city = output_result.city_master;
      this.result_salutation = output_result.salutation;
      this.result_relations = output_result.relations;
      this.result_rto = output_result.rto;
      this.result_agreement_types = output_result.agreement_types;
      this.result_proposer_types = output_result.proposer_types;
      this.result_vehicle_color = output_result.vehicle_color;
      this.result_ic_master = output_result.ic_master;
      this.result_relationsForNominee=this.result_relations;
      this.result_relationsForAppoint=this.result_relations;
      this.public_path=output_result.public_path;
      this.prev_policy_sub_type_id=output_result.quote_data.prev_policy_type_id;
      this.upload_pdf_url=output_result.public_path+'/pre-policy-pdf/'+output_result.quote_data.pre_policy_pdf;
      this.upload_tp_pdf_url=output_result.public_path+'/pre-policy-pdf/'+output_result.quote_data.pre_year_tp_policy_pdf;
      this.upload_pdf_od_upload_real_time=output_result.public_path+"pdf_image.png";
      this.upload_pdf_tp_upload_real_time=output_result.public_path+"pdf_image.png";
      if(output_result.quote_data.pre_policy_pdf){
        this.is_set_from_api_for_upload_pdf_url = true;
      }
      if(output_result.quote_data.pre_year_tp_policy_pdf){
        this.is_set_from_api_for_upload_tp_pdf_url = true;
      }
      if(this.result_selected_quote_data){
        this.setSelectedQuoteData();
      }
    });
 }

 selectPolicyHolderType(proposer_type_id){
  if(proposer_type_id == 1){
    this.div_show_owner_details  = true;
    this.div_show_nominee_details = true;
    this.div_show_company_details = false;
    this.div_show_for_appointee = false;
    this.setValidationForIndividudal();
  }else{
    this.div_show_company_details = true;
    this.div_show_owner_details  = false;
    this.div_show_nominee_details = false;
    this.div_show_for_appointee = false;
    this.setValidationForCorporate();
  }

}

  setSelectedQuoteData(){
    if(this.result_selected_quote_data){

      if( this.url_engine_no != null){
        this.loginUserId = this.result_selected_quote_data.user_id;
      }
      this.validationONPolicyType(this.result_selected_quote_data.policy_type_id);
      this.selectPolicySubType(this.result_selected_quote_data.policy_subtype_id);
      this.selectDateForAngular('owner_dob',this.result_selected_quote_data.proposer_dob);
      this.selectPolicyHolderType(this.result_selected_quote_data.proposer_type_id);
      if(this.result_selected_quote_data.policy_type_id != 1){
        this.previousPolicy(this.result_selected_quote_data.is_prev_policy_available);
      }
      this.selectDateForAngular('nominee_dob',this.result_selected_quote_data.nominee_dob);
      this.selectDateForAngular('appointee_dob',this.result_selected_quote_data.appointee_dob);
      this.nomineeRelationType('nominee',this.result_selected_quote_data.nominee_salutation_id);
      this.nomineeRelationType('appointee',this.result_selected_quote_data.appointee_salutation_id);
      if(this.selected_ic_id == '22')
      {
        const current_date = new Date();
        var nominee_dob : any = this.result_selected_quote_data.nominee_dob;
        const convertAge = new Date(nominee_dob);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        var showAge :any = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
        
        this.nomineeAge(showAge,'server',this.result_selected_quote_data.proposer_type_id);
      }else
      {
        this.nomineeAge(this.result_selected_quote_data.nominee_age,'server',this.result_selected_quote_data.proposer_type_id);
      }
      this.selectedHypothecation_agrement = (this.result_selected_quote_data.agreement_type_id == "") ? null : this.result_selected_quote_data.agreement_type_id;
      this.selectedHypothecation_bank = (this.result_selected_quote_data.agreement_financiar_id == "") ? null : this.result_selected_quote_data.agreement_financiar_id;
      this.selectedHypothecation_city = (this.result_selected_quote_data.hypothecation_city_id == "") ? null : this.result_selected_quote_data.hypothecation_city_id;

      this.selected_vehicle_color = (this.result_selected_quote_data.vehicle_color_id == "") ? null : this.result_selected_quote_data.vehicle_color_id;
      this.selectedRto = this.result_selected_quote_data.rto_id;

      this.formQuoteDetails.patchValue({
        engine_no : this.result_selected_quote_data.engine_no,
        chassis_no : this.result_selected_quote_data.chassis_no,
        vehicle_color : this.result_selected_quote_data.vehicle_color_id,

        reg_no_1 : (this.result_selected_quote_data.registration_no_part_3 == 'null' || this.result_selected_quote_data.registration_no_part_3 == 0) ? '' : this.result_selected_quote_data.registration_no_part_3,
        reg_no_2 : (this.result_selected_quote_data.registration_no_part_4 == 'null' || this.result_selected_quote_data.registration_no_part_4 == 0) ? '' : this.result_selected_quote_data.registration_no_part_4,

        previose_policy_no_tp  : this.result_selected_quote_data.other_tp_policy_no,
        previose_insurance_company_tp  : this.result_selected_quote_data.other_tp_ic_id,

        previose_policy_no : (this.result_selected_quote_data.prev_policy_no == 0 ) ? "" : this.result_selected_quote_data.prev_policy_no,
        previose_insurance_company : this.result_selected_quote_data.prev_insurance_company_id,

        owner_salutation : this.result_selected_quote_data.proposer_salutation_id,
        owner_first_name : this.result_selected_quote_data.proposer_first_name,
        owner_middle_name : this.result_selected_quote_data.proposer_middle_name,
        owner_last_name : this.result_selected_quote_data.proposer_last_name,
        owner_email : this.result_selected_quote_data.proposer_email,
        owner_mobile : this.result_selected_quote_data.proposer_mobile_no,
        owner_dob : this.result_selected_quote_data.proposer_dob,
        owner_gender : this.result_selected_quote_data.proposer_gender,
        owner_marital_status : this.result_selected_quote_data.company_owner_marital_status,
        owner_address_1 : this.result_selected_quote_data.proposer_address1,
        owner_address_2 : this.result_selected_quote_data.proposer_address2,
        owner_pincode : this.result_selected_quote_data.proposer_pincode,
        owner_pincode_id : this.result_selected_quote_data.proposer_pincode_id,
        owner_city_id : this.result_selected_quote_data.proposer_city_id,
        owner_state_id : this.result_selected_quote_data.proposer_state_id,
        owner_city : this.result_selected_quote_data.proposer_city,
        owner_state : this.result_selected_quote_data.proposer_state,
        owner_pan : (this.result_selected_quote_data.proposer_pan_no != 0) ? this.result_selected_quote_data.proposer_pan_no : '',
        owner_aadhaar : this.result_selected_quote_data.proposer_adhaar_no,
        owner_gst : this.result_selected_quote_data.proposer_gst_no,

        nominee_salutation : this.result_selected_quote_data.nominee_salutation_id,
        nominee_first_name : this.result_selected_quote_data.nominee_first_name,
        nominee_middle_name : this.result_selected_quote_data.nominee_middle_name,
        nominee_last_name : this.result_selected_quote_data.nominee_last_name,
        nominee_age : this.result_selected_quote_data.nominee_age,
        nominee_dob : this.result_selected_quote_data.nominee_dob,
        nominee_relation : this.result_selected_quote_data.nominee_relationship_id,

        appointee_salutation : this.result_selected_quote_data.appointee_salutation_id,
        appointee_first_name : this.result_selected_quote_data.appointee_first_name,
        appointee_middle_name : this.result_selected_quote_data.appointee_middle_name,
        appointee_last_name : this.result_selected_quote_data.appointee_last_name,
        appointee_age : this.result_selected_quote_data.appointee_age,
        appointee_relation : this.result_selected_quote_data.appointee_relationship_id,
        appointee_dob : this.result_selected_quote_data.appointee_dob,

        company_salutation : this.result_selected_quote_data.company_salutation_id,
        company_name : this.result_selected_quote_data.company_name,
        company_gst_no : this.result_selected_quote_data.company_gst_no,
        company_pan_no : this.result_selected_quote_data.company_pan_no,

        company_owner_salutation : this.result_selected_quote_data.company_owner_salutation_id,
        company_owner_fisrt_name : this.result_selected_quote_data.company_owner_fisrt_name,
        company_owner_middle_name : this.result_selected_quote_data.company_owner_middle_name,
        company_owner_last_name : this.result_selected_quote_data.company_owner_last_name,
        company_owner_email : this.result_selected_quote_data.company_owner_email,
        company_owner_mobile : this.result_selected_quote_data.company_owner_mobile,
        company_owner_address_1 : this.result_selected_quote_data.company_owner_address_1,
        company_owner_address_2 : this.result_selected_quote_data.company_owner_address_2,
        company_owner_pincode : this.result_selected_quote_data.company_owner_pincode,
        company_owner_city : this.result_selected_quote_data.company_owner_city,
        company_owner_state : this.result_selected_quote_data.company_owner_state,
        company_owner_pincode_id : this.result_selected_quote_data.company_owner_pincode_id,
        company_owner_city_id : this.result_selected_quote_data.company_owner_city_id,
        company_owner_state_id : this.result_selected_quote_data.company_owner_state_id,


        hypothecation_agrement : this.result_selected_quote_data.agreement_type_id,
        hypothecation_bank : this.result_selected_quote_data.agreement_financiar_id,
        hypothecation_city_id : this.result_selected_quote_data.hypothecation_city_id,
        rto : this.result_selected_quote_data.rto_id


      });

    }
  }

  setValidationForIndividudal(){
    this.formQuoteDetails.get("owner_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("owner_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("owner_first_name").setValidators([
        Validators.required,
        Validators.pattern(this.validation_for_name_with_space),
        Validators.minLength(2),
        Validators.maxLength(25),

    ]);

    this.formQuoteDetails.get("owner_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_middle_name").setValidators([
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("owner_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("owner_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_email").setValidators([
      Validators.pattern(this.validation_for_email), Validators.required]);
    this.formQuoteDetails.get("owner_email").updateValueAndValidity();

    this.formQuoteDetails.get("owner_mobile").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_mobile_no)

    ]);
    this.formQuoteDetails.get("owner_mobile").updateValueAndValidity();

    this.formQuoteDetails.get("owner_dob").setValidators([Validators.required]);
    this.formQuoteDetails.get("owner_dob").updateValueAndValidity();

    this.formQuoteDetails.get("owner_gender").setValidators([Validators.required]);
    this.formQuoteDetails.get("owner_gender").updateValueAndValidity();

    // this.formQuoteDetails.get("owner_marital_status").setValidators([Validators.required]);
    // this.formQuoteDetails.get("owner_marital_status").updateValueAndValidity();

    this.formQuoteDetails.get("owner_marital_status").setValidators([]);
    this.formQuoteDetails.get("owner_marital_status").updateValueAndValidity();

    this.formQuoteDetails.get("owner_address_1").setValidators([
      Validators.pattern(this.validation_for_address),
      this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required
    ]);
    this.formQuoteDetails.get("owner_address_1").updateValueAndValidity();

    this.formQuoteDetails.get("owner_address_2").setValidators([
      Validators.pattern(this.validation_for_address),
      this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required
    ]);
    this.formQuoteDetails.get("owner_address_2").updateValueAndValidity();


    this.formQuoteDetails.get("owner_pincode").setValidators([Validators.min(1),Validators.pattern(this.validation_for_pincode),Validators.required]);
    this.formQuoteDetails.get("owner_pincode").updateValueAndValidity();

    this.formQuoteDetails.get("owner_city").setValidators([Validators.required]);
    this.formQuoteDetails.get("owner_city").updateValueAndValidity();

    this.formQuoteDetails.get("owner_state").setValidators([Validators.required]);
    this.formQuoteDetails.get("owner_state").updateValueAndValidity();

    if(this.result_selected_quote_data.gross_premium > 50000){
      this.formQuoteDetails.get("owner_pan").setValidators([Validators.pattern(this.validation_for_pan),Validators.required]);
      this.formQuoteDetails.get("owner_pan").updateValueAndValidity();
      this.user_pan_no_required=true;
      }else{
      this.formQuoteDetails.get("owner_pan").setValidators([Validators.pattern(this.validation_for_pan)]);
      this.formQuoteDetails.get("owner_pan").updateValueAndValidity();
      this.user_pan_no_required=false;
    }

    this.formQuoteDetails.get("owner_aadhaar").setValidators([
      Validators.pattern(this.validation_for_aadhar_card)
    ]);
    this.formQuoteDetails.get("owner_aadhaar").updateValueAndValidity();

    this.formQuoteDetails.get("owner_gst").setValidators([Validators.pattern(this.validation_for_gst_no)]);
    this.formQuoteDetails.get("owner_gst").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_first_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_middle_name").setValidators([
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_last_name").updateValueAndValidity();
  if(this.selected_ic_id == '22')
  {
    this.formQuoteDetails.get("nominee_age").setValidators([]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();
  }else
  {
    this.formQuoteDetails.get("nominee_age").setValidators([this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age),Validators.required]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();
  }

    this.formQuoteDetails.get("nominee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_relation").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_first_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_middle_name").setValidators([
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("nominee_last_name").updateValueAndValidity();
    if(this.selected_ic_id == '22')
    {
      this.formQuoteDetails.get("nominee_age").setValidators([]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();
    this.formQuoteDetails.get("nominee_dob").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_dob").updateValueAndValidity();

    }else
    {
      this.formQuoteDetails.get("nominee_age").setValidators([this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age),Validators.required]);
      this.formQuoteDetails.get("nominee_age").updateValueAndValidity();
      this.formQuoteDetails.get("nominee_dob").setValidators([]);
    this.formQuoteDetails.get("nominee_dob").updateValueAndValidity();

    }

    this.formQuoteDetails.get("nominee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_relation").updateValueAndValidity();

    
    this.resetCompanyDetails();


  }


  resetCompanyDetails(){
    this.formQuoteDetails.get("company_salutation").setValidators([]);
    this.formQuoteDetails.get("company_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("company_name").setValidators([]);
    this.formQuoteDetails.get("company_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_gst_no").setValidators([]);
    this.formQuoteDetails.get("company_gst_no").updateValueAndValidity();

    this.formQuoteDetails.get("company_pan_no").setValidators([]);
    this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_salutation").setValidators([]);
    this.formQuoteDetails.get("company_owner_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_fisrt_name").setValidators([]);
    this.formQuoteDetails.get("company_owner_fisrt_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_middle_name").setValidators([]);
    this.formQuoteDetails.get("company_owner_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_last_name").setValidators([]);
    this.formQuoteDetails.get("company_owner_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_email").setValidators([]);
    this.formQuoteDetails.get("company_owner_email").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_mobile").setValidators([]);
    this.formQuoteDetails.get("company_owner_mobile").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_address_1").setValidators([]);
    this.formQuoteDetails.get("company_owner_address_1").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_address_2").setValidators([]);
    this.formQuoteDetails.get("company_owner_address_2").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_pincode").setValidators([]);
    this.formQuoteDetails.get("company_owner_pincode").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_city").setValidators([]);
    this.formQuoteDetails.get("company_owner_city").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_state").setValidators([]);
    this.formQuoteDetails.get("company_owner_state").updateValueAndValidity();


    this.formQuoteDetails.patchValue({
      company_salutation : '4',
      company_name : '',
      company_gst_no : '',
      company_pan_no : '',
      company_owner_salutation : '',
      company_owner_fisrt_name : '',
      company_owner_middle_name : '',
      company_owner_last_name : '',
      company_owner_email : '',
      company_owner_mobile : '',
      company_owner_address_1 : '',
      company_owner_address_2 : '',
      company_owner_pincode : '',
      company_owner_city : '',
      company_owner_state : ''
    });

  }

  resetOwnerDetails(){

    this.date_picker_owner_dob =  this.setNullDate;
    this.date_picker_nominee_dob =  this.setNullDate;
    this.date_picker_appointee_dob =  this.setNullDate;    

    this.formQuoteDetails.get("owner_salutation").setValidators([]);
    this.formQuoteDetails.get("owner_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("owner_first_name").setValidators([]);
    this.formQuoteDetails.get("owner_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_middle_name").setValidators([]);
    this.formQuoteDetails.get("owner_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_last_name").setValidators([]);
    this.formQuoteDetails.get("owner_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("owner_email").setValidators([]);
    this.formQuoteDetails.get("owner_email").updateValueAndValidity();

    this.formQuoteDetails.get("owner_mobile").setValidators([]);
    this.formQuoteDetails.get("owner_mobile").updateValueAndValidity();

    this.formQuoteDetails.get("owner_dob").setValidators([]);
    this.formQuoteDetails.get("owner_dob").updateValueAndValidity();

    this.formQuoteDetails.get("owner_gender").setValidators([]);
    this.formQuoteDetails.get("owner_gender").updateValueAndValidity();

    this.formQuoteDetails.get("owner_marital_status").setValidators([]);
    this.formQuoteDetails.get("owner_marital_status").updateValueAndValidity();

    this.formQuoteDetails.get("owner_address_1").setValidators([]);
    this.formQuoteDetails.get("owner_address_1").updateValueAndValidity();

    this.formQuoteDetails.get("owner_address_2").setValidators([]);
    this.formQuoteDetails.get("owner_address_2").updateValueAndValidity();

    this.formQuoteDetails.get("owner_pincode").setValidators([]);
    this.formQuoteDetails.get("owner_pincode").updateValueAndValidity();

    this.formQuoteDetails.get("owner_city").setValidators([]);
    this.formQuoteDetails.get("owner_city").updateValueAndValidity();

    this.formQuoteDetails.get("owner_state").setValidators([]);
    this.formQuoteDetails.get("owner_state").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_salutation").setValidators([]);
    this.formQuoteDetails.get("nominee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_first_name").setValidators([]);
    this.formQuoteDetails.get("nominee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_middle_name").setValidators([]);
    this.formQuoteDetails.get("nominee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_last_name").setValidators([]);
    this.formQuoteDetails.get("nominee_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_age").setValidators([]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_relation").setValidators([]);
    this.formQuoteDetails.get("nominee_relation").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_dob").setValidators([]);
    this.formQuoteDetails.get("nominee_dob").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_salutation").setValidators([]);
    this.formQuoteDetails.get("appointee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_first_name").setValidators([]);
    this.formQuoteDetails.get("appointee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_middle_name").setValidators([]);
    this.formQuoteDetails.get("appointee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_last_name").setValidators([]);
    this.formQuoteDetails.get("appointee_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_age").setValidators([]);
    this.formQuoteDetails.get("appointee_age").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_relation").setValidators([]);
    this.formQuoteDetails.get("appointee_relation").updateValueAndValidity();
    
    this.formQuoteDetails.get("appointee_dob").setValidators([]);
    this.formQuoteDetails.get("appointee_dob").updateValueAndValidity();




  }

  setValidationForCorporate(){
    this.resetOwnerDetails();


    this.formQuoteDetails.get("company_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("company_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("company_name").setValidators([Validators.pattern(this.validation_for_name_with_space),Validators.required]);
    this.formQuoteDetails.get("company_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_gst_no").setValidators([Validators.pattern(this.validation_for_company_gst_no)]);
    this.formQuoteDetails.get("company_gst_no").updateValueAndValidity();

    if(this.result_selected_quote_data.gross_premium > 50000){
    this.formQuoteDetails.get("company_pan_no").setValidators([Validators.pattern(this.validation_for_company_pan),Validators.required]);
    this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();
    this.company_pan_no_required=true;
    }else{
    this.formQuoteDetails.get("company_pan_no").setValidators([Validators.pattern(this.validation_for_company_pan)]);
    this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();
    this.company_pan_no_required=false;
    }

    this.formQuoteDetails.get("company_owner_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("company_owner_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_fisrt_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("company_owner_fisrt_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_middle_name").setValidators([
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("company_owner_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("company_owner_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_email").setValidators([Validators.pattern(this.validation_for_email),Validators.required]);
    this.formQuoteDetails.get("company_owner_email").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_mobile").setValidators([Validators.pattern(this.validation_for_mobile_no),Validators.required]);
    this.formQuoteDetails.get("company_owner_mobile").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_address_1").setValidators([
      Validators.pattern(this.validation_for_address),
      this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required
    ]);
    this.formQuoteDetails.get("company_owner_address_1").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_address_2").setValidators([
      Validators.pattern(this.validation_for_address),
      this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required
    ]);
    this.formQuoteDetails.get("company_owner_address_2").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_pincode").setValidators([Validators.pattern(this.validation_for_pincode),Validators.required]);
    this.formQuoteDetails.get("company_owner_pincode").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_city").setValidators([Validators.required]);
    this.formQuoteDetails.get("company_owner_city").updateValueAndValidity();

    this.formQuoteDetails.get("company_owner_state").setValidators([Validators.required]);
    this.formQuoteDetails.get("company_owner_state").updateValueAndValidity();

    this.formQuoteDetails.patchValue({
      owner_salutation : '',
      owner_first_name : '',
      owner_middle_name : '',
      owner_last_name : '',
      owner_email : '',
      owner_mobile : '',
      owner_dob : '',
      owner_gender : '',
      owner_marital_status : '',
      owner_address_1 : '',
      owner_address_2 : '',
      owner_pincode : '',
      owner_city : '',
      owner_state : '',

      nominee_salutation : '',
      nominee_first_name : '',
      nominee_middle_name : '',
      nominee_last_name : '',
      nominee_age : '',
      nominee_relation : '',
      nominee_dob :'',

      appointee_salutation : '',
      appointee_first_name : '',
      appointee_middle_name : '',
      appointee_last_name : '',
      appointee_age : '',
      appointee_relation : '',
      appointee_dob :''
    });

  }




  nomineeAge(event,from_data,proposer_type_data){
    var event_new : any  =  parseInt(event);
    if(proposer_type_data == 1){
      if(event_new < 18 ){
        this.div_show_for_appointee = true;
        this.setAppointValiation();
      }else{
        this.div_show_for_appointee = false;
        this.resetAppointValiation();
      }
    }
  }

  setAppointValiation(){
    this.formQuoteDetails.get("appointee_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("appointee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_first_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("appointee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space)]);
    this.formQuoteDetails.get("appointee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formQuoteDetails.get("appointee_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_age").setValidators([]);
    this.formQuoteDetails.get("appointee_age").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("appointee_relation").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_dob").setValidators([]);
    this.formQuoteDetails.get("appointee_dob").updateValueAndValidity();

  }

  resetAppointValiation(){

    this.formQuoteDetails.get("appointee_salutation").setValidators([]);
    this.formQuoteDetails.get("appointee_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_first_name").setValidators([]);
    this.formQuoteDetails.get("appointee_first_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_middle_name").setValidators([]);
    this.formQuoteDetails.get("appointee_middle_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_last_name").setValidators([]);
    this.formQuoteDetails.get("appointee_last_name").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_age").setValidators([]);
    this.formQuoteDetails.get("appointee_age").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_relation").setValidators([]);
    this.formQuoteDetails.get("appointee_relation").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_dob").setValidators([]);
    this.formQuoteDetails.get("appointee_dob").updateValueAndValidity();

    this.formQuoteDetails.patchValue({
      appointee_salutation : '',
      appointee_first_name : '',
      appointee_middle_name : '',
      appointee_last_name : '',
      appointee_age : '',
      appointee_relation : '',
      appointee_dob :''
    });

  }


  validationFormQuoteDetails(){

    this.formQuoteDetails = this.formBuilder.group({

      engine_no : ['',[
        Validators.required,
        Validators.pattern(this.validation_for_engine_no)
      ]],
      chassis_no : ['',[Validators.required,Validators.pattern(this.validation_for_chassis_no)]],
      vehicle_color : ['',[Validators.required]],
      rto : ['',[Validators.required]],
      reg_no_1 : ['',[Validators.pattern(this.validation_for_reg_1)]],
      reg_no_2 : ['',[Validators.pattern(this.validation_for_reg_2)]],

      previose_policy_no : [''],
      previose_insurance_company : [''],

      previose_policy_no_tp  : [''],
      previose_insurance_company_tp  : [''],

      owner_salutation : [''],
      owner_first_name : [''],
      owner_middle_name : [''],
      owner_last_name : [''],
      owner_email : [''],
      owner_mobile : [''],
      owner_dob : [''],
      owner_gender : [''],
      owner_marital_status : [''],
      owner_address_1 : [''],
      owner_address_2 : [''],
      owner_pincode : [''],
      owner_pincode_id : [''],
      owner_city_id : [''],
      owner_state_id : [''],
      owner_city : [''],
      owner_state : [''],
      owner_pan : ['',[Validators.pattern(this.validation_for_pan)]],
      owner_aadhaar : [''],
      owner_gst : ['',[Validators.pattern(this.validation_for_gst_no)]],

      nominee_salutation : [''],
      nominee_first_name : [''],
      nominee_middle_name : [''],
      nominee_last_name : [''],
      nominee_age : [''],
      nominee_dob :[''],
      nominee_relation : [''],

      appointee_salutation : [''],
      appointee_first_name : [''],
      appointee_middle_name : [''],
      appointee_last_name : [''],
      appointee_age : [''],
      appointee_relation : [''],
      appointee_dob :[''],

      company_salutation : ['4'],
      company_name : [''],
      company_gst_no : ['',[Validators.pattern(this.validation_for_company_gst_no)]],
      company_pan_no : ['',[Validators.pattern(this.validation_for_company_pan)]],

      company_owner_salutation : [''],
      company_owner_fisrt_name : [''],
      company_owner_middle_name : [''],
      company_owner_last_name : [''],
      company_owner_email : [''],
      company_owner_mobile : [''],
      company_owner_address_1 : [''],
      company_owner_address_2 : [''],
      company_owner_pincode : [''],
      company_owner_city : [''],
      company_owner_state : [''],

      company_owner_pincode_id : [''],
      company_owner_city_id : [''],
      company_owner_state_id : [''],
      pre_year_tp_policy_pdf : [''],
      hypothecation_agrement : [''],
      hypothecation_bank : [''],
      hypothecation_city_id : [''],
      pre_policy_pdf : [''],

    }, {validator: this.checkNomineeAgeUsingRelation });
  }


  checkNomineeAgeUsingRelation(group: FormGroup) {
    var selected_ic_id_code =sessionStorage.getItem('selected_ic_id');
    if(selected_ic_id_code !='22'){
    var nominee_relation : any = group.get('nominee_relation').value;
    var nominee_age : any = group.get('nominee_age').value;
    if(nominee_relation == 1 || nominee_relation == 2 || nominee_relation == 3 ){
      if(nominee_age < 18){
        return { nomineeAgeRangeUsingRelation: true } ;
      }
    }
   }else
   {
      const current_date = new Date();
      var nominee_relation : any = group.get('nominee_relation').value;
      var nominee_dob : any = group.get('nominee_dob').value;
      const convertAge = new Date(nominee_dob);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      var showAge :any = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      if(nominee_relation == 1 || nominee_relation == 2 || nominee_relation == 3 ){
      if(showAge < 18){
        return { nomineeAgeRangeUsingRelation: true } ;
      }
    }
   }
    return null;
  }

  public findInvalidControls() {
    const invalid = [];
    const form_value = [];
    const controls = this.formQuoteDetails.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            form_value.push(controls[name].invalid);
            invalid.push(name);
        }
    }
    console.log('invalid fields start .....');
    console.log(invalid);
    console.log('invalid fields end.....');
}



  setParameterForSubmitForm(){
    let uploadData = new FormData();
    //uploadData.append('url_selected_ic',this.url_selected_ic);
    uploadData.append('user_id',this.loginUserId);

    uploadData.append('selected_ic_id',this.selected_ic_id);
    uploadData.append('unique_ref_no',this.unique_ref_no);

    uploadData.append('engine_no',this.formQuoteDetails.value.engine_no);
    uploadData.append('chassis_no',this.formQuoteDetails.value.chassis_no);

    // let  rto_id :any = this.formQuoteDetails.value.rto;
    // rto_id = parseInt(rto_id);
    // uploadData.append('rto_id',rto_id);
    uploadData.append('reg_no_1',this.formQuoteDetails.value.reg_no_1);
    uploadData.append('reg_no_2',this.formQuoteDetails.value.reg_no_2);


    uploadData.append('prev_policy_no',this.formQuoteDetails.value.previose_policy_no);
    uploadData.append('prev_insurance_company_id',this.formQuoteDetails.value.previose_insurance_company);

    uploadData.append('other_tp_policy_no',this.formQuoteDetails.value.previose_policy_no_tp);
    uploadData.append('other_tp_ic_id',this.formQuoteDetails.value.previose_insurance_company_tp);

    var  vehicle_color_id :any = this.formQuoteDetails.value.vehicle_color;
    vehicle_color_id = parseInt(vehicle_color_id);
    uploadData.append('vehicle_color_id',vehicle_color_id);


    var  proposer_salutation_id :any = this.formQuoteDetails.value.owner_salutation;
    proposer_salutation_id = parseInt(proposer_salutation_id);
    uploadData.append('proposer_salutation_id',proposer_salutation_id);
    uploadData.append('proposer_first_name',this.formQuoteDetails.value.owner_first_name);
    uploadData.append('proposer_middle_name',this.formQuoteDetails.value.owner_middle_name);
    uploadData.append('proposer_last_name',this.formQuoteDetails.value.owner_last_name);
    uploadData.append('proposer_email',this.formQuoteDetails.value.owner_email);

    var  owner_mobile :any = this.formQuoteDetails.value.owner_mobile;
    owner_mobile = parseInt(owner_mobile);
    uploadData.append('proposer_mobile_no',owner_mobile);

    uploadData.append('proposer_dob',this.formQuoteDetails.value.owner_dob);
    uploadData.append('proposer_gender',this.formQuoteDetails.value.owner_gender);
    uploadData.append('proposer_marital_status',this.formQuoteDetails.value.owner_marital_status);
    uploadData.append('proposer_address1',this.formQuoteDetails.value.owner_address_1);
    uploadData.append('proposer_address2',this.formQuoteDetails.value.owner_address_2);

    var  owner_pincode :any = this.formQuoteDetails.value.owner_pincode;
    owner_pincode = parseInt(owner_pincode);
    uploadData.append('proposer_pincode',owner_pincode);

    var  owner_pincode_id :any = this.formQuoteDetails.value.owner_pincode_id;
    owner_pincode_id = parseInt(owner_pincode_id);
    uploadData.append('proposer_pincode_id',owner_pincode_id);

    var  owner_city_id :any = this.formQuoteDetails.value.owner_city_id;
    owner_city_id = parseInt(owner_city_id);
    uploadData.append('proposer_city_id',owner_city_id);

    var  owner_state_id :any = this.formQuoteDetails.value.owner_state_id;
    owner_state_id = parseInt(owner_state_id);
    uploadData.append('proposer_state_id',owner_state_id);

    uploadData.append('proposer_city',this.formQuoteDetails.value.owner_city);
    uploadData.append('proposer_state',this.formQuoteDetails.value.owner_state);
    uploadData.append('proposer_pan_no',this.formQuoteDetails.value.owner_pan);
    uploadData.append('proposer_adhaar_no',this.formQuoteDetails.value.owner_aadhaar);
    uploadData.append('proposer_gst_no',this.formQuoteDetails.value.owner_gst);

    var  nominee_salutation :any = this.formQuoteDetails.value.nominee_salutation;
    nominee_salutation = parseInt(nominee_salutation);
    uploadData.append('nominee_salutation_id',nominee_salutation);
    uploadData.append('nominee_first_name',this.formQuoteDetails.value.nominee_first_name);
    uploadData.append('nominee_middle_name',this.formQuoteDetails.value.nominee_middle_name);
    uploadData.append('nominee_last_name',this.formQuoteDetails.value.nominee_last_name);
    uploadData.append('nominee_age',this.formQuoteDetails.value.nominee_age);
    if(this.formQuoteDetails.value.nominee_dob != undefined || this.formQuoteDetails.value.nominee_dob !=0 || this.formQuoteDetails.value.nominee_dob !='')
    {
      uploadData.append('nominee_dob',this.formQuoteDetails.value.nominee_dob);
    }else
    {
      uploadData.append('nominee_dob','');
    }
    var  nominee_relation :any = this.formQuoteDetails.value.nominee_relation;
    nominee_relation = parseInt(nominee_relation);
    uploadData.append('nominee_relationship_id',nominee_relation);

    var  appointee_salutation :any = this.formQuoteDetails.value.appointee_salutation;
    appointee_salutation = parseInt(appointee_salutation);
    uploadData.append('appointee_salutation_id',appointee_salutation);
    uploadData.append('appointee_first_name',this.formQuoteDetails.value.appointee_first_name);
    uploadData.append('appointee_middle_name',this.formQuoteDetails.value.appointee_middle_name);
    uploadData.append('appointee_last_name',this.formQuoteDetails.value.appointee_last_name);
    uploadData.append('appointee_age',this.formQuoteDetails.value.appointee_age);
    if(this.formQuoteDetails.value.appointee_dob != undefined || this.formQuoteDetails.value.appointee_dob !=0 || this.formQuoteDetails.value.appointee_dob !='')
    {
      uploadData.append('appointee_dob',this.formQuoteDetails.value.appointee_dob);
    }else
    {
      uploadData.append('appointee_dob','');
    }

    var  appointee_relation :any = this.formQuoteDetails.value.appointee_relation;
    appointee_relation = parseInt(appointee_relation);

    uploadData.append('appointee_relationship_id',appointee_relation);

    var  hypothecation_agrement :any = this.formQuoteDetails.value.hypothecation_agrement;
    hypothecation_agrement = parseInt(hypothecation_agrement);

    uploadData.append('agreement_type_id',hypothecation_agrement);
    var  company_salutation :any = this.formQuoteDetails.value.company_salutation;
    company_salutation = parseInt(company_salutation);

    uploadData.append('company_salutation_id',company_salutation);
    uploadData.append('company_name',this.formQuoteDetails.value.company_name);
    uploadData.append('company_gst_no',this.formQuoteDetails.value.company_gst_no);
    uploadData.append('company_pan_no',this.formQuoteDetails.value.company_pan_no);
    uploadData.append('company_owner_salutation_id',this.formQuoteDetails.value.company_owner_salutation);
    uploadData.append('company_owner_fisrt_name',this.formQuoteDetails.value.company_owner_fisrt_name);
    uploadData.append('company_owner_middle_name',this.formQuoteDetails.value.company_owner_middle_name);
    uploadData.append('company_owner_last_name',this.formQuoteDetails.value.company_owner_last_name);
    uploadData.append('company_owner_email',this.formQuoteDetails.value.company_owner_email);
    uploadData.append('company_owner_mobile',this.formQuoteDetails.value.company_owner_mobile);
    uploadData.append('company_owner_address_1',this.formQuoteDetails.value.company_owner_address_1);
    uploadData.append('company_owner_address_2',this.formQuoteDetails.value.company_owner_address_2);
    uploadData.append('company_owner_pincode',this.formQuoteDetails.value.company_owner_pincode);

    var  company_owner_pincode_id :any = this.formQuoteDetails.value.company_owner_pincode_id;
    company_owner_pincode_id = parseInt(company_owner_pincode_id);
    uploadData.append('company_owner_pincode_id',company_owner_pincode_id);

    var  company_owner_city_id :any = this.formQuoteDetails.value.company_owner_city_id;
    company_owner_city_id = parseInt(company_owner_city_id);
    uploadData.append('company_owner_city_id',company_owner_city_id);

    var  company_owner_state_id :any = this.formQuoteDetails.value.company_owner_state_id;
    company_owner_state_id = parseInt(company_owner_state_id);
    uploadData.append('company_owner_state_id',company_owner_state_id);
    uploadData.append('company_owner_city',this.formQuoteDetails.value.company_owner_city);
    uploadData.append('company_owner_state',this.formQuoteDetails.value.company_owner_state);

    uploadData.append('agreement_financiar_id',this.formQuoteDetails.value.hypothecation_bank);
    uploadData.append('hypothecation_city_id',this.formQuoteDetails.value.hypothecation_city_id);
    uploadData.append('agreement_type_id',hypothecation_agrement);

    uploadData.append('pre_policy_pdf',this.formQuoteDetails.value.pre_policy_pdf);
    uploadData.append('pre_year_tp_policy_pdf',this.formQuoteDetails.value.pre_year_tp_policy_pdf);

    return uploadData;

  }

  submitFormQuoteDetails(){

    this.submittedQuoteDetails = true;
    if(this.formQuoteDetails.invalid){
     this.findInvalidControls();
     console.log(this.formQuoteDetails);
      Swal.fire ("Please fill all mandatory fields",  "" ,  "error" );
     return;
    }

    this.loaderActive = true;
    var uploadData : any = this.setParameterForSubmitForm();

    this.commonService.submitFormCustomerDetails(uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){

          if(this.router.url == '/share/customer-detail-motor'){
            this.router.navigate(['/share/confirm-details']);
          }else{
            this.router.navigate(['/confirm-details']);
          }


        }else{
           Swal.fire(outputResult.message, '', 'error');
        }
    });

  }


  loadScripts() {
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


  checkIsPolicyExist(event){
    if(event.target.value != ""){
      this.loaderActive = true;
      var sendData = new FormData();
          sendData.append('engine_chassis_no',event.target.value);
          this.commonService.checkPolicyExist(sendData)
          .subscribe(response => {
            this.loaderActive = false;
            var result : any  = response;
            if(result.status){
              this.formQuoteDetails.patchValue({
                engine_no : '',
                chassis_no : ''
              });
              Swal.fire (result.msg,  "" ,  "error" );
            }
          });
        }
  }

  editPage(){
    this.router.navigate(['/'+this.selected_product_type_details.next_url]);
  }

    validationONPolicyType(policy_type_id){
    if(policy_type_id == 1){
      this.formQuoteDetails.get("reg_no_1").setValidators([Validators.pattern(this.validation_for_reg_1)]);
      this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
      this.formQuoteDetails.get("reg_no_2").setValidators([Validators.pattern(this.validation_for_reg_2)]);
      this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

      this.reg_no_required=false;

    }else{
      this.formQuoteDetails.get("reg_no_1").setValidators([Validators.pattern(this.validation_for_reg_1)]);
      //this.formQuoteDetails.get("reg_no_1").setValidators([Validators.required,Validators.pattern(this.validation_for_reg_1)]);
      this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
      this.formQuoteDetails.get("reg_no_2").setValidators([this.customvalidationService.registrationNoValidator(),Validators.required,Validators.pattern(this.validation_for_reg_2)]);
      this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

      this.reg_no_required=true;

    }
  }

  checkThirdParty(){
    var policy_sub_type_ids: number[] = [5, 10,11,16,21];
    var find : any = policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find){ return true; }else{ return false; }

  }

  checkStandAloneOd(){
    var policy_sub_type_ids: number[] = [4,20];
    var find : any =  policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find > -1){ return true; }else{ return false; }

  }

  checkComprehnsive(){
    var policy_sub_type_ids: number[] = [3,6,7,8,9,13,14,1,19];
    var find : any =  policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find > -1){ return true; }else{ return false; }
  }

  checkPreviousPolicyIsComprehnsive(){
    var policy_sub_type_ids: number[] = [3,6,7,8,9,13,14,1,19];
    var find : any = policy_sub_type_ids.find(element => element == this.prev_policy_sub_type_id);
    if(find){ return true; }else{ return false; }

  }

  checkPreviousPolicyIsStandAloneOd(){
    var policy_sub_type_ids: number[] = [4,20];
    var find : any = policy_sub_type_ids.find(element => element == this.prev_policy_sub_type_id);
    if(find){ return true; }else{ return false; }

  }

  checkPreviousPolicyIsThirdParty(){
    var policy_sub_type_ids: number[] = [5, 10,11,16,21];
    var find : any = policy_sub_type_ids.find(element => element == this.prev_policy_sub_type_id);
    if(find){ return true; }else{ return false; }

  }

  selectPolicySubType(policy_subtype_id){
    this.policy_sub_type_id  = policy_subtype_id;
  }

    previousPolicy(event){
    if(event == 'true' || event == '1'){
       this.showDivForPreviosPolicy();

       this.resetPreviesSomefieldno();

    }else{
      if(this.policy_sub_type_id == 4){

       this.div_previous_policy_details_section = false;
       this.showDivForPreviosPolicy();
       this.div_previous_policy_TP = false;

       this.resetPreviesSomefieldno();

      }else{

         this.div_previous_policy_details_section = true;
    }

  }
}

  ncb(caseId,d){
    const current_date = new Date();
    var no_of_days : any = this.calculateDaysBetweenDay(d,current_date);
    switch (caseId) {
      case (1):
        this.upload_pre_policy_pdf=true;
      break;
      case (2):
          this.upload_pre_policy_pdf=false;
          if(no_of_days < 90 || this.result_selected_quote_data.is_ncb){
            this.upload_pre_policy_pdf=true;
          }
      break;
      case (3):
          if(no_of_days < 90){
            this.upload_pre_policy_pdf=true;
          }
      break;
      default:
        this.upload_pre_policy_pdf=false;
      break;
    }

    this.policyPDFValidation();

  }

  policyPDFValidation(){
    if(this.upload_pre_policy_pdf && !this.is_set_from_api_for_upload_pdf_url){
      this.formQuoteDetails.get("pre_policy_pdf").setValidators([Validators.required]);
      this.formQuoteDetails.get("pre_policy_pdf").updateValueAndValidity();
    }else{
      this.formQuoteDetails.get("pre_policy_pdf").setValidators([]);
      this.formQuoteDetails.get("pre_policy_pdf").updateValueAndValidity();
    }
    if(this.upload_pre_policy_pdf && !this.is_set_from_api_for_upload_tp_pdf_url && !this.div_previous_policy_TP){
      this.formQuoteDetails.get("pre_year_tp_policy_pdf").setValidators([Validators.required]);
      this.formQuoteDetails.get("pre_year_tp_policy_pdf").updateValueAndValidity();
    }else{
      this.formQuoteDetails.get("pre_year_tp_policy_pdf").setValidators([]);
      this.formQuoteDetails.get("pre_year_tp_policy_pdf").updateValueAndValidity();
    }
  }


  uploadPolicyPDF(flag){
    var foundPreviousStandAlone :  boolean = this.checkPreviousPolicyIsStandAloneOd();
    var foundPreviousComprehnsive :  boolean = this.checkPreviousPolicyIsComprehnsive();
    var foundPreviousThirdParty :  boolean = this.checkPreviousPolicyIsThirdParty();
    //OD expiry date Not Expired
    if(flag){
      if((foundPreviousComprehnsive || foundPreviousStandAlone) && this.result_selected_quote_data.is_breakin==0){
        this.ncb(1,this.result_selected_quote_data.prev_policy_expiry_date_updated);
      }
      if((foundPreviousComprehnsive || foundPreviousStandAlone) && this.result_selected_quote_data.is_breakin==1){
        var i=2;
        if(this.result_selected_quote_data.is_changes_in_ownership==1){i=3;}
        this.ncb(i,this.result_selected_quote_data.prev_policy_expiry_date_updated);
      }

      if(foundPreviousThirdParty){
        var current=new Date();
        var datePipe = new DatePipe('en-US');
        var current_date = new Date(datePipe.transform(current, 'yyyy-MM-dd'));
        var tp_date = new Date(this.result_selected_quote_data.other_tp_policy_expiry_date_updated);

        if(tp_date > current_date){
          this.upload_pre_policy_pdf=false;
          this.policyPDFValidation();
        }

      }
    }
  }

  showDivForPreviosPolicy(){
    var foundThirdParty : boolean = this.checkThirdParty();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive()

    if(foundThirdParty){
      this.ShowDivForPreviosPolicyForThirdParty();
    }
    if(foundStandAlone){
      this.ShowDivForPreviosPolicyForStandAloneOd();
      this.uploadPolicyPDF(foundStandAlone);
    }
    if(foundComprehnsive){
     this.ShowDivForPreviosPolicyForComprehnsive();
     this.uploadPolicyPDF(foundComprehnsive);
    }
    this.formQuoteDetails.patchValue({
      change_owner_ship : 'false',
      previous_policy : 'true',
      previose_policy_no_tp : '',
      previose_insurance_company_tp : '',
      pre_previous_type : '',
      previose_policy_no : '',
      previose_insurance_company : ''
    });

    this.div_previous_policy_details_section = false;
  }

  resetPreviesSomefieldno(){
    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();
  }
  ShowDivForPreviosPolicyForThirdParty(){
   this.div_previous_policy_details_section = false;
   this.div_previous_policy_TP = true;
   this.validationForPreviosPolicyForThirdParty();
  }
  ShowDivForPreviosPolicyForStandAloneOd(){
    this.div_previous_policy_details_section = false;
    this.div_previous_policy_TP = false;
    this.div_show_for_previous_policy_expiry_date_od = false;
    this.validationForPreviosPolicyForStandAloneOd();
  }

  ShowDivForPreviosPolicyForComprehnsive(){

      this.div_previous_policy_details_section = false;
      this.div_previous_policy_TP = true;
      this.validationForPreviosPolicyForComprehnsive();
  }

  validationForPreviosPolicyForComprehnsive(){

    this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

  }

   validationForPreviosPolicyForThirdParty(){

    this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

  }

    validationForPreviosPolicyForStandAloneOd(){

    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();
  }

  nomineeRelationType(type,val){
    if(val==1){
      var ids=this.relations_id_data.id_1;
    }else if(val==2){
      var ids=this.relations_id_data.id_2;
    }else{
      var ids=this.relations_id_data.id_3;
    }
    if(val && ids != undefined){
      if(type=='nominee'){
        this.result_relationsForNominee=this.result_relations;
        ids.forEach( (value) => {
            this.result_relationsForNominee = this.result_relationsForNominee.filter(item =>
              item.nominee_relation_id != value
            );
        })
      }else{
        this.result_relationsForAppoint=this.result_relations;
        ids.forEach( (value) => {
            this.result_relationsForAppoint = this.result_relationsForAppoint.filter(item =>
              item.nominee_relation_id != value
            );
        })
      }
    }
  }

   /////////Upload PDF
  uploadPdf(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;

    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf' ){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.upload_pdf_url = "";
      this.upload_pdf_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb pdf.",  "" ,  "error" );
      this.upload_pdf_url = "";
      this.upload_pdf_url_label = "";
    }else{
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          if(file_type.toLowerCase() != 'application/pdf'){
            this.upload_pdf_od_upload_real_time = event.target.result;
          }else{
            this.upload_pdf_od_upload_real_time = this.public_path+"pdf_image.png";
          }
        }
      this.upload_pdf_url_label = file.name;
      this.is_set_from_api_for_upload_pdf_url = false;
      this.formQuoteDetails.patchValue({
        'pre_policy_pdf' : file
      });
    }
  }

  uploadTpPDF(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;

    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf' ){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.upload_tp_pdf_url = "";
      this.upload_tp_pdf_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb pdf.",  "" ,  "error" );
      this.upload_tp_pdf_url = "";
      this.upload_tp_pdf_url_label = "";
    }else{
      var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          if(file_type.toLowerCase() != 'application/pdf'){
            this.upload_pdf_tp_upload_real_time = event.target.result;
          }else{
            this.upload_pdf_tp_upload_real_time = this.public_path+"pdf_image.png";
          }
        }
      this.upload_tp_pdf_url_label = file.name;
      this.is_set_from_api_for_upload_tp_pdf_url = false;
      this.formQuoteDetails.patchValue({
        'pre_year_tp_policy_pdf' : file
      });
    }
  }

}


