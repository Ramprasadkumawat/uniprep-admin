import { QAReportService } from "../report/report.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GenralreportService } from "../genralreport/genralreport.service";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { PaginatorModule } from "primeng/paginator";
import { ScrollTopModule } from "primeng/scrolltop";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "uni-reportsystem",
	templateUrl: "./reportsystem.component.html",
	styleUrls: ["./reportsystem.component.scss"],
	imports: [CommonModule, FormsModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, PaginatorModule, ScrollTopModule],
})
export class ReportsystemComponent implements OnInit {
	listRowCount: number = 0;
	currentlyExpandedTicket: string | null = null;
	filterForm!: FormGroup;
	generalReportListData: any[];
	rows: number = 100;
	perPage: number = 100;
	page: number = 1;
	statusList: any[] = [];
	userTypeList: any[] = [];
	priorityList: any[] = [];
	categoryList: any[] = [];
	selectedStatus: { [ticketno: string]: number } = {};
	constructor(public fb: FormBuilder, private qandaservice: QAReportService, private genralreport: GenralreportService, private toast: MessageService, private router: Router) {}

	ngOnInit(): void {
		this.statusList = [
			{ id: 1, name: "Action" },
			{ id: 0, name: "Not-Action" },
		];
		this.userTypeList = [
			{ id: 1, name: "Studen" },
			{ id: 2, name: "Employer" },
		];
		this.generalReportList();
		this.filterForm = this.fb.group({
			name: [""],
			email: [""],
			issue: [""],
			priority: [""],
			status: [""],
			userType: [""],
		});
		this.genralreport.getPriorityList().subscribe((res: any) => {
			this.priorityList = res.data;
		});
		this.genralreport.getReportCategory().subscribe((res: any) => {
			this.categoryList = res.data;
		});
	}
	filtersubmit() {
		this.generalReportListData = [];
		var data = {
			name: this.filterForm.value.name,
			email: this.filterForm.value.email,
			issue: this.filterForm.value.issue,
			prority: this.filterForm.value.priority,
			perpage: this.perPage,
			page: this.page,
			usertype: this.filterForm.value.userType,
		};
		this.genralreport.getGeneralReportList(data).subscribe((response) => {
			this.generalReportListData = response.data;
			this.listRowCount = response.count;
		});
	}
	pageChange(eve: any) {
		if (this.perPage == eve.rows) {
			this.page = eve.first / eve.rows + 1;
		} else {
			this.page = 1;
		}
		this.perPage = eve.rows;
		this.generalReportList();
	}

	toggleRow(item: any) {
		if (this.currentlyExpandedTicket === item.reportId) {
			this.currentlyExpandedTicket = null;
			this.selectedStatus[item.reportId] = null;
		} else {
			this.currentlyExpandedTicket = item.reportId;
			this.selectedStatus[item.reportId] = item.priority;
		}
	}
	reportExport() {
		this.genralreport.reportExportApi().subscribe((response) => {
			console.log(response);
			window.open(response.link, "_blank");
		});
	}
	generalReportList() {
		this.generalReportListData = [];
		let data = {
			perpage: this.perPage,
			page: this.page,
		};
		this.genralreport.getGeneralReportList(data).subscribe((response) => {
			this.generalReportListData = response.data;
			this.listRowCount = response.count;
		});
	}
	chatmodule(item: any) {
		console.log(item);
		localStorage.setItem("reportmoduleidforchat", item.ticketreport);
		localStorage.setItem("ticketnoforchat", item.reportId);
		localStorage.setItem("useridforchatreport", item.user_id);
		this.router.navigate(["/repotsystemchat"]);
	}
	resetFilter() {
		this.filterForm.reset();
		this.generalReportList();
	}
}
