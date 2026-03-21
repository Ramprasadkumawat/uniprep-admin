import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ResponseImportData} from 'src/app/@Models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipmanagementService {

  constructor(
    private http: HttpClient
  ) { }

  getScholarshipList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getscholarshiplist", val, {
      headers: headers,
    });
  }
  getCoverList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getcoverlist",{
      headers: headers,
    });
  }
  addScholarship(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addscholarship", val, {
      headers: headers,
    });
  }
  editScholarshipList(scholarship_id:number){
    let params = new HttpParams();
    params=params.append("scholarship_id",scholarship_id);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getscholarshipbyid",{headers:headers,params:params});
  }
  UpdateScholarshipList(val: any, id: number) {
    val.scholarship_id = id;
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/editscholarshiplist  ", val, {
      headers: headers,
    });
  }

  deleteScholarship(id:any){
    let params = {
      scholar_id : id
    }
    return this.http.post<any>(`${environment.ApiUrl}/deletescholarship`, params);
  }
  getStudyLevel() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getstudylevel", {
      headers: headers,
    });
  }

  getUniversity(countryId: number) {
    let params = new HttpParams();
    const headers = new HttpHeaders().set("Accept", "application/json");
    params = params.append("country_id", countryId)
    return this.http.get<any>(environment.ApiUrl + "/getuniversity", { headers: headers, params: params });
  }
  getScholarshipCountries(scholarship_country: number) {
    let params = new HttpParams();
    params = params.append("scholarship_country", scholarship_country);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", { headers: headers, params: params });
  }
  getScholarshipType() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getscholarshiptype", { headers: headers });
  }

  scholarshipExport(params: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/exportscholarship', params, {
      headers: headers,
    });
  }

  import(data: any) {
    let params = new FormData();
    params.append('input', data);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<ResponseImportData>(environment.ApiUrl + '/importscholarship', params, {
      headers: headers,
    });
  }

  addInstituteToCountry(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addinstitutetocountry", val, {
      headers: headers,
    });
  }
}
