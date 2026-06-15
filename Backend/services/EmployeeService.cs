using MongoDB.Driver;

public class EmployeeService
{
    private readonly
        IMongoCollection<Employee>
            _employees;

    public EmployeeService()
    {
        var client =
            new MongoClient(
                "mongodb://localhost:27017"
            );

        var db =
            client.GetDatabase("authdb");

        _employees =
            db.GetCollection<Employee>(
                "employees"
            );
    }


    public object AddEmployee(
    Employee employee
)
    {
        var random = new Random();

        int randomNumber =
            random.Next(1000, 9999);

        string employeeName =
            employee.FullName!
                .Replace(" ", "")
                .ToLower();

        string loginEmail =
            $"{employeeName}@capsiqueueemp.com";

        string loginPassword =
            $"capsi{randomNumber}";

        employee.LoginEmail =
            loginEmail;

        employee.LoginPassword =
            loginPassword;

        _employees.InsertOne(employee);

        return new
        {
            message =
                "Employee added successfully",

            loginEmail,

            loginPassword
        };
    }


    public List<object> GetEmployees(string salonId)
    {
        var employees =
            _employees
            .Find(x => x.SalonId == salonId)
            .ToList();

        var bookingCollection =
            new MongoClient("mongodb://localhost:27017")
            .GetDatabase("authdb")
            .GetCollection<BookAppointment>("bookings");

        var result =
            employees.Select(emp =>
            {
                var bookings =
                    bookingCollection
                    .Find(x => x.StaffId == emp.Id)
                    .ToList();

                return new
                {
                    emp.Id,
                    emp.FullName,
                    emp.Role,
                    emp.Email,
                    emp.Phone,
                    emp.Skills,
                    emp.Experience,
                    emp.Availability,
                    emp.Status,
                    emp.CreatedAt,
                    emp.ProfileImage,

                    TodaysBookings =
                        bookings.Count(x =>
                            x.CreatedAt.Date ==
                            DateTime.UtcNow.Date
                        ),

                    TotalBookings =
                        bookings.Count()
                };
            })
            .ToList<object>();

        return result;
    }


    public string DeleteEmployee(
        string id
    )
    {
        _employees.DeleteOne(
            x => x.Id == id
        );

        return "Employee deleted successfully";
    }


    public string EditEmployee(
        string id,
        Employee updatedEmployee
    )
    {
        var update =
            Builders<Employee>.Update

            .Set(x => x.FullName,
                updatedEmployee.FullName)

            .Set(x => x.Role,
                updatedEmployee.Role)

            .Set(x => x.Email,
                updatedEmployee.Email)

            .Set(x => x.Phone,
                updatedEmployee.Phone)

            .Set(x => x.Skills,
                updatedEmployee.Skills)

            .Set(x => x.Experience,
                updatedEmployee.Experience)

            .Set(x => x.Availability,
                updatedEmployee.Availability);

        _employees.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Employee updated successfully";
    }
    public string ToggleEmployeeStatus(
     string id
 )
    {
        var employee =
            _employees
                .Find(x => x.Id == id)
                .FirstOrDefault();

        if (employee == null)
            return "Employee not found";

        string newStatus =
            employee.Status == "active"
                ? "deactive"
                : "active";

        var update =
            Builders<Employee>.Update
                .Set(x => x.Status,
                    newStatus);

        _employees.UpdateOne(
            x => x.Id == id,
            update
        );

        return newStatus;
    }
    public List<Employee> GetSalonStaff(
    string salonId
)
    {
        return _employees
            .Find(x =>
                x.SalonId == salonId &&
                x.Status == "active"
            )
            .ToList();
    }

    public Employee? EmployeeLogin(
    EmployeeLoginRequest model
)
    {
        var employee =
            _employees
            .Find(x =>

                x.LoginEmail ==
                    model.LoginEmail &&

                x.LoginPassword ==
                    model.LoginPassword &&

                x.Status == "active"

            )
            .FirstOrDefault();

        if (employee == null)
            return null;

        return employee;
    }

    public Employee? GetEmployeeProfile(
    string id
)
    {
        return _employees
            .Find(x => x.Id == id)
            .FirstOrDefault();
    }
    public bool UpdateEmployeeProfile(
    string id,
    EmployeeProfileUpdate model
)
    {
        var update =
            Builders<Employee>.Update

            .Set(
                x => x.FullName,
                model.FullName
            )

            .Set(
                x => x.Email,
                model.Email
            )

            .Set(
                x => x.Phone,
                model.Phone
            )

            .Set(
                x => x.ProfileImage,
                model.ProfileImage
            );

        var result =
            _employees.UpdateOne(
                x => x.Id == id,
                update
            );

        return result.ModifiedCount > 0;
    }
    public string ChangeEmployeePassword(
     string id,
     ChangePasswordModel model
 )
    {
        var employee =
            _employees
            .Find(x => x.Id == id)
            .FirstOrDefault();

        if (employee == null)
        {
            return "Employee not found";
        }

        if (employee.LoginPassword != model.CurrentPassword)
        {
            return "Current password is incorrect";
        }

        if (model.NewPassword != model.ConfirmPassword)
        {
            return "Passwords do not match";
        }

        var update =
            Builders<Employee>.Update
            .Set(
                x => x.LoginPassword,
                model.NewPassword
            );

        _employees.UpdateOne(
            x => x.Id == id,
            update
        );

        return "Password Changed";
    }
}