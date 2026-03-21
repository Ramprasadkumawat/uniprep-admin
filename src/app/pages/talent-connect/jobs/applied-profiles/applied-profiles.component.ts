import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TalentConnectService } from '../../talent-connect.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'uni-applied-profiles',
    templateUrl: './applied-profiles.component.html',
    styleUrls: ['./applied-profiles.component.scss'],
    standalone: false
})
export class AppliedProfilesComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  locations: any = [];
  careerInterests: any = [];
  interviewStages: any = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  first: number = 0;
  totalCandidates: number = 0;
  candidates: any[] = [];
  id: number = NaN;
  workLocationList: any = [];
  hiringStages: any = [];
  studentList: any = [];
  constructor(private activatedRoute: ActivatedRoute,private fb: FormBuilder, private talentConnectService: TalentConnectService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'] as number;
    this.filterForm = this.fb.group({
      username: [''],
      location: [''],
      stage: ['']
  });
  this.getDropDownList();
  this.getCandidatesList();
  }

  getCandidatesList(params?: any) {
    const data = {
      id: this.id,
      page: this.page,
      perpage: this.pageSize,
      ...params
    }
    this.talentConnectService.getCandidateLists(data).subscribe({
      next: response => {
        this.candidates = response.jobs;
        this.totalCandidates = response.totalcandidates;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Initial Round': return 'bg-success';
      case 'HR Round': return 'bg-warning';
      case 'Job Closed': return 'bg-dark';
      default: return '';
    }
  }

  getDropDownList() {
    this.talentConnectService.getWorkLocationList().subscribe({
      next: response => {
        this.workLocationList = response.worklocations;
      }
    });
    this.talentConnectService.getJobDropDownList().subscribe({
      next: response => {
        this.workLocationList = response.worklocations;
        this.studentList = response.students;
        this.hiringStages = response.hiringStages;
      },
      error: error => {

      }
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
    this.getCandidatesList({ ...this.filterForm.value});
  }

}
