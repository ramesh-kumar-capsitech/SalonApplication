using loginsignuphome.models;
using MongoDB.Bson;
using MongoDB.Driver;

public class SalonService
{
    private readonly IMongoCollection<ApplySalon> _salonrequests;
    private readonly IMongoCollection<Employee> _employees;

    private readonly IMongoCollection<BookAppointment> _bookings;

    public SalonService()
    {
        var client =
            new MongoClient(
                "mongodb://localhost:27017"
            );

        var db =
            client.GetDatabase(
                "authdb"
            );

        _salonrequests =
            db.GetCollection<ApplySalon>(
                "salonrequests"
            );

        _employees =
            db.GetCollection<Employee>(
                "employees"
            );

        _bookings =
            db.GetCollection<BookAppointment>(
                "bookings"
            );
    }
    public SuperAdminDashboard
GetDashboard()
    {
        return new SuperAdminDashboard
        {
            TotalSalons =
    (int)_salonrequests.CountDocuments(
        x => x.Status == "approved"
    ),

            ActiveSalons =
    (int)_salonrequests.CountDocuments(
        x =>
            x.Status == "approved" &&
            x.IsActive == "active"
    ),

            TotalStaff =
                (int)_employees.CountDocuments(
                    x => x.Status == "active"
                ),

            TotalBookings =
                (int)_bookings.CountDocuments(
                    _ => true
                ),

            TotalRevenue =
                _bookings
                    .Find(x =>
                        x.Status == "completed"
                    )
                    .ToList()
                    .Sum(x => x.TotalPrice)
        };
    }
    public string ApplySalon(ApplySalon salon)
    {
        var existing = _salonrequests
            .Find(x => x.Email == salon.Email)
            .FirstOrDefault();

        if (existing != null)
            return "salon already exists";

        _salonrequests.InsertOne(salon);

        return "salon apply successful";
    }
    public List<ApplySalon> GetAllSalons()
    {
        var salons = _salonrequests
            .Find(_ => true)
            .ToList();

        foreach (var salon in salons)
        {
            salon.StaffCount =
                (int)_employees.CountDocuments(
                    x =>
                        x.SalonId == salon.Id &&
                        x.Status == "active"
                );

            salon.BookingCount =
                (int)_bookings.CountDocuments(
                    x =>
                       x.SalonId == salon.Id && x.Status == "Completed"
                );

            salon.Revenue =
                _bookings
                    .Find(x =>
                        x.SalonId == salon.Id &&
                        x.Status == "Completed"
                    )
                    .ToList()
                    .Sum(x => x.TotalPrice);
        }

        return salons;
    }
    public string ApproveSalon(string id)
    {
        var salon = _salonrequests
            .Find(x => x.Id == id)
            .FirstOrDefault();

        if (salon == null)
            return "Salon not found";

        var random = new Random();

        int randomNumber = random.Next(1000, 9999);

        string salonName = salon.SalonName!
            .Replace(" ", "")
            .ToLower();

        string loginEmail =
            $"{salonName}@capsiqueue.com";

        string loginPassword =
            $"capsi{randomNumber}";

        var update = Builders<ApplySalon>.Update
      .Set(x => x.Status, "approved")
      .Set(x => x.IsActive, "active")
      .Set(x => x.LoginEmail, loginEmail)
      .Set(x => x.LoginPassword, loginPassword);

        _salonrequests.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Salon approved successfully";
    }
    public string RejectSalon(string id, string reason)
    {
        var filter = Builders<ApplySalon>.Filter
            .Eq(x => x.Id, id);

        var update = Builders<ApplySalon>.Update
    .Set(x => x.Status, "rejected")
    .Set(x => x.IsActive, "deactive")
    .Set(x => x.RejectReason, reason);

        _salonrequests.UpdateOne(filter, update);

        return "Salon rejected successfully";
    }

