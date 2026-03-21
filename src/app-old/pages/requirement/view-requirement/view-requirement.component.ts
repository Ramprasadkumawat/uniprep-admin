import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TalentConnectService } from "../../talent-connect/talent-connect.service";

@Component({
  selector: "uni-view-requirement",
  templateUrl: "./view-requirement.component.html",
  styleUrls: ["./view-requirement.component.scss"],
  standalone: false,
})
export class ViewRequirementComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  requirementList: any[] = [];
  first: number = 0;
  page: number = 1;
  rows: number = 10;
  totalRecords: number = 0;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private talentConnectService: TalentConnectService,
    private messageService: MessageService
  ) {
    this.filterForm = this.fb.group({
      jobTitle: [""],
      requirementType: [""],
      location: [""],
    });
  }

  ngOnInit(): void {
    this.getRequirementList();
  }

  getRequirementList() {
    this.loading = true;
    const params = {
      page: this.page,
      perpage: this.rows,
      ...this.filterForm.value,
    };
    // TODO: Implement API call to get requirement list
    // this.talentConnectService.getRequirementList(params).subscribe({
    //   next: (response: any) => {
    //     this.requirementList = response.data || [];
    //     this.totalRecords = response.count || 0;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: "Failed to load requirements",
    //     });
    //   },
    // });
    // Temporary mock data
    this.requirementList = [];
    this.totalRecords = 0;
    this.loading = false;
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getRequirementList();
  }

  applyFilter() {
    this.page = 1;
    this.first = 0;
    this.getRequirementList();
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.first = 0;
    this.getRequirementList();
  }
}

