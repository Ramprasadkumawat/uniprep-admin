import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReadingService } from '../reading.service';
import { SuggestedQuestionAndAnswer } from 'src/app/@Models/reading.model';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'uni-suggested-question',
    templateUrl: './suggested-question.component.html',
    styleUrls: ['./suggested-question.component.scss'],
    standalone: false
})
export class SuggestedQuestionComponent implements OnInit {

  filterForm: FormGroup;
  organizationList: any[] = [{ id: null, name: "Select" }, { id: 1, name: "Yes" }, { id: 2, name: "No" }];
  statusList: any[] = [{ id: null, name: "Select" }, { id: 1, name: "Actioned" }, { id: 2, name: "Not Actioned" }, { id: 2, name: "Not Replied" }];
  suggestedQuestions: any = [];
  suggestedQuestionsTotal: number = 0;
  actionedQuestions: any = [];
  actionedQuestionsTotal: string = '';
  nonActionedQuestions: any = [];
  nonActionedQuestionsTotal: number = 0;
  suggestedQA: any = [];
  userDetails: any;
  search: string = '';

  @ViewChild('filterFormElm') filterFormElm!: ElementRef;

  constructor( private fb: FormBuilder, private readingService: ReadingService,
    private toast: MessageService) {
    this.filterForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      organization: [''],
      status: [''],
  });
  }

  ngOnInit(): void {
    this.loadAllSuggestedQuestions();
    this.getActionedQuestions();
    this.getNonActionedQuestions();
  }

  submitFilter() {
    const formData = this.filterForm.value;
    if (!formData.fromdate && !formData.todate && !formData.organization && !formData.status) {
      this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
      return;
    }
    let data: any = {};
    if (formData.fromdate) {
      data.fromdate = formData.fromdate;
    }
    if (formData.todate) {
      data.todate = formData.todate;
    }
    if (formData.organization) {
      data.organization = formData.organization;
    }
    if (formData.status) {
      data.status = formData.status;
    }
    this.getAllSuggestedQuestions(data);
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.loadAllSuggestedQuestions();
  }

  loadAllSuggestedQuestions() {
    this.getAllSuggestedQuestions({});
  }
  getAllSuggestedQuestions(data: any) {
    this.readingService.getAllRequestedQuestionList(data).subscribe((response) => {
      this.suggestedQuestions = response.data;
      this.suggestedQuestionsTotal = response.totalsuggestions;
    });
  }
  getActionedQuestions() {
    this.readingService.getAllRequestedQuestionList({ actioned: 1 }).subscribe((response) => {
      this.actionedQuestions = response.data;
      this.actionedQuestionsTotal = response.totalsuggestions.toString();
    });
  }
  getNonActionedQuestions() {
    this.readingService.getAllRequestedQuestionList({ actioned: 0 }).subscribe((response) => {
      this.nonActionedQuestions = response.data;
      this.nonActionedQuestionsTotal = response.totalsuggestions;
    });
  }

  getSearchedQuestions() {
    this.getAllSuggestedQuestions({search_chat: this.search});
  }

  getSelectedReqQues(data: SuggestedQuestionAndAnswer) {
    this.userDetails = data;
    this.readingService.getSelectedReqQuesList(this.userDetails.user_id).subscribe((response) => {
      this.suggestedQA = response;
    });
  }
}
