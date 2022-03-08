import { Component, OnInit,Renderer2,ViewChild, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-saved-proposal',
  templateUrl: './saved-proposal.component.html',
  styleUrls: ['./saved-proposal.component.css']
})
export class SavedProposalComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;
  editResult : any;

  @ViewChild('closebutton') closebutton;

  dtRendered = true;

  formForwardProposal : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  responseMsg : any;
  msgClass: any;
  modal: any;

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
  policyTypeList : any;
  selectedInsurance_name : any;
  selectedProduct_name : any;
  selectedPolicyType_name : any;
  proposalData : any;

  search_insurance_name : any;

  success_message: any;
  error_message: any;

  filter_policy_no : any;
  policy_from : any;
  policy_to : any;
  insurance_name : any;
  product_name : any;
  policy_type_name : any;

  filterResult : any;
  setNullDate : any;
  minDateForToDate: any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
    this.setNullDate = {
      year: "",
      month: "",
      day: ""
    };
  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

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

    this.formForwardProposal = this.formBuilder.group({
      proposal_no :[''],
      email_1 : ['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });

    this.formRecodEdit = this.formBuilder.group({
      filter_policy_no : [''],
      policy_from : [''],
      policy_to : [''],
      insurance_name : [''],
      product_name : [''],
      policy_type_name : [''],
      submit_btn : ['']

    });

    this.getFilterListData();

    this.getIndex();
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

        case 'policy_type_name':
          this.formRecodEdit.patchValue({policy_type_name : selected_value });
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

      case 'policy_type_name':
        this.formRecodEdit.patchValue({policy_type_name : '' });
        this.selectedPolicyType_name = "";
        break;

    }
  }

  getFilterListData(){
    this.commonService.getFilterListData()
    .subscribe( response => {
      this.filterResult = response;
      this.icList = this.filterResult.icList;
      this.productList = this.filterResult.productList;
      this.policyTypeList = this.filterResult.policyTypeList;
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
              url : this.base_url+'myaccount/get_dashboard_proposal',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Proposal No.',
              'data' : 'proposal_no'
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
              'title' : 'Ins. Company',
              'data' : 'ins_comp'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },
            {
              'title' : 'Policy Type',
              'data' : 'policy_type'
            },
            {
              'title' : 'Reg. No.',
              'data' : 'reg_no'
            },
            {
              'title' : 'Engine No.',
              'data' : 'engine_number'
            },
            {
              'title' : 'Chasis No.',
              'data' : 'chasis_number'
            },
            {
              'title' : 'Created Date',
              'data' : 'proposal_created_date'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],
          columnDefs: [
            { "orderable": false, "targets": 9 }
          ],
          order: [[ 0, "desc" ]],
          rowCallback: function( row, data, index ) {
            if ( data['breakin_status_id'] == 4 ){
              $('td', row).css('background-color', 'rgba(0, 128, 0, 0.4)');
            }

          }
      };
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
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
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;

    if( (this.filter_policy_no!='' && this.filter_policy_no!=null && this.filter_policy_no!=undefined) || (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined) || (this.policy_type_name != '' && this.policy_type_name != null && this.policy_type_name != undefined) ) {
        this.loaderActive = true;

        // this.dtRendered = true
        // this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search(this.filter_policy_no);
            dtInstance.columns(2).search(this.policy_from);
            dtInstance.columns(3).search(this.policy_to);
            dtInstance.columns(4).search(this.insurance_name);
            dtInstance.columns(5).search(this.product_name);
            dtInstance.columns(6).search(this.policy_type_name);
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
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('filter_policy_no',this.filter_policy_no);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);
    sendData.append('insurance_name',this.insurance_name);
    sendData.append('product_name',this.product_name);
    sendData.append('policy_type_name',this.policy_type_name);

    this.commonService.exportProposalData(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.proposalData = response;
        this.excelService.exportAsExcelFile(this.proposalData, 'ProposalData');

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
        policy_type_name : '',
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedPolicyType_name = "";

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

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("forward-proposal-no")) {
          this.getRecord(event.target.getAttribute("forward-proposal-no"),event.target.getAttribute("forward-proposal-email"));
        }
        if (event.target.hasAttribute("cancel-proposal")) {
          this.proposalCancel(event.target.getAttribute("cancel-proposal"));
        }
        if (event.target.hasAttribute("view-proposal-no")) {
          this.viewProposal(
            event.target.getAttribute("view-proposal-no"),
            event.target.getAttribute("view-proposal-unique-ref-no"),
            event.target.getAttribute("view-proposal-quote-no"),
            event.target.getAttribute("view-proposal-ic-id"),
            event.target.getAttribute("view-proposal_id")
          );
        }
        if (event.target.hasAttribute("download-proposal")) {
          this.downloadProposalPdf(event.target.getAttribute("download-proposal"));
        }
    });
  }

  getRecord(proposal_no,email){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Forward Proposal";
    this.display='none';
    this.setFormData(proposal_no,email);
  }

  setFormData(proposal_no,email){
    this.formForwardProposal.patchValue({
      proposal_no : proposal_no,
      email_1 : email
    });

  }

  resetForm(){
    this.submitted = false;
    this.formForwardProposal.patchValue({
      proposal_no : 0,
      email_1 : ''
    });

  }

  closePopup(){
    this.closebutton.nativeElement.click();
    this.display='block';
    this.resetForm();
  }

  closePopupSuccess(){
    this.display='block';
    this.resetForm();
  }

  closePopupFailed(){
    this.display='block';
  }

  submitForm(){
    this.submitted = true;
    if(this.formForwardProposal.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    var proposal_no = this.formForwardProposal.value.proposal_no;
    var email_1 = this.formForwardProposal.value.email_1;

    sendData.append('proposal_no',proposal_no);
    sendData.append('email_1',email_1);
    sendData.append('email_2','');

    this.commonService.submitFormForwardProposal(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.closePopup();

        Swal.fire("Proposal-"+ proposal_no +" sent successfully to "+ email_1, '', "success");
        // this.msgClass = "alert-success";
        // this.responseMsg = "Proposal-"+ proposal_no +" sent successfully to "+ email_1;
      }else{
        this.closePopupFailed();
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message;
      }
    });
  }

  proposalCancel(proposal_no){
    var sendData = new FormData();
    sendData.append('proposal_no',proposal_no);
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    })
    .then((willDelete) => {
      if (willDelete.value) {
        this.loaderActive = true;
        this.commonService.cancelProposal(sendData)
        .subscribe( response => {
          this.loaderActive = false;
          this.editResult = response;
          this.runTable();
          if(this.editResult.status){
            Swal.fire({
              title: 'success',
              html: "Proposal-"+ proposal_no +"  cancelled successfully",
              timer: 2000
            }).then((result) => {
               window.location.reload();
            })
          }else{
            Swal.fire (this.editResult.message,  "" ,  "error" );
          }

        });
      }
    });
  }

  viewProposal(proposal_no,unique_ref_no,quote_no,ic_id,proposal_id){
    this.loaderActive = true;
    if(proposal_no != '' && unique_ref_no != '' && quote_no != ''){
      sessionStorage.setItem('proposal_no', proposal_no);
      sessionStorage.setItem('proposal_id', proposal_id);
      sessionStorage.setItem('unique_ref_no', unique_ref_no);
      sessionStorage.setItem('quote_no', quote_no);
      sessionStorage.setItem('selected_ic_id', ic_id);
      this.router.navigateByUrl('/proposal');
    }
    else{
      this.loaderActive = false;
      Swal.fire ("Please try again",  "" ,  "error" );
    }
  }

  downloadProposalPdf(proposal_share_link){
    this.downloadFile(this.base_url+'downloadProposal/'+proposal_share_link);
  }

  downloadFile(download_url){
    window.open(download_url, '_blank');
  }

  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    var date2 : any = new Date(selected_date);

    this.formRecodEdit.patchValue({
      policy_to : ''
    });
    this.date_picker_policy_to =  this.setNullDate;

    this.minDateForToDate = {
      year: date2.getFullYear(),
      month: date2.getMonth() + 1,
      day: date2.getDate()
    }

  }
}

