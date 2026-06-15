import { DeleteOutlined, DollarOutlined, EditOutlined, FileAddOutlined, MoreOutlined, ScheduleOutlined, ScissorOutlined, TeamOutlined, WalletOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, Tag, Table, Dropdown, message, Button, Drawer, Form } from "antd";
import { Modal, Input, Select, DatePicker, TimePicker } from "antd";
import { Card, Switch } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddEmployeeDrawer from "../components/AddEmployeeDrawer";
import dayjs from 'dayjs';
import { FaRupeeSign } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const Dashboard = () => {

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "id",
            key: "id",
            render: (text: string) => (
                <span className="font-medium text-gray-900">{text}</span>
            ),
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Service",
            dataIndex: "service",
            key: "service",
            render: (text: string) => (
                <span className="text-gray-600">{text}</span>
            ),
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: " date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: any) => {
                const s = status?.toLowerCase();

                return (
                    <Tag
                        className="rounded-full px-3"
                        color={
                            s === "confirmed"
                                ? "blue"
                                : s === "rejected"
                                    ? "red"
                                    : s === "completed"
                                        ? "green"
                                        : s === "in progress"
                                            ? "gold"
                                            : "default"
                        }
                    >
                        {status}
                    </Tag >
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: "Pending", label: "Pending", disabled: record.status === "Pending" },
                            { key: "Confirmed", label: "Confirmed", disabled: record.status === "Confirmed" },
                            { key: "Completed", label: "Completed", disabled: record.status === "Completed" },
                            { key: "Rejected", label: "Rejected", disabled: record.status === "Rejected" },
                            { key: "In Progress", label: "In Progress", disabled: record.status === "In Progress" },
                        ],
                        onClick: ({ key }) => updateStatus(record.key, key)
                    }}
                >
                    <a className="text-blue-600 font-medium hover:underline">
                        Manage
                    </a>
                </Dropdown>
            ),
        },
    ];


    const authData = JSON.parse(localStorage.getItem("persist:auth")!);
    const user = JSON.parse(authData.user);
    const salon = user.salonId;

    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["bookings", salon],
        queryFn: async () => {
            const res = await axios.get(`https://localhost:7074/api/auth/getbookingsalon/${salon}`)
            return res.data;
        },
        enabled: !!salon
    })


    const dataSource = bookings.map((item: any, index) => ({
        key: item.id || index,
        id: item.id?.slice(-6).toUpperCase(),
        customer: item.customerName?.charAt(0).toUpperCase() +
            item.customerName?.slice(1),
        service: item.services?.map(s => s.name).join(", "),
        time: item.time,
        date: new Date(item.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        status: item.status,
    }));
    const queryClient = useQueryClient();
    const updateStatusMutation = useMutation({
        mutationFn: async ({
            id,
            status
        }:
            {
                id: string;
                status: string;
            }
        ) => {
            const res =
                await axios.put(
                    `https://localhost:7074/api/auth/updatebookingstatus/${id}`,
                    { status }
                );

            return res.data;

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookings", salon]
            });
            message.success("Booking status updated ")
        },
        onError: () => {

            message.error("Failed to update booking status")
        }

    })
    const updateStatus = (
        id: string,
        status: string
    ) => {
        updateStatusMutation.mutate({
            id,
            status
        });
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form, setForm] = useState({
        customerName: "",
        date: "",
        time: "",
        staffId: "",
        services: []
    });
    // const [staffList, setStaffList] = useState<any[]>([]);
    // const [serviceList, setServiceList] = useState<any[]>([]);
    useEffect(() => {

        const authData =
            JSON.parse(
                localStorage.getItem("persist:auth")!
            );

        const user =
            JSON.parse(authData.user);

        const salonId = user.salonId;

        // getServices(salonId);

        // getEmployees(salonId);

    }, []);

    const { data: staffList = [] } = useQuery({
        queryKey: ["staffList", salon],
        queryFn: async () => {
            const res = await axios.get(`https://localhost:7074/api/auth/getemployees/${salon}`)
            return res.data;
        },
        enabled: !!salon
    })

    const { data: serviceList = [] } = useQuery({
        queryKey: ["serviceList", salon],
        queryFn: async () => {
            const res = await axios.get(`https://localhost:7074/api/auth/getsalonservices/${salon}`)
            return res.data;
        },
        enabled: !!salon
    })



    const [isModalOpenser, setIsModalOpenser] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        serviceName: "",
        duration: "",
        price: ""
    });
    const [editingService, setEditingService] = useState(null);

    const addEditServiceMutation = useMutation({

        mutationFn: async () => {

            if (editingService) {

                const res = await axios.put(
                    `https://localhost:7074/api/auth/editservice/${salon}/${editingService.serviceId}`,
                    {
                        serviceName: serviceForm.serviceName,
                        duration: Number(serviceForm.duration),
                        price: Number(serviceForm.price)
                    }
                );

                return res.data;
            }

            const res = await axios.post(
                "https://localhost:7074/api/auth/addservice",
                {
                    salonId: salon,
                    serviceName: serviceForm.serviceName,
                    duration: Number(serviceForm.duration),
                    price: Number(serviceForm.price)
                }
            );

            return res.data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["serviceList", salon]
            });

            message.success(
                editingService
                    ? "Service Updated"
                    : "Service Added"
            );

            setIsModalOpenser(false);

            setEditingService(null);

            setServiceForm({
                serviceName: "",
                duration: "",
                price: ""
            });
        },

        onError: () => {
            message.error("Operation Failed");
        }
    });
    const handleAddService = () => {
        addEditServiceMutation.mutate();
    };
    const deleteServiceMutation = useMutation({

        mutationFn: async (serviceId: string) => {

            const res = await axios.delete(
                `https://localhost:7074/api/auth/deleteservice/${salon}/${serviceId}`
            );

            return res.data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["serviceList", salon]
            });

            message.success("Service Deleted");
        },

        onError: () => {

            message.error(
                "Failed to delete service"
            );
        }
    });
    const [staffForm] = Form.useForm();
    const [openDrawer, setOpenDrawer] = useState(false);


    const employeeMutation = useMutation({

        mutationFn: async (values: any) => {

            if (editingEmployee) {

                const res = await axios.put(
                    `https://localhost:7074/api/auth/editemployee/${editingEmployee.id}`,
                    {
                        fullName: values.fullName,
                        role: values.role,
                        email: values.email,
                        phone: values.phone,
                        skills: values.skills,
                        experience: Number(values.experience),
                        availability: values.availability
                    }
                );

                return res.data;
            }

            const res = await axios.post(
                "https://localhost:7074/api/auth/addemployee",
                {
                    salonId: salon,
                    fullName: values.fullName,
                    role: values.role,
                    email: values.email,
                    phone: values.phone,
                    skills: values.skills,
                    experience: Number(values.experience),
                    availability: values.availability
                }
            );

            return res.data;
        },

        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["staffList", salon]
            });

            message.success(
                editingEmployee
                    ? "Employee Updated"
                    : "Employee Added"
            );

            if (
                !editingEmployee &&
                data?.data
            ) {

                Modal.success({
                    title:
                        "Employee Login Credentials",

                    content: (
                        <div>
                            <p>
                                Login ID:
                            </p>

                            <b>
                                {
                                    data.data.loginEmail
                                }
                            </b>

                            <p className="mt-3">
                                Password:
                            </p>

                            <b>
                                {
                                    data.data.loginPassword
                                }
                            </b>
                        </div>
                    )
                });
            }

            staffForm.resetFields();

            setEditingEmployee(null);

            setOpenDrawer(false);
        },

        onError: () => {

            message.error(
                "Failed to save employee"
            );
        }
    });


    const [editingEmployee, setEditingEmployee] = useState(null);
    const deleteEmployeeMutation =
        useMutation({

            mutationFn: async (
                employeeId: string
            ) => {

                const res =
                    await axios.delete(
                        `https://localhost:7074/api/auth/deleteemployee/${employeeId}`
                    );

                return res.data;
            },

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "staffList",
                        salon
                    ]
                });

                message.success(
                    "Employee Deleted"
                );
            },

            onError: () => {

                message.error(
                    "Failed to delete employee"
                );
            }
        });
    const toggleEmployeeMutation =
        useMutation({

            mutationFn: async (
                employeeId: string
            ) => {

                const res =
                    await axios.put(
                        `https://localhost:7074/api/auth/toggleemployee/${employeeId}`
                    );

                return res.data;
            },

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "staffList",
                        salon
                    ]
                });

                message.success(
                    "Employee Status Updated"
                );
            },

            onError: () => {

                message.error(
                    "Failed to update status"
                );
            }
        });
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] =
        useState(null);

    const [selectedTime, setSelectedTime] =
        useState("");
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
        if (!selectedDate)
            return false;

        const now = dayjs();
        const selected = dayjs(selectedDate);


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
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);


    const [selectedStaff, setSelectedStaff] = useState("");

    const getBookedSlots = async () => {

        try {

            if (
                !selectedStaff ||
                !selectedDate
            ) {
                return;
            }

            const res =
                await axios.get(

                    `https://localhost:7074/api/auth/getbookedslots/${selectedStaff}/${dayjs(selectedDate).format("YYYY-MM-DD")}`

                );

            setBookedSlots(
                res.data
            );

        } catch (err) {

            console.log(err);
        }
    };
    useEffect(() => {

        getBookedSlots();

    }, [
        selectedStaff,
        selectedDate
    ]);
    const [bookingForm] = Form.useForm();

    const createBookingMutation = useMutation({

        mutationFn: async (values: any) => {

            const selectedService =
                serviceList.find(
                    s =>
                        s.serviceId ===
                        values.serviceId
                );

            const selectedStaff =
                staffList.find(
                    s =>
                        s.id ===
                        values.staffId
                );

            const res =
                await axios.post(

                    "https://localhost:7074/api/auth/createsalonbooking",

                    {
                        salonId: salon,

                        salonName:
                            user.salonName,

                        customerName:
                            values.customerName,

                        staffId:
                            values.staffId,

                        staffName:
                            selectedStaff?.fullName,

                        date:
                            dayjs(
                                values.date
                            ).format(
                                "YYYY-MM-DD"
                            ),

                        time:
                            selectedTime,

                        totalPrice:
                            selectedService?.price || 0,

                        services: [
                            {
                                name:
                                    selectedService?.serviceName,

                                price:
                                    selectedService?.price,

                                duration:
                                    selectedService?.duration
                            }
                        ]
                    }
                );

            return res.data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [
                    "bookings",
                    salon
                ]
            });

            message.success(
                "Booking Created"
            );

            setOpen(false);

            bookingForm.resetFields();

            setSelectedTime("");

            setSelectedDate(null);
        },

        onError: (err: any) => {

            message.error(

                err?.response?.data?.message ||

                "Booking Failed"
            );
        }
    });
    return (
        <div>
            <AddEmployeeDrawer
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                // getEmployees={getEmployees}
                editingEmployee={editingEmployee}
                setEditingEmployee={
                    setEditingEmployee
                }
            />

            <Modal
                title={editingService ? "Edit Service" : "Add New Service"}
                open={isModalOpenser}
                onCancel={() => setIsModalOpenser(false)}
                onOk={handleAddService}
            >


                <Input
                    placeholder="Service Name"
                    className="mb-3"
                    value={serviceForm.serviceName}
                    onChange={(e) =>
                        setServiceForm({ ...serviceForm, serviceName: e.target.value })
                    }
                />


                <Input
                    type="number"
                    placeholder="Duration (in minutes)"
                    className="mb-3"
                    value={serviceForm.duration}
                    onChange={(e) =>
                        setServiceForm({ ...serviceForm, duration: e.target.value })
                    }
                />


                <Input
                    type="number"
                    placeholder="Price (₹)"
                    className="mb-3"
                    value={serviceForm.price}
                    onChange={(e) =>
                        setServiceForm({ ...serviceForm, price: e.target.value })
                    }
                />

            </Modal>

            <Drawer
                title="Create Booking"
                placement="right"
                width={500}
                open={open}
                onClose={() => setOpen(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={(values) =>
                        createBookingMutation.mutate(
                            values
                        )
                    }

                    form={bookingForm}
                >
                    <Form.Item
                        label={<span className="font-[Outfit] ">Customer Name</span>}

                        name="customerName"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Service</span>}

                        name="serviceId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            onChange={(value) => {

                                bookingForm.setFieldValue(
                                    "serviceId",
                                    value
                                );
                            }}

                            options={serviceList.map(
                                s => ({
                                    value: s.serviceId,
                                    label: s.serviceName
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Staff</span>}

                        name="staffId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            onChange={(value) => {

                                setSelectedStaff(value);

                            }}

                            options={staffList.map(s => ({
                                value: s.id,
                                label: s.fullName
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-[Outfit] ">Date</span>}
                        name="date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker

                            className="w-full"

                            value={selectedDate}

                            onChange={(d) => {

                                setSelectedDate(d);

                            }}
                        />
                    </Form.Item>
                    <div className="mt-4 mb-4">

                        <label className="font-medium">
                            Select Time
                        </label>

                        <div className="flex flex-wrap gap-3">

                            {timeSlots.map((slot) => {

                                const isBooked =
                                    bookedSlots.includes(slot);

                                return (

                                    <Button

                                        key={slot}

                                        disabled={
                                            isPastTime(slot) ||
                                            isBooked
                                        }

                                        type={
                                            selectedTime === slot
                                                ? "primary"
                                                : "default"
                                        }

                                        onClick={() =>
                                            setSelectedTime(slot)
                                        }
                                    >

                                        {
                                            isBooked
                                                ? `${slot} (Booked)`
                                                : slot
                                        }

                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    {/* <Form.Item
                        label={<span className="font-[Outfit] ">Time</span>}
                        name="time"
                        rules={[{ required: true }]}
                    >
                        <TimePicker
                            className="w-full"
                            format="hh:mm A"
                        />
                    </Form.Item> */}

                    <Button
                        type="primary"

                        htmlType="submit"

                        loading={createBookingMutation.isPending}

                        block
                    >
                        Create Booking
                    </Button>
                </Form>
            </Drawer>
            <div className="flex-1  ">

                <div className="flex items-center justify-between px-3 py-[13px]   ">
                    <div>
                        <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                            Salon Admin Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Platform-wide analytics and management
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <Link to="/salonadmin/settingsalon">
                            <button className=" text-gray-500 px-4 py-2 rounded-full border  font-sm hover:bg-gray-200 transition">
                                Setting
                            </button>
                        </Link>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-sm hover:bg-blue-700 transition"
                            onClick={() => setOpen(true)}>
                            New Booking
                        </button>
                    </div>
                </div>

                <hr />
                <div className='flex justify-evenly w-full gap-6 px-6 my-6 '>
                    <div className=" w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">

                                <DollarOutlined className="text-orange-600" />
                            </div>

                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                ↑ 7.2%
                            </span>
                        </div>


                        <div className="mt-6">
                            <p className="text-gray-500">Today Revenue</p>
                            <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                                ₹ {bookings.filter((b) => b.status === "Completed").reduce((total, b) => total + (b.services?.reduce((sTotal, s) => sTotal + s.price, 0) || 0), 0).toFixed(2)}
                            </h2>
                        </div>

                    </div>
                    <div className="w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <TeamOutlined className="text-green-600" />

                            </div>

                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                ↑ 7.2%
                            </span>
                        </div>


                        <div className="mt-6">
                            <p className="text-gray-500">Staff Members</p>
                            <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                                {staffList.length}
                            </h2>
                        </div>

                    </div>
                    <div className="w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <ScheduleOutlined className="text-yellow-600" />
                            </div>

                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                ↑ 7.2%
                            </span>
                        </div>


                        <div className="mt-6">
                            <p className="text-gray-500">Today Bookings</p>
                            <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                                {bookings.length}
                            </h2>
                        </div>

                    </div>
                    <div className="w-1/4 bg-white rounded-2xl border border-gray-200 p-6">


                        <div className="flex items-start justify-between">

                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <ScissorOutlined className="text-blue-600" />

                            </div>

                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                ↑ 7.2%
                            </span>
                        </div>


                        <div className="mt-6">
                            <p className="text-gray-500">Service</p>
                            <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                                {serviceList.length}
                            </h2>
                        </div>

                    </div>
                </div>

            </div>
            <div className='flex gap-6  m-6 mt-0'>
                <Card
                    className="rounded-2xl border font-[Outfit]  w-1/2 "
                    bodyStyle={{ padding: 28 }}
                >
                    <div className="flex items-center justify-between ">


                        <div className="mb-3">
                            <h2 className="text-lg font-semibold">Services Management</h2>
                            <p className="text-gray-500 text-sm">
                                Manage your salon services
                            </p>
                        </div>
                        <div>
                            <button className="flex items-center gap-1 text-blue-600 font-medium hover:underline "
                                onClick={() => setIsModalOpenser(true)}>

                                Add Service
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {serviceList.map(service => (
                            <div
                                key={service.serviceId}
                                className="border rounded-xl p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-medium">{service.serviceName}</h3>

                                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                                        <span className="flex items-center gap-1">
                                            <ClockCircleOutlined />
                                            {service.duration}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            {/* <FaRupeeSign /> */}
                                            ₹
                                            {service.price}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        setEditingService(service);
                                        setServiceForm({
                                            serviceName: service.serviceName,
                                            duration: service.duration,
                                            price: service.price
                                        });
                                        setIsModalOpenser(true);
                                    }}>
                                        <EditOutlined />
                                    </button>
                                    <button onClick={() =>
                                        deleteServiceMutation.mutate(
                                            service.serviceId
                                        )
                                    }><DeleteOutlined /></button>
                                </div>

                            </div>
                        ))}
                    </div>
                </Card>
                <Card
                    className="rounded-2xl border font-[Outfit]  w-1/2"
                    bodyStyle={{ padding: 28 }}
                >
                    <div className="flex items-center justify-between ">


                        <div className="mb-3">
                            <h2 className="text-lg font-semibold">Staff Overview</h2>
                            <p className="text-gray-500 text-sm">
                                Manage your salon staff
                            </p>
                        </div>
                        <div>
                            <button className="flex items-center gap-1 text-blue-600 font-medium hover:underline "
                                onClick={() => setOpenDrawer(true)}>

                                Add Staff
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {staffList.map((member) => (
                            <div
                                key={member.id}
                                className="border rounded-xl p-4 flex items-center justify-between"
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="bg-blue-100 text-blue-600">
                                        {member.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                    </Avatar>

                                    <div>
                                        <p className="font-medium m-0">{member.fullName}</p>
                                        <p className="text-sm text-gray-500 m-0">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <Tag
                                            color={member.status === "active" ? "green" : "gold"}
                                            className="rounded-full mb-1"
                                        >
                                            {member.status}
                                        </Tag>

                                        <p className="text-sm text-gray-500 m-0">
                                            {/* {member.bookings} bookings today */}
                                        </p>
                                    </div>
                                    <div>
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    {
                                                        key: "edit",
                                                        label: "Edit"
                                                    },
                                                    {
                                                        key: "delete",
                                                        label: "Delete"
                                                    },
                                                    {
                                                        key: "toggle",
                                                        label:
                                                            member.status === "active"
                                                                ? "Deactivate"
                                                                : "Activate"
                                                    }
                                                ],

                                                onClick: ({ key }) => {

                                                    if (key === "edit") {

                                                        setEditingEmployee(member);

                                                        staffForm.setFieldsValue({

                                                            fullName:
                                                                member.fullName,

                                                            role:
                                                                member.role,

                                                            email:
                                                                member.email,

                                                            phone:
                                                                member.phone,

                                                            skills:
                                                                member.skills,

                                                            experience:
                                                                member.experience,

                                                            availability:
                                                                member.availability
                                                        });

                                                        setOpenDrawer(true);
                                                    }

                                                    else if (
                                                        key === "delete"
                                                    ) {

                                                        deleteEmployeeMutation.mutate(
                                                            member.id
                                                        );
                                                    }
                                                    else if (key === "toggle") {

                                                        toggleEmployeeMutation.mutate(
                                                            member.id
                                                        );
                                                    }
                                                }
                                            }}
                                        >

                                            <Button
                                                shape="circle"
                                                icon={<MoreOutlined />}
                                            />

                                        </Dropdown>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div >
            <div className='m-6 mt-0'>
                <Card
                    className="rounded-2xl border font-[Outfit]"
                    bodyStyle={{ padding: 28 }}
                >
                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Today's Bookings</h2>
                        <p className="text-gray-500 text-sm">
                            Manage today's appointments
                        </p>
                    </div>

                    {/* TABLE */}
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Card>
            </div>
        </div >
    )
}

export default Dashboard
