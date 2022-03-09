import { Component, OnInit,Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-od-special-discount',
  templateUrl: './od-special-discount.component.html',
  styleUrls: ['./od-special-discount.component.css']
})
export class OdSpecialDiscountComponent implements OnInit {

  	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  	base_url = environment.baseUrl;
  	dtOptions: DataTables.Settings = {};
  	@ViewChild(DataTableDirective) dtElement: DataTableDirective;

  	loginUserId : any;
  	loaderActive : boolean =  false;

  	display : any;
  	// loaderActive : boolean =  false;
  	formRecodEdit: FormGroup;
  	popupTitle : any;
  	popupTitle2 : any;
  	fileUpload : any;
	downloadurl : any;
	statusData : any;
	submitted : boolean = false;
	btnEditSubmit : boolean = false;
	showCreateBtn : boolean = true;
	responseMsg : any;
	msgClass: any;
	msg_display : any;
	productData : any;
	showInputDiv = "block";
	output_result:any;

	icList : any;
	productList : any;
	statusList : any;
	modelList : any;
	variantList : any;
	fuelList : any;
	mispList : any;
	dpList : any;
	stateList : any;
	cityList : any;

	// filterFormQuery : any;
	selected_product : any;
	selected_misp : any;

	displayModelDrodown : any ;
	editResult : any ;
	discount_expiry_date: NgbDateStruct;
	models_name : any;

