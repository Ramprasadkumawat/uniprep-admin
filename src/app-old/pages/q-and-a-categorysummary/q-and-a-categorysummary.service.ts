import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QAndAcategorysummaryService {
  constructor(private http: HttpClient) { }

  loadQACategorySummaryData(val?: any):Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json");
    let apiName = val && val.apiName ? val.apiName : "QuestionCategorySummary";
    return this.http.post<any>(environment.ApiUrl+'/'+apiName,val, {
      headers: headers,
    });
  }

  updateQuestionSummary(){
    const headers= new HttpHeaders().set('Accept', "application/json");
    return this.http.post<any>(environment.ApiUrl+'/UpdateCategoryQuestionCounts', {
      headers: headers,
    });
  }

  exportQuestionSummary(val){
    const headers= new HttpHeaders().set('Accept', "application/json");
    return this.http.post<any>(environment.ApiUrl+'/ExportQuesCategorySummary',val, {
      headers: headers,
    });
  }

}