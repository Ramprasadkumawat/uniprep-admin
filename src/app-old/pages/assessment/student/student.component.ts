import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import {SelectModule} from "primeng/select";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { AssessmentService } from "../assessment.service";

@Component({
    selector: "uni-assessment-student",
    imports: [
        CommonModule,
        AccordionModule,
        InputTextModule,
        TableModule,
        ButtonModule,
        SelectModule,
        ReactiveFormsModule,
        ConfirmPopupModule,
        InputNumberModule,
        RadioButtonModule,
    ],
    templateUrl: "./student.component.html",
    styleUrls: ["./student.component.scss"],
    providers: [ConfirmationService]
})
export class studentComponent implements OnInit {
  filterForm: FormGroup;
  pageSize = 10;
  page: number = 1;
  userObj: object = {};
  usersCount: number = 0;
  users: any[] = [];
  activeIndex: number = -1;
  userId!: number;
  first: number = 0;
  @ViewChild("filterFormElm") filterFormElm!: ElementRef;
  constructor(
    private service: AssessmentService,
    private fb: FormBuilder,
    private toaster: MessageService
  ) {
    this.filterForm = fb.group({
      name: [null],
      branch: [null],
      student_id: [null],
      status: [null],
      college: [null],
      winner: [null],
      passingyear: [null],
      group: [null],
    });
  }
  ngOnInit(): void {
    this.loadUserList();
    this.getStudentList();
    this.getBranchList();
    this.getCollegeList();
    this.getiLearnList();
    this.getStatusList();
    this.getWinnerList();
    this.getPassingYear();
  }

  loadUserList() {
    this.userObj = {
      page: this.page,
      perpage: this.pageSize,
    };
    this.getUserList(this.userObj);
  }
  getUserList(value: any) {
    this.service.getUsersList(value).subscribe((response) => {
      this.users = response.data;
      this.usersCount = response.count;
    });
  }
  getstudentDetail(user){
    this.service.getUserdetail({user_id:user.user_id}).subscribe((response) => {
    //   {
    //     "detail": [
    //         {
    //             "group_id": 1
    //         }
    //     ],
    //     "place": null,
    //     "result": [
    //         {
    //             "module_name": "Psycometric Test",
    //             "submodule_name": "Test 1",
    //             "category": "Numerical Reasoning",
    //             "total_score": 10,
    //             "user_score": 1
    //         },
    //         {
    //             "module_name": "Employer Test",
    //             "submodule_name": "Test 1",
    //             "category": "Cognitive Ability",
    //             "total_score": 12,
    //             "user_score": 1
    //         }
    //     ]
    // }
    });
  }
  passingyear = [];
  getPassingYear() {
    this.passingyear = [];
    const currentYear = new Date().getFullYear();
    this.passingyear.push({ id: null, value: "Select" });
    for (let year = 2010; year <= currentYear; year++) {
      this.passingyear.push({ id: year, value: year });
    }
  }
  winner = [];
  getWinnerList() {
    this.winner = [
      { id: null, value: "Select" },
      { id: 1, value: "Yes" },
      { id: 0, value: "No" },
    ];
  }
  status = [];
  getStatusList() {
    this.status = [
      { id: null, value: "Select" },
      { id: 1, value: "Active" },
      { id: 0, value: "In Active" },
    ];
  }
  students = [];
  getStudentList() {
    this.service.getStudentList().subscribe((response) => {
      this.students = [{ id: null, name: "Select" },...response];
    });
  }
  branch = [];
  getBranchList() {
    this.service.getBranchList({}).subscribe((response) => {
      this.branch = [{ id: null, subject_name: "Select" },...response.subject];
    });
  }
  college = [];
  getCollegeList() {
    this.service.getCollegeList().subscribe((response) => {
      this.college = [{ id: null, institutename: "Select" },...response.data];
    });
  }
  clusters = [];
  getiLearnList() {
    this.service.getiLearnList().subscribe((response) => {
      this.clusters = [{ id: null, group: "Select" },...response];
    });
  }
  pageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.first = event.first ?? 0;
    this.getUserList({ ...this.userObj, page: this.page });
  }
  filter() {
    const formData = this.filterForm.value;
    if (
      !formData.name &&
      !formData.status &&
      !formData.college &&
      !formData.winner &&
      !formData.passingyear &&
      !formData.group
    ) {
      this.toaster.add({
        severity: "error",
        summary: "Error",
        detail: "Please make sure you have some filter!",
      });
      return;
    }
    let data: any = {
      page: 1,
      perpage: this.pageSize,
    };
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.status) {
      data.status = formData.status;
    }
    if (formData.college) {
      data.college = formData.college;
    }
    if (formData.winner) {
      data.winner = formData.winner;
    }
    if (formData.passingyear) {
      data.passingyear = formData.passingyear;
    }
    if (formData.group) {
      data.group = formData.group;
    }
    this.userObj = data;
    this.first = 0;
    this.getUserList(this.userObj);
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.loadUserList();
  }

  exportFile() {
    let data: any = {};
    const formData = this.filterForm.value;
    if (formData.name) {
      data.name = formData.name;
    }
    if (formData.status) {
      data.status = formData.status;
    }
    if (formData.college) {
      data.college = formData.college;
    }
    if (formData.winner) {
      data.winner = formData.winner;
    }
    if (formData.passingyear) {
      data.passingyear = formData.passingyear;
    }
    if (formData.group) {
      data.group = formData.group;
    }
    // this.service.userExport(data).subscribe((response) => {
    //   window.open(response.link, "_blank");
    // });
  }
}
