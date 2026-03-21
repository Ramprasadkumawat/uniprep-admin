import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { AcademicService } from '../academic.service';
import { AcademicCategory, GetAcademicPayload, AcademicPayload, GetAcademicToolCategoryPayload } from 'src/app/@Models/academic-tools.model';

@Component({
    selector: 'uni-academic-tools-category',
    templateUrl: './academic-tools-category.component.html',
    styleUrls: ['./academic-tools-category.component.scss'],
    standalone: false
})
export class AcademicToolsCategoryComponent implements OnInit {

  moduleId: string = '15';
  form: FormGroup;
  subModuleName: string = "Grade 8";
  submitted: boolean = false;
  categoryCount: number = 0;
  summaryCounts: any;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  categoriesList: AcademicCategory[] = [];
  selectedFile: any;
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  selectedCategoryId: number = 0;
  nextUrl: string = '';
  categoryTypeList: { id: number, category_name: string }[] = [];
  subModuleId: string = '';


  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private activateRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      submodulename: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
      category_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(res => {
      this.subModuleId = res?.id;
      this.getCategories();
    });
    this.getAcademicToolList();
    this.getCategyTypeList();
    this.checkSubmoduleDeletePermission();
  }
  get f() {
    return this.form.controls;
  }

  checkSubmoduleDeletePermission() {
    this.academicService.checkSubmoduleDeletePermission().subscribe(response => {
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
    this.page = (event.page ?? 0) + 1;  // PrimeNG uses 0-based index
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
    this.academicService.addQuiz({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId, submoduleId: this.subModuleId
    }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getCategories();
    });
  }
  getCategories() {
    let req: GetAcademicToolCategoryPayload = {
      module_id: this.moduleId,
      submoduleId: this.subModuleId,
      page: this.page,
      perpage: this.rows,
    }
    this.academicService.getQuizList(req).subscribe((response) => {
      this.categoriesList = response.data;
      this.categoryCount = response.count;
    });
  }
  getCategyTypeList() {
    this.academicService.getCategoryTypeList().subscribe((response) => {
      this.categoryTypeList = response;
      this.categoryTypeList.unshift({ id: null, category_name: "Select" })
    });
  }

  deleteCategory(category: AcademicCategory) {
    let data: any = {
      submoduleId: category.id
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + category.submodule_name + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.academicService.deleteQuizWithQuestions(data).subscribe((response) => {
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

  editCategory(item: AcademicCategory) {
    this.form.reset();
    this.editImage = item.icon;
    this.form = this.fb.group({
      submodulename: [item.submodule_name, [Validators.required]],
      urlslug: [item.urlslug, [Validators.required]],
      image: [item.icon, [Validators.required]],
      category_id: [item.academic_category_type_id, [Validators.required]],
    });
    this.selectedCategoryId = item.id;
  }

  updateCategory() {
    let req: AcademicPayload = {
      submodulename: this.form.value.submodulename,
      urlslug: this.form.value.urlslug,
      category_id: this.form.value.category_id,
      submoduleId: this.subModuleId
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.academicService.updateQuiz(req, this.selectedCategoryId).subscribe(data => {
      this.getCategories();
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
  getAcademicToolList() {
    let req: GetAcademicPayload = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.rows,
    }
    this.academicService.getAcademicToolList(req).subscribe((response) => {
      this.subModuleName = response.data?.find(tool => tool?.id === Number(this.subModuleId))?.category;
    });
  }
}
