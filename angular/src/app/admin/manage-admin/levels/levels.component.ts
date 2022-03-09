import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from  '@angular/forms';  //newly added
import { Router,ActivatedRoute, NavigationEnd } from  '@angular/router';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  base_url = environment.baseUrl;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; 

  dtRendered = true;

  div_show_level_status : boolean = false;

  loginUserId : any;    
  id : any;    
  table : any;  
  where_column : any;
  back_url : any;

  statusval : any = 'zone';

  result : any;

  levels_data : any;
  level_id :any;
  all_levels :any ;

  displayZone :any ;
  displayRegion :any ;
  displayState :any ;


  loaderActive : boolean =  false;

  constructor(private activatedRoute : ActivatedRoute, private http: HttpClient, private renderer: Renderer2, private router: Router,private commonService : CommonService,private formBuilder: FormBuilder, public cdr: ChangeDetectorRef) { }



  ngOnInit(): void {
    this.loginUserId = sessionStorage.getItem("adminUserId");    
    this.id =  this.activatedRoute.snapshot.paramMap.get('id');
    this.back_url =  this.activatedRoute.snapshot.paramMap.get('back_url');

    this.displayZone = 'none';
    this.displayRegion = 'none';
    this.displayState = 'none';

    this.getLevels();
    this.getAllLevels();
    //this.ckeckLevelExist();
    // alert(this.id);
    this.getIndex();

  }
  
  getLevels(){
    var sendData = new FormData();
    sendData.append('id', this.id);
    this.commonService.getLevels(sendData)
      .subscribe( response => {
        this.levels_data = response;
        this.levels_data = this.levels_data.result[0];         
        this.level_id = this.levels_data.level_id;

        if(this.level_id == '1')
        {
          this.displayZone = 'block';
          this.displayRegion = 'none';
          this.displayState = 'none';
        }
        else if(this.level_id == '2')
        {
          this.displayZone = 'block';
          this.displayRegion = 'block';
          this.displayState = 'none';
        }
        else if(this.level_id == '3')
        {
          this.displayZone = 'block';
          this.displayRegion = 'block';
          this.displayState = 'block';
        }
        console.log(this.level_id);
      });
  }

  getAllLevels(){
      var sendData = new FormData();
      sendData.append('loginUserId', this.loginUserId);
      this.commonService.getAllLevels(sendData)
        .subscribe( response => {
          this.all_levels = response;
          this.all_levels = this.all_levels.result;         
          // console.log(this.all_levels);
        });
  }


  getIndex(){
    //console.log('test pro..............');
    const that = this;
    this.dtOptions = {
      "pagingType": 'full_numbers',
      "pageLength": 10,
      "serverSide": true,
      "processing": true,
      'ajax' : {
          url : this.base_url+'admin/get_levelZone',
          type : 'POST',
          data: {                
          "loginUserId": this.loginUserId,
          "parent_type_id": this.id,
      },
          dataType: "json",
      },  
      columns: [    
        {   
          'title' : 'Sr.No',
          'data' : 'id' 
        },                    
        {  
          'title' : 'Parent',
          'data' : 'level_parent_name'
        },
        {  
          'title' : 'Zone',
          'data' : 'level_zone_name'
        },
        {  
          'title' : 'Status',
          'data' : 'status'
        }/*,           

        {  
          'title' : 'Action',
          'data' : 'action_btn'
        }*/
      ],
      "columnDefs": [ {
        "targets": 3,
        "orderable": false
        }, 
      ]
    };
  }

//newly added

  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  searchByLevel(statusid){
	  this.div_show_level_status = false;
    this.statusval = statusid;
    const that = this;

    this.dtRendered = false;

    switch(this.statusval) { 
     case "zone": { 
        this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/get_levelZone',
              type : 'POST',
              data: {                
              "loginUserId": this.loginUserId,
              "parent_type_id": this.id,
          },
              dataType: "json",
          },  
          columns: [    
            {   
              'title' : 'Sr.No',
              'data' : 'id' 
            },                    
            {  
              'title' : 'Parent',
              'data' : 'level_parent_name'
            },
            {  
              'title' : 'Zone',
              'data' : 'level_zone_name'
            },
            {  
              'title' : 'Status',
              'data' : 'status'
            }/*,           

            {  
              'title' : 'Action',
              'data' : 'action_btn'
            }*/
          ],
          "columnDefs": [ {
            "targets": 3,
            "orderable": false
            }, 
          ]
        };
        break; 
     } 
        case "region": { 
          this.dtOptions = {
            "pagingType": 'full_numbers',
            "pageLength": 10,
            "serverSide": true,
            "processing": true,
            'ajax' : {
                url : this.base_url+'admin/get_levelRegion',
                type : 'POST',
                data: {                
                "loginUserId": this.loginUserId,
                "parent_type_id": this.id,
            },
                dataType: "json",
            },  
            columns: [    
              {   
                'title' : 'Sr.No',
                'data' : 'id' 
              },
              {  
                'title' : 'Parent',
                'data' : 'level_parent_name'
              },                    
              {  
                'title' : 'Zone',
                'data' : 'level_zone_name'
              },
              {  
                'title' : 'Region',
                'data' : 'level_region_name'
              },
              {  
                'title' : 'Status',
                'data' : 'status'
              }/*,           
              {  
                'title' : 'Action',
                'data' : 'action_btn'
              }*/
            ],
            "columnDefs": [ {
              "targets": 4,
              "orderable": false
              }, 
            ]
          };
          break; 
      }
      case "state": { 
        this.dtOptions = {
          "pagingType": 'full_numbers',
          "pageLength": 10,
          "serverSide": true,
          "processing": true,
          'ajax' : {
              url : this.base_url+'admin/get_levelState',
              type : 'POST',
              data: {                
              "loginUserId": this.loginUserId,
              "parent_type_id": this.id,
          },
              dataType: "json",
          },  
          columns: [    
            {   
              'title' : 'Sr.No',
              'data' : 'id' 
            },                    
            {  
              'title' : 'Parent',
              'data' : 'level_parent_name'
            },
            {  
              'title' : 'Zone',
              'data' : 'level_zone_name'
            },
            {  
              'title' : 'Region Name',
              'data' : 'level_region_name'
            },
            {  
              'title' : 'State',
              'data' : 'level_state_name'
            },
            {  
              'title' : 'Status',
              'data' : 'status'
            }/*,           

            {  
              'title' : 'Action',
              'data' : 'action_btn'
            }*/
          ],
          "columnDefs": [ {
            "targets": 5,
            "orderable": false
            }, 
          ]

      };
        break; 
    } 
  } 

    
    // make sure your template notices it
    this.cdr.detectChanges();
    // initialize them again
    this.dtRendered = true
    this.cdr.detectChanges();


     


      // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //   //this.dtOptions.destroy();
      //   //dtInstance.ajax.data.status = this.statusval;

      //   //dtInstance.ajax.url(this.base_url+'get_endorsementByStatus/'+this.statusval).load();

      //  // dtInstance.search( this.statusval ).draw();
      //  dtInstance.columns(0).search(this.statusval).draw();
      //  // dtInstance.column(11).search(this.statusval, true, false).draw();

      //   //this.dtOptions.reload();
      //   //dtInstance.draw();
      //   //this.dtTrigger.next();
      // });
      
      this.loaderActive = false;
  }



  backToUrl(){
    // console.log(this.back_url);
    this.back_url = atob(this.back_url);
    // console.log(this.back_url);
    // this.router.navigate(['admin/manage-common/user']);
    this.router.navigate([this.back_url]);
 }

  // checkLevelExist() {

  // }

}
