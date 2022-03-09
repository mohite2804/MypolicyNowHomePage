import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  base_url = environment.baseUrl;
  constructor(private httpClient: HttpClient, public router: Router) {}

  /*========= OD Discount =========*/


  getInvoiceDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/getinvoicedetails",
      sendData
    );
  }

  getAdminInvoiceDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/getCSVinvoicedetails",
      sendData
    );
  }

  submitInvoiceFormDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/submitinvoicedata",
      sendData
    );
  }

  getInvoiceDashboardData(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/getinvoicedashboarddata",
      sendData
    );
  }
 
  uploadInvoiceFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/upload-invoice-file",
      sendData
    );
  }

  getOdDiscountData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getOdDiscountData",
      sendData
    );
  }

  getMakeByProductId(sendData) {
    return this.httpClient.post(this.base_url + "getMakeByProductId", sendData);
  }

  getModelByMakeId(sendData) {
    return this.httpClient.post(this.base_url + "getModelByMakeId", sendData);
  }

  getVehicleVariants(sendData) {
    return this.httpClient.post(this.base_url + "get_variants_by_id", sendData);
  }

  getCityByStateId(sendData) {
    return this.httpClient.post(this.base_url + "getCityByStateId", sendData);
  }

  submitFormForwardSms(sendData) {
    return this.httpClient.post(
      this.base_url + "submitFormForwardSms",
      sendData
    );
  }

  submitFormForwardPolicy(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitFormForwardPolicy",
      sendData
    );
  }

  changeStatuseByStateId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByStateId",
      sendData
    );
  }

  getMakeProductStatusData() {
    return this.httpClient.get(
      this.base_url + "admin/getMakeProductStatusData"
    );
  }

  getProductsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getProductsData",
      sendData
    );
  }

  getCancelledPoliciessData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getCancelledPoliciessData",
      sendData
    );
  }

  getSoldPoliciessData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getSoldPoliciessData",
      sendData
    );
  }
  /*



changeStatusByCityId(sendData){
    return this.httpClient.post(this.base_url+'admin/changeStatusByCityId',sendData);
}

changeStatusByMakeId(sendData){
    return this.httpClient.post(this.base_url+'admin/changeStatusByMakeId',sendData);
}

changeStatusByMakeGreetingId(sendData){
    return this.httpClient.post(this.base_url+'admin/changeStatusByMakeGreetingId',sendData);
}

*/
  /*======== model ==========*/

  getProductModelStatus() {
    return this.httpClient.get(this.base_url + "admin/getProductModelStatus");
  }

  getModelsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getModelsData",
      sendData
    );
  }

  getCancellationStatusData() {
    return this.httpClient.get(
      this.base_url + "admin/getCancellationStatusData"
    );
  }
  getModelDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmodeldatabyid",
      sendData
    );
  }

  modelUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/modelupdate", sendData);
  }

  formCancellationStatusUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/formCancellationStatusUpdate",
      sendData
    );
  }
  formCancellationPaymentStatusUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/formCancellationPaymentStatusUpdate",
      sendData
    );
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

  changeStatuseByModelId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusebymodelid",
      sendData
    );
  }

  getModelData() {
    return this.httpClient.get(this.base_url + "admin/getmodeldata");
  }

  getModelDataByMakeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmodeldatabymakeid",
      sendData
    );
  }

  getVariantDataByModelId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getvariantdatabymodelid",
      sendData
    );
  }

  getProductSubCategory(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getproductsubcategory",
      sendData
    );
  }

  checkStateByName(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/checkstatebyname",
      sendData
    );
  }

  checkCodeByName(sendData) {
    return this.httpClient.post(this.base_url + "admin/checkcode", sendData);
  }

  checkGSTCodeByName(sendData) {
    return this.httpClient.post(this.base_url + "admin/checkgstcode", sendData);
  }

  /*======== make ==========*/

  getMakeDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmakedatabyid",
      sendData
    );
  }

  getIsuzuUser(sendData) {
    return this.httpClient.post(this.base_url + "admin/getIsuzuUser", sendData);
  }

  postgetICICIbreakinID(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-icici-breakin",
      sendData
    );
  }
  postgetIrdaReport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-irda-report",
      sendData
    );
  }
  uploadClaimAndGrievancesFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-claims-grievances",
      sendData
    );
  }

  uploadOfflinePolicy(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-offline-policy",
      sendData
    );

  }
  posticiciApproveBreakinCase(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-icici-approve-breakin",
      sendData
    );
  }

  getGreetingDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getgreetingdatabyid",
      sendData
    );
  }

  greetingUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/greetingupdate",
      sendData
    );
  }

  getPublicPath() {
    return this.httpClient.get(this.base_url + "admin/getPublicPath");
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

  getMakeData() {
    return this.httpClient.get(this.base_url + "admin/getmakedata");
  }
  getMakeDataByProduct(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmakedataByProduct",
      sendData
    );
  }

  /*======== variant ==========*/

  getVariantDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getvariantdatabyid",
      sendData
    );
  }

  variantUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/variantupdate",
      sendData
    );
  }

  changeStatusByVariantId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyvariantid",
      sendData
    );
  }

  /*======== Fuel ==========*/

  getFuelStatus() {
    return this.httpClient.get(this.base_url + "admin/getFuelStatus");
  }

  getFuelDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getfueldatabyid",
      sendData
    );
  }

  fuelUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/fuelupdate", sendData);
  }

  changeStatusByFuelId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyfuelid",
      sendData
    );
  }

  getFuelData() {
    return this.httpClient.get(this.base_url + "admin/getfueldata");
  }

  /*======== City ==========*/

  getStateCityStatus() {
    return this.httpClient.get(this.base_url + "admin/getStateCityStatus");
  }

  getCityDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getcitydatabyid",
      sendData
    );
  }

  cityUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/cityupdate", sendData);
  }

  changeStatusByCityId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByCityId",
      sendData
    );
  }

  getCityData() {
    return this.httpClient.get(this.base_url + "admin/getcitydata");
  }

  getCityDataByStateId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getcitydatabystateid",
      sendData
    );
  }

  getCityPinDataByStateId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getcitypindatabystateid",
      sendData
    );
  }

  /*======== state ==========*/

  getStateCountryStatus() {
    return this.httpClient.get(this.base_url + "admin/getStateCountryStatus");
  }

  getStateDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getstatedatabyid",
      sendData
    );
  }

  stateUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/stateupdate", sendData);
  }

  getStateData() {
    return this.httpClient.get(this.base_url + "admin/getstatedata");
  }

  /*======== vehicle ==========*/

  getvariantsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getvariantsData",
      sendData
    );
  }

  getVehicleDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getvehicledatabyid",
      sendData
    );
  }

  vehicleUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/vehicleupdate",
      sendData
    );
  }

  changeStatusByVehicleId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyvehicleid",
      sendData
    );
  }

  /*======== bank ==========*/

  getBankStatus() {
    return this.httpClient.get(this.base_url + "admin/getBankStatus");
  }

  getBanksData(sendData) {
    return this.httpClient.post(this.base_url + "admin/getBanksData", sendData);
  }

  getBankDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getbankdatabyid",
      sendData
    );
  }

  bankUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/bankupdate", sendData);
  }

  changeStatusByBankId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbybankid",
      sendData
    );
  }

  getBankData() {
    return this.httpClient.get(this.base_url + "admin/getbankdata");
  }

  /*======== RTO ==========*/

  getRtoDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getrtodatabyid",
      sendData
    );
  }

  rtoUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/rtoupdate", sendData);
  }

  changeStatusByRtoId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyrtoid",
      sendData
    );
  }

  getRtoData() {
    return this.httpClient.get(this.base_url + "admin/getrtodata");
  }

  getStateCityData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getstatecitydata",
      sendData
    );
  }

  getrtosData(sendData) {
    return this.httpClient.post(this.base_url + "admin/getrtosData", sendData);
  }
  /*======== User ==========*/

  getUserDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getuserdatabyid",
      sendData
    );
  }

  userUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/userupdate", sendData);
  }

  changeStatusByUserId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyuserid",
      sendData
    );
  }

  /*======== Product ==========*/

  getProductDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getproductdatabyid",
      sendData
    );
  }

  productUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/productupdate",
      sendData
    );
  }

  changeStatusByProductId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyproductid",
      sendData
    );
  }

  getAliasProductTypeData() {
    return this.httpClient.get(this.base_url + "admin/getaliasproducttypedata");
  }

  getProductData() {
    return this.httpClient.get(this.base_url + "admin/getproductdata");
  }

  getProductAliasStatus() {
    return this.httpClient.get(this.base_url + "admin/getProductAliasStatus");
  }

  /*======== Pincode ==========*/

  getPinCodeDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getpincodedatabyid",
      sendData
    );
  }

  pincodeUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/pincodeupdate",
      sendData
    );
  }

  getPinCodeData() {
    return this.httpClient.get(this.base_url + "admin/getpincodedata");
  }

  getPincodeDataByCityId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getpincodedatabycityid",
      sendData
    );
  }

  getCitiesData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getCitiesData",
      sendData
    );
  }
  /*======== Ics ==========*/

  getIcsStatus() {
    return this.httpClient.get(this.base_url + "admin/getIcsStatus");
  }

  getIcDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/geticdatabyid",
      sendData
    );
  }

  getIcBranchById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getIcBranchById",
      sendData
    );
  }

  icUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/icupdate", sendData);
  }
  icbranchUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/icbranchUpdate",
      sendData
    );
  }
  changeStatusByIcId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyictid",
      sendData
    );
  }

  getIcPermissionData(ic_id) {
    return this.httpClient.get(
      this.base_url + "admin/geticpermissiondata/" + ic_id
    );
  }

  getIcBranchData(ic_id) {
    return this.httpClient.get(
      this.base_url + "admin/getIcBranchData/" + ic_id
    );
  }
  getIcData() {
    return this.httpClient.get(this.base_url + "admin/geticsdata");
  }

  getIcDataISUZU(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/geticsdataISUZU",
      sendData
    );
  }

  getPosUserData() {
    return this.httpClient.get(this.base_url + "admin/getposuserdata");
  }

  /* getFeedFileIcData(){
    return this.httpClient.get(this.base_url+'admin/get-feedfile-ics-data');
  } */

  getFeedFileIcData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-feedfile-ics-data",
      sendData
    );
  }

  getFeedFileProductTypeData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-feedfile-products-type-data",
      sendData
    );
  }

  getBankDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getbankdetailsbyifsc",
      sendData
    );
  }

  /*======== Business Partner ==========*/

  getBusinessPartnerDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getbusinesspartnerdatabyid",
      sendData
    );
  }

  businesspartnerUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/businesspartnerupdate",
      sendData
    );
  }

  changeStatusByBusinessPartnerId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbybusinesspartnertid",
      sendData
    );
  }

  getBusinessPartnerPermissionData(businessPartnerId) {
    return this.httpClient.get(
      this.base_url + "admin/getbusinesspartnerpermissionData/",
      businessPartnerId
    );
  }

  /*================ country ====================*/
  getCountryData() {
    return this.httpClient.get(this.base_url + "admin/getcountrydata");
  }

  /*================ status ====================*/

  getStatusData() {
    return this.httpClient.get(this.base_url + "admin/getstatusdata");
  }

  /*================= business partner ====================*/

  getBusinessPartnerData() {
    return this.httpClient.get(this.base_url + "admin/getbusinesspartnerdata");
  }

  getBusinessTieupPartnerData() {
    return this.httpClient.get(
      this.base_url + "admin/getbusinesstieuppartnerdata"
    );
  }

  /*=================Lavels ===================*/
  getHierarchyLevelsData() {
    return this.httpClient.get(this.base_url + "admin/gethierarchylevelsdata");
  }
  /*================ POS ====================*/

  getPosData() {
    return this.httpClient.get(this.base_url + "admin/getposdata");
  }

  getPosDataISUZU(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getposdataISUZU",
      sendData
    );
  }

  /*================ User Type ====================*/

  getUserTypeData() {
    return this.httpClient.get(this.base_url + "admin/getusertypedata");
  }

  /*================ status ====================*/

  getRtoZoneData() {
    return this.httpClient.get(this.base_url + "admin/getrtozonedata");
  }

  /*======== Menu ===========*/

  getMenuDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getmenudatabyid",
      sendData
    );
  }

  menuUpdate(sendData) {
    return this.httpClient.post(this.base_url + "admin/menuupdate", sendData);
  }

  changeStatusByMenuId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbymenuid",
      sendData
    );
  }

  getMenuData() {
    return this.httpClient.get(this.base_url + "admin/getMenudata");
  }

  getParentMenu() {
    return this.httpClient.get(this.base_url + "admin/getParentMenu");
  }

  /*============Pincodes ===================*/

  getStateDistVillageArea() {
    return this.httpClient.get(this.base_url + "admin/getStateDistVillageArea");
  }

  getPincodesData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getPincodesData",
      sendData
    );
  }

  /*============District ===================*/

  getDistrictData() {
    return this.httpClient.get(this.base_url + "admin/getdistrictdata");
  }

  /*============Village ===================*/
  getVillageData() {
    return this.httpClient.get(this.base_url + "admin/getvillagedata");
  }

  /*============Area ===================*/
  getAreaData() {
    return this.httpClient.get(this.base_url + "admin/getareadata");
  }

  /*============Variant ===================*/
  getVariantData() {
    return this.httpClient.get(this.base_url + "admin/getvariantdata");
  }

  /*============Vehicle Class Type ===================*/
  getVehicleClassData() {
    return this.httpClient.get(this.base_url + "admin/getvehicleclassdata");
  }

  getAddVehicleDetails() {
    return this.httpClient.get(this.base_url + "admin/getAddVehicleDetails");
  }

  getVehiclesData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getVehiclesData",
      sendData
    );
  }
  Updateshowroom_price(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/Updateshowroomprice",
      sendData
    );
  }

  /*============Body type ===================*/
  getBodyTypeData() {
    return this.httpClient.get(this.base_url + "admin/getbodytypedata");
  }

  /*============Frame ===================*/

  getFrameData() {
    return this.httpClient.get(this.base_url + "admin/getframetypedata");
  }

  /*============Segment type ===================*/

  getSegmentData() {
    return this.httpClient.get(this.base_url + "admin/getsegmenttypedata");
  }

  /*============Language ===================*/

  getLanguageData() {
    return this.httpClient.get(this.base_url + "admin/getlanguagedata");
  }

  /*============Marital===================*/

  getMaritalData() {
    return this.httpClient.get(this.base_url + "admin/getmaritaldata");
  }

  POSTDealerCheque(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/post_dealer_cheque",
      sendData
    );
  }
  getpolicyamount(sendData) {
    return this.httpClient.post(
      this.base_url + "myaccount/getpolicyamount",
      sendData
    );
  }
  /*============Marital===================*/

  getSalutationData() {
    return this.httpClient.get(this.base_url + "admin/getsalutationdata");
  }

  etSalutationData() {
    return this.httpClient.get(this.base_url + "admin/getsalutationdata");
  }

  submitEndorsmentFilterDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get_endorsement_data",
      sendData
    );
  }
  submitCancelPolicyFilterDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getCancelPolicyData",
      sendData
    );
  }

  submitFormEditStatus(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submitEndorsementStatus",
      sendData
    );
  }

  /*============Check Policy Exist===================*/

  policyExist(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/isPolicyExist",
      sendData
    );
  }

  /*============Get Misp Data===================*/

  getMispData() {
    return this.httpClient.get(this.base_url + "admin/getMispData");
  }

  getMispDataISUZU(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMispDataISUZU",
      sendData
    );
  }
  getDpsISUZU(sendData) {
    return this.httpClient.post(this.base_url + "admin/getDpsISUZU", sendData);
  }

  getBpData(sendData) {
    return this.httpClient.post(this.base_url + "admin/getBpData", sendData);
  }

  /*======== Query Type ==========*/

  query_typeupdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/query_typeupdate",
      sendData
    );
  }

  changeStatusByQueryTypeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByQueryTypeId",
      sendData
    );
  }

  getQueryTypeById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getQueryTypeId",
      sendData
    );
  }

  /*======== Query Sub Type ==========*/

  query_subTypeUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/query_subtypeUpdate",
      sendData
    );
  }

  changeStatusByQuerySubTypeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByQuerySubTypeId",
      sendData
    );
  }

  getQuerySubTypeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getQuerySubTypeId",
      sendData
    );
  }

  getQueryTypes() {
    return this.httpClient.get(this.base_url + "admin/getQueryTypes");
  }

  getDepartments() {
    return this.httpClient.get(this.base_url + "admin/getDepartments");
  }

  /*======== Departments ==========*/

  departmentUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/departmentUpdate",
      sendData
    );
  }

  changeStatusByDeptId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByDeptId",
      sendData
    );
  }

  getDeptById(sendData) {
    return this.httpClient.post(this.base_url + "admin/getDeptById", sendData);
  }
  /*======== Feed file ==========*/
  getFeedfileData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getFeedfileData",
      sendData
    );
  }
  /*======== Pos Report ==========*/
  getPosReport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-pos-report",
      sendData
    );
  }
  /*======== Makes ==========*/
  getmakesData(sendData) {
    return this.httpClient.post(this.base_url + "admin/getmakesData", sendData);
  }

  postFuturePolicyTagging(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/future-policy-tagging",
      sendData
    );
  }

  /*======== 64 vb Data ==========*/
  submitFormUploadCsvFile(sendData) {
    return this.httpClient.post(this.base_url + "admin/uploadvb_csv", sendData);
  }

  processCsvFile(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/process_CsvFile",
      sendData
    );
  }

  getSampleCsvPath() {
    return this.httpClient.get(this.base_url + "admin/getSampleCsvPath");
  }

  /*======== Notifications ==========*/

  submit_notification(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submit_notification_data",
      sendData
    );
  }

  getMisps() {
    return this.httpClient.get(this.base_url + "admin/getMisps");
  }

  getDps() {
    return this.httpClient.get(this.base_url + "admin/getDps");
  }

  getSubDps() {
    return this.httpClient.get(this.base_url + "admin/getSubDps");
  }

  /*========= Breakin Inspection ========*/
  getAdminBreakinInspectionDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/get-breakin-details",
      sendData
    );
  }
  DownloadInspectionImage(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/download-inspection-image",
      sendData
    );
  }

  submitFormBreakinInspectionStatusUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/submit-breakin-status-update",
      sendData
    );
  }
  getList64VBData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getList64VBData",
      sendData
    );
  }
  /*========= OD Discount =========*/
  getModelListByProductId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getModelListByProductId",
      sendData
    );
  }

  getVariantListByModelId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getVariantListByModelId",
      sendData
    );
  }

  getDpListByMispId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getDpListByMispId",
      sendData
    );
  }

  getStateWiseList(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getStateWiseList",
      sendData
    );
  }

  addOdDiscount(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addOdDiscount",
      sendData
    );
  }

  changeStatusByOdId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changestatusbyodid",
      sendData
    );
  }

  getCancellationDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getCancellationDataById",
      sendData
    );
  }

  formPaymentStatusUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/formPaymentStatusUpdate",
      sendData
    );
  }

  getCancellationPaymentDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getCancellationPaymentDetails",
      sendData
    );
  }

  /*=========== Special OD Discount ==============*/
  addSpecialOdDiscount(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addSpecialOdDiscount",
      sendData
    );
  }

  changeStatusBySpecialOdId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusBySpecialOdId",
      sendData
    );
  }

  /*------------------- Endorsement ---------------------*/

  getendorsementsData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getendorsementsData",
      sendData
    );
  }

  getEndorsementDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getEndorsementDataById",
      sendData
    );
  }

  formPaymentStatusUpdateEndorsement(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/formPaymentStatusUpdateEndorsement",
      sendData
    );
  }

  getSpOdModelsNameBySpOdId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getSpOdModelsNameBySpOdId",
      sendData
    );
  }

  /*-------------------IC Admin ---------------------*/
  getIcDetailsByIcId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getIcDetailsByIcId",
      sendData
    );
  }

  update_ic_details(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/update_ic_details",
      sendData
    );
  }

  /*----------------- Ticker Info -----------------------*/
  addTickerInfo(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/addTickerInfo",
      sendData
    );
  }

  changeStatusByTickerId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatusByTickerId",
      sendData
    );
  }

  createRazorIcAccount(sendData) {
    return this.httpClient.post(
      this.base_url + "create-razoric-account",
      sendData
    );
  }

  getTickerDataById(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getTickerDataById",
      sendData
    );
  }

  fetchRazorAccountByID(sendData) {
    return this.httpClient.post(
      this.base_url + "fetch-razoric-account",
      sendData
    );
  }

  //Pincode
  changeStatuseByPincodeId(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/changeStatuseByPincodeId",
      sendData
    );
  }

  //vehicle color data
  getVehicleColorData() {
    return this.httpClient.get(this.base_url + "admin/getVehicleColorData");
  }

  // MISp export excel

  getMispExcelExport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getMispExcelExport",
      sendData
    );
  }

  getbusinessPartnersExcelExport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getbusinessPartnersExcelExport",
      sendData
    );
  }

  getDpExcelExport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getDpExcelExport",
      sendData
    );
  }

  //admin notification getList
  getNotificationById(sendData) {
    return this.httpClient.post(
      this.base_url + "getNotificationById",
      sendData
    );
  }

  formCancelPolicyPaymentStatusUpdate(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/formCancelPolicyPaymentStatusUpdate",
      sendData
    );
  }

  getCancellationTypeListData() {
    return this.httpClient.get(this.base_url + "getCancellationTypeListData");
  }

  exportCancelPolicyData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/exportCancelPolicyData",
      sendData
    );
  }

  getEndorsementListData() {
    return this.httpClient.get(this.base_url + "getEndorsementListData");
  }

  exportEndorsementData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/exportEndorsementData",
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

  getInvoicePaymentDetails(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getInvoicePaymentDetails",
      sendData
    );
  }

  //notification mgmt
  getDpListByMispIdNotification(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/getDpListByMispIdNotification",
      sendData
    );
  }

  geticsDataExport(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/geticsDataExport",
      sendData
    );
  }

  downloadInvalidData(sendData) {
    return this.httpClient.post(
      this.base_url + "admin/downloadInvalidData",
      sendData
    );
  }
}
