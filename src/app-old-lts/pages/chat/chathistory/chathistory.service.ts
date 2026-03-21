import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {environment} from "@env/environment";
import { ChatsByUsers, ChatsByUser, SendMessage, SendMessageParams } from 'src/app/@Models/chat.model';
@Injectable({
    providedIn: "root",
})
export class ChathistoryService {

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
    }
    getChatList(data:any):Observable<any> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<ChatsByUsers>(environment.ApiUrl+'/gettotalchatlist',data, {
            headers: headers,
        });
    }
    getnonrepliedChatList(data:any):Observable<any> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/getnotrepliedchatlist',data, {
            headers: headers,
        });
    }
    getskippedChatList(data:any):Observable<any> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/getskippedchatlist',data, {
            headers: headers,
        });
    }
    getchatreportlist(data:any):Observable<any> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/getreportchatlist', data,{
            headers: headers,
        });
    }
    getChatHistoryByUser(params: Object) {
        return this.http.post<ChatsByUser>(environment.ApiUrl+'/getchathistorybyid', params);
    }

    sendChatMessage(val: any,files:any) {
        
        const formData = new FormData();  
        formData.append("message",val.message)
        formData.append("user_id",val.user_id)        
        formData.append("selectedQuestion",val.selectedQuestion)
        if(files.length>0){
            files.forEach(fileval => {               
            formData.append("attachment", fileval,fileval.name); 
            });
        }
        return this.http.post<SendMessage>(environment.ApiUrl+'/sentchatmessage', formData); 
    }
    getleadtype(){
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl+'/subscriptiontypes', {
            headers: headers,
        });
        
    }
}
