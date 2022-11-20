import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from '../interfaces/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private areaUrl = 'http://localhost:8080/api/v1/areas';

  constructor(private http: HttpClient) {}

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.areaUrl);
  }

  getAreaById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.areaUrl}/${id}`);
  }

  addArea(area: Area): Observable<Area> {
    return this.http.post<Area>(`${this.areaUrl}`, area);
  }

  updateArea(id: number, area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.areaUrl}/${id}`, area);
  }

  deleteArea(id: number): Observable<Area> {
    return this.http.delete<Area>(`${this.areaUrl}/${id}`);
  }
}
