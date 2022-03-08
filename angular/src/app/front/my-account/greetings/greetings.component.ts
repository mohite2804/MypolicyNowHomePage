import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router,Params} from  '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.css']
})
export class GreetingsComponent implements OnInit {

	result : any;
	loaderActive: boolean = false;
	loginUserId  : any;
	token  : any;
	greetingImages :any;
	greetingCreativeImages :any;

  currentTimeInMilliseconds : any;
  	constructor(private commonService: CommonService,public router: Router) { }

  	ngOnInit(): void {


  		this.loginUserId = sessionStorage.getItem("user_id");
    	this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.currentTimeInMilliseconds=new Date().toLocaleString();


      this.getIndex();
  	}

    redirectToCreativePage(row){
      this.router.navigate(["/my-account/creative/"+row.new_id]);
    }

    getIndex(){
      this.loaderActive = true;
      this.commonService.getGreetingImagesData(this.loginUserId)
      .subscribe((response) => {
        this.loaderActive = false;
            var result : any = response;
            this.greetingImages = result.result;
            this.greetingCreativeImages = result.result_creative;
            console.log('start');
            console.log(result.result_creative);
            console.log('end');

        });

    }

	validateUserLoginStatus(loginUserId,token){
		this.loaderActive = true;
		let uploadData = new FormData();

		uploadData.append('loginUserId',this.loginUserId);
		uploadData.append('token',token);

		this.commonService.validateUserLoginStatus(uploadData)
		.subscribe(response => {
			this.result = response;
			//this.loaderActive = false;
			if(this.result.status){
				//valid status i.e. not login from another location
			}else{
				Swal.fire({
					title: 'error',
					html: 'It seems that you have login from another location. You are logged out from this session?',
					timer: 3500
				}).then((result) => {
					this.router.navigate(['/login']);
				});
			}
		});
	}




}
