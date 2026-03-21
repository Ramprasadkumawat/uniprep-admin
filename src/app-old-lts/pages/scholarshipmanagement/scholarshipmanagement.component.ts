import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserFacadeService } from '../users/user-facade.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PageFacadeService } from '../page-facade.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { User, UserType, Users } from 'src/app/@Models/user.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {SelectModule} from 'primeng/select';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputNumberModule } from 'primeng/inputnumber';
import { SubscriberService } from '../subscribers/subscriber.service';
import { ScholarshipmanagementService } from './scholarshipmanagement.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { environment } from '@env/environment';
@Component({
    selector: 'uni-scholarshipmanagement',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule,
        ConfirmPopupModule, InputNumberModule, MultiSelectModule, DialogModule, FormsModule],
    templateUrl: './scholarshipmanagement.component.html',
    styleUrls: ['./scholarshipmanagement.component.scss'],
    providers: [ConfirmationService]
})
export class ScholarshipmanagementComponent implements OnInit {


  form: FormGroup;
  filterForm: FormGroup;
  Editform: FormGroup;
  submitted = false;
  pageSize = 100;
  EditFormshow = false;
  AddScholarshipform = true;
  countries = [];
  homecountries = [];
  totalScholarShipCount: number = 0;
  page: number = 1;
  scholarshipObj: object = {};
  scholarshipCount: number = 0;
  regionList: any = [];
  scholarshipList: any[] = [];
  studyLevelList: any[] = [];
  universityList: any[] = [];
  coverList: any[] = [];
  editsubmitted: boolean = false;
  activeIndex: number = -1;
  first: number = 0;
  scholarShip: any = [];
  filterUniversityList: any[] = [];
  filterRegionList: any[] = [];
  scholarshipTypeList: any[] = [];
  fileUploadModal: boolean = false;
  selectAllCheckboxes:boolean = false;
  selectedCheckboxIds:any[];

  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('editFormElm') editFormElm!: ElementRef;
  @ViewChild('instituteFormElm') instituteFormElm!: ElementRef;
  selectedFile: any;
  sampleDownloadPath: string;
  searchScholarshpName: string = '';
  instituteForm: FormGroup;
  instituteSubmitted: boolean = false;
  restrictionList:any[]=[{id:null,label:"Select"},{id:1,label:"Yes"},{id:2,label:"No"}]
  constructor(
    private fb: FormBuilder,
    private toaster: MessageService,
    private pageService: PageFacadeService,
    private subscriberService: SubscriberService,
    private scholarshipService: ScholarshipmanagementService,
    private confirmationService: ConfirmationService,
  ) {
    this.form = fb.group({
      name: ['', Validators.required],
      country: [null, Validators.required],
      home_country: [null, Validators.required],
      study_level: [null, Validators.required],
      university: [null, Validators.required],
      region: [null],
      value: [''],
      website: ['', [Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      type: [null, [Validators.required]],
      cover_id: [null, [Validators.required]]
    });

    this.Editform = fb.group({
      name: ['', Validators.required],
      country: [null, Validators.required],
      home_country: [null, Validators.required],
      study_level: [null, Validators.required],
      university: [null, Validators.required],
      region: [null],
      value: [''],
      website: ['', [Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      type: [null, [Validators.required]],
      cover_id: [null, [Validators.required]]
    });

    this.filterForm = fb.group({
      home_country: [null], country: [null], study_level: [null],
      university: [null], region: [null], type: [null], cover_id: [null],restrict_flag:[null]
    });
    this.instituteForm = fb.group({
      institute_name: ['', Validators.required],
      country: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCountryList();
    this.gethomeCountryList();
    this.loadScholarShipData();
    this.getStudyLevel();
    this.getFilterUniversityList("");
    this.getScholarshipType();
    this.getFilterRegion();
    this.getCovers();
    let ip = environment.domain;
    if (ip == '40.80.95.32') {
      this.sampleDownloadPath = 'https://api.uniprep.ai/uniprepapi/storage/app/public/SampleUploadDocuments/ScholarshipSampleDocument.zip';
    }
    else {
      this.sampleDownloadPath = 'https://uniprep.ai/uniprepapi/storage/app/public/SampleUploadDocuments/ScholarshipSampleDocument.zip '
    }
    this.selectAllCheckboxes = false;
  }

  get f() {
    return this.form.controls;
  }
  get e() {
    return this.Editform.controls;
  }
  get i() {
    return this.instituteForm.controls;
  }


  loadScholarShipData() {
    let data = {
      page: this.page,
      perpage: this.pageSize,
    }
    this.getScholarShipData(data);
  }

  getScholarShipData(data: any) {
    this.scholarshipService.getScholarshipList(data).subscribe((response) => {
      this.scholarshipList = response.scholarship;
      this.totalScholarShipCount = response.count;
    });
  }

  edit(value: any) {

    this.editsubmitted = false;
    this.EditFormshow = true;
    this.AddScholarshipform = false;
    this.activeIndex = 0;
    this.regionList = [];
    this.universityList = [];
    this.scholarshipService.editScholarshipList(value).subscribe(response => {
      this.scholarShip = response[0];

      if (this.scholarShip.country == 105) {
        this.getRegion();
      }
      this.getUniversityList('');

      let studyLevel = this.scholarShip.study_level;
      if (studyLevel.includes(',')) {
        var studyLevelArray = studyLevel.split(',').map(Number);
      } else {
        var studyLevelArray: any = [Number(studyLevel)]
      }

      this.Editform.patchValue({
        name: this.scholarShip.name,
        country: this.scholarShip.country,
        home_country: this.scholarShip.home_country,
        study_level: studyLevelArray,
        university: this.scholarShip.university,
        region: this.scholarShip.region,
        value: this.scholarShip.value,
        website: this.scholarShip.website,
        type: this.scholarShip.type,
        cover_id: this.scholarShip.cover_id
      });
    });


  }
  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let joinedStudyValue = this.form.value.study_level
    this.form.value.study_level = joinedStudyValue.join(',');

    this.scholarshipService.addScholarship(this.form.value).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.loadScholarShipData();
    },
      error => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        this.loadScholarShipData();
      });


  }
  submitEditForm() {
    this.editsubmitted = true;
    if (this.Editform.invalid) {
      return;
    }
    let joinedStudyValue = this.Editform.value.study_level
    this.Editform.value.study_level = joinedStudyValue.join(',');
    this.scholarshipService.UpdateScholarshipList(this.Editform.value, this.scholarShip.id).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.EditFormshow = false;
      this.AddScholarshipform = true;
      this.Editform.reset();
      this.editFormElm.nativeElement.reset();
      this.regionList = [];
      this.universityList = [];
      this.loadScholarShipData();
    },
      error => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        this.loadScholarShipData();
      });

  }

  getScholarshipType() {
    this.scholarshipService.getScholarshipType().subscribe(response => {
      this.scholarshipTypeList = [{ id: null, type: "Select" }, ...response];
    })
  }
  getCovers() {
    this.scholarshipService.getCoverList().subscribe(response => {
      this.coverList = [{ id: null, cover_name: "Select" }, ...response];
    });
  }
  getRegion() {
    this.pageService.getRegion().subscribe(response => {
      this.regionList = [{ id: null, state: "Select" }, ...response];
    });
  }
  getFilterRegion() {
    this.pageService.getRegion().subscribe(response => {
      this.filterRegionList = response;
    });
  }
  getStudyLevel() {
    this.scholarshipService.getStudyLevel().subscribe((response) => {
      this.studyLevelList = response;
    });
  }
  getCountryList() {
    this.scholarshipService.getScholarshipCountries(1).subscribe((response) => {
      this.countries = [{ id: null, country: "Select" }, ...response];
    });
  }
  countryChange(event: any) {

    if (event.value == 105) {
      this.getRegion();
    }
    else {
      this.regionList = [];
    }
    this.getUniversityList(event.value);
  }
  filterCountryChange(event: any) {
    if (event.value == 105) {
      this.getFilterRegion();
    }
    else {
      this.filterForm.value.region = null;
      this.filterRegionList = [];
    }
    this.getFilterUniversityList(event.value);
  }
  getFilterUniversityList(value: any) {
    this.scholarshipService.getUniversity(value).subscribe(response => {
      this.filterUniversityList = response;
    });
  }
  getUniversityList(value) {
    this.scholarshipService.getUniversity(value).subscribe(response => {
      this.universityList = [{ id: null, name: "Select" }, ...response];
    });
  }
  gethomeCountryList() {
    this.scholarshipService.getScholarshipCountries(2).subscribe(
      (res: any) => {
        this.homecountries = [{ id: null, country: "Select" }, ...res];
      },
      (error: any) => {
        this.toaster.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }
  pageChange(event: any) {
    this.pageSize = event.rows;
    this.page = (event.first / this.pageSize + 1);
    this.first = event.first ?? 0;
    this.getScholarShipData({ ...this.scholarshipObj, page: this.page, perpage: this.pageSize });
  }
  filter() {
    const formData = this.filterForm.value;
    if (!formData.home_country && !formData.country && !formData.study_level
      && !formData.university && !formData.region && !formData.type && !formData.cover_id &&!formData.restrict_flag) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let data: any = {
      page: 1,
      perpage: this.pageSize,
    };
    if (formData.home_country) {
      data.home_country = formData.home_country;
    }
    if (formData.country) {
      data.country = formData.country;
    }
    if (formData.type) {
      data.type = formData.type;
    }
    if (formData.study_level && formData.study_level.length > 0) {
      data.study_level = formData.study_level;
    }
    if (formData.university && formData.university.length > 0) {
      data.university = formData.university;
    }
    if (formData.region && formData.region.length > 0) {
      data.region = formData.region;
    }
    if (formData.cover_id) {
      data.cover_id = formData.cover_id;
    }
    if (formData.restrict_flag) {
      data.restrict_flag = formData.restrict_flag;
      data.admin = "true";
    }
    this.first = 0;
    this.scholarshipObj = data;
    this.getScholarShipData(this.scholarshipObj);
  }
  resetForm() {
    this.form.reset();
    this.formElm.nativeElement.reset();
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.filterUniversityList = [];
    this.filterRegionList = [];
    this.loadScholarShipData();
    this.getFilterRegion();
    this.getFilterUniversityList('');
  }

  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.home_country) {
      data.home_country = formData.home_country;
    }
    if (formData.country) {
      data.country = formData.country;
    }
    if (formData.study_level) {
      data.study_level = formData.study_level;
    }
    if (formData.university) {
      data.university = formData.university;
    }
    if (formData.region) {
      data.region = formData.region;
    }
    if (formData.type) {
      data.type = formData.type;
    }
    this.scholarshipService.scholarshipExport(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }
  uploadFile() {
    if (this.selectedFile) {
      this.scholarshipService
        .import(this.selectedFile)
        .subscribe((response) => {

          if (status == "false") {
            this.toaster.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
          }
          this.toaster.add({
            severity: "success",
            summary: "Success",
            detail: response.message + " " + "Total_Records : " + response.record_details.Total_Records + " " + "Total_Uploaded : " + 
            response.record_details.Total_Uploaded + " " + "Total_Not_Uploaded : " + response.record_details.Total_Not_Uploaded,
            sticky: true
          });
          if (response.record_details.Not_Uploaded_Link) {
            this.toaster.add({
              severity: "success",
              sticky: true,
              detail: "Please refer to the downloaded document which is not mapped and uploaded!",
            });
            window.open(response.record_details.Not_Uploaded_Link, '_blank');
          }
          this.fileUploadModal = false;
          this.selectedFile = null;
          this.loadScholarShipData();
        });
    } else {
      this.toaster.add({
        severity: "error",
        summary: "Error",
        detail: "Please choose file!",
      });
    }
  }
  performSearch() {
    const formData = this.filterForm.value;
    if (this.searchScholarshpName == "") {
      if(!formData.home_country && !formData.country && !formData.study_level
        && !formData.university && !formData.region && !formData.type && !formData.cover_id && !formData.restrict_flag){
          this.loadScholarShipData();
          return;
      }
      else{
        this.filter();
        return;
      }
    }
    var searchedScholarship: any = [];
    this.scholarshipList.filter(item => {
      if (item.name?.includes(this.searchScholarshpName)) {
        searchedScholarship.push(item);
      };
    });
    this.scholarshipList = [...searchedScholarship];
  }

  delete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete User?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.scholarshipService.deleteScholarship(id).subscribe(response => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.loadScholarShipData();
        }, error => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  submitInstituteForm() {
    this.instituteSubmitted = true;
    if (this.instituteForm.invalid) {
      return;
    }
    this.scholarshipService.addInstituteToCountry(this.instituteForm.value).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.instituteSubmitted = false;
      this.instituteForm.reset();
      this.instituteFormElm.nativeElement.reset();
    },
      error => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
  }

  selectAllCheckbox(){
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.scholarshipList.forEach(item =>{
        item.isChecked = 1;
      });
    }else{
      this.scholarshipList.forEach(item =>{
        item.isChecked = 0;
      })
    }
  }

  deleteSelected(){
    this.selectedCheckboxIds = [];
    this.scholarshipList.forEach(item=> {
      if(item.isChecked == 1){
        this.selectedCheckboxIds.push(item.id);
      }
    });
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete User?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.scholarshipService.deleteScholarship(this.selectedCheckboxIds).subscribe(response => {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.selectAllCheckboxes = false;
          this.loadScholarShipData();
        }, error => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
}