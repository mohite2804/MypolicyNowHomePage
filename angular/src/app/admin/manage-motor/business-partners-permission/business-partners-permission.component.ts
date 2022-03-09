import { Component, OnInit,ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router,ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-business-partners-permission',
  templateUrl: './business-partners-permission.component.html',
  styleUrls: ['./business-partners-permission.component.scss']
})
export class BusinessPartnersPermissionComponent implements OnInit {

    businessPartnerId:any;
    dtOptions: DataTables.Settings[] = [];
  	@ViewChild(DataTableDirective) dtElement: DataTableDirective;	
  	result : any;
  	loaderActive : boolean = false;
  	
	constructor(private router : Router,private location:Location, private activatedRoute : ActivatedRoute, private commonService : CommonService,private formBuilder:FormBuilder) { }

	ngOnInit() {
		this.dtOptions[0] = {
	      pagingType: 'full_numbers',
	      pageLength: 10,
	      processing: true
	    };
		this.businessPartnerId = this.activatedRoute.snapshot.paramMap.get('id');
		this.getBusinessPartnerPermissionData();
		
	}

	getBusinessPartnerPermissionData(){
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		console.log(this.businessPartnerId);
		this.commonService.getBusinessPartnerPermissionData(this.businessPartnerId)
		.subscribe(response => {
			this.result = response;
			this.result = this.result.result;
			console.log(this.result);
		});
	}

	openModel(){
		this.router.navigate(['admin/manage-common//business-partners/permission/change/'+this.businessPartnerId+'/0']);
	}

	editModel(row){
		console.log(row);
		this.router.navigate(['admin/manage-common//business-partners/permission/change/'+this.businessPartnerId+'/'+row.product_type_id]);
	}



}
