import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { TreeviewItem, TreeviewConfig} from 'ngx-treeview';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';

import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-menu-privilege',
  templateUrl: './menu-privilege.component.html',
  styleUrls: ['./menu-privilege.component.css']
})
export class MenuPrivilegeComponent implements OnInit {

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};


  loginUserId : any;
  loginUserRoleId : any;
  loginUserTypeId : any;
  loginUserName : any;
  adminMenuIds : any;
  

  id : any;    
  table : any;
  
  where_column : any;
  back_url : any;


  name : any;
  product_type_id : any;
  currentJustify = 'fill';
  result_product_types : any;
  resultNew : any;
  product_type : any;
  formDetails : any;
  submittedForm : boolean = false;
  result_menu: TreeviewItem[];
  

   formRecodEdit : any;

  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  selectedMenuIds : any;


  loaderActive : boolean =  false;

  constructor(private customvalidationService : CustomvalidationService, private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");
    this.loginUserName = sessionStorage.getItem("adminUserName");
    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");

    this.id =  this.activatedRoute.snapshot.paramMap.get('id');
    this.table =  this.activatedRoute.snapshot.paramMap.get('table');
    this.where_column =  this.activatedRoute.snapshot.paramMap.get('where_column');
    this.back_url =  this.activatedRoute.snapshot.paramMap.get('back_url');
    this.validateForm();
    this.getIndex();
  }

  validateForm(){
    this.formDetails = this.formBuilder.group({
      id : [this.id,Validators.required],
      table : [this.table,Validators.required],
      selectedMenuIds : ['',Validators.required],
    });
    
  }

  setFormDetails(result){
    // alert('innn for set');
    //  alert(result.product_type_id);
    // console.log('............');
    // console.log(result.product_type_id);
    this.formDetails.patchValue({
      id : this.id,
      table : this.table,
      selectedMenuIds : result.admin_menu_ids,
    });
    //this.selected_product_type_id = result.product_type_id;
  }

  getIndex(){

    this.loaderActive = true;
    var sendData = new FormData();

    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserName',this.loginUserName);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    sendData.append('adminMenuIds',this.adminMenuIds);



    sendData.append('id',this.id);
    sendData.append('table',this.table);
    sendData.append('where_column',this.where_column);
    sendData.append('loginUserId',this.loginUserId);
   
    this.commonService.getMenusPrivilegeUser(sendData)
      .subscribe( response => {
        var output_data: any = response;
        if(output_data.status){
          this.loaderActive = false;
          this.result_menu  =  this.createTreeView(output_data.result.result_menu);
         // Swal.fire(output_data.message, '', "success"); // Swal.fire (output_data.message,  "" ,  "error" );
        }else{
         // Swal.fire (output_data.message,  "" ,  "error" );
        }
    });  
    
  }

  createTreeView(result){
    this.resultNew = [];
    if(result){
      result.forEach(item => {
          this.resultNew.push(new TreeviewItem(item))  ;
      });
    }
    
    return  this.resultNew;
  }

  backToUser(){
    console.log(this.back_url);
    this.back_url = atob(this.back_url);
    console.log(this.back_url);
    // this.router.navigate(['admin/manage-common/user']);
    this.router.navigate([this.back_url]);
 }

 onSelectedMenuChange(value){
  this.formDetails.patchValue({ selectedMenuIds : value });
  this.selectedMenuIds = value;
  console.log(this.selectedMenuIds);
}

submitForm(){

  console.log(this.formDetails);
  this.submittedForm = true;
  if(this.formDetails.invalid){      
    return;
  }
  
  this.loaderActive = true;
  var sendData = new FormData();
  
  sendData.append('loginUserId',this.loginUserId);
  sendData.append('loginUserName',this.loginUserName);

  sendData.append('id',this.id);
  sendData.append('table',this.table);
  sendData.append('where_column',this.where_column);
  sendData.append('selectedMenuIds',this.selectedMenuIds);

  console.log(sendData);

   this.commonService.submitMenuPrivileges(sendData)
   .subscribe( response => {
      var output_data: any = response;
      this.loaderActive = false;
      if(output_data.status){
        Swal.fire(output_data.message, '', "success"); 
      }else{
        Swal.fire (output_data.message,  "" ,  "error" );
      }
      
   });
  
  
 

 

}

ngAfterViewInit(): void {
  this.renderer.listen('document', 'click', (event) => {

      if (event.target.hasAttribute("view-misp-privilege")) {
        this.redirectPrivilege(event.target.getAttribute("view-misp-privilege"));
      }

  });     
}

redirectPrivilege(url){
  //alert('innn');
  this.router.navigate([url]);
}





}
