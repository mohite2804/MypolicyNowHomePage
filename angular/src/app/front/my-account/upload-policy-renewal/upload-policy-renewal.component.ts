import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NotificationsService } from 'angular2-notifications';

import Swal from 'sweetalert2'


import { Router } from  '@angular/router';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";



@Component({
  selector: 'app-app-upload-sixty-four-vb',
  templateUrl: './upload-policy-renewal.component.html',
  styleUrls: ['./upload-policy-renewal.component.css']
})
export class UploadPolicyRenewalComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;


  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  [x: string]: any;
  baseurl = environment.apiurl;

  display : any;
  loginUserId  : any;
  loaderActive : boolean =  false;
  displayPD : any;
  displayUpload : any;
  displayCSVPng : any;

  formUploadCsv: FormGroup;
  formUpdateTable: FormGroup;
  submittedUploadCsv: boolean = false;
  csv_fileurl:any;
  csv_filelabel:any;
  uploaded_csv_file:any;
  view_table_data:any;

  csv_fileurl_label

  acceptedExtensions = "csv";

  process_data_result_display : boolean = false;
  no_of_total_records : any;
  no_of_success_rcords : any;
  no_of_duplicate_rcords : any;
  no_of_error_rcords : any;

  success_policies : any;
  duplicae_policies : any;
  error_policies : any;

  is_success_record : boolean = false;
  is_duplicate_record : boolean = false;
  is_error_record : boolean = false;
  sample_csv_path:any;

  access_permission:any;
  isVisible : boolean = false;

  result_makes : any;
  result_models : any;
  result_models_changes : any;
  selected_product_type_id : any = 1;
  result_variant :any;
  all_product_list :any;
  product_list : any;
  product_type:any;
  id: any;
  selectedModel:any;
  selectedMake:any
  selectedVariants:any;
  leadata_id:any;
  getproduct_type: any;
  selectedProduct:any;
  formRecodEdit : any;
  selectedCc : any;
  selectedSeatCapacity :any;
  selectedCarcolor :any;
  selectedRto:any;
  btnEditSubmit:any;
  rto_name_value:any;
  policy_type_value:any;
  product_type_value:any;
  policy_package_type_value:any;
  policy_holder_type_value:any;
  insurance_compony_value:any;
  openmodel:'none';
  selectedPolicyHolderType_name:any;
  product_name:any;
  policy_type_name:any;
  policySubTypeList:any;
  selectedPolicySubType_name:any;
  selectedInsurance_name:any;
  icList:any;
  colorData:any;
  rtoData : any;

  constructor(private renderer: Renderer2, private notifyService: NotificationsService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) {
    //this.loadScripts();
    this.loginUserId = sessionStorage.getItem("user_id");
		this.access_permission = sessionStorage.getItem("access_permission");
  }

   runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }
  editDomain(ledata: any,product_type){
    this.display='block'
        console.log(ledata,product_type);
        sessionStorage.setItem('leadata_id',ledata.id);
        sessionStorage.setItem('leadata_rto',ledata.rto_name);
         sessionStorage.setItem('leadata_make',ledata.make);
          sessionStorage.setItem('leadata_model',ledata.model);
           sessionStorage.setItem('leadata_variant',ledata.variant);
        sessionStorage.setItem('leadata_cubiccapacity',ledata.cubiccapacity);
        sessionStorage.setItem('leadata_seatingcapacity',ledata.seatingcapacity);
        sessionStorage.setItem('leadata_car_color',ledata.car_color);
        sessionStorage.setItem('leadata_policy_type',ledata.policy_type);
        sessionStorage.setItem('leadata_policy_package_type',ledata.policy_package_type);
        sessionStorage.setItem('leadata_policy_holder_type',ledata.policy_holder_type);
        sessionStorage.setItem('leadata_insurance_compony',ledata.insurance_compony);
        this.leadata_id = sessionStorage.getItem('leadata_id');
        this.selectedCc= sessionStorage.getItem('leadata_cubiccapacity');
        this.selectedSeatCapacity  = sessionStorage.getItem('leadata_seatingcapacity');
        this.selectedCarcolor = sessionStorage.getItem('leadata_car_color');
        this.rto_name_value = sessionStorage.getItem('leadata_rto');
        this.policy_type_value = sessionStorage.getItem('leadata_policy_type');
        this.policy_package_type_value = sessionStorage.getItem('leadata_policy_package_type');
        this.policy_holder_type_value = sessionStorage.getItem('leadata_policy_holder_type');
        this.selectedPolicyHolderType_name=this.policy_holder_type_value ;
        this.selectedPolicySubType_name=this.policy_package_type_value;
        this.insurance_compony_value = sessionStorage.getItem('leadata_insurance_compony');
        this.selectedInsurance_name = this.insurance_compony_value;
        this.selectedMake = sessionStorage.getItem('leadata_make');
        this.formRecodEdit.patchValue({make : this.selectedMake });
        this.selectedModel = sessionStorage.getItem('leadata_model');
        this.formRecodEdit.patchValue({model : this.selectedModel });
        this.selectedVariants = sessionStorage.getItem('leadata_variant');
        this.formRecodEdit.patchValue({variants : this.selectedVariants });


        console.log(this.leadata_id);
    ledata.isVisible = !ledata.isVisible;
    this.btnEditSubmit =true;
          this.getmakedata(this.leadata_id,product_type,this.selectedMake,this.selectedModel);
          this.getPolicySubTypesOfPolicyType(product_type);
          this.geticsdata();
          this.getcolordata();
          this.getRtoData();
  }

  submitForm(data){
    this.loaderActive = true;

    let uploadData = new FormData();
this.leadata_id = sessionStorage.getItem('leadata_id');
 //console.log(data);
    var array_make : any = this.selectedMake.split("|");
    var array_model : any = this.selectedModel.split("|");
    var array_variants : any = this.selectedVariants.split("|");
//console.log(array_variants[1]);
//this.formUpdateTable.value.id
  console.log(array_variants[1],this.formRecodEdit.value.variants);
    uploadData.append('temp_id',this.leadata_id);
    uploadData.append('loginUserId',this.loginUserId);
    if(this.rto_name_value =='' || this.rto_name_value == undefined){
        uploadData.append('rto_name',this.formRecodEdit.value.rto);
    }else{
        uploadData.append('rto_name',this.rto_name_value);
    }
    
    if(array_make[1] == 0 || array_make[1] == undefined)
    {
      uploadData.append('make',this.formRecodEdit.value.make);
    }else
    {
      uploadData.append('make',array_make[1]);
    }
    if(array_model[1] == 0 || array_model[1] == undefined)
    {
      uploadData.append('model',this.formRecodEdit.value.model);
    }else
    {
      uploadData.append('model',array_model[1]);
    }
    if(array_variants[1] == 0 || array_variants[1] == undefined)
    {
      uploadData.append('variant',this.formRecodEdit.value.variants);
    }else
    {
      uploadData.append('variant',array_variants[1]);
    }
    //alert(this.selectedCc);
    //uploadData.append('variant',array_variants[1]);
    uploadData.append('cubiccapacity',this.selectedCc);
    uploadData.append('seatingcapacity',this.selectedSeatCapacity);
    if(data.selectedCarcolor !=0)
    {
      uploadData.append('car_color',data.selectedCarcolor);
    }else
    {
      uploadData.append('car_color',this.selectedCarcolor);
    }
    if(this.formRecodEdit.value.product !=0)
    {
      uploadData.append('product_type',this.formRecodEdit.value.product);
    }else
    {
      uploadData.append('product_type',sessionStorage.getItem('product_type'));
    }

    uploadData.append('policy_type',this.policy_type_value);
    if(this.formRecodEdit.value.policy_sub_type_name !='')
    {
       uploadData.append('policy_package_type',this.formRecodEdit.value.policy_sub_type_name);
     }else
     {
        uploadData.append('policy_package_type',this.policy_package_type_value);
     }
    if(this.formRecodEdit.value.policy_holder_type_name !='')
    {
      uploadData.append('policy_holder_type',this.formRecodEdit.value.policy_holder_type_name);
    }else
    {
      uploadData.append('policy_holder_type',this.policy_holder_type_value);
    }
    if(this.formRecodEdit.value.insurance_name !='')
    {
      uploadData.append('insurance_compony',this.formRecodEdit.value.insurance_name);
    }else
    {
      uploadData.append('insurance_compony',this.insurance_compony_value);
    }

    /*if(ledata.rto_name_value){
      uploadData.append('rto_name',ledata.rto_name_value);
    }else{
      uploadData.append('rto_name',ledata.rto_name);
    }
    if(ledata.make_value){
      uploadData.append('make',ledata.make_value);
    }else{
      uploadData.append('make',ledata.make);
    }
    if(ledata.model_value){
      uploadData.append('model',ledata.model_value);
    }else{
      uploadData.append('model',ledata.model);
    }
    if(ledata.variant_value){
      uploadData.append('variant',ledata.variant_value);
    }else{
      uploadData.append('variant',ledata.variant);
    }
    if(ledata.cubiccapacity_value){
      uploadData.append('cubiccapacity',ledata.cubiccapacity_value);
    }else{
      uploadData.append('cubiccapacity',ledata.cubiccapacity);
    }
    if(ledata.seatingcapacity_value){
      uploadData.append('seatingcapacity',ledata.seatingcapacity_value);
    }else{
      uploadData.append('seatingcapacity',ledata.seatingcapacity);
    }
    if(ledata.car_color_value){
      uploadData.append('car_color',ledata.car_color_value);
    }else{
      uploadData.append('car_color',ledata.car_color);
    }
    if(ledata.product_type_value){
      uploadData.append('product_type',ledata.product_type_value);
    }else{
      uploadData.append('product_type',ledata.product_type);
    }
    if(ledata.policy_type_value){
      uploadData.append('policy_type',ledata.policy_type_value);
    }else{
      uploadData.append('policy_type',ledata.policy_type);
    }
    if(ledata.policy_package_type_value){
      uploadData.append('policy_package_type',ledata.policy_package_type_value);
    }else{
      uploadData.append('policy_package_type',ledata.policy_package_type);
    }
    if(ledata.policy_holder_type_value){`'`
      uploadData.append('policy_holder_type',ledata.policy_holder_type_value);
    }else{
      uploadData.append('policy_holder_type',ledata.policy_holder_type);
    }
    if(ledata.insurance_compony_value){
      uploadData.append('insurance_compony',ledata.insurance_compony_value);
    }else{
      uploadData.append('insurance_compony',ledata.insurance_compony);
    }*/

    this.commonService.UpdateRenewalPolicy(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
        if(outputResult.status)
        {
          console.log(this.view_table_data);

          this.view_table_data='';
         // this.runTable();
          this.loaderActive = false;
         // this.display='none'
          Swal.fire(outputResult.message,  "" ,  "success" );
          this.displayPD = 'none';  //show process data btn
          this.displayUpload = 'block';  //show otp form
          this.process_data_result_display=true;
          this.view_table_data = outputResult.result;
          console.log('....databatabe...........');
        console.log(this.view_table_data);
        console.log('.........databatabe..............');
       //   this.resetForm();
                  this.closePopupSuccess();
                          this.closeAddExpenseModal.nativeElement.click();


        }else{
          Swal.fire(outputResult.message,  "" ,  "error" );
        }
    })
    //console.log(index);
    this.btnEditSubmit = false;
  }


  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem("user_id");
      this.displayPD = 'none';
      this.displayUpload = 'block';
      this.displayCSVPng = 'none';

      this.getSampleCsvPath();


      this.formUploadCsv = this.formBuilder.group({
        selectedProducts :['',[Validators.required]],
        csv_file : ['',[Validators.required]]
      });
      this.formUpdateTable = this.formBuilder.group({
        rto_name_value : ['',[Validators.required]],
        make_value : ['',[Validators.required]],
        model_value : ['',[Validators.required]],
        variant_value : ['',[Validators.required]],
        engine_no_value : ['',[Validators.required]],
        chassis_no_value : ['',[Validators.required]],
        car_color_value : ['',[Validators.required]],
        policy_type_value : ['',[Validators.required]],
        policy_package_type_value : ['',[Validators.required]],
        policy_holder_type_value : ['',[Validators.required]],
        insurance_compony_value : ['',[Validators.required]],
        product_type_value : ['',[Validators.required]],
        cubiccapacity_value : ['',[Validators.required]],
        seatingcapacity_value : ['',[Validators.required]],
      });

      var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.loaderActive = true;
    this.commonService.getProductListForHomePage(sendData)
    .subscribe( response => {
      var result :any = response;
      if(result.status){
        this.all_product_list = result.product_list_renew;
        // this.getProducts(0);
        this.loaderActive = false;

        this.product_list = [];
        this.all_product_list.forEach(row => {
          //if(row.parent_id==0){
            if(row.active_menu==1){
              this.product_type=row.renewal_url;
            }
            this.product_list.push(row);
         // }
        });

      }
  });

     this.formRecodEdit = this.formBuilder.group({
      rto : [''],
      selectedRto : [''],
      model : [''],
      make : [''],
      product : [''],
      variants :[''],
      selectedCarcolor: [''],
      selectedSeatCapacity: [''],
      selectedCc:[''],
      policy_holder_type_name:[''],
      policy_sub_type_name:[''],
      insurance_name:['']
    });
}



