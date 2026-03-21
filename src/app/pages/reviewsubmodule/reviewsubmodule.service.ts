import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReviewsubmoduleService {

  constructor(private http:HttpClient) { }

  GetSubModules(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/review/submodules',val,{ 'headers': headers });
  }
}

