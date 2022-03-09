import { AfterViewInit, Component, OnInit, Renderer2  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../services/common.service';
//import { MotorService } from '../../services/motor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-break-in-inspection',
  templateUrl: './break-in-inspection.component.html',
  styleUrls: ['./break-in-inspection.component.css']
})
export class BreakInInspectionComponent implements OnInit {
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

  resultBreakinDetails : any;
  resultBreakinTransactionHistory : any;
  public_path : any;

  formSubmitBreakinApproval: FormGroup;
  submitFormActionStatus: boolean = false;

  inspection_link: boolean = false;
  inspection_link_url:any;



  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) {}

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('adminUserId');

      this.proposal_no = sessionStorage.getItem("breakin_proposal_no");
      this.proposal_id = sessionStorage.getItem("breakin_proposal_id");
      this.breaking_case_id = sessionStorage.getItem("breaking_case_id");

      this.formSubmitBreakinApproval = this.formBuilder.group({
        bim_status : [''],
        bim_status_comment : ['']
      });

      this.getIndex();
      this.validationBimFormDetails();
  }
  GetInspectionReport(){

    this.loginUserId = sessionStorage.getItem('adminUserId');
    this.proposal_no = sessionStorage.getItem("breakin_proposal_no");
    this.proposal_id = sessionStorage.getItem("breakin_proposal_id");
    this.breaking_case_id = sessionStorage.getItem("breaking_case_id");
    window.location.href='admin/manage-motor/break-in-report';
  }

  generateLink(){
    this.inspection_link=true;
  }
  closeGenerateLink(){
    this.inspection_link=false;
  }
  DownloadImages(proposal_id,breaking_case_id){
    this.loginUserId = sessionStorage.getItem('adminUserId');
    window.open(this.base_url+'admin/download-inspection-image/'+proposal_id+'/'+breaking_case_id, '_blank  ');
  }
  getIndex(){
    let uploadData = new FormData();
    uploadData.append('proposal_no',this.proposal_no);
    uploadData.append('proposal_id',this.proposal_id);
    uploadData.append('breaking_case_id',this.breaking_case_id);
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('ic_id',this.loginicId);


    this.loaderActive = true;

    this.commonService.getAdminBreakinInspectionDetails(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;

        if(outputResult.status){
          this.resultProposalDetails = outputResult.proposal_detail;
          this.public_path = outputResult.public_path;
          this.resultBreakinDetails = outputResult.breakin_details;
          this.resultBreakinTransactionHistory = outputResult.resultBreakinTransactionHistory;
          this.inspection_link_url = outputResult.inspection_link_url;
        }
        else{
          Swal.fire(outputResult.message,  "" ,  "error" );
        }

    });
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

      uploadData.append('loginUserId',this.loginUserId);

      uploadData.append('proposal_no',this.proposal_no);
      uploadData.append('proposal_id',this.proposal_id);
      uploadData.append('breaking_case_id',this.breaking_case_id);


      uploadData.append('status',this.formSubmitBreakinApproval.value.bim_status);
      uploadData.append('comment',this.formSubmitBreakinApproval.value.bim_status_comment);

      console.log('submitFormBreakinInspectionApproval........');
      console.log(uploadData);

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
                  // location.reload();
                  this.router.navigateByUrl('/admin/manage-motor/break-in-case');
                }
              })
          }
          else{
            Swal.fire(outputResult.message,  "" ,  "error" );
          }
      });
  }

}
