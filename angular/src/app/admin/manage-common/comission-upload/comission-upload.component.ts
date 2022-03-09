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
    selector: 'app-comission-upload',
    templateUrl: './comission-upload.component.html',
    styleUrls: ['./comission-upload.component.css']
})
export class ComissionUploadComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    formchFilterDetails: FormGroup;
    loginUserId  : any;
    btnEditSubmit : boolean = false;
    display : any;
    comission_file_upload_label : any;
    formComissionUpload : any;
    submitted : boolean = false;
    loaderActive : boolean = false;
    editResult : any;
    public_path : any;
    comissionUploadedsData : any; 
    access_permission : any; 
    constructor(private renderer: Renderer2,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private excelService:ExcelService) {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.access_permission = sessionStorage.getItem("access_permission");
    }
    ngOnInit(): void {
        this.loginUserId = sessionStorage.getItem("adminUserId");
        this.comission_file_upload_label = "";
        this.getIndex();
        this.formComissionUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
        });
        this.getPublicPath();
    }

    getIndex(){
        const that = this;
        this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'admin/getHibComissionDataList',
                type : 'POST',
                data: {
                    "loginUserId": this.loginUserId
                },
                dataType: "json"
            },
            columns: [
                {
                    'title' : 'S.No',
                    'data' : 'id'
                },
                {
                    'title' : 'Policy Number',
                    'data' : 'policy_no'
                },
                {
                    'title' : 'OD Comission Amount',
                    'data' : 'od_comission_amount'
                },
                {
                    'title' : 'TP Comission Amount',
                    'data' : 'tp_comission_amount'
                },
                {
                    'title' : 'Comission Date',
                    'data' : 'comission_date'
                },
                {
                    'title' : 'OD Comission Refrence Number',
                    'data' : 'od_comission_refrence_no'
                },
                {
                    'title' : 'TP Comission Refrence Number',
                    'data' : 'tp_comission_refrence_no'
                },
                {
                    'title' : 'Comission Updated Date',
                    'data' : 'updated_on'
                }
            ],
            columnDefs: [
                { "orderable": false, "targets": [0] }
            ],
            "order": [[ 6, "desc" ]]
        };
    }

    getPublicPath(){
        this.commonService.getPublicPath()
        .subscribe(response =>{
            this.editResult = response;
            this.public_path = this.editResult.public_path;
        })
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

    openModel(){
        this.btnEditSubmit = true;
        this.display='none';
    }

    submitComissionFile(){
        this.submitted = true;
        if(this.formComissionUpload.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formComissionUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
        this.commonService.uploadComissionFile(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status){
                this.runTable();
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                this.runTable();
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }

    uploadComission(event){
        var file :any = event.target.files[0];
        var file_type:any = file.type;
        var file_size :any = file.size ;
        if(file_type.toLowerCase() != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            Swal.fire ("Please Select 'xslx' file",  "" ,  "error" );
        }else if(file_size > 5242880){
            Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        }else{
            this.comission_file_upload_label = file.name;
            this.formComissionUpload.patchValue({
                'comission_file_upload' : file
            });
        }
    }

    windowReload(){
        window.location.reload();
    }

    exportComissionData(){
        const sendData = new FormData();
			sendData.append('user_id',this.loginUserId);
    		this.commonService.downloadComissionData(sendData)
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
