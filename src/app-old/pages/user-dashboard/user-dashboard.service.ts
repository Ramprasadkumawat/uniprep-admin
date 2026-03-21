import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {



  constructor(private http: HttpClient) { }

  GetCountryList(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + `/country?getHomeCountry=2`, { 'headers': headers });
  }

  GetLocationList(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/location', { 'headers': headers });
  }

  GetProgramList(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/programlevel', { 'headers': headers });
  }

  GetDashboadCardCount(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getuserdashcardcount', val, { 'headers': headers });
  }

  GetUsersDaily(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getusercountbydate', val, { 'headers': headers });
  }

  GetSourcetypeList(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/sourcetype', { 'headers': headers });
  }

  GetStatusList(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/leadstatus', { 'headers': headers });
  }

  GetSourceBySourcetype(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getsourcebysourcetype', val, { 'headers': headers });
  }

  GetInternalCompanies(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + '/internalcompanies', { 'headers': headers });
  }

  GetProgramLevelData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getprogramlevelwisegraphcount', val, { 'headers': headers });
  }

  GetSourceChartData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getsourcetypecount', val, { 'headers': headers });
  }

  GetCountryChartData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getcountrywisegraphcount', val, { 'headers': headers });
  }

  GetPlanChartData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getplanwisegraphcount', val, { 'headers': headers });
  }

  getProgramLevelWiseGraphCount(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getprogramlevelwisegraphcount', val, { 'headers': headers });
  }

  GetPassingYearData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getpassingyeargraphcount', val, { 'headers': headers });
  }

  GetRegionWiseData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getregiongraphcount', val, { 'headers': headers });
  }

  GetleadWiseData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getleadstatuswisegraphcount', val, { 'headers': headers });
  }

  revenuDailyUserData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getrevenuedatewise', val, { 'headers': headers });
  }

  revenueRegionWiseData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getrevenueregionwise', val, { 'headers': headers });
  }

  revenueCountryWiseData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getrevenuecountrywise', val, { 'headers': headers });
  }

  revenueSourceWiseData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getrevenuesourcewise', val, { 'headers': headers });
  }

  revenueTotal(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/gettotalrevenue', val, { 'headers': headers });
  }

  GetUserTypeGraphData(val: any): Observable<any> {
    return this.http.post(environment.ApiUrl + '/GetUserTypeGraphData', val);
  }

  GetUserTypeData(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getusertypegraphcount', val, { 'headers': headers });
  }

  getPlanRevenue(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/planRevenue', val, { 'headers': headers });
  }

  getDailyRevenue(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/dialyRevenue', val, { 'headers': headers });
  }

  GetRegisteredUsers(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getregisteredusers', val, { 'headers': headers });
  }

  GetPaidUsers(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getpaidusers', val, { 'headers': headers });
  }

  GetActiveUsers(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getactiveusers', val, { 'headers': headers });
  }

  GetExhaustedUsers(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getexhasutedusers', val, { 'headers': headers });
  }

  GetUnpaidUsers(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getunpaidusers', val, { 'headers': headers });
  }

  TotalQuestionsAsked(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/totalquestionsasked', val, { 'headers': headers });
  }

  GetUnpaidLoggedIn(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getunpaidloggedin', val, { 'headers': headers });
  }

  GetUnpaidNotLoggedIn(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getunpaidnotloggedin', val, { 'headers': headers });
  }

  GetDirectStudentLeads(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getdirectstudentleads', val, { 'headers': headers });
  }

  GetCollegeStudentLeads(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getcollegestudentleads', val, { 'headers': headers });
  }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Accept', 'application/json');
  }

  getTotalTalentProfiles(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/gettotaltalentprofiles`, { headers: this.getHeaders() });
  }

  getIntroVideoCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getintrovideocount`, { headers: this.getHeaders() });
  }

  getVerifiedUsersCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getverifieduserscount`, { headers: this.getHeaders() });
  }

  getClickedApplyCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getclickedapplycount`, { headers: this.getHeaders() });
  }

  getClickedCheckoutCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getclickedcheckoutcount`, { headers: this.getHeaders() });
  }

  getClosedPaymentScreenCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getclosedpaymentscreencount`, { headers: this.getHeaders() });
  }

  getClosedPremiumPopupCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getclosedpremiumpopupcount`, { headers: this.getHeaders() });
  }

  getPaymentSuccessCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getpaymentsuccesscount`, { headers: this.getHeaders() });
  }

  getPaymentFailedCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getpaymentfailedcount`, { headers: this.getHeaders() });
  }

  getJobsAppliedCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getjobsappliedcount`, { headers: this.getHeaders() });
  }

  getRegisteredUsers(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getregisteredusers`, { headers: this.getHeaders() });
  }

  getPremiumJobsAppliedCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getpremiumjobsappliedcount`, { headers: this.getHeaders() });
  }
  getClosedBrowserCount(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getclosedbrowsercount`, { headers: this.getHeaders() });
  }
  getUserStatusbyDate(): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getuserstatusbydate`, { headers: this.getHeaders() });
  }
  getPaidUsersCount(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getpaidusers', { 'headers': this.getHeaders() });
  }
  getActiveUsersCount(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getactiveusers', { 'headers': this.getHeaders() });
  }
}
