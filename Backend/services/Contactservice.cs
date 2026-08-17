using MongoDB.Driver;

public class Contactservice
{
    private readonly IMongoCollection<contact> _contacts;
    public Contactservice()
    {
        var client = new MongoClient("mongodb://localhost:27017");

        var db = client.GetDatabase("authdb");
        _contacts = db.GetCollection<contact>("contacts");
    }
    public string contactmessage(contact contact)
    {
        _contacts.InsertOne(contact);
        return "Message sent successfully";
    }
}