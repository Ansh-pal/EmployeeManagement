using Microsoft.AspNetCore.Mvc;
using EMS.Services;
using EMS.DTOs;

namespace EMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var token = _authService.Login(dto);

            if (token == null)
                return Unauthorized("Invalid credentials");

            return Ok(new { Token = token });
        }
    }
}