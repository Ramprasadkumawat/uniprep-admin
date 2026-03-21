import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TestListService } from '../test-list.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-localstorage';
import { CategoriesList } from 'src/app/@Models/test-categories.model';

@Component({
    selector: 'uni-test-category-list',
    templateUrl: './test-category-list.component.html',
    styleUrls: ['./test-category-list.component.scss'],
    standalone: false
})
export class TestCategoryListComponent implements OnInit {

  @Input() moduleId: string = '11';
  form: FormGroup;
  subModuleName: string = "Pshychometric Test";
  submitted: boolean = false;
  categoryCount: number = 0;
  summaryCounts: any;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  categoriesList: CategoriesList[] = [];
  selectedFile: any;
  categories: any = [];
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  selectedCategoryId: number = 0;
  nextUrl: string = '';


  constructor(
    private fb: FormBuilder,
    private testListService: TestListService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private localStorage: LocalStorageService
  ) {

    this.form = this.fb.group({
      categoryname: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });


  }

  ngOnInit(): void {
    this.checkmodule();
    this.getCategories();
    this.checkSubmoduleDeletePermission();
  }
  checkmodule() {
    this.localStorage.set('moduleId', this.moduleId);
    switch (this.moduleId) {
      case '11':
        this.subModuleName = "Pshychometric";
        break;
      case '12':
        this.subModuleName = "Personality";
        break;
      case '13':
        this.subModuleName = "Employer";
        break;
    }
  }



  get f() {
    return this.form.controls;
  }

  checkSubmoduleDeletePermission() {
    this.testListService.checkSubmoduleDeletePermission().subscribe(response => {
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
    this.getCategories();
  }

  submitForm() {
    this.submitted = true;
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    this.editImage = "";
    if (this.selectedCategoryId !== 0) {
      this.updateCategory();
      return;
    }
    this.testListService.addCategory({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId
    }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getCategories();
    });
  }
  getCategories() {
    let req = {
      moduleId: this.moduleId,
      page: this.page,
      perpage: this.rows,
    }
    this.testListService.getCategoriesList(req).subscribe((response) => {
      this.categoriesList = response.data;
      this.categoryCount = response.count;
    });
  }

  deleteCategory(category: CategoriesList) {
    let data = {
      category_id: category.id,
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + category.category + "Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.testListService.deleteCategoryWithQuestions(data).subscribe((response) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.getCategories();
      },
      reject: () => {
        this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
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

  editCategory(item: CategoriesList) {
    this.form.reset();
    this.editImage = item.icon;
    this.form = this.fb.group({
      categoryname: [item.category, [Validators.required]],
      urlslug: [item.url_slug, [Validators.required]],
      image: [item.icon, [Validators.required]],
    });
    this.selectedCategoryId = item.id;
  }

  updateCategory() {
    let req: any = {
      categoryname: this.form.value.categoryname,
      urlslug: this.form.value.urlslug,
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.testListService.updateCategory(req, this.selectedCategoryId).subscribe(data => {
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getCategories();
      this.selectedCategoryId = null;
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
    });
  }

  resetForm(form: any) {
    form.reset();
    this.formElm.nativeElement.reset();
    this.editImage = "";
    this.selectedCategoryId = null;
  }
  navigate(category_id: number) {
    let moduleUrl = "";
    switch (this.moduleId) {
      case '11':
        moduleUrl = "pshychometric-test";
        break;
      case '12':
        moduleUrl = "personality-test";
        break;
      case '13':
        moduleUrl = "employer-test";
        break;
    }
    if (this.moduleId != '13') {
      this.router.navigate([`/quiz/${moduleUrl}/${category_id}/list`]);
    } else {
      this.router.navigate([`/quiz/${moduleUrl}/${category_id}/sub-category`]);
    }
  }

}
