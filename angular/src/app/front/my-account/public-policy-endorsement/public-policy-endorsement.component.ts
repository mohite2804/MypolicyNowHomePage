import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";

import { CustomvalidationService } from '../../services/customvalidation.service';
import {NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from  '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-endorsement',
  templateUrl: './public-policy-endorsement.component.html',
  styleUrls: ['./public-policy-endorsement.component.css']
})
export class PublicPolicyEndorsementComponent implements OnInit {
  base_url = environment.baseUrl;
  [x: string]: any;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  loaderActive : any;

  UploadValue: boolean = false;
  fileChangeFunCalled: boolean = false;

 
  policy_type_name : any;
  policy_subtype_name : any;


  acceptedExtensions = "jpg, jpeg, pdf";

  ///NOC
  noc_label : any;
  noc_url_label
  noc_url : any;

  ///Invoice RC Copy
  invoice_rc_copy_label : any;
  invoice_rc_copy_url_label
  invoice_rc_copy_url : any;

  ///Form 29/30 Copy
  form29_form30_label : any;
  form29_form30_url_label
  form29_form30_url : any;

  ///Form 29/30 Copy
  inpection_report_label : any;
  inpection_report_url_label
  inpection_report_url : any;

  ///front_image
  front_image_label : any;
  front_image_url_label
  front_image_url : any;

  ///rear_image
  rear_image_label : any;
  rear_image_url_label
  rear_image_url : any;

  ///left_image
  left_image_label : any;
  left_image_url_label
  left_image_url : any;

  ///right_image
  right_image_label : any;
  right_image_url_label
  right_image_url : any;

  ///windscreen_inside
  windscreen_inside_label : any;
  windscreen_inside_url_label
  windscreen_inside_url : any;

  ///windscreen_outside
  windscreen_outside_label : any;
  windscreen_outside_url_label
  windscreen_outside_url : any;

  ///autometer_with_engine_on
  autometer_with_engine_on_label : any;
  autometer_with_engine_on_url_label
  autometer_with_engine_on_url : any;

  ///chassis_plate_print
  chassis_plate_print_label : any;
  chassis_plate_print_url_label
  chassis_plate_print_url : any;

  ///previous_insurance_copy
  previous_insurance_copy_label : any;
  previous_insurance_copy_url_label
  previous_insurance_copy_url : any;

  ///dicky_open
  dicky_open_label : any;
  dicky_open_url_label
  dicky_open_url : any;

  ///selfie_with_vehicle
  selfie_with_vehicle_label : any;
  selfie_with_vehicle_url_label
  selfie_with_vehicle_url : any;

  div_show_company_details : boolean = false;
  div_show_owner_details : boolean = false;
  div_show_nominee_details : boolean = false;
  public_path:any;
  
  docuploaded : boolean = false;
  submitbtn : boolean = true;

