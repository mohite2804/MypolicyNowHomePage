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
  templateUrl: './endorse-process.component.html',
  styleUrls: ['./endorse-process.component.css']
})
export class EndorseProcessComponent implements OnInit {

  base_url : any = environment.baseUrl;

 	dtOptions: DataTables.Settings = {};
	loaderActive : boolean =  false;

	//name
	formeditActionName: FormGroup;
	submitFormActionStatus: boolean = false;

	result : any;
	policy_data : any;
	endorsement_data : any;
	loginUserId : any;
	policyStatusId : any;
	endorsement_id : any;
	ed_status: any;
	endorsement_status_id : any;
	write_permission : any;

    salutation :any;
    agreement_types :any;
    rto :any;
    vehicle_color :any;
    bank_master :any;
    relations :any;

    endorsement_type:any;
    endorsement_item:any;
    endorsee_value:any;
    endorsed_value:any;
	
	breain_data:any;
	breaking_case_id :any;
	proposal_id :any;
	proposal_no:any;
				
    public_path ; any;
    inspection_link: boolean = false;

    is_rto_charges_show : boolean = false;
    is_refund : boolean = false;

    resultBreakinTransactionHistory :any;
    inspection_link_url:any;
    proposal_ids :any;
    proposal_nos :any;

    validation_for_endorse_charges :any =  "^[0-9]$";

  	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

    ngOnInit(): void {

    	  this.formeditActionName = this.formBuilder.group({
    	    ed_id : [''],
	        ed_status : [''],
	        ed_status_comment : [''],
	        rto_endorsement_charge : ['']
	      });
	      

	      this.endorsement_id  = sessionStorage.getItem('endorsement_id');
	      this.ed_status  = sessionStorage.getItem('ed_status');
		  this.loginUserId = sessionStorage.getItem('adminUserId');
	      //this.endorsement_id  = '25';

	      let uploadData = new FormData();
	      uploadData.append('endorsement_id',this.endorsement_id);
	      uploadData.append('ed_status',this.ed_status);
	      uploadData.append('loginUserId',this.loginUserId);

	      console.log('submitFormQuoteDetails........');
	      //console.log(uploadData);
          this.loaderActive = true;
	      this.commonService.submitEndorsmentFilterDetails(uploadData)
	      .subscribe(response => {
            var outputResult : any = response;
            this.loaderActive = false;
	          if(outputResult.status){
	            this.result = outputResult.policy_data;
				
	            this.endorsement_data = outputResult.endorsement_data;
	            this.salutation = outputResult.salutation;
	            this.agreement_types = outputResult.agreement_types;
	            this.rto = outputResult.rto;
	            this.vehicle_color = outputResult.vehicle_color;
	            this.bank_master = outputResult.bank_master;
	            this.relations = outputResult.relations;
	            this.endorsement_type = outputResult.endorsement_type;
	            this.endorsement_item = outputResult.endorsement_item;
	            this.endorsee_value = outputResult.endorsee_value;
	            this.endorsed_value = outputResult.endorsed_value;
	            this.public_path = outputResult.public_path;
	            this.endorsement_status_id = outputResult.endorsement_status_id;
	            this.write_permission = outputResult.write_permission;

	            if(this.endorsee_value.isRefund=='1' || this.endorsee_value.isRefund==1){
	            	this.is_refund = true;
	            }
				this.breain_data=outputResult.breakin_param;
				
				this.breaking_case_id = this.breain_data.breaking_case_id;
				this.proposal_id = this.breain_data.proposal_id;
				this.proposal_no = this.breain_data.proposal_no;
				this.proposal_ids = outputResult.policy_data.proposal_id;
				this.proposal_nos = outputResult.policy_data.proposal_no;
				console.log("111111");
				console.log(this.proposal_ids);
				console.log("111111");
				 this.getIndex();
				//console.log(this.result);
	          }
	      });


	       this.validationFormNameDetails();
	      
	}

