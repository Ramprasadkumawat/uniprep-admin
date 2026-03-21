import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule} from "@angular/forms";

import { ConfirmationService, MessageService } from "primeng/api";
import {CommonModule, Location, NgClass, NgStyle} from "@angular/common";
import { Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { Checkbox } from 'primeng/checkbox';
import screenfull from "screenfull";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DatePickerModule } from 'primeng/datepicker';
import {SelectModule} from "primeng/select";
import {AccordionModule} from "primeng/accordion";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {TableModule} from "primeng/table";
import {LocationService} from "../../location.service";
import {ReadingService} from "../reading/reading.service";
import {QAReportService} from "../report/report.service";
import {Question} from "../../@Models/reading.model";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {PipesModule} from "@pipes/pipes.module";

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
    selector: "uni-questions",
    templateUrl: "./questions.component.html",
    styleUrls: ["./questions.component.scss"],
    providers: [ConfirmationService],
    imports: [
        DatePickerModule,
        SelectModule,
        AccordionModule,
        PaginatorModule,
        DialogModule,
        TagModule,
        RatingModule,
        CKEditorModule,
        TableModule,
        ReactiveFormsModule,
        FormsModule,
        NgClass,
        ConfirmPopupModule,
        ButtonModule,
        PipesModule,
        CommonModule
    ]
})
export class QuestionsComponent implements OnInit {
  @Input() subCategory: any;
  // @ViewChild("editor", { static: false }) editor: any;
  @HostListener("fullscreenchange", ["$event"])
  fullscreenchange(event: any) {
    if (!screenfull.isFullscreen) {
      this.fullscreen = "";
    }
  }
  public config = {
    toolbar: ['heading', '|',
      'fontfamily', 'fontsize',
      'alignment',
      'fontColor', 'fontBackgroundColor', '|',
      'bold', 'italic', 'custombutton', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
      'link', '|',
      'outdent', 'indent', '|',
      'bulletedList', 'numberedList', '|',
      'code', 'codeBlock', '|',
      'insertTable', '|',
      'imageUpload', 'blockQuote', '|',
      'undo', 'redo', '|',
      'youtube',
      'mediaEmbed'
    ]
  }
  public isDisabled = false;
  toggleDisabled() {
    this.isDisabled = !this.isDisabled
  }

