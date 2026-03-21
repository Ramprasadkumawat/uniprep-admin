import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DialogModule } from "primeng/dialog";
import {SelectModule} from "primeng/select";
import { TableModule } from "primeng/table";
import { EnterpriseService } from "./enterprise.service";
import { Root, enterpriseResponse } from "src/app/@Models/enterprise.model";
import { MultiSelectModule } from "primeng/multiselect";
@Component({
    selector: "uni-enterprise-subscription",
    imports: [
        CommonModule,
        AccordionModule,
        ReactiveFormsModule,
        SelectModule,
        TableModule,
        ConfirmPopupModule,
        DialogModule,
        ButtonModule,
        MultiSelectModule,
    ],
    templateUrl: "./enterprise-subscription.component.html",
    styleUrls: ["./enterprise-subscription.component.scss"],
    providers: [ConfirmationService, EnterpriseService]
})
export class EnterpriseSubscriptionComponent implements OnInit {
  form: FormGroup;
  assignform: FormGroup;
  activeIndex: number = -1;
  submitted: boolean;
  pageSize = 10;
  page: number = 1;
  buttonTitle: string = "Create";
  subscriptionList: Root[] = [];
  showAssignModel: boolean = false;
  showViewPriceModel: boolean = false;
  showAddUserModel: boolean = false;
  subscriptionPlanList: { id: string; name: string }[] = [];
  subscriptionPlanCurrency: { id: string; currency_code: string }[] = [];
  collegeList: { id: string; institutename: string }[] = [];
  college_type: { id: string; institute_type: string }[] = [];
  @ViewChild("formElm") formElm!: ElementRef;
  @ViewChild("assignformElement") assignformElm!: ElementRef;
  validityList: any[] = [
    { id: null, name: "Select" },
    { id: 3, name: "3 Months" },
    { id: 6, name: "6 Months" },
    { id: 12, name: "12 Months" },
  ];
  paymentList: any[] = [];
  assignSubmitted: boolean = false;
  editSubscriptionDetails!: Root;
  instituteDetails: any;
  student_details: any;
  historyModel: boolean = false;
  studentHistory: any[] = [];
  first: number = 0;
  totalCount: number = 0;
  selectedFile: any;
  subscriptionmangeriddforupdate: number = 0;
  subscription_plan = "Premium Plan";
  //subscription_plan1="Career";
  //subscription_plan2="Entrepreneur";
  constructor(
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private toast: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = fb.group({
      formtype: [null, [Validators.required]],
      college: [null, [Validators.required]],
      subscription_plan: [this.subscription_plan],
      // subscription_plan1: [this.subscription_plan1,],
      // subscription_plan2: [this.subscription_plan2,],
      number_of_users: ["", [Validators.required]],
      // price_per_user: ['', [Validators.required]],
      // total_price: ['', [Validators.required]],
      //validity: [null, [Validators.required]],
      paymenttype: [null, [Validators.required]],
      // career_price: [null, [Validators.required]],
      premium_price: [null, [Validators.required]],
      subscription_currency: [null, [Validators.required]],
      // entre_price: [null, [Validators.required]],
      id: [null],
    });
    this.assignform = fb.group({
      student_list: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getSubscriptionList();
    this.getSubscriptionPlanName();
    this.getSubscriptionCurrency();
    //this.getCollegeList();
    this.getCollegeType();
    this.paymentList = [
      // { id: 1, name: "College Paytment" },
      { id: 2, name: "Student Payment" },
    ];
  }
  getSubscriptionList() {
    let data = {
      page: this.page,
      perpage: this.pageSize,
      admin: 1,
    };
    this.enterpriseService.getSubscriptions(data).subscribe((response) => {
      this.subscriptionList = response.list;
      this.totalCount = response.count;
    });
  }
  closeAccodion() {
    this.activeIndex = -1;
  }

  edit_payment_action: any;
  edit(data) {
    this.editSubscriptionDetails = data;
    this.buttonTitle = "Update";
    this.activeIndex = 0;

    this.subscriptionmangeriddforupdate = data.subscription_manager_id;

    let data1 = {
      collegeType: data.college_type,
    };
    this.enterpriseService
      .getSubscriptionCollegeList(data1)
      .subscribe((response) => {
        this.collegeList = [{ id: null, institutename: "Select" }, ...response];
      });

    this.edit_payment_action = data.payment_action;
    this.form.patchValue({
      formtype: data.college_type,
      college: data.institute_id,
      number_of_users: data.limits,
      paymenttype: data.payment_type_id,
      // career_price: data.career_price,
      premium_price: data.premium_price,
      subscription_currency: data.currency,
      // entre_price: data.entre_price,
      id: data.id,
    });
  }
  addOrUpdate() {
    //console.log(34);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let data: any = {
      college_id: this.form.value.college,
      college_type_id: this.form.value.formtype,
      limit: this.form.value.number_of_users,
      price: this.form.value.price_per_user,
      totalprice: this.form.value.total_price,
      validity: this.form.value.validity,
      payment_type: this.form.value.paymenttype,
      premium_price: this.form.value.premium_price,
      currency: this.form.value.subscription_currency,
      //  career_price: this.form.value.career_price,
      // entre_price: this.form.value.entre_price,
    };
    if (this.buttonTitle == "Create") {
      this.enterpriseService.addSubscription(data).subscribe((response) => {
        if (response.success == false) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: response.message,
          });
        } else {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });

          this.getSubscriptionList();
          this.submitted = false;
          // this.form.reset();
          this.resetLastFourFields();
          // this.formElm.nativeElement.reset();
        }
      });
      return;
    }
    data.subscription_manager_id = this.subscriptionmangeriddforupdate;
    data.id = this.form.value.id;
    this.enterpriseService.updateSubscription(data).subscribe((response) => {
      this.getSubscriptionList();
      this.submitted = false;
      // this.form.reset()
      this.resetLastFourFields();
      // this.formElm.nativeElement.reset();
      this.buttonTitle = "Create";
      this.activeIndex = -1;
      if (response.success == false) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: response.message,
        });
      } else {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
      }
    });
  }

  delete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to delete?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.enterpriseService.deleteSubscription(id).subscribe((response) => {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.getSubscriptionList();
        });
      },
      reject: () => {
        this.toast.add({
          severity: "error",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }
  get f() {
    return this.form.controls;
  }
  get a() {
    return this.assignform.controls;
  }
  pageChange(event: any) {
    this.pageSize = event.rows;
    this.page = event.first / this.pageSize + 1;
    this.first = event.first ?? 0;
    this.getSubscriptionList();
  }

  shareLink(sub) {
    this.student_details = sub;
    let data: any = {
      subscription_manager_id: Number(
        this.student_details?.subscription_manager_id
      ),
      payment_type: sub.payment_type,
    };
    this.enterpriseService.sendLink(data).subscribe((response) => {
      if (response.success == false) {
        this.toast.add({
          severity: "warn",
          summary: "Warning",
          detail: response.message,
        });
        return;
      }
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
      this.getSubscriptionList();
      navigator.clipboard.writeText(this.student_details.order_link);
    });
  }
  openAssignModel(sub) {
    this.showAssignModel = true;
    this.instituteDetails = sub;
    this.getStudentsFromInstitution(sub.institute_id);
  }
  assign() {
    this.assignSubmitted = true;
    this.enterpriseService
      .assignSubscription({
        subscription_manager_id: this.instituteDetails.subscription_manager_id,
        student_ids: this.assignform.value.student_list,
      })
      .subscribe((response) => {
        if (response.success == false) {
          this.toast.add({
            severity: "warn",
            summary: "Warning",
            detail: response.message,
          });
          return;
        }
        this.assignSubmitted = false;
        this.assignform.reset();
        this.assignformElm.nativeElement.reset();
        this.showAssignModel = false;
        this.getSubscriptionList();
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
      });
  }
  getSubscriptionPlanName() {
    this.enterpriseService.getSubscrptionPlans().subscribe((response) => {
      this.subscriptionPlanList = [{ id: null, name: "Select" }, ...response];
    });
  }
  getSubscriptionCurrency() {
    this.enterpriseService.currencydropdownlist().subscribe((response) => {
      this.subscriptionPlanCurrency = [
        { id: null, currency_code: "Select" },
        ...response,
      ];
      const inrOption = this.subscriptionPlanCurrency.find(
        (opt) => opt.currency_code === "INR"
      );
      if (inrOption) {
        this.form
          .get("subscription_currency")
          ?.setValue(inrOption.currency_code);
      }
    });
  }
  /*
  getCollegeList() {
    this.enterpriseService.getSubscriptionCollegeList().subscribe((response) => {
      this.collegeList = [{ id: null, institutename: "Select" }, ...response];
    });
  } */
  getCollegeType() {
    this.enterpriseService
      .getSubscriptionCollegeType()
      .subscribe((response) => {
        this.college_type = [
          { id: null, institute_type: "Select" },
          ...response,
        ];
      });
  }
  changeCollegeType(event: any) {
    // console.log(event.value);
    let data = {
      collegeType: event.value,
    };
    this.enterpriseService
      .getSubscriptionCollegeList(data)
      .subscribe((response) => {
        this.collegeList = [{ id: null, institutename: "Select" }, ...response];
      });
  }

  calculateTotal() {
    if (this.form.value.number_of_users && this.form.value.price_per_user) {
      this.form
        .get("total_price")
        .setValue(
          Number(this.form.value.number_of_users) *
            Number(this.form.value.price_per_user)
        );
    }
  }
  getStudentsFromInstitution(id: number) {
    this.enterpriseService
      .getStudentsFromInstitution(id)
      .subscribe((response) => {
        this.student_details = response.student_details;
      });
  }
  addcollegeorstudent: any;
  addnamecollegename: number = 0;
  adduserlimtpopup: number = 0;
  subscriptionmanageridaddusers: number = 0;
  addpaymenttypeid: number = 0;
  showHistory(id, paymenttype, sub) {
    this.addcollegeorstudent = sub.payment_type == 1 ? "College" : "Student";
    this.addnamecollegename = sub.institutename;
    this.adduserlimtpopup = sub.limits;
    this.subscriptionmanageridaddusers = id;
    this.addpaymenttypeid = sub.payment_type;
    this.historyModel = true;
    this.getAssignedHistory(id, paymenttype);
  }
  addeduser: number = 0;
  paiduser: number = 0;
  pendingpaymentuser: number = 0;
  remaininguser: number = 0;
  getAssignedHistory(id, paymenttype) {
    var data = {
      enterprise_subscription_id: id,
      payment_type_id: paymenttype,
    };

    this.enterpriseService.assignedHistory(data).subscribe((response: any) => {
      this.studentHistory = [];
      response.user_data.forEach((ele: any) => {
        var bindingdata = {
          assigned_by: ele.assigned_by,
          assigned_on: ele.assigned_on,
          country_name: ele.country_name,
          email: ele.email,
          enterprise_subscribers_id: ele.enterprise_subscribers_id,
          limits: ele.limits,
          order_link: ele.order_link,
          price: ele.price,
          status: ele.status,
          student_name: ele.student_name,
        };
        this.studentHistory.push(bindingdata);
      });
      this.addeduser = response.added_user;
      this.paiduser = response.paid_user;
      this.pendingpaymentuser = response.pending_payment_user;
      this.remaininguser = response.remaining_user;
    });
  }
  sentLinkSeperate(id: any) {
    var data = {
      enterprise_subscribers_id: id,
      payment_type: this.addcollegeorstudent,
    };
    this.enterpriseService.Sentalinkseperatly(data).subscribe((response) => {
      if (response.success == false) {
        this.toast.add({
          severity: "warn",
          summary: "Warning",
          detail: response.message,
        });
        return;
      }
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }
  sentLinkAllAdduser() {
    var data = {
      subscription_manager_id: this.subscriptionmanageridaddusers,
      payment_type: this.addpaymenttypeid,
    };
    this.enterpriseService.SentalinkAllAddUsers(data).subscribe((response) => {
      if (response.success == false) {
        this.toast.add({
          severity: "warn",
          summary: "Warning",
          detail: response.message,
        });
        return;
      }
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }
  uploadFile() {
    if (this.selectedFile) {
      var data = {
        file: this.selectedFile,
        subid: this.subscriptionmangesid,
        payment_type: this.payment_type_id,
      };
      this.enterpriseService.assignBulkUpload(data).subscribe(
        (response) => {
          this.selectedFile = null;
          if (response.status == "true") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.showAddUserModel = false;
            this.ngOnInit();
          } else {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
          }
        },
        (error) => {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        }
      );
    } else {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please choose file!",
      });
    }
  }
  sampledownload() {}
  subscriptionmangesid: any;
  userlimtpopup: number = 0;
  collegeorstudent: any;
  addusercound: number = 0;
  namecollegename: any;
  payment_type_id: number;
  adduserpopup(sub: any) {
    (this.showAddUserModel = true), (this.addusercound = sub.used);
    this.collegeorstudent = sub.payment_type == 1 ? "College" : "Student";
    this.payment_type_id = sub.payment_type;
    this.userlimtpopup = sub.limits;
    this.namecollegename = sub.institutename;
    this.subscriptionmangesid = sub.subscription_manager_id;
  }
  resetLastFourFields() {
    [
      "paymenttype",
      //  "career_price",
      "premium_price",
      //  "entre_price",
      "formtype",
      "college",
      "number_of_users",
      "id",
    ].forEach((controlName) => {
      this.form.get(controlName)?.reset(null, { emitEvent: false });
    });
  }
  // careerprice: any;
  // studentprice: any;
  // etreprice: any;
  premium_price: any;
  openPricingData(premium_price: any, careerprice: any, etreprice: any) {
    this.showViewPriceModel = true;
    this.premium_price = premium_price;
    //    this.etreprice = etreprice;
    //  this.studentprice = studentprice;
    // this.careerprice = careerprice;
  }
}
