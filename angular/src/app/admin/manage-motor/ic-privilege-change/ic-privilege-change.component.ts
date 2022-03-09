
import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { TreeviewItem, TreeviewConfig} from 'ngx-treeview';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-ic-privilege-change',
  templateUrl: './ic-privilege-change.component.html',
  styleUrls: ['./ic-privilege-change.component.css']
})
export class IcPrivilegeChangeComponent implements OnInit {
  // ic_id : any;
  // product_type_id : any;

  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  divProducts : boolean  = true;
  divPaymentMethods : boolean  = false;
  divOthers : boolean  = false;
  loaderActive : boolean  = false;

  icId : any;
  productId : any;
  result: any;
  submitResult : any;
  tempUrlId : any;
  product_type : any;
  getProductTypes :any;

  submitted : boolean = false;
  getPaymentMethods: TreeviewItem[];
  getPolicySubTypes  : TreeviewItem[];
  selectedPaymentMethods: any;
  selectedSubTypeIds: any;

	formRecodEdit : any;

	other_new_policy : boolean = false;
	other_renewal_policy : boolean = false;
	other_electrical : boolean = false;
	other_electrical_with_oddiscount : boolean = false;
	other_nonelectrical : boolean = false;

	other_nonelectrical_with_discount : boolean = false;
	other_cng : boolean = false;
	other_cng_with_discount : boolean = false;
	other_geographical : boolean = false;
	other_geographical_split : boolean = false;

	other_antitheft : boolean = false;
	other_autoassociation : boolean = false;
	other_pa_paid_priver : boolean = false;
	other_pa_unnamed_person : boolean = false;
	other_ll_paid_driver : boolean = false;

	other_unnamed_person : boolean = false;
	other_breakin : boolean = false;
	other_thirdparty : boolean = false;
	other_custom_decline : boolean = false;
	other_addon_seg_avl : boolean = false;

	other_addon_isperc_avl : boolean = false;
	other_addon_statecity_avl : boolean = false;
	other_addon_panindia_avl : boolean = false;
	other_addon_cap_table : boolean = false;

	other_pa_cover_1year : boolean = false;
	other_pa_cover_3year  : boolean = false;
  other_pa_cover_5year: boolean = false;
  is_standalone: boolean = false;


	other_pa_owner_value_1year : any;
	other_pa_owner_value_3year : any;
	other_pa_owner_value_5year : any;
	other_pa_value : any;
	other_ll_value : any;
	other_age_upto : any;

  constructor(private customvalidationService : CustomvalidationService, private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.icId = this.activatedRoute.snapshot.paramMap.get('ic_id');
    this.productId = this.tempUrlId = this.activatedRoute.snapshot.paramMap.get('product_type_id');

    this.getIcPermissionChangeData();
    this.showProducts();
    this.setForm();
  }
  backPage(){
    this.router.navigate(['admin/manage-motor/ic-privilege/'+this.icId]);
  }

  setForm(){
    this.formRecodEdit = this.formBuilder.group({

			icId : ['',[Validators.required]],
			productTypeId : ['',[Validators.required]],

      payment_methods : ['',[Validators.required]],
      policy_subtype_ids : ['',[Validators.required]],

			other_new_policy : [''],
			other_renewal_policy : [''],
			other_electrical : [''],
			other_electrical_with_oddiscount : [''],
			other_nonelectrical : [''],

			other_nonelectrical_with_discount : [''],
			other_cng : [''],
			other_cng_with_discount : [''],
			other_geographical : [''],
			other_geographical_split : [''],

			other_antitheft : [''],
			other_autoassociation : [''],
			other_pa_paid_priver : [''],
			other_pa_unnamed_person : [''],
			other_ll_paid_driver : [''],

			other_unnamed_person : [''],
			other_breakin : [''],
			other_thirdparty : [''],
			other_custom_decline : [''],
			other_addon_seg_avl : [''],

			other_addon_isperc_avl : [''],
			other_addon_statecity_avl : [''],
			other_addon_panindia_avl : [''],
			other_addon_cap_table : [''],
			other_pa_owner_value_1year : [''],

			other_pa_owner_value_3year : [''],
			other_pa_owner_value_5year : [''],
			other_pa_value : [''],
			other_ll_value : [''],
			other_age_upto : [''],

      other_pa_cover_1year : [''],
			other_pa_cover_3year : [''],
      other_pa_cover_5year : [''],
      is_standalone : ['']

    	});
  }

