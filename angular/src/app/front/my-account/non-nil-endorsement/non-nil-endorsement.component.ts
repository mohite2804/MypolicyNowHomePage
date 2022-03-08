import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";

import { CustomvalidationService } from '../../services/customvalidation.service';
import {NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from  '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-endorsement',
  templateUrl: './non-nil-endorsement.component.html',
  styleUrls: ['./non-nil-endorsement.component.css']
})
export class NonNilendorsementComponent implements OnInit {
  [x: string]: any;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  loaderActive : any;

  UploadValue: boolean = false;
  fileChangeFunCalled: boolean = false;

  date_picker_dob: NgbDateStruct;


  validation_for_cng :any = "^[1-9]{1}[0-9]{2,4}$";



  div_show_endorsement_new : boolean = false;
  div_show_endorsement_status : boolean = true;
  div_show_endorsement_referback : boolean = true;

  acceptedExtensions = "jpg, jpeg, pdf";

  validation_for_reg_1 :any = "^[a-zA-Z]{1,3}$";
  validation_for_reg_2 :any = "^[0-9]{1,4}$";

  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_character :any = "^[a-zA-Z]+$";
  validation_for_address :any = "^[a-zA-Z0-9 \,\-\/]*$";



  validation_for_number_only :any = "^[0-9]*$";
  //validation_for_engine_no :any = "^([a-zA-Z0-9]){5,22}$";
  validation_for_engine_no :any = "^(?!0{5,22})([a-zA-Z0-9]){5,22}$";

  //validation_for_chassis_no :any = "^([a-zA-Z0-9]){17}$";
  validation_for_chassis_no :any = "^(?!0{17})([a-zA-Z0-9]){17}$";

  validation_for_policy_no :any = "^[a-zA-Z0-9\/]+$";
  validation_for_electriacal :any = "^[0-9]{3,6}$";
  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_pincode :any =  "^[0-9]{6}$";
  //validation_for_name_with_space :any = "^[a-zA-Z_ ]*$";
 // validation_for_character :any = "^[a-zA-Z\'\-]+$";
  //validation_for_email :any = "^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$";
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  //validation_for_address :any = "^[a-zA-Z0-9_ ]*$";
  validation_for_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_aadhar_card :any = "^[0-9]{12}$";
  validation_for_age :any = "^[0-9]{1,2}$";
  validation_for_company_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_company_gst_no :any = "^[a-zA-Z0-9]+$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //IDV Start
  formeditIdv: FormGroup;
  submittedIdvDetails: boolean = false;
  idv_invoicecopyurl:any;
  idv_invoicecopylabel:any;
  idv_customerletterurl:any;
  idv_customerletterlabel:any;
  idv_deler_letter_copyurl:any;
  idv_dealer_letter_copylabel:any;
  idv_letter_from_new_financier_copyurl:any;
  idv_letter_from_new_financier_copylabel:any;

  idv_validation : boolean = false;

  idv_invoicecopyurl_label
  idv_customerletterurl_label
  idv_dealer_letter_copyurl_label
  idv_letter_from_new_financier_copyurl_label

  idv : any;
  min_invoice_price : any;
  max_invoice_price : any;

  idv_net_premium : any;
  idv_gst : any;
  idv_final_premium : any;

  show_idv_rc_copy : boolean = false;
  show_idv_customer_letter_copy : boolean = false;
  show_idv_noc_prev_financier_copy : boolean = false;
  show_idv_letter_from_new_financier_copy : boolean = false;

  isRefundBifuel : boolean = false;
  isRefundBifuelFormValue : any = 0;

  isRefundIdv : boolean = false;
  isRefundIdvFormValue : any = 0;

  allowed_idv :any;
  //IDV End

  //NCB Start
  formeditNcb: FormGroup;
  submittedNcbDetails: boolean = false;
  ncb_prev_policy_copyurl:any;
  ncb_prev_policycopylabel:any;
  ncb_customerletterurl:any;
  ncb_customerletterlabel:any;
  ncb_leeter_copyurl:any;
  ncb_letter_copylabel:any;
  vehicle_inspection_photo_copyurl:any;
  vehicle_inspection_photo_copylabel:any;

  ncb_validation : boolean = false;

  ncb_prev_policy_copyurl_label
  ncb_customerletterurl_label
  ncb_letter_copyurl_label
  vehicle_ispection_photo_copyurl_label

  is_ncb : any;
  ncb : any;
  prev_policy_ncb_per : any;

  ncb_net_premium : any;
  ncb_gst : any;
  ncb_final_premium : any;

  show_ncb_rc_copy : boolean = false;
  show_ncb_customer_letter_copy : boolean = false;
  show_ncb_noc_prev_financier_copy : boolean = false;
  show_ncb_letter_from_new_financier_copy : boolean = false;

  isRefundNCB : boolean = false;
  isRefundNCBFormValue : any = 0;
  //NCB End

  //RTO Start
  formeditRto: FormGroup;
  submittedRtoDetails: boolean = false;
  rto_rccopyurl:any;
  rto_rccopylabel:any;
  rto_customerletterurl:any;
  rto_customerletterlabel:any;
  rto_noc_prev_financier_copyurl:any;
  rto_noc_prev_financier_copylabel:any;
  rto_letter_from_new_financier_copyurl:any;
  rto_letter_from_new_financier_copylabel:any;

  rto_validation : boolean = false;

  rto_rccopyurl_label
  rto_customerletterurl_label
  rto_noc_prev_financier_copyurl_label
  rto_letter_from_new_financier_copyurl_label

  rto : any;

  rto_net_premium : any;
  rto_gst : any;
  rto_final_premium : any;

  show_rto_rc_copy : boolean = false;
  show_rto_customer_letter_copy : boolean = false;
  show_rto_noc_prev_financier_copy : boolean = false;
  show_rto_letter_from_new_financier_copy : boolean = false;

  isRefundRto : boolean = false;
  isRefundRtoFormValue : any = 0;
  //RTO End

  //ELECTRICAL ACCESSORIES Start
  formeditElectricalAccessories: FormGroup;
  submittedElectricalAccessoriesDetails: boolean = false;
  electrical_accessories_invoicecopyurl:any;
  electrical_accessories_invoicecopylabel:any;
  electrical_accessories_customerletterurl:any;
  electrical_accessories_customerletterlabel:any;
  electrical_accessories_noc_prev_financier_copyurl:any;
  electrical_accessories_noc_prev_financier_copylabel:any;
  electrical_accessories_letter_from_new_financier_copyurl:any;
  electrical_accessories_letter_from_new_financier_copylabel:any;

  electrical_accessories_validation : boolean = false;

  electrical_accessories_invoicecopyurl_label
  electrical_accessories_customerletterurl_label
  electrical_accessories_noc_prev_financier_copyurl_label
  electrical_accessories_letter_from_new_financier_copyurl_label

  electrical_accessories : any;

  electrical_accessories_net_premium : any;
  electrical_accessories_gst : any;
  electrical_accessories_final_premium : any;

  show_electrical_accessories_rc_copy : boolean = false;
  show_electrical_accessories_customer_letter_copy : boolean = false;
  show_electrical_accessories_noc_prev_financier_copy : boolean = false;
  show_electrical_accessories_letter_from_new_financier_copy : boolean = false;

  isRefundElectricalAccessories : boolean = false;
  isRefundElectricalAccessoriesFormValue : any = 0;
  //ELECTRICAL ACCESSORIES End

  //NON ELECTRICAL ACCESSORIES Start
  formeditNonElectricalAccessories: FormGroup;
  submittedNonElectricalAccessoriesDetails: boolean = false;
  non_electrical_accessories_invoicecopyurl:any;
  non_electrical_accessories_invoicecopylabel:any;
  non_electrical_accessories_customerletterurl:any;
  non_electrical_accessories_customerletterlabel:any;
  non_electrical_accessories_noc_prev_financier_copyurl:any;
  non_electrical_accessories_noc_prev_financier_copylabel:any;
  non_electrical_accessories_letter_from_new_financier_copyurl:any;
  non_electrical_accessories_letter_from_new_financier_copylabel:any;

  non_electrical_accessories_validation : boolean = false;

  non_electrical_accessories_invoicecopyurl_label
  non_electrical_accessories_customerletterurl_label
  non_electrical_accessories_noc_prev_financier_copyurl_label
  non_electrical_accessories_letter_from_new_financier_copyurl_label

  non_electrical_accessories : any;

  non_electrical_accessories_net_premium : any;
  non_electrical_accessories_gst : any;
  non_electrical_accessories_final_premium : any;

  show_non_electrical_accessories_rc_copy : boolean = false;
  show_non_electrical_accessories_customer_letter_copy : boolean = false;
  show_non_electrical_accessories_noc_prev_financier_copy : boolean = false;
  show_non_electrical_accessories_letter_from_new_financier_copy : boolean = false;

  isRefundNonElectricalAccessories : boolean = false;
  isRefundNonElectricalAccessoriesFormValue : any = 0;
  //NON ELECTRICAL ACCESSORIES End

  //PA UNNAMED PERSONS Start
  formeditPaUnnamedPersons: FormGroup;
  submittedPaUnnamedPersonsDetails: boolean = false;
  pa_unnamed_persons_rccopyurl:any;
  pa_unnamed_persons_rccopylabel:any;
  pa_unnamed_persons_customerletterurl:any;
  pa_unnamed_persons_customerletterlabel:any;
  pa_unnamed_persons_noc_prev_financier_copyurl:any;
  pa_unnamed_persons_noc_prev_financier_copylabel:any;
  pa_unnamed_persons_letter_from_new_financier_copyurl:any;
  pa_unnamed_persons_letter_from_new_financier_copylabel:any;

  pa_unnamed_persons_validation : boolean = false;

  pa_unnamed_persons_rccopyurl_label
  pa_unnamed_persons_customerletterurl_label
  pa_unnamed_persons_noc_prev_financier_copyurl_label
  pa_unnamed_persons_letter_from_new_financier_copyurl_label

  pa_unnamed_persons : any;
  pa_suminsured_per_unnamed_person : any;
  seating_capacity : any;

  pa_unnamed_persons_net_premium : any;
  pa_unnamed_persons_gst : any;
  pa_unnamed_persons_final_premium : any;

  show_pa_unnamed_persons_rc_copy : boolean = false;
  show_pa_unnamed_persons_customer_letter_copy : boolean = false;
  show_pa_unnamed_persons_noc_prev_financier_copy : boolean = false;
  show_pa_unnamed_persons_letter_from_new_financier_copy : boolean = false;

  isRefundPaUnnamedPersons : boolean = false;
  isRefundPaUnnamedPersonsFormValue : any = 0;
  //PA UNNAMED PERSONS End

  //ll PAID DRIVERS Start
  formeditLlPaidDrivers: FormGroup;
  submittedLlPaidDriversDetails: boolean = false;
  ll_paid_drivers_rccopyurl:any;
  ll_paid_drivers_rccopylabel:any;
  ll_paid_drivers_customerletterurl:any;
  ll_paid_drivers_customerletterlabel:any;
  ll_paid_drivers_noc_prev_financier_copyurl:any;
  ll_paid_drivers_noc_prev_financier_copylabel:any;
  ll_paid_drivers_letter_from_new_financier_copyurl:any;
  ll_paid_drivers_letter_from_new_financier_copylabel:any;

  ll_paid_drivers_validation : boolean = false;

  ll_paid_drivers_rccopyurl_label
  ll_paid_drivers_customerletterurl_label
  ll_paid_drivers_noc_prev_financier_copyurl_label
  ll_paid_drivers_letter_from_new_financier_copyurl_label

  ll_paid_drivers : any;
  ll_paid_drivers_label : any;
  is_ll_paid_driver : any;

  ll_paid_drivers_net_premium : any;
  ll_paid_drivers_gst : any;
  ll_paid_drivers_final_premium : any;

  show_ll_paid_drivers_rc_copy : boolean = false;
  show_ll_paid_drivers_customer_letter_copy : boolean = false;
  show_ll_paid_drivers_noc_prev_financier_copy : boolean = false;
  show_ll_paid_drivers_letter_from_new_financier_copy : boolean = false;

  isRefundLlPaidDriver : boolean = false;
  isRefundLlPaidDriverFormValue : any = 0;
  //LL PAID DRIVERS End

