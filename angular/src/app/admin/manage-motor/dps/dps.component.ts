import { Component, OnInit,Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';


@Component({
	selector: 'app-dps',
	templateUrl: './dps.component.html',
	styleUrls: ['./dps.component.css']
})
export class DpsComponent implements OnInit {

	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective; 
	loginUserId : any;
	editResult : any;

	formRecodEdit : FormGroup;
	formMispExport : FormGroup;
	display : any;
	loaderActive : boolean =  false;
	popupTitle : any;
	fileUpload : any;
	downloadurl : any;
	submitted : boolean = false;   
	btnEditSubmit : boolean = false;
	showCreateBtn : boolean = true;

	date_picker_from_date: NgbDateStruct;
	date_picker_to_date: NgbDateStruct;
	atLeastOneRequired : any;
	date_from : any;
	date_to : any;
	dtRendered = true;
	mispData:any;
	
	access_permission:any;
	// constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }
	constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
	this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
	 }

	ngOnInit(): void {
		this.getIndex();
		this.loginUserId = sessionStorage.getItem("adminUserId");
		this.formMispExport = this.formBuilder.group({
			from_date : [''],
			to_date : [''],            
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
				url : this.base_url+'admin/getdplist',
				type : 'POST',
				data: {                
					"loginUserId": this.loginUserId,

				},
				dataType: "json",
			},             

			columns: [    
				{   
					'title' : 'S.No',
					'data' : 'sno' 
				},
				{   
					'title' : 'DP Name',
					'data' : 'app_fullname' 
				},
				{  
					'title' : 'Mobile No.',
					'data' : 'mobile_no'
				},
				{   
					'title' : 'Address 1',
					'data' : 'address1'  
				},              
				{  
					'title' : 'Address 2',
					'data' : 'address2'
				},  
				{  
					'title' : 'Address 3',
					'data' : 'address3'
				}, 				
				{  
					'title' : 'City',
					'data' : 'city_name'
				},
				// {  
				// 	'title' : 'District',
				// 	'data' : 'district'
				// },            
				{  
					'title' : 'State',
					'data' : 'state'
				},
				// {  
				// 	'title' : 'Country',
				// 	'data' : 'country'
				// },
				{  
					'title' : 'Pin Code',
					'data' : 'pin_code'
				}, 
				{  
					'title' : 'Status',
					'data' : 'status'
				},
				{  
					'title' : 'Created Date',
					'data' : 'created_date'
				}                                 
			]
		};
	}

	runTable(){
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	ngAfterViewInit(): void {
		this.renderer.listen('document', 'click', (event) => {
			if (event.target.hasAttribute("view-record-id")) {
				this.viewRecord(event.target.getAttribute("view-record-id"));
			}
			if (event.target.hasAttribute("view-edit-id")) {
				this.editRecord(event.target.getAttribute("view-edit-id"));
			}
			if (event.target.hasAttribute("view-delete-id")) {
				this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
			}            
			if (event.target.hasAttribute("view-active-id")) {
				this.changeStatus(event.target.getAttribute("view-active-id"),'active');
			}
			if (event.target.hasAttribute("view-inactive-id")) {
				this.changeStatus(event.target.getAttribute("view-inactive-id"),'inactive');
			}
		});     
	}

	resetForm(){
		this.submitted = false;
		this.formRecodEdit.patchValue({
			id : 0,
			model : '',
			status : ''
		});

	}

	closePopup(){
		this.display='none'; 
		this.resetForm();
		this.loaderActive = false;
	}

	getDataById(id){
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getModelDataById(sendData)
		.subscribe( response => {
			this.editResult = response;
			this.setFormData(this.editResult);
			console.log(this.editResult);
		});
	}

	setFormData(result){
		this.formRecodEdit.patchValue({
			id : result.result.id,
			model : result.result.model,
			status : result.result.status
		});

	}

	viewRecord(id){
		this.btnEditSubmit = false;
		this.resetForm();
		this.popupTitle = "Show Model Details";
		this.display='block'; 
		this.getDataById(id);

	}

	openModel(){
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Add Model Details";
		this.display='block'; 
		this.showCreateBtn = true;
		// this.getDataById(id);

	}


	editRecord(id){
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Update Model Details";
		this.display='block'; 
		this.getDataById(id);

	}

	submitForm(){
		this.submitted = true;
		if(this.formRecodEdit.invalid){
			return;
		}
		this.loaderActive = true;
		const sendData = new FormData();
		sendData.append('id',this.formRecodEdit.value.id);
		sendData.append('make',this.formRecodEdit.value.make);
		sendData.append('status',this.formRecodEdit.value.status);
		sendData.append('userid',this.loginUserId);
		sendData.append('loginUserId',this.loginUserId);
		this.commonService.modelUpdate(sendData)
		.subscribe(response =>{

			this.loaderActive = false;
			this.editResult = response;
			if(this.editResult.status){
				this.runTable();
				this.closePopup();
				Swal.fire(this.editResult.message, '', "success"); 
			}else{
				Swal.fire (this.editResult.message,  "" ,  "error" );
			}
		});
	}


	downloadExcel(url){
		window.open(url, '_blank');   
	}

	allDataDownloadExcel(){
		const sendData = new FormData();
		sendData.append('loginUserId',this.loginUserId);
		this.loaderActive = true;
		this.commonService.downloadModelData(sendData)
		.subscribe(response =>{     
			this.downloadurl = response;           
			this.loaderActive = false;
			this.downloadExcel(this.downloadurl.download_url);

		});

	}


	downloadSampleExcel(){
		const sendData = new FormData();
		sendData.append('loginUserId',this.loginUserId);
		this.loaderActive = true;
		this.commonService.downloadModelSampleExcel(sendData)
		.subscribe(response =>{     
			this.downloadurl = response;           
			this.loaderActive = false;
			this.downloadExcel(this.downloadurl.download_url);

		});  
	}

	uploadExcel(){ 

		const sendData = new FormData();
		sendData.append('loginUserId', this.loginUserId);
		sendData.append('fileUpload', this.fileUpload);
		this.loaderActive = true;
		this.commonService.uploadExcelModelData(sendData)
		.subscribe(response =>{     
			var uploadResult :any = response;           
			this.loaderActive = false;
			if(uploadResult.status){
				this.runTable();
				this.closePopup();
				Swal.fire(uploadResult.message, '', "success"); 
				this.fileUpload = "";
			}else{
				Swal.fire (uploadResult.message,  "" ,  "error" );
			}
		});
	}

	getExcelFile(files: FileList) {
		this.fileUpload = files.item(0);
	}

	changeStatus(id,status){
		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('table_status',status);
		sendData.append('userid',this.loginUserId);
		sendData.append('loginUserId',this.loginUserId);
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		})
		.then((willDelete) => {
			if (willDelete.value) {
				this.commonService.changeStatuseByModelId(sendData)
				.subscribe( response => { 
					this.editResult = response;
					this.runTable(); 
					if(this.editResult.status){ 
						Swal.fire(this.editResult.message, '', "success");
					}else{
						Swal.fire (this.editResult.message,  "" ,  "error" );        
					} 

				});
			} 
		});
	}

	submitDateFilterForm(){
		this.submitted = true;
		console.log(this.formMispExport.value.engine_no);
		if(this.formMispExport.invalid){
			console.log('error');
			return false;
		}
		else{
			if((this.formMispExport.value.from_date != '' && this.formMispExport.value.from_date != null && this.formMispExport.value.from_date != undefined) || (this.formMispExport.value.to_date != '' && this.formMispExport.value.to_date != null && this.formMispExport.value.to_date != undefined))
			{
				this.atLeastOneRequired = '';

				this.date_from = this.formMispExport.value.from_date;
				this.date_to = this.formMispExport.value.to_date;

				const that = this;
				this.cdr.detectChanges();
				this.dtRendered = true
				this.cdr.detectChanges();
				this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
					dtInstance.columns(1).search(JSON.stringify(this.date_from));
					dtInstance.columns(2).search(JSON.stringify(this.date_to));
					dtInstance.draw();
				});
				this.submitted =false;
			} 
			else {
				Swal.fire({position: 'center',icon: 'error',title: 'At least one field required', showConfirmButton: false, timer: 3000 });
				// this.atLeastOneRequired = 'At least one field required';
				return false;
			}
		}
	}

	resetDateFilterForm(){
		this.date_from = '';
		this.date_to = '';

		this.submitted = false;

		this.formMispExport.reset();

		this.cdr.detectChanges();
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns(1).search('');
			dtInstance.columns(2).search('');        
			dtInstance.draw();
		});    
	}

	exportAsXLSX(){
		const sendData = new FormData();
		sendData.append('loginUserId',this.loginUserId);
		sendData.append('date_from',JSON.stringify(this.date_from));
		sendData.append('date_to',JSON.stringify(this.date_to));
		this.commonService.getDpExcelExport(sendData)
		.subscribe( response => {
			this.mispData = response;

			if(this.mispData.status)
            {
              this.excelService.exportAsExcelFile(this.mispData.result, 'DP_List');
              Swal.fire(this.mispData.message, '', "success");
            }else{
                 Swal.fire(this.mispData.message, '', "error");
            }
		});
	}


}
