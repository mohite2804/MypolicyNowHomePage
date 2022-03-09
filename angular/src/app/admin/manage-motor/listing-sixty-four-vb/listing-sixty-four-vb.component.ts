import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2'
import { Router } from  '@angular/router';
import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";
import {ExcelService} from '../../services/excel.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listing-sixty-four-vb',
  templateUrl: './listing-sixty-four-vb.component.html',
  styleUrls: ['./listing-sixty-four-vb.component.css']
})
export class ListingSixtyFourVbComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 

  [x: string]: any;

  display : any;
  loginUserId  : any;
  loaderActive : boolean =  false;
  displayPD : any;
  displayUpload : any;
  formRecodEdit : FormGroup;
  atLeastOneRequired : any;
  statusval : any;

  date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  policy_from:any;
  policy_to:any;
  adminUserTypeId : any;
  loginIcId : any;
  adminUserType : any;

  constructor(private renderer: Renderer2, private notifyService: NotificationsService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) { 
    //this.loadScripts();
  }

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem("adminUserId");
      this.adminUserTypeId = sessionStorage.getItem("adminUserTypeId");
      this.loginIcId = sessionStorage.getItem("icId");

      if(this.loginIcId != 0 && this.adminUserTypeId == 5)
      {
        this.adminUserType = 'IC';
      }
      else
      {
        this.adminUserType = 'Admin'; 
      }

      this.statusval = 'ALL';
      this.policy_from = '';
      this.policy_to = '';
      this.getIndex();
      this.formRecordEdit = this.formBuilder.group({
            policy_from : [''],
            policy_to : [''],
        });
  }

  getIndex(){
    console.log('test 64 vb.listing..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getSixtyFourVbList',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "adminUserTypeId": this.adminUserTypeId,
              "adminUserType": this.adminUserType,
              "loginIcId": this.loginIcId,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr. No.',
              'data' : 'sno'
            },
            {
              'title' : 'Policy Number',
              'data' : 'policy_no'
            },
            {
              'title' : 'IC Name',
              'data' : 'Insurance_Company'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type_label'
            },
            {
              'title' : 'Chassis Number',
              'data' : 'chassis_no'
            },
            {
              'title' : 'Vehicle Reg. Number',
              'data' : 'vehicle_reg_no'
            },
            {
              'title' : 'Customer Name',
              'data' : 'insurance_name'
            },
            {
              'title' : '64 VB Status',
              'data'  : '64vb_status'
            },
            {
              'title' : '64vb Status Date',
              'data' : '64vb_approved_date'
            },
            {
              'title' : 'Policy Issue Date',
              'data' : 'policy_created_at'
            },
            {
              'title' : 'Policy Cancellation Status',
              'data' : 'policy_cancellation_status'
            },
            {
              'title' : 'Inception Date',
              'data' : 'inception_date'
            },

          ],
          columnDefs: [
            { "orderable": false, "targets": 7 },
            { "orderable": false, "targets": 10 },
            { "orderable": false, "targets": 11 }
          ],
          order: [[ 9, "desc" ]]
      };
  }


  exportAsXLSX(){
    this.policy_from = this.formRecordEdit.value.policy_from;
    this.policy_to = this.formRecordEdit.value.policy_to;

    if(this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined){
      this.policy_from = JSON.stringify(this.policy_from);
    }
    else{
      this.policy_from = '';
    }

    if(this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined){
      this.policy_to = JSON.stringify(this.policy_to);
    }
    else{
      this.policy_to = '';
    }

    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('adminUserTypeId',this.adminUserTypeId);
    sendData.append('adminUserType',this.adminUserType);
    sendData.append('loginIcId',this.loginIcId);
    sendData.append('sixty_four_vb_status',this.statusval);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);

    this.commonService.getList64VBData(sendData)
          .subscribe( response => {
            this.list64VBdata = response;
            console.log(this.modelsdata);
           this.excelService.exportAsExcelFile(this.list64VBdata, 'List64VBData');
          });
  }

  showHideListingByStatus(statusid){
    if(statusid == '1')
    {
      this.statusval = "pending";
    }
    else if(statusid == '2')
    {
      this.statusval = "approved";
    }
    else if(statusid == '3')
    {
      this.statusval = "dishonoured";
    }
    else if(statusid == '4')
    {
      this.statusval = "ALL";
    }

    this.dtRendered = false;
    this.getIndex();

    this.cdr.detectChanges();
    this.dtRendered = true
    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

       

      dtInstance.columns(0).search(this.statusval).draw();
    });
  }

  submitForm(){
    this.submitted = true;
        if(this.formRecordEdit.invalid){
            return false;
        }
        else
        {
          if((this.formRecordEdit.value.policy_from != '' && this.formRecordEdit.value.policy_from != null && this.formRecordEdit.value.policy_from != undefined) || (this.formRecordEdit.value.policy_to != '' && this.formRecordEdit.value.policy_to != null && this.formRecordEdit.value.policy_to != undefined))
          {
                this.atLeastOneRequired = '';
                this.policy_from = this.formRecordEdit.value.policy_from;
                this.policy_to = this.formRecordEdit.value.policy_to;
                const that = this;
                this.cdr.detectChanges();
                this.dtRendered = true
                this.cdr.detectChanges();
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.columns(1).search(JSON.stringify(this.policy_from));
                    dtInstance.columns(2).search(JSON.stringify(this.policy_to));                    
                    dtInstance.draw();
                });
            } 
            else {
                // this.atLeastOneRequired = 'At least one field required';
                // return false;
                Swal.fire({position: 'center',icon: 'error',title: 'At least one field required', showConfirmButton: false, timer: 3000 });
                return false;
            }
        }
  }

  resetFilterForm(){
        this.formRecordEdit.patchValue({
            policy_from : '',
            policy_to : '',            
        });
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search('');
            dtInstance.columns(2).search('');
            dtInstance.columns(3).search('');
            dtInstance.columns(4).search('');
            dtInstance.draw();
        });
    }
}  