  constructor(private activatedRoute : ActivatedRoute,private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {
  	
  }

  ngOnInit(): void {
    this.setTransferFormDetails();
    this.setInspectionImagesValidation();
    this.loaderActive = true;
    this.policy_no=this.activatedRoute.snapshot.paramMap.get('policy_no');
    this.policy_endorsement_id  = this.activatedRoute.snapshot.paramMap.get('policy_end_id');
    
    let uploadData = new FormData();
    uploadData.append('policy_number',this.policy_no);
    uploadData.append('endorsement_id',this.policy_endorsement_id);

    console.log('submitformeditTransfer........');
    console.log(uploadData);
    this.loaderActive = true;
    this.commonService.submitEndorsmentData(uploadData)
    .subscribe(response => {
      
      var outputResult : any = response;
      this.result = outputResult.result[0];

      this.policy_type_name = this.result.policy_type_name;
      this.policy_subtype_name = this.result.policy_subtype_name;

      this.loaderActive = false;
    });
  }

  setTransferFormDetails(){
    this.formeditTransfer = this.formBuilder.group({
      noc_document : ['',[Validators.required]],
      invoice_rc_copy_document : ['',[Validators.required]],
      form29_form30_document : ['',[Validators.required]],
      inpection_report_document : ['',[Validators.required]],
      front_image_document : ['',[Validators.required]],
      rear_image_document : ['',[Validators.required]],
      left_image_document : ['',[Validators.required]],
      right_image_document : ['',[Validators.required]],
      windscreen_inside_document : ['',[Validators.required]],
      windscreen_outside_document : ['',[Validators.required]],
      autometer_with_engine_on_document : ['',[Validators.required]],
      chassis_plate_print_document : ['',[Validators.required]],
      previous_insurance_copy_document : ['',[Validators.required]],
      dicky_open_document : ['',[Validators.required]],
      selfie_with_vehicle_document : ['',[Validators.required]],
      });

    this.formeditTransfer.patchValue({
        ed_policyholdertype : 'Individual'
      });
  }

  setInspectionImagesValidation(){
    this.formeditTransfer.get("noc_document").updateValueAndValidity();
    this.formeditTransfer.get("invoice_rc_copy_document").updateValueAndValidity();
    this.formeditTransfer.get("form29_form30_document").updateValueAndValidity();
    this.formeditTransfer.get("inpection_report_document").updateValueAndValidity();    
    this.formeditTransfer.get("front_image_document").updateValueAndValidity();
    this.formeditTransfer.get("rear_image_document").updateValueAndValidity();
    this.formeditTransfer.get("left_image_document").updateValueAndValidity();
    this.formeditTransfer.get("right_image_document").updateValueAndValidity();
    this.formeditTransfer.get("windscreen_inside_document").updateValueAndValidity();
    this.formeditTransfer.get("windscreen_outside_document").updateValueAndValidity();
    this.formeditTransfer.get("autometer_with_engine_on_document").updateValueAndValidity();
    this.formeditTransfer.get("chassis_plate_print_document").updateValueAndValidity();
    this.formeditTransfer.get("previous_insurance_copy_document").updateValueAndValidity();
    this.formeditTransfer.get("dicky_open_document").updateValueAndValidity();
    this.formeditTransfer.get("selfie_with_vehicle_document").updateValueAndValidity();
  }
  ////NOC
  uploadNOCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.noc_url = "";
      this.noc_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.noc_url = "";
      this.noc_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.noc_url = event.target.result;
        }
      }
      else{
        this.noc_url = "assets/front/img/pdf-file.png";
      }

      this.noc_url_label = file.name;
      this.formeditTransfer.patchValue({
        'noc_document' : file
      });
    }
  }

  //// Invoice RC copy
  uploadInvoiceRCcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.invoice_rc_copy_url = "";
      this.invoice_rc_copy_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.invoice_rc_copy_url = "";
      this.invoice_rc_copy_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.invoice_rc_copy_url = event.target.result;
        }
      }
      else{
        this.invoice_rc_copy_url = "assets/front/img/pdf-file.png";
      }

      this.invoice_rc_copy_url_label = file.name;
      this.formeditTransfer.patchValue({
        'invoice_rc_copy_document' : file
      });
    }
  }

  //// Form 29/ form 30 copy
  uploadForm29Form30copy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.form29_form30_url = "";
      this.form29_form30_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.form29_form30_url = "";
      this.form29_form30_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.form29_form30_url = event.target.result;
        }
      }
      else{
        this.form29_form30_url = "assets/front/img/pdf-file.png";
      }

      this.form29_form30_url_label = file.name;
      this.formeditTransfer.patchValue({
        'form29_form30_document' : file
      });
    }
  }

  //// inpection report copy
  uploadInpspectionReportcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.inpection_report_url = "";
      this.inpection_report_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.inpection_report_url = "";
      this.inpection_report_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.inpection_report_url = event.target.result;
        }
      }
      else{
        this.inpection_report_url = "assets/front/img/pdf-file.png";
      }

      this.inpection_report_url_label = file.name;
      this.formeditTransfer.patchValue({
        'inpection_report_document' : file
      });
    }
  }

  //// front image copy
  uploadFrontImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.front_image_url = "";
      this.front_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.front_image_url = "";
      this.front_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.front_image_url = event.target.result;
        }
      }
      else{
        this.front_image_url = "assets/front/img/pdf-file.png";
      }

      this.front_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'front_image_document' : file
      });
    }
  }

  //// rear image copy
  uploadRearImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rear_image_url = "";
      this.rear_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rear_image_url = "";
      this.rear_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.rear_image_url = event.target.result;
        }
      }
      else{
        this.rear_image_url = "assets/front/img/pdf-file.png";
      }

      this.rear_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'rear_image_document' : file
      });
    }
  }

  //// left_image copy
  uploadLeftImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.left_image_url = "";
      this.left_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.left_image_url = "";
      this.left_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.left_image_url = event.target.result;
        }
      }
      else{
        this.left_image_url = "assets/front/img/pdf-file.png";
      }

      this.left_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'left_image_document' : file
      });
    }
  }

  //// right_image copy
  uploadRightImagecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.right_image_url = "";
      this.right_image_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.right_image_url = "";
      this.right_image_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.right_image_url = event.target.result;
        }
      }
      else{
        this.right_image_url = "assets/front/img/pdf-file.png";
      }

      this.right_image_url_label = file.name;
      this.formeditTransfer.patchValue({
        'right_image_document' : file
      });
    }
  }

  //// windscreen_inside copy
  uploadWindscreenInsidecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_inside_url = "";
      this.windscreen_inside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_inside_url = "";
      this.windscreen_inside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.windscreen_inside_url = event.target.result;
        }
      }
      else{
        this.windscreen_inside_url = "assets/front/img/pdf-file.png";
      }

      this.windscreen_inside_url_label = file.name;
      this.formeditTransfer.patchValue({
        'windscreen_inside_document' : file
      });
    }
  }

  //// windscreen_outside copy
  uploadWindscreenOutsidecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_outside_url = "";
      this.windscreen_outside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_outside_url = "";
      this.windscreen_outside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.windscreen_outside_url = event.target.result;
        }
      }
      else{
        this.windscreen_outside_url = "assets/front/img/pdf-file.png";
      }

      this.windscreen_outside_url_label = file.name;
      this.formeditTransfer.patchValue({
        'windscreen_outside_document' : file
      });
    }
  }

  //// autometer_with_engine_on copy
  uploadAutometerWithEngineOncopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.autometer_with_engine_on_url = "";
      this.autometer_with_engine_on_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.autometer_with_engine_on_url = "";
      this.autometer_with_engine_on_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.autometer_with_engine_on_url = event.target.result;
        }
      }
      else{
        this.autometer_with_engine_on_url = "assets/front/img/pdf-file.png";
      }

      this.autometer_with_engine_on_url_label = file.name;
      this.formeditTransfer.patchValue({
        'autometer_with_engine_on_document' : file
      });
    }
  }

  //// chassis_plate_print copy
  uploadChassisPlatePrintcopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.chassis_plate_print_url = "";
      this.chassis_plate_print_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.chassis_plate_print_url = "";
      this.chassis_plate_print_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.chassis_plate_print_url = event.target.result;
        }
      }
      else{
        this.chassis_plate_print_url = "assets/front/img/pdf-file.png";
      }

      this.chassis_plate_print_url_label = file.name;
      this.formeditTransfer.patchValue({
        'chassis_plate_print_document' : file
      });
    }
  }

  //// previous_insurance_copy copy
  uploadPreviousInsuranceCopycopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.previous_insurance_copy_url = "";
      this.previous_insurance_copy_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.previous_insurance_copy_url = "";
      this.previous_insurance_copy_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.previous_insurance_copy_url = event.target.result;
        }
      }
      else{
        this.previous_insurance_copy_url = "assets/front/img/pdf-file.png";
      }

      this.previous_insurance_copy_url_label = file.name;
      this.formeditTransfer.patchValue({
        'previous_insurance_copy_document' : file
      });
    }
  }

  //// dicky_open copy
  uploadDickyOpencopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.dicky_open_url = "";
      this.dicky_open_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.dicky_open_url = "";
      this.dicky_open_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.dicky_open_url = event.target.result;
        }
      }
      else{
        this.dicky_open_url = "assets/front/img/pdf-file.png";
      }

      this.dicky_open_url_label = file.name;
      this.formeditTransfer.patchValue({
        'dicky_open_document' : file
      });
    }
  }

  //// selfie_with_vehicle copy
  uploadSelfieWithVehiclecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.selfie_with_vehicle_url = "";
      this.selfie_with_vehicle_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.selfie_with_vehicle_url = "";
      this.selfie_with_vehicle_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      if(file_type.toLowerCase() != 'application/pdf')
      {
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.selfie_with_vehicle_url = event.target.result;
        }
      }
      else{
        this.selfie_with_vehicle_url = "assets/front/img/pdf-file.png";
      }

      this.selfie_with_vehicle_url_label = file.name;
      this.formeditTransfer.patchValue({
        'selfie_with_vehicle_document' : file
      });
    }
  }

  submitFormTransfer(){
    this.submittedTransferDetails = true;
    if(this.formeditTransfer.invalid){
      return;
    }

    console.log(this.result);
    
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('endorsement_item_id','23');
    uploadData.append('isRefund','0');
    uploadData.append('noc_document',this.formeditTransfer.value.noc_document);
    uploadData.append('invoice_rc_copy_document',this.formeditTransfer.value.invoice_rc_copy_document);
    uploadData.append('form29_form30_document',this.formeditTransfer.value.form29_form30_document);
    uploadData.append('inpection_report_document',this.formeditTransfer.value.inpection_report_document);
    uploadData.append('front_image_document',this.formeditTransfer.value.front_image_document);
    uploadData.append('rear_image_document',this.formeditTransfer.value.rear_image_document);
    uploadData.append('left_image_document',this.formeditTransfer.value.left_image_document);
    uploadData.append('right_image_document',this.formeditTransfer.value.right_image_document);
    uploadData.append('windscreen_inside_document',this.formeditTransfer.value.windscreen_inside_document);
    uploadData.append('windscreen_outside_document',this.formeditTransfer.value.windscreen_outside_document);
    uploadData.append('autometer_with_engine_on_document',this.formeditTransfer.value.autometer_with_engine_on_document);
    uploadData.append('chassis_plate_print_document',this.formeditTransfer.value.chassis_plate_print_document);
    uploadData.append('previous_insurance_copy_document',this.formeditTransfer.value.previous_insurance_copy_document);
    uploadData.append('dicky_open_document',this.formeditTransfer.value.dicky_open_document);
    uploadData.append('selfie_with_vehicle_document',this.formeditTransfer.value.selfie_with_vehicle_document);

    this.commonService.updatePublicEndorsement(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('public-policy-transfer-endorsement/'+this.policy_no+'/'+this.policy_endorsement_id);
            this.docuploaded=true;
            this.submitbtn=false;
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

} 
