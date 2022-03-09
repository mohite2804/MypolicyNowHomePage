import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../services/excel.service';

import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {  
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 
  
  formInvoiceDetailsData: FormGroup;
  formGetInvoiceByDate: FormGroup;
  loginUserId  : any;
  loaderActive : any;
  submitted : boolean = false;
  submittedInvoice : boolean = false;
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
 formComissionUpload : any;
   

  pending_policy_count : any;
  total_commission_amount : any;
  total_invoice_count : any;
  total_premium_amount : any;
  maxDate : any;
  minDate : any;
  responseMsg : any;
  msgClass: any;
     access_permission : any; 
 formGrievancesUpload : any;
        claims_grievances_file_upload_label : any;
  

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,private excelService:ExcelService) { 
       this.access_permission = sessionStorage.getItem("access_permission");
 
  
    const current = new Date();

    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() - 0,
      day: current.getDate()
    };

    this.minDate = {
      year: current.getFullYear() - 10,
      month: current.getMonth() + 1,
      day: current.getDate()
    };

  }

  ngOnInit(): void {
      this.claims_grievances_file_upload_label = "";
  
    this.formGetInvoiceByDate = this.formBuilder.group({      
      invoice_date : ['',Validators.required]     
      
    });

    this.formGrievancesUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
        });
    

     this.formComissionUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
        });



    this.formInvoiceDetailsData = this.formBuilder.group({      
      tds_percentage : [''],
      policy_raw_data : [''],
      total_calculated_data : [''],
      invoice_number : ['',Validators.required],
      invoice_update_date : ['',Validators.required]
      
    });
    this.loginUserId = sessionStorage.getItem("user_id");
    this.getIndex();     
  //  this.getInvoiceDashboardData();
  }


    openModel(){
        this.btnEditSubmit = true;
        this.display='none';
    }


