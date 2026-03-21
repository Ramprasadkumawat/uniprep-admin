import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountryInsightsService } from './country-insights.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-country-insights',
    templateUrl: './country-insights.component.html',
    styleUrls: ['./country-insights.component.scss'],
    standalone: false
})
export class CountryInsightsComponent implements OnInit {
  filterForm: FormGroup;
  form: FormGroup;
  submitted: boolean = false;
  countryInsightsCount: number = 0;
  summaryCounts: any;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  countryInsightsList: any[] = [];
  filterCountryInsightsNameList: { id: number, name: string }[] = [];
  countryList: any[] = [];
  ageList: any[] = [];
  countryInsightImport: string = 'none';
  selectedFile: any;
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  selectedCategoryId: number = 0;
  nextUrl: string = '';
  moduleId: string = ''
  categoryTypeList: { id: number, category_name: string }[] = [];
  selectedCSVFile: any;
  constructor(
    private fb: FormBuilder,
    private countryInsightsService: CountryInsightsService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {

    this.form = this.fb.group({
      country: ['', [Validators.required]],
      url: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    this.filterForm = this.fb.group({
      country: ['', [Validators.required]],
    });
  }

  closeCountryInghtsPopUpImport() {
    this.countryInsightImport = "none";
  }

  addCountryInsightspopupImport() {
    this.countryInsightImport = "block";
  }

  ngOnInit(): void {
    this.checkSubmoduleDeletePermission();
    this.getList();
    this.getCountryList();
  }

  getCountryList() {
    this.countryInsightsService.getCountryList().subscribe((data) => {
      this.countryList = data;
    });
  }

  get f() {
    return this.form.controls;
  }

  checkSubmoduleDeletePermission() {
    this.countryInsightsService.checkSubmoduleDeletePermission().subscribe(response => {
      this.submodulePermission = response.permission;
    });
  }


  url_slug: string;
  onSearchChange(event: any) {
    this.url_slug = event.value.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getList();
  }

  submitForm() {
    this.submitted = true;
    if (!this.form.valid) {
      console.log(this.form);
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    this.editImage = "";
    if (this.selectedCategoryId !== 0) {
      this.updateCountryInsight();
      return;
    }
    this.countryInsightsService.addCountryInsight({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId
    }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getList();
    });
  }

  submitFilterForm() {
    const value = this.filterForm.value;
    var data: any = {
      perpage: 10,
      page: 1,
      country: value?.country || null,
    };
    this.countryInsightsService.getCountryInsightsList(data).subscribe(response => {
      this.countryInsightsList = response.data;
      this.countryInsightsCount = response.count;
    });
  }


  getList(filterValue?: string) {
    let req = {
      page: this.page,
      perpage: this.rows,
      keyword: filterValue ? filterValue : null
    }
    this.countryInsightsService.getCountryInsightsList(req).subscribe((response) => {
      this.countryInsightsList = response.data;
      this.countryInsightsCount = response.count;
    });
  }

  resetButton() {
    this.filterForm.reset();
    this.submitFilterForm();
    this.ngOnInit();
  }


  deleteCountryInsights(countryInsight: any) {
    let data: { id: number } = {
      id: countryInsight.id
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + countryInsight?.name + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.countryInsightsService.deleteCountryInsightWithQuestions(data).subscribe((response) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.getList();
      },
      reject: () => {
        this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }

  viewQuestionsList(id: string, countryId: string) {
    localStorage.setItem('country_insights_country', countryId);
    this.router.navigate(['/country-insights', id]);
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      this.form.patchValue({
        image: this.selectedFile.name,
      });
      let reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target.result) {
          this.editImage = event.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }

  onCSVFileChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedCSVFile = inputElement.files[0];
    } else {
      this.selectedCSVFile = null;
    }
  }

  editCountryInsights(item: any) {
    this.form.reset();
    this.editImage = item?.flag;
    this.form = this.fb.group({
      country: [item?.country_id, [Validators.required]],
      url: [item?.url, [Validators.required]],
      image: [item?.flag, [Validators.required]],
    });
    this.selectedCategoryId = item?.id;
  }

  updateCountryInsight() {
    let req: any = {
      country: this.form.value.country,
      url: this.form.value.url,
      image: this.form.value.image
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.countryInsightsService.updateCountryInsight({ ...req }, this.selectedCategoryId).subscribe(data => {
      this.getList();
      this.resetForm();
      this.selectedCategoryId = null;
      this.submitted = false;
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
    });
  }

  resetForm() {
    this.form.reset();
    this.formElm.nativeElement.reset();
    this.editImage = "";
    this.selectedCategoryId = null;
  }

  searchModules(event: any) {
    console.log(event);
    this.getList(event.target.value)
  }

  downloadSampleCSV() {
    const csvData = this.generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  generateCSVData(): string {
    const csvData = [
      ['country', 'flag', 'url'],
    ];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    return csvString;
  }

  uploadFile() {
    if (this.selectedCSVFile) {
      this.countryInsightsService.importCountryInsightsFile(this.selectedCSVFile).subscribe(
        (response) => {
          this.selectedCSVFile = null;
          if (response.status == true) {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.getList();
            this.countryInsightImport = "none";
          } else {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
          }
        },
        (error) => {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        }
      );
    } else {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please choose file!",
      });
    }
  }

}
