import { Component, OnInit, Renderer2 } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CustomvalidationService } from "../../services/customvalidation.service";
import { HealthService } from "..//services/health.service";
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
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.css']
})
export class ConfirmDetailsComponent implements OnInit {
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;  
  formCustomerDetails: FormGroup;
  submittedQuoteDetails: boolean = false;

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
  quote_data_health_id:any;
  quote_unique_reference_no:any;
  quote_id:any;
  policyicid:any;
  OccupationList:any;
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
  memberDetails:any;
  buyer_email_id:any;
  buyer_mobile:any;
  buyer_salutation:any;
  buyer_first_name:any;
  buyer_middle_name:any;
  buyer_last_name:any;
  buyer_gender:any;
  buyer_occupation:any;
  buyer_pincode:any;
  buyer_address1:any;
  buyer_address2:any;
  buyer_address3:any;
  buyer_nationality:any;
  buyer_marital:any;
  buyer_pan:any;
  buyer_adhar:any;
  buyer_insured:any;          
  memberself_salutation:any;
  memberself_firstname:any;
  memberself_middlename:any;
  memberself_lastname:any;
  memberself_relationship:any;
  memberself_dob:any;
  memberself_marital:any;
  memberspouse_salutation:any;
  memberspouse_firstname:any;
  memberspouse_middlename:any;
  memberspouse_lastname:any;
  memberspouse_relationship:any;
  memberspouse_dob:any;
  memberspouse_marital:any;
  memberfather_salutation:any;
  memberfather_firstname:any;
  memberfather_middlename:any;
  memberfather_lastname:any;
  memberfather_relationship:any;
  memberfather_dob:any;
  memberfather_marital:any;
  membermother_salutation:any;
  membermother_firstname:any;
  membermother_middlename:any;
  membermother_lastname:any;
  membermother_relationship:any;
  membermother_dob:any;
  membermother_marital:any;
  memberson1_salutation:any;
  memberson1_firstname:any;
  memberson1_middlename:any;
  memberson1_lastname:any;
  memberson1_relationship:any;
  memberson1_dob:any;
  memberson1_marital:any;
  memberson2_salutation:any;
  memberson2_firstname:any;
  memberson2_middlename:any;
  memberson2_lastname:any;
  memberson2_relationship:any;
  memberson2_dob:any;
  memberson2_marital:any;
  memberson3_salutation:any;
  memberson3_firstname:any;
  memberson3_middlename:any;
  memberson3_lastname:any;
  memberson3_relationship:any;
  memberson3_dob:any;
  memberson3_marital:any;
  memberson4_salutation:any;
  memberson4_firstname:any;
  memberson4_middlename:any;
  memberson4_lastname:any;
  memberson4_relationship:any;
  memberson4_dob:any;
  memberson4_marital:any;
  memberdaughter1_salutation:any;
  memberdaughter1_firstname:any;
  memberdaughter1_middlename:any;
  memberdaughter1_lastname:any;
  memberdaughter1_relationship:any;
  memberdaughter1_dob:any;
  memberdaughter1_marital:any;
  memberdaughter2_salutation:any;
  memberdaughter2_firstname:any;
  memberdaughter2_middlename:any;
  memberdaughter2_lastname:any;
  memberdaughter2_relationship:any;
  memberdaughter2_dob:any;
  memberdaughter2_marital:any;
  memberdaughter3_salutation:any;
  memberdaughter3_firstname:any;
  memberdaughter3_middlename:any;
  memberdaughter3_lastname:any;
  memberdaughter3_relationship:any;
  memberdaughter3_dob:any;
  memberdaughter3_marital:any;
  memberdaughter4_salutation:any;
  memberdaughter4_firstname:any;
  memberdaughter4_middlename:any;
  memberdaughter4_lastname:any;
  memberdaughter4_relationship:any;
  memberdaughter4_dob:any;
  memberdaughter4_marital:any;
  nominee_salutation:any;
  nominee_firstname:any;
  nominee_middlename:any;
  nominee_lastname:any;
  nominee_relationship:any;
  nominee_dob:any;
  nominee_marital:any;
  appointee_div:any;
  appointee_salutation:any;
  appointee_firstname:any;
  appointee_middlename:any;
  appointee_lastname:any;
  appointee_relationship:any;
  appointee_dob:any;
  appointee_marital:any;  
  formcovrageform : any;
  submittedCovrageQuote : boolean = false;
  displayCovrageQuote : any = 'none';  
  mem_dob: any;
  membersdisease: any;
  membersdisease_smoke: any;
  membersdisease_tobaco: any;
  pincode: any;
  selected_suminsured: any;
  tenure: any;
  error_message:any;
  is_error:any;
  is_ic_multiple_appointee:any;
  is_ic_multiple_nominee:any;
  buy_policy_id:any;
  buy_policy_unique_id:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("user_id");
    this.selectedproducttypeid = sessionStorage.getItem(
      "selected_product_type_id"
    );
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.buy_policy_id = sessionStorage.getItem("buy_policy_id");
    this.buy_policy_unique_id = sessionStorage.getItem("unique_reference_no");
    this.validationformCustomerDetails();
    this.getIndex();
    //this.getOccupationList();
  }

  getIndex() {
   
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("quote_data_health_id", this.buy_policy_id);
    sendData.append("unique_reference_no", this.buy_policy_unique_id);
    this.healthService.getCustomerDetails(sendData).subscribe((res) => {
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
      this.policyicid = result.result.policy_list[0].ic_id;
      this.userQuotedetails = result.result.user_data.user_action_data;
      this.customerDetails = result.result.user_data.customer_action_data;
      this.memberDetails = result.result.user_data.customer_action_data[0].member_details;
      this.quote_data_health_id = result.result.policy_list[0].quote_id;
      this.quote_unique_reference_no = result.result.policy_list[0].quote_unique_reference_no;
      this.buyer_email_id=result.result.user_data.customer_action_data[0].buyer_email_id;
      this.buyer_mobile=result.result.user_data.customer_action_data[0].buyer_mobile;
      this.buyer_salutation=result.result.user_data.customer_action_data[0].buyer_salutation;
      this.buyer_first_name=result.result.user_data.customer_action_data[0].buyer_first_name;
      this.buyer_middle_name=result.result.user_data.customer_action_data[0].buyer_middle_name;
      this.buyer_last_name=result.result.user_data.customer_action_data[0].buyer_last_name;
      this.buyer_gender=result.result.user_data.customer_action_data[0].buyer_gender;
      this.buyer_occupation=result.result.user_data.customer_action_data[0].buyer_occupation;
      this.buyer_pincode=result.result.user_data.customer_action_data[0].buyer_pincode;
      this.buyer_address1=result.result.user_data.customer_action_data[0].buyer_address1;
      this.buyer_address2=result.result.user_data.customer_action_data[0].buyer_address2;
      this.buyer_address3=result.result.user_data.customer_action_data[0].buyer_address3;
      this.buyer_nationality=result.result.user_data.customer_action_data[0].buyer_nationality;
      this.buyer_marital=result.result.user_data.customer_action_data[0].buyer_marital;
      this.buyer_pan=result.result.user_data.customer_action_data[0].buyer_pan;
      this.buyer_adhar=result.result.user_data.customer_action_data[0].buyer_adhar;
      this.buyer_insured=result.result.user_data.customer_action_data[0].buyer_insured;          
      this.memberself_salutation=result.result.user_data.customer_action_data[0].memberself_salutation;
      this.memberself_firstname=result.result.user_data.customer_action_data[0].memberself_firstname;
      this.memberself_middlename=result.result.user_data.customer_action_data[0].memberself_middlename;
      this.memberself_lastname=result.result.user_data.customer_action_data[0].memberself_lastname;
      this.memberself_relationship=result.result.user_data.customer_action_data[0].memberself_relationship;
      this.memberself_dob=result.result.user_data.customer_action_data[0].memberself_dob;
      this.memberself_marital=result.result.user_data.customer_action_data[0].memberself_marital;
      this.memberspouse_salutation=result.result.user_data.customer_action_data[0].memberspouse_salutation;
      this.memberspouse_firstname=result.result.user_data.customer_action_data[0].memberspouse_firstname;
      this.memberspouse_middlename=result.result.user_data.customer_action_data[0].memberspouse_middlename;
      this.memberspouse_lastname=result.result.user_data.customer_action_data[0].memberspouse_lastname;
      this.memberspouse_relationship=result.result.user_data.customer_action_data[0].memberspouse_relationship;
      this.memberspouse_dob=result.result.user_data.customer_action_data[0].memberspouse_dob;
      this.memberspouse_marital=result.result.user_data.customer_action_data[0].memberspouse_marital;
      this.memberfather_salutation=result.result.user_data.customer_action_data[0].memberfather_salutation;
      this.memberfather_firstname=result.result.user_data.customer_action_data[0].memberfather_firstname;
      this.memberfather_middlename=result.result.user_data.customer_action_data[0].memberfather_middlename;
      this.memberfather_lastname=result.result.user_data.customer_action_data[0].memberfather_lastname;
      this.memberfather_relationship=result.result.user_data.customer_action_data[0].memberfather_relationship;
      this.memberfather_dob=result.result.user_data.customer_action_data[0].memberfather_dob;
      this.memberfather_marital=result.result.user_data.customer_action_data[0].memberfather_marital;
      this.membermother_salutation=result.result.user_data.customer_action_data[0].membermother_salutation;
      this.membermother_firstname=result.result.user_data.customer_action_data[0].membermother_firstname;
      this.membermother_middlename=result.result.user_data.customer_action_data[0].membermother_middlename;
      this.membermother_lastname=result.result.user_data.customer_action_data[0].membermother_lastname;
      this.membermother_relationship=result.result.user_data.customer_action_data[0].membermother_relationship;
      this.membermother_dob=result.result.user_data.customer_action_data[0].membermother_dob;
      this.membermother_marital=result.result.user_data.customer_action_data[0].membermother_marital;
      this.memberson1_salutation=result.result.user_data.customer_action_data[0].memberson1_salutation;
      this.memberson1_firstname=result.result.user_data.customer_action_data[0].memberson1_firstname;
      this.memberson1_middlename=result.result.user_data.customer_action_data[0].memberson1_middlename;
      this.memberson1_lastname=result.result.user_data.customer_action_data[0].memberson1_lastname;
      this.memberson1_relationship=result.result.user_data.customer_action_data[0].memberson1_relationship;
      this.memberson1_dob=result.result.user_data.customer_action_data[0].memberson1_dob;
      this.memberson1_marital=result.result.user_data.customer_action_data[0].memberson1_marital;
      this.memberson2_salutation=result.result.user_data.customer_action_data[0].memberson2_salutation;
      this.memberson2_firstname=result.result.user_data.customer_action_data[0].memberson2_firstname;
      this.memberson2_middlename=result.result.user_data.customer_action_data[0].memberson2_middlename;
      this.memberson2_lastname=result.result.user_data.customer_action_data[0].memberson2_lastname;
      this.memberson2_relationship=result.result.user_data.customer_action_data[0].memberson2_relationship;
      this.memberson2_dob=result.result.user_data.customer_action_data[0].memberson2_dob;
      this.memberson2_marital=result.result.user_data.customer_action_data[0].memberson2_marital;
      this.memberson3_salutation=result.result.user_data.customer_action_data[0].memberson3_salutation;
      this.memberson3_firstname=result.result.user_data.customer_action_data[0].memberson3_firstname;
      this.memberson3_middlename=result.result.user_data.customer_action_data[0].memberson3_middlename;
      this.memberson3_lastname=result.result.user_data.customer_action_data[0].memberson3_lastname;
      this.memberson3_relationship=result.result.user_data.customer_action_data[0].memberson3_relationship;
      this.memberson3_dob=result.result.user_data.customer_action_data[0].memberson3_dob;
      this.memberson3_marital=result.result.user_data.customer_action_data[0].memberson3_marital;
      this.memberson4_salutation=result.result.user_data.customer_action_data[0].memberson4_salutation;
      this.memberson4_firstname=result.result.user_data.customer_action_data[0].memberson4_firstname;
      this.memberson4_middlename=result.result.user_data.customer_action_data[0].memberson4_middlename;
      this.memberson4_lastname=result.result.user_data.customer_action_data[0].memberson4_lastname;
      this.memberson4_relationship=result.result.user_data.customer_action_data[0].memberson4_relationship;
      this.memberson4_dob=result.result.user_data.customer_action_data[0].memberson4_dob;
      this.memberson4_marital=result.result.user_data.customer_action_data[0].memberson4_marital;
      this.memberdaughter1_salutation=result.result.user_data.customer_action_data[0].memberdaughter1_salutation;
      this.memberdaughter1_firstname=result.result.user_data.customer_action_data[0].memberdaughter1_firstname;
      this.memberdaughter1_middlename=result.result.user_data.customer_action_data[0].memberdaughter1_middlename;
      this.memberdaughter1_lastname=result.result.user_data.customer_action_data[0].memberdaughter1_lastname;
      this.memberdaughter1_relationship=result.result.user_data.customer_action_data[0].memberdaughter1_relationship;
      this.memberdaughter1_dob=result.result.user_data.customer_action_data[0].memberdaughter1_dob;
      this.memberdaughter1_marital=result.result.user_data.customer_action_data[0].memberdaughter1_marital;
      this.memberdaughter2_salutation=result.result.user_data.customer_action_data[0].memberdaughter2_salutation;
      this.memberdaughter2_firstname=result.result.user_data.customer_action_data[0].memberdaughter2_firstname;
      this.memberdaughter2_middlename=result.result.user_data.customer_action_data[0].memberdaughter2_middlename;
      this.memberdaughter2_lastname=result.result.user_data.customer_action_data[0].memberdaughter2_lastname;
      this.memberdaughter2_relationship=result.result.user_data.customer_action_data[0].memberdaughter2_relationship;
      this.memberdaughter2_dob=result.result.user_data.customer_action_data[0].memberdaughter2_dob;
      this.memberdaughter2_marital=result.result.user_data.customer_action_data[0].memberdaughter2_marital;
      this.memberdaughter3_salutation=result.result.user_data.customer_action_data[0].memberdaughter3_salutation;
      this.memberdaughter3_firstname=result.result.user_data.customer_action_data[0].memberdaughter3_firstname;
      this.memberdaughter3_middlename=result.result.user_data.customer_action_data[0].memberdaughter3_middlename;
      this.memberdaughter3_lastname=result.result.user_data.customer_action_data[0].memberdaughter3_lastname;
      this.memberdaughter3_relationship=result.result.user_data.customer_action_data[0].memberdaughter3_relationship;
      this.memberdaughter3_dob=result.result.user_data.customer_action_data[0].memberdaughter3_dob;
      this.memberdaughter3_marital=result.result.user_data.customer_action_data[0].memberdaughter3_marital;
      this.memberdaughter4_salutation=result.result.user_data.customer_action_data[0].memberdaughter4_salutation;
      this.memberdaughter4_firstname=result.result.user_data.customer_action_data[0].memberdaughter4_firstname;
      this.memberdaughter4_middlename=result.result.user_data.customer_action_data[0].memberdaughter4_middlename;
      this.memberdaughter4_lastname=result.result.user_data.customer_action_data[0].memberdaughter4_lastname;
      this.memberdaughter4_relationship=result.result.user_data.customer_action_data[0].memberdaughter4_relationship;
      this.memberdaughter4_dob=result.result.user_data.customer_action_data[0].memberdaughter4_dob;
      this.memberdaughter4_marital=result.result.user_data.customer_action_data[0].memberdaughter4_marital;
      this.nominee_salutation=result.result.user_data.customer_action_data[0].nominee_salutation;
      this.nominee_firstname=result.result.user_data.customer_action_data[0].nomineefirstname;
      this.nominee_middlename=result.result.user_data.customer_action_data[0].nominee_middlename;
      this.nominee_lastname=result.result.user_data.customer_action_data[0].nominee_lastname;
      this.getRelation(this.policyicid,result.result.user_data.customer_action_data[0].nominee_relationship);
      this.nominee_dob=result.result.user_data.customer_action_data[0].nominee_dob;
      this.nominee_marital=result.result.user_data.customer_action_data[0].nominee_marital;
      
      if(result.result.user_data.customer_action_data[0].appointee_firstname !== '' && result.result.user_data.customer_action_data[0].appointee_firstname !== undefined)
      { 
        this.appointee_div = true;
        this.appointee_salutation=result.result.user_data.customer_action_data[0].appointee_salutation;
        this.appointee_firstname=result.result.user_data.customer_action_data[0].appointee_firstname;
        this.appointee_middlename=result.result.user_data.customer_action_data[0].appointee_middlename;
        this.appointee_lastname=result.result.user_data.customer_action_data[0].appointee_lastname;
        this.appointee_relationship=result.result.user_data.customer_action_data[0].appointee_relationship;
        this.appointee_dob=result.result.user_data.customer_action_data[0].appointee_dob;
        this.appointee_marital=result.result.user_data.customer_action_data[0].appointee_marital;
      }
      else 
      {
        this.appointee_div = false;
      }
      //this.getOccupationList();
      this.getHealthPincodeData();
      
    });
    
  }

  // getOccupationList()
  // {
  //       this.loaderActive = true;
  //       var sendData = new FormData();
  //       sendData.append("ic_id", this.policyicid);
  //       this.healthService.getHealthOccupationListData(sendData).subscribe((res) => {
  //       this.loaderActive = false;  
  //       var result: any = res;
  //       this.OccupationList = result.occupation_list;
       
  //     });
  // }

  getHealthPincodeData()
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("pincode", this.pincode);
        sendData.append("quote_data_health_id", this.buy_policy_id);
        this.healthService.getHealthPincodeData(sendData).subscribe((res) => {
        this.loaderActive = false;
        var result: any = res;
        //console.log(result);
        this.pin_code  = this.pincode
        this.stateName = result.result.STATE_CD;
        this.statecode = result.result.STATE_NAME;
        this.cityname  = result.result.DISTRICT_CD;
        this.citycode  = result.result.CITY_CODE;
        this.distname  = result.result.DISTRICT_CD;
        this.distcode  = result.result.DISTRICT_CODE;
        
      });
  }

  getRelation(ic_id, relation_id)
  {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("relation_id", relation_id);
    sendData.append("ic_id", ic_id);
      this.healthService.getHealthRelationListData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      console.log(result);
      this.nominee_relationship = result.request.name;
      
    });
  }


  validationformCustomerDetails() {
    this.formCustomerDetails = this.formBuilder.group({
      buyer_email_id:["", [Validators.required,Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")]],
      buyer_mobile: ["", [Validators.required]],
      buyer_salutation: ["", [Validators.required]],
      buyer_first_name: ["", [Validators.required]],
      buyer_middle_name: ["", [Validators.required]],
      buyer_last_name: ["", [Validators.required]],
      buyer_gender: ["", [Validators.required]],
      buyer_occupation: ["", [Validators.required]],
      buyer_address1: ["", [Validators.required]],
      buyer_address2: ["", [Validators.required]],
      buyer_address3: [""],
      buyer_nationality: [""],
      buyer_marital: ["", [Validators.required]],
      buyer_pan: ["", [Validators.required]],
      buyer_adhar: ["", [Validators.required]],
      buyer_insured: [""],
      memberself_salutation: [""],
      memberself_firstname: [""],
      memberself_middlename: [""],
      memberself_lastname: [""],
      memberself_relationship: [""],
      memberself_dob: [""],
      memberself_marital: [""],
      memberspouse_salutation: [""],
      memberspouse_firstname: [""],
      memberspouse_middlename: [""],
      memberspouse_lastname: [""],
      memberspouse_relationship: [""],
      memberspouse_dob: [""],
      memberspouse_marital: [""],
      memberfather_salutation: [""],
      memberfather_firstname: [""],
      memberfather_middlename: [""],
      memberfather_lastname: [""],
      memberfather_relationship: [""],
      memberfather_dob: [""],
      memberfather_marital: [""],
      membermother_salutation: [""],
      membermother_firstname: [""],
      membermother_middlename: [""],
      membermother_lastname: [""],
      membermother_relationship: [""],
      membermother_dob: [""],
      membermother_marital: [""],
      memberson1_salutation: [""],
      memberson1_firstname: [""],
      memberson1_middlename: [""],
      memberson1_lastname: [""],
      memberson1_relationship: [""],
      memberson1_dob: [""],
      memberson1_marital: [""],
      memberson2_salutation: [""],
      memberson2_firstname: [""],
      memberson2_middlename: [""],
      memberson2_lastname: [""],
      memberson2_relationship: [""],
      memberson2_dob: [""],
      memberson2_marital: [""],
      memberson3_salutation: [""],
      memberson3_firstname: [""],
      memberson3_middlename: [""],
      memberson3_lastname: [""],
      memberson3_relationship: [""],
      memberson3_dob: [""],
      memberson3_marital: [""],
      memberson4_salutation: [""],
      memberson4_firstname: [""],
      memberson4_middlename: [""],
      memberson4_lastname: [""],
      memberson4_relationship: [""],
      memberson4_dob: [""],
      memberson4_marital: [""],
      memberdaughter1_salutation: [""],
      memberdaughter1_firstname: [""],
      memberdaughter1_middlename: [""],
      memberdaughter1_lastname: [""],
      memberdaughter1_relationship: [""],
      memberdaughter1_dob: [""],
      memberdaughter1_marital: [""],
      memberdaughter2_salutation: [""],
      memberdaughter2_firstname: [""],
      memberdaughter2_middlename: [""],
      memberdaughter2_lastname: [""],
      memberdaughter2_relationship: [""],
      memberdaughter2_dob: [""],
      memberdaughter2_marital: [""],
      memberdaughter3_salutation: [""],
      memberdaughter3_firstname: [""],
      memberdaughter3_middlename: [""],
      memberdaughter3_lastname: [""],
      memberdaughter3_relationship: [""],
      memberdaughter3_dob: [""],
      memberdaughter3_marital: [""],
      memberdaughter4_salutation: [""],
      memberdaughter4_firstname: [""],
      memberdaughter4_middlename: [""],
      memberdaughter4_lastname: [""],
      memberdaughter4_relationship: [""],
      memberdaughter4_dob: [""],
      memberdaughter4_marital: [""],
      
    });
  }


  setParameterForSubmitForm() {
    let uploadData = new FormData();
    uploadData.append("quote_data_health_id", this.quote_data_health_id);
    uploadData.append("quote_unique_reference_no", this.quote_unique_reference_no);
    uploadData.append("buyer_email_id", this.formCustomerDetails.value.buyer_email_id);
    uploadData.append("buyer_mobile", this.formCustomerDetails.value.buyer_mobile);
    uploadData.append("buyer_salutation", this.formCustomerDetails.value.buyer_salutation);
    uploadData.append("buyer_first_name", this.formCustomerDetails.value.buyer_first_name);
    uploadData.append("buyer_middle_name", this.formCustomerDetails.value.buyer_middle_name);
    uploadData.append("buyer_last_name", this.formCustomerDetails.value.buyer_last_name);
    uploadData.append("buyer_gender", this.formCustomerDetails.value.buyer_gender);
    uploadData.append("buyer_occupation", this.formCustomerDetails.value.buyer_occupation);
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
    uploadData.append("memberspouse_salutation", this.formCustomerDetails.value.memberspouse_salutation);
    uploadData.append("memberspouse_firstname", this.formCustomerDetails.value.memberspouse_firstname);
    uploadData.append("memberspouse_middlename", this.formCustomerDetails.value.memberspouse_middlename);
    uploadData.append("memberspouse_lastname", this.formCustomerDetails.value.memberspouse_lastname);
    uploadData.append("memberspouse_relationship", this.formCustomerDetails.value.memberspouse_relationship);
    uploadData.append("memberspouse_dob", this.formCustomerDetails.value.memberspouse_dob);
    uploadData.append("memberspouse_marital", this.formCustomerDetails.value.memberspouse_marital);
    uploadData.append("membermother_salutation", this.formCustomerDetails.value.membermother_salutation);
    uploadData.append("membermother_firstname", this.formCustomerDetails.value.membermother_firstname);
    uploadData.append("membermother_middlename", this.formCustomerDetails.value.membermother_middlename);
    uploadData.append("membermother_lastname", this.formCustomerDetails.value.membermother_lastname);
    uploadData.append("membermother_relationship", this.formCustomerDetails.value.membermother_relationship);
    uploadData.append("membermother_dob", this.formCustomerDetails.value.membermother_dob);
    uploadData.append("membermother_marital", this.formCustomerDetails.value.membermother_marital);
    uploadData.append("memberfather_salutation", this.formCustomerDetails.value.memberfather_salutation);
    uploadData.append("memberfather_firstname", this.formCustomerDetails.value.memberfather_firstname);
    uploadData.append("memberfather_middlename", this.formCustomerDetails.value.memberfather_middlename);
    uploadData.append("memberfather_lastname", this.formCustomerDetails.value.memberfather_lastname);
    uploadData.append("memberfather_relationship", this.formCustomerDetails.value.memberfather_relationship);
    uploadData.append("memberfather_dob", this.formCustomerDetails.value.memberfather_dob);
    uploadData.append("memberfather_marital", this.formCustomerDetails.value.memberfather_marital);
    uploadData.append("memberson1_salutation", this.formCustomerDetails.value.memberson1_salutation);
    uploadData.append("memberson1_firstname", this.formCustomerDetails.value.memberson1_firstname);
    uploadData.append("memberson1_middlename", this.formCustomerDetails.value.memberson1_middlename);
    uploadData.append("memberson1_lastname", this.formCustomerDetails.value.memberson1_lastname);
    uploadData.append("memberson1_relationship", this.formCustomerDetails.value.memberson1_relationship);
    uploadData.append("memberson1_dob", this.formCustomerDetails.value.memberson1_dob);
    uploadData.append("memberson1_marital", this.formCustomerDetails.value.memberson1_marital);
    uploadData.append("memberson2_salutation", this.formCustomerDetails.value.memberson2_salutation);
    uploadData.append("memberson2_firstname", this.formCustomerDetails.value.memberson2_firstname);
    uploadData.append("memberson2_middlename", this.formCustomerDetails.value.memberson2_middlename);
    uploadData.append("memberson2_lastname", this.formCustomerDetails.value.memberson2_lastname);
    uploadData.append("memberson2_relationship", this.formCustomerDetails.value.memberson2_relationship);
    uploadData.append("memberson2_dob", this.formCustomerDetails.value.memberson2_dob);
    uploadData.append("memberson2_marital", this.formCustomerDetails.value.memberson2_marital);
    uploadData.append("memberson3_salutation", this.formCustomerDetails.value.memberson3_salutation);
    uploadData.append("memberson3_firstname", this.formCustomerDetails.value.memberson3_firstname);
    uploadData.append("memberson3_middlename", this.formCustomerDetails.value.memberson3_middlename);
    uploadData.append("memberson3_lastname", this.formCustomerDetails.value.memberson3_lastname);
    uploadData.append("memberson3_relationship", this.formCustomerDetails.value.memberson3_relationship);
    uploadData.append("memberson3_dob", this.formCustomerDetails.value.memberson3_dob);
    uploadData.append("memberson3_marital", this.formCustomerDetails.value.memberson3_marital);
    uploadData.append("memberson4_salutation", this.formCustomerDetails.value.memberson4_salutation);
    uploadData.append("memberson4_firstname", this.formCustomerDetails.value.memberson4_firstname);
    uploadData.append("memberson4_middlename", this.formCustomerDetails.value.memberson4_middlename);
    uploadData.append("memberson4_lastname", this.formCustomerDetails.value.memberson4_lastname);
    uploadData.append("memberson4_relationship", this.formCustomerDetails.value.memberson4_relationship);
    uploadData.append("memberson4_dob", this.formCustomerDetails.value.memberson4_dob);
    uploadData.append("memberson4_marital", this.formCustomerDetails.value.memberson4_marital);
    uploadData.append("memberdaughter1_salutation", this.formCustomerDetails.value.memberdaughter1_salutation);
    uploadData.append("memberdaughter1_firstname", this.formCustomerDetails.value.memberdaughter1_firstname);
    uploadData.append("memberdaughter1_middlename", this.formCustomerDetails.value.memberdaughter1_middlename);
    uploadData.append("memberdaughter1_lastname", this.formCustomerDetails.value.memberdaughter1_lastname);
    uploadData.append("memberdaughter1_relationship", this.formCustomerDetails.value.memberdaughter1_relationship);
    uploadData.append("memberdaughter1_dob", this.formCustomerDetails.value.memberdaughter1_dob);
    uploadData.append("memberdaughter1_marital", this.formCustomerDetails.value.memberdaughter1_marital);
    uploadData.append("memberdaughter2_salutation", this.formCustomerDetails.value.memberdaughter2_salutation);
    uploadData.append("memberdaughter2_firstname", this.formCustomerDetails.value.memberdaughter2_firstname);
    uploadData.append("memberdaughter2_middlename", this.formCustomerDetails.value.memberdaughter2_middlename);
    uploadData.append("memberdaughter2_lastname", this.formCustomerDetails.value.memberdaughter2_lastname);
    uploadData.append("memberdaughter2_relationship", this.formCustomerDetails.value.memberdaughter2_relationship);
    uploadData.append("memberdaughter2_dob", this.formCustomerDetails.value.memberdaughter2_dob);
    uploadData.append("memberdaughter2_marital", this.formCustomerDetails.value.memberdaughter2_marital);
    uploadData.append("memberdaughter3_salutation", this.formCustomerDetails.value.memberdaughter3_salutation);
    uploadData.append("memberdaughter3_firstname", this.formCustomerDetails.value.memberdaughter3_firstname);
    uploadData.append("memberdaughter3_middlename", this.formCustomerDetails.value.memberdaughter3_middlename);
    uploadData.append("memberdaughter3_lastname", this.formCustomerDetails.value.memberdaughter3_lastname);
    uploadData.append("memberdaughter3_relationship", this.formCustomerDetails.value.memberdaughter3_relationship);
    uploadData.append("memberdaughter3_dob", this.formCustomerDetails.value.memberdaughter3_dob);
    uploadData.append("memberdaughter3_marital", this.formCustomerDetails.value.memberdaughter3_marital);
    uploadData.append("memberdaughter4_salutation", this.formCustomerDetails.value.memberdaughter4_salutation);
    uploadData.append("memberdaughter4_firstname", this.formCustomerDetails.value.memberdaughter4_firstname);
    uploadData.append("memberdaughter4_middlename", this.formCustomerDetails.value.memberdaughter4_middlename);
    uploadData.append("memberdaughter4_lastname", this.formCustomerDetails.value.memberdaughter4_lastname);
    uploadData.append("memberdaughter4_relationship", this.formCustomerDetails.value.memberdaughter4_relationship);
    uploadData.append("memberdaughter4_dob", this.formCustomerDetails.value.memberdaughter4_dob);
    uploadData.append("memberdaughter4_marital", this.formCustomerDetails.value.memberdaughter4_marital);
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
    this.loaderActive = true;
    this.submittedQuoteDetails = true;
    if (this.formCustomerDetails.invalid) {
      this.findInvalidControls();
      Swal.fire("Please fill all mandatory fields", "", "error");
      return;
    }
    var uploadData: any = this.setParameterForSubmitForm();
    this.healthService
      .submitHealthquoteCustomerFormData(uploadData)
      .subscribe((response) => {
        this.loaderActive = false;
        var outputResult: any = response;
        if (outputResult.status) {
          this.router.navigate(['health-insurance-quote/proposal']);  
        } else {
          alert("error");
        }
      });
  }

  insertProposalData(quote_data_health_id,buyer_email_id)
  {
        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append("quote_id", quote_data_health_id);
        sendData.append("email_id", buyer_email_id);
        this.healthService.insertHealthProposalListData(sendData).subscribe((res) => {
        this.loaderActive = false;  
        var outputResult: any = res;
        console.log(outputResult.response);
        if(outputResult.response[0].is_error == 0)
        {
          this.is_error = outputResult.response[0].is_error;
          this.error_message = outputResult.response[0].error_message;
          this.router.navigate(['health-insurance-quote/proposal']);   
        }
        else{
          this.is_error = outputResult.response[0].is_error;
          this.error_message = outputResult.response[0].error_message;
          Swal.fire(this.error_message, "", "error");
          return;
        }
        
        
      });
  }

}
