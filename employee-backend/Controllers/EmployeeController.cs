using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EMS.Data;
using EMS.Models;
using EMS.DTOs;

namespace EMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // VIEW ALL EMPLOYEES (Admin + User)
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetEmployees()
        {
            var employees = _context.Employees.ToList();
            return Ok(employees);
        }

        // ADD EMPLOYEE (Admin Only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult AddEmployee(EmployeeDto dto)
        {
            var employee = new Employee
            {
                Name = dto.Name,
                Email = dto.Email,
                Department = dto.Department,
                Salary = dto.Salary,
                DateOfJoining = dto.DateOfJoining
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok(employee);
        }

        // UPDATE EMPLOYEE (Admin Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateEmployee(int id, EmployeeDto dto)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
                return NotFound();

            employee.Name = dto.Name;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.Salary = dto.Salary;
            employee.DateOfJoining = dto.DateOfJoining;

            _context.SaveChanges();

            return Ok(employee);
        }

        // DELETE EMPLOYEE (Admin Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return Ok("Employee deleted");
        }
    }
}
