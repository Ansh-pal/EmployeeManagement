import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.tokenService.saveToken(response.token);
          }
        })
      );
  }

  /**
   * Login user
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.tokenService.saveToken(response.token);
          }
        })
      );
  }

  /**
   * Logout user - clear token
   */
  logout(): void {
    this.tokenService.clearToken();
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  /**
   * Get user role from token
   */
  getRole(): string | null {
    return this.tokenService.getRole();
  }
}
