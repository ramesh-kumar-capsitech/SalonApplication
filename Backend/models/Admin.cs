using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Admin
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("email")]
    public string? Email { get; set; }

    [BsonElement("password")]
    public string? Password { get; set; }
    [BsonElement("name")]
    public string? Name { get; set; }
    [BsonElement("mobileNumber")]
    public string? MobileNumber { get; set; }
    [BsonElement("profileImage")]
    public string? ProfileImage { get; set; }

    [BsonElement("role")]
    public string? Role { get; set; }
}
public class AdminProfileUpdate
{
    public string? Name { get; set; }

    public string? Email { get; set; }
    public string? MobileNumber { get; set; }
    public string? ProfileImage { get; set; }
}
public class ChangeAdminPasswordModel
{
    public string CurrentPassword { get; set; }

    public string NewPassword { get; set; }

    public string ConfirmPassword { get; set; }
}