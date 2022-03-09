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
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.css']
})
export class VariantsComponent implements  OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;

  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData: any;
  productData : any;
  makeData : any;
  modelData : any;
  vehicleclassData : any;
  variantData : any;
  bodyTypeData : any;
  segmentTypeData : any;
  seatingcapacity : any;
  frameTypeData : any;
  fuelData : any;
  noofwheels : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  watt : any = 'none';
  cc : any = 'block';
  getValue : any;
  getMakeId : any;
  isDisabled : boolean = true;
  productSubCategory : any;
  
  selectedProduct: any;
  SelectedReferenceCode: any;
  selectedCC: any;
  SelectedSeatingCapacity: any;
  SelectedNoWheels: any;
  SelectedStatus: any;
  SelectedGVW : any;
  SelectedFrameType : any;
  selectedModel: any;
  selectedFuel: any;
  selectedSegment_type : any;
  frametype : any = 'block';
  gvw : any = 'block';
  bodytype : any = 'block';
  showInputDiv = "block";
  atLeastOneRequired : any;
  variantsdata :any;
  access_permission : any;
  is_isuzu  : any;
  hide_export : boolean = true;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
   }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      vehicle_id :[''],
      product : ['',Validators.required],
      make :['',Validators.required],
      model :['',Validators.required],
      variant : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),
        Validators.pattern('^[a-zA-Z0-9 \'\-]+$')]],

      body_type : ['',Validators.required],
      segment_type : ['',Validators.required],
      cc : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(), Validators.pattern("^[0-9]*$"), Validators.minLength(2),
      Validators.maxLength(4)]],
      gvw : ['',[Validators.pattern("^[0-9]*$")]],
      watt : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(), Validators.pattern("^[0-9]*$")]],
      seating_capacity : ['',Validators.required],
      fuel : ['',Validators.required],
      frame_type : ['',Validators.required],
      no_of_wheels : ['',Validators.required],
      main_reference_code : ['',Validators.required],
      ex_showroom_price : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(), Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,10})?$")]],
      status : ['',Validators.required]
    });
    this.getIndex();
    this.getProductData();
    this.getMakeData();
    this.getStatusData();
    this.getSegmentData();
    // this.getModelData();
    this.getBodyTypeData();
    this.getFrameData();
    this.getFuelData();
    // this.getVariantData();

    this.seatingcapacity = [1,2,3,4,5,6,7,8,9,10];
    this.noofwheels = [2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    if(this.is_isuzu==1){
      this.access_permission='read';
      this.hide_export=false;
    }
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {
        
        case 'product':
          this.formRecodEdit.patchValue({product : selected_value });
          this.setProductId(selected_value);
          this.getMakeDataByProductId(selected_value);
          this.setSeatingCapacityAndWheels(selected_value);
          break;
          
          case 'model':
          this.formRecodEdit.patchValue({model : selected_value });
          break;

        case 'fuel':
          this.formRecodEdit.patchValue({fuel : selected_value });
          this.ShowCcWatt(selected_value);
          break;

        case 'segment_type':
          this.formRecodEdit.patchValue({segment_type : selected_value });
          break;

      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'product':
        this.formRecodEdit.patchValue({product : '' });
        this.selectedProduct = "";
        break;

      case 'model':
        this.formRecodEdit.patchValue({model : '' });
        this.selectedModel = "";
        break;

      case 'fuel':
        this.formRecodEdit.patchValue({fuel : '' });
        this.selectedFuel = "";
        break;

        case 'segment_type':
          this.formRecodEdit.patchValue({segment_type : '' });
          this.selectedSegment_type = "";
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
    //sendData.append('loginUserId',this.loginUserId);
    this.commonService.getvariantsData(sendData)
          .subscribe( response => {
            this.variantsdata = response;
            //console.log(this.modelsdata);
           this.excelService.exportAsExcelFile(this.variantsdata, 'variantsData');
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
              url : this.base_url+'admin/getvariantlist',
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
              'title' : 'PRODUCT',
              'data' : 'productname'
            },
            {
              'title' : 'MAKE',
              'data' : 'make'
            },
            {
              'title' : 'Model',
              'data' : 'model'
            },
            {
              'title' : 'Variant',
              'data' : 'variant'
            },

            {
              'title' : 'CC',
              'data' : 'cc'
            },
            {
              'title' : 'GVW',
              'data' : 'gvw'
            },
            {
              'title' : 'Seating Capacity',
              'data' : 'seating_capacity'
            },
            {
              'title' : 'Fuel',
              'data' : 'fuel'
            },
            {
              'title' : 'No Of Wheels',
              'data' : 'no_of_wheels'
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
            { "orderable": false, "targets": [0,11,12,13,14] }
          ],
          order: [[ 13, "desc" ]]
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
      this.selectedProduct = "";
      this.SelectedReferenceCode = "";
      this.selectedCC = "";
      this.SelectedSeatingCapacity = "";
      this.SelectedNoWheels = "";
      this.SelectedStatus = "";
      this.SelectedGVW = "";
      this.SelectedFrameType = "";

      this.selectedModel = "";
      this.selectedFuel = "";
      this.selectedSegment_type = "";

      this.formRecodEdit.patchValue({
        id : 0,
        vehicle_id : 0,
        product : '',
        make : '',
        model : '',
        segment_type : '',
        body_type : '',
        variant : '',
        cc : '',
        gvw : '',
        frame_type : '',
        watt : '',
        seating_capacity : '',
        fuel : '',
        no_of_wheels : '',
        ex_showroom_price : '',
        main_reference_code : '',
        status : ''
      });

      this.frametype = 'block';
      this.gvw = 'block';
      this.bodytype = 'block';
      this.showInputDiv = "block";

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
    this.commonService.getVariantDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.getmodelData(this.editResult.result[0].make_id,this.editResult.result[0].product_type_id);
      this.setFormData(this.editResult);

    });
  }



  getStatusData(){
      this.commonService.getStatusData()
        .subscribe( response => {
          this.statusData = response;
          this.statusData = this.statusData.result;

        });

    }



    getFuelData(){
      this.commonService.getFuelData()
        .subscribe( response => {
          this.fuelData = response;
          this.fuelData = this.fuelData.result;

          console.log(this.fuelData);
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

    getMakeDataByProductId(getValue){
      var sendData = new FormData();
       sendData.append('product_id',getValue);
      this.loaderActive=true;
      this.commonService.getMakeDataByProduct(sendData)
        .subscribe( response => {
          this.makeData = response;
          this.makeData = this.makeData.result;
          this.loaderActive=false;
          //this.setFormData(this.state_data);
          console.log(this.makeData);
        });
    }

    getBodyTypeData(){
      this.commonService.getBodyTypeData()
        .subscribe( response => {
          this.bodyTypeData = response;
          this.bodyTypeData = this.bodyTypeData.result;

        });

      }

      getFrameData(){
        this.commonService.getFrameData()
          .subscribe( response => {
            this.frameTypeData = response;
            this.frameTypeData = this.frameTypeData.result;

          });

      }

     getSegmentData(){
        this.commonService.getSegmentData()
          .subscribe( response => {
            this.segmentTypeData = response;
            this.segmentTypeData = this.segmentTypeData.result;

          });

      }


     ShowCcWatt(event){
      let selectElementText =event;
      // let selectElementText = event.target['options']
      // [event.target['options'].selectedIndex].text;

      if(selectElementText=='5') {

          this.watt = 'block';
          this.cc = 'none';
          this.formRecodEdit.patchValue({
          cc : 0
          });
      } else{

          this.watt = 'none';
          this.cc = 'block';
          this.formRecodEdit.patchValue({
          watt : 0
          });
      }


    }

    setProductId(productid){

      sessionStorage.setItem('product_id',productid);
      this.getValue = sessionStorage.getItem('product_id');

      var sendData = new FormData();
       sendData.append('productid',this.getValue);

      this.commonService.getProductSubCategory(sendData)
        .subscribe( response => {
          this.productSubCategory = response;
           if(this.productSubCategory.status){

             this.productSubCategory = this.productSubCategory.result[0].product_sub_category;
             console.log(this.productSubCategory);

             if(this.productSubCategory=='pvtcar' || this.productSubCategory=='twowheeler'){

                 this.frametype = 'none';
                 this.bodytype = 'none';
                 this.gvw = 'none';

                 this.formRecodEdit.patchValue({
                  body_type : 0,
                  gvw : 0,
                  frame_type : 0
                  });
             }

            if(this.productSubCategory=='pccv'){

                 this.gvw = 'none';
                 this.frametype = 'block';
                 this.bodytype = 'block';

                 this.formRecodEdit.patchValue({
                  gvw : 0,
                  frame_type : '',
                  body_type : ''

                  });
             }

            if(this.productSubCategory=='gccv'){

                 this.gvw = 'block';
                 this.frametype = 'block';
                 this.bodytype = 'block';

                 this.formRecodEdit.patchValue({
                  gvw : '',
                  body_type : '',
                  frame_type : ''

                  });
             }
            if(this.productSubCategory=='commercial'){

                 this.gvw = 'block';
                 this.frametype = 'block';
                 this.bodytype = 'block';

                 this.formRecodEdit.patchValue({
                  gvw : '',
                  body_type : '',
                  frame_type : ''

                  });
             }

          }else{
           this.productSubCategory = [];
           this.loaderActive = false;
          //Swal.fire (this.editResult.message,  "" ,  "error" );
          }


          this.loaderActive = false;
          //this.setFormData(this.state_data);

        });

    }



    getmodelDataByMakeId(makeid){
       this.loaderActive = true;
       sessionStorage.setItem('make_id',makeid);
       this.getValue = sessionStorage.getItem('product_id');
       var sendData = new FormData();
       sendData.append('makeid',makeid);
       sendData.append('productid',this.getValue);

      this.commonService.getModelDataByMakeId(sendData)
        .subscribe( response => {
          this.modelData = response;
           if(this.modelData.status){
           this.modelData = this.modelData.result;
           this.loaderActive = false;
          }else{
           this.modelData = [];
           this.loaderActive = false;
          //Swal.fire (this.editResult.message,  "" ,  "error" );
          }


          this.loaderActive = false;
          //this.setFormData(this.state_data);
          console.log(this.modelData);
        });

    }


    getVariantDataByModelId(modelid){

       this.getMakeId = sessionStorage.getItem('make_id');
       var sendData = new FormData();
       sendData.append('modelid',modelid);
       sendData.append('makeid',this.getMakeId);

      this.commonService.getVariantDataByModelId(sendData)
        .subscribe( response => {
          this.variantData = response;
           if(this.variantData.status){
           this.variantData = this.variantData.result;
           this.loaderActive = false;
          }else{
           this.variantData = [];
           this.loaderActive = false;
          //Swal.fire (this.editResult.message,  "" ,  "error" );
          }


          this.loaderActive = false;
          //this.setFormData(this.state_data);
          console.log(this.variantData);
        });

    }

   getmodelData(makeid,productid){

       var sendData = new FormData();
       sendData.append('makeid',makeid);
       sendData.append('productid',productid);

      this.commonService.getModelDataByMakeId(sendData)
        .subscribe( response => {
          this.modelData = response;
           if(this.modelData.status){
           this.modelData = this.modelData.result;
           this.loaderActive = false;
          }else{
           this.modelData = [];
           this.loaderActive = false;
          //Swal.fire (this.editResult.message,  "" ,  "error" );
          }


          this.loaderActive = false;
          //this.setFormData(this.state_data);
          console.log(this.modelData);
        });

    }



  setFormData(result){
    if(result.result[0].fuelname =='electric'){
       this.watt = 'block';
       this.cc = 'none';

    }else{

       this.watt = 'none';
       this.cc = 'block';

    }

    if(result.result[0].category =='pvtcar' || result.result[0].category =='twowheeler'){

           this.frametype = 'none';
           this.bodytype = 'none';
           this.gvw = 'none';

     }

     if(result.result[0].category =='pccv'){

          this.gvw = 'none';
          this.frametype = 'block';
          this.bodytype = 'block';

     }

     if(result.result[0].category =='gccv'){

          this.gvw = 'block';
          this.frametype = 'block';
          this.bodytype = 'block';

     }

this.selectedProduct = result.result[0].product_type_id;
this.selectedModel = result.result[0].model_id;
this.selectedFuel = result.result[0].fuel_id;
this.selectedSegment_type = result.result[0].segment_type_id;
this.SelectedReferenceCode = result.result[0].main_reference_code;
this.SelectedSeatingCapacity = result.result[0].seating_capacity;
this.SelectedNoWheels = result.result[0].no_of_wheels;
this.SelectedStatus = result.result[0].status_id;
this.SelectedGVW = result.result[0].gvw;
this.selectedCC = result.result[0].cc;
this.SelectedFrameType = result.result[0].frame_type_id;
//this.noofwheels = result.result[0].no_of_wheels;
this.loaderActive = true;
    setTimeout(() => {
          this.formRecodEdit.patchValue({
            id : result.result[0].vehicle_variant_id,
            vehicle_id : result.result[0].vehicle_master_id,
            product : result.result[0].product_type_id,
            make : result.result[0].make_id,
            model : result.result[0].model_id,
            variant : result.result[0].variant,
            segment_type : result.result[0].segment_type_id,
            body_type : result.result[0].body_type_id,
            ex_showroom_price : result.result[0].ex_showroom_price,
            cc : result.result[0].cc,
            gvw : result.result[0].gvw,
            watt : result.result[0].watt,
            seating_capacity : result.result[0].seating_capacity,
            fuel : result.result[0].fuel_id,
            frame_type : result.result[0].frame_type_id,
            no_of_wheels : result.result[0].no_of_wheels,
            main_reference_code: result.result[0].main_reference_code,
            status : result.result[0].status_id
          });
    this.loaderActive = false;
    }, 4000);  
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Variant Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Variant Details";
    this.display='none';
    this.showCreateBtn = true;
    this.formRecodEdit.controls['product'].enable();
    this.formRecodEdit.controls['make'].enable();
    this.formRecodEdit.controls['model'].enable();
    // this.getDataById(id);

  }


  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Variant Details";
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
    sendData.append('vehicle_id',this.formRecodEdit.value.vehicle_id);
    sendData.append('product',this.formRecodEdit.value.product);
    sendData.append('make',this.formRecodEdit.value.make);
    sendData.append('model',this.formRecodEdit.value.model);
    sendData.append('variant',this.formRecodEdit.value.variant);
    sendData.append('segment_type',this.formRecodEdit.value.segment_type);
    sendData.append('body_type',this.formRecodEdit.value.body_type);
    sendData.append('ex_showroom_price',this.formRecodEdit.value.ex_showroom_price);
    sendData.append('cc',this.formRecodEdit.value.cc);
    sendData.append('gvw',this.formRecodEdit.value.gvw);
    sendData.append('watt',this.formRecodEdit.value.watt);
    sendData.append('seating_capacity',this.formRecodEdit.value.seating_capacity);
    sendData.append('fuel',this.formRecodEdit.value.fuel);
    sendData.append('no_of_wheels',this.formRecodEdit.value.no_of_wheels);
    sendData.append('frame_type',this.formRecodEdit.value.frame_type);
    sendData.append('main_reference_code',this.formRecodEdit.value.main_reference_code);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);


    this.commonService.variantUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopupSuccess();
        this.showInputDiv = "none";
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
    sendData.append('variant_status',status);
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
      this.commonService.changeStatusByVariantId(sendData)
      .subscribe( response => {
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

  setSeatingCapacityAndWheels(selected_value)
  {
    if(selected_value == 2)
    {
      this.formRecodEdit.patchValue({seating_capacity : 2 });
      this.formRecodEdit.patchValue({no_of_wheels : 2 });
    }
    else
    {
      this.formRecodEdit.patchValue({seating_capacity : '' });
      this.formRecodEdit.patchValue({no_of_wheels : '' });
    }
  }

}
