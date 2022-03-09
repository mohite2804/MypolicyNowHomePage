import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
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
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements  OnInit {
  mainJsPath = environment.mainJsPath;
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
  submitted : boolean = false;
  stateData : any;
  cityData : any;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  output_scs:any;
  statusData : any;

  selectedState:any;
  selectedStatus:any;
  atLeastOneRequired : any;
  citiesdata : any;
  access_permission :any;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
        id :[''],
        name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]*$')]],
        state_id : ['',Validators.required],
        group_code :[''],
        status : ['',Validators.required]
      });

    this.getIndex();
    //this.getStateData();
    // this.getStatusData();
    this.getStateCityStatus();
    this.loginUserId = sessionStorage.getItem("adminUserId");
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
    if (willDelete.value) {
      this.loaderActive = true;
      this.commonService.changeStatusByCityId(sendData) // changeStatuseByCityId
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

changeSelectBox(form_control_name,selected_value){
  console.log("selected Value "+selected_value);
  if(selected_value){
    switch (form_control_name) {

      case 'state':
        this.formRecodEdit.patchValue({state_id : selected_value });
        this.getCityDataByStateId(selected_value);
        break;

        case 'status':
        this.formRecodEdit.patchValue({status : selected_value });
        break;

       
    }
  }
}

clearValue(form_control_name,selected_value){
  switch (form_control_name) {

    case 'state':
      this.formRecodEdit.patchValue({state_id : '' });
      this.selectedState = "";
      break;

      case 'status':
      this.formRecodEdit.patchValue({status : '' });
      this.selectedStatus = "";
      break;
      
     

  }
}

exportAsXLSX(){
  const sendData = new FormData();
  sendData.append('loginUserId',this.loginUserId);
  this.commonService.getCitiesData(sendData)
        .subscribe( response => {
          this.citiesdata = response;
         if(this.citiesdata.status)
            {
              this.excelService.exportAsExcelFile(this.citiesdata.result, 'CititesData');
              Swal.fire(this.citiesdata.message, '', "success");
           
            }else{
                 Swal.fire(this.citiesdata.message, '', "error");
            }
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
              url : this.base_url+'admin/getcitylist',
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
            'title' : 'City',
            'data' : 'city'
            },
            {
              'title' : 'State Name',
              'data' : 'statename'
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
              'title' : 'Action',
              'data' : 'action_btn'
            }
          ],
          columnDefs: [
            { "orderable": false, "targets": 5 },
            { "orderable": false, "targets": 0 }
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
      this.selectedState ="";
      this.selectedStatus = "";
      this.formRecodEdit.patchValue({
        id : 0,
        name : '',
        state_id : '',
        group_code : ''
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
      this.commonService.getCityDataById(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.editResult = response;
        this.setFormData(this.editResult);
        console.log(this.editResult);
      });
    }



getStateCityStatus(){
  this.commonService.getStateCityStatus()
    .subscribe( response => {
      this.output_scs = response;
      this.stateData = this.output_scs.states;
      this.cityData = this.output_scs.city;
      this.statusData = this.output_scs.statusData;

    });

}



  getCityDataByStateId(stateid){
    if(stateid){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('stateid',stateid);

      this.commonService.getCityDataByStateId(sendData)
        .subscribe( response => {
          this.cityData = response;
          this.cityData = this.cityData.result;
          this.loaderActive = false;

      });


    }

  }

    getStateData(){
      this.commonService.getStateData()
      .subscribe( response => {
        this.stateData = response;
        this.stateData = this.stateData.result;

      });

    }

   setFormData(result){
      this.selectedState = result.result.state_id;
      if(result.result.status_id = '1')
      {
        this.selectedStatus = "Active";
      }
      else {
        this.selectedStatus = "Inactive";
      }
      
      this.formRecodEdit.patchValue({
        id : result.result.city_id,
        name : result.result.name,
        state_id : result.result.state_id,
        group_code : result.result.group_code,
        status : result.result.status_id
      });

    }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show City Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add City Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update City Details";
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
      sendData.append('state_id',this.formRecodEdit.value.state_id);
      sendData.append('group_code',this.formRecodEdit.value.group_code);
      sendData.append('status',this.formRecodEdit.value.status);
      sendData.append('userid',this.loginUserId);
      sendData.append('loginUserId',this.loginUserId);

      this.commonService.cityUpdate(sendData)
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


  getStatusData(){
    this.commonService.getStatusData()
      .subscribe( response => {
        this.statusData = response;
        this.statusData = this.statusData.result;

      });
  }



}
