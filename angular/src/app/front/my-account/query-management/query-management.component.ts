import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

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

  loginUserId  : any;
  loginUserType  : any;
  token  : any;

  result_login_status : any;
  editResult : any;
  query_type_id : any;
  filterQueryTypeFilter_id : any;

  @ViewChild('closebutton') closebutton;

  acceptedExtensions = "jpg, jpeg, png, pdf";

  result_query_types : any;
  result_query_sub_type : any;
  result_ic_master : any;
  result_department_master : any;
  result_priority_master : any;
  result_query_status_master : any;
  result_attachment : any;

  formNewQuery : any;
  display : any;
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

  filterFormQuery : any;
  atLeastOneRequired : any;
  result_filter_query_sub_type : any;

  query_no : any;
  query_type : any;
  query_sub_type : any;
  assigned_department : any;
  priority : any;
  status : any;

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

  errMsgAttachment1 : any;
  errMsgAttachment2 : any;
  errMsgAttachment3 : any;
  errMsgAttachment4 : any;
  errMsgAttachment5 : any;

  errMsgDescription1 : any;
  errMsgDescription2 : any;
  errMsgDescription3 : any;
  errMsgDescription4 : any;
  errMsgDescription5 : any;


  query_detail_query_no : any;
  query_detail_query_type : any;
  query_detail_query_sub_type : any;
  query_detail_query_description : any;
  query_detail_policy_no : any;
  query_detail_insurance_company : any;
  query_detail_query_remarks : any;
  query_detail_assigned_department : any;
  query_detail_priority : any;
  query_detail_tat : any;

  popupResolveQueryTitle : any;
  formCloseQuery : any;
  displayCloseQuery : any;
  popupQueryDetailsTitle : any;
  submittedCloseQuery : boolean = false;
  btnEditSubmitCloseQuery : boolean = false;
  responseMsgCloseQuery : any;
  msgClassCloseQuery: any;
  queryNumberCloseQuery : any;

  popupReopenQueryTitle : any;
  formReopenQuery : any;
  displayReopenQuery : any;
  submittedReopenQuery : boolean = false;
  btnEditSubmitReopenQuery : boolean = false;
  responseMsgReopenQuery : any;
  msgClassReopenQuery: any;
  queryNumberReopenQuery : any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {

    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.formNewQuery = this.formBuilder.group({
      query_type :['',[Validators.required]],
      query_sub_type : ['',[Validators.required]],
      query_description : [''],
      policy_no : [''],
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
      query_no : [''],
      filter_query_sub_type : [''],
      filter_query_type : [''],
      filter_assigned_department : [''],
      filter_priority : [''],
      filter_status : ['']
    });

    this.formCloseQuery= this.formBuilder.group({
      remarks_CloseQuery : ['',[Validators.required]]
    });

    this.formReopenQuery= this.formBuilder.group({
      remarks_ReopenQuery : ['',[Validators.required]]
    });


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

  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        this.result_login_status = response;
        this.loaderActive = false;
        if(this.result_login_status.status){
          //valid status i.e. not login from another location
        }else{
          Swal.fire({
              title: 'error',
              html: 'It seems that you have login from another location. You are logged out from this session?',
              timer: 3500
          }).then((result) => {
              this.router.navigate(['/logout']);
          });
        }



      });
  }

  ngAfterViewInit(): void {
      this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("view-query-no")) {
          this.viewQueryDetails(event.target.getAttribute("view-query-no"));
        }
        if (event.target.hasAttribute("resolved-query-no")) {
          this.viewCloseQueryPopup(event.target.getAttribute("resolved-query-no"));
        }
        if (event.target.hasAttribute("reopen-query-no")) {
          this.viewReopenQueryPopup(event.target.getAttribute("reopen-query-no"));
        }
      });
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);

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
              url : this.base_url+'get_query_data_list',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
                  "loginUserId": this.loginUserId,
                  "loginUserType": this.loginUserType,
                  "filter_query_no": this.filterFormQuery.value.query_no
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
              'title' : 'Assigned To',
              'data' : 'assigned_to_name'
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
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": 8 }
          ],
          order: [[ 7, "desc" ]]
      };
  }

  viewQueryDetails(query_no){
    this.popupQueryDetailsTitle = "View Query Details";
    this.getDataByQueryNo(query_no);
  }

  getDataByQueryNo(query_no){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('query_no',query_no);
    this.commonService.getQueryDataByQueryNo(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.displayQueryData(this.editResult.query_result);
      //console.log(this.editResult);
    });
  }

  displayQueryData(result){
      this.query_detail_query_no = result.query_no;
      this.query_detail_query_type = result.query_type;
      this.query_detail_query_sub_type = result.query_sub_type;
      this.query_detail_query_description = result.query_description;
      this.query_detail_policy_no = result.policy_no;
      this.query_detail_insurance_company = result.insurance_company;
      this.query_detail_query_remarks = result.remarks;
      this.query_detail_assigned_department = result.assigned_to_name;
      this.query_detail_priority = result.priority_name;
      this.query_detail_tat = result.tat;
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  getQuerySubTypeByQueryTypeId(event){
    console.log(event);
    this.query_type_id = event.target.value;
    this.selectQueryType(this.query_type_id);
    if(event.target.value != ""){
      //if(event.target.value != 5 ){
        this.formNewQuery.patchValue({query_sub_type : '' });
        this.loaderActive = true;
        this.result_query_sub_type = [];
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
      //}

    }
  }

  getFilterQueryNoResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search(selected_value).draw();
    });
  }

  getFilterQueryTypeResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();

    if(selected_value != ""){
      this.filterQueryTypeFilter_id = selected_value;
      this.filterFormQuery.patchValue({filter_query_sub_type : '' });
      this.loaderActive = true;
      this.result_filter_query_sub_type = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('query_type_id',selected_value);
      this.commonService.getQuerySubTypeByQueryTypeId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_filter_query_sub_type = result.query_sub_type;
        }

      });

    }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(2).search(selected_value).draw();
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

  getFilterQuerySubTypeResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(3).search(selected_value).draw();
    });


  }

  getFilterQueryAssignedDepartmentResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(4).search(selected_value).draw();
    });
  }

  getFilterQueryPriorityResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(5).search(selected_value).draw();
    });
  }

  getFilterQueryStatusResult(event){
    var selected_value : any = event.target.value;
    selected_value = selected_value.trim();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(6).search(selected_value).draw();
    });
  }

  closePopupFailed(){
    this.display='block';
  }

  openModel(){
    this.btnEditSubmit = true;
    this.popupTitle = "Submit New Query";
    this.display='none';

    this.attachment_1_url = "";
    this.attachment_2_url = "";
    this.attachment_3_url = "";
    this.attachment_4_url = "";
    this.attachment_5_url = "";

    this.formNewQuery.patchValue({
      'attachment_1' : "",
      'attachment_2' : "",
      'attachment_3' : "",
      'attachment_4' : "",
      'attachment_5' : ""

    });
  }


  uploadAttachment1(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
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

  // uploadAttachment1_old(event){

  //   this.formNewQuery.get("attachment_1").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);
  //   this.formNewQuery.get("attachment_1").updateValueAndValidity();

  //   let file = event.target.files[0];
  //   this.formNewQuery.patchValue({
  //     'attachment_1' : file
  //   });

  //   this.attachment_1_url = '';
  //   if (event.target.files && event.target.files[0]) {

  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.attachment_1_url = event.target.result;
  //     }
  //   }
  // }

  // uploadAttachment2_old(event){
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




  // uploadAttachment3_old(event){
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



  // uploadAttachment4_old(event){
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



  // uploadAttachment5_old(event){


  //   var file :any = event.target.files[0];
  //   var file_type:any = file.type;
  //   var file_size :any = file.size ;


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

    //attachment-1 & description-1
    if(this.formNewQuery.value.attachment_1!='' && this.formNewQuery.value.attachment_1_description==''){
      this.errMsgDescription1 = "Enter attachement-1 description";
      return;
    }
    else{
      this.errMsgDescription1 = "";
    }

    if(this.formNewQuery.value.attachment_1_description!='' && this.formNewQuery.value.attachment_1==''){
      this.errMsgAttachment1 = "Select attachement-1";
      return;
    }
    else{
      this.errMsgAttachment1 = "";
    }

    //attachment-2 & description-2
    if(this.formNewQuery.value.attachment_2!='' && this.formNewQuery.value.attachment_2_description==''){
      this.errMsgDescription2 = "Enter attachement-2 description";
      return;
    }
    else{
      this.errMsgDescription2 = "";
    }

    if(this.formNewQuery.value.attachment_2_description!='' && this.formNewQuery.value.attachment_2==''){
      this.errMsgAttachment2 = "Select attachement-2";
      return;
    }
    else{
      this.errMsgAttachment2 = "";
    }

    //attachment-3 & description-3
    if(this.formNewQuery.value.attachment_3!='' && this.formNewQuery.value.attachment_3_description==''){
      this.errMsgDescription3 = "Enter attachement-3 description";
      return;
    }
    else{
      this.errMsgDescription3 = "";
    }

    if(this.formNewQuery.value.attachment_3_description!='' && this.formNewQuery.value.attachment_3==''){
      this.errMsgAttachment3 = "Select attachement-3";
      return;
    }
    else{
      this.errMsgAttachment3 = "";
    }

    //attachment-4 & description-4
    if(this.formNewQuery.value.attachment_4!='' && this.formNewQuery.value.attachment_4_description==''){
      this.errMsgDescription4 = "Enter attachement-4 description";
      return;
    }
    else{
      this.errMsgDescription4 = "";
    }

    if(this.formNewQuery.value.attachment_4_description!='' && this.formNewQuery.value.attachment_4==''){
      this.errMsgAttachment4 = "Select attachement-4";
      return;
    }
    else{
      this.errMsgAttachment4 = "";
    }

    //attachment-5 & description-5
    if(this.formNewQuery.value.attachment_5!='' && this.formNewQuery.value.attachment_5_description==''){
      this.errMsgDescription5 = "Enter attachement-5 description";
      return;
    }
    else{
      this.errMsgDescription5 = "";
    }

    if(this.formNewQuery.value.attachment_5_description!='' && this.formNewQuery.value.attachment_5==''){
      this.errMsgAttachment5 = "Select attachement-5";
      return;
    }
    else{
      this.errMsgAttachment5 = "";
    }

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('query_type',this.formNewQuery.value.query_type);
    sendData.append('query_sub_type',this.formNewQuery.value.query_sub_type);
    sendData.append('query_description',this.formNewQuery.value.query_description);
    sendData.append('policy_no',this.formNewQuery.value.policy_no);
    sendData.append('insurance_company',this.formNewQuery.value.insurance_company);
    sendData.append('remarks',this.formNewQuery.value.remarks);
    sendData.append('assigned_department',this.formNewQuery.value.assigned_department);
    sendData.append('priority',this.formNewQuery.value.priority);
    sendData.append('query_from_usertype','dealer');
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
            timer: 2000
        }).then((result) => {
            this.windowReload();
        })
        // this.msgClass = "alert-success";
        // this.responseMsg = "Proposal-"+ proposal_no +" sent successfully to "+ email_1;
      }else{
        Swal.fire(this.editResult.message, '', "error");
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

  closePopup(){
    this.closebutton.nativeElement.click();
    this.display='none';
  }

  viewCloseQueryPopup(query_no){
    this.display='none';
    this.popupResolveQueryTitle = "Close Query";
    this.queryNumberCloseQuery = query_no;
    this.btnEditSubmitCloseQuery = true;
  }

  submitFormCloseQuery(){
    this.submittedCloseQuery = true;
    if(this.formCloseQuery.invalid){
      return;
    }

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('query_no',this.queryNumberCloseQuery);
    sendData.append('query_from_usertype','dealer');
    sendData.append('event','close-query');
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('remarks_CloseQuery',this.formCloseQuery.value.remarks_CloseQuery);

    this.commonService.submitCloseQuery(sendData)
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
        this.msgClassCloseQuery = "alert-danger";
        this.responseMsgCloseQuery = this.editResult.message;
        this.displayCloseQuery = 'block';
      }
    });
  }

  closePopupResolveQuery(){
    this.closebutton.nativeElement.click();
    this.display='none';
  }

  viewReopenQueryPopup(query_no){
    this.display='none';
    this.popupReopenQueryTitle = "Reopen Query";
    this.queryNumberReopenQuery = query_no;
    this.btnEditSubmitReopenQuery = true;
  }

  submitFormReopenQuery(){
    this.submittedReopenQuery = true;
    if(this.formReopenQuery.invalid){
      return;
    }

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('query_no',this.queryNumberReopenQuery);
    sendData.append('query_from_usertype','dealer');
    sendData.append('event','reopen-query');
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('remarks_CloseQuery',this.formReopenQuery.value.remarks_ReopenQuery);

    this.commonService.submitCloseQuery(sendData)
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
        this.msgClassCloseQuery = "alert-danger";
        this.responseMsgCloseQuery = this.editResult.message;
        this.displayCloseQuery = 'block';
      }
    });
  }

  closePopupReopenQuery(){
    this.closebutton.nativeElement.click();
    this.display='none';
  }
}
