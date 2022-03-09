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

@Component({
  selector: 'app-fuels',
  templateUrl: './fuels.component.html',
  styleUrls: ['./fuels.component.css']
})
export class FuelsComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;

  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  fuelData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  output_result:any;

  selectedStatus:any;
  access_permission : any;
  is_isuzu  : any;
    hide_export : boolean = true;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
        id :[''],
        name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
        status : ['',Validators.required]
      });
    this.getIndex();
    //this.getStatusData();
    //this.getFuelData();
    this.getFuelStatus();
    this.loginUserId = sessionStorage.getItem("adminUserId");
    if(this.is_isuzu==1){
      this.access_permission='read';
      this.hide_export=false;
    }
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
              url : this.base_url+'admin/getfuellist',
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
              'title' : 'FUEL',
              'data' : 'fuel'
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
            { "orderable": false, "targets": 0 },
            { "orderable": false, "targets": 6 }
          ],
          order: [[ 1, "desc" ]]
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
    this.commonService.getFuelDataById(sendData)
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

    getFuelData(){
      this.commonService.getFuelData()
        .subscribe( response => {
          this.fuelData = response;
          this.fuelData = this.fuelData.result;
          //this.setFormData(this.state_data);
          console.log(this.fuelData);
        });

    }

  getFuelStatus(){
      this.commonService.getFuelStatus()
        .subscribe( response => {
        this.output_result = response;

          this.fuelData = this.output_result.fuel;
          this.statusData = this.output_result.statusData;


        });

    }

   setFormData(result){
    if(result.result.status_id = '1')
    {
     this.selectedStatus = "Active";
    }
    else {
     this.selectedStatus = "Inactive";
    }
      this.formRecodEdit.patchValue({
        id : result.result.vehicle_fuel_id,
        name : result.result.name,
        status : result.result.status_id
      });

    }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Fuel Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Fuel Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Fuel Details";
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
      

      this.commonService.fuelUpdate(sendData)
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
    sendData.append('fuel_status',status);
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
      this.loaderActive = true;
      this.commonService.changeStatusByFuelId(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.editResult = response;
        this.runTable();
        if(this.editResult.status){
          //Swal.fire(this.editResult.message, '', "success");
          Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
        }else{
          Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
        }

    });
    }
  });

  }

}
