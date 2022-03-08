import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,FormArray, Validators, AbstractControl } from  '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  image_url_label : any;
  image_url : any;
  loaderActive : boolean =  false;
  formUpdate : any;
  submittedForm  : boolean =  false;
  loginUserId  : any;
  loginUserType  : any;
  constructor(private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');

    this.validationForm();
  }

  validationForm(){
    this.formUpdate = this.formBuilder.group({
       pro_image : ['',[Validators.required]],

    });
  }


  uploadProfile(event){

    var file :any = event.target.files[0];
    var file_type:any = file.type;
    var file_size :any = file.size ;


    if(file_type.toLowerCase() != 'image/jpeg' && file_type.toLowerCase() != 'image/png' && file_type.toLowerCase() != 'image/jpg' && file_type.toLowerCase() != 'application/pdf'){
      Swal.fire ("Please Select 'jpg', 'png', 'jpeg', 'pdf' file",  "" ,  "error" );
      this.image_url = "";

    }else if(file_size > 5242880){
      Swal.fire ("Please Select below 5 mb image.",  "" ,  "error" );
      this.image_url = "";
    }else{

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.image_url = event.target.result;
      }
      this.image_url_label = file.name;
      this.formUpdate.patchValue({
        'pro_image' : file
      });


    }


  }


  submitForm(){
    this.submittedForm = true;
    if(this.formUpdate.invalid){
      return;
    }
    this.loaderActive = true;

    let uploadData = new FormData();
    uploadData.append('loginUserId',this.loginUserId);
    uploadData.append('loginUserType',this.loginUserType);
    uploadData.append('pro_image',this.formUpdate.value.pro_image);

    this.commonService.submitFormProfileImage(uploadData)
    .subscribe(response => {
        this.loaderActive = false;
        var outputResult : any = response;
        if(outputResult.status){
          //Swal.fire (outputResult.message,  "" ,  "success" );
          sessionStorage.setItem('pro_image', outputResult.pro_image);
          sessionStorage.setItem('public_path', outputResult.public_path);

          Swal.fire({position: 'center',icon: 'success',title: outputResult.message, showConfirmButton: false, timer: 3000 })
          .then((result) => {
            location.reload();
          });



        }else{
          Swal.fire (outputResult.message,  "" ,  "error" );
        }
    });
  }

}
