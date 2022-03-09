import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';

import { CustomvalidationService } from '../services/customvalidation.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { ComissionUploadComponent } from 'src/app/admin/manage-common/comission-upload/comission-upload.component';

@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.css']
})
export class ConfirmDetailsComponent implements OnInit {
  permissionDeniedMsg = environment.permissionDeniedMsg;
  result_quote_data : any;
  loaderActive: boolean = false;
  loginUserId : any;
  loginUserType : any;
  unique_ref_no : any;
  quote_no : any;
  result : any;
  token  : any;
  is_dealer_url_with_login : boolean = true;

  product_type_id : any;
  is_breakin : any;
  bike_breakin_days : any;
  selected_ic_id : any ;
  result_selected_product_data : any;

  formPanCard :any;
  success_message : any;
  error_message : any;
  submittedPancard : boolean = false;

  displayPancadModel : any = 'none';


  validation_for_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_company_pan :any = "^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$";
  validation_for_gst_no :any         = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  validation_for_company_gst_no :any = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  is_valid_pan : boolean = false;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private customvalidationService: CustomvalidationService,) {  }

  ngOnInit(): void {
    console.log('validateUserLoginStatus :- ');
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.selected_ic_id = sessionStorage.getItem('selected_ic_id');
    this.token = sessionStorage.getItem("user_token");

    if(this.router.url == '/share/confirm-details'){
      this.is_dealer_url_with_login = false;
    }else{
      this.validateUserLoginStatus(this.loginUserId,this.token);
    }


    console.log('this.is_dealer_url_with_login '+this.is_dealer_url_with_login);
    this.createPanCardForm();

    if(this.loginUserType == 5){
      Swal.fire({
         title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })

    }else{
      this.loaderActive = true;
      this.unique_ref_no  = sessionStorage.getItem('unique_ref_no');
      this.quote_no  = sessionStorage.getItem('quote_no');

      if(this.quote_no == "" || this.quote_no ==  null || this.quote_no == undefined ){
        this.router.navigateByUrl('/quotation');
      }else{
        this.getIndex();
      }


    }




  }

  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        this.result = response;
       // this.loaderActive = false;
        if(this.result.status){
          //valid status i.e. not login from another location
        }else{
          Swal.fire({position: 'center',icon: 'error',title: "Please try again.", showConfirmButton: false, timer: 3000 });
        }



      });
  }

  getIndex(){
    console.log('loaderActive :- ');
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('quote_no',this.quote_no);
    sendData.append('selected_ic_id',this.selected_ic_id);

    this.commonService.getConfirmDetails(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any = response;
      this.result_quote_data = output_result.quote_data;
      this.result_selected_product_data = output_result.selected_product_type_details;
    console.log('result_quote_data :- ');
     console.log(this.result_quote_data.make);
      this.product_type_id = output_result.quote_data.product_type_id;
      this.is_breakin = output_result.quote_data.is_breakin;
      this.bike_breakin_days = output_result.quote_data.bike_breakin_days;
      //this.setFormData();
      //this.createPanCardForm();
    });
  }



  generateProposal(){


    console.log('is_valid_pan');
    console.log(this.is_valid_pan);
    if(this.is_valid_pan){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('quote_no',this.quote_no);
      sendData.append('selected_ic_id',this.selected_ic_id);
      this.commonService.generateProposal(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        var output_result : any  = response;
        if(output_result.status){

          if(output_result.proposal_no != ''){
            sessionStorage.setItem('proposal_no', output_result.proposal_no);
            if(output_result.proposal_id){
              sessionStorage.setItem('proposal_id', output_result.proposal_id);
            }

            if(this.router.url == '/share/confirm-details'){
              console.log('renew proposal')
              this.router.navigateByUrl('/share/proposal');
            }else{
              console.log('proposal')
              this.router.navigateByUrl('/proposal');
            }


          }else{
            if(this.router.url == '/share/confirm-details'){
              console.log('renew quotation')
              this.router.navigateByUrl('/share/quotation');
            }else{
              console.log('quotation')
              this.router.navigateByUrl('/quotation');
            }
          }

        }else{
          Swal.fire({
            title: output_result.message,
            confirmButtonText: `OK`
          });
        }

      });
    }


  }


  editConfirmDetailPage(){



    if(this.router.url == '/share/confirm-details'){
      this.router.navigate(['/share/customer-detail-motor']);
    }else{

      if(this.result_quote_data.is_quick_quote == 0 || this.result_quote_data.is_quick_quote == '0'){
        this.router.navigate(['/'+this.result_selected_product_data.full_quote_nex_url]);
      }else{
        this.router.navigate(['/customer-detail-motor']);
      }
    }
  }


  submitPancard(){
    this.submittedPancard = true;
    if(this.formPanCard.invalid){
      return;
    }
    console.log(this.formPanCard);
    console.log("company_gst_no: "+this.formPanCard.value.company_gst_no);
    console.log("company_pan_no: "+this.formPanCard.value.company_pan_no);
    console.log("unique_ref_no: "+this.unique_ref_no);


    this.loaderActive = true;
    var sendData = new FormData();
    console.log(this.formPanCard);
    sendData.append('company_gst_no',this.formPanCard.value.company_gst_no);
    sendData.append('company_pan_no',this.formPanCard.value.company_pan_no);

    sendData.append('proposer_pan_no',this.formPanCard.value.proposer_pan_no);
    sendData.append('proposer_gst_no',this.formPanCard.value.proposer_gst_no);

    sendData.append('unique_ref_no',this.unique_ref_no);


    this.commonService.UpdatePanCard(sendData)
    .subscribe(response => {
      
      this.closePopupPancard();
        var outputResult : any = response;
        this.loaderActive = false;
        if(outputResult.status){
          this.is_valid_pan = true;
          
          Swal.fire(outputResult.message, '', 'success');
          this.getIndex();
        }else{
          this.is_valid_pan = false;
          Swal.fire(outputResult.message, '', 'error');
        }
    });
  }

  checkPancardRequiredOrNot(){
    console.log("this.result_quote_data..................................");
    console.log(this.result_quote_data);
    let amount = parseInt (this.result_quote_data.gross_premium);
    let proposer_type_id = parseInt (this.result_quote_data.proposer_type_id);

    console.log(this.result_quote_data.proposer_pan_no);
      console.log(this.result_quote_data.company_pan_no);

    let proposer_pan_no =  this.result_quote_data.proposer_pan_no;
    let company_pan_no =  this.result_quote_data.company_pan_no;

    let proposer_gst_no =  this.result_quote_data.proposer_gst_no;
    let company_gst_no =  this.result_quote_data.company_gst_no;

    //amount =60000;

    if(amount > 50000){
      console.log("pan no :"+this.result_quote_data.proposer_pan_no);
      console.log("company_pan_no no :"+this.result_quote_data.company_pan_no);
      console.log('1111111111');
      console.log("proposer_type_id: "+proposer_type_id);
      console.log("proposer_pan_no: "+proposer_pan_no);
      console.log("proposer_gst_no: "+proposer_gst_no);
      console.log("company_gst_no: "+company_gst_no);
      console.log("company_pan_no: "+company_pan_no);
      console.log('1111111111');

      if(proposer_type_id === 1 && (proposer_pan_no == 0 || proposer_pan_no == "" || proposer_pan_no == null)){
        console.log("proposer_type_id inn "+ proposer_type_id);

        this.formPanCard.get("proposer_pan_no").setValidators(Validators.required,this.validation_for_pan);
        this.formPanCard.get("proposer_pan_no").updateValueAndValidity();
        this.openPancardModal();

      }else if(proposer_type_id === 2 && (company_pan_no == 0 || company_pan_no == "" || company_pan_no == null)){
        console.log("proposer_type_id out "+ proposer_type_id);

        this.formPanCard.get("company_pan_no").setValidators(Validators.required,this.validation_for_pan);
        this.formPanCard.get("company_pan_no").updateValueAndValidity();


        this.openPancardModal();

      }else{

        this.is_valid_pan = true;
        this.generateProposal();
      }


    }else{
      this.is_valid_pan = true;
      this.generateProposal();
    }
    //this.setFormData();

    //return this.is_valid_pan;
  }



  setFormData(){

    this.formPanCard.patchValue({
      proposer_pan_no : (this.result_quote_data.proposer_pan_no != 0) ? this.result_quote_data.proposer_pan_no : '',
      proposer_gst_no : (this.result_quote_data.proposer_gst_no != 0) ? this.result_quote_data.proposer_gst_no : '',
      company_gst_no : (this.result_quote_data.company_gst_no != 0) ? this.result_quote_data.company_gst_no : '',
      company_pan_no : (this.result_quote_data.company_pan_no != 0) ? this.result_quote_data.company_pan_no : ''

    });




  }

  createPanCardForm(){

    this.formPanCard = this.formBuilder.group({
      proposer_pan_no : [''],
      proposer_gst_no : [''],
      company_gst_no : [''],
      company_pan_no : ['']
    }, {validator: [this.customvalidationService.checkCompanyGstMatchWithPan,this.customvalidationService.checkOwnerGstForIsuzuMatchWithPan] });


  }

  openPancardModal(){
    this.displayPancadModel = 'block';
    this.setFormData();
  }

  closePopupPancard(){
    console.log('closePopupPancard...');
    this.displayPancadModel='none';
    this.resetFormPancard();
    this.loaderActive = false;
  }

  resetFormPancard(){
    this.submittedPancard = false;
    this.formPanCard.patchValue({
      proposer_pan_no : '',
      proposer_gst_no : '',
      company_gst_no : '',
      company_pan_no : ''
    });

    console.log(this.formPanCard);
    console.log('resetFormPancard');

  }


}
