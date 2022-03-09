import { Component, OnInit,Renderer2, ViewChild, ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';


@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements  OnInit {
  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  loginUserId : any;
  editResult : any;

  formRecodEdit : any;
  stateData : any;
  display : any;
  loaderActive : boolean =  false;
  popupTitle : any;
  fileUpload : any;
  downloadurl : any;
  countryData : any;
  submitted : boolean = false;
  btnEditSubmit : boolean = false;
  showCreateBtn : boolean = true;
  responseMsg : any;
  msgClass: any;
  responseMsgstate : any;
  msgClassState: any;
  displaystate : any;
  responseMsgCode : any;
  msgClassCode: any;
  displaycode : any;
  responseMsgGstCode : any;
  msgClassGstCode: any;
  displaygstcode : any;
  isdisabled : boolean  = false;
  statusData : any;
  output_scs:any;
  selectedregion : any;
  selectedCountry: any;
  selectedStatus:any;
  access_permission : any;
  constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService,private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) {
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.access_permission = sessionStorage.getItem("access_permission");
   }

    ngOnInit(): void {
      this.formRecodEdit = this.formBuilder.group({
        id :[''],
        name : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z \&]+$')]],
        code : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern('^[a-zA-Z ]{2,3}$')]],
        gst_state_code : ['',[Validators.required,this.customvalidationService.cannotContainZeroAndSpace(),this.customvalidationService.cannotContainZero(),Validators.pattern("^[0-9]{2,3}$")]],
        region : ['',Validators.required],
        country_id : ['',Validators.required],
        status : ['',Validators.required]

      });
    this.getIndex();
    this.getStateCountryStatus();
    this.loginUserId = sessionStorage.getItem("adminUserId");
  }

  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {

        case 'status':
          this.formRecodEdit.patchValue({status : selected_value });
          break;

          case 'country':
          this.formRecodEdit.patchValue({country : selected_value });
          break;

          case 'region':
          this.formRecodEdit.patchValue({region : selected_value });
          break;
      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'country':
        this.formRecodEdit.patchValue({country : '' });
        this.selectedregion = "";
        break;

        case 'sector':
        this.formRecodEdit.patchValue({sector : '' });
        this.selectedCountry = "";
        break;
        
        case 'status':
        this.formRecodEdit.patchValue({status : '' });
        this.selectedStatus = "";
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
              url : this.base_url+'admin/getstatelist',
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
              'title' : 'CODE',
              'data' : 'code'
            },
            {
              'title' : 'State Name',
              'data' : 'statename'
            },
            {
              'title' : 'Region',
              'data' : 'region'
            },
            {
              'title' : 'Country Name',
              'data' : 'countryname'
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
            { "orderable": false, "targets": 7 },
            { "orderable": false, "targets": 0 }
          ],
          order: [[ 6, "desc" ]]
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


        if (event.target.hasAttribute("view-active-id")) {
          this.changeStatus(event.target.getAttribute("view-active-id"),2);
        }
        if (event.target.hasAttribute("view-inactive-id")) {
          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
        }

    });
  }


  changeStatus(id,status){
    var sendData = new FormData();
    sendData.append('id',id);
    sendData.append('status',status);
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
      this.commonService.changeStatuseByStateId(sendData)
      .subscribe( response => {
        this.loaderActive = false;
        this.editResult = response;
        this.runTable();
        if(this.editResult.status){
          Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
        }else{
          Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });

        }

    });
    }
  });

  }


   resetForm(){
      this.submitted = false;
      this.selectedregion ="";
      this.selectedCountry="";
      this.selectedStatus="";
      this.formRecodEdit.patchValue({
        id : 0,
        name : '',
        code : '',
        gst_state_code : '',
        region : '',
        country_id : ''
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
      this.commonService.getStateDataById(sendData)
      .subscribe( response => {
        this.displaystate='none';
        this.displaycode='none';
        this.displaygstcode='none';
        this.editResult = response;
        this.setFormData(this.editResult);
        console.log(this.editResult);
      });
    }

  getStateCountryStatus(){
      this.commonService.getStateCountryStatus()
        .subscribe( response => {
        this.output_scs = response;
        this.stateData = this.output_scs.states;
        this.countryData = this.output_scs.country;
        this.statusData = this.output_scs.statusData;


     });

    }


    getStateData(){
      this.commonService.getStateData()
        .subscribe( response => {
          this.stateData = response;
          this.stateData = this.stateData.result;

        });

    }

    getCountryData(){
      this.commonService.getCountryData()
        .subscribe( response => {
          this.countryData = response;
          this.countryData = this.countryData.result;

        });

    }

   checkCode(code){

       var sendData = new FormData();
       sendData.append('code',code);

      this.commonService.checkCodeByName(sendData)
        .subscribe( response => {
          this.loaderActive = false;
          this.editResult = response;
        if(this.editResult.status){
          this.displaycode = 'block';
          this.msgClassCode = "alert-danger";
          this.responseMsgCode = this.editResult.message;
          this.isdisabled = true;

        }else{
          this.displaycode='none';
          this.displaystate='none';
          this.displaygstcode='none';
          this.isdisabled = false;
        }
        });

    }

    checkGSTCode(gstcode){
        this.responseMsgGstCode = "";
       var sendData = new FormData();
       sendData.append('gstcode',gstcode);

      this.commonService.checkGSTCodeByName(sendData)
        .subscribe( response => {
          this.loaderActive = false;
         this.editResult = response;
          if(this.editResult.status){
          this.displaygstcode = 'block';
          this.msgClassGstCode = "alert-danger";
          this.responseMsgGstCode = this.editResult.message;
          this.isdisabled = true;

        }else{
          this.displaycode='none';
          this.displaystate='none';
          this.displaygstcode='none';
          this.isdisabled = false;
        }
        });

    }


    checkState(stateval){

       var sendData = new FormData();
       sendData.append('statename',stateval);

      this.commonService.checkStateByName(sendData)
        .subscribe( response => {
          this.loaderActive = false;
        this.editResult = response;
        if(this.editResult.status){
          this.displaystate='block';
          this.msgClassState = "alert-danger";
          this.responseMsgstate = this.editResult.message;
          this.isdisabled = true;
        }else{
          this.displaystate='none';
          this.isdisabled = false;

        }
        });

    }

  setFormData(result){
    this.loaderActive = true;
    setTimeout(() => {
        this.selectedregion =result.result.region;
        this.selectedCountry=result.result.country_id;
        this.selectedStatus=result.result.status_id;

        this.formRecodEdit.patchValue({
          id : result.result.state_id,
          name : result.result.state_cleaned,
          code : result.result.code,
          gst_state_code : result.result.gst_state_code,
          region : result.result.region,
          country_id : result.result.country_id,
          status : result.result.status_id
        });
        this.loaderActive = false;
      }, 4000);
    }


  viewRecord(id){
    this.btnEditSubmit = false;
    this.resetForm();
    this.popupTitle = "Show State Details";
    this.display='block';
    this.getDataById(id);

  }

  openModel(){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Add State Details";
    this.display='none';
    this.showCreateBtn = true;
    this.displaystate='none';
    this.displaycode='none';
    this.displaygstcode='none';
    // this.getDataById(id);

  }

  editRecord(id){
    this.btnEditSubmit = true;
    this.resetForm();
    this.popupTitle = "Update State Details";
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
      sendData.append('name',this.formRecodEdit.value.name);
      sendData.append('code',this.formRecodEdit.value.code);
      sendData.append('gst_state_code',this.formRecodEdit.value.gst_state_code);
      sendData.append('region',this.formRecodEdit.value.region);
      sendData.append('country_id',this.formRecodEdit.value.country_id);
      sendData.append('userid',this.loginUserId);
      sendData.append('loginUserId',this.loginUserId);
      this.commonService.stateUpdate(sendData)
      .subscribe(response =>{

        this.loaderActive = false;
        this.editResult = response;
        if(this.editResult.status){
          this.runTable();
          this.closePopupSuccess();
          this.closeAddExpenseModal.nativeElement.click();
          Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
        }else{
          Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
        }
      });
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
        Swal.fire({position: 'center',icon: 'success',title: uploadResult.message, showConfirmButton: false, timer: 3000 });
        this.fileUpload = "";
      }else{

        Swal.fire({position: 'center',icon: 'error',title: uploadResult.message, showConfirmButton: false, timer: 3000 });
      }
    });
  }

  getExcelFile(files: FileList) {
    this.fileUpload = files.item(0);
  }

  getStatusData(){
    this.commonService.getStatusData()
      .subscribe( response => {
        this.statusData = response;
        this.statusData = this.statusData.result;

      });
  }


}
