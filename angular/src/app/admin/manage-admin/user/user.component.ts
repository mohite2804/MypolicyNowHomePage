import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';  //newly added
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  base_url = environment.baseUrl;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;  //newly added

  loginUserId : any;
  loginUserRoleId : any;
  loginUserTypeId : any;
  loginUserName : any;
  adminMenuIds : any;

  businessDataSelection : any;
  icDataSelection : any;
  businessLevelDataSelection : any;


  editResult : any;
  formRecodEdit : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;

  typeDataSelection : any;
  statusData : any;
  roleData : any;
  parentData : any;

  responseMsg : any;
  msgClass: any;
  msg_display : any;
  inNewEntery : boolean = true;
  PasswordInfo : boolean = true;
  showBusLevels : any = 'none';

  showSubBusLevels : any = 'none';
  zoneData : any;
  regionData : any;
  stateData : any;
  levelsData : any;
  subLevelData : any;
  password : any;
  
  // businessDataSelectionId : any;

  
  divBusinessNameMaster : boolean = false;
  divBusinessLavelMaster : boolean = false;
  divParentUserMaster : boolean = false;
  divicNameMaster : boolean = false;
  access_permission : any;

  selectedUserTypeData: any = [];
  selectedBusinessData: any = [];

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router,
    private commonService : CommonService,
    private formBuilder: FormBuilder) {
      this.loginUserId = sessionStorage.getItem("adminUserId");
      this.access_permission = sessionStorage.getItem("access_permission");
    }

  ngOnInit(): void {

    
    this.divBusinessNameMaster = false;
    this.divBusinessLavelMaster = false;
    this.divParentUserMaster = false;
    this.divicNameMaster = false;

    
    this.inNewEntery = true;
    this.PasswordInfo = false;
    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      prev_status_id :[''],
      user_type : ['',[Validators.required]],
      business_partner_master_id : [''],
      business_id : [''],
      ic_master_id : [''],
      level_id : [''],
      parent_user_id : [''],
      department_id : [''],
      password : ['',[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      user_role : ['',[Validators.required]],
      first_name : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      middle_name : ['',[Validators.minLength(1), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
      last_name : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25),Validators.pattern('^[a-zA-Z ]*$')]],
      email : ['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      mobileNo : ['',[Validators.maxLength(10), Validators.pattern('^[6-9][0-9]{9}$')]],
      status : ['',Validators.required],
    });

    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");
    this.loginUserName = sessionStorage.getItem("adminUserName");
    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");


    this.getIndex();


    // this.getAdminRoleSelection();
    this.getStatusData();
    this.getAdminUserTypeSelection();
  }

  getAdminRoleSelectionByID(selectedTypeId,levels,zone_id,region_id,state_id,business_id){

    this.loaderActive = true;
   
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    sendData.append('selectedTypeId',selectedTypeId);
    this.commonService.getAdminRoleSelection(sendData)
      .subscribe( response => {
      this.roleData = response;
        if(this.roleData.status){
        this.roleData = this.roleData.result;
      }else{
        this.roleData = [];
        this.subLevelData = [];
        this.loaderActive = false;
      }
    });

    var sendData = new FormData();
    sendData.append('selectedBPId',business_id);
    this.commonService.getbplavelSelection(sendData).subscribe( response => {
      this.businessLevelDataSelection = response;
      if(this.businessLevelDataSelection.result!=''){
        this.businessLevelDataSelection = this.businessLevelDataSelection.result;
        
        this.roleData = response;
        this.roleData = this.roleData.bp_role;

        this.loaderActive = false;
      }else{
        this.loaderActive = false;
      }
    });
  }


  getAdminBusinessDataSelection(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    this.commonService.getAdminUserBusinessDataSelection(sendData)
      .subscribe( response => {
        this.businessDataSelection = response;
        this.businessDataSelection = this.businessDataSelection.result;
        //this.setFormData(this.state_data);
        // console.log(this.statusData);
      });

  }
  getAdminICDataSelection(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    this.commonService.getAdminicDataSelection(sendData)
      .subscribe( response => {
        this.icDataSelection = response;
        this.icDataSelection = this.icDataSelection.result;
        // this.setFormData(this.state_data);
        console.log(this.icDataSelection);
      });

  }

  setBusinessSelection(selectedbusinessid){
    this.loaderActive = true;
    console.log(selectedbusinessid);
    var selected_bp_Id = selectedbusinessid.target.value;
    console.log(selected_bp_Id);
    this.formRecodEdit.patchValue({
      business_id : selected_bp_Id,
    });

    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    sendData.append('selectedBPId',selected_bp_Id);

    if(selected_bp_Id!=''){
      this.commonService.getbplavelSelection(sendData).subscribe( response => {
        this.businessLevelDataSelection = response;
        this.businessLevelDataSelection = this.businessLevelDataSelection.result;

        this.roleData = response;
        this.roleData = this.roleData.bp_role;
        this.loaderActive = false;
      });
    }
    // this.formRecodEdit.controls[''].setValue();

    // this.businessDataSelectionId = selected_bp_Id;
  }


  getAdminParentSelection(selectedLevelType){
    // console.log(this.selectedUserTypeData);
    this.parentData = [];
    this.formRecodEdit.patchValue({ parent_user_id: "" });
    
    this.loaderActive = true;
    var selectedZoneId = selectedLevelType.target.value;
    console.log(selectedZoneId);
    console.log('this.selectedBusinessData');
    console.log(this.selectedBusinessData);
    
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    sendData.append('businessDataSelection',this.selectedBusinessData);
    sendData.append('selectedZoneId',selectedZoneId);
    if(this.selectedUserTypeData==4){
      sendData.append('selected_user_type',this.selectedUserTypeData);
    }
    if(selectedZoneId!=''){
      if(selectedZoneId!=1 && selectedZoneId!=2){
        this.commonService.getAdminParentSelection(sendData).subscribe( response => {
          this.parentData = response;
          this.parentData = this.parentData.result;
          // console.log(this.parentData);
          this.loaderActive = false;
        });
      }else{
        this.parentData = [];
        this.loaderActive = false;
      }
    }else{
      // console.log('1');
      this.parentData = [];
      this.loaderActive = false;
    }
  }
  geticRole(icData){
    this.loaderActive = true;
    var icDataId = icData.target.value;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    sendData.append('icDataId',icDataId);
    this.commonService.geticRoleList(sendData)
        .subscribe( response => {
          this.loaderActive = false;
          this.roleData = response;
          this.roleData = this.roleData.result;
      });

  }

  getAdminRoleSelection(selectedUserType){
    // console.log(selectedUserType);
      this.loaderActive = true;
      this.roleData = [];
      this.businessLevelDataSelection = [];
      this.parentData = [];
      this.businessDataSelection = [];
      
      this.formRecodEdit.patchValue({ parent_user_id: "",business_partner_master_id: "",level_id: "",user_role: ""});

      this.showBusLevels = "none";
      this.showSubBusLevels = "none";

      const selectEl = selectedUserType.target;
      var selectedTypeId = selectedUserType.target.value;
      var isBusLevel  = selectEl.options[selectEl.selectedIndex].getAttribute('data-levels');
      // console.log(selectedTypeId);
      if(selectedTypeId!=''){

        if(selectedTypeId==2){

          this.getAdminBusinessDataSelection();

          this.divBusinessNameMaster = true;
          this.divBusinessLavelMaster = true;
          this.divParentUserMaster = true;
          this.divicNameMaster = false;

          this.formRecodEdit.get("business_partner_master_id").setValidators([Validators.required]);
          this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

          this.formRecodEdit.get("level_id").setValidators([Validators.required]);
          this.formRecodEdit.get("level_id").updateValueAndValidity();

          this.formRecodEdit.get("ic_master_id").setValidators([]);
          this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

        }else if(selectedTypeId==4){
          var sendData = new FormData();
          sendData.append('loginUserId',this.loginUserId);
          sendData.append('loginUserRoleId',this.loginUserRoleId);
          sendData.append('loginUserTypeId',this.loginUserTypeId);
          sendData.append('selected_user_type',selectedTypeId);
          this.commonService.getAdminBusinessLevelDataSelection(sendData)
              .subscribe( response => {
                this.businessLevelDataSelection = response;
                this.businessLevelDataSelection = this.businessLevelDataSelection.result;
            });
            
          this.divBusinessNameMaster = false;
          this.divBusinessLavelMaster = true;
          this.divParentUserMaster = true;
          this.divicNameMaster = false;

          this.formRecodEdit.get("business_partner_master_id").setValidators([]);
          this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

          this.formRecodEdit.get("level_id").setValidators([Validators.required]);
          this.formRecodEdit.get("level_id").updateValueAndValidity();

          this.formRecodEdit.get("ic_master_id").setValidators([]);
          this.formRecodEdit.get("ic_master_id").updateValueAndValidity();
        }else if(selectedTypeId==3){

          
          this.getAdminICDataSelection();
          
          this.formRecodEdit.get("ic_master_id").setValidators([Validators.required]);
          this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

          this.formRecodEdit.get("business_partner_master_id").setValidators([]);
          this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

          this.formRecodEdit.get("level_id").setValidators([]);
          this.formRecodEdit.get("level_id").updateValueAndValidity();

          this.divBusinessNameMaster = false;
          this.divBusinessLavelMaster = false;
          this.divParentUserMaster = false;
          this.divicNameMaster = true;
        }else{
          this.formRecodEdit.get("ic_master_id").setValidators([]);
          this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

          this.formRecodEdit.get("business_partner_master_id").setValidators([]);
          this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

          this.formRecodEdit.get("level_id").setValidators([]);
          this.formRecodEdit.get("level_id").updateValueAndValidity();

          this.divBusinessNameMaster = false;
          this.divBusinessLavelMaster = false;
          this.divParentUserMaster = false;
          this.divicNameMaster = false;
        }
        var sendData = new FormData();
        sendData.append('loginUserId',this.loginUserId);
        sendData.append('loginUserRoleId',this.loginUserRoleId);
        sendData.append('loginUserTypeId',this.loginUserTypeId);
        sendData.append('selectedTypeId',selectedTypeId);
        this.commonService.getAdminRoleSelection(sendData)
          .subscribe( response => {
            this.roleData = response;
            if(this.roleData.status){
              this.roleData = this.roleData.result;
              this.loaderActive = false;
            }
        });
      }else{
        this.loaderActive = false;
      }
  }

  getAdminBusinessLevelDataSelection(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    this.commonService.getAdminBusinessLevelDataSelection(sendData)
        .subscribe( response => {
          this.businessLevelDataSelection = response;
            this.businessLevelDataSelection = this.businessLevelDataSelection.result;
            this.loaderActive = false;
      });
  }

  getStatusData(){
    this.commonService.getStatusData()
      .subscribe( response => {
        this.statusData = response;
        this.statusData = this.statusData.result;
        //this.setFormData(this.state_data);
        // console.log(this.statusData);
      });

  }

  getAdminUserTypeSelection(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    this.commonService.getAdminUserTypeSelection(sendData)
      .subscribe( response => {
        this.typeDataSelection = response;
        this.typeDataSelection = this.typeDataSelection.result;
        //this.setFormData(this.state_data);
        // console.log(this.statusData);
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
              url : this.base_url+'admin/getAdminUsersList',
              type : 'POST',
              data: {
                "loginUserId": this.loginUserId,
                "loginUserRoleId": this.loginUserRoleId,
                "loginUserTypeId": this.loginUserTypeId,
                "adminMenuIds": this.adminMenuIds,

          },
              dataType: "json",
          },

          columns: [
            {
              'title' : 'Sr.No',
              'data' : 'id'
            },
            {
              'title' : 'Name',
              'data' : 'full_name'
            },
            {
              'title' : 'H Level',
              'data' : 'h_level'
            },
            {
              'title' : 'P Name',
              'data' : 'puf_full_name'
            },
            {
              'title' : 'Role',
              'data' : 'role_name'
            },
            {
              'title' : 'User Type',
              'data' : 'user_type'
            },
            {
              'title' : 'Email',
              'data' : 'email'
            },
            {
              'title' : 'Mobile',
              'data' : 'mobile'
            },
            {
              'title' : 'Status',
              'data' : 'status_label'
            },
            {
              'title' : 'Created By',
              'data' : 'created_by_username'
            },
            {
              'title' : 'Created Date',
              'data' : 'created_at'
            },
            {
              'title' : 'Action',
              'data' : 'action_btn'
            }


          ],
          columnDefs: [
            { "orderable": false, "targets": [0,11] }
          ],
          "order": [[ 10, "desc" ]]
      };
  }


  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

        if (event.target.hasAttribute("view-edit-id")) {
          console.log("editee");
          this.editRecord(event.target.getAttribute("view-edit-id"));
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

  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update User Details";
    this.display='none';
    this.PasswordInfo = true;
    this.formRecodEdit.get("password").setValidators([Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,14}')]);
    this.formRecodEdit.get("password").updateValueAndValidity();
    // this.inNewEntery = false;
    // this.formRecodEdit.get("password").disable();
    //this.msg_display = 'none';
    this.getDataById(id);

  }

  resetForm(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      id : 0,
      prev_status_id : '',
      user_type : '',
      business_partner_master_id : '',
      business_id : '',
      ic_master_id : '',
      level_id : '',
      parent_user_id : '',
      department_id : '',
      user_role : '',
      first_name : '',
      middle_name : '',
      last_name : '',
      email : '',
      mobileNo : '',
      password:'',
      status : '',
    });

}

