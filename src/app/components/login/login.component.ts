import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login.response';
import { User } from 'src/app/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginValid = true;
  public username = '';
  public password = '';

  constructor(public router: Router, private authService: AuthService) {}

  public onSubmit(): void {
    this.authService.loginUser({
      nombre: this.username,
      contrasenna: this.password
    } as User).subscribe((login: Login) => {
      this.loginValid = login.logged;
      if (this.loginValid) {
        localStorage.setItem('username', this.username);
        this.navigateToPage();
      } else {
        this.handleNotAuthenticated();
      }
    }, () => {
      this.handleNotAuthenticated();
    });
  }

  private handleNotAuthenticated(): void {
    this.loginValid = false;
    Swal.fire('Error!', 'Credenciales inválidas, porfavor intente de nuevo!', 'error');
  }

  private navigateToPage() {
    if (this.username.includes('gerente_general')) {
      this.router.navigateByUrl('general-manager');
    } else if (this.username.includes('cajero')) {
      this.router.navigateByUrl('cashier');
    } else if (this.username.includes('personal_de_sistemas')) {
      this.router.navigateByUrl('system-staff');
    } else {
      this.router.navigateByUrl('area-manager');
    }
  }
}