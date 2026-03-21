import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CountryInsightSuccess, GetCountryInsightToolCategoryPayload, getCountryInsightQuizQuestionPayload, CountryInsightQuizQuestionsSuccess, CountryInsightQuizQuestionsAddSuccess, CountryInsightsPayload, GetCountryInsightPayload, CountryInsightQuizQuestionPayload } from 'src/app/@Models/country-insights.model';
import { CategoryResponse } from 'src/app/@Models/test-categories.model';
interface CountryInsightsResponse {
    message: string;
    status: string;
}
@Injectable({
    providedIn: 'root'
})
export class CountryInsightsService {

    constructor(private http: HttpClient) { }

    addQuestion(data: CountryInsightQuizQuestionPayload): Observable<CountryInsightsResponse> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        let params = new FormData();
        params.append('image', data.image);
        params.append('title', data.title);
        params.append('answer', data.answer);
        params.append('country', data.module_id);
        params.append('module_id', data.country_id);
        return this.http.post<CountryInsightsResponse>(environment.ApiUrl + '/addcountryinsightdetails', params, {
            headers: headers,
        })
    }

    getQuestionsList(req: GetCountryInsightToolCategoryPayload): Observable<CountryInsightQuizQuestionsSuccess> {
        let params = {
            page: req.page,
            perpage: req.perpage,
            module_id: req.module_id,
            country: req.countryId
        };
        return this.http.post<CountryInsightQuizQuestionsSuccess>(environment.ApiUrl + `/showcountryinsight`, params)
    }

    updateQuestion(req: CountryInsightQuizQuestionPayload, question_id: string): Observable<Record<string, any>> {
        let params = new FormData();
        params.append('image', req.image);
        params.append('title', req.title);
        params.append('answer', req.answer);
        params.append('id', question_id);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<CountryInsightSuccess>(environment.ApiUrl + `/updatecountryinsightslistdetails`, params, {
            headers: headers,
        });
    }

    deleteQuizWithQuestions(params: { submodule_id: number }): Observable<CountryInsightSuccess> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<CountryInsightSuccess>(environment.ApiUrl + '/deletecareertoolsubmodule', params, {
            headers: headers,
        });
    }

    checkSubmoduleDeletePermission(): Observable<any> {
        return this.http.post<any>(environment.ApiUrl + '/CheckSubmoduleDeletePermission', {})
    }

    getQuizQuestion(req: getCountryInsightQuizQuestionPayload): Observable<CountryInsightQuizQuestionsSuccess> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<CountryInsightQuizQuestionsSuccess>(environment.ApiUrl + '/showcountryinsight', req, {
            headers: headers,
        });
    }

    importCountryInsightsFile(data: any): Observable<CountryInsightQuizQuestionsAddSuccess> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        let params = new FormData();
        params.append('file', data);
        return this.http.post<CountryInsightQuizQuestionsAddSuccess>(`${environment.ApiUrl}/importcountryinsights`, params, {
            headers: headers,
        });
    }

    importCountryInsightsQuestions(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        let params = new FormData();
        params.append('file', data);
        return this.http.post<CountryInsightQuizQuestionsAddSuccess>(`${environment.ApiUrl}/importcountryinsightdetails`, params, {
            headers: headers,
        });
    }

    deleteQuiz(data: { quizquestion_id: number }): Observable<CountryInsightSuccess> {
        return this.http.post<CountryInsightSuccess>(`${environment.ApiUrl}/deleteCountryInsightquizquestions`, data);
    }

    getCountryInsightsList(req: GetCountryInsightPayload): Observable<CategoryResponse> {
        let params = {
            country: req.country ? req.country : '',
            page: req.page,
            perpage: req.perpage,
            keyword: req.keyword
        };
        return this.http.post<CategoryResponse>(environment.ApiUrl + `/getcountryinsightslists`, params)
    }

    addCountryInsight(data: CountryInsightsPayload): Observable<CountryInsightSuccess> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        let params = new FormData();
        params.append('flag', data.image);
        params.append('country', data.country);
        params.append('url', data.url);
        return this.http.post<CountryInsightSuccess>(environment.ApiUrl + '/addcountryinsights', params, {
            headers: headers,
        })
    }

    updateCountryInsight(req: CountryInsightsPayload, module_id: number): Observable<CountryInsightSuccess> {
        let params = new FormData();
        params.append('flag', req.image);
        params.append('country', req.country);
        params.append('url', req.url);
        params.append('id', module_id.toString());
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<CountryInsightSuccess>(environment.ApiUrl + `/updatecountryinsightslists`, params, {
            headers: headers,
        });
    }

    deleteCountryInsightWithQuestions(params: { id: number }): Observable<CountryInsightSuccess> {
        return this.http.post<CountryInsightSuccess>(environment.ApiUrl + '/deletecountryinsightslists', params)
    }

    getCountryList(): Observable<any> {
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.get<any>(environment.ApiUrl + '/country?getHomeCountry=1`', {
            headers: headers,
        });
    }

    getFilterCountryInsight() {

    }

}