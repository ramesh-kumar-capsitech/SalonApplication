import React, { useEffect, useState } from "react";
import { DatePicker, Dropdown, Empty, Spin } from "antd";
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
    MoreOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthGetallsalons, getApiAuthGetsalonservicesSalonId, getApiAuthGetsalonstaffSalonId, postApiAuthBookappointment } from "../api/generated/loginsignuphome";

const { Title, Text } = Typography;




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
    // const [salons, setsalons] = useState<any[]>([]);
    // const [services, setServices] = useState<any[]>([]);

    const {
        data: salons = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ["salons"],

        queryFn: async () => {

            const res = await getApiAuthGetallsalons()

            return res.data.filter(
                (salon: any) =>
                    salon.status === "approved" &&
                    salon.isActive === "active"
            );
        }
    });
    const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({
        queryKey: [
            "services",
            selectedSalon?.id
        ],

        queryFn: async () => {

            const res = await getApiAuthGetsalonservicesSalonId(selectedSalon.id)

            return res.data;
        },

        enabled: !!selectedSalon
    });
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

    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    const { data: staffList = [], isLoading: staffLoading, error: staffError } = useQuery({
        queryKey: [
            "staffList",
            selectedSalon?.id
        ],

        queryFn: async () => {

            const res = await getApiAuthGetsalonstaffSalonId(selectedSalon.id)

            return res.data;
        },

        enabled: !!selectedSalon
    });

    const createBookingMutation =
        useMutation({

            mutationFn: async () => {

                const authData =
                    JSON.parse(
                        localStorage.getItem(
                            "persist:auth"
                        )!
                    );

                const user =
                    JSON.parse(
                        authData.user
                    );

                if (
                    !user?.id &&
                    !user?._id
                ) {
                    throw new Error(
                        "User not found, please login again"
                    );
                }

                const cleanServices =
                    selectedServices.map(
                        (s) => ({
                            name: s.serviceName,
                            price: s.price,
                            duration: s.duration
                        })
                    );

                const bookingData = {

                    salonId:
                        selectedSalon?.id,

                    salonName:
                        selectedSalon?.salonName,

                    salonImage:
                        selectedSalon?.profileImage,

                    staffId:
                        selectedStaff?.id,

                    staffName:
                        selectedStaff?.fullName,

                    services:
                        cleanServices,

                    location:
                        selectedSalon?.city,

                    date:
                        date?.format
                            ? date.format(
                                "YYYY-MM-DD"
                            )
                            : date,

                    time,

                    totalPrice,

                    userId:
                        user.id ||
                        user._id,

                    customerName:
                        user.name
                };

                const res =
                    await postApiAuthBookappointment(
                        bookingData
                    );

                return {
                    data: res.data,
                    userId:
                        user.id ||
                        user._id
                };
            },

            onSuccess: (
                result
            ) => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "customerBookings",
                        result.userId
                    ]
                });

                message.success(
                    "Booking Confirmed"
                );

                setStep(4);
            },

            onError: (
                err: any
            ) => {

                message.error(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Booking Failed"
                );
            }
        });
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    useEffect(() => {
        if (servicesError) {
            message.error(
                "Failed to load services"
            );
        }
    }, [servicesError]);
    useEffect(() => {
        if (staffError) {
            message.error(
                "Failed to load services"
            );
        }
    }, [staffError]);
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
                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <Spin size="large" />
                                </div>
                            ) : error ? (
                                <Empty description="Failed to load salons" />
                            ) : (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {salons.map((salon) => (
                                        <Card
                                            key={salon.id}
                                            onClick={() => setSelectedSalon(salon)}
                                            className={`cursor-pointer rounded-xl text-center
    ${selectedSalon?.id === salon.id
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : ""
                                                }`}
                                        ><div className="">

                                                <div>
                                                    <h3 className="text-lg font-semibold">{salon.salonName}</h3>
                                                    <p className="text-gray-500">{salon.city}</p>
                                                    {/* <p className="mt-2">⭐ {salon.rating || 4.5}</p> */}


                                                </div>
                                                <Button
                                                    type="primary"
                                                    icon={<EyeOutlined />}
                                                    className="w-full mt-6 rounded-full h-8 text-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/customer/salon-details/${salon.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}

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
                                {
                                    servicesLoading ? (
                                        <div className="flex justify-center py-10">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        services.map((service, index) => (
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
                                                    <strong>{service.serviceName}</strong> — ₹{service.price} (
                                                    {service.duration} min)



                                                </Checkbox>
                                            </Card>
                                        ))
                                    )
                                }
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
                                {
                                    staffLoading ? (
                                        <div className="flex justify-center py-10">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        staffList.map((staff, index) => (
                                            <Card
                                                key={index}
                                                onClick={() => setSelectedStaff(staff)}
                                                className={`cursor-pointer text-center rounded-xl
        ${selectedStaff === staff
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : ""
                                                    }`}
                                            >
                                                <h3 className="text-lg font-semibold">{staff.fullName}</h3>
                                                <p className="text-gray-500">{staff.role}</p>


                                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                                    {staff.skills?.map((skill, i) => (
                                                        <Tag key={i}>{skill}</Tag>
                                                    ))}
                                                </div>
                                            </Card>
                                        ))
                                    )
                                }
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
                            <div className="flex justify-between">  <Button onClick={() => setStep(2)}>Back</Button>
                                <Button
                                    type="primary"
                                    disabled={!date || !time}
                                    loading={
                                        createBookingMutation.isPending
                                    }
                                    onClick={() => createBookingMutation.mutate()}
                                >
                                    Confirm Booking
                                </Button></div>

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
