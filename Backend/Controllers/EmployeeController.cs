using Microsoft.AspNetCore.Mvc;
using loginsignuphome.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
[ApiController]
[Route("api/auth")]
public class EmployeeController : ControllerBase
{
    private readonly
        EmployeeService _employeeService;

    public EmployeeController()
    {
        _employeeService =
            new EmployeeService();
    }


    [HttpPost("addemployee")]
    public IActionResult AddEmployee(
        [FromBody] Employee employee
    )
    {
        var result = _employeeService.AddEmployee(employee);
        if (result is string &&
     result.ToString() == "Email already exists")
        {
            return BadRequest(new
            {
                success = false,
                message = "Email already exists"
            });
        }
        return Ok(new
        {
            success = true,
            data = result
        });
    }


    [HttpGet(
    "getemployees/{salonId}"
    )]
    public IActionResult GetEmployees(
        string salonId
    )
    {
        var employees =
            _employeeService
                .GetEmployees(salonId);

        return Ok(employees);
    }


    [HttpDelete(
    "deleteemployee/{id}"
    )]
    public IActionResult DeleteEmployee(
        string id
    )
    {
        var result =
            _employeeService
                .DeleteEmployee(id);

        return Ok(new
        {
            success = true,
            message = result
        });
    }


    [HttpPut(
    "editemployee/{id}"
    )]
    public IActionResult EditEmployee(
        string id,
        [FromBody]
        Employee employee
    )
    {
        var result =
            _employeeService
                .EditEmployee(
                    id,
                    employee
                );

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpPut(
"toggleemployee/{id}"
)]
    public IActionResult ToggleEmployeeStatus(
    string id
)
    {
        var result =
            _employeeService
                .ToggleEmployeeStatus(id);

        return Ok(new
        {
            success = true,
            status = result
        });
    }
    [HttpGet("getsalonstaff/{salonId}")]
    public IActionResult GetSalonStaff(
    string salonId
)
    {
        var staff =
            _employeeService
                .GetSalonStaff(salonId);

        return Ok(staff);
    }
    [HttpPost("employeelogin")]
    public IActionResult EmployeeLogin(
    [FromBody] EmployeeLoginRequest model
)
    {
        var employee =
            _employeeService
                .EmployeeLogin(model);

        if (employee == null)
        {
            return Unauthorized(
                "Invalid credentials"
            );
        }

        var tokenHandler =
            new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(
            "thisisaveryveryverysecretjwtkey123456789"
        );

        var tokenDescriptor =
            new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new[]
                    {
                    new Claim(
                        ClaimTypes.Email,
                        employee.Email!
                    ),

                    new Claim(
                        ClaimTypes.Name,
                        employee.FullName!
                    )
                    }
                ),

                Expires =
                    DateTime.UtcNow.AddDays(7),

                SigningCredentials =
                    new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms
                            .HmacSha256Signature
                    ),

                Issuer = "capsiqueue",

                Audience = "capsiqueueusers"
            };

        var token =
            tokenHandler.CreateToken(
                tokenDescriptor
            );

        string jwtToken =
            tokenHandler.WriteToken(token);

        return Ok(new
        {
            success = true,

            token = jwtToken,

            employee = employee
        });
    }
    [HttpGet("getemployeeprofile/{id}")]
    public IActionResult GetEmployeeProfile(
    string id
)
    {
        var employee =
            _employeeService
                .GetEmployeeProfile(id);

        if (employee == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Employee not found"
            });
        }

        return Ok(new
        {
            success = true,
            data = employee
        });
    }
    [HttpPut("updateemployeeprofile/{id}")]
    public IActionResult UpdateEmployeeProfile(
    string id,
    [FromBody] EmployeeProfileUpdate model
)
    {
        var result =
            _employeeService
                .UpdateEmployeeProfile(
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
    [HttpPut("changeemployeepassword/{id}")]
    public IActionResult ChangeEmployeePassword(
    string id,
    [FromBody] ChangePasswordModel model
)
    {
        var result =
            _employeeService.ChangeEmployeePassword(
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