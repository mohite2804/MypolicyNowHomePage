import { Component, OnInit,ViewChild } from '@angular/core';
import { TreeviewItem, TreeviewConfig} from 'ngx-treeview';

import { Router,ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-permissions',
  templateUrl: './menu-permissions.component.html',
  styleUrls: ['./menu-permissions.component.css']
})
export class MenuPermissionsComponent implements OnInit {
	//@ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
    //@ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;
	config = TreeviewConfig.create({
        hasAllCheckBox: true,
        hasFilter: true,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400
    });
    items: TreeviewItem[];


    selectedItems: any;
    userId : any;
    roleId : any;
    roleCode : any;
    result : any;
    resultNew : any;
    roleName : any;
    submitResult : any;
  	constructor(private location:Location, private activatedRoute : ActivatedRoute, private commonService : CommonService,private formBuilder:FormBuilder) { }

 	ngOnInit() {
    this.resultNew = [];
 		this.roleCode = this.activatedRoute.snapshot.paramMap.get('role');
        console.log(this.roleCode);
        console.log(this.roleCode);
 		this.getMenus();

  	}

  	getMenus(){
        let sendData = new FormData();
        sendData.append('roleCode',this.roleCode);

        console.log(this.userId );
        this.commonService.getMenusInTreeView(sendData)
        .subscribe(response => {
            this.result = response;
            this.result = this.result.result;
            this.createTreeView();


        });

    }



    createTreeView(){
      console.log('.........................');
      console.log(this.result);
      console.log('.........................');
       this.resultNew = [];
        this.result.forEach(item => {
           this.resultNew.push(new TreeviewItem(item))  ;
        });
        this.items = this.resultNew;


    }

  	backToUser(){
        this.location.back();
    }

    onFilterChange(value: string) {
        console.log('filter:', value);
    }

    onSelectedChange(selectedItems) {
        this.selectedItems = selectedItems;
    }



    getSelectedValues(){
        console.log('get selected value...');
        console.log(this.selectedItems);


        let sendData = new FormData()
        sendData.append('select_checkbox',this.selectedItems);
        sendData.append('roleId',this.roleId);


        this.commonService.submitPermissions(sendData)
        .subscribe(response =>{
            this.submitResult = response;

            if(this.submitResult.status){
                Swal.fire(this.submitResult.message, '', "success");
                //this.successMsg = this.submitResult.message;
                this.getMenus();
            }else{
                //this.errorMsg = this.submitResult.message;
                Swal.fire(this.submitResult.message,  "" ,  "error" );
            }

            console.log(response);
        });
    }
}
