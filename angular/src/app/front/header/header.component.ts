import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { Router } from  '@angular/router';
import { CommonService } from '../services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  baseUrl_angular = environment.baseUrl_angular;
  dashboard_url : any;
  loginUserId : any;
  loginUserType : any;

  user_full_name : any;
  pro_image  : any;
  public_path : any;
  wallet_balance : any = 0;
  razor_customer_id : any;
  dynamicFlag = false;

  unread_notification_count :any = 0;
  notification_data :any;
  displayPopup: any;
  recent_notofications:any;
  recent_notofications_count:any =0;
  if_notificatons_found : boolean = false;
  if_notificatons_not_found : boolean = false;

  result1 : any;
  result2 : any;

  dynamicLogoUrl: string;
  @ViewChild('set_theme_logo') set_theme_logo:ElementRef;

  constructor(public router: Router, private commonService: CommonService, public sanitizer: DomSanitizer) {
    this.dashboard_url = this.baseUrl_angular+"my-account/dashboard";
  }

  ngAfterViewInit() {
    console.log('this.set_theme_logo.nativeElement.src'+this.dynamicLogoUrl);
    if(this.dynamicLogoUrl){
      this.set_theme_logo.nativeElement.src = this.dynamicLogoUrl;
    }
  }


  ngOnInit(): void {

    this.dynamicLogoUrl  = sessionStorage.getItem('theme_logo');
    console.log("logo check:- V "+this.dynamicLogoUrl);

    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.user_full_name = sessionStorage.getItem('user_full_name');
    this.pro_image = sessionStorage.getItem('pro_image');
    this.public_path = sessionStorage.getItem('public_path');
    this.razor_customer_id = sessionStorage.getItem('razor_customer_id');
    this.getWalletBallance();

    this.displayPopup = 'none';
    this.getUnreadNotificationCount();
    this.getLastThreeNotifications();

    console.log(sessionStorage);
  }


  goToHomePage(){
    if(this.loginUserType == 5){
      this.router.navigate(['my-account/dashboard']);
    }else{
      this.router.navigate(['home']);
    }

  }

  getWalletBallance(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('razor_customer_id',this.razor_customer_id);
    this.commonService.getWalletBallance(sendData)
    .subscribe(response => {
      this.wallet_balance = response;

    });
  }

  getUnreadNotificationCount()
  {
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getUnreadNotificationCount(sendData)
    .subscribe(response => {
      this.result1 = response
      if(this.result1.status)
      {
        this.unread_notification_count = this.result1.notification_count;
      }
      else
      {
        this.unread_notification_count = 0;
      }
    });
    console.log(this.unread_notification_count);
  }

  toggleNotificationWindow()
  {
    if(this.displayPopup == 'none')
    {
      this.displayPopup = 'block';
    }
    else
    {
      this.displayPopup = 'none';
    }
  }

  getLastThreeNotifications()
  {
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.getLastThreeNotifications(sendData)
    .subscribe(response => {
      this.result2 = response
      if(this.result2.status)
      {
        this.if_notificatons_found = true;
        this.if_notificatons_not_found = false;
        this.recent_notofications = this.result2.data;
        this.recent_notofications_count = this.result2.notification_count;
      }
      else
      {
        this.if_notificatons_found = false;
        this.if_notificatons_not_found = true;
        this.recent_notofications = this.result2.data;
        this.recent_notofications_count = 0;
      }
    });
    console.log(this.recent_notofications);
    console.log(this.recent_notofications_count);
  }


}
