import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {SelectModule} from "primeng/select";
import {InputTextModule} from "primeng/inputtext";
import {TextareaModule} from "primeng/textarea";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HelpCatService } from './help-cat.service';

interface Status {
  name: string;
  id: number;
}
@Component({
    selector: 'uni-help-cat',
    templateUrl: './help-cat.component.html',
    styleUrls: ['./help-cat.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule
    ],
    providers: [ConfirmationService]
})
export class HelpCatComponent implements OnInit {

  statuses: Status[] | any;
  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  pageSize = 10;
  activeIndex=-1;
  helpAndSupportCatName="Add Help & Support Category"
  get f() {
    return this.form.controls;
  }
  constructor(
      private fb: FormBuilder,
      private service:HelpCatService,
      private toastr: MessageService,
      private confirmationService: ConfirmationService,
      private http: HttpClient,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
       status: ['', [Validators.required]],
       description: ['', [Validators.required]],
       id:new FormControl()
    });
    this.filterform = fb.group({
      status: [""],
      name: [""],
    });
  }
  submitFilterForm() {
    const formData = this.filterform.value;
    if (!formData.name && !formData.status) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let formdata = this.filterform.value;
    this.data.name = formdata?.name;
    this.data.status = formdata?.status;
    this.gethelpcategories(this.data);
  }

  resetFilterForm(){
    this.filterform.reset()
    let formdata = this.filterform.value;
    this.data.name = formdata?.name;
    this.data.status = formdata?.status;
    this.gethelpcategories(this.data);
    this.ngOnInit()
  }
  ngOnInit(): void {
    this.gethelpcategories(this.data);
    this.statuses = [
    { name: 'Active', id: "1" },
    { name: 'De-Active', id: "0"}
  ];
  }
  datacount:number=0;
  data:any={page:1,perpage:this.pageSize}
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize
    }
    this.gethelpcategories(this.data);
  }
  editcat(data:any){
    this.activeIndex=0;
    this.btntxt="Update";
    this.helpAndSupportCatName="Update Help and support Category"
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.form.patchValue({
      name:data.helpcategory_name,
      status:data.status==1?"1":"0",
      id:data.id,
      description:data.description
    })
  }
  btntxt="Add";
  helpcategorielists:any[]=[];
  gethelpcategories(data:any){
    this.service.getHelpCategories(data).subscribe((response) => {
      this.helpcategorielists=[];
      this.helpcategorielists=response.data;
      this.datacount=response?.count;
    })
  }
  submitForm() {
    if(this.form.invalid){
      this.submitted=true;
      return;
    }
    if(this.btntxt=="Add"){
    this.service.AddHelpCategories(this.form.value).subscribe((response) => {
      this.toastr.add({
        severity: "success",
        summary: "Success",
        detail: "Help Category Added Successfully",
      });
      this.submitted=false;
    this.form.reset();
    this.gethelpcategories(this.data);
    this.activeIndex=-1;
    })}
    else {
      this.service.UpdateHelpCategories(this.form.value).subscribe((response) => {
        this.btntxt="Add";
        this.helpAndSupportCatName="Add Help & Support Category"
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Help Category Updated Successfully",
        });
        this.submitted=false;
    this.form.reset();
    this.gethelpcategories(this.data);
    this.activeIndex=-1;
      })
    }
    
  }
  // deleteid(id: number) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       var data={
  //         id:id
  //       }
  //       this.service.deleteCategories(data).subscribe(() => {
  //         this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
  //         this.ngOnInit()
  //       });
  //       this.gethelpcategories(this.data);
  //     }
  //   });
  // }
  // export
  exportTable() {
    this.service.helAndSupportCatExport().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
}
