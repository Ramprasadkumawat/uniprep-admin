import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from 'ngx-localstorage';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { TestListService } from '../test-list.service';
import { CategorySuccess, GetQuizPayload, getQuizQuestionPayload, question, Quiz, QuizQuestionsAddSuccess, QuizQuestionsSuccess, QuizResponse } from 'src/app/@Models/test-categories.model';

@Component({
    selector: 'uni-quiz-question-list',
    templateUrl: './quiz-question-list.component.html',
    styleUrls: ['./quiz-question-list.component.scss'],
    standalone: false
})
export class QuizQuestionListComponent implements OnInit {
  form: any = FormGroup;
  // filterForm: any = FormGroup;
  submitted = false;
  moduleList: question[] = [];
  currentModuleId = '11';
  viewQuizData: any;
  selectedFile: any;
  answerOptionSelection: any[] = [{
    id: 1, name: 'Option 1'
  }, {
    id: 2, name: 'Option 2'
  }, {
    id: 3, name: 'Option 3'
  }, {
    id: 4, name: 'Option 4'
  }]
  statusData: { id: number, name: string }[] = [{ id: null, name: 'Select Status' }, { id: 1, name: 'Active' }, { id: 2, name: 'In-Active' }];;
  totalQuizCount: any;
  quizList: any[] = [];
  currentModuleName = 'Psychometric Test'
  newquestionadd = "none";
  submitafter = "none"
  newquestionaddimport = "none"
  first: number = 1;
  rows: number = 50;
  quizModule_id: string = '';
  question_id: number = 0;
  addOrUpdate: string = 'Add';
  quiz_id: string = '';
  quizName: string = '';
  @ViewChild('formElm') formElm!: ElementRef;
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.getQuizQuestionData();
  }

  constructor(
    private testListService: TestListService,
    private fb: FormBuilder,
    private toast: MessageService,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
  ) {
    this.form = this.fb.group({
      currentModule: ['test'],
      question: ['', [Validators.required]],
      option1: ['', [Validators.required]],
      option2: ['', [Validators.required]],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      source_summary: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  pageSize = 10;

  ngOnInit(): void {
    // this.filterForm = this.fb.group({
    //   status: [''],
    // });
    this.activatedRoute.params.subscribe((params: Params) => {
      this.quizModule_id = params["quizModuleId"];
      this.getquizName(params['categoryId']);
      this.currentModuleId = this.localStorage.get('moduleId');
      this.checkmodule();
      this.getQuizQuestionData();
    });

  }

  get f() {
    return this.form.controls;
  }
  checkmodule() {
    switch (this.currentModuleId) {
      case '11':
        this.currentModuleName = "Pshychometric";
        break;
      case '12':
        this.currentModuleName = "Personality";
        break;
      case '13':
        this.currentModuleName = "Employer";
        break;
    }
  }

  editQuestion(quizData: question) {
    this.form.reset();
    this.addOrUpdate = "Update";
    this.question_id = quizData.id,
      this.form.patchValue({
        question: quizData.question,
        option1: quizData.option1,
        option2: quizData.option2,
        option3: quizData.option3,
        option4: quizData.option4,
        answer: quizData.answer,
        source_summary: quizData.source_summary,
        status: quizData.status,
        currentModule: this.quizName
      });
    this.newquestionadd = "block";
  }

  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
    this.submitafter = "block";
  }

  // filterSubmit() {
  //   this.quizList = [];
  //   let req = {
  //     moduleId: 8,
  //     countryId: 0,
  //     page: this.first + 1,
  //     perpage: this.rows,
  //     status: this.filterForm.value.status,
  //     submoduleId: this.quizModule_id
  //   }

  //   this.testListService.getQuizQuestion(req).subscribe(data => {
  //     this.quizList = data?.questions;
  //     this.totalQuizCount = data.count;
  //     this.quizList.map((res) => {
  //       let moduleName = this.moduleList.find((x: any) => x.id == 8);
  //       res.module_name = moduleName.module_name;
  //     });
  //   })

  // }

  closeAddQuizPopUp() {
    this.form.reset();
    this.newquestionadd = "none";
  }

  onSubmit() {
    this.submitted = true;

    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.question_id === 0) {
      this.testListService.addQuizQuestion({
        ...this.form.value, module_id: this.currentModuleId, country_id: 0, submodule_id: this.quizModule_id
      }).subscribe((data: QuizQuestionsAddSuccess) => {
        if (data.status) {
          this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
        } else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
        this.newquestionadd = 'none';
        this.submitafter = "none";
        this.getQuizQuestionData()
        this.form.reset();
        this.formElm.nativeElement.reset();
        // this.filterSubmit();
      });

    } else {
      this.testListService.updateQuizQuestions({ ...this.form.value, question_id: this.question_id, module_id: this.currentModuleId, country_id: 0, submodule_id: this.quizModule_id }).subscribe((data: QuizQuestionsAddSuccess) => {
        if (data.status == true) {
          this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
        } else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
        this.newquestionadd = 'none';
        this.submitafter = "none";
        this.form.reset();
        this.formElm.nativeElement.reset();
        this.getQuizQuestionData()
        // this.filterSubmit();
      })
    }
  }

  getQuizQuestionData() {
    let req: getQuizQuestionPayload = {
      moduleId: this.currentModuleId,
      countryId: 0,
      page: this.first,
      perpage: this.rows,
      submoduleId: this.quizModule_id
    }
    this.testListService.getQuizQuestion(req).subscribe((data: QuizQuestionsSuccess) => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
    })
  }



  toEditFromView(quizData: any) {
    this.editQuestion(quizData);
    this.newquestionadd = 'block';
    this.submitafter = 'none';
  }

  deletequiz(quiz: question) {
    var data = {
      quizquestion_id: quiz.id
    }
    this.testListService.deleteQuiz(data).subscribe((data: CategorySuccess) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message })
      this.getQuizQuestionData();
      // this.filterSubmit();
    })
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.testListService.importFile(this.currentModuleId, this.selectedFile).subscribe(
        (response: QuizQuestionsAddSuccess) => {
          this.selectedFile = null;
          if (response.status) {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
          } else {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
          }
          this.newquestionaddimport='none';
          this.getQuizQuestionData();
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
      ['module_id', 'submodule_id', 'question', 'option1', 'option2', 'option3', 'option4', 'answer', 'source_summary'],
    ];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    return csvString;
  }

  exportFile() {
    //   let data: any = {
    //     moduleId: 8,
    //     country_id: 0,
    //     submoduleId: this.quizModule_id,
    //   };
    //   const formData = this.filterForm.value;
    //   if (formData.status) {
    //     data.status = formData.status;
    //   }
    //   this.quizService.QuesExport(data).subscribe((response) => {
    //     this.quizService.downloadFile(response.link).subscribe((blob) => {
    //       const a = document.createElement("a");
    //       const objectUrl = window.URL.createObjectURL(blob);

    //       a.href = objectUrl;
    //       a.download = "LearningHub_quiz.csv";
    //       document.body.appendChild(a);

    //       a.click();
    //       window.URL.revokeObjectURL(objectUrl);
    //       document.body.removeChild(a);
    //     });
    //   });
  }
  goBack() {
    this._location.back();
  }
  getquizName(categoryId) {
    let req: GetQuizPayload = {
      categoryId: categoryId,
      page: 1,
      perpage: 10000,
    }
    this.testListService.getQuizList(req).subscribe((response: QuizResponse) => {
      this.quizName = response.data.find((quiz: Quiz) => quiz.id === Number(this.quizModule_id)).submodule_name;
      this.form.get('currentModule').setValue(this.quizName);
      this.form.get('currentModule')?.disable();
    });
  }
}
