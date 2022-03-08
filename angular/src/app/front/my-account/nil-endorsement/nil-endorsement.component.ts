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
  selector: 'app-endorsement',
  templateUrl: './nil-endorsement.component.html',
  styleUrls: ['./nil-endorsement.component.css']
})
export class NilendorsementComponent implements OnInit {
  [x: string]: any;

  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  loaderActive : any;

  UploadValue: boolean = false;
  fileChangeFunCalled: boolean = false;

  date_picker_dob: NgbDateStruct;

rccopyAgreementurl_label : any;
customerletterColorurl_label : any;
customerletterRegNourl_label : any;
rccopyEngineNourl_label : any;
rccopyChassisNourl_label : any;
customerletterNomineeAgeurl_label : any;
customerletterNomineeRelationurl_label : any;
customerletterDOBurl_label : any;
rccopyDOBurl_label : any;
customerletterAddressurl_label : any;
name_invoiceurl_label : any;

customerletterChassisNourl_label : any;
customerletterEngineNourl_label : any;
rccopyRegNourl_label : any;
rccopyColorurl_label : any;
invoice_copyurl_label : any;
financierletterurl_label : any;
customerletterAgreementurl_label : any;

displayAppointee : any;

  div_show_endorsement_new : boolean = false;
  div_show_endorsement_status : boolean = true;
  div_show_endorsement_referback : boolean = true;

  acceptedExtensions = "jpg, jpeg, pdf";

  validation_for_reg_1 :any = "^[a-zA-Z]{1,3}$";
  validation_for_reg_2 :any = "^[0-9]{1,4}$";

  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_character :any = "^[a-zA-Z]+$";
  validation_for_address :any = "^[a-zA-Z0-9 \,\-\/]*$";



  validation_for_number_only :any = "^[0-9]*$";
  //validation_for_engine_no :any = "^([a-zA-Z0-9]){5,22}$";

  //validation_for_engine_no :any = "^(?!0{5,22})([a-zA-Z0-9]){5,22}$";

//  validation_for_engine_no :any = "^(?!0{22})([a-zA-Z0-9]){5,22}$";
  validation_for_engine_no :any = "^(?!0{22})([a-zA-Z0-9]){5,22}$";

  //validation_for_chassis_no :any = "^([a-zA-Z0-9]){17}$";
  validation_for_chassis_no :any = "^(?!0{17})([a-zA-Z0-9]){17}$";

  validation_for_policy_no :any = "^[a-zA-Z0-9\/]+$";
  validation_for_electriacal :any = "^[0-9]{3,6}$";
  validation_for_aa_membership_no :any = "^[0-9a-zA-Z]+$";
  validation_for_pincode :any =  "^[0-9]{6}$";
  //validation_for_name_with_space :any = "^[a-zA-Z_ ]*$";
 // validation_for_character :any = "^[a-zA-Z\'\-]+$";
  //validation_for_email :any = "^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$";
  validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
  //validation_for_address :any = "^[a-zA-Z0-9_ ]*$";
  validation_for_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_aadhar_card :any = "^[0-9]{12}$";
  validation_for_age :any = "^[0-9]{1,2}$";
  validation_for_company_pan :any = "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}";
  validation_for_company_gst_no :any = "^[a-zA-Z0-9]+$";

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //name
  formeditName: FormGroup;
  submittedNameDetails: boolean = false;
  invoiceurl:any;
  customerletterurl:any;
  name_invoicelabel:any;

  //Address
  formeditAddress: FormGroup;
  submittedAddressDetails: boolean = false;
  customerletterAddressurl:any;
  customerletterAddresslabel:any;


  //Contact Email
  formeditContactEmail: FormGroup;
  submittedContactEmail: boolean = false;

  //DOB
  formeditDOB: FormGroup;
  submittedDOB: boolean = false;
  rccopyDOBurl : any;
  customerletterDOBurl : any;
  rccopyDOBlabel : any;
  customerletterDOBlabel : any;

  //Nomminee Name
  formeditNomineeName: FormGroup;
  submittedNomineeName: boolean = false;
  customerletterNomineeNameurl:any;
  customerletterNomineeNamelabel:any;
  proofNomineeNameurl:any;
  proofNomineeNamelabel:any;

  //Nomminee Relation
  formeditNomineeRelation: FormGroup;
  submittedNomineeRelation: boolean = false;
  customerletterNomineeRelationurl:any;
  customerletterNomineeRelationlabel:any;
  proofNomineeRelationurl:any;
  proofNomineeRelationlabel:any;

  //Nomminee Age
  formeditNomineeAge: FormGroup;
  submittedNomineeAge: boolean = false;
  customerletterNomineeAgeurl:any;
  customerletterNomineeAgelabel:any;
  proofNomineeAgeurl:any;
  proofNomineeAgelabel:any;

  //Chassis Number
  formeditChassisNo: FormGroup;
  submittedChassisNo: boolean = false;
  rccopyChassisNourl:any;
  customerletterChassisNourl:any;
  rccopyChassisNolabel:any;
  customerletterChassisNolabel:any;

  //Engine No
  formeditEngineNo: FormGroup;
  submittedEngineNo: boolean = false;
  rccopyEngineNourl:any;
  customerletterEngineNourl:any;
  rccopyEngineNolabel:any;
  customerletterEngineNolabel:any;

  //Reg No
  formeditRegNo: FormGroup;
  submittedRegNo: boolean = false;
  rccopyRegNourl:any;
  customerletterRegNourl:any;
  rccopyRegNolabel:any;
  customerletterRegNolabel:any;

  //Color
  formeditColor: FormGroup;
  submittedColor: boolean = false;
  rccopyColorurl:any;
  customerletterColorurl:any;
  rccopyColorlabel:any;
  customerletterColorlabel:any;

  //Agreement
  formeditAgreement: FormGroup;
  submittedAgreement: boolean = false;

  financierletterurl:any;
  invoice_copyurl:any;
  rccopyAgreementurl:any;
  customerletterAgreementurl:any;

  financierletterlabel:any;
  invoice_copylabel:any;
  rccopyAgreementlabel:any;
  customerletterAgreementlabel:any;

  result : any;
  policy_no : any;
  policy_endorsement_id : any;
  item_id : any;

  date_picker_pre_policy_expire_date : NgbDateStruct;

  salutation :any;
  agreement_types :any;
  rto :any;
  vehicle_color :any;
  bank_master :any;
  relations :any;

