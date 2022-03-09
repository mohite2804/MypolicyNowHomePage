
import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-active-dealers',
  templateUrl: './active-dealers.component.html'
})
export class ActiveDealersComponent implements OnInit {

   base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  loaderActive : boolean =  false;
  is_isuzu  : any;
  misp  : any;
  hide_export : boolean = true;

  constructor(private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
   }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.getIndex(); 
  }

  getIndex(){
    this.misp='Business Partner Name';
    if(this.is_isuzu==1){
      this.misp='MISP';
    }
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/get-active-dealers-list',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId
          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'S.No',
              'data' : 'sno'
            },
            {
              'title' : this.misp,
              'data' : 'name'
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
}
