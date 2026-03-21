import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserFacadeService } from '../../users/user-facade.service';
import { Router } from '@angular/router';
import { AddtutorialService } from '../../addtutorials/addtutorial.service';
import { HttpClient } from '@angular/common/http';
import { FounderstoolService } from '../founderstool.service';
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
    selector: 'uni-addacademicvedio',
    templateUrl: './addacademicvedio.component.html',
    styleUrls: ['./addacademicvedio.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule
    ],
    providers: [ConfirmationService]
})
export class AddacademicvedioComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  form: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  academylist: any[] = [];
  btntxt = "Submit";
  namentxt="Add Founders Academy Vedio"
  activeIndex=1;
  perPage:number = 12;
  totalcount: number;
  pageno:number = 1;
  founderscat: any = [];
  
  constructor(private userFacade: UserFacadeService, private router: Router, private fb: FormBuilder,
    private http: HttpClient, private toastr: MessageService,private cdr: ChangeDetectorRef , private service:FounderstoolService,
    private confirmationService: ConfirmationService) {    
     this.form = this.fb.group({
    title: ['', [Validators.required],],
    link: ['', [Validators.required,linkFormatValidator()]],
    decription:[''],
    image:[''],
    id:[''],
    cat:['',[Validators.required]]
  });
  // this.filterForm = this.fb.group({
  //   usertype: [''],
  // });
 }

ngOnInit(): void {
  let data = {
    perpage : this.perPage,
    page : 1,
  }
  this.getAcademy(data);
  this.getFounderCategory()
}
getFounderCategory() {
  this.service.getFounderCategory().subscribe((res) => {  
    this.founderscat=[]   
      this.founderscat=res.data
  })

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
      category:this.form.value.cat
    }
    if (this.btntxt == "Submit") {
      this.service.addFound(data).subscribe((res) => {
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
        id:this.form.value.id,
        coverimage:this.document,
        description:this.form.value.decription,
        category:this.form.value.cat
      }
      this.service.editAcademy(updatedata).subscribe((res)=>{
            if (res) {
              this.toastr.add({ severity: 'success', summary: 'Success', detail: res.message });
              this.ngOnInit()
              this.form.reset()
              this.btntxt = "Submit";
              this.namentxt="Add Founders Academy Vedio"             
              this.submitted = false;
              this.document=""
            }
          })
    }
    }
}

getAcademy(data:any) {
  this.service.getlistAcademy(data).subscribe((res) => {  
    this.academylist=[]   
      this.totalcount=res.count
      this.academylist=res.founders
      res.founders.forEach(ele => {
        var bindingdata={
          category:ele.category,
          category_name:ele.category_name,
          coverimage:ele.coverimage,
          description:ele.description,
          id:ele.id,
          link:ele.link,
          status:ele.status,
          title:ele.title,
        }
        this.academylist.push(bindingdata)
      });
  })

}
edittutorialdetails(eve:any){
  this.cdr.detectChanges();
  console.log(eve);
  
  this.activeIndex = 0;
  this.btntxt = "Update"; 
  this.namentxt="Update Founders Academy Vedio"  
  this.form.patchValue({
    link:eve.link,
    title:eve.title,
    id:eve.id,
    decription:eve.description,
    cat:parseInt(eve.category),
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
deleteAcademylist(eve:any){
  this.confirmationService.confirm({
    message: 'Do you want to delete this record?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptButtonStyleClass:"btn-primary",
    rejectButtonStyleClass:"btn-primary",
    accept: () => {
      var data={
        id:eve.id
      }
      this.service.deleteAcademy(data).subscribe((res) => {
        this.toastr.add({severity: 'success', summary: 'Success', detail: 'Removed Successfully'});
        this.btntxt = "Submit";
        this.namentxt="Add Founders Academy Vedio"
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
  }
  this.getAcademy(data);
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
// submitFilterForm(){
//   let data = {
//     perpage : this.perPage,
//     page : 1,
//     usertype:this.filterForm.value.usertype
//   }
//   this.getTutorial(data);
// }
filterReset(){
  this.filterForm.reset();
  this.ngOnInit();
}
}
