import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from  '@angular/router';
import {ExcelService} from '../../services/excel.service';


import Swal from 'sweetalert2'

@Component({
  selector: 'app-endorsement',
  templateUrl: './renew-policy.component.html',
  styleUrls: ['./renew-policy.component.css']
})
export class RenewpolicyComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closebutton2') closebutton2;

  base_url = environment.baseUrl;
  baseurl = environment.apiurl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtRendered = true;


  time :any;
  meridian = true;

  formchAddDisposition: FormGroup;
  submittedAddDisposition: boolean = false;

  product_type: any;

  formRenewalSMS : FormGroup;
  submittedRenewalSMS: boolean = false;

  formRenewalMail : FormGroup;
  submittedRenewalMAIL: boolean = false;

  formRenewalSMSIndividual : FormGroup;
  submittedRenewalSMSIndividual: boolean = false;

  formRenewalMailIndividual : FormGroup;
  submittedRenewalMAILIndividual: boolean = false;

  div_show_endorsement_new : boolean = true;
  div_show_endorsement_status : boolean = false;

  add_disposition_model : boolean = false;



  statusval : any = 1;

  result : any;
  policy_id : any;
  policy_no : any;
  history_policy_no : any;
  history_policy_records : any;
  history_policy_id : any;
  ic_list: any;

  ic_list_for_sms_individual: any;
  ic_list_for_email_individual: any;
  ic_list_for_sms_all: any;
  ic_list_for_email_all: any;

  unique_ref_no : any;
  renew_share_link: any;

  success_message: any;
  error_message: any;

  loaderActive: boolean = false;
  lfilter: any;

  date_picker_disposition_date : NgbDateStruct;

  message:any;
  email_list : any;
  sms_list : any;
  ic_id: any;
  mobile_no : any;
  email_id : any;

  isChecked: boolean = false;

  loginUserId : any;
  loginUserType : any;
  token  : any;

  policy_nos : any;
  all_leads : any;
  open_leads : any;
  follow_up : any;
  closed_leads : any;

  one_to_fifteen_days : any;
  sixteen_to_thirty_days : any;
  thirty_one_to_fourty_five_days : any;
  fourty_six_to_sixty_days : any;
  show_renewal_btn : boolean = false
  send_to_customer_id : any;
  all_product_list : any;
  product_list : any;


  formRecodEdit : any;
  icList : any;
  productList : any;
  policyTypeList : any;
  policySubTypeList : any;
  selectedInsurance_name : any = "";
  selectedProduct_name : any = "";
  selectedPolicyType_name : any;
  selectedPolicySubType_name : any;
  proposalData : any;

  date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  minDatePolicyFrom : any;
  maxDatePolicyTo : any;
  maxDate : any;
  minDate : any;

   filter_policy_no : any;
  policy_from : any;
  policy_to : any;
  insurance_name : any;
  product_name : any;
  policy_type_name : any;
  policy_sub_type_name : any;

  lead_status : any;
  selectedlead_status : any = "all";

  renewal_days : any;
  selectedrenewal_days : any = "15";

  is_external : any;
  selectedis_external : any = "";


  filterResult : any;

  setNullDate : any;
  minDateForToDate: any;
currentDate:any;
policyid:any;

objCurrentDate : any;
objBeginDate : any;
  constructor(private activatedRoute: ActivatedRoute,private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef, private excelService:ExcelService) {

  }




  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");

    this.formRecodEdit = this.formBuilder.group({
      filter_policy_no : [''],
      policy_from : [''],
      policy_to : [''],
      insurance_name : [''],
      product_name : [''],
      policy_type_name : [''],
      policy_sub_type_name : [''],
      submit_btn : [''],
      lead_status : [''],
      renewal_days : [''],
      is_external : ['']

    });

    const current = new Date();
    this.currentDate = new Date();

    this.objCurrentDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth(), day: this.currentDate.getDate() };

    this.objBeginDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth()+ 1, day: this.currentDate.getDate() };

    this.date_picker_policy_from =this.objCurrentDate;
    this.date_picker_policy_to=this.objBeginDate;

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


