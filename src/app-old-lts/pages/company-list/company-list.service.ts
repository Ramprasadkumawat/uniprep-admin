import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import {ExportData} from "../../@Models/subscribers.model";
import {ResponseReadingData} from "../../@Models/reading.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {
  constructor(private http: HttpClient) { }

  getCompanyList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfCompanies",val, {
      headers: headers,
    });
  }

  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/CompanySelectValues", {
      headers: headers,
    });
  }

  addCompanyInfo(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StoreCompanyInfo",data, {
      headers: headers,
    });
  }

  updateCompanyInfo(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpdateCompanyData",data, {
      headers: headers,
    });
  }

  export(data: any) {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportCompanies',data,{
    })
  }

  import(data: any) {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/ImportCompanies', params)
  }

  getHeadQuartersOptions(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetHeadQuartersForCompany", {
      headers: headers,
      selectedCountry : data
    });
  }

  deleteCompany(id: number){
    return this.http.post<any>(environment.ApiUrl + '/DeleteCompany', {id: id});
  }
}
