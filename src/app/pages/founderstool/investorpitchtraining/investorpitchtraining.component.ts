import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FounderstoolService } from '../founderstool.service';
import { HttpClient } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
interface Status { 
  name: string;
  id: number;
}
@Component({
    selector: 'uni-investorpitchtraining',
    templateUrl: './investorpitchtraining.component.html',
    styleUrls: ['./investorpitchtraining.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, DialogModule
    ],
    providers: [ConfirmationService]
})
export class InvestorpitchtrainingComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  pageSize = 10;
  activeIndex = -1;
  datacount: number = 0;
  usertypefortutorial: any = [];
  category_dropdown: { id: string, name: string }[] = [];
  investName="Add Investor Pitch Training"
  fileUploadModal: boolean = false;
  selectedFile: any;
  get f() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private service: FounderstoolService,
    private toastr: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.form = fb.group({
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
      status: ["", [Validators.required]],
      id: new FormControl(),
    });

  }

  reset() {
    this.form.reset();
  }

  editInvestor(invdata: any) {
    this.activeIndex = 0;
    this.btntxt = "Update";
    this.investName="Update Investor Pitch Training"
    this.form.patchValue({
      question: invdata.question,
      answer: invdata.answer,
      status: invdata.status==1? '1':'0',
      id: invdata.id,
    });
  }
  statuses: Status[] | any;
  ngOnInit(): void {
    var data={
      page:1,
      perpage:10
    }
    this.getInvestor(data);
    // this.getCategorydropdown();
    this.statuses = [
      { name: "Active", id: '1' },
      { name: "De-Active", id: '0' },
    ];
  }

  investorlists: any[] = [];
  getInvestor(data: any) {
    this.service.getInvestorPitch(data).subscribe((response) => {
      this.investorlists = [];
      this.investorlists = response.investors;
      this.datacount = response.count;
    });
  }
  page: number = 1;
  pageno:number = 1;
  perPage:number = 10;
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : event.page + 1,
    }
    this.getInvestor(data)
  }
  btntxt = "Add";
  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.btntxt == "Add") {
      this.service.AddInvestor(this.form.value,).subscribe((response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.submitted = false;
        this.form.reset();
        this.activeIndex = -1;
        this.ngOnInit();
      });
    } else {
      this.service.UpdateInvestor(this.form.value).subscribe((response) => {
        this.btntxt = "Add";
        this.investName="Add Investor Pitch Training"
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.submitted = false;
        this.form.reset();
        this.activeIndex = -1;
        this.ngOnInit();
      });
    }
  }
  // deleted(id: number) {
  //   this.confirmationService.confirm({
  //     message: "Do you want to delete this record?",
  //     header: "Delete Confirmation",
  //     icon: "pi pi-info-circle",
  //     accept: () => {
  //       var data={
  //         id:id
  //       }  
  //      this.service.deleteFAQ(data).subscribe((res) => {
  //           this.toastr.add({
  //             severity: "success",
  //             summary: "Success",
  //             detail: "Removed Successfully",
  //           });
  //           this.ngOnInit()
  //         });
  //       this.getfaq(this.data);
  //     },
  //   });
  // }
  // exportedDataFileName
  // export
  exportTable() {
    this.service.investorExport().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }
  uploadFile(){
    if (this.selectedFile) {
      this.service.investorImport(this.selectedFile).subscribe((response) => {
          if(response.link){
            window.open(response.link, '_blank');
          }
          this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
          this.fileUploadModal = false;
          this.selectedFile = null;
          this.ngOnInit();
      });
    } else {
      this.toastr.add({severity: "error",summary: "Error",detail: "Please choose file!",});
    }
  }
  // fileUploadModalOpen(){
  //   this.fileUploadModal = true;
  // }
}

