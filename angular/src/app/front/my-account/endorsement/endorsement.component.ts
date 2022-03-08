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

@Component({
  selector: "app-endorsement",
  templateUrl: "./endorsement.component.html",
  styleUrls: ["./endorsement.component.css"],
})
export class EndorsementComponent implements AfterViewInit, OnDestroy, OnInit {
  base_url = environment.baseUrl;
  //mainJsPath = environment.mainJsPath;
  dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("closebutton") closebutton;

  validation_ifsc_code: any = "^[A-Z]{4}0[A-Z0-9]{6,20}$";
  validation_for_character: any = "[a-zA-Z][a-zA-Z '-]*$";
  validation_for_number: any = "^[0-9]+$";
  validation_for_account_no: any = "^[1-9]{1}[0-9]{2,20}$";

  formchFilterDetails: FormGroup;

  div_show_endorsement_new: boolean = true;
  div_show_endorsement_status: boolean = false;
  loaderActive: boolean = false;
  dtRendered = true;

  statusval: any;

  policy_cancel: any;
  policy_status: any;
  show_endorse_button: boolean = false;

  result: any;
  loginUserId: any;
  loginUserType: any;
  token: any;

  display: any;
  popupTitle: any;

  endorsement_premium: any;

  wallet_balance: any = 0;
  razor_customer_id: any;
  div_show_for_wallet: boolean = false;

  formPaymentEndorsement: FormGroup;
  submittedNonNilPayment: boolean = false;
  btnPaymentSubmit: boolean = false;
  in_sufficient_bal: boolean = false;

  submittedSearch: boolean = false;

  success_message: any;
  popupPyDetailsTitle: any;
  error_message: any;
  editResult: any;

  ///view bank details
  detail_refund: any;
  detail_account_name: any;
  detail_account_no: any;
  detail_bank_name: any;
  detail_bank_branch: any;
  detail_bank_ifsc_code: any;
  detail_refund_amount: any;

  display_viewPaymentDetailsModal: any = "none";
  popupPyDetailsTitle_viewPaymentDetailsModal: any;

  ///payment details
  payment_refund_to_paid: any;
  payment_refund_payee_account_name_paid: any;
  payment_refund_payee_account_no_paid: any;
  payment_refund_payee_bank_ifsc_code_paid: any;
  payment_refund_payee_bank_name_paid: any;
  payment_refund_payee_bank_branch_paid: any;

  public_path: any;
  transaction_no_paid: any;
  payment_remark_paid: any;
  payment_doc_paid: any;
  payment_date_paid: any;
  payment_status_update_by: any;

  payment_paid_editResult: any;

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
  policyTypeList: any;
  endorsementList: any;
  selectedInsurance_name: any;
  selectedProduct_name: any;
  selectedPolicyType_name: any;
  selectedEndorsement_type: any;
  proposalData: any;

  search_insurance_name: any;

  filter_policy_no: any;
  policy_from: any;
  policy_to: any;
  insurance_name: any;
  policy_type_name: any;
  product_name: any;
  endorsement_type: any;
  ic_id: any;

  filterResult: any;
  already_initiated_text: any;
  already_initiated_show: boolean = false;

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
    //this.loadScripts();
    // this.loadScripts();
    this.loadPaymentScripts();
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
      policy_type_name: [""],
      product_name: [""],
      endorsement_type: [""],
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

    if (this.razor_customer_id) {
      this.getWalletBallance();
    }

    this.formchFilterDetails = this.formBuilder.group({
      policy_number: [
        "",
        [
          Validators.required,
          this.customvalidationService.cannotContainZeroAndSpace(),
          this.customvalidationService.cannotContainZero(),
        ],
      ],
    });

    this.formPaymentEndorsement = this.formBuilder.group({
      policy_no: [""],
      endorsement_id: [""],
      gross_premium: [""],
    });
    this.showHideNewEndorsement();
    this.getIndex();
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

        case "endorsement_type":
          this.formRecodEdit.patchValue({ endorsement_type: selected_value });
          break;

        case "policy_type_name":
          this.formRecodEdit.patchValue({ policy_type_name: selected_value });
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

      case "endorsement_type":
        this.formRecodEdit.patchValue({ endorsement_type: "" });
        this.selectedEndorsement_type = "";
        break;

