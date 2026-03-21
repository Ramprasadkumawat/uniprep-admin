import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TalentConnectService } from "../../talent-connect.service";

interface JobPosting {
  id: number;
  job_id: string;
  position_title: string;
  start_date: string;
  due_date: string;
  work_location: string;
  available_vacancies: number;
  work_mode: string;
  employment_type: string;
  salary_offer: number;
  currency_code: string;
  created_at: string;
  company_logo: string;
  company_name: string;
  size: string;
  appliedCount: number;
  posted_at: string;
  status: string;
}

@Component({
  selector: "uni-company-jobs",
  standalone: false,
  templateUrl: "./company-jobs.component.html",
  styleUrls: ["./company-jobs.component.scss"],
})
export class CompanyJobsComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  jobList: any = [];
  employmentTypes: any = [];
  workModes: any = [];
  locations: any = [];
  positions: any = [];
  page: number = 0;
  perPage: number = 10;
  first: number = 0;
  searchText = "";
  totalCategories = 2;

  jobPostings: JobPosting[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private talentConnectService: TalentConnectService
  ) {
    this.filterForm = this.fb.group({
      position: [""],
      location: [""],
      start_date: [""],
      due_date: [""],
      workmode: [""],
      employment_type: [""],
      salaryoffer: [""],
      status: [""],
    });
  }
  companyId = 0;
  companyName = "";
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const company = params["company"];
      const companyId = +params["id"];
      if (!company || !companyId) {
        this.router.navigate(["talent-connect/company"]);
        return;
      }
      this.companyName = company;
      this.companyId = companyId;

      this.loadDropdowndata();
      this.loadWorklocationData();
      this.getJobsList();
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
  submitFilterForm() {
    this.getJobsList(this.filterForm.value);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "tick":
        return "bg-success";
      case "future":
        return "bg-primary";
      case "closed":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  getStatusButtonClass(status: string): string {
    switch (status) {
      case "active":
        return "p-button-success";
      case "future":
        return "p-button-primary";
      case "closed":
        return "p-button-danger";
      default:
        return "p-button-secondary";
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "Actively Hiring":
        return "Actively Hiring";
      case "Future Hiring":
        return "Future Hiring";
      case "Hiring Closed":
        return "Hiring Closed";
      default:
        return "Unknown Status";
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "Actively Hiring":
        return "fa-check";
      case "Future Hiring":
        return "fa-clock";
      case "Hiring Closed":
        return "fa-times";
      default:
        return "fa-question";
    }
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.getJobsList();
  }

  getJobsList(params?: any) {
    const data = {
      companyId: this.companyId,
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getjobpostingList(data).subscribe((response) => {
      this.jobPostings = response.jobs;
      this.totalCategories = response.totalcount;
    });
  }
  goBack() {
    this.router.navigate(["talent-connect/company"]);
  }
}
