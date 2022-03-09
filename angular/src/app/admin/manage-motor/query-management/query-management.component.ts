import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import Swal from 'sweetalert2'
import { Router } from  '@angular/router';

import { fileExtensionValidator } from './file-extension-validator.directive';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";

@Component({
  selector: 'app-query-management',
  templateUrl: './query-management.component.html',
  styleUrls: ['./query-management.component.css']
})
export class QueryManagementComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;

  display : any;
  loginUserId  : any;
  editResult : any;
  result_filter_query_sub_type : any;

  query_type_id : any;
  filterQueryTypeFilter_id : any;

  filterFormQuery : any;

  result_query_types : any;
  result_query_sub_type : any;
  result_ic_master : any;
  result_department_master : any;
  result_priority_master : any;
  result_query_status_master : any;

  formNewQuery : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  responseMsg : any;
  msgClass: any;
  modal: any;

  attachment_1_url:any;
  attachment_2_url:any;
  attachment_3_url:any;
  attachment_4_url:any;
  attachment_5_url:any;

  attachment_1_label:any = "Choose a file…";
  attachment_2_label:any = "Choose a file…";
  attachment_3_label:any = "Choose a file…";
  attachment_4_label:any = "Choose a file…";
  attachment_5_label:any = "Choose a file…";

  display_attachment_button_1 : any;
  display_attachment_button_2 : any;
  display_attachment_button_3 : any;
  display_attachment_button_4 : any;
  display_attachment_button_5 : any;
  display_attachment_button_6 : any;
  display_attachment_button_7 : any;

  display_attachment_1 : any;
  display_attachment_2 : any;
  display_attachment_3 : any;
  display_attachment_4 : any;
  display_attachment_5 : any;
  display_attachment_6 : any;
  display_attachment_7 : any;

  errMsgDescription1 : any;
  errMsgDescription2 : any;
  errMsgDescription3 : any;
  errMsgDescription4 : any;
  errMsgDescription5 : any;

  displayReassign : any;
  formReassignQuery : any;
  popupTitleReassign : any;
  currentAssignedDepartment : any;
  submittedReassign :  boolean = false;
  msgClassReassign : any;
  responseMsgReassign : any;
  btnEditSubmitReassign : boolean = false;
  re_assigned_query_no : any;
  access_permission:any;
  constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
  }

  ngOnInit(): void {

      this.formNewQuery = this.formBuilder.group({
        query_type :['',[Validators.required]],
        query_sub_type : ['',[Validators.required]],
        query_description : [''],
        policy_no : ['',[Validators.pattern("^[a-zA-Z0-9_/-]+$")]],
        insurance_company : [''],
        remarks : [''],
        priority : ['',[Validators.required]],
        attachment_1 : [''],
        attachment_1_description : [''],
        attachment_2 : [''],
        attachment_2_description : [''],
        attachment_3 : [''],
        attachment_3_description : [''],
        attachment_4 : [''],
        attachment_4_description : [''],
        attachment_5 : [''],
        attachment_5_description : ['']
      });

      this.filterFormQuery= this.formBuilder.group({
        filter_query_no : [''],
        filter_query_sub_type : [''],
        filter_query_type : [''],
        filter_assigned_department : [''],
        filter_priority : [''],
        filter_status : ['']
      });


      this.formReassignQuery= this.formBuilder.group({
        re_assigned_department : ['',[Validators.required]],
        re_assigned_remarks : ['',[Validators.required]]
      });

      this.btnEditSubmitReassign = true;

  		this.loginUserId = sessionStorage.getItem("adminUserId");
      this.getIndex();
      this.getQueryList();

      this.display_attachment_1 = 'block';
      this.display_attachment_2 = 'none';
      this.display_attachment_3 = 'none';
      this.display_attachment_4 = 'none';
      this.display_attachment_5 = 'none';
      this.display_attachment_6 = 'none';
      this.display_attachment_7 = 'none';
  }

  ngAfterViewInit(): void {
      this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("view-query-no")) {
          this.viewQueryDetails(event.target.getAttribute("view-query-no"));
        }

        if (event.target.hasAttribute("reassign-query-no")) {
          this.showReassignQueryDetails(event.target.getAttribute("reassign-query-no"));
        }
      });
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.getQueryFormData(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var result : any = response;

      this.result_query_types = result.query_types;
      this.result_ic_master = result.ic_master;
      this.result_department_master = result.department_master;
      this.result_priority_master = result.priority_master;
      this.result_query_status_master = result.query_status_master;
    });
  }

  getQueryList(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'get_query_data_list_admin',
              type : 'POST',
              data: {
                  "loginUserId": this.loginUserId
              },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Query No.',
              'data' : 'query_no'
            },
            {
              'title' : 'Query Type',
              'data' : 'query_type'
            },
            {
              'title' : 'Query Sub-Type',
              'data' : 'query_sub_type'
            },

            {
              'title' : 'Assigned By',
              'data' : 'assigned_by_name'
            },

            {
              'title' : 'Deparment To',
              'data' : 'assigned_to_name'
            },
            {
              'title' : 'TAT (Hrs/Days)',
              'data' : 'tat'
            },

            {
              'title' : 'Action Taken By',
              'data' : 'action_taken_by'
            },

            {
              'title' : 'Priority',
              'data' : 'priority_name'
            },

            {
              'title' : 'Status',
              'data' : 'status_name'
            },

            {
              'title' : 'Created On',
              'data' : 'created_at'
            },
            {
              'title' : 'Closed On',
              'data' : 'updated_at'
            },

            {
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": [0,12] }
          ],
          order: [[ 9, "desc" ]]
      };
  }

  getFilterQueryNoResult(event){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search(event.target.value).draw();
    });
  }


  selectQueryType(event){
    var query_type_id :any = event;
    if(query_type_id == 2 || query_type_id == 3 || query_type_id == 4 ){
      console.log('inn');
      this.formNewQuery.get("policy_no").setValidators([Validators.required]);
      this.formNewQuery.get("policy_no").updateValueAndValidity();

      this.formNewQuery.get("insurance_company").setValidators([Validators.required]);
      this.formNewQuery.get("insurance_company").updateValueAndValidity();
    }else{
      console.log('out');
      this.formNewQuery.get("policy_no").setValidators([]);
      this.formNewQuery.get("policy_no").updateValueAndValidity();

      this.formNewQuery.get("insurance_company").setValidators([]);
      this.formNewQuery.get("insurance_company").updateValueAndValidity();

    }
  }

  selectSubType(event){

    var sub_type_id :any = event.target.value;
    if(sub_type_id == 9){
      console.log('inn');
      this.formNewQuery.get("query_description").setValidators([Validators.required]);
      this.formNewQuery.get("query_description").updateValueAndValidity();

      this.formNewQuery.get("remarks").setValidators([Validators.required]);
      this.formNewQuery.get("remarks").updateValueAndValidity();
    }else{
      console.log('out');
      this.formNewQuery.get("query_description").setValidators([]);
      this.formNewQuery.get("query_description").updateValueAndValidity();

      this.formNewQuery.get("remarks").setValidators([]);
      this.formNewQuery.get("remarks").updateValueAndValidity();

    }
  }

  getFilterQueryTypeResult(event){
    if(event.target.value != ""){
      this.filterQueryTypeFilter_id = event.target.value;
      this.filterFormQuery.patchValue({filter_query_sub_type : '' });

      this.result_filter_query_sub_type = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('query_type_id',event.target.value);
      this.commonService.getQuerySubTypeByQueryTypeId(sendData)
      .subscribe(response => {

        var result : any  = response;
        if(result.status){
          this.result_filter_query_sub_type = result.query_sub_type;
        }

      });
    }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(2).search(event.target.value).draw();
    });
  }

  getFilterQuerySubTypeResult(event){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(3).search(event.target.value).draw();
    });
  }

  getFilterQueryAssignedDepartmentResult(event){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(4).search(event.target.value).draw();
    });
  }

  getFilterQueryPriorityResult(event){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(5).search(event.target.value).draw();
    });
  }

  getFilterQueryStatusResult(event){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(6).search(event.target.value).draw();
    });
  }

  getQuerySubTypeByQueryTypeId(event){
    if(event.target.value != ""){
      this.query_type_id = event.target.value;
      this.selectQueryType(this.query_type_id);
      this.formNewQuery.patchValue({query_sub_type : '' });
      this.result_query_sub_type = [];
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('query_type_id',event.target.value);
      this.commonService.getQuerySubTypeByQueryTypeId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_query_sub_type = result.query_sub_type;
        }

      });
    }
  }

  closePopup(){
    this.closebutton.nativeElement.click();
    this.display='none';
  }

  viewQueryDetails(query_no){
    sessionStorage.setItem('query_no', query_no);
    this.router.navigateByUrl('/admin/manage-motor/query-management-process');
  }

  showReassignQueryDetails(query_no){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('query_no',query_no);
    this.commonService.getQueryDataByQueryNo(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.currentAssignedDepartment = this.editResult.query_result.assigned_to_name;
      this.popupTitleReassign = "Reassign Query";
      this.re_assigned_query_no = this.editResult.query_result.query_no;
    });
  }

  closePopupFailed(){
    this.display='block';
  }

  openModel(){
    this.btnEditSubmit = true;
    this.popupTitle = "Submit New Query";
    this.display='none';
  }

  uploadAttachment1(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    console.log('file type '+file.type);
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.attachment_1_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.attachment_1_url = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_1_url = event.target.result;
      }
      this.attachment_1_label = file.name;
      this.formNewQuery.patchValue({
        'attachment_1' : file
      });
    }


  }

  uploadAttachment2(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    console.log('file type '+file.type);
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.attachment_2_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.attachment_2_url = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_2_url = event.target.result;
      }
      this.attachment_2_label = file.name;
      this.formNewQuery.patchValue({
        'attachment_2' : file
      });
    }


  }

  uploadAttachment3(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    console.log('file type '+file.type);
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.attachment_3_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.attachment_3_url = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_3_url = event.target.result;
      }
      this.attachment_3_label = file.name;
      this.formNewQuery.patchValue({
        'attachment_3' : file
      });
    }


  }

  uploadAttachment4(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    console.log('file type '+file.type);
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.attachment_4_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.attachment_4_url = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_4_url = event.target.result;
      }
      this.attachment_4_label = file.name;
      this.formNewQuery.patchValue({
        'attachment_4' : file
      });
    }


  }

  uploadAttachment5(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    console.log('file type '+file.type);
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.attachment_5_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.attachment_5_url = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_5_url = event.target.result;
      }
      this.attachment_5_label = file.name;
      this.formNewQuery.patchValue({
        'attachment_5' : file
      });
    }


  }


  // uploadAttachment1(event){
  //   let file = event.target.files[0];

  //  this.formNewQuery.get("attachment_1").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //  this.formNewQuery.get("attachment_1").updateValueAndValidity();

  //   this.attachment_1_url = '';
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_1_url = event.target.result;

  //       this.formNewQuery.patchValue({
  //         'attachment_1' : file
  //       });
  //     }
  //   }
  // }

  // uploadAttachment2(event){
  //   let file = event.target.files[0];

  //  this.formNewQuery.get("attachment_2").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //  this.formNewQuery.get("attachment_2").updateValueAndValidity();

  //   this.attachment_2_url = '';
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_2_url = event.target.result;

  //       this.formNewQuery.patchValue({
  //         'attachment_2' : file
  //       });
  //     }
  //   }
  // }

  // uploadAttachment3(event){
  //   let file = event.target.files[0];

  //  this.formNewQuery.get("attachment_3").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //  this.formNewQuery.get("attachment_3").updateValueAndValidity();

  //   this.attachment_3_url = '';
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_3_url = event.target.result;

  //       this.formNewQuery.patchValue({
  //         'attachment_3' : file
  //       });
  //     }
  //   }
  // }

  // uploadAttachment4(event){
  //   let file = event.target.files[0];

  //  this.formNewQuery.get("attachment_4").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //  this.formNewQuery.get("attachment_4").updateValueAndValidity();

  //   this.attachment_4_url = '';
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_4_url = event.target.result;

  //       this.formNewQuery.patchValue({
  //         'attachment_4' : file
  //       });
  //     }
  //   }
  // }

  // uploadAttachment5(event){
  //   let file = event.target.files[0];

  //  this.formNewQuery.get("attachment_5").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //  this.formNewQuery.get("attachment_5").updateValueAndValidity();

  //   this.attachment_5_url = '';
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_5_url = event.target.result;

  //       this.formNewQuery.patchValue({
  //         'attachment_5' : file
  //       });
  //     }
  //   }
  // }

  submitForm(){
    this.submitted = true;
    if(this.formNewQuery.invalid){
      return;
    }

    if(this.formNewQuery.value.attachment_1!='' && this.formNewQuery.value.attachment_1_description==''){
      this.errMsgDescription1 = "Enter attachement-1 description";
      return;
    }

    if(this.formNewQuery.value.attachment_2!='' && this.formNewQuery.value.attachment_2_description==''){
      this.errMsgDescription2 = "Enter attachement-2 description";
      return;
    }

    if(this.formNewQuery.value.attachment_3!='' && this.formNewQuery.value.attachment_3_description==''){
      this.errMsgDescription3 = "Enter attachement-3 description";
      return;
    }

    if(this.formNewQuery.value.attachment_4!='' && this.formNewQuery.value.attachment_4_description==''){
      this.errMsgDescription4 = "Enter attachement-4 description";
      return;
    }

    if(this.formNewQuery.value.attachment_5!='' && this.formNewQuery.value.attachment_5_description==''){
      this.errMsgDescription5 = "Enter attachement-5 description";
      return;
    }

    this.loaderActive = true;

    const sendData = new FormData();

    sendData.append('query_type',this.formNewQuery.value.query_type);
    sendData.append('query_sub_type',this.formNewQuery.value.query_sub_type);
    sendData.append('query_description',this.formNewQuery.value.query_description);
    sendData.append('policy_no',this.formNewQuery.value.policy_no);
    sendData.append('insurance_company',this.formNewQuery.value.insurance_company);
    sendData.append('remarks',this.formNewQuery.value.remarks);
    sendData.append('priority',this.formNewQuery.value.priority);
    sendData.append('query_from_usertype','admin');
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('attachment_1',this.formNewQuery.value.attachment_1);
    sendData.append('attachment_1_description',this.formNewQuery.value.attachment_1_description);
    sendData.append('attachment_2',this.formNewQuery.value.attachment_2);
    sendData.append('attachment_2_description',this.formNewQuery.value.attachment_2_description);
    sendData.append('attachment_3',this.formNewQuery.value.attachment_3);
    sendData.append('attachment_3_description',this.formNewQuery.value.attachment_3_description);
    sendData.append('attachment_4',this.formNewQuery.value.attachment_4);
    sendData.append('attachment_4_description',this.formNewQuery.value.attachment_4_description);
    sendData.append('attachment_5',this.formNewQuery.value.attachment_5);
    sendData.append('attachment_5_description',this.formNewQuery.value.attachment_5_description);

    this.commonService.submitNewQuery(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.closePopup();
        //this.runTable();
        Swal.fire({
            title: 'success',
            html: this.editResult.message,
            timer: 3000
        }).then((result) => {
            this.windowReload();
        })
        // this.msgClass = "alert-success";
        // this.responseMsg = "Proposal-"+ proposal_no +" sent successfully to "+ email_1;
      }else{
        this.closePopupFailed();
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message;
      }
    });
  }

  windowReload(){
    window.location.reload();
  }

  showAttachment(val){
    if(val==2){
      this.display_attachment_button_1 = 'none';
      this.display_attachment_2 = 'block';
    }

    if(val==3){
      this.display_attachment_button_2 = 'none';
      this.display_attachment_3 = 'block';
    }

    if(val==4){
      this.display_attachment_button_3 = 'none';
      this.display_attachment_4 = 'block';
    }

    if(val==5){
      this.display_attachment_button_4 = 'none';
      this.display_attachment_5 = 'block';
    }
  }

  removeAttachment(val){
    this.submitted = false;
    if(val==1){

      this.formNewQuery.patchValue({
        'attachment_1' : null,
        'attachment_1_description' : null
      });

      this.attachment_1_url = null;
      this.display_attachment_1 = 'none';
    }

    if(val==2){

      this.formNewQuery.patchValue({
        'attachment_2' : null,
        'attachment_2_description' : null
      });

      this.attachment_2_url = null;
      this.display_attachment_2 = 'none';
      this.display_attachment_button_1 = 'block';
    }

    if(val==3){

      this.formNewQuery.patchValue({
        'attachment_3' : null,
        'attachment_3_description' : null
      });

      this.attachment_3_url = null;
      this.display_attachment_3 = 'none';
      this.display_attachment_button_2 = 'block';
    }

    if(val==4){

      this.formNewQuery.patchValue({
        'attachment_4' : null,
        'attachment_4_description' : null
      });

      this.attachment_4_url = null;
      this.display_attachment_4 = 'none';
      this.display_attachment_button_3 = 'block';
    }

    if(val==5){

      this.formNewQuery.patchValue({
        'attachment_5' : null,
        'attachment_5_description' : null
      });

      this.attachment_5_url = null;
      this.display_attachment_5 = 'none';
      this.display_attachment_button_4 = 'block';
    }
  }

  submitReassignForm(){
    this.submittedReassign = true;
    if(this.formReassignQuery.invalid){
      return;
    }

    this.loaderActive = true;

    const sendData = new FormData();

    sendData.append('query_no',this.re_assigned_query_no);
    sendData.append('assigned_department',this.formReassignQuery.value.re_assigned_department);
    sendData.append('remarks',this.formReassignQuery.value.re_assigned_remarks);
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('query_from_usertype','admin');

    this.commonService.reassignQuery(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.closePopupReassign();
        //this.runTable();
        Swal.fire({
            title: 'success',
            html: this.editResult.message,
            timer: 3000
        }).then((result) => {
            this.windowReload();
        })
        // this.msgClass = "alert-success";
        // this.responseMsg = "Proposal-"+ proposal_no +" sent successfully to "+ email_1;
      }else{
        this.closePopupFailed();
        this.msgClassReassign = "alert-danger";
        this.responseMsgReassign = this.editResult.message;
      }
    });
  }

  closePopupReassign(){
    this.closebutton.nativeElement.click();
    this.displayReassign='none';
  }
}
