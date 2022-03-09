import { AfterViewInit, Component, OnInit, Renderer2  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../services/common.service';
//import { MotorService } from '../../services/motor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-pending-cancel-policies',
  templateUrl: './pending-cancel-policies.component.html',
  styleUrls: ['./pending-cancel-policies.component.css']
})
export class PendingCancelPoliciesComponent implements OnInit {

	base_url : any = environment.baseUrl;
 	dtOptions: DataTables.Settings = {};	
	loaderActive : boolean =  false;
	result : any;
	loginUserId : any;
	policyStatusId : any;
  	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

    ngOnInit(): void {
    	this.policyStatusId = "cp";
    	this.loginUserId = sessionStorage.getItem('adminUserId');
   		this.getIndex();   		
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
	            url : this.base_url+'motor/getCancelPolicyWithLoginAndStatus',
	            type : 'POST',
	            data: {
			        "loginUserId": this.loginUserId,
			        "policyStatusId": this.policyStatusId
			    },
	            dataType: "json",
	        },	
	      	columns: [	  
		      	
		      	{   
	            	'title' : 'Policy Number',
	            	'data' : 'policy_no' 
	          	},
	          	{   
	            	'title' : 'Product Type',
	            	'data' : 'product_type'  
	          	},
	          	{  
	            	'title' : 'Engine Number',
	            	'data' : 'engine_no'	            
	          	},
	          	// {  
	           //  	'title' : 'Chassis Number',
	           //  	'data' : 'chassis_no'	            
	          	// },	          
		        {  
		        	'title' : 'Vehicle Reg. Number',
		            'data' : 'vehicle_reg_no'		            
		        },
				{  
					'title' : 'Insurer Name',
					'data' : 'policy_holder_name'
				},
				{  
					'title' : 'User comment',
					'data' : 'user_comment'
				},
				{  
					'title' : 'Action',
					'data' : 'action_btn'
				}

		          

	      	],
			  "columnDefs": [ {
				"targets": 6,
				"orderable": false
				},
				// {
				//   "targets": 1,
				//   "orderable": false
				//   } 
				]
    	};
  	}
	
	/*ngAfterViewInit(): void {
	  	this.renderer.listenGlobal('document', 'click', (event) => {
	    		if (event.target.hasAttribute("view-download-policy-id")) {
	    			this.downloadPolicy(event.target.getAttribute("view-download-policy-id"));
	    		}
	    		if (event.target.hasAttribute("view-proposal-policy-id")) {
	    			this.downloadProposal(event.target.getAttribute("view-proposal-policy-id"));
	    		}
	    		if (event.target.hasAttribute("view-detail-proposal-id")) {
	    			this.viewRecord(event.target.getAttribute("view-record-id"),event.target.getAttribute("view-detail-proposal-id"),event.target.getAttribute("view-user-transaction-type-id"));
	    		}
	    		// 
	  	});	  	
	}*/

	downloadPolicy(url){
		window.open(url, '_blank');		
	}
	
	downloadProposal(url){
		window.open(url, '_blank');		
	}


	viewRecord(policy_id,proposal_id,user_transaction_type_id){
		console.log('/admin/policy-details-cancel/'+policy_id+'/'+proposal_id+'/'+user_transaction_type_id );
		this.router.navigate(['/admin/policy-details-cancel/'+policy_id+'/'+proposal_id+'/'+user_transaction_type_id]);
		
	}

	downloadExcel(){
		this.loaderActive = true;
		var sendData = new FormData();	
	    sendData.append('loginUserId',this.loginUserId);
		sendData.append('policyStatusId',this.policyStatusId);
		/*this.motorService.downloadExcelForRejectedSoldPolicies(sendData)
		.subscribe(response => {
			var result : any = response;
			this.loaderActive = false;
			if(result.status){
				var download_url : any = result.download_url;
				this.downloadReport(download_url);
				Swal.fire(result.message,  "" ,  "success" );
			}else{
				Swal.fire(result.message,  "" ,  "error" );
			}
			
		});	*/	

	}

	downloadReport(download_url){	
		window.open(download_url, '_blank  ');					
	}

}
