import { Component, OnInit,Renderer2, ViewChild} from '@angular/core';
import { TreeviewItem, TreeviewConfig} from 'ngx-treeview';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { CustomvalidationService } from '../../services/customvalidation.service';

import { FormBuilder, FormGroup,FormArray,FormControl, Validators } from  '@angular/forms';

import { Router,ActivatedRoute} from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail-privilege',
  templateUrl: './detail-privilege.component.html',
  styleUrls: ['./detail-privilege.component.css']
})
export class DetailPrivilegeComponent implements OnInit {

  base_url = environment.baseUrl;
  
  loginUserId : any;
  id : any;
  table : any;
  name : any;


  resultNew : any;

  result_giib_users : any;
  result_bp_users : any;
  formDetails : any;
  submittedForm : boolean = false;


  result_ic_tree: TreeviewItem[];
  result_product_tree: TreeviewItem[];
  // result_bp_tree: TreeviewItem[];
  result_bp_tree: any;



  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  selectedProductIds : any;
  selectedIcIds : any;
  
  selectedProduct :  Array <any> ;
  selectedIc : Array <any> ;
  selectedPayment : Array <any> ;
  selectedSubProduct : Array <any> ;
  selectedSubSubProduct : Array <any> ;
  selectedSubSubProductval : Array <any> ;

  loaderActive : boolean =  false;

  validation_for_commission :any = "^[0-9]{1,2}$";

  selectedIc_error : any;
  selectedPayment_error : any;
  selectedProduct_error : any;
  selectedSubProduct_error : any;
  selectedSubSubProduct_error : any;
  selectedSubSubProductval_error : any;

  tab_hide_for_dp : boolean =  false;
  tab_hide_for_sdp : boolean =  false;


  selectedGiibUserId : any;

  selectedBpUserId : any;
  dp_name : any;
  misp_name : any;

  is_isuzu  : any;

  constructor(private customvalidationService : CustomvalidationService, private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder) { 
    this.is_isuzu = sessionStorage.getItem("is_isuzu");
  }


  ngOnInit(): void {
    this.name = "";

    this.result_giib_users = '';
    this.result_bp_users = '';
    this.loginUserId = sessionStorage.getItem("adminUserId");
    this.id =  this.activatedRoute.snapshot.paramMap.get('id');
    this.table =  this.activatedRoute.snapshot.paramMap.get('table');

    this.validateForm();
    this.getIndex();
    this.dp_name='POS';
    this.misp_name='Business Partner';
    if(this.is_isuzu==1){
      this.dp_name='DP';
      this.misp_name='MISP';
    }
  }

  
  changeSelectBox(form_control_name,selected_value){
    console.log("selected Value "+selected_value);
    if(selected_value){
      switch (form_control_name) {
        case 'giib_user_id':
          this.formDetails.patchValue({giib_user_id : selected_value });
          break;

        case 'bp_user_id':
          this.formDetails.patchValue({bp_user_id : selected_value });
          break;
      }
    }
  }

  clearValue(form_control_name,selected_value){
    switch (form_control_name) {

      case 'giib_user_id':
        this.formDetails.patchValue({giib_user_id : '' });
        this.selectedGiibUserId = "";
        break;

      case 'bp_user_id':
        this.formDetails.patchValue({bp_user_id : '' });
        this.selectedBpUserId = "";
        break;

    }
  }
  

  validateForm(){
    this.formDetails = this.formBuilder.group({
      id : [this.id,Validators.required],
      table : [this.table,Validators.required],
      selectedIcIds : [''],
      selectedProductIds : [''],
      giib_user_id : [''],
      bp_user_id : [''],
      selectedIc: this.formBuilder.array([]),
      selectedPayment: this.formBuilder.array([]),
      selectedProduct: this.formBuilder.array([]),
      selectedSubProduct: this.formBuilder.array([]),
      selectedSubSubProduct: this.formBuilder.array([]),
      selectedSubSubProductval: this.formBuilder.array([]),
    });

  }

