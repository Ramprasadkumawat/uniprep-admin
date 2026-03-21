import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class AssessmentService {
  constructor(private http: HttpClient) {}

  getUsersList(params: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/getassessmentlist`,
      params
    );
  }
  getUserdetail(params: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/getstudentassessmentdetail`,
      params
    );
  }
  getStudentList() {
    return this.http.get<any>(
      `${environment.ApiUrl}/getAssessmentStudentList`
    );
  }
  getBranchList(params: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/CareerPlannerSelectBox`,
      params
    );
  }
  getCollegeList() {
    return this.http.get<any>(
      `${environment.ApiUrl}/getCollegeInstituteName`
    );
  }
  getiLearnList() {
    return this.http.get<any>(
      `${environment.ApiUrl}/getclusterlist`
    );
  }
  userExport(params: any) {
    return this.http.post<any>(environment.ApiUrl + "/userexport", params);
  }
}
