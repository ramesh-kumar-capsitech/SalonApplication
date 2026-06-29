import { Card, Avatar, Tag, Button, Segmented, message, Modal, Radio, Empty } from "antd";
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
import { CancelledError, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthGetbookingsUserId } from "../api/generated/loginsignuphome";
import TextArea from "antd/es/input/TextArea";
import {
    putApiAuthCancelbooking,
} from "../api/generated/loginsignuphome";
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
    // const [bookings, setBookings] = useState([]);
    const authData = JSON.parse(
        localStorage.getItem("persist:auth")!
    );

    const user = JSON.parse(authData.user);

    console.log("USER:", user);

    if (!user?._id) {
        console.log("User not found");
        return;
    }
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["customerBookings",
            user?.id || user?._id],
        queryFn: async () => {
            const res = await getApiAuthGetbookingsUserId(user._id);
            return res.data;
        },
        enabled: !!(user?.id || user?._id)
    })


    const pastBookings = bookings.filter(
        (b: any) =>
            b.status?.toLowerCase() === "completed"
    );
    const cancelbooking = bookings.filter(
        (b: any) =>
            b.status === "Cancelled"
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
    useEffect(() => {
        if (error) {
            message.error(
                "Failed to load bookings"
            );
        }
    }, [error]);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const [selectedBookingId, setSelectedBookingId] = useState("");
    const queryClient = useQueryClient();
    const cancelBookingMutation = useMutation({
        mutationFn: (data: any) => putApiAuthCancelbooking(data),

        onSuccess: () => {
            message.success("Booking cancelled successfully");

            queryClient.invalidateQueries({
                queryKey: ["customerBookings"],
            });

            setOpen(false);
        },

        onError: () => {
            message.error("Something went wrong");
        },
    });
    const handleCancelBooking = () => {
        const finalReason =
            reason === "Other"
                ? otherReason
                : reason;

        cancelBookingMutation.mutate({
            bookingId: selectedBookingId,
            reason: finalReason
        });
    };

    return (
        <div>
            <Modal
                open={open}
                title={<span className="font-[outfit] " >Cancel Booking</span>}
                onCancel={() => setOpen(false)}
                footer={
                    [
                        <Button key="back" onClick={() => {
                            setOpen(false);
                        }}>
                            Keep Booking
                        </Button>,
                        <Button
                            key="submit"
                            danger
                            type="primary"
                            disabled={
                                !reason ||
                                (reason === "Other" && !otherReason.trim())
                            }
                            loading={cancelBookingMutation.isPending}
                            onClick={handleCancelBooking}
                        >
                            Cancel Booking
                        </Button>,
                    ]}
            >
                <p style={{ marginBottom: 15 }}>
                    Why are you cancelling this appointment?
                </p>

                <Radio.Group
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                >
                    <div className="flex flex-col gap-3">
                        <Radio value="Change of plans">
                            Change of plans
                        </Radio>

                        <Radio value="Found another salon">
                            Found another salon
                        </Radio>

                        <Radio value="Booked by mistake">
                            Booked by mistake
                        </Radio>

                        <Radio value="Other">
                            Other
                        </Radio>
                    </div>
                </Radio.Group>

                {
                    reason === "Other" && (
                        <TextArea
                            rows={4}
                            placeholder="Please enter your reason..."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            style={{ marginTop: 15 }}
                        />
                    )
                }
            </Modal >
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
            <div className=" mb-0">
                <Segmented
                    block
                    value={tab}
                    onChange={(val) => settab(val as "upcoming" | "past" | "cancelled")}

                    options={[
                        {
                            label: "Upcoming",
                            value: "upcoming"
                        },
                        {
                            label: "Past",
                            value: "past"
                        }, {
                            label: "Cancelled",
                            value: "cancelled"
                        },
                    ]} rootClassName=" rounded-lg bg-gray-100 lg:w-[22%] md:w-[40%]     font-[Outfit] m-6  " />


            </div>

            {
                tab === "upcoming" && (
                    <div className="m-6 mt-0">

                        {upcomingBookings.length === 0 ? (

                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="font-[outfit]">
                                        No upcoming bookings found
                                    </span>
                                }
                            />

                        ) : (

                            <div className="grid gap-6">

                                {upcomingBookings.map((b: any) => (

                                    <Card
                                        key={b.id}
                                        className="rounded-2xl border font-[Outfit]"
                                        bodyStyle={{ padding: 28 }}
                                    >

                                        <div className="flex items-start justify-between">
                                            <div className="grid  md:flex items-center gap-4">
                                                <div className="md:hidden flex justify-between gap-3 ">
                                                    <Avatar
                                                        size={48}
                                                        src={b.salonImage || undefined}
                                                        className="overflow-hidden"
                                                    >
                                                        {b.salonName?.charAt(0)?.toUpperCase()}
                                                    </Avatar>
                                                    <div>
                                                        <h2 className="font-medium  md:font-semibold m-0">{b.salonName || "N/A"}</h2>

                                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                            <EnvironmentOutlined />
                                                            <span>{b.location || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Avatar
                                                    size={48}
                                                    src={b.salonImage || undefined}
                                                    className="overflow-hidden hidden md:block "
                                                >
                                                    {b.salonName?.charAt(0)?.toUpperCase()}
                                                </Avatar>



                                                <div className="">
                                                    <h2 className="hidden md:block font-medium  md:font-semibold m-0">{b.salonName || "N/A"}</h2>

                                                    <div className="hidden  md:flex items-center gap-1 text-gray-500 text-sm">
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
                                                <div className="md:hidden  text-sm text-gray-500">
                                                    Booking ID:{" "}
                                                    <span className="font-medium text-gray-900">
                                                        {b.id?.slice(-6).toUpperCase()}

                                                    </span>
                                                </div>
                                            </div>

                                            <div className="hidden md:block text-sm text-gray-500">
                                                Booking ID:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {b.id?.slice(-6).toUpperCase()}

                                                </span>
                                            </div>
                                        </div>


                                        <div className="bg-gray-50 rounded-xl p-5 mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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


                                        <div className="md:flex items-center justify-between mt-6" >
                                            <div className=" grid md:flex gap-3">
                                                <Button className="rounded-full">
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    danger
                                                    icon={<span>✕</span>}
                                                    className="rounded-full"
                                                    onClick={() => {
                                                        setSelectedBookingId(b.id);
                                                        setOpen(true);
                                                    }}
                                                >
                                                    Cancel Booking
                                                </Button>
                                            </div>


                                        </div>
                                    </Card>

                                ))}

                            </div>

                        )}

                    </div>
                )
            }
            {
                tab === "past" && (
                    <div className="m-6 mt-0">

                        {pastBookings.length === 0 ? (

                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="font-[outfit]">
                                        No past bookings found
                                    </span>
                                }
                            />

                        ) : (

                            <div className="grid gap-6">

                                {pastBookings.map((b: any) => (
                                    <Card
                                        key={b.id}
                                        className="rounded-2xl border font-[Outfit]"
                                        bodyStyle={{ padding: 28 }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className=" grid  md:flex items-center gap-4">
                                                <div className="md:hidden flex justify-between gap-3 ">
                                                    <Avatar
                                                        size={44}
                                                        className="bg-green-100"
                                                        icon={<CheckCircleFilled className="text-green-500" />}
                                                    />

                                                    <div>
                                                        <h2 className="font-medium  md:font-semibold m-0">{b.salonName || "N/A"}</h2>

                                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                            <EnvironmentOutlined />
                                                            <span>{b.location || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Avatar
                                                    size={44}
                                                    className="bg-green-100 hidden md:block "
                                                    icon={<CheckCircleFilled className="text-green-500" />}
                                                />

                                                <div className="hidden md:block ">
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

                                                <div className="md:hidden text-sm text-gray-500">
                                                    Booking ID:{" "}
                                                    <span className="font-medium text-gray-900">
                                                        {b.id?.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="hidden md:block text-sm text-gray-500">
                                                Booking ID:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {b.id?.slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-5 mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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


                                    </Card>
                                ))}

                            </div>

                        )}

                    </div>
                )
            }
            {
                tab === "cancelled" && (
                    <div className="m-6 mt-0">

                        {cancelbooking.length === 0 ? (

                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span className="font-[outfit]" >Not found Cancel bookings</span>}
                            />

                        ) : (

                            <div className="grid gap-6">
                                {cancelbooking.map((b: any) => (
                                    <Card
                                        key={b.id}
                                        className="rounded-2xl border font-[Outfit]"
                                        bodyStyle={{ padding: 24 }}
                                    >


                                        <div className="flex flex-col md:flex-row md:justify-between gap-5">

                                            <div className="flex gap-4">

                                                <Avatar
                                                    size={50}
                                                    className="bg-red-100 shrink-0"
                                                    icon={
                                                        <span className="text-red-500 text-xl font-bold">
                                                            ✕
                                                        </span>
                                                    }
                                                />

                                                <div>

                                                    <h2 className="font-semibold text-lg">
                                                        {b.salonName || "N/A"}
                                                    </h2>

                                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                        <EnvironmentOutlined />
                                                        {b.location || "N/A"}
                                                    </div>

                                                    <Tag
                                                        color="red"
                                                        className="rounded-full mt-3"
                                                    >
                                                        Cancelled
                                                    </Tag>

                                                </div>

                                            </div>

                                            <div className="text-sm text-gray-500">

                                                Booking ID :

                                                <span className="font-semibold text-gray-900">
                                                    {" "}
                                                    {b.id?.slice(-6).toUpperCase()}
                                                </span>

                                            </div>

                                        </div>

                                        {/* Details */}

                                        <div className="bg-gray-50 rounded-xl p-5 mt-6
        grid grid-cols-2 lg:grid-cols-5 gap-5">

                                            <Detail
                                                icon={<CalendarOutlined />}
                                                label="Booking Date"
                                                value={dayjs(b.date).format("DD MMM YYYY")}
                                            />

                                            <Detail
                                                icon={<ClockCircleOutlined />}
                                                label="Time"
                                                value={b.time}
                                            />

                                            <Detail
                                                label="Duration"
                                                value={
                                                    b.services?.reduce(
                                                        (total: number, s: any) =>
                                                            total + (s.duration || 0),
                                                        0
                                                    ) + " min"
                                                }
                                            />

                                            <Detail
                                                icon={<DollarOutlined />}
                                                label="Amount"
                                                value={`₹${b.totalPrice}`}
                                                valueClass="text-red-500"
                                            />

                                            <Detail
                                                icon={<CalendarOutlined />}
                                                label="Cancelled On"
                                                value={
                                                    b.cancelledAt
                                                        ? dayjs(b.cancelledAt).format(
                                                            "DD MMM YYYY"
                                                        )
                                                        : "-"
                                                }
                                            />

                                        </div>



                                        <div className="mt-6">

                                            <h3 className="text-gray-600 font-medium mb-2">
                                                Cancel Reason
                                            </h3>

                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 break-words">

                                                {b.cancelReason || "No reason provided"}

                                            </div>

                                        </div>



                                        <div className="mt-6">

                                            <h3 className="text-gray-600 font-medium mb-2">
                                                Services
                                            </h3>

                                            <div className="flex flex-wrap gap-2">

                                                {b.services?.length > 0 ? (

                                                    b.services.map(
                                                        (s: any, i: number) => (

                                                            <Tag
                                                                key={i}
                                                                className="rounded-full px-3 py-1"
                                                            >
                                                                {s.name}
                                                            </Tag>

                                                        )
                                                    )

                                                ) : (

                                                    <Tag>No Services</Tag>

                                                )}

                                            </div>

                                        </div>

                                    </Card>
                                ))}
                            </div>

                        )}

                    </div>
                )
            }

        </div >
    )
}

export default MyBookings
