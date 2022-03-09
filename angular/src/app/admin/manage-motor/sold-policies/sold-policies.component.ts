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
  selector: 'app-sold-policies',
  templateUrl: './sold-policies.component.html',
  styleUrls: ['./sold-policies.component.scss']
})
export class SoldPoliciesComponent implements OnInit {

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
  accessdisplay : any = 'block';
  formForwardEmail: any;
  formForwardSms: any;

  submittedForwardEmail :  boolean = false;
  submittedForwardSms :  boolean = false;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  success_message: any;
  error_message: any;
  is_isuzu  : any;
  dp_name  : any;
  misp_name  : any;
  policy_from :any;
  policy_to :any;

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
      policy_from : [''],
      policy_to : [''],
/*      policy_created_from : [''],
      policy_created_to : [''],*/
      insurance_name : [''],
      misp_name : [''],
      submit_btn : ['']

    });
    // this.enter_policy_no = "515151";
    this.getIcList();
    this.getMispList();
    this.getIndex();

    if(this.is_isuzu==1){
      this.accessdisplay='none';
    }

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
    this.submitted = true;

        if(this.formRecodEdit.invalid){
          return;
        }
        this.policy_from ='';
        this.policy_to ='';
        if( this.formRecodEdit.value.policy_no != '' ||
          this.formRecodEdit.value.policy_from != '' ||
          this.formRecodEdit.value.policy_to != '' ||
          this.formRecodEdit.value.insurance_name != '' ||
          this.formRecodEdit.value.misp_name != ''
          ) {
          console.log('At least one field required......................');
        this.atLeastOneRequired = '';
        this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
        this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
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
      // this.dtRendered = false;
        this.dp_name='PSO';
        this.misp_name='Business Partner Name';
        if(this.is_isuzu==1){
          this.dp_name='DP';
          this.misp_name='MISP';
        }

    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('policy_no',this.formRecodEdit.value.policy_no);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);
    sendData.append('insurance_name',this.search_insurance_name);
    sendData.append('misp_name',this.formRecodEdit.value.misp_name);
    sendData.append('adminUserTypeId',this.adminUserTypeId);
    
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
          this.formRecodEdit.value.policy_from != '' ||
          this.formRecodEdit.value.policy_to != '' ||
          this.formRecodEdit.value.policy_created_from != '' ||
          this.formRecodEdit.value.policy_created_to != '' ||
          this.formRecodEdit.value.insurance_name != '' ||
          this.formRecodEdit.value.misp_name != ''
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
        this.dp_name='PSO';
        this.misp_name='Business Partner Name';
        if(this.is_isuzu==1){
          this.dp_name='DP';
          this.misp_name='MISP';
        }

       this.dtOptions = {
         "pagingType": 'full_numbers',
         "pageLength": 10,
         "searching":true,
         "serverSide": true,
         "processing": true,
         'ajax' : {
           url : this.base_url+'admin/getPolicyDetails',
           type : 'POST',
           data: {
            "loginUserId": this.loginUserId,
            "policy_no" : this.formRecodEdit.value.policy_no ,
            "policy_from" : this.date_picker_policy_from,
            "policy_to" : this.date_picker_policy_to,
            /*"policy_created_from" : this.date_picker_policy_created_from,
            "policy_created_to" : this.date_picker_policy_created_to,*/
            "insurance_name" : this.search_insurance_name,
            "misp_name" : this.formRecodEdit.value.misp_name,
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
           'title' : 'Policy Number',
           'data' : 'policy_no'
         },
         {
           'title' : 'Policy Duration',
           'data' : 'policy_duration'
         },
         {
           'title' : this.misp_name,
           'data' : 'name'
         },
         {
           'title' : this.dp_name,
           'data' : 'dp_name'
         },
         {
           'title' : 'Customer Name',
           'data' : 'policy_holder_name'
         },
         {
           'title' : 'Product Type',
           'data' : 'product_type'
         },
         {
           'title' : 'IC Name',
           'data' : 'ic_name'
         },

         {
           'title' : 'Vehicle RegNo',
           'data' : 'vehicle_reg_no'
         },
         {
           'title' : 'Payment type',
           'data' : 'payment_method'
         },
         {
           'title' : '64VbStatus',
           'data' : '64vbstatus'
         },
         {
           'title' : 'Cancellation Status',
           'data' : 'policy_status_id'
         },
         {
           'title' : 'Policy Created Date',
           'data' : 'policy_created_at'
         },
         {
           'title' : 'Action',
           'data' : 'action_btn'
         }
         ],
        columnDefs: [
        { "orderable": false, "targets": 0 },
        { "orderable": false, "targets": 12 },
        { "orderable": false, "targets": 13 }
        ],
        order: [[ 12, "desc" ]],
      };

      // make sure your template notices it
      this.cdr.detectChanges();
      // initialize them again
      this.dtRendered = true
      this.cdr.detectChanges();





      //this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //this.dtOptions.destroy();
        //dtInstance.ajax.data.status = this.statusval;

        //dtInstance.ajax.url(this.base_url+'get_endorsementByStatus/'+this.statusval).load();
        //dtInstance.draw();
        // dtInstance.search( this.statusval ).draw();
        //  dtInstance.columns(0).search(this.statusval).draw();
        // dtInstance.column(11).search(this.statusval, true, false).draw();

        //this.dtOptions.reload();
        //dtInstance.draw();
        //this.dtTrigger.next();
        //});


        this.loaderActive = false;

      }

      // reRenderDataTable(): void {
        // }

        downloadPolicyCustom(){

          if (this.formRecodEdit.value.policy_no != '') {
            console.log(this.formRecodEdit.value.policy_no);
            this.atLeastOneRequired = '';
            this.isPolicyPresent = false;
            //this.isPolicyPresent = await this.policyExist(this.formRecodEdit.value.policy_no);

            var sendData = new FormData();
            sendData.append('policy_no',this.formRecodEdit.value.policy_no);
            this.commonService.policyExist(sendData)
            .subscribe(response => {
              console.log(response);
              this.isPolicyPresent = response;
              this.isPolicyPresent = this.isPolicyPresent.isPolicyExist;
              console.log(this.isPolicyPresent);
              if(this.isPolicyPresent){
                this.atLeastOneRequired = '';
                window.open(this.base_url+'downloadPolicy/'+this.formRecodEdit.value.policy_no,'_blank');
                // window.open(this.base_url+'downloadPolicy/'+this.formRecodEdit.value.policy_no, 'download_window', 'toolbar=0,location=no,directories=0,status=0,scrollbars=0,resizeable=0,width=1,height=1,top=0,left=0');
                // window.focus();
              }else{
                this.atLeastOneRequired = 'Policy No Not Exist';
                return false;
              }
              this.loaderActive = false;
            });
            console.log(this.isPolicyPresent);
          } else {
            this.atLeastOneRequired = 'Policy No Is Required';
            console.log('At least one field is required');
            return false;
          }

        }

        // policyExist(policy_no)
        // {
          //   this.loaderActive = true;
          //   var sendData = new FormData();
          //   sendData.append('policy_no',policy_no);
          //   // this.commonService.policyExist(sendData)
          //   // .subscribe(response => {
            //   //   console.log(response);
            //   //   this.isPolicyExist = response.isPolicyExist;
            //   //   console.log(this.isPolicyExist);
            //   //   this.loaderActive = false;
            //   // });

            //   return this.commonService.policyExist(sendData).toPromise();
            // }

            getIndex(){
              this.dp_name='PSO';
              this.misp_name='Business Partner Name';
              if(this.is_isuzu==1){
                this.dp_name='DP';
                this.misp_name='MISP';
              }

              const that = this;
              this.dtOptions = {
                "pagingType": 'full_numbers',
                "pageLength": 10,
                "searching":true,
                "serverSide": true,
                "processing": true,
                'ajax' : {
                  url : this.base_url+'admin/getPolicyDetails',
                  type : 'POST',
                  data: {
                   "loginUserId": this.loginUserId,
                   "policy_no" : this.formRecodEdit.value.policy_no ,
                   "policy_from" : this.date_picker_policy_from,
                   "policy_to" : this.date_picker_policy_to,
                   /*"policy_created_from" : this.date_picker_policy_created_from,
                   "policy_created_to" : this.date_picker_policy_created_to,*/
                   "insurance_name" : this.search_insurance_name,
                   "misp_name" : this.formRecodEdit.value.misp_name,
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
                 'title' : 'Policy Number',
                 'data' : 'policy_no'
               },
               {
                 'title' : 'Policy Duration',
                 'data' : 'policy_duration'
               },
               {
                'title' : this.misp_name,
                'data' : 'name'
              },
              {
                'title' : this.dp_name,
                'data' : 'dp_name'
              },
               {
                 'title' : 'Customer Name',
                 'data' : 'policy_holder_name'
               },
               {
                 'title' : 'Product Type',
                 'data' : 'product_type'
               },
               {
                 'title' : 'IC Name',
                 'data' : 'ic_name'
               },

               {
                 'title' : 'Vehicle RegNo',
                 'data' : 'vehicle_reg_no'
               },
               {
                 'title' : 'Payment type',
                 'data' : 'payment_method'
               },
               {
                 'title' : '64VbStatus',
                 'data' : '64vbstatus'
               },
               {
                 'title' : 'Cancellation Status',
                 'data' : 'policy_status_id'
               },
               {
                 'title' : 'Policy Created Date',
                 'data' : 'policy_created_at'
               },
               {
                 'title' : 'Action',
                 'data' : 'action_btn'
               }
               ],
               columnDefs: [
               { "orderable": false, "targets": 0 },
               { "orderable": false, "targets": 12 },
               { "orderable": false, "targets": 13 }
               ],
               order: [[ 12, "desc" ]],
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

         downloadExcel(){
           this.loaderActive = true;
           var sendData = new FormData();
           sendData.append('loginUserId',this.loginUserId);
           sendData.append('policyStatusId',this.policyStatusId);
   /*this.motorService.downloadExcelForSoldPolicies(sendData)
   .subscribe(response => {
     var result : any = response;
     this.loaderActive = false;
     if(result.status){
       var download_url : any = result.download_url;
       this.downloadReport(download_url);
       Swal.fire(result.message,  "" ,  "success" );
     }else{
       Swal.fire(result.message,  "" ,  "error" );
     }

   });  */

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

submitFormForwardEmail(){
  this.submittedForwardEmail = true;
  if(this.formForwardEmail.invalid){
    return;
  }

  this.loaderActive = true;
  const sendData = new FormData();
  sendData.append('email_id',this.formForwardEmail.value.email_1);
  sendData.append('policy_no',this.selected_policy_no);

  this.commonService.submitFormForwardPolicy(sendData)
  .subscribe(response =>{
    this.loaderActive = false;
    var outputResult : any = response;
    if(outputResult.status){
      this.success_message = outputResult.message;
      this.removeMessage();
    }else{
      this.error_message = outputResult.message;
    }

  });

}

submitFormForwardSms(){

  this.submittedForwardSms = true;
  if(this.formForwardSms.invalid){
    return;
  }
  this.loaderActive = true;
  const sendData = new FormData();
  sendData.append('policy_no',this.selected_policy_no);
  sendData.append('mobile_1',this.formForwardSms.value.mobile_no);


  this.commonService.submitFormForwardSms(sendData)
  .subscribe(response =>{
    this.loaderActive = false;
    var outputResult : any = response;
    if(outputResult.status){
      outputResult.status
      this.success_message = outputResult.message;
      this.removeMessage();
    }else{
      this.error_message = outputResult.message;
    }

  });

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
