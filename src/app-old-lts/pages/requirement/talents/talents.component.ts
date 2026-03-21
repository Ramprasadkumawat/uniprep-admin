import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Contributor } from "src/app/@Models/contributions-program.model";
import { City, Countries } from "src/app/@Models/country.model";
import { ContributionsService } from "../../contributions-program/contributions-program.service";
import { TalentConnectService } from "../../talent-connect/talent-connect.service";
import { StatusType } from "../../talent-connect/verify-company-account/verify-company-account.component";
import { Table } from "primeng/table";
import { Meta } from "@angular/platform-browser";
import { SocialShareService } from "../../service/social-share.service";
import { PopoverModule } from "primeng/popover";
import { RecruitmentService } from "../recruitment.service";

@Component({
  selector: "uni-requirement-talents",
  templateUrl: "./talents.component.html",
  styleUrls: ["./talents.component.scss"],
  standalone: false,
})
export class RequirementTalentsComponent implements OnInit {
  employersList = [];
  candidates: any[] = [];
  employerForm: FormGroup;
  filterForm: FormGroup;
  selectedCard: string = "list";
  submitted = false;
  showModal: boolean = false;
  selectedCount: number = 0;
  viewOptions: { label: string; value: string }[] = [
    { label: "List View", value: "list" },
    { label: "Card View", value: "card" },
  ];

  profileData: any = {};

  // Table data
  employeesList: any[] = [];
  totalEmployeeCount: number = 0;

  page: number = 1;
  perPage: number = 10;
  first: number = 0;
  // For checkboxes and selection
  selectedEmployees: any[] = [];

  @ViewChild("employerFormElm") employerFormElm: any;
  @ViewChild("dt") table: Table;
  socialShareService = inject(SocialShareService);
  @ViewChild("shareOverlay") shareOverlay!: PopoverModule;
  meta = inject(Meta);
  introductionVideo: any[] = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  placementForm: FormGroup = new FormGroup({});
  isAddPlacementVisible: boolean = false;
  placementFormSubmitted: boolean = false;
  selectedEmpId: number | null = null;
  companyList: any[] = [];
  @ViewChild("placementFormElm") placementFormElm!: ElementRef;

