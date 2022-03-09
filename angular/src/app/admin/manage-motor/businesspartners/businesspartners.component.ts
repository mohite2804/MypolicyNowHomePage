import { Component, OnInit,Renderer2, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-businesspartners',
  templateUrl: './businesspartners.component.html',
  styleUrls: ['./businesspartners.component.css']
})
export class BusinesspartnersComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 
  loginUserId : any;
  editResult : any;
  formRecodEdit: FormGroup;
  formMispExport : FormGroup;
  //formRecodEdit : any; 
  is_theme : any = 0;
  is_checked : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  hierarchylevelsData : any;
  logo_image : any;
  css_file_name : any;
  pancard_doc : any;
  gst_doc : any;
  businesspartnerData : any;
  submitted : boolean = false;   
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  
  date_picker_from_date: NgbDateStruct;
  date_picker_to_date: NgbDateStruct;
  atLeastOneRequired : any;
  date_from : any;
  date_to : any;
  dtRendered = true;
  businessPartnersExcel : any;
  access_permission : any;
  accessdisplay : any = "block";
  accessdisplayinline="inline-block";
  
  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder,public cdr: ChangeDetectorRef, private excelService:ExcelService) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {
    this.formRecodEdit = this.formBuilder.group({        
       id :[''],
       business_partner : ['',Validators.required],
       hierarchy_levels : ['',Validators.required],
       name : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
       partner_code : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9\-]*$')]],
       logo_image : [''],
       address : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
       email : ['',[Validators.required,Validators.minLength(5), Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
       mobile_no : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[1-9]{1}[0-9]{9}$')]],
       alternate_mobile_no : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[1-9]{1}[0-9]{9}$')]],
       pancard_no : ['',[Validators.required,Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$')]],
       pancard_doc : ['',Validators.required],
       gst_no : ['',[Validators.required,Validators.pattern('^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$')]],
       gst_doc : ['',Validators.required],
       tan_no : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9 \'\-]+$')]],
       contact_person_name : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
       contact_person_mobile : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[1-9]{1}[0-9]{9}$')]],
       contact_person_email : ['',[Validators.required,Validators.minLength(1), Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
       css_file_name : [''],
       status : ['',Validators.required],
       logo_img : [''],
       pancard_img : [''],
       gst_img : ['']
      }, {validator: [this.panNotMatchWithGST,this.MatchMobile,this.alternatemobileno,this.CPmobileno]});
    this.getIndex();
    this.getBusinessTieUpPartnerData();
    this.getStatusData();
    this.gethierarchylevelSelectData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
       this.formMispExport = this.formBuilder.group({
          from_date : [''],
          to_date : [''],            
        });
  }
  MatchMobile(group: FormGroup){
    let mobile_no : any = group.get('mobile_no').value;
    let length_mobile_no : any = mobile_no.length;
    if(length_mobile_no==10){
      if(mobile_no=='9000000000'){
        return { MatchMobileError: true } ;
      }else{
        return null ;
      }
    }
  }
  alternatemobileno(group: FormGroup){
    let mobile_no : any = group.get('alternate_mobile_no').value;
    let length_mobile_no : any = mobile_no.length;
    if(length_mobile_no==10){
      if(mobile_no=='9000000000'){
        return { aMatchMobileError: true } ;
      }else{
        return null ;
      }
    }
  }
  CPmobileno(group: FormGroup){
    let mobile_no : any = group.get('contact_person_name').value;
    let length_mobile_no : any = mobile_no.length;
    if(length_mobile_no==10){
      if(mobile_no=='9000000000'){
        return { cpMatchMobileError: true } ;
      }else{
        return null ;
      }
    }
  }

  panNotMatchWithGST(group: FormGroup){
    let gst_no : any = group.get('gst_no').value;
    gst_no = gst_no.toLowerCase();
    let length_gst : any = gst_no.length;
    let pan_no : any = group.get('pancard_no').value;
    pan_no = pan_no.toLowerCase();
    let length_pan_no : any = pan_no.length;

    if(length_gst > 14 && length_pan_no > 1){
      let is_valid_gst_no =  gst_no.includes(pan_no)
      if(!is_valid_gst_no){
        return { panNotMatchGST: true } ;
      }else{
        return null ;
      }
    }
  }
  submitDateFilterForm(){
    this.submitted = true;
        console.log(this.formMispExport.value.engine_no);
        if(this.formMispExport.invalid){
            console.log('error');
            return false;
        }
        else{
            if((this.formMispExport.value.from_date != '' && this.formMispExport.value.from_date != null && this.formMispExport.value.from_date != undefined) || (this.formMispExport.value.to_date != '' && this.formMispExport.value.to_date != null && this.formMispExport.value.to_date != undefined))
            {
                this.atLeastOneRequired = '';
                
                this.date_from = this.formMispExport.value.from_date;
                this.date_to = this.formMispExport.value.to_date;
               
                const that = this;
                this.cdr.detectChanges();
                this.dtRendered = true
                this.cdr.detectChanges();
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.columns(1).search(JSON.stringify(this.date_from));
                    dtInstance.columns(2).search(JSON.stringify(this.date_to));
                    dtInstance.draw();
                });
                this.submitted =false;
            } 
            else {
                Swal.fire({position: 'center',icon: 'error',title: 'At least one field required', showConfirmButton: false, timer: 3000 });
                // this.atLeastOneRequired = 'At least one field required';
                return false;
            }
        }
  }

  resetDateFilterForm(){
    this.date_from = '';
    this.date_to = '';
    
    this.submitted = false;
   
    this.formMispExport.reset();

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search('');
        dtInstance.columns(2).search('');        
        dtInstance.draw();
    });    
  }

  exportAsXLSX(){
        const sendData = new FormData();
        sendData.append('loginUserId',this.loginUserId);
        sendData.append('date_from',JSON.stringify(this.formMispExport.value.from_date));
        sendData.append('date_to',JSON.stringify(this.formMispExport.value.to_date));
        this.commonService.getbusinessPartnersExcelExport(sendData)
        .subscribe( response => {
            this.businessPartnersExcel = response;
            if(this.businessPartnersExcel.status)
            {
              this.excelService.exportAsExcelFile(this.businessPartnersExcel.result, 'Bussiness_Partners_List');
              Swal.fire(this.businessPartnersExcel.message, '', "success");
           
            }else{
                 Swal.fire(this.businessPartnersExcel.message, '', "error");
            }
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
              url : this.base_url+'admin/getbusinesspartnerlist',
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
              'title' : 'Partner Type',
              'data' : 'partner' 
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
              'title' : 'Email',
              'data' : 'email'
            },
            {  
              'title' : 'Mobile',
              'data' : 'mobile_no'
            },
            {  
              'title' : 'Contact Person Name',
              'data' : 'contact_person_name'
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
          "columnDefs": [ {
            "targets": [0,8],
            "orderable": false
            },
            // {
            //   "targets": 1,
            //   "orderable": false
            //   } 
            ],	order: [[ 1, "desc" ]],
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
    });     
  }
  resetForm(){
    this.accessdisplay="block";
    this.accessdisplayinline="inline-block";
    this.formRecodEdit.get("pancard_doc").setValidators([Validators.required]);
    this.formRecodEdit.get("pancard_doc").updateValueAndValidity();
    this.formRecodEdit.get("gst_doc").setValidators([Validators.required]);
    this.formRecodEdit.get("gst_doc").updateValueAndValidity();
    this.formRecodEdit.get("partner_code").setValidators([Validators.required,Validators.pattern('^[a-zA-Z0-9\-]*$')]);
    this.formRecodEdit.get("partner_code").updateValueAndValidity();

      this.submitted = false;
      this.formRecodEdit.patchValue({

        id : 0,
        business_partner : '',
        hierarchy_levels : '',
        name : '',
        partner_code : '',
        logo_image : '',
        address : '',
        email : '',
        mobile_no : '',
        alternate_mobile_no : '',
        pancard_no : '',
        pancard_doc : '',
        gst_no : '',
        gst_doc : '',
        tan_no : '',
        contact_person_name : '',
        contact_person_mobile : '',
        contact_person_email : '',
        is_theme : '',
        header_html : '',
        footer_html : '',
        dashboard_html : '',
        logout_url : '',
        redirect_landing_page : '',
        css_file_name : '',
        pancard_img : '',
        gst_img : '',
        status : ''
      });

  }

  closePopup(){

    this.display='block'; 
    this.resetForm();
    this.loaderActive = false;
  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getBusinessPartnerDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      //this.editResult = this.editResult;
      // console.log(this.editResult);
      if(this.editResult.result.logo_image==''){
          this.logo_image= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.logo_image = this.editResult.APP_URL+this.editResult.result.logo_image;
      }
      if(this.editResult.result.css_file_name=='0'){
          this.css_file_name= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.css_file_name = this.editResult.APP_URL+this.editResult.result.css_file_name;
      }

      if(this.editResult.result.gst_doc=='0'){
          this.gst_doc= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.gst_doc= this.editResult.base_url+"/uploads/business_partners/gst_doc/"+this.editResult.result.gst_doc;
      }

      if(this.editResult.result.pancard_doc=='0'){
          this.pancard_doc= this.editResult.base_url+"/uploads/no_image.jpg";
      }else{
         this.pancard_doc = this.editResult.base_url+"/uploads/business_partners/pancard_doc/"+this.editResult.result.pancard_doc;
      }   
      // console.log(this.logo_image);      
      this.setFormData(this.editResult);
      
    });
  }

  getStatusData(){
      this.commonService.getStatusData()
        .subscribe( response => {
          this.statusData = response;
          this.statusData = this.statusData.result;         
          //this.setFormData(this.state_data);
          console.log(this.statusData);
        });

    }

    getBusinessTieUpPartnerData(){
      this.commonService.getBusinessTieupPartnerData()
        .subscribe( response => {
          this.businesspartnerData = response;
          this.businesspartnerData = this.businesspartnerData.result;         
          //this.setFormData(this.state_data);
          console.log(this.businesspartnerData);
        });

    }
    
    gethierarchylevelSelectData(){
      this.commonService.  getHierarchyLevelsData()
        .subscribe( response => {
          this.hierarchylevelsData = response;
          this.hierarchylevelsData = this.hierarchylevelsData.result;         
          //this.setFormData(this.state_data);
          // console.log('this is vinit');
          console.log(this.hierarchylevelsData);
        });

    }

  setFormData(result){ 
    this.accessdisplay="none";
    this.accessdisplayinline="none";
    this.formRecodEdit.get("pancard_doc").setValidators([]);
    this.formRecodEdit.get("pancard_doc").updateValueAndValidity();
    this.formRecodEdit.get("gst_doc").setValidators([]);
    this.formRecodEdit.get("gst_doc").updateValueAndValidity();
    this.formRecodEdit.get("partner_code").setValidators([]);
    this.formRecodEdit.get("partner_code").updateValueAndValidity();

    console.log(result.result); 
    this.loaderActive = true;
    setTimeout(() => {
      this.formRecodEdit.patchValue({  
        id : result.result.business_partner_master_id,
        business_partner : result.result.business_tieup_type_id,
        hierarchy_levels : result.result.hierarchy_levels,
        name : result.result.name,
        partner_code : result.result.partner_code,       
        address : result.result.address,
        email : result.result.email,
        mobile_no : result.result. mobile_no,
        alternate_mobile_no : result.result.alternate_mobile_no,
        pancard_no : result.result.pancard_no,      
        gst_no : result.result.gst_no,       
        tan_no : result.result.tan_no,
        contact_person_name : result.result.contact_person_name,
        contact_person_mobile : result.result.contact_person_mobile,
        contact_person_email : result.result.contact_person_email,
        is_theme : result.result.is_theme,
        header_html : result.result.header_html,
        footer_html : result.result.footer_html,
        dashboard_html : result.result.dashboard_html,
        logout_url : result.result.logout_url,
        redirect_landing_page : result.result.redirect_landing_page, 
        css_file_name : result.result.css_file_name,    
        status : result.result.status_id,     
        logo_img : result.result.logo_image,
        pancard_img : result.result.pancard_doc,
        gst_img : result.result.gst_doc,
      });
      this.loaderActive = false;
    }, 4000);    
          
  }



  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Business Partner Details";
    this.display='block'; 
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Business Partner Details";
    this.display='none'; 
    this.showCreateBtn = true;
    this.css_file_name = '';
    this.logo_image = '';
    this.gst_doc= '';
    this.pancard_doc ='';
    // this.getDataById(id);

  }

    
  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Business Partner Details";
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
    sendData.append('business_partner',this.formRecodEdit.value.business_partner);
    sendData.append('hierarchy_levels',this.formRecodEdit.value.hierarchy_levels);
    sendData.append('name',this.formRecodEdit.value.name);
    sendData.append('partner_code',this.formRecodEdit.value.partner_code);
    sendData.append('logo_image',this.formRecodEdit.value.logo_image);
    sendData.append('address',this.formRecodEdit.value.address);
    sendData.append('email',this.formRecodEdit.value.email);
    sendData.append('mobile_no',this.formRecodEdit.value.mobile_no);
    sendData.append('alternate_mobile_no',this.formRecodEdit.value.alternate_mobile_no);
    sendData.append('pancard_no',this.formRecodEdit.value.pancard_no);
    sendData.append('pancard_doc',this.formRecodEdit.value.pancard_doc);
    sendData.append('gst_no',this.formRecodEdit.value.gst_no);
    sendData.append('gst_doc',this.formRecodEdit.value.gst_doc);
    sendData.append('tan_no',this.formRecodEdit.value.tan_no);
    sendData.append('contact_person_name',this.formRecodEdit.value.contact_person_name);
    sendData.append('contact_person_mobile',this.formRecodEdit.value.contact_person_mobile);
    sendData.append('contact_person_email',this.formRecodEdit.value.contact_person_email);
    sendData.append('css_file_name',this.formRecodEdit.value.css_file_name);
    sendData.append('logo_img',this.formRecodEdit.value.logo_img);
    sendData.append('pancard_img',this.formRecodEdit.value.pancard_img);
    sendData.append('gst_img',this.formRecodEdit.value.gst_img);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);
    
    this.commonService.businesspartnerUpdate(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      this.editResult = response;      
      
      if(this.editResult.status){
        Swal.fire({position: 'center',icon: 'success',title: this.editResult.message});
        this.closePopup();
        this.runTable();        
        //  this.msgClass = "alert-success";       
        //  this.responseMsg = this.editResult.message;  
        //  this.closePopup();
      }else{
        this.closePopup();
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message;
        Swal.fire({position: 'center',icon: 'error',title: this.editResult.message});
      }
    });
  }

     uploadPanDoc(event){
      let file = event.target.files[0];   
      var file_type:any = file.type;
      var file_size :any = file.size ;
      
      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
        Swal.fire ("Please Select 'pdf', 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.pancard_doc = "";

      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.pancard_doc = "";
      }else{   
        this.formRecodEdit.patchValue({
          'pancard_doc' : file
        });           
      }
    }
 
    uploadGSTDoc(event){
      let file = event.target.files[0];    
      
      
      var file_type:any = file.type;
      var file_size :any = file.size ;
      
      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
        Swal.fire ("Please Select 'pdf', 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.gst_doc = "";

      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.gst_doc = "";
      }else{   
        this.formRecodEdit.patchValue({
          'gst_doc' : file
        });           
      }
               
    }

    uploadLogo(event){
      let file = event.target.files[0];
      
      var file_type:any = file.type;
      var file_size :any = file.size ;
      
      if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.logo_image = "";
      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.logo_image = "";
      }else{   
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
            this.logo_image = event.target.result;
        }
        this.formRecodEdit.patchValue({
          'logo_image' : file
        });          
      }  
    }

    uploadCSS(event){
      let file = event.target.files[0];  
      
      var file_type:any = file.type;
      var file_size :any = file.size ;
      
      if(file_type.toLowerCase() != 'text/css'){
        Swal.fire ("Please Select 'jpg', 'png', 'jpeg' file",  "" ,  "error" );
        this.css_file_name = "";

      }else if(file_size > 5242880){
        Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
        this.css_file_name = "";
      }else{   
        this.formRecodEdit.patchValue({
          'css_file_name' : file
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
      sendData.append('business_partner_status',status);
      sendData.append('userid',this.loginUserId);
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
    })
    .then((willDelete) => {
      if (willDelete.value) {
        this.commonService.changeStatusByBusinessPartnerId(sendData)
        .subscribe( response => { 
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
}