	editResultmodel : any;
	access_permission:any;
  	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService, private http: HttpClient, private renderer: Renderer2, private router: Router, private commonService : CommonService, private formBuilder: FormBuilder) {
		this.loginUserId = sessionStorage.getItem("adminUserId");
		this.access_permission = sessionStorage.getItem("access_permission");
	}


	ngOnInit(): void {
		// console.log('testign 123212')
		
		this.loginUserId = sessionStorage.getItem("adminUserId");  
		this.displayModelDrodown = 'none';
		
		this.getIndex();
		this.getIcList();
		this.getProductList();
		this.getStatusData();
		this.getFuelList();
		this.getMispList();
		this.getStates();

		this.formRecodEdit= this.formBuilder.group({
	        ic_id : ['',[Validators.required]],
	        product_type_id : ['',[Validators.required]],
	        business_partner_master_id : [''],
	        dp_id : [''],
	        model_id : [''],
	        is_flat_special : ['',[Validators.required]],
	        discount_age_min : ['',[Validators.required, Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(99)$"), Validators.maxLength(2)]],
	        discount_age_max : ['',[Validators.required, Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(99)$"), Validators.maxLength(2)]],
	        max_available_discount : ['',[Validators.required, Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(99)$")]],
	        discount_expiry_date : ['',[Validators.required]],	        
	        max_ncb : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(99)$")]],
	        min_ncb : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(99)$")]],
	        status : ['',[Validators.required]],
	        
	      });
	}

	getIndex()
	{
		// console.log('test query sub types..............');
	    const that = this;
	      	this.dtOptions = {
	          	"pagingType": 'full_numbers',
	          	"pageLength": 10,
	          	"serverSide": true,
	          	"processing": true,
	          	'ajax' : {
	              	url : this.base_url+'admin/getSpecialOdDiscountList',
	              	type : 'POST',
	              	data: {
	              		"loginUserId": this.loginUserId,
	          		},
	              dataType: "json",
	          	},
	          	columns: [
		            {
		              'title' : 'Sr. No.',
		              'data' : 'sno'
		            },
		            {
		              'title' : 'Business Partner',
		              'data' : 'name'
		            },
		            {
		              'title' : 'Insurance Comapny',
		              'data' : 'ic_name'
		            },
		            {
		              'title' : 'Product Type',
		              'data' : 'product_type_name'
		            },
		            {
		              'title' : 'Is Flat Special',
		              'data' : 'is_flat_special'
		            },
		            {
		              'title' : 'NCB Min',
		              'data' : 'ncb_min'
		            },
		            {
		              'title' : 'NCB Max',
		              'data' : 'ncb_max'
		            },
		            {
		              'title' : 'Min. Discount Age',
		              'data' : 'discount_age_min'
		            },
		            {
		              'title' : 'Max. Discount Age',
		              'data' : 'discount_age_max'
		            },
		            {
		              'title' : 'Max. Available Discount',
		              'data' : 'max_available_discount'
		            },
		            {
		              'title' : 'Discount Expiry Date',
		              'data' : 'discount_expiry_date'
		            },
		            {
		              'title' : 'Models',
		              'data' : 'model_name'
		            },
		            {
		              'title' : 'Status',
		              'data' : 'od_status'
		            },
		            {
		              'title' : 'Action',
		              'data' : 'action_btn'
		            }


	          	],
	          	"columnDefs": [ {
		            "targets": [0,3,11,12,13],
		            "orderable": false
		        }],
		        order: [[ 1, "desc" ]]
      	};
	}

	getIcList(){
	  	this.commonService.getIcData().subscribe( response => {
          	this.icList = response;
          	this.icList = this.icList.result;         
          	//this.setFormData(this.state_data);
          	// console.log(this.icList);
        });
	}

	getProductList(){
	  	this.commonService.getProductData().subscribe( response => {
          	this.productList = response;
          	this.productList = this.productList.result;         
          	//this.setFormData(this.state_data);
          	// console.log(this.productList);
        });
	}

	getFilterModel(event){
	    if(event.target.value != "")
	    {
	      	this.selected_product = event.target.value;
	      	this.formRecodEdit.patchValue({model_id : '' });

	      	this.modelList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('product_type_id',event.target.value);
	      	this.commonService.getModelListByProductId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		// console.log(result);
	        		if(result.status){
	          			this.modelList = result.result;
	        		}
	      	});
	    }
  	}

  	getFilterVariant(event){
	    if(event.target.value != "")
	    {
	      	// this.selected_produ = event.target.value;
	      	this.formRecodEdit.patchValue({variant : '' });

	      	this.variantList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('model_id',event.target.value);
	      	this.commonService.getVariantListByModelId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		// console.log(result);
	        		if(result.status){
	          			this.variantList = result.result;
	        		}
	      	});
	    }
  	}

  	getFuelList(){
	  	this.commonService.getFuelData().subscribe( response => {
          	this.fuelList = response;
          	this.fuelList = this.fuelList.result;
          	// console.log(this.fuelList);
        });        
	}

  	getStatusData(){
	  	this.commonService.getStatusData().subscribe( response => {
          	this.statusList = response;
          	this.statusList = this.statusList.result;         
          	//this.setFormData(this.state_data);
          	// console.log(this.statusList);
        });
	}

	getMispList(){
		this.commonService.getMispData().subscribe( response => {
          	this.mispList = response;
			this.mispList = this.mispList.data;
          	// console.log(this.mispList);
        });
	}

	getFilterDp(event){
		if(event.target.value != "")
	    {
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit.patchValue({dp_id : '' });

	      	this.dpList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('business_partner_master_id',event.target.value);
	      	this.commonService.getDpListByMispId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		// console.log(result);
	        		if(result.status){
	          			this.dpList = result.result;
	        		}
	      	});
	    }
	}	

	openModel(){
		this.showInputDiv = "block";
		this.btnEditSubmit = true;
		this.popupTitle = "Add Special OD Discount";
		this.display='none';
		this.showCreateBtn = true;
  	}

  	openModel2(sp_od_id){
		this.popupTitle2 = "Models List";
		this.loaderActive = true;
		var sendData = new FormData();
		sendData.append('sp_od_id',sp_od_id);
		this.commonService.getSpOdModelsNameBySpOdId(sendData)
		    .subscribe( response => {
		      this.loaderActive = false;
		      this.editResultmodel = response;
		      // console.log(response);
		      // this.models_name = response.result.Result[0].models_name;
		      this.models_name = this.editResultmodel.result.Result;
		      // console.log(response.status);
		      // console.log(this.models_name);
		});  			
  	}



  	closePopup(){
    	this.display='block';
    	// this.resetForm();
    	this.loaderActive = false;
  	}

  	runTable(){
    	this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        	dtInstance.draw();
      	});
  	}

  	ngAfterViewInit(): void {
	    this.renderer.listen('document', 'click', (event) => {
	        
	        if (event.target.hasAttribute("view-active-id")) {
	          this.changeStatus(event.target.getAttribute("view-active-id"),2);
	        }
	        if (event.target.hasAttribute("view-inactive-id")) {
	          this.changeStatus(event.target.getAttribute("view-inactive-id"),1);
	        }
	        if (event.target.hasAttribute("view-active-sp_od_id")) {
	          this.openModel2(event.target.getAttribute("view-active-sp_od_id"));
	        }

	    });
  	}

  	getStates(){
  		this.commonService.getStateData().subscribe( response => {
          	this.stateList = response;
          	this.stateList = this.stateList.result;
          	// console.log(this.stateList);
        });
  	}

  	getFilterCities(event){
		if(event.target.value != "")
	    {
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit.patchValue({city_id : '' });

	      	this.cityList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('state_id',event.target.value);
	      	this.commonService.getStateWiseList(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		// console.log(result);
	        		if(result.status){
	          			this.cityList = result.result;
	        		}
	      	});
	    }
	}

  	hideModelDropdown(val){
  		this.displayModelDrodown = 'none';
  		if(val == '1'){
  			this.formRecodEdit.get("model_id").setValidators([]);
      		this.formRecodEdit.get("model_id").updateValueAndValidity();
  		}
  		else{
  			this.formRecodEdit.get("model_id").setValidators([Validators.required]);
      		this.formRecodEdit.get("model_id").updateValueAndValidity();
  		}
  	}

  	showModelDropdown(val){
  		this.displayModelDrodown = 'block';  		
  		if(val == '1'){
  			this.formRecodEdit.get("model_id").setValidators([]);
      		this.formRecodEdit.get("model_id").updateValueAndValidity();
  		}
  		else{
  			this.formRecodEdit.get("model_id").setValidators([Validators.required]);
      		this.formRecodEdit.get("model_id").updateValueAndValidity();
  		}
  	}

  	successNotify(infoMsg){
    	this.notifyService.success(
    	'Success',
     	infoMsg,
    	{
	        theClass: "aboveAll",
	        timeOut: 3000,
	        showProgressBar: true,
	        animate: 'fade',
    	});
  	}

  	submitForm(){
  		this.submitted = true;
  		// console.log('test1');
	    if(this.formRecodEdit.invalid)
	    {
	    	console.log('test_false');
	      	return;
	    }
	    // else
	    // {
	    // 	console.log('test_true');
	    // 	alert('true');
	    // }
	    // return;
	    // console.log('test');

	    this.loaderActive = true;
	    const sendData = new FormData();
	    sendData.append('loginUserId',this.loginUserId);
	    sendData.append('ic_id',this.formRecodEdit.value.ic_id);
	    sendData.append('product_type_id',this.formRecodEdit.value.product_type_id);
	    sendData.append('business_partner_master_id',this.formRecodEdit.value.business_partner_master_id);
	    sendData.append('is_flat_special',this.formRecodEdit.value.is_flat_special);
	    sendData.append('discount_age_min',this.formRecodEdit.value.discount_age_min);
	    sendData.append('discount_age_max',this.formRecodEdit.value.discount_age_max);
	    sendData.append('max_available_discount',this.formRecodEdit.value.max_available_discount);
	    sendData.append('discount_expiry_date',JSON.stringify(this.discount_expiry_date));
	    sendData.append('min_ncb',this.formRecodEdit.value.min_ncb);
	    sendData.append('max_ncb',this.formRecodEdit.value.max_ncb);
	    sendData.append('status',this.formRecodEdit.value.status);

	    sendData.append('model_id',this.formRecodEdit.value.model_id);
	    sendData.append('dp_id',this.formRecodEdit.value.dp_id);

	    // console.log("Exp. Date :"+this.discount_expiry_date);
	    // console.log("Models : "+this.formRecodEdit.value.model_id);
	    // console.log("DPs : "+this.formRecodEdit.value.dp_id);


	    this.commonService.addSpecialOdDiscount(sendData).subscribe(response =>
	    {
	      	this.loaderActive = false;
	      	this.output_result = response;
	      	if(this.output_result.status)
	      	{
	        	this.runTable();
	          	this.closePopup();
		        this.closeAddExpenseModal.nativeElement.click();
		        // this.successNotify(this.output_result.message);
	         	this.msgClass = "alert-success";
	         	this.responseMsg = this.output_result.message;
	         	Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
	      	}
	      	else
	      	{
	          	this.closePopup();
	          	this.msgClass = "alert-danger";
	          	this.responseMsg = this.output_result.message;
	          	Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
	      	}
	    });
  	}

  	changeStatus(id,status){
	    var sendData = new FormData();
	    sendData.append('od_discount_condition_id',id);
	    sendData.append('od_status',status);
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
	      this.commonService.changeStatusBySpecialOdId(sendData)
	      .subscribe( response => {
	        this.editResult = response;
	        this.runTable();
	        if(this.editResult.status){
	          //Swal.fire(this.editResult.message, '', "success");
	          Swal.fire({position: 'center',icon: 'success',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
	        }else{
	          Swal.fire({position: 'center',icon: 'error',title: this.editResult.message, showConfirmButton: false, timer: 3000 });
	        }

	    });
	    }
	  });
  	}


}
