import { ErrorHandler, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class LeaddashboardService {
  constructor(private http: HttpClient) {}

  GetPassingYearData(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(
      environment.ApiUrl + "/getpassingyeargraphcount",
      val,
      { headers: headers },
    );
  }
  GetDashboadCardCount(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(environment.ApiUrl + "/getuserdashcardcount", val, {
      headers: headers,
    });
  }
  GetUsersDaily(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(environment.ApiUrl + "/getusercountbydate", val, {
      headers: headers,
    });
  }
  GetCountryList(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/country", { headers: headers });
  }
  getregion(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/region", { headers: headers });
  }
  getleadstatus(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/leadstatus", {
      headers: headers,
    });
  }
  GetSourcetypeList(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/sourcetype", {
      headers: headers,
    });
  }
  GetSourceBySourcetype(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(environment.ApiUrl + "/getsourcebysourcetype", val, {
      headers: headers,
    });
  }

  GetProgramList(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/programlevel", {
      headers: headers,
    });
  }
  GetGenderChartData(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(
      environment.ApiUrl + "/getgenderwisegraphcount",
      val,
      { headers: headers },
    );
  }
}
