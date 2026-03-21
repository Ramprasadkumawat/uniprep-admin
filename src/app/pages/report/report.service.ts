import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class QAReportService {
  constructor(private http: HttpClient) {}
  StoredReportData: any;
  getQAReport(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/qareportlist", data, {
      headers: headers,
    });
  }
  getSubModules(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetSubmodulesNameList", data, {
      headers: headers,
    });
  }
  getModules(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/modulecountry", {
      headers: headers,
    });
  }
  getleadtype() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/subscriptiontypes", {
      headers: headers,
    });
  }
  getReportOptionList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/reportoption", {
      headers: headers,
    });
  }
  getReportDataForExport(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/QandAReportExport", data, {
      headers: headers,
    });
  }

  getQuestionReportByQuesId(rowData: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetReportsByQuesId", rowData, {
      headers: headers,
    });
  }

  updateSuggestionInReport(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ResolveReport", data, {
      headers: headers,
    });
  }
}
