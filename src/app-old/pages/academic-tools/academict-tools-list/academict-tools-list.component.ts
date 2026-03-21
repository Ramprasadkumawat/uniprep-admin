import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { AcademicCategory, GetAcademicPayload } from 'src/app/@Models/academic-tools.model';
import { AcademicService } from '../academic.service';
import { CategoriesList, CategoryResponse, UpdateCategoryPayload } from 'src/app/@Models/test-categories.model';

@Component({
    selector: 'uni-academict-tools-list',
    templateUrl: './academict-tools-list.component.html',
    styleUrls: ['./academict-tools-list.component.scss'],
    standalone: false
})
export class AcademictToolsListComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  categoryCount: number = 0;
  summaryCounts: any;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  categoriesList: CategoriesList[] = [];
  selectedFile: any;
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  selectedCategoryId: number = 0;
  nextUrl: string = '';
  categoryTypeList: { id: number, category_name: string }[] = [];
  moduleId: string = '15';
  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
  ) {

    this.form = this.fb.group({
      categoryname: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.checkSubmoduleDeletePermission();
    this.getAcademicToolList();
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
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getAcademicToolList();
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
    this.academicService.addAcademicTool({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId
    }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getAcademicToolList();
    });
  }
  getAcademicToolList() {
    let req: GetAcademicPayload = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.rows,
    }
    this.academicService.getAcademicToolList(req).subscribe((response) => {
      this.categoriesList = response.data;
      this.categoryCount = response.count;
    });
  }


  deleteCategory(category: CategoriesList) {
    let data: { category_id: number } = {
      category_id: category.id
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + category?.category + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.academicService.deleteAcademicToolWithQuestions(data).subscribe((response) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.getAcademicToolList();
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
    this.editImage = item?.icon;
    this.form = this.fb.group({
      categoryname: [item?.category, [Validators.required]],
      urlslug: [item?.url_slug, [Validators.required]],
      image: [item?.icon, [Validators.required]],
    });
    this.selectedCategoryId = item?.id;
  }

  updateCategory() {
    let req: any = {
      categoryname: this.form.value.categoryname,
      urlslug: this.form.value.urlslug,
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.academicService.updateAcademicTool(req, this.selectedCategoryId).subscribe(data => {
      this.getAcademicToolList();
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

}






