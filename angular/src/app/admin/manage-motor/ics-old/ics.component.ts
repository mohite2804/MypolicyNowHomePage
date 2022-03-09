import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-ics',
  templateUrl: './ics.component.html',
  styleUrls: ['./ics.component.css']
})
export class IcsComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;
  formRecodEdit: FormGroup;

  //formRecodEdit : any;

  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  logo_src : any;
  signature_src : any;
  responseMsg : any;
  msgClass: any;
  icsData : any;
  bankDetailsData : any;
 output_result:any;
  selected_logo : any;
  selected_signature : any;

  selectedSector : any;
  selectedInspection_done_by : any;
  selectedStatus : any;

  //validation_for_name_with_space :any = "^[a-zA-Z ]*$";
  validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
  validation_for_gst_no :any   = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  displayBreakInWaiverDays:any;
  displayInspectionDOneBy:any;
  access_permission : any;


  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      short_code : ['',[Validators.required,this.customvalidationService.cannotContainSpace(),
        this.customvalidationService.cannotContainZero(),
        Validators.pattern(this.validation_for_name_with_space)]],
      code : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),
        Validators.required,Validators.pattern(this.validation_for_name_with_space)]],
      logo : [''],
      signature : [''],
      // proposal_prefix : [''],
      proposal_prefix  : [[Validators.required],[Validators.pattern('^[a-zA-Z0-9\-_]{0,10}$')]],
      name : [[Validators.required],[Validators.pattern('^[a-zA-Z ]{2,25}$')]],
      address : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required,
        Validators.pattern('^[a-zA-Z0-9 \'\-]{2,500}$')]],
      sector : ['',[Validators.required]],
      support_email : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),
        Validators.required,Validators.pattern(this.validation_for_email)]],
      mobile : ['',[Validators.pattern("^[6-9][0-9]{9}$")]],
      // landline : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),
      //   Validators.pattern("^[0-9]{2,4}[- ][0-9]{6,8}$")]], // 0395-25950612
      // tollfree : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),
      // Validators.pattern("^(1800)[- ][0-9]{3}[- ][0-9]{4}$")]], //1800-333-4444
      // website_url : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern(this.urlRegex)]],

      landline : ['',[Validators.pattern("^[0-9]{2,4}[- ][0-9]{6,8}$")]], // 0395-25950612  
      tollfree : ['',[Validators.pattern("^(1800)[- ][0-9]{3}[- ][0-9]{4}$")]], //1800-333-4444
      website_url : ['',[Validators.pattern(this.urlRegex)]],

      // inspection_done_by : ['',[this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),Validators.required]],
      is_breakin_waiver : ['',[Validators.required]],
      breakin_waiver_days : [''],
      inspection_done_by : [''],
      broker_code : ['',[this.customvalidationService.cannotContainZero(),this.customvalidationService.cannotContainSpace(),Validators.required,Validators.pattern('^[a-zA-Z0-9 \'\-]{2,20}$')]],
      bank_branch : ['',[Validators.required]],
      bank_acc_no : ['',[this.customvalidationService.cannotContainZero(),this.customvalidationService.cannotContainSpace(),Validators.minLength(9), Validators.maxLength(18),Validators.required,Validators.pattern("^[0-9 ]*$")]],
      bank_name : ['',[Validators.required]],
      client_code : ['',[Validators.pattern('^[a-zA-Z0-9]+$')]],
      //uin_no : ['',[this.customvalidationService.cannotContainZero(),this.customvalidationService.cannotContainSpace(),Validators.minLength(9), Validators.maxLength(15),Validators.required,Validators.pattern(this.validation_for_gst_no)]],
      uin_no : [[Validators.required],[Validators.pattern('^[a-zA-Z0-9\-_]{0,40}$')]],
      status : ['',[Validators.required]],
      logo_img : [''],
      signature_img : [''],
      ifsc_code : ['',[
        Validators.pattern("^[A-Za-z]{4}0[a-zA-Z0-9]{6}$"),
        Validators.required

      ]] // abcd0abc123 // regex = "^[A-Z]{4}0[A-Z0-9]{6}$";
    });
    this.getIndex();
   // this.getStatusData();
   // this.getIcsData();
    this.getIcsStatus();
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.displayBreakInWaiverDays = 'none';
    this.displayInspectionDOneBy = 'none';
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
          break;

          case 'sector':
          this.formRecodEdit.patchValue({sector : selected_value });
          break;

          case 'inspection_done_by':
          this.formRecodEdit.patchValue({inspection_done_by : selected_value });
          break;
      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'status':
        this.formRecodEdit.patchValue({status : '' });
        this.selectedStatus = "";
        break;

        case 'sector':
        this.formRecodEdit.patchValue({sector : '' });
        this.selectedSector = "";
        break;

        case 'inspection_done_by':
        this.formRecodEdit.patchValue({inspection_done_by : '' });
        this.selectedInspection_done_by = "";
        break;

    }
  }

  successNotify(infoMsg){
    this.notifyService.success(
    'Success',
     infoMsg,
    {
        position: "top",
        theClass: "aboveAll",
        timeOut: 3000,
        showProgressBar: true,
        animate: 'fade',
    }
    );
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
              url : this.base_url+'admin/geticlist',
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
              'title' : 'IC Code',
              'data' : 'short_code'
            },
            {
              'title' : 'IC Name',
              'data' : 'code'
            },
            {
              'title' : 'Name',
              'data' : 'name'
            },
            {
              'title' : 'Address',
              'data' : 'address'
            },
            {
              'title' : 'Sector',
              'data' : 'sector'
            },

            {
              'title' : 'Support Email',
              'data' : 'support_email'
            },
            {
              'title' : 'Created By',
              'data' : 'created_by'
            },
            {
              'title' : 'Updated By',
              'data' : 'updated_by'
            },
            {
              'title' : 'Status',
              'data' : 'status'
            },

            {
              'title' : 'Action',
              'data' : 'action_btn'
            }

          ],

          columnDefs: [
            { "orderable": false, "targets": 8 },
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 2, "asc" ]]
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
        if (event.target.hasAttribute("view-edit-id")) {
          this.editRecord(event.target.getAttribute("view-edit-id"));
        }
        if (event.target.hasAttribute("view-delete-id")) {
          this.changeStatus(event.target.getAttribute("view-delete-id"),'deleted');
        }
        if (event.target.hasAttribute("view-active-id")) {
          this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }

        if (event.target.hasAttribute("view-Privilege-id")) {
          this.changePrivilege(event.target.getAttribute("view-Privilege-id"));
        }
        if (event.target.hasAttribute("view-Branch-id")) {
          this.addBranch(event.target.getAttribute("view-Branch-id"));
        }
    });
  }

  changePrivilege(ic_id){
    //alert("admin/manage-motor/ic-privilege/"+ic_id);
    //http://localhost:4200/admin/manage-motor/ic-privilege/3
    this.router.navigate(["admin/manage-motor/ic-privilege/"+ic_id]);
  }

  addBranch(ic_id){
    //alert("admin/manage-motor/ic-privilege/"+ic_id);
    //http://localhost:4200/admin/manage-motor/ic-privilege/3
    this.router.navigate(["admin/manage-motor/addbranch/"+ic_id]);
  }

  resetForm(){
      this.submitted = false;
      this.selectedSector = "";
      this.selectedInspection_done_by ="";
      this.selectedStatus = "";
      this.logo_src = '';
      this.signature_src = '';
      this.formRecodEdit.patchValue({
        id : 0,
        short_code : '',
        code : '',
        logo : '',
        signature : '',
        name : '',
        address : '',
        sector : '',
        proposal_prefix:'',
        support_email : '',
        mobile : '',
        landline : '',
        tollfree : '',
        website_url :'',
        inspection_done_by : '',
        broker_code : '',
        bank_branch : '',
        bank_acc_no : '',
        bank_name : '',
        client_code : '',
        uin_no : '',
        status : '',
        ifsc_code : ''
      });

  }

  closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }

  closePopupSuccess(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
  }

  closePopupFailed(){
    this.display='block';
    this.loaderActive = false;
  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getIcDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      //console.log("dsdsds"+this.editResult.result.signature);
      if(this.editResult.result.logo==''){
          this.logo_src= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.logo_src= this.editResult.base_url+"/uploads/ics/logo/"+this.editResult.result.logo;
      }

      if(this.editResult.result.signature==''){
          this.signature_src= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.signature_src = this.editResult.base_url+"/uploads/ics/signature/"+this.editResult.result.signature;
      }

      this.setFormData(this.editResult);
      console.log(this.editResult);
    });
  }

  getStatusData(){
    this.loaderActive = true;
      this.commonService.getStatusData()
        .subscribe( response => {
          this.loaderActive = false;
          this.statusData = response;
          this.statusData = this.statusData.result;
          //this.setFormData(this.state_data);
          console.log(this.statusData);
        });

    }

   getIcsData(){
    this.loaderActive = true;
      this.commonService.getIcData()
        .subscribe( response => {
          this.loaderActive = false;
          this.icsData = response;
          this.icsData = this.icsData.result;
          //this.setFormData(this.state_data);
          console.log(this.icsData);
        });

    }

     getIcsStatus(){
      this.loaderActive = true;
      this.commonService.getIcsStatus()
        .subscribe( response => {
          this.loaderActive = false;
        this.output_result = response;

          this.icsData = this.output_result.ics.result;
          this.statusData = this.output_result.statusData.result;


        });

    }


   getBankDetails(ifsccode){

    var is_vallid :any = this.formRecodEdit.controls.ifsc_code.status;
    console.log(is_vallid)

      if(is_vallid != "INVALID" && ifsccode.length == 11 ){

        this.loaderActive = true;
        var sendData = new FormData();
        sendData.append('ifsc_code',ifsccode);
        this.commonService.getBankDetails(sendData)
          .subscribe( response => {
          this.loaderActive = false;
          this.bankDetailsData = response;
          if(this.bankDetailsData.status){
            this.formRecodEdit.patchValue({
                bank_branch : this.bankDetailsData.result.branch,
                bank_name :this.bankDetailsData.result.bank
              });

          }else{
            this.formRecodEdit.patchValue({
                bank_branch : '',
                bank_name :''

              });


          }

        });

      }
    }

  setFormData(result){

    this.selectedSector = result.result.sector;
    this.selectedInspection_done_by = result.result.inspection_done_by;
    this.selectedStatus = result.result.status_id;
    this.formRecodEdit.patchValue({
      id : result.result.id,
      short_code : result.result.short_code,
      code : result.result.code,
      proposal_prefix : result.result.proposal_prefix,
      name : result.result.name,
      address : result.result.address,
      sector : result.result.sector,
      support_email : result.result.support_email,
      mobile : result.result.mobile,
      landline : result.result.landline,
      tollfree : result.result.tollfree,
      website_url : result.result.website_url,
      inspection_done_by : result.result.inspection_done_by,
      broker_code : result.result.broker_code,
      bank_branch : result.result.bank_branch,
      bank_acc_no : result.result.bank_acc_no,
      bank_name : result.result.bank_name,
      client_code : result.result.client_code,
      uin_no : result.result.uin_no,
      status : result.result.status_id,
      logo_img : result.result.logo,
      signature_img : result.result.signature
    });
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show IC Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    console.log(this.btnEditSubmit);
    this.resetForm();
    this.popupTitle = "Add IC Details";
    this.display='none';
    this.showCreateBtn = true;
    this.logo_src = '';
    this.signature_src = '';
    // this.getDataById(id);

  }


  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update IC Details";
    this.display='none';
    this.getDataById(id);

  }

  submitForm(){
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('id',this.formRecodEdit.value.id);
    sendData.append('short_code',this.formRecodEdit.value.short_code);
    sendData.append('code',this.formRecodEdit.value.code);
    sendData.append('logo',this.formRecodEdit.value.logo);
    sendData.append('signature',this.formRecodEdit.value.signature);
    sendData.append('proposal_prefix',this.formRecodEdit.value.proposal_prefix);
    sendData.append('name',this.formRecodEdit.value.name);
    sendData.append('address',this.formRecodEdit.value.address);
    sendData.append('sector',this.formRecodEdit.value.sector);
    sendData.append('support_email',this.formRecodEdit.value.support_email);
    sendData.append('mobile',this.formRecodEdit.value.mobile);
    sendData.append('landline',this.formRecodEdit.value.landline);
    sendData.append('tollfree',this.formRecodEdit.value.tollfree);
    sendData.append('website_url',this.formRecodEdit.value.website_url);
    sendData.append('inspection_done_by',this.formRecodEdit.value.inspection_done_by);
    sendData.append('broker_code',this.formRecodEdit.value.broker_code);
    sendData.append('bank_branch',this.formRecodEdit.value.bank_branch);
    sendData.append('bank_acc_no',this.formRecodEdit.value.bank_acc_no);
    sendData.append('bank_name',this.formRecodEdit.value.bank_name);
    sendData.append('client_code',this.formRecodEdit.value.client_code);
    sendData.append('uin_no',this.formRecodEdit.value.uin_no);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('logo_img',this.formRecodEdit.value.logo_img);
    sendData.append('signature_img',this.formRecodEdit.value.signature_img);
    sendData.append('userid',this.loginUserId);
    sendData.append('is_breakin_waiver',this.formRecodEdit.value.is_breakin_waiver);
    sendData.append('breakin_waiver_days',this.formRecodEdit.value.breakin_waiver_days);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.icUpdate(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable();
        this.closePopupSuccess();
        this.closeAddExpenseModal.nativeElement.click();
        // this.successNotify(this.editResult.message);
        this.msgClass = "alert-success";
        this.responseMsg = this.editResult.message;
        Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });

      }else{
       this.closePopupFailed();
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
          Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
      }
    });
  }



  uploadLogo(event){

      var file :any = event.target.files[0];
      var file_type:any = file.type;
      var file_size :any = file.size ;
      console.log("file  " +file_size);
      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.selected_logo = "";

      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.selected_logo = "";
      }else{
        //this.selected_logo = file;
        this.formRecodEdit.patchValue({
          'logo' : file
        });
      }


    }
    // selected_signature : any;
    uploadSignature(event){
      var file :any  = event.target.files[0];
      var file_type:any = file.type;
      var file_size :any = file.size ;

      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.selected_signature = "";

      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.selected_signature = "";
      }else{
        //this.selected_signature = file;
        this.formRecodEdit.patchValue({
          'signature' : file
        });
      }

    }


  downloadExcel(url){
    window.open(url, '_blank');
  }

  allDataDownloadExcel(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.loaderActive = true;
    this.commonService.downloadModelData(sendData)
    .subscribe(response =>{
      this.downloadurl = response;
      this.loaderActive = false;
      this.downloadExcel(this.downloadurl.download_url);

    });

  }


  downloadSampleExcel(){
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    this.loaderActive = true;
    this.commonService.downloadModelSampleExcel(sendData)
    .subscribe(response =>{
      this.downloadurl = response;
      this.loaderActive = false;
      this.downloadExcel(this.downloadurl.download_url);

    });
  }

  uploadExcel(){

    const sendData = new FormData();
    sendData.append('loginUserId', this.loginUserId);
    sendData.append('fileUpload', this.fileUpload);
    this.loaderActive = true;
    this.commonService.uploadExcelModelData(sendData)
    .subscribe(response =>{
      var uploadResult :any = response;
      this.loaderActive = false;
      if(uploadResult.status){
        this.runTable();
        this.closePopup();
        Swal.fire(uploadResult.message, '', "success");
        this.fileUpload = "";
      }else{
        Swal.fire (uploadResult.message,  "" ,  "error" );
      }
    });
  }

  getExcelFile(files: FileList) {
    this.fileUpload = files.item(0);
  }

  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('ic_status',status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
  })
  .then((willDelete) => {
    if (willDelete.value) {
      this.loaderActive = true;
      this.commonService.changeStatusByIcId(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.editResult = response;
        this.runTable();
        if(this.editResult.status){
          Swal.fire(this.editResult.message, '', "success");
        }else{
          Swal.fire (this.editResult.message,  "" ,  "error" );
        }

    });
    }
  });

  }

  isBreakInWaiver(val){

      if(val == 'Yes'){
          this.displayBreakInWaiverDays = 'block';
          this.displayInspectionDOneBy = 'none';
          this.formRecodEdit.get("breakin_waiver_days").setValidators([Validators.required,Validators.pattern("^[1-9]$")]);
          this.formRecodEdit.get("breakin_waiver_days").updateValueAndValidity();

      }
      else if(val == 'No')
      {
        this.displayBreakInWaiverDays = 'none';
        this.displayInspectionDOneBy = 'block';
      }
    }


}