getDataById(id){
  this.loaderActive = true;
  var sendData = new FormData();
  sendData.append('id',id);
  this.commonService.getUserDataById(sendData)
  .subscribe( response => {
    this.loaderActive = false;
    this.editResult = response;
    this.setFormData(this.editResult);

  });
  
  var sendData = new FormData();
  sendData.append('admin_user_id',id);
  if(id!=''){
    this.commonService.getSelectedParentId(sendData).subscribe( response => {
      console.log(response);
      this.parentData = response;
      this.parentData = this.parentData.result;
      // console.log('parentData');
    });
  }else{
    // console.log('1');
    this.parentData = [];
  }

}

setFormData(result){
  console.log(result.result.parent_user_id);
  console.log(result);
  console.log("setFormData");

  this.getAdminRoleSelectionByID(result.result.admin_user_type_id,result.result.levels,result.result.zone_id,result.result.region_id,result.result.state_id,result.result.business_id);

  if(result.result.admin_user_type_id==2){
    this.getAdminBusinessDataSelection();
    this.divBusinessNameMaster = true;
    this.divBusinessLavelMaster = true;
    this.divParentUserMaster = true;
    this.divicNameMaster = false;

    this.formRecodEdit.get("business_partner_master_id").setValidators([Validators.required]);
    this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

    this.formRecodEdit.get("level_id").setValidators([Validators.required]);
    this.formRecodEdit.get("level_id").updateValueAndValidity();

    this.formRecodEdit.get("ic_master_id").setValidators([]);
    this.formRecodEdit.get("ic_master_id").updateValueAndValidity();
  }else if(result.result.admin_user_type_id==4){

    this.getAdminBusinessLevelDataSelection();
    this.divBusinessNameMaster = false;
    this.divBusinessLavelMaster = true;
    this.divParentUserMaster = true;
    this.divicNameMaster = false;

    this.formRecodEdit.get("business_partner_master_id").setValidators([]);
    this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

    this.formRecodEdit.get("level_id").setValidators([Validators.required]);
    this.formRecodEdit.get("level_id").updateValueAndValidity();

    this.formRecodEdit.get("ic_master_id").setValidators([]);
    this.formRecodEdit.get("ic_master_id").updateValueAndValidity();
    
  }else if(result.result.admin_user_type_id==3){
    this.getAdminICDataSelection();
    this.formRecodEdit.get("ic_master_id").setValidators([Validators.required]);
    this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

    this.formRecodEdit.get("business_partner_master_id").setValidators([]);
    this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

    this.formRecodEdit.get("level_id").setValidators([]);
    this.formRecodEdit.get("level_id").updateValueAndValidity();

    this.divBusinessNameMaster = false;
    this.divBusinessLavelMaster = false;
    this.divParentUserMaster = false;
    this.divicNameMaster = true;
  }else{
    this.formRecodEdit.get("ic_master_id").setValidators([]);
    this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

    this.formRecodEdit.get("business_partner_master_id").setValidators([]);
    this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

    this.formRecodEdit.get("level_id").setValidators([]);
    this.formRecodEdit.get("level_id").updateValueAndValidity();

    this.divBusinessNameMaster = false;
    this.divBusinessLavelMaster = false;
    this.divParentUserMaster = false;
    this.divicNameMaster = false;

  }
  
  setTimeout(() => {
    if(result.result.mobile!='0'){
      result.result.mobile=result.result.mobile;
    }else{
      result.result.mobile='';
    }
    this.formRecodEdit.patchValue({
      id : result.result.id,
      prev_status_id : result.result.status_id,
      user_type : result.result.admin_user_type_id,
      business_partner_master_id : result.result.business_id,
      business_id : result.result.business_id,
      ic_master_id : result.result.ic_id,
      level_id : result.result.hierarchy_id,
      parent_user_id : result.result.parent_user_id,
      department_id : result.result.department_id,
      user_role : result.result.role_id,
      first_name : result.result.first_name,
      middle_name : result.result.middle_name,
      last_name : result.result.last_name,
      email : result.result.email,
      mobileNo : result.result.mobile,
      status : result.result.status_id,
      
    });
  }, 4000);
}

