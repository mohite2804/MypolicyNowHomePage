import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import {ExcelService} from '../../services/excel.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";

import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;

  validation_for_character :any = "^[a-zA-Z0-9 \,\-\/]*$";

  loginUserId : any;
  loginUserType  : any;

  loaderActive : boolean = false;
  formchFilterDetails: FormGroup;

  div_show_endorsement_new : boolean = true;
  div_show_endorsement_status : boolean = false;

  statusval : any = 1;
  proposer_type: any =1;

  result : any;

  base_url_ses: any;
  endorsementsdata :any;


  ////payment update
  payment_endorsement_id : any;

  formChangePaymentStatus :FormGroup;
  submittedPaymentDetails : boolean = false;

  payment_docurl:any;
  payment_doclabel:any;
  payment_docurl_label : any;

  payment_refund_to : any;
  payment_refund_payee_account_name : any;
  payment_refund_payee_account_no : any;
  payment_refund_payee_bank_ifsc_code : any;
  payment_refund_payee_bank_name : any;
  payment_refund_payee_bank_branch : any;
  payment_application_refund_amount : any;

  payment_editResult : any;

  ///payment details
  payment_refund_to_paid : any;
  payment_refund_payee_account_name_paid : any;
  payment_refund_payee_account_no_paid : any;
  payment_refund_payee_bank_ifsc_code_paid : any;
  payment_refund_payee_bank_name_paid : any;
  payment_refund_payee_bank_branch_paid : any;
  payment_refund_amount : any;

  public_path : any;
  transaction_no_paid : any;
  payment_remark_paid : any;
  payment_doc_paid : any;
  payment_date_paid : any;
  payment_status_update_by : any;

  payment_paid_editResult : any;

  ////search options
  submitted_filter : any = false;
  formRecodEdit : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;

  date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  maxDate : any;
  minDate : any;
  icList : any;
  productList : any;
  endorsementList : any;
  selectedInsurance_name : any;
  selectedProduct_name : any;
  selectedEndorsement_type : any;
  proposalData : any;

  search_insurance_name : any;

  policy_from : any;
  policy_to : any;
  insurance_name : any;
  product_name : any;
  endorsement_type : any;
  adminUserRoleId : any;

  constructor(private customvalidationService: CustomvalidationService, private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
    //this.loadScripts();
    this.loginUserId = sessionStorage.getItem('adminUserId');
    this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');
  }

  ngOnInit(): void {
      this.formchFilterDetails = this.formBuilder.group({
        policy_number : ['']
       });

      this.formRecodEdit = this.formBuilder.group({
        policy_from : [''],
        policy_to : [''],
        insurance_name : [''],
        product_name : [''],
        endorsement_type : [''],
        submit_btn : ['']
      });

      const current = new Date();

      this.maxDate = this.maxDatePolicyTo = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.minDate = this.minDatePolicyFrom =  {
        year: current.getFullYear() - 2,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.loginUserId = sessionStorage.getItem('adminUserId');
      this.loginUserType = sessionStorage.getItem('user_type_id');

      this.validateChangePaymentStatus();

      this.getIcList();
      this.getProductList();
      this.getEndorsementList();

      this.getIndex();


      sessionStorage.setItem('baseurl', this.base_url);
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-endorsement-id")) {
          this.viewEndorsementDetails(event.target.getAttribute("view-endorsement-id"),event.target.getAttribute("view-endorsement-status"));
        }

        if (event.target.hasAttribute("payment-endorsement-id")) {
          this.payment_endorsement_id = event.target.getAttribute("payment-endorsement-id");

          this.getPayeeDetails(this.payment_endorsement_id);
        }

        if (event.target.hasAttribute("payment-done-endorsement-id")) {
          this.getPaymentDetails(event.target.getAttribute("payment-done-endorsement-id"));
        }

        if (event.target.hasAttribute("download-endorsement")) {
          this.downloadEndorsementPdf(event.target.getAttribute("download-endorsement"));
        }

    });
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'insurance_name':
          this.formRecodEdit.patchValue({insurance_name : selected_value });
          break;

        case 'product_name':
          this.formRecodEdit.patchValue({product_name : selected_value });
          break;

        case 'endorsement_type':
          this.formRecodEdit.patchValue({endorsement_type : selected_value });
          break;

      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'insurance_name':
        this.formRecodEdit.patchValue({insurance_name : '' });
        this.selectedInsurance_name = "";
        break;

      case 'product_name':
        this.formRecodEdit.patchValue({product_name : '' });
        this.selectedProduct_name = "";
        break;

      case 'endorsement_type':
        this.formRecodEdit.patchValue({endorsement_type : '' });
        this.selectedEndorsement_type = "";
        break;

    }
  }

  getIcList(){
    this.commonService.getIcData()
      .subscribe( response => {
        this.icList = response;
        this.icList = this.icList.result;
        //this.setFormData(this.state_data);
        // console.log(this.icList);
      });
  }

  getProductList(){
    this.commonService.getProductData()
      .subscribe( response => {
        this.productList = response;
        this.productList = this.productList.result;
        //this.setFormData(this.state_data);
        // console.log(this.icList);
      });
  }

  getEndorsementList(){
    this.commonService.getEndorsementListData()
      .subscribe( response => {
        this.endorsementList = response;
        this.endorsementList = this.endorsementList.result;
        //this.setFormData(this.state_data);
        // console.log(this.icList);
      });
  }

  downloadEndorsementPdf(proposal_share_link){
    this.downloadFile(this.base_url+'myaccount/downloadEndorsement/'+proposal_share_link);
  }

  downloadFile(download_url){
    window.open(download_url, '_blank');
  }

  viewEndorsementDetails(endorsement_id,endorsement_status){
    sessionStorage.setItem('endorsement_id', endorsement_id);
    sessionStorage.setItem('ed_status', endorsement_status);

    window.location.href='admin/manage-motor/endorse-process';
  }


  exportAsXLSX(){
    const sendData = new FormData();
    //sendData.append('loginUserId',this.loginUserId);
    this.commonService.getendorsementsData(sendData)
          .subscribe( response => {
            this.endorsementsdata = response;
            //console.log(this.modelsdata);
           this.excelService.exportAsExcelFile(this.endorsementsdata, 'EndorsementData');
          });
  }

  validateChangePaymentStatus(){
    this.formChangePaymentStatus = this.formBuilder.group({
          transaction_no : ['',[Validators.required]],
          payment_doc : [''],
          payment_remark : ['',[Validators.required,Validators.maxLength(300)]]
        });
  }

  getPayeeDetails(endorsement_id) {

    this.loaderActive = true;

    var sendData = new FormData();
    sendData.append('endorsement_id',endorsement_id);

    this.commonService.getEndorsementDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.payment_editResult = response;
      
      
      
      if(this.payment_editResult.status){
        /* if(this.payment_editResult.result.refund_to!=null){
          this.payment_editResult.result.refund_to=this.payment_editResult.result.refund_to;
        }else{
          this.payment_editResult.result.refund_to=this.payment_editResult.endorsee_value.refund_to;
        }
        if(this.payment_editResult.result.refund_payee_account_name!=null){
          this.payment_editResult.result.refund_payee_account_name=this.payment_editResult.result.refund_payee_account_name;
        }else{
          this.payment_editResult.result.refund_payee_account_name=this.payment_editResult.endorsee_value.refund_payee_account_name;
        }
        if(this.payment_editResult.result.refund_payee_account_no!=null){
          this.payment_editResult.result.refund_payee_account_no=this.payment_editResult.result.refund_payee_account_no;
        }else{
          this.payment_editResult.result.refund_payee_account_no=this.payment_editResult.endorsee_value.refund_payee_account_no;
        }
        if(this.payment_editResult.result.refund_payee_bank_ifsc_code!=null){
          this.payment_editResult.result.refund_payee_bank_ifsc_code=this.payment_editResult.result.refund_payee_bank_ifsc_code;
        }else{
          this.payment_editResult.result.refund_payee_bank_ifsc_code=this.payment_editResult.endorsee_value.refund_payee_bank_ifsc_code;
        }
        if(this.payment_editResult.result.refund_payee_bank_name!=null){
          this.payment_editResult.result.refund_payee_bank_name=this.payment_editResult.result.refund_payee_bank_name;
        }else{
          this.payment_editResult.result.refund_payee_bank_name=this.payment_editResult.endorsee_value.refund_payee_bank_name;
        }
        if(this.payment_editResult.result.refund_payee_bank_branch!=null){
          this.payment_editResult.result.refund_payee_bank_branch=this.payment_editResult.result.refund_payee_bank_branch;
        }else{
          this.payment_editResult.result.refund_payee_bank_branch=this.payment_editResult.endorsee_value.refund_payee_bank_branch;
        } */


        this.payment_refund_to = this.payment_editResult.endorsee_value.refund_to;
        this.payment_refund_payee_account_name = this.payment_editResult.endorsee_value.refund_payee_account_name;
        this.payment_refund_payee_account_no = this.payment_editResult.endorsee_value.refund_payee_account_no;
        this.payment_refund_payee_bank_ifsc_code = this.payment_editResult.endorsee_value.refund_payee_bank_ifsc_code;
        this.payment_refund_payee_bank_name = this.payment_editResult.endorsee_value.refund_payee_bank_name;
        this.payment_refund_payee_bank_branch = this.payment_editResult.endorsee_value.refund_payee_bank_branch;
        this.payment_application_refund_amount = this.payment_editResult.result.application_refund_amount;
      }
      else{
        Swal.fire(this.payment_editResult.message,  "" ,  "error" );
      }
    });

      this.formChangePaymentStatus.get("transaction_no").setValidators([Validators.required]);
      this.formChangePaymentStatus.get("transaction_no").updateValueAndValidity();

      this.formChangePaymentStatus.get("payment_doc").setValidators([]);
      this.formChangePaymentStatus.get("payment_doc").updateValueAndValidity();

      this.formChangePaymentStatus.get("payment_remark").setValidators([this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.required,Validators.pattern(this.validation_for_character)]);
      this.formChangePaymentStatus.get("payment_remark").updateValueAndValidity();
  }

  resetForm(){
    this.formChangePaymentStatus.patchValue({
      transaction_no : "",
      payment_doc : "",
      payment_remark : ""
    });

  }

  ///////////    upload payment refrence doc    ///////////
  uploadPaymentDoc(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.payment_docurl = "";
      this.payment_docurl_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.payment_docurl = "";
      this.payment_docurl_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.payment_docurl = event.target.result;
      }
      this.payment_docurl_label = file.name;
      this.formChangePaymentStatus.patchValue({
        'payment_doc' : file
      });
    }
  }

  submitFormChangePaymentStatus(){
      this.submittedPaymentDetails = true;

      if(this.formChangePaymentStatus.invalid){
        return;
      }

      console.log(this.formChangePaymentStatus);

      this.loaderActive = true;

      var sendData = new FormData();
      sendData.append('transaction_no',this.formChangePaymentStatus.value.transaction_no);
      sendData.append('payment_doc',this.formChangePaymentStatus.value.payment_doc);
      sendData.append('payment_remark',this.formChangePaymentStatus.value.payment_remark);
      sendData.append('endorsement_id',this.payment_endorsement_id);
      sendData.append('user_id',this.loginUserId);

      console.log(sendData);
      this.commonService.formPaymentStatusUpdateEndorsement(sendData)
      .subscribe(response => {
          var result : any = response;
          this.resetForm();
          this.loaderActive = false;
          if(result.status){
            Swal.fire(result.message,  "" ,  "success" ).then((result) => { location.reload();});
          }else{
            Swal.fire(result.message,  "" ,  "error" );
          }
      });

  }

  getIndex(){
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/get_endorsementByStatus',
              type : 'POST',
              data: {
              "loginUserId": sessionStorage.getItem('adminUserId'),
              "loginUserType": sessionStorage.getItem('adminUserTypeId'),
              "ic_id": sessionStorage.getItem('icId'),
              "status": this.statusval,
              "proposer_type": this.proposer_type,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
             {
              'title' : 'Proposer Type',
              'data' : 'proposer_type'
            },
            {
              'title' : 'Policy Number',
              'data' : 'ref_no'
            },
            {
              'title' : 'Endorsement No',
              'data' : 'endorsement_no'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },
            {
              'title' : 'Reg. No.',
              'data' : 'reg_no'
            },
            {
              'title' : 'Insured Name',
              'data' : 'insured_name'
            },
            // {
            //   'title' : 'Insured Mobile No',
            //   'data' : 'insured_mobile_no'
            // },
            {
              'title' : 'Ins. Company',
              'data' : 'ins_comp'
            },
            {
              'title' : 'Final Premium <small class="d-block">(Incl. GST)',
              'data' : 'final_premium'
            },
            {
              'title' : 'Type',
              'data' : 'type'
            },
            {
              'title' : 'Type Change',
              'data' : 'type_change'
            },
            {
              'title' : 'Endorsement Charges',
              'data' : 'endorse_charges'
            },
            {
              'title' : 'Created Date',
              'data' : 'quote_created_date'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            },
            {
              'title' : 'Refund Amount',
              'data' : 'refund_amount'
            },
            {
              'title' : 'Comment',
              'data' : 'comment'
            },
            {
              'title' : 'Payment Action',
              'data' : 'payment_action'
            },
            {
              'title' : 'Approval Date',
              'data' : 'approval_date'
            },
            {
              'title' : 'Download',
              'data' : 'download_action'
            }



          ],
          columnDefs: [
            { "targets": [0,11,12,13,14,15,16,17],"orderable": false,},
          ],
          order: [[ 10, "desc" ]]
      };

  }


  showHideNewEndorsement(){
      this.div_show_endorsement_new = false;
    this.div_show_endorsement_status = true;
  }

  showHideStatusEndorsement(statusid){

    this.resetFilterForm();

    this.div_show_endorsement_new = true;
    this.div_show_endorsement_status = false;
    this.statusval = statusid;


    this.dtRendered = false;
    this.getIndex();

    this.cdr.detectChanges();
    this.dtRendered = true
    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      /* if(this.statusval=='' || this.statusval==null || this.statusval==undefined){
        dtInstance.columns(15).visible(false);
      }else{
        dtInstance.columns(15).visible(true);
      } */

      //  if(this.statusval==5 || this.statusval==4){
      //     dtInstance.columns(15).visible(true);
      //  }

      /* if(this.statusval!=1){
        dtInstance.columns(16).visible(true);
      }
      else{
        dtInstance.columns(16).visible(false);
      } */

       dtInstance.columns(0).search(this.statusval).draw();
    });

  }