  // Map Order Dialog
  mapOrderDialogVisible: boolean = false;
  companiesList: any[] = [];
  selectedCompanyId: number | null = null;
  ordersList: any[] = [];
  isLoadingOrders: boolean = false;
  selectedOrderForMapping: any = null;
  mappedTalentsByOrder: Map<number, number[]> = new Map(); // requirement_id -> array of talent IDs
  alreadyMappedTalentsList: any[] = [];
  newTalentsToMapList: any[] = [];
  talentRemarks: Map<number, string> = new Map(); // talent_id -> remarks

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private fb: FormBuilder,
    private toastr: MessageService,
    private talentConnectService: TalentConnectService,
    private confirmationService: ConfirmationService,
    private recruitmentService: RecruitmentService
  ) {}

  ngOnInit(): void {
    this.candidates = [];
    this.initForms();
    this.loadDropdownData();
    this.loadEmployeeData();

    this.filterForm
      .get("campus_hiring_country")
      ?.valueChanges.subscribe((countryId: number) => {
        this.filteredinstitutelist = this.campushiringinstitutelist.filter(
          (inst) => inst.country == countryId
        );
        this.filterForm.get("campus_hiring_institute")?.setValue(null);
      });
    this.getCompanies();
  }
  initForms(): void {
    this.filterForm = this.fb.group({
      candidate_name: [null],
      nationality: [[]],
      candidate_country: [[]],
      location: [[]],
      gender: [null],
      institute_name: [null],
      campus_hiring_country: [null],
      campus_hiring_institute: [[]],
      qualification: [[]],
      fieldofstudy: [[]],
      experience: [[]],
      career_status_id: [[]],
      job_title: [null],
      currency_id: [null],
      min_salary: [null],
      max_salary: [null],
      langauge_id: [[]],
      career_interest_id: [[]],
      work_location_id: [null],
      employment_type: [null],
      workplace_type_id: [null],
      relocate: [null],
      verification_status: [null],
      profile_completion: [null],
      introduction_video: [null],
    });

    this.placementForm = this.fb.group({
      company_id: [null, Validators.required],
      designation: [null, Validators.required],
    });
  }

  // Form getter for validation
  get f() {
    return this.employerForm.controls;
  }
  // preferredLocation: boolean = false;
  preferredLocationList: any[] = [];
  getCityCountryList(search?: string, isSearchPreferred?: boolean) {
    this.talentConnectService.getCityCountries(search).subscribe({
      next: (response) => {
        if (isSearchPreferred == undefined) {
          this.locations = response;
          //this.preferredLocationList = response;
        } else {
          isSearchPreferred
            ? (this.preferredLocationList = response)
            : (this.locations = response);
        }
      },
    });
  }
  getWorkPlaces() {
    this.talentConnectService.getWorkPlaces().subscribe({
      next: (response) => {
        this.locations = response;
        this.preferredLocationList = response;
      },
    });
  }
  getCountries() {
    this.talentConnectService.getGlobalPresenceList().subscribe({
      next: (response) => {
        this.countryList = response;
      },
    });
  }
  currencies: any[] = [];
  careerInterests: any[] = [];
  fieldsOfStudy: any[] = [];
  hobbies: any[] = [];
  jobTitles: any[] = [];
  languagelist: any[] = [];
  locations: any[] = [];
  professionalStrengths: any[] = [];
  qualifications: any[] = [];
  softSkills: any[] = [];
  profileCompletionOptions: any[] = [];
  verificationStatusOptions: any[] = [];
  nationalityOptions: any[] = [];
  locationOptions: any[] = [];
  preferredEmploymentType: any = [];
  preferredWorkplaceType: any = [];
  careerStatus: any = [];
  totalYearExperienceList: any = [];
  genderOptions: any[] = [];
  graduationYears: any[] = [];
  nationalityList: any = [];
  countryList: any = [];
  campushiringcountrylist: any = [];
  campushiringinstitutelist: any = [];
  filteredinstitutelist: any = [];
  profileCompletionOption = [
    { label: "0-10%", value: "0-10" },
    { label: "11-20%", value: "11-20" },
    { label: "21-30%", value: "21-30" },
    { label: "31-40%", value: "31-40" },
    { label: "41-50%", value: "41-50" },
    { label: "51-60%", value: "51-60" },
    { label: "61-70%", value: "61-70" },
    { label: "71-80%", value: "71-80" },
    { label: "81-90%", value: "81-90" },
    { label: "91-100%", value: "91-100" },
  ];
  verifiedOptions = [
    { label: "Non Verified", value: "0" },
    { label: "Verified ", value: "1" },
  ];
  loadDropdownData(): void {
    this.getWorkPlaces();
    this.getCountries();
    this.talentConnectService.getStudentProfilesDropDownList().subscribe({
      next: (response) => {
        this.currencies = response.currencies;
        this.careerInterests = response.career_interests;
        this.jobTitles = response.job_titles;
        this.languagelist = response.languages;
        this.hobbies = response.hobbies;
        this.professionalStrengths = response.professional_strengths;
        this.qualifications = response.qualifications;
        this.softSkills = response.soft_skills;
        this.fieldsOfStudy = response.fields_of_study;
        this.preferredWorkplaceType = response.preferred_workplace_type;
        this.preferredEmploymentType = response.preferred_employment_type;
        this.totalYearExperienceList = response.total_years_experience;
        this.careerStatus = response.career_status;
        this.graduationYears = response.graduation_years;
        this.genderOptions = response.gender;
        this.nationalityList = response.nationalites;
        this.campushiringcountrylist = response.institute_countries;
        this.campushiringinstitutelist = response.institutes;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadEmployeeData(params?: any): void {
    const data = {
      page: this.page,
      perpage: this.perPage,
      ...params,
    };
    this.talentConnectService.getAdmintalentConnectList(data).subscribe({
      next: (response) => {
        this.employeesList = response.students;
        this.totalEmployeeCount = response.totalcount;
      },
      error: (error) => {},
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
  submitEmployerForm(): void {
    this.submitted = true;

    if (this.employerForm.invalid) {
      return;
    }
    this.loadEmployeeData(this.employerForm.value);
  }

  resetForm(): void {
    this.submitted = false;
    this.employerForm.reset();
    this.filterForm.reset();
    this.employerForm.patchValue({
      currency: "INR",
    });
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.loadEmployeeData();
  }

  extractFileName(url: string): string {
    if (!url) return "";
    let fileName = url.split("/").pop() || ""; // "1742015348_cv_letter.pdf"
    return fileName;
  }

  getProficiencyRating(proficiency: string): number {
    // Convert proficiency text to a rating number
    switch (proficiency) {
      case "Beginner":
        return 1;
      case "Elementary":
        return 2;
      case "Intermediate":
        return 3;
      case "Advanced":
        return 4;
      case "Fluent":
        return 5;
      default:
        return 3; // Default to intermediate
    }
  }

  openView(url: string) {
    window.open(url, "_blank");
  }

  viewMoreInfo(employee: any): void {
    this.talentConnectService
      .getAdminStudentProfile({ student_id: employee.id })
      .subscribe({
        next: (response) => {
          this.showModal = true;
          this.profileData = response.data[0];
        },
        error: (error) => {},
      });
  }
  starsArray(rating: string): string[] {
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
  verifyselected() {
    let paramdata = { students: "" };
    if (this.selectedCard === "card") {
      if (this.selectedCardIds.length > 0) {
        paramdata.students = this.selectedCardIds.join(",");
      } else {
        return;
      }
    } else {
      if (this.selectedEmployees.length > 0) {
        paramdata.students = this.selectedEmployees.map((c) => c.id).join(",");
      } else {
        return;
      }
    }
    this.talentConnectService.selectedverifyStudent(paramdata).subscribe({
      next: (response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Verified Successfully",
        });
        this.loadEmployeeData();
      },
      error: (error) => {},
    });
  }
  verifystudent(student: any) {
    this.talentConnectService.verifyStudent({ id: student }).subscribe({
      next: (response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Verified Successfully",
        });
        this.loadEmployeeData();
      },
      error: (error) => {},
    });
  }
  exportEmployeeList(): void {
    console.log("Exporting employee list");
    this.messageService.add({
      severity: "info",
      summary: "Info",
      detail: "Exporting employee list",
    });
  }

  filterEmployees(): void {
    this.loadEmployeeData(this.filterForm.value);
  }

  resetFilter(): void {
    this.page = 1;
    this.perPage = 10;
    this.filterForm.reset();
    this.filterForm.patchValue({
      currency: "INR",
    });
    this.loadEmployeeData();
  }

  onCompanyConnect(candidateId: number): void {
    console.log("Company Connect clicked for candidate:", candidateId);
  }

  onJobApplied(candidateId: number): void {
    console.log("Job Applied clicked for candidate:", candidateId);
  }

  hideModal() {}
  selectedCardIds: number[] = [];
  onSelectionChange(): void {
    this.selectedCount = this.selectedEmployees.length;
  }
  oncardSelectAll() {
    const allIds = this.employeesList.map((c) => c.id);

    const isAllSelected = allIds.every((id) =>
      this.selectedCardIds.includes(id)
    );

    if (isAllSelected) {
      // Unselect all
      this.selectedCardIds = [];
    } else {
      // Select all
      this.selectedCardIds = [...allIds];
    }
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
      error: (error) => {},
    });
  }
  exportTalentList() {
    const formValues = this.filterForm.value;

    const data = {
      ...formValues,
      export: "csv",
      page: this.page,
      perpage: this.perPage,
    };

    this.talentConnectService.getExportTalentData(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "talent-connect-export.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Download failed", err);
      },
    });
  }

  shareQuestion(event: any, type: string, talent: any) {
    const socialMedias: { [key: string]: string } =
      this.socialShareService.socialMediaList;
    const url = "https://employer.uniprep.ai" + "/talent/" + talent.uuid;
    this.meta.updateTag({ property: "og:url", content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, "_blank");
  }
  copyLink(event: any, talent: any) {
    event.stopPropagation();
    const textToCopy = encodeURI(
      "https://employer.uniprep.ai" + "/talent/" + talent.uuid
    );
    this.socialShareService.copyQuestion(
      textToCopy,
      "Job Link copied successfully"
    );
  }

  getCompanies() {
    this.talentConnectService.getRegisteredCompanies().subscribe({
      next: (res) => {
        this.companyList = res.data;
      },
    });
  }

  openPlacementModal(empId: number) {
    this.selectedEmpId = empId;
    this.isAddPlacementVisible = true;
  }

  get pf() {
    return this.placementForm.controls;
  }

  submitPlacementForm() {
    this.placementFormSubmitted = true;
    if (this.placementForm.invalid) {
      return;
    }
    const formData = this.placementForm.value;
    this.talentConnectService
      .updateSuccessPlacement({ ...formData, student_id: this.selectedEmpId })
      .subscribe({
        next: (res) => {
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.closePlacementModal();
          this.resetFilter();
        },
        error: (err) => {
          console.log(err?.message);
        },
      });
  }

  closePlacementModal() {
    this.placementForm.reset();
    this.placementFormElm?.nativeElement?.reset();
    this.placementFormSubmitted = false;
    this.isAddPlacementVisible = false;
    this.selectedEmpId = null;
  }

  deletePlacement(event: any, empId: number) {
    this.selectedEmpId = empId;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.talentConnectService
          .deleteSuccessPlacement({ student_id: this.selectedEmpId })
          .subscribe({
            next: (res) => {
              this.toastr.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.closePlacementModal();
              this.resetFilter();
            },
            error: (err) => {
              console.log(err?.message);
            },
          });
      },
      reject: () => {
        this.selectedEmpId = null;
        this.toastr.add({
          severity: "error",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }

  mapOrder() {
    this.mapOrderDialogVisible = true;
    this.loadCompaniesList();
  }

  loadCompaniesList() {
    this.recruitmentService.getCompaniesList().subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.companiesList = res.data;
        } else {
          this.companiesList = [];
        }
      },
      error: (err) => {
        console.error("Error fetching companies:", err);
        this.toastr.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load companies list",
        });
      },
    });
  }

  onCompanyChange(event: any) {
    this.selectedCompanyId = event.value;
    this.ordersList = [];
    if (this.selectedCompanyId) {
      this.loadOrdersByCompany(this.selectedCompanyId);
    }
  }

  loadOrdersByCompany(companyId: number) {
    this.isLoadingOrders = true;
    const filterData: any = {
      page: 1,
      perpage: 1000,
      company_id: companyId,
    };
    this.recruitmentService.getHiringSupportTransactions(filterData).subscribe({
      next: (res: any) => {
        this.isLoadingOrders = false;
        if (
          res.status &&
          res.data &&
          res.data.transactions &&
          Array.isArray(res.data.transactions)
        ) {
          // Filter transactions by company_id if API doesn't filter
          let filteredTransactions = res.data.transactions;
          if (companyId) {
            filteredTransactions = res.data.transactions.filter(
              (transaction: any) => {
                // Check if transaction has company_id or if any requirement has matching company_id
                return (
                  transaction.company_id === companyId ||
                  (transaction.requirements &&
                    transaction.requirements.some(
                      (req: any) => req.company_id === companyId
                    ))
                );
              }
            );
          }
          // Transform the nested structure to flat array
          this.ordersList = this.transformOrdersData(filteredTransactions);
        } else {
          this.ordersList = [];
        }
      },
      error: (err) => {
        this.isLoadingOrders = false;
        console.error("Error fetching orders:", err);
        this.toastr.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load orders",
        });
      },
    });
  }

  transformOrdersData(transactions: any[]): any[] {
    const flatOrders: any[] = [];
    if (transactions && Array.isArray(transactions)) {
      transactions.forEach((transaction: any) => {
        const requirements = transaction.requirements || [];
        requirements.forEach((requirement: any) => {
          flatOrders.push({
            transaction_id: transaction.transaction_id,
            requirement_id: requirement.requirement_id,
            order_id: requirement.order_id || "001",
            jobTitle: requirement.jobTitle,
            company_name: transaction.company_name,
            vacancies: requirement.no_of_vacancies || 0,
            talentRequirement: requirement.profilesRequired || 0,
            amount: requirement.amount || transaction.amount || 0,
            is_payment_completed: transaction.is_payment_completed,
            created_at: requirement.created_at,
          });
        });
      });
    }
    return flatOrders;
  }

  closeMapOrderDialog() {
    this.mapOrderDialogVisible = false;
    this.selectedCompanyId = null;
    this.ordersList = [];
    this.selectedOrderForMapping = null;
    this.alreadyMappedTalentsList = [];
    this.newTalentsToMapList = [];
    this.talentRemarks.clear();
  }

  selectOrder(order: any) {
    this.selectedOrderForMapping = order;

    // Load already mapped talents from API
    this.loadMappedTalentsDetails();

    // Load newly selected talents
    this.loadNewTalentsList();
  }

  loadMappedTalentsDetails() {
    if (!this.selectedOrderForMapping || !this.selectedCompanyId) {
      this.alreadyMappedTalentsList = [];
      return;
    }

    const order = this.selectedOrderForMapping;
    const apiPayload = {
      company_id: this.selectedCompanyId,
      order_id: order.requirement_id,
    };

    // Call API to get mapped talents
    this.recruitmentService.getMappedTalents(apiPayload).subscribe({
      next: (res: any) => {
        if (
          res?.status &&
          res?.data?.talents &&
          Array.isArray(res.data.talents)
        ) {
          // Transform API response to match the format expected by the UI
          this.alreadyMappedTalentsList = res.data.talents.map(
            (talent: any) => ({
              id: talent.student_id,
              full_name: talent.full_name,
              image: talent.image,
              job_title: talent.preferred_employment_type?.[0] || "N/A",
              district:
                talent.preferred_work_location_id?.[0]?.split(",")[0]?.trim() ||
                "",
              state:
                talent.preferred_work_location_id?.[0]?.split(",")[1]?.trim() ||
                "",
              country:
                talent.preferred_work_location_id?.[0]?.split(",")[2]?.trim() ||
                talent.preferred_work_location_id?.[0] ||
                "N/A",
              total_years_of_experience: talent.years_of_experience || "N/A",
              expected_salary: talent.expected_salary || "N/A",
              email: talent.email,
              phone: talent.phone,
              uuid: talent.uuid,
            })
          );
        } else {
          this.alreadyMappedTalentsList = [];
        }
      },
      error: (err: any) => {
        console.error("Error fetching mapped talents:", err);
        this.alreadyMappedTalentsList = [];
        // Don't show error toast as this is called automatically
      },
    });
  }

  loadNewTalentsList() {
    // Get currently selected talents
    const selectedTalentIds =
      this.selectedCard === "list"
        ? this.selectedEmployees.map((emp: any) => emp.id)
        : this.selectedCardIds;

    if (!selectedTalentIds || selectedTalentIds.length === 0) {
      this.newTalentsToMapList = [];
      return;
    }

    // Filter employees list to get new talents
    this.newTalentsToMapList = this.employeesList.filter((emp: any) =>
      selectedTalentIds.includes(emp.id)
    );
  }

  removeTalentFromNewList(talent: any) {
    // Remove from newTalentsToMapList
    this.newTalentsToMapList = this.newTalentsToMapList.filter(
      (t: any) => t.id !== talent.id
    );

    // Remove remarks for this talent
    this.talentRemarks.delete(talent.id);

    // Also remove from selectedEmployees or selectedCardIds
    if (this.selectedCard === "list") {
      this.selectedEmployees = this.selectedEmployees.filter(
        (emp: any) => emp.id !== talent.id
      );
      this.selectedCount = this.selectedEmployees.length;
    } else {
      this.selectedCardIds = this.selectedCardIds.filter(
        (id: number) => id !== talent.id
      );
    }

    this.toastr.add({
      severity: "info",
      summary: "Talent Removed",
      detail: `${talent.full_name} has been removed from the list`,
    });
  }

  sendTalentsToOrder() {
    if (!this.selectedOrderForMapping) {
      return;
    }

    const order = this.selectedOrderForMapping;
    const requirementId = order.requirement_id;

    // Check if there are any new talents to send
    if (!this.newTalentsToMapList || this.newTalentsToMapList.length === 0) {
      this.toastr.add({
        severity: "warn",
        summary: "No Talents Selected",
        detail: "Please select at least one talent to map to this order",
      });
      return;
    }

    // Get already mapped talents count from API response
    const alreadyMappedCount = this.alreadyMappedTalentsList.length;
    const totalRequirement = order.talentRequirement || 0;
    const newTalentsCount = this.newTalentsToMapList.length;
    const remainingSlots = totalRequirement - alreadyMappedCount;

    // Get already mapped talent IDs for validation
    const alreadyMapped = this.alreadyMappedTalentsList.map(
      (talent: any) => talent.id
    );

    // Check if requirement is already fulfilled
    if (remainingSlots <= 0) {
      this.toastr.add({
        severity: "warn",
        summary: "Requirement Fulfilled",
        detail: `This order already has ${totalRequirement} talents mapped. Maximum requirement reached.`,
      });
      return;
    }

    // Get IDs of new talents to map
    const newTalentIds = this.newTalentsToMapList.map(
      (talent: any) => talent.id
    );

    // Filter out talents that are already mapped to this requirement
    const newTalentsToMap = newTalentIds.filter(
      (talentId: number) => !alreadyMapped.includes(talentId)
    );

    if (newTalentsToMap.length === 0) {
      this.toastr.add({
        severity: "warn",
        summary: "Already Mapped",
        detail: "All selected talents are already mapped to this order",
      });
      return;
    }

    // Check if adding new talents would exceed the requirement
    // This is the key validation: already sent + new to send should not exceed total requirement
    const totalAfterMapping = alreadyMappedCount + newTalentsToMap.length;
    if (totalAfterMapping > totalRequirement) {
      const canMap = totalRequirement - alreadyMappedCount;
      this.toastr.add({
        severity: "error",
        summary: "Exceeds Requirement",
        detail: `Cannot send ${newTalentsToMap.length} talent(s). Already sent: ${alreadyMappedCount}, Total requirement: ${totalRequirement}. You can only send ${canMap} more talent(s).`,
      });
      return;
    }

    // Prepare talents array with remarks
    const talentsPayload = newTalentsToMap.map((talentId: number) => {
      return {
        talent_id: talentId,
        remarks: this.talentRemarks.get(talentId) || "",
      };
    });

    // Prepare API payload
    const apiPayload = {
      order_id: order.transaction_id || order.requirement_id, // Use transaction_id as order_id
      talents: talentsPayload,
    };

    // Call API to map talents
    this.recruitmentService.mapTalentsToOrder(apiPayload).subscribe({
      next: (res: any) => {
        // Refresh the orders list to update counts
        if (this.selectedCompanyId) {
          this.loadOrdersByCompany(this.selectedCompanyId);
        }

        // Update the already mapped talents list by calling API
        this.loadMappedTalentsDetails();

        // Clear selection
        if (this.selectedCard === "list") {
          this.selectedEmployees = [];
          this.selectedCount = 0;
        } else {
          this.selectedCardIds = [];
        }

        // Clear new talents list and remarks for sent talents
        this.newTalentsToMapList = [];
        // Clear remarks for sent talents
        newTalentsToMap.forEach((talentId: number) => {
          this.talentRemarks.delete(talentId);
        });

        // Calculate remaining count after mapping
        const updatedMappedCount = alreadyMappedCount + newTalentsToMap.length;
        const remaining = totalRequirement - updatedMappedCount;

        this.toastr.add({
          severity: "success",
          summary: "Talents Mapped",
          detail:
            res?.message ||
            `Successfully mapped ${newTalentsToMap.length} talent(s) to Order ${order.order_id}. ${remaining} remaining.`,
        });
      },
      error: (err: any) => {
        console.error("Error mapping talents to order:", err);
        this.toastr.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message ||
            "Failed to map talents to order. Please try again.",
        });
      },
    });
  }

  getRemainingCount(order: any): number {
    if (!order) return 0;
    // Use alreadyMappedTalentsList if this is the selected order, otherwise return 0
    if (
      this.selectedOrderForMapping &&
      this.selectedOrderForMapping.requirement_id === order.requirement_id
    ) {
      const totalRequirement = order.talentRequirement || 0;
      const mappedCount = this.alreadyMappedTalentsList.length;
      return Math.max(0, totalRequirement - mappedCount);
    }
    return order.talentRequirement || 0;
  }

  getMappedCount(order: any): number {
    if (!order) return 0;
    // Use alreadyMappedTalentsList if this is the selected order
    if (
      this.selectedOrderForMapping &&
      this.selectedOrderForMapping.requirement_id === order.requirement_id
    ) {
      return this.alreadyMappedTalentsList.length;
    }
    return 0;
  }

  getButtonTooltip(): string {
    if (!this.selectedOrderForMapping) {
      return "Please select an order";
    }
    if (this.newTalentsToMapList.length === 0) {
      return "Please select talents to send";
    }
    const alreadyMapped = this.getMappedCount(this.selectedOrderForMapping);
    const newCount = this.newTalentsToMapList.length;
    const total = this.selectedOrderForMapping.talentRequirement;
    const totalAfter = alreadyMapped + newCount;
    if (totalAfter > total) {
      return `Cannot send ${newCount} talent(s). Already sent: ${alreadyMapped}, Total requirement: ${total}. Exceeds by ${
        totalAfter - total
      }.`;
    }
    return `Send ${newCount} talent(s) to this order`;
  }
}
