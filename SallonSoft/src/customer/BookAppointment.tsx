import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
    Card,
    Button,
    Steps,
    Checkbox,
    Tag,
    message,
    Typography,
} from "antd";

import {
    EnvironmentOutlined,
    CalendarOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Navigate } from "react-router-dom";

const { Title, Text } = Typography;

// const salons = [
//     { id: 1, name: "Elite Styles", city: "Manhattan, NY", rating: 4.9 },
//     { id: 2, name: "Glamour Hub", city: "Brooklyn, NY", rating: 4.8 },
//     { id: 3, name: "Beauty Lounge", city: "Queens, NY", rating: 4.7 },
// ];

// const services = [
//     { id: 1, name: "Haircut & Styling", price: 65, duration: 45 },
//     { id: 2, name: "Hair Coloring", price: 145, duration: 120 },
//     { id: 3, name: "Manicure", price: 35, duration: 30 },
// ];



const BookAppointment = () => {
    const [step, setStep] = useState(0);

    const [selectedSalon, setSelectedSalon] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);

    const totalPrice = selectedServices.reduce(
        (sum, s) => sum + s.price,
        0
    );
    const [salons, setsalons] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    useEffect(() => {
        const fetchsalon = async () => {
            try {
                const res = await axios.get("http://localhost:3001/auth/approved-salons");
                if (res.data.success) {
                    setsalons(res.data.data)
                }
            }
            catch (err) {
                message.error("failed to load salons ");
            }
        }
        fetchsalon()
    }, [])
    useEffect(() => {
        if (!selectedSalon) return;

        const fetchServices = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3001/auth/service/${selectedSalon._id}`
                );

                if (res.data.success) {
                    setServices(res.data.data);
                }
            } catch (err) {
                message.error("Failed to load services");
            }
        };

        fetchServices();
    }, [selectedSalon]);
    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i <= 20; i++) {
            const hour = i > 12 ? i - 12 : i;
            const ampm = i >= 12 ? "PM" : "AM";

            slots.push(`${hour}:00 ${ampm}`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const isPastTime = (slot) => {
        if (!date) return false;

        const now = dayjs();
        const selected = dayjs(date);


        if (selected.isSame(now, "day")) {
            const [time, ampm] = slot.split(" ");
            let [hour] = time.split(":");

            hour = parseInt(hour);
            if (ampm === "PM" && hour !== 12) hour += 12;
            if (ampm === "AM" && hour === 12) hour = 0;

            return hour <= now.hour();
        }

        return false;
    };
    const [staffList, setStaffList] = useState<any[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    useEffect(() => {
        if (!selectedSalon) return;

        const fetchStaff = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3001/auth/staff/${selectedSalon._id}`
                );

                if (res.data.success) {
                    setStaffList(res.data.data);
                }
            } catch (err) {
                message.error("Failed to load staff");
            }
        };

        fetchStaff();
    }, [selectedSalon]);

    const handleBooking = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("user", user)
        console.log("USER ID:", user._id);
        if (!user?._id) {
            message.error("User not found, please login again");
            return;
        }
        try {
            const cleanServices = selectedServices.map((s) => ({
                name: s.name,
                price: s.price,
                duration: s.duration
            }));
            const res = await axios.post("http://localhost:3001/auth/book", {
                salonId: selectedSalon._id,
                services: cleanServices,
                staffId: selectedStaff._id,
                staffName: selectedStaff.name,
                salonName: selectedSalon.salonname,
                location: selectedSalon.city,
                date,
                time,
                totalPrice,
                userId: user._id,
                customerName: user.name
            });

            if (res.data.success) {
                message.success("Booking Confirmed ");
                setStep(4);
            }

        } catch (err: any) {
            message.error(err.response?.data?.message || "Booking failed");
        }
    };



    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[13px]   ">
                <div>
                    <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                        Book Your Appointments                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Easy to book your appointments
                    </p>
                </div>

            </div>

            <hr />

            <div>
                <div className="p-10 bg-gray-50 min-h-screen">


                    <Steps
                        current={step}
                        className="mb-10"
                        items={[
                            { title: "Salon" },
                            { title: "Services" },
                            { title: "Staff" },
                            { title: "Date & Time" },
                            { title: "Confirm" },
                        ]}
                    />


                    {step === 0 && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">Choose Your Salon</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {salons.map((salon) => (
                                    <Card
                                        key={salon._id}
                                        onClick={() => setSelectedSalon(salon)}
                                        className={`cursor-pointer rounded-xl text-center
                                        ${selectedSalon?._id === salon._id
                                                ? "border-blue-500 ring-2 ring-blue-200"
                                                : ""
                                            }`}
                                    >
                                        <h3 className="text-lg font-semibold">{salon.salonname}</h3>
                                        <p className="text-gray-500">{salon.city}</p>
                                        <p className="mt-2">⭐ {salon.rating || 4.5}</p>
                                    </Card>
                                ))}
                            </div>

                            <div className="text-right mt-6">
                                <Button
                                    type="primary"
                                    disabled={!selectedSalon}
                                    onClick={() => setStep(1)}
                                >
                                    Continue to Services
                                </Button>
                            </div>
                        </>
                    )}


                    {step === 1 && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">Select Services</h2>

                            <div className="space-y-4">
                                {/* {services.map((service) => (
                                    <Card key={service._id}>
                                        <Checkbox
                                            checked={selectedServices.some((s) => s._id === service._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedServices([...selectedServices, service]);
                                                } else {
                                                    setSelectedServices(
                                                        selectedServices.filter((s) => s._id !== service._id)
                                                    );
                                                }
                                            }}
                                        >
                                            <strong>{service.name}</strong> — ${service.price} (
                                            {service.duration} min)
                                        </Checkbox>
                                    </Card>
                                ))} */}
                                {services.map((service, index) => (
                                    <Card key={index}>
                                        <Checkbox
                                            checked={selectedServices.includes(service)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedServices([...selectedServices, service]);
                                                } else {
                                                    setSelectedServices(
                                                        selectedServices.filter((s) => s !== service)
                                                    );
                                                }
                                            }}
                                        >
                                            <strong> {typeof service === "string" ? service : service.price}</strong>



                                        </Checkbox>
                                    </Card>
                                ))}
                            </div>

                            <div className=" grid gap-4 md:flex justify-between mt-6">
                                <Button onClick={() => setStep(0)}>Back</Button>
                                <Button
                                    type="primary"
                                    disabled={selectedServices.length === 0}
                                    onClick={() => setStep(2)}
                                >
                                    Continue to Date & Time
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">Choose Staff</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {staffList.map((staff, index) => (
                                    <Card
                                        key={index}
                                        onClick={() => setSelectedStaff(staff)}
                                        className={`cursor-pointer text-center rounded-xl
        ${selectedStaff === staff
                                                ? "border-blue-500 ring-2 ring-blue-200"
                                                : ""
                                            }`}
                                    >
                                        <h3 className="text-lg font-semibold">{staff.name}</h3>
                                        <p className="text-gray-500">{staff.role}</p>


                                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                                            {staff.skills?.map((skill, i) => (
                                                <Tag key={i}>{skill}</Tag>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button onClick={() => setStep(1)}>Back</Button>
                                <Button
                                    type="primary"
                                    disabled={!selectedStaff}
                                    onClick={() => setStep(3)}
                                >
                                    Continue to Date & Time
                                </Button>
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>

                            {/* Date Picker */}
                            <div className="mb-6">
                                <DatePicker
                                    value={date}
                                    onChange={(d) => setDate(d)}
                                    disabledDate={(current) =>
                                        current && current < dayjs().startOf("day")
                                    }
                                />
                            </div>

                            {/* Time Slots */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {timeSlots.map((slot) => (
                                    <Button
                                        key={slot}
                                        disabled={isPastTime(slot)}
                                        type={time === slot ? "primary" : "default"}
                                        onClick={() => setTime(slot)}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                type="primary"
                                disabled={!date || !time}
                                onClick={handleBooking}
                            >
                                Confirm Booking
                            </Button>
                        </>
                    )}


                    {step === 4 && (
                        <>
                            <div className="min-h-screen  md:p-6 bg-gray-50 flex flex-col items-center justify-start ">


                                <Title level={2} className="!mb-1 font-[Outfit] ">
                                    Booking Confirmed!
                                </Title>
                                <Text className="text-gray-500 mb-8 font-[Outfit]">
                                    Your appointment has been successfully booked
                                </Text>

                                <Button
                                    type="primary"
                                    className=""
                                    onClick={() => setStep(0)}

                                >
                                    One more booking
                                </Button>
                            </div>

                        </>
                        // <div><p>fghjkl;</p></div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default BookAppointment;
