import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import {SelectModule} from "primeng/select";
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SessionService } from '../session.service';
import { PaginatorModule } from 'primeng/paginator';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
@Component({
    selector: 'uni-sessionmanager',
    templateUrl: './sessionmanager.component.html',
    styleUrls: ['./sessionmanager.component.scss'],
    imports: [AccordionModule, ReactiveFormsModule, CommonModule, SelectModule, MultiSelectModule, PaginatorModule]
})
export class SessionmanagerComponent implements OnInit {
  activeIndex: number = -1;
  header_text = 'Add Live Session';
  ifAdd: boolean = true;
  Addformshow:boolean = true;
  form: FormGroup;
  filterForm: FormGroup;
  submitted:boolean = false;
  countries: country[] = [];
  locations: any = [];
  state: any = [];
  venues: any = [];
  speakers: any = [];
  employees: any = [];
  totalsession = 0;
  sessions = [
    {
      name: 'Web Development Basics',
      daystogo: '1 Day to Go',
      time: '10 AM - 11 AM',
      date: '26 May 23',
      description: 'This session will cover the basics of web development, including HTML, CSS, and JavaScript.',
      location: 'Mysore, Karnataka, India',
      venue: 'Vidhyavardhaka College of Engineering',
      flag: 'https://api.uniprep.ai/uniprepapi/storage/app/public/country-flags/india.svg',
      speaker: "Speaker 1",
      paricipants: 15
    },
    {
      name: 'Advanced JavaScript',
      daystogo: '2 Days to Go',
      time: '11 AM - 12 PM',
      date: '27 May 23',
      description: 'Learn advanced concepts in JavaScript and its frameworks.',
      location: 'Bangalore, Karnataka, India',
      venue: 'IIT Bangalore',
      flag: 'https://api.uniprep.ai/uniprepapi/storage/app/public/country-flags/india.svg',
      speaker: "Speaker 2",
      paricipants: 10
    },
    {
      name: 'Web Development Basics',
      daystogo: '1 Day to Go',
      time: '10 AM - 11 AM',
      date: '28 May 23',
      description: 'This session will cover the basics of web development, including HTML, CSS, and JavaScript.',
      location: 'Mysore, Karnataka, India',
      venue: 'Vidhyavardhaka College of Engineering',
      flag: 'https://api.uniprep.ai/uniprepapi/storage/app/public/country-flags/india.svg',
      speaker: "Speaker 3",
      paricipants: 4
    },
  ];
  totalcount = 3;
  @ViewChild('formElm') formElm!: ElementRef;
  constructor(fb: FormBuilder,private sessionservice: SessionService,private toaster: MessageService,) {
    this.form = fb.group({
      sessionname: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      location: [null, [Validators.required]],
      date : [null,[Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      venue: [null, [Validators.required]],
      participants : [null, [Validators.required]],
      speaker: [null, [Validators.required]],
      employee: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
    this.filterForm = fb.group({
      sessionname: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      venue: [null, [Validators.required]],
      speaker: [null, [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.sessionservice.GetCountryList(2).subscribe(response => {
      this.countries = [{ id: null, country: "Select" }, ...response];
    });
    this.sessionservice.GetSpeakerList().subscribe(response => {
      this.speakers = [{ id: null, name: "Select" }, ...response];
    });
    this.sessionservice.getAllEmployees().subscribe(response => {
      this.employees = [{ id: null, name: 'Select' }, ...response];
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    var data = {
      name : value.sessionname,
      country_id: value.country,
      state_id: value.state,
      location: value.location,
      date: value.date,
      from: value.from,
      to: value.to,
      venue: value.venue,
      participants: value.participants,
      speaker: value.speaker,
      employee: value.employee,
      description: value.description
    }
    this.sessionservice.addSession(data).subscribe(response => {
      this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
    });
  }

  changeCountry(event: any) {
    this.locations = [];
    this.state = [];
    
    if (this.form.get('country').value == 122) {
 
      this.sessionservice.getRegion().subscribe((res) => {
        const selectOption = { id: 'null', state: "Select" };
        this.state = [selectOption, ...res];  
        
        this.form.get('state')?.setValue(selectOption.id);

        this.locations = [{ id: 0, district: "Others" }];
        this.form.get('location')?.setValue(this.locations[0].id);
      });
    } else {

      this.state = [{ id: 0, state: "Others" }];
      this.form.get('state')?.setValue(0);
      this.form.get('location')?.setValue("Others");
    }
  }
  
  changeRegion(event: any) {
    const value = event.value.toString();
    this.form.get('location')?.setValue("");
    this.getLocationList(value)
  }

  getLocationList(value: string) {
    this.sessionservice.getLocationByRegion(value).subscribe(response => {
      this.locations = [{ id: null, district: "Select" }, ...response];
    });
  }

  changeLocation(event:any) {
    const value = event.value.toString();
    this.form.get('venue')?.setValue("");
    this.sessionservice.getInstitutesByLocation(value).subscribe(response => {
      this.venues = [{ id: null, institutename: "Select" }, ...response];
    });
  }

  filtersubmit() {

  }

  reset() {
    console.log(1);
  }

  paginate(event:any) {

  }

}
