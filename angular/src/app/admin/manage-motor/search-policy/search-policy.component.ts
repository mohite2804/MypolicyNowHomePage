import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
//import { MotorService } from '../../services/motor.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-search-policy',
  templateUrl: './search-policy.component.html',
  styleUrls: ['./search-policy.component.css']
})
export class SearchPolicyComponent implements OnInit {

  dtOptions: DataTables.Settings[] = [];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;	

  result : any ; 
  formRecodEdit : any;
  formRecodChequEndosment : any;
  submitted : any = false;
  submittedCheque : any = false;
  loaderActive : boolean = false;
  loginUserId : any;	
  policy_id :any;
  resultCheque : any;
  display : any;
  bank_names : any;
  isAtLeastOne : boolean = false;
  atLeastOneRequired : any;


constructor( private commonService : CommonService,public router: Router,private formBuilder: FormBuilder) { }

ngOnInit() {
  this.getBankNames();
  this.loginUserId = sessionStorage.getItem('adminUserId');
  this.dtOptions[0] = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true
  };

  this.formRecodEdit = this.formBuilder.group({
    policy_no : [''],
    proposal_no : [''],
    vehicle_no : [''],
    insured_name : [''],
    insured_mobile_no : [''],
    submit_btn : ['']    
    
  });


  this.formRecodChequEndosment = this.formBuilder.group({
    bank_name : ['',Validators.required],
    branch_city : ['',Validators.required],
    cheque_number : ['',Validators.required],
    cheque_date : ['',Validators.required],
    payment_method : ['',Validators.required],
    policy_id : ['',Validators.required],
    
    
  });
  

}


 submitForm(){
  
  this.submitted = true;

  if( this.formRecodEdit.value.policy_no != '' || 
    this.formRecodEdit.value.proposal_no != '' || 
    this.formRecodEdit.value.vehicle_no != '' || 
    this.formRecodEdit.value.insured_name != '' || 
    this.formRecodEdit.value.insured_mobile_no != ''
    ) {
    console.log('At least one field required......................');
    this.atLeastOneRequired = '';
    //return true; 
  
  } else {
    this.atLeastOneRequired = 'At least one field required';
    console.log('At least one field is required');
    return false;
  }

  this.loaderActive = true;

  // if(this.formRecodEdit.invalid){
  //   return;
  // }
  
  let sendData = new FormData();

  console.log(this.formRecodEdit);

  sendData.append('policy_no',this.formRecodEdit.value.policy_no);
  sendData.append('proposal_no',this.formRecodEdit.value.proposal_no);
  sendData.append('vehicle_no',this.formRecodEdit.value.vehicle_no);
  sendData.append('insured_name',this.formRecodEdit.value.insured_name);
  sendData.append('insured_mobile_no',this.formRecodEdit.value.insured_mobile_no);
  sendData.append('submit_btn',this.formRecodEdit.value.submit_btn);   
  sendData.append('loginUserId',this.loginUserId);

  /*this.motorService.getPolicyByPolicyNo(sendData)
  .subscribe(response => {
    this.loaderActive = false;
    this.result = response;
    if(this.result.status){
      this.result = this.result.result;
    }else{
      this.result = [];
    }
  });*/
}

openModel(policy_id){
  this.policy_id = policy_id;
   console.log('submittedCheque');
  console.log(this.policy_id);
  this.resetFormCheck();    
  this.getChequeDataByPolicyId();
  this.display='block'; 
 
}

closePopup(){
  this.display='none'; 
  this.resetFormCheck();
  this.loaderActive = false;
}

resetFormCheck(){
  this.formRecodChequEndosment.patchValue({    
    policy_id : '0',   
    branch_city : '',
    cheque_number : '',
    cheque_date : '',
    payment_method : '',
    bank_name : ''
      
  });     
  this.submittedCheque = false;
  this.loaderActive = false;
}

getChequeDataByPolicyId(){
  var sendData = new FormData();
  sendData.append('policy_id',this.policy_id);
  /*this.motorService.getChequeDataByPolicyId(sendData)
  .subscribe(response => {
    this.resultCheque = response;
    this.resultCheque = this.resultCheque.result;
    this.setChequeData(this.resultCheque);
  });*/
}

