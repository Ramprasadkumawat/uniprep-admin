import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { SubscriptionPlanResponse } from "src/app/@Models/subscription";

@Injectable({
  providedIn: "root",
})
export class EmployerSubscriptionService {
  constructor(private http: HttpClient) { }
  getEmployerSubscriptions(params: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/getemployersubscriptionplanlists`, params);
  }

  addEmployerSubscriptions(params: any): Observable<any> {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/addemployersubscriptionplan`, params);
  }

  editEmployerSubscriptions(params: any): Observable<any> {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/updateemployersubscriptionplan`, params);
  }

  deleteEmployerSubscriptions(id: any): Observable<any> {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/deleteemployersubscriptionplan`, { id });
  }

  getCountryList() {
    return this.http.get<any>(
      `${environment.ApiUrl}/getWorldCountries`
    );
  }
}
