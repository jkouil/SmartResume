// Controllers/AuthController.cs
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PasswordService _pwd;

    public AuthController(AppDbContext db, PasswordService pwd)
    {
        _db = db;
        _pwd = pwd;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _db.Users.FirstOrDefault(u => u.Username == request.Username);
        if (user == null || !_pwd.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        return Ok(new { username = user.Username });
    }
}
