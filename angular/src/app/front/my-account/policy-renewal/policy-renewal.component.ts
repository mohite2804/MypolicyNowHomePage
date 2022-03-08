import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-policyrenewal',
  templateUrl: './policy-renewal.component.html',
  styleUrls: ['./policy-renewal.component.css']
})
export class PolicyrenewalComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  loginUserType  : any;

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {


    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');


    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'get_endorsementByStatus',
              type : 'POST',
              headers: {
                "Authorization": "Bearer "+sessionStorage.getItem('user_token')
              },
              data: {
              "loginUserId": this.loginUserId,
              "loginUserType": this.loginUserType,
              "status": 1,
          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Policy Number',
              'data' : 'ref_no'
            },
            {
              'title' : 'Product Type',
              'data' : 'product_type'
            },
            {
              'title' : 'Reg. No.',
              'data' : 'reg_no'
            },
            {
              'title' : 'Insured Name',
              'data' : 'insured_name'
            },
            {
              'title' : 'Insured Mobile No',
              'data' : 'insured_mobile_no'
            },
            {
              'title' : 'Ins. Company',
              'data' : 'ins_comp'
            },
            {
              'title' : 'Prev. Premium <small class="d-block">(Incl. GST)',
              'data' : 'final_premium'
            },
            {
              'title' : 'Policy End Date',
              'data' : 'type'
            },
            {
              'title' : 'Disposition',
              'data' : 'quote_created_date'
            },
            {
              'title' : 'Sub Disposition',
              'data' : 'comment'
            },
            {
              'title' : 'Status',
              'data' : 'action_btn'
            }


          ]
      };
  }


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }



}
