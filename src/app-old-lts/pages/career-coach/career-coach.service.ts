import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class CareerCoachService {
  baseEmployeeUrl = environment.EmployerApiUrl;
  baseUrl = environment.ApiUrl;

  constructor(private httpClient: HttpClient) {}

  getCareerCoach(data: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/career-coach-transactions`,
      data
    );
  }
}
