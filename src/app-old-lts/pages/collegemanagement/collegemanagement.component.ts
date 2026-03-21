import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { forkJoin, mergeMap, Observable, of } from "rxjs";
import { CreateUserParams, User, UserType } from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { login } from "../../Auth/store/actions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Highcharts from 'highcharts';
import { ChartModule } from 'primeng/chart';
// import { stringify } from 'querystring';
import { CollegemanagemetService } from './collegemanagemet.service';
@Component({
    selector: 'uni-collegemanagement',
    templateUrl: './collegemanagement.component.html',
    styleUrls: ['./collegemanagement.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule]
})
export class CollegemanagementComponent implements OnInit {
  filterForm: FormGroup;
  collegelists=[]
  collegenames=[]
  pageSize = 10;
  RegionOptions=[];
  districtid=[];
  institutetypeid = [];
  institutelist = [];
  collegeregion:any
  DistrictOptions=[];
  constructor(private fb: FormBuilder, private authservice: AuthService, private service: CollegemanagemetService,) {
    this.filterForm = this.fb.group({
      collegename: [''],
      collegetype: [''],
      region: [''],
      district:[''],
      pincode:['']
    });
   }

  ngOnInit(): void {
    this.getcollegelist()
    this.getcollegename()
    this.getregionn()
    this.getinstitute()
  }
  getinstitute() {
    this.institutelist = []
    this.service.getinstitute().subscribe((res) => {
      this.institutelist = res.data
    })
  }
  getregionn(){
    this.RegionOptions=[]
    this.service.getregion().subscribe((res)=>{
      this.RegionOptions=res
    })
  }
  filter(){
    var data={
      collegename:this.filterForm.value.collegename,
      collegetype:this.filterForm.value.collegetype,
      pincode:this.filterForm.value.pincode,
      region:this.filterForm.value.region,
      dsitrict:this.filterForm.value.district,
      page: 1, 
      perpage: this.pageSize,
    }
    this.service.getcollegelist(data).subscribe((response) => {
      this.collegelists = [];
      this.collegelists = response.colleges;
      this.datacount = response.colleges.length;
       });
  }
  data: any = { page: 1, perpage: this.pageSize};
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize,
    };
    // this.service.getcollegelist(this.data).subscribe((response) => {
    //   this.collegelists = [];
    //   this.collegelists = response.coupon;
    //   this.collegelists = response.count;
    // });
  
  }
  datacount: number = 0;
  getcollegelist() {
    var data = { 
     page: this.page, 
     perpage: this.pageSize,
   }

   this.service.getcollegelist(data).subscribe((response) => {
    this.collegelists = [];
    this.collegelists = response.colleges;
    this.datacount = response.colleges.length;
     });
   }
   getcollegename() {

   this.service.getcollegename().subscribe((response) => {
    this.collegenames = [];
    this.collegenames = response.data;
     });
   }
   selectMonth(){
    this.getdistrict()
  }
  getdistrict(){
    this.DistrictOptions=[]
    if(!this.collegeregion){
      this.collegeregion=1
    }
    var data={
      regionId:this.collegeregion
    }
    this.service.getdistrict(data).subscribe((res)=>{
      this.DistrictOptions=res
    })
  }
}
