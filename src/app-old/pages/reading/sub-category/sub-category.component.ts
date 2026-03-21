import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocationService } from 'src/app/location.service';
import { ReadingService } from '../reading.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LocalStorageService } from 'ngx-localstorage';
// import { AuthService } from 'src/app/Auth/auth.service';

@Component({
    selector: 'uni-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.scss'],
    standalone: false
})
export class SubCategoryComponent implements OnInit {
    selectedCountry: number = 2;
    filterSelectedCountry: any = null;
    countryList: any;
    moduleId: any;
    form: FormGroup;
    subModuleName: any;
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
    // loadActionedBy: any = [];
    listOfSubmodules: any = [];
    homecountries: any = [];
    categories: any = [];
    submodulePermission: number = 0;
    @ViewChild('formElm') formElm!: ElementRef;
    @ViewChild('filterFormElm') filterFormElm!: ElementRef;

    constructor(private fb: FormBuilder, private service: LocationService, private route: ActivatedRoute,
        private router: Router, private readingService: ReadingService,
        private toast: MessageService, private storage: LocalStorageService, private confirmationService: ConfirmationService) {
        this.editImage = "";
        this.form = this.fb.group({
            id: ['', [Validators.required]],
            submoduleName: ['', [Validators.required]],
            urlslug: ['', [Validators.required]],
            image: ['', [Validators.required]],
            countries: ['', [Validators.required]],
        });

        this.filterForm = this.fb.group({
            fromdate: [''],
            todate: [''],
            submodule_id: [''],
            formatted: [''],
            favourite: [''],
            verified: [''],
            suggestion: [''],
            pre_verified: [''],
            reviewed: [''],
            actioned_by: [''],
            question: [''],
            homecountry_id: [''],
            category_id: ['']
        });
        this.getCountryList();
        this.selectedCountry = Number(localStorage.getItem('countryId')) ? Number(localStorage.getItem('countryId')) : 2;
    }

