import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router,Params} from  '@angular/router';
import Swal from 'sweetalert2';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType,Chart} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	result : any;
	loaderActive: boolean = false;
	loginUserId  : any;
	token  : any;
	date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  currentTimeInMilliseconds : any;
  from: any;
  todate : any;
  formRecodEdit: any;
  results : any;
  public lineChartLabels : any;
  public lineChartOptions:any;
  public lineChartColors: any;
  public lineChartLegend :any;
  public lineChartType:any;
  public lineChartPlugins:any;
  lineChartData:any;
  chartDataSets:any;
  chartType:any;
  chartOptions:any;
  color:any;

 


  
  	constructor(private datePipe: DatePipe,private commonService: CommonService,public router: Router,private formBuilder: FormBuilder) { }

  	ngOnInit(): void {


  		this.loginUserId = sessionStorage.getItem("user_id");
    	this.token = sessionStorage.getItem("user_token");

      this.validateUserLoginStatus(this.loginUserId,this.token);
      this.currentTimeInMilliseconds=new Date().toLocaleString();

       this.formRecodEdit = this.formBuilder.group({
        policy_from : [''],
        policy_to : [''],
    });

       this.applyDateFilter();

  	}

	validateUserLoginStatus(loginUserId,token){
		this.loaderActive = true;
		let uploadData = new FormData();

		uploadData.append('loginUserId',this.loginUserId);
		uploadData.append('token',token);

		this.commonService.validateUserLoginStatus(uploadData)
		.subscribe(response => {
			this.result = response;
			this.loaderActive = false;
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

applyDateFilter()
{
  if(this.formRecodEdit.value.policy_from == '' && this.formRecodEdit.value.policy_to =='')
  {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);  

    this.from=this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.todate=this.datePipe.transform(lastDay, 'yyyy-MM-dd');
  }else
  {
    this.from=this.formRecodEdit.value.policy_from;
    this.todate=this.formRecodEdit.value.policy_to;
  }
 
   const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('policy_from',this.from);
    sendData.append('policy_to',this.todate);
    this.commonService.getPolicyCount(sendData)
      .subscribe(response =>{
          this.results = response;
         
         if(this.results.status == 'Success')
         {
            var date_id = [];
            var no_of_policy= [];
            for(var i in this.results.policy_count_array) 
            {
              date_id.push(this.results.policy_count_array[i].policy_start_date);
              no_of_policy.push(this.results.policy_count_array[i].policy_count);
            }
            this.chartDataSets = [
                  {data: no_of_policy, label: "Policy Count",fill: true },
                    ];   
            this.lineChartData=this.chartDataSets;
            this.lineChartLabels=date_id;
           
            this.chartOptions = {
               responsive: true,
                      scales: { //you're missing this
                            yAxes: [{
                              scaleLabel: {
                              display: true,
                              labelString: "No.of policy"
                          },
                     time: {
                           displayFormats: {'day': 'MM/YY'},
                           tooltipFormat: 'DD/MM/YY',
                           unit: 'month',
                          },
                         },],
                          xAxes: [{
                            scaleLabel: {
                            display: true,
                             labelString: "Date",
                            },  
                           },], 
                       }//END scales
                  };
              this.lineChartOptions= this.chartOptions;;    
              this.color= [
                   {
                     borderColor: 'black',
                      backgroundColor: 'rgba(255,0,0,0.3)',
                    },
                 ];
              this.lineChartColors=this.color;
              this.lineChartLegend = true;
              this.chartType = 'line';
              this.lineChartType= this.chartType
              this.lineChartPlugins = [];
          }
    });

}

}

