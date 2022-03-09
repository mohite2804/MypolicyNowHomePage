import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;

  formAccess : any;
  accessdisplay : any = "none";
  submittedAccess : boolean = false;

  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  productData : any;
  makeData : any;
  modelData : any;
  variantData : any;
  fuelData : any;
  vehicleclassData : any;
  bodyTypeData : any;
  frameTypeData : any;
  segmentTypeData : any;
  statusData : any;
  seatingcapacity : any;
  noofwheels : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  existing_ex_showroom_price: any;
  output_result:any;
  atLeastOneRequired : any;
  vehiclesdata : any;
access_permission: any;
is_isuzu  : any;
  hide_export : boolean = true;
  constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
   }

  ngOnInit(): void {

    this.formRecodEdit = this.formBuilder.group({
        id :[''],
        product : ['',Validators.required],
        make :['',Validators.required],
        model : ['',Validators.required],
        variant : ['',Validators.required],
        fuel : ['',Validators.required],
        vehicle_class_id : ['',Validators.required],
        cc : ['',[
          Validators.required,
          Validators.pattern("^[1-9][0-9]*$"),
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero()
          ]
        ],

        seating_capacity : [''],

        gvw : ['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern("^[1-9][0-9]*$")
        ]],

        watt : ['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern("^[1-9][0-9]*$")
        ]],
        no_of_wheels : ['',Validators.required],
        main_reference_code : ['',Validators.required],
        body_type : ['',Validators.required],
        frame_type : ['',Validators.required],
        segment_type : ['',Validators.required],
        ex_showroom_price : ['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern("^-?[1-9][0-9]\\d*(\\.\\d{1,10})?$")]],
        status : ['',Validators.required]

      });

      this.formAccess = this.formBuilder.group({
        vehicle_id :['',Validators.required],
        new_ex_showroom_price :['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern("^-?[1-9][0-9]\\d*(\\.\\d{1,10})?$")]]
      });
      
    this.getIndex();
    //this.getProductData();
    //this.getMakeData();
    //this.getModelData();
    //this.getVariantData();
    //this.getFuelData();
    //this.getVehicleClassData();
    //this.getBodyTypeData();
   // this.getFrameData();
   // this.getSegmentData();
   // this.getStatusData();
    this.getAddVehicleDetails();
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.seatingcapacity = [1,2,3,4,5,6,7,8,9,10];
    this.noofwheels = [2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    if(this.is_isuzu==1){
      this.access_permission='read';
      this.hide_export=false;
    }
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
              url : this.base_url+'admin/getvehiclelist',
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
              'title' : 'Vehicle',
              'data' : 'vehicle_cleaned'
            },
            {
              'title' : 'Make',
              'data' : 'make_cleaned'
            },
            {
              'title' : 'Model',
              'data' : 'model_cleaned'
            },
            {
              'title' : 'Variant',
              'data' : 'variant_cleaned'
            },
            {
              'title' : 'Ex Showroom Price',
              'data' : 'ex_showroom_price'
            },
            {
              'title' : 'Fuel',
              'data' : 'fuel'
            },
            {
              'title' : 'CC',
              'data' : 'cc'
            },
            {
              'title' : 'Seating Capacity',
              'data' : 'seating_capacity'
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
            { "orderable": false, "targets": [0,8,9,10,11,12] }
          ],
          "order": [[ 1, "desc" ]]
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
        if (event.target.hasAttribute("vehicle-master-id")) {
          this.openAccessPopup(event.target.getAttribute("vehicle-master-id"),event.target.getAttribute("vehicle-exsinting_price"));
        }
    });
  }

  
  openAccessPopup(vehicle_id,exsinting_price){
     this.resetAccessForm();
     this.accessdisplay='block';
     this.existing_ex_showroom_price=exsinting_price;
     this.formAccess.patchValue({
      vehicle_id : vehicle_id
     });
   }
 
   closeAccessForm(){
     this.accessdisplay='none';
   }
 
   resetAccessForm(){
     this.submittedAccess = false;
     this.formAccess.patchValue({
      vehicle_id : 0,
      new_ex_showroom_price : '',
     });
   }
 
   submitAccessForm(){
     this.submittedAccess = true;
     if(this.formAccess.invalid){
       return;
     }
     this.loaderActive = true;
     const sendData = new FormData();
     sendData.append('vehicle_id',this.formAccess.value.vehicle_id);
     sendData.append('new_ex_showroom_price',this.formAccess.value.new_ex_showroom_price);
     sendData.append('loginUserId',this.loginUserId);
     console.log(sendData);
     
     this.commonService.Updateshowroom_price(sendData)
     .subscribe(response =>{
 
       this.loaderActive = false;
       var result : any  = response;
       this.closeAccessForm();
       if(result.status){
           this.runTable();
           Swal.fire(result.message, '', "success");
       }else{
         Swal.fire(result.message, '', "error");
       }
     });
   }

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getVehiclesData(sendData)
          .subscribe( response => {
            this.vehiclesdata = response;

          if(this.vehiclesdata.status)
            {
              this.excelService.exportAsExcelFile(this.vehiclesdata.result, 'VehiclesData');
              Swal.fire(this.vehiclesdata.message, '', "success");
           
            }else{
                 //alert(this.vehiclesdata.message);
                 Swal.fire(this.vehiclesdata.message, '', "error");
            }
            //console.log(this.vehiclesdata);
           
          });
  }


  resetForm(){
      this.submitted = false;
      this.formRecodEdit.patchValue({
        id : 0,
        product : '',
        make : '',
        model : '',
        variant : '',
        fuel : '',
        vehicle_class_id : '',
        cc : '',
        seating_capacity : '',
        gvw : '',
        watt : '',
        no_of_wheels : '',
        main_reference_code : '',
        body_type : '',
        frame_type : '',
        segment_type : '',
        ex_showroom_price : '',
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
    this.commonService.getVehicleDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.setFormData(this.editResult);
      console.log(this.editResult);
    });
  }

  getProductData(){
      this.commonService.getProductData()
        .subscribe( response => {
          this.productData = response;
          this.productData = this.productData.result;
          console.log(this.productData);
        });

    }

   getMakeData(){
      this.commonService.getMakeData()
        .subscribe( response => {
          this.makeData = response;
          this.makeData = this.makeData.result;
          //this.setFormData(this.state_data);
          console.log(this.makeData);
        });

    }

    getModelData(){
      this.commonService.getModelData()
        .subscribe( response => {
          this.modelData = response;
          this.modelData = this.modelData.result;
          //this.setFormData(this.state_data);
          console.log(this.modelData);
        });

    }
     getVariantData(){
      this.commonService.getVariantData()
        .subscribe( response => {
          this.variantData = response;
          this.variantData = this.variantData.result;
          //this.setFormData(this.state_data);
          console.log(this.variantData);
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

    getVehicleClassData(){
      this.commonService.getVehicleClassData()
        .subscribe( response => {
          this.vehicleclassData = response;
          this.vehicleclassData = this.vehicleclassData.result;
          //this.setFormData(this.state_data);
          console.log(this.vehicleclassData);
        });

    }

     getBodyTypeData(){
        this.commonService.getBodyTypeData()
          .subscribe( response => {
            this.bodyTypeData = response;
            this.bodyTypeData = this.bodyTypeData.result;
            //this.setFormData(this.state_data);
            console.log(this.bodyTypeData);
          });

      }

      getFrameData(){
        this.commonService.getFrameData()
          .subscribe( response => {
            this.frameTypeData = response;
            this.frameTypeData = this.frameTypeData.result;
            //this.setFormData(this.state_data);
            console.log(this.frameTypeData);
          });

      }

      getSegmentData(){
        this.commonService.getSegmentData()
          .subscribe( response => {
            this.segmentTypeData = response;
            this.segmentTypeData = this.segmentTypeData.result;
            //this.setFormData(this.state_data);
            console.log(this.segmentTypeData);
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

    getAddVehicleDetails(){
        this.commonService.getAddVehicleDetails()
        .subscribe( response => {
        this.output_result = response;

          this.productData= this.output_result.product.result;
          this.makeData= this.output_result.make.result;
          this.modelData = this.output_result.model.result;
           this.variantData= this.output_result.variant.result;
          this.fuelData= this.output_result.fuel.result;
          this.vehicleclassData = this.output_result.vehicleclass.result;
           this.bodyTypeData= this.output_result.bodyType.result;
          this.frameTypeData= this.output_result.frameType.result;
          this.statusData = this.output_result.statusData.result;
           this.segmentTypeData= this.output_result.segment.result;

        });
      }


  setFormData(result){
    this.formRecodEdit.patchValue({
      id : result.result.vehicle_master_id,
      product : result.result.product_type_id,
      make : result.result.make_id,
      model : result.result.model_id,
      variant : result.result.variant_id,
      fuel : result.result.fuel_id,
      vehicle_class_id : result.result.vehicle_class_id,
      cc : result.result.cc,
      seating_capacity : result.result.seating_capacity,
      gvw : result.result.gvw,
      watt : result.result.watt,
      no_of_wheels : result.result.no_of_wheels,
      main_reference_code : result.result.main_reference_code,
      body_type : result.result.body_type_id,
      frame_type : result.result.frame_type_id,
      segment_type : result.result.segment_type_id,
      ex_showroom_price : result.result.ex_showroom_price,
      status : result.result.status_id
    });

  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Vehicle Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Vehicle Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Vehicle Details";
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
    sendData.append('product',this.formRecodEdit.value.product);
    sendData.append('make',this.formRecodEdit.value.make);
    sendData.append('model',this.formRecodEdit.value.model);
    sendData.append('variant',this.formRecodEdit.value.variant);
    sendData.append('fuel',this.formRecodEdit.value.fuel);
    sendData.append('vehicle_class_id',this.formRecodEdit.value.vehicle_class_id);
    sendData.append('cc',this.formRecodEdit.value.cc);
    sendData.append('seating_capacity',this.formRecodEdit.value.seating_capacity);
    sendData.append('gvw',this.formRecodEdit.value.gvw);
    sendData.append('watt',this.formRecodEdit.value.watt);
    sendData.append('no_of_wheels',this.formRecodEdit.value.no_of_wheels);
    sendData.append('main_reference_code',this.formRecodEdit.value.main_reference_code);
    sendData.append('body_type',this.formRecodEdit.value.body_type);
    sendData.append('frame_type',this.formRecodEdit.value.frame_type);
    sendData.append('segment_type',this.formRecodEdit.value.segment_type);
    sendData.append('ex_showroom_price',this.formRecodEdit.value.ex_showroom_price);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.vehicleUpdate(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopupSuccess();
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
      }else{
       this.closePopupFailed();
       this.msgClass = "alert-danger";
       this.responseMsg = this.editResult.message;
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
    sendData.append('vehicle_status',status);
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
      this.commonService.changeStatusByVehicleId(sendData)
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

}
