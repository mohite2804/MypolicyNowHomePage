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
  selector: 'app-share-proposal-health',
  templateUrl: './share-proposal-health.component.html',
  styleUrls: ['./share-proposal-health.component.css']
})
export class ShareProposalHealthComponent implements OnInit {
  razorpayKey : any =  environment.razorpayKey;
  proposal_share_link:any;
  is_from_proposal_page :  boolean = false;
  mainJsPath = environment.mainJsPath;
  baseUrl = environment.baseUrl;
  permissionDeniedMsg = environment.permissionDeniedMsg;  
  formOtpDetails: FormGroup;
  submittedOtpDetails: boolean = false;
  isAuthenticate: boolean = false;
  formPayment : FormGroup;
  formPaymentsub:any;
  submittedPayment: boolean = false;
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
  payment_method_type:any;
  gross_premium:any;
  displayForwardProposal : any = 'none';
  formForwardProposal : FormGroup;
  submittedForwardProposal :  boolean = false;
  user_id:any;
  validation_for_number_only :any = "^[0-9]*$";
  proposal_start_date:any;
  proposal_end_date:any;
  selected_product_type_id:any;
  user_type_id:any;
  constructor(private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder) { 
      this.loadScripts();
      this.loadPaymentScripts();
  
    }

  ngOnInit(): void {
    this.is_from_proposal_page = false;
    this.proposalno = "";
    this.loginUserId = "";
    this.customer_url_without_login = '/share/health-proposal/'+sessionStorage.getItem('proposal_share_link');

    if(this.router.url == this.customer_url_without_login){
      this.is_dealer_url_with_login = false;
    }
    this.proposal_share_link =  this.activatedRoute.snapshot.paramMap.get('proposal_share_link');
    if(this.proposal_share_link == "" || this.proposal_share_link ==  null || this.proposal_share_link == undefined ){
      this.router.navigateByUrl('/quotation');
    }else{
      this.getIndex();
    }
    sessionStorage.setItem('proposal_share_link', this.proposal_share_link);
    this.validationformOtpDetails();
    this.validationformCustomerDetails();
  }