    public string ActivateSalon(string id)
    {
        var filter = Builders<ApplySalon>.Filter
            .Eq(x => x.Id, id);

        var update = Builders<ApplySalon>.Update
            .Set(x => x.IsActive, "active");

        _salonrequests.UpdateOne(filter, update);

        return "Salon activated successfully";
    }
    public string DeactivateSalon(string id)
    {
        var filter = Builders<ApplySalon>.Filter
            .Eq(x => x.Id, id);

        var update = Builders<ApplySalon>.Update
            .Set(x => x.IsActive, "deactive");

        _salonrequests.UpdateOne(filter, update);

        return "Salon deactivated successfully";
    }

    public ApplySalon? SalonLogin(
    SalonLogin salon
)
    {
        var existingSalon =
            _salonrequests
            .Find(x =>
                x.LoginEmail ==
                    salon.LoginEmail &&

                x.LoginPassword ==
                    salon.LoginPassword &&

                x.Status == "approved"
            )
            .FirstOrDefault();

        if (existingSalon == null)
            return null;

        return existingSalon;
    }
    public string AddService(
    AddServiceRequest request
)
    {
        var salon =
            _salonrequests
            .Find(x => x.Id == request.SalonId)
            .FirstOrDefault();

        if (salon == null)
            return "Salon not found";

        var service =
            new SalonServiceModel
            {
                ServiceId =
                    ObjectId.GenerateNewId()
                        .ToString(),

                ServiceName =
                    request.ServiceName,

                Duration =
                    request.Duration,

                Price =
                    request.Price
            };

        var update =
            Builders<ApplySalon>.Update
            .Push(x => x.Services, service);

        _salonrequests.UpdateOne(
            x => x.Id == request.SalonId,
            update
        );

        return "Service added successfully";
    }
    public List<SalonServiceModel>
    GetSalonServices(string salonId)
    {
        var salon =
            _salonrequests
                .Find(x => x.Id == salonId)
                .FirstOrDefault();

        if (salon == null)
            return new List<SalonServiceModel>();

        return salon.Services;
    }

