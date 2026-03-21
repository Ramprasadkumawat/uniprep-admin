import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { LandingPageService } from "./landing-page.service"
import { LandingPage } from "src/app/@Models/landing-page.model"
import { Router } from "@angular/router"
import { MessageService } from "primeng/api"


interface Category {
  name: string
  id: number
}

interface Status {
  name: string
  code: number
}

interface Tag {
  name: string
  id: number
}

@Component({
    selector: "app-landing-page",
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.scss"],
    standalone: false
})
export class LandingPageComponent implements OnInit {
  landingPageForm: FormGroup
  landingPages: LandingPage[] = []
  categories: Category[] = []
  statuses: Status[] = []
  tagList: Tag[] = [];
  // Pagination
  id: number = NaN;
  first = 0
  page = 1;
  pageSize = 10;
  totalRecords = 0;
  importModal: 'none' | 'block' = 'none';
  selectedFile: any;
  submitted: boolean = false; 
  private emojiRegex = /^(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)+$/u;


  constructor(private fb: FormBuilder, private landingPageService: LandingPageService, private router: Router, private toastService: MessageService) {
    this.landingPageForm = this.fb.group({
      feature_name: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tag: ['', [Validators.required]],
      status: ['', [Validators.required]],
      icon: ['', [Validators.required, this.emojiValidator()]],
      order_no: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    })
  }

  ngOnInit(): void {
    this.getLandingDataList();
    this.getDropDownList();
  }

  resetLandingPageFields(): void {
    this.landingPageForm.reset();
    this.id = NaN;
  }

  submitLandingPage(): void {
    if (this.landingPageForm.invalid) {
      Object.keys(this.landingPageForm.controls).forEach(controlName => {
        const control = this.landingPageForm.get(controlName);
        control.markAsTouched();
      });
      return;
    }
    if (this.id) {
      this.landingPageService.updateLandingPageData({ id: this.id, ...this.landingPageForm.value }).subscribe({
        next: response => {
          if (response.success) {
            this.toastService.add({
              severity: 'success',
              summary: 'Landing page updated successfully'
            });
            this.landingPageForm.reset();
            this.getLandingDataList();
            this.id = NaN;
          } else {
            this.toastService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error: error => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message
          });
        }
      });
    } else {
      this.landingPageService.addLandingPageData(this.landingPageForm.value).subscribe({
        next: response => {
          if (response.success) {
            this.toastService.add({
              severity: 'success',
              summary: 'Landing page added successfully'
            });
            this.getLandingDataList();
            this.landingPageForm.reset();
            this.id = NaN;
          } else {
            this.toastService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error: error => {
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message
          });
        }
      });
    }
  }

  get f() {
    return this.landingPageForm.controls;
  }

  onPageChange(event: any): void {
    this.page = (event.page ?? 0) + 1;
    this.pageSize = event.rows;
    this.getLandingDataList();
  }

  searchLandingPage(event: any): void {
    const searchValue = event.target.value;
    if (searchValue) {
      this.getLandingDataList({ keyword: searchValue });
    } else {
      this.getLandingDataList();
    }
  }


  editLandingPage(data: LandingPage): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('p-accordion').scrollIntoView({ behavior: 'smooth' });
    this.id = data?.id;
    this.landingPageForm.patchValue({
      feature_name: data?.feature_name,
      category: data.category,
      tag: data?.tag,
      status: data?.status,
      icon: data.icon,
      order_no: data.order_no,
      description: data.description,
      slug: data.slug
    });
  }

  getLandingDataList(params?: any) {
    const data = {
      page: this.page,
      perpage: this.pageSize,
      ...params
    }
    this.landingPageService.getLandingPageList(data).subscribe({
      next: response => {
        if (response.success) {
          this.landingPages = response.landingpages;
          this.totalRecords = response.count;
        }
      },
      error: error => {
        console.log(error.error.message);
      }
    })
  }

  // bulk upload codes
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onCategoryChange(id: any) {
    if (id) {
      this.landingPageService.getLandingCategoryTags(id).subscribe({
        next: response => {
          if (response.success) {
            this.tagList = response.tags;
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  emojiValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      return this.emojiRegex.test(control.value) ? null : { invalidEmoji: true };
    };
  }

  getDropDownList() {
    this.landingPageService.getDropDownList().subscribe({
      next: response => {
        this.categories = response.categories;
        this.statuses = response.status;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  downloadSampleCSV() { }
}
