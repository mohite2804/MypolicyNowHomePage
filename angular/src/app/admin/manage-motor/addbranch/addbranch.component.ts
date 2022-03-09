import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { Router,ActivatedRoute} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.css']
})
export class addBranchComponent implements OnInit {
	ic_id:any;
	base_url = environment.baseUrl;
	dtOptions: DataTables.Settings = {};
	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
	@ViewChild(DataTableDirective) dtElement: DataTableDirective;
	result : any;
	loginUserId : any;
	editResult : any;
	formRecodEdit: FormGroup;
	change_privilege_link : any;
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
	stateData: any;
	bankDetailsData : any;
   output_result:any;
	selected_logo : any;
	selected_signature : any;
  
	selectedisheadoffice : any;
	selectedofficetype : any;
	selectedStatus : any;
  ic_office_id : any;
stateList : any;
	//validation_for_name_with_space :any = "^[a-zA-Z ]*$";
	validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";
	validation_for_gst_no :any   = "^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$";
  
	urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  
	validation_for_email :any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  
  access_permission:any;
	constructor(private customvalidationService: CustomvalidationService,private activatedRoute : ActivatedRoute, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }
  
    ngOnInit(): void {

		this.dtOptions[0] = {
			pagingType: 'full_numbers',
			pageLength: 10,
			processing: true
		  };
		  this.ic_id = this.activatedRoute.snapshot.paramMap.get('ic_id');
		  //this.getIcbranchData();
		  
		this.formRecodEdit = this.formBuilder.group({
		  id :[''],
		  code : [''],
		  seller_group_code : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9\-]+$')]],
		  state_id : ['',[Validators.required]],
		  address : ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9 \'\-]{2,500}$'),this.customvalidationService.cannotContainSpace(),this.customvalidationService.cannotContainZero(),]],
			officetype : ['',[Validators.required]],
			isheadoffice : ['',[Validators.required]],
      uin_no : ['',[Validators.required,Validators.pattern('^[0-9]{2}[a-zA-Z]{3}[cphfatbljgCPHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}$')]],
		  status : ['',[Validators.required]]
		});
		this.getIndex();
	   // this.getStatusData();
	   // this.getIcsData();
		this.getIcsStatus();
		this.getstateData();
    this.getStates();

		this.loginUserId = sessionStorage.getItem("adminUserId");
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
              url : this.base_url+'admin/getIcBranchData',
              type : 'POST',
              data: {
              "loginUserId": this.loginUserId,
              "ic_id": this.ic_id,

          },
              dataType: "json",
          },
          columns: [
            {
              'title' : 'S.No',
              'data' : 'sno'
            },
            {
              'title' : 'Insurance',
              'data' : 'code'
            },
            {
              'title' : 'Group Code',
              'data' : 'seller_off_group_code'
            },
            {
              'title' : 'State',
              'data' : 'state_name'
            },
            {
              'title' : 'State Cleaned',
              'data' : 'state_cleaned'
            },
            {
              'title' : 'State Code',
              'data' : 'state_short_code'
            },

            {
              'title' : 'GST NO',
              'data' : 'gstin'
            },

            {
              'title' : 'Is Head Office',
              'data' : 'is_head_office'
            },
            {
              'title' : 'Adress',
              'data' : 'reg_add'
            },
            {
              'title' : 'Office Type',
              'data' : 'office_type'
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
            },

          ],

          columnDefs: [
            { "orderable": false, "targets": [0,12] }
          ],
          order: [[ 11, "asc" ]]
      };
  }


	// getIcbranchData(){
 //    this.loaderActive = true;
	// 	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	// 	console.log(this.ic_id);
	// 	this.commonService.getIcBranchData(this.ic_id)
	// 	.subscribe(response => {
 //      this.loaderActive = false;
 //      this.result = response;
 //      this.change_privilege_link = this.result.change_privilege_link;
 //      this.result = this.result.result;
 //      console.log(this.result);
	// 	});
	// }

	editModel(row){
    console.log(row);
		this.router.navigate([this.change_privilege_link+this.ic_id+'/'+row.product_type_id]);
  }

  backPage(){
    this.router.navigate(["admin/manage-motor/ics"]);

  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
          this.selectedStatus = selected_value;
          break;

          case 'officetype':
          this.formRecodEdit.patchValue({officetype : selected_value });
          this.selectedofficetype =selected_value;
          break;

          case 'isheadoffice':
          this.formRecodEdit.patchValue({isheadoffice : selected_value });
          this.selectedisheadoffice = selected_value;
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

        case 'officetype':
        this.formRecodEdit.patchValue({officetype : '' });
        this.selectedofficetype = "";
        break;

        case 'isheadoffice':
        this.formRecodEdit.patchValue({isheadoffice : '' });
        this.selectedisheadoffice = "";
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
      this.selectedisheadoffice = "";
      this.selectedofficetype ="";
      this.selectedStatus = "";
      this.formRecodEdit.patchValue({
        id : 0,
        seller_group_code : '',
        state_id : '',
        state_cleaned : '',
        state_short_code : '',
        uin_no : '',
        is_head_office : '',
        reg_add:'',
        office_type : '',
        created_at : '',
        address : '',
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
    this.commonService.getIcBranchById(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;
      //console.log("dsdsds"+this.editResult.result.signature);
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

	getstateData(){
		this.loaderActive = true;
		  this.commonService.getStateData()
			.subscribe( response => {
			  this.loaderActive = false;
			  this.stateData = response;
			  this.stateData = this.stateData.result;
			  //this.setFormData(this.state_data);
			  console.log(this.stateData);
			});
	
		}
	

    getStates(){
      this.commonService.getStateData().subscribe( response => {
            this.stateList = response;
            this.stateList = this.stateList.result;
            // console.log(this.stateList);
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




  setFormData(result){

    this.selectedofficetype = result.result.office_type;
    this.selectedisheadoffice = result.result.is_head_office;
    this.selectedStatus = result.result.status_id;
    this.ic_office_id = result.result.ic_office_id;
    this.formRecodEdit.patchValue({
      id : result.result.ic_office_id,
      code : result.result.code,
      seller_group_code : result.result.seller_off_group_code,
      address : result.result.reg_add,
      state_id : result.result.state_id,
      uin_no : result.result.gstin,
      status_id : result.result.status_id,
    
      
    });
  }

  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show Insurance Company Branch Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    console.log(this.btnEditSubmit);
    this.resetForm();
    this.popupTitle = "Add Insurance Company Branch Details";
    this.display='none';
    this.showCreateBtn = true;
    this.logo_src = '';
    this.signature_src = '';
    // this.getDataById(id);

  }


  editRecord(ic_id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update Insurance Company Branch Details";
    this.display='none';
    this.getDataById(ic_id);

  }

  submitForm(){
    this.submitted = true;
    if(this.formRecodEdit.invalid){
      return;
    }
    this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('ic_id',this.ic_id);
    sendData.append('id',this.formRecodEdit.value.id);
	  sendData.append('seller_group_code',this.formRecodEdit.value.seller_group_code);
    sendData.append('address',this.formRecodEdit.value.address);
    sendData.append('state_id',this.formRecodEdit.value.state_id);
	  sendData.append('isheadoffice',this.selectedisheadoffice);
	  sendData.append('uin_no',this.formRecodEdit.value.uin_no);
    sendData.append('officetype',this.selectedofficetype);
    sendData.append('status_id',this.selectedStatus);
    sendData.append('userid',this.loginUserId);
    sendData.append('loginUserId',this.loginUserId);
    this.commonService.icbranchUpdate(sendData)
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




}
