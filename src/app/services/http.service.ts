import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from 'src/environments/environment';
import { queryParams } from '../config/convertObjectToQuery';
import { encodeToBase64 } from '../config/encryption';
import { ResponseData } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor (private http: HttpClient) { }

  post(url: string, body: any) {
    return this.http.post<ResponseData>(environment.apiUrl + url, body);
    // return this.http.post<any>(environment.apiUrl + url, environment.production ? { payload: encodeToBase64(body) } : body);
  }

  get(url: string, params: any = {}) {
    return this.http.get<ResponseData>(environment.apiUrl + url, { params });
    // return this.http.get<any>(environment.apiUrl + url + queryParams(params));
  }

  update(url: string, body: any) {
    return this.http.put<ResponseData>(environment.apiUrl + url, body);
    // return this.http.put<any>(environment.apiUrl + url, environment.production ? { payload: encodeToBase64(body) } : body);
  }

  delete(url: string, params: any = {}) {
    return this.http.delete<ResponseData>(environment.apiUrl + url, { params });
    // return this.http.delete<any>(environment.apiUrl + url + queryParams(params));
  }
}
