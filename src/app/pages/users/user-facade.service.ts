import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PageState} from "../store/reducer";
import {selectUserPageData$, selectUserTypes$} from "../store/selectors";
import {createUser, loadUserList, loadUserTypes} from "../store/actions";
import {CreateUserParams, LoadUserParams, UserResponse, UsersData} from "../../@Models/user.model";
import { HttpClient } from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {

  constructor(
      private store: Store<PageState>,
      private http: HttpClient
  ) { }

  userPageData$() {
    return this.store.select(selectUserPageData$);
  }
  userTypes$() {
    return this.store.select(selectUserTypes$);
  }
  loadUsers(data: LoadUserParams) {
    this.store.dispatch(loadUserList({data}));
  }
  loadUserTypes() {
    this.store.dispatch(loadUserTypes());
  }
  createUser(data: CreateUserParams) {
    this.store.dispatch(createUser({data}));
  }
  getUsers(params: any) {
    return this.http.post<UsersData>(`${environment.ApiUrl}/userfilter`, params);
  }
  addUser(params: CreateUserParams){
    return this.http.post<UserResponse>(`${environment.ApiUrl}/adminadduser`, params);
  }
  updateUser(params: CreateUserParams){
    return this.http.post<UserResponse>(`${environment.ApiUrl}/adminedituser`, params);
  }
  deleteUser(id: number){
    let params = {
      userId : id
    }
    return this.http.post<UserResponse>(`${environment.ApiUrl}/deleteinternaluser`, params);
  }
  getCompany(){
    return this.http.get<any>(`${environment.ApiUrl}/internalcompanies`)
  }
  SourceByUserType(usertypeId:string,id?:any){
    let params = {
      usertype : usertypeId,
      id : id
    }
    return this.http.post<any>(`${environment.ApiUrl}/GetUsersbyUserType`, params);
  }
  getLocationByRegion(region_id:string) {
    return this.http.post<any>(`${environment.ApiUrl}/getlocationbyregionid `,{regionId:region_id});
  }

  userExport(params: any) {
    return this.http.post<any>(environment.ApiUrl + '/userexport', params)
  }
  
  UserImport(Filedata: any) {
    let data = new FormData();
    data.append('input', Filedata);
    return this.http.post<any>(`${environment.ApiUrl}/UsersManagementImport`, data);
  }

  getInstitutionList(value:any){
    
    return this.http.post<any>(`${environment.ApiUrl}/GetEduInstitutions`,value);
  }

  SubmitAssignInstitute(data:any){
    return this.http.post<any>(`${environment.ApiUrl}/StoreAssignInstitution`,data);
  }

  UpdateAssignInstitute(data:any){
    return this.http.post<any>(`${environment.ApiUrl}/UpdateAssignInstitution`,data);
  }

  GetAssInstituteList(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/AssignInstitutionsList`,data);
  }

  DeleteAssignedInstitution(DeleteId:any){
    return this.http.post<any>(`${environment.ApiUrl}/DeleteAssignedInstitution`,DeleteId);
  }

  AssignInstitutionExport(data:any){
    return this.http.post<any>(`${environment.ApiUrl}/AssignInstitutionExport`,data);
  }
}
