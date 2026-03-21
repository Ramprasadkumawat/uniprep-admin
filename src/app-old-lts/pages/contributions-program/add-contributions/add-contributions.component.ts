import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Contributiontier, Contributor, Locations } from 'src/app/@Models/contributions-program.model';
import { ContributionsService } from '../contributions-program.service';
import { SessionService } from '../../session/session.service';
import { SourceType } from 'src/app/@Models/subscribers.model';
@Component({
    selector: 'uni-add-contributions-list',
    templateUrl: './add-contributions.component.html',
    styleUrls: ['./add-contributions.component.scss'],
    standalone: false
})

export class AddContributionsComponent implements OnInit {
  
  filterForm: FormGroup = new FormGroup({});
  locationList: Locations[] = [];
  contributionTierList: Contributiontier[] = [];
  first: number = 0;
  page: number = 1;
  pageSize: number = 20;
  contributionsList: Contributor[] = [];
  contributionsCount: number = 0;
  filterContributorsNameList: { name: string }[] = [];
  filterTotalStudentList: { total: number }[] = [];
  studentList: { label: string, value: number }[] = [
    { label: "1-10", value: 10 }, { label: "10-50", value: 50 }, { label: "50-100", value: 100 }, { label: "100-1000", value: 1000 }, { label: "1000+", value: 50000 },
  ];
  contributorObj = {};
  regionList: SourceType[] = [];

  constructor(
    private fb: FormBuilder, private contributionsService: ContributionsService,
    private toast: MessageService, private sessionService: SessionService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      state: [''],
      location: [''],
      contributiontier: [''],
      totalstudent: ['']
    });
    this.filterForm.controls['state'].valueChanges.subscribe((value: Locations) => {
      if (value) {
        this.sessionService.getLocationByRegion(value.id.toString()).subscribe({
          next: res => {
            this.locationList = res;
          },
          error: err => {
            console.log(err?.error?.message);
          }
        });
      }
      else {
        this.locationList = [];
      }
    });
  }

  ngOnInit(): void {
    this.loadContributorList();
    this.getOptionsList();
  }

  loadContributorList() {
    this.contributorObj = {
      page: this.page,
      perpage: this.pageSize
    }
    this.getContributorList(this.contributorObj);
  }

  getContributorList(value: any) {
    this.contributionsService.getContributionsList(value).subscribe({
      next: response => {
        this.contributionsList = response.data;
        this.contributionsCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  getOptionsList() {
    this.sessionService.getRegion().subscribe(res => {
      this.regionList = res;
    });
    this.contributionsService.getContributorDropDownList().subscribe(data => {
      this.contributionTierList = data.contributiontier;
      this.filterContributorsNameList = data.contributornames;
      this.filterTotalStudentList = data.totalstudents;
    });
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getContributorList({ ...this.contributorObj, page: this.page, perpage: this.pageSize });
  }

  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.name && !formData.state && !formData.location && !formData.contributiontier && !formData.totalstudent) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    var data = {
      page: 1,
      perpage: this.pageSize,
      ...formData,
      state: formData.state?.state
    };
    this.contributorObj = data;
    this.getContributorList(this.contributorObj);
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 10;
    this.contributorObj = {
      page: 1,
      perpage: this.pageSize
    }
    this.getContributorList(this.contributorObj);
  }

  exportContributior() {
    this.contributionsService.exportContributors(this.filterForm.value).subscribe((res: any) => {
      this.contributionsService.downloadFile(res.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "constributor.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    })
  }
}
