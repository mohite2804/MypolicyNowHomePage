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
export class CommonService {


  base_url = environment.baseUrl;




  constructor(@Inject(PLATFORM_ID) private platformId: object, private httpClient: HttpClient,public router: Router) { }

  changeStatusByRefundId(sendData){
    return this.httpClient.post(this.base_url+'changeStatusByRefundId',sendData);
  }

  getFundAccountDetails(sendData){
    return this.httpClient.post(this.base_url+'getFundAccountDetails',sendData);
  }

  createFundAccount(sendData){
    return this.httpClient.post(this.base_url+'createFundAccount',sendData);
  }

  withdrawAmountFromWallet(sendData){
    return this.httpClient.post(this.base_url+'withdrawAmountFromWallet',sendData);
  }

  checkOrderStatusByOrderId(sendData){
    return this.httpClient.post(this.base_url+'checkOrderStatusByOrderId',sendData);
  }


  returnAmountTocustomer(sendData){
    return this.httpClient.post(this.base_url+'returnAmountTocustomer',sendData);
  }

  getCssLogoByUrl(sendData){
    return this.httpClient.post(this.base_url+'getCssLogoByUrl',sendData);
  }

  UpdatePanCard(sendData){
    return this.httpClient.post(this.base_url+'UpdatePanCard',sendData);
  }

  getCommercialTypes(sendData){
    return this.httpClient.post(this.base_url+'getCommercialTypes',sendData);
  }

  getTickerList(sendData){
    return this.httpClient.post(this.base_url+'getTickerList',sendData);
  }

  updateStatusApproveToPending(sendData){
    return this.httpClient.post(this.base_url+'updateStatusApproveToPending',sendData);
  }

  changesAddonsByIcWise(sendData){
    return this.httpClient.post(this.base_url+'update-addons',sendData);
  }

  changesIDVByIcWise(sendData){
    return this.httpClient.post(this.base_url+'update-idv',sendData);
  }

  getProductListForHomePage(sendData){
    return this.httpClient.post(this.base_url+'getProductListForHomePage',sendData);
  }

  getModelByMakeId(sendData){
    return this.httpClient.post(this.base_url+'getModelByMakeId',sendData);
  }
getModelsByMakeId(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getModelsByMakeId',sendData);
  }
  linkSendToCustomer(sendData){
    return this.httpClient.post(this.base_url+'linkSendToCustomer',sendData);
  }

  getWalletStatement(sendData){
    return this.httpClient.post(this.base_url+'getWalletStatement',sendData);
  }
  getRozarpayWalletStatement(sendData){
    return this.httpClient.post(this.base_url+'getRozarpayWalletStatement',sendData);
  }
  getRozarpayWalletExport(sendData){
    return this.httpClient.post(this.base_url+'getRozarpayWalletExport',sendData);
  }

  updateWalletPayStatus(sendData){
    return this.httpClient.post(this.base_url+'updateWalletPayStatus',sendData);
  }

  submitPrivileges(sendData){
    return this.httpClient.post(this.base_url+'submitPrivileges',sendData);
  }

  transferToCustomerAccount(sendData){
    return this.httpClient.post(this.base_url+'transferToCustomerAccount',sendData);
  }

  generateOrderId(sendData){
    return this.httpClient.post(this.base_url+'generateOrderId',sendData);
  }

  getDetailsUserPrivilege(sendData){
      return this.httpClient.post(this.base_url+'get_user_privileges_details',sendData);
  }

  changeStatuseByUserId(sendData){
    return this.httpClient.post(this.base_url+'update_status_user_id',sendData);
  }

  getUserDataById(sendData){
    return this.httpClient.post(this.base_url+'get_userby_id',sendData);
  }

  addWalletAccount(sendData){
    return this.httpClient.post(this.base_url+'addWalletAccount',sendData);
  }

  createRzpayOrderForAddAmountInWallet(sendData){
    return this.httpClient.post(this.base_url+'createRzpayOrderForAddAmountInWallet',sendData);
  }

  getWalletDetails(sendData){
    return this.httpClient.post(this.base_url+'getWalletDetails',sendData);
  }
  createWalletAccount(sendData){
    return this.httpClient.post(this.base_url+'createWalletAccount',sendData);
  }

