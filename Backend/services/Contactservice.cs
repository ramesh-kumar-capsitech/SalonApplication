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
    public List<contact> GetAllContacts()
    {
        return _contacts.Find(_ => true).ToList();
    }
    public List<contact> GetContactsById(string id)
    {
       return _contacts.Find(contact => contact.CustomerId == id).ToList();
    }
}