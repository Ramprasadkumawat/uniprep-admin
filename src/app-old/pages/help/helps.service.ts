import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ExportData } from 'src/app/@Models/subscribers.model';
@Injectable({
  providedIn: 'root'
})
export class HelpsService {

  constructor(private http: HttpClient) { }
  getHelpCategories(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/helpsupportcategorylist', data, {
      headers: headers,
    });
  }
  AddHelp(data: any): Observable<any> {

    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/addhelp', data, {
      headers: headers,
    });
  }
  UpdateHelp(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/updatehelp', data, {
      headers: headers,
    });
  }
  getHelp(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/helpsupportbycategory', data, {
      headers: headers,
    });
  }
  delete(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/deletehelp', data, {
      headers: headers,
    });
  }
  helpAndSuppQuerExport() {
    return this.http.post<ExportData>(environment.ApiUrl + '/helpsupportqueriesexport',{
    })
  }
}
