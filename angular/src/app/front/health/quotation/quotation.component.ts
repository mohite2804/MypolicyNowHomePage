import { Component, OnInit, Renderer2 } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CustomvalidationService } from "../../services/customvalidation.service";
import { HealthService } from "../services/health.service";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;  
  formQuoteDetails: FormGroup;
  submittedQuoteDetails: boolean = false;
  compareFormDetails: FormGroup;
  loaderActive: boolean = false;
  loginUserId: any; 
  selectedproducttypeid: any;
  loginUserType: any;
  policy_type_name: any;
  policy_subtype_name: any;
  alcohol: any;
  childplanning: any;
  gender: any;
  group_lable: any;
  insured_type_self: any;
  insured_type_self_age: any;
  insured_type_spouse: any;
  insured_type_spouse_age: any;
  insured_type_mother:any;
  insured_type_mother_age:any;
  insured_type_father:any;
  insured_type_father_age:any;
  insured_type_son1:any;
  insured_type_son1_age:any;
  insured_type_son2:any;
  insured_type_son2_age:any;
  insured_type_son3:any;
  insured_type_son3_age:any;
  insured_type_son4:any;
  insured_type_son4_age:any;
  insured_type_daughter1:any;
  insured_type_daughter1_age:any;
  insured_type_daughter2:any;
  insured_type_daughter2_age:any;
  insured_type_daughter3:any;
  insured_type_daughter3_age:any;
  insured_type_daughter4:any;
  insured_type_daughter4_age:any;
  policyList:any;
  covrageList:any;
  plan_key: any;
  unique_reference_no:any;
  quote_id:any;
  quote_data_health_id:any;
  div_show_for_compare_policy:any;
  div_show_for_compare_plan_1:any;
  div_show_for_compare_plan_2:any;
  div_show_for_compare_plan_3:any;
  blank_quote_id_1:any;
  blank_quote_id_2:any;
  formcovrageform : any;
  submittedCovrageQuote : boolean = false;
  displayCovrageQuote : any = 'none';
  all_result_data : any;
  compare_count:any;
  mem_dob: any;
  membersdisease: any;
  membersdisease_smoke: any;
  membersdisease_tobaco: any;
  pincode: any;
  selected_suminsured: any;
  selected_deductible: any;
  tenure: any;
  deductible:any;
  addon_ids : any = [];
  showTopup: boolean;
  compare_count_1:any;
  compare_sum_insured_1:any;
  compare_quote_id_1:any;
  compare_plan_name_1:any;
  compare_logo_1:any;
  compare_count_2:any;
  compare_sum_insured_2:any;
  compare_quote_id_2:any;
  compare_plan_name_2:any;
  compare_logo_2:any;
  compare_count_3:any;
  compare_sum_insured_3:any;
  compare_quote_id_3:any;
  compare_plan_name_3:any;
  compare_logo_3:any;
  policy_type_name_div:any;

    constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.showTopup     = false; 
  }

  ngOnInit(): void {
    this.policy_type_name_div = false;
    this.div_show_for_compare_policy = false;
    this.div_show_for_compare_plan_1 = false;
    this.div_show_for_compare_plan_2 = false;
    this.div_show_for_compare_plan_3 = false;
    console.log(sessionStorage);
    this.loginUserId = sessionStorage.getItem("user_id");
    this.selectedproducttypeid = sessionStorage.getItem(
      "selected_product_type_id"
    );
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.unique_reference_no = sessionStorage.getItem("unique_reference_no");
    //this.validationFormQuoteDetails();
    this.getIndex();
    this.compare_count = 0;
    
  }

  getIndex() {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("unique_reference_no", this.unique_reference_no);
    this.healthService.getHealthQuoteListData(sendData).subscribe((res) => {
      this.loaderActive = false;
      this.insured_type_self = '';
      this.insured_type_spouse = '';
      this.insured_type_mother = '';
      this.insured_type_father = '';
      this.insured_type_son1 = '';
      this.insured_type_son2 = '';
      this.insured_type_son3 = '';
      this.insured_type_son4 = '';
      this.insured_type_daughter1 = '';
      this.insured_type_daughter2 = '';
      this.insured_type_daughter3 = '';
      this.insured_type_daughter4 = '';
      var result: any = res;
      this.policy_type_name = result.result.user_data.policy_type_name;
      this.policy_subtype_name = result.result.user_data.policy_subtype_name;
      if(result.result.user_data.user_action_data.insured_type_self == '1')
      {
        this.insured_type_self = 'Self';
        this.insured_type_self_age = result.result.user_data.user_action_data.insured_type_self_age+" Yrs";
      }
      
      if(result.result.user_data.user_action_data.insured_type_spouse == '1')
      {
        this.insured_type_spouse = 'Spouse';
        this.insured_type_spouse_age = result.result.user_data.user_action_data.insured_type_spouse_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_mother == '1')
      {
        this.insured_type_mother = 'Mother';
        this.insured_type_mother_age = result.result.user_data.user_action_data.insured_type_mother_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_father == '1')
      {
        this.insured_type_father = 'Father';
        this.insured_type_father_age = result.result.user_data.user_action_data.insured_type_father_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son1 == '1')
      {
        this.insured_type_son1 = 'Son1';
        this.insured_type_son1_age = result.result.user_data.user_action_data.insured_type_son1_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son2 == '1')
      {
        this.insured_type_son2 = 'Son2';
        this.insured_type_son2_age = result.result.user_data.user_action_data.insured_type_son2_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son3 == '1')
      {
        this.insured_type_son3 = 'Son3';
        this.insured_type_son3_age = result.result.user_data.user_action_data.insured_type_son3_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_son4 == '1')
      {
        this.insured_type_son4 = 'Son4';
        this.insured_type_son4_age = result.result.user_data.user_action_data.insured_type_son4_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter1 == '1')
      {
        this.insured_type_daughter1 = 'Daughter1';
        this.insured_type_daughter1_age = result.result.user_data.user_action_data.insured_type_daughter1_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter2 == '1')
      {
        this.insured_type_daughter2 = 'Daughter2';
        this.insured_type_daughter2_age = result.result.user_data.user_action_data.insured_type_daughter2_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter3 == '1')
      {
        this.insured_type_daughter3 = 'Daughter3';
        this.insured_type_daughter3_age = result.result.user_data.user_action_data.insured_type_daughter3_age+" Yrs";
      }

      if(result.result.user_data.user_action_data.insured_type_daughter4 == '1')
      {
        this.insured_type_daughter4 = 'Daughter4';
        this.insured_type_daughter4_age = result.result.user_data.user_action_data.insured_type_daughter4_age+" Yrs";
      }
      if(result.result.user_data.user_action_data.selected_deductible!='')
      {
          this.showTopup=true;
      }
      this.alcohol = result.result.user_data.user_action_data.alcohol;
      this.childplanning = result.result.user_data.user_action_data.childplanning;
      this.gender = result.result.user_data.user_action_data.gender;
      this.group_lable = result.result.user_data.user_action_data.group_lable;
      this.mem_dob = result.result.user_data.user_action_data.mem_dob;
      this.membersdisease = result.result.user_data.user_action_data.membersdisease;
      this.membersdisease_smoke = result.result.user_data.user_action_data.membersdisease_smoke;
      this.membersdisease_tobaco = result.result.user_data.user_action_data.membersdisease_tobaco;
      this.pincode = result.result.user_data.user_action_data.pincode;
      this.selected_suminsured = result.result.user_data.user_action_data.selected_suminsured;
      this.selected_deductible=result.result.user_data.user_action_data.selected_deductible;
      this.tenure = result.result.user_data.user_action_data.tenure;
      this.deductible = result.result.user_data.user_action_data.deductible;
      this.policyList = result.result.policy_list;
      this.covrageList = result.result.policy_list[0].covrage_list;
      this.policy_type_name_div = true;
    });

  }

  // closePopupCovrageQuote(){
  //   this.formcovrageform='none'; 
  //   this.resetFormCovrageQuote();
  //   this.loaderActive = false;
  // }

  // resetFormCovrageQuote(){
  //   this.submittedCovrageQuote = false;
  //   this.formQuoteDetails.patchValue({
  //     id : '',
  //     unique_reference_no : '',
  //     cover_1 : '',
  //     cover_2 : '',
  //     cover_3 : '',
  //     cover_4 : '',
  //     cover_5 : '',
  //     cover_6 : '',
  //     cover_7 : '',
  //     cover_8 : '',
  //     cover_9 : '',
  //     cover_10:''
  //   });
  //   $('#openModalButton').css('display', 'none');
  //   $('#div_class').removeClass('modal-backdrop fade show');

  // }

  quote_covragemodel(row_id)
  {
    // $('#openModalButton').removeClass('modal custom-modal coverage-modal fade');
    // $('#openModalButton').addClass('modal custom-modal coverage-modal fade show');
    // $('#div_class').addClass('modal-backdrop fade show');
    // $('#openModalButton').css('display', 'block');

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("quote_id", row_id);
    this.healthService.getHealthCovrageListData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      this.covrageList = result.covrage_list;
      this.plan_key = result.plan_key;
      this.unique_reference_no = result.unique_reference_no;
      this.quote_id = result.quote_id;
      //console.log(this.covrageList);
    });
    
  }


  getPackageAddons(addon_row,event,ic_wise_addon_list,plan_key,quote_id,unique_reference_no){
    var addon_ids :any = addon_row.cover_no;
    //console.log(addon_row); 
    if(addon_row.is_applied == '1'){
      this.setIndividualAddons(event,addon_row.cover_no,ic_wise_addon_list);
    }

    if(!event){  addon_ids = "" }

    if(addon_row.is_applied == '0'){
      addon_ids = this.getSelectedCheckboxValue(event,addon_row,ic_wise_addon_list,quote_id);
    }

    this.updateAddons(addon_row,addon_ids,ic_wise_addon_list,plan_key,quote_id,unique_reference_no);

  }

  setIndividualAddons(event,rule,ic_wise_addon_list){
    
    var array_individual : any  = rule.split(',');
    array_individual = array_individual.map(Number);
    console.log('ic_wise_addon_list');
    console.log(ic_wise_addon_list);
    console.log(event);
    ic_wise_addon_list.forEach(row => {
      if(jQuery.inArray(row.addon_ids, array_individual) !== -1){
        if(event){
          row.checked = 1;
          row.disabled = 1;
        }else{
          row.checked = 0;
          row.disabled = 0;
        }

      }

    });

  }

  getSelectedCheckboxValue(event,addon_row,ic_wise_addon_list,quote_id){
    console.log(addon_row.cover_no+ic_wise_addon_list);
    if(event.target.checked){
      this.addon_ids.push(addon_row.cover_no+'/'+quote_id);
    }else {
      let index: number = this.addon_ids.indexOf(addon_row.cover_no+'/'+quote_id);
      this.addon_ids.splice(index, 1);
    }
     return this.addon_ids;
   }

  updateAddons(row,addon_ids,ic_wise_addon_list,plan_key,quote_id,unique_reference_no){    
    var sendData = new FormData();
    sendData.append('ic_id',ic_wise_addon_list);
    sendData.append('cover_no',row.cover_no);
    sendData.append('addon_ids',addon_ids);
    sendData.append('plan_key',plan_key);
    sendData.append('unique_reference_no',unique_reference_no);
    sendData.append('id',quote_id);

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
    this.healthService.submitHealthquoteUpdateFormData(sendData)
    .subscribe(response => {
      var result : any = response;
      this.loaderActive = false;
      if(result.status){
        Swal.fire(result.message, '', "success");
      }else{
        Swal.fire (result.message,  "" ,  "error" );
      }
      this.getIndex();
      this.all_result_data = result.quotation_data;
      console.log('quotation_data start' + result);
      //this.setParameter(result.quotation_data);
      console.log('quotation_data end');
  });
  }

  view_covragefeatures()
  {
    this.router.navigate(['health-insurance-quote/policy-details']); 
    
  }

  quote_customerDetails(row_id,unique_reference_no){
      sessionStorage.setItem('buy_policy_id', row_id); 
      sessionStorage.setItem('buy_policy_unique_id',unique_reference_no);
      this.router.navigate(['health-insurance-quote/customer-details']);  
      // var quote_no : any = '61ba8c4226a3439';
      // var selected_ic_id : any = row.ic_id;
      // this.loaderActive = true;
      // sessionStorage.setItem('quote_no', quote_no);
      // sessionStorage.setItem('selected_ic_id', selected_ic_id);
      // var sendData = new FormData();
      // sendData.append('quote_no',quote_no);
      // sendData.append('selected_ic_id',selected_ic_id);

      // this.healthService.quoteBuy(sendData)
      // .subscribe(response => {
      //     var outputResult : any = response;
      //     this.loaderActive = false;
      //     if(outputResult.status){


      //     }
      // });

  }

  viewpolicy_Details(row_id,unique_reference_no, plan_key){
    sessionStorage.setItem('quote_data_health_id', row_id);
    sessionStorage.setItem('unique_reference_no',unique_reference_no);  
    sessionStorage.setItem('plan_key', plan_key); 
    this.router.navigate(['health-insurance-quote/policy-details']);  
  }

  filter_policylist(value)
  {
    alert(value);
  }

  ToggleButton1(e, quote_id,plan_name,suminsured,logo) {
    if (e.target.checked) {
        this.compare_count++;
        this.loaderActive = true;
        if(this.compare_count < 4)
        {
          this.loaderActive = false;
          if(this.compare_count == '1')
          {
            this.blank_quote_id_1 = true;
            this.blank_quote_id_2 = true;
            this.compare_count_1 = this.compare_count;
            this.compare_quote_id_1 = quote_id;
            this.compare_plan_name_1 = plan_name;
            this.compare_sum_insured_1 = suminsured;
            this.compare_logo_1 = logo;
            this.div_show_for_compare_plan_1 = true;
          }
          else if(this.compare_count == '2')
          {
            this.blank_quote_id_1 = false;
            this.blank_quote_id_2 = true;
            this.compare_count_2 = this.compare_count;
            this.compare_quote_id_2 = quote_id;
            this.compare_plan_name_2 = plan_name;
            this.compare_sum_insured_2 = suminsured;
            this.compare_logo_2 = logo;
            this.div_show_for_compare_plan_2 = true;
          }
          else if(this.compare_count == '3')
          {
            this.blank_quote_id_1 = false;
            this.blank_quote_id_2 = false;
            this.compare_count_3 = this.compare_count;
            this.compare_quote_id_3 = quote_id;
            this.compare_plan_name_3 = plan_name;
            this.compare_sum_insured_3 = suminsured;
            this.compare_logo_3 = logo;
            this.div_show_for_compare_plan_3 = true;
          }
          this.div_show_for_compare_policy = true; 
        }
        else 
        {
          this.loaderActive = false;
          $('#compare_'+quote_id).prop('checked', false);
          this.div_show_for_compare_policy = true; 
          Swal.fire('Compare Only 3 Plan Allowed', "", "error");
          return;
        }
         
    }
    else 
    {
      this.loaderActive = false;
      this.div_show_for_compare_policy = false;   
    }

  }
  
  getComparePlan(quote_id_1,quote_id_2,quote_id_3)
  {
    sessionStorage.setItem('quote_id_1', quote_id_1);
    sessionStorage.setItem('quote_id_2', quote_id_2);
    sessionStorage.setItem('quote_id_3', quote_id_3);
    this.router.navigate(['health-insurance-quote/compare-plan-details']);  
    
  }

  clocsecomparediv(compare_quote_id_1,compare_quote_id_2,compare_quote_id_3)
  {
    this.compare_count=0;
    this.div_show_for_compare_plan_1 = false;
    this.div_show_for_compare_plan_2 = false;
    this.div_show_for_compare_plan_3 = false;
    $('#compare_'+compare_quote_id_1).prop('checked', false);
    $('#compare_'+compare_quote_id_2).prop('checked', false);
    $('#compare_'+compare_quote_id_3).prop('checked', false);
    this.div_show_for_compare_policy = false;   
  }

  removeComparePlan(quote_id, compare_count, totalcompare_count)
  {
    if(compare_count == 1)
    {
      if(totalcompare_count == 1)
      {
        this.compare_count=0;
        $('#compare_'+quote_id).prop('checked', false);
        this.div_show_for_compare_policy = false;
      }
      else 
      {
        this.compare_count=compare_count-1;
        $('#compare_'+quote_id).prop('checked', false);
        this.div_show_for_compare_plan_1 = false;
        this.blank_quote_id_1 = true;
      }
      
    }
    else if(compare_count == 2)
    {
      this.compare_count=compare_count-1;
      $('#compare_'+quote_id).prop('checked', false);
      this.div_show_for_compare_plan_2 = false;
      this.blank_quote_id_2 = true;
    }
    else if(compare_count == 3)
    {
      this.compare_count=compare_count-1;
      $('#compare_'+quote_id).prop('checked', false);
      this.div_show_for_compare_plan_3 = false;
      this.blank_quote_id_1 = true;
    }
    
  }

}
