import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { Router } from  '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  mainJsPath = environment.mainJsPath;
   loaderActive: boolean = false;

output_result :  any;
simplify_insurance :  any;
product_lists:any;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  slides = [
    {
      img: 'https://via.placeholder.com/600.png/09f/fff',
    },
    { img: 'https://via.placeholder.com/600.png/021/fff' },
    { img: 'https://via.placeholder.com/600.png/321/fff' },
    { img: 'https://via.placeholder.com/600.png/422/fff' },
    { img: 'https://via.placeholder.com/600.png/654/fff' },
  ];

  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }


  slideConfig = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '250px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          centerPadding: '20px',
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0',
        },
      },
    ],
  };
  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  slickInit(e: any) {
    console.log('slick initialized');
  }
  breakpoint(e: any) {
    console.log('breakpoint');
  }
  afterChange(e: any) {
    console.log('afterChange');
  }
  beforeChange(e: any) {
    console.log('beforeChange');
  }

  ngOnInit(): void {

    this.loaderActive = true;
//    var sendData = new FormData();

    this.commonService.getHomeDetails()
    .subscribe(response => {
      this.loaderActive = false;
      this.output_result  = response;

     this.simplify_insurance = this.output_result.simplify_insurance;
     this.product_lists = this.output_result.product_list;


      // this.selected_product_type_details=output_result.selected_product_type_details;

      // this.relations_id_data=output_result.relations_id_data;
      // this.result_selected_quote_data = output_result.quote_data;

      // this.prev_policy_sub_type_id=output_result.quote_data.prev_policy_type_id;

      // this.upload_pdf_od_upload_real_time=output_result.public_path+"pdf_image.png";
      // this.upload_pdf_tp_upload_real_time=output_result.public_path+"pdf_image.png";

    });





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
