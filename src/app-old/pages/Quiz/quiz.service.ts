import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from "@env/environment";
import { ResponseSuccessMessage } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient, private toaster: MessageService) { }
  getQuizQuestion(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/filterquizquestion', req)
  }

  getModuleNameByCountry(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/modulecountry', req)
  }

  addQuizQuestion(req: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/addquizquestions', req, {
      headers: headers,
    })
  }

  updateQuizQuestions(req: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/updatequizquestions', req, {
      headers: headers,
    })
  }

  getUniPrepQuestion(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/getmodulequestionsquiz', req)
  }

  getPreApplicationSubModule(): Observable<any> {
    return this.http.get(environment.ApiUrl + '/preapplicationsubmodule')
  }
  getPreUniversityCountrywiseList(req: any): Observable<any> {
    return this.http.post(environment.ApiUrl + '/getuniversitybycountry', req)
  }
  getsubmoduleid(data): Observable<any> {
    return this.http.post(environment.ApiUrl + '/getsubmodulesbymodule', data)
  }
  deleteQuiz(data): Observable<any> {
    return this.http.post(environment.ApiUrl + '/deletequizquestion', data)
  }
  // bulkUploadFile(data): Observable<any> {
  //   return this.http.post(environment.ApiUrl + '/QuizQuestionsImport',data)
  // }
  bulkUploadFile(data: any) {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/QuizQuestionsImport`, params);
  }
  getlearninghublist(value): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    if (value?.category_flag) {
      let url = `${environment.ApiUrl}/getlearninghublists?category_flag=1`;

      return this.http.get<any>(url, {
        headers: headers,
      });
    } else {
      let url = `${environment.ApiUrl}/getlearninghublists?category_id=${value.category_id}`;
      return this.http.get<any>(url, {
        headers: headers,
      });
    }
  }
  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders();
    return this.http.get(url, { responseType: 'blob', headers: headers });
  }
  QuesExport(params: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/exportquizquestionslh', params)
  }
  quesExportAll(params: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/QuizQuestionsExport', params)
  }
  importFile(data: any) {
    let params = new FormData();
    params.append('input', data);
    params.append('country_id', '0');
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/QuizQuestionsImport`, params);
  }
  // language quiz
  getLanguagehublist(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/getlanguages', {
      headers: headers,
    })
  }
  getLanguagehubtype(data:any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/getlanguagetype',data, {
      headers: headers,
    })
  }
  getLanguageQuizQuestion(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/languagequizlist', req)
  }
  addLanguageQuizQuestion(req: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/addlanguagequiz', req, {
      headers: headers,
    })
  }
  deleteLaguageQuiz(data): Observable<any> {
    return this.http.post(environment.ApiUrl + '/deletelanguagequiz', data)
  }
  updateLanguageQuizQuestions(req: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/updatelanguagequiz', req, {
      headers: headers,
    })
  }
  importLanguageFile(data: any) {
    let params = new FormData();
    params.append('input', data);
    // params.append('country_id', '0');
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/importlanguagehubquizquestions`, params);
  }

  exportLanguageHubQuiz(data: any){
    return this.http.post<any>(`${environment.ApiUrl}/exportLanguagequizlist`, data);
  }
}
