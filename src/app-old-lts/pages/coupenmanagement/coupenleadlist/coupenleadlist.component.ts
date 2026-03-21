import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { filter, forkJoin, mergeMap, Observable, of } from "rxjs";

import {SelectModule} from "primeng/select";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Highcharts from 'highcharts';
import { ChartModule } from 'primeng/chart';
// import { stringify } from 'querystring';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserFacadeService } from '../../users/user-facade.service';
import { PageFacadeService } from '../../page-facade.service';
import { SubscriptionService } from '../../subscription/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberService } from '../../subscribers/subscriber.service';
import { SubscriptionPlan } from 'src/app/@Models/subscription';
import { UserType } from 'src/app/@Models/user.model';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
    selector: 'uni-coupenleadlist',
    templateUrl: './coupenleadlist.component.html',
    styleUrls: ['./coupenleadlist.component.scss'],
    imports: [CommonModule, ConfirmDialogModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule,
        DatePickerModule],
    providers: [ConfirmationService]
})
export class CoupenleadlistComponent implements OnInit {

  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  // form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  pageSize = 50;
  genderoption = [
    { name: "Select", code: null },
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Others", code: "O" },
  ];
  users: any[] = [
  ];
  subscriberObj = {};
  page: number = 1;
  subscriptions: any = [];
  subscriptions$!: Observable<SubscriptionPlan[]>;
  today = new Date();
  usersCount: number = 0;
  programLevels: any = [];
  countries: any = [];
  userTypes: any = [];
  locations: any = [];
  region: any = [];
  leadList: any = [];
  leadTypeList: any = [];
  credits: any = [];
  sourceTypes: any = [];
  leadType: any = [];
  first: number = 0;
  source;
  sourcetype;
  adminuser = true;
  coupenid: any;
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder,
    private pageService: PageFacadeService, private subscriptionService: SubscriptionService, private subsciberService: SubscriberService, private authService: AuthService,
    private route: ActivatedRoute,private toastr: MessageService,) {
    this.filterForm = fb.group({
      name: [''],
      email: [''],
      phone: [''],
      country: [''],
      region: [''],
      location_id: [''],
      lead_status: [''],
      last_degree_passing_year: [''],
      lead_type: [''],
      source: [''],
      user_type: [''],
      programlevel_id: ['']
    });
  }

  ngOnInit(): void {
    this.initGetSubscribers();
    // this.loadSubscriptions();
    this.getUserTypeList();
    this.getCountryList();
    this.getProgramLevelList();
    this.getLocationList();
    this.getCreditsList();
    this.getRegionList();
    this.getLeadList();
    this.getLeadType();
    this.getSourceTypeList();

    // coupen id taken with url
    this.route.paramMap.subscribe(params => {
      this.coupenid = params.get('coupenid'); // Get the 'value' parameter from the URL
    });
  }
  get f() {
    return this.filterForm.controls;
  }

  initGetSubscribers() {
    this.authService.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
      if (res[0].usertype_id == 7) {
        this.adminuser = false;
        this.source = res[0].source;
        this.sourcetype = res[0].source_type;
        this.subscriberObj = {
          page: this.page,
          perpage: this.pageSize,
          source_name: this.source,
        }
        this.getSubscribers(this.subscriberObj);
      } else {
        this.subscriberObj = {
          page: this.page,
          perpage: this.pageSize,
          coupon_id:this.coupenid
        }
        this.getSubscribers(this.subscriberObj);
      }
    });


  }

  getSubscribers(value: any) {
    this.subsciberService.getcoupenleadlist(value).subscribe(response => {
      this.users = response.data;
      this.usersCount = response.TotalRecords;
    });
  }

  loadSubscriptions() {
    this.subscriptionService.loadSubscriptionList();
    this.subscriptions$ = this.subscriptionService.getSubscriptionList();
    this.subscriptions$.subscribe(response => {
      this.subscriptions = [{ id: null, subscription: 'Select' }, ...response]
    });
  }


  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    let data = {
      page: this.page,
      perPage: this.pageSize,
      coupon_id:this.coupenid
    };
    this.getSubscribers(data);
  }
  filtersubmit() {
    const formData = this.filterForm.value;
    let data: any = {
      page: 1,
      perpage: this.pageSize,
      coupon_id:this.coupenid
    };
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.email) {
      data.email = formData.email;
    }
    if (formData.phone) {
      data.phone = formData.phone;
    }
    if (formData.country) {
      data.interested_country_id = formData.country;
    }
    if (formData.region) {
      data.region_id = formData.region;
    }
    if (formData.location_id) {
      data.location_id = formData.location_id;
    }
    if (formData.lead_status) {
      data.login_status = formData.lead_status;
    }
    if (formData.last_degree_passing_year) {
      data.last_degree_passing_year = formData.last_degree_passing_year.getFullYear();
    }
    if (formData.lead_type) {
      data.student_type_id = formData.lead_type;
    }
    if (formData.source) {
      data.source_type = formData.source;
    }
    if (formData.programlevel_id) {
      data.programlevel_id = formData.programlevel_id;
    }
    if (formData.user_type) {
      data.usertype_id = formData.user_type;
    }
    this.first = 0;
    this.subscriberObj = data;
    this.getSubscribers(this.subscriberObj);
  }


  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  redirectpage(id: number) {
    this.router.navigate(['/subscribers/editprofile/' + id]);
  }

  getRegionList() {
    this.pageService.getRegion().subscribe(response => {
      this.region = response;
    });
  }
  getLeadList() {
    this.pageService.getLeadStatus().subscribe(response => {
      this.leadList = response;
    });
  }
  getUserTypeList() {
    this.pageService.getUserTypes().subscribe(response => {
      this.userTypes = response.data;
    });
  }
  getCountryList() {
    this.pageService.getCountries().subscribe(response => {
      this.countries = response;
    });
  }
  getProgramLevelList() {
    this.pageService.getProgaramLevels().subscribe(response => {
      this.programLevels = response;
    });
  }
  getLocationList() {
    this.pageService.getLocations().subscribe(response => {
      this.locations = response;
    });
  }
  getCreditsList() {
    this.pageService.getCredits().subscribe(response => {
      this.credits = response.questioncredits;
    });
  }
  getSourceTypeList() {
    this.pageService.getSourceTypes().subscribe(response => {
      this.sourceTypes = response;
    });
  }
  getLeadType() {
    this.pageService.getStudentType().subscribe(response => {
      this.leadType = response;
    });
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.initGetSubscribers();
  }
  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.email) {
      data.email = formData.email;
    }
    if (formData.phone) {
      data.phone = formData.phone;
    }
    if (formData.country) {
      data.interested_country_id = formData.country;
    }
    if (formData.region) {
      data.region_id = formData.region;
    }
    if (formData.location_id) {
      data.location_id = formData.location_id;
    }
    if (formData.lead_status) {
      data.login_status = formData.lead_status;
    }
    if (formData.last_degree_passing_year) {
      data.last_degree_passing_year = formData.last_degree_passing_year.getFullYear();
    }
    if (formData.lead_type) {
      data.student_type_id = formData.lead_type;
    }
    if (formData.source) {
      data.source_type = formData.source;
    }
    if (formData.programlevel_id) {
      data.programlevel_id = formData.programlevel_id;
    }
    if (formData.user_type) {
      data.usertype_id = formData.user_type;
    }
    this.subsciberService.studentExport(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  deletestudent(id: number) {
    var data = {
      userId: id
    }
    this.subsciberService.deleteinternalusers(data).subscribe((response) => {
      this.toastr.add({
        severity: "success",
        summary: "Success",
        detail: "Removed Successfully",
      });
      window.location.reload();
    });
  }

}

