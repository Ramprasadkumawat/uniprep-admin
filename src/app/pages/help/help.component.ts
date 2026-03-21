import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import {SelectModule} from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { PaginatorModule } from "primeng/paginator";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { TableModule } from "primeng/table";
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { TabsModule } from 'primeng/tabs';
import { HelpsService } from './helps.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Status {
  name: string;
  id: number;
}

@Component({
    selector: 'uni-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule,
    ],
    providers: [ConfirmationService]
})
export class HelpComponent implements OnInit {
  statuses: Status[] | any;
  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  pageSize = 10;
  activeIndex = -1;
  helpAndSupportCatName="Add Help & Support Queries"
  get f() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private service: HelpsService,
    private toastr: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.form = fb.group({
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
      catid: ["", [Validators.required]],
      status: ["", [Validators.required]],
      id: new FormControl(),
    });
    this.filterform = fb.group({
      status: [""],
      catid: [""],
    });
  }
  submitFilterForm() {
    const formData = this.filterform.value;
    if (!formData.catid && !formData.status) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let formdata = this.filterform.value;
    this.data.catid = formdata?.catid;
    this.data.status = formdata?.status;
    this.gethelps(this.data);
  }
  resetFilterForm(){
    this.filterform.reset()
    let formdata = this.filterform.value;
    this.data.catid = formdata?.catid;
    this.data.status = formdata?.status;
    this.gethelps(this.data);
    this.ngOnInit()
  }

  categorielists: any[] = [];
  selectedcategory: any;
  gethelpcategories() {
    this.service
      .getHelpCategories({ page: 1, perpage: 10000 })
      .subscribe((response) => {
        this.categorielists = [];
        this.categorielists = response.data;
      });
  }
  ngOnInit(): void {
    this.gethelps(this.data);
    this.gethelpcategories();
    this.statuses = [
      { name: "Active", id: "1" },
      { name: "De-Active", id: "0" },
    ];
  }
  edit(data: any) {
    this.activeIndex = 0;
    this.btntxt = "Update";
    this.helpAndSupportCatName="Update Help and support queries"
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.form.patchValue({
      question: data.question,
      answer: data.answer,
      status: data.status == 1 ? "1" : "0",
      catid: data.categoryid,
      id: data.id,
    });
  }
  btntxt = "Add";
  helplists: any[] = [];
  gethelps(data: any) {
    this.service.getHelp(data).subscribe((response) => {
      this.helplists = [];
      this.helplists = response.data;
      this.datacount = response?.count;
    });
  }
  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      return;
    }
    if (this.btntxt == "Add") {
      this.service.AddHelp(this.form.value).subscribe((response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Help Added Successfully",
        });
        this.submitted = false;
        this.form.reset();
        this.gethelps(this.data);
        this.activeIndex = -1;
        this.ngOnInit()
      });
    } else {
      this.service.UpdateHelp(this.form.value).subscribe((response) => {
        this.btntxt = "Add";
        this.helpAndSupportCatName="Add Help & Support Queries"
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Help Updated Successfully",
        });
        this.submitted = false;
        this.form.reset();
        this.gethelps(this.data);
        this.activeIndex = -1;
        this.ngOnInit()
      });
    }
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
    this.gethelps(this.data);
  }
  // deleted(id: number) {
  //   this.confirmationService.confirm({
  //     message: "Do you want to delete this record?",
  //     header: "Delete Confirmation",
  //     icon: "pi pi-info-circle",
  //     accept: () => {
  //       var data = {
  //         id: id
  //       }
  //       this.service.delete(data)
  //         .subscribe(() => {
  //           this.toastr.add({
  //             severity: "success",
  //             summary: "Success",
  //             detail: "Removed Successfully",
  //           });
  //           this.ngOnInit()
  //         });
  //     },
  //   });
  // }
  // export
    // exportedDataFileName
    exportTable() {
      this.service.helpAndSuppQuerExport().subscribe((response) => {
        window.open(response.link, '_blank');
      });
    }
}