  get nativeWindow(): any {

    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }

  submitFormProfileImage(sendData: FormData){
    return this.httpClient.post(this.base_url+'submitFormProfileImage',sendData);
  }

  checkDuplicatechassisNo(sendData: FormData) {
    return this.httpClient.post(this.base_url+'checkDuplicatechassisNo',sendData);
  }

  setModelsByProductMake(sendData){
     return this.httpClient.post(this.base_url+'setModelsByProductMake',sendData);
  }

  nominee_relationType(sendData){
     return this.httpClient.post(this.base_url+'nominee_relationType',sendData);
  }

  submitFormSmsForwardQuote(sendData){
    return this.httpClient.post(this.base_url+'submitFormSmsForwardQuote',sendData);
  }

  submitFormForwardQuoteSms(sendData){
    return this.httpClient.post(this.base_url+'submitFormSmsForwardQuote',sendData);
  }

  submitFormForwardQuote(sendData){
    return this.httpClient.post(this.base_url+'submitFormForwardQuote',sendData);
  }

  submitFormCancelPolicy(sendData){
    return this.httpClient.post(this.base_url+'submitFormCancelPolicy',sendData);
  }

  getShareQuoteDataList(sendData){
    return this.httpClient.post(this.base_url+'getShareQuoteDataList',sendData);
  }

  renewPolicyGenerateQuote(sendData){
    return this.httpClient.post(this.base_url+'renewPolicyGenerateQuote',sendData);
  }

  getRenewPolicyDataList(sendData){
    return this.httpClient.post(this.base_url+'getRenewPolicyDataList',sendData);
  }

  getThankYouDetails(sendData){
    return this.httpClient.post(this.base_url+'getThankYouDetails',sendData);
  }

  downloadProposal(sendData){
    return this.httpClient.post(this.base_url+'downloadProposal',sendData);
  }

  createRzpayOrder(sendData){
    return this.httpClient.post(this.base_url+'create_ray_order',sendData);
  }

  updateRazorPayStatus(sendData){
    return this.httpClient.post(this.base_url+'updateRazorPayStatus',sendData);
  }

  getWalletBallance(sendData: FormData) {
    return this.httpClient.post(this.base_url+'getWalletBallance',sendData);
  }

  getPolicyIdNyProposalId(sendData){
    return this.httpClient.post(this.base_url+'getPolicyIdNyProposalId',sendData);
  }

  submitFormPayment(sendData){
    return this.httpClient.post(this.base_url+'payment_process',sendData);
  }

  submitFormOrientalPayment(sendData){
    return this.httpClient.post(this.base_url+'get-oriental-payment-string',sendData);
  }

  submitNewUser(sendData){
    return this.httpClient.post(this.base_url+'add_new_sdp_details',sendData);
  }

  updateUser(sendData){
    return this.httpClient.post(this.base_url+'update_user_details',sendData);
  }

  wallettransactionsData(sendData){
    return this.httpClient.post(this.base_url+'wallettransactionsData',sendData);
  }

  cancellationReportData(sendData){
    return this.httpClient.post(this.base_url+'cancellationReportData',sendData);
  }

  onlinetransactionsData(sendData){
    return this.httpClient.post(this.base_url+'onlinetransactionsData',sendData);
  }
  PolicytransactionsData(sendData){
    return this.httpClient.post(this.base_url+'PolicytransactionsData',sendData);
  }

  LoadMoreQuotes(sendData){
    return this.httpClient.post(this.base_url+'LoadMoreQuotes',sendData);
  }
  sendOtpForAuthenticate(sendData){
    return this.httpClient.post(this.base_url+'sendOtpForAuthenticate',sendData);
  }
  submitFormAuthenticate(sendData){
     return this.httpClient.post(this.base_url+'submitFormAuthenticate',sendData);
  }
  getProposalDetails(sendData){
     return this.httpClient.post(this.base_url+'getProposalDetails',sendData);
  }
  getQuoteDetails(sendData){
     return this.httpClient.post(this.base_url+'getQuoteDetails',sendData);
  }


