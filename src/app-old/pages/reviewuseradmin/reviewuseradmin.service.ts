import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewuseradminService {

  constructor(private http:HttpClient) { }

  GetOrgList(val:any): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getrevieworglist',val,{ 'headers': headers });
  }

  AdminAddReviewUser(val): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/addreviewuser',val,{ 'headers': headers });
  }

  GetAllReviewUsers(val): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getreviewuserlist',val,{ 'headers': headers });
  }

  DeleteUser(val): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/deletereviewuser',val,{ 'headers': headers });
  }


  UpdateUser(val): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/editreviewuser',val,{ 'headers': headers });
  }

  GetCountries(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/country',{ 'headers': headers });
  }
}
