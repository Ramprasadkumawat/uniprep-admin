import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class PitchDeskService {

  constructor(private http: HttpClient) { }

  getSelectBoxValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/PitchdeckSelectbox", {
      headers: headers,
    });
  }

  getHeadQuartersOptions(data: any){
    return this.http.post<any>(environment.ApiUrl + '/GetHeadQuartersbyCountry', {selectedCountry: data});
  }

  storePitchDeckData(data: any){
    return this.http.post<any>(environment.ApiUrl + '/StorePitchDeck', data);
  }

  getPitchDeckData(data: any){
    return this.http.post<any>(environment.ApiUrl + '/PitchDeckList', data);
  }

  importPitchDeck(data: any){
    let params = new FormData();
    params.append('input', data);
    return this.http.post<any>(environment.ApiUrl + '/PitchdeckImport', params);
  }

  exportPitchs(data: any){
    return this.http.post<any>(environment.ApiUrl + '/PitchdeckExport', data);
  }

  deletePitchs(data: any){
    return this.http.post<any>(environment.ApiUrl + '/DeletePitchDeck', {delete_id : data});
  }

  updatePitchDeck(data: any){
    return this.http.post<any>(environment.ApiUrl + '/UpdatePitchDeck', data);
  }
}
