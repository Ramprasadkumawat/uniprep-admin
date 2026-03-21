import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { SourceTypes } from 'src/app/@Models/subscribers.model';
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http:HttpClient) { }
  GetCountryList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get<any>(environment.ApiUrl+'/country', {
      headers: headers,
  });
  }
  addevent(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("eventname",val.eventname);
    formData.append("companylogo",val.companylogo);
    formData.append("speakername", val.speakername);
    formData.append("designation",val.designation);
    formData.append("eventlink",val.eventlink);
    formData.append("date", val.date);
    formData.append("country",val.country);
    formData.append("from",val.from);
    formData.append("to", val.to);
    formData.append("eventdescription", val.eventdescription);
    formData.append("location", val.location);
    formData.append("region", val.region);
    formData.append("eventslots",val.eventslots);
    formData.append("collegename",val.collegename)
    return this.http.post<any>(environment.ApiUrl+'/AddEvent',formData, {
      headers: headers,
  });
  }
  updateEvent(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("eventname",val.eventname);
    formData.append("companylogo",val.companylogo);
    formData.append("speakername", val.speakername);
    formData.append("designation",val.designation);
    formData.append("eventlink",val.eventlink);
    formData.append("date", val.date);
    formData.append("country",val.country);
    formData.append("from",val.from);
    formData.append("to", val.to);
    formData.append("eventdescription", val.eventdescription);
    formData.append("location", val.location);
    formData.append("region", val.region);
    formData.append("eventslots",val.eventslots);
    formData.append("collegename",val.collegename);
    formData.append("event_id",val.event_id)
    return this.http.post<any>(environment.ApiUrl+'/EditEvent',formData, {
      headers: headers,
  });
  }
  getlistevent(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/FilterEvent',val, {
      headers: headers,
  });
  }
  getListPastevent(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/PastEvent',val, {
      headers: headers,
  });
  }
  getRegion() {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetRegions`);
  }
  getLocationByRegion(region_id:string) {
    return this.http.post<any>(`${environment.ApiUrl}/getlocationbyregionid `,{regionId:region_id});
  }
  getCollegeName(val:any) {
    return this.http.post<any>(`${environment.ApiUrl}/getcollegelist `,val);
  }
  deleteEvents(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/deleteevent',val, {
      headers: headers,
  });
  }
}