    public string EditService(
    string salonId,
    string serviceId,
    AddServiceRequest updatedService
)
    {
        var salon =
            _salonrequests
                .Find(x => x.Id == salonId)
                .FirstOrDefault();

        if (salon == null)
            return "Salon not found";

        var service =
            salon.Services
                .FirstOrDefault(
                    x => x.ServiceId == serviceId
                );

        if (service == null)
            return "Service not found";

        service.ServiceName =
            updatedService.ServiceName;

        service.Duration =
            updatedService.Duration;

        service.Price =
            updatedService.Price;

        var update =
            Builders<ApplySalon>.Update
                .Set(x => x.Services,
                    salon.Services);

        _salonrequests.UpdateOne(
            x => x.Id == salonId,
            update
        );

        return "Service updated successfully";
    }
    public string DeleteService(
        string salonId,
        string serviceId 
        )
    {
        var salon = _salonrequests.Find(x => x.Id == salonId).FirstOrDefault();
        if (salon == null)
            return "salon not found ";
        salon.Services.RemoveAll(
            x => x.ServiceId == serviceId
            );
        var update = Builders<ApplySalon>.Update.Set(x => x.Services, salon.Services);
        _salonrequests.UpdateOne(x => x.Id == salonId, update
            );
        return "service delete successfully";

    }
    public string UpdateSalonProfile(
    string salonId,
    ApplySalon model
)
    {
        var update =
            Builders<ApplySalon>.Update

            .Set(x => x.OwnerName,
                model.OwnerName)

            .Set(x => x.Email,
                model.Email)

            .Set(x => x.Phone,
                model.Phone)

            .Set(x => x.ProfileImage,
                model.ProfileImage);

        _salonrequests.UpdateOne(
            x => x.Id == salonId,
            update
        );

        return "Profile Updated";
    }
    public ApplySalon GetSalonProfile(string id)
    {
        return _salonrequests
       .Find(x => x.Id == id)
       .FirstOrDefault();
    }
    public string ChangeSalonPassword(
    string id,
    ApplySalon model
)
    {
        var salon =
            _salonrequests
                .Find(x => x.Id == id)
                .FirstOrDefault();

        if (salon == null)
            return "Salon not found";

       


        if (
            salon.LoginPassword !=
            model.CurrentPassword
        )
        {
            return "Current password incorrect";
        }

       

        if (
            model.NewPassword !=
            model.ConfirmPassword
        )
        {
            return "New and confirm password do not match";
        }

        

        var update =
            Builders<ApplySalon>.Update
                .Set(
                    x => x.LoginPassword,
                    model.NewPassword
                );

        _salonrequests.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Password updated successfully";
    }
    public string AddGalleryImage(
     AddGalleryImageRequest model
 )
    {
        var update =
            Builders<ApplySalon>.Update
            .Push(
                x => x.GalleryImages,
                model.ImageUrl
            );

        _salonrequests.UpdateOne(
            x => x.Id == model.SalonId,
            update
        );

        return "Image Added";
    }
    public List<string>
GetGalleryImages(string salonId)
    {
        var salon =
            _salonrequests
            .Find(x => x.Id == salonId)
            .FirstOrDefault();

        return salon?.GalleryImages
            ?? new List<string>();
    }
    public SalonDetailsResponse
GetSalonDetails(string salonId)
    {
        var salon =
            _salonrequests
            .Find(x => x.Id == salonId)
            .FirstOrDefault();

        if (salon == null)
        {
            return null;
        }

        var employees =
            _employees
            .Find(x =>
                x.SalonId == salonId &&
                x.Status == "active"
            )
            .ToList();

        var bookings =
            _bookings
            .Find(x =>
                x.SalonId == salonId
            )
            .ToList();

        return new SalonDetailsResponse
        {
            Salon = salon,
            Employees = employees,
            Bookings = bookings,
            GalleryImages =
                salon.GalleryImages
                ?? new List<string>()
        };
    }
    public object CreateSalonByAdmin(
    ApplySalon model
)
    {
        var existing =
            _salonrequests
            .Find(x =>
                x.Email == model.Email
            )
            .FirstOrDefault();

        if (existing != null)
        {
            return "Salon already exists";
        }

        var random = new Random();

        int randomNumber =
            random.Next(1000, 9999);

        string salonName =
            model.SalonName!
            .Replace(" ", "")
            .ToLower();

        string loginEmail =
            $"{salonName}@capsiqueue.com";

        string loginPassword =
            $"capsi{randomNumber}";

        model.Status = "approved";
        model.IsActive = "active";

        model.LoginEmail =
            loginEmail;

        model.LoginPassword =
            loginPassword;

        model.CreatedAt =
            DateTime.UtcNow;

        _salonrequests.InsertOne(
            model
        );

        return new
        {
            Message =
                "Salon Created Successfully",

            LoginEmail =
                loginEmail,

            LoginPassword =
                loginPassword
        };
    }
    public bool UpdateSalon(
    string id,
    ApplySalon model
)
    {
        var update = Builders<ApplySalon>
            .Update
            .Set(x => x.SalonName, model.SalonName)
            .Set(x => x.OwnerName, model.OwnerName)
            .Set(x => x.City, model.City)
            .Set(x => x.Phone, model.Phone)
            .Set(x => x.Email, model.Email)
            .Set(x => x.JoinedYear, model.JoinedYear)
            .Set(x => x.SalonAddress, model.SalonAddress)
            .Set(x => x.SalonDescription, model.SalonDescription)
            .Set(x => x.ProfileImage, model.ProfileImage);

        var result = _salonrequests.UpdateOne(
            x => x.Id == id,
            update
        );

        return result.ModifiedCount > 0;
    }
}