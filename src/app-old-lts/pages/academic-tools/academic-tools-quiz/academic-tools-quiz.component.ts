import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AcademicService } from '../academic.service';
import { AcademicCategory, AcademicCategorySuccess, AcademicQuestion, AcademicQuizQuestionsAddSuccess, AcademicQuizQuestionsSuccess, AcademicResponse, GetAcademicPayload, getAcademicQuizQuestionPayload, GetAcademicToolCategoryPayload, Stream } from 'src/app/@Models/academic-tools.model';


@Component({
    selector: 'uni-academic-tools-quiz',
    templateUrl: './academic-tools-quiz.component.html',
    styleUrls: ['./academic-tools-quiz.component.scss'],
    standalone: false
})
export class AcademicToolsQuizComponent implements OnInit {
  form: any = FormGroup;

  submitted = false;
  currentModuleId = '15';
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
  currentModuleName = ''
  newquestionadd: boolean = false;
  submitafter = "none"
  newquestionaddimport = "none"
  first: number = 1;
  rows: number = 50;
  quizModule_id: string = '';
  question_id: number = 0;
  addOrUpdate: string = 'Add';
  quiz_id: string = '';
  quizCategory!: AcademicCategory;
  newstreamquestionadd: boolean = false;
  newRecommendationsQuestionadd: boolean = false;
  streamList: Stream[] = [];
  streamListForDropdown: Stream[] = [];

