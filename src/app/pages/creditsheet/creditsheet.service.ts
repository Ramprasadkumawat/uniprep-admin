import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {PageState} from "../store/reducer";
import {selectUserPageData$, selectUserTypes$} from "../store/selectors";
import {createUser, loadUserList, loadUserTypes} from "../store/actions";
import {CreateUserParams, LoadUserParams} from "../../@Models/user.model";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class CreditsheetService {

  constructor(    private store: Store<PageState>,
                  private http:HttpClient
  ) { }

  getuserdetail():Observable<any> {
    const headers= new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/getuserdetails',{ 'headers': headers });
  }
  getCreditSheetCard(val:any):Observable<any> {
    const headers= new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/admincreditsheetcard',val,{ 'headers': headers });
  }
  getCountriesList() {
    const headers= new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.get<any>(environment.ApiUrl+'/country',{ 'headers': headers });
  }
}
