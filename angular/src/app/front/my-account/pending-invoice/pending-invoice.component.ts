import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import {ExcelService} from '../../services/excel.service';

import {Subject} from 'rxjs';

@Component({
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.css']
})
export class PendingInvoiceComponent implements OnInit {

  base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    
    // dtOptions2: any = {};
    // dtOptions3: any = {};
    // dtOptions4: any = {};

    dtOptions2: DataTables.Settings = {};
    dtOptions3: DataTables.Settings = {};
    dtOptions4: DataTables.Settings = {};



     dtTrigger3: Subject<any> = new Subject<any>();


    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('closebutton') closebutton;
    formInvoiceDetailsData: FormGroup;
    formGetInvoiceByDate: FormGroup;
    formScannedCopyData : FormGroup;
    loginUserId  : any;
    loginUserType  : any;
    loaderActive : any;
    submitted : boolean = false;
    submittedInvoice : boolean = false;
    submittedScannedCopy : boolean = false;
    editResult : any;
    display : any;
    btnEditSubmit : boolean = false;
    popupTitle : any;
    invoiceDate : any;
    invoice_date: NgbDateStruct;
    invoiceDetailsData : any;
    invoiceCalculatedData : any;
    no_of_policy: any;
    total_policy_premium :any;
    total_policy_commission:any;
    total_gst_on_commission:any;
    grand_total:any;
    dashboardData : any;
    pending_policy_count : any;
    total_commission_amount : any;
    total_invoice_count : any;
    total_premium_amount : any;
    total_payment_amount : any;
    maxDate : any;
    minDate : any;
    responseMsg : any;
    msgClass: any;
      result : any;
      token  : any;
    sacnned_file_upload_label : any;
    invoiceDateValidate : boolean = false;
    displayInvoiceSignedBy : any = 'none';
    displayPendingPolicyList : any = 'none';
    displayTotalComissionList : any = 'none';
    displayPaymentDetailsList : any = 'none';
    displayInvoiceList : any = 'block';
    pendingPoliciesData : any;
    totalComissionData : any;
    selected_invoice_no : any;

    constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
      const current = new Date();
      this.selected_invoice_no = sessionStorage.getItem('selected_invoice_no');
      
