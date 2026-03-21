import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import {SelectModule} from "primeng/select";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PageFacadeService } from '../../page-facade.service';
import { UserFacadeService } from '../user-facade.service';

@Component({
    selector: 'uni-institution',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule,
        ConfirmPopupModule],
    templateUrl: './institution.component.html',
    styleUrls: ['./institution.component.scss'],
    providers: [ConfirmationService]
})

export class InstitutionComponent implements OnInit {

  form: FormGroup;
  filterForm: FormGroup;
  // Editform: FormGroup;
  submitted = false;
  pageSize = 10;
  // EditFormshow = false;
  AddAndEditButton:boolean = false;
  Adduserform = true;
  page: number = 1;
  institutionObj: object = {};
  //institutionsCount: number = 0;
  //institutions: any[] = [{},{},{}];
  userTypes: any[] = [];
  region: any = [];
  educationinstitute:any = [];
  sourceName: any = [];
  locations: any = [];
  homecountries = [];
  companys: any = [];
  editsubmitted: boolean = false;
  activeIndex: number = -1;
  userId!: number;
  first: number = 0;
  institutionList:any = [];
  institutionCount: number = 0;
  EditInsId:number;
  institutelist = [];
  show: boolean = false;
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('editFormElm') editFormElm!: ElementRef;
  constructor(
    private userFacade: UserFacadeService,
    private fb: FormBuilder,
    private toaster: MessageService,
    private pageService: PageFacadeService,
    private confirmationService: ConfirmationService
  ) {
    this.form = fb.group({
      home_country: [null, [Validators.required]],
      region: [null, Validators.required],
      location: [null, [Validators.required]],
      Institutetype: [null, [Validators.required]],
      educationinstitute: [null, [Validators.required]],
      source_type: [null,[Validators.required]],
      source_name: [null,[Validators.required]]
    });

    this.filterForm = fb.group({
      home_country: [null],
      region: [null], 
      location: [null],
      educationinstitute: [null],
      source_type: [null], 
      source_name: [null]
    });
  }

  ngOnInit(): void {
   // this.loadInstitutionList();
    this.getUserTypeList();
    //.getRegion();
    this.GetAssignedInstituteList();
    this.gethomeCountryList();
    this.getinstitute();
  }