  buyPolicy(sendData){
     return this.httpClient.post(this.base_url+'buyPolicy',sendData);
  }

  generateProposal(sendData){
     return this.httpClient.post(this.base_url+'generate_proposal',sendData);
  }

  getConfirmDetails(sendData){
    return this.httpClient.post(this.base_url+'get_confirm_details',sendData);
  }

  getHomeDetails(){
  return this.httpClient.get(this.base_url+'get_home_details');
  }

  getQuotation(sendData){
    return this.httpClient.post(this.base_url+'getQuotation',sendData);
  }

  getQuation(sendData){
    return this.httpClient.post(this.base_url+'getQuotation',sendData);
  }

  submitFormSearchDetails(sendData){
    return this.httpClient.post(this.base_url+'getQuoteFormSearchData',sendData);
  }

  getVariantsByModelId(sendData){
    return this.httpClient.post(this.base_url+'get_variants_by_id',sendData);
  }

  getVariantByModelId(sendData){
    return this.httpClient.post(this.base_url+'myaccount/get_variants_by_id',sendData);
  }

  getQuoteFormData(sendData){
    return this.httpClient.post(this.base_url+'get_quote_form_data',sendData);
  }

  submitFormCustomerDetails(sendData){
    return this.httpClient.post(this.base_url+'submitFormCustomerDetails',sendData);
  }

  submitFormQuoteDetails(sendData){
    return this.httpClient.post(this.base_url+'quick_quote',sendData);
  }

  submitFullFormQuoteDetails(sendData){
      return this.httpClient.post(this.base_url+'generate_quote',sendData);


  }

  submitAllFormQuoteDetails(is_quick_quote,sendData){
    if(is_quick_quote){
      return this.httpClient.post(this.base_url+'quick_quote',sendData);
    }else{
      return this.httpClient.post(this.base_url+'generate_quote',sendData);
    }

  }

  submitQuoteFilterDetails(sendData){
    return this.httpClient.post(this.base_url+'update_quote',sendData);
  }

  quoteBuy(sendData){
    return this.httpClient.post(this.base_url+'quoteBuy',sendData);
  }

  submitLogin(sendData){
    return this.httpClient.post(this.base_url+'get_user_login',sendData);
  }

  submitChangePassword(sendData){
    return this.httpClient.post(this.base_url+'submitChangePassword',sendData);
  }

  submitForgotPassword(sendData){
    return this.httpClient.post(this.base_url+'submitForgotPassword',sendData);
  }

  getDashboardData(sendData){
    return this.httpClient.post(this.base_url+'getDashboardData',sendData);
  }


  getDashboardQuate(sendData){
      return this.httpClient.post(this.base_url+'get_dashboard_quate',sendData);
  }

  getWalletTransactions(sendData){
    return this.httpClient.post(this.base_url+'getWalletTransactions',sendData);
  }
  getCancellationreport(sendData){
    return this.httpClient.post(this.base_url+'getCancellationreport',sendData);
  }

  getPolicyTransactions(sendData){
    return this.httpClient.post(this.base_url+'getPolicyTransactions',sendData);
  }
  getOnlineTransactions(sendData){
    return this.httpClient.post(this.base_url+'getOnlineTransactions',sendData);
  }

  // submitCancelPolicyFilterDetails(sendData){
  //     return this.httpClient.post(this.base_url+'get_cancel_policy_data',sendData);
  // }


  submitFormAddDisposition(sendData){
      return this.httpClient.post(this.base_url+'addRenewalDisposition',sendData);
  }

  getRenewalPolicies(sendData){
      return this.httpClient.post(this.base_url+'getRenewalPolicies',sendData);
  }

  getGreetingImagesData(sendData){
      return this.httpClient.post(this.base_url+'getGreetingImagesData',sendData);
  }


  getCreativeImagesData(sendData){
      return this.httpClient.post(this.base_url+'getCreativeImagesData',sendData);
  }

  getCreativeImagesDataSubmit(sendData){
      return this.httpClient.post(this.base_url+'getCreativeImagesDataSubmit',sendData);
  }

