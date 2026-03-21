import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
export interface WorkLocations {
  worklocations: worklocation[];
}
export interface worklocation {
  id: number;
  work_location: string;
}

export interface Company {
  uuid: string;
  company_id: number;
  company_name: string;
  company_logo_url: string;
  employer_id: number;
  employer_name: string;
  employer_type: string;
}
@Injectable({
  providedIn: "root",
})
export class RecruitmentService {
  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(private http: HttpClient) { }

  placeOrder(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-admin-placeorder",
      data,
      {
        headers: this.headers,
      }
    );
  }

  completePayment(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-admin-payment",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getWorkLocationDropdownData(): Observable<WorkLocations> {
    return this.http.get<WorkLocations>(
      environment.ApiUrl + "/easyapply-admin-worklocations"
    );
  }

  getHiringSupportTransactions(data: any = {}) {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-transactions",
      data,
      {
        headers: this.headers,
      }
    );
  }

  exportHiringSupport(data: any = {}) {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-admin-export",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getPositionTitleData(data: any): Observable<any> {
    return this.http.post<any>(
      environment.EmployerApiUrl + "/searchPositions",
      data
    );
  }

  getCurrencyAndSymbol() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.EmployerApiUrl + "/employercountry", {
      headers: headers,
    });
  }

  hiringSupportDropdown(country: any): Observable<any> {
    return this.http.post(
      environment.EmployerApiUrl + `/hiring-support-dropdowns`,
      { country }
    );
  }

  aiGenerateApi(paramData: any, apiName: string): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + "/" + apiName, paramData);
  }

  getDropdownData(): Observable<any> {
    return this.http.get<any>(
      environment.ApiUrl + "/easyapply-admin-dropdownlist"
    );
  }

  getCompaniesList(data: any = {}): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-companies",
      {},
      {
        headers: this.headers,
      }
    );
  }

  generatePaymentLink(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-generate-payment-link",
      data,
      {
        headers: this.headers,
      }
    );
  }

  updateRequirement(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-admin-update-requirement",
      data,
      {
        headers: this.headers,
      }
    );
  }

  updateOrderStatus(data: { order_id: string; order_status: string; transaction_id: number; payment_status: number }): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + "/update-order-status", data, {
      headers: this.headers,
    });
  }

  createPositionTitle(paramData: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/add-position-byadmin",
      paramData
    );
  }

  mapTalentsToOrder(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-map-talents",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getMappedTalents(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-mapped-talents",
      data,
      {
        headers: this.headers,
      }
    );
  }

  showOrder(orderId: string): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-show-order",
      { order_id: orderId },
      {
        headers: this.headers,
      }
    );
  }

  getTalentDetails(talentId: number): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-talent-details",
      { talent_id: talentId },
      {
        headers: this.headers,
      }
    );
  }

  mapTalent(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-map-talent",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getMappedTalentsList(filters: any = {}): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/hiring-support-mapped-talents-list",
      filters,
      {
        headers: this.headers,
      }
    );
  }

  exportMappedTalents(data: any = {}) {
    return this.http.post<any>(
      environment.ApiUrl + "/mapped-talents-admin-export",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getCompanyDetailsById(companyId: string): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/company-details-get-by-id",
      { company_id: companyId },
      {
        headers: this.headers,
      }
    );
  }

}
