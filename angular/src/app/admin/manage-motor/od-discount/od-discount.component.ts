import { Component, OnInit,Renderer2,AfterViewInit, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { CustomvalidationService } from '../../../front/services/customvalidation.service';

@Component({
  selector: 'app-od-discount',
  templateUrl: './od-discount.component.html',
  styleUrls: ['./od-discount.component.css']
})
export class OdDiscountComponent implements OnInit, AfterViewInit  {

	@ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  	base_url = environment.baseUrl;
  	@ViewChild(DataTableDirective, {static: false}) 
  	dtElement: DataTableDirective;
  	// dtOptions: DataTables.Settings = {};
  	dtOptions: any = {};

  	loginUserId : any;
  	loaderActive : boolean =  false;

  	display : any;
  	// loaderActive : boolean =  false;
  	formRecodEdit: FormGroup;
  	popupTitle : any;
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
	makeList : any;
	variantList : any;
	fuelList : any;
	mispList : any;
	dpList : any;
	stateList : any;
	cityList : any;

	// filterFormQuery : any;
	selected_product : any;
	selected_misp : any;

	displayStateDrodown : any ;
	displayCityDrodown : any ;
	editResult : any ;

	

  	constructor(private customvalidationService: CustomvalidationService, private notifyService: NotificationsService, private http: HttpClient, private renderer: Renderer2, private router: Router, private commonService : CommonService, private formBuilder: FormBuilder) { }


	ngOnInit(): void {
		// console.log('testign 123212')
		
		this.loginUserId = sessionStorage.getItem("adminUserId");  
		this.displayStateDrodown = 'none';
		this.displayCityDrodown = 'none';

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
	        model_id : [''],
			make_id : [''],
	        variant : [''],
	        vehicle_fuel_id : [''],
	        business_partner_master_id : [''],
	        dp_id : [''],
	        status : [''],
	        od_zone : ['',[Validators.required]],
	        state_id : [''],
	        city_id : [''],
	        zero_to_one : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        one_to_two : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        two_to_three : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        three_to_four : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        four_to_five : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        five_to_six : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        six_to_seven : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        sevent_to_eight : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        eight_to_nine : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        nine_to_ten : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        ten_to_eleven : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        eleven_to_twelve : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        twelve_to_thirteen : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        thirteen_to_fourteen : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        fourteen_to_fifteen : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        fifteen_to_sixteen : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],
	        sixteen_to_seventeen : ['',[Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$"), Validators.maxLength(2)]],

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
	              	url : this.base_url+'admin/getOdDiscountList',
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
		              'title' : 'DP ',
		              'data' : 'dp_name'
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
		              'title' : 'Model',
		              'data' : 'model_name'
		            },
		            {
		              'title' : 'Variant',
		              'data' : 'variant'
		            },
		            {
		              'title' : 'Fuel Type',
		              'data' : 'fuel_type'
		            },
		            {
		              'title' : 'City',
		              'data' : 'city_name'
		            },
		            {
		              'title' : 'State',
		              'data' : 'state_name'
		            },
		            {
		              'title' : 'Country',
		              'data' : 'country_name'
		            },
		            {
		              'title' : '0-1',
		              'data' : '0_1'
		            },
		            {
		              'title' : '1-2',
		              'data' : '1_2'
		            },
		            {
		              'title' : '2-3',
		              'data' : '2_3'
		            },
		            {
		              'title' : '3-4',
		              'data' : '3_4'
		            },
		            {
		              'title' : '4-5',
		              'data' : '4_5'
		            },
		            {
		              'title' : '5-6',
		              'data' : '5_6'
		            },
		            {
		              'title' : '6-7',
		              'data' : '6_7'
		            },
		            {
		              'title' : '7-8',
		              'data' : '7_8'
		            },
		            {
		              'title' : '8-9',
		              'data' : '8_9'
		            },
		            {
		              'title' : '9-10',
		              'data' : '9_10'
		            },
		            {
		              'title' : '10-11',
		              'data' : '10_11'
		            },
		            {
		              'title' : '11-12',
		              'data' : '11_12'
		            },
		            {
		              'title' : '12-13',
		              'data' : '12_13'
		            },
		            {
		              'title' : '13-14',
		              'data' : '13_14'
		            },
		            {
		              'title' : '14_15',
		              'data' : '14_15'
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
	          	dom: 'Bfrtip',
			    buttons: [		
			    	{extend: 'excel', className: 'btn btn-custom green'}	        			        
			    ]
	         //  	columnDefs: [ 
	         //  		{"targets": 3,"orderable": false},
	         //  	],
		        // order: [[ 1, "desc" ]],
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
			this.loaderActive = true;
	      	this.selected_product = event.target.value;
	      	this.formRecodEdit.patchValue({model_id : '' });

	      	this.modelList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('product_type_id',event.target.value);
	      	this.commonService.getModelListByProductId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
						this.loaderActive = false;
	          			this.modelList = result.result;
	        		}
	      	});
	    }
  	}

  	getFilterVariant(event){
	    if(event.target.value != "")
	    {
			this.loaderActive = true;
	      	// this.selected_produ = event.target.value;
	      	this.formRecodEdit.patchValue({variant : '' });

	      	this.variantList = [];
			this.makeList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('model_id',event.target.value);
	      	this.commonService.getVariantListByModelId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
						this.loaderActive = false;
						this.variantList = result.result;
						this.makeList = result.make_result;
					 	console.log(result.make_result);
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
          	console.log(this.mispList);
        });
	}

	getFilterDp(event){
		if(event.target.value != "")
	    {
			this.loaderActive = true;
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit.patchValue({dp_id : '' });

	      	this.dpList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('business_partner_master_id',event.target.value);
	      	this.commonService.getDpListByMispId(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
						this.loaderActive = false;
	          			this.dpList = result.result;
	        		}
	      	});
	    }
	}	

	openModel(){
		this.showInputDiv = "block";
		this.btnEditSubmit = true;
		// this.resetForm();
		this.popupTitle = "Add OD Discount";
		this.display='none';
		this.showCreateBtn = true;
		// this.getDataById(id);
  	}

  	closePopup(){
    	this.display='block';
    	this.resetForm();
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
	    });

	    //datatables columns filters 
	    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

	    	dtInstance.columns().every(function (index) {
	    		const that = this;
	    		
	    		// search column nmes
	    		$('input, select', this.footer()).on('keyup change', function () {
	    			var column_id = this['id'];
	    			var column_value = this['value'];	    			
	    			var column_name = this['name'];	
	    			console.log(column_id);
	    			console.log(column_value);

	    			// console.log("Type Of Index "+typeof index.toString());    			
	    			// console.log("Type Of colum id "+typeof column_id);    			
	    		
	    			if(parseInt(index.toString()) == parseInt(column_id))
	    			{
    					// console.log('true');
	    				if (dtInstance.search() !== this['value']) 
	    				{
			               	dtInstance
			                 	.columns(this['id'])
			                 	.search(column_value)
			                 	.draw();
			           	}	    				
			        }   	
	    		});
	    	});
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
			this.loaderActive = true;
	      	// this.selected_misp = event.target.value;
	      	this.formRecodEdit.patchValue({city_id : '' });

	      	this.cityList = [];
	      	var sendData = new FormData();
	      	sendData.append('loginUserId',this.loginUserId);
	      	sendData.append('state_id',event.target.value);
	      	this.commonService.getStateWiseList(sendData)
	      		.subscribe(response => {
	        		var result : any  = response;
	        		console.log(result);
	        		if(result.status){
						this.loaderActive = false;
	          			this.cityList = result.result;
	        		}
	      	});
	    }
	}

  	showStateDropdown(val){
  		// alert(val);
  		if(val == '2'){
  			this.formRecodEdit.get("state_id").setValidators([Validators.required]);
      		this.formRecodEdit.get("state_id").updateValueAndValidity();
  		}
  		else{
  			this.formRecodEdit.get("state_id").setValidators([]);
      		this.formRecodEdit.get("state_id").updateValueAndValidity();
  		}
  		

  		this.displayStateDrodown = 'block';
  		this.displayCityDrodown = 'none';
  	}

  	showStateCityDropdown(val){

  		if(val == '3'){
  			this.formRecodEdit.get("state_id").setValidators([Validators.required]);
      		this.formRecodEdit.get("state_id").updateValueAndValidity();

      		this.formRecodEdit.get("city_id").setValidators([Validators.required]);
      		this.formRecodEdit.get("city_id").updateValueAndValidity();
  		}
  		else{
  			this.formRecodEdit.get("state_id").setValidators([]);
      		this.formRecodEdit.get("state_id").updateValueAndValidity();

      		this.formRecodEdit.get("city_id").setValidators([]);
      		this.formRecodEdit.get("city_id").updateValueAndValidity();
  		}

  		this.displayStateDrodown = 'block';
  		this.displayCityDrodown = 'block';  		
  	}

  	hideStateCityDropdown(val){

  		if(val == '1'){
  			this.formRecodEdit.get("state_id").setValidators([]);
      		this.formRecodEdit.get("state_id").updateValueAndValidity();

      		this.formRecodEdit.get("city_id").setValidators([]);
      		this.formRecodEdit.get("city_id").updateValueAndValidity();
  		}
  		
  		this.displayStateDrodown = 'none';
  		this.displayCityDrodown = 'none';	
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
	    	// console.log('test_false');
	      	return;
	    }
	    // else
	    // {
	    // 	console.log('test_true');
	    // 	// alert('sdsd');
	    // }
	    // console.log('test');

	    this.loaderActive = true;
	    const sendData = new FormData();
	    sendData.append('loginUserId',this.loginUserId);
	    sendData.append('ic_id',this.formRecodEdit.value.ic_id);
	    sendData.append('product_type_id',this.formRecodEdit.value.product_type_id);
	    sendData.append('model_id',this.formRecodEdit.value.model_id);
		sendData.append('make_id',this.formRecodEdit.value.make_id);
	    sendData.append('variant',this.formRecodEdit.value.variant);
	    sendData.append('vehicle_fuel_id',this.formRecodEdit.value.vehicle_fuel_id);
	    sendData.append('business_partner_master_id',this.formRecodEdit.value.business_partner_master_id);
	    sendData.append('dp_id',this.formRecodEdit.value.dp_id);
	    sendData.append('od_zone',this.formRecodEdit.value.od_zone);
	    sendData.append('state_id',this.formRecodEdit.value.state_id);
	    sendData.append('city_id',this.formRecodEdit.value.city_id);
	    sendData.append('status',this.formRecodEdit.value.status);
	    sendData.append('zero_to_one',this.formRecodEdit.value.zero_to_one);
	    sendData.append('one_to_two',this.formRecodEdit.value.one_to_two);
	    sendData.append('two_to_three',this.formRecodEdit.value.two_to_three);
	    sendData.append('three_to_four',this.formRecodEdit.value.three_to_four);
	    sendData.append('four_to_five',this.formRecodEdit.value.four_to_five);
	    sendData.append('five_to_six',this.formRecodEdit.value.five_to_six);
	    sendData.append('six_to_seven',this.formRecodEdit.value.six_to_seven);
	    sendData.append('sevent_to_eight',this.formRecodEdit.value.sevent_to_eight);
	    sendData.append('eight_to_nine',this.formRecodEdit.value.eight_to_nine);
	    sendData.append('nine_to_ten',this.formRecodEdit.value.nine_to_ten);
	    sendData.append('ten_to_eleven',this.formRecodEdit.value.ten_to_eleven);
	    sendData.append('eleven_to_twelve',this.formRecodEdit.value.eleven_to_twelve);
	    sendData.append('twelve_to_thirteen',this.formRecodEdit.value.twelve_to_thirteen);
	    sendData.append('thirteen_to_fourteen',this.formRecodEdit.value.thirteen_to_fourteen);
	    sendData.append('fourteen_to_fifteen',this.formRecodEdit.value.fourteen_to_fifteen);

	    this.commonService.addOdDiscount(sendData).subscribe(response =>
	    {
	      	this.loaderActive = false;
	      	this.output_result = response;
	      	if(this.output_result.status)
	      	{
	        	this.runTable();
	          	this.closePopup();
		        this.closeAddExpenseModal.nativeElement.click();
		        // this.successNotify(this.output_result.message);
	         	// this.msgClass = "alert-success";
	         	this.responseMsg = this.output_result.message;
	          	Swal.fire({position: 'center',icon: 'success',title: this.responseMsg, showConfirmButton: false, timer: 3000 });
	      	}
	      	else
	      	{
	          	this.closePopup();
	          	// this.msgClass = "alert-danger";
	          	this.responseMsg = this.output_result.message;
	          	Swal.fire({position: 'center',icon: 'error',title: this.responseMsg, showConfirmButton: false, timer: 3000 });

	      	}
	    });
  	}

  	changeStatus(id,status){
	    var sendData = new FormData();
	    sendData.append('od_discount_id',id);
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
	      this.commonService.changeStatusByOdId(sendData)
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

  	resetForm(){
  		this.submitted = false;
  		this.formRecodEdit.patchValue({
  			ic_id : '',
	        product_type_id : '',
	        model_id : '',
			make_id : '',
	        variant : '',
	        vehicle_fuel_id : '',
	        business_partner_master_id : '',
	        dp_id : '',
	        status : '',
	        od_zone : '',
	        state_id : '',
	        city_id : '',
	        zero_to_one : '',
	        one_to_two : '',
	        two_to_three : '',
	        three_to_four : '',
	        four_to_five : '',
	        five_to_six : '',
	        six_to_seven : '',
	        sevent_to_eight : '',
	        eight_to_nine : '',
	        nine_to_ten : '',
	        ten_to_eleven : '',
	        eleven_to_twelve : '',
	        twelve_to_thirteen : '',
	        thirteen_to_fourteen : '',
	        fourteen_to_fifteen : '',
	        fifteen_to_sixteen : '',
	        sixteen_to_seventeen : ''
  		});
  	}
}
