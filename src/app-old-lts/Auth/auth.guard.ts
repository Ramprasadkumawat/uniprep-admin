import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {LocalStorageService} from 'ngx-localstorage';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private storage: LocalStorageService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    let isExpired: boolean;
    try {
      const token = this.storage.get<string>('token') || '123';
      const helper = new JwtHelperService();
      isExpired = helper.isTokenExpired(token);
    } catch (e) { isExpired = true; }
    if (!isExpired) {
      return true;
    }
    this.router.navigateByUrl('/auth/login');
    return false;
  }

}
