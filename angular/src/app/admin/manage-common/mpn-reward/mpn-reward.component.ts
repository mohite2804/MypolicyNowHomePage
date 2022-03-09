import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import {ExcelService} from '../../services/excel.service';
@Component({
    selector: 'app-mpn-reward',
    templateUrl: './mpn-reward.component.html',
    styleUrls: ['./mpn-reward.component.css']
})
export class MpnRewardComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    formchFilterDetails: FormGroup;
    div_show_endorsement_new : boolean = true;
    div_show_endorsement_status : boolean = false;
    invoice_comment_box_hide : boolean = false;
    statusval : any = 1;
    result : any;
    loginUserId  : any;
    formUpdateInvoice : any;
    submitted : any = false;
    invoiceid : any;
    editResult : any;
    response : any;
    //formRecodEdit :any;
    mpnRewardsdata : any;
    atLeastOneRequired : any;
    
    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
    }

    ngOnInit(): void {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.getIndex();
    }

    getIndex(){
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'admin/getHibRewardDataList',
                type : 'POST',
                data: {
                    "loginUserId": this.loginUserId
                },
                dataType: "json",
            },
            columns: [
                {
                    'title' : 'S.No',
                    'data' : 'id'
                },
                {
                    'title' : 'Dealer Code',
                    'data' : 'dealer_code'
                },
                {
                    'title' : 'Product Type',
                    'data' : 'product_type'
                },
                {
                    'title' : 'Policy Number',
                    'data' : 'policy_no'
                },
                {
                    'title' : 'Policy Type',
                    'data' : 'policy_type_label'
                },
                {
                    'title' : 'Policy Sub Type',
                    'data' : 'policy_sub_type_label'
                },
                {
                    'title' : 'Policy Issue Date',
                    'data' : 'policy_created_at'
                },
                {
                    'title' : 'Insurance Company',
                    'data' : 'ic'
                },
                {
                    'title' : 'Vehicle Age',
                    'data' : 'vehicle_age'
                },
                {
                    'title' : 'OD Premium',
                    'data' : 'basic_od'
                },
                {
                    'title' : 'TP Premium',
                    'data' : 'basic_tp'
                },
                {
                    'title' : '64 VB Status',
                    'data' : 'sixty_four_vb_status'
                },
                {
                    'title' : 'OD Comission Receivable',
                    'data' : 'od_comission_receivable'
                },
                {
                    'title' : 'TP Comission Receivable',
                    'data' : 'tp_comission_receivable'
                },
                {
                    'title' : 'OD Comission Received',
                    'data' : 'od_comission_received'
                },
                {
                    'title' : 'TP Comission Received',
                    'data' : 'tp_comission_received'
                },
                {
                    'title' : 'Balance',
                    'data' : 'balance'
                },
                {
                    'title' : 'Comission Updated Date',
                    'data' : 'comission_updated_date'
                }
            ],
            columnDefs: [
                { "orderable": false, "targets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] }
            ],
            "order": [[ 3, "desc" ]]
        };
    }

    runTable(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
        });
    }



    exportAsXLSX(){
        const sendData = new FormData();
        //sendData.append('loginUserId',this.loginUserId);
        this.commonService.getMpnRewardsData(sendData)
              .subscribe( response => {
                this.mpnRewardsdata = response;
                //console.log(this.modelsdata);
               this.excelService.exportAsExcelFile(this.mpnRewardsdata, 'mpnRewardsdata');
              });
      }
}
