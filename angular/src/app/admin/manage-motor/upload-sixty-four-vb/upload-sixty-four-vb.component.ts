import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators } from  '@angular/forms';
import { CommonService } from '../services/common.service';
import { NotificationsService } from 'angular2-notifications';

import Swal from 'sweetalert2'


import { Router } from  '@angular/router';

import { fileExtensionValidator } from '../query-management/file-extension-validator.directive';
import { requiredFileType } from "../query-management/requireFileTypeValidator";
import { fileSizeValidator } from "../query-management/fileSizeValidator";



@Component({
  selector: 'app-upload-sixty-four-vb',
  templateUrl: './upload-sixty-four-vb.component.html',
  styleUrls: ['./upload-sixty-four-vb.component.css']
})
export class UploadSixtyFourVbComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  [x: string]: any;

  display : any;
  loginUserId  : any;
  loaderActive : boolean =  false;
  displayPD : any;
  displayUpload : any;
  displayCSVPng : any;

  formUploadCsv: FormGroup;
  submittedUploadCsv: boolean = false;
  csv_fileurl:any;
  csv_filelabel:any;
  uploaded_csv_file:any;

  csv_fileurl_label

  acceptedExtensions = "csv";

  process_data_result_display : boolean = false;
  no_of_total_records : any;
  no_of_success_rcords : any;
  no_of_duplicate_rcords : any;
  no_of_error_rcords : any;

  success_policies : any;
  duplicae_policies : any;
  error_policies : any;

  is_success_record : boolean = false;
  is_duplicate_record : boolean = false;
  is_error_record : boolean = false;
  sample_csv_path:any;
  
  access_permission:any;

  constructor(private renderer: Renderer2, private notifyService: NotificationsService, private commonService: CommonService,public router: Router,private formBuilder: FormBuilder, private elementRef: ElementRef, public cdr: ChangeDetectorRef) {
    //this.loadScripts();
    this.loginUserId = sessionStorage.getItem("adminUserId");
		this.access_permission = sessionStorage.getItem("access_permission");
  }

  ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem("adminUserId");
      this.displayPD = 'none';
      this.displayUpload = 'block';
      this.displayCSVPng = 'none';

      this.getSampleCsvPath();


      this.formUploadCsv = this.formBuilder.group({
        csv_file : ['',[Validators.required]]
      });
  }

  resetInputfieldForm(){
    this.fileInput.nativeElement.value = "";
  }

  ngAfterViewInit(): void {

  }

  getSampleCsvPath()
  {
    this.commonService.getSampleCsvPath()
    .subscribe(response => {
      var outputResultt : any = response;
      console.log(outputResultt);
      if(outputResultt.status)
      {
        this.displayCSVPng = 'block';
        this.sample_csv_path = outputResultt.sample_vb_path;
        console.log(this.sample_csv_path);
      }

    })
  }

  uploadCsvFile(event){
    // alert('sa');
    console.log('upload file');
    console.log(event);

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;

    if(file_type.toLowerCase() != 'application/vnd.ms-excel' ){
      Swal.fire ("Please Select 'csv' file",  "" ,  "error" );
      this.csv_fileurl = "";
      this.csv_fileurl_label = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.csv_fileurl = "";
      this.csv_fileurl_label = "";
    }else{
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.csv_fileurl = event.target.result;
      }
      this.csv_fileurl_label = file.name;
      this.formUploadCsv.patchValue({
        'csv_file' : file
      });
    }
  }

  submitFormUploadCsv(){
    this.uploaded_csv_file = '';
    this.submittedUploadCsv = true;
    if(this.formUploadCsv.invalid){
      return;
    }
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);

    uploadData.append('csv_file',this.formUploadCsv.value.csv_file);

    this.commonService.submitFormUploadCsvFile(uploadData)
    .subscribe(response => {
      var outputResult : any = response;
      console.log(outputResult);
      this.loaderActive = false;
      if(outputResult.status)
      {
        Swal.fire(outputResult.message,  "" ,  "success" );

        this.displayPD = 'block';  //show process data btn
        this.displayUpload = 'none';  //show otp form

        this.uploaded_csv_file = outputResult.added_file;
      }
      else
      {
        Swal.fire(outputResult.message,  "" ,  "error" );
        this.uploaded_csv_file = '';
      }
    });
  }

  successNotify(infoMsg){
    this.notifyService.success(
    'Success',
     infoMsg,
    {
        theClass: "aboveAll",
        timeOut: 3000,
        showProgressBar: true,
        animate: 'fade',
    }
    );
  }

  processCsvData()
  {
    // alert('CSV Data');
    // console.log(this.uploaded_csv_file);
    if(this.uploaded_csv_file != '')
    {
      this.loaderActive = true;
      var csvData = new FormData();
      csvData.append('loginUserId',this.loginUserId);
      csvData.append('uploaded_csv_file',this.uploaded_csv_file);

      this.commonService.processCsvFile(csvData)
        .subscribe(response => {
          var outputResult : any = response;
          console.log(outputResult);
          this.loaderActive = false;
          if(outputResult.status)
          {
            this.resetInputfieldForm();
            this.displayPD = 'none';
            this.displayUpload = 'block';
            this.displayCSVPng = 'none';

            this.formUploadCsv.patchValue({
              'csv_file' : ''
            });

            this.process_data_result_display = true;

            this.no_of_total_records = outputResult.no_of_total_records;

            this.no_of_success_rcords = outputResult.no_of_success_policy;
            this.success_policies = outputResult.success_policies;
            if(this.no_of_success_rcords>0){
              this.is_success_record = true;
            }

            this.no_of_duplicate_rcords = outputResult.no_of_duplicate_policies;
            this.duplicae_policies = outputResult.duplicate_policies;
            if(this.no_of_duplicate_rcords>0){
              this.is_duplicate_record = true;
            }

            this.no_of_error_rcords = outputResult.no_error_policies;
            this.error_policies = outputResult.error_policies;
            if(this.no_of_error_rcords>0){
              this.is_error_record = true;
            }

            Swal.fire(outputResult.message,  "" ,  "success" );




            this.csv_filelabel = '';
            this.csv_fileurl_label ='';

            this.uploaded_csv_file = '';
            this.submittedUploadCsv = false;

          }
          else
          {
            Swal.fire(outputResult.message,  "" ,  "error" );
          }
        });
    }
    else
    {
      Swal.fire('Please first upload CSV File.',  "" ,  "error" );
      this.uploaded_csv_file = '';
    }
  }

}
