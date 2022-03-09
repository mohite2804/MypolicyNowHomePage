import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';


@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.css']
})
export class ThemeSettingComponent implements OnInit {

  submitForm: FormGroup;
  submitted : boolean =  false;


  constructor(private router: Router , private formBuilder : FormBuilder) { }

  @Output() topBarColor = new EventEmitter<string>();
  ngOnInit(): void {
    this.submitForm = this.formBuilder.group({
      //topBarColor : ['',Validators.required],
      // sideBarColor : ['',Validators.required],
      // sidebarTextColor : ['',Validators.required],
      // logoBackgroundColor : ['',Validators.required],      
      // sideBarActiveTabColor : ['',Validators.required]
      topBarColor : [''],
      sideBarColor : [''],
      sidebarTextColor : [''],
      logoBackgroundColor : [''],      
      sideBarActiveTabColor : ['']
      
    });
  }

  getFormData(){
    this.submitted = true;
    if(this.submitForm.invalid){
      return;
    }

    console.log("navbar-danger.......................");
    //this.topBarColor.emit(this.submitForm.value.topBarColor);
    this.topBarColor.emit("navbar-danger");

    
    //console.log(this.submitForm.value);
    //this.router.navigateByUrl('/admin');    
  }

}