  getIcPermissionChangeData(){
    this.loaderActive = true;
    let sendData = new FormData();
    sendData.append('icId',this.icId);
    sendData.append('productId',this.productId);
    this.commonService.getIcPermissionChangeData(sendData)
    .subscribe(response => {
      this.result= response;
        this.loaderActive = false;
          if(this.productId != 0){

            if(this.result.result){
              this.other_new_policy = (this.result.result.is_new_policy == '1') ? true : false;
              this.other_renewal_policy = (this.result.result.is_renewal_policy == '1') ? true : false;
              this.other_electrical = (this.result.result.is_electrical == '1') ? true : false;
              this.other_electrical_with_oddiscount = (this.result.result.is_electrical_with_oddiscount == '1') ? true : false;
              this.other_nonelectrical = (this.result.result.is_nonelectrical == '1') ? true : false;

              this.other_nonelectrical_with_discount = (this.result.result.is_nonelectrical_with_discount == '1') ? true : false;
              this.other_cng = (this.result.result.is_cng == '1') ? true : false;
              this.other_cng_with_discount = (this.result.result.is_cng_with_discount == '1') ? true : false;
              this.other_geographical = (this.result.result.is_geographical == '1') ? true : false;
              this.other_geographical_split = (this.result.result.is_geographical_split == '1') ? true : false;


              this.other_antitheft = (this.result.result.is_antitheft == '1') ? true : false;
              this.other_autoassociation = (this.result.result.is_autoassociation == '1') ? true : false;
              this.other_pa_paid_priver = (this.result.result.is_pa_paid_driver == '1') ? true : false;
              this.other_pa_unnamed_person = (this.result.result.is_pa_unnamed_person == '1') ? true : false;
              this.other_ll_paid_driver = (this.result.result.is_ll_paid_driver == '1') ? true : false;

              this.other_unnamed_person = (this.result.result.is_ll_unnamed_person == '1') ? true : false;
              this.other_breakin = (this.result.result.is_breakin == '1') ? true : false;
              this.other_thirdparty = (this.result.result.is_thirdparty == '1') ? true : false;
              this.other_custom_decline = (this.result.result.is_custom_decline == '1') ? true : false;
              this.other_addon_seg_avl = (this.result.result.addon_seg_avl == '1') ? true : false;

              this.other_addon_isperc_avl = (this.result.result.addon_isperc_avl == '1') ? true : false;
              this.other_addon_statecity_avl = (this.result.result.addon_statecity_avl == '1') ? true : false;
              this.other_addon_panindia_avl = (this.result.result.addon_panindia_avl == '1') ? true : false;
              this.other_addon_cap_table = (this.result.result.addon_cap_table == '1') ? true : false;

              this.other_pa_cover_1year = (this.result.result.is_pa_cover_1year == '1') ? true : false;
              this.other_pa_cover_3year = (this.result.result.is_pa_cover_3year == '1') ? true : false;
              this.other_pa_cover_5year = (this.result.result.is_pa_cover_5year == '1') ? true : false;
              this.is_standalone = (this.result.result.is_standalone == '1') ? true : false;


              this.other_pa_owner_value_1year = this.result.result.pa_owner_value_1year;
              this.other_pa_owner_value_3year = this.result.result.pa_owner_value_3year;
              this.other_pa_owner_value_5year = this.result.result.pa_owner_value_5year;

              this.other_pa_value = this.result.result.pa_value ;
              this.other_ll_value = this.result.result.ll_paid_diver_premium ;
              this.other_age_upto = this.result.result.age_upto ;





            }
            this.product_type = this.result.product_type;
          }else{
            this.getProductTypes = this.result.product_type;
          }
          this.getPaymentMethods = this.result.payment_methods;
          this.getPolicySubTypes = this.result.policy_sub_types;
          console.log(this.getPolicySubTypes);


          this.createPolicySubTypesTreeView();
          this.createPaymentMethodsTreeView();
        console.log('....................');
        console.log(this.getPaymentMethods);
        console.log(this.product_type);

    });
  }

  createPolicySubTypesTreeView(){
    var resultNew = [];
    this.getPolicySubTypes.forEach(item => {
        resultNew.push(new TreeviewItem(item))  ;
    });
    this.getPolicySubTypes = resultNew;

  }

  createPaymentMethodsTreeView(){
    var resultNew = [];
    this.getPaymentMethods.forEach(item => {
        resultNew.push(new TreeviewItem(item))  ;
    });
    this.getPaymentMethods = resultNew;

  }

