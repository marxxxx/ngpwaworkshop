import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


  getMessages(): Observable<string[]> {
    return this.http.get<string[]>(environment.baseUrl);
  }

  sendMessage(name: string, message: string): Observable<any> {
    const request = {name: name, message: message};
    return this.http.post(environment.baseUrl, request);
  }
}
