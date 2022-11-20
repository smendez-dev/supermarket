import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.model';
import { Area } from '../interfaces/area.model';

export const PRODUCTS: Product[] = [
  {idProducto: 1, area: {} as Area, plu: 1, descripcion: 'Papas', peso: 500, precio: 25, isEdit: false, isAdd: false},
  {idProducto: 2, area: {} as Area, ean: 1, descripcion: 'Picaritas', precio: 100, cantidad: 15, isEdit: false, isAdd: false},
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUrl = 'http://localhost:8080/api/v1/productos';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.productUrl}`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.productUrl}/${id}`);
  }
}
