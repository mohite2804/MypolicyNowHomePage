import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";

import { CustomvalidationService } from '../../services/customvalidation.service';
import {NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from  '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-endorsement',
  templateUrl: './policy-transfer-endorsement.component.html',
  styleUrls: ['./policy-transfer-endorsement.component.css']
})
export class PolicyTransferEndorsementComponent implements OnInit {
  base_url = environment.baseUrl;
  [x: string]: any;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  loaderActive : any;

  UploadValue: boolean = false;
  fileChangeFunCalled: boolean = false;

  date_picker_dob: NgbDateStruct;
  result_salutation : any;
  result_relations : any;
  result_relationsForNominee:any;
  result_relationsForAppoint:any;
  relations_id_data : any;

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
  //validation_for_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_aadhar_card :any = "^[0-9]{12}$";
  validation_for_age :any = "^[0-9]{1,2}$";
  //validation_for_company_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  // :any = "^[a-zA-Z0-9]+$";

  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_company_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_gst_no :any         = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  validation_for_company_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";


  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  result_proposer_types : any;
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

  formeditTransfer: FormGroup;
  submittedTransferDetails : boolean = false;
  //minDate = undefined;

  minDate  : NgbDateStruct;
  maxDateForBirthdate : NgbDateStruct;

  activeTab = 'non-nil-endorsement-tab1';


  registration_no_part_3_val : any;
  registration_no_part_4_val : any;

  policy_type_name : any;
  policy_subtype_name : any;

  result_geographical_extension : any;

  /////////form variables
  policy_start_date : any;

  idv : any;
  ncb : any;
  ncb_amount : any;
  total_od : any;
  addons_amt : any;

  ncb_recover_amount: any;
  ncb_recover_gst: any;
  total_recover_amount: any;
  endorsement_fees: any;
  endorsement_fees_gst: any;
  total_endorsement_fees: any;
  total_gst_fees: any;
  total_endorsement_charges: any;

  result : any;
  policy_no : any;
  policy_endorsement_id : any;
  item_id : any;

  is_not_third_party_policy : boolean = false;

  div_show_for_appointee : boolean = true;

  registration_no : any;

  ex_policyholdertype : any;

  ex_company_salutation : any;
  ex_company_name : any;
  ex_company_gst_no : any;
  ex_company_pan_no : any;
  ex_company_own_salutation : any;
  ex_company_owner_fisrt_name : any;
  ex_company_owner_middle_name : any;
  ex_company_owner_last_name : any;
  ex_company_owner_email : any;
  ex_company_owner_mobile : any;
  ex_company_owner_address_1 : any;
  ex_company_owner_address_2 : any;
  ex_company_owner_pincode : any;
  ex_company_owner_city_name : any;
  ex_company_owner_state_name : any;

  ex_salutation : any;
  ex_first_name : any;
  ex_middle_name : any;
  ex_last_name : any;
  ex_address1 : any;
  ex_address2 : any;
  ex_pincode : any;
  ex_city : any;
  ex_state : any;
  ex_reg_no : any;
  ex_email : any;
  ex_mobile : any;
  ex_dob : any;
  ex_gender : any;
  ex_pan_no : any;

  ex_nominee_salutation : any;
  ex_nominee_first_name : any;
  ex_nominee_middle_name : any;
  ex_nominee_last_name : any;
  ex_nominee_relation : any;
  ex_nominee_age : any;

  ex_appointee_salutation : any;
  ex_appointee_first_name : any;
  ex_appointee_middle_name : any;
  ex_appointee_last_name : any;
  ex_appointee_relation : any;
  ex_appointee_age : any;

  net_premium : any;
  gst : any;
  final_premium : any;

  ///NOC
  noc_label : any;
  noc_url_label
  noc_url : any;

  ///Invoice RC Copy
  invoice_rc_copy_label : any;
  invoice_rc_copy_url_label
  invoice_rc_copy_url : any;

  ///Form 29/30 Copy
  form29_form30_label : any;
  form29_form30_url_label
  form29_form30_url : any;

  ///Form 29/30 Copy
  inpection_report_label : any;
  inpection_report_url_label
  inpection_report_url : any;

  ///front_image
  front_image_label : any;
  front_image_url_label
  front_image_url : any;

  ///rear_image
  rear_image_label : any;
  rear_image_url_label
  rear_image_url : any;

  ///left_image
  left_image_label : any;
  left_image_url_label
  left_image_url : any;

  ///right_image
  right_image_label : any;
  right_image_url_label
  right_image_url : any;

  ///windscreen_inside
  windscreen_inside_label : any;
  windscreen_inside_url_label
  windscreen_inside_url : any;

  ///windscreen_outside
  windscreen_outside_label : any;
  windscreen_outside_url_label
  windscreen_outside_url : any;

  ///autometer_with_engine_on
  autometer_with_engine_on_label : any;
  autometer_with_engine_on_url_label
  autometer_with_engine_on_url : any;

  ///chassis_plate_print
  chassis_plate_print_label : any;
  chassis_plate_print_url_label
  chassis_plate_print_url : any;

  ///previous_insurance_copy
  previous_insurance_copy_label : any;
  previous_insurance_copy_url_label
  previous_insurance_copy_url : any;

  ///dicky_open
  dicky_open_label : any;
  dicky_open_url_label
  dicky_open_url : any;

  ///selfie_with_vehicle
  selfie_with_vehicle_label : any;
  selfie_with_vehicle_url_label
  selfie_with_vehicle_url : any;

  div_show_company_details : boolean = false;
  div_show_owner_details : boolean = false;
  div_show_nominee_details : boolean = false;
  public_path:any;
  already_initiated:any;

  show_initiated_btn:boolean=true;
  hide_initiated_btn:boolean=false;

