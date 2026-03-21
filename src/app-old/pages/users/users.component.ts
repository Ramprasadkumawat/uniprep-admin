import { Location } from './../../@Models/location.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { filter, forkJoin, mergeMap, Observable, of } from "rxjs";
import { CreateUserParams, User, UserType, Users } from "../../@Models/user.model";
import { UserFacadeService } from "./user-facade.service";
import {SelectModule} from "primeng/select";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule,  Validators } from "@angular/forms";
import { login } from "../../Auth/store/actions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { PageFacadeService } from '../page-facade.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UserTypeData } from 'src/app/@Models/user-type.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from 'src/app/Auth/auth.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CountryISO, SearchCountryField,  NgxIntlTelInputModule, } from "ngx-intl-tel-input";



@Component({
    selector: 'uni-users',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule,
        ConfirmPopupModule, InputNumberModule, RadioButtonModule, NgxIntlTelInputModule,],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [ConfirmationService]
})


export class UsersComponent implements OnInit {
  users$!: Observable<{ users: User[], totalRecords: number }>;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  form: FormGroup;
  filterForm: FormGroup;
  Editform: FormGroup;
  submitted = false;
  pageSize = 10;
  EditFormshow = false;
  Adduserform = true;

  ContinueImport = "block";
  dragform: FormGroup;
  selectedFile: any;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;

