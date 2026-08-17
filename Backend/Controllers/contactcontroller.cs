using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
[ApiController]
[Route("api/auth")]
public class contactcontroller : ControllerBase
{
    private readonly Contactservice _contactservice = new Contactservice();
    [HttpPost("contact")]
    public IActionResult contactmessage([FromBody] contact contact)
    {
        var result = _contactservice.contactmessage(contact);

        if (result == "Message sent successfully")
        {
            return Ok(new
            {
                success = true,
                message = result
            });
        }

        return BadRequest(new
        {
            success = false,
            message = "Failed to send message"
        });
    }
}