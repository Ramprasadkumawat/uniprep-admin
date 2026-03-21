import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddStoryService {

  constructor(private http:HttpClient) { }
  addstories(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("coverimage", val.coverimage);
    formData.append("description",val.description);
    return this.http.post<any>(environment.ApiUrl+'/addstory',formData, {
      headers: headers,
  });
  }
  edittutorials(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("coverimage", val.coverimage);
    formData.append("description",val.description);
    formData.append("tutorialsid",val.tutorialsid);
    return this.http.post<any>(environment.ApiUrl+'/editstory',formData, {
      headers: headers,
  });
  }
  getlisttutorial(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getfilterstory',val, {
      headers: headers,
  });
  }
  deleteTutorial(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/deletestory',val, {
      headers: headers,
  });
  }
}
