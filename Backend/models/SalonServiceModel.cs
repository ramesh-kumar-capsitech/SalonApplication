using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class SalonServiceModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ServiceId { get; set; }

    public string? ServiceName { get; set; }
    public int Duration { get; set; }
    public int Price { get; set; }

}

    