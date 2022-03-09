
import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
//import { MotorService } from '../../services/motor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cancelled-policies-payment',
  templateUrl: './cancelled-policies-payment.component.html',
  styleUrls: ['./cancelled-policies-payment.component.scss']
})
export class CancelledPoliciesPaymentComponent implements OnInit {

	selectedValue = 0;
	div_show_cancellation_new : boolean = true;
    div_show_cancellation_status : boolean = false;
	base_url : any = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	@ViewChild('closebutton') closebutton;
	loaderActive : boolean =  false;
	dtRendered = true;
	formChangeStatus :any;
	result : any;
	loginUserId : any;
	policyStatusId : any;
	success_message : any;
	error_message : any;
	displayCancellationStatus : any = 'none';
	submittedChangeStatus :any;
	statusval : any = 1;
	statusData : any;
	selectedStatusId : any;
	payee_bank_name : any;
	payee_name : any;
	payee_account_no : any;
	payee_ifsc_code : any;
	validation_for_number :any = "^[0-9]+$";
  loginicId : any;
  adminUserRoleId : any;

  	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,private elementRef: ElementRef, public cdr: ChangeDetectorRef) {
      this.loginUserId = sessionStorage.getItem('adminUserId');
      this.loginicId = sessionStorage.getItem('icId');
      this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');

    }

    ngOnInit(): void {
    	this.policyStatusId = "0";

   		this.getIndex();
   		this.getCancellationStatusData();
   		this.validateChangeStatus();
	}

	validateChangeStatus(){
		this.formChangeStatus = this.formBuilder.group({
		      status_id : ['',[Validators.required]],
		      transaction_no : ['',[Validators.required,Validators.pattern(this.validation_for_number)]],
		      cancellation_id : ['',[Validators.required]],
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
	            url : this.base_url+'admin/getApprovedCancelledPolicies',
	            type : 'POST',
	            data: {
			        "loginUserId": this.loginUserId,
			        "statusId": this.policyStatusId,
              "ic_id": this.loginicId
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
	            	'title' : 'Cancellation No',
	            	'data' : 'cancellation_no'
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
					'title' : 'Payment Type',
					'data' : 'payment_type'
				},
				{
					'title' : 'User Comment',
					'data' : 'user_comment'
				},
				{
					'title' : 'Admin Comment',
					'data' : 'admin_comment'
				},
				{
					'title' : 'Reason Of Cancellation',
					'data' : 'cancellation_reason'
				},

				{
					'title' : 'Action',
					'data' : 'action_btn'
				}





	      	],
			  "columnDefs": [ {
				"targets": 8,
				"orderable": false
				},
				// {
				//   "targets": 1,
				//   "orderable": false
				//   }
				]
    	};
  	}

  	ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        // if (event.target.hasAttribute("view-quote-id")) {
        //     this.viewQuote(event.target.getAttribute("view-quote-id"));
        // }
        if (event.target.hasAttribute("view-cancellation-id")) {
        	// alert(event.target.getAttribute("view-cancellation-id"))
          // sessionStorage.setItem('unique_ref_no', event.target.getAttribute("view-forword-id"));
          this.formChangeStatus.patchValue({
            cancellation_id : event.target.getAttribute("view-cancellation-id")
          });

          // this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        if (event.target.hasAttribute("view-bank-name")) {
        	this.payee_bank_name = event.target.getAttribute("view-bank-name");
        	this.payee_name = event.target.getAttribute("view-Payee-name");
        	this.payee_account_no = event.target.getAttribute("view-account-no");
        	this.payee_ifsc_code = event.target.getAttribute("view-ifsc-code");
          // this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        }
        if (event.target.hasAttribute("view-active-id")) {
          // this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          // this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
    });
  }
	setStatusId(statusid){
		sessionStorage.setItem('status_id',statusid);
	}
	downloadPolicy(url){
		window.open(url, '_blank');
	}

	downloadProposal(url){
		window.open(url, '_blank');
	}

	downloadExcel(){
		this.loaderActive = true;
		var sendData = new FormData();
	    sendData.append('loginUserId',this.loginUserId);
		sendData.append('policyStatusId',this.policyStatusId);
		/*this.motorService.downloadExcelForSoldPolicies(sendData)
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

	getCancellationStatusData(){
      this.commonService.getCancellationStatusData()
        .subscribe( response => {
        	var result : any = response;
        	if(result.status){
          this.statusData = result.result;
		      }else{

      			}
          // this.bankData = this.bankData;
          //this.setFormData(this.state_data);
          console.log(this.statusData);
        });

    }
    submitFormChangeStatus(){
    	this.submittedChangeStatus = true;
          if(this.formChangeStatus.invalid){
            return;
          }
    	this.loaderActive = true;
		var sendData = new FormData();
	    sendData.append('status_id',this.formChangeStatus.value.status_id);
	    sendData.append('transaction_no',this.formChangeStatus.value.transaction_no);
		sendData.append('cancellation_id',this.formChangeStatus.value.cancellation_id);
		this.commonService.formCancellationPaymentStatusUpdate(sendData)
		.subscribe(response => {
			var result : any = response;
			this.loaderActive = false;
			if(result.status){
				// Swal.fire(result.message,  "" ,  "success" );
				Swal.fire(result.message,  "" ,  "success" ).then((result) => { location.reload();});
			}else{
				Swal.fire(result.message,  "" ,  "error" );
			}

		});
    }


	downloadReport(download_url){
		window.open(download_url, '_blank  ');
	}

	showHideNewCancellation(){
      this.div_show_cancellation_new = false;
    this.div_show_cancellation_status = true;
  }
  showHideStatusCancellation(statusid){

    this.div_show_cancellation_new = true;
    this.div_show_cancellation_status = false;
    this.statusval = statusid;
    const that = this;
      // make sure your template notices it
    this.cdr.detectChanges();
    // initialize them again
    this.dtRendered = true
    this.cdr.detectChanges();

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //this.dtOptions.destroy();
        //dtInstance.ajax.data.status = this.statusval;

        //dtInstance.ajax.url(this.base_url+'get_endorsementByStatus/'+this.statusval).load();

       // dtInstance.search( this.statusval ).draw();
       dtInstance.columns(0).search(this.statusval).draw();
       // dtInstance.column(11).search(this.statusval, true, false).draw();

        //this.dtOptions.reload();
        //dtInstance.draw();
        //this.dtTrigger.next();
      });

  }

  policyCancellation(policy_no){
    sessionStorage.setItem('policy_no', policy_no);
    this.router.navigateByUrl('/my-account/policycancellation');
    //[routerLink]="['/my-account/nil-endorsement']"
  }

  openChangeStatusModal(){
    this.displayCancellationStatus = 'block';
  }

  closeChangeStatus(){
    this.closebutton.nativeElement.click();
    this.displayCancellationStatus='none';
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  resetformChangeStatus(){
    this.submittedChangeStatus = false;
    this.formChangeStatus.patchValue({
      cancellation_reason_id : ''
    });

  }

  onChange(event) {

  //   this.selectedStatusId = event;
  // 	alert(this.selectedStatusId);
  //   this.formChangeStatus.get('status_id').valueChanges
  //   .subscribe(selectedStatusId => {
  //       if (this.selectedStatusId == '2') {
  //           this.formChangeStatus.get('payment_to').reset();
  //           this.formChangeStatus.get('payment_to').disable();
  //           this.formChangeStatus.get('refund_amount').reset();
  //           this.formChangeStatus.get('refund_amount').disable();
  //       }
  //       else {
  //           this.formChangeStatus.get('payment_to').enable();
  //           this.formChangeStatus.get('refund_amount').enable();
  //       }
  //   });


  }
  onChangePaymentTo(event) {
  	// alert(event);

    // this.selectedType = event.target.value;
  }


  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      this.closeChangeStatus();
    }, 2000);

  }

}
