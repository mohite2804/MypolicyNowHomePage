import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { requiredFileType } from "./requireFileTypeValidator";
import { fileSizeValidator } from "./fileSizeValidator";

import { CustomvalidationService } from '../../services/customvalidation.service';
import {NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Router } from  '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-break-in-inspection',
  templateUrl: './break-in-inspection.component.html',
  styleUrls: ['./break-in-inspection.component.css']
})
export class BreakInInspectionComponent implements OnInit {
  [x: string]: any;
  is_set_image_url_from_api : any = 0;
  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  proposal_no : any;
  proposal_id : any;
  breaking_case_id : any;
  public_path : any;
  loaderActive : any;
  resultBreakinTransactionHistory : any;
  resultProposalDetails : any;
  policy_holder_name : any;
  policy_holder_mobile_no : any;
  policy_holder_email : any;
  proposer_address : any;
  state : any;
  city : any;
  proposer_pincode : any;
  registration_no : any;
  chassis_no : any;
  engine_no : any;
  make : any;
  model : any;
  variant : any;
  registration_date : any;
  manufacturing_year : any;
  color : any;
  fuel_type : any;
  ic_name : any;
  breakin_created_date : any;
  breakin_expiry_date : any;
  breakin_details : any;
  formUploadBreakinData: FormGroup;
  submittedBreakinIspectionData: boolean = false;
  validation_for_number_only :any = "^[1-9]*$";

  //inspection report
  inspection_report_url:any;
  inspection_report_label:any;
  inspection_report_url_label

  //upload pdf
  upload_pdf_url:any;
  upload_pdf_label:any;
  upload_pdf_url_label

  //upload front image
  front_image_url:any;
  front_image_label:any;
  front_image_url_label

  //upload front image
  rear_image_url:any;
  rear_image_label:any;
  rear_image_url_label

  //upload left image
  left_image_url:any;
  left_image_label:any;
  left_image_url_label

  //upload right image
  right_image_url:any;
  right_image_label:any;
  right_image_url_label

  //upload chassis/plate print
  car_chassis_print_url:any;
  car_chassis_print_label:any;
  car_chassis_print_url_label

  //upload RC copy
  rc_copy_url:any;
  rc_copy_label:any;
  rc_copy_url_label

  //upload pervious insurances
  pervious_insurances_url:any;
  pervious_insurances_label:any;
  pervious_insurances_url_label

  //upload dicky_open
  dicky_open_url:any;
  dicky_open_label:any;
  dicky_open_url_label

  //upload selfie_with_car
  selfie_with_car_url:any;
  selfie_with_car_label:any;
  selfie_with_car_url_label

  //upload windscreen_inside_outside
  windscreen_inside_outside_url:any;
  windscreen_inside_outside_label:any;
  windscreen_inside_outside_url_label

  //upload windscreen_outside_inside
  windscreen_outside_inside_url:any;
  windscreen_outside_inside_label:any;
  windscreen_outside_inside_url_label

  //upload autometer_engine
  autometer_engine_url:any;
  autometer_engine_label:any;
  autometer_engine_url_label : any;

  is_set_from_api_for_inspection_report_url : boolean = false;
  is_set_from_api_for_upload_pdf_url : boolean = false;
  is_set_from_api_for_front_image_url : boolean = false;
  is_set_from_api_for_rear_image_url : boolean = false;
  is_set_from_api_for_left_image_url : boolean = false;
  is_set_from_api_for_right_image_url : boolean = false;
  is_set_from_api_for_car_chassis_print_url : boolean = false;
  is_set_from_api_for_pervious_insurances_url : boolean = false;
  is_set_from_api_for_dicky_open_url : boolean = false;
  is_set_from_api_for_selfie_with_car_url : boolean = false;
  is_set_from_api_for_windscreen_inside_outside_url : boolean = false;
  is_set_from_api_for_windscreen_outside_inside_url: boolean = false;
  is_set_from_api_for_autometer_engine_url : boolean = false;
  is_set_from_api_for_rc_copy_url : boolean = false;