  setFormDetails(result){
 
    this.selectedGiibUserId = result.giib_user_id;
    this.selectedBpUserId = result.bp_user_id;
    this.selectedIc = result.online_payment_ic_ids.split(',');
    this.selectedPayment = result.selected_ic_payment_ids.split(',');
    this.selectedProduct = result.new_comprehensive_product_ids.split(',');
    this.selectedSubProduct = result.selected_sub_product.split(',');
    this.selectedSubSubProduct = result.selected_product_policytype_policysub_ids_backend.split(',');
    this.selectedSubSubProductval = result.selected_product_comm_val.split(',');   
    this.formDetails.patchValue({
      id : this.id,
      table : this.table,
      selectedProductIds : result.selected_product_policytype_policysub_ids_backend,
      selectedIcIds : result.selected_ic_payment_ids,

      giib_user_id : result.giib_user_id,
      bp_user_id : result.bp_user_id,

    });
    
    if(this.tab_hide_for_dp){
      this.formDetails.get("giib_user_id").setValidators([]);
      this.formDetails.get("giib_user_id").updateValueAndValidity();

      this.formDetails.get("bp_user_id").setValidators([]);
      this.formDetails.get("bp_user_id").updateValueAndValidity();

    }
  }

  setFormDetails_pos(result,resulted){
    this.selectedGiibUserId = result.giib_user_id;
    this.selectedBpUserId = result.bp_user_id;
    this.selectedIc = result.online_payment_ic_ids.split(',');
    this.selectedPayment = result.selected_ic_payment_ids.split(',');
    this.selectedProduct = result.new_comprehensive_product_ids.split(',');
    this.selectedSubProduct = resulted.selected_sub_product.split(',');
    this.selectedSubSubProduct = result.selected_product_policytype_policysub_ids_backend.split(',');
    this.selectedSubSubProductval = resulted.selected_product_comm_val.split(',');   
    //alert(this.selectedSubSubProduct);
    this.formDetails.patchValue({
      id : this.id,
      table : this.table,
      selectedProductIds : result.selected_product_policytype_policysub_ids_backend,
      selectedIcIds : result.selected_ic_payment_ids,

      giib_user_id : result.giib_user_id,
      bp_user_id : result.bp_user_id,

    });
    
    if(this.tab_hide_for_dp){
      this.formDetails.get("giib_user_id").setValidators([]);
      this.formDetails.get("giib_user_id").updateValueAndValidity();

      this.formDetails.get("bp_user_id").setValidators([]);
      this.formDetails.get("bp_user_id").updateValueAndValidity();

    }
  }

  getIndex(){

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',this.id);
    sendData.append('table',this.table);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.getDetailsPrivilegeMisp(sendData)
      .subscribe( response => {
        var output_data: any = response;
        if(output_data.status){
          this.loaderActive = false;
          this.result_bp_tree  =  output_data.result.ic_master;
          
          console.log("result_bp_tree");
           console.log(this.result_bp_tree);
           console.log("result_bp_tree");

          this.result_bp_users = output_data.business_partner_users;
          this.result_giib_users = output_data.giib_users;
          if(output_data.result.name){
            this.name = output_data.result.name;
          }
          //alert(output_data.table);
          if(output_data.table == 'business_partner_master'){
            if (output_data.result.partner_privilege) {
              this.setFormDetails(output_data.result.partner_privilege);
            }
          }else if(output_data.table =='pos_master')
          {
            if (output_data.result.pos_partner_privilege) {
              //alert(output_data.result.pos_partner_privilege.selected_ic_payment_ids);
              this.setFormDetails_pos(output_data.result.pos_partner_privilege,output_data.result.partner_privilege);
            }
          }
console.log(this.formDetails.controls.selectedIc);
          let checkArray = <FormArray>this.formDetails.controls.selectedIc;
          this.selectedIc.forEach(row => {
            checkArray.push(new FormControl(row));
          });
          console.log("checkArray");
          console.log(checkArray);
          console.log("checkArray");
          let checkArrayA = <FormArray>this.formDetails.controls.selectedPayment;
          this.selectedPayment.forEach(row => {
            checkArrayA.push(new FormControl(row));
          });
          
          let checkArray2 = <FormArray>this.formDetails.controls.selectedProduct;
          this.selectedProduct.forEach(row => {
            checkArray2.push(new FormControl(row));
          });
          
          let checkArray3 = <FormArray>this.formDetails.controls.selectedSubProduct;
          this.selectedSubProduct.forEach(row => {
            checkArray3.push(new FormControl(row));
          });
           console.log(this.formDetails.controls.selectedSubSubProduct);
          //console.log(checkArray4);
           let checkArray4 = <FormArray>this.formDetails.controls.selectedSubSubProduct;
          //let checkArray4 = this.formDetails.controls.selectedSubSubProduct;
          this.selectedSubSubProduct.forEach(row => {
              checkArray4.push(new FormControl(row));
          });
          
          let checkArray5 = <FormArray>this.formDetails.controls.selectedSubSubProductval;
          this.selectedSubSubProductval.forEach(row => {
              checkArray5.push(new FormControl(row));
          });
          //console.log(this.formDetails.controls.selectedProduct);
          //console.log(this.formDetails.controls.selectedSubProduct);
          console.log(this.formDetails.controls.selectedSubSubProduct);
          console.log(checkArray4);
          //console.log(this.formDetails.controls.selectedSubSubProductval);
        }else{
        }
    });
  }


