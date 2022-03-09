import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';  //newly added
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;  //newly added

  loginUserId : any;
  loginUserRoleId : any;
  loginUserTypeId : any;
  loginUserName : any;
  adminMenuIds : any;

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
  businessDataSelection : any;
  icDataSelection : any;
  statusData : any;
  roleData : any;

  divBusinessNameMaster : boolean = false;
  divicNameMaster : boolean = false;

  responseMsg : any;
  msgClass: any;
  msg_display : any;
  i : any =0;
  formAccess : any;
  accessdisplay : any = "none";
  submittedAccess : boolean = false;
  access_permission:any;
  constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

  ngOnInit(): void {
  this.divBusinessNameMaster = false;
  this.divicNameMaster = false;

    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      prev_status_id :[''],
      user_type : ['',[Validators.required]],
      business_partner_master_id : ['',[Validators.required]],
      ic_master_id : ['',[Validators.required]],
      //code : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),Validators.pattern('^[a-zA-Z ]*$'),Validators.minLength(2),Validators.maxLength(20)]],
      label : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),Validators.pattern('^[a-zA-Z ]*$'),Validators.minLength(2),Validators.maxLength(25)]],
      status : ['',Validators.required]
    });

    this.formAccess = this.formBuilder.group({
      role_id :['',Validators.required],
      access_permission :['',Validators.required]
    });


    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");
    this.loginUserName = sessionStorage.getItem("adminUserName");
    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");

    this.getIndex();


    this.getRoleData();
    this.getStatusData();
    this.getAdminUserTypeSelection();
    this.getAdminBusinessDataSelection();
    this.getAdminICDataSelection();
  }

  getRoleData(){
    var sendData = new FormData();
    sendData.append('id','');
    this.commonService.getUserRoleDataById(sendData)
      .subscribe( response => {
        this.roleData = response;
        this.roleData = this.roleData.result;
        //this.setFormData(this.state_data);
        // console.log(this.makeData);
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

  getAdminBusinessNameSelection(selectedBusinessType){
    const selectEl = selectedBusinessType.target;
    var selectedTypeId = selectedBusinessType.target.value;
    var isBusLevel  = selectEl.options[selectEl.selectedIndex].getAttribute('data-levels');
    // console.log(selectedTypeId);
    console.log(selectedTypeId);
    if(selectedTypeId==2){

      this.divBusinessNameMaster = true;
      this.divicNameMaster = false;

      this.formRecodEdit.get("business_partner_master_id").setValidators([Validators.required]);
      this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

      this.formRecodEdit.get("ic_master_id").setValidators([]);
      this.formRecodEdit.get("ic_master_id").updateValueAndValidity();
    }
    else if(selectedTypeId==3){

      this.formRecodEdit.get("ic_master_id").setValidators([Validators.required]);
      this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

      this.formRecodEdit.get("business_partner_master_id").setValidators([]);
      this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

      this.divBusinessNameMaster = false;
      this.divicNameMaster = true;
    }else{
      this.formRecodEdit.get("ic_master_id").setValidators([]);
      this.formRecodEdit.get("ic_master_id").updateValueAndValidity();

      this.formRecodEdit.get("business_partner_master_id").setValidators([]);
      this.formRecodEdit.get("business_partner_master_id").updateValueAndValidity();

      this.divBusinessNameMaster = false;
      this.divicNameMaster = false;

    }
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
      });

  }

  getAdminBusinessDataSelection(){
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserRoleId',this.loginUserRoleId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);
    this.commonService.getAdminBusinessDataSelection(sendData)
      .subscribe( response => {
        this.businessDataSelection = response;
        this.businessDataSelection = this.businessDataSelection.result;
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

  getIndex(){
    //console.log('test pro..............');
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getAdminRoleList',
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
              'title' : 'User Type',
              'data' : 'user_type'
            },
            {
              'title' : 'BP',
              'data' : 'bp_name'
            },
            {
              'title' : 'IC',
              'data' : 'ic_name'
            },
            {
              'title' : 'Label',
              'data' : 'label'
            },
            {
              'title' : 'Status',
              'data' : 'status_label'
            },
            {
              'title' : 'Acess Permission',
              'data' : 'access_permission'
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
            { "orderable": false, "targets": [0,8] }
          ],
          "order": [[ 7, "desc" ]]
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
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }
        if (event.target.hasAttribute("view-misp-privilege")) {
          this.redirectPrivilege(event.target.getAttribute("view-misp-privilege"));
        }

        if (event.target.hasAttribute("view-access-id")) {
          this.openAccessPopup(event.target.getAttribute("view-access-id"));
        }
    });
  }

  openAccessPopup(role_id){
   //alert(role_id);
    this.resetAccessForm();
    this.accessdisplay='block';
    this.formAccess.patchValue({
      role_id : role_id,
      access_permission : '',
    });
  }

  closeAccessForm(){
    this.accessdisplay='none';
  }

  resetAccessForm(){
    this.submittedAccess = false;
    this.formAccess.patchValue({
      role_id : 0,
      access_permission : '',
    });
  }

  submitAccessForm(){
    this.submittedAccess = true;
    if(this.formAccess.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('role_id',this.formAccess.value.role_id);
    sendData.append('access_permission',this.formAccess.value.access_permission);
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('loginUserTypeId',this.loginUserTypeId);

    this.commonService.ChangeRoleAccess(sendData)
    .subscribe(response =>{

      this.loaderActive = false;
      var result : any  = response;
      this.closeAccessForm();
      if(result.status){
          this.runTable();
          Swal.fire(result.message, '', "success");
      }else{
        Swal.fire(result.message, '', "error");
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
    this.popupTitle = "Update Role Details";
    this.display='none';
    //this.msg_display = 'none';
    this.getDataById(id);
  }

  resetForm(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      id : 0,
      prev_status_id : '',
      user_type : '',
      //code : '',
      label : '',
      status : '',
    });

}

getDataById(id){
  this.loaderActive = true;
  var sendData = new FormData();
  sendData.append('id',id);
  this.commonService.getUserRoleDataById(sendData)
  .subscribe( response => {
    this.loaderActive = false;
    this.editResult = response;
    this.setFormData(this.editResult);
    // console.log(this.editResult);
  });
}

setFormData(result){

  if(result.result.admin_user_type_id==2){

    this.divBusinessNameMaster = true;
    this.divicNameMaster = false;

    this.formRecodEdit.get("business_partner_master_id").setValidators([Validators.required]);
    this.formRecodEdit.get("ic_master_id").setValidators([]);

  }else if(result.result.admin_user_type_id==3){

    this.formRecodEdit.get("ic_master_id").setValidators([Validators.required]);

    this.formRecodEdit.get("business_partner_master_id").setValidators([]);
    this.divBusinessNameMaster = false;
    this.divicNameMaster = true;

  }else{
    this.formRecodEdit.get("ic_master_id").setValidators([]);

    this.formRecodEdit.get("business_partner_master_id").setValidators([]);
    this.divBusinessNameMaster = false;
    this.divicNameMaster = false;

  }

  this.formRecodEdit.patchValue({
    id : result.result.admin_role_id,
    prev_status_id : result.result.status_id,
    user_type : result.result.admin_user_type_id,
    business_partner_master_id : result.result.business_partner_master_id,
    ic_master_id : result.result.ic_id,
    //code : result.result.code,
    label : result.result.label,
    status : result.result.status_id
  });
}

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Role Details";
    this.display='none';
    this.showCreateBtn = true;
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
    //sendData.append('code',this.formRecodEdit.value.code);
    sendData.append('label',this.formRecodEdit.value.label);
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);

    this.commonService.userRoleDataUpdate(sendData)
    .subscribe(response =>{
      this.loaderActive = false;
      this.editResult = response;
      if(this.editResult.status){
          this.runTable();
          this.closePopup();
          this.closeAddExpenseModal.nativeElement.click();
          // this.successNotify(this.editResult.message);
          Swal.fire(this.editResult.message, '', "success");
          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
      }else{
          // this.closePopup();
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
      }
    });
  }

  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('make_status',status);
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
      this.commonService.changeStatusByMakeId(sendData)
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
  }
}