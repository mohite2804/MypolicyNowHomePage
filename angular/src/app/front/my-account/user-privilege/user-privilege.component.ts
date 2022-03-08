import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { TreeviewItem, TreeviewConfig} from 'ngx-treeview';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-user-privilege',
  templateUrl: './user-privilege.component.html',
  styleUrls: ['./user-privilege.component.css']
})
export class UserPrivilegeComponent implements OnInit {


	base_url = environment.baseUrl;

  	loaderActive : boolean =  false;
	loginUserId : any;
	id : any;
	table : any;
	name : any;

  	resultNew : any;
	result_tvs_users : any;
	result_hib_users : any;
	formDetails : any;
	submittedForm : boolean = false;

	result_ic_tree: TreeviewItem[];
	result_product_tree: TreeviewItem[];
  	tab_hide_for_dp : boolean =  false;

	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 400
	});

	formRecodEdit : any;
	selectedProductIds : any
	selectedIcIds : any;


  	constructor(private customvalidationService : CustomvalidationService, private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.id =  this.activatedRoute.snapshot.paramMap.get('id');
		this.table =  this.activatedRoute.snapshot.paramMap.get('table');
   	this.getIndex();

		this.formDetails = this.formBuilder.group({
			id : [this.id,Validators.required],
			table : [this.table,Validators.required],
			selectedProductIds : ["",Validators.required],
			selectedIcIds : ['',Validators.required],
			// tvs_user_id : ['',Validators.required],
			// hib_user_id : ['',Validators.required]
		});
	}



	getIndex(){
		//this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',this.id);
		sendData.append('table',this.table);
		sendData.append('loginUserId',this.loginUserId);

		this.commonService.getDetailsUserPrivilege(sendData)
		.subscribe( response => {
			var output_data: any = response;
			if(output_data.status)
			{
				//this.loaderActive = false;
				this.result_product_tree  =  this.createTreeView(output_data.result.products);
				this.result_ic_tree  =  this.createTreeView(output_data.result.ic_master);
          		this.tab_hide_for_dp = output_data.result.tab_hide_for_dp;

				if(output_data.result.name){
					this.name = output_data.result.name;
				}

				if (output_data.result.partner_privilege) {
					this.setFormDetails(output_data.result.partner_privilege);
				}
			}
			else
			{
				Swal.fire (output_data.message,  "" ,  "error" );
			}
		});
	}

	onSelectedIcIdsChange(value){
		this.formDetails.patchValue({ selectedIcIds : value });
		this.selectedIcIds = value;
	}

	onSelectedProductPolicyPolicySubtypeIdsChange(value){
		this.formDetails.patchValue({ selectedProductIds : value });
		this.selectedProductIds = value;
	}

	setFormDetails(result){
		// this.selectedHibUserId = result.hib_user_id;
		// this.selectedTvsUserId = result.tvs_user_id;
		this.formDetails.patchValue({
			id : this.id,
			table : this.table,
			selectedProductIds : result.selected_product_policytype_policysub_ids,
			selectedIcIds : result.selected_ic_payment_ids,
			// tvs_user_id : result.tvs_user_id,
			// hib_user_id : result.hib_user_id,
		});
	}

	createTreeView(result){
		this.resultNew = [];
		if(result){
			result.forEach(item => {
			 	this.resultNew.push(new TreeviewItem(item))  ;
			});
		}
		console.log(this.resultNew);
		return  this.resultNew;
	}

	submitForm()
	{
		console.log(this.formDetails);
		this.submittedForm = true;
		if(this.formDetails.invalid){
			return;
		}

		//this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',this.id);
		sendData.append('table',this.table);

		sendData.append('selectedIcIds',this.selectedIcIds);
		sendData.append('selectedProductIds',this.selectedProductIds);

		// // sendData.append('tvs_user_id',this.formDetails.value.tvs_user_id);
		// // sendData.append('hib_user_id',this.formDetails.value.hib_user_id);

		console.log(sendData);

		this.commonService.submitPrivileges(sendData)
		.subscribe( response => {
			var output_data: any = response;
			//this.loaderActive = false;
			if(output_data.status){
				Swal.fire(output_data.message, '', "success");
			}else{
				Swal.fire (output_data.message,  "" ,  "error" );
			}
		});
	}


}
