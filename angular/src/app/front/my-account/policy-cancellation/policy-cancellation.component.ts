import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { fileExtensionValidator } from './file-extension-validator.directive';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";
import {NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-policy-cancellation',
  templateUrl: './policy-cancellation.component.html',
  styleUrls: ['./policy-cancellation.component.css']
})
export class PolicycancellationComponent implements OnInit {

  loaderActive : boolean =  false;
  outputResult : any;
  public_path :any;

  UploadValue: boolean = false;
  fileChangeFunCalled: boolean = false;

  date_picker_dob: NgbDateStruct;

  div_show_endorsement_new : boolean = false;
  div_show_endorsement_status : boolean = true;
  div_show_endorsement_referback : boolean = true;

  acceptedExtensions = "jpg, jpeg, pdf";


  validation_for_number_only :any = "^[0-9]*$";
  validation_for_engine_no :any = "^([a-zA-Z0-9_-]){5,22}$";
  validation_for_chassis_no :any = "^([a-zA-Z0-9_-]){17}$";
  validation_for_policy_no :any = "^([a-zA-Z0-9-/\/])+$";
  validation_for_electriacal :any = "^[0-9]{3,6}$";
  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_pincode :any =  "^[0-9]{6}$";
  validation_for_name_with_space :any = "^[a-zA-Z_ ]*$";
  validation_for_character :any = "^[a-zA-Z\'\-]+$";
  validation_for_email :any = "^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$";
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  validation_for_address :any = "^[a-zA-Z0-9_ ]*$";
  validation_for_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_aadhar_card :any = "^[0-9]{12}$";
  validation_for_age :any = "^[0-9]{1,2}$";
  validation_for_company_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_company_gst_no :any = "^[a-zA-Z0-9]+$";


  //Same Day
  formSameDayCancel: FormGroup;
  submittedSameDayPolicy: boolean = false
  sub_reason_id:any;
  customerletterurl_sameday:any;
  same_daypolicyurl:any;
  same_day_policy_refund_amount : any;

  //Duplicate
  formDoublePolicy: FormGroup;
  submittedDoublePolicy: boolean = false
  customerletterurl1:any;
  duplicatepolicyurl:any;
  customerletterurl : any;

  double_policy_refund_amount : any;
  double_policy_od_deduct : any;
  double_policy_tp_deduct : any;
  double_policy_gst_deduct : any;
  double_policy_total_deduct : any;
  double_policy_cancellation_charge : any;
  double_policy_cancellation_charge_gst : any;
  double_policy_cancellation_charge_total : any;

  is_double_policy_refund_show : boolean = false;

  date_picker_double_policy_start_date: NgbDateStruct;

  //Other
  formOtherReason: FormGroup;
  submittedOtherReasonPolicy: boolean = false
  customerletterotherurl:any;
  otherreasonpolicyurl:any;

  other_policy_refund_amount : any;
  other_policy_od_deduct : any;
  other_policy_tp_deduct : any;
  other_policy_gst_deduct : any;
  other_policy_total_deduct : any;
  other_policy_cancellation_charge : any;
  other_policy_cancellation_charge_gst : any;
  other_policy_cancellation_charge_total : any;

  is_other_policy_refund_show : boolean = false;
duplicate_policy:any;  

  result : any;
  policy_no : any;
  reasonData : any;

  date_picker_pre_policy_expire_date : NgbDateStruct;

  customerletterurl1_label :any = "Choose a file…";
  otherreasonpolicyurl_label :any = "Choose a file…";
  customerletterotherurl_label :any = "Choose a file…";
  customerletterurl_label :any = "Choose a file…";
  duplicatepolicyurl_label :any = "Choose a file…";
  customerletterurl_sameday_label :any = "Choose a file…";
  same_daypolicyurl_label :any = "Choose a file…";

  minDate = undefined;
  curr_date : any;

  sameDayPolicyAvailable : boolean = false;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;

  gross_premium : any;
  curr_policy_no : any;
  curr_policy_risk_start_date : any;
  curr_policy_risk_end_date : any;

  total_basic_od : any;
  net_liability_premium_b : any;
  gross_premium_without_gst : any;
  service_tax : any;

