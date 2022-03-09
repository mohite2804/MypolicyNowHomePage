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
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.css']
})
export class PincodesComponent implements  OnInit {
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
  stateData : any;
  cityData : any;
  districtData : any;
  villageData : any;
  areaData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  stateid : any;
  output_result:any;

  selectedState:any;
  selectedCity:any;
  selectedDistrict:any;
  selectedVillage:any;
  selectedArea:any;
  atLeastOneRequired : any;
  pincodesdata : any;
  statusData : any;
  access_permission : any;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {

        this.formRecodEdit = this.formBuilder.group({
        id :[''],
        state : ['',[Validators.required]],
        city :['',[Validators.required]],
        district : [''],
        village : [''],
        area : [''],
        pin_code : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern("^[0-9]*$"),Validators.required, Validators.minLength(6),
       Validators.maxLength(6)]],
       status : ['',Validators.required]

      });

    this.getIndex();
    this.getStatusData();
    this.getStateDistVillageArea();
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
          
          case 'district':
          this.formRecodEdit.patchValue({district : selected_value });
          break;
          
          case 'village':
          this.formRecodEdit.patchValue({village : selected_value });
          break;
          
          case 'area':
          this.formRecodEdit.patchValue({area : selected_value });
          break;
          
      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'state':
        this.formRecodEdit.patchValue({state : '' });
        this.selectedState = "";
        break;

        case 'city':
        this.formRecodEdit.patchValue({city : '' });
        this.selectedCity = "";
        break;
        
        case 'district':
        this.formRecodEdit.patchValue({district : '' });
        this.selectedDistrict = "";
        break;
        
        case 'village':
        this.formRecodEdit.patchValue({village : '' });
        this.selectedVillage = "";
        break;
                
        case 'area':
        this.formRecodEdit.patchValue({area : '' });
        this.selectedArea = "";
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
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getpincodelist',
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
              'title' : 'State Name',
              'data' : 'statename'
            },
            {
              'title' : 'District Name',
              'data' : 'districtname'
            },
            {
              'title' : 'City Name',
              'data' : 'cityname'
            },
            {
              'title' : 'Village Name',
              'data' : 'villagename'
            },
            {
              'title' : 'Pin Code',
              'data' : 'pin_code'
            },
            {
              'title' : 'Area Name',
              'data' : 'area_name'
            },
            {
              'title' : 'Created At',
              'data' : 'created_at'
            },
            {
              'title' : 'Status At',
              'data' : 'status'
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
          this.changeStatus(event.target.getAttribute("view-active-id"),'2');
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),'1');
        }
    });
  }

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getPincodesData(sendData)
          .subscribe( response => {
            this.pincodesdata = response;

            if(this.pincodesdata.status)
            {
              this.excelService.exportAsExcelFile(this.pincodesdata.result, 'PincodesData');
              Swal.fire(this.pincodesdata.message, '', "success");
           
            }else{
                 Swal.fire(this.pincodesdata.message, '', "error");
            }
          });
  }


  resetForm(){
      this.submitted = false;

      this.selectedState ="";
      this.selectedCity ="";
      this.selectedDistrict ="";
      this.selectedVillage ="";
      this.selectedArea ="";

      this.formRecodEdit.patchValue({
        id : 0,
        state : '',
        city : '',
        district : '',
        village : '',
        area : '',
        pin_code : ''
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
    this.commonService.getPinCodeDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.getCityDataByStateId(this.editResult.result.state_id);
      this.setFormData(this.editResult);
      console.log(this.editResult);
    });
  }

  getStateData(){
    this.loaderActive = true;
      this.commonService.getStateData()
        .subscribe( response => {
          this.loaderActive = false;
          this.stateData = response;
          this.stateData = this.stateData.result;

        });
     }

   getCityDataByStateId(stateid){

    if(stateid){
      this.loaderActive = true;
       var sendData = new FormData();
       sendData.append('stateid',stateid);

      this.commonService.getCityDataByStateId(sendData)
        .subscribe( response => {
          this.loaderActive = false;
          this.cityData = response;
          this.cityData = this.cityData.result;
          this.loaderActive = false;

      });
    }


    }
    getDistrictData(){
      this.loaderActive = true;
      this.commonService.getDistrictData()
        .subscribe( response => {
          this.loaderActive = false;
          this.districtData = response;
          this.districtData = this.districtData.result;
        });
     }
    getVillageData(){
      this.loaderActive = true;
      this.commonService.getVillageData()
        .subscribe( response => {
          this.loaderActive = false;
          this.villageData = response;
          this.villageData = this.villageData.result;

        });
     }

     getAreaData(){
      this.loaderActive = true;
      this.commonService.getAreaData()
        .subscribe( response => {
          this.loaderActive = false;
          this.areaData = response;
          this.areaData = this.areaData.result;

        });
     }


    getStateDistVillageArea(){
      this.loaderActive = true;
      this.commonService.getStateDistVillageArea()
        .subscribe( response => {
          this.loaderActive = false;
          this.output_result = response;
          this.stateData = this.output_result.state;
          this.districtData = this.output_result.district;
          this.villageData = this.output_result.village;
          this.areaData = this.output_result.area;
        });
    }


  setFormData(result){
    this.selectedState = result.result.state_id;
    this.selectedCity = result.result.city_id;
    this.selectedDistrict = result.result.district_id;
    this.selectedVillage = result.result.village_id;
    this.selectedArea = result.result.area_id;

    this.formRecodEdit.patchValue({
      id : result.result.pincode_id,
      state : result.result.state_id,
      city : result.result.city_id,
      district : result.result.district_id,
      village : result.result.village_id,
      area : result.result.area_id,
      pin_code : result.result.pin_code,
      status : result.result.status_id

    });

  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Pincode Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Pincode Details";
    this.display='none';
    this.showCreateBtn = true;


  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Pincode Details";
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
    sendData.append('state',this.formRecodEdit.value.state);
    sendData.append('city',this.formRecodEdit.value.city);
    sendData.append('district',this.formRecodEdit.value.district);
    sendData.append('village',this.formRecodEdit.value.village);
    sendData.append('area',this.formRecodEdit.value.area);
    sendData.append('pin_code',this.formRecodEdit.value.pin_code);
    sendData.append('userid',this.loginUserId);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.pincodeUpdate(sendData)
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
    sendData.append('status',status);
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

      this.commonService.changeStatuseByPincodeId(sendData)
      .subscribe( response => {
        this.loaderActive = false;
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

  getStatusData(){
      this.commonService.getStatusData()
        .subscribe( response => {
          this.statusData = response;
          this.statusData = this.statusData.result;
          //this.setFormData(this.state_data);
          console.log(this.statusData);
        });
  }

}