openModel(){
  this.showBusLevels = "none";
  this.showSubBusLevels = "none";
  this.btnEditSubmit = true;
  this.inNewEntery = true;
  this.resetForm();
  this.popupTitle = "Add User Details";
  this.display='none';
  this.showCreateBtn = true;
  this.formRecodEdit.get("password").enable();
  // this.getDataById(id);
}

submitForm(){
  this.submitted = true;
  if(this.formRecodEdit.invalid){
    return;
  }
  this.loaderActive = true;
  const sendData = new FormData();
  sendData.append('id',this.formRecodEdit.value.id);
  sendData.append('prev_status_id',this.formRecodEdit.value.prev_status_id);
  sendData.append('user_type',this.formRecodEdit.value.user_type);
  sendData.append('business_partner_master_id',this.formRecodEdit.value.business_partner_master_id);
  sendData.append('ic_master_id',this.formRecodEdit.value.ic_master_id);
  sendData.append('level_id',this.formRecodEdit.value.level_id);
  sendData.append('parent_user_id',this.formRecodEdit.value.parent_user_id);

  sendData.append('department_id',this.formRecodEdit.value.department_id);
  sendData.append('user_role',this.formRecodEdit.value.user_role);
  sendData.append('first_name',this.formRecodEdit.value.first_name);
  sendData.append('middle_name',this.formRecodEdit.value.middle_name);
  sendData.append('last_name',this.formRecodEdit.value.last_name);
  sendData.append('email',this.formRecodEdit.value.email);

  sendData.append('password',this.formRecodEdit.value.password);
  sendData.append('mobileNo',this.formRecodEdit.value.mobileNo);


  sendData.append('status',this.formRecodEdit.value.status);

  sendData.append('userid',this.loginUserId);

  this.commonService.userDataUpdate(sendData)
  .subscribe(response =>{

    this.loaderActive = false;
    this.editResult = response;
    if(this.editResult.status){
        this.runTable();
        this.closePopup();
        this.closeAddExpenseModal.nativeElement.click();
        // this.successNotify(this.editResult.message);
        console.log(sendData);
        console.log(this.formRecodEdit.value.id);
        console.log(this.formRecodEdit.value.email);
        if(this.editResult.message == "Insert User Successfully."){
          //Swal.fire(this.editResult.message, 'Kindy Use Your Mobile No As Password', "success");
          Swal.fire(this.editResult.message, '', "success");
        }else{
          Swal.fire(this.editResult.message, '', "success");
        }

        this.msgClass = "alert-success";
        this.responseMsg = this.editResult.message;
    }else{
        Swal.fire(this.editResult.message, '', "error");
        this.msgClass = "alert-danger";
        this.responseMsg = this.editResult.message;
    }
  });
}

changeStatus(id,status){
  var sendData = new FormData();
  sendData.append('id',id);
  sendData.append('user_status',status);
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
    this.commonService.changeStatusByAdminUserId(sendData)
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

  closePopup(){
    this.display='block';
    this.resetForm();
    this.loaderActive = false;
    this.divBusinessNameMaster  = false;
    this.divBusinessLavelMaster  = false;
    this.divParentUserMaster  = false;
    this.divicNameMaster = false;

    this.roleData = [];
    this.businessLevelDataSelection = [];
    this.parentData = [];
    this.businessDataSelection = [];    
    this.formRecodEdit.patchValue({ parent_user_id: "",business_partner_master_id: "",level_id: "",user_role: "",password:""});
  }
}