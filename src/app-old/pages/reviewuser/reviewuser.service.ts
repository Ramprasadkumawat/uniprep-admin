import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewuserService {

  constructor(private http:HttpClient) { }

  GetUserData(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/getuserdetails',{ 'headers': headers });
  }

  AddReviewUser(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/addreviewuser',val,{ 'headers': headers });
  }

  GetReviewUsers():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/review/UsersLists',{ 'headers': headers });
  }

}
