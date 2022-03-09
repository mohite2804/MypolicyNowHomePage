import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { CommonService } from "../services/common.service";

import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { interval } from "rxjs";
import { CustomvalidationService } from '../services/customvalidation.service';
import { JsonpClientBackend } from "@angular/common/http";
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit  {
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;
  @ViewChild('closebutton') closebutton;

  validation_for_cng :any = "^[1-9]{1}[0-9]{2,4}$";
  //validation_for_electriacal :any = "^[1-9]{1}[0-9]{2,5}$";

  validation_for_electriacal :any = "^([3-8][0-9]{3}|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9]|[1-8][0-9]{4}|9[0-8][0-9]{3}|99[0-8][0-9]{2}|999[0-8][0-9]|9999[0-9]|[1-8][0-9]{5}|9[0-8][0-9]{4}|99[0-8][0-9]{3}|999[0-8][0-9]{2}|9999[0-8][0-9]|99999[0-9])$";

  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_name_with_space :any = "^[a-zA-Z ]*$";
  validation_for_character :any = "^[a-zA-Z]+$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";

  submittedQuoteDetails : boolean = false;
  all_result_data : any;
  loaderActive: boolean = false;
  loginUserId: any;
  loginUserType: any;
  is_renew_policy: any;
  url_unique_ref_no: any;
  active_ic_for_quote: any;
  unique_ref_no: any ;
  get_ic_id_for_quotation: any;
  quoteData: any;
  first_record_quote_data : any;
  is_dealer_url_with_login : boolean = true;

  quote_ids : any;
  selected_quote_ids  : any;
  success_message : any;
  error_message  : any;
  formchFilterDetails : any;


  div_show_idv : boolean = true;

  div_show_accessories_and_cover_section : boolean = false;
  popupdiv : boolean = false;
  popupClass : any='row';

  div_show_addons_section : boolean = false;


  div_show_pa_unnamed_sum_insured_box  : boolean = false;
  div_show_no_ll_pa_cover_conductor  : boolean = true;
  div_show_accessories_box : boolean = true;
  div_show_deductibles_box : boolean = true;
  div_show_automobile_association_box : boolean = true;
  div_show_pa_cover_box : boolean = true;
  div_show_for_imt_box: boolean = true;
  date_picker_pre_policy_expire_date : NgbDateStruct;
  date_picker_aa_membership_expiry_date : NgbDateStruct;
  minDateMembershipExpiryDate: NgbDateStruct;

  div_show_ll_con_cle_col_terms  : boolean = true;
  div_show_imt : boolean = true;
  div_show_ll_paid_driver : boolean = false;

  div_show_geographical_extension_section : boolean = false;
  div_show_accessories : boolean = false;
  div_show_deductibles : boolean = false;
  div_show_pa_cover : boolean = false;
  div_show_for_imt_23 : boolean = false

  policy_sub_type_id:any;
  policy_sub_id:any;
  selected_policy_type_id : any;
  selected_product_type_id : any;

  result_pa_sum_insured : any;
  result_ll_terms: any;
  result_geographical_extension : any;
  interval : any;
  result_addon_package :any;
  result_individual_addons : any;

  formForwardQuote : any;
  submittedForwardQuote : boolean = false;
  displayForwardQuote : any = 'none';

  formForwardQuoteSms : any;
  submittedForwardQuoteSms : boolean = false;
  displayForwardQuoteSms : any = 'none';
  idvValue : any;
  quote_form_navigate_url : any;


  atLeastOneFieldRequiredAccessories : any;
  show_cng_text_box :any = 0;
  is_breakin_for_all_ic : any;

  visibleIndices = new Set<number>();
  ic_wise_idv_change_value :any;
  hide_div_for_commercial :  boolean =  false;
  result_no_of_conductor_ll : any;

  min_invoice_price : any;
  max_invoice_price : any;
  validation_for_number_only :any = "^[0-9]*$";
  disable_individual_addons : boolean = false;
  is_package_addon : any = false;
  addons_display:any;
  pa_suminsured_per_unnamed_person :any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    public router: Router,
    private formBuilder: FormBuilder,
    private customvalidationService: CustomvalidationService
  ) {
    const current = new Date();

    this.minDateMembershipExpiryDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

  }

  onclickIDVDiv(clickLang, index): void {
    this.visibleIndices.clear();
    console.log('visibleIndices');
    console.log(this.visibleIndices);
    if (!this.visibleIndices.delete(index)) {
      this.visibleIndices.add(index);
    }
  }

  updateIDV(row,type,i){
    let id = "idv_val_"+row.ic_id+"_"+i;

    let ic_wise_idv_change_value: any = (<HTMLInputElement>document.getElementById(id)).value;

    if(ic_wise_idv_change_value >= row.idvmin && row.idvmax >= ic_wise_idv_change_value ){
      if(type=='update'){
        var sendData = new FormData();
        sendData.append('ic_id',row.ic_id);
        sendData.append("loginUserId", this.loginUserId);
        sendData.append("idv", ic_wise_idv_change_value);
        sendData.append("unique_ref_no", this.unique_ref_no);
        sendData.append("product_type_id", this.selected_product_type_id);

        var title = "Are you sure you want to update IDV";
        Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      })
      .then((gettrue) => {
        if (gettrue.value) {
          this.changesIDVByIcWise(sendData);
        }else{
         // this.setParameter( this.all_result_data);
          this.getIndex();
        }
      });
      }
    }else{
      Swal.fire ('Please enter idv value in between '+row.idvmin+' to '+row.idvmax,  "" ,  "error" );
    }
  }

  closePopupForwardQuote(){
    this.displayForwardQuote='none';
    this.displayForwardQuoteSms='none';
    this.resetFormForwardQuote();
    this.loaderActive = false;
  }


  resetFormForwardQuote(){
    this.submittedForwardQuote = false;
    this.submittedForwardQuoteSms = false;
    this.quote_ids = [];
    this.selected_quote_ids = "";
    this.formForwardQuote.patchValue({
      email_2 : '',
      quote_ids : ''
    });

    this.formForwardQuoteSms.patchValue({
      mobile_2 : '',
      quote_ids : ''
    });

    this.quoteData.forEach( (value, key) => {
      this.quoteData[key]['isChecked'] = false;
    });

  }



  openForwardQuoteModal(){
    this.displayForwardQuote = 'block';
  }

  openForwardQuoteSMSModal(){
    this.displayForwardQuoteSms = 'block';
  }

  validateQuoteEmailForward(){
    this.formForwardQuote = this.formBuilder.group({
      email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required]],
      email_2 : ['',[Validators.pattern(this.validation_for_email)]],
      quote_ids : ['',Validators.required]
    });

    this.formForwardQuoteSms = this.formBuilder.group({
      mobile_1 : ['',[Validators.pattern(this.validation_for_mobile_no), Validators.required]],
      mobile_2 : ['',[Validators.pattern(this.validation_for_mobile_no)]],
      quote_ids : ['',Validators.required]
    });

  }


  submitFormForwardQuote(){
    this.formForwardQuote.patchValue({
      quote_ids :  this.quote_ids.join()
    });

    this.submittedForwardQuote = true;
    if(this.formForwardQuote.invalid){
      return;
    }

    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('email_1',this.formForwardQuote.value.email_1);
    sendData.append('email_2',this.formForwardQuote.value.email_2);
    sendData.append('quote_ids',this.quote_ids);

    this.commonService.submitFormForwardQuote(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var outputResult : any = response;
      if(outputResult.status){
        this.success_message = outputResult.message;
      }else{
        this.error_message = outputResult.message;
      }
      this.closePopupForwardQuote();

      this.removeMessage();

    });

  }

  submitFormForwardQuoteSms(){
    this.formForwardQuoteSms.patchValue({
      quote_ids :  this.quote_ids.join()
    });

    this.submittedForwardQuoteSms = true;
    if(this.formForwardQuoteSms.invalid){
      return;
    }

    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('mobile_1',this.formForwardQuoteSms.value.mobile_1);
    sendData.append('mobile_2',this.formForwardQuoteSms.value.mobile_2);
    sendData.append('quote_ids',this.quote_ids);

    this.commonService.submitFormForwardQuoteSms(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var outputResult : any = response;
      if(outputResult.status){
        this.success_message = outputResult.message;
      }else{
        this.error_message = outputResult.message;
      }
      this.closePopupForwardQuote();

      this.removeMessage();

    });

  }

  removeMessage(){
    setTimeout (() => {
      this.success_message = "";
      this.error_message = "";
    }, 3000);

  }


  ngAfterViewInit(){

    // this.interval = interval(10000).subscribe(x => {
    //   if(this.get_ic_id_for_quotation){
    //     console.log('active_ic_for_quote');
    //     console.log(this.active_ic_for_quote);
    //     var active_ic_for_quote: any = this.active_ic_for_quote.split(',');
    //     active_ic_for_quote.forEach( (value, key) => {
    //       if(this.get_ic_id_for_quotation.indexOf(value) == -1){
    //         console.log('call again');
    //        // this.loadGetQuote();
    //       }else{
    //         console.log('not call');
    //         //clearInterval(this.interval);
    //       }
    //     });
    //   }
    // });

  }

  ngOnDestroy() {
      clearInterval(this.interval);
  }


  ngOnInit(): void {

    this.validationForm();
    this.validateQuoteEmailForward();
    this.url_unique_ref_no = this.activatedRoute.snapshot.paramMap.get(
      "unique_ref_no"
    );
    this.loginUserId = sessionStorage.getItem("user_id");
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.active_ic_for_quote = sessionStorage.getItem("active_ic_for_quote");


        this.loaderActive = true;
        this.quote_ids = [];
        this.selected_quote_ids = "";
        this.success_message = "";
        this.error_message = "";

        if(this.url_unique_ref_no != null){
          this.is_dealer_url_with_login = false;
          this.unique_ref_no  = this.url_unique_ref_no;
          sessionStorage.setItem('unique_ref_no', this.url_unique_ref_no);
        }else{
          this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
        }


        if(this.unique_ref_no == "" || this.unique_ref_no ==  null || this.unique_ref_no == undefined ){
          this.router.navigateByUrl('/home');
        }else{
           this.getIndex();
        }




  }

  getIndex() {
    this.loadGetQuote();

  }


  uploadPopupHide(){
    this.uploadPopupClose();
    this.getIndex();
   // this.setParameter( this.all_result_data);
  }

  uploadPopupClose(){
    this.popupdiv = false;
    this.popupClass = 'row';
  }

  loadGetQuote() {

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("unique_ref_no", this.unique_ref_no);

    this.commonService.getQuotation(sendData).subscribe((response) => {
      this.loaderActive = false;
      this.all_result_data  = response;
      this.quote_form_navigate_url  = this.all_result_data.quote_form_navigate_url;
      this.is_breakin_for_all_ic  = this.all_result_data.is_breakin_for_all_ic;

      if (!this.all_result_data.status) {
        Swal.fire(this.all_result_data.message, "", "error");
      } else {
        this.result_pa_sum_insured = this.all_result_data.pa_sum_insured;
        this.result_no_of_conductor_ll =this.all_result_data.ll_terms;  ;
        this.result_geographical_extension = this.all_result_data.geographical_extension;
        this.result_individual_addons = this.all_result_data.individual_addons;
        this.setParameter(this.all_result_data);
      }
    });
  }

  async setParameter(result){

    this.get_ic_id_for_quotation = result.get_ic_id_for_quotation;


    this.quoteData = result.quote_data;
    this.first_record_quote_data = result.first_record_quote_data;

    this.result_addon_package = result.addon_package;
    this.result_individual_addons = result.individual_addons;

    this.selected_policy_type_id = parseInt(this.first_record_quote_data.policy_subtype_id);
    this.selected_product_type_id = parseInt(this.first_record_quote_data.product_type_id);
    sessionStorage.setItem('product_type_id', this.selected_product_type_id);
    if(this.first_record_quote_data.policy_type_id == '1'){
      this.setInvoiceRange(this.first_record_quote_data.min_invoice_price,this.first_record_quote_data.max_invoice_price);
    }else{
      this.reSetInvoiceRange();
    }

    this.idvValue = this.first_record_quote_data.idvValue;


    this.is_renew_policy = result.is_renew_policy;
    if(this.quoteData){
      this.div_show_idv=this.first_record_quote_data.div_show_idv;
    }


    if(this.first_record_quote_data.is_accessories==1){
      this.div_show_accessories_box = false;
    }else{
      this.div_show_accessories_box = true;
    }


    if(this.first_record_quote_data.is_deductibles==1){
     this.div_show_deductibles_box = false;
    }else{
      this.div_show_deductibles_box = true;
    }

    if(this.first_record_quote_data.is_aa_membership==1){
        this.div_show_automobile_association_box = false;
    }else{
      this.div_show_automobile_association_box = true;
    }



    if(this.first_record_quote_data.is_imt==1){
        this.div_show_for_imt_box  = false;
    }else{
      this.div_show_for_imt_box = true;
    }

    if(this.first_record_quote_data.is_pa_covers==1){
        this.div_show_pa_cover_box = false;
    }else{
      this.div_show_pa_cover_box = true;
    }

    if(this.first_record_quote_data.is_pa_unnamed_persons==1){
        this.div_show_pa_unnamed_sum_insured_box = false;
    }else{
      this.div_show_pa_unnamed_sum_insured_box = true;
    }



    this.setGeographicalExtenstion();
    this.setIndividualAddons();

    this.selectLLPACoverConductor(this.first_record_quote_data.is_ll_conductor,'server');
    this.selectUnnamedPerson(this.first_record_quote_data.is_pa_unnamed_persons,'server');

    this.selectDateForAngular('aa_membership_expiry_date',this.first_record_quote_data.aa_membership_expiry_date);


    this.checkIndividualAddonsDisable();
    await this.setFormData(this.first_record_quote_data);


  }


  checkIndividualAddonsDisable(){
    console.log("is_package_addon: "+this.first_record_quote_data.is_package_addon);
    console.log("disable_individual_addons: "+this.disable_individual_addons);
    if(this.first_record_quote_data.is_package_addon == 1 || this.first_record_quote_data.is_package_addon == '1'){
      this.disable_individual_addons = false;

    }else{
      this.disable_individual_addons = false;
    }
  }

  trackByQuoteId(index: number, quotes: any): string {
    return quotes.quote_id;
  }

  setInvoiceRange(min_invoice_price,max_invoice_price){
    console.log('min_invoice_price:- '+min_invoice_price);
    console.log('max_invoice_price:- '+max_invoice_price);

    this.formchFilterDetails.get("invoice_price").setValidators([
      Validators.pattern(this.validation_for_number_only),
      Validators.min(min_invoice_price),
      Validators.max(max_invoice_price)

    ]);
    this.formchFilterDetails.get("invoice_price").updateValueAndValidity();
  }

  reSetInvoiceRange(){
    this.formchFilterDetails.get("invoice_price").setValidators([]);
    this.formchFilterDetails.get("invoice_price").updateValueAndValidity();
  }

  validationForm(){
    this.formchFilterDetails = this.formBuilder.group({
      idv : [''],
      addon_package : [''],
      individual_addons : this.formBuilder.array([]),
      invoice_price : [''],

      is_accessories : [''],
      accessories : [''],
      electric_acc_idv : [''],

      non_electric_acc_idv : [''],
      accessories_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],
      accessories_non_electrical : ['',[Validators.min(1),Validators.pattern(this.validation_for_electriacal)]],
      bifuel_kit_idv : ['',[Validators.min(1),Validators.pattern(this.validation_for_cng)]],
      is_bifuel : [''],
      deductibles : [''],
      deductibles_actitheft : [''],
      deductibles_automobile_association : [''],
      pa_cover : [''],
      pa_unnamed_persons : [''],
      pa_sum_insured : [''],
      ll_paid_driver : [''],
      is_deductibles : [''],
      is_antitheft : [''],
      is_aa_membership : [''],
      aa_membership_name : ['',[Validators.pattern(this.validation_for_name_with_space)]],
      aa_membership_no : ['',[Validators.min(1),Validators.pattern(this.validation_for_aa_membership_no)]],
      aa_membership_expiry_date : [''],
      is_pa_covers : [''],
      is_pa_unnamed_persons : [''],

      is_ll_paid_driver : [''],
      is_imt : [''],
      imt_23 : [''],
      imt_34  : [''],

      is_ll_conductor  : [''],
      no_of_conductor_ll  : [''],



      geographical_extension : this.formBuilder.array([])
    },{validator: [
      this.customvalidationService.atLeastOneAccessoriesValidator,
      this.customvalidationService.atLeastOnePACoverValidator,
      this.customvalidationService.atLeastOneDeductiblesValidator
    ]});

  }

  setFormData(first_record_quote_data){
      console.log('addon_package_id '+first_record_quote_data.addon_package_id);
      this.pa_suminsured_per_unnamed_person = first_record_quote_data.pa_suminsured_per_unnamed_person;
     this.formchFilterDetails.patchValue({
        idv : first_record_quote_data.idv,
        addon_package : first_record_quote_data.addon_package_id,
        invoice_price : first_record_quote_data.vehicle_invoice_price,
        is_accessories : first_record_quote_data.is_accessories,
        accessories : first_record_quote_data.is_accessories,
        electric_acc_idv : first_record_quote_data.electric_acc_idv,
        non_electric_acc_idv : first_record_quote_data.non_electric_acc_idv,
        accessories_electrical : first_record_quote_data.electric_acc_idv,
        accessories_non_electrical : first_record_quote_data.non_electric_acc_idv,
        bifuel_kit_idv :  first_record_quote_data.bifuel_kit_idv,
        is_bifuel :  first_record_quote_data.is_bifuel,

        deductibles : first_record_quote_data.is_deductibles,
        deductibles_actitheft : first_record_quote_data.is_antitheft,
        deductibles_automobile_association : first_record_quote_data.is_aa_membership,
        pa_cover : first_record_quote_data.is_pa_covers,
        pa_unnamed_persons : first_record_quote_data.is_pa_unnamed_persons,
        pa_sum_insured : first_record_quote_data.pa_suminsured_per_unnamed_person,


        ll_paid_driver : first_record_quote_data.is_ll_paid_driver,
        is_deductibles : first_record_quote_data.is_deductibles,
        is_antitheft : first_record_quote_data.is_antitheft,
        is_aa_membership : first_record_quote_data.is_aa_membership,
        aa_membership_name : first_record_quote_data.aa_membership_name,
        aa_membership_no : first_record_quote_data.aa_membership_no,
        aa_membership_expiry_date : first_record_quote_data.aa_membership_expiry_date,
        is_pa_covers : first_record_quote_data.is_pa_covers,
        is_pa_unnamed_persons : first_record_quote_data.is_pa_unnamed_persons,

        is_ll_paid_driver : first_record_quote_data.is_ll_paid_driver,
        is_imt : first_record_quote_data.is_imt,
        imt_23 : first_record_quote_data.is_imt23,
        imt_34  : first_record_quote_data.is_imt34,

        is_ll_conductor  : first_record_quote_data.is_ll_conductor,
        no_of_conductor_ll  : first_record_quote_data.no_of_conductor_ll




      });
      console.log('start form data');
      console.log(this.formchFilterDetails);
      console.log('end form data');


  }






  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  uploadPopupShow(){
    this.popupdiv = true;
    this.popupClass = 'row updating-quoteslist';

  }

  buypolicy(row){
    var idv_total=Number(row.idv)+Number(row.electric_acc_idv)+Number(row.non_electric_acc_idv)+Number(row.bifuel_kit_idv)+Number(row.trailer_idv);
    if(idv_total > 5000000){
      Swal.fire ('AS per IRDA guidline, POSP can not sell policy of vehicle which has IDV more then Rs50 lakhs  Please contact your RM to take it forwards',  "" );
      return false;
    }
    var quote_no : any = row.quote_no;
    var selected_ic_id : any = row.ic_id;
    this.closebutton.nativeElement.click();
    this.loaderActive = true;
    sessionStorage.setItem('quote_no', quote_no);
    sessionStorage.setItem('selected_ic_id', selected_ic_id);
    var sendData = new FormData();
    sendData.append('quote_no',quote_no);
    sendData.append('selected_ic_id',selected_ic_id);

    this.commonService.quoteBuy(sendData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){

          if(this.url_unique_ref_no != null){
            this.router.navigateByUrl('share/confirm-details');
          }else{
            this.router.navigateByUrl('/confirm-details');
          }

        }
    });

  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.formchFilterDetails.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
            console.log(name);
        }
    }

  }

  submitFormFilterDetails(){

    console.log('submitFormFilterDetails');
    console.log(this.formchFilterDetails.invalid);
    console.log(this.formchFilterDetails);

    this.submittedQuoteDetails = true;

    if(this.formchFilterDetails.invalid){
      this.findInvalidControls();
      return;
    }




    this.loaderActive = true;
    let uploadData = new FormData();

    uploadData.append('unique_ref_no',this.unique_ref_no);
    uploadData.append('idv',this.formchFilterDetails.value.idv);
    uploadData.append('is_package_addon',this.is_package_addon);
    var  addon_package_id :any = '';
    var  individual_addons :any = this.formchFilterDetails.value.individual_addons;
    console.log("avinash   : "+individual_addons);


    if(this.is_package_addon==1){
      addon_package_id = this.formchFilterDetails.value.addon_package;
      individual_addons = "";
    }else{
      addon_package_id = 0;
    }
    if(individual_addons !="" || individual_addons != null){
     console.log(individual_addons);
      var uniqueIndividual_addons : any = [];
      $.each(individual_addons, function(i, el){
        if($.inArray(el, uniqueIndividual_addons) === -1) uniqueIndividual_addons.push(el);
      });
      individual_addons = uniqueIndividual_addons.join();
      console.log(individual_addons);

    }
    uploadData.append('addon_package_id',addon_package_id);
    uploadData.append('individual_addons',individual_addons);
console.log('addon check start.......................');
    console.log("is_package_addon: "+this.is_package_addon);
    console.log("individual_addons: "+individual_addons);
    console.log("addon_package_id: "+addon_package_id);
    console.log('addon check end.......................');
  // alert(individual_addons);

    //uploadData.append('unique_ref_no',this.unique_ref_no);

    //console.log("idv.......:-"+this.formchFilterDetails.value.idv);
   // uploadData.append('idv',this.formchFilterDetails.value.idv);
    uploadData.append('vehicle_invoice_price',this.formchFilterDetails.value.invoice_price);

    uploadData.append('is_accessories',this.formchFilterDetails.value.accessories);
    uploadData.append('electric_acc_idv',this.formchFilterDetails.value.accessories_electrical);
    uploadData.append('non_electric_acc_idv',this.formchFilterDetails.value.accessories_non_electrical);
    uploadData.append('bifuel_kit_idv',(this.formchFilterDetails.value.bifuel_kit_idv) ? this.formchFilterDetails.value.bifuel_kit_idv : 0);

    // let  is_bifuel :any = this.formchFilterDetails.value.is_bifuel;
    // is_bifuel = parseInt(is_bifuel);
    // uploadData.append('is_bifuel',is_bifuel);

    let  is_bifuel :any  = 0
    if(this.formchFilterDetails.value.bifuel_kit_idv){
      is_bifuel = 1;
    }
    uploadData.append('is_bifuel',is_bifuel);



    uploadData.append('is_deductibles',this.formchFilterDetails.value.deductibles);
    uploadData.append('is_antitheft',this.formchFilterDetails.value.deductibles_actitheft);
    uploadData.append('is_aa_membership',this.formchFilterDetails.value.deductibles_automobile_association);
    uploadData.append('aa_membership_name',this.formchFilterDetails.value.aa_membership_name);
    uploadData.append('aa_membership_no',this.formchFilterDetails.value.aa_membership_no);

    uploadData.append('aa_membership_expiry_date',this.formchFilterDetails.value.aa_membership_expiry_date);
    uploadData.append('is_pa_covers',this.formchFilterDetails.value.pa_cover);
    uploadData.append('is_pa_unnamed_persons',this.formchFilterDetails.value.pa_unnamed_persons);
    uploadData.append('pa_suminsured_per_unnamed_person',this.formchFilterDetails.value.pa_sum_insured);
    uploadData.append('is_ll_paid_driver',this.formchFilterDetails.value.ll_paid_driver);
    uploadData.append('is_imt',this.formchFilterDetails.value.is_imt);
    uploadData.append('imt23',this.formchFilterDetails.value.imt_23);
    uploadData.append('imt34',this.formchFilterDetails.value.imt_34);

    uploadData.append('is_ll_conductor',this.formchFilterDetails.value.is_ll_conductor);
    uploadData.append('no_of_conductor_ll',this.formchFilterDetails.value.no_of_conductor_ll);

    this.setGeographicalExtenstion();
    var checkedUsers = '';
    this.result_geographical_extension.forEach(function(item) {
      if (item.checked) {
        if(checkedUsers != ''){
          checkedUsers += ",";
        }
        checkedUsers += item.id;
      }
    });

    // let geographical_extension = (this.formchFilterDetails.value.geographical_extension != undefined) ? this.formchFilterDetails.value.geographical_extension : '';
    // uploadData.append('geographical_extension',geographical_extension);
    uploadData.append('geographical_extension',checkedUsers);
    let is_geographical :any = 0;
    // if(geographical_extension !== null && geographical_extension !== undefined && geographical_extension !="") {
    //   is_geographical = 1;
    // }
    if(checkedUsers != ''){
      is_geographical = 1;
    }
    uploadData.append('is_geographical', is_geographical.toString());

    this.commonService.submitQuoteFilterDetails(uploadData)
    .subscribe(response => {
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){
          this.uploadPopupClose();
          this.all_result_data = outputResult.quotation_data;
          this.setParameter(outputResult.quotation_data);
          if(outputResult.update_message!='' || outputResult.update_message!=undefined || outputResult.update_message!=null){
            Swal.fire({position: 'center',icon: 'success',title: "Quotation update with "+ outputResult.update_message +" successfully." })
          }
          else{
            Swal.fire({position: 'center',icon: 'success',title: "Quotation updated successfully."})
          }

        }
    });





  }

  linkSendToCustomer(quote_data){
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('url_unique_ref_no',this.url_unique_ref_no);

    this.commonService.linkSendToCustomer(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var outputResult : any = response;
      if(outputResult.status){
       // this.success_message = outputResult.message;
        Swal.fire({position: 'center',icon: 'success',title: outputResult.message })
      }else{
        Swal.fire({position: 'center',icon: 'error',title: outputResult.message })
      }
    });

  }



  setGeographicalExtenstion(){
    let checkArray = <FormArray>this.formchFilterDetails.controls.geographical_extension;
    this.result_geographical_extension.forEach(row => {
      if(row.checked){
        checkArray.push(new FormControl(row.id));
      }
    })
  }




  getAddons(e,row,id) {
    this.uploadPopupShow();
    this.is_package_addon = false;
    let remove_item : any = [];
    let find_addon : any =0;
    let checkArray_individual: FormArray = this.formchFilterDetails.get('individual_addons') as FormArray;

    if (e.target.checked) {
      if(find_addon == 0){
        checkArray_individual.push(new FormControl(row.addon_id));
      }

    } else {

      let i: number = 0;
      console.log('checkArray_individual: ');
      console.log(checkArray_individual);
      checkArray_individual.controls.forEach((item: FormControl,key) => {
        if (parseInt(item.value) === parseInt(row.addon_id)) {
          console.log("item.value: "+item.value);
          console.log("row.addon_id: "+row.addon_id);
          console.log("i: "+i);
          console.log("key : "+key);
          remove_item.push(i);
          remove_item.push(key);
          checkArray_individual.removeAt(i);
          checkArray_individual.removeAt(key);
          console.log(i);
         // return
        }

        i++;
      });
      console.log('remove_item : ');
      console.log(remove_item);
     // return;
    }

  }




  getGeographicalExtension(e,row) {
    this.uploadPopupShow();

    let checkArray: FormArray = this.formchFilterDetails.get('geographical_extension') as FormArray;

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



  setIndividualAddons(){
    let checkArray = <FormArray>this.formchFilterDetails.controls.individual_addons;
    this.result_individual_addons.forEach(row => {
      if(row.checked){
        checkArray.push(new FormControl(row.addon_id));
      }
    })
  }




  selectUnnamedPerson(event,from_data = 'angular'){
    if(from_data == 'angular'){
      this.uploadPopupShow();
    }

    this.div_show_pa_unnamed_sum_insured_box  = !event;
    console.log("test:"+event);
    if(!event){
      console.log("test 1:" + event);
      this.formchFilterDetails.patchValue({ pa_sum_insured : '' });
      this.formchFilterDetails.get("pa_sum_insured").setValidators([]);
      this.formchFilterDetails.get("pa_sum_insured").updateValueAndValidity();

    }else{
      this.formchFilterDetails.get("pa_sum_insured").setValidators([Validators.required]);
      this.formchFilterDetails.get("pa_sum_insured").updateValueAndValidity();
    }
  }

  selectLLPACoverConductor(event,from_data = 'angular'){
    if(from_data == 'angular'){
      this.uploadPopupShow();
    }

    this.div_show_no_ll_pa_cover_conductor  = !event;
    if(!event){
      this.formchFilterDetails.patchValue({ no_of_conductor_ll : '' });
      this.formchFilterDetails.get("no_of_conductor_ll").setValidators([]);
      this.formchFilterDetails.get("no_of_conductor_ll").updateValueAndValidity();

    }else{
      this.formchFilterDetails.get("no_of_conductor_ll").setValidators([Validators.required]);
      this.formchFilterDetails.get("no_of_conductor_ll").updateValueAndValidity();
    }
  }

  selectAccessories(event){
    this.div_show_accessories_box  = !event;
    if(!event){
      this.resetAccessories();
    }
  }

  resetAccessories(){
    this.formchFilterDetails.patchValue({
      accessories_electrical : '',
      accessories_non_electrical : '',
      bifuel_kit_idv : '',
    });

    this.formchFilterDetails.get("accessories_electrical").setValidators([]);
    this.formchFilterDetails.get("accessories_electrical").updateValueAndValidity();

    this.formchFilterDetails.get("accessories_non_electrical").setValidators([]);
    this.formchFilterDetails.get("accessories_non_electrical").updateValueAndValidity();

    this.formchFilterDetails.get("bifuel_kit_idv").setValidators([]);
    this.formchFilterDetails.get("bifuel_kit_idv").updateValueAndValidity();

  }

  selectDeductibles(event){
    this.uploadPopupShow();
    this.div_show_deductibles_box  = !event;
    if(!event){
      this.div_show_automobile_association_box  = true;
      this.resetDeductibles();
    }
  }

  resetDeductibles(){
    this.formchFilterDetails.patchValue({
      deductibles_actitheft : '',
      deductibles_automobile_association : '',
      aa_membership_name : '',
      aa_membership_no : ''  ,
      aa_membership_expiry_date : ''
    });

    this.formchFilterDetails.get("deductibles_actitheft").setValidators([]);
    this.formchFilterDetails.get("deductibles_actitheft").updateValueAndValidity();

    this.formchFilterDetails.get("deductibles_automobile_association").setValidators([]);
    this.formchFilterDetails.get("deductibles_automobile_association").updateValueAndValidity();


    this.formchFilterDetails.get("aa_membership_name").setValidators([]);
    this.formchFilterDetails.get("aa_membership_name").updateValueAndValidity();


    this.formchFilterDetails.get("aa_membership_no").setValidators([]);
    this.formchFilterDetails.get("aa_membership_no").updateValueAndValidity();

    this.formchFilterDetails.get("aa_membership_expiry_date").setValidators([]);
    this.formchFilterDetails.get("aa_membership_expiry_date").updateValueAndValidity();
  }


  selectPaCovers(event){
    this.uploadPopupShow();
    this.div_show_pa_cover_box  = !event;
    if(!event){
      this.div_show_pa_unnamed_sum_insured_box = true;
      this.resetPaCover();
    }
  }

  resetPaCover(){
    this.formchFilterDetails.patchValue({
      pa_unnamed_persons : '',
      pa_cover : '',
      pa_sum_insured : '',
      ll_paid_driver : '',
      is_ll_conductor : '',
      no_of_conductor_ll : ''

    });

    this.formchFilterDetails.get("pa_unnamed_persons").setValidators([]);
    this.formchFilterDetails.get("pa_unnamed_persons").updateValueAndValidity();

    this.formchFilterDetails.get("pa_cover").setValidators([]);
    this.formchFilterDetails.get("pa_cover").updateValueAndValidity();

    this.formchFilterDetails.get("pa_sum_insured").setValidators([]);
    this.formchFilterDetails.get("pa_sum_insured").updateValueAndValidity();

    this.formchFilterDetails.get("ll_paid_driver").setValidators([]);
    this.formchFilterDetails.get("ll_paid_driver").updateValueAndValidity();

    this.formchFilterDetails.get("is_ll_conductor").setValidators([]);
    this.formchFilterDetails.get("is_ll_conductor").updateValueAndValidity();

    this.formchFilterDetails.get("no_of_conductor_ll").setValidators([]);
    this.formchFilterDetails.get("no_of_conductor_ll").updateValueAndValidity();
  }

  selectImt(event){
    this.div_show_for_imt_box  = !event;
    if(!event){
      this.resetImt();
    }

  }

  resetImt(){
    this.formchFilterDetails.patchValue({
      imt_23 : '',
      imt_34 : ''
    });

    this.formchFilterDetails.get("imt_23").setValidators([]);
    this.formchFilterDetails.get("imt_23").updateValueAndValidity();

    this.formchFilterDetails.get("imt_34").setValidators([]);
    this.formchFilterDetails.get("imt_34").updateValueAndValidity();
  }



  selectAutomobileAssociation(event){
    this.uploadPopupShow();
    this.formchFilterDetails.patchValue({
        aa_membership_name : '',
        aa_membership_no : ''  ,
        aa_membership_expiry_date : ''
      });
    this.div_show_automobile_association_box  = !event;
    if(event){
      this.formchFilterDetails.get("aa_membership_name").setValidators([Validators.required,Validators.pattern(this.validation_for_name_with_space)]);
      this.formchFilterDetails.get("aa_membership_name").updateValueAndValidity();

      this.formchFilterDetails.get("aa_membership_no").setValidators([Validators.required,Validators.min(1),Validators.pattern(this.validation_for_aa_membership_no)]);
      this.formchFilterDetails.get("aa_membership_no").updateValueAndValidity();

      this.formchFilterDetails.get("aa_membership_expiry_date").setValidators([Validators.required]);
      this.formchFilterDetails.get("aa_membership_expiry_date").updateValueAndValidity();

    }else{
      this.formchFilterDetails.get("aa_membership_name").setValidators([]);
      this.formchFilterDetails.get("aa_membership_name").updateValueAndValidity();

      this.formchFilterDetails.get("aa_membership_no").setValidators([]);
      this.formchFilterDetails.get("aa_membership_no").updateValueAndValidity();

      this.formchFilterDetails.get("aa_membership_expiry_date").setValidators([]);
      this.formchFilterDetails.get("aa_membership_expiry_date").updateValueAndValidity();
    }
  }


  selectDate(field,event){
    this.uploadPopupShow();
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    if(field == 'aa_membership_expiry_date'){
      this.formchFilterDetails.patchValue({ aa_membership_expiry_date : selected_date });
    }

  }

  selectDateForAngular(field,selected_date){
    const current_date = new Date(selected_date);
    if(field == 'aa_membership_expiry_date'){
      this.date_picker_aa_membership_expiry_date = { year: current_date.getFullYear(), month: current_date.getMonth() - 1,day: current_date.getDate() };
    }

  }





  getSelectedCheckboxValue(event,addon_row,ic_wise_addon_list){
    var addon_ids = [];

     ic_wise_addon_list.filter((value, index) => {
       if(value.checked){
         addon_ids.push(value.addon_ids);
       }
     });


      if(event){
        addon_ids.push(addon_row.addon_ids);
      }else{
        let index: number = addon_ids.indexOf(addon_row.addon_ids);
        addon_ids.splice(index, 1);
      }

      return addon_ids;

   }


  getPackageAddons(addon_row,event,ic_wise_addon_list){
    var addon_ids :any = addon_row.addon_ids;
    if(addon_row.is_package == '0'){
      if(addon_row.rule){
        //this.setIndividualAddons(event,addon_row.rule,ic_wise_addon_list);
        this.setIndividualAddons();
      }
    }

    if(!event){  addon_ids = "" }

    if(addon_row.is_package == '0'){
      addon_ids = this.getSelectedCheckboxValue(event,addon_row,ic_wise_addon_list);
    }

    this.updateAddons(addon_row,addon_ids);

  }

  updateAddons(row,addon_ids){
    var sendData = new FormData();
    sendData.append('ic_id',row.ic_id);
    sendData.append('is_package_addon',row.is_package);
    sendData.append('addon_ids',addon_ids);
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("unique_ref_no", this.unique_ref_no);
    sendData.append("product_type_id", this.selected_product_type_id);

    var title = "Are you sure you want to change addons";
    Swal.fire({
    title: title,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
  .then((gettrue) => {
    if (gettrue.value) {
      this.changesAddonsByIcWise(sendData);
    }else{
     // this.setParameter( this.all_result_data);
      this.getIndex();
    }
  });

  }

  changesAddonsByIcWise(sendData){
    this.loaderActive = true;
    this.commonService.changesAddonsByIcWise(sendData)
    .subscribe(response => {
      var result : any = response;
      this.loaderActive = false;
      if(result.status){
        Swal.fire(result.message, '', "success");
      }else{
        Swal.fire (result.message,  "" ,  "error" );
      }

      this.all_result_data = result.quotation_data;
      console.log('quotation_data start' + result);
      this.setParameter(result.quotation_data);
      console.log('quotation_data end');
  });
  }


  changesIDVByIcWise(sendData){
    this.loaderActive = true;
    this.commonService.changesIDVByIcWise(sendData)
    .subscribe(response => {
      var result : any = response;
      this.loaderActive = false;
      if(result.status){
        Swal.fire(result.message, '', "success");
      }else{
        Swal.fire (result.message,  "" ,  "error" );
      }
      this.all_result_data = result.quotation_data;
      console.log('quotation_data start' + result);
      this.setParameter(result.quotation_data);
      console.log('quotation_data end');
  });
  }
  loadScripts() {
    const externalScriptArray = [this.mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement("script");
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = "text/javascript";
      scriptTag.async = false;
      scriptTag.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(scriptTag);
    }
  }


  selectAddonPackage(row,i){
    this.uploadPopupShow();
    if(row.name == 'None'){
      this.disable_individual_addons = false;
      this.is_package_addon = false;
    }else{
      this.is_package_addon = true;
      this.disable_individual_addons = true;
      this.unCheckedIndividualAddons();
    }
  }

  unCheckedIndividualAddons(){
    this.result_individual_addons.forEach( (value, key) => {
      this.result_individual_addons[key]['checked'] = false;
    });
  }




  // displayAddons(e,row,id){
  //   this.uploadPopupShow();
  //   if (e.target.checked) {
  //     this.addons_display[id] = false;
  //   }else{
  //     this.addons_display[id] = true;
  //   }

  //   this.is_package_addon = false;
  //   const checkArray: FormArray = this.formchFilterDetails.get('individual_addons') as FormArray;

  //   if (e.target.checked) {
  //     checkArray.push(new FormControl(row.id));
  //   } else {
  //     let i: number = 0;
  //     checkArray.controls.forEach((item: FormControl) => {
  //       if (item.value == row.id) {
  //         checkArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   console.log('checkArray...........');
  //   console.log(this.formchFilterDetails.get('individual_addons'));
  // }




selectNoneAddonPackage(){
  //alert('as');

  this.uploadPopupShow();
  this.disable_individual_addons = false;
}






}
