import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-ticker-info',
	templateUrl: './ticker-info.component.html',
	styleUrls: ['./ticker-info.component.css']
})
export class TickerInfoComponent implements OnInit {

	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	loginUserId : any;
	editResult : any;
	formRecodEdit: FormGroup;

	//formRecodEdit : any;

	display : any;
	showInputDiv : any;
	loaderActive : boolean =  false;
	popupTitle : any;
	fileUpload : any;
	downloadurl : any;

	statusList : any;
	submitted : boolean = false;
	btnEditSubmit : boolean = true;
	showCreateBtn : boolean = true;
	attachment_src : any;
	responseMsg : any;
	msgClass: any;
	output_result:any;
	selected_attachment : any;

	datepicker_start_date: NgbDateStruct;
  	datepicker_end_date: NgbDateStruct;

  	start_date:any;
  	end_date:any;
  	selected :any;
  	usertype_list : any;


	//validation_for_name_with_space :any = "^[a-zA-Z ]*$";
	validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
	access_permission:any;
	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
		this.loginUserId = sessionStorage.getItem("adminUserId");
    	this.access_permission = sessionStorage.getItem("access_permission");
	}

	ngOnInit(): void {
		this.loginUserId = sessionStorage.getItem("adminUserId");
		
		this.usertype_list = [
				   		{id: 'admin',label: 'Admin',isChecked: false},
				   		{id: 'business-partner',label: 'Business Partner',isChecked: false},
				   		{id: 'pos',label: 'POS',isChecked: false},
				   	];

		this.selected = [];
		this.getStatusData();
		this.getIndex();

		this.formRecodEdit= this.formBuilder.group({
	        id : [''],
	        ticker_name : ['',[Validators.required]],
	        ticker_description : ['',[Validators.required]],
	        status : ['',[Validators.required]],
	        attachment : [''],
	        attachment_img : [''],
	        ticker_start_date : ['',[Validators.required]],
	        ticker_end_date : ['',[Validators.required]],
	        usertype : ['',[Validators.required]],

	      });
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
	              url : this.base_url+'admin/getTickerList',
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
	              'title' : 'Ticker Name',
	              'data' : 'ticker_name'
	            },
	            {
	              'title' : 'Ticker Description',
	              'data' : 'ticker_desc'
	            },
	            {
	              'title' : 'Start Date',
	              'data' : 'start_date'
	            },
	            {
	              'title' : 'End Date',
	              'data' : 'end_date'
	            },
	            {
	              'title' : 'Status',
	              'data' : 'status'
	            },
	            {
	              'title' : 'Created At',
	              'data' : 'created_at'
	            },
	            {
	              'title' : 'Action',
	              'data' : 'action_btn'
	            }

	          ],

	          columnDefs: [
	            { "orderable": false, "targets": 7 },
	            { "orderable": false, "targets": 0 }
	          ],
	          order: [[ 2, "asc" ]]
	    };

	}

	getStatusData(){
	  	this.commonService.getStatusData().subscribe( response => {
          	this.statusList = response;
          	this.statusList = this.statusList.result;
        });
	}

	uploadAttachment(event){
  		var file :any = event.target.files[0];
  		var file_type:any = file.type;
  		var file_size :any = file.size ;
  		console.log("file  " +file_size);
  		if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
  			Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
  			this.selected_attachment = "";

  		}else if(file_size > 5242880){
  			Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
  			this.selected_attachment = "";
  		}else{
  			this.formRecodEdit.patchValue({
  				'attachment' : file
  			});
  		}
  	}

	submitForm(){
		this.submitted = true;
  		// console.log('test1');
	    if(this.formRecodEdit.invalid)
	    {
	    	console.log('test_false');
	      	return;
	    }
	    // else
	    // {
	    // 	console.log('test_true');
	    // 	// alert('sdsd');
	    // }
	    // console.log(this.selected);
	    if(this.selected.length == 0)
	    {
	    	Swal.fire({position: 'center',icon: 'error',title: 'Please select usertype', showConfirmButton: false, timer: 3000 });
	    	return;
	    }

	    this.start_date = this.formRecodEdit.value.ticker_start_date;
      	this.end_date = this.formRecodEdit.value.ticker_end_date;

	    this.loaderActive = true;
	    const sendData = new FormData();
	    sendData.append('loginUserId',this.loginUserId);
	    sendData.append('id',this.formRecodEdit.value.id);
	    sendData.append('ticker_name',this.formRecodEdit.value.ticker_name);
	    sendData.append('ticker_description',this.formRecodEdit.value.ticker_description);
	    sendData.append('status',this.formRecodEdit.value.status);
	    sendData.append('ticker_start_date',JSON.stringify(this.start_date));
	    sendData.append('ticker_end_date',JSON.stringify(this.end_date));
	    sendData.append('attachment',this.formRecodEdit.value.attachment);
	    sendData.append('usertype',this.selected);


	    this.commonService.addTickerInfo(sendData).subscribe(response =>
	    {
	      	this.loaderActive = false;
	      	this.output_result = response;
	      	if(this.output_result.status)
	      	{
	        	this.runTable();
	          	this.closePopup();
		        this.closeAddExpenseModal.nativeElement.click();
	         	this.responseMsg = this.output_result.message;
	          	Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
	      	}
	      	else
	      	{
	          	this.closePopup();
	          	this.responseMsg = this.output_result.message;
	          	Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });

	      	}
	    });
	}

	openModel(){
		this.showInputDiv = "block";
		this.btnEditSubmit = true;
		// this.resetForm();
		this.popupTitle = "Add OD Discount";
		this.display='none';
		this.showCreateBtn = true;
  	}

  	closePopup(){
    	this.display='block';
    	this.resetForm();
    	this.loaderActive = false;
  	}

  	runTable(){
    	this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        	dtInstance.draw();
      	});
  	}

  	ngAfterViewInit(): void {
  		this.renderer.listen('document', 'click', (event) => {
  			if (event.target.hasAttribute("view-edit-id")) {
	          this.editRecord(event.target.getAttribute("view-edit-id"));
	        }

  			if (event.target.hasAttribute("view-active-id")) {
  				this.changeStatus(event.target.getAttribute("view-active-id"),2);
  			}
  			if (event.target.hasAttribute("view-inactive-id")) {
  				this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
  			}
  		});
  	}

  	// Selected item
  	fetchSelectedItems() {
  		this.selected = this.usertype_list.filter((value, index) => {
  			return value.isChecked
  		});
  	}

  	// IDs of selected item
  	changeSelection() {
  		this.selected = []
  		this.usertype_list.forEach((value, index) => {
  			if (value.isChecked) {
  				this.selected.push(value.id);
  			}
  		});
  		console.log(this.selected);
  	}

  	resetForm(){
  		this.submitted = false;
  		this.formRecodEdit.patchValue({
  			ticker_name : '',
	        ticker_description : '',
	        status : '',
	        attachment : '',
	        attachment_img : '',
	        ticker_start_date : '',
	        ticker_end_date : '',
	        usertype : '',
  		});
  	}

  	changeStatus(id,status){
  		var sendData = new FormData();
  		sendData.append('ticker_id',id);
  		sendData.append('status_id',status);
  		sendData.append('userid',this.loginUserId);
  		Swal.fire({
  			title: 'Are you sure?',
  			icon: 'warning',
  			showCancelButton: true,
  			confirmButtonText: 'Confirm',
  			cancelButtonText: 'Cancel'
  		})
  		.then((willDelete) => {
  			if (willDelete.value) {
  				this.commonService.changeStatusByTickerId(sendData)
  				.subscribe( response => {
  					this.editResult = response;
  					this.runTable();
  					if(this.editResult.status){
  						Swal.fire(this.editResult.message, '', "success");
  					}else{
  						Swal.fire (this.editResult.message,  "" ,  "error" );
  					}

  				});
  			}
  		});

  	}

  	editRecord(id){
	    this.showInputDiv = "block";
	    this.btnEditSubmit = true;
	    this.resetForm();
	    this.popupTitle = "Update Ticker Details";
	    this.display='none';
	    //this.msg_display = 'none';
	    this.getDataById(id);

  	}

  	getDataById(id){
	    this.loaderActive = true;
	    var sendData = new FormData();
	    sendData.append('id',id);
	    this.commonService.getTickerDataById(sendData)
	    .subscribe( response => {
	      this.loaderActive = false;
	      this.editResult = response;
	      this.setFormData(this.editResult);
	      console.log(this.editResult);
	    });
  	}

  	setFormData(result){
	    this.formRecodEdit.patchValue({
	      	id : result.result.ticker_id,
	      	ticker_name : result.result.ticker_name,
	      	ticker_description : result.result.ticker_description,
	      	status : result.result.status_id,
	      	ticker_start_date : result.result.start_date,
	      	ticker_end_date : result.result.end_date,
	      	usertype : result.result.for_usertype,
	      	attachment : result.result.ticker_attachment,

    	});
  	}


}
