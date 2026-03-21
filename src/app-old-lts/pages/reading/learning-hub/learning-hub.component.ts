import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReadingService } from '../reading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '@env/environment';

@Component({
    selector: 'uni-learning-hub',
    templateUrl: './learning-hub.component.html',
    styleUrls: ['./learning-hub.component.scss'],
    standalone: false
})
export class LearningHubComponent implements OnInit {

    moduleId: number = 8;
    form: FormGroup;
    subModuleName: string = "Learning Hub";
    filterForm: FormGroup;
    submitted: boolean = false;
    isAccordianSelected: boolean = false;
    categoryCount: number = 0;
    summaryCounts: any;
    first: number = 1;
    page: number = 1;
    rows: number = 10;
    categoryDropdownList: any[] = [{ id: null, name: "Select" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }];
    suggestionList: any[] = [{ id: null, name: "Select" }, { id: 1, name: "Actioned" }, { id: 2, name: "Non-Actioned" }];
    subModuleList: any = [];
    selectedFile: any;
    listOfSubmodules: any = [];
    categories: any = [];
    submodulePermission: number = 0;
    @ViewChild('formElm') formElm!: ElementRef;
    @ViewChild('filterFormElm') filterFormElm!: ElementRef;
    editImage: any;
    isEditClicked: boolean = false;
  

    constructor(private fb: FormBuilder, private readingService: ReadingService,
        private toast: MessageService, private confirmationService: ConfirmationService) {
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
            filter_category_id:[""],
            favourite:[""]
        });
    }

    ngOnInit(): void {
        this.getSubModuleData();
        this.loadSubmoduleListForDropdown();
        this.checkSubmoduleDeletePermission();
        this.getCategoryList();
    }


    getCategoryList() {
        this.readingService.getCategory().subscribe((response) => {
            this.categories = [{ id: null, name: "Select" }, ...response];
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
    loadSubmoduleListForDropdown() {
        this.readingService.getsubmodulenames('').subscribe(response => {
            this.listOfSubmodules = response;
        });
    }

    url_slug: string;
    onSearchChange(event: any) {
        this.url_slug = event.value.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

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
        this.submitted = true;
        if (this.form.value.id == '') {
            this.readingService.addCategory({
                ...this.form.value, image: this.selectedFile,
                moduleId: this.moduleId, status: 1
            }).subscribe((response) => {

                this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
                this.submitted = false;
                this.form.reset();
                this.formElm.nativeElement.reset();
                this.getSubModuleData();
            });

        }
    }

    onClickSubmitFilter() {
        const formData = this.filterForm.value;
        if (!formData.fromdate && !formData.todate  && !formData.favourite &&!formData.filter_category_id ) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
            return;
        } else {
            let req = {
                moduleId: Number(this.moduleId),
                page: this.page,
                perpage: this.rows,
                mode: 'admin',
                ...formData
            };
            this.readingService.getLearningCategories(req).subscribe((response) => {
                this.subModuleList = response.data;
                this.categoryCount = response.count;
            });
        }
    }

    resetFilter() {
        this.form.reset();
        this.filterFormElm.nativeElement.reset();
        this.getSubModuleData();
    }

    getSubModuleData() {
        let filterFormValues = this.filterForm.value ? this.filterForm.value : "";
        let req = {
            moduleId: Number(this.moduleId),
            page: this.page,
            perpage: this.rows,
            mode: 'admin',
            ...filterFormValues
        }
        this.readingService.getLearningCategories(req).subscribe((response) => {
            this.subModuleList = response.data;
            this.categoryCount = response.count;
        });
    }

    deleteSubmoduleandQuestion(Value: any) {
        let data = {
            moduleId: this.moduleId,
            category_id: Value.id,
            countryId: 0,
        };
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: "Are you sure you want to delete " + Value.submodule_name + " Submodule and Questions ?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.readingService.deleteCategoryWithQuestions(data).subscribe((response) => {
                    this.toast.add({ severity: response.status, summary: response.status, detail: response.message, });
                });
                this.getSubModuleData();
            },
            reject: () => {
                this.toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
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
        this.readingService.editLearningCategory(item.id).subscribe(res => {
            let data = res.data;
            this.form.reset();
            this.editImage = item.icon;
            this.form = this.fb.group({
                id: [data.id, [Validators.required]],
                categoryname: [data.category, [Validators.required]],
                urlslug: [data.url_slug, [Validators.required]],
                image: [data.icon, [Validators.required]],
            });
            this.isAccordianSelected = true;
            this.isEditClicked = true;
        });

    }

    updateSubCategory() {
        this.subModuleList = [];
        let req: any = {
            categoryname: this.form.value.categoryname,
            urlslug: this.form.value.urlslug,
        }
        if (this.selectedFile) {
            req.image = this.selectedFile;
        }
        this.readingService.updateLearningCategory(req, this.form.value?.id).subscribe(data => {
            this.form.reset();
            this.getSubModuleData();
            this.isEditClicked = false;
            this.isAccordianSelected = false;
            this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
        });
    }

    resetForm(form: any) {
        form.reset();
        this.formElm.nativeElement.reset();
        this.isAccordianSelected = false;
        this.isEditClicked = false;
    }
     
}
