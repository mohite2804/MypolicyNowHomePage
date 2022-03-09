import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;


  constructor(private router: Router , private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      OldPassword : ['',Validators.required],
      password : ['',Validators.required],
      confirmPassword : ['',Validators.required]
      
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
