import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { PageState } from "../store/reducer";
import { selectUserPageData$, selectUserTypes$ } from "../store/selectors";
import { createUser, loadUserList, loadUserTypes } from "../store/actions";
import { CreateUserParams, LoadUserParams } from "../../@Models/user.model";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
@Injectable({
  providedIn: "root",
})
export class StudentlistService {
  constructor(
    private store: Store<PageState>,
    private http: HttpClient,
  ) {}

  getStudentsList(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getstudentslist", val, {
      headers: headers,
    });
  }

  getProgramLevelList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/programlevel", {
      headers: headers,
    });
  }

  getRegionList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/region", {
      headers: headers,
    });
  }

  getLocationList(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getlocationbyregionid",
      val,
      { headers: headers },
    );
  }

  getCountriesList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }
}
