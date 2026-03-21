import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddcollegesService {

  constructor(private http:HttpClient) { }
  addcollege(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl+'/addcollege',val,{ 'headers': headers });
  }
  editcollege(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl+'/editcollege',val,{ 'headers': headers });
  }
  getlistcollege(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl+'/getcollege',val,{ 'headers': headers });
  }
  deleteCollege(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl+'/deletecollege',val,{ 'headers': headers });
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
  
}
