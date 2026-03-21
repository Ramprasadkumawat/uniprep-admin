import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http:HttpClient) {}

    GetCountryList(): Observable<any> {
      const headers= new HttpHeaders()
      .set('Accept', "application/json")
      return this.http.post(environment.ApiUrl +'/review/GetCountriesForOrg',{ 'headers': headers });
    }

    GetUserDetails():  Observable<any> {
      const headers= new HttpHeaders()
      .set('Accept', "application/json")
      return this.http.get(environment.ApiUrl +'/getuserdetails',{ 'headers': headers });
    }


 
}