  preferredCountries: CountryISO[] = [CountryISO.India];
  page: number = 1;
  userObj: object = {};
  usersCount: number = 0;
  users: any[] = [];
  userTypes: any[] = [];
  region: any = [];
  sourceName: any = [];
  locations: any = [];
  preferredCountry: any;
  companys: any = [];
  home_countries: any = [];
  genderoption = [
    { name: "Select", code: null },
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Others", code: "O" },
  ];
  editsubmitted: boolean = false;
  activeIndex: number = -1;
  userId!: number;
  pwdMismatch: boolean = false;
  first: number = 0;
  show1: boolean = false;
  show2: boolean = false;
  isadmin = true;
  source;
  sourcetype;
  usertypeid;
  minPhoneNumberLength: number = 10;
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('editFormElm') editFormElm!: ElementRef;
  constructor(
    private userFacade: UserFacadeService,
    private fb: FormBuilder,
    private toaster: MessageService,
    private pageService: PageFacadeService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.form = fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      // phone: [null, [Validators.required, this.phoneNumberValidator()]],
      usertype: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      hm_country: [null, Validators.required],
      region: [null, Validators.required],
      location: [null, [Validators.required]],
      source: [''],
      designation: [''],
      demo_user: [0, [Validators.required]]
    });

    this.Editform = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      usertype: [null, Validators.required],
      gender: [null, [Validators.required]],
      hm_country: [null, Validators.required],
      region: [null, Validators.required],
      location: ['', [Validators.required]],
      source: [''],
      designation: [''],
      demo_user: [0, [Validators.required]]
    });

    this.filterForm = fb.group({
      name: [''], email: [''], source_name: [''],
      phone: [null], usertype: [''], region: [''], location: [''], hm_country: ['']
    });

    this.dragform = fb.group({
      dragexcel: ['']
    });
  }
  companyname = "Company Name";
  isother: boolean = true;
  ngOnInit(): void {
    this.authService.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        if (res[0].usertype_id == 7) {
          this.isadmin = false;
          this.show1 = false;
          this.show2 = true;
          this.usertypeid = res[0].usertype_id;
          this.source = res[0].source;
          this.sourcetype = res[0].source_type;
        }
        this.loadUserList();
        console.log(CountryISO.India);
      });

    this.getUserTypeList();
    this.getRegion();
    this.gethomeCountryList();
    this.intializePhoneNo();
    // this.getCompanyName();
  }

  intializePhoneNo() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
      this.preferredCountry = data.country_code.toLocaleLowerCase()
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

  gethomeCountryList() {
    this.pageService.getHomeCountries(2).subscribe(response => {
      this.home_countries = [{ id: null, country: "Select" }, ...response];
    });
  }
  changeCountry(event: any) {
    // this.getRegionList();
    this.loadLocationList();
  }
  loadLocationList() {
    if (this.form.get('hm_country').value == 122) {
      this.pageService.getLocations().subscribe((response) => {
        this.locations = [{ id: null, district: "Select" }, ...response];
      });
      this.pageService.getRegion().subscribe(response => {
        this.region = [{ id: null, state: "Select" }, ...response];
      });
    }
    else {
      this.locations = [{ id: 0, district: "Others" }];
      this.form.get('location').setValue(0);
      this.region = [{ id: 0, state: "Others" }];
      this.form.get('region').setValue(0);
    }

  }

  changeCountryEdit(event: any) {
    if (this.Editform.get('hm_country').value == 122) {
      this.pageService.getLocations().subscribe((response) => {
        this.locations = [{ id: null, district: "Select" }, ...response];
      });
      this.pageService.getRegion().subscribe(response => {
        this.region = [{ id: null, state: "Select" }, ...response];
      });
    }
    else {
      this.locations = [{ id: 0, district: "Others" }];
      this.Editform.get('location').setValue(0);
      this.region = [{ id: 0, state: "Others" }];
      this.Editform.get('region').setValue(0);
    }


  }

  changeCountryFilter(event: any) {
    if (this.filterForm.get('hm_country').value == 122) {
      this.pageService.getLocations().subscribe((response) => {
        this.locations = [{ id: null, district: "Select" }, ...response];
      });
      this.pageService.getRegion().subscribe(response => {
        this.region = [{ id: null, state: "Select" }, ...response];
      });
    }
    else {
      this.locations = [{ id: 0, district: "Others" }];
      this.filterForm.get('location').setValue(0);
      this.region = [{ id: 0, state: "Others" }];
      this.filterForm.get('region').setValue(0);
    }


  }


  get f() {
    return this.form.controls;
  }
  get e() {
    return this.Editform.controls;
  }
  /*
   phoneNumberValidator(): ValidatorFn {
     return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
       const pattern = /^[0-9]{10,}$/; // Match 10 or more digits
       if (!pattern.test(phoneNumber)) {
         return { minlength: true };
       }
       return null; 
     };  
   }  
 */
  loadUserList() {
    if (this.usertypeid == 7) {
      this.userObj = {
        page: this.page,
        perpage: this.pageSize,
        source: this.source
      }
      this.getUserList(this.userObj);
    } else {
      this.userObj = {
        page: this.page,
        perpage: this.pageSize
      }
      this.getUserList(this.userObj);
    }

  }


  edit(value: Users) {
    this.EditFormshow = true;
    this.Adduserform = false;
    this.activeIndex = 0;
    this.show1 = false;
    this.show2 = false;
    // if (value.user_type_id !== 15 && value.user_type_id !== null && value.user_type_id !== 2) {
    //   this.show1= true;
    //   this.show2 = true;
    //   this.getSourceName(value.user_type_id.toString())
    // }
    // if(value.user_type_id == 14) {
    //   this.show1 = false;
    //   this.show2 = true;
    // }
    // preferredCountries: CountryISO[] = [CountryISO.India];

    if (value.user_type_id == 7 || value.user_type_id == 4) {
      this.show1 = true;
      this.show2 = true;
      this.companyname = "Institute Name";
      this.getSourceName(value.user_type_id.toString());
    }
    else if (value.user_type_id == 9 || value.user_type_id == 9) {
      this.show1 = true;
      this.show2 = true;
      this.companyname = "Company Name";
      this.getSourceName(value.user_type_id.toString());
    }
    else if (value.user_type_id == 12 || value.user_type_id == 13 || value.user_type_id == 14) {
      this.show1 = false;
      this.show2 = true;
    }
    else {
      this.show1 = false;
      this.show2 = false;
    }
    if (parseInt(value.country) == 122) {
      this.pageService.getRegion().subscribe(response => {
        this.region = [{ id: null, state: "Select" }, ...response];
        setTimeout(() => {
          this.Editform.patchValue({
            region: value.region,
          });
        }, 0);
      });
      this.getLocationList(value.region.toString());
      setTimeout(() => {
        this.Editform.patchValue({
          location: value.location_id,
        });
      }, 1500);
    }
    else {
      this.locations = [{ id: 0, district: "Others" }];
      this.Editform.get('location').setValue(0);
      this.region = [{ id: 0, state: "Others" }];
      this.Editform.get('region').setValue(0);
    }
    this.Editform.patchValue({
      name: value.name,
      email: value.email,
      phone: value.phone,
      usertype: value.user_type_id,
      gender: value.gender,
      hm_country: parseInt(value.country),
      // region: value.region, 
      //  location: value.location_id,
      source: value.source,
      designation: value.designation,
      demo_user: value.demoUser
    });
    this.userId = value.id;
    this.preferredCountry = value.dial_country_code;

  }
  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.usertypeid == 7) {
      const value = this.form.value;
      value.usertype = 10;
      value.source = this.source;
      value.phone_number = this.form.value.phone.number;
      this.userFacade.addUser(value as CreateUserParams).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.submitted = false;
        this.form.reset();
        this.formElm.nativeElement.reset();
        const formData = this.filterForm.value;
        if (!formData.name && !formData.email && !formData.phone
          && !formData.usertype && !formData.gender && !formData.region && !formData.location) {
          this.loadUserList();
        }
        else {
          this.getUserList(this.userObj);
        }
      },
        error => {
          // this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
          // this.loadUserList();
        });
    } else {
      const value = this.form.value;
      value.phone_number = this.form.value.phone.number;
      this.userFacade.addUser(this.form.value as CreateUserParams).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.submitted = false;
        this.form.reset();
        this.formElm.nativeElement.reset();
        const formData = this.filterForm.value;
        if (!formData.name && !formData.email && !formData.phone
          && !formData.usertype && !formData.gender && !formData.region && !formData.location) {
          this.loadUserList();
        }
        else {
          this.getUserList(this.userObj);
        }
      },
        error => {
          // this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
          // this.loadUserList();
        });
    }

  }
  submitEditForm() {
    this.editsubmitted = true;
    if (this.Editform.invalid) {
      return;
    }

    if (this.usertypeid == 7) {

      const value = this.Editform.value;
      value.phone_number = this.Editform.value.phone.number;
      value.source = this.source;
      value.userId = this.userId;
      this.userFacade.updateUser(value as CreateUserParams).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.submitted = false;
        this.Editform.reset();
        this.editFormElm.nativeElement.reset();
        this.loadUserList();
      },
        error => {
          // this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
    } else {
      const value = this.Editform.value;
      value.phone_number = this.Editform.value.phone.number;
      value.source = this.source;
      value.userId = this.userId;
      this.userFacade.updateUser(value as CreateUserParams).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.EditFormshow = false;
        this.Adduserform = true;
        this.Editform.reset();
        this.editFormElm.nativeElement.reset();
        this.loadUserList();
      },
        error => {
          // this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
    }
  }
  getUserList(value: any) {
    this.userFacade.getUsers(value).subscribe(response => {
      this.users = response.users;
      this.usersCount = response.count;
    });
  }

  getRegion() {
    this.pageService.getRegion().subscribe(response => {
      this.region = [{ id: null, state: "Select" }, ...response];
    });
  }
  getLocationList(value: string) {
    this.userFacade.getLocationByRegion(value).subscribe(response => {
      this.locations = [{ id: null, district: "Select" }, ...response];
    });
  }
  getUserTypeList() {
    this.pageService.getSources().subscribe(response => {
      this.userTypes = [{ id: null, type: "Select" }, ...response];
    });
  }
  pageChange(event: any) {
    this.page = (event.first / this.pageSize + 1);
    this.first = event.first ?? 0;
    this.getUserList({ ...this.userObj, page: this.page });
  }
  filter() {
    const formData = this.filterForm.value;
    if (!formData.name && !formData.email && !formData.phone
      && !formData.usertype && !formData.gender && !formData.hm_country && !formData.region && !formData.location) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let data: any = {
      page: 1,
      perpage: this.pageSize,
    };
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.email) {
      data.email = formData.email;
    }
    if (formData.phone) {
      data.mobile = formData.phone;
    }
    if (formData.usertype) {
      data.usertype = formData.usertype;
    }
    if (formData.source_name) {
      data.source = formData.source_name;
    }
    if (formData.hm_country) {
      data.home_country_id = formData.hm_country;
    }
    if (formData.location) {
      data.location = formData.location.toString();
    }
    if (formData.region) {
      data.region = formData.region;
    }
    this.userObj = data;
    this.first = 0;
    this.getUserList(this.userObj);
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.loadUserList();
  }

  removeUser(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete User?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userFacade.deleteUser(id).subscribe(response => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.loadUserList();
        }, error => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
  // getCompanyName() {
  //   this.userFacade.getCompany().subscribe(response => {
  //     this.companys = [{ id: null, companyName: "Select" }, ...response];
  //   });
  // }
  getSourceName(usertype: string) {
    if (usertype == '4' || usertype == '9' || usertype == '8') {
      let data = {
        source: usertype
      }
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
    if (usertype == '7') {
      const formData = this.Adduserform ? this.form.value : this.Editform.value;
      let data = {
        source: usertype,
        region: formData.region,
        location: formData.location
      }
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
  }
  changeSourceType(event: any) {
    const value = event.value.toString();
    if (value == '4' || value == '9') {
      let data = {
        source: value
      }
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
    if (value == '7') {
      const formData = this.filterForm.value;
      let data = {
        source: value,
        region: formData.region,
        location: formData.location
      }
      this.pageService.getSourceNameBySoucreId(data).subscribe(response => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
    }
  }
  checkUserType(event: any) {
    console.log(event);

    const value = event.value;
    if (value == 7 || value == 4) {
      this.show1 = true;
      this.show2 = true;
      this.companyname = "Institute Name";
      this.getSourceName(value.toString());
    }
    else if (value == 9 || value == 8) {
      this.show1 = true;
      this.show2 = true;
      this.companyname = "Company Name";
      this.getSourceName(value.toString());
    }
    else if (value == 12 || value == 13 || value == 14) {
      this.show1 = false;
      this.show2 = true;
    }
    else {
      this.show1 = false;
      this.show2 = false;
    }
  }
  changeRegion(event: any) {
    const value = event.value.toString();
    this.getLocationList(value)
  }
  onKeyPress(event: any) {
    const charCode = event.charCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
      return;
    }
    event.preventDefault();
  }
  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.email) {
      data.email = formData.email;
    }
    if (formData.phone) {
      data.mobile = formData.phone;
    }
    if (formData.usertype) {
      data.usertype = formData.usertype;
    }
    if (formData.source_name) {
      data.source = formData.source_name;
    }
    if (formData.location) {
      data.location = formData.location.toString();
    }
    if (formData.region) {
      data.region = formData.region;
    }
    this.userFacade.userExport(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
  CloseImport() {
    this.ContinueImport = 'none'
  }

  OpenImport() {
    this.ContinueImport = "block";
  }

  onFileDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.handleFiles(files);
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

  onDragOver(event: Event) {

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.handleFiles(files);
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }
  dragsubmit() {
    if (this.selectedFile) {
      this.userFacade.UserImport(this.selectedFile).subscribe((response: any) => {
        this.selectedFile = null;
        if (response.status) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.ContinueImport = 'none';
          this.ngOnInit()
        } else {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      });
    } else {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please choose file!' });
    }
  }
} 
