import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from "../Auth/auth.service";
import {UserData} from "../@Models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserResolver  {
  constructor(
    private authService: AuthService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserData> {
    return this.authService.getMe();
  }
}
