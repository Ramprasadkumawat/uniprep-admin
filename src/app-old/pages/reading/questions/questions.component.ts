import { style } from "@angular/animations";
import { addSubscription } from "./../../store/actions";
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Question } from "../../../@Models/reading.model";
import { LocationService } from "../../../location.service";
import { ReadingService } from "../reading.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { QAReportService } from "../../report/report.service";
import { Checkbox } from 'primeng/checkbox';
import screenfull from "screenfull";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    standalone: false
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
  answer: string = "<h1> test</h1>";
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
    private sanitizer: DomSanitizer,
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
      category: [""],
      class: [""],
      subject: [""],
      sub_module: [""]
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

    this.modules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [
            {
              size: [
                '8px',
                '10px',
                '12px',
                '14px',
                '16px',
                '18px',
                '20px',
                '22px',
                '24px',
                '32px',
                '64px',
                '72px',
              ],
            },
          ],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [
            {
              font: [
                'verdana',
                'sans-serif',
                'roboto',
                'cursive',
                'fantasy',
                'monospace',
              ],
            },
          ],
          [{ align: [] }],

          ['clean'], // remove formatting button

          ['link', 'image', 'video'], // link and image, video
          ["fullscreen"],
        ],
        handlers: {
          emoji: function () { },
          fullscreen: () => {
            if (screenfull.isEnabled) {
              this.fullscreen = this.fullscreen ? "" : "fullscreen";
              screenfull.toggle(this.editorelement.nativeElement);
            }
          },
        },
      },
    };
  }
  get getImageLinkFormArray(): any {
    return this.form.get("reflink") as FormArray;
  }

  get getVideLinkFormArray(): any {
    return this.form.get("videolink") as FormArray;
  }

  copyToClipboard(questionId: number) {
    navigator.clipboard.writeText(questionId.toString()).then(() => {
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Question Id Copied.",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
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

  ngOnInit(): void {
    if (this.reportservice.StoredReportData) {
      let data = this.reportservice.StoredReportData;
      this.selectedCountry = data.countryId;
      this.cardHeader = data.submodule;
      this.moduleName = data.modules;

      if (this.moduleName == 'Learning Hub') {
        this.module_id = 8;
      }
      this.getmodulequestionList();
    } else {
      if (this.subCategory) {
        this.subCategoryValue = this.subCategory.state;
        this.selectedCountry = this.subCategoryValue.country;
        this.moduleName = this.subCategoryValue.moduleName;
        this.cardHeader = this.subCategoryValue.submodule_name;
        if (this.subCategoryValue.moduleId == 8) {
          this.module_id = 8;
        }
        if (this.subCategoryValue.moduleId == 14) {
          this.getClassFromApi()
          this.getSubjectFromApi()
          this.getSubModuleFromApi()
        }

        //this.cardHeader = this.module_id != 8 ? this.subCategoryValue.submodule_name : this.subCategoryValue.submodule;
        this.getmodulequestionList();
      }
    }

    this.userDeletePermissionCheck();
    this.getCountryList();
    if (this.subCategoryValue.moduleId != 10) {
      this.gethomeCountryList();
    }
    this.getCategoryList();
    this.loadActionedByUser();
    this.getModulesList();
    this.questionOnModuleChange();
  }

  classList: any[] = []
  selectedClass: any
  getClassFromApi() {
    let req = {
      moduleId: Number(this.subCategoryValue.moduleId),
      page: this.page,
      perpage: this.rows,
      mode: 'admin',
    }
    this.readingService.getQuestionsCountForEachCategory(req).subscribe((response) => {
      this.classList = response.data
      this.selectedClass = Number(this.subCategoryValue.class_id)
    });
  }
  subjectList: any[] = []
  selectedSubject: any
  getSubjectFromApi() {
    let req = {
      moduleId: Number(this.subCategoryValue.moduleId),
      page: this.page,
      perpage: this.rows,
      mode: 'admin',
      parent_category_id: this.subCategoryValue.class_id
    }
    this.readingService.getQuestionsCountForEachCategory(req).subscribe((response) => {
      this.subjectList = response.data
      this.selectedSubject = Number(this.subCategoryValue.subject)
    });
  }
  subModuleList: any[] = []
  selectedSubModule: any
  getSubModuleFromApi() {
    let req = {
      module_id: Number(this.subCategoryValue.moduleId),
      page: this.page,
      perpage: this.rows,
      mode: 'admin',
      module_category_id: Number(this.subCategoryValue.subject),
    }
    this.readingService.get3rdSubModuleCategory(req).subscribe((response) => {
      this.subModuleList = response.data
      this.selectedSubModule = Number(this.subCategoryValue.id)
    });
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

  submitForm() {
    this.submitted = true;
    if (this.questionId > 0) {

      let data: any = {
        ...this.form.value,
        question_id: this.questionId,
        status: 1,
        edited: 0,
      }
      if (this.subCategoryValue.moduleId == 8 || this.subCategoryValue.moduleId == 10) {
        data.countryId = 0;
        data.homecountry_id = 0;
      }
      if (this.subCategoryValue.moduleId == 10) {
        data.category = null;
        data.ques_country_id = null;
      }

      if (this.subCategoryValue.moduleId == 14) {
        data.countryId = 0;
        data.homecountry_id = 0;
        data.category = null;
        data.ques_country_id = null;
        this.readingService.updateUniPrepQuestion(data).subscribe((response) => {
          if (response.status == "false") {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
            return;
          }
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.questionModal = false;
          this.form.reset();
          this.formElm.nativeElement.reset();
          this.getmodulequestionList();
        });
      } else {
        this.readingService.updateUniPrepQuestion(data).subscribe((response) => {
          if (response.status == "false") {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
            return;
          }
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.questionModal = false;
          this.form.reset();
          this.formElm.nativeElement.reset();
          this.getmodulequestionList();
        });
      }
    } else {
      let countryId = 0;
      countryId = this.selectedCountry;
      if (this.subCategoryValue.moduleId == '8' || this.subCategoryValue.moduleId == '10') {
        countryId = 0;
        this.form.value.homecountry_id = 0;
      }
      if (this.subCategoryValue.moduleId == '10') {
        this.form.value.ques_country_id = null;
      }
      if (this.subCategoryValue.moduleId == '14') {
        this.readingService
          .addUniPrepQuestion({
            ...this.form.value,
            country_id: 0,
            module_id: 14,
            submodule_id: this.subCategoryValue.id,
            status: 1,
            edited: 0,
          })
          .subscribe((response) => {
            if (response.status == "false") {
              this.toast.add({
                severity: "error",
                summary: "Error",
                detail: response.message,
              });
              return;
            }
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.questionModal = false;
            this.form.reset();
            this.formElm.nativeElement.reset();
            this.getmodulequestionList();
          });
      } else {
        this.readingService
          .addUniPrepQuestion({
            ...this.form.value,
            country_id: countryId,
            module_id: this.subCategoryValue.moduleId,
            submodule_id: this.subCategoryValue.id,
            status: 1,
            edited: 0,
          })
          .subscribe((response) => {
            if (response.status == "false") {
              this.toast.add({
                severity: "error",
                summary: "Error",
                detail: response.message,
              });
              return;
            }
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.questionModal = false;
            this.form.reset();
            this.formElm.nativeElement.reset();
            this.getmodulequestionList();
          });
      }

    }
  }

  submitFilter() {
    this.selectAllQuestion = false;
    const formData = this.filterForm.value;
    if (
      !formData.fromdate &&
      !formData.todate &&
      formData.formatted == null &&
      formData.favourite == null &&
      formData.pre_verified == null &&
      formData.verified == null &&
      formData.suggestion == null &&
      formData.question == null &&
      formData.actioned_by == null &&
      formData.reviewed == null &&
      formData.homecountry_id == null &&
      formData.category == null
    ) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please make sure you have some filter!",
      });
      return;
    }

    let data = {
      ...formData,
      moduleId: this.subCategoryValue.moduleId,
      countryId: this.subCategoryValue.moduleId == 8 || this.subCategoryValue.moduleId == 10 ? 0 : this.selectedCountry,
      submoduleId: this.subCategoryValue.id,
      mode: "admin",
      page: this.page,
      perpage: this.rows,
    };
    this.readingService.getModuleQuestions(data).subscribe((response) => {
      this.questionList = response.questions;
      this.totalQuestionCount = response.questioncount;
    });
  }

  getmodulequestionList() {
    let data: any = {};
    if (this.reportservice.StoredReportData) {
      let reportdata = this.reportservice.StoredReportData;
      data = {
        ...this.filterForm.value,
        moduleId: this.module_id == 8 ? this.module_id : this.subCategoryValue.moduleId,
        countryId: reportdata.countryId,
        submoduleId: reportdata.submoduleId,
        mode: "admin",
        page: this.page,
        perpage: this.rows,
      };
      data.question = reportdata.question;

      this.readingService.getModuleQuestions(data).subscribe((response) => {
        this.questionList = response.questions;
        this.totalQuestionCount = response.questioncount;
        this.openEditQuestion(this.questionList[0])
      });
    } else {
      data = {
        ...this.filterForm.value,
        moduleId: this.module_id == 8 ? this.module_id : this.subCategoryValue.moduleId,
        countryId: this.module_id == 8 ? 0 : this.selectedCountry,
        submoduleId: this.subCategoryValue.id,
        mode: "admin",
        page: this.page,
        perpage: this.rows,

      };
      if (this.module_id != 8) {
        data = { ...data, ...this.subCategoryValue }
      }

      this.readingService.getModuleQuestions(data).subscribe((response) => {
        this.questionList = response.questions;
        this.totalQuestionCount = response.questioncount;
      });
    }

  }

  resetFilter() {
    this.form.reset();
    this.selectAllQuestion = false;
    this.page = 0;
    this.first = 0;
    this.rows = 10;
    this.filterFormElm.nativeElement.reset();
    this.filterForm.reset();
    this.getmodulequestionList();
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

  pageChange(event: PageEvent) {
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
  questionOnModuleChange(countryId?: number, moduleId?: number) {
    let quesModandcountry: any = {
      countryId: countryId,
      moduleId: moduleId
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

  deleteQuestion(event: Event) {
    if (this.questionId > 0) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Are you sure that you want to delete?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          let data = {
            question_id: this.questionId
          };
          this.readingService
            .deleteUniPrepQuestion(data)
            .subscribe((response) => {
              this.toast.add({
                severity: "success",
                summary: "Success",
                detail: response.message,
              });
              this.questionModal = false;
              this.form.reset();
              this.formElm.nativeElement.reset();
              this.getmodulequestionList();
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
      let data: any = {
        selectedFile: this.selectedFile,
      }
      if (this.module_id == 8 || this.subCategoryValue.moduleId == 10) {
        data.country_id = 0;
      }
      this.readingService
        .readQuesImport(data)
        .subscribe((response) => {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
          });
          this.selectedFile = null;
          this.fileUploadModal = false;
          this.getmodulequestionList();
        });
    } else {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please choose file!",
      });
    }
  }

  exportFile() {
    let data: any = {
      moduleId: this.subCategoryValue.moduleId,
      countryId: this.selectedCountry,
      submoduleId: this.subCategoryValue.id,
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
    if (data.moduleId == 8 || data.moduleId == 10) {
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

  DeleteSelectedCheckBoxes() {
    this.selectedQuestionForBulkDelete = [];
    this.questionList.forEach(item => {
      if (item.isChecked) {
        this.selectedQuestionForBulkDelete.push(item.id);
      }
    });
    if (this.selectedQuestionForBulkDelete.length != 0) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Are you sure that you want to delete?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          let questionData = {
            module_id: this.subCategoryValue.moduleId,
            country_id: this.selectedCountry,
            submodule_id: this.subCategoryValue.id,
            question_id: this.selectedQuestionForBulkDelete
          };
          if (this.module_id == 8) {
            questionData.module_id = 8;
            questionData.country_id = 0;
          }
          this.readingService.deleteUniPrepQuestion(questionData).subscribe((response) => {
            this.toast.add({ severity: "success", summary: "Success", detail: response.message });
            this.getmodulequestionList();
          });
        },
        reject: () => {
          this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected" });
        },
      });
    } else {
      this.toast.add({ severity: "error", summary: "Rejected", detail: "Please select some questions." });
    }
  }

  selectAllCheckboxes() {
    this.selectAllQuestion = !this.selectAllQuestion;
    if (!this.selectAllQuestion) {
      this.questionList.forEach(item => {
        item.isChecked = this.selectAllQuestion;
      });
    } else {
      this.questionList.forEach(item => {
        item.isChecked = this.selectAllQuestion;
      });
    }
  }

}