  bankDetailsData : any;
  customerlett: any;
  policy_cancellation_id :any;

othercustomerlett:any;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {
  	 const current = new Date();
      this.minDate = {
        year: current.getFullYear()-18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
  }

  ngOnInit(): void {
      //alert('inn');
      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');
      this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.getPolicyCancellationSubReasonId();
      this.policy_no = sessionStorage.getItem('policy_no');
      this.validationFormSameDayPolicy();
      this.validationSubmitFormDoublePolicy();
      this.validationSubmitFormOther();

      this.getPolicyDetails(this.policy_no);
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

  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    if(field == 'double_policy_start_date'){
      //alert(selected_date);
      this.formDoublePolicy.patchValue({ double_policy_start_date : selected_date });
    }

    this.getDoublePolicyRefundAmount(selected_date);
  }

  getDoublePolicyRefundAmount(double_policy_risk_start_date){
    var sendData = new FormData();
    sendData.append('policy_no',this.policy_no);
    sendData.append('double_policy_risk_start_date',double_policy_risk_start_date);
    this.loaderActive = true;
    this.commonService.getDoublePolicyRefundAmount(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result_refund_details : any  = response;
        if(result_refund_details.status){
          this.double_policy_od_deduct = result_refund_details.refund_array.od_deduct;
          this.double_policy_tp_deduct = result_refund_details.refund_array.tp_deduct;
          this.double_policy_gst_deduct = result_refund_details.refund_array.gst_deduct;
          this.double_policy_total_deduct = result_refund_details.refund_array.total_deduct;
          this.double_policy_cancellation_charge = result_refund_details.refund_array.cancellation_charge;
          this.double_policy_cancellation_charge_gst = result_refund_details.refund_array.cancellation_charge_gst;
          this.double_policy_cancellation_charge_total = result_refund_details.refund_array.cancellation_charge_total;
          this.double_policy_refund_amount = result_refund_details.refund_array.refund_amount;
          this.is_double_policy_refund_show = true;
        }
        else{
          this.double_policy_refund_amount = 0;
          this.is_double_policy_refund_show = false;
          Swal.fire (result_refund_details.message,  "" ,  "error" );
        }
      });
  }

  getOtherPolicyRefundAmount(event){

    if(event.target.value != ''){
      var sendData = new FormData();
      sendData.append('policy_no',this.policy_no);
      sendData.append('is_vehicle_delivered',event.target.value);
      this.loaderActive = true;
      this.commonService.getOtherPolicyRefundAmount(sendData)
        .subscribe(response => {
          this.loaderActive = false;
          var result_refund_details : any  = response;
          if(result_refund_details.status){

            this.other_policy_od_deduct = result_refund_details.refund_array.od_deduct;
            this.other_policy_tp_deduct = result_refund_details.refund_array.tp_deduct;
            this.other_policy_gst_deduct = result_refund_details.refund_array.gst_deduct;
            this.other_policy_total_deduct = result_refund_details.refund_array.total_deduct;
            this.other_policy_cancellation_charge = result_refund_details.refund_array.cancellation_charge;
            this.other_policy_cancellation_charge_gst = result_refund_details.refund_array.cancellation_charge_gst;
            this.other_policy_cancellation_charge_total = result_refund_details.refund_array.cancellation_charge_total;
            this.other_policy_refund_amount = result_refund_details.refund_array.refund_amount;
            this.is_other_policy_refund_show = true;
          }
          else{
            this.other_policy_refund_amount = 0;
            this.is_other_policy_refund_show = false;
            Swal.fire (result_refund_details.message,  "" ,  "error" );
          }
        });
    }
    else{
      this.other_policy_refund_amount = 0;
      this.is_other_policy_refund_show = false;
    }

  }

  validationFormSameDayPolicy(){
    this.formSameDayCancel = this.formBuilder.group({
       customer_Letter_SameDay : [''],
       dealer_letter : ['',[Validators.required]],
       remark_name_sameday : ['',[Validators.required]],
       sub_reason_id : ['',[Validators.required]],
       refund_to : ['',[Validators.required]],
       refund_payee_account_name : ['',[Validators.required]],
       refund_payee_account_no : ['',[Validators.required]],
       refund_payee_bank_ifsc_code : ['',[Validators.required]],
       refund_payee_bank_branch : ['',[Validators.required]],
       refund_payee_bank_name : ['',[Validators.required]]
    });
  }

