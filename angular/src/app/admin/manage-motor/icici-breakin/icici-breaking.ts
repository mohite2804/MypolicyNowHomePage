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
  selector: 'app-icici-breaking',
  templateUrl: './icici-breaking.html',
  styleUrls: ['./icici-breaking.scss']
})
export class GetICICIBreakinComponent implements OnInit {
	
  base_url : any = environment.baseUrl;

  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;
  adminUserRoleId : any;

  policyStatusId : any;

  submitted : any = false;
  formRecodEdit : any;
  editResult : any;
  msgClass : any;
  responseMsg : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  isPolicyPresent:any;
  adminUserTypeId:any;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;


  success_message: any;
  error_message: any;
  is_isuzu  : any;

  constructor(private customvalidationService: CustomvalidationService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) { 
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit(): void {
   this.loginUserId = sessionStorage.getItem('adminUserId');
   this.loginicId = sessionStorage.getItem('icId');
   this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');
   this.adminUserTypeId = sessionStorage.getItem('adminUserTypeId');


    this.formRecodEdit = this.formBuilder.group({
      policy_no : ['',[Validators.required,Validators.pattern("^([a-zA-Z0-9-,/\/])+$")]],
      submit_btn : ['']

    });
    // this.enter_policy_no = "515151";
  }

  submitForm(){
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('policy_no',this.formRecodEdit.value.policy_no);
    this.commonService.postFuturePolicyTagging(sendData)
    .subscribe(response =>{
    this.loaderActive = false;
     this.editResult = response;
      if(this.editResult.status){
          Swal.fire(this.editResult.message, '', "success"); 
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
          this.resetForm();
          
      }else{
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
      }
    });
  }
  
  resetForm(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      policy_no : '',
    });
  }
}
