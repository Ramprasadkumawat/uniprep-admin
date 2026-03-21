import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { TalentConnectService } from "../../talent-connect.service";

@Component({
    selector: "uni-applied-companies",
    templateUrl: "./applied-companies.component.html",
    styleUrls: ["./applied-companies.component.scss"],
    standalone: false
})
export class AppliedCompaniesComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  studentList: any[] = [];
  locations: any[] = [];
  interviewStages: any[] = [];
  pageSize: number = 10;
  page: number = 1;
  first: number = 0;
  searchText: string = "";
  totalCandidates: number = 0;
  totalJobs: number = 0;
  candidates = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: MessageService,
    private talentConnectService: TalentConnectService
  ) {}
  userid = "";
  ngOnInit() {
    this.filterForm = this.fb.group({
      username: [""],
      location: [""],
      status: [""],
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (!id) {
        return;
      }
      this.userid = id;
      this.getCityCountryList();
      this.getCompaniesList();
      this.loadWorklocationData();
    });
  }
  workLocation: any[];
  loadWorklocationData() {
    this.talentConnectService
      .getWorkLocationDropdownData()
      .subscribe((response: any) => {
        this.workLocation = [...response.worklocations];
      });
  }
  submitFilterForm() {
    this.getCompaniesList(this.filterForm.value);

  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getCompaniesList();
  }
  perPage: number = 10;
  getCompaniesList(params?: any) {
    const data = {
      userId: this.userid,
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getTalentCompanyConnectList(data).subscribe({
      next: (response) => {
        this.candidates = response.companies;
        this.totalCandidates = response.count;
      },
      error: (error) => {},
    });
  }
  preferredLocation: boolean = false;
  preferredLocationList: any[] = [];
  getCityCountryList(search?: string, isSearchPreferred?: boolean) {
    this.talentConnectService.getCityCountries(search).subscribe({
      next: (response) => {
        if (isSearchPreferred == undefined) {
          this.locations = response;
          this.preferredLocationList = response;
        } else {
          isSearchPreferred
            ? (this.preferredLocationList = response)
            : (this.locations = response);
        }
      },
    });
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
}
