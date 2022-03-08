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
  selector: 'app-dealer-cheque',
  templateUrl: './dealer-cheque.component.html',
  styleUrls: ['./dealer-cheque.component.css']
})
export class DealerChequeComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  @ViewChild('closebutton') closebutton;

  unique_ref_no : any;
  policy_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;
  showForm  : boolean = false;
  
  date_picker_policy_from: NgbDateStruct;
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
  isChecked = false;
  bankDetailsData:any;

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;
  policy_id:any;
  ////search options
  submitted_filter : any = false;
  formRecodEdit : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;
  policy_sum : any;
  selected_cheque_date : any;

  selectedPolicy :  Array <any> ;

  
  showTbl :boolean = true;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef, private excelService:ExcelService) {
  }

  ngOnInit(): void {
    this.showTbl=false;
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

    const current = new Date();

    
    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.formRecodEdit = this.formBuilder.group({
      total_amount : [''],
      cheque_no : ['',[Validators.required]],
      cheque_date : ['',[Validators.required]],
      bank_name : ['',[Validators.required]],
      bank_branch : ['',[Validators.required]],
      checkArray: this.formBuilder.array([])
    });
    this.getIndex();
    this.policy_no  = sessionStorage.getItem('policy_no');
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

  


  getIndex(){
    /* const sendData = new FormData();
     sendData.append('this.loginUserType',this.loginUserType);
     sendData.append('loginUserId',this.loginUserId);
   
     this.commonService.GetDealerCheque(sendData)
     .subscribe( response => {
      console.log(response);
          this.policydata = response;
          if(this.policydata.status==true){
            console.log(this.policydata.data);
            this.policydata= this.policydata.data;
            this.showTbl=true;
          }
     }); */
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'myaccount/get_dealer_cheque',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
          },
              dataType: "json",
          },
          columns: [
            {   
              'title' : '<input type="checkbox" name="inputChecked" [(click)]="Checkedall()">',
              'data' : 'action_btn'
            },
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Policy No.',
              'data' : 'policy_no'
            },
            {
              'title' : 'Insured Name',
              'data' : 'insured_name'
            },
            {
              'title' : 'Insured Mobile No',
              'data' : 'insured_mobile_no'
            },
            {
              'title' : 'Ins.Co.',
              'data' : 'ins_comp'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },
            {
              'title' : 'Policy Type',
              'data' : 'policy_type'
            },
            {
              'title' : 'Total Amount',
              'data' : 'total_premium'
            },
            {
              'title' : 'Created Date',
              'data' : 'policy_created_at'
            }
          ],
          columnDefs: [
            { "orderable": false, 
              "targets": [0,1,2,3,4,5,6,7,8,9],
              className: 'select-checkbox'}
          ],
          order: [[ 9, "desc" ]]
      };
  }

  Checkedall(){
    alert('Vinit Mishra');
  }

  onselectAll(e){
    console.log(e.target.checked);
    console.log(e.target.value);
    const checkArray: FormArray = this.formRecodEdit.get('checkArray') as FormArray;
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
      // console.log(checkArray.value);
      var sendData = new FormData();
      sendData.append('policy_id',this.policy_id);
      this.commonService.getpolicyamount(sendData)
      .subscribe( response => {
        this.loaderActive = false;
          this.policy_sum = response;
          if(this.policy_sum.status==true){
            console.log(this.policy_sum.TotalCount.total_premium);
            this.formRecodEdit.patchValue({
              total_amount : this.policy_sum.TotalCount.total_premium
            });
          }
      });
    }
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("view-edit-id")) {
          this.onselectAll(event);
        }
    });
  }
 
  getBankDetails(ifsccode){
    // alert(ifsccode);
    var is_vallid :any = this.formRecodEdit.controls.ifsc_code.status;
    console.log(is_vallid)
    if(is_vallid != "INVALID" && ifsccode.length == 11 )
    {
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('ifsc_code',ifsccode);
      this.commonService.getBankDetails(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.bankDetailsData = response;
        
        if(this.bankDetailsData.status)
        {
          this.formRecodEdit.patchValue({
            bank_branch : this.bankDetailsData.result.branch,
            bank_name :this.bankDetailsData.result.bank
          });

          //create_razor_account form
          this.formRecodEdit.patchValue({
            bank_branch : this.bankDetailsData.result.branch,
            bank_name :this.bankDetailsData.result.bank
          });

        }
        else
        {
          this.formRecodEdit.patchValue({
            bank_branch : '',
            bank_name :''
          });
       }
     });
    }
  }
 
  submitFormFilter(){
    this.submitted_filter = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    
    this.loaderActive = true;
    this.selected_cheque_date = JSON.stringify(this.formRecodEdit.value.cheque_date);
    const sendData = new FormData();

    sendData.append('cheque_no',this.formRecodEdit.value.cheque_no);
    sendData.append('cheque_date',this.selected_cheque_date);
    sendData.append('bank_name',this.formRecodEdit.value.bank_name);
    sendData.append('bank_branch',this.formRecodEdit.value.bank_branch);
    sendData.append('total_amount',this.formRecodEdit.value.total_amount);
    sendData.append('policy_id',this.policy_id);
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserTypeId',this.loginUserType);
    
    this.commonService.POSTDealerCheque(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var result : any  = response;
      if(result.status){
        Swal.fire(result.message, '', "success");
        this.resetForm();
      }else{
        Swal.fire(result.message, '', "error");
      }
    });
  }
  resetForm(){
  this.submitted_filter = false;
  this.formRecodEdit.patchValue({
    cheque_no : '',
    cheque_date : '',
    bank_name : '',
    bank_branch : '',
    total_amount : '',
    policy_id : '',
  });
  this.showForm=false;
}
  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    var date2 : any = new Date(selected_date);

    this.formRecodEdit.patchValue({
      policy_to : ''
    });

  }
}