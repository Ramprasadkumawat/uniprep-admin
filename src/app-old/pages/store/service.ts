import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "@env/environment";
import {CreateUserParams, LoadUserParams, UserPaginatedresponse, UserType} from "../../@Models/user.model";
import {MessageService} from "primeng/api";
import {Observable, tap} from "rxjs";


@Injectable({providedIn: 'root'})
export class Service {
    constructor(
        private http: HttpClient,
        private toaster: MessageService
    ) {}

    loadUsers(params: any) {
        return this.http.get<UserPaginatedresponse>(`${environment.ApiUrl}/user-list`, { params });
    }
    loadUserTypes() {
        return this.http.get<UserType[]>(`${environment.ApiUrl}/usertypes`);
    }
    createUser(data: CreateUserParams) {
        return this.http.post(`${environment.ApiUrl}/create-user`, data).pipe(
            tap(() => this.toaster.add({severity: 'success', summary: 'Success', detail: 'User created successfully!'}))
        );
    }
    getSubscriptionList(): Observable<any>{
        return this.http.post<any>(environment.ApiUrl+'/getsubscriptions', {});
    }
    getQuestionCreditList(): Observable<any>{
        return this.http.post<any>(environment.ApiUrl+'/getquestioncredits', {});
    }

    getSubscriberList(): Observable<any>{
        return this.http.post<any>(environment.ApiUrl+'/getquestioncredits', {});
    }

    addFaqQuestion(data: any): Observable<any>{
        return this.http.post<any>(environment.ApiUrl+'/adduniprepquestion', {data})
    }
}
