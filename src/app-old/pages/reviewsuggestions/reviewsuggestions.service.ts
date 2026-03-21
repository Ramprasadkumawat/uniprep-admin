import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReviewsuggestionsService {

  constructor(private http:HttpClient) { }
  GetRequestedQuestions(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/GetReqQuesAndResList',val,);
  }
}
