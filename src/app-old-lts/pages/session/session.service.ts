import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { LocationData } from '../../@Models/location.model';
import { SourceTypes } from '../../@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient) { }

  GetCountryList(homeCountryId:number): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
        headers: headers,
    });
  }

  getLocations() {
    return this.http.get<LocationData>(`${environment.ApiUrl}/location`);
  }

  getRegion() {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetRegions`);
  }

  getLocationByRegion(region_id:string) {
    return this.http.post<any>(`${environment.ApiUrl}/getlocationbyregionid `,{regionId:region_id});
  }

  getInstitutesByLocation(location_id:string) {
    return this.http.post<any>(`${environment.ApiUrl}/getinstitutesbylocation `,{location_id:location_id});
  }

  GetSpeakerList(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getspeakerlist`, {
        headers: headers,
    });
  }

  getAllEmployees() {
    return this.http.get<any>(`${environment.ApiUrl}/getallemployees`);
  }

  addSession(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/addsession',val,);
  }
}
