import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TalentConnectService } from "../../talent-connect.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "uni-applied-jobs",
    templateUrl: "./applied-jobs.component.html",
    styleUrls: ["./applied-jobs.component.scss"],
    standalone: false
})
export class AppliedJobsComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  pageSize: number = 10;
  page: number = 1;
  first: number = 0;
  searchText: string = "";
  totalCandidates: number = 0;
  totalJobs: number = 0;
  candidates = [];

  positionList: any[] = [];
  locationList: any[] = [];
  workModeList: any[] = [];
  employmentTypeList: any[] = [];
  salaryRangeList: any[] = [];
  statusList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private talentConnectService: TalentConnectService
  ) {
    this.filterForm = this.fb.group({
      position: [null],
      location: [null],
      start_date: [null],
      due_date: [null],
      workmode: [null],
      employmenttype: [null],
      salaryoffer: [null],
      status: [null],
    });
  }
  userid='';
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (!id) {
        return;
      }
      this.userid = id;
      this.getJobsList();
      this.loadDropdowndata();
      this.loadWorklocationData();
    });
  }
  dropdownData: any = {
    positions: [],
    industrytypes: [],
    softskills: [],
    language: [],
    benifitandperks: [],
    compensationstructure: [],
    employmenttype: [],
    hiringstage: [],
    workmode: [],
    minimumeducation: [],
    currencycode: [],
    gender: [],
    experiecelevel: [],
    timeframe: [],
    interviewformat: [],
    proficiencylevel: [],
  };
  workLocation: any[];
  loadDropdowndata() {
    this.talentConnectService.getDropdownData().subscribe((response: any) => {
      this.dropdownData = response;
    });
  }
  loadWorklocationData() {
    this.talentConnectService
      .getWorkLocationDropdownData()
      .subscribe((response: any) => {
        this.workLocation = [...response.worklocations];
      });
  }
  resetFilter(): void {
    this.filterForm.reset();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "Shortlisted":
        return "Shortlisted";
      case "Sent":
        return "Message Sent";
      case "Received":
        return "Message Received";
      default:
        return "Unknown Status";
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Shortlisted":
        return "status-shortlisted";
      case "Sent":
        return "status-sent";
      case "Received":
        return "status-received";
      default:
        return "";
    }
  }
  submitFilterForm() {
    this.getJobsList(this.filterForm.value);
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getJobsList();
  }
  perPage: number = 10;
  getJobsList(params?: any) {
    const data = {
      userId: this.userid,
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getAppliedJobList(data).subscribe({
      next: (response) => {
        this.candidates = response.jobs;
        this.totalCandidates = response.totalcount;
      },
      error: (error) => {},
    });
  }
}
