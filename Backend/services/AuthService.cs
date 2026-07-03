using MongoDB.Driver;

public class AuthService
{
    private readonly IMongoCollection<ApplySalon> _salonrequests;
    private readonly IMongoCollection<Employee> _employees;
    private readonly IMongoCollection<Admin> _salons;
    private readonly IMongoCollection<RegisterUsers> _users;
    private readonly IMongoCollection<Admin> _admins;

    public AuthService()
    {
        var client = new MongoClient("mongodb://localhost:27017");

        var db = client.GetDatabase("authdb");
        _salonrequests = db.GetCollection<ApplySalon>("salonrequests");

        _employees = db.GetCollection<Employee>("employees");
        _users = db.GetCollection<RegisterUsers>("users");
        _admins = db.GetCollection<Admin>("admins");
        _salons = db.GetCollection<Admin>("admins");
    }

    public string Signup(RegisterUsers user)
    {
        var salonRequest = _salonrequests
        .Find(x => x.Email == user.Email)
        .FirstOrDefault();

        var userr = _users.Find(x => x.Email == user.Email).FirstOrDefault();
        var salonAdmin = _salons.Find(x => x.Email == user.Email).FirstOrDefault();
        if (salonRequest != null || userr != null || salonAdmin != null)
        {
            return "Email already exists";
        }

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
    public RegisterUsers? GetCustomerProfile(string id)
    {
        return _users
            .Find(x => x.Id == id)
            .FirstOrDefault();
    }
    public bool UpdateCustomerProfile(
       string id,
       CustomerProfileUpdate model
   )
    {
        var update =
            Builders<RegisterUsers>.Update

            .Set(
                x => x.Name,
                model.Name
            )

            .Set(
                x => x.Email,
                model.Email
            )

            .Set(
                x => x.MobileNumber,
                model.MobileNumber
            )

            .Set(
                x => x.ProfileImage,
                model.ProfileImage
            );

        var result =
            _users.UpdateOne(
                x => x.Id == id,
                update
            );

        return result.ModifiedCount > 0;
    }
    public string ChangeCustomerPassword(
       string id,
       ChangecustomerPasswordModel model
   )
    {
        var customer =
            _users
            .Find(x => x.Id == id)
            .FirstOrDefault();

        if (customer == null)
        {
            return "Customer not found";
        }

        if (customer.Password != model.CurrentPassword)
        {
            return "Current password is incorrect";
        }

        if (model.NewPassword != model.ConfirmPassword)
        {
            return "Passwords do not match";
        }

        var update =
            Builders<RegisterUsers>.Update
            .Set(
                x => x.Password,
                model.NewPassword
            );

        _users.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Password Changed";
    }
    public Admin? SuperAdminLogin(
        string email,
        string password
    )
    {
        var allAdmins = _admins.Find(_ => true).ToList();





        return _admins
            .Find(x =>
                x.Email == email &&
                x.Password == password
            )
            .FirstOrDefault();
    }
    public Admin? GetAdminProfile(string id)
    {
        return _admins
            .Find(x => x.Id == id)
            .FirstOrDefault();
    }
    public bool UpdateAdminProfile(
    string id,
    AdminProfileUpdate model
)
    {
        var update =
            Builders<Admin>.Update

            .Set(x => x.Name, model.Name)

            .Set(x => x.Email, model.Email)

            .Set(
                x => x.MobileNumber,
                model.MobileNumber
            )

            .Set(
                x => x.ProfileImage,
                model.ProfileImage
            );

        var result =
            _admins.UpdateOne(
                x => x.Id == id,
                update
            );

        return result.ModifiedCount > 0;
    }
    public string ChangeAdminPassword(
            string id,
            ChangeAdminPasswordModel model
        )
    {
        var admin =
            _admins
            .Find(x => x.Id == id)
            .FirstOrDefault();

        if (admin == null)
        {
            return "Admin not found";
        }

        if (
            admin.Password !=
            model.CurrentPassword
        )
        {
            return "Current password is incorrect";
        }

        if (
            model.NewPassword !=
            model.ConfirmPassword
        )
        {
            return "Passwords do not match";
        }

        var update =
            Builders<Admin>.Update
            .Set(
                x => x.Password,
                model.NewPassword
            );

        _admins.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Password Changed";
    }
}