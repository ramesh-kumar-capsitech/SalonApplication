import UserModal, { SalonModal, ApprovedSalon, RejectedSalon, DeactivateSalon, JobApplication, ApproveJobApplication, Rejectedjobapplication, Booking } from '../Models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export const signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        console.log(name, email, mobile, password)
        const user = await UserModal.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'user is already exist' })
        }
        const userModal = new UserModal({ name, email, mobile, password });
        userModal.password = await bcrypt.hash(password, 10);
        await userModal.save();

        await userModal.save();
        res.status(200)
            .json({
                message: "signup succesfully",
                success: true
            })
    } catch (error) {
        res.status(500)
            .json({
                message: error.message,
                success: false
            })

    }

}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModal.findOne({ email });
        const errormsg = "auth failed  email or password wrong"
        if (!user) {
            return res.status(403)
                .json({
                    message: errormsg,
                    success: false
                })
        }
        const passequal = await bcrypt.compare(password, user.password)
        if (!passequal) {
            return res.status(403)
                .json({
                    message: errormsg,
                    success: false
                })


        }
        const jwttoken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        res.status(200)
            .json({
                message: "login succesfully",
                success: true,
                jwttoken,
                email,
                name: user.name,
                _id: user._id
            })
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                message: "internal server error ",
                success: false

            })
    }

}
export const salonlogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await ApprovedSalon.findOne({
            loginEmail: email
        });

        const errormsg = "auth failed email or password wrong";

        if (!user) {
            return res.status(403).json({
                message: errormsg,
                success: false
            });
        }

        const passequal = password === user.loginPassword

        if (!passequal) {
            return res.status(403).json({
                message: errormsg,
                success: false
            });
        }

        const jwttoken = jwt.sign(
            { email: user.loginEmail, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "login successfully",
            success: true,
            jwttoken,
            email: user.loginEmail,
            name: user.ownername,
            salonId: user._id
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};
export const employeelogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await ApproveJobApplication.findOne({
            loginEmail: email
        });

        const errormsg = "auth failed email or password wrong";

        if (!user) {
            return res.status(403).json({
                message: errormsg,
                success: false
            });
        }

        const passequal = password === user.loginPassword

        if (!passequal) {
            return res.status(403).json({
                message: errormsg,
                success: false
            });
        }

        const jwttoken = jwt.sign(
            { email: user.loginEmail, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "login successfully",
            success: true,
            jwttoken,
            email: user.loginEmail,
            name: user.name,
            staffId: user._id,
            salonId: user.salonId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};

export const Applysalon = async (req, res) => {
    try {
        console.log(req.body)
        const { salonname, ownername, email, phone, joinedyear, city, salonaddress, salondescription, staff, services } = req.body;
        const user = await SalonModal.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'user is already exist' })
        }
        const salonModal = new SalonModal({ salonname, ownername, email, phone, joinedyear, city, salonaddress, salondescription, staff, services });


        await salonModal.save();
        res.status(200)
            .json({
                message: "salon applied succesfully",
                success: true
            })
    } catch (error) {
        res.status(500)
            .json({
                message: error.message,
                success: false
            })

    }
}
export const applyJob = async (req, res) => {
    try {
        const { name, email, phone, role, skills, experience, availability, salonId } = req.body;
        const user = await JobApplication.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'user is already exist' })
        }

        const job = new JobApplication({
            name, email, phone, role, skills, experience, availability, salonId
        })
        await job.save()
        res.json({
            success: true,
            message: " your request sent succesfully "
        })
    }
    catch (error) {
        console.log(error)


        res.status(500).json({
            success: false,
            message: error.message

        })
    }

}
export const checkSalonStatus = async (req, res) => {
    try {
        const { email, lastFiveDigit } = req.body;


        const salon = await SalonModal.findOne({ email });

        if (salon) {
            const dbLastFive = salon.phone.slice(-5);

            if (dbLastFive !== lastFiveDigit) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            return res.json({
                status: "processing"
            });
        }


        const approved = await ApprovedSalon.findOne({ email });

        if (approved) {

            const dbLastFive = approved.phone.slice(-5);

            if (dbLastFive !== lastFiveDigit) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            return res.json({
                status: "approved",
                loginEmail: approved.loginEmail,
                loginPassword: approved.credentialsShown ? null : approved.loginPassword
            });
        }

        return res.status(404).json({
            message: "Salon not found"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const checkJobApplication = async (req, res) => {
    try {
        const { email, lastFiveDigit } = req.body;


        const salon = await JobApplication.findOne({ email });

        if (salon) {
            const dbLastFive = salon.phone.slice(-5);

            if (dbLastFive !== lastFiveDigit) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            return res.json({
                status: "processing"
            });
        }


        const approved = await ApproveJobApplication.findOne({ email });

        if (approved) {

            const dbLastFive = approved.phone.slice(-5);

            if (dbLastFive !== lastFiveDigit) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            return res.json({
                status: "approved",
                loginEmail: approved.loginEmail,
                loginPassword: approved.credentialsShown ? null : approved.loginPassword
            });
        }

        return res.status(404).json({
            message: "Application not found"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAllSalonRequests = async (req, res) => {
    try {
        const salons = await SalonModal.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: salons.length,
            data: salons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salon requests",
            error: error.message
        });
    }
};
// export const approveSalon = async (req, res) => {
//     try {
//         const { id } = req.params;


//         const salon = await SalonModal.findById(id);

//         if (!salon) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Salon not found"
//             });
//         }


//         await ApprovedSalon.create({
//             salonname: salon.salonname,
//             ownername: salon.ownername,
//             city: salon.city,
//             phone: salon.phone,
//             email: salon.email,
//             joinedyear: salon.joinedyear,
//             staff: salon.staff,
//             services: salon.services,
//             salonaddress: salon.salonaddress,
//             salondescription: salon.salondescription
//         });


//         await SalonModal.findByIdAndDelete(id);

//         res.status(200).json({
//             success: true,
//             message: "Salon Approved & Moved Successfully"
//         });

//     } catch (error) {
//         console.log("Error approving salon:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error approving salon"
//         });
//     }
// };
export const approveSalon = async (req, res) => {
    try {
        const { id } = req.params;

        const salon = await SalonModal.findById(id);

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }


        const username = salon.ownername.toLowerCase().replace(/\s/g, "");
        const loginEmail = `${username}@trimtech.com`;


        const loginPassword = "Trim" + Math.floor(1000 + Math.random() * 9000);

        const newApproved = await ApprovedSalon.create({
            salonname: salon.salonname,
            ownername: salon.ownername,
            city: salon.city,
            phone: salon.phone,
            email: salon.email,
            joinedyear: salon.joinedyear,
            staff: [],
            services: salon.services || [],
            salonaddress: salon.salonaddress,
            salondescription: salon.salondescription,


            loginEmail,
            loginPassword
        });

        if (newApproved) {
            await SalonModal.findByIdAndDelete(id);
        }

        res.status(200).json({
            success: true,
            message: "Salon Approved & Credentials Generated"
        });

    } catch (error) {
        console.log("Error approving salon:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// export const approvejobapplication = async (req, res) => {

//     try {
//         const { id } = req.params;
//         const application = await JobApplication.findById(id)
//         if (!application) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Job application not found"
//             });

//         }
//         const username = application.name.toLowerCase().replace(/\s/g, "").replace(/[^a-z0-9]/g, "");

//         const uniqueId = Date.now().toString().slice(-4);

//         const loginEmail = `${username}${uniqueId}@trimtechemp.com`;

//         const loginPassword = "Trim" + Math.floor(1000 + Math.random() * 9000);
//         const newapprovedjobapplication = await ApproveJobApplication.create({
//             salonId: application.salonId,
//             name: application.name,
//             role: application.role,
//             email: application.email,
//             phone: application.phone,
//             skills: application.skills || [],
//             experience: application.experience,
//             availability: application.availability,
//             status: application.status,

//             loginEmail,
//             loginPassword
//         })
//         if (newapprovedjobapplication) {
//             await JobApplication.findByIdAndDelete(id)
//         }
//         res.status(200).json({
//             success: true,
//             message: "JobApplication Approved & Credentials Generated",

//         });
//     }
//     catch (error) {
//         console.log("Error approving salon:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
export const approvejobapplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await JobApplication.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Job application not found"
            });
        }

        const username = application.name.toLowerCase().replace(/\s/g, "").replace(/[^a-z0-9]/g, "");
        const uniqueId = Date.now().toString().slice(-4);

        const loginEmail = `${username}${uniqueId}@trimtechemp.com`;
        const loginPassword = "Trim" + Math.floor(1000 + Math.random() * 9000);

        // ✅ 1. Save in ApproveJobApplication
        const newapprovedjobapplication = await ApproveJobApplication.create({
            salonId: application.salonId,
            name: application.name,
            role: application.role,
            email: application.email,
            phone: application.phone,
            skills: application.skills || [],
            experience: application.experience,
            availability: application.availability,
            status: "approved",
            loginEmail,
            loginPassword
        });


        await ApprovedSalon.findByIdAndUpdate(
            application.salonId,
            {
                $push: {
                    staff: {
                        name: application.name,
                        email: application.email,
                        skills: application.skills || [],
                        experience: application.experience,
                        role: application.role
                    }
                }
            }
        );

        // ✅ 3. Delete from pending
        await JobApplication.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Employee Approved & Added to Salon"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const rejectSalon = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const salon = await SalonModal.findById(id);
        if (!salon) {
            return res.status(404).json({ message: "Salon not found" });
        }

        await RejectedSalon.create({
            salonname: salon.salonname,
            ownername: salon.ownername,
            email: salon.email,
            city: salon.city,
            phone: salon.phone,
            salonaddress: salon.salonaddress,
            salondescription: salon.salondescription,
            staff: salon.staff,
            services: salon.services,
            reason
        });

        await SalonModal.findByIdAndDelete(id);

        res.json({ success: true, message: "Salon Rejected Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error rejecting salon" });
    }
};
export const approvesalons = async (req, res) => {
    try {
        const salons = await ApprovedSalon.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: salons.length,
            data: salons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salon requests",
            error: error.message
        });
    }
}
export const rejectedsalons = async (req, res) => {
    try {
        const salons = await RejectedSalon.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: salons.length,
            data: salons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salon requests",
            error: error.message
        });
    }
}
export const deactivateSalon = async (req, res) => {
    try {
        const { id } = req.params;

        const salon = await ApprovedSalon.findById(id);

        if (!salon) {
            return res.status(404).json({ message: "Salon not found" });
        }

        // Add into deactivate collection
        const newDeactivate = new DeactivateSalon({
            salonname: salon.salonname,
            ownername: salon.ownername,
            email: salon.email,
            phone: salon.phone,
            city: salon.city,
            staff: salon.staff,
            services: salon.services,
            salonaddress: salon.salonaddress,
            salondescription: salon.salondescription
        });

        await newDeactivate.save();

        // Remove from approved
        await ApprovedSalon.findByIdAndDelete(id);

        res.status(200).json({
            message: "Salon Deactivated Successfully",
            status: "inactive"
        });

    } catch (error) {
        res.status(500).json({ message: "Error in deactivation" });
    }
};
export const activateSalon = async (req, res) => {
    try {
        const { id } = req.params;

        const salon = await DeactivateSalon.findById(id);

        if (!salon) {
            return res.status(404).json({ message: "Salon not found" });
        }

        const newApproved = new ApprovedSalon({
            salonname: salon.salonname,
            ownername: salon.ownername,
            email: salon.email,
            phone: salon.phone,
            city: salon.city,
            staff: salon.staff,
            services: salon.services,
            salonaddress: salon.salonaddress,
            salondescription: salon.salondescription
        });

        await newApproved.save();

        await DeactivateSalon.findByIdAndDelete(id);

        res.status(200).json({
            message: "Salon Activated Successfully",
            status: "active"
        });

    } catch (error) {
        res.status(500).json({ message: "Error in activation" });
    }
};
export const deactivesalons = async (req, res) => {
    try {
        const salons = await DeactivateSalon.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: salons.length,
            data: salons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salon requests",
            error: error.message
        });
    }
}
export const allusers = async (req, res) => {
    try {
        const salons = await UserModal.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: salons.length,
            data: salons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salon requests",
            error: error.message
        });
    }
}
export const getSalonJobRequests = async (req, res) => {

    try {

        const salonId = req.params.salonId;

        const jobs = await JobApplication.find({
            salonId
        });

        res.json({
            success: true,
            data: jobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const salonJobRequests = async (req, res) => {

    try {

        const { salonId } = req.params

        const requests = await JobApplication.find({
            salonId
        })

        res.json({
            success: true,
            data: requests
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}

export const salonJobapprove = async (req, res) => {
    try {

        const { salonId } = req.params

        const requests = await ApproveJobApplication.find({
            salonId
        })

        res.json({
            success: true,
            data: requests
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const application = await JobApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        await Rejectedjobapplication.create({
            salonId: application.salonId,
            name: application.name,
            role: application.role,
            email: application.email,
            phone: application.phone,
            skills: application.skills || [],
            experience: application.experience,
            availability: application.availability,
            status: application.status,
            reason
        });

        await JobApplication.findByIdAndDelete(id);

        res.json({ success: true, message: "Job Application Rejected Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error rejecting Job application" });
    }
};
export const services = async (req, res) => {
    try {
        const { salonId } = req.params;

        const salon = await ApprovedSalon.findById(salonId);

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        res.json({
            success: true,
            data: salon.services || []
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
};
export const staff = async (req, res) => {
    try {
        const { salonId } = req.params;

        const salon = await ApprovedSalon.findById(salonId);

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        res.json({
            success: true,
            data: salon.staff || []
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
};
export const createBooking = async (req, res) => {
    try {
        const {
            salonId,
            userId,
            services,
            staffId,
            staffName,
            salonName,
            location,
            date,
            time,
            totalPrice,
            customerName
        } = req.body;


        const existing = await Booking.findOne({
            staffId,
            date,
            time
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This time slot already booked for selected staff"
            });
        }

        const booking = await Booking.create({
            salonId,
            userId,
            services,
            staffId,
            staffName,

            salonName,
            location,
            date,
            time,
            totalPrice,
            customerName
        });

        res.status(200).json({
            success: true,
            message: "Booking Successful",
            data: booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getMyBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const salonbookings = async (req, res) => {
    try {
        const { salonId } = req.params;

        const bookings = await Booking.find({ salonId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

import mongoose from "mongoose";

export const getStaffBookings = async (req, res) => {
    try {
        const { salonId, staffId } = req.params;

        const bookings = await Booking.find({
            salonId: new mongoose.Types.ObjectId(salonId),
            staffId: new mongoose.Types.ObjectId(staffId)
        }).sort({ createdAt: -1 });

        res.send({
            success: true,
            data: bookings
        });
        // console.log("SalonId:", salonId);
        // console.log("StaffId:", staffId);

        const all = await Booking.find({});
        console.log("DB StaffId:", all[0]?.staffId);

    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;


        const validStatus = ["Pending", "Confirmed", "Completed", "Rejected", "In Progress"];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }


        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};