getmakedata(id,product_type,selectedMake,selectedModel)
  {
    this.id=id;
    this.product_type=product_type;
    sessionStorage.setItem('product_type',product_type);
    this.getproduct_type = sessionStorage.getItem('product_type');
    var make=selectedMake.replace("(INVALID)",'');
    var model=selectedModel.replace("(INVALID)",'');
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('id',this.id);
    uploadData.append('product_type',this.getproduct_type);
    uploadData.append('make',make);
    uploadData.append('model',model);
    this.selectedProduct=this.getproduct_type;
    this.commonService.getMakeData(uploadData)
      .subscribe(response => {
        var outputResult : any = response;
      console.log(outputResult);
      this.result_makes = outputResult.result_makes;
      this.result_models_changes = outputResult.result_model;
      this.result_variant = outputResult.result_varients;

  });

}

closePopupSuccess(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }


resetForm(){
    this.btnEditSubmit = false;
      this.selectedProduct = "";
      this.selectedMake = "";
      this.selectedModel = "";
      this.selectedVariants ="";
      this.selectedPolicyHolderType_name=""
      this.selectedPolicySubType_name="",
      this.selectedInsurance_name="",
      this.rto_name_value=""


      this.formRecodEdit.patchValue({
        rto : '',
        model : '',
        selectedRto :'',
      make : '',
      product : '',
      variants : '',
      selectedCarcolor: '',
      selectedSeatCapacity: '',
      selectedCc:'',
      policy_holder_type_name:'',
      policy_sub_type_name:'',
      insurance_name:''
      });


  }

 closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }
  changeSelectBox(form_control_name,selected_value,ledata){
    //console.log(form_control_name,selected_value,index);
    if(selected_value){
      switch (form_control_name) {

        case 'rto':
        console.log(selected_value);
          this.formRecodEdit.patchValue({rto : selected_value});
          console.log(this.formRecodEdit.value.rto);
          this.rto_name_value ='';
          break;

        case 'product':
        //console.log(selected_value);
        var array_from_product : any = selected_value.split("|");
          this.formRecodEdit.patchValue({product : array_from_product[1]});
          this.formUploadCsv.patchValue({selectedProducts : array_from_product[1]});
          this.getmakedata(array_from_product[0],array_from_product[1],this.selectedMake,this.selectedModel);
          break;


        case 'make':
          var array_from_make : any = selected_value.split("|");
          console.log(array_from_make[1]);
          //ledata.make_value = array_from_make[1];
          this.formUpdateTable.patchValue({make : array_from_make[0] });
          this.getModelByMakeId(array_from_make[0]);
          this.clearModelVariant();
          break;

        case 'model':
         var array_from_model : any = selected_value.split("|");
          console.log(array_from_model[1]);
          //ledata.model_value = array_from_model[1];
          this.formUpdateTable.patchValue({model : array_from_model[0] });
          this.getVariantsByModelId(array_from_model[0]);
          this.clearVariant();
          break;

        case 'variants':
        var array_from_variant : any = selected_value.split("|");
          console.log(array_from_variant[1]);
          //ledata.variant_value = array_from_variant[1];
          this.formUpdateTable.patchValue({variants : array_from_variant[0] });
          this.getcc(array_from_variant[0],ledata);
          break;

        case 'policy_holder_type_name':
        console.log(selected_value);
          this.formRecodEdit.patchValue({policy_holder_type_name : selected_value });
          break;

        case 'policy_sub_type_name':
          this.formRecodEdit.patchValue({policy_sub_type_name : selected_value });
          break;


        case 'insurance_name':
          this.formRecodEdit.patchValue({insurance_name : selected_value });
          break;

         case 'color':
          this.formRecodEdit.patchValue({color : selected_value });
          break;

      }
    }
  }

  clearValue(form_control_name,selected_value){

    switch (form_control_name) {
      case 'product':
      //alert("hi");
          this.formRecodEdit.patchValue({product :''});
          this.formUploadCsv.patchValue({selectedProducts :''});
          this.selectedProduct = "";
           this.selectedProducts = null;
          break;


        case 'make':
          this.formUpdateTable.patchValue({make : ''});
          this.selectedMake = "";
          break;

        case 'model':
          this.formUpdateTable.patchValue({model : '' });
          this.selectedModel = "";
          break;

        case 'variants':
          this.formUpdateTable.patchValue({variants : '' });
          this.selectedVariants ="";
          break;

        case 'policy_holder_type_name':
          this.formRecodEdit.patchValue({policy_holder_type_name : '' });
          this.selectedPolicyHolderType_name="";
          break;

        case 'policy_sub_type_name':
          this.formRecodEdit.patchValue({policy_sub_type_name : '' });
          this.selectedPolicySubType_name="";
          break;


        case 'insurance_name':
          this.formRecodEdit.patchValue({insurance_name : '' });
          this.selectedInsurance_name="";
          break;

         case 'color':
          this.formRecodEdit.patchValue({color : '' });
          break;


      /*case 'rto':
        this.formQuoteDetails.patchValue({rto : '' });
        this.selectedRto = null;
        break;*/


    }
  }
