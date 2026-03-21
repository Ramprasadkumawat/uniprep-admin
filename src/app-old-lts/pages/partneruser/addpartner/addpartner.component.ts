import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { Accordion, AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable, Subject, delay } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
// import { error } from 'console';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MarketingorgService } from '../marketingorg.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
// import { exit } from 'process';
import { SubscriberService } from '../../subscribers/subscriber.service';
import { DatePickerModule } from 'primeng/datepicker';
import { LocationService } from 'src/app/location.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CountryISO, SearchCountryField, NgxIntlTelInputModule, } from "ngx-intl-tel-input";
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'uni-addpartner',
    templateUrl: './addpartner.component.html',
    styleUrls: ['./addpartner.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, DatePickerModule,
        NgxIntlTelInputModule, MultiSelectModule
    ],
    providers: [ConfirmationService]
})
export class AddpartnerComponent implements OnInit {

  users$!: Observable<{ users: User[], totalRecords: number }>;
  form: FormGroup;
  dragForm: FormGroup;
  filterForm: FormGroup;
  submitted: boolean = false;
  isShowBoxDisplay: boolean = true;
  isFileDisplay: boolean = false;
  isProgressDisplay: boolean = false;
  activeIndex = -1;
  btnTxt = "Submit";
  instituteList = []
  pageSize = 10;
  instituteTypeId = [];
  continueImportPopUp = "none";
  successPopUp = "none";
  contractOptions = [
    { value: 1, label: 'Signed' },
    { value: 0, label: 'Not Signed' },
  ];
  registeredStatus = [
    { value: 1, label: 'Registered' },
    { value: 0, label: 'Yet To Register' },
  ]
  InstituteOption = [];
  instituteDropDownList = [];
  coBranding: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  DistrictOptions = [];
  DistrictOptions2 = [];
  homeCountries: any[] = [];
  visibleHomeCountries: any[] = [];
  locationList: any[] = [];
  locationListFilter: any[] = [];
  preferredCountry: any;
  SearchCountryField = SearchCountryField;
  assignToDropdownList: any[] = [];
  inputValue: string = '';
  statusOptions = [
    { label: 'Very Happy', value: 'Very Happy' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Unhappy', value: 'Unhappy' },
    { label: 'No Status', value: 'No Status' },
    { label: 'RNR', value: 'RNR' },
    { label: 'Busy', value: 'Busy' },
    { label: 'Not Interested', value: 'Not Interested' },
  ];
  // Lazy-loading batch size for dropdowns
  private readonly COUNTRY_BATCH_SIZE = 100;
  private searchSubject = new Subject<string>();
  constructor(private router: Router, private subscriberService: SubscriberService, private fb: FormBuilder, private toaster: MessageService, private service: MarketingorgService, private confirmationService: ConfirmationService, private cdr: ChangeDetectorRef,
    private locationService: LocationService
  ) {
    this.form = fb.group({
      inst_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      website: [
        "",
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/)?' + // optional protocol
            '(([\\da-z.-]+)\\.([a-z.]{2,6}))' + // domain
            '(\\:[0-9]{1,5})?' + // optional port
            '(\\/[^\\s]*)?$' // optional path
          ),
        ],
      ],
      home_country: ['', [Validators.required]],
      Institute_type: ['', [Validators.required]],
      org_rep_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      org_rep_designation: ['', [Validators.required]],
      collegesId: [''],
      email: ['', [Validators.required, Validators.email]],
      location: ["", [Validators.required]]
    });
    this.filterForm = fb.group({
      inst_name: [''],
      home_country: [''],
      Institute_type: [''],
      fromDate: [''],
      toDate: [''],
      email: [''],
      phone_number: [''],
      location: [''],
      co_branding: [''],
      registered_user: [''],
      paid_users: [''],
      fromDateFollowUp: [''],
      toDateFollowUp: [''],
      onBoardedFrom: [''],
      onBoardedFromTo: [''],
      assign_to: [''],
      remarks: ['']
    });
    this.dragForm = fb.group({
      dragExcel: ['']
    })
  }
  samplePath: any;
  readme: any;
  ngOnInit(): void {
    this.getMarketingList(this.data);
    this.getInstitute();
    this.getHomeCountryList();
    this.getAssignTo();
    this.initializePhoneNo();

    // Debounce search input before calling API
    this.searchSubject
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value: string) => {
        this.inputValue = value;
        this.filterFormValue();
      });
  }
  onChangeContact(event: any) {
    /* this.showContactErrorIcon = false;
     if (event?.target?.value?.length != 0) {
       this.showContactErrorIcon = true;
       this.registerFormInvalid = true;
       
     } else {
       this.validNumberRequired = false;
       this.registerFormInvalid = false;
     }
       */
  }
  initializePhoneNo() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
      this.preferredCountry = data.country_code.toLocaleLowerCase()
    });
  }
  getHomeCountryList() {
    this.subscriberService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homeCountries = [{ country: "Select", code: null }, ...res];
        this.initializeLazyHomeCountries();
        this.form.get('home_country')?.reset();
      },
      (error: any) => {
        this.toaster.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }

  // ========= Lazy loading for Home Countries =========
  private currentHomeCountryIndex = 0;
  private allHomeCountriesLoaded = false;

  private initializeLazyHomeCountries() {
    this.currentHomeCountryIndex = 0;
    this.allHomeCountriesLoaded = false;
    this.visibleHomeCountries = [];

    if (this.homeCountries.length > 0) {
      const firstBatch = this.homeCountries.slice(0, this.COUNTRY_BATCH_SIZE);
      this.visibleHomeCountries = [...firstBatch];
      this.currentHomeCountryIndex = this.COUNTRY_BATCH_SIZE;
    }
  }

  loadHomeCountriesLazy(event: any) {
    if (!this.allHomeCountriesLoaded) {
      this.loadNextHomeCountryBatch();
    }
  }

  private loadNextHomeCountryBatch() {
    if (this.currentHomeCountryIndex >= this.homeCountries.length) {
      this.allHomeCountriesLoaded = true;
      return;
    }

    const nextBatch = this.homeCountries.slice(
      this.currentHomeCountryIndex,
      this.currentHomeCountryIndex + this.COUNTRY_BATCH_SIZE
    );

    this.visibleHomeCountries = [...this.visibleHomeCountries, ...nextBatch];
    this.currentHomeCountryIndex += this.COUNTRY_BATCH_SIZE;
  }

  resetField() {
    var data = {
    };
    this.filterForm.reset();
    this.locationListFilter = [];
    this.getMarketingList(this.data);
  }
  get f() {
    return this.form.controls;
  }

  changeCountry(event: any) {
    // if (this.form.get('home_country').value == 122) {
    // this.form.get('location')?.enable();
    // this.form.get('location')?.reset();
    if (this.form.get('home_country').value) {
      this.locationList = [];
      var data = {
        country_id: this.form.get('home_country').value
      }
      this.locationService.getAllCountryLocation(data).subscribe(
        (res: any) => {
          this.locationList = res.data;
        },
        (error: any) => {
          this.toaster.add({
            severity: "warning",
            summary: "Warning",
            detail: error.error.message,
          });
        }
      );
    }

    // }
    // else {
    //   this.locationList = [{ id: 0, district: "Others", state: "Others" }];
    //   this.form.get('location').setValue(0);
    //   this.form.get('location')?.disable();
    // }
  }
  formReset() {
    this.form.reset();
    this.locationList = [];
  }
  changeCountryFilter(event: any) {
    this.locationListFilter = [];
    console.log(this.filterForm.value.home_country);
    
    if (this.filterForm.value.home_country.length > 0) {
      var data = {
        country_id: this.filterForm.get('home_country').value
      }
      this.locationService.getAllCountryLocation(data).subscribe(
        (res: any) => {
          this.locationListFilter = res.data;
        },
        (error: any) => {
          this.toaster.add({
            severity: "warning",
            summary: "Warning",
            detail: error.error.message,
          });
        }
      );
    }
  }

  getInstitute() {
    this.instituteDropDownList = []
    this.service.getInstitute().subscribe((res) => {
      this.instituteDropDownList = res.data
    })
  }

  datacount: number = 0;
  leadsDatacount: number = 0;
  paidLeadsDatacount: number = 0;
  totalRevenueCount: number = 0;
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    var data = {
      Organization_name: this.filterForm.value.inst_name,
      email: this.filterForm.value.email,
      phone: this.filterForm.value.phone_number,
      country: this.filterForm.value.home_country,
      location: this.filterForm.value.location,
      Source_type: this.filterForm.value.Institute_type,
      co_branding: this.filterForm.value.co_branding,
      register_user: this.filterForm.value.registered_user,
      paid_user: this.filterForm.value.paid_users,
      usersFrom: this.filterForm.value.fromDate ? this.changeYearFormat(this.filterForm.value.fromDate) : null,
      usersTo: this.filterForm.value.toDate ? this.changeYearFormat(this.filterForm.value.toDate) : null,
      follow_upFrom: this.filterForm.value.fromDateFollowUp ? this.changeYearFormat(this.filterForm.value.fromDateFollowUp) : null,
      follow_upTo: this.filterForm.value.toDateFollowUp ? this.changeYearFormat(this.filterForm.value.toDateFollowUp) : null,
      on_boardedFrom: this.filterForm.value.onBoardedFrom ? this.changeYearFormat(this.filterForm.value.onBoardedFrom) : null,
      on_boardedTo: this.filterForm.value.onBoardedFromTo ? this.changeYearFormat(this.filterForm.value.onBoardedFromTo) : null,
      remarks: this.filterForm.value.remarks,
      assign_to: this.filterForm.value.assign_to,
      page: this.page,
      perPage: this.pageSize,
    }
    this.getMarketingList(data);
  }
  indexChange(eve: number) {
    this.activeIndex = eve;
  }
  submitForm() {
    this.submitted = true;
    var data = {
      institutename: this.form.value.inst_name,
      organization_email: this.form.value.email,
      phonenumber: this.form.value.phone_number.number,
      website: this.form.value.website,
      institutetype: this.form.value.Institute_type,
      home_country_id: this.form.value.home_country,
      location: this.form.value.location ? this.form.value.location : 0,
      organization_representative_name: this.form.value.org_rep_name,
      representative_designation: this.form.value.org_rep_designation,
      phone: this.form.value.phone_number
    }
    this.service.addMarketing(data).subscribe((res) => {
      if (res) {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.ngOnInit()
        this.form.reset()
        this.submitted = false;
      }
    })
  }
  filterFormValue() {
    this.instituteList = []
    const formData = this.filterForm.value;
    var data: any = {
      Organization_name: this.filterForm.value.inst_name,
      email: this.filterForm.value.email,
      phone: this.filterForm.value.phone_number,
      country: this.filterForm.value.home_country,
      location: this.filterForm.value.location,
      Source_type: this.filterForm.value.Institute_type,
      co_branding: this.filterForm.value.co_branding,
      register_user: this.filterForm.value.registered_user,
      paid_user: this.filterForm.value.paid_users,
      usersFrom: this.filterForm.value.fromDate ? this.changeYearFormat(this.filterForm.value.fromDate) : null,
      usersTo: this.filterForm.value.toDate ? this.changeYearFormat(this.filterForm.value.toDate) : null,
      follow_upFrom: this.filterForm.value.fromDateFollowUp ? this.changeYearFormat(this.filterForm.value.fromDateFollowUp) : null,
      follow_upTo: this.filterForm.value.toDateFollowUp ? this.changeYearFormat(this.filterForm.value.toDateFollowUp) : null,
      on_boardedFrom: this.filterForm.value.onBoardedFrom ? this.changeYearFormat(this.filterForm.value.onBoardedFrom) : null,
      on_boardedTo: this.filterForm.value.onBoardedFromTo ? this.changeYearFormat(this.filterForm.value.onBoardedFromTo) : null,
      remarks: this.filterForm.value.remarks,
      assign_to: this.filterForm.value.assign_to,
      inputValue: this.inputValue,
      page: this.page,
      perPage: this.pageSize,
    }

    this.service.getMarketingList(data).subscribe((res) => {
      this.datacount = res.count;
      this.instituteList = res.marketing;
    })
  }
  getMarketingList(data: any) {
    this.service.getMarketingList(data).subscribe((res) => {
      this.instituteList = []
      this.datacount = res.count
      this.instituteList = res.marketing
      this.samplePath = res.samplepath
      this.readme = res.readme ? res.readme : 0;
      this.leadsDatacount = res.leadsDatacount ? res.leadsDatacount : 0;
      this.paidLeadsDatacount = res.paidLeadsDatacount ? res.paidLeadsDatacount : 0;
      this.totalRevenueCount = res.totalRevenueCount ? res.totalRevenueCount : 0;
    });

  }
  changeYearFormat(value) {
    const inputDateString = value;
    const inputDate = new Date(inputDateString);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  }
  instituteEdit: any;
  deleteMarketing(eve: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        var data = {
          marketingsId: eve
        }
        this.service.deleteMarketing(data).subscribe((res) => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: 'Removed Successfully' });
          this.ngOnInit()
        });
      }
    });
  }

  // Function to open the modal
  closeImportPopUp() {
    this.isProgressDisplay = false;
    this.isFileDisplay = false;
    this.selectedFile = null;
    this.isShowBoxDisplay = true;
    this.continueImportPopUp = 'none'
  }

  openImportPopUp() {
    this.continueImportPopUp = "block";
  }

  closeSuccess() {
    this.successPopUp = "none"
  }


  onDragOver(event: Event) {
    event.preventDefault();
  }

  onFileDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.handleFiles(files);
  }
  progress: any;
  path: any
  docid: any;
  onFileSelected(event: Event) {
    this.isShowBoxDisplay = false;
    this.isProgressDisplay = true;
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.handleFiles(files);
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }

    const file: File = input.files[0];
    this.service.temporaryUpload(this.selectedFile).subscribe(event => {
      var progress: any = Math.round((100 * event.loaded) / event.total);
      progress = JSON.stringify(progress);
      if (progress == 100) {
        this.progress = progress + "%";
        setInterval(() => {
          this.isProgressDisplay = false;
          this.isFileDisplay = true;
        }, 3000)
        return;
      }

      if (event.body != null) {
        this.docid = event.body;
        this.service.getTemporaryDocument(event.body).subscribe(response => {
          this.path = response;
        });
      }

    });


  }

  handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        // Valid CSV file, you can proceed with your logic
        // Access the file using file variable
      } else {
        alert('Only .csv file formats are supported for uploads.');
      }
    }
  }
  selectedFile: any;
  importDataCount: any;
  dragSubmit() {
    if (this.selectedFile) {
      this.service.studentBulkUpload(this.docid).subscribe((response: any) => {
        this.selectedFile = null;
        if (response.success) {
          this.importDataCount = response.totalcount
          this.successPopUp = "block"
          this.continueImportPopUp = 'none'
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.ngOnInit()
        }
        else {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      });
    }
    this.isProgressDisplay = false;
    this.isFileDisplay = false;
    this.isShowBoxDisplay = true;
  }

  previewFile() {
    window.open(this.path, '_blank');
  }

  downloadSampleReport() {
    window.open(this.samplePath, '_blank');
  }

  deleteFile() {
    this.isProgressDisplay = false;
    this.isFileDisplay = false;
    this.selectedFile = null;
    this.isShowBoxDisplay = true;
    this.service.deleteTemporaryDocument(this.docid).subscribe(response => {
    });
  }
  downloadReadme() {
    window.open(this.readme, '_blank');
  }
  editInstituteDetails(eve: any) {
    this.cdr.detectChanges();
    this.activeIndex = 0;
    this.btnTxt = "Update";
    this.DistrictOptions = []
    if (eve.homecountry == 122) {

    }
    else {
      this.form.get('region').setValue(0);
      this.DistrictOptions = [{ id: 0, district: "Others" }]
      this.form.get('district').setValue(0);

    }
    this.form.patchValue({
      inst_name: eve.institutename,
      phone_number: eve.phone,
      website: eve.website,
      home_country: eve.homecountry,
      region: eve.region,
      district: eve.district,
      pincode: eve.pincode,
      contract_status: eve.contractstatus,
      Institute_type: eve.institutetype,
    });
    this.instituteEdit = eve.id;
  }
  openOrganizationDetails(id: any) {
    this.router.navigate(['/organization-details', id]);
  }
  getAssignTo() {
    this.assignToDropdownList = []
    this.service.getAssignTo().subscribe((res: any) => {
      this.assignToDropdownList = [
        { id: 0, name: 'Not Assigned' },
        ...res.data
      ];
    })
  }
  exportList() {
    this.service.exportMarketing().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
  onInputChange(value: string): void {
    // Push value into debounced stream; API will be called after 2s of inactivity
    this.searchSubject.next(value);
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
  redirectStudentList(id: number) {
    this.router.navigate(['subscribers', id]);
  }
  redirectPaidStudentList(id: number) {
    this.router.navigate(['subscribers', id], {
      queryParams: { type: 'PaidLeads' }
    });
  }
}


