import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class CareerPlannerService {

  constructor(private http: HttpClient) { }

  getSubAndSpecialization(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CareerPlannerSelectBox", {
      headers: headers,
    });
  }

  getCountriesAndJobOption(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/LoadJobOptionAndCountries", {
      headers: headers,
    });
  }

  addNewSelectBoxValue(newvalue: any){
    return this.http.post<any>(environment.ApiUrl + '/AddNewDropDownValue', newvalue);
  }

  store(data: any){
    return this.http.post<any>(environment.ApiUrl + '/AdminStoreCareerPlanners', data);
  }

  listPage(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AdminListPage", data ,{
      headers: headers,
    });
  }

  update(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpdateCareer", data ,{
      headers: headers,
    });
  }

  import(data: any){
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/importCareerPlanner', params);
  }

  export(data: any){
    return this.http.post<any>(environment.ApiUrl + '/ExportCareerPlanner', data);
  }

  loadJobsites(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/JobsiteLists", data ,{
      headers: headers,
    });
  }

  countriesLoading(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AllCountries" ,{
      headers: headers,
    });
  }

  jobSiteStore(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StoreJobsite", data ,{
      headers: headers,
    });
  }

  jobsiteUpdate(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpdateJobsite", data ,{
      headers: headers,
    });
  }

  jobsiteExport(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ExportJobsite", data ,{
      headers: headers,
    });
  }

  jobssiteImport(data: any){
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/ImportJobsite', params);
  }
}
