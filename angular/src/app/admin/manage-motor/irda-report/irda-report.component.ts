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
  selector: 'app-irda-report',
  templateUrl: './irda-report.component.html',
  styleUrls: ['./irda-report.component.css']
})
export class IrdaReportComponent implements OnInit {
	
  base_url : any = environment.baseUrl;
submitted : any = false;
  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;
  adminUserRoleId : any;
 formRecodEdit : any;
  dp_name:any;
  msgClass : any;
  responseMsg : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  isPolicyPresent:any;
  adminUserTypeId:any;
  irdaPoliciesdata : any;
  postgetIrdaReport : any;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
 minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  maxDate : any;
  minDate : any;
  dtRendered = true;
date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;

  success_message: any;
  error_message: any;
  is_isuzu  : any;
  policyStatusId: any;
misp_name:any;
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
      
      policy_from : [''],
      policy_to : ['']

    });
    // this.enter_policy_no = "515151";
     
    this.getIndex();
   

  }


    
	exportAsXLSX(){ 
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
	sendData.append('report_type','business');
    this.commonService.postgetIrdaReport(sendData)
    .subscribe( response => {
      this.irdaPoliciesdata = response;
      //console.log(this.modelsdata); 
      this.excelService.exportAsExcelFile(this.irdaPoliciesdata, 'IrdaReport');
    });
  }
  exportClaimAsXLSX(){ 
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
	sendData.append('report_type','claim');
    this.commonService.postgetIrdaReport(sendData)
    .subscribe( response => {
      this.irdaPoliciesdata = response;
      //console.log(this.modelsdata); 
      this.excelService.exportAsExcelFile(this.irdaPoliciesdata, 'ClaimIrdaReport');
    });
  }
  exportGrievancesAsXLSX(){ 
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
	sendData.append('report_type','grievances');
    this.commonService.postgetIrdaReport(sendData)
    .subscribe( response => {
      this.irdaPoliciesdata = response;
      //console.log(this.modelsdata); 
      this.excelService.exportAsExcelFile(this.irdaPoliciesdata, 'GrievancesIrdaReport');
    });
  }
   submitForm(){


        this.submitted = true;

        if(this.formRecodEdit.invalid){
          return;
        }

        if(  
          this.formRecodEdit.value.policy_from != '' ||
          this.formRecodEdit.value.policy_to != '' 
          
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
           url : this.base_url+'admin/irdaPolicyReport',
           type : 'POST',
           data: {
            "loginUserId": this.loginUserId,
            "policy_no" : this.formRecodEdit.value.policy_no ,
            "policy_from" : this.date_picker_policy_from,
            "policy_to" : this.date_picker_policy_to,
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
                 'title' : 'Proposal Number',
                 'data' : 'proposal_no'
               },
			   
               {
                 'title' : 'Policy Number',
                 'data' : 'policy_no'
               },
               
               {
                'title' : 'Insurance Company',
                'data' : 'InsuranceCompany'
              },
              {
                'title' : 'Name Of The Proposer',
                'data' : 'policy_holder_name'
              },
			  {
                 'title' : 'Address Of The Life Assured',
                 'data' : 'AddressOfTheLifeAssured'
               },
               {
                 'title' : 'Sum Assured',
                 'data' : 'calculated_idv'
               },
               {
                 'title' : 'Start Date',
                 'data' : 'policy_start_date'
               },
               {
                 'title' : 'End Date',
                 'data' : 'policy_end_date'
               },

               {
                 'title' : 'Agent Name',
                 'data' : 'AgentName'
               },
               {
                 'title' : 'Payment Receipt Mode',
                 'data' : 'payment_method'
               },
               {
                 'title' : 'Policy Status',
                 'data' : '64vbstatus'
               },
                
               {
                 'title' : 'Payment Receipt Date',
                 'data' : 'payment_transaction_date'
               } 
               ],
        columnDefs: [
        { "orderable": false, "targets": 0 },
        { "orderable": false, "targets": 11 },
        { "orderable": false, "targets": 12 }
        ],
        order: [[ 11, "desc" ]],
      };

      // make sure your template notices it
      this.cdr.detectChanges();
      // initialize them again
      this.dtRendered = true
      this.cdr.detectChanges();
 


        this.loaderActive = false;

      }
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
                  url : this.base_url+'admin/irdaPolicyReport',
                  type : 'POST',
                  data: {
                   "loginUserId": this.loginUserId,
                    
                   "policy_from" : this.date_picker_policy_from,
                    
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
                 'title' : 'Proposal Number',
                 'data' : 'proposal_no'
               },
			   
               {
                 'title' : 'Policy Number',
                 'data' : 'policy_no'
               },
               
               {
                'title' : 'Insurance Company',
                'data' : 'InsuranceCompany'
              },
              {
                'title' : 'Name Of The Proposer',
                'data' : 'policy_holder_name'
              },
			  {
                 'title' : 'Address Of The Life Assured',
                 'data' : 'AddressOfTheLifeAssured'
               },
               {
                 'title' : 'Sum Assured',
                 'data' : 'calculated_idv'
               },
               {
                 'title' : 'Start Date',
                 'data' : 'policy_start_date'
               },
               {
                 'title' : 'End Date',
                 'data' : 'policy_end_date'
               },

               {
                 'title' : 'Agent Name',
                 'data' : 'AgentName'
               },
               {
                 'title' : 'Payment Receipt Mode',
                 'data' : 'payment_method'
               },
               {
                 'title' : 'Policy Status',
                 'data' : '64vbstatus'
               },
                
               {
                 'title' : 'Payment Receipt Date',
                 'data' : 'payment_transaction_date'
               } 
               ],
               columnDefs: [
               { "orderable": false, "targets": 0 },
               { "orderable": false, "targets": 11 },
               { "orderable": false, "targets": 12 }
               ],
               order: [[ 11, "desc" ]],
             };

          }
}
