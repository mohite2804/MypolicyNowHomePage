import { Component, OnInit,Renderer2 } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router,ActivatedRoute } from  '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oriental-payment-response',
  templateUrl: './oriental-payment-response.component.html',
  styleUrls: ['./oriental-payment-response.component.css']
})
export class OrientalPaymentResponseComponent implements OnInit {
  transaction_no:any;
  loginUserId:any;
  loaderActive: boolean = true;

  constructor( private activatedRoute : ActivatedRoute, private commonService: CommonService,public router: Router) {}

  ngOnInit(): void {
    this.transaction_no  =  this.activatedRoute.snapshot.paramMap.get('transaction_no');
    this.loginUserId = sessionStorage.getItem("user_id");
    let sendData = new FormData();
    sendData.append('transaction_no',this.transaction_no);
    sendData.append('loginUserId',this.loginUserId);

    this.commonService.getOrientalPaymentResponse(sendData)
    .subscribe(response => {
        var outputResult : any = response;
        if(outputResult.data.status){
          let sendData = new FormData();
          sendData.append('terms_and_conditions','1');
          sendData.append('proposal_no',outputResult.data.proposal_no);
          sendData.append('transaction_no',this.transaction_no);
          sendData.append('loginUserId',this.loginUserId);
          sendData.append('payment_method_id','1');
          this.submitFormPaymentForAll(sendData);
        }else{
          sessionStorage.setItem('proposal_no', outputResult.data.proposal_no);
          if(this.loginUserId!=undefined && this.loginUserId!=null){
            this.router.navigateByUrl('/proposal');
          }else{
            this.router.navigateByUrl('/share/proposal');
          }
          
        }
    });
  }

  submitFormPaymentForAll(sendData){
    this.commonService.submitFormPayment(sendData)
    .subscribe(response => {
      var output_result : any  = response;
      if(output_result.status){
        sessionStorage.setItem('policy_id', output_result.response.insered_id);
        sessionStorage.setItem('policy_no', output_result.response.policy_no);
        sessionStorage.setItem('transaction_no', output_result.request.transaction_no);
        if(this.loginUserId != undefined && this.loginUserId !=null ){
          this.router.navigate(['/thank-you']);
        }else{
          this.router.navigate(['/share/thank-you']);
        }
      }else{
          Swal.fire({
          title: output_result.message,
          confirmButtonText: `OK`
        });
        sessionStorage.setItem('proposal_no', output_result.request.proposal_no);
        
        if(this.loginUserId != undefined && this.loginUserId !=null ){
          this.router.navigateByUrl('/proposal');
        }else{
          this.router.navigateByUrl('/share/proposal');
        }
        
      }
    });
  }
}
