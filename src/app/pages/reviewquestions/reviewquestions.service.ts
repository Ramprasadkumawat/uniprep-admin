import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class ReviewquestionsService {

  constructor(private http:HttpClient) { }

  GetQuestions(val: any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/GetReadingQues',val,{ 'headers': headers });
  }

  GetOneQuestion(val: any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/reviewquestions',val,{ 'headers': headers });
  }

  SubmitSuggestion(val: any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/SubmitSuggestion',val,{ 'headers': headers });
  }
}
