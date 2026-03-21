import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import { HttpClient } from "@angular/common/http";
import {SuggestedQuestionAndAnswerData, SuggestedQuestionData} from "../../@Models/reading.model";

@Injectable({
  providedIn: 'root'
})
export class SuggestedAddQuestionService {

  constructor(private http: HttpClient) { }

  getAllRequestedQuestionList(params: any): Observable<any> {
    return this.http.post<SuggestedQuestionData>(environment.ApiUrl + '/ShowRequestedQuestion', params)
  }

  getSelectedReqQuesList(val): Observable<any> {
    return this.http.post<SuggestedQuestionAndAnswerData>(environment.ApiUrl + '/SelectedReqQues',val)
  }

  getReviewOrgList(): Observable<any> {
    return this.http.get<any>(environment.ApiUrl + '/revieworglist')
  }

  submitQuestionResponse(data):Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/replyqarequest',data)
  }

}
