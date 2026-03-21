import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { MultiSelectModule } from "primeng/multiselect";
import { EditorModule } from "primeng/editor";
import { JobsService } from "../jobs.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { CheckboxModule } from "primeng/checkbox";
import { TagModule } from "primeng/tag";
import { debounceTime, distinctUntilChanged, forkJoin } from "rxjs";

@Component({
  selector: "uni-add-job",
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmPopupModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MultiSelectModule,
    EditorModule,
    DialogModule,
    CheckboxModule,
    TagModule,
    SharedModule,
  ],
  templateUrl: "./add-job.component.html",
  styleUrl: "./add-job.component.scss",
  providers: [ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddJobComponent {
  @Input() editingJobId: number | null = null;
  @Output() jobSaved = new EventEmitter<void>();
  @Output() targetInput: EventEmitter<string> = new EventEmitter<string>();
  @Input() isViewMode: boolean = false;
  @Output() editModeChanged = new EventEmitter<boolean>();
  @Input() jobData: any = null;
  jobForm!: FormGroup;
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
  company: any[] = [];
  languageProficiency: any[] = [];
  currency: any[] = [];
  minStartDate: string = "";
  maxEndDate: string = "";
  minEndDate: string = "";
  isLoadingAiGenerateButton: boolean = false;
  positiontitleValue: any;
  companyValue: any;
  filteredValue: string = "";
  instituteCountry: any[] = [];
  institute: any[] = [];
  showJobCreditModal: boolean = false;
  jobCreditCount: number = 0;
  jobId: number = 0;
  jobuuid: any;
  customCoHireLogo: string | null = null;
  private selectedFile: File | null = null;

  /** True when hiring type is Co-hiring (id 2). Used to show co-hiring section and hide advertised company. */
  get isCoHiringType(): boolean {
    const v = this.jobForm?.get('hiringType')?.value;
    return v === 2 || v === '2';
  }

  /** True when advertised company row (Company ID + Company) should be visible. Hidden for Co-hiring. */
  get showAdvertisedCompanySection(): boolean {
    // return !this.isCoHiringType;
    return true
  }

  /** Page header title: View Job | Update Job | Create Job (single source of truth) */
  get pageTitle(): "View Job" | "Update Job" | "Create Job" {
    if (this.isViewMode) return "View Job";
    if (this.editingJobId != null) return "Update Job";
    return "Create Job";
  }

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 10);
    this.minStartDate = startDate.toISOString().split("T")[0];
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get("create") === "1") {
      this.jobsService.clearJobToEdit();
      this.editingJobId = null;
      this.jobData = null;
    }
    this.initializeForm();
    this.loadDropdowns();

    this.jobForm.get('companyId')?.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe((companyId) => {

        if (!companyId || String(companyId).trim() === '') {
          this.jobForm.patchValue({ company: null }, { emitEvent: false });
          return;
        }
        const searchId = String(companyId).trim().toUpperCase();

        const matchedCompany = this.company.find((c: any) => {
          if (!c.companyId) {
            return false;
          }
          const companyIdStr = String(c.companyId).trim().toUpperCase();
          return companyIdStr === searchId;
        });

        if (matchedCompany) {
          this.jobForm.patchValue(
            { company: matchedCompany.company_id },
            { emitEvent: false }
          );
        } else {
          this.jobForm.patchValue(
            { company: null },
            { emitEvent: false }
          );
        }
      });

    this.jobForm.get('company')?.valueChanges.subscribe((selectedCompanyId) => {
      if (selectedCompanyId) {
        const company = this.company.find((c: any) => c.company_id === selectedCompanyId);
        if (company && this.jobForm.get('companyId')?.value !== company.companyId) {
          this.jobForm.patchValue({ companyId: company.companyId }, { emitEvent: false });
        }
      }
    });

    this.jobForm.get('hiringType')?.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(type => {
        this.handleHiringTypeChange(type);
      });
    this.jobForm.get('isPaid')?.valueChanges.subscribe(() => {
      this.changePaidMode();
    });

  }

  handleHiringTypeChange(type: number | string): void {
    const typeNum = type != null ? Number(type) : null;
    const companyId = this.jobForm.get('companyId');
    const company = this.jobForm.get('company');
    const cohire = this.jobForm.get('cohire_company_name');
    const instituteCountry = this.jobForm.get('institute_country_id');
    const institute = this.jobForm.get('institute_id');
    const jobFairStart = this.jobForm.get('job_fair_start_date');
    const jobFairEnd = this.jobForm.get('job_fair_end_date');



    // Hiring Type 2 – Co-Hiring
       // Hiring Type 2 – Co-Hiring
       if (typeNum === 2) {
        cohire?.setValidators([Validators.required]);
        // keep Company ID / Company required so errors show when missing
        companyId?.setValidators([Validators.required]);
        company?.setValidators([Validators.required]);
        // (optionally remove the patchValue lines if you don't want them cleared)
      } else {
        // Not Co-hiring: co-hiring optional
        cohire?.setValidators([]);
        cohire?.patchValue('', { emitEvent: false });
        this.customCoHireLogo = null;
        companyId?.setValidators([Validators.required]);
        company?.setValidators([Validators.required]);
      }
    // Hiring Type 2 – Co-Hiring: require co-hiring fields; clear and unrequire advertised company
    // if (typeNum === 2) {
    //   cohire?.setValidators([Validators.required]);


    //   // companyId?.setValidators([]);
    //   // company?.setValidators([]);
    //   // companyId?.patchValue(null, { emitEvent: false });
    //   // company?.patchValue(null, { emitEvent: false });
    //   // this.jobForm.patchValue({ companyId: '', company: null }, { emitEvent: false });
    // } else {
    //   // Not Co-hiring: require company/companyId; co-hiring optional
    //   cohire?.setValidators([]);
    //   cohire?.patchValue('', { emitEvent: false });
    //   // clear any leftover validation errors when switching away from Co-hiring
    //   this.customCoHireLogo = null;
    //   companyId?.setValidators([Validators.required]);
    //   company?.setValidators([Validators.required]);
    // }

    // Hiring Type 3 – Institute Hiring
    if (typeNum === 3) {
      instituteCountry?.setValidators([Validators.required]);
      institute?.setValidators([Validators.required]);
    } else {
      instituteCountry?.setValidators([]);
      institute?.setValidators([]);
    }

    // Hiring Type 4 – Job Fair
    if (typeNum === 4) {
      jobFairStart?.setValidators([]);
      jobFairEnd?.setValidators([jobFairDateValidator()]);
    } else {
      jobFairStart?.setValidators([]);
      jobFairEnd?.setValidators([]);
    }

    [companyId, company, cohire, instituteCountry, institute, jobFairStart, jobFairEnd].forEach(ctrl =>
      ctrl?.updateValueAndValidity()
    );
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobData'] && this.jobData) {
      this.editingJobId = this.jobData.id;

      if (this.positions && this.positions.length > 0) {
        setTimeout(() => {
          this.patchFormWithJobData(this.jobData);
        }, 200);
      }
    }

    if (changes['isViewMode']) {
      this.toggleFormState();
    }
  }

  toggleFormState(): void {
    if (!this.jobForm) return;
    if (this.isViewMode) {
      this.jobForm.disable();
      this.languageProficiency1.disable();
    } else {
      this.jobForm.enable();
      this.languageProficiency1.enable();
    }
  }

  initializeForm(): void {
    this.jobForm = this.fb.group(
      {
        jobTitle: [null, [Validators.required]],
        hiringType: ["", [Validators.required]],
        company: ["", [Validators.required]],
        companyId: ["", [Validators.required]],
        workLocation: ["", [Validators.required]],
        salaryOffered: [0, [Validators.required]],
        isPaid: [false],
        jobStartDate: ["", [Validators.required, dateNotBeforeTenDaysFromToday, this.jobStartDateValidator]],
        jobApplicationDeadline: ["", [Validators.required, dateAfterTodayValidator()]],
        jobOverview: ["", [Validators.required, this.notEmptyHtmlValidator()]],
        keyResponsibilities: ["", [Validators.required, this.notEmptyHtmlValidator()]],
        availableVacancies: ["", [Validators.required]],
        workMode: ["", [Validators.required]],
        workType: ["", [Validators.required]],
        minEducation: ["", [Validators.required]],
        genderRequirement: ["", [Validators.required]],
        experienceLevel: ["", [Validators.required]],
        languageProficiency: this.fb.array([this.createLanguageGroup()], { validators: uniqueLanguages }),
        interviewFormat: ["", [Validators.required]],
        introductionVideo: ["", [Validators.required]],
        verifiedTalentRequirement: ["", [Validators.required]],
        additionalNotes: [""],
        currency: ["", [Validators.required]],
        cohire_company_name: [""],
        job_fair_start_date: [null],
        job_fair_end_date: [null],
        institute_country_id: [null],
        institute_id: [null],
      },
      {
        validators: dueDateAfterStartDateValidator(),
      }
    );
  }

  createLanguageGroup() {
    return this.fb.group({
      language: ["", Validators.required],
      level: ["", Validators.required],
    });
  }

  get languageProficiency1(): FormArray {
    return this.jobForm.get("languageProficiency") as FormArray;
  }

  addLanguage(): void {
    this.languageProficiency1.push(
      this.fb.group({
        language: [""],
        level: [""],
      })
    );
    this.languageProficiency1.updateValueAndValidity();
  }

  removeLanguage(index: number): void {
    this.languageProficiency1.removeAt(index);
    this.languageProficiency1.updateValueAndValidity();
  }

  loadDropdowns() {
    const workLocation$ = this.jobsService.getWorkLocationDropdownData();
    const dropdown$ = this.jobsService.getDropdownData();
    const companies$ = this.jobsService.getCompanies();

    forkJoin({
      workLocation: workLocation$,
      dropdown: dropdown$,
      companies: companies$
    }).subscribe((results) => {
      this.workLocation = (results.workLocation.worklocations || []).filter(
        (w: { work_location?: string }) =>
          w.work_location !== "Any" && w.work_location !== "Location Not Specified"
      );
      this.hiringType = Array.isArray(results.dropdown?.hiringtypes) ? results.dropdown.hiringtypes : [];
      this.workMode = results.dropdown.workmode;
      this.workType = results.dropdown.employmenttype;
      this.languages = results.dropdown.language;
      this.languageProficiency = results.dropdown.proficiencylevel;
      this.gender = results.dropdown.gender;
      this.experienceLevel = results.dropdown.experiecelevel;
      this.interviewFormat = results.dropdown.interviewformat;
      this.minimumEducation = results.dropdown.minimumeducation;
      this.currency = results.dropdown.currencycode;
      this.positions = results.dropdown.positions;
      this.company = results.companies.data;
      this.instituteCountry = results.dropdown.institute_countries;
      this.institute = results.dropdown.institutes;

      if (this.jobData) {
        this.editingJobId = this.jobData.id;
        setTimeout(() => {
          this.patchFormWithJobData(this.jobData);
          this.toggleFormState();
        }, 100);
      } else {
        const job = this.jobsService.getJobToEdit();
        if (job) {
          this.editingJobId = job.id;
          this.jobData = job;
          setTimeout(() => {
            this.patchFormWithJobData(job);
          }, 100);
        } else {
          // Create mode: ensure validators match default (no hiring type selected yet)
          this.handleHiringTypeChange(this.jobForm.get('hiringType')?.value);
        }
      }
    });
  }

  filteredInstitutes: any[] = [];
  onCountryChange(selectedCountry: any, preserveValue: boolean = false): void {
    if (!selectedCountry) {
      this.filteredInstitutes = [];
      if (!preserveValue) {
        this.jobForm.patchValue({
          institute_id: null,
        });
      }
      return;
    }
    const countryId = selectedCountry?.id || selectedCountry;

    if (!countryId) {
      this.filteredInstitutes = [];
      if (!preserveValue) {
        this.jobForm.patchValue({
          institute_id: null,
        });
      }
      return;
    }

    const allInstitutes = this.institute || [];

    this.filteredInstitutes = allInstitutes.filter(
      (institute: any) =>
        String(institute.country) === String(countryId)
    );
    if (!preserveValue) {
      this.jobForm.patchValue({
        institute_id: null,
      });
    }
  }

  submitJob() {
    if (this.editingJobId) {
      this.updateJob();
    } else {
      this.createJob();
    }
  }

  createJob() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const formValue = this.jobForm.value;
    
    const formData = this.buildFormData(formValue);
    const companyId = formValue.company;
    
    this.jobsService.createJob(formData).subscribe({
      next: (res) => {
        this.customCoHireLogo = null;
        this.jobForm.reset();
        this.handleHiringTypeChange(this.jobForm.get('hiringType')?.value);
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Job created successfully",
        });
        this.jobId = res.job_id
        this.jobuuid = res.uuid
        this.getJobCreditCount(companyId);
        this.jobSaved.emit();
      },
      error: (err) => {
        console.error(err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to create job",
        });
      },
    });
  }

  updateJob() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    if (!this.editingJobId) {
      console.error("Job ID missing");
      return;
    }

    const formValue = this.jobForm.value;
    // const payload = {
    //   job_id: this.editingJobId,
    //   ...this.buildJobPayload(formValue),
    // };

    const formData = this.buildFormData(formValue);
    formData.append('job_id', this.editingJobId.toString());


    this.jobsService.updateJob(formData).subscribe({
      next: () => {
        this.jobForm.reset();
        this.editingJobId = null;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Job updated successfully",
        });
        this.jobSaved.emit();
        this.router.navigate(["/jobs/view-jobs"]);
      },
      error: (err) => {
        console.error(err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update job",
        });
      },
    });
  }

  buildJobPayload(formValue: any) {
    return {
      company_id: formValue.company,
      hiring_type: formValue.hiringType,
      position_title: formValue.jobTitle,
      job_overview: formValue.jobOverview,
      key_responsibilities: formValue.keyResponsibilities,
      start_date: formValue.jobStartDate,
      due_date: formValue.jobApplicationDeadline,
      available_vacancies: formValue.availableVacancies,
      work_location: formValue.workLocation,
      work_mode: Array.isArray(formValue.workMode)
        ? formValue.workMode
        : [formValue.workMode],
      work_type: Array.isArray(formValue.workType)
        ? formValue.workType
        : [formValue.workType],
      minimum_education: formValue.minEducation,
      gender_requirement: formValue.genderRequirement,
      experience_level: formValue.experienceLevel,
      language_proficiency: formValue.languageProficiency.map((lp: any) => [
        lp.language,
        lp.level,
      ]),
      salary_offer: formValue.salaryOffered,
      interview_format: Array.isArray(formValue.interviewFormat)
        ? formValue.interviewFormat
        : [formValue.interviewFormat],
      intro_video: formValue.introductionVideo,
      verified_talent: formValue.verifiedTalentRequirement,
      additional_notes: formValue.additionalNotes,
      currency: formValue.currency,
      is_paid: formValue.isPaid ? 0 : 1,
      cohire_company_name: formValue.cohire_company_name,
      institute_id: formValue.institute_id,
      institute_country_id: formValue.institute_country_id,
      job_fair_start_date: formValue.job_fair_start_date,
      job_fair_end_date: formValue.job_fair_end_date,
    };
  }

  patchFormWithJobData(job: any) {
    const companyId = this.findIdByComLabel(this.company, "company_name", job.company_name, "company_id");
    const jobTitleId = this.findIdByLabel(this.positions, "position_title", job.position);
    const workLocationId = this.findIdByLabel(this.workLocation, "work_location", job.work_location);
    const startDate = this.parseDate(job.start_date);
    const dueDate = this.parseDate(job.due_date);
    const instituteCountryId = job.institute_country_id
      ? Number(job.institute_country_id)
      : null;
    const instituteId = job.institute_id
      ? job.institute_id.split(',').map((id: string) => Number(id.trim()))
      : [];

    const currencyCode = job.currency_code || job.currency || null;
    const salaryOffer = job.salary_offer
      ? (typeof job.salary_offer === 'string'
        ? parseFloat(job.salary_offer)
        : Number(job.salary_offer))
      : null;

    const minEducationId = this.getMinEducationId(job);

    if (instituteCountryId) {
      this.jobForm.patchValue({
        institute_country_id: instituteCountryId,
      });
      this.onCountryChange(instituteCountryId, true);
    }
    
    // Restore co-hire logo if the job carries one (edit/view mode)
    if (job.hiring_type === 2 && job.cohire_company_logo) {
      this.customCoHireLogo = job.cohire_company_logo;
      this.selectedFile = null; // important (no file selected yet)
    } else {
      this.customCoHireLogo = null;
    }

    this.jobForm.patchValue({
      company: companyId,
      hiringType: job.hiring_type,
      jobTitle: jobTitleId,
      jobOverview: job.job_overview ?? "",
      keyResponsibilities: job.key_responsibilities ?? "",
      jobStartDate: startDate,
      jobApplicationDeadline: dueDate,
      availableVacancies: job.available_vacancies ?? null,
      workLocation: workLocationId || 0,
      salaryOffered: salaryOffer,
      currency: currencyCode,
      introductionVideo: job.intro_video ?? null,
      verifiedTalentRequirement: job.verified_talent ?? null,
      additionalNotes: job.additional_notes ?? "",
      cohire_company_name: job.cohire_company_name,
      job_fair_start_date: job.job_fair_start_date,
      job_fair_end_date: job.job_fair_end_date,
      institute_id: instituteId,
      minEducation: minEducationId,
    });
    let langs = job.language_proficiency;
    if (typeof langs === 'string') {
      try {
        langs = JSON.parse(langs);
      } catch {
        langs = [];
      }
    }

    if (!Array.isArray(langs)) {
      langs = [];
    }

    const langArray = this.jobForm.get('languageProficiency') as FormArray;
    langArray.clear();

    langs.forEach((item: any) => {
      langArray.push(
        this.fb.group({
          language: [item.language || ""],
          level: [item.proficiency || item.level || ""],
        })
      );
    });

    this.patchRemainingFields(job);
    this.jobForm.get('isPaid')?.patchValue(
      this.isUnpaidJob(job, salaryOffer),
      { emitEvent: true }
    );
  }

  private isUnpaidJob(job: any, salaryOffer: number | null): boolean {
    const hasSalary = typeof salaryOffer === "number" && salaryOffer > 0;
    if (hasSalary) {
      return false;
    }

    const isPaidRaw = job?.is_paid;
    if (typeof isPaidRaw === "boolean") {
      return !isPaidRaw;
    }
    if (typeof isPaidRaw === "number") {
      return isPaidRaw !== 1;
    }
    if (typeof isPaidRaw === "string") {
      const normalized = isPaidRaw.trim().toLowerCase();
      if (["1", "true", "yes", "paid"].includes(normalized)) {
        return false;
      }
      if (["0", "false", "no", "unpaid"].includes(normalized)) {
        return true;
      }
    }

    return true;
  }

  patchRemainingFields(job: any) {
    const workModeIds = Array.isArray(job.work_mode)
      ? job.work_mode.map((m: string) => this.findIdByLabel(this.workMode, "work_mode", m)).filter(Boolean)
      : [];

    const workTypeIds = Array.isArray(job.employment_type)
      ? job.employment_type.map((t: string) => this.findIdByLabel(this.workType, "employment_type", t)).filter(Boolean)
      : [];

    const interviewFormatIds = Array.isArray(job.interview_format)
      ? job.interview_format.map((i: string) => this.findIdByLabel(this.interviewFormat, "interviewformat", i)).filter(Boolean)
      : [];

    const verifiedTalentValue = job.verified_talent === 1 || job.verified_talent === "1" ? "Yes" : "No";

    const exp = this.findIdByLabel(this.experienceLevel, "experienceLevel", job.experience_level);

    this.jobForm.patchValue({
      workMode: workModeIds,
      workType: workTypeIds,
      genderRequirement: Number(job.gender_requirement) || null,
      experienceLevel: exp,
      interviewFormat: interviewFormatIds,
      verifiedTalentRequirement: verifiedTalentValue,
    });

  }

  getMinEducationId(job: any): number | null {
    const minEdu = job.minimum_education;

    if (!minEdu || minEdu === '' || minEdu === 'null' || minEdu === null) {
      return null;
    }
    const numValue = Number(minEdu);
    if (!isNaN(numValue) && numValue > 0) {
      const eduExists = this.minimumEducation.find(e => e.id === numValue);
      if (eduExists) {
        return numValue;
      }
    }

    if (typeof minEdu === 'string') {
      const edu = this.minimumEducation.find(e =>
        e.minimum_education?.toLowerCase() === minEdu.toLowerCase()
      );
      if (edu) {
        return edu.id;
      }
    }

    return null;
  }

  enableEditMode() {
    this.isViewMode = false;
    this.jobForm.enable();
    this.editModeChanged.emit(false);
  }

  private findIdByLabel<T>(
    options: T[],
    labelKey: keyof T,
    labelValue: any,
    idKey: keyof T = "id" as keyof T
  ): any {
    return options.find((opt) => opt[labelKey] === labelValue)?.[idKey] ?? null;
  }

  private findIdByComLabel<T>(
    options: T[],
    labelKey: keyof T,
    labelValue: any,
    idKey: keyof T = "companyId" as keyof T
  ): any {
    return options.find((opt) => opt[labelKey] === labelValue)?.[idKey] ?? null;
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

  onChangeStartDate(event: any) {
    const receivedDate = new Date(event.target.value);
    const minDueDate = new Date();
    minDueDate.setDate(minDueDate.getDate() + 10);
    this.minEndDate = minDueDate.toISOString().split("T")[0];

    const currentDueDateControl = this.jobForm.get("jobApplicationDeadline");
    const currentDueDateValue = new Date(currentDueDateControl?.value);

    minDueDate.setHours(0, 0, 0, 0);
    currentDueDateValue.setHours(0, 0, 0, 0);

    if (!currentDueDateControl?.value || currentDueDateValue < minDueDate) {
      currentDueDateControl?.patchValue(this.minEndDate);
    }

    currentDueDateControl?.updateValueAndValidity();
  }

  onFocusInput(fieldKey: string) {
    this.targetInput.emit(fieldKey);
  }

  resetMessageBox() {
    this.targetInput.emit("default");
  }

  aiGenerate(mode: any, type: string) {
    const jobFormValue = this.jobForm.value;
    if (!this.positiontitleValue && !this.companyValue) {
      this.positiontitleValue = jobFormValue.jobTitle;
      this.companyValue = jobFormValue.company;
    }
    if (mode !== 'Rephrase') {
      const requiredJobFields = ['jobTitle', 'company'];
      let hasRequiredJobData = true;
      requiredJobFields.forEach(field => {
        if (!jobFormValue[field]) {
          this.jobForm.get(field)?.markAsTouched();
          hasRequiredJobData = false;
        }
      });

      if (!hasRequiredJobData) {
        this.jobForm.updateValueAndValidity();
        return;
      }
    }

    const AiGenerateData = {
      mode: mode,
      position_title: this.positiontitleValue,
      type: type,
      company_id: this.companyValue,
    };

    const rePharseData = {
      mode: mode,
      type: type,
      content: this.jobForm.value.jobOverview,
    };

    if (this.jobForm.value.jobTitle || type == "Rephrase") {
      this.isLoadingAiGenerateButton = true;
      this.jobsService
        .aiGenerate(type == "AI generate" ? AiGenerateData : rePharseData)
        .subscribe((response: any) => {
          this.isLoadingAiGenerateButton = false;
          if (mode == "joboverview") {
            this.jobForm.patchValue({
              jobOverview: this.cleanHtmlList(response.response),
            });
          } else if (mode == "keyresponsibilities") {
            this.jobForm.patchValue({
              keyResponsibilities: this.cleanHtmlList(response.response),
            });
          }
        });
    }
  }

  isNotEmptyHtml(value: string): boolean {
    const val = value || "";
    return !!(
      val &&
      val.trim() !== "" &&
      val !== "<p></p>" &&
      val !== "<p>&nbsp;</p>" &&
      val.replace(/<[^>]*>/g, "").trim() !== ""
    );
  }

  cleanHtmlList(html: string): string {
    html = html.replace(/<\/li>\s*<br\s*\/?>/gi, "</li>");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    wrapper.querySelectorAll("li").forEach((li) => {
      const isEmpty =
        !li.textContent?.trim() ||
        !li.innerHTML.replace(/<br\s*\/?>|&nbsp;/gi, "").trim();
      if (isEmpty) li.remove();
    });
    return wrapper.innerHTML;
  }

  confirmationPanel(event: any, inputElement: HTMLInputElement) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to add this custom title?",
      accept: () => {
        const title = inputElement.value.trim();
        if (!title || title.length < 4) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Please enter at least 4 characters for the custom title",
          });
          return;
        }
        const customTitle = {
          position_title: title,
        };
        this.jobsService.createPositionTitle(customTitle).subscribe({
          next: (response: any) => {
            const newPosition = {
              id: Number(response.data.id),
              position_title: response.data.title || title
            };

            this.positions = [...this.positions, newPosition];

            setTimeout(() => {
              const jobTitleControl = this.jobForm.get("jobTitle");
              const idValue = Number(response.data.id);
              jobTitleControl?.setValue(idValue);
              jobTitleControl?.markAsUntouched();
              jobTitleControl?.markAsPristine();
              jobTitleControl?.updateValueAndValidity();
            }, 100);

            inputElement.value = '';

            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: "Custom title added successfully",
            });
          },
          error: () => {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to add custom title",
            });
          },
        });
      },
      reject: () => {
        event.preventDefault();
      },
    });
  }

  onCoHireLogoSelected(event: any, fileInput: HTMLInputElement) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.customCoHireLogo = reader.result as string; // preview
    };

    reader.readAsDataURL(file);
    fileInput.value = '';
  }

  buildFormData(formValue: any): FormData {

    const formData = new FormData();

    const payload = this.buildJobPayload(formValue);

    Object.keys(payload).forEach(key => {

      const value = payload[key];

      if (value !== null && value !== undefined) {

        if (Array.isArray(value)) {

          value.forEach(item => {
            const valToAppend = typeof item === 'object'
              ? JSON.stringify(item)
              : item;

            formData.append(`${key}[]`, valToAppend);
          });

        }
        else if (typeof value === 'object') {

          formData.append(key, JSON.stringify(value));

        }
        else {

          formData.append(key, value);

        }

      }

    });

    if (this.selectedFile) {
      formData.append(
        'company_logo',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    return formData;
  }

  removeCoHireLogo() {
    this.customCoHireLogo = null;
    this.selectedFile = null;
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }


  inc() {
    const control = this.jobForm.get("availableVacancies");
    const current = Number(control?.value || 0);
    control?.setValue(current + 1);
  }

  dec() {
    const control = this.jobForm.get("availableVacancies");
    const current = Number(control?.value || 0);
    if (current > 0) {
      control?.setValue(current - 1);
    }
  }

  changePaidMode(event?: any) {
    if (this.jobForm.get("isPaid")?.value === true) {
      this.jobForm.patchValue({
        salaryOffered: null,
        currency: null,
      });
      this.jobForm.get("salaryOffered")?.disable();
      this.jobForm.get("currency")?.disable();
      this.jobForm.get("salaryOffered")?.clearValidators();
      this.jobForm.get("currency")?.clearValidators();
    } else {
      this.jobForm.get("salaryOffered")?.enable();
      this.jobForm.get("currency")?.enable();
      this.jobForm
        .get("salaryOffered")
        ?.setValidators([Validators.required, Validators.min(1)]);
      this.jobForm
        .get("currency")
        ?.setValidators([Validators.required]);
    }
  }

  //Sample and Preview
  today = new Date();
  companyData: any = { company_details: [] };
  formData: any = {};
  isPreviewVisible: boolean = false;
  isSampleVisible: boolean = false;
  hiringStatus = "Actively Hiring";
  previewData: any = {
    position_title: undefined,
    start_date: undefined,
    created_at: undefined,
    available_vacancies: undefined,
    total_applied: 0,
    intro_video: undefined,
    verified_talent: undefined,
    due_date: undefined,
    work_location: undefined,
    work_mode: [],
    employment_type: [],
    currency_code: undefined,
    salary_offer: undefined,
    experience_level: undefined,
    gender_: undefined,
    minimum_education: undefined,
    department: undefined,
    job_overview: undefined,
    key_responsibilities: undefined,
    language_proficiency: [],
    benefits_perks: [],
    soft_skills: [],
    hiring_stages: [],
    hiring_timeframe: undefined,
    interview_format: [],
    additional_notes: undefined,
    progress: 0,
  };
  sampleFormData: any = {
    position_title: "Process Executive",
    available_vacancies: 50,
    total_applied: 10,
    intro_video: "No",
    verified_talent: "No",
    start_date: "19-02-2025",
    due_date: "25-02-2025",
    work_location: "Bengaluru, Karnataka, India",
    work_mode: "Hybrid (Combination of on-site and remote work)",
    employment_type: "Full-Time Work",
    currency_code: "INR",
    salary_offer: "50,000",
    experience_level: "3",
    minimum_education: "Bachelor's Degree",
    gender_: 3,
    department: "Business Development",
    job_overview: "As a Process Executive at Infosys BPM...",
    key_responsibilities:
      "<ul><li>Deliver on day-to-day process targets...</li></ul>",
    language_proficiency: [
      ["English", "Native"],
      ["Hindi", "Fluent"],
    ],
    interview_format: [
      "Technical Round: Virtual interview focusing on technical skills",
      "HR Round: Virtual or in-person interview discussing behavioral aspects",
    ],
    additional_notes: "Must be flexible with shifts and work hours...",
    created_at: new Date(),
  };

  loadCompanyDataForPreview(): void {
    this.jobsService.getCompanies().subscribe((res) => {
      if (res?.data?.companies?.length > 0) {
        const selectedCompanyId = this.jobForm.get("company")?.value;
        const selectedCompany = res.data.companies.find(
          (c: any) => c.id === selectedCompanyId
        );

        if (selectedCompany) {
          this.companyData = {
            company_details: [
              {
                company_name: selectedCompany.company_name,
                company_logo:
                  selectedCompany.company_logo ||
                  "uniprep-assets/images/job.webp",
              },
            ],
          };
        }
      }
    });
  }

  showPreview(): void {
    if (this.jobForm.invalid) {
      this.toast.add({
        severity: "warn",
        summary: "Incomplete Form",
        detail: "Please fill all required fields before preview",
      });
      return;
    }

    const formValue = this.jobForm.value;

    const jobTitle = this.positions.find(
      (p) => p.id === formValue.jobTitle
    )?.position_title;
    const workLoc = this.workLocation.find(
      (w) => w.id === formValue.workLocation
    )?.work_location;
    const expLevel = this.experienceLevel.find(
      (e) => e.id === formValue.experienceLevel
    )?.experienceLevel;
    const minEdu = this.minimumEducation.find(
      (m) => m.id === formValue.minEducation
    )?.minimum_education;
    const workModes = Array.isArray(formValue.workMode)
      ? formValue.workMode
        .map(
          (id: number) => this.workMode.find((w) => w.id === id)?.work_mode
        )
        .filter(Boolean)
      : [];
    const workTypes = Array.isArray(formValue.workType)
      ? formValue.workType
        .map(
          (id: number) =>
            this.workType.find((w) => w.id === id)?.employment_type
        )
        .filter(Boolean)
      : [];
    const interviewFormats = Array.isArray(formValue.interviewFormat)
      ? formValue.interviewFormat
        .map(
          (id: number) =>
            this.interviewFormat.find((i) => i.id === id)?.interviewformat
        )
        .filter(Boolean)
      : [];
    const langProf = formValue.languageProficiency.map((lp: any) => [
      lp.language,
      lp.level,
    ]);
    const gender = formValue.genderRequirement;

    this.previewData = {
      position_title: jobTitle,
      start_date: formValue.jobStartDate,
      created_at: new Date(),
      available_vacancies: formValue.availableVacancies,
      total_applied: 0,
      intro_video: formValue.introductionVideo,
      verified_talent: formValue.verifiedTalent,
      due_date: formValue.jobApplicationDeadline,
      work_location: workLoc,
      work_mode: workModes,
      employment_type: workTypes,
      currency_code: formValue.currency,
      salary_offer: formValue.salaryOffered,
      experience_level: expLevel,
      gender: gender,
      minimum_education: minEdu,
      department: "",
      job_overview: formValue.jobOverview,
      key_responsibilities: formValue.keyResponsibilities,
      language_proficiency: langProf,
      benefits_perks: [],
      soft_skills: [],
      hiring_stages: [],
      hiring_timeframe: undefined,
      interview_format: interviewFormats,
      additional_notes: formValue.additionalNotes,
      progress: 0,
    };

    this.formData = { ...this.previewData };
    this.loadCompanyDataForPreview();
    this.isPreviewVisible = true;
  }

  openSample(): void {
    this.isSampleVisible = true;
  }

  getHiringStatus(date: any): string {
    const startDate = date;
    if (this.isMoreThanFourMonthsAhead(startDate)) {
      return (this.hiringStatus = "Future Hiring");
    } else {
      return (this.hiringStatus = "Actively Hiring");
    }
  }

  isMoreThanFourMonthsAhead(date: string | Date): boolean {
    if (!date) return false;
    const start = new Date(date);
    const today = new Date();
    const futureThreshold = new Date(today);
    futureThreshold.setMonth(today.getMonth() + 4);
    return start > futureThreshold;
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

  getworkModesString(workModes: any): string {
    if (!workModes || workModes.length === 0) return "";
    return workModes.map((item: any) => item).join(", ");
  }

  getEmploymentString(empData: any): string {
    if (!empData || empData.length === 0) return "";
    return empData.map((item: any) => item).join(", ");
  }

  getWordCountUsingControl(control: FormControl | any) {
    let wordCount = 0;
    if (control.value) {
      const words =
        control.value.replace(/<\/?[^>]+(>|$)/g, "").match(/\b\w+\b/g) || [];
      wordCount = words.length;
    }
    return wordCount;
  }

  checkMaximumWordsInFields(
    control: FormControl | any,
    maxNumber: number = 2000
  ): void {
    if (control?.value) {
      const words =
        control.value.replace(/<\/?[^>]+(>|$)/g, "").match(/\b\w+\b/g) || [];
      const wordCount = words.length;
      const wordLimitExceeded = wordCount > maxNumber;
      if (wordLimitExceeded) {
        control.setValue(control.value, { emitEvent: false });
        control.setErrors({ maxWordsExceeded: true });
      } else {
        if (control.hasError("maxWordsExceeded")) {
          const errors = { ...control.errors };
          delete errors["maxWordsExceeded"];
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  notEmptyHtmlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || "";

      // Check if the value is empty or contains only empty HTML tags
      if (
        !value ||
        value.trim() === "" ||
        value === "<p></p>" ||
        value === "<p>&nbsp;</p>" ||
        value.replace(/<[^>]*>/g, "").trim() === ""
      ) {
        return { emptyHtml: true };
      }

      return null;
    };
  }

  jobStartDateValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate minimum date (7 days from today)
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);
    minDate.setHours(0, 0, 0, 0);

    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < minDate) {
      return {
        minDate: {
          required: minDate,
          actual: selectedDate,
        },
      };
    }

    return null;
  };

  getJobCreditCount(companyId: any) {
    this.jobsService
      .getJobCreditCount({
        is_admin: true,
        job_id: this.jobId,
        company_id: companyId
      })
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.jobCreditCount = res.data.credit_count;
            this.showJobCreditModal = true;
            setTimeout(() => {
              this.showJobCreditModal = false;
              this.router.navigateByUrl('/jobs/view-jobs');
            }, 5000);
          } else {
            this.showJobCreditModal = false;
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message
            });
            this.router.navigateByUrl('/jobs/view-jobs');
          }
        },
        () => {
          this.showJobCreditModal = false;
          this.toast.add({
            severity: 'info',
            summary: 'Info',
            detail: 'First three jobs get free talent credits'
          });
          this.router.navigateByUrl('/jobs/view-jobs');
        }
      );
  }

  shareJob() {
    const url = `https://job.uniprep.ai/view/${this.jobuuid}`;
    window.open(url, '_blank');
  }
}

