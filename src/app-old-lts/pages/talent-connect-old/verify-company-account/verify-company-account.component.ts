import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Contributor } from 'src/app/@Models/contributions-program.model';
import { CityState, Countries } from 'src/app/@Models/country.model';
import { TalentConnectService } from '../talent-connect.service';
import { LocationService } from 'src/app/location.service';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { CompanySize, TalentEmployer } from 'src/app/@Models/talent-model';
import { environment } from '@env/environment';
import { debounceTime, Subject } from 'rxjs';

export enum StatusType {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'InActive'
}

@Component({
    selector: 'uni-verify-company-account',
    templateUrl: './verify-company-account.component.html',
    styleUrls: ['./verify-company-account.component.scss'],
    standalone: false
})

export class VerifyCompanyAccountComponent implements OnInit {
  employerList: TalentEmployer[] = [];
  statusTypesList = [{ id: 2, name: 'Pending Users' }, { id: 1, name: 'Approved Users' }, { id: 3, name: 'Rejected Users' }, { id: 4, name: 'Active Users' }, { id: 5, name: 'InActive Users' }]
  countryList: Countries[] = [];
  stateCityList: CityState[] = [];
  companySizeList: CompanySize[] = [];
  genderList = [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }];
  totalEmployerCount: number = 0;
  employerStatusCount: number = 0;
  first: number = 0;
  page: number = 1;
  pageSize: number = 10;
  activeIndex: number = 0;
  selectedInfo!: TalentEmployer;
  showModal: boolean = false;
  selectedStatus: { id: number, name: string } = { id: 2, name: 'Pending Users' };
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [CountryISO.India];
  form: FormGroup = new FormGroup({});
  submitted: boolean = false;
  filterForm: FormGroup = new FormGroup({});
  verifyForm: FormGroup = new FormGroup({});
  submittedVerify: boolean = false;
  selectedFile!: File;
  isEmployerImport: boolean = false;
  sampleDoc: string = `https://${environment.domain}/uniprepapi/storage/app/public/Imports/Employers/employers_import.csv`;
  searchText: string = '';
  searchSubject = new Subject<string>();
  showModalApprove: boolean = false;
  showRejectConfirmation: boolean = false;
  rejectOrActive: string;
  showRemarksDialog: boolean = false;
  addRemarksDialog: boolean = false;
  remarksForm: FormGroup;
  getRemarksList: any[] = [];
  statusOptions = [
    { label: 'Very Happy', value: 'Very Happy' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Unhappy', value: 'Unhappy' },
    { label: 'Not Interested', value: "Not Interested" },
    { label: 'Busy', value: "Busy" },
  ];
  filterStatusOptions = [
    { label: 'Very Happy', value: 'Very Happy' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Unhappy', value: 'Unhappy' },
    { label: 'No Status', value: 'No Status' },
    { label: 'RNR', value: 'RNR' },
    { label: 'Busy', value: 'Busy' },
    { label: 'Not Interested', value: 'Not Interested' },
  ];
  coBranding: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  assignToDropdownList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private toaster: MessageService,
    private talentConnectService: TalentConnectService,
    private locationService: LocationService
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      country_id: ['', Validators.required],
      location_id: ['', Validators.required],
      company_name: ['', Validators.required],
      company_designation: ['', Validators.required],
      company_website: ['', Validators.required],
    });

    this.filterForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      gender: [''],
      country_id: [''],
      location_id: [''],
      company_name: [''],
      company_designation: [''],
      company_website: [''],
      company_creation: [''],
      remarks: [''],
      assign_to: ['']
    });

    this.verifyForm = this.fb.group({
      company_size_id: [''],
      job_posting: [''],
      comments: [''],
    });
    this.remarksForm = this.fb.group({
      status: [''],
      followUp: [0],
      followUpDate: [''],
      followUpTime: [''],
      remarks: [''],
      rnr: [0]
    });
    this.searchSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.loadCompanyAccountList({ name: this.searchText });
    });
  }

  ngOnInit(): void {
    this.loadCompanyAccountList();
    this.getCountries();
    this.getCompanySizes();
    this.getAssignTo();
  }
  getAssignTo() {
    this.assignToDropdownList = []
    this.talentConnectService.getViewStudentAssignTo().subscribe((res: any) => {
      this.assignToDropdownList = [
        { id: 0, name: 'Not Assigned' },
        ...res.data
      ];
    })
  }
  loadCompanyAccountList(params?: any) {
    const data = {
      page: this.page,
      perpage: this.pageSize,
      status: this.selectedStatus.id,
      ...params
    }
    this.getEmployerList(data);
  }

  getEmployerList(value: any) {
    this.talentConnectService.getEmployersList(value).subscribe({
      next: response => {
        this.employerList = response.data;
        this.employerStatusCount = response.count;
        this.totalEmployerCount = response.total_count;
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  getCountries() {
    this.locationService.getWorldCountryList().subscribe({
      next: res => {
        this.countryList = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  getStates(countryId: number) {
    this.locationService.getWorldCityStateList(countryId).subscribe({
      next: res => {
        this.stateCityList = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  getCompanySizes() {
    this.talentConnectService.getCompanySize().subscribe({
      next: response => {
        this.companySizeList = response;
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  onChangeCountry(event: any) {
    if (event.value) {
      this.getStates(event.value);
    }
    else {
      this.stateCityList = [];
    }
  }
  isShowApproveStatus: number = 2;
  selectStatus(status: any) {
    console.log(status);
    this.isShowApproveStatus = status.id

    if (this.selectedStatus.name !== status.name) {
      this.selectedStatus = status;
      this.filterForm.reset();
      this.loadCompanyAccountList();
    }
  }

  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.name && !formData.email && !formData.phone && !formData.gender && !formData.country_id && formData.location_id && formData.company_name && formData.company_designation && formData.company_website) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    if (formData.phone) {
      formData.phone_number = formData.phone.number;
      formData.phone_country_code = formData.phone.dialCode;
      formData.phone = null;
    }
    this.page = 1;
    this.loadCompanyAccountList(formData);
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.loadCompanyAccountList(this.filterForm.value);
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 10;
    this.loadCompanyAccountList({});
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  exportEmployerList() {
    const data = {
      page: this.page,
      perpage: this.pageSize,
      status: this.selectedStatus.id,
      ...this.filterForm.value
    }
    this.talentConnectService.exportEmployee(data).subscribe({
      next: res => {
        this.toaster.add({ severity: "success", summary: "Success", detail: res.message });
        window.open(res.file, '_blank');
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  importEmployer() {
    this.selectedFile = null;
    this.isEmployerImport = true;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.talentConnectService.importEmployer(this.selectedFile).subscribe({
        next: response => {
          this.toaster.add({ severity: "success", summary: "Success", detail: response.message });
          this.selectedFile = null;
          this.closeModal();
          this.resetFilter()
        },
        error: err => {
          const apiError = err?.error;
          const validationDetail =
            Array.isArray(apiError?.errors) && apiError.errors.length
              ? ` Row ${apiError.errors[0]?.row}: ${(apiError.errors[0]?.errors || []).join(", ")}`
              : "";
          this.toaster.add({
            severity: "error",
            summary: "Import Failed",
            detail: (apiError?.message || err?.message || "Failed to import employers") + validationDetail,
          });
        }
      });
    } else {
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please choose file!" });
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  closeModal() {
    this.isEmployerImport = false;
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = this.form.value;
    formData.phone_number = formData.phone.number;
    formData.phone_country_code = formData.phone.dialCode;
    formData.phone = null;
    this.talentConnectService.addEmployer(formData).subscribe({
      next: res => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.form.reset();
        this.submitted = false;
        this.resetFilter();
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  get vF() {
    return this.verifyForm.controls;
  }

  editEmployer(employer: TalentEmployer) {
    this.verifyForm.patchValue({
      company_size_id: employer.company_size_id,
      job_posting: employer.job_posting,
      comments: employer.comments,
    })
    this.selectedInfo = employer;
    this.submittedVerify = false;
    this.showModal = true;
  }
  viewInformation(employer: TalentEmployer) {
    this.selectedInfo = employer;
    this.showModalApprove = true;
  }
  submitVerifyForm() {
    this.submittedVerify = true;
    if (this.verifyForm.invalid) {
      return;
    }
    this.talentConnectService.approveEmployer({ id: this.selectedInfo.id, ...this.verifyForm.value }).subscribe({
      next: res => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.showModal = false;
        this.verifyForm.reset();
        this.submittedVerify = false;
        this.showRejectConfirmation = false;
        this.resetFilter();
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  onRejectEmployer() {
    this.talentConnectService.rejectEmployer({ id: this.selectedInfo.id, ...this.verifyForm.value }).subscribe({
      next: res => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.showModal = false;
        this.verifyForm.reset();
        this.submittedVerify = false;
        this.showRejectConfirmation = false;
        this.resetFilter();
      },
      error: err => {
        console.error(err?.message);
      }
    });
  }

  rejectOrApproveEmployee(employer: TalentEmployer, text: string) {
    this.rejectOrActive = text;
    this.selectedInfo = employer;
    this.showModal = true;
    // this.showRejectConfirmation = true;
  }
  // cancelRejectOrApproveEmployee() {
  //   this.showRejectConfirmation = false;
  // }
  // confirmRejectOrApproveEmployee() {
  //   if (this.rejectOrActive == 'Reject') {
  //     this.onRejectEmployer();
  //   } else {
  //     this.submitVerifyForm();
  //   }
  // }
  // add remarks
  submitFormRemarks() {
    if (this.remarksForm.value.rnr == 0) {
      if (!this.remarksForm.value.status) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Select Status" });
        return
      }
    }
    if (this.remarksForm.value.followUp == 1) {
      if (!this.remarksForm.value.followUpDate) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Select Follow Up Date" });
        return;
      }
      if (!this.remarksForm.value.followUpTime) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Select Follow Up Time" });
        return;
      }
    }
    if (!this.remarksForm.value.remarks) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Type Remarks" });
      return;
    }
    var data = {
      employer_id: this.selectedInfo.id,
      status_option: this.remarksForm.value.rnr ? this.remarksForm.value.rnr : this.remarksForm.value.status,
      follow_up: this.remarksForm.value.followUp,
      follow_date: this.remarksForm.value.followUpDate,
      follow_time: this.remarksForm.value.followUpTime ? this.convertTimeTo12HourFormat(this.remarksForm.value.followUpTime) : null,
      remarks: this.remarksForm.value.remarks,
    }
    this.talentConnectService.addFollowUpRemarks(data).subscribe((res) => {
      if (res) {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.remarksForm.reset()
        this.addRemarksDialog = false
        this.remarksForm.get('followUpTime')?.disable();
        this.remarksForm.get('followUpDate')?.disable();
        this.remarksForm.get('status')?.enable();
        this.remarksForm.patchValue({
          followUp: 0
        });
      }
    })
  }
  convertTimeTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':').map(Number);

    if (isNaN(hour) || isNaN(minute)) {
      return ''; // handle invalid input
    }

    const date = new Date();
    date.setHours(hour, minute, 0); // set time

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    return date.toLocaleTimeString('en-US', options);
  }
  onRnrChange(event: any): void {
    const isChecked = event.target.checked;
    this.remarksForm.patchValue({ rnr: isChecked ? "RNR" : null });
    if (isChecked) {
      this.remarksForm.get('status')?.disable();
    } else {
      this.remarksForm.get('status')?.enable();
    }
  }
  onFollowUpChange(event: any): void {
    const selectedValue = event.value;
    if (selectedValue === 1) {
      this.remarksForm.get('followUpTime')?.enable();
      this.remarksForm.get('followUpDate')?.enable();
    } else {
      this.remarksForm.get('followUpTime')?.disable();
      this.remarksForm.get('followUpDate')?.disable();
    }
  }
  addRemarksDialogPopUp(employer: TalentEmployer) {
    this.selectedInfo = employer;
    this.addRemarksDialog = true;
  }
  showRemarksDialogPopUp(employer: TalentEmployer) {
    this.selectedInfo = employer;
    this.showRemarksDialog = true;
    this.getRemarksFollowUpList()
  }
  getRemarksFollowUpList() {
    this.getRemarksList = []
    var data = {
      employer_id: this.selectedInfo.id
    }
    this.talentConnectService.getRemarksFollowUpList(data).subscribe((res: any) => {
      this.getRemarksList = res.data
    })
  }
  getStatusColor(status: string | null): string {
    switch (status) {
      case 'Very Happy':
        return '#609923';
      case 'Happy':
        return '#8bc246';
      case 'Busy':
        return '#0054b4';
      case 'Neutral':
        return '#7e7e7e';
      case 'Unhappy':
        return '#f28b82';
      case 'Not Interested':
        return '#d93025';
      case 'RNR':
        return '#ff9800';
      default:
        return 'transparent';
    }
  }
}
