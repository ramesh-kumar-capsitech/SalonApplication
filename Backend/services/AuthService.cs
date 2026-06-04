using MongoDB.Driver;

public class AuthService
{
    private readonly IMongoCollection<RegisterUsers> _users;

    public AuthService()
    {
        var client = new MongoClient("mongodb://localhost:27017");

        var db = client.GetDatabase("authdb");

        _users = db.GetCollection<RegisterUsers>("users");
    }

    public string Signup(RegisterUsers user)
    {
        var existing = _users
            .Find(x => x.Email == user.Email)
            .FirstOrDefault();

        if (existing != null)
            return "User already exists";

        _users.InsertOne(user);

        return "Signup successful";
    }

    public RegisterUsers? Login(Login user)
    {
        var existing = _users
            .Find(x =>
                x.Email == user.Email &&
                x.Password == user.Password
            )
            .FirstOrDefault();

        if (existing == null)
            return null;

        return existing;
    }
    public List<RegisterUsers> GetAllUsers()
    {
        return _users
            .Find(_ => true)
            .ToList();
    }
}