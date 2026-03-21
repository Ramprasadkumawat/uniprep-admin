import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { RecruitmentService } from "../recruitment.service";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: "uni-delivered-talents",
  templateUrl: "./delivered-talents.component.html",
  styleUrls: ["./delivered-talents.component.scss"],
  standalone: false,
})
export class DeliveredTalentsComponent implements OnInit {
  talentForm!: FormGroup;

  // Dropdown Options
  companiesList: any[] = [];
  positions: any[] = [];
  visiblePositions: any[] = [];
  workLocations: any[] = [];
  visibleLocations: any[] = [];
  languages: any[] = [];
  languageProficiency: any[] = [];
  currency: any[] = [];
  workMode: any[] = [];
  workType: any[] = [];
  // Talent Validation Status options
  statusOptions: any[] = [
    { label: "Yet to Action", value: "Yet to Action" },
    { label: "Valid", value: "Valid" },
    { label: "Not Valid", value: "Not Valid" },
  ];
  // Talent Status options (final decision)
  talentStatusOptions: any[] = [
    { label: "Shortlist", value: 1 },
    { label: "Reject", value: 0 },
  ];
  noticePeriodOptions: any[] = [
    { label: "Immediate", value: "immediate" },
    { label: "1 Week", value: "1 week" },
    { label: "2 Weeks", value: "2 weeks" },
    { label: "1 Month", value: "1 month" },
    { label: "2 Months", value: "2 months" },
    { label: "3 Months", value: "3 months" },
  ];
  experienceYears: any[] = [
    { label: "0-1 Year", value: "0-1" },
    { label: "1-3 Years", value: "1-3" },
    { label: "3-5 Years", value: "3-5" },
    { label: "5-10 Years", value: "5-10" },
    { label: "10+ Years", value: "10+" },
  ];

  // Lazy Loading Properties
  private readonly BATCH_SIZE = 200;
  private currentPositionIndex = 0;
  private allPositionsLoaded = false;
  private currentLocationIndex = 0;
  private allLocationsLoaded = false;

  // State Management
  isLoadingAiGenerate: boolean = false;
  isLoadingOrder: boolean = false;
  isLoadingTalent: boolean = false;
  isSubmitting: boolean = false;
  selectedCurrency: string = "INR";
  orderDataCache: any = null; // Cache order data until dropdowns are loaded
  dropdownsInitialized: number = 0; // Track how many dropdowns have been initialized
  employerId: string | number | null = null;
  companyId: number | null = null;
  companyName: string = "";
  preferredCountry: any;
  SearchCountryField = SearchCountryField;

  constructor(
    private fb: FormBuilder,
    private toast: MessageService,
    private recruitmentService: RecruitmentService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadDropdowns();
    this.getCompaniesList();
    this.setupOrderIdListener();
    this.setupTalentIdListener();
    this.http.get("https://ipapi.co/json/").subscribe((data: any) => {
      this.preferredCountry = data.country_code.toLocaleLowerCase();
    });
  }

  onOrderIdInput(event: any) {
    const value = event.target.value;
    const upperValue = value.toUpperCase();
    if (value !== upperValue) {
      this.talentForm.patchValue({ orderId: upperValue }, { emitEvent: false });
      // Update the input value directly to prevent cursor jump
      event.target.value = upperValue;
    }
  }

  setupOrderIdListener() {
    this.talentForm
      .get("orderId")
      ?.valueChanges.pipe(
        debounceTime(1000), // Wait 1 second after user stops typing
        distinctUntilChanged(), // Only proceed if value actually changed
        filter((orderId) => {
          // Only proceed if orderId is exactly 6 or 7 characters (alphanumeric)
          const trimmed = orderId?.trim() || "";
          return trimmed.length === 6 || trimmed.length === 7 && /^[A-Z0-9]+$/i.test(trimmed);
        })
      )
      .subscribe((orderId) => {
        if (orderId && orderId.trim().length > 0) {
          this.loadOrderDetails(orderId.trim());
        }
      });
  }