  constructor(private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {
  	 const current = new Date();
      this.minDate = {
        year: current.getFullYear()-80,
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

      this.setTransferFormDetails();

      this.validateUserLoginStatus(this.loginUserId,this.token);

      this.policy_no  = sessionStorage.getItem('policy_no');
      this.policy_endorsement_id  = sessionStorage.getItem('policy_endorsement_id');
      this.item_id  = sessionStorage.getItem('item_id');

      let uploadData = new FormData();
      uploadData.append('policy_number',this.policy_no);
      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('loginUserType',this.loginUserType);
      uploadData.append('endorsement_id',this.policy_endorsement_id);

      console.log('submitformeditTransfer........');
      console.log(uploadData);
      this.loaderActive = true;
      this.commonService.submitEndorsmentFilterDetails(uploadData)
      .subscribe(response => {
          var outputResult : any = response;
          this.loaderActive = false;
          if(outputResult.status){
            console.log(outputResult.already_initiated);

            if(outputResult.already_initiated==''){
              this.show_initiated_btn=true;
              this.hide_initiated_btn=false;
            }else{
              this.already_initiated=outputResult.already_initiated;
              this.show_initiated_btn=false;
              this.hide_initiated_btn=true;
            }

            this.result = outputResult.result[0];

            this.policy_id=this.result.policy_id;
            this.ic_id=this.result.ic_id;
            this.product_type_id=this.result.product_type_id;


            this.public_path=outputResult.public_path;
            this.result_proposer_types = outputResult.proposer_types;
            this.salutation = outputResult.salutation;
            this.result_salutation = outputResult.salutation;
            this.result_relations = outputResult.relations;
            this.relations_id_data=outputResult.relations_id_data;

            this.result_relationsForNominee=this.result_relations;
            this.result_relationsForAppoint=this.result_relations;

            this.agreement_types = outputResult.agreement_types;
            this.rto_master = outputResult.rto;
            this.vehicle_color = outputResult.vehicle_color;
            this.bank_master = outputResult.bank_master;
            this.relations = outputResult.relations;
            this.endorsement_item = outputResult.endorsement_item_master;
            this.result_previous_ncb = outputResult.previous_ncb;
            this.result_pa_sum_insured = outputResult.pa_sum_insured;
            this.result_ll_terms = outputResult.ll_terms;
            this.result_geographical_extension = outputResult.geographical_extension;

            this.policy_type_name = this.result.policy_type_name;
            this.policy_subtype_name = this.result.policy_subtype_name;

            this.policy_start_date = this.result.policy_start_date;

            this.idv = this.result.idv;
            this.ncb = this.result.current_ncb_per;
            this.ncb_amount = this.result.ncb_amount;

            this.total_od = this.result.total_basic_od;
            this.addons_amt = this.result.total_addon_premium;

            this.setFormDetails(this.result);
            if(outputResult.endorsement_data.length == undefined){
              this.setTransferData(outputResult.endorsement_data);
            }
            if((this.result.policy_subtype_id==5 || this.result.policy_subtype_id=='5' || this.result.policy_subtype_id==10 || this.result.policy_subtype_id=='10' || this.result.policy_subtype_id==11 || this.result.policy_subtype_id=='11' || this.result.policy_subtype_id==16 || this.result.policy_subtype_id=='16')){
              this.is_not_third_party_policy = false;
              this.resetInspectionImagesValidation();
            }
            else{
              this.setInspectionImagesValidation();
            }
          }
          else{
            Swal.fire({
              title: '',
              html: outputResult.message
            });
          }
      });

      this.getTransferEndorsementCharges();
  }

  selectDateForDOB(selected_date){
    var selected_date :any = new Date(selected_date);

      var year : any =  selected_date.getFullYear();
      var month : any =  selected_date.getMonth() + 1;
      var day : any =  selected_date.getDate();
      var set_date :any= { year: year, month: month, day: day };
      day  = (day < 10 ? '0' : '') + day;
      month = (month < 10 ? '0' : '') + month;
      year =  year;
      var selected_date_for_form : any = year +'-'+ month +'-'+ day;
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_dob = set_date;
          this.formeditTransfer.patchValue({ ed_dob : selected_date_for_form });
        }

}


  setTransferData(result){
    this.validationFormDetails(result.ed_policyholdertype);
    this.nomineeRelationType('nominee',result.ed_nominee_salutation);
    this.nomineeRelationType('appointee',result.ed_appointee_salutation);
    this.selectDateForDOB(result.ed_dob),
    this.formeditTransfer.patchValue({
      ed_salutation : result.ed_salutation,
      ed_first_name : result.ed_first_name,
      ed_policyholdertype:result.ed_policyholdertype,
      ed_middle_name:result.ed_middle_name,
      ed_last_name:result.ed_last_name,
      ed_address1:result.ed_address1,
      ed_address2:result.ed_address2,
      ed_pincode:result.ed_pincode,
      ed_city:result.ed_city,
      ed_state:result.ed_state,
      ed_email:result.ed_email,
      ed_mobile:result.ed_mobile,
      ed_gender:result.ed_gender,
      ed_nominee_salutation:result.ed_nominee_salutation,
      ed_nominee_first_name:result.ed_nominee_first_name,
      ed_nominee_middle_name:result.ed_nominee_middle_name,
      ed_nominee_last_name:result.ed_nominee_last_name,
      ed_nominee_relation:result.ed_nominee_relation,
      ed_nominee_age:result.ed_nominee_age,
      ed_appointee_salutation:result.ed_appointee_salutation,
      ed_appointee_first_name:result.ed_appointee_first_name,
      ed_appointee_middle_name:result.ed_appointee_middle_name,
      ed_appointee_last_name:result.ed_appointee_last_name,
      ed_appointee_relation:result.ed_appointee_relation,
      ed_appointee_age:result.ed_appointee_age,
      ed_company_salutation:result.ed_company_salutation,
      ed_company_name:result.ed_company_name,
      ed_company_gst_no:result.ed_company_gst_no,
      ed_company_pan_no:result.ed_company_pan_no,
      ed_company_own_salutation:result.ed_company_own_salutation,
      ed_company_owner_fisrt_name:result.ed_company_owner_fisrt_name,
      ed_company_owner_middle_name:result.ed_company_owner_middle_name,
      ed_company_owner_last_name:result.ed_company_owner_last_name,
      ed_company_owner_email:result.ed_company_owner_email,
      ed_company_owner_mobile:result.ed_company_owner_mobile,
      ed_company_owner_address_1:result.ed_company_owner_address_1,
      ed_company_owner_address_2:result.ed_company_owner_address_2,
      ed_company_owner_pincode:result.ed_company_owner_pincode,
      ed_company_owner_city_name:result.ed_company_owner_city_name,
      ed_company_owner_state_name:result.ed_company_owner_state_name,
      remark:result.remark,
      isRefund:result.isRefund,
      net_premium:result.net_premium,
      gst:result.gst,
      final_premium:result.final_premium,
      noc_document_path:result.noc_document_path,
      invoice_rc_copy_document_path:result.invoice_rc_copy_document_path,
      inpection_report_document_path:result.inpection_report_document_path,
      front_image_document_path:result.front_image_document_path,
      rear_image_document_path:result.rear_image_document_path,
      left_image_document_path:result.left_image_document_path,
      right_image_document_path:result.right_image_document_path,
      windscreen_inside_document_path:result.windscreen_inside_document_path,
      windscreen_outside_document_path:result.windscreen_outside_document_path,
      autometer_with_engine_on_document_path:result.autometer_with_engine_on_document_path,
      chassis_plate_print_document_path:result.chassis_plate_print_document_path,
      dicky_open_document_path:result.dicky_open_document_path
    });
    this.resetInspectionImagesValidation();

    this.formeditTransfer.patchValue({
      noc_document : result.noc_document_path,
      invoice_rc_copy_document : result.invoice_rc_copy_document_path,
      form29_form30_document : result.invoice_rc_copy_document_path,
      inpection_report_document : result.inpection_report_document_path,
      front_image_document : result.front_image_document_path,
      rear_image_document : result.rear_image_document_path,
      left_image_document : result.left_image_document_path,
      right_image_document : result.right_image_document_path,
      windscreen_inside_document : result.windscreen_inside_document_path,
      windscreen_outside_document : result.windscreen_outside_document_path,
      autometer_with_engine_on_document : result.autometer_with_engine_on_document_path,
      chassis_plate_print_document : result.chassis_plate_print_document_path,
      previous_insurance_copy_document : result.previous_insurance_copy_document_path,
      dicky_open_document : result.dicky_open_document_path,
      selfie_with_vehicle_document : result.selfie_with_vehicle_document_path
    });

    this.edPolicyholdertype(result.ed_policyholdertype);

    this.noc_url=this.public_path+'endorsement/noc_document/'+result.noc_document_path;
    this.invoice_rc_copy_url = this.public_path+'endorsement/invoice_rc_copy_document/'+result.invoice_rc_copy_document_path;
    this.form29_form30_url = this.public_path+'endorsement/form29_form30_document/'+result.form29_form30_document_path;
    this.inpection_report_url = this.public_path+'endorsement/inpection_report_document/'+result.inpection_report_document_path;
    this.front_image_url = this.public_path+'endorsement/front_image_document/'+result.front_image_document_path;
    this.rear_image_url = this.public_path+'endorsement/rear_image_document/'+result.rear_image_document_path;
    this.left_image_url = this.public_path+'endorsement/left_image_document/'+result.left_image_document_path;
    this.right_image_url = this.public_path+'endorsement/right_image_document/'+result.right_image_document_path;
    this.windscreen_inside_url = this.public_path+'endorsement/windscreen_inside_document/'+result.windscreen_inside_document_path;
    this.windscreen_outside_url = this.public_path+'endorsement/windscreen_outside_document/'+result.windscreen_outside_document_path;
    this.autometer_with_engine_on_url = this.public_path+'endorsement/autometer_with_engine_on_document/'+result.autometer_with_engine_on_document_path;
    this.chassis_plate_print_url = this.public_path+'endorsement/chassis_plate_print_document/'+result.chassis_plate_print_document_path;
    this.previous_insurance_copy_url = this.public_path+'endorsement/previous_insurance_copy_document/'+result.previous_insurance_copy_document_path;
    this.dicky_open_url = this.public_path+'endorsement/dicky_open_document/'+result.dicky_open_document_path;
    this.selfie_with_vehicle_url = this.public_path+'endorsement/selfie_with_vehicle_document/'+result.selfie_with_vehicle_document_path;
  }

  edPolicyholdertype(ed_policyholdertype){
    if(ed_policyholdertype == 'Individual'){
      this.div_show_owner_details  = true;
      this.div_show_nominee_details = true;
      this.div_show_company_details = false;
    }
    else if(ed_policyholdertype == 'Corporate'){
      this.div_show_company_details = true;
      this.div_show_owner_details  = false;
      this.div_show_nominee_details = false;
    }else{
      this.div_show_company_details = false;
      this.div_show_owner_details  = false;
      this.div_show_nominee_details = false;
    }
  }

  nomineeRelationType(type,val){
    if(val=='Mr.'){
      var ids=this.relations_id_data.id_1;
    }else if(val=='Mrs.'){
      var ids=this.relations_id_data.id_2;
    }else if(val =='Miss'){
      var ids=this.relations_id_data.id_3;
    }
    if(val && ids != undefined){
      if(type=='nominee'){
        console.log("result_relations:- "+this.result_relations);
        console.log("ids:- "+ids);

        this.result_relationsForNominee=this.result_relations;
        ids.forEach( (value) => {
            this.result_relationsForNominee = this.result_relationsForNominee.filter(item =>
              item.name != value
            );
        })
      }else{
        this.result_relationsForAppoint=this.result_relations;
        ids.forEach( (value) => {
            this.result_relationsForAppoint = this.result_relationsForAppoint.filter(item =>
              item.name != value
            );
        })
      }
    }
    console.log("result_relationsForNominee:- "+this.result_relationsForNominee);
    console.log("result_relations:- "+this.result_relations);
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

  getTransferEndorsementCharges(){
    let uploadData = new FormData();
    uploadData.append('policy_number',this.policy_no);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);

    this.loaderActive = true;
    this.commonService.getTransferEndorsementCharges(uploadData)
    .subscribe(response => {
        var edResult : any = response;
        this.loaderActive = false;
        if(edResult.status){
          this.ncb_recover_amount = edResult.ncb_recover_amount;
          this.ncb_recover_gst = edResult.ncb_recover_gst;
          this.endorsement_fees = edResult.endorsement_fees;
          this.endorsement_fees_gst = edResult.endorsement_fees_gst;
          this.total_endorsement_fees = edResult.total_endorsement_fees;
          this.total_recover_amount = edResult.total_recover_amount;
          this.total_endorsement_charges = edResult.total_endorsement_charges;
          this.total_gst_fees=edResult.total_gst_fees;
          this.final_premium =  edResult.ncb_recover_amount + edResult.endorsement_fees;
          this.gst =  edResult.endorsement_fees_gst+edResult.ncb_recover_gst;
          this.final_premium =  edResult.total_endorsement_charges;
        }
        else{
          Swal.fire({
            title: '',
            html: edResult.message
          });
        }
    });

  }

  selectPolicyHolderType(event){
    var policyHolderType = event.target.value;
    this.edPolicyholdertype(policyHolderType);
    this.validationFormDetails(policyHolderType);

  }

  setTransferFormDetails(){
    this.formeditTransfer = this.formBuilder.group({
        ed_policyholdertype : ['',[Validators.required]],
        ed_salutation : ['',[Validators.required]],
        ed_first_name : ['',[Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(25)]],
        ed_middle_name : ['',[Validators.pattern(this.validation_for_name_with_space), Validators.minLength(1), Validators.maxLength(15)]],
        ed_last_name : ['',[Validators.required,Validators.pattern(this.validation_for_character),Validators.minLength(1),Validators.maxLength(15)]],
        ed_address1 : ['',[Validators.required,Validators.pattern(this.validation_for_address), this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]],
        ed_address2 : ['',[Validators.required,Validators.pattern(this.validation_for_address),this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]],
        ed_pincode : ['',[Validators.required,Validators.min(1),Validators.pattern(this.validation_for_pincode)]],
        ed_pincode_id : [''],
        ed_city_id : [''],
        ed_state_id : [''],
        ed_city : ['',[Validators.required]],
        ed_state : ['',[Validators.required]],
        ed_reg_no : ['',[Validators.required]],
        ed_email : ['',[Validators.required,Validators.pattern(this.validation_for_email)]],
        ed_mobile : ['',[Validators.required,Validators.pattern(this.validation_for_mobile_no)]],
        ed_dob : ['',[Validators.required]],
        ed_gender : ['',[Validators.required]],
        ed_pan_no : ['',[Validators.pattern(this.validation_for_pan)]],
        ed_nominee_salutation : ['',[Validators.required]],
        ed_nominee_first_name : ['',[Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(15)]],
        ed_nominee_middle_name : ['',[Validators.pattern(this.validation_for_name_with_space),Validators.minLength(1),Validators.maxLength(15)]],
        ed_nominee_last_name : ['',[Validators.required,Validators.pattern(this.validation_for_character),Validators.minLength(1),Validators.maxLength(15)]],
        ed_nominee_relation : ['',[Validators.required]],
        ed_nominee_age : ['',[Validators.required,this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age)]],
        ed_appointee_salutation : [''],
        ed_appointee_first_name : [''],
        ed_appointee_middle_name : [''],
        ed_appointee_last_name : [''],
        ed_appointee_relation : [''],
        ed_appointee_age : [''],
        noc_document : [''],
        invoice_rc_copy_document : [''],
        form29_form30_document : [''],
        inpection_report_document : [''],
        front_image_document : [''],
        rear_image_document : [''],
        left_image_document : [''],
        right_image_document : [''],
        windscreen_inside_document : [''],
        windscreen_outside_document : [''],
        autometer_with_engine_on_document : [''],
        chassis_plate_print_document : [''],
        previous_insurance_copy_document : [''],
        dicky_open_document : [''],
        selfie_with_vehicle_document : [''],
        ed_company_salutation : [''],
        ed_company_name : [''],
        ed_company_gst_no : [''],
        ed_company_pan_no : [''],
        ed_company_own_salutation : [''],
        ed_company_owner_fisrt_name : [''],
        ed_company_owner_middle_name : [''],
        ed_company_owner_last_name : [''],
        ed_company_owner_email : [''],
        ed_company_owner_mobile : [''],
        ed_company_owner_address_1 : [''],
        ed_company_owner_address_2 : [''],
        ed_company_owner_pincode : [''],
        ed_company_owner_city_name : [''],
        ed_company_owner_state_name : [''],
        remark : ['',[Validators.required]],
      });

    this.formeditTransfer.patchValue({
        ed_company_salutation : '',
        ed_policyholdertype : 'Individual'
      });
  }

