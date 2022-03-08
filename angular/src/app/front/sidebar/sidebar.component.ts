import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from  '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    isActive: boolean = false;
    collapsed: boolean = false;
    showMenu: string = '';

    isActivee: boolean = false;
    collapsedd: boolean = false;
    showMenuu: string = '';
    pushRightClass: string = 'push-right';
    sideMenuBar : any;
    loginUserId : any;
    renew_active_url_path : any;
    renew_active_url : boolean = false;


    loginUserType : any;


    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private commonService: CommonService) {

      this.loginUserId = sessionStorage.getItem('user_id');
      this.loginUserType = sessionStorage.getItem('user_type_id');

    }

    ngOnInit(): void {

     this.loginUserId = sessionStorage.getItem('user_id');
     this.activePanel();

      var sendData = new FormData();
      sendData.append('loginUserId',this.loginUserId);
      this.commonService.getProductListForHomePage(sendData)
      .subscribe( response => {
        var result :any = response;
        if(result.status){
          console.log(result.product_list_renew);
            result.product_list_renew.forEach(row => {
                if(row.active_menu==1){
                    this.renew_active_url=true;
                    this.renew_active_url_path=row.renewal_url;
                }
            });
        }
      });

    }

    eventCalled() {
      this.isActive = !this.isActive;
  }

  eventCalledd() {
      this.isActivee = !this.isActivee;
  }

  activePanel(){
      var url = window.location.href;
      var parts = url.split("/");
      var last_part = parts[parts.length-1];
      var masters = ['menus','users-hierarchy','roles','users','user-pos-mapping'];
      if(masters.indexOf(last_part) >= 0 ){
          this.addExpandClass('masters');
      }

  }

  addExpandClass(element: any) {
      console.log('.....................addExpandClass');
      console.log(element);
      if (element === this.showMenu) {
          this.showMenu = '0';
          console.log("00000000000");

      } else {
          this.showMenu = element;
         console.log('element...............................................');
         console.log(element);
      }
  }

  addExpandClasss(elementt: any) {
      console.log('.....................addExpandClasss.......');
      console.log(elementt);
      if (elementt === this.showMenuu) {
          this.showMenuu = '0';
          console.log("new________________");
          console.log(this.showMenuu);

      } else {
          this.showMenuu = elementt;
          console.log(this.showMenuu);
         console.log('new_______element...............................................');
         console.log(elementt);
      }
  }

  toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.collapsedEvent.emit(this.collapsed);

      this.collapsedd = !this.collapsedd;
      this.collapsedEvent.emit(this.collapsedd);
  }

  isToggled(): boolean {
      const dom: Element = document.querySelector('body');
      return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle('rtl');
  }



}
