import { Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../front/services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-policy-statement',
  templateUrl: './policy-statement.component.html',
  styleUrls: ['./policy-statement.component.css']
})
export class PolicyStatementComponent implements OnInit {
	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;


	razorpayKey : any =  environment.razorpayKey;
	permissionDeniedMsg = environment.permissionDeniedMsg;


	formRecodEdit : any;
	submitted : boolean = false;
	loaderActive : boolean = false;
	loginUserId: any;
	loginUserType: any;
	adminUserTypeId : any;
	loginicId: any;

	is_account_available : boolean = true;
	razor_customer_id : any;
	wallet_statements : any = [];
	wallet_no_of_records : any;
	add_amount : any;
	validation_for_number_only :any = "^[0-9]*$";

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate;
	toDate: NgbDate | null = null;

	selectedFromDate : any;
	selectedToDate : any;
	atLeastOneRequired : any;
	policyStatementdata : any;

	payment_method : any;
	result_pay_method : any;
	user_type : any;
	result_user_type : any;
  	
  	filterFormQuery : any;
	filter_payment_method : any;
	filter_txt: any;

  	constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
	    //this.loadPaymentScripts();
	    this.toDate = this.calendar.getToday();
	    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
	}

  	ngOnInit(): void {
  		this.loginUserId = sessionStorage.getItem('adminUserId');
  		this.adminUserTypeId = sessionStorage.getItem('adminUserTypeId');
  		this.loginicId = sessionStorage.getItem('icId');
      	this.getPolicyStatement();
    	this.getFilterData();

	    this.formRecodEdit= this.formBuilder.group({
	      filter_txt : ['',[Validators.required]],
	      filter_payment_method : [''],
	      wallet_from : [''],
	      wallet_to : [''],
	    });
  	}

	getPolicyStatement(){
		const that = this;
		this.dtOptions = {
			"pagingType": 'full_numbers',
			"pageLength": 10,
			"serverSide": true,
			"processing": true,
			'ajax' : {
				url : this.base_url+'admin/getPolicyStatement',
				type : 'POST',
				data: {
				"loginUserId": this.loginUserId,
				"adminUserTypeId": this.adminUserTypeId,
				"loginicId":this.loginicId,
				"toDate": this.toDate,
				"fromDate": this.fromDate
				},
				dataType: "json",
			},
			columns: [
			{
			'title' : 'S.No',
			'data' : 'id'
			},
			{
			'title' : 'Policy Number',
			'data' : 'policy_no'
			},
			{
			'title' : 'Proposal Number',
			'data' : 'proposal_no'
			},
            {
              'title' : 'Payment Transaction',
              'data' : 'payment_transaction_no'
            },
            {
              'title' : 'Razorpay Order Id',
              'data' : 'razorpay_order_id'
            },
            {
              'title' : 'Payment Method',
              'data' : 'type'
            },
            {
              'title' : 'Policy Status',
              'data' : 'label'
            },
            {
              'title' : 'Payment Transaction Amount',
              'data' : 'payment_transaction_amount'
            },
            {
              'title' : 'Payment Date',
              'data' : 'payment_transaction_date'
            },
			],
			columnDefs: [
				{ "orderable": false, "targets": [0,3] }
			],
			order: [[ 8, "desc" ]]
		};
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	getFilterData()
	{
		var sendData = new FormData();
		sendData.append('loginUserId',this.loginUserId);
		sendData.append('loginUserType',this.loginUserType);

		this.commonService.getWalletFilterData(sendData)
		.subscribe(response =>{
			this.loaderActive = false;
			var result : any = response;
			this.result_user_type = result.user_type;
			this.result_pay_method = result.payment_method;
		});
	}

	exportAsXLSX(){
		const sendData = new FormData();
		sendData.append('filter_txt',this.formRecodEdit.value.filter_txt);
    	sendData.append('filter_payment_method',this.formRecodEdit.value.filter_payment_method);
    	sendData.append('from_date',JSON.stringify(this.formRecodEdit.value.wallet_from));
    	sendData.append('to_date',JSON.stringify(this.formRecodEdit.value.wallet_to));
		//sendData.append('loginUserId',this.loginUserId);
		this.commonService.getPolicyStatementData(sendData)
		 .subscribe( response => {
		 	this.policyStatementdata = response;
		// 	//console.log(this.modelsdata);
		 	this.excelService.exportAsExcelFile(this.policyStatementdata, 'policyStatementdata');
		});
	}





	submitDateRange(){
		this.dateRangeSelect();
	}

	dateRangeSelect(){
		if(this.formRecodEdit.invalid){
			Swal.fire({position: 'center',icon: 'error',title: 'Please fill all mandatory fields', showConfirmButton: false, timer: 3000 });
			return;
		  }else{
			  /* if(this.formRecodEdit.value.filter_txt=='' && this.formRecodEdit.value.filter_payment_method==''){
				  Swal.fire ("Please Enter Required Field",  "" ,  "error" );
				  // alert("Please fill all mandatory fields");
			  } */
			  if(this.fromDate == null || this.toDate == null){
				  Swal.fire ("Please select valid date range",  "" ,  "error" );
			  }
			  else{
				  var frm_date_to_date :any = [];
				  frm_date_to_date.push({
				  fromDate: JSON.stringify(this.fromDate),
				  toDate: JSON.stringify(this.toDate)
	  
				  });
				  frm_date_to_date = JSON.stringify(frm_date_to_date);
	  
				  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				  dtInstance.columns(0).search(frm_date_to_date).draw();
				  });
			  }
		  }

	}

	getFilterpaymentMethodResult(event)
	{
		var selected_value : any = event.target.value;
		this.filter_payment_method = selected_value = selected_value.trim();
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns(1).search(selected_value).draw();
		});
	}

	getFilterTextResult(event)
	{
		var selected_value : any = event.target.value;
		this.filter_txt = selected_value = selected_value.trim();
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns(2).search(selected_value).draw();
		});
	}

}	
