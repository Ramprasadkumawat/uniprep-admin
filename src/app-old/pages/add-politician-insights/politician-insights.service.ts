import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { CreateUserParams } from 'src/app/@Models/user.model';
import { ObjectModel } from 'src/app/@Models/politician.model';

@Injectable({
    providedIn: 'root'
})
export class PoliticianService {

    constructor(
        private http: HttpClient
    ) { }

    getOptionList() {
        return this.http.get<any>(`${environment.ApiUrl}/politiciandropdownlist`);
    }

    getPoliticiansList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getpoliticianslist`, val);
    }

    addPoliticianInSight(val: ObjectModel): Observable<any> {
        return this.http.post(environment.ApiUrl + '/addpolitician', val,);
    }

    exportPolitician(val: ObjectModel): Observable<any> {
        return this.http.post(environment.ApiUrl + '/ExportPoliticianList', val,);
    }

    downloadFile(url: string): Observable<Blob> {
        const headers = new HttpHeaders();
        return this.http.get(url, { responseType: 'blob', headers: headers });
    }

    bulkUploadFile(data: any) {
        let params = new FormData();
        params.append('file', data);
        return this.http.post<any>(`${environment.ApiUrl}/politicianimport`, params);
    }
}