      this.maxDate = {
        year: current.getFullYear(),
        month: current.getMonth() - 0,
      };
      this.minDate = {
        year: current.getFullYear() - 10,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    }

    ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');
          this.token = sessionStorage.getItem("user_token");
      this.formGetInvoiceByDate = this.formBuilder.group({
        invoice_date : ['',Validators.required]
      });
      this.formInvoiceDetailsData = this.formBuilder.group({
        tds_percentage : [''],
        policy_raw_data : [''],
        total_calculated_data : [''],
        invoice_number : ['',[Validators.required,Validators.pattern("^[0-9]*$")]],
        invoice_update_date : ['',Validators.required]
      });
      this.formScannedCopyData = this.formBuilder.group({
        scanned_copy_invoice_id : ['',Validators.required],
        invoiceSignedBy : ['',Validators.required],
        scanned_file_upload : ['',Validators.required]
      });
          this.validateUserLoginStatus(this.loginUserId,this.token);
      this.getIndex();
    //  this.getInvoiceDashboardData();
      this.sacnned_file_upload_label = "";
    }



    downloadInvoicePdf(url){
      this.downloadFile(this.base_url+'myaccount/generateinvoicepdf/'+url);
    }

    downloadFile(download_url){
      window.open(download_url, '_blank');
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
                      this.router.navigate(['/login']);
                  });
              }
          });
      }
    
    getTotalComission(){
      // this.dtOptions3 = {
      //   "pagingType": 'full_numbers',
      //   "pageLength": 10,
      //   "serverSide": true,
      //   "processing": true,
      //   'ajax' : {
      //     url : this.base_url+'myaccount/getTotalComission',
      //     type : 'POST',
      //     data: {
      //       "loginUserId": this.loginUserId,
      //       "loginUserType": this.loginUserType,
      //       "selected_invoice_no": this.selected_invoice_no

      //     },
      //     dataType: "json",
      //   },
      //   columns: [
      //     {
      //       'title' : 'Sr.No.',
      //       'data' : 'sno'
      //     },
      //     {
      //       'title' : 'Policy Number',
      //       'data' : 'policy_no'
      //     },
      //     {
      //       'title' : 'IC Name',
      //       'data' : 'ic_name'
      //     },
      //     {
      //       'title' : 'Product Type',
      //       'data' : 'product_type'
      //     },
      //     {
      //       'title' : 'Policy Type',
      //       'data' : 'policy_type'
      //     },
      //     {
      //       'title' : 'NET OD Premium',
      //       'data' : 'net_od_premium'
      //     },
      //     {
      //       'title' : 'TP',
      //       'data' : 'tp'
      //     },
          
      //     {
      //       'title' : 'Gross',
      //       'data' : 'gross'
      //     },
      //     {
      //       'title' : 'Payable Commission Amount',
      //       'data' : 'payable_commission_amount'
      //     },
      //     {
      //       'title' : 'TDS',
      //       'data' : 'tds'
      //     },
      //     {
      //       'title' : 'Final Payable Amount',
      //       'data' : 'final_payable_amount'
      //     },
      //     {
      //       'title' : 'Policy Created Date',
      //       'data' : 'policy_created_at'
      //     },
      //       ],
      //   order: [[ 5, "desc" ]]
      // };
    }
    getIndex(){
      const that = this;
      // this.dtOptions2 = {
      //   "pagingType": 'full_numbers',
      //   "pageLength": 10,
      //   "serverSide": true,
      //   "processing": true,
      //   'ajax' : {
      //     url : this.base_url+'myaccount/getinvoicedatalist',
      //     type : 'POST',
      //     headers: {
      //       "Authorization": "Bearer "+sessionStorage.getItem('user_token')
      //     },
      //     data: {
      //       "loginUserId": this.loginUserId,
      //       "loginUserType": this.loginUserType,
      //       "source" : "f"
      //     },
      //     dataType: "json",
      //   },
      //   columns: [
      //     {
      //       'title' : 'Sr.No',
      //       'data' : 'sno'
      //     },
      //     {
      //       'title' : 'Invoice No.',
      //       'data' : 'invoice_no'
      //     },
      //     {
      //       'title' : 'Invoice Date',
      //       'data' : 'invoice_date'
      //     },

      //     {
      //       'title' : 'Invoice Month',
      //       'data' : 'invoice_month'
      //     },

      //     {
      //       'title' : 'Total Payable Comission',
      //       'data' : 'total_payable_comission'
      //           },
      //     {
      //       'title' : 'Invoice Status',
      //       'data' : 'status'
      //     },
        
      //     {
      //       'title' : 'Created On',
      //       'data' : 'created_at'
      //     },
      //     {
      //       'title' : 'Action',
      //       'data' : 'action_btn'
      //     },
      //     {
      //       'title' : 'Policy Details',
      //       'data' : 'policy_details'
      //     }

      //       ],
      //       columnDefs: [
      //           { "orderable": false, "targets": 7 }
      //       ],
      //   order: [[ 6, "desc" ]]
      // };

      this.dtOptions = {
        "pagingType": 'full_numbers',
        "pageLength": 10,
        "serverSide": true,
        "processing": true,
        'ajax' : {
          url : this.base_url+'myaccount/getPendingPolicyList',
          type : 'POST',
          data: {
            "loginUserId": this.loginUserId,
            "loginUserType": this.loginUserType
          },
          dataType: "json",
        },
        columns: [
          {
            'title' : 'Sr.No.',
            'data' : 'sno'
          },
          {
            'title' : 'Policy Number',
            'data' : 'policy_no'
          },
          {
            'title' : 'IC Name',
            'data' : 'code'
          },
          {
            'title' : 'Premium',
            'data' : 'total_premium'
          },
          {
            'title' : '64VB Status',
            'data' : '64vb_status'
          },
          {
            'title' : 'Product Name',
            'data' : 'label'
          },
          {
            'title' : 'Policy Created Date',
            'data' : 'policy_created_at'
          },
            ],
        order: [[ 5, "desc" ]]
      };

      this.getTotalComission();

      // this.dtOptions4 = {
      //   "pagingType": 'full_numbers',
      //   "pageLength": 10,
      //   "serverSide": true,
      //   "processing": true,
      //   'ajax' : {
      //     url : this.base_url+'myaccount/getPaymentDetails',
      //     type : 'POST',
      //     data: {
      //       "loginUserId": this.loginUserId,
      //       "loginUserType": this.loginUserType
      //     },
      //     dataType: "json",
      //   },
      //   columns: [
      //     {
      //       'title' : 'Sr.No.',
      //       'data' : 'sno'
      //     },
      //     {
      //       'title' : 'Invoice No',
      //       'data' : 'invoice_no'
      //     },
      //     {
      //       'title' : 'UTR No',
      //       'data' : 'utr_no'
      //     },
      //     {
      //       'title' : 'Commission Amount',
      //       'data' : 'total_payable_comission'
      //     },
      //     {
      //       'title' : 'Payment Date',
      //       'data' : 'payment_date'
      //     },
          
      //       ],
      //   order: [[ 2, "desc" ]]
      // };

    }

    runTable(){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
         
      });
    }



    runTable3(){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        
        
        this.dtTrigger3.next();


      });
    }

    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         dtInstance.destroy();
          this.dtTrigger3.next();
      });
    }

    /*runTable2(){
      this.dtElement.dtInstance.then((dtInstance2: DataTables.Api) => {
        dtInstance2.draw();
      });
    }*/

    ngAfterViewInit(): void {
       
      this.renderer.listen('document', 'click', (event) => {
        if (event.target.getAttribute("view-record-id")) {
          this.viewRecord(event.target.getAttribute("view-record-id"));
        }
        if(event.target.hasAttribute("invoice-pdf")) {
          this.downloadInvoicePdf(event.target.getAttribute("invoice-pdf"));
        }
        if(event.target.hasAttribute("scanned-invoice-id")){
          this.addInvoiceId(event.target.getAttribute("scanned-invoice-id"))
        }

        if (event.target.hasAttribute("showPolicyDetails")) {
              this.showTotalComissionList(event.target.getAttribute("showPolicyDetails"))
            }
      });
    }

    viewRecord(invoice_date){
    }

    resetForm(){
      this.submittedInvoice = false;
      this.formInvoiceDetailsData.patchValue({
        tds_percentage : '',
        policy_raw_data : '',
        invoice_number : '',
        invoice_update_date : ''
      });
    }

    closePopupSuccess(){
      this.display='block';
      this.resetForm();
      this.loaderActive = false;
    }

    closePopupFailed(){
      this.display='block';
      this.loaderActive = false;
    }


    // getInvoiceDashboardData(){
  //        this.loaderActive = true;
    //  console.log(this.loginUserId);
    //  var sendData = new FormData();
    //  sendData.append('user_id',this.loginUserId);
    //  this.commonService.getInvoiceDashboardData(sendData)
    //  .subscribe( response => {
    //    this.dashboardData = response;
    //    if(this.dashboardData.status){
    //      //console.log(this.dashboardData);
    //      this.pending_policy_count = this.dashboardData.result.pending_policy_count;
    //      this.total_commission_amount = this.dashboardData.result.total_commission_amount;
    //      this.total_invoice_count = this.dashboardData.result.total_invoice_count;
    //      this.total_premium_amount = this.dashboardData.result.total_premium_amount;
    //      this.total_payment_amount = this.dashboardData.result.total_invoice_payment
    //      this.loaderActive = false;
    //    }
    //    else{
    //      this.pending_policy_count = 0;
    //      this.total_commission_amount = 0;
    //      this.total_invoice_count = 0;
    //      this.total_premium_amount = 0;
    //      this.total_payment_amount = 0;
    //      this.loaderActive = false;
    //      //Swal.fire (this.editResult.message,  "" ,  "error" );
    //    }
    //    this.loaderActive = false;
    //    //this.setFormData(this.state_data);
    //  });
    // }

    submitInvoiceDetails(){
      var invoice_form_date : any =  this.formGetInvoiceByDate.value.invoice_date;
      var monthYear : any = invoice_form_date.split('-');
      var invoiceMonth : any = monthYear[1];
      var invoiceYear : any = monthYear[0];

      this.submitted = true;
      if(this.formGetInvoiceByDate.invalid){
        return;
      }

      var curr_month = new Date().getMonth()+1;
      var curr_year = new Date().getFullYear();

      if(Number(curr_year)==parseInt(invoiceYear)){
        if(parseInt(invoiceMonth)>=Number(curr_month)){
          this.invoiceDateValidate=true;
          return;
        }
        else{
          this.invoiceDateValidate=false;
        }
      }

      if(Number(curr_year)<parseInt(invoiceYear)){
        this.invoiceDateValidate=true;
        return;
      }
      else{
        this.invoiceDateValidate=false;
      }

      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('invoice_month',invoiceMonth);
      sendData.append('invoice_year',invoiceYear);
      sendData.append('user_id',this.loginUserId);
      this.commonService.getInvoiceDetails(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.editResult = response;
        if(this.editResult.status){
          this.invoiceDetailsData = this.editResult.result;
          this.formInvoiceDetailsData.patchValue({ policy_raw_data : JSON.stringify(this.editResult) });
          this.formInvoiceDetailsData.patchValue({ tds_percentage : this.editResult.final_calculated_data.tds });
          this.no_of_policy = this.editResult.final_calculated_data.no_of_policy;
          this.total_policy_premium = this.editResult.final_calculated_data.total_policy_premium;
          this.total_policy_commission = this.editResult.final_calculated_data.total_policy_commission;
          this.total_gst_on_commission = this.editResult.final_calculated_data.total_gst_on_commission;
          this.grand_total = this.editResult.final_calculated_data.grand_total;
          this.loaderActive = false;
          document.getElementById("openModalButton").click();
        }
        else{
          Swal.fire (this.editResult.message,  "" ,  "error" );
        }
      });
    }

    submitInvoiceFormDetails(){
      this.submittedInvoice = true;
      if(this.formInvoiceDetailsData.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      var invoiceDate : any = this.formInvoiceDetailsData.value.invoice_update_date;
      sendData.append('tds_percentage',this.formInvoiceDetailsData.value.tds_percentage);
      sendData.append('policy_raw_data',this.formInvoiceDetailsData.value.policy_raw_data);
      sendData.append('invoice_number',this.formInvoiceDetailsData.value.invoice_number);
      sendData.append('invoice_update_date',invoiceDate.year+'-'+invoiceDate.month+'-'+invoiceDate.day);
      sendData.append('user_id',this.loginUserId);
      this.commonService.submitInvoiceFormDetails(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.editResult = response;
        if(this.editResult.status){
          Swal.fire({
                      title: '',
                      html: this.editResult.message,
                      timer: 2000
                  }).then((result) => {
            this.runTable();
            //this.getInvoiceDashboardData();
                      this.windowReload();
                  })
        }
        else{
          Swal.fire(this.editResult.message,  "" ,  "error" );
        }
      });
    }

    windowReload(){
          window.location.reload();
    }
    
    checkInvoiceNumber(event){
      if(event.target.value != ""){
        this.loaderActive = true;
        var sendData = new FormData();
            sendData.append('invoice_number',event.target.value);
            this.commonService.checkInvoiceNumber(sendData)
            .subscribe(response => {
              this.loaderActive = false;
          var result : any  = response;
          console.log(result);
              if(result.status){
            this.formInvoiceDetailsData.patchValue({
              invoice_number : ''
            });
            Swal.fire (result.message,  "" ,  "error" );
              }
        });
      }
    }

    uploadSacannedFile(event){
      var file :any = event.target.files[0];
      var file_type:any = file.type;
      var file_size :any = file.size ;
      if(file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'application/pdf'){
        Swal.fire ("Please Select 'jpg, jpeg, png OR pdf' file",  "" ,  "error" );
      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      }else{
        this.sacnned_file_upload_label = file.name;
        this.formScannedCopyData.patchValue({
          'scanned_file_upload' : file
        });
      }
    }

    submitScannedCopyDetails(){
      this.submittedScannedCopy = true;
      if(this.formScannedCopyData.invalid){
        return;
      }else{
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('invoice_id',this.formScannedCopyData.value.scanned_copy_invoice_id);
            sendData.append('invoice_signed_by',this.formScannedCopyData.value.invoiceSignedBy);
            sendData.append('scanned_file_upload',this.formScannedCopyData.value.scanned_file_upload);
            this.commonService.uploadinvoiceSignedBy(sendData)
            .subscribe(response => {
              this.loaderActive = false;
          var result : any  = response;
          if(result.status){
            this.runTable();
            this.closebutton.nativeElement.click();
              this.displayInvoiceSignedBy='none';
            Swal.fire({position: 'center',icon: 'success',title: result.message, showConfirmButton: false, timer: 3000 });
          }
          else{
            this.runTable();
            Swal.fire({position: 'center',icon: 'error',title: result.message, showConfirmButton: false, timer: 3000 });
          }
        });
      }
    }

    addInvoiceId(invoice_id){
      this.formScannedCopyData.patchValue({ scanned_copy_invoice_id : invoice_id });
    }

    showPendingPolicyList(){
      this.displayPendingPolicyList = 'block';
      this.displayInvoiceList = 'none';
      this.displayTotalComissionList = 'none';
      this.displayPaymentDetailsList = 'none';

      this.runTable();
    }

    showInvoiceList(){
      this.displayInvoiceList = 'block';
      this.displayTotalComissionList = 'none';
      this.displayPendingPolicyList = 'none';
      this.displayPaymentDetailsList = 'none';

      this.runTable();
    }


    showTotalComissionList(invoice_no = null){
      this.selected_invoice_no = invoice_no;
      console.log('invoice_no' + invoice_no);
      
      sessionStorage.setItem('selected_invoice_no',invoice_no);
      

      this.displayTotalComissionList = 'block';
      this.displayInvoiceList = 'none';
      this.displayPendingPolicyList = 'none';
      this.displayPaymentDetailsList = 'none';
      this.runTable3();
      
    }

    showPaymentDetailsList(){
      this.displayTotalComissionList = 'none';
      this.displayInvoiceList = 'none';
      this.displayPendingPolicyList = 'none';
      this.displayPaymentDetailsList = 'block';
      this.runTable();
    }


