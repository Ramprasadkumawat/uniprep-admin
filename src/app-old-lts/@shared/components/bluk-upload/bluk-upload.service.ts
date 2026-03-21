import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class BulkUploadService {
  constructor(private http: HttpClient) { }

  bulkUploadFile(url: string, formData: FormData) {
    return this.http.post<any>(`${environment.ApiUrl}${url}`, formData)
  }
}