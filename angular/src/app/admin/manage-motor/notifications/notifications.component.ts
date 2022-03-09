import { Component, OnInit, Renderer2, ViewChild, ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { NgModule } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
//import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

	loaderActive : boolean =  false;
	base_url = environment.baseUrl;
	formNotification: FormGroup;
  	loginUserId:any;
  	display:any;
	notification_type:any;
	responseMsg : any;
	submitResponse : any;
	submitted : boolean = false;
	btnSubmit : boolean = false;
	msgClass: any;
  	msg_display : any;

  	misp_id:any;
  	mispData:any;
  	
  	dp_id:any;
  	dpData:any;

	checkIfRecipientSelected_status :any;
	validation_response_msg :any;

	displayMispDrodown:any;
	displayDpDrodown:any;


  selectedMisp :any =  [];
  selectedDp :any= [];
  access_permission:any;
  is_isuzu  : any;
  hide_export : boolean = true;
	bp_label  : any; 	
	pos_label  : any; 	
	bp_pos_label  : any;
 

  	// constructor(private renderer: Renderer2, private notifyService: NotificationsService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef) { 
   //  	//this.loadScripts();
  	// }
  	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
		this.loginUserId = sessionStorage.getItem("adminUserId");
		this.access_permission = sessionStorage.getItem("access_permission");	
		this.is_isuzu = sessionStorage.getItem("is_isuzu");
	}

  	ngOnInit(): void {
  		this.loginUserId = sessionStorage.getItem("adminUserId");
  		console.log(this.loginUserId);

  		this.displayMispDrodown = 'none';
		  this.displayDpDrodown = 'none';

  		this.getMisps();
  		this.getDps();


  		// this.formNotification = this.formBuilder.group({
  		// 	misp_id : [''],
  		// 	dp_id : [''],
  		// 	reciever_type : [''],
	   //    notification_type : ['',[Validators.required,Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")]],
	   //    notification_msg : ['',[Validators.required,Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")]]
	   //  });
     this.formNotification = this.formBuilder.group({
        misp_id : [''],
        dp_id : [''],
        all_misp : [''],
        misps: [''],
        all_dp: [''],
        dps: [''],
        reciever_type : [''],
        // notification_type : ['',[Validators.required,Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")]],
        notification_type : ['',[Validators.required]],
        // notification_type : ['',[Validators.required,Validators.pattern("/^[A-Za-z0-9_@./#&+-]*$/")]],
        notification_msg : ['',[Validators.required]]
      });

	    this.btnSubmit = true;
		
		if(this.is_isuzu==1){
			this.hide_export=false;
			this.bp_label = 	'MISP';
			this.pos_label = 	'DP';
			this.bp_pos_label =	'MISP & DP';
		}else{
			this.bp_label = 	'BUSINESS PARTNER';
			this.pos_label = 	'POSP';
			this.bp_pos_label =	'BUSINESS PARTNER & POSP';
		}
  	}



  	getMisps()
  	{
	   if(this.is_isuzu==1){
		   const sendData = new FormData();
		   sendData.append('userid',this.loginUserId);
		   this.commonService.getMispDataISUZU(sendData).
			subscribe( response => {
				  this.mispData = response;
				  this.mispData = this.mispData.data;
				  console.log(this.mispData);
			});

	   }else{
			this.commonService.getMispData().
			subscribe( response => {
				this.mispData = response;
				this.mispData = this.mispData.data;
				console.log(this.mispData);
			});
	   }
  	}

  	getDps()
  	{

		if(this.is_isuzu==1){
			const sendData = new FormData();
			sendData.append('userid',this.loginUserId);
			this.commonService.getDpsISUZU(sendData).
			 subscribe( response => {
				this.dpData = response;
				this.dpData = this.dpData.data;
				//this.setFormData(this.state_data);
				console.log(this.dpData);
			 });
 
		}else{
			this.commonService.getDps()
			.subscribe( response => {
				this.dpData = response;
				this.dpData = this.dpData.data;
				//this.setFormData(this.state_data);
				console.log(this.dpData);
			});
		}
  	}

  	submitForm()
  	{
  		this.submitted = true;
	    if(this.formNotification.invalid){
        console.log('adsa');
	      return;
	    }
	    this.loaderActive = true;

	    this.checkIfRecipientSelected(this.formNotification.value.misp_id,this.formNotification.value.dp_id);

	    if(this.checkIfRecipientSelected_status)
	    {
	    	const sendData = new FormData();
		    sendData.append('misp_id',this.formNotification.value.misp_id);
		    sendData.append('dp_id',this.formNotification.value.dp_id);
		    sendData.append('notification_type',this.formNotification.value.notification_type);
		    sendData.append('notification_msg',this.formNotification.value.notification_msg);
		    sendData.append('userid',this.loginUserId);
			console.log(sendData);

		    this.commonService.submit_notification(sendData)
		    .subscribe(response =>{
		      	this.loaderActive = false;
		      	this.submitResponse = response;
		      	console.log(this.submitResponse);

		      	if(this.submitResponse.status)
		      	{
		      		Swal.fire(this.submitResponse.message,  "" ,  "success" );
		      		this.resetForm();			      		
		      	}
		      	else
		      	{
		      		this.submitResponse.message = 'Something WENT wrong. Please try again later';
		      		Swal.fire(this.submitResponse.message,  "" ,  "error" );
		      	}
		    });
	    }
	    else
	    {
	    	this.loaderActive = false;
	    	this.validation_response_msg = 'Please select at least one MISP or DP';
		    Swal.fire(this.validation_response_msg,  "" ,  "error" );	
	    }	    
  	}

  	checkIfRecipientSelected($misp_id,$dp_id)
  	{
  		if($misp_id == '' && $dp_id == '')
  		{
  			this.checkIfRecipientSelected_status = false;
  		}
  		else
  		{
  			this.checkIfRecipientSelected_status = true;
  		}
  	}

  	resetForm(){
      	this.submitted = false;
      	this.formNotification.patchValue({
	        misp_id : 0,
	        dp_id : '',
	        notification_type : '',
	        notification_msg : '',
	    });
  	}

  	showMisp(val){
  		if(val == '1'){
  			this.formNotification.get("misp_id").setValidators([Validators.required]);
      	this.formNotification.get("misp_id").updateValueAndValidity();
        this.formNotification.get("dp_id").setValidators([]);
        this.formNotification.get("dp_id").updateValueAndValidity();
        this.selectedDp = '';
  		}
  		else{
  			this.formNotification.get("misp_id").setValidators([]);
      	this.formNotification.get("misp_id").updateValueAndValidity();
  		}
 
  		this.displayMispDrodown = 'block';
  		this.displayDpDrodown = 'none';
  	}

  	showDp(val){
  		if(val == '2'){
  			this.formNotification.get("dp_id").setValidators([Validators.required]);
      	this.formNotification.get("dp_id").updateValueAndValidity();
        this.formNotification.get("misp_id").setValidators([]);
        this.formNotification.get("misp_id").updateValueAndValidity();
        this.selectedMisp = '';
        this.getDps();
  		}
  		else{
  			this.formNotification.get("dp_id").setValidators([]);
      	this.formNotification.get("dp_id").updateValueAndValidity();
  		}
 
  		this.displayMispDrodown = 'none';
  		this.displayDpDrodown = 'block';
  	}

  	showMispDp(val){
  		if(val == '3'){
  			this.formNotification.get("misp_id").setValidators([Validators.required]);
      	this.formNotification.get("misp_id").updateValueAndValidity();
  			this.formNotification.get("dp_id").setValidators([Validators.required]);
      	this.formNotification.get("dp_id").updateValueAndValidity();
        this.dpData = [];
  		}
  		else{
  			this.formNotification.get("misp_id").setValidators([]);
      	this.formNotification.get("misp_id").updateValueAndValidity();
  			this.formNotification.get("dp_id").setValidators([]);
      	this.formNotification.get("dp_id").updateValueAndValidity();
  		}
 
  		this.displayMispDrodown = 'block';
  		this.displayDpDrodown = 'block';	
  	}

  	getFilterDp(event){
		this.loaderActive = true;
		console.log(this.selectedMisp);
      this.formNotification.patchValue({dp_id : '' });
      this.dpData = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      // sendData.append('misp_id',this.formNotification.value.misp_id);
      sendData.append('misp_id',this.selectedMisp);
      this.commonService.getDpListByMispIdNotification(sendData)
        .subscribe(response => {
			this.loaderActive = false;
          var result : any  = response;
          console.log(result);
          // return;
          if(result.status){
              this.dpData = result.result;
          }
      });  
        
	  }


}