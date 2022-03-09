import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef,OnDestroy,AfterViewInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from  '@angular/router';
import { CustomvalidationService } from '../../services/customvalidation.service';

import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  	selector: 'app-break-in-case',
  	templateUrl: './break-in-case.component.html',
  	styleUrls: ['./break-in-case.component.css']
})
export class BreakInCaseComponent implements OnInit {

	base_url = environment.baseUrl;
	//mainJsPath = environment.mainJsPath;
	dtOptions: DataTables.Settings = {};
	//dtTrigger: Subject = new Subject();
	dtTrigger: Subject<any> = new Subject<any>();
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	@ViewChild('closebutton') closebutton;

  	loaderActive : boolean = false;
  	dtRendered = true;

  	statusval : any ;

  	result : any;
  	loginUserId : any;
  	loginUserType  : any;
  	token  : any;
  	razor_customer_id : any;

  	////search options
	submitted_filter : any = false;
	formRecodEdit : any;
	isAtLeastOne : boolean = false;
	atLeastOneRequired : any;

	date_picker_policy_from: NgbDateStruct;
	date_picker_policy_to: NgbDateStruct;
	minDatePolicyFrom : any;
	maxDatePolicyTo : any;
	maxDate : any;
	minDate : any;
	icList : any;
	productList : any;
	cancellationTypeList : any;
	selectedInsurance_name : any;
	selectedProduct_name : any;
	selectedCancellation_type : any;
	proposalData : any;

	search_insurance_name : any;

	policy_from : any;
	policy_to : any;
	insurance_name : any;
	product_name : any;
	cancellation_type : any;
  loginicId : any;
  adminUserRoleId : any;
  	constructor(private customvalidationService: CustomvalidationService, private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
		this.statusval = 3;
		this.loginUserId = sessionStorage.getItem('adminUserId');

    this.loginicId = sessionStorage.getItem('icId');
    this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');

	  }

  	ngOnInit(): void {


		this.formRecodEdit = this.formBuilder.group({
			policy_from : [''],
			policy_to : [''],
			insurance_name : [''],
			product_name : [''],
			cancellation_type : [''],
			submit_btn : ['']
		});

		const current = new Date();

		this.maxDate = this.maxDatePolicyTo = {
			year: current.getFullYear(),
			month: current.getMonth() + 1,
			day: current.getDate()
		};
		this.minDate = this.minDatePolicyFrom =  {
			year: current.getFullYear() - 2,
			month: current.getMonth() + 1,
			day: current.getDate()
		};

		this.getIcList();
    	this.getProductList();
		this.getIndex();
  	}

  	ngAfterViewInit(): void {
		this.renderer.listen('document', 'click', (event) => {
			if (event.target.hasAttribute("view-breakin-proposal-no")) {
	          	this.viewBreakinProposalData(event.target.getAttribute("view-breakin-proposal-no"),event.target.getAttribute("view-breakin-proposal-id"),event.target.getAttribute("view-breakin-case-id"));
	        }
		});
  	}



	changeSelectBox(form_control_name,selected_value){
		console.log("selected Value "+selected_value);
		if(selected_value){
			switch (form_control_name) {

				case 'insurance_name':
					this.formRecodEdit.patchValue({insurance_name : selected_value });
					break;

				case 'product_name':
					this.formRecodEdit.patchValue({product_name : selected_value });
					break;
			}
		}
	}

	clearValue(form_control_name,selected_value){
		switch (form_control_name) {

			case 'insurance_name':
				this.formRecodEdit.patchValue({insurance_name : '' });
				this.selectedInsurance_name = "";
				break;

			case 'product_name':
				this.formRecodEdit.patchValue({product_name : '' });
				this.selectedProduct_name = "";
				break;
		}
	}

	getIcList(){
		this.commonService.getIcData()
		.subscribe( response => {
			this.icList = response;
			this.icList = this.icList.result;
			//this.setFormData(this.state_data);
			// console.log(this.icList);
		});
	}

	getProductList(){
		this.commonService.getProductData()
		.subscribe( response => {
			this.productList = response;
			this.productList = this.productList.result;
			//this.setFormData(this.state_data);
			// console.log(this.icList);
		});
	}

