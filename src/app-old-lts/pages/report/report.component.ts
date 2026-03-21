import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import {TabsModule} from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { Observable } from "rxjs";
import { User, UserType } from "src/app/@Models/user.model";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserFacadeService } from "../users/user-facade.service";
import { QAReportService } from "./report.service";
import { ReadingService } from "../reading/reading.service";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { TagModule } from "primeng/tag";
import { Question } from "src/app/@Models/reading.model";
import { CountrymanagementService } from "../countrymanagement/countrymanagement.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
    selector: "uni-report",
    templateUrl: "./report.component.html",
    styleUrls: ["./report.component.scss"],
    imports: [
        CommonModule,
        InputTextModule,
        TabsModule,
        TableModule,
        AccordionModule,
        SelectModule,
        TextareaModule,
        ReactiveFormsModule,
        MultiSelectModule,
        DialogModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        TagModule,
    ],
    providers: [ConfirmationService]
})
export class ReportComponent implements OnInit {
  filterForm: FormGroup;
  submitted = false;
  pageSize = 50;
  historyList: any[] = [];
  isEditClick: boolean = false;
  constructor(
    private userFacade: UserFacadeService,
    private router: Router,
    private fb: FormBuilder,
    private service: QAReportService,
    private readingService: ReadingService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private countrymgmt: CountrymanagementService
  ) {
    this.form = fb.group({
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
      videolink: this.fb.array([]),
      reflink: this.fb.array([]),
      favourite: ["", [Validators.required]],
      verified: ["", [Validators.required]],
      formatted: ["", [Validators.required]],
    });
    this.filterForm = this.fb.group({
      name: [""],
      email: [""],
      mobile: [""],
      country: [""],
      module: [""],
      userType: [""],
      submodule: [""],
      issue: [""],
      actionStatus: [""],
    });
  }

  ngOnInit(): void {
    this.getReportList(this.data);
    this.getCountriesList();
    this.getModulesList();
    this.getLeadslist();
    this.getIssueList();
    this.getStatusOptions();
  }
  questionSuggestionList: any = [];
  suggestionSourceList: any = [];
  modulelist: any = [];
  getModulesList() {
    this.service.getModules().subscribe((response) => {
      this.modulelist = [
        { id: null, module_name: "Select" },
        ...response.modules,
      ];
    });
  }
  submodulelist: any = [];
  getSubModulesList(moduleId: any) {
    this.service
      .getSubModules({ moduleId: moduleId.value })
      .subscribe((response) => {
        this.submodulelist = [
          { id: null, submodule_name: "Select" },
          ...response,
        ];
      });
  }
  leadList: any = [];
  getLeadslist() {
    this.service.getleadtype().subscribe((response) => {
      this.leadList = [{ id: null, subtypeName: "Select" }, ...response];
    });
  }
  issueList: any = [];
  getIssueList() {
    // this.issueList = [
    //   { id: null, name: "Select" },
    //   { id: 1, name: "Incorrect Information" },
    //   { id: 2, name: "Missing Information" },
    //   { id: 3, name: "Needs to be updated" },
    // ];
    this.service.getReportOptionList().subscribe((response) => {
      this.issueList = response.reportOptions;
    });
  }

  statusOptions: any =[];
  getStatusOptions(){
    this.statusOptions = [
      {id: null, name: "Select"},
      {id: 1, name: "Not Actioned"},
      {id: 2, name: "Actioned"}
    ];
  }

