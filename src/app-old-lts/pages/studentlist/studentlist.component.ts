import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {forkJoin, mergeMap, Observable, of} from "rxjs";
import {CreateUserParams, User, UserType} from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { StudentlistService } from './studentlist.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {login} from "../../Auth/store/actions";
import {MessageService} from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
    selector: 'uni-studentlist',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, MultiSelectModule],
    templateUrl: './studentlist.component.html',
    styleUrls: ['./studentlist.component.scss']
})
export class StudentlistComponent implements OnInit {
  filterForm: FormGroup;
  submitted = false;
  passingyear=[
    { id:'2020',name:'2020'},
    { id:'2021',name:'2021'},
    { id:'2022',name:'2022'},
    { id:'2023',name:'2023'}
  ];
  programlevel:any = [];
  region:any = [];
  locations:any = [];
  countries:any = [];
  constructor(private studentListService: StudentlistService,
    private fb: FormBuilder,
    private toaster: MessageService,
    private cdr: ChangeDetectorRef ) {
    this.filterForm = fb.group({
        name: [''],
        email:[''],
        phone:[''],
        passingyear:[''],
        programlevel:[''],
        region:[''],
        location:[''],
        country:['']
    });
   }
  students:any=[];
  pageSize = 10;
  datacount:any;

  ngOnInit(): void {
    this.getStudentsList();
    this.getProgramLeveList();
    this.getRegionList();
    this.getCountriesList();
  }

  getStudentsList() {
    var data = {
    };
    this.studentListService.getStudentsList(data).subscribe((response)=>{
      response.data.forEach((element:any)=>{
        var bindingdata = {
          name:element.name,
          email:element.email,
          mobile:element.phone,
          id:element.id,
          interestedcountry: element.interested_countries_name,
          region: element.state,
          location: element.district,
          passingyear: element.last_degree_passing_year,
          programlevel: element.programlevel,
          expanded: false,
        };
      this.students.push(bindingdata);
      });

    });
  }

  getProgramLeveList() {
    this.studentListService.getProgramLevelList().subscribe((response)=>{
      response.forEach((element:any)=>{
        var bindingdata = {
          id:element.id,
          name:element.programlevel
        };
      this.programlevel.push(bindingdata);
    });
  });
  }

  getCountriesList() {
    this.studentListService.getCountriesList().subscribe((response)=>{
      response.forEach((element:any)=>{
        var bindingdata = {
          id:element.id,
          name:element.country
        };
      this.countries.push(bindingdata);
    });
  });
  }

  getRegionList() {
  this.studentListService.getRegionList().subscribe((response)=>{
    response.forEach((element:any)=>{
      var bindingdata = {
        id:element.id,
        name:element.state
      };
    this.region.push(bindingdata);
  });
});
  }

  selectRegion() {
    this.locations = [];
    var data = {
      regionId: (this.filterForm.value.region.toString())
    }
    this.studentListService.getLocationList(data).subscribe((response)=>{
      var length = (response.length);
      for(var i=0;i<length;i++){
        response[i].forEach((element:any)=>{   
          var bindingdata = {
            id:element.id,
            name:element.district
          };
        this.locations.push(bindingdata);
      });
      }
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  filter() {
    this.students = [];
    var data = {
      name: this.filterForm.value.name,
      email: this.filterForm.value.email,
      phone: this.filterForm.value.phone,
      passingyear: this.filterForm.value.passingyear.toString(),
      programlevel :this.filterForm.value.programlevel.toString(),
      region :this.filterForm.value.region.toString(),
      location :this.filterForm.value.location.toString(),
      country: this.filterForm.value.country
    };
    this.studentListService.getStudentsList(data).subscribe((response)=>{
      response.data.forEach((element:any)=>{
        var bindingdata = {
          name:element.name,
          email:element.email,
          mobile:element.phone,
          id:element.id,
          interestedcountry: element.interested_countries_name,
          region: element.state,
          location: element.district,
          passingyear: element.last_degree_passing_year,
          programlevel: element.programlevel,
          expanded: false,
        };
      this.students.push(bindingdata);
      });

    });
  }

  pageChange(event: any) {
  }
}
