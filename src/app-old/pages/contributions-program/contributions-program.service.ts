import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { Countries,State,City } from "src/app/@Models/country.model";
import { ContributionCollege, ContributorsDetailsResponse, ContributorsPayLoad, ContributorsResponse, SaveResponse, StudentUserRes } from "src/app/@Models/contributions-program.model";


@Injectable({
    providedIn: 'root'
})
export class ContributionsService {

    constructor(private http: HttpClient) {

    }

    getLocationList(): Observable<any> {
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.get<any>(environment.ApiUrl + '/location', {
            headers: headers,
        });
    }

    getContributorDropDownList() {
        return this.http.get<any>(`${environment.ApiUrl}/contributordropdownlist`);
    }

    getContributionsList(val: any) {
        return this.http.post<ContributorsResponse>(`${environment.ApiUrl}/getcontributorlists`, val);
    }

    addContributor(val: ContributorsPayLoad): Observable<any> {
        return this.http.post<SaveResponse>(environment.ApiUrl + '/addcontributor', val,);
    }

    exportContributions(val: any): Observable<any> {
        return this.http.post(environment.ApiUrl + '/exportcontribution', val,);
    }

    exportContributors(val: any): Observable<any> {
        return this.http.post(environment.ApiUrl + '/exportcontributor', val,);
    }

    downloadFile(url: string): Observable<Blob> {
        const headers = new HttpHeaders();
        return this.http.get(url, { responseType: 'blob', headers: headers });
    }

    getContributionsDetail(id: string) {
        return this.http.post<ContributorsDetailsResponse>(`${environment.ApiUrl}/contributordetails`, { contributor_id: id });
    }

    updateDetails(data: any) {
        return this.http.post<ContributorsDetailsResponse>(environment.ApiUrl + `/updatecontributordetails`, data)
    }

    updateContributor(data: any) {
        return this.http.post<ContributorsResponse>(environment.ApiUrl + `/updatecontributor`, data)
    }

    addContributorArticle(val: any): Observable<any> {
        return this.http.post<any>(environment.ApiUrl + '/addcontributorarticles', val);
    }

    updateContributorArticle(data: any) {
        return this.http.post<any>(environment.ApiUrl + `/updatecontributorarticles`, data)
    }

