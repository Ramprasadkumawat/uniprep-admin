import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OurManagementService {

  constructor(private http: HttpClient) { }

  getMemberManagementList(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpagemanagementshow`, val);
  }

  bulkUploadFile(data: any) {
    let params = new FormData();
    params.append('file', data);
    return this.http.post<any>(`${environment.ApiUrl}/managementimport`, params);
  }

  addMemberManagementData(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpagemanagementstore`, val);
  }

  updateMemberManagementData(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpagemanagementupdate`, val);
  }

  getDropDownList(): Observable<any> {
    return this.http.get<any>(`${environment.ApiUrl}/landingpagedropdownlists`);
  }
}

