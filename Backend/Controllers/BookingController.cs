using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
[ApiController]
[Route("api/auth")]
public class BookingController
    : ControllerBase
{
    private readonly BookingService _bookingService;
    private readonly IHubContext<LiveQueueHub> _hubContext;

    public BookingController(IHubContext<LiveQueueHub> hubContext)
    {
        _bookingService = new BookingService();
        _hubContext = hubContext;
    }

    [HttpPost("bookappointment")]
    public async Task<IActionResult> BookAppointment(
        [FromBody]
        BookAppointment booking
    )
    {
        var result =
            _bookingService
                .BookAppointment(
                    booking
                );

        if (
            result ==
            "Slot already booked"
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
        await _hubContext.Clients.All.SendAsync("QueueUpdated");
        return Ok(
            new
            {
                success = true,
                message = result
            }
        );
    }
    [HttpGet("getbookings/{userId}")]
    public IActionResult GetBookings(
    string userId
)
    {
        var bookings =
            _bookingService
                .GetBookings(userId);

        return Ok(bookings);
    }
    [HttpGet("getbookingsalon/{salonId}")]
    public IActionResult GetBookingsSalon(
        string salonId
        )

    {
        var bookings =
                    _bookingService
                        .GetBookingsSalon(salonId);

        return Ok(bookings);
    }
    [HttpPut("updatebookingstatus/{id}")]
    public async Task<IActionResult> UpdateBookingStatus(
    string id,
    [FromBody] UpdateBookingStatusRequest request
)
    {
        var result =
            _bookingService.UpdateBookingStatus(
                id,
                request.Status
            );

        if (!result)
        {
            return NotFound(new
            {
                success = false,
                message = "Booking not found"
            });
        }
        await _hubContext.Clients.All.SendAsync("QueueUpdated");
        return Ok(new
        {
            success = true,
            message = "Status updated successfully"
        });
    }
    [HttpGet("getemployeebookings/{employeeId}")]
    public IActionResult
GetEmployeeBookings(
    string employeeId
)
    {
        var bookings =
            _bookingService
                .GetEmployeeBookings(
                    employeeId
                );

        return Ok(bookings);
    }
    [HttpGet("getbookedslots/{staffId}/{date}")]
    public IActionResult GetBookedSlots(
    string staffId,
    string date
)
    {
        var slots =
            _bookingService
                .GetBookedSlots(
                    staffId,
                    date
                );

        return Ok(slots);
    }
    [HttpPost("createsalonbooking")]
    public async Task<IActionResult> CreateSalonBooking(
    [FromBody] SalonBookingRequest model
)
    {
        var result =
            _bookingService
                .CreateSalonBooking(
                    model
                );

        if (result != "Booking Created")
        {
            return BadRequest(new
            {
                success = false,
                message = result
            });
        }
        await _hubContext.Clients.All.SendAsync("QueueUpdated");
        return Ok(new
        {
            success = true,
            message = result
        });
    }
    [HttpGet("customerbookingstats")]
    public IActionResult GetCustomerBookingStats()
    {
        var result =
            _bookingService
            .GetCustomerBookingStats();

        return Ok(result);
    }
    [HttpPut("cancelbooking")]
    public async Task<IActionResult> CancelBooking(
    [FromBody] CancelBookingModel model)
    {
        var result = await _bookingService.CancelBooking(model);
        await _hubContext.Clients.All.SendAsync("QueueUpdated");

        return Ok(result);
    }
}