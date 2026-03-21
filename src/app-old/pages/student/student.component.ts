import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { filter, forkJoin, mergeMap, Observable, of } from "rxjs";
import { CreateUserParams, User, UserType } from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { StudentService } from './student.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { login } from "../../Auth/store/actions";
import { MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
    selector: 'uni-student',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule],
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  activeIndex = -1;
  submitted = false;
  form: FormGroup;
  gender = [
    { id: 'M', name: 'Male' },
    { id: 'F', name: 'Female' },
    { id: 'O', name: 'Others' }
  ];
  country = [
    { id: '', name: '' },
    { id: '1', name: 'India' }
  ];
  passingyear = [
    { id: '', name: '' },
    { id: '2020', name: '2020' },
    { id: '2021', name: '2021' },
    { id: '2022', name: '2022' },
    { id: '2023', name: '2023' }
  ];
  homecountries = [
    { id: '', name: '' },
    { id: '1', name: 'India' }
  ];
  locations: any = [];
  programlevel: any = [];
  intcountries: any = [];

  constructor(
    private studentService: StudentService,
    private service: AuthService,
    private fb: FormBuilder,
    private toaster: MessageService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      location: ['', [Validators.required]],
      programlevel: ['', [Validators.required]],
      passingyear: ['', [Validators.required]],
      intrestedcountry: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getLocationList();
    this.getProgramLevelList();
    this.getCountriesList();
    this.userdataid()
  }

  indextchange(eve: number) {
    this.activeIndex = eve;
  }

  get f() {
    return this.form.controls;
  }

  getLocationList() {
    this.studentService.getLocationList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.district
        };
        this.locations.push(bindingdata);
      });
    });
  }

  getProgramLevelList() {
    this.studentService.getProgramLevelList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.programlevel
        };
        this.programlevel.push(bindingdata);
      });
    });
  }

  getCountriesList() {
    this.studentService.getCountriesList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.country
        };
        this.intcountries.push(bindingdata);
      });
    });
  }
  source: any
  sourcetype: any
  userdataid() {
    this.service.getUserDetails$
      .pipe(filter(user => !!user))   // only pass non-null values
      .subscribe(res => {
        this.source = res[0].source
        this.sourcetype = res[0].source_type;
      })
  }
  submitForm() {
    this.submitted = true;
    var data = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.mobile,
      gender: this.form.value.gender,
      country: this.form.value.country,
      location_id: this.form.value.location,
      programlevel_id: this.form.value.programlevel,
      last_degree_passing_year: this.form.value.passingyear,
      interested_country_id: this.form.value.intrestedcountry,
      source: this.source,
      source_type: this.sourcetype
    }
    if (this.form.valid) {
      this.studentService.addStudent(data).subscribe((response: any) => {
        if (response) {
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.ngOnInit()
          this.form.reset()
          this.submitted = false;
        }
      })
    }
  }

}
