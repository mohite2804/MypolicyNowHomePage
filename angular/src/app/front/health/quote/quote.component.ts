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
  selector: "app-quote",
  templateUrl: "./quote.component.html",
  styleUrls: ["./quote.component.css"],
})
export class QuoteComponent implements OnInit {

  quote_form_navigate_url  : any;
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;
  quote_form_share_navigate_url : any;
  loaderActive: boolean = false;

  loginUserId: any;
  selectedproducttypeid: any;
  loginUserType: any;
  policy_type_id: any;
  policy_sub_type_id: any;
  formQuoteDetails: FormGroup;
  submittedQuoteDetails: boolean = false;
  insured_type_self: any;

  gender_selection: any;
  policy_types: any;
  self_agerelation_data: any;
  spouse_agerelation_data: any;
  mother_agerelation_data: any;
  father_agerelation_data: any;
  son_agerelation_data: any;
  daughter_agerelation_data:any;
  policy_sub_types: any;
  insured_types: any;
  relations: any;
  tenures: any;
  suminsured: any;
  deductible: any;
  selected_policy_type_id: any;
  div_show_for_policy_subtypes: boolean = true;
  div_not_show_for_policy_type: boolean;
  showSelected1: boolean;
  showSelected2: boolean;
  showSelected3: boolean;
  showSelected4: boolean;
  showSelected5: boolean;
  showSelected6: boolean;
  self: boolean = false;
  spouse: boolean = false;
  mother: boolean = false;
  father: boolean = false;
  son: boolean = false;
  daughter: boolean = false;
  member_height: any;
  member_weight: any;
  quote_unique_reference_no:any;
  data_from:string;
  // let array_len_check: Array<boolean> = [];
  // let array_len_check: boolean[] = [];
  // let array_len_check: boolean[] = Array();
  // let array_len_check: Array<boolean> = new Array();
  // let arr14 = Array<boolean>();
  // var arr1: boolean[] = [];

  array_len_check: number[] = [];

  relations_new: any = [];

  insured_type_son_numarr = [];

  insured_type_daughter_numarr = [];

  planning_to_have_a_child: boolean = true;

  suffering_from_any_illness: boolean = true;

  any_of_the_members_smoke: boolean = true;

  any_of_the_members_tobaco: boolean = true;

  any_of_the_members_consume_alcohol: boolean = true;

  result_selected_quote_data:any;
  result_selected_member:any;

  validation_for_pincode :any =  "^[0-9]{6}$";

  selected_suminsured:any;
  selected_deductible:any;
  showTopup: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private customvalidationService: CustomvalidationService,
    private healthService: HealthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loaderActive = true;
    this.showSelected1 = false;
    this.showSelected2 = false;
    this.showSelected3 = false;
    this.showSelected4 = false;
    this.showSelected5 = false;
    this.showSelected6 = false;
    this.showTopup     = false;
  }
