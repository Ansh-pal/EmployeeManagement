import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Auth routes (anonymous)
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },

  // Employee routes (requires authentication)
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employees/form',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'employees/form/:id',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },

  // Default route
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
