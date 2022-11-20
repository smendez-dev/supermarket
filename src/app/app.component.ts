import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isAuthenticated = false;
  public showLogout = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.showLogout = localStorage.getItem('username') ? true : false;
  }

  logout(): void {
    this.authService.logoutUser(localStorage.getItem('username') || '').subscribe(() => {
      this.router.navigateByUrl('login');
      localStorage.removeItem('username');
    });
  }
}
