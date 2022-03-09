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
  selector: 'app-dealer-cheque',
  templateUrl: './dealer-cheque.component.html',
  styleUrls: ['./dealer-cheque.component.scss']
})
export class DealerChequeComponent implements OnInit {

  base_url : any = environment.baseUrl;

  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;
  adminUserRoleId : any;

  policyStatusId : any;

  submitted : any = false;
  selected_cheque_date : any = false;
  submitted_filter : any = false;

  formRecodEdit : any;
  formRecodUpdate : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  isPolicyPresent:any;
  adminUserTypeId:any;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;


  date_picker_policy_from: NgbDateStruct;
  date_picker_policy: NgbDateStruct;
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
  showForm :  boolean = false;
  policy_id : any;
  policy_sum : any;

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
      policy_created_from : [''],
      policy_created_to : [''],
      insurance_name : [''],
      misp_name : [''],
      submit_btn : ['']
    });
   
    this.formRecodUpdate = this.formBuilder.group({
      total_amount : [''],
      cheque_no : ['',[Validators.required]],
      cheque_date : ['',[Validators.required]],
      bank_name : ['',[Validators.required]],
      bank_branch : ['',[Validators.required]],
      checkArray: this.formBuilder.array([])
    });

    // this.enter_policy_no = "515151";
    this.getIcList();
    this.getMispList();
    this.getIndex();

    if(this.is_isuzu==1){
      this.accessdisplay='none';
    }

  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
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
    submitForm(){


        this.submitted = true;
        this.showForm = false;
        this.resetForm();

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
           url : this.base_url+'admin/getDealerCheque',
           type : 'POST',
           data: {
            "loginUserId": this.loginUserId,
            "policy_no" : this.formRecodEdit.value.policy_no ,
            "policy_from" : this.date_picker_policy_from,
            "policy_to" : this.date_picker_policy_to,
            "policy_created_from" : this.date_picker_policy_created_from,
            "policy_created_to" : this.date_picker_policy_created_to,
            "insurance_name" : this.search_insurance_name,
            "misp_name" : this.formRecodEdit.value.misp_name,
            "adminUserTypeId" : this.adminUserTypeId
          },
          dataType: "json",
        },
        columns: [
          {
            'title' : '<input type="checkbox" name="inputChecked" (click)="Checkedall()">',
            'data' : 'action_btn'
          },
          {
            'title' : 'Sr.No',
            'data' : 'sr_no'
          },
         {
           'title' : 'Policy Number',
           'data' : 'policy_no'
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
           'title' : 'Policy Amount',
           'data' : 'total_premium'
         },
         {
           'title' : 'IC Name',
           'data' : 'ic_name'
         },
         {
           'title' : 'Policy Created Date',
           'data' : 'policy_created_at'
         }
         ],
        columnDefs: [
          { "orderable": false, "targets": 0 },
          { "orderable": false, "targets": 1 },
          { "orderable": false, "targets": 9 }
        ],
        order: [[ 9, "desc" ]],
      };

      // make sure your template notices it
      this.cdr.detectChanges();
      // initialize them again
      this.dtRendered = true
      this.cdr.detectChanges();




        this.loaderActive = false;

      }

      Checkedall(){
        alert('Vinit Mishra');
      }
    
      onselectAll(e){
        console.log(e.target.checked);
        console.log(e.target.value);
        const checkArray: FormArray = this.formRecodUpdate.get('checkArray') as FormArray;
        if (e.target.checked) {
          this.showForm=true;
          checkArray.push(new FormControl(e.target.value));
        } else {
          let i: number = 0;
          checkArray.controls.forEach((item: FormControl) => {
            if (item.value == e.target.value) {
              checkArray.removeAt(i);
              return;
            }
            i++;
          });
          if(checkArray.length==0){
            this.showForm=false;
          }
        }
        if(checkArray.length>0){
          this.policy_id = checkArray.value;
          console.log(checkArray.value);
  
          var sendData = new FormData();
          sendData.append('policy_id',this.policy_id);
          this.commonService.getpolicyamount(sendData)
          .subscribe( response => {
            this.loaderActive = false;
              this.policy_sum = response;
              if(this.policy_sum.status==true){
                console.log(this.policy_sum.TotalCount.total_premium);
                this.formRecodUpdate.patchValue({
                  total_amount : this.policy_sum.TotalCount.total_premium
                });
              }
          });
        }
      }
      checkAllCheckBox(ev) {
        console.log(ev);
        // this.products.forEach(x => x.checked = ev.target.checked)
      }
    
      isAllCheckBoxChecked() {
        alert('Vinit Mishra 1');
        // return this.products.every(p => p.checked);
      }
    
            getIndex(){
              this.dp_name='PSO';
              this.misp_name='Business Partner Name';
              if(this.is_isuzu==1){
                this.dp_name='DP';
                this.misp_name='MISP';
              }
              this.showForm = false;
              this.resetForm();

              const that = this;
              this.dtOptions = {
                "pagingType": 'full_numbers',
                "pageLength": 10,
                "searching":true,
                "serverSide": true,
                "processing": true,
                'ajax' : {
                  url : this.base_url+'admin/getDealerCheque',
                  type : 'POST',
                  data: {
                   "loginUserId": this.loginUserId,
                   "policy_no" : this.formRecodEdit.value.policy_no ,
                   "policy_from" : this.date_picker_policy_from,
                   "policy_to" : this.date_picker_policy_to,
                   "policy_created_from" : this.date_picker_policy_created_from,
                   "policy_created_to" : this.date_picker_policy_created_to,
                   "insurance_name" : this.search_insurance_name,
                   "misp_name" : this.formRecodEdit.value.misp_name,
                   "adminUserTypeId" : this.adminUserTypeId
                 },
                 dataType: "json",
               },
               columns: [
                {
                  'title' : '<input type="checkbox" name="inputChecked" [checked]="isAllCheckBoxChecked()" (change)="checkAllCheckBox($event)"">',
                  'data' : 'action_btn'
                },
                {
                  'title' : 'Sr.No',
                  'data' : 'sr_no'
                },
               {
                 'title' : 'Policy Number',
                 'data' : 'policy_no'
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
                  'title' : 'Policy Amount',
                  'data' : 'total_premium'
                },
               {
                 'title' : 'IC Name',
                 'data' : 'ic_name'
               },
               {
                 'title' : 'Policy Created Date',
                 'data' : 'policy_created_at'
               }
               ],
               columnDefs: [
               { "orderable": false, "targets": [0,1,9] }
               ],
               order: [[ 9, "desc" ]],
             };

          }



          ngAfterViewInit(): void {
            this.renderer.listen('document', 'click', (event) => {
              if (event.target.hasAttribute("view-edit-id")) {
                this.onselectAll(event);
              }
            });

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

          submitFormFilter(){
            this.submitted_filter = true;
            
            if(this.formRecodUpdate.invalid){
              return;
            }
            
            this.loaderActive = true;
            this.selected_cheque_date = JSON.stringify(this.formRecodUpdate.value.cheque_date);
            const sendData = new FormData();
        
            sendData.append('cheque_no',this.formRecodUpdate.value.cheque_no);
            sendData.append('cheque_date',this.selected_cheque_date);
            sendData.append('bank_name',this.formRecodUpdate.value.bank_name);
            sendData.append('bank_branch',this.formRecodUpdate.value.bank_branch);
            sendData.append('total_amount',this.formRecodUpdate.value.total_amount);
            sendData.append('policy_id',this.policy_id);
            sendData.append('loginUserId',this.loginUserId);
            sendData.append('loginUserTypeId',this.adminUserTypeId);
            
            this.commonService.POSTDealerCheque(sendData)
            .subscribe(response =>{
              this.loaderActive = false;
              var result : any  = response;
              if(result.status){
                Swal.fire(result.message, '', "success");
                this.runTable();
                this.resetForm();
              }else{
                Swal.fire(result.message, '', "error");
              }
            });
          }
          resetForm(){
            this.submitted_filter = false;
            this.formRecodUpdate.patchValue({
              cheque_no : '',
              cheque_date : '',
              bank_name : '',
              bank_branch : '',
              total_amount : '',
              policy_id : '',
            });
            this.showForm=false;
          }
}
