import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { StudentRemarksRes } from 'src/app/@Models/student-remarks.model';
import { ExportData, QuizProgressionData, SubscriberCountData, ResponseSuccessMessage, SubscriberReadProgressionData, SubscriberData, SubscriberTransactionData } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  public subscriptionDropdown$: Observable<any> | null = null;
  public homecountry$: Observable<any> | null = null;
  pageSize$ = new BehaviorSubject<number>(50);
  // helper to update
  setPageSize(size: number) {
    this.pageSize$.next(size);
  }
  constructor(
    private http: HttpClient
  ) { }
  resetAll() {
    this.subscriptionDropdown$ = null;
    this.homecountry$ = null;
  }
  getSubscribers(params: any) {
    return this.http.post<SubscriberData>(`${environment.ApiUrl}/GetStudentList`, params);
  }
  getSubscriberse(data: any) {
    return this.http.post<SubscriberData>(`${environment.ApiUrl}/GetStudentList`, { data });
  }
  getSubscribersCount(params: any) {
    return this.http.post<SubscriberCountData>(`${environment.ApiUrl}/getviewtalentscounts`, params);
  }
  getcoupenleadlist(params: any) {
    return this.http.post<any>(`${environment.ApiUrl}/studentlistcoupon`, params);
  }
  // getReadProgression(data: any) {
  //   return this.http.get<SubscriberReadProgressionData>(`${environment.ApiUrl}/GetSubscribersReadProgress?userid=${data.userid}`);
  // }
  // getSubmoduleListofReadProgression(data: any) {
  //   return this.http.post<any>(`${environment.ApiUrl}/SubmoduleReadProgression`, data);
  // }
  // getSubscribersQuizProgress(data: any) {
  //   return this.http.get<QuizProgressionData>(`${environment.ApiUrl}/SubscribersQuizProgress?userid=${data.userid}`);
  // }

  getSubscribersTransactions(data: any) {
    return this.http.post<SubscriberTransactionData>(`${environment.ApiUrl}/SubscribersTransactions`, data);
  }
  getUsageTracking(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/gettrackinglist`, data);
  }
  getUserDocuments(data: any){
    return this.http.post<any>(`${environment.ApiUrl}/user-documents`,data);
  }
  downloadUserDocument(data: any){
    return this.http.post<any>(`${environment.ApiUrl}/download-user-document`,data);
  }
  renameUserDocument(data: any){
    return this.http.post<any>(`${environment.ApiUrl}/rename-user-document`,data);
  }
  deleteUserDocument(data: any){
    return this.http.post<any>(`${environment.ApiUrl}/delete-user-document`,data);
  }
  getEditSubscribers(params: any) {
    return this.http.post<SubscriberData>(`${environment.ApiUrl}/AllandFilterSubscribers`, params);
  }

  addSubscriber(params: any) {
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/AddCustomUser`, params);
  }
  updateSubscriber(params: any) {
    return this.http.post(`${environment.ApiUrl}/UpdateStudents`, params);
  }
  studentBulkUpload(data: any) {
    let params = new FormData();
    params.append('input', data);
    return this.http.post<ResponseSuccessMessage>(`${environment.ApiUrl}/StudentBulkUpload`, params);
  }
  studentExport(params: any) {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportStudentList', params)
  }
  deleteinternalusers(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/deleteinternaluser', data, {
      headers: headers,
    });
  }
  addStudent(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/addstudent', data, {
      headers: headers,
    });
  }
  getHomeCountry(homeCountryId: number) {
    if (!this.homecountry$) {
      const headers = new HttpHeaders().set("Accept", "application/json");
      this.homecountry$ = this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
        headers: headers,
      }).pipe(
        shareReplay(1)
      );
    }
    return this.homecountry$;
  }
  getReadCount(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/totalquestionsread`, data, {
      headers: headers,
    });
  }
  getSubscriptionList() {
    if (!this.subscriptionDropdown$) {
      const headers = new HttpHeaders().set("Accept", "application/json");
      this.subscriptionDropdown$ = this.http.post<any>(environment.ApiUrl + `/getsubscriptionlist`, {
        headers: headers,
      }).pipe(
        shareReplay(1)
      );
    }
    return this.subscriptionDropdown$;
  }
  deleteStudent(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/deletestudentuser', data, {
      headers: headers,
    });
  }
  gettotalrevenue(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/totalrevenue`, {
      headers: headers,
    });
  }
  getRemarksList(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<StudentRemarksRes>(environment.ApiUrl + `/getremarks`, data, {
      headers: headers,
    });
  }
  getSumbitRemarks(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/submitremarks`, data, {
      headers: headers,
    });
  }
  deleteStudenRemarks(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/deleteremarks', data, {
      headers: headers,
    });
  }
  usageTrackingExport(params: any) {
    return this.http.post<ExportData>(environment.ApiUrl + '/usertrackingexport', params)
  }
  getdegreename(educationId: number): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getdegreename?current_education_id=${educationId}`, {
      headers: headers,
    });
  }
  getcurrentspecialization(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getcurrentspecialization`, {
      headers: headers,
    });
  }
  getcurrentstudyyear(specializationId): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getcurrentstudyyear?current_specialization_id=${specializationId}`, {
      headers: headers,
    });
  }
  addValidator(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("student_type", val.student_type);
    formData.append("source_type", val.source_type);
    formData.append("source", val.source);
    formData.append("file", val.file);
    return this.http.post<any>(environment.ApiUrl + '/uploademaildata', formData, {
      headers: headers,
    });
  }
  getValidationFileList(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/getvalidationfilelist`, data, {
      headers: headers,
    });
  }
  getValidationFiledata(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/getemailvalidateddetails`, data, {
      headers: headers,
    });
  }
  getHistory(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/getvalidationfilehistorylist', val, { 'headers': headers });
  }
  reUploadValidator(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    const formData = new FormData();
    // formData.append("student_type",val.student_type);
    // formData.append("source_type",val.source_type);
    // formData.append("source",val.source);
    formData.append("file_id", val.file_id);
    formData.append("file", val.file);
    return this.http.post<any>(environment.ApiUrl + '/reuploademaildata', formData, {
      headers: headers,
    });
  }
  validatorExort(params: any) {
    return this.http.post<ExportData>(environment.ApiUrl + '/exportinvalidemail', params)
  }
  createAllAccount(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/createaccount`, data, {
      headers: headers,
    });
  }
  validateEmailTesting(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/validatesinglemail`, data, {
      headers: headers,
    });
  }

  generateUserCustomPaymentLink(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + `/generate-user-custom-payment-link`,
      data,
      {
        headers: headers,
      },
    );
  }
}
