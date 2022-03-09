import { Component, OnInit,Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomvalidationService } from '../services/customvalidation.service';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute } from  '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { ComissionUploadComponent } from 'src/app/admin/manage-common/comission-upload/comission-upload.component';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css']

})
export class QuoteFormComponent implements OnInit {

  isFullQuote : boolean = false ;
  div_show_for_appointee : boolean = true;

  div_show_company_details : boolean = false;
  div_show_owner_details : boolean = false;
  div_show_nominee_details : boolean = false;
  div_show_accessories_box : boolean = true;
  div_show_deductibles_box : boolean = true;
  div_show_pa_cover_box : boolean = true;
  div_show_automobile_association_box : boolean = true;
  div_show_pa_unnamed_sum_insured_box : boolean = true;
  div_show_imt : boolean = true;
  div_show_accessories_and_cover_section : boolean = false;
  div_show_accessories : boolean = false;
  div_show_deductibles : boolean = false;
  div_show_pa_cover : boolean = false;
  div_show_ll_paid_driver : boolean = false;
  div_show_for_imt_box: boolean = true;
  div_show_ll_con_cle_col : boolean = true;
  div_show_ll_con_cle_col_terms  : boolean = true;
  div_show_for_imt_23 : boolean = false;
  is_disabled_geographical : boolean = false;
  result_geographical_extension : any;
  geographical_extension_array: any = [];
  result_addon_package : any;
  result_individual_addons : any;
  individual_addon_array: any = [];
  result_relations : any;
  result_salutation : any;
  result_agreement_types : any;
  div_show_hypothecation_section : boolean = false;
  div_show_geographical_extension_section : boolean = false;
  div_show_addons_section : boolean = false;



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
  hide_for_change_ownership : boolean = true;
  div_show_ncb : boolean = true;
  div_show_cpa_cover : boolean = true;
  div_show_cpa_reason : boolean = false;

  div_not_show_for_carrier_type : boolean = true;
  div_not_show_for_no_of_trailer : boolean = false;
  div_not_show_for_no_of_conductor_ll : boolean = false;
  div_show_od_discount : boolean = false;
  div_show_pa_unnamed_persons   : boolean = false;

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
  selected_product_type_details : any;

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
  relations_id_data : any;


  selected_policy_type_id : any;


  policy_sub_type_id : any;
  result_relationsForNominee : any;
  result_relationsForAppoint : any;



  date_picker_date_picker_pr_date: NgbDateStruct;
  date_picker_pre_policy_expire_date : NgbDateStruct;
  date_picker_pre_policy_expire_date_for_od: NgbDateStruct;
  date_picker_pre_policy_expire_date_for_tp : NgbDateStruct;


  validation_for_reg_1 :any = "^[a-zA-Z]{1,3}$";
  //validation_for_reg_2 :any = "^[0-9]{4,4}$";
  validation_for_reg_2 :any = "^(?!0{4})([0-9]){4,4}$";




  validation_for_number_only :any = "^[0-9]*$";
  validation_for_engine_no :any = "^(?!0{22})([a-zA-Z0-9]){5,22}$";


  validation_for_chassis_no :any = "^(?!0{17})([a-zA-Z0-9]){17}$";
  validation_for_policy_no :any = "^([a-zA-Z0-9-/\/])+$";


  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_character :any = "^[a-zA-Z]+$";
  //validation_for_electriacal :any = "^[0-9]{3,6}$";
  //validation_for_electriacal :any = "^[3-9][0-9]{3}|[1-5][0-9]{4}$";

  //validation_for_electriacal :any = "^[3-9][0-9]{3}|[1-5][0-9]{6}$";

  validation_for_electriacal :any = "^([3-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-8][0-9]{4}|9[0-8][0-9]{3}|99[0-8][0-9]{2}|999[0-8][0-9]|9999[0-9]|[1-8][0-9]{5}|9[0-8][0-9]{4}|99[0-8][0-9]{3}|999[0-8][0-9]{2}|9999[0-8][0-9]|99999[0-9])$";


 validation_for_idv  :any = "^([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-8][0-9]{4}|9[0-8][0-9]{3}|99[0-8][0-9]{2}|999[0-8][0-9]|9999[0-9]|[1-8][0-9]{5}|9[0-8][0-9]{4}|99[0-8][0-9]{3}|999[0-8][0-9]{2}|9999[0-8][0-9]|99999[0-9]|1[0-9]{6}|2000000)$";;


  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_age :any = "^[0-9]{1,2}$";

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


  result_no_of_trailer : any;

  gst_state_code_check_for_individual : any ;
  gst_state_code_check_for_corporate : any ;


  date_picker_owner_dob: NgbDateStruct;
  date_picker_aa_membership_expiry_date : NgbDateStruct;


  disable_geographical_extension : boolean = true;
  div_not_show_for_imt = true;
  disable_individual_addons : boolean = false;
  is_package_addon : any = false;

  result_ll_terms : any;


  selected_vehicle_color: any;
  selectedHypothecation_agrement : any;
  selectedHypothecation_bank : any;
  selectedHypothecation_city : any;

  maxDateForBirthdate : any;
  minDateForBirthdate : any;

  result_pre_policy_subtypes : any = [];




  validation_for_pincode :any =  "^[0-9]{6}$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  validation_for_address :any = "^[a-zA-Z0-9][a-zA-Z0-9 \,\-\/]*$";
  validation_for_aadhar_card :any = "^[2-9]{1}[0-9]{11}$";
  validation_for_appointee_age :any = "^[1-9]{1}[0-9]{1}$";

  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_company_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_gst_no :any         = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  validation_for_company_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  company_pan_no_required: boolean = false;
  user_pan_no_required: boolean = false;
  tpPolicyExpiryDate:any;

