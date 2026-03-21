import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AddQuizPayload, AddQuizQuestionPayload, AddSubCategoryPayload, CategoryResponse, CategorySuccess, GetCategoriesPayload, GetQuizPayload, getQuizQuestionPayload, GetSubcategoryPayload, QuizQuestionsAddSuccess, QuizQuestionsSuccess, QuizResponse, SubCategoryResponse, UpdateCategoryPayload, UpdateQuizPayload, UpdateQuizQuestionPayload, UpdateSubCategoryPayload } from 'src/app/@Models/test-categories.model';

@Injectable({
  providedIn: 'root'
})
export class TestListService {
  constructor(private http: HttpClient) { }

  addCategory(data: AddSubCategoryPayload) {
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('parent_category_id', data.parent_category_id);
    return this.http.post<any>(environment.ApiUrl + '/addcareertoolcategory', params)
  }
  getCategoriesList(req: GetCategoriesPayload): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(environment.ApiUrl + `/getcareertoolcategorylist?module_id=${req.moduleId}&page=${req.page}&perpage=${req.perpage}`)
  }
  updateCategory(req: UpdateCategoryPayload, category_id: number): Observable<CategorySuccess> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('category_id', category_id.toString());
    return this.http.post<CategorySuccess>(environment.ApiUrl + `/updatecareertoolcategory`, params)
  }
  deleteCategoryWithQuestions(params: { category_id: number }): Observable<CategorySuccess> {
    return this.http.post<CategorySuccess>(environment.ApiUrl + '/deletecareertoolcategory', params)
  }
  checkSubmoduleDeletePermission(): Observable<any> {
    return this.http.post<any>(environment.ApiUrl + '/CheckSubmoduleDeletePermission', {})
  }
  addQuiz(data: AddQuizPayload): Observable<CategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");

    let params = new FormData();
    params.append('image', data.image);
    params.append('submodulename', data.submodulename);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    if (data?.level) {
      params.append('quiz_level', data.level.toString());
    }
    params.append('category_id', data.category_id);
    return this.http.post<CategorySuccess>(environment.ApiUrl + '/addcareertoolsubmodule', params, {
      headers: headers,
    })
  }
  getQuizList(req: GetQuizPayload): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(environment.ApiUrl + `/getcareertoolsubmodulelist?category_id=${req.categoryId}&page=${req.page}&perpage=${req.perpage}`)
  }
  updateQuiz(req: UpdateQuizPayload, submodule_id: number): Observable<CategorySuccess> {
    let params = new FormData();
    params.append('image', req.image);
    params.append('submodulename', req.submodulename);
    params.append('urlslug', req.urlslug);
    if (req.level) {
      params.append('quiz_level', req.level.toString());
    }
    params.append('submodule_id', submodule_id.toString());
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<CategorySuccess>(environment.ApiUrl + `/updatecareertoolsubmodule`, params, {
      headers: headers,
    })
  }
  deleteQuizWithQuestions(params: { submodule_id: number }): Observable<CategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<CategorySuccess>(environment.ApiUrl + '/deletecareertoolsubmodule', params, {
      headers: headers,
    })
  }

  addSubCategory(data: AddSubCategoryPayload): Observable<CategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('image', data.image);
    params.append('categoryname', data.categoryname);
    params.append('urlslug', data.urlslug);
    params.append('module_id', data.moduleId);
    params.append('parent_category_id', data.parent_category_id
    );

    return this.http.post<CategorySuccess>(environment.ApiUrl + '/addcareertoolcategorytwo', params, {
      headers: headers,
    })
  }
  getSubCategoryList(req: GetSubcategoryPayload): Observable<SubCategoryResponse> {
    return this.http.get<SubCategoryResponse>(environment.ApiUrl + `/getcareertoolcategorylisttwo?parent_category_id=${req.categoryId}&module_id=${req.moduleId}&page=${req.page}&perpage=${req.perpage}`)
  }
  updateSubCategory(req: UpdateSubCategoryPayload, sub_category_id: number): Observable<CategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('image', req.image);
    params.append('categoryname', req.categoryname);
    params.append('urlslug', req.urlslug);
    params.append('sub_category_id', sub_category_id.toString());
    return this.http.post<CategorySuccess>(environment.ApiUrl + `/updatecareertoolcategorytwo`, params, {
      headers: headers,
    })
  }
  deleteSubCategory(params: { sub_category_id: number }): Observable<CategorySuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<CategorySuccess>(environment.ApiUrl + '/deletecareertoolcategorytwo', params, {
      headers: headers,
    })
  }
  getQuizQuestion(req: getQuizQuestionPayload): Observable<QuizQuestionsSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<QuizQuestionsSuccess>(environment.ApiUrl + '/filterquizquestion', req, {
      headers: headers,
    })
  }
  addQuizQuestion(req: AddQuizQuestionPayload): Observable<QuizQuestionsAddSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<QuizQuestionsAddSuccess>(environment.ApiUrl + '/addquizquestions', req, {
      headers: headers,
    })
  }
  updateQuizQuestions(req: UpdateQuizQuestionPayload): Observable<QuizQuestionsAddSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<QuizQuestionsAddSuccess>(environment.ApiUrl + '/updatequizquestions', req, {
      headers: headers,
    })
  }

  importFile(currentModuleId: string, data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new FormData();
    params.append('input', data);
    params.append('country_id', '0');
    params.append('module_id', currentModuleId);
    return this.http.post<QuizQuestionsAddSuccess>(`${environment.ApiUrl}/storectquizquestionsimport`, params, {
      headers: headers,
    });
  }
  deleteQuiz(data: { quizquestion_id: number }): Observable<CategorySuccess> {
    return this.http.post<CategorySuccess>(`${environment.ApiUrl}/deletequizquestion`, data)
  }
}
