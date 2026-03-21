import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AddOrUpdateResponse } from 'src/app/@Models/government-funding.model';
import { ExportData } from 'src/app/@Models/subscribers.model';
import { AddQuizQuestionPayload, CategorySuccess, GetQuizPayload, getQuizQuestionPayload, QuizQuestionsAddSuccess, QuizQuestionsSuccess, QuizResponse, UpdateQuizQuestionPayload } from 'src/app/@Models/test-categories.model';

@Injectable({
  providedIn: 'root'
})
export class FounderstoolService {
  headers = new HttpHeaders().set("Accept", "application/json");
  constructor(private http:HttpClient) { }
  addFound(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("coverimage", val.coverimage);
    formData.append("description",val.description);
    formData.append("category",val.category);
    return this.http.post<any>(environment.ApiUrl+'/addfounder',formData, {
      headers: headers,
  });
  }
  editAcademy(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    const formData = new FormData();
    formData.append("title",val.title);
    formData.append("link",val.link);
    formData.append("coverimage", val.coverimage);
    formData.append("description",val.description);
    formData.append("id",val.id);
    formData.append("category",val.category);
    return this.http.post<any>(environment.ApiUrl+'/editfounder',formData, {
      headers: headers,
  });
  }
  getlistAcademy(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/founderslist',val, {
      headers: headers,
  });
  }
  getFounderCategory():Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/getfoundercategory', {
      headers: headers,
  });
  }
  deleteAcademy(val: any):Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.post<any>(environment.ApiUrl+'/deletefounder',val, {
      headers: headers,
  });
  }

  // investor pitch
  getInvestorPitch(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/listinvestorpitch',data, {
        headers: headers,
    });
}

AddInvestor(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addinvestorpitch',data, {
      headers: headers,
  });
}
UpdateInvestor(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/editinvestorpitch',data, {
      headers: headers,
  });
}
deleteInvestor(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/deletefaqquestion', data,{
      headers: headers,
  });
}
investorExport() {
  return this.http.post<ExportData>(environment.ApiUrl + '/exportinvestorpitch',{
  })
}

investorImport(data: any) {
  let params = new FormData();
  params.append('input', data);
  return this.http.post<any>(environment.ApiUrl + '/importinvestorpitch', params)
}

// startup glossary
AddStartUpGlossary(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addstartupglossary',data, {
      headers: headers,
  });
}
getListStartUpGlossary(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/liststartupglossary',data, {
      headers: headers,
  });
}
UpdateStartUpGlossary(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/editstartupglossary',data, {
      headers: headers,
  });
}
investorStartUpGlossary() {
  return this.http.post<ExportData>(environment.ApiUrl + '/exportstartupglossary',{
  })
}

