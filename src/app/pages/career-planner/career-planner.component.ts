import { Component, OnInit, ViewChild  } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { CareerPlannerService } from './career-planner.service';
import { ConfirmationService, MessageService } from "primeng/api";
import { Router } from '@angular/router';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
    selector: 'uni-career-planner',
    templateUrl: './career-planner.component.html',
    styleUrls: ['./career-planner.component.scss'],
    providers: [ConfirmationService],
    standalone: false
})
export class CareerPlannerComponent implements OnInit {
  @ViewChild('scrollTopButton') scrollTopButton: ScrollTop;
  form: FormGroup;
  filterForm: FormGroup;
  activeIndex:number = -1;
  title:string = "Add Career Option";
  btntxt:string = 'Add Option';
  country:any = [];
  subject: any = [];
  specializationOrg: any = [];
  specialization: any = [];
  jobOptionOrg:any[];
  jobOption:any[];
  submitted:boolean = false;
  pageSize:number = 100;
  page: number = 1;
  careerListData: any = [];
  totalCareerCount: number = 0;
  storage_path:string = "";
  fileUploadModal:boolean = false;
  importFile:any;
  
  constructor( private fb: FormBuilder, private careerPlanService:CareerPlannerService, private toastr: MessageService, private router: Router
  ) { 
    this.form = fb.group({
      subject: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      specialization: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      job_option: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      country: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      average_salary: ['', [Validators.required]],
      inr_average_salary: ['', [Validators.required]],
      id:new FormControl()
    });

    this.filterForm = fb.group({
      subject: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      job_option: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listOfCareerPlanner();
    this.selectBoxValueLoading();
  }

  listOfCareerPlanner(){

    let data = {
      subject: this.filterForm.value.subject ? this.filterForm.value.subject : '',
      specialization: this.filterForm.value.specialization ? this.filterForm.value.specialization : '',
      job_option: this.filterForm.value.job_option ? this.filterForm.value.job_option : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      page: this.page,
      perpage: this.pageSize,
    }

    this.careerPlanService.listPage(data).subscribe((res) =>{
      this.careerListData = res.data;
      this.totalCareerCount = res.count;
      this.storage_path = res.storage_path;
    });
  }

  selectBoxValueLoading(){
    this.careerPlanService.getCountriesAndJobOption().subscribe((res) =>{
      this.country = res.country;
      this.jobOptionOrg = res.job_option;

    })

    this.careerPlanService.getSubAndSpecialization().subscribe((res) =>{
      this.specializationOrg = res.specilisation;
      this.subject = res.subject;
    });
  }

  subjectChange(event?:any, subject_id?:any){
    const subjectId = subject_id? subject_id : event.value;
    this.specialization = this.specializationOrg.filter(item => item.subject_id === subjectId);
    this.jobOption = this.jobOptionOrg.filter(item => item.subject_id === subjectId);
  }

  onSubjectSelect(event: any) {
    this.subjectChange(event); 
    this.form.get('specialization').setValue(""); 
    this.form.get('job_option').setValue(""); 
  }
  
  onSpecializationSelect(event: any){
    if(/^\d+$/.test(this.form.value.subject) != true ){
      this.form.get('specialization').setValue(""); 
      this.toastr.add({severity: "error" , summary: "error", detail: "Please Confirm the Subject First!"})
      return;
    }
  }

  onEnterKeyPress(fieldName:string){
    var data = {};
    if(fieldName === "subject"){
      if(!this.form.value.subject){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      //if you select the option the option value is an number.so that number is not exist as a subject name so its created as new value so i restrict the value contains only number
      if (/^\d+$/.test(this.form.value.subject) != true && this.form.value.subject) {
        data = {
          new_value: this.form.value.subject,
          field_name: fieldName
        };
        this.careerPlanService.addNewSelectBoxValue(data).subscribe((res) =>{
          if(res.status == "success"){
            this.subject = res.subject;
            setTimeout(() => {
              this.form.patchValue({
                subject: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        });
      }
    }else if(fieldName === "specialization"){
      if(/^\d+$/.test(this.form.value.subject)  != true ){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Select Subject First" });
        return;
      }
      if(!this.form.value.specialization){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.specialization)  != true){ 
        data = {
          subject_id:this.form.value.subject,
          new_value: this.form.value.specialization,
          field_name: fieldName
        };
        this.careerPlanService.addNewSelectBoxValue(data).subscribe((res) =>{
          if(res.status == "success"){
            this.specializationOrg = res.specialization
            this.subjectChange(null ,this.form.value.subject);
            
            setTimeout(() => {
              this.form.patchValue({
                specialization: res.id
              });
            }, 200);

            this.form.get('specialization').setValue("");
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName === "job_option"){
      if(/^\d+$/.test(this.form.value.subject)  != true ){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Select Subject First" });
        return;
      }
      if(!this.form.value.job_option){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.job_option)  != true){ 
        data = {
          subject_id:this.form.value.subject,
          new_value: this.form.value.job_option,
          field_name: fieldName
        };
        this.careerPlanService.addNewSelectBoxValue(data).subscribe((res) =>{
          if(res.status == "success"){
            this.jobOptionOrg = res.job_option;
            this.subjectChange(null ,this.form.value.subject);
            setTimeout(() => {
              this.form.patchValue({
                job_option: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }
  }

  reset(){
    this.submitted = false;

    if(this.btntxt == "Add Option" || "Update Option"){
      this.form.reset();
      this.btntxt = "Add Option";
    }else{
      this.filterForm.reset();
      this.btntxt = "Add Option";
      this.title = "Add Career Option";
    }
    
    
    this.specialization = [];
    this.jobOption = [];
  }

  get f() {
    return this.form.controls;
  }

  formEnter(event: any){
    event.preventDefault();
  }

  // submitForm(){
  //   let data: any = this.form.value;
  //      if(this.btntxt == "Add Option"){
  //     if(this.form.invalid){
  //       this.submitted=true;
  //       return;
  //     }
  //     this.careerPlanService.store(data).subscribe((res) =>{
  //       this.toastr.add({severity: res.status, summary: res.status, detail: res.message})
  //     });
  //   }else {
  //     console.log(">>>COMMESINN<<<<");
      
  //     if(this.filterForm.invalid){
  //       this.submitted=true;
  //       return;
  //     }
  //     console.log("line241",data);
      
  //     this.careerPlanService.update(data).subscribe((res) =>{
  //       this.toastr.add({severity: res.status, summary: res.status, detail: res.message})
  //     });
  //   }
  //   this.activeIndex = -1;
  //   this.listOfCareerPlanner();
  //   this.form.reset();
  //   this.specialization = [];
  //   this.jobOption = [];
  //   this.submitted = false;
  //   this.btntxt = "Add Option";
  //   this.title = " Add Career Option";
  // }
  submitForm(){
    let data: any = this.form.value;
       if(this.btntxt == "Add Option"){
      if(this.form.invalid){
        this.submitted=true;
        return;
      }
      this.careerPlanService.store(data).subscribe((res) =>{
        this.toastr.add({severity: res.status, summary: res.status, detail: res.message})
      });
    }else if(this.btntxt == "Update Option"){          
      if(this.form.invalid){
        this.submitted=true;
        return;
      }      
      this.careerPlanService.update(data).subscribe((res) =>{
        this.toastr.add({severity: res.status, summary: res.status, detail: res.message})
      });
    }
    else{
      return
    }
    this.activeIndex = -1;
    this.listOfCareerPlanner();
    this.form.reset();
    this.specialization = [];
    this.jobOption = [];
    this.submitted = false;
    this.btntxt = "Add Option";
    this.title = " Add Career Option";
  }

  submitFilterForm(){
    const formData = this.filterForm.value;
    if (!formData.subject  && !formData.specialization  && !formData.job_option && !formData.country) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }

    let data = {
      subject: this.filterForm.value.subject ? this.filterForm.value.subject : '',
      specialization: this.filterForm.value.specialization ? this.filterForm.value.specialization : '',
      job_option: this.filterForm.value.job_option ? this.filterForm.value.job_option : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      page: this.page,
      perpage: this.pageSize,
    }
    
    this.careerPlanService.listPage(data).subscribe((res) =>{
      this.careerListData = res.data;
      this.totalCareerCount = res.count;
      this.storage_path = res.storage_path;
    });
  }

  filterReset(){
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 100;
    this.activeIndex = -1;
    this.listOfCareerPlanner();
  }

  pageChange(event: any){

    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.listOfCareerPlanner();
  }

  editCareer(careerData: any){
    this.scrollToTop();
    const subjectId = careerData.subject_id;
    this.specialization = this.specializationOrg.filter(item => item.subject_id === subjectId);
    this.jobOption = this.jobOptionOrg.filter(item => item.subject_id === subjectId);
    this.form.patchValue({
      id: careerData.id,
      subject: careerData.subject_id,
      country: careerData.country_id,
      average_salary: careerData.salary,
      inr_average_salary: careerData.inr_salary
    });

    setTimeout(() => {
      this.form.patchValue({
        specialization: careerData.specialisation_id,
        job_option: careerData.job_option_id,
      });
    }, 500);
    
    this.activeIndex = 0;
    this.title = "Edit Career Option";
    this.btntxt = "Update Option";
  }

  scrollToTop(){
    this.scrollTopButton.onClick();
  }
  
  exportTable(){
    let data = {
      subject: this.filterForm.value.subject ? this.filterForm.value.subject : '',
      specialization: this.filterForm.value.specialization ? this.filterForm.value.specialization : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      job_option: this.filterForm.value.job_option ? this.filterForm.value.job_option : '',
      page: this.page,
      perpage: this.pageSize,
    }

    this.careerPlanService.export(data).subscribe((res) =>{
      if(res.link){
        window.open(res.link, '_blank');
      }
    })

  }

  onFileChange(event:any){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.importFile = inputElement.files[0];
    } else {
      this.importFile = null;
    }
  }

  uploadFile(){
    if (this.importFile) {
      this.careerPlanService.import(this.importFile).subscribe((response) => {
          if(response.link){
            window.open(response.link, '_blank');
          }
          this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
          this.fileUploadModal = false;
          this.importFile = null;
          this.listOfCareerPlanner();
      });
    } else {
      this.toastr.add({severity: "error",summary: "Error",detail: "Please choose file!",});
    }
  }

  jobsiteRedirect(){
    this.router.navigate(['job-site']);
  }
}
