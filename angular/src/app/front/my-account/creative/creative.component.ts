import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router,Params} from  '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added


import Swal from 'sweetalert2';

@Component({
  selector: 'app-creative',
  templateUrl: './creative.component.html',
  styleUrls: ['./creative.component.css']
})
export class CreativeComponent implements OnInit {
    validation_for_mobile_no :any = "^[6-9][0-9]{9}$";
    validation_for_name_with_space :any = "^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$";


    formRecodEdit : any;
    submitted : boolean = false;
    loaderActive : boolean =  false;
    btnEditSubmit : boolean = false;
    creativeData  : any;
    editResult : any;
    msgClass  : any;
    loginUserId  : any;
    responseMsg   : any;
    id: string;

  greeting_id :any;
  	constructor(private commonService: CommonService,public router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder) { }

  	ngOnInit(): void {
      this.loginUserId = sessionStorage.getItem('user_id');
      this.greeting_id=this.route.snapshot.paramMap.get('id');



      this.validationForm();
      this.getIndex();
  	}

    validationForm(){
      this.formRecodEdit = this.formBuilder.group({
	      id :0,
	      name :['',[Validators.required,Validators.pattern(this.validation_for_name_with_space)]],
	      company :['',[Validators.required,Validators.pattern(this.validation_for_name_with_space)]],
	      phone : ['',[Validators.required,Validators.pattern(this.validation_for_mobile_no)]]
      });
    }

    getIndex(){

      this.loaderActive = true;
      var sendData = new FormData();
      sendData.append('greeting_id', this.greeting_id);
      this.commonService.getCreativeImagesData(sendData)
      .subscribe((response) => {
        this.loaderActive = false;
           var result : any = response;
           this.creativeData = result.result;
       });
    }

  submitForm(){
    console.log('submit');
      this.submitted = true;
      if(this.formRecodEdit.invalid){
        console.log(this.formRecodEdit);
        return;
      }
      this.loaderActive = true;
      const sendData = new FormData();
      sendData.append('greeting_id',this.route.snapshot.paramMap.get('id'));
      sendData.append('name',this.formRecodEdit.value.name);
      sendData.append('company',this.formRecodEdit.value.company);
      sendData.append('phone',this.formRecodEdit.value.phone);
      sendData.append('loginUserId',this.loginUserId);
      this.commonService.getCreativeImagesDataSubmit(sendData)
      .subscribe(response =>{
        this.loaderActive = false;
        this.editResult = response;
        if(this.editResult.status){
            this.router.navigate(["/my-account/generate-creative/"+this.greeting_id]);
            this.msgClass = "alert-success";
            this.responseMsg = this.editResult.message;
        }else{
            this.msgClass = "alert-danger";
            this.responseMsg = this.editResult.message;
        }
  });
}



}
