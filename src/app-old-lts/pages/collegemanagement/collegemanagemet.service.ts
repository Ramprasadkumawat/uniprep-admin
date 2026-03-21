import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CollegemanagemetService {

  constructor(private http:HttpClient) { }
  getcollegelist(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/getcollegetype', data,{
        headers: headers,
    });
  }
  getcollegename():Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl+'/getCollegeInstituteName',{
        headers: headers,
    });
  }
  getregion():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl+'/region',{ 'headers': headers });
  }
  getdistrict(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl+'/getlocationbyregionid',val,{ 'headers': headers });
  }
  getinstitute():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl+'/getmarketinginstitute',{ 'headers': headers });
  }
}
