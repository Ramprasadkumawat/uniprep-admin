import { Component, OnInit, HostListener , ElementRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule,FormControl,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {MultiSelectModule} from 'primeng/multiselect';
import { RevieworganizationService } from './revieworganization.service';
import {TableModule} from 'primeng/table';
import {MessageService} from "primeng/api";
// import { count } from 'console';
import { ViewChild } from "@angular/core";
import {SelectModule} from 'primeng/select';

interface Country {
  id: number,
  country: string,
  altname: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};

@Component({
    selector: 'uni-revieworganization',
    imports: [CommonModule, AccordionModule, MultiSelectModule, TableModule, ReactiveFormsModule, FormsModule, SelectModule],
    templateUrl: './revieworganization.component.html',
    styleUrls: ['./revieworganization.component.scss']
})
@HostListener('window:scroll')

export class RevieworganizationComponent implements OnInit {

  @ViewChild("takeInput", {static: false})
  InputVar: ElementRef;

  countries: Country[];
  selectedCountries: any;
  selectedModules: any[];
  rusers: any;
  groupedCities: any;
  modules: any;
  reviewOrg: any;
  imageData: string;
  file:any;
  addBtn: boolean = true;
  editBtn: boolean = false;
  orgId: number;
  submitted: boolean = false;
  selectedM: any;
  logoupload: any;
  headName: string = "Add Review Organization";


  constructor(private service: RevieworganizationService,private formbuilder: FormBuilder ,private toastr: MessageService) { 
    this.service.GetCountryList().subscribe((response) => {
      this.countries = response;
    });


   }

  ngOnInit(): void {
    this.reviewOrg = this.formbuilder.group({
      oname:['',Validators.required],
      logo:['',Validators.required],
      country:['',Validators.required],
      website:['',Validators.required],
      module:['', Validators.required],
    })

    this.getOrgList();

  }

  countrySelect(){
    // alert(this.selectedCountries);
    let data ={
      country_id : this.selectedCountries
    }

    this.service.GetModules(data).subscribe((response) => {
      this.modules = response;
    });

  }

  getOrgList(){
    let udata = {
      perpage : 100,
      page : 1
    }
    this.service.GetOrgList(udata).subscribe((response) => {
      this.rusers = response.users;
    });  
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
     this.reviewOrg.patchValue({ logo: file });
  }

  addOrg(){

    this.submitted = true;

    let orgdata = {
      organizationName: this.reviewOrg.value.oname,
      logo: this.reviewOrg.value.logo,
      country:this.reviewOrg.value.country,
      moduleSelected: this.reviewOrg.value.module,
      website: this.reviewOrg.value.website
    }
    this.service.AddOrg(orgdata).subscribe((response) => {
    this.toastr.add({severity: 'success', summary: 'Success', detail: "Organization Added"});
    this.getOrgList();
    this.reviewOrg.reset();
    this.logoupload = null;
    this.submitted = false;
    this.InputVar.nativeElement.value = "";
    }); 

  }

  deleteOrg(id){

    const result = confirm('Are you sure you want to delete this?');
    if (result) {
      let orgdata = {
        orgId : id
      }
      this.service.DeleteOrg(orgdata).subscribe((response) => {
        this.toastr.add({severity: 'success', summary: 'Success', detail: "Organization Removed"});
        this.getOrgList();
        this.reviewOrg.reset();
        this.logoupload = null;
        this.submitted = false;
        this.InputVar.nativeElement.value = "";
      }); 
    } else {
      // Do not delete the item
    }

  }

  editOrg(id,name,website,country,moduleSelected){
    this.headName = 'Edit Review Organization';
    this.service.GetModules(country).subscribe((response) => {
      this.modules = response;
    });
    this.reviewOrg.patchValue({
      oname: name,
      website: website,    
      // country: ,
    });
     this.selectedCountries = Number(country);
    this.selectedM = moduleSelected.split(",");

    this.orgId = id;

    this.addBtn = false;
    this.editBtn = true;
  }

  selectData(event: any) {
  }

  updateOrg(){
    // alert("update");
    let orgdata = {
      organizationName: this.reviewOrg.value.oname,
      logo: this.reviewOrg.value.logo,
      country:this.reviewOrg.value.country,
      moduleSelected: this.reviewOrg.value.module,
      website: this.reviewOrg.value.website,
      orgId:this.orgId
    }
    this.service.UpdateOrg(orgdata).subscribe((response) => {
      this.toastr.add({severity: 'success', summary: 'Success', detail: "Organization Updated"});
      this.getOrgList();
      this.reviewOrg.reset();
      this.logoupload = null;
      this.submitted = false;
      this.InputVar.nativeElement.value = "";
      this.headName = 'Add Review Organization';
    }); 
  }

}
