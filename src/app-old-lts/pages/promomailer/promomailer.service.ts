import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ProgramLevelData } from 'src/app/@Models/program-level.model';

@Injectable({
  providedIn: 'root'
})
export class PromomailerService {

  constructor(private http:HttpClient) { }
  
  GetSourcetypeList():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/sourcetype',{ 'headers': headers });
  }
  GetSourceBySourcetype(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getsourcebysourcetype',val,{ 'headers': headers });
  }
  GetCountryList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +`/country?getHomeCountry=2`,{ 'headers': headers });
  }

  GetLocationList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/location',{ 'headers': headers });
  }

  GetProgramList(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/programlevel',{ 'headers': headers });
  }
  getProgaramLevels() {
    return this.http.get<ProgramLevelData>(`${environment.ApiUrl}/programlevel`);
  }
  GetStatusList():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl +'/leadstatus',{ 'headers': headers });
  }
  GetLeadEmailList(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getleademaillist',val,{ 'headers': headers });
  }
  
  GetPartnerEmailList(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/getpartneremaillist',val,{ 'headers': headers });
  }
  customUsersFilter(val: any) {
    console.log("val",val);
    
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization","Bearer" + " " + localStorage.getItem("loginToken"));
    return this.http.post<any>(environment.ApiUrl + "/csvtoemaillist",val,{headers: headers,});
  }
  sendPromomail(val: any) {
    //console.log("data",val.JSON.stringify(val.userData));
    
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + localStorage.getItem("loginToken")
      );
    const formData = new FormData();
    formData.append("userData", JSON.stringify(val.userData));
    formData.append("subject", val.subject);
    formData.append("message", val.message);
   // formData.append("userid", val.userid);
    formData.append("immediate", val.immediate);
    formData.append("scheduleddate", val.scheduleddate);
    formData.append("scheduledtime", val.scheduledtime);
    formData.append("roletypes", val.roletypes);
    if (val.attachment.length > 0) {
      for (let i = 0; i < val.attachment.length; i++) {
        formData.append("attachment[]",val.attachment[i], val.attachment[i].name);
      }
    }
    return this.http.post<any>(
      environment.ApiUrl + "/sendemail",
      formData,
      {
        headers: headers,
      }
    );
  }
  DraftsList(id:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/scheduleddraftlist',id,{ 'headers': headers });
  }
  
  deletedrafts(id:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl +'/deletedraftemail',id,{ 'headers': headers });
  }
  HistoryList(val: any) {
    console.log("val",val);
    
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization","Bearer" + " " + localStorage.getItem("loginToken"));
    return this.http.post<any>(environment.ApiUrl + "/sentemaillist",val,{headers: headers,});
  }
  
  getUnsubscribers(id:any) {
    const headers = new HttpHeaders()
.set("Accept", "application/json")
.set("Authorization","Bearer" + " " + localStorage.getItem("loginToken"));
return this.http.post<any>(environment.ApiUrl + "/getunsubscribedlist",id,{headers: headers,});
}
}
