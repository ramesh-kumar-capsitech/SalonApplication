import express from 'express'
import { loginValidation, signupValidation, salonvalidation, salonloginvalidation, applyjobvalidation, employeeloginvalidation } from '../Middleware/AuthValidation.js'
import { Login, signup, Applysalon, checkSalonStatus, getAllSalonRequests, approveSalon, rejectSalon, approvesalons, rejectedsalons, deactivateSalon, activateSalon, deactivesalons, allusers, salonlogin, applyJob, salonJobRequests, approvejobapplication, getSalonJobRequests, salonJobapprove, rejectApplication, checkJobApplication, employeelogin, services, staff, createBooking, getMyBookings, salonbookings, updateBookingStatus, getStaffBookings, addServiceToSalon, deleteServiceFromSalon, editServiceFromSalon, totalbookings, changeSalonPassword, changeSalonPasswordemp, salonprofile, salonprofileupdate } from '../Controllers/AuthControllers.js'
const router = express.Router()

router.post('/signup', signupValidation, signup)
router.post('/login', loginValidation, Login)
router.post('/salonlogin', salonloginvalidation, salonlogin)
router.post('/employeelogin', employeeloginvalidation, employeelogin)
router.post('/applysalon', salonvalidation, Applysalon)
router.post("/check-status", checkSalonStatus);
router.post('/check-jobapplication', checkJobApplication)
router.get("/all-salons-requested", getAllSalonRequests)
router.get("/approved-salons", approvesalons);
router.get("/rejectedsalons", rejectedsalons)
router.put("/approve/:id", approveSalon);
router.put("/approve/jobapplication/:id", approvejobapplication)
router.put("/reject/:id", rejectSalon);
router.put("/reject-application/:id", rejectApplication);

router.put("/deactivate/:id", deactivateSalon);
router.put("/activate/:id", activateSalon);
router.get("/deactive-salons", deactivesalons);
router.get("/users", allusers);
router.post("/apply-job", applyjobvalidation, applyJob);
router.get("/alljobrequest", getSalonJobRequests);
router.get("/salon-job-requests/:salonId", salonJobRequests)
router.get("/job-active-staff/:salonId", salonJobapprove)
router.get("/service/:salonId", services)
router.get('/staff/:salonId', staff)
router.post("/book", createBooking)

router.get("/my-bookings/:userId", getMyBookings);
// router.post("/contactform", Contact);
router.get('/salonbooking/:salonId', salonbookings)
router.get('/staff-bookings/:salonId/:staffId', getStaffBookings)
router.put("/update-booking/:id", updateBookingStatus);
router.post("/add-service/:salonId", addServiceToSalon);
router.post("/delete-service/:salonId/:serviceId", deleteServiceFromSalon);
router.put("/edit-service/:salonId/:serviceId", editServiceFromSalon);
router.get('/totalbookings', totalbookings);
router.put("/salon/change-password/:salonId", changeSalonPassword);
router.put("/employee/change-password/:employeeId", changeSalonPasswordemp);
router.get('/salonprofile/:salonId', salonprofile)
router.put('/salonprofile/:salonId', salonprofileupdate)
export default router