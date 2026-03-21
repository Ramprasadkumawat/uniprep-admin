import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { LocalStorageService } from "ngx-localstorage";
import { User, UserData } from "../@Models/user.model";
import { AuthState } from "./store/reducer";
import { selectLoading$, selectloggedIn$, selectMessage$ } from "./store/selectors";
import { LoginRequest } from "../@Models/auth.model";
import { login } from "./store/actions";
import { PageFacadeService } from "../../app/pages/page-facade.service"
import { SubscriberService } from "../../app/pages/subscribers/subscriber.service"
@Injectable({
  providedIn: "root",
})
export class AuthService {
  _user!: User[];
  userData = new BehaviorSubject<User[] | null>(null);
  // new code for userdetails globaly use,  where we use getMe fuction that code change getUserDetails$  code
  private userSubject = new BehaviorSubject<any>(null);
  getUserDetails$ = this.userSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: LocalStorageService,
    private store: Store<AuthState>,
    private PageFacadeService: PageFacadeService,
    private SubscriberService: SubscriberService
  ) { }
  set user(u: User[]) {
    this._user = u;
    this.userData.next(u);
  }
  get user() {
    return this._user;
  }
  get currentUser() {
    return this.userSubject.value;
  }
  get userPermissions() {
    return [this.user?.[0]?.type];
  }
  getMe(): Observable<UserData> {
    // return of(Object.create({}));
    return this.http.get<UserData>(`${environment.ApiUrl}/getuserdetails`).pipe(
      tap((response) => {
        this.user = response.userdetails;
        this.userSubject.next(response.userdetails);
      }),
      catchError(() => {
        // this.storage.clear();
        this.router.navigateByUrl('/auth/login');
        return throwError(new Error(''));
      })
    );
  }
  login(data: LoginRequest) {
    this.PageFacadeService.resetAll();
    this.SubscriberService.resetAll()
    this.store.dispatch(login(data));
  }
  selectLoading$() {
    return this.store.select(selectLoading$);
  }
  selectMessage$() {
    return this.store.select(selectMessage$);
  }
  selectloggedIn$() {
    return this.store.select(selectloggedIn$);
  }
  logout() {
    this.storage.clear();
    this.router.navigateByUrl('/auth/login');
  }
  updateProfile(data: any) {
    return this.http.post<any>(environment.ApiUrl + '/updateuser', data);
  }
  getOTP(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/sendrecoveryemail", val);
  }
  validateEmailOTP(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(environment.ApiUrl + '/validateemailotp', data);
  }
  setPassword(val: any) {
    return this.http.post<any>(environment.ApiUrl + '/resetpassword', val);
  }
}
