import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReadingService} from "../reading.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {LocalStorageService} from "ngx-localstorage";
import { Location } from "@angular/common";

@Component({
    selector: 'uni-k12-subject',
    templateUrl: './k12-subject.component.html',
    styleUrls: ['./k12-subject.component.scss'],
    standalone: false
})
export class K12SubjectComponent implements OnInit {
    @ViewChild('formElm') formElm!: ElementRef;
    @ViewChild('filterFormElm') filterFormElm!: ElementRef;
    moduleId: number = 14;
    form: FormGroup;
    subModuleName: string = "K12";
    filterForm: FormGroup;
    submitted: boolean = false;
    isAccordionSelected: boolean = false;
    categoryCount: number = 0;
    first: number = 1;
    page: number = 1;
    rows: number = 10;
    categoryDropdownList: any[] = [{id: null, name: "Select"}, {id: 1, name: "Yes"}, {id: 2, name: "No"}];
    suggestionList: any[] = [{id: null, name: "Select"}, {id: 1, name: "Actioned"}, {id: 2, name: "Non-Actioned"}];
    subModuleList: any = [];
    selectedFile: any;
    listOfSubmodules: any = [];
    categories: any = [];
    submodulePermission: number = 0;

    editImage: any;
    isEditClicked: boolean = false;
    boardId: string | null = null;
    classId: string | null = null;

    constructor(private fb: FormBuilder, private readingService: ReadingService, private route: ActivatedRoute,
                private toast: MessageService, private confirmationService: ConfirmationService,
                private router: Router, private storage: LocalStorageService, private _location: Location) {
        this.boardId = this.route.snapshot.paramMap.get('board_id');
        this.classId = this.route.snapshot.paramMap.get('class_id');

        this.editImage = "";
        this.form = this.fb.group({
            id: ['', [Validators.required]],
            categoryname: ['', [Validators.required]],
            urlslug: ['', [Validators.required]],
            image: ['', [Validators.required]],
        });

        this.filterForm = this.fb.group({
            fromdate: [""],
            todate: [""],
            filter_category_id: [""],
            favourite: [""]
        });
    }

    ngOnInit(): void {
        this.getSubModuleData();
        this.checkSubmoduleDeletePermission();
        this.getCategoryList();
    }


    getCategoryList() {
        this.readingService.getCategory().subscribe((response) => {
            this.categories = [{id: null, name: "Select"}, ...response];
        });
    }

    get f() {
        return this.form.controls;
    }