  getIndex(){

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('proposal_no',this.proposalno);
    sendData.append('proposal_share_link',this.proposal_share_link);

    this.healthService.getProposalDetails(sendData).subscribe(res => {
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
      this.user_id = result.quote_details.user_data.user_action_data.user_id;
      this.user_type_id = result.quote_details.user_data.user_action_data.user_type_id;
      this.selected_product_type_id = result.quote_details.user_data.user_action_data.selected_product_type_id;
      this.buy_policy_id = result.proposal_details.quote_id;
      this.buy_policy_unique_id = result.quote_details.policy_list[0].quote_unique_reference_no;
      this.policy_type_name = result.quote_details.user_data.policy_type_name;
      this.policy_subtype_name = result.quote_details.user_data.policy_subtype_name;
      this.is_ic_multiple_appointee = result.quote_details.user_data.is_ic_multiple_appointee;
      this.is_ic_multiple_nominee = result.quote_details.user_data.is_ic_multiple_nominee;
      if(result.quote_details.user_data.user_action_data.insured_type_self == '1')
      {
        this.insured_type_self = 'Self';
        this.insured_type_self_age = result.quote_details.user_data.user_action_data.insured_type_self_age+" Yrs";
      }
      
      if(result.quote_details.user_data.user_action_data.insured_type_spouse == '1')
      {
        this.insured_type_spouse = 'Spouse';
        this.insured_type_spouse_age = result.quote_details.user_data.user_action_data.insured_type_spouse_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_mother == '1')
      {
        this.insured_type_mother = 'Mother';
        this.insured_type_mother_age = result.quote_details.user_data.user_action_data.insured_type_mother_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_father == '1')
      {
        this.insured_type_father = 'Father';
        this.insured_type_father_age = result.quote_details.user_data.user_action_data.insured_type_father_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_son1 == '1')
      {
        this.insured_type_son1 = 'Son1';
        this.insured_type_son1_age = result.quote_details.user_data.user_action_data.insured_type_son1_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_son2 == '1')
      {
        this.insured_type_son2 = 'Son2';
        this.insured_type_son2_age = result.quote_details.user_data.user_action_data.insured_type_son2_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_son3 == '1')
      {
        this.insured_type_son3 = 'Son3';
        this.insured_type_son3_age = result.quote_details.user_data.user_action_data.insured_type_son3_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_son4 == '1')
      {
        this.insured_type_son4 = 'Son4';
        this.insured_type_son4_age = result.quote_details.user_data.user_action_data.insured_type_son4_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_daughter1 == '1')
      {
        this.insured_type_daughter1 = 'Daughter1';
        this.insured_type_daughter1_age = result.quote_details.user_data.user_action_data.insured_type_daughter1_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_daughter2 == '1')
      {
        this.insured_type_daughter2 = 'Daughter2';
        this.insured_type_daughter2_age = result.quote_details.user_data.user_action_data.insured_type_daughter2_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_daughter3 == '1')
      {
        this.insured_type_daughter3 = 'Daughter3';
        this.insured_type_daughter3_age = result.quote_details.user_data.user_action_data.insured_type_daughter3_age+" Yrs";
      }

      if(result.quote_details.user_data.user_action_data.insured_type_daughter4 == '1')
      {
        this.insured_type_daughter4 = 'Daughter4';
        this.insured_type_daughter4_age = result.quote_details.user_data.user_action_data.insured_type_daughter4_age+" Yrs";
      }
      this.alcohol = result.quote_details.user_data.user_action_data.alcohol;
      this.childplanning = result.quote_details.user_data.user_action_data.childplanning;
      this.gender = result.quote_details.user_data.user_action_data.gender;
      this.group_lable = result.quote_details.user_data.user_action_data.group_lable;
      this.mem_dob = result.quote_details.user_data.user_action_data.mem_dob;
      this.membersdisease = result.quote_details.user_data.user_action_data.membersdisease;
      this.membersdisease_smoke = result.quote_details.user_data.user_action_data.membersdisease_smoke;
      this.membersdisease_tobaco = result.quote_details.user_data.user_action_data.membersdisease_tobaco;
      this.pincode = result.quote_details.user_data.user_action_data.pincode;
      this.selected_suminsured = result.quote_details.user_data.user_action_data.selected_suminsured;
      this.tenure = result.quote_details.user_data.user_action_data.tenure;
      this.policyList = result.quote_details.policy_list[0];
      this.policylogo = result.quote_details.policy_list[0].logo;
      this.plan_comp_code = result.quote_details.policy_list[0].plan_comp_code;
      this.policyicid = result.quote_details.policy_list[0].ic_id;
      this.userQuotedetails = result.quote_details.user_data.user_action_data;
      this.quote_data_healthid = result.quote_details.policy_list[0].quote_id;
      this.ic_id = result.quote_details.policy_list[0].ic_id;
      this.quote_unique_reference_no = result.quote_details.policy_list[0].quote_unique_reference_no;
      this.customerDetails = result.quote_details.user_data.customer_action_data[0];
      this.customerage = result.quote_details.user_data.customer_action_data;
      this.customer_dist  = result.quote_details.user_data.customer_action_data.customer_dist;
      this.customer_city  = result.quote_details.user_data.customer_action_data.customer_city;
      this.customer_state = result.quote_details.user_data.customer_action_data.customer_state;
      this.gross_premium = result.quote_details.policy_list[0].FinalPremium;
      this.proposal_id = result.proposal_details.proposal_id;
      this.proposal_start_date = result.proposal_start_date;
      this.proposal_end_date = result.proposal_end_date;
      this.proposalno = result.proposal_details.proposal_no;
      this.proposaldate = result.proposal_details.proposal_date;
      this.unique_ref_no = result.proposal_details.unique_ref_no;
      this.is_auth_otp_verified = result.auth_otp_verified_at;
      this.is_buy = result.proposal_details.is_buy;
      this.is_error = result.proposal_details.is_error;
      this.error_message = result.proposal_details.error_message;
      this.proposal_status_id = result.proposal_details.proposal_status_id;
      this.payment_method_type = result.proposal_details.bank.payment_types;
      
     
    });
  }

