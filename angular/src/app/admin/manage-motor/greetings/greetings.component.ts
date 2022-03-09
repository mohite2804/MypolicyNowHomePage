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
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.css']
})

export class GreetingsComponent implements  OnInit {
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
  greeting_image : any;

  constructor(private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService) { 
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
  }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      name : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      description : ['',Validators.required],
      //image_file_name : ['',Validators.required],
      status : ['',Validators.required],
      is_top_search : ['',Validators.required],
      greeting_image : ['',Validators.required],
    });
    this.getIndex();
   // this.getMakeProductStatusData();
    this.getStatusData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
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
              url : this.base_url+'admin/getGreeting',
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
              'title' : 'Name',
              'data' : 'name'
            },            
            {
              'title' : 'Discription',
              'data' : 'discription'
            },
            {
              'title' : 'Top Search',
              'data' : 'is_top_search'
            },

            {
              'title' : 'Status',
              'data' : 'status'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],
          "columnDefs": [ 
            {"targets": 1,"orderable": true},
            {"targets": 2,"orderable": true},
            {"targets": 3,"orderable": true},
            {"targets": 4,"orderable": true},
            {"targets": 5,"orderable": true},
          ]

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



  resetForm(){
      this.submitted = false;
      this.formRecodEdit.patchValue({
        id : 0,
        name : '',
        description : '',
        greeting_image : '',
        is_top_search : '',
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
    this.commonService.getGreetingDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      console.log('response');
       if(this.editResult.result.image==''){
          this.greeting_image= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.greeting_image = this.editResult.base_url+this.editResult.result.image;
      }
      console.log(this.greeting_image);
      console.log('response');
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
 
  setFormData(result){
    this.formRecodEdit.patchValue({
      id : result.result.id,
      name : result.result.name,
      description : result.result.discription,
      is_top_search : result.result.top_search,
      status : result.result.status_id,
      greeting_image : result.result.image,
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
    this.popupTitle = "Add Greeting Details";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);
  }


  editRecord(id){
  console.log('ok');
  console.log(id);
  console.log('end ok');
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Greeting Details";
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
    sendData.append('name',this.formRecodEdit.value.name);
    sendData.append('description',this.formRecodEdit.value.description);
    sendData.append('is_top_search',this.formRecodEdit.value.is_top_search);
    sendData.append('greeting_image',this.formRecodEdit.value.greeting_image);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.greetingUpdate(sendData)
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
  uploadLogo(event){
      let file = event.target.files[0];
      
      var file_type:any = file.type;
      var file_size :any = file.size ;
      
      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.greeting_image = "";
      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.greeting_image = "";
      }else{   
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
            this.greeting_image = event.target.result;
        }
        this.formRecodEdit.patchValue({
          'greeting_image' : file
        });          
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


}
