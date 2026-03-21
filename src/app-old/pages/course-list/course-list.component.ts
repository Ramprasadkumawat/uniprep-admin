import { Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { CourseListService } from './course-list.service';
import { MessageService, SelectItem } from "primeng/api";
import { ScrollTop } from 'primeng/scrolltop';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
    standalone: false
})
export class CourseListComponent implements OnInit {
  @ViewChild('scrollTopButton') scrollTopButton: ScrollTop;
  form: FormGroup;
  filterForm: FormGroup;
  title = "Add Course";
  btntxt:string = 'Add Category';
  activeIndex:number = -1;
  monthList:any = [{id:"Jan",name: "January"},{id:"Feb",name: "February"},{id:"Mar",name: "March"},{id:"Apr",name: "April"},{id:"May ",name: "May"},{id:"Jun",name: "June"},{id:"Jul",name: "July"},{id:"Aug",name: "August"},{id:"Sep",name: "September"},{id:"Oct",name: "October"},{id:"Nov",name: "November"},{id:"Dec",name: "December"}];
  studyLevel: any = [{id:"UG",name: "UG"},{id:"PG", name:"PG"}];
  country: any = [];
  //courseName: any = [];
  locations: any = [];
  subjectName: any = [];
  subjectCategory:any=[];
  universityName: any = [];
  campusNames: any = [];
  submitted:boolean = false;
  courseListData: any = [];
  totalCourses: number = 0;
  pageSize:number =  100;
  page: number = 1;
 // fileUploadModal: boolean = false;
 fileUploadModal = "none";
  selectedFile: any;
  fileName: string = '';
  hideVisibility : boolean = true;
  courseName: any[] = [];   
  isLoading: boolean = false;  
  rows: number = 20;
  stayBack : any = [];
  durationName : any = [];
  worldRank: any = [{ id: "100", value: "Top 100" }, { id: "200", value: "Top 200" }, { id: "500", value: "Top 500" }, { id: null, value: "All Range" }];
  dragform: FormGroup;

  constructor(private fb: FormBuilder, private courseList: CourseListService, private toastr: MessageService,private router: Router) { 
    this.form = fb.group({
      course_name: ['', [Validators.required]],
      university_name: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
     // university_link: ['', [Validators.required]],
      country: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      campus: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
     // estd_year: [''],
      subject: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      duration: ['', [Validators.required]],
      intake: ['', [Validators.required]],
      stayback: ['', [Validators.required]],
     // world_rank: [''],
      course_link: ['', [Validators.required]],
      study_level: ['', [Validators.required]],
      subject_category: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      id:new FormControl()
    });

    this.filterForm = fb.group({
      course_name:[""],
      college_name:[""],
      country:[""],
      campus:[""],
      subject:[""],
      duration:[""],
      intake_months:[""],
      stay_back:[""],
    //  price_range:[""],
    //  world_rank:[""],
    });
    this.dragform = fb.group({
      dragexcel:['']
    })
   this. hideVisibility = false;
  }

  ngOnInit(): void {
    this.getSelectBoxValues();
    this.getCoursesList();
   
   // this.loadCoursesLazy({ first: 0, rows: this.rows });
  }

