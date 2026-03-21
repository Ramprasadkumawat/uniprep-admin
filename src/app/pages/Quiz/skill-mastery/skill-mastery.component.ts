import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { QuizService } from '../quiz.service';
import { LocationService } from 'src/app/location.service';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
 
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
 

@Component({
    selector: 'uni-skill-mastery',
    templateUrl: './skill-mastery.component.html',
    styleUrls: ['./skill-mastery.component.scss'],
    standalone: false
})

export class SkillMasteryComponent implements OnInit {
  isSKillMasteryCategories: boolean = true;
  form: any = FormGroup;
  filterForm: any = FormGroup;
  submitted = false;
  countryList: any;
  subModuleList: any;
  sourceFaqQuestionList: any;
  moduleList: any;
  selectedCountry: number = 0;
  currentModuleId = 10;
  viewQuizData: any;
  selectedFile: any;
  skillMasterySubmoduleId: number = 0;
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
  currentModuleName = 'Skill Mastery';
  @ViewChild('formelm') formElm: ElementRef;
  @ViewChild('filterFormElm') filterFormElm: ElementRef;

  newquestionadd = "none";
  submitafter = "none"
  newquestionaddimport = "none"
  first: number = 0;
  rows: number = 10;
  getSkillMasteryList: any[] = [];
  getSkillMasteryListLength: number = 0;
  AddOrUpdate: string = 'Add';
  pageno:number = 1;
  perPage:number = 50;

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder,
    private toast: MessageService
  ) { }

  pageSize = 8;

  ngOnInit(): void {
    this.form = this.fb.group({
      question_id: [''],
      module_id: [10],
      submodule_id: [this.skillMasterySubmoduleId],
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
    this.getSkillMastery();
  }

  get f() {
    return this.form.controls;
  }



  addnewquestionpopup() {
    this.form.reset();
    this.newquestionadd = "block";
  }

  closeAddQuizPopUp() {
    this.newquestionadd = "none";
    this.AddOrUpdate = 'Add';
    this.form.reset();
    this.formElm.nativeElement.reset();
  }

  addsubmitclosepopup() {
    this.submitafter = "none";
  }
  addnewquestionpopupImport() {
    this.newquestionaddimport = "block";
  }
  closeAddQuizPopUpImport() {
    this.newquestionaddimport = "none";
  }
  // addsubmitpenpopup(){
  //   this.newquestionadd = "none";
  //   this.submitafter = "block";
  // }
  editQuestion(quizData: any) {
    this.form.reset();
    this.AddOrUpdate = 'Update'
    this.sourceFaqQuestionList = [];
    this.form = this.fb.group({
      question_id: [quizData.id, [Validators.required]],
      module_id: [quizData.module_id, [Validators.required]],
      submodule_id: [Number(quizData.submodule_id), [Validators.required]],
      question: [quizData.question, [Validators.required]],
      option1: [quizData.option1, [Validators.required]],
      option2: [quizData.option2, [Validators.required]],
      option3: [quizData.option3, [Validators.required]],
      option4: [quizData.option4, [Validators.required]],
      answer: [quizData.answer, [Validators.required]],
      source_faqquestion: [quizData.source_faqquestion, [Validators.required]],
      status: [quizData.status, [Validators.required]],
    });
    this.newquestionadd = "block";

  }

  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
    this.submitafter = "block";
  }
  onPageChange(event: PaginatorState) {
    // this.first = event.first ?? 0;
    // this.rows = event.rows ?? 10;
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : this.pageno ,
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      qnum: this.filterForm.value.qnum,
      status: this.filterForm.value.status,
      submoduleid: this.skillMasterySubmoduleId,
  }
  this.quizService.getQuizQuestion(data).subscribe(data => {
    this.submitted = false;
    this.quizList = data?.questions;
    this.totalQuizCount = data.count;
  })
}
  getQuestionList() {
    this.quizList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      qnum: this.filterForm.value.qnum,
      status: this.filterForm.value.status,
      submoduleid: this.skillMasterySubmoduleId,
      perpage : this.perPage,
      page : this.pageno,
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.submitted = false;
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
    })

  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.form.value.question_id == '' || this.form.value.question_id == null) {
      this.form.value.module_id = this.currentModuleId;
      this.form.value.submodule_id = this.skillMasterySubmoduleId;

      delete this.form.value.question_id;
      this.quizService.addQuizQuestion({ ...this.form.value, country_id: this.selectedCountry }).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz added successfully!' });
        this.getQuestionList();
      });
      this.newquestionadd = "none";
      this.submitafter = "none";
    } else {
      this.quizService.updateQuizQuestions({ ...this.form.value, country_id: this.selectedCountry}).subscribe(data => {
        this.newquestionadd = 'none';
        this.AddOrUpdate = 'Add';
        this.getQuestionList();

        this.form.reset();
        this.formElm.nativeElement.reset();
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz updated successfully!' })
      })
    }
  }



  getUniPreQuestionList() {
    this.sourceFaqQuestionList = [];
    let req = {
      moduleId: this.currentModuleId,
      countryId: this.selectedCountry,
      submoduleId: this.skillMasterySubmoduleId
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



  // getPreApplicationSubModuleList() {
  //   this.subModuleList = [];
  //   this.quizService.getPreApplicationSubModule().subscribe(data => {
  //     this.subModuleList = data.submodules;
  //   })
  // }

  closeViewPopUp(quizData: any) {
    this.editQuestion(quizData);
    this.newquestionadd = 'block';
    this.submitafter = 'none';
  }


  deletequiz(quiz: any) {
    var data = {
      quizquestion_id: quiz.id,
    }
    this.quizService.deleteQuiz(data).subscribe(data => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz Deleted successfully!' })
      this.getQuestionList()
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

  uploadFile() {
    if (this.selectedFile) {
      this.quizService.bulkUploadFile(this.selectedFile).subscribe(
        (response) => {
          this.selectedFile = null;
          if (response.status == "true") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.getQuestionList();
            this.newquestionaddimport='none';
          } else {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
            this.getQuestionList();
            this.newquestionaddimport='none';
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
  downloadSampleCSV() {
    const csvData = this.generateCSVData(); // Generate your CSV data here
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample.csv'; // File name for download
    document.body.appendChild(a);

    // Simulate click on the link to trigger download
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  generateCSVData(): string {
    // Generate your CSV data here based on the provided fields
    const csvData = [
      ['module_id', 'submodule_id', 'country_id', 'question', 'option1', 'option2', 'option3', 'option4', 'answer', 'source_faq_question'],
    ];

    // Convert CSV data to string format
    const csvString = csvData.map(row => row.join(',')).join('\n');
    return csvString;
  }
  getSkillMastery() {
    var data = {
      country_id: 0,
      module_id: 10
    }
    this.quizService.getPreUniversityCountrywiseList(data).subscribe((res: any) => {
      this.getSkillMasteryList = res
      this.getSkillMasteryListLength = res.length
    })
  }
  showSkillMasteryQuestions(id: number) {
    this.isSKillMasteryCategories = false;
    this.skillMasterySubmoduleId = id;
    this.getModuleName();
    this.getUniPreQuestionList();
    this.getQuestionList();
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.getQuestionList();
  }
  exportFile() {
    let data: any = {
      moduleId: 10,
      country_id:0,
      submoduleId: this.skillMasterySubmoduleId,
      page: this.first + 1,
      perpage: this.rows,
    };
    const formData = this.filterForm.value;
    if (formData.status) {
      data.status = formData.status;
    }
    this.quizService.QuesExport(data).subscribe((response) => {
      this.quizService.downloadFile(response.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);
  
        a.href = objectUrl;
        a.download ="SkillMastery_quiz.csv";  
        document.body.appendChild(a);
  
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    });
  }
  goBack() {
    this.isSKillMasteryCategories=true;
  }
}
