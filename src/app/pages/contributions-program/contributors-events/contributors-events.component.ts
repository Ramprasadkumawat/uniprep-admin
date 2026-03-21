import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContributionsService } from '../contributions-program.service';
import { MessageService } from 'primeng/api';
export interface DropDown{
  id: number;
  value: string
}

export interface FormValues{
  name: string,
  type: number,
  image: File,
  status: number
}

@Component({
    selector: 'uni-contributors-events',
    templateUrl: './contributors-events.component.html',
    styleUrls: ['./contributors-events.component.scss'],
    standalone: false
})
export class ContributorsEventsComponent implements OnInit {
  form: FormGroup;
  FilterForm: FormGroup;
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('filterFormElement') filterFormElement!: ElementRef;
  activeIndex: number = -1;
  filterActiveIndex: number = -1;
  eventId: number = 0;
  submitted: boolean = false;
  selectedFile:any;
  eventCount:number = 0;
  page: number = 1;
  pageSize: number = 20;
  eventListData: any = [];
  editImage: string = "";
  contributionsCollegeList: any[] = [];
  eventType: DropDown[] = [
    {
      id: 1,
      value: "Faculty Event"
    },
    {
      id: 2,
      value: "Student Event"
    }
  ];
  cardStatus:DropDown[] = [
    {
      id: 1,
      value: "Active"
    },
    {
      id: 2,
      value: "Inactive"
    }
  ];

  constructor(
    private fb: FormBuilder,
    private mainService: ContributionsService,
    private toaster: MessageService
  ) { 
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      status: ['', [Validators.required]],
      college: [''],
    });

    this.FilterForm = this.fb.group({
      name: [''],
      type: [''],
      status: [''],
      college: ['']
    });

  }

  ngOnInit(): void {
    this.eventList();
    this.getContributorCollegeList();
  }

  filterFormSubmit(){
    this.eventList();
  }

  eventList(){
    let filterFormValues = this.FilterForm.value;
    let data: any = {
      page: this.page,
      perpage: this.pageSize,
      ...filterFormValues
    };
    this.mainService.listOfEvents(data).subscribe({
      next: response =>{
        this.eventListData = response.data;
        this.eventCount = response.count;
      }
    })
  }

  getContributorCollegeList() {
    this.mainService.getContributorCollegeList({}).subscribe({
      next: response => {
        this.contributionsCollegeList = response.data;
        console.log(this.contributionsCollegeList,"contributors college list");
      },
      error: err => {
        console.log(err?.message);
      }
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    // Create FormData and append fields
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('type', this.form.get('type')?.value);
    formData.append('status', this.form.get('status')?.value);
    formData.append('college_id', this.form.get('college')?.value);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Append actual file, not just its name
    }

    // Send formData to backend
    if(this.eventId){
      formData.append('id', this.eventId.toString());
      if(!this.selectedFile){ //if user not select the new image
        formData.append('image', this.form.get('image')?.value);
      }
      this.mainService.updateEvents(formData).subscribe({
        next: response =>{
          this.resetForm();
          this.eventList();
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.activeIndex = -1;
        }
      });
    }else{
      this.mainService.insertEvents(formData).subscribe({
        next: response => {
          this.resetForm();
          this.eventList();
          this.toaster.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.activeIndex = -1;
        }
      });
    }
  }
  
  resetForm() {
    this.form.reset();
    this.eventId = 0;
    this.formElm?.nativeElement?.reset();
    this.submitted = false;
    this.editImage = "";
  }

  resetFilterForm(){
    this.FilterForm.reset();
    this.filterFormElement?.nativeElement?.reset();
  }

  get f() {
    return this.form.controls;
  }

  onFileChange(event: Event) {
    this.editImage = "";
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      
      this.form.patchValue({
        image: this.selectedFile.name,
      });
    } else {
      this.selectedFile = null;
    }
  }

  exportEvent(){
    let data: any = {
      page: this.page,
      perpage: this.pageSize
    };

    this.mainService.exportEvents(data).subscribe({
      next: response =>{
        this.mainService.downloadFile(response.link).subscribe((blob) => {
          const a = document.createElement("a");
          const objectUrl = window.URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = "constributor-event.csv";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(objectUrl);
          document.body.removeChild(a);
        });
      }
    })
  }

  editEvent(editData: any){
    this.eventId =  editData.id;
    this.form.patchValue({
      name: editData.name,
      image: editData.image,
      status: editData.status == "Active" ? 1 : 2,
      type: editData.type == "Faculty Event" ? 1 : 2,
      college: editData.college_id
    })
    this.editImage = editData.image_name;
    this.activeIndex = 0;
  }

  pageChange(event: any){
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.eventList();
  }
}
