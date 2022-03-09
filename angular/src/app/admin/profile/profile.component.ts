import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;


  constructor(private router: Router , private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      name : ['',Validators.required],
      mobile : ['',Validators.required],
      email : ['',Validators.required],
      address : ['',Validators.required]
      
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