  intcountries: any = [];
  getCountriesList() {
    this.countrymgmt.getCountriesList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.country,
        };
        this.intcountries.push(bindingdata);
      });
    });
  }
  reports: any = [];
  datacount: any;
  getReportList(data?: any) {
    this.service.getQAReport(data).subscribe((response) => {
      this.reports = [];
      this.reports = response.data;
      this.datacount = response.count;
    });
  }
  getQuestion(rowData: any){
    this.suggestionModal = true;
    this.service.getQuestionReportByQuesId(rowData).subscribe((response) => {
      this.questionSuggestionList = response.total_comments;
      this.suggestionSourceList = response.question_source;
      
    }); 
    
  }
  // getQuestion(rowdata: any) {
  //   let data = {
  //     fromdate: "",
  //     todate: "",
  //     formatted: "",
  //     favourite: "",
  //     verified: "",
  //     suggestion: "",
  //     reviewed: "",
  //     question: rowdata?.question,
  //     actioned_by: "",
  //     page: 0,
  //     perpage: 50,
  //     moduleId: rowdata?.module_id,
  //     modules: rowdata?.modules,
  //     submodule: rowdata?.submodule,
  //     countryId: rowdata?.country_id,
  //     submoduleId: rowdata?.submodule_id,
  //     mode: "admin",
  //   };
  //   this.service.StoredReportData = data;
  //   if (rowdata?.module_id == 1) {
  //     this.router.navigate(["/reading/pre-application"]);
  //   }
  //   if (rowdata?.module_id == 2) {
  //     this.router.navigate(["/reading/post-application"]);
  //   }
  //   if (rowdata?.module_id == 3) {
  //     this.router.navigate(["/reading/post-admission"]);
  //   }
  //   if (rowdata?.module_id == 4) {
  //     this.router.navigate(["/reading/career-hub"]);
  //   }
  //   if (rowdata?.module_id == 5) {
  //     this.router.navigate(["/reading/university"]);
  //   }
  //   if (rowdata?.module_id == 6) {
  //     this.router.navigate(["/reading/life-at-country"]);
  //   }
  // }
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.getReportList(this.data);
  }

  filtersubmit() {
    this.data.name = this.filterForm.value.name;
    this.data.email = this.filterForm.value.email;
    this.data.mobile = this.filterForm.value.mobile;
    this.data.issue = this.filterForm.value.issue;
    this.data.module = this.filterForm.value.module;
    this.data.submodule = this.filterForm.value.submodule;
    this.data.country = String(this.filterForm.value.country);
    this.data.userType = this.filterForm.value.userType;
    this.data.actionStatus = this.filterForm.value.actionStatus;
    this.getReportList(this.data);
  }
  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  setstatus() {}
  moduleName: any;
  form: FormGroup;
  @ViewChild("formElm") formElm!: ElementRef;
  questionModal: boolean = false;
  questionId: number = 0;
  historyModal: boolean = false;
  suggestionModal: boolean = false;
  suggestion: any;
  categoryDropdownList: any[] = [
    { id: null, name: "Select" },
    { id: 1, name: "Yes" },
    { id: 0, name: "No" },
  ];
  suggestionList: any[] = [
    { id: null, name: "Select" },
    { id: 1, name: "Actioned" },
    { id: 0, name: "Non-Actioned" },
  ];
  cardHeader: string = "";
  submitForm() {
    this.submitted = true;
    // if (this.form.invalid) {
    //   return;
    // }
    // if (this.questionId > 0) {
    //   this.readingService.updateUniPrepQuestion({
    //     ...this.form.value,
    //     question_id: this.questionId,
    //     country_id: this.selectedCountry,
    //     module_id: this.subCategoryValue.moduleId,
    //     submodule_id: this.subCategoryValue.id,
    //     status: 1,
    //     edited: 0
    //   }).subscribe((response) => {
    //     if(response.status == "false"){
    //       this.toast.add({severity: 'error', summary: 'Error', detail: response.message});
    //       return;
    //     }
    //     this.toast.add({severity: 'success', summary: 'Success', detail: response.message});
    //     this.questionModal = false;
    //     this.form.reset();
    //     this.formElm.nativeElement.reset();
    //     this.getmodulequestionList();
    //   });
    // } else {
    //   this.readingService.addUniPrepQuestion({
    //     ...this.form.value,
    //     country_id: this.selectedCountry,
    //     module_id: this.subCategoryValue.moduleId,
    //     submodule_id: this.subCategoryValue.id,
    //     status: 1,
    //     edited: 0
    //   }).subscribe((response) => {
    //     if(response.status == "false"){
    //       this.toast.add({severity: 'error', summary: 'Error', detail: response.message});
    //       return;
    //     }
    //     this.toast.add({severity: 'success', summary: 'Success', detail: response.message});
    //     this.questionModal = false;
    //     this.form.reset();
    //     this.formElm.nativeElement.reset();
    //     this.getmodulequestionList();
    //   });
    // }
  }
  openQuestionForm() {
    this.getVideLinkFormArray.clear();
    this.getImageLinkFormArray.clear();
    this.questionModal = true;
    this.questionId = 0;
    this.form.reset();
    this.formElm.nativeElement.reset();
    this.submitted = false;
  }
  get getImageLinkFormArray(): any {
    return this.form.get("reflink") as FormArray;
  }

  get getVideLinkFormArray(): any {
    return this.form.get("videolink") as FormArray;
  }

  actionSuggestion(id,user_id,type) {
    let paramters = {
      id : id,
      user_id : user_id,
      type : type
    };

    this.service.updateSuggestionInReport(paramters).subscribe((response)=>{
      this.toast.add({ severity: "success", summary: "Success", detail: response.message,});
      this.suggestionModal=false;
      this.getReportList();
    });
    
    // let action = {
    //   suggestionId: id,
    //   questionId: this.questionId,
    // };
    // this.readingService.ActionSuggestion(action).subscribe((response) => {
    //   this.suggestion = response;
    //   this.showSuggestion();
    //   this.toast.add({
    //     severity: "success",
    //     summary: "Success",
    //     detail: "Action Updated",
    //   });
    // });
  }

  // actionSuggestion(id) {
  //   let action = {
  //     suggestionId: id,
  //     questionId: this.questionId,
  //   };
  //   this.readingService.ActionSuggestion(action).subscribe((response) => {
  //     this.suggestion = response;
  //     this.showSuggestion();
  //     this.toast.add({
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Action Updated",
  //     });
  //   });
  // }
  showSuggestion() {
    let question = {
      question: this.questionId,
    };
    this.readingService.GetSuggestions(question).subscribe((response) => {
      this.suggestion = response;
    });
  }

  deleteQuestion(event: Event) {
    if (this.questionId > 0) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Are you sure that you want to delete?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.readingService
            .deleteUniPrepQuestion(this.questionId)
            .subscribe((response) => {
              this.toast.add({
                severity: "success",
                summary: "Success",
                detail: response.message,
              });
              this.questionModal = false;
              this.form.reset();
              this.formElm.nativeElement.reset();
            });
        },
        reject: () => {
          this.toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
  }
  getEditHistory() {
    if (!this.historyModal && this.questionId > 0) {
      this.historyModal = true;
      this.historyList = [];
      this.readingService
        .getUniPrepQuestionEditHistory(this.questionId)
        .subscribe((response) => {
          this.historyList = response;
        });
      return;
    }
    this.historyModal = false;
  }
  get f() {
    return this.form.controls;
  }
  videoLink(data = ""): any {
    return this.fb.group({
      videolink: this.fb.control(data),
    });
  }
  openEditQuestion(data: Question) {
    this.htmlValue = null;
    //this.editor.el.nativeElement.innerText = '';
    this.isEditClick = true;
    this.getVideLinkFormArray.clear();
    this.getImageLinkFormArray.clear();
    this.form.reset();
    if (data.videolink) {
      data.videolink.forEach((value: any) => {
        this.getVideLinkFormArray.push(this.videoLink(value.link));
      });
    }

    if (data.reflink) {
      data.reflink.forEach((value: any) => {
        this.getImageLinkFormArray.push(this.imageLink(value.link));
      });
    }
    let answer;
    if (localStorage.getItem("count") == "1") {
      answer = data.answer.replace(/\n/g, "<p><br></p>");
    } else {
      localStorage.setItem("count", "1");
      answer = data.answer;
    }

    this.questionModal = true;
    this.historyModal = false;
    this.form.patchValue({
      question: data.question,
      answer: answer,
      videolink: data.videolink,
      reflink: data.reflink,
      favourite: data.favourite,
      verified: data.verified,
      formatted: data.formatted,
    });
    this.htmlValue = answer;
    //this.editor.writeValue(words)

    //this.htmlValue = data.answer
    this.questionId = data.id;
  }
  htmlValue: any;
  addImageControl(): void {
    if (this.getImageLinkFormArray.length > 4) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Only able to upload 5 Reference links.",
      });
      return;
    }
    this.getImageLinkFormArray.push(this.imageLink());
  }
  imageLink(data = ""): any {
    return this.fb.group({
      reflink: this.fb.control(data),
    });
  }
  removeImage(i: number): void {
    this.getImageLinkFormArray.removeAt(i);
  }

  addControl(): void {
    if (this.getVideLinkFormArray.length > 4) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Only able to upload 5 video links.",
      });
      return;
    }

    this.getVideLinkFormArray.push(this.videoLink());
  }

  remove(i: number): void {
    this.getVideLinkFormArray.removeAt(i);
  }
  reset() {
    window.location.reload();
  }

  reportExport(){
    //let filterData = {};
    const formData = this.filterForm.value;
    //console.log(formData);
    this.service.getReportDataForExport(formData).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
}
