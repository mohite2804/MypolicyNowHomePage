import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  base_url = environment.baseUrl;
  mainJsPath = environment.mainJsPath;
  permissionDeniedMsg = environment.permissionDeniedMsg;

  result_banks : any;
  loaderActive: boolean = false;
  loginUserId : any;
  loginUserType : any;
  unique_ref_no : any;
  quote_no : any;
  proposal_no: any;
  proposal_id : any;
  proposal_share_link : any;
  div_show_for_authenticate : boolean = false;
  isAuthenticate  : boolean = true;
  product_type_id : any;
  result_is_free : any;
  is_error: any;
  is_error_message: any;

  is_from_proposal_page :  boolean = true;
  displayForwardProposal : any = 'none';
  formForwardProposal : any;
  submittedForwardProposal :  boolean = false;
  result_proposal_details : any;
  result_payment_types : any;

  success_message: any;
  error_message: any;
  edit_url :any;
  //validation_for_email :any = "^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  is_dealer_url_with_login : boolean = true;

  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {
    //this.loadScripts();
  }

  ngOnInit(): void {
    if(this.router.url == '/share/proposal'){
      this.is_dealer_url_with_login = false;
    }

    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');

    if(this.loginUserType == 5){
      Swal.fire({
        title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })

    }else{

        this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
        this.quote_no  = sessionStorage.getItem('quote_no');
        this.proposal_no  = sessionStorage.getItem('proposal_no');
        this.proposal_id  = sessionStorage.getItem('proposal_id');
        this.product_type_id  = sessionStorage.getItem('product_type_id');



        this.proposal_share_link = "";
        this.is_from_proposal_page = true;

        if(this.proposal_no == "" || this.proposal_no ==  null || this.proposal_no == undefined ){
          this.router.navigateByUrl('/confirm-details');
        }
        this.validateProposal();
        this.getIndex();

    }

  }


  getIndex(){

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('proposal_no',this.proposal_no);
    sendData.append('proposal_share_link',this.proposal_share_link);
    sendData.append('proposal_id',this.proposal_id);

    this.commonService.getProposalDetails(sendData)
    .subscribe(response => {
        this.loaderActive = false;
        var output_result : any = response;
        this.result_proposal_details = output_result.proposal_details;
        this.result_banks = output_result.banks;
        this.result_payment_types = output_result.payment_types;
        this.result_is_free = output_result.is_free;
        var email_1 : any = this.result_proposal_details.proposer_email;
        var mob_1 : any = this.result_proposal_details.proposer_mobile_no
        this.edit_url =  output_result.edit_url;
        sessionStorage.setItem('selected_ic_id', this.result_proposal_details.ic_id);
        sessionStorage.setItem('proposal_id', this.result_proposal_details.proposal_id);

        this.is_error =  output_result.IS_ERROR;
        this.is_error_message = output_result.ERROR_MESSAGE;

        if(this.result_proposal_details.proposer_type_id == 2){
          email_1  = this.result_proposal_details.company_owner_email;
          mob_1  = this.result_proposal_details.company_owner_mobile
        }

        this.formForwardProposal.patchValue({
          email_1 : email_1,
          mob_1 : mob_1
        });
        
        console.log(this.result_is_free);

        if(!output_result.payment_types){
            Swal.fire({ title: 'Payment privileges not assigned! Please contact administrator',icon: 'warning' })
        }
    });
  }

  validateProposal(){
    //
    this.formForwardProposal = this.formBuilder.group({
      email_1 : ['',[Validators.pattern(this.validation_for_email), Validators.required,Validators.email]],
      email_2 : ['',[Validators.pattern(this.validation_for_email),Validators.email]],
      mob_1 : ['',[Validators.pattern(this.validation_for_mobile_no), Validators.required]],
      mob_2 : ['',[Validators.pattern(this.validation_for_mobile_no)]],
    });

  }



  onParentIsAuthenticate(isAuthenticate : boolean){
    this.isAuthenticate = isAuthenticate;
    this.div_show_for_authenticate = !isAuthenticate;

  }




  openForwardProposalModal(){
    this.displayForwardProposal = 'block';
  }

  closePopupForwardProposal(){
    this.displayForwardProposal='none';
    this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  resetFormForwardProposal(){
    this.submittedForwardProposal = false;
    this.formForwardProposal.patchValue({
      email_2 : '',
      mob_2 : ''
    });

  }

  submitFormForwardProposal(){

      this.submittedForwardProposal = true;
      if(this.formForwardProposal.invalid){
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('email_1',this.formForwardProposal.value.email_1);
      sendData.append('email_2',this.formForwardProposal.value.email_2);
      sendData.append('mob_1',this.formForwardProposal.value.mob_1);
      sendData.append('mob_2',this.formForwardProposal.value.mob_2);
      sendData.append('proposal_no',this.proposal_no);

      this.commonService.submitFormForwardProposal(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          outputResult.status
          this.success_message = outputResult.message+' '+outputResult.sms_msg;
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
      this.closePopupForwardProposal();
    }, 2000);

  }

  cancelProposal(){
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('proposal_no',this.proposal_no);
    this.commonService.cancelProposal(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      var outputResult : any = response;
      location.reload();

    });

  }

  downloadProposal(){
    this.downloadFile(this.base_url+'downloadProposal/'+this.result_proposal_details.proposal_share_link);
  }

  downloadFile(download_url){
		window.open(download_url, '_blank');
	}


  loadScripts() {
    //const externalScriptArray = ['/assets/front/js/main.js'];
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


  editProposal(){
    this.router.navigate([this.edit_url]);

  }

}
