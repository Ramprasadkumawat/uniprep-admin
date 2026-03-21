import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { environment } from "@env/environment";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

import { HeaderService } from "../../../theme/components/header/header.service";
import { RecruitmentService } from "../recruitment.service";
import { WindowRefService } from "../window-ref.service";
import { SignaturePadComponent } from "./signature-pad.component";

interface ExperienceLevel {
  id: string;
  label: string;
}

@Component({
  selector: "uni-add-requirement",
  templateUrl: "./add-requirement.component.html",
  styleUrls: ["./add-requirement.component.scss"],
  standalone: false,
})
export class AddRequirementComponent implements OnInit {
  // ViewChild
  @ViewChild("signaturePad") signaturePad!: SignaturePadComponent;

  // Form Groups
  hiringSupportForm!: FormGroup;
  agreementForm!: FormGroup;

  // Form Data Arrays
  workLocation: any[] = [];
  visibleLocations: any[] = [];
  positions: any[] = [];
  visiblePositions: any[] = [];
  languages: any[] = [];
  languageProficiency: any[] = [];
  minimumEducation: any[] = [];
  currency: any[] = [];
  companiesList: any[] = [];

  // Dropdown Options
  requirementTypeOptions: any[] = [];
  workMode: any[] = [];
  employmentTypeOptions: any[] = [];
  readonly experienceLevelData: ExperienceLevel[] = [
    { id: "Fresher", label: "Fresher" },
    { id: "Intern", label: "Intern" },
    { id: "0-1 Year", label: "0-1 Year" },
    { id: "1-3 Years", label: "1-3 Years" },
    { id: "3-5 Years", label: "3-5 Years" },
    { id: "5-10 Years", label: "5-10 Years" },
    { id: "10+ Years", label: "10+ Years" },
    { id: "10-15 Years", label: "10-15 Years" },
    { id: "15+ Years", label: "15+ Years" },
    { id: "15-20 Years", label: "15-20 Years" },
    { id: "20+ Years", label: "20+ Years" },
  ];

  // Selected Values
  selectedJobLocations: any[][] = [];
  selectedWorkTypes: any[] = [];
  selectedWorkModes: any[] = [];
  selectedCurrency: string = "";
  selectedCompanyId: number | null = null;

  // State Management
  isLoadingAiGenerate: boolean = false;
  agreementDialogVisible: boolean = false;
  signatureMode: "digital" | "upload" = "upload";
  digitalSignatureData: string = "";
  uploadedSignature: any = null;
  companyLogo: string = "";
  paymentLink: string = "";
  paymentLinkDialogVisible: boolean = false;

  // User Data
  employerDetails: any;
  country: any;

