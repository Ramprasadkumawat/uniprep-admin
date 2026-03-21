import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Contributor } from 'src/app/@Models/contributions-program.model';
import { ContributionsService } from '../contributions-program.service';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { Countries,State,City } from 'src/app/@Models/country.model';

interface ContributorList {
  totalstudent: number;
  amount: number;
  name: string;
  email: string;
  phonenumber: string;
  payment_id: string;
  payment_method: string;
  payment_date: Date;
  id: string;
}

@Component({
    selector: 'uni-contributors-list',
    templateUrl: './contributors-list.component.html',
    styleUrls: ['./contributors-list.component.scss'],
    standalone: false
})
export class ContributorsListComponent implements OnInit {

  contributions = [];
  filterForm: FormGroup = new FormGroup({});
  // locationList: Locations[] = [];
  submitted: boolean = false;
  first: number = 0;
  page: number = 1;
  rows: number = 10;
  activeIndex: number = 0;
  contributionsList: Contributor[] = [];
  contributionsCount: number = 0;
  filterAmountList: { amount: number }[] = [];
  studentList: { label: string, value: number }[] = [
    { label: "1-10", value: 10 }, { label: "10-50", value: 50 }, { label: "50-100", value: 100 }, { label: "100-1000", value: 1000 }, { label: "1000+", value: 50000 },
  ];
  paymentMethodList: { id: number, name: string }[] = [
    { id: 1, name: 'RazorPay' }, { id: 2, name: 'Cash' }, { id: 3, name: 'Bank transfer' }
  ]
  filterPaymentMethodList: { name: string }[] = [{ name: 'RazorPay' }, { name: 'Strapi' }];
  @ViewChild('formElm') formElm!: ElementRef;
  generalReportListData: any[];
  listRowCount: number;
  selectedStatus: any;
  isEditFormOpen: string = 'none';
  minTotalStudent: number = 2;
  contributorsId: number = 0;
  contributionTierList: { id: number, contributortier: string, totalstudents: number }[] = [];
  isAddEditContribution: boolean = false;
  form: FormGroup = new FormGroup({});
  SearchCountryField = SearchCountryField;
  preferredCountry: any;
  pageSize: number = 10;
  contributorObj = {};
  costPerStudent: number = 1000;
  regionList: State[] = [];
  locationLists: City[] = [];
  countryList: Countries[] = [];

