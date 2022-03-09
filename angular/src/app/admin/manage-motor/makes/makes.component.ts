import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';
@Component({
  selector: 'app-makes',
  templateUrl: './makes.component.html',
  styleUrls: ['./makes.component.css']
})
export class MakesComponent implements  OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;
  formRecodEdit: FormGroup;

  //formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  makeData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  msg_display : any;
  productData : any;
  showInputDiv = "block";
  output_result:any;
  atLeastOneRequired : any;
  makesdata : any;
  access_permission : any;
  is_isuzu  : any;
  hide_export : boolean = true;

  constructor(private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
    this.access_permission = sessionStorage.getItem("access_permission");
  }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      make : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      status : ['',Validators.required]
    });
    this.checkisuzuuser()
    this.getIndex();
    this.getMakeData();
    this.getProductData();
    this.getStatusData();
   // this.getMakeProductStatusData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
    if(this.is_isuzu==1){
      this.access_permission='read';
      this.hide_export=false;
    }
  }


  checkisuzuuser(){


  }
  successNotify(infoMsg){
    this.notifyService.success(
    'Success',
     infoMsg,
    {
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
              url : this.base_url+'admin/getmakelist',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr. No.',
              'data' : 'sno'
            },
            {
              'title' : 'Make',
              'data' : 'make'
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
            { "orderable": false, "targets": [0,3,4,5,6] }
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

  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getmakesData(sendData)
          .subscribe( response => {
            this.makesdata = response;
            if(this.makesdata.status)
            {
              this.excelService.exportAsExcelFile(this.makesdata.result, 'MakesData');
              Swal.fire(this.makesdata.message, '', "success");

            }else{
                 //alert(this.makesdata.message);
                 Swal.fire(this.makesdata.message, '', "error");
            }
          });
  }

// // .subscribe( response => {
//         this.editResult = response;
//         this.runTable();
//         if(this.editResult.status){
//           Swal.fire(this.editResult.message, '', "success");
//         }else{
//           Swal.fire (this.editResult.message,  "" ,  "error" );
//         }

//     });


  resetForm(){
      this.submitted = false;
      this.formRecodEdit.patchValue({
        id : 0,
        make : '',
        status : ''
      });

  }

  closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }

  // displayResponseMessage(){
  //  this.msg_display = 'block';
  // }

  getDataById(id){
    this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('id',id);
      this.commonService.getMakeDataById(sendData)
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

    getMakeData(){
      this.commonService.getMakeData()
        .subscribe( response => {
          this.makeData = response;
          this.makeData = this.makeData.result;
          //this.setFormData(this.state_data);
          console.log(this.makeData);
        });

    }

   getProductData(){
      this.commonService.getProductData()
        .subscribe( response => {
          this.productData = response;
          this.productData = this.productData.result;
          //this.setFormData(this.state_data);
          console.log(this.productData);
        });

    }

    getMakeProductStatusData(){
     this.commonService.getMakeProductStatusData()
        .subscribe( response => {
        this.output_result = response;
          this.productData= this.output_result.products.result;
          this.makeData= this.output_result.make.result;
          this.statusData = this.output_result.statusData.result;

        });
    }


  setFormData(result){


    this.formRecodEdit.patchValue({
      id : result.result.vehicle_make_id,
      make : result.result.make,
      status : result.result.status_id
    });

  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Make Details";
    this.display='block';
    this.msg_display = 'none';
    this.getDataById(id);

  }

  openModel(){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add make Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);
  }


  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update make Details";
    this.display='none';
    //this.msg_display = 'none';
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
    sendData.append('make',this.formRecodEdit.value.make);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.makeUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
          this.closePopup();
          this.showInputDiv = "none";
          this.closeAddExpenseModal.nativeElement.click();
          this.successNotify(this.editResult.message);
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
      }else{
          this.closePopup();
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
    sendData.append('make_status',status);
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
      this.commonService.changeStatusByMakeId(sendData)
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

  exportMastersAll(masterType){
  console.log(masterType);

}



}
