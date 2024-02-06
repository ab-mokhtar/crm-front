import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/dist/types";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InactiveDaysService {
  constructor(private http: HttpClient) {}



  getInactiveDays(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<any[]>(`${environment.apiLocoal}/api/inactivedays/all-inactivedays`, { headers });
    } else {}
  }

  addInactiveDay(name: string, headers: HttpHeaders): Observable<any> {
    const body = { name: name };
    return this.http.post<any>(`${environment.apiLocoal}/api/inactivedays/add-inactiveday`, body, { headers });
  }
}
