import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SuggestedQuestionAndAnswer } from 'src/app/@Models/reading.model';
import { MessageService } from 'primeng/api';
import {SuggestedAddQuestionService} from "./suggested-add-question.service";
import {EditorModule} from 'primeng/editor';

@Component({
    selector: 'uni-suggested-add-question',
    templateUrl: './suggested-add-question.component.html',
    styleUrls: ['./suggested-add-question.component.scss'],
    standalone: false
})
export class SuggestedAddQuestionComponent implements OnInit {

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
  responseMsg:string = "";
  selectedUser:number = 0;
  showResponse:boolean = false;
  user_id:number;
  @ViewChild('filterFormElm') filterFormElm!: ElementRef;
  selectedQuestion: any;

  constructor( private fb: FormBuilder, private suggestedQuestionService: SuggestedAddQuestionService,
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
    var empty ;
    // this.getActionedQuestions(empty);
    // var notActioned;
    // notActioned.actioned = 0;
    // this.getNonActionedQuestions(notActioned);
    // var actioned;
    // actioned.actioned = 1;
    // this.getNonActionedQuestions(actioned);
    this.getOrgList();
  }

  submitFilter() {
    const formData = this.filterForm.value;
    if (!formData.fromdate && !formData.todate && !formData.organization && !formData.status) {
      this.toast.add({severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!'});
      return;
    }
    let data: any = {};
    let adata: any = {};
    let nadata: any = {};
    if (formData.fromdate) {
      data.fromdate = formData.fromdate;
      adata.fromdate = formData.fromdate;
      nadata.fromdate = formData.fromdate;
    }
    if (formData.todate) {
      data.todate = formData.todate;
      adata.todate = formData.todate;
      nadata.todate = formData.todate;
    }
    if (formData.organization) {
      data.organization = formData.organization;
      adata.organization = formData.organization;
      nadata.organization = formData.organization;
    }
    //  data.actioned = 0;
     adata.actioned = 1;
     nadata.actioned = 0;
    // if (formData.status) {
    //   data.status = formData.status;
    // }
    // console.log(data);
    //  console.log(adata);
    
    this.getAllSuggestedQuestions(data);
    this.getActionedQuestions(adata);
    this.getNonActionedQuestions(nadata);
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterFormElm.nativeElement.reset();
    this.loadAllSuggestedQuestions();
  }

  loadAllSuggestedQuestions() {
    let data: any = {};
    let adata: any = {};
    let nadata: any = {};
    adata.actioned = 1;
    nadata.actioned = 0;
    this.getAllSuggestedQuestions(data);
    this.getActionedQuestions(adata);
    this.getNonActionedQuestions(nadata);
  }
  getAllSuggestedQuestions(data: any) {
    this.suggestedQuestionService.getAllRequestedQuestionList(data).subscribe((response) => {
      this.suggestedQuestions = response.data;
      this.suggestedQuestionsTotal = response.totalsuggestions;
    });
  }
  getActionedQuestions(adata: any) {
    this.suggestedQuestionService.getAllRequestedQuestionList(adata).subscribe((response) => {
      this.actionedQuestions = response.data;
      this.actionedQuestionsTotal = response.totalactioned.toString();
    });
  }
  getNonActionedQuestions(nadata: any) {
    this.suggestedQuestionService.getAllRequestedQuestionList(nadata).subscribe((response) => {
      this.nonActionedQuestions = response.data;
      this.nonActionedQuestionsTotal = response.totalsuggestions;
    });
  }

  getSearchedQuestions() {
    this.getAllSuggestedQuestions({search_chat: this.search});
  }

  getSelectedReqQues(uid) {
    let data = {
      user_id : uid,
    }
    this.user_id = uid;
    this.suggestedQuestionService.getSelectedReqQuesList(data).subscribe((response) => {
      this.suggestedQA = response.data;
      this.userDetails = true
    });
  }

  getSelectedReqQuesNotActioned(uid){
    let nadata = {
      user_id : uid,
      actioned : 0
    }
    this.user_id = uid;
    this.suggestedQuestionService.getSelectedReqQuesList(nadata).subscribe((response) => {
      this.suggestedQA = response.data;
      this.userDetails = true
    });
  }

  
  getSelectedReqQuesActioned(uid){
    let adata = {
      user_id : uid,
      actioned : 1
    }
    this.user_id = uid;
    this.suggestedQuestionService.getSelectedReqQuesList(adata).subscribe((response) => {
      this.suggestedQA = response.data;
      this.userDetails = true
    });
  }


  getOrgList(){
    this.suggestedQuestionService.getReviewOrgList().subscribe((response) => {
      this.organizationList = response;
    });
  }

  respond(){
    // alert(this.selectedQuestion);
    // console.log("adasd");
    let resData: any = {};
    resData.questions = this.selectedQuestion;
    resData.response = this.responseMsg;

    this.suggestedQuestionService.submitQuestionResponse(resData).subscribe((response) => {
      // this.suggestedQA = response.data;
      this.responseMsg = null;
    });

    let adata = {
      user_id : this.user_id,
      actioned : 1
    }

    this.suggestedQuestionService.getSelectedReqQuesList(adata).subscribe((response) => {
      this.suggestedQA = response.data;
    });
  }
}
