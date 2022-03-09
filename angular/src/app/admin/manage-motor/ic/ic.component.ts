import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';

import Swal from 'sweetalert2'


import { Router } from  '@angular/router';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";


@Component({
  selector: 'app-ic',
  templateUrl: './ic.component.html',
  styleUrls: ['./ic.component.css']
})
export class IcComponent implements OnInit {
	base_url = environment.baseUrl;

	loginUserId : any;
	loaderActive : boolean =  false;
	ic_id : any;
	ic_details : any ;
	response_ic :any;
	editResult :any;

	formUpdateIcDetails: FormGroup;
  validate_razor_account_form: FormGroup;
  create_razor_account_form: FormGroup;
	submittedUploadCsv: boolean = false;
	submitted : boolean = false;
  submitted_va : boolean = false;
  submitted_ca : boolean = false;

	displayRazorAccntBtn : any;
	bankDetailsData : any;
	selected_logo : any;
	selected_signature : any;
	responseMsg : any;
	msgClass : any;

	razor_account_email :any;
  payable_beneficiary_name :any;
  payable_business_type :any;
	ifsc_code :any;
	bank_name :any;
	bank_acc_no :any;
  bank_branch :any;
  payable_account_type :any;

  razor_account_id :any;


  displayGetAccntDetails : any;
  displayCreateAccount : any;
  displayIsRazorAccount : any;


  btnSubmit : boolean = false;
  btnSubmit2 : boolean = false;
  btnEditSubmit2 : boolean = false;
  btnEditSubmit : boolean = false;


  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
 	validation_for_gst_no :any   = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  	