	validationFormNameDetails(){
		this.formeditActionName = this.formBuilder.group({
			ed_id : [''],
			ed_status : ['',Validators.required],
	        ed_status_comment : ['',Validators.required],
	        rto_endorsement_charge : ['']
		});
	}

	checkEndorsementCharges(event){
		if(event.target.value != ""){
			var status_value = event.target.value;
			if(status_value=='4' && (this.endorsement_type=='Non Nil' && this.endorsement_item=='rto')){

				this.is_rto_charges_show = true;

				this.formeditActionName.get("rto_endorsement_charge").setValidators([Validators.required]);
            	this.formeditActionName.get("rto_endorsement_charge").updateValueAndValidity();
			}
			else{
				this.is_rto_charges_show = false;
				
				this.formeditActionName.get("rto_endorsement_charge").setValidators([]);
            	this.formeditActionName.get("rto_endorsement_charge").updateValueAndValidity();

            	this.formeditActionName.patchValue({
      				rto_endorsement_charge : 0
      			});
			}
		}
	}


	getIndex(){
    let uploadData = new FormData();
    uploadData.append('proposal_no',this.proposal_nos);
    uploadData.append('proposal_id',this.proposal_ids);
    uploadData.append('breaking_case_id',this.breaking_case_id);
    uploadData.append('loginUserId',this.loginUserId);
  //  uploadData.append('ic_id',this.loginicId);
  console.log("////////////////");
console.log(this.proposal_ids);
  console.log("////////////////");

    this.loaderActive = true;

    this.commonService.getAdminBreakinInspectionDetails(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;

        if(outputResult.status){
          /*this.resultProposalDetails = outputResult.proposal_detail;
          this.public_path = outputResult.public_path;
          this.resultBreakinDetails = outputResult.breakin_details;*/
          this.resultBreakinTransactionHistory = outputResult.resultBreakinTransactionHistory;
          this.inspection_link_url = outputResult.inspection_link_url;
          console.log(this.inspection_link_url);
        }
        else{
          Swal.fire(outputResult.message,  "" ,  "error" );
        }

    });
  }


  generateLink(){
    this.inspection_link=true;
  }
  closeGenerateLink(){
    this.inspection_link=false;
  }

	submitFormActionName(){
	    this.submitFormActionStatus = true;
	    if(this.formeditActionName.invalid){
	      return;
	    }
	    this.loaderActive = true;

	    let uploadData = new FormData();
	    uploadData.append('id',this.endorsement_id);


	    uploadData.append('ed_status',this.formeditActionName.value.ed_status);
	    uploadData.append('ed_status_comment',this.formeditActionName.value.ed_status_comment);
	    uploadData.append('endorsement_charges',this.formeditActionName.value.rto_endorsement_charge);

	    uploadData.append('loginUserId',sessionStorage.getItem("adminUserId"));

	    console.log('submitFormNameDetails........');
	    console.log(uploadData);

	    this.commonService.submitFormEditStatus(uploadData)
		    .subscribe(response => {
		    	this.loaderActive = false;
		        var outputResult : any = response;
		        if(outputResult.status){

		          Swal.fire({
		            title: '',
		            html: 'Endorsement Status Successfuly Submitted',
		            timer: 2000
		          }).then((result) => {
		             this.router.navigateByUrl('/admin/manage-motor/endorsement');
		          })
		        }
		    });
	}
  GetInspectionReport(){
    sessionStorage.setItem('breakin_proposal_no', this.proposal_no);
	sessionStorage.setItem('breakin_proposal_id', this.proposal_id);
	sessionStorage.setItem('breaking_case_id', this.breaking_case_id);
    window.location.href='admin/manage-motor/break-in-report';
  }
 DownloadImages(){
    this.loginUserId = sessionStorage.getItem('adminUserId');
    window.open(this.base_url+'admin/download-inspection-image/'+this.proposal_id+'/'+this.breaking_case_id, '_blank  ');
  } 


}
