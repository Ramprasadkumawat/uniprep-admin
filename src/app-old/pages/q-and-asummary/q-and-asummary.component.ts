import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReadingService } from '../reading/reading.service';
import { LocationService } from 'src/app/location.service';
import { MessageService } from 'primeng/api';
import { QAndAsummaryService } from './q-and-asummary.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-q-and-asummary',
    templateUrl: './q-and-asummary.component.html',
    styleUrls: ['./q-and-asummary.component.scss'],
    standalone: false
})
export class QAndASummaryComponent implements OnInit {
  qaSummaryForm: FormGroup;
  qaUserSummaryForm: FormGroup;
  countryList: any;
  moduleId: any;
  countryId: any;
  loadActionedBy: any;
  loadSummaryData: any;
  totalModuleCount: any;
  totalSubmoduleCount: any;
  totalquestioncount: any;
  total_formatted: any;
  total_favourite: any;
  total_preverified: any;
  total_reviewed: any;
  total_verified: any;
  total_countries: any;
  rows: number = 100;
  perPage: number = 100;
  page: number = 1;
  categoryDropdownList: any[] = [{ id: null, name: "Select" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }];
  // modulesList:any = 
  // [
  //   { id: 1, module: "Pre Application" }, 
  //   { id: 2, module: "Post Application" },
  //   { id: 3, module: "Post Admission" },
  //   { id: 4, module: "Career Hub" },
  //   { id: 5, module: "University" },
  //   { id: 6, module: "Life at" }
  // ];
  modulesList: any[];
  listOfSubmodules: any = [];

  constructor(public fb: FormBuilder, private readingService: ReadingService, private locationservice: LocationService,
    private router: Router, private toast: MessageService, private questionsummaryservice: QAndAsummaryService) { }

  ngOnInit(): void {
    this.qaSummaryForm = this.fb.group({
      countryId: [""],
      moduleId: [""],
      submodule_id: [""],
      pre_verified: [""],
      verified: [""],
      formatted: [""],
      reviewed: [""],
      favourite: [""]
    });

    this.qaUserSummaryForm = this.fb.group({
      actioned_by: [""],
      fromdate: [""],
      todate: [""]
    });

    this.getCountryList();
    this.LoadModulesData();
    this.loadActionedByUser();
    let PageData = {
      perpage: this.perPage,
      page: this.page,
    }
    this.loadQuestionSummaryData(PageData);
  }

  LoadModulesData() {
    this.readingService.getModulesList().subscribe(response => {
      this.modulesList = response.modules;
    })
  }

  submitFilter(): void {
    let formData = this.qaSummaryForm.value;
    if (!formData.formatted && !formData.favourite && !formData.verified && !formData.submodule_id && !formData.pre_verified && !formData.reviewed && !formData.moduleId && !formData.countryId) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    } else {
      let PageData = {
        perpage: this.perPage,
        page: this.page,
        ...formData
      }
      this.loadQuestionSummaryData(PageData);
    }
  }

  userFilterSubmit(): void {
    let formData = this.qaUserSummaryForm.value;
    if (!formData.fromdate && !formData.todate && !formData.actioned_by) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    } else {
      let PageData = {
        perpage: this.perPage,
        page: this.page,
        apiName: "UsersQuestionSummary",
        ...formData
      }
      this.loadQuestionSummaryData(PageData);
    }
  }

  resetFilter(): void {
    this.qaSummaryForm.reset();
    this.loadQuestionSummaryData();
  }

  resetUsersFilter(): void {
    this.qaUserSummaryForm.reset();
    this.loadQuestionSummaryData();
  }

  getCountryList() {
    this.locationservice.getInterestedCountryList().subscribe((data) => {
      this.countryList = data;
    })
  }

  loadSubmodulesList() {

    let modData = {
      moduleId: this.qaSummaryForm.value.moduleId,
      countryId: this.qaSummaryForm.value.countryId
    };
    this.readingService.getSubmoulesListbyModAndCountry(modData).subscribe(response => {
      this.listOfSubmodules = response;
    })
  }

  loadActionedByUser() {
    this.readingService.getActionedByUser().subscribe(response => {
      this.loadActionedBy = [{ id: null, name: 'Select User' }, ...response];
    })
  }

  loadQuestionSummaryData(formData?) {
    this.questionsummaryservice.loadQuestionSummaryData(formData).subscribe(data => {
      this.loadSummaryData = data.data;
      this.totalSubmoduleCount = data.count;
      this.totalModuleCount = data.total_module;
      this.totalquestioncount = data.totalquescount;
      this.total_formatted = data.total_formatted;
      this.total_favourite = data.total_favourite;
      this.total_preverified = data.total_preverified;
      this.total_reviewed = data.total_reviewed;
      this.total_verified = data.total_verified;
      this.total_countries = data.total_countries;
    })
  }

  pageChange(event: any) {

    this.perPage = event.rows ?? 10;
    this.page = (event.page ?? 0) + 1;
    const formData = this.qaSummaryForm.value;
    let data = {
      perpage: this.perPage,
      page: this.page,
      ...formData
    }
    this.loadQuestionSummaryData(data);
  }


  exportQuestionSummary() {
    let data: any = {};
    const formData = this.qaSummaryForm.value;
    if (formData.countryId) {
      data.countryId = formData.countryId;
    }
    if (formData.moduleId) {
      data.moduleId = formData.moduleId;
    }
    if (formData.submodule_id) {
      data.submodule_id = formData.submodule_id;
    }
    if (formData.pre_verified) {
      data.pre_verified = formData.pre_verified;
    }
    if (formData.verified) {
      data.verified = formData.verified;
    }
    if (formData.formatted) {
      data.formatted = formData.formatted;
    }
    if (formData.reviewed) {
      data.reviewed = formData.reviewed;
    }
    if (formData.favourite) {
      data.favourite = formData.favourite;
    }
    this.questionsummaryservice.exportQuestionSummary(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  usersWiseExport() {
    let data: any = {};
    const formData = this.qaUserSummaryForm.value;

    if (formData.actioned_by) {
      data.actioned_by = formData.actioned_by;
    }

    if (formData.fromdate) {
      data.fromdate = formData.fromdate;
    }

    if (formData.todate) {
      data.todate = formData.todate;
    }

    this.questionsummaryservice.usersWiseExportSummary(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });

  }

  updateQuesCountSummary() {
    this.questionsummaryservice.updateQuestionSummary().subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'success', detail: response.message });
      this.loadQuestionSummaryData();
    });
  }

  onCountClick(value: any, itemData: any, cQueCount: any) {
    if (cQueCount === 0) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'No Data found, Check another Sub-module' });
      return;
    }
    localStorage.setItem('selected-category-name', '')
    localStorage.setItem('selected-category', '')
    localStorage.setItem('filter-data', '')

    localStorage.setItem('selected_module_name', value)
    localStorage.setItem('selected-summary', JSON.stringify(itemData))
    this.router.navigateByUrl('/filtered-questions');
  }

}
