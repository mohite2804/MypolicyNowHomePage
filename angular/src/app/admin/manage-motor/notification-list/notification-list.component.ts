import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  	// constructor() { }
  	base_url = environment.baseUrl;
  	dtOptions: DataTables.Settings = {};
  	@ViewChild(DataTableDirective) dtElement: DataTableDirective;

	loginUserId : any;
  	loginUserType : any;
  	token  : any;
  	result : any;
  	display : any;
  	
  	loaderActive : boolean =  false;
  	notification_list : any;

  	notification_title: any;
  	notification_msg: any;
  	showInputDiv = "block";
  	single_notification_data : any;

  	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {

  	}

  	ngOnInit(): void {
		this.loginUserId = sessionStorage.getItem("adminUserId");
    	this.loginUserType = sessionStorage.getItem('adminUserTypeId');
    	this.token = sessionStorage.getItem("user_token");

    	this.getIndex();
	}

	

	getIndex()
	{
		console.log('Testing Notification List..............');
		const that = this;
	    this.dtOptions = {
	          "pagingType": 'full_numbers',
	          "pageLength": 10,
	          "serverSide": true,
	          "processing": true,
	          'ajax' : {
	              url : this.base_url+'get_all_notifications',
	              type : 'POST',
	              data: {
	              	"loginUserId": this.loginUserId,
	              	"loginUserType": this.loginUserType,
	          	},
	              	dataType: "json",
	          	},
	          	columns: [
		            {
		              'title' : 'Sr.No',
		              'data' : 'sno'
		            },
		            {
		              'title' : 'Type',
		              'data' : 'notification_type'
		            },
		            {
		              'title' : 'Message',
		              'data' : 'notification_msg'
		            },
		            {
		              'title' : 'From',
		              'data' : 'from_name'
		            },
		            {
		              'title' : 'Status',
		              'data' : 'read_status'
		            },
		            {
              			'title' : 'Action',
	              		'data' : 'action_btn'
	            	}
	          	],
	          	columnDefs: [
	            	{ "orderable": false, "targets": 5 }
	          	],
	          	order: [[ 3, "desc" ]]
	    };
	}

	openModel(){
	    this.showInputDiv = "block";
	    // this.popupTitle = "Add Query Type";
	    this.display='none';
  	}

  	closePopup(){
	    this.display='block';
	    this.notification_title= '';
	    this.notification_msg= '';
	    this.loaderActive = false;
	    this.runTable();
	}

	runTable(){
	    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	        dtInstance.draw();
	      });
	}

	ngAfterViewInit(): void {
    	this.renderer.listen('document', 'click', (event) => {
    		if (event.target.hasAttribute("view-notification-id")) {
	          	this.viewRecord(event.target.getAttribute("view-notification-id"));
	        }
    	})
    }	

    viewRecord(id){
	    this.getDataById(id);
	    this.display='block';
  	}

  	getDataById(id){
	    this.loaderActive = true;
	    var sendData = new FormData();
	    sendData.append('id',id);
	    this.commonService.getNotificationById(sendData)
	    .subscribe( response => {
	      	this.loaderActive = false;
	      	this.single_notification_data = response;
	      	// this.notification_type = this.single_notification_data.notification_type;
	      	console.log(this.single_notification_data);
	      	if(this.single_notification_data.status)
	      	{
	      		this.notification_title = this.single_notification_data.result.notification_type;
	      		this.notification_msg = this.single_notification_data.result.notification_msg;
	      	}
	      	else
	      	{
	      		this.notification_msg = "Invalid notification id";
	      	}
	    });
  	}

}
