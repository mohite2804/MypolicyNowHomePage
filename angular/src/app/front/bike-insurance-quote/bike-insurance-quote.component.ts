import { Component, OnInit,Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomvalidationService } from '../services/customvalidation.service';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute } from  '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bike-insurance-quote',
  templateUrl: './bike-insurance-quote.component.html',
  styleUrls: ['./bike-insurance-quote.component.css']
})
export class BikeInsuranceQuoteComponent implements OnInit {

  selected_product_type_id : any ;
  quote_form_share_navigate_url : any;
  quote_form_navigate_url  : any;

  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;

  loaderActive: boolean = false;
  is_dealer_url_with_login : boolean = true;

  formchSearchDetails: FormGroup;
  submiteedSearchDetails: boolean = false;

  formQuoteDetails: FormGroup;
  submittedQuoteDetails: boolean = false;

  ////vahan details
  formchSearchVahanDetails: FormGroup;
  submiteedSearchVahanDetails: boolean = false;

  url_engine_no : any;
  previousPolicy_sub_type_id : any;

  search_message  : any ;
  div_show_do_you_have_previous_policy : boolean = true;
  div_show_ncb : boolean = true;
  div_show_cpa_cover : boolean = true;
  div_show_cpa_reason : boolean = false;

  div_show_carrier_type : boolean = true;
  div_show_od_discount : boolean = false;

  div_show_for_previous_policy_expiry_date : boolean = false;
  div_show_for_previous_policy_expiry_date_od : boolean = true;
  div_show_for_previous_policy_expiry_date_tp : boolean = true;
  manufacturing_year_selected : boolean =true;

  div_show_for_policy_subtypes : boolean = true;
  div_show_maid_claim  : boolean = true;
  div_show_previos_policy_nil_dep : boolean = true;
  div_show_for_previous_policy_extra_data : boolean = true;
  div_show_for_previous_policy_extra_data_no : boolean =true;
  div_previous_policy_details_section : boolean = true;
  div_show_change_in_ownersip : boolean = false;

  div_show_cpa_reason_5_year :  boolean = true;
  div_show_cpa_reason_3_year :  boolean = true;

  result_pre_policy_subtypes : any;
  result_product_types : any;
  result_policy_types : any;
  result_policy_subtypes : any;
  result_policy_subtypes_changes : any = [];
  result_policy_subtypes_bundle_changes : any = [];
  result_proposer_types : any;

  result_makes : any;
  result_models : any;
  result_models_changes : any;
  result_variant : any;
  result_rto : any;
  result_ic_master : any;
  result_vehicle_color : any;
  result_company_owner_marital_status : any;
  result_banks : any;
  result_city : any;
  result_years : any;
  result_years_changes : any;
  result_months : any;
  result_months_changes : any;
  result_pa_sum_insured : any;
  result_od_discount : any;


  result_cpa_reason : any;
  result_previous_ncb : any;

  result_career_types: any;

  result_selected_quote_data : any;


  loginUserId : any;
  loginUserType : any;
  result : any;


  selected_policy_type_id : any;


  policy_sub_type_id : any;

  business_partner_id: any;
  business_partner_code: any;

  date_picker_date_picker_pr_date: NgbDateStruct;
  date_picker_pre_policy_expire_date : NgbDateStruct;
  date_picker_pre_policy_expire_date_for_od: NgbDateStruct;
  date_picker_pre_policy_expire_date_for_tp : NgbDateStruct;


  validation_for_reg_1 :any = "^[a-zA-Z]{1,3}$";
  validation_for_reg_2 :any = "^[0-9]{4,4}$";


  validation_for_number_only :any = "^[0-9]*$";
  validation_for_engine_no :any = "^(?!0{22})([a-zA-Z0-9]){5,22}$";

  validation_for_chassis_no :any = "^(?!0{17})([a-zA-Z0-9]){17}$";
  validation_for_policy_no :any = "^([a-zA-Z0-9-/\/])+$";


  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_character :any = "^[a-zA-Z]+$";


  maxDate : any;
  minDate : any;
  setNullDate : any;
  minDateRegistration : any;
  minCurrentDate : any;


  maxDateForPreviousPolicy : any;
  minDateForPreviousPolicy : any;

  minDateOd : any;
  maxDateOd : any;
  evalue : any;

  minDateTp : any;
  maxDateTp : any;

  minDateForStandaloneOd : any;

  min_invoice_price : any;
  max_invoice_price : any;

  unique_ref_no : any;
  is_imported : any;
  registration_date_disabled_enabled : any;
  invoice_price_disabled_enabled : any;
  success_message : any;
  error_message : any;

  selectedRto : any;
  selectedMake : any;
  selectedModel : any;
  selectedVariants : any;

  minDateForTpPolicyExpiryDate : any;
  renewal_for_com_saod : boolean = false;
  is_claim_div_display : boolean = false;

  url_read_only : boolean = false;

  url_selected_ic : any;
  url_reg_no :any;


  chassis_no : any = "";
  engine_no : any = "";

  selected_for_new_policy_subtype_id : any = "";

  product_type_name : any = "";
  product_type_image : any = "";
  tpPolicyExpiryDate:any;
  pre_policy_expire_date = "";
  selected_current_date = "";

  //ICICI-POS : START
  is_cpa_compulsory : any = "";
  cpa_tenure : any = "";
  deal_code : any = "";
  cpa_radio_btn_state : boolean = false;
  //ICICI-POS : END 


