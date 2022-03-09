import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';

import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

   base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  mispId : any;
  table : any;
  editResult : any;

  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;


  constructor(private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.loginUserId = sessionStorage.getItem("adminUserId");    
    this.mispId =  this.activatedRoute.snapshot.paramMap.get('mispId');
    this.table =  this.activatedRoute.snapshot.paramMap.get('table');
    this.getIndex();
    console.log('misp id.......');
    console.log(this.mispId);
    
  }

  backToBusinessPartner(){
     this.router.navigate(['admin/manage-common/business-partner']);
  }

  getIndex(){
    //console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getPosWithLogin',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "mispId": this.mispId,
              "table": this.table

          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'S.No',
              'data' : 'sno'
            },
            {
              'title' : 'Business Partner Name',
              'data' : 'name'
            },
            {
              'title' : 'Code',
              'data' : 'internal_code'
            },
            {
              'title' : 'Name',
              'data' : 'app_fullname'
            },
            {
              'title' : 'Mobile Number',
              'data' : 'mobile_no'
            },
            {
              'title' : 'Email',
              'data' : 'email'
            },           
            {
              'title' : 'City',
              'data' : 'city_name'
            },
            {
              'title' : 'Status',
              'data' : 'status'
            },
            {
              'title' : 'Created',
              'data' : 'created_date'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": 7 }
          ]
      };
  }


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-record-id")) {
          this.viewRecord(event.target.getAttribute("view-record-id"));
        }
        if (event.target.hasAttribute("change-misp-id")) {
          this.changeStatus(event.target.getAttribute("change-misp-id"),event.target.getAttribute("change-status-id"));
        }

        if (event.target.hasAttribute("change-privilege-url")) {
          this.redirectToPrivilege(event.target.getAttribute("change-privilege-url"));
        }

        if (event.target.hasAttribute("view-sub-dp-user-details")) {
          this.redirectSubDpUser(event.target.getAttribute("view-sub-dp-user-details"));
        }

    });
  }

  redirectSubDpUser(url){
    this.router.navigate([url]);
  }
  
  redirectToPrivilege(url){
    this.router.navigate([url]);
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.popupTitle = "Show POS Details";
    this.display='block';
    this.getDataById(id);

  }

  closePopup(){
    this.display='none';
    this.loaderActive = false;
  }


  getDataById(id){
    this.editResult = "";
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getPosDataById(sendData)
    .subscribe( response => {
      var otput_data : any = response;
      this.editResult = otput_data.result;
      this.loaderActive = false;
      console.log(this.editResult);
    });
  }


  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('status',status);
    var title = "";
    switch(status) {
      case 'active':
          title = "Are you sure you want to Inactive?";
      break;
      case 'inactive':
          title = "Are you sure you want to Active?";
      break;
    }
    Swal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
  })
  .then((willDelete) => {
    if (willDelete.value) {
      this.commonService.changeStatuseByPosId(sendData)
      .subscribe( response => {
        var output_data: any = response;
        this.runTable();
        if(output_data.status){
          Swal.fire(output_data.message, '', "success");
        }else{
          Swal.fire (output_data.message,  "" ,  "error" );
        }

    });
    }
  });

  }


}