  constructor( private activatedRoute : ActivatedRoute, private renderer: Renderer2, private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {

    this.loaderActive = true;

    const current = new Date();
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
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
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

  checkStandAlonedAndComprehnsiveForRenewal(){
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(
        value.unique_key == 'comprehensive' &&
        value.product_type_id == this.selected_product_type_id &&
        value.policy_subtype_id == this.policy_sub_type_id &&
        value.policy_subtype_id == this.policy_sub_type_id &&
        value.policy_type_id == this.selected_policy_type_id

        ){
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

  findcheckComprehnsiveIds(){
    let ids : any = [];
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'comprehensive' && value.product_type_id == this.selected_product_type_id){
        ids.push(value.policy_subtype_id);
      }

    });
    return find;
  }

  findStandAloneOdIds(){
    let ids : any = [];
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'saod' && value.product_type_id == this.selected_product_type_id){
        ids.push(value.policy_subtype_id);
      }

    });
    return ids;
  }

  findThirdPartyIds(){
    let ids : any = [];
    let find : boolean = false;
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.unique_key == 'thirdparty' && value.product_type_id == this.selected_product_type_id){
       ids.push(value.policy_subtype_id);
      }

    });
    return ids;
  }

  SelectNoOfTrailer(event){

    if(event.target.value){
      // this.formQuoteDetails.get("trailor_idv").setValidators([Validators.required]);
      // this.formQuoteDetails.get("trailor_idv").updateValueAndValidity();

      this.formQuoteDetails.get("trailor_idv").setValidators([Validators.required,Validators.min(1),Validators.pattern(this.validation_for_idv)]);
      this.formQuoteDetails.get("trailor_idv").updateValueAndValidity();

    }else{
      this.formQuoteDetails.get("trailor_idv").setValidators([]);
      this.formQuoteDetails.get("trailor_idv").updateValueAndValidity();
    }
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

        case 'hypothecation_agrement':

          this.formQuoteDetails.get("hypothecation_bank").setValidators([Validators.required]);
          this.formQuoteDetails.get("hypothecation_bank").updateValueAndValidity();
          this.formQuoteDetails.get("hypothecation_city_id").setValidators([Validators.required]);
          this.formQuoteDetails.get("hypothecation_city_id").updateValueAndValidity();
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

        case 'hypothecation_agrement':
          this.formQuoteDetails.get("hypothecation_bank").setValidators([]);
          this.formQuoteDetails.get("hypothecation_bank").updateValueAndValidity();
          this.formQuoteDetails.get("hypothecation_city_id").setValidators([]);
          this.formQuoteDetails.get("hypothecation_city_id").updateValueAndValidity();
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
    //alert('inn');
    this.previousPolicy_sub_type_id = policy_subtype_id;
    //var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();

    var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();
    var foundPreviousStandAloneOd : boolean = this.checkPreviousPolicyIsStandAloneOd();
    var checkCofoundPreviousComprehnsive : boolean = this.checkPreviousPolicyIsComprehnsive();


    var foundThirdParty : boolean = this.checkThirdParty();

    console.log("foundThirdParty: " + foundThirdParty);
    console.log("foundPreviousThirdParty: " + foundPreviousThirdParty);

    if(!foundThirdParty){
      var foundStandAlone : boolean = this.checkStandAloneOd();
      if(foundPreviousThirdParty){
        this.resetNcbDetails();
        if(foundStandAlone){
          this.div_show_for_previous_policy_expiry_date_od = true;
          this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
          this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();
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
            this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date_for_od);
          }else{
            this.checkSAODdate(this.formQuoteDetails.value.pre_policy_expire_date);
          }
        }
      }
    }

  }


  previousPolicySubType_old(policy_subtype_id){
    this.previousPolicy_sub_type_id = policy_subtype_id;
    var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();

    var foundPreviousThirdParty : boolean = this.checkPreviousPolicyIsThirdParty();
    var foundPreviousStandAlone : boolean = this.checkPreviousPolicyIsStandAloneOd();
    var foundPreviousComprehsive : boolean = this.checkPreviousPolicyIsComprehnsive();


    var foundThirdParty : boolean = this.checkThirdParty();





    if(!foundThirdParty){
      var foundStandAlone : boolean = this.checkStandAloneOd();
      if(foundPreviousThirdParty){
        this.resetNcbDetails();
        if(foundStandAlone){
          //this.div_show_for_previous_policy_expiry_date_od = true;

          // this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
          // this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();
          // this.formQuoteDetails.patchValue({
          //  pre_policy_expire_date_for_od : ''
          // });
          // this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
        }
      }else{
        if(this.selected_policy_type_id != 1 && !foundPreviousThirdParty){
          this.setNcbDetails();
        }
        if(this.renewal_for_com_saod){
          if(foundStandAlone){
            this.div_show_for_previous_policy_expiry_date_od = false;
            this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([Validators.required]);
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

    if(field == 'owner_dob'){
      this.formQuoteDetails.patchValue({ owner_dob : selected_date });
    }
    if(field == 'aa_membership_expiry_date'){
      this.formQuoteDetails.patchValue({ aa_membership_expiry_date : selected_date });
    }
  }

  tPdateValidationBasedOnODExpirey(selected_date){
    const current = new Date();
    var date1 : any = new Date(current);
    var date2 : any = new Date(selected_date);
    console.log("selected_date for od:"+selected_date);
    console.log("current for od:"+current);


    this.formQuoteDetails.patchValue({
      pre_policy_expire_date_for_tp : ''
    });
    this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;


      // date2.setDate( date2.getDate() + 3 );
      // this.minDateForTpPolicyExpiryDate = {
      //   year: date2.getFullYear(),
      //   month: date2.getMonth() + 1,
      //   day: date2.getDate()
      // }

    if(date1 <= date2){

      date2.setDate( date2.getDate() + 3 );
      this.minDateForTpPolicyExpiryDate = {
        year: date2.getFullYear(),
        month: date2.getMonth() + 1,
        day: date2.getDate()
      }
    }else{
      console.log('od current data in:');
      console.log('od current data in:');
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
      // if(field == 'pre_policy_expire_date_for_od'){
      //   if(selected_date_for_form != '1970-01-01'){
      //     this.date_picker_pre_policy_expire_date_for_od = set_date;
      //     this.formQuoteDetails.patchValue({ pre_policy_expire_date_for_od : selected_date_for_form });
      //   }
      // }

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

      if(field == 'owner_dob'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_owner_dob = set_date;
          this.formQuoteDetails.patchValue({ owner_dob : selected_date_for_form });
        }
      }
      if(field == 'aa_membership_expiry_date'){
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_aa_membership_expiry_date = set_date;
          this.formQuoteDetails.patchValue({ aa_membership_expiry_date : selected_date_for_form });
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

  removePolicySubType(ids){
    ids.forEach( (value, key) => {
      this.result_policy_subtypes_bundle_changes = this.result_policy_subtypes_bundle_changes.filter(item =>
        item.policy_subtype_id != value
      );
    });
  }

  commonPolicySubTypeShowHide(type=''){
    var foundComprehnsive :  boolean = this.checkComprehnsive();
    if(foundComprehnsive){
      var third_party_ids :any = this.findThirdPartyIds();
      var stand_alone_ids :any = this.findStandAloneOdIds();
      var third_party_stand_alone_ids : any = []
       third_party_stand_alone_ids.push(third_party_ids);
       third_party_stand_alone_ids.push(stand_alone_ids);

      var ids=[5,10,11,16,21];
      if(type !=''){
        var ids=[5,10,11,16,21,4,20];
      }else{
        this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
      }
      this.removePolicySubType(ids);
    }else{
      var foundThirdParty : boolean = this.checkThirdParty();
      this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
      if(foundThirdParty){
        var ids=[4,20];
        this.removePolicySubType(ids);
      }
    }
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


  selectPolicySubType(policy_subtype_id){
    this.policy_sub_type_id  = policy_subtype_id;

    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive();

    var findRenewComprehensiveOrStanAlone :  boolean = this.checkStandAlonedAndComprehnsiveForRenewal();
    this.renewal_for_com_saod= false;
    if(findRenewComprehensiveOrStanAlone){
      this.renewal_for_com_saod=true;
    }

    this.commonPolicySubTypeShowHide();
    this.checkSubTypeAndShowHideDiv();
    this.showDivForPreviosPolicy();
    this.changeMonthYearByPolicySubtype();

    if(this.selected_policy_type_id == 1){
      this.resetPreviosPolicyDetails();
    }
    if(this.policy_sub_type_id == 3){
      this.div_show_for_previous_policy_extra_data_no = true;
    }
   // alert(foundStandAlone);
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



  previousPolicy(event,server=''){
    console.log("event" + event );
    console.log("server" + server )
    this.evalue=event;
    if(event == 'true' || event == '1'){
      console.log('event true');
      this.div_show_for_previous_policy_extra_data = false;
      this.hide_for_change_ownership = false;
      // this.showDivForPreviosPolicy();
      this.div_show_for_previous_policy_extra_data_no = true;
      this.resetPreviesSomefieldno();
      if(server !=''){
        //alert(this.result_selected_quote_data.is_changes_in_ownership);
        //console.log('is_changes_in_ownership: ' + this.result_selected_quote_data.is_changes_in_ownership);
       // this.changeOwnerShip(this.result_selected_quote_data.is_changes_in_ownership);
      }
    }else{
      console.log('event false');
      //alert('fnction previousPolicy');
        this.showDivForPreviosPolicyno();
        this.div_show_for_previous_policy_extra_data = true;
        this.hide_for_change_ownership = true;
        this.resetPreviesSomefield();


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
    this.div_show_od_discount = false;
    this.validationForComprehnsive();
    this.div_show_addons_section = false;

    this.div_show_geographical_extension_section = false;
    this.div_show_accessories_and_cover_section = false;
    this.div_show_accessories = false;
    this.div_show_deductibles = false ;
    this.div_show_pa_cover = false;
    this.div_show_for_imt_23 = this.div_not_show_for_imt;


  }

  validationForComprehnsive(){
    this.formQuoteDetails.get("cpa_cover_term").setValidators([Validators.required]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();

    //this.formQuoteDetails.get("od_discount").setValidators([Validators.required]);
    //this.formQuoteDetails.get("od_discount").updateValueAndValidity();

  }

  ShowHideDivForStandAlonOd(){
    this.div_show_addons_section = false;
    this.div_show_cpa_cover = true;
    this.div_show_od_discount = false;
    this.validationForStandAlonOd();

    this.div_show_geographical_extension_section = false;
    this.div_show_accessories = false;
    this.div_show_deductibles = false;
    this.div_show_pa_cover = true;

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
    this.div_show_addons_section = true;
    //this.div_show_cpa_cover = false;
    this.div_show_od_discount = true;
    this.validationForThirdParty();


    this.div_show_cpa_cover = false;
    this.div_show_od_discount = true;
    this.div_show_addons_section = true;
    this.div_show_geographical_extension_section = true;
    this.div_show_accessories_and_cover_section = false;
    this.div_show_accessories = true;
    this.div_show_deductibles = true;
    this.div_show_pa_cover = false;

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
    this.hide_for_change_ownership  = false;
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

    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();


    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();



    this.formQuoteDetails.get("made_claim").setValidators([]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();


  }

  ShowDivForPreviosPolicyForStandAloneOd(){

    this.div_show_change_in_ownersip  = false;
    this.div_show_do_you_have_previous_policy  = false;
    this.hide_for_change_ownership  = false;
    this.div_show_for_previous_policy_expiry_date  = true;
    this.div_show_for_previous_policy_expiry_date_od  = false;
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

    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([
      Validators.min(1),
      Validators.minLength(5),
      Validators.maxLength(25),
      Validators.pattern(this.validation_for_policy_no),
      Validators.required
    ]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no").setValidators([
      Validators.min(1),
      Validators.minLength(5),
      Validators.maxLength(25),
      Validators.pattern(this.validation_for_policy_no),
      Validators.required
    ]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();


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
    this.hide_for_change_ownership  = false;
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


    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no").setValidators([Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no),Validators.required]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([Validators.required]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();




  }





  resetPreviesSomefield(){
    this.date_picker_pre_policy_expire_date =  this.setNullDate;

    this.formQuoteDetails.patchValue({
      pre_policy_expire_date : '',
      pre_policy_expire_date_for_od : '',
      pre_policy_expire_date_for_tp : '',

      previose_policy_no_tp : '',
      previose_insurance_company_tp : '',
      previose_policy_no : '',

      previose_insurance_company : '',
      made_claim : '',
      pre_policy_nil_dep : '',
      pre_previous_type : '',
      previous_ncb : ''

    });

    this.formQuoteDetails.get("pre_policy_expire_date").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_od").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_od").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
   this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_policy_no").setValidators([]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();

    this.formQuoteDetails.get("made_claim").setValidators([]);
    this.formQuoteDetails.get("made_claim").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_nil_dep").setValidators([]);
    this.formQuoteDetails.get("pre_policy_nil_dep").updateValueAndValidity();

    this.formQuoteDetails.get("pre_previous_type").setValidators([]);
    this.formQuoteDetails.get("pre_previous_type").updateValueAndValidity();

    this.formQuoteDetails.get("previous_ncb").setValidators([]);
    this.formQuoteDetails.get("previous_ncb").updateValueAndValidity();


  }

  resetPreviesSomefieldno(){

    this.formQuoteDetails.get("previose_policy_no_tp").setValidators([]);
    this.formQuoteDetails.get("previose_policy_no_tp").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company_tp").setValidators([]);
    this.formQuoteDetails.get("previose_insurance_company_tp").updateValueAndValidity();

    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").setValidators([]);
    this.formQuoteDetails.get("pre_policy_expire_date_for_tp").updateValueAndValidity();


  }

  reneawalSaod(val){
    this.div_show_do_you_have_previous_policy = false;
    this.hide_for_change_ownership = false;
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
    console.log('changeOwnerShip: ' + event);
    var foundThirdParty : boolean = this.checkThirdParty();
    console.log('foundThirdParty: ' + foundThirdParty);
    if(!foundThirdParty){
      console.log('renewal_for_com_saod: ' + this.renewal_for_com_saod);
      if(this.renewal_for_com_saod){
        this.reneawalSaod(event);
      }else{

        if(event == 'true'){
          console.log('event true: ' + event);
          this.div_show_do_you_have_previous_policy = false;
          this.div_show_for_previous_policy_extra_data = false;
          this.div_show_for_previous_policy_extra_data_no = false;
          this.hide_for_change_ownership = true;
          
          if((this.selected_policy_type_id==20) && (this.policy_sub_type_id==2)){
          }else{
            this.resetPreviosPolicyDetails();
          }
        }else{
          //alert('inn');
          console.log('event false: ' + event);
          this.div_show_do_you_have_previous_policy = false;
          this.div_show_for_previous_policy_extra_data = true;
          this.hide_for_change_ownership = false;
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

    this.date_picker_pre_policy_expire_date =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_od =  this.setNullDate;
    this.date_picker_pre_policy_expire_date_for_tp =  this.setNullDate;

    this.date_picker_date_picker_pr_date =  this.setNullDate;
    this.date_picker_owner_dob =  this.setNullDate;
    this.date_picker_aa_membership_expiry_date =  this.setNullDate;
    this.validationFormQuoteDetails();

    this.selectedMake = null;
    this.selectedRto = null;
    this.selectedModel = null;
    this.selectedVariants = null;

    this.unCheckedIndividualAddons();

    this.selectAccessories(0);
    this.selectDeductibles(0);
    this.selectAutomobileAssociation(0);
    this.selectPaCovers(0);
    this.selectUnnamedPerson(0);
    this.checkLLConductor(0);
    this.selectImt(0);``


    this.div_show_company_details = false;
    this.div_show_owner_details  = false;
    this.div_show_nominee_details  = false;
    this.div_show_for_appointee  = true;


    this.selectedHypothecation_agrement = null;
    this.selectedHypothecation_bank =null;
    this.selectedHypothecation_city =null;

    this.div_show_cpa_cover = true;
    this.div_show_cpa_reason = false;
    this.result_policy_subtypes_changes = [];
    this.result_policy_subtypes_bundle_changes= [];


  }

  ngOnInit(): void {
    let href : any = this.router.url;
    console.log('href...'+ href);
    this.selected_product_type_id =  sessionStorage.getItem('selected_product_type_id');

    //href = href.slice(0, href.lastIndexOf('/'));
   // href = href.slice(0, href.lastIndexOf('/'));

    // if(href == '/share/bike-insurance-quote'){
    //   this.selected_product_type_id  = 2;
    // }else if(href == '/share/car-insurance-quote'){
    //   this.selected_product_type_id  = 1;
    // }

    // if(href == '/car-quote-form'){
    //   this.selected_product_type_id  = 1;
    // }
    console.log('href'+ href);
    console.log("selected_product_type_id:-"+this.selected_product_type_id);

    sessionStorage.removeItem('policy_no');
    sessionStorage.removeItem('transaction_no');
    sessionStorage.removeItem('proposal_no');
    sessionStorage.removeItem('quote_no');
    sessionStorage.removeItem('active_ic_for_quote');
    sessionStorage.removeItem('selected_ic_id');
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
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
      // this.unique_ref_no  = "2961370a7a94b1d";
       //this.unique_ref_no  = '296125ec0eb103b'; // for car renew with for Individual Addons
       //this.unique_ref_no  = '29612776550296a'; // for car new with with addon package
      // this.unique_ref_no  = '2961457a784820b'; // for car



        if( this.url_reg_no != null){
          this.is_dealer_url_with_login = false;
          this.formchSearchVahanDetails.patchValue({search_regi_no : atob(this.url_reg_no)});
          this.url_read_only = true;
        }
        this.getIndex();
    }

  }

  setPolicySubType(){

    this.div_show_for_policy_subtypes = true;
    this.result_policy_subtypes_changes = [];
    this.result_policy_subtypes.forEach( (value, key) => {
      if(value.product_type_id == this.selected_product_type_id && value.policy_type_id == this.selected_policy_type_id){
        this.result_policy_subtypes_changes.push(this.result_policy_subtypes[key]);
        this.div_show_for_policy_subtypes = false;
      }
    });

    //this.result_policy_subtypes_bundle_changes=this.result_policy_subtypes_changes;
    this.result_policy_subtypes_bundle_changes=this.result_pre_policy_subtypes;


  }



  showDivPreviousPolicy(){
    this.div_previous_policy_details_section = true;
    this.div_show_do_you_have_previous_policy = false;
    this.hide_for_change_ownership = false;

  }

  hideDivForPreviousPolicy(){
    this.div_previous_policy_details_section = false;
  }

  selectPolicyType(policy_type_id,data_come_from){
    console.log("policy_type_id:- "+policy_type_id);
    this.validationONPolicyType(policy_type_id);
    this.resetSubPolicyType();
    this.selected_policy_type_id  = policy_type_id;
    this.setPolicySubType();

    if(data_come_from == 'angular'){
      this.changeYearMonth(policy_type_id);

      if(policy_type_id == 1){

        this.formQuoteDetails.patchValue({
          policy_subtype_id : this.selected_for_new_policy_subtype_id,
          change_owner_ship : 'false'
        });
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

    if(policy_type_id == 1){
      this.formQuoteDetails.get("reg_no_1").setValidators([Validators.pattern(this.validation_for_reg_1)]);
      this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
      this.formQuoteDetails.get("reg_no_2").setValidators([Validators.pattern(this.validation_for_reg_2)]);
      this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

    }else{

      this.formQuoteDetails.get("reg_no_1").setValidators([Validators.required,Validators.pattern(this.validation_for_reg_1)]);
      this.formQuoteDetails.get("reg_no_1").updateValueAndValidity();
      this.formQuoteDetails.get("reg_no_2").setValidators([this.customvalidationService.registrationNoValidator(),Validators.required,Validators.pattern(this.validation_for_reg_2)]);
      this.formQuoteDetails.get("reg_no_2").updateValueAndValidity();

    }
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

      var month_key : number;
      this.result_months.forEach( (value, key) => {
        if(value.id == current_month){
          this.result_months_changes = this.result_months.slice( 0, key+2);
        }
      });
    }
  }

  changeMonthForSaod(year){
    var current_year : number = new Date().getFullYear();
    var current_month : number = new Date().getMonth();
    year
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone){
      this.result_months_changes = [];
      this.result_months.forEach( (value, key) => {
        if(year == 2017){
          this.result_months_changes = this.result_months.slice(8,12);
        }else if(year == current_year){
          if(value.id == current_month){
            this.result_months_changes = this.result_months.slice( 0, key+2);
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
    sendData.append('product_type_id',this.selected_product_type_id);
    sendData.append('isFullQuote','1');

    this.commonService.getQuoteFormData(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var result : any = response;
      this.selectedMake  = result.selected_make_id;

      if(result.selected_make_id){
        this.formQuoteDetails.patchValue({
          make : result.selected_make_id
        });
      }

      this.div_not_show_for_carrier_type  = result.div_not_show_for_carrier_type;
      this.div_not_show_for_no_of_trailer  = result.div_not_show_for_no_of_trailer;
      this.div_not_show_for_no_of_conductor_ll  = result.div_not_show_for_no_of_conductor_ll;
      this.div_show_for_imt_23  = result.div_not_show_for_imt;
      this.div_not_show_for_imt  = result.div_not_show_for_imt;

      this.div_show_ll_con_cle_col  = result.div_not_show_for_no_of_conductor_ll;
      this.div_show_pa_unnamed_persons  = result.div_show_pa_unnamed_persons;


      this.selected_product_type_details  = result.selected_product_type_details;
      this.selected_for_new_policy_subtype_id  = result.selected_for_new_policy_subtype_id;
      this.product_type_name  = result.product_type_name;
      this.product_type_image  = result.product_type_image;

      this.quote_form_share_navigate_url  = result.quote_form_share_navigate_url;
      this.quote_form_navigate_url  = result.quote_form_navigate_url;

      if( this.url_reg_no != null){
        this.submitFormSearchDetails();
      }

      this.result_product_types = result.product_types;
      if(this.result_product_types=='' || this.result_product_types==null || this.result_product_types=='undefined'){
        Swal.fire("Product privileges not assigned! Please contact administrator", '', 'error');
      }

      this.result_policy_types = result.policy_types;
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

      this.result_pa_sum_insured = result.pa_sum_insured;
      this.result_geographical_extension = result.geographical_extension;
      this.result_addon_package = result.addon_package;
      this.result_individual_addons = result.individual_addons;



      this.result_relations = result.relations;
      this.result_relationsForNominee=this.result_relations;
      this.result_relationsForAppoint=this.result_relations;
      this.relations_id_data=result.relations_id_data;
      this.result_salutation = result.salutation;
      this.result_agreement_types = result.agreement_types;
      this.result_ll_terms = result.ll_terms;

      this.result_od_discount = result.od_discount;
      this.result_ic_master = result.ic_master;
      this.result_cpa_reason = result.cpa_reason;
      this.result_previous_ncb = result.previous_ncb;
      this.result_selected_quote_data = result.selected_quote_data;
      this.result_no_of_trailer = result.no_of_trailer;

      if(this.selected_product_type_details && this.selected_product_type_details.code == "truck_gccv"){
        this.setValidationForCarrierType();
      }else{
        this.removeValidationForCarrierType();
      }

      if(this.result_selected_quote_data){
        this.setSelectedQuoteData();
      }

      this.loaderActive = false;

    });


  }



  setSelectedQuoteData(){

    console.log("addon_package_id: "+this.result_selected_quote_data.addon_package_id);
    if(this.result_selected_quote_data){
      this.selected_product_type_id  = this.result_selected_quote_data.product_type_id;
      sessionStorage.setItem('product_type_id', this.selected_product_type_id);
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
        this.setInvoiceRange();
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
      this.selectDateForAngular('owner_dob',this.result_selected_quote_data.proposer_dob);
      this.selectDateForAngular('aa_membership_expiry_date',this.result_selected_quote_data.aa_membership_expiry_date);

      this.selectedMake = this.result_selected_quote_data.make_id;
      this.selectedModel = this.result_selected_quote_data.model_id;

      if(this.result_selected_quote_data.vehicle_id){
        this.selectedVariants = this.result_selected_quote_data.vehicle_id+'|'+this.result_selected_quote_data.variant_id;
      }
      this.selectedRto = this.result_selected_quote_data.rto_id;
      this.maidClaim(!this.result_selected_quote_data.is_ncb,'server');


      this.selectAccessories(this.result_selected_quote_data.is_accessories);
      this.selectDeductibles(this.result_selected_quote_data.is_deductibles);
      this.selectAutomobileAssociation(this.result_selected_quote_data.is_aa_membership);
      this.selectPaCovers(this.result_selected_quote_data.is_pa_covers);
      this.selectUnnamedPerson(this.result_selected_quote_data.is_pa_unnamed_persons);
      this.checkLLConductor(this.result_selected_quote_data.is_ll_conductor);
      this.selectImt(this.result_selected_quote_data.is_imt);
      this.nomineeAge(this.result_selected_quote_data.nominee_age,'server',this.result_selected_quote_data.proposer_type_id);
      this.setIndividualAddons(this.result_selected_quote_data.is_package_addon);
      this.selectDateForAngular('owner_dob',this.result_selected_quote_data.proposer_dob);
      this.selectDateForAngular('aa_membership_expiry_date',this.result_selected_quote_data.aa_membership_expiry_date);
      this.selected_vehicle_color = (this.result_selected_quote_data.vehicle_color_id == "") ? null : this.result_selected_quote_data.vehicle_color_id;
      this.selectedHypothecation_agrement = (this.result_selected_quote_data.agreement_type_id == "") ? null : this.result_selected_quote_data.agreement_type_id;
      this.selectedHypothecation_bank = (this.result_selected_quote_data.agreement_financiar_id == "") ? null : this.result_selected_quote_data.agreement_financiar_id;
      this.selectedHypothecation_city = (this.result_selected_quote_data.hypothecation_city_id == "") ? null : this.result_selected_quote_data.hypothecation_city_id;
      this.setGeographicalExtension(this.result_selected_quote_data.is_geographical);


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
        no_of_trailer : this.result_selected_quote_data.no_of_trailer,
        trailor_idv : this.result_selected_quote_data.trailer_idv,


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
        nominee_gender : this.result_selected_quote_data.nominee_gender,

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

        vehicle_color : this.result_selected_quote_data.vehicle_color_id,
        hypothecation_agrement : this.result_selected_quote_data.agreement_type_id,
        hypothecation_bank : this.result_selected_quote_data.agreement_financiar_id,
        hypothecation_city_id : this.result_selected_quote_data.hypothecation_city_id,

        accessories : this.result_selected_quote_data.is_accessories,
        accessories_electrical : this.result_selected_quote_data.electric_acc_idv,
        accessories_non_electrical : this.result_selected_quote_data.non_electric_acc_idv,

        deductibles : this.result_selected_quote_data.is_deductibles,
        deductibles_actitheft : this.result_selected_quote_data.is_antitheft,
        deductibles_automobile_association : this.result_selected_quote_data.is_aa_membership,

        aa_membership_name : this.result_selected_quote_data.aa_membership_name,
        aa_membership_no : this.result_selected_quote_data.aa_membership_no,
        aa_membership_expiry_date : this.result_selected_quote_data.aa_membership_expiry_date,

        pa_unnamed_persons : this.result_selected_quote_data.is_pa_unnamed_persons,
        pa_cover : this.result_selected_quote_data.is_pa_covers,
        pa_sum_insured : this.result_selected_quote_data.pa_suminsured_per_unnamed_person,
        ll_paid_driver : this.result_selected_quote_data.is_ll_paid_driver,
        is_ll_cun_cle_coo : this.result_selected_quote_data.is_ll_conductor,
        is_ll_terms : this.result_selected_quote_data.no_of_conductor_ll,

        is_imt : this.result_selected_quote_data.is_imt,
        imt_23 : this.result_selected_quote_data.is_imt23,
        imt_34 : this.result_selected_quote_data.is_imt34,

        none_geographical_extension : !this.result_selected_quote_data.is_geographical,
        addon_package : (this.result_selected_quote_data.is_package_addon == 1) ? this.result_selected_quote_data.addon_package_id : 0


      });
      if(this.result_selected_quote_data.is_package_addon == 1)
      {
        this.disable_individual_addons = true;
      }
          

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

      console.log("aa_membership_no: "+this.result_selected_quote_data);
      console.log("aa_membership_no: "+this.formQuoteDetails);
    }
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
    if(event == '1'){
      this.div_show_cpa_cover = false;
      if(foundStandAlone){
        this.div_show_cpa_cover = true;
      }
      this.div_show_owner_details  = true;
      this.div_show_nominee_details = true;
      this.div_show_company_details = false;
      this.div_show_cpa_reason = false;
      this.setValidationForIndividudal();
    }else{
      this.div_show_company_details = true;
      this.div_show_owner_details  = false;
      this.div_show_nominee_details = false;
      this.div_show_for_appointee = true;
      this.div_show_cpa_cover = true;
      this.setValidationForCorporate();
    }



  }

  setValidationForCorporate(){
    this.resetOwnerDetails();

    this.formQuoteDetails.get("company_salutation").setValidators([Validators.required]);
    this.formQuoteDetails.get("company_salutation").updateValueAndValidity();

    this.formQuoteDetails.get("company_name").setValidators([Validators.pattern(this.validation_for_name_with_space),Validators.required]);
    this.formQuoteDetails.get("company_name").updateValueAndValidity();

    this.formQuoteDetails.get("company_gst_no").setValidators([Validators.pattern(this.validation_for_company_gst_no)]);
    this.formQuoteDetails.get("company_gst_no").updateValueAndValidity();

    // if(this.result_selected_quote_data.gross_premium > 50000){
    // this.formQuoteDetails.get("company_pan_no").setValidators([Validators.pattern(this.validation_for_company_pan),Validators.required]);
    // this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();
    // this.company_pan_no_required=true;
    // }else{
    // this.formQuoteDetails.get("company_pan_no").setValidators([Validators.pattern(this.validation_for_company_pan)]);
    // this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();
    // this.company_pan_no_required=false;
    // }

    this.formQuoteDetails.get("company_pan_no").setValidators([Validators.pattern(this.validation_for_company_pan)]);
    this.formQuoteDetails.get("company_pan_no").updateValueAndValidity();
    this.company_pan_no_required=false;

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
      nominee_gender : '',

      appointee_salutation : '',
      appointee_first_name : '',
      appointee_middle_name : '',
      appointee_last_name : '',
      appointee_age : '',
      appointee_relation : ''
    });

    this.formQuoteDetails.get("cpa_cover_term").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    this.formQuoteDetails.get("cpa_cover_reason").setValidators([]);
    this.formQuoteDetails.get("cpa_cover_reason").updateValueAndValidity();
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

    //this.formQuoteDetails.get("owner_marital_status").setValidators([]);
    //this.formQuoteDetails.get("owner_marital_status").updateValueAndValidity();

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

    // if(this.result_selected_quote_data && this.result_selected_quote_data.gross_premium > 50000){
    //   this.formQuoteDetails.get("owner_pan").setValidators([Validators.pattern(this.validation_for_pan),Validators.required]);
    //   this.formQuoteDetails.get("owner_pan").updateValueAndValidity();
    //   this.user_pan_no_required=true;
    //   }else{
    //   this.formQuoteDetails.get("owner_pan").setValidators([Validators.pattern(this.validation_for_pan)]);
    //   this.formQuoteDetails.get("owner_pan").updateValueAndValidity();
    //   this.user_pan_no_required=false;
    // }

    this.formQuoteDetails.get("owner_pan").setValidators([Validators.pattern(this.validation_for_pan)]);
    this.formQuoteDetails.get("owner_pan").updateValueAndValidity();
    this.user_pan_no_required=false;

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

    this.formQuoteDetails.get("nominee_age").setValidators([this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age),Validators.required]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_relation").updateValueAndValidity();

    // this.formQuoteDetails.get("nominee_gender").setValidators([Validators.required]);
    // this.formQuoteDetails.get("nominee_gender").updateValueAndValidity();

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

    this.formQuoteDetails.get("nominee_age").setValidators([this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age),Validators.required]);
    this.formQuoteDetails.get("nominee_age").updateValueAndValidity();

    this.formQuoteDetails.get("nominee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("nominee_relation").updateValueAndValidity();

    // this.formQuoteDetails.get("nominee_gender").setValidators([Validators.required]);
    // this.formQuoteDetails.get("nominee_gender").updateValueAndValidity();

    this.resetCompanyDetails();


    this.formQuoteDetails.get("cpa_cover_term").setValidators([Validators.required]);
    this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone){
      this.formQuoteDetails.get("cpa_cover_term").setValidators([]);
      this.formQuoteDetails.get("cpa_cover_term").updateValueAndValidity();
    }
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

    //this.formQuoteDetails.get("owner_marital_status").setValidators([]);
    //this.formQuoteDetails.get("owner_marital_status").updateValueAndValidity();

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

    this.formQuoteDetails.get("nominee_gender").setValidators([]);
    this.formQuoteDetails.get("nominee_gender").updateValueAndValidity();

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

    // this.formQuoteDetails.get("previose_policy_no").setValidators([
    //   Validators.min(1),
    //   Validators.minLength(5),
    //   Validators.maxLength(25),
    //   Validators.pattern(this.validation_for_policy_no)
    // ]);
    this.formQuoteDetails.get("previose_policy_no").setValidators([
      Validators.min(1),
      Validators.minLength(5),
      Validators.maxLength(25),
      Validators.pattern(this.validation_for_policy_no)
    ]);
    this.formQuoteDetails.get("previose_policy_no").updateValueAndValidity();

    this.formQuoteDetails.get("previose_insurance_company").setValidators([]);
    this.formQuoteDetails.get("previose_insurance_company").updateValueAndValidity();
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
      search_regi_no : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero()]]
    }, {validator: [this.customvalidationService.registrationNoValidatorForVahanSearch] });
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

            if(this.result_models.length < 1){
              Swal.fire("Model not available for selected vehicle" , "", "error" );
            }
            this.result_variant  = output_data.variants;
            //console.log('aaaaaaaaaaaaaaaaaaaaaaaa');
            this.search_message = output_data.message;
            this.success_message = output_data.show_error_message;
            //console.log('vvvvvvvvvvvvvvvv');

            this.result_policy_types = output_data.policy_types;
            this.result_policy_subtypes = output_data.policy_subtypes;
           // console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
            this.result_selected_quote_data = output_data.result;
            if(this.result_selected_quote_data){
              setTimeout (() => {  this.setSelectedQuoteData(); }, 1000);
            }
           // console.log('llllllllllllllllllll');
            if(output_data.policy_renewal_allowed == true){
              this.result_policy_types.splice(0, 1);
            }
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
      is_quick_quote : ['false'],
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
      no_of_trailer : [''],
      trailor_idv : [''],
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
      previose_policy_no : [''],
      previose_insurance_company : [''],



      engine_no : ['',[Validators.required,Validators.pattern(this.validation_for_engine_no),this.customvalidationService.cannotContainZeroAndSpace()]],
      chassis_no : ['',[Validators.required,Validators.pattern(this.validation_for_chassis_no)]],

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
      nominee_gender : [''],

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

      vehicle_color : ['',[Validators.required]],
      hypothecation_agrement : [''],
      hypothecation_bank : [''],
      hypothecation_city_id : [''],

      accessories : [''],
      accessories_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],
      accessories_non_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],


      deductibles : [''],
      deductibles_actitheft : [''],
      deductibles_automobile_association : [''],
      aa_membership_name : ['',[Validators.minLength(2),Validators.maxLength(50),Validators.pattern(this.validation_for_name_with_space)]],
      aa_membership_no : ['',[Validators.min(1),Validators.pattern(this.validation_for_aa_membership_no)]],
      bifuel_kit_idv : [''],
      aa_membership_expiry_date : [''],

      pa_unnamed_persons : [''],
      pa_cover : [''],
      pa_sum_insured : [''],
      ll_paid_driver : [''],
      is_ll_cun_cle_coo : [''],
      is_ll_terms : [''],

      is_ll_conductor  : [''],
      no_of_conductor_ll  : [''],


      is_imt : [''],
      imt_23 : [''],
      imt_34 : [''],

      none_geographical_extension : ['true'],

      geographical_extension : this.formBuilder.array([]),

      addon_package : ['0'],
      individual_addons : this.formBuilder.array([])

    }, {validator: [
      this.checkNomineeAgeUsingRelation,
      this.checkOwnerGstMatchWithPan,
      this.checkCompanyGstMatchWithPan,
      this.customvalidationService.atLeastOneAccessoriesValidator,
      this.customvalidationService.atLeastOnePACoverValidator,
      this.customvalidationService.atLeastOneDeductiblesValidator


    ] });


  }



  checkNomineeAgeUsingRelation(group: FormGroup) {
    var nominee_relation : any = group.get('nominee_relation').value;
    var nominee_age : any = group.get('nominee_age').value;
    if(nominee_relation == 1 || nominee_relation == 2 || nominee_relation == 3 ){
      if(nominee_age < 18){
        return { nomineeAgeRangeUsingRelation: true } ;
      }
    }
    return null;
  }

  checkOwnerGstMatchWithPan(group: FormGroup){
    let gst_no : any = group.get('owner_gst').value;
    gst_no = gst_no.toLowerCase();
    let length_gst : any = gst_no.length;
    let pan_no : any = group.get('owner_pan').value;
    pan_no = pan_no.toLowerCase();
    let length_pan_no : any = pan_no.length;

    if(length_gst > 14 && length_pan_no > 1){
      console.log("gst_no: "+gst_no);
      console.log("pan_no: "+pan_no);
      console.log("owner gst valid or not:- "+gst_no.includes(pan_no));
      let is_valid_gst_no =  gst_no.includes(pan_no)
      console.log("owner gst is_valid_gst_no or not:- "+is_valid_gst_no);

      if(!is_valid_gst_no){
        console.log("panNotMatchForOwner:- "+is_valid_gst_no);
        return { panNotMatchForOwner: true } ;
      }else{
        return null;
      }

    }
  }

  checkCompanyGstMatchWithPan(group: FormGroup){
    let gst_no : any = group.get('company_gst_no').value;
    gst_no = gst_no.toLowerCase();
    let length_gst : any = gst_no.length;
    let pan_no : any = group.get('company_pan_no').value;
    pan_no = pan_no.toLowerCase();
    let length_pan_no : any = pan_no.length;
    console.log('length_gst '+length_gst);
    console.log('length_pan_no '+length_pan_no);

    if(length_gst > 14 && length_pan_no > 1){
      console.log("gst_no: "+gst_no);
      console.log("pan_no: "+pan_no);
      console.log("company gst valid or not:- "+gst_no.includes(pan_no));
      let is_valid_gst_no =  gst_no.includes(pan_no)
      console.log("company gst is_valid_gst_no or not:- "+is_valid_gst_no);

      if(!is_valid_gst_no){
        console.log("panNotMatchForCompany:- "+is_valid_gst_no);
        return { panNotMatchForCompany: true } ;
      }else{
        return null ;
      }

    }
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

   // Swal.fire ("Please fill all mandatory fields",  "" ,  "error" );
    console.log('invalid fields start .....');
    console.log(invalid);
    if(this.formQuoteDetails.hasError('atLeastOneFieldRequiredAccessories')){
      console.log("atLeastOneFieldRequiredAccessories:"+this.formQuoteDetails.getError('atLeastOneFieldRequiredAccessories').text);
    }

    if(this.formQuoteDetails.hasError('atLeastOnePACoverValidator')){
      console.log("atLeastOnePACoverValidator:"+this.formQuoteDetails.getError('atLeastOnePACoverValidator').text);
    }

    if(this.formQuoteDetails.hasError('atLeastOneDeductiblesValidator')){
      console.log("atLeastOneDeductiblesValidator:"+this.formQuoteDetails.getError('atLeastOneDeductiblesValidator').text);
    }





    console.log('invalid fields end.....');

}



  setParameterForSubmitForm(){

    let uploadData = new FormData();
    uploadData.append('is_quick_quote',this.formQuoteDetails.value.is_quick_quote);
    uploadData.append('url_selected_ic',this.url_selected_ic);
    uploadData.append('user_id',this.loginUserId);


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

    let  no_of_trailer :any = this.formQuoteDetails.value.no_of_trailer;
    no_of_trailer = parseInt(no_of_trailer);

    uploadData.append('no_of_trailer',no_of_trailer);

    let  trailor_idv :any = this.formQuoteDetails.value.trailor_idv;
    trailor_idv = parseInt(trailor_idv);

    uploadData.append('trailer_idv',trailor_idv);


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

    //let  company_owner_marital_status :any = this.formQuoteDetails.value.company_owner_marital_status;
   // uploadData.append('company_owner_marital_status',company_owner_marital_status);

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

    uploadData.append('nominee_gender',this.formQuoteDetails.value.nominee_gender);

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

    uploadData.append('is_accessories',this.formQuoteDetails.value.accessories);
    uploadData.append('electric_acc_idv',this.formQuoteDetails.value.accessories_electrical);
    uploadData.append('non_electric_acc_idv',this.formQuoteDetails.value.accessories_non_electrical);

    uploadData.append('is_deductibles',this.formQuoteDetails.value.deductibles);
    uploadData.append('is_antitheft',this.formQuoteDetails.value.deductibles_actitheft);
    uploadData.append('is_aa_membership',this.formQuoteDetails.value.deductibles_automobile_association);
    uploadData.append('aa_membership_name',this.formQuoteDetails.value.aa_membership_name);
    uploadData.append('aa_membership_no',this.formQuoteDetails.value.aa_membership_no);

    uploadData.append('aa_membership_expiry_date',this.formQuoteDetails.value.aa_membership_expiry_date);
    uploadData.append('is_pa_covers',this.formQuoteDetails.value.pa_cover);
    uploadData.append('is_pa_unnamed_persons',(this.formQuoteDetails.value.pa_unnamed_persons == 'null' ) ? "" : this.formQuoteDetails.value.pa_unnamed_persons);
    uploadData.append('pa_suminsured_per_unnamed_person',(this.formQuoteDetails.value.pa_sum_insured == 'null' ) ? "" : this.formQuoteDetails.value.pa_sum_insured);
    uploadData.append('is_ll_paid_driver',this.formQuoteDetails.value.ll_paid_driver);
    uploadData.append('ll_terms',this.formQuoteDetails.value.is_ll_terms);

    uploadData.append('is_imt',this.formQuoteDetails.value.is_imt);
    uploadData.append('imt23',this.formQuoteDetails.value.imt_23);
    uploadData.append('imt34',this.formQuoteDetails.value.imt_34);

    let geographical_extension = (this.formQuoteDetails.value.geographical_extension != undefined) ? this.formQuoteDetails.value.geographical_extension : '';
    uploadData.append('geographical_extension',geographical_extension);


    let is_geographical: any = !this.formQuoteDetails.value.none_geographical_extension;
    // is_geographical = 0;
    // if (geographical_extension !== null && geographical_extension !== undefined && geographical_extension !="") {
    //   is_geographical = 1;
    // }else{
    // }
    uploadData.append('is_geographical', is_geographical.toString());
    uploadData.append('is_package_addon',this.is_package_addon);

    console.log('is_geographical: '+is_geographical);
    console.log('geographical_extension: '+is_geographical);

    var  individual_addons :any = this.formQuoteDetails.value.individual_addons;
    if(this.is_package_addon){ individual_addons = ""; }
    uploadData.append('individual_addons',individual_addons);

    var  addon_package_id :any = this.formQuoteDetails.value.addon_package;
    addon_package_id = parseInt(addon_package_id);
    if(!this.is_package_addon){ addon_package_id = ""; }
    uploadData.append('addon_package_id',addon_package_id);


    // var  geographical_extension :any = this.formQuoteDetails.value.geographical_extension;
        // //if(this.is_package_addon){ geographical_extension = ""; }
        // uploadData.append('geographical_extension',geographical_extension);





    return uploadData;

  }


  submitFormQuoteDetails(){
    this.submittedQuoteDetails = true;
    if(this.formQuoteDetails.invalid){
     this.findInvalidControls();
      Swal.fire ("Please fill all mandatory fields",  "" ,  "error" );
     return;
    }

    this.loaderActive = true;
    var uploadData : any = this.setParameterForSubmitForm();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    if(foundStandAlone && this.formQuoteDetails.value.previous_policy=='false'){
      Swal.fire ("Previous policy details required for SAOD.",  "" ,  "error" );
      this.loaderActive = false;
      return;
    }

    this.commonService.submitAllFormQuoteDetails(0,uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){
          sessionStorage.setItem('unique_ref_no', outputResult.unique_ref_no);
          sessionStorage.setItem('active_ic_for_quote', outputResult.active_ic_for_quote);
          sessionStorage.setItem('product_type_id', this.selected_product_type_id);
            if(this.url_reg_no != undefined && this.url_reg_no!=null){
              this.router.navigate(['/'+this.quote_form_share_navigate_url+outputResult.unique_ref_no]);
            }else{
              this.router.navigate(['/'+this.quote_form_navigate_url]);
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


  //------------------------------------------------------------------------------------------------------------

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
          //alert(this.gst_state_code_check_for_individual);
          this.formQuoteDetails.patchValue({
            owner_pincode_id : result.state_city.pincode_id,
            owner_city_id : result.state_city.city_id,
            owner_state_id : result.state_city.state_id,
            owner_city : result.state_city.cityname,
            owner_state   : result.state_city.statename
          });

          var owner_gst :any = this.formQuoteDetails.value.owner_gst;
          if(owner_gst){
            this.validationGST(owner_gst,'owner_gst');
          }

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
nomineeRelationType(type,val){
    if(val.target.value==1){
      var ids=this.relations_id_data.id_1;
    }else if(val.target.value==2){
      var ids=this.relations_id_data.id_2;
    }else{
      var ids=this.relations_id_data.id_3;
    }
    if(val.target.value && ids != undefined){
      if(type=='nominee_salutation'){
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
  validationGST(value,field_name){
    console.log('validationGST');
    switch (field_name) {
      case 'owner_gst':
        console.log('owner_gst');
          let gst_no : any = value;
          let length_gst : any = value.length;
          let pan_no : any = this.formQuoteDetails.value.owner_pan;
          let length_pan_no : any = pan_no.length;
          console.log('gst length '+length_gst);
          console.log('pan length '+length_pan_no);
          if(length_gst > 14 && length_pan_no > 1){
            console.log("owner gst valid or not:- "+gst_no.includes(pan_no));
            let is_valid_gst_no =  gst_no.includes(pan_no)
            if(!is_valid_gst_no){
              this.formQuoteDetails.controls['owner_gst'].setErrors({'panNotMatchForOwner': true});
            }
            // if(this.gst_state_code_check_for_individual != value.substring(0, 2)){
            //   this.formQuoteDetails.controls['owner_gst'].setErrors({'pattern': true});
            // }
          }


        break;

      case 'company_gst_no':
        //  var length_company_gst : number = value.length;
        //   if(length_company_gst > 1){
        //     console.log('innnn');
        //     console.log(this.gst_state_code_check_for_corporate);
        //     console.log(value.substring(0, 2));
        //      console.log(this.formQuoteDetails.controls['company_gst_no']);
        //     if(this.gst_state_code_check_for_corporate != value.substring(0, 2)){
        //       console.log(value);
        //      this.formQuoteDetails.controls['company_gst_no'].setErrors({'pattern': true});
        //     }else{
        //       console.log('validation remove');
        //       this.formQuoteDetails.controls['company_gst_no'].setErrors({'pattern': false});
        //        this.formQuoteDetails.controls['company_gst_no'].setErrors({'pattern': false});
        //       console.log(this.formQuoteDetails.controls['company_gst_no']);
        //     }
        //   }
        break;

        //console.log(this.formQuoteDetails.controls);
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
          //alert(this.gst_state_code_check_for_corporate);
          this.formQuoteDetails.patchValue({
            company_owner_pincode_id : result.state_city.pincode_id,
            company_owner_city_id : result.state_city.city_id,
            company_owner_state_id : result.state_city.state_id,
            company_owner_city : result.state_city.cityname,
            company_owner_state   : result.state_city.statename
          });

          var company_gst_no :any = this.formQuoteDetails.value.company_gst_no;
          if(company_gst_no){
            this.validationGST(company_gst_no,'company_gst_no');
          }
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

  nomineeAge(event,from_data,proposer_type_data){
    var event_new : any  =  parseInt(event);
    if(proposer_type_data == 1){
      if(event_new < 18 ){
        this.div_show_for_appointee = false;
        this.setAppointValiation();
      }else{
        this.div_show_for_appointee = true;
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

    this.formQuoteDetails.get("appointee_age").setValidators([this.customvalidationService.appointeeAgeValidator(),Validators.required,Validators.pattern(this.validation_for_age)]);
    this.formQuoteDetails.get("appointee_age").updateValueAndValidity();

    this.formQuoteDetails.get("appointee_relation").setValidators([Validators.required]);
    this.formQuoteDetails.get("appointee_relation").updateValueAndValidity();

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

    this.formQuoteDetails.patchValue({
      appointee_salutation : '',
      appointee_first_name : '',
      appointee_middle_name : '',
      appointee_last_name : '',
      appointee_age : '',
      appointee_relation : ''
    });

  }

  selectPaCovers(event){
    this.div_show_pa_cover_box  = !event;
    if(!event){
      this.div_show_pa_unnamed_sum_insured_box = true;
      this.resetPaCover();
    }
  }

  resetPaCover(){
    this.formQuoteDetails.patchValue({
      pa_unnamed_persons : '',
      pa_sum_insured : '',
      is_ll_cun_cle_coo : '',
      is_ll_terms : ''

    });
    this.formQuoteDetails.get("pa_sum_insured").setValidators([]);
    this.formQuoteDetails.get("pa_sum_insured").updateValueAndValidity();
  }


  //----------------------------------------------



  selectUnnamedPerson(event){
    this.div_show_pa_unnamed_sum_insured_box  = !event;
    if(!event){
      this.formQuoteDetails.patchValue({  pa_sum_insured : ''   });
    }

    if(event){
      this.formQuoteDetails.get("pa_sum_insured").setValidators([Validators.required]);
      this.formQuoteDetails.get("pa_sum_insured").updateValueAndValidity();
    }else{

      this.formQuoteDetails.get("pa_sum_insured").setValidators([]);
      this.formQuoteDetails.get("pa_sum_insured").updateValueAndValidity();
    }
  }




  selectAccessories(event){
    this.div_show_accessories_box  = !event;
    if(!event){
      this.resetAccessories();
    }
    if(event){
      this.formQuoteDetails.get("accessories_electrical").setValidators([Validators.min(1),Validators.pattern(this.validation_for_electriacal)]);
      this.formQuoteDetails.get("accessories_electrical").updateValueAndValidity();

      this.formQuoteDetails.get("accessories_non_electrical").setValidators([Validators.min(1),Validators.pattern(this.validation_for_electriacal)]);
      this.formQuoteDetails.get("accessories_non_electrical").updateValueAndValidity();

    }else{
      this.formQuoteDetails.get("accessories_electrical").setValidators([Validators.min(1),Validators.pattern(this.validation_for_electriacal)]);
      this.formQuoteDetails.get("accessories_electrical").updateValueAndValidity();

      this.formQuoteDetails.get("accessories_non_electrical").setValidators([Validators.min(1),Validators.pattern(this.validation_for_electriacal)]);
      this.formQuoteDetails.get("accessories_non_electrical").updateValueAndValidity();
    }

    // accessories_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],
    // accessories_non_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],
  }

  resetAccessories(){
    this.formQuoteDetails.patchValue({
      accessories_electrical : '',
      accessories_non_electrical : ''
    });
  }

  selectDeductibles(event){
    this.div_show_deductibles_box  = !event;
    console.log('event:'+event);
    if(!event){
      this.div_show_automobile_association_box  = true;
      this.resetDeductibles();
    }
  }

  resetDeductibles(){
    console.log('resetDeductibles done');
    this.date_picker_aa_membership_expiry_date =  this.setNullDate;
    this.formQuoteDetails.patchValue({
      deductibles_actitheft : '',
      deductibles_automobile_association : '',
      aa_membership_name : '',
      aa_membership_no : ''  ,
      aa_membership_expiry_date : ''
    });
    this.formQuoteDetails.get("aa_membership_name").setValidators([]);
    this.formQuoteDetails.get("aa_membership_name").updateValueAndValidity();

    this.formQuoteDetails.get("aa_membership_no").setValidators([]);
    this.formQuoteDetails.get("aa_membership_no").updateValueAndValidity();

    this.formQuoteDetails.get("aa_membership_expiry_date").setValidators([]);
    this.formQuoteDetails.get("aa_membership_expiry_date").updateValueAndValidity();

  }



  selectImt(event){
    this.div_show_for_imt_box  = !event;
    if(!event){
      this.resetImt();
    }

  }

  resetImt(){
    this.formQuoteDetails.patchValue({
      imt_23 : '',
      imt_34 : ''
    });
  }



  // selectAutomobileAssociation(event){
  //   this.div_show_automobile_association_box  = !event;
  //   if(!event){
  //     this.resetAutomobileAssociation();
  //   }
  // }

  selectAutomobileAssociation(event){


    this.resetAutomobileAssociation();
    this.div_show_automobile_association_box  = !event;
    if(event){
      this.formQuoteDetails.get("aa_membership_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space)]);
      this.formQuoteDetails.get("aa_membership_name").updateValueAndValidity();

      this.formQuoteDetails.get("aa_membership_no").setValidators([Validators.required,Validators.min(1),Validators.pattern(this.validation_for_aa_membership_no)]);
      this.formQuoteDetails.get("aa_membership_no").updateValueAndValidity();

      this.formQuoteDetails.get("aa_membership_expiry_date").setValidators([Validators.required]);
      this.formQuoteDetails.get("aa_membership_expiry_date").updateValueAndValidity();

    }else{
      this.formQuoteDetails.get("aa_membership_name").setValidators([]);
      this.formQuoteDetails.get("aa_membership_name").updateValueAndValidity();

      this.formQuoteDetails.get("aa_membership_no").setValidators([]);
      this.formQuoteDetails.get("aa_membership_no").updateValueAndValidity();

      this.formQuoteDetails.get("aa_membership_expiry_date").setValidators([]);
      this.formQuoteDetails.get("aa_membership_expiry_date").updateValueAndValidity();
    }
  }

  resetAutomobileAssociation(){
    this.date_picker_aa_membership_expiry_date =  this.setNullDate;
    this.formQuoteDetails.patchValue({
      aa_membership_name : '',
      aa_membership_no : '',
      aa_membership_expiry_date : ''
    });
    this.formQuoteDetails.get("aa_membership_name").setValidators([]);
    this.formQuoteDetails.get("aa_membership_name").updateValueAndValidity();

    this.formQuoteDetails.get("aa_membership_no").setValidators([]);
    this.formQuoteDetails.get("aa_membership_no").updateValueAndValidity();

    this.formQuoteDetails.get("aa_membership_expiry_date").setValidators([]);
    this.formQuoteDetails.get("aa_membership_expiry_date").updateValueAndValidity();

  }

  checkLLConductor(event){
    this.div_show_ll_con_cle_col_terms = true;
  }

  selectNoneGeographical(is_geographical_select){
    console.log('is_geographical_select: '+ is_geographical_select);
    this.formQuoteDetails.patchValue({
      none_geographical_extension : !is_geographical_select
    });
    if(is_geographical_select){
      this.disable_geographical_extension = false;
    }else{
      this.disable_geographical_extension = true;
      this.resetGeographicalExtension();

    }
  }



  resetGeographicalExtension(){
    this.result_geographical_extension.forEach( (value, key) => {
      this.result_geographical_extension[key]['checked'] = false;
    });

    let checkArray: FormArray = this.formQuoteDetails.get('geographical_extension') as FormArray;
    checkArray.clear();
    console.log("geographical_extension avinash : "+ this.formQuoteDetails.value.geographical_extension);

  }

  getGeographicalExtension(e,row) {
   // this.is_package_addon = false;
    const checkArray: FormArray = this.formQuoteDetails.get('geographical_extension') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(row.id));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == row.id) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
 }


 selectAddonPackage(row,i){
  this.is_package_addon = true;
  this.disable_individual_addons = true;
  this.unCheckedIndividualAddons();
}

unCheckedIndividualAddons(){
  this.result_individual_addons.forEach( (value, key) => {
    this.result_individual_addons[key]['checked'] = false;
  });
}

selectNoneAddonPackage(){
  //this.is_package_addon = true;
  this.disable_individual_addons = false;
 // let checkArray: FormArray = this.formQuoteDetails.get('individual_addons') as FormArray;
//  checkArray.clear();
}

getAddons(e,row) {

   this.is_package_addon = false;
   const checkArray: FormArray = this.formQuoteDetails.get('individual_addons') as FormArray;

   if (e.target.checked) {
     checkArray.push(new FormControl(row.addon_id));
   } else {
     let i: number = 0;
     checkArray.controls.forEach((item: FormControl) => {
       if (item.value == row.addon_id) {
         checkArray.removeAt(i);
         return;
       }
       i++;
     });
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


setIndividualAddons(is_package_addon){
  if(is_package_addon == 0){
    this.is_package_addon = false;
    this.disable_individual_addons = false;
    let checkArray = <FormArray>this.formQuoteDetails.controls.individual_addons;
    this.result_individual_addons.forEach(row => {
      if(row.checked){
        checkArray.push(new FormControl(row.addon_id));
      }
    });
  }else{
    this.is_package_addon = true;
    this.disable_individual_addons = false;
    this.formQuoteDetails.patchValue({
      addon_package : '0'
    });
    console.log(this.formQuoteDetails.controls.addon_package);
  }
}

setGeographicalExtension(is_geographical){
  if(is_geographical == 1){
    this.disable_geographical_extension = false;
    let checkArray = <FormArray>this.formQuoteDetails.controls.geographical_extension;
    this.result_geographical_extension.forEach(row => {
     // alert(row.checked);
      if(row.checked){
       //alert(row.id);
        checkArray.push(new FormControl(row.id));
      }
    });
  }else{
    this.disable_geographical_extension = true;
    this.resetGeographicalExtension();
  }

}

hideFullQuote(event){
  this.isFullQuote = event.target.checked;
  this.formQuoteDetails.patchValue({
    is_quick_quote : this.isFullQuote
  });
  //this.validationForQuickQuote();

}







}

