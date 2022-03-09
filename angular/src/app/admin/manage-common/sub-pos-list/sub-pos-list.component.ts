import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray  } from  '@angular/forms';
import { Router,ActivatedRoute,NavigationEnd} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-sub-pos-list',
  templateUrl: './sub-pos-list.component.html',
  styleUrls: ['./sub-pos-list.component.css']
})
export class SubPosListComponent implements OnInit {

	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	loginUserId : any;
	BackPosUrl : any;
	dpId : any;
	table : any;
	editResult : any;

	formRecodEdit : any;
	display : any;
	loaderActive : boolean =  false;
	popupTitle : any;
	fileUpload : any;
	downloadurl : any;
	submitted : boolean = false;
	btnEditSubmit : boolean = false;
	showCreateBtn : boolean = true;
	access_permission:any;
	posuserlist:any;
	inNewEntery : boolean = true;
	PasswordInfo : boolean = false;
	msgClass : any;
	responseMsg : any;
	is_isuzu  : any;
	dp_name : any;
	// constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }
	constructor(private activatedRoute : ActivatedRoute,private _location: Location, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
		this.loginUserId = sessionStorage.getItem("adminUserId");
		this.BackPosUrl = sessionStorage.getItem("BackPosUrl");
		this.access_permission = sessionStorage.getItem("access_permission");
		this.is_isuzu = sessionStorage.getItem("is_isuzu");
	 }

  	ngOnInit(): void {

		this.PasswordInfo=false;
		this.inNewEntery=true;
		this.formRecodEdit = this.formBuilder.group({
			id :[''],
			parent_pos_user :['',[Validators.required]],
			first_name : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
			middle_name : ['',[Validators.minLength(1), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
			last_name : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
			email : ['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
			mobileNo : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10), Validators.pattern('^[6-9][0-9]{9}$')]],
			password : ['',[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
		  });

  		this.loginUserId = sessionStorage.getItem("adminUserId");    
		this.dpId =  this.activatedRoute.snapshot.paramMap.get('dpId');
		this.getIndex();
		this.GetPosUser()
		this.dp_name='POS';
		if(this.is_isuzu==1){
			this.dp_name='DP';
		}
  	}

  	getIndex(){
		  
		this.dp_name='POS';
		if(this.is_isuzu==1){
			this.dp_name='DP';
		}
		const that = this;
	  	this.dtOptions = {
	      "pagingType": 'full_numbers',
	      "pageLength": 10,
	      "serverSide": true,
	      "processing": true,
	      'ajax' : {
	          url : this.base_url+'admin/getSubPosListWithLogin',
	          type : 'POST',
	          data: {
	          "loginUserId": this.loginUserId,
	          "dpId": this.dpId,
	          "table": this.table

	      },
	          dataType: "json",
	      },

	      columns: [
	        {
	          'title' : 'S.No',
	          'data' : 'sno'
	        },
	        {
	          'title' : this.dp_name+' Name',
	          'data' : 'name_dp'
	        },
	        {
	          'title' : 'Sub '+this.dp_name+' Name',
	          'data' : 'app_fullname'
	        },
	        {
	          'title' : 'Mobile Number',
	          'data' : 'mobile_no'
	        },
	        {
	          'title' : 'Email',
	          'data' : 'email'
	        },           
	        {
	          'title' : 'Status',
	          'data' : 'status'
	        },
	        {
	          'title' : 'Created',
	          'data' : 'created_date'
	        },
	        {
	          'title' : 'Action',
	          'data' : 'action_btn'
	        }
	      ],
	      columnDefs: [{ 
			"targets": [0,7], 
			"orderable": false
		}],
		"order": [[ 6, "desc" ]]
	  };
	}

	GetPosUser(){
		if(this.dpId!=null){
			var sendData = new FormData();
			sendData.append('pos_id',this.dpId);
			this.commonService.getPosUserDataById(sendData)
			.subscribe( response => {
				this.posuserlist = response;
				this.posuserlist=this.posuserlist.result;
			});
		}else{
			this.commonService.getPosUserData()
			.subscribe( response => {
			this.posuserlist = response;
			this.posuserlist=this.posuserlist.result;
			});
		}
	}
	runTable(){
	this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	    dtInstance.draw();
	  });
	}
	redirectBackPos(){
		this._location.back();
		// this.router.navigate([this.BackPosUrl]);
	  }
	ngAfterViewInit(): void {
	this.renderer.listen('document', 'click', (event) => {

	    if (event.target.hasAttribute("view-record-id")) {
	      this.viewRecord(event.target.getAttribute("view-record-id"));
	    }
	    if (event.target.hasAttribute("view-edit-id")) {
	      this.editRecord(event.target.getAttribute("view-edit-id"));
	    }
	    if (event.target.hasAttribute("change-misp-id")) {
	      this.changeStatus(event.target.getAttribute("change-misp-id"),event.target.getAttribute("change-status-id"));
	    }

	    if (event.target.hasAttribute("change-privilege-url")) {
	      this.redirectToPrivilege(event.target.getAttribute("change-privilege-url"));
	    }
	});
	}

