import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, shareReplay } from 'rxjs';
import { ExportData, ResponseSuccessMessage } from 'src/app/@Models/subscribers.model';
@Injectable({
  providedIn: 'root'
})
export class MarketingorgService {
  public assignedTo$: Observable<any> | null = null;
  constructor(private http: HttpClient) { }
  addMarketing(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/addmarketing`, val);
  }
  editMarketing(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/editmarketing`, val);
  }
  getMarketingList(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/getmarketing`, val);
  }
  deleteMarketing(val: any): Observable<any> {
    let params = new FormData();
    params.append('marketingsId', val.marketingsId);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/deletemarketing`, params);
  }
  getInstitute(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get<ResponseSuccessMessage>(`${environment.ApiUrl}/getmarketinginstitute`);
  }
  getAssignTo(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get<ResponseSuccessMessage>(`${environment.ApiUrl}/getAdminAssign`);
  }
  getregion(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get<ResponseSuccessMessage>(`${environment.ApiUrl}/region`);
  }
  getdistrict(val: any): Observable<any> {
    let params = new FormData();
    params.append('regionId', val.regionId);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/getlocationbyregionid`, params);
  }
  getInstituteName(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/Getinstitutename`, val);
  }
  studentBulkUpload(data: any) {
    let params = new FormData();
    params.append('id', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/ImportMarketing`, params);
  }
  temporaryUpload(data: any): Observable<any> {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/temporaryupload`, params, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getTemporaryDocument(data: any) {
    let params = new FormData();
    params.append('id', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/getTemporaryDocument`, params);
  }
  deleteTemporaryDocument(data: any) {
    let params = new FormData();
    params.append('id', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/deleteTemporaryDocument`, params);
  }
  addWhitelabel(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("organizationtype", val.organizationtype);
    formData.append("country", val.country);
    formData.append("organizationname", val.organizationname);
    formData.append("domainname", val.domainname);
    formData.append("organizationlogo", val.organizationlogo);
    formData.append("icon", val.icon)
    formData.append("contactname", val.contactname);
    formData.append("contactemail", val.contactemail);
    formData.append("contactnumber", val.contactnumber);
    formData.append("domaintype", val.domaintype);
    formData.append("cname", val.cname);
    formData.append("mail_protocol", val.mail_protocol)
    formData.append("mail_host", val.mail_host)
    formData.append("mail_port", val.mail_port)
    formData.append("mail_id", val.mail_id)
    formData.append("password", val.password)
    formData.append("mail_encryption", val.mail_encryption)
    formData.append("mail_from_address", val.mail_from_address)
    formData.append("mail_name", val.mail_name)
    return this.http.post<any>(environment.ApiUrl + '/addwhitelabel', formData, {
      headers: headers,
    });
  }
  updateWhiteLabel(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("organizationtype", val.organizationtype);
    formData.append("country", val.country);
    formData.append("organizationname", val.organizationname);
    formData.append("domainname", val.domainname);
    formData.append("organizationlogo", val.organizationlogo);
    formData.append("icon", val.icon)
    formData.append("source", val.source)
    formData.append("primary_color", val.primary_color)
    formData.append("secondary_color", val.secondary_color)
    return this.http.post<any>(environment.ApiUrl + '/editwhitelabel', formData, {
      headers: headers,
    });
  }
  addMarketingUser(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/addMarketingUser`, val);
  }
  updateMarketingUser(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/editMarketingUser`, val);
  }
  getUserAdd(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/listMarketingUser`, data);
  }
  deleteUser(id: number) {
    let params = {
      id: id
    }
    return this.http.post<any>(`${environment.ApiUrl}/deleteMarketingUser`, params);
  }
  addFollowUpRemarks(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/addRemarksMarketing`, val);
  }
  getRemarksFollowUpList(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<any>(`${environment.ApiUrl}/listRemarksMarketing`, data);
  }
  uploadDocument(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("document", val.document);
    formData.append("organization_id", val.organization_id);
    return this.http.post<any>(environment.ApiUrl + '/uploadOrganizationDocument', formData, {
      headers: headers,
    });
  }
  getDocumentList(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/listOrganizationDocuments`, data);
  }
  renameDocument(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/renameOrganizationDocument`, val);
  }
  deleteSelectedDocument(id: any) {
    return this.http.post<any>(`${environment.ApiUrl}/deleteOrganizationDocument`, id);
  }
  downloadDocument(data: any) {
    const headers = new HttpHeaders().set('Accept', 'application/json'); // optional

    const params = new HttpParams().set('filename', data.filename);

    return this.http.post(
      environment.ApiUrl + '/downloadOrganizationDocument',
      {}, // or actual body if needed
      {
        headers,
        params,
        responseType: 'blob' // <- This tells Angular it's a binary file
      }
    );
  }
  exportMarketing() {
    return this.http.post<ExportData>(environment.ApiUrl + '/marketingExport', {
    })
  }
  // pay out manager apis 
  getPayOutManagerList(data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/getallpartnertransactiondetailsadmin`, data);
  }
  getPayOutDetails(val: any): Observable<any> {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/getpartnerpayoutdetailsadmin`, val);
  }
  uploadKycData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("partner_id", val.source);
    formData.append("bank_account_name", val.bank_account_name);
    formData.append("bank_account_number", val.bank_account_number);
    formData.append("ifsc_code", val.ifsc_code);
    formData.append("upi_id", val.upi_id);
    formData.append("kyc_document", val.kyc_document);
    formData.append("verified", val.verified);
    formData.append("commission_percentage", val.commission_percentage);
    return this.http.post<any>(environment.ApiUrl + '/updatebankingdetailsadmin', formData, {
      headers: headers,
    });
  }
  checkIfcCode(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl + "/getbankdetails", val, {
      headers: headers,
    });
  }
  checkUpId(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl + "/verifyupi", val, {
      headers: headers,
    });
  }
  getViewStudentAssignTo(): Observable<any> {
    if (!this.assignedTo$) {
      const headers = new HttpHeaders()
      this.assignedTo$ = this.http.get<ResponseSuccessMessage>(`${environment.ApiUrl}/getStudentAssign`).pipe(
        shareReplay(1)
      );
    }
    return this.assignedTo$;
  }
}
