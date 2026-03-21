import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { LocationService } from 'src/app/location.service';
import { SubscriberService } from '../../subscribers/subscriber.service';
import { MarketingorgService } from '../marketingorg.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
    selector: 'uni-add-organization-users',
    templateUrl: './add-organization-users.component.html',
    styleUrls: ['./add-organization-users.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, DialogModule,
        TextareaModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, DatePickerModule, ConfirmPopupModule, ButtonModule,
        FileUploadModule, NgxIntlTelInputModule
    ],
    providers: [ConfirmationService]
})
export class AddOrganizationUsersComponent implements OnInit {
  breadCrumbsName = "Organization Details"
  form: FormGroup;
  addUserForm: FormGroup;
  remarksForm: FormGroup;
  formCoBranding: FormGroup;
  instituteDropDownList: any[] = [];
  homeCountries: any[] = [];
  statuses = [];
  locationList: any[] = [];
  submitted: boolean = false;
  submittedUser: boolean = false;
  submitCoBranding: boolean = false;
  detailsUpdate: any = "Edit"
  coBranding: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  percentage: any[] = [
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 15, label: '15%' },
    { value: 20, label: '20%' },
    { value: 25, label: '25%' },
    { value: 30, label: '30%' },
    { value: 35, label: '35%' },
    { value: 40, label: '40%' },
    { value: 45, label: '45%' },
    { value: 50, label: '50%' },
    { value: 55, label: '55%' },
    { value: 60, label: '60%' },
  ];
  instituteDropDownListAddUser: any[] = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Representative' },
    { value: 3, label: 'Master' },
  ]
  assignToDropdownList: any[] = [];
  listDocumentData: any[] = [];
  btnTxt = "Add";
  users: any[] = [];
  first: number = 0;
  page: number = 1;
  pageSize = 10;
  usersCount: number = 0;
  showUploadDialog = false;
  selectedFile: File | null = null;
  fileInputDummy: any; // dummy binding just to support [(ngModel)]
  showRemarksDialog = false;
  statusOptions = [
    { label: 'Very Happy', value: 'Very Happy' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Neutral', value: 'Neutral' },
    { label: 'Unhappy', value: 'Unhappy' },
    { label: 'Not Interested', value: "Not Interested" },
    { label: 'Busy', value: "Busy" },
  ];
  orgId: string | null = null;
  instituteList: any[] = [];
  files: any = [];
  getRemarksList: any[] = [];
  renameDocValue: any = "";
  @ViewChild('fileUploadLogo') fileUpload!: FileUpload;
  @ViewChild('fileUploadIcon') fileUploadIcon!: FileUpload;
  @ViewChild('fileUploadDoc') fileUploadDoc!: FileUpload;
  showConfirmation = false;
  editingRenameId: number | null = null;
  selectedIds: number[] = [];
  showUserConfirmation: boolean = false;
  userDeleteId: number;
  preferredCountry: any;
  preferredCountryUser: any;
  SearchCountryField = SearchCountryField;
  coBrandingUpdate: any = "Edit"
  kycForm!: FormGroup;
  submittedKyc: boolean = false;
  btnKycSubmit: string = "Edit";
  isShoOnlyPartner: boolean = false;
  payoutList: any[] = [];
  datacount: number = 0;
  totalPayoutDue: number = 0;
  checkUpiValidity: boolean = false;
  isShowUploadDocButton: boolean = false;
  activeTabIndex: number = 0;
  constructor(private router: Router, private subscriberService: SubscriberService, private fb: FormBuilder, private toaster: MessageService, private service: MarketingorgService, private confirmationService: ConfirmationService, private cdr: ChangeDetectorRef,
    private locationService: LocationService, private route: ActivatedRoute) {
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
      home_country: ["", [Validators.required]],
      Institute_type: ['', [Validators.required]],
      org_rep_name: ['', [Validators.required]],
      org_rep_designation: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      location: ["", [Validators.required]],
      co_branding: [""],
      address: [""],
      assign_to: [""],
      org_id: [""]
    });
    this.addUserForm = fb.group({
      user_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userId: [''],
      email: ['', [Validators.required, Validators.email]],
      user_type: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
    this.remarksForm = this.fb.group({
      status: [''],
      followUp: [0],
      followUpDate: [''],
      followUpTime: [''],
      remarks: [''],
      rnr: [0]
    });
    this.formCoBranding = this.fb.group({
      image: [""],
      icon: [""],
      co_brandingDomain: ['', Validators.required],
      primary_color: ["#ffffff"],
      secondary_color: ["#000000"],
    })
    this.kycForm = this.fb.group({
      account_name: ["", Validators.required],
      account_number: ["", [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      ifc_code: ["", Validators.required],
      bank_name: ["", Validators.required],
      branch: ["", Validators.required],
      upi_id: [""],
      kyc_document: [null, Validators.required],
      commission: ["", Validators.required],
      verify: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializePhoneNo();
    this.getInstitute();
    this.getAssignTo();
    this.getHomeCountryList();
    this.orgId = this.route.snapshot.paramMap.get('id');
    this.statuses = [
      { name: "Active", id: 1 },
      { name: "In-Active", id: 0 },
    ];
    // after remarks follow-up select yes only enable below filed
    this.remarksForm.get('followUpTime')?.disable();
    this.remarksForm.get('followUpDate')?.disable();
    this.listOrganizationDocuments();
    this.getRemarksFollowUpList();
    this.getAddUsers();
  }
  get f() {
    return this.form.controls;
  }
  get u() {
    return this.addUserForm.controls;
  }
  get c() {
    return this.formCoBranding.controls;
  }
  get kyc() {
    return this.kycForm.controls;
  }

  initializePhoneNo() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
      this.preferredCountry = data.country_code.toLocaleLowerCase()
      this.preferredCountryUser = data.country_code.toLocaleLowerCase()
      this.getMarketingList(this.orgId);
    });

  }
  onChangeContact(event: any) {
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      var data = {
        document: this.selectedFile,
        organization_id: this.orgId
      }
      this.service.uploadDocument(data).subscribe((res) => {
        if (res) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.selectedFile = null;
          this.listOrganizationDocuments();
          this.showUploadDialog = false;
        }
      })
    } else {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Select File" });
    }
  }
  getMarketingList(id: any) {
    var data = {
      Organization_id: id
    }
    this.service.getMarketingList(data).subscribe((res: any) => {
      this.instituteList = [];
      this.instituteList = res.marketing
      this.changeCountry(this.instituteList[0]?.homecountry)
      this.form.patchValue({
        inst_name: this.instituteList[0]?.institutename ? this.instituteList[0]?.institutename : null,
        phone_number: this.instituteList[0]?.phone ? this.instituteList[0]?.phone : null,
        website: this.instituteList[0]?.website ? this.instituteList[0]?.website : null,
        home_country: this.instituteList[0]?.homecountry ? this.instituteList[0]?.homecountry : null,
        Institute_type: this.instituteList[0]?.institutetype ? this.instituteList[0]?.institutetype : null,
        org_rep_name: this.instituteList[0]?.organization_representative ? this.instituteList[0]?.organization_representative : null,
        org_rep_designation: this.instituteList[0]?.representative_designation ? this.instituteList[0]?.representative_designation : null,
        email: this.instituteList[0]?.organization_email ? this.instituteList[0]?.organization_email : null,
        co_branding: this.instituteList[0]?.co_branding,
        address: this.instituteList[0]?.address ? this.instituteList[0]?.address : null,
        assign_to: this.instituteList[0]?.assigned_to ? Number(this.instituteList[0]?.assigned_to) : null,
        org_id: this.orgId
      })
      this.preferredCountry = this.instituteList[0]?.dial_country_code
      this.formCoBranding.patchValue({
        icon: this.instituteList[0]?.icon ? this.instituteList[0]?.icon : null,
        image: this.instituteList[0]?.organizationlogo ? this.instituteList[0]?.organizationlogo : null,
        co_brandingDomain: this.instituteList[0]?.domainname?.split('.')[0],
        primary_color: this.instituteList[0]?.brand_primary_color,
        secondary_color: this.instituteList[0]?.brand_secondary_color,
      })
      this.iconImg = this.instituteList[0]?.icon ? this.instituteList[0]?.icon : null;
      this.logoImg = this.instituteList[0]?.organizationlogo ? this.instituteList[0]?.organizationlogo : null;
      this.form.disable();
      this.formCoBranding.disable();
      this.kycForm.disable();
      if (this.instituteList[0]?.institutetype == 12) {
        if (this.instituteList[0]?.whitelabel_id) {
          this.getPayOutDetails(this.instituteList[0]?.whitelabel_id);
          this.getPayOutList(this.instituteList[0]?.whitelabel_id)
          this.isShoOnlyPartner = true;
          this.activeTabIndex = 4;
          this.cdr.detectChanges()
        } else {
          this.isShoOnlyPartner = false;
        }
      } else {
        this.isShoOnlyPartner = false;
      }
    });
  }
  submitForm() {
    if (this.detailsUpdate == "Edit") {
      this.detailsUpdate = "Update"
      this.form.enable();
      this.form.get('co_branding')?.disable();
    } else {
      this.submitted = true;
      var data = {
        institutename: this.form.value.inst_name,
        organization_email: this.form.value.email,
        phonenumber: this.form.value.phone_number.number,
        website: this.form.value.website,
        home_country_id: this.form.value.home_country,
        location: this.form.value.location ? this.form.value.location : 0,
        institutetype: this.form.value.Institute_type,
        organization_representative_name: this.form.value.org_rep_name,
        representative_designation: this.form.value.org_rep_designation,
        address: this.form.value.address,
        assigned_to: this.form.value.assign_to,
        marketingsId: this.form.value.org_id,
        phone: this.form.value.phone_number
      }
      this.service.editMarketing(data).subscribe((res) => {
        if (res) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.form.reset()
          this.ngOnInit()
          this.detailsUpdate == "Edit"
          this.submitted = false;
          this.form.disable();
        }
      })
    }

  }
  getInstitute() {
    this.instituteDropDownList = []
    this.service.getInstitute().subscribe((res: any) => {
      this.instituteDropDownList = res.data
    })
  }
  getRemarksFollowUpList() {
    this.getRemarksList = []
    var data = {
      organization_id: this.orgId
    }
    this.service.getRemarksFollowUpList(data).subscribe((res: any) => {
      this.getRemarksList = res.data
    })
  }
  getAssignTo() {
    this.assignToDropdownList = []
    this.service.getAssignTo().subscribe((res: any) => {
      this.assignToDropdownList = res.data
    })
  }
  listOrganizationDocuments() {
    this.listDocumentData = []
    var data = {
      organization_id: this.orgId
    }
    this.service.getDocumentList(data).subscribe((res: any) => {
      this.listDocumentData = res.documents
    })
  }
  getAddUsers() {
    this.users = []
    var data = {
      source: this.orgId
    }
    this.service.getUserAdd(data).subscribe((res: any) => {
      this.users = res.data
    })
  }

  getHomeCountryList() {
    this.subscriberService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homeCountries = [{ country: "Select", code: null }, ...res];
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
  changeCountry(event: any) {
    this.locationList = [];
    var data = {
      country_id: this.form.get('home_country').value ? this.form.get('home_country').value : event
    }
    this.locationService.getAllCountryLocation(data).subscribe(
      (res: any) => {
        this.locationList = res.data;
        this.form.patchValue({
          location: this.instituteList[0]?.location
        })
      },
      (error: any) => {
        this.toaster.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    )
  }
  breedCrumbs(eve: any) {
    this.breadCrumbsName
    const breadCrumbNo = eve.index
    if (breadCrumbNo == 1) {
      this.breadCrumbsName = "Organization Details"
    } else if (breadCrumbNo == 2) {
      this.breadCrumbsName = "Users"
    }
    else if (breadCrumbNo == 3) {
      this.breadCrumbsName = "Remarks"
    } else if (breadCrumbNo == 4) {
      this.breadCrumbsName = "Document"
    } else {
      this.breadCrumbsName = "Payout Details"
    }

  }
  submitUserForm() {
    this.submittedUser = true;
    if (this.addUserForm.invalid) {
      return;
    }
    if (this.btnTxt == "Add") {
      var addData = {
        name: this.addUserForm.value.user_name,
        email: this.addUserForm.value.email,
        phonenumber: this.addUserForm.value.phone_number.number,
        usertype: this.instituteList[0]?.institutetypeName == "Partner" ? 8 : 7,
        sub_usertype: this.addUserForm.value.user_type,
        source: this.orgId,
        status: this.addUserForm.value.status,
        phone: this.form.value.phone_number
      }
      this.service.addMarketingUser(addData).subscribe((res) => {
        if (res) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.addUserForm.reset()
          this.getAddUsers();
          this.submittedUser = false;
        }
      })
    } else {
      var updateData = {
        name: this.addUserForm.value.user_name,
        email: this.addUserForm.value.email,
        phone: this.addUserForm.value.phone_number,
        usertype: this.instituteList[0]?.institutetypeName == "Partner" ? 8 : 7,
        sub_usertype: this.addUserForm.value.user_type,
        userId: this.addUserForm.value.userId,
        status: this.addUserForm.value.status,
        phonenumber: this.addUserForm.value.phone_number.number,
      }
      this.service.updateMarketingUser(updateData).subscribe((res) => {
        if (res) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.addUserForm.reset()
          this.getAddUsers();
          this.submittedUser = false;
          this.btnTxt = "Add"
        }
      })
    }
  }
  edit(value: any) {
    this.btnTxt = "Update"
    this.addUserForm.patchValue({
      user_name: value.name,
      phone_number: value.phone,
      userId: value.id,
      email: value.email,
      user_type: value.sub_usertype,
      status: value.status
    })
    this.preferredCountryUser = value.dial_country_code
  }
  cancelDeleteUser() {
    this.showUserConfirmation = false;
  }
  confirmDeleteUser() {
    this.service.deleteUser(this.userDeleteId).subscribe({
      next: (res: any) => {
        this.toaster.add({ severity: 'success', summary: 'Deleted', detail: res.message });
        this.getAddUsers();
      },
      error: (err: any) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: err.message });
      },
      complete: () => {
        this.showUserConfirmation = false;
      }
    });
  }
  removeUser(event: Event, id: number) {
    this.showUserConfirmation = true;
    this.userDeleteId = id;
  }
  submitCoBrandingForm() {
    if (this.coBrandingUpdate == "Edit") {
      this.coBrandingUpdate = "Update";
      this.formCoBranding.enable();
    } else {
      this.submitCoBranding = true;
      if (this.formCoBranding.invalid) {
        return;
      }
      var updateData = {
        organizationtype: this.instituteList[0]?.institutetype,
        country: this.instituteList[0]?.homecountry,
        organizationname: this.orgId,
        domainname: this.formCoBranding.value.co_brandingDomain,
        organizationlogo: this.logoImg,
        icon: this.iconImg,
        source: this.instituteList[0]?.institutetype == 12 ? "Partner" : "Institute",
        primary_color: this.formCoBranding.value.primary_color,
        secondary_color: this.formCoBranding.value.secondary_color,
      }

      this.service.updateWhiteLabel(updateData).subscribe((res) => {
        if (res) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.formCoBranding.reset()
          this.iconImg = null;
          this.logoImg = null;
          this.ngOnInit()
          this.formCoBranding.disable();
          this.coBrandingUpdate = "Edit";
        }
      })
    }
  }
  // co-branding logos
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  iconImg: any;
  logoImg: any;
  onFileSelectedLogo(event: any): void {
    this.logoImg = event.files[0]
    if (this.logoImg) {
      const reader = new FileReader()
      reader.onload = () => {
        this.formCoBranding.patchValue({ image: this.logoImg.name });
      }
      reader.readAsDataURL(this.logoImg)
    }
    this.fileUpload.clear();
  }
  onFileSelectedIcon(event: any): void {
    this.iconImg = event.files[0]
    if (this.iconImg) {
      const reader = new FileReader()
      reader.onload = () => {
        this.formCoBranding.patchValue({ icon: this.iconImg.name });
      }
      reader.readAsDataURL(this.iconImg)
    }
    this.fileUploadIcon.clear();
  }

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
      organization_id: this.orgId,
      status_option: this.remarksForm.value.rnr ? this.remarksForm.value.rnr : this.remarksForm.value.status,
      follow_up: this.remarksForm.value.followUp,
      follow_date: this.remarksForm.value.followUpDate,
      follow_time: this.remarksForm.value.followUpTime ? this.convertTimeTo12HourFormat(this.remarksForm.value.followUpTime) : null,
      remarks: this.remarksForm.value.remarks,
    }
    this.service.addFollowUpRemarks(data).subscribe((res) => {
      if (res) {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.remarksForm.reset()
        this.showRemarksDialog = false
        this.getRemarksFollowUpList();
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
  back() {
    this.router.navigate(["/addpartner"])
  }
  editRename(id: number, name: string) {
    this.editingRenameId = id;
  }
  preventDot(event: KeyboardEvent): void {
    if (event.key === '.') {
      event.preventDefault();
    }
  }
  renameSubmit() {
    if (!this.renameDocValue) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please Type Rename" });
      return;
    }
    var data = {
      id: this.editingRenameId,
      new_name: this.renameDocValue,
    }
    this.service.renameDocument(data).subscribe((res) => {
      if (res) {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.renameDocValue = null;
        this.editingRenameId = null;
        this.listOrganizationDocuments();
      }
    })
  }
  onCheckboxChange(id: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    }
  }
  isShowDeleteDocumentsCancelButton: boolean = true;
  deleteSelectedDocuments() {
    this.isShowDeleteDocumentsCancelButton = true;
    if (!this.selectedIds.length) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "Please select at least one document" });
      return;
    }
    this.showConfirmation = true;
  }
  deleteSingleDocuments(id: number): void {
    this.isShowDeleteDocumentsCancelButton = false;
    this.selectedIds = [];
    this.selectedIds.push(id);
    this.showConfirmation = true;
  }
  cancelDelete(): void {
    this.showConfirmation = false;
  }
  cancelSingleDelete() {
    this.selectedIds = [];
    this.showConfirmation = false;
  }
  // Confirm and delete
  confirmDelete(): void {
    const data = { id: this.selectedIds };
    this.service.deleteSelectedDocument(data).subscribe({
      next: (res: any) => {
        this.toaster.add({ severity: 'success', summary: 'Deleted', detail: res.message });
        this.listOrganizationDocuments();
      },
      error: (err: any) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: err.message });
      },
      complete: () => {
        this.selectedIds = [];
        this.showConfirmation = false;
      }
    });
  }
  downloadDocumentId(list: any) {
    const data = { filename: list.filename };
    this.service.downloadDocument(data).subscribe(blob => {
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = list.filename || 'document.pdf'; // fallback name
      a.click();
      URL.revokeObjectURL(fileURL);
    });
  }
  // is show icons using different format
  isImage(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext!);
  }

  isDocument(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext!);
  }

  isPdf(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
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
  submitFormKycForm() {
    if (this.btnKycSubmit == "Edit") {
      this.btnKycSubmit = "Update"
      this.kycForm.get('commission')?.enable();
      this.kycForm.get('verify')?.enable();
      this.kycForm.get('account_number')?.enable();
      this.kycForm.get('ifc_code')?.enable();
      this.kycForm.get('upi_id')?.enable();
      this.kycForm.get('account_name')?.enable();
      this.isShowUploadDocButton = true;
      return;
    } else {
      this.submittedKyc = true;
      if (this.kycForm.value.ifc_code) {
        if (!this.bankName) {
          this.toaster.add({
            severity: 'error',
            summary: 'Invalid IFSC Code',
            detail: 'The IFSC code you entered is not valid. Please check and try again.'
          });
          return;
        }
      }
      if (this.kycForm.value.upi_id) {
        if (!this.checkUpiValidity) {
          this.toaster.add({
            severity: 'error',
            summary: 'Invalid IFSC Code',
            detail: 'The UPI ID you entered is not valid. Please check and try again.'
          });
          return;
        }
      }
      if (this.kycForm.valid) {
        this.kycForm.enable()
        var data = {
          source: this.instituteList[0]?.whitelabel_id,
          bank_account_name: this.kycForm.value.account_name,
          bank_account_number: this.kycForm.value.account_number,
          ifsc_code: this.kycForm.value.ifc_code,
          upi_id: this.kycForm.value.upi_id ? this.kycForm.value.upi_id : "",
          kyc_document: this.kycForm.value.kyc_document,
          commission_percentage: this.kycForm.value.commission,
          verified: this.kycForm.value.verify
        }
        this.service.uploadKycData(data).subscribe(response => {
          this.toaster.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.ngOnInit();
          this.btnKycSubmit = "Edit"
          this.kycForm.disable()
          this.submittedKyc = false;
          this.isShowUploadDocButton = false;
        });
      }
    }
  }
  bankDetails: any;
  documentName: any;
  getPayOutDetails(id: any) {
    var data = {
      partner_id: id
    }
    this.service.getPayOutDetails(data).subscribe((res: any) => {
      if (res) {
        this.bankDetails = res.banking_detail[0]
        this.documentName = res.banking_detail[0]?.kyc_document
        this.kycForm.patchValue({
          account_name: res.banking_detail[0]?.bank_account_name,
          account_number: res.banking_detail[0]?.bank_account_number,
          ifc_code: res.banking_detail[0]?.ifsc_code,
          bank_name: res.bank_details?.BANK,
          upi_id: res.banking_detail[0]?.upi_id ? res.banking_detail[0]?.upi_id : "",
          kyc_document: res.banking_detail[0]?.kyc_document,
          commission: res.banking_detail[0]?.commission_percentage ? parseInt(res.banking_detail[0]?.commission_percentage) : "",
          verify: res.banking_detail[0]?.verified,
          branch: `${res.bank_details?.BRANCH}, ${res.bank_details?.CITY}`
        })
        this.bankName = res.bank_details?.BANK
      } else {
        this.isShoOnlyPartner = false;
      }
    }, (error) => {
      this.isShoOnlyPartner = false;
    });
  }
  downloadDocument() {
    const fileUrl = this.kycForm.value.kyc_document;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = ''; // Optional: specify filename like 'document.pdf'
      link.target = '_blank'; // Opens in new tab if download fails
      link.click();
    } else {
      console.warn('No document URL found');
    }
  }
  getPayOutList(id: any) {
    this.payoutList = []
    var data = {
      partner_id: id
    }
    this.service.getPayOutManagerList(data).subscribe((res) => {
      this.payoutList = res.transactions;
      this.datacount = res.total_payout;
      this.totalPayoutDue = res.total_pending_payout + res.total_failed_payout
    })
  }
  bankName: any;
  checkValidity(event: any) {
    var data = {
      ifsc: this.kycForm.value.ifc_code
    }
    this.service.checkIfcCode(data).subscribe(response => {
      if (response) {
        this.kycForm.patchValue({
          bank_name: response.BANK,
          branch: `${response.BRANCH}, ${response.CITY}`
        })
        this.bankName = response.BANK;
      } else {
        this.kycForm.patchValue({
          bank_name: null,
          branch: null
        })
        this.bankName = null;
      }
    });
  }
  checkUpIdValidity(event: any) {
    var data = {
      upi_id: this.kycForm.value.upi_id
    }
    this.checkUpiValidity = false;
    this.service.checkUpId(data).subscribe((response: any) => {
      if (response) {
        this.checkUpiValidity = true
      }
    });
  }
  onFileSelectedDoc(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.documentName = file.name;
      this.kycForm.patchValue({ kyc_document: file });
    }
    this.fileUploadDoc.clear();
  }
}

