import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.css']
})

export class CancellationComponent implements OnInit {
  base_url = environment.baseUrl;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;
  formchFilterDetails: FormGroup;

  div_show_cancellation_new : boolean = false;
  div_show_cancellation_status : boolean = true;
  dtRendered = true;
  policy_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;

  formCustomerBankDetail : any;
  submittedCustomerBankDetail :  boolean = false;
  cancellation_id : any;
  is_from_quote_page :  boolean = true;
  submittedSearch  :  boolean = false;
  loaderActive: boolean = false;
  displayBankDetail : any = 'none';
  formCancelPolicy : any;
  success_message: any;
  popupPyDetailsTitle: any;
  error_message: any;
  selectedType = 1;
  result : any;
  loginUserId  : any;
  loginUserType  : any;
  bankData : any;
  policy_created_date : any;
  todayDate : any;
  statusval : any = 1;
  bankDetailsData : any;
  editResult : any;
  popupTitle : any;
  btnEditSubmit : boolean = false;
  submitted : boolean = false;
  showInputDiv = "block";
  display : any;

  detail_refund : any;
  detail_account_name : any;
  detail_account_no : any;
  detail_bank_name : any;
  detail_bank_branch : any;
  detail_bank_ifsc_code : any;
  detail_refund_amount : any;

  validation_ifsc_code :any = "^[A-Z]{4}0[A-Z0-9]{6,20}$";
  validation_for_character :any = "[a-zA-Z][a-zA-Z '-]*$";
  validation_for_number :any = "^[0-9]+$";
  validation_for_account_no :any = "^[1-9]{1}[0-9]{2,20}$";

  endorsement_status : boolean = false;
  show_cancel_button : boolean = false;

  token  : any;

  payment_refund_to : any;

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

