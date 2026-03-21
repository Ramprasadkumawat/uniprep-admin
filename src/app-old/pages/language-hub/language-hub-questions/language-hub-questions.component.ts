import {Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocationService} from "../../../location.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {QAReportService} from "../../report/report.service";
import screenfull from "screenfull";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ReadingService} from "../../reading/reading.service";
import {LanguageHubService} from "../language-hub.service";


interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'uni-language-hub-questions',
    templateUrl: './language-hub-questions.component.html',
    styleUrls: ['./language-hub-questions.component.scss'],
    standalone: false
})
export class LanguageHubQuestionsComponent implements OnInit {
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

    onChange({editor}) {
        const data = editor.getData();
    }

    public editor = ClassicEditor;
    modules = {};
    @ViewChild("fullscreeneditor") editorelement: ElementRef | any;
    fullscreen = "";
    selectedCountry: number = 2;
    moduleName: string = "Language Hub";
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
        {id: null, name: "Select"},
        {id: 1, name: "Yes"},
        {id: 0, name: "No"},
    ];
    suggestionList: any[] = [
        {id: null, name: "Select"},
        {id: 1, name: "Actioned"},
        {id: 0, name: "Non-Actioned"},
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
    totalQuestionCount: number = 0;
    subCategoryValue: any;
    questionListData: any;
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
    subCategory: string = 'Language Hub';
    listOfSubmodules: any = [];
    language_id: number = 0;
    languagetype_id: number = 0;
    submodule_id: number = 0;
    languageList: any = [];
    proficiencyList: any = [{id: null, type: "Select"}];

    constructor(
        private fb: FormBuilder,
        private _location: Location,
        private service: LocationService,
        private languageHubService: LanguageHubService,
        private toast: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private reportservice: QAReportService,
        private activateRoute: ActivatedRoute,
        private readingService: ReadingService
    ) {
        this.form = fb.group({
            language: ["", [Validators.required]],
            proficiency: ["", [Validators.required]],
            question: ["", [Validators.required]],
            answer: ["", [Validators.required]],
        });
        this.filterForm = fb.group({
            from: [""],
            to: [""],
            favourite: [""],
            // filter_category_id: ['']
        });

        this.modules = {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],

                    [{header: 1}, {header: 2}],
                    [{list: 'ordered'}, {list: 'bullet'}],
                    [{script: 'sub'}, {script: 'super'}],
                    [{indent: '-1'}, {indent: '+1'}],
                    [{direction: 'rtl'}],
                    [{'size': ['small', false, 'large', 'huge']}],
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
                    [{header: [1, 2, 3, 4, 5, 6, false]}],

                    [{color: []}, {background: []}], // dropdown with defaults from theme
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
                    [{align: []}],

                    ['clean'], // remove formatting button

                    ['link', 'image', 'video'], // link and image, video
                    ["fullscreen"],
                ],
                handlers: {
                    emoji: function () {
                    },
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


    ngOnInit(): void {
        this.activateRoute.queryParams.subscribe(params => {
            this.languagetype_id = params['languagetypeId'];
            this.language_id = params['languageId'];
            this.submodule_id = params['submoduleId'];
        });

        this.getmodulequestionList();
        this.userDeletePermissionCheck();
        this.getCountryList();
        this.loadActionedByUser();
        this.getModulesList();
        //this.questionOnModuleChange();
        this.getsubmodulename();
        this.getlanguageList();
        this.getLanguageType()

    }

    getLanguageType() {
        let req = {
            languageid: this.form.value.language
        }
        this.languageHubService.getlanguageTypeList(req).subscribe((response) => {
            console.log(response)
            this.proficiencyList = response.data.map(item => ({id: item.id, type: item.type}));
            this.proficiencyList = [{id: null, type: "Select"}, ...this.proficiencyList];
        }, error => {
            this.toast.add({severity: "error", summary: "Error", detail: error,});
        });
    }

    pRatingOnClick() {
    }

    userDeletePermissionCheck() {
        this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
            this.deletePermission = response.permission;
        });
    }

    getlanguageList() {
        let req = {}
        this.languageHubService.getlanguageList(req).subscribe((response) => {
            this.languageList = response.data.map(item => ({id: item.id, language: item.language}));
            this.languageList = [{id: null, language: "Select"}, ...this.languageList];
        }, error => {
            this.toast.add({severity: "error", summary: "Error", detail: error,});
        });
    }

    getsubmodulename() {
        let req = {
            languageid: this.language_id,
            languagetype: this.languagetype_id
        }
        this.languageHubService.getlanguagesubmodulesList(req).subscribe((response) => {
            this.cardHeader = response.data.find(item => item.id == this.submodule_id).submodule;
        }, error => {
            this.toast.add({severity: "error", summary: "Error", detail: error,});
        });
    }

    loadActionedByUser() {
        this.readingService.getActionedByUser().subscribe(response => {
            this.loadActionedBy = [{id: null, name: 'Error'}, ...response];

        })
    }

    get f() {
        return this.form.controls;
    }

    changelanguageType() {
        let req = {
            languageid: this.form.value.language
        }

        this.languageHubService.getlanguageTypeList(req).subscribe((response) => {
            this.proficiencyList = response.data.map(item => ({id: item.id, type: item.type}));
            this.proficiencyList = [{id: null, type: "Select"}, ...this.proficiencyList];
        }, error => {
            this.toast.add({severity: "error", summary: "Error", detail: error,});
        });
    }

    submitForm() {
        this.submitted = true;
        if (this.questionId > 0) {
            let data: any = {
                languageid: this.form.value.language,
                languagetype: this.form.value.proficiency,
                english: this.form.value.question,
                englishanswer: this.form.value.answer,
                submodule_id: this.submodule_id,
                languagequestionId: this.questionId
            }
            this.languageHubService.updateLanguageQuestion(data).subscribe((response) => {
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
            this.languageHubService
                .addLanguageQuestions({
                    languageid: this.form.value.language,
                    languagetype: this.form.value.proficiency,
                    english: this.form.value.question,
                    englishanswer: this.form.value.answer,
                    submodule_id: Number(this.submodule_id),
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


    getmodulequestionList() {
        let data: any = {};
        if (this.reportservice.StoredReportData) {
            let reportdata = this.reportservice.StoredReportData;
            data = {
                ...this.filterForm.value,
                languageid: this.language_id,
                languagetype: this.languagetype_id,
                submoduleid: reportdata.submoduleId,
                mode: "admin",
                page: this.page,
                perpage: this.rows
            };
            this.languageHubService.getlanguageQuestionsList(data).subscribe((response) => {
                this.questionList = response.questions;
                this.totalQuestionCount = response.count;
                this.openEditQuestion(this.questionList[0]);
            });
        } else {
            data = {
                ...this.filterForm.value,
                languageid: this.language_id,
                languagetype: this.languagetype_id,
                submoduleid: this.submodule_id,
                mode: "admin",
                page: this.page,
                perpage: this.rows
            };
            this.languageHubService.getlanguageQuestionsList(data).subscribe((response) => {
                this.questionList = response.questions;
                this.totalQuestionCount = response.count;
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

    rating(question_id: any, isFav: any) {
        isFav = isFav != 1 ? 1 : 0;
        this.languageHubService.makeQuestionFav(question_id, isFav).subscribe((res: any) => {
            let scholarshipListData = this.questionList.find(item => item.id == question_id);
            isFav == 1 ? scholarshipListData.favourite = 1 : scholarshipListData.favourite = 0;
            this.toast.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
            });
        });
    }

    pageChange(event: any) {
        if (this.rows == event.rows) {
            this.page = (event.first / event.rows + 1);
        } else {
            this.page = 1;
        }
        this.rows = event.rows ?? 10;
        this.getmodulequestionList();
    }

    openViewQuestion(data: any) {
        this.viewQuestionModal = true;
        this.questionListData = data;
    }

    getModulesList() {
        this.readingService.getModulesList().subscribe(response => {
            this.modulesList = response.modules;
        });
    }

    isEditClick: boolean = false;

    openEditQuestion(data: any) {
        this.isEditClick = true;
        this.form.reset();
        this.questionModal = true;
        this.historyModal = false;
        this.form.patchValue({
            language: data.languageid,
            proficiency: data.languagetype,
            question: data.english,
            answer: data.englishanswer.replace(/\n/g, "<p><br></p>"),
        });

        this.questionId = data.id;

    }

    htmlValue: any;

    goBack() {
        this._location.back();
    }

    openQuestionForm() {
        this.isEditClick = false;
        this.questionModal = true;
        this.questionId = 0;
        this.form.reset();
        this.formElm.nativeElement.reset();
        this.submitted = false;
    }

    deleteQuestion(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: "Are you sure that you want to delete?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.languageHubService
                    .deletelanguageQuestion(this.questionId)
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
                selectedFile: this.selectedFile
            }
            this.languageHubService
                .languageQuestionsImport(data)
                .subscribe((response) => {
                    this.toast.add({
                        severity: "success",
                        summary: "Success",
                        detail: response.message,
                    });
                    this.fileUploadModal = false;
                    this.selectedFile = null;
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

    // exportFile() {
    //   let data: any = {
    //     moduleId: this.subCategoryValue.moduleId,
    //     countryId: this.selectedCountry,
    //     submoduleId: this.subCategoryValue.id,
    //   };
    //   const formData = this.filterForm.value;
    //   if (formData.formatted) {
    //     data.formatted = formData.formatted;
    //   }
    //   if (formData.favourite) {
    //     data.favourite = formData.favourite;
    //   }
    //   if (formData.verified) {
    //     data.verified = formData.verified;
    //   }
    //   if (formData.pre_verified) {
    //     data.pre_verified = formData.pre_verified;
    //   }
    //   if (formData.suggestion) {
    //     data.edited = formData.suggestion;
    //   }

    //   if (this.module_id == 8) {
    //     data.moduleId = 8;
    //     this.readingService.readLearningExport(data).subscribe((response) => {
    //       this.readingService.downloadFile(response.link).subscribe((blob) => {
    //         const a = document.createElement("a");
    //         const objectUrl = window.URL.createObjectURL(blob);

    //         a.href = objectUrl;
    //         a.download = this.moduleName + "_q&a.csv"; // Specify the desired file name
    //         document.body.appendChild(a);

    //         a.click();

    //         window.URL.revokeObjectURL(objectUrl);
    //         document.body.removeChild(a);
    //       });
    //     });
    //     return;
    //   }
    //   this.readingService.readQuesExport(data).subscribe((response) => {
    //     this.readingService.downloadFile(response.link).subscribe((blob) => {
    //       const a = document.createElement("a");
    //       const objectUrl = window.URL.createObjectURL(blob);

    //       a.href = objectUrl;
    //       a.download = this.moduleName + "_q&a.csv";
    //       document.body.appendChild(a);

    //       a.click();

    //       window.URL.revokeObjectURL(objectUrl);
    //       document.body.removeChild(a);
    //     });
    //   });
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
                    this.languageHubService.deletelanguageQuestion(JSON.stringify(this.selectedQuestionForBulkDelete)).subscribe((response) => {
                        this.toast.add({severity: "success", summary: "Success", detail: response.message});
                        this.getmodulequestionList();
                    });
                },
                reject: () => {
                    this.toast.add({severity: "error", summary: "Rejected", detail: "You have rejected"});
                },
            });
        } else {
            this.toast.add({severity: "error", summary: "Rejected", detail: "Please select some questions."});
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

    loadSubmoduleListForDropdown() {
        //  this.readingService.getsubmodulenames('').subscribe(response => {
        //      this.listOfSubmodules = response;
        //  });
    }

    onClickSubmitFilter() {
        const formData = this.filterForm.value;
        if (formData.favourite == null && !formData.from && !formData.to) {
            this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
            return;
        } else {
            this.getmodulequestionList();
        }
    }
}