  getSelectBoxValues(){
    this.courseList.getSelectBoxValues().subscribe(response =>{
      this.country = response.country;
         //this.courseName = response.course_name;          
      this.courseName = response.course_name;
      this.campusNames = response.locations;
     this.subjectName = response.subject;
      this.universityName = response.university_name;
      this.stayBack = response.stay_back;
      this.durationName = response.duration;
    })     
  }
  loadCoursesLazy(event: any) {
    const { first, rows, filter } = event;
    this.isLoading = true;  // Show loading indicator
    // Call service to fetch paginated data
    this.courseList.getCourseName(first, rows, filter).subscribe(response => {
      this.courseName = [...this.courseName, ...response.data];       
      this.isLoading = false; 
    }, error => {
      console.error("Error loading courses", error);
      this.isLoading = false;
    });
  }
  getCoursesList(){
    const formValues = this.filterForm.value;
    let data = {
      course_keyword: formValues.course_name ? formValues.course_name : "",
      college_name: formValues.college_name ? formValues.college_name : "",
      country: formValues.country ? formValues.country : "",
      campus: formValues.campus ? formValues.campus : "",
      subject: formValues.subject ? formValues.subject : "",
      duration: formValues.duration ? formValues.duration : "",
      intake_months: formValues.intake_months ? formValues.intake_months : "",
      stay_back: formValues.stay_back ? formValues.stay_back : "",
     // world_rank: formValues.world_rank ? formValues.world_rank : "",
      page: this.page,
      perPage: this.pageSize
    };
    this.courseList.fetchCoursesList(data).subscribe(res =>{
      this.courseListData = res.data;           
      this.totalCourses = res.total_count;
    });
  }
  scrollToTop(){
    this.scrollTopButton.onClick();
  }
  submitForm(){
    if(this.form.invalid){
      this.submitted=true;
      return;
    }
    const formvalues = this.form.value;         
    if(this.btntxt == "Add Category"){
      this.courseList.addCourse(formvalues).subscribe(res =>{
        this.toastr.add({severity: res.status, summary: res.status, detail: res.message});
      });
    }else{
      const formvalues = this.form.value;
      const locationID = localStorage.getItem("locationID");     
    formvalues.campus = locationID;
      this.courseList.updateCourseListData(formvalues).subscribe(res =>{
        this.toastr.add({severity: res.status, summary: res.status, detail: res.message});
        this.getCoursesList();
      });
    }
    this.form.reset();
    this.submitted = false;
    this.btntxt = "Add Category";
    this.title = "Add Course";
  }
  DeleteCourse(courseId: number){
    let deleteId = {
      id: courseId
    }
    this.courseList.deleteCourse(deleteId).subscribe(res =>{
      this.toastr.add({severity: res.status, summary: res.status, detail: res.message});
      this.getCoursesList();
    });
  }
  reset(){
    this.submitted = false;
    this.form.reset();
    this.btntxt = "Add Category";
    this.title = "Add Course";
    this.locations = [];
  }
  get f() {
    return this.form.controls;
  }
  submitFilterForm(){
    this.getCoursesList();
  }
  filterReset(){
    this.filterForm.reset();
    this.page = 1;
    this.pageSize = 100;
    this.activeIndex = -1;
    this.getCoursesList();
  }
  pageChange(event: any){
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.getCoursesList();
  }
  EditCourses(courseData: any){
    this.scrollToTop();
    this.btntxt = "Update Category";
    this.title = "Update Course";
    this.activeIndex = 0;
    let campusList = this.campusNames.filter(item => item.country_id == courseData.country_id);
    this.locations = campusList;
    // this.form.patchValue({
    //   course_name: courseData.course_name,
    //   university_name: courseData.university_id,
    //  // university_link: courseData.university_url,
    //   country: courseData.country_id,
    // //  estd_year: courseData.estd_year,
    //   subject: courseData.subject_id,
    //   duration: courseData.duration,
    //   intake: courseData.intake_month.split(',').map(month => month.trim()),
    //   stayback: courseData.stay_back,
    //  // world_rank: courseData.world_rank,
    //   course_link: courseData.course_url,
    //   study_level: courseData.study_level,
    //   subject_category: courseData.category_id,
    //   id: courseData.id
    // });   
  const intakeArray = courseData.intake_month.split(',').map(month => month.trim()); 
  const intakeValues = intakeArray.map(month => {
    const foundMonth = this.monthList.find(item => item.name === month);
    return foundMonth ? foundMonth.id : null;
  }).filter(id => id !== null);
  // let intakeArray = [];
  // if (courseData.intake_month.includes(',')) {
  //   intakeArray = courseData.intake_month.split(',').map(month => month.trim()); // ["January", "September"]
  // } else {
  //   intakeArray = [courseData.intake_month.trim()];
  // } 
  // const intakeValues = intakeArray.map(month => {
  //   const foundMonth = this.monthList.find(item => item.name === month);
  //   return foundMonth ? foundMonth.id : null;
  // }).filter(id => id !== null);
    this.form = this.fb.group({
      course_name: [courseData.course_name,[Validators.required]],
      university_name: [courseData.university_id,[Validators.required]],
      country:[ courseData.country_id,[Validators.required]],
      campus:[ courseData.location_id,[Validators.required]],
      subject: [courseData.category_id,[Validators.required]],
      duration: [courseData.duration,  [Validators.required]],   
      stayback: [courseData.stay_back,[Validators.required]],
      course_link: [courseData.course_url, [Validators.required]],
      study_level: [courseData.study_level, [Validators.required]],
     // subject_category: [courseData.subject_category, [Validators.required]],
     subject_category: ['', [Validators.required]],
      intake: [intakeValues, [Validators.required]],
      id:courseData.id
     })
     localStorage.setItem("locationID",courseData.location_id)  
          const data={
      category_id: courseData.category_id
     }
    this.courseList. getSubjects(data).subscribe(response =>{
     this.subjectCategory = response;     
          setTimeout(() => {
      this.form.patchValue({
        subject_category: courseData.subject_id,
      });
    }, 500);          
    })
   
  }

  universityOnChange(event: any){
    if(/^\d+$/.test(this.form.value.university_name) != false && this.form.value.university_name){
      let CurrentUniversityId = this.universityName.filter(item => item.id === event.value)
         let campusList = this.campusNames.filter(item => item.country_id == CurrentUniversityId[0]['country_id']);
      this.locations = campusList;
      this.form.patchValue({
        campus: ""
      });
      this.form.patchValue({
        university_link: CurrentUniversityId[0]['university_url'],
        country: CurrentUniversityId[0]['country_id'],
      });

      setTimeout(() => {
        this.form.patchValue({
          campus: CurrentUniversityId[0]['location_id'],
        });
      }, 300);
    }else{
      this.form.patchValue({
        university_link: "",
        country: "",
        campus: "",
      });
    }
  }

