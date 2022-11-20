import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.response';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/v1/usuarios';
  public isLoggedIn = false;

  constructor(private http: HttpClient) {}

  public loginUser(user: User): Observable<Login> {
    return this.http.post<Login>(`${this.authUrl}/login`, user);
  }

  public logoutUser(username: string): Observable<void> {
    return this.http.put<void>(`${this.authUrl}/logout/${username}`, {});
  }
}
