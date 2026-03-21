import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadQuestionCreditPlans, loadSubscriptionPlans } from '../store/actions';
import { selectPlans$, selectQuestionCreditPlans$ } from '../store/selectors';
import { PageState } from '../store/reducer';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { SubscriptionParams, SubscriptionPlanResponse, SubscriptionPlanSuccessResponse, SubscriptionTypesData } from 'src/app/@Models/subscription';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private store: Store<PageState>,
    private http: HttpClient) { }
  loadSubscriptionList() {
    this.store.dispatch(loadSubscriptionPlans());
  }

  getSubscriptionList() {
    return this.store.select(selectPlans$);
  }

  loadQuestionCreditList() {
    this.store.dispatch(loadQuestionCreditPlans());
  }

  getQuestionCreditList() {
    return this.store.select(selectQuestionCreditPlans$);
  }
  getSubscriptions(params : any): Observable<any>  {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/getsubscriptionlist`, params);
  }

  getUserSubscriptionsForAdmin(params: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/users-subscriptions-for-admin`, params);
  }
  // getSubscriptionDropdownList(params:any):Observable<any> {
  //   return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/getsubscriptionplandropdown`, params);
  // }
  getSubscriptionDropdownList(params:any):Observable<any> {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/subscription-plan-dropdown`, params);
  }
  getSubscriptionType(): Observable<any>  {
    return this.http.get<SubscriptionTypesData>(`${environment.ApiUrl}/subscriptiontypes`);
  }
  addSubscriptionPlan(params: SubscriptionParams): Observable<any>  {
    return this.http.post<SubscriptionPlanSuccessResponse>(`${environment.ApiUrl}/add-users-subscriptions-by-admin`, params);
  }
  editSubscriptionPlan(params: SubscriptionParams): Observable<any>  {
    return this.http.post<SubscriptionPlanSuccessResponse>(`${environment.ApiUrl}/add-users-subscriptions-by-admin`, params);
  }
  deleteSubscriptionPlan(subscriptionId: number,subscriptionPlanId): Observable<any> {
    return this.http.post<SubscriptionPlanSuccessResponse>(`${environment.ApiUrl}/deletesubscriptionplan`, {id: subscriptionId,subscription_plan_id:subscriptionPlanId});
  }
  getSubscriptionHistory(params : any): Observable<any>  {
    return this.http.post<SubscriptionPlanResponse>(`${environment.ApiUrl}/getsubscriptionhistoryadmin`, params);
  }
  getSubscriptionTopups(): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/gettopuplist`, {});
  }

  getWorldCountries(): Observable<any> {
    return this.http.get<any>(`${environment.ApiUrl}/getWorldCountries`);
  }

  getUserSubscriptionsDropdowns(payload: any = {}): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/users-subscriptions-dropdowns`,payload);
  }
}
