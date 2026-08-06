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

        if (result == "Email already exists")
        {
            return BadRequest(new
            {
                success = false,
                message = result
            });
        }

        return Ok(new
        {
            success = true,
            message = result
        });
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
    [HttpGet("getcustomerprofile/{id}")]
    public IActionResult GetCustomerProfile(
      string id
  )
    {
        var customer =
            _service
                .GetCustomerProfile(id);

        if (customer == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Customer not found"
            });
        }

        return Ok(new
        {
            success = true,
            data = customer
        });
    }
    [HttpPut("updatecustomerprofile/{id}")]
    public IActionResult UpdateCustomerProfile(
       string id,
       [FromBody] CustomerProfileUpdate model
   )
    {
        var result =
            _service
                .UpdateCustomerProfile(
                    id,
                    model
                );

        if (!result)
        {
            return NotFound(new
            {
                success = false
            });
        }

        return Ok(new
        {
            success = true,
            message = "Profile Updated"
        });
    }
    [HttpPut("changecustomerpassword/{id}")]
    public IActionResult ChangeCustomerPassword(
    string id,
    [FromBody] ChangecustomerPasswordModel model
 )
    {
        var result =
            _service.ChangeCustomerPassword(
                id,
                model
            );

        if (result != "Password Changed")
        {
            return BadRequest(new
            {
                success = false,
                message = result
            });
        }

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpPost("superadminlogin")]
    public IActionResult SuperAdminLogin(
        [FromBody] Login model
    )
    {
        var admin =
            _service.SuperAdminLogin(
                model.Email,
                model.Password
            );

        if (admin == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid Credentials"
            });
        }

        return Ok(new
        {
            success = true,

            admin = new
            {
                id = admin.Id,
                name = admin.Name,
                profileImage = admin.ProfileImage,
                email = admin.Email,
                role = admin.Role
            }
        });
    }
    [HttpGet("getadminprofile/{id}")]
    public IActionResult GetAdminProfile(string id)
    {
        var admin = _service.GetAdminProfile(id);

        if (admin == null)
        {
            return NotFound(new
            {
                success = false
            });
        }

        return Ok(new
        {
            success = true,
            data = admin
        });
    }
    [HttpPut("updateadminprofile/{id}")]
    public IActionResult UpdateAdminProfile(
        string id,
        [FromBody] AdminProfileUpdate model
    )
    {
        var result =
            _service.UpdateAdminProfile(
                id,
                model
            );

        if (!result)
        {
            return NotFound(new
            {
                success = false
            });
        }

        return Ok(new
        {
            success = true,
            message = "Profile Updated"
        });
    }
    [HttpPut("changeadminpassword/{id}")]
    public IActionResult ChangeAdminPassword(
        string id,
        [FromBody]
    ChangeAdminPasswordModel model
    )
    {
        var result =
            _service.ChangeAdminPassword(
                id,
                model
            );

        if (result != "Password Changed")
        {
            return BadRequest(new
            {
                success = false,
                message = result
            });
        }

        return Ok(new
        {
            success = true,
            message = result
        });
    }
}