import { AfterViewInit, Component, OnInit, Renderer2,ViewChild, ChangeDetectorRef  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../services/common.service';

import { DataTableDirective } from 'angular-datatables';

import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
@Component({
  selector: 'app-search-proposal',
  templateUrl: './search-proposal.component.html',
  styleUrls: ['./search-proposal.component.scss']
})
export class SearchProposalComponent implements OnInit {

  base_url : any = environment.baseUrl;

  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;
  adminUserRoleId : any;

  policyStatusId : any;

  submitted : any = false;
  formRecodEdit : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  isPolicyPresent:any;
  adminUserTypeId:any;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;


  date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  date_picker_policy_created_from: NgbDateStruct;
  date_picker_policy_created_to: NgbDateStruct;
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  maxDate : any;
  minDate : any;
  icList : any;
  mispList : any;
  selectedInsurance_name : any;
  selectedMisp_name : any;
  soldPoliciesdata : any;

  isIcListShow : any;
  search_insurance_name : any;

  selected_policy_no : any;
  displayForwardMessageBox : any = 'none';
  formForwardEmail: any;
  formForwardSms: any;

  submittedForwardEmail :  boolean = false;
  submittedForwardSms :  boolean = false;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  success_message: any;
  error_message: any;
  is_isuzu  : any;

  constructor(private customvalidationService: CustomvalidationService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) { 
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit(): void {
   this.policyStatusId = "1";
   this.loginUserId = sessionStorage.getItem('adminUserId');
   this.loginicId = sessionStorage.getItem('icId');
   this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');
   this.adminUserTypeId = sessionStorage.getItem('adminUserTypeId');
   console.log(this.adminUserTypeId);
   this.validateForwardMessageBox();

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

    this.formRecodEdit = this.formBuilder.group({
      policy_no : ['',[Validators.pattern("^([a-zA-Z0-9-/\/])+$")]],
      insured_mobile_no : [''],
      policy_from : [''],
      policy_to : [''],
      policy_created_from : [''],
      policy_created_to : [''],
      insurance_name : [''],
      misp_name : [''],
      submit_btn : ['']

    });
    // this.enter_policy_no = "515151";
    this.getIcList();
    this.getMispList();
    this.getIndex();
  }


  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'misp_name':
        this.formRecodEdit.patchValue({misp_name : selected_value });
        break;

        case 'insurance_name':
        this.formRecodEdit.patchValue({insurance_name : selected_value });
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

      case 'misp_name':
      this.formRecodEdit.patchValue({misp_name : '' });
      this.selectedMisp_name = "";
      break;


    }
  }


  exportAsXLSX(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getSoldPoliciessData(sendData)
    .subscribe( response => {
      this.soldPoliciesdata = response;
      //console.log(this.modelsdata);
      this.excelService.exportAsExcelFile(this.soldPoliciesdata, 'SoldPolicieslData');
    });
  }


  getIcList(){

    if(this.is_isuzu==1){
      const sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      this.commonService.getIcDataISUZU(sendData)
      .subscribe( response => {
        this.icList = response;
        this.icList = this.icList.result;
      });
    }else{
      this.commonService.getIcData()
      .subscribe( response => {
        this.icList = response;
        this.icList = this.icList.result;
      });

    }
  }

  getMispList(){

    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('adminUserTypeId',this.adminUserTypeId);

    this.commonService.getBpData(sendData)
    .subscribe( response => {
      this.mispList = response;
      this.mispList = this.mispList.data;
    });
  }


  // setFormData(result){

    //     this.formRecodEdit.patchValue({
      //     insurance_name : result.result.policy_no,
      //     misp_name : result.result.policy_no,
      //     submit_btn : result.result.policy_no
      //     });

      //   }



      submitForm(){
        
        this.submitted = true;

        if(this.formRecodEdit.invalid){
          return;
        }

        if( this.formRecodEdit.value.policy_no != '' ||
          this.formRecodEdit.value.insurance_name != ''
          ) {
          console.log('At least one field required......................');
        this.atLeastOneRequired = '';
        //return true;

      } else {
        this.atLeastOneRequired = 'At least one field required';
        console.log('At least one field is required');
        return false;
      }
      console.log("success_submit");
      this.loaderActive = true;

      if(this.loginicId!=0){
       this.search_insurance_name = this.loginicId;
     }
     else
       if(this.loginicId==0){
         this.search_insurance_name = this.formRecodEdit.value.insurance_name;
       }

       // const that = this;
       this.dtRendered = false;

       this.dtOptions = {
         "pagingType": 'full_numbers',
         "pageLength": 10,
         "searching":true,
         "serverSide": true,
         "processing": true,
         'ajax' : {
           url : this.base_url+'admin/searchProposalDetails',
           type : 'POST',
           data: {
            "loginUserId": this.loginUserId,
            "policy_no" : this.formRecodEdit.value.policy_no ,
            "insured_mobile_no" : this.formRecodEdit.value.insured_mobile_no ,
            "insurance_name" : this.search_insurance_name,
            "adminUserTypeId" : this.adminUserTypeId
          },
          dataType: "json",
        },
        columns: [
          {
            'title' : 'Sr.No',
            'data' : 'sr_no'
          },
         {
           'title' : 'Proposal Number',
           'data' : 'proposal_no'
         },
         {
           'title' : 'Name',
           'data' : 'policy_holder_name'
         },
         // {
         //   'title' : 'Mobile',
         //   'data' : 'policy_holder_mobile_no'
         // },
         // {
         //   'title' : 'Email',
         //   'data' : 'policy_holder_email'
         // },
         {
           'title' : 'OTP',
           'data' : 'OTP'
         },
         {
           'title' : 'IC',
           'data' : 'ic_name'
         },
         {
           'title' : 'Vehicle RegNo',
           'data' : 'vehicle_reg_no'
         },
        
         {
           'title' : 'Created at',
           'data' : 'proposal_created_date'
         },
         {
           'title' : 'Action',
           'data' : 'action_btn'
         }
         ],
        columnDefs: [
          { "orderable": false, "targets": 0 }
        ],
      };

      // make sure your template notices it
      this.cdr.detectChanges();
      // initialize them again
      this.dtRendered = true
      this.cdr.detectChanges();
        this.loaderActive = false;

      }
            getIndex(){
              const that = this;
              this.dtOptions = {
                "pagingType": 'full_numbers',
                "pageLength": 10,
                "searching":true,
                "serverSide": true,
                "processing": true,
                'ajax' : {
                  url : this.base_url+'admin/searchProposalDetails',
                  type : 'POST',
                  data: {
                   "loginUserId": this.loginUserId,
                   "policy_no" : this.formRecodEdit.value.policy_no ,
                   "insured_mobile_no" : this.formRecodEdit.value.insured_mobile_no ,
                   "insurance_name" : this.search_insurance_name,
                   "adminUserTypeId" : this.adminUserTypeId
                 },
                 dataType: "json",
               },
               columns: [
                {
                  'title' : 'Sr.No',
                  'data' : 'sr_no'
                },
               {
                 'title' : 'Proposal Number',
                 'data' : 'proposal_no'
               },
               {
                 'title' : 'Name',
                 'data' : 'policy_holder_name'
               },
               // {
               //   'title' : 'Mobile',
               //   'data' : 'policy_holder_mobile_no'
               // },
               // {
               //   'title' : 'Email',
               //   'data' : 'policy_holder_email'
               // },
               {
                 'title' : 'OTP',
                 'data' : 'OTP'
               },
               {
                 'title' : 'IC',
                 'data' : 'ic_name'
               },
               {
                 'title' : 'Vehicle RegNo',
                 'data' : 'vehicle_reg_no'
               },
              
               {
                 'title' : 'Created at',
                 'data' : 'proposal_created_date'
               },
               {
                 'title' : 'Action',
                 'data' : 'action_btn'
               }
               ],
               columnDefs: [
               { "orderable": false, "targets": 0 }
               ],
               order: [[ 6, "desc" ]],
             };

          }



          ngAfterViewInit(): void {
            this.renderer.listen('document', 'click', (event) => {
              if (event.target.hasAttribute("send-details")) {
                this.selected_policy_no = event.target.getAttribute("send-policy-no");


                this.formForwardEmail.patchValue({
                  email_1 : event.target.getAttribute("send-email-id")
                });

                this.formForwardSms.patchValue({
                  mobile_no : event.target.getAttribute("send-mobile-no")
                });

                this.openPopupForSendDetails();
              }

            });

          }

          downloadPolicy(url){
           window.open(url, '_blank');
         }

         downloadProposal(url){
           window.open(url, '_blank');
         }

         downloadPreviousPolicy(url){
           window.open(url, '_blank');
         }
 downloadReport(download_url){
   window.open(download_url, '_blank  ');
 }



 openPopupForSendDetails(){

  this.displayForwardMessageBox  = "block";
}

closePopupForSendDetails(){
  this.displayForwardMessageBox='none';
  this.loaderActive = false;
}

removeMessage(){
  setTimeout (() => {
    this.success_message = "";
    this.error_message = "";
    this.selected_policy_no = "";
    this.closePopupForSendDetails();

  }, 2000);

}

validateForwardMessageBox(){
  this.formForwardEmail = this.formBuilder.group({
    email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required,Validators.email]],
  });
  this.formForwardSms = this.formBuilder.group({
    mobile_no : ['',[Validators.pattern(this.validation_for_mobile_no), Validators.required]],
  });

}


}
