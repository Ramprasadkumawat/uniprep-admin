import { filter } from 'rxjs';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TalentConnectService } from '../talent-connect.service';
import { Meta } from '@angular/platform-browser';
import { SocialShareService } from '../../service/social-share.service';
import { PopoverModule } from 'primeng/popover';
import { MessageService } from 'primeng/api';

export interface JobList {
  isChecked: number
  id: number
  position: string
  available_vacancies: number
  start_date: string
  due_date: Date
  currency_code: string
  salary_offer: number
  worklocation: string
  company_name: string
  company_logo: any
  total_application: number,
  job_id: any,
  uuid: any,
  work_mode: any,
  experiencelevel: any,
  intro_video: any,
  post_date: any,
  hiring_type: any,
  hiring_status: any
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  standalone: false
})
export class JobsComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  showModal: boolean = false;
  submitted: boolean = false;
  positionTitleList: any = [];
  jobIdList: any = [];
  industryList: any = [];
  experienceLevelList: any = [];
  currenciesList: any = [];
  salariesList: any = [];
  workModeList: any = [];
  employmentTypeList: any = [];
  workLocationList: any = [];
  first: number = 0;
  page: number = 1;
  pageSize: number = 10;
  totalJobCount: number = 0;
  jobsList: JobList[] = [];
  countryList: any = [];
  totalCompanyCount: number = 0;
  jobDetails: any;
  Array = Array;
  selectedCard: string = "list";
  viewOptions: { label: string; value: string }[] = [
    { label: "List View", value: "list" },
    { label: "Card View", value: "card" },
  ];
  socialShareService = inject(SocialShareService);
  meta = inject(Meta);
  @ViewChild('shareOverlay') shareOverlay!: PopoverModule;
  introductionVideo: any[] = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
  ];
  hiringType: any[] = [
    { value: 1, label: 'Company Hire' },
    { value: 2, label: 'Co-Hire' },
    { value: 3, label: 'Campus Hire' },
  ]

  campusSelection: any;
  constructor(private fb: FormBuilder, private talentConnectService: TalentConnectService,
    private toast: MessageService
  ) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      position: [''],
      keyword: [''],
      job_id: [''],
      country: [''],
      worklocation: [''],
      workmode: [''],
      employmentType: [''],
      currency: [''],
      min_salary: [''],
      max_salary: [''],
      experiencelevel: [''],
      introduction_video: [''],
      hiring_type: [''],
      campus_selection: ['']
    });
    this.getDropDownList();
    var data = {
      page: 1,
      perpage: 10,
    }
    this.getJobsList(data);
    this.getCampusSelction();
  }

  getCampusSelction() {
    this.talentConnectService.getCampusSelction().subscribe({
      next: (response) => {
        console.log(response);
        this.campusSelection = response;
      },
    });
  }

  copyURL() {
    // if (this.filterForm.valid) {
    //   this.toast.add({ severity: 'info', summary: 'Info', detail: 'All required fields filled!' });
    //   return;
    // }
    const jsonData = JSON.stringify(this.filterForm.value, null, 2);
    let ency = btoa(jsonData.toString())
    let url = 'https://job.uniprep.ai/jobs/' + ency
    navigator.clipboard.writeText(url).then(() => {

      this.toast.add({ severity: 'success', summary: 'Copied', detail: url });
    }).catch(err => {
      console.error("Failed to copy!", err);
    });
  }

  getCountries() {
    this.talentConnectService.getGlobalPresenceList().subscribe({
      next: (response) => {
        this.countryList = response;
      },
    });
  }


  get f() {
    return this.filterForm.controls;
  }


  paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;

    this.getJobsList({
      ...this.filterForm.value,
      page: this.page,
      perpage: this.pageSize,
    });
  }
  filterJobs() {
    this.getJobsList({
      ...this.filterForm.value,
      page: 1,
      perpage: 10,
    });
  }
  viewDetails(id: number) {
    this.getJobDetails(id);
  }
  resetJobsList() {
    this.filterForm.reset();
    var data = {
      page: 1,
      perpage: 10,
    }
    this.getJobsList(data);

  }
  getJobDetails(id: number) {
    this.talentConnectService.getJobDetails(id).subscribe({
      next: response => {
        // Process the response data to match our Job interface
        if (response.job && response.job[0]) {
          this.jobDetails = response.job[0];
          this.showModal = true;
        }
      }
    })
  }

  exportJobList() {
    const formValues = this.filterForm.value;

    const data = {
      ...formValues,
      export: 'csv'
    };

    this.talentConnectService.getExportJobData(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'job-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "tick":
        return "bg-success"
      case "future":
        return "bg-primary"
      case "closed":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getDropDownList() {
    this.getCountries();
    this.talentConnectService.getWorkLocationList().subscribe({
      next: response => {
        this.workLocationList = response.worklocations;
      }
    });
    this.talentConnectService.getJobDropDownList().subscribe({
      next: response => {
        this.currenciesList = response.currencycode;
        this.employmentTypeList = response.employmenttype;
        this.experienceLevelList = response.experiecelevel;
        this.industryList = response.industrytypes;
        this.workModeList = response.workmode;
        this.jobIdList = response.jobid;
        this.positionTitleList = response.positions;
      },
      error: error => {

      }
    });
  }

  getJobsList(value?: any) {
    // const data = {
    //   page: this.page,
    //   perpage: this.pageSize,
    //   ...value
    // }
    this.talentConnectService.getJobsLists(value).subscribe({
      next: response => {
        this.jobsList = response.jobs;
        this.totalJobCount = response.totaljobs;
        this.totalCompanyCount = response.totalcompanies
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  hiringStatusClass(job: JobList): { icon: string; class: string; label: string } {
    const status = job.hiring_status?.trim().toLowerCase();

    if (status === 'actively hiring') {
      return {
        icon: 'pi-check',
        class: 'bg-success',
        label: 'Actively Hiring'
      };
    } else if (status === 'closed') {
      return {
        icon: 'pi-times',
        class: 'bg-danger',
        label: 'Hiring Closed'
      };
    } else {
      return {
        icon: 'pi-clock',
        class: 'bg-primary',
        label: 'Future Hiring'
      };
    }
  }
  shareQuestion(event: any, type: string, job: any) {
    event.stopPropagation();
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = 'https://job.uniprep.ai' + '/view/' + job.uuid;
    const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent('UNIPREP | ' + job?.position + ' | ' + job.company_name);

    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    let shareUrl = '';
    switch (type) {
      case 'Whatsapp':
        shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
        break;
      case 'Mail':
        shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
        break;
      case 'LinkedIn':
        shareUrl = `${socialMedias[type]}${encodedUrl}&title=${title}`;
        break;
      case 'Twitter':
        shareUrl = `${socialMedias[type]}${encodedUrl}&text=${title}`;
        break;
      case 'Facebook':
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
        break;
      case 'Instagram':
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
        break;
      default:
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
    }
    window.open(shareUrl, '_blank');
  }
  copyLink(event: any, job: any) {
    event.stopPropagation();
    const textToCopy = encodeURI('https://job.uniprep.ai' + '/view/' + job.uuid);
    this.socialShareService.copyQuestion(textToCopy, 'Job Link copied successfully');
  }
}
