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
  selector: 'app-offline-policy',
  templateUrl: './offline-policy.component.html',
  styleUrls: ['./offline-policy.component.css']
})
export class OfflinePolicyComponent implements OnInit {
	
  base_url : any = environment.baseUrl;
submitted : any = false;
  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;
  adminUserRoleId : any;
 formRecodEdit : any;
 editResult : any;
  offline_policy_file_upload_label : any;
  formComissionUpload : any;
  public_path : any;
  btnEditSubmit : boolean = false;
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
  display : any;
  success_message: any;
  error_message: any;
  is_isuzu  : any;
  policyStatusId: any;
  misp_name:any;
  access_permission : any; 
  detectChanges:any;
  policy_from :any;
  policy_to:any;
  display_invalid:any;
  invalid_data:any;
    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService,public cdr: ChangeDetectorRef) {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.access_permission = sessionStorage.getItem("access_permission");
    }

  ngOnInit(): void {
	   
   this.policyStatusId = "1";
   this.loginUserId = sessionStorage.getItem('adminUserId');
   this.loginicId = sessionStorage.getItem('icId');
   this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');
   this.adminUserTypeId = sessionStorage.getItem('adminUserTypeId');
   console.log(this.adminUserTypeId);
  this.offline_policy_file_upload_label = "";
        this.formComissionUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
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

    this.formRecodEdit = this.formBuilder.group({
      
      policy_from : [''],
      policy_to : ['']

    });
    // this.enter_policy_no = "515151";
     
    this.getIndex();
   this.getPublicPath();

  }
 getPublicPath(){
        this.commonService.getPublicPath()
        .subscribe(response =>{
            this.editResult = response;
            this.public_path = this.editResult.public_path;
        })
    }
 openModel(){
        this.btnEditSubmit = true;
        this.display='none';
    }

  openModelInvalid()
  {
    //$('#openmodal_invalid').modal('show'); 
    this.display_invalid='none';
  }

  download()
  {
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.downloadInvalidData(sendData)
    .subscribe( response => {
      this.invalid_data = response;
      //console.log(this.modelsdata); 
      this.excelService.exportAsExcelFile(this.invalid_data, 'InvalidOfflinePolicy');
    });

  }
    
	exportAsXLSX(){ 
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
	sendData.append('report_type','offline');
    this.commonService.postgetIrdaReport(sendData)
    .subscribe( response => {
      this.irdaPoliciesdata = response;
      //console.log(this.modelsdata); 
      this.excelService.exportAsExcelFile(this.irdaPoliciesdata, 'OfflinePolicy');
    });
  }
   uploadComission(event){
		 
        var file :any = event.target.files[0];
	    var file_type:any = file.type;
        var file_size :any = file.size ;
        if(file_type.toLowerCase() != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            Swal.fire ("Please Select 'xslx' file",  "" ,  "error" );
        }else if(file_size > 5242880){
            Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        }else{
            this.offline_policy_file_upload_label = file.name;
            this.formComissionUpload.patchValue({
                'comission_file_upload' : file
            });
			 
        }
    }
  submitComissionFile(){
        this.submitted = true;
		
        if(this.formComissionUpload.invalid){
            return;
        }
        this.loaderActive = true;
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formComissionUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
		 
        this.commonService.uploadOfflinePolicy(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            this.loaderActive = false;  
            
            if(this.editResult.status){ 
			this.loaderActive = false;			
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
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
                  url : this.base_url+'admin/OfflinePolicy',
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
                'data' : 'insurance_name'
              },
              /*{
                'title' : 'Name Of The Proposer',
                'data' : 'name_of_the_proposer'
              },*/
               /*{
                 'title' : 'Address Of The Life Assured',
                 'data' : 'address_of_the_life_assured'
               },*/
               {
                 'title' : 'Sum Assured',
                 'data' : 'idv_sum_assured'
               },
               {
                 'title' : 'Start Date',
                 'data' : 'policy_start_date'
               },
               {
                 'title' : 'End Date',
                 'data' : 'policy_end_date'
               },

   /*            {
                 'title' : 'Agent Name',
                 'data' : 'agent_name'
               },*/
               {
                 'title' : 'Previous Policy Number',
                 'data' : 'prev_policy_no'
               },
               {
                 'title' : 'Policy Status',
                 'data' : 'policy_status'
               }
               ],
               columnDefs: [
                { "orderable": false, "targets": 0 },
                { "orderable": false, "targets": 7 },
                { "orderable": false, "targets": 8 }
                ],
                order: [[ 7, "desc" ]],

             };

          }
		   windowReload(){
        window.location.reload();
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
        this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
        this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
        this.atLeastOneRequired = '';
        //return true;

        } else {
        this.atLeastOneRequired = 'At least one field required';
        console.log('At least one field is required');
        return false;
        }

     if( this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined)
    {   
        this.loaderActive = true;
   
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(5).search(this.policy_from);
            dtInstance.columns(6).search(this.policy_to);
            dtInstance.draw();
        });

        
      this.loaderActive = false;
  } else {

        Swal.fire("At least one field is required ", '', "error");
        return;
      }

      // make sure your template notices it
     // this.cdr.detectChanges();
      // initialize them again
      this.dtRendered = true
      //this.cdr.detectChanges();
 

        }

}
