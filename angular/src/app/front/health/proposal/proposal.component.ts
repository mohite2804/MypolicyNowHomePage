import { Component, OnInit, Renderer2, Input,Output, EventEmitter, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CustomvalidationService } from "../../services/customvalidation.service";
import { HealthService } from "..//services/health.service";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { timer, Subscription } from "rxjs";

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  razorpayKey : any =  environment.razorpayKey;
  mainJsPath = environment.mainJsPath;
  result_payment_types_changes : any;
  baseUrl = environment.baseUrl;
  permissionDeniedMsg = environment.permissionDeniedMsg;  
  formOtpDetails: FormGroup;
  submittedOtpDetails: boolean = false;
  isAuthenticate: boolean = false;
  formPayment : any;
  submittedPayment: boolean = false;
  validation_for_date :any = "^[0-9-]*$";
  validation_for_number_only :any = "^[0-9]*$";
  validation_for_name_with_space :any = "^[a-zA-Z ]*$";
  wallet_balance : any = 0;
  razor_customer_id : any;
  customer_url_without_login : any;
  is_dealer_url_with_login : boolean = true;
  is_wallet_pay: boolean = false;
  loaderActive: boolean = false;
  loginUserId: any; 
  selectedproducttypeid: any;
  loginUserType: any;
  policy_type_name: any;
  policy_subtype_name: any;
  alcohol: any;
  childplanning: any;
  gender: any;
  group_lable: any;
  insured_type_self: any;
  insured_type_self_age: any;
  insured_type_spouse: any;
  insured_type_spouse_age: any;
  insured_type_mother:any;
  insured_type_mother_age:any;
  insured_type_father:any;
  insured_type_father_age:any;
  insured_type_son1:any;
  insured_type_son1_age:any;
  insured_type_son2:any;
  insured_type_son2_age:any;
  insured_type_son3:any;
  insured_type_son3_age:any;
  insured_type_son4:any;
  insured_type_son4_age:any;
  insured_type_daughter1:any;
  insured_type_daughter1_age:any;
  insured_type_daughter2:any;
  insured_type_daughter2_age:any;
  insured_type_daughter3:any;
  insured_type_daughter3_age:any;
  insured_type_daughter4:any;
  insured_type_daughter4_age:any;
  policyList:any;
  quote_data_health_id:any;
  quote_unique_reference_no:any;
  quote_id:any;
  policyicid:any;
  OccupationList:any;
  userQuotedetails:any;
  customerDetails:any;
  proposalno:any;
  proposaldate:any;
  proposal_id:any;
  unique_ref_no:any;
  otp_n_1:any;
  otp_n_2:any;
  otp_n_3:any;
  quote_data_healthid:any;
  is_auth_otp_verified:any;
  policylogo:any;
  plan_comp_code:any;
  customer_dist :any;
  customer_city :any;
  customer_state:any;
  error_message:any;
  error:any;
  success: any;
  is_error:any;
  response_message:any;
  proposal_status_id:any;
  formOtpform : any;
  submittedOtDetail: boolean = false;
  displayOtpQuote : any = 'none';
  mem_dob: any;
  membersdisease: any;
  membersdisease_smoke: any;
  membersdisease_tobaco: any;
  pincode: any;
  selected_suminsured: any;
  tenure: any;
  is_ic_multiple_appointee:any;
  is_ic_multiple_nominee:any;
  customerage:any;
  buy_policy_id:any;
  buy_policy_unique_id:any;
  is_buy:any;
  date_picker_date_picker_cheque_date: NgbDateStruct;
  minChequeDate : any;
  maxChequeDate : any;
  div_show_for_cheque:boolean = true;
  div_show_for_wallet: boolean = true;
  div_show_for_business_wallet: boolean = true;
  policy_generate_for_this_proposal : any;
  payment_method_id:any;
  div_show_for_timer : boolean = true;
  policy_sub_type_id : any;
  ic_id:any;
  div_show_for_addon: boolean = true;
  div_show_for_od_premium: boolean = true;
  div_show_for_third_party : boolean = true;
  div_show_for_discount : boolean = true;
  @Input('result_proposal_details') result_proposal_details: any;
  @Input('result_banks') result_banks: any;
  @Input('result_payment_types') result_payment_types: any;
  @Input('is_from_proposal_page') is_from_proposal_page: boolean;
  payment_method_type:any;
  gross_premium:any;
  displayForwardProposal : any = 'none';
  formForwardProposal : FormGroup;
  submittedForwardProposal :  boolean = false;
  email_1:any;
  appointee_div:any;
  nominee_relationship:any;
  payment_url:any;
  strAsArray:any;
  urlArr:any;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loadScripts();
    this.loadPaymentScripts();


    const current = new Date();
    this.maxChequeDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.minChequeDate =  {
      year: current.getFullYear(),
      month: current.getMonth() - 7,
      day: current.getDate()
    };
   }

  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;

    if(field == 'cheque_date'){
      this.formPayment.patchValue({ cheque_date : year+'-'+month+'-'+day });
    }


  }

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem("user_id");
      this.razor_customer_id = sessionStorage.getItem('razor_customer_id');
      this.selectedproducttypeid = sessionStorage.getItem(
        "selected_product_type_id"
      );
      this.loginUserType = sessionStorage.getItem("user_type_id");
      this.buy_policy_id = sessionStorage.getItem("buy_policy_id");
      this.buy_policy_unique_id = sessionStorage.getItem("buy_policy_unique_id");

      this.customer_url_without_login = '/health-insurance-quote/share/proposal/'+sessionStorage.getItem('proposal_share_link');

      if(this.router.url == this.customer_url_without_login){
        this.is_dealer_url_with_login = false;
      }
      if(this.router.url != '/health-insurance-quote/proposal')
      {
        this.relianceptment(this.router.url);
      }     
      
      if(this.razor_customer_id){
        this.getWalletBallance();
      }

      this.validationformOtpDetails();
      this.validationformCustomerDetails();
      this.validateProposal();
      this.getIndex();
      
      this.getWalletBallance();

  }  

  getIndex() {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("quote_data_health_id", this.buy_policy_id);
    sendData.append("unique_reference_no", this.buy_policy_unique_id);
    this.healthService.getCustomerDetails(sendData).subscribe((res) => {
      this.insured_type_self = "";
      this.insured_type_spouse = "";
      this.insured_type_mother = "";
      this.insured_type_father = "";
      this.insured_type_son1 = "";
      this.insured_type_son2 = "";
      this.insured_type_son3 = "";
      this.insured_type_son4 = "";
      this.insured_type_daughter1 = "";
      this.insured_type_daughter2 = "";
      this.insured_type_daughter3 = "";
      this.insured_type_daughter4 = "";
      var result: any = res;
      this.loaderActive = false;
      this.policy_type_name = result.result.user_data.policy_type_name;
      this.policy_subtype_name = result.result.user_data.policy_subtype_name;
      this.is_ic_multiple_appointee = result.result.user_data.is_ic_multiple_appointee;
      this.is_ic_multiple_nominee = result.result.user_data.is_ic_multiple_nominee;
      if(result.result.user_data.user_action_data.insured_type_self == '1')
      {
        this.insured_type_self = 'Self';
        this.insured_type_self_age = result.result.user_data.user_action_data.insured_type_self_age+" Yrs";
      }
      
      if(result.result.user_data.user_action_data.insured_type_spouse == '1')
      {
        this.insured_type_spouse = 'Spouse';
        this.insured_type_spouse_age = result.result.user_data.user_action_data.insured_type_spouse_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_mother == '1')
      {
        this.insured_type_mother = 'Mother';
        this.insured_type_mother_age = result.result.user_data.user_action_data.insured_type_mother_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_father == '1')
      {
        this.insured_type_father = 'Father';
        this.insured_type_father_age = result.result.user_data.user_action_data.insured_type_father_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son1 == '1')
      {
        this.insured_type_son1 = 'Son1';
        this.insured_type_son1_age = result.result.user_data.user_action_data.insured_type_son1_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son2 == '1')
      {
        this.insured_type_son2 = 'Son2';
        this.insured_type_son2_age = result.result.user_data.user_action_data.insured_type_son2_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son3 == '1')
      {
        this.insured_type_son3 = 'Son3';
        this.insured_type_son3_age = result.result.user_data.user_action_data.insured_type_son3_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son4 == '1')
      {
        this.insured_type_son4 = 'Son4';
        this.insured_type_son4_age = result.result.user_data.user_action_data.insured_type_son4_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter1 == '1')
      {
        this.insured_type_daughter1 = 'Daughter1';
        this.insured_type_daughter1_age = result.result.user_data.user_action_data.insured_type_daughter1_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter2 == '1')
      {
        this.insured_type_daughter2 = 'Daughter2';
        this.insured_type_daughter2_age = result.result.user_data.user_action_data.insured_type_daughter2_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter3 == '1')
      {
        this.insured_type_daughter3 = 'Daughter3';
        this.insured_type_daughter3_age = result.result.user_data.user_action_data.insured_type_daughter3_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter4 == '1')
      {
        this.insured_type_daughter4 = 'Daughter4';
        this.insured_type_daughter4_age = result.result.user_data.user_action_data.insured_type_daughter4_age+" Yrs";
      }
      this.alcohol = result.result.user_data.user_action_data.alcohol;
      this.childplanning = result.result.user_data.user_action_data.childplanning;
      this.gender = result.result.user_data.user_action_data.gender;
      this.group_lable = result.result.user_data.user_action_data.group_lable;
      this.mem_dob = result.result.user_data.user_action_data.mem_dob;
      this.membersdisease = result.result.user_data.user_action_data.membersdisease;
      this.membersdisease_smoke = result.result.user_data.user_action_data.membersdisease_smoke;
      this.membersdisease_tobaco = result.result.user_data.user_action_data.membersdisease_tobaco;
      this.pincode = result.result.user_data.user_action_data.pincode;
      this.selected_suminsured = result.result.user_data.user_action_data.selected_suminsured;
      this.tenure = result.result.user_data.user_action_data.tenure;
      this.policyList = result.result.policy_list[0];
      this.policylogo = result.result.policy_list[0].logo;
      this.plan_comp_code = result.result.policy_list[0].plan_comp_code;
      this.policyicid = result.result.policy_list[0].ic_id;
      this.userQuotedetails = result.result.user_data.user_action_data;
      this.quote_data_healthid = result.result.policy_list[0].quote_id;
      this.ic_id = result.result.policy_list[0].ic_id;
      this.quote_unique_reference_no = result.result.policy_list[0].quote_unique_reference_no;
      this.customerDetails = result.result.user_data.customer_action_data[0];
      this.customerage = result.result.user_data.customer_action_data;
      this.customer_dist  = result.result.user_data.customer_action_data.customer_dist;
      this.customer_city  = result.result.user_data.customer_action_data.customer_city;
      this.customer_state = result.result.user_data.customer_action_data.customer_state;
      this.gross_premium = result.result.policy_list[0].FinalPremium;
      this.email_1=result.result.user_data.customer_action_data[0].buyer_email_id,
      this.getProposalData();
      this.getProposalDataDashboard();
      //alert(this.customerDetails.nomineeself_relationship);
      this.getRelation(this.ic_id,this.customerDetails.nominee_relationship);
      this.formForwardProposal.patchValue({
        email_1 : result.result.user_data.customer_action_data[0].buyer_email_id
      });

      if(result.result.user_data.customer_action_data[0].appointee_firstname !== '' && result.result.user_data.customer_action_data[0].appointee_firstname !== undefined)
      {
        this.appointee_div = true;
      }
      else 
      {
        this.appointee_div = false;
      }
    });

    this.proposalno = this.proposalno;
      this.proposal_id = this.proposal_id;
      if(this.is_from_proposal_page){
        if(this.proposalno == "" || this.proposalno ==  null || this.proposalno == undefined ){
          //this.router.navigateByUrl('/quotation');
          this.router.navigate(['/health-insurance-quote/quote']);
        }
      }
      this.isAuthenticate = this.is_auth_otp_verified;
      this.loaderActive = false;
      if(this.result_payment_types){
        this.paymentMethodChangeForSharePage();
      }

      if(this.result_proposal_details.policy_id || this.result_proposal_details.policy_no){
        //alert(this.result_proposal_details.policy_id);
        this.policy_generate_for_this_proposal = false;
      }else{
        //alert('outt');
        this.policy_generate_for_this_proposal = true;
      }


      this.selectedproducttypeid = this.selectedproducttypeid;

      this.checkSubType();

      

  }

  getRelation(ic_id, relation_id)
  {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("relation_id", relation_id);
    sendData.append("ic_id", ic_id);
      this.healthService.getHealthRelationListData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      console.log(result);
      this.nominee_relationship = result.request.name;
      
    });
  }

  relianceptment(url)
  {

    this.payment_url = url;
    this. strAsArray = this.payment_url.split("?");
    this. urlArr = this.strAsArray[1].split("=");
    if((this.urlArr[0] ==  'Output' || this.urlArr[0] =='PN') && this.urlArr[0] !='')
    {
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append("api_response",this.router.url);
     sendData.append("buy_policy_id",sessionStorage.getItem("buy_policy_id"));
      sendData.append("buy_policy_unique_id",sessionStorage.getItem("buy_policy_unique_id"));
      this.healthService.insertOtherPayment(sendData).subscribe((res) => {
        var output_result: any = res;
        this.loaderActive = false;
        console.log(output_result[0].status);
        if(output_result[0].status){
          sessionStorage.setItem('policy_id', output_result[0].policy_id);
          sessionStorage.setItem('policy_no', output_result[0].policy_no);
          this.router.navigate(['health-insurance-quote/thank-you-health']);
  
        }else{
            Swal.fire({
            title: output_result.message,
            confirmButtonText: `OK`
          });
        }
      });  
    }
  }

  checkThirdParty(){
    //alert(this.policy_sub_type_id);
    var policy_sub_type_ids: number[] = [5, 10,11,16];
    var find : any = policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find){ return true; }else{ return false; }

  }

  checkStandAloneOd(){
    var policy_sub_type_ids: number[] = [4];
    var find : any =  policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find > -1){ return true; }else{ return false; }

  }

  checkComprehnsive(){
    var policy_sub_type_ids: number[] = [3,6,7,8,9,13,14];
    var find : any =  policy_sub_type_ids.find(element => element == this.policy_sub_type_id);
    if(find > -1){ return true; }else{ return false; }
  }

  checkSubType(){
    //alert('checkSubType');
    var foundThirdParty : boolean = this.checkThirdParty();
    var foundStandAlone : boolean = this.checkStandAloneOd();
    var foundComprehnsive :  boolean = this.checkComprehnsive()

    if(foundThirdParty){
     // alert('foundThirdParty');
      this.div_show_for_addon = false;
      this.div_show_for_od_premium = false;
      this.div_show_for_discount = false;
      this.div_show_for_third_party = true;


    }

    if(foundStandAlone){
     // alert('foundStandAlone');
      this.div_show_for_addon = true;
      this.div_show_for_od_premium = true;
      this.div_show_for_third_party = false;
      this.div_show_for_discount = true;

    }

    if(foundComprehnsive){
     // alert('foundComprehnsive');
      this.div_show_for_addon = true;
      this.div_show_for_od_premium = true;
      this.div_show_for_third_party = true;
      this.div_show_for_discount = true;

    }

  }

  getProposalData()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("quote_id", this.quote_data_healthid);
        sendData.append("loginuser_id", this.loginUserId);
        sendData.append("ic_id", this.ic_id);
        this.healthService.getHealthProposalListData(sendData).subscribe((res) => {
        this.loaderActive = false;
        var result: any = res;
        this.proposal_id = result.response[0].proposal_id;
        this.proposalno = result.response[0].proposal_no;
        this.proposaldate = result.response[0].proposal_date;
        this.unique_ref_no = result.response[0].unique_ref_no;
        this.is_auth_otp_verified = result.response[0].is_auth_otp_verified;
        this.is_buy = result.response[0].is_buy;
        this.is_error = result.response[0].is_error;
        this.error_message = result.response[0].error_message;
        this.proposal_status_id = result.response[0].proposal_status_id;
        this.payment_method_type = result.response[0].bank.payment_types;
        
      });
  }

  getProposalDataDashboard()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("quote_id", this.quote_data_healthid);
        sendData.append("quote_data_health_id", this.buy_policy_id);
        this.healthService.getHealthProposalListData(sendData).subscribe((res) => {
        this.loaderActive = false;
        var result: any = res;
        this.proposal_id = result.response[0].proposal_id;
        this.proposalno = result.response[0].proposal_no;
        this.proposaldate = result.response[0].proposal_date;
        this.unique_ref_no = result.response[0].unique_ref_no;
        this.is_auth_otp_verified = result.response[0].is_auth_otp_verified;
        this.is_buy = result.response[0].is_buy;
        this.is_error = result.response[0].is_error;
        this.error_message = result.response[0].error_message;
        this.proposal_status_id = result.response[0].proposal_status_id;
        this.payment_method_type = result.response[0].bank.payment_types;
        
      });
  }

  closePopupOtpQuote(){
    this.formOtpform='none';
    this.resetFormOtpQuote();
    this.loaderActive = false;
  }

  closePopupBuypolicyQuote(){
    this.formPayment='none';
    this.resetFormBuyQuote();
    this.loaderActive = false;
  }

  resetFormOtpQuote(){
    this.submittedOtDetail = false;
    this.formOtpDetails.patchValue({
      otp_n_1 : '',
      otp_n_2 : '',
      otp_n_3 : '',
      otp_n_4 : '',
    });
    $('#otpverification').css('display', 'none');
    $('#div_class').removeClass('modal-backdrop fade show');
  }

  resetFormBuyQuote(){
    this.submittedPayment = false;
    this.formPayment.patchValue({
      payment_method_id : '',
      bank_id : '',
      bank_city : '',
      cheque_number : '',
      terms_and_conditions : '',
    });
    $('#buypolicy').css('display','none');
    $('#div_class').removeClass('modal-backdrop fade show');
  }

  
  send_otp(unique_ref_no)
  {
    $('#otpverification').removeClass('modal custom-modal coverage-modal fade');
    $('#otpverification').addClass('modal custom-modal coverage-modal fade show');
    $('#div_class').addClass('modal-backdrop fade show');
    $('#otpverification').css('display', 'block');

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("unique_ref_no", unique_ref_no);
    this.healthService.sendHealthOtpFormData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      if(result.status == 0)
      {
        this.error_message = result.error_message;
        Swal.fire(this.error_message, "", "error");
        return;
      }
      else{
        this.error_message = result.message;
        Swal.fire(this.error_message, "", "success");
        return;
      }
    });
  }

  resend_otp(unique_ref_no)
  {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("unique_ref_no", unique_ref_no);
    this.healthService.sendHealthOtpFormData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
        if(result.status == 0)
        {
          this.error_message = result.error_message;
          Swal.fire(this.error_message, "", "error");
          return;
        }
        else{
          this.error_message = result.message;
          Swal.fire(this.error_message, "", "success");
          return;
        }
    });
  }

  buy_policy(unique_ref_no)
  {
    $('#buypolicy').removeClass('modal custom-modal coverage-modal fade');
    $('#buypolicy').addClass('modal custom-modal coverage-modal fade show');
    $('#div_class').addClass('modal-backdrop fade show');
    $('#buypolicy').css('display', 'block');
  }
  

  validationformOtpDetails() {
    this.formOtpDetails = this.formBuilder.group({
      digit_1: ["", [Validators.required]],
      digit_2: ["", [Validators.required]],
      digit_3: ["", [Validators.required]],
      digit_4: ["", [Validators.required]],
     
    });
  }


  setParameterForSubmitForm() {
    let uploadData = new FormData();
    uploadData.append("unique_ref_no", this.unique_ref_no);
    uploadData.append('otp',this.formOtpDetails.value.digit_1+''+this.formOtpDetails.value.digit_2+''+this.formOtpDetails.value.digit_3+''+this.formOtpDetails.value.digit_4);
    return uploadData;
  }

  

  submittedOtpQuote()
  {
    this.submittedOtpDetails = true;
    this.loaderActive = true;
    var uploadData: any = this.setParameterForSubmitForm();
    this.healthService.submitHealthOtpFormData(uploadData)
      .subscribe((response) => {
        var outputResult: any = response;
        this.loaderActive = false;
        console.log(outputResult);
        if(outputResult.status == 0)
        {
          this.error_message = outputResult.message;
          Swal.fire(this.error_message, "", "error");
          this.closePopupOtpQuote();
          this.getProposalData();
          this.isAuthenticate = false;
          return;
        }
        else{
          this.error_message = outputResult.message;
          Swal.fire(this.error_message, "", "success");
          this.closePopupOtpQuote();
          this.getProposalData();
          this.isAuthenticate = true;
          return;
        }
      });
  }

  validateProposal(){
     this.formForwardProposal = this.formBuilder.group({
      email_1: ["", [Validators.required]],
      email_2: ["", [Validators.required]],
    });

  }

  setParameterForForwordSubmitForm() {
    let uploadData = new FormData();
    uploadData.append('email_1',this.formForwardProposal.value.email_1);
    uploadData.append('email_2',this.formForwardProposal.value.email_2);
    uploadData.append('proposal_no',this.proposalno);
    return uploadData;
  }

  openForwardProposalModal(){
    this.displayForwardProposal = 'block';
  }



  submitFormForwardProposal(){
      this.submittedForwardProposal = true;
      this.loaderActive = true;      
      var uploadData: any = this.setParameterForForwordSubmitForm();
      this.healthService.submitFormForwardProposalHealth(uploadData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success = outputResult.message;
          this.removeMessage();
        }else{
          this.error = outputResult.message;
        }

      });

  }

  
  closePopupForwardProposal(){
    this.displayForwardProposal='none';
    this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  resetFormForwardProposal(){
    this.submittedForwardProposal = false;
    this.formForwardProposal.patchValue({
      email_2 : ''
    });

  }

  removeMessage(){
    setTimeout (() => {
      this.success = "";
      this.error = "";
      this.closePopupForwardProposal();
    }, 2000);

  }
  

  cancelProposal(proposalno)
  {
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append("proposalno", proposalno);
      this.healthService.sendHealthProposalCancel(sendData).subscribe((res) => {
        this.loaderActive = false;
        var result: any = res;
        location.reload();
      });
  }

  validationformCustomerDetails() {
    this.formPayment = this.formBuilder.group({
      payment_method_id: ['',Validators.required],
      bank_id : [''],
      bank_city : [''],
      cheque_number : ['',[Validators.min(1),Validators.minLength(6), Validators.maxLength(6),Validators.pattern(this.validation_for_number_only)]],
      cheque_date : [''],
      terms_and_conditions : ['',[this.customvalidationService.termsAndConditionValidator(),Validators.required ]],
      
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const form_value = [];
    const controls = this.formPayment.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        form_value.push(controls[name].invalid);
        invalid.push(name);
      }
    }
    console.log("invalid fields start .....");
    console.log(invalid);
    console.log("invalid fields end.....");
  }

  setParameterformPayment() {
    if((this.ic_id == 22) && this.payment_method_id==1){
        let uploadData = new FormData();
        uploadData.append("payment_method_id", this.payment_method_id);
        uploadData.append('loginUserId',this.loginUserId);
        uploadData.append('proposal_no',this.proposalno);
        uploadData.append('proposal_id',this.proposal_id);
       return uploadData;
     }
    var uploadData = new FormData();
    if((this.ic_id == 20) || (this.ic_id == 14) && this.payment_method_id==1){
      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('payment_method_id',this.formPayment.value.payment_method_id);
      uploadData.append('terms_and_conditions',this.formPayment.value.terms_and_conditions);
      uploadData.append('proposal_no',this.proposalno);
      uploadData.append('proposal_id',this.proposal_id);

    }else{
      uploadData.append('bank_id',this.formPayment.value.bank_id);
      uploadData.append('bank_city',this.formPayment.value.bank_city);
      uploadData.append('cheque_number',this.formPayment.value.cheque_number);
      uploadData.append('cheque_date',this.formPayment.value.cheque_date);
      uploadData.append('payment_method_id',this.formPayment.value.payment_method_id);
      uploadData.append('terms_and_conditions',this.formPayment.value.terms_and_conditions);
      uploadData.append('proposal_no',this.proposalno);
      uploadData.append('payment_from','propsal_page');
    }
    uploadData.append('selected_ic_id',this.ic_id);
    return uploadData;
  }
  
  selectPaymentMethod(payment_method_id){
    this.is_wallet_pay=false;
    this.payment_method_id=payment_method_id;
    if(payment_method_id == 1 || payment_method_id == 3){
      this.div_show_for_cheque = true;
      this.div_show_for_wallet = true;
      this.div_show_for_business_wallet=true;

      this.formPayment.get("bank_id").setValidators([]);
      this.formPayment.get("bank_id").updateValueAndValidity();

      this.formPayment.get("bank_city").setValidators([]);
      this.formPayment.get("bank_city").updateValueAndValidity();

      this.formPayment.get("cheque_number").setValidators([]);
      this.formPayment.get("cheque_number").updateValueAndValidity();

      this.formPayment.get("cheque_date").setValidators([]);
      this.formPayment.get("cheque_date").updateValueAndValidity();      

    }else if(payment_method_id == 4 )
    {
      this.div_show_for_cheque = true;
      this.div_show_for_wallet = false;
      this.div_show_for_business_wallet = true;

      var xwallet_balance = this.wallet_balance/100;
      if(xwallet_balance < this.gross_premium){
        this.is_wallet_pay=true;
      }

      this.formPayment.get("bank_id").setValidators([]);
      this.formPayment.get("bank_id").updateValueAndValidity();

      this.formPayment.get("bank_city").setValidators([]);
      this.formPayment.get("bank_city").updateValueAndValidity();

      this.formPayment.get("cheque_number").setValidators([]);
      this.formPayment.get("cheque_number").updateValueAndValidity();

      this.formPayment.get("cheque_date").setValidators([]);
      this.formPayment.get("cheque_date").updateValueAndValidity();

      
    }else if (payment_method_id == 6){
      this.div_show_for_cheque = true;
      this.div_show_for_wallet = true;
      this.div_show_for_business_wallet = false;

      this.formPayment.get("bank_id").setValidators([]);
      this.formPayment.get("bank_id").updateValueAndValidity();

      this.formPayment.get("bank_city").setValidators([]);
      this.formPayment.get("bank_city").updateValueAndValidity();

      this.formPayment.get("cheque_number").setValidators([]);
      this.formPayment.get("cheque_number").updateValueAndValidity();

      this.formPayment.get("cheque_date").setValidators([]);
      this.formPayment.get("cheque_date").updateValueAndValidity();

      
    }
    else{
      this.div_show_for_cheque = false;
      this.div_show_for_wallet = true;
      this.div_show_for_business_wallet = true;
      this.formPayment.get("bank_id").setValidators([Validators.required]);
      this.formPayment.get("bank_id").updateValueAndValidity();

      this.formPayment.get("bank_city").setValidators([
        this.customvalidationService.cannotContainSpace(),
        this.customvalidationService.cannotContainZero(),
        Validators.required,
        Validators.pattern(this.validation_for_name_with_space)
      ]);
      this.formPayment.get("bank_city").updateValueAndValidity();

      this.formPayment.get("cheque_number").setValidators([Validators.min(1),Validators.minLength(6), Validators.maxLength(6),Validators.required,Validators.pattern(this.validation_for_number_only)]);
      this.formPayment.get("cheque_number").updateValueAndValidity();

      this.formPayment.get("cheque_date").setValidators([Validators.required]);
      this.formPayment.get("cheque_date").updateValueAndValidity();
    }
  }

  updateRazorPayStatus(uploadData){

    this.healthService.updateRazorPayStatus(uploadData)
    .subscribe(response => {
      var output_data : any = response;
    });
  }

  createRzpayOrder(uploadData){
    if((this.ic_id == 20) || (this.ic_id == 14) && this.payment_method_id==1){
     this.healthService.createOtherOrder(uploadData)
        .subscribe(response => {
        var output_data : any = response;
        console.log(output_data);
        if(output_data.result){
          window.location.href=output_data.result;

        }else{
          this.loaderActive = false;
          Swal.fire({
            title: output_data.message,
            text: "",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              //location.reload();
              this.router.navigate(['/home']);
            }
          })
        }

      });
    }
    else
    {
      this.healthService.createRzpayOrder(uploadData)
        .subscribe(response => {
        var output_data : any = response;
        console.log('output_Data '+output_data );
        if(output_data.status){
        // this.razorpay_order_id = output_data.razorpay_order_id;
          //alert();
          if(output_data.razorpay_payment_id){
            var sendData = new FormData();
            sendData.append('payment_method_id','1');
            sendData.append('razorpay_order_id',output_data.razorpay_order_id);
            sendData.append('razorpay_payment_id',output_data.razorpay_payment_id);
            sendData.append('proposal_no',this.proposalno);
            sendData.append('payment_gateway_response', JSON.stringify(output_data.payment_gateway_response) );
            sendData.append('payment_gateway_request', JSON.stringify(output_data.payment_gateway_request) );
            sendData.append('loginUserId',this.loginUserId);
            this.submitFormPaymentForAll(sendData);

          }else{
            this.payWithRazor(output_data.razorpay_order_id,output_data.order_amount_in_paisa);
          }

        }else{
          this.loaderActive = false;
          Swal.fire({
            title: output_data.message,
            text: "",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              //location.reload();
              this.router.navigate(['/home']);
            }
          })
        }

      });
    }  
    
  }

  payWithRazor(razorpay_order_id,order_amount_in_paisa) {
    //alert(razorpay_order_id);
    console.log("razorpay_order_id payWithRazor :- "+razorpay_order_id);
    const options: any = {
      //key: 'rzp_test_ECAWq7iNii1iV3',
      key: this.razorpayKey,
      amount: order_amount_in_paisa, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: '',  // product description
      image: '../assets/front/img/hib-logo.png', // company logo or product image
      //order_id: razorpay_order_id, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
      options.handler = ((response, error) => {
      options.response = response;
      var output_razor_data : any = response;
      console.log(response);
      console.log(options);

      var updateStatus = new FormData();
      updateStatus.append('order_id',razorpay_order_id);
      updateStatus.append('razorpay_order_id',razorpay_order_id);
      updateStatus.append('order_status','paid');
      updateStatus.append('loginUserId',this.loginUserId);
      this.updateRazorPayStatus(updateStatus);


      var sendData = new FormData();
      sendData.append('payment_method_id','1');
      sendData.append('razorpay_order_id',razorpay_order_id);
      sendData.append('proposal_no',this.proposalno);
      sendData.append('payment_gateway_response', JSON.stringify(response) );
      sendData.append('payment_gateway_request', JSON.stringify(options) );
      sendData.append('loginUserId',this.loginUserId);
      this.submitFormPaymentForAll(sendData);

      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      var updateStatus = new FormData();
      updateStatus.append('order_id',razorpay_order_id);
      updateStatus.append('razorpay_order_id',razorpay_order_id);
      updateStatus.append('order_status','failed');
      this.updateRazorPayStatus(updateStatus);

      console.log('Transaction cancelled.');
      this.loaderActive = false;
      Swal.fire({
        title: 'Transaction cancelled',
        text: "",
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      })

     // Swal.fire({position: 'center',icon: 'error',title: "Transaction cancelled. Please try again", showConfirmButton: false, timer: 3000 });
    });
    const rzp = new this.healthService.nativeWindow.Razorpay(options);
    rzp.open();
  }


  paymentMethodChangeForSharePage(){
    //alert(this.is_from_proposal_page);
    this.result_payment_types_changes = this.result_payment_types;
    console.log(this.result_payment_types_changes);
    this.result_payment_types.forEach( (value, key) => {
      if(value.payment_method_id == 1 && key==0){
        this.payment_method_id=value.payment_method_id;
      }
    });
  
    
    if(!this.is_from_proposal_page){
      //alert('innn');
      this.result_payment_types_changes = [];
      this.result_payment_types.forEach( (value, key) => {
        if(value.payment_method_id == 1){
          this.result_payment_types_changes.push(this.result_payment_types[key]);
        }
      });
    }
  }

  getWalletBallance(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('razor_customer_id',this.razor_customer_id);
    this.healthService.getWalletBallance(sendData)
    .subscribe(response => {
      this.wallet_balance = response;
    });
  }

  submitFormPayment(){
    this.submittedPayment = true;
    if (this.formPayment.invalid) {
      this.findInvalidControls();
      Swal.fire("Please fill all mandatory fields", "", "error");
      return;
    }
    var uploadData: any = this.setParameterformPayment();
    this.loaderActive = true;
 
    if(this.formPayment.value.payment_method_id == 1){
        this.createRzpayOrder(uploadData);
    }else{
      this.submitFormPaymentForAll(uploadData);
    }


  }

  submitFormPaymentForAll(uploadData){
    this.healthService.submitFormPayment(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any  = response;      
      if(output_result.status == '1'){
        sessionStorage.setItem('policy_id', output_result.response[0].policy_id);
        sessionStorage.setItem('policy_no', output_result.response[0].policy_no);
        if(this.router.url == this.customer_url_without_login){
           this.router.navigate(['/health-insurance-quote/share/thank-you']);
        }else{
          this.router.navigate(['health-insurance-quote/thank-you-health']);
        }

      }else{
          Swal.fire({
          title: output_result.message,
          confirmButtonText: `OK`
        });
      }
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

  loadPaymentScripts() {
    var mainJsPath : any = "https://checkout.razorpay.com/v1/checkout.js";
    const externalScriptArray = [mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }

  transform(value: number): string {
    if(value > 0){
      this.div_show_for_timer = false;
      const minutes: number = Math.floor(value / 60);
      return (
        ("00" + minutes).slice(-2) +
        ":" +
        ("00" + Math.floor(value - minutes * 60)).slice(-2)
      );
    }
    else{
      this.div_show_for_timer = true;
      return ("Expired");
    }
  }


  backToQuoteForm(){
    if(this.selectedproducttypeid == '32' || this.selectedproducttypeid == 32){
      this.router.navigate(['/health-insurance-quote/quote']);
    }
   
  }

  
}
