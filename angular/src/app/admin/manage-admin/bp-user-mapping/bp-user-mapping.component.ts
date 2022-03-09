import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from "@angular/core"; //newly added
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../services/common.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms"; //newly added
import { Router, NavigationEnd } from "@angular/router";
import Swal from "sweetalert2";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-bp-user-mapping",
  templateUrl: "./bp-user-mapping.component.html",
  styleUrls: ["./bp-user-mapping.component.css"],
})
export class BpUserMappingComponent implements OnInit {
  base_url = environment.baseUrl;
  formRecodEdit: FormGroup;

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("closeAddExpenseModal") closeAddExpenseModal: ElementRef; //newly added

  loginUserId: any;
  loginUserRoleId: any;
  loginUserTypeId: any;
  loginUserName: any;
  adminMenuIds: any;
  selectedMisp: any = [];
  selectedGIIBBPDataSelection: any = [];

  businessDataSelection: any;

  editResult: any;
  display: any;
  loaderActive: boolean = false;
  popupTitle: any;
  fileUpload: any;
  downloadurl: any;
  submitted: boolean = false;
  btnEditSubmit: boolean = false;
  showCreateBtn: boolean = true;

  typeDataSelection: any;
  UserDataSelection: any;
  GIIBUserDataSelection: any;
  PosUserDataSelection: any;
  GIIBBPUserDataSelection: any;
  roleData: any;

  responseMsg: any;
  msgClass: any;
  msg_display: any;
  icList: any;
  isIcListShow: boolean = false;
  inNewEntery: boolean = true;
  showBPUserPanel: boolean = false;
  showGIIBUserPanel: boolean = false;
  ShowGIIBBPDATa: boolean = false;
  showINDBP: boolean = false;
  showBusLevels: any = "none";

