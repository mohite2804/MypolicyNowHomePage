import { Component, OnInit,Renderer2, ViewChild,ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';

import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import {ExcelService} from '../../services/excel.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-approve-account',
  templateUrl: './pos-approve-account.component.html',
  styleUrls: ['./pos-approve-account.component.css']
})
export class PosApproveAccountComponent implements OnInit {

  mainJsPath = environment.mainJsPath;
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  loginUserId : any;
  editResult : any;
  dtRendered = true;
  is_three_wheeler : any = 0;
  is_checked : any;
  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  productData : any;
  makeData : any;
  statusData : any;
  modelData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  getValue : any;
  output_result:any;
  atLeastOneRequired : any;
  showInputDiv = "block";
  selectedProduct : any;
  selectedMake : any;
  selectedStatus:any;
  modelsdata : any;
  Createdat :any;
  access_permission : any;
  is_isuzu  : any;
  hide_export : boolean = true;
  statusval : any = 1;


  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, private excelService:ExcelService,public cdr: ChangeDetectorRef) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit(): void {

    this.getIndex();
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  getIndex(){
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,

          'ajax' : {
              url : this.base_url+'admin/getPosBankAccountDetails',
              type : 'POST',
              data: {
                "loginUserId": this.loginUserId,
              },

              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'sno'
            },
            {
              'title' : 'POS Name',
              'data' : 'app_fullname'
            },
            {
              'title' : 'Pos Mobile No.',
              'data' : 'mobile_no'
            },
            {
              'title' : 'Account Holder Name',
              'data' : 'acc_holder_name'
            },
            {
              'title' : 'Account Number',
              'data' : 'account_no'
            },
            {
              'title' : 'IFSC Code',
              'data' : 'ifsc_code'
            },
            {
              'title' : 'Bank Name',
              'data' : 'bank_name'
            },
            {
              'title' : 'Branch Name',
              'data' : 'branch_name'
            },
            {
              'title' : 'Cancel Cheque',
              'data' : 'upload_cancel_cheque'
            },
            {
              'title' : 'Created Date',
              'data' : 'created_date'
            },
            {
              'title' : 'Status',
              'data' : 'admin_status'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],
          columnDefs: [
            { "orderable": false, "targets": [0,5,6,7,8] }
          ],
          order: [[ 5, "desc" ]]

      };
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {

    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-approve-id")) {
          this.changeStatus(event.target.getAttribute("view-approve-id"));
        }

    });
  }

  showHideStatusCancellation(statusid){

        this.statusval = statusid;
        const that = this;
        // make sure your template notices it
        this.cdr.detectChanges();
        // initialize them again
        this.dtRendered = true
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(this.statusval).draw();
        });
    }


  changeStatus(id){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('loginUserId',this.loginUserId);

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
  })
  .then((willDelete) => {
    if (willDelete.value) {
      this.loaderActive = true;
      this.commonService.changeApproveStatuseByPosId(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.editResult = response;
        this.runTable();
        if(this.editResult.status){

          Swal.fire(this.editResult.message, '', "success");
        }else{

          Swal.fire (this.editResult.message,  "" ,  "error" );
        }

    });
    }
  });

  }

}
