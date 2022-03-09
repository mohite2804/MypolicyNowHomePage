import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

    base_url = environment.baseUrl;
  	dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  	isEdit : boolean = true;
  	result : any ;
  	editResult : any ;
  	display : any = 'none';
  	formRecodEdit : any;
  	successMsg : any ;
  	errorMsg : any ;
  	submitted : any = false;
  	popupTitle : any ;
  	resultRecord : any;
  	parent_menu : any;
	parenManu:any;
  	loaderActive : boolean = false;
    loginUserId : any;
	menu_name:any;
  access_permission: any;
  	constructor(private commonService : CommonService,public router: Router,private formBuilder: FormBuilder,private renderer: Renderer2,) { }

  	rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }

  	ngOnInit() {

      this.loginUserId = sessionStorage.getItem("adminUserId");
      this.access_permission = sessionStorage.getItem("access_permission");
		  this.getIndex();
		  this.getParentMenu();
	    this.formRecodEdit = this.formBuilder.group({
	        id : [''],
	    	  menu_name : ['',Validators.required],
      		menu_code : ['',Validators.required],
      		menu_url : ['',Validators.required],
      		parent_menu : ['', Validators.required],
      		order : ['', Validators.required],
      		status : ['',Validators.required]

	    });
  }


    getIndex(){
    	//this.loaderActive = true;
      const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getmenulist',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,

          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Menu',
              'data' : 'menu'
            },
            {
              'title' : 'Menu Url',
              'data' : 'menu_url'
            },

            {
              'title' : 'Status',
              'data' : 'status'
            },

            {
              'title' : 'Created',
              'data' : 'created_at'
            },

            {
              'title' : 'Updated',
              'data' : 'updated_at'
            },

            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

		  ],
		  'columnDefs': [ {
			'targets': [0,6], /* column index */
			'orderable': false, /* true or false */
		 }],
		 "order": [[5, "desc" ]]
      };

      /*this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getmenulist',
              type : 'POST',
              data: {
              "loginUserId": 1,

          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'ID',
              'data' : 'id'
            },
            {
              'title' : 'Menu',
              'data' : 'menu'
            },
            {
              'title' : 'Menu Code',
              'data' : 'menu_code'
            },

            {
              'title' : 'Menu Url',
              'data' : 'menu_url'
            },

            {
              'title' : 'Status',
              'data' : 'status'
            },

            {
              'title' : 'Created',
              'data' : 'created_at'
            },

            {
              'title' : 'Updated',
              'data' : 'updated_at'
            },

            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ]
      };	*/

	  	// this.commonService.getmenus()
	  	// .subscribe(response => {
	  	// 	this.result = response;
	  	// 	this.parent_menu = this.result.parent_menu;
	   //    	this.result = this.result.result;
    //       	this.loaderActive = false;
    //       	this.dtTrigger.next();
	   //    	//this.rerender();
	  	// 	console.log(this.result);
	  	// });
	}


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        // if (event.target.hasAttribute("view-record-id")) {
        //   this.viewRecord(event.target.getAttribute("view-record-id"));
        // }
        if (event.target.hasAttribute("view-edit-id")) {
          this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        // if (event.target.hasAttribute("view-delete-id")) {
        //   this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        // }
        if (event.target.hasAttribute("view-active-id")) {
          this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
    });
  }



	openModel(){
		this.resetForm();
		this.popupTitle = "Add New Menu";
		this.display='block';
		console.log('submitForm');
	}

	editModel(row){
		this.isEdit = true;
		this.popupTitle = "Update Menu";
		this.display='block';
		console.log(this.isEdit);
		console.log('submitForm');
		this.editRecord(row.admin_menu_id);
	}

	showModel(row){
		this.isEdit = false;
		this.popupTitle = "Show Menu";
		this.display='block';
		console.log(this.isEdit);
		console.log('submitForm');
		this.editRecord(row.admin_menu_id);
	}

	editRecord(id){
  		var sendData = new FormData();
  		sendData.append('id',id);
		this.resetForm();
		this.display='none';
  		this.commonService.getMenuDataById(sendData)
			.subscribe( response => {
				this.editResult = response;
				if(this.editResult.status){
					this.editResult = this.editResult.result;
					this.showRecord(this.editResult)
				}else{
					//this.errorMsg = this.result.message;
					Swal.fire (this.result.message,  "" ,  "error" );
				}
		});
  	}


  	showRecord(result){
		console.log(result.admin_parent_menu__id);
  		this.formRecodEdit.patchValue({
  			id : result.admin_menu_id,
  			menu_name : result.menu_name,
  			menu_code : result.menu_code,
  			menu_url : result.menu_url,
  			parent_menu : result.admin_parent_menu__id,
  			order : result.order,
  			status : result.status_id

  		});
  	}


	  getParentMenu(){
		this.commonService.getParentMenu()
		  .subscribe( response => {
			this.parenManu = response;
			this.parenManu = this.parenManu.result;
			//this.setFormData(this.state_data);
			console.log(this.parenManu);
		});
	  }


  	closePopup(){
    	this.display='block';
    	this.resetForm();
    	this.loaderActive = false;
  	}



  	resetForm(){
  	   	this.formRecodEdit.patchValue({
  	   		id : '0',
	    	menu_name : '',
	      	menu_code : '',
	      	menu_url : '',
	      	parent_menu :'',
	      	order : '',
	      	status : ''

    	});
  	    this.submitted = false;
  	   	this.loaderActive = false;
  	}


  	submitForm(){
  		this.submitted = true;
  		if(this.formRecodEdit.invalid){
  			return;
  		}
  		this.loaderActive = true;
  		const sendData = new FormData();

  		sendData.append('id',this.formRecodEdit.value.id);
  		sendData.append('menu_name',this.formRecodEdit.value.menu_name);
  		sendData.append('menu_code',this.formRecodEdit.value.menu_code);
  		sendData.append('menu_url',this.formRecodEdit.value.menu_url);
  		sendData.append('parent_menu',this.formRecodEdit.value.parent_menu);
  		sendData.append('order',this.formRecodEdit.value.order);
  		sendData.append('status',this.formRecodEdit.value.status);


		console.log(sendData);
		this.commonService.MenuUpdate(sendData)
			.subscribe( response => {

				this.loaderActive = false;
				this.editResult = response;
				if(this.editResult.status){
					this.runTable();
					this.closePopup();
					this.closeAddExpenseModal.nativeElement.click();
					Swal.fire(this.editResult.message, '', "success");
				}else{
					//this.errorMsg = this.editResult.message;
					Swal.fire (this.editResult.message,  "" ,  "error" );
				}
		});

		setTimeout (() => {
			this.successMsg = "";this.errorMsg = "";
		}, 5000);

  	}

  	changeStatus(id,status){
  		var sendData = new FormData();
  		sendData.append('id',id);
  		sendData.append('menu_status',status);
		  var title = "Are you sure ?";

  		switch(status) {
  			case 1:
  				 title = "Are you sure you want to Active?";
  			break;
  			case 2:
  				 title = "Are you sure you want to Inactive?";
			  break;

		  }
  		Swal.fire({
		  title: title,
		  icon: "warning",
		  showCancelButton: true,
		confirmButtonText: 'Confirm',
		cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
		  if (willDelete.value) {
		    this.commonService.changeStatuseByMenuId(sendData)
				.subscribe(response => {
					this.editResult = response;
					this.runTable();
					console.log(this.editResult)
					if(this.editResult.status){
						Swal.fire(this.editResult.message, '', "success");
					}else{
						Swal.fire (this.editResult.message,  "" ,  "error" );
					}
			});
		  }
		});

  	}

}
