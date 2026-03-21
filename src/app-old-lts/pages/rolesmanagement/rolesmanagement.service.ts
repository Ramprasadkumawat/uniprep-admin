import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { CreateUserParams } from 'src/app/@Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RolesmanagementService {

  constructor(
    private http: HttpClient
  ) { }

  getAllEmployees() {
    return this.http.get<any>(`${environment.ApiUrl}/getallemployees`);
  }
  
  getSubroleList() {
    return this.http.get<any>(`${environment.ApiUrl}/getsubrolelist`);
  }

  getPresaleRoleList(val:any) {
    return this.http.post<any>(`${environment.ApiUrl}/presalerolelist`,val);
  }

  getBDTRegionList(val:any) {
    return this.http.post<any>(`${environment.ApiUrl}/getbdtregionlist`,val);
  }

  assignUserRole(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/assignuserrole',val,);
  }

  getAssignedUserList(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/getuserrolelist',val,);
  }

  deleteAssignedRole(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/deleteassignedrole',val,);
  }

  exportAssignedRole(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/assignedroleexport',val,);
  }

  getRoleManagementActivity(val: any):Observable<any> {
    return this.http.post(environment.ApiUrl +'/getrolemanagementactivity',val,);
  }
}
