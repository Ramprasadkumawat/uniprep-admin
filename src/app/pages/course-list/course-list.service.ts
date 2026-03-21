import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseListService {

  constructor(private http: HttpClient) { }

  getSelectBoxValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CourseListSelectBox", {
      headers: headers,
    });
  }

  addNewSelectBoxValue(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AddNewOptionValue", data ,{
      headers: headers,
    });
  }

  addCourse(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StoreCourse", data ,{
      headers: headers,
    });
  }

  fetchCoursesList(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CourseList", data ,{
      headers: headers,
    });
  }

  updateCourseListData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/updateCourse", data ,{
      headers: headers,
    });
  }

  exportCourse(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/courseExport", data ,{
      headers: headers,
    });
  }

  deleteCourse(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/deleteCourse", data ,{
      headers: headers,
    });
  }
  // import(data: any): Observable<any> {
    
  //   let params = new FormData();
  //   params.append('input', data);
  //   return this.http.post<any>(environment.ApiUrl + '/courseImport', params)
  // }
  import(data: FormData): Observable<any> {        
    return this.http.post<any>(environment.ApiUrl + '/courseImport', data);
  }
  getCourseName(start: number, limit: number, searchTerm?: string): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");

   
    const body = {
      start: start,
      limit: limit,
      search: searchTerm || ''
    };

    return this.http.post<any>(environment.ApiUrl + "/CourseListSelectBox", body, { headers });
  }
 
  
  addUniversity(data: any): Observable<any> {
    let params = new FormData();
    params.append('university_name', data.university_name);
    params.append('university_link', data.university_link);
    params.append('country', data.country);
    params.append('campus', data.campus);
    params.append('estd_year', data.estd_year);
    params.append('world_rank', data.world_rank);
    params.append('university_logo', data.university_logo);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/storeUniversity ", params ,{
      headers: headers,
    });
  }
  fetchUniversityList(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getUniversities ", data ,{
      headers: headers,
    });
  }
  editUniversity(data: any): Observable<any> {
    let params = new FormData();
    params.append('id',localStorage.getItem("editID"))
    params.append('university_name', data.university_name);
    params.append('university_link', data.university_link);
    params.append('country', data.country);
    params.append('campus', data.campus);
    params.append('estd_year', data.estd_year);
    params.append('world_rank', data.world_rank);
    params.append('university_logo', data.university_logo);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/updateUniversity", params ,{
      headers: headers,
    });
  }
  
  deleteUniversity(university:  number) {       
    const headers = new HttpHeaders().set("Accept", "application/json");
    const url = `${environment.ApiUrl}/deleteUniversity`;      
    const params = { id: university.toString() };  
    return this.http.get<any>(url, { headers: headers, params: params });
  }
  
  getSubjects(data:any) {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
      return this.http.post<any>(environment.ApiUrl + "/filterSubjects",data, {
        headers: headers,
      });
    }
    //unifinder-subject
    addSubjectCategory(data:any){
      const headers= new HttpHeaders()
      .set('Accept', "application/json")
        return this.http.post<any>(environment.ApiUrl + "/storeSubCategory",data, {
          headers: headers,
        });
    }
    storeSubjects (data:any){
      const headers= new HttpHeaders()
      .set('Accept', "application/json")
        return this.http.post<any>(environment.ApiUrl + "/storeSubjects",data, {
          headers: headers,
        });
    }
    
    fetchSubjectList(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/subjectsList ", data ,{
        headers: headers,
      });
    }
    updateSubjectCategory(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/updateSubCategory", data ,{
        headers: headers,
      });
    }
    updateSubject(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/updateSubjects", data ,{
        headers: headers,
      });
    }
    
    deleteSubjects(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/deleteSubject", data ,{
        headers: headers,
      });
    }
    exportUniversity(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/exportUniversity", data ,{
        headers: headers,
      });
    }
    
    exportSubject(data: any){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/exportSubject", data ,{
        headers: headers,
      });
    }
}
