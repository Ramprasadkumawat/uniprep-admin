import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ExportData } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http:HttpClient) { }
  getFAQCategories(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/faqcategorylist',data, {
        headers: headers,
    });
}


AddFAQ(data:any):Observable<any>{

  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addfaqquestion',data, {
      headers: headers,
  });
}
UpdateFAQ(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updatefaqquestion',data, {
      headers: headers,
  });
}
getFAQ(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/faqlist', data,{
      headers: headers,
  });
}
deleteFAQ(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/deletefaqquestion', data,{
      headers: headers,
  });
}
faqQuerExport() {
  return this.http.post<ExportData>(environment.ApiUrl + '/faqqueriesexport',{
  })
}
 
getFAQCategory(): Observable<any> {
  return this.http.post<{ id: string, name: string }[]>(`${environment.ApiUrl}/faqbycategorydropdown`,{});
}
 
}
