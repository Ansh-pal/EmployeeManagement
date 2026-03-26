import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // First check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check if route requires specific role
    const requiredRole = route.data['role'];
    if (!requiredRole) {
      // No role requirement, allow access
      return true;
    }

    // Get user's role from token
    const userRole = this.authService.getRole();
    
    // Check if user has required role
    if (userRole === requiredRole) {
      return true;
    }

    // Redirect to employees if unauthorized
    this.router.navigate(['/employees']);
    return false;
  }
}
