import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FounderstoolService } from '../../founderstool.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryInsightsService } from '../country-insights.service';
import { CountryInsightsQuestionList } from 'src/app/@Models/country-insights.model';
import { Country } from 'src/app/@Models/country.model';
import { PaginatorState } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
    selector: 'uni-add-country-insights-questions',
    templateUrl: './add-country-insights-questions.component.html',
    styleUrls: ['./add-country-insights-questions.component.scss'],
    standalone: false
})
export class AddCountryInsightsQuestionsComponent implements OnInit {
  form: any = FormGroup;
  editImage: string = '';
  submitted = false;
  countryList: Country[] = [];
  viewQuizData: any;
  selectedFile: any;
  statusData: any;
  totalQuizCount: any;
  questionsList: CountryInsightsQuestionList[] = [];
  moduleId: string = '';
  countryId: string = '';
  newquestionadd = "none";
  newquestionaddimport = "none";
  selectedCSVFile: any;
  first: number = 0;
  perPage: number = 50;
  addOrUpdate: string = 'Add';
  question_id: string = '';
  page: number = 1;
  constructor(private route: ActivatedRoute, private quizService: CountryInsightsService, private fb: FormBuilder, private toast: MessageService) { }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.params?.['id'];
    this.countryId = localStorage.getItem('country_insights_country');
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      image: ['', [Validators.required]],
      answer: ['']
    });
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
    this.addOrUpdate = "Add";
  }

  editQuestion(quizData: any) {
    this.form.reset();
    this.addOrUpdate = "Update";
    this.question_id = quizData.id,
      this.form.patchValue({
        title: quizData?.title,
        answer: quizData?.answer,
        image: quizData?.image
      })
    this.newquestionadd = "block";
  }

  viewQuestion(quizData: any) {
    this.viewQuizData = quizData;
  }


  onSubmit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.toast.add({ severity: 'info', summary: 'Info', detail: 'Enter required field.' });
      return;
    }
    if (this.selectedFile) {
      this.form.value.image = this.selectedFile;
    }
    if (this.question_id == '') {
      this.quizService.addQuestion({
        ...this.form.value, module_id: this.moduleId, country_id: this.countryId
      }).subscribe(data => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question added successfully!' });
        this.resetForms();
        this.getQuizQuestionData();
      });
      this.newquestionadd = "none";
    } else {
      this.quizService.updateQuestion({ ...this.form.value }, this.question_id).subscribe(data => {
        this.resetForms();
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question updated successfully!' })
        this.getQuizQuestionData();
      })
    }
  }
  onPageChange(event: PaginatorState) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    let req = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.perPage,
      country: this.countryId,
    }

    this.quizService.getQuizQuestion(req).subscribe(data => {
      this.questionsList = data?.questions;
      this.totalQuizCount = data.count;
    })
  }

  resetForms() {
    this.selectedFile = null;
    this.newquestionadd = 'none';
    this.question_id = '';
    this.editImage = '';
    this.submitted = false;
  }

  getQuizQuestionData() {
    this.questionsList = [];
    let req = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.perPage,
      countryId: this.countryId,
    }

    this.quizService.getQuestionsList(req).subscribe(data => {
      this.questionsList = data?.questions;
      this.totalQuizCount = data.count;
    })

  }

  closeViewPopUp(quizData: any) {
    this.editQuestion(quizData);
    this.newquestionadd = 'block';
  }

  deletequiz(quiz: any) {
    var data = {
      quizquestion_id: quiz.id
    }
    this.quizService.deleteQuiz(data).subscribe(data => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Deleted successfully!' })
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

  uploadFile() {
    if (this.selectedCSVFile) {
      this.quizService.importCountryInsightsQuestions(this.selectedCSVFile).subscribe(
        (response) => {
          this.selectedCSVFile = null;
          if (response.status == true) {
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

  onCsvFileChangeImport(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedCSVFile = inputElement.files[0];
    } else {
      this.selectedCSVFile = null;
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
      ['title', 'image', 'answer'],
    ];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    return csvString;
  }


}
