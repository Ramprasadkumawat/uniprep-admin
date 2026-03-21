import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ResponseSuccessMessage } from "src/app/@Models/subscribers.model";
import {
  CompanySize,
  ExportEmployeeRes,
  TalentEmployerResponse,
} from "src/app/@Models/talent-model";

@Injectable({
  providedIn: "root",
})
export class TalentConnectService {
  baseEmployeeUrl = environment.EmployerApiUrl;
  baseUrl = environment.ApiUrl;

  constructor(private httpClient: HttpClient) { }
  
  getSourceNames(){
      const headers = new HttpHeaders().set("Accept","application/json");
      return this.httpClient.get<any>(environment.ApiUrl + "/source-name-list",{headers: headers});
  }
  // Company Account
  getEmployersList(params: any) {
    return this.httpClient.post<TalentEmployerResponse>(
      `${environment.ApiUrl}/getallemployers`,
      params
    );
  }

  addEmployer(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/addemployerfromadmin`,
      params
    );
  }

  exportEmployee(params: any) {
    return this.httpClient.post<ExportEmployeeRes>(
      environment.ApiUrl + "/exportallemployers",
      params
    );
  }

  importEmployer(val: any) {
    let params = new FormData();
    params.append("csv_file", val);
    return this.httpClient.post<any>(
      environment.ApiUrl + "/import-employers",
      params
    );
  }

  approveEmployer(params: any) {
    return this.httpClient.post<ExportEmployeeRes>(
      environment.ApiUrl + "/approveemployer",
      params
    );
  }

  rejectEmployer(params: any) {
    return this.httpClient.post<ExportEmployeeRes>(
      environment.ApiUrl + "/rejectemployer",
      params
    );
  }

  getCompanyList(params: any) {
    return this.httpClient.post<any>(
      environment.ApiUrl + "/getadmincompanylist",
      params
    );
  }
  exportCompanyList(params: any) {
    return this.httpClient.post<any>(
      environment.ApiUrl + "/exporttalentconnectcompanies",
      params
    );
  }

  exportJobs(val: any): Observable<any> {
    return this.httpClient.post(environment.ApiUrl + "/exportcontributor", val);
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders();
    return this.httpClient.get(url, { responseType: "blob", headers: headers });
  }

  //jobs.component
  getJobDropDownList() {
    const headers = new HttpHeaders();
    return this.httpClient.get<any>(environment.ApiUrl + "/AdminDropdownList", {
      headers: headers,
    });
  }

  getWorkLocationList() {
    const headers = new HttpHeaders();
    return this.httpClient.get<any>(
      environment.ApiUrl + "/easyappyworklocations",
      { headers: headers }
    );
  }

  getJobsLists(params: any) {
    const headers = new HttpHeaders();
    return this.httpClient.post<any>(
      environment.ApiUrl + "/AdminJobList",
      params,
      { headers: headers }
    );
  }


  getExportJobData(params: any): Observable<Blob> {
    return this.httpClient.post(
      `${environment.ApiUrl}/AdminJobList`,
      params,
      {
        responseType: 'blob' as const
      }
    );
  }

  getCandidateLists(params: any) {
    const headers = new HttpHeaders();
    return this.httpClient.post<any>(
      environment.ApiUrl + "/AdminjobTrackList",
      params,
      { headers: headers }
    );
  }

  getJobDetails(id: number) {
    const headers = new HttpHeaders();
    return this.httpClient.post<any>(
      environment.ApiUrl + "/showuserJobs",
      { id: id },
      { headers: headers }
    );
  }

  //Companies Page
  getCompanySize() {
    return this.httpClient.get<CompanySize[]>(
      `${environment.ApiUrl}/getcompanysize`
    );
  }

  getCompanyTypes() {
    return this.httpClient.get<any>(`${environment.ApiUrl}/getcompanytypes`);
  }

  getIndustryTypes() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.get<any>(environment.ApiUrl + "/getindustrytypes", {
      headers: headers,
    });
  }

  getGlobalPresenceList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(
      environment.ApiUrl + "/globalPresence",
      { countryId: 1 },
      {
        headers: headers,
      }
    );
  }

  getHeadQuartersList() {
    return this.httpClient.post<any>(`${environment.ApiUrl}/getcitywithflag`, {
      countryId: 1,
    });
  }
  verifyCompany(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/verifycompany`,
      params
    );
  }
  selectedverifyCompany(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/selectedverifycompany`,
      params
    );
  }
  getTalentconnectList(params: any) {
    return this.httpClient.post<any>(
      environment.ApiUrl + "/talentconnectlist",
      params
    );
  }
  getjobpostingList(params: any) {
    return this.httpClient.post<any>(
      environment.ApiUrl + "/jobpostinglist",
      params
    );
  }
  getDropdownData(): Observable<any> {
    return this.httpClient.get<any>(
      environment.EmployerApiUrl + "/easyappydropdownlist"
    );
  }
  getWorkLocationDropdownData(): Observable<any> {
    return this.httpClient.get<any>(
      environment.ApiUrl + "/easyappyworklocations"
    );
  }
  getLocation() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.get<any[]>(environment.ApiUrl + "/location", {
      headers: headers,
    });
  }
  getStudentProfilesDropDownList() {
    return this.httpClient.get<any>(
      environment.ApiUrl + "/getyourprofiledropdownvalues"
    );
  }
  getCityCountries(search?: string) {
    return this.httpClient.get<any>(
      environment.ApiUrl + `/getworldcitiescountry?search=${search ?? ""}`
    );
  }
  getWorkPlaces(search?: string) {
    return this.httpClient.get<any>(
      environment.ApiUrl + `/getWorkPlaces?search=${search ?? ""}`
    );
  }
  getAdminStudentProfile(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/getadminstudentprofile`,
      params
    );
  }
  getAdmintalentConnectList(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/getadmintalentconnectlist`,
      params
    );
  }

  getExportTalentData(params: any): Observable<Blob> {
    return this.httpClient.post(
      `${environment.ApiUrl}/getadmintalentconnectlist`,
      params,
      {
        responseType: 'blob' as const
      }
    );
  }

  selectedverifyStudent(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/selectedverifystudent`,
      params
    );
  }
  verifyStudent(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/verifystudent`,
      params
    );
  }
  getTalentCompanyConnectList(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/gettalentcompanyconnectlist`,
      params
    );
  }
  getAppliedJobList(params: any) {
    return this.httpClient.post<any>(
      `${environment.ApiUrl}/getappliedjoblist`,
      params
    );
  }
  addFollowUpRemarks(val: any): Observable<any> {
    return this.httpClient.post<ResponseSuccessMessage>(`${environment.ApiUrl}/submitemployerRemarks`, val);
  }
  getRemarksFollowUpList(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.httpClient.post<any>(`${environment.ApiUrl}/getemployerRemarks`, data);
  }
  getViewStudentAssignTo(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.httpClient.get<ResponseSuccessMessage>(`${environment.ApiUrl}/getemployerRemarkslist`);
  }

  getRegisteredCompanies(): Observable<any> {
    return this.httpClient.get(`${environment.ApiUrl}/getRegisteredCompanies`);
  }

  updateSuccessPlacement(val: any): Observable<any> {
    return this.httpClient.post(`${environment.ApiUrl}/updateSuccessPlacement`, val);
  }

  deleteSuccessPlacement(val: any): Observable<any> {
    return this.httpClient.post(`${environment.ApiUrl}/deleteSuccessPlacement`, val);
  }

  getCampusSelction(): Observable<any> {
    return this.httpClient.get(`${environment.ApiUrl}/getcampusselection`);
  }
  
  rejectStudentProfile(val: any): Observable<any> {
    return this.httpClient.post(`${environment.ApiUrl}/reject-student-profile`, val);
  }
}