  backToBusinessPartner(){
     this.router.navigate(['admin/manage-common/business-partner']);
  }

  backToSUBPOS(){

     this.router.navigate(['admin/manage-common/sub-pos']);
  }

  backToPOS(){
    console.log("this.id:-"+this.id);
    console.log("this.table:-"+this.table);
     this.router.navigate(['admin/manage-common/pos/'+this.id+'/'+this.table]);

  }


  onSelectedIcIdsChange(event){
    console.log(event);
    var selected_val = '';
    selected_val += event.target.value;
    console.log(selected_val);
    // this.formDetails.patchValue({ selectedIcIds : value });
    this.selectedIcIds = selected_val;

  }

  onSelectedProductPolicyPolicySubtypeIdsChange(value){
    this.formDetails.patchValue({ selectedProductIds : value });
    this.selectedProductIds = value;
  }
  checkCommissionNewPolicy(value){
    // if(parseInt(this.formDetails.value.new_commission) > parseInt(this.irda_new_commission)){
      // this.new_commission_error = "error";
    // }else{
      // this.new_commission_error = "";
    // }
  }
  checkCommissionRenewPolicy(value){
    // if(parseInt(this.formDetails.value.renew_commission) > parseInt(this.irda_renew_commission)){
      // this.renew_commission_error = "error";
    // }else{
      // this.renew_commission_error = "";
    // }
  }


