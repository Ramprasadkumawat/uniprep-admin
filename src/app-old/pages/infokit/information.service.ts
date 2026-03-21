import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InformationService {
  constructor(private http: HttpClient) {}

  CreateParentFolder(val: any) {
    const formData = new FormData();
    formData.append("folder_name", val.folder_name);
    formData.append("parent_id", val.parent_id);
    formData.append("folder_icon", val.folder_icon);

    return this.http.post<any>(environment.ApiUrl + "/CreateFolder", formData);
  }
  UpdateFolder(val: any) {
    const formData = new FormData();
    formData.append("folder_name", val.folder_name);
    formData.append("id", val.id);
    formData.append("status", val.status);
    if (val.folder_icon) {
      formData.append("folder_icon", val.folder_icon);
    }
    return this.http.post<any>(environment.ApiUrl + "/UpdateFolder", formData);
  }

  GetFolderList(data): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/ListOfFolderAndFile",
      data,
      {
        headers: headers,
      }
    );
  }
  CreateFile(val: any) {
    const formData = new FormData();
    formData.append("folder_id", val.folder_id);
    formData.append("file_name", val.file_name);
    return this.http.post<any>(environment.ApiUrl + "/UploadFile", formData);
  }
  DeleteFile(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/DeleteInfo", val);
  }
}