  gethomeCountryList() {
    this.pageService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homecountries = [{ country: "Select", code: null }, ...res];
      },
    );
  }
  getinstitute() {
    this.institutelist = []
    this.pageService.getinstitute().subscribe((res) => {
      this.institutelist = res.data
    })
  }
  get f() {
    return this.form.controls;
  }
  // get e() {
  //   return this.Editform.controls;
  // }
  // loadInstitutionList() {
  //   this.institutionObj = {
  //     page: this.page,
  //     perpage: this.pageSize
  //   }
  //   this.getInstitutionList(this.institutionObj);
  // }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var data: any = {};
    data['region'] = this.form.value.region;
    data['location'] = this.form.value.location;
    data['educationinstitute'] = this.form.value.educationinstitute;
    data['source_type'] = this.form.value.source_type;
    data['source_name'] = this.form.value.source_name;
    if(this.AddAndEditButton){
      data['institute_id'] = this.EditInsId;
      this.userFacade.UpdateAssignInstitute(data).subscribe(response => {
        if(response.status){
          this.toaster.add({ severity: 'success', summary: 'success', detail: response.message });
          this.GetAssignedInstituteList();
          this.submitted = false;
          this.form.reset();
          this.AddAndEditButton = false; 
        }else{
          this.toaster.add({ severity: 'error', summary: 'error', detail: response.message });
        }
      });
    }else{
      this.userFacade.SubmitAssignInstitute(data).subscribe(response => {
        if(response.status){
          this.toaster.add({ severity: 'success', summary: 'success', detail: response.message });
          this.GetAssignedInstituteList();
          this.submitted = false;
          this.form.reset();
        }else{
          this.toaster.add({ severity: 'error', summary: 'error', detail: response.message });
        }
      });
    }
    
  }

  getEducationalInstitution(value: any) {
    this.userFacade.getInstitutionList(value).subscribe(response => {
      this.educationinstitute = [{ id: null, institutename: "Select" }, ...response];
    });
  }

  getInstitutionList(value: any) {
    
  }
  getRegion() {
    this.pageService.getRegion().subscribe(response => {
      this.region = [{ id: null, state: "Select" }, ...response];
    });
  }
  getLocationList(value: string) {
    this.userFacade.getLocationByRegion(value).subscribe(response => {
      this.locations = [{ id: null, district: "Select" }, ...response];
    });
  }
  getUserTypeList() {
    this.pageService.getUserTypes().subscribe(response => {
      this.userTypes = [{ id: null, type: "Select" }, ...response.data];
    });
  }
  pageChange(event: any) {
    this.page = (event.first / this.pageSize + 1);
    this.first = event.first ?? 0;
    this.GetAssignedInstituteList({ ...this.institutionObj, page: this.page });
  }
  filter() {
    const formData = this.filterForm.value;
    if (!formData.region && !formData.location && !formData.source_type && !formData.source_name ) {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }else{
      this.GetAssignedInstituteList(formData); 
    }
  }
  resetFilter() {
    this.GetAssignedInstituteList(); 
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
  }

  getSourceName(usertype: string,id?:any) {
    this.userFacade.SourceByUserType(usertype,id).subscribe(response => {
      this.sourceName = [{ user_id: null, name: "Select" }, ...response];
    });
  }
  changeSourceType(event: any) {
    const value = event.value;
    if (value !== null) {
      this.getSourceName(value.toString(),"filter")
    }
  }
  checkUserType(event: any) {
    // const value = event.value;
    // if (value !== 15 && value !== 2 && value !== null) {
    //   this.show = true;
      this.getSourceName(event.value.toString())
    // } else {
    //   this.show = false;
    // }
  }
  changeRegion(event: any) {
    const value = event.value.toString();
    this.form.get('Institutetype').setValue(0);
    this.getLocationList(value)
  }

  changeDistrict(region_id?:any, location_id?:any, id?:number, institutetype?:any) {
    if(region_id == "filter"){
      let formtype = region_id; //using for the filter form
      var data = {
        formtype : formtype,
        region_id : this.filterForm.get('region').value,
        district_id : this.filterForm.get('location').value,
        institute_type: null,
        id : id
      } 
    }else if(region_id !== undefined || location_id !== undefined || institutetype != undefined){
      var data = {
        formtype : region_id,
        region_id : region_id,
        district_id : location_id,
        institute_type: institutetype,
        id : id
      } 
    }else{
      var data = {
        formtype : region_id,
        region_id : this.form.get('region').value,
        district_id : this.form.get('location').value,
        institute_type: this.form.get('Institutetype').value,
        id : id
      } 
    }
    this.getEducationalInstitution(data)
  }

  changeLocation() {
    this.form.get('Institutetype').setValue(0);
  }

  GetAssignedInstituteList(data?:any){
    this.institutionObj = {
      page: this.page,
      perpage: this.pageSize
    }
    let merged = Object.assign(this.institutionObj, data);
    this.userFacade.GetAssInstituteList(merged).subscribe(response => {
      this.institutionList = response.data;
      this.institutionCount = response.total_count;
    });
  }

  EditAssignIns(id:any,region_id:any,location_id:number,institution_id:number,source_type_id:any,source_name_id:number,homecountry:number,institutetype:number){
    this.getLocationList(region_id);
    this.changeDistrict(region_id, location_id,id,institutetype);
    this.getSourceName(source_type_id,id);
    this.form.patchValue({
      region: region_id,   
      source_type:source_type_id,
    });
    setTimeout(() => {
      this.form.patchValue({
        location: location_id,
        educationinstitute: institution_id,
        source_name:source_name_id,
        home_country: homecountry,
        Institutetype: institutetype
      });
    }, 2500);
    this.EditInsId = id;
    this.AddAndEditButton = true;
  }

  DeleteAssignIns(id:any){
    let DeleteId = {
      DeleteId : id
    };
    this.userFacade.DeleteAssignedInstitution(DeleteId).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'success', detail: 'Assigned Institution Deleted Successfully' });
      this.GetAssignedInstituteList();
    });
  }

  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.region) {
      data.region = formData.region;
    }
    if (formData.location) {
      data.location = formData.location;
    }
    if (formData.educationinstitute) {
      data.educationinstitute = formData.educationinstitute;
    }
    if (formData.source_type) {
      data.source_type = formData.source_type;
    }
    if (formData.source_name) {
      data.source_name = formData.source_name;
    }

    this.userFacade.AssignInstitutionExport(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  changeCountry(event: any) {
    this.region = []
    this.locations = []
    if (event.value == 122) {
     
      this.pageService.getRegion().subscribe((res) => {
        const selectOption = { id: 'null', state: "Select" };
        this.region = [selectOption, ...res];
      });
    }
    else {
      this.region = [{ id: 0, state: "Others" }];
      this.locations = [{ id: 0, district: "Others" }] 
      this.form.get('Institutetype').setValue(0);
    }
  }
}