this.time={hour: this.currentDate.getHours(), minute: this.currentDate.getMinutes()}

      this.getFilterListData();


    this.formDeclare();
    this.validateUserLoginStatus(this.loginUserId,this.token);

    sessionStorage.setItem('days_filter', '15');
    sessionStorage.setItem('lead_filter','all');

    this.product_type = this.activatedRoute.snapshot.paramMap.get("type");
    this.getIndex();
    const current_date = new Date();
    this.date_picker_disposition_date = { year: current_date.getFullYear(), month: current_date.getMonth() + 1 ,day: current_date.getDate() };
    this.getICList();
    this.getPolicyCount(15);
    this.validationFormAddDisposition();

    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getProductListForHomePage(sendData)
    .subscribe( response => {
      var result :any = response;
      if(result.status){
        this.all_product_list = result.product_list_renew;
        // this.getProducts(0);

        this.product_list = [];
        this.all_product_list.forEach(row => {
          if(row.parent_id==0){
            if(row.active_menu==1){
              this.product_type=row.renewal_url;
            }
            this.product_list.push(row);
          }
        });

      }
  });

  }

  formDeclare(){

    this.formchAddDisposition = this.formBuilder.group({
      disposition : [''],
      communication_mode : [''],
      disposition_date : [''],
      disposition_time : [this.time],
      disposition_comment : ['']
    });


    this.formRenewalSMS = this.formBuilder.group({
      disposition : this.formBuilder.array([])
    });

    this.formRenewalMail = this.formBuilder.group({
      disposition : this.formBuilder.array([])

    });

    this.formRenewalSMSIndividual = this.formBuilder.group({
      disposition : this.formBuilder.array([])
    });

    this.formRenewalMailIndividual = this.formBuilder.group({
      disposition : this.formBuilder.array([])
    });
  }

  resetFormRenewalSMS(){
    this.formRenewalSMS.patchValue({disposition : []});
    this.ic_list_for_sms_all.forEach( (value, key) => {
      this.ic_list_for_sms_all[key]['checked'] = false;
    });
  }

  resetFormRenewalMail(){
    this.formRenewalMail.patchValue({disposition : []});
    this.ic_list_for_email_all.forEach( (value, key) => {
      this.ic_list_for_email_all[key]['checked'] = false;
    });
  }

  resetCommonCheckBox(){
    this.resetFormRenewalSMS();
    this.resetFormRenewalMail();
  }
  resetFormRenewalSMSIndividual(){
    this.formRenewalSMSIndividual.patchValue({disposition : []});
    this.ic_list_for_sms_individual.forEach( (value, key) => {
      this.ic_list_for_sms_individual[key]['checked'] = false;
    });

  }



  resetFormRenewalMailIndividual(){
    this.formRenewalMailIndividual.patchValue({disposition : []});
    this.ic_list_for_email_individual.forEach( (value, key) => {
      this.ic_list_for_email_individual[key]['checked'] = false;
    });
  }

  getICIdsForEmail(e,row) {

    const checkArrayEmail: FormArray = this.formRenewalMail.get('disposition') as FormArray;

     if (e.target.checked) {
      checkArrayEmail.push(new FormControl(row.id));
     } else {
       let i: number = 0;
       checkArrayEmail.controls.forEach((item: FormControl) => {
         if (item.value == row.id) {
          checkArrayEmail.removeAt(i);
           return;
         }
         i++;
       });
     }

  }

  getICIdsForSms(e,row) {

    const checkArraySMS: FormArray = this.formRenewalSMS.get('disposition') as FormArray;

    if (e.target.checked) {
      checkArraySMS.push(new FormControl(row.id));
    } else {
      let i: number = 0;
      checkArraySMS.controls.forEach((item: FormControl) => {
        if (item.value == row.id) {
          checkArraySMS.removeAt(i);
          return;
        }
        i++;
      });
    }
   /* console.log('checkArray...........');
    console.log(this.formRenewalSMS.get('disposition'));*/
  }

  getICIdsForSmsIndividual(e,row) {

    const checkArray: FormArray = this.formRenewalSMSIndividual.get('disposition') as FormArray;

    if (e) {
      checkArray.push(new FormControl(row.id));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == row.id) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }

  }

  getICIdsForEmailIndividual(e,row) {

    const checkArray: FormArray = this.formRenewalMailIndividual.get('disposition') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(row.id));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == row.id) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }

  }


  getPolicyCount(days){
    let uploadData = new FormData();
    uploadData.append('days', days);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('product_type',this.product_type);
    this.commonService.getPolicyRenewalCount(uploadData)
    .subscribe(response => {
      this.result = response;
      if(this.result.status){
        this.all_leads = this.result.all_leads;
        this.open_leads = this.result.open_leads;
        this.follow_up = this.result.follow_up;
        this.closed_leads = this.result.closed_leads;

        this.one_to_fifteen_days = this.result.one_to_fifteen_days;
        this.sixteen_to_thirty_days = this.result.sixteen_to_thirty_days;
        this.thirty_one_to_fourty_five_days = this.result.thirty_one_to_fourty_five_days;
        this.fourty_six_to_sixty_days = this.result.fourty_six_to_sixty_days;
      }
      else{
        this.all_leads = 0;
        this.open_leads = 0;
        this.follow_up = 0;
        this.closed_leads = 0;

        this.one_to_fifteen_days = 0;
        this.sixteen_to_thirty_days = 0;
        this.thirty_one_to_fourty_five_days = 0;
        this.fourty_six_to_sixty_days = 0;
      }
    });
  }

