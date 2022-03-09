import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
//import { MotorService } from '../../services/motor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";

@Component({
    selector: 'app-cancelled-policies',
    templateUrl: './cancelled-policies.component.html',
    styleUrls: ['./cancelled-policies.component.scss']
})
export class CancelledPoliciesComponent implements OnInit {
    selectedValue : any ;
    div_show_cancellation_new : boolean = true;
    div_show_cancellation_status : boolean = false;
    base_url : any = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('closebutton') closebutton;
    loaderActive : boolean =  false;
    dtRendered = true;
    formChangeStatus :any;
    formRecordEdit : FormGroup;
    result : any;
    loginUserId : any;
    policyStatusId : any;
    success_message : any;
    error_message : any;
    displayCancellationStatus : any = 'none';
    submittedChangeStatus :any;
    statusval : any = 1;
    statusData : any;
    selectedStatusId : any;
    validation_for_number :any = "^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$";
    //validation_for_character :any = "^[a-zA-Z\'\-]+$";
    validation_for_character :any = "^[a-zA-Z0-9 \,\-\/]*$";
    gross_premium : any;
    gross_premium_validation : boolean = false;
    cancelledPoliciesdata : any;
    ///change status
    refund_to : any;
    refund_payee_account_name : any;
    refund_payee_account_no : any;
    refund_payee_bank_ifsc_code : any;
    refund_payee_bank_name : any;
    refund_payee_bank_branch : any;
    editResult : any;

    ////payment update
    payment_cancellation_id : any;
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
    payment_editResult : any;

    ///payment details
    payment_refund_to_paid : any;
    payment_refund_payee_account_name_paid : any;
    payment_refund_payee_account_no_paid : any;
    payment_refund_payee_bank_ifsc_code_paid : any;
    payment_refund_payee_bank_name_paid : any;
    payment_refund_payee_bank_branch_paid : any;
    public_path : any;
    transaction_no_paid : any;
    payment_remark_paid : any;
    payment_doc_paid : any;
    payment_date_paid : any;
    payment_status_update_by : any;
    payment_paid_editResult : any;

    isIcListShow : any;

    submitted : any = false;
    loginicId : any;
    adminUserRoleId : any;
    adminUserRoleCode : any;

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
    cancellationTypeList : any;
    selectedInsurance_name : any;
    selectedProduct_name : any;
    selectedCancellation_type : any;
    proposalData : any;

    search_insurance_name : any;

    policy_no : any;
    policy_from : any;
    policy_to : any;
    insurance_name : any;
    product_name : any;
    cancellation_type : any;

    constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
        this.loginUserId = sessionStorage.getItem('adminUserId');
        this.loginicId = sessionStorage.getItem('icId');
        this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');
        this.adminUserRoleCode = sessionStorage.getItem('adminUserName');

    }

    ngOnInit(): void {
        this.validateChangeStatus();
        this.validateChangePaymentStatus();
        this.policyStatusId = "1";


        this.formRecodEdit = this.formBuilder.group({
          policy_no : [''],
          policy_from : [''],
          policy_to : [''],
          insurance_name : [''],
          product_name : [''],
          cancellation_type : [''],
          submit_btn : ['']
        });

        this.getIndex();
        this.getCancellationStatusData();
        // this.showHideStatusCancellation(1);

        if(this.loginicId!=0){
            this.isIcListShow = false;
        }
        else
        if(this.loginicId==0){
            this.isIcListShow = true;
        }

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

        this.getIcList();
        this.getProductList();
        this.getCancellationTypeList();
    }

    validateChangeStatus(){
        this.formChangeStatus = this.formBuilder.group({
          status_id : ['',[Validators.required]],
          refund_amount : ['',[Validators.pattern(this.validation_for_number)]],
          comment : ['',[Validators.pattern(this.validation_for_character)]],
          cancellation_id : ['',[Validators.required]]
        });
    }

    validateChangePaymentStatus(){
        this.formChangePaymentStatus = this.formBuilder.group({
            transaction_no : ['',[Validators.required]],
            payment_doc : [''],
            payment_remark : ['',[Validators.required,Validators.maxLength(300)]]
        });
    }

    resetForm(){
        this.submittedChangeStatus = false;
        this.formChangeStatus.patchValue({
            status_id : "",
            refund_amount : "",
            comment : "",
            cancellation_id : ""
        });
    }

    resetForm1(){
        this.submittedPaymentDetails = false;
        this.formChangePaymentStatus.patchValue({
            transaction_no : "",
            payment_doc : "",
            payment_remark : ""
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
                url : this.base_url+'admin/getPolicyWithLoginAndStatus',
                type : 'POST',
                data: {
                    "loginUserId": this.loginUserId,
                    "policyStatusId": this.policyStatusId,
                    "adminUserRoleCode": this.adminUserRoleCode,
                    "ic_id": this.loginicId
                },
                dataType: "json",
            },
            columns: [
                {
                  'title' : 'Sr.No.',
                  'data' : 'SrNo'
                },
                {
                  'title' : 'Policy Number',
                  'data' : 'policy_no'
                },
                {
                  'title' : 'Engine Number',
                  'data' : 'engine_no'
                },
                {
                  'title' : 'Chassis Number',
                  'data' : 'chassis_no'
                },
                {
                  'title' : 'Product Type',
                  'data' : 'product_type'
                },
                {
                  'title' : 'Insurance Company',
                  'data' : 'ins_comp'
                },
                {
                  'title' : 'Cancellation No',
                  'data' : 'cancellation_no'
                },

                {
                  'title' : 'Vehicle Reg. Number',
                    'data' : 'reg_no'
                },
                {
                  'title' : 'Insurer Name',
                  'data' : 'policy_holder_name'
                },
                {
                  'title' : 'Payment Type',
                  'data' : 'payment_type'
                },
                {
                  'title' : 'User Comment',
                  'data' : 'user_comment'
                },
                {
                  'title' : 'Admin Comment',
                  'data' : 'admin_comment'
                },
                {
                  'title' : 'Reason Of Cancellation',
                  'data' : 'cancellation_reason'
                },
                {
                  'title' : 'Refund Amount',
                  'data' : 'application_refund_amount'
                },
                {
                  'title' : 'Documents',
                  'data' : 'files'
                },
                {
                  'title' : 'Created Date',
                  'data' : 'cancellation_date'
                },
                {
                  'title' : 'Action',
                  'data' : 'action_btn'
                }
            ],
            columnDefs: [
                { "orderable": false, "targets": [0,14,16] }
            ],
            order: [[ 15, "desc" ]]
        };
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("view-cancellation-id")) {
                this.formChangeStatus.patchValue({
                    cancellation_id : event.target.getAttribute("view-cancellation-id"),
                    refund_amount : event.target.getAttribute("view-refund-amount")
                });
                this.gross_premium = event.target.getAttribute("view-gross-primium");
            }

            if (event.target.hasAttribute("payment-cancellation-id")) {
                this.payment_cancellation_id = event.target.getAttribute("payment-cancellation-id");
                this.getPayeeDetails(this.payment_cancellation_id);
            }

            if (event.target.hasAttribute("payment-done-cancellation-id")) {
                this.getPaymentDetails(event.target.getAttribute("payment-done-cancellation-id"));
            }
        });
    }

    setStatusId(statusid){
        sessionStorage.setItem('status_id',statusid);
    }

    downloadPolicy(url){
        window.open(url, '_blank');
    }

    downloadProposal(url){
        window.open(url, '_blank');
    }

    downloadExcel(){
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('loginUserId',this.loginUserId);
        sendData.append('policyStatusId',this.policyStatusId);
    }

    getCancellationStatusData(){
        this.commonService.getCancellationStatusData()
        .subscribe( response => {
            var result : any = response;
            if(result.status){
                this.statusData = result.result;
            }
        });
    }

    submitFormChangeStatus(){
        this.submittedChangeStatus = true;
        if(this.formChangeStatus.invalid){
            return;
        }
        var updated_status = this.formChangeStatus.value.status_id;
        if(updated_status=='2'){
            var refund_amount = this.formChangeStatus.value.refund_amount;
            if(parseInt(refund_amount)>parseInt(this.gross_premium)){
                this.gross_premium_validation = true;
                return;
            }
            else{
                this.gross_premium_validation = false;
            }
        }
        else{
            this.gross_premium_validation = false;
        }
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('status_id',this.formChangeStatus.value.status_id);
        sendData.append('refund_amount',this.formChangeStatus.value.refund_amount);
        sendData.append('cancellation_id',this.formChangeStatus.value.cancellation_id);
        sendData.append('comment',this.formChangeStatus.value.comment);
        sendData.append('user_id',this.loginUserId);
        console.log(sendData);
        this.commonService.formCancellationStatusUpdate(sendData)
        .subscribe(response => {
            var result : any = response;
            this.resetForm();
            this.loaderActive = false;
            if(result.status){
                Swal.fire(result.message,  "" ,  "success" ).then((result) => { location.reload();});
            }
            else{
                Swal.fire(result.message,  "" ,  "error" );
            }
        });
    }


    downloadReport(download_url){
        window.open(download_url, '_blank  ');
    }

    showHideNewCancellation(){
        this.div_show_cancellation_new = false;
        this.div_show_cancellation_status = true;
    }

    showHideStatusCancellation(statusid){

        this.resetFilterForm();

        this.div_show_cancellation_new = true;
        this.div_show_cancellation_status = false;
        this.statusval = statusid;
        const that = this;
        // make sure your template notices it
        this.cdr.detectChanges();
        // initialize them again
        this.dtRendered = true
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(this.statusval).draw();
        });
    }

    policyCancellation(policy_no){
        sessionStorage.setItem('policy_no', policy_no);
        this.router.navigateByUrl('/my-account/policycancellation');
        //[routerLink]="['/my-account/nil-endorsement']"
    }

    openChangeStatusModal(){
        this.displayCancellationStatus = 'block';
    }

    closeChangeStatus(){
        this.closebutton.nativeElement.click();
        this.displayCancellationStatus='none';
        // this.resetFormForwardProposal();
        this.loaderActive = false;
    }

    resetformChangeStatus(){
        this.submittedChangeStatus = false;
        this.formChangeStatus.patchValue({
            cancellation_reason_id : ''
        });
    }

    onChange(event) {
        this.selectedValue = event;
        if(event == 2){
            this.loaderActive = true;
            var sendData = new FormData();
            sendData.append('cancellation_id',this.formChangeStatus.value.cancellation_id);
            this.commonService.getCancellationDataById(sendData)
            .subscribe( response => {
                this.loaderActive = false;
                this.editResult = response;
                if(this.editResult.status){
                    this.refund_to = this.editResult.result.refund_to;
                    this.refund_payee_account_name = this.editResult.result.refund_payee_account_name;
                    this.refund_payee_account_no = this.editResult.result.refund_payee_account_no;
                    this.refund_payee_bank_ifsc_code = this.editResult.result.refund_payee_bank_ifsc_code;
                    this.refund_payee_bank_name = this.editResult.result.refund_payee_bank_name;
                    this.refund_payee_bank_branch = this.editResult.result.refund_payee_bank_branch;
                }
                else{
                    Swal.fire(this.editResult.message,  "" ,  "error" );
                }
                //console.log(this.editResult);
            });
            this.formChangeStatus.get("refund_amount").setValidators([Validators.required,Validators.pattern(this.validation_for_number)]);
            this.formChangeStatus.get("refund_amount").updateValueAndValidity();
            this.formChangeStatus.get("comment").setValidators([]);
            this.formChangeStatus.get("comment").updateValueAndValidity();
        }
        else{
            this.formChangeStatus.get("refund_amount").setValidators([]);
            this.formChangeStatus.get("refund_amount").updateValueAndValidity();
            this.formChangeStatus.get("comment").setValidators([this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.required,Validators.pattern(this.validation_for_character)]);
            this.formChangeStatus.get("comment").updateValueAndValidity();
        }
    }

    getPayeeDetails(cancellation_id) {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('cancellation_id',cancellation_id);
        this.commonService.getCancellationDataById(sendData)
        .subscribe( response => {
            this.loaderActive = false;
            this.payment_editResult = response;
            if(this.payment_editResult.status){
                this.payment_refund_to = this.payment_editResult.result.refund_to;
                this.payment_refund_payee_account_name = this.payment_editResult.result.refund_payee_account_name;
                this.payment_refund_payee_account_no = this.payment_editResult.result.refund_payee_account_no;
                this.payment_refund_payee_bank_ifsc_code = this.payment_editResult.result.refund_payee_bank_ifsc_code;
                this.payment_refund_payee_bank_name = this.payment_editResult.result.refund_payee_bank_name;
                this.payment_refund_payee_bank_branch = this.payment_editResult.result.refund_payee_bank_branch;
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

    ///////////    upload payment refrence doc    ///////////

    uploadPaymentDoc(event){
        var file :any = event.target.files[0];
        var file_type:any = file.type;
        var file_size :any = file.size ;
        if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
            Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
            this.payment_docurl = "";
            this.payment_docurl_label = "";
        }
        else if(file_size > 5242880){
            Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
            this.payment_docurl = "";
            this.payment_docurl_label = "";
        }
        else{
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
        sendData.append('cancellation_id',this.payment_cancellation_id);
        sendData.append('user_id',this.loginUserId);
        console.log(sendData);
        this.commonService.formCancelPolicyPaymentStatusUpdate(sendData)
        .subscribe(response => {
            var result : any = response;
            this.resetForm1();
            this.loaderActive = false;
            if(result.status){
                Swal.fire(result.message,  "" ,  "success" ).then((result) => { location.reload();});
            }
            else{
                Swal.fire(result.message,  "" ,  "error" );
            }
        });
    }

    removeMessage(){
        setTimeout (() => {
            this.success_message = "";
            this.error_message = "";
            this.closeChangeStatus();
        }, 2000);
    }

    getPaymentDetails(cancellation_id) {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('cancellation_id',cancellation_id);
        this.commonService.getCancellationPaymentDetails(sendData)
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

                this.transaction_no_paid = this.payment_paid_editResult.result.transaction_no;
                this.payment_remark_paid = this.payment_paid_editResult.result.payment_remark;
                this.payment_doc_paid = this.payment_paid_editResult.result.payment_doc;
                this.payment_date_paid = this.payment_paid_editResult.result.payment_date;
                this.payment_status_update_by = this.payment_paid_editResult.result.username;

                this.public_path = this.payment_paid_editResult.result.public_path;
            }
            else{
                Swal.fire(this.payment_paid_editResult.message,  "" ,  "error" );
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

          case 'cancellation_type':
            this.formRecodEdit.patchValue({cancellation_type : selected_value });
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

        case 'cancellation_type':
          this.formRecodEdit.patchValue({cancellation_type : '' });
          this.selectedCancellation_type = "";
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

    getCancellationTypeList(){
      this.commonService.getCancellationTypeListData()
        .subscribe( response => {
          this.cancellationTypeList = response;
          this.cancellationTypeList = this.cancellationTypeList.result;
          //this.setFormData(this.state_data);
          // console.log(this.icList);
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

    this.policy_no = this.formRecodEdit.value.policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.cancellation_type = this.formRecodEdit.value.cancellation_type;

    if( (this.policy_no!='' && this.policy_no!=null && this.policy_no!=undefined) || (this.policy_no!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined) || (this.cancellation_type != '' && this.cancellation_type != null && this.cancellation_type != undefined)  ) {
        this.loaderActive = true;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search(this.policy_no);
            dtInstance.columns(2).search(this.policy_from);
            dtInstance.columns(3).search(this.policy_to);
            dtInstance.columns(4).search(this.insurance_name);
            dtInstance.columns(5).search(this.product_name);
            dtInstance.columns(6).search(this.cancellation_type);
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

    this.policy_no = this.formRecodEdit.value.policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.cancellation_type = this.formRecodEdit.value.cancellation_type;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('policy_no',this.policy_no);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);
    sendData.append('insurance_name',this.insurance_name);
    sendData.append('product_name',this.product_name);
    sendData.append('cancellation_type',this.cancellation_type);
    sendData.append('statusval',this.statusval);

    this.commonService.exportCancelPolicyData(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.proposalData = response;
        this.excelService.exportAsExcelFile(this.proposalData, 'CancelPolicyData');

    });
  }

  resetFilterForm(){
    this.loaderActive = true;

    this.formRecodEdit.patchValue({
        policy_no : '',
        policy_from : '',
        policy_to : '',
        insurance_name : '',
        product_name : '',
        cancellation_type : '',
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedCancellation_type = "";

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search('');
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
