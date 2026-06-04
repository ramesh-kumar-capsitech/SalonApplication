using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class RegisterUsers
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ? Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string ? MobileNumber    { get; set; }
    public string? Password { get; set; }



}