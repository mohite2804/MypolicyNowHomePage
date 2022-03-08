import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {

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
  proposal_id :any;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {  }



  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.proposal_id = sessionStorage.getItem('proposal_id');

    this.policy_no = sessionStorage.getItem('policy_no');
    this.policy_id = sessionStorage.getItem('policy_id');;
    this.transaction_no = sessionStorage.getItem('transaction_no');

    if(this.router.url == '/share/thank-you'){
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

      if(this.policy_no == "" || this.policy_no ==  null || this.policy_no == undefined ){
      this.router.navigateByUrl('/home');
      }else{
        this.getIndex();
      }

    }
  }

  getIndex(){
    this.loaderActive = true;

    if(this.policy_id == 'undefined'  ){
      ///alert(this.policy_id+ 'jsldfdskl');
      this.getPolicyIdNyProposalId();
    }else{
     // alert('outt');
      this.getPolicyDetails();
    }

  }

  getPolicyIdNyProposalId(){
    this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('proposal_id',this.proposal_id);
      this.commonService.getPolicyIdNyProposalId(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          sessionStorage.setItem('policy_no', outputResult.policy_no);
          sessionStorage.setItem('policy_id', outputResult.policy_id);
          this.policy_id = outputResult.policy_id;
          this.policy_no = outputResult.policy_no;
          this.getPolicyDetails();
        }

      });
  }


  getPolicyDetails(){
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('policy_id',this.policy_id);
      sendData.append('policy_no',this.policy_no);
      sendData.append('transaction_no',this.transaction_no);
      this.commonService.getThankYouDetails(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          this.result_output_data = outputResult.output_data;
          sessionStorage.removeItem('policy_no');
          sessionStorage.removeItem('transaction_no');
          sessionStorage.removeItem('proposal_no');
          sessionStorage.removeItem('proposal_id');
          sessionStorage.removeItem('quote_no');
          sessionStorage.removeItem('unique_ref_no');
          sessionStorage.removeItem('policy_id');


        }

      });
  }

  downloadPolicy(){
    this.downloadFile(this.base_url+'downloadPolicy/'+this.result_output_data.policy_no);
  }

  downloadFile(download_url){
		window.open(download_url, '_blank');
  }

}
