import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  constructor(private http: HttpClient, private router: Router) {}

  getTicketList(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getchatreportlist",
      data,
      {
        headers: headers,
      }
    );
  }
  getOptions() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/chatreportoptions", {
      headers: headers,
    });
  }
  sendreportMail(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/sentemailreportresolved",
      data,
      {
        headers: headers,
      }
    );
  }
  exportReport(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/chatreportexport",
      data,
      {
        headers: headers,
      }
    );
  }
}
