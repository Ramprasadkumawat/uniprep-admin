import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LanguageHubService } from '../language-hub.service';
import { ActivatedRoute } from '@angular/router';
import { ReadingService } from '../../reading/reading.service';

@Component({
    selector: 'uni-language-hub-subcategory',
    templateUrl: './language-hub-subcategory.component.html',
    styleUrls: ['./language-hub-subcategory.component.scss'],
    standalone: false
})
export class LanguageHubSubcategoryComponent implements OnInit {

    moduleId: number = 8;
    form: FormGroup;
    subModuleName: string = "Language Hub";
    filterForm: FormGroup;
    submitted: boolean = false;
    isAccordianSelected: boolean = false;
    filteredSearch: any;
    summaryCounts: any;
    first: number = 0;
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
    language_id: number = 0;
    filterNotActive:boolean=true;
    totalCount:number=0;

    constructor(private fb: FormBuilder, private languageHubService: LanguageHubService, private activateRoute: ActivatedRoute,
        private toast: MessageService, private confirmationService: ConfirmationService,private readingService:ReadingService) {
        this.editImage = "";
        this.form = this.fb.group({
            id: ['', [Validators.required]],
            languagetype: ['', [Validators.required]],
            urlslug: ['', [Validators.required]],
            image: ['', [Validators.required]],
        });

        this.filterForm = this.fb.group({
            submodule: [''],
            favourite: [''],
            from: [''],
            to: [''],
        });
    }

    ngOnInit(): void {
        this.activateRoute.queryParams.subscribe(params => {
            this.language_id = +params['languageId'];
        });
        this.getSubModuleData();
        this.checkSubmoduleDeletePermission();

    }

    searchSubModules(searchTerm: any): void {
        if (searchTerm.target.value) {
            this.filteredSearch = this.subModuleList.filter((data: any) =>
                data.type.toLowerCase().includes(searchTerm.target.value.toLowerCase())
            );
        } else {
            this.filteredSearch = [...this.subModuleList]; // Reset to all cities if search is cleared
        }
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
    onSearchChange(event: any) {
        this.url_slug = event.value.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    pageChange(event: any) {
        if (this.rows == event.rows) {
          this.page = (event.first / event.rows + 1);
        }
        else {
          this.page = 1;
        }
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
            this.languageHubService.addLanguageType({
                ...this.form.value, image: this.selectedFile,languageid:this.language_id
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
        if (!formData.favourite && !formData.submodule && !formData.from && !formData.to) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
            return;
        } else {
            this.getSubModuleData();
            this.filterNotActive=false;
        }
    }

    resetFilter() {
        this.form.reset();
        this.filterFormElm.nativeElement.reset();
        this.getSubModuleData();
        this.filterNotActive=true;
    }

    getSubModuleData() {
        let filterFormValues = this.filterForm.value ? this.filterForm.value : "";
        let req = {
            page: this.page,
            perpage: this.rows,
            mode: 'admin',
            ...filterFormValues,
            languageid:this.language_id
        }
        this.languageHubService.getlanguageTypeList(req).subscribe((response) => {
            this.subModuleList = response.data;
            this.totalCount=response.total;
            this.filteredSearch = [...this.subModuleList];
            this.subModuleList = this.subModuleList.filter(sub => sub.status != 0);
            if(this.filterNotActive){
                this.listOfSubmodules = this.subModuleList.map(item => ({ id: item.id, type: item.type }));
            }
        });
    }

    deleteSubmoduleandQuestion(Value: any) {

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: "Are you sure you want to delete " + Value.submodule_name + " Submodule and Questions ?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.languageHubService.deletelanguageType(Value.id).subscribe((response) => {
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
        this.form.reset();
        this.editImage = item.icon;
        this.form = this.fb.group({
            id: [item.id, [Validators.required]],
            languagetype: [item.type, [Validators.required]],
            urlslug: [item.url_slug, [Validators.required]],
            image: [item.icon, [Validators.required]],
        });
        this.isAccordianSelected = true;
        this.isEditClicked = true;
    }

    updateSubCategory() {
        this.subModuleList = [];
        let req: any = {
            languagetype: this.form.value.languagetype,
            urlslug: this.form.value.urlslug,
            id: this.form.value?.id
        }
        if (this.selectedFile) {
            req.image = this.selectedFile;
        }
        this.languageHubService.updateLanguageType(req).subscribe(data => {
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
        this.editImage = false;
    }


}
