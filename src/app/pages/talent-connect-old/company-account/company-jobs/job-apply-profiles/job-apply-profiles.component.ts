import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-job-apply-profiles',
    templateUrl: './job-apply-profiles.component.html',
    styleUrls: ['./job-apply-profiles.component.scss'],
    standalone: false
})
export class JobApplyProfilesComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  locations: any = [];
  careerInterests: any = [];
  interviewStages: any = [];
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      username: [''],
      location: [''],
      status: ['']
  });
  }

  submitFilterForm() {

  }

}