exportTotalComission(){

  this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('user_id',this.loginUserId);
        this.commonService.downloadTotalComissionData(sendData)
            .subscribe( response => {
              this.loaderActive = false;
        var data : any  = response;
        if(data.status){
          this.totalComissionData = data.result;
                this.excelService.exportAsExcelFile(this.totalComissionData, 'Invoice Total Commission Data');
        }
        else{
          Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
        }
            });


}

exportPaymentDetails(){
  
  this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('user_id',this.loginUserId);
        this.commonService.downloadPaymentDetailsData(sendData)
            .subscribe( response => {
              this.loaderActive = false;
        var data : any  = response;
        if(data.status){
          this.totalComissionData = data.result;
                this.excelService.exportAsExcelFile(this.totalComissionData, 'Invoice Payment Details Data');
        }
        else{
          Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
        }
            });

}

    exportPendingPolicies(){
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('user_id',this.loginUserId);
        this.commonService.downloadInvoicePandingPolicies(sendData)
            .subscribe( response => {
              this.loaderActive = false;
        var data : any  = response;
        if(data.status){
          this.pendingPoliciesData = data.result;
                this.excelService.exportAsExcelFile(this.pendingPoliciesData, 'Invoice Pending Policies Data');
        }
        else{
          Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
        }
            });
    }

    exportInvoiceData(){
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('user_id',this.loginUserId);
        this.commonService.downloadInvoiceData(sendData)
            .subscribe( response => {
              this.loaderActive = false;
        var data : any  = response;
        if(data.status){
          this.pendingPoliciesData = data.result;
                this.excelService.exportAsExcelFile(this.pendingPoliciesData, 'Invoice Created Data');
        }
        else{
          Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
        }
            });
    }

  }
