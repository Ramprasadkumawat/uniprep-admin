import { Component, OnInit } from '@angular/core';
import { UserFacadeService } from '../../users/user-facade.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import {QuizService} from "../quiz.service";
import {LocationService} from "../../../location.service";
import {MessageService} from "primeng/api";
import { PaginatorState } from 'primeng/paginator';

export function linkFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const linkPattern = /^(http|https):\/\/\w+/;
  
      if (!linkPattern.test(control.value)) {
        return { invalidLinkFormat: true };
      }
  
      return null;
    };
  }
interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}
@Component({
    selector: 'app-career-hub',
    templateUrl: './career-hub.component.html',
    styleUrls: ['./career-hub.component.scss'],
    standalone: false
})
export class CareerHubComponent implements OnInit {

    form: any = FormGroup;
    filterForm: any = FormGroup;
    submitted = false;
    countryList: any;
    subModuleList: any;
    sourceFaqQuestionList: any;
    moduleList: any;
    selectedCountry = 2;
    currentModuleId = 4;
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
    currentModuleName = 'Career Hub'

    newquestionadd = "none";
    submitafter = "none"
    newquestionaddimport="none"
    first: number = 0;
    rows: number = 50;
    pageno:number = 1;
    perPage:number = 50;
    constructor(private quizService: QuizService, private fb: FormBuilder,
                private service: LocationService, private toast: MessageService) {
    }

    pageSize = 8;

    ngOnInit(): void {
        this.form = this.fb.group({
            question_id: [''],
            module_id: [this.currentModuleId],
            // submodule_id: ['',],
            country_id: [this.selectedCountry, [Validators.required]],
            question: ['', [Validators.required]],
            option1: ['', [Validators.required]],
            option2: ['', [Validators.required]],
            option3: ['', [Validators.required]],
            option4: ['', [Validators.required]],
            answer: ['', [Validators.required]],
            source_faqquestion: ['',[Validators.required]],
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
    exportFile() {
      let data: any = {
        moduleId: 4,
        countryId: this.selectedCountry,
      //  submoduleId: 0,
      };
      const formData = this.filterForm.value;
      if (formData.status) {
        data.status = formData.status;
      }
      this.quizService.quesExportAll(data).subscribe((response) => {
        this.quizService.downloadFile(response.link).subscribe((blob) => {
          const a = document.createElement("a");
          const objectUrl = window.URL.createObjectURL(blob);
  
          a.href = objectUrl;
          a.download = "preadmission_quiz.csv";
          document.body.appendChild(a);
  
          a.click();
          window.URL.revokeObjectURL(objectUrl);
          document.body.removeChild(a);
        });
      });
    }
    // pageChange(event: any) {
    //   const page = event.first / this.pageSize + 1;
    //   this.userFacade.loadUsers({page});
    // }

    addnewquestionpopup() {
        this.form.reset({
            question_id: '',
            module_id: this.currentModuleId,
            // submodule_id: '',
            country_id: this.selectedCountry, // Preserve country_id
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: '',
            source_faqquestion: '',
            status: '',
          });
        this.newquestionadd = "block";
    }

    closeAddQuizPopUp() {
        this.newquestionadd = "none";
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
      this.form.reset({
        question_id: '',
        module_id: this.currentModuleId,
        // submodule_id: '',
        country_id: this.selectedCountry, // Preserve country_id
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
        source_faqquestion: '',
        status: '',
      });
        this.sourceFaqQuestionList = [];
        let req = {
            moduleId: this.currentModuleId,
            countryId: this.selectedCountry,
            // submoduleId: quizData.submodule_id
        }

        this.quizService.getUniPrepQuestion(req).subscribe(data => {
            this.sourceFaqQuestionList = data.questions;
            this.form = this.fb.group({
                question_id: [quizData.id],
                module_id: [quizData.module_id, [Validators.required]],
                // submodule_id: [Number(quizData.submodule_id)],
                country_id: [quizData.country_id, [Validators.required]],
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
            this.form.value.module_id = 4;
            delete this.form.value.question_id;
            this.quizService.addQuizQuestion(this.form.value).subscribe(data => {
                this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz added successfully!' })
            });
            this.getQuizQuestionData();
            this.newquestionadd = "none";
            this.submitafter = "none";
            this.filterSubmit()
        } else {
            this.quizService.updateQuizQuestions(this.form.value).subscribe(data => {
                this.newquestionadd = 'none';
                this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz updated successfully!' })
                this.filterSubmit()
            })
        }
    }
    onPageChange(event: PaginatorState) {
      this.pageno = (event.page ?? 0) + 1; 
      this.perPage = event.rows ?? 10;
      let req = {
        moduleId: this.currentModuleId,
        countryId: this.selectedCountry,
        page: this.pageno,
        perpage: this.perPage
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
    getQuizQuestionData() {
        this.quizList = [];
        let req = {
            moduleId: this.currentModuleId,
            countryId: this.selectedCountry,
            page: this.pageno,
            perpage: this.perPage
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
        var data={
          moduleid:4
        }
        this.quizService.getsubmoduleid(data).subscribe(data => {
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
    deletequiz(quiz:any){
        var data={
            quizquestion_id:quiz.id
          }
          this.quizService.deleteQuiz(data).subscribe(data => {
            this.toast.add({ severity: 'success', summary: 'Success', detail: 'Quiz Deleted successfully!' })
            this.filterSubmit()
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
        console.log(this.selectedFile);
      this.quizService.bulkUploadFile(this.selectedFile).subscribe(
        (response) => {
          this.selectedFile = null;
          if (response.status == "true") {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.filterSubmit()
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
}
