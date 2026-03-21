import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import { SelectModule } from "primeng/select";
import { TextareaModule } from 'primeng/textarea';
import { combineLatest, filter, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserFacadeService } from '../users/user-facade.service';
import { PageFacadeService } from '../page-facade.service';
import { DatePickerModule } from 'primeng/datepicker';
import { SubscriberService } from './subscriber.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { MessageService } from "primeng/api";
import { ActivatedRoute } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';
import { LocationService } from 'src/app/location.service';
import { MarketingorgService } from '../partneruser/marketingorg.service';
import { Store } from '@ngrx/store';
import { Subscriber } from 'src/app/@Models/subscribers.model';
import { selectLoading$, selectSubscribers$ } from '../store/selectors';
import { clearSubscribers, loadSubscribers } from '../store/actions';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'uni-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss'],
  imports: [
    CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
    TextareaModule, ReactiveFormsModule, DatePickerModule, MultiSelectModule, NgxIntlTelInputModule, ButtonModule
  ]
})
export class SubscribersComponent implements OnInit, OnDestroy {
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  // userTypes$!: Observable<UserType[]>;
  // userTypesWithAll$!: Observable<UserType[]>;
  // form: FormGroup;
  private destroy$ = new Subject<void>();
  filterForm: FormGroup;
  submitted = false;
  pageSize = 50;
  // pageSize$ = new BehaviorSubject<number>(500);
  first = 4;
  genderoption = [
    { name: "Select", code: null },
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Others", code: "O" },
  ];
  users: any[] = [];
  subscriberObj: any = {};
  page: number = 1;
  subscriptions: any = [];
  today = new Date();
  usersCount: number = 0;
  paginationUserCount: number = 1000;
  programLevels: any = [];
  countries: any = [];
  userTypes: any = [];
  leadList: any = [];
  leadTypeList: any = [];
  credits: any = [];
  sourceTypes: any = [];
  leadType: any = [];
  source;
  sourcetype;
  adminuser = true;
  sourceName: any = [];
  sourceNameTwo: any = [];
  subList: any;
  totalRevenue: number = 0;
  totaltalents: number = 0;
  totalintrovideo: number = 0;
  totalVarified: number = 0;
  totalNotVarified: number = 0;
  totalPaid: number = 0;
  todayCount: any;
  totalPercentages: any;
  leadDashboardFilters: any = {};
  coBranding: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  hide_demo: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  talentUsers: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
    { value: 2, label: 'Partial' },
  ];
  deviceTypes: any[] = [
    { label: 'Desktop', value: 'Desktop' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Tablet', value: 'Tablet' },
  ]
  statusOptions = [
    { label: 'Very Happy', value: 'Very Happy' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Unhappy', value: 'Unhappy' },
    { label: 'No Status', value: 'No Status' },
    { label: 'RNR', value: 'RNR' },
    { label: 'Busy', value: 'Busy' },
    { label: 'Not Interested', value: 'Not Interested' },
  ];
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
  locationListFilter: any[] = [];
  locationList: any[] = [];
  homeCountries = [];
  assignToDropdownList: any[] = [];
  userBehaviour: any[] = [];
  orgId: string | null = null;
  paidLeadsRedirectionId: number | null = null;
  isHidePaidLeadsRedirect: boolean = true;
  isShowOnlyAfterPaginationorfilter: boolean = false;
  GetCountText: any = 'Get Count'
  subscribers$: Observable<Subscriber[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pageSize$ = this.subsciberService.pageSize$;
  jobId: number | null = null;
  appliedJobId: number | null = null;
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder, private route: Router, private service: MarketingorgService,
    private pageService: PageFacadeService, private locationService: LocationService, private subsciberService: SubscriberService, private authService: AuthService, private toastr: MessageService, private activatedRoute: ActivatedRoute,
    private store: Store) {
    this.filterForm = fb.group({
      name: [''],
      email: [''],
      phone: [''],
      country: [''],
      hm_country: [''],
      location_id: [''],
      lead_status: [''],
      last_degree_passing_year: [''],
      source: [''],
      user_type: [''],
      programlevel_id: [''],
      fromDate: [''],
      toDate: [''],
      fromDateFollowUp: [''],
      toDateFollowUp: [''],
      talent_users: [''],
      source_job: [''],
      remarks: [''],
      fromDateUserLogIn: [''],
      toDateUserLogIn: [''],
      assign_to: [''],
      intro_video: [''],
      device_type: [''],
      user_behaviour: [''],
      hide_demo_account: [''],
      talent_id:[''],
    });
    this.subscribers$ = this.store.select(selectSubscribers$);
    this.loading$ = this.store.select(selectLoading$);
  }

  ngOnInit(): void {
    //this.dataLoading()
    this.initializePhoneNo();
    this.getUserTypeList();
    this.getCountryList();
    this.getProgramLevelList();
    this.getCreditsList();
    this.getLeadList();
    this.getLeadType();
    this.getSourceTypeList();
    this.getSubscriptionList();
    this.getHomeCountryList();
    this.getAssignTo();
    this.userBehaviours();

    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParams
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([paramMap, queryParams]) => {
      this.handleRouteParams(paramMap, queryParams);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleRouteParams(paramMap: any, queryParams: any) {
    this.jobId = queryParams['job_id'] || null;
    this.appliedJobId = queryParams['applied_jobid'] || null;
    this.orgId = paramMap.has('id') ? paramMap.get('id') : null;

    let data: any = {
      page: 1,
      perpage: this.pageSize,
    };

    if (this.jobId) {
      data.job_id = this.jobId;
    }

    if(this.appliedJobId) {
      data.applied_jobid = this.appliedJobId;
    }

    if (this.orgId) {
      data.org_id = this.orgId;
    }

    // dashboard filters
    switch (queryParams.filter) {
      case 'paidUsers':
        data.login_status = [1, 3];
        break;
      case 'activePaidLeads':
        data.login_status = 1;
        break;
      case 'exhuastedUsers':
        data.login_status = 3;
        break;
      case 'unPaidLoggedinUsers':
        data.login_status = 2;
        break;
      case 'unPaidNotLoggedinUsers':
        data.login_status = 4;
        break;
      case 'directUsers':
        data.student_type_id = 1;
        break;
      case 'collegeUsers':
        data.student_type_id = 2;
        break;
    }

    this.paidLeadsRedirectionId = queryParams.type ? 1 : null;
    this.isHidePaidLeadsRedirect = !queryParams.type;

    this.leadDashboardFilters = data;
    this.subscriberObj = data;

    this.store.dispatch(clearSubscribers());
    this.initGetSubscribers();
  }

  initializePhoneNo() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
        this.preferredCountry = data.country_code.toLocaleLowerCase()
    });
  }
  dataLoading() {
    this.pageSize = this.pageSize$.value
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        let data: any = {
          page: 1,
          perpage: this.pageSize,
          ...params
        };

        if (params.filter == "paidUsers") {
          data.login_status = [1, 3];
        }
        if (params.filter == "paidUsersWithFilters") {
          data.login_status = [1, 3];
          // data.home_country_id = params.country; //i changed in the user dashboard component directly so i removed
        } else if (params.filter == "activePaidLeads") {
          data.login_status = 1;
        } else if (params.filter == "exhuastedUsers") {
          data.login_status = 3;
        } else if (params.filter == "unPaidLoggedinUsers") {
          data.login_status = 2;
        } else if (params.filter == "unPaidNotLoggedinUsers") {
          data.login_status = 4;
        } else if (params.filter == "directUsers") {
          data.student_type_id = 1;
        } else if (params.filter == "collegeUsers") {
          data.student_type_id = 2;
        }
        this.leadDashboardFilters = data;
        this.subscriberObj = data
        this.activatedRoute.paramMap.subscribe(params => {
          if (params.has('id')) {
            this.activatedRoute.queryParams.subscribe(params => {
              if (params['type']) {
                this.paidLeadsRedirectionId = 1;
                this.isHidePaidLeadsRedirect = false;
              } else {
                this.paidLeadsRedirectionId = null;
              }
            });
            this.orgId = params.get('id');
            this.initGetSubscribers();
          } else {
            this.orgId = null;
            this.getSubscribers(this.subscriberObj);
          }
        });
      } else {
        this.activatedRoute.paramMap.subscribe(params => {
          if (params.has('id')) {
            this.orgId = params.get('id');
            this.initGetSubscribers();

          } else {
            this.orgId = null;
            this.initGetSubscribers();
          }
        });
  }
    })
  }
  getAssignTo() {
    this.assignToDropdownList = []
    this.service.getViewStudentAssignTo().subscribe((res: any) => {
      this.assignToDropdownList = [
        { id: 0, name: 'Not Assigned' },
        ...res.data
      ];
    })
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
  get f() {
    return this.filterForm.controls;
  }

  initGetSubscribers() {
    this.authService.getUserDetails$
      .pipe(
        filter(user => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        const isAdmin = res[0].usertype_id !== 7;

        const updatedParams = {
          ...this.subscriberObj,
          login_status: this.paidLeadsRedirectionId,
          source_name: !isAdmin ? res[0].source : undefined
        };

        this.getSubscribers(updatedParams);
      });
  }

  getSubscribers(value: any) {
    // this.subsciberService.getSubscribers(value).subscribe(response => {
    //   this.users = response.data;
    // });
    this.store.dispatch(loadSubscribers({ params: value }));
  }
  getSubscribersCount(value: any) {
    this.subsciberService.getSubscribersCount(value).subscribe(response => {
      this.usersCount = response.TotalRecords;
      this.totalRevenue = response.TotalRevenue;
      this.totaltalents = response.TotalTalentProfile;
      this.totalintrovideo = response.TotalIntroCount;
      this.paginationUserCount = response.TotalRecords;
      this.totalNotVarified = response.NotVerifiedUsers;
      this.totalPaid = response.PaidUsers;
      this.totalVarified = response.VerifiedUsers
      this.todayCount = response.Today
      this.totalPercentages = response.TotalPercentages
      this.GetCountText = 'Refresh Count'
    });
  }




  pageChange(event: any) {
    this.store.dispatch(clearSubscribers());
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.subsciberService.setPageSize(event.rows);
    this.first = event.first ?? 0;
    this.subscriberObj = {
      ...this.subscriberObj,
      page: this.page,
      perpage: this.pageSize,
    };
    this.getSubscribers(this.subscriberObj)
    this.getSubscribersCount(this.subscriberObj)
  }
  filtersubmit() {
    const formData = this.filterForm.value;

    let data: any = {
      page: 1,
      perpage: 50,
    };
    data = { ...this.leadDashboardFilters };
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.subsciption) {
      data.subsciption = formData.subsciption;
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
    if (formData.hm_country) {
      data.home_country_id = formData.hm_country;
    }
    if (formData.subscription_id) {
      data.subscription_id = formData.subscription_id;
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
      data.source_name = formData.user_type;
    }
    if (formData.fromDate) {
      data.fromdate = this.changeYearFormat(formData.fromDate);
    }
    if (formData.toDate) {
      data.todate = this.changeYearFormat(formData.toDate);
    }
    if (formData.fromDateFollowUp) {
      data.follow_upFrom = this.changeYearFormat(formData.fromDateFollowUp);
    }
    if (formData.toDateFollowUp) {
      data.follow_upTo = this.changeYearFormat(formData.toDateFollowUp);
    }
    if (formData.remarks) {
      data.remarks = formData.remarks;
    }
    if (formData.assign_to) {
      data.assign_to = formData.assign_to;
    }
    data.talent_users = formData.talent_users;
    data.user_behaviour = formData.user_behaviour
    data.device_type = formData.device_type
    if (formData.source_job) {
      data.source_job = formData.source_job;
    }
    if (formData.fromDateUserLogIn) {
      data.usersFrom = this.changeYearFormat(formData.fromDateUserLogIn);
    }
    if (formData.toDateUserLogIn) {
      data.usersTo = this.changeYearFormat(formData.toDateUserLogIn);
    }
    if (formData.intro_video != "") data.intro_video = formData.intro_video
    if(formData.talent_id != "") data.talent_id = formData.talent_id
    if (formData.hide_demo_account != "") data.hide_demo_account = formData.hide_demo_account
    if (this.orgId != "") data.org_id = this.orgId
    if (formData.login_status != "") data.login_status = formData.lead_status
    this.store.dispatch(clearSubscribers());
    this.first = 0;
    this.subscriberObj = data;
    this.subsciberService.setPageSize(50);
    this.getSubscribers(this.subscriberObj);
    this.getSubscribersCount(this.subscriberObj)
  }


  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  redirectpage(user: any) {
    localStorage.setItem("usertypeidforeditprofile", user.usertype_id)
    this.router.navigate(['/subscribers/editprofile/' + user.user_id]);
  }
  getLeadList() {
    this.pageService.getLeadStatus().subscribe(response => {
      this.leadList = [{ id: null, status_name: "Select" }, ...response];
    });
  }
  getUserTypeList() {
    this.pageService.getUserTypes().subscribe(response => {
      this.userTypes = [{ id: null, type: "Select" }, ...response.data];
    });
  }
  getCountryList() {
    this.pageService.getCountries().subscribe(response => {
      this.countries = [{ id: null, country: "Select" }, ...response];
    });
  }


  getProgramLevelList() {
    this.pageService.getProgaramLevels().subscribe(response => {
      this.programLevels = [{ id: null, programlevel: "Select" }, ...response];
    });
  }
  getCreditsList() {
    this.pageService.getCredits().subscribe(response => {
      this.credits = [{ id: null, name: "Select" }, ...response.questioncredits];
    });
  }
  getSourceTypeList() {
    this.pageService.getSourceTypesNoPayLoads().subscribe(response => {
      this.sourceTypes = [{ id: null, name: "Select" }, ...response];
    });
  }
  getLeadType() {
    this.pageService.getStudentType().subscribe(response => {
      this.leadType = [{ id: null, subtypeName: "Select" }, ...response];
    });
  }
  userBehaviours() {
    this.pageService.userBehaviour().subscribe(response => {
      this.userBehaviour = response.data;
    });
  }

  resetFilter() {
    this.store.dispatch(clearSubscribers());
    this.subsciberService.setPageSize(50);
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.dataLoading();
    this.locationList = [];
    this.getSubscribersCount(this.subscriberObj)
  }

  refreslist() {
    this.store.dispatch(clearSubscribers());
    this.subsciberService.setPageSize(50);
    this.dataLoading();
  }
  exportFile() {
    let data: any = {};
    if (this.leadDashboardFilters) {
      this.leadDashboardFilters.perpage = 2000;
      data = this.leadDashboardFilters
    }
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
    if (formData.hm_country) {
      data.home_country_id = formData.hm_country;
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
    if (formData.fromDateUserLogIn) {
      data.usersFrom = this.changeYearFormat(formData.fromDateUserLogIn);
    }
    if (formData.toDateUserLogIn) {
      data.usersTo = this.changeYearFormat(formData.toDateUserLogIn);
    }
    if (formData.user_type) {
      data.source_name = formData.user_type;
    }
    if (formData.fromDateFollowUp) {
      data.follow_upFrom = this.changeYearFormat(formData.fromDateFollowUp);
    }
    if (formData.toDateFollowUp) {
      data.follow_upTo = this.changeYearFormat(formData.toDateFollowUp);
    }
    if (formData.remarks) {
      data.remarks = formData.remarks;
    }
    if (formData.assign_to) {
      data.assign_to = formData.assign_to;
    }
    if (formData.talent_users !== "") data.talent_users = formData.talent_users;

    if (formData.source_job) {
      data.source_job = formData.source_job;
    }
    if (formData.intro_video != "") data.intro_video = formData.intro_video
    if (formData.hide_demo_account != "") data.hide_demo_account = formData.hide_demo_account
    if (formData.lead_status != "") data.login_status = formData.lead_status
    data.talent_users = formData.talent_users;
    data.user_behaviour = formData.user_behaviour
    data.device_type = formData.device_type
    if (formData.fromDateUserLogIn) {
      data.usersFrom = this.changeYearFormat(formData.fromDateUserLogIn);
    }
    if (formData.toDateUserLogIn) {
      data.usersTo = this.changeYearFormat(formData.toDateUserLogIn);
    }
    if (this.orgId != "") data.org_id = this.orgId
    this.subsciberService.studentExport(data).subscribe((response) => {
      window.open(response.link, "_blank");
    });
  }

  // deletestudent(id: number) {
  //   var data= {
  //     userId:id
  //   }
  //   this.subsciberService.deleteinternalusers(data).subscribe((response) => {
  //     this.toastr.add({
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Removed Successfully",
  //     });
  //     window.location.reload();
  //   });
  // }

  changeSourceType(event: any) {
    // let data: any = {
    //   source: event.value.toString(),
    // };
    // if (this.filterForm.get('location_id').value !== 0) {
    //   data.location_id = this.filterForm.get('location_id').value;
    // }
    // this.pageService.getSourceNameWithMultipleParam(data).subscribe(response => {
    //   this.sourceName = [{ id: null, source_name: "Select" }, ...response];
    // });
  }

  changeSourceName() {
    const source_type_id = this.filterForm.value.source;
    const source_id = this.filterForm.value.user_type;
    this.pageService.getSourceNameTwo(source_type_id, source_id).subscribe(response => {
      this.sourceNameTwo = [{ id: null, source_name: "Select" }, ...response];
    });
  }
  changeYearFormat(value) {
    const inputDateString = value;
    const inputDate = new Date(inputDateString);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  }
  getSubscriptionList() {
    this.subsciberService.getSubscriptionList().subscribe((response) => {
      this.subList = [{ id: null, subplan: "Select" }, ...response.subscriptions];

    });

  }
  // gettotalrevenue(){
  //   this.subsciberService.gettotalrevenue().subscribe((response) => {
  //     this.totalRevenue = response;
  //   });
  // }
  getStatusColor(status: string | null): string {
    switch (status) {
      case 'Very Happy':
        return '#609923';
      case 'Happy':
        return '#8bc246';
      case 'Busy':
        return '#0054b4';
      case 'Neutral':
        return '#7e7e7e';
      case 'Unhappy':
        return '#f28b82';
      case 'Not Interested':
        return '#d93025';
      case 'RNR':
        return '#ff9800';
      default:
        return 'transparent';
    }
  }

  changeCountry(event: any) {
    // if (this.form.get('home_country').value == 122) {
    // this.form.get('location')?.enable();
    // this.form.get('location')?.reset();
    this.locationList = [];
    var data = {
      country_id: this.filterForm.get('hm_country').value
    }
    this.locationService.getAllCountryLocation(data).subscribe(
      (res: any) => {
        this.locationList = res.data;
      },
      (error: any) => {
        this.toastr.add({
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
    this.subsciberService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homeCountries = [{ country: "Select", code: null }, ...res];
        this.filterForm.get('hm_country')?.reset();
      },
      (error: any) => {
        this.toastr.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }
  resetCount() {
    this.getSubscribersCount(this.subscriberObj)
  }
  redirectProfileLink(id: any) {
    if (!id) {
      this.toastr.add({
        severity: "warn",   // or "warning"
        summary: "",
        detail: "Talent profile not created",
      });
      return;
    }

    const url = `https://employer.uniprep.ai/talent/${id}`;
    window.open(url, '_blank');
  }
  // redirectLobLink(id: any) {
  //   const jobUrl = `https://job.uniprep.ai/view/${id}`;
  //   window.open(jobUrl, '_blank');
  // }
}
