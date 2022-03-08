import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  @Input() loaderActive: any;
  business_partner_code : any;
  constructor() {
    if (sessionStorage.getItem("business_partner_code") === null || sessionStorage.getItem("business_partner_code") === undefined) {
      this.business_partner_code =   sessionStorage.getItem('business_partner_code');
    }
  }

  ngOnInit(): void {


  }

}
