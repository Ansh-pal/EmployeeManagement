# EMS Frontend - Manual Test Steps

This document outlines the manual testing flow for the Employee Management System (EMS) frontend application.

## Prerequisites
- Backend running at `https://localhost:7206`
- Frontend running at `http://localhost:4200`
- Backend has at least 2 users:
  - Username: `user` / Password: `123` (Role: User)
  - Username: `admin` / Password: `123` (Role: Admin)
- Backend has sample employee data

---

## Test 1: Register New User

### Steps:
1. Navigate to `http://localhost:4200`
2. You should be redirected to `/auth/login`
3. Click "Register here" link to go to `/auth/register`
4. Fill in the form:
   - Username: `testuser` (or any unique username)
   - Password: `password123`
5. Click "Register" button

### Expected Results:
- ✅ Form validation passes
- ✅ API POST to `/api/auth/register` succeeds
- ✅ Success message displays: "Registration successful! Redirecting to login..."
- ✅ After ~1.5 seconds, redirects to `/auth/login`
- ✅ Navbar shows "Login" and "Register" links (not logged in)

### FAIL Cases to test:
- Empty username → Error message: "Username is required"
- Empty password → Error message: "Password is required"
- Short password (< 6 chars) → Error message: "Password must be at least 6 characters"

---

## Test 2: Login as Regular User (view-only)

### Steps:
1. From `/auth/login`, login with:
   - Username: `user`
   - Password: `123`
2. Click "Login" button

### Expected Results:
- ✅ API POST to `/api/auth/login` succeeds
- ✅ Token stored in localStorage under key `ems_token`
- ✅ Success message: "Login successful!"
- ✅ After ~1 second, redirects to `/employees`
- ✅ Navbar shows:
  - "Employees" link
  - Role badge: "User" (blue badge)
  - "Logout" button
- ✅ Employee list displays as a table with columns:
  - ID, Name, Email, Department, Salary, Date of Joining
- ✅ **NO** "Add Employee" button (view-only for non-Admin)
- ✅ **NO** Edit/Delete buttons in the table rows

### Verify Token in DevTools:
- Open DevTools → Application → LocalStorage → http://localhost:4200
- Key `ems_token` should exist with JWT token value

---

## Test 3: Login as Admin User (full access)

### Steps:
1. Click "Logout" button in navbar
2. Verify redirected to `/auth/login`
3. Verify token removed from localStorage
4. Login with:
   - Username: `admin`
   - Password: `123`
5. Click "Login" button

### Expected Results:
- ✅ Login successful, redirects to `/employees`
- ✅ Navbar shows:
  - "Employees" link
  - Role badge: "Admin" (blue badge)
  - "Logout" button
- ✅ Employee list displays
- ✅ **"+ Add Employee"** button visible at top-right
- ✅ Each employee row shows **Edit** and **Delete** buttons

### Test Add Employee:
1. Click "+ Add Employee" button
2. Navigate to `/employees/form` (create mode)
3. Form shows heading: "Add Employee"
4. Fill in form with sample data:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Department: `IT`
   - Salary: `50000`
   - Date of Joining: (pick a date)
5. Click "Save" button

### Expected Results:
- ✅ Button changes to "Saving..." while loading
- ✅ API POST to `/api/employee` succeeds
- ✅ Success message: "Employee created successfully!"
- ✅ After ~1 second, redirects to `/employees`
- ✅ New employee appears in the list

### Test Edit Employee:
1. Click "Edit" button on any employee row
2. Navigate to `/employees/form/{id}` (edit mode)
3. Form shows heading: "Edit Employee"
4. Form pre-populated with existing employee data
5. Change Department to `HR`
6. Click "Save" button

### Expected Results:
- ✅ API PUT to `/api/employee/{id}` succeeds
- ✅ Success message: "Employee updated successfully!"
- ✅ After ~1 second, redirects to `/employees`
- ✅ List reflects updated data

### Test Delete Employee:
1. Click "Delete" button on any employee row
2. Browser confirmation dialog appears: "Are you sure you want to delete this employee?"
3. Click "OK" to confirm