  getGenerateCreativeImagesData(sendData){
      return this.httpClient.post(this.base_url+'getGenerateCreativeImagesData',sendData);
  }


  getPolicyRenewalCount(sendData){
    return this.httpClient.post(this.base_url+'getPolicyRenewalCount',sendData);
  }

  getBankData(){
    return this.httpClient.get(this.base_url+'getbanklist');
  }

  getPolicyCancellationSubReasonData(){
    return this.httpClient.get(this.base_url+'getPolicyCancellationSubReasonData');
  }

  getHistoryByOlicyId(sendData){
    return this.httpClient.post(this.base_url+'getHistoryByOlicyId',sendData);
  }

  getQueryFormData(sendData){
    return this.httpClient.post(this.base_url+'get_query_form_data',sendData);
  }

  getWalletFilterData(sendData){
    return this.httpClient.post(this.base_url+'getWalletFilterData',sendData);
  }
  getCancellationReportFilterData(sendData){
    return this.httpClient.post(this.base_url+'getCancellationReportFilterData',sendData);
  }

  getProfileData(sendData){
    return this.httpClient.post(this.base_url+'get_profile_data',sendData);
  }

  getQuerySubTypeByQueryTypeId(sendData){
    return this.httpClient.post(this.base_url+'getQuerySubTypeByQueryTypeId',sendData);
  }

  getUserSubTypeByUserTypeId(sendData){
    return this.httpClient.post(this.base_url+'getUserSubTypeByUserTypeId',sendData);
  }

  changeStatusByUserId(sendData){
    return this.httpClient.post(this.base_url+'changeStatus_UserId',sendData);
  }

  submitNewQuery(sendData){
    return this.httpClient.post(this.base_url+'submit_new_query',sendData);
  }

  getQueryDataByQueryNo(sendData){
    return this.httpClient.post(this.base_url+'get_query_details',sendData);
  }

  submitCloseQuery(sendData){
    return this.httpClient.post(this.base_url+'submit_close_query',sendData);
  }


  getIcList(){
    return this.httpClient.get(this.base_url+'getIcList');
  }

  submitRenewalPolicyEmail(sendData){
    return this.httpClient.post(this.base_url+'submitRenewalEmail',sendData);
  }

  submitRenewalPolicySms(sendData){
    return this.httpClient.post(this.base_url+'submitRenewalPolicySms',sendData);
  }

  checkLoginPasswordChanged(sendData){
    return this.httpClient.post(this.base_url+'check_user_login_password_change_status',sendData);
  }

  validateUserLoginStatus(sendData){
    return this.httpClient.post(this.base_url+'check_user_login_status',sendData);
  }

  getCancelPolicyDetailsForm(sendData){
    return this.httpClient.post(this.base_url+'getCancelPolicyDetails',sendData);
  }

  checkPolicyExist(sendData){
    return this.httpClient.post(this.base_url+'checkPolicyExist',sendData);
  }

  /////// endorsement

  submitEndorsmentPaymentDetails(sendData){
      return this.httpClient.post(this.base_url+'submit_endorsement_payment',sendData);
  }

  /////// Activity Log

  getActivityLog(sendData){
    return this.httpClient.post(this.base_url+'get-activity-log',sendData);
  }


  //notifications
  getUnreadNotificationCount(sendData: FormData) {
    return this.httpClient.post(this.base_url+'getUnreadNotificationCount',sendData);
  }

  getLastThreeNotifications(sendData: FormData) {
    return this.httpClient.post(this.base_url+'getLastThreeNotifications',sendData);
  }

  getNotificationById(sendData){
    return this.httpClient.post(this.base_url+'getNotificationById',sendData);
  }
  ////// Brekin

  getWalletStatementData(sendData){
    return this.httpClient.post(this.base_url+'admin/getWalletStatementData',sendData);
  }

  getPolicyStatementData(sendData){
    return this.httpClient.post(this.base_url+'admin/getPolicyStatementData',sendData);
  }


  //////////////endorsement refund



  submitFormEndorsementCustomerBankDetail(sendData){
      return this.httpClient.post(this.base_url+'submitFormEndorsementCustomerBankDetail',sendData);
  }


