import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ExportData } from 'src/app/@Models/subscribers.model';

@Injectable({
  providedIn: 'root'
})
export class FaqCatService {

  constructor(private http:HttpClient) { }
  getFAQCategories(data:any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/faqcategorylist',data, {
        headers: headers,
    });
}
AddFAQCategories(data:any):Observable<any>{

  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addfaqcategory',data, {
      headers: headers,
  });
}
UpdateFAQCategories(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updatefaqcategory',data, {
      headers: headers,
  });
}
DeleteFAQCategories(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/deletefaqcategory',data, {
      headers: headers,
  });
}
faqCatExport() {
  return this.http.post<ExportData>(environment.ApiUrl + '/faqcategoryexport',{
  })
}
// blogs
getBlogCategories(data:any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/blogcategories',data ,{
      headers: headers,
  });
}
addCategories(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addblogcategory',data, {
      headers: headers,
  });
}
upadateCategories(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updateblogcategory',data, {
      headers: headers,
  });
}
getBlogTags(data):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/getblogtag',data ,{
      headers: headers,
  });
}
addBlogs(val: any):Observable<any> {
  const headers= new HttpHeaders()
  .set('Accept', "application/json")
  const formData = new FormData();
  formData.append("title",val.title);
  formData.append("slug",val.slug);
  formData.append("featured_img", val.featured_img);
  formData.append("blog_categories_id",val.blog_categories_id);
  formData.append("tags",val.tags);
  formData.append("seo_title",val.seo_title);
  formData.append("meta_description",val.meta_description);
  formData.append("meta_tags",val.meta_tags);
  formData.append("meta_author",val.meta_author);
  formData.append("content",val.content);
  formData.append("status",val.status);
  return this.http.post<any>(environment.ApiUrl+'/addblog',formData, {
    headers: headers,
});
}
updateBlogs(val: any):Observable<any> {
  const headers= new HttpHeaders()
  .set('Accept', "application/json")
  const formData = new FormData();
  formData.append("title",val.title);
  formData.append("slug",val.slug);
  formData.append("featured_img", val.featured_img);
  formData.append("blog_categories_id",val.blog_categories_id);
  formData.append("tags",val.tags);
  formData.append("seo_title",val.seo_title);
  formData.append("meta_description",val.meta_description);
  formData.append("meta_tags",val.meta_tags);
  formData.append("meta_author",val.meta_author);
  formData.append("content",val.content);
  formData.append("id",val.id);
  formData.append("status",val.status);
  return this.http.post<any>(environment.ApiUrl+'/updateblog',formData, {
    headers: headers,
});
}
saveDraft(val: any):Observable<any> {
  const headers= new HttpHeaders()
  .set('Accept', "application/json")
  const formData = new FormData();
  formData.append("title",val.title);
  formData.append("slug",val.slug);
  formData.append("featured_img", val.featured_img);
  formData.append("blog_categories_id",val.blog_categories_id);
  formData.append("tags",val.tags);
  formData.append("seo_title",val.seo_title);
  formData.append("meta_description",val.meta_description);
  formData.append("meta_tags",val.meta_tags);
  formData.append("meta_author",val.meta_author);
  formData.append("status",val.status);
  formData.append("content",val.content);
  return this.http.post<any>(environment.ApiUrl+'/addblog',formData, {
    headers: headers,
});
}
addTag(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/addblogtag',data, {
      headers: headers,
  });
}
upadateTag(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/updateblogtag',data, {
      headers: headers,
  });
}
getBlogs(data:any):Observable<any>{
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl+'/blogadminlist',data, {
      headers: headers,
  });
}
deleteCategory(data: any){
  return this.http.post<any>(environment.ApiUrl + '/deleteblogcategory', {ids : data});
}
deleteTags(data: any){
  return this.http.post<any>(environment.ApiUrl + '/deleteblogtag', {ids : data});
}
export() {
  return this.http.post<ExportData>(environment.ApiUrl + '/exportadminblog',{
  })
}
}