	getIndex(){
		this.dtOptions = {
			"pagingType": 'full_numbers',
			"pageLength": 10,
			"serverSide": true,
			"processing": true,
			'ajax' : {
				url : this.base_url+'admin/get_admin_dashboard_break_in',
				type : 'POST',
				data: {
					"loginUserId": this.loginUserId,
					"loginUserType": this.loginUserType,
					"status": this.statusval,
          "ic_id": this.loginicId
				},
				dataType: "json",
			},
			columns: [
				{
	              	'title' : 'Sr.No',
	              	'data' : 'id'
	            },
	            {
	              	'title' : 'Proposal No.',
	              	'data' : 'proposal_no'
	            },

	            {
	              	'title' : 'Breakin Case Id',
	              	'data' : 'breaking_case_id'
	            },
	            {
	              	'title' : 'Ins. Company',
	              	'data' : 'ins_comp'
	            },
	            {
	              	'title' : 'Product Type',
	              	'data' : 'product_type'
	            },

	            {
	              	'title' : 'Reg. No.',
	              	'data' : 'reg_no'
	            },

	            {
	              	'title' : 'Engine No.',
	              	'data' : 'engine_number'
	            },

	            {
	              	'title' : 'Chasis No.',
	              	'data' : 'chasis_number'
	            },
	            {
	              	'title' : 'Last Updated Date Time',
	              	'data' : 'last_updated_dtime'
	            },
	            {
	              	'title' : 'Date',
	              	'data' : 'breakin_date'
	            },

	            {
	              	'title' : 'Action',
	              	'data' : 'action_btn'
	            }
			],
			columnDefs: [
				{ "orderable": false, "targets": 8 },
				{ "orderable": false, "targets": 10 },
				{ "orderable": false, "targets": 0 }
			],
			order: [[ 9, "desc" ]]

		};
	}

	showHideStatusBreakin(statusid){
		this.statusval = statusid;
	    console.log("status :- "+this.statusval);

	    this.loaderActive = true;

	    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	      	dtInstance.columns(0).search(this.statusval).draw();
	    });

	    this.loaderActive = false;
	}

	ngOnDestroy(): void {
    	// Do not forget to unsubscribe the event
    	this.dtTrigger.unsubscribe();
  	}

	//////view breakin data
	viewBreakinProposalData(proposal_no,proposal_id,breaking_case_id){
		if(proposal_no != '' && proposal_id != '' ){
			sessionStorage.setItem('breakin_proposal_no', proposal_no);
      		sessionStorage.setItem('breakin_proposal_id', proposal_id);
      		sessionStorage.setItem('breaking_case_id', breaking_case_id);
      		window.location.href='admin/manage-motor/break-in-inspection';
		}
		else{
			Swal.fire("Something went wrong. Please try again",  "" ,  "error" );
		}
	}



	submitFormFilter(){

		if(this.formRecodEdit.value.policy_from!='' && this.formRecodEdit.value.policy_from!=null && this.formRecodEdit.value.policy_from!=undefined){
			this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
		}
		else{
			this.policy_from = "";
		}

		if(this.formRecodEdit.value.policy_to!='' && this.formRecodEdit.value.policy_to!=null && this.formRecodEdit.value.policy_to!=undefined){
			this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
		}
		else{
			this.policy_to = "";
		}

		this.insurance_name = this.formRecodEdit.value.insurance_name;
		this.product_name = this.formRecodEdit.value.product_name;

		if( (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined) ) {
		this.loaderActive = true;

		// this.dtRendered = true
		// this.cdr.detectChanges();
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns(2).search(this.policy_from);
			dtInstance.columns(3).search(this.policy_to);
			dtInstance.columns(4).search(this.insurance_name);
			dtInstance.columns(5).search(this.product_name);
			dtInstance.draw();
		});

		this.loaderActive = false;

		} else {

		Swal.fire("At least one field is required ", '', "error");
		return;
		}

	}

	exportDataForm(){

		if(this.formRecodEdit.value.policy_from!='' && this.formRecodEdit.value.policy_from!=null && this.formRecodEdit.value.policy_from!=undefined){
			this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
		}
		else{
			this.policy_from = "";
		}

		if(this.formRecodEdit.value.policy_to!='' && this.formRecodEdit.value.policy_to!=null && this.formRecodEdit.value.policy_to!=undefined){
			this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
		}
		else{
			this.policy_to = "";
		}

		this.insurance_name = this.formRecodEdit.value.insurance_name;
		this.product_name = this.formRecodEdit.value.product_name;

		this.loaderActive = true;
		const sendData = new FormData();

		sendData.append('loginUserId',this.loginUserId);
		sendData.append('loginUserType',this.loginUserType);
		sendData.append('policy_from',this.policy_from);
		sendData.append('policy_to',this.policy_to);
		sendData.append('insurance_name',this.insurance_name);
		sendData.append('product_name',this.product_name);
		sendData.append('statusval',this.statusval);

		this.commonService.exportBreakinProposalData(sendData)
		.subscribe(response =>{
			this.loaderActive = false;
			this.proposalData = response;
			this.excelService.exportAsExcelFile(this.proposalData, 'BreakinProposalData');

		});
	}

	resetFilterForm(){
		this.loaderActive = true;

		this.formRecodEdit.patchValue({
			policy_from : '',
			policy_to : '',
			insurance_name : '',
			product_name : '',
		});

		this.selectedInsurance_name = "";
		this.selectedProduct_name = "";

		this.cdr.detectChanges();
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns(2).search('');
			dtInstance.columns(3).search('');
			dtInstance.columns(4).search('');
			dtInstance.columns(5).search('');
			dtInstance.draw();
		});

		this.loaderActive = false;
	}
}
