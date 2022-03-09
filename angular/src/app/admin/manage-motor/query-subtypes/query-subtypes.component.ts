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

@Component({
  selector: 'app-query-subtypes',
  templateUrl: './query-subtypes.component.html',
  styleUrls: ['./query-subtypes.component.css']
})
export class QuerySubTypesComponent implements  OnInit {
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
  queryData : any;
  deptData : any;
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
  tat_list :any;
  access_permission: any;
  constructor(private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("adminUserId");    
    this.getIndex();
    this.getStatusData();
    this.getQueryTypes();
    this.getDepartments();

    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      qtm_id : ['',Validators.required],
      // query_sub_type : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      query_sub_type : ['',[Validators.required,Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]],
      dept_id : ['',Validators.required],
      tat : ['',[Validators.required]],
      status : ['',Validators.required]
    });

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
    console.log('test query sub types..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getQuerySubTypesList',
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
              'title' : 'Query Sub Type',
              'data' : 'query_sub_type_name'
            },
            {
              'title' : 'Query Type',
              'data' : 'query_type_name'
            },
            {
              'title' : 'Department',
              'data' : 'dept_name'
            },
            {
              'title' : 'TAT (hrs/days)',
              'data' : 'tat'
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
            "targets": [0,6,7,8,9],
            "orderable": false
            },
            // {
            //   "targets": 1,
            //   "orderable": false
            //   }
            ],
            order: [[ 1, "desc" ]]

      };
  }

  openModel(){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Query Sub Type";
    this.display='none';
    this.showCreateBtn = true;
    // this.getDataById(id);
  }

  resetForm(){
      this.submitted = false;
      this.formRecodEdit.patchValue({
        id : 0,
        qtm_id : '',
        query_sub_type : '',
        dept_id : '',
        tat : '',
        status : ''
      });
  }

  closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
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

  getQueryTypes(){
    this.commonService.getQueryTypes()
      .subscribe( response => {
        this.queryData = response;
        this.queryData = this.queryData.result;
        //this.setFormData(this.state_data);
        console.log(this.queryData);
    });
  }

  getDepartments(){
    this.commonService.getDepartments()
      .subscribe( response => {
        this.deptData = response;
        this.deptData = this.deptData.result;
        //this.setFormData(this.state_data);
        console.log(this.deptData);
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
        if (event.target.hasAttribute("view-active-id")) {
          this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
    });
  }

  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('query_sub_type_status',status);
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
        this.commonService.changeStatusByQuerySubTypeId(sendData)
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

  submitForm(){
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('id',this.formRecodEdit.value.id);
    sendData.append('query_type_id',this.formRecodEdit.value.qtm_id);
    sendData.append('name',this.formRecodEdit.value.query_sub_type);
    sendData.append('department_id',this.formRecodEdit.value.dept_id);
    sendData.append('tat',this.formRecodEdit.value.tat);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.query_subTypeUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
          this.closePopup();
          this.showInputDiv = "none";
          this.closeAddExpenseModal.nativeElement.click();
          // this.successNotify(this.editResult.message);
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
          Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
      }else{
          this.closePopup();
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
          Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
      }
    });
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Query Type Details";
    this.display='block';
    this.msg_display = 'none';
    this.getDataById(id);
  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getQuerySubTypeId(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.setFormData(this.editResult);
      console.log(this.editResult);
    });
  }

  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Query Sub Type Details";
    this.display='none';
    //this.msg_display = 'none';
    this.getDataById(id);
  }

  
  setFormData(result){
    this.formRecodEdit.patchValue({
      id : result.result.query_sub_type_id,
      qtm_id : result.result.query_type_id,
      query_sub_type : result.result.name,
      dept_id : result.result.department_id,
      tat : result.result.tat,
      status : result.result.status_id
    });
  }


}
