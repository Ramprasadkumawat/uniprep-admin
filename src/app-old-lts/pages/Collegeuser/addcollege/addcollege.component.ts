import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { Accordion, AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import { Observable } from 'rxjs';
import { User, UserType } from 'src/app/@Models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// import { error } from 'console';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddcollegesService } from '../addcolleges.service';
@Component({
    selector: 'uni-addcollege',
    templateUrl: './addcollege.component.html',
    styleUrls: ['./addcollege.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule
    ],
    providers: [ConfirmationService]
})
export class AddcollegeComponent implements OnInit {

  users$!: Observable<{ users: User[], totalRecords: number }>;
  userTypes$!: Observable<UserType[]>;
  userTypesWithAll$!: Observable<UserType[]>;
  form: FormGroup;
  submitted = false;
  activeIndex=-1;
  btntxt = "Submit";
  collegelist=[]
  pageSize = 10;
  statusOptions = [
    { value: '', label: '' },
    { value: 1, label: 'Active' },
    { value: 0, label: 'In-Active' },
  ];
  RegionOptions=[];
  DistrictOptions=[];
  collegeregion:any
  districtid:any
  constructor(private router: Router, private fb: FormBuilder,private toastr: MessageService, private service:AddcollegesService,private confirmationService: ConfirmationService,private cdr: ChangeDetectorRef ) {
    this.form = fb.group({
      collegename: ['', [Validators.required]],
      collegetype: ['', [Validators.required]],
      status: ['', [Validators.required]],
      region: ['', [Validators.required]],
      district: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      contactpersonname: ['', [Validators.required]],
      number: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      collegesId:['']
    });
  }

  ngOnInit(): void {
    this.getcollegelist(this.data)
    this.getregionn()
    this.getdistrict()
  }
  get f() {
    return this.form.controls;
  }
  getregionn(){
    this.RegionOptions=[]
    this.service.getregion().subscribe((res)=>{
      this.RegionOptions=res
    })
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
      this.DistrictOptions=res[0]
    })
  }
  selectMonth(){
    this.getdistrict()
  }
  datacount: number = 0;
  data: any = { page: 1, perpage: this.pageSize };
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
    this.getcollegelist(this.data);
  }
  indextchange(eve:number){
    this.activeIndex = eve;
  }
  submitForm() {
    this.submitted = true;
    if (this.form.valid) {
      var data = {
        collegename: this.form.value.collegename,
        collegetype: this.form.value.collegetype,
        status: this.form.value.status,
        region: this.form.value.region,
        district: this.form.value.district,
        pincode: this.form.value.pincode,
        contactpersonname: this.form.value.contactpersonname,
        contactpersonnumber: this.form.value.number,
        contactpersonemail:this.form.value.email,
      }
      
      if (this.btntxt == "Submit") {
        this.service.addcollege(data).subscribe((res) => {
          if (res) {
            this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
            this.ngOnInit()
            this.form.reset()
            this.submitted = false;
          }
        })
      }else{
        var updatedata = {
          collegename: this.form.value.collegename,
          collegetype: this.form.value.collegetype,
          status: this.form.value.status,
          region: this.form.value.region,
          district: this.form.value.district,
          pincode: this.form.value.pincode,
          contactpersonname: this.form.value.contactpersonname,
          contactpersonnumber: this.form.value.number,
          contactpersonemail:this.form.value.email,
          collegesId:this.form.value.collegesId,
        }
        this.service.editcollege(updatedata).subscribe((res)=>{
              if (res) {
                this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
                this.ngOnInit()
                this.form.reset()
                this.btntxt = "Submit";
                this.submitted = false;
              }
            })
      }
      }
  }
  getcollegelist(data:any) {
    this.service.getlistcollege(data).subscribe((res) => {
      this.collegelist=[]   
        this.datacount=res.count
        this.collegelist=res.college
      // })
    })

  }

  editcollegedetails(eve:any){
    var data={
      RegionId:eve.region
    }
    
    this.service.getdistrict(data).subscribe((res)=>{
      this.DistrictOptions=res
      this.form.patchValue({
        collegename: eve.collegename,
        collegetype: eve.collegetype,
        region: eve.region,
        district:eve.district,
        pincode: eve.pincode,
        contactpersonname:eve.contactpersonname,
        number: eve.contactpersonnumber,
        email:eve.contactpersonemail,
        status:eve.status,
        collegesId:eve.id,
      });
      // this.districtid=this.DistrictOptions.find((n)=>eve.district)
    })
    
    this.cdr.detectChanges();
    this.activeIndex = 0;
    this.btntxt = "Update";   
    // this.form.patchValue({
    //   collegename: eve.collegename,
    //   collegetype: eve.collegetype,
    //   region: eve.region,
    //   district: eve.district,
    //   pincode: eve.pincode,
    //   contactpersonname:eve.contactpersonname,
    //   number: eve.contactpersonnumber,
    //   email:eve.contactpersonemail,
    //   status:eve.status,
    //   collegesId:eve.id,
    // });
    // this.getdistrictpatch()
  }
  // getdistrictpatch(){
  //   var data={
  //     RegionId:this.form.value.region
  //   }
  //   this.service.getdistrict(data).subscribe((res)=>{
  //     this.DistrictOptions=res
  //   })
  // }
  deletecollegelist(eve:any){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        var data={
          collegesId:eve
        }    
        this.service.deleteCollege(data).subscribe((res) => {
          this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
          this.ngOnInit()
        });
      }
    });
  }
  redirectmanage(){
    // this.router.navigate(['/addcolleges/addcoupen'])
  }
}