geticsdata(){
        this.loaderActive = true;
    this.commonService.getIcData()
        .subscribe(response =>{
          this.loaderActive = false;
           this.icList=response;
          this.icList=this.icList.result;
        });
  }


  getcolordata()
  {
     this.loaderActive = true;
    this.commonService.getcolordata()
        .subscribe(response =>{
          this.loaderActive = false;
          this.colorData=response
          this.colorData=this.colorData.result;
        });
  }

 getRtoData(){
    this.commonService.getRtoData()
      .subscribe( response => {
        this.rtoData = response;
        this.rtoData = this.rtoData.result;
        console.log(this.rtoData);
      });

  }

getPolicySubTypesOfPolicyType(product_name){
    this.product_name = product_name;
    this.policy_type_name = 2;

    if((this.product_name!='' && this.product_name!=null && this.product_name!=undefined) || (this.policy_type_name!='' && this.policy_type_name!=null && this.policy_type_name!=undefined) ){

      this.loaderActive = true;
      const sendData = new FormData();

      sendData.append('product_name',this.product_name);
      sendData.append('policy_type_id',this.policy_type_name);

      this.commonService.getPolicySubTypesOfProductName(sendData)
        .subscribe(response =>{
          this.loaderActive = false;
          this.policySubTypeList = response;
          this.policySubTypeList = this.policySubTypeList.result;

      });
    }
    else{
      this.getPolicySubTypeList();
    }
  }

  getPolicySubTypeList(){
    this.commonService.getPolicySubTypeData()
    .subscribe( response => {
      this.filterResult = response;
      this.policySubTypeList = this.filterResult.policySubTypeList;
    });
  }



