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
    selector: 'app-approve-gst',
    templateUrl: './approve-gst.component.html',
    styleUrls: ['./approve-gst.component.css']
})
export class ApproveGSTComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    formchFilterDetails: FormGroup;
    div_show_endorsement_new : boolean = true;
    div_show_endorsement_status : boolean = false;
    gst_comment_box_hide : boolean = false;
    statusval : any = 1;
    result : any;
    loginUserId : any;
    formUpdateGST : any;
    submitted : any = false;
    invoiceid : any;
    response : any;
    approveGstdata : any;
    loaderActive : any;
    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
        //this.loadScripts();
        this.loginUserId = sessionStorage.getItem("adminUserId");
    }

    ngOnInit(): void {
  		this.formchFilterDetails = this.formBuilder.group({
     		policy_number : ['']
     	});

      this.undateGstForm();

      const that = this;

       this.getIndex();


    }

    getIndex(){
      this.dtOptions = {
        "pagingType": 'full_numbers',
        "pageLength": 10,
        "serverSide": true,
        "processing": true,
        'ajax' : {
            url : this.base_url+'admin/getGstDataListAdmin',
            type : 'POST',
            data: {
                "loginUserId": this.loginUserId,
                "status": this.statusval,
            },
            dataType: "json",
        },
        columns: [
            {
              'title' : 'Sr.No',
              'data' : 'sno'
            },
            {
              'title' : 'Invoice No.',
              'data' : 'invoice_no'
            },
            {
              'title' : 'Invoice Date',
              'data' : 'invoice_date'
            },
            {
              'title' : 'Invoice Month',
              'data' : 'invoice_month'
            },
            {
              'title' : 'GST Amount',
              'data' : 'total_gst_on_commission'
            },
            {
              'title' : 'Is File uploaded',
              'data' : 'file_status'
            },
            {
              'title' : 'File Name',
              'data' : 'file_name'
            },
            {
              'title' : 'MISP Id',
              'data' : 'agent_id'
            },
            {
              'title' : 'MISP Name',
              'data' : 'agent_name'
            },
            {
              'title' : 'Approval Status',
              'data' : 'status'
            },
            {
              'title' : 'Comment',
              'data' : 'comment'
            },
            {
              'title' : 'Created At',
              'data' : 'created_at'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }
        ],
        columnDefs: [
          { "orderable": false, "targets": 12 }
        ],
        order: [[ 11, "desc" ]]
      }



    }

    showHideGST(stuatus_id){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(0).search(stuatus_id).draw();
      });
    }

    undateGstForm(){
      this.formUpdateGST = this.formBuilder.group({
        status : ['',Validators.required],
        gst_comment : [''],
        invoiceid : [''],
        invoiceno : ['']
    });

    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("invoice-id") && event.target.hasAttribute("invoice-no")) {
                this.setData(event.target.getAttribute("invoice-id"),event.target.getAttribute("invoice-no"));
            }
        });
    }

    setData(invoice_id,invoice_no){
        this.formUpdateGST.patchValue({
            invoiceid : invoice_id,
            invoiceno : invoice_no
        });
    }

    submitForm(){
        this.submitted = true;
        if(this.formUpdateGST.invalid){
            return;
        }
        this.loaderActive = true;
        const sendData = new FormData();
        sendData.append('gst_comment',this.formUpdateGST.value.gst_comment);
        sendData.append('status',this.formUpdateGST.value.status);
        sendData.append('invoice_id',this.formUpdateGST.value.invoiceid);
        sendData.append('invoice_no',this.formUpdateGST.value.invoiceno);
        sendData.append('loginUserId',this.loginUserId);
        this.commonService.updateGSTStatus(sendData)
        .subscribe(response =>{
            this.loaderActive = false;
            this.response = response;
            if(this.response.status){
                Swal.fire({
                    title: '',
                    html: this.response.message,
                    timer: 2000
                }).then((result) => {
                    this.windowReload();
                })
            }else{
                Swal.fire({
                    title: '',
                    html: this.response.message,
                    timer: 5000
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }

    windowReload(){
        window.location.reload();
    }

    comment_box(event){
        this.gst_comment_box_hide = false;
        if(event.target.value==1){
            this.gst_comment_box_hide = true;
        }
    }
}
