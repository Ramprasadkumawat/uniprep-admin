import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { FounderstoolService } from '../founderstool.service';
import { DatasetController } from 'chart.js';

@Component({
    selector: 'uni-entrepreneurskilltest',
    templateUrl: './entrepreneurskilltest.component.html',
    styleUrls: ['./entrepreneurskilltest.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, DialogModule, ConfirmPopupModule
    ],
    providers: [ConfirmationService]
})
export class EntrepreneurskilltestComponent implements OnInit {
  categoryCount:number=0;
  rows: number = 20;
  form: FormGroup;
  btntxt="Add"
  submitted: boolean = false;
  moduleID:number=17;
  @ViewChild('fileInputicon') fileInputicon: ElementRef;
  constructor(  private fb: FormBuilder,    private toastr: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,private service: FounderstoolService,) { 
    this.form = this.fb.group({
      submodulename: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      id:[''],
      icon:['']
    });
  }

  ngOnInit(): void {
    var data={
      page:1,
      perpage:10,
      module_id :this.moduleID
    }
    this.getEntreprenuer(data);
  }
  get f() {
    return this.form.controls;
  }
  page: number = 1;
  pageno:number = 1;
  perPage:number = 10;
  pageChange(event:any){
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      perpage : this.perPage,
      page : event.page + 1,
      module_id :this.moduleID
    }
    this.getEntreprenuer(data)
  }
  submitForm(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.btntxt == "Add") {
      var data={
        module_id:this.moduleID,
        urlslug:this.form.value.urlslug,
        submodulename:this.form.value.submodulename,
        icon:this.icondoc
      }
      this.service.AddEntreprenuerTest(data).subscribe((response) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.submitted = false;
        this.form.reset();
        this.icondoc="";
        this.ngOnInit();
      });
    } else {
      var data1={
        module_id:this.moduleID,
        urlslug:this.form.value.urlslug,
        submodulename:this.form.value.submodulename,
        id:this.form.value.id,
        icon:this.icondoc
      }
      this.service.UpdateEntreprenuerTest(data1).subscribe((response) => {
        this.btntxt = "Add";
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.submitted = false;
        this.form.reset();
        this.icondoc="";
        this.ngOnInit();
      });
    }
  }
  etreprenuertestlists: any[] = [];
  getEntreprenuer(data:any){
    this.service.getEntreprenuerTest(data).subscribe((response) => {
      this.etreprenuertestlists = [];
      this.etreprenuertestlists = response.data;
      this.categoryCount = response.count;
    });
  }
  resetForm(){

  }
  navigate(list:any){
    localStorage.setItem("etreprenuersubid",list.id)
    localStorage.setItem("entrepreneurmoduleid",this.moduleID.toString())
    this.router.navigate(['/entrprenueurquiz'])
  }
  editCategory(list:any){
    this.btntxt = "Update";
    this.form.patchValue({
      submodulename: list.submodule_name,
      urlslug: list.urlslug,
      id: list.id,
    });
     // patch icon
     const urlPartsicon = list.icon.split('/');
     const filenameicon = urlPartsicon[urlPartsicon.length - 1];
         // Fetch the remote file
   fetch(list.icon)
   .then(response => response.blob())
   .then(blob => {
     // Create a File object with the extracted filename
     const file = new File([blob], filenameicon, {
       type: blob.type,
       lastModified: new Date().getTime()
     });
     // Now, 'file' is a File object with a dynamic name
     this.icondoc = file
     this.form.controls.icon.setValue(this.icondoc);
   })
   .catch(error => {
     console.error('Error fetching the file:', error);
   });
  }
  deleteCategory(list:any){
    let data = {
      submodule_id: list.id,
      module_id:this.moduleID
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + list.submodule_name + "Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.service.DeleteEntreprenuerTest(data).subscribe((response) => {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message, });
        });
        this.ngOnInit();
      },
      reject: () => {
        this.toastr.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
      },
    });
  }
  icondoc:any;
  async onFileChangeIcon(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.icondoc = file;
      const fileInput = this.fileInputicon.nativeElement;
    }
    this.form.controls.icon.setValue(this.icondoc);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];

  }
}
