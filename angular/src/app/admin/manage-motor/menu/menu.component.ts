import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements  OnInit {
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
  submitted : boolean = false;   
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;


  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      make : ['',Validators.required],
      status : ['',Validators.required]
    });
    this.getIndex();
    this.getStatusData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
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
              url : this.base_url+'admin/getmenulist',
              type : 'POST',
              data: {                
              "loginUserId": this.loginUserId,
              
          },
              dataType: "json",
          },  
          columns: [    
            {   
              'title' : 'ID',
              'data' : 'id' 
            },
            {   
              'title' : 'Menu',
              'data' : 'menu' 
            },
            {   
              'title' : 'Menu Code',
              'data' : 'menu_code'  
            },
                    
            {  
              'title' : 'Menu Url',
              'data' : 'menu_url'
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
              'title' : 'Updated',
              'data' : 'updated_at'
            },

            {  
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],
          "columnDefs": [ {
            "targets": 7,
            "orderable": false
            },
            // {
            //   "targets": 1,
            //   "orderable": false
            //   } 
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

  getDataById(id){
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getMenuDataById(sendData)
    .subscribe( response => {
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
    this.getDataById(id);

  }

  openMake(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add make Details";
    this.display='none'; 
    this.showCreateBtn = true;
    // this.getDataById(id);

  }

    
  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update make Details";
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
    sendData.append('make',this.formRecodEdit.value.make);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    
    this.commonService.menuUpdate(sendData)
    .subscribe(response =>{
              
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopup();
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
    sendData.append('menu_status',status);
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
      this.commonService.changeStatusByMenuId(sendData)
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
