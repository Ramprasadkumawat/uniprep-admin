import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class CreditChatService {

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}
    getChatList(data:any):Observable<any> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/getadminchatlist', data,{
            headers: headers,
        });
    }

}
