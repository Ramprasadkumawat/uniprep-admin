import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CourseListService } from '../course-list.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
    selector: 'uni-university-list',
    templateUrl: './university-list.component.html',
    styleUrls: ['./university-list.component.scss'],
    standalone: false
})
export class UniversityListComponent implements OnInit {
  
  activeIndex:number = -1;
  public addUniversityForm : any= FormGroup;
  universityName: any = [];
  country : any = [];
  campusNames:any= [];
  locations:any= [];
  courseName: any[] = [];  
  subjectName: any = []; 
  btntxt:string = 'Add University';
  title :string = 'Add University';
  submitted: boolean = false;
  public filterUniversityForm : any = FormGroup;
  pageSize:number =  100;
  page: number = 1;
  universityListData: any = []; 
  totalUniversities:  number = 0; 
  worldRank: any = [{ id: "100", value: "Top 100" }, { id: "200", value: "Top 200" }, { id: "500", value: "Top 500" }, { id: null, value: "All Range" }];
  @ViewChild('scrollTopButton') scrollTopButton: ScrollTop;
  fileUploadModal :boolean =false;
  selectedFile: any;
  editImage: any;
  @ViewChild('formElm') formElm!: ElementRef;
  
  constructor(private service:CourseListService,private toastr: MessageService,public fb: FormBuilder,private router:Router) {
   this.editImage = "";
    this.addUniversityForm = fb.group({     
      university_name: ['', [Validators.required]],
      university_link: ['', [Validators.required]],
      country: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      campus: ['', [Validators.required]],
      estd_year: ['', [Validators.required]],     
      world_rank:['', [Validators.required]],  
      university_logo: ['', [Validators.required]],
       id:new FormControl()
    });
    this.filterUniversityForm = fb.group({     
     university_name:[""],
      country:[""],
      location:[""],    
    //  world_rank:[""],
    });
   }

  ngOnInit(): void {
   this.getSelectBoxValues();
   this.getUniversityList();
  }

