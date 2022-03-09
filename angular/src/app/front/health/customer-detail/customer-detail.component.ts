import { Component, OnInit,Renderer2,ViewChild  } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { CustomvalidationService } from "../../services/customvalidation.service";
import { HealthService } from "..//services/health.service";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;  
  formCustomerDetails: FormGroup;
  submittedQuoteDetails: boolean = false;
  setNullDate : any;
  minCurrentDate : any;
  maxDateForBirthdate : any;
  minDateForBirthdate : any;
  maxDateForBirthdateself : any;
  minDateForBirthdateself : any;
  maxDateForBirthdatespouse : any;
  minDateForBirthdatespouse : any;
  maxDateForBirthdatemother : any;
  minDateForBirthdatemother : any;
  maxDateForBirthdatefather : any;
  minDateForBirthdatefather : any;
  maxDateForBirthdateson1 : any;
  minDateForBirthdateson1 : any;
  maxDateForBirthdateson2 : any;
  minDateForBirthdateson2 : any;
  maxDateForBirthdateson3 : any;
  minDateForBirthdateson3 : any;
  maxDateForBirthdateson4 : any;
  minDateForBirthdateson4 : any;
  maxDateForBirthdatedaughter1 : any;
  minDateForBirthdatedaughter1 : any;
  maxDateForBirthdatedaughter2 : any;
  minDateForBirthdatedaughter2 : any;
  maxDateForBirthdatedaughter3 : any;
  minDateForBirthdatedaughter3 : any;
  maxDateForBirthdatedaughter4 : any;
  minDateForBirthdatedaughter4 : any;
  date_picker_birthday: NgbDateStruct;
  loaderActive: boolean = false;
  loginUserId: any; 
  selectedproducttypeid: any;
  loginUserType: any;
  policy_type_name: any;
  policy_subtype_name: any;
  alcohol: any;
  childplanning: any;
  //firstname:any;
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
  quote_data_health_id:any;
  unique_reference_no:any;
  quote_id:any;
  policyicid:any;
  OccupationList:any;
  nmonieeList:any;
  userQuotedetails:any;
  stateName :any;
  statecode :any;
  cityname  :any;
  citycode  :any;
  distname  :any;
  distcode  :any;
  pin_code  :any;
  policylogo:any;
  customerDetails:any;
  formcovrageform : any;
  submittedCovrageQuote : boolean = false;
  displayCovrageQuote : any = 'none';  
  mem_dob: any;
  membersdisease: any;
  membersdisease_smoke: any;
  membersdisease_tobaco: any;
  pincode: any;
  selected_suminsured: any;
  self_age:any;
  nomineeself_age:any;
  nomineespouse_age    :any;
  nomineemother_age    :any;
  nomineefather_age    :any;
  nomineeson1_age      :any;
  nomineeson2_age      :any;
  nomineeson3_age      :any;
  nomineeson4_age      :any;
  nomineedaughter1_age :any;
  nomineedaughter2_age :any;
  nomineedaughter3_age :any;
  nomineedaughter4_age :any;
  is_ic_multiple_appointee:any;
  is_ic_multiple_nominee:any;
  buy_policy_id:any;
  tenure: any;
  nomnne_dob:any;
  member_list:any;
  consume_oth_subs:any;
  oth_ins_pol:any;
  claim_ins_bef:any;
  self_age_y:any;
  div_show_for_claim_policy: boolean = true;
  insured:any;
  spouse_age :any;    
  mother_age :any;    
  father_age:any;     
  son1_age :any;      
  son2_age :any;      
  son3_age :any;      
  son4_age :any;      
  daughter1_age:any;  
  daughter2_age :any; 
  daughter3_age :any; 
  daughter4_age:any;  
  spouse_age_y :any;  
  mother_age_y :any;  
  father_age_y:any;   
  son1_age_y :any;    
  son2_age_y :any;    
  son3_age_y :any;    
  son4_age_y :any;    
  daughter1_age_y:any;
  daughter2_age_y:any;
  daughter3_age_y:any;
  daughter4_age_y:any;
  plan_id:any;
  showForSup:any;
  claim_ins_div:any;
  smoke_div:any;
  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_aadhar_card :any = "^[2-9]{1}[0-9]{11}$";
  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  maxDate:any;
  policy_type_name_div:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.showForSup=false;
    this.smoke_div=false;
   }

  ngOnInit(): void {
    this.policy_type_name_div = false;
    this.loginUserId = sessionStorage.getItem("user_id");
    this.selectedproducttypeid = sessionStorage.getItem(
      "selected_product_type_id"
    );
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.buy_policy_id = sessionStorage.getItem("buy_policy_id");
    this.unique_reference_no = sessionStorage.getItem("unique_reference_no");
    this.validationformCustomerDetails();
    this.getIndex();
    //this.getOccupationList();
    this.insured = false;
    const current = new Date();
    this.maxDateForBirthdate = {
      year: current.getFullYear() - 18,
      month: 12,
      day: 31
    };

    this.maxDate = this.maxDateForBirthdate.year+'-'+this.maxDateForBirthdate.month+'-'+this.maxDateForBirthdate.day;
  }

  getIndex() {
    this.claim_ins_div = true;
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("quote_data_health_id", this.buy_policy_id);
    sendData.append("unique_reference_no", this.unique_reference_no);
    this.healthService.getHealthQuoteListData(sendData).subscribe((res) => {
      this.loaderActive = false;
      this.insured_type_self = "";
      this.insured_type_spouse = "";
      this.insured_type_mother = "";
      this.insured_type_father = "";
      this.insured_type_son1 = "";
      this.insured_type_son2 = "";
      this.insured_type_son3 = "";
      this.insured_type_son4 = "";
      this.insured_type_daughter1 = "";
      this.insured_type_daughter2 = "";
      this.insured_type_daughter3 = "";
      this.insured_type_daughter4 = "";
      var result: any = res;      
      this.policy_type_name = result.result.user_data.policy_type_name;
      this.policy_subtype_name = result.result.user_data.policy_subtype_name;
      this.is_ic_multiple_appointee = result.result.user_data.is_ic_multiple_appointee;
      this.is_ic_multiple_nominee = result.result.user_data.is_ic_multiple_nominee;
      this.plan_id = result.result.policy_list[0].plan_id; 
      this.policyicid = result.result.policy_list[0].ic_id;  
      if(this.plan_id=='SURE001')
      {
          this.showForSup=true;
      }  

      if(this.policyicid == '14')
      {
        this.smoke_div=true;
      }

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
      this.tenure = result.result.user_data.user_action_data.tenure;
      this.policyList = result.result.policy_list[0];
      this.policylogo = result.result.policy_list[0].logo;
      this.userQuotedetails = result.result.user_data.user_action_data;
      this.customerDetails = result.result.user_data.customer_action_data;
      this.nomineeself_age =  result.result.user_data.customer_action_data.nomineeself_age;
      this.nomineespouse_age    =  result.result.user_data.customer_action_data.nomineespouse_age;
      this.nomineemother_age    =  result.result.user_data.customer_action_data.nomineemother_age;
      this.nomineefather_age    =  result.result.user_data.customer_action_data.nomineefather_age;
      this.nomineeson1_age      =  result.result.user_data.customer_action_data.nomineeson1_age;
      this.nomineeson2_age      =  result.result.user_data.customer_action_data.nomineeson2_age;
      this.nomineeson3_age      =  result.result.user_data.customer_action_data.nomineeson3_age;
      this.nomineeson4_age      =  result.result.user_data.customer_action_data.nomineeson4_age;
      this.nomineedaughter1_age =  result.result.user_data.customer_action_data.nomineedaughter1_age;
      this.nomineedaughter2_age =  result.result.user_data.customer_action_data.nomineedaughter2_age;
      this.nomineedaughter3_age =  result.result.user_data.customer_action_data.nomineedaughter3_age;
      this.nomineedaughter4_age =  result.result.user_data.customer_action_data.nomineedaughter4_age;
      this.quote_data_health_id = result.result.policy_list[0].quote_id;
      this.unique_reference_no = result.result.policy_list[0].unique_reference_no;
      this.member_list          = result.result.member_details;
      this.self_age             = result.result.user_data.user_action_data.insured_type_self_age;
      this.spouse_age           = result.result.user_data.user_action_data.insured_type_spouse_age;
      this.mother_age           = result.result.user_data.user_action_data.insured_type_mother_age;
      this.father_age           = result.result.user_data.user_action_data.insured_type_father_age;
      this.son1_age             = result.result.user_data.user_action_data.insured_type_son1_age;
      this.son2_age             = result.result.user_data.user_action_data.insured_type_son2_age;
      this.son3_age             = result.result.user_data.user_action_data.insured_type_son3_age;
      this.son4_age             = result.result.user_data.user_action_data.insured_type_son4_age;
      this.daughter1_age        = result.result.user_data.user_action_data.insured_type_daughter1_age;
      this.daughter2_age        = result.result.user_data.user_action_data.insured_type_daughter2_age;
      this.daughter3_age        = result.result.user_data.user_action_data.insured_type_daughter3_age;
      this.daughter4_age        = result.result.user_data.user_action_data.insured_type_daughter4_age;
      this.self_age_y           = this.self_age-1;
      this.spouse_age_y         = this.spouse_age-1;
      this.mother_age_y         = this.mother_age-1;
      this.father_age_y         = this.father_age-1;
      this.son1_age_y           = this.son1_age-1;
      this.son2_age_y           = this.son2_age-1;
      this.son3_age_y           = this.son3_age-1;
      this.son4_age_y           = this.son4_age-1;
      this.daughter1_age_y      = this.daughter1_age-1;
      this.daughter2_age_y      = this.daughter2_age-1;
      this.daughter3_age_y      = this.daughter3_age-1;
      this.daughter4_age_y      = this.daughter4_age-1;
      this.getOccupationList();
      this.getNomineeRelationList();
      this.getHealthPincodeData();
      this.loadScripts();
      const current = new Date();
      this.maxDateForBirthdate = {
        year: current.getFullYear() - 18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.minDateForBirthdate = {
        year: current.getFullYear() - 99,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdateself = {
        year: current.getFullYear() - this.self_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdateself = {
        year: current.getFullYear() - this.self_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatespouse = {
        year: current.getFullYear() - this.spouse_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatespouse = {
        year: current.getFullYear() - this.spouse_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatemother = {
        year: current.getFullYear() - this.mother_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatemother = {
        year: current.getFullYear() - this.mother_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatefather = {
        year: current.getFullYear() - this.father_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatefather = {
        year: current.getFullYear() - this.father_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdateson1 = {
        year: current.getFullYear() - this.son1_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdateson1 = {
        year: current.getFullYear() - this.son1_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdateson2 = {
        year: current.getFullYear() - this.son2_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdateson2 = {
        year: current.getFullYear() - this.son2_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdateson3 = {
        year: current.getFullYear() - this.son3_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdateson3 = {
        year: current.getFullYear() - this.son3_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdateson4 = {
        year: current.getFullYear() - this.son4_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdateson4 = {
        year: current.getFullYear() - this.son4_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatedaughter1 = {
        year: current.getFullYear() - this.daughter1_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatedaughter1 = {
        year: current.getFullYear() - this.daughter1_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatedaughter2 = {
        year: current.getFullYear() - this.daughter2_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatedaughter2 = {
        year: current.getFullYear() - this.daughter2_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatedaughter3 = {
        year: current.getFullYear() - this.daughter3_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatedaughter3 = {
        year: current.getFullYear() - this.daughter3_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdatedaughter4 = {
        year: current.getFullYear() - this.daughter4_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdatedaughter4 = {
        year: current.getFullYear() - this.daughter4_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      
      
      this.selectDateForAngular('buyer_dob',result.result.user_data.customer_action_data[0].buyer_dob),
      
        this.formCustomerDetails.patchValue({
          buyer_email_id:result.result.user_data.customer_action_data[0].buyer_email_id,
          buyer_mobile:result.result.user_data.customer_action_data[0].buyer_mobile,
          buyer_salutation:result.result.user_data.customer_action_data[0].buyer_salutation,
          buyer_first_name:result.result.user_data.customer_action_data[0].buyer_first_name,
          buyer_middle_name:result.result.user_data.customer_action_data[0].buyer_middle_name,
          buyer_last_name:result.result.user_data.customer_action_data[0].buyer_last_name,
          buyer_gender:result.result.user_data.customer_action_data[0].buyer_gender,
          buyer_occupation:result.result.user_data.customer_action_data[0].buyer_occupation,
          buyer_dob:result.result.user_data.customer_action_data[0].buyer_dob,
          self_buyer_occupation:result.result.user_data.customer_action_data[0].self_buyer_occupation,
          spouse_buyer_occupation:result.result.user_data.customer_action_data[0].spouse_buyer_occupation,
          mother_buyer_occupation:result.result.user_data.customer_action_data[0].mother_buyer_occupation,
          father_buyer_occupation:result.result.user_data.customer_action_data[0].father_buyer_occupation,
          son1_buyer_occupation:result.result.user_data.customer_action_data[0].son1_buyer_occupation,
          son2_buyer_occupation:result.result.user_data.customer_action_data[0].son2_buyer_occupation,
          son3_buyer_occupation:result.result.user_data.customer_action_data[0].son3_buyer_occupation,
          son4_buyer_occupation:result.result.user_data.customer_action_data[0].son4_buyer_occupation,
          daughter1_buyer_occupation:result.result.user_data.customer_action_data[0].daughter1_buyer_occupation,
          daughter2_buyer_occupation:result.result.user_data.customer_action_data[0].daughter2_buyer_occupation,
          daughter3_buyer_occupation:result.result.user_data.customer_action_data[0].daughter3_buyer_occupation,
          daughter4_buyer_occupation:result.result.user_data.customer_action_data[0].daughter4_buyer_occupation,
          buyer_pincode:result.result.user_data.customer_action_data[0].buyer_pincode,
          buyer_address1:result.result.user_data.customer_action_data[0].buyer_address1,
          buyer_address2:result.result.user_data.customer_action_data[0].buyer_address2,
          buyer_address3:result.result.user_data.customer_action_data[0].buyer_address3,
          buyer_nationality:result.result.user_data.customer_action_data[0].buyer_nationality,
          buyer_marital:result.result.user_data.customer_action_data[0].buyer_marital,
          buyer_pan:result.result.user_data.customer_action_data[0].buyer_pan,
          buyer_adhar:result.result.user_data.customer_action_data[0].buyer_adhar,
          buyer_insured:result.result.user_data.customer_action_data[0].buyer_insured,          
          memberself_salutation:result.result.user_data.customer_action_data[0].memberself_salutation,
          memberself_firstname:result.result.user_data.customer_action_data[0].memberself_firstname,
          memberself_middlename:result.result.user_data.customer_action_data[0].memberself_middlename,
          memberself_lastname:result.result.user_data.customer_action_data[0].memberself_lastname,
          memberself_relationship:result.result.user_data.customer_action_data[0].memberself_relationship,
          //memberself_relationship:"Self",
          memberself_dob:result.result.user_data.customer_action_data[0].memberself_dob,
          memberself_marital:result.result.user_data.customer_action_data[0].memberself_marital,
          memberself_smoke_qty:result.result.user_data.customer_action_data[0].memberself_smoke_qty,
          memberself_liquor_qty:result.result.user_data.customer_action_data[0].memberself_liquor_qty,
          memberself_wine_qty:result.result.user_data.customer_action_data[0].memberself_wine_qty,
          memberself_beer_qty:result.result.user_data.customer_action_data[0].memberself_beer_qty,
          memberself_gutka_qty:result.result.user_data.customer_action_data[0].memberself_gutka_qty,
          memberspouse_salutation:result.result.user_data.customer_action_data[0].memberspouse_salutation,
          memberspouse_firstname:result.result.user_data.customer_action_data[0].memberspouse_firstname,
          memberspouse_middlename:result.result.user_data.customer_action_data[0].memberspouse_middlename,
          memberspouse_lastname:result.result.user_data.customer_action_data[0].memberspouse_lastname,
          memberspouse_relationship:result.result.user_data.customer_action_data[0].memberspouse_relationship,
          memberspouse_dob:result.result.user_data.customer_action_data[0].memberspouse_dob,
          memberspouse_marital:result.result.user_data.customer_action_data[0].memberspouse_marital,
          memberspouse_smoke_qty:result.result.user_data.customer_action_data[0].memberspouse_smoke_qty,
          memberspouse_liquor_qty:result.result.user_data.customer_action_data[0].memberspouse_liquor_qty,
          memberspouse_wine_qty:result.result.user_data.customer_action_data[0].memberspouse_wine_qty,
          memberspouse_beer_qty:result.result.user_data.customer_action_data[0].memberspouse_beer_qty,
          memberspouse_gutka_qty:result.result.user_data.customer_action_data[0].memberspouse_gutka_qty,
          memberfather_salutation:result.result.user_data.customer_action_data[0].memberfather_salutation,
          memberfather_firstname:result.result.user_data.customer_action_data[0].memberfather_firstname,
          memberfather_middlename:result.result.user_data.customer_action_data[0].memberfather_middlename,
          memberfather_lastname:result.result.user_data.customer_action_data[0].memberfather_lastname,
          memberfather_relationship:result.result.user_data.customer_action_data[0].memberfather_relationship,
          memberfather_dob:result.result.user_data.customer_action_data[0].memberfather_dob,
          memberfather_marital:result.result.user_data.customer_action_data[0].memberfather_marital,
          memberfather_smoke_qty:result.result.user_data.customer_action_data[0].memberfather_smoke_qty,
          memberfather_liquor_qty:result.result.user_data.customer_action_data[0].memberfather_liquor_qty,
          memberfather_wine_qty:result.result.user_data.customer_action_data[0].memberfather_wine_qty,
          memberfather_beer_qty:result.result.user_data.customer_action_data[0].memberfather_beer_qty,
          memberfather_gutka_qty:result.result.user_data.customer_action_data[0].memberfather_gutka_qty,
          membermother_salutation:result.result.user_data.customer_action_data[0].membermother_salutation,
          membermother_firstname:result.result.user_data.customer_action_data[0].membermother_firstname,
          membermother_middlename:result.result.user_data.customer_action_data[0].membermother_middlename,
          membermother_lastname:result.result.user_data.customer_action_data[0].membermother_lastname,
          membermother_relationship:result.result.user_data.customer_action_data[0].membermother_relationship,
          membermother_dob:result.result.user_data.customer_action_data[0].membermother_dob,
          membermother_marital:result.result.user_data.customer_action_data[0].membermother_marital,
          membermother_smoke_qty:result.result.user_data.customer_action_data[0].membermother_smoke_qty,
          membermother_liquor_qty:result.result.user_data.customer_action_data[0].membermother_liquor_qty,
          membermother_wine_qty:result.result.user_data.customer_action_data[0].membermother_wine_qty,
          membermother_beer_qty:result.result.user_data.customer_action_data[0].membermother_beer_qty,
          membermother_gutka_qty:result.result.user_data.customer_action_data[0].membermother_gutka_qty,
          memberson1_salutation:result.result.user_data.customer_action_data[0].memberson1_salutation,
          memberson1_firstname:result.result.user_data.customer_action_data[0].memberson1_firstname,
          memberson1_middlename:result.result.user_data.customer_action_data[0].memberson1_middlename,
          memberson1_lastname:result.result.user_data.customer_action_data[0].memberson1_lastname,
          memberson1_relationship:result.result.user_data.customer_action_data[0].memberson1_relationship,
          memberson1_dob:result.result.user_data.customer_action_data[0].memberson1_dob,
          memberson1_marital:result.result.user_data.customer_action_data[0].memberson1_marital,
          memberson1_smoke_qty:result.result.user_data.customer_action_data[0].memberson1_smoke_qty,
          memberson1_liquor_qty:result.result.user_data.customer_action_data[0].memberson1_liquor_qty,
          memberson1_wine_qty:result.result.user_data.customer_action_data[0].memberson1_wine_qty,
          memberson1_beer_qty:result.result.user_data.customer_action_data[0].memberson1_beer_qty,
          memberson1_gutka_qty:result.result.user_data.customer_action_data[0].memberson1_gutka_qty,
          memberson2_salutation:result.result.user_data.customer_action_data[0].memberson2_salutation,
          memberson2_firstname:result.result.user_data.customer_action_data[0].memberson2_firstname,
          memberson2_middlename:result.result.user_data.customer_action_data[0].memberson2_middlename,
          memberson2_lastname:result.result.user_data.customer_action_data[0].memberson2_lastname,
          memberson2_relationship:result.result.user_data.customer_action_data[0].memberson2_relationship,
          memberson2_dob:result.result.user_data.customer_action_data[0].memberson2_dob,
          memberson2_marital:result.result.user_data.customer_action_data[0].memberson2_marital,
          memberson2_smoke_qty:result.result.user_data.customer_action_data[0].memberson2_smoke_qty,
          memberson2_liquor_qty:result.result.user_data.customer_action_data[0].memberson2_liquor_qty,
          memberson2_wine_qty:result.result.user_data.customer_action_data[0].memberson2_wine_qty,
          memberson2_beer_qty:result.result.user_data.customer_action_data[0].memberson2_beer_qty,
          memberson2_gutka_qty:result.result.user_data.customer_action_data[0].memberson2_gutka_qty,
          memberson3_salutation:result.result.user_data.customer_action_data[0].memberson3_salutation,
          memberson3_firstname:result.result.user_data.customer_action_data[0].memberson3_firstname,
          memberson3_middlename:result.result.user_data.customer_action_data[0].memberson3_middlename,
          memberson3_lastname:result.result.user_data.customer_action_data[0].memberson3_lastname,
          memberson3_relationship:result.result.user_data.customer_action_data[0].memberson3_relationship,
          memberson3_dob:result.result.user_data.customer_action_data[0].memberson3_dob,
          memberson3_marital:result.result.user_data.customer_action_data[0].memberson3_marital,
          memberson3_smoke_qty:result.result.user_data.customer_action_data[0].memberson3_smoke_qty,
          memberson3_liquor_qty:result.result.user_data.customer_action_data[0].memberson3_liquor_qty,
          memberson3_wine_qty:result.result.user_data.customer_action_data[0].memberson3_wine_qty,
          memberson3_beer_qty:result.result.user_data.customer_action_data[0].memberson3_beer_qty,
          memberson3_gutka_qty:result.result.user_data.customer_action_data[0].memberson3_gutka_qty,
          memberson4_salutation:result.result.user_data.customer_action_data[0].memberson4_salutation,
          memberson4_firstname:result.result.user_data.customer_action_data[0].memberson4_firstname,
          memberson4_middlename:result.result.user_data.customer_action_data[0].memberson4_middlename,
          memberson4_lastname:result.result.user_data.customer_action_data[0].memberson4_lastname,
          memberson4_relationship:result.result.user_data.customer_action_data[0].memberson4_relationship,
          memberson4_dob:result.result.user_data.customer_action_data[0].memberson4_dob,
          memberson4_marital:result.result.user_data.customer_action_data[0].memberson4_marital,
          memberson4_smoke_qty:result.result.user_data.customer_action_data[0].memberson4_smoke_qty,
          memberson4_liquor_qty:result.result.user_data.customer_action_data[0].memberson4_liquor_qty,
          memberson4_wine_qty:result.result.user_data.customer_action_data[0].memberson4_wine_qty,
          memberson4_beer_qty:result.result.user_data.customer_action_data[0].memberson4_beer_qty,
          memberson4_gutka_qty:result.result.user_data.customer_action_data[0].memberson4_gutka_qty,
          memberdaughter1_salutation:result.result.user_data.customer_action_data[0].memberdaughter1_salutation,
          memberdaughter1_firstname:result.result.user_data.customer_action_data[0].memberdaughter1_firstname,
          memberdaughter1_middlename:result.result.user_data.customer_action_data[0].memberdaughter1_middlename,
          memberdaughter1_lastname:result.result.user_data.customer_action_data[0].memberdaughter1_lastname,
          memberdaughter1_relationship:result.result.user_data.customer_action_data[0].memberdaughter1_relationship,
          memberdaughter1_dob:result.result.user_data.customer_action_data[0].memberdaughter1_dob,
          memberdaughter1_marital:result.result.user_data.customer_action_data[0].memberdaughter1_marital,
          memberdaughter1_smoke_qty:result.result.user_data.customer_action_data[0].memberdaughter1_smoke_qty,
          memberdaughter1_liquor_qty:result.result.user_data.customer_action_data[0].memberdaughter1_liquor_qty,
          memberdaughter1_wine_qty:result.result.user_data.customer_action_data[0].memberdaughter1_wine_qty,
          memberdaughter1_beer_qty:result.result.user_data.customer_action_data[0].memberdaughter1_beer_qty,
          memberdaughter1_gutka_qty:result.result.user_data.customer_action_data[0].memberdaughter1_gutka_qty,
          memberdaughter2_salutation:result.result.user_data.customer_action_data[0].memberdaughter2_salutation,
          memberdaughter2_firstname:result.result.user_data.customer_action_data[0].memberdaughter2_firstname,
          memberdaughter2_middlename:result.result.user_data.customer_action_data[0].memberdaughter2_middlename,
          memberdaughter2_lastname:result.result.user_data.customer_action_data[0].memberdaughter2_lastname,
          memberdaughter2_relationship:result.result.user_data.customer_action_data[0].memberdaughter2_relationship,
          memberdaughter2_dob:result.result.user_data.customer_action_data[0].memberdaughter2_dob,
          memberdaughter2_marital:result.result.user_data.customer_action_data[0].memberdaughter2_marital,
          memberdaughter2_smoke_qty:result.result.user_data.customer_action_data[0].memberdaughter2_smoke_qty,
          memberdaughter2_liquor_qty:result.result.user_data.customer_action_data[0].memberdaughter2_liquor_qty,
          memberdaughter2_wine_qty:result.result.user_data.customer_action_data[0].memberdaughter2_wine_qty,
          memberdaughter2_beer_qty:result.result.user_data.customer_action_data[0].memberdaughter2_beer_qty,
          memberdaughter2_gutka_qty:result.result.user_data.customer_action_data[0].memberdaughter2_gutka_qty,
          memberdaughter3_salutation:result.result.user_data.customer_action_data[0].memberdaughter3_salutation,
          memberdaughter3_firstname:result.result.user_data.customer_action_data[0].memberdaughter3_firstname,
          memberdaughter3_middlename:result.result.user_data.customer_action_data[0].memberdaughter3_middlename,
          memberdaughter3_lastname:result.result.user_data.customer_action_data[0].memberdaughter3_lastname,
          memberdaughter3_relationship:result.result.user_data.customer_action_data[0].memberdaughter3_relationship,
          memberdaughter3_dob:result.result.user_data.customer_action_data[0].memberdaughter3_dob,
          memberdaughter3_marital:result.result.user_data.customer_action_data[0].memberdaughter3_marital,
          memberdaughter3_smoke_qty:result.result.user_data.customer_action_data[0].memberdaughter3_smoke_qty,
          memberdaughter3_liquor_qty:result.result.user_data.customer_action_data[0].memberdaughter3_liquor_qty,
          memberdaughter3_wine_qty:result.result.user_data.customer_action_data[0].memberdaughter3_wine_qty,
          memberdaughter3_beer_qty:result.result.user_data.customer_action_data[0].memberdaughter3_beer_qty,
          memberdaughter3_gutka_qty:result.result.user_data.customer_action_data[0].memberdaughter3_gutka_qty,
          memberdaughter4_salutation:result.result.user_data.customer_action_data[0].memberdaughter4_salutation,
          memberdaughter4_firstname:result.result.user_data.customer_action_data[0].memberdaughter4_firstname,
          memberdaughter4_middlename:result.result.user_data.customer_action_data[0].memberdaughter4_middlename,
          memberdaughter4_lastname:result.result.user_data.customer_action_data[0].memberdaughter4_lastname,
          memberdaughter4_relationship:result.result.user_data.customer_action_data[0].memberdaughter4_relationship,
          memberdaughter4_dob:result.result.user_data.customer_action_data[0].memberdaughter4_dob,
          memberdaughter4_marital:result.result.user_data.customer_action_data[0].memberdaughter4_marital,          
          memberdaughter4_smoke_qty:result.result.user_data.customer_action_data[0].memberdaughter4_smoke_qty,
          memberdaughter4_liquor_qty:result.result.user_data.customer_action_data[0].memberdaughter4_liquor_qty,
          memberdaughter4_wine_qty:result.result.user_data.customer_action_data[0].memberdaughter4_wine_qty,
          memberdaughter4_beer_qty:result.result.user_data.customer_action_data[0].memberdaughter4_beer_qty,
          memberdaughter4_gutka_qty:result.result.user_data.customer_action_data[0].memberdaughter4_gutka_qty,
          nomineeself_salutation:result.result.user_data.customer_action_data[0].nomineeself_salutation,
          nomineeself_firstname:result.result.user_data.customer_action_data[0].nomineeself_firstname,
          nomineeself_middlename:result.result.user_data.customer_action_data[0].nomineeself_middlename,
          nomineeself_lastname:result.result.user_data.customer_action_data[0].nomineeself_lastname,
          nomineeself_relationship:result.result.user_data.customer_action_data[0].nomineeself_relationship,
          nomineeself_dob:result.result.user_data.customer_action_data[0].nomineeself_dob,
          nomineeself_marital:result.result.user_data.customer_action_data[0].nomineeself_marital,
          nomineespouse_salutation:result.result.user_data.customer_action_data[0].nomineespouse_salutation,
          nomineespouse_firstname:result.result.user_data.customer_action_data[0].nomineespouse_firstname,
          nomineespouse_middlename:result.result.user_data.customer_action_data[0].nomineespouse_middlename,
          nomineespouse_lastname:result.result.user_data.customer_action_data[0].nomineespouse_lastname,
          nomineespouse_relationship:result.result.user_data.customer_action_data[0].nomineespouse_relationship,
          nomineespouse_dob:result.result.user_data.customer_action_data[0].nomineespouse_dob,
          nomineespouse_marital:result.result.user_data.customer_action_data[0].nomineespouse_marital,
          nomineemother_salutation:result.result.user_data.customer_action_data[0].nomineemother_salutation,
          nomineemother_firstname:result.result.user_data.customer_action_data[0].nomineemother_firstname,
          nomineemother_middlename:result.result.user_data.customer_action_data[0].nomineemother_middlename,
          nomineemother_lastname:result.result.user_data.customer_action_data[0].nomineemother_lastname,
          nomineemother_relationship:result.result.user_data.customer_action_data[0].nomineemother_relationship,
          nomineemother_dob:result.result.user_data.customer_action_data[0].nomineemother_dob,
          nomineemother_marital:result.result.user_data.customer_action_data[0].nomineemother_marital,
          nomineefather_salutation:result.result.user_data.customer_action_data[0].nomineefather_salutation,
          nomineefather_firstname:result.result.user_data.customer_action_data[0].nomineefather_firstname,
          nomineefather_middlename:result.result.user_data.customer_action_data[0].nomineefather_middlename,
          nomineefather_lastname:result.result.user_data.customer_action_data[0].nomineefather_lastname,
          nomineefather_relationship:result.result.user_data.customer_action_data[0].nomineefather_relationship,
          nomineefather_dob:result.result.user_data.customer_action_data[0].nomineefather_dob,
          nomineefather_marital:result.result.user_data.customer_action_data[0].nomineefather_marital,
          nomineeson1_salutation:result.result.user_data.customer_action_data[0].nomineeson1_salutation,
          nomineeson1_firstname:result.result.user_data.customer_action_data[0].nomineeson1_firstname,
          nomineeson1_middlename:result.result.user_data.customer_action_data[0].nomineeson1_middlename,
          nomineeson1_lastname:result.result.user_data.customer_action_data[0].nomineeson1_lastname,
          nomineeson1_relationship:result.result.user_data.customer_action_data[0].nomineeson1_relationship,
          nomineeson1_dob:result.result.user_data.customer_action_data[0].nomineeson1_dob,
          nomineeson1_marital:result.result.user_data.customer_action_data[0].nomineeson1_marital,
          nomineeson2_salutation:result.result.user_data.customer_action_data[0].nomineeson2_salutation,
          nomineeson2_firstname:result.result.user_data.customer_action_data[0].nomineeson2_firstname,
          nomineeson2_middlename:result.result.user_data.customer_action_data[0].nomineeson2_middlename,
          nomineeson2_lastname:result.result.user_data.customer_action_data[0].nomineeson2_lastname,
          nomineeson2_relationship:result.result.user_data.customer_action_data[0].nomineeson2_relationship,
          nomineeson2_dob:result.result.user_data.customer_action_data[0].nomineeson2_dob,
          nomineeson2_marital:result.result.user_data.customer_action_data[0].nomineeson2_marital,
          nomineeson3_salutation:result.result.user_data.customer_action_data[0].nomineeson3_salutation,
          nomineeson3_firstname:result.result.user_data.customer_action_data[0].nomineeson3_firstname,
          nomineeson3_middlename:result.result.user_data.customer_action_data[0].nomineeson3_middlename,
          nomineeson3_lastname:result.result.user_data.customer_action_data[0].nomineeson3_lastname,
          nomineeson3_relationship:result.result.user_data.customer_action_data[0].nomineeson3_relationship,
          nomineeson3_dob:result.result.user_data.customer_action_data[0].nomineeson3_dob,
          nomineeson3_marital:result.result.user_data.customer_action_data[0].nomineeson3_marital,
          nomineeson4_salutation:result.result.user_data.customer_action_data[0].nomineeson4_salutation,
          nomineeson4_firstname:result.result.user_data.customer_action_data[0].nomineeson4_firstname,
          nomineeson4_middlename:result.result.user_data.customer_action_data[0].nomineeson4_middlename,
          nomineeson4_lastname:result.result.user_data.customer_action_data[0].nomineeson4_lastname,
          nomineeson4_relationship:result.result.user_data.customer_action_data[0].nomineeson4_relationship,
          nomineeson4_dob:result.result.user_data.customer_action_data[0].nomineeson4_dob,
          nomineeson4_marital:result.result.user_data.customer_action_data[0].nomineeson4_marital,
          nomineedaughter1_salutation:result.result.user_data.customer_action_data[0].nomineedaughter1_salutation,
          nomineedaughter1_firstname:result.result.user_data.customer_action_data[0].nomineedaughter1_firstname,
          nomineedaughter1_middlename:result.result.user_data.customer_action_data[0].nomineedaughter1_middlename,
          nomineedaughter1_lastname:result.result.user_data.customer_action_data[0].nomineedaughter1_lastname,
          nomineedaughter1_relationship:result.result.user_data.customer_action_data[0].nomineedaughter1_relationship,
          nomineedaughter1_dob:result.result.user_data.customer_action_data[0].nomineedaughter1_dob,
          nomineedaughter1_marital:result.result.user_data.customer_action_data[0].nomineedaughter1_marital,
          nomineedaughter2_salutation:result.result.user_data.customer_action_data[0].nomineedaughter2_salutation,
          nomineedaughter2_firstname:result.result.user_data.customer_action_data[0].nomineedaughter2_firstname,
          nomineedaughter2_middlename:result.result.user_data.customer_action_data[0].nomineedaughter2_middlename,
          nomineedaughter2_lastname:result.result.user_data.customer_action_data[0].nomineedaughter2_lastname,
          nomineedaughter2_relationship:result.result.user_data.customer_action_data[0].nomineedaughter2_relationship,
          nomineedaughter2_dob:result.result.user_data.customer_action_data[0].nomineedaughter2_dob,
          nomineedaughter2_marital:result.result.user_data.customer_action_data[0].nomineedaughter2_marital,
          nomineedaughter3_salutation:result.result.user_data.customer_action_data[0].nomineedaughter3_salutation,
          nomineedaughter3_firstname:result.result.user_data.customer_action_data[0].nomineedaughter3_firstname,
          nomineedaughter3_middlename:result.result.user_data.customer_action_data[0].nomineedaughter3_middlename,
          nomineedaughter3_lastname:result.result.user_data.customer_action_data[0].nomineedaughter3_lastname,
          nomineedaughter3_relationship:result.result.user_data.customer_action_data[0].nomineedaughter3_relationship,
          nomineedaughter3_dob:result.result.user_data.customer_action_data[0].nomineedaughter3_dob,
          nomineedaughter3_marital:result.result.user_data.customer_action_data[0].nomineedaughter3_marital,
          nomineedaughter4_salutation:result.result.user_data.customer_action_data[0].nomineedaughter4_salutation,
          nomineedaughter4_firstname:result.result.user_data.customer_action_data[0].nomineedaughter4_firstname,
          nomineedaughter4_middlename:result.result.user_data.customer_action_data[0].nomineedaughter4_middlename,
          nomineedaughter4_lastname:result.result.user_data.customer_action_data[0].nomineedaughter4_lastname,
          nomineedaughter4_relationship:result.result.user_data.customer_action_data[0].nomineedaughter4_relationship,
          nomineedaughter4_dob:result.result.user_data.customer_action_data[0].nomineedaughter4_dob,
          nomineedaughter4_marital:result.result.user_data.customer_action_data[0].nomineedaughter4_marital,
          nominee_salutation:result.result.user_data.customer_action_data[0].nominee_salutation,
          nominee_firstname:result.result.user_data.customer_action_data[0].nominee_firstname,
          nominee_middlename:result.result.user_data.customer_action_data[0].nominee_middlename,
          nominee_lastname:result.result.user_data.customer_action_data[0].nominee_lastname,
          nominee_relationship:result.result.user_data.customer_action_data[0].nominee_relationship,
          nominee_dob:result.result.user_data.customer_action_data[0].nominee_dob,
          nominee_marital:result.result.user_data.customer_action_data[0].nominee_marital,
          consume_oth_subs:result.result.user_data.customer_action_data[0].consume_oth_subs,
          oth_ins_pol:result.result.user_data.customer_action_data[0].oth_ins_pol,
          appointee_salutation:result.result.user_data.customer_action_data[0].appointee_salutation,
          appointee_firstname:result.result.user_data.customer_action_data[0].appointee_firstname,
          appointee_middlename:result.result.user_data.customer_action_data[0].appointee_middlename,
          appointee_lastname:result.result.user_data.customer_action_data[0].appointee_lastname,
          appointee_relationship:result.result.user_data.customer_action_data[0].appointee_relationship,
          appointee_dob:result.result.user_data.customer_action_data[0].appointee_dob,
          appointee_marital:result.result.user_data.customer_action_data[0].appointee_marital,
         //appointee_marital:result.result.user_data.customer_action_data[0].appointee_marital,
          
        });
        this.nomnne_dob=true;
        
    });
    this.policy_type_name_div = true;
  }

  getOccupationList()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("ic_id", this.policyicid);
        this.healthService.getHealthOccupationListData(sendData).subscribe((res) => {
        this.loaderActive = false;  
        var result: any = res;
        this.OccupationList = result.occupation_list;
       
      });
  }

  getNomineeRelationList()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("ic_id", this.policyicid);
        sendData.append("plan_id", this.plan_id);
        this.healthService.getHealthNomineeListData(sendData).subscribe((res) => {
        this.loaderActive = false;  
        var result: any = res;
        this.nmonieeList = result;
       
      });
  }  

  getHealthPincodeData()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("pincode", this.pincode);
        sendData.append("quote_data_health_id", this.buy_policy_id);
        this.healthService.getHealthPincodeData(sendData).subscribe((res) => {
        var result: any = res;
        this.loaderActive = false;
        this.pin_code  = this.pincode
        this.stateName = result.result.STATE_CD;
        this.statecode = result.result.STATE_NAME;
        this.cityname  = result.result.DISTRICT_CD;
        this.citycode  = result.result.CITY_CODE;
        this.distname  = result.result.DISTRICT_CD;
        this.distcode  = result.result.DISTRICT_CODE;
        
      });
  }

  
  selectDate(field,event){
    console.log(field);
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    if(field == 'nominee_dob'){
      this.formCustomerDetails.patchValue({ nominee_dob : selected_date });
    }
    if(field == 'nomineeself_dob'){
      this.formCustomerDetails.patchValue({ nomineeself_dob : selected_date });
    }
    if(field == 'nomineespouse_dob'){
      this.formCustomerDetails.patchValue({ nomineespouse_dob : selected_date });
    }
    if(field == 'nomineemother_dob'){
      this.formCustomerDetails.patchValue({ nomineemother_dob : selected_date });
    }
    if(field == 'nomineefather_dob'){
      this.formCustomerDetails.patchValue({ nomineefather_dob : selected_date });
    }
    if(field == 'nomineeson1_dob'){
      this.formCustomerDetails.patchValue({ nomineeson1_dob : selected_date });
    }
    if(field == 'nomineeson2_dob'){
      this.formCustomerDetails.patchValue({ nomineeson2_dob : selected_date });
    }
    if(field == 'nomineeson3_dob'){
      this.formCustomerDetails.patchValue({ nomineeson3_dob : selected_date });
    }
    if(field == 'nomineeson4_dob'){
      this.formCustomerDetails.patchValue({ nomineeson4_dob : selected_date });
    }
    if(field == 'nomineedaughter1_dob'){
      this.formCustomerDetails.patchValue({ nomineedaughter1_dob : selected_date });
    }
    if(field == 'nomineedaughter2_dob'){
      this.formCustomerDetails.patchValue({ nomineedaughter2_dob : selected_date });
    }
    if(field == 'nomineedaughter3_dob'){
      this.formCustomerDetails.patchValue({ nomineedaughter3_dob : selected_date });
    }
    if(field == 'nomineedaughter4_dob'){
      this.formCustomerDetails.patchValue({ nomineedaughter4_dob : selected_date });
    }
    if(field == 'buyer_dob'){
      this.formCustomerDetails.patchValue({ buyer_dob : selected_date });
    }
    var sendData = new FormData();
    sendData.append("dateofbirth", selected_date);
    this.healthService.getNomineeAge(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      if(result.status){
        this.nomnne_dob=false;
          this.formCustomerDetails.value.appointee_salutation='';
          this.formCustomerDetails.value.appointee_firstname='';
          this.formCustomerDetails.value.appointee_middlename='';
          this.formCustomerDetails.value.appointee_lastname='';
          this.formCustomerDetails.value.appointee_relationship='';
          this.formCustomerDetails.value.appointee_dob='';
          this.formCustomerDetails.value.appointee_marital='';
          
      }else{
        Swal.fire(result.message, '', 'error');
        this.nomnne_dob=true;
        return;
        
      }
    });

  }

  selectDateForAngular(field,selected_date){
    var selected_date :any = new Date(selected_date);
    var current :any = new Date();
    var year : any =  selected_date.getFullYear();
    var month : any =  selected_date.getMonth() + 1;
    var day : any =  selected_date.getDate();
    var set_date :any= { year: year, month: month, day: day };

    day  = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
    year =  year;

    var selected_date_for_form : any = day +'/'+ month +'/'+ year;


    if(field == 'buyer_dob'){
      if(selected_date_for_form != '1970-01-01'){
        //alert(selected_date_for_form);
        this.date_picker_birthday = set_date;
        this.formCustomerDetails.patchValue({ buyer_dob : selected_date_for_form });
      }

    }
        
    }
    

  ToggleButton1(e) {
    if (e.target.checked) {
     
      this.loadScripts();
      const current = new Date();
      this.maxDateForBirthdate = {
        year: current.getFullYear() - this.self_age_y,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      
      this.minDateForBirthdate = {
        year: current.getFullYear() - this.self_age,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
        var buyer_salutation  = this.formCustomerDetails.value.buyer_salutation;
        var buyer_first_name  = this.formCustomerDetails.value.buyer_first_name;
        var buyer_middle_name = this.formCustomerDetails.value.buyer_middle_name;
        var buyer_last_name   = this.formCustomerDetails.value.buyer_last_name;
        var buyer_occupation  = this.formCustomerDetails.value.buyer_occupation;
        var buyer_dob         = this.formCustomerDetails.value.buyer_dob;
        var buyer_marital     = this.formCustomerDetails.value.buyer_marital;

      this.formCustomerDetails.patchValue({
        memberself_salutation:buyer_salutation,
        memberself_firstname:buyer_first_name,
        memberself_middlename:buyer_middle_name,
        memberself_lastname:buyer_last_name,
        memberself_occupation:buyer_occupation,
        memberself_marital:buyer_marital,
        memberself_dob:buyer_dob,     
        self_buyer_occupation:buyer_occupation,     
        //memberself_occupation: 
      })
      this.insured = true;
      
    }
    else{
     
      this.loadScripts();
      const current = new Date();
      this.maxDateForBirthdate = {
        year: current.getFullYear() - 18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.minDateForBirthdate = {
        year: current.getFullYear() - 99,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.insured = false;
    } 
   
  }     

  selectDateDob(field,event){
    console.log(field);
    const current_date = new Date();
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    if(field == 'buyer_dob'){
      this.formCustomerDetails.patchValue({ buyer_dob : selected_date });
    }
    if(field == 'memberself_dob'){
      this.formCustomerDetails.patchValue({ memberself_dob : selected_date });
    }
    if(field == 'membermother_dob'){
      this.formCustomerDetails.patchValue({ membermother_dob : selected_date });
    }
    if(field == 'memberfather_dob'){
      this.formCustomerDetails.patchValue({ memberfather_dob : selected_date });
    }
    if(field == 'memberspouse_dob'){
      this.formCustomerDetails.patchValue({ memberspouse_dob : selected_date });
    }
    if(field == 'memberson1_dob'){
      this.formCustomerDetails.patchValue({ memberson1_dob : selected_date });
    }
    if(field == 'memberson2_dob'){
      this.formCustomerDetails.patchValue({ memberson2_dob : selected_date });
    }
    if(field == 'memberson3_dob'){
      this.formCustomerDetails.patchValue({ memberson3_dob : selected_date });
    }
    if(field == 'memberson4_dob'){
      this.formCustomerDetails.patchValue({ memberson4_dob : selected_date });
    }
    if(field == 'memberdaughter1_dob'){
      this.formCustomerDetails.patchValue({ memberdaughter1_dob : selected_date });
    }
    if(field == 'memberdaughter2_dob'){
      this.formCustomerDetails.patchValue({ memberdaughter2_dob : selected_date });
    }
    if(field == 'memberdaughter3_dob'){
      this.formCustomerDetails.patchValue({ memberdaughter3_dob : selected_date });
    }
    if(field == 'memberdaughter4_dob'){
      this.formCustomerDetails.patchValue({ memberdaughter4_dob : selected_date });
    }


  }

  validationformCustomerDetails() {
    this.formCustomerDetails = this.formBuilder.group({
      buyer_email_id:["", [Validators.required,Validators.pattern(this.validation_for_email)]],
      buyer_mobile: ["", [Validators.required,Validators.pattern(this.validation_for_mobile_no)]],
      buyer_salutation: ["", [Validators.required]],
      buyer_first_name: ["", [Validators.required]],
      buyer_middle_name: [""],
      buyer_last_name: ["", [Validators.required]],
      buyer_gender: ["", [Validators.required]],
      buyer_occupation: ["", [Validators.required]],
      buyer_dob:["", [Validators.required]],
      self_buyer_occupation: [""],
      spouse_buyer_occupation: [""],      
      mother_buyer_occupation: [""],
      father_buyer_occupation: [""],      
      son1_buyer_occupation: [""],
      son2_buyer_occupation: [""],      
      son3_buyer_occupation: [""],
      son4_buyer_occupation: [""],      
      daughter1_buyer_occupation: [""],
      daughter2_buyer_occupation: [""],      
      daughter3_buyer_occupation: [""],
      daughter4_buyer_occupation: [""],      
      buyer_address1: ["", [Validators.required]],
      buyer_address2: ["", [Validators.required]],
      buyer_address3: [""],
      buyer_nationality: [""],
      buyer_marital: ["", [Validators.required]],
      buyer_pan: ["",[Validators.pattern(this.validation_for_pan)]],
      buyer_adhar: ["",[Validators.pattern(this.validation_for_aadhar_card)]],
      buyer_insured: [""],
      memberself_salutation: ["", [Validators.required]],
      memberself_firstname: [""],
      memberself_middlename: [""],
      memberself_lastname: [""],
      memberself_relationship: [""],
      memberself_dob: [""],
      memberself_marital: [""],
      memberself_smoke_qty:[""],
      memberself_liquor_qty:[""],
      memberself_wine_qty:[""],
      memberself_beer_qty:[""],
      memberself_gutka_qty:[""],
      memberspouse_salutation: [""],
      memberspouse_firstname: [""],
      memberspouse_middlename: [""],
      memberspouse_lastname: [""],
      memberspouse_relationship: [""],
      memberspouse_dob: [""],
      memberspouse_marital: [""],
      memberspouse_smoke_qty:[""],
      memberspouse_liquor_qty:[""],
      memberspouse_wine_qty:[""],
      memberspouse_beer_qty:[""],
      memberspouse_gutka_qty:[""],
      memberfather_salutation: [""],
      memberfather_firstname: [""],
      memberfather_middlename: [""],
      memberfather_lastname: [""],
      memberfather_relationship: [""],
      memberfather_dob: [""],
      memberfather_marital: [""],
      memberfather_smoke_qty:[""],
      memberfather_liquor_qty:[""],
      memberfather_wine_qty:[""],
      memberfather_beer_qty:[""],
      memberfather_gutka_qty:[""],      
      membermother_salutation: [""],
      membermother_firstname: [""],
      membermother_middlename: [""],
      membermother_lastname: [""],
      membermother_relationship: [""],
      membermother_dob: [""],
      membermother_marital: [""],
      membermother_smoke_qty:[""],
      membermother_liquor_qty:[""],
      membermother_wine_qty:[""],
      membermother_beer_qty:[""],
      membermother_gutka_qty:[""],
      memberson1_salutation: [""],
      memberson1_firstname: [""],
      memberson1_middlename: [""],
      memberson1_lastname: [""],
      memberson1_relationship: [""],
      memberson1_dob: [""],
      memberson1_marital: [""],
      memberson1_smoke_qty:[""],
      memberson1_liquor_qty:[""],
      memberson1_wine_qty:[""],
      memberson1_beer_qty:[""],
      memberson1_gutka_qty:[""],
      memberson2_salutation: [""],
      memberson2_firstname: [""],
      memberson2_middlename: [""],
      memberson2_lastname: [""],
      memberson2_relationship: [""],
      memberson2_dob: [""],
      memberson2_marital: [""],
      memberson2_smoke_qty:[""],
      memberson2_liquor_qty:[""],
      memberson2_wine_qty:[""],
      memberson2_beer_qty:[""],
      memberson2_gutka_qty:[""],
      memberson3_salutation: [""],
      memberson3_firstname: [""],
      memberson3_middlename: [""],
      memberson3_lastname: [""],
      memberson3_relationship: [""],
      memberson3_dob: [""],
      memberson3_marital: [""],
      memberson3_smoke_qty:[""],
      memberson3_liquor_qty:[""],
      memberson3_wine_qty:[""],
      memberson3_beer_qty:[""],
      memberson3_gutka_qty:[""],
      memberson4_salutation: [""],
      memberson4_firstname: [""],
      memberson4_middlename: [""],
      memberson4_lastname: [""],
      memberson4_relationship: [""],
      memberson4_dob: [""],
      memberson4_marital: [""],
      memberson4_smoke_qty:[""],
      memberson4_liquor_qty:[""],
      memberson4_wine_qty:[""],
      memberson4_beer_qty:[""],
      memberson4_gutka_qty:[""],
      memberdaughter1_salutation: [""],
      memberdaughter1_firstname: [""],
      memberdaughter1_middlename: [""],
      memberdaughter1_lastname: [""],
      memberdaughter1_relationship: [""],
      memberdaughter1_dob: [""],
      memberdaughter1_marital: [""],
      memberdaughter1_smoke_qty:[""],
      memberdaughter1_liquor_qty:[""],
      memberdaughter1_wine_qty:[""],
      memberdaughter1_beer_qty:[""],
      memberdaughter1_gutka_qty:[""],
      memberdaughter2_salutation: [""],
      memberdaughter2_firstname: [""],
      memberdaughter2_middlename: [""],
      memberdaughter2_lastname: [""],
      memberdaughter2_relationship: [""],
      memberdaughter2_dob: [""],
      memberdaughter2_marital: [""],
      memberdaughter2_smoke_qty:[""],
      memberdaughter2_liquor_qty:[""],
      memberdaughter2_wine_qty:[""],
      memberdaughter2_beer_qty:[""],
      memberdaughter2_gutka_qty:[""],
      memberdaughter3_salutation: [""],
      memberdaughter3_firstname: [""],
      memberdaughter3_middlename: [""],
      memberdaughter3_lastname: [""],
      memberdaughter3_relationship: [""],
      memberdaughter3_dob: [""],
      memberdaughter3_marital: [""],
      memberdaughter3_smoke_qty:[""],
      memberdaughter3_liquor_qty:[""],
      memberdaughter3_wine_qty:[""],
      memberdaughter3_beer_qty:[""],
      memberdaughter3_gutka_qty:[""],
      memberdaughter4_salutation: [""],
      memberdaughter4_firstname: [""],
      memberdaughter4_middlename: [""],
      memberdaughter4_lastname: [""],
      memberdaughter4_relationship: [""],
      memberdaughter4_dob: [""],
      memberdaughter4_marital: [""],
      memberdaughter4_smoke_qty:[""],
      memberdaughter4_liquor_qty:[""],
      memberdaughter4_wine_qty:[""],
      memberdaughter4_beer_qty:[""],
      memberdaughter4_gutka_qty:[""],
      nominee_salutation: [""],
      nominee_firstname: [""],
      nominee_middlename: [""],
      nominee_lastname: [""],
      nominee_relationship: [""],
      nominee_dob: [""],
      nominee_marital: [""],
      appointee_salutation: [""],
      appointee_firstname: [""],
      appointee_middlename: [""],
      appointee_lastname: [""],
      appointee_relationship: [""],
      appointee_dob: [""],
      appointee_marital: [""],
      consume_oth_subs: [""],
      oth_ins_pol: [""],
      claim_ins_bef: [""],
      firstname_0:[""],
      
    });
  }


  setParameterForSubmitForm() {
    let uploadData = new FormData();
    console.log(this.member_list.length+'test');
    let cnt = this.member_list.length;
    
    // for(let i=0; i<cnt; i++){
      //form[formData[i].label]=new FormControl();
      // console.log(this.formCustomerDetails.value.firstname0);
      // console.log('test!');
      
      //uploadData.append("firstname_"+cnt, this.formCustomerDetails.value."firstname_"+cnt);
      //uploadData.append("insured_type_son1_age", this.formQuoteDetails.value.insured_type_son1_age);
    // }
    
    //this.formCustomerDetails = new FormGroup(form);
    console.log(uploadData+'test');
    uploadData.append("quote_data_health_id", this.quote_data_health_id);
    uploadData.append("unique_reference_no", this.unique_reference_no);
    uploadData.append("buyer_email_id", this.formCustomerDetails.value.buyer_email_id);
    uploadData.append("buyer_mobile", this.formCustomerDetails.value.buyer_mobile);
    uploadData.append("buyer_salutation", this.formCustomerDetails.value.buyer_salutation);
    uploadData.append("buyer_first_name", this.formCustomerDetails.value.buyer_first_name);
    uploadData.append("buyer_middle_name", this.formCustomerDetails.value.buyer_middle_name);
    uploadData.append("buyer_last_name", this.formCustomerDetails.value.buyer_last_name);
    uploadData.append("buyer_gender", this.formCustomerDetails.value.buyer_gender);
    uploadData.append("buyer_occupation", this.formCustomerDetails.value.buyer_occupation);
    uploadData.append("buyer_dob", this.formCustomerDetails.value.buyer_dob); 
    //uploadData.append("firstname1", this.formCustomerDetails.value.firstname1);
    uploadData.append("self_buyer_occupation", this.formCustomerDetails.value.self_buyer_occupation);
    uploadData.append("spouse_buyer_occupation", this.formCustomerDetails.value.spouse_buyer_occupation);
    uploadData.append("mother_buyer_occupation", this.formCustomerDetails.value.mother_buyer_occupation);
    uploadData.append("father_buyer_occupation", this.formCustomerDetails.value.father_buyer_occupation);
    uploadData.append("son1_buyer_occupation", this.formCustomerDetails.value.son1_buyer_occupation);
    uploadData.append("son2_buyer_occupation", this.formCustomerDetails.value.son2_buyer_occupation);
    uploadData.append("son3_buyer_occupation", this.formCustomerDetails.value.son3_buyer_occupation);
    uploadData.append("son4_buyer_occupation", this.formCustomerDetails.value.son4_buyer_occupation);
    uploadData.append("daughter1_buyer_occupation", this.formCustomerDetails.value.daughter1_buyer_occupation);
    uploadData.append("daughter2_buyer_occupation", this.formCustomerDetails.value.daughter2_buyer_occupation);
    uploadData.append("daughter3_buyer_occupation", this.formCustomerDetails.value.daughter3_buyer_occupation);
    uploadData.append("daughter4_buyer_occupation", this.formCustomerDetails.value.daughter4_buyer_occupation);
    uploadData.append("buyer_address1", this.formCustomerDetails.value.buyer_address1);
    uploadData.append("buyer_address2", this.formCustomerDetails.value.buyer_address2);
    uploadData.append("buyer_address3", this.formCustomerDetails.value.buyer_address3);
    uploadData.append("buyer_pincode", this.pin_code);
    uploadData.append("buyer_state", this.statecode);
    uploadData.append("buyer_city", this.citycode);
    uploadData.append("buyer_district",this.distcode);
    uploadData.append("buyer_nationality", this.formCustomerDetails.value.buyer_nationality);
    uploadData.append("buyer_marital", this.formCustomerDetails.value.buyer_marital);
    uploadData.append("buyer_pan", this.formCustomerDetails.value.buyer_pan);
    uploadData.append("buyer_adhar", this.formCustomerDetails.value.buyer_adhar);
    uploadData.append("buyer_insured", this.formCustomerDetails.value.buyer_insured);
    uploadData.append("memberself_salutation", this.formCustomerDetails.value.memberself_salutation);
    uploadData.append("memberself_firstname", this.formCustomerDetails.value.memberself_firstname);
    uploadData.append("memberself_middlename", this.formCustomerDetails.value.memberself_middlename);
    uploadData.append("memberself_lastname", this.formCustomerDetails.value.memberself_lastname);
    uploadData.append("memberself_relationship", this.formCustomerDetails.value.memberself_relationship);
    uploadData.append("memberself_dob", this.formCustomerDetails.value.memberself_dob);
    uploadData.append("memberself_marital", this.formCustomerDetails.value.memberself_marital);    
    uploadData.append("memberself_smoke_qty",this.formCustomerDetails.value.memberself_smoke_qty); 
    uploadData.append("memberself_liquor_qty",this.formCustomerDetails.value.memberself_liquor_qty);   
    uploadData.append("memberself_wine_qty",this.formCustomerDetails.value.memberself_wine_qty); 
    uploadData.append("memberself_beer_qty",this.formCustomerDetails.value.memberself_beer_qty);   
    uploadData.append("memberself_gutka_qty",this.formCustomerDetails.value.memberself_gutka_qty);
    uploadData.append("memberspouse_salutation", this.formCustomerDetails.value.memberspouse_salutation);
    uploadData.append("memberspouse_firstname", this.formCustomerDetails.value.memberspouse_firstname);
    uploadData.append("memberspouse_middlename", this.formCustomerDetails.value.memberspouse_middlename);
    uploadData.append("memberspouse_lastname", this.formCustomerDetails.value.memberspouse_lastname);
    uploadData.append("memberspouse_relationship", this.formCustomerDetails.value.memberspouse_relationship);
    uploadData.append("memberspouse_dob", this.formCustomerDetails.value.memberspouse_dob);
    uploadData.append("memberspouse_marital", this.formCustomerDetails.value.memberspouse_marital);
    uploadData.append("memberspouse_smoke_qty",this.formCustomerDetails.value.memberspouse_smoke_qty); 
    uploadData.append("memberspouse_liquor_qty",this.formCustomerDetails.value.memberspouse_liquor_qty);   
    uploadData.append("memberspouse_wine_qty",this.formCustomerDetails.value.memberspouse_wine_qty); 
    uploadData.append("memberspouse_beer_qty",this.formCustomerDetails.value.memberspouse_beer_qty);   
    uploadData.append("memberspouse_gutka_qty",this.formCustomerDetails.value.memberspouse_gutka_qty);
    uploadData.append("membermother_salutation", this.formCustomerDetails.value.membermother_salutation);
    uploadData.append("membermother_firstname", this.formCustomerDetails.value.membermother_firstname);
    uploadData.append("membermother_middlename", this.formCustomerDetails.value.membermother_middlename);
    uploadData.append("membermother_lastname", this.formCustomerDetails.value.membermother_lastname);
    uploadData.append("membermother_relationship", this.formCustomerDetails.value.membermother_relationship);
    uploadData.append("membermother_dob", this.formCustomerDetails.value.membermother_dob);
    uploadData.append("membermother_marital", this.formCustomerDetails.value.membermother_marital);
    uploadData.append("membermother_smoke_qty",this.formCustomerDetails.value.membermother_smoke_qty); 
    uploadData.append("membermother_liquor_qty",this.formCustomerDetails.value.membermother_liquor_qty);   
    uploadData.append("membermother_wine_qty",this.formCustomerDetails.value.membermother_wine_qty); 
    uploadData.append("membermother_beer_qty",this.formCustomerDetails.value.membermother_beer_qty);   
    uploadData.append("membermother_gutka_qty",this.formCustomerDetails.value.membermother_gutka_qty);
    uploadData.append("memberfather_salutation", this.formCustomerDetails.value.memberfather_salutation);
    uploadData.append("memberfather_firstname", this.formCustomerDetails.value.memberfather_firstname);
    uploadData.append("memberfather_middlename", this.formCustomerDetails.value.memberfather_middlename);
    uploadData.append("memberfather_lastname", this.formCustomerDetails.value.memberfather_lastname);
    uploadData.append("memberfather_relationship", this.formCustomerDetails.value.memberfather_relationship);
    uploadData.append("memberfather_dob", this.formCustomerDetails.value.memberfather_dob);
    uploadData.append("memberfather_marital", this.formCustomerDetails.value.memberfather_marital);
    uploadData.append("memberfather_smoke_qty",this.formCustomerDetails.value.memberfather_smoke_qty); 
    uploadData.append("memberfather_liquor_qty",this.formCustomerDetails.value.memberfather_liquor_qty);   
    uploadData.append("memberfather_wine_qty",this.formCustomerDetails.value.memberfather_wine_qty); 
    uploadData.append("memberfather_beer_qty",this.formCustomerDetails.value.memberfather_beer_qty);   
    uploadData.append("memberfather_gutka_qty",this.formCustomerDetails.value.memberfather_gutka_qty);
    uploadData.append("memberson1_salutation", this.formCustomerDetails.value.memberson1_salutation);
    uploadData.append("memberson1_firstname", this.formCustomerDetails.value.memberson1_firstname);
    uploadData.append("memberson1_middlename", this.formCustomerDetails.value.memberson1_middlename);
    uploadData.append("memberson1_lastname", this.formCustomerDetails.value.memberson1_lastname);
    uploadData.append("memberson1_relationship", this.formCustomerDetails.value.memberson1_relationship);
    uploadData.append("memberson1_dob", this.formCustomerDetails.value.memberson1_dob);
    uploadData.append("memberson1_marital", this.formCustomerDetails.value.memberson1_marital);
    uploadData.append("memberson1_smoke_qty",this.formCustomerDetails.value.memberson1_smoke_qty); 
    uploadData.append("memberson1_liquor_qty",this.formCustomerDetails.value.memberson1_liquor_qty);   
    uploadData.append("memberson1_wine_qty",this.formCustomerDetails.value.memberson1_wine_qty); 
    uploadData.append("memberson1_beer_qty",this.formCustomerDetails.value.memberson1_beer_qty);   
    uploadData.append("memberson1_gutka_qty",this.formCustomerDetails.value.memberson1_gutka_qty);
    uploadData.append("memberson2_salutation", this.formCustomerDetails.value.memberson2_salutation);
    uploadData.append("memberson2_firstname", this.formCustomerDetails.value.memberson2_firstname);
    uploadData.append("memberson2_middlename", this.formCustomerDetails.value.memberson2_middlename);
    uploadData.append("memberson2_lastname", this.formCustomerDetails.value.memberson2_lastname);
    uploadData.append("memberson2_relationship", this.formCustomerDetails.value.memberson2_relationship);
    uploadData.append("memberson2_dob", this.formCustomerDetails.value.memberson2_dob);
    uploadData.append("memberson2_marital", this.formCustomerDetails.value.memberson2_marital);
    uploadData.append("memberson2_smoke_qty",this.formCustomerDetails.value.memberson2_smoke_qty); 
    uploadData.append("memberson2_liquor_qty",this.formCustomerDetails.value.memberson2_liquor_qty);   
    uploadData.append("memberson2_wine_qty",this.formCustomerDetails.value.memberson2_wine_qty); 
    uploadData.append("memberson2_beer_qty",this.formCustomerDetails.value.memberson2_beer_qty);   
    uploadData.append("memberson2_gutka_qty",this.formCustomerDetails.value.memberson2_gutka_qty);
    uploadData.append("memberson3_salutation", this.formCustomerDetails.value.memberson3_salutation);
    uploadData.append("memberson3_firstname", this.formCustomerDetails.value.memberson3_firstname);
    uploadData.append("memberson3_middlename", this.formCustomerDetails.value.memberson3_middlename);
    uploadData.append("memberson3_lastname", this.formCustomerDetails.value.memberson3_lastname);
    uploadData.append("memberson3_relationship", this.formCustomerDetails.value.memberson3_relationship);
    uploadData.append("memberson3_dob", this.formCustomerDetails.value.memberson3_dob);
    uploadData.append("memberson3_marital", this.formCustomerDetails.value.memberson3_marital);
    uploadData.append("memberson3_smoke_qty",this.formCustomerDetails.value.memberson3_smoke_qty); 
    uploadData.append("memberson3_liquor_qty",this.formCustomerDetails.value.memberson3_liquor_qty);   
    uploadData.append("memberson3_wine_qty",this.formCustomerDetails.value.memberson3_wine_qty); 
    uploadData.append("memberson3_beer_qty",this.formCustomerDetails.value.memberson3_beer_qty);   
    uploadData.append("memberson3_gutka_qty",this.formCustomerDetails.value.memberson3_gutka_qty);
    uploadData.append("memberson4_salutation", this.formCustomerDetails.value.memberson4_salutation);
    uploadData.append("memberson4_firstname", this.formCustomerDetails.value.memberson4_firstname);
    uploadData.append("memberson4_middlename", this.formCustomerDetails.value.memberson4_middlename);
    uploadData.append("memberson4_lastname", this.formCustomerDetails.value.memberson4_lastname);
    uploadData.append("memberson4_relationship", this.formCustomerDetails.value.memberson4_relationship);
    uploadData.append("memberson4_dob", this.formCustomerDetails.value.memberson4_dob);
    uploadData.append("memberson4_marital", this.formCustomerDetails.value.memberson4_marital);
    uploadData.append("memberson4_smoke_qty",this.formCustomerDetails.value.memberson4_smoke_qty); 
    uploadData.append("memberson4_liquor_qty",this.formCustomerDetails.value.memberson4_liquor_qty);   
    uploadData.append("memberson4_wine_qty",this.formCustomerDetails.value.memberson4_wine_qty); 
    uploadData.append("memberson4_beer_qty",this.formCustomerDetails.value.memberson4_beer_qty);   
    uploadData.append("memberson4_gutka_qty",this.formCustomerDetails.value.memberson4_gutka_qty);
    uploadData.append("memberdaughter1_salutation", this.formCustomerDetails.value.memberdaughter1_salutation);
    uploadData.append("memberdaughter1_firstname", this.formCustomerDetails.value.memberdaughter1_firstname);
    uploadData.append("memberdaughter1_middlename", this.formCustomerDetails.value.memberdaughter1_middlename);
    uploadData.append("memberdaughter1_lastname", this.formCustomerDetails.value.memberdaughter1_lastname);
    uploadData.append("memberdaughter1_relationship", this.formCustomerDetails.value.memberdaughter1_relationship);
    uploadData.append("memberdaughter1_dob", this.formCustomerDetails.value.memberdaughter1_dob);
    uploadData.append("memberdaughter1_marital", this.formCustomerDetails.value.memberdaughter1_marital);
    uploadData.append("memberdaughter1_smoke_qty",this.formCustomerDetails.value.memberdaughter1_smoke_qty); 
    uploadData.append("memberdaughter1_liquor_qty",this.formCustomerDetails.value.memberdaughter1_liquor_qty);   
    uploadData.append("memberdaughter1_wine_qty",this.formCustomerDetails.value.memberdaughter1_wine_qty); 
    uploadData.append("memberdaughter1_beer_qty",this.formCustomerDetails.value.memberdaughter1_beer_qty);   
    uploadData.append("memberdaughter1_gutka_qty",this.formCustomerDetails.value.memberdaughter1_gutka_qty);
    uploadData.append("memberdaughter2_salutation", this.formCustomerDetails.value.memberdaughter2_salutation);
    uploadData.append("memberdaughter2_firstname", this.formCustomerDetails.value.memberdaughter2_firstname);
    uploadData.append("memberdaughter2_middlename", this.formCustomerDetails.value.memberdaughter2_middlename);
    uploadData.append("memberdaughter2_lastname", this.formCustomerDetails.value.memberdaughter2_lastname);
    uploadData.append("memberdaughter2_relationship", this.formCustomerDetails.value.memberdaughter2_relationship);
    uploadData.append("memberdaughter2_dob", this.formCustomerDetails.value.memberdaughter2_dob);
    uploadData.append("memberdaughter2_marital", this.formCustomerDetails.value.memberdaughter2_marital);
    uploadData.append("memberdaughter2_smoke_qty",this.formCustomerDetails.value.memberdaughter2_smoke_qty); 
    uploadData.append("memberdaughter2_liquor_qty",this.formCustomerDetails.value.memberdaughter2_liquor_qty);   
    uploadData.append("memberdaughter2_wine_qty",this.formCustomerDetails.value.memberdaughter2_wine_qty); 
    uploadData.append("memberdaughter2_beer_qty",this.formCustomerDetails.value.memberdaughter2_beer_qty);   
    uploadData.append("memberdaughter2_gutka_qty",this.formCustomerDetails.value.memberdaughter2_gutka_qty);
    uploadData.append("memberdaughter3_salutation", this.formCustomerDetails.value.memberdaughter3_salutation);
    uploadData.append("memberdaughter3_firstname", this.formCustomerDetails.value.memberdaughter3_firstname);
    uploadData.append("memberdaughter3_middlename", this.formCustomerDetails.value.memberdaughter3_middlename);
    uploadData.append("memberdaughter3_lastname", this.formCustomerDetails.value.memberdaughter3_lastname);
    uploadData.append("memberdaughter3_relationship", this.formCustomerDetails.value.memberdaughter3_relationship);
    uploadData.append("memberdaughter3_dob", this.formCustomerDetails.value.memberdaughter3_dob);
    uploadData.append("memberdaughter3_marital", this.formCustomerDetails.value.memberdaughter3_marital);
    uploadData.append("memberdaughter3_smoke_qty",this.formCustomerDetails.value.memberdaughter3_smoke_qty); 
    uploadData.append("memberdaughter3_liquor_qty",this.formCustomerDetails.value.memberdaughter3_liquor_qty);   
    uploadData.append("memberdaughter3_wine_qty",this.formCustomerDetails.value.memberdaughter3_wine_qty); 
    uploadData.append("memberdaughter3_beer_qty",this.formCustomerDetails.value.memberdaughter3_beer_qty);   
    uploadData.append("memberdaughter3_gutka_qty",this.formCustomerDetails.value.memberdaughter3_gutka_qty);
    uploadData.append("memberdaughter4_salutation", this.formCustomerDetails.value.memberdaughter4_salutation);
    uploadData.append("memberdaughter4_firstname", this.formCustomerDetails.value.memberdaughter4_firstname);
    uploadData.append("memberdaughter4_middlename", this.formCustomerDetails.value.memberdaughter4_middlename);
    uploadData.append("memberdaughter4_lastname", this.formCustomerDetails.value.memberdaughter4_lastname);
    uploadData.append("memberdaughter4_relationship", this.formCustomerDetails.value.memberdaughter4_relationship);
    uploadData.append("memberdaughter4_dob", this.formCustomerDetails.value.memberdaughter4_dob);
    uploadData.append("memberdaughter4_marital", this.formCustomerDetails.value.memberdaughter4_marital);
    uploadData.append("memberdaughter4_smoke_qty",this.formCustomerDetails.value.memberdaughter4_smoke_qty); 
    uploadData.append("memberdaughter4_liquor_qty",this.formCustomerDetails.value.memberdaughter4_liquor_qty);   
    uploadData.append("memberdaughter4_wine_qty",this.formCustomerDetails.value.memberdaughter4_wine_qty); 
    uploadData.append("memberdaughter4_beer_qty",this.formCustomerDetails.value.memberdaughter4_beer_qty);   
    uploadData.append("memberdaughter4_gutka_qty",this.formCustomerDetails.value.memberdaughter4_gutka_qty);
    uploadData.append("nominee_salutation", this.formCustomerDetails.value.nominee_salutation);
    uploadData.append("nominee_firstname", this.formCustomerDetails.value.nominee_firstname);
    uploadData.append("nominee_middlename", this.formCustomerDetails.value.nominee_middlename);
    uploadData.append("nominee_lastname", this.formCustomerDetails.value.nominee_lastname);
    uploadData.append("nominee_relationship", this.formCustomerDetails.value.nominee_relationship);
    uploadData.append("nominee_dob", this.formCustomerDetails.value.nominee_dob);
    uploadData.append("nominee_marital", this.formCustomerDetails.value.nominee_marital);
    uploadData.append("appointee_salutation", this.formCustomerDetails.value.appointee_salutation);
    uploadData.append("appointee_firstname", this.formCustomerDetails.value.appointee_firstname);
    uploadData.append("appointee_middlename", this.formCustomerDetails.value.appointee_middlename);
    uploadData.append("appointee_lastname", this.formCustomerDetails.value.appointee_lastname);
    uploadData.append("appointee_relationship", this.formCustomerDetails.value.appointee_relationship);
    uploadData.append("appointee_dob", this.formCustomerDetails.value.appointee_dob);
    uploadData.append("appointee_marital", this.formCustomerDetails.value.appointee_marital);
    uploadData.append("consume_oth_subs",this.formCustomerDetails.value.consume_oth_subs);   
    uploadData.append("oth_ins_pol",this.formCustomerDetails.value.oth_ins_pol);   
    uploadData.append("claim_ins_bef",this.formCustomerDetails.value.claim_ins_bef); 
    
     

    return uploadData;
  }

  public findInvalidControls() {
    const invalid = [];
    const form_value = [];
    const controls = this.formCustomerDetails.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        form_value.push(controls[name].invalid);
        invalid.push(name);
      }
    }
    console.log("invalid fields start .....");
    console.log(invalid);
    console.log("invalid fields end.....");
  }

  submitFormCustomerData()
  {
    this.submittedQuoteDetails = true;
    //$input = request->all();
    //console.log(input+'test jaya');
    //foreach ($request->all() as $q) {}
    
    
    if (this.formCustomerDetails.invalid) {
      this.findInvalidControls();
      Swal.fire("Please fill all mandatory fields", "", "error");
      return;
    }     
      

    var uploadData: any = this.setParameterForSubmitForm();
    this.healthService.submitHealthquoteCustomerFormData(uploadData)
      .subscribe((response) => {
        var outputResult: any = response;
        this.loaderActive = false;
        if (outputResult.status) {
          this.router.navigate(['health-insurance-quote/confirm-details']);  
        } else {
          alert("error");
        }
      });
  }

  showClaimDiv(e){  
    if(e=='Yes'){
      this.div_show_for_claim_policy = false;
    }
    else if(e=='No'){
      this.div_show_for_claim_policy = true;      
    }    
  }
  claimInsBef(e){
    if(e=='Yes'){
      Swal.fire("Can't processed online", "", "error");
      this.claim_ins_div = false;      
    }
    else if(e=='No'){
      this.claim_ins_div = true;
    }
  }
     public name:any;
     public str:any;
   
     changeLabelName() {
       var buyerChecked : any =   this.formCustomerDetails.value.buyer_insured;
       if(buyerChecked==false || buyerChecked==""){
         var buyer_salutation  = this.formCustomerDetails.value.buyer_salutation;
         var buyer_first_name  = this.formCustomerDetails.value.buyer_first_name;
         var buyer_middle_name = this.formCustomerDetails.value.buyer_middle_name;
         var buyer_last_name   = this.formCustomerDetails.value.buyer_last_name;
         var buyer_occupation  = this.formCustomerDetails.value.buyer_occupation;
         var buyer_dob         = this.formCustomerDetails.value.buyer_dob;
         var buyer_marital     = this.formCustomerDetails.value.buyer_marital;
   
   
             // buyer_gender:result.result.user_data.customer_action_data[0].buyer_gender,
             // buyer_occupation:result.result.user_data.customer_action_data[0].buyer_occupation,
             // self_buyer_occupation:result.result.user_data.customer_action_data[0].self_buyer_occupation,
   
       this.formCustomerDetails.patchValue({
         memberself_salutation:buyer_salutation,
         memberself_firstname:buyer_first_name,
         memberself_middlename:buyer_middle_name,
         memberself_lastname:buyer_last_name,
         memberself_occupation:buyer_occupation,
         memberself_marital:buyer_marital,
         memberself_dob:buyer_dob,     
         self_buyer_occupation:buyer_occupation,     
         //memberself_occupation: 
       })
       // this.formCustomerDetails.get("memberself_salutation").setValue(buyer_salutation);
     }
    
   
     }
  loadScripts() {
    const externalScriptArray = [this.mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }




}

