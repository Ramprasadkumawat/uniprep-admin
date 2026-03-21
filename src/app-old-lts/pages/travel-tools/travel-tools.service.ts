import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ExportData } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class TravelToolsService {
  headers = new HttpHeaders().set("Accept", "application/json");
  constructor(private http:HttpClient) { }
  getListStartUpGlossary(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/travelGlossaryList',data, {
        headers: headers,
    });
  }
  AddStartUpGlossary(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/addtravelglossary',data, {
        headers: headers,
    });
  }
  UpdateStartUpGlossary(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/editTravelglossary',data, {
        headers: headers,
    });
  }
  investorStartUpGlossary() {
    return this.http.post<ExportData>(environment.ApiUrl + '/exportTravelglossary',{
    })
  }
  investorImport(data: any) {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/importTravelglossary', params)
  }
}
