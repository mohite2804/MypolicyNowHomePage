import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from  '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  permissionDeniedMsg = environment.permissionDeniedMsg;
  loginUserId : any;
  loginUserType : any;
  business_partner_id :any;

  editResult : any;
  loaderActive : boolean =  false;
  all_product_list : any;
  product_list : any = [];
  sub_product_list : any = [];
  sub_of_sub_product_list : any = [];

  constructor(public router: Router,private commonService : CommonService) {
    this.loginUserId = sessionStorage.getItem('user_id');
    this.loginUserType = sessionStorage.getItem('user_type_id');
    this.business_partner_id = sessionStorage.getItem('business_partner_id');
  }

  ngOnInit(): void {

    sessionStorage.removeItem('policy_no');
    sessionStorage.removeItem('transaction_no');
    sessionStorage.removeItem('proposal_no');
    sessionStorage.removeItem('quote_no');
    sessionStorage.removeItem('active_ic_for_quote');
    sessionStorage.removeItem('selected_ic_id');
    sessionStorage.removeItem('unique_ref_no');
    sessionStorage.removeItem('selected_product_type_id');


    //check login password-changed or not
    //this.checkLoginPasswordChanged(this.loginUserId);

    if(this.loginUserType == 5){
      Swal.fire({
        title: this.permissionDeniedMsg,
        confirmButtonText: `OK`,

      }).then((result) => {
        this.router.navigate(['my-account/dashboard']);
      })
    }

    this.getIndex();

  }

  getIndex(){
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append('loginUserId',this.loginUserId);


    this.commonService.getProductListForHomePage(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      var result :any = response;
      if(result.status){
        this.all_product_list = result.product_list;
        this.getProducts(0);
      }

    });

  }

  getProducts(product_id){
    this.product_list = [];
    this.sub_product_list = [];
    this.sub_of_sub_product_list = [];
    this.all_product_list.forEach(row => {
      if(product_id == row.parent_id){
        this.product_list.push(row);
      }
    });
  }


  redirectUrl(row) {

    if(row.is_redirect){
      sessionStorage.setItem('selected_product_type_id',row.product_type_id);
      //if (row.code == 'private_car' || row.code == 'bike') {
        let url : any = (row.is_full_quote_form) ? row.full_quote_url : row.url;
        this.router.navigate(['/'+url]);
      //}
    }else{
      this.getSubProducts(row);
    }

  }

  getSubProducts(row){
    if(row.is_redirect){
      sessionStorage.setItem('selected_product_type_id',row.product_type_id);
      if(row.code == 'private_car' || row.code == 'bike') {
        let url : any = (row.is_full_quote_form) ? row.full_quote_url : row.url;
        this.router.navigate(['/'+url]);
      }

    }else{
      this.sub_product_list = [];
      this.sub_of_sub_product_list = [];
      this.all_product_list.forEach(each_row => {
        if(row.product_type_id == each_row.parent_id){
          this.sub_product_list.push(each_row);
        }
      });

    }

  }

  getSubOfSubProducts(row){
    console.log('getSubOfSubProducts');
    console.log('getSubOfSubProducts'+row.is_redirect);
    if(row.is_redirect){
      console.log('getSubOfSubProducts'+row.code);
      sessionStorage.setItem('selected_product_type_id',row.product_type_id);
      //if (row.code == 'private_car' || row.code == 'bike') {
        let url : any = (row.is_full_quote_form) ? row.full_quote_url : row.url;
        this.router.navigate(['/'+url]);
      //}

    }else{
      this.sub_of_sub_product_list = [];
      this.all_product_list.forEach(each_row => {
        if(row.product_type_id == each_row.parent_id){
          this.sub_of_sub_product_list.push(each_row);
        }
      });
    }
  }

  findDetailsByProductId(selected_product_type_id){
    let product_details : any ;
    this.all_product_list.forEach(each_row =>{
      if(each_row.product_type_id == selected_product_type_id){
        product_details = each_row;
      }
    });
    return product_details;
  }

  redirectPage(event){
    console.log(event.target.value)
    let product_details = this.findDetailsByProductId(event.target.value);
    sessionStorage.setItem('selected_product_type_id',product_details.product_type_id);
    if(product_details.is_redirect){
      let url : any = (product_details.is_full_quote_form) ? product_details.full_quote_url : product_details.url;
      this.router.navigate(['/'+url]);
    }


  }



  checkLoginPasswordChanged(loginUserId){

    var sendData = new FormData();
    sendData.append('loginUserId',loginUserId);


    this.commonService.checkLoginPasswordChanged(sendData)
    .subscribe( response => {
      this.loaderActive = false;
      this.editResult = response;

      if(this.editResult.status){
        //password changed
        if(this.editResult.password_change){
          //password changed in last 30 days
        }
        else{
          Swal.fire({
            title: 'It\'s more than 30 days that you have changed your password. Do you want to change password?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
          })
          .then((willDelete) => {
            if (willDelete.value) {
              this.router.navigate(['my-account/change-password']);
            }
          });
        }
      }else{
        // Swal.fire({
        //   title: 'It seems that you have not changed your login password. Do you want to change password?',
        //   icon: 'warning',
        //   showCancelButton: true,
        //   confirmButtonText: 'Confirm',
        //   cancelButtonText: 'Cancel'
        // })
        // .then((willDelete) => {
        //   if (willDelete.value) {
        //     this.router.navigate(['my-account/change-password']);
        //   }
        // });
      }

    });

  }

}
