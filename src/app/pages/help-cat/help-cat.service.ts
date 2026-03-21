import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ExportData } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class HelpCatService {

  constructor(private http:HttpClient) { }
  getHelpCategories(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/helpsupportcategorylist',data, {
        headers: headers,
    });
}
AddHelpCategories(data:any):Observable<any>{

    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/addhscategory',data, {
        headers: headers,
    });
}
UpdateHelpCategories(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/updatehscategory',data, {
        headers: headers,
    });
}
deleteCategories(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/deletehscategory',data, {
        headers: headers,
    });
}
helAndSupportCatExport() {
    return this.http.post<ExportData>(environment.ApiUrl + '/helpsupportcategoryexport',{
    })
  }
}