  get f() {
    return this.addUniversityForm.controls;
  }
  onEnterKeyPress(fieldName: string){
    var data = {};
    if(fieldName == "course"){
      if(!this.addUniversityForm.value.course_name){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.addUniversityForm.value.course_name) != true && this.addUniversityForm.value.course_name){
        data = {
          new_value: this.addUniversityForm.value.course_name,
          field_name: fieldName
        };
        this.service.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.courseName = res.course_name;
            setTimeout(() => {
              this.addUniversityForm.patchValue({
                course_name: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "university"){
      if(!this.addUniversityForm.value.university_name){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.addUniversityForm.value.university_name) != true && this.addUniversityForm.value.university_name){
        data = {
          new_value: this.addUniversityForm.value.university_name,
          field_name: fieldName
        };
        this.service.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.universityName = res.university_name;
            setTimeout(() => {
              this.addUniversityForm.patchValue({
                university_name: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "subject"){
      if(!this.addUniversityForm.value.subject){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.addUniversityForm.value.subject) != true && this.addUniversityForm.value.subject){
        data = {
          new_value: this.addUniversityForm.value.subject,
          field_name: fieldName
        };
        this.service.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.subjectName = res.subject_name;
            setTimeout(() => {
              this.addUniversityForm.patchValue({
                subject: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "location"){
      if(!this.addUniversityForm.value.campus){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.addUniversityForm.value.campus) != true && this.addUniversityForm.value.campus){
        data = {
          new_value: this.addUniversityForm.value.campus,
          field_name: fieldName,
          country_id: this.addUniversityForm.value.country
        };
        this.service.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.locations = res.location_name;
            setTimeout(() => {
              this.addUniversityForm.patchValue({
                campus: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }
  }
  countryOnChange(event: any){
    let campusList = this.campusNames.filter(item => item.country_id == event.value);
    this.locations = campusList;
    this.addUniversityForm.patchValue({
      campus: ""
    });
  }
  getSelectBoxValues(){
    this.service.getSelectBoxValues().subscribe(response =>{
      this.country = response.country;             
      this.campusNames = response.locations;   
    
      
    })
  }
  formEnter(event: any){
    event.preventDefault();
  }
  reset(){
    this.submitted = false;
    this.addUniversityForm.reset();
    this.btntxt = "Add University";
    this.title = "Add University";
    this.locations = [];
    this.editImage="";
  }
  
   submitForm() {     
    this.submitted = true;
    const formvalues = this.addUniversityForm.value;
    if(this.btntxt == "Add University"){
        this.service.addUniversity({
            ...this.addUniversityForm.value, university_logo: this.selectedFile         
        }).subscribe((response) => {
          // this.toastr.add({severity: response.status, summary: response.status, detail: response.message});
            this.submitted = false;
            this.addUniversityForm.reset();          
            this.getUniversityList();
            this.toastr.add({ severity:'success', summary: 'Success', detail: response.message });
            (error: any) => {
              this.toastr.add({severity:'error', summary: 'Error', detail: response.message});
            }
        });
      }else{          
        this.service.editUniversity(  {...this.addUniversityForm.value, university_logo: this.selectedFile}).subscribe(res =>{         
        
             this.addUniversityForm.reset();
             this.editImage = "";
            this.getUniversityList();
            this.toastr.add({ severity:'success', summary: 'Success', detail: res.message });
          (error: any) => {
            this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
          }
        });
      }    
      this.submitted = false;
      this.btntxt = "Add University";
      this.title = "Add University";         
}
filterUniversity:any[]=[];
  getUniversityList(){
    const formValues = this.filterUniversityForm.value;
    let data = {
     // course_name: formValues.course_name ? formValues.course_name : "",
      university_name: formValues.university_name ? formValues.university_name : "",
      country: formValues.country ? formValues.country : "",
      location: formValues.location ? formValues.location : "",
     // subject: formValues.subject ? formValues.subject : "",
    
     // world_rank: formValues.world_rank ? formValues.world_rank : "",
      page: this.page,
      perPage: this.pageSize
    };
    this.service.fetchUniversityList(data).subscribe(res =>{          
      this.universityListData = res.data;
      this.totalUniversities = res.university_count;
      this.filterUniversity = this.universityListData.map(university => ({
        id: university.id,
        university_name: university.university_name
      }));        
    });
  }
  submitFilterForm(){
    this.getUniversityList();

  }
  filterReset(){
    this.filterUniversityForm.reset();
    this.page = 1;
    this.pageSize = 100;
    this.activeIndex = -1;
    this.getUniversityList();
  }
  courseRedirect(){
    this.router.navigate(['course-list']);
  }
  scrollToTop(){
    this.scrollTopButton.onClick();
  }
  EditUniversity(universityData: any){
const universityID =universityData.id;
    localStorage.setItem("editID",universityID)       
    this.scrollToTop();
    this.btntxt = "Update University";
    this.title = "Update University";
    this.activeIndex = 0;   
this.editImage = universityData.university_logo;    
         this.addUniversityForm = this.fb.group({
          university_name: [universityData.university_name,[Validators.required]],
          university_link: [universityData.university_url,[Validators.required]],
          country:[ universityData.country_id,[Validators.required]],
          estd_year: [universityData.estd_year,[Validators.required]],
          campus: [universityData.location_name,  [Validators.required]],   
          world_rank: [universityData.world_rank,[Validators.required]],
          university_logo: [universityData.university_logo, [Validators.required]],
          
         })
 
  }
  DeleteUniversity(universityId: number){
    let deleteId = {
      university_id: universityId
    }        
    this.service.deleteUniversity(deleteId.university_id).subscribe(res =>{
      this.toastr.add({severity: 'success', summary: res.status, detail: res.message});
      this.getUniversityList();
      (error: any) => {
        this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
      }
    });
  }
  
  pageChange(event: any){

    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.getUniversityList();
  }
  exportUniversity(){
  
    
    const formValues = this.filterUniversityForm.value;
    let data = {
      university_name: formValues.university_name ? formValues.university_name : "",
    
      country: formValues.country ? formValues.country : "",
      location: formValues.location ? formValues.location : "",
      // subject: formValues.subject ? formValues.subject : "",
      // duration: formValues.duration ? formValues.duration : "",
      // intake_months: formValues.intake_months ? formValues.intake_months : "",
      // stay_back: formValues.stay_back ? formValues.stay_back : "",
    //  world_rank: formValues.world_rank ? formValues.world_rank : "",
      page: this.page,
      perPage: this.pageSize
    };

    this.service.exportUniversity(data).subscribe(res =>{
      if(res.link){
        window.open(res.link, '_blank');
      }
    });
 
}
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
        this.selectedFile = inputElement.files[0];
        this.addUniversityForm.patchValue({
            university_logo: this.selectedFile.name,
        });
    } else {
        this.selectedFile = null;
    }
}
}
  // universityOnChange(event: any){
  //   if(/^\d+$/.test(this.addUniversityForm.value.university_name) != false && this.addUniversityForm.value.university_name){
  //     let CurrentUniversityId = this.universityName.filter(item => item.id === event.value)
  //     console.log(CurrentUniversityId);
  //     let campusList = this.campusNames.filter(item => item.country_id == CurrentUniversityId[0]['country_id']);
  //     this.locations = campusList;
  //     this.addUniversityForm.patchValue({
  //       campus: ""
  //     });
  //     this.addUniversityForm.patchValue({
  //       university_link: CurrentUniversityId[0]['university_url'],
  //       country: CurrentUniversityId[0]['country_id'],
  //     });

  //     setTimeout(() => {
  //       this.addUniversityForm.patchValue({
  //         campus: CurrentUniversityId[0]['location_id'],
  //       });
  //     }, 300);
  //   }else{
  //     this.addUniversityForm.patchValue({
  //       university_link: "",
  //       country: "",
  //       campus: "",
  //     });
  //   }
  // }
  

  // submitForm(){
  //   if(this.addUniversityForm.invalid){
  //     this.submitted=true;
  //     return;
  //   }
  //   const formvalues = this.addUniversityForm.value;
  //   console.log("FORM VALUES",formvalues);
    
  //   if(this.btntxt == "Add University"){
  //     // this.service.updateCourseListData(this.addUniversityForm.value, university_logo: this.selectedFile).subscribe(res =>{  
  //      this.service.addUniversity(formvalues).subscribe(res =>{
  //       this.toastr.add({severity: res.status, summary: res.status, detail: res.message});
  //     });
  //   }else{
  //     this.service.updateCourseListData(formvalues).subscribe(res =>{
  //       this.toastr.add({severity: res.status, summary: res.status, detail: res.message});
  //       //this.getUniversityList();
  //     });
  //   }
  //   this.addUniversityForm.reset();
  //   this.submitted = false;
  //   this.btntxt = "Add University";
  //   this.title = "Add University";
  // }