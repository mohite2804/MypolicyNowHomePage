import { Component, OnInit,ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router,ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2'
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-ic-privilege',
  templateUrl: './ic-privilege.component.html',
  styleUrls: ['./ic-privilege.component.css']
})
export class IcPrivilegeComponent implements OnInit {

    ic_id:any;
    dtOptions: DataTables.Settings[] = [];
  	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
  	result : any;
  	loaderActive : boolean = false;
    change_privilege_link : any;
  	constructor(private router : Router,private location:Location, private activatedRoute : ActivatedRoute, private commonService : CommonService,private formBuilder:FormBuilder) { }

  	ngOnInit() {
		this.dtOptions[0] = {
	      pagingType: 'full_numbers',
	      pageLength: 10,
	      processing: true
	    };
		this.ic_id = this.activatedRoute.snapshot.paramMap.get('ic_id');
		this.getIcPermissionData();

	}
	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		  });
	  }
	getIcPermissionData(){
    this.loaderActive = true;
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		console.log(this.ic_id);
		this.commonService.getIcPermissionData(this.ic_id)
		.subscribe(response => {
      this.loaderActive = false;
      this.result = response;
      this.change_privilege_link = this.result.change_privilege_link;
      this.result = this.result.result;
      console.log(this.result);
		});
	}

	changeStatus(ic_privileges_id,status){
		console.log(ic_privileges_id);
		console.log(status);
		const sendData = new FormData();
		sendData.append('ic_privileges_id',ic_privileges_id);
		sendData.append('status',status);
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			if (willDelete.value) {
			this.commonService.chageICPStatus(sendData)
			.subscribe( response => {
				if(status){
					this.runTable();
				  Swal.fire('Status Updated Successfully', '', "success");
			  }else{
				Swal.fire ('Opps! not able to update Statsu',  "" ,  "error" );
			  }
	  
		  });
		  }
		});
	}
	openModel(){
		this.router.navigate([this.change_privilege_link+this.ic_id+'/0']);
	}

	editModel(row){
    console.log(row);
		this.router.navigate([this.change_privilege_link+this.ic_id+'/'+row.product_type_id]);
  }

  backPage(){
    this.router.navigate(["admin/manage-motor/ics"]);

  }


}
