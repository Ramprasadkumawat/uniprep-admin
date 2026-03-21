import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AcademicCategorySuccess, AcademicQuizQuestionPayload, AcademicQuizQuestionsAddSuccess, AcademicQuizQuestionsSuccess, AcademicResponse, AcademicPayload, GetAcademicPayload, getAcademicQuizQuestionPayload, Stream, StreamQuestionPayload, GetAcademicToolCategoryPayload } from 'src/app/@Models/academic-tools.model';
import { AddSubCategoryPayload, CategoryResponse, UpdateCategoryPayload } from 'src/app/@Models/test-categories.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {
  constructor(private http: HttpClient) { }
  addQuiz(data: AcademicPayload): Observable<AcademicCategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('image', data.image);
    params.append('submodulename', data.submodulename);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('category_type_id', data.category_id);
    params.append('category_id', data.submoduleId);

    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + '/addacademicsubmodule', params, {
      headers: headers,
    })
  }
  getQuizList(req: GetAcademicToolCategoryPayload): Observable<AcademicResponse> {
    let params = {
      module_id: req.module_id,
      page: req.page,
      perpage: req.perpage,
      category_id: req.submoduleId
    };
    return this.http.get<AcademicResponse>(environment.ApiUrl + `/getacademicsubmoduleList?module_id=${params.module_id}&category_id=${params.category_id}&page=${params.page}&perpage=${req.perpage}`)
  }
  updateQuiz(req: AcademicPayload, submodule_id: number): Observable<AcademicCategorySuccess> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('submodulename', req.submodulename);
    params.append('urlslug', req.urlslug);
    params.append('submodule_id', submodule_id.toString());
    params.append('category_type_id', req.category_id);
    params.append('category_id', req.submoduleId);

    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + `/updateacademicsubmodule`, params, {
      headers: headers,
    });
  }
  deleteQuizWithQuestions(params: { submodule_id: number }): Observable<AcademicCategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + '/deletecareertoolsubmodule', params, {
      headers: headers,
    });
  }
  checkSubmoduleDeletePermission(): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/CheckSubmoduleDeletePermission', {})
  }
  getQuizQuestion(req: getAcademicQuizQuestionPayload): Observable<AcademicQuizQuestionsSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicQuizQuestionsSuccess>(environment.ApiUrl + '/getacademicquestion', req, {
      headers: headers,
    });
  }

  addStreamQuestion(req: StreamQuestionPayload): Observable<AcademicQuizQuestionsAddSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicQuizQuestionsAddSuccess>(environment.ApiUrl + '/addacademicquestion', req, {
      headers: headers,
    });
  }

  updateStreamQuestion(req: StreamQuestionPayload): Observable<AcademicQuizQuestionsAddSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicQuizQuestionsAddSuccess>(environment.ApiUrl + '/updatacademicquestions', req, {
      headers: headers,
    });
  }

  importFile(currentModuleId: string, category_type_id: string, data: any): Observable<AcademicQuizQuestionsAddSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('input', data);
    params.append('category_type_id', category_type_id);
    params.append('module_id', currentModuleId);
    return this.http.post<AcademicQuizQuestionsAddSuccess>(`${environment.ApiUrl}/storectquizquestionsimport`, params, {
      headers: headers,
    });
  }
  deleteQuiz(data: { quizquestion_id: number }): Observable<AcademicCategorySuccess> {
    return this.http.post<AcademicCategorySuccess>(`${environment.ApiUrl}/deleteacademicquizquestions`, data);
  }
  getCategoryTypeList(): Observable<any> {
    return this.http.get<any>(environment.ApiUrl + `/getcategorytypes`)
  }
  getStreamList(): Observable<Stream[]> {
    return this.http.get<Stream[]>(environment.ApiUrl + `/getstreams `)
  }
  addStream(data: { name: string }): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(`${environment.ApiUrl}/addacademicstream`, data, {
      headers: headers,
    });
  }
  deleteStream(data: number[]): Observable<any> {
    let params = {
      stream_id: data
    }
    return this.http.post<any>(`${environment.ApiUrl}/deleteacademicstream`, params);
  }
  getAcademicToolList(req: GetAcademicPayload): Observable<CategoryResponse> {
    let params = {
      module_id: req.module_id,
      page: req.page,
      perpage: req.perpage
    };
    return this.http.get<CategoryResponse>(environment.ApiUrl + `/getcareertoolcategorylist?module_id=${params.module_id}&page=${params.page}&perpage=${req.perpage}`)
  }
  addAcademicTool(data: AddSubCategoryPayload): Observable<AcademicCategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('parent_category_id', data.parent_category_id);
    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + '/addcareertoolcategory', params, {
      headers: headers,
    })
  }
  updateAcademicTool(req: UpdateCategoryPayload, category_id: number): Observable<AcademicCategorySuccess> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('category_id', category_id.toString());
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + `/updatecareertoolcategory`, params, {
      headers: headers,
    });
  }
  deleteAcademicToolWithQuestions(params: { category_id: number }): Observable<AcademicCategorySuccess> {
    return this.http.post<AcademicCategorySuccess>(environment.ApiUrl + '/deletecareertoolcategory', params)
  }
}