  ///////////Rewamp

  //////Common
  getFilterListData(){
    return this.httpClient.get(this.base_url+'getFilterListData');
  }

  getIcData(){
    return this.httpClient.get(this.base_url+'geticsdata');
  }

  getcolordata(){
    return this.httpClient.get(this.base_url+'getcolordata');
  }

  getProductData(){
    return this.httpClient.get(this.base_url+'getproductsdata');
  }

  getPolicyTypeData(){
    return this.httpClient.get(this.base_url+'getpolicytypesdata');
  }

  getPolicySubTypeData(){
    return this.httpClient.get(this.base_url+'getpolicysubtypesdata');
  }

  getPolicySubTypesOfPolicyType(sendData){
    return this.httpClient.post(this.base_url+'getpolicysubtypesforpolicytypedata',sendData);
  }

  getPolicySubTypesOfProductName(sendData){
    return this.httpClient.post(this.base_url+'getpolicysubtypesforproductname',sendData);
  }

  getEndorsementListData(){
    return this.httpClient.get(this.base_url+'getEndorsementListData');
  }

  getCancellationTypeListData(){
    return this.httpClient.get(this.base_url+'getCancellationTypeListData');
  }

  getBankDetails(sendData){
    return this.httpClient.post(this.base_url+'getbankdetailsbyifsc',sendData);
  }

  getStateCityByPincode(sendData){
    return this.httpClient.post(this.base_url+'get_state_city_by_pincode',sendData);
  }

