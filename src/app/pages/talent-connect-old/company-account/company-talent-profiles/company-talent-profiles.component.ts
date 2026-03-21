import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TalentConnectService } from "../../talent-connect.service";
import { ActivatedRoute, Router } from "@angular/router";

export type CardStatus = "shortlisted" | "sent" | "received";
export interface Candidate {
  id: number;
  user_id: number;
  full_name: string;
  career_interest_id: string; // stored as a string like "[2,3,9,16,15]"
  state: string;
  district: string;
  dp_image: string;
  career_interest: string[];
  image: string;
  status: string;
}

@Component({
    selector: "app-company-talent-profiles",
    templateUrl: "./company-talent-profiles.component.html",
    styleUrls: ["./company-talent-profiles.component.scss"],
    standalone: false
})
export class CompanyTalentProfilesComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  locations: any = [];
  careerInterests: any = [];
  searchText: string = "";
  totalTalents: number = 0;
  page: number = 0;
  perPage: number = 10;
  first: number = 0;
  id: any;
  talentConnectList: Candidate[] = [,];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private talentConnectService: TalentConnectService
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      username: [""],
      location: [""],
      interest: [""],
      status: [""],
    });
    this.route.queryParams.subscribe((params) => {
      const company = params["company"];
      const companyId = +params["id"];
      if (!company || !companyId) {
        this.router.navigate(["talent-connect/company"]);
        return;
      }
      this.companyName = company;
      this.id = companyId;
      this.getDropdownList();
      this.GetLocationList();
      this.getTalentConnectList();
    });
  }
  companyName = "";
  submitFilterForm() {
    this.getTalentConnectList(this.filterForm.value);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "Shortlisted":
        return "Shortlisted";
      case "Send":
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
      case "Send":
        return "status-sent";
      case "Received":
        return "status-received";
      default:
        return "";
    }
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.getTalentConnectList();
  }

  getTalentConnectList(params?: any) {
    const data = {
      id: this.id,
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getTalentconnectList(data).subscribe({
      next: (response) => {
        this.talentConnectList = response.students;
        this.totalTalents = response.totalcount;
      },
      error: (error) => {},
    });
  }
  GetLocationList() {
    this.talentConnectService.getLocation().subscribe({
      next: (response) => {
        this.locations = response;
      },
      error: (error) => {},
    });
  }
  getDropdownList() {
    this.talentConnectService.getStudentProfilesDropDownList().subscribe({
      next: (response) => {
        this.careerInterests = response.career_interests;
      },
    });
  }
  goBack() {
    this.router.navigate(["talent-connect/company"]);
  }
}
