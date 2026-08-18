using MongoDB.Driver;

public class Contactservice
{
    private readonly IMongoCollection<contact> _contacts;
    private readonly IMongoCollection<Replycontact> _replycontacts;
    public Contactservice()
    {
        var client = new MongoClient("mongodb://localhost:27017");

        var db = client.GetDatabase("authdb");
        _contacts = db.GetCollection<contact>("contacts");
        _replycontacts = db.GetCollection<Replycontact>("replycontacts");
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
    public string ReplyMessage(Replycontact replycontact)
    {
        _replycontacts.InsertOne(replycontact);
        var filter = Builders<contact>.Filter.Eq(x => x.Id , replycontact.MessageId);
        var update = Builders<contact>.Update.Set(x => x.Status, "Replied");
        _contacts.UpdateOne(filter, update);
        return "Reply sent successfully";
    }
    public string SeenMessage(string id)
    {
        var filter = Builders<contact>.Filter.Eq(x => x.Id, id);
        var update = Builders<contact>.Update.Set(x => x.Status, "Seen");
        _contacts.UpdateOne(filter, update);
        return "Message marked as seen";
    }
    public List<Replycontact> GetReplycontacts()
    {
        return _replycontacts.Find(_ => true).ToList();
    }
}



