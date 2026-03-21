import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { Accordion, AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserFacadeService } from '../users/user-facade.service';
import { HttpClient } from '@angular/common/http';
// import { error } from 'console';
import { ResourcesService } from './resources.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
export function linkFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const linkPattern = /^(http|https):\/\/\w+/;

    if (!linkPattern.test(control.value)) {
      return { invalidLinkFormat: true };
    }

    return null;
  };
}
@Component({
    selector: 'uni-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, ButtonModule, MultiSelectModule,
        TooltipModule
    ],
    providers: [ConfirmationService]
})
export class ResourcesComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  resourceslist: any[] = [];
  pageSize = 10;
  btntxt = "Add";
  namentxt = "Add Resource"
  activeIndex = 1;
  perPage: number = 12;
  pageno: number = 1;
  intcountries: any = [];
  statusOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'In-Active' },
  ];
  priorityTag = [
    { name: "Priority", id: '1' },
    { name: "Non-Priority", id: '0' },
  ];
  currentPage: number = 0; // Current page number
  rowsPerPage: number = 12; // Rows per page
  rowsPerPageOptions: number[] = [12, 36, 72, 100];
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder,
    private http: HttpClient, private toastr: MessageService, private cdr: ChangeDetectorRef, private service: ResourcesService,
    private confirmationService: ConfirmationService, private zone: NgZone) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      link: ['', [Validators.required, linkFormatValidator()]],
      decription: ['', [Validators.required]],
      image: [''],
      coutryname: ['', [Validators.required]],
      resourcesId: [''],
      priority: ['', [Validators.required]]
    });
    this.filterform = this.fb.group({
      coutryname: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    let data = {
      perpage: 12,
      page: 1,
      coutryname: this.filterform.value.coutryname,
      status: this.filterform.value.status
    }
    this.getresources(data)
    this.getCountriesList()
  }
  get f() {
    return this.form.controls;
  }
  datacount: number = 0;
  paginate(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage: this.perPage,
      page: event.page + 1,
      coutryname: this.filterform.value.countryname,
      status: this.filterform.value.status
    }
    this.getresources(data);
  }
  indextchange(eve: number) {
    this.activeIndex = eve;
  }

  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      var data = {
        title: this.form.value.title,
        link: this.form.value.link,
        resourcedescription: this.form.value.decription,
        coutryname: this.form.value.coutryname,
        image: this.document,
        priority: this.form.value.priority,
      }
      if (this.btntxt == "Add") {
        this.service.addresources(data).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.submitted = false;
            this.document = "";
          }
        })
      } else {
        var updatedata = {
          title: this.form.value.title,
          link: this.form.value.link,
          resourcesId: this.form.value.resourcesId,
          resourcedescription: this.form.value.decription,
          coutryname: this.form.value.coutryname,
          image: this.document,
          priority: this.form.value.priority,
        }
        this.service.editresources(updatedata).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.currentPage = 1;
            this.zone.run(() => {
              this.rowsPerPage = 12; // Update this with the desired rows per page
              // Clear and update rowsPerPageOptions
              // this.rowsPerPageOptions = null; // or use an empty array: this.rowsPerPageOptions = [];
              // this.rowsPerPageOptions = [12, 24, 48, 96]; // Update this with the desired rows per page options
            });
            this.form.reset()
            this.btntxt = "Add";
            this.namentxt = "Add Resource"
            this.submitted = false;
            this.document = "";
            this.ngOnInit()
          }
        })
      }
    }
  }
  getresources(data: any) {
    this.service.getlistresorces(data).subscribe((res) => {
      console.log(res);
      this.resourceslist = []
      this.datacount = res.count
      this.resourceslist = res.resources
    })
  }
  getCountryName(flag: string): string {
    const countryNames = this.resourceslist.map(resource => resource.countryName.split(',')).flat();
    const flags = this.resourceslist.map(resource => resource.countryFlag.split(',')).flat();

    const flagIndex = flags.findIndex((f) => f.trim() === flag.trim());
    return flagIndex !== -1 ? countryNames[flagIndex].trim() : '';
  }
  editresourcesdetails(eve: any) {
    this.cdr.detectChanges();
    this.activeIndex = 0;
    this.btntxt = "Update";
    this.namentxt = "Update Resource"
    console.log(eve);
    this.form.patchValue({
      link: eve.link,
      title: eve.title,
      resourcesId: eve.id,
      decription: eve.resourcedescription,
      coutryname: eve.countryid.split(',').map(Number),
      priority: eve.priority.toString()
    });
    const urlParts = eve.coverimage.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Fetch the remote file
    fetch(eve.coverimage)
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
  deleteresourceslist(eve: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "btn-primary",
      rejectButtonStyleClass: "btn-primary",
      accept: () => {
        var data = {
          resourcesId: eve.id
        }
        this.service.deleteResources(data).subscribe((res) => {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: 'Removed Successfully' });
          this.ngOnInit()
        });
      }
    });
  }
  getCountriesList() {
    this.intcountries = [];
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
  onDragOver(event: DragEvent) {
    event.preventDefault();
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
  filterSubmitForm() {
    var data = {
      perpage: 12,
      page: 1,
      coutryname: this.filterform.value.coutryname,
      status: this.filterform.value.status
    }
    this.getresources(data)
  }
  formReset() {
    this.filterform.reset()
    this.filterSubmitForm();
    this.ngOnInit()
  }
  onCitySelect(event: any) {
    // Clear the array and add the newly selected city
    if (event.value.includes(0)) {
      this.form.get('coutryname').setValue([0]);
    }
  }
  onLocationSelect(event: any) {
    // Clear the array and add the newly selected city
    if (event.value.includes(0)) {
      this.filterform.get('coutryname').setValue([0]);
    }
  }
}
