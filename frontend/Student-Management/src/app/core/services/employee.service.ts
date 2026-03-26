import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee } from '../models/employee.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/employee`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**
   * Get authorization headers with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Get all employees
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Add new employee
   */
  addEmployee(payload: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update existing employee
   */
  updateEmployee(id: number, payload: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
