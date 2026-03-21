import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LocationData } from './@Models/location.model'
import { CityState, Countries } from './@Models/country.model';
@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(private http: HttpClient) { }

  getLocation() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<LocationData>(environment.ApiUrl + "/location", {
      headers: headers,
    });
  }
  getAllCountryLocation(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getLocationsByCountry", data, {
      headers: headers,
    });
  }
  getInterestedCountryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<LocationData>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }

  getWorldCountryList() {
    return this.http.get<Countries[]>(environment.ApiUrl + "/getWorldCountries");
  }

  getWorldCityStateList(id: number) {
    return this.http.get<CityState[]>(environment.ApiUrl + "/getworldcitiesstates?country_id=" + id);
  }
}