	editRecord(id){ 
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Update Sub Pos User Details";
		this.display='none';
		this.PasswordInfo = true;
		this.formRecodEdit.get("password").setValidators([Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,14}')]);
		this.formRecodEdit.get("password").updateValueAndValidity();
		//this.msg_display = 'none';
		this.getDataById(id);
	  }

	redirectToPrivilege(url){
		this.router.navigate([url]);
	}

	viewRecord(id){
		this.btnEditSubmit = false;
		this.popupTitle = "Show DP Sub User Details";
		this.display='block';
		this.getDataById(id);

	}

	closePopup(){
		this.display='none';
		this.resetForm();
		this.loaderActive = false;

	}


	getDataById(id){
		this.editResult = "";
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getSubPosDataById(sendData)
		.subscribe( response => {
		  var otput_data : any = response;
		  this.editResult = otput_data.result;
		  console.log(this.editResult);
		  this.setFormData(this.editResult);
		  this.loaderActive = false;
		});
	}

	setFormData(result){ 

		this.loaderActive = true;
		setTimeout(() => {

			if(result.middle_name!='0'){
				result.middle_name=result.middle_name;
			  }else{
				result.middle_name='';
			  }
			this.formRecodEdit.patchValue({  
				id : result.user_master_id,
				first_name : result.first_name,
				middle_name : result.middle_name,
				last_name : result.last_name,
				email : result.email,
				mobileNo : result.mobile_no,
				parent_pos_user : result.parent_id,
			});        
			this.loaderActive = false;
		},4000);
	  }


	changeStatus(id,status){
		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('status',status);
		var title = "";
		switch(status) {
		  case 'active':
		      title = "Are you sure you want to Inactive?";
		  break;
		  case 'inactive':
		      title = "Are you sure you want to Active?";
		  break;
		}
		Swal.fire({
		  title: title,
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Confirm',
		  cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			if (willDelete.value) 
				{
			  		this.commonService.changeStatuseBySubPosId(sendData)
			  		.subscribe( response => {
				    var output_data: any = response;
				    this.runTable();
				    if(output_data.status){
				      Swal.fire(output_data.message, '', "success");
				    }else{
				      Swal.fire (output_data.message,  "" ,  "error" );
				    }
				});
			}
		});
	}
	openModel(){
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "ADD Sub Pos Details";
		this.display='none';  
		this.showCreateBtn = true;
		// this.getDataById(id);
	  }
	  resetForm(){
		this.submitted = false;
		this.formRecodEdit.patchValue({
		  id : 0,
		  parent_pos_user : '',
		  first_name : '',
		  middle_name : '',       
		  last_name : '',       
		  email : '',       
		  mobileNo : '',
		  password : '',
		});
	  }


	  submitForm(){
		this.submitted = true;
		if(this.formRecodEdit.invalid){
		  return;
		}
		this.loaderActive = true;
		const sendData = new FormData();
		sendData.append('id',this.formRecodEdit.value.id);
		sendData.append('parent_pos_user',this.formRecodEdit.value.parent_pos_user);
		sendData.append('first_name',this.formRecodEdit.value.first_name);
		sendData.append('middle_name',this.formRecodEdit.value.middle_name);
		sendData.append('last_name',this.formRecodEdit.value.last_name);
		sendData.append('email',this.formRecodEdit.value.email);
		sendData.append('mobileNo',this.formRecodEdit.value.mobileNo);
		sendData.append('password',this.formRecodEdit.value.password);
		sendData.append('userid',this.loginUserId);
		this.commonService.UpdateSubPosData(sendData)
		.subscribe(response =>{

			this.loaderActive = false;
			this.editResult = response;
			if(this.editResult.status){
				this.runTable();
				this.closePopup();
				// this.successNotify(this.editResult.message);
				console.log(sendData);
				console.log(this.formRecodEdit.value.id);
				console.log(this.formRecodEdit.value.email);
				if(this.editResult.message == "Insert User Successfully."){
					Swal.fire(this.editResult.message, '', "success");
					this.display='none'; 
				}else{
					Swal.fire(this.editResult.message, '', "success");
				}
				this.msgClass = "alert-success";
				this.responseMsg = this.editResult.message;
			}else{
				Swal.fire(this.editResult.message, '', "error");
				this.msgClass = "alert-danger";
				this.responseMsg = this.editResult.message;
			}
			
				/*   
		  this.loaderActive = false;
		  this.editResult = response;
		  if(this.editResult.status){
			  this.runTable();
			  this.closePopup();
			  this.closeAddExpenseModal.nativeElement.click();
			  // this.successNotify(this.editResult.message); 
			  Swal.fire(this.editResult.message, '', "success");
			  this.msgClass = "alert-success";       
			  this.responseMsg = this.editResult.message;  
		  }else{
			  this.closePopup();
			  this.msgClass = "alert-danger";       
			  this.responseMsg = this.editResult.message; 
		  } */
		});
	  }

}
