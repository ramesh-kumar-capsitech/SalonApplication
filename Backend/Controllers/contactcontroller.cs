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
    [HttpGet("getallcontacts")]
    public IActionResult GetAllContacts()
    {
        var contacts = _contactservice.GetAllContacts();
        return Ok(contacts);
    }
    [HttpGet("getcontactbyid/{id}")]
   
    public IActionResult GetContactById(string id)
    {
        var contacts = _contactservice.GetContactsById(id);

        if (contacts == null || !contacts.Any())
        {
            return NotFound(new
            {
                message = "Contact not found"
            });
        }

        return Ok(contacts);
    }
}