import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestListService } from '../test-list.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStorageService } from 'ngx-localstorage';
import { ActivatedRoute, Params } from '@angular/router';
import { GetSubcategoryPayload, SubCategoriesList, UpdateSubCategoryPayload } from 'src/app/@Models/test-categories.model';

@Component({
    selector: 'uni-test-sub-category-list',
    templateUrl: './test-sub-category-list.component.html',
    styleUrls: ['./test-sub-category-list.component.scss'],
    standalone: false
})
export class TestSubCategoryListComponent implements OnInit {
  form: FormGroup;
  subModuleName: string = "Employer";
  submitted: boolean = false;
  categoryCount: number = 0;
  summaryCounts: any;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  subModuleList: SubCategoriesList[] = [];
  selectedFile: any;
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  moduleId: string = '13';
  category_id: string = '1';
  selectedSubCategory: number = 0;

  constructor(
    private fb: FormBuilder,
    private testListService: TestListService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {

    this.form = this.fb.group({
      categoryname: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });


  }

  ngOnInit(): void {
    this.moduleId = this.localStorage.get('moduleId');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.category_id = params['categoryId'];
    });
    this.getSubCategories();
    this.checkSubmoduleDeletePermission();
  }
  get f() {
    return this.form.controls;
  }

  checkSubmoduleDeletePermission() {
    this.testListService.checkSubmoduleDeletePermission().subscribe(response => {
      this.submodulePermission = response.permission;
    });
  }


  // url_slug: string;
  // onSearchChange(event: any) {
  //   this.url_slug = event.value.toLowerCase()
  //     .replace(/ /g, '-')
  //     .replace(/[^\w-]+/g, '');
  // }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getSubCategories();
  }

  submitForm() {
    this.submitted = true;
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    this.editImage = null;
    if (this.selectedSubCategory) {
      this.updateSubCategory();
      return;
    }
    this.testListService.addSubCategory({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId, parent_category_id: this.category_id
    }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getSubCategories();
    });

  }
  getSubCategories() {
    let req: GetSubcategoryPayload = {
      moduleId: this.moduleId,
      categoryId: this.category_id,
      page: this.page,
      perpage: this.rows
    }
    this.testListService.getSubCategoryList(req).subscribe((response) => {
      this.subModuleList = response.data;
      this.categoryCount = response.count;
    });
  }

  deleteSubmoduleandQuestion(value: SubCategoriesList) {
    let data = {
      sub_category_id: value.sub_category_id
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + value.category + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.testListService.deleteSubCategory(data).subscribe((response) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.getSubCategories();
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
    }
  }
  editSubCategoryName(item: SubCategoriesList) {
    this.form.reset();
    this.editImage = item.icon;
    this.form = this.fb.group({
      categoryname: [item.category, [Validators.required]],
      urlslug: [item.url_slug, [Validators.required]],
      image: [item.icon, [Validators.required]],
    });
    this.selectedSubCategory = item.sub_category_id;
  }

  updateSubCategory() {
    let req: UpdateSubCategoryPayload = {
      categoryname: this.form.value.categoryname,
      urlslug: this.form.value.urlslug,
      image: this.selectedFile
    }
    this.testListService.updateSubCategory(req, this.selectedSubCategory).subscribe(data => {
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getSubCategories();
      this.editImage = '';
      this.selectedSubCategory = 0;
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
    });
  }

  resetForm(form: any) {
    form.reset();
    this.formElm.nativeElement.reset();
  }
}
