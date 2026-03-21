import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ContributionsService } from '../contributions-program.service';
import { environment } from '@env/environment';
import { SessionService } from '../../session/session.service';
import { ContributionCollege, Locations } from 'src/app/@Models/contributions-program.model';
import { SourceType } from 'src/app/@Models/subscribers.model';

@Component({
    selector: 'uni-college-list',
    templateUrl: './college-list.component.html',
    styleUrls: ['./college-list.component.scss'],
    standalone: false
})
export class CollegeListComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  locationList: Locations[] = [];
  contributionStatusList = [{ id: 0, status: 'Yet to Complete' }, { id: 1, status: 'Completed' }];
  collegeTypeList = [{ name: 'Government' }, { name: 'Private' }];
  filterStatusList = [{ id: 0, status: 'Inactive' }, { id: 1, status: 'Active' }];
  filterProfileCompletionList = [{ id: 0, name: '0%' }, { id: 25, name: '25%' }, { id: 50, name: '50%' }, { id: 75, name: '75%' }, { id: 100, name: '100%' }]
  submitted: boolean = false;
  first: number = 0;
  page: number = 1;
  activeIndex: number = -1;
  contributionsCollegeList: any[] = [];
  contributorClgCount: number = 0;
  filterContributorsNameList: any[] = [];
  filterTotalStudentList: any[] = [];
  filterContributorsPincodeList: any[] = [];
  @ViewChild('formElm') formElm!: ElementRef;
  contributorId: number = 0;
  studentList: { label: string, value: number }[] = [
    { label: "1-10", value: 10 }, { label: "10-50", value: 50 }, { label: "50-100", value: 100 }, { label: "100-1000", value: 1000 }, { label: "1000+", value: 50000 },
  ];
  educationTypeList: any[] = [];
  collegeId: number = 0;
  pageSize: number = 20;
  contributorClgObj = {};
  sampleDoc: string = `https://${environment.domain}/uniprepapi/storage/app/public/SampleUploadDocuments/contribution/sample_files.zip`;
  selectedFile: any;
  isCollegeImport: boolean = false;
  regionList: SourceType[] = [];
  locationLists: Locations[] = [];
  contributionforCollegeList: ContributionCollege[] = [];

  constructor(private fb: FormBuilder, private contributionsService: ContributionsService,
    private toaster: MessageService, private sessionService: SessionService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      pincode: ['', Validators.required],
      contribution_status: ['', Validators.required],
      total_student: ['', Validators.required],
      type: ['', Validators.required],
      college_type: ['', Validators.required],
      marketing_management_id: ['']
    });

    this.filterForm = this.fb.group({
      name: [''],
      state: [''],
      location: [''],
      pincode: [''],
      contribution_status: [''],
      total_student: [''],
      type: [''],
      status: [''],
      profile_completion: [''],
    });
    this.filterForm.controls['state'].valueChanges.subscribe((value: Locations) => {
      if (value) {
        this.sessionService.getLocationByRegion(value.id.toString()).subscribe({
          next: res => {
            this.locationLists = res;
          },
          error: err => {
            console.log(err?.error?.message);
          }
        });
      }
      else {
        this.locationLists = [];
      }
    });
  }

  ngOnInit(): void {
    this.loadContributorCollegeList();
    this.getCollegeDropdownValues();
    this.getLocationInstiteValues();
    this.getcontributionforCollegeList();
  }

  loadContributorCollegeList() {
    this.contributorClgObj = {
      page: this.page,
      perpage: this.pageSize
    }
    this.getContributorCollegeList(this.contributorClgObj);
  }

  getContributorCollegeList(value: any) {
    this.contributionsService.getContributorCollegeList(value).subscribe({
      next: response => {
        this.contributionsCollegeList = response.data;
        this.contributorClgCount = response.count;
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  getCollegeDropdownValues() {
    this.contributionsService.getLocationList().subscribe(data => {
      this.locationList = data;
    });
    this.contributionsService.getCollegeDropdownValues({}).subscribe((response: any) => {
      this.filterContributorsNameList = response.college_names;
      this.filterContributorsPincodeList = response.pincode;
      this.filterTotalStudentList = response.total_students
    });
  }

  getLocationInstiteValues() {
    this.sessionService.getRegion().subscribe(res => {
      this.regionList = res;
    });
    this.contributionsService.getInstitutetypes().subscribe({
      next: res => {
        this.educationTypeList = res.data;
      }
    });
  }

  getcontributionforCollegeList() {
    this.contributionsService.getCollegesforContribution().subscribe({
      next: res => {
        this.contributionforCollegeList = res;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = this.form.value;
    if (this.collegeId) {
      this.contributionsService.updateCollegeContributor({ ...formData, id: this.collegeId, isadmin: 1 }).subscribe(response => {
        this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.resetForm();
        this.resetFilter()
        this.getCollegeDropdownValues();
        this.activeIndex = -1;
        this.collegeId = 0;
      });
    }
    else {
      this.contributionsService.addCollegeContributor({ ...formData, isadmin: 1 }).subscribe({
        next: res => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.resetForm();
          this.resetFilter()
          this.getCollegeDropdownValues();
        },
        error: err => {
          console.log(err?.message);
        }
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.formElm?.nativeElement?.reset();
    this.submitted = false;
  }

  editCollege(data?: any) {
    this.collegeId = data?.id;
    this.form.patchValue({
      name: data?.name,
      address: data?.address,
      location: data?.location_id,
      pincode: data?.pincode,
      contribution_status: data?.contribution_status,
      total_student: data?.total_student,
      type: data?.type,
      college_type: data?.college_type,
      marketing_management_id: data?.marketing_management_id
    });
    this.activeIndex = 0;
  }

  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.name && !formData.state && !formData.location && !formData.pincode && !formData.contribution_status
      && !formData.total_student && !formData.type && !formData.status && !formData.profile_completion) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    var data = {
      page: 1,
      isAdmin: true,
      perpage: this.pageSize,
      ...formData,
      state: formData.state?.state
    };
    this.contributorClgObj = data;
    this.getContributorCollegeList(this.contributorClgObj);
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 10;
    this.contributorClgObj = {
      page: 1,
      perpage: this.pageSize
    }
    this.getContributorCollegeList(this.contributorClgObj);
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.first = event.first ?? 0;
    this.getContributorCollegeList({ ...this.contributorClgObj, page: this.page, perpage: this.pageSize });
  }

  exportContributorsColleges() {
    this.contributionsService.exportContributorsColleges(this.filterForm.value).subscribe((res: any) => {
      this.contributionsService.downloadFile(res.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "constributor-college.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    })
  }

  importContributior() {
    this.selectedFile = null;
    this.isCollegeImport = true;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.contributionsService.importContributorsColleges(this.selectedFile).subscribe({
        next: response => {
          this.toaster.add({ severity: "success", summary: "Success", detail: response.message });
          this.selectedFile = null;
          this.closeModal();
          this.resetFilter()
          this.getCollegeDropdownValues();
        },
        error: error => {
          this.toaster.add({ severity: "error", summary: "Error", detail: error.message });
        }
      });
    } else {
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please choose file!" });
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  closeModal() {
    this.isCollegeImport = false;
  }

}
