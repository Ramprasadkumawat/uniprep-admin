import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { PreApplication, PreApplicationParams, QuestionHistoryData, ResponseReadingData, SubModuleData, SuggestedQuestionAndAnswerData, SuggestedQuestionData } from 'src/app/@Models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  constructor(private http: HttpClient) { }

  downloadFile(url: string): Observable<Blob> {
    // Set headers if needed (e.g., for authentication)
    const headers = new HttpHeaders();

    // Make a GET request to the URL
    return this.http.get(url, {
      responseType: 'blob', // Specify the response type as Blob
      headers: headers, // Pass any headers if needed
    });
  }

  getSubModuleList(req: any): Observable<any> {
    return this.http.post<SubModuleData>(environment.ApiUrl + `/GetQuestionsCount`, req)
  }

  editSubModuleList(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/EditSubmodule`, data)
  }

  updateSubModuleList(data: any): Observable<any> {
    let params = new FormData();
    params.append('id', data.id);
    params.append('countries', data.countries);
    params.append('image', data.image);
    params.append('submodulename', data.submoduleName);
    params.append('urlslug', data.urlslug);
    params.append('moduleId', data.moduleId);
    return this.http.post<SubModuleData>(environment.ApiUrl + `/UpdateSubmodules`, params)
  }

  getModuleQuestions(params: any): Observable<any> {
    return this.http.post<PreApplication>(environment.ApiUrl + '/getmodulequestions', params)
  }

  getActionedByUser(): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/actionedByUser', {})
  }
  addSubModules(data: any): Observable<any> {
    let params = new FormData();
    params.append('countries', data.countries);
    params.append('image', data.image);
    params.append('submodulename', data.submoduleName);
    params.append('urlslug', data.urlslug);
    params.append('moduleId', data.moduleId);
    params.append('status', data.status);
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/SubmoduleStore', params)
  }
  addCategory(data: any) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('moduleId', data.moduleId);
    params.append('status', data.status);
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/addcategory', params)
  }

  addUniPrepQuestion(params: any): Observable<any> {
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/adduniprepquestion', params)
  }
  updateUniPrepQuestion(params: any): Observable<any> {
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/updateuniprepquestion', params)
  }
  deleteUniPrepQuestion(params: any): Observable<any> {
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/deleteuniprepquestion', params)
  }
  getUniPrepQuestionEditHistory(id: number): Observable<any> {
    return this.http.post<QuestionHistoryData>(environment.ApiUrl + '/GetFaqEditHistory', { 'question_id': id })
  }

  readQuesImport(data: any): Observable<any> {
    let params = new FormData();
    params.append('input', data.selectedFile);
    if(data.country_id){
      params.append('country_id', data.country_id);
    }
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/ReadQuesImport', params)
  }

  readQuesExport(params: any): Observable<any> {
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/ReadQuesExport', params)
  }

  GetSuggestions(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/review/suggestions', val, { 'headers': headers });
  }

  getAllRequestedQuestionList(params: any): Observable<any> {
    return this.http.post<SuggestedQuestionData>(environment.ApiUrl + '/ShowRequestedQuestion', params)
  }

  getSelectedReqQuesList(params: number): Observable<any> {
    return this.http.post<SuggestedQuestionAndAnswerData>(environment.ApiUrl + '/SelectedReqQues', { user_id: params })
  }

  ActionSuggestion(val: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Accept', "application/json")
    return this.http.post(environment.ApiUrl + '/suggestions/action', val, { 'headers': headers });
  }

  GetReviewedByOrgLogo(params: {
    question_id: number,
  }): Observable<any> {
    let data = {
      question_id: params.question_id,
    }
    return this.http.post<any>(environment.ApiUrl + "/GetReviewedByOrgLogo", data);
  }

  makeQuestionFav(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + "/MakeQuestionFav", data);
  }

  //vivek 

  getModulesList(): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/modulecountry', {})
  }

  getSubmoulesListbyModAndCountry(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/GetSubmodulesNameList', data)
  }
  getSubmoulesList(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/getsubmodulesnamelistsm', data)
  }

  deleteSubmodulesWithQuestions(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/DelSubmodAndQues', data)
  }

  checkSubmoduleDeletePermission(): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/CheckSubmoduleDeletePermission', {})
  }

  getHomeCountry(homeCountryId: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
      headers: headers,
    });
  }

  getCategory() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/listqacategory`, {
      headers: headers,
    });
  }
  getsubmodulenames(category_id: string, parent_category_id?:number ) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    if (category_id == '') {
      let url = `${environment.ApiUrl}/getcategoryandsubmodulenames?category_flag=1`;
      if(parent_category_id&& parent_category_id!=0){
        url+=`&parent_category_id=${parent_category_id}`;
      }
      return this.http.get<any>(url, {
        headers: headers,
      });
    } else {
      let url = `${environment.ApiUrl}/getcategoryandsubmodulenames?category_id=${category_id}`;
      if(parent_category_id&& parent_category_id!=0){
        url+=`&parent_category_id=${parent_category_id}`;
      }
      return this.http.get<any>(url, {
        headers: headers,
      });
    }
    }
  getLearningCategories(req: any): Observable<any> {
    return this.http.post<SubModuleData>(environment.ApiUrl + `/getquestionscountforeachcategory `, req)
  }

  editLearningCategory(category_id: string) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getcategoryusingid?category_id=${category_id} `, {
      headers: headers,
    });
  }
  updateLearningCategory(req: any, category_id: string): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('category_id', category_id);
    return this.http.post<SubModuleData>(environment.ApiUrl + `/updatecategoryusingid`, params)
  }
  addLearningSubmodule(data){
    let params = new FormData();
    params.append('image', data.image);
    params.append('submodulename', data.submodulename);
    params.append('urlslug', data.urlslug);
    params.append('category_id', data.category_id);
    params.append('status', data.status);
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/addsubmoduleforlearninghub', params)
  }
  getLearningSubCategories(req: any): Observable<any> {
    return this.http.post<SubModuleData>(environment.ApiUrl + `/getquestionscountforsubmodule`, req)
  }
  editLearningSubCategory(submodule_id: string){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getsubmoduleforlearninghub?submodule_id=${submodule_id}`, {
      headers: headers,
    });
  }
  updateLearningSubCategory(req: any, submodule_id: string): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('submodulename', req.submodulename);
    params.append('urlslug', req.urlslug);
    params.append('submodule_id', submodule_id);
    return this.http.post<SubModuleData>(environment.ApiUrl + `/updatesubmoduleforlearninghub`, params)
  }
  getLearninghubLists (): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getlearninghublists?get_all_submodule_flag=1`, {
      headers: headers,
    })
  }
  readLearningExport(params: any): Observable<any> {
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/exportquestionslearninghub', params)
  }
  deleteCategoryWithQuestions(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/deletecategorysubmoduleandquestion', data)
  }
  deleteLearningHubQuestions(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/deleteuniprepquestion', data)
  }

  // k12 module api
  addCareerToolCategory(data: any) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('status', data.status);
    params.append('status', data.status);
    return this.http.post<any>(environment.ApiUrl + '/addcareertoolcategory', params)
  }

  addCareerToolCategoryTwo(data: any) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('status', data.status);
    params.append('parent_category_id', data.parent_category_id);
    params.append('parent_category_order', data.parent_category_order);
    return this.http.post<any>(environment.ApiUrl + '/addcareertoolcategorytwo', params)
  }



  getQuestionsCountForEachCategory(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getquestionscountforeachcategory `, req)
  }

  deleteCareerToolCategory(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/deletecareertoolcategory', data)
  }

  updateCareerToolCategory(req: any, category_id: any): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('module_id', req.moduleId);
    params.append('category_id', category_id);
    return this.http.post<any>(environment.ApiUrl + `/updatecareertoolcategory`, params)
  }

  updateCareerToolCategorySubject(req: any, category_id: any): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('module_id', req.moduleId);
    params.append('sub_category_id', category_id);
    return this.http.post<any>(environment.ApiUrl + `/updatecareertoolcategorytwo`, params)
  }


  updateK12SubCategory(req: any, category_id: any): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('submodulename', req.submodule);
    params.append('urlslug', req.urlslug);
    params.append('module_id', req.moduleId);
    params.append('submodule_id', category_id);
    return this.http.post<any>(environment.ApiUrl + `/updatecareertoolsubmodule`, params)
  }

   get3rdSubModuleCategory(req: any): Observable<any> {
       return this.http.post<any>(environment.ApiUrl + `/getquestionscountforsubmodule`, req)
   }

   // subject
  getSubjectList(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getquestionscountforeachcategory `, req)
  }


  addSubject(data: any) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('status', data.status);
    params.append('parent_category_id', data.parent_category_id);
    params.append('parent_category_order', data.parent_category_order);
    return this.http.post<any>(environment.ApiUrl + '/addcareertoolcategorytwo', params)
  }

  updateSubject(req: any, category_id: any): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('module_id', req.moduleId);
    params.append('sub_category_id', category_id);
    return this.http.post<any>(environment.ApiUrl + `/updatecareertoolcategorytwo`, params)
  }

  deleteCareerToolCategorySubject(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/deletecareertoolcategory', data)
  }


  // chapter
  getChapterListFromApi(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getquestionscountforsubmodule`, req)
  }

  addChapter(data: any) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('submodulename', data.submodulename);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.module_id);
    params.append('status', data.status);
    params.append('category_id', data.category_id);
    return this.http.post<any>(environment.ApiUrl + '/addcareertoolsubmodule', params)
  }

  updateChapter(req: any, category_id: any): Observable<any> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('submodulename', req.submodulename);
    params.append('urlslug', req.urlslug);
    params.append('module_id', req.module_id);
    params.append('submodule_id', category_id);
    return this.http.post<any>(environment.ApiUrl + `/updatecareertoolsubmodule`, params)
  }

}