  //GEO EXTENSION Start
  formeditGeoExtension: FormGroup;
  submittedGeoExtensionDetails: boolean = false;
  geo_extension_invoicecopyurl:any;
  geo_extension_invoicecopylabel:any;
  geo_extension_customerletterurl:any;
  geo_extension_customerletterlabel:any;
  geo_extension_noc_prev_financier_copyurl:any;
  geo_extension_noc_prev_financier_copylabel:any;
  geo_extension_letter_from_new_financier_copyurl:any;
  geo_extension_letter_from_new_financier_copylabel:any;

  geo_extension_validation : boolean = false;

  geo_extension_invoicecopyurl_label
  geo_extension_customerletterurl_label
  geo_extension_noc_prev_financier_copyurl_label
  geo_extension_letter_from_new_financier_copyurl_label

  is_geographical_extension_bangladesh : any;
  is_geographical_extension_bhutan : any;
  is_geographical_extension_maldives : any;
  is_geographical_extension_nepal : any;
  is_geographical_extension_pakistan : any;
  is_geographical_extension_srilanka : any;

  geo_extension_net_premium : any;
  geo_extension_gst : any;
  geo_extension_final_premium : any;

  show_geo_extension_rc_copy : boolean = false;
  show_geo_extension_customer_letter_copy : boolean = false;
  show_geo_extension_noc_prev_financier_copy : boolean = false;
  show_geo_extension_letter_from_new_financier_copy : boolean = false;

  isRefundGeoExtension : boolean = false;
  isRefundGeoExtensionFormValue : any = 0;
  //NON ELECTRICAL ACCESSORIES End

  total_od : any;
  addons_amt : any;

  result : any;
  policy_no : any;
  policy_endorsement_id : any;
  item_id : any;

  salutation :any;
  agreement_types :any;
  rto_master :any;
  vehicle_color :any;
  bank_master :any;
  relations :any;
  endorsement_item : any;
  result_previous_ncb : any;
  result_pa_sum_insured : any;
  result_ll_terms : any;

  //minDate = undefined;

  minDate  : NgbDateStruct;
  maxDateForBirthdate : NgbDateStruct;

  activeTab = 'non-nil-endorsement-tab1';


  registration_no_part_3_val : any;
  registration_no_part_4_val : any;

  policy_type_name : any;
  policy_subtype_name : any;

  result_geographical_extension : any;

  disabled_idv_tab: boolean = false;;
  disabled_ncb_tab: boolean = false;;
  disabled_rto_tab: boolean = false;;
  disabled_electrical_tab: boolean = false;;
  disabled_non_electrical_tab: boolean = false;;
  disabled_pa_tab: boolean = false;;
  disabled_ll_tab: boolean = false;;
  disabled_geo_tab: boolean = false;;

  is_endorsment : boolean = false;
  endorsement_data:any;
  public_path:any;
  business_partner_code :any;

  formeditBifuel: FormGroup;

  is_bifuel : any;
  bifuel_net_premium :any = 0;
  bifuel_gst :any = 0;
  bifuel_final_premium :any = 0;


  show_bifuel_customer_request_letter : boolean = false;
  show_bifuel_customer_cancel_cheque_copy : boolean = false;
  show_bifuel_previous_year_policy : boolean = false;
  show_bifuel_inspection_image : boolean = false;

  selected_endorsement_data : any;

