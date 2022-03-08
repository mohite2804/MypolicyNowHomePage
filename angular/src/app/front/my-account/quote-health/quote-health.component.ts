import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { HealthService } from '../../services/health.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-quote-health',
  templateUrl: './quote-health.component.html',
  styleUrls: ['./quote-health.component.css']
})
export class QuoteHealthComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closebutton') closebutton;
  unique_ref_no : any;
  quote_no : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;
  is_from_quote_page :  boolean = true;
  loaderActive: boolean = false;
  displayForwardQuote : any = 'none';
  formForwardQuote : any;
  submittedForwardQuoteEmail :  boolean = false;
  submittedForwardQuoteSms :  boolean = false;
  result_quote_details : any;
  result_payment_types : any;
  success_message: any;
  error_message: any;
  formForwardQuoteEmail: any;
  formForwardQuoteSms: any;
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  result : any;
  activity_data : any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private healthService : HealthService,private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.token = sessionStorage.getItem("user_token");
    this.activity_data=[];

    this.validateUserLoginStatus(this.loginUserId,this.token);

    this.getIndex();
    this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
    this.quote_no  = sessionStorage.getItem('quote_no');
    this.validateProposal();
  }

  validateUserLoginStatus(loginUserId,token){
      this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.healthService.validateUserLoginStatus(uploadData)
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

   validateProposal(){
    //
    this.formForwardQuoteEmail = this.formBuilder.group({
      email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required,Validators.email]],
    });
    this.formForwardQuoteSms = this.formBuilder.group({
      mobile_no : ['',[Validators.pattern(this.validation_for_mobile_no), Validators.required]],
    });

  }


  getIndex(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'myaccount/get_dashboard_quate_health',
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
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Quote Ref No.',
              'data' : 'ref_no'
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
              'title' : 'Policy Sub Type',
              'data' : 'policy_sub_type'
            },
            {
              'title' : 'IC Name',
              'data' : 'ins_comp'
            },
            {
              'title' : 'Final Premium',
              'data' : 'final_premium'
            },
            {
              'title' : 'Quote Created Date',
              'data' : 'quote_created_date'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            },

          ],

      };

 
  }


  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-quote-id")) {
            this.viewQuote(event.target.getAttribute("view-product-type-id"),event.target.getAttribute("view-quote-id"));
        }
        if (event.target.hasAttribute("view-forword-id")) {
          sessionStorage.setItem('unique_ref_no', event.target.getAttribute("view-forword-id"));
          this.formForwardQuoteSms.patchValue({
            mobile_no : event.target.getAttribute("view-mobile-no")
          });
          this.formForwardQuoteEmail.patchValue({
            email_1 : event.target.getAttribute("view-email-id")
          });

          // this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        if (event.target.hasAttribute("view-delete-id")) {
          // this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        }
        if (event.target.hasAttribute("view-active-id")) {
          // this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          // this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
        if (event.target.hasAttribute("activity-log-id")) {
          this.getActivityLog(event.target.getAttribute("activity-log-id"))
        }
    });
  }

  getActivityLog(unique_ref_no){
    this.loaderActive = true;
    let formData = new FormData();

    formData.append('unique_ref_no',unique_ref_no);
    this.activity_data=[];

    this.healthService.getActivityLog(formData)
    .subscribe(response => {
      this.result = response;
      this.loaderActive = false;
      if(this.result.status){
        this.activity_data=this.result.data;
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


  viewQuote(product_type_id, uniqe_ref_no){
      sessionStorage.setItem('unique_ref_no', uniqe_ref_no);
      if(product_type_id==2){
        this.router.navigateByUrl('bike-insurance-quotation');
      }
      if(product_type_id==1){
        this.router.navigateByUrl('car-insurance-quotation');
      }
      if(product_type_id==5){
        this.router.navigateByUrl('commercial-truck-gccv-quotation');
      }
      if(product_type_id==9){
        this.router.navigateByUrl('commercial-misc-d-quotation');
      }
      if(product_type_id==7){
        this.router.navigateByUrl('commercial-threewheeler-quotation');
      }
      if(product_type_id==9){
        this.router.navigateByUrl('commercial-bus-pccv-quotation');
      }
      if(product_type_id==9){
        this.router.navigateByUrl('commercial-bus-pccv-quotation');
      }

  }


  onParentIsAuthenticate(isAuthenticate : boolean){
    this.isAuthenticate = isAuthenticate;
    this.div_show_for_authenticate = !isAuthenticate;

  }




  openForwardQuoteModal(){
    this.displayForwardQuote = 'block';
  }

  closePopupForwardQuote(){
    this.closebutton.nativeElement.click();
    this.displayForwardQuote='none';
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  // resetFormForwardProposal(){
  //   this.submittedForwardQuote = false;
  //   this.formForwardQuote.patchValue({
  //     email_2 : ''
  //   });

  // }
  submitFormForwardQuoteEmail(){

      this.submittedForwardQuoteEmail = true;
      if(this.formForwardQuoteEmail.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('email_1',this.formForwardQuoteEmail.value.email_1);
      this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
      sendData.append('unique_ref_no',this.unique_ref_no);

      this.healthService.submitFormForwardQuote(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success_message = outputResult.message;
          this.removeMessage();
        }else{
          this.error_message = outputResult.message;
        }

      });

  }

  submitFormForwardQuoteSms(){

      this.submittedForwardQuoteSms = true;
      if(this.formForwardQuoteSms.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('mobile_1',this.formForwardQuoteSms.value.mobile_no);
      this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
      sendData.append('unique_ref_no',this.unique_ref_no);

      this.healthService.submitFormSmsForwardQuote(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success_message = outputResult.message;
          this.removeMessage();
        }else{
          this.error_message = outputResult.message;
        }

      });

  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
      this.closePopupForwardQuote();
    }, 2000);

  }





}
