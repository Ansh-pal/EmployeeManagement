import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'ems_token';

  constructor() { }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    
    if (token && token.trim()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token && token.trim() ? token : null;
  }

  /**
   * Clear token from localStorage
   */
  clearToken(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Decode JWT payload safely
   */
  decodeToken(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format');
        return null;
      }

      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.warn('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Extract role from decoded token
   * Handles both 'role' and 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' keys
   */
  getRole(): string | null {
    const payload = this.decodeToken();
    if (!payload) {
      return null;
    }

    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const role = payload['role'] || payload[roleKey];
    
    return typeof role === 'string' ? role : null;
  }
}

