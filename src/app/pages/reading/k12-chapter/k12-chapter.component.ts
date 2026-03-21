import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReadingService} from "../reading.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {LocalStorageService} from "ngx-localstorage";
import {Location} from "@angular/common";

@Component({
    selector: 'uni-k12-chapter',
    templateUrl: './k12-chapter.component.html',
    styleUrls: ['./k12-chapter.component.scss'],
    standalone: false
})
export class K12ChapterComponent implements OnInit {
  storageSubjectData: any;
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  moduleId: number = 14;
  form: FormGroup;
  subModuleName: string = "K12 Chapter";
  filterForm: FormGroup;
  submitted: boolean = false;
  isAccordionSelected: boolean = false;
  categoryCount: number = 0;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  categoryDropdownList: any[] = [{id: null, name: "Select"}, {id: 1, name: "Yes"}, {id: 2, name: "No"}];
  suggestionList: any[] = [{id: null, name: "Select"}, {id: 1, name: "Actioned"}, {id: 2, name: "Non-Actioned"}];
  subModuleList: any = [];
  selectedFile: any;
  listOfSubmodules: any = [];
  categories: any = [];
  submodulePermission: number = 0;

  editImage: any;
  isEditClicked: boolean = false;
  subjectId: string | null = null;

  constructor(private fb: FormBuilder, private readingService: ReadingService, private route: ActivatedRoute,
              private toast: MessageService, private confirmationService: ConfirmationService,
              private router: Router, private _location: Location, private storage: LocalStorageService) {
    this.subjectId = this.route.snapshot.paramMap.get('subject_id');

    this.editImage = "";
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      submodulename: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    this.filterForm = this.fb.group({
      fromdate: [""],
      todate: [""],
      filter_category_id: [""],
      favourite: [""]
    });
  }

  ngOnInit(): void {
    this.storageSubjectData = this.storage.get<any>('subject-data');
    this.getSubModuleData();
    this.checkSubmoduleDeletePermission();
    this.getCategoryList();
  }


  getCategoryList() {
    this.readingService.getCategory().subscribe((response) => {
      this.categories = [{id: null, name: "Select"}, ...response];
    });
  }

  get f() {
    return this.form.controls;
  }

  checkSubmoduleDeletePermission() {
    this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
      this.submodulePermission = response.permission;
    });
  }

  url_slug: string;

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getSubModuleData();
  }

  submitForm() {
    if (this.isEditClicked) {
      this.updateSubCategory();
      return;
    }
    if (this.form.value.submodulename == '' || this.form.value.image == '' || this.form.value.urlslug == '') {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields!' });
      return;
    }
    this.submitted = true;
    this.readingService.addChapter({
      ...this.form.value, image: this.selectedFile,
      module_id: this.moduleId, status: 1, category_id: this.subjectId
    }).subscribe((response) => {
      this.toast.add({severity: 'success', summary: 'Success', detail: response.message});
      this.submitted = false;
      this.form.reset();
      this.formElm.nativeElement.reset();
      this.getSubModuleData();
    });
  }

  onClickSubmitFilter() {
    const formData = this.filterForm.value;
    if (!formData.fromdate && !formData.todate && !formData.favourite && !formData.filter_category_id) {
      this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
      return;
    } else {
      let req = {
        moduleId: Number(this.moduleId),
        page: this.page,
        perpage: this.rows,
        mode: 'admin',
        fromdate: formData.fromdate,
        todate: formData.todate,
        filter_category_id: formData.filter_category_id,
        favourite: formData.favourite,
      };
      this.readingService.getLearningCategories(req).subscribe((response) => {
        this.subModuleList = response.data;
        this.categoryCount = response.count;
        this.listOfSubmodules = response.data;
      });
    }
  }

  resetFilter() {
    this.form.reset();
    this.filterFormElm.nativeElement.reset();
    this.getSubModuleData();
  }

  getSubModuleData() {
    let req: any
    req = {
      module_id: Number(this.moduleId),
      page: this.page,
      perpage: this.rows,
      mode: 'admin',
      module_category_id: Number(this.subjectId)
    }
    this.readingService.getChapterListFromApi(req).subscribe((response) => {
      this.subModuleList = response.data;
      this.categoryCount = response.count;
    });
  }

  delete(Value: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to delete " + Value.submodule_name + " Submodule and Questions ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        let data = {
          module_id: this.moduleId,
          sub_category_id: Value.id,
          countryId: 0,
        };
        this.readingService.deleteCareerToolCategorySubject(data).subscribe((response) => {
          this.toast.add({severity: 'success', summary: 'Deleted', detail: response.message,});
        });

        this.getSubModuleData();
      },
      reject: () => {
        this.toast.add({severity: "error", summary: "Rejected", detail: "You have rejected",});
      },
    });
  }

  onFileChange(event: Event) {
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

  editSubCategoryName(item: any) {
      this.form.reset();
      this.editImage = item.icon;
      this.form = this.fb.group({
        id: [item.id, [Validators.required]],
        submodulename: [item.submodule, [Validators.required]],
        urlslug: [item.url_slug, [Validators.required]],
        image: [item.icon, [Validators.required]],
      });
      this.isAccordionSelected = true;
      this.isEditClicked = true;
  }

  updateSubCategory() {
    this.subModuleList = [];
    let req: any = {
      module_id: this.moduleId,
      submodulename: this.form.value.submodulename,
      urlslug: this.form.value.urlslug,
    }
    if (this.selectedFile) {
      req.image = this.selectedFile;
    }
    this.readingService.updateChapter(req, this.form.value?.id).subscribe(data => {
      this.form.reset();
      this.getSubModuleData();
      this.isEditClicked = false;
      this.isAccordionSelected = false;
      this.toast.add({severity: 'success', summary: 'Success', detail: data.message});
    });
  }

  resetForm(form: any) {
    form.reset();
    this.formElm.nativeElement.reset();
    this.isAccordionSelected = false;
    this.isEditClicked = false;
  }

  redirect(item: any) {
    let filterFormData = this.filterForm.value ? this.filterForm.value : "";
    let navigationExtras: NavigationExtras = {
        state: {
            ...item, moduleId: 14,
            country: 0,
            moduleName: this.subModuleName,
            class_id: this.storageSubjectData.state.class_id,
            subject: this.subjectId,
            ...filterFormData
        }
    }
    this.storage.set('sub-category', navigationExtras);
    this.router.navigate(['/reading/k12-question'], navigationExtras).then();
    // this.router.navigateByUrl(`/reading/k12-subject/${this.subjectId}/${item.id}`);
  }

  goBack(){
    this._location.back();
  }
}
