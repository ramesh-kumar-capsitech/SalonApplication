import React, { useEffect, useState } from "react";
import { DatePicker, Dropdown, Empty, Input, Spin } from "antd";
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
import { getApiAuthGetallsalons, getApiAuthGetbookedslotsStaffIdDate, getApiAuthGetbusinesssettingsSalonId, getApiAuthGetsalonservicesSalonId, getApiAuthGetsalonstaffSalonId, postApiAuthBookappointment } from "../api/generated/loginsignuphome";

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
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());

    };
    const {
        data: salonss = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ["salons"],

        queryFn: async () => {

            const res = await getApiAuthGetallsalons()

            return res.data
        }
    });
    const salons = salonss.filter((salon: any) => {
        const matchesSearch =
            !searchTerm ||
            salon.salonName?.toLowerCase().includes(searchTerm) ||
            salon.ownerName?.toLowerCase().includes(searchTerm) ||
            salon.salonAddress?.toLowerCase().includes(searchTerm) ||
            salon.city?.toLowerCase().includes(searchTerm) ||
            salon.email?.toLowerCase().includes(searchTerm) ||
            salon.phone?.toString().includes(searchTerm);

        return (
            salon.status === "approved" &&
            salon.isActive === "active" &&
            matchesSearch
        );
    });
    const { data: servicess = [], isLoading: servicesLoading, error: servicesError } = useQuery({
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
    const services = servicess.filter((salon: any) => {
        const matchesSearch =
            !searchTerm ||
            salon.serviceName?.toLowerCase().includes(searchTerm) ||
            salon.duration?.toString().includes(searchTerm) ||
            salon.price?.toString().includes(searchTerm);

        return (

            matchesSearch
        );
    });
    const generateTimeSlots = () => {
        const slots = [];

        for (let hour = 9; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {

                if (hour === 20 && minute > 0) break;

                const displayHour =
                    hour > 12 ? hour - 12 : hour;

                const ampm =
                    hour >= 12 ? "PM" : "AM";

                slots.push(
                    `${displayHour}:${minute
                        .toString()
                        .padStart(2, "0")} ${ampm}`
                );
            }
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

    const { data: staffListt = [], isLoading: staffLoading, error: staffError } = useQuery({
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
    const staffList = staffListt.filter((salon: any) => {
        const matchesSearch =
            !searchTerm ||
            salon.fullName?.toLowerCase().includes(searchTerm) ||
            salon.role?.toLowerCase().includes(searchTerm) ||
            salon.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

        return (matchesSearch);
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
                    salonEmail:
                        selectedSalon?.email,
                    salonMobile:
                        selectedSalon?.phone,

                    customerEmail:
                        user.email,

                    customerMobile:
                        user.mobile,
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
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const getBookedSlots = async () => {
        try {
            if (!selectedStaff || !date) return;

            const res =
                await getApiAuthGetbookedslotsStaffIdDate(
                    selectedStaff.id,
                    dayjs(date).format("YYYY-MM-DD")
                );

            setBookedSlots(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getBookedSlots();
    }, [selectedStaff, date]);
    const { data: businessSettings } = useQuery({
        queryKey: ["business-settings", selectedSalon?.id],
        queryFn: () => getApiAuthGetbusinesssettingsSalonId(selectedSalon!.id),
    });
    const disabledDate = (current: Dayjs) => {
        if (!current) return false;


        if (current.isBefore(dayjs().startOf("day"))) {
            return true;
        }


        if (
            businessSettings?.data?.weeklyOffDays?.includes(
                current.format("dddd")
            )
        ) {
            return true;
        }


        if (
            businessSettings?.data?.specialHolidays?.some((holiday) =>
                dayjs(holiday.date).isSame(current, "day")
            )
        ) {
            return true;
        }

        return false;
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
                        className="mb-6"
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
                                <div>
                                    <div>
                                        <Input placeholder="Search salons by name,owner, or location" className='w-[40%] font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100  mb-6 '
                                            onChange={(e) => handleSearch(e.target.value)}
                                            allowClear />
                                    </div>
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
                            <div>
                                <Input placeholder="Search services by name , time , price " className='w-[40%] font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100  mb-6 '
                                    onChange={(e) => handleSearch(e.target.value)}
                                    allowClear />
                            </div>
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
                            <div>
                                <Input placeholder="Search staff by name, role, or skills" className='w-[40%] font-[Outfit] focus:outline-none focus:ring-1 focus:ring-blue-100  mb-6 '
                                    onChange={(e) => handleSearch(e.target.value)}
                                    allowClear />
                            </div>
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
                            <h2 className="text-xl font-semibold mb-6">
                                Select Date & Time
                            </h2>

                            <div className="mb-6">
                                <DatePicker
                                    value={date}
                                    onChange={(d) => setDate(d)}
                                    disabledDate={disabledDate}
                                    className="w-[40%] font-[Outfit]"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                {timeSlots
                                    .filter(
                                        (slot) =>
                                            !bookedSlots.includes(slot) &&
                                            !isPastTime(slot)
                                    )
                                    .map((slot) => (
                                        <Button
                                            key={slot}
                                            type={time === slot ? "primary" : "default"}
                                            onClick={() => setTime(slot)}
                                        >
                                            {slot}
                                        </Button>
                                    ))}
                            </div>

                            <div className="flex justify-between">
                                <Button onClick={() => setStep(2)}>
                                    Back
                                </Button>

                                <Button
                                    type="primary"
                                    disabled={!date || !time}
                                    loading={createBookingMutation.isPending}
                                    onClick={() => createBookingMutation.mutate()}
                                >
                                    Confirm Booking
                                </Button>
                            </div>
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

                    )}
                </div>
            </div>
        </div >
    );
};

export default BookAppointment;
