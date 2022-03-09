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
    selector: 'app-approve-invoice',
    templateUrl: './approve-invoice.component.html',
    styleUrls: ['./approve-invoice.component.css']
})
export class ApproveInvoiceComponent implements OnInit {
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
    formRecodEdit : any;
    atLeastOneRequired : any;
    approveInvoicedata : any;
    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
        //this.loadScripts();
        this.loginUserId = sessionStorage.getItem("adminUserId");
    }

    ngOnInit(): void {

      this.undateInvoiceForm();

  		this.formchFilterDetails = this.formBuilder.group({
     		policy_number : ['']
     	});

        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'getInvoiceDataListAdmin',
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
                    'title' : 'Total Payable Comission',
                    'data' : 'total_payable_comission'
                },
                {
                    'title' : 'MISP Name',
                    'data' : 'misp_name'
                },
                {
                    'title' : 'MISP Id',
                    'data' : 'agent_id'
                },
                {
                    'title' : 'Is Invoice Signed By',
                    'data' : 'invoice_signed_by'
                },
                {
                    'title' : 'Scanned Copy',
                    'data' : 'scanned_copy'
                },
                {
                    'title' : 'Created On',
                    'data' : 'created_at'
                },
                {
                    'title' : 'Invoice Status',
                    'data' : 'status'
                },
                {
                    'title' : 'Invoice Comment',
                    'data' : 'inv_comment'
                },
                {
                    'title' : 'Action',
                    'data' : 'action_btn'
                }
            ]
        };
        this.showHideStatusInvoice(0);
    }

    undateInvoiceForm(){
      this.formUpdateInvoice = this.formBuilder.group({
        status : ['',Validators.required],
        invoice_comment : [''],
        invoiceid : [''],
        invoiceno : ['']
    });

    }

    showHideStatusInvoice(status_id){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(status_id).draw();
        });
    }

    showHideStatusInvoice_old(statusid){
        this.div_show_endorsement_new = true;
        this.div_show_endorsement_status = false;
        this.statusval = statusid;
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'get_endorsementByStatus',
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
                  'title' : 'Final Premium <small class="d-block">(Incl. GST)',
                  'data' : 'final_premium'
                },
                {
                  'title' : 'Type',
                  'data' : 'type'
                },
                {
                  'title' : 'Created Date',
                  'data' : 'quote_created_date'
                },
                {
                  'title' : 'Status',
                  'data' : 'action_btn'
                }
            ]
        };
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(this.statusval).draw();
        });
    }

    exportAsXLSX(){
        const sendData = new FormData();
        //sendData.append('loginUserId',this.loginUserId);
        this.commonService.getApproveInvoicesData(sendData)
              .subscribe( response => {
                this.approveInvoicedata = response;
                //console.log(this.modelsdata);
               this.excelService.exportAsExcelFile(this.approveInvoicedata, 'approveInvoiceData');
              });
      }


    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("invoice-id") && event.target.hasAttribute("invoice-no")) {
                this.setData(event.target.getAttribute("invoice-id"),event.target.getAttribute("invoice-no"));
            }

            if(event.target.hasAttribute("invoice-pdf")) {
                this.downloadInvoicePdf(event.target.getAttribute("invoice-pdf"));
            }
        });
    }

    setData(invoice_id,invoice_no){
        this.formUpdateInvoice.patchValue({
            invoiceid : invoice_id,
            invoiceno : invoice_no
        });
    }

    downloadInvoicePdf(url){
        this.downloadFile(this.base_url+'generateinvoicepdf/'+url);
    }

    downloadFile(download_url){
        window.open(download_url, '_blank');
    }

    // changeInvoiceStatus(id,invoice_no){
    //     var sendData = new FormData();
    //     sendData.append('invoice_id',id);
    //     sendData.append('invoice_no',invoice_no);
    //     sendData.append('loginUserId',this.loginUserId);
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Confirm',
    //         cancelButtonText: 'Cancel'
    //     })
    //     .then((willDelete) => {
    //         if (willDelete.value) {
    //             this.commonService.changeStatusByInvoiceId(sendData)
    //             .subscribe( response => {
    //                 this.editResult = response;
    //                 if(this.editResult.status){
    //                     Swal.fire({
    //                         title: '',
    //                         html: this.editResult.message,
    //                         timer: 2000
    //                     }).then((result) => {
    //                         this.windowReload();
    //                     })
    //                 }
    //                 else{
    //                     Swal.fire({
    //                         title: '',
    //                         html: this.editResult.message,
    //                         timer: 2000
    //                     }).then((result) => {
    //                         this.windowReload();
    //                     })
    //                 }
    //             });
    //         }
    //     });
    // }


    submitForm(){
        this.submitted = true;
        if(this.formUpdateInvoice.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('invoice_comment',this.formUpdateInvoice.value.invoice_comment);
        sendData.append('status',this.formUpdateInvoice.value.status);
        sendData.append('invoice_id',this.formUpdateInvoice.value.invoiceid);
        sendData.append('invoice_no',this.formUpdateInvoice.value.invoiceno);
        sendData.append('loginUserId',this.loginUserId);
        this.commonService.updateInvoiceStatus(sendData)
        .subscribe(response =>{
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
        this.invoice_comment_box_hide = false;
        if(event.target.value==1){
            this.invoice_comment_box_hide = true;
        }
    }
}
