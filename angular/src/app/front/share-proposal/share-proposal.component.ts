import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute} from  '@angular/router';


@Component({
  selector: 'app-share-proposal',
  templateUrl: './share-proposal.component.html',
  styleUrls: ['./share-proposal.component.css']
})
export class ShareProposalComponent implements OnInit {
  base_url = environment.baseUrl;
  proposal_share_link : any;
  proposal_no : any;
  unique_ref_no : any;
  loaderActive: boolean = false;
  loginUserId : any;
  result_quote_data : any;
  is_from_proposal_page :  boolean = false;
  result_proposal_details : any;
  result_banks : any;
  result_payment_types: any;
  displayForwardProposal : any = 'none';
  constructor(private activatedRoute : ActivatedRoute,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.is_from_proposal_page = false;
    this.proposal_no = "";
    this.loginUserId = "";

    this.proposal_share_link =  this.activatedRoute.snapshot.paramMap.get('proposal_share_link');



    if(this.proposal_share_link == "" || this.proposal_share_link ==  null || this.proposal_share_link == undefined ){
      this.router.navigateByUrl('/quotation');
    }else{
      this.getIndex();
    }

    sessionStorage.setItem('proposal_share_link', this.proposal_share_link);

  }

  getIndex(){

     this.loaderActive = true;
     var sendData = new FormData();
     sendData.append('loginUserId',this.loginUserId);
     sendData.append('proposal_no',this.proposal_no);
     sendData.append('proposal_share_link',this.proposal_share_link);

     this.commonService.getProposalDetails(sendData)
     .subscribe(response => {
       this.loaderActive = false;
       var output_result : any = response;
       this.result_proposal_details = output_result.proposal_details;
       this.result_banks = output_result.banks;
       this.result_payment_types = output_result.payment_types;

     });
   }


  LoadMoreQuotes(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('unique_ref_no',this.result_proposal_details.unique_ref_no);
    this.commonService.LoadMoreQuotes(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any = response;
      this.result_quote_data =  output_result.quotes;
      console.log(this.result_quote_data);

    });

  }

  onParentIsAuthenticate(isAuthenticate : boolean){
    //this.isAuthenticate = isAuthenticate;
    //this.div_show_for_authenticate = !isAuthenticate;

  }

  downloadProposal(){
    this.downloadFile(this.base_url+'downloadProposal/'+this.result_proposal_details.proposal_share_link);
  }

  downloadFile(download_url){
		window.open(download_url, '_blank');
	}

  openForwardProposalModal(){
    this.displayForwardProposal = 'block';
  }


}
