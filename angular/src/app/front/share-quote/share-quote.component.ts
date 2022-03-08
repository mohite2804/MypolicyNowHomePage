import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-share-quote',
  templateUrl: './share-quote.component.html',
  styleUrls: ['./share-quote.component.css']
})
export class ShareQuoteComponent implements OnInit {
  base_url = environment.baseUrl;
  mainJsPath = environment.mainJsPath;

  quoteData : any ;
  loaderActive: boolean = false;
  quote_share_link : any;

  constructor(private activatedRoute : ActivatedRoute,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.quote_share_link =  this.activatedRoute.snapshot.paramMap.get('quote_share_link');
    //this.unique_ref_no  = "15f4b500cdf40b";

    this.getIndex();
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('quote_share_link',this.quote_share_link);
    this.commonService.getShareQuoteDataList(sendData)
    .subscribe(response => {
      this.loaderActive = false;
      var output_result : any = response;
      this.quoteData = output_result.result;

    });
  }

}
