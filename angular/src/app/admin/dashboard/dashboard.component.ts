import { Component, OnInit } from '@angular/core';
import { Router,Params} from  '@angular/router';
import Swal from 'sweetalert2';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType,Chart} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {  Renderer2, ViewChild,ElementRef} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  	template_login_register : boolean = false;
  	result : any;
  	dashboardform: FormGroup;
  	loaderActive: boolean = false;
  	loginUserId  : any;
	  date_picker_policy_from: NgbDateStruct;
    date_picker_policy_to: NgbDateStruct;
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
  	from:any;
  	todate:any;

  	constructor(
  		private datePipe: DatePipe,
  		public router: Router,
  		private formBuilder: FormBuilder,
  		private commonService : CommonService
  		) { }

  ngOnInit(): void {

  	this.loginUserId = sessionStorage.getItem("adminUserId");
       this.dashboardform = this.formBuilder.group({
        policy_from : [''],
        policy_to : [''],
      });
        this.applyDateFilter();
  }

applyDateFilter()
{
  if(this.dashboardform.value.policy_from == '' && this.dashboardform.value.policy_to =='')
  {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);  

    this.from=this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.todate=this.datePipe.transform(lastDay, 'yyyy-MM-dd');
  }else
  {
    this.from=this.dashboardform.value.policy_from;
    this.todate=this.dashboardform.value.policy_to;
  }
      this.loaderActive = true;
    const sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);
    sendData.append('policy_from',this.from);
    sendData.append('policy_to',this.todate);
    this.commonService.getPolicyCount(sendData)
      .subscribe(response =>{
          this.results = response;
              this.loaderActive = false;

         // alert(this.results);
       //   this.loaderActive = true;
         if(this.results.status == 'Success')
         {
	          var date_id = [];
	          var no_of_policy= [];
            var users_id = [];
	           var data_set =[];
	          for(var i in this.results.policy_count_array) 
            {
              users_id.push(i);
              for(var j in this.results.policy_count_array[i])
              {
                if(!(date_id.includes(this.results.policy_count_array[i][j].policy_start_date)))
                {
                  date_id.push(this.results.policy_count_array[i][j].policy_start_date);
                }
                no_of_policy.push(this.results.policy_count_array[i][j].policy_count);
              }
              data_set.push({data:no_of_policy,label:"user id: "+i,fill:false},);
              no_of_policy=[];    
	          }
     
            this.chartDataSets =data_set; 
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
                         borderColor: "rgba(211, 72, 54, 1)",
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