  streamadd: string = "none";
  streamValue: string = "";
  selectAll: boolean = false;
  selectedStreams: number[] = [];
  selectedIds = [
    { name: "option1_type_id", value: null },
    { name: "option2_type_id", value: null },
    { name: "option3_type_id", value: null },
    { name: "option4_type_id", value: null },
    { name: "option5_type_id", value: null },
    { name: "option6_type_id", value: null }
  ]
  recommandationList: { id: number, name: string }[] = [{ id: 1, name: "Excellent" }, { id: 2, name: "Good" }, { id: 3, name: "Moderate" }, { id: 4, name: "Weak" }];
  submoduleId: string = '';
  @ViewChild('formElm') formElm!: ElementRef;
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.getQuizQuestionData();
  }

  constructor(
    private academicService: AcademicService,
    private fb: FormBuilder,
    private toast: MessageService,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      currentModule: [''],
      question: ['', [Validators.required]],
      option1: ['', [Validators.required]],
      option2: ['', [Validators.required]],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

  }
  pageSize = 10;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.submoduleId = params["id"];
      this.quizModule_id = params['subModuleId'];
      this.getquizName();
      this.getQuizQuestionData();
      this.getStreams();
      this.form.get('currentModule')?.disable();
      this.getmodulename();
    });

  }
  get f() {
    return this.form.controls;
  }
 
  editQuestion(quizData: any) {
    this.form.reset();
    this.selectAddQuestionType();
    this.addOrUpdate = "Update";
    this.question_id = quizData.id;

    if (this.quizCategory?.academic_category_type_id == 1) {
      this.form.removeControl('option5');
      this.form.removeControl('option5_type_id');
      this.form.removeControl('option6');
      this.form.removeControl('option6_type_id');
      this.form.patchValue({
        question: quizData.question,
        option1: quizData.option1,
        option2: quizData.option2,
        option3: quizData.option3,
        option4: quizData.option4,
        status: quizData.status,
        option1_type_id: quizData.option1_type_id,
        option2_type_id: quizData.option2_type_id,
        option3_type_id: quizData.option3_type_id,
        option4_type_id: quizData.option4_type_id,
        currentModule: this.quizCategory.submodule_name
      });
      this.selectedIds[0].value = quizData.option1_type_id;
      this.selectedIds[1].value = quizData.option2_type_id;
      this.selectedIds[2].value = quizData.option3_type_id;
      this.selectedIds[3].value = quizData.option4_type_id;
      if (quizData?.option5) {
        this.selectedIds[4].value = quizData.option5_type_id;
        this.form.addControl('option5', new FormControl(quizData.option5, [Validators.required]));
        this.form.addControl('option5_type_id', new FormControl(quizData.option5_type_id, [Validators.required]));
      }
      if (quizData?.option6) {
        this.selectedIds[5].value = quizData.option6_type_id;
        this.form.addControl('option6', new FormControl(quizData.option6, [Validators.required]));
        this.form.addControl('option6_type_id', new FormControl(quizData.option6_type_id, [Validators.required]));
      }
      this.newstreamquestionadd = true;
    } else if (this.quizCategory?.academic_category_type_id == 2) {
      this.form.patchValue({
        question: quizData.question,
        option1: quizData.option1,
        option2: quizData.option2,
        option3: quizData.option3,
        option4: quizData.option4,
        currentModule: this.quizCategory.submodule_name,
        status: quizData.status
      });
      this.newRecommendationsQuestionadd = true;
    } else {
      this.form.patchValue({
        question: quizData.question,
        option1: quizData.option1,
        option2: quizData.option2,
        option3: quizData.option3,
        option4: quizData.option4,
        answer: quizData.answer,
        currentModule: this.quizCategory.submodule_name,
        status: quizData.status,
        summary: quizData.summary
      });
      this.newquestionadd = true;
    }
  }
  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
    this.submitafter = "block";
  }
  closeViewPopUp() {
    this.form.reset();
    this.viewQuizData = null;
    this.submitafter = "none";
  }
  closeAddQuizPopUp() {
    if (this.newstreamquestionadd == true) {
      this.newstreamquestionadd = false;
    } else if (this.newRecommendationsQuestionadd == true) {
      this.newRecommendationsQuestionadd = false;
    } else {
      this.newquestionadd = false;
    }
    this.form.reset();
    this.question_id = 0;
    this.addOrUpdate = "Add";
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.question_id === 0) {
      this.academicService.addStreamQuestion({
        ...this.form.value, module_id: this.currentModuleId, submodule_id: this.quizModule_id
      }).subscribe((data: any) => {
        if (data.status) {
          this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
        } else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
        if (this.newstreamquestionadd) {
          this.newstreamquestionadd = false;
        } else if (this.newRecommendationsQuestionadd) {
          this.newRecommendationsQuestionadd = false;
        } else {
          this.newquestionadd = false;
        }
        this.submitafter = "none";
        this.getQuizQuestionData();
        this.selectedIds = [
          { name: "option1_type_id", value: null },
          { name: "option2_type_id", value: null },
          { name: "option3_type_id", value: null },
          { name: "option4_type_id", value: null },
          { name: "option5_type_id", value: null },
          { name: "option6_type_id", value: null }
        ];
        this.submitted = false;
        this.form.reset();
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.formElm.nativeElement.reset();
      });
    } else {
      this.academicService.updateStreamQuestion({ ...this.form.value, question_id: this.question_id, module_id: this.currentModuleId, submodule_id: this.quizModule_id }).subscribe((data: AcademicQuizQuestionsAddSuccess) => {
        if (data.status == true) {
          this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
        } else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
        if (this.newstreamquestionadd) {
          this.newstreamquestionadd = false;
        } else if (this.newRecommendationsQuestionadd) {
          this.newRecommendationsQuestionadd = false;
        } else {
          this.newquestionadd = false;
        }
        this.question_id = 0;
        this.submitafter = "none";
        this.addOrUpdate = "Add";
        this.submitted = false;
        this.form.reset();
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.formElm.nativeElement.reset();
        this.getQuizQuestionData()
      });
    }
  }
  getQuizQuestionData() {
    let req: getAcademicQuizQuestionPayload = {
      module_id: this.currentModuleId,
      page: this.first,
      perpage: this.rows,
      submodule_id: this.quizModule_id
    }
    this.academicService.getQuizQuestion(req).subscribe((data: AcademicQuizQuestionsSuccess) => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
    })
  }
  toEditFromView(quizData: AcademicQuestion) {
    this.editQuestion(quizData);

    this.submitafter = 'none';
  }
  deletequiz(quiz: AcademicQuestion) {
    var data = {
      quizquestion_id: quiz.id
    }
    this.academicService.deleteQuiz(data).subscribe((data: AcademicCategorySuccess) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: data.message })
      this.getQuizQuestionData();
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
      this.academicService.importFile(this.currentModuleId, this.quizCategory?.academic_category_type_id.toString(), this.selectedFile).subscribe(
        (response: AcademicQuizQuestionsAddSuccess) => {
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
          this.newquestionaddimport = 'none';
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
      ['module_id', 'submodule_id', 'question', 'option1', 'option2', 'option3', 'option4', 'answer', 'summary'],
    ];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    return csvString;
  }

  goBack() {
    this._location.back();
  }
  getquizName() {
    let req: GetAcademicToolCategoryPayload = {
      module_id: this.currentModuleId,
      page: 1,
      perpage: 10000,
      submoduleId: this.submoduleId,
    }
    this.academicService.getQuizList(req).subscribe((response: AcademicResponse) => {
      this.quizCategory = response.data?.find((quiz: AcademicCategory) => quiz.id === Number(this.quizModule_id));
    });
  }

  selectAddQuestionType(quizData?: any) {
    this.form.get('currentModule').setValue(this.quizCategory?.submodule_name);
    if (this.quizCategory?.academic_category_type_id == 1) {
      this.form.addControl('option1_type_id', new FormControl(null, [Validators.required]));
      this.form.addControl('option2_type_id', new FormControl(null, [Validators.required]));
      this.form.addControl('option3_type_id', new FormControl(null, [Validators.required]));
      this.form.addControl('option4_type_id', new FormControl(null, [Validators.required]));
      this.newstreamquestionadd = true;
    }
    else if (this.quizCategory?.academic_category_type_id == 2) {
      this.form.addControl('option1_type_id', new FormControl(1, [Validators.required]));
      this.form.addControl('option2_type_id', new FormControl(2, [Validators.required]));
      this.form.addControl('option3_type_id', new FormControl(3, [Validators.required]));
      this.form.addControl('option4_type_id', new FormControl(4, [Validators.required]));
      this.newRecommendationsQuestionadd = true
    } else {
      this.form.addControl('answer', new FormControl('', [Validators.required]));
      this.form.addControl('summary', new FormControl('', [Validators.required]));
      this.newquestionadd = true;
    }
  }
  getStreams() {
    this.academicService.getStreamList().subscribe((response: Stream[]) => {
      this.streamList = response;
      this.streamList.map((stream: Stream) => {
        stream.selected = false;
      });
    });
  }
  selectAllStreams(event: any) {

    if (event.checked) {
      this.streamList.map((stream: Stream) => {
        stream.selected = true;
      });
      this.streamList.forEach((stream: Stream) => {
        this.selectedStreams.push(stream.id)
      })
    } else {
      this.streamList.map((stream: Stream) => {
        stream.selected = false;
      });
      this.selectedStreams = [];
    }

  }
  addStream() {
    if (!this.streamValue) {
      this.toast.add({ severity: "error", summary: "Retry", detail: "Enter stream name", });
      return;
    }
    this.academicService.addStream({ name: this.streamValue }).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.streamValue = '';
      this.getStreams();
    });
  }
  selectStream(item: Stream, event: Event) {
    if (item.selected) {
      this.selectedStreams.push(item?.id);
    } else {
      this.selectedStreams = this.selectedStreams.filter(streamId => streamId !== item.id);
    }
  }
  deleteSelected() {
    this.academicService.deleteStream(this.selectedStreams).subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message, });
      this.selectedStreams = [];
      this.getStreams();
    });
  }


  onStreamChange(optionKey: string, event: any) {
    const selectedId = event.value;
    const isAlreadyExist = this.selectedIds.find(id => id.value == selectedId);

    if (isAlreadyExist) {
      this.toast.add({ severity: "error", summary: "Retry", detail: "Select Another Stream", });
      this.form.get(optionKey).setValue(null);
      return;
    }
    this.selectedIds.map(id => {
      if (id.name == optionKey) {
        id.value = selectedId;
      }
    });
  }
  addOption() {
    if (this.form.get('option5')) {
      this.form.addControl('option6', new FormControl('', [Validators.required]));
      this.form.addControl('option6_type_id', new FormControl(null, [Validators.required]));
    } else {
      this.form.addControl('option5', new FormControl('', [Validators.required]));
      this.form.addControl('option5_type_id', new FormControl(null, [Validators.required]));
    }
  }

  removeOption(option: string) {
    if (option === 'option6') {
      this.selectedIds[5].value='';
      this.form.removeControl('option6');
      this.form.removeControl('option6_type_id');
    } else {
      if (this.form.get('option6')) {
        this.toast.add({ severity: 'info', summary: 'Info', detail: "Can't delete option 5 while option 6 is active" });
        return;
      }
      this.selectedIds[4].value='';
      this.form.removeControl('option5');
      this.form.removeControl('option5_type_id');
    }
  }
  getmodulename() {
    let req: GetAcademicPayload = {
      module_id: this.currentModuleId,
      page: 1,
      perpage: 100000,
    }
    this.academicService.getAcademicToolList(req).subscribe((response) => {
      this.currentModuleName = response.data.find(data=>data.id===Number(this.submoduleId))?.category;
    });
  }
}

