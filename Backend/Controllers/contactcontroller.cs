using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
[ApiController]
[Route("api/auth")]
public class contactcontroller : ControllerBase
{
     private readonly Contactservice _contactservice = new Contactservice();
    private readonly IHubContext<ContactHub> _hubContextMessage;
    public contactcontroller(IHubContext<ContactHub> hubContext)
    {
        _contactservice = new Contactservice();
        _hubContextMessage = hubContext;
    }
   
    [HttpPost("contact")]
    public async Task<IActionResult> contactmessage([FromBody] contact contact)
    {
        var result = _contactservice.contactmessage(contact);
        await _hubContextMessage.Clients.All.SendAsync("MessageUpdated");
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
   
    [HttpPost("replymessage")]
    public async Task<IActionResult> ReplyMessage([FromBody] Replycontact replycontact)
    {
        var result = _contactservice.ReplyMessage(replycontact);
        await _hubContextMessage.Clients.All.SendAsync("MessageUpdated");
        if (result == "Reply sent successfully")
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
            message = "Failed to send reply"
        });
    }
    [HttpPut("seenmessage/{id}")]
    public async  Task<IActionResult> SeenMessage(string id)
    {
        var result = _contactservice.SeenMessage(id);
        await _hubContextMessage.Clients.All.SendAsync("MessageUpdated");

        if (result == "Message marked as seen")
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
            message = "Failed to mark message as seen"
        });
    }
    [HttpGet("getreplycontacts")]
    public IActionResult GetReplycontacts()
    {
        var replycontacts = _contactservice.GetReplycontacts();
        return Ok(replycontacts);
    }
     [HttpGet("getreplybyid/{id}")]
    public IActionResult GetReplyById(string id)
    {
        var replycontacts = _contactservice.GetReplyById(id);

        if (replycontacts == null || !replycontacts.Any())
        {
            return NotFound(new
            {
                message = "Reply not found"
            });
        }

        return Ok(replycontacts);
    }
}