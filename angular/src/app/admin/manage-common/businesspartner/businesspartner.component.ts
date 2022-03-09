import { Component, OnInit,Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray  } from  '@angular/forms';
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-businesspartner',
  templateUrl: './businesspartner.component.html',
  styleUrls: ['./businesspartner.component.css']
})
export class BusinessPartnerComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
 dtRendered = true;

  loginUserId : any;
  editResult : any;

  formRecodEdit : any;
  formRecordEdit : any;
  display : any;
  loaderActive : boolean =  false;
  fileUpload : any;
  downloadurl : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  popupTitle = "Business Partner Details";
  responseMsg : any;
  msgClass: any;
  BackPosUrl: any;
  PincodeDetailsData : any;
  statusval : any = 1;
  showInputDiv = "block";

  //validation_for_name_with_space :any = "^[a-zA-Z ]*$";
  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_gst_no :any   = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  access_permission :any;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,public cdr: ChangeDetectorRef) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }


  ngOnInit(): void {
    this.getIndex();
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.showHideStatus(1);

    this.formRecordEdit = this.formBuilder.group({  
      id :[''],
      name : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern('^[a-zA-Z ]{2,25}$')]],
      address : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9 \'\-\,\)\(\. )]{2,500}$')]],
      email : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern(this.validation_for_email)]],
      mobile_no : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,Validators.pattern('^((\\+91-?)|0)?[1-9]{1}[0-9]{9}$')]],
      gst_no : ['',[Validators.pattern(this.validation_for_gst_no)]],
      
    });

  }



  getIndex(){
    //console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getBusinessPartnerWithLogin',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,

          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'S.No',
              'data' : 'sno'
            },
             {
              'title' : 'Partner Code',
              'data' : 'partner_code'
            },
            {
              'title' : 'Name',
              'data' : 'name'
            },
            {
              'title' : 'GST Number',
              'data' : 'gst_no'
            },
            {
              'title' : 'Mobile Number',
              'data' : 'mobile_no'
            },
            {
              'title' : 'Email',
              'data' : 'email'
            },
            {
              'title' : 'Address',
              'data' : 'address'
            },
            {
              'title' : 'Status',
              'data' : 'status'
            },
            {
              'title' : 'Created',
              'data' : 'created_at'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": [0,8,9] }
          ],
          order: [[ 8, "desc" ]]
      };
  }


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-record-id")) {
          this.viewRecord(event.target.getAttribute("view-record-id"));
        }

        if (event.target.hasAttribute("change-misp-id")) {
          this.changeStatus(event.target.getAttribute("change-misp-id"),event.target.getAttribute("change-status-id"));
        }

        if (event.target.hasAttribute("view-edit-id")) {
          this.editRecord(event.target.getAttribute("view-edit-id"));
        }

        if (event.target.hasAttribute("view-dp-details")) {
          this.redirectDp(event.target.getAttribute("view-dp-details"));
        }

        if (event.target.hasAttribute("view-misp-privilege")) {
          this.redirectPrivilege(event.target.getAttribute("view-misp-privilege"));
        }



    });
  }


  redirectPrivilege(url){
    //alert('innn');
    this.router.navigate([url]);
  }

  redirectDp(url){
    sessionStorage.setItem('BackPosUrl',url);
    this.router.navigate([url]);
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.popupTitle = "Show Business Partner Details";
    
    this.getDataById(id);

  }

  closePopup(){
    this.display='none';
    this.loaderActive = false;
  }


  getDataById(id){
    this.editResult = "";
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getMispDataById(sendData)
    .subscribe( response => {
      var otput_data : any = response;
      this.editResult = otput_data.result;
      this.display='block';
      this.loaderActive = false;
      console.log(this.editResult);
    });
  }


  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('status',status);
    sendData.append('loginUserId',this.loginUserId);
    var title = "";
    switch(status) {
      case 'active':
          title = "Are you sure you want to Inactive?";
      break;
      case 'inactive':
          title = "Are you sure you want to Active?";
      break;
    }
    Swal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
  })
  .then((willDelete) => {
    if (willDelete.value) {
      this.loaderActive = true;
      this.commonService.changeStatuseByMispId(sendData)
      .subscribe( response => {
        var output_data: any = response;
        this.runTable();
        this.loaderActive = false;
        if(output_data.status){
          Swal.fire(output_data.message, '', "success");
        }else{
          Swal.fire (output_data.message,  "" ,  "error" );
        }

    });
    }
  });

  }

  //Start -- Edit Record

  editRecord(id){
    this.showInputDiv = "block";
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Business Partner Details";
    this.display='none';
    this.getDataById1(id);
  }

  getDataById1(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getMispDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.setFormData(this.editResult);
    });
  }


  setFormData(result){
    this.loaderActive = true;
    setTimeout(() => {
      this.formRecordEdit.patchValue({
        id : result.result.business_partner_master_id,
        name : result.result.name,
        mobile_no : result.result.mobile_no,
        email : result.result.email,
        gst_no : result.result.gst_no,
        partner_code : result.result.partner_code,
        address : result.result.address,
      });
    this.loaderActive = false;
    }, 4000);  
  }

  resetForm(){
      this.submitted = false;
      this.formRecordEdit.patchValue({
        id : 0,
        name : '',
        mobile_no : '',
        email : '',
        gst_no : '',
        partner_code :'',
        address :'',
      });
  }

  submitForm(){
    this.submitted = true;
    if(this.formRecordEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('id',this.formRecordEdit.value.id);
    sendData.append('name',this.formRecordEdit.value.name);
    sendData.append('mobile_no',this.formRecordEdit.value.mobile_no);
    sendData.append('email',this.formRecordEdit.value.email);
    sendData.append('gst_no',this.formRecordEdit.value.gst_no);
    sendData.append('partner_code',this.formRecordEdit.value.partner_code);
    sendData.append('address',this.formRecordEdit.value.address);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.mispUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopupSuccess();
        this.closeAddExpenseModal.nativeElement.click();
        this.showInputDiv = "none";
        Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
      }else{
        Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
      }
    });
  }

  closePopupSuccess(){
    this.display='none';
    this.resetForm();
    this.loaderActive = false;
  }

  //End -- Edit Record

    showHideStatus(statusid){
        this.statusval = statusid;
        const that = this;
        // make sure your template notices it
        this.cdr.detectChanges();
        // initialize them again
        this.dtRendered = true;
        this.cdr.detectChanges();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.columns(0).search(this.statusval).draw();
        });
    }
} 