  onEnterKeyPress(fieldName: string){
    var data = {};
    if(fieldName == "course"){
      if(!this.form.value.course_name){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.course_name) != true && this.form.value.course_name){
        data = {
          new_value: this.form.value.course_name,
          field_name: fieldName
        };
        this.courseList.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.courseName = res.course_name;
            setTimeout(() => {
              this.form.patchValue({
                course_name: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "university"){
      if(!this.form.value.university_name){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.university_name) != true && this.form.value.university_name){
        data = {
          new_value: this.form.value.university_name,
          field_name: fieldName
        };
        this.courseList.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.universityName = res.university_name;
            setTimeout(() => {
              this.form.patchValue({
                university_name: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "subject"){
      if(!this.form.value.subject){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.subject) != true && this.form.value.subject){
        data = {
          new_value: this.form.value.subject,
          field_name: fieldName
        };
        this.courseList.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.subjectName = res.subject_name;
            setTimeout(() => {
              this.form.patchValue({
                subject: res.id
              });
            }, 200);
          }
          this.toastr.add({ severity: res.status , summary: res.status, detail: res.message });
        })
      }
    }else if(fieldName == "location"){
      if(!this.form.value.campus){
        this.toastr.add({ severity: "error" , summary: "error", detail: "Please Type something" });
        return;
      }
      if(/^\d+$/.test(this.form.value.campus) != true && this.form.value.campus){
        data = {
          new_value: this.form.value.campus,
          field_name: fieldName,
          country_id: this.form.value.country
        };
        this.courseList.addNewSelectBoxValue(data).subscribe(res =>{
          if(res.status =="success"){
            this.locations = res.location_name;
            setTimeout(() => {
              this.form.patchValue({
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
    this.form.patchValue({
      campus: ""
    });
  }

  formEnter(event: any){
    event.preventDefault();
  }
    exportCourses(){

    const formValues = this.filterForm.value;
    let data = {
      course_keyword: formValues.course_name ? formValues.course_name : "",
      college_name: formValues.college_name ? formValues.college_name : "",
      country: formValues.country ? formValues.country : "",
      campus: formValues.campus ? formValues.campus : "",
      subject: formValues.subject ? formValues.subject : "",
      duration: formValues.duration ? formValues.duration : "",
      intake_months: formValues.intake_months ? formValues.intake_months : "",
      stay_back: formValues.stay_back ? formValues.stay_back : "",
    //  world_rank: formValues.world_rank ? formValues.world_rank : "",
      page: this.page,
      perPage: this.pageSize
    };

    this.courseList.exportCourse(data).subscribe(res =>{
      if(res.link){
        window.open(res.link, '_blank');
      }
    });
  }
  // onFileChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement?.files?.length) {
  //     this.selectedFile = inputElement.files[0];
  //   } else {
  //     this.selectedFile = null;
  //   }
  // }

  // uploadFile(){
  //   if (this.selectedFile) {
  //     const data = {input:this.selectedFile}
  //     this.courseList.import(data).subscribe((response) => {
  //         if(response.link){
  //           window.open(response.link, '_blank');
  //         }
  //         this.toastr.add({severity: response.status,summary: response.status,detail: response.message,});
  //         this.fileUploadModal = false;
  //         this.selectedFile = null;
  //         this.getCoursesList();
  //     });
  //   } else {
  //     this.toastr.add({severity: "error",summary: "Error",detail: "Please choose file!",});
  //   }
  // }
  handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        this.selectedFile = file;
        this.fileName = file.name;
      } else {
        alert('Only .csv file formats are supported for uploads.');
      }
    }
  }
  // onFileSelected(event: Event) {
   
  //   const input = event.target as HTMLInputElement;
  //   const files = input.files;
  //   this.handleFiles(files);
  //   if (input?.files?.length) {
  //     this.selectedFile = input.files[0];
  //   } else {
  //     this.selectedFile = null;
  //   }    
    
  // }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.handleFiles(files);
    this.hideVisibility =false;
    if (files && files.length) {
      this.selectedFile = files[0]; 
      this.fileName = this.selectedFile.name; 
    } else {
      this.selectedFile = null; 
      this.fileName = '';
    }
  }
  onDragOver(event: Event) {
    event.preventDefault();
    this.hideVisibility =false;
  }
  
  onFileDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.handleFiles(files);
    this.hideVisibility =false;
  }
  dragsubmit(){                  
    if (this.selectedFile) {
         let formData = new FormData();  
     formData.append('input', this.selectedFile);
      this.courseList.import(formData).subscribe((response:any) => {
        this.selectedFile = null;
        this.hideVisibility =true;
       
        this.toastr.add({ severity: 'success', summary: 'Success', detail: response.message });         
                 this.fileUploadModal = "none";       
          this.ngOnInit()
              });
    }     
  }
  universityRedirect(){
    this.router.navigate(['university-list']);
  }
  subjectOnChange(data:any){
 const sub={category_id :data}
    this.courseList. getSubjects(sub).subscribe(response =>{
     this.subjectCategory = response;    
          })
  }
  subjectRedirect(){
    this.router.navigate(['unifinder-subject']);
  }  
  closeFileModal() {    
    this.selectedFile = null;  
    this.fileUploadModal = "none";
}
openFileModal() {
 
  this. hideVisibility = true;
    this.fileUploadModal = "block";
}
}