  //minDate = undefined;

  minDate  : NgbDateStruct;
  maxDateForBirthdate : NgbDateStruct;


  //sub tab
  edit_name_tab : boolean = true;
  edit_address_tab : boolean = true;
  edit_contact_email_tab : boolean = true;
  edit_dob_tab : boolean = true;
  edit_nominee_name_tab : boolean = true;
  edit_nominee_relation_tab : boolean = true;
  edit_nominee_age_tab : boolean = true;
  edit_chassis_no_tab : boolean = true;
  edit_engine_no_tab : boolean = true;
  edit_regno_tab : boolean = true;
  edit_vehicle_color_tab : boolean = true;
  edit_agreement_tab : boolean = true;

  activeTab = 'nil-endorsement-tab1';


  registration_no_part_3_val : any;
  registration_no_part_4_val : any;

  policy_type_name : any;
  policy_subtype_name : any;

  is_endorsment : boolean = false;
  endorsement_data:any;
  public_path:any;

  constructor(private customvalidationService: CustomvalidationService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private config: NgbDatepickerConfig) {
  	 const current = new Date();
      this.minDate = {
        year: current.getFullYear()-18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.maxDateForBirthdate = {
        year: current.getFullYear() - 18,
        month: current.getMonth() + 1,
        day: current.getDate()
      };
  }

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');
      this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);

      this.displayAppointee = 'none';

  		this.policy_no  = sessionStorage.getItem('policy_no');
      this.policy_endorsement_id  = sessionStorage.getItem('policy_endorsement_id');
      this.item_id  = sessionStorage.getItem('item_id');

      this.checkdisplay();

      let uploadData = new FormData();
      uploadData.append('policy_number',this.policy_no);
      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('loginUserType',this.loginUserType);
      uploadData.append('endorsement_id',this.policy_endorsement_id);

