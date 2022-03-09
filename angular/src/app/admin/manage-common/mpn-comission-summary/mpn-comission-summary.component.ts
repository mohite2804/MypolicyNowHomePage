import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2';
import {ExcelService} from '../../services/excel.service';
@Component({
    selector: 'app-mpn-comission-summary',
    templateUrl: './mpn-comission-summary.component.html',
    styleUrls: ['./mpn-comission-summary.component.css']
})
export class MpnComissionSummaryComponent implements OnInit {
    base_url = environment.baseUrl;
    // dtOptions: DataTables.Settings = {};
    dtOptions: any = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    loginUserId  : any;
    comissionUploadedsData : any; 

    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) { }

    ngOnInit(): void {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.getIndex();
    }

    getIndex(){
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 30,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'admin/getHibComissionSummaryList',
                type : 'POST',
                data: {
                    "loginUserId": this.loginUserId
                },
                dataType: "json",
            },
            columns: [
                {
                    'title' : 'Sr.No',
                    'data' : 'id'
                },
                {
                    'title' : 'IC Name',
                    'data' : 'ic_name'
                },
                {
                    'title' : 'Total OD Premium',
                    'data' : 'total_od_premium'
                },
                {
                    'title' : 'Total TP Premium',
                    'data' : 'total_tp_premium'
                },
                {
                    'title' : 'Total OD Comission Receivable',
                    'data' : 'total_od_comission_receivable'
                },
                {
                    'title' : 'Total TP Comission Receivable',
                    'data' : 'total_tp_comission_receivable'
                },
                {
                    'title' : 'Total OD Comission Received',
                    'data' : 'total_od_comission_received'
                },
                {
                    'title' : 'Total TP Comission Received',
                    'data' : 'total_tp_comission_received'
                },
                {
                    'title' : 'Total Balance',
                    'data' : 'total_balance'
                }
            ],
            columnDefs: [{ "orderable": false, "targets": [2,3,4,5,6,7,8]}],
            "lengthChange" : false,
            dom: 'Bfrtip',
            buttons: [{extend: 'excel', text : '<i class="fa fa-download"></i> Download Comission Summary', title : 'Comission Summary', className: 'btn btn-custom green'}],
            order: [[ 1, "desc" ]]
        };
    }

        exportComissionData(){
        const sendData = new FormData();
            sendData.append('user_id',this.loginUserId);
            this.commonService.downloadComissionSummary(sendData)
            .subscribe( response => {
                var data : any  = response;
                if(data.status){
                    this.comissionUploadedsData = data.result;
                    this.excelService.exportAsExcelFile(this.comissionUploadedsData, 'Comission Uploaded Data');
                }
                else{
                    Swal.fire({position: 'center',icon: 'error',title: 'No Data Available', showConfirmButton: true, timer: 3000 });
                }
            });
    }
}