  validationSubmitFormDoublePolicy(){
    this.formDoublePolicy = this.formBuilder.group({
      customerLetter : ['',[Validators.required]],
      double_policy : ['',[Validators.required]],
      remark_name_duplicate : ['',[Validators.required]],
      double_policy_no : ['',[Validators.required,Validators.min(1),Validators.minLength(5), Validators.maxLength(25),Validators.pattern(this.validation_for_policy_no)]],
      double_policy_start_date : ['',[Validators.required]],
      double_policy_refund_to : ['',[Validators.required]],
      double_policy_refund_payee_account_name : ['',[Validators.required]],
      double_policy_refund_payee_account_no : ['',[Validators.required]],
      double_policy_refund_payee_bank_ifsc_code : ['',[Validators.required]],
      double_policy_refund_payee_bank_branch : ['',[Validators.required]],
      double_policy_refund_payee_bank_name : ['',[Validators.required]]
    });
  }

  validationSubmitFormOther(){
    this.formOtherReason = this.formBuilder.group({
      is_vehicle_delivered : ['',[Validators.required]],
      customerLetterOther : ['',[Validators.required]],
      remark_name_other : ['',[Validators.required]],
      other_reason_refund_to : ['',[Validators.required]],
      other_reason_refund_payee_account_name : ['',[Validators.required]],
      other_reason_refund_payee_account_no : ['',[Validators.required]],
      other_reason_refund_payee_bank_ifsc_code : ['',[Validators.required]],
      other_reason_refund_payee_bank_branch : ['',[Validators.required]],
      other_reason_refund_payee_bank_name : ['',[Validators.required]]
    });
  }

  getPolicyCancellationSubReasonId(){
    //alert('inn');
    this.commonService.getPolicyCancellationSubReasonData()
    .subscribe(response => {
        this.outputResult = response;
        if(this.outputResult.status){
          this.reasonData = this.outputResult.result;
          console.log(".........."+this.reasonData);
        }
    });
  }

