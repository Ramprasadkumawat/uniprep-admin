import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { FounderstoolService } from '../../founderstool/founderstool.service';
import { TravelToolsService } from '../travel-tools.service';
interface Status { 
  name: string;
  id: number;
}
@Component({
    selector: 'uni-travel-glossary',
    templateUrl: './travel-glossary.component.html',
    styleUrls: ['./travel-glossary.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, ConfirmDialogModule, PaginatorModule, DialogModule
    ],
    providers: [ConfirmationService]
})
export class TravelGlossaryComponent implements OnInit {
 form: FormGroup;
  filterForm:FormGroup;
  submitted = false;
  pageSize = 10;
  activeIndex = -1;
  datacount: number = 0;
  category_dropdown: { id: string, name: string }[] = [];
  glossaryName="Add Travel Glossary"
  fileUploadModal: boolean = false;
  selectedFile: any;
  get f() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private service: TravelToolsService,
    private toastr: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.form = fb.group({
      glossaryterm: ["", [Validators.required]],
      summary: ["", [Validators.required]],
      status: ["", [Validators.required]],
      alphabet:["",[Validators.required]],
      id: new FormControl(),
    });
    this.filterForm=fb.group({
      alphabet:[""],
      status:[""],
    })
  }

  reset() {
    this.form.reset();
  }
  resetFilter(){
    this.filterForm.reset();
    this.ngOnInit();
  }
  editInvestor(glossarydata: any) {
    this.activeIndex = 0;
    this.btntxt = "Update";
    this.glossaryName="Update Travel Glossary"
    this.form.patchValue({
      glossaryterm: glossarydata.glossaryterm,
      summary: glossarydata.summary,
      status: glossarydata.status==1? '1':'0',
      alphabet: glossarydata.alphabet,
      id: glossarydata.id,
    });
  }
  statuses: Status[] | any;
  ngOnInit(): void {
    this.category_dropdown=[
      {id:"1",name:"A"},
      {id:"1",name:"B"},
      {id:"1",name:"C"},
      {id:"1",name:"D"},
      {id:"1",name:"E"},
      {id:"1",name:"F"},
      {id:"1",name:"G"},
      {id:"1",name:"H"},
      {id:"1",name:"I"},
      {id:"1",name:"J"},
      {id:"1",name:"K"},
      {id:"1",name:"L"},
      {id:"1",name:"M"},
      {id:"1",name:"N"},
      {id:"1",name:"O"},
      {id:"1",name:"P"},
      {id:"1",name:"Q"},
      {id:"1",name:"R"},
      {id:"1",name:"S"},
      {id:"1",name:"T"},
      {id:"1",name:"U"},
      {id:"1",name:"V"},
      {id:"1",name:"W"},
      {id:"1",name:"X"},
      {id:"1",name:"Y"},
      {id:"1",name:"Z"},
    ]
    var data={
      page:1,
      perpage:10,
      alphabet:this.filterForm.value.alphabet,
      status:this.filterForm.value.status,
    }
    this.getInvestor(data);
    // this.getCategorydropdown();
    this.statuses = [
      { name: "Active", id: '1' },
      { name: "De-Active", id: '0' },
    ];
  }

  startupglossarylists: any[] = [];
  getInvestor(data: any) {
    this.service.getListStartUpGlossary(data).subscribe((response) => {
      this.startupglossarylists = [];
      this.startupglossarylists = response.travelglossary;
      this.datacount = response.count;
    });
  }
  filterSubmitForm(){
    let data = {
      page:1,
      perpage:10,
      alphabet:this.filterForm.value.alphabet,
      status:this.filterForm.value.status,
    }
    this.getInvestor(data);
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
      alphabet:this.filterForm.value.alphabet,
      status:this.filterForm.value.status,
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
      this.service.AddStartUpGlossary(this.form.value,).subscribe((response) => {
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
      this.service.UpdateStartUpGlossary(this.form.value).subscribe((response) => {
        this.btntxt = "Add";
        this.glossaryName="Add Travel Glossary"
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
    this.service.investorStartUpGlossary().subscribe((response) => {
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
}
