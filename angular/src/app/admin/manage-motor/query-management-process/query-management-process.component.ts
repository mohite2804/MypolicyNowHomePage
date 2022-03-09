import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';

import Swal from 'sweetalert2'


import { Router } from  '@angular/router';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";

@Component({
  selector: 'app-query-management-process',
  templateUrl: './query-management-process.component.html',
  styleUrls: ['./query-management-process.component.css']
})
export class QueryManagementProcessComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 

  display : any;
  loginUserId  : any;
  loaderActive : boolean =  false;
  query_no : any;
  editResult : any;

  query_detail_query_no : any;
  query_detail_status_name : any;
  query_detail_query_type : any;
  query_detail_query_sub_type : any;
  query_detail_query_description : any;
  query_detail_policy_no : any;
  query_detail_insurance_company : any;
  query_detail_query_remarks : any;
  query_detail_assigned_department : any;
  query_detail_priority : any;
  query_detail_priority_text_style : any;
  query_detail_tat : any;
  documents_list : any;
  documents_description : any;
  public_path : any;

  result_query_log_details : any;

  result_query_status_master : any;
  result_query_status_update_allowed_master : any;

  formUpdateQuery : any;
  responseMsg : any;
  msgClass: any;
  submitted : boolean = false;   
  btnEditSubmit : boolean = false;

  attachment_1_url : any;
  errMsgDescription1 : any;

  divQueryAttachments : boolean = false;
  divEmptyQueryAttachments : boolean = false;

  divQueryNotResolvedClosed : boolean = false;
  divQueryResolved : boolean = false;
  divQueryRejected : boolean = false;
  divQueryClosed : boolean = false;

  constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) { 
    //this.loadScripts();
  }

  ngOnInit(): void {

      this.formUpdateQuery = this.formBuilder.group({
        query_status :['',[Validators.required]],      
        remarks : ['',[Validators.required]],
        query_from_usertype : ['admin'],
        query_no : [''],
        attachment_1 : [''],
        attachment_1_description : ['']
      });
      this.btnEditSubmit = true;

      this.loginUserId = sessionStorage.getItem("adminUserId");
      this.query_no = sessionStorage.getItem("query_no");
      this.getIndex();
      this.getFormData();
  }

  ngAfterViewInit(): void {
      
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('query_no',this.query_no);
    this.commonService.getQueryDataByQueryNo(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.displayQueryData(this.editResult);
      //console.log(this.editResult);
    });
  }

  getFormData(){
    var sendData = new FormData();
    sendData.append('query_no',this.query_no);
    this.commonService.getQueryUpdateFormData(sendData)
    .subscribe( response => {
      this.editResult = response;
      this.result_query_status_master = this.editResult.query_status_master;
      this.result_query_status_update_allowed_master = this.editResult.query_status_update_allowed_master;
    });
  }

  uploadAttachment1(event){
    let file = event.target.files[0];

   this.formUpdateQuery.get("attachment_1").setValidators([requiredFileType(["jpg", "png", "jpeg", "pdf"]),fileSizeValidator(event.target.files)]);     

    this.attachment_1_url = '';
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.attachment_1_url = event.target.result;

        this.formUpdateQuery.patchValue({
          'attachment_1' : file
        }); 
      }
    }  
  }

  submitForm(){
    this.submitted = true;
    if(this.formUpdateQuery.invalid){
      return;
    }

    if(this.formUpdateQuery.value.attachment_1!='' && this.formUpdateQuery.value.attachment_1_description==''){
      this.errMsgDescription1 = "Enter attachement description";
      return;
    }

    if(this.formUpdateQuery.value.attachment_1_description!='' && this.formUpdateQuery.value.attachment_1==''){
      this.errMsgDescription1 = "Please select attachment";
      return;
    }

    this.loaderActive = true;
    const sendData = new FormData();
    
    sendData.append('query_no',sessionStorage.getItem('query_no'));
    sendData.append('query_status',this.formUpdateQuery.value.query_status);
    sendData.append('query_status',this.formUpdateQuery.value.query_status);
    sendData.append('remarks',this.formUpdateQuery.value.remarks);
    sendData.append('query_from_usertype',this.formUpdateQuery.value.query_from_usertype);
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('attachment_1',this.formUpdateQuery.value.attachment_1);
    sendData.append('attachment_1_description',this.formUpdateQuery.value.attachment_1_description);

    this.commonService.updateQueryStatusByAdmin(sendData)
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
        this.submitted = false;
        this.closePopupFailed();
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message; 
      }
    });
  }

  displayQueryData(result){
      this.query_detail_query_no = result.query_result.query_no;
      this.query_detail_status_name = result.query_result.status_name;
      this.query_detail_query_type = result.query_result.query_type;
      this.query_detail_query_sub_type = result.query_result.query_sub_type;
      this.query_detail_query_description = result.query_result.query_description;
      this.query_detail_policy_no = result.query_result.policy_no;
      this.query_detail_insurance_company = result.query_result.insurance_company;
      this.query_detail_query_remarks = result.query_result.remarks;
      this.query_detail_priority = result.query_result.priority_name;
      this.query_detail_priority_text_style = result.query_result.priority_text_style;
      this.query_detail_tat = result.query_result.tat;
      this.documents_list = result.documents;
      this.public_path = result.public_path; 

      this.result_query_log_details = result.query_log_details;  

      //check empty attachments
      if(result.documents=='' || result.documents==null){
        this.divEmptyQueryAttachments = true;
      }
      else{
        this.divQueryAttachments = true;
      }

      //check query status & allow to update status
      if(result.query_result.query_status==4 || result.query_result.query_status==5 || result.query_result.query_status==7){
        if(result.query_result.query_status==4){
          this.divQueryResolved = true;
        }

        if(result.query_result.query_status==5){
          this.divQueryRejected = true;
        }

        if(result.query_result.query_status==7){
          this.divQueryClosed = true;
        }
      }
      else{
        this.divQueryNotResolvedClosed = true;
      }   

      
    }

  closePopup(){
    //this.closebutton.nativeElement.click();
    this.display='none';
  }

  closePopupFailed(){
    this.display='block'; 
  }

  windowReload(){
    window.location.reload();
  }
}
