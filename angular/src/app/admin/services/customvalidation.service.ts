import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }




  irdaCommissionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 1 )) {
        return { 'irdaCommissionValidator': true };
      }
      return null;
    };
  }



}
