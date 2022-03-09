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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;

  is_motor_vehicle : any = 1;
  is_checked : any;
  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  productAliasData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  // icon_src : any;
  // image_src : any;
  // product_type_src : any;
  responseMsg : any;
  msgClass: any;
  productData : any;
  ismotorvehicle : boolean = true;
  output_result:any;

  selectedAlias_product:any;
  selectedGroup_code:any;
  selectedSub_group_code:any;
  selectedGroup_lable:any;
  selectedStatus:any;

  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";

  validation_for_sub_products :any = "^[a-zA-Z][a-zA-Z0-9 \) \( \,\-\/]*[a-zA-Z0-9\)\(\,\-\/]$";
  atLeastOneRequired : any;
  productsdata :any;
  access_permission : any;
  
  accessdisplay : any = "block";

  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {

    this.formRecodEdit = this.formBuilder.group({
        id :[''],
        label : ['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern(this.validation_for_sub_products)
        ]],

        lable_code :['',[
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
          Validators.pattern(this.validation_for_sub_products)
        ]],

        // alias_product_type_id : ['',Validators.required],
        group_code : ['',Validators.required],
        sub_group_code : ['',Validators.required],
        group_lable : ['',Validators.required],
        is_motor_vehicle : [''],
        status : ['',Validators.required]

      });

    this.getIndex();
   // this.getStatusData();
    //this.getProductAliasData()
    //this.getProductData();
    this.getProductAliasStatus();
    this.loginUserId = sessionStorage.getItem("adminUserId");
  }


  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getProductsData(sendData)
          .subscribe( response => {
            this.productsdata = response;

            if(this.productsdata.status)
            {
              this.excelService.exportAsExcelFile(this.productsdata.result, 'ModelData');
              Swal.fire(this.productsdata.message, '', "success");
            }else{
                 Swal.fire(this.productsdata.message, '', "error");
            }

          });
  }


  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
          break;

          case 'alias_product':
          this.formRecodEdit.patchValue({alias_product : selected_value });
          break;

          case 'group_code':
          this.formRecodEdit.patchValue({group_code : selected_value });
          break;
          
          case 'sub_group_code':
          this.formRecodEdit.patchValue({sub_group_code : selected_value });
          break;
          
          case 'group_lable':
          this.formRecodEdit.patchValue({group_lable : selected_value });
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

        case 'alias_product':
        this.formRecodEdit.patchValue({alias_product : '' });
        this.selectedAlias_product = "";
        break;
        
        case 'group_code':
        this.formRecodEdit.patchValue({group_code : '' });
        this.selectedGroup_code = "";
        break;
                
        case 'sub_group_code':
        this.formRecodEdit.patchValue({sub_group_code : '' });
        this.selectedSub_group_code = "";
        break;
                
        case 'group_lable':
        this.formRecodEdit.patchValue({group_lable : '' });
        this.selectedGroup_lable = "";
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
              url : this.base_url+'admin/getproductlist',
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
              'title' : 'Product Code',
              'data' : 'code'
            },
            {
              'title' : 'Product Name',
              'data' : 'productname'
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
          "columnDefs": [ {
            "targets": [0,4,5,6,7],
            "orderable": false
            },
            // {
            //   "targets": 1,
            //   "orderable": false
            //   }
            ],
            'order': [[ 1, "desc" ]]
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
      this.selectedStatus ="";
      this.selectedAlias_product ="";
      this.selectedGroup_code = "";
      this.selectedSub_group_code="";
      this.selectedGroup_lable="";

      this.formRecodEdit.patchValue({

        id : 0,
        label : '',
        lable_code : '',
        alias_product_type_id : '',
        group_code : '',
        sub_group_code : '',
        group_lable : '',
        is_motor_vehicle : '',
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
    this.commonService.getProductDataById(sendData)
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

    getProductAliasData(){
      this.commonService.getAliasProductTypeData()
        .subscribe( response => {
          this.productAliasData = response;
          this.productAliasData = this.productAliasData.result;
          //this.setFormData(this.state_data);
          console.log(this.productAliasData);
        });
     }

    getProductData(){
      this.commonService.getProductData()
        .subscribe( response => {
          this.productData = response;
          this.productData = this.productData.result;

        });

    }

    getProductAliasStatus(){
      this.commonService.getProductAliasStatus()
        .subscribe( response => {
        this.output_result = response;

          this.productData= this.output_result.product.result;
          this.productAliasData= this.output_result.productAlias.result;
          this.statusData = this.output_result.statusData.result;

        });

    }


   setFormData(result){
     
    this.accessdisplay="none";
    this.formRecodEdit.get("lable_code").setValidators([]);
    this.formRecodEdit.get("lable_code").updateValueAndValidity();

    this.selectedAlias_product = result.result.alias_product_type_id;
    this.selectedGroup_code = result.result.group_code;
    this.selectedSub_group_code = result.result.sub_group_code;
    this.selectedGroup_lable = result.result.group_lable;
    this.selectedStatus = result.result.status_id;

    this.formRecodEdit.patchValue({
      id : result.result.product_type_id,
      label : result.result.label,
      lable_code : result.result.lable_code,
      alias_product_type_id : result.result.alias_product_type_id,
      group_code : result.result.group_code,
      sub_group_code : result.result.sub_group_code,
      group_lable : result.result.group_lable,
      is_motor_vehicle : result.result.is_motor_vehicle,
      status : result.result.status_id,

    });

  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Product Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.resetForm();
   this.formRecodEdit.patchValue({
      is_motor_vehicle : true
    });
    this.btnEditSubmit = true;
    this.popupTitle = "Add Product Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Product Details";
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
    sendData.append('label',this.formRecodEdit.value.label);
    sendData.append('lable_code',this.formRecodEdit.value.lable_code);
    // sendData.append('alias_product_type_id',this.formRecodEdit.value.alias_product_type_id);
    sendData.append('group_code',this.formRecodEdit.value.group_code);
    sendData.append('sub_group_code',this.formRecodEdit.value.sub_group_code);
    sendData.append('group_lable',this.formRecodEdit.value.group_lable);
    sendData.append('is_motor_vehicle',this.is_motor_vehicle);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.productUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopupSuccess();
        this.closeAddExpenseModal.nativeElement.click();
        this.successNotify(this.editResult.message);
        this.msgClass = "alert-success";
        this.responseMsg = this.editResult.message;
      }else{
       this.closePopupFailed();
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message;
      }
    });
  }

  isMotorVehicle(event){

      this.is_checked = event.target.checked;

      if(this.is_checked){

          this.is_motor_vehicle = 1;
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
    sendData.append('product_status',status);
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
      this.commonService.changeStatusByProductId(sendData)
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
