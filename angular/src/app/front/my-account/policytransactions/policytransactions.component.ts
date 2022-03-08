import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {ExcelService} from '../../services/excel.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';

@Component({
  selector: 'app-policytransactions',
  templateUrl: './policytransactions.component.html',
  styleUrls: ['./policytransactions.component.css']
})
export class PolicyTransactionsComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;
  unique_ref_no : any;
  quote_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;

  date_picker_startDate: NgbDateStruct;
  date_picker_endDate: NgbDateStruct;

  is_from_quote_page :  boolean = true;
  loaderActive: boolean = false;
  displayForwardQuote : any = 'none';
  formForwardQuote : any;
  submittedForwardQuoteEmail :  boolean = false;
  submittedForwardQuoteSms :  boolean = false;
  result_quote_details : any;
  result_payment_types : any;
  success_message: any;
  error_message: any;
  formForwardQuoteEmail: any;
  formForwardQuoteSms: any;
  policytransactionsdata : any;
  atLeastOneRequired : any;
  formRecodEdit : any;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";


  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;
  filter_user_type = '';
  filter_payment_method = '';

  result_user_type : any;
  user_type : any;
  result_pay_method : any;
  pay_method : any;
  startDate : any;
  endDate : any;

  constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) { }


  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.getIndex();
    this.getFilterData();
    this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
    this.quote_no  = sessionStorage.getItem('quote_no');
    this.validateProposal();
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

   validateProposal(){
    //
    this.formForwardQuoteEmail = this.formBuilder.group({
      email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required,Validators.email]],
    });
    this.formForwardQuoteSms = this.formBuilder.group({
      mobile_no : ['',[Validators.pattern(this.validation_for_mobile_no), Validators.required]],
    });

  }

  getFilterData()
  {
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);

    this.commonService.getWalletFilterData(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      var result : any = response;
      this.result_user_type = result.user_type;
      this.result_pay_method = result.payment_method;

    });
  }


  getIndex(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'getPolicyTransactions',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,

          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Policy Number',
              'data' : 'policy_no'
            },
            {
              'title' : 'Proposal Numebr',
              'data' : 'proposal_no'
            },

            {
              'title' : 'Payment Transaction',
              'data' : 'payment_transaction_no'
            },
            {
              'title' : 'Razorpay Order Id',
              'data' : 'razorpay_order_id'
            },
            {
              'title' : 'Payment Method',
              'data' : 'type'
            },
            {
              'title' : 'Policy Status',
              'data' : 'label'
            },
            {
              'title' : 'Payment Transaction Amount',
              'data' : 'payment_transaction_amount'
            },
            {
              'title' : 'Payment Date',
              'data' : 'payment_transaction_date'
            },
          ],
          columnDefs: [
            { "orderable": false, "targets": 0 },

          ],
          order: [[ 8, "desc" ]]
      };


  }


  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-quote-id")) {
            this.viewQuote(event.target.getAttribute("view-quote-id"));
        }
        if (event.target.hasAttribute("view-forword-id")) {
          sessionStorage.setItem('unique_ref_no', event.target.getAttribute("view-forword-id"));
          this.formForwardQuoteSms.patchValue({
            mobile_no : event.target.getAttribute("view-mobile-no")
          });
          this.formForwardQuoteEmail.patchValue({
            email_1 : event.target.getAttribute("view-email-id")
          });

          // this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        if (event.target.hasAttribute("view-delete-id")) {
          // this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        }
        if (event.target.hasAttribute("view-active-id")) {
          // this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          // this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
    });
  }


  viewQuote(uniqe_ref_no){
      sessionStorage.setItem('unique_ref_no', uniqe_ref_no);
      this.router.navigateByUrl('/quotation');
  }


  onParentIsAuthenticate(isAuthenticate : boolean){
    this.isAuthenticate = isAuthenticate;
    this.div_show_for_authenticate = !isAuthenticate;

  }




  openForwardQuoteModal(){
    this.displayForwardQuote = 'block';
  }

  closePopupForwardQuote(){
    this.closebutton.nativeElement.click();
    this.displayForwardQuote='none';
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  // resetFormForwardProposal(){
  //   this.submittedForwardQuote = false;
  //   this.formForwardQuote.patchValue({
  //     email_2 : ''
  //   });

  // }
  submitFormForwardQuoteEmail(){

      this.submittedForwardQuoteEmail = true;
      if(this.formForwardQuoteEmail.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('email_1',this.formForwardQuoteEmail.value.email_1);
      this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
      sendData.append('unique_ref_no',this.unique_ref_no);

      this.commonService.submitFormForwardQuote(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success_message = outputResult.message;
          this.removeMessage();
        }else{
          this.error_message = outputResult.message;
        }

      });

  }

  submitFormForwardQuoteSms(){

      this.submittedForwardQuoteSms = true;
      if(this.formForwardQuoteSms.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('mobile_1',this.formForwardQuoteSms.value.mobile_no);
      this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
      sendData.append('unique_ref_no',this.unique_ref_no);

      this.commonService.submitFormSmsForwardQuote(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success_message = outputResult.message;
          this.removeMessage();
        }else{
          this.error_message = outputResult.message;
        }

      });

  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      this.closePopupForwardQuote();
    }, 2000);

  }


  getFilteruserTypeResult(event)
  {
    var selected_value : any = event.target.value;
    this.filter_user_type = selected_value = selected_value.trim();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(0).search(selected_value).draw();
    });
  }

  getFilterpaymentMethodResult(event)
  {
    var selected_value : any = event.target.value;
    this.filter_payment_method = selected_value = selected_value.trim();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search(selected_value).draw();
    });
  }

  getFilterStartDateResult(event)
  {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    this.startDate = year + "-" + month + "-" + day;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(2).search(this.startDate).draw();
    });
  }

  getFilterEndDateResult(event)
  {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    this.endDate = year + "-" + month + "-" + day;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(3).search(this.endDate).draw();
    });
  }


  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('filter_user_type',this.filter_user_type);
    sendData.append('filter_payment_method',this.filter_payment_method);
    sendData.append('startDate',this.startDate);
    sendData.append('endDate',this.endDate);

    this.commonService.PolicytransactionsData(sendData)
          .subscribe( response => {
      this.policytransactionsdata = response;
      //console.log(this.modelsdata);
     this.excelService.exportAsExcelFile(this.policytransactionsdata, 'PolicyTransactionsdata');
    });
  }

}
