import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReadingService} from '../reading/reading.service';
import {LocationService} from 'src/app/location.service';
import {MessageService} from 'primeng/api';
import {QAndAcategorysummaryService} from './q-and-a-categorysummary.service';
import {Router} from "@angular/router";

@Component({
    selector: 'uni-q-and-a-categorysummary',
    templateUrl: './q-and-a-categorysummary.component.html',
    styleUrls: ['./q-and-a-categorysummary.component.scss'],
    standalone: false
})
export class QAndACategorysummaryComponent implements OnInit {
    qaCategorySummaryForm: FormGroup;
    perPage: number = 100;
    page: number = 1;
    loadCategorySummaryData: any;
    totalModuleCount: any;
    totalSubmoduleCount: any;
    totalquestioncount: any;
    total_generic: any;
    total_international: any;
    total_national: any;
    total_ug: any;
    total_pg: any;
    total_others: any;
    total_countries: any;
    totalFoundation: number;
    totalDiploma: number;
    totalPgDiploma: number;
    countryList: any;
    listOfSubmodules: any = [];
    modulesList: any[];
    rows: number = 100;
    categoryDropdownList: any[] = [{id: null, name: "Select"}, {id: 1, name: "Yes"}, {id: 2, name: "No"}];
    homecountries: any[] = [];

    constructor(public fb: FormBuilder, private toast: MessageService,
                private questioncategorysummaryservice: QAndAcategorysummaryService,
                private locationservice: LocationService, private readingService: ReadingService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getCategoryList()
        this.qaCategorySummaryForm = this.fb.group({
            homecountryId: [""],
            countryId: [""],
            moduleId: [""],
            submodule_id: [""],
            generic: [""],
            international: [""],
            national: [""],
            ug: [""],
            pg: [""],
            others: [""],
        });
        this.getCountryList();
        this.LoadModulesData();
        this.gethomeCountryList();
        let PageData = {
            perpage: this.perPage,
            page: this.page,
        }
        this.loadQACategorySummaryData(PageData);
    }

    submitFilter(): void {
        let formData = this.qaCategorySummaryForm.value;
        if (!formData.generic && !formData.international && !formData.national && !formData.submodule_id && !formData.ug && !formData.pg && !formData.others && !formData.moduleId && !formData.countryId) {
            this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
            return;
        } else {
            let PageData = {
                perpage: this.perPage,
                page: this.page,
                ...formData
            }
            this.loadQACategorySummaryData(PageData);
        }
    }

    loadQACategorySummaryData(formData?) {
        this.questioncategorysummaryservice.loadQACategorySummaryData(formData).subscribe(data => {
            this.loadCategorySummaryData = data.data;
            this.totalSubmoduleCount = data.count;
            this.totalModuleCount = data.total_module;
            this.totalquestioncount = data.totalquescount;
            this.total_international = data.total_international;
            this.total_generic = data.total_generic;
            this.total_national = data.total_national;
            this.total_ug = data.total_ug;
            this.total_pg = data.total_pg;
            this.total_others = data.total_others;
            this.total_countries = data.total_countries;
            this.totalFoundation = data.total_foundation;
            this.totalDiploma = data.total_diploma;
            this.totalPgDiploma = data.total_pg_diploma;
        });
    }

    getCountryList() {
        this.locationservice.getInterestedCountryList().subscribe((data) => {
            this.countryList = data;
        })
    }

    loadSubmodulesList() {

        let modData = {
            moduleId: this.qaCategorySummaryForm.value.moduleId,
            countryId: this.qaCategorySummaryForm.value.countryId
        };
        this.readingService.getSubmoulesListbyModAndCountry(modData).subscribe(response => {
            this.listOfSubmodules = response;
        })
    }

    LoadModulesData() {
        this.readingService.getModulesList().subscribe(response => {
            this.modulesList = response.modules;
        })
    }

    resetFilter(): void {
        this.qaCategorySummaryForm.reset();
        this.loadQACategorySummaryData();
    }

    gethomeCountryList() {
        this.readingService.getHomeCountry(2).subscribe((response) => {
            this.homecountries = [{id: null, country: "Select"}, ...response];
        });
    }

    updateQuesCountSummary() {
        this.questioncategorysummaryservice.updateQuestionSummary().subscribe((response) => {
            this.toast.add({severity: 'success', summary: 'success', detail: response.message});
            this.loadQACategorySummaryData();
        });
    }

    exportQuestionSummary() {
        let data: any = {};
        const formData = this.qaCategorySummaryForm.value;
        if (formData.countryId) {
            data.countryId = formData.countryId;
        }
        if (formData.moduleId) {
            data.moduleId = formData.moduleId;
        }
        if (formData.submodule_id) {
            data.submodule_id = formData.submodule_id;
        }
        if (formData.generic) {
            data.generic = formData.generic;
        }
        if (formData.international) {
            data.international = formData.international;
        }
        if (formData.national) {
            data.national = formData.national;
        }
        if (formData.pg) {
            data.pg = formData.pg;
        }
        if (formData.ug) {
            data.ug = formData.ug;
        }
        if (formData.others) {
            data.others = formData.others;
        }
        this.questioncategorysummaryservice.exportQuestionSummary(data).subscribe((response) => {
            window.open(response.link, '_blank');
        });
    }
    onCountClick(value: any, itemData: any, cQueCount: any){
        if(cQueCount === 0) {
            this.toast.add({severity: 'error', summary: 'Error', detail: 'No Data found, Check another category'});
            return;
        }

        localStorage.setItem('selected_module_name', '')
        localStorage.setItem('selected-summary', '')
        let catId = this.getCategoryIdByName(value);
        localStorage.setItem('selected-category-name', value)
        localStorage.setItem('selected-category', catId.toString())
        localStorage.setItem('filter-data', JSON.stringify(itemData))
        this.router.navigateByUrl('/filtered-questions');
    }
    categories: any
    getCategoryList() {
        this.readingService.getCategory().subscribe((response) => {
          this.categories = [{ id: null, name: "Select" }, ...response];
        });
    }

    getCategoryIdByName(name: string): number | undefined {
        const category = this.categories.find(category => category.name === name);
        return category ? category.id : undefined;
    }

    pageChange(event: any) {

        this.perPage = event.rows ?? 10;
        this.page = (event.page ?? 0) + 1;
        const formData = this.qaCategorySummaryForm.value;
        let data = {
          perpage: this.perPage,
          page: this.page,
          ...formData
        }
        this.loadQACategorySummaryData(data);
      }
}
