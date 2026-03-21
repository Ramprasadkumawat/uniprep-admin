import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AuthService } from 'src/app/Auth/auth.service';
import { PageFacadeService } from '../../page-facade.service';
import { UserFacadeService } from '../../users/user-facade.service';
import { SubscriberService } from '../subscriber.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'uni-validationdata',
    templateUrl: './validationdata.component.html',
    styleUrls: ['./validationdata.component.scss'],
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
        TableModule,
        DialogModule
    ]
})
export class ValidationdataComponent implements OnInit {
  users: any[] = [];
  datacount: number = 0;
  form: FormGroup;
  formEmail:FormGroup;
  usertypeid: any;
  sourcetype;
  source;
  notadmin = true;
  currentUserId!: number;
  submitted: boolean = false;
  submittedemail:boolean=false;
  StudentType: any = [];
  sourceName: any = [];
  sourceTypes: any = [];
  pageno: number = 1;
  perpage: number = 12;
  totalcount: number;
  datavalidatorlist: any[] = [];
  suggestionModal: boolean = false;
  emailVaildName="Edit"
  emailInputIsShow:boolean=false;
  constructor(private fb: FormBuilder,
    private router: Router,
    private pageService: PageFacadeService,
    private subscriberService: SubscriberService,
    private toast: MessageService,
    private authService: AuthService,
    private userFacade: UserFacadeService) {
    this.form = this.fb.group({
      student_type: [null, [Validators.required]],
      source_type: [null, [Validators.required]],
      source_name: [null, [Validators.required]],
      file: [null, Validators.required]
    });
    this.formEmail=this.fb.group({
      email:["", [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    this.getValidationFileList();
    this.getStudentType();
    this.getSourceTypeList();
    this.getHistoryType();
  }
  inavaliemailcount: number = 0;
  validmailcount: number = 0;
  totalemailcount: number = 0;
  studenttypeid: any;
  marketingid: any;
  sourcetypeid: any
  getValidationFileList() {
    this.datavalidatorlist = [];
    var data = {
      uploaded_file_id: localStorage.getItem("validationdataid"),
      // source_type_id:this.filterForm.value.source_type,
      // marketing_id:this.filterForm.value.source_name,
      // perpage:this.perPage,
      // page:this.pageno
    }
    this.subscriberService.getValidationFiledata(data).subscribe((response: any) => {
      this.datavalidatorlist = response.data
      this.inavaliemailcount = response.invalid_email_count
      this.validmailcount = response.valid_email_count
      this.totalemailcount = response.total_email_count
      this.datacount = response.data.length
      this.studenttypeid = response.student_type_id
      this.marketingid = response.marketing_id
      this.sourcetypeid = response.source_type_id
      console.log(response);
      this.changeSourceTypeInitial(this.sourcetypeid)

    });
  }
  changeSourceTypeInitial(id) {
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
    if (id == 2) {
      let data = {
        source: id.toString(),
      };
      this.pageService.getSourceNameBySoucreId(data).subscribe((response) => {
        this.sourceName = [{ id: null, institutename: "Select" }, ...response];
      });
      this.form.patchValue({
        student_type: this.studenttypeid,
        source_type: this.sourcetypeid,
        source_name: this.marketingid
      })
      return;
    }
    this.pageService
      .getSourceName(this.form.value.source_type)
      .subscribe((response) => {
        this.sourceName = [{ id: null, source_name: "Select" }, ...response];
      });
    this.form.patchValue({
      student_type: this.studenttypeid,
      source_type: this.sourcetypeid,
      source_name: this.marketingid
    })
  }
  get f() {
    return this.form.controls;
  }
  get e(){
    return this.formEmail.controls;
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
    var data = {
      // student_type:this.form.value.student_type,
      // source_type:this.form.value.source_type,
      // source:this.form.value.source_name,
      file_id: localStorage.getItem("validationdataid"),
      file: this.selectedFile
    }
    this.subscriberService.reUploadValidator(data).subscribe((res) => {
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: res.message,
      });
      this.selectedFile = null;
      this.submitted = false;
      this.form.patchValue({
        file: null
      })
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
  historylist: any[] = [];
  getHistoryType() {
    this.historylist = [];
    var data = {
      file_id: localStorage.getItem("validationdataid")
    }
    this.subscriberService.getHistory(data).subscribe((response) => {
      console.log(response);
      this.historylist = response

    });
  }
  historyShow() {
    this.suggestionModal = true;
  }
  downloadFile(link: any) {
    window.open(link, '_blank');
  }
  exportFile() {
    var data = {
      file_id: localStorage.getItem("validationdataid")
    }
    this.subscriberService.validatorExort(data).subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
  createAccountForEveryEmail() {
    var data = {
      file_id:localStorage.getItem("validationdataid")
    }
    this.subscriberService.createAllAccount(data).subscribe((res)=>{
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: res.message,
      });
      this.ngOnInit();
    })
  }
  oneEmailvalid(user:any){
    var data = {
      file_id:localStorage.getItem("validationdataid"),
      id:user.id
    }
    this.subscriberService.createAllAccount(data).subscribe((res)=>{
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: res.message,
      });
      this.ngOnInit();
    })
  }
  submitFormEamil(id:any){
      this.submittedemail=true;
      if (this.formEmail.invalid) {
        return;
      }
      var data={
        email:this.formEmail.value.email,
        id:id
      }
      this.subscriberService.validateEmailTesting(data).subscribe((res) => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.formEmail.reset();
        this.emailVaildName=="Edit"
        this.submittedemail = false;
        this.emailInputIsShow=false;
        this.userideditclick = 0;
        this.ngOnInit();
      })
  }
  userideditclick:number=0;
  editClick(user:any){
    if (this.userideditclick === user.id) {
      this.submitFormEamil(user.id)
    }else{
      this.userideditclick=user.id
      this.emailVaildName=="Submit"
      this.emailInputIsShow=true;
      this.formEmail.patchValue({
        email:user.email
      })
    } 
  }
}
