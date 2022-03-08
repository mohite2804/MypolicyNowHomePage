import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-gst',
    templateUrl: './gst.component.html',
    styleUrls: ['./gst.component.css']
})
export class GstComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    loginUserId  : any;
    loginUserType  : any;
    formGstUpload : any;
    loaderActive : any;
    submitted : boolean = false;
    editResult : any;
    gst_file_upload_label : any;
    result : any;
    token  : any;

    constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.loginUserId = sessionStorage.getItem("user_id");
        this.loginUserType = sessionStorage.getItem('user_type_id');
        this.gst_file_upload_label = "";

        this.token = sessionStorage.getItem("user_token");

        this.validateUserLoginStatus(this.loginUserId,this.token);
        
        this.getIndex();
        this.formGstUpload = this.formBuilder.group({
            invoice_id : [''],
            invoice_no : [''],
            gst_file_upload : ['',Validators.required]
        });
    }

    validateUserLoginStatus(loginUserId,token){
        this.loaderActive = true;
        let uploadData = new FormData();  

        uploadData.append('loginUserId',this.loginUserId);
        uploadData.append('token',token);

        this.commonService.validateUserLoginStatus(uploadData)
        .subscribe(response => {
            this.result = response;
            this.loaderActive = false;
            if(this.result.status){
                //valid status i.e. not login from another location
            }else{
                Swal.fire({
                    title: 'error',
                    html: 'It seems that you have login from another location. You are logged out from this session?',
                    timer: 3500
                }).then((result) => {
                    this.router.navigate(['/login']);
                });
            }
        });
    }


    getIndex(){
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'myaccount/getgstdatalist',
                type : 'POST',
                headers: {
                    "Authorization": "Bearer "+sessionStorage.getItem('user_token')
                },
                data: {
                    "loginUserId": this.loginUserId,
                    "loginUserType": this.loginUserType,
                    "status" : false
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
                    'data' : 'invoice_date'
                },
                {
                    'title' : 'GST Amount',
                    'data' : 'total_payable_comission'
                },
                {
                    'title' : 'Is File uploaded',
                    'data' : 'is_file_uploaded'
                },
                {
                    'title' : 'File Name',
                    'data' : 'file_name'
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
              { "orderable": false, "targets": 10 }
            ],
            order: [[ 9, "desc" ]]
        };
    }

    runTable(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
            if (event.target.hasAttribute("invoice_id") && event.target.hasAttribute("invoice_no")) {
                this.setInvoiceId(event.target.getAttribute("invoice_id"),event.target.getAttribute("invoice_no"));
            }
        });
    }

    setInvoiceId(invoice_id,invoice_no){
        this.formGstUpload.patchValue({
            invoice_id : invoice_id,
            invoice_no :invoice_no,
        });
    }

    submitGstFile(){
        this.submitted = true;
        if(this.formGstUpload.invalid){
            return;
        }
        this.loaderActive = true;
        const sendData = new FormData();
        console.log('test file'+this.formGstUpload.value.gst_file_upload);
        sendData.append('invoice_id',this.formGstUpload.value.invoice_id);
        sendData.append('invoice_no',this.formGstUpload.value.invoice_no);
        sendData.append('gst_file_upload',this.formGstUpload.value.gst_file_upload);
        sendData.append('user_id',this.loginUserId);
        this.commonService.uploadGstFile(sendData)
        .subscribe(response =>{
            this.loaderActive = false;
            this.editResult = response;
            if(this.editResult.status){
                this.runTable();
                Swal.fire({
                    title: '',
                    html: this.editResult.message,
                    timer: 2000
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                Swal.fire({
                    title: '',
                    html: this.editResult.message,
                    timer: 2000
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }

    uploadGST(event){
      var file :any = event.target.files[0];
      var file_type:any = file.type;
      var file_size :any = file.size ;

      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      }else{
        this.gst_file_upload_label = file.name;
        this.formGstUpload.patchValue({
          'gst_file_upload' : file
        });
      }
    }

    windowReload(){
        window.location.reload();
    }

}