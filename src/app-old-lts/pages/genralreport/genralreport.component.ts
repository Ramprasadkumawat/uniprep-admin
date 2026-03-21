import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QAReportService } from 'src/app/pages/report/report.service';
import { GenralreportService } from 'src/app/pages/genralreport/genralreport.service';
import { MessageService } from "primeng/api";


@Component({
    selector: 'uni-genralreport',
    templateUrl: './genralreport.component.html',
    styleUrls: ['./genralreport.component.scss'],
    standalone: false
})
export class GenralreportComponent implements OnInit {

  constructor(public fb: FormBuilder, private qandaservice: QAReportService, private genralreport: GenralreportService, private toast: MessageService) { }

  filterForm!: FormGroup;
  categoryDropdownList: any;
  priorityDropdownList: any = [];
  generalReportListData: any[];
  listRowCount: number = 0;
  rows: number = 100;
  perPage: number = 100;
  page: number = 1;
  currentPriorityStatus: number = 0;
  selectedStatus: { [ticketno: string]: number } = {};
  replyResponse: { [ticketno: string]: number } = {};
  currentlyExpandedTicket: string | null = null;
  selectedPriority: any;


  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [""],
      email: [""],
      mobile: [""],
      issue: [""],
      priority: [""],
      comment: [""]
    });

    this.generalReportList();
    this.getReportOptionLists();
    this.getPriorityOptionList();
  }

  getReportOptionLists() {
    this.qandaservice.getReportOptionList().subscribe(response => {
      this.categoryDropdownList = response.reportOptions.filter((option) => option.reporttype === 1);
    });
  }

  getPriorityOptionList() {
    this.genralreport.getPriorityDropdownList().subscribe(response => {
      this.priorityDropdownList = response;
    });
  }

  generalReportList() {
    let formData = this.filterForm.value;
    let data = {
      perpage: this.perPage,
      page: this.page,
      ...formData
    }
    this.genralreport.getGeneralReportList(data).subscribe(response => {
      this.generalReportListData = response.data;
      this.listRowCount = response.count;
    });
  }

  filtersubmit() {
    let formData = this.filterForm.value;
    if (!formData.name && !formData.email && !formData.mobile && !formData.issue && !formData.priority && !formData.comment) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    } else {
      this.generalReportList();
    }

  }

  pageChange(events: any) {
    this.perPage = events.rows;
    this.page = events.page + 1;
    this.generalReportList();
  }

  reset(): void {
    this.filterForm.reset();
    this.generalReportList();
  }

  reportExport() {
    let formData = this.filterForm.value;
    let data = {
      perpage: this.perPage,
      page: this.page,
      ...formData
    }
    this.genralreport.exportGenralReport(data).subscribe(response =>{
      window.open(response.link, '_blank');
    });
  }

  updatePriorityStatus(report_id) {
    let updateData = {
      report_id: report_id,
      priority_status: this.selectedStatus[report_id]
    };
    this.genralreport.updatePriority(updateData).subscribe(response => {
      this.toast.add({ severity: 'success', summary: 'Error', detail: response.message });
      this.generalReportList();
      this.currentlyExpandedTicket = null;
      this.selectedStatus[report_id] = null;
      return;
    });
  }

  setPriorityStatus(event: any, ticketno: any) {
    this.selectedStatus[ticketno] = event.value;
  }

  toggleRow(item: any) {
    if (this.currentlyExpandedTicket === item.ticketno) {
      this.currentlyExpandedTicket = null;
      this.selectedStatus[item.ticketno] = null;
    } else {
      this.currentlyExpandedTicket = item.ticketno;
      this.selectedStatus[item.ticketno] = item.priority_id;
    }
  }

  sendReplyResponse(ticketNumber: number,reportMsg:string,issue: string){

    if(!this.replyResponse[ticketNumber]){
      this.toast.add({ severity: 'error', summary: 'Error', detail: "Please Give some Reply Message" });
      return;
    }

    let ticketData = {
      ticketNumber: ticketNumber,
      ticketResponse: this.replyResponse[ticketNumber],
      reportMsg : reportMsg,
      reportIssue: issue
    }
    this.genralreport.sendReplyForStudents(ticketData).subscribe(response =>{
      this.toast.add({ severity: response.status, summary: response.status, detail: response.message });
      return;
    });
  }
}