  setupTalentIdListener() {
    this.talentForm
      .get("talentId")
      ?.valueChanges.pipe(
        debounceTime(1000), // Wait 1 second after user stops typing
        distinctUntilChanged(), // Only proceed if value actually changed
        filter((talentId) => {
          // Only proceed if talentId is exactly 6 digits
          const trimmed = talentId?.toString().trim() || "";
          return /^\d{6}$/.test(trimmed);
        })
      )
      .subscribe((talentId) => {
        if (talentId) {
          const talentIdNum = parseInt(talentId.toString().trim(), 10);
          if (!isNaN(talentIdNum)) {
            this.loadTalentDetails(talentIdNum);
          }
        }
      });
  }

  initializeForm() {
    this.talentForm = this.fb.group({
      orderId: ["", Validators.required],
      talentId: ["", Validators.required],
      companyId: ["", Validators.required],
      candidateName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNo: ["", Validators.required],
      profileUrl: ["", Validators.required],
      position: [null, Validators.required],
      workLocation: [[], Validators.required],
      yearOfExperience: ["", Validators.required],
      currentSalaryCurrency: ["", Validators.required],
      currentSalary: [null, Validators.required],
      salaryExpectationCurrency: ["", Validators.required],
      salaryExpectation: [null, Validators.required],
      workMode: ["", Validators.required],
      workType: ["", Validators.required],
      //validationStatus: ["", Validators.required],
      talentStatus: ["", Validators.required],
      noticePeriod: ["", Validators.required],
      languages: this.fb.array([this.createLanguageForm()]),
      remarks: ["", [Validators.required, Validators.maxLength(2000)]],
    });
  }

  createLanguageForm(): FormGroup {
    return this.fb.group({
      language: ["", Validators.required],
      proficiency: ["", Validators.required],
    });
  }

  get languagesFormArray(): FormArray {
    return this.talentForm.get("languages") as FormArray;
  }

  getLanguageForm(index: number): FormGroup {
    return this.languagesFormArray.at(index) as FormGroup;
  }

  addLanguage() {
    this.languagesFormArray.push(this.createLanguageForm());
  }

