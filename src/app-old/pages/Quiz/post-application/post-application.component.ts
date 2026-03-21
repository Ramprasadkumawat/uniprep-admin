import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {QuizService} from "../quiz.service";
import {LocationService} from "../../../location.service";
import {MessageService} from "primeng/api";
import { PaginatorState } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
    selector: 'uni-post-application',
    templateUrl: './post-application.component.html',
    styleUrls: ['./post-application.component.scss'],
    standalone: false
})
export class PostApplicationComponent implements OnInit {
  form: any = FormGroup;
  filterForm: any = FormGroup;
  submitted = false;
  countryList: any;
  subModuleList: any;
  sourceFaqQuestionList: any;
  moduleList: any;
  selectedCountry = 2;
  currentModuleId = 2;
  viewQuizData: any;
  answerOptionSelection: any[] = [{
    id: 1, name: 'Option 1'
  }, {
    id: 2, name: 'Option 2'
  }, {
    id: 3, name: 'Option 3'
  }, {
    id: 4, name: 'Option 4'
  }]
  statusData: any;
  totalQuizCount: any;
  quizList: any[] = [];
  currentModuleName = 'Post-Application'

  newquestionadd = "none";
  submitafter = "none"

  first: number = 0;
  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.getQuizQuestionData();
  }

  constructor(private quizService: QuizService, private fb: FormBuilder,
              private service: LocationService, private toast: MessageService) {
  }

  pageSize = 8;

  ngOnInit(): void {
    this.form = this.fb.group({
      question_id: [''],
      module_id: [this.currentModuleId],
      submodule_id: ['', [Validators.required]],
      country_id: [this.selectedCountry, [Validators.required]],
      question: ['', [Validators.required]],
      option1: ['', [Validators.required]],
      option2: ['', [Validators.required]],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      source_faqquestion: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });


    this.filterForm = this.fb.group({
      qnum: [''],
      status: [''],
    });
    this.statusData = [{ id: null, name: 'Select Status' }, { id: 1, name: 'Active' }, { id: 2, name: 'In-Active' }];
    this.getPreApplicationSubModuleList();
    this.getModuleName();
    this.getCountryList();
    this.getUniPreQuestionList(1);
  }

  get f() {
    return this.form.controls;
  }

  // pageChange(event: any) {
  //   const page = event.first / this.pageSize + 1;
  //   this.userFacade.loadUsers({page});
  // }

  addnewquestionpopup() {
    this.form.reset();
    this.newquestionadd = "block";
  }

  closeAddQuizPopUp() {
    this.newquestionadd = "none";
  }

  addsubmitclosepopup() {
    this.submitafter = "none";
  }

  // addsubmitpenpopup(){
  //   this.newquestionadd = "none";
  //   this.submitafter = "block";
  // }
  editQuestion(quizData: any) {
    this.form.reset();
    this.sourceFaqQuestionList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      submoduleId: quizData.submodule_id
    }

    this.quizService.getUniPrepQuestion(req).subscribe(data => {
      this.sourceFaqQuestionList = data.questions;
      this.form = this.fb.group({
        question_id: [quizData.id, [Validators.required]],
        module_id: [quizData.module_id, [Validators.required]],
        submodule_id: [Number(quizData.submodule_id), [Validators.required]],
        country_id: [quizData.country_id, [Validators.required]],
        question: [quizData.question, [Validators.required]],
        option1: [quizData.option1, [Validators.required]],
        option2: [quizData.option2, [Validators.required]],
        option3: [quizData.option3, [Validators.required]],
        option4: [quizData.option4, [Validators.required]],
        answer: [quizData.answer, [Validators.required]],
        source_faqquestion: [Number(quizData.source_faqquestion), [Validators.required]],
        status: [quizData.status, [Validators.required]],
      });

      this.newquestionadd = "block";
    });
  }

  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
    this.submitafter = "block";
  }

  filterSubmit() {
    this.quizList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      qnum: this.filterForm.value.qnum,
      status: this.filterForm.value.status
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let countryName = this.countryList.find((x: any) => x.id == res.country_id);
        res.country_name = countryName.country;
      });
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == res.module_id);
        res.module_name = moduleName.module_name;
      });
    })

  }

  onSubmit() {
    this.submitted = true;
    if(!this.form.valid){
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }


    if (this.form.value.question_id == '' || this.form.value.question_id == null) {
      this.form.value.module_id = 1;
      delete this.form.value.question_id;
      this.quizService.addQuizQuestion(this.form.value).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz added successfully!' })
      });
      this.getQuizQuestionData();
      this.newquestionadd = "none";
      this.submitafter = "none";
    } else {
      this.quizService.updateQuizQuestions(this.form.value).subscribe(data => {
        this.newquestionadd = 'none';
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz updated successfully!' })
      })
    }
  }

  getQuizQuestionData() {
    this.quizList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      page: this.first + 1,
      perpage: this.rows
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let countryName = this.countryList.find((x: any) => x.id == res.country_id);
        res.country_name = countryName.country;
      });
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == res.module_id);
        res.module_name = moduleName.module_name;
      });
    })
  }

  onChangeSubModules(data: any) {
    this.getUniPreQuestionList(data.value);
  }

  getUniPreQuestionList(subModuleId: number) {
    this.sourceFaqQuestionList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      submoduleId: subModuleId
    }

    this.quizService.getUniPrepQuestion(req).subscribe(data => {
      this.sourceFaqQuestionList = data.questions;
    })
  }

  getModuleName() {
    let req = {
      countryId: this.selectedCountry,
    }
    this.quizService.getModuleNameByCountry(req).subscribe(data => {
      this.moduleList = data.modules;
    })
  }

  getCountryList() {
    this.service.getInterestedCountryList().subscribe(data => {
      this.countryList = data;
      this.getQuizQuestionData();
    })
  }

  getPreApplicationSubModuleList() {
    this.subModuleList = [];
    this.quizService.getPreApplicationSubModule().subscribe(data => {
      this.subModuleList = data.submodules;
    })
  }

  closeViewPopUp(quizData: any) {
    this.editQuestion(quizData);
    this.newquestionadd = 'block';
    this.submitafter = 'none';
  }

  countryOnChange(event: any) {
    this.selectedCountry = event.value;
    this.getQuizQuestionData();
  }

}
