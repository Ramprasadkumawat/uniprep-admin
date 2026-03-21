import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GenralreportService {

  constructor(private http: HttpClient) { }

  getPriorityDropdownList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ReportPriorityList", {
      headers: headers,
    });
  }

  getGeneralReportList(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AllReportList",data,{
      headers: headers,
    });
  }

  updatePriority(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpdatePriorityStatus", data,{
      headers: headers,
    });
  }

  exportGenralReport(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ExportGeneralReport", data,{
      headers: headers,
    });
  }

  sendReplyForStudents(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SendReplyForReport", data,{
      headers: headers,
    });
  }
  GetReportCatWise(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/Getreportchat", data,{
      headers: headers,
    });
  }
  GetReportTicketWise(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetticketSummary", data,{
      headers: headers,
    });
  }
  getChatFromTickets(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetChatUser", data,{
      headers: headers,
    });
  }
  submitChat(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SubmitChat", data,{
      headers: headers,
    });
  }
  reportExportApi(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ReportAdminExport",{
      headers: headers,
    });
  }
  getDummyCertificateList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/generatesamplecertifictedetails ",{
      headers: headers,
    });
  }
  downloadSampleCertificate(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/generatesamplecertificte",data,{
      headers: headers,
    });
  }
  getPriorityList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getprioritylist",{
      headers: headers,
    });
  }
  getReportCategory(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getreportcategorylist",{
      headers: headers,
    });
  }
  getCertificateUserList(data){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getmodulewisecertificate",data,{
      headers: headers,
    });
  }
  getCountriesList() {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get<any>(environment.ApiUrl+'/country', {
      headers: headers,
  });
  }
  getStudentsList(data) {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getmodulewisestudents ',data, {
      headers: headers,
  });
  }
}
