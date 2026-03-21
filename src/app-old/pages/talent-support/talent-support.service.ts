import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class TalentSupportService {
  baseEmployeeUrl = environment.EmployerApiUrl;
  baseUrl = environment.ApiUrl;

  constructor(private httpClient: HttpClient) {}

  getTalentSupport(data: any) {
    return this.httpClient.post<any>(`${environment.ApiUrl}/talent-support-transactions`, data);
  }
}
