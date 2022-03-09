import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 
  loginUserId : any;
  editResult : any;
  is_corporate : any = 0;
  is_checked : any;

  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData: any;
  businesspartnerData: any;
  posData: any;
  userTypeData: any;
  salutationData: any;
  maritalData: any;
  cityData: any;
  stateData: any;
  pincodeData: any;
  languageData: any;
  submitted : boolean = false;   
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  maxDate : any;
  minDate : any;
  responseMsg : any;
  msgClass: any;
  stateid : any;

  selectedBusiness_partner : any;
  selectedPos_master : any;
  selectedUser_type : any;
  selectedSalutation : any;
  selectedGender : any;
  selectedMarital_status : any;
  selectedState : any;
  selectedCity : any;
  selectedPincode : any;
  selectedLanguage : any;
  selectedStatus : any;

  date_picker_owner_dob: NgbDateStruct;
  access_permission : any;
  constructor(private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }
  
  ngOnInit(): void {

    this.formRecodEdit = this.formBuilder.group({
        id :[''],
        business_partner_id : ['',Validators.required],
        pos_master_id : ['',Validators.required],
        user_type_id :['',Validators.required],
        salutation : ['',Validators.required],       
        first_name : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]], 
        middle_name : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],       
        last_name : ['',[Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
        gender : ['',Validators.required],
        dob : ['',Validators.required],
        email : ['',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        mobile_no : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],       
        alternate_no : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        password : [''],
        is_corporate : [''],
        company_name : ['',Validators.required],
        company_domain : [''],
        pan_card_no : ['',[Validators.required,Validators.pattern('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}')]],
        aadhar_card_no : ['',[Validators.required,Validators.pattern("^[0-9]{12}$")]],
        gstn : ['',[Validators.required,Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
        marital_status : ['',Validators.required],
        address_1 : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9_ ]*$')]],
        address_2 : ['',Validators.pattern('^[a-zA-Z0-9_ ]*$')],
        address_3 : ['',Validators.pattern('^[a-zA-Z0-9_ ]*$')],
        city_id : ['',Validators.required],
        state_id : ['',Validators.required],
        pincode_id : ['',Validators.required], 
        language_id : ['',Validators.required],                 
        status : ['',Validators.required]  
        
      });

    this.getIndex();
    this.getBusinessPartnerData();
    this.getPosData();
    this.getUserTypeData();
    this.getStateData();
    // this.getCityData();
    this.getLanguageData();
    // this.getPinCodeData();
    this.getMaritalData();
    this.getSalutationData();
    this.getStatusData();
    this.loginUserId = sessionStorage.getItem("adminUserId");
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

          case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
          break;

          case 'business_partner':
          this.formRecodEdit.patchValue({business_partner : selected_value });
          break;

          case 'pos_master':
          this.formRecodEdit.patchValue({pos_master : selected_value });
          break;
          
          case 'user_type':
          this.formRecodEdit.patchValue({user_type : selected_value });
          break;

          case 'salutation':
          this.formRecodEdit.patchValue({salutation : selected_value });
          break;

          case 'gender':
          this.formRecodEdit.patchValue({gender : selected_value });
          break;
          
          case 'marital_status':
          this.formRecodEdit.patchValue({marital_status : selected_value });
          break;

          case 'state':
          this.formRecodEdit.patchValue({state : selected_value });
          break;

          case 'city':
          this.formRecodEdit.patchValue({city : selected_value });
          break;
          
          case 'pincode':
          this.formRecodEdit.patchValue({pincode : selected_value });
          break;

          case 'language':
          this.formRecodEdit.patchValue({language : selected_value });
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

        case 'business_partner':
        this.formRecodEdit.patchValue({business_partner : '' });
        this.selectedBusiness_partner = "";
        break;
        
        case 'pos_master':
        this.formRecodEdit.patchValue({pos_master : '' });
        this.selectedPos_master = "";
        break;
        
      case 'user_type':
        this.formRecodEdit.patchValue({user_type : '' });
        this.selectedUser_type = "";
        break;

        case 'salutation':
        this.formRecodEdit.patchValue({salutation : '' });
        this.selectedSalutation = "";
        break;
        
        case 'gender':
        this.formRecodEdit.patchValue({gender : '' });
        this.selectedGender = "";
        break;
        
      case 'marital_status':
        this.formRecodEdit.patchValue({marital_status : '' });
        this.selectedMarital_status = "";
        break;

        case 'state':
        this.formRecodEdit.patchValue({state : '' });
        this.selectedState = "";
        break;
        
        case 'city':
        this.formRecodEdit.patchValue({city : '' });
        this.selectedCity = "";
        break;
        
        case 'pincode':
        this.formRecodEdit.patchValue({pincode : '' });
        this.selectedPincode = "";
        break;
        
        case 'language':
        this.formRecodEdit.patchValue({inspection_done_by : '' });
        this.selectedLanguage = "";
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
              url : this.base_url+'admin/getuserlist',
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
            // {   
            //   'title' : 'Business Partner',
            //   'data' : 'business_partner' 
            // },
            {   
              'title' : 'Dp Name',
              'data' : 'posfullname'  
            },              
            {  
              'title' : 'User Type',
              'data' : 'usertypename'
            },  
            {  
              'title' : 'Fullname',
              'data' : 'full_name'
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
              'title' : 'Gender',
              'data' : 'gender'
            },            
            {  
              'title' : 'Pan',
              'data' : 'pan_card_no'
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
            "targets": 9,
            "orderable": false
            },
            // {
            //   "targets": 1,
            //   "orderable": false
            //   } 
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
        if (event.target.hasAttribute("view-misp-privilege")) {
          this.redirectPrivilege(event.target.getAttribute("view-misp-privilege"));
        }
    });     
  }

  redirectPrivilege(url){
    //alert('innn');
    this.router.navigate([url]);
  }

     

  resetForm(){
      this.submitted = false;

      this.selectedBusiness_partner ="";
      this.selectedPos_master ="";
      this.selectedUser_type ="";
      this.selectedSalutation ="";
      this.selectedGender ="";
      this.selectedMarital_status ="";
      this.selectedState ="";
      this.selectedCity ="";
      this.selectedPincode ="";
      this.selectedLanguage ="";
      this.selectedStatus ="";

      this.formRecodEdit.patchValue({    
        id : 0,
        business_partner_id : '',
        pos_master_id : '',
        user_type_id : '',
        salutation : '',
        first_name : '',
        middle_name : '',
        last_name : '',
        gender : '',
        dob : '',
        email : '',
        mobile_no : '',
        alternate_no : '',
        password : '',
        is_corporate : '',
        company_name : '',
        company_domain : '',
        pan_card_no : '',
        aadhar_card_no : '',
        gstn : '',
        marital_status : '',        
        address_1 : '',
        address_2 : '',
        address_3 : '',
        city_id : '',
        state_id : '',
        pincode_id : '',
        language_id : '',
        status : '',
        
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
    this.commonService.getUserDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.getCityDataByStateId(this.editResult.result.state_id);
      this.setFormData(this.editResult);
      
    });
  }

  getBusinessPartnerData(){
      this.commonService.getBusinessPartnerData()
        .subscribe( response => {
          this.businesspartnerData = response;
          this.businesspartnerData = this.businesspartnerData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

   getPosData(){
      this.commonService.getPosData()
        .subscribe( response => {
          this.posData = response;
          this.posData = this.posData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

   getUserTypeData(){
      this.commonService.getUserTypeData()
        .subscribe( response => {
          this.userTypeData = response;
          this.userTypeData = this.userTypeData.result;         
          //this.setFormData(this.state_data);
          
        });

    }
     getStateData(){
      this.commonService.getStateData()
        .subscribe( response => {
          this.stateData = response;
          this.stateData = this.stateData.result;         
          //this.setFormData(this.state_data);
         
        });

    }
    // getCityData(){
    //   this.commonService.getCityData()
    //     .subscribe( response => {
    //       this.cityData = response;
    //       this.cityData = this.cityData.result;         
    //       //this.setFormData(this.state_data);
          
    //     });

    // }
    getLanguageData(){
      this.commonService.getLanguageData()
        .subscribe( response => {
          this.languageData = response;
          this.languageData = this.languageData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

    // getPinCodeData(){
    //   this.commonService.getPinCodeData()
    //     .subscribe( response => {
    //       this.pincodeData = response;
    //       this.pincodeData = this.pincodeData.result;         
    //       //this.setFormData(this.state_data);
          
    //     });

    // }

     getPincodeDataByCity(cityid){     
       this.loaderActive = true;
       var sendData = new FormData();
       sendData.append('cityid',cityid);

      this.commonService.getPincodeDataByCityId(sendData)
        .subscribe( response => {
          this.pincodeData = response;
          this.pincodeData = this.pincodeData.result;
          this.loaderActive = false;         
          //this.setFormData(this.state_data);          
        });

    }

    getMaritalData(){
      this.commonService.getMaritalData()
        .subscribe( response => {
          this.maritalData = response;
          this.maritalData = this.maritalData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

    getSalutationData(){
      this.commonService.getSalutationData()
        .subscribe( response => {
          this.salutationData = response;
          this.salutationData = this.salutationData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

    getStatusData(){
      this.commonService.getStatusData()
        .subscribe( response => {
          this.statusData = response;
          this.statusData = this.statusData.result;         
          //this.setFormData(this.state_data);
          
        });

    }

    getCityDataByStateId(stateid){
      this.loaderActive = true;
       var sendData = new FormData();
       sendData.append('stateid',stateid);
      this.commonService.getCityPinDataByStateId(sendData)
        .subscribe( response => {
          this.cityData = response;
          if(this.cityData.status){

            this.cityData = this.cityData.result;         
            //this.setFormData(this.state_data);
            this.loaderActive = false;

          }else{

            this.cityData = [];           
            this.loaderActive = false;
            this.pincodeData = [];


          }
         
          
        });

    }

  

  setFormData(result){

    this.selectedBusiness_partner = result.result.business_partner_id;
    this.selectedPos_master = result.result.pos_master_id;
    this.selectedUser_type = result.result.user_type_id;
    this.selectedSalutation = result.result.salutation;
    this.selectedGender = result.result.gender;
    this.selectedMarital_status = result.result.marital_status;
    this.selectedState = result.result.state_id;
    this.selectedCity = result.result.city_id;
    this.selectedPincode = result.result.pincode_id;
    this.selectedLanguage = result.result.language_id;
    this.selectedStatus = result.result.status_id;

    this.formRecodEdit.patchValue({              
      id : result.result.user_master_id,
      business_partner_id : result.result.business_partner_id,
      pos_master_id : result.result.pos_master_id,
      user_type_id : result.result.user_type_id,
      salutation : result.result.salutation,
      first_name : result.result.first_name,
      middle_name : result.result.middle_name,
      last_name : result.result.last_name,
      gender : result.result.gender,
      dob : result.result.dob,
      email : result.result.email,
      mobile_no : result.result.mobile_no,
      alternate_no : result.result.alternate_no,      
      is_corporate : result.result.is_corporate,
      company_name : result.result.company_name,
      company_domain : result.result.company_domain,
      pan_card_no : result.result.pan_card_no,
      aadhar_card_no : result.result.aadhar_card_no,
      gstn : result.result.gstin,
      marital_status : result.result.marital_status,
      address_1 : result.result.address_1,
      address_2 : result.result.address_2,
      address_3 : result.result.address_3,
      city_id : result.result.city_id,
      state_id : result.result.state_id,
      pincode_id : result.result.pincode_id,
      language_id : result.result.language_id,
      status : result.result.status_id,
    });
          
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Model Details";
    this.display='block'; 
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add User Details";
    this.display='none'; 
    this.showCreateBtn = true;
    // this.getDataById(id);

  }

    
  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update User Details";
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
    sendData.append('business_partner_id',this.formRecodEdit.value.business_partner_id);
    sendData.append('pos_master_id',this.formRecodEdit.value.pos_master_id);
    sendData.append('user_type_id',this.formRecodEdit.value.user_type_id);
    sendData.append('salutation',this.formRecodEdit.value.salutation);
    sendData.append('first_name',this.formRecodEdit.value.first_name);
    sendData.append('middle_name',this.formRecodEdit.value.middle_name);
    sendData.append('last_name',this.formRecodEdit.value.last_name);
    sendData.append('gender',this.formRecodEdit.value.gender);
    sendData.append('dob',this.formRecodEdit.value.dob);
    sendData.append('email',this.formRecodEdit.value.email);
    sendData.append('mobile_no',this.formRecodEdit.value.mobile_no);
    sendData.append('alternate_no',this.formRecodEdit.value.alternate_no);
    sendData.append('password',this.formRecodEdit.value.password);
    sendData.append('is_corporate',this.is_corporate);
    sendData.append('company_name',this.formRecodEdit.value.company_name);
    sendData.append('company_domain',this.formRecodEdit.value.company_domain);
    sendData.append('pan_card_no',this.formRecodEdit.value.pan_card_no);
    sendData.append('aadhar_card_no',this.formRecodEdit.value.aadhar_card_no);
    sendData.append('gstn',this.formRecodEdit.value.gstn);
    sendData.append('marital_status',this.formRecodEdit.value.marital_status);
    sendData.append('address_1',this.formRecodEdit.value.address_1);
    sendData.append('address_2',this.formRecodEdit.value.address_2);
    sendData.append('address_3',this.formRecodEdit.value.address_3);    
    sendData.append('city_id',this.formRecodEdit.value.city_id);
    sendData.append('state_id',this.formRecodEdit.value.state_id);
    sendData.append('pincode_id',this.formRecodEdit.value.pincode_id);
    sendData.append('language_id',this.formRecodEdit.value.language_id);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('loginUserId',this.loginUserId);
    
    this.commonService.userUpdate(sendData)
    .subscribe(response =>{
              
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
        this.runTable(); 
        this.closePopupSuccess();
        this.closeAddExpenseModal.nativeElement.click();
        this.successNotify(this.editResult.message); 
        this.msgClass = "alert-success";
       this.responseMsg = this.editResult.message;  
      }else{
       this.closePopupFailed();
       this.msgClass = "alert-danger";       
       this.responseMsg = this.editResult.message;
      }
      
    });
  }

    isCorporate(event){

      this.is_checked = event.target.checked;

      if(this.is_checked){

          this.is_corporate = 1;
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
    sendData.append('user_status',status);
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
      this.commonService.changeStatusByUserId(sendData)
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
