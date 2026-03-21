import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { ToastModule } from "primeng/toast";
import { UserDashboardService } from "src/app/pages/user-dashboard/user-dashboard.service";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule, FormGroup, FormControl, FormBuilder, NgForm } from "@angular/forms";
import { ChartModule } from "primeng/chart";
import { Router } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { UserFacadeService } from "../users/user-facade.service";
import { ChathistoryService } from "../chat/chathistory/chathistory.service";
import { Subscription, forkJoin, mergeMap, Observable, of, timer, switchMap } from "rxjs";
import { ButtonModule } from "primeng/button";
import { ChartData, ChartOptions } from "chart.js";

interface country {
  id: number;
  country: string;
  flag: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface location {
  id: number;
  state: string;
  district: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface sourcetype {
  id: number;
  name: string;
}

interface status {
  id: number;
  status_name: string;
}

interface program {
  id: number;
  programlevel: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface year {
  label: string;
  year: number;
}

interface month {
  id: number;
  month: string;
}

@Component({
  selector: "uni-user-dashboard",
  imports: [CommonModule, ButtonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, TextareaModule, ReactiveFormsModule, ConfirmDialogModule, ToastModule, MultiSelectModule, FormsModule, ChartModule],
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.scss"],
})
export class UserDashboardComponent implements OnInit {
  countrylist: any;
  locationlist: any;
  programlist: any;

  countries: country[] = [];
  locations: location[] = [];
  programs: program[] = [];
  sourcetypes: sourcetype[] = [];
  statuses: status[] = [];
  companies: status[] = [];
  // selectedlocations: location[];
  // selectedcountries: country[];
  // selectedprograms: program[];
  years: year[];
  selectyears: year[];
  months: month[];
  selectedmonths: month[];
  programLevels: any = [];
  filterForm: FormGroup;
  filterdata: any;
  filterdataforStudent: any;
  filterParmsforSubscribers: any;
  dashboardCardCount: any;
  cdata: any;
  usersDaily: any;
  usersDailyChart: any;
  basicData: any;
  bardata: any;
  sourcelist: any;
  programleveldata: any;
  programlevelchartdata: any;
  usersdailychart: any;
  sourcechartdata: any;
  sourcedata: any;
  countryChartdata: any;
  planchartdata: any;
  options: any;
  dataPassingYear: any;
  regionWiseChartData: any;
  getLeadStatusChartData: any;
  usertypedata: any;
  dailyOptions: any;
  leadOptions: any;
  planOptions: any;
  planOptionsProgram: any;
  userOptions: any;
  regions: any[] = [];
  leadList: any[] = [
    { id: null, name: "Select" },
    { id: 1, name: "Direct Student User" },
    { id: 2, name: "College Student User" },
  ];

  constructor(private service: UserDashboardService, private formbuilder: FormBuilder, private router: Router, private pageService: PageFacadeService, private userFacade: UserFacadeService) { }

  dashboardSubscription: Subscription;
  lastRefreshedTime;
  message = "Please click refresh data to load data";

  ngOnInit(): void {
    this.filterForm = this.formbuilder.group({
      createdFrom: new FormControl(),
      createdTo: new FormControl(),
      country: new FormControl(),
      location: new FormControl(),
      region: new FormControl(),
      programlevel: new FormControl(),
      passingyear: new FormControl(null),
      leadstatus: new FormControl(),
      lead_type: new FormControl(),
      sourcetype: new FormControl(),
      source_name: new FormControl(),
    });

    this.service.GetCountryList().subscribe((response) => {
      this.countries = [{ id: null, country: "Select" }, ...response];
    });

    this.service.GetProgramList().subscribe((response) => {
      this.programs = response;
    });

    this.service.GetSourcetypeList().subscribe((response) => {
      this.sourcetypes = [{ id: null, name: "Select" }, ...response];
    });

    this.service.GetStatusList().subscribe((response) => {
      this.statuses = response;
    });

    this.years = [
      { label: "Select", year: null },
      { label: "2023", year: 2023 },
      { label: "2024", year: 2024 },
      { label: "2025", year: 2025 },
      { label: "2026", year: 2026 },
      { label: "2027", year: 2027 },
    ];
    this.selectyears = [];

    this.months = [
      { id: 1, month: "January" },
      { id: 2, month: "February" },
      { id: 3, month: "March" },
      { id: 4, month: "April" },
      { id: 5, month: "May" },
      { id: 6, month: "June" },
      { id: 7, month: "July" },
      { id: 8, month: "August" },
      { id: 9, month: "September" },
      { id: 10, month: "October" },
      { id: 11, month: "November" },
      { id: 12, month: "December" },
    ];
    this.selectedmonths = [];
    this.refreshData();
  }

  refreshData() {
    this.DashboardCardCount();
    this.getUsersDaily();
    this.GetSourceChartData();
    this.GetPlanChartData();
    this.GetUserTypeData();
    this.loadDashboardCounts();
    this.loadUsersDailydata();
  }

  openStudentsModule(filterParam: string) {
    this.router.navigate(["/subscribers"], { queryParams: { filter: filterParam, ...this.filterParmsforSubscribers } });
  }

  // openStudentsModuleNew(filterParam: string) {
  //    this.router.navigate(['/subscribers'], { queryParams: { filter: filterParam, home_country_id : this.filterdataforStudent?.country } });
  // }

  GetStatusList() {
    this.service.GetStatusList().subscribe((response) => {
      this.statuses = response;
    });
  }

  getSourceType() {
    this.service.GetSourcetypeList().subscribe((response) => {
      this.sourcetypes = [{ id: null, name: "Select" }, ...response];
    });
  }

  getUsersDaily() {
    let data;
    this.service.GetUsersDaily(data).subscribe((Response) => {
      this.usersDaily = Response;
      this.usersdailychart = {
        labels: this.usersDaily.date,
        datasets: [
          {
            label: "Daily Users",
            data: this.usersDaily.count,
            fill: false,
            tension: 0.4,
          },
        ],
      };
    });
    this.dailyOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  getUsersDailyObs(data): Observable<any> {
    return this.service.GetUsersDaily(data);
  }

  getLeadStatusData() {
    let data;
    this.service.GetleadWiseData(data).subscribe((Response) => {
      // this.usersDaily = Response;
      this.getLeadStatusChartData = {
        labels: Response.data,
        datasets: [
          {
            label: "Lead Status",
            data: Response.count,
            fill: false,
            tension: 0.4,
          },
        ],
      };
    });
    this.leadOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  GetSourceChartData() {
    let data;
    this.service.GetSourceChartData(data).subscribe((Response) => {
      this.sourcechartdata = Response;

      this.sourcedata = {
        labels: this.sourcechartdata.data,
        datasets: [
          {
            data: this.sourcechartdata.count,
          },
        ],
      };
    });
    this.leadOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  getSourceChartDataObs(data): Observable<any> {
    return this.service.GetSourceChartData(data);
  }

  GetPlanChartData() {
    let data;
    this.service.GetPlanChartData(data).subscribe((response) => {
      // this.countrydata = Response;

      this.planchartdata = {
        labels: response.data,
        datasets: [
          {
            data: response.count,
          },
        ],
      };
    });
    this.planOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }
  getPlanChartDataObs(data) {
    return this.service.GetPlanChartData(data);
  }
  programLevelChart: any;
  getProgramLevelWiseGraphCount() {
    let data;
    this.service.getProgramLevelWiseGraphCount(data).subscribe((response) => {
      // this.countrydata = Response;

      this.programLevelChart = {
        labels: response.data,
        datasets: [
          {
            data: response.count,
          },
        ],
      };
    });
    this.planOptionsProgram = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  GetUserTypeData() {
    let data;
    this.service.GetUserTypeData(data).subscribe((response) => {
      this.usertypedata = {
        labels: response.data,
        datasets: [
          {
            data: response.count,
          },
        ],
      };
    });
    this.userOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  getUserTypeDataObs(data): Observable<any> {
    return this.service.GetUserTypeData(data);
  }

  postData(filterForm: any) {
    var datafrom = {
      createdFrom: filterForm.controls.createdFrom.value,
      createdTo: filterForm.controls.createdTo.value,
      country: filterForm.controls.country.value,
      region: filterForm.controls.region.value,
      location: filterForm.controls.location.value,
      passingyear: filterForm.controls.passingyear.value,
      programlevel: filterForm.controls.programlevel.value,
      sourcetype: filterForm.controls.sourcetype.value,
      source_name: filterForm.controls.source_name.value,
      leadstatus: filterForm.controls.leadstatus.value,
      lead_type: filterForm.controls.lead_type.value,
    };
    this.filterdataforStudent = datafrom;

    //this array creation for redirecting parameters to the subscribers components filter only.i need the array key name to be how the students module backend filter parameters names are there.In the student module backend already have all the filters.So if i send the parameters name differently. again i need to write the same code.so i change the array key names.
    let subscribersData = {
      fromdate: datafrom.createdFrom,
      todate: datafrom.createdTo,
      home_country_id: datafrom.country,
      region_id: datafrom.region,
      location_id: datafrom.location,
      last_degree_passing_year: datafrom.passingyear,
      programlevel_id: datafrom.programlevel,
      source_type: datafrom.sourcetype,
      source_name: datafrom.source_name,
      login_status: datafrom.leadstatus,
      student_type_id: datafrom.lead_type,
    };
    this.filterParmsforSubscribers = subscribersData;

    // ------------------------------------------------    Dashboard Cards  --------------------------------------
    this.getDashboardCounts(datafrom).subscribe((data) => {
      this.dashboardCardCount = {
        registeredusers: data.registeredusers.count,
        paidusers: data.paidusers.count,
        activeusers: data.activeusers.count,
        exhaustedusers: data.exhaustedusers.count,
        unpaidusers: data.unpaidusers.count,
        unpaidloggedin: data.unpaidloggedin.count,
        unpaidnotloggedin: data.unpaidnotloggedin.count,
        directstudentleads: data.directstudentleads.count,
        collegestudentleads: data.collegestudentleads.count,
      };
    });

    // ---------------------------------------------------- Daily Users ----------------------------------------------
    this.service.GetUsersDaily(datafrom).subscribe((res) => {
      this.usersDaily = res;
      // alert(typeof(res.count));

      this.usersdailychart = {
        labels: this.usersDaily.date,
        datasets: [
          {
            label: "Daily Users",
            data: this.usersDaily.count,
            fill: false,
            tension: 0.4,
          },
        ],
      };
    });

    //--------------------------------------------------- Source Wise -------------------------------------------------------

    this.service.GetSourceChartData(datafrom).subscribe((Response) => {
      this.sourcechartdata = Response;

      this.sourcedata = {
        labels: this.sourcechartdata.data,
        datasets: [
          {
            data: this.sourcechartdata.count,
          },
        ],
      };
    });

    this.service.GetUserTypeData(datafrom).subscribe((Response) => {
      this.usertypedata = {
        labels: Response.data,
        datasets: [
          {
            data: Response.count,
          },
        ],
      };
    });

    // ----------------------------------------------Plan Wise --------------------------------------------------------------

    this.service.GetPlanChartData(datafrom).subscribe((response) => {
      // this.countrydata = Response;

      this.planchartdata = {
        labels: response.data,
        datasets: [
          {
            data: response.count,
          },
        ],
      };
    });
  }

  getSource(event: any) {
    let sourcetyp_id = {
      sourcetype: this.filterForm.value.sourcetype,
    };

    if (this.filterForm.value.sourcetype != null) {
      this.service.GetSourceBySourcetype(sourcetyp_id).subscribe((Response) => {
        this.sourcelist = [{ id: null, name: "select" }, ...Response];
      });
    }
  }

  DashboardCardCount() {
    this.getDashboardCounts(this.filterdata).subscribe((data) => {
      this.dashboardCardCount = {
        registeredusers: data.registeredusers.count,
        paidusers: data.paidusers.count,
        activeusers: data.activeusers.count,
        exhaustedusers: data.exhaustedusers.count,
        unpaidusers: data.unpaidusers.count,
        unpaidloggedin: data.unpaidloggedin.count,
        unpaidnotloggedin: data.unpaidnotloggedin.count,
        directstudentleads: data.directstudentleads.count,
        collegestudentleads: data.collegestudentleads.count,
      };
    });
  }

  getDashboardCounts(data) {
    return forkJoin({
      registeredusers: this.service.GetRegisteredUsers(data),
      paidusers: this.service.GetPaidUsers(data),
      activeusers: this.service.GetActiveUsers(data),
      exhaustedusers: this.service.GetExhaustedUsers(data),
      unpaidusers: this.service.GetUnpaidUsers(data),
      unpaidloggedin: this.service.GetUnpaidLoggedIn(data),
      unpaidnotloggedin: this.service.GetUnpaidNotLoggedIn(data),
      directstudentleads: this.service.GetDirectStudentLeads(data),
      collegestudentleads: this.service.GetCollegeStudentLeads(data),
    });
  }
  leadDashboardCounts;
  usersDailyData!: ChartData<'bar'>;
  chartOptions!: ChartOptions<'bar'>;
  loadUsersDailydata() {
    this.service.getUserStatusbyDate().subscribe((res) => {
      this.usersDailyData = {
        labels: res.date,
        datasets: [
          {
            label: 'Registered User',
            backgroundColor: '#f0780c',
            data: res.count.map(c => c.registered_user)
          },
          {
            label: 'Talents Verified',
            backgroundColor: '#c14c85',
            data: res.count.map(c => c.talents_verified)
          },
          {
            label: 'Job Profiles Created',
            backgroundColor: '#44547e',
            data: res.count.map(c => c.jobprofile_created)
          },
          {
            label: 'Subscription Purchased',
            backgroundColor: '#805593',
            data: res.count.map(c => c.subscription_purchased)
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#374151' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#6b7280' },
            grid: { color: '#e5e7eb' }
          },
          y: {
            ticks: { color: '#6b7280' },
            grid: { color: '#e5e7eb' }
          }
        }
      };
    });
  }
  loadDashboardCounts() {
    forkJoin({
      totaltalentprofiles: this.service.getTotalTalentProfiles(),
      introvideocount: this.service.getIntroVideoCount(),
      verifieduserscount: this.service.getVerifiedUsersCount(),
      clickedapplycount: this.service.getClickedApplyCount(),
      clickedcheckoutcount: this.service.getClickedCheckoutCount(),
      closedpaymentscreencount: this.service.getClosedPaymentScreenCount(),
      closedpremiumpopupcount: this.service.getClosedPremiumPopupCount(),
      paymentsuccesscount: this.service.getPaymentSuccessCount(),
      paymentfailedcount: this.service.getPaymentFailedCount(),
      jobsappliedcount: this.service.getJobsAppliedCount(),
      registeredusers: this.service.getRegisteredUsers(),
      premiumjobsappliedcount: this.service.getPremiumJobsAppliedCount(),
      closedbrowsercount: this.service.getClosedBrowserCount(),
      paidleads: this.service.getPaidUsersCount(),
      activeleads: this.service.getActiveUsersCount(),
    }).subscribe({
      next: (res) => {
        this.leadDashboardCounts = res;
      },
      error: (err) => {
        console.error('Error fetching dashboard counts:', err);
      }
    });
  }

  resetFilter() {
    this.filterForm.reset();
    this.ngOnInit();
  }
  changeCountry() {
    this.getRegionList();
  }
  changeRegion(event: any) {
    if (this.filterForm.get("region").value != 0) {
      const value = event.value.toString();
      this.getLocationList(value);
    }
  }
  getRegionList() {
    if (this.filterForm.get("country").value == 122) {
      this.pageService.getRegion().subscribe((response) => {
        this.regions = [{ id: null, state: "Select" }, ...response];
      });
    } else {
      this.regions = [{ id: 0, state: "Others" }];
      this.filterForm.get("region").setValue(0);
      this.locations = [{ id: 0, district: "Others", state: "", created_at: "", updated_at: "", status: null }];
      this.filterForm.get("location").setValue(0);
    }
  }
  getProgramLevelList() {
    this.pageService.getProgaramLevels().subscribe((response) => {
      this.programLevels = [{ id: null, programlevel: "Select" }, ...response];
    });
  }
  getLocationList(value: string) {
    this.userFacade.getLocationByRegion(value).subscribe((response) => {
      this.locations = [{ id: null, district: "Select" }, ...response];
    });
  }

  refreshDashboardData() {
    this.message = "";
    const now = new Date();
    this.lastRefreshedTime = now.toLocaleString();
    this.refreshData();
  }
}
