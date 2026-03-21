import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class CoupenmanagementService {

  constructor(private http:HttpClient) { }

  getregion():Observable<any> {
    const headers= new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl+'/region',{
      headers: headers,
    });
  }
  username():Observable<any> {
    const headers= new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl+'/couponusertypelist',{
      headers: headers,
    });
  }
  Addcoupen(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/addcoupon',data, {
      headers: headers,
    });
  }
  getcoupenlist(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/getcoupon', data,{
      headers: headers,
    });
  }
  Editcoupen(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/editcoupon', data,{
      headers: headers,
    });
  }
  delete(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/deletecoupon', data,{
      headers: headers,
    });
  }
  getusername(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/getusernamebytype', data,{
      headers: headers,
    });
  }
  getLocationByRegion(region_id:string) {
    return this.http.post<any>(`${environment.ApiUrl}/getlocationbyregionid `,{regionId:region_id});
  }
}
