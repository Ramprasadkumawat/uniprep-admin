import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountrymanagementService {
  confirm(arg0: { message: string; header: string; icon: string; accept: () => void; }) {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }
  addcountry(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("country",val.country);
    formData.append("status",val.status);
    formData.append("flag", val.flag);
    return this.http.post<any>(environment.ApiUrl+'/country',formData, {
      headers: headers,
  });
  }

editcountry(val: any):Observable<any> {
  const headers= new HttpHeaders()
  .set('Accept', "application/json")
  const formData = new FormData();
  formData.append("country",val.country);
  formData.append("status",val.status);
  formData.append("flag", val.flag);
  formData.append("countryid", val.countryid);
  return this.http.post<any>(environment.ApiUrl+'/updatecountry',formData, {
    headers: headers,
});
}
  getlistcountry(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getlistcountry',val, {
      headers: headers,
  });
  }
  getCountriesList() {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get<any>(environment.ApiUrl+'/country', {
      headers: headers,
  });
  }
}