  // Constants
  baseAmountPerRequirement: number = 2000.0;
  minDate: Date = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 7); // Add 7 days from today
    return date;
  })();

  // Lazy Loading Properties
  private readonly BATCH_SIZE = 200;
  private currentIndex = 0;
  private allDataLoaded = false;
  private currentPositionIndex = 0;
  private allPositionsLoaded = false;

  constructor(
    private getUserDetailsService: HeaderService,
    private recruitmentService: RecruitmentService,
    private winRef: WindowRefService,
    private fb: FormBuilder,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  // ==================== Lifecycle Hooks ====================

  ngOnInit() {
    this.getUserDetailsService.GetUserDetails().subscribe((res) => {
      this.employerDetails = res;
      this.country = res?.data?.country_id;
      this.hiringSupportDropdown();
      this.initializeAgreementForm(res?.data);
    });
    this.getDropdowns();
    this.getCompaniesList();
    this.initializeForm();
    this.loadCurrency();
  }

  // ==================== Form Initialization ====================

  initializeForm() {
    this.hiringSupportForm = this.fb.group({
      requirements: this.fb.array([this.createRequirementForm()]),
    });
    this.selectedJobLocations = [];
    this.selectedWorkTypes = [];
    this.selectedWorkModes = [];
  }

  createRequirementForm(): FormGroup {
    const form = this.fb.group({
      companyIdInput: [""], // Company ID input field
      companyId: ["", Validators.required],
      jobTitle: [null, Validators.required],
      vacancies: [null, Validators.required],
      talentRequirement: [
        null,
        [Validators.required, this.talentRequirementValidator],
      ],
      workType: [null, Validators.required],
      jobLocation: [[], Validators.required],
      workMode: [null, Validators.required],
      experienceLevel: [null, Validators.required],
      salaryCurrency: ["", Validators.required],
      salaryMin: [null, [Validators.required, this.salaryRangeValidator]],
      salaryMax: [null, [Validators.required, this.salaryRangeValidator]],
      jobStartDate: ["", [Validators.required, this.jobStartDateValidator]],
      languages: this.fb.array([this.createLanguageForm()]),
      minEducation: ["", Validators.required],
      rolesResponsibilities: [
        "",
        [Validators.required, this.htmlTextLengthValidator(2000)],
      ],
      notes: ["", this.htmlTextLengthValidator(2000)],
    });

    form.get("vacancies")?.valueChanges.subscribe((vacancies) => {
      if (vacancies && vacancies > 0) {
        const calculatedRequirement = vacancies * 3;
        const talentRequirementControl = form.get("talentRequirement");

        // Always update shortlist talents to vacancies * 3
        (talentRequirementControl as any)?.setValue(calculatedRequirement, {
          emitEvent: false,
        });
      } else if (vacancies === null || vacancies === 0) {
        // Reset to null if vacancies is cleared or set to 0
        const talentRequirementControl = form.get("talentRequirement");
        (talentRequirementControl as any)?.setValue(null, {
          emitEvent: false,
        });
      }
      form.get("talentRequirement")?.updateValueAndValidity();
    });

    // Add cross-field validation for salary range
    form.get("salaryMin")?.valueChanges.subscribe(() => {
      form.get("salaryMax")?.updateValueAndValidity({ emitEvent: false });
    });

    form.get("salaryMax")?.valueChanges.subscribe(() => {
      form.get("salaryMin")?.updateValueAndValidity({ emitEvent: false });
    });

    // Add debounced listener for Company ID input
    form
      .get("companyIdInput")
      ?.valueChanges.pipe(
        debounceTime(1000), // Wait 1 second after user stops typing
        distinctUntilChanged(),
        filter((value: string) => value && value.length === 7) // Only trigger when exactly 7 characters
      )
      .subscribe((companyId: string) => {
        if (companyId && companyId.length === 7) {
          this.fetchCompanyDetailsById(companyId, form);
        }
      });

    return form;
  }

  createLanguageForm(): FormGroup {
    const form = this.fb.group({
      language: [
        null,
        [Validators.required, this.duplicateLanguageValidator()],
      ],
      proficiency: [null],
    });

    // Add valueChanges listener to re-validate other language fields when this one changes
    form.get("language")?.valueChanges.subscribe(() => {
      const parentFormArray = form.parent as FormArray;
      if (parentFormArray) {
        const currentIndex = parentFormArray.controls.indexOf(form);
        parentFormArray.controls.forEach((control, index) => {
          if (index !== currentIndex) {
            (control as FormGroup)
              .get("language")
              ?.updateValueAndValidity({ emitEvent: false });
          }
        });
      }
    });

    return form;
  }

  duplicateLanguageValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const parentFormArray = control.parent?.parent as FormArray;
      if (!parentFormArray) {
        return null;
      }

      const currentLanguage = control.value;
      const currentIndex = parentFormArray.controls.findIndex(
        (ctrl) => (ctrl as FormGroup).get("language") === control
      );

      // Check if this language is already selected in other fields
      for (let i = 0; i < parentFormArray.length; i++) {
        if (i !== currentIndex) {
          const otherLanguage = (parentFormArray.at(i) as FormGroup).get(
            "language"
          )?.value;
          if (otherLanguage === currentLanguage) {
            return { duplicateLanguage: true };
          }
        }
      }

      return null;
    };
  }

  initializeAgreementForm(userData: any) {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;

    if (!this.agreementForm) {
      this.agreementForm = this.fb.group({
        companyName: [userData?.company_name || "", Validators.required],
        authorizedPerson: [userData?.name || "", Validators.required],
        email: [userData?.email || "", [Validators.required, Validators.email]],
        date: [formattedDate, Validators.required],
        signature: ["", this.signatureValidator.bind(this)],
        agreeToTerms: [false, Validators.requiredTrue],
      });
    } else {
      this.agreementForm.patchValue({
        companyName: userData?.company_name || "",
        authorizedPerson: userData?.name || "",
        email: userData?.email || "",
        date: formattedDate,
        signature: "",
        agreeToTerms: false,
      });
    }
  }

  // ==================== Form Validators ====================

  htmlTextLengthValidator =
    (maxLength: number) =>
      (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
          return null; // Let required validator handle empty values
        }
        const textLength = this.getTextLength(control.value);
        if (textLength > maxLength) {
          return {
            maxlength: { requiredLength: maxLength, actualLength: textLength },
          };
        }
        return null;
      };

  talentRequirementValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const talentRequirement = control.value;
    const parent = control.parent;

    if (!parent) {
      return null;
    }

    const vacancies = parent.get("vacancies")?.value;

    if (vacancies === null || vacancies === undefined || vacancies === 0) {
      return null;
    }

    const minTalentRequirement = vacancies * 3;

    if (talentRequirement < minTalentRequirement) {
      return {
        minTalentRequirement: {
          required: minTalentRequirement,
          actual: talentRequirement,
        },
      };
    }

    return null;
  };

  salaryRangeValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const salaryMin = parent.get("salaryMin")?.value;
    const salaryMax = parent.get("salaryMax")?.value;

    // If either field is empty, let required validator handle it
    if (
      salaryMin === null ||
      salaryMin === undefined ||
      salaryMax === null ||
      salaryMax === undefined
    ) {
      return null;
    }

    // Convert to numbers for comparison
    const min = Number(salaryMin);
    const max = Number(salaryMax);

    // Check if min is greater than or equal to max
    if (min >= max) {
      return {
        salaryRangeInvalid: {
          message: "Minimum salary must be less than maximum salary",
        },
      };
    }

    // Check if values are negative
    if (min < 0 || max < 0) {
      return {
        salaryRangeInvalid: {
          message: "Salary values cannot be negative",
        },
      };
    }

    return null;
  };

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

  signatureValidator(control: AbstractControl): ValidationErrors | null {
    if (this.signatureMode === "digital") {
      return this.digitalSignatureData ? null : { signatureRequired: true };
    } else {
      return control.value || this.uploadedSignature
        ? null
        : { signatureRequired: true };
    }
  }

  // ==================== Form Getters ====================

  get requirementsFormArray(): FormArray {
    return this.hiringSupportForm.get("requirements") as FormArray;
  }

  getRequirementForm(index: number): FormGroup {
    return this.requirementsFormArray.at(index) as FormGroup;
  }

  getLanguagesArray(index: number): FormArray {
    return this.getRequirementForm(index).get("languages") as FormArray;
  }

  getLanguageForm(requirementIndex: number, languageIndex: number): FormGroup {
    return this.getLanguagesArray(requirementIndex).at(
      languageIndex
    ) as FormGroup;
  }

  // ==================== Form Validation ====================

  isFormValid(): boolean {
    if (!this.hiringSupportForm || !this.hiringSupportForm.valid) {
      return false;
    }

    const requirementsArray = this.requirementsFormArray;
    if (!requirementsArray || requirementsArray.length === 0) {
      return false;
    }

    for (let i = 0; i < requirementsArray.length; i++) {
      const requirementForm = this.getRequirementForm(i);
      if (!requirementForm || !requirementForm.valid) {
        return false;
      }

      const languagesArray = this.getLanguagesArray(i);
      if (!languagesArray || languagesArray.length === 0) {
        return false;
      }

      for (let j = 0; j < languagesArray.length; j++) {
        const languageForm = this.getLanguageForm(i, j);
        if (!languageForm || !languageForm.valid) {
          return false;
        }
      }
    }

    return true;
  }

  // ==================== Data Loading ====================

  getDropdowns() {
    this.recruitmentService.getWorkLocationDropdownData().subscribe((res) => {
      this.workLocation = [...res.worklocations];
      this.initializeLazyLocations();
    });

    // this.recruitmentService.getPositionTitleData({}).subscribe((res) => {
    //   this.positions = res;
    // });

    this.recruitmentService.getDropdownData().subscribe((res) => {
      this.languages = res.language;
      this.minimumEducation = res.minimumeducation;
      this.currency = res.currencycode;
      this.positions = res.positions || [];
      this.initializeLazyPositions();
      this.initializeLanguageProficiency(res.proficiencylevel);
    });
  }

  private initializeLanguageProficiency(proficiencyLevel: any[]) {
    if (proficiencyLevel && proficiencyLevel.length > 0) {
      this.languageProficiency = proficiencyLevel.map((level: any) => {
        if (typeof level === "string") {
          return { label: level, value: level };
        }
        return {
          label: level.label || level.proficiencylevel || level,
          value: level.label || level.proficiencylevel || level.id || level,
        };
      });
    } else {
      this.languageProficiency = [
        { label: "Basic", value: "Basic" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
        { label: "Native", value: "Native" },
      ];
    }
  }

  hiringSupportDropdown() {
    this.recruitmentService
      .hiringSupportDropdown(this.country)
      .subscribe((d) => {
        this.requirementTypeOptions = d.data.requirementTypeOptions;
        this.workMode = d.data.workMode;
        this.employmentTypeOptions = d.data.employmentTypeOptions;
      });
  }

  getCompaniesList() {
    this.recruitmentService.getCompaniesList().subscribe({
      next: (companies: any) => {
        this.companiesList = companies.data || [];
      },
      error: (err) => {
        console.error("Error fetching companies:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load companies list",
        });
      },
    });
  }

  fetchCompanyDetailsById(companyId: string, form: FormGroup) {
    this.recruitmentService.getCompanyDetailsById(companyId).subscribe({
      next: (response: any) => {
        // Check if response status is false (company not found)
        if (response.status === false) {
          const errorMessage = response.message || "Company not found";
          this.toast.add({
            severity: "error",
            summary: "Company Not Found",
            detail: errorMessage,
          });
          return;
        }

        if (response.status && response.data && response.data.company) {
          const company = response.data.company;
          const companyName = company.company_name;
          // Use id (number) as company_id for the dropdown, fallback to company_id if id doesn't exist
          const companyIdValue = company.id || company.company_id;

          // Find the company in companiesList or add it
          let foundCompany = this.companiesList.find(
            (c: any) =>
              c.company_id === companyIdValue || c.id === companyIdValue
          );

          if (!foundCompany) {
            // Add company to list if not found
            foundCompany = {
              company_id: companyIdValue,
              company_name: companyName,
              company_logo_url: company.company_logo || "",
            };
            this.companiesList.push(foundCompany);
          }

          // Set the company ID in the dropdown (this will trigger onCompanyChange)
          form.get("companyId")?.setValue(companyIdValue, { emitEvent: true });

          // Get the requirement index from the form
          const requirementIndex =
            this.requirementsFormArray.controls.indexOf(form);
          if (requirementIndex >= 0) {
            this.onCompanyChange(companyIdValue, requirementIndex);
          }

          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: `Company "${companyName}" loaded successfully`,
          });
        }
      },
      error: (err) => {
        console.error("Error fetching company details:", err);

        // Handle 404 error with custom message
        if (err?.status === 404) {
          const errorMessage = err?.error?.message || "Company not found";
          this.toast.add({
            severity: "error",
            summary: "Company Not Found",
            detail: errorMessage,
          });
        } else {
          // Handle other errors
          const errorMessage =
            err?.error?.message ||
            "Failed to fetch company details. Please check the Company ID.";
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
          });
        }
      },
    });
  }

  private loadCurrency() {
    this.recruitmentService.getCurrencyAndSymbol().subscribe((res: any) => {
      if (res?.data?.currency_code) {
        this.selectedCurrency = res.data.currency_code;
        if (this.requirementsFormArray.length > 0) {
          this.getRequirementForm(0).patchValue({
            salaryCurrency: res.data.currency_code,
          });
        }
      }
    });
  }

  // ==================== Language Management ====================

  addLanguage(requirementIndex: number) {
    const languagesArray = this.getLanguagesArray(requirementIndex);
    languagesArray.push(this.createLanguageForm());
  }

  getAvailableLanguages(
    requirementIndex: number,
    languageIndex: number
  ): any[] {
    const languagesArray = this.getLanguagesArray(requirementIndex);
    const selectedLanguages: string[] = [];

    // Collect all selected languages except the current one
    languagesArray.controls.forEach((control, index) => {
      if (index !== languageIndex) {
        const selectedLang = control.get("language")?.value;
        if (selectedLang) {
          selectedLanguages.push(selectedLang);
        }
      }
    });

    // Filter out already selected languages
    return this.languages.filter(
      (lang) => !selectedLanguages.includes(lang.language)
    );
  }

  removeLanguage(requirementIndex: number, languageIndex: number) {
    const languagesArray = this.getLanguagesArray(requirementIndex);
    if (languagesArray.length > 1) {
      languagesArray.removeAt(languageIndex);
      // Re-validate remaining language fields after removal
      languagesArray.controls.forEach((control) => {
        control.get("language")?.updateValueAndValidity();
      });
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "At least one language is required",
      });
    }
  }

  // ==================== Requirement Management ====================

  addAnotherRequirement() {
    this.requirementsFormArray.push(this.createRequirementForm());
    this.selectedJobLocations.push([]);
    this.selectedWorkTypes.push(null);
    this.selectedWorkModes.push(null);

    if (this.selectedCurrency) {
      const newIndex = this.requirementsFormArray.length - 1;
      this.getRequirementForm(newIndex).patchValue({
        salaryCurrency: this.selectedCurrency,
      });
    }
  }

  removeRequirement(index: number) {
    if (this.requirementsFormArray.length > 1) {
      this.requirementsFormArray.removeAt(index);
      this.selectedJobLocations.splice(index, 1);
      this.selectedWorkTypes.splice(index, 1);
      this.selectedWorkModes.splice(index, 1);
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "At least one requirement is required",
      });
    }
  }

  // ==================== Event Handlers ====================

  onCompanyChange(companyId: number, requirementIndex: number) {
    if (companyId && this.companiesList && this.companiesList.length > 0) {
      const selectedCompany = this.companiesList.find(
        (company: any) => company.company_id === companyId
      );

      if (selectedCompany) {
        this.companyLogo = selectedCompany.company_logo_url || "";

        // Set Company ID field with the selected company's companyId
        const requirementForm = this.getRequirementForm(requirementIndex);
        if (requirementForm && selectedCompany.companyId) {
          requirementForm
            .get("companyIdInput")
            ?.setValue(selectedCompany.companyId, {
              emitEvent: false, // Prevent triggering the API call
            });
        }

        if (this.agreementForm) {
          this.agreementForm.patchValue({
            companyName: selectedCompany.company_name || "",
            authorizedPerson: selectedCompany.employer_name || "",
            email:
              selectedCompany.email || this.employerDetails?.data?.email || "",
          });
        }
      }
    }
  }

  onJobLocationChange(event: any, index: number) {
    const selectedValues = event.value || [];
    if (selectedValues.length > 0) {
      const locationObjs = selectedValues
        .map((id: any) => {
          return this.workLocation.find((loc: any) => loc.id === id);
        })
        .filter(Boolean);
      this.selectedJobLocations[index] = locationObjs;
    } else {
      this.selectedJobLocations[index] = [];
    }
  }

  onWorkTypeChange(event: any, index: number) {
    const selectedValue = event.value;
    if (selectedValue) {
      const typeObj = this.employmentTypeOptions.find(
        (type: any) =>
          type.label === selectedValue || type.value === selectedValue
      );
      this.selectedWorkTypes[index] = typeObj || selectedValue;
    } else {
      this.selectedWorkTypes[index] = null;
    }
  }

  onWorkModeChange(event: any, index: number) {
    const selectedValue = event.value;
    if (selectedValue) {
      const modeObj = this.workMode.find(
        (mode: any) =>
          mode.label === selectedValue || mode.value === selectedValue
      );
      this.selectedWorkModes[index] = modeObj || null;
    } else {
      this.selectedWorkModes[index] = null;
    }
  }

  // ==================== AI Generation ====================

  aiGenerate(
    field: "roles" | "notes",
    type: "generate" | "rephrase" | "AI generate",
    index: number
  ) {
    const requirementForm = this.getRequirementForm(index);
    const fieldName = field === "roles" ? "rolesResponsibilities" : "notes";
    const jobTitle = requirementForm.get("jobTitle")?.value;
    const currentValue = requirementForm.get(fieldName)?.value;

    if (type === "AI generate" && !jobTitle) {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter Job Title first",
      });
      return;
    }

    this.isLoadingAiGenerate = true;
    const fieldType = field === "roles" ? "keyresponsibilities" : "notes";

    const aiData =
      type === "generate"
        ? {
          mode: "keyresponsibilities",
          position_title: jobTitle,
          type: "AI generate",
        }
        : { mode: fieldType, type: "rephrase", content: currentValue };

    const apiEndpoint =
      field === "roles" && type === "generate"
        ? "job-ai-generate"
        : "job-ai-generate";
    this.recruitmentService.aiGenerateApi(aiData, apiEndpoint).subscribe({
      next: (response: any) => {
        this.isLoadingAiGenerate = false;
        const cleanText = this.cleanHtmlList(response.response || response);
        requirementForm.patchValue({ [fieldName]: cleanText });
      },
      error: (err) => {
        this.isLoadingAiGenerate = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to generate content",
        });
      },
    });
  }

  // ==================== Signature Management ====================

  onSignatureUpload(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.uploadedSignature = file;
      this.agreementForm.patchValue({ signature: file.name });
      this.agreementForm.get("signature")?.updateValueAndValidity();
      event.target.value = "";
    }
  }

  removeSignature() {
    this.uploadedSignature = null;
    this.agreementForm.patchValue({ signature: "" });
    this.agreementForm.get("signature")?.updateValueAndValidity();
  }

  onSignatureModeChange() {
    if (this.signatureMode === "digital") {
      this.uploadedSignature = null;
      this.agreementForm.patchValue({ signature: "" });
    } else {
      this.digitalSignatureData = "";
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    }
    this.agreementForm.get("signature")?.updateValueAndValidity();
  }

  onSignaturePadChange(dataUrl: string | null) {
    this.digitalSignatureData = dataUrl || "";
    if (dataUrl) {
      this.agreementForm.patchValue({ signature: "digital_signature.png" });
    } else {
      this.agreementForm.patchValue({ signature: "" });
    }
    this.agreementForm.get("signature")?.updateValueAndValidity();
  }

  clearSignaturePad() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  isSignaturePadEmpty(): boolean {
    return this.signaturePad ? this.signaturePad.isEmpty() : true;
  }

  // ==================== Form Submission ====================

  submitHiringSupport() {
    if (!this.isFormValid()) {
      this.hiringSupportForm.markAllAsTouched();
      this.requirementsFormArray.controls.forEach((requirementControl) => {
        const requirementForm = requirementControl as FormGroup;
        requirementForm.markAllAsTouched();
        const languagesArray = requirementForm.get("languages") as FormArray;
        if (languagesArray) {
          languagesArray.controls.forEach((languageControl) => {
            (languageControl as FormGroup).markAllAsTouched();
          });
        }
      });
      this.toast.add({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please fill all required fields before submitting.",
      });
      return;
    }

    // Call API directly without showing agreement dialog
    this.submitRequirements();
  }

  submitAgreement() {
    if (
      this.signatureMode === "digital" &&
      this.signaturePad &&
      !this.signaturePad.isEmpty()
    ) {
      this.digitalSignatureData = this.signaturePad.toDataURL();
      this.agreementForm.patchValue({ signature: "digital_signature.png" });
      this.agreementForm.get("signature")?.updateValueAndValidity();
    }

    if (this.agreementForm.invalid) {
      this.agreementForm.markAllAsTouched();
      return;
    }

    this.agreementDialogVisible = false;
    this.submitRequirements();
  }

  submitRequirements() {
    const requirements = this.requirementsFormArray.value;
    const transformedRequirements = requirements.map((formValue: any) => {
      // Get work locations as array (multi-select)
      const workLocations = Array.isArray(formValue.jobLocation)
        ? formValue.jobLocation.map((locationId: any) => {
          const locationObj = this.workLocation.find(
            (loc: any) => loc.id === locationId
          );
          return locationObj?.work_location || locationId;
        })
        : [];

      // Get single work type value
      let workType = "";
      if (formValue.workType) {
        const typeObj = this.employmentTypeOptions.find(
          (type: any) =>
            type.label === formValue.workType ||
            type.value === formValue.workType
        );
        workType = typeObj?.label || formValue.workType;
      }

      // Get work mode value (single select)
      let workMode = "";
      if (formValue.workMode) {
        const modeObj = this.workMode.find(
          (mode: any) =>
            mode.label === formValue.workMode ||
            mode.value === formValue.workMode
        );
        workMode = modeObj?.label || formValue.workMode;
      }

      let experience = "";
      if (formValue.experienceLevel) {
        const expLevel = this.experienceLevelData.find(
          (exp: any) =>
            exp.id === formValue.experienceLevel ||
            exp.label === formValue.experienceLevel
        );
        experience = expLevel?.label || formValue.experienceLevel;
      }

      let minimumEducation = "";
      if (formValue.minEducation) {
        const minEdu = this.minimumEducation.find(
          (edu: any) => edu.id === formValue.minEducation
        );
        minimumEducation = minEdu?.minimum_education || formValue.minEducation;
      }

      const languages =
        formValue.languages
          ?.filter((lang: any) => lang.language && lang.proficiency)
          .map((lang: any) => {
            const langObj = this.languages.find(
              (l: any) => l.language === lang.language || l.id === lang.language
            );
            const languageName = langObj?.language || lang.language;
            return [languageName, lang.proficiency];
          }) || [];

      const amountPerRequirement =
        this.baseAmountPerRequirement * formValue.talentRequirement;

      let startDate = "";
      if (formValue.jobStartDate) {
        startDate = this.formatDate(formValue.jobStartDate);
      }

      // Get company name from company ID
      let companyName = "";
      if (formValue.companyId) {
        const selectedCompany = this.companiesList.find(
          (company: any) => company.company_id === formValue.companyId
        );
        companyName = selectedCompany?.company_name || "";
      }

      return {
        company_id: formValue.companyId || null,
        company_name: companyName,
        jobTitle: formValue.jobTitle,
        vacancies: formValue.vacancies,
        total_requirements: formValue.talentRequirement,
        work_type: workType,
        work_locations: workLocations,
        work_mode: workMode,
        experience: experience,
        currency: formValue.salaryCurrency || this.selectedCurrency,
        min_salary: formValue.salaryMin,
        max_salary: formValue.salaryMax,
        startDate: startDate,
        minimum_education: minimumEducation,
        languages: languages,
        roles_responsibilities: formValue.rolesResponsibilities || "",
        notes: formValue.notes || "",
        amount: amountPerRequirement,
      };
    });

    const totalAmount = transformedRequirements.reduce(
      (sum: number, req: any) => sum + req.amount,
      0
    );

    // Validate total amount not exceeding 1 lakh (100,000)
    const maxAmount = 100000;
    if (totalAmount > maxAmount) {
      this.toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: `Total amount cannot exceed ₹1,00,000 (1 lakh). Current total: ₹${totalAmount.toLocaleString(
          "en-IN"
        )}`,
      });
      return;
    }

    const payload = {
      currency: "INR",
      totalAmount: totalAmount,
      requirements: transformedRequirements,
    };

    this.recruitmentService.placeOrder(payload).subscribe({
      next: (res) => {
        // Show success message from API response
        const message = res?.message || "Order data saved. Proceed to payment.";
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: message,
        });

        // Show payment link dialog if payment link is available
        if (res?.data?.payment_link) {
          this.paymentLink = res.data.payment_link;
          this.paymentLinkDialogVisible = true;
          // Copy to clipboard
          navigator.clipboard.writeText(res.data.payment_link).then(() => {
            this.toast.add({
              severity: "info",
              summary: "Payment Link Copied",
              detail: "Payment link has been copied to your clipboard.",
            });
          });
        }

        // Navigate to view-order after 3 seconds
        setTimeout(() => {
          this.router.navigate(["/requirement/view-order"]);
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: err?.error?.message || "Failed to place order",
        });
      },
    });
  }

  // ==================== Payment Integration ====================

  payWithRazorpay(orderId: string, amount: number) {
    let razorKey = "rzp_live_YErYQVqDIrZn1D";
    if (environment.domain == "api.uniprep.ai") {
      razorKey = "rzp_test_Bq7pCLvPOLDbgp";
    }
    let phone =
      this.employerDetails?.data?.phone || this.employerDetails?.phone;
    const options: any = {
      key: razorKey,
      amount: amount * 100,
      currency: this.selectedCurrency,
      name: "UNIPREP",
      description: "Hiring Support",
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
      order_id: orderId,
      prefill: {
        name:
          this.employerDetails?.data?.name || this.employerDetails?.name || "",
        email:
          this.employerDetails?.data?.email ||
          this.employerDetails?.email ||
          "",
        contact: phone === null || phone === "" ? "9876543210" : phone,
      },
      notes: {
        address:
          "165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023",
      },
      modal: {
        escape: false,
      },
      theme: {
        color: "var(--p-primary-500)",
      },
    };

    options.handler = (response: any, error: any) => {
      if (error) {
        this.toast.add({
          severity: "error",
          summary: "Payment Error",
          detail: error.description || "Payment failed",
        });
        return;
      }

      const paymentData = {
        order_id: orderId,
        payment_id: response?.razorpay_payment_id,
      };

      this.recruitmentService.completePayment(paymentData).subscribe({
        next: (data: any) => {
          this.initializeForm();
          this.selectedJobLocations = [];
          this.selectedWorkTypes = [];
          this.selectedWorkModes = [];
          this.agreementDialogVisible = false;
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail:
              data?.message ||
              "Payment completed successfully. You will receive invoice in mail",
          });
        },
        error: (err: any) => {
          console.error(err);
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: err?.error?.message || "Payment verification failed",
          });
        },
      });
    };

    options.modal.ondismiss = () => {
      this.toast.add({
        severity: "warn",
        summary: "Payment Cancelled",
        detail: "Transaction was cancelled",
      });
    };

    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  // ==================== Utility Methods ====================

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getTotalAmount(): number {
    if (!this.hiringSupportForm || !this.requirementsFormArray) {
      return 0;
    }
    let total = 0;
    this.requirementsFormArray.controls.forEach((control) => {
      const formGroup = control as FormGroup;
      const talentRequirement = formGroup.get("talentRequirement")?.value || 0;
      total += this.baseAmountPerRequirement * talentRequirement;
    });
    return total;
  }

  isTotalAmountExceeded(): boolean {
    return this.getTotalAmount() >= 100000;
  }

  getTotalAmountFormatted(): string {
    return this.getTotalAmount().toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getTextLength(html: string): number {
    if (!html) return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim().length || 0;
  }

  isNotEmptyHtml(value: string): boolean {
    if (!value) return false;
    const div = document.createElement("div");
    div.innerHTML = value;
    return (div.textContent?.trim()?.length ?? 0) > 0;
  }

  cleanHtmlList(html: string): string {
    if (!html) return "";
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

  private formatDate(date: Date): string {
    return date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`
      : "";
  }

  // LOCATIONS
  private locationScrollTimeout: any;
  private positionScrollTimeout: any;
  private initializeLazyLocations() {
    this.currentIndex = 0;
    this.allDataLoaded = false;
    this.visibleLocations = this.workLocation.slice(0, this.BATCH_SIZE);
    this.currentIndex = this.BATCH_SIZE;
    this.allDataLoaded = this.currentIndex >= this.workLocation.length;
  }

  loadLocationsLazy(event: any) {
    if (this.locationScrollTimeout) {
      clearTimeout(this.locationScrollTimeout);
    }

    this.locationScrollTimeout = setTimeout(() => {
      if (!this.allDataLoaded && this.currentIndex < this.workLocation.length) {
        this.loadNextBatch();
      }
    }, 100);
  }

  private loadNextBatch() {
    if (this.currentIndex >= this.workLocation.length) {
      this.allDataLoaded = true;
      return;
    }

    const endIndex = Math.min(
      this.currentIndex + this.BATCH_SIZE,
      this.workLocation.length
    );

    const nextBatch = this.workLocation.slice(this.currentIndex, endIndex);
    this.visibleLocations.push(...nextBatch);
    this.currentIndex = endIndex;
    this.allDataLoaded = this.currentIndex >= this.workLocation.length;
  }

  // POSITIONS
  private initializeLazyPositions() {
    this.currentPositionIndex = 0;
    this.allPositionsLoaded = false;
    this.visiblePositions = this.positions.slice(0, this.BATCH_SIZE);
    this.currentPositionIndex = this.BATCH_SIZE;
    this.allPositionsLoaded = this.currentPositionIndex >= this.positions.length;
  }

  loadPositionsLazy(event: any) {
    const threshold = this.visiblePositions.length - 10;

    if (event.last >= threshold && !this.allPositionsLoaded) {
      this.loadNextPositionBatch();
    }
  }

  onPositionFilter(event: any) {
    if (event.filter && !this.allPositionsLoaded) {
      this.loadAllRemainingPositions();
    }
  }

  private loadAllRemainingPositions() {
    if (this.allPositionsLoaded) return;
    this.visiblePositions = [...this.positions];
    this.currentPositionIndex = this.positions.length;
    this.allPositionsLoaded = true;
  }

  private loadNextPositionBatch() {
    if (this.currentPositionIndex >= this.positions.length) {
      this.allPositionsLoaded = true;
      return;
    }

    const endIndex = Math.min(
      this.currentPositionIndex + this.BATCH_SIZE,
      this.positions.length
    );

    const nextBatch = this.positions.slice(this.currentPositionIndex, endIndex);
    this.visiblePositions.push(...nextBatch);
    this.currentPositionIndex = endIndex;
    this.allPositionsLoaded = this.currentPositionIndex >= this.positions.length;
  }

  // ==================== Custom Job Title ====================

  confirmationPanel(event: any, index: number): void {
    const buttonElement = event.target.closest("button");
    const inputGroup = buttonElement?.parentElement;
    const inputElement = inputGroup?.querySelector("input") as HTMLInputElement;
    const title = inputElement?.value?.trim() || "";

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to add this custom title?",
      accept: () => {
        if (!title || title.length < 4) {
          this.showErrorToast(
            "Please enter at least 4 characters for the custom title"
          );
          return;
        }
        const customTitle = {
          position_title: title,
        };
        this.recruitmentService.createPositionTitle(customTitle).subscribe({
          next: (response: any) => {
            // Handle different response structures
            let positionData: any = null;

            if (response.status && response.data) {
              // Response with status wrapper: { status: true, data: { id: 22621, title: "..." } }
              positionData = response.data;
            } else if (response.id && response.title) {
              // Direct response: { id: 22621, title: "..." }
              positionData = response;
            } else if (
              response.data &&
              response.data.id &&
              response.data.title
            ) {
              // Response with data wrapper: { data: { id: 22621, title: "..." } }
              positionData = response.data;
            }

            if (positionData && positionData.id && positionData.title) {
              const newPosition = {
                id: positionData.id,
                position_title: positionData.title,
              };

              // Check if position already exists (avoid duplicates)
              const exists = this.positions.some(
                (pos: any) =>
                  pos.id === positionData.id ||
                  pos.position_title?.toLowerCase() ===
                  positionData.title.toLowerCase()
              );

              if (!exists) {
                // Add the new position to the positions array
                this.positions.push(newPosition);

                // Sort positions alphabetically by title
                this.positions.sort((a: any, b: any) =>
                  (a.position_title || "").localeCompare(b.position_title || "")
                );

                // Reinitialize lazy positions to include the new one
                this.initializeLazyPositions();
              }

              const inVisible = this.visiblePositions.some(
                (p: any) => p.position_title === positionData.title
              );
              if (!inVisible) {
                this.visiblePositions.push(newPosition);
              }

              // Clear the input field
              if (inputElement) {
                inputElement.value = "";
              }

              setTimeout(() => {
                const currentRequirement = this.getRequirementForm(index);
                currentRequirement.get("jobTitle")?.setValue(positionData.title);
              }, 150);

              this.showSuccessToast(
                `"${positionData.title}" added as custom job title`
              );
            } else {
              this.showErrorToast(
                "Failed to add custom title: Invalid response"
              );
            }
          },
          error: (error: any) => {
            this.showErrorToast(
              error?.error?.message || "Failed to add custom title"
            );
          },
        });
      },
      reject: () => {
        event.preventDefault();
      },
    });
  }

  focusInput(inputElement: HTMLInputElement): void {
    if (inputElement) {
      inputElement.focus();
    }
  }

  private showErrorToast(message: string): void {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }

  private showSuccessToast(summary: string, detail: string = summary): void {
    this.toast.add({
      severity: "success",
      summary,
      detail,
    });
  }

  // ==================== External Links ====================

  openGuideLines() {
    const guideLink = "https://shorturl.at/EPa6A";
    this.winRef.nativeWindow.open(guideLink, "_blank");
  }

  openHiringOutput() {
    const youtubeUrl = "https://www.youtube.com/watch?v=SSdg2f7ZOfo";

    this.winRef.nativeWindow.open(youtubeUrl, "_blank");

    this.toast.add({
      severity: "success",
      summary: "Opening Video",
      detail: "How to use video is opening in a new tab",
    });
  }

  copyPaymentLink() {
    if (this.paymentLink) {
      navigator.clipboard.writeText(this.paymentLink).then(() => {
        this.toast.add({
          severity: "success",
          summary: "Copied",
          detail: "Payment link copied to clipboard.",
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.locationScrollTimeout) {
      clearTimeout(this.locationScrollTimeout);
    }
    if (this.positionScrollTimeout) {
      clearTimeout(this.positionScrollTimeout);
    }
  }
}
