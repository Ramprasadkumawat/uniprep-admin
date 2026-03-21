import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TalentConnectService } from "../talent-connect.service";
import { Countries } from "src/app/@Models/country.model";
import { Company } from "src/app/@Models/company.model";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
    selector: "uni-company-account",
    templateUrl: "./company-account.component.html",
    styleUrls: ["./company-account.component.scss"],
    standalone: false
})
export class CompanyAccountComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  page: number = 1;
  perPage: number = 10;
  first: number = 0;
  selectedCompanies: Company[] = [];
  companiesList: Company[] = [];
  countryList: Countries[] = [];
  regionList: any = [];
  totalCompanies: number = 0;
  selectedCount: number = 0;
  cityList: any = [];
  submitted: boolean = false;
  industryTypeList: any = [];
  globalPresenceList: any = [];
  headQuartersList: any = [];
  companyTypesList: any = [];
  companySizeList: any = [];
  viewMode: string = "";
  selectedCardIds: number[] = [];
  selectedCard: string = "list";
  displayProfileModal: boolean = false;
  companyDetails: any;
  viewOptions: { label: string; value: string }[] = [
    { label: "List View", value: "list" },
    { label: "Card View", value: "card" },
  ];
  constructor(
    private fb: FormBuilder,
    private toastr: MessageService,
    private router: Router,
    private talentConnectService: TalentConnectService
  ) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      companyname: [""],
      industrytype: [""],
      companysize: [""],
      hq: [""],
      yearfounded: [""],
      globalpresence: [""],
      companytype: [""],
    });
    this.getCompaniesList();
    this.loadDropDownsList();
  }

  loadDropDownsList() {
    // Company size
    this.talentConnectService.getCompanySize().subscribe((response) => {
      this.companySizeList = response;
    });

    // Company types
    this.talentConnectService.getCompanyTypes().subscribe((response) => {
      this.companyTypesList = response;
    });

    // Industry types
    this.talentConnectService.getIndustryTypes().subscribe((response) => {
      this.industryTypeList = response;
    });

    // Global presence
    this.talentConnectService.getGlobalPresenceList().subscribe((response) => {
      this.globalPresenceList = response;
    });

    // Headquarters
    this.talentConnectService.getHeadQuartersList().subscribe((response) => {
      this.headQuartersList = response;
    });
  }

  onSelectCard(id: number, event: any) {
    if (event.checked) {
      this.selectedCardIds.push(id);
    } else {
      this.selectedCardIds = this.selectedCardIds.filter(
        (cardId) => cardId !== id
      );
    }
  }

  submitFilterForm() {
    this.getCompaniesList(this.filterForm.value);
  }

  getCompaniesList(params?: any) {
    const data = {
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getCompanyList(data).subscribe({
      next: (response) => {
        this.companiesList = response.companies;
        this.totalCompanies = response.totalcount;
      },
      error: (error) => { },
    });
  }

  toggleViewMode(mode: "list" | "card"): void {
    this.viewMode = mode;
  }

  verifySelected(): void {
    this.selectedCompanies.forEach((company) => {
      company.verified = true;
    });
  }

  viewCompanyInfo(company: Company): void {
    // Implement view company info functionality
    this.companyDetails = company;
    this.displayProfileModal = true;
  }

  verify(company: Company): void {
    company.verified = true;
  }
  verifyselectedcompany() {
    let paramdata = { companies: "" };
    if (this.selectedCard === "card") {
      if (this.selectedCardIds.length > 0) {
        paramdata.companies = this.selectedCardIds.join(",");
      } else {
        return;
      }
    } else {
      if (this.selectedCompanies.length > 0) {
        paramdata.companies = this.selectedCompanies.map((c) => c.id).join(",");
      } else {
        return;
      }
    }
    this.talentConnectService.selectedverifyCompany(paramdata).subscribe({
      next: (response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Verified Successfully",
        });
        this.getCompaniesList();
      },
      error: (error) => { },
    });
  }
  verifyCompany(company: any) {
    this.talentConnectService.verifyCompany({ id: company?.id }).subscribe({
      next: (response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Verified Successfully",
        });
        this.getCompaniesList();
      },
      error: (error) => { },
    });
  }
  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.getCompaniesList(this.filterForm.value);
  }

  onSelectionChange(): void {
    this.selectedCount = this.selectedCompanies.length;
    console.log(this.selectedCount);

  }
  oncardSelectAll() {
    const allIds = this.companiesList.map((c) => c.id);

    const isAllSelected = allIds.every(id => this.selectedCardIds.includes(id));

    if (isAllSelected) {
      // Unselect all
      this.selectedCardIds = [];
    } else {
      // Select all
      this.selectedCardIds = [...allIds];
    }
  }
  get f() {
    return this.filterForm.controls;
  }
  export() {
    const data = {
      page: this.page,
      perpage: this.perPage,
      ...this.filterForm.value,
    };
    this.talentConnectService.exportCompanyList(data).subscribe({
      next: (response) => {
        window.open(response.link, "_blank");
      },
      error: (error) => { },
    });
  }
  navigatetoTalents(company) {
    this.router.navigate(["talent-connect/company/talents"], {
      queryParams: {
        company: company.company_name,
        id: company.id
      }
    });
  }
  navigateToJobs(company) {
    this.router.navigate(["talent-connect/company/jobs/openjobs"], {
      queryParams: {
        company: company.company_name,
        id: company.id
      }
    });
  }
}