getBankNames(){
  var sendData = new FormData();
  sendData.append('loginUserId',this.loginUserId);
  /*this.motorService.getBankNames(sendData)
  .subscribe(response => {
    this.bank_names = response;
    this.bank_names = this.bank_names.result;
   
  });*/

}

getPolicySummaryByPolicyId(policy_id){
  this.loaderActive = true;
  var sendData = new FormData();
  sendData.append('policy_ids',policy_id);
  /*this.motorService.getPolicySummaryByPolicyId(sendData)
  .subscribe(response => {      
    var resultPolicySummary : any;
    resultPolicySummary = response;
    this.loaderActive = false;
    if(resultPolicySummary.status){  
      this.downloadPolicySummary(resultPolicySummary.download_url); 
     // v(resultPolicySummary.message,  "" ,  "success" );
    }else{          
      //Swal.fire(resultPolicySummary.message,  "" ,  "error" );
    }
  });*/
  
}
  

submitChequeData(){

  //submittedCheque
  this.loaderActive = true;
  this.submittedCheque = true;
  if(this.formRecodChequEndosment.invalid){
    return;
  }
  var sendData = new FormData();
  sendData.append('policy_id',this.formRecodChequEndosment.value.policy_id);
  sendData.append('branch_city',this.formRecodChequEndosment.value.branch_city);
  sendData.append('cheque_number',this.formRecodChequEndosment.value.cheque_number);
  sendData.append('cheque_date',this.formRecodChequEndosment.value.cheque_date);
  sendData.append('payment_method',this.formRecodChequEndosment.value.payment_method);
  sendData.append('bank_name',this.formRecodChequEndosment.value.bank_name);   

  /*this.motorService.submitChequeData(sendData)
  .subscribe(response => {      
    var resultCheque : any;
    resultCheque = response;
    this.loaderActive = false;
    if(resultCheque.status){   
      Swal.fire(resultCheque.message,  "" ,  "success" );
    }else{          
      Swal.fire(resultCheque.message,  "" ,  "error" );
    }
  });*/
  this.closePopup();
}
// // bank_name  branch_city cheque_number cheque_date payment_method policy_id
setChequeData(chequeData){
  console.log(chequeData);
  console.log(chequeData.offline_bank_name);
  this.formRecodChequEndosment.patchValue({      
    'policy_id' : chequeData.policy_id,
    'bank_name' : chequeData.offline_bank_name,
    'branch_city': chequeData.offline_bank_branch,
    'cheque_number': chequeData.offline_cheque_number,
    'cheque_date': chequeData.offline_cheque_date,
    'payment_method': chequeData.payment_method_name
  });

}

submitFormBtnClick(value){
  console.log('submit Value....');
  console.log(value);
  this.formRecodEdit.patchValue({
     submit_btn : value
  });
}




resetForm(){
  this.formRecodEdit.patchValue({
    palicy_no : '',
    proposal_no : '',
    vehicle_no : '',
    insured_name : '',
    insured_mobile_no : ''

  });
}


downloadPolicy(url){
  window.open(url, '_blank');   
}

downloadOldPolicy(url){
  window.open(url, '_blank');   
}

downloadNcbPolicy(url){
  window.open(url, '_blank');   
}

downloadPaCoverPolicy(url){
  window.open(url, '_blank');   
}

downloadProposal(url){
  window.open(url, '_blank');   
}

downloadFeedFile(download_url){
  window.open(download_url, '_blank  ');
}

downloadPolicySummary(download_url){
  window.open(download_url, '_blank  ');
}

redirectEndosment(policy_id,endosment_id){
  this.router.navigate(['/admin/policy-details/'+policy_id+'/'+endosment_id+'/0'])

}

redirectCancelPolicy(proposal_id){
  console.log('/admin/policy-details-cancel/'+proposal_id);
  this.router.navigate(['/admin/policy-details-cancel/'+proposal_id])
}

ShowEndorsement(policy_id){
  console.log('/admin/manage-policies/endorsement/'+policy_id);
  this.router.navigate(['/admin/manage-policies/endorsement/'+policy_id])
}







}
