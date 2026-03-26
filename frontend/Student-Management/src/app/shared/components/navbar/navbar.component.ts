import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateAuthState();
  }

  updateAuthState(): void {
    try {
      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn) {
        this.userRole = this.authService.getRole();
      }
    } catch (error) {
      console.warn('Error updating auth state:', error);
      this.isLoggedIn = false;
      this.userRole = null;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/auth/login']);
  }
}