  filter_policy_no : any;
  policy_from : any;
  policy_to : any;
  insurance_name : any;
  product_name : any;
  cancellation_type : any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private customvalidationService : CustomvalidationService,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {

  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

    this.formRecodEdit = this.formBuilder.group({
      filter_policy_no : [''],
      policy_from : [''],
      policy_to : [''],
      insurance_name : [''],
      product_name : [''],
      cancellation_type : [''],
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

    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.getIndex();
    this.formchFilterDetails = this.formBuilder.group({
      policy_number : ['',[Validators.required,this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero()]]
    });
    this.validateCustomerBankDetail();

    this.getIcList();
    this.getProductList();
    this.getCancellationTypeList();
    //this.getBankData();
  }

  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
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

  // s

   validateCustomerBankDetail(){
    this.formCustomerBankDetail = this.formBuilder.group({
      refund_payee_account_name : ['',[Validators.required]],
      refund_payee_account_no : ['',[Validators.required,this.customvalidationService.cannotContainZero(),this.customvalidationService.cannotContainSpace(),Validators.minLength(5), Validators.maxLength(21), Validators.pattern(this.validation_for_account_no)]],
      refund_payee_bank_branch : ['',[Validators.required]],
      refund_payee_bank_name : ['',[Validators.required]],
      refund_payee_bank_ifsc_code : ['',[Validators.required,this.customvalidationService.cannotContainSpace(),Validators.minLength(5),Validators.maxLength(21),Validators.pattern(this.validation_ifsc_code)]],
      cancellation_id : ['',[Validators.required]],
    });

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
              url : this.base_url+'myaccount/get_cancel_policy',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "status": this.statusval,
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'SrNo'
            },
            {
              'title' : 'Policy No.',
              'data' : 'policy_no'
            },
            {
              'title' : 'Insured Name',
              'data' : 'insured_name'
            },
            {
              'title' : 'Insured Mobile No',
              'data' : 'insured_mobile_no'
            },
            {
              'title' : 'Ins.Co.',
              'data' : 'ins_comp'
            },

            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },

            {
              'title' : 'Reg No',
              'data' : 'reg_no'
            },

            {
              'title' : 'Engine No',
              'data' : 'engine_no'
            },

            {
              'title' : 'Chassis No',
              'data' : 'chassis_no'
            },

            {
              'title' : 'Created Date',
              'data' : 'cancellation_date'
            },
            {
              'title' : 'Documents',
              'data' : 'files'
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
              'title' : 'Approval Date',
              'data' : 'approval_date'
            },
            {
              'title' : 'Refund Amount',
              'data' : 'application_refund_amount'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            },
            {
              'title' : 'Payment',
              'data' : 'payment_btn'
            }

          ],
          columnDefs: [
            { "orderable": false, "targets": 11 },
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 9, "desc" ]]

      };
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        // if (event.target.hasAttribute("view-quote-id")) {
        //     this.viewQuote(event.target.getAttribute("view-quote-id"));
        // }
        if (event.target.hasAttribute("view-cancellation-id")) {
          //alert('innnn');
          // sessionStorage.setItem('unique_ref_no', event.target.getAttribute("view-forword-id"));
          this.formCustomerBankDetail.patchValue({
            cancellation_id : event.target.getAttribute("view-cancellation-id")
          });

          // this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        if (event.target.hasAttribute("view-bank-data-id")) {
          this.viewPaymentDetails(event.target.getAttribute("view-bank-data-id"));
        }
        if (event.target.hasAttribute("view-edit-id")) {
          this.editRecord(event.target.getAttribute("view-edit-id"));
        }

        if (event.target.hasAttribute("view-delete-id")) {
          // this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        }
        if (event.target.hasAttribute("view-active-id")) {
          // this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {

        }
        if (event.target.hasAttribute("policy-cancellation-id")) {
          this.policyCancellationUpdate(event.target.getAttribute("policy-cancellation-id"));
        }
        if (event.target.hasAttribute("payment-done-cancellation-id")) {
          this.getPaymentDetails(event.target.getAttribute("payment-done-cancellation-id"))
          //this.policyCancellationUpdate(event.target.getAttribute("policy-cancellation-id"));
        }
        
    });
  }


  viewPaymentDetails(dataid){
    this.popupPyDetailsTitle = "View Details";
    this.getDataByDataId(dataid);
  }

  getDataByDataId(d_id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',d_id);
    this.commonService.getQueryDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.displayPaymentData(this.editResult.result);
      //console.log(this.editResult);
    });
  }

  displayPaymentData(result){
      this.detail_refund = result.refund_to;
      this.detail_account_name = result.refund_payee_account_name;
      this.detail_account_no = result.refund_payee_account_no;
      this.detail_bank_name = result.refund_payee_bank_name;
      this.detail_bank_branch = result.refund_payee_bank_branch;
      this.detail_bank_ifsc_code = result.refund_payee_bank_ifsc_code;
      this.detail_refund_amount = result.insurance_approved_refund_amount;
  }

  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Edit Customer Bank Details";
    this.display='none';
    this.getDataById(id);

  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getCustomerBankCancellationDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      //this.getmodelData(this.editResult.result[0].make_id,this.editResult.result[0].product_type_id);
      this.setFormData(this.editResult);
    });
  }


  setFormData(result){

    this.formCustomerBankDetail.patchValue({
      refund_payee_account_name : result.result.refund_payee_account_name,
      refund_payee_account_no : result.result.refund_payee_account_no,
      refund_payee_bank_ifsc_code : result.result.refund_payee_bank_ifsc_code,
      refund_payee_bank_name : result.result.refund_payee_bank_name,
      refund_payee_bank_branch : result.result.refund_payee_bank_branch
    });

    this.payment_refund_to = result.result.refund_to;
  }

  resetForm(){
      this.submitted = false;

      this.formCustomerBankDetail.patchValue({
        first_name : '',
        middle_name : '',
        last_name : '',
        account_no : '',
        bank_name : '',
        ifsc_code : '',
        bank_branch : ''
      });

  }


  onParentIsAuthenticate(isAuthenticate : boolean){
    this.isAuthenticate = isAuthenticate;
    this.div_show_for_authenticate = !isAuthenticate;

  }

  closePopup(){
    this.closebutton.nativeElement.click();
    this.display='none';
  }

  openCustomerBankDetailModal(){
    this.displayBankDetail = 'block';
  }

  closePopupCustomerBankDetail(){
    this.closebutton.nativeElement.click();
    this.displayBankDetail='none';
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  resetformCustomerBankDetail(){
    this.submittedCustomerBankDetail = false;
    this.formCancelPolicy.patchValue({
      cancellation_reason_id : ''
    });

  }

  onChange(event) {
    this.selectedType = event.target.value;
  }


  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      this.closePopupCustomerBankDetail();
    }, 2000);

  }

  submitFormFilterDetails(){

    this.submittedSearch = true;
    if(this.formchFilterDetails.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('policy_number',this.formchFilterDetails.value.policy_number);
    this.commonService.submitCancelPolicyFilterDetails(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           this.result = outputResult.result;

           this.endorsement_status = outputResult.result[0].endorsement_status;
           console.log(this.endorsement_status);
           if(this.endorsement_status){
            this.show_cancel_button = false;
           }
           else{
            this.show_cancel_button = true;
           }

           console.log(this.result);
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }
  showHideNewCancellation(){
      this.div_show_cancellation_new = false;
      this.div_show_cancellation_status = true;
  }

  showHideStatusCancellation(statusid){

    this.div_show_cancellation_new = true;
    this.div_show_cancellation_status = false;
    this.statusval = statusid;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search( '' );
      ///hide column
      if(this.statusval=='1' || this.statusval==1 || this.statusval=='3' || this.statusval==3 || this.statusval=='4' || this.statusval==4){
        if(this.statusval=='1' || this.statusval==1){
          dtInstance.columns(11).visible(false);
          dtInstance.columns(12).visible(false);
        }
        else{
          dtInstance.columns(11).visible(true);
          dtInstance.columns(12).visible(true);
        }

        dtInstance.columns(13).visible(true);
        dtInstance.columns(14).visible(false);
       // dtInstance.columns(14).visible(true);
      }

      if(this.statusval=='2' || this.statusval==2){
        dtInstance.columns(11).visible(true);
        dtInstance.columns(12).visible(true);
        dtInstance.columns(13).visible(true);
        dtInstance.columns(14).visible(true);
      }

      dtInstance.columns(0).search(this.statusval).draw();
    });
  }

  policyCancellation(row){
    sessionStorage.setItem('policy_no', row.policy_no);
    this.router.navigateByUrl('/my-account/policycancellation');
    //[routerLink]="['/my-account/nil-endorsement']"
  }
  policyCancellationUpdate(policy_no)
  {
    sessionStorage.setItem('policy_no', policy_no);
    this.router.navigateByUrl('/my-account/policycancellation');
  }

  submitformCustomerBankDetail(){
       this.submittedCustomerBankDetail = true;
          if(this.formCustomerBankDetail.invalid){
            return;
          }
          this.loaderActive = true;
          const sendData = new FormData();
          sendData.append('cancellation_id',this.formCustomerBankDetail.value.cancellation_id);
          sendData.append('refund_payee_bank_name',this.formCustomerBankDetail.value.refund_payee_bank_name);
          sendData.append('refund_payee_bank_branch',this.formCustomerBankDetail.value.refund_payee_bank_branch);
          sendData.append('refund_payee_bank_ifsc_code',this.formCustomerBankDetail.value.refund_payee_bank_ifsc_code);
          sendData.append('refund_payee_account_name',this.formCustomerBankDetail.value.refund_payee_account_name);
          sendData.append('refund_payee_account_no',this.formCustomerBankDetail.value.refund_payee_account_no);
          this.policy_no  = sessionStorage.getItem('policy_no');
          sendData.append('policy_no',this.policy_no);

          this.commonService.submitFormCustomerBankDetail(sendData)
          .subscribe(response =>{
            this.loaderActive = false;
            var outputResult : any = response;
            if(outputResult.status){
              this.success_message = outputResult.message;
              this.removeMessage();
              Swal.fire({
                  title: '',
                  html: 'Bank Detail Is Updated!',
                  timer: 2000
                }).then((result) => {
                   this.runTable();
                   this.router.navigateByUrl('/my-account/cancellation');
                })

            }else{
              this.error_message = outputResult.message;
              this.removeMessage();
            }
      });
  }


  setBankId(bankid){
    sessionStorage.setItem('bank_id',bankid);
  }

  getBankDetails(ifsccode){

    if( ifsccode.length == 11 ){

      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('ifsc_code',ifsccode);
      this.commonService.getBankDetails(sendData)
        .subscribe( response => {
        this.loaderActive = false;
        this.bankDetailsData = response;
        if(this.bankDetailsData.status){
          this.formCustomerBankDetail.patchValue({
              refund_payee_bank_branch : this.bankDetailsData.result.branch,
              refund_payee_bank_name :this.bankDetailsData.result.bank
            });

        }else{
          this.formCustomerBankDetail.patchValue({
              refund_payee_bank_branch : '',
              refund_payee_bank_name :''

            });


        }

      });

    }
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

    this.filter_policy_no = this.formRecodEdit.value.filter_policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.cancellation_type = this.formRecodEdit.value.cancellation_type;

    if( (this.filter_policy_no != '' && this.filter_policy_no != null && this.filter_policy_no != undefined) || (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined) || (this.cancellation_type != '' && this.cancellation_type != null && this.cancellation_type != undefined)  ) {
        this.loaderActive = true;

        // this.dtRendered = true
        // this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search(this.filter_policy_no);
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

    this.filter_policy_no = this.formRecodEdit.value.filter_policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.cancellation_type = this.formRecodEdit.value.cancellation_type;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('filter_policy_no',this.filter_policy_no);
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
        filter_policy_no : '',
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