// Validators
export function dateAfterTodayValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (!control.value) return null;
    return selectedDate > today ? null : { dateNotAfterToday: true };
  };
}

export function dateNotBeforeTenDaysFromToday(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  const minValidDate = new Date(today);
  minValidDate.setDate(today.getDate() + 10);
  return selectedDate >= minValidDate ? null : { dateNotAfterTenDays: true };
}

export function dueDateAfterStartDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDateControl = group.get("jobStartDate");
    const dueDateControl = group.get("jobApplicationDeadline");
    if (!startDateControl || !dueDateControl) return null;
    const startDate = new Date(startDateControl.value);
    const dueDate = new Date(dueDateControl.value);
    if (!startDateControl.value || !dueDateControl.value) return null;
    startDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffInMs = startDate.getTime() - dueDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if (diffInDays < 10) {
      const existingErrors = dueDateControl.errors || {};
      dueDateControl.setErrors({ ...existingErrors, dueDateTooSoon: true });
    } else {
      if (dueDateControl.hasError("dueDateTooSoon")) {
        const errors = { ...dueDateControl.errors };
        delete errors["dueDateTooSoon"];
        dueDateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  };
}

export function uniqueLanguages(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;
  if (!formArray || !formArray.controls) return null;

  const languageMap = new Map<string, number[]>();

  formArray.controls.forEach((group, index) => {
    const value = group.get('language')?.value;
    if (value) {
      if (!languageMap.has(value)) {
        languageMap.set(value, []);
      }
      languageMap.get(value)!.push(index);
    }
  });

  let hasDuplicate = false;

  formArray.controls.forEach(group => {
    const langCtrl = group.get('language');
    if (langCtrl?.hasError('duplicateLanguage')) {
      const errors = { ...langCtrl.errors };
      delete errors['duplicateLanguage'];
      langCtrl.setErrors(Object.keys(errors).length ? errors : null, { emitEvent: false });
    }
  });

  languageMap.forEach(indices => {
    if (indices.length > 1) {
      hasDuplicate = true;
      indices.slice(1).forEach(i => {
        const langCtrl = formArray.controls[i].get('language');
        if (langCtrl) {
          const currentErrors = langCtrl.errors || {};
          langCtrl.setErrors(
            { ...currentErrors, duplicateLanguage: true },
            { emitEvent: false }
          );
        }
      });
    }
  });

  return hasDuplicate ? { duplicateLanguage: true } : null;
}

export function jobFairDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent;
    if (!group) return null;

    const start = group.get('job_fair_start_date')?.value;
    const end = control.value;

    if (!start || !end) return null;

    return new Date(end) >= new Date(start)
      ? null
      : { jobFairEndBeforeStart: true };
  };
}
