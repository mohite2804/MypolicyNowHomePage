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
  selector: 'app-pos-report',
  templateUrl: './pos-report.component.html'
})
export class PosReportComponent implements OnInit {
  base_url : any = environment.baseUrl;
  
  loaderActive : boolean =  false;
  result : any;
  loginUserId : any;
  pos_id : any;
  loginicId : any;

  policyStatusId : any;
  adminUserRoleId : any;
  setNullDate : any;
  
  isIcListShow :boolean = true;
  showTbl :boolean = true;

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
  
  policydata : any;
  icList : any;
  posList : any;
  mispList : any;
  selectedMisp_name : any;
  ic_id : any;
  feedfiledata : any;
  editResult : any;
  $data :any;
  ShowforAdmin : boolean = true;
  
  is_isuzu  : any;
  dp_name  : any;
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

    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit(): void {
    this.showTbl=false;
    this.policyStatusId = "1";
    this.pos_id=sessionStorage.getItem('user_id');
    this.loginUserId = sessionStorage.getItem('adminUserId');
    
    if(sessionStorage.getItem('adminUserId')){
      this.ShowforAdmin=true;
    }else{
      this.ShowforAdmin=false;
    }
    this.dp_name='POS'
    if(this.is_isuzu==1){
      this.dp_name='DP'
    }
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
    if(sessionStorage.getItem('adminUserId')){
      this.formRecodEdit = this.formBuilder.group({
         insurance_name : [''],
         pos_name : [''],
         startDate : ['',[Validators.required]],
         endDate : ['',[Validators.required]]
      });
      this.getPOSList();
    }else{
        this.formRecodEdit = this.formBuilder.group({
          insurance_name : [''],
          pos_name : [''],
          startDate : ['',[Validators.required]],
          endDate : ['',[Validators.required]]
      });
    }
     this.getIcList();
    //  this.getMispList();
}

  exportAsXLSX(){
    this.loaderActive=true;
    if(this.formRecodEdit.invalid){
      this.loaderActive=false;
      Swal.fire({position: 'center',icon: 'error',title: 'Please fill all mandatory fields', showConfirmButton: false, timer: 3000 });
      return;
    }
      const sendData = new FormData();
      sendData.append('insurance_name',this.formRecodEdit.value.insurance_name);
      if(sessionStorage.getItem('adminUserId')){
       sendData.append('adminUserId',sessionStorage.getItem('adminUserId'));
       sendData.append('pos_name',this.formRecodEdit.value.pos_name);
      }else{
        sendData.append('adminUserId','');
        sendData.append('pos_name',this.pos_id);
      }
      sendData.append('startDate',this.formRecodEdit.value.startDate);
      sendData.append('endDate',this.formRecodEdit.value.endDate);
   
     this.commonService.getPosReport(sendData)
        .subscribe( response => {
          console.log(response);
          this.feedfiledata = response;
          this.policydata = response;
          if(this.feedfiledata.status==true){
            this.feedfiledata = this.feedfiledata.result;
            this.policydata= this.policydata.rturn_arr;
            this.excelService.exportAsExcelFile(this.feedfiledata, 'Pos_Report');
            this.loaderActive=false;
            this.showTbl=true;
          }else{
            Swal.fire("Not able to Find Data based on Filter", '', "error");
            this.loaderActive=false;
          }
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
  getPOSList(){
    if(this.is_isuzu==1){
      const sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      this.commonService.getPosDataISUZU(sendData)
      .subscribe( response => {
        this.posList = response;
        this.posList = this.posList.result;
      });
    }else{
      this.commonService.getPosData()
        .subscribe( response => {
          this.posList = response;
          this.posList = this.posList.result;
      });

    }
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