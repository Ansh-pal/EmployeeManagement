import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  errorMessage = '';
  userRole: string | null = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userRole = this.authService.getRole();
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/form']);
  }

  onEditEmployee(id: number): void {
    this.router.navigate(['/employees/form', id]);
  }

  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== id);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  canModify(): boolean {
    return this.userRole === 'Admin';
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Unauthorized: Your session has expired. Please login again.';
    } else if (error.status === 403) {
      this.errorMessage = 'Forbidden: You do not have permission to view employees.';
    } else if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Bad request. Please check your input.';
    } else {
      this.errorMessage = 'Failed to load employees. Please try again later.';
    }
  }
}
