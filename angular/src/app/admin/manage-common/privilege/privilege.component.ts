import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css']
})


export class PrivilegeComponent implements OnInit {

  base_url = environment.baseUrl;
  //dtOptions: DataTables.Settings = {};
 // dtTrigger: Subject = new Subject();

  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject();	  
  //@ViewChild(DataTableDirective) dtElement: DataTableDirective;

  loginUserId : any;    
  mispId : any;    
  table : any;    
  product_type_id : any;
  name : any;
  loaderActive : boolean =  false;
  result : any;
  show_add_btn : boolean =  false;;
  check_table_name : any;
  back_to_dp : boolean =  false;
  
  constructor(private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.dtOptions[0] = {
        pagingType: 'full_numbers',
        ordering: false,        
        autoWidth : true
            
      };
    this.loginUserId = sessionStorage.getItem("adminUserId");    
    this.mispId =  this.activatedRoute.snapshot.paramMap.get('id');
    this.table =  this.activatedRoute.snapshot.paramMap.get('table');
    // this.check_table_name = this.activatedRoute.snapshot.paramMap.get('table');
    // this.check_table_name = decodeURI(this.check_table_name);
    // this.check_table_name = atob(this.check_table_name);
    // console.log(this.check_table_name);

   // this.product_type_id =  this.activatedRoute.snapshot.paramMap.get('product_type_id');
    this.getIndex();
    this.name ='';
  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('id',this.mispId);
    sendData.append('table',this.table);
   
    this.commonService.getProductWisePrivilegeWithLogin(sendData)
      .subscribe( response => {
        var output_data: any = response;
        if(output_data.status){
          
          this.result = output_data.result;
          
        
        }else{
         // Swal.fire (output_data.message,  "" ,  "error" );
        }
        this.loaderActive = false;
        this.show_add_btn = output_data.show_add_btn;
        this.name = output_data.name;
        this.back_to_dp = output_data.back_to_dp;
        this.dtTrigger.next();
        
    });  
    
    
  }

  


  
  



  backToMISP(){
     this.router.navigate(['admin/manage-common/misp']);
  }

  backToDP(){
    console.log('admin/manage-common/dp/'+this.mispId);
    this.router.navigate(['admin/manage-common/dp/'+this.mispId]);
   // http://localhost:4200/admin/manage-common/dp/MQ%253D%253D
  }

  addPrivilege(){
     this.router.navigate(['admin/manage-common/detail-privilege/'+this.mispId+'/'+this.table+'/0']);
  }

  editPrivilege(row){
    var product_type_id : any = btoa(row.product_type_id);
    product_type_id = encodeURI(product_type_id);

    //console.log(url);
    this.router.navigate(['admin/manage-common/detail-privilege/'+this.mispId+'/'+this.table+'/'+product_type_id]);
  }
}
