import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add token for API requests
    if (this.isApiRequest(req.url)) {
      const token = this.tokenService.getToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized
        if (error.status === 401) {
          this.tokenService.clearToken();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if URL is an API request
   */
  private isApiRequest(url: string): boolean {
    return url.includes(this.apiBaseUrl);
  }
}
