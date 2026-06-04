using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service = new AuthService();

    [HttpPost("signup")]
    public IActionResult Signup([FromBody] RegisterUsers user)
    {
        var result = _service.Signup(user);
        if (result == "User already exists")
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Login user)
    {
        var loggedInUser = _service.Login(user);

        if (loggedInUser == null)
            return Unauthorized("Invalid credentials");

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(
            "ThisIsMySuperSecretJwtKey123456789"
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                new[]
                {
                new Claim(
                    ClaimTypes.Email,
                    loggedInUser.Email!
                ),

                new Claim(
                    ClaimTypes.Name,
                    loggedInUser.Name!
                )
                }
            ),

            Expires = DateTime.UtcNow.AddDays(7),

            SigningCredentials =
                new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),

            Issuer = "capsiqueue",

            Audience = "capsiqueueusers"
        };

        var token =
            tokenHandler.CreateToken(tokenDescriptor);

        string jwtToken =
            tokenHandler.WriteToken(token);

        return Ok(new
        {
            success = true,

            token = jwtToken,

            user = loggedInUser
        });
    }
    [HttpGet("getallusers")]
    public IActionResult GetAllUsers()
    {
        var users = _service.GetAllUsers();

        return Ok(users);
    }
}