  constructor( private activatedRoute : ActivatedRoute, private renderer: Renderer2, private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {

    this.loaderActive = true;

    const current = new Date();


    let day : any = current.getDate();
    let month : any = current.getMonth() + 1;
    let year :any =  current.getFullYear();
    this.selected_current_date = year+'-'+month+'-'+day;

    const tpPolicyExpiryDate = new Date();

    this.setNullDate = {
      year: "",
      month: "",
      day: ""
    };


    this.minCurrentDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.tpPolicyExpiryDate = new Date(current);
    this.tpPolicyExpiryDate.setDate( this.tpPolicyExpiryDate.getDate() + 3 );

    this.minDateForTpPolicyExpiryDate = {
      year: this.tpPolicyExpiryDate.getFullYear(),
      month: this.tpPolicyExpiryDate.getMonth() + 1,
      day: this.tpPolicyExpiryDate.getDate()
    }

    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.minDate = this.minDateRegistration = {
      year: current.getFullYear() - 10,
      month: current.getMonth() + 1,
      day: current.getDate()
    };


    this.maxDateForPreviousPolicy = {
      year: current.getFullYear(),
      month: current.getMonth() + 3,
      day: current.getDate()
    };
    this.minDateForPreviousPolicy = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.setStandaloneOdAndTp();

  }



  checkPreviousPolicyIsThirdParty(){

    let find : boolean = false;
    this.result_pre_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'thirdparty' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.previousPolicy_sub_type_id){
        find  = true;
        return find;
      }

    });
    return find;
  }



  checkPreviousPolicyIsStandAloneOd(){
    let find : boolean = false;
    this.result_pre_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'saod' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.previousPolicy_sub_type_id){
        find  = true;
        return find;
      }

    });
    return find;

  }

  checkPreviousPolicyIsComprehnsive(){
    let find : boolean = false;
    this.result_pre_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'comprehensive' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.previousPolicy_sub_type_id){
        find  = true;
        return find;
      }

    });
    return find;
  }

  checkThirdParty(){

    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {

      if(value.unique_key == 'thirdparty' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.policy_sub_type_id){
        console.log('...........................................');
        find  = true;
        return find;
      }

    });
    return find;



  }

  checkStandAloneOd(){
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'saod' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.policy_sub_type_id){
        find  = true;
        return find;
      }

    });
    return find;

  }

  checkComprehnsive(){
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'comprehensive' && value.product_type_id == this.selected_product_type_id && value.policy_subtype_id == this.policy_sub_type_id){
        find  = true;
        return find;
      }

    });
    return find;
  }

  clickSelectBox(formt_control_name, selected_value){
    var product_type : any =   this.formQuoteDetails.value.product_type;
    var  policy_type_id : any = this.formQuoteDetails.value.policy_type_id;
    var  policy_subtype_id  : any =  this.formQuoteDetails.value.policy_subtype_id;
      product_type = parseInt(product_type);
      policy_type_id = parseInt(policy_type_id);
      policy_subtype_id = parseInt(policy_subtype_id);


      if(product_type !== undefined && (isNaN(product_type) || product_type < 1 )){
        selected_value.preventDefault();
        //alert('inn');
       Swal.fire({ title: 'Please select product type first',icon: 'warning' });

      }else if(policy_type_id !== undefined && (isNaN(policy_type_id) || policy_type_id < 1 )){
        selected_value.preventDefault();
        Swal.fire({ title: 'Please select policy type first.',icon: 'warning' });

      }else if(policy_subtype_id !== undefined && (isNaN(policy_subtype_id) || policy_subtype_id < 1 )){
        selected_value.preventDefault();
        Swal.fire({ title: 'Please select policy subtype first.',icon: 'warning' });
      }
      selected_value.stopPropagation();
  }
  clearModelVariant(){
   // alert('inn');
    //this.selectedMake = null;
    this.selectedModel = null;
    this.selectedVariants = null;

  }

  clearVariant(){
    //alert('inn');
    //this.selectedMake = null;
    //this.selectedModel = null;
    this.selectedVariants = null;

  }
  clearMakeModelVariant(){
     this.selectedMake = null;
     this.selectedModel = null;
     this.selectedVariants = null;

  }

  changeSelectBox(form_control_name,selected_value){
    // console.log(selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'rto':
          this.formQuoteDetails.patchValue({rto : selected_value });
        break;

        case 'make':
          this.formQuoteDetails.patchValue({make : selected_value });
          this.getModelByMakeId(selected_value);
          this.clearModelVariant();
          break;

        case 'model':
          this.formQuoteDetails.patchValue({model : selected_value });
          this.getVariantsByModelId(selected_value);
          this.clearVariant();
          break;

        case 'variants':
          this.formQuoteDetails.patchValue({variants : selected_value });
          this.setInvoicePriceByVariantId(selected_value);
          break;


      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'rto':
        this.formQuoteDetails.patchValue({rto : '' });
        this.selectedRto = null;
        break;

      case 'make':
        this.formQuoteDetails.patchValue({make : '' });
        this.selectedMake = null;
        break;

      case 'model':
        this.formQuoteDetails.patchValue({model : '' });
        this.selectedModel = null;
        break;

      case 'variants':
        this.formQuoteDetails.patchValue({variants : '' });
        this.selectedVariants = null;
        break;


    }
  }

  setStandaloneOdAndTp(){

    var tp_od_date_calculate = new Date();

    this.maxDateOd = {
      year: tp_od_date_calculate.getFullYear(),
      month: tp_od_date_calculate.getMonth() + 3,
      day: tp_od_date_calculate.getDate()
    };


    this.maxDateTp = {
      year: tp_od_date_calculate.getFullYear() + 5,
      month: tp_od_date_calculate.getMonth() + 1,
      day: tp_od_date_calculate.getDate()
    };
  }


  formValueChange(other_details,event){

    var product_type : any =   this.formQuoteDetails.value.product_type;
    var  policy_type_id : any = this.formQuoteDetails.value.policy_type_id;
    var  policy_subtype_id  : any =  this.formQuoteDetails.value.policy_subtype_id;
      product_type = parseInt(product_type);
      policy_type_id = parseInt(policy_type_id);
      policy_subtype_id = parseInt(policy_subtype_id);

      if(product_type !== undefined && (isNaN(product_type) || product_type < 1 )){
        event.preventDefault();
        //alert('out');
       Swal.fire({ title: 'Please select product type first',icon: 'warning' });

      }else if(policy_type_id !== undefined && (isNaN(policy_type_id) || policy_type_id < 1 )){
        event.preventDefault();
        Swal.fire({ title: 'Please select policy type first',icon: 'warning' });

      }else if(policy_subtype_id !== undefined && (isNaN(policy_subtype_id) || policy_subtype_id < 1 )){
        event.preventDefault();
        Swal.fire({ title: 'Please select policy subtype first',icon: 'warning' });
      }
      event.stopPropagation();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'keyup', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'keydown', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'mouseup', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
           this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'mousedown', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
           this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });
  }


  strToBool(s){
    let regexpboolean: RegExp = /^\s*(true|1|on)\s*$/i;
      return regexpboolean.test(s);
  }

  calculateDaysBetweenDay(date_1,date_2){
    if(date_1 && date_2){
      var date1 : any = new Date(date_1);
      var date2 : any = new Date(date_2);
      if(date1 != 'Invalid Date' && date2 != 'Invalid Date'){
        console.log('calculateDaysBetweenDay');
        console.log("date1:-"+date1);
        console.log("date1:-"+date2);
        var diffTime : any = Math.abs(date2 - date1);
        var diffDays : any = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    }

  }



  previousPolicySubType(policy_subtype_id){
    //alert(policy_subtype_id);
    this.previousPolicy_sub_type_id = policy_subtype_id;
    var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();
    var foundThirdParty : boolean = this.checkThirdParty();

    if(!foundThirdParty){
      var foundStandAlone : boolean = this.checkStandAloneOd();
      if(foundPreviousThirdParty){
        this.resetNcbDetails();
        if(foundStandAlone){
          this.div_show_for_previous_policy_expiry_date_od = true;
          this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
          this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();
          this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
          this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();
          this.formQuoteDetails.patchValue({
           pre_policy_expire_date_for_od : ''
          });
          this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
        }
      }else{
        if(this.selected_policy_type_id != 1 && !foundPreviousThirdParty){
          this.setNcbDetails();
        }
        if(this.renewal_for_com_saod){
          if(foundStandAlone){
            this.div_show_for_previous_policy_expiry_date_od = false;
            this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([Validators.required]);
            this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([Validators.required]);
            this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date_for_od);
          }else{
            this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date);
          }
        }
      }
    }

  }

  resetNcbDetails(){
      this.div_show_maid_claim = true;
      this.div_show_ncb = true;
      this.div_show_previos_policy_nil_dep = true;
      this.formQuoteDetails.get("made_claim").setValidators([]);
      this.formQuoteDetails.get("made_claim").updateValueAndValidity();

      this.formQuoteDetails.get("previous_ncb").setValidators([]);
      this.formQuoteDetails.get("previous_ncb").updateValueAndValidity();

      this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
      this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();
      this.formQuoteDetails.patchValue({
        made_claim : '',
        previous_ncb : '',
        pre_policy_nil_dep : ''
      });
  }

  setNcbDetails(){
      this.div_show_previos_policy_nil_dep = false;
      this.div_show_maid_claim = false;
      this.div_show_ncb = true;
      this.formQuoteDetails.get("made_claim").setValidators([Validators.required]);
      this.formQuoteDetails.get("made_claim").updateValueAndValidity();

      this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([Validators.required]);
      this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

      this.formQuoteDetails.patchValue({
        made_claim : '',
        pre_policy_nil_dep : ''
      });
  }

  hideNcb(no_of_days,flag=''){
    if(no_of_days > 90){
      this.resetNcbDetails();
    }else{
      var ip_change_owner_ship=this.formQuoteDetails.value.change_owner_ship;
      if(flag != ''){
        ip_change_owner_ship=ip_change_owner_ship=='true'?'false':'true';
      }
      if(this.selected_policy_type_id != 1){
        this.setNcbDetails();
      }

      if(this.renewal_for_com_saod && ip_change_owner_ship=='true'){
        this.div_show_maid_claim=true;
        // this.formQuoteDetails.patchValue({ made_claim : ''});
        // this.formQuoteDetails.get("made_claim").setValidators([]);
        // this.formQuoteDetails.get("made_claim").updateValueAndValidity();
        this.resetNcbDetails();
        this.maidClaim(ip_change_owner_ship,'angular');
      }else{
        this.div_show_maid_claim=false;
        this.setNcbDetails();
        this.maidClaim(true,'angular');
      }
    }
  }

  checkSAODdate(d,flag=''){
    const current_date = new Date();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundThirdParty : boolean = this.checkThirdParty();
    if(foundStandAlone){
      this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_od : d });
    }else{
      this.formQuoteDetails.patchValue({ pre_policy_expire_date : d });
    }
    if(!foundThirdParty){
      var no_of_days : any = this.calculateDaysBetweenDay(d,current_date);
      this.hideNcb(no_of_days,flag);
    }
  }

  purchaseDateCondition(selected_date){
    var staticDate = new Date('2018-09-01');
    var selectedDate = new Date(selected_date);
    if(selectedDate > staticDate){
      this.commonPolicySubTypeShowHide();
    }else{
      this.commonPolicySubTypeShowHide('pr_date');
    }
  }

  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    var no_of_days : any = this.calculateDaysBetweenDay(selected_date,current_date);
    if(field == 'pr_date'){
      this.purchaseDateCondition(selected_date);
      this.formQuoteDetails.patchValue({ pr_date : selected_date });
      this.setPreviousPolicyDate(year,month,day);
    }
    if(field == 'pre_policy_expire_date'){
      var foundThirdParty : boolean = this.checkThirdParty();
      if(!foundThirdParty){
        this.hideNcb(no_of_days);
      }
      this.pre_policy_expire_date = selected_date;
      this.formQuoteDetails.patchValue({ pre_policy_expire_date : selected_date });
      this.previousPolicySubType(this.previousPolicy_sub_type_id);
    }
    if(field == 'pre_policy_expire_date_for_od'){
      this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_od : selected_date });
      this.hideNcb(no_of_days);
      var foundStandAlone : boolean = this.checkStandAloneOd();

      if(foundStandAlone){
        this.tPdateValidationBasedOnODExpirey(selected_date);
      }

    }
    if(field == 'pre_policy_expire_date_for_tp'){
      this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_tp : selected_date });
    }

  }


  tPdateValidationBasedOnODExpirey(selected_date){
    const current = new Date();
    var date1 : any = new Date(current);
    var date2 : any = new Date(selected_date);

    this.formQuoteDetails.patchValue({
      pre_policy_expire_date_for_tp : ''
    });
    this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;

    if(date1 <= date2){

      date2.setDate( date2.getDate() + 3 );
      this.minDateForTpPolicyExpiryDate = {
        year: date2.getFullYear(),
        month: date2.getMonth() + 1,
        day: date2.getDate()
      }
    }else{
      date1.setDate( date1.getDate() + 3 );
      this.minDateForTpPolicyExpiryDate = {
        year: date1.getFullYear(),
        month: date1.getMonth() + 1,
        day: date1.getDate()
      }
    }
  }

  setPreviousPolicyDate(year,month,day){
    this.minDateForPreviousPolicy = {
      year: year,
      month: month,
      day: day
    };
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


      if(field == 'pr_date'){
        if(selected_date != ''){
          this.purchaseDateCondition(selected_date);
        }
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_date_picker_pr_date = set_date;
          this.formQuoteDetails.patchValue({ pr_date : selected_date_for_form });
        }

      }
      if(field == 'pre_policy_expire_date'){
        if(selected_date_for_form != '1970-01-01'){

          this.date_picker_pre_policy_expire_date = set_date;
          this.formQuoteDetails.patchValue({ pre_policy_expire_date : selected_date_for_form });
        }

      }
      if(field == 'pre_policy_expire_date_for_od'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_pre_policy_expire_date_for_od = set_date;

          var foundStandAlone : boolean = this.checkStandAloneOd();
          if(foundStandAlone){
            this.tPdateValidationBasedOnODExpirey(selected_date_for_form);
          }
          this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_od : selected_date_for_form });
        }
      }
      if(field == 'pre_policy_expire_date_for_tp'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_pre_policy_expire_date_for_tp = set_date;
          this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_tp : selected_date_for_form });
        }
      }
  }


  setValidationForCarrierType(){
    this.formQuoteDetails.get("carrier_type_id").setValidators([Validators.required]);
    this.formQuoteDetails.get("carrier_type_id").updateValueAndValidity();
  }

  removeValidationForCarrierType(){
    this.formQuoteDetails.get("carrier_type_id").setValidators([]);
    this.formQuoteDetails.get("carrier_type_id").updateValueAndValidity();
  }

  selectProductType(product_type_id,data_from){
    if(data_from == 'angular'){

      this.resetFormByProductType(product_type_id);
      this.setModelsByProductMake();
    }
    this.setPolicySubType();
    this.showHideCpaFiveYear();

  }

  setModelsByProductMake(){
    this.result_models_changes = [];
    this.formQuoteDetails.patchValue({
      model : '',
      variants : ''
    });
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('selected_product_type_id',this.selected_product_type_id);
      this.commonService.setModelsByProductMake(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_models_changes = result.result.models;
          this.result_policy_types = result.result.policy_types;
          this.result_policy_subtypes = result.result.policy_subtypes;
          if(this.selected_policy_type_id){
            this.selectPolicyType(this.selected_policy_type_id,'server');
          }

        }

      });



  }



  commonPolicySubTypeShowHide(type=''){
    var foundComprehnsive :  boolean = this.checkComprehnsive();
    if(foundComprehnsive){
      var ids=[5,10,11,16,21];
      if(type !=''){
        var ids=[5,10,11,16,21,4,20];
      }else{
        this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
      }
      // this.removePolicySubType(ids);
    }else{
      var foundThirdParty : boolean = this.checkThirdParty();
      this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
      if(foundThirdParty){
        var ids=[4,20];
        this.removePolicySubType(ids);
      }
    }
  }

  removePolicySubType(ids){
    ids.forEach( (value, key) => {
      this.result_policy_subtypes_bundle_changes = this.result_policy_subtypes_bundle_changes.filter(item =>
        item.policy_subtype_id != value
      );
    });
  }

  selectPolicySubType(policy_subtype_id){
    this.policy_sub_type_id  = policy_subtype_id;
    var policy_sub_type_ids: number[] = [3,6,7,8,9,13,14,1,19,4,20];
    var find : any =  policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find > -1){
      this.renewal_for_com_saod=true;
    } else{
      this.renewal_for_com_saod=false;
    }
    this.commonPolicySubTypeShowHide();
    this.checkSubTypeAndShowHideDiv();
    this.showDivForPreviosPolicy();
    this.changeMonthYearByPolicySubtype();
    this.enabledisablecpa(this.policy_sub_type_id);
    if(this.selected_policy_type_id == 1){
      //alert('done');
      this.resetPreviosPolicyDetails();
    }
    if(this.policy_sub_type_id == 3){
      //alert('done');
      this.div_show_for_previous_policy_extra_data_no = true;
    }
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(!foundStandAlone){
      if(this.formQuoteDetails.value.policyholdertype==2){
        this.div_show_cpa_cover = true;
        this.validationForStandAlonOd();
      }else{
        this.div_show_cpa_cover = false;
        this.validationForComprehnsive();
      }
    }
  }



  checkSubTypeAndShowHideDiv(){
    //this.invoice_price_disabled_enabled = false;
    var foundThirdParty : boolean = this.checkThirdParty();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive();
    if(foundThirdParty){

      //this.invoice_price_disabled_enabled = true;
      this.ShowHideDivForThirdParty();
      this.formQuoteDetails.patchValue({od_discount : ''});
    }

    if(foundComprehnsive){
      this.ShowHideDivForThirdParty();
      this.ShowHideDivForComprehnsive();
      this.formQuoteDetails.patchValue({od_discount : 'max'});
    }
    if(foundStandAlone){
      this.ShowHideDivForStandAlonOd();

      this.formQuoteDetails.patchValue({od_discount : 'max'});
    }
    this.formQuoteDetails.patchValue({
      change_owner_ship : 'false' ,
      previous_policy : ''
    });

    if(foundThirdParty){
      this.changeOwnerShip('false');
    }

    this.formQuoteDetails.patchValue({
      cpa_cover_term : '',
      cpa_cover_reason: ''
    });



  }

  ShowHideDivForComprehnsive(){
    //this.div_show_cpa_cover = false;
    this.div_show_od_discount = false;
    this.validationForComprehnsive();
  }

  validationForComprehnsive(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([Validators.required]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();

    //this.formQuoteDetails.get("od_discount").setValidators([Validators.required]);
    //this.formQuoteDetails.get("od_discount").updateValueAndValidity();

  }

  ShowHideDivForStandAlonOd(){

    this.div_show_cpa_cover = true;
    this.div_show_od_discount = false;
    this.validationForStandAlonOd();

  }

  validationForStandAlonOd(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();

    this.formQuoteDetails.get("cpa_cover_reason").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_reason").updateValueAndValidity();

    //this.formQuoteDetails.get("od_discount").setValidators([Validators.required]);
    //this.formQuoteDetails.get("od_discount").updateValueAndValidity();



  }

  ShowHideDivForThirdParty(){

    //this.div_show_cpa_cover = false;
    this.div_show_od_discount = true;
    this.validationForThirdParty();
  }

  validationForThirdParty(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([Validators.required]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();

    this.formQuoteDetails.get("od_discount").setValidators([]);
    this.formQuoteDetails.get("od_discount").updateValueAndValidity();
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
    }
    if(foundComprehnsive){
     // alert('inn');
     this.ShowDivForPreviosPolicyForComprehnsive();
    }
    this.formQuoteDetails.patchValue({
      change_owner_ship : 'false',
      previous_policy : 'true',
      pre_policy_expire_date : '',

      pre_policy_expire_date_for_od : '',
      pre_policy_expire_date_for_tp : '',
      previose_policy_no_tp : '',
      previose_insurance_company_tp : '',
      made_claim : '',
      pre_policy_nil_dep : '',
      pre_previous_type : '',
      previose_policy_no : '',
      previose_insurance_company : ''
    });

    this.div_show_for_previous_policy_extra_data = false;

    this.date_picker_pre_policy_expire_date =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;


  }


  showDivForPreviosPolicyno(){

    this.formQuoteDetails.patchValue({
      pre_policy_expire_date : '',
      previose_policy_no_tp : '',
      previose_insurance_company_tp : '',

    });

    if(this.policy_sub_type_id == 4){
      this.div_show_for_previous_policy_extra_data_no = true;

    }
    else{
      this.div_show_for_previous_policy_extra_data_no = true;
      this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;
    }

  }



  showDivForDoYouHavePreviousPolicy(){
    var foundThirdParty : boolean = this.checkThirdParty();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive()

    if(foundThirdParty){
      this.formQuoteDetails.patchValue({
        change_owner_ship : 'false' ,
        previous_policy : ''
      });
      this.changeOwnerShip('false');
    }

    if(foundStandAlone){
      this.formQuoteDetails.patchValue({
        change_owner_ship : ''
      });
      this.changeOwnerShip('true');
    }

    if(foundComprehnsive){
     this.formQuoteDetails.patchValue({
        change_owner_ship : ''
      });
      this.changeOwnerShip('true');
    }
  }

  ShowDivForPreviosPolicyForThirdParty(){
    this.div_show_change_in_ownersip  = true;
    this.div_show_do_you_have_previous_policy  = false;
    this.div_show_for_previous_policy_expiry_date  = false;
    this.div_show_for_previous_policy_expiry_date_od  = true;
    this.div_show_for_previous_policy_expiry_date_tp  = true;
    this.div_show_maid_claim  = true;
    this.div_show_ncb  = true;
    this.div_show_previos_policy_nil_dep  = true;
    this.validationForPreviosPolicyForThirdParty();
  }

  validationForPreviosPolicyForThirdParty(){
    this.formQuoteDetails.get("change_owner_ship").setValidators([]);
    this.formQuoteDetails.get("change_owner_ship").updateValueAndValidity();

    this.formQuoteDetails.get("previous_policy").setValidators([Validators.required]);
    this.formQuoteDetails.get("previous_policy").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    //this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    //this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();


    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();



    this.formQuoteDetails.get("made_claim").setValidators([]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

  }

  ShowDivForPreviosPolicyForStandAloneOd(){

    this.div_show_change_in_ownersip  = false;
    this.div_show_do_you_have_previous_policy  = false;
    this.div_show_for_previous_policy_expiry_date  = true;
    //this.div_show_for_previous_policy_expiry_date_od  = false;
    this.div_show_for_previous_policy_expiry_date_tp  = false;
    this.div_show_maid_claim  = false;
    this.div_show_ncb  = true;
    this.div_show_previos_policy_nil_dep  = false;
    this.validationForPreviosPolicyForStandAloneOd();
  }

  validationForPreviosPolicyForStandAloneOd(){
    this.formQuoteDetails.get("change_owner_ship").setValidators([Validators.required]);
    this.formQuoteDetails.get("change_owner_ship").updateValueAndValidity();

    this.formQuoteDetails.get("previous_policy").setValidators([Validators.required]);
    this.formQuoteDetails.get("previous_policy").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([this.customvalidationService.prePolicyExpireDateForTp(),Validators.required]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no_tp").setValidators([Validators.required]);
    //this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([Validators.required]);
    //this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    //this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    //this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

    this.formQuoteDetails.get("made_claim").setValidators([Validators.required]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();




  }

  ShowDivForPreviosPolicyForComprehnsive(){

    this.div_show_change_in_ownersip  = false;
    this.div_show_do_you_have_previous_policy  = false;
    this.div_show_for_previous_policy_expiry_date  = false;
    this.div_show_for_previous_policy_expiry_date_od  = true;
    this.div_show_for_previous_policy_expiry_date_tp  = true;
    this.div_show_maid_claim  = false;
    this.div_show_ncb  = true;
    this.div_show_previos_policy_nil_dep  = false;
    this.validationForPreviosPolicyForComprehnsive();

  }

  validationForPreviosPolicyForComprehnsive(){
    this.formQuoteDetails.get("change_owner_ship").setValidators([Validators.required]);
    this.formQuoteDetails.get("change_owner_ship").updateValueAndValidity();

    this.formQuoteDetails.get("previous_policy").setValidators([Validators.required]);
    this.formQuoteDetails.get("previous_policy").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("made_claim").setValidators([Validators.required]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([Validators.required]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    //this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    //this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();




  }

  previousPolicy(event,server=''){

    this.evalue=event;
    if(event == 'true' || event == '1'){
      this.div_show_for_previous_policy_extra_data = false;
      // this.showDivForPreviosPolicy();
      this.div_show_for_previous_policy_extra_data_no = true;
      this.resetPreviesSomefieldno();
      if(server !=''){
        this.changeOwnerShip(this.result_selected_quote_data.is_changes_in_ownership);
      }
    }else{
        this.showDivForPreviosPolicyno();
        this.div_show_for_previous_policy_extra_data = true;
        this.resetPreviesSomefield();

    }

  }



  resetPreviesSomefield(){
    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
   // this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

   //this.formQuoteDetails.get("previose_policy_no").setValidators([]);
    //this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company").setValidators([]);
    //this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

    this.formQuoteDetails.get("made_claim").setValidators([]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();



  }

  resetPreviesSomefieldno(){

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
   // this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    //this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();
  }

  reneawalSaod(val){
    this.div_show_do_you_have_previous_policy = false;
    if(val=='true' || val==1){
      this.div_show_maid_claim=true;
      this.formQuoteDetails.patchValue({ made_claim : ''});
      this.formQuoteDetails.get("made_claim").setValidators([]);
      this.formQuoteDetails.get("made_claim").updateValueAndValidity();
      this.maidClaim(val,'angular');
      this.is_claim_div_display=true;
    }else{
      this.div_show_maid_claim=false;
      this.is_claim_div_display=false;
    }

    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone){
      this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date_for_od,'1');
    }else{
      this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date,'1');
    }

    var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();
    if(foundPreviousThirdParty){
      this.resetNcbDetails();
    }
  }

  changeOwnerShip(event){
    var foundThirdParty : boolean = this.checkThirdParty();
    if(!foundThirdParty){
      if(this.renewal_for_com_saod){
        this.reneawalSaod(event);
      }else{
        if(event == 'true'){
          this.div_show_do_you_have_previous_policy = true;
          this.div_show_for_previous_policy_extra_data = true;
          this.div_show_for_previous_policy_extra_data_no = true;
          this.resetPreviosPolicyDetails();
        }else{
          this.div_show_do_you_have_previous_policy = false;
          this.div_show_for_previous_policy_extra_data = true;
        }
      }
    }
    if(this.evalue=='0' || this.evalue=='false'){
      this.resetPreviesSomefield();
    }
  }


  resetFormByProductType(product_type_id){
    this.resetForm();
    this.resetFormSearchDetails();
    this.formQuoteDetails.patchValue({
      product_type : product_type_id,
      is_quick_quote : false
    });

  }


  resetFormByPolicyType(policy_type_id){
    this.resetForm();
    this.resetFormSearchDetails();
    this.formQuoteDetails.patchValue({
      policy_type_id : policy_type_id,
      is_quick_quote : false
    });

  }



  resetForm(){
    this.success_message = "";
    this.error_message = "";
    sessionStorage.removeItem('policy_no');
    sessionStorage.removeItem('transaction_no');
    sessionStorage.removeItem('proposal_no');
    sessionStorage.removeItem('quote_no');
    sessionStorage.removeItem('unique_ref_no');
    sessionStorage.removeItem('is_imported');

    this.date_picker_pre_policy_expire_date =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;

    this.date_picker_date_picker_pr_date =  this.setNullDate;
    this.selectedMake = null;
    this.selectedRto = null;
    this.selectedModel = null;
    this.selectedVariants = null;
    this.validationFormQuoteDetails();

    this.div_show_cpa_cover = true;
    this.div_show_cpa_reason = false;
    this.result_policy_subtypes_changes = [];
    this.result_policy_subtypes_bundle_changes= [];


  }

  ngOnInit(): void {
    //alert('inn');
    let href : any = this.router.url;
    //alert(href);
    if(href == '/bike-insurance-quote'){
      this.selected_product_type_id  = 2;
    }else if(href == '/car-insurance-quote'){
      this.selected_product_type_id  = 1;
    }

    href = href.slice(0, href.lastIndexOf('/'));
    href = href.slice(0, href.lastIndexOf('/'));

    if(href == '/share/bike-insurance-quote'){
      this.selected_product_type_id  = 2;
    }else if(href == '/share/car-insurance-quote'){
      this.selected_product_type_id  = 1;
    }
    console.log("selected_product_type_id:-"+this.selected_product_type_id);

    sessionStorage.removeItem('policy_no');
    sessionStorage.removeItem('transaction_no');
    sessionStorage.removeItem('proposal_no');
    sessionStorage.removeItem('quote_no');
    sessionStorage.removeItem('active_ic_for_quote');
    sessionStorage.removeItem('selected_ic_id');



    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.business_partner_id = sessionStorage.getItem("business_partner_id");
    this.business_partner_code = sessionStorage.getItem("business_partner_code");


    if(this.loginUserType == 5){
      Swal.fire({
        title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })

    }else{

        this.validationFormQuoteDetails();

        ////vahan form validations
        this.validationFormSearchVahanDetails();



        this.url_reg_no  =  this.activatedRoute.snapshot.paramMap.get('reg_no');
        this.url_selected_ic  =  this.activatedRoute.snapshot.paramMap.get('selected_ic');


        this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');


        this.is_imported  = sessionStorage.getItem('is_imported');
        this.getIndex();

        if( this.url_reg_no != null){
          this.is_dealer_url_with_login = false;
          this.formchSearchVahanDetails.patchValue({search_regi_no : atob(this.url_reg_no)});
          this.url_read_only = true;
          //this.submitFormSearchDetails();
        }



    }

  }

  setPolicySubType(){
    // console.log("selected_product_type_id:-"+this.selected_product_type_id);
    // console.log("selected_policy_type_id :-"+this.selected_policy_type_id);
    // console.log("result_policy_subtypes :-"+this.result_policy_subtypes);
    this.div_show_for_policy_subtypes = true;
    this.result_policy_subtypes_changes = [];
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.product_type_id == this.selected_product_type_id && value.policy_type_id == this.selected_policy_type_id){
        this.result_policy_subtypes_changes.push(this.result_policy_subtypes[key]);
        this.div_show_for_policy_subtypes = false;
      }
    });

    this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
    // console.log("result_policy_subtypes_changes:-"+this.result_policy_subtypes_changes);

  }



  showDivPreviousPolicy(){
    this.div_previous_policy_details_section = true;
    this.div_show_do_you_have_previous_policy = false;

  }

  hideDivForPreviousPolicy(){
    this.div_previous_policy_details_section = false;
  }

  selectPolicyType(policy_type_id,data_come_from){
    // console.log("policy_type_id:- "+policy_type_id);
    this.validationONPolicyType(policy_type_id);
    this.resetSubPolicyType();
    this.selected_policy_type_id  = policy_type_id;
    this.setPolicySubType();

    this.changeYearMonth(policy_type_id);

    if(data_come_from == 'angular'){
      if(policy_type_id == 1){
        if(this.selected_product_type_id == '2')
        {
          this.policy_sub_type_id = '1';
          this.checkIfSpecialPosOnPolicyTypeSelect();
        }
        else if(this.selected_product_type_id == '1')
        {
          this.policy_sub_type_id = '17';
          this.checkIfSpecialPosOnPolicyTypeSelect();
        }
        this.formQuoteDetails.patchValue({policy_subtype_id : this.selected_for_new_policy_subtype_id });
      }
    }

    if(this.selected_policy_type_id == 1){
      this.invoice_price_disabled_enabled = false;
      this.registration_date_disabled_enabled = true;
      this.resetPreviosPolicyDetails();

      this.div_previous_policy_details_section = true;
    }else{
      this.invoice_price_disabled_enabled = true;
      this.registration_date_disabled_enabled = false;
      this.div_previous_policy_details_section = false;
    }
    this.showHideCpaFiveYear();

  }

  showHideCpaFiveYear(){
    this.div_show_cpa_reason_5_year = true;
    this.div_show_cpa_reason_3_year = true;
    if(this.selected_product_type_id == 2 && this.selected_policy_type_id == 1){
      this.div_show_cpa_reason_5_year = false;
    }
    if(this.selected_product_type_id == 1 && this.selected_policy_type_id == 1){
      this.div_show_cpa_reason_3_year = false;
    }
  }

  validationONPolicyType(policy_type_id){

    this.formQuoteDetails.get("reg_no_1").setValidators([Validators.pattern(this.validation_for_reg_1)]);
    this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
    this.formQuoteDetails.get("reg_no_2").setValidators([Validators.pattern(this.validation_for_reg_2)]);
    this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

    // if(policy_type_id == 1){
    //   this.formQuoteDetails.get("reg_no_1").setValidators([Validators.pattern(this.validation_for_reg_1)]);
    //   this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
    //   this.formQuoteDetails.get("reg_no_2").setValidators([Validators.pattern(this.validation_for_reg_2)]);
    //   this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

    // }else{

    //   this.formQuoteDetails.get("reg_no_1").setValidators([Validators.required,Validators.pattern(this.validation_for_reg_1)]);
    //   this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
    //   this.formQuoteDetails.get("reg_no_2").setValidators([this.customvalidationService.registrationNoValidator(),Validators.required,Validators.pattern(this.validation_for_reg_2)]);
    //   this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

    // }
  }

  resetSubPolicyType(){
    this.formQuoteDetails.patchValue({policy_subtype_id : '' });
  }


  selectManufactureMonth(event){

    var policy_type_id : number = this.formQuoteDetails.value.policy_type_id;
    var selected_month : number = this.formQuoteDetails.value.manufacturer_month_1;
    var selected_year : number =this.formQuoteDetails.value.manufacturer_year;
    var current_day : number = new Date().getDate();
    var selected_date : any;
    var current : any  = new Date();

    if(policy_type_id != 1){
      var foundStandAlone : boolean = this.checkStandAloneOd();
      current_day = 1;
      if(foundStandAlone && selected_year == 2017){
        selected_year= 2018;
      }
      if(foundStandAlone && selected_year == 2018 && selected_month < 9){
        selected_month= 9;
      }
      selected_date =  selected_year+'-'+selected_month+'-'+current_day;
    }else{
      selected_year = current.getFullYear();
      selected_month = current.getMonth() + 1
      current_day = current.getDate();
      selected_date = selected_year+'-'+selected_month+'-'+current_day;
    }


    this.formQuoteDetails.patchValue({
      pr_date : selected_date
    });

    this.selectDateForAngular('pr_date',selected_date);

    var selected_date : any = new Date(selected_date);

    this.setPreviousPolicyMinRange(policy_type_id,selected_date);



  }

  setPreviousPolicyMinRange(policy_type_id,selected_date){
    var current : any  = new Date();
    var selected_date : any = new Date(selected_date);

    var set_date : any  = { year: selected_date.getFullYear(), month: selected_date.getMonth() + 1,day: selected_date.getDate() };
    var set_current_date : any  = { year: current.getFullYear(), month: current.getMonth() + 1,day: current.getDate() };

    if(policy_type_id == 1){
      this.minDateRegistration = set_current_date;
      this.minDateForPreviousPolicy = set_current_date;
    }else{
      this.minDateRegistration = set_date;
      this.minDateForPreviousPolicy = set_date;
    }

  }

  selectManufactureYear(event,data_from){

    this.manufacturing_year_selected = false;

    if(data_from == 'angular'){
      this.resetMonth();
    }

    this.result_months_changes = this.result_months;
    this.changeMonthForSaod(event);
  }

  changeMonthByYear(event_value){
    var current_year : number = new Date().getFullYear();
    var current_month : number = new Date().getMonth();


    if(event_value == current_year){
      console.log('inn:- ');
      var month_key : number;
      this.result_months.forEach( (value, key) => {
        console.log('out- ');
        console.log('value:- '+value.id);
        console.log('current_month:- '+current_month);

        if(value.id == current_month + 1){

          this.result_months_changes = this.result_months.slice( 0, key+1);
        }
      });
    }
  }

  changeMonthForSaod(year){
    var current_year : number = new Date().getFullYear();
    var current_month : number = new Date().getMonth();



    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone){
      this.result_months_changes = [];
      this.result_months.forEach( (value, key) => {
        if(year == 2017){
          this.result_months_changes = this.result_months.slice(8,12);

        }else if(year == current_year){

          if(value.id == current_month + 1){
            this.result_months_changes = this.result_months.slice( 0, key+1);
          }



        }else{
          this.result_months_changes = this.result_months;
        }
      });
    }else{
      this.changeMonthByYear(year);
    }


  }

  resetMonth(){
    this.date_picker_date_picker_pr_date =  this.setNullDate;
    this.formQuoteDetails.patchValue({
      manufacturer_month_1 : '',
      pr_date : ''
    });
  }



  resetYearMonthDate(){
    this.formQuoteDetails.patchValue({
      manufacturer_year : '',
      pr_date : '',
      manufacturer_month_1 :  ''
    });

    this.date_picker_date_picker_pr_date =  this.setNullDate;
  }

  changeMonthYearByPolicySubtype(){
    var foundThirdParty : boolean = this.checkThirdParty();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive();
    if(foundThirdParty){
      this.changeYearMonth(this.selected_policy_type_id);
    }

    if(foundStandAlone){
      this.changeYearForSaod();
    }

    if(foundComprehnsive){
      this.changeYearMonth(this.selected_policy_type_id);
    }
  }

  changeYearMonth(new_renew){
    this.resetYearMonthDate();
    this.result_years_changes = this.result_years;
    if(new_renew == '1'){
      this.result_years_changes = this.result_years.slice( 0, 3);
    }else{
      this.result_years_changes = this.result_years.slice( 1, 15);
    }

  }

  changeYearForSaod(){
    let current_year_data = new Date();
    let current_year_get =  current_year_data.getFullYear();
    this.result_years_changes = [];
    this.resetYearMonthDate();
    this.result_years.forEach( (value, key) => {
      if(value.name >= 2017 && value.name != current_year_get){
        this.result_years_changes.push(this.result_years[key]);
      }
    });

  }




  getModelByMakeId(event){
    if(event != ""){
      this.formQuoteDetails.patchValue({model : '' });
      this.loaderActive = true;
      this.result_models_changes = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('make_id',event);
      sendData.append('product_type_id',this.selected_product_type_id);
      this.commonService.getModelByMakeId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_models_changes = result.models;
        }

      });
    }

  }

  getVariantsByModelId(event){
    if(event != ""){
      this.formQuoteDetails.patchValue({variants : '' });
      this.loaderActive = true;
      this.result_variant = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('model_id',event);
      sendData.append('product_type_id',this.selected_product_type_id);
      this.commonService.getVariantsByModelId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_variant = result.variants;
        }

      });
    }

  }


  getIndex(){
    this.loaderActive = true;

    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('unique_ref_no',this.unique_ref_no);
    sendData.append('is_imported',this.is_imported);
    sendData.append('product_type_id',this.selected_product_type_id);
    sendData.append('business_partner_code',this.business_partner_code);

    this.commonService.getQuoteFormData(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var result : any = response;

      this.selected_for_new_policy_subtype_id  = result.selected_for_new_policy_subtype_id;
      this.product_type_name  = result.product_type_name;
      this.product_type_image  = result.product_type_image;

      this.quote_form_share_navigate_url  = result.quote_form_share_navigate_url;
      this.quote_form_navigate_url  = result.quote_form_navigate_url;

      // if(this.is_imported==''){
      //   if( this.url_reg_no != null){
      //     this.submitFormSearchDetails();
      //   }
      // }

      if( this.url_reg_no != null){
        this.submitFormSearchDetails();
      }

      this.result_product_types = result.product_types;
      if(this.result_product_types=='' || this.result_product_types==null || this.result_product_types=='undefined'){
        Swal.fire("Product privileges not assigned! Please contact administrator", '', 'error');
      }

      this.result_policy_types = result.policy_types;
      console.log('result_policy_types.....start');
      console.log(this.result_policy_types);
      console.log('result_policy_types.....end');
      this.result_policy_subtypes = result.policy_subtypes;
      this.result_pre_policy_subtypes = result.pre_policy_subtypes;
      this.result_proposer_types = result.proposer_types;
      this.result_career_types = result.career_types;

      this.result_makes = result.makes;
      this.result_models = this.result_models_changes = result.models;
      this.result_variant  = result.variants;
      this.result_rto = result.rto;
      this.result_years = this.result_years_changes =  result.years;
      this.result_months = this.result_months_changes = result.months;
      this.result_vehicle_color = result.vehicle_color;
      this.result_company_owner_marital_status = result.company_owner_marital_status;
      this.result_banks = result.bank_master;
      this.result_city = result.city_master;


      this.result_od_discount = result.od_discount;
      this.result_ic_master = result.ic_master;
      this.result_cpa_reason = result.cpa_reason;
      this.result_previous_ncb = result.previous_ncb;
      this.result_selected_quote_data = result.selected_quote_data;

      this.is_cpa_compulsory = result.is_cpa_compulsory;
      this.cpa_tenure = result.cpa_tenure;
      this.deal_code = result.deal_code;
      // if(this.is_cpa_compulsory == "YES")
      // {
      //   this.cpa_radio_btn_state = true;
      // }
      // else{
      //   this.cpa_radio_btn_state = false; 
      // }
      console.log('Is CPA Compulsory : '+this.is_cpa_compulsory);
      console.log('CPA Tenure : '+this.cpa_tenure);



      if(this.result_selected_quote_data){
        this.setSelectedQuoteData();
      }

      this.loaderActive = false;

    });


  }



  setSelectedQuoteData(){
    if(this.result_selected_quote_data){

      if( this.url_reg_no != null){
        this.loginUserId = this.result_selected_quote_data.user_id;
      }
      this.selectProductType(this.result_selected_quote_data.product_type_id,'server');
      this.selectPolicyType(this.result_selected_quote_data.policy_type_id,'server');
      this.selectPolicySubType(this.result_selected_quote_data.policy_subtype_id);
      this.changeOwnerShip(this.result_selected_quote_data.is_changes_in_ownership);
      this.setPreviousPolicyMinRange(this.result_selected_quote_data.policy_type_id,this.result_selected_quote_data.registration_date);
      this.selectDateForAngular('pr_date',this.result_selected_quote_data.registration_date);

      this.min_invoice_price = this.result_selected_quote_data.min_invoice_price;
      this.max_invoice_price = this.result_selected_quote_data.max_invoice_price;
      if(this.result_selected_quote_data.min_invoice_price){
        // this.setInvoiceRange();
      }
      this.selectManufactureYear(this.result_selected_quote_data.manufacturing_year,'server');

      this.previousPolicySubType(this.result_selected_quote_data.prev_policy_type_id);

      this.selectPolicyHolderType(this.result_selected_quote_data.proposer_type_id);
      if(this.result_selected_quote_data.proposer_type_id==1){
        this.selectCpaCoverTerm(this.result_selected_quote_data.cpa_current_tenure);
      }
      this.previousPolicy(this.result_selected_quote_data.is_prev_policy_available,'server');
      this.selectDateForAngular('pre_policy_expire_date',this.result_selected_quote_data.prev_policy_expiry_date);
      this.selectDateForAngular('pre_policy_expire_date_for_od',this.result_selected_quote_data.od_pre_policy_expiry_date);
      this.selectDateForAngular('pre_policy_expire_date_for_tp',this.result_selected_quote_data.tp_pre_policy_expiry_date);

      this.selectedMake = this.result_selected_quote_data.make_id;

      this.selectedModel = this.result_selected_quote_data.model_id;

      if(this.result_selected_quote_data.vehicle_id){
        this.selectedVariants = this.result_selected_quote_data.vehicle_id+'|'+this.result_selected_quote_data.variant_id;
      }
      this.selectedRto = this.result_selected_quote_data.rto_id;
      this.maidClaim(!this.result_selected_quote_data.is_ncb,'server');

      //SET CPA TENURE AS PER ICICI POS : START
      // if(this.is_cpa_compulsory == 'YES')
      // {
      //   this.result_selected_quote_data.proposer_type_id = 1;
      //   this.result_selected_quote_data.cpa_current_tenure = this.cpa_tenure;
      // }
      //SET CPA TENURE AS PER ICICI POS : END

      this.formQuoteDetails.patchValue({
        product_type : this.result_selected_quote_data.product_type_id,
        policy_type_id : this.result_selected_quote_data.policy_type_id,
        policy_subtype_id  : this.result_selected_quote_data.policy_subtype_id,

        make : this.result_selected_quote_data.make_id,
        model : this.result_selected_quote_data.model_id,
        variants : this.selectedVariants,//this.result_selected_quote_data.vehicle_id+'|'+this.result_selected_quote_data.variant_id,
        rto : this.result_selected_quote_data.rto_id,
        reg_no_1 : (this.result_selected_quote_data.registration_no_part_3 == 'null' || this.result_selected_quote_data.registration_no_part_3 == 0) ? '' : this.result_selected_quote_data.registration_no_part_3,
        reg_no_2 : (this.result_selected_quote_data.registration_no_part_4 == 'null' || this.result_selected_quote_data.registration_no_part_4 == 0) ? '' : this.result_selected_quote_data.registration_no_part_4,
        manufacturer_month_1 : this.result_selected_quote_data.manufacturing_month,
        manufacturer_year : this.result_selected_quote_data.manufacturing_year,
        pr_date : this.result_selected_quote_data.registration_date,
        invoice_price : (this.result_selected_quote_data.vehicle_invoice_price == 0) ? "" : this.result_selected_quote_data.vehicle_invoice_price,


        policyholdertype : this.result_selected_quote_data.proposer_type_id,
        carrier_type_id : this.result_selected_quote_data.carrier_type_id,
        od_discount : this.result_selected_quote_data.user_selected_discount,
        change_owner_ship : (this.result_selected_quote_data.is_changes_in_ownership == 1 ) ? 'true' : 'false'  ,
        previous_policy : (this.result_selected_quote_data.is_prev_policy_available == 1 ) ? 'true' : 'false' ,
        pre_previous_type : this.result_selected_quote_data.prev_policy_type_id,

        pre_policy_expire_date : this.result_selected_quote_data.prev_policy_expiry_date,
        pre_policy_expire_date_for_od  : this.result_selected_quote_data.od_pre_policy_expiry_date,
        pre_policy_expire_date_for_tp  : this.result_selected_quote_data.tp_pre_policy_expiry_date,
        previose_policy_no_tp  : this.result_selected_quote_data.other_tp_policy_no,
        previose_insurance_company_tp  : this.result_selected_quote_data.other_tp_ic_id,
        made_claim : (this.result_selected_quote_data.is_ncb == 0) ? 'true' : 'false' ,
        previous_ncb : this.result_selected_quote_data.prev_policy_ncb_per,
        pre_policy_nil_dep : (this.result_selected_quote_data.is_prev_policy_nil_dep == 1) ? 'true' : 'false',
        previose_policy_no : (this.result_selected_quote_data.prev_policy_no == 0 ) ? "" : this.result_selected_quote_data.prev_policy_no,
        previose_insurance_company : this.result_selected_quote_data.prev_insurance_company_id,

        cpa_cover_term : this.result_selected_quote_data.cpa_current_tenure,
        cpa_cover_reason : this.result_selected_quote_data.cpa_waiver_reason_id,


        engine_no : this.result_selected_quote_data.engine_no,
        chassis_no : this.result_selected_quote_data.chassis_no,
        vehicle_color : this.result_selected_quote_data.vehicle_color_id,
        company_owner_marital_status : this.result_selected_quote_data.company_owner_marital_status,

        owner_salutation : this.result_selected_quote_data.proposer_salutation_id,
        owner_first_name : this.result_selected_quote_data.proposer_first_name,
        owner_middle_name : this.result_selected_quote_data.proposer_middle_name,
        owner_last_name : this.result_selected_quote_data.proposer_last_name,
        owner_email : this.result_selected_quote_data.proposer_email,
        owner_mobile : this.result_selected_quote_data.proposer_mobile_no,
        owner_dob : this.result_selected_quote_data.proposer_dob,
        owner_gender : this.result_selected_quote_data.proposer_gender,
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
        nominee_relation : this.result_selected_quote_data.nominee_relationship_id,

        appointee_salutation : this.result_selected_quote_data.appointee_salutation_id,
        appointee_first_name : this.result_selected_quote_data.appointee_first_name,
        appointee_middle_name : this.result_selected_quote_data.appointee_middle_name,
        appointee_last_name : this.result_selected_quote_data.appointee_last_name,
        appointee_age : this.result_selected_quote_data.appointee_age,
        appointee_relation : this.result_selected_quote_data.appointee_relationship_id,

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
        hypothecation_city_id : this.result_selected_quote_data.hypothecation_city_id


      });

      this.checkSAODdate(this.result_selected_quote_data.prev_policy_expiry_date);
      this.fetchDataClaimAndNil();
      var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();
      var foundStandAlone : boolean = this.checkStandAloneOd();
      if(foundStandAlone && foundPreviousThirdParty){
        this.resetNcbDetails();
        this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
        this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();
        this.formQuoteDetails.patchValue({
          pre_policy_expire_date_for_od : ''
        });
        this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
      }
    }

    this.loaderActive = false;
  }

  fetchDataClaimAndNil(){
    if(!this.div_show_maid_claim){
      this.formQuoteDetails.patchValue({
        made_claim : (this.result_selected_quote_data.is_ncb == 0) ? 'true' : 'false',
      });
      if(this.result_selected_quote_data.is_ncb==1){
        this.div_show_ncb=false;
        this.maidClaim(this.formQuoteDetails.value.made_claim,'');
        this.formQuoteDetails.patchValue({
          previous_ncb : this.result_selected_quote_data.prev_policy_ncb_per
        });
      }
    }
    if(!this.div_show_previos_policy_nil_dep){
      this.formQuoteDetails.patchValue({
        pre_policy_nil_dep : (this.result_selected_quote_data.is_prev_policy_nil_dep == 1) ? 'true' : 'false'
      });
    }
  }

  selectCpaCoverTerm(event){
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if((event == '0' || event == 0) && !foundStandAlone){
      this.div_show_cpa_reason = true;
      this.formQuoteDetails.get("cpa_cover_reason").setValidators([Validators.required]);
      this.formQuoteDetails.get("cpa_cover_reason").updateValueAndValidity();
    }else{
      this.div_show_cpa_reason = false;
      this.formQuoteDetails.get("cpa_cover_reason").setValidators([]);
      this.formQuoteDetails.get("cpa_cover_reason").updateValueAndValidity();
      this.formQuoteDetails.patchValue({
          cpa_cover_reason : "0"
        });
    }
  }

  selectPolicyHolderType(event){
    var foundStandAlone : boolean = this.checkStandAloneOd();
    this.checkSubTypeAndShowHideDiv();
    this.checkIfSpecialPos(event);
    if(event == '1'){
      this.div_show_cpa_cover = false;
      if(foundStandAlone){
        this.div_show_cpa_cover = true;
      }
      this.div_show_cpa_reason = false;
      this.setValidationForIndividudal();
    }else{
      this.div_show_cpa_cover = true;
      this.setValidationForCorporate();
    }
  }

  setValidationForCorporate(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    this.formQuoteDetails.get("cpa_cover_reason").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_reason").updateValueAndValidity();
  }

  setValidationForIndividudal(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([Validators.required]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone){
      this.formQuoteDetails.get("cpa_cover_term").setValidators([]);
      this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    }
  }

  setInvoicePriceByVariantId(event){

    var variant_id_value = event;
    var variant_id_value :any=  variant_id_value.split("|",2);
    var vehicle_id :any = variant_id_value[0];
    this.result_variant.forEach( (value, key) => {
      if(value.vehicle_master_id == vehicle_id ){
        this.min_invoice_price = this.result_variant[key].min_invoice_price;
        this.max_invoice_price = this.result_variant[key].max_invoice_price;
        this.setInvoiceRange();
      }
    });

  }

  setInvoiceRange(){

    this.formQuoteDetails.get("invoice_price").setValidators([
      Validators.pattern(this.validation_for_number_only),
      Validators.min(this.min_invoice_price),
      Validators.max(this.max_invoice_price)
    ]);
    this.formQuoteDetails.get("invoice_price").updateValueAndValidity();
  }

  reSetInvoiceRange(){

    this.formQuoteDetails.get("invoice_price").setValidators([]);
    this.formQuoteDetails.get("invoice_price").updateValueAndValidity();
  }

  maidClaim(event,from_data){

    if(from_data == 'angular'){
      this.formQuoteDetails.patchValue({  previous_ncb : '' });
    }

    if(event == 'true' || event == true){
      this.div_show_ncb = true;
      this.formQuoteDetails.get("previous_ncb").setValidators([]);
      this.formQuoteDetails.get("previous_ncb").updateValueAndValidity();
    }else{

      this.div_show_ncb = false;
      this.formQuoteDetails.get("previous_ncb").setValidators([Validators.required]);
      this.formQuoteDetails.get("previous_ncb").updateValueAndValidity();
    }



  }


  resetPreviosPolicyDetails(){

    this.formQuoteDetails.patchValue({
      change_owner_ship : 'true',
      previous_policy   : '',
      pre_previous_type : '',
      pre_policy_expire_date  : '',
      made_claim : '',
      previous_ncb  : '',
      pre_policy_nil_dep : '',
      previose_policy_no : '',
      previose_insurance_company : ''
    });

    this.formQuoteDetails.get("change_owner_ship").setValidators([]);
    this.formQuoteDetails.get("change_owner_ship").updateValueAndValidity();

    this.formQuoteDetails.get("previous_policy").setValidators([]);
    this.formQuoteDetails.get("previous_policy").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("made_claim").setValidators([]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("previous_ncb").setValidators([]);
    this.formQuoteDetails.get("previous_ncb").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no)]);
    //this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    //this.formQuoteDetails.get("previose_insurance_company").setValidators([]);
    //this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();
  }





  validationFormSearchDetails(){
    this.formchSearchDetails = this.formBuilder.group({
      search_ch_eng : ['',[
        Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),
        Validators.pattern(this.validation_for_engine_no)
      ]]
    });
  }


  resetFormSearchDetails(){
    this.submiteedSearchDetails = false;
    this.success_message = "";
    this.error_message = "";
    this.formchSearchDetails.patchValue({
      search_ch_eng : ''
    });
  }

  ////vahan data form
  validationFormSearchVahanDetails(){
    this.formchSearchVahanDetails = this.formBuilder.group({
      search_regi_no : ['',[
        Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),
        Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")
      ]]
    });
  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";

    }, 2000);

  }

  submitFormSearchDetails(){

    this.submiteedSearchVahanDetails = true;
    if(this.formchSearchVahanDetails.invalid){
      return;
    }
    this.resetForm();
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('search_regi_no',this.formchSearchVahanDetails.value.search_regi_no);
    uploadData.append('user_id',this.loginUserId);
    this.commonService.submitFormSearchDetails(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_data : any = response;

      if(output_data.status){
        console.log("is_vahan_data:-"+output_data.result.is_vahan_data);
        console.log("vahan_msg:-"+output_data.result.vahan_msg);
        if(output_data.result.is_vahan_data == 1){
          Swal.fire({ title: output_data.result.vahan_msg,icon: 'warning' });
        }

        if(output_data.result.product_type_id != this.selected_product_type_id){
          Swal.fire(output_data.result.mpn_product_type_error_message , "", "error" );
        }else{
          if(output_data.result.policy_status_id === undefined || output_data.result.policy_status_id != '1' || output_data.policy_renewal_allowed == true){
           // console.log('mmmmmmmmmmmmmmmmmmmmmm');
            this.result_makes =  output_data.makes;
            this.result_models = this.result_models_changes = output_data.models;
            this.result_variant  = output_data.variants;
            //console.log('aaaaaaaaaaaaaaaaaaaaaaaa');
            this.search_message = output_data.message;
            this.success_message = output_data.show_error_message;
            //console.log('vvvvvvvvvvvvvvvv');

            this.result_policy_types = output_data.policy_types;
            this.result_policy_subtypes = output_data.policy_subtypes;
           console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');


            this.result_selected_quote_data = output_data.result;
            if(this.result_selected_quote_data){
              setTimeout (() => {
                this.loaderActive = true;
                this.setSelectedQuoteData();
              }, 3000);
            }


           // console.log('llllllllllllllllllll');
            if(output_data.policy_renewal_allowed == true){
              this.result_policy_types.splice(0, 1);
            }


           console.log('result_policy_types.....start');
           console.log(this.result_policy_types);
           console.log(this.result_policy_subtypes);
           console.log('result_policy_types.....end');


          }else{
            Swal.fire("Policy is already exist with provided details, "+ output_data.remaining_days +" more days for policy renewal",  "" ,  "error" );
          }
        }

      }else{
        this.error_message = output_data.show_error_message;
      }
      this.removeMessage();
      this.loaderActive = false;
    });


  }




  setVahanQuoteFormData(vahan_data,output_data){

      if(vahan_data.mpn_make_id!='' && vahan_data.mpn_make_id!=null && vahan_data.mpn_make_id!=undefined){
        this.formQuoteDetails.patchValue({ make : vahan_data.mpn_make_id });
        this.formQuoteDetails.get("make").updateValueAndValidity();

        this.selectedMake = vahan_data.mpn_make_id;
      }

      if(vahan_data.mpn_model_id!='' && vahan_data.mpn_model_id!=null && vahan_data.mpn_model_id!=undefined){
        this.formQuoteDetails.patchValue({ model : vahan_data.mpn_model_id });
        this.formQuoteDetails.get("model").updateValueAndValidity();

        this.selectedModel = vahan_data.mpn_model_id;
      }

      if(vahan_data.mpn_vechicle_id!='' && vahan_data.mpn_vechicle_id!=null && vahan_data.mpn_vechicle_id!=undefined && vahan_data.mpn_variant_id!='' && vahan_data.mpn_variant_id!=null && vahan_data.mpn_variant_id!=undefined){
        this.formQuoteDetails.patchValue({ variants : vahan_data.mpn_vechicle_id+'|'+vahan_data.mpn_variant_id });
        this.formQuoteDetails.get("variants").updateValueAndValidity();

        this.selectedVariants = vahan_data.mpn_vechicle_id+'|'+vahan_data.mpn_variant_id;
      }

      ////purchase rto id
      if(output_data.rto_id!='' && output_data.rto_id!=null && output_data.rto_id!=undefined){
        this.formQuoteDetails.patchValue({ rto : output_data.rto_id });
        this.formQuoteDetails.get("rto").updateValueAndValidity();

        this.selectedRto = output_data.rto_id;
      }

      ////purchase year
      if(output_data.purchase_date.pr_year!='' && output_data.purchase_date.pr_year!=null && output_data.purchase_date.pr_year!=undefined){
        this.formQuoteDetails.patchValue({ manufacturer_year : output_data.purchase_date.pr_year });
        this.formQuoteDetails.get("manufacturer_year").updateValueAndValidity();
      }

      ////purchase month
      if(output_data.purchase_date.pr_month!='' && output_data.purchase_date.pr_month!=null && output_data.purchase_date.pr_month!=undefined){
        this.manufacturing_year_selected = false;
        this.formQuoteDetails.patchValue({ manufacturer_month_1 : output_data.purchase_date.pr_month });
        this.formQuoteDetails.get("manufacturer_month_1").updateValueAndValidity();
      }

      ////purchase date
      if(output_data.purchase_date.pr_date!='' && output_data.purchase_date.pr_date!=null && output_data.purchase_date.pr_date!=undefined){
        this.formQuoteDetails.patchValue({ pr_date : output_data.purchase_date.pr_date });
        this.formQuoteDetails.get("pr_date").updateValueAndValidity();

        this.selectDateForAngular('pr_date',output_data.purchase_date.pr_date);
      }

      // if(vahan_data.previous_insurer_policy_no!='' && vahan_data.previous_insurer_policy_no!=null && vahan_data.previous_insurer_policy_no!=undefined){
      //   this.formQuoteDetails.patchValue({ previose_policy_no : vahan_data.previous_insurer_policy_no });
      //   this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();
      // }

      ////policy expiry date
      if(output_data.policy_expiry_date!='' && output_data.policy_expiry_date!=null && output_data.policy_expiry_date!=undefined){
        this.formQuoteDetails.patchValue({ pre_policy_expire_date : output_data.policy_expiry_date });
        this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

        this.selectDateForAngular('pre_policy_expire_date',output_data.policy_expiry_date);
      }

      ////policy expiry date
      if(output_data.previousInsurer!='' && output_data.previousInsurer!=null && output_data.previousInsurer!=undefined){
        this.formQuoteDetails.patchValue({ previose_insurance_company : output_data.previousInsurer });
        this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();
      }

      ////chassis number
      if(vahan_data.chasis_no!='' && vahan_data.chasis_no!=null && vahan_data.chasis_no!=undefined){
        this.chassis_no = vahan_data.chasis_no;
      }

      ////engine number
      if(vahan_data.engine_no!='' && vahan_data.engine_no!=null && vahan_data.engine_no!=undefined){
        this.engine_no = vahan_data.engine_no;
      }
  }


  validationFormQuoteDetails(){

    this.formQuoteDetails = this.formBuilder.group({
      product_type : [this.selected_product_type_id,[Validators.required]],
      policy_type_id : ['',[Validators.required]],
      policy_subtype_id  : ['',[Validators.required]],

      make : ['',[Validators.required]],
      model : ['',[Validators.required]],
      variants : ['',[Validators.required]],
      rto : ['',[Validators.required]],
      reg_no_1 : ['',[Validators.pattern(this.validation_for_reg_1)]],
      reg_no_2 : ['',[Validators.pattern(this.validation_for_reg_2)]],
      manufacturer_month_1 : ['',[Validators.required]],
      manufacturer_year : ['',[Validators.required]],
      pr_date : ['',[Validators.required]],
      policyholdertype : ['',[Validators.required]],
      carrier_type_id : [''],
      invoice_price : ['',[Validators.min(1),Validators.pattern(this.validation_for_number_only)]],
      od_discount : ['max'],
      change_owner_ship : [''],
      previous_policy : [''],
      pre_previous_type : [''],
      pre_policy_expire_date : [''],

      pre_policy_expire_date_for_od  : [''],

      pre_policy_expire_date_for_tp  : [''],
      previose_policy_no_tp  : [''],
      previose_insurance_company_tp  : [''],

      cpa_cover_term : [''],
      cpa_cover_reason : [''],

      made_claim : [''],
      previous_ncb : [''],
      pre_policy_nil_dep : [''],
      previose_policy_no : ['',[Validators.min(1)]],
      previose_insurance_company : [''],

      engine_no : [''],
      chassis_no : [''],
      vehicle_color : [''],
      company_owner_marital_status : [''],

      owner_salutation : [''],
      owner_first_name : [''],
      owner_middle_name : [''],
      owner_last_name : [''],
      owner_email : [''],
      owner_mobile : [''],
      owner_dob : [''],
      owner_gender : [''],
      owner_address_1 : [''],
      owner_address_2 : [''],
      owner_pincode : [''],
      owner_pincode_id : [''],
      owner_city_id : [''],
      owner_state_id : [''],
      owner_city : [''],
      owner_state : [''],
      owner_pan : [''],
      owner_aadhaar : [''],
      owner_gst : [''],

      nominee_salutation : [''],
      nominee_first_name : [''],
      nominee_middle_name : [''],
      nominee_last_name : [''],
      nominee_age : [''],
      nominee_relation : [''],

      appointee_salutation : [''],
      appointee_first_name : [''],
      appointee_middle_name : [''],
      appointee_last_name : [''],
      appointee_age : [''],
      appointee_relation : [''],

      company_salutation : ['4'],
      company_name : [''],
      company_gst_no : [''],
      company_pan_no : [''],

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

      hypothecation_agrement : [''],
      hypothecation_bank : [''],
      hypothecation_city_id : ['']



    });
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
    uploadData.append('url_selected_ic',this.url_selected_ic);
    uploadData.append('user_id',this.loginUserId);
    uploadData.append('is_imported',this.is_imported);
    console.log(this.is_imported);

    let  product_type :any = this.formQuoteDetails.value.product_type;
    product_type = parseInt(product_type);
    uploadData.append('product_type_id',product_type);


    let  policy_type_id :any = this.formQuoteDetails.value.policy_type_id;
    policy_type_id = parseInt(policy_type_id);
    uploadData.append('policy_type_id',policy_type_id);


    let  policy_subtype_id :any = this.formQuoteDetails.value.policy_subtype_id;
    policy_subtype_id = parseInt(policy_subtype_id);

    uploadData.append('policy_subtype_id',policy_subtype_id);
    uploadData.append('prev_policy_sub_type_id',this.previousPolicy_sub_type_id);


    uploadData.append('reg_no_1',this.formQuoteDetails.value.reg_no_1);
    uploadData.append('reg_no_2',this.formQuoteDetails.value.reg_no_2);

    let  make_id :any = this.formQuoteDetails.value.make;
    make_id = parseInt(make_id);
    uploadData.append('make_id',make_id);


    let  model_id :any = this.formQuoteDetails.value.model;
    model_id = parseInt(model_id);
    uploadData.append('model_id',model_id);

    let variant_vehicle_str :any =  this.formQuoteDetails.value.variants;
    let variant_vehicle :any=  variant_vehicle_str.split("|",2);

    let  variant_id :any = variant_vehicle[1];
    variant_id = parseInt(variant_id);

    let  vehicle_id :any = variant_vehicle[0];
    vehicle_id = parseInt(vehicle_id);

    uploadData.append('variant_id',variant_id);
    uploadData.append('vehicle_id',vehicle_id);

    let  rto_id :any = this.formQuoteDetails.value.rto;
    rto_id = parseInt(rto_id);
    uploadData.append('rto_id',rto_id);
    uploadData.append('is_changes_in_ownership',this.formQuoteDetails.value.change_owner_ship);


    let  manufacturer_month :any = this.formQuoteDetails.value.manufacturer_month_1;
    manufacturer_month = parseInt(manufacturer_month);
    uploadData.append('manufacturing_month',manufacturer_month);

    let  manufacturer_year :any = this.formQuoteDetails.value.manufacturer_year;
    manufacturer_year = parseInt(manufacturer_year);
    uploadData.append('manufacturing_year',manufacturer_year);


    uploadData.append('registration_date', this.formQuoteDetails.value.pr_date );

    let  od_discount :any = this.formQuoteDetails.value.od_discount;
    if(od_discount != "max"){ od_discount = parseInt(od_discount);  }
    uploadData.append('selected_od_discount',od_discount);

    let  proposer_type_id :any = this.formQuoteDetails.value.policyholdertype;
    proposer_type_id = parseInt(proposer_type_id);
    uploadData.append('proposer_type_id',proposer_type_id);

    let  carrier_type_id :any = this.formQuoteDetails.value.carrier_type_id;
    carrier_type_id = parseInt(carrier_type_id);

    uploadData.append('carrier_type_id',carrier_type_id);


    let  invoice_price :any = this.formQuoteDetails.value.invoice_price;
    invoice_price = parseInt(invoice_price);
    uploadData.append('vehicle_invoice_price',invoice_price);



    let  previous_policy :any = this.formQuoteDetails.value.previous_policy;
    previous_policy = this.strToBool(previous_policy);
    uploadData.append('is_prev_policy_available',previous_policy);

    let  pre_previous_type :any = this.formQuoteDetails.value.pre_previous_type;
    pre_previous_type = parseInt(pre_previous_type);
    uploadData.append('prev_policy_type_id',pre_previous_type);

    let prev_policy_expiry_date :any = this.formQuoteDetails.value.pre_policy_expire_date;
    if(this.policy_sub_type_id == 4 || this.policy_sub_type_id == 20){
      prev_policy_expiry_date  = this.formQuoteDetails.value.pre_policy_expire_date_for_od;
    }
    uploadData.append('prev_policy_expiry_date',prev_policy_expiry_date);
    uploadData.append('pre_policy_expire_date_for_od',this.formQuoteDetails.value.pre_policy_expire_date_for_od);

    uploadData.append('pre_policy_expire_date_for_tp',this.formQuoteDetails.value.pre_policy_expire_date_for_tp);
    uploadData.append('other_tp_policy_no',this.formQuoteDetails.value.previose_policy_no_tp);
    uploadData.append('other_tp_ic_id',this.formQuoteDetails.value.previose_insurance_company_tp);


    uploadData.append('is_cpa_dl_exist',this.formQuoteDetails.value.cpa_cover_term);
    uploadData.append('cpa_current_tenure',this.formQuoteDetails.value.cpa_cover_term);

    let  cpa_cover_reason :any = this.formQuoteDetails.value.cpa_cover_reason;
    cpa_cover_reason = parseInt(cpa_cover_reason);
    uploadData.append('cpa_waiver_reason_id',cpa_cover_reason);


    let is_ncb : any ;
    is_ncb = (this.formQuoteDetails.value.made_claim == 'true' || this.formQuoteDetails.value.made_claim == '' ) ? 'false': 'true' ;

    uploadData.append('is_ncb',is_ncb);

    let current_ncb_per : any = (this.formQuoteDetails.value.previous_ncb == "" || this.formQuoteDetails.value.previous_ncb == null) ? 0 : this.formQuoteDetails.value.previous_ncb;

    uploadData.append('current_ncb_per',current_ncb_per);
    uploadData.append('is_prev_policy_nil_dep',this.formQuoteDetails.value.pre_policy_nil_dep);
    uploadData.append('prev_policy_no',this.formQuoteDetails.value.previose_policy_no);
    uploadData.append('prev_insurance_company_id',this.formQuoteDetails.value.previose_insurance_company);

    ///append chassis & engine number
    uploadData.append('engine_no',this.formQuoteDetails.value.engine_no);
    uploadData.append('chassis_no',this.formQuoteDetails.value.chassis_no);
    let  vehicle_color_id :any = this.formQuoteDetails.value.vehicle_color;
    vehicle_color_id = parseInt(vehicle_color_id);
    uploadData.append('vehicle_color_id',vehicle_color_id);

    let  company_owner_marital_status :any = this.formQuoteDetails.value.company_owner_marital_status;
    uploadData.append('company_owner_marital_status',company_owner_marital_status);

    let  proposer_salutation_id :any = this.formQuoteDetails.value.owner_salutation;
    proposer_salutation_id = parseInt(proposer_salutation_id);
    uploadData.append('proposer_salutation_id',proposer_salutation_id);
    uploadData.append('proposer_first_name',this.formQuoteDetails.value.owner_first_name);
    uploadData.append('proposer_middle_name',this.formQuoteDetails.value.owner_middle_name);
    uploadData.append('proposer_last_name',this.formQuoteDetails.value.owner_last_name);
    uploadData.append('proposer_email',this.formQuoteDetails.value.owner_email);

    let  owner_mobile :any = this.formQuoteDetails.value.owner_mobile;
    owner_mobile = parseInt(owner_mobile);
    uploadData.append('proposer_mobile_no',owner_mobile);

    uploadData.append('proposer_dob',this.formQuoteDetails.value.owner_dob);
    uploadData.append('proposer_gender',this.formQuoteDetails.value.owner_gender);
    uploadData.append('proposer_address1',this.formQuoteDetails.value.owner_address_1);
    uploadData.append('proposer_address2',this.formQuoteDetails.value.owner_address_2);

    let  owner_pincode :any = this.formQuoteDetails.value.owner_pincode;
    owner_pincode = parseInt(owner_pincode);
    uploadData.append('proposer_pincode',owner_pincode);

    let  owner_pincode_id :any = this.formQuoteDetails.value.owner_pincode_id;
    owner_pincode_id = parseInt(owner_pincode_id);
    uploadData.append('proposer_pincode_id',owner_pincode_id);

    let  owner_city_id :any = this.formQuoteDetails.value.owner_city_id;
    owner_city_id = parseInt(owner_city_id);
    uploadData.append('proposer_city_id',owner_city_id);

    let  owner_state_id :any = this.formQuoteDetails.value.owner_state_id;
    owner_state_id = parseInt(owner_state_id);
    uploadData.append('proposer_state_id',owner_state_id);

    uploadData.append('proposer_city',this.formQuoteDetails.value.owner_city);
    uploadData.append('proposer_state',this.formQuoteDetails.value.owner_state);
    uploadData.append('proposer_pan_no',this.formQuoteDetails.value.owner_pan);
    uploadData.append('proposer_adhaar_no',this.formQuoteDetails.value.owner_aadhaar);
    uploadData.append('proposer_gst_no',this.formQuoteDetails.value.owner_gst);

    let  nominee_salutation :any = this.formQuoteDetails.value.nominee_salutation;
    nominee_salutation = parseInt(nominee_salutation);
    uploadData.append('nominee_salutation_id',nominee_salutation);
    uploadData.append('nominee_first_name',this.formQuoteDetails.value.nominee_first_name);
    uploadData.append('nominee_middle_name',this.formQuoteDetails.value.nominee_middle_name);
    uploadData.append('nominee_last_name',this.formQuoteDetails.value.nominee_last_name);
    uploadData.append('nominee_age',this.formQuoteDetails.value.nominee_age);
    let  nominee_relation :any = this.formQuoteDetails.value.nominee_relation;
    nominee_relation = parseInt(nominee_relation);
    uploadData.append('nominee_relationship_id',nominee_relation);

    let  appointee_salutation :any = this.formQuoteDetails.value.appointee_salutation;
    appointee_salutation = parseInt(appointee_salutation);
    uploadData.append('appointee_salutation_id',appointee_salutation);
    uploadData.append('appointee_first_name',this.formQuoteDetails.value.appointee_first_name);
    uploadData.append('appointee_middle_name',this.formQuoteDetails.value.appointee_middle_name);
    uploadData.append('appointee_last_name',this.formQuoteDetails.value.appointee_last_name);
    uploadData.append('appointee_age',this.formQuoteDetails.value.appointee_age);

    let  appointee_relation :any = this.formQuoteDetails.value.appointee_relation;
    appointee_relation = parseInt(appointee_relation);

    uploadData.append('appointee_relationship_id',appointee_relation);

    let  hypothecation_agrement :any = this.formQuoteDetails.value.hypothecation_agrement;
    hypothecation_agrement = parseInt(hypothecation_agrement);

    uploadData.append('agreement_type_id',hypothecation_agrement);
    let  company_salutation :any = this.formQuoteDetails.value.company_salutation;
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

    let  company_owner_pincode_id :any = this.formQuoteDetails.value.company_owner_pincode_id;
    company_owner_pincode_id = parseInt(company_owner_pincode_id);
    uploadData.append('company_owner_pincode_id',company_owner_pincode_id);

    let  company_owner_city_id :any = this.formQuoteDetails.value.company_owner_city_id;
    company_owner_city_id = parseInt(company_owner_city_id);
    uploadData.append('company_owner_city_id',company_owner_city_id);

    let  company_owner_state_id :any = this.formQuoteDetails.value.company_owner_state_id;
    company_owner_state_id = parseInt(company_owner_state_id);
    uploadData.append('company_owner_state_id',company_owner_state_id);
    uploadData.append('company_owner_city',this.formQuoteDetails.value.company_owner_city);
    uploadData.append('company_owner_state',this.formQuoteDetails.value.company_owner_state);

    uploadData.append('agreement_financiar_id',this.formQuoteDetails.value.hypothecation_bank);
    uploadData.append('hypothecation_city_id',this.formQuoteDetails.value.hypothecation_city_id);
    uploadData.append('agreement_type_id',hypothecation_agrement);
    uploadData.append('is_tppd','1');


    return uploadData;

  }


  submitFormQuoteDetails(){
    this.submittedQuoteDetails = true;




    if(this.formQuoteDetails.invalid){
     this.findInvalidControls();
      Swal.fire ("Please fill all mandatory fields",  "" ,  "error" );
     return;
    }



    var uploadData : any = this.setParameterForSubmitForm();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone && this.formQuoteDetails.value.previous_policy=='false'){
      Swal.fire ("Please fill previous policy details.",  "" ,  "error" );
      this.loaderActive = false;
      return;
    }

    this.checkPucAndSubmitForm(uploadData);


  }

  checkPucAndSubmitForm(uploadData){
    let pre_date : any = new Date(this.pre_policy_expire_date);
    let current_date : any = new Date(this.selected_current_date);

    console.log("change_owner_ship "+this.formQuoteDetails.value.change_owner_ship);
    console.log("previous_policy "+this.formQuoteDetails.value.previous_policy);
    console.log("pre_policy_expire_date "+pre_date);
    console.log("current Date "+current_date);
    console.log("policy type id "+this.selected_policy_type_id);

    let puc_message : any = false;
    /*if(!this.formQuoteDetails.invalid && (this.formQuoteDetails.value.change_owner_ship == true ||
      this.formQuoteDetails.value.previous_policy == false ||
      pre_date <  current_date)){
        puc_message = true;
    }*/
    if(this.selected_policy_type_id == 2 && this.formQuoteDetails.value.change_owner_ship == 'true' )
    {
      puc_message = true;
    }
    if(puc_message){
      Swal.fire({
        title: 'Please be ready with your PUC copy',
        confirmButtonText: `OK`,

      }).then((result) => {
        if (result.isConfirmed) {
          this.SubmitFormAfterCheckkingAllCondtion(uploadData);
        }
      });



    }else{
      this.SubmitFormAfterCheckkingAllCondtion(uploadData);
    }

  }

  SubmitFormAfterCheckkingAllCondtion(uploadData){
    this.loaderActive = true;
    this.commonService.submitFormQuoteDetails(uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        console.log(this.quote_form_navigate_url);
        if(outputResult.status){
          console.log(this.quote_form_navigate_url);
          sessionStorage.setItem('unique_ref_no', outputResult.unique_ref_no);
          sessionStorage.setItem('is_imported', outputResult.is_imported);
          sessionStorage.setItem('active_ic_for_quote', outputResult.active_ic_for_quote);
          sessionStorage.setItem('product_type_id', this.selected_product_type_id);

            if(this.url_reg_no != undefined && this.url_reg_no!=null){
              this.router.navigate([this.quote_form_share_navigate_url+'/'+outputResult.unique_ref_no]);
            }else{
              this.router.navigate([this.quote_form_navigate_url]);
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


  checkIfSpecialPos(event){
    console.log(this.policy_sub_type_id);
    console.log(event);
    if(event == '1')
    {
      if(this.is_cpa_compulsory == 'YES')
      {
        if(this.selected_product_type_id == '2') //Two Wheeler
        {  
          if(this.policy_sub_type_id == 1) //if policy type is new & package-comprehensive 1+5
          {    
            console.log('New - package-comprehensive');    
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : this.cpa_tenure, 
            });
          }
          else if(this.policy_sub_type_id == 3 || this.policy_sub_type_id == 5) //if policy type is renew & comprehensive 1+1/ TP
          {
            console.log('Renew - Comprehensive/TP');
            if(this.cpa_tenure == 1)
            {
              this.cpa_radio_btn_state = true;
              console.log(this.cpa_radio_btn_state);    
              this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : this.cpa_tenure, 
              });
            }
            else
            {
              console.log('Tenure not 5');
              this.cpa_radio_btn_state = false;
              console.log(this.cpa_radio_btn_state);    
              this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : '', 
              }); 
            }
          }        
          else 
          {
            // console.log('Renew-SAOD');
            this.cpa_radio_btn_state = true;
            // console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : event,
              cpa_cover_term : '',
            });      
          }
        }
        else if(this.selected_product_type_id == '1') //Two Wheeler
        {  
          if(this.policy_sub_type_id == 17) //if policy type is new & package-comprehensive 1+3
          {    
            console.log('New - package-comprehensive');    
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : this.cpa_tenure, 
            });
          }
          else if(this.policy_sub_type_id == 19 || this.policy_sub_type_id == 21) //if policy type is renew & comprehensive 1+1/ TP
          {
            console.log('Renew - Comprehensive/TP');
            if(this.cpa_tenure == 1)
            {
              this.cpa_radio_btn_state = true;
              console.log(this.cpa_radio_btn_state);    
              this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : this.cpa_tenure, 
              });
            }
            else
            {
              console.log('Tenure not 5');
              this.cpa_radio_btn_state = false;
              console.log(this.cpa_radio_btn_state);    
              this.formQuoteDetails.patchValue({
                policyholdertype : 1,
                cpa_cover_term : '', 
              }); 
            }
          }        
          else 
          {
            // console.log('Renew-SAOD');
            this.cpa_radio_btn_state = true;
            // console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : event,
              cpa_cover_term : '',
            });      
          }
        }
      }
      else
      {
        this.cpa_radio_btn_state = false;
        this.formQuoteDetails.patchValue({
          policyholdertype : 1,
          cpa_cover_term : '',
        });   
      }  
    }
    else
    {
      this.cpa_radio_btn_state = false;
      this.formQuoteDetails.patchValue({
          policyholdertype : 2,
          cpa_cover_term : '',
        });
    } 
  }


  enabledisablecpa(policy_sub_type_id){
    // console.log("Policy Subtype :"+policy_subtype_id);
    console.log("Product Type :"+this.selected_product_type_id);
    console.log("Is CPA is_cpa_compulsory :"+this.is_cpa_compulsory);    
    console.log("CPA Tenure :"+this.cpa_tenure);    
    if(this.is_cpa_compulsory == 'YES')
    {
      if(this.selected_product_type_id == '2') //Two Wheeler
      {  
        if(policy_sub_type_id == 1) //if policy type is new & package-comprehensive 1+5
        {    
          console.log('New - package-comprehensive');    
          this.cpa_radio_btn_state = true;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
              policyholdertype : 1,
              cpa_cover_term : this.cpa_tenure, 
          });
        }
        else if(policy_sub_type_id == 3 || policy_sub_type_id == 5) //if policy type is renew & comprehensive 1+1/ TP
        {
          console.log('Renew - Comprehensive/TP');
          if(this.cpa_tenure == 1)
          {
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : 1,
              cpa_cover_term : this.cpa_tenure, 
            });
          }
          else
          {
            console.log('Tenure not 5');
            this.cpa_radio_btn_state = false;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : '', 
            }); 
          }
        }        
        else 
        {
          console.log('Renew-SAOD');
          this.cpa_radio_btn_state = false;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
            policyholdertype : '',
            cpa_cover_term : '',
          });      
        }
      }
      else if(this.selected_product_type_id == '1') //Private Car
      {  
        if(policy_sub_type_id == 17) //if policy type is new & package-comprehensive 1+3
        {    
          console.log('New - package-comprehensive');    
          this.cpa_radio_btn_state = true;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
              policyholdertype : 1,
              cpa_cover_term : this.cpa_tenure, 
          });
        }
        else if(policy_sub_type_id == 19 || policy_sub_type_id == 21) //if policy type is renew & comprehensive 1+1/ TP
        {
          console.log('Renew - Comprehensive/TP');
          if(this.cpa_tenure == 1)
          {
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : 1,
              cpa_cover_term : this.cpa_tenure, 
            });
          }
          else
          {
            console.log('Tenure not 5');
            this.cpa_radio_btn_state = false;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : '', 
            }); 
          }
        }        
        else 
        {
          console.log('Renew-SAOD');
          this.cpa_radio_btn_state = false;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
            policyholdertype : '',
            cpa_cover_term : '',
          });      
        }
      }  
    }
    else
    {
      console.log('Not an ICICI POS');
      this.cpa_radio_btn_state = false;
      console.log(this.cpa_radio_btn_state);    
      this.formQuoteDetails.patchValue({
        policyholdertype : '',
        cpa_cover_term : '',
      });   
    }
  }


  checkIfSpecialPosOnPolicyTypeSelect(){
    if(this.is_cpa_compulsory == 'YES')
    {
      if(this.selected_product_type_id == '2') //Two Wheeler
      {  
        if(this.policy_sub_type_id == 1) //if policy type is new & package-comprehensive 1+5
        {    
          console.log('New - package-comprehensive');    
          this.cpa_radio_btn_state = true;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : this.cpa_tenure, 
          });
        }
        else if(this.policy_sub_type_id == 3 || this.policy_sub_type_id == 5) //if policy type is renew & comprehensive 1+1/ TP
        {
          console.log('Renew - Comprehensive/TP');
          if(this.cpa_tenure == 1)
          {
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : this.cpa_tenure, 
            });
          }
          else
          {
            console.log('Tenure not 5');
            this.cpa_radio_btn_state = false;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : '', 
            }); 
          }
        }        
        else 
        {
          // console.log('Renew-SAOD');
          this.cpa_radio_btn_state = true;
          // console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
            policyholdertype : '',
            cpa_cover_term : '',
          });      
        }
      }
      else if(this.selected_product_type_id == '1') //Private Car
      {  
        if(this.policy_sub_type_id == 17) //if policy type is new & package-comprehensive 1+3
        {    
          console.log('New - package-comprehensive');    
          this.cpa_radio_btn_state = true;
          console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : this.cpa_tenure, 
          });
        }
        else if(this.policy_sub_type_id == 19 || this.policy_sub_type_id == 21) //if policy type is renew & comprehensive 1+1/ TP
        {
          console.log('Renew - Comprehensive/TP');
          if(this.cpa_tenure == 1)
          {
            this.cpa_radio_btn_state = true;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : this.cpa_tenure, 
            });
          }
          else
          {
            console.log('Tenure not 3');
            this.cpa_radio_btn_state = false;
            console.log(this.cpa_radio_btn_state);    
            this.formQuoteDetails.patchValue({
              policyholdertype : '',
              cpa_cover_term : '', 
            }); 
          }
        }        
        else 
        {
          // console.log('Renew-SAOD');
          this.cpa_radio_btn_state = true;
          // console.log(this.cpa_radio_btn_state);    
          this.formQuoteDetails.patchValue({
            policyholdertype : '',
            cpa_cover_term : '',
          });      
        }
      }
    }
    else
    {
      this.cpa_radio_btn_state = false;
      this.formQuoteDetails.patchValue({
        policyholdertype : '',
        cpa_cover_term : '',
      });   
    }
  }




}

