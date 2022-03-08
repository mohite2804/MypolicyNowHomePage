import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
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
  getCssLogoByUrl(sendData){
    return this.httpClient.post(this.base_url+'getCssLogoByUrl',sendData);
  }

  validateUserLoginStatus(sendData){
    return this.httpClient.post(this.base_url+'check_user_login_status',sendData);
  }

  getFilterListData(){
    return this.httpClient.get(this.base_url+'getFilterListDataHealth');
  }

  getPolicySubTypeData(){
    return this.httpClient.get(this.base_url+'getpolicysubtypesdataHealth');
  }

  getPolicySubTypesOfPolicyType(sendData){
    return this.httpClient.post(this.base_url+'getpolicysubtypesforpolicytypedataHealth',sendData);
  }

  submitFormForwardPolicy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/submitFormForwardPolicyHealth',sendData);
  }

  exportPolicyData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportPolicyDataHealth',sendData);
  }

  getActivityLog(sendData){
    return this.httpClient.post(this.base_url+'get-activity-log-Health',sendData);
  }

  submitFormForwardQuote(sendData){
    return this.httpClient.post(this.base_url+'submitFormForwardQuoteHealth',sendData);
  }

  submitFormSmsForwardQuote(sendData){
    return this.httpClient.post(this.base_url+'submitFormSmsForwardQuoteHealth',sendData);
  }

  exportProposalData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportProposalDataHealth',sendData);
  }

  submitFormForwardProposal(sendData){
    return this.httpClient.post(this.base_url+'forwardProposalHealth',sendData);
  }

  cancelProposal(sendData){
    return this.httpClient.post(this.base_url+'cancelProposalHealth',sendData);
  }

}
