import { Component, OnInit,Renderer2, ViewChild, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
// import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray  } from  '@angular/forms';
// import { Router,ActivatedRoute} from  '@angular/router';
import { Router, ActivatedRoute } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';



@Component({
	selector: 'app-pos-list',
	templateUrl: './pos-list.component.html',
	styleUrls: ['./pos-list.component.css']
})
export class PosListComponent implements OnInit {
	base_url = environment.baseUrl;

	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;

	dtRendered = true;
	mispId : any;
  	table : any;

	loginUserId : any;
	editResult : any;

	formRecodEdit : any;
	formRecordEdit : any;
	display : any;
	loaderActive : boolean =  false;
	fileUpload : any;
	downloadurl : any;
	submitted : boolean = false;
	btnEditSubmit : boolean = false;
	showCreateBtn : boolean = true;
	popupTitle = "business Partner Details";
	responseMsg : any;
	msgClass: any;
	PincodeDetailsData : any;
	statusval : any = 1;
	showInputDiv = "block";
	posData: any;


	//validation_for_name_with_space :any = "^[a-zA-Z ]*$";
	validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
	validation_for_pan_no :any = "^[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$";
	validation_for_gst_no :any   = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

	urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

	validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	is_isuzu  : any;
	dp_name  : any;
	misp_name  : any;
  role_code : any;
	show_download:boolean=false;

	constructor(private activatedRoute : ActivatedRoute,private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,public cdr: ChangeDetectorRef,private excelService:ExcelService) {
		this.is_isuzu = sessionStorage.getItem("is_isuzu");
	 }


	ngOnInit(): void {
		this.loginUserId = sessionStorage.getItem("adminUserId");
    this.role_code = sessionStorage.getItem("role_code");

		this.mispId =  this.activatedRoute.snapshot.paramMap.get('mispId');
		this.dp_name ='POS';
		this.misp_name ='Business Partner Name';
		this.getIndex();
		this.showHideStatus(1);
	}

	getIndex(){
		if(this.is_isuzu==1){
			this.dp_name ='DP';
			this.misp_name ='MISP';
		  }
		  if(this.loginUserId=='588' && this.role_code == 'account'){
			  this.show_download= true;
		  }

		//console.log('test pro..............');
		const that = this;
		this.dtOptions = {
			"pagingType": 'full_numbers',
			"pageLength": 10,
			"serverSide": true,
			"processing": true,
			'ajax' : {
				url : this.base_url+'admin/getPosListWithLogin',
				type : 'POST',
				data: {
					"loginUserId": this.loginUserId,
					"mispId": this.mispId
				},
				dataType: "json",
			},

			columns: [
			{
				'title' : 'S.No',
				'data' : 'sno'
			},
			{
				'title' : this.misp_name,
				'data' : 'name'
			},
			{
				'title' : 'Name',
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
				'title' : 'City',
				'data' : 'city_name'
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
				"targets": [0,8],
				"orderable": false
			}],
			"order": [[ 7, "desc" ]]
		};
	}

	runTable(){
    	this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        	dtInstance.draw();
      	});
  	}

  	ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
	        if (event.target.hasAttribute("view-record-id")) {
	          this.viewRecord(event.target.getAttribute("view-record-id"));
	        }
	        if (event.target.hasAttribute("change-misp-id")) {
	          this.changeStatus(event.target.getAttribute("change-misp-id"),event.target.getAttribute("change-status-id"));
	        }

	        if (event.target.hasAttribute("change-privilege-url")) {
	          this.redirectToPrivilege(event.target.getAttribute("change-privilege-url"));
	        }

	        if (event.target.hasAttribute("view-sub-dp-user-details")) {
	          this.redirectSubDpUser(event.target.getAttribute("view-sub-dp-user-details"));
	        }

    	});
  	}

  	redirectSubDpUser(url){
    	this.router.navigate([url]);
  	}

  	redirectToPrivilege(url){
    	this.router.navigate([url]);
  	}

  	viewRecord(id){
	    this.btnEditSubmit = false;
	    this.popupTitle = "Show POS Details";
	    this.display='block';
	    this.getDataById(id);

	}

	exportDataForm()
	{
		const sendData = new FormData();

		sendData.append('loginUserId',this.loginUserId);
    	sendData.append('mispId','');
		this.commonService.downloadPosListWithLogin(sendData)
	      .subscribe(response =>{
	        this.loaderActive = false;
	        this.posData = response;
	        this.excelService.exportAsExcelFile(this.posData, 'PolicyData');

	    });
  }

  	closePopup(){
    	this.display='none';
    	this.loaderActive = false;
  	}


  	getDataById(id){
	    this.editResult = "";
	    this.loaderActive = true;
	    var sendData = new FormData();
	    sendData.append('id',id);
	    this.commonService.getPosDataById(sendData)
	    .subscribe( response => {
	      var otput_data : any = response;
	      this.editResult = otput_data.result;
	      this.loaderActive = false;
	      console.log(this.editResult);
	    });
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
	    if (willDelete.value) {
	      this.commonService.changeStatuseByPosId(sendData)
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

  	showHideStatus(statusid){
        this.statusval = statusid;
        const that = this;
        // make sure your template notices it
        this.cdr.detectChanges();
        // initialize them again
        this.dtRendered = true;
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(this.statusval).draw();
        });
    }

}
