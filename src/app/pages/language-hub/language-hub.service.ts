import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ResponseReadingData } from 'src/app/@Models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageHubService {

  constructor(private http: HttpClient) { }

  addLanguage(data: any) {
    let params = new FormData();
    params.append('icon', data.image);
    params.append('languagename', data.languagename);
    params.append('languagecode', data.languagecode);
    params.append('speaker', data.speaker);
    params.append('urlslug', data.urlslug);
    return this.http.post<any>(environment.ApiUrl + '/addlanguage', params)
  }
  addLanguageSubModule(data: any) {
    let params = new FormData();
    params.append('icon', data.image);
    params.append('submodulesname', data.submodulesname);
    params.append('urlslug', data.urlslug);
    params.append('languageid', data.language_id);
    params.append('languagetype', data.language_type);
    return this.http.post<any>(environment.ApiUrl + '/addlanguagesubmodule', params)
  }
  addLanguageType(data: any) {
    let params = new FormData();
    params.append('icon', data.image);
    params.append('languagetype', data.languagetype);
    params.append('urlslug', data.urlslug);
    params.append('languageid', data.languageid);
    return this.http.post<any>(environment.ApiUrl + '/addlanguagetype', params)
  }
  updateLanguageSubModule(data: any): Observable<any> {
    let params = new FormData();
    if(data.image){
      params.append('icon', data.image);
    }
    params.append('submodule', data.submodulesname);
    params.append('urlslug', data.urlslug);
    params.append('languageid', data.language_id);
    params.append('languagetype', data.language_type);
    params.append('languagesubmodulesId', data.id);
    return this.http.post<any>(environment.ApiUrl + `/updatelanguagesubmodule`, params)
  }
  updateLanguageCategory(data: any): Observable<any> {
    let params = new FormData();
    if(data.image){
      params.append('icon', data.image);
    }
    params.append('languagename', data.languagename);
    params.append('urlslug', data.urlslug);
    params.append('languagecode', data.languagecode);
    params.append('speaker', data.speaker);
    params.append('languagesId', data.id);
    return this.http.post<any>(environment.ApiUrl + `/updatelanguage`, params)
  }
  updateLanguageType(data: any): Observable<any> {
    let params = new FormData();
    if(data.image){
      params.append('icon', data.image);
    }
    params.append('languagetype', data.languagetype);
    params.append('urlslug', data.urlslug);
    params.append('languagesId', data.id);
    return this.http.post<any>(environment.ApiUrl + `/updatelanguagetype`, params)
  }
  getlanguageList(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getlanguages`, req)
  }

  getlanguagesubmodulesList(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getlanguagesubmodule`, req)
  }

  getlanguageTypeList(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getlanguagetype`, req)
  }

  deletelanguageCategory(language_id: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/deletelanguage?languagesId=${language_id}`,{})
  }
  deletelanguageSubCategory(languagesubmodules_id: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/deletelanguagesubmodule?languagesubmodulesId=${languagesubmodules_id}`, {})
  }
  deletelanguageType(languagetype_id: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/deletelanguagetype?languagetypeId=${languagetype_id}`, {})
  }
  getlanguageQuestionsList(req: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getlanguagequestions`, req)
  }
  addLanguageQuestions(data: any) {
    return this.http.post<any>(environment.ApiUrl + '/addlanguagequestion', data)
  }
  updateLanguageQuestion(data: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/editlanguagequestion`, data)
  }
  deletelanguageQuestion(languagequestion_id: any): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/deletelanguagequestions?languagequestionId=${languagequestion_id}`, {})
  }
  languageQuestionsImport(data: any): Observable<any> {
    let params = new FormData();
    params.append('input', data.selectedFile);
    return this.http.post<ResponseReadingData>(environment.ApiUrl + '/languagequestionsimport', params)
  }
  makeQuestionFav(question_id:any,isFav:string):Observable<any> {
    return this.http.post<any>(environment.ApiUrl + `/getfavoritequestions`, {question_id:question_id,favourite:isFav})
  }
}
