import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';
import {ExcelService} from '../../services/excel.service';

// import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
// import { requiredFileType } from "../query-management/requireFileTypeValidator";
// import { fileSizeValidator } from "../../query-management/fileSizeValidator";


@Component({
    selector: 'app-approve-payment',
    templateUrl: './approve-payment.component.html',
    styleUrls: ['./approve-payment.component.css']
})
export class ApprovePaymentComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective; 
    formchFilterDetails: FormGroup;
    formPaymentUpdate: FormGroup;
    div_show_payment_status : boolean = false;
    statusval : any = 'P';
    loginUserId  : any;
    bannkData : any;
    submitted : boolean = false;
    editResult : any;
    display : any;
    date : any;
    bankDetailsData : any;
    loaderActive: boolean = false;
    paymentData : any;
    
    displayPD : any;
    displayUpload : any;
    displayCSVPng : any;
    popupTitle : any;
    btnSubmit : boolean = false;
    formUploadCsv: FormGroup;
    submittedUploadCsv: boolean = false;
    csv_fileurl:any;
    csv_filelabel:any;
    uploaded_csv_file:any;
    csv_fileurl_label:any;
    acceptedExtensions = "csv";

    process_data_result_display : boolean = false;
    no_of_total_records : any;
    no_of_success_rcords : any;
    no_of_duplicate_rcords : any;
    no_of_error_rcords : any;

    success_policies : any;
    duplicae_policies : any;
    error_policies : any;

    is_success_record : boolean = false;
    is_duplicate_record : boolean = false;
    is_error_record : boolean = false;





    // constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    //     this.loginUserId = sessionStorage.getItem("adminUserId");
    // }

    constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private customvalidationService : CustomvalidationService,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
        this.loginUserId = sessionStorage.getItem("adminUserId");
    }


    ngOnInit(): void {

        this.displayPD = 'none';
        this.displayUpload = 'block';
        this.displayCSVPng = 'none';

        this.formUploadCsv = this.formBuilder.group({
            csv_file : ['',[Validators.required]]
        });

        this.formPaymentUpdate = this.formBuilder.group({
            payment_id : [''],
            utr_no : ['',[Validators.required,Validators.pattern('^[A-Za-z0-9_-]*$'),Validators.minLength(5), Validators.maxLength(21)]],
            bank_name : ['',Validators.required],
            ifsc_code : ['',[Validators.required,Validators.pattern('(([A-Z|a-z]{4})([0])([A-Z0-9]{6,20}))')]],
            payment_date : ['',Validators.required],
            payment_amount : ['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
            payment_status : ['',Validators.required],
        });

        this.getBankName();

  		this.formchFilterDetails = this.formBuilder.group({
     		policy_number : ['']
     	});

        this.getIndex();

        
    }

    getIndex(){
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'getpaymentdatalist',
                type : 'POST',
                data: {                
                    "loginUserId": this.loginUserId,
                    "status": this.statusval,
                },
                dataType: "json",
            },  
            columns: [    
                {   
                    'title' : 'Sr.No',
                    'data' : 'sno' 
                },
                {   
                    'title' : 'Invoice No.',
                    'data' : 'invoice_no' 
                },
                {   
                    'title' : 'MISP Name',
                    'data' : 'misp_name' 
                },
                {   
                    'title' : 'MISP ID',
                    'data' : 'agent_id' 
                },
                {   
                    'title' : 'Payable Amount',
                    'data' : 'payable_amount' 
                },
                {   
                    'title' : 'UTR No',
                    'data' : 'utr_no'  
                },    
                {  
                    'title' : 'Bank Name',
                    'data' : 'bank_name'
                },
                {  
                    'title' : 'IFSC Code',
                    'data' : 'ifsc_code'
                },
                {  
                    'title' : 'Payment Date',
                    'data' : 'payment_date'
                },
                {  
                    'title' : 'Payment Amount',
                    'data' : 'payment_amount'
                },
                {  
                    'title' : 'Payment Type',
                    'data' : 'payment_type'
                },   
                {  
                    'title' : 'Status',
                    'data' : 'status'
                },             
                {  
                    'title' : 'Action',
                    'data' : 'action_btn'
                }
            ]
        };
    }

    showHideStatusPayment(statusid){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(5).search(statusid).draw();
        });
        this.statusval = statusid;
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("payment-id")) {
                this.fillPaymentId(event.target.getAttribute("payment-id"));
            }
            if (event.target.hasAttribute("payment-amount")) {
                this.fillPaymentAmount(event.target.getAttribute("payment-amount"));
            }
        });     
    }

    fillPaymentId(payment_id){
        this.formPaymentUpdate.patchValue({    
            payment_id : payment_id
        }); 
    }

    fillPaymentAmount(payment_amount){
        this.formPaymentUpdate.patchValue({    
            payment_amount : payment_amount
        });
    }

    resetForm(){
        this.submitted = false;
        this.formPaymentUpdate.patchValue({
            payment_id : '',        
            utr_no : '',        
            bank_name : '',        
            ifsc_code : '',        
            payment_date : '',        
            payment_amount : '',        
            payment_status : ''        
        });
    }

    closePopup(){
        this.display='block'; 
        this.resetForm();
    }

    getBankName(){
        this.commonService.getBankData()
        .subscribe( response => {
            this.bannkData = response;
            this.bannkData = this.bannkData.result;
        });
    }

    submitPaymentForm(){
        this.submitted = true;
        if(this.formPaymentUpdate.invalid){
            return;
        }
        const sendData = new FormData();    
        this.date = this.formPaymentUpdate.value.payment_date;
        sendData.append('payment_id',this.formPaymentUpdate.value.payment_id);
        sendData.append('utr_no',this.formPaymentUpdate.value.utr_no);
        sendData.append('bank_name',this.formPaymentUpdate.value.bank_name);
        sendData.append('ifsc_code',this.formPaymentUpdate.value.ifsc_code);
        sendData.append('payment_date',this.date.year+'-'+this.date.month+'-'+this.date.day);    
        sendData.append('payment_amount',this.formPaymentUpdate.value.payment_amount);
        sendData.append('payment_status',this.formPaymentUpdate.value.payment_status);
        this.commonService.paymentUpdate(sendData)
        .subscribe(response =>{
            this.editResult = response;
            if(this.editResult.status){
                Swal.fire({
                    title: '',
                    html: this.editResult.message,
                    timer: 2000
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                Swal.fire({
                    title: '',
                    html: this.editResult.message,
                    timer: 2000
                }).then((result) => {
                    this.windowReload();
                }) 
            }
        });
    }

    runTable(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    windowReload(){
        window.location.reload();
    }


    getBankDetails(ifsccode){

    var is_vallid :any = this.formPaymentUpdate.controls.ifsc_code.status;
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
            this.formPaymentUpdate.patchValue({
                bank_name :this.bankDetailsData.result.bank
              });

          }else{
            this.formPaymentUpdate.patchValue({
                bank_name :''

              });


          }

        });

      }
    }

    exportPaymentData(){
        const sendData = new FormData();
        sendData.append('payment_status',this.statusval);
        this.commonService.downloadPaymentData(sendData)
        .subscribe( response => {
            var data : any  = response;
            if(data.status){
                this.paymentData = data.result;
                this.excelService.exportAsExcelFile(this.paymentData, 'Payment Data');
            }
            else{
                Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
            }
        });
    }

    openModel(){
        this.popupTitle = "Invoice Payment";        
    }

    uploadCsvFile(event){

        var file :any = event.target.files[0];
        var file_type:any = file.type;
        var file_size :any = file.size ;
        // console.log(file);
        // console.log(file_type);
        // console.log(file_size);

        // if(file_type.toLowerCase() != 'application/vnd.ms-excel' )
        // {
        //   Swal.fire ("Please Select 'csv' file",  "" ,  "error" );
        //   this.csv_fileurl = "";
        //   this.csv_fileurl_label = "";

        // }
        // else 
        if(file_size > 5242880){
          Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
          this.csv_fileurl = "";
          this.csv_fileurl_label = "";
        }else{
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.csv_fileurl = event.target.result;
          }
          this.csv_fileurl_label = file.name;
          this.formUploadCsv.patchValue({
            'csv_file' : file
          });
        }
    }

    processCsvData(){
        if(this.uploaded_csv_file != '')
        {
          this.loaderActive = true;
          var csvData = new FormData();
          csvData.append('loginUserId',this.loginUserId);
          csvData.append('uploaded_csv_file',this.uploaded_csv_file);

          this.commonService.processInvoicePaymentCsvFile(csvData)
            .subscribe(response => {
              var outputResult : any = response;
              // console.log(outputResult);
              this.loaderActive = false;
              if(outputResult.status)
              { 
                this.process_data_result_display = true;

                this.no_of_total_records = outputResult.no_of_total_records;

                this.no_of_success_rcords = outputResult.no_of_success_policy;
                this.success_policies = outputResult.success_policies;
                if(this.no_of_success_rcords>0){
                  this.is_success_record = true;
                }

                this.no_of_duplicate_rcords = outputResult.no_of_duplicate_policies;
                this.duplicae_policies = outputResult.duplicate_policies;
                if(this.no_of_duplicate_rcords>0){
                  this.is_duplicate_record = true;
                }

                this.no_of_error_rcords = outputResult.no_error_policies;
                this.error_policies = outputResult.error_policies;
                if(this.no_of_error_rcords>0){
                  this.is_error_record = true;
                }

                Swal.fire(outputResult.message,  "" ,  "success" );
                this.displayPD = 'none';  
                this.displayUpload = 'block';

                this.formUploadCsv.patchValue({
                  'csv_file' : ''
                });

                this.csv_filelabel = '';
                this.csv_fileurl_label ='';

                this.uploaded_csv_file = '';
                this.submittedUploadCsv = false;

                this.getIndex();
                            
              }
              else
              {
                Swal.fire(outputResult.message,  "" ,  "error" );
              }
            });
        }
        else
        {
          Swal.fire('Please first upload CSV File.',  "" ,  "error" );
          this.uploaded_csv_file = '';
        }
    }

    submitFormUploadCsv(){
        this.uploaded_csv_file = '';
        this.submittedUploadCsv = true;
        if(this.formUploadCsv.invalid){
          return;
        }
        this.loaderActive = true;


        // console.log(this.formUploadCsv.value.csv_file);
        // console.log(this.loginUserId);
        let uploadData = new FormData();
        uploadData.append('loginUserId',this.loginUserId);
        uploadData.append('csv_file',this.formUploadCsv.value.csv_file);

        this.commonService.submitFormUploadPaymentFile(uploadData)
        .subscribe(response => {
          var outputResult : any = response;
          // console.log(outputResult);
          this.loaderActive = false;
          if(outputResult.status)
          { 
            Swal.fire(outputResult.message,  "" ,  "success" );
            
            this.displayPD = 'block';  //show process data btn
            this.displayUpload = 'none';  //show otp form
            
            this.uploaded_csv_file = outputResult.added_file;
          }
          else
          {
            Swal.fire(outputResult.message,  "" ,  "error" );
            this.uploaded_csv_file = '';
          }
        });
    }

    
}
