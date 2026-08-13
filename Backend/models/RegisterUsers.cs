using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class RegisterUsers
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? MobileNumber { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }  = "customer";
    public string? ProfileImage { get; set; }



}
public class CustomerProfileUpdate
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? MobileNumber { get; set; }
    public string? ProfileImage { get; set; }
}
public class ChangecustomerPasswordModel
{
    public string CurrentPassword { get; set; }

    public string NewPassword { get; set; }

    public string ConfirmPassword { get; set; }
}