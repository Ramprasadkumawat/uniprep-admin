import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {QuizService} from "../quiz.service";
 
import {MessageService} from "primeng/api";
import { PaginatorState } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
} 
export function linkFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const linkPattern = /^(http|https):\/\/\w+/;

    if (!linkPattern.test(control.value)) {
      return { invalidLinkFormat: true };
    }

    return null;
  };
}
@Component({
    selector: 'uni-languagequizlist',
    templateUrl: './languagequizlist.component.html',
    styleUrls: ['./languagequizlist.component.scss'],
    standalone: false
})
export class LanguagequizlistComponent implements OnInit {

  form: any = FormGroup;
  filterForm: any = FormGroup;
  submitted = false;
  countryList: any;
  subModuleList: any;
  sourceFaqQuestionList: any;
  moduleList: any;
  currentModuleId = 9;
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
  language_id :string='';
  languagetype :string='';
  question_id:string='';
  addOrUpdate:string='Add'
  pageno:number = 1;
  perPage:number = 50;
  constructor(private quizService: QuizService, private fb: FormBuilder,private toast: MessageService) {}

  pageSize = 8;

  ngOnInit(): void {
    let url = window.location.href;
    let parts = url.split("/");
    let lastTwoParts = parts.slice(-2);
    this.language_id  = lastTwoParts[0];
    this.languagetype  = lastTwoParts[1];
    // console.log(this.language_id,this.languagetype);
     
    this.form = this.fb.group({
      submodule_id: ['',],
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
      status: [''],
    });
    this.statusData = [{ id: null, name: 'Select Status' }, { id: 1, name: 'Active' }, { id: 2, name: 'In-Active' }];
    // this.getPreApplicationSubModuleList();
    this.getModuleName();
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
        source_faqquestion: [quizData.source_faqquestion, [Validators.required]],        
        status: [quizData.status, [Validators.required]],
      });
      this.newquestionadd = "block";
  }

  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
    this.submitafter = "block";
  }

  filterSubmit() {
    this.quizList = [];
    let req = {
      page: this.first + 1,
      perpage: this.rows,
      status: this.filterForm.value.status,
      moduleId : 9,
      languagetype: this.languagetype,
      language_id :this.language_id
    }
  
    this.quizService.getLanguageQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == 8);
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
    if (this.question_id == '') {
      this.quizService.addLanguageQuizQuestion({...this.form.value,module_id:this.currentModuleId,country_id:0,languagetype :this.languagetype,language_id :this.language_id
      }).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz added successfully!' })
        this.filterSubmit();
      });
      this.newquestionadd = "none";
      this.submitafter = "none";
    } else {
      this.quizService.updateLanguageQuizQuestions({...this.form.value,question_id:this.question_id,module_id:this.currentModuleId,country_id:0,languagetype :this.languagetype,language_id :this.language_id}).subscribe(data => {
        this.newquestionadd = 'none';
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz updated successfully!' })
        this.filterSubmit();
      })
    }
  }
  onPageChange(event: PaginatorState) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let req = {
      moduleId : 9,
      languagetype: this.languagetype,
      page:this.pageno ,
      perpage:this.perPage,
      language_id :this.language_id
    }

    this.quizService.getLanguageQuizQuestion(req).subscribe(data => {
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
      moduleId : 9,
      languagetype: this.languagetype,
      page: this.pageno,
      perpage: this.perPage,
      language_id :this.language_id
    }

    this.quizService.getLanguageQuizQuestion(req).subscribe(data => {
      this.quizList = data?.questions;
      this.totalQuizCount = data.count;
      this.quizList.map((res) => {
        let moduleName = this.moduleList.find((x: any) => x.id == 8);
        res.module_name = moduleName.module_name;
      });
    })
  }

  getModuleName() {
    let req = {
      countryId: 0,
    }
    this.quizService.getModuleNameByCountry(req).subscribe(data => {
      this.moduleList = data.modules;
    })
  }


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
      this.quizService.deleteLaguageQuiz(data).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz Deleted successfully!' })
        this.filterSubmit();
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
    this.quizService.importLanguageFile(this.selectedFile).subscribe(
      (response) => {
        this.selectedFile = null;
        if (response.status == "true") {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.filterSubmit();
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
    ['module_id','country_id', 'language_id', 'languagetype','question', 'option1', 'option2', 'option3', 'option4', 'answer', 'source_faq_question'],
  ];
  const csvString = csvData.map(row => row.join(',')).join('\n');
  return csvString;
}

exportFile() {
  let data: any = {
    languagetype: this.languagetype,
    language_id: this.language_id,
  };

  this.quizService.exportLanguageHubQuiz(data).subscribe(response =>{
    window.open(response.link, '_blank');
  });
}

}

