import { AfterViewInit, Component, OnInit, Renderer2  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../services/common.service';
//import { MotorService } from '../../services/motor.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Lightbox } from 'ngx-lightbox';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-break-in-report',
  templateUrl: './break-in-report.component.html',
  styleUrls: ['./break-in-report.component.css']
})
export class BreakInReportComponent implements OnInit {

  [x: string]: any;
  base_url : any = environment.baseUrl;
  loginUserId  : any;
  loginUserType  : any;
  token  : any;
  proposal_no : any;
  proposal_id : any;
  breaking_case_id : any;

  loaderActive : any;

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

  ItemsTableArray : any;

  resultBreakinDetails : any;
  resultBreakinTransactionHistory : any;
  public_path : any;

  formSubmitBreakinApproval: FormGroup;
  submitFormActionStatus: boolean = false;
  shareLink :any;

  is_form_show: boolean = false;
  isbreakinAction: boolean = false;

  _albums = [];

  constructor(private activatedRoute : ActivatedRoute,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder,private _lightbox: Lightbox) {

  }
  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index, {
      wrapAround: true,
      showImageNumberLabel: true,
      showZoom:true,
      showRotate:true,
      alwaysShowNavOnTouchDevices:true
     });
  }
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  ngOnInit(): void {
      this.loaderActive = true;
      this.shareLink  =  this.activatedRoute.snapshot.paramMap.get('share_link');

      this.loginUserId = sessionStorage.getItem('adminUserId');

      this.proposal_no = sessionStorage.getItem("breakin_proposal_no");
      this.proposal_id = sessionStorage.getItem("breakin_proposal_id");
      this.breaking_case_id = sessionStorage.getItem("breaking_case_id");
      if(!this.proposal_id){
        this.proposal_id=this.activatedRoute.snapshot.paramMap.get('id');
        this.breaking_case_id=this.shareLink;
      }

      this.getIndex();
      this.validationBimFormDetails();
  }
  getIndex(){
    let uploadData = new FormData();
    uploadData.append('proposal_no',this.proposal_no);
    uploadData.append('proposal_id',this.proposal_id);
    uploadData.append('breaking_case_id',this.breaking_case_id);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('share_link',this.shareLink);
    this.commonService.getAdminBreakinInspectionDetails(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
        this.loaderActive = true;
        if(outputResult.status){
          this.resultProposalDetails = outputResult.proposal_detail;
          this.public_path = outputResult.public_path;
          this.public_path_n = outputResult.public_path_n;
          this.resultBreakinDetails = outputResult.breakin_details;
          console.log(this.resultBreakinDetails);

          this.resultBreakinTransactionHistory = outputResult.resultBreakinTransactionHistory;
          this.ItemsTableArray = outputResult.qsn_ans.inspection_question_answere_chunk;
          this.Itemscolor = outputResult.qsn_ans.color;
          this.breaking_case_id=outputResult.breaking_case_id;

          this.proposal_no = this.resultProposalDetails.proposal_no;
          this.proposal_id = this.resultProposalDetails.proposal_id;
          this.isbreakinAction=outputResult.isbreakinAction;

          if(this.resultBreakinDetails?.inspection_report_image!=null){
            const irimage = {
              src: this.resultBreakinDetails?.inspection_report_image,
              caption: 'Inspection Report Image',
              thumb: this.resultBreakinDetails?.inspection_report_image
            };
            this._albums.push(irimage);
          }
          if(this.resultBreakinDetails?.front_image!=null){
            const front_image = {
              src: this.resultBreakinDetails?.front_image,
              caption: 'Front Image',
              thumb: this.resultBreakinDetails?.front_image
            };
            this._albums.push(front_image);
          }
          if(this.resultBreakinDetails?.rear_image!=null){
            const rear_image = {
              src: this.resultBreakinDetails?.rear_image,
              caption: 'Rear Image',
              thumb: this.resultBreakinDetails?.rear_image
            };
            this._albums.push(rear_image);
          }
          if(this.resultBreakinDetails?.left_image!=null){
            const left_image = {
              src: this.resultBreakinDetails?.left_image,
              caption: 'Left Image',
              thumb: this.resultBreakinDetails?.left_image
            };
            this._albums.push(left_image);
          }
          if(this.resultBreakinDetails?.right_image!=null){
            const right_image = {
              src: this.resultBreakinDetails?.right_image,
              caption: 'Right Image',
              thumb: this.resultBreakinDetails?.right_image
            };
            this._albums.push(right_image);
          }
          if(this.resultBreakinDetails?.dicky_open!=null){
            const dicky_open = {
              src: this.resultBreakinDetails?.dicky_open,
              caption: 'Dicky Open',
              thumb: this.resultBreakinDetails?.dicky_open
            };
            this._albums.push(dicky_open);
          }
          if(this.resultBreakinDetails?.car_chassis_print!=null){
            const car_chassis_print = {
              src: this.resultBreakinDetails?.car_chassis_print,
              caption: 'Engraved Chassis',
              thumb: this.resultBreakinDetails?.car_chassis_print
            };
            this._albums.push(car_chassis_print);
          }

          if(this.resultBreakinDetails?.open_engine_compartment!=null){
            const open_engine_compartment = {
              src: this.resultBreakinDetails?.open_engine_compartment,
              caption: 'Open Engine Compartment',
              thumb: this.resultBreakinDetails?.open_engine_compartment
            };
            this._albums.push(open_engine_compartment);
          }
          if(this.resultBreakinDetails?.under_the_chassis_embossed_chassis_photo!=null){
            const under_the_chassis_embossed_chassis_photo = {
              src: this.resultBreakinDetails?.under_the_chassis_embossed_chassis_photo,
              caption: 'Under Carriage Image',
              thumb: this.resultBreakinDetails?.under_the_chassis_embossed_chassis_photo
            };
            this._albums.push(under_the_chassis_embossed_chassis_photo);
          }
          if(this.resultBreakinDetails?.puc_copy!=null){
            const puc_copy = {
              src: this.resultBreakinDetails?.puc_copy,
              caption: 'PUC Copy',
              thumb: this.resultBreakinDetails?.puc_copy
            };
            this._albums.push(puc_copy);
          }
          if(this.resultBreakinDetails?.dashboard_copy!=null){
            const dashboard_copy = {
              src: this.resultBreakinDetails?.dashboard_copy,
              caption: 'Dashboard Copy',
              thumb: this.resultBreakinDetails?.dashboard_copy
            };
            this._albums.push(dashboard_copy);
          }
          if(this.resultBreakinDetails?.rc_copy!=null){
            const rc_copy = {
              src: this.resultBreakinDetails?.rc_copy,
              caption: 'RC Copy',
              thumb: this.resultBreakinDetails?.rc_copy
            };
            this._albums.push(rc_copy);
          }
          if(this.resultBreakinDetails?.pervious_insurances!=null){
            const pervious_insurances = {
              src: this.resultBreakinDetails?.pervious_insurances,
              caption: 'Pervious Insurance Copy',
              thumb: this.resultBreakinDetails?.pervious_insurances
            };
            this._albums.push(pervious_insurances);
          }

          if(this.resultBreakinDetails?.selfie_with_car!=null){
            const selfie_with_car = {
              src: this.resultBreakinDetails?.selfie_with_car,
              caption: 'Selfie with car',
              thumb: this.resultBreakinDetails?.selfie_with_car
            };
            this._albums.push(selfie_with_car);
          }
          if(this.resultBreakinDetails?.windscreen_inside_outside!=null){
            const windscreen_inside_outside = {
              src: this.resultBreakinDetails?.windscreen_inside_outside,
              caption: 'Windscreen Inside to Outside',
              thumb: this.resultBreakinDetails?.windscreen_inside_outside
            };
            this._albums.push(windscreen_inside_outside);
          }
          if(this.resultBreakinDetails?.windscreen_outside_inside!=null){
            const windscreen_outside_inside = {
              src: this.resultBreakinDetails?.windscreen_outside_inside,
              caption: 'Windscreen Outside to Inside',
              thumb: this.resultBreakinDetails?.windscreen_outside_inside
            };
            this._albums.push(windscreen_outside_inside);
          }
          if(this.resultBreakinDetails?.autometer_engine!=null){
            const autometer_engine = {
              src: this.resultBreakinDetails?.autometer_engine,
              caption: 'Odometer with Engine',
              thumb: this.resultBreakinDetails?.autometer_engine
            };
            this._albums.push(autometer_engine);
          }
          if(this.resultBreakinDetails?.addtion1!=null){
            const addtion1 = {
              src: this.resultBreakinDetails?.addtion1,
              caption: 'Addtion 1',
              thumb: this.resultBreakinDetails?.addtion1
            };
            this._albums.push(addtion1);
          }
          if(this.resultBreakinDetails?.addtion2!=null){
            const addtion2 = {
              src: this.resultBreakinDetails?.addtion2,
              caption: 'Addtion 2',
              thumb: this.resultBreakinDetails?.addtion2
            };
            this._albums.push(addtion2);
          }
          if(this.resultBreakinDetails?.addtion3!=null){
            const addtion3 = {
              src: this.resultBreakinDetails?.addtion3,
              caption: 'Addtion 3',
              thumb: this.resultBreakinDetails?.addtion3
            };
            this._albums.push(addtion3);
          }
          if(this.resultBreakinDetails?.video!=null){
            const video = {
              src: this.resultBreakinDetails?.video,
              caption: 'Inspection Video',
              thumb: this.resultBreakinDetails?.video
            };
            this._albums.push(video);
          }
        }
        setTimeout(() => {
          this.loaderActive = false;
        }, 6000);
    });

  }
  showSubmitForm(){
      this.is_form_show=true;
  }
  hideSubmitForm(){
    this.is_form_show=false;
}

  DownloadPDF(proposal_id,breaking_case_id){
    this.loginUserId = sessionStorage.getItem('adminUserId');
   window.open(this.base_url+'admin/inspection-report-pdf/'+proposal_id+'/'+breaking_case_id, '_blank  ');
  }

  validationBimFormDetails(){
    this.formSubmitBreakinApproval = this.formBuilder.group({
        bim_status : ['',Validators.required],
        bim_status_comment : ['',Validators.required]
    });
  }

  submitBreakinApproval(){
      this.submitFormActionStatus = true;
      if(this.formSubmitBreakinApproval.invalid){
        return;
      }
      this.loaderActive = true;

      let uploadData = new FormData();

      uploadData.append('loginUserId',this.resultProposalDetails.user_id);
      uploadData.append('proposal_no',this.proposal_no);
      uploadData.append('proposal_id',this.proposal_id);
      uploadData.append('breaking_case_id',this.breaking_case_id);
      uploadData.append('status',this.formSubmitBreakinApproval.value.bim_status);
      uploadData.append('comment',this.formSubmitBreakinApproval.value.bim_status_comment);

      this.commonService.submitFormBreakinInspectionStatusUpdate(uploadData).subscribe(response => {
        this.loaderActive = false;
          var outputResult : any = response;
          if(outputResult.status){
            Swal.fire({
                title: outputResult.message,
                text: "",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              })
          }
          else{
            Swal.fire(outputResult.message,  "" ,  "error" );
          }
      });
  }
}
