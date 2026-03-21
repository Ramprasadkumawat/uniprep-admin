import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class HiringSupportService {
  baseEmployeeUrl = environment.EmployerApiUrl;
  baseUrl = environment.ApiUrl;

  constructor(private httpClient: HttpClient) {}

  getHiringSupport(data: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/hiring-support-transactions`,
      data
    );
  }

  getHiringSupportDropDown() {
    return this.httpClient.get<any>(
      `${environment.ApiUrl}/getyourprofiledropdownvaluespublic`
    );
  }

  getPositionHiringSupportDropDown(data?: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/searchPositionspublic`,
      data
    );
  }

  getLocation(location: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/searchlocationspublic`,{ location }
    );
  }
}
