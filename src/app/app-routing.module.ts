import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaManagerComponent } from './components/area-manager/area-manager.component';
import { CashierComponent } from './components/cashier/cashier.component';
import { GeneralManagerComponent } from './components/general-manager/general-manager.component';
import { LoginComponent } from './components/login/login.component';
import { SystemStaffComponent } from './components/system-staff/system-staff.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cashier',
    component: CashierComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'area-manager',
    component: AreaManagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'general-manager',
    component: GeneralManagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'system-staff',
    component: SystemStaffComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
