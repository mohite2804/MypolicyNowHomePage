import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  	selector: 'app-my-profile',
  	templateUrl: './my-profile.component.html',
  	styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  	base_url = environment.baseUrl;
  	dtOptions: DataTables.Settings = {};
  	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
  	@ViewChild('closebutton') closebutton;

 	formNewUser : any;
 	formEditUser : any;
	loaderActive : boolean =  false;
	popupTitle : any;
	submitted : boolean = false;
	btnEditSubmit : boolean = false;
  	loginUserId  : any;
  	loginUserType  : any;
  	editResult  : any;
	display : any;
	msgClass : any;
	responseMsg : any;

  	result_misp_name  : any;
  	result_misp_code  : any;
  	result_dp_name  : any;
  	result_full_name  : any;
  	result_email  : any;
  	result_mobile_no  : any;
  	result_pan  : any;
  	result_gst_no  : any;
  	result_address  : any;
  	result_city  : any;
  	result_state  : any;
  	result_pincode  : any;
  	result_status  : any;
  	result : any;
  	listTitle = "DP User List";

  	misp_name  : any;
  	dp_name  : any;
  	code  : any;
  	name  : any;
  	email  : any;
  	mobile_no  : any;
  	pan  : any;
  	aadhaar  : any;
  	gst  : any;
  	address  : any;
  	city  : any;
  	state  : any;
  	pin_code  : any;
  	status  : any;
  	display_misp_data ="none";
  	display_subid ="none";
  	subid ="none";
  	display_dt = "none";
  	edit_user = "none";

  	edit_result : any; 
  	
	validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  	validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	
  	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private customvalidationService : CustomvalidationService,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) { }

  	ngOnInit(): void 
  	{
  		this.loginUserType = sessionStorage.getItem('user_type_id');
  		this.loginUserId = sessionStorage.getItem('user_type_id');

  		if(this.loginUserType == '1' || this.loginUserType == '5'){
    		this.getIndex();
    		this.display_dt = 'block';
    	}

  		if(this.loginUserType == '7'){
    		this.edit_user = 'block';
    		this.subid = 'block';
    		this.display_misp_data = 'block';
    	}

      	if(sessionStorage.getItem('user_id')){
    		this.getMyProfile();
    	}

      	if(sessionStorage.getItem('user_type_id') == '1'){
    		this.display_subid = 'block';
    		this.display_misp_data = 'block';
    		this.listTitle = "Sub DP User List";
    	}

	    this.formNewUser = this.formBuilder.group({
	      	fullname : ['',[this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(3),Validators.maxLength(100)]],
	      	email : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_email),Validators.minLength(3),Validators.maxLength(50)]],
	      	mobile_no : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
	      	password : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(10)]],
	      	dpstatus : ['',[Validators.required]]
	    });

	    this.formEditUser = this.formBuilder.group({
	      	id : ['',[Validators.required]],
	      	fullname : ['',[this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_name_with_space),Validators.minLength(3),Validators.maxLength(100)]],
	      	email : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_email),Validators.minLength(3),Validators.maxLength(50)]],
	      	mobile_no : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
	    });
  	}
  	
	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	    	dtInstance.draw();
	  	});
	}

	ngAfterViewInit(): void {
		this.renderer.listen('document', 'click', (event) =>{
		    if (event.target.hasAttribute("change-user-id")) {
		      this.changeStatus(event.target.getAttribute("change-user-id"),event.target.getAttribute("change-status-id"));
		    }

			if (event.target.hasAttribute("view-user-privilege")) {
				this.redirectPrivilege(event.target.getAttribute("view-user-privilege"));
			}

	        if (event.target.hasAttribute("view-edit-id")) {
	          this.editRecord(event.target.getAttribute("view-edit-id"));
	        }
		});
	}

	getIndex()
	{
    	this.loginUserId = sessionStorage.getItem('user_id');
    	this.loginUserType = sessionStorage.getItem('user_type_id');
		const that = this;
		this.dtOptions = 
		{
			"pagingType": 'full_numbers',
			"pageLength": 10,
			"serverSide": true,
			"processing": true,
			'ajax' : {
			url : this.base_url+'get_dp_details',
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
					'title' : 'Name',
					'data' : 'name'
				},
				{
					'title' : 'Email',
					'data' : 'email'
				},
				{
					'title' : 'Mobile No.',
					'data' : 'mobile_no'
				},
				// {
				// 	'title' : 'Internal Code',
				// 	'data' : 'internal_code'
				// },
				{
					'title' : 'PAN',
					'data' : 'pan_no'
				},
				{
					'title' : 'Aadhaar',
					'data' : 'aadhaar'
				},
				{
					'title' : 'Action',
					'data' : 'action_btn'
				},
			],
			columnDefs: [
				{ "orderable": false, "targets": 0 }
			],
			order: [[ 6, "desc" ]]
		};
	}

	redirectPrivilege(url){
		this.router.navigate([url]);
	}

	editRecord(id){
		this.btnEditSubmit = true;
		this.resetForm();
		this.getDataById(id);
	}

	getDataById(id){
		//this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getUserDataById(sendData)
		.subscribe( response => {
			this.loaderActive = false;
			this.editResult = response;
			this.setFormData(this.editResult);
		});
	}

	setFormData(result){
		this.formEditUser.patchValue({
			id : result.result.user_master_id,
			fullname : result.result.full_name,
			email : result.result.email,
			mobile_no : result.result.mobile_no,
		});
	}

	resetForm(){
		this.submitted = false;
	}

  	getMyProfile()
	{
    	this.loginUserId = sessionStorage.getItem('user_id');
    	this.loginUserType = sessionStorage.getItem('user_type_id');
	    // //this.loaderActive = true;
	    var sendData = new FormData();
	    sendData.append('loginUserId',this.loginUserId);
	    sendData.append('loginUserType',this.loginUserType);

	    this.commonService.getProfileData(sendData)
	    .subscribe(response =>{
	      //this.loaderActive = false;
	      this.editResult = response;
	      this.displayProfileData(this.editResult.result);
	    });

	}

	displayProfileData(result){
		this.result_misp_name = result.misp_name;
		this.result_dp_name = result.dp_name;
		this.result_misp_code = result.code;
		this.result_full_name = result.name;
		this.result_email = result.email;
		this.result_mobile_no = result.mobile_no;
		this.result_pan = result.pan;
		this.result_gst_no = result.gst;
		this.result_address = result.address;
		this.result_city = result.city;
		this.result_state = result.state;
		this.result_pincode = result.pin_code;
		this.result_status = result.status;
	}
	
	changeStatus(id,status)
	{
		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('status',status);
		var title = "";
		switch(status) 
		{
			case '1':
			  title = "Are you sure you want to Inactive?";
			break;
			case '2':
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
			if (willDelete.value) {
				//this.loaderActive = true;
				this.commonService.changeStatuseByUserId(sendData)
				.subscribe( response => {
					var output_data: any = response;
					this.runTable();
					this.loaderActive = false;
					if(output_data.status){
					  Swal.fire(output_data.status.message, '', "success");
					}else{
					  Swal.fire (output_data.status.message,  "" ,  "error" );
					}
				});
			}
		});
	}

	
	closePopup(){
		this.closebutton.nativeElement.click();
		this.display='none';
	}

	updateForm()
	{
		this.submitted = true;
    	if(this.formEditUser.invalid){
      		return;
    	}
    	//this.loaderActive = true;
    	const sendData = new FormData();
      	sendData.append('id',this.formEditUser.value.id);
    	sendData.append('fullname',this.formEditUser.value.fullname);
    	sendData.append('email',this.formEditUser.value.email);
    	sendData.append('mobile_no',this.formEditUser.value.mobile_no);

	    this.commonService.updateUser(sendData)
	    .subscribe(response =>{

	      this.loaderActive = false;
	      this.editResult = response;
	      if(this.editResult.status){
	        this.closePopup();
	        this.runTable();
	        Swal.fire({
	            title: 'success',
	            html: this.editResult.message,
	            timer: 3000
	        });
	      }else{
	        this.msgClass = "alert-danger";
	        this.responseMsg = this.editResult.message;
	        this.display = 'block';
    		window.location.reload();
	      }
	    });
	}

	submitForm()
	{
    	this.submitted = true;
    	if(this.formNewUser.invalid){
      		return;
    	}
    	this.loaderActive = true;
    	const sendData = new FormData();
    	this.loginUserId = sessionStorage.getItem('user_id');
    	this.loginUserType = sessionStorage.getItem('user_type_id');
      	sendData.append('loginUserId',this.loginUserId);
      	sendData.append('loginUserType',this.loginUserType);
    	sendData.append('fullname',this.formNewUser.value.fullname);
    	sendData.append('email',this.formNewUser.value.email);
    	sendData.append('mobile_no',this.formNewUser.value.mobile_no);
    	sendData.append('password',this.formNewUser.value.password);
    	sendData.append('status',this.formNewUser.value.dpstatus);

	    this.commonService.submitNewUser(sendData)
	    .subscribe(response =>{

	      this.loaderActive = false;
	      this.editResult = response;
	      if(this.editResult.status){
	        this.closePopup();
	        this.runTable();
	        Swal.fire({
	            title: 'success',
	            html: this.editResult.message,
	            timer: 3000
	        });
	      }else{
	        Swal.fire({
				icon: 'error',
				title: 'Oops...',
	            html: this.editResult.message,
	            timer: 3000
	        }).then((result) => {
    			window.location.reload();
	        });
	      }
	    });
	}

	openModel(){
		this.btnEditSubmit = true;
		this.popupTitle = "Add New User";
		this.display='none';

		// this.formNewUser.patchValue({
		// 	'fullname' : "",
		// 	'email' : "",
		// 	'mobile_no' : ""
		// });
	}

	openEditModel(){
    	this.loginUserId = sessionStorage.getItem('user_id');
		this.btnEditSubmit = true;
		this.display='none';
		this.editRecord(this.loginUserId);
	}
}