    getArticleContributionsList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getcontributorarticlelists`, val);
    }

    addContributorGallery(req: any, contributor_id: string): Observable<any> {
        let params = new FormData();
        params.append('title', req.title);
        params.append('link', req.videoLink ? req.videoLink : '');
        params.append('file', req.file ? req.file : '');
        params.append('thumbnail', req.thumbnail ? req.thumbnail : '');
        params.append('contributor_id', contributor_id.toString());
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + `/createcontributorgallery`, params, {
            headers: headers,
        });
    }

    getContributionGalleryList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getcontributorgallerylists`, val);
    }

    updateContributeGallery(req: any, contributor_id: string) {
        let params = new FormData();
        params.append('title', req.title);
        params.append('link', req.videoLink ? req.videoLink : '');
        params.append('file', req.file ? req.file : '');
        params.append('thumbnail', req.thumbnail ? req.thumbnail : '');
        params.append('contributor_id', contributor_id.toString());
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + `/updatecontributorgallery`, params, {
            headers
        });
    }

    deteteContributor(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/deletecontributor`, val);
    }

    getCollegeDropdownValues(val: any) {
        return this.http.get<any>(`${environment.ApiUrl}/collegecontributordropdownlist`, val);
    }

    getInstitutetypes() {
        return this.http.get<any>(`${environment.ApiUrl}/getinstitutetypes`);
    }

    getContributorCollegeList(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/getcollegecontributorlist', val);
    }

    addCollegeContributor(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/addcollegecontributor', val);
    }

    updateCollegeContributor(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/updatecollegecontributor', val);
    }

    getContributionsDetails(id: string) {
        return this.http.post<any>(`${environment.ApiUrl}/fetchcontributordetails`, { id: id });
    }

    getCollgesDetails(id: string) {
        return this.http.post<any>(`${environment.ApiUrl}/getcollegedetails`, { id: id });
    }

    updateContributionDetails(data: any) {

        let params = new FormData();
        params.append('id', data.id ?? '');
        params.append('name', data.name ?? '');
        params.append('email', data.email ?? '');
        params.append('phone', data.phone ?? '');
        params.append('image', data.image ?? '');
        params.append('url_slug', data.url_slug ?? '');
        params.append('designation', data.designation ?? '');
        params.append('contributor_details', data.contributor_details ?? '');
        params.append('totalstudent', data.totalstudent);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + `/createcontributorprofile`, params, {
            headers
        });
    }

    updateCollegeInfo(data: any) {
        let params = new FormData();
        params.append('id', data.id);
        params.append('url_slug', data.url_slug ?? '');
        params.append('college_info', data.college_info ?? '');
        if (typeof data.image !== 'string') {
            params.append('image', data.image ?? '');
        }
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + `/updatecollegeinfo`, params, {
            headers
        });
    }

    deteteContributorArticle(data: any) {
        return this.http.post<any>(`${environment.ApiUrl}/deletecontributorarticles`, data);
    }

    getCollegeArticleList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getcollegearticleslists`, val);
    }

    addCollegeArticle(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/addcollegearticles', val);
    }

    updateCollegeArticle(data: any) {
        return this.http.post<any>(environment.ApiUrl + `/updatecollegearticles`, data)
    }

    deteteCollegeArticle(data: any) {
        return this.http.post<any>(`${environment.ApiUrl}/deletearticles`, data);
    }

    getCollegeGalleryList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getcollegegallerylists`, val);
    }

    addCollegeGallery(data: any) {
        let params = new FormData();
        params.append('college_contribution_id', data.college_contribution_id);
        params.append('title', data.title);
        params.append('youtube_link', data.youtube_link);
        params.append('image', data.image);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + `/createcollegegallery`, params, {
            headers: headers,
        });
    }

    deteteCollegeGallery(data: any) {
        return this.http.post<any>(`${environment.ApiUrl}/deletegallery`, data);
    }

    getContributorList(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getcontributorslist`, val);
    }

    getAssignedContributors(val: any) {
        return this.http.post<any>(`${environment.ApiUrl}/getassignedcontributors`, val);
    }

    addAssignedContributor(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/assigncontributor', val);
    }

    updateAssignedContributor(data: any) {
        return this.http.post<any>(environment.ApiUrl + `/updateassignedcontributor`, data)
    }

    deteteAssignedContributor(data: any) {
        return this.http.post<any>(`${environment.ApiUrl}/deleteassignedcontributor`, data);
    }

    exportContributorsColleges(val: any) {
        return this.http.post<any>(environment.ApiUrl + '/exportcollegecontributor', val,);
    }

    importContributorsColleges(val: any) {
        let params = new FormData();
        params.append('file', val);
        return this.http.post<any>(environment.ApiUrl + '/importcollegecontributor', params);
    }

    generateInvoice(contributorId: any) {
        return this.http.post<{ invoice_link: string }>(`${environment.ApiUrl}/generateinvoice `, { contributor_id: contributorId });
    }

    insertEvents(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/createcollegeevent `, data);
    }

    listOfEvents(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/getcollegeevent`, data);
    }

    updateEvents(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/updatecollegeevent`, data);
    }

    exportEvents(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/exportCollegeEvent`, data);
    }

    getGalleries(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/geteventgallerylists`, data);
    }

    addEventGallery(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/createeventgallery`, data);
    }

    updateEventgallery(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/updateeventgallery`, data);
    }

    deleteEventGallery(data: any){
        return this.http.post<any>(`${environment.ApiUrl}/deleteeventgallery `, data);
    }

    getWorldCountries() {
        return this.http.get<Countries[]>(environment.ApiUrl + '/getWorldCountries');
    }
    getWorldStates(countryId: number) {
        return this.http.get<State[]>(environment.ApiUrl + `/getWorldStates?country_id=${countryId}`);
    }

    getWorldCities(stateId:number) {
        return this.http.get<City[]>(environment.ApiUrl + `/getWorldCities?state_id=${stateId}`);
    }

    getStudentUsers(collegeId: string){
        return this.http.get<StudentUserRes>(`${environment.ApiUrl}/getuserslist?college_contribution_id=${collegeId}`);
    }
    getCollegesforContribution(){
        return this.http.get<ContributionCollege[]>(`${environment.ApiUrl}/getcollegeforcontribution`);
    }
}

