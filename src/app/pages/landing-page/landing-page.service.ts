import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LandingPageService {
  constructor(private http: HttpClient) { }

  addLandingPageData(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpagestore`, val);
  }

  updateLandingPageData(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/pageupdate`, val);
  }

  editLandingPageData(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageupdate`, val);
  }

  getLandingPageList(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageshow`, val);
  }


  getLandingPageById(val: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageedit`, val);
  }

  getDropDownList(): Observable<any> {
    return this.http.get<any>(`${environment.ApiUrl}/landingpagedropdownlists`);
  }

  getCategoryById(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/CategoryEdit`, data);
  }

  addCategoryData(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/categoryadd`, data);
  }

  editCategoryData(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/categoryupdate`, data);
  }

  getLandingCategoryTags(id: number) {
    return this.http.post<any>(environment.ApiUrl + "/Categorytags", { id: id });
  }


}