  constructor(
    private fb: FormBuilder,
    private contributionsService: ContributionsService,
    private toaster: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.filterForm = this.fb.group({
      totalstudent: [''],
      country: [''],
      state: [''],
      location: [''],
      paymentmethod: [''],
      validfrom: [null],
      validto: [null],
    });
    this.form = this.fb.group({
      contributorID: [''],
      totalstudent: ['', Validators.required],
      amount: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required],
      location: ['', Validators.required],
      paymentmethod: ['', Validators.required],
      paymentid: ['', Validators.required],
      paymentdate: ['', Validators.required],
    });
    this.onChangesFormValue();
  }

  ngOnInit(): void {
    this.getOptionsList();
    this.loadContributorList();
    this.getCountries();
  }

  getCountries() {
    this.contributionsService.getWorldCountries().subscribe({
      next: res => {
        this.countryList = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }
  getStates(countryId: number){
    this.contributionsService.getWorldStates(countryId).subscribe({
      next: res => {
        this.regionList = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  getCities(stateId: number){
    this.contributionsService.getWorldCities(stateId).subscribe({
      next: res => {
        this.locationLists = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  onChangeCountry(event: any) {
    if (event.value) {
      this.getStates(event.value);
    }
    else {
      this.regionList = [];
      this.locationLists = [];
    }
  }

  onChangeState(event: any) {
    if (event.value) {
      this.getCities(event.value);
    }
    else {
      this.locationLists = [];
    }
  }

  loadContributorList() {
    this.contributorObj = {
      page: this.page,
      perpage: this.pageSize
    }
    this.getContributorList(this.contributorObj);
  }

  getContributorList(value: any) {
    this.contributionsService.getContributionsList(value).subscribe({
      next: response => {
        this.contributionsList = response.data;
        this.contributionsCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  getOptionsList() {
    // this.sessionService.getRegion().subscribe(res => {
    //   this.regionList = res;
    // });
    this.contributionsService.getContributorDropDownList().subscribe(data => {
      this.contributionTierList = data.contributiontier;
      this.filterAmountList = data.amounts;
    });
  }

  get f() {
    return this.form.controls;
  }

  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.totalstudent && !formData.state && !formData.location && !formData.paymentmethod && !formData.country && !(formData.validfrom || formData.validto)) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    var data = {
      page: 1,
      perpage: this.pageSize,
      ...formData,
    };
    this.contributorObj = data;
    this.getContributorList(this.contributorObj);
  }

  exportContributionList() {
    let data = {
      contribution_table: 1,
      ...this.filterForm.value,
    };
    this.contributionsService.exportContributions(data).subscribe((res: any) => {
      this.contributionsService.downloadFile(res.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "constributions.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    })
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getContributorList({ ...this.contributorObj, page: this.page, perpage: this.pageSize });
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 10;
    this.contributorObj = {
      page: 1,
      perpage: this.pageSize
    }
    this.getContributorList(this.contributorObj);
  }

  onShowAddContribution() {
    this.form.reset();
    this.isAddEditContribution = true;
  }

  onShowEditContribution(data: any) {
    this.getStates(data.country_id);
    this.getCities(data.region_id);
    this.contributorsId = data.id;
    const paymentTime = new Date(data.payment_time);
    const localDate = new Date(paymentTime.getTime() - paymentTime.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    this.form.patchValue({
      contributorID: data.contributorID,
      totalstudent: data.totalstudent,
      amount: data.amount,
      name: data.name,
      email: data.email,
      phone: data.phonenumber,
      country: data.country_id,
      region: data.region_id,
      location: data.location_id,
      paymentmethod: Number(data.payment_method),
      paymentid: data.payment_id,
      paymentdate: localDate,
    });

    this.isAddEditContribution = true;
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = this.form.value;
    if (typeof formData.phone !== 'string') {
      formData.country_code = formData.phone?.dialCode;
      formData.phone = formData.phone?.number;
    }
    if (this.contributorsId) {
      this.contributionsService.updateContributor({ ...formData, id: this.contributorsId, isadmin: 1 }).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.closeModal();
        this.resetFilter();
        this.contributorsId = 0;
      });
    }
    else {
      this.contributionsService.addContributor({ ...formData, isadmin: 1 }).subscribe({
        next: res => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.closeModal();
          this.resetFilter();
        },
        error: err => {
          console.log(err?.message);
        }
      });
    }
  }

  closeModal() {
    this.form.reset();
    this.formElm?.nativeElement?.reset();
    this.submitted = false;
    this.isAddEditContribution = false;
  }

  generateInvoice(data: Contributor) {
    this.contributionsService.generateInvoice(data.contributor_id).subscribe({
      next: res => {
        const selectedItem = this.contributionsList.find(item => item.id == data.id);
        selectedItem.invoice_link = res.invoice_link;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  downloadInvoice(data: Contributor) {
    window.open(data.invoice_link, '_blank');
  }

  deleteContribution(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete? ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.contributionsService.deteteContributor({ id: this.contributorsId, isadmin: 1 }).subscribe({
          next: res => {
            this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.closeModal();
            this.resetFilter();
          },
          error: err => {
            console.log(err?.message)
          }
        })
      },
      reject: () => {
        this.toaster.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }

  updateAmount() {
    const amount = this.form.get('totalstudent').value ?? 0 * this.costPerStudent;
    this.form.get('amount').setValue(amount);
  }

  onChangesFormValue() {
    this.form.controls.totalstudent.valueChanges.subscribe(value => {
      this.form.get('amount').setValue(value * this.costPerStudent);
    });
    // this.filterForm.controls['country'].valueChanges.subscribe((value: State) => {
    //   if (value) {
    //     this.contributionsService.getWorldStates(value.id).subscribe({
    //       next: res => {
    //         this.regionList = res;
    //       },
    //       error: err => {
    //         console.log(err?.error?.message);
    //       }
    //     });
    //   }
    //   else {
    //     this.regionList = [];
    //   }
    // });

    // this.filterForm.controls['state'].valueChanges.subscribe((value: Locations) => {
    //   if (value) {
    //     this.contributionsService.getWorldCities(value.id).subscribe({
    //       next: res => {
    //         this.locationLists = res;
    //       },
    //       error: err => {
    //         console.log(err?.error?.message);
    //       }
    //     });
    //   }
    //   else {
    //     this.locationLists = [];
    //   }
    // });
    // this.form.controls['region'].valueChanges.subscribe((value) => {
    //   if (value) {
    //     this.sessionService.getLocationByRegion(value.toString()).subscribe({
    //       next: res => {
    //         this.locationList = res;
    //       },
    //       error: err => {
    //         console.log(err?.error?.message);
    //       }
    //     });
    //   }
    //   else {
    //     this.locationList = [];
    //   }
    // });
  }
}