openModelGrievances(){
        this.btnEditSubmit = true;
        this.display='none';
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
              url : this.base_url+'getinvoicedatalist',
              type : 'POST',
              data: {                
              "loginUserId": this.loginUserId,
          },
              dataType: "json",
          },  
          columns: [    
            {   
              'title' : 'Sr.No',
              'data' : 'sno' 
            },
            {   
              'title' : 'POSP Name',
              'data' : 'posp_name' 
            },
            {   
              'title' : 'Mobile No.',
              'data' : 'mobile_no' 
            },
            {   
              'title' : 'Business Partner',
              'data' : 'business_partner' 
            },
            {   
              'title' : 'GIIB Code',
              'data' : 'giib_code' 
            },
            {   
              'title' : 'Invoice No.',
              'data' : 'invoice_no' 
            },
            {   
              'title' : 'Invoice Date',
              'data' : 'invoice_date'  
            },
                    
            {  
              'title' : 'Invoice Month',
              'data' : 'invoice_month'
            },

            {  
              'title' : 'Total Payable Comission',
              'data' : 'total_payable_comission'
            },

            {  
              'title' : 'Created On',
              'data' : 'created_at'
            },

            {  
              'title' : 'Invoice Status',
              'data' : 'status'
            },

            {  
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ]
      };
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }




  ngAfterViewInit(): void {

   // alert('helo');
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.getAttribute("view-record-id")) {
          this.viewRecord(event.target.getAttribute("view-record-id"));
        }
        if(event.target.hasAttribute("invoice-pdf")) {
          this.downloadInvoicePdf(event.target.getAttribute("invoice-pdf"));
        }

        // if (event.target.hasAttribute("view-edit-id")) {
        //   this.editRecord(event.target.getAttribute("view-edit-id"));
        // }
        // if (event.target.hasAttribute("view-delete-id")) {
        //   this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        // }            
        // if (event.target.hasAttribute("view-active-id")) {
        //   this.changeStatus(event.target.getAttribute("view-active-id"),2);
        // }
        // if (event.target.hasAttribute("view-inactive-id")) {
        //   this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        // }
    });     
  }

 uploadComission(event){
     
        var file :any = event.target.files[0];
      var file_type:any = file.type;
        var file_size :any = file.size ;
        if(file_type.toLowerCase() != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            Swal.fire ("Please Select 'xslx' file",  "" ,  "error" );
        }else if(file_size > 5242880){
            Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        }else{
            this.claims_grievances_file_upload_label = file.name;
            this.formComissionUpload.patchValue({
                'comission_file_upload' : file
            });
      this.formGrievancesUpload.patchValue({
                'comission_file_upload' : file
            });
        }
    }


    downloadInvoicePdf(url){
      this.downloadFile(this.base_url+'myaccount/generateadmininvoicepdf/'+url);
    }
    downloadFile(download_url){
      window.open(download_url, '_blank');
    }



  submitComissionFile(){
        this.submitted = true;
    this.loaderActive = true;
        if(this.formComissionUpload.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formComissionUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
    sendData.append('type','claim');
        this.commonService.uploadInvoiceFile(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status){   
this.loaderActive = false;      
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                this.loaderActive = false;  
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }

 submitGrievancesFile(){
        this.submitted = true;
    this.loaderActive = true;
        if(this.formGrievancesUpload.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formGrievancesUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
    sendData.append('type','grievances');
        this.commonService.uploadClaimAndGrievancesFile(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status){ 
      this.loaderActive = false;      
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                this.loaderActive = false;  
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }


  viewRecord(invoice_date){
    console.log(invoice_date);
    // this.btnEditSubmit = false;
    // this.resetForm();
    // this.popupTitle = "Invoice Details";
    // this.display='block'; 
    // this.getInvoiceDataByDate(invoice_date);

  }

  resetForm(){
      this.submittedInvoice = false;
     // this.display= "none";
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


    getInvoiceDashboardData(){

      console.log(this.loginUserId);
          
       var sendData = new FormData();
       sendData.append('user_id',this.loginUserId);      

      this.commonService.getInvoiceDashboardData(sendData)
        .subscribe( response => {
          this.dashboardData = response;
           if(this.dashboardData.status){
             //console.log(this.dashboardData);
           this.pending_policy_count = this.dashboardData.result.pending_policy_count;
           this.total_commission_amount = this.dashboardData.result.total_commission_amount;
           this.total_invoice_count = this.dashboardData.result.total_invoice_count;
           this.total_premium_amount = this.dashboardData.result.total_premium_amount;
           this.loaderActive = false;        
          }else{
           this.pending_policy_count = 0;
           this.total_commission_amount = 0;
           this.total_invoice_count = 0;
           this.total_premium_amount = 0;
           this.loaderActive = false;
          //Swal.fire (this.editResult.message,  "" ,  "error" );
          }                    
          
          this.loaderActive = false;         
          //this.setFormData(this.state_data);
          
        });
     

    }

     


  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    

    if(field == 'invoice_date'){      
      this.formGetInvoiceByDate.patchValue({ invoice_date : selected_date });
    }


    
    if(field == 'invoice_update_date'){      
      this.formInvoiceDetailsData.patchValue({ invoice_update_date : selected_date });
    }

  }


  submitInvoiceDetails(){    
   // this.submitted = true;
    // if(this.formGetInvoiceByDate.invalid){
    //   return;
    // }
 //   this.loaderActive = true;
    const sendData = new FormData();
 sendData.append('invoice_month',this.formGetInvoiceByDate.value.invoice_date);
//    sendData.append('user_id',this.loginUserId);    
//alert(this.formGetInvoiceByDate.value.invoice_date);
    this.commonService.getAdminInvoiceDetails(sendData)
    .subscribe(response =>{       
      this.loaderActive = false;
      this.editResult = response;
      this.excelService.exportAsExcelFile(this.editResult, 'invoiceFile');       

      if(this.editResult.status){



       //console.log(JSON.stringify(this.editResult));

        this.invoiceDetailsData = this.editResult.result;
        this.formInvoiceDetailsData.patchValue({ policy_raw_data : JSON.stringify(this.editResult) });
        //this.formInvoiceDetailsData.patchValue({ total_calculated_data : this.editResult.final_calculated_data });
        this.formInvoiceDetailsData.patchValue({ tds_percentage : this.editResult.final_calculated_data.tds });

        this.no_of_policy = this.editResult.final_calculated_data.no_of_policy;
        this.total_policy_premium = this.editResult.final_calculated_data.total_policy_premium;
        this.total_policy_commission = this.editResult.final_calculated_data.total_policy_commission;
        this.total_gst_on_commission = this.editResult.final_calculated_data.total_gst_on_commission;
        this.grand_total = this.editResult.final_calculated_data.grand_total;
        // this.serialNo = this.editResult.result;
        this.loaderActive = false; 

        // this.runTable();
        // this.closePopupSuccess(); 
        // this.msgClass = "alert-success";       
        // this.responseMsg = this.editResult.message; 
        //Swal.fire(this.editResult.message, '', "success"); 
      }else{

        this.invoiceDetailsData = [];
        this.no_of_policy = '';
        this.total_policy_premium = '';
        this.total_policy_commission = '';
        this.total_gst_on_commission = '';
        this.grand_total = '';
        this.loaderActive = false; 

        // this.closePopupFailed();        
        // this.msgClass = "alert-danger";
        // this.responseMsg = this.editResult.message; 
        //Swal.fire (this.editResult.message,  "" ,  "error" );
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
    sendData.append('tds_percentage',this.formInvoiceDetailsData.value.tds_percentage);
    sendData.append('policy_raw_data',this.formInvoiceDetailsData.value.policy_raw_data);
    sendData.append('invoice_number',this.formInvoiceDetailsData.value.invoice_number);
    sendData.append('invoice_update_date',this.formInvoiceDetailsData.value.invoice_update_date);
    sendData.append('user_id',this.loginUserId);    
    this.commonService.submitInvoiceFormDetails(sendData)
    .subscribe(response =>{ 

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.getInvoiceDashboardData();
        Swal.fire(this.editResult.message, '', "success"); 
       
      }else{
        Swal.fire (this.editResult.message,  "" ,  "error" );       
      }
    });
  }

    windowReload(){
        window.location.reload();
    }

}