/*changeProduct(type){
    this.product_type = type;
    this.dtRendered = false;
    this.dtOptions = {
      "pagingType": 'full_numbers',
      "pageLength": 10,
      "serverSide": true,
      "processing": true,
      'ajax' : {
          url : this.base_url+'getRenewalPolicies/'+type,
          type : 'POST',
          headers: {
            "Authorization": "Bearer "+sessionStorage.getItem('user_token')
          },
          data: {
          "loginUserId": this.loginUserId,
          "loginUserType": this.loginUserType,
          //"days": 15,
          //"lead_filter": 'all',
      },
          dataType: "json",
      },

      columns: [
        {
          'title' : 'Sr.No',
          'data' : 'id'
        },
        {
          'title' : 'Policy Number',
          'data' : 'policy_no'
        },
        {
          'title' : 'Product Type',
          'data' : 'product_type'
        },
        {
          'title' : 'Reg. No.',
          'data' : 'reg_no'
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
          'title' : 'Ins. Company',
          'data' : 'ins_comp'
        },
        {
          'title' : 'Prev. Premium <small class="d-block">(Incl. GST)',
          'data' : 'final_premium'
        },

        {
          'title' : 'Disposition',
          'data' : 'disposition'
        },
        {
          'title' : 'Status',
          'data' : 'status'
        },
        {
          'title' : 'Policy End Date',
          'data' : 'policy_expiry'
        },
        {
          'title' : 'Action',
          'data' : 'action_btn'
        }


      ],
      columnDefs: [
        { "orderable": false, "targets": 11 },
        { "orderable": false, "targets": 0 }
      ],
      order: [[ 10, "asc" ]]
  };
    this.router.navigate(['/my-account/policy-renewal/'+type]);

   this.cdr.detectChanges();
    this.getPolicyCount(15);
   this.dtRendered = true
   this.cdr.detectChanges();
    //this.loaderActive = false;
}*/

  getIndex(){

      const that = this;

      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,


          'ajax' : {
              //url : this.base_url+'getRenewalPolicies/'+this.product_type,
              url : this.base_url+'getRenewalPolicies',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
              //"days": 15,
             // "lead_filter": 'all',
          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Policy Number',
              'data' : 'policy_no'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },
            {
              'title' : 'Reg. No.',
              'data' : 'reg_no'
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
              'title' : 'Ins. Company',
              'data' : 'ins_comp'
            },
            /*{
              'title' : 'Prev. Premium <small class="d-block">(Incl. GST)',
              'data' : 'final_premium'
            },*/

            {
              'title' : 'Disposition',
              'data' : 'disposition'
            },
            {
              'title' : 'Status',
              'data' : 'status'
            },
            {
              'title' : 'External/Internal',
              'data' : 'is_external'
            },
            {
              'title' : 'Make',
              'data' : 'make'
            },
            {
              'title' : 'Model',
              'data' : 'model'
            },
            {
              'title' : 'Varient',
              'data' : 'varient'
            },
            {
              'title' : 'Policy Sub Type',
              'data' : 'policy_subtype'
            },
            {
              'title' : 'Policy Start Date',
              'data' : 'policy_start_date'
            },
            {
              'title' : 'Policy End Date',
              'data' : 'policy_expiry'
            },
            {
              'title' : 'Registration Date',
              'data' : 'registration_date'
            },
            {
              'title' : 'Policy Created Date',
              'data' : 'policy_created_at'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": 11 },
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 10, "asc" ]],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            this.show_renewal_btn = true;
            const self = this;
            $('td', row).unbind('click');
            self.someClickHandler(data);
            return row;
          }
      };

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

  someClickHandler(info: any): void {
      if(this.message){
        this.message = this.message +','+ info.policy_no;
      }else{
        this.message = info.policy_no;
      }
/*      console.log("......."+this.message);
*/  }

  onclickSelectAll(){
      if(this.isChecked){
           this.isChecked = false;
      }else{
           this.isChecked = true;
      }
  }


  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("view-policy-id")) {
          this.policy_id = event.target.getAttribute("view-policy-id");
        }

        if(event.target.hasAttribute("history-policy-no")){
           this.history_policy_no = event.target.getAttribute("history-policy-no");
           this.history_policy_id = JSON.parse(event.target.getAttribute("history-policy-id"));
           this.getHistoryByOlicyId(this.history_policy_id);
        }

        if(event.target.hasAttribute("send-policy-no")){
          this.openIndividualModel();

          this.policy_no = event.target.getAttribute("send-policy-no");
          this.policyid = event.target.getAttribute("send-policy-id");
          this.ic_id = event.target.getAttribute("send-ic-id");
          this.mobile_no = event.target.getAttribute("send-mobile-no");
          this.email_id = event.target.getAttribute("send-email-id");
          this.send_to_customer_id = event.target.getAttribute("send-to-customer");




        }

        // if(event.target.hasAttribute("send-policy-quote-form")){
        //  let url_engine_no : any =  event.target.getAttribute("send-engine-no");
        //  let url : any = '/quote-form/'+url_engine_no;
        //  console.log("url_engine_no "+url);
        // this.router.navigate([url]);
        // }






    });
  }



  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  getHistoryByOlicyId(policy_id){
      this.loaderActive = true;
       let uploadData = new FormData();

      uploadData.append('policy_id',policy_id);
       this.commonService.getHistoryByOlicyId(uploadData)
      .subscribe(response => {
        this.loaderActive = false;
          this.history_policy_records = response;

      });
  }

  getICList(){
    this.loaderActive = true;
      this.commonService.getIcList()
      .subscribe(response => {
        this.loaderActive = false;
          this.ic_list = response;
          this.ic_list_for_sms_individual = this.ic_list;
          this.ic_list_for_email_individual = this.ic_list;
          this.ic_list_for_sms_all = this.ic_list;
          this.ic_list_for_email_all = this.ic_list;
/*          console.log(this.ic_list);
*/
      });
  }



  showHideRenewDays(days){
    sessionStorage.setItem('days_filter', days);
    var lead_filter :any = sessionStorage.getItem('lead_filter');


    // console.log('Lead: '+lead_filter);
    // console.log('Days:'+days);

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search(days,lead_filter).draw();
    });
  }

  showHideRenewLeads(leadstyp){
    sessionStorage.setItem('lead_filter', leadstyp);
    var days_filters :any = sessionStorage.getItem('days_filter');

    // console.log('Lead: '+leadstyp);
    // console.log('Days:'+days_filters);

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search(days_filters,leadstyp).draw();
    });
  }


  validationFormAddDisposition(){
      this.formchAddDisposition = this.formBuilder.group({
        disposition : ['',[Validators.required]],
        communication_mode : ['',[Validators.required]],
        disposition_date : ['',[Validators.required]],
        disposition_time  : [this.time,[Validators.required]],
        disposition_comment : ['',[Validators.required]]
      });
  }

  submitFormAddDisposition(){
    this.submittedAddDisposition = true;
    if(this.formchAddDisposition.invalid){
      return;
    }

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append('policy_master_id',this.policy_id);
    uploadData.append('disposition',this.formchAddDisposition.value.disposition);
    uploadData.append('communication_mode',this.formchAddDisposition.value.communication_mode);

    var day : any = (this.formchAddDisposition.value.disposition_date.day < 10 ? '0' : '') + this.formchAddDisposition.value.disposition_date.day;
    var month : any = (this.formchAddDisposition.value.disposition_date.month < 10 ? '0' : '') + this.formchAddDisposition.value.disposition_date.month;
    var year :any =  this.formchAddDisposition.value.disposition_date.year;
    var selected_date : any = year+'-'+month+'-'+day;

    uploadData.append('disposition_date',selected_date);

    console.log(this.formchAddDisposition.value.disposition_time);

    var hour = this.formchAddDisposition.value.disposition_time.hour;
    var minute = this.formchAddDisposition.value.disposition_time.minute;

    var selected_time : any = hour+':'+minute;


    uploadData.append('disposition_time',selected_time);
    uploadData.append('disposition_comment',this.formchAddDisposition.value.disposition_comment);

    this.commonService.submitFormAddDisposition(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          this.closebutton.nativeElement.click();
          Swal.fire({
            title: '',
            html: 'Disposition Added Successfuly',
            timer: 2000
          }).then((result) => {
             this.runTable();
            // this.router.navigateByUrl('/my-account/policy-renewal/'+outputResult.product_type);
             //this.router.navigateByUrl('/my-account/policy-renewal/'+this.product_type);
             this.router.navigateByUrl('/my-account/policy-renewal');
          })
          this.formDeclare();
          const current_date = new Date();
    this.date_picker_disposition_date = { year: current_date.getFullYear(), month: current_date.getMonth() + 1 ,day: current_date.getDate() };
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }




  selectTabEmail(){
    this.formRenewalMail.get("disposition").setValidators([Validators.required]);
    this.formRenewalMail.get("disposition").updateValueAndValidity();

    this.formRenewalSMS.get("disposition").setValidators([]);
    this.formRenewalSMS.get("disposition").updateValueAndValidity();

  }

  selectTabSms(){
    this.formRenewalSMS.get("disposition").setValidators([Validators.required]);
    this.formRenewalSMS.get("disposition").updateValueAndValidity();

    this.formRenewalMail.get("disposition").setValidators([]);
    this.formRenewalMail.get("disposition").updateValueAndValidity();
  }


  submitRenewalEmail(){
    if(this.formRenewalMail.invalid){
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
      return;
    }


      this.submittedRenewalMAIL = true;
      this.loaderActive = true;
      const sendData = new FormData();

      if(this.formRenewalMail.value.disposition.length>0)
      {
        if(this.message!='')
        {
          sendData.append('ic_ids',this.formRenewalMail.value.disposition);
          sendData.append('policy_nos',this.message);

          this.commonService.submitRenewalPolicyEmail(sendData)
          .subscribe(response =>{
            this.loaderActive = false;
            var outputResult : any = response;
            if(outputResult.status)
            {
              // outputResult.status
              // console.log('email link'+outputResult.link);
              // window.open(outputResult.link, "_blank");
              this.resetFormRenewalMail();
              this.success_message = outputResult.message;
              this.closebutton1.nativeElement.click();
              Swal.fire({
                title: '',
                html: 'Policy Renewal Email send successfully.'
              });

            }else{
              this.error_message = outputResult.message;
            }

          });
        }
        else
        {
          Swal.fire({
              title: '',
              html: 'Please select all to send Renew Mail'
            });
        }
      }
      else
      {
        this.loaderActive = false;
        Swal.fire ("Please select at list one IC",  "" ,  "error" );
      }
  }

  submitFormRenewSms(){
    if(this.formRenewalSMS.invalid){
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
      return;
    }


      this.submittedRenewalMAIL = true;
      this.loaderActive = true;
      const sendData = new FormData();

      if(this.formRenewalSMS.value.disposition.length > 0)
      {
        if(this.message!='')
        {
          sendData.append('ic_ids',this.formRenewalSMS.value.disposition);
          sendData.append('policy_nos',this.message);

          this.commonService.submitRenewalPolicySms(sendData)
          .subscribe(response =>{
            this.loaderActive = false;
            var outputResult : any = response;
            if(outputResult.status)
            {
              // outputResult.status
              // console.log('sms link'+outputResult.link);
              // window.open(outputResult.link, "_blank");
              this.resetFormRenewalSMS();
              this.success_message = outputResult.message;
              this.closebutton1.nativeElement.click();
              Swal.fire({
                title: '',
                html: 'Policy Renewal SMS send successfully'
              });

            }else{
              this.error_message = outputResult.message;
            }

          });
        }
        else
        {
          Swal.fire({
              title: '',
              html: 'Please select all to send Renew Mail'
            });
        }
      }
      else
      {
        this.loaderActive = false;
        Swal.fire ("Please select at list one IC",  "" ,  "error" );
      }
  }

  submitFormRenewSmsIndividual(){

    if(this.formRenewalSMSIndividual.invalid){
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
      return;
    }

    // console.log(this.formRenewalSMSIndividual.value.disposition.length);
    // console.log(this.mobile_no);
    // console.log(this.email_id);
    // console.log(this.ic_list_for_sms_individual);


    this.submittedRenewalSMS = true;
    this.loaderActive = true;
    const sendData = new FormData();

    if(this.formRenewalSMSIndividual.value.disposition.length >0)
    {
      if(this.policy_no!='')
      {

          sendData.append('unique_ref_no',this.unique_ref_no);
          sendData.append('policy_nos',this.policy_no);
          sendData.append('policy_id',this.policyid);
          //sendData.append('ic_id',this.ic_id);

          sendData.append('ic_ids',this.formRenewalSMSIndividual.value.disposition);
          sendData.append('mobile_no',this.mobile_no);
          sendData.append('email_id',this.email_id);


          this.commonService.submitRenewalPolicySms(sendData)
          .subscribe(response =>{
            this.loaderActive = false;
            var outputResult : any = response;
            if(outputResult.status){
              if(this.send_to_customer_id == 0){
                this.openDealerLink(outputResult.link);
              }

              this.resetFormRenewalSMSIndividual();
              this.success_message = outputResult.message;
              this.closebutton2.nativeElement.click();
               Swal.fire({
                  title: '',
                  html: 'Policy Renewal SMS send successfully to Mobile No '+this.mobile_no
                });

            }
            else
            {
              this.error_message = outputResult.message;
            }

          });
      }
      else
      {
        Swal.fire({
            title: '',
            html: 'Please select all to send Renew SMS'
          });
      }
    }
    else
    {
      this.loaderActive = false;
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
    }
  }

  submitRenewalEmailIndividual(){

    if(this.formRenewalMailIndividual.invalid){
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
      return;
    }

    this.submittedRenewalMAIL = true;
    this.loaderActive = true;
    const sendData = new FormData();


    if(this.formRenewalMailIndividual.value.disposition.length >0)
    {
     if(this.policy_no!='')
     {
       sendData.append('unique_ref_no',this.unique_ref_no);
       sendData.append('policy_nos',this.policy_no);
       sendData.append('policy_id',this.policyid);

        sendData.append('loginUserId',this.loginUserId);
       sendData.append('ic_ids',this.formRenewalMailIndividual.value.disposition);
       sendData.append('mobile_no',this.mobile_no);
       sendData.append('email_id',this.email_id);

       this.commonService.submitRenewalPolicyEmail(sendData)
       .subscribe(response =>{
         this.loaderActive = false;
         var outputResult : any = response;
         if(outputResult.status)
         {
          if(this.send_to_customer_id == 0){
            this.openDealerLink(outputResult.link);
          }
           this.resetFormRenewalMailIndividual();
           this.success_message = outputResult.message;
           this.closebutton2.nativeElement.click();
           Swal.fire({
               title: '',
               html: 'Policy Renewal Email send successfully to Email Id '+this.email_id
             });

           //this.removeMessage();
         }
         else
         {
           this.error_message = outputResult.message;
         }

       });
     }
     else
     {
       Swal.fire({
           title: '',
           html: 'Please select all to send Renew Mail'
         });
     }
    }
    else
    {
      this.loaderActive = false;
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
    }
  }

  submitFormRenewSms_old(){

    if(this.formRenewalSMS.invalid){
      Swal.fire ("Please select at list one IC",  "" ,  "error" );
      return;
    }


    this.submittedRenewalSMS = true;
    this.loaderActive = true;

    const sendData = new FormData();

    //this.unique_ref_no  = 'QT05f4639e059242';
    if(this.message!=''){

      sendData.append('unique_ref_no',this.unique_ref_no);
      sendData.append('policy_ids',this.message);


      this.commonService.submitRenewalPolicySms(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          this.success_message = outputResult.message;
          this.closebutton1.nativeElement.click();
           Swal.fire({
              title: '',
              html: 'Policy Renewal SMS send successfully...l'
            });

        }else{
          this.error_message = outputResult.message;
        }

      });
    }else{
      Swal.fire({
          title: '',
          html: 'Please select all to send Renew SMS'
        });
    }

  }

  selectDate(field,event){
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    this.formchAddDisposition.patchValue({ disposition_date : selected_date });
    this.date_picker_disposition_date = event;

  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      //this.closePopupForwardQuote();
    }, 2000);

  }

  openIndividualModel(){

    this.resetFormRenewalSMSIndividual();
    this.resetFormRenewalMailIndividual();
  }

  openDealerLink(link){
    console.log('sms link'+link);
    window.open(link, "_blank");
  }


  getFilterListData(){
    this.commonService.getFilterListData()
    .subscribe( response => {
      this.filterResult = response;
      this.icList = this.filterResult.icList;
      this.productList = this.filterResult.productList;
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

        case 'lead_status':
          this.formRecodEdit.patchValue({lead_status : selected_value });
          break;

        case 'renewal_days':
          this.formRecodEdit.patchValue({renewal_days : selected_value });
          break;

        case 'is_external':
          this.formRecodEdit.patchValue({is_external : selected_value });
          break;
      }
    }
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
    this.lead_status= this.formRecodEdit.value.lead_status;
    this.renewal_days= this.formRecodEdit.value.renewal_days;
    this.is_external= this.formRecodEdit.value.is_external;

    if( (this.policy_from!='' && this.policy_from!=null && this.policy_from!=undefined) || (this.policy_to!='' && this.policy_to!=null && this.policy_to!=undefined) || (this.insurance_name!='' && this.insurance_name!=null && this.insurance_name!=undefined) || (this.product_name != '' && this.product_name != null && this.product_name != undefined)  || (this.filter_policy_no != '' && this.filter_policy_no != null && this.filter_policy_no != undefined) || (this.policy_type_name != '' && this.policy_type_name != null && this.policy_type_name != undefined) || (this.policy_sub_type_name != '' && this.policy_sub_type_name != null && this.policy_sub_type_name != undefined) || (this.lead_status!='' && this.lead_status!=null && this.lead_status!=undefined) || (this.renewal_days!='' && this.renewal_days!=null && this.renewal_days!=undefined) || (this.is_external!='' && this.is_external!=null && this.is_external!=undefined)) {
        this.loaderActive = true;

        // this.dtRendered = true
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(1).search(this.filter_policy_no);
            dtInstance.columns(2).search(this.product_name);
            dtInstance.columns(3).search(this.filter_policy_no);
            dtInstance.columns(6).search(this.insurance_name);
            dtInstance.columns(8).search(this.lead_status);
            dtInstance.columns(9).search(this.renewal_days);
            dtInstance.columns(16).search(this.policy_from);
            dtInstance.columns(17).search(this.policy_to);
            dtInstance.columns(10).search(this.is_external);


           /* dtInstance.columns(6).search(this.policy_type_name);
            dtInstance.columns(7).search(this.policy_sub_type_name);*/
            console.log(dtInstance.columns(1));
            dtInstance.draw();
        });

        this.loaderActive = false;

    } else {

      Swal.fire("At least one field is required ", '', "error");
      return;
    }

  }

  exportDataForm(){

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
    this.lead_status = this.formRecodEdit.value.lead_status;
    this.renewal_days = this.formRecodEdit.value.renewal_days;
    this.is_external = this.formRecodEdit.value.is_external;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);
    sendData.append('policy_from',this.policy_from);
    sendData.append('policy_to',this.policy_to);
    sendData.append('insurance_name',this.insurance_name);
    sendData.append('product_name',this.product_name);
    sendData.append('filter_policy_no',this.filter_policy_no);
    sendData.append('policy_type_name',this.policy_type_name);
    sendData.append('policy_sub_type_name',this.policy_sub_type_name);
    sendData.append('lead_status',this.lead_status);
    sendData.append('renewal_days',this.renewal_days);
    sendData.append('is_external',this.is_external);

    this.commonService.exportRenewPolicyData(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.proposalData = response;
        this.excelService.exportAsExcelFile(this.proposalData, 'PolicyData');

    });
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

      case 'lead_status':
        this.formRecodEdit.patchValue({lead_status : '' });
        this.selectedlead_status = "";
        break;

      case 'renewal_days':
        this.formRecodEdit.patchValue({renewal_days : '' });
        this.selectedrenewal_days = "";
        break;

      case 'is_external':
        this.formRecodEdit.patchValue({is_external : '' });
        this.selectedis_external = "";
        break;

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
        lead_status : 'all',
        renewal_days : '15',
        is_external : ''
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedPolicyType_name = "";
    this.selectedPolicySubType_name = "";
    this.selectedlead_status = "all";
    this.selectedrenewal_days = "15";
    this.selectedis_external = "";



    const current = new Date();
    this.currentDate = new Date();
    this.objCurrentDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth()- 1, day: this.currentDate.getDate() };
    this.objBeginDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth()+ 1, day: this.currentDate.getDate() };

    this.date_picker_policy_from =this.objCurrentDate;
    this.date_picker_policy_to=this.objBeginDate;

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search('');
        dtInstance.columns(2).search('');
        dtInstance.columns(3).search('');
        dtInstance.columns(4).search('');
        dtInstance.columns(5).search('');
        dtInstance.columns(6).search('');
        dtInstance.columns(7).search('');
        dtInstance.columns(8).search('');
        dtInstance.columns(9).search('');
        dtInstance.columns(11).search('');
        dtInstance.columns(12).search('');
        dtInstance.columns(10).search('');
        dtInstance.draw();
    });

    this.getPolicySubTypeList();

    this.loaderActive = false;
  }



}
