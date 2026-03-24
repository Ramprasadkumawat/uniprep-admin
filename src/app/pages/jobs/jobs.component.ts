import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { JobsService } from "./jobs.service";
import { CompaniesService } from "../companies/companies.service";
import { MultiSelectModule } from "primeng/multiselect";
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  tap,
} from "rxjs";
import { PopoverModule } from "primeng/popover";
import { ActivatedRoute, Router } from "@angular/router";
import { Tooltip } from "primeng/tooltip";
import { AddJobComponent } from "./add-job/add-job.component";

@Component({
  selector: "uni-jobs",
  imports: [
    DialogModule,
    AccordionModule,
    ButtonModule,
    TableModule,
    ConfirmPopupModule,
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
    AddJobComponent,
    SharedModule,
  ],
  templateUrl: "./jobs.component.html",
  styleUrl: "./jobs.component.scss",
  providers: [ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class JobsComponent {
  jobFilterForm!: FormGroup;
  jobs = [];
  totalJobs: number = 0;
  totalCompanies: number = 0;
  totalVacancies: number = 0;
  totalJobsExhausted: number = 0;
  workLocation: any[] = [];
  positions: any[] = [];
  hiringType: any[] = [];
  workMode: any[] = [];
  workType: any[] = [];
  languages: any[] = [];
  gender: any[] = [];
  experienceLevel: any[] = [];
  interviewFormat: any[] = [];
  minimumEducation: any[] = [];
  introVideo: any[] = [
    { id: "Yes", value: "Yes" },
    { id: "No", value: "No" },
  ];
  /** Companies for job filter (from companies-list-for-admin) */
  companyOptions: any[] = [];
  /** True while companies API is loading (shows loader on multiselect) */
  companyOptionsLoading = true;
  languageProficiency: any[] = [];
  currency: any[] = [];
  status: any[] = [];
  viewJob: boolean = false;
  jobData: any;
  onPopOverTriggeredJobId: number;
  editingJobId: number | null = null;
  selectedJobData: any = null;
  clickedJobData: any;
  filteredJobs = [];
  selectedTab: number = 0;
  selectedStage: any;
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
      label: "Total Active Jobs",
      value: 0,
      class: "card-approved",
      filter: "active",
    },
    {
      label: "Total Vacancies",
      value: 0,
      class: "card-total-vacancies",
      filter: "vacancies",
    },
    {
      label: "Total Jobs Exhausted",
      value: 0,
      class: "card-reject",
      filter: "exhausted",
    },
  ];
  companyId: number | null = null;
  jobCreatedBy: any[] = [
    { label: "Uniprep", value: "Uniprep" },
    { label: "Employer", value: "Employer" },
  ];
  instituteCountry: any[] = [];
  institute: any[] = [];
  talentCreation: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  userRegistration: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  application: any[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  jobStatus: any[] = [
    { label: "Active", value: "active" },
    { label: "Exhausted", value: "exhausted" },
  ];
  isViewMode: boolean = false;
  showImportDialog: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private companiesService: CompaniesService,
    private toast: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getDropdowns();
    this.initializeFilterForm();
    // Do not call getJobs() here: p-table [lazy]="true" fires (onLazyLoad) → onPageChange()
    // which already posts to company-job-list-foradmin (duplicate request if we also getJobs).
    let skipNextReloadBecauseLazyTableWillFetch = true;
    this.route.queryParams
      .pipe(
        map((p) => p["company_id"] ?? null),
        distinctUntilChanged(),
      )
      .subscribe((companyIdParam) => {
        this.companyId = companyIdParam;
        if (skipNextReloadBecauseLazyTableWillFetch) {
          skipNextReloadBecauseLazyTableWillFetch = false;
          return;
        }
        this.currentPage = 1;
        this.currentFirst = 0;
        queueMicrotask(() =>
          this.onPageChange({
            first: 0,
            rows: this.pageSize,
            sortField: this.currentSortField,
            sortOrder: this.currentSortOrder ?? 1,
          }),
        );
      });
  }

  initializeFilterForm(): void {
    this.jobFilterForm = this.fb.group({
      jobTitle: [null],
      jobId: [""],
      createdDateFrom: [""],
      createdDateTo: [""],
      hiringType: [""],
      company: [[] as number[]],
      workLocation: [""],
      salaryOffered: [],
      salaryOfferedFrom: [],
      salaryOfferedTo: [],
      jobStartDate: [""],
      jobStartDateFrom: [""],
      jobStartDateTo: [""],
      applicationDeadlineFrom: [""],
      applicationDeadlineTo: [""],
      jobApplicationDeadline: [""],
      status: [""],
      totalApplications: [0],
      totalUserRegistration: [0],
      totalTalentCreation: [0],
      jobCreatedBy: [null],
      jobOverview: [""],
      keyResponsibilities: [""],
      availableVacancies: [""],
      workMode: [""],
      workType: [""],
      minEducation: [""],
      genderRequirement: [""],
      experienceLevel: [""],
      language: [""],
      languageProficiency: [""],
      interviewFormat: [""],
      introductionVideo: [""],
      verifiedTalentRequirement: [""],
      additionalNotes: [""],
      jobLink: [""],
      currency: [""],
      instituteCountry: [""],
      institute: [""],
      talentCreation: [""],
      userRegistration: [""],
      application: [""],
    });
  }

  getDropdowns() {
    this.jobsService.getWorkLocationDropdownData().subscribe((res) => {
      this.workLocation = [...res.worklocations];
    });

    this.jobsService.getDropdownData().subscribe((res) => {
      this.hiringType = res.hiringtypes;
      this.workMode = res.workmode;
      this.workType = res.employmenttype;
      this.languages = res.language;
      this.languageProficiency = res.proficiencylevel;
      this.gender = res.gender;
      this.experienceLevel = res.experiecelevel;
      this.interviewFormat = res.interviewformat;
      this.minimumEducation = res.minimumeducation;
      this.currency = res.currencycode;
      this.positions = res.positions;
      this.instituteCountry = res.institute_countries;
      this.institute = res.institutes;
    });

    this.companyOptionsLoading = true;
    this.companiesService
      .getCompanyList({
        page: 1,
        perpage: 5000,
        is_admin: true,
      })
      .pipe(
        finalize(() => {
          this.companyOptionsLoading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          const rows = res?.data?.companies || [];
          this.companyOptions = rows.map((c: any) => ({
            ...c,
            id: c.id ?? c.company_id,
          }));
          const qid = this.route.snapshot.queryParamMap.get("company_id");
          if (qid && this.jobFilterForm) {
            const id = Number(qid);
            if (
              this.companyOptions.some(
                (c: any) => Number(c.id) === id || Number(c.company_id) === id,
              )
            ) {
              this.jobFilterForm.patchValue({ company: [id] });
            }
          }
        },
        error: (err) => {
          console.error("Error loading companies for filter:", err);
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to load company list for filter",
          });
        },
      });

    this.jobsService.getDropdownData().subscribe((response: any) => {
      this.status = response?.jobstages;
    });
  }

  parseDate(dateInput: string | Date): string | null {
    if (!dateInput) return null;

    if (dateInput instanceof Date) {
      const y = dateInput.getFullYear();
      const m = String(dateInput.getMonth() + 1).padStart(2, "0");
      const d = String(dateInput.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    const [day, month, year] = dateInput.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  /**
   * Multiselect stores company ids; job list API may use company_name and/or company_ids.
   */
  private buildCompanyFilterPart(f: any): {
    company_name: string;
    company_ids: number[];
  } {
    const raw = f.company;
    const ids: number[] = Array.isArray(raw)
      ? raw
          .map((x: any) => (x != null && x !== "" ? Number(x) : Number.NaN))
          .filter((n: number) => !Number.isNaN(n))
      : [];
    if (!ids.length) {
      return { company_name: "", company_ids: [] };
    }
    const names = ids
      .map((id) =>
        this.companyOptions.find(
          (c: any) => Number(c.id) === id || Number(c.company_id) === id,
        ),
      )
      .filter(Boolean)
      .map((c: any) => c.company_name)
      .filter(Boolean);
    return {
      company_name: names.join(","),
      company_ids: ids,
    };
  }

  getJobs(companyId?: any) {
    const params = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
      company_id: null,
    };

    if (companyId) {
      params.company_id = companyId;
    }

    this.isLoading = true;
    this.jobsService
      .getJobs(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.jobs = res.data.jobs;
        this.totalJobs = res.data.totalactivejobs;
        this.totalCompanies = res.data.totalcompanies;
        this.totalVacancies = res.data.totalvacancies;
        this.totalJobsExhausted = res.data.totalexhaustedjobs;
        this.updateSummaryCards(res.data);
        this.applyTabFilter();
      });
  }

  onEditModeChanged(isViewMode: boolean) {
    this.isViewMode = isViewMode;
  }

  onJobSavedFromDialog() {
    this.viewJob = false;
    this.editingJobId = null;
    this.selectedJobData = null;
    this.jobData = null;
    this.isViewMode = true;
    this.getJobs();
  }

  onJobSaved() {
    this.editingJobId = null;
    this.selectedJobData = null;
    this.getJobs();
  }

  starsArray(rating: string): string[] {
    if (!rating) return [];
    let ratingValue = 2;
    switch (rating) {
      case "Beginner":
        ratingValue = 2;
        break;
      case "Fluent":
        ratingValue = 3;
        break;
      case "Proficient":
        ratingValue = 4;
        break;
      case "Native":
        ratingValue = 5;
        break;
      default:
        ratingValue = 2;
        break;
    }
    const full = Math.floor(ratingValue);
    const totalStars = 5;
    const stars: string[] = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < full) {
        stars.push("pi-star-fill");
      } else {
        stars.push("pi-star");
      }
    }
    return stars;
  }

  getJobDetails(
    id: any,
    mode: "view" | "edit" | "share",
    jobDetails: any,
    event?: Event,
  ) {
    event?.preventDefault();
    event?.stopPropagation();
    this.clickedJobData = jobDetails;

    let req = {
      job_id: id,
      is_admin: true,
    };
    this.isLoading = true;
    this.jobsService
      .showJob(req)
      .pipe(
        finalize(() => (this.isLoading = false)),
        tap((response: any) => {
          this.onPopOverTriggeredJobId = response.data.job[0].uuid;
          this.jobData = response.data.job[0];
          if (this.jobData.language_proficiency) {
            let parsed = this.jobData.language_proficiency;

            if (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch (e) {
                parsed = [];
              }
            }

            if (Array.isArray(parsed)) {
              this.jobData.language_proficiency = parsed.map((item: any) => {
                if (Array.isArray(item)) {
                  return {
                    language: item[0],
                    proficiency: item[1],
                  };
                }

                return {
                  language: item.language,
                  proficiency: item.proficiency || item.level,
                };
              });
            } else {
              this.jobData.language_proficiency = [];
            }
          }
          if (mode === "view") {
            this.viewJob = true;
            this.isViewMode = true;
          } else if (mode === "edit") {
            this.viewJob = false;
            this.jobsService.setJobToEdit(this.jobData);
            this.router.navigate(["/jobs/create-job"]);
          } else if (mode === "share") {
            this.viewJob = false;
          }
        }),
        catchError((error: any) => {
          if (error.status == 403) {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: "Unauthorized Access",
            });
          }
          console.error("Error fetching job:", error);
          return of(null);
        }),
      )
      .subscribe();
  }

  isFutureDate(date: string | Date): boolean {
    const startDate = new Date(date);
    const fourMonthsFromToday = new Date();
    fourMonthsFromToday.setMonth(fourMonthsFromToday.getMonth() + 4);
    return startDate > fourMonthsFromToday;
  }

  applyFilters() {
    const f = this.jobFilterForm.value;
    const cf = this.buildCompanyFilterPart(f);
    const params = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
      job_id: f.jobId || "",
      position_title: f.jobTitle || "",

      created_from: this.parseDate(f.createdDateFrom),
      created_to: this.parseDate(f.createdDateTo),
      created_by: f.jobCreatedBy || "",
      company_id: cf.company_ids.length ? null : this.companyId,
      company_ids: cf.company_ids,
      company_name: cf.company_name || "",
      hiring_type: f.hiringType || "",

      job_start_from: this.parseDate(f.jobStartDateFrom),
      job_start_to: this.parseDate(f.jobStartDateTo),

      job_deadline_from: this.parseDate(f.applicationDeadlineFrom),
      job_deadline_to: this.parseDate(f.applicationDeadlineTo),

      work_location: f.workLocation,
      work_mode: f.workMode || "",
      work_type: f.workType || "",

      minimum_education: f.minEducation || "",
      gender_requirement: f.genderRequirement || "",
      experience_level: f.experienceLevel || "",

      salary_from: f.salaryOfferedFrom || "",
      salary_to: f.salaryOfferedTo || "",

      language: f.language || "",
      language_proficiency: f.languageProficiency || "",
      interview_format: f.interviewFormat || "",

      introduction_video: f.introductionVideo || "",
      verified_talent: f.verifiedTalentRequirement || "",

      institute_id: f.institute || "",
      institute_country_id: f.instituteCountry || "",
      status: f.status || "",

      talent_creation: f.talentCreation || "",
      talent_registered: f.userRegistration || "",
      talent_applied: f.application || "",
    };

    this.isLoading = true;
    this.jobsService
      .getJobs(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.jobs = res.data.jobs;
        this.totalJobs = res.data.totalactivejobs;
        this.totalCompanies = res.data.totalcompanies;
        this.totalVacancies = res.data.totalvacancies;
        this.totalJobsExhausted = res.data.totalexhaustedjobs;
        this.updateSummaryCards(res.data);
        this.applyTabFilter();
      });
  }

  resetFilters() {
    this.jobFilterForm.reset();
    this.selectedTab = 0;
    this.getJobs();
  }

  onTriggerMenu(event: any, jobData: any) {
    event?.stopPropagation();
    this.jobsService.setFormData(jobData);
    this.onPopOverTriggeredJobId = jobData.uuid;
  }

  shareViaWhatsapp(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  }

  shareViaMail(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(`mailto:?body=${url}`, "_blank");
  }

  shareViaFacebook(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  }

  shareViaTwitter(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
  }

  shareViaInstagram(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(`https://www.instagram.com?url=${url}`, "_blank");
  }

  shareViaLinkedIn(uuid: any): void {
    const url = this.buildLink(uuid);
    window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank");
  }

  private buildLink(uuid: any): string {
    if (this.clickedJobData.institute_domain) {
      const domain = this.clickedJobData.institute_domain;
      const firstPart = domain.split(".")[0];
      return encodeURI(`https://job.uniprep.ai/view/${uuid}/${firstPart}`);
    } else {
      return encodeURI(`https://job.uniprep.ai/view/${uuid}`);
    }
  }

  copyLink(uuid: any): void {
    const url = this.buildLink(uuid);
    navigator.clipboard.writeText(url);
    this.toast.add({
      severity: "success",
      summary: "Copied",
      detail: "Job link copied successfully!",
    });
  }

  exportJobs() {
    const f = this.jobFilterForm.value;
    const cf = this.buildCompanyFilterPart(f);

    const filterData: any = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,

      job_id: f.jobId || "",
      position_title: f.jobTitle || "",

      created_from: this.parseDate(f.createdDateFrom),
      created_to: this.parseDate(f.createdDateTo),

      created_by: f.jobCreatedBy || "",
      company_id: cf.company_ids.length ? null : this.companyId,
      company_ids: cf.company_ids,
      company_name: cf.company_name || "",
      hiring_type: f.hiringType || "",

      job_start_from: this.parseDate(f.jobStartDateFrom),
      job_start_to: this.parseDate(f.jobStartDateTo),

      job_deadline_from: this.parseDate(f.applicationDeadlineFrom),
      job_deadline_to: this.parseDate(f.applicationDeadlineTo),

      work_location: f.workLocation,
      work_mode: f.workMode || "",
      work_type: f.workType || "",

      minimum_education: f.minEducation || "",
      gender_requirement: f.genderRequirement || "",
      experience_level: f.experienceLevel || "",

      salary_from: f.salaryOfferedFrom || "",
      salary_to: f.salaryOfferedTo || "",

      language_proficiency: f.languageProficiency || "",
      interview_format: f.interviewFormat || "",

      introduction_video: f.introductionVideo || "",
      verified_talent: f.verifiedTalentRequirement || "",

      institute_id: f.institute || "",
      institute_country_id: f.instituteCountry || "",
      status: f.status || "",
    };

    this.jobsService.exportJobs(filterData).subscribe({
      next: (res) => {
        if (res?.status && res?.export_link) {
          window.open(res.export_link, "_blank");
          this.toast.add({
            severity: "success",
            summary: "Export",
            detail: res?.message || "Export file is being downloaded",
          });
        } else {
          this.toast.add({
            severity: "warn",
            summary: "Export",
            detail: res?.message || "No download link received from server",
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

  importJobs(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const formData = new FormData();
    formData.append("csv_file", file);

    this.jobsService.importJobs(formData).subscribe({
      next: (res) => {
        this.showImportDialog = false;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: res?.message || "Jobs imported successfully",
        });
        this.getJobs();
      },
      error: (err) => {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message || "Failed to import jobs. Please try again.",
        });
      },
    });
    input.value = "";
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  updateSummaryCards(data?: any) {
    if (data) {
      this.summaryCards[0].value = data.totalcompanies || 0;
      this.summaryCards[1].value = data.totalactivejobs || 0;
      this.summaryCards[2].value = data.totalvacancies || 0;
      this.summaryCards[3].value = data.totalexhaustedjobs || 0;
    } else {
      this.summaryCards[0].value = this.getUniqueCompaniesCount();
      this.summaryCards[1].value = this.jobs.filter(
        (j: any) => j.status === 1,
      ).length;
      this.summaryCards[2].value = this.jobs.reduce(
        (sum: number, j: any) => sum + (j.available_vacancies || 0),
        0,
      );
      this.summaryCards[3].value = this.jobs.filter(
        (j: any) => j.status === 3,
      ).length;
    }
  }

  getUniqueCompaniesCount(): number {
    const uniqueCompanies = new Set(this.jobs.map((j: any) => j.company_name));
    return uniqueCompanies.size;
  }

  selectTab(index: number) {
    this.selectedTab = index;
    this.applyTabFilter();
  }

  applyTabFilter() {
    const filter = this.summaryCards[this.selectedTab].filter;
    if (filter === "all") {
      this.filteredJobs = [...this.jobs];
    } else if (filter === "active") {
      this.filteredJobs = this.jobs.filter((j: any) => j.status === 1);
    } else if (filter === "vacancies") {
      this.filteredJobs = this.jobs.filter((j: any) => j.status === 1);
    } else if (filter === "exhausted") {
      this.filteredJobs = this.jobs.filter((j: any) => j.status === 3);
    } else {
      this.filteredJobs = [...this.jobs];
    }
  }

  refreshData() {
    this.jobFilterForm.reset();
    this.selectedTab = 0;
    this.getJobs();
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
  onPageChange(event: any) {
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
    const f = this.jobFilterForm.value;
    const cf = this.buildCompanyFilterPart(f);
    const params = {
      page: this.currentPage,
      perpage: this.pageSize,
      is_admin: true,
      company_id: cf.company_ids.length ? null : this.companyId,

      job_id: f.jobId || "",
      position_title: f.jobTitle || "",

      created_from: this.parseDate(f.createdDateFrom),
      created_to: this.parseDate(f.createdDateTo),
      created_by: f.jobCreatedBy || "",
      company_ids: cf.company_ids,
      company_name: cf.company_name || "",
      hiring_type: f.hiringType || "",

      job_start_from: this.parseDate(f.jobStartDateFrom),
      job_start_to: this.parseDate(f.jobStartDateTo),

      job_deadline_from: this.parseDate(f.applicationDeadlineFrom),
      job_deadline_to: this.parseDate(f.applicationDeadlineTo),

      work_location: f.workLocation,
      work_mode: f.workMode || "",
      work_type: f.workType || "",

      minimum_education: f.minEducation || "",
      gender_requirement: f.genderRequirement || "",
      experience_level: f.experienceLevel || "",

      salary_from: f.salaryOfferedFrom || "",
      salary_to: f.salaryOfferedTo || "",

      language: f.language || "",
      language_proficiency: f.languageProficiency || "",
      interview_format: f.interviewFormat || "",

      introduction_video: f.introductionVideo || "",
      verified_talent: f.verifiedTalentRequirement || "",

      institute_id: f.institute || "",
      institute_country_id: f.instituteCountry || "",
      status: f.status || "",

      talent_creation: f.talentCreation || "",
      talent_registered: f.userRegistration || "",
      talent_applied: f.application || "",
    };
    this.isLoading = true;
    this.jobsService
      .getJobs(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.jobs = res.data.jobs;
        if (this.currentSortField) {
          this.jobs.sort((a, b) => {
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
        this.filteredJobs = [...this.jobs];
        this.totalJobs = res.data.totalactivejobs;
        this.totalCompanies = res.data.totalcompanies;
        this.totalVacancies = res.data.totalvacancies;
        this.totalJobsExhausted = res.data.totalexhaustedjobs;
        this.updateSummaryCards(res.data);
        this.applyTabFilter();
        if (isSortToggle && this.table) {
          setTimeout(() => {
            this.table.first = this.currentFirst;
          }, 0);
        }
      });
  }

  goToViewTalent(jobId: number) {
    this.router.navigate(["/talent-connect/talents"], {
      queryParams: { job_id: jobId },
    });
  }

  goToViewUser(jobId: number) {
    this.router.navigate(["/subscribers"], {
      queryParams: { job_id: jobId },
    });
  }

  goToViewTalentApplicants(appliedJobId: number) {
    this.router.navigate(["/subscribers"], {
      queryParams: { applied_jobid: appliedJobId },
    });
  }
}
