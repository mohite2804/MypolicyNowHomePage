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
import { data } from 'jquery';
@Component({
  selector: 'app-feedfile',
  templateUrl: './feedfile.component.html'
})
export class FeedFileComponent implements OnInit {
  base_url : any = environment.baseUrl;
  
  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  loginicId : any;

  policyStatusId : any;
  adminUserRoleId : any;
  setNullDate : any;
  
  isIcListShow :boolean = true;

  submitted : any = false;
  formRecodEdit : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  isPolicyPresent:any;

  dtOptions: any = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 

  dtRendered = true;

  date_picker_startDate: NgbDateStruct;
  date_picker_endDate: NgbDateStruct;
  
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  
  maxDate : any;
  minDate : any;
  minCurrentDate:any;
  
  icList : any;
  productTypeList : any;
  mispList : any;
  selectedMisp_name : any;
  ic_id : any;
  feedfiledata : any;
  editResult : any;
  $data :any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) { 
    this.setNullDate = {
      year: "",
      month: "",
      day: ""
    };

    const current = new Date();
    this.minCurrentDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    this.policyStatusId = "1";
    this.loginUserId = sessionStorage.getItem('adminUserId');
    this.loginicId = sessionStorage.getItem('icId');
    this.adminUserRoleId = sessionStorage.getItem('adminUserRoleId');    
    const current = new Date();
    this.maxDate =this.maxDatePolicyTo = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.minDate = this.minDatePolicyFrom =  {
      year: current.getFullYear() - 1,
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    
     this.formRecodEdit = this.formBuilder.group({
        insurance_name : ['',[Validators.required]],
        startDate : ['',[Validators.required]],
        endDate : ['',[Validators.required]],
        product_type : ['',[Validators.required]]
     });




     this.getIcList();
     this.getMispList();
}

  exportAsXLSX(){
    if(this.formRecodEdit.invalid){
      Swal.fire({position: 'center',icon: 'error',title: 'Please fill all mandatory fields', showConfirmButton: false, timer: 3000 });
      return;
    }
     const sendData = new FormData();
     sendData.append('insurance_name',this.formRecodEdit.value.insurance_name);
     sendData.append('product_type',this.formRecodEdit.value.product_type);
     sendData.append('startDate',this.formRecodEdit.value.startDate);
     sendData.append('endDate',this.formRecodEdit.value.endDate);
   
     this.commonService.getFeedfileData(sendData)
        .subscribe( response => {
          this.feedfiledata = response;
          this.excelService.exportAsExcelFile(this.feedfiledata, 'FeedFile');
      });
   }
   getIcList(){
    const sendData = new FormData();
    sendData.append('LoginIid',this.loginUserId);
    sendData.append('IcId',this.loginicId);
    
    this.commonService.getFeedFileIcData(sendData)
      .subscribe( response => {
        this.icList = response;
    });

     this.commonService.getFeedFileProductTypeData(sendData)
      .subscribe( response => {
        this.productTypeList = response;
      });
  }
  
  getMispList(){
  
    this.commonService.getMispData()
      .subscribe( response => {
        this.mispList = response;
        this.mispList = this.mispList.result; 
      });
  }

  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    if(field == 'start_date'){
      this.date_picker_startDate =  selected_date;
      this.formRecodEdit.patchValue({ startDate : selected_date });
      this.validationEnddate(selected_date);
      
    }
    if(field == 'end_date'){
      this.date_picker_endDate =  selected_date;
      this.formRecodEdit.patchValue({ endDate : selected_date });
    }
  }

  validationEnddate(selected_date){
    var date2 : any = new Date(selected_date);
    this.formRecodEdit.patchValue({
      endDate : ''
    });
    this.date_picker_endDate =  this.setNullDate;
      date2.setDate( date2.getDate() + 1 );
      this.maxDatePolicyTo = {
        year: date2.getFullYear(),
        month: date2.getMonth() + 1,
        day: date2.getDate() 
      }
    }
}