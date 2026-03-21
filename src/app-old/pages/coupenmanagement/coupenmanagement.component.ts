import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { forkJoin, mergeMap, Observable, of } from "rxjs";
import { CreateUserParams, User, UserType } from "../../@Models/user.model";
import {SelectModule} from "primeng/select";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { login } from "../../Auth/store/actions";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomValidators } from 'src/app/@Supports/validator';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Highcharts from 'highcharts';
import { ChartModule } from 'primeng/chart';
import { CoupenmanagementService } from './coupenmanagement.service';
// import { stringify } from 'querystring';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { PageFacadeService } from '../page-facade.service';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
export function couponCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    if (/\s/.test(value)) {
      return { hasSpace: true };
    }
    return null;
  };
};
@Component({
    selector: 'uni-coupenmanagement',
    templateUrl: './coupenmanagement.component.html',
    styleUrls: ['./coupenmanagement.component.scss'],
    imports: [CommonModule, PaginatorModule, ConfirmDialogModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule],
    providers: [ConfirmationService]
})
export class CoupenmanagementComponent implements OnInit {
  countries: country[] = [];
  RegionOptions = [];
  form: FormGroup;
  fileterform:FormGroup;
  Optionslocation = []
  statuses=[]
  submitted=false;
  datacount: number = 0;
  activecount:number=0;
  btntxt = "Create";
  activeIndex = -1;
  hasSpace: boolean = false;
  usernameoption = []
  UsertypeOptions = []
  percentage = [];
  locations: any = [];
  Locationng:any=[]
  region: any = [];
  perPage:number = 10;
  pageno:number = 1;
  couponCreaterName="Coupon Creator"
  IsNotVisibleInEdit:boolean=true;
  rows: number = 10; 
  constructor(private formbuilder: FormBuilder, private cdr: ChangeDetectorRef, private authservice: AuthService, private service: CoupenmanagementService,private confirmationService: ConfirmationService,
              private toastr: MessageService, private router:Router,    private pageService: PageFacadeService,) {
    this.form = formbuilder.group({
      coupencodename: ['', [Validators.required, couponCodeValidator()]],
      discountpercentage: ['', [Validators.required]],
      validityform: ['', [Validators.required]],
      to: ['', [Validators.required]],
      usertype: ['', [Validators.required]],
      // region: ['', [Validators.required]],
      username: ['', [Validators.required]],
      // location: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id:['']
    });
    this.fileterform = formbuilder.group({
      status: ['']
    })
  }
  checkForSpaces() {
    const coupencodenameValue = this.form.get('coupencodename').value;
    this.hasSpace = coupencodenameValue && coupencodenameValue.includes(' ');
  }
  ngOnInit(): void {
    this.statuses = [
      { name: "Active", id: '1' },
      { name: "De-Active", id: '0' },
    ];
    this.percentage =[
      { id: 5, percentage: '5%' },
      { id: 10, percentage: '10%' },
      { id: 15, percentage: '15%' },
      { id: 20, percentage: '20%' },
      { id: 25, percentage: '25%' },
      { id: 30, percentage: '30%' },
      { id: 35, percentage: '35%' },
      { id: 40, percentage: '40%' },
      { id: 45, percentage: '45%' },
      { id: 50, percentage: '50%' }
    ]
    this.UsertypeOptions = [
      { id: 14, usertype: 'Active Employee' },
      { id: 13, usertype: 'Freelancer' },
      { id: 9, usertype: 'Marketing Representative' },
      { id: 12, usertype: 'Marketing Intern' },
    ]
    this.service.getregion().subscribe((res) => {
      this.region = res
    })
    // this.pageService.getSources().subscribe(response => {
    //   this.UsertypeOptions = [{ id: null, type: "Select" }, ...response];
    // });
    // this.service.getlocation().subscribe((res) => {
    //   this.Optionslocation = res      
    // })
    // this.service.username().subscribe((res) => {
    //   this.usernameoption = res      
    // })
    var data = { 
      page: 1, perpage: 10
    };
    this.getlist(data);
  }
  get f() {
    return this.form.controls;
  }

