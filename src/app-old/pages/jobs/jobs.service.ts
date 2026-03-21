import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JobsService {
  headers = new HttpHeaders().set("Accept", "application/json");
  private jobToEdit: any = null;
  constructor(private http: HttpClient) {}

  getJobs(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/company-job-list-foradmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  createJob(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/create-job-byadmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  updateJob(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/update-job-byadmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  showJob(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/show-job-foradmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  exportJobs(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/export-jobs-foradmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  getCompanies() {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-companies",
      {
        headers: this.headers,
      },
    );
  }

  getDropdownData(): Observable<any> {
    return this.http.get<any>(
      environment.ApiUrl + "/easyapply-admin-dropdownlist",
    );
  }

  getWorkLocationDropdownData(): Observable<any> {
    return this.http.get<any>(
      environment.ApiUrl + "/easyapply-admin-worklocations",
    );
  }

  createPositionTitle(paramData: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/add-position-byadmin",
      paramData,
    );
  }

  aiGenerate(mode: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + "/job-ai-generate", mode);
  }

  setJobToEdit(job: any) {
    this.jobToEdit = job;
  }

  getJobToEdit() {
    return this.jobToEdit;
  }

  clearJobToEdit() {
    this.jobToEdit = null;
  }

  setFormData(_data: any) {}

  getJobCreditCount(data: any) {
    return this.http.post(
      `${environment.ApiUrl}/add-credit-count-by-job`,
      data,
    );
  }

  importJobs(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/import-job-byadmin",
      data,
      {
        headers: this.headers,
      },
    );
  }

  postJobShareData(req: any) {
    return this.http.post<any>(`${environment.ApiUrl}/job-share-url`, req);
  }
}