clearModelVariant(){
   // alert('inn');
    //this.selectedMake = null;
    //this.selectedModel+id = null;
    this.selectedModel = null;
    this.selectedVariants = null;

  }
  clearVariant(){
    //alert('inn');
    //this.selectedMake = null;
    //this.selectedModel = null;
    this.selectedVariants = null;

  }

  getModelByMakeId(event){
    if(event != ""){
      this.formUpdateTable.patchValue({model : '' });
      this.loaderActive = true;
      this.result_models_changes = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('make_id',event);
      sendData.append('product_type_id',this.getproduct_type);
      console.log(this.getproduct_type);
      this.commonService.getModelsByMakeId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_models_changes = result.models;
        }

      });
    }

  }
  getVariantsByModelId(event){
    if(event != ""){
      this.formUpdateTable.patchValue({variants : '' });
      this.loaderActive = true;
      this.result_variant = [];
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('model_id',event);
      sendData.append('product_type_id',this.getproduct_type);
      this.commonService.getVariantByModelId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.result_variant = result.variants;
          console.log(result.cc);
        }

      });
    }

  }

getcc(event,ledata)
{
  if(event != ""){

      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      sendData.append('varient_id',event);
      sendData.append('product_type_id',this.getproduct_type);
      this.commonService.getCcByVarientId(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;
        if(result.status){
          this.selectedCc= result.cc;
          this.selectedSeatCapacity = result.seating_capacity;
         // console.log(result.cc);
        }

      });
    }
}
  setInvoicePriceByVariantId(event){

   /* var variant_id_value = event;
    var variant_id_value :any=  variant_id_value.split("|",2);
    var vehicle_id :any = variant_id_value[0];
    this.result_variant.forEach( (value, key) => {
      if(value.vehicle_master_id == vehicle_id ){
        this.min_invoice_price = this.result_variant[key].min_invoice_price;
        this.max_invoice_price = this.result_variant[key].max_invoice_price;
        this.setInvoiceRange();
      }
    });*/

  }
  resetInputfieldForm(){
    this.fileInput.nativeElement.value = "";
  }

  ngAfterViewInit(): void {

  }

  getSampleCsvPath()
  {
    this.commonService.getSampleCsvPath()
    .subscribe(response => {
      var outputResultt : any = response;
      console.log(outputResultt);
      if(outputResultt.status)
      {
        this.displayCSVPng = 'block';
        this.sample_csv_path = outputResultt.sample_vb_path;
        console.log(this.sample_csv_path);
      }

    })
  }

  uploadCsvFile(event){
    // alert('sa');
    console.log('upload file');
    console.log(event);

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;
    //vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if(file_type.toLowerCase() != 'application/vnd.ms-excel' ){
      Swal.fire ("Please Select 'CSV' file",  "" ,  "error" );
      this.csv_fileurl = "";
      this.csv_fileurl_label = "";

    }else if(file_size > 209715200){
      Swal.fire ("Please Select below 200 mb image.",  "" ,  "error" );
      this.csv_fileurl = "";
      this.csv_fileurl_label = "";
    }else{
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.csv_fileurl = event.target.result;
      }
      this.csv_fileurl_label = file.name;
      this.formUploadCsv.patchValue({
        'csv_file' : file
      });
    }
  }
  downloadPolicyData(){
    window.open(this.base_url+'myaccount/downloadRenwalPolicy_Data/','_blank');
  }
  processPolicyData(){
    this.loaderActive = true;
    this.view_table_data='';
    this.process_data_result_display=false;
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    this.commonService.ProcessUploadRenewalPolicy(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
      console.log(outputResult.status);
      if(outputResult.status)
      {
        console.log(this.view_table_data);
        this.loaderActive = false;
         this.view_table_data ='';
        Swal.fire(outputResult.message,  "" ,  "success" );
        this.displayPD = 'none';  //show process data btn
        this.displayUpload = 'block';  //show otp form
        this.process_data_result_display=true;
        this.view_table_data = outputResult.result;
        console.log(this.view_table_data);
        //this.runTable();

 /*        this.runTable();
        this.loaderActive = false;
        this.view_table_data = outputResult.result;
        this.process_data_result_display=true;
        Swal.fire(outputResult.message,  "" ,  "success" );
        this.displayPD = 'none';  //show process data btn
        this.displayUpload = 'block';  //show otp form */

      }else{

        Swal.fire(outputResult.message,  "" ,  "error" );
      }
    });
  }

  submitFormUploadCsv(){
    this.uploaded_csv_file = '';
    this.submittedUploadCsv = true;
    if(this.formUploadCsv.invalid){
      return;
    }
    this.loaderActive = true;
//alert(this.formUploadCsv.value.selectedProduct);
    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('csv_file',this.formUploadCsv.value.csv_file);
    uploadData.append('product_type',this.formUploadCsv.value.selectedProducts);

    this.commonService.submitUploadRenewalPolicy(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
      this.loaderActive = false;
      if(outputResult.status)
      {
        Swal.fire(outputResult.message,  "" ,  "success" );

        this.displayPD = 'none';  //show process data btn
        this.displayUpload = 'block';  //show otp form
        this.process_data_result_display=true;
        this.view_table_data = outputResult.result;
        this.view_table_head = outputResult.thead;
        this.resetInputfieldForm();
        console.log('.......................');
        console.log(this.view_table_data);
        console.log('.......................');
        this.csv_fileurl_label ='';
        this.csv_fileurl = "";
        this.uploaded_csv_file='';
        this.formUploadCsv.value.csv_file='';
        this.submittedUploadCsv = false;
        this.selectedProducts = null;
        this.formUploadCsv.reset();
      }
      else
      {
        Swal.fire(outputResult.message,  "" ,  "error" );
        this.view_table_data = '';
        this.view_table_head = '';
        this.csv_fileurl_label ='';
        this.csv_fileurl = "";
        this.uploaded_csv_file='';
        this.formUploadCsv.value.csv_file='';
        this.submittedUploadCsv = false;
        this.selectedProducts = '';
        this.formUploadCsv.reset();
      }
    });
  }

  successNotify(infoMsg){
    this.notifyService.success(
    'Success',
     infoMsg,
    {
        theClass: "aboveAll",
        timeOut: 3000,
        showProgressBar: true,
        animate: 'fade',
    }
    );
  }

  processCsvData()
  {
    // alert('CSV Data');
    // console.log(this.uploaded_csv_file);
    if(this.uploaded_csv_file != '')
    {
      this.loaderActive = true;
      var csvData = new FormData();
      csvData.append('loginUserId',this.loginUserId);
      csvData.append('uploaded_csv_file',this.uploaded_csv_file);

      this.commonService.processCsvFile(csvData)
        .subscribe(response => {
          var outputResult : any = response;
          console.log(outputResult);
          this.loaderActive = false;
          if(outputResult.status)
          {
            this.resetInputfieldForm();
            this.displayPD = 'none';
            this.displayUpload = 'block';
            this.displayCSVPng = 'none';

            this.formUploadCsv.patchValue({
              'csv_file' : '',
              'selectedProducts' : ''
            });

            this.process_data_result_display = true;

            this.no_of_total_records = outputResult.no_of_total_records;
            console.log("....records..");
            console.log(this.no_of_total_records);
            this.no_of_success_rcords = outputResult.no_of_success_policy;
            this.success_policies = outputResult.success_policies;
            if(this.no_of_success_rcords>0){
              this.is_success_record = true;
            }

            this.no_of_duplicate_rcords = outputResult.no_of_duplicate_policies;
            this.duplicae_policies = outputResult.duplicate_policies;
            if(this.no_of_duplicate_rcords>0){
              this.is_duplicate_record = true;
            }

            this.no_of_error_rcords = outputResult.no_error_policies;
            this.error_policies = outputResult.error_policies;
            console.log("....error records..");
            console.log(this.error_policies);
            if(this.no_of_error_rcords>0){
              this.is_error_record = true;
            }

            Swal.fire(outputResult.message,  "" ,  "success" );




            this.csv_filelabel = '';
            this.csv_fileurl_label ='';

            this.uploaded_csv_file = '';
            this.submittedUploadCsv = false;

          }
          else
          {
            Swal.fire(outputResult.message,  "" ,  "error" );
          }
        });
    }
    else
    {
      Swal.fire('Please first upload CSV File.',  "" ,  "error" );
      this.uploaded_csv_file = '';
    }
  }

}
