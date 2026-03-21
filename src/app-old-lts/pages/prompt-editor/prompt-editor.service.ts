import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class PromptEditorService {

  constructor(
    private http: HttpClient
  ) { }

  getPromptsAndModules(){
    return this.http.get<any>(`${environment.ApiUrl}/listOfPrompts`);
  }

  getGPTResponse(data:any){
    return this.http.post<any>(`${environment.ApiUrl}/promptResponseChecker`, data);
  }

  updatePrompt(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/updateGPTPrompt`, data);
  }  
}
