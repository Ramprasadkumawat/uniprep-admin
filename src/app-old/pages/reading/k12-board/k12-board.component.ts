import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReadingService} from "../reading.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {Location} from "@angular/common";

@Component({
    selector: 'uni-k12-board',
    templateUrl: './k12-board.component.html',
    styleUrls: ['./k12-board.component.scss'],
    standalone: false
})
export class K12BoardComponent implements OnInit {
  @ViewChild('formElm') formElm!: ElementRef;
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;

  moduleId: number = 14;
  form: FormGroup;
  filterForm: FormGroup;
  submitted: boolean = false;
  isAccordionSelected: boolean = false;
  categoryCount: number = 0;
  page: number = 1;
  rows: number = 10;
  subModuleList: any[] = [];
  categories: any[] = [];
  selectedFile: any = null;
  submodulePermission: number = 0;
  isEditClicked: boolean = false;
  editImage: any = "";
  id: string | null;
  subId: string | null;
  subModuleName: string = "K12 Board"

  categoryDropdownList = [{ id: null, name: "Select" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }];

  constructor(
      private fb: FormBuilder,
      private readingService: ReadingService,
      private route: ActivatedRoute,
      private toast: MessageService,
      private confirmationService: ConfirmationService,
      private router: Router,
      private location: Location
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.subId = this.route.snapshot.paramMap.get('subId');

    this.initializeForms();
  }

  private initializeForms() {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      categoryname: ['', [Validators.required]],
      urlslug: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    this.filterForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      filter_category_id: [''],
      favourite: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.fetchInitialData();
  }

  private fetchInitialData() {
    this.getSubModuleData();
    this.checkSubmoduleDeletePermission();
    this.getCategoryList();
  }

  private getCategoryList() {
    this.readingService.getCategory().subscribe((response) => {
      this.categories = [{ id: null, name: "Select" }, ...response];
    });
  }

  private checkSubmoduleDeletePermission() {
    this.readingService.checkSubmoduleDeletePermission().subscribe(response => {
      this.submodulePermission = response.permission;
    });
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getSubModuleData();
  }

  submitForm() {
    if (!this.form.value.categoryname && !this.form.value.urlslug && !this.form.value.image) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields!' });
      return;
    }
    this.submitted = true;

    const payload = {
      ...this.form.value,
      image: this.selectedFile,
      moduleId: this.moduleId,
      status: 1
    };

    const request$ = this.isEditClicked
        ? this.readingService.updateCareerToolCategory(payload, this.form.value.id)
        : this.readingService.addCareerToolCategory(payload);

    request$.subscribe((response) => {
      this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
      this.resetForms();
      this.getSubModuleData();
    });
  }

  onClickSubmitFilter() {
    if (!this.isValidFilter()) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please apply at least one filter!' });
      return;
    }

    this.fetchFilteredSubmodules();
  }

  private isValidFilter(): boolean {
    const formData = this.filterForm.value;
    return !!(formData.fromdate || formData.todate || formData.filter_category_id || formData.favourite);
  }

  private fetchFilteredSubmodules() {
    const filterData = this.filterForm.value;
    const req = {
      moduleId: this.moduleId,
      page: this.page,
      perpage: this.rows,
      mode: 'admin',
      ...filterData
    };

    this.readingService.getLearningCategories(req).subscribe((response) => {
      this.subModuleList = response.data;
      this.categoryCount = response.count;
    });
  }

  resetForms() {
    this.form.reset();
    this.filterForm.reset();
    this.submitted = false;
    this.selectedFile = null;
    this.isAccordionSelected = false;
    this.isEditClicked = false;
    this.getSubModuleData()
  }

  private getSubModuleData() {
    const req = {
      moduleId: this.moduleId,
      page: this.page,
      perpage: this.rows,
      ...this.filterForm.value,
    };

    this.readingService.getQuestionsCountForEachCategory(req).subscribe((response) => {
      this.subModuleList = response.data;
      this.categoryCount = response.count;
    });
  }

  deleteClass(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${item.submodule_name} Submodule and Questions?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.readingService.deleteCareerToolCategory({
          module_id: this.moduleId,
          category_id: item.id
        }).subscribe(response => {
          this.toast.add({ severity: 'success', summary: 'Deleted', detail: response.message });
          this.getSubModuleData();
        });
      }
    });
  }

  onFileChange(event: Event) {
    const fileInput = (event.target as HTMLInputElement).files;
    this.selectedFile = fileInput && fileInput[0] ? fileInput[0] : null;
    this.form.patchValue({ image: this.selectedFile ? this.selectedFile.name : '' });
  }

  editClass(item: any) {
    this.readingService.editLearningCategory(item.id).subscribe(res => {
      const data = res.data;
      this.form.patchValue({
        id: data.id,
        categoryname: data.category,
        urlslug: data.url_slug,
        image: data.icon
      });
      this.editImage = item.icon;
      this.isAccordionSelected = true;
      this.isEditClicked = true;
    });
  }

  goBack() {
    this.location.back();
  }

  redirectToSubmodule(item: any) {
    if (item.category_name == 'state' || item.category_name == 'State' || item.category_name == 'STATE') {
      this.router.navigateByUrl(`/reading/k12-state/${item.id}`);
    }else{
      this.router.navigateByUrl(`/reading/k12-class/${item.id}`);
    }
  }

}
