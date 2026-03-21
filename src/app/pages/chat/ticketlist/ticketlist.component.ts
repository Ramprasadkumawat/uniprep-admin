import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import {TabsModule} from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { Observable } from "rxjs";
import { User, UserType } from "src/app/@Models/user.model";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserFacadeService } from "../../users/user-facade.service";
import { TicketService } from "./ticket.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
@Component({
    selector: "uni-ticketlist",
    templateUrl: "./ticketlist.component.html",
    styleUrls: ["./ticketlist.component.scss"],
    imports: [
        CommonModule,
        InputTextModule,
        TabsModule,
        TableModule,
        AccordionModule,
        SelectModule,
        TextareaModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService]
})
export class TicketlistComponent implements OnInit {
  filterForm: FormGroup;
  submitted = false;
  pageSize = 10;
  ticketsLists: any[] = [];
  constructor(
    private userFacade: UserFacadeService,
    private service: TicketService,
    private router: Router,
    private fb: FormBuilder,
    private toast: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.filterForm = fb.group({
      name: [""],
      email: [""],
      phone: [""],
      category: [""],
      // priority: [''],
    });
  }

  ngOnInit(): void {
    this.getOptions();
    this.getTicketList(this.data);
    this.getCategoryOptions();
  }
  reset() {
    this.filterForm.reset();
    this.data={};
    this.data.page = 1;
    this.data.perpage = 10;
    this.getTicketList(this.data);
  }
  datacount: number = 0;
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.getTicketList(this.data);
  }
  getTicketList(data: any) {
    this.service.getTicketList(data).subscribe((response) => {
      this.ticketsLists = [];
      this.ticketsLists = response.chatreport;
      this.datacount = response.count;
    });
  }
  sendreportMail(reportId: any) {
    this.service
      .sendreportMail({ reportId: reportId })
      .subscribe((response) => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Status updated and mail Sent",
        });
        this.getTicketList(this.data);
      });
  }
  category: any[] = [];
  getCategoryOptions() {
    this.service.getOptions().subscribe((response) => {
      this.category = [];
      this.category = [
        { id: null, reportoption_name: "Select" },
        ...response.reportOptions,
      ];
    });
  }
  options: any[] = [];
  getOptions() {
    this.options = [{ id: 1, name: "Completed" }];
  }
  filtersubmit() {
    this.data.page = 1;
    this.data.perpage = this.pageSize;
    this.data.name = this.filterForm.value.name;
    this.data.email = this.filterForm.value.email;
    this.data.phone = this.filterForm.value.phone;
    this.data.category = this.filterForm.value.category;
    if (this.filterForm.value.category == null) {
      delete this.data["category"];
    }
    this.getTicketList(this.data);
  }
  exportsubmit() {
    this.service.exportReport(this.data).subscribe((response) => {
      this.confirmationService.confirm({
        message: "Your file Was ready please click the download",
        header: "Download",
        icon: "pi pi-download",
        acceptLabel: "Download",
        acceptIcon: "pi pi-download",
        acceptButtonStyleClass:"btn-primary",
        closeOnEscape: false,
        rejectVisible: false,
        accept: () => {
          window.open(response?.link);
        },
      });
    });
  }
  chatreportexport;
  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  redirecttolead(userid: any) {
    this.router.navigate(["/subscribers/editprofile/" + userid]);
  }
}