  constructor(private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {
     const current = new Date();
      this.minDate = {
        year: current.getFullYear()-18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdate = {
        year: current.getFullYear() - 18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
  }

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');
      this.token = sessionStorage.getItem("user_token");
      this.business_partner_code = sessionStorage.getItem("business_partner_code");
      console.log(this.business_partner_code);

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.validationFormDetails();
      this.policy_no  = sessionStorage.getItem('policy_no');
      this.policy_endorsement_id  = sessionStorage.getItem('policy_endorsement_id');
      this.item_id  = sessionStorage.getItem('item_id');
      this.checkdisplay();
      let uploadData = new FormData();
      uploadData.append('policy_number',this.policy_no);
      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('loginUserType',this.loginUserType);
      uploadData.append('endorsement_id',this.policy_endorsement_id);
      this.loaderActive = true;
      this.commonService.submitEndorsmentFilterDetails(uploadData)
      .subscribe(response => {
          var outputResult : any = response;
          this.loaderActive = false;
          if(outputResult.status){
            this.result = outputResult.result[0];
             this.is_bifuel = outputResult.is_bifuel;
             console.log("is_bifuel :- " + this.is_bifuel);
            this.public_path=outputResult.public_path;
            this.endorsement_data=outputResult.endorsement_data;
            this.salutation = outputResult.salutation;
            this.agreement_types = outputResult.agreement_types;

            this.selected_endorsement_data = outputResult.selected_endorsement_data;


            this.rto_master = outputResult.rto;
            this.vehicle_color = outputResult.vehicle_color;
            this.bank_master = outputResult.bank_master;
            this.relations = outputResult.relations;
            this.endorsement_item = outputResult.endorsement_item_master;
            this.result_previous_ncb = outputResult.previous_ncb;
            this.result_pa_sum_insured = outputResult.pa_sum_insured;
            this.result_ll_terms = outputResult.ll_terms;
            this.result_geographical_extension = outputResult.geographical_extension;
            this.validateEndorsementFiles(this.endorsement_item);
            this.policy_type_name = this.result?.policy_type_name;
            this.policy_subtype_name = this.result?.policy_subtype_name;
            this.total_od = this.result?.total_basic_od;
            this.addons_amt = this.result?.total_addon_premium;

            ///// IDV
            this.idv = this.result.idv;

            this.max_invoice_price = outputResult.result_idv.max_invoice_price;
            this.allowed_idv = outputResult.result_idv.allowed_invoice_price;

            this.formeditIdv.patchValue({
              ed_idv : this.idv,
              idv_net_premium : "0",
              idv_gst : "0",
              idv_final_premium : "0"
            });


            ///// Bifuel
            this.bifuel = this.result.bifuel_kit_idv;
            console.log(this.bifuel);
            this.formeditIdv.patchValue({
              bifuel : this.bifuel,
              bifuel_net_premium : "0",
              bifuel_gst : "0",
              bifuel_final_premium : "0"
            });

            ///// NCB
            this.is_ncb = this.result?.is_ncb;
            console.log("current_ncb_per:-"+this.result.current_ncb_per);
            this.ncb = this.result.current_ncb_per;
            this.prev_policy_ncb_per = this.result?.prev_policy_ncb_per;

            this.formeditNcb.patchValue({
              ed_ncb : (this.result.current_ncb_per) ? this.result.current_ncb_per : "",
              ncb_net_premium : "0",
              ncb_gst : "0",
              ncb_final_premium : "0",
              refund_to : "",
              refund_payee_account_name : "",
              refund_payee_account_no : "",
              refund_payee_bank_ifsc_code : "",
              refund_payee_bank_name : "",
              refund_payee_bank_branch : ""
            });

            ///// RTO
            var regi_1 = this.result.registration_no_part_1;
            this.rto = regi_1.toLowerCase()+"-"+this.result?.registration_no_part_2;

            this.formeditRto.patchValue({
              ed_rto : this.rto,
              rto_net_premium : "0",
              rto_gst : "0",
              rto_final_premium : "0"
            });

            ///// ELECTRICAL ACCESSORIES
            this.electrical_accessories = this.result.electric_acc_idv;

            this.formeditElectricalAccessories.patchValue({
              ed_electrical_accessories : "",
              electrical_accessories_net_premium : "0",
              electrical_accessories_gst : "0",
              electrical_accessories_final_premium : "0"
            });

            ///// NON ELECTRICAL ACCESSORIES
            this.non_electrical_accessories = this.result?.non_electric_acc_idv;

            this.formeditNonElectricalAccessories.patchValue({
              ed_non_electrical_accessories : "",
              non_electrical_accessories_net_premium : "0",
              non_electrical_accessories_gst : "0",
              non_electrical_accessories_final_premium : "0"
            });

            ///// PA UNNAMED PERSONS
            this.pa_unnamed_persons = this.result.pa_unnamed_persons_premium;
            this.pa_suminsured_per_unnamed_person = this.result.pa_suminsured_per_unnamed_person;
            this.seating_capacity = this.result.seating_capacity;

            this.formeditPaUnnamedPersons.patchValue({
              ed_pa_unnamed_persons : this.pa_suminsured_per_unnamed_person,
              pa_unnamed_persons_net_premium : "0",
              pa_unnamed_persons_gst : "0",
              pa_unnamed_persons_final_premium : "0"
            });

            ///// LL PAID DRIVERS
            this.is_ll_paid_driver = this.result.is_ll_paid_driver;
            if(this.is_ll_paid_driver==0 || this.is_ll_paid_driver=='0'){
              this.ll_paid_drivers_label = 'No';
            }
            else{
              this.ll_paid_drivers_label = 'Yes';
            }


            this.formeditLlPaidDrivers.patchValue({
              ed_ll_paid_drivers : this.is_ll_paid_driver,
              ll_paid_drivers_net_premium : "0",
              ll_paid_drivers_gst : "0",
              ll_paid_drivers_final_premium : "0"
            });

            ///////  GEO Extension
            this.is_geographical_extension_bangladesh = this.result?.is_bangladesh_covered;
            this.is_geographical_extension_bhutan = this.result?.is_bhutan_covered;
            this.is_geographical_extension_maldives = this.result?.is_maldives_covered;
            this.is_geographical_extension_nepal = this.result?.is_nepal_covered;
            this.is_geographical_extension_pakistan = this.result?.is_pakistan_covered;
            this.is_geographical_extension_srilanka = this.result?.is_srilanka_covered;

            this.formeditGeoExtension.patchValue({
              ed_geo_extension : [''],
              geo_extension_net_premium : "0",
              geo_extension_gst : "0",
              geo_extension_final_premium : "0"
            });
            //alert(this.is_endorsment);
            if(this.is_endorsment){
              this.setdata();
            }

          }
      });

  }

  setdata(){
    //alert(this.item_id); alert(this.policy_endorsement_id);
    if(this.item_id!='' && this.policy_endorsement_id!=''){

        switch(this.item_id){
          case '23' :
            this.formeditIdv.patchValue({
              bifuel :  this.endorsement_data.bifuel,
              remark_idv :  this.endorsement_data.remark,
              idv_invoicecopy: this.endorsement_data.invoice_copy_path,
              idv_customerletter:this.endorsement_data.customerletter_path,
              idv_dealer_letter_copy:this.endorsement_data.dealer_letter_path
            });

            this.bifuel_invoicecopyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;
            this.bifuel_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;
            this.bifuel_deler_letter_copyurl=this.public_path+'endorsement/dealer_letter/'+this.endorsement_data.dealer_letter_path;
            this.checkEndorsementCharges(this.endorsement_data.bifuel,'bifuel',1);
            break;

          case '15' :
          this.formeditIdv.patchValue({
            ed_idv :  this.endorsement_data.ed_idv,
            remark_idv :  this.endorsement_data.remark,
            idv_invoicecopy: this.endorsement_data.invoice_copy_path,
            idv_customerletter:this.endorsement_data.customerletter_path,
            idv_dealer_letter_copy:this.endorsement_data.dealer_letter_path
          });

          this.idv_invoicecopyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;
          this.idv_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;
          this.idv_deler_letter_copyurl=this.public_path+'endorsement/dealer_letter/'+this.endorsement_data.dealer_letter_path;
          this.checkEndorsementCharges(this.endorsement_data.ed_idv,'idv',1);
          break;
          case '16' :
            this.formeditNcb.patchValue({
              ed_ncb : this.endorsement_data.ed_ncb,
              ncb_net_premium : this.endorsement_data.net_premium,
              ncb_gst : this.endorsement_data.gst,
              ncb_final_premium : this.endorsement_data.final_premium,
              remark_ncb : this.endorsement_data.remark,
              refund_to:this.endorsement_data.refund_to,
              refund_payee_account_name : this.endorsement_data.refund_to,
              refund_payee_account_no : this.endorsement_data.refund_payee_account_no,
              refund_payee_bank_ifsc_code : this.endorsement_data.refund_payee_bank_ifsc_code,
              refund_payee_bank_name : this.endorsement_data.refund_payee_bank_name,
              refund_payee_bank_branch : this.endorsement_data.refund_payee_bank_branch,
              prev_policy_copy: this.endorsement_data.prev_policy_copy_path,
              ncb_customerletter:this.endorsement_data.customerletter_path,
              ncb_letter_copy:this.endorsement_data.ncb_letter_copy_path,
              vehicle_inspection_photo:this.endorsement_data.vehicle_inspection_photo_path,
            });

            this.ncb_prev_policy_copyurl=this.public_path+'endorsement/prev_policy_copy/'+this.endorsement_data.prev_policy_copy_path;
            this.ncb_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;
            this.ncb_leeter_copyurl=this.public_path+'endorsement/ncb_letter_copy/'+this.endorsement_data.ncb_letter_copy_path;
            this.vehicle_inspection_photo_copyurl=this.public_path+'endorsement/vehicle_inspection_photo/'+this.endorsement_data.vehicle_inspection_photo_path;

            this.checkEndorsementCharges(this.endorsement_data.ed_ncb,'ncb',1);

          break;
          case '17' :
            this.formeditRto.patchValue({
              ed_rto : this.endorsement_data.ed_rto,
              rto_net_premium : this.endorsement_data.net_premium,
              rto_gst : this.endorsement_data.gst,
              rto_final_premium : this.endorsement_data.final_premium,
              remark_rto : this.endorsement_data.remark,
              rto_rccopy:this.endorsement_data.rccopy_path,
              rto_customerletter:this.endorsement_data.customerletter_path,
              refund_to:this.endorsement_data.refund_to,
              refund_payee_account_name : this.endorsement_data.refund_to,
              refund_payee_account_no : this.endorsement_data.refund_payee_account_no,
              refund_payee_bank_ifsc_code : this.endorsement_data.refund_payee_bank_ifsc_code,
              refund_payee_bank_name : this.endorsement_data.refund_payee_bank_name,
              refund_payee_bank_branch : this.endorsement_data.refund_payee_bank_branch,
            });

            this.rto_rccopyurl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;
            this.rto_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;
            this.checkEndorsementCharges(this.endorsement_data.ed_rto,'rto',1);
          break;
          case '18' :
            this.formeditElectricalAccessories.patchValue({
              ed_electrical_accessories : this.endorsement_data.ed_electrical_accessories,
              electrical_accessories_net_premium : this.endorsement_data.net_premium,
              electrical_accessories_gst : this.endorsement_data.gst,
              electrical_accessories_final_premium : this.endorsement_data.final_premium,
              electrical_accessories_invoicecopy:this.endorsement_data.invoice_copy_path,
              remark_electrical_accessories:this.endorsement_data.remark,
            });
            this.electrical_accessories_invoicecopyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;
            this.checkEndorsementCharges(this.endorsement_data.ed_electrical_accessories,'electrical_accessories',1);

          break;
          case '19' :
            this.formeditNonElectricalAccessories.patchValue({
              ed_non_electrical_accessories : this.endorsement_data.ed_non_electrical_accessories,
              non_electrical_accessories_net_premium : this.endorsement_data.net_premium,
              non_electrical_accessories_gst : this.endorsement_data.gst,
              non_electrical_accessories_final_premium : this.endorsement_data.final_premium,
              non_electrical_accessories_invoicecopy:this.endorsement_data.invoice_copy_path,
              remark_non_electrical_accessories:this.endorsement_data.remark,
            });
            this.non_electrical_accessories_invoicecopyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;
            this.checkEndorsementCharges(this.endorsement_data.ed_non_electrical_accessories,'non_electrical_accessories',1);
          break;
          case '20' :
            this.formeditPaUnnamedPersons.patchValue({
              ed_pa_unnamed_persons : this.endorsement_data.ed_pa_unnamed_persons,
              pa_unnamed_persons_net_premium : this.endorsement_data.net_premium,
              pa_unnamed_persons_gst : this.endorsement_data.gst,
              pa_unnamed_persons_final_premium : this.endorsement_data.final_premium,
              remark_pa_unnamed_persons:this.endorsement_data.remark,
              pa_unnamed_persons_rccopy:this.endorsement_data.rccopy_path,
              pa_unnamed_persons_customerletter:this.endorsement_data.customerletter_path,
            });

            this.pa_unnamed_persons_rccopyurl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;
            this.pa_unnamed_persons_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.checkEndorsementCharges(this.endorsement_data.ed_pa_unnamed_persons,'pa_unnamed_persons',1);
          break;
          case '21' :
            this.formeditLlPaidDrivers.patchValue({
              ed_ll_paid_drivers : this.endorsement_data.ed_ll_paid_drivers,
              ll_paid_drivers_net_premium :  this.endorsement_data.net_premium,
              ll_paid_drivers_gst :  this.endorsement_data.gst,
              ll_paid_drivers_final_premium :  this.endorsement_data.final_premium,
              remark_ll_paid_drivers:this.endorsement_data.remark,
              ll_paid_drivers_rccopy:this.endorsement_data.rccopy_path,
              ll_paid_drivers_customerletter:this.endorsement_data.customerletter_path,
            });

            this.ll_paid_drivers_rccopyurl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;
            this.ll_paid_drivers_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.checkEndorsementCharges(this.endorsement_data.ed_ll_paid_drivers,'ll_paid_drivers',1);
          break;
          case '22' :
            this.formeditGeoExtension.patchValue({
              ed_geo_extension : this.endorsement_data.edGeo_extension,
              geo_extension_net_premium : this.endorsement_data.net_premium,
              geo_extension_gst : this.endorsement_data.gst,
              geo_extension_final_premium : this.endorsement_data.final_premium,
              remark_geo_extension:this.endorsement_data.remark,

              geo_extension_invoicecopy:this.endorsement_data.invoice_copy_path,
              geo_extension_customerletter:this.endorsement_data.customerletter_path,
            });

            this.geo_extension_invoicecopyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;
            this.geo_extension_customerletterurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            // this.checkEndorsementCharges(this.endorsement_data.ed_geo_extension,'geo_extension',1);

            this.geo_extension_net_premium = this.endorsement_data.net_premium;
            this.geo_extension_gst = this.endorsement_data.gst;
            this.geo_extension_final_premium = this.endorsement_data.final_premium;
          break;
        }
    }
  }

  checkdisplay(){
  //  alert(this.item_id);alert(this.policy_endorsement_id);
    if(this.item_id!='' && this.policy_endorsement_id!=''){

      this.disabled_idv_tab = true;
      this.disabled_ncb_tab=true;
      this.disabled_rto_tab=true;
      this.disabled_electrical_tab=true;
      this.disabled_non_electrical_tab=true;
      this.disabled_pa_tab=true;
      this.disabled_ll_tab=true;
      this.disabled_geo_tab=true;
      this.is_endorsment=true;

        switch(this.item_id){

          case '14' :
            this.activeTab = 'non-nil-endorsement-tab9';
            this.disabled_bifuel_tab = false;
          break;

          case '15' :
            this.activeTab = 'non-nil-endorsement-tab1';
            this.disabled_idv_tab = false;
          break;
          case '16' :
            this.activeTab = 'non-nil-endorsement-tab2';
            this.disabled_ncb_tab = false;
          break;
          case '17' :
            this.activeTab = 'non-nil-endorsement-tab3';
            this.disabled_rto_tab = false;
          break;
          case '18' :
            this.activeTab = 'non-nil-endorsement-tab4';
            this.disabled_electrical_tab = false;
          break;
          case '19' :
            this.activeTab = 'non-nil-endorsement-tab5';
            this.disabled_non_electrical_tab = false;
          break;
          case '20' :
            this.activeTab = 'non-nil-endorsement-tab6';
            this.disabled_pa_tab = false;
          break;
          case '21' :
            this.activeTab = 'non-nil-endorsement-tab7';
            this.disabled_ll_tab = false;
          break;
          case '22' :
            this.activeTab = 'non-nil-endorsement-tab8';
            this.disabled_geo_tab = false;
          break;

        }

    }
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

  validateEndorsementFiles(endorsement_item){
    endorsement_item.forEach( (value, key) => {
      var code = endorsement_item[key]['code'];
      var rc_copy = endorsement_item[key]['rc_copy'];
      var customer_letter = endorsement_item[key]['customer_letter'];
      var noc_prev_financier = endorsement_item[key]['noc_prev_financier'];
      var letter_from_new_financier = endorsement_item[key]['letter_from_new_financier'];

      switch(code){
        case 'bifuel':
          console.log('bifuel check div : ');
          console.log(rc_copy,customer_letter,noc_prev_financier,letter_from_new_financier);


          if(rc_copy==1 || rc_copy=='1'){
            console.log("show_bifuel_customer_request_letter " + this.show_bifuel_customer_request_letter);
            this.show_bifuel_customer_request_letter = true;
            this.formeditBifuel.get("bifuel_customerletter").setValidators([Validators.required]);
            this.formeditBifuel.get("bifuel_customerletter").updateValueAndValidity();
          }
          console.log("customer_letter " + customer_letter);
          if(customer_letter==1 || customer_letter=='1'){
            console.log("show_bifuel_customer_cancel_cheque_copy " + this.show_bifuel_customer_cancel_cheque_copy);
            this.show_bifuel_customer_cancel_cheque_copy = true;
            this.formeditBifuel.get("bifuel_customer_cancel_cheque_copy").setValidators([Validators.required]);
            this.formeditBifuel.get("bifuel_customer_cancel_cheque_copy").updateValueAndValidity();
          }
          console.log("noc_prev_financier " + noc_prev_financier);
          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            console.log("show_bifuel_previous_year_policy " + this.show_bifuel_previous_year_policy);
            this.show_bifuel_previous_year_policy = true;
            this.formeditBifuel.get("bifuel_previous_year_policy").setValidators([Validators.required]);
            this.formeditBifuel.get("bifuel_previous_year_policy").updateValueAndValidity();
          }
          console.log("letter_from_new_financier " + letter_from_new_financier);
          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            console.log("show_bifuel_inspection_image " + this.show_bifuel_inspection_image);
            this.show_bifuel_inspection_image = true;
            this.formeditBifuel.get("bifuel_inspection_image").setValidators([Validators.required]);
            this.formeditBifuel.get("bifuel_inspection_image").updateValueAndValidity();
          }
          console.log('check div : ');
          console.log(this.show_bifuel_customer_request_letter,this.show_bifuel_customer_cancel_cheque_copy,);
          console.log(this.show_bifuel_previous_year_policy,this.show_bifuel_inspection_image,);
        break;


        case 'idv':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_idv_rc_copy = true;
            this.formeditIdv.get("idv_invoicecopy").setValidators([Validators.required]);
            this.formeditIdv.get("idv_invoicecopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_idv_customer_letter_copy = true;
            this.formeditIdv.get("idv_customerletter").setValidators([Validators.required]);
            this.formeditIdv.get("idv_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_idv_noc_prev_financier_copy = true;
            this.formeditIdv.get("idv_dealer_letter_copy").setValidators([Validators.required]);
            this.formeditIdv.get("idv_dealer_letter_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_idv_letter_from_new_financier_copy = true;
            this.formeditIdv.get("idv_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditIdv.get("idv_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'ncb':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_ncb_rc_copy = true;
            this.formeditNcb.get("prev_policy_copy").setValidators([Validators.required]);
            this.formeditNcb.get("prev_policy_copy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_ncb_customer_letter_copy = true;
            this.formeditNcb.get("ncb_customerletter").setValidators([Validators.required]);
            this.formeditNcb.get("ncb_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_ncb_noc_prev_financier_copy = true;
            this.formeditNcb.get("ncb_letter_copy").setValidators([Validators.required]);
            this.formeditNcb.get("ncb_letter_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_ncb_letter_from_new_financier_copy = true;
            this.formeditNcb.get("vehicle_inspection_photo").setValidators([Validators.required]);
            this.formeditNcb.get("vehicle_inspection_photo").updateValueAndValidity();
          }
        break;

        case 'rto':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_rto_rc_copy = true;
            this.formeditRto.get("rto_rccopy").setValidators([Validators.required]);
            this.formeditRto.get("rto_rccopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_rto_customer_letter_copy = true;
            this.formeditRto.get("rto_customerletter").setValidators([Validators.required]);
            this.formeditRto.get("rto_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_rto_noc_prev_financier_copy = true;
            this.formeditRto.get("rto_noc_prev_financier_copy").setValidators([Validators.required]);
            this.formeditRto.get("rto_noc_prev_financier_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_rto_letter_from_new_financier_copy = true;
            this.formeditRto.get("rto_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditRto.get("rto_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'electrical_accessories':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_electrical_accessories_rc_copy = true;
            this.formeditElectricalAccessories.get("electrical_accessories_invoicecopy").setValidators([Validators.required]);
            this.formeditElectricalAccessories.get("electrical_accessories_invoicecopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_electrical_accessories_customer_letter_copy = true;
            this.formeditElectricalAccessories.get("electrical_accessories_customerletter").setValidators([Validators.required]);
            this.formeditElectricalAccessories.get("electrical_accessories_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_electrical_accessories_noc_prev_financier_copy = true;
            this.formeditElectricalAccessories.get("electrical_accessories_noc_prev_financier_copy").setValidators([Validators.required]);
            this.formeditElectricalAccessories.get("electrical_accessories_noc_prev_financier_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_electrical_accessories_letter_from_new_financier_copy = true;
            this.formeditElectricalAccessories.get("electrical_accessories_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditElectricalAccessories.get("electrical_accessories_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'non_electrical_accessories':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_non_electrical_accessories_rc_copy = true;
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_invoicecopy").setValidators([Validators.required]);
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_invoicecopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_non_electrical_accessories_customer_letter_copy = true;
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_customerletter").setValidators([Validators.required]);
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_non_electrical_accessories_noc_prev_financier_copy = true;
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_noc_prev_financier_copy").setValidators([Validators.required]);
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_noc_prev_financier_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_non_electrical_accessories_letter_from_new_financier_copy = true;
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditNonElectricalAccessories.get("non_electrical_accessories_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'pa_unnamed_persons':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_pa_unnamed_persons_rc_copy = true;
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_rccopy").setValidators([Validators.required]);
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_rccopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_pa_unnamed_persons_customer_letter_copy = true;
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_customerletter").setValidators([Validators.required]);
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_pa_unnamed_persons_noc_prev_financier_copy = true;
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_noc_prev_financier_copy").setValidators([Validators.required]);
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_noc_prev_financier_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_pa_unnamed_persons_letter_from_new_financier_copy = true;
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditPaUnnamedPersons.get("pa_unnamed_persons_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'll_paid_drivers':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_ll_paid_drivers_rc_copy = true;
            this.formeditLlPaidDrivers.get("ll_paid_drivers_rccopy").setValidators([Validators.required]);
            this.formeditLlPaidDrivers.get("ll_paid_drivers_rccopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_ll_paid_drivers_customer_letter_copy = true;
            this.formeditLlPaidDrivers.get("ll_paid_drivers_customerletter").setValidators([Validators.required]);
            this.formeditLlPaidDrivers.get("ll_paid_drivers_customerletter").updateValueAndValidity();
          }

          if(noc_prev_financier==1 || noc_prev_financier=='1'){
            this.show_ll_paid_drivers_noc_prev_financier_copy = true;
            this.formeditLlPaidDrivers.get("ll_paid_drivers_noc_prev_financier_copy").setValidators([Validators.required]);
            this.formeditLlPaidDrivers.get("ll_paid_drivers_noc_prev_financier_copy").updateValueAndValidity();
          }

          if(letter_from_new_financier==1 || letter_from_new_financier=='1'){
            this.show_ll_paid_drivers_letter_from_new_financier_copy = true;
            this.formeditLlPaidDrivers.get("ll_paid_drivers_letter_from_new_financier_copy").setValidators([Validators.required]);
            this.formeditLlPaidDrivers.get("ll_paid_drivers_letter_from_new_financier_copy").updateValueAndValidity();
          }
        break;

        case 'geo_extension':
          if(rc_copy==1 || rc_copy=='1'){
            this.show_geo_extension_rc_copy = true;
            this.formeditGeoExtension.get("geo_extension_invoicecopy").setValidators([Validators.required]);
            this.formeditGeoExtension.get("geo_extension_invoicecopy").updateValueAndValidity();
          }

          if(customer_letter==1 || customer_letter=='1'){
            this.show_geo_extension_customer_letter_copy = true;
            this.formeditGeoExtension.get("geo_extension_customerletter").setValidators([Validators.required]);
            this.formeditGeoExtension.get("geo_extension_customerletter").updateValueAndValidity();
          }
        break;
      }
    });
  }


  validationFormDetails(){
    this.formeditBifuel = this.formBuilder.group({
      // bifuel : ['',[Validators.required,Validators.pattern(this.validation_for_number_only)]],
      bifuel : ['',[Validators.required,Validators.pattern(this.validation_for_cng)]],

      bifuel_customerletter : [''],
      bifuel_customer_cancel_cheque_copy : [''],
      bifuel_previous_year_policy : [''],
      bifuel_inspection_image : [''],

      remark_bifuel : ['',[Validators.required,Validators.maxLength(300)]],
      bifuel_net_premium : [''],
      bifuel_gst : [''],
      bifuel_final_premium : [''],
    });

    this.formeditIdv = this.formBuilder.group({
      ed_idv : ['',[Validators.required,Validators.pattern(this.validation_for_number_only)]],
      idv_invoicecopy : [''],
      idv_customerletter : [''],
      idv_dealer_letter_copy : [''],
      idv_letter_from_new_financier_copy : [''],
      remark_idv : ['',[Validators.required,Validators.maxLength(300)]],
      idv_net_premium : [''],
      idv_gst : [''],
      idv_final_premium : [''],
    });

    this.formeditNcb = this.formBuilder.group({
      ed_ncb : ['',[Validators.required]],
      prev_policy_copy : [''],
      ncb_customerletter : [''],
      ncb_letter_copy : [''],
      vehicle_inspection_photo : [''],
      remark_ncb : ['',[Validators.required,Validators.maxLength(300)]],
      ncb_net_premium : [''],
      ncb_gst : [''],
      ncb_final_premium : [''],
      refund_to : [''],
      refund_payee_account_name : [''],
      refund_payee_account_no : [''],
      refund_payee_bank_ifsc_code : [''],
      refund_payee_bank_name : [''],
      refund_payee_bank_branch : [''],
    });

    this.formeditRto = this.formBuilder.group({
      ed_rto : ['',[Validators.required]],
      rto_rccopy : [''],
      rto_customerletter : [''],
      rto_noc_prev_financier_copy : [''],
      rto_letter_from_new_financier_copy : [''],
      remark_rto : ['',[Validators.required,Validators.maxLength(300)]],
      rto_net_premium : [''],
      rto_gst : [''],
      rto_final_premium : [''],
      refund_to : [''],
      refund_payee_account_name : [''],
      refund_payee_account_no : [''],
      refund_payee_bank_ifsc_code : [''],
      refund_payee_bank_name : [''],
      refund_payee_bank_branch : [''],
    });

    this.formeditElectricalAccessories = this.formBuilder.group({
      ed_electrical_accessories : ['',[Validators.required,Validators.pattern(this.validation_for_number_only),Validators.min(100)]],
      electrical_accessories_invoicecopy : [''],
      electrical_accessories_customerletter : [''],
      electrical_accessories_noc_prev_financier_copy : [''],
      electrical_accessories_letter_from_new_financier_copy : [''],
      remark_electrical_accessories : ['',[Validators.required,Validators.maxLength(300)]],
      electrical_accessories_net_premium : [''],
      electrical_accessories_gst : [''],
      electrical_accessories_final_premium : [''],
      refund_to : [''],
      refund_payee_account_name : [''],
      refund_payee_account_no : [''],
      refund_payee_bank_ifsc_code : [''],
      refund_payee_bank_name : [''],
      refund_payee_bank_branch : [''],
    });

    this.formeditNonElectricalAccessories = this.formBuilder.group({
      ed_non_electrical_accessories : ['',[Validators.required,Validators.pattern(this.validation_for_number_only),Validators.min(100)]],
      non_electrical_accessories_invoicecopy : [''],
      non_electrical_accessories_customerletter : [''],
      non_electrical_accessories_noc_prev_financier_copy : [''],
      non_electrical_accessories_letter_from_new_financier_copy : [''],
      remark_non_electrical_accessories : ['',[Validators.required,Validators.maxLength(300)]],
      non_electrical_accessories_net_premium : [''],
      non_electrical_accessories_gst : [''],
      non_electrical_accessories_final_premium : [''],
      refund_to : [''],
      refund_payee_account_name : [''],
      refund_payee_account_no : [''],
      refund_payee_bank_ifsc_code : [''],
      refund_payee_bank_name : [''],
      refund_payee_bank_branch : [''],
    });

    this.formeditPaUnnamedPersons = this.formBuilder.group({
      ed_pa_unnamed_persons : ['',[Validators.required]],
      pa_unnamed_persons_rccopy : [''],
      pa_unnamed_persons_customerletter : [''],
      pa_unnamed_persons_noc_prev_financier_copy : [''],
      pa_unnamed_persons_letter_from_new_financier_copy : [''],
      remark_pa_unnamed_persons : ['',[Validators.required,Validators.maxLength(300)]],
      pa_unnamed_persons_net_premium : [''],
      pa_unnamed_persons_gst : [''],
      pa_unnamed_persons_final_premium : [''],
    });

    this.formeditLlPaidDrivers = this.formBuilder.group({
      ed_ll_paid_drivers : ['',[Validators.required]],
      ll_paid_drivers_rccopy : [''],
      ll_paid_drivers_customerletter : [''],
      ll_paid_drivers_noc_prev_financier_copy : [''],
      ll_paid_drivers_letter_from_new_financier_copy : [''],
      remark_ll_paid_drivers : ['',[Validators.required,Validators.maxLength(300)]],
      ll_paid_drivers_net_premium : [''],
      ll_paid_drivers_gst : [''],
      ll_paid_drivers_final_premium : [''],
    });

    this.formeditGeoExtension = this.formBuilder.group({
      ed_geo_extension : this.formBuilder.array(['',[Validators.required]]),
      geo_extension_invoicecopy : ['',[Validators.required]],
      geo_extension_customerletter : ['',[Validators.required]],
      remark_geo_extension : ['',[Validators.required,Validators.maxLength(300)]],
      geo_extension_net_premium : [''],
      geo_extension_gst : [''],
      geo_extension_final_premium : [''],
    });
  }

  checkEndorsementCharges(event,type,edit=0)
  {
    if(edit !=0 ){
      var val=event;
    }else{
      var val=event.target.value;
    }
    if(val != ""){

      switch(type){
        case 'idv':
          var ed_idv = val;
          var ed_idv_existing = this.idv;

          if(ed_idv<ed_idv_existing || ed_idv>this.max_invoice_price || ed_idv<this.allowed_idv){
            Swal.fire ("Please enter idv from given idv range.",  "" ,  "error" );
            return;
          }
        break;



        case 'electrical_accessories':
          var ed_electrical_accessories = val;
          var ed_electrical_accessories_existing = this.electrical_accessories;

          if(ed_electrical_accessories<100){
            return;
          }
        break;

        case 'non_electrical_accessories':
          var ed_non_electrical_accessories = val;

          if(ed_non_electrical_accessories<100){
            return;
          }
        break;

        case 'pa_unnamed_persons':
          var ed_pa_unnamed_persons = val;
          var ed_pa_unnamed_persons_existing = this.pa_suminsured_per_unnamed_person;
          console.log('ed_pa_unnamed_persons=>'+ed_pa_unnamed_persons);
          console.log('ed_pa_unnamed_persons_existing=>'+ed_pa_unnamed_persons_existing);

          if(ed_pa_unnamed_persons<ed_pa_unnamed_persons_existing){
            Swal.fire ("Please select sum insured greater than current PA Unnamed persons sum insured",  "" ,  "error" );
            return;
          }

          if(ed_pa_unnamed_persons==ed_pa_unnamed_persons_existing){
            Swal.fire ("No change current & new pa unnamed persons sum insured",  "" ,  "error" );
            return;
          }
        break;

        case 'll_paid_drivers':
          var ed_ll_paid_drivers = val;
          var ed_ll_paid_drivers_existing = this.is_ll_paid_driver;

          if(ed_ll_paid_drivers==ed_ll_paid_drivers_existing){
            Swal.fire ("No change current & new ll paid drivers",  "" ,  "error" );
            return;
          }
        break;
      }

      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('value',val);
      sendData.append('type',type);
      sendData.append('policy_no',this.policy_no);
      sendData.append('policy_id',this.result.policy_id);

      this.commonService.checkEndorsementCharges(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result_endorsement_charge : any  = response;
        if(result_endorsement_charge.status){

          switch(type){
            case 'bifuel':
              this.bifuel_net_premium = result_endorsement_charge.net_premium;
              this.bifuel_gst = result_endorsement_charge.gst;
              this.bifuel_final_premium = result_endorsement_charge.final_premium;

              this.formeditBifuel.patchValue({
                bifuel_net_premium : this.bifuel_net_premium,
                bifuel_gst : this.bifuel_gst,
                bifuel_final_premium : this.bifuel_final_premium,
              });

              this.isRefundBifuel = result_endorsement_charge.refund;
              this.isRefundBifuelFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundBifuelFormValue = 1;
              }
            break;

            case 'idv':
              this.idv_net_premium = result_endorsement_charge.net_premium;
              this.idv_gst = result_endorsement_charge.gst;
              this.idv_final_premium = result_endorsement_charge.final_premium;

              this.formeditIdv.patchValue({
                idv_net_premium : this.idv_net_premium,
                idv_gst : this.idv_gst,
                idv_final_premium : this.idv_final_premium,
              });

              this.isRefundIdv = result_endorsement_charge.refund;
              this.isRefundIdvFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundIdvFormValue = 1;
              }
            break;

            case 'ncb':
              this.ncb_net_premium = result_endorsement_charge.net_premium;
              this.ncb_gst = result_endorsement_charge.gst;
              this.ncb_final_premium = result_endorsement_charge.final_premium;

              this.formeditNcb.patchValue({
                ncb_net_premium : this.ncb_net_premium,
                ncb_gst : this.ncb_gst,
                ncb_final_premium : this.ncb_final_premium,
              });

              this.isRefundNCB = result_endorsement_charge.refund;
              this.isRefundNCBFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundNCBFormValue = 1;
              }

              this.reValidateNcbForm(event.target.value);
            break;

            case 'rto':
              this.rto_net_premium = result_endorsement_charge.net_premium;
              this.rto_gst = result_endorsement_charge.gst;
              this.rto_final_premium = result_endorsement_charge.final_premium;

              this.formeditRto.patchValue({
                rto_net_premium : this.rto_net_premium,
                rto_gst : this.rto_gst,
                rto_final_premium : this.rto_final_premium,
              });

              this.isRefundRto = result_endorsement_charge.refund;
              this.isRefundRtoFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundRtoFormValue = 1;
              }

              this.reValidateRtoForm(event.target.value);
            break;

            case 'electrical_accessories':

              this.electrical_accessories_net_premium = result_endorsement_charge.net_premium;
              this.electrical_accessories_gst = result_endorsement_charge.gst;
              this.electrical_accessories_final_premium = result_endorsement_charge.final_premium;

              this.formeditElectricalAccessories.patchValue({
                electrical_accessories_net_premium : this.electrical_accessories_net_premium,
                electrical_accessories_gst : this.electrical_accessories_gst,
                electrical_accessories_final_premium : this.electrical_accessories_final_premium,
              });

              this.isRefundElectricalAccessories = result_endorsement_charge.refund;
              this.isRefundElectricalAccessoriesFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundElectricalAccessoriesFormValue = 1;
              }
            break;

            case 'non_electrical_accessories':
              this.non_electrical_accessories_net_premium = result_endorsement_charge.net_premium;
              this.non_electrical_accessories_gst = result_endorsement_charge.gst;
              this.non_electrical_accessories_final_premium = result_endorsement_charge.final_premium;

              this.formeditNonElectricalAccessories.patchValue({
                non_electrical_accessories_net_premium : this.non_electrical_accessories_net_premium,
                non_electrical_accessories_gst : this.non_electrical_accessories_gst,
                non_electrical_accessories_final_premium : this.non_electrical_accessories_final_premium,
              });

              this.isRefundNonElectricalAccessories = result_endorsement_charge.refund;
             // alert(result_endorsement_charge.refund);
              this.isRefundNonElectricalAccessoriesFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundNonElectricalAccessoriesFormValue = 1;
              }
            break;

            case 'pa_unnamed_persons':
              this.pa_unnamed_persons_net_premium = result_endorsement_charge.net_premium;
              this.pa_unnamed_persons_gst = result_endorsement_charge.gst;
              this.pa_unnamed_persons_final_premium = result_endorsement_charge.final_premium;

              this.formeditPaUnnamedPersons.patchValue({
                pa_unnamed_persons_net_premium : this.pa_unnamed_persons_net_premium,
                pa_unnamed_persons_gst : this.pa_unnamed_persons_gst,
                pa_unnamed_persons_final_premium : this.pa_unnamed_persons_final_premium,
              });

              this.isRefundPaUnnamedPersons = result_endorsement_charge.refund;
              this.isRefundPaUnnamedPersonsFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundPaUnnamedPersonsFormValue = 1;
              }
            break;

            case 'll_paid_drivers':
              this.ll_paid_drivers_net_premium = result_endorsement_charge.net_premium;
              this.ll_paid_drivers_gst = result_endorsement_charge.gst;
              this.ll_paid_drivers_final_premium = result_endorsement_charge.final_premium;

              this.formeditLlPaidDrivers.patchValue({
                ll_paid_drivers_net_premium : this.ll_paid_drivers_net_premium,
                ll_paid_drivers_gst : this.ll_paid_drivers_gst,
                ll_paid_drivers_final_premium : this.ll_paid_drivers_final_premium,
              });

              this.isRefundLlPaidDriver = result_endorsement_charge.refund;
              this.isRefundLlPaidDriverFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundLlPaidDriverFormValue = 1;
              }
            break;

            case 'geo_extension':
              this.geo_extension_net_premium = result_endorsement_charge.net_premium;
              this.geo_extension_gst = result_endorsement_charge.gst;
              this.geo_extension_final_premium = result_endorsement_charge.final_premium;

              this.formeditNonElectricalAccessories.patchValue({
                geo_extension_net_premium : this.geo_extension_net_premium,
                geo_extension_gst : this.geo_extension_gst,
                geo_extension_final_premium : this.geo_extension_final_premium,
              });

              this.isRefundGeoExtension = result_endorsement_charge.refund;
              this.isRefundGeoExtensionFormValue = 0;
              if(result_endorsement_charge.refund===true){
                this.isRefundGeoExtensionFormValue = 1;
              }
          }
        }
        else{
          switch(type){
            case 'bifuel':
              this.bifuel_net_premium = 0;
              this.bifuel_gst = 0;
              this.bifuel_final_premium = 0;
            break;

            case 'idv':
              this.idv_net_premium = 0;
              this.idv_gst = 0;
              this.idv_final_premium = 0;
            break;

            case 'ncb':
              this.ncb_net_premium = 0;
              this.ncb_gst = 0;
              this.ncb_final_premium = 0;

              this.reValidateNcbForm(event.target.value);
            break;

            case 'rto':
              this.rto_net_premium = 0;
              this.rto_gst = 0;
              this.rto_final_premium = 0;

              this.reValidateRtoForm(event.target.value);
            break;

            case 'electrical_accessories':
              this.electrical_accessories_net_premium = 0;
              this.electrical_accessories_gst = 0;
              this.electrical_accessories_final_premium = 0;
            break;

            case 'non_electrical_accessories':
              this.non_electrical_accessories_net_premium = 0;
              this.non_electrical_accessories_gst = 0;
              this.non_electrical_accessories_final_premium = 0;
            break;

            case 'pa_unnamed_persons':
              this.pa_unnamed_persons_net_premium = 0;
              this.pa_unnamed_persons_gst = 0;
              this.pa_unnamed_persons_final_premium = 0;
            break;

            case 'll_paid_drivers':
              this.ll_paid_drivers_net_premium = 0;
              this.ll_paid_drivers_gst = 0;
              this.ll_paid_drivers_final_premium = 0;
            break;

            case 'geo_extension':
              this.geo_extension_net_premium = 0;
              this.geo_extension_gst = 0;
              this.geo_extension_final_premium = 0;
            break;
          }

          Swal.fire (result_endorsement_charge.message,  "" ,  "error" );
        }
      });
    }
  }




   ///////////    START - Bifuel    ///////////
   uploadBifuelCustomerLetter(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.bifuel_customerletterurl = "";
      this.bifuel_customerletterurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.bifuel_customerletterurl = "";
      this.bifuel_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.bifuel_customerletterurl = event.target.result;
      }
      this.bifuel_customerletterurl_label = file.name;
      this.formeditBifuel.patchValue({
        'bifuel_customerletter' : file
      });
    }
    console.log('uploadBifuelCustomerLetter');
    console.log(this.bifuel_customerletterurl_label+' '+this.bifuel_customerletterurl_label);
  }

  uploadBifuelCustomerCancleCheque(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.bifuel_customer_cancel_cheque_copyurl = "";
      this.bifuel_customer_cancel_cheque_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.bifuel_customer_cancel_cheque_copyurl = "";
      this.bifuel_customer_cancel_cheque_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.bifuel_customer_cancel_cheque_copyurl = event.target.result;
      }
      this.bifuel_customer_cancel_cheque_copyurl_label = file.name;
      this.formeditBifuel.patchValue({
        'bifuel_customer_cancel_cheque_copy' : file
      });
    }
  }

  uploadBifuelPreviousYearPolicy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.bifuel_previous_year_policyurl = "";
      this.bifuel_previous_year_policyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.bifuel_previous_year_policyurl = "";
      this.bifuel_previous_year_policyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.bifuel_previous_year_policyurl = event.target.result;
      }
      this.bifuel_previous_year_policyurl_label = file.name;
      this.formeditBifuel.patchValue({
        'bifuel_previous_year_policy' : file
      });
    }
  }

  uploadBifuelInspectionImageurl(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.bifuel_inspection_imageyurl = "";
      this.bifuel_inspection_imageurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.bifuel_inspection_imageyurl = "";
      this.bifuel_inspection_imageurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.bifuel_inspection_imageyurl = event.target.result;
      }
      this.bifuel_inspection_imageurl_label = file.name;
      this.formeditBifuel.patchValue({
        'bifuel_inspection_image' : file
      });
    }
  }

  ///////////    START - IDV    ///////////
  uploadIdvInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.idv_invoicecopyurl = "";
      this.idv_invoicecopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.idv_invoicecopyurl = "";
      this.idv_invoicecopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.idv_invoicecopyurl = event.target.result;
      }
      this.idv_invoicecopyurl_label = file.name;
      this.formeditIdv.patchValue({
        'idv_invoicecopy' : file
      });
    }
  }

  uploadIdvConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.idv_customerletterurl = "";
      this.idv_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.idv_customerletterurl = "";
      this.idv_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.idv_customerletterurl = event.target.result;
      }
      this.idv_customerletterurl_label = file.name;
      this.formeditIdv.patchValue({
        'idv_customerletter' : file
      });
    }
  }

  uploadDealerLettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.idv_deler_letter_copyurl = "";
      this.idv_dealer_letter_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.idv_deler_letter_copyurl = "";
      this.idv_dealer_letter_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.idv_deler_letter_copyurl = event.target.result;
      }
      this.idv_dealer_letter_copyurl_label = file.name;
      this.formeditIdv.patchValue({
        'idv_dealer_letter_copy' : file
      });
    }
  }

  uploadLetterNewFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.idv_letter_from_new_financier_copyurl = "";
      this.idv_letter_from_new_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.idv_letter_from_new_financier_copyurl = "";
      this.idv_letter_from_new_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.idv_letter_from_new_financier_copyurl = event.target.result;
      }
      this.idv_letter_from_new_financier_copyurl_label = file.name;
      this.formeditIdv.patchValue({
        'idv_letter_from_new_financier_copy' : file
      });
    }
  }

  submitFormEditBifuel(){

    this.submittedBifuelDetails = true;
    if(this.formeditBifuel.invalid){
      console.log(this.formeditBifuel);
      return;
    }

    var bifuel = this.formeditBifuel.value.bifuel;
    var bifuel_existing = this.bifuel;

    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(bifuel==bifuel_existing){
        console.log("same bifuel");
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }





    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','29');

    uploadData.append('bifuel',this.formeditBifuel.value.bifuel);
    uploadData.append('bifuel_existing',this.result?.bifuel_kit_idv);

    uploadData.append('net_premium',this.formeditBifuel.value.bifuel_net_premium);
    uploadData.append('gst',this.formeditBifuel.value.bifuel_gst);
    uploadData.append('final_premium',this.formeditBifuel.value.bifuel_final_premium);

    uploadData.append('isRefund',this.isRefundBifuelFormValue);

    uploadData.append('bifuel_customer_cancel_cheque_copy',this.formeditBifuel.value.bifuel_customer_cancel_cheque_copy);
    uploadData.append('bifuel_customerletter',this.formeditBifuel.value.bifuel_customerletter);
    uploadData.append('bifuel_previous_year_policy',this.formeditBifuel.value.bifuel_previous_year_policy);
    uploadData.append('bifuel_inspection_image',this.formeditBifuel.value.bifuel_inspection_image);

    uploadData.append('remark_bifuel',this.formeditBifuel.value.remark_bifuel);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditIdv(){

    this.submittedIdvDetails = true;
    if(this.formeditIdv.invalid){
      return;
    }

    var ed_idv = this.formeditIdv.value.ed_idv;
    var ed_idv_existing = this.idv;

    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(ed_idv==ed_idv_existing){
        console.log("same idv");
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }


    if(ed_idv<ed_idv_existing || ed_idv>this.max_invoice_price || ed_idv<this.allowed_idv){
      Swal.fire ("Please enter idv from given idv range.",  "" ,  "error" );
      return;
    }


    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','15');

    uploadData.append('ed_idv',this.formeditIdv.value.ed_idv);
    uploadData.append('ed_idv_existing',this.result?.idv);

    uploadData.append('net_premium',this.formeditIdv.value.idv_net_premium);
    uploadData.append('gst',this.formeditIdv.value.idv_gst);
    uploadData.append('final_premium',this.formeditIdv.value.idv_final_premium);

    uploadData.append('isRefund',this.isRefundIdvFormValue);

    uploadData.append('invoice_copy',this.formeditIdv.value.idv_invoicecopy);
    uploadData.append('customerletter',this.formeditIdv.value.idv_customerletter);
    uploadData.append('dealer_letter',this.formeditIdv.value.idv_dealer_letter_copy);
    uploadData.append('letter_new_financier',this.formeditIdv.value.idv_letter_from_new_financier_copy);

    uploadData.append('remark_idv',this.formeditIdv.value.remark_idv);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }


  ///////////    END - IDV    ///////////

  ///////////    START - NCB    ///////////

  reValidateNcbForm(value){

    if(this.isRefundNCB==true){
        this.formeditNcb.get("refund_to").setValidators([Validators.required]);
        this.formeditNcb.get("refund_to").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_account_name").setValidators([Validators.required]);
        this.formeditNcb.get("refund_payee_account_name").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_account_no").setValidators([Validators.required]);
        this.formeditNcb.get("refund_payee_account_no").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_ifsc_code").setValidators([Validators.required]);
        this.formeditNcb.get("refund_payee_bank_ifsc_code").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_name").setValidators([Validators.required]);
        this.formeditNcb.get("refund_payee_bank_name").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_branch").setValidators([Validators.required]);
        this.formeditNcb.get("refund_payee_bank_branch").updateValueAndValidity();
    }
    else{
        this.formeditNcb.get("refund_to").setValidators([]);
        this.formeditNcb.get("refund_to").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_account_name").setValidators([]);
        this.formeditNcb.get("refund_payee_account_name").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_account_no").setValidators([]);
        this.formeditNcb.get("refund_payee_account_no").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_ifsc_code").setValidators([]);
        this.formeditNcb.get("refund_payee_bank_ifsc_code").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_name").setValidators([]);
        this.formeditNcb.get("refund_payee_bank_name").updateValueAndValidity();

        this.formeditNcb.get("refund_payee_bank_branch").setValidators([]);
        this.formeditNcb.get("refund_payee_bank_branch").updateValueAndValidity();
    }

  }

  getBankDetails(ifsccode){

    //var is_vallid :any = this.formSameDayCancel.controls.ifsc_code.status;
    //console.log(is_vallid)

    //if(is_vallid != "INVALID" && ifsccode.length == 11 ){
    if(ifsccode.length == 11 ){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('ifsc_code',ifsccode);
      this.commonService.getBankDetails(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.bankDetailsData = response;
        if(this.bankDetailsData.status){
          this.formeditNcb.patchValue({
            refund_payee_bank_branch : this.bankDetailsData.result.branch,
            refund_payee_bank_name :this.bankDetailsData.result.bank
          });
          this.formeditElectricalAccessories.patchValue({
            refund_payee_bank_branch : this.bankDetailsData.result.branch,
            refund_payee_bank_name :this.bankDetailsData.result.bank
          });
          this.formeditNonElectricalAccessories.patchValue({
            refund_payee_bank_branch : this.bankDetailsData.result.branch,
            refund_payee_bank_name :this.bankDetailsData.result.bank
          });

        }else{
          this.formeditNcb.patchValue({
            refund_payee_bank_branch : '',
            refund_payee_bank_name :''

          });
          this.formeditElectricalAccessories.patchValue({
            refund_payee_bank_branch : '',
            refund_payee_bank_name :''

          });
          this.formeditNonElectricalAccessories.patchValue({
            refund_payee_bank_branch : '',
            refund_payee_bank_name :''

          });

          Swal.fire (this.bankDetailsData.message,  "" ,  "error" );
        }

      });

    }
  }




  uploadNcbPrevPolicycopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ncb_prev_policy_copyurl = "";
      this.ncb_prev_policy_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ncb_prev_policy_copyurl = "";
      this.ncb_prev_policy_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ncb_prev_policy_copyurl = event.target.result;
      }
      this.ncb_prev_policy_copyurl_label = file.name;
      this.formeditNcb.patchValue({
        'prev_policy_copy' : file
      });
    }
  }

  uploadNcbConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ncb_customerletterurl = "";
      this.ncb_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ncb_customerletterurl = "";
      this.ncb_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ncb_customerletterurl = event.target.result;
      }
      this.ncb_customerletterurl_label = file.name;
      this.formeditNcb.patchValue({
        'ncb_customerletter' : file
      });
    }
  }

  uploadNcbLettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ncb_leeter_copyurl = "";
      this.ncb_letter_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ncb_leeter_copyurl = "";
      this.ncb_letter_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ncb_leeter_copyurl = event.target.result;
      }
      this.ncb_letter_copyurl_label = file.name;
      this.formeditNcb.patchValue({
        'ncb_letter_copy' : file
      });
    }
  }

  uploadVehicleInspectionPhoto(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.vehicle_inspection_photo_copyurl = "";
      this.vehicle_ispection_photo_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.vehicle_inspection_photo_copyurl = "";
      this.vehicle_ispection_photo_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.vehicle_inspection_photo_copyurl = event.target.result;
      }
      this.vehicle_ispection_photo_copyurl_label = file.name;
      this.formeditNcb.patchValue({
        'vehicle_inspection_photo' : file
      });
    }
  }

  submitFormEditNcb(){
    //console.log("endorsement_status_id:- " + this.selected_endorsement_data.endorsement_status_id);
    this.submittedNcbDetails = true;
    if(this.formeditNcb.invalid){
      return;
    }

    var ed_ncb = this.formeditNcb.value.ed_ncb;
    var ed_ncb_existing = this.ncb;


    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(ed_ncb==ed_ncb_existing){
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }


    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','16');

    uploadData.append('ed_ncb',this.formeditNcb.value.ed_ncb);
    uploadData.append('ed_ncb_existing',this.ncb);

    uploadData.append('net_premium',this.formeditNcb.value.ncb_net_premium);
    uploadData.append('gst',this.formeditNcb.value.ncb_gst);
    uploadData.append('final_premium',this.formeditNcb.value.ncb_final_premium);

    uploadData.append('isRefund',this.isRefundNCBFormValue);

    uploadData.append('prev_policy_copy',this.formeditNcb.value.prev_policy_copy);
    uploadData.append('customerletter',this.formeditNcb.value.ncb_customerletter);
    uploadData.append('ncb_letter_copy',this.formeditNcb.value.ncb_letter_copy);
    uploadData.append('vehicle_inspection_photo',this.formeditNcb.value.vehicle_inspection_photo);

    uploadData.append('remark_ncb',this.formeditNcb.value.remark_ncb);

    uploadData.append('refund_to',this.formeditNcb.value.refund_to);
    uploadData.append('refund_payee_account_name',this.formeditNcb.value.refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formeditNcb.value.refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formeditNcb.value.refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formeditNcb.value.refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formeditNcb.value.refund_payee_bank_branch);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditElectricalAccessories(){

    this.submittedElectricalAccessoriesDetails = true;
    if(this.formeditElectricalAccessories.invalid){
      return;
    }


    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','18');

    uploadData.append('ed_electrical_accessories',this.formeditElectricalAccessories.value.ed_electrical_accessories);
    uploadData.append('ed_electrical_accessories_existing',this.electrical_accessories);

    uploadData.append('net_premium',this.formeditElectricalAccessories.value.electrical_accessories_net_premium);
    uploadData.append('gst',this.formeditElectricalAccessories.value.electrical_accessories_gst);
    uploadData.append('final_premium',this.formeditElectricalAccessories.value.electrical_accessories_final_premium);

    uploadData.append('isRefund',this.isRefundElectricalAccessoriesFormValue);

    uploadData.append('invoice_copy',this.formeditElectricalAccessories.value.electrical_accessories_invoicecopy);
    uploadData.append('customerletter',this.formeditElectricalAccessories.value.electrical_accessories_customerletter);
    uploadData.append('noc_previous_financier',this.formeditElectricalAccessories.value.electrical_accessories_noc_prev_financier_copy);
    uploadData.append('letter_new_financier',this.formeditElectricalAccessories.value.electrical_accessories_letter_from_new_financier_copy);

    uploadData.append('remark_electrical_accessories',this.formeditElectricalAccessories.value.remark_electrical_accessories);


    uploadData.append('refund_to',this.formeditElectricalAccessories.value.refund_to);
    uploadData.append('refund_payee_account_name',this.formeditElectricalAccessories.value.refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formeditElectricalAccessories.value.refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formeditElectricalAccessories.value.refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formeditElectricalAccessories.value.refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formeditElectricalAccessories.value.refund_payee_bank_branch);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditNonElectricalAccessories(){

    this.submittedNonElectricalAccessoriesDetails = true;
    if(this.formeditNonElectricalAccessories.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','19');
    //console.log('inn');

    uploadData.append('ed_non_electrical_accessories',this.formeditNonElectricalAccessories.value.ed_non_electrical_accessories);
    uploadData.append('ed_non_electrical_accessories_existing',this.non_electrical_accessories);

    uploadData.append('net_premium',this.formeditNonElectricalAccessories.value.non_electrical_accessories_net_premium);
    uploadData.append('gst',this.formeditNonElectricalAccessories.value.non_electrical_accessories_gst);
    uploadData.append('final_premium',this.formeditNonElectricalAccessories.value.non_electrical_accessories_final_premium);

    uploadData.append('isRefund',this.isRefundNonElectricalAccessoriesFormValue);

    uploadData.append('invoice_copy',this.formeditNonElectricalAccessories.value.non_electrical_accessories_invoicecopy);
    uploadData.append('customerletter',this.formeditNonElectricalAccessories.value.non_electrical_accessories_customerletter);
    uploadData.append('noc_previous_financier',this.formeditNonElectricalAccessories.value.non_electrical_accessories_noc_prev_financier_copy);
    uploadData.append('letter_new_financier',this.formeditNonElectricalAccessories.value.non_electrical_accessories_letter_from_new_financier_copy);

    uploadData.append('remark_non_electrical_accessories',this.formeditNonElectricalAccessories.value.remark_non_electrical_accessories);

    uploadData.append('refund_to',this.formeditNonElectricalAccessories.value.refund_to);
    uploadData.append('refund_payee_account_name',this.formeditNonElectricalAccessories.value.refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formeditNonElectricalAccessories.value.refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formeditNonElectricalAccessories.value.refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formeditNonElectricalAccessories.value.refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formeditNonElectricalAccessories.value.refund_payee_bank_branch);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  ///////////    END - NCB    ///////////

  ///////////    START - RTO    ///////////

  reValidateRtoForm(value){

    if(this.isRefundRto==true){
        this.formeditRto.get("refund_to").setValidators([Validators.required]);
        this.formeditRto.get("refund_to").updateValueAndValidity();

        this.formeditRto.get("refund_payee_account_name").setValidators([Validators.required]);
        this.formeditRto.get("refund_payee_account_name").updateValueAndValidity();

        this.formeditRto.get("refund_payee_account_no").setValidators([Validators.required]);
        this.formeditRto.get("refund_payee_account_no").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_ifsc_code").setValidators([Validators.required]);
        this.formeditRto.get("refund_payee_bank_ifsc_code").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_name").setValidators([Validators.required]);
        this.formeditRto.get("refund_payee_bank_name").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_branch").setValidators([Validators.required]);
        this.formeditRto.get("refund_payee_bank_branch").updateValueAndValidity();
    }
    else{
        this.formeditRto.get("refund_to").setValidators([]);
        this.formeditRto.get("refund_to").updateValueAndValidity();

        this.formeditRto.get("refund_payee_account_name").setValidators([]);
        this.formeditRto.get("refund_payee_account_name").updateValueAndValidity();

        this.formeditRto.get("refund_payee_account_no").setValidators([]);
        this.formeditRto.get("refund_payee_account_no").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_ifsc_code").setValidators([]);
        this.formeditRto.get("refund_payee_bank_ifsc_code").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_name").setValidators([]);
        this.formeditRto.get("refund_payee_bank_name").updateValueAndValidity();

        this.formeditRto.get("refund_payee_bank_branch").setValidators([]);
        this.formeditRto.get("refund_payee_bank_branch").updateValueAndValidity();
    }

  }

  getBankDetails_rto(ifsccode){

    //var is_vallid :any = this.formSameDayCancel.controls.ifsc_code.status;
    //console.log(is_vallid)

    //if(is_vallid != "INVALID" && ifsccode.length == 11 ){
    if(ifsccode.length == 11 ){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('ifsc_code',ifsccode);
      this.commonService.getBankDetails(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.bankDetailsData = response;
        if(this.bankDetailsData.status){
          this.formeditRto.patchValue({
            refund_payee_bank_branch : this.bankDetailsData.result.branch,
            refund_payee_bank_name :this.bankDetailsData.result.bank
          });

        }else{
          this.formeditRto.patchValue({
            refund_payee_bank_branch : '',
            refund_payee_bank_name :''

          });

          Swal.fire (this.bankDetailsData.message,  "" ,  "error" );
        }

      });

    }
  }

  uploadRtoRCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rto_rccopyurl = "";
      this.rto_rccopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rto_rccopyurl = "";
      this.rto_rccopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rto_rccopyurl = event.target.result;
      }
      this.rto_rccopyurl_label = file.name;
      this.formeditRto.patchValue({
        'rto_rccopy' : file
      });
    }
  }

  uploadRtoConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rto_customerletterurl = "";
      this.rto_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rto_customerletterurl = "";
      this.rto_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rto_customerletterurl = event.target.result;
      }
      this.rto_customerletterurl_label = file.name;
      this.formeditRto.patchValue({
        'rto_customerletter' : file
      });
    }
  }

  uploadRtoNocPrevFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rto_noc_prev_financier_copyurl = "";
      this.rto_noc_prev_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rto_noc_prev_financier_copyurl = "";
      this.rto_noc_prev_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rto_noc_prev_financier_copyurl = event.target.result;
      }
      this.rto_noc_prev_financier_copyurl_label = file.name;
      this.formeditRto.patchValue({
        'rto_noc_prev_financier_copy' : file
      });
    }
  }

  uploadRtoLetterNewFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rto_letter_from_new_financier_copyurl = "";
      this.rto_letter_from_new_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rto_letter_from_new_financier_copyurl = "";
      this.rto_letter_from_new_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rto_letter_from_new_financier_copyurl = event.target.result;
      }
      this.rto_letter_from_new_financier_copyurl_label = file.name;
      this.formeditRto.patchValue({
        'rto_letter_from_new_financier_copy' : file
      });
    }
  }

  submitFormEditRto(){

    this.submittedRtoDetails = true;
    if(this.formeditRto.invalid){
      return;
    }

    var ed_rto = this.formeditRto.value.ed_rto;
    var ed_rto_existing = this.rto;

    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(ed_rto==ed_rto_existing){
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }



    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','17');

    uploadData.append('ed_rto',this.formeditRto.value.ed_rto);
    uploadData.append('ed_rto_existing',this.rto);

    uploadData.append('net_premium',this.formeditRto.value.rto_net_premium);
    uploadData.append('gst',this.formeditRto.value.rto_gst);
    uploadData.append('final_premium',this.formeditRto.value.rto_final_premium);

    uploadData.append('isRefund',this.isRefundRtoFormValue);

    uploadData.append('rccopy',this.formeditRto.value.rto_rccopy);
    uploadData.append('customerletter',this.formeditRto.value.rto_customerletter);
    uploadData.append('noc_previous_financier',this.formeditRto.value.rto_noc_prev_financier_copy);
    uploadData.append('letter_new_financier',this.formeditRto.value.rto_letter_from_new_financier_copy);

    uploadData.append('remark_rto',this.formeditRto.value.remark_rto);

    uploadData.append('refund_to',this.formeditRto.value.refund_to);
    uploadData.append('refund_payee_account_name',this.formeditRto.value.refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formeditRto.value.refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formeditRto.value.refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formeditRto.value.refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formeditRto.value.refund_payee_bank_branch);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  ///////////    END - RTO    ///////////

  ///////////    START - ELECTRICL ACCESSORIES    ///////////
  uploadElectricalAccessoriesInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.electrical_accessories_invoicecopyurl = "";
      this.electrical_accessories_invoicecopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.electrical_accessories_invoicecopyurl = "";
      this.electrical_accessories_invoicecopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.electrical_accessories_invoicecopyurl = event.target.result;
      }
      this.electrical_accessories_invoicecopyurl_label = file.name;
      this.formeditElectricalAccessories.patchValue({
        'electrical_accessories_invoicecopy' : file
      });
    }
  }

  uploadElectricalAccessoriesConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.electrical_accessories_customerletterurl = "";
      this.electrical_accessories_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.electrical_accessories_customerletterurl = "";
      this.electrical_accessories_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.electrical_accessories_customerletterurl = event.target.result;
      }
      this.electrical_accessories_customerletterurl_label = file.name;
      this.formeditElectricalAccessories.patchValue({
        'electrical_accessories_customerletter' : file
      });
    }
  }

  uploadElectricalAccessoriesNocPrevFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.electrical_accessories_noc_prev_financier_copyurl = "";
      this.electrical_accessories_noc_prev_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.electrical_accessories_noc_prev_financier_copyurl = "";
      this.electrical_accessories_noc_prev_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.electrical_accessories_noc_prev_financier_copyurl = event.target.result;
      }
      this.electrical_accessories_noc_prev_financier_copyurl_label = file.name;
      this.formeditElectricalAccessories.patchValue({
        'electrical_accessories_noc_prev_financier_copy' : file
      });
    }
  }

  uploadElectricalAccessoriesLetterNewFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.electrical_accessories_letter_from_new_financier_copyurl = "";
      this.electrical_accessories_letter_from_new_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.electrical_accessories_letter_from_new_financier_copyurl = "";
      this.electrical_accessories_letter_from_new_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.electrical_accessories_letter_from_new_financier_copyurl = event.target.result;
      }
      this.electrical_accessories_letter_from_new_financier_copyurl_label = file.name;
      this.formeditElectricalAccessories.patchValue({
        'electrical_accessories_letter_from_new_financier_copy' : file
      });
    }
  }


  ///////////    END - ELECTRICL ACCESSORIES    ///////////

  ///////////    START - NON ELECTRICL ACCESSORIES    ///////////
  uploadNonElectricalAccessoriesInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.non_electrical_accessories_invoicecopyurl = "";
      this.non_electrical_accessories_invoicecopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.non_electrical_accessories_invoicecopyurl = "";
      this.non_electrical_accessories_invoicecopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.non_electrical_accessories_invoicecopyurl = event.target.result;
      }
      this.non_electrical_accessories_invoicecopyurl_label = file.name;
      this.formeditNonElectricalAccessories.patchValue({
        'non_electrical_accessories_invoicecopy' : file
      });
    }
  }

  // uploadNonElectricalAccessoriesConfirmlettercopy(event){

  //   var file :any = event.target.files[0];
  //   var file_type:any = file.type;
  //   var file_size :any = file.size ;


  //   if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
  //     Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
  //     this.non_electrical_accessories_customerletterurl = "";
  //     this.non_electrical_accessories_customerletterurl_label = "";

  //   }else if(file_size > 5242880){
  //     Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  //     this.non_electrical_accessories_customerletterurl = "";
  //     this.non_electrical_accessories_customerletterurl_label = "";
  //   }else{
  //     console.log(event.target.result);
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.non_electrical_accessories_customerletterurl = event.target.result;
  //     }
  //     this.non_electrical_accessories_customerletterurl_label = file.name;
  //     this.formeditNonElectricalAccessories.patchValue({
  //       'non_electrical_accessories_customerletter' : file
  //     });
  //   }
  // }

  // uploadNonElectricalAccessoriesNocPrevFinanciercopy(event){

  //   var file :any = event.target.files[0];
  //   var file_type:any = file.type;
  //   var file_size :any = file.size ;


  //   if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
  //     Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
  //     this.non_electrical_accessories_noc_prev_financier_copyurl = "";
  //     this.non_electrical_accessories_noc_prev_financier_copyurl_label = "";
  //   }else if(file_size > 5242880){
  //     Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  //     this.non_electrical_accessories_noc_prev_financier_copyurl = "";
  //     this.non_electrical_accessories_noc_prev_financier_copyurl_label = "";
  //   }else{
  //     console.log(event.target.result);
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.non_electrical_accessories_noc_prev_financier_copyurl = event.target.result;
  //     }
  //     this.non_electrical_accessories_noc_prev_financier_copyurl_label = file.name;
  //     this.formeditNonElectricalAccessories.patchValue({
  //       'non_electrical_accessories_noc_prev_financier_copy' : file
  //     });
  //   }
  // }

  // uploadNonElectricalAccessoriesLetterNewFinanciercopy(event){

  //   var file :any = event.target.files[0];
  //   var file_type:any = file.type;
  //   var file_size :any = file.size ;


  //   if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
  //     Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
  //     this.non_electrical_accessories_letter_from_new_financier_copyurl = "";
  //     this.non_electrical_accessories_letter_from_new_financier_copyurl_label = "";
  //   }else if(file_size > 5242880){
  //     Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  //     this.non_electrical_accessories_letter_from_new_financier_copyurl = "";
  //     this.non_electrical_accessories_letter_from_new_financier_copyurl_label = "";
  //   }else{
  //     console.log(event.target.result);
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.non_electrical_accessories_letter_from_new_financier_copyurl = event.target.result;
  //     }
  //     this.non_electrical_accessories_letter_from_new_financier_copyurl_label = file.name;
  //     this.formeditNonElectricalAccessories.patchValue({
  //       'non_electrical_accessories_letter_from_new_financier_copy' : file
  //     });
  //   }
  // }


  ///////////    END - NON ELECTRICL ACCESSORIES    ///////////

  ///////////    START - PA UNNAMED PERSONS    ///////////
  uploadPaUnnamedPersonsRCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.pa_unnamed_persons_rccopyurl = "";
      this.pa_unnamed_persons_rccopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.pa_unnamed_persons_rccopyurl = "";
      this.pa_unnamed_persons_rccopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.pa_unnamed_persons_rccopyurl = event.target.result;
      }
      this.pa_unnamed_persons_rccopyurl_label = file.name;
      this.formeditPaUnnamedPersons.patchValue({
        'pa_unnamed_persons_rccopy' : file
      });
    }
  }

  uploadPaUnnamedPersonsConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.pa_unnamed_persons_customerletterurl = "";
      this.pa_unnamed_persons_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.pa_unnamed_persons_customerletterurl = "";
      this.pa_unnamed_persons_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.pa_unnamed_persons_customerletterurl = event.target.result;
      }
      this.pa_unnamed_persons_customerletterurl_label = file.name;
      this.formeditPaUnnamedPersons.patchValue({
        'pa_unnamed_persons_customerletter' : file
      });
    }
  }

  uploadPaUnnamedPersonsNocPrevFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.pa_unnamed_persons_noc_prev_financier_copyurl = "";
      this.pa_unnamed_persons_noc_prev_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.pa_unnamed_persons_noc_prev_financier_copyurl = "";
      this.pa_unnamed_persons_noc_prev_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.pa_unnamed_persons_noc_prev_financier_copyurl = event.target.result;
      }
      this.pa_unnamed_persons_noc_prev_financier_copyurl_label = file.name;
      this.formeditPaUnnamedPersons.patchValue({
        'pa_unnamed_persons_noc_prev_financier_copy' : file
      });
    }
  }

  uploadPaUnnamedPersonsLetterNewFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.pa_unnamed_persons_letter_from_new_financier_copyurl = "";
      this.pa_unnamed_persons_letter_from_new_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.pa_unnamed_persons_letter_from_new_financier_copyurl = "";
      this.pa_unnamed_persons_letter_from_new_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.pa_unnamed_persons_letter_from_new_financier_copyurl = event.target.result;
      }
      this.pa_unnamed_persons_letter_from_new_financier_copyurl_label = file.name;
      this.formeditPaUnnamedPersons.patchValue({
        'pa_unnamed_persons_letter_from_new_financier_copy' : file
      });
    }
  }

  submitFormEditPaUnnamedPersons(){

    this.submittedPaUnnamedPersonsDetails = true;
    if(this.formeditPaUnnamedPersons.invalid){
      return;
    }

    var ed_pa_unnamed_persons = this.formeditPaUnnamedPersons.value.ed_pa_unnamed_persons;
    var ed_pa_unnamed_persons_existing = this.pa_suminsured_per_unnamed_person;

    if(ed_pa_unnamed_persons<ed_pa_unnamed_persons_existing){
      Swal.fire ("Please select sum insured greater than current PA Unnamed persons sum insured",  "" ,  "error" );
      return;
    }

    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(ed_pa_unnamed_persons==ed_pa_unnamed_persons_existing){
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }



    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','20');

    uploadData.append('ed_pa_unnamed_persons',this.formeditPaUnnamedPersons.value.ed_pa_unnamed_persons);
    uploadData.append('ed_pa_unnamed_persons_existing',this.pa_suminsured_per_unnamed_person);

    uploadData.append('net_premium',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_net_premium);
    uploadData.append('gst',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_gst);
    uploadData.append('final_premium',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_final_premium);

    uploadData.append('isRefund',this.isRefundPaUnnamedPersonsFormValue);

    uploadData.append('rccopy',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_rccopy);
    uploadData.append('customerletter',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_customerletter);
    uploadData.append('noc_previous_financier',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_noc_prev_financier_copy);
    uploadData.append('letter_new_financier',this.formeditPaUnnamedPersons.value.pa_unnamed_persons_letter_from_new_financier_copy);

    uploadData.append('remark_pa_unnamed_persons',this.formeditPaUnnamedPersons.value.remark_pa_unnamed_persons);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  ///////////    END - PA UNNAMED PERSONS    ///////////

  ///////////    START - LL PAID DRIVER    ///////////
  uploadLlPaidDriversRCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ll_paid_drivers_rccopyurl = "";
      this.ll_paid_drivers_rccopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ll_paid_drivers_rccopyurl = "";
      this.ll_paid_drivers_rccopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ll_paid_drivers_rccopyurl = event.target.result;
      }
      this.ll_paid_drivers_rccopyurl_label = file.name;
      this.formeditLlPaidDrivers.patchValue({
        'll_paid_drivers_rccopy' : file
      });
    }
  }

  uploadLlPaidDriversConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ll_paid_drivers_customerletterurl = "";
      this.ll_paid_drivers_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ll_paid_drivers_customerletterurl = "";
      this.ll_paid_drivers_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ll_paid_drivers_customerletterurl = event.target.result;
      }
      this.ll_paid_drivers_customerletterurl_label = file.name;
      this.formeditLlPaidDrivers.patchValue({
        'll_paid_drivers_customerletter' : file
      });
    }
  }

  uploadLlPaidDriversNocPrevFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ll_paid_drivers_noc_prev_financier_copyurl = "";
      this.ll_paid_drivers_noc_prev_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ll_paid_drivers_noc_prev_financier_copyurl = "";
      this.ll_paid_drivers_noc_prev_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ll_paid_drivers_noc_prev_financier_copyurl = event.target.result;
      }
      this.ll_paid_drivers_noc_prev_financier_copyurl_label = file.name;
      this.formeditLlPaidDrivers.patchValue({
        'll_paid_drivers_noc_prev_financier_copy' : file
      });
    }
  }

  uploadLlPaidDriversLetterNewFinanciercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.ll_paid_drivers_letter_from_new_financier_copyurl = "";
      this.ll_paid_drivers_letter_from_new_financier_copyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.ll_paid_drivers_letter_from_new_financier_copyurl = "";
      this.ll_paid_drivers_letter_from_new_financier_copyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ll_paid_drivers_letter_from_new_financier_copyurl = event.target.result;
      }
      this.ll_paid_drivers_letter_from_new_financier_copyurl_label = file.name;
      this.formeditLlPaidDrivers.patchValue({
        'll_paid_drivers_letter_from_new_financier_copy' : file
      });
    }
  }

  submitFormEditLlPaidDrivers(){

    this.submittedLlPaidDriversDetails = true;
    if(this.formeditLlPaidDrivers.invalid){
      return;
    }

    var ed_ll_paid_drivers = this.formeditLlPaidDrivers.value.ed_ll_paid_drivers;
    var ed_ll_paid_drivers_existing = this.is_ll_paid_driver;

    if(this.selected_endorsement_data.endorsement_status_id != 3){
      if(ed_ll_paid_drivers==ed_ll_paid_drivers_existing){
        Swal.fire ("No Change in Endorsement",  "" ,  "error" );
        return;
      }
    }



    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','21');

    uploadData.append('ed_ll_paid_drivers',this.formeditLlPaidDrivers.value.ed_ll_paid_drivers);
    uploadData.append('ed_ll_paid_drivers_existing',this.ll_paid_drivers);

    uploadData.append('net_premium',this.formeditLlPaidDrivers.value.ll_paid_drivers_net_premium);
    uploadData.append('gst',this.formeditLlPaidDrivers.value.ll_paid_drivers_gst);
    uploadData.append('final_premium',this.formeditLlPaidDrivers.value.ll_paid_drivers_final_premium);

    uploadData.append('isRefund',this.isRefundLlPaidDriverFormValue);

    uploadData.append('rccopy',this.formeditLlPaidDrivers.value.ll_paid_drivers_rccopy);
    uploadData.append('customerletter',this.formeditLlPaidDrivers.value.ll_paid_drivers_customerletter);
    uploadData.append('noc_previous_financier',this.formeditLlPaidDrivers.value.ll_paid_drivers_noc_prev_financier_copy);
    uploadData.append('letter_new_financier',this.formeditLlPaidDrivers.value.ll_paid_drivers_letter_from_new_financier_copy);

    uploadData.append('remark_ll_paid_drivers',this.formeditLlPaidDrivers.value.remark_ll_paid_drivers);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  ///////////    END - LL PAID DRIVER    ///////////

  ///////////    START - GEO EXTENSION    ///////////

  getGeographicalExtension(e,row) {

     const checkArray: FormArray = this.formeditGeoExtension.get('ed_geo_extension') as FormArray;

     if (e.target.checked) {
       checkArray.push(new FormControl(row.id));
        if(row.id==='srilanka'){
          this.is_geographical_extension_srilanka=1;
        }
        if(row.id==='bangladesh'){
          this.is_geographical_extension_bangladesh=1;
        }
        if(row.id==='bhutan'){
          this.is_geographical_extension_bhutan=1;
        }
        if(row.id==='maldives'){
          this.is_geographical_extension_maldives=1;
        }
        if(row.id==='nepal'){
          this.is_geographical_extension_nepal=1;
        }
        if(row.id==='pakistan'){
          this.is_geographical_extension_pakistan=1;
        }
     } else {
       let i: number = 0;
       checkArray.controls.forEach((item: FormControl) => {
         if (item.value == row.id) {
          if(row.id==='srilanka'){
            this.is_geographical_extension_srilanka=0;
          }
          if(row.id==='bangladesh'){
            this.is_geographical_extension_bangladesh=0;
          }
          if(row.id==='bhutan'){
            this.is_geographical_extension_bhutan=0;
          }
          if(row.id==='maldives'){
            this.is_geographical_extension_maldives=0;
          }
          if(row.id==='nepal'){
            this.is_geographical_extension_nepal=0;
          }
          if(row.id==='pakistan'){
            this.is_geographical_extension_pakistan=0;
          }

           checkArray.removeAt(i);
           return;
         }
         i++;
       });
     }

     // console.log('checkArray...........');
     // console.log(this.formeditGeoExtension.get('ed_geo_extension'));

     if(checkArray.length>2){
      this.geo_extension_net_premium = "500";
      this.geo_extension_gst = "90";
      this.geo_extension_final_premium = "590";

      this.formeditGeoExtension.patchValue({
          ed_geo_extension : checkArray.value,
          geo_extension_net_premium : "500",
          geo_extension_gst : "90",
          geo_extension_final_premium : "590"
        });
     }
     else{
      this.geo_extension_net_premium = "0";
      this.geo_extension_gst = "0";
      this.geo_extension_final_premium = "0";

      this.formeditGeoExtension.patchValue({
          ed_geo_extension : [''],
          geo_extension_net_premium : "0",
          geo_extension_gst : "0",
          geo_extension_final_premium : "0"
        });
     }

  }

  uploadGeoExtensionInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.geo_extension_invoicecopyurl = "";
      this.geo_extension_invoicecopyurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.geo_extension_invoicecopyurl = "";
      this.geo_extension_invoicecopyurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.geo_extension_invoicecopyurl = event.target.result;
      }
      this.geo_extension_invoicecopyurl_label = file.name;
      this.formeditGeoExtension.patchValue({
        'geo_extension_invoicecopy' : file
      });
    }
  }

  uploadGeoExtensionConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.geo_extension_customerletterurl = "";
      this.geo_extension_customerletterurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.geo_extension_customerletterurl = "";
      this.geo_extension_customerletterurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.geo_extension_customerletterurl = event.target.result;
      }
      this.geo_extension_customerletterurl_label = file.name;
      this.formeditGeoExtension.patchValue({
        'geo_extension_customerletter' : file
      });
    }
  }


  submitFormEditGeoExtension(){

    this.submittedGeoExtensionDetails = true;
    if(this.formeditGeoExtension.invalid){
      return;
    }

    let checkArray = <FormArray>this.formeditGeoExtension.controls.ed_geo_extension;
    let countArray=[];
    this.result_geographical_extension.forEach(row => {
      if(row.checked){
        checkArray.push(new FormControl(row.id));
        countArray.push(new FormControl(row.id));
      }
    })

    var checkedUsers = '';
    this.result_geographical_extension.forEach(function(item) {
      if (item.checked) {
        if(checkedUsers != ''){
          checkedUsers += ",";
        }
        checkedUsers += item.id;
      }
    });

    if(countArray.length<=2){
      Swal.fire ("Please Select atleast 3 geo extension",  "" ,  "error" );
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);
    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','22');
    // uploadData.append('ed_geo_extension',this.formeditGeoExtension.value.ed_geo_extension);
    // let geographical_extension = (this.formeditGeoExtension.value.ed_geo_extension != undefined) ? this.formeditGeoExtension.value.ed_geo_extension : '';
    // uploadData.append('ed_geo_extension',geographical_extension);
    uploadData.append('ed_geo_extension',checkedUsers);

    ///existing geo extensions
    uploadData.append('is_geographical_extension_bangladesh',this.is_geographical_extension_bangladesh);
    uploadData.append('is_geographical_extension_bhutan',this.is_geographical_extension_bhutan);
    uploadData.append('is_geographical_extension_maldives',this.is_geographical_extension_maldives);
    uploadData.append('is_geographical_extension_nepal',this.is_geographical_extension_nepal);
    uploadData.append('is_geographical_extension_pakistan',this.is_geographical_extension_pakistan);
    uploadData.append('is_geographical_extension_srilanka',this.is_geographical_extension_srilanka);

    uploadData.append('net_premium',this.formeditGeoExtension.value.geo_extension_net_premium);
    uploadData.append('gst',this.formeditGeoExtension.value.geo_extension_gst);
    uploadData.append('final_premium',this.formeditGeoExtension.value.geo_extension_final_premium);

    uploadData.append('isRefund',this.isRefundGeoExtensionFormValue);

    uploadData.append('invoice_copy',this.formeditGeoExtension.value.geo_extension_invoicecopy);
    uploadData.append('customerletter',this.formeditGeoExtension.value.geo_extension_customerletter);

    uploadData.append('remark_geo_extension',this.formeditGeoExtension.value.remark_geo_extension);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  ///////////    END - GEO EXTENSION    ///////////




}
