import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { MenuItem, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { Accordion, AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserFacadeService } from '../users/user-facade.service';
import { CountrymanagementService } from './countrymanagement.service';
import { HttpClient } from '@angular/common/http';
// import { error } from 'console';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
@Component({
    selector: 'uni-countrymanagement',
    templateUrl: './countrymanagement.component.html',
    styleUrls: ['./countrymanagement.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, MultiSelectModule, PaginatorModule
    ]
})
export class CountrymanagementComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('accordion', { static: false }) accordion!: Accordion;
  users$!: Observable<{ users: User[], totalRecords: number }>;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  coutrylist: any[] = [];
  datacount: number = 0;
  btntxt = "Add country";
  ed = "Add Countries"
  activeIndex = 1;
  totalcount;
  intcountries: any = [];
  pageno:number = 1;
  perPage:number = 10;
  statusOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'In-Active' },
  ];
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder, private service: CountrymanagementService,
    private http: HttpClient, private toastr: MessageService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      image: [''],
      status: ['', [Validators.required]],
      country_id: [''],
      flag: [''],
    });
    this.filterForm = this.fb.group({
      coutryname: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    // dummy data
    this.filtersubmit()
    this.getCountriesList()
  }
  get f() {
    return this.form.controls;
  }
  // data: any = { page: 1, perpage: this.perpage };
  page: number = 1;
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      countryname: this.filterForm.value.coutryname,
      status: this.filterForm.value.status,
      perpage : this.perPage,
      page : event.page + 1,
    }
    // this.getresources(data);
    // this.data = {
    //   countryname: this.filterForm.value.name,
    //   status: this.filterForm.value.status,
    //   page: this.page,
    //   perPage: this.pageSize,
    // };
    this.service.getlistcountry(data).subscribe((res) => {
      this.coutrylist = []
      res.countries.forEach((list: any) => {
        var bindingdata = {
          id: list.id,
          country: list.country,
          flag: list.flag,
          status: list.status,
          totalque: list.totalQuestions,
          datacount: list.count,
          flagname: list.flagImageName
        }
        this.coutrylist.push(bindingdata)
      })
    })

  }
  answer() {
    this.router.navigate(['reading'])
  }
  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      var data = {
        country: this.form.value.name,
        status: this.form.value.status,
        flag: this.document
      }

      if (this.btntxt == "Add country") {
        this.service.addcountry(data).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.filterForm.reset()
            this.submitted = false;
            this.document=""
          }
        })
      } else {
        var updatedata = {
          country: this.form.value.name,
          status: this.form.value.status,
          flag: this.document,
          countryid: this.form.value.country_id,
        }
        this.service.editcountry(updatedata).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.filterForm.reset()
            this.document=""
            this.submitted = false;
            this.btntxt = "Add country";
            this.ed = "Add Countries"
          }
        })
      }
    }
  }
  filterData(){
    const formData = this.filterForm.value;
    if (!formData.coutryname && !formData.status) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.filtersubmit()
  }
  filtersubmit() {
    this.coutrylist = []
    var data = {
      countryname: this.filterForm.value.coutryname,
      status: this.filterForm.value.status,
      page: this.page,
      perpage: this.perPage,
    }
    this.service.getlistcountry(data).subscribe((res) => {
      res.countries.forEach((list: any) => {
        var bindingdata = {
          id: list.id,
          country: list.country,
          flag: list.flag,
          status: list.status,
          totalque: list.totalQuestions,
          flagname: list.flagImageName
        }
        this.datacount = res.count
        this.totalcount = res.totalquestioncount
        this.coutrylist.push(bindingdata)
      })
    })

  }

  selectedFile: File | undefined;
  document: any;
  async onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.document = file;
      const fileInput = this.fileInput.nativeElement;
    }
    this.form.controls.image.setValue(this.document);
  }



  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];

  }
  flagnamestring: any = "";
  editcountrydetails(countryData: any) {
    this.cdr.detectChanges();
    this.activeIndex = 0;
    this.btntxt = "Edit country";
    this.ed = "Edit Countries"
    this.form.patchValue({
      name: countryData.country,
      status: countryData.status==1? '1':'0',
      country_id: countryData.id,
      // image: countryData.flagname
    });
    const urlParts = countryData.flag.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Fetch the remote file
    fetch(countryData.flag)
      .then(response => response.blob())
      .then(blob => {
        // Create a File object with the extracted filename
        const file = new File([blob], filename, {
          type: blob.type,
          lastModified: new Date().getTime()
        });
        // Now, 'file' is a File object with a dynamic name
        this.document = file
        this.form.controls.image.setValue(this.document);
      })
      .catch(error => {
        console.error('Error fetching the file:', error);
      });
  }
  indextchange(eve: number) {
    this.activeIndex = eve;
  }
  getCountriesList() {
    this.service.getCountriesList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.country
        };
        this.intcountries.push(bindingdata);
      });
    });
  }
  filterFormReset(){
    this.filterForm.reset();
    this.filtersubmit()
  }
}
