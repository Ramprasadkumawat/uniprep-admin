import { Component } from "@angular/core";
import { CareerCoachService } from "./career-coach.service";
import { CommonModule } from "@angular/common";
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

@Component({
  selector: "uni-career-coach",
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
  standalone: true,
  templateUrl: "./career-coach.component.html",
  styleUrl: "./career-coach.component.scss",
})
export class CareerCoachComponent {
  filterForm!: FormGroup;
  employeesList: any[] = [];
  totalEmployeeCount = 0;
  page = 1;
  perPage = 10;
  supportOptions = [
    { label: "Struggling to find a job", value: "Struggling to find a job" },
    { label: "Looking for career change", value: "Looking for career change" },
    {
      label: "Looking for career guidance",
      value: "Looking for career guidance",
    },
    { label: "Others", value: "Others" },
  ];

  constructor(private service: CareerCoachService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForms();
    this.loadCareerCoachData();
  }

  initForms() {
    this.filterForm = this.fb.group({
      support: [""],
    });
  }

  loadCareerCoachData(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.service.getCareerCoach(data).subscribe((response) => {
      this.employeesList = response.data;
      this.totalEmployeeCount = response.total;
    });
  }

  filter() {
    this.page = 1;
    this.loadCareerCoachData(this.filterForm.value);
  }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.perPage = 10;
    this.loadCareerCoachData();
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
    this.loadCareerCoachData(this.filterForm.value);
  }
}