  onFilterPaymentMethodsChange(value: string) {
    console.log('filter:', value);
  }

  onSelectedPaymentMethodsChange(selectedPaymentMethods) {
    this.selectedPaymentMethods = selectedPaymentMethods;
  }

  onFilterPolicySubTypeChange(value: string){
    console.log('filter:', value);
  }

  onSelectedPolicySubTypeChange(selectedSubTypeIds){
    console.log('selectedSubTypeIds: '+ selectedSubTypeIds);
    this.selectedSubTypeIds = selectedSubTypeIds;
  }




  changeProductType(event){
    console.log('inn'+event.target.value);
    this.productId = event.target.value;
    if(this.productId!=0){
      this.loaderActive = true;
      let sendData = new FormData();
      sendData.append('icId',this.icId);
      sendData.append('productId',this.productId);
     
      this.commonService.getIcPermissionChangeData(sendData)
      .subscribe(response => {
        this.result= response;
          this.loaderActive = false;
            if(this.productId != 0){
              this.getPolicySubTypes = this.result.policy_sub_types;
              console.log(this.getPolicySubTypes);
              this.createPolicySubTypesTreeView();
            }
      });
    }else{
      this.getPolicySubTypes = [];
      console.log(this.getPolicySubTypes);
      this.createPolicySubTypesTreeView();
    }
  }



