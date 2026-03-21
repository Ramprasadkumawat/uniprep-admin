import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";


@Injectable({
  providedIn: 'root'
})
export class AdvisorChatService {
  headers = new HttpHeaders().set("Accept", "application/json");
  
  constructor(private http: HttpClient) { }

  getChatHistory(){
    return this.http.get<any>(environment.ApiUrl + "/expertsHistory", {
      headers: this.headers,
    });
  }

  getUsersMessages(userId: any) {
    return this.http.get<any>(environment.ApiUrl + "/getOneUserMessages", {
      headers: this.headers,
      params: { user_id: userId },
    });
  }
  
  storeExpertReply(replyData: any){
    return this.http.post<any>(environment.ApiUrl + "/teamReply", replyData ,{
      headers: this.headers,
    });
  }
}
