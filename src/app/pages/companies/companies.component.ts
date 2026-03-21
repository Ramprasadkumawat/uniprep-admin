import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { PopoverModule } from "primeng/popover";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { Tooltip } from "primeng/tooltip";
import { CompaniesService } from "./companies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { JobsService } from "../jobs/jobs.service";
import { CompaniesStatsHeaderComponent } from "./companies-stats-header/companies-stats-header.component";

@Component({
  selector: "uni-companies",
  imports: [
    DialogModule,
    AccordionModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    ConfirmDialogModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    TagModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MultiSelectModule,
    PopoverModule,
    Tooltip,
    CompaniesStatsHeaderComponent,
  ],
  templateUrl: "./companies.component.html",
  styleUrl: "./companies.component.scss",
  providers: [ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompaniesComponent {
  studentId: number = NaN;
  companyFilterForm!: FormGroup;
  companies: any[] = [];
  filteredCompanies: any;
  totalCompanies: number = 0;
  totalRevenue: any = 0;
  totalJobs: any = 0;
  todayData: any = {};
  activeSubscribedEmployers: number = 0;
  totalActiveJobs: number = 0;
  totalApplicants: number = 0;
  totalCardsSeen: string = "0";
  totalRevenuePercentage: string = "0";
  totalJobsPercentage: string = "0";
  totalActiveJobsPercentage: string = "0";
  totalApplicantsPercentage: string = "0";
  totalActiveSubscriptionsPercentage: string = "0";
  totalUsers: number = 0;
  isTableLoading: boolean = false;
  todayCompanies: number = 0;
  todayUsers: number = 0;
  todayRevenue: any = 0;
  todayActiveSubscribedEmployers: number = 0;
  todayActiveJobs: number = 0;
  todayApplicants: number = 0;
  todayCardsSeen: string = "0";
  companySizes: any[] = [];
  countries: any[] = [];
  headquarters: any[] = [];
  subscriptionPlans: any[] = [
    { label: "Standard (Free)", value: "Standard (Free)" },
    { label: "Premium (1 Month)", value: "Premium (1 Month)" },
    { label: "Premium (6 Month)", value: "Premium (6 Month)" },
    { label: "Premium (12 Month)", value: "Premium (12 Month)" },
    { label: "Plan Exhausted", value: "Plan Exhausted" },
  ];
  remarkStatuses: any[] = [
    {
      label: "Interested in Campus Drive",
      value: "Interested in Campus Drive",
    },
    {
      label: "Interested in Hiring Support",
      value: "Interested in Hiring Support",
    },
    {
      label: "Interested in Project Support",
      value: "Interested in Project Support",
    },
    { label: "Happy", value: "Happy" },
    { label: "Not happy", value: "Not happy" },
    { label: "Neutral", value: "Neutral" },
    { label: "No Remarks", value: "No Remarks" },
  ];
  // talentCredits: any[] = [
  //   { label: "Yes", value: "Yes" },
  //   { label: "No", value: "No" },
  // ];
  companiesCreatedBy: any[] = [
    { label: "Uniprep", value: "Uniprep" },
    { label: "Recruiter", value: "Recruiter" },
  ];
  companiesCreated: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  remarksAddBy: any[] = [];
  applicants: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  advertisedJobs: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  serviceTypes: any[] = [];
  sourceNames: any[] = [];
  companyData: any;
  selectedCompanyData: any = null;
  selectedTab: number = 0;
  isFilterExpanded: boolean = false;
  currentPage = 1;
  pageSize = 25;

  summaryCards: any[] = [
    {
      label: "Total Companies",
      value: 0,
      class: "card-total-vacancies",
      filter: "all",
    },
    {
      label: "Total Revenue",
      value: 0,
      class: "card-total-vacancies",
      filter: "revenue",
    },
    {
      label: "Active Subscribed Employers",
      value: 0,
      class: "card-total-vacancies",
      filter: "active_subscribed",
    },
    {
      label: "Total Active Jobs",
      value: 0,
      class: "card-approved",
      filter: "active_jobs",
    },
    {
      label: "Total Applicants",
      value: 0,
      class: "card-total-vacancies",
      filter: "applicants",
    },
    {
      label: "Total Cards Seen",
      value: 0,
      class: "card-total-vacancies",
      filter: "cards_seen",
    },
    {
      label: "Total Users",
      value: 0,
      class: "card-total-vacancies",
      filter: "users",
    },
  ];

  sourceTypes: any[] = [
    { label: 'Direct', value: 'Direct' },
    { label: 'Partner', value: 'Partner' }
  ];

  yesNoOptions: any[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];

  talentCredits: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Exhausted", value: "Exhausted" } // Updated per Image 1
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private companyService: CompaniesService,
    private toast: MessageService,
    private router: Router,
    private jobService: JobsService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.activatedRoute.snapshot.params['studentId'] as number;
    this.initializeFilterForm();
    this.getDropdowns();
    this.loadSourceNames();
    //this.getCompanies();
  }

  initializeFilterForm(): void {
    this.companyFilterForm = this.fb.group({
      companyId: [null],
      companyName: [null],
      email: [null],
      companySize: [null],
      country: [null],
      headquartersLocation: [null],
      serviceType: [null],
      companyCreatedBy: [null],
      companyCreated: [null],
      advertisedJobs: [null],
      totalJobs: [null],          // New
      activeJobs: [null],         // New
      applicants: [null],
      talentCredit: [null],
      subscriptionPlan: [null],
      remarkStatus: [null],
      source_type: [null],         // New
      source_name: [null],         // New
      relationshipManager: [null], // New
      remarkAddedBy: [null],
      remarkFromDate: [null],
      remarkToDate: [null],
      createdFromDate: [null],
      createdToDate: [null],
      reportFromDate: [null],     // New
      reportToDate: [null],       // New
      lastLoginFromDate: [null],  // New
      lastLoginToDate: [null],    // New
    });
  }

  getDropdowns() {
    this.companyService.getWorldCountries().subscribe({
      next: (res) => {
        if (res) {
          this.countries = res || [];
        }
      },
    });
    this.companyService.getCompanySize().subscribe({
      next: (res) => {
        if (res) {
          this.companySizes = res || [];
        }
      },
    });
    this.companyService.getHeadQuarters(1).subscribe({
      next: (res) => {
        this.headquarters = res || [];
      },
    });
    this.jobService.getDropdownData().subscribe({
      next: (res) => {
        if (res) {
          this.serviceTypes = res.company_service_type || [];
        }
      },
    });
    this.companyService.getAdminList().subscribe({
      next: (res) => {
        if (res) {
          this.remarksAddBy = res.data || [];
        }
      },
    });
  }
  loadSourceNames() {
    this.companyService.getSourceNames().subscribe({
      next: (results) => {
        this.sourceNames = results?.data || [];
      }, error: (err) => {
        console.error('Error loading Source Names:', err);
        this.toast.add({ severity: "error", summary: "Error", detail: "Failed to load Source Names" });
      }
    });
  }

  getCompanies() {
    this.isTableLoading = true;
    const params = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
    };

    this.companyService.getCompanyList(params).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.companies = (res.data.companies || []).map((company: any) => ({
            ...company,
            isChecked: false,
          }));
          this.totalCompanies = res.data.totalcompanies || 0;
          this.totalActiveJobs = res.data.total_active_jobs || 0;
          this.activeSubscribedEmployers =
            res.data.total_active_subscriptions || 0;
          this.totalApplicants = res.data.total_applicants || 0;
          this.totalCardsSeen = res.data.total_card_seen || 0;
          this.totalUsers = res.data.total_users || 0;
          this.totalRevenue = "INR " + res.data.total_revenue || 0;
          this.selectedCompanies = [];
          this.totalRevenuePercentage = res.data.total_revenue_percentage || 0;
          this.totalJobs = res.data.total_jobs;
          this.totalJobsPercentage = res.data.total_jobs_percentage || 0;
          this.totalActiveJobsPercentage =
            res.data.total_active_jobs_percentage || 0;
          this.totalApplicantsPercentage =
            res.data.total_applicants_percentage || 0;
          this.totalActiveSubscriptionsPercentage =
            res.data.total_active_subscriptions_percentage || 0;
          // console.log('res-data',res.data)
          this.todayData = res.data.today_count || {};
          // console.log(this.todayData);
          this.selectAllCheckboxes = false;
          this.updateSummaryCards();
          this.applyTabFilter();
        }
      },
      error: (err) => {
        console.error("Error fetching companies:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch companies data",
        });
      },
      complete: () => {
        this.isTableLoading = false;
      },
    });
  }

  onEditCompany(
    companyId: number | null,
    mode: "view" | "edit",
    company_name?: string,
    company_website?: string,
    employer_id?: number,
  ) {
    if (companyId === null) {
      this.companyService
        .getExistCompanyId({
          company_name: company_name!,
          company_website: company_website!,
          employer_id: employer_id,
        })
        .subscribe((existRes) => {
          this.companyService
            .showCompanyInfo({ id: existRes.id })
            .subscribe((companyRes) => {
              const companyData = companyRes.data;
              this.companyService.setCompanyToEdit(companyData);
              this.companyService.setCompanyMode(mode);
              this.router.navigate(["/companies/create-company"]);
            });
        });

      return;
    }
    this.companyService.showCompanyInfo({ id: companyId }).subscribe((res) => {
      const companyData = res.data;
      this.companyService.setCompanyToEdit(companyData);
      this.companyService.setCompanyMode(mode);
      this.router.navigate(["/companies/create-company"]);
    });
  }

  handleView(company: any) {
    if (company.id === null) {
      this.companyService
        .getExistCompanyId({
          company_name: company.company_name!,
          company_website: company.company_website!,
          employer_id: company.employer_id,
        })
        .subscribe((existRes) => {
          const url = this.router.serializeUrl(
            this.router.createUrlTree(["/companies/create-company"], {
              queryParams: {
                id: existRes.id,
                mode: "view",
              },
            }),
          );
          window.open(url, "_blank");
        });
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/companies/create-company"], {
          queryParams: {
            id: company.id,
            mode: "view",
          },
        }),
      );
      window.open(url, "_blank");
    }
  }

  applyFilters() {
    this.isTableLoading = true;
    const f = this.companyFilterForm.value;
    const params = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
      company_id: f.companyId || "",
      company_name: f.companyName || "",
      company_size: f.companySize || "",
      headquarters_location: f.headquartersLocation || "",
      advertised_jobs: f.advertisedJobs || "",
      company_created: f.companyCreated || "",
      company_createdby: f.companyCreatedBy || "",
      applicants: f.applicants || "",
      country: f.country || "",
      subscription_plan: f.subscriptionPlan || "",
      remark_status: f.remarkStatus || "",
      remark_addedby: f.remarkAddedBy || "",
      remark_from: f.remarkFromDate || "",
      remark_to: f.remarkToDate || "",
      talent_credit: f.talentCredit || "",
      service_type: f.serviceType || "",
      created_from: f.createdFromDate || "",
      created_to: f.createdToDate || "",
      email: f.email || "",
    };

    this.companyService.getCompanyList(params).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.companies = (res.data.companies || []).map((company: any) => ({
            ...company,
            isChecked: false,
          }));
          this.totalCompanies = res.data.totalcompanies || 0;
          this.totalActiveJobs = res.data.total_active_jobs || 0;
          this.activeSubscribedEmployers =
            res.data.total_active_subscriptions || 0;
          this.totalApplicants = res.data.total_applicants || 0;
          this.totalCardsSeen = res.data.total_card_seen || 0;
          this.totalUsers = res.data.total_users || 0;
          this.totalRevenue = "INR " + res.data.total_revenue || 0;
          this.totalJobs = res.data.total_jobs;
          this.totalJobsPercentage = res.data.total_jobs_percentage || 0;
          this.totalRevenuePercentage = res.data.total_revenue_percentage || 0;
          this.totalActiveJobsPercentage =
            res.data.total_active_jobs_percentage || 0;
          this.totalApplicantsPercentage =
            res.data.total_applicants_percentage || 0;
          this.totalActiveSubscriptionsPercentage =
            res.data.total_active_subscriptions_percentage || 0;
          this.todayData = res.data.today_count || {};
          this.selectedCompanies = [];
          this.selectAllCheckboxes = false;
          this.updateSummaryCards();
          this.applyTabFilter();
        }
      },
      error: (err) => {
        console.error("Error filtering companies:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to filter companies",
        });
      },
      complete: () => {
        this.isTableLoading = false;
      },
    });
  }

  resetFilters() {
    this.companyFilterForm.reset();
    this.selectedTab = 0;
    this.currentPage = 1;
    this.getCompanies();
  }

  toggleFilterSection() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  exportCompanies() {
    const filterData = this.buildCompanyListParams();

    this.companyService.export(filterData).subscribe({
      next: (res) => {
        if (res?.export_link) {
          window.open(res.export_link, "_blank");
          this.toast.add({
            severity: "success",
            summary: "Export",
            detail: "Export file is being downloaded",
          });
        } else {
          this.toast.add({
            severity: "warn",
            summary: "Export",
            detail: "No download link received from server",
          });
        }
      },
      error: (err) => {
        console.error("Error exporting data:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message || "Failed to export data. Please try again.",
        });
      },
    });
  }

  updateSummaryCards() {
    this.summaryCards[0].value = this.totalCompanies;
    this.summaryCards[1].value = this.totalRevenue;
    this.summaryCards[2].value = this.activeSubscribedEmployers;
    this.summaryCards[3].value = this.totalActiveJobs;
    this.summaryCards[4].value = this.totalApplicants;
    this.summaryCards[5].value = this.totalCardsSeen;
    this.summaryCards[6].value = this.totalUsers;
  }

  selectTab(index: number) {
    this.selectedTab = index;
    this.applyTabFilter();
  }

  applyTabFilter() {
    const filter = this.summaryCards[this.selectedTab].filter;

    switch (filter) {
      case "all":
        this.filteredCompanies = [...this.companies];
        break;
      case "revenue":
        this.filteredCompanies = this.companies.filter(
          (company) =>
            company.total_revenue !== null &&
            company.total_revenue !== undefined,
        );
        if (this.filteredCompanies.length === 0) {
          this.filteredCompanies = [...this.companies];
        }
        break;
      case "active_subscribed":
        this.filteredCompanies = this.companies.filter(
          (company) =>
            company.plan_name !== null && company.plan_name !== undefined,
        );
        break;
      case "active_jobs":
        this.filteredCompanies = this.companies.filter(
          (company) => company.jobs && company.jobs > 0,
        );
        break;
      case "applicants":
        this.filteredCompanies = this.companies.filter(
          (company) => company.applicants && company.applicants > 0,
        );
        break;
      case "cards_seen":
        this.filteredCompanies = this.companies.filter(
          (company) =>
            company.viewed_talents_count !== null &&
            company.viewed_talents_count !== undefined &&
            company.viewed_talents_count > 0,
        );
        break;
      case "users":
        this.filteredCompanies = this.companies.filter(
          (company) => company.users && company.users > 0,
        );
        break;
      default:
        this.filteredCompanies = [...this.companies];
    }
    // Reset selection state when filter changes
    this.selectedCompanies = [];
    this.selectAllCheckboxes = false;
    // Ensure all companies have isChecked property
    this.filteredCompanies.forEach((company: any) => {
      if (company.isChecked === undefined) {
        company.isChecked = false;
      }
    });
    this.updateSelectAllState();
  }

  refreshData() {
    this.companyFilterForm.reset();
    this.selectedTab = 0;
    this.currentPage = 1;
    this.getCompanies();
    this.toast.add({
      severity: "success",
      summary: "Refreshed",
      detail: "Data has been refreshed successfully",
    });
  }

  currentSortField: string | null = null;
  currentSortOrder: number = 1;
  currentFirst: number = 0;
  @ViewChild("dt") table: any;
  selectedCompanies: any[] = [];
  selectAllCheckboxes: boolean = false;
  selectionMode: "single" | "multiple" = "multiple";
  onPageChange(event: any) {
    this.isTableLoading = true;
    const isSortToggle =
      event.sortField === this.currentSortField &&
      event.sortOrder !== this.currentSortOrder &&
      event.first === 0 &&
      this.currentFirst !== 0;
    if (isSortToggle) {
      event.first = this.currentFirst;
    }
    this.currentSortField = event.sortField;
    this.currentSortOrder = event.sortOrder;
    this.currentFirst = event.first;
    this.currentPage = event.first / event.rows + 1;
    this.pageSize = event.rows;
    const params = this.buildCompanyListParams();

    this.companyService.getCompanyList(params).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.companies = (res.data.companies || []).map((company: any) => ({
            ...company,
            isChecked: false,
          }));
          if (this.currentSortField) {
            this.companies.sort((a, b) => {
              let aValue = a[this.currentSortField!];
              let bValue = b[this.currentSortField!];

              if (aValue == null) aValue = "";
              if (bValue == null) bValue = "";

              if (typeof aValue === "string") aValue = aValue.toLowerCase();
              if (typeof bValue === "string") bValue = bValue.toLowerCase();

              let result = 0;
              if (aValue < bValue) result = -1;
              else if (aValue > bValue) result = 1;

              return this.currentSortOrder * result;
            });
          }

          this.filteredCompanies = [...this.companies];
          this.selectedCompanies = [];
          this.selectAllCheckboxes = false;
          this.totalCompanies = res.data.totalcompanies || 0;
          this.totalActiveJobs = res.data.total_active_jobs || 0;
          this.activeSubscribedEmployers =
            res.data.total_active_subscriptions || 0;
          this.totalApplicants = res.data.total_applicants || 0;
          this.totalCardsSeen = res.data.total_card_seen || 0;
          this.totalUsers = res.data.total_users || 0;
          this.totalRevenue = "INR " + res.data.total_revenue || 0;
          this.totalRevenuePercentage = res.data.total_revenue_percentage || 0;
          this.todayData = res.data.today_count || {};
          this.totalJobs = res.data.total_jobs;
          this.totalJobsPercentage = res.data.total_jobs_percentage || 0;
          this.totalActiveJobsPercentage =
            res.data.total_active_jobs_percentage || 0;
          this.totalApplicantsPercentage =
            res.data.total_applicants_percentage || 0;
          this.totalActiveSubscriptionsPercentage =
            res.data.total_active_subscriptions_percentage || 0;
          this.applyTabFilter();
          this.updateSummaryCards();
          if (isSortToggle && this.table) {
            setTimeout(() => {
              this.table.first = this.currentFirst;
            }, 0);
          }
        }
      },
      error: (err) => {
        console.error("Error on page change:", err);
      },
      complete: () => {
        this.isTableLoading = false;
      },
    });
  }

  getPlanLabel(company: any): string {
    // plan_name is null
    if (!company.plan_name) {
      return "Standard(Free) Plan";
    }

    // validityEndDate is null
    if (!company.validityEndDate) {
      return "Standard (Free Plan)";
    }

    // validityEndDate before today
    const today = new Date();
    const endDate = new Date(company.validityEndDate);

    if (endDate < today) {
      return "Plan Exhausted";
    }

    // Otherwise show actual plan
    return "Premium (" + company.plan_name + ")";
  }

  private toApiValue(value: any) {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    if (Array.isArray(value) && value.length === 0) {
      return null;
    }
    return value;
  }

  private buildCompanyListParams() {
    const f = this.companyFilterForm?.value || {};
    return {
      student_id: this.studentId || null,
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
      company_id: this.toApiValue(f.companyId),
      company_name: this.toApiValue(f.companyName),
      email: this.toApiValue(f.email),
      company_size: this.toApiValue(f.companySize),
      country: this.toApiValue(f.country),
      headquarters_location: this.toApiValue(f.headquartersLocation),
      service_type: this.toApiValue(f.serviceType),
      company_createdby: this.toApiValue(f.companyCreatedBy),
      company_created: this.toApiValue(f.companyCreated),
      advertised_jobs: this.toApiValue(f.advertisedJobs),
      total_jobs: this.toApiValue(f.totalJobs),
      active_jobs: this.toApiValue(f.activeJobs),
      applicants: this.toApiValue(f.applicants),
      talent_credit: this.toApiValue(f.talentCredit),
      subscription_plan: this.toApiValue(f.subscriptionPlan),
      remark_status: this.toApiValue(f.remarkStatus),
      source_type: this.toApiValue(f.source_type),
      source_name: this.toApiValue(f.source_name),
      relationship_manager: this.toApiValue(f.relationshipManager),
      remark_addedby: this.toApiValue(f.remarkAddedBy),
      remark_from: this.toApiValue(f.remarkFromDate),
      remark_to: this.toApiValue(f.remarkToDate),
      created_from: this.toApiValue(f.createdFromDate),
      created_to: this.toApiValue(f.createdToDate),
      report_from: this.toApiValue(f.reportFromDate),
      report_to: this.toApiValue(f.reportToDate),
      login_from: this.toApiValue(f.lastLoginFromDate),
      login_to: this.toApiValue(f.lastLoginToDate),
    };
  }

  goToViewJob(companyId: number) {
    this.router.navigate(["/jobs/view-jobs"], {
      queryParams: { company_id: companyId },
    });
  }

  goToViewTalent(companyId: number) {
    this.router.navigate(["/talent-connect/talents"], {
      queryParams: { company_id: companyId },
    });
  }

  goToViewTalentSeen(companySeen: number) {
    this.router.navigate(["/talent-connect/talents"], {
      queryParams: { company_seen: companySeen },
    });
  }

  softDeleteCompany(companyId: number) {
    this.companyService.softDeleteCompany({ id: companyId }).subscribe({
      next: (res) => {
        if (res) {
          this.getCompanies();
        }
      },
    });
  }

  selectAllCheckbox(event?: any) {
    // Get the checked state from event if available, otherwise toggle
    const shouldSelectAll =
      event?.checked !== undefined ? event.checked : !this.selectAllCheckboxes;
    this.selectAllCheckboxes = shouldSelectAll;

    if (shouldSelectAll) {
      // Select all companies in filtered list
      this.selectedCompanies = [];
      this.filteredCompanies.forEach((company: any) => {
        company.isChecked = true;
        // Add to selectedCompanies if not already present
        if (!this.selectedCompanies.find((c) => c.id === company.id)) {
          this.selectedCompanies.push(company);
        }
      });
    } else {
      // Unselect all companies
      this.selectedCompanies = [];
      this.filteredCompanies.forEach((company: any) => {
        company.isChecked = false;
      });
    }
    // Force change detection to update the UI
    this.cdr.detectChanges();
  }

  onRowSelect(company: any) {
    company.isChecked = true;
    if (!this.selectedCompanies.find((c) => c.id === company.id)) {
      this.selectedCompanies.push(company);
    }
    this.updateSelectAllState();
  }

  onRowUnselect(company: any) {
    company.isChecked = false;
    this.selectedCompanies = this.selectedCompanies.filter(
      (c) => c.id !== company.id,
    );
    this.updateSelectAllState();
  }

  onCheckboxChange(company: any, event: any) {
    if (event.checked) {
      this.onRowSelect(company);
    } else {
      this.onRowUnselect(company);
    }
  }

  updateSelectAllState() {
    if (this.filteredCompanies.length === 0) {
      this.selectAllCheckboxes = false;
      return;
    }
    const allSelected = this.filteredCompanies.every(
      (company: any) => company.isChecked,
    );
    this.selectAllCheckboxes = allSelected;
  }

  deleteSelectedCompanies() {
    if (this.selectedCompanies.length === 0) {
      this.toast.add({
        severity: "warn",
        summary: "No Selection",
        detail: "Please select at least one company to delete",
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to disable ${this.selectedCompanies.length} selected company(s)?`,
      header: "Confirm Disable",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.performDelete();
      },
    });
  }

  performDelete() {
    // Extract employer_id from selected companies
    // Use employer_id if available, otherwise fall back to id
    const employerIds = this.selectedCompanies.map(
      (c) => c.employer_id || c.id,
    );

    const payload = {
      employer_id: employerIds,
    };

    this.companyService.disableCompanies(payload).subscribe({
      next: (res) => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: `${this.selectedCompanies.length} company(s) disabled successfully`,
        });
        // Clear selections
        this.selectedCompanies = [];
        this.selectAllCheckboxes = false;
        // Reset all checkboxes
        this.filteredCompanies.forEach((company: any) => {
          company.isChecked = false;
        });
        // Refresh the data
        this.getCompanies();
      },
      error: (err) => {
        console.error("Error disabling companies:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message ||
            "Failed to disable companies. Please try again.",
        });
      },
    });
  }
}
