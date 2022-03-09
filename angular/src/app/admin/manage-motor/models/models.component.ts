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
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements  OnInit {
  mainJsPath = environment.mainJsPath;
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  loginUserId : any;
  editResult : any;
  is_three_wheeler : any = 0;
  is_checked : any;
  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  productData : any;
  makeData : any;
  statusData : any;
  modelData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  getValue : any;
  output_result:any;
  atLeastOneRequired : any;
  showInputDiv = "block";
  selectedProduct : any;
  selectedMake : any;
  selectedStatus:any;
  modelsdata : any;
  Createdat :any;
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
      model : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z0-9 \'\-]+$')]],
      make : ['1',[Validators.required]],
      product : ['',[Validators.required]],
      is_three_wheeler : [''],
      status : ['',[Validators.required]]
    });
    this.getIndex();

    this.getProductModelStatus();

    console.log("loginUserId:-"+this.loginUserId);

    this.formRecodEdit.patchValue({make : 1 });
    if(this.is_isuzu==1){
      this.access_permission='read';
      this.hide_export=false;
    }
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("form_control_name "+form_control_name);
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {
        case 'product':
          this.setProductId(selected_value);
        this.formRecodEdit.patchValue({product : selected_value });
          break;

        case 'make':
          this.getmodelDataByMakeId(selected_value);
          this.formRecodEdit.patchValue({make : selected_value });
          break;

        case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
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

      case 'make':
          this.formRecodEdit.patchValue({make : '' });
          this.selectedMake = "";
          break;

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

  errorNotify(infoMsg){
    this.notifyService.error(
      'Error',
      infoMsg,
     {
         position:['top','right'],
         timeOut: 5000,
         showProgressBar: true,
         animate: 'fade',
     }
     );
  }

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getModelsData(sendData)
          .subscribe( response => {
            this.modelsdata = response;

            if(this.modelsdata.status)
            {
              this.excelService.exportAsExcelFile(this.modelsdata.result, 'ModelData');
              Swal.fire(this.modelsdata.message, '', "success");
           
            }else{
                 Swal.fire(this.modelsdata.message, '', "error");
            }

           
          });




  }
  getIndex(){
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,

          'ajax' : {
              url : this.base_url+'admin/getmodellist',
              type : 'POST',
              data: {
                "loginUserId": this.loginUserId,
              },

              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'sno'
            },
            {
              'title' : 'Model',
              'data' : 'model'
            },
            {
              'title' : 'Make',
              'data' : 'make'
            },
            {
              'title' : 'Product Name',
              'data' : 'product_name'
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
              'title' : 'Created By',
              'data' : 'created_by'
            },
            {
              'title' : 'Updated By',
              'data' : 'updated_by'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],
          columnDefs: [
            { "orderable": false, "targets": [0,5,6,7,8] }
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
      this.selectedProduct = "";
      this.selectedMake = "";
      this.selectedStatus = "";


      this.formRecodEdit.patchValue({
        id : 0,
        product : '',
        make : '1',
        model : '',
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
    this.commonService.getModelDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.setFormData(this.editResult);
      console.log(this.editResult);
    });
  }


    getProductModelStatus(){
      this.commonService.getProductModelStatus()
        .subscribe( response => {
        this.output_result = response;
        this.productData = this.output_result.products;
        this.makeData = this.output_result.makes;
        this.statusData = this.output_result.statusData;

        console.log(this.makeData);
        console.log(this.productData);
        console.log(this.statusData);


        });

    }


   setProductId(productid){

      sessionStorage.setItem('product_id',productid);
      this.getValue = sessionStorage.getItem('product_id');
      console.log(this.getValue );

    }

   getmodelDataByMakeId(makeid){

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



  setFormData(result){
    this.selectedProduct = result.result.product_type_id;
    this.selectedMake = result.result.make_id;
    this.selectedStatus = result.result.make_id;

    this.formRecodEdit.patchValue({
      id : result.result.vehicle_model_id,
      model : result.result.model,
      make : result.result.make_id,
      product : result.result.product_type_id,
      is_three_wheeler : result.result.is_three_wheeler,
      status : result.result.status_id
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
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Model Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);
    this.selectedMake = "";
    this.formRecodEdit.patchValue({make : 1 });

  }


  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Model Details";
    this.display='none';
    this.getDataById(id);

  }

  submitForm(){
    console.log(this.formRecodEdit);
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('id',this.formRecodEdit.value.id);
    sendData.append('model',this.formRecodEdit.value.model);
    sendData.append('product',this.formRecodEdit.value.product);
    sendData.append('make',this.formRecodEdit.value.make);
    sendData.append('is_three_wheeler',this.is_three_wheeler);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.modelUpdate(sendData)
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

   isThreeWheeler(event){

      this.is_checked = event.target.checked;

      if(this.is_checked){

          this.is_three_wheeler = 1;
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
    sendData.append('model_status',status);
    sendData.append('loginUserId',this.loginUserId);
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
      this.commonService.changeStatuseByModelId(sendData)
      .subscribe( response => {
        this.editResult = response;
        this.runTable();
        if(this.editResult.status){
         // this.responseMsg = this.editResult.message;
          Swal.fire(this.editResult.message, '', "success");
        }else{
          //this.responseMsg = this.editResult.message;
          Swal.fire (this.editResult.message,  "" ,  "error" );
        }

    });
    }
  });

  }

}
