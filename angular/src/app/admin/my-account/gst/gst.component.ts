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
  formGstUpload : any;
  loaderActive : any;
  submitted : boolean = false;
  editResult : any;
 

  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 

  }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("user_id");
    this.getIndex();

    this.formGstUpload = this.formBuilder.group({      
      invoice_id : [''],
      invoice_no : [''],
      gst_file_upload : ['',Validators.required]     
    });
    
  }


  getIndex(){
    console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'getgstdatalist',
              type : 'POST',
              data: {                
              "loginUserId": this.loginUserId,
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


          ]
      };
  }

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

   ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        // if (event.target.hasAttribute("view-record-id")) {
        //    alert(event.target.getAttribute("view-record-id"));
        //   this.setInvoiceId(event.target.getAttribute("view-record-id"));
        // }
        if (event.target.hasAttribute("invoice_id") && event.target.hasAttribute("invoice_no")) {          
          this.setInvoiceId(event.target.getAttribute("invoice_id"),event.target.getAttribute("invoice_no"));
        }
        // if (event.target.hasAttribute("view-delete-id")) {
        //   this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        // }            
        // if (event.target.hasAttribute("view-active-id")) {
        //   this.changeStatus(event.target.getAttribute("view-active-id"),2);
        // }
        // if (event.target.hasAttribute("view-inactive-id")) {
        //   this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        // }
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
        Swal.fire(this.editResult.message, '', "success"); 
        
      }else{
        Swal.fire (this.editResult.message,  "" ,  "error" );       
      }
    });
  }


 uploadGST(event){ 
    
      let file = event.target.files[0];   
      console.log('uploadGSTfile............');
      console.log(file);      
      this.formGstUpload.patchValue({
        'gst_file_upload' : file
      }); 
    }
  
 



}
