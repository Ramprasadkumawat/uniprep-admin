import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TestListService } from '../test-list.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from 'ngx-localstorage';
import { GetQuizPayload, Quiz } from 'src/app/@Models/test-categories.model';

@Component({
    selector: 'uni-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.scss'],
    standalone: false
})
export class QuizListComponent implements OnInit {

  form: FormGroup;
  moduleTitle: string = "Pshychometric Test";
  submitted: boolean = false;
  categoryCount: number = 0;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  quizList: Quiz[] = [];
  selectedFile: any;
  submodulePermission: number = 0;
  @ViewChild('formElm') formElm!: ElementRef;
  editImage: string = "";
  moduleId: string = '11';
  categoryId: string = '1';
  quizLevelList: { id: number, name: string }[] = [{ id: 0, name: 'Select' }, { id: 1, name: 'Basic' }, { id: 2, name: 'intermediate' }, { id: 3, name: 'Advanced' }];
  moduleName: string = "";
  selectedQuizId: number = 0;

  constructor(
    private fb: FormBuilder,
    private testListService: TestListService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {

    this.form = this.fb.group({
      submodulename: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
      level: ['', [Validators.required]]
    });


  }

  ngOnInit(): void {
    this.moduleId = this.localStorage.get('moduleId');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.categoryId = params['categoryId'];
    });
    this.checkmodule();
    this.getQuizList();
    this.checkSubmoduleDeletePermission();
  }
  checkmodule() {
    switch (this.moduleId) {
      case '11':
        this.moduleTitle = "Pshychometric";
        this.moduleName = "pshychometric-test";
        break;
      case '12':
        this.moduleTitle = "Personality";
        this.moduleName = "personality-test";
        break;
      case '13':
        this.moduleTitle = "Employer";
        this.moduleName = "employer-test";
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
    this.getQuizList();
  }

  submitForm() {
    this.submitted = true;
    this.editImage = null;
    if (this.moduleId !== '11') {
      this.form.get('level')?.clearValidators();
      this.form.get('level')?.updateValueAndValidity();
    }
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.selectedQuizId !== 0) {
      this.updateQuiz();
      return;
    }
    this.testListService.addQuiz({
      ...this.form.value, image: this.selectedFile,
      moduleId: this.moduleId, category_id: this.categoryId
    }).subscribe((response) => {

      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getQuizList();
    });
  }
  getQuizList() {
    let req: GetQuizPayload = {
      categoryId: this.categoryId,
      page: this.page,
      perpage: this.rows,
    }
    this.testListService.getQuizList(req).subscribe((response) => {
      this.quizList = response.data;
      this.categoryCount = response.count;
    });
  }

  deleteQuiz(value: Quiz) {
    let data = {
      submodule_id: value.id,
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + value.submodule_name + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.testListService.deleteQuizWithQuestions(data).subscribe((response) => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.getQuizList();
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

  editQuiz(item: Quiz) {
    this.form.reset();
    this.editImage = item.icon;
    this.form = this.fb.group({
      submodulename: [item.submodule_name, [Validators.required]],
      urlslug: [item.urlslug, [Validators.required]],
      image: [item.icon, [Validators.required]],
      level: [this.moduleId === '11' ? item?.level : null]
    });
    this.selectedQuizId = item.id;
  }

  updateQuiz() {
    let req: any = {
      submodulename: this.form.value.submodulename,
      urlslug: this.form.value.urlslug,
      submodule_id: this.selectedQuizId,
    }
    if (this.form.value?.level) {
      req.level = this.form.value?.level;
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.testListService.updateQuiz(req, this.selectedQuizId).subscribe(data => {
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getQuizList();
      this.selectedQuizId = 0;
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
    });
  }

  resetForm(form: any) {
    form.reset();
    this.formElm.nativeElement.reset();
    this.selectedQuizId = 0;
    this.editImage = null;
  }



}