  categoryChange(event, cat, sub) {
    sub.selected = event.target.checked;
    console.log(sub.selected);
  }
  onICIDChange(e) {
    const checkArray: FormArray = this.formDetails.get('selectedIc') as FormArray;
    if (e.target.checked) {
        $(this).parents('li').children('input[type=checkbox]').prop('checked',true);
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  
  onPaymentChange(e) {
    const checkArrayA: FormArray = this.formDetails.get('selectedPayment') as FormArray;
    if (e.target.checked) {
      checkArrayA.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArrayA.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArrayA.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  
  onProductChange(e) {
    const checkArray2: FormArray = this.formDetails.get('selectedProduct') as FormArray;
    if (e.target.checked) {
      checkArray2.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray2.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray2.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onSubProductChange(e) {
  //  alert("hii");
    const checkArray3: FormArray = this.formDetails.get('selectedSubProduct') as FormArray;
    if (e.target.checked) {
      checkArray3.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray3.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray3.removeAt(i);
          return;
        }
        i++;
      });
    }
     console.log(checkArray3);
  }
  onSubSubProductChange(e) {
   // alert("hey");
    const checkArray4: FormArray = this.formDetails.get('selectedSubSubProduct') as FormArray;
    if (e.target.checked) {
      checkArray4.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray4.controls.forEach((item: FormControl) => {
       // console.log(item.value);
        if (item.value.includes(e.target.value) /*== e.target.value*/) {
          checkArray4.removeAt(i);
          return;
        }
        i++;
      });
    }
    //console.log(checkArray4);
  }
  onSubSubProductValChange(e) {
    const checkArray5: FormArray = this.formDetails.get('selectedSubSubProductval') as FormArray;
    if(e.target.value!=0 && (e.target.value!='')){
      checkArray5.push(new FormControl(e.target.value));
    }else{
      let i: number = 0;
      checkArray5.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray5.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  submitForm(){
    this.selectedIc_error = "";
    this.selectedPayment_error = "";
    this.selectedProduct_error = "";
    this.selectedSubProduct_error = "";
    this.selectedSubSubProduct_error = "";
    this.selectedSubSubProductval_error = "";
    
    this.submittedForm = true;
    
    if(this.formDetails.invalid){
      return;
    }
    //alert(this.formDetails.value.selectedIc.length);
    if(this.formDetails.value.selectedIc.length===0){
      Swal.fire ("Please Select IC",  "" ,  "error" );
      this.selectedIc_error = "error";
      return;
    }
    if(this.formDetails.value.selectedPayment.length===0){
      Swal.fire ("Please Select Payment",  "" ,  "error" );
      this.selectedPayment_error = "error";
      return;
    }
    if(this.formDetails.value.selectedProduct.length===0){
      Swal.fire ("Please Select Product",  "" ,  "error" );
      this.selectedProduct_error = "error";
      return;
    }
    if(this.formDetails.value.selectedSubProduct.length===0){
      Swal.fire ("Please Select Policy Type",  "" ,  "error" );
      this.selectedSubProduct_error = "error";
      return;
    }
    if(this.formDetails.value.selectedSubSubProduct.length===0){
      Swal.fire ("Please Select Policy Sub Type",  "" ,  "error" );
      this.selectedSubSubProduct_error = "error";
      return;
    }
    
   // console.log(this.formDetails.value.selectedIc);
    //console.log(this.formDetails.value.selectedPayment);
    //console.log(this.formDetails.value.selectedProduct);
    //console.log(this.formDetails.value.selectedSubProduct);
    console.log(this.formDetails.value.selectedSubSubProduct);
    //console.log(this.formDetails.value.selectedSubSubProductval);

    if((this.formDetails.value.selectedIc.length>0) && (this.formDetails.value.selectedPayment.length>0) && (this.formDetails.value.selectedProduct.length>0) && (this.formDetails.value.selectedSubProduct.length>0) && (this.formDetails.value.selectedSubSubProduct.length>0)){
      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('id',this.id);
      sendData.append('table',this.table);
      sendData.append('selectedIc',this.formDetails.value.selectedIc);
      sendData.append('selectedPayment',this.formDetails.value.selectedPayment);
      sendData.append('selectedProduct',this.formDetails.value.selectedProduct);
      sendData.append('selectedSubProduct',this.formDetails.value.selectedSubProduct);
      sendData.append('selectedSubSubProduct',this.formDetails.value.selectedSubSubProduct);
      sendData.append('selectedSubSubProductval',this.formDetails.value.selectedSubSubProductval);
      
      //console.log(sendData);

      this.commonService.submitPrivileges(sendData)
      .subscribe( response => {
          var output_data: any = response;
          this.loaderActive = false;
          if(output_data.status){
            Swal.fire(output_data.message, '', "success");
          }else{
            Swal.fire (output_data.message,  "" ,  "error" );
          }

      });
    }
    
  }

  submitForm122(){
    // this.new_commission_error = "";
    // this.renew_commission_error = "";

    console.log(this.formDetails);
    this.submittedForm = true;
    if(this.formDetails.invalid){
      return;
    }


   /*  if(parseInt(this.formDetails.value.new_commission) > parseInt(this.irda_new_commission)){
      this.new_commission_error = "error";
      return;
    }

    if(parseInt(this.formDetails.value.renew_commission) > parseInt(this.irda_renew_commission)){
      this.renew_commission_error = "error";
      return;
    } */

    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('id',this.id);
    sendData.append('table',this.table);

    sendData.append('selectedIcIds',this.selectedIcIds);
    sendData.append('selectedProductIds',this.selectedProductIds);
    // sendData.append('new_commission',this.formDetails.value.new_commission);
    // sendData.append('renew_commission',this.formDetails.value.renew_commission);

    sendData.append('giib_user_id',this.formDetails.value.giib_user_id);
    sendData.append('bp_user_id',this.formDetails.value.bp_user_id);

    console.log(sendData);

     this.commonService.submitPrivileges(sendData)
     .subscribe( response => {
        var output_data: any = response;
        this.loaderActive = false;
        if(output_data.status){
          Swal.fire(output_data.message, '', "success");
        }else{
          Swal.fire (output_data.message,  "" ,  "error" );
        }

     });
  }


}
