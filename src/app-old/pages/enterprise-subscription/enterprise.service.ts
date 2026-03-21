import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  enterprisePayload,
  enterpriseResponse,
  updateEnterprisePayload,
} from "src/app/@Models/enterprise.model";
import { ResponseSuccessMessage } from "src/app/@Models/subscribers.model";

@Injectable({
  providedIn: "root",
})
export class EnterpriseService {
  constructor(private http: HttpClient) {}
  getSubscriptions(params: any): Observable<any> {
    return this.http.post<enterpriseResponse>(
      `${environment.ApiUrl}/getsubscriptionmanagerlist`,
      params
    );
  }
  getSubscrptionPlans(): Observable<any> {
    return this.http.get<{ id: string; name: string }[]>(
      `${environment.ApiUrl}/getsubscriptionplanname`
    );
  }
  currencydropdownlist(): Observable<any> {
    return this.http.get<{ id: string; name: string }[]>(
      `${environment.ApiUrl}/currencydropdownlist`
    );
  }
  getSubscriptionCollegeList(params: any): Observable<any> {
    return this.http.post<{ id: string; institutename: string }[]>(
      `${environment.ApiUrl}/getsubscriptionmanagercollege`,
      params
    );
  }
  getSubscriptionCollegeType(): Observable<any> {
    return this.http.get<{ id: string; institute_type: string }[]>(
      `${environment.ApiUrl}/getsubscriptionmanagercollegetype`
    );
  }
  addSubscription(params: enterprisePayload): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}/addsubscriptionmanager`,
      params
    );
  }
  updateSubscription(params: updateEnterprisePayload): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}/updatesubscriptionmanager`,
      params
    );
  }
  deleteSubscription(subscriptionId: number): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}/deletesubscriptionmanager`,
      { subscription_manager_id: subscriptionId }
    );
  }
  shareSubscriptionLink(params: updateEnterprisePayload): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}/updatesubscriptionmanager`,
      params
    );
  }
  assignSubscription(params: {
    subscription_manager_id: string;
    student_ids: any;
  }): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/assignstudents`, params);
  }
  getStudentsFromInstitution(institution_id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}/getstudentlistfrominstitution?institution_id=${institution_id}`
    );
  }
  sendLink(params: { subscription_manager_id: string }) {
    return this.http.post<any>(`${environment.ApiUrl}/sendlink`, params);
  }
  // assignedHistory(params: {subscription_manager_id:string,payment_type:any}){
  //   return this.http.post<any>(`${environment.ApiUrl}/getstudenthistory`, params);
  // }
  assignedHistory(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getstudenthistory",
      data,
      {
        headers: headers,
      }
    );
  }
  Sentalinkseperatly(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/sendlinkperuser", data, {
      headers: headers,
    });
  }
  SentalinkAllAddUsers(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/sendlinktoall", data, {
      headers: headers,
    });
  }
  assignBulkUpload(data: any) {
    let params = new FormData();
    params.append("input", data.file);
    params.append("subscription_manager_id", data.subid);
    params.append("payment_type_id", data.payment_type);
    return this.http.post<ResponseSuccessMessage>(
      `${environment.ApiUrl}/addsubcriptionimport`,
      params
    );
  }
}
