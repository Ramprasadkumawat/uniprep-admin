import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from 'src/app/Auth/auth.service';
import { PageFacadeService } from '../../page-facade.service';
import { UserFacadeService } from '../../users/user-facade.service';
import { SubscriberService } from '../subscriber.service';
import { PaginatorModule } from 'primeng/paginator';
import { filter } from 'rxjs';

@Component({
    selector: 'uni-datavalidator',
    templateUrl: './datavalidator.component.html',
    styleUrls: ['./datavalidator.component.scss'],
    imports: [
        CommonModule,
        AccordionModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        NgxIntlTelInputModule,
        PaginatorModule,
    ]
})
export class DatavalidatorComponent implements OnInit {
  @ViewChild('addFormElm') addFormElm!: ElementRef;
  form: FormGroup;
  filterForm:FormGroup;
  usertypeid: any;
  sourcetype;
  source;
  notadmin = true;
  currentUserId!: number;
  submitted: boolean = false;
  StudentType: any = [];
  sourceName: any = [];
  sourceTypes: any = [];
  pageno:number = 1;
  perPage:number = 12;
  totalcount: number;
  datavalidatorlist:any[] = [];
  constructor(    private fb: FormBuilder,
    private router: Router,
    private pageService: PageFacadeService,
    private subscriberService: SubscriberService,
    private toast: MessageService,
    private authService: AuthService,
    private userFacade: UserFacadeService) { 
    this.form = this.fb.group({
      student_type:[null, [Validators.required]],
      source_type:[null, [Validators.required]],
      source_name:[null, [Validators.required]],
      file: [null, Validators.required] 
    });
    this.filterForm = this.fb.group({
      student_type:[null,],
      source_type:[null],
      source_name:[null],
      file: [null] 
    });
  }

  ngOnInit(): void {
     this.authService.getUserDetails$
        .pipe(filter(user => !!user))   // only pass non-null values
        .subscribe(res => {
      if (res[0].usertype_id == 7) {
        this.usertypeid = 7;
        this.sourcetype = res[0].source_type;
        this.source = res[0].source;
        this.notadmin = false;
      }
      this.currentUserId = res[0].usertype_id;
    });
    this.getStudentType();
    this.getSourceTypeList();
    this.getValidationFileList();
  }
  get f() {
    return this.form.controls;
  }
  getStudentType() {
    this.pageService.getStudentType().subscribe((response) => {
      this.StudentType = [{ id: null, subtypeName: "Select" }, ...response];
    });
  }
  changeSourceType(event: any) {
    // if (event.value != 1) {
    //   this.form.controls["source_name_two"].setValidators(Validators.required);
    //   this.form.controls["source_name_two"].updateValueAndValidity();
    // } else {
    //   this.form.controls["source_name_two"].setErrors(null);
    //   this.form.get('source_name_two').clearValidators();
    //   this.form.controls["source_name_two"].updateValueAndValidity();
    // }
    // var data ={
    //   sourcetype: this.form.value.source_type
    // }
    if (event.value == 2) {
      let data = {
        source: event.value.toString(),
      };
      this.pageService.getSourceNameBySoucreId(data).subscribe((response) => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
      return;
    } 
    this.pageService
      .getSourceName(this.form.value.source_type)
      .subscribe((response) => {
        this.sourceName = [{ id: null, source_name: "Select" }, ...response];
      });
  }
  
  getSourceTypeList() {
    this.pageService.getSourceTypes().subscribe((response) => {
      this.sourceTypes = [{ id: null, name: "Select" }, ...response];
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var data={
      student_type:this.form.value.student_type,
      source_type:this.form.value.source_type,
      source:this.form.value.source_name,
      file:this.selectedFile
    }
    this.subscriberService.addValidator(data).subscribe((res)=>{
      console.log(res);
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: res.message,
      });
      this.form.reset();
      this.selectedFile = null;
      this.submitted = false;
      localStorage.setItem("validationdataid",res.uploaded_file_id)
      this.router.navigate(['subscribers/datavalidator/uploaddetails'])
      this.ngOnInit();
    })
  }
  changeSourceName() {
    const source_type_id = this.form.value.source_type;
    const source_id = this.form.value.source_name;
    this.pageService
      .getSourceNameTwo(source_type_id, source_id)
      .subscribe((response) => {
        // this.sourceNameTwo = [{ id: null, source_name: "Select" }, ...response];
      });
  }
  selectedFile: any;
  onFileSelect(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      const file: File = event.target.files[0];
      this.form.patchValue({
        file: file
      });
    } else {
      this.selectedFile = null;
    }
  }
  filterSubmitForm(){
    this.getValidationFileList();
  }
  paginate(event: any){
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    this.getValidationFileList();
  }
  getValidationFileList() {
    this.datavalidatorlist=[];
    var data={
      student_type_id:this.filterForm.value.student_type,
      source_type_id:this.filterForm.value.source_type,
      marketing_id:this.filterForm.value.source_name,
      perpage:this.perPage,
      page:this.pageno
    }
    this.subscriberService.getValidationFileList(data).subscribe((response:any) => {
      this.datavalidatorlist = response;
      this.totalcount=response.length
    });
  }
  resetFilter(){
    this.filterForm.reset();
    this.ngOnInit();
    this.filterSubmitForm();
  }
  validationDataListPage(id:any){
    localStorage.setItem("validationdataid",id)
    this.router.navigate(['subscribers/datavalidator/uploaddetails'])
  }
}