  submitForm() {
    this.submitted=true;
    if(this.form.valid){
      if (this.btntxt== "Create") {
        var data = {
          couponcodename:this.form.value.coupencodename,
          discountpercentage:this.form.value.discountpercentage,
          validityFrom:this.form.value.validityform,
          validityTo:this.form.value.to,
          usertype:this.form.value.usertype,
          username:this.form.value.username,
          // location:this.form.value.location,
          status:this.form.value.status,
          // region:this.form.value.region,
          couponsId:this.form.value.id
        }
        this.service.Addcoupen(data).subscribe((respons:any)=>{
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: respons.message,
          });
          this.form.reset()
          this.ngOnInit()
          this.submitted=false;
        })
      }else{
        var datas = {
          couponcodename:this.form.value.coupencodename,
          discountpercentage:this.form.value.discountpercentage,
          validityFrom:this.form.value.validityform,
          validityTo:this.form.value.to,
          usertype:this.form.value.usertype,
          username :this.form.value.username,
          location:this.form.value.location,
          status:this.form.value.status,
          region:this.form.value.region,
          couponsId:this.form.value.id
        }
        this.service.Editcoupen(datas).subscribe((respons:any)=>{
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: respons.message,
          });
          this.form.reset()
          this.ngOnInit()
          this.submitted=false;
          this.btntxt = "Create";
          this.couponCreaterName="Coupon Creator"
          this.IsNotVisibleInEdit=true;
        })
      }
    }


  }
  coupenlists: any[] = [];
  deactivecount:any;
  getlist(data: any) {
    this.service.getcoupenlist(data).subscribe((response) => {
      this.coupenlists = [];
      this.coupenlists = response.coupons
      this.datacount = response.count;
      this.deactivecount = response.deactivecount
      this.activecount =response.activecount;
    });
  }
  resetButton(){
    this.fileterform.reset();
    this.filterform();
    this.ngOnInit();
  }
  filterCouponForm(){
    if (!this.fileterform.value.status) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.filterform();
  }
  filterform() {
    var data={
      page: 1,
      perPage: 10,
      status:this.fileterform.value.status,
    }
    this.service.getcoupenlist(data).subscribe((response) => {
      this.coupenlists = [];
      this.coupenlists = response.coupons
      this.datacount = response.count;
      this.deactivecount = response.deactivecount
      this.activecount =response.activecount;
    });
  }
  page: number = 1;
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : event.page + 1,
      status:this.fileterform.value.status,
    }
    this.getlist(data);
  }
  discount:any;
  editlist(data: any) {
    this.IsNotVisibleInEdit=false;
    var datas = {
      usertypeid:data.usertype
    }
    this.service.getusername(datas).subscribe((response) => {
      this.usernameoption = [];
      this.usernameoption = response
    });
    this.locations=[];
    this.btntxt = "Update";
    this.couponCreaterName="Edit Coupen Creator"
    // const value = data.regionid.toString();
    // this.service.getLocationByRegion(value).subscribe(response => {
    //   this.locations = response;
    // });
    this.activeIndex = 0;
    this.cdr.detectChanges();
    this.form.patchValue({
      coupencodename:data.couponcodename,
      discountpercentage:data.discountpercentage,
      validityform:data.validityFrom,
      to:data.validityTo,
      usertype:data.usertype,
      // region:data.regionid,
      username: parseInt(data.username),
      // location:data.locationid,
      status:data.status==1? '1':'0',
      id:data.id
    });
    // this.Locationng=data.locationid
  }

  username(id:any){
    var data = {
      usertypeid:id.value
    }
    this.service.getusername(data).subscribe((response) => {
      this.usernameoption = [];
      this.usernameoption = response
    });

  }
  changeRegion(event: any) {
    const value = event.value.toString();
    this.getLocationList(value)
  }
  getLocationList(value: string) {
    this.service.getLocationByRegion(value).subscribe(response => {
      this.locations = response;
    });
  }
  copyToClipboard(couponCode: any) {
    // Assuming you're using the Clipboard API
    // this.clipboard.copy(couponCode);

    // For a simple copy to clipboard without the Clipboard API
    const dummyElement = document.createElement('textarea');
    document.body.appendChild(dummyElement);
    dummyElement.value = couponCode;
    dummyElement.select();
    document.execCommand('copy');
    document.body.removeChild(dummyElement);
    // You might want to notify the user that the text is copied
    this.toastr.add({ severity: 'success', detail: 'Coupon code copied:' + couponCode });
  }
  coupenUseSubsribeLeadUsers(id: any) {
    this.router.navigate(['activeleadlist/',id])
  }
    deletestudent(id: number) {
    var data= {
      couponsId:id
    }
    this.service.delete(data).subscribe((response) => {
      this.toastr.add({
        severity: "success",
        summary: "Success",
        detail: "Removed Successfully",
      });
      window.location.reload();
    });
  }
}


