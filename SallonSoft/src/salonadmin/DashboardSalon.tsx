import { DollarOutlined, ScheduleOutlined, ScissorOutlined, TeamOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Avatar, Tag, Table, Dropdown } from "antd";

import { Card, Switch } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import axios from 'axios';
const Dashboard = () => {
    const [services, setServices] = useState([
        { id: 1, name: "Haircut & Styling", duration: "45 min", price: "$65", active: true },
        { id: 2, name: "Hair Coloring", duration: "120 min", price: "$145", active: true },
        { id: 3, name: "Manicure", duration: "30 min", price: "$35", active: true },
        { id: 4, name: "Pedicure", duration: "45 min", price: "$50", active: true },
        { id: 5, name: "Facial Treatment", duration: "60 min", price: "$85", active: false },
        { id: 6, name: "Hair Treatment", duration: "90 min", price: "$120", active: true },
    ]);

    const toggleService = (id: number) => {
        setServices(prev =>
            prev.map(service =>
                service.id === id
                    ? { ...service, active: !service.active }
                    : service
            )
        );
    };
    const staff = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Senior Stylist",
            initials: "SJ",
            status: "Available",
            bookings: 12,
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Colorist",
            initials: "MC",
            status: "Busy",
            bookings: 8,
        },
        {
            id: 3,
            name: "Emma Davis",
            role: "Nail Technician",
            initials: "ED",
            status: "Available",
            bookings: 15,
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Barber",
            initials: "JW",
            status: "Available",
            bookings: 10,
        },
    ];
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

    const [bookings, setBookings] = useState([]);
    useEffect(() => {

        const salon = localStorage.getItem("salonId")
        axios
            .get(`http://localhost:3001/auth/salonbooking/${salon}`)
            .then((res) => {
                if (res.data.success) {
                    setBookings(res.data.data);
                }
            });
    }, []);
    const dataSource = bookings.map((item: any, index) => ({
        key: item._id || index,
        id: item._id?.slice(-6).toUpperCase(),
        customer: item.customerName,
        service: item.services?.map(s => s.name).join(", "),
        time: item.time,
        status: item.status,
    }));
    const updateStatus = async (id, status) => {
        try {
            const res = await axios.put(
                `http://localhost:3001/auth/update-booking/${id}`,
                { status }
            );

            if (res.data.success) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b._id === id ? { ...b, status } : b
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <div className="flex-1  ">

                <div className="flex items-center justify-between px-3 py-[13px]   ">
                    <div>
                        <h1 className="text-lg leading-[0.8] font-semibold text-gray-900">
                            Super Admin Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Platform-wide analytics and management
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <button className=" text-gray-500 px-4 py-2 rounded-full border  font-sm hover:bg-gray-200 transition">
                            Setting
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-sm hover:bg-blue-700 transition">
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
                                $ 3
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
                                100
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
                                150
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
                                12
                            </h2>
                        </div>

                    </div>
                </div>

            </div>
            <div className='flex gap-6  m-6 mt-0'>
                <Card
                    className="rounded-2xl border font-[Outfit]  w-1/2"
                    bodyStyle={{ padding: 28 }}
                >

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Services Management</h2>
                        <p className="text-gray-500 text-sm">
                            Manage your salon services
                        </p>
                    </div>

                    {/* SERVICES LIST */}
                    <div className="space-y-4">
                        {services.map(service => (
                            <div
                                key={service.id}
                                className="border rounded-xl p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-medium">{service.name}</h3>

                                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                                        <span className="flex items-center gap-1">
                                            <ClockCircleOutlined />
                                            {service.duration}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <DollarOutlined />
                                            {service.price}
                                        </span>
                                    </div>
                                </div>

                                <Switch
                                    checked={service.active}
                                    onChange={() => toggleService(service.id)}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card
                    className="rounded-2xl border font-[Outfit]  w-1/2"
                    bodyStyle={{ padding: 28 }}
                >
                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Staff Overview</h2>
                        <p className="text-gray-500 text-sm">
                            Today's staff availability
                        </p>
                    </div>

                    {/* STAFF LIST */}
                    <div className="space-y-4">
                        {staff.map((member) => (
                            <div
                                key={member.id}
                                className="border rounded-xl p-4 flex items-center justify-between"
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="bg-blue-100 text-blue-600">
                                        {member.initials}
                                    </Avatar>

                                    <div>
                                        <p className="font-medium m-0">{member.name}</p>
                                        <p className="text-sm text-gray-500 m-0">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right">
                                    <Tag
                                        color={member.status === "Available" ? "green" : "gold"}
                                        className="rounded-full mb-1"
                                    >
                                        {member.status}
                                    </Tag>

                                    <p className="text-sm text-gray-500 m-0">
                                        {member.bookings} bookings today
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
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
        </div>
    )
}

export default Dashboard
