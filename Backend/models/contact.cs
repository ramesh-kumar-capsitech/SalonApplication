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
public class Replycontact
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? CustomerId { get; set; }
    public string? MessageId { get; set; }
    public string? SuperAdminId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerSubject { get; set; }
    public string? CustomerMessage { get; set; }
    public string? ReplyMessage { get; set; }
    public string? ReplySubject { get; set; }
    public string? MessageDateTime { get; set; }
    public string? Status { get; set; } = "Replied";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
} 