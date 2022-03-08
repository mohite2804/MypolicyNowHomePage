import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {ExcelService} from '../../services/excel.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';

@Component({
  selector: 'app-razorpay-statement',
  templateUrl: './razorpay-statement.component.html',
  styleUrls: ['./razorpay-statement.component.css']
})
export class RazorpayStatementComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;

  dtRendered = true;

  unique_ref_no : any;
  quote_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;
  submitted : boolean = false;

  date_picker_startDate: NgbDateStruct;
  date_picker_endDate: NgbDateStruct;
  
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  
  maxDate : any;
  minDate : any;
  minCurrentDate:any;

  endDate : any;
  startDate : any;

  setNullDate : any;
  $data :any;

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
  walletStatementdata : any;
  atLeastOneRequired : any;
  formRecodEdit : FormGroup;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";


  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;
  filter_payment_method = '';
  user_type : any;
  pay_method : any;
  // startDate : any;
  // endDate : any;
  is_misp_login: boolean = false; 

  constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService,public cdr: ChangeDetectorRef ) {

    this.setNullDate = {
      year: "",
      month: "",
      day: ""
    };

    const current = new Date();
    this.minCurrentDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
   }


  ngOnInit(): void {

    const current = new Date();

    this.maxDate =this.maxDatePolicyTo = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.minDate = this.minDatePolicyFrom =  {
      year: current.getFullYear() - 1,
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');

    if(this.loginUserType == '1')
    {
      this.is_misp_login = false;
    }
    else if(this.loginUserType == '5'){
      this.is_misp_login = true;
    }
    else
    {
      this.is_misp_login = false; 
    }
    this.token = sessionStorage.getItem("user_token");

    this.validateUserLoginStatus(this.loginUserId,this.token);

    // this.submitFormFilter();
    this.getIndex();
    this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
    this.quote_no  = sessionStorage.getItem('quote_no');
    this.validateProposal();
    this.formRecodEdit = this.formBuilder.group({
      // filter_txn_type : [''],
      startDate : ['',[Validators.required]],
      endDate : ['',[Validators.required]],
    });
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

  getIndex(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {        
          "pagingType": 'simple',
          "pageLength": 100,
          "serverSide": true,
          "processing": true,
          "searching": false,
          "info": false,
          "lengthChange": false,
          'ajax' : {
              url : this.base_url+'getCustomerWalletStatement',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
              "startDate": this.startDate,
              "endDate": this.endDate
          },
              dataType: "json",
          },


          columns: [
            {
              'title' : 'S.No',
              'data' : 'sr_no'
            },

            {
              'title' : 'Amount',
              'data' : 'amount'
            },
            {
              'title' : 'Txn No',
              'data' : 'id'
            },
            {
              'title' : 'Txn Type',
              'data' : 'type'
            },
            {
              'title' : 'Description',
              'data' : 'description'
            },
           
            {
              'title' : 'Txn Status',
              'data' : 'type'
            },
            {
              'title' : 'Balance',
              'data' : 'balance'
            },
             
            {
              'title' : 'Payment Date',
              'data' : 'created_at'
            }
          ],

          columnDefs: [
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 7, "desc" ]]
      };


  }


