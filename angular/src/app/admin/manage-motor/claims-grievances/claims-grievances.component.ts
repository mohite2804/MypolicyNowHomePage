import { AfterViewInit, Component, OnInit, Renderer2,ViewChild, ChangeDetectorRef  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../services/common.service';

import { DataTableDirective } from 'angular-datatables';

import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
@Component({
  selector: 'app-claims-grievances',
  templateUrl: './claims-grievances.component.html',
  styleUrls: ['./claims-grievances.component.css']
})
export class ClaimsGrievancesComponent implements OnInit {
    base_url = environment.baseUrl;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    formchFilterDetails: FormGroup;
    loginUserId  : any;
    btnEditSubmit : boolean = false;
    display : any;
    claims_grievances_file_upload_label : any;
    formComissionUpload : any;
	formGrievancesUpload : any;
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
        this.claims_grievances_file_upload_label = "";
        this.formComissionUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
        });
		  this.formGrievancesUpload = this.formBuilder.group({
            comission_file_upload : ['',Validators.required]
        });
        this.getPublicPath();
    }     

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'click', (event) => {
        });
    }

    openModel(){
        this.btnEditSubmit = true;
        this.display='none';
    }
openModelGrievances(){
        this.btnEditSubmit = true;
        this.display='none';
    }
    submitComissionFile(){
        this.submitted = true;
		this.loaderActive = true;
        if(this.formComissionUpload.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formComissionUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
		sendData.append('type','claim');
        this.commonService.uploadClaimAndGrievancesFile(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status){   
this.loaderActive = false;			
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                this.loaderActive = false;	
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }
  submitGrievancesFile(){
        this.submitted = true;
		this.loaderActive = true;
        if(this.formGrievancesUpload.invalid){
            return;
        }
        const sendData = new FormData();
        sendData.append('comission_file_upload',this.formGrievancesUpload.value.comission_file_upload);
        sendData.append('user_id',this.loginUserId);
		sendData.append('type','grievances');
        this.commonService.uploadClaimAndGrievancesFile(sendData)
        .subscribe(response =>{
            this.editResult = response;
            console.log(this.editResult);
            if(this.editResult.status){ 
			this.loaderActive = false;			
                Swal.fire({
                    title: '',
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
            else{
                this.loaderActive = false;	
                Swal.fire({
                    title: '',          
                    html: this.editResult.message
                }).then((result) => {
                    this.windowReload();
                })
            }
        });
    }
   getPublicPath(){
        this.commonService.getPublicPath()
        .subscribe(response =>{
            this.editResult = response;
            this.public_path = this.editResult.public_path;
        })
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
            this.claims_grievances_file_upload_label = file.name;
            this.formComissionUpload.patchValue({
                'comission_file_upload' : file
            });
			this.formGrievancesUpload.patchValue({
                'comission_file_upload' : file
            });
        }
    }

    windowReload(){
        window.location.reload();
    }

   
}
