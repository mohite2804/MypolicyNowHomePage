import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './aboutus-page.component.html',
  styleUrls: ['./aboutus-page.component.css']
})
export class AboutPageComponent implements OnInit {
  mainJsPath = environment.mainJsPath;
   loaderActive: boolean = false;
 
output_result :  any;
simplify_insurance :  any;
product_lists:any;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
 
    this.loaderActive = true;
//    var sendData = new FormData();

    // this.commonService.getHomeDetails()
    // .subscribe(response => {
    //   this.loaderActive = false;
    //   this.output_result  = response;

    //  this.simplify_insurance = this.output_result.simplify_insurance;
    //  this.product_lists = this.output_result.product_list;


    //   // this.selected_product_type_details=output_result.selected_product_type_details;

    //   // this.relations_id_data=output_result.relations_id_data;
    //   // this.result_selected_quote_data = output_result.quote_data;
     
    //   // this.prev_policy_sub_type_id=output_result.quote_data.prev_policy_type_id;

    //   // this.upload_pdf_od_upload_real_time=output_result.public_path+"pdf_image.png";
    //   // this.upload_pdf_tp_upload_real_time=output_result.public_path+"pdf_image.png";
     
    // });





  }

  loadScripts() {
    //const externalScriptArray = ['/assets/front/js/main.js'];
    const externalScriptArray = [this.mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }




}