  getPolicyDetails(policy_no){
    let uploadData = new FormData();
    uploadData.append('policy_no',policy_no);

    this.commonService.getCancelPolicyDetailsForm(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        this.outputResult = response;
        if(this.outputResult.status){

          var policy_created_at = this.outputResult.policy_created_at;
          const current = new Date();

          this.curr_date = [
            current.getFullYear(),
            ('0' + (current.getMonth() + 1)).slice(-2),
            ('0' + current.getDate()).slice(-2)
          ].join('-');

          if(this.curr_date==policy_created_at){
            this.sameDayPolicyAvailable = true;
          }
          else{
            this.sameDayPolicyAvailable = false;
          }
          this.policy_cancellation_id='';

          this.gross_premium = this.outputResult.policy_details.gross_premium;
          this.curr_policy_no = this.outputResult.policy_details.policy_no;
          this.curr_policy_risk_start_date = this.outputResult.policy_details.policy_start_date;
          this.curr_policy_risk_end_date = this.outputResult.policy_details.policy_end_date;
         // this.total_basic_od = this.outputResult.policy_details.total_basic_od;
          this.total_basic_od = this.outputResult.policy_details.net_od_premium;
          this.net_liability_premium_b = this.outputResult.policy_details.net_liability_premium_b;
          this.gross_premium_without_gst = this.outputResult.policy_details.gross_premium_without_gst;
          this.service_tax = this.outputResult.policy_details.service_tax;
          if(this.outputResult.double_policy_array!=''){
            this.policy_cancellation_id = this.outputResult.double_policy_array.policy_cancellation_id;
            //alert(this.outputResult.double_policy_array.double_policy_no);
          if(this.outputResult.double_policy_array.double_policy_no!=null )
          {
             this.formDoublePolicy.patchValue({
              double_policy_no: this.outputResult.double_policy_array.double_policy_no,
             });
             this.selectDate('double_policy_start_date',this.outputResult.double_policy_array.double_policy_start_date);
             this.selectDateForAngular(this.outputResult.double_policy_array.double_policy_start_date);
             this.public_path = this.outputResult.public_path;
             this.customerlett =this.outputResult.double_policy_array.customer_letter;
             this.customerletterurl1=this.public_path+'cancel_policy/customerletter/'+this.outputResult.double_policy_array.customer_letter;
             this.formDoublePolicy.patchValue({
              customerLetter:this.outputResult.double_policy_array.customer_letter
             });
             this.public_path = this.outputResult.public_path;
             this.duplicate_policy =this.outputResult.double_policy_array.duplicate_policy;
            this.duplicatepolicyurl=this.public_path+'cancel_policy/duplicate_policy/'+this.outputResult.double_policy_array.duplicate_policy;
             this.formDoublePolicy.patchValue({
              double_policy:this.outputResult.double_policy_array.duplicate_policy
             });
             this.formDoublePolicy.patchValue({
              remark_name_duplicate:this.outputResult.double_policy_array.application_cancellation_remark
             });
              this.formDoublePolicy.patchValue({
              double_policy_refund_payee_account_name:this.outputResult.double_policy_array.refund_payee_account_name
             });
              this.formDoublePolicy.patchValue({
              double_policy_refund_payee_account_no:this.outputResult.double_policy_array.refund_payee_account_no
             });
            this.formDoublePolicy.patchValue({
                          double_policy_refund_payee_bank_ifsc_code:this.outputResult.double_policy_array.refund_payee_bank_ifsc_code
                         });
            this.formDoublePolicy.patchValue({
                          double_policy_refund_payee_bank_branch:this.outputResult.double_policy_array.refund_payee_bank_branch
                         });
            this.formDoublePolicy.patchValue({
              double_policy_refund_payee_bank_name:this.outputResult.double_policy_array.refund_payee_bank_name
             });
            this.formDoublePolicy.patchValue({
              double_policy_refund_to:this.outputResult.double_policy_array.refund_to
             });
          }else
          {
            this.formOtherReason.patchValue({
              is_vehicle_delivered:this.outputResult.double_policy_array.is_vehicle_delivered
            })
            this.public_path = this.outputResult.public_path;
             this.othercustomerlett =this.outputResult.double_policy_array.customer_letter;
             this.customerletterotherurl_label=this.public_path+'cancel_policy/customerletter/'+this.outputResult.double_policy_array.customer_letter;
            this.formOtherReason.patchValue({
              customerLetterOther:this.outputResult.double_policy_array.customer_letter
            })
            this.formOtherReason.patchValue({
              remark_name_other:this.outputResult.double_policy_array.application_cancellation_remark
            })
            
          this.formOtherReason.patchValue({
              //remark_name_other:this.outputResult.double_policy_array.application_cancellation_remark,
              other_reason_refund_to:this.outputResult.double_policy_array.refund_to,
              other_reason_refund_payee_account_name:this.outputResult.double_policy_array.refund_payee_account_name,
              other_reason_refund_payee_account_no:this.outputResult.double_policy_array.refund_payee_account_no,
              other_reason_refund_payee_bank_ifsc_code:this.outputResult.double_policy_array.refund_payee_bank_ifsc_code,
              other_reason_refund_payee_bank_branch:this.outputResult.double_policy_array.refund_payee_bank_branch,
              other_reason_refund_payee_bank_name:this.outputResult.double_policy_array.refund_payee_bank_name
            })
            
          }
          
        }
          //same day policy refund amount
          this.same_day_policy_refund_amount = this.gross_premium;
          /*alert(this.gross_premium);
          alert(this.same_day_policy_refund_amount);*/
        }
        else{
          this.sameDayPolicyAvailable = false;
        }
    });
  }

