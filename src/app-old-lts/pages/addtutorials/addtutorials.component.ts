import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserFacadeService } from '../users/user-facade.service';
import { HttpClient } from '@angular/common/http';
// import { error } from 'console';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddtutorialService } from './addtutorial.service';
import { PaginatorModule } from 'primeng/paginator';

export function linkFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const linkPattern = /^(http|https):\/\/\w+/;

    if (!linkPattern.test(control.value)) {
      return { invalidLinkFormat: true };
    }

    return null;
  };
}
@Component({
    selector: 'uni-addtutorials',
    templateUrl: './addtutorials.component.html',
    styleUrls: ['./addtutorials.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule
    ],
    providers: [ConfirmationService]
})
export class AddtutorialsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  tutoriallist: any[] = [];
  btntxt = "Submit";
  namentxt="Add Tutorials"
  activeIndex=1;
  perPage:number = 12;
  totalcount: number;
  pageno:number = 1;
  usertypefortutorial: any = [];
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder,
    private http: HttpClient, private toastr: MessageService,private cdr: ChangeDetectorRef , private service:AddtutorialService,
    private confirmationService: ConfirmationService) {    
     this.form = this.fb.group({
    title: ['', [Validators.required],],
    link: ['', [Validators.required,linkFormatValidator()]],
    decription:['',[Validators.required]],
    image:[''],
    tutorialsid:[''],
    usertype:['',[Validators.required]]
  });
  this.filterForm = this.fb.group({
    usertype: [''],
  });
 }

ngOnInit(): void {
  this.usertypefortutorial=[
    {id:1,usertype:"Student User"},
    {id:2,usertype:"Partner User"},
  ]
  let data = {
    perpage : this.perPage,
    page : 1,
    usertype:this.filterForm.value.usertype
  }
  this.getTutorial(data)
}
get f() {
  return this.form.controls;
}


indextchange(eve:number){
  this.activeIndex = eve;
}
submitForm() {
  this.submitted = true;
  if (this.form.valid) {
    var data = {
      title: this.form.value.title,
      link: this.form.value.link,
      coverimage:this.document,
      description:this.form.value.decription,
      usertype:this.form.value.usertype
    }
    if (this.btntxt == "Submit") {
      this.service.addtutorials(data).subscribe((res) => {
        if (res) {
          this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
          this.ngOnInit()
          this.form.reset()
          this.submitted = false;
          this.document=""
        }
      })
    }else{
      var updatedata = {
        title: this.form.value.title,
        link: this.form.value.link,
        tutorialsid:this.form.value.tutorialsid,
        coverimage:this.document,
        description:this.form.value.decription,
        usertype:this.form.value.usertype
      }
      this.service.edittutorials(updatedata).subscribe((res)=>{
            if (res) {
              this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
              this.ngOnInit()
              this.form.reset()
              this.btntxt = "Submit";
              this.namentxt="Add Tutorials"             
              this.submitted = false;
              this.document=""
            }
          })
    }
    }
}

getTutorial(data:any) {
  this.service.getlisttutorial(data).subscribe((res) => {  
    this.tutoriallist=[]   
      this.totalcount=res.count
      this.tutoriallist=res.Tutorial
  })

}
edittutorialdetails(eve:any){
  this.cdr.detectChanges();
  this.activeIndex = 0;
  this.btntxt = "Update"; 
  this.namentxt="Update Tutorials"  
  this.form.patchValue({
    link:eve.link,
    title:eve.title,
    tutorialsid:eve.id,
    decription:eve.description,
    usertype:eve.usertype
  });
  const urlParts = eve.coverimage.split('/');
  const filename = urlParts[urlParts.length - 1];
  
  // Fetch the remote file
  fetch(eve.coverimage)
    .then(response => response.blob())
    .then(blob => {
      // Create a File object with the extracted filename
      const file = new File([blob], filename, {
        type: blob.type,
        lastModified: new Date().getTime()
      });

      // Now, 'file' is a File object with a dynamic name
      this.document = file
      this.form.controls.image.setValue(this.document);
    })
    .catch(error => {
      console.error('Error fetching the file:', error);
    });
}
deletetutorialist(eve:any){
  this.confirmationService.confirm({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptButtonStyleClass:"btn-primary",
    rejectButtonStyleClass:"btn-primary",
    accept: () => {
      var data={
        tutorialsid:eve.id
      }
      this.service.deleteTutorial(data).subscribe((res) => {
        this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
        this.ngOnInit()
      });
    }
  });
}
paginate(event: any){
  this.pageno = (event.page ?? 0) + 1; 
  this.perPage = event.rows ?? 10;
  let data = {
    perpage : this.perPage,
    page : event.page + 1,
    usertype:this.filterForm.value.usertype
  }
  this.getTutorial(data);
}
onDragOver(event: DragEvent) {
  event.preventDefault();
}
selectedFile: File | undefined;
document: any;
async onFileChange(event: any) {
  if (event.target.files.length > 0) {
    const file: File = event.target.files[0];
    this.document = file;
    const fileInput = this.fileInput.nativeElement;
  }
  this.form.controls.image.setValue(this.document);
}
submitFilterForm(){
  let data = {
    perpage : this.perPage,
    page : 1,
    usertype:this.filterForm.value.usertype
  }
  this.getTutorial(data);
}
filterReset(){
  this.filterForm.reset();
  this.ngOnInit();
}
}
