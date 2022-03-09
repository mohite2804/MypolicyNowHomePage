import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  base_url = environment.baseUrl;
  constructor(private httpClient: HttpClient, public router: Router) {}

  getCssLogoByUrl(sendData){
    return this.httpClient.post(this.base_url+'getCssLogoByUrl',sendData);
  }

  changeApproveStatuseByPosId(sendData){
    return this.httpClient.post(this.base_url+'admin/changeBankApproveStatuseByPosId',sendData);
  }

  ChangeRoleAccess(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/ChangeRoleAccess",
      sendData
    );
  }

  submitIcChangePermission(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitIcChangePermission",
      sendData
    );
  }

  getIcPermissionData(ic_id) {
    return this.httpClient.get(
      this.base_url + "admin/getIcPermissionData/" + ic_id
    );
  }
  getIcBranchData(ic_id) {
    return this.httpClient.get(
      this.base_url + "admin/getIcBranchData/" + ic_id
    );
  }
  getWalletFilterData(sendData) {
    return this.httpClient.post(
      this.base_url + "getWalletFilterData",
      sendData
    );
  }
  chageICPStatus(sendData){
    return this.httpClient.post(this.base_url+'admin/chageicpstatus',sendData);
  }
  getIcPermissionChangeData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getIcPermissionChangeData",
      sendData
    );
  }

  getProductWisePrivilegeWithLogin(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getProductWisePrivilegeWithLogin",
      sendData
    );
  }

  submitPrivileges(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitPrivileges",
      sendData
    );
  }

  getPolicytypesByProductForPrivilege(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getPolicytypesByProductForPrivilege",
      sendData
    );
  }

  getDetailsPrivilegeMisp(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getDetailsPrivilegeMisp",
      sendData
    );
  }

  getPosDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getPosDataById",
      sendData
    );
  }

  rsaData(sendData) {
    return this.httpClient.post(this.base_url + "admin/sendRsaData", sendData);
  }

  changeStatuseByPosId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByPosId",
      sendData
    );
  }

  getMispDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMispDataById",
      sendData
    );
  }

  changeStatuseByMispId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByMispId",
      sendData
    );
  }

  uploadUserCSV(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/uploadUserCSV",
      sendData
    );
  }

  getRoleByBusinessId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getRoleByBusinessId",
      sendData
    );
  }

  getParentUser(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getParentUser",
      sendData
    );
  }

  getusersByLogin(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getusersByLogin",
      sendData
    );
  }

  getUsersDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getUsersDataById",
      sendData
    );
  }

  UsersUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/UsersUpdate", sendData);
  }

  changeStatuseByUsersId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByUsersId",
      sendData
    );
  }

  submitPermissions(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitPermissions",
      sendData
    );
  }

  getMenusInTreeView(sendData) {
    return this.httpClient.post(this.base_url + "admin/getmenutree", sendData);
  }

  // getsidebarmenus(){
  //   return this.httpClient.get(this.base_url+'admin/getsidebarmenus');
  // }

  getsidebarmenus(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getsidebarmenus",
      sendData
    );
  }

  getmenus() {
    return this.httpClient.get(this.base_url + "admin/getmenulist");
  }
  getMenuDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMenuDataById",
      sendData
    );
  }

  changeStatuseByMenuId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByMenuId",
      sendData
    );
  }

  MenuUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/MenuUpdate", sendData);
  }

  submitLoginFormData(sendData) {
    return this.httpClient.post(this.base_url + "admin/login", sendData);
  }

  /*======== make ==========*/

  getMakeProductStatusData() {
    return this.httpClient.get(
      this.base_url + "admin/getMakeProductStatusData"
    );
  }

  getMakeDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmakedatabyid",
      sendData
    );
  }

  makeUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/makeupdate", sendData);
  }

  changeStatusByMakeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbymakeid",
      sendData
    );
  }

  changeStatusByMakeGreetingId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByMakeGreetingId",
      sendData
    );
  }

  changeStatusByAminUserTypeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyaminuserTypeId",
      sendData
    );
  }

  getMakeData() {
    return this.httpClient.get(this.base_url + "admin/getmakedata");
  }

  downloadModelData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/downloadModelData",
      sendData
    );
  }

  downloadModelSampleExcel(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/downloadModelSampleExcel",
      sendData
    );
  }

  uploadExcelModelData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/uploadExcelModelData",
      sendData
    );
  }

  /*================ product ====================*/

  getProductData() {
    return this.httpClient.get(this.base_url + "admin/getproductdata");
  }

  /*================ status ====================*/

  getStatusData() {
    return this.httpClient.get(this.base_url + "admin/getstatusdata");
  }

  /*-------------- Admin Invoice & GST Approval ---------------*/
  updateInvoiceStatus(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/updateInvoiceStatus",
      sendData
    );
  }

  updateGSTStatus(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/updategststatus",
      sendData
    );
  }

  // changeStatusByInvoiceId(sendData){
  //   return this.httpClient.post(this.base_url+'admin/updateInvoiceStatus',sendData);
  // }

  getBankData() {
    return this.httpClient.get(this.base_url + "admin/getBankData");
  }

  getBankDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getbankdetailsbyifsc",
      sendData
    );
  }

  getPincodeDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "get_state_city_by_pincode",
      sendData
    );
  }

  paymentUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/updatePaymentStatus",
      sendData
    );
  }

  /*-------------- Admin Invoice & GST Approval ---------------*/

  /*============Query MGMT System ===================*/

  getQueryDataByQueryNo(sendData) {
    return this.httpClient.post(this.base_url + "get_query_details", sendData);
  }

  getQueryFormData(sendData) {
    return this.httpClient.post(
      this.base_url + "get_query_update_form_data",
      sendData
    );
  }

  getQueryUpdateFormData(sendData) {
    return this.httpClient.post(
      this.base_url + "get_query_update_form_data",
      sendData
    );
  }

  updateQueryStatusByAdmin(sendData) {
    return this.httpClient.post(
      this.base_url + "update_query_status_by_admin",
      sendData
    );
  }

  getQuerySubTypeByQueryTypeId(sendData) {
    return this.httpClient.post(
      this.base_url + "getQuerySubTypeByQueryTypeId",
      sendData
    );
  }

  submitNewQuery(sendData) {
    return this.httpClient.post(this.base_url + "submit_new_query", sendData);
  }

  reassignQuery(sendData) {
    return this.httpClient.post(this.base_url + "reassign_query", sendData);
  }

  /*-------------- User Menus Privelige  ---------------*/

  getMenusPrivilegeUser(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMenusPrivilegeUser",
      sendData
    );
  }

  submitMenuPrivileges(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitMenuPrivileges",
      sendData
    );
  }

  getParentMenu() {
    return this.httpClient.get(this.base_url + "admin/getParentMenu");
  }

  /*-------------- User Menus Privelige  End---------------*/

  /*-------------- Parent Admin Menus Added Privelige(who access /admin)  ---------------*/

  getUserTypeDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getUserTypeDataById",
      sendData
    );
  }

  userTypeDataUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/userTypeDataUpdate",
      sendData
    );
  }

  getUserRoleDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getUserRoleDataById",
      sendData
    );
  }

  userRoleDataUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/userRoleDataUpdate",
      sendData
    );
  }

  getUserDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getUserDataById",
      sendData
    );
  }

  getSelectedBPUserDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getselectedbpuserDataById",
      sendData
    );
  }

  getBpUserMappingDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getBpUserMappingDataById",
      sendData
    );
  }

  getBpPosUserMappingDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getBpPosUserMappingDataById",
      sendData
    );
  }
  getPosUserData(){
    return this.httpClient.get(this.base_url+'admin/getposuserdata');
  }
  getPosUserDataById(sendData){
    return this.httpClient.post(
      this.base_url + "admin/getposuserdatabyid",
      sendData
    );
    // return this.httpClient.get(this.base_url+'admin/getposuserdata');
  }
  userDataUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/userDataUpdate",
      sendData
    );
  }
  UpdateSubPosData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/updatesubposdata",
      sendData
    );
  }

    businessUserDataUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/businessUserDataUpdate",
      sendData
    );
  }


  /*-------------- Parent Admin Menus Added Privelige(who access /admin) end  ---------------*/

  /*================ get admin user type selection ====================*/

  getAdminUserTypeSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminUserTypeSelection",
      sendData
    );
  }

  GetGIIBAdminUser(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getgiibadminuser",
      sendData
    );
  }

  getSelectedAdminUserTypeSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getselectedadminusertypeselection",
      sendData
    );
  }

  getAdminBusinessDataSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminBusinessDataSelection",
      sendData
    );
  }

  getAdminicDataSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminICDataSelection",
      sendData
    );
  }

  getAdminUserBusinessDataSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminUserBusinessDataSelection",
      sendData
    );
  }

  getAdminBusinessLevelDataSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminBusinessLevelDataSelection",
      sendData
    );
  }

  geticRoleList(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/geticrolelist",
      sendData
    );
  }
  getAdminDepartmentTypeSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminDepartmentTypeSelection",
      sendData
    );
  }

  getAdminRoleSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAdminRoleSelection",
      sendData
    );
  }

  getAdminParentSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getadminparentselection",
      sendData
    );
  }

  getSelectedParentId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getselectedParentId",
      sendData
    );
  }

  getallPoss(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getAllPoss",
      sendData
    );
  }

  getbplavelSelection(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getBpLavelSelection",
      sendData
    );
  }


  getAdminBusinessNameSelection(sendData){
     return this.httpClient.post(
      this.base_url + "admin/getAdminBusinessNameSelection",
      sendData
    );
  }

  getAdminUserBusinessMappingNameSelection(sendData){
     return this.httpClient.post(
      this.base_url + "admin/getAdminUserBusinessMappingNameSelection",

      sendData
    );
  }

  getAdminUserSelection(sendData){
     return this.httpClient.post(
      this.base_url + "admin/getAdminUserSelection",

      sendData
    );
  }

  getBusinessLevels(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getBusinessLevels",
      sendData
    );
  }

  mispUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/MISPUpdate", sendData);
  }

  /*------------------- Reward Management ---------------------*/

  uploadComissionFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/comissionUpload",
      sendData
    );
  }

  getPublicPath() {
    return this.httpClient.get(this.base_url + "admin/getPublicPath");
  }

  downloadComissionData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getComissionUploadData",
      sendData
    );
  }

    downloadComissionSummary(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getComissionSummaryData",
      sendData
    );
  }


  /*------------------- Reward Management ---------------------*/

  /*---Approve Invoice--*/

  getApproveInvoicesData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getApproveInvoicesData",
      sendData
    );
  }

  getApproveGSTData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getApproveGSTData",
      sendData
    );
  }

  getMpnRewardsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMpnRewardsData",
      sendData
    );
  }

  downloadPaymentData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getInvoiceGstPaymentData",
      sendData
    );
  }

  /*-------------------------Reports---------------------------------------*/

  getIcData() {
    return this.httpClient.get(this.base_url + "admin/geticsdata");
  }

  getpolicyData() {
    return this.httpClient.get(this.base_url + "admin/getpolicyData");
  }

  getMispData() {
    return this.httpClient.get(this.base_url + "admin/getMispData");
  }

  getDpData() {
    return this.httpClient.get(this.base_url + "admin/getDPData");
  }
  /******APD Transaction Report Start********/

  getApdTransactionReportData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getApdTransactionReportData",
      sendData
    );
  }
  getRenewalReportData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getRenewalReportData",
      sendData
    );
  }

  /******APD Transaction Report End********/
  /*-------------------------Reports---------------------------------------*/

  getSubPosDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getSubPosDataById",
      sendData
    );
  }

  changeStatuseBySubPosId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseBySubPosId",
      sendData
    );
  }

  ////////ticker

  getAdminTickerList(sendData) {
    return this.httpClient.post(this.base_url + "getAdminTickerList", sendData);
  }

  ///type
  getLevelData() {
    return this.httpClient.get(this.base_url + "admin/getLevelData");
  }

  getLevels(sendData) {
    return this.httpClient.post(this.base_url + "admin/getLevels", sendData);
  }

  getAllLevels(sendData) {
    return this.httpClient.post(this.base_url + "admin/getAllLevels", sendData);
  }

  /******Hierarchy Mgmt**************/

  getLevelsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getLevelsData",
      sendData
    );
  }

  getLevelDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getLevelDataById",
      sendData
    );
  }

  getLevelStatus() {
    return this.httpClient.get(this.base_url + "admin/getLevelStatus");
  }

  getLevelSelection() {
    return this.httpClient.get(this.base_url + "admin/getlevelselection");
  }

  levelUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/levelUpdate", sendData);
  }

  changeStatusByLevelId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByLevelId",
      sendData
    );
  }

  //zone master

  getLevelZoneParents() {
    return this.httpClient.get(this.base_url + "admin/getLevelZoneParents");
  }

  addUpdateZone(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addUpdateZone",
      sendData
    );
  }

  getZoneDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getZoneDataById",
      sendData
    );
  }

  changeStatusByZoneId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByZoneId",
      sendData
    );
  }

  //Region master
  getlevelRegionParents() {
    return this.httpClient.get(this.base_url + "admin/getlevelRegionParents");
  }

  addUpdateRegion(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addUpdateRegion",
      sendData
    );
  }

  getRegionDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getRegionDataById",
      sendData
    );
  }

  changeStatusByRegionId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByRegionId",
      sendData
    );
  }

  //state master
  getFilterZone(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getFilterZone",
      sendData
    );
  }

  getFilterRegion(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getFilterRegion",
      sendData
    );
  }

  addUpdateState(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addUpdateState",
      sendData
    );
  }

  getStateDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getStateDataById",
      sendData
    );
  }

  changeStatusByStateId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByStateId",
      sendData
    );
  }

  changeStatusByAdminUserId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeadminuserstatusByid",
      sendData
    );
  }

  //admin - forgot password
  submitForgotPassword(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitForgotPassword",
      sendData
    );
  }

  //approve invoice payment
  submitFormUploadPaymentFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/uploadInvoicePaymentCsv",
      sendData
    );
  }

  processInvoicePaymentCsvFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/process_InvoicePaymentCsvFile",
      sendData
    );
  }

  //notifications
  getUnreadNotificationCount(sendData: FormData) {
    return this.httpClient.post(
      this.base_url + "getUnreadNotificationCount",
      sendData
    );
  }

  getLastThreeNotifications(sendData: FormData) {
    return this.httpClient.post(
      this.base_url + "getLastThreeNotifications",
      sendData
    );
  }

  /*========= Breakin proposal ========*/
  exportBreakinProposalData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/exportBreakinProposalData",
      sendData
    );
  }

  downloadPosListWithLogin(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/downloadPosListWithLogin",
      sendData
    );
  }

  getInvoicePaymentDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getInvoicePaymentDetails",
      sendData
    );
  }

  getPolicyCount(sendData){
    return this.httpClient.post(this.base_url+'admin/getPolicyCount',sendData);
  }

  validateUserLoginStatus(sendData){
    return this.httpClient.post(this.base_url+'check_user_login_status',sendData);
  }

  getDashboardReports(sendData){
    return this.httpClient.post(this.base_url+'myaccount/getDashboardReports',sendData);
  }

}
