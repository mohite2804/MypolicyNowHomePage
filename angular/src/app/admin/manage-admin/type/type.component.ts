import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';  //newly added
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { Router, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;  //newly added
  
  loginUserId : any;
  loginUserRoleId : any;
  loginUserTypeId : any;
  adminMenuIds : any;
  
  editResult : any;
  formRecodEdit: FormGroup;   //newly added

  // formRecodEdit : any;   //newly commented
  display : any;
  loaderActive : boolean =  false;
  

  //newly added

  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  statusData : any;
  typeData : any;

  //newly added end
  
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;


  //newly added


  responseMsg : any;
  msgClass: any;
  msg_display : any;
  productData : any;
  levelData : any;
  displayLevelDrodown : any;


  //newly added end

  access_permission : any;
  constructor(private customvalidationService: CustomvalidationService, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
  }

  ngOnInit(): void {
    
    //newly added

    this.formRecodEdit = this.formBuilder.group({
      id :[''],
      prev_status_id :[''],
      // code : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),Validators.pattern('^[a-zA-Z ]*$'),Validators.minLength(2),Validators.maxLength(20)]],      
      label : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),Validators.pattern('^[a-zA-Z ]*$'),Validators.minLength(2),Validators.maxLength(25)]],      
      status : ['',Validators.required],
      // is_level : ['',Validators.required],
      level : [''],
    });

    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.loginUserRoleId = sessionStorage.getItem("adminUserRoleId");
    this.loginUserTypeId = sessionStorage.getItem("adminUserTypeId");  
    this.adminMenuIds = sessionStorage.getItem("adminMenuIds");
    this.displayLevelDrodown = 'none';

    //newly added end
    this.getIndex();

    //newly added

    this.getTypeData();
    this.getStatusData();
    this.getLevelData();
    
    //newly added end
    
  }

//newly added

  getTypeData(){
    var sendData = new FormData();
    sendData.append('id','');
    this.commonService.getUserTypeDataById(sendData)
      .subscribe( response => {
        this.typeData = response;
        this.typeData = this.typeData.result;         
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

  //newly added end

  getIndex(){
    const that = this;
      this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/getAdminTypeList',
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
              'title' : 'label',
              'data' : 'label'
            },
            {
              'title' : 'Status',
              'data' : 'status_label'
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
            { "orderable": false, "targets": [0,4] }
          ],
          "order": [[ 3, "desc" ]]
      };
  }

//newly added

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {

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
        if (event.target.hasAttribute("view-levels-privilege")) {
          this.redirectLevels(event.target.getAttribute("view-levels-set"),event.target.getAttribute("view-levels-privilege"));
        }
    });     
  }

  redirectPrivilege(url){
    //alert('innn');
    this.router.navigate([url]);
  }

  redirectLevels(isSet,url){
    if(isSet != "0"){
      this.router.navigate([url]); 
    }else{
      Swal.fire("Kindly Contact IT Team For Mapping First", '', "info");
    }
  }

  editRecord(id){ 
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Type Details";
    this.display='none'; 
    //this.msg_display = 'none';
    this.getDataById(id);
  }

  resetForm(){
    this.submitted = false;
    this.formRecodEdit.patchValue({
      id : 0,
      prev_status_id : '',
      code : '',       
      label : '',       
      status : '',
    });
  }

  getDataById(id){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',id);
    this.commonService.getUserTypeDataById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      this.setFormData(this.editResult);
      // console.log(this.editResult);
    });
  }

  setFormData(result){ 
    if(result.result.is_business_level_set == '1')
    {
        this.displayLevelDrodown = 'block';
    }
    else
    {
      this.displayLevelDrodown = 'none';
    }

    this.formRecodEdit.patchValue({  
      id : result.result.admin_user_type_id,
      prev_status_id : result.result.status_id,
      // code : result.result.code,     
      label : result.result.label,     
      status : result.result.status_id,
      // is_level : result.result.is_business_level_set,
      level : result.result.level_id,
    });          
  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add Type Details";
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
    // sendData.append('code',this.formRecodEdit.value.code);    
    sendData.append('label',this.formRecodEdit.value.label);    
    sendData.append('status',this.formRecodEdit.value.status);
    sendData.append('userid',this.loginUserId);
    // sendData.append('is_level',this.formRecodEdit.value.is_level);
    sendData.append('level_id',this.formRecodEdit.value.level);
    
    this.commonService.userTypeDataUpdate(sendData)
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
          this.closePopup();
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
      this.commonService.changeStatusByAminUserTypeId(sendData)
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

  getLevelData(){
    this.commonService.getLevelData()
      .subscribe( response => {
        this.levelData = response;
        this.levelData = this.levelData.result;         
        //this.setFormData(this.state_data);
        // console.log(this.makeData);
      });
  }

  
  showhideLevelDropdown(val){;
    if(val == '1'){
      this.formRecodEdit.get("level").setValidators([Validators.required]);
      this.formRecodEdit.get("level").updateValueAndValidity();
      this.displayLevelDrodown = 'block';
    }
    else{
      this.formRecodEdit.get("level").setValidators([]);
      this.formRecodEdit.get("level").updateValueAndValidity();
      this.displayLevelDrodown = 'none';
    }
    

    
  }
  //newly added




  // redirectPrivilege(url){
  //   //alert('innn');
  //   this.router.navigate([url]);
  // }

}
