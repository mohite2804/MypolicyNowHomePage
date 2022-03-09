import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;


  constructor(private router: Router , private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      confirmPassword : ['',Validators.required],
      password : ['',Validators.required]
    });
  }

  getFormData(){
    this.submitted = true;
    if(this.submitForm.invalid){
      return;
    }
    this.router.navigateByUrl('/admin');    
  }

}
