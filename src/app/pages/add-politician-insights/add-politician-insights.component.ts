import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Country } from "src/app/@Models/country.model";
import { Politician } from "src/app/@Models/politician.model";
import { PoliticianService } from "./politician-insights.service";

@Component({
  selector: "uni-add-politician-insights",
  templateUrl: "./add-politician-insights.component.html",
  styleUrls: ["./add-politician-insights.component.scss"],
  standalone: false,
})
export class AddPoliticianInsightsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  addFormShow: boolean = true;
  countryList: Country[] = [];
  occupationList: any = [];
  submitted: boolean = false;
  first: number = 1;
  page: number = 1;
  rows: number = 10;
  activeIndex: number = 0;
  politianInsightsList: Politician[] = [];
  politicianCount: number = 0;
  filterPoliticiansNameList: Politician[] = [];
  filteredOccupationBasedOnCountry: any = [];
  selectedFile!: File;
  showImage: string | null = null;
  isShowImportModal: "block" | "none" = "none";
  @ViewChild("formElm") formElm!: ElementRef;

  constructor(
    private toastService: MessageService,
    private fb: FormBuilder,
    private politicianService: PoliticianService,
    private toaster: MessageService
  ) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      country: [null, Validators.required],
      occupation: [null, Validators.required],
      description: ["", Validators.required],
    });

    this.filterForm = this.fb.group({
      name: [""],
      country: [""],
      occcupation: [""],
    });
  }

  ngOnInit(): void {
    this.getOptionsList();
    this.getPoliticianList();
  }

  getOptionsList() {
    this.politicianService.getOptionList().subscribe((data) => {
      this.countryList = data.countries;
      this.occupationList = data.occupation;
      this.filterPoliticiansNameList = data.politiciannames;
    });
  }

  onChangeCountry(value: number) {
    this.filteredOccupationBasedOnCountry = this.occupationList.filter(
      (item) => item.country == value
    );
  }

  get f() {
    return this.form.controls;
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      this.form.patchValue({
        image: this.selectedFile.name,
      });
      let reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target.result) {
          this.showImage = event.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }

  submitFilterForm() {
    const value = this.filterForm.value;
    var data = {
      perpage: 10,
      page: 1,
      name: value.name,
      country: value.country,
      occupation: value.occupation,
    };
    this.politicianService.getPoliticiansList(data).subscribe((response) => {
      this.politianInsightsList = response.politicians;
      this.politicianCount = response.count;
    });
  }

  submitForm() {
    this.submitted = true;
    const formData = new FormData();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    formData.append("name", value.name);
    formData.append("occupation", value.occupation);
    formData.append("country", value.country);
    formData.append("description", value.description);
    formData.append("image", value.image);
    this.politicianService
      .addPoliticianInSight(formData)
      .subscribe((response) => {
        this.toaster.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.submitted = false;
        this.form.reset();
        this.formElm.nativeElement.reset();
        this.getPoliticianList();
      });
  }

  getPoliticianList() {
    let req = {
      page: this.page,
      perpage: this.rows,
    };
    this.politicianService.getPoliticiansList(req).subscribe((response) => {
      this.politianInsightsList = response.politicians;
      this.politicianCount = response?.politicians?.length;
    });
  }

  exportPolitician() {
    this.politicianService
      .exportPolitician(this.filterForm.value)
      .subscribe((res: any) => {
        this.politicianService.downloadFile(res.link).subscribe((blob) => {
          const a = document.createElement("a");
          const objectUrl = window.URL.createObjectURL(blob);

          a.href = objectUrl;
          a.download = "politian-insights.csv";
          document.body.appendChild(a);

          a.click();
          window.URL.revokeObjectURL(objectUrl);
          document.body.removeChild(a);
        });
      });
  }

  pageChange(event: any) {
    this.first = event.first ?? 0;
    this.page = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 10;
    this.getPoliticianList();
  }

  resetButton() {
    this.filterForm.reset();
    this.submitFilterForm();
    this.ngOnInit();
  }

  uploadPoliticianFile() {
    if (this.selectedFile) {
      this.politicianService.bulkUploadFile(this.selectedFile).subscribe(
        (response) => {
          this.selectedFile = null;
          if (response.status == "true") {
            this.toastService.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
            });
            this.getPoliticianList();
            this.isShowImportModal = "none";
          } else {
            this.toastService.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
            this.getPoliticianList();
            this.isShowImportModal = "none";
          }
        },
        (error) => {
          this.toastService.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        }
      );
    } else {
      this.toastService.add({
        severity: "error",
        summary: "Error",
        detail: "Please choose file!",
      });
    }
  }
}