  access_permission:any;

  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
    this.loginUserId = sessionStorage.getItem("adminUserId");
		this.access_permission = sessionStorage.getItem("access_permission");    
  }

  	// constructor(private renderer: Renderer2, private notifyService: NotificationsService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) { }

  	ngOnInit(): void {
     	this.loginUserId = sessionStorage.getItem("adminUserId");
     	this.ic_id = sessionStorage.getItem("icId");
      this.razor_account_id = '';
      this.getIndex();

      this.razor_account_email = '';
      this.payable_beneficiary_name = '';
      this.payable_business_type = '';
      this.ifsc_code = '';
      this.bank_name = '';
      this.bank_acc_no = '';
      this.bank_branch = '';
      this.payable_account_type = '';

      // this.razor_account_id = "";

     	this.displayRazorAccntBtn = 'none';
      this.displayGetAccntDetails = 'none';
      this.displayCreateAccount = 'none';
      this.displayIsRazorAccount = 'none';
      

      //validate account form
      this.validate_razor_account_form = this.formBuilder.group({
         razor_account_id : ['',[Validators.required]]
      });
     	

      //create razor account form
      this.create_razor_account_form = this.formBuilder.group({
         // payable_email : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_email)]],
         payable_email : ['',[Validators.required,Validators.pattern(this.validation_for_email)]],         
         payable_beneficiary_name : ['',[Validators.required]],
         payable_business_type : ['',[Validators.required]],
         ifsc_code : ['',[Validators.pattern("^[A-Za-z]{4}0[a-zA-Z0-9]{6}$"),Validators.required]],
         bank_name : ['',[Validators.required]],
         bank_branch : ['',[Validators.required]],
         payable_account_type : ['',[Validators.required]],
         bank_acc_no : ['',[Validators.required,Validators.pattern("^[0-9 ]*$")]],
      });


      // ic details update form
     	this.formUpdateIcDetails= this.formBuilder.group({
	        razor_customer_id : [''],
	        razor_test_account : [''],
	        razor_live_account : [''],
	        razor_account_email :['',[Validators.pattern(this.validation_for_email)]],
	        bike_breakin_days : [''],
	        code : [''],
	        customer_service_address : [''],
	        register_and_corrporate_address : [''],
	        stamp_duty_authorization_no : [''],
	        stamp_duty_authorization_date : [''],
	        cin_no : [''],	
	        payingslip_no_generated_by : [''],	
	        proposal_no_generated_by : [''],	
	        proposal_prefix : [''],	
	        hsn_no : [''],	
	        name : [''],
      		address : [''],
	        sector : [''],	
	        support_email : ['',[Validators.required]],
	        mobile : ['',[Validators.pattern("^[6-9][0-9]{9}$")]],
	        landline : ['',[Validators.pattern("^[0-9]{2,4}[- ][0-9]{6,8}$")]], // 0395-25950612
	        tollfree : ['',[Validators.pattern("^(1800)[- ][0-9]{3}[- ][0-9]{4}$")]], //1800-333-4444
      		website_url : ['',[Validators.pattern(this.urlRegex)]],
	        irdai_register_no : [''],	
	        gstin_no : [''],	
	        inspection_done_by : [''],	
	        broker_code : [''],	
	        bank_branch : ['',[Validators.required]],
		      bank_acc_no : ['',[Validators.required,Validators.pattern("^[0-9 ]*$")]],
		      bank_name : ['',[Validators.required]],
	        ifsc_code : ['',[Validators.pattern("^[A-Za-z]{4}0[a-zA-Z0-9]{6}$"),Validators.required]],
	        micr_code : [''],	
	        swift_code : [''],
	        client_code : [''],
	        uin_no : [''],
	        // logo_img : [''],
	        logo : [''],
      		// signature_img : [''],
      		signature : [''],
	    });    

     	

  	}

  	getIndex()
  	{
        this.loaderActive = true;
  		  var sendData = new FormData();
      	sendData.append('loginUserId',this.loginUserId);
      	sendData.append('ic_id',this.ic_id);
  		  this.commonService.getIcDetailsByIcId(sendData).subscribe( response => {
          	this.response_ic = response;
            this.loaderActive = false;
          	if(this.response_ic.status)
          	{              
          		// console.log(this.response_ic.status);
          		this.ic_details = this.response_ic.result;  

          		this.razor_account_email = this.ic_details.razor_account_email;
    			  	this.bank_name = this.ic_details.bank_name;
    			  	this.bank_acc_no = this.ic_details.bank_acc_no;
    			  	this.ifsc_code = this.ic_details.ifsc_code;
              this.razor_account_id = this.ic_details.razor_account_id;
              console.log('2 :'+this.razor_account_id);
              if(this.razor_account_id != '' && this.razor_account_id != null)
              {
                this.displayIsRazorAccount = 'none';        
                this.displayCreateAccount = 'block';        
                this.displayGetAccntDetails = 'none';                        
                this.btnEditSubmit2 = false;
                this.create_razor_account_form.disable();
              }
              else
              {
                this.displayIsRazorAccount = 'block';    
                this.displayCreateAccount = 'none';   
                this.btnEditSubmit2 = true;  
              }

          		// if(this.ic_details.razor_customer_id =='')
          		// {
          		// 	this.displayRazorAccntBtn = 'block';
          		// }

              this.create_razor_account_form.patchValue({
                 payable_email : this.ic_details.payable_email,
                 payable_beneficiary_name : this.ic_details.payable_beneficiary_name,
                 payable_business_type : this.ic_details.payable_business_type,
                 ifsc_code : this.ic_details.payable_ifsc_code,
                 bank_name : this.ic_details.payable_bank_name,
                 bank_branch : this.ic_details.bank_branch,
                 payable_account_type : this.ic_details.payable_account_type,
                 bank_acc_no : this.ic_details.payable_account_no,
              });

          		this.formUpdateIcDetails.patchValue({
          			razor_customer_id : this.ic_details.razor_account_id,
      					// razor_test_account : this.ic_details.razor_test_account,
      					// razor_live_account : this.ic_details.razor_live_account,
      					razor_account_email : this.ic_details.payable_email,
      					bike_breakin_days : this.ic_details.bike_breakin_days,
      					code : this.ic_details.code,
      					customer_service_address : this.ic_details.customer_service_address,
      					register_and_corrporate_address : this.ic_details.register_and_corrporate_address,
      					stamp_duty_authorization_no : this.ic_details.stamp_duty_authorization_no,
      					stamp_duty_authorization_date : this.ic_details.stamp_duty_authorization_date,
      					cin_no : this.ic_details.cin_no,
      					payingslip_no_generated_by : this.ic_details.payingslip_no_generated_by,
      					proposal_no_generated_by : this.ic_details.proposal_no_generated_by,
      					proposal_prefix : this.ic_details.proposal_prefix,
      					hsn_no : this.ic_details.hsn_no,
      					name : this.ic_details.name,
      					address : this.ic_details.address,
      					sector : this.ic_details.sector,
      					support_email : this.ic_details.support_email,
      					mobile : this.ic_details.mobile,
      					landline : this.ic_details.landline,
      					irdai_register_no : this.ic_details.irdai_register_no,
      					tollfree : this.ic_details.tollfree,
      					gstin_no : this.ic_details.gstin_no,
      					website_url : this.ic_details.website_url,
      					inspection_done_by : this.ic_details.inspection_done_by,
      					broker_code : this.ic_details.broker_code,
      					bank_name : this.ic_details.bank_name,
      					bank_acc_no : this.ic_details.bank_acc_no,
      					bank_branch : this.ic_details.bank_branch,
      					ifsc_code : this.ic_details.ifsc_code,
      					micr_code : this.ic_details.micr_code,
      					swift_code : this.ic_details.swift_code,
      					client_code : this.ic_details.client_code,
      					uin_no : this.ic_details.uin_no,
              });	
          	}

          	console.log(this.ic_details);
        });
  	}

  	uploadLogo(event){

  		var file :any = event.target.files[0];
  		var file_type:any = file.type;
  		var file_size :any = file.size ;
  		console.log("file  " +file_size);
  		if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
  			Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
  			this.selected_logo = "";

  		}else if(file_size > 5242880){
  			Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  			this.selected_logo = "";
  		}else{
  			//this.selected_logo = file;
  			this.formUpdateIcDetails.patchValue({
  				'logo' : file
  			});
  		}
  	}

  	// selected_signature : any;
  	uploadSignature(event){
  		var file :any  = event.target.files[0];
  		var file_type:any = file.type;
  		var file_size :any = file.size ;

  		if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
  			Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
  			this.selected_signature = "";

  		}else if(file_size > 5242880){
  			Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  			this.selected_signature = "";
  		}else{
  			//this.selected_signature = file;
  			this.formUpdateIcDetails.patchValue({
  				'signature' : file
  			});
  		}
  	}

  	getBankDetails(ifsccode){
      // alert(ifsccode);
  		var is_vallid :any = this.create_razor_account_form.controls.ifsc_code.status;
  		console.log(is_vallid)
  		if(is_vallid != "INVALID" && ifsccode.length == 11 )
      {
  			this.loaderActive = true;
  			var sendData = new FormData();
  			sendData.append('ifsc_code',ifsccode);
  			this.commonService.getBankDetails(sendData)
  			.subscribe( response => {
  				this.loaderActive = false;
  				this.bankDetailsData = response;
  				
          if(this.bankDetailsData.status)
          {
  					this.create_razor_account_form.patchValue({
  						bank_branch : this.bankDetailsData.result.branch,
  						bank_name :this.bankDetailsData.result.bank
  					});

            //create_razor_account form
            this.create_razor_account_form.patchValue({
              bank_branch : this.bankDetailsData.result.branch,
              bank_name :this.bankDetailsData.result.bank
            });

          }
          else
          {
            this.create_razor_account_form.patchValue({
              bank_branch : '',
              bank_name :''
            });
         }
       });
  		}
  	}

  	submitForm(){
      this.submitted = true;
          if(this.formUpdateIcDetails.invalid){
           return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('id',this.ic_id);
      sendData.append('customer_service_address',this.formUpdateIcDetails.value.customer_service_address);
      sendData.append('register_and_corrporate_address',this.formUpdateIcDetails.value.register_and_corrporate_address);
      sendData.append('proposal_prefix',this.formUpdateIcDetails.value.proposal_prefix);
      sendData.append('name',this.formUpdateIcDetails.value.name);
      sendData.append('address',this.formUpdateIcDetails.value.address);
      sendData.append('support_email',this.formUpdateIcDetails.value.support_email);
      sendData.append('mobile',this.formUpdateIcDetails.value.mobile);
      sendData.append('landline',this.formUpdateIcDetails.value.landline);
      sendData.append('tollfree',this.formUpdateIcDetails.value.tollfree);
      sendData.append('gstin_no',this.formUpdateIcDetails.value.gstin_no);
      sendData.append('website_url',this.formUpdateIcDetails.value.website_url);
      sendData.append('bank_name',this.formUpdateIcDetails.value.bank_name);
      sendData.append('bank_acc_no',this.formUpdateIcDetails.value.bank_acc_no);
      sendData.append('bank_branch',this.formUpdateIcDetails.value.bank_branch);
      sendData.append('ifsc_code',this.formUpdateIcDetails.value.ifsc_code);
      sendData.append('logo',this.formUpdateIcDetails.value.logo);
      sendData.append('signature',this.formUpdateIcDetails.value.signature);
      sendData.append('logo_img',this.formUpdateIcDetails.value.logo_img);
      sendData.append('signature_img',this.formUpdateIcDetails.value.signature_img);
      sendData.append('userid',this.loginUserId);
      sendData.append('razor_account_email',this.formUpdateIcDetails.value.razor_account_email);

      this.commonService.update_ic_details(sendData)
      .subscribe(response =>{

         this.loaderActive = false;
         this.editResult = response;
         if(this.editResult.status)
         {
          // this.successNotify(this.editResult.message);
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
          Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
          this.getIndex();
       }
       else
       {
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
          Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
       }
      });
	  }

	  create_razor_account()
    {
      // alert('1');
      this.submitted_ca = true;
      if(this.create_razor_account_form.invalid){
       return;
      }
      this.loaderActive = true;

      this.razor_account_email = this.create_razor_account_form.value.payable_email;
      this.payable_beneficiary_name = this.create_razor_account_form.value.payable_beneficiary_name;;
      this.payable_business_type = this.create_razor_account_form.value.payable_business_type;;
      this.ifsc_code = this.create_razor_account_form.value.ifsc_code;;
      this.bank_name = this.create_razor_account_form.value.bank_name;;
      this.bank_acc_no = this.create_razor_account_form.value.bank_acc_no;;
      this.bank_branch = this.create_razor_account_form.value.bank_branch;;
      this.payable_account_type = this.create_razor_account_form.value.payable_account_type;;



      var required_fields = [this.razor_account_email, this.payable_beneficiary_name, this.payable_business_type, this.ifsc_code, this.bank_name, this.bank_acc_no, this.bank_branch, this.payable_account_type];
      var empty_fileds = [];
      
      for(var i =0;i<required_fields.length;i++)
      {
         if(required_fields[i] == '' || required_fields[i] == null)
         {
            if(i == 0)
            {
              empty_fileds.push('Razor Account Email');
            }
            else if(i == 1)
            {
              empty_fileds.push('Payable Beneficiary Name');
            }
            else if(i == 2)
            {
              empty_fileds.push('Payable Business Type');
            }
            else if(i == 3)
            {
              empty_fileds.push('IFSC Code');
            }
            else if(i == 4)
            {
              empty_fileds.push('Bank Name');
            }
            else if(i == 5)
            {
              empty_fileds.push('Bank Account Number');
            }
            else if(i == 6)
            {
              empty_fileds.push('Bank Branch');
            }
            else if(i == 7)
            {
              empty_fileds.push('Payable Account Type');
            }
         }
      }

      if(empty_fileds.length >0)
      {
        var str = "Please provide "+empty_fileds.toString();
        Swal.fire({position: 'center',icon: 'error',title: str, showConfirmButton: false, timer: 3000 });
      }
      else 
      {
          // alert('3');
         // on success  call create IC Razor Account
         var sendData = new FormData();
         sendData.append('loginUserId',this.loginUserId);
         sendData.append('ic_id',this.ic_id);
         sendData.append('payable_email',this.create_razor_account_form.value.payable_email);
         sendData.append('payable_beneficiary_name',this.create_razor_account_form.value.payable_beneficiary_name);
         sendData.append('payable_business_type',this.create_razor_account_form.value.payable_business_type);
         sendData.append('payable_ifsc_code',this.create_razor_account_form.value.ifsc_code);
         sendData.append('payable_bank_name',this.create_razor_account_form.value.bank_name);
         sendData.append('payable_account_no',this.create_razor_account_form.value.bank_acc_no);
         sendData.append('bank_branch',this.create_razor_account_form.value.bank_branch);
         sendData.append('payable_account_type',this.create_razor_account_form.value.payable_account_type);


         this.commonService.createRazorIcAccount(sendData).subscribe( response => {
            // this.response_ic = response;
            this.loaderActive = false;
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status)
            {
              // this.successNotify(this.editResult.message);
              this.msgClass = "alert-success";
              this.responseMsg = this.editResult.message;
              Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
              this.getIndex();
            }
            else
            {
              this.msgClass = "alert-danger";
              this.responseMsg = this.editResult.message;
              Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
            }
         });
      }
	  }

   checkRazorAccount(val){
      if(val == '1')
      {  
         this.displayGetAccntDetails = 'block';
         this.displayCreateAccount = 'none';
         this.btnEditSubmit = true;
         this.btnEditSubmit2 = false;
      }
      else
      {
        this.create_razor_account_form.patchValue({
           payable_email : '',
           payable_beneficiary_name : '',
           payable_business_type : '',
           ifsc_code : '',
           bank_name : '',
           bank_branch : '',
           payable_account_type : '',
           bank_acc_no : '',
        });
        this.displayGetAccntDetails = 'none';
        this.displayCreateAccount = 'block';
        this.btnEditSubmit = false;
        this.btnEditSubmit2 = true;
      }
   }

   validate_razor_account(){
      this.submitted_va = true;
      if(this.validate_razor_account_form.invalid){
       return;
      }
      this.loaderActive = true;

      this.razor_account_id = this.validate_razor_account_form.value.razor_account_id;

      if(this.razor_account_id != '')
      { 
        var sendData = new FormData();
        sendData.append('loginUserId',this.loginUserId);
        sendData.append('ic_id',this.ic_id);
        sendData.append('razor_account_id',this.razor_account_id);

        this.commonService.fetchRazorAccountByID(sendData).subscribe( response => {
            // this.response_ic = response;
            this.loaderActive = false;
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status)
            {
              // this.successNotify(this.editResult.message);
              this.msgClass = "alert-success";
              this.responseMsg = this.editResult.message;
              Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
              this.getIndex();
            }
            else
            {
              this.msgClass = "alert-danger";
              this.responseMsg = this.editResult.message;
              Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
            }
        });
      }
      else
      {
        var str = "Please enter razor account id";
        Swal.fire({position: 'center',icon: 'error',title: str, showConfirmButton: false, timer: 3000 });
      }
   }

}
