using MongoDB.Driver;

public class BookingService
{
    private readonly IMongoCollection<BookAppointment>
        _bookings;

    public BookingService()
    {
        var client =
            new MongoClient(
                "mongodb://localhost:27017"
            );

        var db =
            client.GetDatabase(
                "authdb"
            );

        _bookings =
            db.GetCollection<BookAppointment>(
                "bookings"
            );
    }

    public string BookAppointment(
        BookAppointment booking
    )
    {
        var existingBooking =
            _bookings.Find(x =>

                x.SalonId == booking.SalonId &&

                x.StaffId == booking.StaffId &&

                x.Date == booking.Date &&

                x.Time == booking.Time

            ).FirstOrDefault();

        if (existingBooking != null)
        {
            return "Slot already booked";
        }

        _bookings.InsertOne(booking);

        return "Booking Created Successfully";
    }
    public List<BookAppointment>
GetBookings(string userId)
    {
        return _bookings
            .Find(x => x.UserId == userId)
            .SortByDescending(x => x.CreatedAt)
            .ToList();
    }
    public List<BookAppointment>
    GetBookingsSalon(string salonId)
    {
        return _bookings
                    .Find(x => x.SalonId == salonId)
                    .SortByDescending(x => x.CreatedAt)
                    .ToList();
    }
    public bool UpdateBookingStatus(
    string id,
    string status
)
    {
        var update =
            Builders<BookAppointment>
                .Update
                .Set(
                    x => x.Status,
                    status
                );

        var result =
            _bookings.UpdateOne(
                x => x.Id == id,
                update
            );

        return result.ModifiedCount > 0;
    }
    public List<BookAppointment>
GetEmployeeBookings(
    string employeeId
)
    {
        return _bookings
            .Find(x =>
                x.StaffId == employeeId
            )
            .SortByDescending(
                x => x.CreatedAt
            )
            .ToList();
    }
    public List<string> GetBookedSlots(
    string staffId,
    string date
)
    {
        return _bookings
            .Find(x =>

                x.StaffId == staffId &&

                x.Date == date &&

                x.Status != "Rejected"
            )
            .ToList()

            .Select(x => x.Time)

            .ToList();
    }
    public string CreateSalonBooking(
    SalonBookingRequest model
)
    {
        var existingBooking =
            _bookings.Find(x =>

                x.StaffId == model.StaffId &&

                x.Date == model.Date &&

                x.Time == model.Time &&

                x.Status != "Rejected"

            ).FirstOrDefault();

        if (existingBooking != null)
        {
            return "Slot already booked";
        }

        var booking =
            new BookAppointment
            {
                SalonId = model.SalonId,

                SalonName = model.SalonName,

                StaffId = model.StaffId,

                StaffName = model.StaffName,

                CustomerName = model.CustomerName,

                Date = model.Date,

                Time = model.Time,

                TotalPrice = model.TotalPrice,

                Services = model.Services,

                Status = "confirmed"
            };

        _bookings.InsertOne(booking);

        return "Booking Created";
    }
    public List<object> GetCustomerBookingStats()
    {
        var users =
            new MongoClient("mongodb://localhost:27017")
            .GetDatabase("authdb")
            .GetCollection<RegisterUsers>("users")
            .Find(_ => true)
            .ToList();

        var result =
            users.Select(user =>
            {
                var bookings =
                    _bookings.Find(x =>
                        x.UserId == user.Id
                    ).ToList();

                return new
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MobileNumber = user.MobileNumber,
                    ProfileImage = user.ProfileImage,

                    TotalBookings = bookings.Count,

                    LastBooking =
                        bookings
                        .OrderByDescending(x => x.CreatedAt)
                        .FirstOrDefault()
                        ?.CreatedAt
                };
            })
            .ToList<object>();

        return result;
    }
}