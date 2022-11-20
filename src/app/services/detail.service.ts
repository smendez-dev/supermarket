import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../interfaces/detail.model';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private detailUrl = 'http://localhost:8080/api/v1/detalles';

  constructor(private http: HttpClient) {}

  getDetails(): Observable<Detail[]> {
    return this.http.get<Detail[]>(this.detailUrl);
  }

  getDetailById(id: number): Observable<Detail> {
    return this.http.get<Detail>(`${this.detailUrl}/${id}`);
  }

  addDetail(detail: Detail): Observable<Detail> {
    return this.http.post<Detail>(`${this.detailUrl}`, detail);
  }

  updateDetail(id: number, detail: Detail): Observable<Detail> {
    return this.http.put<Detail>(`${this.detailUrl}/${id}`, detail);
  }

  deleteDetail(id: number): Observable<Detail> {
    return this.http.delete<Detail>(`${this.detailUrl}/${id}`);
  }
}
