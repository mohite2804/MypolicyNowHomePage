import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;
  constructor(private router: Router , private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      email : ['',Validators.required]      
    });
  }

  getFormData(){
    this.submitted = true;
    if(this.submitForm.invalid){
      return;
    }
    this.router.navigateByUrl('/admin/change-password');    
  }

}
