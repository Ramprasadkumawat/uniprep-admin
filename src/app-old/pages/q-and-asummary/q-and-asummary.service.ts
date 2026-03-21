import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QAndAsummaryService {

  constructor(private http: HttpClient) { }

  loadQuestionSummaryData(val?: any):Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json");
    let apiName = val && val.apiName ? val.apiName : "QuestionSummary";
    return this.http.post<any>(environment.ApiUrl+'/'+apiName,val, {
      headers: headers,
    });

   
  }

  exportQuestionSummary(val){
    const headers= new HttpHeaders().set('Accept', "application/json");
    return this.http.post<any>(environment.ApiUrl+'/ExportQuesSummary',val, {
      headers: headers,
    });
  }

  usersWiseExportSummary(val){
    const headers= new HttpHeaders().set('Accept', "application/json");
    return this.http.post<any>(environment.ApiUrl+'/ExportUsersQuesSummary',val, {
      headers: headers,
    });
  }

  updateQuestionSummary(){
    const headers= new HttpHeaders().set('Accept', "application/json");
    return this.http.post<any>(environment.ApiUrl+'/UpdateQuestionCounts', {
      headers: headers,
    });
  }
}