ToggleButton1(e, id) {
  // alert(e.target.id);
  // alert(this.formQuoteDetails.value.policy_type);
  // alert(this.formQuoteDetails.value.policy_sub_types);
  if (e.target.checked) {

  var sendData = new FormData();
    sendData.append("relation_id", e.target.id);

  if (e.target.id == "1") {
    this.loaderActive = true;
  this.healthService.getAgerelationData(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.self_agerelation_data  = result.result.agerelation_data;
       console.log(result);

    });
  } else if (e.target.id == "2") {
    this.loaderActive = true;
    this.healthService.getAgerelationData(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.spouse_agerelation_data  = result.result.agerelation_data;
  });
   } else if (e.target.id == "3") {
    this.loaderActive = true;
    this.healthService.getAgerelationData(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.mother_agerelation_data  = result.result.agerelation_data;
  });
  } else if (e.target.id == "4") {
    this.loaderActive = true;
      this.healthService.getAgerelationData(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.father_agerelation_data  = result.result.agerelation_data;
  });
} else if (e.target.id == "5") {
  this.loaderActive = true;
  this.healthService.getAgerelationData(sendData)
.subscribe(res => {
  this.loaderActive = false;
  var result :any = res;
  this.son_agerelation_data  = result.result.agerelation_data;
});
} else if (e.target.id == "6") {
  this.loaderActive = true;
  this.healthService.getAgerelationData(sendData)
.subscribe(res => {
  this.loaderActive = false;
  var result :any = res;
  this.daughter_agerelation_data  = result.result.agerelation_data;
});
}

  this.relations.forEach( (value, key) => {
     //alert(value.id);
    // alert(e.target.id);
      if(value.id == e.target.id && e.target.id < 5 ){
      //alert(this.relations[key]+'hello');
      this.relations_new.push(this.relations[key]);
      }
  });

   console.log(this.relations_new+'hello');

      if (this.formQuoteDetails.value.policy_type == "3" && this.formQuoteDetails.value.policy_sub_types == "89") {
        this.array_len_check.push(1);
        if (this.array_len_check.length > 1) {
          // alert('not allowed to select more then one option');
          Swal.fire("Multiple Selections not possible", "", "error");
           this.array_len_check.length = 0;

          this.formQuoteDetails.patchValue({
          insured_type_self : false,
          insured_type_spouse : false,
          insured_type_mother : false,
          insured_type_father : false,
          insured_type_son : false,
          insured_type_daughter : false
          });

          this.array_len_check.length = 0;

          this.showSelected1 = false;
          this.showSelected2 = false;
          this.showSelected3 = false;
          this.showSelected4 = false;
          this.showSelected5 = false;
          this.showSelected6 = false;

          this.relations_new = [];
          this.insured_type_son_numarr = [];
          // preventDefault();

        }
        else {
              if (e.target.id == "1") {
              this.removeInsured();
              this.showSelected1 = !this.showSelected1;
              this.formQuoteDetails.get("insured_type_self_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_weight").updateValueAndValidity();

              this.showSelected2 = false;
              this.showSelected3 = false;
              this.showSelected4 = false;
              this.showSelected5 = false;
              this.showSelected6 = false;
            } else if (e.target.id == "2") {

              this.removeInsured();
              this.showSelected2 = !this.showSelected2;
              this.formQuoteDetails.get("insured_type_spouse_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_weight").updateValueAndValidity();

              this.showSelected1 = false;
              this.showSelected3 = false;
              this.showSelected4 = false;
              this.showSelected5 = false;
              this.showSelected6 = false;
            } else if (e.target.id == "3") {

              this.removeInsured();
              this.showSelected3 = !this.showSelected3;

              this.formQuoteDetails.get("insured_type_mother_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_weight").updateValueAndValidity();

              this.showSelected1 = false;
              this.showSelected2 = false;
              this.showSelected4 = false;
              this.showSelected5 = false;
              this.showSelected6 = false;
            } else if (e.target.id == "4") {
              this.removeInsured();
              this.showSelected4 = !this.showSelected4;
              this.formQuoteDetails.get("insured_type_father_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_weight").updateValueAndValidity();

              this.showSelected1 = false;
              this.showSelected2 = false;
              this.showSelected3 = false;
              this.showSelected5 = false;
              this.showSelected6 = false;
            } else if (e.target.id == "5") {
              this.removeInsured();
              this.showSelected5 = !this.showSelected5;
              this.formQuoteDetails.get("insured_type_son_num").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_son_num").updateValueAndValidity();
              this.showSelected1 = false;
              this.showSelected2 = false;
              this.showSelected3 = false;
              this.showSelected4 = false;
              this.showSelected6 = false;
            } else if (e.target.id == "6") {
              this.removeInsured();
              this.showSelected6 = !this.showSelected6;
              this.formQuoteDetails.get("insured_type_daughter_num").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_daughter_num").updateValueAndValidity();
              this.showSelected1 = false;
              this.showSelected2 = false;
              this.showSelected3 = false;
              this.showSelected4 = false;
              this.showSelected5 = false;
            }

        }
      }
      else {

            // alert("Validation updated for select option");

            // this.array_len_check.length = 0;

            if (e.target.id == "1") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected1 = true;
              this.formQuoteDetails.get("insured_type_self_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_self_weight").updateValueAndValidity();

            } else if (e.target.id == "2") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected2 = true;
              this.formQuoteDetails.get("insured_type_spouse_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_spouse_weight").updateValueAndValidity();
            } else if (e.target.id == "3") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected3 = true;
              this.formQuoteDetails.get("insured_type_mother_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_mother_weight").updateValueAndValidity();
            } else if (e.target.id == "4") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected4 = true;
              this.formQuoteDetails.get("insured_type_father_age").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_height").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_weight").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_father_weight").updateValueAndValidity();
            } else if (e.target.id == "5") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected5 = true;
              this.formQuoteDetails.get("insured_type_son_num").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_son_num").updateValueAndValidity();
            } else if (e.target.id == "6") {
              // this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected6 = true;
              this.formQuoteDetails.get("insured_type_daughter_num").setValidators([Validators.required]);
              this.formQuoteDetails.get("insured_type_daughter_num").updateValueAndValidity();
            }
      }
  }
  else{

    alert("test");

      var relation_id=e.target.id;
      switch(relation_id) {
        case '1':
          var name_relation='self';
        break;
        case '2':
          var name_relation='spouse';
        break;
        case '3':
          var name_relation='mother';
        break;
        case '4':
          var name_relation='father';
        break;
        case '5':
          var name_relation='son';
        break;
        case '6':
          var name_relation='daughter';
        break;

      }

this['showSelected'+relation_id] = false;
this.relations_new.forEach((value,index)=>{
        if(value.id==e.target.id) this.relations_new.splice(index,1);
    });

// console.log(this.relations_new);

switch(relation_id) {
  case '1':
  case '2':
  case '3':
  case '4':
      this.formQuoteDetails.get("insured_type_"+name_relation+"_age").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_age").updateValueAndValidity();
      this.formQuoteDetails.get("insured_type_"+name_relation+"_height").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_height").updateValueAndValidity();
      this.formQuoteDetails.get("insured_type_"+name_relation+"_weight").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_weight").updateValueAndValidity();
  break;
  case '5':
        this.insured_type_son_numarr = [];
        for(let i = 1; i < 5; i++){
          this.formQuoteDetails.get("diabetes_son"+i).setValidators([]);
          this.formQuoteDetails.get("diabetes_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("bloodpressure_son"+i).setValidators([]);
          this.formQuoteDetails.get("bloodpressure_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("heartdiseases_son"+i).setValidators([]);
          this.formQuoteDetails.get("heartdiseases_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("other_conditions_son"+i).setValidators([]);
          this.formQuoteDetails.get("other_conditions_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("smoke_son"+i).setValidators([]);
          this.formQuoteDetails.get("smoke_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("tobaco_son"+i).setValidators([]);
          this.formQuoteDetails.get("tobaco_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfliquor_son"+i).setValidators([]);
          this.formQuoteDetails.get("selfliquor_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfwine_son"+i).setValidators([]);
          this.formQuoteDetails.get("selfwine_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfbeer_son"+i).setValidators([]);
          this.formQuoteDetails.get("selfbeer_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfotheraddiction_son"+i).setValidators([]);
          this.formQuoteDetails.get("selfotheraddiction_son"+i).updateValueAndValidity();
          this.formQuoteDetails.get("otheraddiction_remark_son"+i).setValidators([]);
          this.formQuoteDetails.get("otheraddiction_remark_son"+i).updateValueAndValidity();

        }


  break;
  case '6':
        this.insured_type_daughter_numarr = [];
        for(let i = 1; i < 5; i++){

          this.formQuoteDetails.get("diabetes_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("diabetes_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("bloodpressure_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("bloodpressure_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("heartdiseases_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("heartdiseases_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("other_conditions_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("other_conditions_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("smoke_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("smoke_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("tobaco_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("tobaco_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfliquor_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("selfliquor_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfwine_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("selfwine_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfbeer_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("selfbeer_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("selfotheraddiction_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("selfotheraddiction_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("otheraddiction_remark_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("otheraddiction_remark_daughter"+i).updateValueAndValidity();


        }


        // this.formQuoteDetails.get("insured_type_"+name_relation+"_num").setValidators([]);
        // this.formQuoteDetails.get("insured_type_"+name_relation+"_num").updateValueAndValidity();
  break;
}

/*
if (e.target.id == "1" ||  e.target.id == "2" || e.target.id == "3" || e.target.id == "4") {
      this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
      //var newdata='showSelected'+relation_id;
      this['showSelected'+relation_id] = false;
      this.formQuoteDetails.get("insured_type_"+name_relation+"_age").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_age").updateValueAndValidity();
      this.formQuoteDetails.get("insured_type_"+name_relation+"_height").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_height").updateValueAndValidity();
      this.formQuoteDetails.get("insured_type_"+name_relation+"_weight").setValidators([]);
      this.formQuoteDetails.get("insured_type_"+name_relation+"_weight").updateValueAndValidity();
}


        // alert("validation remove for selected option ");
        if (e.target.id == "1") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected1 = false;
              this.formQuoteDetails.get("insured_type_self_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_weight").updateValueAndValidity();

            } else if (e.target.id == "2") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected2 = false;
              this.formQuoteDetails.get("insured_type_spouse_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_weight").updateValueAndValidity();
            } else if (e.target.id == "3") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected3 = false;
              this.formQuoteDetails.get("insured_type_mother_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_weight").updateValueAndValidity();
            } else if (e.target.id == "4") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected4 = false;
              this.formQuoteDetails.get("insured_type_father_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_weight").updateValueAndValidity();
            } else if (e.target.id == "5") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected5 = false;
              this.formQuoteDetails.get("insured_type_son_num").setValidators([]);
              this.formQuoteDetails.get("insured_type_son_num").updateValueAndValidity();
            } else if (e.target.id == "6") {
              this.relations_new = this.relations_new.filter(item => item.name !== e.target.id);
              this.showSelected6 = false;
              this.formQuoteDetails.get("insured_type_daughter_num").setValidators([]);
              this.formQuoteDetails.get("insured_type_daughter_num").updateValueAndValidity();
            }
*/
  }
}


  // removeItem(obj){
  //    this.relations_new = this.relations_new.filter(item => item !== obj);
  // }

  getInsuredOneValidation(){

    // alert(this.formQuoteDetails.value.policy_type);
    // alert(this.formQuoteDetails.value.policy_sub_types);

    if (this.formQuoteDetails.value.policy_type == "1" && this.formQuoteDetails.value.policy_sub_types == "2") {
            // alert('not allowed to select more then one option');

            this.formQuoteDetails.patchValue({
            insured_type_self : false,
            insured_type_spouse : false,
            insured_type_mother : false,
            insured_type_father : false,
            insured_type_son : false,
            insured_type_daughter : false
            });

            this.array_len_check.length = 0;

            this.showSelected1 = false;
            this.showSelected2 = false;
            this.showSelected3 = false;
            this.showSelected4 = false;
            this.showSelected5 = false;
            this.showSelected6 = false;

            this.relations_new = [];
            this.resetDetails();
            this.removeInsured();
            // preventDefault();


          }

  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("user_id");
    this.selectedproducttypeid = sessionStorage.getItem(
      "selected_product_type_id"
    );
    this.quote_unique_reference_no  = sessionStorage.getItem('quote_unique_reference_no');
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.validationFormQuoteDetails();
    this.getIndex();
    this.getSubtypepolicy();
  }

  getIndex() {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("selectedproducttypeid", this.selectedproducttypeid);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append('quote_unique_reference_no',this.quote_unique_reference_no);
    console.log(this.quote_unique_reference_no+"jaya");
    console.log(this.insured_type_self+'jayshree1111');
    // this.showSelected1 = true;//jay

    this.healthService.getHealthQuoteFormData(sendData).subscribe((res) => {
      this.loaderActive = false;
      var result: any = res;
      console.log("Test Output: ", result);
      this.gender_selection = result.gender;
      // this.policy_types = result.policy_types;
      //this.policy_sub_types = result.policy_sub_types;
      this.insured_types = result.insured_types;
      this.relations = result.relations;
      console.log(this.relations);
      this.tenures = result.tenures;
      this.suminsured = result.suminsured;
      this.deductible = result.deductible;
      this.member_height = result.member_height;
      this.member_weight = result.member_weight;
      this.quote_form_share_navigate_url  = 'health-insurance-quote/quote';
      this.result_selected_quote_data = result.user_action_data;
      this.result_selected_member = result.member_details;
      this.div_not_show_for_policy_type = result.div_not_show_for_policy_type;
      this.result_selected_quote_data = result.user_action_data;
      console.log(this.result_selected_quote_data+'testing');
       if(this.result_selected_quote_data){
        this.setSelectedQuoteData();
        // this.   (policy_type_id,  data_from);
      }

      this.loaderActive = false;

    });
 
  }

  getSubtypepolicy()
  {
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    this.loaderActive = true;
    this.healthService.getHealthQuotePolicy(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.policy_types  = result.result.policy_types;
      console.log(result+'test');
    });
  }

  setSelectedQuoteData(){

    if(this.result_selected_quote_data){
      //alert(this.result_selected_quote_data.insured_type_spouse+'hello!');
      this.selectPolicyType(this.result_selected_quote_data.policy_type,'server');
      this.loginUserId = this.result_selected_quote_data.user_id;

      //console.log(this.result_selected_quote_data.user_id+'hello');
      this.formQuoteDetails.patchValue({
        gender      : this.result_selected_quote_data.gender,
        policy_type : this.result_selected_quote_data.policy_type,

        /*
        insured_type_mother : this.result_selected_quote_data.insured_type_mother,
        insured_type_father : this.result_selected_quote_data.insured_type_father,
        insured_type_son : this.result_selected_quote_data.insured_type_son,
        insured_type_daughter : this.result_selected_quote_data.insured_type_daughter,
        */
        selected_suminsured:this.result_selected_quote_data.selected_suminsured,
        selected_deductible:this.result_selected_quote_data.selected_deductible,
        membersdisease_smoke:this.result_selected_quote_data.membersdisease_smoke,
        membersdisease_tobaco:this.result_selected_quote_data.membersdisease_tobaco,
        alcohol:this.result_selected_quote_data.alcohol,
        membersdisease:this.result_selected_quote_data.membersdisease,
        pincode : this.result_selected_quote_data.pincode,
        tenure : this.result_selected_quote_data.tenure,
        policy_sub_types: this.result_selected_quote_data.policy_sub_types
        //div_not_show_for_policy_type:this.result_selected_quote_data.div_not_show_for_policy_type
      });

      if(this.result_selected_quote_data.insured_type_self==1){
        this.showSelected1 = true;
        this.formQuoteDetails.patchValue({
          insured_type_self : this.result_selected_quote_data.insured_type_self,
          insured_type_self_age:this.result_selected_quote_data.insured_type_self_age,
          insured_type_self_height:this.result_selected_quote_data.insured_type_self_height,
          insured_type_self_weight:this.result_selected_quote_data.insured_type_self_weight,
        });
        var sendData = new FormData();
        sendData.append("relation_id", '1');
        this.healthService.getAgerelationData(sendData)
        .subscribe(res => {
          this.loaderActive = false;
          var result :any = res;
          this.self_agerelation_data  = result.result.agerelation_data;
           console.log(result);
        });

      }
      if(this.result_selected_quote_data.insured_type_spouse==1){
        this.showSelected2 = true;
        this.formQuoteDetails.patchValue({
        insured_type_spouse : this.result_selected_quote_data.insured_type_spouse,
        insured_type_spouse_age:this.result_selected_quote_data.insured_type_spouse_age,
        insured_type_spouse_height:this.result_selected_quote_data.insured_type_spouse_height,
        insured_type_spouse_weight:this.result_selected_quote_data.insured_type_spouse_weight,
        });

        var sendData = new FormData();
        sendData.append("relation_id", '2');
        this.healthService.getAgerelationData(sendData)
        .subscribe(res => {
          this.loaderActive = false;
          var result :any = res;
          this.spouse_agerelation_data  = result.result.agerelation_data;
           console.log(result);
        });

/*
        if(this.result_selected_quote_data.membersdisease_smoke=='yes'){
          this.any_of_the_members_smoke_yes();
            this.relations.forEach( (value, key) => {
              if(value.id == 1 ){
                this.relations_new.push(this.relations[key]);
              }
          });
        }
*/

      }
      if(this.result_selected_quote_data.insured_type_mother==1){
        this.showSelected3 = true;
        this.formQuoteDetails.patchValue({
        insured_type_mother : this.result_selected_quote_data.insured_type_mother,
        insured_type_mother_age:this.result_selected_quote_data.insured_type_mother_age,
        insured_type_mother_height:this.result_selected_quote_data.insured_type_mother_height,
        insured_type_mother_weight:this.result_selected_quote_data.insured_type_mother_weight,
        });

        var sendData = new FormData();
        sendData.append("relation_id", '2');
        this.healthService.getAgerelationData(sendData)
        .subscribe(res => {
          this.loaderActive = false;
          var result :any = res;
          this.mother_agerelation_data  = result.result.agerelation_data;
           console.log(result);
        });

      }
      if(this.result_selected_quote_data.insured_type_father==1){
        this.showSelected4 = true;
        this.formQuoteDetails.patchValue({
        insured_type_father : this.result_selected_quote_data.insured_type_father,
        insured_type_father_age:this.result_selected_quote_data.insured_type_father_age,
        insured_type_father_height:this.result_selected_quote_data.insured_type_father_height,
        insured_type_father_weight:this.result_selected_quote_data.insured_type_father_weight,
        });
        var sendData = new FormData();
        sendData.append("relation_id", '2');
        this.healthService.getAgerelationData(sendData)
        .subscribe(res => {
          this.loaderActive = false;
          var result :any = res;
          this.father_agerelation_data  = result.result.agerelation_data;
           console.log(result);
        });

      }
      if(this.result_selected_quote_data.insured_type_son==5){
        this.showSelected5 = true;
        var sendData = new FormData();
        sendData.append("relation_id", '2');
        this.healthService.getAgerelationData(sendData)
        .subscribe(res => {
          this.loaderActive = false;
          var result :any = res;
          this.spouse_agerelation_data  = result.result.agerelation_data;
           console.log(result);
        });
      }
      //smoke

      if(this.result_selected_quote_data.membersdisease_smoke=='yes'){
        this.any_of_the_members_smoke_yes();
      }

      if(this.result_selected_quote_data.membersdisease_tobaco=='yes'){
        this.any_of_the_members_tobaco_yes();
      }
      if(this.result_selected_quote_data.membersdisease_alcohol=='yes'){
        this.any_of_the_members_consume_alcohol_yes();
      }
      if(this.result_selected_quote_data.membersdisease=='yes'){
        this.suffering_from_any_illness_yes();
      }


     this.result_selected_member.forEach( (value, key) => {
     //var user_type=value.user_type.tolowercase();

        switch(value.user_type) {
        case 'Self':
          var type_id=1;
        break;
        case 'Spouse':
          var type_id=2;
        break;
        case 'Mother':
          var name_relation='mother';
        break;
        case 'Father':
          var name_relation='father';
        break;
/*
        case 'Son1':
          var type_id=Son1;
        break;
        case 'Son2':
       // case 'Son3':
        //case 'Son4':
      var type_id=Son2;
        /*
        case 'Daughter1':
          var type_id=6;
        break;
        */
        }
         //alert(value.user_type);

        // alert(e.target.id);

        this.relations.forEach( (value, key) => {
           //alert(value.id);
          // alert(e.target.id);
            if(value.id == type_id){//&& type_id < 5
            //alert(this.relations[key]+'hello');
            this.relations_new.push(this.relations[key]);
            }
        });

        /*
          if(value.id == e.target.id && e.target.id < 5 ){
          //alert(this.relations[key]+'hello');
          this.relations_new.push(this.relations[key]);
          }
          */
      });

    }
  }
  resetDetails(){
          this.formQuoteDetails.get("insured_type_self_age").setValidators([]);
          this.formQuoteDetails.get("insured_type_self_age").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_self_height").setValidators([]);
          this.formQuoteDetails.get("insured_type_self_height").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_self_weight").setValidators([]);
          this.formQuoteDetails.get("insured_type_self_weight").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_spouse_age").setValidators([]);
          this.formQuoteDetails.get("insured_type_spouse_age").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_spouse_height").setValidators([]);
          this.formQuoteDetails.get("insured_type_spouse_height").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_spouse_weight").setValidators([]);
          this.formQuoteDetails.get("insured_type_spouse_weight").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_mother_age").setValidators([]);
          this.formQuoteDetails.get("insured_type_mother_age").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_mother_height").setValidators([]);
          this.formQuoteDetails.get("insured_type_mother_height").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_mother_weight").setValidators([]);
          this.formQuoteDetails.get("insured_type_mother_weight").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_father_age").setValidators([]);
          this.formQuoteDetails.get("insured_type_father_age").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_father_height").setValidators([]);
          this.formQuoteDetails.get("insured_type_father_height").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_father_weight").setValidators([]);
          this.formQuoteDetails.get("insured_type_father_weight").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_son_num").setValidators([]);
          this.formQuoteDetails.get("insured_type_son_num").updateValueAndValidity();
          this.formQuoteDetails.get("insured_type_daughter_num").setValidators([]);
          this.formQuoteDetails.get("insured_type_daughter_num").updateValueAndValidity();


  }

  removeInsured(){

              this.formQuoteDetails.get("insured_type_self_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_self_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_self_weight").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_spouse_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_spouse_weight").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_mother_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_mother_weight").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_age").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_age").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_height").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_height").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_father_weight").setValidators([]);
              this.formQuoteDetails.get("insured_type_father_weight").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_son_num").setValidators([]);
              this.formQuoteDetails.get("insured_type_son_num").updateValueAndValidity();
              this.formQuoteDetails.get("insured_type_daughter_num").setValidators([]);
              this.formQuoteDetails.get("insured_type_daughter_num").updateValueAndValidity();

  }

  selectPolicyType(policy_type_id, data_from) {
    this.loaderActive = true;
    this.showTopup=false;
    this.selected_policy_type_id  = policy_type_id;
    this.div_show_for_policy_subtypes = true;
    var sendData = new FormData();
    sendData.append('selected_policy_type_id',this.selected_policy_type_id);
    this.healthService.getHealthQuotesubPolicy(sendData)
    .subscribe(res => {
      this.loaderActive = false;
      var result :any = res;
      this.policy_sub_types = result.result.sub_policy_types;
    });
     this.div_show_for_policy_subtypes = false;
    // console.log("policy_type_id:- "+policy_type_id);
    // this.selected_policy_type_id = policy_type_id;
    // this.div_show_for_policy_subtypes = true;
    // if (policy_type_id == 1) {
    //   this.formQuoteDetails.patchValue({
    //     policy_subtype_id: this.policy_sub_types,
    //   });
    // }

    // if (this.selected_policy_type_id == 1) {
    //   var sendData = new FormData();
    //   this.healthService.getHealthQuoteFormData(sendData).subscribe((res) => {
    //     this.loaderActive = false;
    //     var result: any = res;
    //     this.policy_sub_types = result.policy_sub_types;
    //   });
    //   this.div_show_for_policy_subtypes = false;
    // } else {
    //   var sendData = new FormData();
    //   this.healthService.getHealthQuoteFormData(sendData).subscribe((res) => {
    //     this.loaderActive = false;
    //     var result: any = res;
    //     this.policy_sub_types = result.policy_sub_types;
    //   });
    //   this.div_show_for_policy_subtypes = false;
    // }
    if(this.selected_policy_type_id==4){
      this.showTopup=true;

      this.healthService.getDeductible('')
      .subscribe(res => {
        var result :any = res;
        this.deductible  = result.result.deductible_data;
      });

      console.log(this.deductible="jayaded");


    }
  }

  validationFormQuoteDetails() {
    this.formQuoteDetails = this.formBuilder.group({
      gender: ["", [Validators.required]],
      policy_type: ["", [Validators.required]],
      policy_sub_types: ["", [Validators.required]],
      insured_type_self: ["", [Validators.required]],
      insured_type_self_age: [""],
      insured_type_self_height: [""],
      insured_type_self_weight: [""],
      insured_type_spouse: [""],
      insured_type_spouse_age: [""],
      insured_type_spouse_height: [""],
      insured_type_spouse_weight: [""],
      insured_type_mother: [""],
      insured_type_mother_age: [""],
      insured_type_mother_height: [""],
      insured_type_mother_weight: [""],
      insured_type_father: [""],
      insured_type_father_age: [""],
      insured_type_father_height: [""],
      insured_type_father_weight: [""],
      insured_type_son: [""],
      insured_type_son_num: [""],
      insured_type_daughter: [""],
      insured_type_daughter_num: [""],
      insured_type_son1_age: [""],
      insured_type_son1_height: [""],
      insured_type_son1_weight: [""],
      insured_type_son2_age: [""],
      insured_type_son2_height: [""],
      insured_type_son2_weight: [""],
      insured_type_son3_age: [""],
      insured_type_son3_height: [""],
      insured_type_son3_weight: [""],
      insured_type_son4_age: [""],
      insured_type_son4_height: [""],
      insured_type_son4_weight: [""],
      insured_type_daughter1_age: [""],
      insured_type_daughter1_height: [""],
      insured_type_daughter1_weight: [""],
      insured_type_daughter2_age: [""],
      insured_type_daughter2_height: [""],
      insured_type_daughter2_weight: [""],
      insured_type_daughter3_age: [""],
      insured_type_daughter3_height: [""],
      insured_type_daughter3_weight: [""],
      insured_type_daughter4_age: [""],
      insured_type_daughter4_height: [""],
      insured_type_daughter4_weight: [""],
      childplanning: [""],
      planning_duration: [""],
      membersdisease: [""],
      diabetes_self: [""],
      bloodpressure_self: [""],
      heartdiseases_self: [""],
      other_conditions_self: [""],
      diabetes_spouse: [""],
      bloodpressure_spouse: [""],
      heartdiseases_spouse: [""],
      other_conditions_spouse: [""],
      diabetes_mother: [""],
      bloodpressure_mother: [""],
      heartdiseases_mother: [""],
      other_conditions_mother: [""],
      diabetes_father: [""],
      bloodpressure_father: [""],
      heartdiseases_father: [""],
      other_conditions_father: [""],
      membersdisease_smoke: [""],
      smoke_self: [""],
      smoke_spouse: [""],
      smoke_mother: [""],
      smoke_father: [""],
      membersdisease_tobaco: [""],
      tobaco_self: [""],
      tobaco_spouse: [""],
      tobaco_mother: [""],
      tobaco_father: [""],
      alcohol: [""],
      liquor_self: [""],
      wine_self: [""],
      beer_self: [""],
      otheraddiction_self: [""],
      otheraddiction_remark_self: [""],
      liquor_spouse: [""],
      wine_spouse: [""],
      beer_spouse: [""],
      otheraddiction_spouse: [""],
      otheraddiction_remark_spouse: [""],
      liquor_mother: [""],
      wine_mother: [""],
      beer_mother: [""],
      otheraddiction_mother: [""],
      otheraddiction_remark_mother: [""],
      liquor_father: [""],
      wine_father: [""],
      beer_father: [""],
      otheraddiction_father: [""],
      otheraddiction_remark_father: [""],
      liquor_daughter: [""],
      wine_daughter: [""],
      beer_daughter: [""],
      otheraddiction_daughter: [""],
      otheraddiction_remark_daughter: [""],
      pincode: ['',[Validators.required,Validators.pattern(this.validation_for_pincode)]],
      selected_suminsured: ["", [Validators.required]],
      selected_deductible: ["", [Validators.required]],
      tenure: ["", [Validators.required]],
      diabetes_son1:[""],
      diabetes_son2:[""],
      diabetes_son3:[""],
      diabetes_son4:[""],
      bloodpressure_son1:[""],
      bloodpressure_son2:[""],
      bloodpressure_son3:[""],
      bloodpressure_son4:[""],
      heartdiseases_son1:[""],
      heartdiseases_son2:[""],
      heartdiseases_son3:[""],
      heartdiseases_son4:[""],
      other_conditions_son1:[""],
      other_conditions_son2:[""],
      other_conditions_son3:[""],
      other_conditions_son4:[""],
      smoke_son1:[""],
      smoke_son2:[""],
      smoke_son3:[""],
      smoke_son4:[""],
      tobaco_son1:[""],
      tobaco_son2:[""],
      tobaco_son3:[""],
      tobaco_son4:[""],
      selfliquor_son1:[""],
      selfliquor_son2:[""],
      selfliquor_son3:[""],
      selfliquor_son4:[""],
      selfwine_son1:[""],
      selfwine_son2:[""],
      selfwine_son3:[""],
      selfwine_son4:[""],
      selfbeer_son1:[""],
      selfbeer_son2:[""],
      selfbeer_son3:[""],
      selfbeer_son4:[""],
      selfotheraddiction_son1:[""],
      selfotheraddiction_son2:[""],
      selfotheraddiction_son3:[""],
      selfotheraddiction_son4:[""],
      otheraddiction_remark_son1:[""],
      otheraddiction_remark_son2:[""],
      otheraddiction_remark_son3:[""],
      otheraddiction_remark_son4:[""],

      diabetes_daughter1:[""],
      diabetes_daughter2:[""],
      diabetes_daughter3:[""],
      diabetes_daughter4:[""],
      bloodpressure_daughter1:[""],
      bloodpressure_daughter2:[""],
      bloodpressure_daughter3:[""],
      bloodpressure_daughter4:[""],
      heartdiseases_daughter1:[""],
      heartdiseases_daughter2:[""],
      heartdiseases_daughter3:[""],
      heartdiseases_daughter4:[""],
      other_conditions_daughter1:[""],
      other_conditions_daughter2:[""],
      other_conditions_daughter3:[""],
      other_conditions_daughter4:[""],
      smoke_daughter1:[""],
      smoke_daughter2:[""],
      smoke_daughter3:[""],
      smoke_daughter4:[""],
      tobaco_daughter1:[""],
      tobaco_daughter2:[""],
      tobaco_daughter3:[""],
      tobaco_daughter4:[""],
      selfliquor_daughter1:[""],
      selfliquor_daughter2:[""],
      selfliquor_daughter3:[""],
      selfliquor_daughter4:[""],
      selfwine_daughter1:[""],
      selfwine_daughter2:[""],
      selfwine_daughter3:[""],
      selfwine_daughter4:[""],
      selfbeer_daughter1:[""],
      selfbeer_daughter2:[""],
      selfbeer_daughter3:[""],
      selfbeer_daughter4:[""],
      selfotheraddiction_daughter1:[""],
      selfotheraddiction_daughter2:[""],
      selfotheraddiction_daughter3:[""],
      selfotheraddiction_daughter4:[""],
      otheraddiction_remark_daughter1:[""],
      otheraddiction_remark_daughter2:[""],
      otheraddiction_remark_daughter3:[""],
      otheraddiction_remark_daughter4:[""],

    });
  }

  setParameterForSubmitForm() {
    let uploadData = new FormData();
    uploadData.append("user_id", this.loginUserId);
    uploadData.append("user_type_id", this.loginUserType);
    uploadData.append("selected_product_type_id", this.selectedproducttypeid);
    uploadData.append("gender", this.formQuoteDetails.value.gender);
    uploadData.append("policy_type", this.formQuoteDetails.value.policy_type);
    uploadData.append("policy_sub_types", this.formQuoteDetails.value.policy_sub_types);
    uploadData.append("insured_type_self", this.formQuoteDetails.value.insured_type_self);
    uploadData.append("insured_type_self_age", this.formQuoteDetails.value.insured_type_self_age);
    uploadData.append("insured_type_self_height", this.formQuoteDetails.value.insured_type_self_height);
    uploadData.append("insured_type_self_weight", this.formQuoteDetails.value.insured_type_self_weight);
    uploadData.append("insured_type_spouse", this.formQuoteDetails.value.insured_type_spouse);
    uploadData.append("insured_type_spouse_age", this.formQuoteDetails.value.insured_type_spouse_age);
    uploadData.append("insured_type_spouse_height", this.formQuoteDetails.value.insured_type_spouse_height);
    uploadData.append("insured_type_spouse_weight", this.formQuoteDetails.value.insured_type_spouse_weight);
    uploadData.append("insured_type_mother", this.formQuoteDetails.value.insured_type_mother);
    uploadData.append("insured_type_mother_age", this.formQuoteDetails.value.insured_type_mother_age);
    uploadData.append("insured_type_mother_height", this.formQuoteDetails.value.insured_type_mother_height);
    uploadData.append("insured_type_mother_weight", this.formQuoteDetails.value.insured_type_mother_weight);
    uploadData.append("insured_type_father", this.formQuoteDetails.value.insured_type_father);
    uploadData.append("insured_type_father_age", this.formQuoteDetails.value.insured_type_father_age);
    uploadData.append("insured_type_father_height", this.formQuoteDetails.value.insured_type_father_height);
    uploadData.append("insured_type_father_weight", this.formQuoteDetails.value.insured_type_father_weight);
    uploadData.append("insured_type_son1_age", this.formQuoteDetails.value.insured_type_son1_age);
    uploadData.append("insured_type_son1_height", this.formQuoteDetails.value.insured_type_son1_height);
    uploadData.append("insured_type_son1_weight", this.formQuoteDetails.value.insured_type_son1_weight);
    uploadData.append("insured_type_son2_age", this.formQuoteDetails.value.insured_type_son2_age);
    uploadData.append("insured_type_son2_height", this.formQuoteDetails.value.insured_type_son2_height);
    uploadData.append("insured_type_son2_weight", this.formQuoteDetails.value.insured_type_son2_weight);
    uploadData.append("insured_type_son3_age", this.formQuoteDetails.value.insured_type_son3_age);
    uploadData.append("insured_type_son3_height", this.formQuoteDetails.value.insured_type_son3_height);
    uploadData.append("insured_type_son3_weight", this.formQuoteDetails.value.insured_type_son3_weight);
    uploadData.append("insured_type_son4_age", this.formQuoteDetails.value.insured_type_son4_age);
    uploadData.append("insured_type_son4_height", this.formQuoteDetails.value.insured_type_son4_height);
    uploadData.append("insured_type_son4_weight", this.formQuoteDetails.value.insured_type_son4_weight);
    uploadData.append("insured_type_daughter1_age", this.formQuoteDetails.value.insured_type_daughter1_age);
    uploadData.append("insured_type_daughter1_height", this.formQuoteDetails.value.insured_type_daughter1_height);
    uploadData.append("insured_type_daughter1_weight", this.formQuoteDetails.value.insured_type_daughter1_weight);
    uploadData.append("insured_type_daughter2_age", this.formQuoteDetails.value.insured_type_daughter2_age);
    uploadData.append("insured_type_daughter2_height", this.formQuoteDetails.value.insured_type_daughter2_height);
    uploadData.append("insured_type_daughter2_weight", this.formQuoteDetails.value.insured_type_daughter2_weight);
    uploadData.append("insured_type_daughter3_age", this.formQuoteDetails.value.insured_type_daughter3_age);
    uploadData.append("insured_type_daughter3_height", this.formQuoteDetails.value.insured_type_daughter3_height);
    uploadData.append("insured_type_daughter3_weight", this.formQuoteDetails.value.insured_type_daughter3_weight);
    uploadData.append("insured_type_daughter4_age", this.formQuoteDetails.value.insured_type_daughter4_age);
    uploadData.append("insured_type_daughter4_height", this.formQuoteDetails.value.insured_type_daughter4_height);
    uploadData.append("insured_type_daughter4_weight", this.formQuoteDetails.value.insured_type_daughter4_weight);
    uploadData.append("insured_type_son", this.formQuoteDetails.value.insured_type_son);
    uploadData.append("insured_type_son_num", this.formQuoteDetails.value.insured_type_son_num);
    uploadData.append("insured_type_daughter", this.formQuoteDetails.value.insured_type_daughter);
    uploadData.append("insured_type_daughter_num", this.formQuoteDetails.value.insured_type_daughter_num);
    uploadData.append("childplanning", this.formQuoteDetails.value.childplanning);
    uploadData.append("planning_duration", this.formQuoteDetails.value.planning_duration);
    uploadData.append("membersdisease", this.formQuoteDetails.value.membersdisease);
    uploadData.append("diabetes_self", this.formQuoteDetails.value.diabetes_self);
    uploadData.append("bloodpressure_self", this.formQuoteDetails.value.bloodpressure_self);
    uploadData.append("heartdiseases_self", this.formQuoteDetails.value.heartdiseases_self);
    uploadData.append("other_conditions_self", this.formQuoteDetails.value.other_conditions_self);
    uploadData.append("diabetes_spouse", this.formQuoteDetails.value.diabetes_spouse);
    uploadData.append("bloodpressure_spouse", this.formQuoteDetails.value.bloodpressure_spouse);
    uploadData.append("heartdiseases_spouse", this.formQuoteDetails.value.heartdiseases_spouse);
    uploadData.append("other_conditions_spouse", this.formQuoteDetails.value.other_conditions_spouse);
    uploadData.append("diabetes_mother", this.formQuoteDetails.value.diabetes_mother);
    uploadData.append("bloodpressure_mother", this.formQuoteDetails.value.bloodpressure_mother);
    uploadData.append("heartdiseases_mother", this.formQuoteDetails.value.heartdiseases_mother);
    uploadData.append("other_conditions_mother", this.formQuoteDetails.value.other_conditions_mother);
    uploadData.append("diabetes_father", this.formQuoteDetails.value.diabetes_father);
    uploadData.append("bloodpressure_father", this.formQuoteDetails.value.bloodpressure_father);
    uploadData.append("heartdiseases_father", this.formQuoteDetails.value.heartdiseases_father);
    uploadData.append("other_conditions_father", this.formQuoteDetails.value.other_conditions_father);
    uploadData.append("diabetes_son1", this.formQuoteDetails.value.diabetes_son1);
    uploadData.append("bloodpressure_son1", this.formQuoteDetails.value.bloodpressure_son1);
    uploadData.append("heartdiseases_son1", this.formQuoteDetails.value.heartdiseases_son1);
    uploadData.append("other_conditions_son1", this.formQuoteDetails.value.other_conditions_son1);
    uploadData.append("diabetes_son2", this.formQuoteDetails.value.diabetes_son2);
    uploadData.append("bloodpressure_son2", this.formQuoteDetails.value.bloodpressure_son2);
    uploadData.append("heartdiseases_son2", this.formQuoteDetails.value.heartdiseases_son2);
    uploadData.append("other_conditions_son2", this.formQuoteDetails.value.other_conditions_son2);
    uploadData.append("diabetes_son3", this.formQuoteDetails.value.diabetes_son3);
    uploadData.append("bloodpressure_son3", this.formQuoteDetails.value.bloodpressure_son3);
    uploadData.append("heartdiseases_son3", this.formQuoteDetails.value.heartdiseases_son3);
    uploadData.append("other_conditions_son3", this.formQuoteDetails.value.other_conditions_son3);
    uploadData.append("diabetes_son4", this.formQuoteDetails.value.diabetes_son4);
    uploadData.append("bloodpressure_son4", this.formQuoteDetails.value.bloodpressure_son4);
    uploadData.append("heartdiseases_son4", this.formQuoteDetails.value.heartdiseases_son4);
    uploadData.append("other_conditions_son4", this.formQuoteDetails.value.other_conditions_son4);
    uploadData.append("diabetes_daughter1", this.formQuoteDetails.value.diabetes_daughter1);
    uploadData.append("bloodpressure_daughter1", this.formQuoteDetails.value.bloodpressure_daughter1);
    uploadData.append("heartdiseases_daughter1", this.formQuoteDetails.value.heartdiseases_daughter1);
    uploadData.append("other_conditions_daughter1", this.formQuoteDetails.value.other_conditions_daughter1);
    uploadData.append("diabetes_daughter2", this.formQuoteDetails.value.diabetes_daughter2);
    uploadData.append("bloodpressure_daughter2", this.formQuoteDetails.value.bloodpressure_daughter2);
    uploadData.append("heartdiseases_daughter2", this.formQuoteDetails.value.heartdiseases_daughter2);
    uploadData.append("other_conditions_daughter2", this.formQuoteDetails.value.other_conditions_daughter2);
    uploadData.append("diabetes_daughter3", this.formQuoteDetails.value.diabetes_daughter3);
    uploadData.append("bloodpressure_daughter3", this.formQuoteDetails.value.bloodpressure_daughter3);
    uploadData.append("heartdiseases_daughter3", this.formQuoteDetails.value.heartdiseases_daughter3);
    uploadData.append("other_conditions_daughter3", this.formQuoteDetails.value.other_conditions_daughter3);
    uploadData.append("diabetes_daughter4", this.formQuoteDetails.value.diabetes_daughter4);
    uploadData.append("bloodpressure_daughter4", this.formQuoteDetails.value.bloodpressure_daughter4);
    uploadData.append("heartdiseases_daughter4", this.formQuoteDetails.value.heartdiseases_daughter4);
    uploadData.append("other_conditions_daughter4", this.formQuoteDetails.value.other_conditions_daughter4);
    uploadData.append("membersdisease_smoke", this.formQuoteDetails.value.membersdisease_smoke);
    uploadData.append("smoke_self", this.formQuoteDetails.value.smoke_self);
    uploadData.append("smoke_spouse", this.formQuoteDetails.value.smoke_spouse);
    uploadData.append("smoke_mother", this.formQuoteDetails.value.smoke_mother);
    uploadData.append("smoke_father", this.formQuoteDetails.value.smoke_father);
    uploadData.append("smoke_daughter1", this.formQuoteDetails.value.smoke_daughter1);
    uploadData.append("smoke_daughter2", this.formQuoteDetails.value.smoke_daughter2);
    uploadData.append("smoke_daughter3", this.formQuoteDetails.value.smoke_daughter3);
    uploadData.append("smoke_daughter4", this.formQuoteDetails.value.smoke_daughter4);
    uploadData.append("smoke_son1", this.formQuoteDetails.value.smoke_son1);
    uploadData.append("smoke_son2", this.formQuoteDetails.value.smoke_son2);
    uploadData.append("smoke_son3", this.formQuoteDetails.value.smoke_son3);
    uploadData.append("smoke_son4", this.formQuoteDetails.value.smoke_son4);
    uploadData.append("membersdisease_tobaco", this.formQuoteDetails.value.membersdisease_tobaco);
    uploadData.append("tobaco_self", this.formQuoteDetails.value.tobaco_self);
    uploadData.append("tobaco_spouse", this.formQuoteDetails.value.tobaco_spouse);
    uploadData.append("tobaco_mother", this.formQuoteDetails.value.tobaco_mother);
    uploadData.append("tobaco_father", this.formQuoteDetails.value.tobaco_father);
    uploadData.append("tobaco_daughter1", this.formQuoteDetails.value.tobaco_daughter1);
    uploadData.append("tobaco_daughter2", this.formQuoteDetails.value.tobaco_daughter2);
    uploadData.append("tobaco_daughter3", this.formQuoteDetails.value.tobaco_daughter3);
    uploadData.append("tobaco_daughter4", this.formQuoteDetails.value.tobaco_daughter4);
    uploadData.append("tobaco_son1", this.formQuoteDetails.value.tobaco_son1);
    uploadData.append("tobaco_son2", this.formQuoteDetails.value.tobaco_son2);
    uploadData.append("tobaco_son3", this.formQuoteDetails.value.tobaco_son3);
    uploadData.append("tobaco_son4", this.formQuoteDetails.value.tobaco_son4);
    uploadData.append("alcohol", this.formQuoteDetails.value.alcohol);
    uploadData.append("liquor_self", this.formQuoteDetails.value.liquor_self);
    uploadData.append("wine_self", this.formQuoteDetails.value.wine_self);
    uploadData.append("beer_self", this.formQuoteDetails.value.beer_self);
    uploadData.append("otheraddiction_self", this.formQuoteDetails.value.otheraddiction_self);
    uploadData.append("otheraddiction_remark_self", this.formQuoteDetails.value.otheraddiction_remark_self);
    uploadData.append("liquor_spouse", this.formQuoteDetails.value.liquor_spouse);
    uploadData.append("wine_spouse", this.formQuoteDetails.value.wine_spouse);
    uploadData.append("beer_spouse", this.formQuoteDetails.value.beer_spouse);
    uploadData.append("otheraddiction_spouse", this.formQuoteDetails.value.otheraddiction_spouse);
    uploadData.append("otheraddiction_remark_spouse", this.formQuoteDetails.value.otheraddiction_remark_spouse);
    uploadData.append("liquor_mother", this.formQuoteDetails.value.liquor_mother);
    uploadData.append("wine_mother", this.formQuoteDetails.value.wine_mother);
    uploadData.append("beer_mother", this.formQuoteDetails.value.beer_mother);
    uploadData.append("otheraddiction_mother", this.formQuoteDetails.value.otheraddiction_mother);
    uploadData.append("otheraddiction_remark_mother", this.formQuoteDetails.value.otheraddiction_remark_mother);
    uploadData.append("liquor_father", this.formQuoteDetails.value.liquor_father);
    uploadData.append("wine_father", this.formQuoteDetails.value.wine_father);
    uploadData.append("beer_father", this.formQuoteDetails.value.beer_father);
    uploadData.append("otheraddiction_father", this.formQuoteDetails.value.otheraddiction_father);
    uploadData.append("otheraddiction_remark_father", this.formQuoteDetails.value.otheraddiction_remark_father);
    uploadData.append("liquor_son1", this.formQuoteDetails.value.liquor_son1);
    uploadData.append("wine_son1", this.formQuoteDetails.value.wine_son1);
    uploadData.append("beer_son1", this.formQuoteDetails.value.beer_son1);
    uploadData.append("otheraddiction_son1", this.formQuoteDetails.value.otheraddiction_son1);
    uploadData.append("otheraddiction_remark_son1", this.formQuoteDetails.value.otheraddiction_remark_son1);
    uploadData.append("liquor_son2", this.formQuoteDetails.value.liquor_son2);
    uploadData.append("wine_son2", this.formQuoteDetails.value.wine_son2);
    uploadData.append("beer_son2", this.formQuoteDetails.value.beer_son2);
    uploadData.append("otheraddiction_son2", this.formQuoteDetails.value.otheraddiction_son2);
    uploadData.append("otheraddiction_remark_son2", this.formQuoteDetails.value.otheraddiction_remark_son2);
    uploadData.append("liquor_son3", this.formQuoteDetails.value.liquor_son3);
    uploadData.append("wine_son3", this.formQuoteDetails.value.wine_son3);
    uploadData.append("beer_son3", this.formQuoteDetails.value.beer_son3);
    uploadData.append("otheraddiction_son3", this.formQuoteDetails.value.otheraddiction_son3);
    uploadData.append("otheraddiction_remark_son3", this.formQuoteDetails.value.otheraddiction_remark_son3);
    uploadData.append("liquor_son4", this.formQuoteDetails.value.liquor_son4);
    uploadData.append("wine_son4", this.formQuoteDetails.value.wine_son4);
    uploadData.append("beer_son4", this.formQuoteDetails.value.beer_son4);
    uploadData.append("otheraddiction_son4", this.formQuoteDetails.value.otheraddiction_son4);
    uploadData.append("otheraddiction_remark_son4", this.formQuoteDetails.value.otheraddiction_remark_son4);
    uploadData.append("liquor_daughter1", this.formQuoteDetails.value.liquor_daughter1);
    uploadData.append("wine_daughter1", this.formQuoteDetails.value.wine_daughter1);
    uploadData.append("beer_daughter1", this.formQuoteDetails.value.beer_daughter1);
    uploadData.append("otheraddiction_daughter1", this.formQuoteDetails.value.otheraddiction_daughter1);
    uploadData.append("otheraddiction_remark_daughter1", this.formQuoteDetails.value.otheraddiction_remark_daughter1);
    uploadData.append("liquor_daughter2", this.formQuoteDetails.value.liquor_daughter2);
    uploadData.append("wine_daughter2", this.formQuoteDetails.value.wine_daughter2);
    uploadData.append("beer_daughter2", this.formQuoteDetails.value.beer_daughter2);
    uploadData.append("otheraddiction_daughter2", this.formQuoteDetails.value.otheraddiction_daughter2);
    uploadData.append("otheraddiction_remark_daughter2", this.formQuoteDetails.value.otheraddiction_remark_daughter2);
    uploadData.append("liquor_daughter3", this.formQuoteDetails.value.liquor_daughter3);
    uploadData.append("wine_daughter3", this.formQuoteDetails.value.wine_daughter3);
    uploadData.append("beer_daughter3", this.formQuoteDetails.value.beer_daughter3);
    uploadData.append("otheraddiction_daughter3", this.formQuoteDetails.value.otheraddiction_daughter3);
    uploadData.append("otheraddiction_remark_daughter3", this.formQuoteDetails.value.otheraddiction_remark_daughter3);
    uploadData.append("liquor_daughter4", this.formQuoteDetails.value.liquor_daughter4);
    uploadData.append("wine_daughter4", this.formQuoteDetails.value.wine_daughter4);
    uploadData.append("beer_daughter4", this.formQuoteDetails.value.beer_daughter4);
    uploadData.append("otheraddiction_daughter4", this.formQuoteDetails.value.otheraddiction_daughter4);
    uploadData.append("otheraddiction_remark_daughter4", this.formQuoteDetails.value.otheraddiction_remark_daughter4);
    uploadData.append("pincode", this.formQuoteDetails.value.pincode);
    uploadData.append("selected_suminsured", this.formQuoteDetails.value.selected_suminsured);
    uploadData.append("selected_deductible", this.formQuoteDetails.value.selected_deductible);
    uploadData.append("tenure", this.formQuoteDetails.value.tenure);
    return uploadData;
  }

  submitFormQuoteDetails(){
    this.loaderActive = true;
    this.submittedQuoteDetails = true;
    /*
    if (this.formQuoteDetails.invalid){
      this.findInvalidControls();
      Swal.fire("Please fill all mandatory fields", "", "error");
      return;
    }
    */
    //this.loaderActive = true;
    var uploadData: any = this.setParameterForSubmitForm();
    this.healthService
      .submitHealthquoteFormData(uploadData)
      .subscribe((response) => {
        var outputResult: any = response;
        this.loaderActive = false;
        if (outputResult.status) {
          sessionStorage.setItem('unique_reference_no', outputResult.unique_reference_no);
          this.router.navigate(['health-insurance-quote/quotation']);
        } else {
          Swal.fire({title:outputResult.message,icon: 'warning' });
        }
      });
  }

  checkPucAndSubmitForm(uploadData) {
    let pre_date: any = false;
  }

  public findInvalidControls() {
    const invalid = [];
    const form_value = [];
    const controls = this.formQuoteDetails.controls;
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

formValueChange(other_details,event){

  var gender : any =   this.formQuoteDetails.value.gender;
  var  policy_type : any = this.formQuoteDetails.value.policy_type;
  var  policy_sub_types  : any =  this.formQuoteDetails.value.policy_sub_types;

    policy_type = parseInt(policy_type);
    policy_sub_types = parseInt(policy_sub_types);

    //console.log(gender);
    if(gender == "" ){
      event.preventDefault();
      Swal.fire({ title: 'Please select gender first',icon: 'warning' });
    }
    else if(policy_type !== undefined && (isNaN(policy_type) || policy_type < 1 )){
      event.preventDefault();
      //alert('out');
     Swal.fire({ title: 'Please select Policy type first',icon: 'warning' });

    }else if(policy_sub_types !== undefined && (isNaN(policy_sub_types) || policy_sub_types < 1 )){
      event.preventDefault();
      Swal.fire({ title: 'Please select policy sub type first',icon: 'warning' });
    }
    event.stopPropagation();
  }


  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'keyup', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'keydown', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
          this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'mouseup', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
           this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });

    this.renderer.listen('document', 'mousedown', (event) => {
        if (event.target.hasAttribute("select-other-detail")) {
           this.formValueChange(event.target.getAttribute("select-other-detail"),event);
        }
    });
  }

  childplanningYes(){

    this.planning_to_have_a_child = false;
    this.formQuoteDetails.get("planning_duration").setValidators([Validators.required]);
    this.formQuoteDetails.get("planning_duration").updateValueAndValidity();
  }
  childplanningNo(){

    this.planning_to_have_a_child = true;
    this.formQuoteDetails.get("planning_duration").setValidators([]);
    this.formQuoteDetails.get("planning_duration").updateValueAndValidity();
  }

  suffering_from_any_illness_yes(){

    this.suffering_from_any_illness = false;

  }
  suffering_from_any_illness_no(){

    this.suffering_from_any_illness = true;
  }
  any_of_the_members_smoke_yes(){

    this.any_of_the_members_smoke = false;

  }
  any_of_the_members_smoke_no(){

    this.any_of_the_members_smoke = true;
  }

  any_of_the_members_tobaco_yes(){

    this.any_of_the_members_tobaco = false;

  }
  any_of_the_members_tobaco_no(){

    this.any_of_the_members_tobaco = true;
  }

  any_of_the_members_consume_alcohol_yes(){
    this.any_of_the_members_consume_alcohol = false;
  }
  any_of_the_members_consume_alcohol_no(){

    this.any_of_the_members_consume_alcohol = true;
  }

  insured_type_son_numCount(e){

  this.insured_type_son_numarr = [];
    console.log(e.target.value);
  if(e.target.value < 5){
      for(let i = 1; i <= e.target.value; i++) {

      this.insured_type_son_numarr.push(i);
      // this.formQuoteDetails.get("diabetes_son"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("diabetes_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("bloodpressure_son"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("bloodpressure_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("heartdiseases_son"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("heartdiseases_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("other_conditions_son"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("other_conditions_son"+i).updateValueAndValidity();

    }
  }
    else{
      for(let i = 1; i <= e.target.value; i++) {
      // this.formQuoteDetails.get("diabetes_son"+i).setValidators([]);
      // this.formQuoteDetails.get("diabetes_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("bloodpressure_son"+i).setValidators([]);
      // this.formQuoteDetails.get("bloodpressure_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("heartdiseases_son"+i).setValidators([]);
      // this.formQuoteDetails.get("heartdiseases_son"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("other_conditions_son"+i).setValidators([]);
      // this.formQuoteDetails.get("other_conditions_son"+i).updateValueAndValidity();
    }
    }

}


  insured_type_daughter_numCount(e){


  this.insured_type_daughter_numarr = [];
    console.log(e.target.value);
  if(e.target.value < 5){
      for(let i = 1; i <= e.target.value; i++) {

      this.insured_type_daughter_numarr.push(i);
      // this.formQuoteDetails.get("diabetes_daughter"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("diabetes_daughter"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("bloodpressure_daughter"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("bloodpressure_daughter"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("heartdiseases_daughter"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("heartdiseases_daughter"+i).updateValueAndValidity();
      // this.formQuoteDetails.get("other_conditions_daughter"+i).setValidators([Validators.required]);
      // this.formQuoteDetails.get("other_conditions_son"+i).updateValueAndValidity();


      }
    }
      else{
          for(let i = 1; i <= e.target.value; i++) {
          this.formQuoteDetails.get("diabetes_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("diabetes_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("bloodpressure_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("bloodpressure_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("heartdiseases_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("heartdiseases_daughter"+i).updateValueAndValidity();
          this.formQuoteDetails.get("other_conditions_daughter"+i).setValidators([]);
          this.formQuoteDetails.get("other_conditions_daughter"+i).updateValueAndValidity();
        }
      }
  }


  changeOwnerPincode(event){
    var is_vallid :any = this.formQuoteDetails.controls.pincode.status;
    if(event.target.value.length == 6 && is_vallid != "INVALID"){
      //this.formQuoteDetails.patchValue({ pincode : ''});
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('pin_code',event.target.value);
      this.healthService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          console.log(result);
        }else{
          Swal.fire(result.message, '', 'error');
          this.formQuoteDetails.patchValue({
            pincode : "",
          });
        }
      });
    }
  }
}
