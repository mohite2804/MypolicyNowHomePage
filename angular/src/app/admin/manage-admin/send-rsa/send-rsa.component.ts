import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';  //newly added
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
	selector: 'app-send-rsa',
	templateUrl: './send-rsa.component.html',
	styleUrls: ['./send-rsa.component.css']
})
export class SendRsaComponent implements OnInit {
	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;  //newly added

	loaderActive : any;
	loginUserId : any;
	loginUserRoleId : any;
	loginUserTypeId : any;
	loginUserName : any;
	adminMenuIds : any;
	isChecked : boolean;
	isAllChecked : boolean;
	dtInstance : boolean;

	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
		this.isChecked = false;
	}

	ngOnInit(): void {

	    this.loginUserId = sessionStorage.getItem("adminUserId");
	    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
	    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");
	    this.loginUserName = sessionStorage.getItem("adminUserName");
	    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");

    	this.getIndex();
	}

	ngAfterViewInit(): void {
		this.renderer.listen('document', 'click', (event) => {
		if (event.target.hasAttribute("view-send-id")) {
		  this.sendRsaData(event.target.getAttribute("view-send-id"));
		}
		if (event.target.hasAttribute("view-each-id")) {
			//this.selectAll(event.target.getAttribute("view-rsa-attr"));
		}

   //      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			// this.isAllChecked = $('th', dtInstance.table(0).node()).find('[type="checkbox"]')[0].checked;

	  //       let elts: any[] = [];
	  //       $('td', dtInstance.table(0).node()).find('[type="checkbox"]');
	  //       elts = $('td', dtInstance.table(0).node()).find('[type="checkbox"]');

	  //       for (const elt of elts) {
	  //       	elt.checked = this.isAllChecked;
	  //       };
   //      });
	});
	}
	
	getIndex(){
	//console.log('test pro..............');
	const that = this;
	  this.dtOptions = {
	      "pagingType": 'full_numbers',
	      "pageLength": 10,
	      "serverSide": true,
	      "processing": true,
	      'ajax' : {
				url : this.base_url+'admin/getRsaDataList',
				type : 'POST',
				data: {
					"loginUserId": this.loginUserId,
					"loginUserRoleId": this.loginUserRoleId,
					"loginUserTypeId": this.loginUserTypeId,
					"adminMenuIds": this.adminMenuIds,
					},
	          	dataType: "json",
	      	},

	      	columns: [
	        {   
	        	'title' : '<input type="checkbox">',
	        	'data' : ''
	        },
	        {   
	          'title' : 'Sr.No',
	          'data' : 'id' 
	        },
	        {
	          'title' : 'Dealer Code',
	          'data' : 'dealer_code'
	        },
	        {
	          'title' : 'Response',
	          'data' : 'response_data'
	        },
	        {
	          'title' : 'Status',
	          'data' : 'status'
	        },
	        {
	          'title' : 'Created Date',
	          'data' : 'created_date'
	        },
	        {
	          'title' : 'Action',
	          'data' : 'action'
	        },

			],
			columnDefs: [
				{ 
					orderable: false,
                    className: 'select-checkbox', // classname définit une checkbox par dessus une case vide [object Object] (data: null)
                    targets: [0],
                    render: function(data, type, full, meta) {
                        return '<input type="checkbox">'; 
                    }
				}
			],
			// rowCallback: (row: Node, data: any[] | Object, index: number) => {
			// 	const self = this;
			// 	const elt = $('td', row).find('[type="checkbox"]');
			// 	if (elt) {
			// 		elt.unbind('click');
			// 		elt.bind('click', () => {
			// 			if (elt[0].checked) {
			// 				console.log('Checked');
			// 			} else {
			// 				console.log('UnChecked');
			// 			}
			// 			// self.someClickHandler(row, data, index);
			// 		});
			// 	}
			// },
			order: [[ 4, "desc" ]]
	  };
	}


	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	    	dtInstance.draw();
	  	});
	}

	RsaData(){
		
	}

	sendRsaData(id){
		var sendData = new FormData();
		sendData.append('id',id);
		Swal.fire({
			title: 'Are you sure want to Send RSA Data?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			if (willDelete.value) {
				this.loaderActive = true;
				this.commonService.rsaData(sendData)
				.subscribe( response => {
				var output_data: any = response;
				this.runTable();
				this.loaderActive = false;
					if(output_data.status){
						Swal.fire(output_data.message, '', "success");
					}else{
						Swal.fire (output_data.message,  "" ,  "error" );
					}
				});
			}
		});
	}
}	