showHideStatusEndorsement1(proposer_type_id){
    this.div_show_endorsement_new = true;
    this.div_show_endorsement_status = false;
    this.proposer_type = proposer_type_id;


    this.dtRendered = false;
    this.getIndex();

    this.cdr.detectChanges();
    this.dtRendered = true
    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      /*  if(this.statusval!=5 || this.statusval=='' || this.statusval==null || this.statusval==undefined){
          dtInstance.columns(15).visible(false);
       }

       if(this.statusval==5){
          dtInstance.columns(15).visible(true);
       }

       if(this.statusval!=1){
          dtInstance.columns(16).visible(true);
       }
       else{
          dtInstance.columns(16).visible(false);
       } */

       dtInstance.columns(1).search(this.proposer_type).draw();
    });
  }

  processEndorsement(policy_no){
    alert(policy_no);
    sessionStorage.setItem('policy_no', policy_no);
    this.router.navigateByUrl('/admin/manage-motor/endorse-process');
    //[routerLink]="['/my-account/nil-endorsement']"
  }

  getPaymentDetails(endorsement_id) {

    this.loaderActive = true;

    var sendData = new FormData();
    sendData.append('endorsement_id',endorsement_id);

    this.commonService.getEndorsementDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.payment_paid_editResult = response;


      if(this.payment_paid_editResult.status){
        this.payment_refund_to_paid = this.payment_paid_editResult.result.refund_to;
        this.payment_refund_payee_account_name_paid = this.payment_paid_editResult.result.refund_payee_account_name;
        this.payment_refund_payee_account_no_paid = this.payment_paid_editResult.result.refund_payee_account_no;
        this.payment_refund_payee_bank_ifsc_code_paid = this.payment_paid_editResult.result.refund_payee_bank_ifsc_code;
        this.payment_refund_payee_bank_name_paid = this.payment_paid_editResult.result.refund_payee_bank_name;
        this.payment_refund_payee_bank_branch_paid = this.payment_paid_editResult.result.refund_payee_bank_branch;
        this.payment_refund_amount = this.payment_paid_editResult.result.application_refund_amount;

        this.transaction_no_paid = this.payment_paid_editResult.result.refund_transaction_no;
        this.payment_remark_paid = this.payment_paid_editResult.result.refund_remark;
        this.payment_doc_paid = this.payment_paid_editResult.result.refund_doc;
        this.payment_date_paid = this.payment_paid_editResult.result.refund_date;
        this.payment_status_update_by = this.payment_paid_editResult.result.username;

        this.public_path = this.payment_paid_editResult.result.public_path;
      }
      else{
        Swal.fire(this.payment_paid_editResult.message,  "" ,  "error" );
      }
    });
  }

  submitFormFilter(){

    if(this.formRecodEdit.value.policy_from!='' && this.formRecodEdit.value.policy_from!=null && this.formRecodEdit.value.policy_from!=undefined){
      this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
    }
    else{
      this.policy_from = "";
    }

    if(this.formRecodEdit.value.policy_to!='' && this.formRecodEdit.value.policy_to!=null && this.formRecodEdit.value.policy_to!=undefined){
      this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
    }
    else{
      this.policy_to = "";
    }

    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.endorsement_type = this.formRecodEdit.value.endorsement_type;

    if( (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined) || (this.endorsement_type != '' && this.endorsement_type != null && this.endorsement_type != undefined)  ) {
        this.loaderActive = true;

        // this.dtRendered = true
        // this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(2).search(this.policy_from);
            dtInstance.columns(3).search(this.policy_to);
            dtInstance.columns(4).search(this.insurance_name);
            dtInstance.columns(5).search(this.product_name);
            dtInstance.columns(6).search(this.endorsement_type);
            dtInstance.draw();
        });

        this.loaderActive = false;

    } else {

      Swal.fire("At least one field is required ", '', "error");
      return;
    }

  }

  exportDataForm(){

    if(this.formRecodEdit.value.policy_from!='' && this.formRecodEdit.value.policy_from!=null && this.formRecodEdit.value.policy_from!=undefined){
      this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
    }
    else{
      this.policy_from = "";
    }

    if(this.formRecodEdit.value.policy_to!='' && this.formRecodEdit.value.policy_to!=null && this.formRecodEdit.value.policy_to!=undefined){
      this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
    }
    else{
      this.policy_to = "";
    }

    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.endorsement_type = this.formRecodEdit.value.endorsement_type;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);
    sendData.append('insurance_name',this.insurance_name);
    sendData.append('product_name',this.product_name);
    sendData.append('endorsement_type',this.endorsement_type);
    sendData.append('statusval',this.statusval);
    sendData.append('proposer_type',this.proposer_type);

    this.commonService.exportEndorsementData(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.proposalData = response;
        this.excelService.exportAsExcelFile(this.proposalData, 'EndorsementData');

    });
  }

  resetFilterForm(){
    this.loaderActive = true;

    this.formRecodEdit.patchValue({
        policy_from : '',
        policy_to : '',
        insurance_name : '',
        product_name : '',
        endorsement_type : '',
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedEndorsement_type = "";

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(2).search('');
        dtInstance.columns(3).search('');
        dtInstance.columns(4).search('');
        dtInstance.columns(5).search('');
        dtInstance.columns(6).search('');
        dtInstance.draw();
    });

    this.loaderActive = false;
  }
}
