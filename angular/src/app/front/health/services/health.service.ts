import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable({
  providedIn: 'root'
})

export class HealthService {
  base_url = environment.baseUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private httpClient: HttpClient,public router: Router) { }

  getHealthQuoteFormData(sendData) {
    return this.httpClient.post(this.base_url+'getHealthQuoteFormData',sendData);
  }

  getHealthQuotePolicy(sendData) {
    return this.httpClient.post(this.base_url+'getHealthQuoteType',sendData);
  }

  getHealthQuotesubPolicy(sendData) {
    return this.httpClient.post(this.base_url+'getHealthQuotesubType',sendData);
  }
 

  submitHealthquoteFormData(sendData){
    return this.httpClient.post(this.base_url+'submitHealthquoteFormData',sendData);
  }
  
  getAgerelationData(sendData){
    return this.httpClient.post(this.base_url+'getHealthQuoteagerelation',sendData);
  }

  getHealthQuoteListData(sendData){
    return this.httpClient.post(this.base_url+'getHealthquoteList',sendData);
  }

  getCustomerDetails(sendData){
    return this.httpClient.post(this.base_url+'getCustomerDetails',sendData);
  }

  insertOtherPayment(sendData){
    return this.httpClient.post(this.base_url+'insertOtherPayment',sendData);
  }

  getHealthPolicyData(sendData){
    return this.httpClient.post(this.base_url+'getPolicyDetails',sendData);
  }
  

  submitHealthquoteUpdateFormData(sendData){
    return this.httpClient.post(this.base_url+'HealthquoteUpdate',sendData);
  }

  getHealthCovragedescriptionData(sendData){
    return this.httpClient.post(this.base_url+'covragelistsdescriotion',sendData);
  }

  getHealthCovrageListData(sendData){
    return this.httpClient.post(this.base_url+'HealthcovrageList',sendData);
  }

  getHealthOccupationListData(sendData){
    return this.httpClient.post(this.base_url+'HealthoccupationList',sendData);
  }
  
  getHealthNomineeListData(sendData){
    return this.httpClient.post(this.base_url+'HealthnomineeList',sendData);
  }

  getHealthRelationListData(sendData){
    return this.httpClient.post(this.base_url+'HealthrelationList',sendData);
  }

  submitHealthquoteCustomerFormData(sendData){
    return this.httpClient.post(this.base_url+'HealthInsertcustomerData',sendData);
  }

  sendHealthOtpFormData(sendData){
    return this.httpClient.post(this.base_url+'HealthOtpFormData',sendData);
  }

  insertHealthProposalListData(sendData){
    return this.httpClient.post(this.base_url+'InsertHealthProposalData',sendData);
  }

  getHealthProposalListData(sendData){
    return this.httpClient.post(this.base_url+'GetHealthProposalData',sendData);
  }

  getHealthPincodeData(sendData){
    return this.httpClient.post(this.base_url+'GetHealthPincodeData',sendData);
  }

  downloadproposal(sendData){
    return this.httpClient.post(this.base_url+'HealthproposalDownload',sendData);
  }

  submitHealthOtpFormData(sendData){
    return this.httpClient.post(this.base_url+'SubmitHealthOtpFormData',sendData);
  }
  quoteBuy(sendData) {
    return this.httpClient.post(this.base_url + 'quoteBuy', sendData);
  }
  sendHealthProposalCancel(sendData){
    return this.httpClient.post(this.base_url + 'cancleHealthProposal', sendData);
  }

  getPolicysuminssuered(sendData){
    return this.httpClient.post(this.base_url + 'getsuminssuredtenure', sendData);
  }

  getDeductible(sendData){
    return this.httpClient.post(this.base_url + 'getdeductible', sendData);
  }

  //getdeductible

  getStateCityByPincode(sendData){
    return this.httpClient.post(this.base_url + 'getcheckpincode', sendData);
  }

  getNomineeAge(sendData){
    return this.httpClient.post(this.base_url + 'getnomineeage', sendData); 
  }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }

  submitFormPayment(sendData){
    return this.httpClient.post(this.base_url+'paymentprocess',sendData);
  }

  updateRazorPayStatus(sendData){
    return this.httpClient.post(this.base_url+'updateRazorPay_Status',sendData);
  }

  createRzpayOrder(sendData){
    return this.httpClient.post(this.base_url+'createrayorder',sendData);
  }

  createOtherOrder(sendData){
    return this.httpClient.post(this.base_url+'createOtherOrder',sendData);
  }

  getWalletBallance(sendData){
    return this.httpClient.post(this.base_url+'getWalletBallanceHealth',sendData);
  }

  getThankYouDetailshealth(sendData){
    return this.httpClient.post(this.base_url+'getThankYouDetailshealth',sendData);
  }

  submitFormForwardProposalHealth(sendData){
    return this.httpClient.post(this.base_url+'forwardProposalHealth',sendData);
  }

  getProposalDetails(sendData){
    return this.httpClient.post(this.base_url+'getProposalDetailsHealth',sendData);
  }
  
}
