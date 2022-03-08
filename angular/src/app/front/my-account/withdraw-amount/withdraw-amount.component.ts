
import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
//import { CustomvalidationService } from '../../../front/services/customvalidation.service';

import { CustomvalidationService } from '../../services/customvalidation.service';


@Component({
  selector: 'app-withdraw-amount',
  templateUrl: './withdraw-amount.component.html',
  styleUrls: ['./withdraw-amount.component.css']
})
export class WithdrawAmountComponent implements OnInit {

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;


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

  wallet_statements : any = [];
  wallet_no_of_records : any;
  add_amount : any;
  validation_for_number_only :any = "^[0-9]*$";


  selectedFromDate : any;
  selectedToDate : any;
  business_partner_code : any;
  final_order_status : any;

  display : any;
  popupTitle : any;
  msgClass: any;
  responseMsg : any;
  btnEditSubmit : boolean = false;
  name_invoicelabel:any;
  name_invoiceurl_label : any;
  invoiceurl:any;

  bankDetailsData : any;
  constructor(private customvalidationService: CustomvalidationService,private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    this.loadPaymentScripts();
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
      this.validationWithdrawForm();
      this.validationForm();
      this.getIndex();
  }

  getIndex(){

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    this.commonService.getFundAccountDetails(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_data : any = response;
      this.is_account_available = output_data.is_account_available;

    });

  }

  getIndex_old(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'getFundAccountDetails',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr. No.',
              'data' : 'sno'
            },
            {
              'title' : 'Account Holder Name',
              'data' : 'acc_holder_name'
            },
            {
              'title' : 'Account Number',
              'data' : 'account_no'
            },
            {
              'title' : 'IFSC Code',
              'data' : 'ifsc_code'
            },

            {
              'title' : 'Bank Name',
              'data' : 'bank_name'
            },

            {
              'title' : 'Branch Name',
              'data' : 'branch_name'
            },


            {
              'title' : 'Created Date',
              'data' : 'created_date'
            },
            // {
            //   'title' : 'Action',
            //   'data' : 'action_btn'
            // }
          ],
          columnDefs: [
            { "orderable": false, "targets": [0] }
          ],
          order: [[ 1, "desc" ]]
      };
  }



  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
    });

  }



  validationForm(){
    this.formRecodEdit = this.formBuilder.group({


      acc_holder_name : ['',[Validators.required,Validators.pattern("^[a-zA-Z ]{2,25}$"),]],


      account_no : ['',[this.customvalidationService.cannotContainZero(),this.customvalidationService.cannotContainSpace(),Validators.minLength(9), Validators.maxLength(18),Validators.required,Validators.pattern("^[0-9 ]*$")]],
      ifsc_code : ['',[Validators.required,Validators.pattern("^[A-Za-z]{4}0[a-zA-Z0-9]{6}$"),]],
      bank_name : ['',[Validators.required]],
      branch_name : ['',[Validators.required]],
      upload_cancel_cheque : ['',[Validators.required]]

    });
  }



  validationWithdrawForm(){
    this.formRecodEditWithdraw = this.formBuilder.group({
      add_amount : ['',[
        Validators.required,
        Validators.pattern(this.validation_for_number_only),
        Validators.min(1),
        Validators.max(999999999999999)]]

    });
  }


  resetForm(){

    this.formRecodEditWithdraw.patchValue({
      add_amount : ""
    });

  }



  getBankDetails(ifsccode){

    var is_vallid :any = this.formRecodEdit.controls.ifsc_code.status;
    console.log(is_vallid)

      if(is_vallid != "INVALID" && ifsccode.length == 11 ){

        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('ifsc_code',ifsccode);
        this.commonService.getBankDetails(sendData)
          .subscribe( response => {
          this.loaderActive = false;
          this.bankDetailsData = response;
          if(this.bankDetailsData.status){
            this.formRecodEdit.patchValue({
                branch_name : this.bankDetailsData.result.branch,
                bank_name :this.bankDetailsData.result.bank
              });

          }else{
            this.formRecodEdit.patchValue({
                bank_branch : '',
                bank_name :''

              });


          }

        });

      }
    }



  createFundAccount(){
    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);

    this.commonService.createFundAccount(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
      this.is_account_available = false;
      var output_data : any = response;
      this.wallet_statements = output_data.wallet_statements;

      if(output_data.status){
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
      }else{
        Swal.fire({position: 'center',icon: 'error',title: output_data.message, showConfirmButton: true, timer: 3000 });
      }

    });

  }


  withdrawAmountFromWallet(){


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
      if(output_data.status == true){

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
            this.resetForm();
          }
        })

      }else{
        Swal.fire(output_data.message, '', 'error');
      }

    });

  }



  submitForm(){
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      console.log(this.formRecodEdit);
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('acc_holder_name',this.formRecodEdit.value.acc_holder_name);
    sendData.append('account_no',this.formRecodEdit.value.account_no);
    sendData.append('ifsc_code',this.formRecodEdit.value.ifsc_code);
    sendData.append('bank_name',this.formRecodEdit.value.bank_name);
    sendData.append('branch_name',this.formRecodEdit.value.branch_name);
    sendData.append('upload_cancel_cheque',this.formRecodEdit.value.upload_cancel_cheque);

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);

    this.commonService.createFundAccount(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      var editResult :any = response;
      if(editResult.status){
        this.getIndex();
        this.closePopup();
        Swal.fire(editResult.message);
      }else{
        this.msgClass = "alert-danger";
        this.responseMsg = editResult.message;
      }
    });


  }


  openPopup(){
    //alert('inn');
    this.btnEditSubmit = true;
    this.resetFormWithdrowAmount();
    this.popupTitle = "Add Refund Account";
    this.display='none';

  }

  closePopup(){
    this.closebutton.nativeElement.click();
    this.display='block';
    this.resetFormWithdrowAmount();
  }

  resetFormWithdrowAmount(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      acc_holder_name : "",
      account_no : "",
      ifsc_code : "",
      bank_name : "",
      branch_name : "",
      upload_cancel_cheque : "",
    });
  }


  uploadInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.invoiceurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.invoiceurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.invoiceurl = event.target.result;
      }
      this.name_invoiceurl_label = file.name;
      this.formRecodEdit.patchValue({
        'upload_cancel_cheque' : file
      });
    }


  }

}
