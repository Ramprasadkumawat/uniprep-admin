import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AddreviewquestionService {

  constructor(private http:HttpClient) { }

  GetModuleName(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/modulecountry',{ 'headers': headers });
  }

  GetSubmoduleName(val: any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/GetSubmodulesNameList',val,{ 'headers': headers });
  }

  AddRequestedQuestion(val: any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/GetSubmodulesNameList',val,{ 'headers': headers });
  }

  Countrylist(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/country',{ 'headers': headers });
  }
}
