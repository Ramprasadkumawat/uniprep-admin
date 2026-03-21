import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import {SelectModule} from "primeng/select";
import { DatePickerModule } from 'primeng/datepicker';
import { PageFacadeService } from "../../page-facade.service";
import { SubscriberService } from "../subscriber.service";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/Auth/auth.service";
import { InputNumberModule } from "primeng/inputnumber";
// import { error } from "console";
import { UserFacadeService } from "../../users/user-facade.service";
import { NgxIntlTelInputModule, SearchCountryField } from "ngx-intl-tel-input";
import { SubscriptionService } from "../../subscription/subscription.service";
import { SubscriptionPlan } from "src/app/@Models/subscription";
import { LocationService } from "src/app/location.service";
import { filter } from "rxjs";
import { ToastModule } from "primeng/toast";
@Component({
    selector: "uni-add-subscriber",
    imports: [
        CommonModule,
        AccordionModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        NgxIntlTelInputModule,
        ToastModule,
    ],
    templateUrl: "./add-subscriber.component.html",
    styleUrls: ["./add-subscriber.component.scss"]
})
export class AddSubscriberComponent implements OnInit {
  @ViewChild('addFormElm') addFormElm!: ElementRef;
  submitted: boolean = false;
  form: FormGroup;
  programLevels: any = [];
  countries: any = [];
  StudentType: any = [];
  EnterpriseSubscription: any = [];
  credits: any = [];
  subscriptions: any = [];
  sourceTypes: any = [];
  sourceName: any = [];
  sourceNameTwo: any = [];
  notadmin = true;
  sourcetype;
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
  source;
  genderoption = [
    { name: "Select", code: null },
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Others", code: "O" },
  ];
  today = new Date();
  selectedFile: any;
  usertypeid: any;
  customSourceName: string = "Source Name";
  couponList = [
    { id: null, name: "Select" },
    { id: 1, name: "ASDF" },
    { id: 2, name: "ZXCV" },
    { id: 3, name: "QWER" },
  ];
  currentDate = new Date();
  selectedDate = new Date();
  dateTime = new Date();
  currentUserId!: number;
  maximumTime = new Date();
  currentDegreeList: any[] = [];
  currentSpecializationList: any = [];
  currentStudyYearList: any = [];
  homeCountries: any[] = [];
  isCollegeSelected: boolean = false;
  locationList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pageService: PageFacadeService,
    private subscriberService: SubscriberService,
    private toast: MessageService,
    private authService: AuthService,
    private userFacade: UserFacadeService,
    private subscriptionService: SubscriptionService,
    private locationService: LocationService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: [null],
      //phone: [null, [Validators.required, this.phoneNumberValidator()]],
      gender: [null, [Validators.required]],
      country_id: ["", [Validators.required]],
      location_id: [null, [Validators.required]],
      programlevel_id: [null, [Validators.required]],
      source_type: [null, [Validators.required]],
      // interested_country_id: [null, [Validators.required]],
      last_degree_passing_year: [""],
      source_name: [null],
      source_name_two: [null],
      student_type: [null, [Validators.required]],
      // enterprise_subscription: [null],
      // region_id: [null, [Validators.required]],
      // intake_month_looking: [null],
      // intake_year_looking: [null],
      // college_ref_id: [null],
      whatsapp_phoneno: [null],
      //  current_degree_id: [null, [Validators.required]],
      current_specialization_id: [null],
      // current_study_years_id: [null],
      subscription_id: [null],
    });
  }
  ngOnInit(): void {
    this.authService.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        if (res[0].usertype_id == 7) {
          this.usertypeid = 7;
          this.sourcetype = res[0].source_type;
          this.source = res[0].source;
          this.notadmin = false;
        }
        this.currentUserId = res[0].usertype_id;
      });
    this.getStudentType();
    this.getCountryList();
    this.getProgramLevelList();
    //this.loadLocationList();
    this.getCreditsList();
    // this.getSourceTypeList();
    this.dateTime.setDate(this.dateTime.getDate());
    // this.getEnterpriseCollegeList();
    this.loadSubscriptions();
    this.getHomeCountryList();
  }
  get f() {
    return this.form.controls;
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptionDropdownList({ freetrail_flag: 1 }).subscribe((response) => {
      this.subscriptions = response.subscriptions.map(
        (sub: SubscriptionPlan) => ({
          id: sub.id,
          subscription: sub.subscription_plan,
        })
      );
      this.subscriptions = [
        { id: null, subscription: "Select" },
        ...this.subscriptions,
      ];
    });
  }
  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      const pattern = /^[0-9]{10,}$/; // Match 10 or more digits
      if (!pattern.test(phoneNumber)) {
        return { minlength: true };
      }
      return null;
    };
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.usertypeid == 7) {
      const value = this.form.value;
      if (typeof this.form.value.last_degree_passing_year == 'object') {
        value.last_degree_passing_year = this.form.value.last_degree_passing_year
          ? this.form.value.last_degree_passing_year?.getFullYear()
          : "";
      }
      else {
        value.last_degree_passing_year = this.form.value.last_degree_passing_year;
      }

      value.source_type = this.sourcetype;
      value.source = this.source;


      if (typeof this.form.value.intake_month_looking == 'object') {
        value.intake_month_looking = this.form.value?.intake_month_looking?.getMonth();
      }
      else {
        value.intake_month_looking = this.form.value.intake_month_looking;
      }
      if (typeof this.form.value.intake_year_looking == 'object') {
        value.intake_year_looking = this.form.value.intake_year_looking
          ? this.form.value.intake_year_looking?.getFullYear()
          : "";
      }
      else {
        value.intake_year_looking = this.form.value.intake_year_looking;
      }
      this.subscriberService.addStudent({ ...value, phone_number: this.form?.value?.phone?.number, whatsapp_phone: this.form?.value?.whatsapp_phoneno?.number, subscription_id: this.form.value.subscription_id?.number }).subscribe(
        (response) => {
          this.form.reset();
          this.addFormElm.nativeElement.reset();
          if (response.status == "success") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.router.navigate(["/subscribers"]);
          }
          if(response.status != "success") {
            console.log(response.message);
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
          }
        },
        (error) => {
          console.log(error);
          // this.toast.add({
          //   severity: "error",
          //   summary: "Error",
          //   detail: error.message,
          // });
          // // this.router.navigate(["/subscribers"]);
        }
      );
    } else {
      const value = this.form.value;

      if (typeof this.form.value.last_degree_passing_year == 'object') {
        value.last_degree_passing_year = this.form.value.last_degree_passing_year
          ? this.form.value.last_degree_passing_year?.getFullYear()
          : "";
      }
      else {
        value.last_degree_passing_year = this.form.value.last_degree_passing_year;
      }

      value.source = value.source_name;
      if (typeof this.form.value.intake_month_looking == 'object') {
        value.intake_month_looking = this.form.value?.intake_month_looking?.getMonth();
      }
      else {
        value.intake_month_looking = this.form.value.intake_month_looking;
      }


      if (typeof this.form.value.intake_year_looking == 'object') {
        value.intake_year_looking = this.form.value.intake_year_looking
          ? this.form.value.intake_year_looking?.getFullYear()
          : "";
      }
      else {
        value.intake_year_looking = this.form.value.intake_year_looking;
      }

      this.subscriberService.addStudent({ ...value, phone_number: this.form?.value?.phone?.number, whatsapp_phone: this.form?.value?.whatsapp_phoneno?.number }).subscribe(
        (response) => {
          this.form.reset();
          this.addFormElm.nativeElement.reset();
          if (response.status == "success") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.router.navigate(["/subscribers"]);
          }
        },
        (error) => {
          // this.toast.add({
          //   severity: "error",
          //   summary: "Error",
          //   detail: error.message,
          // });
          // this.router.navigate(["/subscribers"]);
        }
      );
    }
  }

  getSourceTypeList(value: number) {
    this.pageService.getSourceTypes(value).subscribe((response) => {
      this.sourceTypes = [{ id: null, name: "Select" }, ...response];
    });
  }
  getCountryList() {
    this.pageService.getCountries().subscribe((response) => {
      this.countries = [{ id: null, country: "Select" }, ...response];
    });
  }
  getProgramLevelList() {
    this.pageService.getProgaramLevels().subscribe((response) => {
      this.programLevels = [{ id: null, programlevel: "Select" }, ...response];
    });
  }

  getCreditsList() {
    this.pageService.getCredits().subscribe((response) => {
      this.credits = [
        { id: null, name: "Select" },
        ...response.questioncredits,
      ];
    });
  }

  getStudentType() {
    this.pageService.getStudentType().subscribe((response) => {
      this.StudentType = [{ id: null, subtypeName: "Select" }, ...response];
    });
  }
  getEnterpriseCollegeList() {
    this.pageService.getEnterpriseCollegeList().subscribe((response) => {
      this.EnterpriseSubscription = [{ id: null, institutename: "Select" }, ...response];
    });
  }

  changeStudentType(event: any) {
    this.getSourceTypeList(event.value);
  }

  changeSourceType(event: any) {
    this.isCollegeSelected = false;
    if (event.value == 2) {
      this.customSourceName = "Institution Name";

      let data: any = {
        source: event.value.toString(),
      };
      if (this.form.get('location_id').value !== 0) {
        data.location_id = this.form.get('location_id').value;
      }

      this.pageService.getSourceNameBySoucreId(data).subscribe((response) => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
      this.isCollegeSelected = true;
      this.currentSpecializationList = [{ id: null, specialization_name: "Select" }];
      this.subscriberService.getcurrentspecialization().subscribe((response) => {
        this.currentSpecializationList = [{ id: null, specialization_name: "Select" }, ...response];
      });
      return;
    } else if (event.value == 11) {
      this.customSourceName = "Company";
    } else if (event.value == 7 || event.value == 8) {
      this.customSourceName = "Users";
    } else if (event.value == 4) {
      this.customSourceName = "User";
    } else {
      this.customSourceName = "Source Name";
    }
    this.pageService
      .getSourceName(this.form.value.source_type)
      .subscribe((response) => {
        this.sourceName = [{ id: null, source_name: "Select" }, ...response];
      });

    this.form.get('current_specialization_id').setValue(null);


  }
  changeSourceName() {
    const source_type_id = this.form.value.source_type;
    const source_id = this.form.value.source_name;
    this.pageService
      .getSourceNameTwo(source_type_id, source_id)
      .subscribe((response) => {
        this.sourceNameTwo = [{ id: null, source_name: "Select" }, ...response];
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
      this.subscriberService.studentBulkUpload(this.selectedFile).subscribe(
        (response) => {
          this.selectedFile = null;
          if (response.status == "true") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
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


  yearChage(event: any) {
    this.form.get('intake_month_looking')?.setValue('');
    let intakeYearValue = this.form.get('intake_year_looking')?.value;
    let intakeYear = intakeYearValue.toString().split(' ')[3];
    this.maximumTime.setFullYear(intakeYear);

    this.maximumTime.setMonth(11);
    if (this.dateTime?.getFullYear() != intakeYear && this.currentDate?.getFullYear() != intakeYear) {
      this.dateTime = new Date(intakeYear, 0, 1);
    }
    else {
      this.dateTime = new Date(intakeYear, this.currentDate?.getMonth(), 1);
    }
  }


  intializePhoneNo() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
      console.log(data.country_code.toLocaleLowerCase());
      this.preferredCountry = data.country_code.toLocaleLowerCase()
    });
  }
  onChangeContact(event: any) {
    /* this.showContactErrorIcon = false;
     if (event?.target?.value?.length != 0) {
       this.showContactErrorIcon = true;
       this.registerFormInvalid = true;
     } else {
       this.validNumberRequired = false;
       this.registerFormInvalid = false;
     }
       */
  }
  onChangeCurrentEducation(event: any) {
    this.form.get('current_degree_id').setValue(null);
    this.form.get('current_specialization_id').setValue(null);
    this.form.get('current_study_years_id').setValue(null);
    if (event.value != 1) {
      this.form.controls["current_specialization_id"].setValidators(Validators.required);
      this.form.controls["current_specialization_id"].updateValueAndValidity();
      this.form.controls["current_study_years_id"].setValidators(Validators.required);
      this.form.controls["current_study_years_id"].updateValueAndValidity();
    } else {
      this.form.controls["current_specialization_id"].setErrors(null);
      this.form.get('current_specialization_id').clearValidators();
      this.form.controls["current_specialization_id"].updateValueAndValidity();
      this.form.controls["current_study_years_id"].setErrors(null);
      this.form.get('current_study_years_id').clearValidators();
      this.form.controls["current_study_years_id"].updateValueAndValidity();
    }
    this.currentDegreeList = [{ id: null, degree_name: "Select" }];
    if (event.value) {
      this.subscriberService.getdegreename(event.value).subscribe((response) => {
        this.currentDegreeList = [{ id: null, degree_name: "Select" }, ...response];
      });
    }
  }

  changeCountry(event: any) {
    // if (this.form.get('home_country').value == 122) {
    // this.form.get('location')?.enable();
    // this.form.get('location')?.reset();
    this.locationList = [];
    var data = {
      country_id: this.form.get('country_id').value
    }
    this.locationService.getAllCountryLocation(data).subscribe(
      (res: any) => {
        this.locationList = res.data;
      },
      (error: any) => {
        this.toast.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
    // }
    // else {
    //   this.locationList = [{ id: 0, district: "Others", state: "Others" }];
    //   this.form.get('location').setValue(0);
    //   this.form.get('location')?.disable();
    // }
  }
  getHomeCountryList() {
    this.subscriberService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homeCountries = [{ country: "Select", code: null }, ...res];
        this.form.get('home_country')?.reset();
      },
      (error: any) => {
        this.toast.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }
}
