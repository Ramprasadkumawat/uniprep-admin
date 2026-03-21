import { Component } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HiringSupportService } from "./hiring-support.service";
import { SelectModule } from "primeng/select";
import { InputNumberModule } from "primeng/inputnumber";
import { MultiSelectModule } from "primeng/multiselect";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { PaginatorModule } from "primeng/paginator";
import { AccordionModule } from "primeng/accordion";
import { ScrollTopModule } from "primeng/scrolltop";

@Component({
  selector: "uni-hiring-support",
  standalone: true,
  templateUrl: "./hiring-support.component.html",
  styleUrl: "./hiring-support.component.scss",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    MultiSelectModule,
    DatePickerModule,
    DialogModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    AccordionModule,
    ScrollTopModule,
  ],
})
export class HiringSupportComponent {
  filterForm!: FormGroup;
  employeesList: any[] = [];
  totalEmployeeCount = 0;
  page = 1;
  perPage = 10;
  positionOptions: any[] = [];
  currencyOptions: any[] = [];
  locations: any[] = [];
  showInfoDialog = false;
  selectedRequirement: any[] = [];
  minDate: Date;
  requirementTypeOptions = [
    { label: "Raw Talents", value: "raw" },
    { label: "Introductory Video", value: "intro_video" },
    { label: "Verified Talents", value: "verified" },
    { label: "Screened Talents", value: "screened" },
    { label: "Ready to Hire", value: "ready" },
    { label: "Guaranteed Hire", value: "guaranteed" },
  ];
  workMode = [
    { label: "Remote", value: "Remote" },
    { label: "On-site", value: "On-site" },
    { label: "Hybrid", value: "Hybrid" },
  ];
  employmentTypeOptions = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
    { label: "Freelance", value: "freelance" },
  ];
  experienceOptions = [
    { label: "Fresher", value: "fresher" },
    { label: "1 year", value: "1" },
    { label: "2 years", value: "2" },
    { label: "3 years", value: "3" },
    { label: "4 years", value: "4" },
    { label: "5 years", value: "5" },
    { label: "6 years", value: "6" },
    { label: "7 years", value: "7" },
    { label: "8 years", value: "8" },
    { label: "9 years", value: "9" },
    { label: "10 years", value: "10" },
    { label: "10+ years", value: "10+" },
  ];

  constructor(
    private fb: FormBuilder,
    private hiringSupportService: HiringSupportService
  ) {}

  ngOnInit() {
    this.initForms();
    this.hiringSupportService.getHiringSupportDropDown().subscribe((res) => {
      this.currencyOptions = res.currencies;
      this.locations = res.locations;
    });
    this.hiringSupportService
      .getPositionHiringSupportDropDown()
      .subscribe((res) => {
        this.positionOptions = res;
      });
    this.loadHiringSupportData();
  }

  initForms() {
    this.filterForm = this.fb.group({
      requirementtype: [""],
      profilecount: [""],
      designation: [""],
      employmenttype: [""],
      workmode: [""],
      location: [""],
      experience: [""],
      min_salary: [0],
      max_salary: [0],
      currency: [""],
      startdate: [""],
    });
  }

  loadHiringSupportData(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.hiringSupportService.getHiringSupport(data).subscribe((response) => {
      this.employeesList = response.data.map((item: any) => ({
        ...item.transaction,
        requirements: item.requirements,
      }));
      this.totalEmployeeCount = response.total;
    });
  }

  filter() {
    this.page = 1;
    const filters = { ...this.filterForm.value };
    if (filters.startdate) {
      filters.startdate = this.formatDate(filters.startdate);
    }
    this.loadHiringSupportData(filters);
  }

  formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.perPage = 10;
    this.loadHiringSupportData();
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.loadHiringSupportData(this.filterForm.value);
  }

  openInfoDialog(employee: any) {
    this.selectedRequirement = employee.requirements ?? [];
    this.showInfoDialog = true;
  }

  formatExperience(value: string): string {
    if (!value) return "N/A";
    return value
      .split(",")
      .map((v) => v.trim())
      .map((item) =>
        item.toLowerCase() === "fresher"
          ? "Fresher"
          : !isNaN(Number(item))
          ? Number(item) === 1
            ? "1 year"
            : `${item} years`
          : item
      )
      .join(", ");
  }
}
