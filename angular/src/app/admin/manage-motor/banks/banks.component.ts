import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';
@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.css']
})
export class BanksComponent implements  OnInit {
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
        name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
        status : ['',Validators.required]

      });
    this.getIndex();
    this.getBankStatus();
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
    this.commonService.getBanksData(sendData)
          .subscribe( response => {
            this.BankData = response;
            //console.log(this.modelsdata);
           this.excelService.exportAsExcelFile(this.BankData, 'BankData');
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
              url : this.base_url+'admin/getbanklist',
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
              'title' : 'Bank Name',
              'data' : 'bankname'
            },

            {
              'title' : 'Status',
              'data' : 'status'
            },
            {
              'title' : 'Created By',
              'data' : 'created_by'
            },
            {
              'title' : 'Updated By',
              'data' : 'updated_by'
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
            { "orderable": false, "targets": 6 },
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 5, "desc" ]]

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
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getBankDataById(sendData)
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

     getBankData(){
      this.commonService.getBankData()
        .subscribe( response => {
          this.bankData = response;
          this.bankData = this.bankData.result;
          //this.setFormData(this.state_data);
          console.log(this.bankData);
        });

    }

    getBankStatus(){
      this.commonService.getBankStatus()
        .subscribe( response => {
          this.output_result = response;
          this.bankData = this.output_result.bank;
          this.statusData = this.output_result.statusData;
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
        id : result.result.bank_id,
        name : result.result.name,
        status : result.result.status_id
      });

    }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Bank Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Bank Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Bank Details";
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
      sendData.append('status',this.formRecodEdit.value.status);
      sendData.append('userid',this.loginUserId);
      sendData.append('loginUserId',this.loginUserId);

      this.commonService.bankUpdate(sendData)
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

        Swal.fire({position: 'center',icon: 'success',title: uploadResult.message, showConfirmButton: false, timer: 3000 });
        this.fileUpload = "";
      }else{
        Swal.fire({position: 'center',icon: 'error',title: uploadResult.message, showConfirmButton: false, timer: 3000 });

      }
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
    sendData.append('loginUserId',this.loginUserId);
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
      this.commonService.changeStatusByBankId(sendData)
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
