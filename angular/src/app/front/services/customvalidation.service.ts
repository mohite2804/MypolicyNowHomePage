import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl,ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }



  registrationNoValidatorForVahanSearch(group: FormGroup){

    let search_regi_no : any = group.get('search_regi_no').value;
    console.log('search_regi_no' + search_regi_no);
    if(search_regi_no){
      if(search_regi_no == "" || search_regi_no == null){
        return {
          errorRegistrationNoValidation : {
              text : 'Please enter valid registration number.'
          }
        }
      }else{
        return null;
      }
    }
  }


  atLeastOneAccessoriesValidator(group: FormGroup){
    let accessories : any = group.get('accessories').value;
    let accessories_electrical : any = group.get('accessories_electrical').value;
    let accessories_non_electrical : any = group.get('accessories_non_electrical').value;
    let bifuel_kit_idv : any = group.get('bifuel_kit_idv').value;

    if(accessories){
      if(
        (accessories_electrical == "" || accessories_electrical == null)
        &&
        (accessories_non_electrical == "" || accessories_non_electrical == null)
        &&
        (bifuel_kit_idv == "" || bifuel_kit_idv == null)
      ){
        return {
          atLeastOneFieldRequiredAccessories : {
              text : 'Please enter value at least one field.'
          }
        }
      }else{
        return null;
      }

    }
  }




  atLeastOnePACoverValidator(group: FormGroup){
    let pa_cover : any = group.get('pa_cover').value;
    let pa_unnamed_persons : any = group.get('pa_unnamed_persons').value;
    let ll_paid_driver : any = group.get('ll_paid_driver').value;

    let is_ll_conductor : any = group.get('is_ll_conductor').value;
    let no_of_conductor_ll : any = group.get('no_of_conductor_ll').value;

    if(pa_cover){
      if(!pa_unnamed_persons && !ll_paid_driver && !is_ll_conductor && !no_of_conductor_ll){
        return {
          atLeastOnePACoverValidator : {
              text : 'Please select at least one checkbox.'
          }
        }
      }else{
        return null;
      }

    }
  }


  atLeastOneDeductiblesValidator(group: FormGroup){
    let deductibles : any = group.get('deductibles').value;
    let deductibles_actitheft : any = group.get('deductibles_actitheft').value;
    let deductibles_automobile_association : any = group.get('deductibles_automobile_association').value;

    if(deductibles){
      if(!deductibles_actitheft && !deductibles_automobile_association){
        return {
          atLeastOneDeductiblesValidator : {
              text : 'Please select at least one checkbox.'
          }
        }
      }else{
        return null;
      }

    }
  }



  cannotContainZeroAndSpace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      var control_value : any = control.value.trim();
      if(control_value && control_value.replace(/^0+/, '') !== ""){
        return null;
      }
      return {cannotContainSpace: true}

    }
  }


  prePolicyExpireDateForTp(): ValidatorFn {
    var current :any = new Date();
    var month :any = current.getMonth()+1;
    month  = (month < 10 ? '0' : '') + month;

    var day :any = current.getDate();
    day  = (day < 10 ? '0' : '') + day;

    var current_date :any = current.getFullYear()+'-'+month+'-'+day;

    return (control: AbstractControl): { [key: string]: any } => {
      if(control.value != '' ){
        var input_date_convert =  new Date(control.value);

        var input_month :any = input_date_convert.getMonth()+1;
        input_month  = (input_month < 10 ? '0' : '') + input_month;

        var input_day :any = input_date_convert.getDate();
        input_day  = (input_day < 10 ? '0' : '') + input_day;


        var input_date :any = input_date_convert.getFullYear()+'-'+input_month+'-'+input_day;

        console.log('input_date');
        console.log(input_date);
        console.log('current_date');
        console.log(current_date);

        if (input_date < current_date ) {
          return { 'tpPolicyExpire': true };
        }

      }

      return null;
    };
  }

  appointeeAgeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 18 )) {
        return { 'appointeeAgeRange': true };
      }
      return null;
    };
  }


  nomineeAgeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 1 )) {
        return { 'nomineeAgeRange': true };
      }
      return null;
    };
  }

  registrationNoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 1 )) {
        return { 'registrationNoValidator': true };
      }
      return null;
    };
  }


  termsAndConditionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 1  )) {
        return { 'termsAndCondition': true };
      }
      return null;
    };
  }


  cannotContainSpace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      var control_value : any = control.value.trim();
      if(control_value && control_value.replace(/^0+/, '') !== ""){
        return null;
      }
      return {cannotContainSpace: true}

    }
  }

  cannotContainZero(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        var control_value : any = control.value.replace(' ', '');

        if ((control_value.replace(/^0+/, '') === "") && control_value !== undefined)
            return {cannotContainZero: true}
        }
        return null;

  }

  validateFileJpgPng(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        var ext :any = control.value.substring(control.value.lastIndexOf('.') + 1);
        if (ext.toLowerCase() != 'png' || ext.toLowerCase() != 'jpg' || ext.toLowerCase() != 'jpeg') {
            return {invalidImageType: true}
        }
        return null;
    }
  }


  checkNomineeAgeUsingRelation(group: FormGroup) {
    var nominee_relation : any = group.get('nominee_relation').value;
    var nominee_age : any = group.get('nominee_age').value;
    if(nominee_relation == 1 || nominee_relation == 2 || nominee_relation == 3 ){
      if(nominee_age < 18){
        return { nomineeAgeRangeUsingRelation: true } ;
      }
    }
    return null;
  }

  checkOwnerGstMatchWithPan(group: FormGroup){

      let gst_no : any = group.get('owner_gst').value;;
      let length_gst : any = gst_no.length;
      let pan_no : any = group.get('owner_pan').value;
      let length_pan_no : any = pan_no.length;

      if(length_gst > 14 && length_pan_no > 1){
        console.log("owner gst valid or not:- "+gst_no.includes(pan_no));
        let is_valid_gst_no =  gst_no.includes(pan_no)
        console.log("owner gst is_valid_gst_no or not:- "+is_valid_gst_no);

        if(!is_valid_gst_no){
          console.log("panNotMatchForOwner:- "+is_valid_gst_no);
          return { panNotMatchForOwner: true } ;
        }else{
          return null;
        }

      }

  }


  checkOwnerGstForIsuzuMatchWithPan(group: FormGroup){

    let gst_no : any = group.get('proposer_gst_no').value;;
    gst_no = gst_no.toLowerCase();



    let pan_no : any = group.get('proposer_pan_no').value;
    pan_no = pan_no.toLowerCase();

    let length_gst : any = gst_no.length;
    let length_pan_no : any = pan_no.length;

    if(length_gst > 14 && length_pan_no > 1){
      console.log("owner gst valid or not:- "+gst_no.includes(pan_no));
      let is_valid_gst_no =  gst_no.includes(pan_no)
      console.log("owner gst is_valid_gst_no or not:- "+is_valid_gst_no);

      if(!is_valid_gst_no){
        console.log("panNotMatchForOwner:- "+is_valid_gst_no);
        return { panNotMatchForOwner: true } ;
      }else{
        return null;
      }

    }else{
      return null ;
    }

}

  checkCompanyGstMatchWithPan(group: FormGroup){

    let gst_no : any = group.get('company_gst_no').value;
    gst_no = gst_no.toLowerCase();
    let length_gst : any = gst_no.length;
    let pan_no : any = group.get('company_pan_no').value;
    pan_no = pan_no.toLowerCase();
    let length_pan_no : any = pan_no.length;
    console.log('length_gst '+length_gst);
    console.log('length_pan_no '+length_pan_no);

    if(length_gst > 14 && length_pan_no > 1){
      console.log("company gst valid or not:- "+gst_no.includes(pan_no));
      let is_valid_gst_no =  gst_no.includes(pan_no)
      console.log("company gst is_valid_gst_no or not:- "+is_valid_gst_no);

      if(!is_valid_gst_no){
        console.log("panNotMatchForCompany:- "+is_valid_gst_no);
        return { panNotMatchForCompany: true } ;
      }else{
        return null ;
      }

    }else{
      return null ;
    }

  }

}