  validationFormDetails(policy_holder_type){

    if(policy_holder_type=='Individual')
    {

      this.formeditTransfer.patchValue({
        ed_company_salutation : '',
        ed_company_name : '',
        ed_company_gst_no : '',
        ed_company_pan_no : '',
        ed_company_own_salutation : '',
        ed_company_owner_fisrt_name : '',
        ed_company_owner_middle_name : '',
        ed_company_owner_last_name : '',
        ed_company_owner_email : '',
        ed_company_owner_address_1 : '',
        ed_company_owner_address_2 : '',
        ed_company_owner_pincode : '',
        ed_company_owner_city_name : '',
        ed_company_owner_state_name : '',
      });
      this.formeditTransfer.get("ed_policyholdertype").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_policyholdertype").updateValueAndValidity();

      this.formeditTransfer.get("ed_salutation").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_first_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(25)]);
      this.formeditTransfer.get("ed_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space), Validators.minLength(1), Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_last_name").setValidators([Validators.required,Validators.pattern(this.validation_for_character),Validators.minLength(1),Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_address1").setValidators([Validators.required,Validators.pattern(this.validation_for_address), this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]);
      this.formeditTransfer.get("ed_address1").updateValueAndValidity();

      this.formeditTransfer.get("ed_address2").setValidators([Validators.required,Validators.pattern(this.validation_for_address),this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]);
      this.formeditTransfer.get("ed_address2").updateValueAndValidity();

      this.formeditTransfer.get("ed_pincode").setValidators([Validators.required,Validators.min(1),Validators.pattern(this.validation_for_pincode)]);
      this.formeditTransfer.get("ed_pincode").updateValueAndValidity();

      this.formeditTransfer.get("ed_pincode_id").setValidators([]);
      this.formeditTransfer.get("ed_pincode_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_city_id").setValidators([]);
      this.formeditTransfer.get("ed_city_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_state_id").setValidators([]);
      this.formeditTransfer.get("ed_state_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_city").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_city").updateValueAndValidity();

      this.formeditTransfer.get("ed_state").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_state").updateValueAndValidity();

      this.formeditTransfer.get("ed_reg_no").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_reg_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_email").setValidators([Validators.required,Validators.pattern(this.validation_for_email)]);
      this.formeditTransfer.get("ed_email").updateValueAndValidity();

      this.formeditTransfer.get("ed_mobile").setValidators([Validators.required,Validators.pattern(this.validation_for_mobile_no)]);
      this.formeditTransfer.get("ed_mobile").updateValueAndValidity();

      this.formeditTransfer.get("ed_dob").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_dob").updateValueAndValidity();

      this.formeditTransfer.get("ed_gender").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_gender").updateValueAndValidity();

      this.formeditTransfer.get("ed_pan_no").setValidators([Validators.pattern(this.validation_for_pan)]);
      this.formeditTransfer.get("ed_pan_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_salutation").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_nominee_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_first_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_nominee_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space),Validators.minLength(1),Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_nominee_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_last_name").setValidators([Validators.required,Validators.pattern(this.validation_for_character),Validators.minLength(1),Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_nominee_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_relation").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_nominee_relation").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_age").setValidators([Validators.required,this.customvalidationService.nomineeAgeValidator(),Validators.pattern(this.validation_for_age)]);
      this.formeditTransfer.get("ed_nominee_age").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_salutation").setValidators([]);
      this.formeditTransfer.get("ed_appointee_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_first_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_middle_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_last_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_relation").setValidators([]);
      this.formeditTransfer.get("ed_appointee_relation").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_age").setValidators([]);
      this.formeditTransfer.get("ed_appointee_age").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_salutation").setValidators([]);
      this.formeditTransfer.get("ed_company_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_name").setValidators([]);
      this.formeditTransfer.get("ed_company_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_gst_no").setValidators([]);
      this.formeditTransfer.get("ed_company_gst_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_pan_no").setValidators([]);
      this.formeditTransfer.get("ed_company_pan_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_own_salutation").setValidators([]);
      this.formeditTransfer.get("ed_company_own_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_fisrt_name").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_fisrt_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_middle_name").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_last_name").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_email").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_email").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_mobile").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_mobile").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_address_1").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_address_1").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_address_2").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_address_2").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_pincode").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_pincode").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_city_name").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_city_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_state_name").setValidators([]);
      this.formeditTransfer.get("ed_company_owner_state_name").updateValueAndValidity();

      this.formeditTransfer.get("remark").setValidators([Validators.required]);
      this.formeditTransfer.get("remark").updateValueAndValidity();

      this.date_picker_dob =  this.setNullDate;
      this.formeditTransfer.patchValue({
        ed_company_salutation : '',
        ed_policyholdertype : 'Individual',
      });
    }
    else if(policy_holder_type=='Corporate')
    {
      this.formeditTransfer.patchValue({
        ed_salutation : '',
        ed_first_name : '',
        ed_middle_name : '',
        ed_last_name : '',
        ed_address1 : '',
        ed_address2 : '',
        ed_pincode : '',
        ed_pincode_id : '',
        ed_city_id : '',
        ed_state_id : '',
        ed_city : '',
        ed_state : '',
        ed_reg_no : '',
        ed_email : '',
        ed_mobile : '',
        ed_dob : '',
        ed_gender : '',
        ed_pan_no : '',
        ed_nominee_salutation : '',
        ed_nominee_first_name : '',
        ed_nominee_middle_name : '',
        ed_nominee_last_name : '',
        ed_nominee_relation : '',
        ed_nominee_age : '',
        ed_appointee_salutation : '',
        ed_appointee_first_name : '',
        ed_appointee_middle_name : '',
        ed_appointee_last_name : '',
        ed_appointee_relation : '',
        ed_appointee_age : '',
      });
      this.formeditTransfer.get("ed_policyholdertype").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_policyholdertype").updateValueAndValidity();

      this.formeditTransfer.get("ed_salutation").setValidators([]);
      this.formeditTransfer.get("ed_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_first_name").setValidators([]);
      this.formeditTransfer.get("ed_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_middle_name").setValidators([]);
      this.formeditTransfer.get("ed_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_last_name").setValidators([]);
      this.formeditTransfer.get("ed_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_address1").setValidators([]);
      this.formeditTransfer.get("ed_address1").updateValueAndValidity();

      this.formeditTransfer.get("ed_address2").setValidators([]);
      this.formeditTransfer.get("ed_address2").updateValueAndValidity();

      this.formeditTransfer.get("ed_pincode").setValidators([]);
      this.formeditTransfer.get("ed_pincode").updateValueAndValidity();

      this.formeditTransfer.get("ed_pincode_id").setValidators([]);
      this.formeditTransfer.get("ed_pincode_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_city_id").setValidators([]);
      this.formeditTransfer.get("ed_city_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_state_id").setValidators([]);
      this.formeditTransfer.get("ed_state_id").updateValueAndValidity();

      this.formeditTransfer.get("ed_city").setValidators([]);
      this.formeditTransfer.get("ed_city").updateValueAndValidity();

      this.formeditTransfer.get("ed_state").setValidators([]);
      this.formeditTransfer.get("ed_state").updateValueAndValidity();

      this.formeditTransfer.get("ed_reg_no").setValidators([]);
      this.formeditTransfer.get("ed_reg_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_email").setValidators([]);
      this.formeditTransfer.get("ed_email").updateValueAndValidity();

      this.formeditTransfer.get("ed_mobile").setValidators([]);
      this.formeditTransfer.get("ed_mobile").updateValueAndValidity();

      this.formeditTransfer.get("ed_dob").setValidators([]);
      this.formeditTransfer.get("ed_dob").updateValueAndValidity();

      this.formeditTransfer.get("ed_gender").setValidators([]);
      this.formeditTransfer.get("ed_gender").updateValueAndValidity();

      this.formeditTransfer.get("ed_pan_no").setValidators([]);
      this.formeditTransfer.get("ed_pan_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_salutation").setValidators([]);
      this.formeditTransfer.get("ed_nominee_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_first_name").setValidators([]);
      this.formeditTransfer.get("ed_nominee_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_middle_name").setValidators([]);
      this.formeditTransfer.get("ed_nominee_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_last_name").setValidators([]);
      this.formeditTransfer.get("ed_nominee_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_relation").setValidators([]);
      this.formeditTransfer.get("ed_nominee_relation").updateValueAndValidity();

      this.formeditTransfer.get("ed_nominee_age").setValidators([]);
      this.formeditTransfer.get("ed_nominee_age").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_salutation").setValidators([]);
      this.formeditTransfer.get("ed_appointee_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_first_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_first_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_middle_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_last_name").setValidators([]);
      this.formeditTransfer.get("ed_appointee_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_relation").setValidators([]);
      this.formeditTransfer.get("ed_appointee_relation").updateValueAndValidity();

      this.formeditTransfer.get("ed_appointee_age").setValidators([]);
      this.formeditTransfer.get("ed_appointee_age").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_salutation").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_company_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(25)]);
      this.formeditTransfer.get("ed_company_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_gst_no").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_company_gst_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_pan_no").setValidators([Validators.required,Validators.pattern(this.validation_for_company_pan)]);
      this.formeditTransfer.get("ed_company_pan_no").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_own_salutation").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_company_own_salutation").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_fisrt_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(2),Validators.maxLength(25)]);
      this.formeditTransfer.get("ed_company_owner_fisrt_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space), Validators.minLength(1), Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_company_owner_middle_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_last_name").setValidators([Validators.required,Validators.pattern(this.validation_for_character),Validators.minLength(1),Validators.maxLength(15)]);
      this.formeditTransfer.get("ed_company_owner_last_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_email").setValidators([Validators.required,Validators.pattern(this.validation_for_email)]);
      this.formeditTransfer.get("ed_company_owner_email").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_mobile").setValidators([Validators.required,Validators.pattern(this.validation_for_mobile_no)]);
      this.formeditTransfer.get("ed_company_owner_mobile").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_address_1").setValidators([Validators.required,Validators.pattern(this.validation_for_address), this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]);
      this.formeditTransfer.get("ed_company_owner_address_1").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_address_2").setValidators([Validators.required,Validators.pattern(this.validation_for_address),this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]);
      this.formeditTransfer.get("ed_company_owner_address_2").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_pincode").setValidators([Validators.required,Validators.min(1),Validators.pattern(this.validation_for_pincode)]);
      this.formeditTransfer.get("ed_company_owner_pincode").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_city_name").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_company_owner_city_name").updateValueAndValidity();

      this.formeditTransfer.get("ed_company_owner_state_name").setValidators([Validators.required]);
      this.formeditTransfer.get("ed_company_owner_state_name").updateValueAndValidity();

      this.formeditTransfer.get("remark").setValidators([Validators.required]);
      this.formeditTransfer.get("remark").updateValueAndValidity();


      this.formeditTransfer.patchValue({
        ed_company_salutation : 'M/s.',
        ed_policyholdertype : 'Corporate'
      });
    }
    else{
      this.formeditTransfer.patchValue({
        ed_company_salutation : '',
        ed_policyholdertype : ''
      });
    }
  }

  setFormDetails(result){
    this.registration_no = result.registration_no_part_1 + result.registration_no_part_2;

    if(result.registration_no_part_3!='' && result.registration_no_part_3!='0' && result.registration_no_part_3!=null && result.registration_no_part_3!=undefined){
      this.registration_no = this.registration_no + result.registration_no_part_3;
    }
    if(result.registration_no_part_4!='' && result.registration_no_part_4!='0' && result.registration_no_part_4!=null && result.registration_no_part_4!=undefined){
      this.registration_no = this.registration_no + result.registration_no_part_4;
    }

    this.formeditTransfer.patchValue({
      ed_reg_no : this.registration_no
    });

    if(result.proposer_type_id==1 || result.proposer_type_id=='1'){
      this.ex_policyholdertype = 'Individual';
      this.div_show_owner_details  = true;
      this.div_show_nominee_details = true;
      this.div_show_company_details = false;

      //this.nomineeRelationType('nominee',result.nominee_salutation_id);
      //this.nomineeRelationType('appointee',result.appointee_salutation_id);

      this.formeditTransfer.patchValue({
        ed_policyholdertype : 'Individual'
      });
      this.validationFormDetails('Individual');
    }
    else{
      this.ex_policyholdertype = 'Corporate';
      this.div_show_owner_details  = false;
      this.div_show_nominee_details = false;
      this.div_show_company_details = true;

      this.formeditTransfer.patchValue({
        ed_policyholdertype : 'Corporate'
      });
      this.validationFormDetails('Corporate');
    }

    this.ex_company_salutation = 'M/s.';
    this.ex_company_name = result.company_name;
    this.ex_company_gst_no = result.company_gst_no;
    this.ex_company_pan_no = result.company_pan_no;
    this.ex_company_own_salutation = result.company_own_salutation;
    this.ex_company_owner_fisrt_name =  result.company_owner_fisrt_name;
    this.ex_company_owner_middle_name =  result.company_owner_middle_name;
    this.ex_company_owner_last_name =  result.company_owner_last_name;
    this.ex_company_owner_email =  result.company_owner_email;
    this.ex_company_owner_mobile =  result.company_owner_mobile;
    this.ex_company_owner_address_1 =  result.company_owner_address_1;
    this.ex_company_owner_address_2 =  result.company_owner_address_2;
    this.ex_company_owner_pincode =  result.company_owner_pincode;
    this.ex_company_owner_city_name =  result.company_owner_city_name;
    this.ex_company_owner_state_name =  result.company_owner_state_name;

    this.ex_salutation = result.salutation_name;
    this.ex_first_name = result.proposer_first_name;
    this.ex_middle_name = result.proposer_middle_name;
    this.ex_last_name = result.proposer_last_name;
    this.ex_address1 = result.proposer_address1;
    this.ex_address2 = result.proposer_address2;
    this.ex_pincode = result.proposer_pincode;
    this.ex_city = result.proposer_city_name;
    this.ex_state = result.proposer_state_name;
    this.ex_reg_no = this.registration_no;
    this.ex_email = result.proposer_email;
    this.ex_mobile = result.proposer_mobile_no;
    this.ex_dob = result.proposer_dob;
    this.ex_gender = result.proposer_gender;
    this.ex_pan_no = result.proposer_pan_no;

    this.ex_nominee_salutation = result.nominee_salutation_name;
    this.ex_nominee_first_name = result.nominee_first_name;
    this.ex_nominee_middle_name = result.nominee_middle_name;
    this.ex_nominee_last_name = result.nominee_last_name;
    this.ex_nominee_relation = result.nominee_relation_name;
    this.ex_nominee_age = result.nominee_age;

    this.ex_appointee_salutation = result.appointee_salutation;
    this.ex_appointee_first_name = result.appointee_first_name;
    this.ex_appointee_middle_name = result.appointee_middle_name;
    this.ex_appointee_last_name = result.appointee_last_name;
    this.ex_appointee_relation = result.appointee_relation_name;
    if(result.appointee_age=='0' || result.appointee_age==0){
      this.ex_appointee_age = '';
    }
    else{
      this.ex_appointee_age = result.appointee_age;
    }

  }

  setInspectionImagesValidation(){
    /* this.formeditTransfer.get("noc_document").setValidators([Validators.required]);
    this.formeditTransfer.get("noc_document").updateValueAndValidity();

    this.formeditTransfer.get("invoice_rc_copy_document").setValidators([Validators.required]);
    this.formeditTransfer.get("invoice_rc_copy_document").updateValueAndValidity();

    this.formeditTransfer.get("form29_form30_document").setValidators([]);
    this.formeditTransfer.get("form29_form30_document").updateValueAndValidity();

    this.formeditTransfer.get("inpection_report_document").setValidators([Validators.required]);
    this.formeditTransfer.get("inpection_report_document").updateValueAndValidity();

    this.formeditTransfer.get("front_image_document").setValidators([Validators.required]);
    this.formeditTransfer.get("front_image_document").updateValueAndValidity();

    this.formeditTransfer.get("rear_image_document").setValidators([Validators.required]);
    this.formeditTransfer.get("rear_image_document").updateValueAndValidity();

    this.formeditTransfer.get("left_image_document").setValidators([Validators.required]);
    this.formeditTransfer.get("left_image_document").updateValueAndValidity();

    this.formeditTransfer.get("right_image_document").setValidators([Validators.required]);
    this.formeditTransfer.get("right_image_document").updateValueAndValidity();

    this.formeditTransfer.get("windscreen_inside_document").setValidators([Validators.required]);
    this.formeditTransfer.get("windscreen_inside_document").updateValueAndValidity();

    this.formeditTransfer.get("windscreen_outside_document").setValidators([Validators.required]);
    this.formeditTransfer.get("windscreen_outside_document").updateValueAndValidity();

    this.formeditTransfer.get("autometer_with_engine_on_document").setValidators([Validators.required]);
    this.formeditTransfer.get("autometer_with_engine_on_document").updateValueAndValidity();

    this.formeditTransfer.get("chassis_plate_print_document").setValidators([Validators.required]);
    this.formeditTransfer.get("chassis_plate_print_document").updateValueAndValidity();

    this.formeditTransfer.get("previous_insurance_copy_document").setValidators([]);
    this.formeditTransfer.get("previous_insurance_copy_document").updateValueAndValidity();

    this.formeditTransfer.get("dicky_open_document").setValidators([Validators.required]);
    this.formeditTransfer.get("dicky_open_document").updateValueAndValidity();

    this.formeditTransfer.get("selfie_with_vehicle_document").setValidators([]);
    this.formeditTransfer.get("selfie_with_vehicle_document").updateValueAndValidity(); */

  }

  resetInspectionImagesValidation(){
    this.formeditTransfer.get("noc_document").setValidators([]);
    this.formeditTransfer.get("noc_document").updateValueAndValidity();

    this.formeditTransfer.get("invoice_rc_copy_document").setValidators([]);
    this.formeditTransfer.get("invoice_rc_copy_document").updateValueAndValidity();

    this.formeditTransfer.get("form29_form30_document").setValidators([]);
    this.formeditTransfer.get("form29_form30_document").updateValueAndValidity();

    this.formeditTransfer.get("inpection_report_document").setValidators([]);
    this.formeditTransfer.get("inpection_report_document").updateValueAndValidity();

    this.formeditTransfer.get("front_image_document").setValidators([]);
    this.formeditTransfer.get("front_image_document").updateValueAndValidity();

    this.formeditTransfer.get("rear_image_document").setValidators([]);
    this.formeditTransfer.get("rear_image_document").updateValueAndValidity();

    this.formeditTransfer.get("left_image_document").setValidators([]);
    this.formeditTransfer.get("left_image_document").updateValueAndValidity();

    this.formeditTransfer.get("right_image_document").setValidators([]);
    this.formeditTransfer.get("right_image_document").updateValueAndValidity();

    this.formeditTransfer.get("windscreen_inside_document").setValidators([]);
    this.formeditTransfer.get("windscreen_inside_document").updateValueAndValidity();

    this.formeditTransfer.get("windscreen_outside_document").setValidators([]);
    this.formeditTransfer.get("windscreen_outside_document").updateValueAndValidity();

    this.formeditTransfer.get("autometer_with_engine_on_document").setValidators([]);
    this.formeditTransfer.get("autometer_with_engine_on_document").updateValueAndValidity();

    this.formeditTransfer.get("chassis_plate_print_document").setValidators([]);
    this.formeditTransfer.get("chassis_plate_print_document").updateValueAndValidity();

    this.formeditTransfer.get("previous_insurance_copy_document").setValidators([]);
    this.formeditTransfer.get("previous_insurance_copy_document").updateValueAndValidity();

    this.formeditTransfer.get("dicky_open_document").setValidators([]);
    this.formeditTransfer.get("dicky_open_document").updateValueAndValidity();

    this.formeditTransfer.get("selfie_with_vehicle_document").setValidators([]);
    this.formeditTransfer.get("selfie_with_vehicle_document").updateValueAndValidity();

    this.formeditTransfer.patchValue({
      noc_document : '',
      invoice_rc_copy_document : '',
      form29_form30_document : '',
      inpection_report_document : '',
      front_image_document : '',
      rear_image_document : '',
      left_image_document : '',
      right_image_document : '',
      windscreen_inside_document : '',
      windscreen_outside_document : '',
      autometer_with_engine_on_document : '',
      chassis_plate_print_document : '',
      previous_insurance_copy_document : '',
      dicky_open_document : '',
      selfie_with_vehicle_document : ''
    });

  }

  changeOwnerPincode(event){
    // var is_vallid :any = this.formeditTransfer.controls.ed_pincode.status;
    if(event.target.value.length == 6){
      this.formeditTransfer.patchValue({ ed_city : '', ed_state : ''});


      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('pin_code',event.target.value);
      this.commonService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;

        if(result.status){
          this.formeditTransfer.patchValue({
            ed_pincode_id : result.state_city.pincode_id,
            ed_city_id : result.state_city.city_id,
            ed_state_id : result.state_city.state_id,
            ed_city : result.state_city.cityname,
            ed_state   : result.state_city.statename
          });

        }else{
          Swal.fire(result.message, '', 'error');
          this.formeditTransfer.patchValue({
            ed_pincode_id : "",
            ed_city_id : "",
            ed_state_id : "",
            ed_city : "",
            ed_state   : ""
          });
        }

      });
    }
  }

  changeCompanyOwnerPincode(event){
    // var is_vallid :any = this.formeditTransfer.controls.ed_pincode.status;
    if(event.target.value.length == 6){
      this.formeditTransfer.patchValue({ ed_city : '', ed_state : ''});


      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('pin_code',event.target.value);
      this.commonService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;

        if(result.status){
          this.formeditTransfer.patchValue({
            ed_company_owner_city_name : result.state_city.cityname,
            ed_company_owner_state_name   : result.state_city.statename
          });

        }else{
          Swal.fire(result.message, '', 'error');
          this.formeditTransfer.patchValue({
            ed_company_owner_city_name : "",
            ed_company_owner_state_name   : ""
          });
        }

      });
    }
  }

  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    //alert(selected_date);
    this.formeditTransfer.patchValue({ ed_dob : selected_date });

  }

  nomineeAge(event){
    var event_new : any  =  parseInt(event);
    if(event_new < 18 ){
      this.div_show_for_appointee = false;
      this.setAppointValiation();
    }else{
      this.div_show_for_appointee = true;
      this.resetAppointValiation();
    }

  }

  setAppointValiation(){
    this.formeditTransfer.get("ed_appointee_salutation").setValidators([Validators.required]);
    this.formeditTransfer.get("ed_appointee_salutation").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_first_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formeditTransfer.get("ed_appointee_first_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space)]);
    this.formeditTransfer.get("ed_appointee_middle_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_character),
      Validators.minLength(1),
      Validators.maxLength(15)
    ]);
    this.formeditTransfer.get("ed_appointee_last_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_age").setValidators([this.customvalidationService.appointeeAgeValidator(),Validators.required,Validators.pattern(this.validation_for_age)]);
    this.formeditTransfer.get("ed_appointee_age").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_relation").setValidators([Validators.required]);
    this.formeditTransfer.get("ed_appointee_relation").updateValueAndValidity();

  }

  resetAppointValiation(){

    this.formeditTransfer.get("ed_appointee_salutation").setValidators([]);
    this.formeditTransfer.get("ed_appointee_salutation").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_first_name").setValidators([]);
    this.formeditTransfer.get("ed_appointee_first_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_middle_name").setValidators([]);
    this.formeditTransfer.get("ed_appointee_middle_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_last_name").setValidators([]);
    this.formeditTransfer.get("ed_appointee_last_name").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_age").setValidators([]);
    this.formeditTransfer.get("ed_appointee_age").updateValueAndValidity();

    this.formeditTransfer.get("ed_appointee_relation").setValidators([]);
    this.formeditTransfer.get("ed_appointee_relation").updateValueAndValidity();

    this.formeditTransfer.patchValue({
      ed_appointee_salutation : '',
      ed_appointee_first_name : '',
      ed_appointee_middle_name : '',
      ed_appointee_last_name : '',
      ed_appointee_age : '',
      ed_appointee_relation : ''
    });

  }

  ////NOC
  uploadNOCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.noc_url = "";
      this.noc_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.noc_url = "";
      this.noc_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.noc_url = event.target.result;
        }
      }
      else{
        this.noc_url = "assets/front/img/pdf-file.png";
      }

      this.noc_url_label = file.name;
      this.formeditTransfer.patchValue({
        'noc_document' : file
      });
    }
  }

  //// Invoice RC copy
  uploadInvoiceRCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.invoice_rc_copy_url = "";
      this.invoice_rc_copy_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.invoice_rc_copy_url = "";
      this.invoice_rc_copy_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.invoice_rc_copy_url = event.target.result;
        }
      }
      else{
        this.invoice_rc_copy_url = "assets/front/img/pdf-file.png";
      }

      this.invoice_rc_copy_url_label = file.name;
      this.formeditTransfer.patchValue({
        'invoice_rc_copy_document' : file
      });
    }
  }

  //// Form 29/ form 30 copy
  uploadForm29Form30copy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.form29_form30_url = "";
      this.form29_form30_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.form29_form30_url = "";
      this.form29_form30_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.form29_form30_url = event.target.result;
        }
      }
      else{
        this.form29_form30_url = "assets/front/img/pdf-file.png";
      }

      this.form29_form30_url_label = file.name;
      this.formeditTransfer.patchValue({
        'form29_form30_document' : file
      });
    }
  }

  //// inpection report copy
  uploadInpspectionReportcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.inpection_report_url = "";
      this.inpection_report_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.inpection_report_url = "";
      this.inpection_report_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.inpection_report_url = event.target.result;
        }
      }
      else{
        this.inpection_report_url = "assets/front/img/pdf-file.png";
      }

      this.inpection_report_url_label = file.name;
      this.formeditTransfer.patchValue({
        'inpection_report_document' : file
      });
    }
  }

  //// front image copy
  uploadFrontImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.front_image_url = "";
      this.front_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.front_image_url = "";
      this.front_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.front_image_url = event.target.result;
        }
      }
      else{
        this.front_image_url = "assets/front/img/pdf-file.png";
      }

      this.front_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'front_image_document' : file
      });
    }
  }

  //// rear image copy
  uploadRearImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rear_image_url = "";
      this.rear_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rear_image_url = "";
      this.rear_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.rear_image_url = event.target.result;
        }
      }
      else{
        this.rear_image_url = "assets/front/img/pdf-file.png";
      }

      this.rear_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'rear_image_document' : file
      });
    }
  }

  //// left_image copy
  uploadLeftImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.left_image_url = "";
      this.left_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.left_image_url = "";
      this.left_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.left_image_url = event.target.result;
        }
      }
      else{
        this.left_image_url = "assets/front/img/pdf-file.png";
      }

      this.left_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'left_image_document' : file
      });
    }
  }

  //// right_image copy
  uploadRightImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.right_image_url = "";
      this.right_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.right_image_url = "";
      this.right_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.right_image_url = event.target.result;
        }
      }
      else{
        this.right_image_url = "assets/front/img/pdf-file.png";
      }

      this.right_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'right_image_document' : file
      });
    }
  }

  //// windscreen_inside copy
  uploadWindscreenInsidecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_inside_url = "";
      this.windscreen_inside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_inside_url = "";
      this.windscreen_inside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.windscreen_inside_url = event.target.result;
        }
      }
      else{
        this.windscreen_inside_url = "assets/front/img/pdf-file.png";
      }

      this.windscreen_inside_url_label = file.name;
      this.formeditTransfer.patchValue({
        'windscreen_inside_document' : file
      });
    }
  }

  //// windscreen_outside copy
  uploadWindscreenOutsidecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_outside_url = "";
      this.windscreen_outside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_outside_url = "";
      this.windscreen_outside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.windscreen_outside_url = event.target.result;
        }
      }
      else{
        this.windscreen_outside_url = "assets/front/img/pdf-file.png";
      }

      this.windscreen_outside_url_label = file.name;
      this.formeditTransfer.patchValue({
        'windscreen_outside_document' : file
      });
    }
  }

  //// autometer_with_engine_on copy
  uploadAutometerWithEngineOncopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.autometer_with_engine_on_url = "";
      this.autometer_with_engine_on_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.autometer_with_engine_on_url = "";
      this.autometer_with_engine_on_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.autometer_with_engine_on_url = event.target.result;
        }
      }
      else{
        this.autometer_with_engine_on_url = "assets/front/img/pdf-file.png";
      }

      this.autometer_with_engine_on_url_label = file.name;
      this.formeditTransfer.patchValue({
        'autometer_with_engine_on_document' : file
      });
    }
  }

  //// chassis_plate_print copy
  uploadChassisPlatePrintcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.chassis_plate_print_url = "";
      this.chassis_plate_print_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.chassis_plate_print_url = "";
      this.chassis_plate_print_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.chassis_plate_print_url = event.target.result;
        }
      }
      else{
        this.chassis_plate_print_url = "assets/front/img/pdf-file.png";
      }

      this.chassis_plate_print_url_label = file.name;
      this.formeditTransfer.patchValue({
        'chassis_plate_print_document' : file
      });
    }
  }

  //// previous_insurance_copy copy
  uploadPreviousInsuranceCopycopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.previous_insurance_copy_url = "";
      this.previous_insurance_copy_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.previous_insurance_copy_url = "";
      this.previous_insurance_copy_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.previous_insurance_copy_url = event.target.result;
        }
      }
      else{
        this.previous_insurance_copy_url = "assets/front/img/pdf-file.png";
      }

      this.previous_insurance_copy_url_label = file.name;
      this.formeditTransfer.patchValue({
        'previous_insurance_copy_document' : file
      });
    }
  }

  //// dicky_open copy
  uploadDickyOpencopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.dicky_open_url = "";
      this.dicky_open_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.dicky_open_url = "";
      this.dicky_open_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.dicky_open_url = event.target.result;
        }
      }
      else{
        this.dicky_open_url = "assets/front/img/pdf-file.png";
      }

      this.dicky_open_url_label = file.name;
      this.formeditTransfer.patchValue({
        'dicky_open_document' : file
      });
    }
  }

  //// selfie_with_vehicle copy
  uploadSelfieWithVehiclecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.selfie_with_vehicle_url = "";
      this.selfie_with_vehicle_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.selfie_with_vehicle_url = "";
      this.selfie_with_vehicle_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.selfie_with_vehicle_url = event.target.result;
        }
      }
      else{
        this.selfie_with_vehicle_url = "assets/front/img/pdf-file.png";
      }

      this.selfie_with_vehicle_url_label = file.name;
      this.formeditTransfer.patchValue({
        'selfie_with_vehicle_document' : file
      });
    }
  }

  submitFormTransfer(){
    this.submittedTransferDetails = true;
    if(this.formeditTransfer.invalid){
      return;
    }

    console.log(this.result);

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.policy_id);
    uploadData.append('ic_id',this.ic_id);
    uploadData.append('product_type_id',this.product_type_id);

    uploadData.append('endorsement_item_id','23');

    uploadData.append('ed_policyholdertype',this.formeditTransfer.value.ed_policyholdertype);
    uploadData.append('ed_salutation',this.formeditTransfer.value.ed_salutation);
    uploadData.append('ed_first_name',this.formeditTransfer.value.ed_first_name);
    uploadData.append('ed_middle_name',this.formeditTransfer.value.ed_middle_name);
    uploadData.append('ed_last_name',this.formeditTransfer.value.ed_last_name);
    uploadData.append('ed_address1',this.formeditTransfer.value.ed_address1);
    uploadData.append('ed_address2',this.formeditTransfer.value.ed_address2);
    uploadData.append('ed_pincode',this.formeditTransfer.value.ed_pincode);
    uploadData.append('ed_city',this.formeditTransfer.value.ed_city);
    uploadData.append('ed_state',this.formeditTransfer.value.ed_state);
    uploadData.append('ed_reg_no',this.formeditTransfer.value.ed_reg_no);
    uploadData.append('ed_email',this.formeditTransfer.value.ed_email);
    uploadData.append('ed_mobile',this.formeditTransfer.value.ed_mobile);
    uploadData.append('ed_dob',this.formeditTransfer.value.ed_dob);
    uploadData.append('ed_gender',this.formeditTransfer.value.ed_gender);
    uploadData.append('ed_pan_no',this.formeditTransfer.value.ed_pan_no);
    uploadData.append('ed_nominee_salutation',this.formeditTransfer.value.ed_nominee_salutation);
    uploadData.append('ed_nominee_first_name',this.formeditTransfer.value.ed_nominee_first_name);
    uploadData.append('ed_nominee_middle_name',this.formeditTransfer.value.ed_nominee_middle_name);
    uploadData.append('ed_nominee_last_name',this.formeditTransfer.value.ed_nominee_last_name);
    uploadData.append('ed_nominee_relation',this.formeditTransfer.value.ed_nominee_relation);
    uploadData.append('ed_nominee_age',this.formeditTransfer.value.ed_nominee_age);
    uploadData.append('ed_appointee_salutation',this.formeditTransfer.value.ed_appointee_salutation);
    uploadData.append('ed_appointee_first_name',this.formeditTransfer.value.ed_appointee_first_name);
    uploadData.append('ed_appointee_middle_name',this.formeditTransfer.value.ed_appointee_middle_name);
    uploadData.append('ed_appointee_last_name',this.formeditTransfer.value.ed_appointee_last_name);
    uploadData.append('ed_appointee_relation',this.formeditTransfer.value.ed_appointee_relation);
    uploadData.append('ed_appointee_age',this.formeditTransfer.value.ed_appointee_age);
    uploadData.append('ed_company_salutation',this.formeditTransfer.value.ed_company_salutation);
    uploadData.append('ed_company_name',this.formeditTransfer.value.ed_company_name);
    uploadData.append('ed_company_gst_no',this.formeditTransfer.value.ed_company_gst_no);
    uploadData.append('ed_company_pan_no',this.formeditTransfer.value.ed_company_pan_no);
    uploadData.append('ed_company_own_salutation',this.formeditTransfer.value.ed_company_own_salutation);
    uploadData.append('ed_company_owner_fisrt_name',this.formeditTransfer.value.ed_company_owner_fisrt_name);
    uploadData.append('ed_company_owner_middle_name',this.formeditTransfer.value.ed_company_owner_middle_name);
    uploadData.append('ed_company_owner_last_name',this.formeditTransfer.value.ed_company_owner_last_name);
    uploadData.append('ed_company_owner_email',this.formeditTransfer.value.ed_company_owner_email);
    uploadData.append('ed_company_owner_mobile',this.formeditTransfer.value.ed_company_owner_mobile);
    uploadData.append('ed_company_owner_address_1',this.formeditTransfer.value.ed_company_owner_address_1);
    uploadData.append('ed_company_owner_address_2',this.formeditTransfer.value.ed_company_owner_address_2);
    uploadData.append('ed_company_owner_pincode',this.formeditTransfer.value.ed_company_owner_pincode);
    uploadData.append('ed_company_owner_city_name',this.formeditTransfer.value.ed_company_owner_city_name);
    uploadData.append('ed_company_owner_state_name',this.formeditTransfer.value.ed_company_owner_state_name);

    uploadData.append('ex_policyholdertype',this.ex_policyholdertype);
    uploadData.append('ex_salutation',this.ex_salutation);
    uploadData.append('ex_first_name',this.ex_first_name);
    uploadData.append('ex_middle_name',this.ex_middle_name);
    uploadData.append('ex_last_name',this.ex_last_name);
    uploadData.append('ex_address1',this.ex_address1);
    uploadData.append('ex_address2',this.ex_address2);
    uploadData.append('ex_pincode',this.ex_pincode);
    uploadData.append('ex_city',this.ex_city);
    uploadData.append('ex_state',this.ex_state);
    uploadData.append('ex_reg_no',this.ex_reg_no);
    uploadData.append('ex_email',this.ex_email);
    uploadData.append('ex_mobile',this.ex_mobile);
    uploadData.append('ex_dob',this.ex_dob);
    uploadData.append('ex_gender',this.ex_gender);
    uploadData.append('ex_pan_no',this.ex_pan_no);
    uploadData.append('ex_nominee_salutation',this.ex_nominee_salutation);
    uploadData.append('ex_nominee_first_name',this.ex_nominee_first_name);
    uploadData.append('ex_nominee_middle_name',this.ex_nominee_middle_name);
    uploadData.append('ex_nominee_last_name',this.ex_nominee_last_name);
    uploadData.append('ex_nominee_relation',this.ex_nominee_relation);
    uploadData.append('ex_nominee_age',this.ex_nominee_age);
    uploadData.append('ex_appointee_salutation',this.ex_appointee_salutation);
    uploadData.append('ex_appointee_first_name',this.ex_appointee_first_name);
    uploadData.append('ex_appointee_middle_name',this.ex_appointee_middle_name);
    uploadData.append('ex_appointee_last_name',this.ex_appointee_last_name);
    uploadData.append('ex_appointee_relation',this.ex_appointee_relation);
    uploadData.append('ex_appointee_age',this.ex_appointee_age);
    uploadData.append('ex_company_salutation',this.ex_company_salutation);
    uploadData.append('ex_company_name',this.ex_company_name);
    uploadData.append('ex_company_gst_no',this.ex_company_gst_no);
    uploadData.append('ex_company_pan_no',this.ex_company_pan_no);
    uploadData.append('ex_company_own_salutation',this.ex_company_own_salutation);
    uploadData.append('ex_company_owner_fisrt_name',this.ex_company_owner_fisrt_name);
    uploadData.append('ex_company_owner_middle_name',this.ex_company_owner_middle_name);
    uploadData.append('ex_company_owner_last_name',this.ex_company_owner_last_name);
    uploadData.append('ex_company_owner_email',this.ex_company_owner_email);
    uploadData.append('ex_company_owner_mobile',this.ex_company_owner_mobile);
    uploadData.append('ex_company_owner_address_1',this.ex_company_owner_address_1);
    uploadData.append('ex_company_owner_address_2',this.ex_company_owner_address_2);
    uploadData.append('ex_company_owner_pincode',this.ex_company_owner_pincode);
    uploadData.append('ex_company_owner_city_name',this.ex_company_owner_city_name);
    uploadData.append('ex_company_owner_state_name',this.ex_company_owner_state_name);

    uploadData.append('ncb_recover_amount',this.ncb_recover_amount);
    uploadData.append('endorsement_fees',this.endorsement_fees);
    uploadData.append('endorsement_fees_gst',this.total_gst_fees);
    uploadData.append('total_endorsement_fees',this.total_endorsement_fees);
    uploadData.append('total_endorsement_charges',this.total_endorsement_charges);

    uploadData.append('isRefund','0');

    uploadData.append('noc_document',this.formeditTransfer.value.noc_document);
    uploadData.append('invoice_rc_copy_document',this.formeditTransfer.value.invoice_rc_copy_document);
    uploadData.append('form29_form30_document',this.formeditTransfer.value.form29_form30_document);
    uploadData.append('inpection_report_document',this.formeditTransfer.value.inpection_report_document);
    uploadData.append('front_image_document',this.formeditTransfer.value.front_image_document);
    uploadData.append('rear_image_document',this.formeditTransfer.value.rear_image_document);
    uploadData.append('left_image_document',this.formeditTransfer.value.left_image_document);
    uploadData.append('right_image_document',this.formeditTransfer.value.right_image_document);
    uploadData.append('windscreen_inside_document',this.formeditTransfer.value.windscreen_inside_document);
    uploadData.append('windscreen_outside_document',this.formeditTransfer.value.windscreen_outside_document);
    uploadData.append('autometer_with_engine_on_document',this.formeditTransfer.value.autometer_with_engine_on_document);
    uploadData.append('chassis_plate_print_document',this.formeditTransfer.value.chassis_plate_print_document);
    uploadData.append('previous_insurance_copy_document',this.formeditTransfer.value.previous_insurance_copy_document);
    uploadData.append('dicky_open_document',this.formeditTransfer.value.dicky_open_document);
    uploadData.append('selfie_with_vehicle_document',this.formeditTransfer.value.selfie_with_vehicle_document);

    uploadData.append('remark',this.formeditTransfer.value.remark);

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
}