  onChange({ editor }) {
    const data = editor.getData();
  }
  public editor = ClassicEditor;
  modules = {};
  @ViewChild("fullscreeneditor") editorelement: ElementRef | any;
  fullscreen = "";
  selectedCountry: number = 2;
  moduleName: any;
  first: number = 0;
  page: number = 1;
  rows: number = 50;
  questionId: number = 0;
  cardHeader: string = "";
  countryList: any;
  form: FormGroup;
  filterForm: FormGroup;
  submitted: boolean = false;
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
  modulesList: any[];
  subModulesList: any[];
  questionModal: boolean = false;
  viewQuestionModal: boolean = false;
  reviewedByModal: boolean = false;
  historyModal: boolean = false;
  suggestionModal: boolean = false;
  questionList: any[] = [];
  loadActionedBy: any[] = [];
  homecountries: any[] = [];
  categories: any[] = [];
  totalQuestionCount: number = 0;
  subCategoryValue: any;
  questionListData!: Question;
  reviewedByOrgList: any;
  isReviewedByVisible: boolean = false;
  suggestion: any;
  answer: string = "<h1> </h1>";
  deletePermission: number = 0;
  fileUploadModal: boolean = false;
  selectedFile: any;
  selectedQuestionForBulkDelete: any[] = [];
  selectAllQuestion: boolean = false;
  @ViewChild("formElm") formElm!: ElementRef;
  @ViewChild("filterFormElm") filterFormElm!: ElementRef;
  historyList: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: "1199px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  module_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private service: LocationService,
    private readingService: ReadingService,
    private toast: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private reportservice: QAReportService
  ) {
    this.form = fb.group({
      ques_country_id: [""],
      ques_module_id: [""],
      ques_submodule_id: [""],
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
      videolink: this.fb.array([]),
      reflink: this.fb.array([]),
      favourite: [""],
      verified: [""],
      pre_verified: [""],
      formatted: [""],
      homecountry_id: [""],
      category: [""]
    });
    this.filterForm = fb.group({
      fromdate: [""],
      todate: [""],
      formatted: [""],
      favourite: [""],
      pre_verified: [""],
      verified: [""],
      suggestion: [""],
      reviewed: [""],
      question: [""],
      actioned_by: [""],
      homecountry_id: [""],
      category: [""]
    });
  }
  get getImageLinkFormArray(): any {
    return this.form.get("reflink") as FormArray;
  }

  get getVideLinkFormArray(): any {
    return this.form.get("videolink") as FormArray;
  }

  imageLink(data = ""): any {
    return this.fb.group({
      reflink: this.fb.control(data),
    });
  }

  videoLink(data = ""): any {
    return this.fb.group({
      videolink: this.fb.control(data),
    });
  }

  categoryName: any
  ngOnInit(): void {
    this.categoryName = localStorage.getItem('selected-category-name');
    this.getCategoryList();

    let filterData = localStorage.getItem('filter-data') ? localStorage.getItem('filter-data') : localStorage.getItem('selected-summary');
    this.subCategoryValue = JSON.parse(filterData)
    if (this.subCategoryValue) {
      this.moduleName = this.subCategoryValue.module_name;
      if (this.subCategoryValue.module_id == 8) {
        this.module_id = 8;
      }

      this.cardHeader = this.module_id != 8 ? this.subCategoryValue.submodule_name : this.subCategoryValue.submodule;
      this.getmodulequestionList();
    }

    this.userDeletePermissionCheck();
    this.getCountryList();
    if (this.subCategoryValue.module_id != 10) {
      this.gethomeCountryList();
    }
    
    this.loadActionedByUser();
    this.getModulesList();
    this.questionOnModuleChange();
  }
  gethomeCountryList() {
    this.readingService.getHomeCountry(2).subscribe((response) => {
      this.homecountries = [{ id: null, country: "Select" }, ...response];
    });
  }

  getCategoryList() {
    this.readingService.getCategory().subscribe((response) => {
      this.categories = [{ id: null, name: "Select" }, ...response];
    });
  }

  pRatingOnClick() { }

  userDeletePermissionCheck() {
    this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
      this.deletePermission = response.permission;
    });
  }
  loadActionedByUser() {
    this.readingService.getActionedByUser().subscribe(response => {
      this.loadActionedBy = [{ id: null, name: 'Select' }, ...response];

    })
  }

  get f() {
    return this.form.controls;
  }

  getCategoryIdByName(name: string): number | undefined {
    const category = this.categories.find(category => category.name === name);
    return category ? category.id : undefined;
  }
  
  getmodulequestionList() {      
      var data = {
        moduleId: this.subCategoryValue.module_id,
        module_id: this.subCategoryValue.module_id,
        country: this.subCategoryValue.country_id ? this.subCategoryValue.country_id : 0,
        countryId: this.subCategoryValue.country_id ? this.subCategoryValue.country_id : 0,
        country_id: this.subCategoryValue.country_id ? this.subCategoryValue.country_id : 0,
        submoduleId: this.subCategoryValue.submodule_id,
        submodule_id: this.subCategoryValue.submodule_id,
        submodule_name: this.subCategoryValue.submodule_name,
        moduleName: this.subCategoryValue.module_name,  
        category: localStorage.getItem('selected-category') ? localStorage.getItem('selected-category') : '',
        category_id: '',
        homecountry_id: '',
        mode: "admin",
        page: this.page,
        perpage: this.rows,
        formatted: localStorage.getItem('selected_module_name') == 'formatted' ? 1 : '',
        favourite: localStorage.getItem('selected_module_name') == 'favourite' ? 1 : '',
        pre_verified: localStorage.getItem('selected_module_name') == 'pre_verified' ? 1 : '',
        verified: localStorage.getItem('selected_module_name') == 'verified' ? 1 : '',
        reviewed: localStorage.getItem('selected_module_name') == 'reviewed' ? 1 : '',
        actioned_by: ''
      };      
      this.readingService.getModuleQuestions(data).subscribe((response) => {
        this.questionList = response.questions;
        this.totalQuestionCount = response.questioncount;
      });
  }

  countryOnChange(event: any) {
    this.selectedCountry = event.value;
    this.getmodulequestionList();
  }

  getCountryList() {
    this.service.getInterestedCountryList().subscribe((data) => {
      this.countryList = data;
    });
  }
  asdf: number = 1;
  rating(data: any) {
    let req: any;
    if (data.favourite == 1) {
      req = {
        question_id: data.id,
        favourite: 0,
      };
    } else {
      req = {
        question_id: data.id,
        favourite: 1,
      };
    }
    this.readingService.makeQuestionFav(req).subscribe((res: any) => {
      if (res.status == "true") {
        this.getmodulequestionList();
      }
    });
  }

  pageChange(event: PaginatorState) {
    this.selectAllQuestion = false;
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getmodulequestionList();
  }

  openViewQuestion(data: Question) {
    this.viewQuestionModal = true;
    this.questionListData = data;
  }

  getModulesList() {
    this.readingService.getModulesList().subscribe(response => {
      this.modulesList = response.modules;
    });
  }
  questionOnModuleChange(countryId?: number, module_id?: number) {
    let quesModandcountry: any = {
      countryId: countryId,
      module_id: module_id
    };
    if (this.module_id == 8) {
      this.readingService.getLearninghubLists().subscribe(response => {
        this.subModulesList = [{ submodule_id: null, submodule_name: 'Select' }, ...response.data];
        this.subModulesList.map(item => item.id = item.submodule_id)
      });
      return;
    }
    this.readingService.getSubmoulesListbyModAndCountry(quesModandcountry).subscribe(response => {
      this.subModulesList = response;
    });
  }

  isEditClick: boolean = false;
  openEditQuestion(data: Question) {
    this.questionOnModuleChange(data.country_id, data.module_id);
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
    let cleanedHtmlContent = this.replaceEmptyParagraphs(data.answer);
    //let wrapWithUl= this.wrapWithUl(cleanedHtmlContent.replace(/<p>&nbsp;<\/p>/g, ''));

    //this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(cleanedHtmlContent);

    let answer;
    if (localStorage.getItem("count") == "1") {
      //answer = data.answer.replace(/\n/g, "");
      answer = cleanedHtmlContent;
    } else {
      localStorage.setItem("count", "1");
      answer = data.answer;
    }

    this.questionModal = true;
    this.historyModal = false;
    this.form.patchValue({
      question: data.question,
      answer: cleanedHtmlContent,
      videolink: data.videolink,
      reflink: data.reflink,
      favourite: data.favourite,
      verified: data.verified,
      formatted: data.formatted,
      pre_verified: data.pre_verified,
      ques_country_id: data.country_id,
      ques_module_id: data.module_id,
      ques_submodule_id: data.submodule_id,
      homecountry_id: data.homecountry,
      category: data.category
    });
    //this.editor.writeValue(words)

    // this.htmlValue = `<ul>${cleanedHtmlContent}</ul>`
    this.questionId = data.id;
  }
  safeHtmlContent: SafeHtml;
  htmlValue: any;

  replaceEmptyParagraphs(html: string): string {
    // Replace all occurrences of <p>&nbsp;</p> with an empty string
    return html.replace(/\s{2,}/g, '');
  }

  wrapWithUl(content: string): string {
    return `<ul>${content}</ul>`;
  }

  goBack() {
    this._location.back();
  }

  openQuestionForm() {
    this.isEditClick = false;
    this.getVideLinkFormArray.clear();
    this.getImageLinkFormArray.clear();
    this.questionModal = true;
    this.questionId = 0;
    this.form.reset();
    this.formElm.nativeElement.reset();
    this.submitted = false;
  }

  exportFile() {
    let data: any = {
      moduleId: this.subCategoryValue.module_id,
      countryId: this.subCategoryValue.country_id,
      submoduleId: this.subCategoryValue.submodule_id,
    };
    const formData = this.filterForm.value;
    if (formData.formatted) {
      data.formatted = formData.formatted;
    }
    if (formData.favourite) {
      data.favourite = formData.favourite;
    }
    if (formData.verified) {
      data.verified = formData.verified;
    }
    if (formData.pre_verified) {
      data.pre_verified = formData.pre_verified;
    }
    if (formData.suggestion) {
      data.edited = formData.suggestion;
    }
    if (data.module_id == 8 || data.module_id == 10) {
      data.countryId = 0;
    }

    this.readingService.readQuesExport(data).subscribe((response) => {
      this.readingService.downloadFile(response.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = this.moduleName + "_q&a.csv"; // Specify the desired file name
        document.body.appendChild(a);

        a.click();

        // Clean up
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    });
  }

  // rating(item: any) {
  //     this.readingService.updateUniPrepQuestion({item}).subscribe((response) => {
  //         this.toast.add({severity: 'success', summary: 'Success', detail: response.message});
  //         this.questionModal = false;
  //         this.form.reset();
  //         this.formElm.nativeElement.reset();
  //         this.getmodulequestionList();
  //     });
  // }

  navigateSuggestedQuestion() {
    this.router.navigate(["/reading/suggested-question"]);
  }

  showSuggestion() {
    let question = {
      question: this.questionId,
    };
    this.readingService.GetSuggestions(question).subscribe((response) => {
      this.suggestion = response;
    });
  }

  actionSuggestion(id) {
    let action = {
      suggestionId: id,
      questionId: this.questionId,
    };
    this.readingService.ActionSuggestion(action).subscribe((response) => {
      this.suggestion = response;
      this.showSuggestion();
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Action Updated",
      });
    });
  }

  reviewBy(selectedQuestionId: any) {
    this.reviewedByModal = true;
    this.reviewedByOrgList = [];
    this.isReviewedByVisible = true;
    let request = {
      question_id: selectedQuestionId,
    };
    this.readingService.GetReviewedByOrgLogo(request).subscribe((response) => {
      this.reviewedByOrgList = response;
    });
  }
}
