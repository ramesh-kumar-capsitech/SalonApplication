
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


public class Employee
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string? Id { get; set; }

    public string? SalonId { get; set; }

    public string? FullName { get; set; }

    public string? Role { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public List<string>? Skills { get; set; }

    public int Experience { get; set; }
    public string? Password { get; set; }
    public string? Availability { get; set; }

    public string Status { get; set; }
        = "active";


    public DateTime CreatedAt
    {
        get;
        set;
    } = DateTime.UtcNow;
    public string? ProfileImage { get; set; }
}

public class EmployeeLoginRequest
{
    public string Email { get; set; }

    public string Password { get; set; }
}

public class EmployeeProfileUpdate
{
    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? ProfileImage { get; set; }
}
public class ChangePasswordModel
{
    public string CurrentPassword { get; set; }

    public string NewPassword { get; set; }

    public string ConfirmPassword { get; set; }
}