import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';


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

    // constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    //     this.loginUserId = sessionStorage.getItem("adminUserId");
    // }

    constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private customvalidationService : CustomvalidationService,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) {
        this.loginUserId = sessionStorage.getItem("adminUserId");
    }


    ngOnInit(): void {

        this.formPaymentUpdate = this.formBuilder.group({
            payment_id : [''],
            utr_no : ['',[Validators.required,Validators.pattern('^[A-Za-z0-9_-]*$'),Validators.minLength(5), Validators.maxLength(21)]],
            bank_name : ['',Validators.required],
            ifsc_code : ['',[Validators.required,Validators.pattern('(([A-Z|a-z]{4})([0])([A-Z0-9]{6,20}))')]],
            payment_date : ['',Validators.required],
            payment_amount : ['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
            payment_status : ['',Validators.required],
        });

  		this.formchFilterDetails = this.formBuilder.group({
     		policy_number : ['']
     	});

        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'admin/getpaymentdatalist',
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
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("payment-id")) {
                this.fillPaymentId(event.target.getAttribute("payment-id"),event.target.getAttribute("payment-amount"));
            }
            // if (event.target.hasAttribute("payment-amount")) {
            //     this.fillPaymentAmount(event.target.getAttribute("payment-amount"));
            // }
        });     
    }

    fillPaymentId(payment_id,payment_amount){
        if((payment_id!='' || payment_id!=null || payment_id!=undefined)){
            this.loaderActive = true;
            const sendData = new FormData();    
            sendData.append('payment_id',payment_id);

            this.commonService.getInvoicePaymentDetails(sendData)
            .subscribe(response =>{
                this.editResult = response;
                this.loaderActive = false;
                if(this.editResult.status){

                    this.formPaymentUpdate.patchValue({    
                        payment_id : payment_id,
                        utr_no : this.editResult.result.utr_no,
                        payment_date : this.editResult.result.payment_date,
                        ifsc_code : this.editResult.result.ifsc_code,
                        bank_name : this.editResult.result.bank_name,
                        payment_amount : payment_amount
                    }); 
                }
                else{
                    Swal.fire(this.editResult.message,  "" ,  "error" );
                }
            });
            
        }
        else{
            Swal.fire({
                title: '',
                html: 'Please try again',
                timer: 2000
            }).then((result) => {
                this.windowReload();
            }) 
        }
    }

    // fillPaymentAmount(payment_amount){
    //     this.formPaymentUpdate.patchValue({    
    //         payment_amount : payment_amount
    //     });
    // }

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

    submitPaymentForm(){
        this.submitted = true;
        if(this.formPaymentUpdate.invalid){
            return;
        }
        this.loaderActive = true;
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
            this.loaderActive = false;
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
}
