import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  isEditMode = false;
  employeeId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      dateOfJoining: ['', [Validators.required]]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = parseInt(params['id']);
        this.loadEmployee(this.employeeId);
      }
    });
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        const employee = employees.find(e => e.id === id);
        if (employee) {
          this.populateForm(employee);
        } else {
          this.errorMessage = 'Employee not found.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
      dateOfJoining: employee.dateOfJoining
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      // Update existing employee
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Employee updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.handleError(error);
        }
      });
    } else {
      // Create new employee
      this.employeeService.addEmployee(formData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Employee created successfully!';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.handleError(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Unauthorized: Your session has expired. Please login again.';
    } else if (error.status === 403) {
      this.errorMessage = 'Forbidden: You do not have permission to perform this action.';
    } else if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Bad request. Please check your input.';
    } else {
      this.errorMessage = 'Operation failed. Please try again later.';
    }
  }

  get name() {
    return this.employeeForm.get('name');
  }

  get email() {
    return this.employeeForm.get('email');
  }

  get department() {
    return this.employeeForm.get('department');
  }

  get salary() {
    return this.employeeForm.get('salary');
  }

  get dateOfJoining() {
    return this.employeeForm.get('dateOfJoining');
  }
}
