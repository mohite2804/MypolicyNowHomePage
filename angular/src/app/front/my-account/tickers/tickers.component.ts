import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router } from  '@angular/router';
import { environment } from '../../../../environments/environment';
@Component({
	selector: 'app-tickers',
	templateUrl: './tickers.component.html',
	styleUrls: ['./tickers.component.css']
})
export class TickersComponent implements OnInit {

	user_type : any;
	no_of_tickers : any;
	tickers_data : any;
	is_tickers : boolean = false;
	loginUserId : any;
	user_type_id : any;
	moviesArr : any;
	result :any;
	attachment_path : any;

	constructor(private http: HttpClient,  private router: Router,private commonService : CommonService) {

	}

	ngOnInit(): void {
		this.loginUserId = sessionStorage.getItem("adminUserId");
		this.user_type_id = sessionStorage.getItem("user_type_id");
		this.attachment_path = environment.baseUrl;
		console.log(this.moviesArr);
		if(this.user_type_id == '2'){
			this.user_type = 'pos'
		}
		else if(this.user_type_id == '5'){
			this.user_type = 'business-partner'
		}

		this.getTickerList(this.user_type);
	}


	getTickerList(user_type){
		var sendData = new FormData();
      	sendData.append('loginUserId',this.loginUserId);
      	sendData.append('user_type',user_type);
      	this.commonService.getTickerList(sendData)
      		.subscribe(response => {
        		this.result   = response;

        		if(this.result.status){
        			this.is_tickers = true;
          			this.no_of_tickers = this.result.Result_total_count;
          			this.tickers_data = this.result.Result;
          			console.log('tickers_data');
          			console.log(this.tickers_data);
        		}
        		else
        		{
        			this.is_tickers = false;
        		}
      	});

	}
}