### Expected Results:
- ✅ API DELETE to `/api/employee/{id}` succeeds
- ✅ Employee immediately removed from the list
- ✅ No error message displayed

---

## Test 4: Verify 401 Unauthorized Behavior

### Steps:
1. Login as `user` (as in Test 2)
2. Verify you're on `/employees` and can see the list
3. Open DevTools → Application → LocalStorage
4. **Manually delete** the `ems_token` key (or set to invalid value)
5. Refresh the page

### Expected Results:
- ✅ HTTP Interceptor detects 401 or missing token
- ✅ Token cleared from localStorage
- ✅ Redirected to `/auth/login`
- ✅ Error message (if any API call made): "Unauthorized: Your session has expired. Please login again."

### Alternative: Trigger 401 via API
1. Login as `user`
2. Open DevTools → Network tab
3. Try to access `/employees/form` (create new employee)
4. Guard should prevent access (even before API call)

### Expected Results:
- ✅ `RoleGuard` blocks access because role is "User" not "Admin"
- ✅ Redirected to `/employees` (line in RoleGuard)

---

## Test 5: Verify 403 Forbidden Behavior for Non-Admin

### Steps:
1. Login as `user` (regular user)
2. Manually navigate to `http://localhost:4200/employees/form` (create new employee)

### Expected Results:
- ✅ `RoleGuard` checks if user has "Admin" role
- ✅ Since user role is "User", access denied
- ✅ Redirected to `/employees` (fallback route per RoleGuard)
- ✅ Navbar still shows "User" role badge
- ✅ No error message (silent redirect)

### Test Add/Edit Button Visibility:
1. While logged in as "User"
2. Navigate to `/employees`
3. Verify:
   - ✅ NO "+ Add Employee" button
   - ✅ NO "Edit/Delete" buttons on rows

### Test Direct Route Access:
1. While logged in as "User"
2. Manually type in URL: `http://localhost:4200/employees/form/1` (edit mode)
3. Guard should block access
4. Redirected to `/employees`

---

## Test 6: Verify Backend URL Configuration

### Steps:
1. Open DevTools → Network tab
2. Login or navigate to `/employees`
3. Look at all HTTP requests

### Expected Results:
- ✅ All API requests go to `https://localhost:7206/api/`
  - e.g., `https://localhost:7206/api/auth/login`
  - e.g., `https://localhost:7206/api/employee`
  - e.g., `https://localhost:7206/api/employee/{id}`

### Verify in Code:
1. Open `src/environments/environment.ts`
2. Verify `apiBaseUrl: 'https://localhost:7206/api'`
3. Open `src/app/core/services/auth.service.ts`
4. Verify it uses `environment.apiBaseUrl`

### Expected Results:
- ✅ `apiBaseUrl` is exactly `https://localhost:7206/api`
- ✅ All services inject and use this URL
- ✅ No hardcoded URLs in service files

---

## Additional Edge Cases to Test

### Session Expiry
1. Login as admin
2. Wait for token expiration (adjust backend token TTL if needed)
3. Try to load `/employees`

**Expected**: 401 error handling kicks in, redirect to login

### Network Error
1. Login successfully
2. Turn off backend service
3. Try to add/edit/delete employee

**Expected**: Error message displays, request fails gracefully

### Invalid Token Format
1. Login and get token
2. Manually truncate token in DevTools → LocalStorage
3. Refresh page and try to access protected route

**Expected**: Token rejected, redirect to login

### Cancel Button on Form
1. Login as admin
2. Go to `/employees/form`
3. Click "Cancel" button

**Expected**: Navigates back to `/employees` without saving

---

## Success Criteria

- [ ] All 6 main test flows pass
- [ ] No console errors logged
- [ ] Navbar state correctly reflects login status and role
- [ ] Guards prevent unauthorized access
- [ ] Error messages display cleanly for API failures
- [ ] Token properly managed (saved/cleared)
- [ ] Backend URL is correct: `https://localhost:7206/api`
- [ ] All components render without layout issues
- [ ] Form validations work (username/password/email/salary)
- [ ] Redirects work as expected on login/logout
