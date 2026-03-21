import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { FounderstoolService } from '../founderstool.service';
import { LocalStorageService } from 'ngx-localstorage';
import { ActivatedRoute, Params } from '@angular/router';
import { CategorySuccess, GetQuizPayload, getQuizQuestionPayload, question, Quiz, QuizQuestionsAddSuccess, QuizQuestionsSuccess, QuizResponse } from 'src/app/@Models/test-categories.model';
import { PaginatorState } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
} 
@Component({
    selector: 'uni-entreprenuerquiz',
    templateUrl: './entreprenuerquiz.component.html',
    styleUrls: ['./entreprenuerquiz.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, DialogModule, ConfirmPopupModule
    ],
    providers: [ConfirmationService]
})
export class EntreprenuerquizComponent implements OnInit {
  form: any = FormGroup;
  // filterForm: any = FormGroup;
  submitted = false;
  countryList: any;
  subModuleList: any;
  sourceFaqQuestionList: any;
  moduleList: any;
  currentModuleId = "";
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
  statusData: any;
  totalQuizCount: any;
  quizList: any[] = [];
  currentModuleName = 'Learning Hub'

  newquestionadd = "none";
  submitafter = "none"
  newquestionaddimport="none"
  first: number = 0;
  rows: number = 50;
  module_id :string='';
  submodule_id :string='';
  question_id:string='';
  addOrUpdate:string='Add'
  pageno:number = 1;
  perPage:number = 50;
  constructor(private quizService: FounderstoolService, private fb: FormBuilder,private toast: MessageService) {}

  pageSize = 8;

  ngOnInit(): void {
    // let url = window.location.href;
    // let parts = url.split("/");
    // let lastTwoParts = parts.slice(-2);
    this.module_id  = localStorage.getItem('entrepreneurmoduleid');
    this.submodule_id  = localStorage.getItem('etreprenuersubid');
    this.currentModuleId =localStorage.getItem('entrepreneurmoduleid')
    this.form = this.fb.group({
      submodule_id: ['',],
      question: ['', [Validators.required]],
      option1: ['', [Validators.required]],
      option2: ['', [Validators.required]],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      source_summary: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });


    // this.filterForm = this.fb.group({
    //   status: [''],
    // });
    this.statusData = [{ id: null, name: 'Select Status' }, { id: 1, name: 'Active' }, { id: 2, name: 'In-Active' }];
    // this.getPreApplicationSubModuleList();
    // this.getModuleName();
    this.getQuizQuestionData();
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
    this.addOrUpdate="Add";
  }
  addsubmitclosepopup() {
    this.submitafter = "none";
  }
  editQuestion(quizData: any) {
    this.form.reset();
    this.addOrUpdate="Update";
      this.question_id=quizData.id,
      this.form = this.fb.group({
        question: [quizData.question, [Validators.required]],
        option1: [quizData.option1, [Validators.required]],
        option2: [quizData.option2, [Validators.required]],
        option3: [quizData.option3, [Validators.required]],
        option4: [quizData.option4, [Validators.required]],
        answer: [quizData.answer, [Validators.required]],
        source_summary: [quizData.source_summary, [Validators.required]],        
        status: [quizData.status, [Validators.required]],
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
  //     page: this.first + 1,
  //     perpage: this.rows,
  //     status: this.filterForm.value.status,
  //     moduleId : 9,
  //     languagetype: this.languagetype,
  //     language_id :this.language_id
  //   }
  
  //   this.quizService.getQuizQuestion(req).subscribe(data => {
  //     this.quizList = data?.questions;
  //     this.totalQuizCount = data.count;
  //     this.quizList.map((res) => {
  //       let moduleName = this.moduleList.find((x: any) => x.id == 8);
  //       res.module_name = moduleName.module_name;
  //     });
  //   })

  // }

  onSubmit() {
    this.submitted = true;
    if(!this.form.valid){
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.question_id == '') {
      this.quizService.addQuizQuestion({...this.form.value,module_id:this.currentModuleId,country_id:0,submodule_id :this.submodule_id
      }).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz added successfully!' })
        this.getQuizQuestionData();
      });
      this.newquestionadd = "none";
      this.submitafter = "none";
    } else {
      this.quizService.updateQuizQuestions({...this.form.value,question_id:this.question_id,module_id:this.currentModuleId,submodule_id :this.submodule_id}).subscribe(data => {
        this.newquestionadd = 'none';
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz updated successfully!' })
        this.getQuizQuestionData();
      })
    }
  }
  onPageChange(event: PaginatorState) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let req = {
      moduleId : this.currentModuleId,
      submoduleId: this.submodule_id,
      page:this.pageno ,
      perpage:this.perPage,
      countryId: 0,
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == 8);
        res.module_name = moduleName.module_name;
      });
    })
  }
  getQuizQuestionData() {
    this.quizList = [];
    let req = {
      moduleId : this.currentModuleId,
      submoduleId: this.submodule_id,
      page:this.pageno ,
      perpage:this.perPage,
      countryId: 0,
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == 8);
        res.module_name = moduleName.module_name;
      });
    })
  }

  // getModuleName() {
  //   let req = {
  //     countryId: 0,
  //   }
  //   this.quizService.getModuleNameByCountry(req).subscribe(data => {
  //     this.moduleList = data.modules;
  //   })
  // }


  // getPreApplicationSubModuleList() {
  //   this.subModuleList = [];
  //   var data={
  //     moduleid:3
  //   }
  //   this.quizService.getsubmoduleid(data).subscribe(data => {
  //     this.subModuleList = data.submodules;
  //   })
  // }

  closeViewPopUp(quizData: any) {
    this.editQuestion(quizData);
    this.newquestionadd = 'block';
    this.submitafter = 'none';
  }

  deletequiz(quiz:any){
    var data={
        quizquestion_id:quiz.id
      }
      this.quizService.deleteQuiz(data).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz Deleted successfully!' })
        this.getQuizQuestionData();
        this.ngOnInit();
      })
}
  closeAddQuizPopUpImport() {
    this.newquestionaddimport = "none";
}
addnewquestionpopupImport() {
  this.newquestionaddimport = "block";
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
    this.quizService.importFile(this.selectedFile).subscribe(
      (response) => {
        this.selectedFile = null;
        if (response.status == "true") {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.getQuizQuestionData();
          this.newquestionaddimport = "none";
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
  // let data: any = {
  //   moduleId: 8,
  //   country_id:0,
  //   submoduleId: this.languagetype,
  // };
  // const formData = this.filterForm.value;
  // if (formData.status) {
  //   data.status = formData.status;
  // }
  // this.quizService.QuesExport(data).subscribe((response) => {
  //   this.quizService.downloadFile(response.link).subscribe((blob) => {
  //     const a = document.createElement("a");
  //     const objectUrl = window.URL.createObjectURL(blob);

  //     a.href = objectUrl;
  //     a.download ="LearningHub_quiz.csv";  
  //     document.body.appendChild(a);

  //     a.click();
  //     window.URL.revokeObjectURL(objectUrl);
  //     document.body.removeChild(a);
  //   });
  // });
}

}

