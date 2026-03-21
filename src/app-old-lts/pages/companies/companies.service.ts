import {Injectable} from "@angular/core";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: "root",
})
export class CompaniesService {
    private companyToEditSubject = new BehaviorSubject<any>(null);
    companyToEdit$ = this.companyToEditSubject.asObservable();
    private companyMode = new BehaviorSubject<"view" | "edit">("edit");
    constructor(private http: HttpClient){}
    getCompanyList(val: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/companies-list-for-admin",val,{headers: headers});
    }
    getMultiSelectData(){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.get<any>(environment.ApiUrl + "/CompanySelectValues",{headers: headers});
    }
    addCompanyInfo(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/add-company-by-admin",data,{headers: headers});
    }
    updateCompanyInfo(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/update-company-by-admin",data,{headers: headers});
    }
    showCompanyInfo(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/show-company-by-admin",data,{headers: headers});
    }
    export(data: any){
        return this.http.post<any>(environment.ApiUrl + "/companies-export-by-admin",data,{});
    }
    getCompanySize(){
        return this.http.get<any>(environment.ApiUrl + "/getcompanysize");
    }
    getGlobalPresence(countryId: number){
        return this.http.post<any>(environment.ApiUrl + "/globalPresence",{countryId: countryId});
    }
    getHeadQuarters(countryId: number){
        return this.http.post<any>(environment.ApiUrl + "/getcitywithflag",{countryId: countryId});
    }
    getWorldCountries(){
        return this.http.get<any>(environment.ApiUrl + "/getWorldCountries");
    }
    aiGenerate(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/company-insight-ai-generate",data,{headers: headers});
    }
    setCompanyToEdit(company: any){
        this.companyToEditSubject.next(company);
    }
    clearCompanyToEdit(){
        this.companyToEditSubject.next(null);
    }
    getEmployerList(val: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/employers-list-for-admin",val,{headers: headers});
    }
    getEmployerSubscription(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/employer-subscriptions",data,{headers: headers});
    }
    getSourceNames(){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.get<any>(environment.ApiUrl + "/source-name-list",{headers: headers});
    }
    addCompanyFollowup(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/add_company_followup",data,{headers: headers});
    }
    showCompanyFollowup(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/show_company_followup",data,{headers: headers});
    }
    subscriptionTransactionHistory(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/custom-transaction-history",data,{headers: headers});
    }
    generatePaymentLink(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/custom-payment-link-by-admin",data,{headers: headers});
    }
    getAdminList(){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.get<any>(environment.ApiUrl + "/admin-users-list",{headers: headers});
    }
    setCompanyMode(mode: "view" | "edit"){
        this.companyMode.next(mode);
    }
    getCompanyMode(){
        return this.companyMode.asObservable();
    }
    getPaymentInfo(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/company-payment-infos-for-admin",data,{headers: headers});
    }
    getCompanyInvites(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/company-invites",data,{headers: headers});
    }
    updateEmployerSubscription(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/update-employer-subscription",data,{headers: headers});
    }
    getExistCompanyId(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/create-company-exists-employer",data,{headers: headers});
    }
    softDeleteCompany(data: any){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any[]>(environment.ApiUrl + "/reject-company",data,{headers: headers});
    }
    disableCompanies(data: {employer_id: number[]}){
        const headers = new HttpHeaders().set("Accept","application/json");
        return this.http.post<any>(environment.ApiUrl + "/companies-disable",data,{headers: headers});
    }
}
