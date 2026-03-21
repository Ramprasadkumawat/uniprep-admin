import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {ResponseSuccessMessage} from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class WhitelabelService {

  constructor(private http:HttpClient) { }
  getWhiteLabel(data:any){
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/listwhitelabel',data, {
      headers: headers,
  });
  }
  getCountriesList() {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/AllCountries', {
      headers: headers,
  });
  }

  testSMTPConfig(data: any) {
    const headers = new HttpHeaders()
        .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl + '/sendcustomemail', data, {
      headers: headers,
    });
  }

  getinstitute():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get<ResponseSuccessMessage>(`${environment.ApiUrl}/getmarketinginstitute`);
  }
  getOrganization(val:any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getorganizationname',val, {
      headers: headers,
  });
  }
  addWhitelabel(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("organizationtype",val.organizationtype);
    formData.append("country",val.country);
    formData.append("organizationname", val.organizationname);
    formData.append("contactname",val.contactname);
    formData.append("contactemail",val.contactemail);
    formData.append("contactnumber", val.contactnumber);
    formData.append("domaintype",val.domaintype);
    formData.append("domainname",val.domainname);
    formData.append("organizationlogo", val.organizationlogo);
    formData.append("cname", val.cname);
    formData.append("icon",val.icon)
    formData.append("mail_protocol",val.mail_protocol)
    formData.append("mail_host",val.mail_host)
    formData.append("mail_port",val.mail_port)
    formData.append("mail_id",val.mail_id)
    formData.append("password",val.password)
    formData.append("mail_encryption",val.mail_encryption)
    formData.append("mail_from_address",val.mail_from_address)
    formData.append("mail_name",val.mail_name)
    return this.http.post<any>(environment.ApiUrl+'/addwhitelabel',formData, {
      headers: headers,
  });
  }
  updateWhitelabel(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("organizationtype",val.organizationtype);
    formData.append("country",val.country);
    formData.append("organizationname", val.organizationname);
    formData.append("contactname",val.contactname);
    formData.append("contactemail",val.contactemail);
    formData.append("contactnumber", val.contactnumber);
    formData.append("domaintype",val.domaintype);
    formData.append("domainname",val.domainname);
    formData.append("organizationlogo", val.organizationlogo);
    formData.append("cname", val.cname);
    formData.append("id", val.id);
    formData.append("icon",val.icon)
    formData.append("mail_protocol",val.mail_protocol)
    formData.append("mail_host",val.mail_host)
    formData.append("mail_port",val.mail_port)
    formData.append("mail_id",val.mail_id)
    formData.append("password",val.password)
    formData.append("mail_encryption",val.mail_encryption)
    formData.append("mail_from_address",val.mail_from_address)
    formData.append("mail_name",val.mail_name)
    return this.http.post<any>(environment.ApiUrl+'/editwhitelabel',formData, {
      headers: headers,
  });
  }
  
  export(data:any){
    // return this.http.post<any>(environment.ApiUrl + '/exportwhitelabel');
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/exportwhitelabel',data, {
      headers: headers,
  });
  }
  whitlabelImport(data: any){
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/whitelabelimport', params);
  }
  getUserdetailsByInstituteName(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getuserdetailsbyinstitutename',val, {
      headers: headers,
  });
  }
}