    checkSubmoduleDeletePermission() {
        this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
            this.submodulePermission = response.permission;
        });
    }
    url_slug: string;

    pageChange(event: any) {
        this.first = event.first ?? 0;
        this.page = (event.page ?? 0) + 1;
        this.rows = event.rows ?? 10;
        this.getSubModuleData();
    }

    submitForm() {
        if (this.isEditClicked) {
            this.updateSubCategory();
            return;
        }
        if (this.form.value.categoryname == '' || this.form.value.image == '' || this.form.value.urlslug == '') {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields!' });
            return;
        }
        this.submitted = true;
        this.readingService.addSubject({
            ...this.form.value, image: this.selectedFile,
            moduleId: this.moduleId, status: 1, parent_category_id: this.classId, parent_category_order: 2
        }).subscribe((response) => {
            this.toast.add({severity: 'success', summary: 'Success', detail: response.message});
            this.submitted = false;
            this.form.reset();
            this.formElm.nativeElement.reset();
            this.getSubModuleData();
        });
    }

    onClickSubmitFilter() {
        const formData = this.filterForm.value;
        if (!formData.fromdate && !formData.todate && !formData.favourite && !formData.filter_category_id) {
            this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
            return;
        } else {
            let req = {
                moduleId: Number(this.moduleId),
                page: this.page,
                perpage: this.rows,
                mode: 'admin',
                fromdate: formData.fromdate,
                todate: formData.todate,
                filter_category_id: formData.filter_category_id,
                favourite: formData.favourite,
            };
            this.readingService.getLearningCategories(req).subscribe((response) => {
                this.subModuleList = response.data;
                this.categoryCount = response.count;
                this.listOfSubmodules = response.data;
            });
        }
    }

    resetFilter() {
        this.form.reset();
        this.filterFormElm.nativeElement.reset();
        this.getSubModuleData();
    }

    getSubModuleData() {
        let req: any
        req = {
            moduleId: Number(this.moduleId),
            page: this.page,
            perpage: this.rows,
            mode: 'admin',
            parent_category_id: Number(this.classId)
        }
        this.readingService.getSubjectList(req).subscribe((response) => {
            this.subModuleList = response.data;
            this.categoryCount = response.count;
        });
    }

    delete(Value: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: "Are you sure you want to delete " + Value.submodule_name + " Submodule and Questions ?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                let data = {
                    module_id: this.moduleId,
                    category_id: Value.id,
                    countryId: 0,
                };
                this.readingService.deleteCareerToolCategorySubject(data).subscribe((response) => {
                    this.toast.add({severity: 'success', summary: 'Deleted', detail: response.message,});
                });
                this.getSubModuleData();
            },
            reject: () => {
                this.toast.add({severity: "error", summary: "Rejected", detail: "You have rejected",});
            },
        });
    }

    onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement?.files?.length) {
            this.selectedFile = inputElement.files[0];
            this.form.patchValue({
                image: this.selectedFile.name,
            });
        } else {
            this.selectedFile = null;
        }
    }

    editSubCategoryName(item: any) {
        // this.readingService.editLearningCategory(item.id).subscribe(res => {
        let data = item
        this.form.reset();
        this.editImage = item.icon;
        this.form = this.fb.group({
            id: [data.id, [Validators.required]],
            categoryname: [data.category_name, [Validators.required]],
            urlslug: [data.url_slug, [Validators.required]],
            image: [data.icon, [Validators.required]],
        });
        this.isAccordionSelected = true;
        this.isEditClicked = true;
        // });
    }

    updateSubCategory() {
        this.subModuleList = [];
        let req: any = {
            mnoduleId: this.moduleId,
            categoryname: this.form.value.categoryname,
            urlslug: this.form.value.urlslug,
        }
        if (this.selectedFile) {
            req.image = this.selectedFile;
        }
        this.readingService.updateSubject(req, this.form.value?.id).subscribe(data => {
            this.form.reset();
            this.getSubModuleData();
            this.isEditClicked = false;
            this.isAccordionSelected = false;
            this.toast.add({severity: 'success', summary: 'Success', detail: data.message});
        });
    }

    resetForm(form: any) {
        form.reset();
        this.formElm.nativeElement.reset();
        this.isAccordionSelected = false;
        this.isEditClicked = false;
    }

    redirect(item: any) {
        let filterFormData = this.filterForm.value ? this.filterForm.value : "";
        let navigationExtras: NavigationExtras = {
            state: {
                ...item, moduleId: 14,
                country: 0,
                moduleName: this.subModuleName,
                class_id: this.boardId,
                subject: this.classId,
                ...filterFormData
            }
        }
        this.storage.set('subject-data', navigationExtras);
        this.router.navigate([`/reading/k12-chapter/${item.id}`], navigationExtras).then();
        // let filterFormData = this.filterForm.value ? this.filterForm.value : "";
        // let navigationExtras: NavigationExtras = {
        //     state: {
        //         ...item, moduleId: 14,
        //         country: 0,
        //         moduleName: this.subModuleName,
        //         class_id: this.boardId,
        //         subject: this.classId,
        //         ...filterFormData
        //     }
        // }
        // this.storage.set('sub-category', navigationExtras);
        // this.router.navigate(['/reading/k12-question'], navigationExtras).then();
    }

    goBack(){
        this._location.back();
    }
}
