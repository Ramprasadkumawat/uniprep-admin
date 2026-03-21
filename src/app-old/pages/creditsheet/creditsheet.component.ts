import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {forkJoin, mergeMap, Observable, of} from "rxjs";
import {CreateUserParams, User, UserType} from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { CreditsheetService } from './creditsheet.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {login} from "../../Auth/store/actions";
import {MessageService} from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
    selector: 'uni-creditsheet',
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, MultiSelectModule],
    templateUrl: './creditsheet.component.html',
    styleUrls: ['./creditsheet.component.scss']
})
export class CreditsheetComponent implements OnInit {

  constructor(
      private creditSheetService: CreditsheetService,
      private fb: FormBuilder,
  ) {
    this.filterForm = fb.group({
      valid_from: [''],
      valid_to: [''],
      name: [''],
      phone:[''],
      email:[''],
      country: [''],
      interested_country_id: [''],
      region:[''],
      location_id:[''],
      source_type: [''],
      source:[''],
      subscription_id:[''],
      student_type_id: [''],
      creditStatus:['']
    });
  }

  ngOnInit(): void {
    this.getCountriesList();
    this.getCreditSheetList();
  }
  potentialrevenue:any;
  receivablerevenue:any
  receivedrevenue:any;
  creditusers:any=[];
  filterForm: FormGroup;
  countries:any = [];
  creditstatus=[
    { id:'1',name:'Creditable Revenue'},
    { id:'2',name:'Credited Revenue'}
  ];

  getCreditSheetList() {
    var data = {
    }
    this.creditSheetService.getCreditSheetCard(data).subscribe((response)=>{
      this.potentialrevenue = response.revenue_values[0].potentialrevenue;
      this.receivablerevenue = response.revenue_values[0].creditable_revenue;
      this.receivedrevenue = response.revenue_values[0].credited_revenue
      response.user_data.forEach((element:any)=>{
        var bindingdata = {
          studentname:element.studentname,
          creditstatus:element.creditStatusName,
          cdd:element.cdd,
          creditvalue:element.credit_amount,
          email:element.email,
          location:element.location,
          phone:element.phone,
          sourcename:element.source_name,
          sourcetype:element.source_type,
          student_type:element.student_type,
          subscriptionplan:element.subscription_plan
        };
        this.creditusers.push(bindingdata);
      });
    })
  }

  filter() {
    this.creditusers = [];
    var data = {
      name: this.filterForm.value.name,
      email:this.filterForm.value.email,
      mobile:this.filterForm.value.phone,
      country:this.filterForm.value.country,
      creditstatus:this.filterForm.value.creditstatus
    };
    this.creditSheetService.getCreditSheetCard(data).subscribe((response)=>{
      this.potentialrevenue = response.potentialrevenue;
      this.receivablerevenue = response.receivablerevenue;
      this.receivedrevenue = response.receivedrevenue
      response.creditsheetlist.forEach((element:any)=>{
        var bindingdata = {
          studentname:element.studentname,
          creditstatus:element.creditStatusName,
          cdd:element.cdd,
          creditvalue:element.credit_amount,
          email:element.email,
          location:element.location,
          phone:element.phone,
          sourcename:element.source_name,
          sourcetype:element.source_type,
          student_type:element.student_type,
          subscriptionplan:element.subscription_plan
        };
        this.creditusers.push(bindingdata);
      });
    })
  }

  getCountriesList() {
    this.creditSheetService.getCountriesList().subscribe((response)=>{
      response.forEach((element:any)=>{
        var bindingdata = {
          id:element.id,
          name:element.country
        };
        this.countries.push(bindingdata);
      });
    });
  }

}
