using System.ComponentModel.DataAnnotations;

namespace EMS.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        public string Department { get; set; }

        public decimal Salary { get; set; }

        public DateTime DateOfJoining { get; set; }
    }
}