  removeLanguage(index: number) {
    if (this.languagesFormArray.length > 1) {
      this.languagesFormArray.removeAt(index);
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "At least one language is required",
      });
    }
  }

  loadDropdowns() {
    // Load positions with lazy loading
    this.recruitmentService.getDropdownData().subscribe((res) => {
      this.languages = res.language || [];
      this.currency = res.currencycode || [];
      this.positions = res.positions || [];
      this.initializeLazyPositions();
      this.initializeLanguageProficiency(res.proficiencylevel);
      this.dropdownsInitialized++;
      this.checkAndFillForm();
    });

    // Load work locations with lazy loading
    this.recruitmentService.getWorkLocationDropdownData().subscribe((res) => {
      this.workLocations = res.worklocations || [];
      this.initializeLazyLocations();
      this.dropdownsInitialized++;
      this.checkAndFillForm();
    });

    // Load work mode and work type
    this.recruitmentService.hiringSupportDropdown(null).subscribe((res) => {
      this.workMode = res.data?.workMode || [];
      this.workType = res.data?.employmentTypeOptions || [];
      this.dropdownsInitialized++;
      this.checkAndFillForm();
    });
  }

  checkAndFillForm() {
    // Fill form if we have cached order data and all dropdowns are initialized
    if (this.orderDataCache && this.dropdownsInitialized >= 3) {
      setTimeout(() => {
        this.fillFormFromOrderData(this.orderDataCache);
        this.orderDataCache = null; // Clear cache after filling
      }, 200);
    }
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

  private loadPositionsTimeout: any;
  private loadLocationsTimeout: any;
  private initializeLazyPositions() {
    this.currentPositionIndex = 0;
    this.allPositionsLoaded = false;
    this.visiblePositions = [];
    const firstBatch = this.positions.slice(0, this.BATCH_SIZE);
    this.visiblePositions = firstBatch;
    this.currentPositionIndex = this.BATCH_SIZE;
    if (this.currentPositionIndex >= this.positions.length) {
      this.allPositionsLoaded = true;
    }
  }

  loadPositionsLazy(event: any) {
    if (this.allPositionsLoaded) return;

    if (this.loadPositionsTimeout) {
      clearTimeout(this.loadPositionsTimeout);
    }
    this.loadPositionsTimeout = setTimeout(() => {
      this.loadNextPositionBatch();
    }, 150);
  }

  private loadNextPositionBatch() {
    if (this.currentPositionIndex >= this.positions.length) {
      this.allPositionsLoaded = true;
      return;
    }

    const nextBatch = this.positions.slice(
      this.currentPositionIndex,
      this.currentPositionIndex + this.BATCH_SIZE
    );

    this.visiblePositions.push(...nextBatch);
    this.currentPositionIndex += this.BATCH_SIZE;

    if (this.currentPositionIndex >= this.positions.length) {
      this.allPositionsLoaded = true;
    }
  }

  private initializeLazyLocations() {
    this.currentLocationIndex = 0;
    this.allLocationsLoaded = false;
    this.visibleLocations = [];

    if (this.workLocations.length > 0) {
      const firstBatch = this.workLocations.slice(0, this.BATCH_SIZE);
      this.visibleLocations = firstBatch;
      this.currentLocationIndex = this.BATCH_SIZE;
      if (this.currentLocationIndex >= this.workLocations.length) {
        this.allLocationsLoaded = true;
      }
    }
  }

  loadLocationsLazy(event: any) {
    if (this.allLocationsLoaded) return;
    if (this.loadLocationsTimeout) {
      clearTimeout(this.loadLocationsTimeout);
    }
    this.loadLocationsTimeout = setTimeout(() => {
      this.loadNextLocationBatch();
    }, 150);
  }

  private loadNextLocationBatch() {
    if (this.currentLocationIndex >= this.workLocations.length) {
      this.allLocationsLoaded = true;
      return;
    }

    const nextBatch = this.workLocations.slice(
      this.currentLocationIndex,
      this.currentLocationIndex + this.BATCH_SIZE
    );

    this.visibleLocations.push(...nextBatch);
    this.currentLocationIndex += this.BATCH_SIZE;

    if (this.currentLocationIndex >= this.workLocations.length) {
      this.allLocationsLoaded = true;
    }
  }

  // AI Generation for Remarks
  aiGenerateRemarks() {
    this.isLoadingAiGenerate = true;
    const currentValue = this.talentForm.get("remarks")?.value;

    this.recruitmentService
      .aiGenerateApi(
        { mode: "rephrase", type: "notes", content: currentValue },
        "ai-generate"
      )
      .subscribe({
        next: (response: any) => {
          this.isLoadingAiGenerate = false;
          const cleanText = this.cleanHtmlList(response.response || response);
          this.talentForm.patchValue({ remarks: cleanText });
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

  loadOrderDetails(orderId: string) {
    this.isLoadingOrder = true;
    this.recruitmentService.showOrder(orderId).subscribe({
      next: (response: any) => {
        this.isLoadingOrder = false;
        if (response?.status && response?.data?.order) {
          // If dropdowns are initialized, fill form immediately
          // Otherwise, cache the data
          if (this.dropdownsInitialized >= 3) {
            setTimeout(() => {
              this.fillFormFromOrderData(response.data.order);
            }, 200);
          } else {
            this.orderDataCache = response.data.order;
          }
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Order details loaded successfully",
          });
        } else {
          this.toast.add({
            severity: "warn",
            summary: "Warning",
            detail: "No order data found",
          });
        }
      },
      error: (err) => {
        this.isLoadingOrder = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load order details",
        });
      },
    });
  }

  loadTalentDetails(talentId: number) {
    this.isLoadingTalent = true;
    this.recruitmentService.getTalentDetails(talentId).subscribe({
      next: (response: any) => {
        this.isLoadingTalent = false;
        if (
          response?.status === "success" &&
          response?.data?.talent &&
          response.data.talent.length > 0
        ) {
          const talentData = response.data.talent[0];
          // If dropdowns are initialized, fill form immediately
          // Otherwise, cache the data
          if (this.dropdownsInitialized >= 3) {
            setTimeout(() => {
              this.fillFormFromTalentData(talentData);
            }, 200);
          } else {
            // Cache talent data similar to order data
            setTimeout(() => {
              this.fillFormFromTalentData(talentData);
            }, 500);
          }
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Talent details loaded successfully",
          });
        } else if (response?.status === false) {
          this.toast.add({
            severity: "warn",
            summary: "Warning",
            detail: response?.message || "Talent not found",
          });
        } else {
          this.toast.add({
            severity: "warn",
            summary: "Warning",
            detail: "No talent data found",
          });
        }
      },
      error: (err) => {
        this.isLoadingTalent = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: err?.error?.message || "Failed to load talent details",
        });
      },
    });
  }

  fillFormFromTalentData(talentData: any) {
    // From Talent ID we should ONLY auto-fill:
    // - Candidate Name
    // - Email
    // - Phone
    // - Profile URL
    //
    // All order-related data (Job Title/Position, locations, salary, etc.)
    // must come strictly from the Order (order_id), not from the talent record.

    // Candidate name
    if (talentData.full_name) {
      this.talentForm.patchValue({ candidateName: talentData.full_name });
    }

    // Email
    if (talentData.email) {
      this.talentForm.patchValue({ email: talentData.email });
    }

    // Phone number with country code
    if (talentData.phone || talentData.country_code) {
      let phoneValue = "";
      if (talentData.country_code) {
        phoneValue = talentData.country_code;
      }
      if (talentData.phone) {
        phoneValue = phoneValue
          ? `${phoneValue}${talentData.phone}`
          : talentData.phone;
      }
      if (phoneValue) {
        this.talentForm.patchValue({ phoneNo: phoneValue });
      }
    }

    // Profile URL – generated from UUID
    if (talentData.uuid) {
      const profileUrl = `https://employer.uniprep.ai/pages/talent-connect/viewinfo/${talentData.id}`;
      this.talentForm.patchValue({ profileUrl });
    }
  }

  mapExperienceFromYears(years: number): string | null {
    if (years === null || years === undefined) return null;
    if (years >= 0 && years < 1) return "0-1";
    if (years >= 1 && years < 3) return "1-3";
    if (years >= 3 && years < 5) return "3-5";
    if (years >= 5 && years < 10) return "5-10";
    if (years >= 10) return "10+";
    return null;
  }

  mapWorkModeFromPreference(preference: string): string | null {
    if (!preference) return null;
    const prefLower = preference.toLowerCase();
    // Map "Remote Work" -> "Remote", "Hybrid Work" -> "Hybrid", etc.
    if (prefLower.includes("remote")) return "Remote";
    if (prefLower.includes("hybrid")) return "Hybrid";
    if (prefLower.includes("flexible")) return "Flexible";
    if (prefLower.includes("on-site") || prefLower.includes("onsite"))
      return "On-site";
    // Try to find exact match in workMode dropdown
    const matched = this.workMode.find(
      (mode) =>
        mode.label?.toLowerCase() === prefLower ||
        mode.label?.toLowerCase().includes(prefLower)
    );
    return matched ? matched.label : preference;
  }

  mapWorkTypeFromPreference(preference: string): string | null {
    if (!preference) return null;
    const prefLower = preference.toLowerCase();
    // Map "Full-Time Work" -> "Full-time", "Part-Time Work" -> "Part-time"
    if (prefLower.includes("full-time") || prefLower.includes("fulltime"))
      return "Full-time";
    if (prefLower.includes("part-time") || prefLower.includes("parttime"))
      return "Part-time";
    if (prefLower.includes("contract")) return "Contract";
    // Try to find exact match in workType dropdown
    const matched = this.workType.find(
      (type) =>
        type.label?.toLowerCase() === prefLower ||
        type.label?.toLowerCase().includes(prefLower)
    );
    return matched ? matched.label : preference;
  }

  fillLanguagesFromTalentData(talentLanguages: any[]) {
    // Clear existing languages
    while (this.languagesFormArray.length > 0) {
      this.languagesFormArray.removeAt(0);
    }

    // Map talent languages to form
    talentLanguages.forEach((talentLang) => {
      // Find language by language_id
      const languageObj = this.languages.find(
        (lang) => lang.id === talentLang.language_id
      );

      // Parse proficiency (e.g., "Proficient(4)" -> "Proficient")
      let proficiencyValue = "";
      if (talentLang.proficiency) {
        // Extract proficiency level (remove numbers and parentheses)
        proficiencyValue = talentLang.proficiency
          .replace(/\([0-9]+\)/g, "")
          .trim();
        // Find matching proficiency in dropdown
        const matchedProficiency = this.languageProficiency.find(
          (prof) =>
            prof.label?.toLowerCase() === proficiencyValue.toLowerCase() ||
            prof.value?.toLowerCase() === proficiencyValue.toLowerCase() ||
            prof.label?.toLowerCase().includes(proficiencyValue.toLowerCase())
        );
        if (matchedProficiency) {
          proficiencyValue =
            matchedProficiency.value || matchedProficiency.label;
        }
      }

      if (languageObj) {
        const languageForm = this.createLanguageForm();
        languageForm.patchValue({
          language: languageObj.language,
          proficiency: proficiencyValue || "",
        });
        this.languagesFormArray.push(languageForm);
      }
    });

    // If no languages were added, add one empty form
    if (this.languagesFormArray.length === 0) {
      this.languagesFormArray.push(this.createLanguageForm());
    }
  }

  fillFormFromOrderData(orderData: any) {
    // Store employer_id and company_id for later use
    if (orderData.employer_id) {
      this.employerId = orderData.employer_id;
    }
    if (orderData.company_id) {
      this.companyId = orderData.company_id;
    }
    if (orderData.company_name) {
      this.companyName = orderData.company_name;
      this.talentForm.patchValue({ companyId: orderData.company_name });
    }

    // Fill position
    if (orderData.jobTitle) {
      const positionTitle = orderData.jobTitle;

      // Ensure the position is in visiblePositions for display
      if (this.positions.length > 0) {
        // Find the position in the full positions array
        const positionObj = this.positions.find(
          (pos) => pos.position_title === positionTitle
        );

        if (positionObj) {
          // Add to visiblePositions if not already there
          if (
            !this.visiblePositions.some(
              (pos) => pos.position_title === positionTitle
            )
          ) {
            this.visiblePositions.push(positionObj);
          }
        }

        // Ensure visiblePositions is initialized
        if (this.visiblePositions.length === 0) {
          this.initializeLazyPositions();
        }

        // Set the position value
        setTimeout(() => {
          this.talentForm
            .get("position")
            ?.setValue(positionTitle, { emitEvent: false });
          this.cdr.detectChanges();
        }, 100);
      } else {
        // If positions not loaded yet, set value directly
        this.talentForm
          .get("position")
          ?.setValue(positionTitle, { emitEvent: false });
        // Retry after positions are loaded
        setTimeout(() => {
          const positionObj = this.positions.find(
            (pos) => pos.position_title === positionTitle
          );
          if (
            positionObj &&
            !this.visiblePositions.some(
              (pos) => pos.position_title === positionTitle
            )
          ) {
            this.visiblePositions.push(positionObj);
          }
          this.talentForm
            .get("position")
            ?.setValue(positionTitle, { emitEvent: false });
          this.cdr.detectChanges();
        }, 800);
      }
    }

    // Fill work type
    if (orderData.employment_type_id) {
      this.talentForm.patchValue({ workType: orderData.employment_type_id });
    }

    // Fill work location(s) from work_location_id_new array
    if (orderData.work_location_id_new) {
      const locationIds = Array.isArray(orderData.work_location_id_new)
        ? orderData.work_location_id_new
        : [orderData.work_location_id_new];

      // Filter out null, undefined, and empty values first, then convert to numbers
      const validLocationIds: number[] = locationIds
        .filter(
          (id: any) =>
            id !== null && id !== undefined && id !== "" && id !== "null"
        )
        .map((id: any) => {
          if (typeof id === "number") {
            return id;
          }
          const parsed = parseInt(String(id).trim(), 10);
          return isNaN(parsed) ? null : parsed;
        })
        .filter((id: number | null): id is number => id !== null && id > 0);

      // Set work locations - verify IDs exist in dropdown if available, otherwise set directly
      if (validLocationIds.length > 0) {
        const setWorkLocations = () => {
          if (this.workLocations.length > 0) {
            // Verify IDs exist in workLocations dropdown
            const verifiedIds = validLocationIds.filter((id: number) =>
              this.workLocations.some((loc) => loc.id === id)
            );
            // Set verified IDs if found, otherwise set all valid IDs
            const idsToSet =
              verifiedIds.length > 0 ? verifiedIds : validLocationIds;

            // Ensure selected locations are in visibleLocations for display
            idsToSet.forEach((id: number) => {
              const location = this.workLocations.find((loc) => loc.id === id);
              if (
                location &&
                !this.visibleLocations.some((loc) => loc.id === id)
              ) {
                this.visibleLocations.push(location);
              }
            });

            // Use setValue with emitEvent false to avoid triggering listeners
            this.talentForm
              .get("workLocation")
              ?.setValue(idsToSet, { emitEvent: false });
            // Trigger change detection to update the UI
            this.cdr.detectChanges();
          } else {
            // If workLocations not loaded yet, set IDs directly
            this.talentForm
              .get("workLocation")
              ?.setValue(validLocationIds, { emitEvent: false });
            this.cdr.detectChanges();
          }
        };

        // If workLocations haven't loaded yet, wait and retry with longer delay
        if (this.workLocations.length === 0) {
          setTimeout(() => {
            setWorkLocations();
          }, 800);
        } else {
          // Ensure visibleLocations is initialized
          if (this.visibleLocations.length === 0) {
            this.initializeLazyLocations();
          }
          // Set values after a small delay to ensure component is ready
          setTimeout(() => {
            setWorkLocations();
          }, 100);
          1;
        }
      }
    }

    // Fill experience
    if (orderData.experience) {
      // Map experience format to dropdown value
      const experienceValue = this.mapExperienceToValue(orderData.experience);
      if (experienceValue) {
        this.talentForm.patchValue({ yearOfExperience: experienceValue });
      }
    }

    // Fill currency (but not salary values)
    if (orderData.currency) {
      this.talentForm.patchValue({
        currentSalaryCurrency: orderData.currency,
        salaryExpectationCurrency: orderData.currency,
      });
      this.selectedCurrency = orderData.currency;
    }

    // Fill work mode
    if (orderData.work_mode) {
      this.talentForm.patchValue({ workMode: orderData.work_mode });
    }

    // Fill languages
    if (orderData.language_skills && Array.isArray(orderData.language_skills)) {
      this.fillLanguagesFromArray(orderData.language_skills);
    }

    // Fill remarks
    if (orderData.remarks) {
      this.talentForm.patchValue({ remarks: orderData.remarks });
    }
  }

  mapExperienceToValue(experience: string): string | null {
    // Map various experience formats to dropdown values
    const expLower = experience.toLowerCase();

    // Handle ranges like "10-15 Years" -> map to "10+"
    if (
      expLower.includes("10-") ||
      expLower.includes("10 to") ||
      expLower.includes("10+") ||
      expLower.includes("10 plus")
    ) {
      return "10+";
    } else if (expLower.includes("5-10") || expLower.includes("5 to 10")) {
      return "5-10";
    } else if (expLower.includes("3-5") || expLower.includes("3 to 5")) {
      return "3-5";
    } else if (expLower.includes("1-3") || expLower.includes("1 to 3")) {
      return "1-3";
    } else if (expLower.includes("0-1") || expLower.includes("0 to 1")) {
      return "0-1";
    }

    // Try to match exact value
    const matched = this.experienceYears.find(
      (exp) =>
        exp.value === experience ||
        exp.label === experience ||
        exp.value === expLower ||
        exp.label.toLowerCase() === expLower
    );
    return matched ? matched.value : null;
  }

  fillLanguagesFromArray(languageSkills: any[]) {
    // Clear existing languages
    while (this.languagesFormArray.length > 0) {
      this.languagesFormArray.removeAt(0);
    }

    // Parse language_skills array which appears to be alternating [language, proficiency, language, proficiency, ...]
    // Or it could be structured differently
    if (languageSkills.length >= 2) {
      // Check if it's alternating pattern
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

        // Check if proficiency exists
        const proficiencyObj = this.languageProficiency.find(
          (prof) =>
            prof.label === proficiency ||
            prof.value === proficiency ||
            prof.label?.toLowerCase() === proficiency?.toLowerCase() ||
            prof.value?.toLowerCase() === proficiency?.toLowerCase()
        );

        if (languageObj && proficiencyObj) {
          const languageForm = this.createLanguageForm();
          languageForm.patchValue({
            language: languageObj.language,
            proficiency: proficiencyObj.value || proficiencyObj.label,
          });
          this.languagesFormArray.push(languageForm);
        } else if (languageObj) {
          // If only language found, add with empty proficiency
          const languageForm = this.createLanguageForm();
          languageForm.patchValue({
            language: languageObj.language,
            proficiency: proficiency || "",
          });
          this.languagesFormArray.push(languageForm);
        }

        i += 2; // Move to next pair
      }
    }

    // If no languages were added, add one empty form
    if (this.languagesFormArray.length === 0) {
      this.languagesFormArray.push(this.createLanguageForm());
    }
  }

  onSubmit() {
    if (this.talentForm.invalid) {
      this.talentForm.markAllAsTouched();
      this.toast.add({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please fill all required fields before submitting.",
      });
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent double submission
    }

    this.isSubmitting = true;
    const formValue = this.talentForm.value;

    // Transform languages array to flat array format [language, proficiency, language, proficiency, ...]
    const languageKnown: string[] = [];
    if (formValue.languages && Array.isArray(formValue.languages)) {
      formValue.languages.forEach((lang: any) => {
        if (lang.language) {
          languageKnown.push(lang.language);
        }
        if (lang.proficiency) {
          languageKnown.push(lang.proficiency);
        }
      });
    }

    // Convert notice period to number
    let noticePeriod = 0;
    if (formValue.noticePeriod) {
      const noticePeriodStr = formValue.noticePeriod.toString().toLowerCase();
      if (noticePeriodStr === "immediate") {
        noticePeriod = 0;
      } else if (noticePeriodStr.includes("week")) {
        const weeks = parseInt(noticePeriodStr.match(/\d+/)?.[0] || "0", 10);
        noticePeriod = weeks * 7;
      } else if (noticePeriodStr.includes("month")) {
        const months = parseInt(noticePeriodStr.match(/\d+/)?.[0] || "0", 10);
        noticePeriod = months * 30;
      } else {
        noticePeriod = parseInt(noticePeriodStr.match(/\d+/)?.[0] || "0", 10);
      }
    }

    // Transform work_type to lowercase with underscore
    let workType = formValue.workType?.toLowerCase().replace(/\s+/g, "_") || "";

    // Transform work_mode to lowercase
    let workMode = formValue.workMode?.toLowerCase() || "";

    // Convert years_of_experience to string (extract number from value like "5-10" -> "5" or use as is)
    //let yearsOfExperience = formValue.yearOfExperience || "";
    // if (yearsOfExperience.includes("-")) {
    //   // Extract first number from range like "5-10" -> "5"
    //   const match = yearsOfExperience.match(/^(\d+)/);
    //   yearsOfExperience = match ? match[1] : yearsOfExperience;
    // } else if (yearsOfExperience.includes("+")) {
    //   // Extract number from "10+" -> "10"
    //   const match = yearsOfExperience.match(/^(\d+)/);
    //   yearsOfExperience = match ? match[1] : yearsOfExperience;
    // }

    // Prepare work_locations array (ensure it's an array of IDs)
    let workLocationsArray: number[] = [];
    if (formValue.workLocation) {
      if (Array.isArray(formValue.workLocation)) {
        workLocationsArray = formValue.workLocation
          .map((loc: any) =>
            typeof loc === "number" ? loc : parseInt(loc, 10)
          )
          .filter((id: number) => !isNaN(id));
      } else {
        // Single value - convert to number if it's an ID
        const locationId =
          typeof formValue.workLocation === "number"
            ? formValue.workLocation
            : parseInt(formValue.workLocation, 10);
        if (!isNaN(locationId)) {
          workLocationsArray = [locationId];
        }
      }
    }

    // Clean phone number (remove country code prefix and non-digits, keep only digits)
    let phoneNumber = formValue.phoneNo?.number.toString() || "";
    // Remove all non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, "");

    // Prepare payload
    const payload: any = {
      talent_id: parseInt(formValue.talentId, 10),
      order_id: formValue.orderId,
      employer_id: this.employerId || formValue.employerId,
      company_id: this.companyId || formValue.companyId,
      company_name: this.companyName || formValue.companyId,
      candidate_name: formValue.candidateName,
      email: formValue.email,
      phone: formValue.phoneNo?.number,
      phone_code: formValue.phoneNo?.dialCode,
      profile_url: formValue.profileUrl,
      position: formValue.position,
      years_of_experience: formValue.yearOfExperience,
      work_locations: workLocationsArray,
      current_salary_currency: formValue.currentSalaryCurrency,
      current_salary: formValue.currentSalary,
      expected_salary_currency: formValue.salaryExpectationCurrency,
      expected_salary: formValue.salaryExpectation,
      work_mode: workMode,
      work_type: workType,
      notice_period: noticePeriod,
      //status: 1,
      //validation_status: formValue.validationStatus,
      status: formValue.talentStatus,
      language_known: languageKnown,
      remarks: formValue.remarks || "",
    };

    this.recruitmentService.mapTalent(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response?.status) {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response?.message || "Talent mapped successfully",
          });
          // Navigate to delivered talents list page on success
          this.router.navigate(["/requirement/delivered-talents-list"]);
        } else {
          this.isSubmitting = false;
          // Handle error response - message can be string or object
          let errorMessage = "Failed to map talent";

          if (response?.message) {
            if (typeof response.message === "string") {
              errorMessage = response.message;
            } else if (typeof response.message === "object") {
              // Handle field-specific errors (e.g., duplicate language errors)
              const errorMessages: string[] = [];
              Object.keys(response.message).forEach((field) => {
                const fieldErrors = response.message[field];
                if (Array.isArray(fieldErrors)) {
                  errorMessages.push(...fieldErrors);
                } else if (typeof fieldErrors === "string") {
                  errorMessages.push(fieldErrors);
                }
              });
              errorMessage =
                errorMessages.length > 0
                  ? errorMessages.join(". ")
                  : "Validation error occurred";
            }
          }

          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;

        // Handle error response - message can be string or object
        let errorMessage = "Failed to map talent. Please try again.";

        if (err?.error?.message) {
          if (typeof err.error.message === "string") {
            errorMessage = err.error.message;
          } else if (typeof err.error.message === "object") {
            // Handle field-specific errors (e.g., duplicate language errors)
            const errorMessages: string[] = [];
            Object.keys(err.error.message).forEach((field) => {
              const fieldErrors = err.error.message[field];
              if (Array.isArray(fieldErrors)) {
                errorMessages.push(...fieldErrors);
              } else if (typeof fieldErrors === "string") {
                errorMessages.push(fieldErrors);
              }
            });
            errorMessage =
              errorMessages.length > 0
                ? errorMessages.join(". ")
                : "Validation error occurred";
          }
        } else if (err?.error?.status === false && err?.error?.message) {
          // Handle case where error is in err.error.message object
          if (typeof err.error.message === "object") {
            const errorMessages: string[] = [];
            Object.keys(err.error.message).forEach((field) => {
              const fieldErrors = err.error.message[field];
              if (Array.isArray(fieldErrors)) {
                errorMessages.push(...fieldErrors);
              } else if (typeof fieldErrors === "string") {
                errorMessages.push(fieldErrors);
              }
            });
            errorMessage =
              errorMessages.length > 0
                ? errorMessages.join(". ")
                : "Validation error occurred";
          }
        }

        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
        });
      },
    });
  }

  // ==================== Custom Job Title ====================

  confirmationPanel(event: any): void {
    const buttonElement = event.target.closest("button");
    const inputGroup = buttonElement?.parentElement;
    const inputElement = inputGroup?.querySelector("input") as HTMLInputElement;
    const title = inputElement?.value?.trim() || "";

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to add this custom title?",
      accept: () => {
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
        this.recruitmentService.createPositionTitle(customTitle).subscribe({
          next: (response: any) => {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: "Custom title added successfully",
            });
            // Reload positions
            this.recruitmentService.getDropdownData().subscribe((res) => {
              this.positions = res.positions || [];
              this.initializeLazyPositions();
              // Set the newly created position as selected
              const newPosition =
                response.title || response.position_title || title;
              if (newPosition) {
                this.talentForm.get("position")?.setValue(newPosition);
              }
            });
            if (inputElement) {
              inputElement.value = "";
            }
          },
          error: (error: any) => {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: error?.error?.message || "Failed to add custom title",
            });
          },
        });
      },
      reject: () => {
        event.preventDefault();
      },
    });
  }

  focusInput(inputElement: HTMLInputElement): void {
    setTimeout(() => {
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }

  getAvailableLanguages(languageIndex: number): any[] {
    const languagesArray = this.languagesFormArray; // Direct access, no parameter needed
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

  ngOnDestroy() {
    if (this.loadPositionsTimeout) {
      clearTimeout(this.loadPositionsTimeout);
    }
    if (this.loadLocationsTimeout) {
      clearTimeout(this.loadLocationsTimeout);
    }
  }
}
