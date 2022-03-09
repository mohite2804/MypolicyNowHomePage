import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-select-commercial-type',
  templateUrl: './select-commercial-type.component.html',
  styleUrls: ['./select-commercial-type.component.css']
})
export class SelectCommercialTypeComponent implements OnInit {
  commercial_types: any;
  loaderActive: boolean = false;
  loginUserId : any;
  loginUserType : any;
  constructor(private commonService: CommonService,public router: Router) { }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');

    this.getIndex();
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserType',this.loginUserType);

    this.commonService.getCommercialTypes(sendData)
      .subscribe(res=>{
        this.loaderActive = false;
        var result : any = res;
        if(result.status){
          this.commercial_types = result.commercial_types;
          console.log('commercial_types...........');
          console.log(this.commercial_types);

        }
      });

  }


  redirectUrl(id) {
    this.router.navigate(['/commercial-insurance-quote', id]);

  }
}
