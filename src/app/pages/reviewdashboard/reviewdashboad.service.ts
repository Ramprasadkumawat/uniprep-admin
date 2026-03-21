import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class ReviewdashboadService {

  constructor(private http:HttpClient) { }

  GetDashData(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/review/QuestionCount',{ 'headers': headers });
  }
}
