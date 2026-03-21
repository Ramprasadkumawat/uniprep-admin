import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormsModule,
} from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from "primeng/paginator";
import { ScrollTopModule } from "primeng/scrolltop";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TalentSupportService } from "./talent-support.service";
import { HiringSupportService } from "../hiring-support/hiring-support.service";

@Component({
  selector: "uni-talent-support",
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
    FormsModule,
  ],
  templateUrl: "./talent-support.component.html",
  styleUrl: "./talent-support.component.scss",
})
export class TalentSupportComponent {
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
  talentRequirementPlans = [
    { label: "Silver", value: "Silver" },
    { label: "Platinum", value: "Platinum" },
    { label: "Diamond", value: "Diamond" },
  ];

  workMode = [
    { label: "Remote", value: "Remote" },
    { label: "On-site", value: "On-site" },
    { label: "Hybrid", value: "Hybrid" },
  ];

  workType = [
    { id: "1", employment_type: "Any" },
    { id: "2", employment_type: "Full-Time Work" },
    { id: "3", employment_type: "Part-Time Work" },
    { id: "4", employment_type: "Temporary Work" },
    { id: "5", employment_type: "Contract-Based Work" },
    { id: "6", employment_type: "Freelancing" },
    { id: "7", employment_type: "Internship" },
    { id: "8", employment_type: "Apprenticeship" },
    { id: "9", employment_type: "Volunteer" },
    { id: "10", employment_type: "Consulting" },
    { id: "11", employment_type: "Commission-Based Work" },
  ];

  constructor(
    private fb: FormBuilder,
    private TalentSupportService: TalentSupportService,
    private dropdownService: HiringSupportService
  ) {}

  ngOnInit() {
    this.initForms();
    this.dropdownService.getHiringSupportDropDown().subscribe((res) => {
      this.currencyOptions = res.currencies;
    });
    this.dropdownService.getPositionHiringSupportDropDown().subscribe((res) => {
      this.positionOptions = res;
    });
    this.searchLocations();
    this.loadTalentSupportData();
  }

  onLocationSearch(event: any) {
    const searchText = event.filter?.trim();
    if (!searchText) {
      return;
    }
    this.searchLocations(searchText);
  }

  searchLocations(location?: string) {
    this.dropdownService.getLocation(location).subscribe((res) => {
      this.locations = res.worklocations;
    });
  }

  initForms() {
    this.filterForm = this.fb.group({
      requirementplan: [""],
      jobtitle: [""],
      worktype: [""],
      workmode: [""],
      location: [""],
      currentsalary: [""],
      currency: [""],
    });
  }

  loadTalentSupportData(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.TalentSupportService.getTalentSupport(data).subscribe((response) => {
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
    this.loadTalentSupportData(filters);
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.perPage = 10;
    this.loadTalentSupportData();
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.loadTalentSupportData(this.filterForm.value);
  }

  openInfoDialog(employee: any) {
    this.selectedRequirement = employee.requirements ?? [];
    this.showInfoDialog = true;
  }
}