selectDateForAngular(selected_date){
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
      this.date_picker_double_policy_start_date=set_date;
      this.formDoublePolicy.patchValue({
              double_policy_start_date:selected_date_for_form
             });
      /*if(field == 'pr_date'){
        if(selected_date != ''){
          this.purchaseDateCondition(selected_date);
        }
        if(selected_date_for_form != '1970-01-01'){
          this.date_picker_date_picker_pr_date = set_date;
          this.formQuoteDetails.patchValue({ pr_date : selected_date_for_form });
        }*/

  }


  submitFormSameDayPolicy(){
    this.submittedSameDayPolicy = true;
    if(this.formSameDayCancel.invalid){
      return;
    }
    this.loaderActive = true;
    
    let uploadData = new FormData();
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('cancellation_reason_id','1');

    uploadData.append('sub_reason_id',this.formSameDayCancel.value.sub_reason_id);
    uploadData.append('is_vehicle_delivered','');
    uploadData.append('dealer_letter',this.formSameDayCancel.value.dealer_letter);
    uploadData.append('customerletter',this.formSameDayCancel.value.customer_Letter_SameDay);
    uploadData.append('application_refund_amount',this.same_day_policy_refund_amount);
    uploadData.append('remark_name',this.formSameDayCancel.value.remark_name_sameday);

    uploadData.append('refund_to',this.formSameDayCancel.value.refund_to);
    uploadData.append('refund_payee_account_name',this.formSameDayCancel.value.refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formSameDayCancel.value.refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formSameDayCancel.value.refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formSameDayCancel.value.refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formSameDayCancel.value.refund_payee_bank_branch);

    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_cancellation_id',this.policy_cancellation_id);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormCancelPolicy(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        this.outputResult = response;
        if(this.outputResult.status){

          Swal.fire({
            title: '',
            html: 'Policy Cancellation Application Successfuly Submitted.',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/cancellation');
          })
        }else{
          Swal.fire (this.outputResult.msg,  "" ,  "error" );
        }
    });
  }

  submitformDoublePolicy(){
    this.submittedDoublePolicy = true;
    if(this.formDoublePolicy.invalid){
      return;
    }
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('cancellation_reason_id','2');
    uploadData.append('sub_reason_id','');
    uploadData.append('is_vehicle_delivered','');
    uploadData.append('duplicate_policy',this.formDoublePolicy.value.double_policy);
    uploadData.append('customerletter',this.formDoublePolicy.value.customerLetter);
    uploadData.append('application_refund_amount',this.double_policy_refund_amount);
    uploadData.append('remark_name',this.formDoublePolicy.value.remark_name_duplicate);
    uploadData.append('double_policy_no',this.formDoublePolicy.value.double_policy_no);
    uploadData.append('double_policy_start_date',this.formDoublePolicy.value.double_policy_start_date);

    uploadData.append('refund_to',this.formDoublePolicy.value.double_policy_refund_to);
    uploadData.append('refund_payee_account_name',this.formDoublePolicy.value.double_policy_refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formDoublePolicy.value.double_policy_refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formDoublePolicy.value.double_policy_refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formDoublePolicy.value.double_policy_refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formDoublePolicy.value.double_policy_refund_payee_bank_branch)

    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_cancellation_id',this.policy_cancellation_id);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormCancelPolicy(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        this.outputResult = response;
        if(this.outputResult.status){
           Swal.fire({
            title: '',
            html: 'Policy Cancellation Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/cancellation');
          })
        }else{
          Swal.fire (this.outputResult.msg,  "" ,  "error" );
        }
    });
  }

  ////same day cancellation
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
          this.formSameDayCancel.patchValue({
            refund_payee_bank_branch : this.bankDetailsData.result.branch,
            refund_payee_bank_name :this.bankDetailsData.result.bank
          });

        }else{
          this.formSameDayCancel.patchValue({
            refund_payee_bank_branch : '',
            refund_payee_bank_name :''

          });

          Swal.fire (this.bankDetailsData.message,  "" ,  "error" );
        }

      });

    }
  }

  ////double policy cancellation
  getBankDetails1(ifsccode){

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
          this.formDoublePolicy.patchValue({
            double_policy_refund_payee_bank_branch : this.bankDetailsData.result.branch,
            double_policy_refund_payee_bank_name :this.bankDetailsData.result.bank
          });

        }else{
          this.formDoublePolicy.patchValue({
            double_policy_refund_payee_bank_branch : '',
            double_policy_refund_payee_bank_name :''

          });

          Swal.fire (this.bankDetailsData.message,  "" ,  "error" );
        }

      });

    }
  }

  ////other policy cancellation
  getBankDetails2(ifsccode){

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
          this.formOtherReason.patchValue({
            other_reason_refund_payee_bank_branch : this.bankDetailsData.result.branch,
            other_reason_refund_payee_bank_name :this.bankDetailsData.result.bank
          });

        }else{
          this.formOtherReason.patchValue({
            other_reason_refund_payee_bank_branch : '',
            other_reason_refund_payee_bank_name :''

          });

          Swal.fire (this.bankDetailsData.message,  "" ,  "error" );
        }

      });

    }
  }

  submitformOtherReason(){
    this.submittedOtherReasonPolicy = true;
    if(this.formOtherReason.invalid){
      return;
    }
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('cancellation_reason_id','3');
    uploadData.append('sub_reason_id','');
    uploadData.append('is_vehicle_delivered',this.formOtherReason.value.is_vehicle_delivered);
    uploadData.append('customerletter',this.formOtherReason.value.customerLetterOther);
    uploadData.append('application_refund_amount',this.other_policy_refund_amount);
    uploadData.append('remark_name',this.formOtherReason.value.remark_name_other);

    uploadData.append('refund_to',this.formOtherReason.value.other_reason_refund_to);
    uploadData.append('refund_payee_account_name',this.formOtherReason.value.other_reason_refund_payee_account_name);
    uploadData.append('refund_payee_account_no',this.formOtherReason.value.other_reason_refund_payee_account_no);
    uploadData.append('refund_payee_bank_ifsc_code',this.formOtherReason.value.other_reason_refund_payee_bank_ifsc_code);
    uploadData.append('refund_payee_bank_name',this.formOtherReason.value.other_reason_refund_payee_bank_name);
    uploadData.append('refund_payee_bank_branch',this.formOtherReason.value.other_reason_refund_payee_bank_branch)

    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_cancellation_id',this.policy_cancellation_id);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormCancelPolicy(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        this.outputResult = response;
        if(this.outputResult.status){

          Swal.fire({
            title: '',
            html: 'Policy Cancellation Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/cancellation');
          })
        }else{
          Swal.fire (this.outputResult.msg,  "" ,  "error" );
        }
    });
  }

  uploadSameDayPolicy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.same_daypolicyurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.same_daypolicyurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.same_daypolicyurl = event.target.result;
      }
      this.same_daypolicyurl_label = file.name;
      this.formSameDayCancel.patchValue({
        'dealer_letter' : file
      });
    }


  }

  uploadConfirmLetterSameDayCopyNew(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterurl_sameday = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterurl_sameday = "";
    }else{

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterurl_sameday = event.target.result;
      }
      this.customerletterurl_sameday_label = file.name;
      this.formSameDayCancel.patchValue({
        'customer_Letter_SameDay' : file
      });


    }


  }

  uploadConfirmLetterDuplicateCopyNew(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterurl1 = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterurl1 = "";
    }else{

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterurl1 = event.target.result;
      }
      this.customerletterurl1_label = file.name;
      this.formDoublePolicy.patchValue({
        'customerLetter' : file
      });


    }


  }


  uploadConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterurl = "";
    }else{

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterurl = event.target.result;
      }
      this.customerletterurl_label = file.name;
      this.formSameDayCancel.patchValue({
        'customerletter' : file
      });
    }


  }

  uploadDuplicatePolicy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.duplicatepolicyurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.duplicatepolicyurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.duplicatepolicyurl = event.target.result;
      }
      this.duplicatepolicyurl_label = file.name;
      this.formDoublePolicy.patchValue({
        'double_policy' : file
      });
    }


  }




  uploadOtherReasonCopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.otherreasonpolicyurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.otherreasonpolicyurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.otherreasonpolicyurl = event.target.result;
      }
      this.otherreasonpolicyurl_label = file.name;
      this.formOtherReason.patchValue({
        'otherReasonPolicy' : file
      });
    }


  }



  uploadConfirmLetterOtherCopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterotherurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterotherurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterotherurl = event.target.result;
      }
      console.log("uploadConfirmLetterOtherCopy "+this.customerletterotherurl);
      this.customerletterotherurl_label = file.name;
      this.formOtherReason.patchValue({
        'customerLetterOther' : file
      });
    }


  }



}
