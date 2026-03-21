import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class UserTrackingService {

  constructor(private http:HttpClient) { }

  getUserTrackingList(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl +`/gettrackinglist`, {},{ 'headers': headers });
  }

  getUpdateFilter(values: any): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl +`/gettrackinglist`,  values,{ 'headers': headers });
  }

  getDevice(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +`/getdevices`,{ 'headers': headers });
  }

  getSourceType(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +`/sourcetype`,{ 'headers': headers });
  }

  getSourceNameDropdown(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl +`/sourcenamedropdown`,{ 'headers': headers });
  }

  getLocation(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl +`/getlocations`,{ 'headers': headers });
  }

  getCountryList(): Observable<any> {
    const headers= new HttpHeaders().set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl +`/getcountrylist`,{ 'headers': headers });
  }

  exportLeadUserTracking(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/exportusertracking", data ,{
      headers: headers,
    });
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders();
    return this.http.get(url, { responseType: 'blob', headers: headers });
  }
}
