// import { Component, OnInit } from '@angular/core';
import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-pay-in-slip',
	templateUrl: './pay-in-slip.component.html',
	styleUrls: ['./pay-in-slip.component.css']
})
export class PayInSlipComponent implements OnInit {
	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;

	@ViewChild('closebutton') closebutton;

	unique_ref_no : any;
	policy_no : any;
	div_show_for_authenticate : boolean = false;
	isAuthenticate  : boolean = true;

	is_from_Policy_page :  boolean = true;
	loaderActive: boolean = false;
	displayForwardPolicy : any = 'none';
	formForwardPolicy : any;
	submittedForwardPolicy :  boolean = false;
	result_Policy_details : any;
	result_payment_types : any;
	success_message: any;
	error_message: any;


	loginUserId  : any;
	loginUserType  : any;
	token  : any;
	result : any;

	// constructor() { }
	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		console.log('PAY IN SLIP Testing');
		this.loginUserId = sessionStorage.getItem('user_id');
		this.loginUserType = sessionStorage.getItem('user_type_id');
		this.token = sessionStorage.getItem("user_token");
		this.validateUserLoginStatus(this.loginUserId,this.token);
		this.getIndex();
	}

	validateUserLoginStatus(loginUserId,token){
		this.loaderActive = true;
		let uploadData = new FormData();  

		uploadData.append('loginUserId',this.loginUserId);
		uploadData.append('token',token);

		this.commonService.validateUserLoginStatus(uploadData)
		.subscribe(response => {
			this.result = response;
			this.loaderActive = false;
			if(this.result.status){
				//valid status i.e. not login from another location
			}else{
				Swal.fire({
					title: 'error',
					html: 'It seems that you have login from another location. You are logged out from this session?',
					timer: 3500
				}).then((result) => {
					this.router.navigate(['/logout']);
				});
			}     
		});
	}

	getIndex(){
		console.log('test payin slip index..............');
		const that = this;
		this.dtOptions = {
			"pagingType": 'full_numbers',
			"pageLength": 10,
			"serverSide": true,
			"processing": true,
			'ajax' : {
				url : this.base_url+'get_policies_without_payin_slip',
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
				'title' : 'Policy No.',
				'data' : 'policy_no'
			},
			{
				'title' : 'Product Type',
				'data' : 'product_type'
			},
			{
				'title' : 'Amount',
				'data' : 'amount'
			},
			{
				'title' : 'Ins.Co.',
				'data' : 'ins_comp'
			},
			{
				'title' : 'Created Date',
				'data' : 'policy_created_at'
			},
			{
				'title' : 'Action',
				'data' : 'action_btn'
			}


			],
			columnDefs: [
			{ "orderable": false, "targets": 6 }
			],
			order: [[ 5, "desc" ]]
		};
	}

	ngAfterViewInit(): void {
	    this.renderer.listen('document', 'click', (event) => {
	        // alert(event.target.checked);
	        if (event.target.hasAttribute("view-policy-no")) 
	        {
	          this.checkPolicy(event.target.getAttribute("view-policy-no"));
	        }
	    });
  	}

  	checkPolicy(policy_id)
    {
    	// alert(policy_id);
    	console.log(policy_id);

    }

}
