import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {UserData} from "../../@Models/user.model";
import { HttpClient } from "@angular/common/http";
import {environment} from "@env/environment";
import {LoginRequest, LoginResponse} from "../../@Models/auth.model";
import {LocalStorageService} from "ngx-localstorage";


@Injectable({providedIn: 'root'})
export class AuthStoreService {
    constructor(private http: HttpClient, private storage: LocalStorageService) {}

    login(request: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(environment.ApiUrl + "/AdminLogin", request).pipe(
            tap((response) => this.storage.set(environment.tokenKey, response.token))
        );;
    }
}