  closePopupOtpQuote(){
    this.formOtpform='none';
    this.resetFormOtpQuote();
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

  validationformOtpDetails() {
    this.formOtpDetails = this.formBuilder.group({
      otp_n_1: ["", [Validators.required]],
      otp_n_2: ["", [Validators.required]],
      otp_n_3: ["", [Validators.required]],
      otp_n_4: ["", [Validators.required]],
     
    });
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

  setParameterForSubmitForm() {
    let uploadData = new FormData();
    uploadData.append("unique_ref_no", this.unique_ref_no);
    uploadData.append('otp',this.formOtpDetails.value.otp_n_1+''+this.formOtpDetails.value.otp_n_2+''+this.formOtpDetails.value.otp_n_3+''+this.formOtpDetails.value.otp_n_4);
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
          this.getIndex();
          this.isAuthenticate = false;
          return;
        }
        else{
          this.error_message = outputResult.message;
          Swal.fire(this.error_message, "", "success");
          this.closePopupOtpQuote();
          this.getIndex();
          this.isAuthenticate = true;
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

  closePopupBuypolicyQuote(){
    this.formPaymentsub='none';
    this.resetFormBuyQuote();
    this.loaderActive = false;
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

  setParameterformPayment() {
    if((this.ic_id == 22) && this.payment_method_id==1){
      let uploadData = new FormData();
      uploadData.append("payment_method_id", this.payment_method_id);
      uploadData.append('loginUserId',this.user_id);
      uploadData.append('proposal_no',this.proposalno);
      uploadData.append('proposal_id',this.proposal_id);
     return uploadData;
   }
  var uploadData = new FormData();
  uploadData.append('loginUserId',this.user_id);
  if(!this.is_from_proposal_page){
    uploadData.append('payment_method_id',this.formPayment.value.payment_method_id);
    uploadData.append('terms_and_conditions',this.formPayment.value.terms_and_conditions);
    uploadData.append('proposal_no',this.proposalno);
    uploadData.append('payment_from','proposal_share');

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


  if(this.formPayment.value.payment_method_id == 1){
      this.createRzpayOrder(uploadData);
  }else{
    this.submitFormPaymentForAll(uploadData);
  }
  }

  submitFormPayment(){
    this.submittedPayment = true;
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
        sessionStorage.setItem('buy_policy_id', this.buy_policy_id);
        sessionStorage.setItem('buy_policy_unique_id', this.buy_policy_unique_id);
        sessionStorage.setItem('selected_product_type_id', this.selected_product_type_id);
        sessionStorage.setItem('policy_id', output_result.response[0].policy_id);
        sessionStorage.setItem('policy_no', output_result.response[0].policy_no);
        if(this.router.url == this.customer_url_without_login){
           this.router.navigate(['/share/thank-you-health']);
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

  updateRazorPayStatus(uploadData){

    this.healthService.updateRazorPayStatus(uploadData)
    .subscribe(response => {
      var output_data : any = response;
    });
  }

  createRzpayOrder(uploadData){
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
          sendData.append('loginUserId',this.user_id);
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
      image: '../../../assets/front/img/hib-logo.png', // company logo or product image
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
      updateStatus.append('loginUserId',this.user_id);
      this.updateRazorPayStatus(updateStatus);


      var sendData = new FormData();
      sendData.append('payment_method_id','1');
      sendData.append('razorpay_order_id',razorpay_order_id);
      sendData.append('proposal_no',this.proposalno);
      sendData.append('payment_gateway_response', JSON.stringify(response) );
      sendData.append('payment_gateway_request', JSON.stringify(options) );
      sendData.append('loginUserId',this.user_id);
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
}
