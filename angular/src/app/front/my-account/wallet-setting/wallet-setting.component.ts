import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';

import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-wallet-setting',
  templateUrl: './wallet-setting.component.html',
  styleUrls: ['./wallet-setting.component.css']
})
export class WalletSettingComponent implements OnInit {

  base_url = environment.baseUrl;


  razor_pay_order_id : any;
  razorpayKey : any =  environment.razorpayKey;
  permissionDeniedMsg = environment.permissionDeniedMsg;


  formRecodEdit : any;
  formRecodEditWithdraw : any;
  submitted : boolean = false;
  loaderActive : boolean = false;
  loginUserId: any;
  loginUserType: any;
  is_account_available : boolean = true;
  //razor_customer_id : any;
  wallet_statements : any = [];
  wallet_no_of_records : any;
  add_amount : any;
  validation_for_number_only :any = "^[0-9]*$";

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  selectedFromDate : any;
  selectedToDate : any;
  business_partner_code : any;
  final_order_status : any;


  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    this.loadPaymentScripts();

    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);

  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;

      this.fromDate = date;
    }


  }



  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
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

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.business_partner_code = sessionStorage.getItem('business_partner_code');


      this.validationForm();
      this.getIndex();



  }

  validationForm(){
    this.formRecodEdit = this.formBuilder.group({
      add_amount : ['',[
        Validators.required,
        Validators.pattern(this.validation_for_number_only),
        Validators.min(1),
        Validators.max(999999999999999)]]

    });
  }




  resetForm(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      add_amount : ""
    });

  }

  getIndex(){
    //this.submitDateRange();
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    ////uploadData.append('razor_customer_id',this.razor_customer_id);
      this.commonService.getWalletDetails(uploadData)
      .subscribe(response => {
        this.loaderActive = false;
        var output_data : any = response;
        this.is_account_available = output_data.is_account_available;

      });

  }

  createWalletAccount(){
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    //uploadData.append('razor_customer_id',this.razor_customer_id);

    this.commonService.createWalletAccount(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      this.is_account_available = false;
      var output_data : any = response;
      this.wallet_statements = output_data.wallet_statements;

      if(output_data.status){
        //sessionStorage.setItem('razor_customer_id', output_data.razor_customer_id);
        //this.razor_customer_id = output_data.razor_customer_id;
        Swal.fire({
          title: output_data.message,
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.getIndex();
          }
        })
        //Swal.fire({position: 'center',icon: 'success',title: output_data.message, showConfirmButton: true, timer: 3000 });
        //this.getIndex();

      }else{
        Swal.fire({position: 'center',icon: 'error',title: output_data.message, showConfirmButton: true, timer: 3000 });
      }

    });

  }


  generateOrderId(){
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    //uploadData.append('razor_customer_id',this.razor_customer_id);
    this.commonService.generateOrderId(uploadData)
    .subscribe(response => {
      var output_data : any = response;
      this.wallet_statements = output_data.wallet_statements;
    });
  }

  addWalletAccount(){

    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    //uploadData.append('razor_customer_id',this.razor_customer_id);
    this.add_amount = this.formRecodEdit.value.add_amount;

    uploadData.append('add_amount',this.add_amount);

    this.commonService.createRzpayOrderForAddAmountInWallet(uploadData)
    .subscribe(response => {
      var output_data : any = response;
      if(output_data.is_error == true){
        this.loaderActive = false;
        //alert(output_data.error.description);
        console.log("-----output_data-----------");
        console.log(output_data);
        Swal.fire(output_data.error.description, '', 'error');

      }else{
        this.loaderActive = true;
        console.log("-----output_data-----------");
        console.log(response);
        this.payWithRazor(response);
        this.resetForm();
      }

    });



  }

  //payWithRazor(razor_order_id) {
    async payWithRazor(order_detail) {
    console.log("order_id payWithRazor :- "+order_detail.order_id);
    var logo_image :any = "assets/front/logo/mpn-logo.png";
    if(this.business_partner_code == 'ISUZU'){
      logo_image = "assets/front/logo/isuzu-logo.png";
    }

    const options: any = {
      key: this.razorpayKey,
      amount: this.add_amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: order_detail.company_name, // company name or product name
      description: order_detail.description,  // product description
      image: logo_image, // company logo or product image

      order_id: order_detail.order_id, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: order_detail.order_notes,
      theme: {
        color: '#0c238a'
      }
    };

    options.handler = ((response, error) => {

      this.loaderActive = false;

      var checkStatus = new FormData();
      checkStatus.append('order_id',order_detail.order_id);
      checkStatus.append('loginUserId',this.loginUserId);
      checkStatus.append('loginUserType',this.loginUserType);
      this.checkOrderStatusByOrderId(checkStatus,response,options,order_detail.order_id);

    });
    options.modal.ondismiss = (() => {

      location.reload();

      // handle the case when user closes the form while transaction is in progress
      // var updateStatus = new FormData();
      // updateStatus.append('order_id',order_detail.order_id);
      // updateStatus.append('order_status','failed');
      // this.updateRazorPayStatus(updateStatus);

      // console.log('Transaction cancelled.');
      // this.loaderActive = false;
      // Swal.fire({
      //   title: 'Transaction cancelled',
      //   text: "",
      //   icon: 'error',
      //   showCancelButton: false,
      //   confirmButtonColor: '#3085d6',
      //   confirmButtonText: 'OK'
      // }).then((result) => {
      //   if (result.isConfirmed) {

      //   }
      // })
    });
    const rzp = new this.commonService.nativeWindow.Razorpay(options);
    rzp.open();
  }

  transferToCustomerAccount(add_amount,payment_gateway_response,payment_gateway_request,razor_pay_order_id){
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    //uploadData.append('razor_customer_id',this.razor_customer_id);
    uploadData.append('add_amount',add_amount);
    uploadData.append('payment_gateway_response', JSON.stringify(payment_gateway_response) );
    uploadData.append('payment_gateway_request', JSON.stringify(payment_gateway_request) );

    this.commonService.transferToCustomerAccount(uploadData)
    .subscribe(response => {
      var output_data : any = response;
      this.loaderActive = false;

      if(output_data.status == true){


        Swal.fire({
          title: add_amount+" Amount added successfully.",
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });


        var updateStatus = new FormData();
        updateStatus.append('order_id',razor_pay_order_id);
        updateStatus.append('order_status','paid');
        this.updateRazorPayStatus(updateStatus);


      }else{

        Swal.fire({
          title: output_data.message,
          text: "",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });

      }




    });
  }

  updateRazorPayStatus(sendData){
    this.commonService.updateWalletPayStatus(sendData)
    .subscribe(response => {
      var output_data : any = response;
    });
  }



  checkOrderStatusByOrderId(sendData,payment_response,options,razor_pay_order_id){
    this.loaderActive = true;
    this.commonService.checkOrderStatusByOrderId(sendData)
    .subscribe(response => {
      var final_order_status :any =  response;

      if(final_order_status){

        this.loaderActive = false;
        this.loaderActive = false;
        this.loaderActive = false;

        if(final_order_status.status === true){

          Swal.fire({
            title: this.add_amount+" amount added successfully.",
            text: "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          })
        }else{
          this.transferToCustomerAccount(this.add_amount,payment_response,options,razor_pay_order_id);
        }
      }


    });
  }




  withdrawWalletAccount(){


    this.submitted = true;
    if(this.formRecodEditWithdraw.invalid){
      return;
    }
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);

    this.add_amount = this.formRecodEditWithdraw.value.add_amount;

    uploadData.append('add_amount',this.add_amount);

    this.commonService.withdrawAmountFromWallet(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_data : any = response;
      if(output_data.is_error == true){


        console.log("-----output_data-----------");
        console.log(output_data);

        Swal.fire({
          title: output_data.message,
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        })

      }else{
        Swal.fire(output_data.message, '', 'error');
      }

    });

  }


}
