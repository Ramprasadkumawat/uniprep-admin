import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class RevieworganizationService {

  constructor(private http:HttpClient) { }

  GetCountryList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/country',{ 'headers': headers });
  }

  GetOrgList(val):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getrevieworglist',val,{ 'headers': headers });
  }

  GetModules(val:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/ListOfModAndSubmod',val,{ 'headers': headers });
  }


  AddOrg(val:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData
    formData.append("logo",val.logo)
    formData.append("organizationName",val.organizationName)
    formData.append("country",val.country)
    formData.append("moduleSelected",val.moduleSelected)
    formData.append("website",val.website)
    return this.http.post(environment.ApiUrl +'/addrevieworg',formData,{ 'headers': headers });
  }

  DeleteOrg(val):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/deleterevieworg',val,{ 'headers': headers });
  }

  UpdateOrg(val:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData
    formData.append("logo",val.logo)
    formData.append("organizationName",val.organizationName)
    formData.append("country",val.country)
    formData.append("moduleSelected",val.moduleSelected)
    formData.append("website",val.website)
    formData.append("orgId",val.orgId)
    return this.http.post(environment.ApiUrl +'/updaterevieworg',formData,{ 'headers': headers });
  }
}