  constructor(private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {}

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');
      this.token = sessionStorage.getItem("user_token");

      this.proposal_no = sessionStorage.getItem("breakin_proposal_no");
      this.proposal_id = sessionStorage.getItem("breakin_proposal_id");
      this.breaking_case_id = sessionStorage.getItem("breaking_case_id");

      this.validateUserLoginStatus(this.loginUserId,this.token);

      this.validationFormDetails();

      this.getIndex();
  }

  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        this.result = response;
        this.loaderActive = false;
        if(this.result.status){
          //valid status i.e. not login from another location
        }else{
          Swal.fire({
              title: 'error',
              html: 'It seems that you have login from another location. You are logged out from this session?',
              timer: 3500
          }).then((result) => {
              this.router.navigate(['/logout']);
          });
        }



      });
  }

  getIndex(){
    let uploadData = new FormData();
    uploadData.append('proposal_no',this.proposal_no);
    uploadData.append('proposal_id',this.proposal_id);
    uploadData.append('loginUserId',this.loginUserId);

    this.loaderActive = true;

    this.commonService.getBreakinProposalDetails(uploadData)
    .subscribe(response => {

        var outputResult : any = response;

        if(outputResult.status){
          this.resultProposalDetails = outputResult.proposal_detail;
          this.public_path = outputResult.public_path;

          this.resultBreakinDetails = outputResult.breakin_details;

          if(this.resultProposalDetails.breakin_reference_no){
            this.validationFormDetailsForBreakinRef();
          }else{
            this.validationFormDetails();
          }

          this.setImagePathFromApi(outputResult.breakin_details);


          ///////proposer details

          if(this.resultProposalDetails.proposer_type_id==1){
            this.policy_holder_name = this.resultProposalDetails.proposer_first_name+' '+this.resultProposalDetails.proposer_middle_name+' '+this.resultProposalDetails.proposer_last_name;
            this.policy_holder_mobile_no = this.resultProposalDetails.proposer_mobile_no;
            this.policy_holder_email = this.resultProposalDetails.proposer_email;
            this.proposer_address = this.resultProposalDetails.proposer_address1+','+this.resultProposalDetails.proposer_address2;
            this.state = this.resultProposalDetails.proposer_state;
            this.city = this.resultProposalDetails.proposer_city;
            this.proposer_pincode = this.resultProposalDetails.proposer_pincode;
          }else{
            ///////Company details
            this.policy_holder_name = this.resultProposalDetails.company_name;
            this.policy_holder_mobile_no = this.resultProposalDetails.company_owner_mobile;
            this.policy_holder_email = this.resultProposalDetails.company_owner_email;
            this.proposer_address = this.resultProposalDetails.company_owner_address_1+','+this.resultProposalDetails.company_owner_address_2;
            this.state = this.resultProposalDetails.company_owner_state;
            this.city = this.resultProposalDetails.company_owner_city;
            this.proposer_pincode = this.resultProposalDetails.company_owner_pincode;
          }
          

          /////vehicle details
          this.registration_no = this.resultProposalDetails.registration_no_part_1+this.resultProposalDetails.registration_no_part_2+this.resultProposalDetails.registration_no_part_3+this.resultProposalDetails.registration_no_part_4;
          this.chassis_no = this.resultProposalDetails.chassis_no;
          this.engine_no = this.resultProposalDetails.engine_no;
          this.make = this.resultProposalDetails.make;
          this.model = this.resultProposalDetails.model;
          this.variant = this.resultProposalDetails.variant;
          this.registration_date = this.resultProposalDetails.registration_date;
          this.manufacturing_year = this.resultProposalDetails.manufacturing_year;
          this.color = this.resultProposalDetails.vehicle_color;
          this.fuel_type = this.resultProposalDetails.vehicle_fuel;

          //////Insured details
          this.ic_name = this.resultProposalDetails.ic_code;
          this.breakin_created_date = this.resultProposalDetails.breakin_created_date;
          this.breakin_expiry_date = this.resultProposalDetails.breakin_expiry_date;

          // console.log(this.resultProposalDetails);
        }
        else{
          Swal.fire(outputResult.message,  "" ,  "error" );
        }


    });
  }

  setImagePathFromApi(breakin_details){

    this.is_set_from_api_for_inspection_report_url  = true;
    this.is_set_from_api_for_upload_pdf_url  = true;
    this.is_set_from_api_for_front_image_url  = true;
    this.is_set_from_api_for_rear_image_url  = true;
    this.is_set_from_api_for_left_image_url  = true;
    this.is_set_from_api_for_right_image_url  = true;
    this.is_set_from_api_for_car_chassis_print_url  = true;
    this.is_set_from_api_for_pervious_insurances_url  = true;
    this.is_set_from_api_for_dicky_open_url  = true;
    this.is_set_from_api_for_selfie_with_car_url  = true;
    this.is_set_from_api_for_windscreen_inside_outside_url  = true;
    this.is_set_from_api_for_windscreen_outside_inside_url = true;
    this.is_set_from_api_for_autometer_engine_url  = true;
    this.is_set_from_api_for_rc_copy_url = true;


    let breaking_case_id =this.resultProposalDetails.breaking_case_id;
    this.inspection_report_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.inspection_report_image;
    this.upload_pdf_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.pdf_doc;
    this.rear_image_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.rear_image;
    this.front_image_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.front_image;
    this.left_image_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.left_image;
    this.right_image_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.right_image;
    this.car_chassis_print_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.car_chassis_print;
    this.rc_copy_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.rc_copy;
    this.pervious_insurances_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.pervious_insurances;
    this.dicky_open_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.dicky_open;
    this.selfie_with_car_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.selfie_with_car;
    this.windscreen_inside_outside_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.windscreen_inside_outside;
    this.windscreen_outside_inside_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.windscreen_outside_inside;
    this.autometer_engine_url = this.public_path+"break-in-case/"+breaking_case_id+'/'+breakin_details.autometer_engine;

    this.formUploadBreakinData.patchValue({
      inspection_report_image : breakin_details.inspection_report_image,
      pdf_doc : breakin_details.pdf_doc,
      front_image : breakin_details.front_image,
      rear_image : breakin_details.rear_image,
      left_image : breakin_details.left_image,
      right_image : breakin_details.right_image,
      car_chassis_print : breakin_details.car_chassis_print,
      rc_copy : breakin_details.rc_copy,
      pervious_insurances : breakin_details.pervious_insurances,
      dicky_open : breakin_details.dicky_open,
      selfie_with_car : breakin_details.selfie_with_car,
      windscreen_inside_outside : breakin_details.windscreen_inside_outside,
      windscreen_outside_inside : breakin_details.windscreen_outside_inside,
      autometer_engine : breakin_details.autometer_engine,
      breakin_reference_no : this.resultProposalDetails.breakin_reference_no
    });
    this.loaderActive = false;
  }

  validationFormDetails(){
    this.formUploadBreakinData = this.formBuilder.group({
      inspection_report_image : ['',[Validators.required]],
      pdf_doc : ['',[Validators.required]],
      front_image : ['',[Validators.required]],
      rear_image : ['',[Validators.required]],
      left_image : ['',[Validators.required]],
      right_image : ['',[Validators.required]],
      car_chassis_print : ['',[Validators.required]],
      rc_copy : [''],
      pervious_insurances : [''],
      dicky_open : ['',[Validators.required]],
      selfie_with_car : [''],
      windscreen_inside_outside : ['',[Validators.required]],
      windscreen_outside_inside : ['',[Validators.required]],
      autometer_engine : ['',[Validators.required]],
      breakin_reference_no : ['',[Validators.min(1),Validators.pattern(this.validation_for_number_only)]]
    });
  }

  validationFormDetailsForBreakinRef(){
    this.formUploadBreakinData = this.formBuilder.group({
      inspection_report_image : [''],
      pdf_doc : [''],
      front_image : [''],
      rear_image : [''],
      left_image : [''],
      right_image : [''],
      car_chassis_print : [''],
      rc_copy : [''],
      pervious_insurances : [''],
      dicky_open : [''],
      selfie_with_car : [''],
      windscreen_inside_outside : [''],
      windscreen_outside_inside : [''],
      autometer_engine : [''],
      breakin_reference_no :['',[Validators.required,Validators.min(1),Validators.pattern(this.validation_for_number_only)]]
    });
  }

  /////////Inspection report image
  uploadInspectionReportImage(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.inspection_report_url = "";
      this.inspection_report_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.inspection_report_url = "";
      this.inspection_report_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.inspection_report_url = event.target.result;
      }
      this.inspection_report_url_label = file.name;
      this.is_set_from_api_for_inspection_report_url = false;
      this.formUploadBreakinData.patchValue({
        'inspection_report_image' : file
      });
    }
  }

  /////////Upload PDF
  uploadPdf(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'pdf' file",  "" ,  "error" );
      this.upload_pdf_url = "";
      this.upload_pdf_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.upload_pdf_url = "";
      this.upload_pdf_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.upload_pdf_url = event.target.result;
      }
      this.upload_pdf_url_label = file.name;
      this.upload_pdf_url = this.public_path+"pdf_image.png";
      console.log("abcd:-"+this.upload_pdf_url);
      this.is_set_from_api_for_upload_pdf_url = false;
      this.formUploadBreakinData.patchValue({
        'pdf_doc' : file
      });
    }
  }

  /////////Front Image
  uploadFrontImage(event){

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
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.front_image_url = event.target.result;
      }
      this.front_image_url_label = file.name;
      this.is_set_from_api_for_front_image_url = false;
      this.formUploadBreakinData.patchValue({
        'front_image' : file
      });
    }
  }

  /////////Rear Image
  uploadRearImage(event){

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
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rear_image_url = event.target.result;
      }
      this.rear_image_url_label = file.name;
      this.is_set_from_api_for_rear_image_url = false;
      this.formUploadBreakinData.patchValue({
        'rear_image' : file
      });
    }
  }

  /////////Left Image
  uploadLeftImage(event){

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
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.left_image_url = event.target.result;
      }
      this.left_image_url_label = file.name;
      this.is_set_from_api_for_left_image_url = false;
      this.formUploadBreakinData.patchValue({
        'left_image' : file
      });
    }
  }

  /////////Right Image
  uploadRightImage(event){

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
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.right_image_url = event.target.result;
      }
      this.right_image_url_label = file.name;
      this.is_set_from_api_for_right_image_url = false;
      this.formUploadBreakinData.patchValue({
        'right_image' : file
      });
    }
  }

  /////////Chassis Plate Print
  uploadChassisPlatePrint(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.car_chassis_print_url = "";
      this.car_chassis_print_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.car_chassis_print_url = "";
      this.car_chassis_print_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.car_chassis_print_url = event.target.result;
      }
      this.car_chassis_print_url_label = file.name;
      this.is_set_from_api_for_car_chassis_print_url = false;
      this.formUploadBreakinData.patchValue({
        'car_chassis_print' : file
      });
    }
  }

  /////////RC Copy
  uploadRcCopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rc_copy_url = "";
      this.rc_copy_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rc_copy_url = "";
      this.rc_copy_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rc_copy_url = event.target.result;
      }
      this.rc_copy_url_label = file.name;
      this.is_set_from_api_for_rc_copy_url = false;
      this.formUploadBreakinData.patchValue({
        'rc_copy' : file
      });
    }
  }

  /////////Previous Insurance
  uploadPreviousInsurance(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.pervious_insurances_url = "";
      this.pervious_insurances_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.pervious_insurances_url = "";
      this.pervious_insurances_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.pervious_insurances_url = event.target.result;
      }
      this.pervious_insurances_url_label = file.name;
      this.is_set_from_api_for_pervious_insurances_url = false;
      this.formUploadBreakinData.patchValue({
        'pervious_insurances' : file
      });
    }
  }

  /////////Dicky open
  uploadDickyOpen(event){

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
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.dicky_open_url = event.target.result;
      }
      this.dicky_open_url_label = file.name;
      this.is_set_from_api_for_dicky_open_url = false;
      this.formUploadBreakinData.patchValue({
        'dicky_open' : file
      });
    }
  }

  /////////Selfie with car
  uploadSelfieWithCar(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.selfie_with_car_url = "";
      this.selfie_with_car_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.selfie_with_car_url = "";
      this.selfie_with_car_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.selfie_with_car_url = event.target.result;
      }
      this.selfie_with_car_url_label = file.name;
      this.is_set_from_api_for_selfie_with_car_url = false;
      this.formUploadBreakinData.patchValue({
        'selfie_with_car' : file
      });
    }
  }

  /////////Windscreen inside outside
  uploadWindscreenInsideOutside(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_inside_outside_url = "";
      this.windscreen_inside_outside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_inside_outside_url = "";
      this.windscreen_inside_outside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.windscreen_inside_outside_url = event.target.result;
      }
      this.windscreen_inside_outside_url_label = file.name;
      this.is_set_from_api_for_windscreen_inside_outside_url = false;
      this.formUploadBreakinData.patchValue({
        'windscreen_inside_outside' : file
      });
    }
  }

  /////////Windscreen outside inside
  uploadWindscreenOutsideInside(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.windscreen_outside_inside_url = "";
      this.windscreen_outside_inside_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.windscreen_outside_inside_url = "";
      this.windscreen_outside_inside_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.windscreen_outside_inside_url = event.target.result;
      }
      this.windscreen_outside_inside_url_label = file.name;
      this.is_set_from_api_for_windscreen_outside_inside_url = false;
      this.formUploadBreakinData.patchValue({
        'windscreen_outside_inside' : file
      });
    }
  }

  /////////Autometer Engine
  uploadAutometerEngine(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.autometer_engine_url = "";
      this.autometer_engine_url_label = "";
    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.autometer_engine_url = "";
      this.autometer_engine_url_label = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.autometer_engine_url = event.target.result;
      }
      this.autometer_engine_url_label = file.name;
      this.is_set_from_api_for_autometer_engine_url = false;
      this.formUploadBreakinData.patchValue({
        'autometer_engine' : file
      });
    }
  }

  checkIsBreakinRefNo(event: any){
    var val=event.target.value;
    if(val==''|| val=='null'){
      this.validationFormDetails();
    }else{
      this.validationFormDetailsForBreakinRef();
      this.formUploadBreakinData.patchValue({
        breakin_reference_no : val
      });
    }
  }

  submitFormUploadBreakinData(){

    this.submittedBreakinIspectionData = true;
    if(this.formUploadBreakinData.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('proposal_no',this.proposal_no);
    uploadData.append('proposal_id',this.proposal_id);
    uploadData.append('breaking_case_id',this.breaking_case_id);

    uploadData.append('inspection_report_image',this.formUploadBreakinData.value.inspection_report_image);
    uploadData.append('pdf_doc',this.formUploadBreakinData.value.pdf_doc);
    uploadData.append('front_image',this.formUploadBreakinData.value.front_image);
    uploadData.append('rear_image',this.formUploadBreakinData.value.rear_image);
    uploadData.append('left_image',this.formUploadBreakinData.value.left_image);
    uploadData.append('right_image',this.formUploadBreakinData.value.right_image);
    uploadData.append('car_chassis_print',this.formUploadBreakinData.value.car_chassis_print);
    uploadData.append('rc_copy',this.formUploadBreakinData.value.rc_copy);
    uploadData.append('pervious_insurances',this.formUploadBreakinData.value.pervious_insurances);
    uploadData.append('dicky_open',this.formUploadBreakinData.value.dicky_open);
    uploadData.append('selfie_with_car',this.formUploadBreakinData.value.selfie_with_car);
    uploadData.append('windscreen_inside_outside',this.formUploadBreakinData.value.windscreen_inside_outside);
    uploadData.append('windscreen_outside_inside',this.formUploadBreakinData.value.windscreen_outside_inside);
    uploadData.append('autometer_engine',this.formUploadBreakinData.value.autometer_engine);
    uploadData.append('breakin_reference_no',this.formUploadBreakinData.value.breakin_reference_no);

    this.commonService.submitFormBreakInCaseData(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          Swal.fire({
            title: '',
            html: outputResult.message,
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/break-in-case');
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