      this.loaderActive = true;
      this.commonService.submitEndorsmentFilterDetails(uploadData)
      .subscribe(response => {
          var outputResult : any = response;
          this.loaderActive = false;
          if(outputResult.status){
            this.result = outputResult.result[0];
            this.public_path=outputResult.public_path;
            this.endorsement_data=outputResult.endorsement_data;
            this.salutation = outputResult.salutation;
            this.agreement_types = outputResult.agreement_types;
            this.rto = outputResult.rto;
            this.vehicle_color = outputResult.vehicle_color;
            this.bank_master = outputResult.bank_master;
            this.relations = outputResult.relations;

            this.policy_type_name = this.result?.policy_type_name;
            this.policy_subtype_name = this.result?.policy_subtype_name;

            this.formeditName.patchValue({
              ed_salutation : this.is_endorsment ? this.endorsement_data.ed_salutation: this.result.salutation_name,
              ed_first_name : this.is_endorsment ? this.endorsement_data.ed_first_name: this.result.proposer_first_name,
              ed_middle_name :this.is_endorsment ? this.endorsement_data.ed_middle_name: this.result.proposer_middle_name,
              ed_last_name : this.is_endorsment ? this.endorsement_data.ed_last_name: this.result.proposer_last_name,
              remark_name : this.is_endorsment ? this.endorsement_data.remark: this.endorsement_data.remark,
              invoice_copy : this.is_endorsment ? this.endorsement_data.invoice_copy_path: '',
            });
            this.invoiceurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;

            this.formeditAddress.patchValue({
              ed_address_1 :this.is_endorsment ? this.endorsement_data.ed_address_1: this.result.proposer_address1,
              ed_address_2 :this.is_endorsment ? this.endorsement_data.ed_address_2: this.result.proposer_address2,
              ed_pincode :this.is_endorsment ? this.endorsement_data.ed_pincode: this.result.proposer_pincode,
              ed_city :this.is_endorsment ? this.endorsement_data.ed_city: this.result.proposer_city_name,
              ed_state :this.is_endorsment ? this.endorsement_data.ed_state: this.result.proposer_state_name,
              remark_address : this.is_endorsment ? this.endorsement_data.remark: '',
              customerletter_address : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
            });

            this.customerletterAddressurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.formeditContactEmail.patchValue({
              ed_contact :this.is_endorsment ? this.endorsement_data.ed_contact: this.result.proposer_mobile_no,
              ed_email :this.is_endorsment ? this.endorsement_data.ed_email: this.result.proposer_email,
              remark_contact_email : this.is_endorsment ? this.endorsement_data.remark: ''
            });


            if(this.result?.proposer_type_id == 1){
              this.formeditNomineeName.patchValue({
                nominee_salutation :this.is_endorsment ? this.endorsement_data.nominee_salutation: this.result.nominee_salutation_name,
                nominee_first_name :this.is_endorsment ? this.endorsement_data.nominee_first_name: this.result.nominee_first_name,
                nominee_middle_name :this.is_endorsment ? this.endorsement_data.nominee_middle_name: this.result.nominee_middle_name,
                nominee_last_name :this.is_endorsment ? this.endorsement_data.nominee_last_name: this.result.nominee_last_name,

                appointee_salutation_id :this.is_endorsment ? this.endorsement_data.appointee_salutation_id: this.result.appointee_salutation,
                appointee_first_name :this.is_endorsment ? this.endorsement_data.appointee_first_name: this.result.appointee_first_name,
                appointee_middle_name :this.is_endorsment ? this.endorsement_data.appointee_middle_name: this.result.appointee_middle_name,
                appointee_last_name :this.is_endorsment ? this.endorsement_data.appointee_last_name: this.result.appointee_last_name,
                remark_nominee_name : this.is_endorsment ? this.endorsement_data.remark: '',
                customerletter_nominee_name : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
                proof_nominee_name : this.is_endorsment ? this.endorsement_data.nominee_proof_path: '',

              });

              this.customerletterNomineeNameurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

              this.proofNomineeNameurl=this.public_path+'endorsement/nominee_proof/'+this.endorsement_data.nominee_proof_path;

              this.formeditNomineeRelation.patchValue({
                nominee_relation : this.is_endorsment ? this.endorsement_data.nominee_relation: this.result.nominee_relation_name,
                appointee_relationship_id :this.is_endorsment ? this.endorsement_data.appointee_relationship_id: this.result.appointee_relation_name,
                remark_nominee_relation : this.is_endorsment ? this.endorsement_data.remark: '',

                customerletter_nominee_relation : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
                proof_nominee_relation : this.is_endorsment ? this.endorsement_data.nominee_proof_path: '',
              });

              this.customerletterNomineeRelationurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

              this.proofNomineeRelationshipurl=this.public_path+'endorsement/nominee_proof/'+this.endorsement_data.nominee_proof_path;

              this.formeditNomineeAge.patchValue({
                nominee_age :this.is_endorsment ? this.endorsement_data.nominee_age: this.result.nominee_age,
                ed_appointee_salutation :this.is_endorsment ? this.endorsement_data.ed_appointee_salutation: this.result.appointee_salutation,
                ed_appointee_first_name : this.is_endorsment ? this.endorsement_data.ed_appointee_first_name: this.result.appointee_first_name,
                ed_appointee_middle_name :this.is_endorsment ? this.endorsement_data.ed_appointee_middle_name: this.result.appointee_middle_name,
                ed_appointee_last_name : this.is_endorsment ? this.endorsement_data.ed_appointee_last_name: this.result.appointee_last_name,
                ed_appointee_age :  this.is_endorsment ? this.endorsement_data.ed_appointee_age: this.result.appointee_age,
                ed_appointee_relation : this.is_endorsment ? this.endorsement_data.ed_appointee_relation: this.result.appointee_relation_name,
                remark_nominee_age: this.is_endorsment ? this.endorsement_data.remark: '',
                customerletter_nominee_age : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
                proof_nominee_age : this.is_endorsment ? this.endorsement_data.nominee_proof_path: '',
              });

              this.customerletterNomineeAgeurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

              this.proofNomineeAgeurl=this.public_path+'endorsement/nominee_proof/'+this.endorsement_data.nominee_proof_path;

              var current_date : any = new Date(this.is_endorsment ? this.endorsement_data.ed_dob:this.result.proposer_dob);
              this.date_picker_dob = { year: current_date.getFullYear(), month: current_date.getMonth() + 1 ,day: current_date.getDate() };
              this.formeditDOB.patchValue({
                ed_dob : this.is_endorsment ? this.endorsement_data.ed_dob:this.result.proposer_dob,
                remark_dob: this.is_endorsment ? this.endorsement_data.remark: '',
                idproof_dob : this.is_endorsment ? this.endorsement_data.idproof_path: '',
                customerletter_dob : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
              });

              this.rccopyDOBurl=this.public_path+'endorsement/idproof/'+this.endorsement_data.idproof_path;
              this.customerletterDOBurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

              if(this.result?.nominee_age<18){
                this.displayAppointee = 'block';  //show otp form
              }
            }

            this.formeditChassisNo.patchValue({
              chassis_no :this.is_endorsment ? this.endorsement_data.chassis_no: this.result.chassis_no,
              remark_chassis_no : this.is_endorsment ? this.endorsement_data.remark: '',
              rccopy_chassis_no : this.is_endorsment ? this.endorsement_data.rccopy_path: '',
              customerletter_chassis_no : this.is_endorsment ? this.endorsement_data.nominee_proof_path: '',
            });

            this.rccopyChassisNourl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;

            this.customerletterChassisNourl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.formeditEngineNo.patchValue({
              engine_no :this.is_endorsment ? this.endorsement_data.engine_no: this.result.engine_no,
              remark_engine_no: this.is_endorsment ? this.endorsement_data.remark: '',
              customerletter_engine_no : this.is_endorsment ? this.endorsement_data.customerletter_path: '',
              rccopy_engine_no:this.is_endorsment?this.endorsement_data.nominee_proof_path: '',
            });

            this.rccopyChassisNourl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;

            this.customerletterChassisNourl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.formeditRegNo.patchValue({
              rto :this.is_endorsment ? this.endorsement_data.rto: this.result.rto_name,
              reg_no_1 :this.is_endorsment ? this.endorsement_data.reg_no_1: this.result.registration_no_part_3,
              reg_no_2 :this.is_endorsment ? this.endorsement_data.reg_no_2: this.result.registration_no_part_4,
              remark_reg: this.is_endorsment ? this.endorsement_data.remark: '',
              rccopy_reg : this.is_endorsment ? this.endorsement_data.rccopy_path: '',
              customerletter_reg:this.is_endorsment?this.endorsement_data.customerletter_path: '',

            });
            this.rccopyRegNourl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;
            this.customerletterRegNourl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

            this.formeditColor.patchValue({
              vehicle_color : this.result?.vehicle_color
            });

            this.formeditAgreement.patchValue({
              agreement :this.is_endorsment ? this.endorsement_data.agreement: this.result.agreement_type,
              bank :this.is_endorsment ? this.endorsement_data.bank: this.result.bank_name,
              remark_agreement: this.is_endorsment ? this.endorsement_data.remark: '',
              invoice_copy : this.is_endorsment ? this.endorsement_data.invoice_copy_path: '',
              financierletter : this.is_endorsment ? this.endorsement_data.financierletter_path: '',
              rccopy_agreement : this.is_endorsment ? this.endorsement_data.rccopy_path: '',
              customerletter_agreement:this.is_endorsment?this.endorsement_data.customerletter_path: '',

            });

            this.invoice_copyurl=this.public_path+'endorsement/invoice_copy/'+this.endorsement_data.invoice_copy_path;

            this.financierletterurl=this.public_path+'endorsement/financierletter/'+this.endorsement_data.financierletter_path;

            this.rccopyAgreementurl=this.public_path+'endorsement/rccopy/'+this.endorsement_data.rccopy_path;

            this.customerletterAgreementurl=this.public_path+'endorsement/customerletter/'+this.endorsement_data.customerletter_path;

          }
      });



      this.validationFormNameDetails();
      this.validationFormAddressDetails();
      this.validationFormContactEmailDetails();
      this.validationFormDOBDetails();
      this.validationFormNomineeNameDetails();
      this.validationFormAppointeeDetails();

      this.validationFormNomineeRelationDetails();
      this.validationFormNomineeAgeDetails();
      this.validationFormChassisNoDetails();

      this.validationFormEngineNoDetails();
      this.validationFormRegNoDetails();
      this.validationFormColorDetails();

