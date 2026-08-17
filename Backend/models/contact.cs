using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class contact
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? CustomerId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Subject { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Status { get; set; } = "Delivered";
    // public string? ProfileImage { get; set; }



}