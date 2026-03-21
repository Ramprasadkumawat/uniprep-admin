import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ChangePasswordParams, ProfileParams, ProfileResponse } from 'src/app/@Models/myprofile.model';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  constructor(
    private http: HttpClient
  ) { }

  updateProfile(params: ProfileParams) {
    return this.http.post<ProfileResponse>(`${environment.ApiUrl}/editprofile`, params);
  }

  updatePassword(params: ChangePasswordParams) {
    return this.http.post<ProfileResponse>(`${environment.ApiUrl}/changepassword`, params);
  }
}
