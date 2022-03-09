import { Component, OnInit, Input,Output, EventEmitter, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { CustomvalidationService } from '../services/customvalidation.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { timer, Subscription } from "rxjs";

@Component({
  selector: 'app-proposal-middle-content',
  templateUrl: './proposal-middle-content.component.html',
  styleUrls: ['./proposal-middle-content.component.css']
})

export class ProposalMiddleContentComponent implements OnInit, OnDestroy {

  //result_proposal_details : any;
  razorpayKey : any =  environment.razorpayKey;
  mainJsPath = environment.mainJsPath;
  result_payment_types_changes : any;
  loaderActive: boolean = false;
  loginUserId : any;
  business_partner_code : any;
  loginUserType:any;
  proposal_no : any;
  proposal_id:any;
  //@Input('proposal_no') proposal_no: string;
  @Input('result_proposal_details') result_proposal_details: any;
  @Input('result_banks') result_banks: any;
  @Input('result_payment_types') result_payment_types: any;
  @Input('is_from_proposal_page') is_from_proposal_page: boolean;
  @Input('result_is_free') result_is_free: boolean;
  @Input('is_error') is_error: boolean;
  @Input('is_error_message') is_error_message: boolean;
  isAuthenticate: boolean = false;
  div_show_for_authenticate : boolean = false;
  div_show_for_payment  : boolean = true;
  formAuthenticate : any;
  submittedAuthenticate: boolean = false;

  formPayment : any;
  submittedPayment: boolean = false;

  wallet_balance : any = 0;
  razor_customer_id : any;

  is_wallet_pay: boolean = false;


  validation_for_date :any = "^[0-9-]*$";

  validation_for_number_only :any = "^[0-9]*$";
  validation_for_name_with_space :any = "^[a-zA-Z ]*$";

  is_otp_send:boolean = false;
  div_otp_message :boolean = true;
  otp_send_message :any ="";

  @Output() parentIsAuthenticate = new EventEmitter<boolean>();
  //@Output() parentUniqueRefNo = new EventEmitter<boolean>();

  date_picker_date_picker_cheque_date: NgbDateStruct;
  minChequeDate : any;
  maxChequeDate : any;
  div_show_for_cheque:boolean = true;
  div_show_for_wallet: boolean = true;
  div_show_for_business_wallet: boolean = true;
  policy_generate_for_this_proposal : any;

  policy_sub_type_id : any;

  div_show_for_addon: boolean = true;
  div_show_for_od_premium: boolean = true;
  div_show_for_third_party : boolean = true;
  div_show_for_discount : boolean = true;

  is_dealer_url_with_login : boolean = true;
  customer_url_without_login : any;
  selected_ic_id : any;
  product_type_id : any;
  is_breakin : any;
  bike_breakin_days : any;
  razorpay_order_id : any;
  countDown: Subscription;
  counter = 0;
  tick = 1000;
  timer : any;
  div_show_for_timer : boolean = true;
  payment_method_id:any;
  accessdisplay : any = "block";

  constructor(private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
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

  getWalletBallance(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('razor_customer_id',this.razor_customer_id);
    this.commonService.getWalletBallance(sendData)
    .subscribe(response => {
      this.wallet_balance = response;
    });
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
    this.policy_sub_type_id = this.result_proposal_details.policy_subtype_id;
    this.razor_customer_id = sessionStorage.getItem('razor_customer_id');
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.selected_ic_id = sessionStorage.getItem('selected_ic_id');
    this.business_partner_code = sessionStorage.getItem('business_partner_code');

    this.customer_url_without_login = '/share/proposal/'+sessionStorage.getItem('proposal_share_link');

    if(this.router.url == this.customer_url_without_login){
      this.is_dealer_url_with_login = false;
    }

    if(this.razor_customer_id){
      this.getWalletBallance();
    }

    this.validationFormAuthenticate();
    this.validationFormPayment();
    this.getIndex();

    if(this.result_is_free){
      this.accessdisplay='none';
    }else{
      this.accessdisplay='block';
    }

  }

  ngOnDestroy(){
    this.countDown=null;
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

  validationFormAuthenticate(){
    this.formAuthenticate = this.formBuilder.group({
      digit_1 : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(1),Validators.pattern(this.validation_for_number_only)]],
      digit_2 : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(1),Validators.pattern(this.validation_for_number_only)]],
      digit_3 : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(1),Validators.pattern(this.validation_for_number_only)]],
      digit_4 : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(1),Validators.pattern(this.validation_for_number_only)]]


    });
  }

  validationFormPayment(){
    this.formPayment = this.formBuilder.group({
      payment_method_id : ['',Validators.required],
      bank_id : [''],
      bank_city : [''],
      cheque_number : ['',[Validators.min(1),Validators.minLength(6), Validators.maxLength(6),Validators.pattern(this.validation_for_number_only)]],
      cheque_date : [''],
      terms_and_conditions : ['',[this.customvalidationService.termsAndConditionValidator(),Validators.required ]],
    });

  }


  paymentMethodChangeForSharePage(){
    // alert(this.is_from_proposal_page);
    this.result_payment_types_changes = this.result_payment_types;

    this.result_payment_types.forEach( (value, key) => {
      if(this.result_is_free){
        this.formPayment.patchValue({ payment_method_id : value.payment_method_id });
      }
      if(value.payment_method_id == 1 && key==0){
        this.payment_method_id=value.payment_method_id;
      }

    });



    if(!this.is_from_proposal_page){
      // alert('innn');
      this.result_payment_types_changes = [];
      this.result_payment_types.forEach( (value, key) => {
        if(value.payment_method_id == 1){
          this.result_payment_types_changes.push(this.result_payment_types[key]);
        }
      });
    }
  }

  getIndex(){

      this.proposal_no = this.result_proposal_details.proposal_no;
      this.proposal_id = this.result_proposal_details.proposal_id;
      if(this.is_from_proposal_page){
        if(this.proposal_no == "" || this.proposal_no ==  null || this.proposal_no == undefined ){
          //this.router.navigateByUrl('/quotation');
          this.router.navigate(['/quotation']);
        }
      }else{
        this.isAuthenticate = false;
        this.div_show_for_authenticate = true;
      }
      this.isAuthenticate = this.result_proposal_details.is_auth_otp_verified;
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


      this.product_type_id = this.result_proposal_details.product_type_id;
      this.is_breakin = this.result_proposal_details.is_breakin;
      this.bike_breakin_days = this.result_proposal_details.bike_breakin_days;

      this.checkSubType();
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

  breakinInitiate(){
    this.intiateProposal();
  }

  //////breakin initiate
	intiateProposal(){

			let uploadData = new FormData();
		    uploadData.append('proposal_no',this.proposal_no);
		    uploadData.append('proposal_id',this.proposal_id);
		    uploadData.append('loginUserId',this.loginUserId);
		    uploadData.append('loginUserType',this.loginUserType);
        this.loaderActive = true;
        this.commonService.submitBreakinInitiate(uploadData)
        .subscribe(response => {
            this.loaderActive = false;
            var outputResult : any = response;
            if(outputResult.status){

              if(outputResult.status){
                Swal.fire({
                  title: outputResult.message,
                  text: "",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    // sessionStorage.setItem('breakin_proposal_no', this.proposal_no);
                    // sessionStorage.setItem('breakin_proposal_id', this.proposal_id);
                    // sessionStorage.setItem('breaking_case_id', outputResult.breaking_case_id);
                    this.router.navigateByUrl('/my-account/break-in-case');
                  }else{
                    location.reload();
                  }
                })
              }
              else{
                Swal.fire(outputResult.message,  "" ,  "error" );
              }

            }else{
              Swal.fire(outputResult.message,  "" ,  "error" );
            }

      });
	}


  sendOtpForAuthenticate(){

    //this.div_show_for_authenticate = !this.div_show_for_authenticate;
    this.isAuthenticate = false;
    this.sendSms();
  }

  sendSms(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('proposal_no',this.proposal_no);
    //sendData.append('mobile_no',this.result_proposal_details.proposer_mobile_no);
    //sendData.append('mobile_no','9028953146');
    this.commonService.sendOtpForAuthenticate(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any  = response;

      if(this.router.url == '/share/proposal'){
        this.router.navigate([output_result.customer_url]);
      }
      this.is_otp_send = output_result.status;
      this.otp_send_message = output_result.message;
      this.counter = output_result.remaining_time;
      this.removeMessage();
      if(this.is_otp_send){
        this.div_show_for_authenticate = true;
        this.countDown = timer(0, this.tick).subscribe(() =>
          this.timer = this.transform(--this.counter)
        );
      }else{
       this.div_show_for_authenticate = false;
      }

    });
  }



  removeMessage(){
    setTimeout (() => {
        this.otp_send_message = "";
        this.div_otp_message =true;
    }, 3000);

  }

  resetFormAuthenticate(){

    this.formAuthenticate.patchValue({
      digit_1 : '',
      digit_2 : '',
      digit_3 : '',
      digit_4 : ''
    });
  }

  submitFormAuthenticate(){

    this.submittedAuthenticate = true;
    if(this.formAuthenticate.invalid){
      this.div_otp_message = false;
      this.is_otp_send = false;
      this.otp_send_message = "Please Valid Enter OTP.";
      return;
    }else{
      this.div_otp_message = true;
      this.is_otp_send = true;
      this.otp_send_message = "";

    }

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('proposal_no',this.proposal_no);
    sendData.append('otp',this.formAuthenticate.value.digit_1+''+this.formAuthenticate.value.digit_2+''+this.formAuthenticate.value.digit_3+''+this.formAuthenticate.value.digit_4);
    this.commonService.submitFormAuthenticate(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any  = response;
      this.div_otp_message = false;
      this.is_otp_send = output_result.status;
      this.otp_send_message = output_result.message;
      if(output_result.status){
       this.isAuthenticate = true;
       // send to parent component
       this.parentIsAuthenticate.emit(this.isAuthenticate);
       //this.parentUniqueRefNo.emit(this.result_proposal_details.unique_ref_no);
       //this.div_show_for_authenticate = true;
      }else{
          this.resetFormAuthenticate();
      }

      this.removeMessage();

    });

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

    }else if(payment_method_id == 4 ){
      this.div_show_for_cheque = true;
      this.div_show_for_wallet = false;
      this.div_show_for_business_wallet = true;

      var xwallet_balance=this.wallet_balance/100;
      if(xwallet_balance < this.result_proposal_details.gross_premium){
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

    }
    else if (payment_method_id == 6) {
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

  updateRazorPayStatus(sendData){
    this.loaderActive = true;
    this.commonService.updateRazorPayStatus(sendData)
    .subscribe(response => {
      var output_data : any = response;
    });
  }

  createRzpayOrder_old(sendData){
    this.commonService.createRzpayOrder(sendData)
    .subscribe(response => {
      var output_data : any = response;
      console.log('output_Data '+output_data );
      if(output_data.status){

        if(output_data.razorpay_payment_id){
          var sendData = new FormData();
          sendData.append('payment_method_id','1');
          sendData.append('razorpay_order_id',output_data.razorpay_order_id);
          sendData.append('razorpay_payment_id',output_data.razorpay_payment_id);
          sendData.append('proposal_no',this.proposal_no);
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

  createRzpayOrder(sendData){
    this.commonService.createRzpayOrder(sendData)
    .subscribe(response => {
      var output_data : any = response;
      console.log('output_Data '+output_data );
      if(output_data.status){
        console.log(output_data);
        if(output_data.razorpay_payment_id){
          var sendData = new FormData();
          sendData.append('payment_method_id','1');
          sendData.append('razorpay_order_id',output_data.razorpay_order_id);
          sendData.append('razorpay_payment_id',output_data.razorpay_payment_id);
          sendData.append('proposal_no',this.proposal_no);
          sendData.append('payment_gateway_response', JSON.stringify(output_data.payment_gateway_response) );
          sendData.append('payment_gateway_request', JSON.stringify(output_data.payment_gateway_request) );
          sendData.append('loginUserId',this.loginUserId);
          this.submitFormPaymentForAll(sendData);


        }else if(!output_data.razorpay_order_id){
          this.loaderActive = false;
          Swal.fire({ title: 'Order is not created please try again.',icon: 'warning' });
        }else{
          this.payWithRazor(output_data.razorpay_order_id,output_data.order_amount_in_paisa);
        }

      }else{
        this.loaderActive = false;
        this.redirectToHome(output_data);
      }

    });
  }

  redirectToHome(output_data){
    Swal.fire({
      title: output_data.message,
      text: "",
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/home']);
      }
    })
  }

  payWithRazor(razorpay_order_id,order_amount_in_paisa) {
    //alert(razorpay_order_id);
    var logo_image :any = "assets/front/logo/mpn-logo.png";
    if(this.business_partner_code == 'ISUZU'){
      logo_image = "assets/front/logo/isuzu-logo.png";
    }
    //logo_image =
    console.log("razorpay_order_id payWithRazor :- "+razorpay_order_id);
    const options: any = {
      //key: 'rzp_test_ECAWq7iNii1iV3',
      key: this.razorpayKey,
      amount: order_amount_in_paisa, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: '',  // product description
      image: logo_image, // company logo or product image
      order_id: razorpay_order_id, // order_id created by you in backend
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

      var checkStatus = new FormData();
      checkStatus.append('order_id',razorpay_order_id);
      checkStatus.append('loginUserId',this.loginUserId);
      checkStatus.append('loginUserType',this.loginUserType);
      checkStatus.append('proposal_no',this.proposal_no);
      this.checkOrderStatusByOrderId(checkStatus,razorpay_order_id,response,options);

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
    const rzp = new this.commonService.nativeWindow.Razorpay(options);
    rzp.open();
  }


  checkOrderStatusByOrderId(sendData,razorpay_order_id,payment_gateway_response,options){
    this.loaderActive = true;
    this.commonService.checkOrderStatusByOrderId(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      this.loaderActive = false;
      this.loaderActive = false;

      var final_order_status :any =  response;

      if(final_order_status){

        this.loaderActive = false;
        if(final_order_status.status == true){

          sessionStorage.setItem('policy_id', final_order_status.policy_id);
          sessionStorage.setItem('policy_no', final_order_status.policy_no);
          //sessionStorage.setItem('transaction_no', final_order_status.response.transaction_no);

          if(this.router.url == this.customer_url_without_login){
             this.router.navigate(['/share/thank-you']);
          }else{
            this.router.navigate(['/thank-you']);
          }




        }else{

          var updateStatus = new FormData();
          updateStatus.append('order_id',razorpay_order_id);
          updateStatus.append('razorpay_order_id',razorpay_order_id);
          updateStatus.append('order_status','paid');
          updateStatus.append('loginUserId',this.loginUserId);
          this.updateRazorPayStatus(updateStatus);


          var sendData = new FormData();
          sendData.append('payment_method_id','1');
          sendData.append('razorpay_order_id',razorpay_order_id);
          sendData.append('proposal_no',this.proposal_no);
          sendData.append('payment_gateway_response', JSON.stringify(payment_gateway_response) );
          sendData.append('payment_gateway_request', JSON.stringify(options) );
          sendData.append('loginUserId',this.loginUserId);
          this.submitFormPaymentForAll(sendData);

        }
      }


    });
  }

  submitFormPayment(){
    this.submittedPayment = true;

    if(this.formPayment.invalid){
      return;
    }
    this.loaderActive = true;
    if((this.result_proposal_details.ic_id == 27 || this.result_proposal_details.ic_id == 26 || this.result_proposal_details.ic_id == 23 || this.result_proposal_details.ic_id == 20 || this.result_proposal_details.ic_id == 14 || this.result_proposal_details.ic_id == 33 || this.result_proposal_details.ic_id == 11 || this.result_proposal_details.ic_id == 8) && this.payment_method_id==1){
      var sendOrientalData = new FormData();
      sendOrientalData.append('loginUserId',this.loginUserId);
      sendOrientalData.append('proposal_no',this.proposal_no);
      sendOrientalData.append('proposal_id',this.proposal_id);

      this.commonService.submitFormOrientalPayment(sendOrientalData).subscribe(response => {
        var output_result : any  = response;
        if(!output_result.is_payment && output_result.status){
          sendOrientalData.append('payment_method_id',this.formPayment.value.payment_method_id);
          sendOrientalData.append('transaction_no',output_result.transaction_no);
          sendOrientalData.append('terms_and_conditions','1');
          this.submitFormPaymentForAll(sendOrientalData);
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 27){
          window.location.href=output_result.proposal_details.pg_url+'?msg='+output_result.proposal_details.paymentString;
          return false;
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 23){
            var form = $('<form method="post" action="'+output_result.proposal_details.pg_url+'" name="frmTransaction" id="frmTransaction"><input name="PolicySysID" type="hidden" value="'+output_result.proposal_details.PolicySysID+'" /><input name="ReturnURL" type="hidden" value="'+output_result.proposal_details.ReturnURL+'" /></form>');
            $('body').append(form);
            $(form).submit();
          return false;
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 14){
            var form = $('<form method="post" action="'+output_result.proposal_details.pg_url+'" name="PostForm" id="PostForm"><input name="txnid" type="hidden" value="'+output_result.proposal_details.txn_id+'" /><input name="quotationNumber" type="hidden" value="'+output_result.proposal_details.proposal_no+'" /><input name="amount" type="hidden" value="'+output_result.proposal_details.amount+'" /><input name="productinfo" type="hidden" value="Payment for Liberty GI" /><input name="key" type="hidden" value="TPService" /><input name="SURL" type="hidden" value="'+output_result.proposal_details.ReturnURL+'" /><input name="FURL" type="hidden" value="'+output_result.proposal_details.ReturnURL+'" /><input name="FirstName" type="hidden" value="'+output_result.proposal_details.first_name+'" /><input name="Email" type="hidden" value="'+output_result.proposal_details.email+'" /><input name="Phone" type="hidden" value="'+output_result.proposal_details.mobile_no+'" /><input name="customerID" type="hidden" value="'+output_result.proposal_details.customer_id+'" /></form>');
            $('body').append(form);
            $(form).submit();
          return false;
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 11){
            var form = $('<form method="post" action="'+output_result.proposal_details.pg_url+'" name="proposalForm" id="proposalForm">'+output_result.proposal_details.paymentString+'</form>');
            $('body').append(form);
            $(form).submit();
          return false;
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 8){
            var form = $('<form method="post" action="'+output_result.proposal_details.pg_url+'" name="form1" id="form1"><input id="CustomerId" value="'+output_result.proposal_details.proposal_no+'" name="CustomerId"><input id="TxnAmount" value="'+output_result.proposal_details.amount+'" name="TxnAmount"><input id="AdditionalInfo1" value="" name="AdditionalInfo1"><input id="AdditionalInfo2" value="MOT" name="AdditionalInfo2"><input id="AdditionalInfo3" value="1" name="AdditionalInfo3"><input id="hdnPayMode" value="'+output_result.proposal_details.hdnPayMode+'" name="hdnPayMode"><input id="UserName" value="'+output_result.proposal_details.UserName+'" name="UserName"><input id="UserMailId" value="'+output_result.proposal_details.UserMailId+'" name="UserMailId"><input id="ProductCd" value="'+output_result.proposal_details.ProductCd+'" name="ProductCd"><input id="ProducerCd" value="'+output_result.proposal_details.ProducerCd+'" name="ProducerCd"><input id="AgentCode" value="'+output_result.proposal_details.agent_code+'" name="AgentCode"></form>');
            $('body').append(form);
            $(form).submit();
          return false;
        }        

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 26){
          window.location.href=output_result.proposal_details.pg_url+'?msg='+output_result.proposal_details.paymentString;
          return false;
        }


        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 20){
          window.location.href=output_result.proposal_details.pg_url;
          return false;
        }

        if(output_result.status && output_result.is_payment && this.result_proposal_details.ic_id == 33){
          window.location.href=output_result.proposal_details.pg_url;
          return false;
        }

      });
      return false;
    }
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    if(!this.is_from_proposal_page){
      sendData.append('payment_method_id',this.formPayment.value.payment_method_id);
      sendData.append('terms_and_conditions',this.formPayment.value.terms_and_conditions);
      sendData.append('proposal_no',this.proposal_no);
      sendData.append('payment_from','proposal_share');

    }else{
      sendData.append('bank_id',this.formPayment.value.bank_id);
      sendData.append('bank_city',this.formPayment.value.bank_city);
      sendData.append('cheque_number',this.formPayment.value.cheque_number);
      sendData.append('cheque_date',this.formPayment.value.cheque_date);
      sendData.append('payment_method_id',this.formPayment.value.payment_method_id);
      sendData.append('terms_and_conditions',this.formPayment.value.terms_and_conditions);
      sendData.append('proposal_no',this.proposal_no);
      sendData.append('payment_from','propsal_page');
    }
    sendData.append('selected_ic_id',this.selected_ic_id);

    console.log("payment_method_id: "+this.formPayment.value.payment_method_id);
    if(this.formPayment.value.payment_method_id == 1){
        this.createRzpayOrder(sendData);
    }else{
      this.submitFormPaymentForAll(sendData);
    }


  }

  submitFormPaymentForAll(sendData){
    this.loaderActive = true;
    this.commonService.submitFormPayment(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any  = response;


      if(output_result.status){
        sessionStorage.setItem('policy_id', output_result.response.insered_id);
        sessionStorage.setItem('policy_no', output_result.response.policy_no);
        sessionStorage.setItem('transaction_no', output_result.response.transaction_no);

        if(this.router.url == this.customer_url_without_login){
           this.router.navigate(['/share/thank-you']);
        }else{
          this.router.navigate(['/thank-you']);
        }

      }else{

        console.log(output_result.message);

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

    this.router.navigate([this.result_proposal_details.quote_form_navigate_url]);

    // if(this.product_type_id == '2' || this.product_type_id == 2){
    //   this.router.navigate(['/bike-insurance-quote']);
    // }
    // if(this.product_type_id == '1' || this.product_type_id == 1){
    //   this.router.navigate(['/car-insurance-quote']);
    // }

    // if(this.result_proposal_details.is_quick_quote == 0 || this.result_proposal_details.is_quick_quote == '0'){
    //   this.router.navigate(['/'+this.result_proposal_details.full_quote_nex_url]);
    // }else{
    //   this.router.navigate(['/customer-detail-motor']);
    // }

  }

}
