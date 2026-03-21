import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { RecruitmentService } from "../recruitment.service";
import { HttpClient } from "@angular/common/http";
import { SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: "uni-delivered-talents-list",
  templateUrl: "./delivered-talents-list.component.html",
  styleUrls: ["./delivered-talents-list.component.scss"],
  standalone: false,
})
export class DeliveredTalentsListComponent implements OnInit {
  filterForm!: FormGroup;
  talents: any[] = [];
  loading: boolean = false;
  filterExpanded: boolean = false;
  viewDialogVisible: boolean = false;
  selectedTalent: any = null;
  isEditMode: boolean = false;
  editTalentForm!: FormGroup;

  // Summary counts
  totalTalents: number = 0;
  shortlistedTalents: number = 0;
  rejectedTalents: number = 0;
  deliveredTalents: number = 0;
  validationCount: number = 0;
  activeTab: string = "all"; // 'all', 'shortlisted', 'rejected', 'delivered'

  // Dropdown options
  companiesList: any[] = [];
  positions: any[] = [];
  experienceYears: any[] = [
    { label: "0-1 Year", value: "0-1" },
    { label: "1-3 Years", value: "1-3" },
    { label: "3-5 Years", value: "3-5" },
    { label: "5-10 Years", value: "5-10" },
    { label: "10+ Years", value: "10+" },
  ];
  statusOptions: any[] = [
    { label: "Shortlisted", value: 1 },
    { label: "Rejected", value: 0 },
  ];
  workMode: any[] = [];
  workType: any[] = [];
  currency: any[] = [];
  workLocations: any[] = [];
  languages: any[] = [];
  languageProficiency: any[] = [];
  noticePeriodOptions: any[] = [
    { label: "Immediate", value: 0 },
    { label: "1 Week", value: 7 },
    { label: "2 Weeks", value: 14 },
    { label: "1 Month", value: 30 },
    { label: "2 Months", value: 60 },
    { label: "3 Months", value: 90 },
  ];
  validationStatusOptions: any[] = [
    { label: "Yet to Action", value: "Yet to Action" },
    { label: "Valid", value: "Valid" },
    { label: "Not Valid", value: "Not Valid" },
  ];
  preferredCountry: any;
  SearchCountryField = SearchCountryField;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: MessageService,
    private recruitmentService: RecruitmentService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.initializeFilterForm();
    this.loadDropdownData();
    this.loadTalents();
    this.http.get("https://ipapi.co/json/").subscribe((data: any) => {
      this.preferredCountry = data.country_code.toLocaleLowerCase();
    });
  }

  initializeFilterForm() {
    this.filterForm = this.fb.group({
      order_id: [""],
      company_name: [""],
      company_id: [""],
      talent_id: [""],
      candidate_name: [""],
      email: [""],
      phone: [""],
      phone_country_code: [""],
      position: [null],
      years_of_experience: [[]],
      expected_salary: [""],
      expected_salary_currency: ["INR"],
      status: [""],
      validation_status: [""],
    });
  }

  loadDropdownData() {
    // Load companies - PrimeNG virtual scroll will handle lazy rendering
    this.recruitmentService.getCompaniesList().subscribe({
      next: (res: any) => {
        this.companiesList = res.data || [];
      },
    });

    // Load positions, languages, and currency
    this.recruitmentService.getDropdownData().subscribe({
      next: (res: any) => {
        this.positions = res.positions || [];
        this.currency = res.currencycode || [];
        this.languages = res.language || [];
        this.languageProficiency = res.languageProficiency || [];
      },
    });

    // Load work locations
    this.recruitmentService.getWorkLocationDropdownData().subscribe({
      next: (res: any) => {
        this.workLocations = res.worklocations || [];
      },
    });

    // Load work mode and work type
    this.recruitmentService.hiringSupportDropdown(null).subscribe({
      next: (res: any) => {
        this.workMode = res.data?.workMode || [];
        this.workType = res.data?.employmentTypeOptions || [];
      },
    });
  }

  currentSortFieldTalents: string | null = null;
  currentSortOrderTalents: number = 1;
  currentFirstTalents: number = 0;
  pageSize: number = 25;
  currentPage: number = 1;
  totalRecords: number = 0;

  @ViewChild('dtTalents') tableTalents: any;

  loadTalents(filters: any = {}) {
    this.loading = true;

    // Create a clean filter object
    const cleanFilters: any = {};

    // Copy all filters except status
    Object.keys(filters).forEach((key) => {
      if (key !== "status") {
        if (
          filters[key] !== null &&
          filters[key] !== "" &&
          filters[key] !== undefined
        ) {
          cleanFilters[key] = filters[key];
        }
      }
    });

    // Handle status separately - include it even if it's 0 (rejected)
    // Use hasOwnProperty to check if status exists, because 0 is falsy but valid
    if (filters.hasOwnProperty("status")) {
      const statusValue = filters.status;
      // Explicitly check for 0 first (rejected status)
      if (statusValue === 0 || statusValue === "0") {
        cleanFilters.status = 0;
      }
      // Then check for other valid status values (1 for shortlisted)
      else if (statusValue === 1 || statusValue === "1") {
        cleanFilters.status = 1;
      }
      // Exclude if it's null, undefined, or empty string
      else if (
        statusValue !== null &&
        statusValue !== "" &&
        statusValue !== undefined
      ) {
        cleanFilters.status = Number(statusValue);
      }
    }

    if (this.currentPage && this.pageSize) {
      cleanFilters.page = this.currentPage;
      cleanFilters.perpage = this.pageSize;
    }

    console.log("Loading talents with filters:", cleanFilters); // Debug log
    console.log(
      "Status value:",
      cleanFilters.status,
      "Type:",
      typeof cleanFilters.status
    );

    this.recruitmentService.getMappedTalentsList(cleanFilters).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.status && response?.data) {
          this.talents = response.data.talents || [];

          if (this.currentSortFieldTalents) {
            this.talents.sort((a, b) => {
              let aValue = a[this.currentSortFieldTalents!];
              let bValue = b[this.currentSortFieldTalents!];

              if (aValue == null) aValue = '';
              if (bValue == null) bValue = '';

              if (typeof aValue === 'string') aValue = aValue.toLowerCase();
              if (typeof bValue === 'string') bValue = bValue.toLowerCase();

              let result = 0;
              if (aValue < bValue) result = -1;
              else if (aValue > bValue) result = 1;

              return this.currentSortOrderTalents * result;
            });
          }

          this.totalTalents = response.data.totaltalents || 0;
          this.shortlistedTalents = response.data.shortlistedTalents || 0;
          this.rejectedTalents = response.data.rejectedTalents || 0;
          // Delivered talents count - use deliveredTalents from API or fallback to totalTalents
          this.deliveredTalents =
            response.data.deliveredTalents || response.data.totaltalents || 0;
          this.validationCount = response.data.validTalents || 0;
          this.totalRecords = this.totalTalents;
        } else {
          this.talents = [];
          this.totalTalents = 0;
          this.shortlistedTalents = 0;
          this.rejectedTalents = 0;
          this.deliveredTalents = 0;
          this.validationCount = 0;
          this.totalRecords = 0;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: err?.error?.message || "Failed to load talents",
        });
      },
    });
  }

  onPageChange(event: any) {
    const isSortToggle =
      event.sortField === this.currentSortFieldTalents &&
      event.sortOrder !== this.currentSortOrderTalents &&
      event.first === 0 &&
      this.currentFirstTalents !== 0;
    if (isSortToggle) {
      event.first = this.currentFirstTalents;
    }
    this.currentSortFieldTalents = event.sortField;
    this.currentSortOrderTalents = event.sortOrder;
    this.currentFirstTalents = event.first;
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    const currentFilters: any = {};
    const formValue = this.filterForm.value;

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          currentFilters[key] = value;
        }
      } else if (value !== null && value !== "" && value !== undefined) {
        currentFilters[key] = value;
      }
    });
    if (currentFilters.phone) {
      if (typeof currentFilters.phone === 'object') {
        const dialCode = currentFilters.phone.dialCode || '';
        const number = currentFilters.phone.number || '';
        currentFilters.phone = number || null;
        currentFilters.phone_code = dialCode || null;
        if (!number && !dialCode) {
          delete currentFilters.phone;
          delete currentFilters.phone_code;
        }
      }
    }
    delete currentFilters.phone_country_code;
    if (this.activeTab === "shortlisted") {
      currentFilters.status = 1;
    } else if (this.activeTab === "rejected") {
      currentFilters.status = 0;
    } else if (this.activeTab === "delivered" || this.activeTab === "validationCount" || this.activeTab === "all") {
      delete currentFilters.status;
    }
    this.loadTalents(currentFilters);
    if (isSortToggle && this.tableTalents) {
      setTimeout(() => {
        this.tableTalents.first = this.currentFirstTalents;
      }, 0);
    }
  }

  applyFilter() {
    const filterValues: any = {};
    const formValue = this.filterForm.value;

    // Only include non-empty filter values
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      // Handle array values (like years_of_experience multi-select)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filterValues[key] = value;
        }
      }
      // Handle regular values
      else if (value !== null && value !== "" && value !== undefined) {
        filterValues[key] = value;
      }
    });

    if (filterValues.phone) {
      if (typeof filterValues.phone === 'object') {
        const dialCode = filterValues.phone.dialCode || '';
        const number = filterValues.phone.number || '';

        filterValues.phone = number || null;
        filterValues.phone_code = dialCode || null;

        if (!number && !dialCode) {
          delete filterValues.phone;
          delete filterValues.phone_code;
        } else if (!number) {
          delete filterValues.phone;
        } else if (!dialCode) {
          delete filterValues.phone_code;
        }
      }
    }
    delete filterValues.phone_country_code;

    this.loadTalents(filterValues);
  }

  resetFilter() {
    this.filterForm.reset({
      order_id: "",
      company_name: "",
      company_id: "",
      talent_id: "",
      candidate_name: "",
      email: "",
      phone: "",
      phone_country_code: "",
      position: "",
      years_of_experience: [],
      expected_salary: "",
      expected_salary_currency: "INR",
      status: "",
      validation_status: "",
    });
    this.activeTab = "all";
    this.loadTalents({});
  }

  onTabChange(tab: string) {
    this.activeTab = tab;

    // Get current filter values (excluding status, as tab will control it)
    const currentFilters: any = {};
    const formValue = this.filterForm.value;
    Object.keys(formValue).forEach((key) => {
      // Skip status field - tab will control it
      if (key === "status") {
        return;
      }
      if (
        formValue[key] !== null &&
        formValue[key] !== "" &&
        formValue[key] !== undefined
      ) {
        currentFilters[key] = formValue[key];
      }
    });
    console.log(tab);
    // Add status filter based on tab (this takes precedence)
    // Ensure status is explicitly set or removed
    if (tab === "shortlisted") {
      currentFilters.status = 1;
      // Update form to reflect the selected status
      this.filterForm.patchValue({ status: 1 });
    } else if (tab === "rejected") {
      // Explicitly set status to 0 for rejected
      currentFilters.status = 0;
      // Update form to reflect the selected status
      this.filterForm.patchValue({ status: 0 });
    } else if (tab === "delivered") {
      // For 'delivered', show all delivered talents (no status filter)
      delete currentFilters.status;
      // Clear status from form
      this.filterForm.patchValue({ status: "" });
    } else if (tab === "validationCount") {
      // For 'validationCount', show all delivered talents (no status filter)
      delete currentFilters.status;
      // Clear status from form
      this.filterForm.patchValue({ status: "" });
    } else if (tab === "all") {
      // For 'all', explicitly remove status filter
      delete currentFilters.status;
      // Clear status from form
      this.filterForm.patchValue({ status: "" });
    }

    console.log("Tab changed to:", tab, "Filters:", currentFilters); // Debug log
    this.loadTalents(currentFilters);
  }

  getStatusLabel(status: number): string {
    return status === 1 ? "Shortlisted" : "Rejected";
  }

  getStatusSeverity(status: number): "success" | "danger" {
    return status === 1 ? "success" : "danger";
  }

  getValidationStatusLabel(status: string): string {
    return status;
  }

  getValidationStatusSeverity(
    status: string
  ): "success" | "danger" | "secondary" {
    switch (status) {
      case "Valid":
        return "success";
      case "Not Valid":
        return "danger";
      case "Yet to Action":
        return "secondary";
      default:
        return "secondary";
    }
  }

  getExperienceLabel(years: string | number): string {
    const numYears = typeof years === "string" ? parseFloat(years) : years;
    return numYears === 1 ? "Year" : "Years";
  }

  exportData() {
    this.recruitmentService.exportMappedTalents(this.filterForm.value).subscribe(res => {
      if (res.export_link) {
        window.open(res.export_link, '_blank');
        this.toast.add({ severity: 'success', summary: 'Export', detail: res.message || 'Export file is being downloaded' });
      }
      else {
        this.toast.add({ severity: 'error', summary: 'Export', detail: res.message || 'No download link received from server' });
      }
    })
  }

  viewOrder(talent: any) {
    // Open dialog with talent details
    this.selectedTalent = talent;
    this.isEditMode = false;
    this.viewDialogVisible = true;
    // Initialize form after a short delay to ensure dropdowns are loaded
    setTimeout(() => {
      this.initializeEditForm();
    }, 100);
  }

  closeViewDialog() {
    this.viewDialogVisible = false;
    this.selectedTalent = null;
    this.isEditMode = false;
    if (this.editTalentForm) {
      this.editTalentForm.reset();
    }
  }

  formatPhoneForDisplay(phone: any, phoneCode?: string): string {
    if (!phone && !phoneCode) return '';

    if (typeof phone === 'string') {
      if (phone.startsWith('+')) return phone;

      if (phoneCode) {
        const cleanCode = phoneCode.replace(/\+/g, '');
        const cleanPhone = phone.replace(/\+/g, '');
        return '+' + cleanCode + cleanPhone;
      }

      return phone;
    }

    if (typeof phone === 'object' && phone?.dialCode && phone?.number) {
      return phone.dialCode + phone.number;
    }

    return '';
  }

  initializeEditForm() {
    if (!this.selectedTalent) return;

    // Parse work locations - convert array to IDs if needed
    let workLocationIds: number[] = [];
    if (
      this.selectedTalent.work_locations &&
      Array.isArray(this.selectedTalent.work_locations)
    ) {
      workLocationIds = this.selectedTalent.work_locations
        .map((loc: any) => {
          if (typeof loc === "string") {
            // Find location ID by name
            const found = this.workLocations.find(
              (wl: any) => wl.work_location === loc
            );
            return found ? found.id : null;
          }
          return loc;
        })
        .filter((id: any) => id !== null);
    }

    // Parse notice period - convert days to option value
    let noticePeriodValue: number = 0;
    if (this.selectedTalent.notice_period) {
      const days =
        typeof this.selectedTalent.notice_period === "string"
          ? parseInt(this.selectedTalent.notice_period, 10)
          : this.selectedTalent.notice_period;
      noticePeriodValue = days;
    }

    // Parse years of experience
    let experienceValue = this.selectedTalent.years_of_experience || "";
    if (typeof experienceValue === "number") {
      experienceValue = experienceValue.toString();
    }

    // Match work mode value
    let workModeValue = this.selectedTalent.work_mode || "";
    if (workModeValue && this.workMode.length > 0) {
      const matchedMode = this.workMode.find(
        (mode: any) =>
          mode.value?.toLowerCase() === workModeValue?.toLowerCase() ||
          mode.label?.toLowerCase() === workModeValue?.toLowerCase()
      );
      workModeValue = matchedMode ? matchedMode.value : workModeValue;
    }

    // Match work type value
    let workTypeValue = this.selectedTalent.work_type || "";
    if (workTypeValue && this.workType.length > 0) {
      const normalizedType = workTypeValue.toLowerCase().replace(/\s+/g, "_");
      const matchedType = this.workType.find(
        (type: any) =>
          type.value?.toLowerCase() === normalizedType ||
          type.value?.toLowerCase() === workTypeValue?.toLowerCase() ||
          type.label?.toLowerCase() === workTypeValue?.toLowerCase()
      );
      workTypeValue = matchedType ? matchedType.value : workTypeValue;
    }

    let phoneValue: any = "";
    if (this.selectedTalent.phone) {
      if (typeof this.selectedTalent.phone === 'object' && this.selectedTalent.phone.number) {
        // If phone is already an object with dialCode and number
        phoneValue = this.selectedTalent.phone;
      } else if (typeof this.selectedTalent.phone === 'string') {
        // If phone is a string like "+917708813316"
        const phoneStr = this.selectedTalent.phone;

        if (phoneStr.startsWith('+')) {
          const phoneWithoutPlus = phoneStr.substring(1);

          // Parse common country codes
          if (phoneWithoutPlus.startsWith('91') && phoneWithoutPlus.length > 10) {
            // India: +91
            phoneValue = {
              dialCode: '+91',
              number: phoneWithoutPlus.substring(2)
            };
          } else if (phoneWithoutPlus.startsWith('1') && phoneWithoutPlus.length > 10) {
            // US/Canada: +1
            phoneValue = {
              dialCode: '+1',
              number: phoneWithoutPlus.substring(1)
            };
          } else if (phoneWithoutPlus.startsWith('44') && phoneWithoutPlus.length > 10) {
            // UK: +44
            phoneValue = {
              dialCode: '+44',
              number: phoneWithoutPlus.substring(2)
            };
          } else if (phoneWithoutPlus.length >= 10) {
            // Default: assume 2-digit country code
            phoneValue = {
              dialCode: '+' + phoneWithoutPlus.substring(0, 2),
              number: phoneWithoutPlus.substring(2)
            };
          } else {
            // Fallback
            phoneValue = {
              dialCode: '',
              number: phoneStr
            };
          }
        } else {
          // No + prefix
          phoneValue = {
            dialCode: this.selectedTalent.phone_code || '',
            number: phoneStr
          };
        }
      }
    }

    this.editTalentForm = this.fb.group({
      company_name: [this.selectedTalent.company_name || ""],
      candidate_name: [this.selectedTalent.candidate_name || ""],
      email: [this.selectedTalent.email || ""],
      phone: [phoneValue || null],
      phone_code: [phoneValue || null],
      profile_url: [this.selectedTalent.profile_url || ""],
      position: [this.selectedTalent.position || ""],
      years_of_experience: [experienceValue],
      current_salary_currency: [
        this.selectedTalent.current_salary_currency || "",
      ],
      current_salary: [this.selectedTalent.current_salary || null],
      expected_salary_currency: [
        this.selectedTalent.expected_salary_currency || "",
      ],
      expected_salary: [this.selectedTalent.expected_salary || null],
      work_locations: [workLocationIds],
      work_mode: [workModeValue],
      work_type: [workTypeValue],
      notice_period: [noticePeriodValue],
      status: [
        this.selectedTalent.status !== undefined
          ? this.selectedTalent.status
          : 1,
      ],
      remarks: [
        this.selectedTalent.uniprep_remarks ||
        this.selectedTalent.remarks ||
        "",
        Validators.maxLength(2000),
      ],
      validation_remarks: [
        this.selectedTalent.validation_remarks ||
        "",
        Validators.maxLength(2000),
      ],
      languages: this.fb.array([]),
      validation_status: [this.selectedTalent.validation_status || ''],
    });

    // Fill languages from existing data - same way as work locations
    this.fillLanguagesFromArraySync(this.selectedTalent.language_known || []);
  }

  fillLanguagesFromArraySync(languageSkills: any[]) {
    if (!this.editTalentForm) return;

    const languagesArray = this.editTalentForm.get("languages") as FormArray;
    if (!languagesArray) return;

    // Clear existing languages
    while (languagesArray.length > 0) {
      languagesArray.removeAt(0);
    }

    // Parse language_known array which appears to be alternating [language, proficiency, language, proficiency, ...]
    if (languageSkills && languageSkills.length >= 2) {
      let i = 0;
      while (i < languageSkills.length) {
        const language = languageSkills[i];
        const proficiency =
          i + 1 < languageSkills.length ? languageSkills[i + 1] : "";

        // Check if language exists in dropdown
        const languageObj = this.languages.find(
          (lang) =>
            lang.language === language ||
            lang.language?.toLowerCase() === language?.toLowerCase()
        );

        // Check if proficiency exists - try multiple matching strategies
        let proficiencyObj = this.languageProficiency.find(
          (prof) => prof.label === proficiency || prof.value === proficiency
        );

        // If not found, try case-insensitive matching
        if (!proficiencyObj) {
          proficiencyObj = this.languageProficiency.find(
            (prof) =>
              prof.label?.toLowerCase() === proficiency?.toLowerCase() ||
              prof.value?.toLowerCase() === proficiency?.toLowerCase()
          );
        }

        // If still not found, try matching proficiency label/value parts (e.g., "Proficient" matches "Proficient(4)")
        if (!proficiencyObj && proficiency) {
          const profSearch = proficiency.toLowerCase().trim();
          proficiencyObj = this.languageProficiency.find((prof) => {
            const profLabel = (prof.label || "").toLowerCase().trim();
            const profValue = (prof.value || "")
              .toString()
              .toLowerCase()
              .trim();

            // Check if proficiency string is contained in label or value
            if (
              profLabel.includes(profSearch) ||
              profSearch.includes(profLabel)
            ) {
              return true;
            }
            if (
              profValue.includes(profSearch) ||
              profSearch.includes(profValue)
            ) {
              return true;
            }

            // Check if label starts with proficiency (e.g., "Proficient(4)" starts with "Proficient")
            if (
              profLabel.startsWith(profSearch) ||
              profSearch.startsWith(profLabel.split("(")[0])
            ) {
              return true;
            }

            return false;
          });
        }

        const languageForm = this.createLanguageForm();
        if (languageObj) {
          // Set language
          languageForm.patchValue({
            language: languageObj.language,
          });

          // Set proficiency - always use the value property from dropdown
          if (proficiencyObj) {
            // Use the value property (required for p-select with optionValue="value")
            const proficiencyValue =
              proficiencyObj.value !== undefined &&
                proficiencyObj.value !== null
                ? proficiencyObj.value
                : proficiencyObj.label;
            languageForm.patchValue({
              proficiency: proficiencyValue,
            });
          } else if (proficiency) {
            // Try to find by matching label or value more aggressively
            const foundByLabel = this.languageProficiency.find((prof) => {
              const profLabel = (prof.label || "").toString().toLowerCase();
              const profValue = (prof.value || "").toString().toLowerCase();
              const searchProficiency = proficiency.toLowerCase().trim();
              // Extract base proficiency (e.g., "Proficient" from "Proficient(4)")
              const baseProficiency = searchProficiency.split("(")[0].trim();
              return (
                profLabel.includes(baseProficiency) ||
                profValue.includes(baseProficiency) ||
                baseProficiency.includes(profLabel.split("(")[0]) ||
                baseProficiency.includes(profValue.split("(")[0])
              );
            });

            if (foundByLabel) {
              languageForm.patchValue({
                proficiency:
                  foundByLabel.value !== undefined &&
                    foundByLabel.value !== null
                    ? foundByLabel.value
                    : foundByLabel.label,
              });
            } else {
              // Set raw proficiency value as last resort
              languageForm.patchValue({
                proficiency: proficiency,
              });
            }
          }
        } else {
          // If language not found, still add with raw values
          languageForm.patchValue({
            language: language || "",
            proficiency: proficiency || "",
          });
        }
        languagesArray.push(languageForm);

        i += 2; // Move to next language-proficiency pair
      }
    }

    // If no languages found, add one empty form
    if (languagesArray.length === 0) {
      languagesArray.push(this.createLanguageForm());
    }

    // If dropdowns are not loaded yet, retry after they load
    if (this.languages.length === 0 || this.languageProficiency.length === 0) {
      setTimeout(() => {
        this.fillLanguagesFromArraySync(languageSkills);
      }, 500);
    }
  }

  // Language FormArray methods
  createLanguageForm(): FormGroup {
    return this.fb.group({
      language: ["", Validators.required],
      proficiency: ["", Validators.required],
    });
  }

  get languagesFormArray(): FormArray | null {
    if (!this.editTalentForm) {
      return null;
    }
    const languagesArray = this.editTalentForm.get("languages") as FormArray;
    return languagesArray || null;
  }

  getLanguageForm(index: number): FormGroup {
    return this.languagesFormArray.at(index) as FormGroup;
  }

  addLanguage() {
    const languagesArray = this.languagesFormArray;
    if (languagesArray) {
      languagesArray.push(this.createLanguageForm());
    } else if (this.editTalentForm) {
      // Ensure FormArray exists
      if (!this.editTalentForm.get("languages")) {
        this.editTalentForm.addControl("languages", this.fb.array([]));
      }
      const newArray = this.editTalentForm.get("languages") as FormArray;
      newArray.push(this.createLanguageForm());
    }
  }

  removeLanguage(index: number) {
    if (this.languagesFormArray && this.languagesFormArray.length > 1) {
      this.languagesFormArray.removeAt(index);
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "At least one language is required",
      });
    }
  }

  fillLanguagesFromArray(languageSkills: any[]) {
    if (!this.editTalentForm) return;

    // Clear existing languages
    const languagesArray = this.editTalentForm.get("languages") as FormArray;
    if (!languagesArray) return;

    while (languagesArray.length > 0) {
      languagesArray.removeAt(0);
    }

    // If dropdowns are not loaded yet, wait and retry
    if (this.languages.length === 0 || this.languageProficiency.length === 0) {
      setTimeout(() => {
        this.fillLanguagesFromArray(languageSkills);
      }, 500);
      return;
    }

    // Parse language_known array which appears to be alternating [language, proficiency, language, proficiency, ...]
    if (languageSkills && languageSkills.length >= 2) {
      let i = 0;
      while (i < languageSkills.length) {
        const language = languageSkills[i];
        const proficiency =
          i + 1 < languageSkills.length ? languageSkills[i + 1] : "";

        // Check if language exists in dropdown
        const languageObj = this.languages.find(
          (lang) =>
            lang.language === language ||
            lang.language?.toLowerCase() === language?.toLowerCase()
        );

        // Check if proficiency exists - try multiple matching strategies
        let proficiencyObj = this.languageProficiency.find(
          (prof) => prof.label === proficiency || prof.value === proficiency
        );

        // If not found, try case-insensitive matching
        if (!proficiencyObj) {
          proficiencyObj = this.languageProficiency.find(
            (prof) =>
              prof.label?.toLowerCase() === proficiency?.toLowerCase() ||
              prof.value?.toLowerCase() === proficiency?.toLowerCase()
          );
        }

        // If still not found, try matching proficiency label/value parts
        if (!proficiencyObj && proficiency) {
          proficiencyObj = this.languageProficiency.find((prof) => {
            const profLabel = prof.label?.toLowerCase() || "";
            const profValue = prof.value?.toLowerCase() || "";
            const profSearch = proficiency.toLowerCase();
            return (
              profLabel.includes(profSearch) ||
              profValue.includes(profSearch) ||
              profSearch.includes(profLabel) ||
              profSearch.includes(profValue)
            );
          });
        }

        if (languageObj && proficiencyObj) {
          const languageForm = this.createLanguageForm();
          languageForm.patchValue({
            language: languageObj.language,
            proficiency: proficiencyObj.value || proficiencyObj.label,
          });
          languagesArray.push(languageForm);
        } else if (languageObj) {
          // If only language found, add with proficiency value
          const languageForm = this.createLanguageForm();
          languageForm.patchValue({
            language: languageObj.language,
            proficiency: proficiency || "",
          });
          languagesArray.push(languageForm);
        } else {
          // If neither found, still add with raw values to preserve data
          const languageForm = this.createLanguageForm();
          languageForm.patchValue({
            language: language || "",
            proficiency: proficiency || "",
          });
          languagesArray.push(languageForm);
        }

        i += 2; // Move to next language-proficiency pair
      }
    }

    // If no languages found, add one empty form
    if (languagesArray.length === 0) {
      languagesArray.push(this.createLanguageForm());
    }
  }

  editTalent() {
    // Toggle edit mode
    this.isEditMode = true;
    if (!this.editTalentForm) {
      this.initializeEditForm();
    } else {
      // Ensure languages FormArray exists
      if (!this.editTalentForm.get("languages")) {
        this.editTalentForm.addControl("languages", this.fb.array([]));
      }
      // Re-fill languages when entering edit mode - same way as work locations
      this.fillLanguagesFromArraySync(this.selectedTalent.language_known || []);
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.initializeEditForm(); // Reset form to original values
  }

  saveTalent() {
    if (!this.editTalentForm || this.editTalentForm.invalid) {
      this.editTalentForm?.markAllAsTouched();
      this.toast.add({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please fill all required fields",
      });
      return;
    }

    const formValue = this.editTalentForm.value;

    // Prepare payload similar to map-talent API
    const payload: any = {
      id: this.selectedTalent.id, // Add id for update
      talent_id: this.selectedTalent.talent_id,
      order_id: this.selectedTalent.order_id,
      employer_id: this.selectedTalent.employer_id,
      company_id: this.selectedTalent.company_id,
      company_name: formValue.company_name,
      candidate_name: formValue.candidate_name,
      email: formValue.email,
      phone: formValue.phone?.number,
      phone_code: formValue.phone?.dialCode,
      profile_url: formValue.profile_url,
      position: formValue.position,
      years_of_experience: formValue.years_of_experience,
      work_locations: Array.isArray(formValue.work_locations)
        ? formValue.work_locations
        : [],
      current_salary_currency: formValue.current_salary_currency,
      current_salary: formValue.current_salary,
      expected_salary_currency: formValue.expected_salary_currency,
      expected_salary: formValue.expected_salary,
      work_mode: formValue.work_mode?.toLowerCase() || "",
      work_type: formValue.work_type?.toLowerCase().replace(/\s+/g, "_") || "",
      notice_period: formValue.notice_period || 0,
      status: formValue.status,
      remarks: formValue.remarks || "",
      validation_remarks: formValue.validation_remarks || "",
      language_known: this.getLanguageKnownArray(),
      validation_status: formValue.validation_status,
    };

    // Call update API (using map-talent for now, or create update API)
    this.recruitmentService.mapTalent(payload).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response?.message || "Talent updated successfully",
          });
          this.isEditMode = false;
          // Reload talents list
          this.loadTalents();
          // Update selected talent
          this.selectedTalent = { ...this.selectedTalent, ...formValue };
          // Close the dialog after successful save
          setTimeout(() => {
            this.closeViewDialog();
          }, 1000);
        } else {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: response?.message || "Failed to update talent",
          });
        }
      },
      error: (err) => {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message || "Failed to update talent. Please try again.",
        });
      },
    });
  }

  updateTalent() {
    // If not in edit mode, enter edit mode first
    if (!this.isEditMode) {
      this.editTalent();
    }
    // Save the talent (will validate and save)
    this.saveTalent();
  }

  getLanguageKnownArray(): string[] {
    const languagesArray = this.languagesFormArray;
    const result: string[] = [];

    if (languagesArray) {
      for (let i = 0; i < languagesArray.length; i++) {
        const languageForm = languagesArray.at(i) as FormGroup;
        const language = languageForm.get("language")?.value;
        const proficiency = languageForm.get("proficiency")?.value;

        if (language && proficiency) {
          result.push(language);
          result.push(proficiency);
        }
      }
    }

    return result;
  }

  addTalent() {
    this.router.navigate(["/requirement/delivered-talents/add"]);
  }

  formatSalary(salary: string | number): string {
    if (!salary) return "0";
    const numSalary = typeof salary === "string" ? parseFloat(salary) : salary;
    return numSalary.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  getLanguageNames(languages: any[]): string {
    if (!languages || !Array.isArray(languages)) return "";
    // Languages come as ["English", "Proficient", "Hindi", "Native"]
    // We want to group them as "English - Proficient, Hindi - Native"
    const pairs: string[] = [];
    for (let i = 0; i < languages.length; i += 2) {
      if (languages[i] && languages[i + 1]) {
        pairs.push(`${languages[i]} - ${languages[i + 1]}`);
      } else if (languages[i]) {
        pairs.push(languages[i]);
      }
    }
    return pairs.join(", ");
  }

  formatNoticePeriod(days: number | string): string {
    if (!days) return "Immediate";
    const numDays = typeof days === "string" ? parseInt(days, 10) : days;
    if (numDays === 0) return "Immediate";
    if (numDays < 7) return `${numDays} Days`;
    if (numDays < 30)
      return `${Math.floor(numDays / 7)} Week${Math.floor(numDays / 7) > 1 ? "s" : ""
        }`;
    return `${Math.floor(numDays / 30)} Month${Math.floor(numDays / 30) > 1 ? "s" : ""
      }`;
  }

  formatWorkMode(mode: string): string {
    if (!mode) return "";
    // Convert "hybrid" to "Hybrid", "remote" to "Remote", etc.
    return mode.charAt(0).toUpperCase() + mode.slice(1).replace(/_/g, " ");
  }

  formatWorkType(type: string): string {
    if (!type) return "";
    // Convert "full_time" to "Full-time", "part_time" to "Part-time", etc.
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  getSanitizedHtml(html: string): SafeHtml {
    if (!html) return this.sanitizer.bypassSecurityTrustHtml("");
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getTextLength(html: string): number {
    if (!html) return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim().length || 0;
  }
}
