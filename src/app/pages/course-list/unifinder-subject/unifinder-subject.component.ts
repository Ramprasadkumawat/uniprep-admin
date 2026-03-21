import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseListService } from '../course-list.service';
import { MessageService } from 'primeng/api';
import { ScrollTop } from 'primeng/scrolltop';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-unifinder-subject',
    templateUrl: './unifinder-subject.component.html',
    styleUrls: ['./unifinder-subject.component.scss'],
    standalone: false
})
export class UnifinderSubjectComponent implements OnInit {
  title = "Add Subject";
  activeIndex: number = -1;
  btntxt: string = 'Add Category';
  public subjectCategoryForm: any = FormGroup;
  submitted: boolean = false;
  public subjectForm: any = FormGroup;
  submission: boolean = false;
  subjectName: any = [];
  btn2txt: string = 'Add Subject';
  pageSize: number = 100;
  page: number = 1;
  @ViewChild('scrollTopButton') scrollTopButton: ScrollTop;
  subjectListData: any = [];
  totalSubjects: number = 0;
  public filterSubject: any = FormGroup;
  subjectCategory: any = [];

  constructor(private service: CourseListService, private toastr: MessageService, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef,) {
    this.subjectCategoryForm = fb.group({
      category_name: ['', [Validators.required]],
      id:new FormControl()
    });
    this.subjectForm = fb.group({
      category_id: ['', [Validators.required]],
      subject_name: ['', [Validators.required]],
      id:new FormControl()
    })
    this.filterSubject = fb.group({
      category: [""],
      subject: [""]
    });
  }

  ngOnInit(): void {
    this.getSelectBoxValues();
    this.getSubjectsList();
  }
  submitCategoryForm() {
    if (this.subjectCategoryForm.invalid) {
      this.submitted = true;
      return;
    }
    const formvalues = this.subjectCategoryForm.value;
    if (this.btntxt == "Add Category") {
      this.service.addSubjectCategory(formvalues).subscribe(res => {
        this.toastr.add({ severity: 'success', summary: res.status, detail: res.message });
        (error: any) => {
          this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
        }
      });
    }
    else {
      const formvalues = this.subjectCategoryForm.value;
      const subjectCatID = localStorage.getItem("subjectCategoryID");
      formvalues.category_id = subjectCatID;
      this.service.updateSubjectCategory(formvalues).subscribe(res => {
        this.toastr.add({ severity:'success', summary: res.status, detail: res.message });

        (error: any) => {
          this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
        }
      });
    }
    this.getSelectBoxValues();
    this.cdr.detectChanges();
    this.getSubjectsList();
    this.subjectCategoryForm.reset();
    this.submitted = false;
    this.btntxt = "Add Category";
    this.title = "Add Subject";
  }
  getSelectBoxValues() {
    this.service.getSelectBoxValues().subscribe(response => {
      this.subjectName = response.subject;
    });
  }
  submitSubjectForm() {
    if (this.subjectForm.invalid) {
      this.submission = true;
      return;
    }
    const formvalues = this.subjectForm.value;
    if (this.btn2txt == "Add Subject") {
      this.service.storeSubjects(formvalues).subscribe(res => {
        this.toastr.add({ severity: 'success', summary: res.status, detail: res.message });
        (error: any) => {
          this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
        }
      });
    }
    else {
      const formvalues = this.subjectForm.value;
      const subjectID = localStorage.getItem("subjectID");
      formvalues.id = subjectID;
      this.service.updateSubject(formvalues).subscribe(res => {
        this.toastr.add({ severity: 'success', summary: res.status, detail: res.message });
        (error: any) => {
          this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
        }
      });
    }
    this.cdr.detectChanges();
    this.getSubjectsList();
    this.subjectForm.reset();
    this.subjectCategoryForm.reset();
    this.btntxt = "Add Category";
    this.btn2txt = "Add Subject";
  }
  reset() {
    this.submitted = false;
    this.subjectCategoryForm.reset();
        this.subjectForm.reset();
    this.btntxt = "Add Category";
    this.btn2txt = "Add Subject";
  }
  getSubjectsList() {
    const formValues = this.filterSubject.value;
    let data = {
      category: formValues.category ? formValues.category : "",
      subject: formValues.subject ? formValues.subject : "",
      page: this.page,
      perPage: this.pageSize
    };
    this.service.fetchSubjectList(data).subscribe(res => {
      this.subjectListData = res.data;
      this.totalSubjects = res.count;
    });
  }
  scrollToTop() {
    this.scrollTopButton.onClick();
  }
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = (event.first / event.rows + 1);
    }
    else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.getSubjectsList();
  }
  subjectOnChange(data: any) {
    const sub = { category_id: data }
    this.service.getSubjects(sub).subscribe(response => {
      this.subjectCategory = response;
    })
  }
  submitFilterForm() {
    this.getSubjectsList();
  }
  filterReset() {
    this.filterSubject.reset();
    this.page = 1;
    this.pageSize = 100;
    this.activeIndex = -1;
    this.getSubjectsList();
  }
  redirectToCourse() {
    this.router.navigate(['course-list'])
  }
  Editsubject(subjectData: any) {
    const SubjectID = subjectData.subject_id;
    const subCategoryID = subjectData.category_id;
    localStorage.setItem("subjectID", SubjectID);
    localStorage.setItem("subjectCategoryID", subCategoryID);
    this.scrollToTop();
    this.btntxt = "Update Category";
    this.btn2txt = "Update Subject";
    this.title = "Update Category";
    this.activeIndex = 0;
    this.getSubjectsList();

    this.subjectCategoryForm = this.fb.group({
      category_name: [subjectData.category_name, [Validators.required]],
    })
    this.subjectForm = this.fb.group({
      subject_name: [subjectData.subject_name, [Validators.required]],
      category_id: [subjectData.category_id, [Validators.required]],
    });
 
  }
  Deletesubject(Id: number) {
    let deleteId = {
      subject_id: Id
    }
    this.service.deleteSubjects(deleteId).subscribe(res => {
      this.toastr.add({ severity: 'success', summary: res.status, detail: res.message });
      this.getSubjectsList();
      (error: any) => {
        this.toastr.add({severity:'error', summary: 'Error', detail: res.message});
      }
    });
  }
  exportSubjects() {
    const formValues = this.filterSubject.value;
    let data = {
      category: formValues.category ? formValues.category : "",
      subject: formValues.subject ? formValues.subject : "",
      page: this.page,
      perPage: this.pageSize
    };
    this.service.exportSubject(data).subscribe(res => {
      if (res.link) {
        window.open(res.link, '_blank');
      }
    });
  }
}
