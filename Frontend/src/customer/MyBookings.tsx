import { Card, Avatar, Tag, Button, Segmented } from "antd";
import dayjs from "dayjs";
import logo from '../assets/images/logo.png'
import {
    EnvironmentOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { useState } from "react";
interface DetailProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
    valueClass?: string;
}
import React from "react";

import {

    CheckCircleFilled,
} from "@ant-design/icons";
import { useEffect } from "react";
import axios from "axios";
const Detail: React.FC<DetailProps> = ({
    icon,
    label,
    value,
    valueClass = "",
}) => {
    return (
        <div>
            <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                {icon && <span className="text-blue-600">{icon}</span>}
                {label}
            </p>
            <p className={`font-medium ${valueClass}`}>
                {value}
            </p>
        </div>
    );
};

const MyBookings = () => {
    const [tab, settab] = useState<"upcoming" | "past">("upcoming")
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const authData = JSON.parse(
            localStorage.getItem("persist:auth")!
        );

        const user = JSON.parse(
            authData.user
        );

        console.log("USER:", user);

        if (!user?._id) {
            console.log("User not found");
            return;
        }

        axios
            .get(`https://localhost:7074/api/auth/getbookings/${user._id}`)
            .then((res) => {
                console.log("BOOKINGS:", res.data);
                setBookings(res.data)
            });
    }, []);
    // const pastBookings = bookings.filter(
    //     (b) => b.status === "Completed"
    // );
    // const upcomingBookings = bookings.filter(
    //     (b) => b.status === "Pending" || b.status === "Confirmed" || b.status === "Rejected" || b.status === "In Progress"
    // );
    const pastBookings = bookings.filter(
        (b: any) =>
            b.status?.toLowerCase() === "completed"
    );

    const upcomingBookings = bookings.filter(
        (b: any) =>
            [
                "pending",
                "confirmed",
                "rejected",
                "in progress"
            ].includes(
                b.status?.toLowerCase()
            )
    );
    return (
        <div>
            <div className="flex items-center justify-between px-3 py-[13px]   ">
                <div>
                    <h1 className="text-lg leading-[0.8] font-semibold text-gray-900 ">
                        My Bookings                   </h1>
                    <p className="text-gray-500 text-sm mt-1 ">
                        view and manage your appointments
                    </p>
                </div>

            </div>

            <hr />
            <div className="m-6 mb-0">
                <Segmented
                    value={tab}
                    onChange={(val) => settab(val as "upcoming" | "past")}

                    options={[
                        {
                            label: "Upcoming",
                            value: "upcoming"
                        },
                        {
                            label: "Past",
                            value: "past"
                        }
                    ]} rootClassName=" rounded-lg bg-gray-100 w-[15%] font-[Outfit]  p-1 m-6 mt-0" />


            </div>
            {tab === "upcoming" && (
                <div className="m-6 mt-0 grid gap-6 ">
                    {upcomingBookings.map((b: any) => (
                        <Card
                            key={b.id}
                            className="rounded-2xl border font-[Outfit]"
                            bodyStyle={{ padding: 28 }}
                        >
                            {/* TOP HEADER */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {/* <Avatar
                                        size={48}
                                        className="overflow-hidden"
                                    >
                                        <img
                                            src={b.salonImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </Avatar> */}

                                    <img
                                        src={b.salonImage}
                                        alt="profile"
                                        className="w-10 h-10 mb-5 rounded-full object-cover"
                                    />

                                    <div>
                                        <h2 className="font-semibold m-0">{b.salonName || "N/A"}</h2>

                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <EnvironmentOutlined />
                                            <span>{b.location || "N/A"}</span>
                                        </div>

                                        <Tag
                                            className="rounded-full mt-2"
                                            color={
                                                b.status?.toLowerCase() === "pending"
                                                    ? "gold"
                                                    : b.status?.toLowerCase() === "rejected"
                                                        ? "red"
                                                        : b.status?.toLowerCase() === "confirmed"
                                                            ? "blue"
                                                            : b.status?.toLowerCase() === "completed"
                                                                ? "green"
                                                                : "default"
                                            }
                                        >
                                            {b.status}
                                        </Tag>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Booking ID:{" "}
                                    <span className="font-medium text-gray-900">
                                        {b.id?.slice(-6).toUpperCase()}

                                    </span>
                                </div>
                            </div>


                            <div className="bg-gray-50 rounded-xl p-5 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Detail
                                    icon={<CalendarOutlined />}
                                    label="Date"
                                    value={dayjs(b.date).format("DD MMM YYYY")}
                                />
                                <Detail
                                    icon={<ClockCircleOutlined />}
                                    label="Time"
                                    value={b.time || "N/A"}
                                />
                                <Detail
                                    label="Duration"
                                    value={
                                        b.services?.reduce((total: number, s: any) => total + (s.duration || 0), 0) + " min"
                                    }
                                />
                                <Detail
                                    icon={<DollarOutlined />}
                                    label="Total Price"
                                    value={`₹${b.totalPrice || 0}`}
                                    valueClass="text-green-600"
                                />
                            </div>


                            <div className="mt-6">
                                <p className="text-gray-500 mb-2">Services:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {b.services?.length > 0 ? (
                                        b.services.map((s: string, i: number) => (
                                            <Tag key={i}>{s.name}</Tag>
                                        ))
                                    ) : (
                                        <Tag>No services</Tag>
                                    )}
                                </div>
                            </div>

                            {/* ACTIONS */}
                            {/* <div className="flex items-center justify-between mt-6" >
                                <div className="flex gap-3">
                                    <Button className="rounded-full">
                                        Reschedule
                                    </Button>
                                    <Button
                                        danger
                                        icon={<span>✕</span>}
                                        className="rounded-full"
                                    >
                                        Cancel Booking
                                    </Button>
                                </div>

                                <Button
                                    type="primary"
                                    className="rounded-full"
                                >
                                    View Details
                                </Button>
                            </div> */}
                        </Card>
                    ))
                    }


                </div >
            )
            }
            {tab === "past" && (
                <div className="m-6 mt-0 grid gap-6">
                    {pastBookings.map((b: any) => (
                        <Card
                            key={b._id}
                            className="rounded-2xl border font-[Outfit]"
                            bodyStyle={{ padding: 28 }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size={44}
                                        className="bg-green-100"
                                        icon={<CheckCircleFilled className="text-green-500" />}
                                    />

                                    <div>
                                        <h2 className="font-semibold m-0">
                                            {b.salonName}
                                        </h2>

                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <EnvironmentOutlined />
                                            <span>{b.location}</span>
                                        </div>

                                        <Tag color="green" className="rounded-full mt-2">
                                            Completed
                                        </Tag>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Booking ID:{" "}
                                    <span className="font-medium text-gray-900">
                                        {b._id?.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Detail
                                    label="Date"
                                    value={dayjs(b.date).format("DD MMM YYYY")}
                                />
                                <Detail label="Time" value={b.time} />
                                <Detail
                                    label="Duration"
                                    value={
                                        b.services?.reduce((t, s) => t + (s.duration || 0), 0) + " min"
                                    }
                                />
                                <Detail
                                    label="Total Paid"
                                    value={`₹${b.totalPrice}`}
                                    valueClass="text-green-600"
                                />
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-500 mb-2">Services:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {b.services?.map((s, i) => (
                                        <Tag key={i}>{s.name}</Tag>
                                    ))}
                                </div>
                            </div>

                            {/* <div className="flex gap-3 mt-6">
                                <Button type="primary" className="rounded-full">
                                    Book Again
                                </Button>
                                <Button className="rounded-full">
                                    Leave Review
                                </Button>
                            </div> */}
                        </Card>
                    ))}
                </div>
            )}
        </div >
    )
}

export default MyBookings
