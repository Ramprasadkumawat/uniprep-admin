import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private http:HttpClient) { }


  addresources(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("resourcedescription", val.resourcedescription);
    formData.append("country",val.coutryname);
    formData.append("coverimage", val.image);
    formData.append("priority",val.priority);
    return this.http.post<any>(environment.ApiUrl+'/addResource',formData, {
      headers: headers,
  });
  }

  editresources(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("resourcedescription", val.resourcedescription);
    formData.append("country",val.coutryname);
    formData.append("coverimage", val.image);
    formData.append("priority",val.priority);
    formData.append("resourcesId", val.resourcesId);
    return this.http.post<any>(environment.ApiUrl+'/updateResource',formData, {
      headers: headers,
  });
  }
  getlistresorces(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/filterResource',val, {
      headers: headers,
  });
  }
  deleteResources(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/deleteResource',val, {
      headers: headers,
  });
  }
  getCountriesList() {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get<any>(environment.ApiUrl+'/country?module_name=resource', {
      headers: headers,
  });
  }
}