submitFormFilter(){
    if(this.formRecodEdit.value.startDate!='' && this.formRecodEdit.value.startDate!=null && this.formRecodEdit.value.startDate!=undefined){
      this.startDate = this.formRecodEdit.value.startDate;
    }
    else{
      this.startDate = "2021-01-01";
    }

    if(this.formRecodEdit.value.endDate!='' && this.formRecodEdit.value.endDate!=null && this.formRecodEdit.value.endDate!=undefined){
      this.endDate = this.formRecodEdit.value.endDate;
    }
    else{
      this.endDate = "";
    }
    if( (this.startDate!='' && this.startDate!=null && this.startDate!=undefined) || (this.endDate!='' && this.endDate!=null && this.endDate!=undefined) ) {       
        //this.loaderActive = true;
         this.dtRendered = false;

        this.dtOptions = {        
          "pagingType": 'simple',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          "searching": false,
          "info": true,
          "lengthChange": false,
          'ajax' : {
              url : this.base_url+'getCustomerWalletStatement',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
              "startDate": this.startDate,
              "endDate": this.endDate
          },
              dataType: "json",
          },


          columns: [
            {
              'title' : 'S.No',
              'data' : 'sr_no'
            },

            {
              'title' : 'Amount',
              'data' : 'amount'
            },
            {
              'title' : 'Txn No',
              'data' : 'id'
            },
            {
              'title' : 'Txn Type',
              'data' : 'type'
            },
            {
              'title' : 'Description',
              'data' : 'description'
            },
           
            {
              'title' : 'Txn Status',
              'data' : 'type'
            },
            {
              'title' : 'Balance',
              'data' : 'balance'
            },
             
            {
              'title' : 'Payment Date',
              'data' : 'created_at'
            }



          ],

          columnDefs: [
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 7, "desc" ]]
      };


        this.cdr.detectChanges();
        // initialize them again
        this.dtRendered = true
        this.cdr.detectChanges();
        this.loaderActive = false;
        
    } else {

      Swal.fire("At least one field is required ", '', "error");
      return;
    }
    
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

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('startDate',this.startDate);
    sendData.append('endDate',this.endDate);

    this.commonService.getRozarpayWalletExport(sendData)
          .subscribe( response => {
      this.walletStatementdata = response;
      if(this.walletStatementdata.status)
      {
        this.excelService.exportAsExcelFile(this.walletStatementdata.result, 'walletStatementdata');
        Swal.fire({position: 'center',icon: 'success',title: this.walletStatementdata.message, showConfirmButton: false, timer: 3000 });
      }
      else
      {
        Swal.fire({position: 'center',icon: 'error',title: this.walletStatementdata.message, showConfirmButton: false, timer: 3000 });
      }


    });
  }

  resetFilterForm(){
        

        this.filter_payment_method = '';
        this.startDate = '';
        this.endDate = '';

        this.formRecodEdit.patchValue({
          startDate : [''],
          endDate : [''],
        });

        // this.submitted = false;
        // this.formRecordEdit.reset();


        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search('');
            dtInstance.columns(1).search('');
            dtInstance.columns(2).search('');
            dtInstance.columns(3).search('');
            dtInstance.draw();
        });
    }

  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    if(field == 'start_date'){
      this.date_picker_startDate =  selected_date;
      this.formRecodEdit.patchValue({ startDate : selected_date });
      this.validationEnddate(selected_date);
      
    }
    if(field == 'end_date'){
      this.date_picker_endDate =  selected_date;
      this.formRecodEdit.patchValue({ endDate : selected_date });
    }
  }

  validationEnddate(selected_date){
    var date2 : any = new Date(selected_date);
    this.formRecodEdit.patchValue({
      endDate : ''
    });
    this.date_picker_endDate =  this.setNullDate;
      date2.setDate( date2.getDate());
      this.maxDatePolicyTo = {
        year: date2.getFullYear(),
        month: date2.getMonth() + 1,
        day: date2.getDate() 
      }
      var date3 : any = new Date(selected_date);
      var date4 = new Date();
      //console.log(this.minCurrentDate);
      var Time = date4.getTime() - date3.getTime(); 
      var Days = Time / (1000 * 3600 * 24); //Diference in Days
      if(Days > 365 ){

        //console.log(date3.getMonth());

        var temp = date3.getMonth();
        console.log(temp);
        if(temp > 9){
        this.minCurrentDate = {
        year: date3.getFullYear() + 1,
        month: date3.getMonth() - 9,
        day: date3.getDate()
        }
        }
        else if(temp == 9){
          this.minCurrentDate = {
          year: date3.getFullYear() + 1,
          month: date3.getMonth() - 8,
          day: date3.getDate()
        }
      }
      else if(temp < 9){
        this.minCurrentDate = {
        year: date3.getFullYear(),
        month: date3.getMonth() + 4,
        day: date3.getDate()
        }
        }
       
        console.log(this.minCurrentDate.month);
      
      }

    }

refreshPage() {
   window.location.reload();
  }
}
