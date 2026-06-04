using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ApplySalon
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string? SalonName { get; set; }

    public string? OwnerName { get; set; }

    public string? City { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? JoinedYear { get; set; }

    public string? TotalStaff { get; set; }

    public string? SalonAddress { get; set; }

    public string? SalonDescription { get; set; }
    public List<string> GalleryImages { get; set; }    = new();
    public string Status { get; set; } = "pending";
    public string? LoginEmail { get; set; }

    public string? LoginPassword { get; set; }
    public string? RejectReason { get; set; }
    public string IsActive { get; set; } = "deactive";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int StaffCount { get; set; }

    public int BookingCount { get; set; }

    public decimal Revenue { get; set; }
    public List<SalonServiceModel> Services
    { get; set; } = new();
    public string? ProfileImage
    {
        get;
        set;
    }
    public string? CurrentPassword { get; set; }

    public string? NewPassword { get; set; }

    public string? ConfirmPassword { get; set; }
}
public class AddGalleryImageRequest
{
    public string SalonId { get; set; }

    public string ImageUrl { get; set; }
}
public class SalonDetailsResponse
{
    public ApplySalon? Salon { get; set; }

    public List<Employee> Employees { get; set; }
        = new();

    public List<BookAppointment> Bookings { get; set; }
        = new();

    public List<string> GalleryImages { get; set; }
        = new();
}
