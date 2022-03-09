import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';

@Component({
	selector: 'app-levels',
	templateUrl: './levels.component.html',
	styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {
	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
	loginUserId : any;
	editResult : any;

	formRecodEdit : any;
	display : any;
	loaderActive : boolean =  false;
	popupTitle : any;
	fileUpload : any;
	downloadurl : any;
	statusData : any;
	bankData : any;
	
	labelDataSelection : any;

	submitted : boolean = false;
	btnEditSubmit : boolean = false;
	showCreateBtn : boolean = true;
	responseMsg : any;
	msgClass: any;
	output_result:any;

	selectedStatus:any;
	atLeastOneRequired : any;
	BankData : any;
	access_permission : any;
	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) { 
		this.loginUserId = sessionStorage.getItem("adminUserId");
    	this.access_permission = sessionStorage.getItem("access_permission");
	}
	ngOnInit(): void {
		this.formRecodEdit = this.formBuilder.group({
			id :[''],
			parent_id : [''],
			name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
			status : ['',Validators.required]

		});
		this.getIndex();
		this.getLevelStatus();
		this.getParentlabelDataSelection();
		this.loginUserId = sessionStorage.getItem("adminUserId");
	}

	changeSelectBox(form_control_name,selected_value){
		console.log("selected Value "+selected_value);
		if(selected_value){
			switch (form_control_name) {

				case 'status':
				this.formRecodEdit.patchValue({status : selected_value });
				break;
			}
		}
	}

	clearValue(form_control_name,selected_value){
		switch (form_control_name) {

			case 'status':
			this.formRecodEdit.patchValue({status : '' });
			this.selectedStatus = "";
			break;

		}
	}
	
	exportAsXLSX(){
		const sendData = new FormData();
		//sendData.append('loginUserId',this.loginUserId);
		this.commonService.getLevelsData(sendData)
		.subscribe( response => {
			this.BankData = response;
			//console.log(this.modelsdata);
			this.excelService.exportAsExcelFile(this.BankData, 'LevelsData');
		});
	}


	successNotify(infoMsg){
		this.notifyService.success(
			'Success',
			infoMsg,
			{
				position: "top",
				theClass: "aboveAll",
				timeOut: 3000,
				showProgressBar: true,
				animate: 'fade',
			}
			);
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
				url : this.base_url+'admin/getLevelsList',
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
				'title' : 'Level Label',
				'data' : 'level_label'
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
			columnDefs: [
			{ "orderable": false, "targets": 4 },
			{ "orderable": false, "targets": 0 }
			],
			order: [[ 3, "desc" ]]

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
				this.changeStatus(event.target.getAttribute("view-active-id"),2);
			}
			if (event.target.hasAttribute("view-inactive-id")) {
				this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
			}
		});
	}

	resetForm(){
		this.submitted = false;
		this.selectedStatus = "";
		this.formRecodEdit.patchValue({
			id : 0,
			name : '',
			parent_id : '',
			status : ''
		});

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

	closePopupFailed(){
		this.display='block';
		this.loaderActive = false;
	}

	getDataById(id){
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('id',id);
		this.commonService.getLevelDataById(sendData)
		.subscribe( response => {
			this.loaderActive = false;
			this.editResult = response;
			this.setFormData(this.editResult);
			console.log(this.editResult);
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

	getLevelStatus(){
		this.commonService.getLevelStatus()
		.subscribe( response => {
			this.output_result = response;
			this.bankData = this.output_result.bank;
			this.statusData = this.output_result.statusData;
		});
	}

	getParentlabelDataSelection(){
		this.commonService.getLevelSelection()
		.subscribe( response => {
			this.labelDataSelection = response;
			this.labelDataSelection = this.labelDataSelection.result;
		});
	}



	setFormData(result){

		if(result.result.status_id = 1)
		{
			this.selectedStatus = "Active";
		}
		else {
			this.selectedStatus = "Inactive";
		}
		this.formRecodEdit.patchValue({
			id : result.result.level_id,
			name : result.result.level_label,
			parent_id : result.result.parent_id,
			status : result.result.status_id
		});

	}

	viewRecord(id){
		this.btnEditSubmit = false;
		this.resetForm();
		this.popupTitle = "Show Hierarchy Level Details";
		this.display='block';
		this.getDataById(id);

	}

	openModel(){
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Add Hierarchy Level";
		this.display='none';
		this.showCreateBtn = true;
		// this.getDataById(id);

	}


	editRecord(id){
		this.btnEditSubmit = true;
		this.resetForm();
		this.popupTitle = "Update Hierarchy Level Details";
		this.display='none';
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
		sendData.append('name',this.formRecodEdit.value.name);
		sendData.append('parent_id',this.formRecodEdit.value.parent_id);
		sendData.append('status',this.formRecodEdit.value.status);
		sendData.append('userid',this.loginUserId);


		this.commonService.levelUpdate(sendData)
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


	downloadExcel(url){
		window.open(url, '_blank');
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

	getExcelFile(files: FileList) {
		this.fileUpload = files.item(0);
	}

	changeStatus(id,status){

		var sendData = new FormData();
		sendData.append('id',id);
		sendData.append('bank_status',status);
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
				this.commonService.changeStatusByLevelId(sendData)
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

