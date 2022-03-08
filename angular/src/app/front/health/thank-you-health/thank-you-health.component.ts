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
  selector: 'app-thank-you-health',
  templateUrl: './thank-you-health.component.html',
  styleUrls: ['./thank-you-health.component.css']
})
export class ThankYouHealthComponent implements OnInit {
  base_url = environment.baseUrl;
  permissionDeniedMsg = environment.permissionDeniedMsg;
  loaderActive: boolean = false;
  loginUserId : any;
  loginUserType : any;
  policy_no : any;
  policy_id : any;
  transaction_no : any;
  result_output_data : any;
  is_dealer_url_with_login : boolean = true;
  selectedproducttypeid: any;
  buy_policy_unique_id:any;
  buy_policy_id:any;
  policyList:any;
  policylogo:any;
  userQuotedetails:any;
  constructor(private healthService: HealthService,public router: Router,private formBuilder: FormBuilder) {  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.selectedproducttypeid = sessionStorage.getItem(
      "selected_product_type_id"
    );
    this.buy_policy_id = sessionStorage.getItem("quote_data_health_id");
    this.buy_policy_unique_id = sessionStorage.getItem("buy_policy_unique_id");

    if(this.router.url == '/share/thank-you-health'){
      this.is_dealer_url_with_login = false;
    }else{

    }

    if(this.loginUserType == 5){
      Swal.fire({
        title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })

    }else{
      this.policy_no = sessionStorage.getItem('policy_no');
      this.policy_id = sessionStorage.getItem('policy_id');
      if(this.policy_no == "" || this.policy_no ==  null || this.policy_no == undefined ){
        this.router.navigateByUrl('/home');
      }else{
        this.getIndex();
      }

    }
  }

  getIndex(){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append("loginUserId", this.loginUserId);
      sendData.append("selectedproducttypeid", this.selectedproducttypeid);
      sendData.append("loginUserType", this.loginUserType);
      sendData.append("quote_data_health_id", this.buy_policy_id);
      sendData.append("unique_reference_no", this.buy_policy_unique_id);
      sendData.append("policy_id", this.policy_id);
      sendData.append("policy_no", this.policy_no);
      this.healthService.getHealthPolicyData(sendData).subscribe((res) => {
          var result: any = res;
        this.loaderActive = false;        
        this.policyList = result.result.policy_list[0];
        this.policylogo = result.result.policy_list[0].logo;
        this.userQuotedetails = result.result.user_data.user_action_data;
        this.getpolicydata();
    });
  } 

  getpolicydata()
  {
    this.loaderActive = true;
    const sendData = new FormData();
      sendData.append('policy_id',this.policy_id);
      sendData.append('policy_no',this.policy_no);
      this.healthService.getThankYouDetailshealth(sendData)
      .subscribe(response =>{
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){
          this.result_output_data = outputResult.output_data;
          if(this.router.url == '/share/thank-you-health'){
          }
          else 
          {
            sessionStorage.removeItem('policy_no');
            sessionStorage.removeItem('transaction_no');
            sessionStorage.removeItem('proposal_no');
            sessionStorage.removeItem('quote_no');
            sessionStorage.removeItem('unique_ref_no');
            sessionStorage.removeItem('policy_id');
            sessionStorage.removeItem('buy_policy_id'); 
            sessionStorage.removeItem('buy_policy_unique_id'); 
            sessionStorage.removeItem('quote_data_health_id');
            sessionStorage.removeItem('quote_unique_reference_no');
            sessionStorage.removeItem('product_type_id');  
          }
          
        }else{

        }

      });
  }

  downloadPolicy(){
    this.downloadFile(this.base_url+'downloadPolicyhealth/'+this.result_output_data.policy_no);
  }

  downloadFile(download_url){
		window.open(download_url, '_blank');
  }

}