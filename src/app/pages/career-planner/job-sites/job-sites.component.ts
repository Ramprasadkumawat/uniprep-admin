import { Component, OnInit, ViewChild } from '@angular/core';
import { CareerPlannerService } from '../career-planner.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { FileUpload } from 'primeng/fileupload';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
    selector: 'uni-job-sites',
    templateUrl: './job-sites.component.html',
    styleUrls: ['./job-sites.component.scss'],
    standalone: false
})
export class JobSitesComponent implements OnInit {
  @ViewChild('fileImageUpload') fileImageUpload!: FileUpload;
  @ViewChild('scrollTopButton') scrollTopButton: ScrollTop;
  jobsiteData: any = [];
  totalJobsites: number = 0;
  storagePath: string = "";
  form: FormGroup;
  filterForm: FormGroup;
  activeIndex:number = -1;
  title:string = "Add Jobsite";
  btntxt:string = 'Add Job';
  submitted:boolean = false;
  countryData:any = [];
  selectedImage: any;
  PatchImageName:string = "";
  editClick: boolean = false;
  fileUploadModal:boolean = false;
  importFile: any;

  constructor(private fb: FormBuilder,private jobsiteservice:CareerPlannerService, private toast: MessageService, private router: Router) {
    this.form = fb.group({
      jobs_site_name: ['', [Validators.required]],
      jobs_site_logo: ['', [Validators.required]],
      jobs_site_logo_name: [''],
      jobs_site_row_id: [''],
      job_site_link: ['', [Validators.required]],
      country: ['', [Validators.required]],
      id:new FormControl()
    });

    this.filterForm = fb.group({
      job_option_name: [''],
      country: [''],
    });
   }

  ngOnInit(): void {

    this.loadJobsites();
    this.countries();
  }

  get f() {
    return this.form.controls;
  }

  countries(){
    this.jobsiteservice.countriesLoading().subscribe((res) =>{
      this.countryData = res;
    })
  }

  loadJobsites(data?: any){
    this.jobsiteservice.loadJobsites(data).subscribe((res) =>{
      this.jobsiteData = res.data;
      this.totalJobsites = res.data.length;
      this.storagePath = res.storage_path;
    });
  }

  editJobs(jobData: any){
    this.scrollToTop();
    this.editClick = true;
    this.btntxt = "Update Job";
    this.title = "Update Jobsite";
    this.activeIndex = 0;
    this.form.patchValue({
      jobs_site_name: jobData.job_site_name,
      jobs_site_logo: jobData.job_site_logo,
      job_site_link: jobData.job_site_url,
      jobs_site_logo_name: "",
      country: jobData.country_id,
      id: jobData.id,
      jobs_site_row_id: jobData.row_id
    });

    this.PatchImageName = jobData.job_site_logo;
  }

  submitForm(){
    if(this.form.invalid){
      this.submitted=true;
      return;
    }

    if(this.btntxt == "Add Job"){
      this.jobsiteservice.jobSiteStore(this.form.value).subscribe((res) =>{
        this.toast.add({severity: res.status, summary: res.status, detail: res.message});
        this.loadJobsites();
        this.reset();
      });
    }else{
      this.jobsiteservice.jobsiteUpdate(this.form.value).subscribe((res) =>{
        this.toast.add({severity: res.status, summary: res.status, detail: res.message});
        this.loadJobsites();
        this.reset();
      });
    }
    
  }

  reset(){
    this.submitted = false;
    this.form.reset();
    this.clearImage();
    this.activeIndex=0;
    this.btntxt="Add Job";
    this.title="Add Jobsite";
  }

  onFileSelected(event: any){
    this.editClick = false;
    this.form.get('jobs_site_logo_name').setValue(event.currentFiles[0].name);
    this.selectedImage = event.currentFiles[0];
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(',')[1]; // Extract base64 data
        this.form.get('jobs_site_logo').setValue(base64Data);
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  clearImage(){
    if (this.fileImageUpload) {
      this.editClick = false;
      this.fileImageUpload.clear();
      this.form.get('jobs_site_logo_name')?.setValue('');
      this.form.get('jobs_site_logo')?.setValue('');
      this.PatchImageName = "";
    }
  }

  submitFilterForm(){
    const formData = this.filterForm.value;
    if (!formData.job_option_name && !formData.country) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }

    let data = {
      job_option_name: this.filterForm.value.job_option_name ? this.filterForm.value.job_option_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
    }

    this.loadJobsites(data);
    
  }

  filterReset(){
    this.filterForm.reset();
    this.loadJobsites();
  }
  
  careerPlannerRedirect(){
    this.router.navigate(['career-planner']);
  }

  exportTable(){
    let data = {
      job_option_name: this.filterForm.value.job_option_name ? this.filterForm.value.job_option_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
    }
    
    this.jobsiteservice.jobsiteExport(data).subscribe((response) =>{
      if(response.link){
        window.open(response.link, '_blank');
      }
    });
  }

  uploadFile(){
    if(this.importFile){
      this.jobsiteservice.jobssiteImport(this.importFile).subscribe((response) => {
        this.toast.add({severity: response.status,summary: response.status,detail: response.message,});
        this.fileUploadModal = false;
        this.importFile = null;
        this.loadJobsites();
    });
    }
  }

  onFileChange(event: any){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.importFile = inputElement.files[0];
    } else {
      this.importFile = null;
    }
  }

  scrollToTop(){
    this.scrollTopButton.onClick();
  }
}
