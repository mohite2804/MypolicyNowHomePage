import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../front/services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-razorpay-statement',
  templateUrl: './razorpay-statement.component.html',
  styleUrls: ['./razorpay-statement.component.css']
})
export class RazorpayStatementComponent implements OnInit {

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  razorpayKey : any =  environment.razorpayKey;
  permissionDeniedMsg = environment.permissionDeniedMsg;


  formRecodEdit : any;
  submitted : boolean = false;
  loaderActive : boolean = false;
  loginUserId: any;
  loginUserType: any;
  is_account_available : boolean = true;
  razor_customer_id : any;
  wallet_statements : any = [];
  wallet_no_of_records : any;
  add_amount : any;
  validation_for_number_only :any = "^[0-9]*$";

  hoveredDate: NgbDate | null = null;
  selectedFromDate: NgbDate;
  selectedToDate: NgbDate | null = null;
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  maxDate : any;
  minDate : any;

  wallet_from : any;
  wallet_to : any;

  atLeastOneRequired : any;
  walletStatementdata : any;

  filter_wallet_from : any;
  filter_wallet_to : any;

  filter_txn_purpose : any;
  result_txn_purpose : any;
  txn_purpose : any;

  filter_txn_type : any;
  result_txn_type : any;
  txn_type : any;
  toDate : any;
  fromDate : any;
  loginIcId : any;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loadPaymentScripts();
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);

  }
  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromDate = date;
  //   } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
  //     this.toDate = date;
  //   } else {
  //     this.toDate = null;
  //     this.fromDate = date;
  //   }
  // }



  // isHovered(date: NgbDate) {
  //   return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  // }

  // isInside(date: NgbDate) {
  //   return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  // }

  // isRange(date: NgbDate) {
  //   return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  // }

  // validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
  //   const parsed = this.formatter.parse(input);
  //   return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  // }


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
    this.loginUserId = sessionStorage.getItem('adminUserId');
    this.loginUserType = sessionStorage.getItem('adminUserTypeId');
    this.loginIcId = sessionStorage.getItem("icId");

      this.validationForm();
      //this.getIndex();
      this.getRozarpayWalletStatement();
      this.getFilterData();

      this.formRecodEdit = this.formBuilder.group({
            filter_txn_type : [''],
            filter_txn_purpose : [''],
            wallet_from : [''],
            wallet_to : [''],
      });
      // if(this.razor_customer_id){
      //   this.getWalletStatement();
      // }

      const current = new Date();

      this.maxDate = this.maxDatePolicyTo = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.minDate = this.minDatePolicyFrom =  {
        year: current.getFullYear() - 2,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
  }


  // submitDateRange(){
  //   this.dateRangeSelect();

  // }



  // dateRangeSelect(){

  //   if(this.fromDate == null || this.toDate == null){
  //     Swal.fire ("Please select valid date range",  "" ,  "error" );
  //   }else{
  //     var frm_date_to_date :any = [];
  //     frm_date_to_date.push({
  //       fromDate: JSON.stringify(this.fromDate),
  //       toDate: JSON.stringify(this.toDate)

  //     });
  //     frm_date_to_date = JSON.stringify(frm_date_to_date);

  //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         dtInstance.columns(0).search(frm_date_to_date).draw();
  //     });

  //   }


  // }

  exportAsXLSX(){
    const sendData = new FormData();     
    sendData.append('from_date',JSON.stringify(this.formRecodEdit.value.wallet_from));
    sendData.append('to_date',JSON.stringify(this.formRecodEdit.value.wallet_to));
	sendData.append('loginUserId',this.loginUserId);
    this.commonService.getRozarpayWalletExport(sendData)
          .subscribe( response => {
            this.walletStatementdata = response;
           this.excelService.exportAsExcelFile(this.walletStatementdata, 'walletStatementData');
          });
  }


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
    });

  }

  getFilterData()
  {
    var sendData = new FormData();

    this.commonService.getWalletFilterData(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var result : any = response;
      this.result_txn_purpose = result.txn_purpose;
      this.result_txn_type = result.txn_type;
    });
  }

  getRozarpayWalletStatement(){
    const that = this;
      this.dtOptions = {		    
          "pagingType": 'simple',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
		  
          'ajax' : {
              url : this.base_url+'admin/getCustomerWalletStatement',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
              "toDate": this.toDate,
              "fromDate": this.fromDate
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

  validationForm(){
    this.formRecodEdit = this.formBuilder.group({
      add_amount : ['',[
        Validators.required,
        Validators.pattern(this.validation_for_number_only),
        Validators.min(100),
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
    uploadData.append('razor_customer_id',this.razor_customer_id);
      this.commonService.getWalletDetails(uploadData)
      .subscribe(response => {
        this.loaderActive = false;
        var output_data : any = response;
        this.is_account_available = output_data.is_account_available;

      });

  }



  generateOrderId(){
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('razor_customer_id',this.razor_customer_id);
    this.commonService.generateOrderId(uploadData)
    .subscribe(response => {
      var output_data : any = response;
      this.wallet_statements = output_data.wallet_statements;
    });
  }


  submitForm(){
      this.submitted = true;
      if(this.formRecodEdit.invalid){
          console.log('error');
          return false;
      }
      else{
          if((this.formRecodEdit.value.filter_txn_purpose != '' && this.formRecodEdit.value.filter_txn_purpose != null && this.formRecodEdit.value.filter_txn_purpose != undefined) || (this.formRecodEdit.value.filter_txn_type != '' && this.formRecodEdit.value.filter_txn_type != null && this.formRecodEdit.value.filter_txn_type != undefined) || (this.formRecodEdit.value.wallet_from != '' && this.formRecodEdit.value.wallet_from != null && this.formRecodEdit.value.wallet_from != undefined) || (this.formRecodEdit.value.wallet_to != '' && this.formRecodEdit.value.wallet_to != null && this.formRecodEdit.value.wallet_to != undefined))
          {
              this.atLeastOneRequired = '';
              // const that = this;
              // this.cdr.detectChanges();
              // this.dtRendered = true
              // this.cdr.detectChanges();
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.columns(1).search(this.formRecodEdit.value.filter_txn_purpose);
                  dtInstance.columns(2).search(this.formRecodEdit.value.filter_txn_type);
                  dtInstance.columns(3).search(JSON.stringify(this.formRecodEdit.value.wallet_from));
                  dtInstance.columns(4).search(JSON.stringify(this.formRecodEdit.value.wallet_to));
                  dtInstance.draw();
              });
              this.submitted =false;
          }
          else {
              Swal.fire({position: 'center',icon: 'error',title: 'At least one field required', showConfirmButton: false, timer: 3000 });
              return false;
          }
      }
  }



  // getFiltertxnPurposeResult(event)
  // {
  //   var selected_value : any = event.target.value;
  //   this.filter_txn_purpose = selected_value = selected_value.trim();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns(1).search(selected_value).draw();
  //   });
  // }

  // getFiltertxnTypeResult(event)
  // {
  //   var selected_value : any = event.target.value;
  //   this.filter_txn_type = selected_value = selected_value.trim();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns(2).search(selected_value).draw();
  //   });
  // }

  // getFiltertxnFromResult(event)
  // {
  //   var selected_value : any = event.target.value;
  //   this.filter_wallet_from = selected_value = selected_value.trim();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns(3).search(selected_value).draw();
  //   });
  // }

  // getFiltertxnToResult(event)
  // {
  //   var selected_value : any = event.target.value;
  //   this.filter_wallet_to = selected_value = selected_value.trim();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns(4).search(selected_value).draw();
  //   });
  // }




}
