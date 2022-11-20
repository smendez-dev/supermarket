import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private saleUrl = 'http://localhost:8080/api/v1/ventas';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.saleUrl);
  }
}
