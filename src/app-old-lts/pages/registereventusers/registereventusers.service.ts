import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class RegistereventusersService {

  constructor(private http:HttpClient) { }
  getEventUsersList(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/registereventusers', data,{
      headers: headers,
    });
  }
  GetLocationList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/location',{ 'headers': headers });
  }
  GetEventList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/geteventnamelist',{ 'headers': headers });
  }
}
