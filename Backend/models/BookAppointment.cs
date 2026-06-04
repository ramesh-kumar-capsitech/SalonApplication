using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class BookAppointment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string? SalonId { get; set; }

    public string? SalonName { get; set; }

    public string? StaffId { get; set; }

    public string? StaffName { get; set; }

    public string? UserId { get; set; }

    public string? CustomerName { get; set; }

    public string? Location { get; set; }

    public string? Date { get; set; }

    public string? Time { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "pending";

    public List<BookedService>? Services { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
    public string? SalonImage { get; set; }

}
public class UpdateBookingStatusRequest
{
    public string Status { get; set; }
}
public class BookedService
{
    public string? Name { get; set; }

    public decimal Price { get; set; }

    public int Duration { get; set; }
}
public class SalonBookingRequest
{
    public string? SalonId { get; set; }

    public string? SalonName { get; set; }

    public string? StaffId { get; set; }

    public string? StaffName { get; set; }

    public string? CustomerName { get; set; }

    public string? Date { get; set; }

    public string? Time { get; set; }

    public decimal TotalPrice { get; set; }

    public List<BookedService>? Services { get; set; }
}