// entrprenuer test
AddEntreprenuerTest(data:any):Observable<any>{
  const formData = new FormData();
  formData.append("module_id",data.module_id);
  formData.append("urlslug",data.urlslug);
  formData.append("submodulename", data.submodulename);
  formData.append("icon", data.icon);
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addentrepreneurtest',formData, {
      headers: headers,
  });
}
getEntreprenuerTest(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/getentrepreneurtestlist',data, {
      headers: headers,
  });
}
UpdateEntreprenuerTest(data:any):Observable<any>{
  const formData = new FormData();
  formData.append("module_id",data.module_id);
  formData.append("urlslug",data.urlslug);
  formData.append("submodulename", data.submodulename);
  formData.append("icon", data.icon);
  formData.append("id",data.id)
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updateentrepreneurtest',formData, {
      headers: headers,
  });
}
DeleteEntreprenuerTest(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/deleteentrepreneurtest',data, {
      headers: headers,
  });
}
// quiz add
// addQuizQuestion(req: AddQuizQuestionPayload): Observable<QuizQuestionsAddSuccess> {
//   const headers = new HttpHeaders().set("Accept", "application/json");
//   return this.http.post<QuizQuestionsAddSuccess>(environment.ApiUrl + '/addquizquestions', req, {
//     headers: headers,
//   })
// }
// updateQuizQuestions(req: UpdateQuizQuestionPayload): Observable<QuizQuestionsAddSuccess> {
//   const headers = new HttpHeaders().set("Accept", "application/json");
//   return this.http.post<QuizQuestionsAddSuccess>(environment.ApiUrl + '/updatequizquestions', req, {
//     headers: headers,
//   })
// }
// getQuizQuestion(req: getQuizQuestionPayload): Observable<QuizQuestionsSuccess> {
//   const headers = new HttpHeaders().set("Accept", "application/json");
//   return this.http.post<QuizQuestionsSuccess>(environment.ApiUrl + '/filterquizquestion', req, {
//     headers: headers,
//   })
// }
// deleteQuiz(data: { quizquestion_id: number }): Observable<CategorySuccess> {
//   return this.http.post<CategorySuccess>(`${environment.ApiUrl}/deletequizquestion`, data)
// }
// importFile(currentModuleId: string, data: any) {
//   const headers = new HttpHeaders().set("Accept", "application/json");
//   let params = new FormData();
//   params.append('input', data);
//   params.append('country_id', '0');
//   params.append('module_id', currentModuleId);
//   return this.http.post<QuizQuestionsAddSuccess>(`${environment.ApiUrl}/storectquizquestionsimport`, params, {
//     headers: headers,
//   });
// }
// getQuizList(req: GetQuizPayload): Observable<QuizResponse> {
//   return this.http.get<QuizResponse>(environment.ApiUrl + `/getcareertoolsubmodulelist?category_id=${req.categoryId}&page=${req.page}&perpage=${req.perpage}`)
// }
addQuizQuestion(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addquizquestions',data, {
      headers: headers,
  });
}
getQuizQuestion(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/filterquizquestion',data, {
      headers: headers,
  });
}
updateQuizQuestions(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updatequizquestions',data, {
      headers: headers,
  });
}
deleteQuiz(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/deletequizquestion',data, {
      headers: headers,
  });
}
importFile(data: any) {
  let params = new FormData();
  params.append('input', data);
  return this.http.post<any>(environment.ApiUrl + '/storectquizquestionsimport', params)
}

  //goverment funding
  getFundList(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/getgovernmentfundlist", val, {
      headers: this.headers,
    });
  }

  addGovernmentFunding(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AddOrUpdateResponse>(environment.ApiUrl + '/addgovernmentfunding', data, {
      headers: headers,
    });
  }

  getFundType() {
    return this.http.get<any>(environment.ApiUrl + "/govtfundingtypes ", { headers: this.headers });
  }

  GetUserPersonalInfo() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetUserPersonalDetails", {
      headers: headers,
    });
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders();
    return this.http.get(url, { responseType: 'blob', headers: headers });
  }

  getFundName() {
    return this.http.get<{ name: string }[]>(environment.ApiUrl + "/govtfundingname ", { headers: this.headers });
  }

  addFavFundData(Fund_id: any, user_id: any, fav: any) {
    let params = {
      govtfund_id: Fund_id,
      user_id: user_id,
      updateFavourite: fav
    }

    return this.http.post<AddOrUpdateResponse>(environment.ApiUrl + "/addGovtFundFavourite", params, {
      headers: this.headers,
    });
  }

  exportSelectedData(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/exportgovernmentfunding  ", data, {
      headers: this.headers,
    });
  }

  getFundStateByCountry() {
    let params = new HttpParams();
    return this.http.post<{ region: string }>(environment.ApiUrl + "/govtfundingRegions", {
      headers: this.headers
    });
  }

  getFundCountries() {
    return this.http.get<any>(environment.ApiUrl + "/govtfundingCountry", {
      headers: this.headers
    });
  }
  countriesLoading(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AllCountries" ,{
      headers: headers,
    });
  }
}

