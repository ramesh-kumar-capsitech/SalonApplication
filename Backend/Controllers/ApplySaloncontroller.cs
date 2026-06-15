using loginsignuphome.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
[ApiController]
[Route("api/auth")]
public class ApplySaloncontroller : ControllerBase
{
    private readonly SalonService _salonService;

    public ApplySaloncontroller()
    {
        _salonService = new SalonService();
    }

    [HttpPost("applysalon")]
    public IActionResult Applysalon(
    [FromBody] ApplySalon salon
)
    {
        var result =
            _salonService.ApplySalon(salon);

        if (result == "salon already exists")
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
    [HttpGet("getallsalons")]
    public IActionResult GetAllSalons()
    {
        var salons = _salonService.GetAllSalons();

        return Ok(salons);
    }
    [HttpPut("approve/{id}")]
    public IActionResult ApproveSalon(string id)
    {
        var result = _salonService.ApproveSalon(id);

        return Ok(new
        {
            success = true,
            message = "Salon approved successfully",

        });
    }
    public class RejectRequest
    {
        public string? Reason { get; set; }
    }
    [HttpPut("reject/{id}")]
    public IActionResult RejectSalon(
    string id,
    [FromBody] RejectRequest request
)
    {
        var result = _salonService
            .RejectSalon(id, request.Reason!);

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpPut("activate/{id}")]
    public IActionResult ActivateSalon(string id)
    {
        var result = _salonService
            .ActivateSalon(id);

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpPut("deactivate/{id}")]
    public IActionResult DeactivateSalon(string id)
    {
        var result = _salonService
            .DeactivateSalon(id);

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpPost("salonlogin")]
    public IActionResult SalonLogin(
    [FromBody] SalonLogin salon
)
    {
        var loggedInSalon =
            _salonService.SalonLogin(salon);

        if (loggedInSalon == null)
            return Unauthorized(
                "Invalid credentials"
            );

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
                        loggedInSalon.LoginEmail!
                    ),

                    new Claim(
                        ClaimTypes.Name,
                        loggedInSalon.SalonName!
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

            salon = loggedInSalon
        });
    }
    [HttpPost("addservice")]
    public IActionResult AddService(
    [FromBody] AddServiceRequest request
)
    {
        var result =
            _salonService.AddService(request);

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpGet("getsalonservices/{salonId}")]
    public IActionResult GetSalonServices(
    string salonId
)
    {
        var services =
            _salonService
                .GetSalonServices(salonId);

        return Ok(services);
    }
    [HttpPut("editservice/{salonId}/{serviceId}")]
    public IActionResult EditService(
    string salonId,
    string serviceId,
    [FromBody] AddServiceRequest service
)
    {
        var result =
            _salonService.EditService(
                salonId,
                serviceId,
                service
            );

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpDelete("deleteservice/{salonId}/{serviceId}")]
    public IActionResult DeleteService(
        string salonId,
        string serviceId
        )
    {
        var result = _salonService.DeleteService(salonId, serviceId);
        return Ok(new
        {
            success = true,
            message = result
        }
            );


    }
    [HttpPut(
"updatesalonprofile/{id}"
)]
    public IActionResult
UpdateSalonProfile(
    string id,

    [FromBody]
    ApplySalon model
)
    {
        var result =
            _salonService
                .UpdateSalonProfile(
                    id,
                    model
                );

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpGet("getsalonprofile/{id}")]
    public IActionResult GetSalonProfile(string id)
    {
        var salon =
            _salonService.GetSalonProfile(id);

        if (salon == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Salon not found"
            });
        }

        return Ok(new
        {
            success = true,
            data = salon
        });
    }
    [HttpPut("changesalonpassword/{id}")]
    public IActionResult ChangeSalonPassword(
       string id,
       [FromBody] ApplySalon model
   )
    {
        var result =
            _salonService.ChangeSalonPassword(
                id,
                model
            );

        if (
            result == "Current password incorrect"
            ||
            result == "New and confirm password do not match"
        )
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
    [HttpGet("superadmindashboard")]
    public IActionResult
 GetDashboard()
    {
        var result =
            _salonService.GetDashboard();

        return Ok(result);
    }
    [HttpPost("addgalleryimage")]
    public IActionResult AddGalleryImage(
    [FromBody]
    AddGalleryImageRequest model
)
    {
        var result =
            _salonService
            .AddGalleryImage(model);

        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpGet("gallery/{salonId}")]
    public IActionResult GetGallery(
    string salonId
)
    {
        return Ok(
            _salonService
            .GetGalleryImages(
                salonId
            )
        );
    }
    [HttpGet("salondetails/{salonId}")]
    public IActionResult GetSalonDetails(
    string salonId
)
    {
        var result =
            _salonService
            .GetSalonDetails(
                salonId
            );

        if (result == null)
        {
            return NotFound(
                new
                {
                    success = false,
                    message = "Salon not found"
                }
            );
        }

        return Ok(result);
    }
    [HttpPost("createsalonbyadmin")]
    public IActionResult CreateSalonByAdmin(
    [FromBody]
    ApplySalon model
)
    {
        var result =
            _salonService
            .CreateSalonByAdmin(
                model
            );

        if (
            result is string
        )
        {
            return BadRequest(
                new
                {
                    success = false,
                    message = result
                }
            );
        }

        return Ok(
            new
            {
                success = true,
                data = result
            }
        );
    }
    [HttpPut("updatesalon/{id}")]
    public IActionResult UpdateSalon(
      string id,
      [FromBody] ApplySalon model
  )
    {
        var result =
            _salonService.UpdateSalon(
                id,
                model
            );

        if (!result)
        {
            return BadRequest(
                new
                {
                    success = false,
                    message = "Salon update failed"
                }
            );
        }

        return Ok(
            new
            {
                success = true,
                message = "Salon updated successfully"
            }
        );
    }
    [HttpDelete("deletegalleryimage")]
    public IActionResult DeleteGalleryImage(
        [FromBody] DeleteGalleryImageModel model
    )
    {
        var result =
            _salonService.DeleteGalleryImage(
                model.SalonId,
                model.ImageUrl
            );

        if (!result)
        {
            return BadRequest(new
            {
                success = false,
                message = "Image not found"
            });
        }

        return Ok(new
        {
            success = true,
            message = "Image deleted successfully"
        });
    }
}
