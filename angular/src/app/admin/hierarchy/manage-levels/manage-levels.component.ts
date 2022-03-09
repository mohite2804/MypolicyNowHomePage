import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { Router,ActivatedRoute, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../../environments/environment';
import {ExcelService} from '../../services/excel.service';

@Component({
	selector: 'app-manage-levels',
	templateUrl: './manage-levels.component.html',
	styleUrls: ['./manage-levels.component.css']
})
export class ManageLevelsComponent implements OnInit {

	base_url = environment.baseUrl;
	// dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective; 	
	dtOptions: any = {};

	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
	@ViewChild('closeAddExpenseModal1') closeAddExpenseModal1: ElementRef;
	@ViewChild('closeAddExpenseModal2') closeAddExpenseModal2: ElementRef;
	dtRendered = true;

	div_show_level_status : boolean = false;

	loginUserId : any;    
	id : any;    
	table : any;  
	where_column : any;
	back_url : any;

	statusval : any = 'zone';

	result : any;

	levels_data : any;
	level_id :any;
	all_levels :any ;
	statusData :any ;

	displayAddZone : any;
	displayAddRegion : any;
	displayAddState : any;

	formRecodEdit : any;
	formRecodEdit_region : any;
	formRecodEdit_state : any;

	showCreateBtn : boolean = true;
	levelZoneParentData :any;
	levelRegionParentData :any;

	submitted : boolean = false;

	popupTitle :any;
	btnEditSubmit : boolean = false;
	display :any;
	editResult :any;

	submitted1 : boolean = false;
	region_popupTitle :any;
	btnEditSubmit1 : boolean = false;
	display1 :any;
	editResult1 :any;

	submitted2 : boolean = false;
	state_popupTitle :any;
	btnEditSubmit2 : boolean = false;
	display2 :any;
	editResult2 :any;
	filterRegions :any;
	filterZones :any;



	loaderActive : boolean =  false;

	// constructor(private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, ) { }
	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService,public cdr: ChangeDetectorRef) { }



	ngOnInit(): void {
		this.loginUserId = sessionStorage.getItem("adminUserId");  

		this.displayAddZone = 'block';
		this.displayAddRegion = 'none';
		this.displayAddState= 'none';

		// this.getLevels();
		this.getIndex();
		this.getStatusData();
		this.getLevelZoneParents();
		this.getlevelRegionParents();


		this.formRecodEdit = this.formBuilder.group({
			id :[''],
			level_zone_name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
			level_zone_parent_id : ['',[Validators.required]],
			status : ['',Validators.required]

		});

		this.formRecodEdit_region = this.formBuilder.group({
			id :[''],
			level_region_name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
			level_region_parent_id : ['',[Validators.required]],
			level_zone_parent_id : ['',[Validators.required]],
			status : ['',Validators.required]

		});

		this.formRecodEdit_state = this.formBuilder.group({
			id :[''],
			level_state_name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
			level_region_parent_id : ['',[Validators.required]],
			level_state_parent_id : ['',[Validators.required]],
			level_zone_parent_id : ['',[Validators.required]],
			status : ['',Validators.required]

		});
	}


	getStatusData(){
		this.commonService.getStatusData()
		.subscribe( response => {
			this.statusData = response;
			this.statusData = this.statusData.result;
			//this.setFormData(this.state_data);
			console.log(this.statusData);
		});

	}

	getLevelZoneParents(){
		this.commonService.getLevelZoneParents()
		.subscribe( response => {
			this.levelZoneParentData = response;
			this.levelZoneParentData = this.levelZoneParentData.result;
			//this.setFormData(this.state_data);
			console.log(this.levelZoneParentData);
		});
	}

	getlevelRegionParents(){
		this.commonService.getlevelRegionParents()
		.subscribe( response => {
			this.levelRegionParentData = response;
			this.levelRegionParentData = this.levelRegionParentData.result;
			//this.setFormData(this.state_data);
			console.log(this.levelRegionParentData);
		});
	}

	getLevels(){
		var sendData = new FormData();
		sendData.append('id', this.id);
		this.commonService.getLevels(sendData)
		.subscribe( response => {
			this.levels_data = response;
			this.levels_data = this.levels_data.result[0];         
			this.level_id = this.levels_data.level_id;        
		});
	}

	getIndex(){
		//console.log('test pro..............');
		const that = this;
		this.dtOptions = {
			"pagingType": 'full_numbers',
			"lengthMenu": [[25, 100, -1], [25, 100, "All"]],
			"pageLength": 25,
			"serverSide": true,
			"processing": true,
			'ajax' : {
				url : this.base_url+'admin/getAllZones',
				type : 'POST',
				data: {                
					"loginUserId": this.loginUserId
				},
				dataType: "json",
			},  
			columns: [    
			{   
				'title' : 'Sr.No',
				'data' : 'id' 
			},                    
			{  
				'title' : 'Parent',
				'data' : 'level_parent_name'
			},
			{  
				'title' : 'Zone',
				'data' : 'level_zone_name'
			},			
			{  
				'title' : 'Status',
				'data' : 'status'
        	}, 
        	{  
				'title' : 'Created Date',
				'data' : 'created_at'
			},          
	        {  
	          'title' : 'Action',
	          'data' : 'action_btn'
	      	}
      	],
	    "columnDefs": [ 
	    	{"targets": 3,"orderable": false}, 
      	],
      	order: [[ 0, "desc" ]],
      	dom: 'Bfrtip',
	    buttons: [		
			    	{
			    		extend: 'excel', 
			    		className: 'btn btn-custom green',
			    		text : '<span class="fa fa-file-excel-o"></span> Excel Export',
			    		exportOptions: {
			                modifier: {
			                    page: 'all',
			                    search: 'applied',
			                    order: 'applied',
			                }
			            }
			    	}	        			        
			    ]
  		};
	}

	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	searchByLevel(statusid){
		this.div_show_level_status = false;
		this.statusval = statusid;
		const that = this;

		this.dtRendered = false;

		if(this.statusval == 'zone')
		{
			this.displayAddZone = 'block';
			this.displayAddRegion = 'none';
			this.displayAddState= 'none';
		}
		else if(this.statusval == 'region')
		{
			this.displayAddZone = 'none';
			this.displayAddRegion = 'block';
			this.displayAddState= 'none';
		}
		else if(this.statusval == 'state')
		{
			this.displayAddZone = 'none';
			this.displayAddRegion = 'none';
			this.displayAddState= 'block';
		}


		switch(this.statusval) { 
			case "zone": { 
				this.dtOptions = {
					"pagingType": 'full_numbers',
					"lengthMenu": [[25, 100, -1], [25, 100, "All"]],
					"pageLength": 25,
					"serverSide": true,
					"processing": true,
					'ajax' : {
						url : this.base_url+'admin/getAllZones',
						type : 'POST',
						data: {                
							"loginUserId": this.loginUserId,
							"parent_type_id": this.id,
						},
						dataType: "json",
					},  
					columns: [    
					{   
						'title' : 'Sr.No',
						'data' : 'id' 
					},                    
					{  
						'title' : 'Parent',
						'data' : 'level_parent_name'
					},
					{  
						'title' : 'Zone',
						'data' : 'level_zone_name'
					},
					{  
						'title' : 'Status',
						'data' : 'status'
		        	}, 
		        	{  
						'title' : 'Created Date',
						'data' : 'created_at'
					},          
			        {  
			          'title' : 'Action',
			          'data' : 'action_btn'
			      	}

		          ],
		          "columnDefs": [ {
		          	"targets": 3,
		          	"orderable": false
		          }, 
		          ],
		          order: [[ 0, "desc" ]],
		          dom: 'Bfrtip',
				  buttons: [		
			    	{
			    		extend: 'excel', 
			    		className: 'btn btn-custom green',
			    		text : '<span class="fa fa-file-excel-o"></span> Excel Export',
			    		exportOptions: {
			                modifier: {
			                    page: 'all',
			                    search: 'applied',
			                    order: 'applied',
			                }
			            }
			    	}	        			        
			    ]
		      };
		      break; 
		  	} 
		  	case "region": { 
			  	this.dtOptions = {
			  		"pagingType": 'full_numbers',
			  		"lengthMenu": [[25, 100, -1], [25, 100, "All"]],
			  		"pageLength": 25,
			  		"serverSide": true,
			  		"processing": true,
			  		'ajax' : {
			  			url : this.base_url+'admin/getAllLevelRegion',
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
			  			'title' : 'Parent Zone',
			  			'data' : 'level_zone_name'
			  		},                    
			  		{  
			  			'title' : 'Region',
			  			'data' : 'level_region_name'
			  		},
			  		{  
		  				'title' : 'Status',
		  				'data' : 'status'
		            },    
		            {  
						'title' : 'Created Date',
						'data' : 'created_at'
					},        
	              	{  
	                	'title' : 'Action',
	                	'data' : 'action_btn'
	            	}
		            ],
		            "columnDefs": [ {
		            		"targets": 4,
		            		"orderable": false
		            	}],
		            	order: [[ 0, "desc" ]],
		            	dom: 'Bfrtip',
						buttons: [		
			    	{
			    		extend: 'excel', 
			    		className: 'btn btn-custom green',
			    		text : '<span class="fa fa-file-excel-o"></span> Excel Export',
			    		exportOptions: {
			                modifier: {
			                    page: 'all',
			                    search: 'applied',
			                    order: 'applied',
			                }
			            }
			    	}	        			        
			    ]
			    	};
			    break; 
		 	}
			case "state": { 
		    	this.dtOptions = {
		    		"pagingType": 'full_numbers',
		    		"lengthMenu": [[25, 100, -1], [25, 100, "All"]],
		    		"pageLength": 25,
		    		"serverSide": true,
		    		"processing": true,
		    		'ajax' : {
		    			url : this.base_url+'admin/getAllLevelState',
		    			type : 'POST',
		    			data: {                
		    				"loginUserId": this.loginUserId,
		    				"parent_type_id": this.id,
		    			},
		    			dataType: "json",
		    		},  
		    		columns: [    
		    		{   
		    			'title' : 'Sr.No',
		    			'data' : 'id' 
		    		},                    
		    		{  
		    			'title' : 'Parent',
		    			'data' : 'level_parent_name'
		    		},
		    		{  
		    			'title' : 'Zone',
		    			'data' : 'level_zone_name'
		    		},
		    		{  
		    			'title' : 'Region Name',
		    			'data' : 'level_region_name'
		    		},
		    		{  
		    			'title' : 'State',
		    			'data' : 'level_state_name'
		    		},
		    		{  
		    			'title' : 'Created Date',
		    			'data' : 'created_at'
		    		},
		    		{  
		    			'title' : 'Status',
		    			'data' : 'status'
		            },           
		            {  
		              'title' : 'Action',
		              'data' : 'action_btn'
		          	}
	          	],
		        "columnDefs": [ {
		          	"targets": 5,
		          	"orderable": false
		        }],
		        order: [[ 0, "desc" ]],
		        dom: 'Bfrtip',
				  	buttons: [		
			    	{
			    		extend: 'excel', 
			    		className: 'btn btn-custom green',
			    		text : '<span class="fa fa-file-excel-o"></span> Excel Export',
			    		exportOptions: {
			                modifier: {
			                    page: 'all',
			                    search: 'applied',
			                    order: 'applied',
			                }
			            }
			    	}	        			        
			    ]
				};
				break; 
			} 
		} 
		
		// make sure your template notices it
		this.cdr.detectChanges();
		// initialize them again
		this.dtRendered = true
		this.cdr.detectChanges();
		this.loaderActive = false;
	}

	ngAfterViewInit(): void {
		this.renderer.listen('document', 'click', (event) => {
			
			//zone
			if (event.target.hasAttribute("view-edit-zone-id")) {
				this.editRecord(event.target.getAttribute("view-edit-zone-id"));
			}
			if (event.target.hasAttribute("view-active-id")) {
				this.changeStatus(event.target.getAttribute("view-active-id"),2);
			}
			if (event.target.hasAttribute("view-inactive-id")) {
				this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
			}

			//Region
			if (event.target.hasAttribute("view-edit-region-id")) {
				this.editRegionRecord(event.target.getAttribute("view-edit-region-id"));
			}
			if (event.target.hasAttribute("view-active-region-id")) {
				this.changeRegionStatus(event.target.getAttribute("view-active-region-id"),2);
			}
			if (event.target.hasAttribute("view-inactive-region-id")) {
				this.changeRegionStatus(event.target.getAttribute("view-inactive-region-id"),1);
			}

			//State
			if (event.target.hasAttribute("view-edit-state-id")) {
				this.editStateRecord(event.target.getAttribute("view-edit-state-id"));
			}
			if (event.target.hasAttribute("view-active-state-id")) {
				this.changeStateStatus(event.target.getAttribute("view-active-state-id"),2);
			}
			if (event.target.hasAttribute("view-inactive-state-id")) {
				this.changeStateStatus(event.target.getAttribute("view-inactive-state-id"),1);
			}
		});
	}

	//zone Form
	openModel(){
		this.btnEditSubmit = true;
		this.display='none';
		this.resetForm();
		this.popupTitle = "Add Zone ";
		this.showCreateBtn = true;
		// this.getDataById(id);
	}

	closePopup(){
		this.display='block';
		this.resetForm();
		this.loaderActive = false;
	}

	closePopupSuccess(){
		this.display='block';
		this.resetForm();
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
		sendData.append('level_zone_name',this.formRecodEdit.value.level_zone_name);
		sendData.append('level_zone_parent_id',this.formRecodEdit.value.level_zone_parent_id);
		sendData.append('status',this.formRecodEdit.value.status);
		sendData.append('userid',this.loginUserId);


		this.commonService.addUpdateZone(sendData)
		.subscribe(response =>{

			this.loaderActive = false;
			this.editResult = response;
			if(this.editResult.status){
				this.runTable();
				this.closePopupSuccess();
				this.closeAddExpenseModal.nativeElement.click();

				Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}else{
				Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}
		});
	}

	resetForm(){
		this.submitted = false;
		this.formRecodEdit.patchValue({
			id : 0,
			level_zone_name : '',
			level_zone_parent_id : '',
			status : ''
		});
	}

	editRecord(id){
		// alert(id);
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Update Zone Details";
		this.display='none';
		this.getDataById(id);
	}

	getDataById(id){
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getZoneDataById(sendData)
		.subscribe( response => {
			this.loaderActive = false;
			this.editResult = response;
			this.setFormData(this.editResult);
			console.log(this.editResult);
		});
	}

	setFormData(result){
		this.formRecodEdit.patchValue({
			id : result.result.level_zone_id,
			level_zone_name : result.result.level_zone_name,
			level_zone_parent_id : result.result.level_zone_parent_id,
			status : result.result.status_id
		});
	}

	changeStatus(id,status){

		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('status',status);
		sendData.append('userid',this.loginUserId);
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			this.loaderActive = true;
			if (willDelete.value) {
				this.commonService.changeStatusByZoneId(sendData)
				.subscribe( response => {
					this.loaderActive = false;
					this.editResult = response;
					this.runTable();
					if(this.editResult.status){
						Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}else{
						Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}

				});
			}
		});
	}

	//Region
	openModel_region(){
		this.btnEditSubmit1 = true;
		this.display='none';
		this.resetForm_region();
		this.getlevelRegionParents();
		this.region_popupTitle = "Add Region ";
		// this.getDataById(id);
	}

	closePopup1(){
		this.display1='block';
		this.resetForm_region();
		this.loaderActive = false;
	}

	closePopupSuccess_region(){
		this.display1='block';
		this.resetForm_region();
		this.loaderActive = false;
	}

	submit_region_Form(){
		this.submitted1 = true;
		if(this.formRecodEdit_region.invalid){
			return;
		}
		this.loaderActive = true;
		const sendData = new FormData();
		sendData.append('id',this.formRecodEdit_region.value.id);
		sendData.append('level_region_name',this.formRecodEdit_region.value.level_region_name);
		sendData.append('level_region_parent_id',this.formRecodEdit_region.value.level_region_parent_id);
		sendData.append('status',this.formRecodEdit_region.value.status);
		sendData.append('userid',this.loginUserId);


		this.commonService.addUpdateRegion(sendData)
		.subscribe(response =>{

			this.loaderActive = false;
			this.editResult = response;
			if(this.editResult.status){
				this.runTable();
				this.closePopupSuccess_region();
				this.closeAddExpenseModal1.nativeElement.click();

				Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}else{
				Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}
		});
	}

	resetForm_region(){
		this.submitted1 = false;
		this.formRecodEdit_region.patchValue({
			id : 0,
			level_region_name : '',
			level_region_parent_id : '',
			level_zone_parent_id : '',
			status : ''
		});
	}

	editRegionRecord(id){
		// alert(id);
		this.btnEditSubmit1 = true;
		this.resetForm_region();
		this.region_popupTitle = "Update Region Details";
		this.display='none';
		this.getRegionDataById(id);
	}

	getRegionDataById(id){
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getRegionDataById(sendData)
		.subscribe( response => {
			this.loaderActive = false;
			this.editResult = response;
			this.setRegionFormData(this.editResult);
			console.log(this.editResult);
		});
	}

	setRegionFormData(result){
		this.formRecodEdit_region.patchValue({
			id : result.result.level_region_id,
			level_region_name : result.result.level_region_name,
			level_region_parent_id : result.result.level_region_parent_id,
			level_zone_parent_id : result.zone_parent_id,
			status : result.result.status_id
		});
	}

	changeRegionStatus(id,status){

		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('status',status);
		sendData.append('userid',this.loginUserId);
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			this.loaderActive = true;
			if (willDelete.value) {
				this.commonService.changeStatusByRegionId(sendData)
				.subscribe( response => {
					this.loaderActive = false;
					this.editResult = response;
					this.runTable();
					if(this.editResult.status){
						Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}else{
						Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}

				});
			}
		});
	}

	//state
	getFilterZone(event){
		if(event.target.value != "")
	    {
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit_state.patchValue({level_region_parent_id : '' });
	      	this.formRecodEdit_state.patchValue({level_state_parent_id : '' });

	      	this.levelRegionParentData = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('zone_parent_id',event.target.value);
	      	this.commonService.getFilterZone(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
	          			this.levelRegionParentData = result.result;
	        		}
	      	});
	    }
	}


	getFilterRegion(event){
		if(event.target.value != "")
	    {
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit_state.patchValue({level_state_parent_id : '' });

	      	this.filterRegions = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('zone_id',event.target.value);
	      	this.commonService.getFilterRegion(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
	          			this.filterRegions = result.result;
	        		}
	      	});
	    }
	}	

	openmodal_state(){
		this.btnEditSubmit2 = true;
		this.display2='none';
		this.resetForm_state();
		this.state_popupTitle = "Add State ";
		// this.getDataById(id);
	}

	closePopup2(){
		this.display2='block';
		this.resetForm_state();
		this.loaderActive = false;
	}

	closePopupSuccess_state(){
		this.display2='block';
		this.resetForm_state();
		this.loaderActive = false;
	}


	submit_state_Form(){
		this.submitted2 = true;
		if(this.formRecodEdit_state.invalid){
			return;
		}
		this.loaderActive = true;
		const sendData = new FormData();
		sendData.append('id',this.formRecodEdit_state.value.id);
		sendData.append('level_state_name',this.formRecodEdit_state.value.level_state_name);
		sendData.append('level_region_parent_id',this.formRecodEdit_state.value.level_region_parent_id);
		sendData.append('level_state_parent_id',this.formRecodEdit_state.value.level_state_parent_id);
		sendData.append('status',this.formRecodEdit_state.value.status);
		sendData.append('userid',this.loginUserId);


		this.commonService.addUpdateState(sendData)
		.subscribe(response =>{

			this.loaderActive = false;
			this.editResult = response;
			if(this.editResult.status){
				this.runTable();
				this.closePopupSuccess_state();
				this.closeAddExpenseModal2.nativeElement.click();

				Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}else{
				Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

			}
		});
	}

	resetForm_state(){
		this.submitted2 = false;
		this.formRecodEdit_state.patchValue({
			id : 0,
			level_state_name : '',
			level_state_parent_id : '',
			level_region_parent_id : '',
			level_zone_parent_id : '',
			status : ''
		});
	}

	editStateRecord(id){
		// alert(id);
		this.btnEditSubmit2 = true;
		this.resetForm_state();
		this.region_popupTitle = "Update State Details";
		this.display2='none';
		this.getStateDataById(id);
	}

	getStateDataById(id){
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getStateDataById(sendData)
		.subscribe( response => {
			this.loaderActive = false;
			this.editResult = response;

			//get filter zones
			this.formRecodEdit_state.patchValue({level_region_parent_id : '' });
	      	this.levelRegionParentData = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('zone_parent_id',this.editResult.zone_parent_id);
	      	this.commonService.getFilterZone(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
	          			this.levelRegionParentData = result.result;
	        		}
	      	});		

			//get filter regions
			this.formRecodEdit_state.patchValue({level_state_parent_id : '' });
	      	this.filterRegions = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('zone_id',this.editResult.parent_zone_id);
	      	this.commonService.getFilterRegion(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
	          			this.filterRegions = result.result;
	        		}
	      	});



			this.setStateFormData(this.editResult);
			console.log(this.editResult);
		});			
	}

	setStateFormData(result){
		console.log(result.result.status_id);	
		this.formRecodEdit_state.patchValue({
			id : result.result.level_state_id,
			level_state_name : result.result.level_state_name,
			level_state_parent_id : result.result.level_state_parent_id,
			level_region_parent_id : result.parent_zone_id,
			level_zone_parent_id : result.zone_parent_id,
			status : result.result.status_id
		});
	}

	changeStateStatus(id,status){

		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('status',status);
		sendData.append('userid',this.loginUserId);
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			this.loaderActive = true;
			if (willDelete.value) {
				this.commonService.changeStatusByStateId(sendData)
				.subscribe( response => {
					this.loaderActive = false;
					this.editResult = response;
					this.runTable();
					if(this.editResult.status){
						Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}else{
						Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
					}

				});
			}
		});
	}

}

