using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class BookingController
    : ControllerBase
{
    private readonly BookingService
        _bookingService;

    public BookingController()
    {
        _bookingService = new BookingService();
    }

    [HttpPost("bookappointment")]
    public IActionResult BookAppointment(
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
    public IActionResult UpdateBookingStatus(
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
    public IActionResult CreateSalonBooking(
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
}