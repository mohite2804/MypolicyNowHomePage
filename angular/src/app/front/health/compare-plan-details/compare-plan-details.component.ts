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
  selector: 'app-compare-plan-details',
  templateUrl: './compare-plan-details.component.html',
  styleUrls: ['./compare-plan-details.component.css']
})
export class ComparePlanDetailsComponent implements OnInit {
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
  policy_type_name_div:any;
  selected_deductible:any;
  showTopup: boolean;
  quote_id_1:any;
  quote_id_2:any;
  quote_id_3:any;
  planArr:any;
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
    this.loginUserId = sessionStorage.getItem("user_id");
    this.selectedproducttypeid = sessionStorage.getItem("selected_product_type_id");
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.buy_policy_unique_id = sessionStorage.getItem("unique_reference_no");
    this.quote_id_1 = sessionStorage.getItem('quote_id_1');
    this.quote_id_2 = sessionStorage.getItem('quote_id_2');
    this.quote_id_3 = sessionStorage.getItem('quote_id_3');
    this.getIndex();
    this.getComparePlan();
  }

  getIndex() {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("unique_reference_no", this.buy_policy_unique_id);
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
      this.policyList = result.result.policy_list;
      this.policy_type_name_div = true;
    });
    
  }

  getComparePlan()
  {
    
    let uploadData = new FormData();
    uploadData.append("quote_id_1", this.quote_id_1);
    uploadData.append("quote_id_2", this.quote_id_2);
    uploadData.append("quote_id_3", this.quote_id_3); 
    this.healthService.submitHealthquotePlancompareData(uploadData)
      .subscribe((response) => {
        var outputResult: any = response;
        this.loaderActive = false;
        if (outputResult.status) {
           this.planArr = outputResult.response;
        } else {
          Swal.fire('An error occurred. Please try again later.', "", "error");
          return;
        }
      });
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
}