  ////Sold policy
  submitFormForwardPolicy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/submitFormForwardPolicy',sendData);
  }
  GetDealerCheque(sendData){
    return this.httpClient.post(this.base_url+'myaccount/get_dealer_cheque',sendData);
  }
  POSTDealerCheque(sendData){
    return this.httpClient.post(this.base_url+'myaccount/post_dealer_cheque',sendData);
  }
  getpolicyamount(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getpolicyamount',sendData);
  }
  exportPolicyData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportPolicyData',sendData);
  }

  exportRenewPolicyData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportRenewPolicyData',sendData);
  }

  //////Proposal
  submitFormForwardProposal(sendData){
    return this.httpClient.post(this.base_url+'forwardProposal',sendData);
  }

  cancelProposal(sendData){
    return this.httpClient.post(this.base_url+'cancelProposal',sendData);
  }

  exportProposalData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportProposalData',sendData);
  }

  ////Endorsement
  exportEndorsementData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportEndorsementData',sendData);
  }

  getEndorsementDataById(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getEndorsementDataById',sendData);
  }

  submitEndorsmentFilterDetails(sendData){
      return this.httpClient.post(this.base_url+'myaccount/get_endorsement_data',sendData);
  }

  submitEndorsmentData(sendData){
      return this.httpClient.post(this.base_url+'myaccount/get_single_endorsement_data',sendData);
  }

  checkEndorsementCharges(sendData){
    return this.httpClient.post(this.base_url+'myaccount/checkEndorsementCharges',sendData);
  }

  submitFormEditName(sendData){
      return this.httpClient.post(this.base_url+'myaccount/updateEndorsementName',sendData);
  }

  submitFormEditBifuel(sendData){
    return this.httpClient.post(this.base_url+'myaccount/updateBifuel',sendData);
}

  updatePublicEndorsement(sendData){
      return this.httpClient.post(this.base_url+'myaccount/updatePublicEndorsementName',sendData);
  }

  /*======== Policy Renewal Data ==========*/
  submitUploadRenewalPolicy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/uploadpolicy_renewal',sendData);
  }
  processCsvFile(sendData){
    return this.httpClient.post(this.base_url+'admin/process_CsvFile',sendData);
  }
  getSampleCsvPath(){
    return this.httpClient.get(this.base_url+'admin/getSampleCsvPath');
  }
  ProcessUploadRenewalPolicy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/process_policy_data',sendData);
  }
  UpdateRenewalPolicy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/update_renewal_policy',sendData);
  }

  getVehileMakeByID(sendData){
    return this.httpClient.post(this.base_url+'myaccount/get_Vehile_MakeByID',sendData);
  }

  getVehileModalByID(sendData){
    return this.httpClient.post(this.base_url+'myaccount/get_Vehile_ModalByID',sendData);
  }

  getMakeData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getmake_data',sendData);
  }

  ///Cancel Policy
  submitCancelPolicyFilterDetails(sendData){
      return this.httpClient.post(this.base_url+'myaccount/get_cancel_policy_data',sendData);
  }

  exportCancelPolicyData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportCancelPolicyData',sendData);
  }

  getDoublePolicyRefundAmount(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getDoublePolicyRefundAmount',sendData);
  }

  getOtherPolicyRefundAmount(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getOtherPolicyRefundAmount',sendData);
  }

  getCustomerBankCancellationDataById(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getCancellationBankDetails',sendData);
  }

  getQueryDataById(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getCancellationBankDetails',sendData);
  }

  getCancellationPaymentDetails(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getCancellationPaymentDetails',sendData);
  }

  submitFormCustomerBankDetail(sendData){
      return this.httpClient.post(this.base_url+'myaccount/submitFormCustomerBankDetail',sendData);
  }

  ////Breakin proposal
  submitBreakinInitiate(sendData){
      return this.httpClient.post(this.base_url+'myaccount/submit_breakin_initiate',sendData);
  }

  exportBreakinProposalData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/exportBreakinProposalData',sendData);
  }

  getBreakinProposalDetails(sendData){
      return this.httpClient.post(this.base_url+'myaccount/get_breakin_proposal_details',sendData);
  }

  submitFormBreakInCaseData(sendData){
      return this.httpClient.post(this.base_url+'myaccount/submit_breakin_case_data',sendData);

  }

  //////Invoice
  getInvoiceDashboardData(sendData){
      return this.httpClient.post(this.base_url+'myaccount/getinvoicedashboarddata',sendData);
  }

  getInvoiceDetails(sendData){
      return this.httpClient.post(this.base_url+'myaccount/getinvoicedetails',sendData);
  }

  submitInvoiceFormDetails(sendData){
      return this.httpClient.post(this.base_url+'myaccount/submitinvoicedata',sendData);
  }

  checkInvoiceNumber(sendData){
    return this.httpClient.post(this.base_url+'myaccount/checkInvoiceNumber',sendData);
  }

  uploadinvoiceSignedBy(sendData){
    return this.httpClient.post(this.base_url+'myaccount/uploadInvoiceSignedBy',sendData);
  }

  downloadTotalComissionData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/downloadTotalComissionData',sendData);
  }


  downloadPaymentDetailsData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/downloadPaymentDetailsData',sendData);
  }


  downloadInvoicePandingPolicies(sendData){
    return this.httpClient.post(this.base_url+'myaccount/downloadInvoicePandingPolicies',sendData);
  }


  downloadInvoiceData(sendData){
    return this.httpClient.post(this.base_url+'myaccount/downloadInvoiceData',sendData);
  }

  uploadGstFile(sendData){
    return this.httpClient.post(this.base_url+'myaccount/submitgstfile',sendData);
  }

  /////////vahan data
  submitFormSearchVahanDetails(sendData){
    return this.httpClient.post(this.base_url+'getVahanData',sendData);
  }


  ////////Transfer Endorsement
  getTransferEndorsementCharges(sendData){
      return this.httpClient.post(this.base_url+'get_transfer_endorsement_charges',sendData);
  }
  ////////Transfer Endorsement
  getOrientalPaymentResponse(sendData){
    return this.httpClient.post(this.base_url+'get-oriental-res-data',sendData);
  }

  getPolicyCount(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getPolicyCount',sendData);
  }

  getDashboardReports(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getDashboardReports',sendData);
  }

  getPolicyTypeSubtypeData(){
    return this.httpClient.get(this.base_url+'myaccount/getpolicytypesubtypedata');
  }
getCcByVarientId(sendData){
 return this.httpClient.post(this.base_url+'myaccount/getCcByVarientId',sendData);
  }

  getRtoData(){
    return this.httpClient.get(this.base_url+'admin/getrtodata');
  }

}




