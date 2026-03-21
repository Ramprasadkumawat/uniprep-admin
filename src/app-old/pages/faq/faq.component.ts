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
import { FaqService } from './faq.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
interface Status { 
  name: string;
  id: number;
}
@Component({
    selector: 'uni-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, MultiSelectModule
    ],
    providers: [ConfirmationService]
})
export class FaqComponent implements OnInit {
  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  pageSize = 10;
  activeIndex = -1;
  datacount: number = 0;
  usertypefortutorial: any = [];
  category_dropdown: { id: string, name: string }[] = [];
  faqName="Add Faq queries"
  get f() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private service: FaqService,
    private toastr: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.form = fb.group({
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
      status: ["", [Validators.required]],
      categoryid: ["", [Validators.required]],
      id: new FormControl(),
      usertype:["", [Validators.required]]
    });
    this.filterform = fb.group({
      status: [""],
      category: [""],
      usertype:[""]
    });
  }
  submitFilterForm() {
    const formData = this.filterform.value;
    if (!formData.category && !formData.status) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let formdata = this.filterform.value;
    this.data.category = formdata?.category;
    this.data.status = formdata?.status;
    this.getfaq(this.data);
  }
  reset() {
    this.form.reset();
  }



  resetFilterForm(){
    this.filterform.reset();
    let formdata = this.filterform.value;
    this.data.category = formdata?.category;
    this.data.status = formdata?.status;
    this.getfaq(this.data);
    this.ngOnInit()
  }
  editfaq(faqdata: any) {
    this.activeIndex = 0;
    this.btntxt = "Update";
    this.faqName="Update Faq queries"

    this.service
    .getFAQCategories({ page: 1, perpage: 10000,usertype:faqdata.usertype,status:1 })
    .subscribe((response) => {
      this.faqcategorielists = [];
      this.faqcategorielists = response.data;
    });
    this.form.patchValue({
      question: faqdata.question,
      answer: faqdata.answer,
      categoryid: faqdata.categoryid,
      status: faqdata.status==1? '1':'0',
      id: faqdata.id,
      usertype: faqdata.usertype ? faqdata.usertype.split(',').map(Number) : []
    });
  }
  statuses: Status[] | any;
  ngOnInit(): void {
    this.getfaq(this.data);
    // this.getCategorydropdown();
    this.statuses = [
      { name: "Active", id: '1' },
      { name: "De-Active", id: '0' },
    ];
    this.usertypefortutorial=[
      {id:1,usertype:"Student User"},
      {id:2,usertype:"Partner User"},
    ]
  }
  faqcategorielists: any[] = [];
  getFaqCatListFilter:any[]=[];
  getCategory(){
    this.getfaqcategories();
  }

  // getCategorydropdown() {
  //   this.service.getFAQCategory().subscribe((response) => {
  //     console.log(response);
  //     this.category_dropdown = [{ id: null, name: "Select" }, ...response];
  //   });
  // }
  getfaqcategories() {
    const usertypeArray: number[] = this.form.value.usertype; 
    const usertypeString: string = usertypeArray.join(','); 
    if(!usertypeString){
      this.faqcategorielists = [];
      return;
    }
    this.service
      .getFAQCategories({ page: 1, perpage: 10000,usertype:usertypeString })
      .subscribe((response) => {
        this.faqcategorielists = [];
        this.faqcategorielists = response.data;
      });
  }
  getCategoryFilter(){
    const usertypeArray: number[] = this.filterform.value.usertype; 
    const usertypeString: string = usertypeArray.join(','); 
    if(!usertypeString){
      this.getFaqCatListFilter = [];
      return;
    }
    this.service
      .getFAQCategories({ page: 1, perpage: 10000,usertype:usertypeString })
      .subscribe((response) => {
        this.getFaqCatListFilter = [];
        this.getFaqCatListFilter = response.data;
      });
  }
  faqlists: any[] = [];
  getfaq(data: any) {
    this.service.getFAQ(data).subscribe((response) => {
      this.faqlists = [];
      this.faqlists = response.data;
      this.datacount = response.count;
    });
  }
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    let formdata = this.filterform.value;
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize,
      category:formdata?.category,
      status:formdata?.status
    };
    this.getfaq(this.data);
  }
  btntxt = "Add";
  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.btntxt == "Add") {
      const usertypeArray: number[] = this.form.value.usertype; 
      const usertypeString: string = usertypeArray.join(','); 
      this.form.controls['usertype'].setValue(usertypeString);
      this.service.AddFAQ(this.form.value,).subscribe((response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "FAQ Added Successfully",
        });
        this.submitted = false;
        this.form.reset();
        this.activeIndex = -1;
        this.getfaq(this.data);
      });
    } else {
      const usertypeArray: number[] = this.form.value.usertype; 
      const usertypeString: string = usertypeArray.join(','); 
      this.form.controls['usertype'].setValue(usertypeString);
      this.service.UpdateFAQ(this.form.value).subscribe((response) => {
        this.btntxt = "Add";
        this.faqName="Add Faq queries"
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "FAQ Updated Successfully",
        });
        this.submitted = false;
        this.form.reset();
        this.activeIndex = -1;
        this.getfaq(this.data);
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
    this.service.faqQuerExport().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }
}
