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
import { FaqCatService } from './faq-cat.service';
import { MultiSelectModule } from 'primeng/multiselect';
interface Status {
  name: string;
  id: number;
}

@Component({
    selector: 'uni-faq-cat',
    templateUrl: './faq-cat.component.html',
    styleUrls: ['./faq-cat.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, MultiSelectModule
    ],
    providers: [ConfirmationService]
})
export class FaqCatComponent implements OnInit {

  form: FormGroup;
  filterform: FormGroup;
  submitted = false;
  pageSize = 10;  
  activeIndex = -1;
  faqCatName="Add FAQ Category"
  usertypefortutorial: any = [];
  constructor(
      private fb: FormBuilder,
      private service:FaqCatService,
      private toastr: MessageService,
      private confirmationService: ConfirmationService,
      private http: HttpClient,

  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      status:['', [Validators.required]],
      id:new FormControl(),
      usertype:['', [Validators.required]]
    });
    this.filterform = fb.group({
      status: [""],
      name: [""],
      usertype:[""],
    });
  }
  submitFilterForm() {
    const formData = this.filterform.value;
    if (!formData.name && !formData.status && !formData.usertype) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let formdata = this.filterform.value;
    const usertypeArray: number[] = formdata?.usertype; 
    const usertypeString: string = usertypeArray.join(','); 
    this.data.name = formdata?.name;
    this.data.status = formdata?.status;
    this.data.usertype = usertypeString;
    this.getfaqcategories(this.data);
  }
  get f() {
    return this.form.controls;
  }
  reset() {
    this.form.reset();
  }
  resetFilter(){
    this.filterform.reset()
    let formdata = this.filterform.value;
    this.data.name = formdata?.name;
    this.data.status = formdata?.status;
    this.getfaqcategories(this.data);
  }
  statuses: Status[] | any;
  ngOnInit(): void {
    this.getfaqcategories(this.data);
    this.statuses = [
      { name: "Active", id: "1" },
      { name: "De-Active", id: "0"}
    ];
    this.usertypefortutorial=[
      {id:1,usertype:"Student User"},
      {id:2,usertype:"Partner User"},
    ]
  }
  editcat(categorydata:any){
    this.activeIndex=0;
    this.btntxt="Update Category";
    this.faqCatName="Update Faq catgory"
    this.form.patchValue({
      name:categorydata.name,
      status:categorydata.status==1? "1":"0",
      id:categorydata.id,
      usertype:categorydata.usertype.split(',').map(Number)
    })
  }
  btntxt="Add Category";
  faqcategorielists:any[]=[];
  getfaqcategories(data:any){
    this.service.getFAQCategories(data).subscribe((response) => {
      this.faqcategorielists=[];
      this.faqcategorielists=response.data;
      this.datacount=response.count;
    })
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
    let formdata = this.filterform.value;
    this.pageSize = event.rows;
    this.data = {
      page: this.page,
      perPage: this.pageSize,
      name:formdata?.name,
      status:formdata?.status
    }
    this.getfaqcategories(this.data);
  }
  submitForm() {
    if(this.form.invalid){
      this.submitted=true;
      return;
    }
    if(this.btntxt=="Add Category"){
      const usertypeArray: number[] = this.form.value.usertype; 
      const usertypeString: string = usertypeArray.join(','); 
    this.service.AddFAQCategories({name:this.form.value.name,status:this.form.value.status,usertype:usertypeString }).subscribe((response) => {
      this.toastr.add({
        severity: "success",
        summary: "Success",
        detail: "FAQ Category Added Successfully",
      });
      this.submitted=false;
    this.form.reset();
    this.getfaqcategories(this.data);
    this.activeIndex=-1;
    })}
    else {
      const usertypeArray: number[] = this.form.value.usertype; 
      const usertypeString: string = usertypeArray.join(','); 
      this.service.UpdateFAQCategories({id:this.form.value.id,name:this.form.value.name,status:this.form.value.status, usertype:usertypeString,}).subscribe((response) => {
        this.btntxt="Add Category";
        this.faqCatName="Add FAQ Category"
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "FAQ Category Updated Successfully",
        });
        this.submitted=false;
    this.form.reset();
    this.getfaqcategories(this.data);
    this.activeIndex=-1;
      })
    }
    
  }
  // delete(id: number) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       var data={
  //         id:id
  //       }
      
  //       this.service.DeleteFAQCategories(data).subscribe(() => {
  //         this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
  //         this.ngOnInit()
  //       });
  //       this.getfaqcategories(this.data);
  //     }
  //   });
  // }

  // export
  exportTable() {
    this.service.faqCatExport().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

}

