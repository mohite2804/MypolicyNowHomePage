import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { Subject } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { CustomvalidationService } from "../../services/customvalidation.service";

import {
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.service";

import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { htmlPrefilter } from "jquery";

@Component({
  selector: "app-break-in-case",
  templateUrl: "./break-in-case.component.html",
  styleUrls: ["./break-in-case.component.css"],
})
export class BreakInCaseComponent implements OnInit {

  @ViewChild('cd', { static: false }) private counter!: CountdownComponent;
  config: CountdownConfig = { leftTime: 50 };

  base_url = environment.baseUrl;
  //mainJsPath = environment.mainJsPath;
  dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("closebutton") closebutton;

  loaderActive: boolean = false;
  dtRendered = true;

  statusval: any;

  result: any;
  loginUserId: any;
  loginUserType: any;
  token: any;
  razor_customer_id: any;

  ////search options
  submitted_filter: any = false;
  formRecodEdit: any;
  isAtLeastOne: boolean = false;
  atLeastOneRequired: any;

  date_picker_policy_from: NgbDateStruct;
  date_picker_policy_to: NgbDateStruct;
  minDatePolicyFrom: any;
  maxDatePolicyTo: any;
  maxDate: any;
  minDate: any;
  icList: any;
  productList: any;
  cancellationTypeList: any;
  selectedInsurance_name: any;
  selectedProduct_name: any;
  selectedCancellation_type: any;
  proposalData: any;

  search_insurance_name: any;

  filter_policy_no: any;
  policy_from: any;
  policy_to: any;
  insurance_name: any;
  product_name: any;
  cancellation_type: any;

  filterResult: any;
  inspection_done_by:any;
  timer_data : any
  setNullDate : any;
  minDateForToDate: any;

  constructor(
    private customvalidationService: CustomvalidationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    public router: Router,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    public cdr: ChangeDetectorRef,
    private excelService: ExcelService
  ) {

    this.setNullDate = {
      year: "",
      month: "",
      day: ""
    };
  }

  selectDate(field,event){
    var day : any = (event.day < 10 ? '0' : '') + event.day;
    var month : any = (event.month < 10 ? '0' : '') + event.month;
    var year :any =  event.year;
    var selected_date : any = year+'-'+month+'-'+day;

    var date2 : any = new Date(selected_date);

    this.formRecodEdit.patchValue({
      policy_to : ''
    });
    this.date_picker_policy_to =  this.setNullDate;

    this.minDateForToDate = {
      year: date2.getFullYear(),
      month: date2.getMonth() + 1,
      day: date2.getDate()
    }

  }

  ngOnInit(): void {
    this.statusval = 1;
    this.loginUserId = sessionStorage.getItem("user_id");
    this.loginUserType = sessionStorage.getItem("user_type_id");
    this.token = sessionStorage.getItem("user_token");
    this.razor_customer_id = sessionStorage.getItem("razor_customer_id");

    this.formRecodEdit = this.formBuilder.group({
      filter_policy_no: [""],
      policy_from: [""],
      policy_to: [""],
      insurance_name: [""],
      product_name: [""],
      cancellation_type: [""],
      submit_btn: [""],
    });

    const current = new Date();

    this.maxDate = this.maxDatePolicyTo = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.minDate = this.minDatePolicyFrom = {
      year: current.getFullYear() - 2,
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.validateUserLoginStatus(this.loginUserId, this.token);

    this.getFilterListData();
    this.getIndex();
  }



  runTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
  }

  handleEvent(e: CountdownEvent) {
    if(e.action == "done"){
      this.runTable();

    }

  }



  ngAfterViewInit(): void {
  //  this.setCounterDate();
    this.renderer.listen("document", "click", (event) => {

      if (event.target.hasAttribute("view-proposal-no")) {
        this.viewProposal(
          event.target.getAttribute("view-proposal-no"),
          event.target.getAttribute("view-proposal-unique-ref-no"),
          event.target.getAttribute("view-proposal-quote-no"),
          event.target.getAttribute("view-proposal-id")
        );
      }

      if (event.target.hasAttribute("initiate-proposal-no")) {
        this.intiateProposal(
          event.target.getAttribute("initiate-proposal-no"),
          event.target.getAttribute("initiate-proposal-id"),
          event.target.getAttribute("inspection-done-by"),
        );
      }

      if (event.target.hasAttribute("upload-breakin-proposal-no")) {
        this.uploadBreakinProposalData(
          event.target.getAttribute("upload-breakin-proposal-no"),
          event.target.getAttribute("upload-breakin-proposal-id"),
          event.target.getAttribute("upload-breakin-case-id")
        );
      }

    });
  }

  validateUserLoginStatus(loginUserId, token) {
    this.loaderActive = true;
    let uploadData = new FormData();

    uploadData.append("loginUserId", this.loginUserId);
    uploadData.append("token", token);

    this.commonService
      .validateUserLoginStatus(uploadData)
      .subscribe((response) => {
        this.result = response;
        this.loaderActive = false;
        if (this.result.status) {
          //valid status i.e. not login from another location
        } else {
          Swal.fire({
            title: "error",
            html:
              "It seems that you have login from another location. You are logged out from this session?",
            timer: 3500,
          }).then((result) => {
            this.router.navigate(["/logout"]);
          });
        }
      });
  }

  changeSelectBox(form_control_name, selected_value) {
    console.log("selected Value " + selected_value);
    if (selected_value) {
      switch (form_control_name) {
        case "insurance_name":
          this.formRecodEdit.patchValue({ insurance_name: selected_value });
          break;

        case "product_name":
          this.formRecodEdit.patchValue({ product_name: selected_value });
          break;
      }
    }
  }

  clearValue(form_control_name, selected_value) {
    switch (form_control_name) {
      case "insurance_name":
        this.formRecodEdit.patchValue({ insurance_name: "" });
        this.selectedInsurance_name = "";
        break;

      case "product_name":
        this.formRecodEdit.patchValue({ product_name: "" });
        this.selectedProduct_name = "";
        break;
    }
  }

  getFilterListData() {
    this.commonService.getFilterListData().subscribe((response) => {
      this.filterResult = response;
      this.icList = this.filterResult.icList;
      this.productList = this.filterResult.productList;
    });
  }

  getIndex() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: this.base_url + "myaccount/get_dashboard_break_in",
        type: "POST",
        // headers: {
        //   Authorization: "Bearer " + sessionStorage.getItem("user_token"),
        // },
        data: {
          loginUserId: this.loginUserId,
          loginUserType: this.loginUserType,
          status: this.statusval,
        },
        dataType: "json",
      },
      columns: [
        {
          title: "Sr.No",
          data: "id",
        },
        {
          title: "Proposal No.",
          data: "proposal_no",
        },
        {
          title: "Insured Name",
          data: "insured_name",
        },
        {
          title: "Insured Mobile No",
          data: "insured_mobile_no",
        },
        {
          title: "Ins. Company",
          data: "ins_comp",
        },
        {
          title: "Product Type",
          data: "product_type",
        },

        {
          title: "Reg. No.",
          data: "reg_no",
        },

        {
          title: "Engine No.",
          data: "engine_number",
        },

        {
          title: "Chasis No.",
          data: "chasis_number",
        },

        {
          title: "Status",
          data: "status",
        },
        {
          title: "Admin Comment",
          data: "admin_comment",
        },
        {
          title: "Admin Approval Date",
          data: "breakin_approval_date",
        },
        {
          title: "Breakin Created Date",
          data: "breakin_created_date",
        },

        {
          title: "View Proposal",
          data: "view_proposal",
        },

        {
          title: "Action",
          data: "action_btn",
        }
      ],
      columnDefs: [
        { orderable: false, targets: 8 },
        { orderable: false, targets: 0 },
      ],
      order: [[0, "desc"]],

      rowCallback: function (row, data, index) {
        if (data["breakin_status_id"] == 4) {
          $("td", row).css("background-color", "rgba(0, 128, 0, 0.4)");
          setCounterDate(data['breakin_approval_date'],data['breakin_count_down_end'],data['proposal_id']);
          $('td:eq(13)', row).prepend( "<br><h4 class='text-red' id='"+data['proposal_id']+"'></h4><br>" );
        }

      },
    };
  }

  showHideStatusBreakin(statusid) {
    this.statusval = statusid;
    console.log("status :- " + this.statusval);

    this.loaderActive = true;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search(this.statusval).draw();
    });

    this.loaderActive = false;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  /////view proposal
  viewProposal(proposal_no, unique_ref_no, quote_no,proposal_id) {
    this.loaderActive = true;
    if (proposal_no != "" && unique_ref_no != "" && quote_no != "") {
      sessionStorage.setItem("proposal_no", proposal_no);
      sessionStorage.setItem("unique_ref_no", unique_ref_no);
      sessionStorage.setItem("quote_no", quote_no);
      sessionStorage.setItem("proposal_id", proposal_id);
      // window.open('/proposal', '_blank');
      this.router.navigateByUrl("/proposal");
    } else {
      this.loaderActive = false;
      Swal.fire("Please try again", "", "error");
    }
    this.loaderActive = false;
  }

  //////breakin initiate
  intiateProposal(proposal_no, proposal_id,inspection_done_by) {

    this.inspection_done_by=inspection_done_by;
    if (proposal_no != "" && proposal_id != "") {
      let uploadData = new FormData();
      uploadData.append("proposal_no", proposal_no);
      uploadData.append("proposal_id", proposal_id);
      uploadData.append("loginUserId", this.loginUserId);
      uploadData.append("loginUserType", this.loginUserType);

      console.log("submitInitiateBreakin........");
      console.log(uploadData);

      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then((willDelete) => {
        if (willDelete.value) {
          this.loaderActive = true;

          this.commonService
            .submitBreakinInitiate(uploadData)
            .subscribe((response) => {
              this.loaderActive = false;
              var outputResult: any = response;

              if (outputResult.status) {
                Swal.fire({
                  title: outputResult.message,
                  text: "",
                  icon: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    if(this.inspection_done_by=='ic'){
                      sessionStorage.setItem("breakin_proposal_no", proposal_no);
                      sessionStorage.setItem("breakin_proposal_id", proposal_id);
                      sessionStorage.setItem(
                        "breaking_case_id",
                        outputResult.breaking_case_id
                      );
                      this.router.navigateByUrl(
                        "/my-account/break-in-inspection"
                      );
                    }else{
                      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        dtInstance.columns(1).search(this.filter_policy_no);
                        dtInstance.columns(2).search(this.policy_from);
                        dtInstance.columns(3).search(this.policy_to);
                        dtInstance.columns(4).search(this.insurance_name);
                        dtInstance.columns(5).search(this.product_name);
                        dtInstance.draw();
                      });
                    }

                    console.log('inspection_done_by-333333333-------');
                  }
                });
              } else {
                Swal.fire(outputResult.message, "", "error");
              }
            });
        }
      });
    } else {
      Swal.fire("Something went wrong. Please try again", "", "error");
    }
  }

  //////upload breakin data
  uploadBreakinProposalData(proposal_no, proposal_id, breaking_case_id) {
    if (proposal_no != "" && proposal_id != "") {
      sessionStorage.setItem("breakin_proposal_no", proposal_no);
      sessionStorage.setItem("breakin_proposal_id", proposal_id);
      sessionStorage.setItem("breaking_case_id", breaking_case_id);
      this.router.navigateByUrl("/my-account/break-in-inspection");
    } else {
      Swal.fire("Something went wrong. Please try again", "", "error");
    }
  }

  submitFormFilter() {
    if (
      this.formRecodEdit.value.policy_from != "" &&
      this.formRecodEdit.value.policy_from != null &&
      this.formRecodEdit.value.policy_from != undefined
    ) {
      this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
    } else {
      this.policy_from = "";
    }

    if (
      this.formRecodEdit.value.policy_to != "" &&
      this.formRecodEdit.value.policy_to != null &&
      this.formRecodEdit.value.policy_to != undefined
    ) {
      this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
    } else {
      this.policy_to = "";
    }

    this.filter_policy_no = this.formRecodEdit.value.filter_policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;

    if (
      (this.filter_policy_no != "" &&
        this.filter_policy_no != null &&
        this.filter_policy_no != undefined) ||
      (this.policy_from != "" &&
        this.policy_from != null &&
        this.policy_from != undefined) ||
      (this.policy_to != "" &&
        this.policy_to != null &&
        this.policy_to != undefined) ||
      (this.insurance_name != "" &&
        this.insurance_name != null &&
        this.insurance_name != undefined) ||
      (this.product_name != "" &&
        this.product_name != null &&
        this.product_name != undefined)
    ) {
      this.loaderActive = true;

      // this.dtRendered = true
      // this.cdr.detectChanges();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns(1).search(this.filter_policy_no);
        dtInstance.columns(2).search(this.policy_from);
        dtInstance.columns(3).search(this.policy_to);
        dtInstance.columns(4).search(this.insurance_name);
        dtInstance.columns(5).search(this.product_name);
        dtInstance.draw();
      });

      this.loaderActive = false;
    } else {
      Swal.fire("At least one field is required ", "", "error");
      return;
    }
  }

  exportDataForm() {
    if (
      this.formRecodEdit.value.policy_from != "" &&
      this.formRecodEdit.value.policy_from != null &&
      this.formRecodEdit.value.policy_from != undefined
    ) {
      this.policy_from = JSON.stringify(this.formRecodEdit.value.policy_from);
    } else {
      this.policy_from = "";
    }

    if (
      this.formRecodEdit.value.policy_to != "" &&
      this.formRecodEdit.value.policy_to != null &&
      this.formRecodEdit.value.policy_to != undefined
    ) {
      this.policy_to = JSON.stringify(this.formRecodEdit.value.policy_to);
    } else {
      this.policy_to = "";
    }

    this.filter_policy_no = this.formRecodEdit.value.filter_policy_no;
    this.insurance_name = this.formRecodEdit.value.insurance_name;
    this.product_name = this.formRecodEdit.value.product_name;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append("loginUserId", this.loginUserId);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("filter_policy_no", this.filter_policy_no);
    sendData.append("policy_from", this.policy_from);
    sendData.append("policy_to", this.policy_to);
    sendData.append("insurance_name", this.insurance_name);
    sendData.append("product_name", this.product_name);
    sendData.append("statusval", this.statusval);

    this.commonService
      .exportBreakinProposalData(sendData)
      .subscribe((response) => {
        this.loaderActive = false;
        this.proposalData = response;
        this.excelService.exportAsExcelFile(
          this.proposalData,
          "BreakinProposalData"
        );
      });
  }

  resetFilterForm() {
    this.loaderActive = true;

    this.formRecodEdit.patchValue({
      filter_policy_no: "",
      policy_from: "",
      policy_to: "",
      insurance_name: "",
      product_name: "",
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(1).search("");
      dtInstance.columns(2).search("");
      dtInstance.columns(3).search("");
      dtInstance.columns(4).search("");
      dtInstance.columns(5).search("");
      dtInstance.draw();
    });

    this.loaderActive = false;
  }

  updateStatusApproveToPending(proposal_id) {
    let sendData = new FormData();
    sendData.append("proposal_id", proposal_id);
    this.commonService
      .updateStatusApproveToPending(sendData)
      .subscribe((res) => {
        this.showHideStatusBreakin(4);
      });
  }
}







function setCounterDate(breakin_approval_date :any, breakin_count_down_end: any,proposal_id: any){

  var html : any = "";
  var countDownDate = new Date(breakin_count_down_end).getTime();
  console.log('countDownDate' + countDownDate);

  var x = setInterval(function() {

    var now = new Date().getTime();
    var panding_time = countDownDate - now;

    
    console.log('breakin_count_down_end' + breakin_count_down_end);
    console.log('now' + now);
    console.log('panding_time' + panding_time);

    var hours = Math.floor((panding_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((panding_time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((panding_time % (1000 * 60)) / 1000);

    console.log('hours' + hours);
    console.log('minutes' + minutes);
    console.log('seconds' + seconds);

    document.getElementById(proposal_id).innerHTML = hours + "h "  + minutes + "m " + seconds + "s ";
    this.timer_data = panding_time;
    if (panding_time <= 0) {
      clearInterval(x);
      document.getElementById(proposal_id).innerHTML = "EXPIRED";
      document.getElementById('hide_btn_'+proposal_id).style.visibility = 'hidden';
      document.getElementById('hide_btn_'+proposal_id).remove();

    }

  }, 1000);



}


