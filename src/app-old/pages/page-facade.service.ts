import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ProgramLevelData } from '../@Models/program-level.model';
import { CountryData } from '../@Models/country.model';
import { SourceTypes } from '../@Models/subscribers.model';
import { LocationData } from '../@Models/location.model';
import { CreditData } from '../@Models/credit.model';
import { Observable, shareReplay } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PageFacadeService {
  public getUserType$: Observable<any> | null = null;
  public countries$: Observable<any> | null = null;
  public programLevel$: Observable<any> | null = null;
  public credits$: Observable<any> | null = null;
  public leadsStatus$: Observable<any> | null = null;
  public studentType$: Observable<any> | null = null;
  public sourceType$: Observable<any> | null = null;
  public userBehaviour$: Observable<any> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  resetAll() {
    this.getUserType$ = null;
    this.countries$ = null;
    this.programLevel$ = null;
    this.credits$ = null;
    this.leadsStatus$ = null;
    this.studentType$ = null;
    this.sourceType$ = null;
    this.userBehaviour$ = null;
  }
  getRegion() {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetRegions`);
  }

  getHomeCountry(homeCountryId: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
      headers: headers,
    });
  }

  getinstitute() {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get<any>(`${environment.ApiUrl}/getmarketinginstitute`);
  }

  getUserTypes() {
    if (!this.getUserType$) {
      this.getUserType$ = this.http.get<any>(`${environment.ApiUrl}/GetSourceTypes`).pipe(
        shareReplay(1)
      );
    }
    return this.getUserType$;
  }
  getCountries() {
    if (!this.countries$) {
      this.countries$ = this.http.get<CountryData>(`${environment.ApiUrl}/country`).pipe(
        shareReplay(1)
      );
    }
    return this.countries$;
  }
  getHomeCountries(homeCountryId: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
      headers: headers,
    });
  }
  getProgaramLevels() {
    if (!this.programLevel$) {
      this.programLevel$ = this.http.get<any>(`${environment.ApiUrl}/programlevel`).pipe(
        shareReplay(1)
      );
    }
    return this.programLevel$;
  }
  getLocations() {
    return this.http.get<LocationData>(`${environment.ApiUrl}/location`);
  }
  getCredits() {
    if (!this.credits$) {
      this.credits$ = this.http.post<CreditData>(`${environment.ApiUrl}/getquestioncredits`, {}).pipe(
        shareReplay(1)
      );
    }
    return this.credits$;
  }
  getSourceTypes(student_type_id?: number) {
    let params = new HttpParams();
    if (student_type_id) {
      params = params.set('student_type_id', student_type_id.toString());
    }
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/sourcetype`, { params });
  }
  getSourceTypesNoPayLoads() {
    if (!this.sourceType$) {
      this.sourceType$ = this.http.get<SourceTypes>(`${environment.ApiUrl}/sourcetype`, {}).pipe(
        shareReplay(1)
      );
    }
    return this.sourceType$;
  }
  getLeadStatus() {
    if (!this.leadsStatus$) {
      this.leadsStatus$ = this.http.get<any>(`${environment.ApiUrl}/leadstatus`).pipe(
        shareReplay(1)
      );
    }
    return this.leadsStatus$;
  }
  getStudentType() {
    if (!this.studentType$) {
      this.studentType$ = this.http.get<any>(`${environment.ApiUrl}/StudentLeadType`).pipe(
        shareReplay(1)
      );
    }
    return this.studentType$;
  }
  userBehaviour() {
    if (!this.userBehaviour$) {
      this.userBehaviour$ = this.http.post<any>(`${environment.ApiUrl}/getuserbehaviourtypes`,{}).pipe(
        shareReplay(1)
      );
    }
    return this.userBehaviour$;
  }
  getEnterpriseCollegeList() {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/getsubscribedcollege`);
  }
  getSourceName(id: number) {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetSourceName?sourcetype_id=${id}`);
  }
  getSourceNameWithMultipleParam(params: any) {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetSourceName?sourcetype_id=${params["source"]}&region_id=${params["region_id"]}&location_id=${params["location_id"]}`);
  }
  getSourceNameTwo(id: number, source_id: number) {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/GetSourceNameTwo?sourcetype_id=${id}&source_id=${source_id}`);
  }
  getSourceList(data: any) {
    return this.http.post<any>(environment.ApiUrl + '/sourcelistbysourcetype', data, {
    });
  }
  getSources() {
    return this.http.post<any>(`${environment.ApiUrl}/SourceList`, {});
  }
  getSourceNameBySoucreId(params: any) {
    return this.http.post<any>(`${environment.ApiUrl}/SourceNameBySourceid`, params);
  }

  getUsertypelist() {
    return this.http.get<SourceTypes>(`${environment.ApiUrl}/usertypelist`);
  }

  subscriptionChangePermission() {
    return this.http.get<any>(`${environment.ApiUrl}/subscriptionChangePermission`);
  }
  getInviteList(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/getmyInvites`, data);
  }
}