  submitForm(){
    this.submitted = true;
    if(this.productId==0){
      Swal.fire ("Please Select Product",  "" ,  "error" );
      return;
    }
    if(this.selectedSubTypeIds==''){
      Swal.fire ("Please Select Policy Sub type",  "" ,  "error" );
      return;
    }
    if(this.selectedPaymentMethods==''){
      Swal.fire ("Please Select Payment",  "" ,  "error" );
      return;
    }
    console.log('selectedSubTypeIds........ :- '+this.selectedSubTypeIds);
    this.loaderActive = true;
    this.formRecodEdit.patchValue({
        icId : this.icId,
        productTypeId : this.productId,
        payment_methods : this.selectedPaymentMethods,
        policy_subtype_ids : this.selectedSubTypeIds,


        other_new_policy : this.other_new_policy,
        other_renewal_policy : this.other_renewal_policy,
        other_electrical : this.other_electrical,
        other_electrical_with_oddiscount : this.other_electrical_with_oddiscount,
        other_nonelectrical : this.other_nonelectrical,


        other_nonelectrical_with_discount : this.other_nonelectrical_with_discount,
        other_cng : this.other_cng,
        other_cng_with_discount : this.other_cng_with_discount,
        other_geographical : this.other_geographical,
        other_geographical_split : this.other_geographical_split,

        other_antitheft : this.other_antitheft,
        other_autoassociation : this.other_autoassociation,
        other_pa_paid_priver : this.other_pa_paid_priver,
        other_pa_unnamed_person : this.other_pa_unnamed_person,
        other_ll_paid_driver : this.other_ll_paid_driver,


        other_unnamed_person : this.other_unnamed_person,
        other_breakin : this.other_breakin,
        other_thirdparty : this.other_thirdparty,
        other_custom_decline : this.other_custom_decline,
        other_addon_seg_avl : this.other_addon_seg_avl,


        other_addon_isperc_avl : this.other_addon_isperc_avl,
        other_addon_statecity_avl : this.other_addon_statecity_avl,
        other_addon_panindia_avl : this.other_addon_panindia_avl,
        other_addon_cap_table : this.other_addon_cap_table,


        other_pa_cover_1year : this.other_pa_cover_1year,
        other_pa_cover_3year : this.other_pa_cover_3year,
        other_pa_cover_5year : this.other_pa_cover_5year,

        is_standalone : this.is_standalone,



        other_pa_owner_value_1year : this.other_pa_owner_value_1year,
        other_pa_owner_value_3year : this.other_pa_owner_value_3year,
        other_pa_owner_value_5year : this.other_pa_owner_value_5year,

        other_pa_value : this.other_pa_value,
        other_ll_value : this.other_ll_value,
        other_age_upto : this.other_age_upto,



    });
    console.log('this.formRecodEdit.value.........');
    console.log(this.formRecodEdit.value);
    var sendData = new FormData();

    sendData.append('productTypeId',this.formRecodEdit.value.productTypeId);
    sendData.append('icId',this.formRecodEdit.value.icId);

    sendData.append('payment_methods',this.formRecodEdit.value.payment_methods);
    sendData.append('policy_subtype_ids',this.formRecodEdit.value.policy_subtype_ids);

    sendData.append('other_new_policy',this.formRecodEdit.value.other_new_policy);
    sendData.append('other_renewal_policy',this.formRecodEdit.value.other_renewal_policy);
    sendData.append('other_electrical',this.formRecodEdit.value.other_electrical);
    sendData.append('other_electrical_with_oddiscount',this.formRecodEdit.value.other_electrical_with_oddiscount);
    sendData.append('other_nonelectrical',this.formRecodEdit.value.other_nonelectrical);

    sendData.append('other_nonelectrical_with_discount',this.formRecodEdit.value.other_nonelectrical_with_discount);
    sendData.append('other_cng',this.formRecodEdit.value.other_cng);
    sendData.append('other_cng_with_discount',this.formRecodEdit.value.other_cng_with_discount);
    sendData.append('other_geographical',this.formRecodEdit.value.other_geographical);
    sendData.append('other_geographical_split',this.formRecodEdit.value.other_geographical_split);

    sendData.append('other_antitheft',this.formRecodEdit.value.other_antitheft);
    sendData.append('other_autoassociation',this.formRecodEdit.value.other_autoassociation);
    sendData.append('other_pa_paid_priver',this.formRecodEdit.value.other_pa_paid_priver);
    sendData.append('other_pa_unnamed_person',this.formRecodEdit.value.other_pa_unnamed_person);
    sendData.append('other_ll_paid_driver',this.formRecodEdit.value.other_ll_paid_driver);

    sendData.append('other_unnamed_person',this.formRecodEdit.value.other_unnamed_person);
    sendData.append('other_breakin',this.formRecodEdit.value.other_breakin);
    sendData.append('other_thirdparty',this.formRecodEdit.value.other_thirdparty);
    sendData.append('other_custom_decline',this.formRecodEdit.value.other_custom_decline);
    sendData.append('other_addon_seg_avl',this.formRecodEdit.value.other_addon_seg_avl);

    sendData.append('other_addon_isperc_avl',this.formRecodEdit.value.other_addon_isperc_avl);
    sendData.append('other_addon_statecity_avl',this.formRecodEdit.value.other_addon_statecity_avl);
    sendData.append('other_addon_panindia_avl',this.formRecodEdit.value.other_addon_panindia_avl);
    sendData.append('other_addon_cap_table',this.formRecodEdit.value.other_addon_cap_table);
    sendData.append('other_pa_owner_value_1year',this.formRecodEdit.value.other_pa_owner_value_1year);

    sendData.append('other_pa_owner_value_3year',this.formRecodEdit.value.other_pa_owner_value_3year);
    sendData.append('other_pa_owner_value_5year',this.formRecodEdit.value.other_pa_owner_value_5year);
    sendData.append('other_pa_value',this.formRecodEdit.value.other_pa_value);
    sendData.append('other_ll_value',this.formRecodEdit.value.other_ll_value);
    sendData.append('other_age_upto',this.formRecodEdit.value.other_age_upto);


    sendData.append('other_pa_cover_1year',this.formRecodEdit.value.other_pa_cover_1year);
    sendData.append('other_pa_cover_3year',this.formRecodEdit.value.other_pa_cover_3year);
    sendData.append('other_pa_cover_5year',this.formRecodEdit.value.other_pa_cover_5year);
    sendData.append('is_standalone',this.formRecodEdit.value.is_standalone);

    console.log('sendData');
    console.log(sendData);
    console.log('sendData');
    this.commonService.submitIcChangePermission(sendData)
      .subscribe(response => {
          this.submitResult = response;
          this.loaderActive = false;
        if(this.submitResult.status){
            Swal.fire(this.submitResult.message, '', "success");

            //this.router.navigate(['admin/manage-common/insurance-companies/permission/'+this.icId]);

            this.router.navigate(['admin/manage-motor/ic-privilege/'+this.icId]);

            //
        }else{
            Swal.fire (this.submitResult.message,  "" ,  "error" );
        }
          console.log(this.submitResult);
      });
      console.log(this.formRecodEdit);
  }



  showProducts(){
    this.divProducts = true;
    this.divPaymentMethods = false;
    this.divOthers = false;
  }


  showPaymentMethods(){
    this.divProducts = false;
    this.divPaymentMethods = true;
    this.divOthers = false;
  }


  showOther(){
    this.divProducts = false;
    this.divPaymentMethods = false;
    this.divOthers = true;

  }






}
