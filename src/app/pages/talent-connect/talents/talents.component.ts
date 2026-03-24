import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Contributor } from "src/app/@Models/contributions-program.model";
import { City, Countries } from "src/app/@Models/country.model";
import { ContributionsService } from "../../contributions-program/contributions-program.service";
import { TalentConnectService } from "../talent-connect.service";
import { StatusType } from "../verify-company-account/verify-company-account.component";
import { Table } from "primeng/table";
import { Meta } from "@angular/platform-browser";
import { SocialShareService } from "../../service/social-share.service";
import { PopoverModule } from 'primeng/popover';
import { ActivatedRoute } from "@angular/router";
import { SearchCountryField } from "ngx-intl-tel-input";


@Component({
  selector: "app-talents",
  templateUrl: "./talents.component.html",
  styleUrls: ["./talents.component.scss"],
  standalone: false
})
export class TalentsComponent implements OnInit {
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
  @ViewChild('shareOverlay') shareOverlay!: PopoverModule;
  meta = inject(Meta);
  introductionVideo: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  placementForm: FormGroup = new FormGroup({});
  isAddPlacementVisible: boolean = false;
  placementFormSubmitted: boolean = false;
  selectedEmpId: number | null = null;
  companyList: any[] = [];
  @ViewChild('placementFormElm') placementFormElm!: ElementRef;
  companyId: number | null = null;
  companySeen: number | null = null;
  jobId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private fb: FormBuilder,
    private toastr: MessageService,
    private talentConnectService: TalentConnectService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.candidates = [];
    this.initForms();
    this.loadDropdownData();
    //this.loadEmployeeData();

    this.filterForm.get('campus_hiring_country')?.valueChanges.subscribe((countryId: number) => {
      this.filteredinstitutelist = this.campushiringinstitutelist.filter(
        (inst) => inst.country == countryId
      );
      this.filterForm.get('campus_hiring_institute')?.setValue(null);
    });
    this.getCompanies();

    this.route.queryParams.subscribe(params => {
      this.companyId = params['company_id'];
      this.companySeen = params['company_seen'];
      this.jobId = params['job_id'];
      this.loadEmployeeData({},this.companyId, this.companySeen, this.jobId);
    });
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
      hired: [null],
      interview_ready: [null],
      employer_seen: [null],
      talent_id: [null],
      email: [null],
      phone: [null],
      phonecode: [null],
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
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];
  verifiedOptions = [
    { label: 'Non Verified', value: '0' },
    { label: 'Verified ', value: '1' },
  ]
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
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

  loadEmployeeData(params?: any, companyId?: any, companySeen?: any, jobId?: any): void {
    const data = {
      page: this.page,
      perpage: this.perPage,
      ...params,
      company_id: companyId || null,
      company_seen: companySeen || null,
      job_id: jobId || null,
    };
    this.talentConnectService.getAdmintalentConnectList(data).subscribe({
      next: (response) => {
        this.employeesList = response.students;
        this.totalEmployeeCount = response.totalcount;
      },
      error: (error) => { },
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
    this.loadEmployeeData({},this.companyId, this.companySeen, this.jobId);
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
        error: (error) => { },
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
        stars.push('pi-star-fill');
      } else {
        stars.push('pi-star');
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
      error: (error) => { },
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
      error: (error) => { },
    });
  }

  rejectstudent(student: any) {
    this.talentConnectService.rejectStudentProfile({ id: student }).subscribe({
      next: (response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Rejected Successfully",
        });
        this.loadEmployeeData();
      },
      error: (error) => { },
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
    const phone =this.filterForm.value.phone?.number
    const phonecode = this.filterForm.value.phone?.dialCode
    this.filterForm.value.phone = phone
    this.filterForm.value.phonecode = phonecode
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

  hideModal() { }
  selectedCardIds: number[] = [];
  onSelectionChange(): void {
    this.selectedCount = this.selectedEmployees.length;
  }
  oncardSelectAll() {
    const allIds = this.employeesList.map((c) => c.id);

    const isAllSelected = allIds.every(id => this.selectedCardIds.includes(id));

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
      error: (error) => { },
    });
  }
  exportTalentList() {
    const formValues = this.filterForm.value;

    const data = {
      ...formValues,
      export: 'csv',
      page: this.page,
      perpage: this.perPage,
    };

    this.talentConnectService.getExportTalentData(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'talent-connect-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      }
    });
  }

  shareQuestion(event: any, type: string, talent: any) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = 'https://employer.uniprep.ai' + '/talent/' + talent.uuid;
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }
  copyLink(event: any, talent: any) {
    event.stopPropagation();
    const textToCopy = encodeURI('https://employer.uniprep.ai' + '/talent/' + talent.uuid);
    this.socialShareService.copyQuestion(textToCopy, 'Job Link copied successfully');
  }

  getCompanies() {
    this.talentConnectService.getRegisteredCompanies().subscribe({
      next: res => {
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
    this.talentConnectService.updateSuccessPlacement({ ...formData, student_id: this.selectedEmpId }).subscribe({
      next: res => {
        this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.closePlacementModal();
        this.resetFilter();
      },
      error: err => {
        console.log(err?.message);
      }
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
        this.talentConnectService.deleteSuccessPlacement({ student_id: this.selectedEmpId }).subscribe({
          next: res => {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.closePlacementModal();
            this.resetFilter();
          },
          error: err => {
            console.log(err?.message)
          }
        })
      },
      reject: () => {
        this.selectedEmpId = null;
        this.toastr.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }
}
