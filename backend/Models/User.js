

import mongoose from 'mongoose'

const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const UserModal = mongoose.model('users', UserSchema)
const salonschema = new Schema({
    salonname: {
        type: String,
        required: true
    },
    ownername: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    joinedyear: {

        type: String,
        required: true
    },
    staff: {
        type: String,
        required: true
    },
    services: [
        {
            name: String,
            price: Number,
            duration: Number
        }
    ],
    salonaddress: {
        type: String,
        required: true
    },

    salondescription: {
        type: String,
        required: true
    },

}, { timestamps: true })
const SalonModal = mongoose.model('salons', salonschema)
const approvedSalonSchema = new Schema({
    salonname: String,
    ownername: String,
    email: String,
    phone: String,
    city: String,
    salonaddress: String,
    staff: [
        {
            name: String,
            email: String,
            skills: [String],
            experience: String,
            role: String,
        }
    ],
    services: [
        {
            name: String,
            price: Number,
            duration: Number
        }
    ],
    salondescription: String,
    approvedAt: {
        type: Date,
        default: Date.now
    }, loginEmail: {
        type: String
    },
    loginPassword: {
        type: String
    },
    loginEmail: String,
    loginPassword: String,
    credentialsShown: {
        type: Boolean,
        default: false
    }
});
const approvejobapplicationSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApprovedSalon",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    skills: [{
        type: String
    }],

    experience: {
        type: String,
        required: true
    },

    availability: {
        type: String,

        required: true
    },



    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    loginEmail: {
        type: String
    },
    loginPassword: {
        type: String
    },

    credentialsShown: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const rejectedSalonSchema = new Schema({
    salonname: String,
    ownername: String,
    email: String,
    city: String,
    staff: String,
    services: [
        {
            name: String,
            price: Number,
            duration: Number
        }
    ],
    phone: String,
    salonaddress: String,
    salondescription: String,
    rejectedAt: {
        type: Date,
        default: Date.now
    },
    reason: String
});
const deactivateSalon = new Schema({
    salonname: String,
    ownername: String,
    email: String,
    phone: String,
    city: String,
    staff: [],
    services: [
        {
            name: String,
            price: Number,
            duration: Number
        }
    ],
    salonaddress: String,
    salondescription: String,
    approvedAt: {
        type: Date,
        default: Date.now
    }
});
const jobApplication = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApprovedSalon",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    skills: [{
        type: String
    }],

    experience: {
        type: String,
        required: true
    },

    availability: {
        type: String,

        required: true
    },



    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

const RejectedjobapplicationSchema = new mongoose.Schema(
    {
        salonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ApprovedSalon",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        skills: [{
            type: String
        }],

        experience: {
            type: String,
            required: true
        },

        availability: {
            type: String,

            required: true
        },



        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }

    }, {
    timestamps: true
})
const bookingSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "approvedsalons",
        required: true
    },

    salonName: String,
    location: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },


    services: [
        {
            name: String,
            price: Number,
            duration: Number,
            _id: false
        }
    ],

    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "approvejobapplication"

    },

    customerName: {
        type: String,
        required: true
    },
    staffName: String,

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    totalPrice: Number,

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", 'Rejected', "In Progress"],
        default: "Pending"
    }

}, { timestamps: true });

// const contactSchema = new mongoose.Schema(
//     {
//         fullName: {
//             type: String,
//             required: [true, "Full name is required"],
//             trim: true,
//         },

//         email: {
//             type: String,
//             required: [true, "Email is required"],
//             trim: true,
//             lowercase: true,
//             match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//         },

//         subject: {
//             type: String,
//             required: [true, "Subject is required"],
//             trim: true,
//         },

//         message: {
//             type: String,
//             required: [true, "Message is required"],
//             trim: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const Contact = mongoose.model("Contact", contactSchema);

export default UserModal;
const Booking = mongoose.model("bookings", bookingSchema);
const DeactivateSalon = mongoose.model('deactivatesalons', deactivateSalon);
const ApprovedSalon = mongoose.model('approvedsalons', approvedSalonSchema);
const RejectedSalon = mongoose.model('rejectedsalons', rejectedSalonSchema);
const JobApplication = mongoose.model('jobapplication', jobApplication)
const Rejectedjobapplication = mongoose.model('rejectedjobapplication', RejectedjobapplicationSchema)
const ApproveJobApplication = mongoose.model('approvejobapplication', approvejobapplicationSchema)
export { SalonModal, ApprovedSalon, RejectedSalon, DeactivateSalon, JobApplication, ApproveJobApplication, Rejectedjobapplication, Booking };