  showSubBusLevels: any = "none";
  zoneData: any;
  regionData: any;
  stateData: any;
  levelsData: any;
  subLevelData: any;
  password: any;
  divDepartmentMaster: boolean = false;
  show_input: boolean = false;
  show_select: boolean = true;
  access_permission: any;
  is_isuzu  : any;
  bp_name:any;
  dp_name:any;
  selected_user_type:any;
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }

  ngOnInit() {
    this.divDepartmentMaster = false;
    this.isIcListShow = false;
    this.showBPUserPanel = false;
    this.showGIIBUserPanel = false;
    this.inNewEntery = true;
    this.ShowGIIBBPDATa = false;
    this.showINDBP = false;
    this.formRecodEdit = this.formBuilder.group({
      id: 0,
      giib_user_id: [""],
      hiddent_user_type: [""],
      hiddent_giib_id: [""],
      user_id: [""],
      isuzu_user_type: [""],
      user_type: ["", [Validators.required]],
      business_partner_master_id: ["", [Validators.required]],
      pos_id: ["", [Validators.required]],
    });

    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");
    this.loginUserName = sessionStorage.getItem("adminUserName");
    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");

    this.getIndex();
    this.getAdminUserTypeSelection();
    this.getAdminBusinessDataSelection();
    this.bp_name="Business Partner";
    this.dp_name="Pos";
    if(this.is_isuzu==1){
      this.bp_name="MISP";
      this.dp_name="DP";
      this.show_input=true;
      this.show_select=false;
      this.showINDBP=true;
      this.showBPUserPanel=true;
      this.selected_user_type = 2;
    }else{
      this.show_input=false;
      this.show_select=true;
    }
  }

  getAdminBusinessDataSelection() {
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("loginUserRoleId", this.loginUserRoleId);
    sendData.append("loginUserTypeId", this.loginUserTypeId);
    this.commonService
      .getAdminUserBusinessDataSelection(sendData)
      .subscribe((response) => {
        this.businessDataSelection = response;
        this.businessDataSelection = this.businessDataSelection.result;

        this.GIIBBPUserDataSelection = response;
        this.GIIBBPUserDataSelection = this.GIIBBPUserDataSelection.result;

        //this.setFormData(this.state_data);
        // console.log(this.statusData);
      });
  }

  getAdminUserTypeSelection() {
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("loginUserRoleId", this.loginUserRoleId);
    sendData.append("loginUserTypeId", this.loginUserTypeId);
    this.commonService
      .getSelectedAdminUserTypeSelection(sendData)
      .subscribe((response) => {
        this.typeDataSelection = response;
        this.typeDataSelection = this.typeDataSelection.result;
      });
  }

  getIndex() {

    this.bp_name="Business Partner";
    if(this.is_isuzu==1){
      this.bp_name="MISP"; 
    }
    //console.log('test pro..............');
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: this.base_url + "admin/getAdminBpUserMappingList",
        type: "POST",
        data: {
          loginUserId: this.loginUserId,
          loginUserRoleId: this.loginUserRoleId,
          loginUserTypeId: this.loginUserTypeId,
          adminMenuIds: this.adminMenuIds,
        },
        dataType: "json",
      },
      columns: [
        {
          title: "Sr.No",
          data: "id",
        },
        {
          title: this.bp_name+" Name",
          data: "name",
        },
        {
          title: this.bp_name+" User Name",
          data: "full_name",
        },
        {
          title: this.bp_name+" User Mobile",
          data: "mobile",
        },
        {
          title: this.bp_name+" User Email",
          data: "email",
        },
        {
          title: "status",
          data: "status_label",
        },
        {
          title: "created_at",
          data: "created_at",
        },
        {
          title: "Action",
          data: "action_btn",
        },
      ],
      columnDefs: [{ orderable: false, targets: 6 }],
      order: [[7, "desc"]],
    };
  }

  runTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ngAfterViewInit(): void {
    this.renderer.listen("document", "click", (event) => {
      if (event.target.hasAttribute("view-edit-id")) {
        console.log("editee");
        this.editRecord(event.target.getAttribute("view-edit-id"));
      }
      if (event.target.hasAttribute("view-inactive-id")) {
        this.changeStatus(event.target.getAttribute("view-inactive-id"), 1);
      }
      if (event.target.hasAttribute("view-misp-privilege")) {
        this.redirectPrivilege(
          event.target.getAttribute("view-misp-privilege")
        );
      }
    });
  }

  redirectPrivilege(url) {
    //alert('innn');
    this.router.navigate([url]);
  }

  editRecord(id) {
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Business Partner User Mapping";
    this.display = "none";
    this.inNewEntery = false;
    //    this.formRecodEdit.get("password").disable();
    //this.msg_display = 'none';
    this.getBpMappingDataById(id);
  }

  resetForm() {
    this.submitted = false;
    this.formRecodEdit.patchValue({
      giib_user_id: "",
      hiddent_giib_id: "",
      user_type: "",
      business_partner_master_id: "",
      user_id: "",
      pos_id: "",
      hiddent_user_type: "",
    });
  }

  getBpMappingDataById(id) {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("id", id);
    this.commonService
      .getBpPosUserMappingDataById(sendData)
      .subscribe((response) => {
        console.log(response);
        this.loaderActive = false;
        this.editResult = response;
        this.setFormData(this.editResult);
      });
  }

  setFormData(result) {

    this.loaderActive = true;
    
    if (result.result.admin_user_type == 2) {
      this.showBPUserPanel = true;
      this.showGIIBUserPanel = false;
      this.loaderActive = false;
      
      this.UserDataSelection = result;
      this.UserDataSelection = this.UserDataSelection.business_user_details;

      this.PosUserDataSelection = result;
      this.PosUserDataSelection = this.PosUserDataSelection.pos_result;
      
      this.ShowGIIBBPDATa = false;
      this.showINDBP = true;

    } else if (result.result.admin_user_type == 4) {
        this.showGIIBUserPanel = true;
        this.showBPUserPanel = false;
        this.loaderActive = false;

        this.GIIBUserDataSelection = result;
        this.GIIBUserDataSelection = this.GIIBUserDataSelection.business_user_details;

        this.PosUserDataSelection = result;
        this.PosUserDataSelection = this.PosUserDataSelection.pos_result;

        this.ShowGIIBBPDATa = true;
        this.showINDBP = false;
    }


    setTimeout(() => {
      this.loaderActive = true;
      if (result.result.admin_user_type == 2) {
        this.formRecodEdit.patchValue({
          user_type: result.result.admin_user_type,
          hiddent_user_type: result.result.admin_user_type,
          business_partner_master_id: result.result.business_partner_master_id,
          user_id: result.result.admin_user_id,
          pos_id: result.pos_master_ids,
          id: result.result.id,
        });
      } else if (result.result.admin_user_type == 4) {
        this.formRecodEdit.patchValue({
          user_type: result.result.admin_user_type,
          hiddent_user_type: result.result.admin_user_type,
          business_partner_master_id: result.business_partner_master,
          giib_user_id: result.result.admin_user_id,
          hiddent_giib_id: result.result.admin_user_id,
          pos_id: result.pos_master_ids,
          id: result.result.id,
        });
      }
      this.loaderActive = false;
    }, 4000);
  }

  getFilterDp(event) {
    console.log(this.selectedMisp);
    this.formRecodEdit.patchValue({ pos_id: "" });
    this.PosUserDataSelection = [];
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    // sendData.append('pos_id',this.formRecodEdit.value.pos_id);
    sendData.append("pos_id", this.selectedMisp);
    this.commonService
      .getAdminUserBusinessMappingNameSelection(sendData)
      .subscribe((response) => {
        var result: any = response;
        // return;
        if (result.status) {
          this.PosUserDataSelection = result.pos_result;
        }
      });
  }

  getGIIBUserSelection(selectedUserType) {
    this.loaderActive = true;
    this.PosUserDataSelection = [];
    this.resetValueForBusinessPartnerType();

    const selectEl = selectedUserType.target;
    var selectedUserTypeId = selectedUserType.target.value;
    
    console.log(selectedUserTypeId);

    this.formRecodEdit.patchValue({
      hiddent_user_type: selectedUserTypeId,
    });

    if (selectedUserTypeId != 2) {
      console.log("pqr");
      this.showBPUserPanel = false;
      var sendData = new FormData();
      sendData.append("selectedUserTypeId", selectedUserTypeId);
      this.commonService.GetGIIBAdminUser(sendData).subscribe((response) => {
        this.formRecodEdit
          .get("giib_user_id")
          .setValidators([Validators.required]);
        this.formRecodEdit.get("giib_user_id").updateValueAndValidity();

        this.formRecodEdit.get("user_id").setValidators([]);
        this.formRecodEdit.get("user_id").updateValueAndValidity();

        this.GIIBUserDataSelection = response;
        this.GIIBUserDataSelection = this.GIIBUserDataSelection.result;
        this.showGIIBUserPanel = true;
        this.showINDBP = false;
        this.ShowGIIBBPDATa = true;
        this.loaderActive = false;
      });
    } else {
      console.log("abc");
      var sendData = new FormData();
      sendData.append("loginUserId", this.loginUserId);
      sendData.append("loginUserRoleId", this.loginUserRoleId);
      sendData.append("loginUserTypeId", this.loginUserTypeId);
      this.commonService
        .getAdminUserBusinessDataSelection(sendData)
        .subscribe((response) => {
          this.GIIBBPUserDataSelection = response;
          this.GIIBBPUserDataSelection = this.GIIBBPUserDataSelection.result;
        });

      this.formRecodEdit.get("user_id").setValidators([Validators.required]);
      this.formRecodEdit.get("user_id").updateValueAndValidity();

      this.formRecodEdit.get("giib_user_id").setValidators([]);
      this.formRecodEdit.get("giib_user_id").updateValueAndValidity();

      this.showGIIBUserPanel = false;
      this.showBPUserPanel = true;
      this.showINDBP = true;
      this.ShowGIIBBPDATa = false;
      this.loaderActive = false;
    }
  }

  SetUserSelection(selecgtedGIIBUser) {
    var selecgtedGIIBUser_Id = selecgtedGIIBUser.target.value;
    this.formRecodEdit.patchValue({
      hiddent_giib_id: selecgtedGIIBUser_Id,
    });
  }

  getAdminMultiUserSelection() {
    this.resetValueForBusinessPartnerSelect();
    this.loaderActive = true;
    var hiddent_giib_id = this.formRecodEdit.value.hiddent_giib_id;
    var hiddent_user_type = this.formRecodEdit.value.hiddent_user_type;

    var sendData = new FormData();
    sendData.append("selectedBusinessTypeId", this.selectedGIIBBPDataSelection);
    sendData.append("selectedgibuser", hiddent_giib_id);
    sendData.append("selectedusertype", hiddent_user_type);
    this.commonService
      .getAdminUserBusinessMappingNameSelection(sendData)
      .subscribe((response) => {
        this.PosUserDataSelection = response;
        if (this.PosUserDataSelection.status) {
          this.loaderActive = false;
          this.PosUserDataSelection = this.PosUserDataSelection.pos_result;
        } else {
          this.PosUserDataSelection = [];
          this.loaderActive = false;
        }
      });
  }

  getAdminUserSelection(selectedBusinessType) {
    this.resetValueForBusinessPartnerSelect();

    this.loaderActive = true;
    this.UserDataSelection = [];
    this.PosUserDataSelection = [];

    var selectedBusinessTypeId = selectedBusinessType.target.value;
    var hiddent_giib_id = this.formRecodEdit.value.hiddent_giib_id;
    var hiddent_user_type = this.formRecodEdit.value.hiddent_user_type;

    if (hiddent_user_type == 2) {
      const selectEl = selectedBusinessType.target;
      var selectedBusinessTypeId = selectedBusinessType.target.value;
      var isBusLevel =
        selectEl.options[selectEl.selectedIndex].getAttribute("data-levels");
      // console.log(selectedBusinessTypeId);
      // console.log(isBusLevel);

      var sendData = new FormData();
      sendData.append("selectedBusinessTypeId", selectedBusinessTypeId);
      this.commonService
        .getAdminUserBusinessMappingNameSelection(sendData)
        .subscribe((response) => {
          // console.log(response);
          this.UserDataSelection = response;
          this.PosUserDataSelection = response;
          if (this.UserDataSelection.status) {
            this.loaderActive = false;
            this.UserDataSelection = this.UserDataSelection.result;
            this.formRecodEdit
              .get("business_partner_master_id")
              .setValidators([Validators.required]);
            this.formRecodEdit
              .get("business_partner_master_id")
              .updateValueAndValidity();
          } else {
            this.UserDataSelection = [];
            this.loaderActive = false;
          }

          if (this.PosUserDataSelection.status) {
            this.PosUserDataSelection = this.PosUserDataSelection.pos_result;
          } else {
            this.PosUserDataSelection = [];
            this.loaderActive = false;
          }
        });
    } else if (hiddent_user_type == 4) {
      var sendData = new FormData();
      sendData.append("selectedBusinessTypeId", selectedBusinessTypeId);
      sendData.append("selectedgibuser", hiddent_giib_id);
      sendData.append("selectedusertype", hiddent_user_type);
      this.commonService
        .getAdminUserBusinessMappingNameSelection(sendData)
        .subscribe((response) => {
          this.PosUserDataSelection = response;
          if (this.PosUserDataSelection.status) {
            this.loaderActive = false;
            this.PosUserDataSelection = this.PosUserDataSelection.pos_result;
            // console.log(this.PosUserDataSelection);
          } else {
            this.PosUserDataSelection = [];
            this.loaderActive = false;
          }
        });
    }
  }

  openModel() {

    this.showBusLevels = "none";
    this.showSubBusLevels = "none";
    this.btnEditSubmit = true;
    this.inNewEntery = true;
    this.isIcListShow = false;
    this.resetForm();
    this.popupTitle = "Add Business Partner User Mapping";
    this.display = "none";
    this.showCreateBtn = true;

    if(this.is_isuzu==1){
      this.selected_user_type = 2;
      this.formRecodEdit.patchValue({
        user_type: 2,
        hiddent_user_type: 2,
      });
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.formRecodEdit.invalid) {
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append("user_type", this.formRecodEdit.value.user_type);
    sendData.append("giib_user_id", this.formRecodEdit.value.giib_user_id);
    sendData.append(
      "business_partner_master_id",
      this.formRecodEdit.value.business_partner_master_id
    );
    sendData.append("user_id", this.formRecodEdit.value.user_id);
    sendData.append("pos_id", this.formRecodEdit.value.pos_id);
    sendData.append("id", this.formRecodEdit.value.id);
    console.log(this.formRecodEdit.value.pos_id);
    sendData.append("userid", this.loginUserId);
    this.commonService
      .businessUserDataUpdate(sendData)
      .subscribe((response) => {
        this.loaderActive = false;
        this.editResult = response;
        if (this.editResult.status) {
          this.runTable();
          this.closePopup();
          this.closeAddExpenseModal.nativeElement.click();
          // this.successNotify(this.editResult.message);
          console.log(sendData);
          console.log(this.formRecodEdit.value.id);
          console.log(this.formRecodEdit.value.email);
          if (this.editResult.message == "Insert User Successfully.") {
            //Swal.fire(this.editResult.message, 'Kindy Use Your Mobile No As Password', "success");
            Swal.fire(this.editResult.message, "", "success");
          } else {
            Swal.fire(this.editResult.message, "", "success");
          }

          this.msgClass = "alert-success";
          this.responseMsg = this.editResult.message;
        } else {
          this.closePopup();
          this.msgClass = "alert-danger";
          this.responseMsg = this.editResult.message;
        }
      });
  }

  changeStatus(id, status) {
    var sendData = new FormData();
    sendData.append("id", id);
    sendData.append("make_status", status);
    sendData.append("userid", this.loginUserId);
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((willDelete) => {
      if (willDelete.value) {
        this.commonService
          .changeStatusByMakeId(sendData)
          .subscribe((response) => {
            this.editResult = response;
            this.runTable();
            if (this.editResult.status) {
              Swal.fire(this.editResult.message, "", "success");
            } else {
              Swal.fire(this.editResult.message, "", "error");
            }
          });
      }
    });
  }

  closePopup() {
    this.display = "none";
    this.responseMsg = null;
    this.resetForm();
    this.loaderActive = false;
    this.showGIIBUserPanel = false;
    this.ShowGIIBBPDATa = false;
    this.showINDBP = false;
    this.showBPUserPanel = false;
  }

  // getRoleDataByTypeId(typeid){
  //   this.loaderActive = true;
  //   var sendData = new FormData();
  //   sendData.append('typeid',typeid);

  //  this.commonService.getRoleDataByTypeId(sendData)
  //    .subscribe( response => {
  //      this.modelData = response;
  //       if(this.modelData.status){
  //       this.modelData = this.modelData.result;
  //       this.loaderActive = false;
  //      }else{
  //       this.modelData = [];
  //       this.loaderActive = false;
  //      //Swal.fire (this.editResult.message,  "" ,  "error" );
  //      }

  //      this.loaderActive = false;
  //      //this.setFormData(this.state_data);
  //      console.log(this.modelData);
  //    });

  // }

  resetValueForBusinessPartnerSelect() {
    this.formRecodEdit.patchValue({
      pos_id: "",
    });
  }

  resetValueForBusinessPartnerType() {
    this.formRecodEdit.patchValue({
      giib_user_id: "",
      hiddent_giib_id: "",
      business_partner_master_id: "",
      user_id: "",
      pos_id: "",
    });
  }
}
