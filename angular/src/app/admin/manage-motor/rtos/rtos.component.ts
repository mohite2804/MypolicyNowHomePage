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
  selector: 'app-rtos',
  templateUrl: './rtos.component.html',
  styleUrls: ['./rtos.component.css']
})
export class RtosComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;
  is_ncr : any = 0;
  is_checked : any;
  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  cityData : any;
  stateData : any;
  rtoZoneData : any;
  statusData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  stateid : any;
  rtoData : any;

  selectedstate :any;
  selectedcity :any;
  selectedRto_zone : any;
  selectedstatus : any;
  atLeastOneRequired : any;
  rtosdata : any;
  access_permission : any;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

   ngOnInit(): void {

      this.formRecodEdit = this.formBuilder.group({
        id :[''],
        label : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^([a-zA-Z]{2})[-]([0-9]{2})$')]],
        city : ['',Validators.required],
        state : ['',Validators.required],
        rto_zone : ['',Validators.required],
        // is_ncr : [''],
        status : ['',Validators.required]

      });

    this.getIndex();
    this.getStateData();
    this.getRtoData();
    this.getStatusData();
    this.getRtoZoneData();
    //this.getCityData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {
        case 'state':
          this.formRecodEdit.patchValue({state : selected_value });
          this.getCityDataByStateId(selected_value);
          break;
          
        case 'city':
          this.formRecodEdit.patchValue({city : selected_value });
          break;
            
        case 'rto_zone':
          this.formRecodEdit.patchValue({rto_zone : selected_value });
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
        this.formRecodEdit.patchValue({state : '' });
        this.selectedstate = "";
        break;

        case 'city':
          this.formRecodEdit.patchValue({city : '' });
          this.selectedcity = "";
          break;
          
          case 'rto_zone':
          this.formRecodEdit.patchValue({rto_zone : '' });
          this.selectedRto_zone = "";
          break;
                    
          case 'status':
          this.formRecodEdit.patchValue({status : '' });
          this.selectedstatus = "";
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

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getrtosData(sendData)
          .subscribe( response => {
            this.rtosdata = response;
          
            if(this.rtosdata.status)
            {
               this.excelService.exportAsExcelFile(this.rtosdata.result, 'rtosData');
              Swal.fire(this.rtosdata.message, '', "success");
           
            }else{
                 Swal.fire(this.rtosdata.message, '', "error");
            }
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
              url : this.base_url+'admin/getrtolist',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,

          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'S.NO',
              'data' : 'sno'
            },
            {
              'title' : 'RTO CODE',
              'data' : 'rto_name'
            },
            {
              'title' : 'RTO State',
              'data' : 'statename'
            },
            {
              'title' : 'RTO City',
              'data' : 'cityname'
            },
            {
              'title' : 'RTO Zone',
              'data' : 'zonedescription'
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
            { "orderable": false, "targets": [0,6,7,9] }
          ],
          order: [[ 8, "desc" ]]

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
      this.selectedstate = "";
      this.selectedcity = "";
      this.selectedRto_zone ="";
      this.selectedstatus ="";
      this.formRecodEdit.patchValue({
        id : 0,
        label : '',
        city : '',
        state : '',
        rto_zone : '',
        // is_ncr : '',
        status : ''
      });

    }

  closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getRtoDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.getCityDataByStateId(this.editResult.result.state_id);
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

   getStateData(){
      this.commonService.getStateData()
        .subscribe( response => {
          this.stateData = response;
          this.stateData = this.stateData.result;
          //this.setFormData(this.state_data);
          console.log(this.stateData);
        });

    }

   getRtoZoneData(){
      this.commonService.getRtoZoneData()
        .subscribe( response => {
          this.rtoZoneData = response;
          this.rtoZoneData = this.rtoZoneData.result;
          //this.setFormData(this.state_data);
          console.log(this.rtoZoneData);
        });

    }

    getRtoData(){
      this.commonService.getRtoData()
        .subscribe( response => {
          this.rtoData = response;
          this.rtoData = this.rtoData.result;
          console.log(this.rtoData);
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
            //this.setFormData(this.state_data);
            console.log(this.cityData);
        });

      }



    }

    getStateCity(rtocode){
      var is_vallid :any = this.formRecodEdit.controls.label.status;
      if(is_vallid != "INVALID"){
        this.loaderActive = true;
        var sendData = new FormData();
       sendData.append('rtocode',rtocode);
        sendData.append('loginUserId',this.loginUserId);
       this.commonService.getStateCityData(sendData)
        .subscribe( response => {
          this.cityData = response;
          if(this.cityData.status){
            this.loaderActive = false;
            this.formRecodEdit.patchValue({
            state : this.cityData.state_id
            });
            this.cityData = this.cityData.result;
            // this.formRecodEdit.controls['state'].disable();
          }else{
            this.formRecodEdit.patchValue({
            state : ''
            });
            // this.formRecodEdit.controls['state'].enable();
            this.loaderActive = false;
          }

        });

      }

    }

  setFormData(result){
    this.formRecodEdit.controls['state'].enable();
    this.selectedstate = result.result.state_id;
    this.selectedcity = result.result.city_id;
    this.selectedRto_zone = result.result.zone_type_id;
    if(result.result.status_id =1){
      this.selectedstatus = "Active";
    }
    else{
      this.selectedstatus = "Inactive";
    }
    //this.selectedstatus = result.result.status_id;
    this.formRecodEdit.patchValue({
      id : result.result.rto_id,
      label : result.result.label,
      city : result.result.city_id,
      state : result.result.state_id,
      rto_zone : result.result.zone_type_id,
      // is_ncr : result.result.is_ncr,
      status : result.result.status_id
    });

  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show RTO Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add RTO Details";
    this.display='none';
    this.showCreateBtn = true;

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update RTO Details";
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
    sendData.append('code',this.formRecodEdit.value.code);
    sendData.append('label',this.formRecodEdit.value.label);
    sendData.append('group_code',this.formRecodEdit.value.group_code);
    sendData.append('rto_city_code',this.formRecodEdit.value.rto_city_code);
    sendData.append('city',this.formRecodEdit.value.city);
    sendData.append('state',this.formRecodEdit.value.state);
    sendData.append('rto_zone',this.formRecodEdit.value.rto_zone);
    // sendData.append('is_ncr',this.is_ncr);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.rtoUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
       this.closePopup();
       this.closeAddExpenseModal.nativeElement.click();
       Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
      }else{
        Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
      }
    });
  }

  isNcr(event){

      this.is_checked = event.target.checked;

      if(this.is_checked){

          this.is_ncr = 1;
      }

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
    sendData.append('rto_status',status);
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
      this.commonService.changeStatusByRtoId(sendData)
      .subscribe( response => {
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