      case "policy_type_name":
        this.formRecodEdit.patchValue({ policy_type_name: "" });
        this.selectedPolicyType_name = "";
        break;
    }
  }

  getFilterListData() {
    this.commonService.getFilterListData().subscribe((response) => {
      this.filterResult = response;
      this.icList = this.filterResult.icList;
      this.productList = this.filterResult.productList;
      this.policyTypeList = this.filterResult.policyTypeList;
      this.endorsementList = this.filterResult.endorsementList;
    });
  }

  getWalletBallance() {
    var sendData = new FormData();
    sendData.append("loginUserId", this.loginUserId);
    sendData.append("razor_customer_id", this.razor_customer_id);
    this.commonService.getWalletBallance(sendData).subscribe((response) => {
      this.wallet_balance = response;
    });
  }

  getIndex() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: this.base_url + "myaccount/get_endorsementByStatus",
        type: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("user_token"),
        },
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
          title: "Policy Number",
          data: "ref_no",
        },
        {
          title: "Endorsement No",
          data: "endorsement_no",
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
          title: "Product Type",
          data: "product_type",
        },
        {
          title: "Reg. No.",
          data: "reg_no",
        },
        {
          title: "Ins. Company",
          data: "ins_comp",
        },
        {
          title: 'Final Premium <small class="d-block">(Incl. GST)',
          data: "final_premium",
        },
        {
          title: "Type",
          data: "type",
        },
        {
          title: "Type Change",
          data: "type_change",
        },
        {
          title: "Created Date",
          data: "quote_created_date",
        },
        {
          title: 'Endorsement Charges <small class="d-block">(Incl. GST)',
          data: "endorse_charges",
        },
        {
          title: "Refund Amount",
          data: "refund_amount",
        },
        {
          title: "Refund Details",
          data: "refund_action",
        },
        {
          title: "Admin Comment",
          data: "comment",
        },
        {
          title: "Approval Date",
          data: "approval_date",
        },
        {
          title: "Action",
          data: "action_btn",
        },
        {
          title: "Payments",
          data: "payment_btn",
        },
      ],
      columnDefs: [
        { orderable: false, targets: 14 },
        { orderable: false, targets: 0 },
        { visible: false, targets: 15 },
        { visible: false, targets: 16 },
        //{ visible: false, targets: 17 },
      ],
      order: [[11, "desc"]],
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listen("document", "click", (event) => {
      if (event.target.hasAttribute("download-proposal")) {
        this.downloadProposalPdf(
          event.target.getAttribute("download-proposal")
        );
      }
      if (event.target.hasAttribute("referback-endorsement")) {
        var referval = event.target
          .getAttribute("referback-endorsement")
          .split(",");
        sessionStorage.setItem("policy_endorsement_id", referval[0]);
        sessionStorage.setItem("item_id", referval[1]);
        sessionStorage.setItem("policy_no", referval[2]);

        if(referval[3]==1){
          this.router.navigateByUrl("/my-account/policy-transfer-endorsement");
        }else if(referval[3]==2){
          this.router.navigateByUrl("/my-account/nil-endorsement");
        }else{
          this.router.navigateByUrl("/my-account/non-nil-endorsement");
        }
      }
      if (event.target.hasAttribute("payment-endorsement-id")) {
        this.ic_id=event.target.getAttribute("ic_id");
        this.paymentEndorsement(
          event.target.getAttribute("payment-endorsement-id"),
          event.target.getAttribute("gross-premium"),
          event.target.getAttribute("policy_no")
        );
      }

      if (event.target.hasAttribute("view-bank-details")) {
        this.viewPaymentDetails(event.target.getAttribute("view-bank-details"));
      }

      if (event.target.hasAttribute("payment-done-endorsement-id")) {
        this.getPaymentPaidDetails(
          event.target.getAttribute("payment-done-endorsement-id")
        );
      }
    });
  }

  viewPaymentDetails(dataid) {
    this.popupPyDetailsTitle_viewPaymentDetailsModal = "View Details";
    this.getDataByDataId(dataid);
  }

  getDataByDataId(d_id) {
    this.loaderActive = true;
    var sendData = new FormData();
    sendData.append("endorsement_id", d_id);
    this.commonService
      .getEndorsementDataById(sendData)
      .subscribe((response) => {
        this.loaderActive = false;
        this.editResult = response;
        this.displayPaymentData(this.editResult.result);
        //console.log(this.editResult);
      });
  }

  displayPaymentData(result) {
    var josn_result : any = JSON.parse(result.endorsee_value_json);

    this.detail_refund = josn_result.refund_to;
    this.detail_account_name = josn_result.refund_payee_account_name;
    this.detail_account_no = josn_result.refund_payee_account_no;
    this.detail_bank_name = josn_result.refund_payee_bank_name;
    this.detail_bank_branch = josn_result.refund_payee_bank_branch;
    this.detail_bank_ifsc_code = josn_result.refund_payee_bank_ifsc_code;
    this.detail_refund_amount = result.application_refund_amount;

    console.log('.....................');
    console.log(josn_result);
    console.log('.....................');

    // console.log(',,,,,,,,,,,,,,,,');

    // console.log(result.endorsee_value_json.refund_payee_account_no);
    //console.log(this.detail_account_no);

  }

  closePopup_viewPaymentDetailsModal() {
    this.closebutton.nativeElement.click();
    this.display_viewPaymentDetailsModal = "none";
    // this.resetFormForwardProposal();
    this.loaderActive = false;
  }

  paymentEndorsement(endorsement_id, gross_premium, policy_no) {
    this.resetForm();
    this.popupTitle = "Endorsement Payment";
    this.display = "none";
    this.endorsement_premium = gross_premium;

    if(this.wallet_balance/100 < this.endorsement_premium && this.ic_id !=27){
      this.in_sufficient_bal=true;
    }

    this.setFormData(endorsement_id, gross_premium, policy_no);
  }

  resetForm() {
    this.btnPaymentSubmit = false;
    this.formPaymentEndorsement.patchValue({
      endorsement_id: "",
      gross_premium: "",
    });
  }

  setFormData(endorsement_id, gross_premium, policy_no) {
    this.btnPaymentSubmit = true;
    this.formPaymentEndorsement.patchValue({
      policy_no: policy_no,
      endorsement_id: endorsement_id,
      gross_premium: gross_premium,
    });
  }

  closePopup() {
    this.closebutton.nativeElement.click();
    this.display = "block";
    this.resetForm();
  }

  downloadProposalPdf(proposal_share_link) {
    window.open(this.base_url + "myaccount/downloadEndorsement/" + proposal_share_link, "_blank");
    /* this.downloadFile(
      this.base_url + "myaccount/downloadEndorsement/" + proposal_share_link
    ); */
  }

  downloadFile(download_url) {
    window.open(download_url, "_blank");
  }

  submitFormFilterDetails() {
    this.submittedSearch = true;
    if (this.formchFilterDetails.invalid) {
      return;
    }

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append(
      "policy_number",
      this.formchFilterDetails.value.policy_number
    );

    console.log("submitFormQuoteDetails........");
    console.log(uploadData);

    this.commonService
      .submitEndorsmentFilterDetails(uploadData)
      .subscribe((response) => {
        this.loaderActive = false;
        var outputResult: any = response;

        if (outputResult.status) {
          this.result = outputResult.result;
          this.policy_cancel = outputResult.policy_cancel;
          this.policy_status = outputResult.policy_status;
          var already_initiated = outputResult.already_initiated;
          console.log(this.policy_cancel);
          if (this.policy_cancel) {
            this.show_endorse_button = false;
          } else {
            this.show_endorse_button = true;
          }
          if(already_initiated!=''){
            this.already_initiated_show=true;
            this.already_initiated_text="Endorsement already Initiated, Please Upload Document";
          }

          console.log(this.result);
        } else {
          Swal.fire(outputResult.message, "", "error");
        }
      });
  }

  showHideNewEndorsement() {
    this.div_show_endorsement_new = false;
    this.div_show_endorsement_status = true;
  }

  showHideStatusEndorsement(statusid) {
    this.div_show_endorsement_new = true;
    this.div_show_endorsement_status = false;
    this.statusval = statusid;
    console.log("status :- " + this.statusval);

    this.loaderActive = true;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      ///hide column

      if (this.statusval == "1" || this.statusval == 1) {
        dtInstance.columns(15).visible(false);
        dtInstance.columns(16).visible(false);
        dtInstance.columns(18).visible(false);
      }

      if (this.statusval != "1" || this.statusval != 1) {
        if (this.statusval == "5" || this.statusval == 5) {
          dtInstance.columns(13).visible(false);
          dtInstance.columns(14).visible(false);
        } else {
          dtInstance.columns(13).visible(true);
          dtInstance.columns(14).visible(true);
        }

        if (this.statusval == "6" || this.statusval == 6) {
          dtInstance.columns(14).visible(false);
          dtInstance.columns(18).visible(true);
        } else {
          dtInstance.columns(14).visible(true);
          dtInstance.columns(18).visible(false);
        }

        dtInstance.columns(15).visible(true);
        dtInstance.columns(16).visible(true);
      }
      if (
        this.statusval == "4" ||
        this.statusval == 4 ||
        this.statusval == "5" ||
        this.statusval == 5
      ) {
      }

      dtInstance.columns(0).search(this.statusval).draw();
    });

    this.loaderActive = false;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  showHideStatusEndorsement_old(statusid) {
    this.div_show_endorsement_new = true;
    this.div_show_endorsement_status = false;
    this.statusval = statusid;
    const that = this;

    // make sure your template notices it
    this.cdr.detectChanges();
    // initialize them again
    this.dtRendered = true;
    this.cdr.detectChanges();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(0).search(this.statusval).draw();
    });
  }

  nilEndorsement(policy_no) {
    sessionStorage.setItem("policy_no", policy_no);
    sessionStorage.setItem("item_id", "");
    sessionStorage.setItem("policy_endorsement_id", "");
    this.router.navigateByUrl("/my-account/nil-endorsement");
    //[routerLink]="['/my-account/nil-endorsement']"
  }

  non_nilEndorsement(policy_no) {
    sessionStorage.setItem("policy_no", policy_no);
    sessionStorage.setItem("item_id", "");
    sessionStorage.setItem("policy_endorsement_id", "");
    this.router.navigateByUrl("/my-account/non-nil-endorsement");
    //[routerLink]="['/my-account/nil-endorsement']"
  }

  transferEndorsement(policy_no) {
    sessionStorage.setItem("policy_no", policy_no);
    sessionStorage.setItem("item_id", "");
    sessionStorage.setItem("policy_endorsement_id", "");
    this.router.navigateByUrl("/my-account/policy-transfer-endorsement");
    //[routerLink]="['/my-account/nil-endorsement']"
  }

  submitPaymentForm() {
    this.submittedNonNilPayment = true;
    if (this.formPaymentEndorsement.invalid) {
      return;
    }

    this.loaderActive = true;
    let uploadData = new FormData();
    uploadData.append("policy_no", this.formPaymentEndorsement.value.policy_no);
    uploadData.append("ic_id", this.ic_id);
    uploadData.append(
      "endorsement_id",
      this.formPaymentEndorsement.value.endorsement_id
    );
    uploadData.append(
      "gross_premium",
      this.formPaymentEndorsement.value.gross_premium
    );
    uploadData.append("loginUserId", this.loginUserId);
    uploadData.append("loginUserType", this.loginUserType);
    uploadData.append("razor_customer_id", this.razor_customer_id);

    console.log("submitFormNonNilpaymentDetails........");
    console.log(uploadData);

    this.commonService
      .submitEndorsmentPaymentDetails(uploadData)
      .subscribe((response) => {
        this.loaderActive = false;
        var outputResult: any = response;

        if (outputResult.status) {
          this.closePopup();
          this.display = "block";
          Swal.fire({
            title: "Payment done successfully.",
            text: "",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              //this.getIndex();
              location.reload();
            }
          });
        } else {
          Swal.fire(outputResult.message, "", "error");
        }
      });
  }

  // loadScripts() {
  //   //const externalScriptArray = ['/assets/front/js/main.js'];
  //   const externalScriptArray = [this.mainJsPath];
  //   for (let i = 0; i < externalScriptArray.length; i++) {
  //     const scriptTag = document.createElement('script');
  //     scriptTag.src = externalScriptArray[i];
  //     scriptTag.type = 'text/javascript';
  //     scriptTag.async = false;
  //     scriptTag.charset = 'utf-8';
  //     document.getElementsByTagName('head')[0].appendChild(scriptTag);
  //   }
  // }

  loadPaymentScripts() {
    var mainJsPath: any = "https://checkout.razorpay.com/v1/checkout.js";
    const externalScriptArray = [mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement("script");
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = "text/javascript";
      scriptTag.async = false;
      scriptTag.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(scriptTag);
    }
  }

  getPaymentPaidDetails(endorsement_id) {
    this.loaderActive = true;

    var sendData = new FormData();
    sendData.append("endorsement_id", endorsement_id);

    this.commonService
      .getEndorsementDataById(sendData)
      .subscribe((response) => {
        this.loaderActive = false;
        this.payment_paid_editResult = response;

        if (this.payment_paid_editResult.status) {
          this.payment_refund_to_paid = this.payment_paid_editResult.result.refund_to;
          this.payment_refund_payee_account_name_paid = this.payment_paid_editResult.result.refund_payee_account_name;
          this.payment_refund_payee_account_no_paid = this.payment_paid_editResult.result.refund_payee_account_no;
          this.payment_refund_payee_bank_ifsc_code_paid = this.payment_paid_editResult.result.refund_payee_bank_ifsc_code;
          this.payment_refund_payee_bank_name_paid = this.payment_paid_editResult.result.refund_payee_bank_name;
          this.payment_refund_payee_bank_branch_paid = this.payment_paid_editResult.result.refund_payee_bank_branch;

          this.transaction_no_paid = this.payment_paid_editResult.result.refund_transaction_no;
          this.payment_remark_paid = this.payment_paid_editResult.result.refund_remark;
          this.payment_doc_paid = this.payment_paid_editResult.result.refund_doc;
          this.payment_date_paid = this.payment_paid_editResult.result.refund_date;
          this.payment_status_update_by = this.payment_paid_editResult.result.username;

          this.public_path = this.payment_paid_editResult.result.public_path;
        } else {
          Swal.fire(this.payment_paid_editResult.message, "", "error");
        }
      });
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
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;
    this.product_name = this.formRecodEdit.value.product_name;
    this.endorsement_type = this.formRecodEdit.value.endorsement_type;

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
        this.product_name != undefined) ||
      (this.endorsement_type != "" &&
        this.endorsement_type != null &&
        this.endorsement_type != undefined) ||
      (this.policy_type_name != "" &&
        this.policy_type_name != null &&
        this.policy_type_name != undefined)
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
        dtInstance.columns(6).search(this.endorsement_type);
        dtInstance.columns(7).search(this.policy_type_name);
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
    this.endorsement_type = this.formRecodEdit.value.endorsement_type;
    this.policy_type_name = this.formRecodEdit.value.policy_type_name;

    this.loaderActive = true;
    const sendData = new FormData();

    sendData.append("loginUserId", this.loginUserId);
    sendData.append("loginUserType", this.loginUserType);
    sendData.append("filter_policy_no", this.filter_policy_no);
    sendData.append("policy_from", this.policy_from);
    sendData.append("policy_to", this.policy_to);
    sendData.append("insurance_name", this.insurance_name);
    sendData.append("product_name", this.product_name);
    sendData.append("policy_type_name", this.policy_type_name);
    sendData.append("endorsement_type", this.endorsement_type);
    sendData.append("statusval", this.statusval);

    this.commonService.exportEndorsementData(sendData).subscribe((response) => {
      this.loaderActive = false;
      this.proposalData = response;
      this.excelService.exportAsExcelFile(this.proposalData, "EndorsementData");
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
      policy_type_name: "",
      endorsement_type: "",
    });

    this.selectedInsurance_name = "";
    this.selectedProduct_name = "";
    this.selectedEndorsement_type = "";
    this.selectedPolicyType_name = "";

    this.cdr.detectChanges();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns(1).search("");
      dtInstance.columns(2).search("");
      dtInstance.columns(3).search("");
      dtInstance.columns(4).search("");
      dtInstance.columns(5).search("");
      dtInstance.columns(6).search("");
      dtInstance.columns(7).search("");
      dtInstance.draw();
    });

    this.loaderActive = false;
  }
}
