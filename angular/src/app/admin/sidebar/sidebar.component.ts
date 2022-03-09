import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from '../services/common.service';


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
   
   result: any;

    pushRightClass: string = 'push-right';

    sideMenuBar : any;
    
    loginUserId : any;
    loginUserRoleId : any;
    loginUserTypeId : any;
    adminMenuIds : any;


    @Output() collapsedEvent = new EventEmitter<boolean>();
    
    constructor(private commonService : CommonService,public router: Router) {
      
    }

    ngOnInit() {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
        this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");  
        this.adminMenuIds = sessionStorage.getItem("adminMenuIds");
        this.getindex();              
        this.activePanel();
        console.log("sidebar"+this.loginUserId);
    }

    getindex(){
        var sendData = new FormData();
        sendData.append('loginUserId',this.loginUserId);
        sendData.append('loginUserRoleId',this.loginUserRoleId);
        sendData.append('loginUserTypeId',this.loginUserTypeId);
        sendData.append('adminMenuIds',this.adminMenuIds);
    	this.commonService.getsidebarmenus(sendData)
	  	.subscribe(response => {
	  		this.result = response;
	  		this.sideMenuBar = this.result.sidebar[0];
	  		console.log(this.result.sidebar);
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

    changeLang(language: string) {
        //this.translate.use(language);
    }

    onLoggedout() {
        //localStorage.removeItem('isLoggedin');
        sessionStorage.clear();
        this.router.navigate(['/admin-login'])
       // sessionStorage.removeItem('isLoggedin');
    }

}