    ngOnInit(): void {
        let url = window.location.href;
        this.moduleId = url.split("/").pop();
        if (this.moduleId == '10') {
            this.selectedCountry = 0;
        }
        switch (this.moduleId) {
            case '1':
                this.subModuleName = 'Pre-Admission';
                break;
            case '2':
                this.subModuleName = 'Post-Application';
                break;
            case '3':
                this.subModuleName = 'Post-Admission';
                break;
            case '4':
                this.subModuleName = 'Career Hub';
                break;
            case '5':
                this.subModuleName = 'University';
                break;
            case '7':
                this.subModuleName = 'Travel and Tourism';
                break;
            case '10':
                this.subModuleName = 'Skill Mastery';
                break;
            default:
                this.subModuleName = 'Life At Country';
                break;
        }
        //this.getCountryList();
        this.getSubModuleData();
        //this.getPreApplicationList();
        //this.loadActionedByUser();
        this.loadSubmoduleListForDropdown();
        this.checkSubmoduleDeletePermission();
        if(this.moduleId!='10'){
            this.gethomeCountryList();
        }
        this.getCategoryList();
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

    get f() {
        return this.form.controls;
    }

    checkSubmoduleDeletePermission() {
        this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
            this.submodulePermission = response.permission;
        });
    }

    // loadActionedByUser(){
    //     this.readingService.getActionedByUser().subscribe(response => {
    //       this.loadActionedBy = [{ id: null, name: 'Select' }, ...response];
    //     })
    // }
    loadSubmoduleListForDropdown() {
        
        let modData = {
            moduleId: this.moduleId,
            countryId: this.selectedCountry
        };
        if(this.moduleId!=10){
            this.readingService.getSubmoulesListbyModAndCountry(modData).subscribe(response => {
                this.listOfSubmodules = response;
            });
        }else{
            this.readingService.getSubmoulesList(modData).subscribe(response => {
                this.listOfSubmodules = response[0].items;
            });
        }
   
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
        if (this.moduleId == '10') {
            this.form.get('countries').clearValidators();
            this.form.get('countries').updateValueAndValidity();
        }
        this.submitted = true;
        if (this.form.value.id == '') {
            this.readingService.addSubModules({
                ...this.form.value, image: this.selectedFile,
                countries: this.form.value.countries == '' ? 0 : this.form.value.countries, moduleId: this.moduleId, status: 1
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
        if (!formData.fromdate && !formData.todate && !formData.formatted && !formData.favourite && !formData.verified && !formData.suggestion && !formData.submodule_id && !formData.pre_verified && !formData.reviewed && !formData.actioned_by && !formData.question && !formData.homecountry_id && !formData.category_id) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
            return;
        } else {
            let req = {
                moduleId: Number(this.moduleId),
                countryId: this.selectedCountry,
                page: this.page,
                perpage: this.rows,
                mode: 'admin',
                ...formData
            };
            this.readingService.getSubModuleList(req).subscribe((response) => {
                this.subModuleList = response.data;
                this.categoryCount = response.count;
                this.summaryCounts = response.question_summary;
            });
        }
    }

    resetFilter() {
        this.form.reset();
        this.filterFormElm.nativeElement.reset();
        this.editImage = '';
        this.getSubModuleData();
    }

    getSubModuleData() {
        let filterFormValues = this.filterForm.value ? this.filterForm.value : "";
        let req = {
            moduleId: Number(this.moduleId),
            countryId: this.selectedCountry,
            page: this.page,
            perpage: this.rows,
            mode: 'admin',
            ...filterFormValues
        }
        this.readingService.getSubModuleList(req).subscribe((response) => {
            this.subModuleList = response.data;
            this.categoryCount = response.count;
            this.summaryCounts = response.question_summary;
        });
    }

    countryOnChange(event: any) {
        this.selectedCountry = event.value;
        localStorage.setItem('countryId', event.value);
        this.getSubModuleData();
        this.loadSubmoduleListForDropdown();
    }

    getCountryList() {
        this.service.getInterestedCountryList().subscribe((data) => {
            this.countryList = data;
        })
    }

    navigateSubcategory(data: any) {
        let filterFormData = this.filterForm.value ? this.filterForm.value : "";
        let navigationExtras: NavigationExtras = {
            state: { ...data, moduleId: Number(this.moduleId), country: this.moduleId == '10' ? 0 : this.selectedCountry, moduleName: this.subModuleName, ...filterFormData }
        }
        this.storage.set('sub-category', navigationExtras);
        switch (this.moduleId) {
            case '1':
                this.router.navigate(['/reading/pre-application'], navigationExtras).then();
                break;
            case '2':
                this.router.navigate(['/reading/post-application'], navigationExtras).then();
                break;
            case '3':
                this.router.navigate(['/reading/post-admission'], navigationExtras).then();
                break;
            case '4':
                this.router.navigate(['/reading/career-hub'], navigationExtras).then();
                break;
            case '5':
                this.router.navigate(['/reading/university'], navigationExtras).then();
                break;
            case '7':
                this.router.navigate(['/reading/travel-and-tourism'], navigationExtras).then();
                break;
            case '10':
                this.router.navigate(['/reading/skill-mastery'], navigationExtras).then();
                break;
            default:
                this.router.navigate(['/reading/life-at-country'], navigationExtras).then();
                break;
        }
    }

    deleteSubmoduleandQuestion(Value: any) {

        let data = {
            moduleId: this.moduleId,
            submoduleId: Value.id,
            countryId: this.selectedCountry,
            totalQues: Value.questioncount ? Value.questioncount : 0,
            submoduleName: Value.submodule_name
        };

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: "Are you sure you want to delete " + Value.submodule_name + " Submodule and Questions ?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.readingService.deleteSubmodulesWithQuestions(data).subscribe((response) => {
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
    editImage: any;
    isEditClicked: boolean = false;
    editSubCategoryName(item: any) {
        let req = {
            id: item.id,
            moduleId: this.moduleId,
        }

        this.readingService.editSubModuleList(req).subscribe(data => {

            data = data[0];
            this.form.reset();
            this.editImage = item.icon;
            let result = JSON.parse(data.countries);
            this.form = this.fb.group({
                id: [data.id, [Validators.required]],
                submoduleName: [data.submodule_name, [Validators.required]],
                urlslug: [data.urlslug, [Validators.required]],
                image: [data.icon, [Validators.required]],
                countries: [result, [Validators.required]],
            });
            if (this.moduleId == '10') {
                this.form.value.countries = '';
            }
            this.isAccordianSelected = true;
            this.isEditClicked = true;
        });
    }

    updateSubCategory() {
        this.subModuleList = [];
        let apiName = '';
        switch (this.moduleId) {
            case '1':
                apiName = 'editpreappsubmodule';
                break;
            case '2':
                apiName = 'editpostappsubmodule';
                break;
            case '3':
                apiName = 'editpostadmsubmodule'
                break;
            case '4':
                apiName = 'editcareerhubsubmodule'
                break;
            case '5':
                apiName = 'getuniversitysubmoduleqcount'
                break;
            case '7':
                apiName = 'getuniversitysubmoduleqcount'
                break;
            default:
                apiName = 'getlifeincountrysubmoduleqcount'
                break;

        }
        if (this.moduleId == '10') {
            this.form.get('countries').clearValidators();
            this.form.get('countries').updateValueAndValidity();
        }
        let req = {
            id: this.form.value.id,
            moduleId: this.moduleId,
            submoduleName: this.form.value.submoduleName,
            urlslug: this.form.value.urlslug,
            image: this.selectedFile,
            countries: this.form.value.countries == '' ? 0 : this.form.value.countries
        }

        this.readingService.updateSubModuleList(req).subscribe(data => {
            this.form.reset();
            this.getSubModuleData();
            this.isEditClicked = false;
            this.isAccordianSelected = false;
            this.editImage = '';
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
