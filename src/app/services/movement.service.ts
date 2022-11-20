import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movement } from '../interfaces/movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private movementUrl = 'http://localhost:8080/api/v1/movimientos';

  constructor(private http: HttpClient) {}

  getMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.movementUrl);
  }
}
