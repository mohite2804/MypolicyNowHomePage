import { Component, OnInit,Renderer2, ViewChild, ChangeDetectorRef} from '@angular/core';
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
  selector: 'app-db-report',
  templateUrl: './db-report.component.html',
  styleUrls: ['./db-report.component.css']
})
export class DBReportComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  @ViewChild('closebutton') closebutton;

  unique_ref_no : any;
  policy_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;

  is_from_Policy_page :  boolean = true;
  loaderActive: boolean = false;
  displayForwardPolicy : any = 'none';
  formForwardPolicy : any;
  submittedForwardPolicy :  boolean = false;
  result_Policy_details : any;
  result_payment_types : any;
  success_message: any;
  error_message: any;
  formForwardPolicyEmail: any;
  formForwardPolicySms: any;

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;

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
  policySubTypeList : any;
  selectedInsurance_name : any;
  selectedProduct_name : any;
  selectedPolicyType_name : any;
  selectedPolicySubType_name : any;
  proposalData : any;

  search_insurance_name : any;

  filter_policy_no : any;
  policy_from : any;
  policy_to : any;
  insurance_name : any;
  product_name : any;
  policy_type_name : any;
  policy_sub_type_name : any;

  filterResult : any;

  results : any;
  business_data : any;
  ic_data : any;
  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) {

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

    this.formRecodEdit = this.formBuilder.group({
      filter_policy_no : [''],
      policy_from : [''],
      policy_to : [''],
      insurance_name : [''],
      product_name : [''],
      policy_type_name : [''],
      policy_sub_type_name : [''],
      submit_btn : ['']

    });

    this.getFilterListData();

    this.getIndex();
    this.policy_no  = sessionStorage.getItem('policy_no');
    this.validateProposal();
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
          this.selectedPolicySubType_name = "";
          this.getPolicySubTypesOfPolicyType();
          break;

        case 'policy_type_name':
          this.formRecodEdit.patchValue({policy_type_name : selected_value });
          this.selectedPolicySubType_name = "";
          this.getPolicySubTypesOfPolicyType();
          break;

        case 'policy_sub_type_name':
          this.formRecodEdit.patchValue({policy_sub_type_name : selected_value });
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

      case 'policy_sub_type_name':
        this.formRecodEdit.patchValue({policy_sub_type_name : '' });
        this.selectedPolicySubType_name = "";
        break;

    }
  }

  getFilterListData(){
    this.commonService.getPolicyTypeSubtypeData()
    .subscribe( response => {
      this.filterResult = response;
      this.policyTypeList = this.filterResult.policyTypeList;
      this.policySubTypeList = this.filterResult.policySubTypeList;
    });
  }

  getPolicySubTypeList(){
    this.commonService.getPolicySubTypeData()
    .subscribe( response => {
      this.filterResult = response;
      this.policySubTypeList = this.filterResult.policySubTypeList;
    });
  }

  getPolicySubTypesOfPolicyType(){
    this.product_name = this.formRecodEdit.value.product_name;
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;

    if((this.product_name!='' && this.product_name!=null && this.product_name!=undefined) || (this.policy_type_name!='' && this.policy_type_name!=null && this.policy_type_name!=undefined) ){

      this.loaderActive = true;
      const sendData = new FormData();
      
      sendData.append('product_type_id',this.product_name);
      sendData.append('policy_type_id',this.policy_type_name);

      this.commonService.getPolicySubTypesOfPolicyType(sendData)
        .subscribe(response =>{
          this.loaderActive = false;
          this.policySubTypeList = response;
          this.policySubTypeList = this.policySubTypeList.result;
          
      });
    }
    else{
      this.getPolicySubTypeList();
    }
  }

  validateProposal(){
    this.formForwardPolicy = this.formBuilder.group({
       email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required,Validators.email]],
    });

  }

  getIndex(){
    console.log('test pro..............');
    let sendData = new FormData();
    this.loaderActive = true;
    this.commonService.getDashboardReports(sendData)
    .subscribe(response => {
      this.results = response;
      this.loaderActive = false;
      
      this.business_data= this.results.dash_data;
      this.ic_data= this.results.insurance_data;
      console.log(this.ic_data);
    });
  }


  ngAfterViewInit(): void {
    
  }



  onParentIsAuthenticate(isAuthenticate : boolean){
    this.isAuthenticate = isAuthenticate;
    this.div_show_for_authenticate = !isAuthenticate;

  }

  openForwardPolicyModal(){
    this.displayForwardPolicy = 'block';
  }

  closePopupForwardPolicy(){
    this.closebutton.nativeElement.click();
    this.displayForwardPolicy='none';
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }
  resetFormForwardProposal(){
    this.submittedForwardPolicy = false;
    // this.formForwardPolicy.patchValue({
    //   email_2 : ''
    // });

  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      this.closePopupForwardPolicy();
    }, 2000);

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
    this.filter_policy_no = this.formRecodEdit.value.filter_policy_no;
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;
    this.policy_sub_type_name = this.formRecodEdit.value.policy_sub_type_name;

    if( (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined)  || (this.filter_policy_no != '' && this.filter_policy_no != null && this.filter_policy_no != undefined) || (this.policy_type_name != '' && this.policy_type_name != null && this.policy_type_name != undefined) || (this.policy_sub_type_name != '' && this.policy_sub_type_name != null && this.policy_sub_type_name != undefined)) {       
        this.loaderActive = true;
  
        // this.dtRendered = true
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search(this.filter_policy_no);
            dtInstance.columns(2).search(this.policy_from);
            dtInstance.columns(3).search(this.policy_to);
            dtInstance.columns(4).search(this.insurance_name);
            dtInstance.columns(5).search(this.product_name);
            dtInstance.columns(6).search(this.policy_type_name);
            dtInstance.columns(7).search(this.policy_sub_type_name);
            dtInstance.draw();
        });

        this.loaderActive = false;
        
    } else {

      Swal.fire("At least one field is required ", '', "error");
      return;
    }
    
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
        policy_sub_type_name : '',
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedPolicyType_name = "";
    this.selectedPolicySubType_name = "";
    
    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search('');
        dtInstance.columns(2).search('');
        dtInstance.columns(3).search('');
        dtInstance.columns(4).search('');
        dtInstance.columns(5).search('');
        dtInstance.columns(6).search('');
        dtInstance.columns(7).search('');
        dtInstance.draw();
    });

    this.getPolicySubTypeList();

    this.loaderActive = false;
  }


}