      this.validationFormAgreementDetails();
  }

  validateUserLoginStatus(loginUserId,token){
    this.loaderActive = true;
      let uploadData = new FormData();

      uploadData.append('loginUserId',this.loginUserId);
      uploadData.append('token',token);

      this.commonService.validateUserLoginStatus(uploadData)
      .subscribe(response => {
        this.result = response;
        //this.loaderActive = false;
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

  checkdisplay(){
      if(this.item_id!='' && this.policy_endorsement_id!=''){
        this.is_endorsment=true;
          switch(this.item_id){
            case '1' :
              this.activeTab = 'nil-endorsement-tab1';
              this.edit_name_tab = false;
            break;
            case '5' :
              this.activeTab = 'nil-endorsement-tab1';
              this.edit_address_tab = false;
            break;
            case '7' :
              this.activeTab = 'nil-endorsement-tab1';
              this.edit_contact_email_tab = false;
            break;
            case '8' :
              this.activeTab = 'nil-endorsement-tab1';
              this.edit_dob_tab = false;
            break;
            case '13' :
              this.activeTab = 'nil-endorsement-tab2';
              this.edit_nominee_name_tab = false;
            break;
            case '11' :
              this.activeTab = 'nil-endorsement-tab2';
              this.edit_nominee_relation_tab = false;
            break;
            case '6' :
              this.activeTab = 'nil-endorsement-tab2';
              this.edit_nominee_age_tab = false;
            break;
            case '14' :
              this.activeTab = 'nil-endorsement-tab3';
              this.edit_chassis_no_tab = false;
            break;
            case '3' :
              this.activeTab = 'nil-endorsement-tab3';
              this.edit_engine_no_tab = false;
            break;
            case '9' :
              this.activeTab = 'nil-endorsement-tab3';
              this.edit_regno_tab = false;
            break;
            case '4' :
              this.activeTab = 'nil-endorsement-tab3';
              this.edit_vehicle_color_tab = false;
            break;
            case '10' :
              this.activeTab = 'nil-endorsement-tab4';
              this.edit_agreement_tab = false;
            break;

          }

      }else{

        this.edit_name_tab = false;
        this.edit_address_tab = false;
        this.edit_contact_email_tab = false;
        this.edit_dob_tab = false;
        this.edit_nominee_name_tab = false;
        this.edit_nominee_relation_tab = false;
        this.edit_nominee_age_tab = false;
        this.edit_chassis_no_tab = false;
        this.edit_engine_no_tab = false;
        this.edit_regno_tab = false;
        this.edit_vehicle_color_tab = false;
        this.edit_agreement_tab = false;
      }
  }

  submitFormEditName(){

    this.submittedNameDetails = true;
    if(this.formeditName.invalid){
      return;
    }
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','1');

    uploadData.append('ed_salutation',this.formeditName.value.ed_salutation);
    uploadData.append('ed_first_name',this.formeditName.value.ed_first_name);
    uploadData.append('ed_middle_name',this.formeditName.value.ed_middle_name);
    uploadData.append('ed_last_name',this.formeditName.value.ed_last_name);

    uploadData.append('ed_salutation_existing',this.result?.salutation_name);
    uploadData.append('ed_first_name_existing',this.result?.proposer_first_name);
    uploadData.append('ed_middle_name_existing',this.result?.proposer_middle_name);
    uploadData.append('ed_last_name_existing',this.result?.proposer_last_name);


    uploadData.append('invoice_copy',this.formeditName.value.invoice_copy);
    uploadData.append('remark_name',this.formeditName.value.remark_name);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
      this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){

          Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditAddress(){

    this.submittedAddressDetails = true;
    if(this.formeditAddress.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','5');

    uploadData.append('ed_address_1',this.formeditAddress.value.ed_address_1);
    uploadData.append('ed_address_2',this.formeditAddress.value.ed_address_2);
    uploadData.append('ed_pincode',this.formeditAddress.value.ed_pincode);
    uploadData.append('ed_city',this.formeditAddress.value.ed_city);
    uploadData.append('ed_state',this.formeditAddress.value.ed_state);


    uploadData.append('ed_address_1_existing',this.result?.proposer_address1);
    uploadData.append('ed_address_2_existing',this.result?.proposer_address2);
    uploadData.append('ed_pincode_existing',this.result?.proposer_pincode);
    uploadData.append('ed_city_existing',this.result?.proposer_city_name);
    uploadData.append('ed_state_existing',this.result?.proposer_state_name);

    uploadData.append('customerletter_address',this.formeditAddress.value.customerletter_address);
    uploadData.append('remark_address',this.formeditAddress.value.remark_address);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }


  submitFormEditContactEmail(){

    this.submittedContactEmail = true;
    if(this.formeditContactEmail.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','7');

    uploadData.append('ed_contact_existing',this.result?.proposer_mobile_no);
    uploadData.append('ed_email_existing',this.result?.proposer_email);

    uploadData.append('ed_contact',this.formeditContactEmail.value.ed_contact);
    uploadData.append('ed_email',this.formeditContactEmail.value.ed_email);

    uploadData.append('remark_contact_email',this.formeditContactEmail.value.remark_contact_email);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditDOB(){

    this.submittedDOB = true;
    if(this.formeditDOB.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','8');

    var day : any = (this.formeditDOB.value.ed_dob.day < 10 ? '0' : '') + this.formeditDOB.value.ed_dob.day;
    var month : any = (this.formeditDOB.value.ed_dob.month < 10 ? '0' : '') + this.formeditDOB.value.ed_dob.month;
    var year :any =  this.formeditDOB.value.ed_dob.year;
    var selected_date : any = year+'-'+month+'-'+day;

    //uploadData.append('ed_dob',selected_date);
    uploadData.append('ed_dob',this.formeditDOB.value.ed_dob);

    uploadData.append('ed_dob_existing',this.result?.proposer_dob);

    uploadData.append('idproof_dob',this.formeditDOB.value.idproof_dob);
    uploadData.append('customerletter_dob',this.formeditDOB.value.customerletter_dob);
    uploadData.append('remark_dob',this.formeditDOB.value.remark_dob);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditNomineeName(){

    this.submittedNomineeName = true;
    if(this.formeditNomineeName.invalid){
      console.log(this.formeditNomineeName)
      return;

    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','13');

    uploadData.append('nominee_salutation',this.formeditNomineeName.value.nominee_salutation);
    uploadData.append('nominee_first_name',this.formeditNomineeName.value.nominee_first_name);
    uploadData.append('nominee_middle_name',this.formeditNomineeName.value.nominee_middle_name);
    uploadData.append('nominee_last_name',this.formeditNomineeName.value.nominee_last_name);

    uploadData.append('nominee_salutation_existing',this.result?.nominee_salutation_name);
    uploadData.append('nominee_first_name_existing',this.result?.nominee_first_name);
    uploadData.append('nominee_middle_name_existing',this.result?.nominee_middle_name);
    uploadData.append('nominee_last_name_existing',this.result?.nominee_last_name);

    uploadData.append('customerletter',this.formeditNomineeName.value.customerletter_nominee_name);
    uploadData.append('nominee_proof',this.formeditNomineeName.value.proof_nominee_name);

    uploadData.append('remark_nominee_name',this.formeditNomineeName.value.remark_nominee_name);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditNomineeRelation(){

    this.submittedNomineeRelation = true;
    if(this.formeditNomineeRelation.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','11');

    uploadData.append('nominee_relation',this.formeditNomineeRelation.value.nominee_relation);

    uploadData.append('nominee_relation_existing',this.result?.nominee_relation_name);

    uploadData.append('customerletter',this.formeditNomineeRelation.value.customerletter_nominee_relation);
    uploadData.append('nominee_proof',this.formeditNomineeRelation.value.proof_nominee_relation);

    uploadData.append('remark_nominee_relation',this.formeditNomineeRelation.value.remark_nominee_relation);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  nomineeAge(event,from_data,proposer_type_data){
    var event_new : any  =  parseInt(event);
    if(proposer_type_data == 1){
      if(event_new < 18 ){
        this.displayAppointee = 'block';

        this.formeditNomineeAge.patchValue({
          ed_appointee_salutation : this.result?.appointee_salutation,
          ed_appointee_first_name : this.result?.appointee_first_name,
          ed_appointee_middle_name : this.result?.appointee_middle_name,
          ed_appointee_last_name : this.result?.appointee_last_name,
          ed_appointee_age : this.result?.appointee_age,
          ed_appointee_relation : this.result?.appointee_relation_name
        });

        this.setAppointValiation();
      }else{
        this.displayAppointee = 'none';
        this.resetAppointValiation();
      }
    }

  }

  setAppointValiation(){
    this.formeditNomineeAge.get("ed_appointee_salutation").setValidators([Validators.required]);
    this.formeditNomineeAge.get("ed_appointee_salutation").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_first_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formeditNomineeAge.get("ed_appointee_first_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_middle_name").setValidators([Validators.pattern(this.validation_for_name_with_space)]);
    this.formeditNomineeAge.get("ed_appointee_middle_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_last_name").setValidators([
      Validators.required,
      Validators.pattern(this.validation_for_name_with_space),
      Validators.minLength(2),
      Validators.maxLength(15)
    ]);
    this.formeditNomineeAge.get("ed_appointee_last_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_age").setValidators([this.customvalidationService.appointeeAgeValidator(),Validators.required,Validators.pattern(this.validation_for_age)]);
    this.formeditNomineeAge.get("ed_appointee_age").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_relation").setValidators([Validators.required]);
    this.formeditNomineeAge.get("ed_appointee_relation").updateValueAndValidity();

  }

  resetAppointValiation(){

    this.formeditNomineeAge.get("ed_appointee_salutation").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_salutation").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_first_name").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_first_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_middle_name").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_middle_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_last_name").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_last_name").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_age").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_age").updateValueAndValidity();

    this.formeditNomineeAge.get("ed_appointee_relation").setValidators([]);
    this.formeditNomineeAge.get("ed_appointee_relation").updateValueAndValidity();

    this.formeditNomineeAge.patchValue({
      ed_appointee_salutation : '',
      ed_appointee_first_name : '',
      ed_appointee_middle_name : '',
      ed_appointee_last_name : '',
      ed_appointee_age : '',
      ed_appointee_relation : ''
    });

  }

  submitFormEditNomineeAge(){

    this.submittedNomineeAge = true;
    if(this.formeditNomineeAge.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','6');

    uploadData.append('nominee_age',this.formeditNomineeAge.value.nominee_age);

    uploadData.append('nominee_age_existing',this.result?.nominee_age);

    uploadData.append('appointee_salutation',this.formeditNomineeAge.value.ed_appointee_salutation);
    uploadData.append('appointee_first_name',this.formeditNomineeAge.value.ed_appointee_first_name);
    uploadData.append('appointee_middle_name',this.formeditNomineeAge.value.ed_appointee_middle_name);
    uploadData.append('appointee_last_name',this.formeditNomineeAge.value.ed_appointee_last_name);
    uploadData.append('appointee_age',this.formeditNomineeAge.value.ed_appointee_age);
    uploadData.append('appointee_relation',this.formeditNomineeAge.value.ed_appointee_relation);

    uploadData.append('appointee_salutation_existing',this.result?.appointee_salutation);
    uploadData.append('appointee_first_name_existing',this.result?.appointee_first_name);
    uploadData.append('appointee_middle_name_existing',this.result?.appointee_middle_name);
    uploadData.append('appointee_last_name_existing',this.result?.appointee_last_name);
    uploadData.append('appointee_age_existing',this.result?.appointee_age);
    uploadData.append('appointee_relation_existing',this.result?.appointee_relation_name);

    uploadData.append('customerletter',this.formeditNomineeAge.value.customerletter_nominee_age);
    uploadData.append('nominee_proof',this.formeditNomineeAge.value.proof_nominee_age);

    uploadData.append('remark_nominee_age',this.formeditNomineeAge.value.remark_nominee_age);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditChassisNo(){
    this.submittedChassisNo = true;

    if(this.formeditChassisNo.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','14');

    uploadData.append('chassis_no',this.formeditChassisNo.value.chassis_no);

    uploadData.append('chassis_no_existing',this.result?.chassis_no);

    uploadData.append('rccopy_chassis_no',this.formeditChassisNo.value.rccopy_chassis_no);
    uploadData.append('customerletter_chassis_no',this.formeditChassisNo.value.customerletter_chassis_no);
    uploadData.append('remark_chassis_no',this.formeditChassisNo.value.remark_chassis_no);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditEngineNo(){
    this.submittedEngineNo = true;
    if(this.formeditEngineNo.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);

    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','3');

    uploadData.append('engine_no',this.formeditEngineNo.value.engine_no);

    uploadData.append('engine_no_existing',this.result?.engine_no);

    uploadData.append('rccopy_engine_no',this.formeditEngineNo.value.rccopy_engine_no);
    uploadData.append('customerletter_engine_no',this.formeditEngineNo.value.customerletter_engine_no);
    uploadData.append('remark_engine_no',this.formeditEngineNo.value.remark_engine_no);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditRegNo(){
    this.submittedRegNo = true;
    if(this.formeditRegNo.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);

    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','9');


    uploadData.append('rto',this.formeditRegNo.value.rto);
    uploadData.append('reg_no_1',this.formeditRegNo.value.reg_no_1);
    uploadData.append('reg_no_2',this.formeditRegNo.value.reg_no_2);

    uploadData.append('rto_existing',this.result?.rto_name);



    this.registration_no_part_3_val = '';
    this.registration_no_part_4_val = '';
    if (this.result?.registration_no_part_3) {
        this.registration_no_part_3_val = this.result?.registration_no_part_3;
    }

    if (this.result?.registration_no_part_4) {
        this.registration_no_part_4_val = this.result?.registration_no_part_4;
    }

    uploadData.append('reg_no_1_existing',this.registration_no_part_3_val);
    uploadData.append('reg_no_2_existing',this.registration_no_part_4_val);

    uploadData.append('rccopy_reg',this.formeditRegNo.value.rccopy_reg);
    uploadData.append('customerletter_reg',this.formeditRegNo.value.customerletter_reg);
    uploadData.append('remark_reg',this.formeditRegNo.value.remark_reg);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditColor(){
    this.submittedColor = true;
    if(this.formeditColor.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();

    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);

    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','4');

    uploadData.append('vehicle_color',this.formeditColor.value.vehicle_color);

    uploadData.append('vehicle_color_existing',this.result?.vehicle_color);

    uploadData.append('rccopy_vehicle_color',this.formeditColor.value.rccopy_vehicle_color);
    uploadData.append('customerletter_vehicle_color',this.formeditColor.value.customerletter_vehicle_color);
    uploadData.append('remark_vehicle_color',this.formeditColor.value.remark_vehicle_color);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  submitFormEditAgreement(){
    this.submittedAgreement = true;
    if(this.formeditAgreement.invalid){
      return;
    }

    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('loginUserId',this.loginUserId);

    uploadData.append('policy_no',this.policy_no);
    uploadData.append('policy_endorsement_id',this.policy_endorsement_id);
    uploadData.append('item_id',this.item_id);


    uploadData.append('policy_id',this.result.policy_id);
    uploadData.append('ic_id',this.result.ic_id);
    uploadData.append('product_type_id',this.result.product_type_id);

    uploadData.append('endorsement_item_id','10');

    uploadData.append('agreement',this.formeditAgreement.value.agreement);
    uploadData.append('bank',this.formeditAgreement.value.bank);

    uploadData.append('agreement_existing',this.result?.agreement_type);
    uploadData.append('bank_existing',this.result?.bank_name);

    uploadData.append('financierletter',this.formeditAgreement.value.financierletter);
    uploadData.append('invoice_copy',this.formeditAgreement.value.invoice_copy_financier);

    uploadData.append('rccopy_agreement',this.formeditAgreement.value.rccopy_agreement);
    uploadData.append('customerletter_agreement',this.formeditAgreement.value.customerletter_agreement);
    uploadData.append('remark_agreement',this.formeditAgreement.value.remark_agreement);

    console.log('submitFormNameDetails........');
    console.log(uploadData);

    this.commonService.submitFormEditName(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
           Swal.fire({
            title: '',
            html: 'Endorsement Application Successfuly Submitted',
            timer: 2000
          }).then((result) => {
             this.router.navigateByUrl('/my-account/endorsement');
          })
        }else{
          Swal.fire({
            title: '',
            html: outputResult.message
          });
        }
    });
  }

  validationFormNameDetails(){
    this.formeditName = this.formBuilder.group({
      ed_salutation : ['',[Validators.required]],
      ed_first_name : ['',[
        this.customvalidationService.cannotContainSpace(),
        Validators.required,Validators.minLength(1),Validators.maxLength(25),
        Validators.pattern(this.validation_for_name_with_space)
      ]],
      ed_middle_name : ['',[Validators.maxLength(25),
        Validators.pattern(this.validation_for_character)
      ]],
      ed_last_name  : ['',[
        this.customvalidationService.cannotContainSpace(),
        Validators.required,Validators.minLength(1),Validators.maxLength(25),
        Validators.pattern(this.validation_for_character)]],
      invoice_copy : ['',[Validators.required]],
       remark_name : ['',[Validators.required,Validators.maxLength(300)]]
    });
  }

  validationFormAddressDetails(){
    this.formeditAddress = this.formBuilder.group({
      ed_address_1 : ['',[this.customvalidationService.cannotContainSpace(),
        Validators.required,Validators.maxLength(50),
        Validators.pattern(this.validation_for_address)]],

      ed_address_2 : ['',[this.customvalidationService.cannotContainSpace(),
        Validators.required,Validators.maxLength(50),
        Validators.pattern(this.validation_for_address)]],

      ed_pincode : ['',[Validators.required,Validators.minLength(6),
        Validators.minLength(6),Validators.required,
        Validators.pattern(this.validation_for_number_only)]],

      ed_city : ['',[this.customvalidationService.cannotContainSpace(),Validators.required]],
      ed_state : ['',[this.customvalidationService.cannotContainSpace(),Validators.required]],
      customerletter_address : ['',[Validators.required]],
      remark_address: ['',[Validators.required,Validators.maxLength(300)]]
    });
  }

  validationFormContactEmailDetails(){
    this.formeditContactEmail = this.formBuilder.group({
        ed_contact : ['',[Validators.required,Validators.pattern(this.validation_for_mobile_no)]],
        ed_email : ['',[Validators.pattern(this.validation_for_email),Validators.required,Validators.maxLength(50)]],
        remark_contact_email : ['',[Validators.required,Validators.maxLength(300)]]
      });
  }

  validationFormDOBDetails(){
    this.formeditDOB = this.formBuilder.group({
      ed_dob : ['',[Validators.required]],
      idproof_dob : ['',[Validators.required]],
      customerletter_dob : ['',[Validators.required]],
      remark_dob : ['',[Validators.required,Validators.maxLength(300)]]
    });
  }

  validationFormNomineeNameDetails(){
    this.formeditNomineeName = this.formBuilder.group({
      nominee_salutation : ['',[Validators.required]],

      nominee_first_name : ['',[this.customvalidationService.cannotContainSpace(),
        Validators.required,Validators.maxLength(25),
        Validators.pattern(this.validation_for_name_with_space)]],

      nominee_middle_name : ['',[Validators.maxLength(25),
        Validators.pattern(this.validation_for_name_with_space)]],

      nominee_last_name : ['',[this.customvalidationService.cannotContainSpace(),
        Validators.maxLength(25),
        Validators.required,Validators.pattern(this.validation_for_name_with_space)]],


      // appointee_salutation_id : ['',[Validators.required]],

      // appointee_first_name : ['',[this.customvalidationService.cannotContainSpace(),
      //   Validators.required,Validators.maxLength(25),
      //   Validators.pattern(this.validation_for_name_with_space)
      // ]],

      // appointee_middle_name : ['',[Validators.maxLength(25),
      //   Validators.pattern(this.validation_for_name_with_space)
      // ]],

      // appointee_last_name : ['',[this.customvalidationService.cannotContainSpace(),
      //   Validators.maxLength(25),
      //   Validators.required,Validators.pattern(this.validation_for_name_with_space)
      // ]],

      customerletter_nominee_name : ['',[Validators.required]],
      proof_nominee_name : ['',[Validators.required]],

      remark_nominee_name : ['',[Validators.required,Validators.maxLength(300)]]
    });
  }

  validationFormAppointeeDetails(){

  }

  validationFormNomineeRelationDetails(){
     this.formeditNomineeRelation = this.formBuilder.group({
        nominee_relation : ['',[Validators.required]],
        //appointee_relationship_id : ['',[Validators.required]],
        customerletter_nominee_relation : ['',[Validators.required]],
        proof_nominee_relation : ['',[Validators.required]],
        remark_nominee_relation : ['',[Validators.required,Validators.maxLength(300)]]
      });
  }

  validationFormNomineeAgeDetails(){
     this.formeditNomineeAge = this.formBuilder.group({
        nominee_age : ['',[this.customvalidationService.nomineeAgeValidator(),Validators.required,Validators.pattern(this.validation_for_age)]],
        //appointee_age : ['',[this.customvalidationService.nomineeAgeValidator(),Validators.required,Validators.pattern(this.validation_for_age)]],
        customerletter_nominee_age : ['',[Validators.required]],
        proof_nominee_age : ['',[Validators.required]],
        remark_nominee_age : ['',[Validators.maxLength(300)]],
        ed_appointee_salutation : '',
        ed_appointee_first_name : '',
        ed_appointee_middle_name : '',
        ed_appointee_last_name : '',
        ed_appointee_age : '',
        ed_appointee_relation : ''
      });

  }

  validationFormChassisNoDetails(){
      this.formeditChassisNo = this.formBuilder.group({
        chassis_no : ['',[Validators.required,Validators.pattern(this.validation_for_chassis_no)]],
        rccopy_chassis_no : ['',[Validators.required]],
        customerletter_chassis_no : ['',[Validators.required]],
        remark_chassis_no : ['',[Validators.required,Validators.maxLength(300)]]
      });
  }

  validationFormEngineNoDetails(){
      this.formeditEngineNo = this.formBuilder.group({
        engine_no : ['',[Validators.required,Validators.pattern(this.validation_for_engine_no)]],
        rccopy_engine_no : ['',[Validators.required]],
        customerletter_engine_no : ['',[Validators.required]],
        remark_engine_no : ['',[Validators.required,Validators.maxLength(300)]]
      });
  }

  validationFormRegNoDetails(){
       this.formeditRegNo = this.formBuilder.group({
        rto : ['',[Validators.required]],
        //reg_no_1 : ['',[this.customvalidationService.cannotContainSpace(),Validators.required,Validators.pattern(this.validation_for_reg_1)]],
        reg_no_1 : ['',[]],
        reg_no_2 : ['',[this.customvalidationService.cannotContainSpace(),Validators.required,Validators.pattern(this.validation_for_reg_2)]],
        rccopy_reg : ['',[Validators.required]],
        customerletter_reg : ['',[Validators.required]],
        remark_reg : ['',[Validators.required,Validators.maxLength(300)]]
      });
  }

  validationFormColorDetails(){
      this.formeditColor = this.formBuilder.group({
        vehicle_color : ['',[Validators.required]],
        rccopy_vehicle_color : ['',[Validators.required]],
        customerletter_vehicle_color : ['',[Validators.required]],
        remark_vehicle_color : ['',[Validators.maxLength(300)]]
      });
  }

  validationFormAgreementDetails(){
    this.formeditAgreement = this.formBuilder.group({
      agreement : ['',[Validators.required]],
      bank : ['',[this.customvalidationService.cannotContainSpace(),Validators.required]],
      financierletter : ['',[Validators.required]],
      invoice_copy_financier : ['',[Validators.required]],
      rccopy_agreement : ['',[Validators.required]],
      customerletter_agreement : ['',[Validators.required]],
      remark_agreement : ['',[Validators.required,Validators.maxLength(300)]]
    });
  }


  uploadInvoicecopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.invoiceurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.invoiceurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.invoiceurl = event.target.result;
      }
      this.name_invoiceurl_label = file.name;
      this.formeditName.patchValue({
        'invoice_copy' : file
      });
    }


  }



  uploadConfirmlettercopy(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterurl = event.target.result;
      }
      this.customerletterurl_label = file.name;
      this.formeditName.patchValue({
        'customerletter' : file
      });
    }


  }


  uploadRCcopyAddress(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyAddressurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyAddressurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyAddressurl = event.target.result;
      }
      this.rccopyAddressurl_label = file.name;
      this.formeditAddress.patchValue({
        'rccopy_address' : file
      });
    }


  }

  uploadConfirmlettercopyAddress(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterAddressurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterAddressurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterAddressurl = event.target.result;
      }
      this.customerletterAddressurl_label = file.name;
      this.formeditAddress.patchValue({
        'customerletter_address' : file
      });
    }


  }


  uploadIdProofDOB(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyDOBurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyDOBurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyDOBurl = event.target.result;
      }
      this.rccopyDOBurl_label = file.name;
      this.formeditDOB.patchValue({
        'idproof_dob' : file
      });
    }


  }


  uploadConfirmlettercopyDOB(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterDOBurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterDOBurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterDOBurl = event.target.result;
      }
      this.customerletterDOBurl_label = file.name;
      this.formeditDOB.patchValue({
        'customerletter_dob' : file
      });
    }


  }

  uploadConfirmlettercopyNomineeName(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterNomineeNameurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterNomineeNameurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterNomineeNameurl = event.target.result;
      }
      this.customerletterNomineeNameurl_label = file.name;
      this.formeditNomineeName.patchValue({
        'customerletter_nominee_name' : file
      });
    }


  }

  uploadProofNomineeName(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.proofNomineeNameurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.proofNomineeNameurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.proofNomineeNameurl = event.target.result;
      }
      this.proofNomineeNameurl_label = file.name;
      this.formeditNomineeName.patchValue({
        'proof_nominee_name' : file
      });
    }


  }

  uploadProofNomineeRelation(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.proofNomineeRelationurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.proofNomineeRelationurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.proofNomineeRelationurl = event.target.result;
      }
      this.proofNomineeRelationshipurl_label = file.name;
      this.formeditNomineeRelation.patchValue({
        'proof_nominee_relation' : file
      });
    }


  }

  uploadProofNomineeAge(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.proofNomineeAgeurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.proofNomineeAgeurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.proofNomineeAgeurl = event.target.result;
      }
      this.proofNomineeAgeurl_label = file.name;
      this.formeditNomineeAge.patchValue({
        'proof_nominee_age' : file
      });
    }


  }

  uploadConfirmlettercopyNomineeRelation(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterNomineeRelationurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterNomineeRelationurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterNomineeRelationurl = event.target.result;
      }
      this.customerletterNomineeRelationurl_label = file.name;
      this.formeditNomineeRelation.patchValue({
        'customerletter_nominee_relation' : file
      });
    }


  }


  uploadConfirmlettercopyNomineeAge(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterNomineeAgeurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterNomineeAgeurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterNomineeAgeurl = event.target.result;
      }
      this.customerletterNomineeAgeurl_label = file.name;
      this.formeditNomineeAge.patchValue({
        'customerletter_nominee_age' : file
      });
    }


  }


  uploadRCcopyChassisNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyChassisNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyChassisNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyChassisNourl = event.target.result;
      }
      this.rccopyChassisNourl_label = file.name;
      this.formeditChassisNo.patchValue({
        'rccopy_chassis_no' : file
      });
    }


  }


  uploadConfirmlettercopyChassisNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterChassisNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterChassisNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterChassisNourl = event.target.result;
      }
      this.customerletterChassisNourl_label = file.name;
      this.formeditChassisNo.patchValue({
        'customerletter_chassis_no' : file
      });
    }


  }


  uploadRCcopyEngineNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyEngineNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyEngineNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyEngineNourl = event.target.result;
      }
      this.rccopyEngineNourl_label = file.name;
      this.formeditEngineNo.patchValue({
        'rccopy_engine_no' : file
      });
    }


  }


  uploadConfirmlettercopyEngineNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterEngineNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterEngineNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterEngineNourl = event.target.result;
      }
      this.customerletterEngineNourl_label = file.name;
      this.formeditEngineNo.patchValue({
        'customerletter_engine_no' : file
      });
    }


  }

  uploadRCcopyRegNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyRegNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyRegNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyRegNourl = event.target.result;
      }
      this.rccopyRegNourl_label = file.name;
      this.formeditRegNo.patchValue({
        'rccopy_reg' : file
      });
    }


  }

  uploadConfirmlettercopyRegNo(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterRegNourl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterRegNourl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterRegNourl = event.target.result;
      }
      this.customerletterRegNourl_label = file.name;
      this.formeditRegNo.patchValue({
        'customerletter_reg' : file
      });
    }


  }


  uploadRCcopyColor(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyColorurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyColorurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyColorurl = event.target.result;
      }
      this.rccopyColorurl_label = file.name;
      this.formeditColor.patchValue({
        'rccopy_vehicle_color' : file
      });
    }


  }


  uploadConfirmlettercopyColor(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterColorurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterColorurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterColorurl = event.target.result;
      }
      this.customerletterColorurl_label = file.name;
      this.formeditColor.patchValue({
        'customerletter_vehicle_color' : file
      });
    }


  }


  uploadInvoiceCopyFinancier(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.invoice_copyurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.invoice_copyurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.invoice_copyurl = event.target.result;
      }
      this.invoice_copyurl_label = file.name;
      this.formeditAgreement.patchValue({
        'invoice_copy_financier' : file
      });
    }


  }


  uploadFinancierLetter(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.financierletterurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.financierletterurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.financierletterurl = event.target.result;
      }
      this.financierletterurl_label = file.name;
      this.formeditAgreement.patchValue({
        'financierletter' : file
      });
    }


  }


  uploadRCcopyAgreement(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.rccopyAgreementurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.rccopyAgreementurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rccopyAgreementurl = event.target.result;
      }
      this.rccopyAgreementurl_label = file.name;
      this.formeditAgreement.patchValue({
        'rccopy_agreement' : file
      });
    }


  }


  uploadConfirmlettercopyAgreement(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.customerletterAgreementurl = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.customerletterAgreementurl = "";
    }else{
      console.log(event.target.result);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.customerletterAgreementurl = event.target.result;
      }
      this.customerletterAgreementurl_label = file.name;
      this.formeditAgreement.patchValue({
        'customerletter_agreement' : file
      });
    }


  }


   changeOwnerPincode(event){
    var is_vallid :any = this.formeditAddress.controls.ed_pincode.status;
    if(event.target.value.length == 6 && is_vallid != "INVALID"){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('loginUserId','1');
      sendData.append('pin_code',event.target.value);
      this.commonService.getStateCityByPincode(sendData)
      .subscribe(response => {
        this.loaderActive = false;
        var result : any  = response;

        if(result.status){
          console.log(result.state_city.cityname);
          this.formeditAddress.patchValue({
            ed_city : result.state_city.cityname,
            ed_state   : result.state_city.statename
          });
        }else{
          Swal.fire (result.message,  "" ,  "error" );
          this.formeditAddress.patchValue({
            ed_city : "",
            ed_state   : ""
          });
        }

      });
    }

  }

	selectDate(field,event){
		const current_date = new Date();
		var day : any = (event.day < 10 ? '0' : '') + event.day;
		var month : any = (event.month < 10 ? '0' : '') + event.month;
		var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;
    //alert(selected_date);
    this.formeditDOB.patchValue({ ed_dob : selected_date });

	}




}
