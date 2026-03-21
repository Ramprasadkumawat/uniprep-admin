import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import {ExportData} from "../../@Models/subscribers.model";
import {ResponseReadingData} from "../../@Models/reading.model";

@Injectable({
  providedIn: 'root'
})
export class InvestorService {

  constructor(private http: HttpClient) { }

  getInvestorList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfInvestors",val, {
      headers: headers,
    });
  }

  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SelectBoxValues",{}, {
      headers: headers,
    });
  }

  addInvestor(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AddInvestor",data, {
      headers: headers,
    });
  }

  updateInvestor(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpdateInvestor",data, {
      headers: headers,
    });
  }

  export(data: any) {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportInvestors',data,{
    })
  }

  import(data: any) {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/ImportInvestors', params)
  }

  getHeadQuartersOptions(data: any){
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/GetHeadQuartersbyCountry', {selectedCountry: data});
  }

  deleteInvestors(id: number){
    return this.http.post<any>(environment.ApiUrl + '/DeleteInvestor', {id: id});
  }
}
